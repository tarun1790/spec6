"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "markdown",
  readOnly = false
}) => {
  return (
    <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily: "var(--font-mono), Consolas, Monaco, monospace",
          padding: { top: 16, bottom: 16 }
        }}
        loading={
          <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-400 text-xs">
            <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
            <span>Loading Code Editor...</span>
          </div>
        }
      />
    </div>
  );
};
