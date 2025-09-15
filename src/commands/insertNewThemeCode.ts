import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerInsertNewThemeCodeCommand(
	context: vscode.ExtensionContext
) {
	// todo: 读取指定id的新主题目录，查看文件名，得知Controller的命名，然后在Global_5.lua中插入代码片段.
	const command = vscode.commands.registerCommand(
		"unicornclientdev.insertNewThemeCode",
		async () => {
			try {
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
				const themeIdInt = parseInt(themeId || "0");
				if (!themeId || themeIdInt <= 0) {
					commonUtils.showError("Theme ID is illegal.");
					return;
				}
				const themeConfigPath = path.join(
					unicornUnityPath,
					`Assets/LuaScripts/GameTheme/${themeId}/Theme.lua`
				);
				if (!fs.existsSync(themeConfigPath)) {
					commonUtils.showError(
						`Theme configuration file does not exist at path: ${themeConfigPath}. Maybe you haven't run new SlotTheme command from Unity Editor yet?`
					);
					return;
				}
				const themeConfigContent = fs.readFileSync(
					themeConfigPath,
					"utf-8"
				);
				const controllerMatch = themeConfigContent.match(
					/MAIN_NAME\s*=\s*"([^"]+)"/
				);
				if (!controllerMatch || controllerMatch.length < 2) {
					commonUtils.showError(
						`Could not find Controller definition in Theme.lua at path: ${themeConfigPath}.`
					);
					return;
				}
				const controllerName = controllerMatch[1];
				const codeSnippet = `    [${themeId}] = function()
        ${controllerName}Ctrl = require "GameTheme.${themeId}.${controllerName}.Controller"
    end,`;
				// todo: 在Global_5.lua中插入代码片段
				const global5Path = path.join(
					unicornUnityPath,
					`Assets/LuaScripts/Global/Global_5.lua`
				);
				if (!fs.existsSync(global5Path)) {
					commonUtils.showError(
						`Global_5.lua file does not exist at path: ${global5Path}.`
					);
					return;
				}
				const global5Content = fs.readFileSync(global5Path, "utf-8");
				const normalizedGlobal5Content = global5Content.replace(
					/\r\n/g,
					"\n"
				);
				console.log("codeSnippet:", codeSnippet);
				if (normalizedGlobal5Content.includes(codeSnippet)) {
					commonUtils.showInfoMessage(
						`The code snippet for theme ID ${themeId} already exists in Global_5.lua. No changes made.`
					);
					return;
				}
				// 找到“-- IGT Theme”的所在行，以及文件的倒数第二行
				const lines = normalizedGlobal5Content.split("\n");
				let insertLine = -1;
				let normalThemeInsertLinePos = lines.length - 1; // 正常主题插入位置,即-- IGT Theme上两行
				let igtThemeInsertLinePos = lines.length - 1; // 倒数第二行的索引
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].includes("-- IGT Theme")) {
						normalThemeInsertLinePos = i;
						break;
					}
				}
				// 从themeIdInt开始+50的范围内，找到第一个存在的theme id的所在行，插入到它上面一行；否则插入到normalThemeInsertLinePos或者igtThemeInsertLinePos。
				for (let i = themeIdInt; i < themeIdInt + 50; i++) {
					const themeIdLineIndex = lines.findIndex((line) =>
						line.includes(`[${i}] = function()`)
					);
					if (themeIdLineIndex !== -1) {
						insertLine = themeIdLineIndex + 1;
						break;
					}
				}
				console.log("Found insertLine:", insertLine);
				console.log("normalThemeInsertLinePos:", normalThemeInsertLinePos);
				console.log("igtThemeInsertLinePos:", igtThemeInsertLinePos);
				if (insertLine === -1) {
					insertLine = commonUtils.isValidIGTThemeId(themeId)
						? igtThemeInsertLinePos
						: normalThemeInsertLinePos;
				}

				commonUtils.showInfoMessage(
					"Oh Yeah! Ready to insert at " + insertLine
				);
				fileUtils.insertContentWithEOLDetection(
					global5Path,
					codeSnippet,
					insertLine
				);
				vscode.commands.executeCommand(
					"vscode.openFolder",
					vscode.Uri.file(
						path.join(
							unicornUnityPath,
							`Assets/LuaScripts/Global/Global_5.lua`
						)
					),
					{ forceNewWindow: false }
				);
			} catch (error) {
				commonUtils.showError(
					`Error in insertNewThemeCode: ${(error as Error).message}.`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
