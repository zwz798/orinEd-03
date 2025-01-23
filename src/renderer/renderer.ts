import { DefaultTreeDataProvider } from './tree/treedata/TreeData'
import { TreeNode } from '../share/treeNode'
import { DefaultTreeView } from './tree/treeview/TreeView'
import { TreeManager } from './tree/TreeManager'

document.addEventListener('DOMContentLoaded', async () => {
    const path = 'D:\\'
    const treeNode = new TreeNode(path, '', true, 0)

    let treeView = new DefaultTreeView()
    let treeDataProdiver = new DefaultTreeDataProvider(treeNode)
    treeDataProdiver.onFileChanged()

    let treeManager = new TreeManager(treeView, treeDataProdiver)
    await treeManager.initTreeView()
    let tree = treeManager.getView()
    
    document.body.appendChild(tree)
})