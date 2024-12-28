import { DefaultTreeDataProvider , TreeNode, TreeView} from "./myTree";

document.addEventListener('DOMContentLoaded', async () => {
    // 渲染的容器
    const container = document.createElement('div');
    document.body.appendChild(container)

    const treeNode = await window.electronApi.readStat("/")
    // 数据提供者
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)
    await treeDataProdiver.getChildren()
    let treeView = new TreeView(treeDataProdiver)

    // 开始渲染
    treeView.renderRootView(container)
});
