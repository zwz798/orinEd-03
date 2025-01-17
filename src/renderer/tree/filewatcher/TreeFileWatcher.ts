interface TreeFileWatcher {
    watch(filePath: string): void
    
}

export class DefaultTreeFileWatcher implements TreeFileWatcher {
    watch(filePath: string): void {
        console.log(`开始监听目录： ${filePath}`)
        window.electronApi.watch(filePath)
    }
}