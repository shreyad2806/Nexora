import * as vscode from 'vscode';

export interface TerminalContext {
	terminals: TerminalInfo[];
	activeTerminal?: TerminalInfo;
}

export interface TerminalInfo {
	name: string;
	pid?: number;
	shellPath?: string;
	cwd?: string;
	isActive: boolean;
}

export class TerminalContextManager {
	private static _instance: TerminalContextManager;
	private _logs: string[] = [];
	private readonly _maxLines: number = 300;

	private constructor() {}

	public static getInstance(): TerminalContextManager {
		if (!TerminalContextManager._instance) {
			TerminalContextManager._instance = new TerminalContextManager();
		}
		return TerminalContextManager._instance;
	}

	public appendOutput(text: string): void {
		const lines = text.split('\n');
		for (const line of lines) {
			if (line.trim()) {
				this._logs.push(line);
				if (this._logs.length > this._maxLines) {
					this._logs.shift();
				}
			}
		}
	}

	public clearLogs(): void {
		this._logs = [];
	}

	public getLogs(): string[] {
		return [...this._logs];
	}

	public getRecentLogs(count: number): string[] {
		return this._logs.slice(-count);
	}

	public getLogCount(): number {
		return this._logs.length;
	}
}

export async function getTerminalContext(): Promise<TerminalContext> {
	const terminals = vscode.window.terminals;
	const activeTerminal = vscode.window.activeTerminal;

	const terminalInfos: TerminalInfo[] = terminals.map((terminal) => ({
		name: terminal.name,
		pid: (terminal as any).processId,
		shellPath: (terminal as any).shellPath,
		cwd: (terminal as any).cwd,
		isActive: terminal === activeTerminal
	}));

	const activeTerminalInfo = terminalInfos.find((t) => t.isActive);

	return {
		terminals: terminalInfos,
		activeTerminal: activeTerminalInfo
	};
}

export async function getActiveTerminal(): Promise<TerminalInfo | undefined> {
	const activeTerminal = vscode.window.activeTerminal;
	if (!activeTerminal) {
		return undefined;
	}

	return {
		name: activeTerminal.name,
		pid: (activeTerminal as any).processId,
		shellPath: (activeTerminal as any).shellPath,
		cwd: (activeTerminal as any).cwd,
		isActive: true
	};
}

export async function getAllTerminals(): Promise<TerminalInfo[]> {
	const terminals = vscode.window.terminals;
	return terminals.map((terminal) => ({
		name: terminal.name,
		pid: (terminal as any).processId,
		shellPath: (terminal as any).shellPath,
		cwd: (terminal as any).cwd,
		isActive: terminal === vscode.window.activeTerminal
	}));
}

export async function createTerminal(name?: string): Promise<vscode.Terminal> {
	const terminal = vscode.window.createTerminal(name);
	const manager = TerminalContextManager.getInstance();
	manager.appendOutput(`Terminal created: ${name || 'default'}`);
	return terminal;
}

export async function sendTextToTerminal(text: string, terminal?: vscode.Terminal): Promise<void> {
	const targetTerminal = terminal || vscode.window.activeTerminal;
	if (!targetTerminal) {
		throw new Error('No active terminal');
	}
	targetTerminal.sendText(text);
	const manager = TerminalContextManager.getInstance();
	manager.appendOutput(`Command: ${text}`);
}

export async function executeCommandInTerminal(command: string): Promise<void> {
	const terminal = vscode.window.activeTerminal;
	const manager = TerminalContextManager.getInstance();
	
	if (!terminal) {
		const newTerminal = await createTerminal();
		newTerminal.sendText(command);
		manager.appendOutput(`Command: ${command}`);
	} else {
		terminal.sendText(command);
		manager.appendOutput(`Command: ${command}`);
	}
}

export async function getTerminalHistory(): Promise<string[]> {
	const history: string[] = [];
	const terminals = vscode.window.terminals;

	for (const terminal of terminals) {
		try {
			const creationArgs = (terminal as any).creationArgs;
			if (creationArgs && creationArgs.shellArgs) {
				history.push(...creationArgs.shellArgs);
			}
		} catch (error) {
			console.error('Error reading terminal history:', error);
		}
	}

	return history;
}

export async function hasActiveTerminal(): Promise<boolean> {
	return vscode.window.activeTerminal !== undefined;
}

export async function getTerminalCount(): Promise<number> {
	return vscode.window.terminals.length;
}
