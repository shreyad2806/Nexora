import * as vscode from 'vscode';

export interface WorkspaceContext {
	folders: WorkspaceFolder[];
	rootPath?: string;
	fileCount?: number;
	folderCount?: number;
}

export interface WorkspaceFolder {
	name: string;
	path: string;
}

export async function getWorkspaceContext(): Promise<WorkspaceContext | undefined> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return undefined;
	}

	const folders = await Promise.all(
		workspaceFolders.map(async (folder) => ({
			name: folder.name,
			path: folder.uri.fsPath
		}))
	);

	const rootPath = workspaceFolders[0].uri.fsPath;

	return {
		folders,
		rootPath,
		fileCount: await countFiles(rootPath),
		folderCount: await countFolders(rootPath)
	};
}

export async function getWorkspaceFolders(): Promise<WorkspaceFolder[]> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return [];
	}

	return workspaceFolders.map((folder) => ({
		name: folder.name,
		path: folder.uri.fsPath
	}));
}

export function getRootPath(): string | undefined {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return undefined;
	}
	return workspaceFolders[0].uri.fsPath;
}

export async function findFiles(pattern: string): Promise<vscode.Uri[]> {
	return await vscode.workspace.findFiles(pattern, '**/node_modules/**');
}

export async function findFilesInFolder(folderPath: string, pattern: string): Promise<vscode.Uri[]> {
	const folderUri = vscode.Uri.file(folderPath);
	return await vscode.workspace.findFiles(
		new vscode.RelativePattern(folderUri, pattern),
		'**/node_modules/**'
	);
}

export async function countFiles(folderPath: string): Promise<number> {
	try {
		const files = await vscode.workspace.findFiles(
			new vscode.RelativePattern(vscode.Uri.file(folderPath), '**/*'),
			'**/node_modules/**'
		);
		return files.length;
	} catch (error) {
		console.error('Error counting files:', error);
		return 0;
	}
}

export async function countFolders(folderPath: string): Promise<number> {
	try {
		const folders = await vscode.workspace.findFiles(
			new vscode.RelativePattern(vscode.Uri.file(folderPath), '*/'),
			'**/node_modules/**'
		);
		return folders.length;
	} catch (error) {
		console.error('Error counting folders:', error);
		return 0;
	}
}

export async function getFileTree(folderPath: string): Promise<FileTreeItem[]> {
	const files = await vscode.workspace.findFiles(
		new vscode.RelativePattern(vscode.Uri.file(folderPath), '**/*'),
		'**/node_modules/**'
	);

	const tree = new Map<string, FileTreeItem>();

	for (const file of files) {
		const relativePath = vscode.workspace.asRelativePath(file);
		const parts = relativePath.split('/');
		let currentPath = '';

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			currentPath = currentPath ? `${currentPath}/${part}` : part;

			if (!tree.has(currentPath)) {
				tree.set(currentPath, {
					name: part,
					path: file.fsPath,
					isFile,
					children: []
				});
			}
		}
	}

	return Array.from(tree.values());
}

export interface FileTreeItem {
	name: string;
	path: string;
	isFile: boolean;
	children: FileTreeItem[];
}

export interface WorkspaceFile {
	name: string;
	relativePath: string;
}

export async function getWorkspaceFiles(): Promise<WorkspaceFile[]> {
	try {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			return [];
		}

		const excludePattern = `**/{node_modules,.git,dist,build,__pycache__,.venv}/**`;
		const files = await vscode.workspace.findFiles('**/*', excludePattern);

		const workspaceFiles: WorkspaceFile[] = [];
		const maxFiles = 200;

		for (const file of files) {
			if (workspaceFiles.length >= maxFiles) {
				break;
			}

			const relativePath = vscode.workspace.asRelativePath(file);
			const name = relativePath.split('/').pop() || relativePath;

			workspaceFiles.push({
				name,
				relativePath
			});
		}

		return workspaceFiles;
	} catch (error) {
		console.error('Error getting workspace files:', error);
		return [];
	}
}

export async function getWorkspaceConfiguration(): Promise<vscode.WorkspaceConfiguration> {
	return vscode.workspace.getConfiguration();
}

export async function getConfigurationValue(section: string): Promise<any> {
	const config = vscode.workspace.getConfiguration();
	return config.get(section);
}

export async function setConfigurationValue(section: string, value: any): Promise<void> {
	const config = vscode.workspace.getConfiguration();
	await config.update(section, value, vscode.ConfigurationTarget.Workspace);
}
