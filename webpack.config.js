const path = require('path');

module.exports = [
    {
        mode: 'development',
        entry: './src/main/main.ts',
        target: 'electron-main',
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
    {
        mode: 'development',
        entry: './src/renderer/renderer.ts',
        target: 'electron-renderer',
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
    }
];