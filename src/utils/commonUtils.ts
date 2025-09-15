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
