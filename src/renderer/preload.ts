import { contextBridge, ipcRenderer } from 'electron'
import * as path from 'path'
import { TreeNode } from './myTree'

// 定义 ElectronApi 类型
export interface ElectronApi {
    readDirectory: (filePath: string) => Promise<TreeNode[]>  // 返回目录列表
    readStat: (filePath: string) => Promise<TreeNode>  // 返回文件或目录的 stat 信息
    join: (...args: string[]) => string
}

// 定义 Path 类型，包括 path 模块中的常用方法
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
    readDirectory: (filePath: string) => ipcRenderer.invoke('readDirectory', filePath),
    readStat: (filePath: string) => ipcRenderer.invoke('readStat', filePath),
    join: (...args: string[]) => path.join(...args)
} as ElectronApi)


// 进行全局类型声明
declare global {
    interface Window {
        electronApi: ElectronApi
    }
}
