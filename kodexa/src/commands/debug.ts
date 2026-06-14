import * as vscode from "vscode";
import { collectContext } from "../context/contextCollector";
import { KodexaSidebarProvider } from "../providers/KodexaSidebarProvider";

export function registerDebugCommand(
    context: vscode.ExtensionContext
) {
    const disposable = vscode.commands.registerCommand(
        "kodexa.debug",

        async () => {
            try {
               const payload = await collectContext();
               console.log(payload);

               // Send payload to webview for display
               KodexaSidebarProvider.postMessage({
                   command: "showContext",
                   payload
               });

               vscode.window.showInformationMessage("Collected context successfully");
            } catch (err) {
                console.error(err);
                vscode.window.showErrorMessage("Context collection failed");
            }
        }
    );

    context.subscriptions.push(disposable);
}