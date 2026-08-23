"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MermaidViewer } from "./MermaidViewer";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock: React.FC<{
  language: string;
  value: string;
}> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  if (language === "mermaid") {
    return <MermaidViewer chart={value} />;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono text-indigo-300 font-medium lowercase">{language || "text"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
        <pre>{value}</pre>
      </div>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content || !content.trim()) {
    return (
      <div className="py-20 text-center text-slate-500">
        <p className="text-sm">No specification content generated yet.</p>
        <p className="text-xs text-slate-600 mt-1">Select a template or enter a prompt on the left to start generation.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h1:text-white prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-3 prose-h2:text-xl prose-h2:text-indigo-200 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-slate-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-code:text-indigo-300 prose-code:bg-indigo-950/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-table:w-full prose-table:border-collapse prose-th:bg-slate-900/80 prose-th:text-slate-200 prose-th:p-3 prose-th:border prose-th:border-slate-800 prose-td:p-3 prose-td:border prose-td:border-slate-800/80 prose-td:text-slate-300 prose-li:text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            const isInline = !match && !String(children).includes("\n");

            if (!isInline) {
              return <CodeBlock language={match ? match[1] : "text"} value={codeText} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 shadow-lg">
                <table className="w-full text-left text-xs text-slate-300">{children}</table>
              </div>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-4 border-indigo-500 bg-indigo-950/20 px-4 py-3 rounded-r-lg text-slate-300 not-italic">
                {children}
              </blockquote>
            );
          },
          input({ type, checked, disabled, ...props }) {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  className="mr-2 h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
