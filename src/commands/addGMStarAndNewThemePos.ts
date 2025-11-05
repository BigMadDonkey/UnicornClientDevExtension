import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerAddGMStarForNewThemeCommand(
	context: vscode.ExtensionContext
) {
	
	const command = vscode.commands.registerCommand(
		"unicornclientdev.addGMStarAndNewThemePos",
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

				// 用inputbox让用户输入主题id
				const themeId = await vscode.window.showInputBox({
					prompt: "Enter the theme ID",
					placeHolder: "e.g. 10070",
				});

				// 验证 themeId
				if (!themeId) {
					commonUtils.showError("Theme ID is required.");
					return;
				}

				// 构建目标文件路径
				const controllerPath = path.join(
					unicornUnityPath,
					`Assets/LuaScripts/GameModule/Theme/UIThemeWidget/Controller.lua`
				);

				// 检查文件是否存在
				if (!fs.existsSync(controllerPath)) {
					commonUtils.showError(
						`UIThemeWidget/Controller.lua file does not exist at path: ${controllerPath}.`
					);
					return;
				}

				// 读取文件内容
				const controllerContent = fs.readFileSync(
					controllerPath,
					"utf-8"
				);
				const normalizedContent = controllerContent.replace(
					/\r\n/g,
					"\n"
				);

			// 分割成行数组
			const lines = normalizedContent.split("\n");

			// 1. 查找 GameMasterPos 代码块的范围
			const gameMasterPosRange = commonUtils.findCodeBlockRange(
				lines,
				"local GameMasterPos = {",
				"}"
			);

			if (!gameMasterPosRange) {
				commonUtils.showError(
					"Cannot find 'local GameMasterPos = {' block in Controller.lua"
				);
				return;
			}

			const startLineIndex = gameMasterPosRange.startLine;
			const endLineIndex = gameMasterPosRange.endLine;

				// 3. 在这个区域内遍历，匹配 [themeId] = {...},
				const themeIdToInsert = parseInt(themeId);
				let maxSmallerThemeId = -1;
				let maxSmallerThemeLineIndex = -1;
				let themeExists = false;

				// 匹配 [数字] = { 的正则表达式
				const themeIdPattern = /\[(\d+)\]\s*=\s*{.+},/;

				for (let i = startLineIndex + 1; i < endLineIndex; i++) {
					const match = lines[i].match(themeIdPattern);
					if (match) {
						const foundThemeId = parseInt(match[1]);

						// 如果找到了要插入的主题ID，说明已存在
						if (foundThemeId === themeIdToInsert) {
							themeExists = true;
							break;
						}

						// 记录比要插入的themeId小的最大主题ID
						if (
							foundThemeId < themeIdToInsert &&
							foundThemeId > maxSmallerThemeId
						) {
							maxSmallerThemeId = foundThemeId;
							maxSmallerThemeLineIndex = i;
						}
					}
				}

				// 4. 如果主题已存在，提示用户
				if (themeExists) {
					commonUtils.showInfoMessage(
						`Theme ${themeId} already exists in GameMasterPos. No changes made.`
					);
				} else {
					// 5. 准备要插入的代码片段
					const codeSnippet = `    [${themeId}] = { 67, 264 },`;

					// 6. 确定插入位置
					let insertLine: number;
					if (maxSmallerThemeLineIndex !== -1) {
						// 找到了比当前themeId小的最大主题ID，插入到其下方

						insertLine = maxSmallerThemeLineIndex + 2; // +1 转换为 1-based，再 +1 插入到下一行
					} else {
						// 没有找到更小的themeId，插入到起始行之后
						insertLine = startLineIndex + 2; // +1 转换为 1-based，再 +1 插入到下一行
					}

					// 7. 插入代码片段
					fileUtils.insertContentWithEOLDetection(
						controllerPath,
						insertLine,
						codeSnippet
					);
				}
				
			// ===== 插入新主题星标逻辑 =====
			// 重新读取文件内容（因为上面可能已经修改过）
			const updatedControllerContent = fs.readFileSync(
				controllerPath,
				"utf-8"
			);
			const updatedNormalizedContent = updatedControllerContent.replace(
				/\r\n/g,
				"\n"
			);
			const updatedLines = updatedNormalizedContent.split("\n");

			// 1. 查找 NewSlotRewardPos 代码块的范围
			const newSlotRewardPosRange = commonUtils.findCodeBlockRange(
				updatedLines,
				"local NewSlotRewardPos = {",
				"}"
			);

			if (!newSlotRewardPosRange) {
				commonUtils.showError(
					"Cannot find 'local NewSlotRewardPos = {' block in Controller.lua"
				);
				return;
			}

			const newSlotStartLineIndex = newSlotRewardPosRange.startLine;
			const newSlotEndLineIndex = newSlotRewardPosRange.endLine;

				// 3. 检查这之间是否已经有该 themeId
				let newSlotThemeExists = false;
				const newSlotThemeIdPattern = /\[(\d+)\]\s*=/;

				for (let i = newSlotStartLineIndex + 1; i < newSlotEndLineIndex; i++) {
					const match = updatedLines[i].match(newSlotThemeIdPattern);
					if (match) {
						const foundThemeId = parseInt(match[1]);
						if (foundThemeId === themeIdToInsert) {
							newSlotThemeExists = true;
							break;
						}
					}
				}

				// 4. 如果不存在，插入到 "}" 前的一行
				if (newSlotThemeExists) {
					commonUtils.showInfoMessage(
						`Theme ${themeId} already exists in NewSlotRewardPos. No changes made.`
					);
				} else {
					// 准备要插入的新主题星标代码片段
					const newSlotCodeSnippet = `    [${themeId}] = { 67, 200 },`;

					// 插入位置为结束行的前一行（1-based）
					const newSlotInsertLine = newSlotEndLineIndex + 1; // 因为是1-based，刚好是 "}" 的位置，插入会在它前面

					// 插入代码片段
					fileUtils.insertContentWithEOLDetection(
						controllerPath,
						newSlotInsertLine,
						newSlotCodeSnippet
					);
				}

				// 打开文件
				const document = await vscode.workspace.openTextDocument(
					controllerPath
				);
				await vscode.window.showTextDocument(document);

				commonUtils.showInfoMessage(
					`Successfully processed theme ${themeId} star positions in Controller.lua`
				);
			} catch (error) {
				commonUtils.showError(
					`Error in addGMStarForNewTheme: ${
						(error as Error).message
					}.`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
