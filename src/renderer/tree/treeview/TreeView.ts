import './tree.scss'
import { getIconPath } from '../../iconMap'
import { ITreeDataProvider } from '../treedata/TreeData'
import { TreeNode } from '../../../share/treeNode'

export interface ITreeView {
    rendererRootView(): void
    setTreeDataProvider(treeDataProdiver: ITreeDataProvider): void
    rendererTreeNode(treeNode: TreeNode): void
}

export class DefaultTreeView implements ITreeView {
    private treeDataProvider!: ITreeDataProvider

    setTreeDataProvider(treeDataProdiver: ITreeDataProvider): void {
        this.treeDataProvider = treeDataProdiver
    }

    async rendererRootView() {
        this.refreshRootContainer()
        await this.rendererTreeView(this.treeDataProvider.getRoot())
    }

    private refreshRootContainer() {
        this.treeDataProvider.getRoot().container.innerHTML = ''
        this.treeDataProvider.getRoot().container.classList.add('tree')
    }

    /**
     * 递归渲染树视图
     * @param node 节点
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
        treeNodeDiv.style.display = 'flex'
        // 文件名
        const fileNameDiv = document.createElement('div')
        fileNameDiv.classList.add('file_name')
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
                    console.log(error)
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