import { contextBridge, IpcRenderer, ipcRenderer } from 'electron'
import * as path from 'path'
import { TreeNode, TreeNodeDTO } from '../renderer/tree/treedata/TreeData'

export interface ElectronApi {
    readDirectory: (treeNode: TreeNode) => Promise<TreeNode[]>
    readDirectory1: (filePath: string) => Promise<TreeNodeDTO[]>
    readStat: (filePath: string) => Promise<TreeNode>
    join: (...args: string[]) => string
    sep: string
    watch: (filePath: string) => void
}

export interface Path {
    join: (...paths: string[]) => string
    resolve: (...paths: string[]) => string
    basename: (p: string, ext?: string) => string
    dirname: (p: string) => string
    extname: (p: string) => string
    normalize: (p: string) => string
    relative: (from: string, to: string) => string
}

contextBridge.exposeInMainWorld('electronApi', {
    readDirectory: (treeNode: TreeNode) => ipcRenderer.invoke('readDirectory', treeNode),
    readDirectory1: (filePath: string) => ipcRenderer.invoke("readDirectory1", filePath),
    readStat: (filePath: string) => ipcRenderer.invoke('readStat', filePath),
    join: (...args: string[]) => path.join(...args),
    sep: path.sep,
    watch: (filePath: string) => ipcRenderer.invoke('watch', filePath)
} as ElectronApi)


declare global {
    interface Window {
        electronApi: ElectronApi
    }
}

// 定义协议接口
interface IFileSystemProtocol {
    readDirectory(path: string): Promise<TreeNode[]>;
    readStat(filePath: string): Promise<TreeNode>

}

// Protocol 层实现
class FileSystemProtocol implements IFileSystemProtocol {
    // 渲染进程中的实现
    private ipcRenderer: IpcRenderer;

    constructor() {
        this.ipcRenderer = ipcRenderer;
    }

    async readDirectory(path: string): Promise<TreeNode[]> {
        return await this.ipcRenderer.invoke('readDirectory', path);
    }

    async 

}

