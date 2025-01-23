import { TreeNode, TreeNodeDTO } from '../../../share/treeNode'

export interface ITreeDataProvider {
    getChildren(element?: TreeNode): Promise<TreeNode[]>
    getRoot(): TreeNode
    removeTreeNode(path: string): void
    watch(nodeList: TreeNode[]): void
    watchOne(treeNode: TreeNode): void
    onFileChanged(): void
}

export class DefaultTreeDataProvider implements ITreeDataProvider {
    constructor(private root: TreeNode) {}

    onFileChanged(): void {
        window.electronApi.onFileChanged((path, type) => {
            console.log(`${path} 已改变,类型为 ${type}`)
        })
    }

    watchOne(treeNode: TreeNode): void {
        window.electronApi.watch(treeNode.getFullPath())
    }

    watch(nodeList: TreeNode[]): void {
        for (const node of nodeList) {
            this.watchOne(node)
        }
    }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        try {
            if (element) {
                if (element.isDirectory) {
                    // 监听该目录
                    this.watchOne(element)

                    const filePath = await window.electronApi.join(element.path, element.label)
                    const treeNodeDTOs = await window.electronApi.readDirectory1(filePath)
                    const treeNodes = this.transferDTOs2TreeNodes(treeNodeDTOs, element.level + 1, element)

                    element.children = treeNodes
                    element.isLoaded = true

                    return treeNodes
                } else {
                    return []
                }
            }

            // 监听根目录
            this.watchOne(this.root)

            // 获取根节点数据
            const filePath = await window.electronApi.join(this.root.path, this.root.label)
            const treeNodeDTOs = await window.electronApi.readDirectory1(filePath)
            const treeNodes = this.transferDTOs2TreeNodes(treeNodeDTOs, 0)
            this.root.children = treeNodes

            return treeNodes
        } catch (error) {
            if (element) {
                console.log(`获取 ${element} 的子节点的失败！ ${error}`)
            } else {
                console.log(`获取根节点 ${this.root} 的子节点的失败！ ${error}`)
            }

            return []
        }
    }

    getRoot(): TreeNode {
        return this.root
    }

    removeTreeNode(path: string): TreeNode | undefined {
        let node = this.findNodeByPath(path, this.root)
        if (node && node.parent) {
            node.parent.children = node.parent.children.filter(item => {
                return item != node
            })
        }
        return node
    }

    private transferDTOs2TreeNodes(treeNodeDTOs: TreeNodeDTO[], level: number, parent?: TreeNode): TreeNode[] {
        const treeNodes = treeNodeDTOs.map(item => {
            const treeNode = new TreeNode(item.path, item.label, item.isDirectory, level)
            if (parent) treeNode.parent = parent
            return treeNode
        })

        return treeNodes
    }

    private findNodeByPath(path: string, node: TreeNode): TreeNode | undefined {
        // let sep = window.electronApi.getSep()
        let sep = '\\'
        let splits = path.split(sep) 
        let curNode: TreeNode | undefined = node
        for (let i = 0; i < splits.length - 1; i++) {
            let filePath = splits[i] + sep + splits[i+1]
            curNode = curNode?.children.find(node => node.getFullPath() === filePath)
            if (!curNode) {
                break
            }
        }

        return curNode
    }

}