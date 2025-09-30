import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerThemeLowResCheckConfigCommand(
	context: vscode.ExtensionContext
) {
	const command = vscode.commands.registerCommand(
		"unicornclientdev.themeLowResCheckConfig",
		async () => {
			try {
				// 从配置中读取本地Unity项目目录
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

				// 获取主题名称
				// let themeName: string;
				// try {
				// 	themeName = commonUtils.getThemeNameByThemeId(
				// 		themeId,
				// 		unicornUnityPath
				// 	);
				// } catch (error) {
				// 	commonUtils.showError((error as Error).message);
				// 	return;
				// }

				// 0. 判断是否为IGT主题
				if (commonUtils.isValidIGTThemeId(themeId)) {
					commonUtils.showInfoMessage("IGT主题无需配置低特效");
					return;
				}

				const themeIdInt = parseInt(themeId);

				// 1. 读取Config.lua文件
				const configPath = path.join(
					unicornUnityPath,
					"Assets/LuaScripts/Global/Config.lua"
				);

				if (!fs.existsSync(configPath)) {
					commonUtils.showError(
						`Config.lua file does not exist at path: ${configPath}`
					);
					return;
				}

				const configContent = fs.readFileSync(configPath, "utf-8");
				const lines = configContent.split(/\r?\n/);

				// 2. 查找是否已存在配置
				const targetConfig = `theme${themeId} = "1"`;
				const existingLineIndex = lines.findIndex((line) =>
					line.includes(targetConfig)
				);

				let configExists = false;
				if (existingLineIndex !== -1) {
					configExists = true;
					commonUtils.showInfoMessage(
						`Theme ${themeId} low-res config already exists at line ${
							existingLineIndex + 1
						}`
					);
				} else {
					// 3. 如果配置不存在，寻找插入位置并插入
					let insertLineIndex = -1;

					// 3.1 查找themeID+1到themeID+50中最小的一个
					for (let i = themeIdInt + 1; i <= themeIdInt + 50; i++) {
						const nextThemePattern = `theme${i} = "1"`;
						const foundIndex = lines.findIndex((line) =>
							line.includes(nextThemePattern)
						);
						if (foundIndex !== -1) {
							insertLineIndex = foundIndex;
							break;
						}
					}

					// 3.2 如果没找到，查找所有theme配置的最后一行
					if (insertLineIndex === -1) {
						const themePattern = /theme\d+ = "1"/;
						let lastThemeLineIndex = -1;

						for (let i = 0; i < lines.length; i++) {
							if (themePattern.test(lines[i])) {
								lastThemeLineIndex = i;
							}
						}

						if (lastThemeLineIndex !== -1) {
							insertLineIndex = lastThemeLineIndex + 1;
						} else {
							// 如果完全没有theme配置，插入到文件末尾
							// insertLineIndex = lines.length;
							commonUtils.showError(
								"Ah shit, there must be something wrong."
							);
							return;
						}
					}

					// 4. 插入新配置
					try {
						fileUtils.insertContentWithEOLDetection(
							configPath,
							insertLineIndex + 1,
							`    theme${themeId} = "1",`
						);

						commonUtils.showInfoMessage(
							`Successfully added low-res config for theme ${themeId} at line ${
								insertLineIndex + 1
							}`
						);
					} catch (insertError) {
						commonUtils.showError(
							`Failed to insert config: ${
								(insertError as Error).message
							}`
						);
						return;
					}
				}

				// 5. 检查theme_config.lua中的support_low_win配置
				const themeConfigPath = path.join(
					unicornUnityPath,
					"Assets/LuaScripts/Config/theme_config.lua"
				);

				if (!fs.existsSync(themeConfigPath)) {
					commonUtils.showError(
						`theme_config.lua file does not exist at path: ${themeConfigPath}`
					);
					return;
				}

				const themeConfigContent = fs.readFileSync(themeConfigPath, "utf-8");
				const themeConfigLines = themeConfigContent.split(/\r?\n/);

				// 查找包含[${themeId}]的行
				const themeConfigLineIndex = themeConfigLines.findIndex(line =>
					line.includes(`[${themeId}]`)
				);

				if (themeConfigLineIndex === -1) {
					commonUtils.showWarning(
						`Theme ${themeId} configuration not found in theme_config.lua`
					);
					return;
				}

				// 在该行中查找support_low_win配置
				const themeConfigLine = themeConfigLines[themeConfigLineIndex];
				const supportLowWinMatch = themeConfigLine.match(/support_low_win\s*=\s*(\d)/);
				
				if (supportLowWinMatch) {
					const supportValue = supportLowWinMatch[1];
					
					if (supportValue === "1") {
						commonUtils.showInfoMessage(
							`Theme ${themeId} support_low_win configuration is correct (value: 1)`
						);
					} else if (supportValue === "0") {
						commonUtils.showWarning(
							`theme_config中support_low_win为0，是否忘记修改配表？`
						);
					} else {
						commonUtils.showWarning(
							`Theme ${themeId} support_low_win has unexpected value: ${supportValue}`
						);
					}
				} else {
					commonUtils.showWarning(
						`support_low_win configuration not found for theme ${themeId} in theme_config.lua`
					);
				}
			} catch (error) {
				commonUtils.showError(
					`Error in themeLowResCheckConfig: ${
						(error as Error).message
					}`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
