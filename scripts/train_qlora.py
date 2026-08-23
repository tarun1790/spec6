"""
SpecFlow AI: QLoRA Fine-Tuning Pipeline for SDLC Spec Generation
Target Base Model: unsloth/Llama-3.3-70B-Instruct-bnb-4bit
Execution: GPU / CUDA Accelerated
"""

import os
import json
import torch
from datasets import Dataset

# 1. GPU / CUDA Device Verification
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"==================================================")
print(f"SpecFlow AI Model Training Pipeline")
print(f"Compute Device: {device}")
if torch.cuda.is_available():
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
    print(f"VRAM Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
print(f"==================================================")

def load_training_corpus(file_path: str) -> Dataset:
    """Loads and formats the JSONL SDLC specification dataset into training prompts."""
    records = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            item = json.loads(line)
            prompt = item.get("prompt", "")
            stages = item.get("target_stages", {})
            
            # Format combined instruction text
            full_spec_text = (
                f"### System Prompt:\nYou are a Principal Software Architect. Generate a complete 6-stage SDLC specification suite.\n\n"
                f"### User Requirements:\n{prompt}\n\n"
                f"### Output Specification Suite:\n"
            )
            for stage_name, stage_content in stages.items():
                full_spec_text += f"\n\n==== {stage_name} ====\n{stage_content}"
            
            records.append({"text": full_spec_text})
    
    return Dataset.from_list(records)

def main():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "train_sdlc_specs.jsonl")
    dataset = load_training_corpus(dataset_path)
    print(f"Loaded {len(dataset)} training examples from {dataset_path}")

    # Hyperparameters
    max_seq_length = 8192
    learning_rate = 2e-4
    batch_size = 2
    grad_accum_steps = 8
    num_train_epochs = 3

    print("\nTraining Configuration:")
    print(f"- Max Sequence Length: {max_seq_length} tokens")
    print(f"- Learning Rate: {learning_rate}")
    print(f"- Effective Batch Size: {batch_size * grad_accum_steps}")
    print(f"- Epochs: {num_train_epochs}")
    print(f"- LoRA Rank: 32, LoRA Alpha: 64")
    print(f"- Target Modules: q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj")

    try:
        from unsloth import FastLanguageModel
        from trl import SFTTrainer
        from transformers import TrainingArguments

        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name="unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
            max_seq_length=max_seq_length,
            dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
            load_in_4bit=True,
        )

        model = FastLanguageModel.get_peft_model(
            model,
            r=32,
            target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
            lora_alpha=64,
            lora_dropout=0.05,
            bias="none",
            use_gradient_checkpointing="unsloth",
            random_state=42,
        )

        training_args = TrainingArguments(
            per_device_train_batch_size=batch_size,
            gradient_accumulation_steps=grad_accum_steps,
            warmup_ratio=0.05,
            num_train_epochs=num_train_epochs,
            learning_rate=learning_rate,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=10,
            optim="adamw_8bit",
            weight_decay=0.01,
            lr_scheduler_type="cosine",
            seed=42,
            output_dir="./outputs/specflow-sdlc-70b",
        )

        trainer = SFTTrainer(
            model=model,
            tokenizer=tokenizer,
            train_dataset=dataset,
            dataset_text_field="text",
            max_seq_length=max_seq_length,
            dataset_num_proc=2,
            packing=False,
            args=training_args,
        )

        print("\nStarting GPU-accelerated QLoRA training run...")
        trainer.train()

        output_dir = "./models/specflow-sdlc-lora"
        model.save_pretrained(output_dir)
        tokenizer.save_pretrained(output_dir)
        print(f"\nModel training complete! Saved adapters to {output_dir}")

    except ImportError:
        print("\n[Note] Unsloth / TRL not installed in local environment.")
        print("To execute on your GPU cluster, install requirements via:")
        print("  pip install unsloth torch trl transformers datasets bitsandbytes")

if __name__ == "__main__":
    main()
