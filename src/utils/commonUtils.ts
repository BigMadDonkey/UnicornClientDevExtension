// A utility function to show an information message
import * as vscode from "vscode";

export function showInfoMessage(message: string): void {
    vscode.window.showInformationMessage(message);
}

// A utility function to update a configuration
export async function updateConfiguration(section: string, value: any): Promise<void> {
    const config = vscode.workspace.getConfiguration("unicornclientdev");
    await config.update(section, value, vscode.ConfigurationTarget.Global);
}

// A utility function to get a configuration value
export function getConfiguration(section: string): any {
    const config = vscode.workspace.getConfiguration("unicornclientdev");
    return config.get(section);
}
