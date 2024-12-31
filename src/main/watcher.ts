import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

interface FileChangeInfo {
    type: 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
    path: string;
}

export class FileSystemWatcher extends EventEmitter {
    private watchers: fs.FSWatcher[] = [];
    private rootPath: string;

    constructor(rootPath: string) {
        super();
        this.rootPath = rootPath;
        this.initWatcher(rootPath);
    }

    private initWatcher(dirPath: string) {
        try {
            // 监听当前目录
            const watcher = fs.watch(dirPath, { recursive: false }, (eventType, filename) => {
                if (!filename) return;

                const fullPath = path.join(dirPath, filename);

                // 处理文件/目录的变化
                fs.stat(fullPath, (err, stats) => {
                    if (err) {
                        // 文件/目录被删除的情况
                        if (err.code === 'ENOENT') {
                            this.emit('change', {
                                type: 'unlink',
                                path: fullPath
                            } as FileChangeInfo);
                        }
                        return;
                    }

                    // 新增或修改文件/目录
                    if (stats.isDirectory()) {
                        this.emit('change', {
                            type: 'addDir',
                            path: fullPath
                        } as FileChangeInfo);

                        // 为新目录添加监听
                        this.initWatcher(fullPath);
                    } else {
                        this.emit('change', {
                            type: 'add',
                            path: fullPath
                        } as FileChangeInfo);
                    }
                });
            });

            this.watchers.push(watcher);

            // 递归监听子目录
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                const fullPath = path.join(dirPath, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    this.initWatcher(fullPath);
                }
            });

        } catch (error) {
            console.error(`Error watching directory ${dirPath}:`, error);
        }
    }

    // 清理所有监听器
    dispose() {
        this.watchers.forEach(watcher => watcher.close());
        this.watchers = [];
        this.removeAllListeners();
    }
}

// 使用示例
const fileTreeStore = {
    updateTree(changeInfo: FileChangeInfo) {
        switch (changeInfo.type) {
            case 'add':
            case 'addDir':
                // 添加新节点到树中
                break;
            case 'unlink':
            case 'unlinkDir':
                // 从树中移除节点
                break;
            case 'change':
                // 更新节点状态
                break;
        }
    }
};

// 初始化文件系统监听器
const watcher = new FileSystemWatcher('/path/to/root');
watcher.on('change', (changeInfo: FileChangeInfo) => {
    fileTreeStore.updateTree(changeInfo);
});