"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`group/copy relative inline-flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 ${className}`}
      title="Copy to clipboard"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <Copy className="w-4 h-4" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <Check className="w-4 h-4 text-emerald-500" />
      </span>
    </button>
  );
}
