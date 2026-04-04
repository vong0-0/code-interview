import { type Monaco } from "@monaco-editor/react";

export const ATOM_ONE_DARK_NAME = "atom-one-dark";
export const CLAUDE_LIGHT_NAME = "claude-light";

const ATOM_ONE_DARK_THEME = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "5c6370", fontStyle: "italic" },
    { token: "keyword", foreground: "c678dd" },
    { token: "operator", foreground: "56b6c2" },
    { token: "string", foreground: "98c379" },
    { token: "number", foreground: "d19a66" },
    { token: "function", foreground: "61afef" },
    { token: "variable", foreground: "e06c75" },
    { token: "type", foreground: "e5c07b" },
    { token: "constant", foreground: "d19a66" },
  ],
  colors: {
    "editor.background": "#282c34",
    "editor.foreground": "#abb2bf",
    "editorLineNumber.foreground": "#4b5263",
    "editorLineNumber.activeForeground": "#abb2bf",
    "editor.selectionBackground": "#3e4451",
    "editor.lineHighlightBackground": "#2c313a",
    "editorCursor.foreground": "#528bff",
    "editorWhitespace.foreground": "#3b4048",
  },
};

const CLAUDE_LIGHT_THEME = {
  base: "vs" as const,
  inherit: true,
  rules: [
    { token: "comment", foreground: "8c8c8c", fontStyle: "italic" },
    { token: "keyword", foreground: "d97757" }, // Terracotta
    { token: "operator", foreground: "5b8ab0" }, // Mid Blue
    { token: "string", foreground: "5d7b5d" }, // Moss Green
    { token: "number", foreground: "b37d5d" },
    { token: "function", foreground: "5b8ab0" },
    { token: "variable", foreground: "1f1e1d" },
    { token: "type", foreground: "7a6d5a" },
    { token: "constant", foreground: "d97757" },
  ],
  colors: {
    "editor.background": "#FAF9F5",
    "editor.foreground": "#1f1e1d",
    "editorLineNumber.foreground": "#c0beb4",
    "editorLineNumber.activeForeground": "#1f1e1d",
    "editor.selectionBackground": "#efeadd",
    "editor.lineHighlightBackground": "#f5f3ee",
    "editorCursor.foreground": "#1f1e1d",
    "editorWhitespace.foreground": "#e0ded4",
  },
};

export function registerThemes(monaco: Monaco) {
  monaco.editor.defineTheme(ATOM_ONE_DARK_NAME, ATOM_ONE_DARK_THEME);
  monaco.editor.defineTheme(CLAUDE_LIGHT_NAME, CLAUDE_LIGHT_THEME);
}
