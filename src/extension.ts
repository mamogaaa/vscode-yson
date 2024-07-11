import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");

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

  const formatCommand = (pretty: boolean) => {
    return () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        editor.edit((editBuilder) => {
          // @ts-ignore
          const newText = (pretty ? formatYsonPretty : formatYson)(
            document.getText()
          );
          editBuilder.replace(
            new vscode.Range(
              document.lineAt(0).range.start,
              document.lineAt(document.lineCount - 1).range.end
            ),
            newText
          );
        });
      }
    };
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("yson.format.compact", formatCommand(false))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("yson.format.pretty", formatCommand(true))
  );

  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    "yson",
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        if (document.languageId === "yson") {
          // @ts-ignore
          const newText = formatYsonPretty(document.getText());
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
