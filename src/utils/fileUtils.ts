import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as commonUtils from "../utils/commonUtils";

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
			throw new Error(
				"Source directory does not exist or is not accessible."
			);
		}

		// 检查目标目录是否存在
		if (!fs.existsSync(targetDir)) {
			throw new Error(
				"Target directory does not exist or is not accessible."
			);
		}
		// 递归复制文件和文件夹
		function copyRecursive(src: string, dest: string): void {
			const items = fs.readdirSync(src, { withFileTypes: true });
			for (const item of items) {
				const sourcePath = path.join(src, item.name);
				const targetPath = path.join(dest, item.name);

				if (item.isDirectory()) {
					// 如果是文件夹，递归处理
					if (!fs.existsSync(targetPath)) {
						fs.mkdirSync(targetPath);
					}
					copyRecursive(sourcePath, targetPath);
				} else if (
					extensions.includes(path.extname(item.name).toLowerCase())
				) {
					// 如果是文件且扩展名匹配，复制文件
					fs.copyFileSync(sourcePath, targetPath);
				}
			}
		}
		copyRecursive(sourceDir, targetDir);
	} catch (error) {
		throw new Error(
			`Error in copyFilesWithExtensions: ${(error as Error).message}`
		);
	}
}

/**
 * Copy a single file from a source URL to a target URL.
 * @param sourceUrl The source file URL.
 * @param targetUrl The target file URL.
 * @returns A boolean indicating success or failure.
 */
export function copyFileFromUrl(sourceUrl: string, targetUrl: string): boolean {
	try {
		const fileName = path.basename(sourceUrl);

		// 检查源目录是否存在
		if (!fs.existsSync(sourceUrl)) {
			// throw new Error(`Source file does not exist: ${sourceUrl}`);
			// * 修改此处逻辑，对于单个指定URL的文件复制，如果不存在，那就不存在好了。这里只return false即可。
			return false;
		}
		// 复制文件
		fs.copyFileSync(sourceUrl, targetUrl);
		return true;
	} catch (error) {
		throw new Error(
			`Error in copyFileFromUrl: ${(error as Error).message}`
		);
	}
}

/**
 * Writes a string to a specified position in a file, detecting and preserving the file's line-ending format.
 * @param filePath The path to the file where the content will be written.
 * @param content The string content to insert.
 * @param position The position in the file where the content will be inserted (line number, 1-based).
 */
export function insertContentWithEOLDetection(
    filePath: string,
    content: string,
    position: number
): void {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }

        // Read the file content
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Detect the line-ending format
        const eol = fileContent.includes("\r\n") ? "\r\n" : "\n";

        // Normalize the content's line endings
        const normalizedContent = content.replace(/\n/g, eol);

        // Split the file content into lines
        const lines = fileContent.split(/\r?\n/);

        // Insert the content at the specified position
        lines.splice(position - 1, 0, normalizedContent);

        // Join the lines back and write to the file
        const updatedContent = lines.join(eol);
        fs.writeFileSync(filePath, updatedContent, "utf-8");
    } catch (error) {
        throw new Error(
            `Error in insertContentWithEOLDetection: ${(error as Error).message}`
        );
    }
}
