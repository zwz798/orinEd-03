import { FileSystemProtocol, IFileSystemProtocol } from '../../../preload/preload'
import { CommonUtils } from '../../CommonUtils'
import { TreeNode, TreeNodeDTO } from '../../../share/treeNode'


export interface ITreeDataProvider {
    getChildren(element?: TreeNode): Promise<TreeNode[]>
    getRoot(): TreeNode
    removeTreeNode(path: string): void
}

export class DefaultTreeDataProvider implements ITreeDataProvider {
    private fileSystemProtocol: IFileSystemProtocol
    private commonUtils: CommonUtils

    constructor(private root: TreeNode) {
        this.fileSystemProtocol = new FileSystemProtocol()
        this.commonUtils = new CommonUtils()
    }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        try {
            if (element) {
                if (element.isDirectory) {
                    const filePath = await this.fileSystemProtocol.join(element.path, element.label)
                    const treeNodeDTOs = await this.fileSystemProtocol.readDirectory1(filePath)
                    const treeNodes = this.transferDTOs2TreeNodes(treeNodeDTOs, element.level + 1, element)

                    element.children = treeNodes
                    element.isLoaded = true
                    return treeNodes
                } else {
                    return []
                }
            }

            // 获取根节点数据
            const filePath = await this.fileSystemProtocol.join(this.root.path, this.root.label)
            const treeNodeDTOs = await this.fileSystemProtocol.readDirectory1(filePath)

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
        let sep = this.commonUtils.getSep()
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