import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");

const { Crypto } = require("@peculiar/webcrypto");
global.crypto = new Crypto();

require("./wasm_exec.js");

const wasmFile = fs.readFileSync(path.join(__dirname, "yson_formatter.wasm"));

export async function activate(context: vscode.ExtensionContext) {
  const go: Go = new (globalThis as any).Go();
  const wasmModule = await WebAssembly.instantiate(
    wasmFile,
    // @ts-ignore
    go.importObject
  );
  go.run(wasmModule.instance);

  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    "yson",
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        if (document.languageId === "yson") {
          // @ts-ignore
          const newText = formatYson(document.getText(), {
            asHTML: false,
            format: "yson",
            showDecoded: false,
          });
          return [
            new vscode.TextEdit(
              new vscode.Range(
                document.lineAt(0).range.start,
                document.lineAt(document.lineCount - 1).range.end
              ),
              newText
            ),
          ];
        }
        return [];
      },
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
