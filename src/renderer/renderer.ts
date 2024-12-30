import { DefaultTreeDataProvider , TreeNode, TreeView} from './myTree'

document.addEventListener('DOMContentLoaded', async () => {
    // 渲染的容器
    let container = document.createElement('div')
    document.body.appendChild(container)

    // 以 / 为根节点
    const treeNode = await window.electronApi.readStat('d:/')

    // 数据提供者
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)
    await treeDataProdiver.getChildren()

    let treeView = new TreeView(treeDataProdiver, container)

    // 开始渲染
    treeView.renderRootView()
})
