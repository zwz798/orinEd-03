// 定义树节点接口
interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    parent?: TreeNode;
    isDirectory: boolean;
    collapsed?: boolean;
}

// 定义事件发射器
class EventEmitter {
    private listeners: { [event: string]: Function[] } = {};

    on(event: string, callback: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(...args));
        }
    }
}

// 数据提供者接口
interface ITreeDataProvider {
    getChildren(element?: TreeNode): Promise<TreeNode[]>;
    getParent(element: TreeNode): TreeNode | undefined;
    onDidChangeTreeData: EventEmitter;
}

// 文件系统数据提供者实现
export class FileSystemProvider implements ITreeDataProvider {
    private root: TreeNode;
    onDidChangeTreeData = new EventEmitter();

    constructor(rootPath: string) {
        this.root = {
            id: rootPath,
            label: rootPath.split('/').pop() || '',
            isDirectory: true,
            collapsed: false
        };
    }

    async getChildren(element?: TreeNode): Promise<TreeNode[]> {
        // 这里应该实现实际的文件系统读取逻辑
        // 示例实现返回模拟数据
        if (!element) {
            return [this.root];
        }

        if (!element.isDirectory) {
            return [];
        }

        // 模拟异步读取文件系统
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: `${element.id}/folder1`,
                        label: 'folder1',
                        isDirectory: true,
                        parent: element,
                        collapsed: true
                    },
                    {
                        id: `${element.id}/file1.ts`,
                        label: 'file1.ts',
                        isDirectory: false,
                        parent: element
                    }
                ]);
            }, 100);
        });
    }

    getParent(element: TreeNode): TreeNode | undefined {
        return element.parent;
    }

    refresh(): void {
        this.onDidChangeTreeData.emit('changed');
    }
}

// 树视图类
export class TreeView {
    private container: HTMLElement;
    private dataProvider: ITreeDataProvider;
    private rootElement: HTMLElement;

    constructor(container: HTMLElement, dataProvider: ITreeDataProvider) {
        this.container = container;
        this.dataProvider = dataProvider;
        this.rootElement = document.createElement('div');
        this.rootElement.className = 'tree-view';
        this.container.appendChild(this.rootElement);

        this.dataProvider.onDidChangeTreeData.on('changed', () => {
            this.refresh();
        });

        this.render();
    }

    private async render() {
        this.rootElement.innerHTML = '';
        const roots = await this.dataProvider.getChildren();
        for (const root of roots) {
            await this.renderNode(root, this.rootElement, 0);
        }
    }

    private async renderNode(node: TreeNode, parent: HTMLElement, level: number) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'tree-node';
        nodeElement.style.paddingLeft = `${level * 20}px`;

        // 创建图标元素
        const iconElement = document.createElement('span');
        iconElement.className = `icon ${node.isDirectory ? 'folder' : 'file'}`;
        nodeElement.appendChild(iconElement);

        // 创建标签元素
        const labelElement = document.createElement('span');
        labelElement.textContent = node.label;
        nodeElement.appendChild(labelElement);

        parent.appendChild(nodeElement);

        if (node.isDirectory && !node.collapsed) {
            const children = await this.dataProvider.getChildren(node);
            for (const child of children) {
                await this.renderNode(child, parent, level + 1);
            }
        }

        // 为目录添加点击事件
        if (node.isDirectory) {
            nodeElement.addEventListener('click', async () => {
                node.collapsed = !node.collapsed;
                await this.render();
            });
        }
    }

    refresh(): void {
        this.render();
    }
}

// 使用示例
