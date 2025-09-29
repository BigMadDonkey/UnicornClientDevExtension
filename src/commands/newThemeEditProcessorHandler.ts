import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as commonUtils from "../utils/commonUtils";
import * as fileUtils from "../utils/fileUtils";

export function registerNewThemeEditProcessorHandlerCommand(
	context: vscode.ExtensionContext
) {
	const command = vscode.commands.registerCommand(
		"unicornclientdev.newThemeEditProcessorHandler",
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

				// 获取 Controller 名称
				let themeName: string;
				try {
					themeName = commonUtils.getThemeNameByThemeId(
						themeId,
						unicornUnityPath
					);
				} catch (error) {
					commonUtils.showError((error as Error).message);
					return;
				}

				// 查找 Processor*.lua 文件
				const processorDir = path.join(
					unicornUnityPath,
					`Assets/LuaScripts/GameTheme/${themeId}/${themeName}`
				);

				if (!fs.existsSync(processorDir)) {
					commonUtils.showError(
						`Processor directory does not exist: ${processorDir}`
					);
					return;
				}

				// 读取目录中的所有文件
				const files = fs.readdirSync(processorDir);
				const processorFiles = files.filter((file) =>
					/^Processor.*\.lua$/i.test(file)
				);

				if (processorFiles.length === 0) {
					commonUtils.showError(
						`No Processor*.lua files found in directory: ${processorDir}`
					);
					return;
				}

				let totalReplacements = 0;
				const processedFiles: string[] = [];

				// 处理每个 Processor*.lua 文件
				for (const file of processorFiles) {
					const filePath = path.join(processorDir, file);
					console.log(`Processing file: ${filePath}`);
					try {
						// 读取文件内容
						const fileContent = fs.readFileSync(filePath, "utf-8");
						const lines = fileContent.split(/\r?\n/);
						
						let fileModified = false;
						let lineReplacements = 0;

						// 遍历每一行，查找匹配的函数定义
						for (let i = 0; i < lines.length; i++) {
							const line = lines[i];
							
							// 匹配 function Processor*:HandlerXxx(...) 的行，允许前导空白
							const functionMatch = line.match(/^(\s*)(function\s+Processor\w*):(Handler\w+)(\s*\([^)]*\))/);
							
							if (functionMatch) {
								const indentation = functionMatch[1]; // 前导空白
								const funcPart = functionMatch[2];     // function ProcessorBase
								const handlerName = functionMatch[3];  // HandlerApplyResult
								const paramsPart = functionMatch[4];   // (spin_result)
								
								// 检查参数列表是否为空
								const isEmptyParams = /^\s*\(\s*\)\s*$/.test(paramsPart);
								
								let newParams: string;
								if (isEmptyParams) {
									// 空参数列表：只添加 "board"
									newParams = paramsPart.replace(/^(\s*\()(\s*)(\)\s*)$/, '$1board$3');
								} else {
									// 非空参数列表：添加 "board, "
									newParams = paramsPart.replace(/^(\s*\()/, '$1board, ');
								}
								
								// 特殊处理：HandlerRefreshSymbol 需要在末尾添加 ", row, target_row"
								if (handlerName === "HandlerRefreshSymbol") {
									if (isEmptyParams) {
										// 空参数变为：(board, row, target_row)
										newParams = newParams.replace(/^(\s*\(board)(\s*)(\)\s*)$/, '$1, row, target_row$3');
									} else {
										// 非空参数在末尾添加：(..., row, target_row)
										newParams = newParams.replace(/^(.+)(\s*\)\s*)$/, '$1, row, target_row$2');
									}
								}
								
								const newLine = `${indentation}${funcPart}.${handlerName}${newParams}`;
								
								// 使用 fileUtils 替换该行
								fileUtils.replaceLineWithEOLDetection(filePath, i + 1, newLine);
								
								fileModified = true;
								lineReplacements++;
								
								// 重新读取文件内容以获取更新后的行号
								const updatedContent = fs.readFileSync(filePath, "utf-8");
								const updatedLines = updatedContent.split(/\r?\n/);
								// 更新当前循环的lines数组，但不重新遍历已处理的行
								lines.splice(0, lines.length, ...updatedLines);
							}
						}

						if (fileModified) {
							totalReplacements += lineReplacements;
							processedFiles.push(`${file} (${lineReplacements} functions)`);
						}
					} catch (fileError) {
						commonUtils.showWarning(
							`Failed to process file ${file}: ${(fileError as Error).message}`
						);
					}
				}

				// 显示处理结果
				if (totalReplacements > 0) {
					commonUtils.showInfoMessage(
						`Successfully processed ${totalReplacements} function signatures in ${processedFiles.length} files: ${processedFiles.join(', ')}`
					);
				} else {
					commonUtils.showInfoMessage(
						`No matching function signatures found in Processor files for theme ${themeId}.`
					);
				}
			} catch (error) {
				commonUtils.showError(
					`Error in newThemeEditProcessorHandler: ${
						(error as Error).message
					}`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
