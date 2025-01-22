import { DefaultTreeDataProvider } from './tree/treedata/TreeData'
import { TreeNode } from '../share/treeNode'
import { DefaultTreeView } from './tree/treeview/TreeView'
import { TreeManager } from './tree/TreeManager'

console.log("renderer start......")

document.addEventListener('DOMContentLoaded', async () => {
    const path = 'D:\\'
    const treeNode = new TreeNode(path, '', true, 0)

    let treeView = new DefaultTreeView()
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)

    let treeManager = new TreeManager(treeView, treeDataProdiver)
    treeManager.initTreeView()
    let tree = treeManager.getView()

    document.body.appendChild(tree)
})