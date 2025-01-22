export class TreeNodeDTO {
    path: string
    label: string
    isDirectory: boolean

    constructor(path: string, label: string, isDirectory: boolean) {
        this.path = path
        this.label = label
        this.isDirectory = isDirectory
    }
}

export class TreeNode {
    path: string
    label: string
    isDirectory: boolean
    children: TreeNode[] = []
    level: number
    isLoaded: boolean = false
    isExpanded: boolean = false
    container: HTMLElement

    icon?: string
    parent?: TreeNode

    constructor(path: string, label: string, isDirectory: boolean, level: number) {
        this.path = path
        this.label = label
        this.isDirectory = isDirectory
        this.level = level

        this.container = document.createElement('div')
    }

    getFullPath(): string {
        return this.path + this.label
    }
}