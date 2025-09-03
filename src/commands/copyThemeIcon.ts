import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerCopyThemeIconsFromRemoteCommand(
	context: vscode.ExtensionContext
) {
	const command = vscode.commands.registerCommand(
		"unicornclientdev.copyThemeIcon",
		async () => {
			try {
				// 从配置中读取远程目录路径
				const remoteSharePath = commonUtils.getConfiguration(
					"remoteShareDirectory"
				);
				if (!remoteSharePath) {
					commonUtils.showError(
						"RemoteShareDirectory is not configured."
					);
					return;
				}

				// 从配置中读取本地目标目录
				const unicornUnityPath = commonUtils.getConfiguration(
					"unicornUnityDirectory"
				);
				if (!unicornUnityPath) {
					commonUtils.showError(
						"UnicornUnityDirectory is not configured."
					);
					return;
				}
				// 用inputbox让用户输入一个字符串作为theme id
				const themeId = await vscode.window.showInputBox({
					prompt: "Enter the theme ID",
					placeHolder: "e.g. 10070",
				});
				if (!themeId) {
					commonUtils.showError("Theme ID is required.");
					return;
				}

				const IconPath = path.join(
					remoteSharePath,
					`Share-Unicorn/Theme/Theme_icon/${themeId}/image`
				);
				let targetIconPath = path.join(
					unicornUnityPath,
					`Assets/AssetsPackage/ThemeLogoNew/Theme${themeId}Icon/image`
				);
				fileUtils.copyFilesWithExtensions(IconPath, targetIconPath, [
					".png",
					".jpg",
					".jpeg",
					".svg",
				]);
				commonUtils.showInfoMessage(
					`All image files under ${IconPath} have been copied to ${targetIconPath}. Hooray!`
				);
			} catch (error) {
				commonUtils.showError(`Error in copyThemeIcon: ${(error as Error).message}. If you see this error, please check if the source directory exists and is accessible(Open Share-Unicorn in Finder first?). Also, ensure that the target directory exists and is writable.`);
			}
		}
	);

	context.subscriptions.push(command);
}
