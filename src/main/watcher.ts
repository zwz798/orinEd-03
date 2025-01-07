import * as chokidar from 'chokidar';
import { resolve } from 'path';

// 设置要监视的目录（这里以当前目录为例）
const path = "D:\\"
const watchDir = resolve(path);

console.log(".........................")

// 创建 watcher 实例，配置忽略 node_modules 目录
const watcher = chokidar.watch(watchDir, {
    ignored: /node_modules/
});

// 监听各种事件
watcher
    .on('add', path => console.log(`File ${path} has been added`))
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`))
    .on('ready', () => console.log('Initial scan complete. Ready for changes.'))
    .on('error', error => console.error('Error happened:', error));