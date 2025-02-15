import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs/promises'
import { TreeNode, TreeNodeDTO } from '../share/treeNode'
import { startWatch } from './watcher'

export let mainWindow: BrowserWindow 

function createWindow() {
    mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'))
    mainWindow.webContents.toggleDevTools()
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('readDirectory', async (_event, treeNode: TreeNode) => {
    try {
        const filePath = path.join(treeNode.path, treeNode.label)

        const entries = await fs.readdir(filePath, { withFileTypes: true })
        let treeNodes = entries.map(dirent => {
            const path = dirent.path
            const name = dirent.name
            const level = treeNode.level
            const isDirectory = dirent.isDirectory()

            const childNode = new TreeNode(path, name, isDirectory, level + 1)
            childNode.parent = treeNode

            return childNode
        })

        treeNode.children = treeNodes
        return treeNodes
    } catch (error) {
        console.log(error)
        return treeNode
    }
})

ipcMain.handle('readDirectory1', async (_event, filePath: string): Promise<TreeNodeDTO[]> => {
    try {
        const entries = await fs.readdir(filePath, { withFileTypes: true })
        let treeNodeDTOs = entries.map(dirent => {
            return new TreeNodeDTO(dirent.path, dirent.name, dirent.isDirectory())
        })

        return treeNodeDTOs
    } catch (error) {
        console.log(error)
        return []
    }
})

ipcMain.handle('readStat', async (_event, filePath: string) => {
    return await fs.stat(filePath)
})

ipcMain.handle('join', (_event, ...paths: string[]) => {
    return path.join(...paths)
})

ipcMain.handle('getSep', (_event) => {
    return path.sep
})

ipcMain.handle('watch', (_event, watchDir: string) => {
    startWatch(watchDir)
})