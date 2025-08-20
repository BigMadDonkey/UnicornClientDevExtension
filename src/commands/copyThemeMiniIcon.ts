import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerCopyThemeMiniIconsFromRemoteCommand(
	context: vscode.ExtensionContext
) {
	const command = vscode.commands.registerCommand(
		"unicornclientdev.copyThemeMiniIcon",
		async () => {
			try {
				// 从配置中读取远程目录路径
				const remoteSharePath = commonUtils.getConfiguration(
					"remoteShareDirectory"
				);
				if (!remoteSharePath) {
					vscode.window.showErrorMessage(
						"RemoteShareDirectory is not configured."
					);
					return;
				}
				const miniIconPath = path.join(
					remoteSharePath,
					"Share-Unicorn/UI/System/CommonTheme/icons/theme"
				);

				// 从配置中读取本地目标目录
				const unicornUnityPath = commonUtils.getConfiguration(
					"unicornUnityDirectory"
				);
				if (!unicornUnityPath) {
					vscode.window.showErrorMessage(
						"UnicornUnityDirectory is not configured."
					);
					return;
				}
				let targetIconPath = path.join(
					unicornUnityPath,
					"Assets/AssetsPackage/Common/CommonIcons"
				);

				// 用inputbox让用户输入一个字符串作为theme id
				const themeId = await vscode.window.showInputBox({
					prompt: "Enter the theme ID",
					placeHolder: "e.g. 10070",
				});
				if (!themeId) {
					vscode.window.showErrorMessage("Theme ID is required.");
					return;
				}
				// themeId < 10200时，用theme
				// themeId >= 10200 <= 12000时，用theme2
				// themeId > 12000时，用theme3

				let themeFolder = "theme";
				if (parseInt(themeId) >= 10200 && parseInt(themeId) <= 12000) {
					themeFolder = "theme2";
				} else if (parseInt(themeId) > 12000) {
					themeFolder = "theme3";
				}
				targetIconPath = path.join(targetIconPath, themeFolder);

				const test_dir = path.join(remoteSharePath, "Share-Unicorn");
				if (!fs.existsSync(test_dir)) {
					// vscode.window.showErrorMessage(
					// 	"Target directory does not exist or is not accessible."
					// );
					console.log(`Source file does not exist: ${test_dir}`);
					return false;
				}

				let path_suffix = [`lang_en`, `lang_jp`, `lang_zhtw`];
				let result = [];
				for (let i = 0; i < path_suffix.length; i++) {
					const sourcePath = path.join(
						miniIconPath,
						`${path_suffix[i]}/${themeId}.png`
					);
					const targetPath = path.join(
						targetIconPath,
						`${path_suffix[i]}/${themeId}_2.png`
					);
					result.push(
						fileUtils.copyFileFromUrl(sourcePath, targetPath)
					);
				}
				if (result.includes(true)) {
					commonUtils.showInfoMessage(
						`😊Copy operation completed: copied to ${themeFolder} .\n
						${(result[0] && path_suffix[0]) || ""} ${(result[1] && path_suffix[1]) || ""} ${
							(result[2] && path_suffix[2]) || ""
						} files copied.\n
						Remember to open in Unity to generate .meta file first!`
					);
				} else {
					vscode.window.showErrorMessage(
						"No files copied. Maybe Share-Unicorn is not attached to your Finder? Or the file doesn't exist?"
					);
				}
			} catch (error) {
				vscode.window.showErrorMessage(
					`Error: ${(error as Error).message}`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
