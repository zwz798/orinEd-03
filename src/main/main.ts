import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        return { error: error }; // 返回错误信息
    }
})
