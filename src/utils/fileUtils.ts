import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

/**
 * Copies files with specific extensions from a source directory to a target directory.
 * @param sourceDir The source directory path.
 * @param targetDir The target directory path.
 * @param extensions An array of file extensions to filter (e.g., [".png", ".jpg"]).
 */
export function copyFilesWithExtensions(
	sourceDir: string,
	targetDir: string,
	extensions: string[]
): void {
	try {
		// 检查源目录是否存在
		if (!fs.existsSync(sourceDir)) {
			vscode.window.showErrorMessage(
				"Source directory does not exist or is not accessible."
			);
			return;
		}

		// 检查目标目录是否存在
		if (!fs.existsSync(targetDir)) {
			vscode.window.showErrorMessage(
				"Target directory does not exist or is not accessible."
			);
			return;
		}

		// 读取源目录中的文件
		const files = fs.readdirSync(sourceDir);
		const filteredFiles = files.filter((file) =>
			extensions.includes(path.extname(file).toLowerCase())
		);

		if (filteredFiles.length === 0) {
			vscode.window.showInformationMessage(
				"No matching files found in the source directory."
			);
			return;
		}

		// 复制文件到目标目录
		for (const file of filteredFiles) {
			const sourceFile = path.join(sourceDir, file);
			const targetFile = path.join(targetDir, file);

			if (!fs.existsSync(targetFile)) {
				fs.copyFileSync(sourceFile, targetFile);
				vscode.window.showInformationMessage(`Copied: ${file}`);
			} else {
				vscode.window.showWarningMessage(
					`File already exists: ${file}`
				);
			}
		}

		vscode.window.showInformationMessage("File copy operation completed.");
	} catch (error) {
		vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
	}
}

/**
 * Copies a file from a source URL to a target directory.
 * @param sourceUrl The source file URL.
 * @param targetUrl The target directory path.
 * @returns A boolean indicating success or failure.
 */
export function copyFileFromUrl(sourceUrl: string, targetUrl: string): boolean {
	try {
		const fileName = path.basename(sourceUrl);
		// const targetFile = path.join(targetUrl, fileName);

		// 检查源目录是否存在
		if (!fs.existsSync(sourceUrl)) {
			// vscode.window.showErrorMessage(
			// 	"Target directory does not exist or is not accessible."
			// );
            console.log(`Source file does not exist: ${sourceUrl}`);
			return false;
		}

		// 检查目标文件是否已存在
		// if (fs.existsSync(targetFile)) {
		// 	vscode.window.showInformationMessage(
		// 		`File already exists: ${fileName}. Replace it.`
		// 	);
		// return;
		// }

		// 复制文件
		fs.copyFileSync(sourceUrl, targetUrl);
		// vscode.window.showInformationMessage(`Copied: ${fileName}`);
		return true;
	} catch (error) {
		vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
		return false;
	}
}
