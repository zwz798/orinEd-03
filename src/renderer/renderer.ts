import { DefaultTreeDataProvider, TreeNode, } from './tree/treedata/TreeData'
import { DefaultTreeView } from './tree/treeview/TreeView'
import { TreeManager } from './tree/TreeManager'

document.addEventListener('DOMContentLoaded', async () => {
    const path = "D:\\"
    const treeNode = new TreeNode(path, "", true, 0)

    let treeView = new DefaultTreeView()
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)

    let treeManager = new TreeManager(treeView, treeDataProdiver)
    treeManager.initTreeView()
    let tree = treeManager.getView()

    document.body.appendChild(tree)
})