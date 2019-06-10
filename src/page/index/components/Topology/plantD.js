import React, { PureComponent } from 'react';
import echarts from 'echarts';


import testData from 'mock/data.test.json';
import userData from 'mock/data.user.json';
import saleData from 'mock/data.sale.json';
import auditData from 'mock/data.audit.json';


const NODE__LINK__KEY = 'name';
const defaultStyle = {
    border: '1px solid #d3d3d3'
};


class Topology extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const myChart = echarts.init(this.cvs);
        this.myChart = myChart;
        const options = {
            "series": [
                {
                    "itemStyle": {
                        "normal": {
                            "label": {
                                "show": true
                            },
                            "borderType": "solid",
                            "borderColor": "rgba(182,215,0,0.5)",
                            "borderWidth": 2,
                            "opacity": 0.8
                        },
                        "emphasis": {
                            "borderWidth": 5,
                            "borderType": "solid",
                            "borderColor": "#40f492"
                        }
                    },
                    "lineStyle": {
                        "normal": {
                            "color": "rgba(182,0,255,0.5)",
                            "width": "3",
                            "type": "dotted",
                            "curveness": 0.1,
                            "opacity": 1
                        }
                    },
                    "label": {
                        "normal": {
                            "show": true,
                            "position": "top",
                            "formatter": function (args) {
                                if (args.data.nodeType === 1) {
                                    return "{prefixClassName|" + args.data.legendName + "}";
                                } else {
                                    return "{prefixClassName|" + args.data.legendName + " :}\r\n    " + args.name;
                                }
                            },
                            "rich": {
                                "prefixClassName": {
                                    color: "#FF9301",
                                    fontWeight: "bold"
                                }
                            }
                        }
                    },
                    "layout": "force",
                    "roam": true,
                    "edgeSymbolSize": [
                        8,
                        10
                    ],
                    "edgeSymbol": [
                        "circle",
                        "arrow"
                    ],
                    "focusNodeAdjacency": false,
                    "force": {
                        "repulsion": 300,
                        "edgeLength": 50
                    },
                    "links": [
                        {
                            "source": "3****************3",
                            "target": "3****************3-bank-card"
                        },
                        {
                            "source": "3****************3-bank-card",
                            "target": "工行卡:4077"
                        },
                        {
                            "source": "3****************3-bank-card",
                            "target": "建行卡:4078"
                        },
                        {
                            "source": "3****************3",
                            "target": "3****************3-basic-info"
                        },
                        {
                            "source": "3****************3-basic-info",
                            "target": "张三"
                        },
                        {
                            "source": "3****************3",
                            "target": "3****************3-contact"
                        },
                        {
                            "source": "3****************3-contact",
                            "target": "145157****@qq.com"
                        },
                        {
                            "source": "3****************3-contact",
                            "target": "14515783**"
                        },
                        {
                            "source": "14515783**",
                            "target": "3****************3-bank-card"
                        }
                    ],
                    "categories": [
                        {
                            "name": "用户"
                        },
                        {
                            "name": "身份证"
                        },
                        {
                            "name": "姓名"
                        },
                        {
                            "name": "性别"
                        },
                        {
                            "name": "生日"
                        },
                        {
                            "name": "手机"
                        },
                        {
                            "name": "固定电话"
                        },
                        {
                            "name": "邮箱"
                        },
                        {
                            "name": "qq"
                        },
                        {
                            "name": "地址"
                        },
                        {
                            "name": "银行卡"
                        },
                        {
                            "name": "基本信息"
                        },
                        {
                            "name": "地址分类"
                        },
                        {
                            "name": "联系方式"
                        },
                        {
                            "name": "银行卡分类"
                        }
                    ],
                    "name": "人员关系图",
                    "type": "graph",
                    "showSymbol": true,
                    "yAxisIndex": 0,
                    "z": 2,
                    "data": [
                        {
                            "name": "3****************3",
                            "symbolSize": 40,
                            "value": "3****************3",
                            "category": 0,
                            "draggable": true,
                            "label": {
                                "normal": {
                                    "show": true,
                                    "position": "inside"
                                }
                            },
                            "legendName": "用户",
                            "nodeType": 0,
                            "idCardNum": "3****************3"
                        },
                        {
                            "name": "3****************3-bank-card",
                            "symbolSize": 40,
                            "value": "银行卡分类",
                            "category": 14,
                            "draggable": true,
                            "label": {
                                "normal": {
                                    "show": true,
                                    "position": "inside"
                                }
                            },
                            "legendName": "银行卡分类",
                            "nodeType": 1
                        },
                        {
                            "name": "工行卡:4077",
                            "symbolSize": 20,
                            "value": "工行卡:4077",
                            "category": 10,
                            "draggable": true,
                            "legendName": "银行卡",
                            "nodeType": 0
                        },
                        {
                            "name": "建行卡:4078",
                            "symbolSize": 20,
                            "value": "建行卡:4078",
                            "category": 10,
                            "draggable": true,
                            "legendName": "银行卡",
                            "nodeType": 0
                        },
                        {
                            "name": "3****************3-basic-info",
                            "symbolSize": 40,
                            "value": "基本信息",
                            "category": 11,
                            "draggable": true,
                            "label": {
                                "normal": {
                                    "show": true,
                                    "position": "inside"
                                }
                            },
                            "legendName": "基本信息",
                            "nodeType": 1
                        },
                        {
                            "name": "张三",
                            "symbolSize": 20,
                            "value": "张三",
                            "category": 2,
                            "draggable": true,
                            "legendName": "姓名",
                            "nodeType": 0
                        },
                        {
                            "name": "3****************3-contact",
                            "symbolSize": 40,
                            "value": "联系方式",
                            "category": 13,
                            "draggable": true,
                            "label": {
                                "normal": {
                                    "show": true,
                                    "position": "inside"
                                }
                            },
                            "legendName": "联系方式",
                            "nodeType": 1
                        },
                        {
                            "name": "145157****@qq.com",
                            "symbolSize": 20,
                            "value": "145157****@qq.com",
                            "category": 7,
                            "draggable": true,
                            "legendName": "邮箱",
                            "nodeType": 0
                        },
                        {
                            "name": "14515783**",
                            "symbolSize": 40,
                            "value": "14515783**",
                            "category": 8,
                            "draggable": true,
                            "legendName": "qq",
                            "nodeType": 1
                        }
                    ]
                }
            ],
            "legend": {
                "data": [
                    "用户",
                    "身份证",
                    "姓名",
                    "性别",
                    "生日",
                    "手机",
                    "固定电话",
                    "邮箱",
                    "qq",
                    "地址",
                    "银行卡",
                    "基本信息",
                    "地址分类",
                    "联系方式",
                    "银行卡分类"
                ]
            },
        };
        //将options添加到mychart中
        myChart.setOption(options);
        myChart.on('click', this.toggleShowNodes);
    }

    componentWillUnmount() {
    }

    getEchatOptions = () => this.myChart.getOption();

    // 查找叶子节点方法
    getLeafNodes(parentNodeId, linkMap) {
        try {
            const { source, target } = linkMap;
            const sourceList = source[parentNodeId];
            const targetList = target[parentNodeId];

            // 1. 该节点没有作为source过，一直都是target节点，返回空数组，不进行任何操作
            if (!sourceList) return [];

            // 2. 该节点只作为source，没有做过target, 递归返回所有与之有关的节点
            if (!targetList) {
                let list = [];
                function dg(sourceList) {
                    sourceList.forEach(leaf => {
                        !list.includes(leaf) && list.push(leaf);

                        let leafSourceList = source[leaf];
                        leafSourceList && dg(leafSourceList);
                    });
                }
                dg(sourceList)
                return list;
            }

            // 3. 该节点既是source又是target
            let list = [];
            function dg(sourceList) {
                sourceList.forEach(leaf => {
                    // 判断这个子节点是否有作为别人的子节点
                    let leafTargetList = target[leaf];
                    if (leafTargetList && leafTargetList.length > 1) return;

                    !list.includes(leaf) && list.push(leaf);

                    let leafSourceList = source[leaf];
                    leafSourceList && dg(leafSourceList);
                });
            }
            dg(sourceList)

            return list;

        } catch (e) {
            console.log(e);
            return [];
        }
    }

    // 切换节点列表的显示隐藏
    switchNodes = (nodes, data) => {
        try {
            data.forEach(item => {
                if (nodes.includes(item[NODE__LINK__KEY])) {
                    item.category = -1 * item.category;
                }
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /** 
         * 展开或关闭节点 
         * @param chart 
         * @param node
         */
    toggleShowNodes = (node) => {
        const chart = this.myChart;

        const { [NODE__LINK__KEY]: parentNodeId, seriesIndex } = node;
        const options = this.getEchatOptions();
        const { links, data } = options.series[seriesIndex];


        // 格式化links
        const linkMap = this.linkMap || formatLinks(links);
        this.linkMap = linkMap;
        // 格式化nodes
        const nodeMap = this.nodeMap || formatNodes(data);
        this.nodeMap = nodeMap;


        // 获取需求改变现实状态的 子节点列表
        const needChangeNodeList = this.getLeafNodes(parentNodeId, linkMap);
        // 显示|隐藏 子节点
        const success = this.switchNodes(needChangeNodeList, data)
        // 重绘
        success && chart.setOption(options);
    }


    render() {
        return (
            <canvas
                ref={el => this.cvs = el}
                id="canvas"
                height={window.innerHeight - 190}
                width={window.innerWidth - 20}
                style={defaultStyle}
            >
                Your browser does not support the HTML5 canvas tag.
            </canvas>
        )
    }

}


export default Topology;



function formatLinks(links) {
    let sources = {};
    let targets = {};
    let nodes = [];

    links.forEach(({ source, target }) => {
        if (!sources[source]) sources[source] = [];
        if (!sources[source].includes(target)) sources[source].push(target);

        if (!targets[target]) targets[target] = [];
        if (!targets[target].includes(source)) targets[target].push(source);

        if (!nodes.includes(source)) nodes.push(source);
        if (!nodes.includes(target)) nodes.push(target);
    });

    return {
        source: sources,
        target: targets,
        nodes
    };
}

function formatNodes(nodes) {
    let map = {};
    nodes.forEach(node => {
        let key = node[NODE__LINK__KEY];
        map[key] = node;
    });
    return map;
}