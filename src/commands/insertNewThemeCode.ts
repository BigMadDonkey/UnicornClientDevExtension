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
				// 验证 themeId
				if (!themeId) {
					commonUtils.showError("Theme ID is required.");
					return;
				}

				// 获取 Controller 名称
				let controllerName: string;
				try {
					controllerName = commonUtils.getControllerNameByThemeId(
						themeId,
						unicornUnityPath
					);
				} catch (error) {
					commonUtils.showError((error as Error).message);
					return;
				}

				const themeIdInt = parseInt(themeId);
				// ======= 主要feature1: 在Global_5.lua中插入代码片段 =======

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
				function findInsertLineInGlobal5() {
					const codeSnippet = `    [${themeId}] = function()
        ${controllerName}Ctrl = require "GameTheme.${themeId}.${controllerName}.Controller"
    end,`;
					const global5Content = fs.readFileSync(
						global5Path,
						"utf-8"
					);
					const normalizedGlobal5Content = global5Content.replace(
						/\r\n/g,
						"\n"
					);
					const lines = normalizedGlobal5Content.split("\n");

					// 检查主题 ID 是否已经存在
					const themeIdPattern = new RegExp(
						`\\[${themeId}\\]\\s*=\\s*function\\(\\)`
					);
					const themeExists = lines.some((line) =>
						themeIdPattern.test(line)
					);

					if (themeExists) {
						commonUtils.showInfoMessage(
							`Theme ID ${themeId} already exists in Global_5.lua. No changes made.`
						);
						return;
					}

					console.log("codeSnippet:", codeSnippet);
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
					// console.log("Found insertLine:", insertLine);
					// console.log(
					// 	"normalThemeInsertLinePos:",
					// 	normalThemeInsertLinePos
					// );
					// console.log("igtThemeInsertLinePos:", igtThemeInsertLinePos);
					if (insertLine === -1) {
						insertLine = commonUtils.isValidIGTThemeId(themeId!)
							? igtThemeInsertLinePos
							: normalThemeInsertLinePos;
					}

					// commonUtils.showInfoMessage(
					// 	"Oh Yeah! Ready to insert at " + insertLine
					// );
					fileUtils.insertContentWithEOLDetection(
						global5Path,
						insertLine,
						codeSnippet
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
				}
				findInsertLineInGlobal5();

				// ======= 主要feature2: 在主题Controller.lua中插入代码片段 =======
				const themeName = commonUtils.getThemeNameByThemeId(
					themeId,
					unicornUnityPath
				);
				const themeDir = path.join(
					unicornUnityPath,
					`Assets/LuaScripts/GameTheme/${themeId}/${themeName}`
				);
				const controllerPath = path.join(themeDir, `Controller.lua`);
				if (!fs.existsSync(controllerPath)) {
					commonUtils.showError(
						`${themeId}/${themeName}/Controller.lua file does not exist at path: ${controllerPath}.`
					);
					return;
				}
				async function findInsertLineInController() {
					let fileContent = fs.readFileSync(controllerPath, "utf-8");
					let normalizedContent = fileContent.replace(/\r\n/g, "\n");
					let lines = normalizedContent.split("\n");
					let codeSnippet = `local Base = BaseThemeCtrl`;
					const baseControllerDefinitionLineIndex = lines.findIndex(
						(line) => line.includes(`local Base = BaseThemeCtrl`)
					);
					const controllerDefinitionLineIndex = lines.findIndex(
						(line) =>
							line.includes(
								`local Controller = BaseClass("${themeName}Ctrl", BaseThemeCtrl)`
							)
					);
					if (baseControllerDefinitionLineIndex !== -1) {
						commonUtils.showInfoMessage(
							`BaseThemeCtrl already defined in ${controllerPath}.`
						);
					} else if (
						baseControllerDefinitionLineIndex === -1 &&
						controllerDefinitionLineIndex !== -1
					) {
						fileUtils.insertContentWithEOLDetection(
							controllerPath,
							controllerDefinitionLineIndex + 1, // 插入到controllerDefinitionLineIndex上面那一行
							codeSnippet
						);
					}

					// 添加ProcessLevelUpData定义
					// 先更新fileContent和lines
					fileContent = fs.readFileSync(controllerPath, "utf-8");
					normalizedContent = fileContent.replace(/\r\n/g, "\n");
					lines = normalizedContent.split("\n");
					codeSnippet = `--- ### @override
function Controller:ProcessLevelUpData(data)
    Base.ProcessLevelUpData(self, data)
	-- todo 
end`;
					const processLevelUpDataDefinitionLineIndex = lines.findIndex(
						(line) => line.includes(`function Controller:ProcessLevelUpData(data)`)
					);
					if (processLevelUpDataDefinitionLineIndex !== -1) {
						commonUtils.showInfoMessage(
							`ProcessLevelUpData already defined in ${controllerPath}.`
						);
					} else {
						fileUtils.insertContentWithEOLDetection(
							controllerPath,
							lines.length - 1, // 插入到文件末尾.
							codeSnippet
						);
					}
					const document = await vscode.workspace.openTextDocument(
						controllerPath
					);
					await vscode.window.showTextDocument(document);
				}
				await findInsertLineInController();
				commonUtils.showInfoMessage(
					`Successfully inserted code snippets for theme ${themeId}.`
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
