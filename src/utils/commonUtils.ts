// A utility function to show an information message
import * as vscode from "vscode";

// Define a global OutputChannel for the extension
export const outputChannel =
	vscode.window.createOutputChannel("UnicornClientDev");

// A utility function to get the current timestamp in UTC+8 timezone
function getCurrentTimestamp(): string {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Shanghai", // UTC+8 时区
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	const parts = formatter.formatToParts(now);
	const date = `${parts.find((p) => p.type === "year")?.value}-${
		parts.find((p) => p.type === "month")?.value
	}-${parts.find((p) => p.type === "day")?.value}`;
	const time = `${parts.find((p) => p.type === "hour")?.value}:${
		parts.find((p) => p.type === "minute")?.value
	}:${parts.find((p) => p.type === "second")?.value}`;
	return `${date} ${time}`;
}

/**
 * 关于更新Config的工具函数
 */

// A utility function to update a configuration
export async function updateConfiguration(
	section: string,
	value: any
): Promise<void> {
	const config = vscode.workspace.getConfiguration("unicornclientdev");
	await config.update(section, value, vscode.ConfigurationTarget.Global);
}

// A utility function to get a configuration value
export function getConfiguration(section: string): any {
	const config = vscode.workspace.getConfiguration("unicornclientdev");
	return config.get(section);
}

/**
 * 关于信息提示的工具函数
 */

/** ### 弹出通知，提示性信息。
 * * 目前没打算把info输出也写到output中。
 * @param message
 */
export function showInfoMessage(message: string): void {
	vscode.window.showInformationMessage(message);
}

// A utility function to show a warning message and log it to the Output window
export function showWarning(message: string): void {
	vscode.window.showWarningMessage(message);
	outputChannel.appendLine(
		`[${getCurrentTimestamp()}] [Warning]: ${message}`
	);
	outputChannel.show();
}

// A utility function to show an error message and log it to the Output window
export function showError(message: string): void {
	vscode.window.showErrorMessage(message);
	outputChannel.appendLine(`[${getCurrentTimestamp()}] [Error]: ${message}`);
	outputChannel.show();
}

// Check if LSP extension "yinfei.luahelper" is activated
export function checkLSPActivated(): boolean {
	const luaHelper = vscode.extensions.getExtension("yinfei.luahelper");
	const enabled = luaHelper !== undefined && luaHelper.isActive;
	return enabled;
}

/**
 * 关于业务逻辑的工具函数
 */

export function isValidThemeId(themeId: string): boolean {
	const themeIdInt = parseInt(themeId || "0");
	return !isNaN(themeIdInt) && themeIdInt > 0;
}

export function isValidIGTThemeId(themeId: string): boolean {
	const themeIdInt = parseInt(themeId || "0");
	return !isNaN(themeIdInt) && themeIdInt >= 12000;
}

/**
 * 根据给定的 themeID，获取其 Controller 名称字符串
 * @param themeId 主题ID
 * @param unicornUnityPath Unicorn Unity 项目路径
 * @returns Controller 名称字符串，如果获取失败则抛出错误
 */
export function getControllerNameByThemeId(
	themeId: string,
	unicornUnityPath: string
): string {
	const fs = require("fs");
	const path = require("path");

	// 验证 themeId
	if (!isValidThemeId(themeId)) {
		throw new Error("Theme ID is illegal.");
	}

	// 构建 Theme.lua 文件路径
	const themeConfigPath = path.join(
		unicornUnityPath,
		`Assets/LuaScripts/GameTheme/${themeId}/Theme.lua`
	);

	// 检查文件是否存在
	if (!fs.existsSync(themeConfigPath)) {
		throw new Error(
			`Theme configuration file does not exist at path: ${themeConfigPath}. Maybe you haven't run new SlotTheme command from Unity Editor yet?`
		);
	}

	// 读取文件内容
	const themeConfigContent = fs.readFileSync(themeConfigPath, "utf-8");

	// 使用正则表达式匹配 MAIN_NAME
	const controllerMatch = themeConfigContent.match(
		/MAIN_NAME\s*=\s*"([^"]+)"/
	);

	if (!controllerMatch || controllerMatch.length < 2) {
		throw new Error(
			`Could not find Controller definition (MAIN_NAME) in Theme.lua at path: ${themeConfigPath}.`
		);
	}

	return controllerMatch[1];
}

/**
 * 根据给定的 themeID，获取其主题名称字符串（去除Controller名称中的"Ctrl"后缀）
 * @param themeId 主题ID
 * @param unicornUnityPath Unicorn Unity 项目路径
 * @returns 主题名称字符串，如果获取失败则抛出错误
 */
export function getThemeNameByThemeId(
	themeId: string,
	unicornUnityPath: string
): string {
	// 获取完整的 Controller 名称
	const controllerName = getControllerNameByThemeId(
		themeId,
		unicornUnityPath
	);

	// 去除结尾的 "Ctrl" 字符串
	if (controllerName.endsWith("Ctrl")) {
		return controllerName.slice(0, -4); // 去除最后4个字符 "Ctrl"
	}

	// 如果不以 "Ctrl" 结尾，返回原名称
	return controllerName;
}
