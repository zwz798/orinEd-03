import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { TreeNode } from '../renderer/myTree';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '/preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../src/renderer/index.html'));
    mainWindow.webContents.toggleDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('readDirectory', async (_event, filePath: string) => {
    try {
        const entries = await fs.readdir(filePath, { withFileTypes: true });
        let treeNodes = entries.map(dirent => {
            return new TreeNode(dirent.path, dirent.name, dirent.isDirectory())
        })
        return treeNodes;
    } catch (error) {
        return { error: error }; // 返回错误信息
    }
})

ipcMain.handle('readStat', async(_event, filePath: string) => {
    const stats = await fs.stat(filePath)
    return new TreeNode(filePath, path.basename(filePath), stats.isDirectory())
})
