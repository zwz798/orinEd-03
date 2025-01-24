import * as chokidar from 'chokidar'
import { mainWindow } from './main'
import { FileChangeType } from '../share/fileChangeType'

export function startWatch(watchDir: string) {
    console.log(`startWatch: ${watchDir}`)
    const watcher = chokidar.watch(watchDir, {
        ignored: /node_modules/,
        depth: 0,
        awaitWriteFinish: {
            stabilityThreshold: 200, // 文件稳定时间（毫秒）
            pollInterval: 100,       // 检查间隔
        },
    })

    watcher
        .on('add', path =>
            mainWindow.webContents.send('file-changed', path, FileChangeType.add)
        )
        .on('change', path =>
            mainWindow.webContents.send('file-changed', path, FileChangeType.change)
        )
        .on('unlink', path =>
            mainWindow.webContents.send('file-changed', path, FileChangeType.unlink)
        )
        .on('ready', () =>
            console.log()
        )
        .on('error', error =>
            console.error('Error happened:', error)
        )
}

export function startWatch1(watchDir: string): chokidar.FSWatcher {
    const watcher = chokidar.watch(watchDir, {
        ignored: /node_modules/,
        depth: 0
    })

    return watcher
}