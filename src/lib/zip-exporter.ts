import JSZip from "jszip";
import { saveAs } from "file-saver";
import { StageState, STAGES } from "./types";

export async function exportSpecificationZip(
  projectName: string,
  stages: StageState[],
  userPrompt: string,
  techStackSummary?: string
) {
  const zip = new JSZip();
  const sanitizedProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "specflow-specs";

  // Create .specs folder inside zip
  const specsFolder = zip.folder(".specs") || zip;

  // Build master README.md index
  let readmeIndex = `# ${projectName || "Project Specifications"}\n\n`;
  readmeIndex += `> Generated with **SpecFlow AI** Spec-Driven Development Suite on ${new Date().toISOString().split("T")[0]}.\n\n`;

  if (userPrompt) {
    readmeIndex += `## 📋 Initial Requirements\n\n\`\`\`text\n${userPrompt.trim()}\n\`\`\`\n\n`;
  }

  if (techStackSummary) {
    readmeIndex += `## 🛠️ Architecture & Tech Stack\n\n${techStackSummary.trim()}\n\n`;
  }

  readmeIndex += `## 📑 Specification Suite Index\n\n`;
  readmeIndex += `| Stage | Document | Description |\n`;
  readmeIndex += `| :---: | :--- | :--- |\n`;

  // Add each stage file to .specs and the index
  STAGES.forEach((stageDef) => {
    const stageState = stages.find((s) => s.index === stageDef.index);
    const content = stageState?.content || `# ${stageDef.fileName}\n\n*Pending generation.*`;
    
    // Add file to .specs folder
    specsFolder.file(stageDef.fileName, content);

    // Add entry to root README.md index
    readmeIndex += `| **${stageDef.index.toString().padStart(2, "0")}** | [\`${stageDef.fileName}\`](./.specs/${stageDef.fileName}) | ${stageDef.shortDescription} |\n`;
  });

  // Add root README.md
  zip.file("README.md", readmeIndex);

  // Add quickstart setup bash script
  const quickstartScript = `#!/usr/bin/env bash
# Quickstart script to inspect project specifications
echo "=========================================="
echo " ${projectName} Specification Suite"
echo "=========================================="
echo "Available specs in .specs/:"
ls -la .specs/
`;
  zip.file("quickstart.sh", quickstartScript);

  // Generate zip blob and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${sanitizedProjectName}-specs.zip`);
}
