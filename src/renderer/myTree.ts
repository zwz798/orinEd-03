import './tree.scss'
import { getSuffix } from './CommonUtils'
import { getIconPath } from './iconMap'

export class TreeNode {
    path: string
    icon?: string
    label: string
    isDirectory: boolean
    children: TreeNode[] = []
    parent?: TreeNode
    isLoaded: boolean = false
    isExpanded: boolean = false

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
    constructor(private root: TreeNode) { }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        // 有节点，查找他的子节点
        if (element) {
            if (element.isDirectory) {
                const treeNodes = await window.electronApi.readDirectory(window.electronApi.join(element.path, element.label))
                element.children = treeNodes
                element.isLoaded = true
                return treeNodes
            } else {
                return []
            }
        }

        // 无节点，返回根目录的子节点
        console.log(this.root.path)
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
    constructor(private treeDataProvider: ITreeDataProvider, private html: HTMLElement) {
        html.classList.add("tree")
    }

    async renderRootView() {
        this.html.innerHTML = ''
        await this.rendererTreeView(this.treeDataProvider.getRoot(), this.html, 0)
    }

    /**
     * 递归渲染树视图
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

        for (const childNode of childNodes) {
            const treeNodeDiv = this.rendererTreeNode(childNode, level + 1)
            html.appendChild(treeNodeDiv)

            if (childNode.isDirectory) {
                await this.rendererTreeView(childNode, treeNodeDiv, level + 1)
            }
        }
    }

    private rendererTreeNode(treeNode: TreeNode, level: number): HTMLElement {
        let iconPath = getIconPath(treeNode)

        const treeNodeDiv = document.createElement('div')
        treeNodeDiv.className = "container"
        const div = document.createElement('div')

        // 文件名
        const fileNameDiv = document.createElement('div')
        fileNameDiv.style.marginLeft = `${level * 8 + 25}px`
        fileNameDiv.style.position = 'relative'
        fileNameDiv.innerText = treeNode.label

        // 图标
        const icon = document.createElement('div')
        // icon.src = "../assets/icons/default_file.svg"
        icon.classList.add('icon')

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

        fileNameDiv.appendChild(icon)
        div.appendChild(fileNameDiv)

        div.classList.add('tree_node')

        div.addEventListener('click', async () => {
            if (treeNode.isDirectory) {
                // 如果被展开,则关闭
                if (treeNode.isExpanded) {
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_folder</title><path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z" style="fill:#c09553"/></svg>'
                    this.closeFolder(treeNodeDiv)
                    treeNode.isExpanded = false
                } else {
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>default_folder_opened</title><path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" style="fill:#dcb67a"/><polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" style="fill:#dcb67a"/></svg>'
                    this.openFolder(treeNodeDiv)
                    treeNode.isExpanded = true
                    // 展开文件夹需要加载数据，然后渲染子文件
                    if (!treeNode.isLoaded) {
                        await this.treeDataProvider.getChildren(treeNode)
                        // 渲染子文件夹
                        this.rendererTreeView(treeNode, treeNodeDiv, level + 1)
                    }
                }
            } else {
                // 打开文件

            }
        })

        treeNodeDiv.appendChild(div)
        return treeNodeDiv
    }

    private openFolder(html: HTMLElement) {
        html.classList.remove('hide-after-first')
    }

    private closeFolder(html: HTMLElement) {
        html.classList.add('hide-after-first')
    }
}