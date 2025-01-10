import * as chokidar from 'chokidar';

export function startWatch(watchDir: string) {
    const watcher = chokidar.watch(watchDir, {
        ignored: /node_modules/,
        depth: 0
    });

    watcher
        .on('add', path =>
            console.log(`File ${path} has been added`)
        )
        .on('change', path =>
            console.log(`File ${path} has been changed`)
        )
        .on('unlink', path =>
            console.log(`File ${path} has been removed`)
        )
        .on('ready', () =>
            console.log('Initial scan complete. Ready for changes.')
        )
        .on('error', error =>
            console.error('Error happened:', error)
        );
}

export function startWatch1(watchDir: string): chokidar.FSWatcher {
    const watcher = chokidar.watch(watchDir, {
        ignored: /node_modules/,
        depth: 0
    });

    return watcher
}