/**
 * 绘图者
 * 
 */

// 临时写法 uuid
let uuid = 0;

/**
 * tudo
 * 1. 扩展后文字没有清空问题 - ok
 * 2. 两个中心点之间连接 - ok
 * 3. 查找一个点周边的点的范围
 * 
 */


export default class {
    constructor({
        cWidth = 600,
        cHeight = 600,
        edgeLength = 70,
        edgeMargin = 30,
        vertexRadius = 10,
        nodeRadius = 5,
        dataset = [],
    } = {}) {
        // 画布宽度
        this.cWidth = cWidth;

        // 画布高度
        this.cHeight = cHeight;

        // 中心点到子节点的距离
        this.edgeLength = edgeLength;

        // 相邻两个中心区域的margin距离
        this.edgeMargin = edgeMargin;

        // 中心点的半径
        this.vertexRadius = vertexRadius;

        // 子节点的半径
        this.nodeRadius = nodeRadius;

        // 节点数据
        this.dataset = dataset;

        // svg dom对象
        this.svg = null;

        // 中心点可能出现的坐标集合
        this.vertexPossibleSit = [];

        // 中心点之间的关系模型
        this.relationModel = [];

        this.getNewNodeData = this.getNewNodeData.bind(this);
    }

    // 画布初始化
    init(isFirst = true) {
        this.getVertexSits();
        this.getSvg();

        const _node = this.createNode();
        isFirst && this.updateDateset(_node);
    }

    // 初始化svg dom对象
    getSvg() {
        if (!d3) return;
        try {
            this.svg = d3.select('svg')
                .attr("width", this.cWidth)
                .attr("height", this.cHeight);

            // 隐藏 drillTip
            this.svg.on('click', () => {
                document.getElementById('drillTip').style.display = 'none';
            });
        } catch (e) {
            console.log(e);
        }
    }

    // 计算一个vertex所需要的空间长度
    getModuleData() {
        const moduleRadius = this.edgeLength + this.edgeMargin;
        const moduleLength = 2 * moduleRadius;
        return {
            moduleRadius,
            moduleLength,
        };
    }

    // 计算当前画布可布置的中心点坐标集合
    getVertexSits() {
        // 清空之前的数据
        this.vertexPossibleSit = [];

        // 计算一个vertex所需要的空间长度
        const {
            moduleRadius,
            moduleLength,
        } = this.getModuleData();

        // 计算当前画布能承载vertex个数的最大值
        const xCount = Math.floor(this.cWidth / moduleLength);
        const yCount = Math.floor(this.cHeight / moduleLength);

        for (let i = 0; i < xCount; i++) {

            let row = [];

            for (let j = 0; j < yCount; j++) {
                row.push({
                    x: ((i === 0) ? (i + 1) : (2 * i + 1)) * moduleRadius,
                    y: ((j === 0) ? (j + 1) : (2 * j + 1)) * moduleRadius,
                });
            }

            this.vertexPossibleSit.push(row);
        }
    }

    // 检查svg对象有效性
    validateSvg() {
        if (!this.svg) {
            let msg = d3 ? '没有找到svg dom对象!' : '请先引用d3.js!'
            alert(msg);
            return false;
        }
        return true;
    }

    // 生成节点
    createNode({ vertex, nodes } = {}) {
        uuid++;
        return {
            vertex: vertex || { id: uuid, name: `节点${uuid}` },
            nodes: nodes || Array(10).fill(null).map((d, i) => ({ id: `${uuid}-${i + 1}`, name: `节点${uuid}-${i + 1}` })),
        };
    }

    // 更新节点数据
    updateDateset(node) {
        try {
            if (!node) return;
            if (this.dataset.includes(node)) return;
            this.dataset.push(node);
        } catch (e) {
            console.log(e);
        }
    }

    // 绘制内容
    paint() {
        if (!this.validateSvg()) return;

        // 根据this.dataset长度 和 this.vertexPossibleSit长度，修改svg画布大小
        this.autoModifySvgSize();

        try {
            // 先清空画布
            this.svg.selectAll("*").remove();

            // 计算 中心节点-子节点
            this.dataset.forEach((dataItem, i) => {
                this.digitVertex(dataItem, i);
                this.digitNodes(dataItem);
                this.digitEdges(dataItem);
            });

            // 绘制 中心节点-中心节点，这里只需要画线，节点在下一步绘制，先画线，是为了让线在节点下面
            this.relationModel.forEach((dataItem, i) => {
                this.digitVertexEdges(dataItem, i);
                this.paintEdges(dataItem);
            });

            // 绘制 中心节点-子节点
            this.dataset.forEach((dataItem, i) => {
                this.paintEdges(dataItem);
                this.paintVerdex(dataItem);
                this.paintNodes(dataItem);
            });

        } catch (error) {
            console.log(error);
        }

    }

    // 计算中心点之间连线的端点坐标
    digitVertexEdges(dataItem, i) {
        const { source, target, id } = dataItem;

        dataItem.edges = [{
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
            id,
            pid: id,
            name: source.name + '-' + target.name,
        }];

    }

    // 计算中心点坐标
    digitVertex(dataItem, i) {
        let { x, y } = this.getPossiblePosition(i);

        dataItem.vertex.x = x;
        dataItem.vertex.y = y;
    }

    // 计算子节点坐标
    digitNodes(dataItem) {

        /* function randomOffset() {
            var arc = Math.random() * 2 * Math.PI;
            var offsetX = Math.cos(arc) * this.edgeLength;
            var offsetY = Math.sin(arc) * this.edgeLength;
            return { offsetX, offsetY };
        } */

        const divideOffset = (i, n) => {
            var arc = 2 * Math.PI * (i + 1) / n;
            var offsetX = Math.cos(arc) * this.edgeLength;
            var offsetY = Math.sin(arc) * this.edgeLength;
            return { offsetX, offsetY, arc };
        }

        dataItem.nodes.forEach((item, i) => {
            var { offsetX, offsetY, arc } = divideOffset(i, dataItem.nodes.length); //randomOffset();
            item.x = dataItem.vertex.x + offsetX;
            item.y = dataItem.vertex.y + offsetY;
            item.arc = arc;
            item.pid = dataItem.vertex.id;
        });

        dataItem.id = dataItem.vertex.id;
    }

    // 计算线段端点的坐标
    digitEdges(dataItem) {
        dataItem.edges = dataItem.nodes.map(item => {
            var x1 = dataItem.vertex.x;
            var y1 = dataItem.vertex.y;
            var x2 = item.x;
            var y2 = item.y;
            var id = dataItem.vertex.id + '-' + item.id;
            var pid = dataItem.vertex.id;
            var name = dataItem.vertex.name + '-' + item.name;
            return { x1, y1, x2, y2, id, pid, name };
        })
    }

    // 绘制中心点
    paintVerdex(dataItem) {
        var query = `circle[id="${dataItem.vertex.id}"]`;
        this.svg.selectAll(query)
            .data([dataItem.vertex])
            .join("circle")
            .attr("id", d => d.id)
            .attr("cy", function (d, i) { return d.y; })
            .attr("cx", function (d, i) { return d.x; })
            .attr("r", this.vertexRadius)
            .exit()
            .remove()
        //.call(dragPoint)
    }

    // 绘制子节点
    paintNodes(dataItem) {
        const me = this;

        // drag handler
        function dragStarted(d) {
            d3.select(this).raise().classed("active", true);
        }
        function dragEnded(d) {
            d3.select(this).classed("active", false);
        }
        function dragged(d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y);
            me.digitEdges(dataItem);
            me.paintEdges(dataItem);
        }
        var dragRelative = d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);


        // mouse over handler
        function handleMouseOver(d, i) {
            d3.select(this)
                .attr("fill", "orange")
                .attr("r", me.nodeRadius * 1.4);

            function calcTextX() {
                let count = 0;
                d.name.split('').forEach(aChar => {
                    let isAlphabel = /[0-9a-z]/i.test(aChar);
                    count = count + (isAlphabel ? 0.5 : 1);
                });
                let offset = (d.arc > Math.PI / 2) && (d.arc < Math.PI * 3 / 2) ? count * (-15) : 0;
                return d.x + 20 * Math.cos(d.arc) + offset;
            }

            function calcTextY() {
                let offset = (d.arc > Math.PI / 3) && (d.arc < Math.PI * 2 / 3) ? (10) : 0;
                return d.y + 20 * Math.sin(d.arc) + offset;
            }

            // Specify where to put label of text
            me.svg.append("text")
                .attr("id", "t" + d.id)
                .attr("x", calcTextX)
                .attr("y", calcTextY)
                .text(function () {
                    return [d.name];
                });
        }

        // mouse out handler
        function handleMouseOut(d, i) {
            d3.select(this)
                .attr("fill", "black")
                .attr("r", me.nodeRadius);
            d3.select("#t" + d.id).remove();
        }

        // click handler
        function handleClick(d, i) {
            let { clientX, clientY } = d3.event;
            let div = document.getElementById('drillTip');
            div.innerHTML = '拓展此node';
            div.onclick = function () {
                div.style.display = 'none';
                me.getNewNodeData(d, i);
            }
            div.setAttribute('style', `display: block; position: absolute; top: ${clientY}px; left: ${clientX}px; border: 1px solid red;`);
            d3.event.stopPropagation();
        }


        var query = `circle[pid="${dataItem.vertex.id}"]`;
        this.svg.selectAll(query)
            .data(dataItem.nodes, d => d.id)
            .join("circle")
            .attr("id", d => d.id)
            .attr("cy", function (d, i) { return d.y; })
            .attr("cx", function (d, i) { return d.x; })
            .attr("r", me.nodeRadius)
            .attr("pid", d => d.pid)
            .call(dragRelative)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)
            .exit()
            .remove()

    }

    // 绘制边线
    paintEdges(dataItem) {
        var query = `line[pid="${dataItem.id}"]`;
        this.svg.selectAll(query)
            .data(dataItem.edges, d => d.id)
            .join("line")
            .style("stroke", "gray")
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2)
            .attr("id", d => d.id)
            .attr("pid", d => d.pid)
    }

    // 根据this.dataset长度 和 this.vertexPossibleSit长度，修改svg画布大小
    autoModifySvgSize() {
        const dataL = this.dataset.length;
        const moduleL = this.vertexPossibleSit.reduce((accumulator, row) => accumulator + row.length, 0);

        if (dataL <= moduleL) return;

        // 计算一个vertex所需要的空间长度
        const {
            //moduleRadius,
            moduleLength,
        } = this.getModuleData();

        // 计算 水平/垂直 方向的长度
        const baseN = Math.sqrt(dataL);
        const w = Math.ceil(baseN) * moduleLength;
        const h = Math.round(baseN) * moduleLength;

        this.cWidth = w;
        this.cHeight = h;

        // 重置svg
        this.init(false);
    }

    // 获取当前绘制中心点坐标
    getPossiblePosition(i) {

        // todo：查找中心模块位置，根据中心模块向外扩展
        const rowL = this.vertexPossibleSit.length;
        const centerXIndex = Math.ceil(rowL / 2) - 1;
        const centerYIndex = Math.ceil(this.vertexPossibleSit[centerXIndex].length / 2) - 1;

        let currentXIndex, currentYIndex;

        if (i === 0) {
            currentXIndex = centerXIndex;
            currentYIndex = centerYIndex;
        }

        else if (i === 1) {
            currentXIndex = centerXIndex - 1;
            currentYIndex = centerYIndex;
        }

        else if (i === 2) {
            currentXIndex = centerXIndex + 1;
            currentYIndex = centerYIndex;
        }

        else if (i === 3) {
            currentXIndex = centerXIndex;
            currentYIndex = centerYIndex - 1;
        }

        else if (i === 4) {
            currentXIndex = centerXIndex;
            currentYIndex = centerYIndex + 1;
        }

        else if (i === 5) {
            currentXIndex = centerXIndex - 1;
            currentYIndex = centerYIndex - 1;
        }

        else if (i === 6) {
            currentXIndex = centerXIndex + 1;
            currentYIndex = centerYIndex - 1;
        }

        else if (i === 7) {
            currentXIndex = centerXIndex - 1;
            currentYIndex = centerYIndex + 1;
        }

        else if (i === 8) {
            currentXIndex = centerXIndex + 1;
            currentYIndex = centerYIndex + 1;
        }

        else {
            alert('todo: 9个以上的(' + (i + 1) + ')还么开发，努力思考中...');
            currentXIndex = centerXIndex;
            currentYIndex = centerYIndex;
        }

        return this.vertexPossibleSit[currentXIndex][currentYIndex];
    }


    // 节点关联反查
    getNewNodeData(d, i) {
        setTimeout(() => {
            try {
                const node = this.createNode();

                this.updateDateset(node);

                // 获取当前的中心节点
                const target = this.dataset.filter(item => item.id === d.pid);
                target[0].nodes.splice(i, 1);

                this.updateRelationModel(target[0].vertex, node.vertex);

                this.paint();
            } catch (e) {
                console.log(e);
            }
        }, 200);
    }

    // 创建关联节点 source:出发点，target:终点
    updateRelationModel(source, target) {
        let id = `${source.id}-${target.id}`;
        let hadId = this.relationModel.find(item => item.id === id);
        !hadId && this.relationModel.push({
            source,
            target,
            id,
        });
    }

}