export class TreeNode {
    path: string
    icon?: string
    label: string
    isDirectory: boolean
    children?: [TreeNode]
    parent?: TreeNode

    constructor(path: string, label: string, isDirectory: boolean) {
        this.path = path
        this.label = label
        this.isDirectory = isDirectory
    }
}

interface ITreeDataProvider {
    getChildren(element?: TreeNode): [TreeNode],

}

class DefaultTreeDataProvider implements ITreeDataProvider{
    getChildren(element?: TreeNode): [TreeNode] {
        if (element) {

        }

        return 
    }
}

export class TreeView {
    private root: TreeNode

    constructor(rootNode: TreeNode,  html: HTMLElement, treeDataProdiver: ITreeDataProvider) {
        this.root = rootNode

        let treeNodeDiv = document.createElement("div")
        


    }
}