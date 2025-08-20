import * as vscode from "vscode";
import * as commonUtils from "../utils/commonUtils";

export function registerSetUnicornUnityDirectoryCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        "unicornclientdev.setUnicornUnityDirectory",
        async () => {
            const uri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false,
                openLabel: "select directory",
            });

            if (uri && uri.length > 0) {
                const selectedPath = uri[0].fsPath;
                await commonUtils.updateConfiguration("unicornUnityDirectory", selectedPath);
                commonUtils.showInfoMessage(`Unicorn Unity Directory set to: ${selectedPath}`);
            } else {
                vscode.window.showWarningMessage("No directory selected.");
            }
        }
    );

    context.subscriptions.push(command);
}
