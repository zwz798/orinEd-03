import { FileSystemProtocol, IFileSystemProtocol } from '../preload/preload'

export class CommonUtils {
    private sep!: string
    private fileSystemProtocol: IFileSystemProtocol = new FileSystemProtocol()

    constructor() {
        this.initSep()
    }

    async initSep() {
        this.fileSystemProtocol = new FileSystemProtocol()
        this.sep = await this.fileSystemProtocol.getSep()
    }

    getSep(): string {
        return this.sep
    }

    getSuffix(path: string): string {
        return path.substring(path.lastIndexOf('.') + 1)
    }
}

export function getSuffix(path: string): string {
    return path.substring(path.lastIndexOf('.') + 1)
}