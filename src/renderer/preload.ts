import { contextBridge, ipcRenderer } from "electron"
import { TreeNode } from "./myTree"

export interface ElectronApi {
    readDirectory: (filePath: string) => Promise<TreeNode[]>
    readStat: (filePath: string) => Promise<TreeNode>
}

contextBridge.exposeInMainWorld('electronApi', {
    readDirectory: (filePath: string) => ipcRenderer.invoke("readDirectory", filePath),
    readStat: (filePath: string) => ipcRenderer.invoke("readStat", filePath)
} as ElectronApi)

declare global {
    interface Window {
        electronApi: ElectronApi
    }
}