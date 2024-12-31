import './tree.scss'
import { getSuffix } from './CommonUtils'
import { getIconPath } from './iconMap'

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

        this.container = document.createElement("div")
    }

    createContainer() {
        if (!this.container) {
            this.container = document.createElement("div")
        }
    }
}

export interface ITreeDataProvider {
    getChildren(element?: TreeNode): Promise<TreeNode[]>
    getRoot(): TreeNode
}

export class DefaultTreeDataProvider implements ITreeDataProvider {
    constructor(private root: TreeNode) {
        root.createContainer()
     }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        try {
            if (element) {
                if (element.isDirectory) {
                    const filePath = window.electronApi.join(element.path, element.label)
                    const treeNodeDTOs = await window.electronApi.readDirectory1(filePath)
                    const treeNodes = this.transferDTOs2TreeNodes(treeNodeDTOs, element.level + 1, element)

                    element.children = treeNodes
                    element.isLoaded = true
                    return treeNodes
                } else {
                    return []
                }
            }

            const filePath = window.electronApi.join(this.root.path, this.root.label)
            const treeNodeDTOs = await window.electronApi.readDirectory1(filePath)

            const treeNodes = this.transferDTOs2TreeNodes(treeNodeDTOs, 0)
            this.root.children = treeNodes
            return treeNodes
        } catch(error) {
            if (element) {
                console.log(`获取 ${element} 的字节点的失败！ ${error}`)
            } else {
                console.log(`获取根节点 ${this.root} 的字节点的失败！ ${error}`)
            }

            return []
        }
    }

    private transferDTOs2TreeNodes(treeNodeDTOs: TreeNodeDTO[], level: number, parent?: TreeNode): TreeNode[] {
        const treeNodes = treeNodeDTOs.map(item => {
            const treeNode = new TreeNode(item.path, item.label, item.isDirectory, level)
            if (parent) treeNode.parent = parent
            return treeNode
        })

        return treeNodes
    }

    getRoot(): TreeNode {
        return this.root
    }
}

export interface TreeView {
    renderRootView(): void
    rendererTreeNode(treeNode: TreeNode): void
    refresh(): void
}

export class DefaultTreeView implements TreeView {
    constructor(private treeDataProvider: ITreeDataProvider) {
        treeDataProvider.getRoot().container.classList.add("tree")
    }

    refresh(): void {
        throw new Error('Method not implemented.')
    }

    async renderRootView() {
        this.treeDataProvider.getRoot().container.innerHTML = ''
        await this.rendererTreeView(this.treeDataProvider.getRoot())
    }

    /**
     * 递归渲染树视图
     * @param node 根节点
     * @param html 在html下渲染
     * @param level 节点的层级
     * @returns 
     */
    private async rendererTreeView(node: TreeNode) {
        const childNodes = node.children
        if (childNodes.length == 0) {
            return
        }

        for (const childNode of childNodes) {
            const treeNodeDiv = this.rendererTreeNode(childNode)
            node.container.appendChild(treeNodeDiv)

            if (childNode.isDirectory) {
                await this.rendererTreeView(childNode)
            }
        }
    }

    rendererTreeNode(treeNode: TreeNode): HTMLElement {
        // 容器
        const treeNodeDiv = document.createElement('div')
        treeNodeDiv.style.display = "flex"
        // 文件名
        const fileNameDiv = document.createElement('div')
        fileNameDiv.classList.add("file_name")
        fileNameDiv.innerText = treeNode.label
        // 图标
        const icon = document.createElement('div')
        icon.classList.add('icon')
        icon.style.marginLeft = `${(treeNode.level + 1) * 8 + 5}px`

        let iconPath = getIconPath(treeNode)

        if (treeNode.isDirectory) {
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_folder</title><path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z" style="fill:#c09553"/></svg>'
        } else {
            fetch(iconPath)
                .then(res => res.text())
                .then(svgText => icon.innerHTML = svgText)
                .catch(error => {
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_file</title><path d="M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z" style="fill:#c5c5c5"/></svg>'
                })
        }

        treeNodeDiv.appendChild(icon)
        treeNodeDiv.appendChild(fileNameDiv)

        treeNodeDiv.classList.add('tree_node')

        treeNodeDiv.addEventListener('click', async () => {
            if (treeNode.isDirectory) {
                // 如果被展开,则关闭
                if (treeNode.isExpanded) {
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_folder</title><path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z" style="fill:#c09553"/></svg>'
                    this.closeFolder(treeNode.container)
                    treeNode.isExpanded = false
                } else {
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_folder_opened</title><path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" style="fill:#dcb67a"/><polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" style="fill:#dcb67a"/></svg>'
                    this.openFolder(treeNode.container)
                    treeNode.isExpanded = true
                    // 展开文件夹需要加载数据，然后渲染子文件
                    if (!treeNode.isLoaded) {
                        await this.treeDataProvider.getChildren(treeNode)
                        // 渲染子文件夹
                        this.rendererTreeView(treeNode)
                    }
                }
            } else {
                // 打开文件

            }
        })

        treeNode.container.appendChild(treeNodeDiv)
        return treeNode.container
    }

    private openFolder(html: HTMLElement) {
        html.classList.remove('hide-after-first')
    }

    private closeFolder(html: HTMLElement) {
        html.classList.add('hide-after-first')
    }
}