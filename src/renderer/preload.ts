import { IpcRenderer, contextBridge, ipcRenderer } from "electron"
import { TreeNode } from "./myTree"

export interface ElectronApi {
    readDirectory: (filePath: string) => Promise<[TreeNode]>
}

contextBridge.exposeInMainWorld('electronApi', {
    readDirectory: (filePath: string) => ipcRenderer.invoke("readDirectory", filePath)
} as ElectronApi)