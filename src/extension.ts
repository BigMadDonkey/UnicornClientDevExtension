// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
// import * as l10n from "@vscode/l10n";
import { registerSetUnicornUnityDirectoryCommand } from "./commands/setUnicornUnityDirectory";
import { registerCopyThemeIconsFromRemoteCommand } from "./commands/copyThemeIcon";
import { registerCopyThemeMiniIconsFromRemoteCommand } from "./commands/copyThemeMiniIcon";
import { registerInsertNewThemeCodeCommand } from "./commands/insertNewThemeCode";
import { registerNewThemeEditProcessorHandlerCommand } from "./commands/newThemeEditProcessorHandler";
import { registerThemeLowResCheckConfigCommand } from "./commands/themeLowResCheckConfig";
import { registerAddGMStarForNewThemeCommand } from "./commands/addGMStarAndNewThemePos";
import * as commonUtils from "./utils/commonUtils";
import { register } from "module";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "unicornclientdev" is now active!'
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand("unicornclientdev.helloWorld", () => {
			commonUtils.showInfoMessage("Hello World from UnicornClientDev!!");
		})
	);

	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = "unicornclientdev.clickStatusBarIem";
	context.subscriptions.push(
		vscode.commands.registerCommand(myCommandId, () => {
			vscode.window.showInformationMessage(`Yeah!`);
		})
	);

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar
	// item always up-to-date
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
	);
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
	);

	// update status bar item once at start
	updateStatusBarItem();

	// comment meaningless hover provider.
	// vscode.languages.registerHoverProvider(
	// 	"lua",
	// 	new (class implements vscode.HoverProvider {
	// 		provideHover(
	// 			_document: vscode.TextDocument,
	// 			_position: vscode.Position,
	// 			_token: vscode.CancellationToken
	// 		): vscode.ProviderResult<vscode.Hover> {
	// 			const commentCommandUri = vscode.Uri.parse(
	// 				`command:editor.action.addCommentLine`
	// 			);
	// 			const contents = new vscode.MarkdownString(
	// 				`[Add comment](${commentCommandUri})`
	// 			);

	// 			// To enable command URIs in Markdown content, you must set the `isTrusted` flag.
	// 			// When creating trusted Markdown string, make sure to properly sanitize all the
	// 			// input content so that only expected command URIs can be executed
	// 			contents.isTrusted = true;

	// 			return new vscode.Hover(contents);
	// 		}
	// 	})()
	// );

	// Register commands
	// Predifined command registration
	registerSetUnicornUnityDirectoryCommand(context);
	registerCopyThemeIconsFromRemoteCommand(context);
	registerCopyThemeMiniIconsFromRemoteCommand(context);
	registerInsertNewThemeCodeCommand(context);
	registerNewThemeEditProcessorHandlerCommand(context);
	registerThemeLowResCheckConfigCommand(context);
	registerAddGMStarForNewThemeCommand(context);
}

let myStatusBarItem: vscode.StatusBarItem;

function updateStatusBarItem(): void {
	myStatusBarItem.text = `$(heart) Activated`;
	myStatusBarItem.show();
}

// This method is called when your extension is deactivated
export function deactivate() {}
