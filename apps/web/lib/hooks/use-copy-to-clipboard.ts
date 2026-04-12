import { useState, useCallback } from "react";

/**
 * Custom hook to copy text to calculation clipboard and manage a "copied" state.
 * 
 * @example
 * const { isCopied, copyToClipboard } = useCopyToClipboard();
 * <button onClick={() => copyToClipboard("Hello!")}>
 *   {isCopied ? "Copied!" : "Copy"}
 * </button>
 */
export function useCopyToClipboard(timeout = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string, id: string = "default") => {
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), timeout);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        setCopiedId(null);
      }
    },
    [timeout],
  );

  return { copiedId, copyToClipboard };
}
