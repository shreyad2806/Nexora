import * as vscode from 'vscode';

export interface EditorContext {
	filePath?: string;
	fileName?: string;
	language?: string;
	selection?: SelectionContext;
	content?: string;
	lineCount?: number;
	cursorPosition?: CursorPosition;
}

export interface SelectionContext {
	startLine: number;
	startColumn: number;
	endLine: number;
	endColumn: number;
	selectedText?: string;
}

export interface CursorPosition {
	line: number;
	column: number;
}

export interface ActiveEditorContext {
	filename: string;
	filepath: string;
	language: string;
	cursorLine: number;
	cursorColumn: number;
	fullCode: string;
}

export interface SelectedCode {
	selectedText: string;
	startLine: number;
	endLine: number;
	hasSelection: boolean;
}

export interface CurrentLineContext {
	lineNumber: number;
	lineText: string;
}

export interface OpenedEditor {
	filename: string;
	filepath: string;
	language: string;
}

export async function getActiveEditorContext(): Promise<ActiveEditorContext | null> {
	try {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return null;
		}

		const document = editor.document;
		const selection = editor.selection;

		return {
			filename: document.fileName,
			filepath: document.uri.fsPath,
			language: document.languageId,
			cursorLine: selection.active.line,
			cursorColumn: selection.active.character,
			fullCode: document.getText()
		};
	} catch (error) {
		console.error('Error getting active editor context:', error);
		return null;
	}
}

export async function getEditorContext(): Promise<EditorContext | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}

	const document = editor.document;
	const selection = editor.selection;

	return {
		filePath: document.uri.fsPath,
		fileName: document.fileName,
		language: document.languageId,
		selection: getSelectionContext(selection, document),
		content: document.getText(),
		lineCount: document.lineCount,
		cursorPosition: {
			line: selection.active.line,
			column: selection.active.character
		}
	};
}

export function getSelectionContext(selection: vscode.Selection, document: vscode.TextDocument): SelectionContext {
	const selectedText = document.getText(selection);

	return {
		startLine: selection.start.line,
		startColumn: selection.start.character,
		endLine: selection.end.line,
		endColumn: selection.end.character,
		selectedText: selectedText || undefined
	};
}

export async function getActiveDocumentContent(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}
	return editor.document.getText();
}

export async function getSelectedText(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}
	const selection = editor.selection;
	if (selection.isEmpty) {
		return undefined;
	}
	return editor.document.getText(selection);
}

export async function getSelectedCode(): Promise<SelectedCode> {
	try {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return {
				selectedText: '',
				startLine: 0,
				endLine: 0,
				hasSelection: false
			};
		}

		const selection = editor.selection;
		const selectedText = selection.isEmpty ? '' : editor.document.getText(selection);

		return {
			selectedText,
			startLine: selection.start.line,
			endLine: selection.end.line,
			hasSelection: !selection.isEmpty
		};
	} catch (error) {
		console.error('Error getting selected code:', error);
		return {
			selectedText: '',
			startLine: 0,
			endLine: 0,
			hasSelection: false
		};
	}
}

export async function getCurrentLine(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}
	const line = editor.document.lineAt(editor.selection.active.line);
	return line.text;
}

export async function getCurrentLineContext(): Promise<CurrentLineContext | null> {
	try {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return null;
		}

		const selection = editor.selection;
		const line = editor.document.lineAt(selection.active.line);

		return {
			lineNumber: selection.active.line,
			lineText: line.text
		};
	} catch (error) {
		console.error('Error getting current line context:', error);
		return null;
	}
}

export async function getFileExtension(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}
	const fileName = editor.document.fileName;
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		return undefined;
	}
	return fileName.substring(lastDotIndex + 1);
}

export async function getRelativePath(): Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
	if (!workspaceFolder) {
		return undefined;
	}
	return vscode.workspace.asRelativePath(editor.document.uri);
}

export async function isFileDirty(): Promise<boolean> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return false;
	}
	return editor.document.isDirty;
}

export async function getOpenedEditors(): Promise<OpenedEditor[]> {
	try {
		const openedEditors: OpenedEditor[] = [];
		const seenPaths = new Set<string>();

		for (const tabGroup of vscode.window.tabGroups.all) {
			for (const tab of tabGroup.tabs) {
				const input = tab.input;
				if (input instanceof vscode.TabInputText) {
					const uri = input.uri;
					const filepath = uri.fsPath;
					
					if (seenPaths.has(filepath)) {
						continue;
					}
					seenPaths.add(filepath);

					const filename = uri.path.split('/').pop() || '';
					const language = getLanguageFromUri(uri);

					openedEditors.push({
						filename,
						filepath,
						language
					});
				}
			}
		}

		return openedEditors;
	} catch (error) {
		console.error('Error getting opened editors:', error);
		return [];
	}
}

function getLanguageFromUri(uri: vscode.Uri): string {
	const extension = uri.path.split('.').pop() || '';
	const languageMap: Record<string, string> = {
		'ts': 'typescript',
		'tsx': 'typescript',
		'js': 'javascript',
		'jsx': 'javascript',
		'py': 'python',
		'rs': 'rust',
		'go': 'go',
		'java': 'java',
		'c': 'c',
		'cpp': 'cpp',
		'h': 'c',
		'hpp': 'cpp',
		'cs': 'csharp',
		'php': 'php',
		'rb': 'ruby',
		'sh': 'shell',
		'bash': 'shell',
		'zsh': 'shell',
		'ps1': 'powershell',
		'json': 'json',
		'xml': 'xml',
		'html': 'html',
		'css': 'css',
		'scss': 'scss',
		'sass': 'sass',
		'md': 'markdown',
		'yml': 'yaml',
		'yaml': 'yaml',
		'toml': 'toml',
		'ini': 'ini',
		'cfg': 'ini',
		'sql': 'sql',
		'dockerfile': 'dockerfile',
		'docker': 'dockerfile',
		'txt': 'plaintext',
	};

	return languageMap[extension.toLowerCase()] || 'plaintext';
}
