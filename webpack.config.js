const path = require('path')

module.exports = [
    {
        mode: 'development',
        entry: './src/main/main.ts',
        target: 'electron-main',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [{ loader: 'ts-loader' }]
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js'
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        externals: {
            electron: 'commonjs electron', // 避免打包 electron 模块
        }
    },
    {
        mode: 'development',
        entry: './src/renderer/renderer.ts',
        target: 'electron-renderer',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.(css|scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'renderer.js'
        },
        resolve: {
            extensions: ['.ts', '.js', '.scss']
        },
        externals: {
            electron: 'commonjs electron', // 避免打包 electron 模块
        }
    },
    {
        mode: 'development',
        entry: './src/preload/preload.ts',
        target: 'electron-preload',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [{ loader: 'ts-loader' }]
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'preload.js'
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        externals: {
            electron: 'commonjs electron', // 避免打包 electron 模块
        }
    }
]
