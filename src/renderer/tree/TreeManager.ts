import { ITreeDataProvider } from './treedata/TreeData'
import { ITreeView } from './treeview/TreeView'

export class TreeManager {
    private treeView: ITreeView
    private treeData: ITreeDataProvider

    constructor(treeView: ITreeView, treeData: ITreeDataProvider) {
        this.treeView = treeView
        this.treeData = treeData
    }

    async initTreeView() {
        this.treeView.setTreeDataProvider(this.treeData)
        let treeNodes = await this.treeData.getChildren()
        // 获取的节点都添加到监听

        this.treeView.rendererRootView()
    }

    getView(): HTMLElement {
        return this.treeData.getRoot().container
    }
}