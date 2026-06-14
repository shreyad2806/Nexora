import * as vscode from 'vscode';
import { getEditorContext } from './editor';
import { getWorkspaceContext } from './workspace';
import { getTerminalContext } from './terminal';

export interface ContextData {
	editor?: any;
	workspace?: any;
	terminal?: any;
	timestamp: number;
}

export async function collectFullContext(): Promise<ContextData> {
	const [editor, workspace, terminal] = await Promise.all([
		getEditorContext(),
		getWorkspaceContext(),
		getTerminalContext()
	]);

	return {
		editor,
		workspace,
		terminal,
		timestamp: Date.now()
	};
}

export async function collectEditorContext(): Promise<ContextData> {
	const editor = await getEditorContext();

	return {
		editor,
		timestamp: Date.now()
	};
}

export async function collectWorkspaceContext(): Promise<ContextData> {
	const workspace = await getWorkspaceContext();

	return {
		workspace,
		timestamp: Date.now()
	};
}

export async function collectTerminalContext(): Promise<ContextData> {
	const terminal = await getTerminalContext();

	return {
		terminal,
		timestamp: Date.now()
	};
}

export function hasActiveEditor(): boolean {
	return vscode.window.activeTextEditor !== undefined;
}

export function hasWorkspaceFolder(): boolean {
	return vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0;
}

export function hasActiveTerminal(): boolean {
	return vscode.window.terminals.length > 0;
}

import { buildContextPayload } from "./payload";

export async function collectContext() {
    return await buildContextPayload();
}