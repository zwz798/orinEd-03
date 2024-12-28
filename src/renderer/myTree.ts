export class TreeNode {
    path: string
    icon?: string
    label: string
    isDirectory: boolean
    children: TreeNode[] = []
    parent?: TreeNode

    constructor(path: string, label: string, isDirectory: boolean) {
        this.path = path
        this.label = label
        this.isDirectory = isDirectory
    }
}

interface ITreeDataProvider {
    getChildren(element?: TreeNode): Promise<TreeNode[]>
    getRoot(): TreeNode
    refresh(): void
}

export class DefaultTreeDataProvider implements ITreeDataProvider {
    constructor(private root: TreeNode) {
    }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        // 有节点，查找他的子节点
        if (element) {
            const treeNodes = await window.electronApi.readDirectory(element.path)
            element.children = treeNodes
            return treeNodes
        }

        // 无节点，返回根目录的子节点
        const treeNodes = await window.electronApi.readDirectory(this.root.path)
        this.root.children = treeNodes
        return treeNodes
    }

    getRoot(): TreeNode {
        return this.root
    }

    refresh(): void {

    }
}

export class TreeView {
    constructor(private treeDataProvider: ITreeDataProvider) {}

    async renderRootView(html: HTMLElement) {
        this.rendererTreeView(this.treeDataProvider.getRoot(), html, 0)
    }

    /**
     * 
     * @param node 根节点
     * @param html 在html下渲染
     * @param level 节点的层级
     * @returns 
     */
     private async rendererTreeView(node: TreeNode, html: HTMLElement, level: number) {
        const childNodes = node.children
        if (childNodes.length == 0) {
            return
        }
        childNodes.forEach(node => {
            const treeNodeDiv = this.rendererTreeNode(node, level + 1)
            this.rendererTreeView(node, treeNodeDiv, level + 1)
            html.appendChild(treeNodeDiv)
        })
    }

    private rendererTreeNode(treeNode: TreeNode, level: number): HTMLElement {
        let treeNodeDiv = document.createElement("div")
        let label = document.createElement("span")
        label.style.marginLeft = `${level * 20}px`
        label.innerText = treeNode.label
        treeNodeDiv.appendChild(label)
        return treeNodeDiv
    }
}