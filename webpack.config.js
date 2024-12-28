const path = require('path');

module.exports = [
    // 配置 1: 主进程 (main)
    {
        mode: 'development',
        entry: './src/main/main.ts',
        target: 'electron-main', // 主进程环境
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js'
        },
        resolve: {
            extensions: ['.ts', '.js']
        }
    },
    // 配置 2: 渲染进程 (renderer)
    {
        mode: 'development',
        entry: './src/renderer/renderer.ts',
        target: 'electron-renderer', // 渲染进程环境
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'renderer.js'
        },
        resolve: {
            extensions: ['.ts', '.js']
        }
    },
    // 配置 3: 预加载脚本 (preload)
    {
        mode: 'development',
        entry: './src/renderer/preload.ts',
        target: 'electron-preload', // 预加载环境
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'preload.js' // 编译输出的 preload 文件
        },
        resolve: {
            extensions: ['.ts', '.js']
        }
    }
];
