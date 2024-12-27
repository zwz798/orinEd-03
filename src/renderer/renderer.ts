import { TreeView, FileSystemProvider } from "./tree";

document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const fileSystemProvider = new FileSystemProvider('/root');
    const treeView = new TreeView(container, fileSystemProvider);
});