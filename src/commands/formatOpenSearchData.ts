import * as vscode from "vscode";
import * as commonUtils from "../utils/commonUtils";

export function registerFormatOpenSearchDataCommand(
	context: vscode.ExtensionContext
) {
	const command = vscode.commands.registerCommand(
		"unicornclientdev.formatOpenSearchData",
		async () => {
			try {
				// 获取当前活动的文本编辑器
				const editor = vscode.window.activeTextEditor;
				if (!editor) {
					commonUtils.showError(
						"No active text editor found. You must open a file named 'temp' for this command."
					);
					return;
				}

				// 获取当前文档
				const document = editor.document;

				// 检查文件名是否为 "temp"（不含扩展名）
				const fileName = document.fileName;
				const fileNameWithoutExt = fileName
					.split("/")
					.pop()
					?.split("\\")
					.pop()
					?.split(".")[0];

				if (fileNameWithoutExt !== "temp") {
					commonUtils.showError(
						'File name must be "temp". Please create a new temporary file named "temp" for conversion.'
					);
					return;
				}

				// 获取文档全部内容
				const fullText = document.getText();
				const fullRange = new vscode.Range(
					document.positionAt(0),
					document.positionAt(fullText.length)
				);

				// 执行格式化操作
				let formattedText = fullText;

				// 1. 将单引号替换为双引号
				formattedText = formattedText.replace(/'/g, '"');

				// 2. 将 ": " 替换为 ":"，去除冒号后的多余空格
				formattedText = formattedText.replace(/:\s+/g, ":");
				// 3. 将 ", " 替换为 ","，去除逗号后的多余空格
				formattedText = formattedText.replace(/,\s+/g, ",");

				// 4. 将布尔值替换为数字
				// 匹配 true/True/TRUE -> 1
				formattedText = formattedText.replace(
					/\b(true|True|TRUE)\b/g,
					"1"
				);
				// 匹配 false/False/FALSE -> 0
				formattedText = formattedText.replace(
					/\b(false|False|FALSE)\b/g,
					"0"
				);

				// 应用编辑
				await editor.edit((editBuilder) => {
					editBuilder.replace(fullRange, formattedText);
				});

				commonUtils.showInfoMessage(
					"OpenSearch data formatted successfully!"
				); 
			} catch (error) {
				commonUtils.showError(
					`Error in formatOpenSearchData: ${(error as Error).message}`
				);
			}
		}
	);

	context.subscriptions.push(command);
}
