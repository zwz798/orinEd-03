import { DefaultTreeDataProvider , TreeNode, DefaultTreeView} from './myTree'

document.addEventListener('DOMContentLoaded', async () => {
    const path = "d:/"
    // 以 / 为根节点
    const stats = await window.electronApi.readStat(path)
    const treeNode = new TreeNode(path, "", true, 0)
    
    // 数据提供者
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)
    await treeDataProdiver.getChildren()

    let treeView = new DefaultTreeView(treeDataProdiver)

    // 开始渲染
    treeView.renderRootView()

    document.body.appendChild(treeDataProdiver.getRoot().container) 
})
