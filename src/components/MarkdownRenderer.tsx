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
    <div className="my-5 rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-emerald-300 font-semibold lowercase">{language || "text"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[11px] font-medium">Copy</span>
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
      <div className="py-20 text-center text-slate-400">
        <p className="text-sm font-medium">No specification content generated yet.</p>
        <p className="text-xs text-slate-500 mt-1">Select an SDLC template or enter a prompt on the left to start generation.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h1:text-slate-900 prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-3 prose-h2:text-xl prose-h2:text-emerald-800 prose-h2:mt-8 prose-h3:text-lg prose-h3:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-900 prose-code:text-emerald-800 prose-code:bg-emerald-50 prose-code:border prose-code:border-emerald-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-li:text-slate-700">
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
              <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-emerald-50/70 text-emerald-950 font-bold uppercase text-[11px]">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-3 border-b border-slate-200">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 border-b border-slate-100">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-4 border-emerald-500 bg-emerald-50/60 px-5 py-3 rounded-r-2xl text-slate-800 not-italic border border-slate-200/80 shadow-sm">
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
                  className="mr-2 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
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
