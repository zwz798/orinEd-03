import { contextBridge, ipcRenderer } from 'electron'
import { TreeNode, TreeNodeDTO } from '../share/treeNode'
import { FileChangeType } from '../share/fileChangeType'

declare global {
    interface Window {
        electronApi: ElectronApi
    }
}

export interface ElectronApi {
    readDirectory: (treeNode: TreeNode) => Promise<TreeNode[]>
    readDirectory1: (filePath: string) => Promise<TreeNodeDTO[]>
    readStat: (filePath: string) => Promise<TreeNode>
    watch: (filePath: string) => void
    join: (...args: string[]) => Promise<string>
    getSep: () => Promise<string>
    onFileChanged: (callback: (path: string, type: FileChangeType) => void) => void
}

contextBridge.exposeInMainWorld('electronApi', {
    readDirectory: (treeNode: TreeNode) => ipcRenderer.invoke('readDirectory', treeNode),
    readDirectory1: (filePath: string) => ipcRenderer.invoke('readDirectory1', filePath),
    readStat: (filePath: string) => ipcRenderer.invoke('readStat', filePath),
    watch: (filePath: string) => ipcRenderer.invoke('watch', filePath),
    join: (...args: string[]) => ipcRenderer.invoke('join', ...args),
    getSep: () => ipcRenderer.invoke('getSep'),
    onFileChanged: (callback: (path: string, type: FileChangeType) => void) => {
        ipcRenderer.on('file-changed', (event, changedPath, type) => callback(changedPath, type))
    }
} as ElectronApi)






// 文件系统协议
export interface IFileSystemProtocol {
    readDirectory(treeNode: TreeNode): Promise<TreeNode[]>
    readDirectory1(path: string): Promise<TreeNodeDTO[]>
    readStat(filePath: string): Promise<TreeNode>
    join(...args: string[]): Promise<string>
    getSep(): Promise<string>
}

export class FileSystemProtocol implements IFileSystemProtocol {
    async readDirectory(treeNode: TreeNode): Promise<TreeNode[]> {
        return await window.electronApi.readDirectory(treeNode)
    }

    async readDirectory1(path: string): Promise<TreeNodeDTO[]> {
        return await window.electronApi.readDirectory1(path)
    }

    async readStat(filePath: string): Promise<TreeNode> {
        return await window.electronApi.readStat(filePath)
    }

    async join(...args: string[]): Promise<string> {
        return await window.electronApi.join(...args)
    }

    async getSep(): Promise<string> {
        return await window.electronApi.getSep()
    }
}