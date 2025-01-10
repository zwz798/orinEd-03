import { DefaultTreeDataProvider, TreeNode, } from './tree/treedata/TreeData'
import { DefaultTreeView } from './tree/treeview/TreeView'
import { DefaultTreeFileWatcher } from './tree/filewatcher/TreeFileWatcher'
import { TreeManager } from './tree/TreeManager'

document.addEventListener('DOMContentLoaded', async () => {
    // const path = "D:\\"
    // const stats = await window.electronApi.readStat(path)
    // const treeNode = new TreeNode(path, "", true, 0)

    // // 数据提供者
    // let treeDataProdiver = new DefaultTreeDataProvider(treeNode)
    // await treeDataProdiver.getChildren()

    // let treeView = new DefaultTreeView(treeDataProdiver)

    // // 开始渲染
    // treeView.rendererRootView()

    // document.body.appendChild(treeDataProdiver.getRoot().container) 

    // // 文件树监听
    // let watcher = new DefaultTreeFileWatcher()
    // watcher.watch(treeNode.path)

    // let node = treeDataProdiver.removeTreeNode("D:\\test")

    // if (node && node.parent) {
    //     console.log("重新渲染")
    //     treeView.rendererTreeNode(node.parent)
    // }

    const path = "D:\\"
    const treeNode = new TreeNode(path, "", true, 0)

    let treeView = new DefaultTreeView()
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)

    let treeManager = new TreeManager(treeView, treeDataProdiver)
    treeManager.initTreeView()
    let tree = treeManager.getView()

    document.body.appendChild(tree)
})
