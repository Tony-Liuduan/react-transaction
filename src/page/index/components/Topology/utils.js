// 箭头方向，0:指向当前节点本身，1:指向连接节点
const ARROW_DRIECTION = [0, 1];

const formatData = (data) => {
    try {
        const {
            categories,
            edgeCategories,
            edges,
            nodes,
        } = data;

        /**
         * 字段说明：
         * categories：大类 $list
         * edgeCategories：连线上所需要展示的文案&&node的属性key，通过查找nodelist中对应的属性显示对应的value值 $list
         * edges：source 和 target 关系对象列表 $list
         * nodes：节点属性列表 $list
         */

        // step1: 根据edge获取每个节点对应的关系树
        let edgeTree = getRelationTreeByNodeId(edges);

        // step2: 获取节点map树
        let nodeTree = getNodeTree(nodes);

        return {
            categories,
            edgeCategories,
            edgeTree,
            nodeTree,
        };

    } catch (e) {
        return {};
    }
};


const getRelationTreeByNodeId = (edges) => {
    try {
        let tree = {};
        edges.forEach(edge => {
            let { source, target, ...props } = edge;

            let sourceData = {
                _node: target,
                _arrow: ARROW_DRIECTION[0],
                ...props,
            };

            let targetData = {
                _node: source,
                _arrow: ARROW_DRIECTION[1],
                ...props,
            };

            if (!tree[source]) tree[source] = [];
            if (!tree[target]) tree[target] = [];

            tree[source].push(sourceData);
            tree[target].push(targetData);
        });

        Object.keys(tree).forEach(key => {
            if (tree[key].length <= 1) delete tree[key];
        });

        return tree;
    } catch (e) {
        console.log(e);
        return {};
    }
};


const getNodeTree = (nodes) => {
    try {
        let tree = {};
        nodes.forEach(node => {
            tree[node.id] = node;
        });
        return tree;
    } catch (e) {
        console.log(e);
        return {};
    }
};



export default {
    ARROW_DRIECTION,
    formatData,
};