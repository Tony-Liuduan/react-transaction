import React, { PureComponent } from 'react';
import utils from './utils';
import testData from 'mock/data.test.json';
import userData from 'mock/data.user.json';
import saleData from 'mock/data.sale.json';
import auditData from 'mock/data.audit.json';


const defaultStyle = {
    border: '1px solid #d3d3d3'
};

// 参数
// let obj = {
//     id: string, // canvas 的id
//     fix: boolean, // 是否固定半径，默认为false
//     minMargin: Number, // 两个圆的最短距离，默认为10
//     minRadius: Number, 最小的圆半径，默认为30
//     radiu: Array, 圆的半径的数组，当fix为true时该值必须填
//     total: Number ，圆的个数，默认为10
// }

class Circle {
    constructor(x, y, r, props, hudu = 0) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.c = this.getRandomColor();
        this.hudu = hudu;
        Object.assign(this, props);
    }
    getRandomColor() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return `rgb(${r},${g},${b})`
    }
}

class Topology extends PureComponent {

    constructor(props) {
        super(props);
        this.radius = props.radiu || [20, 15];
        this.total = props.total || 10;
        this.minMargin = props.minMargin || 10;
        this.minRay = props.minRay || 80;

        this.pointMap = {};
        this.circleArray = [];
        this.circleNumber = 1;
    }

    componentDidMount() {
        this.sourceData = utils.formatData(userData.data);
        console.log(this.sourceData)

        const saleSourceData = utils.formatData(saleData.data);
        console.log(saleSourceData)

        Object.assign(this.sourceData.edgeTree, saleSourceData.edgeTree);
        Object.assign(this.sourceData.nodeTree, saleSourceData.nodeTree);
        console.log(this.sourceData)

        const canvas = document.getElementById('canvas');
        if (!canvas) return;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.dWidth = this.canvas.width;
        this.dHeight = this.canvas.height;
        this.init();

        canvas.addEventListener("mousedown", this.handleMousedown);

    }

    componentWillUnmount() {
        this.canvas.removeEventListener('mousedown', this.handleMousedown);
    }

    handleMousedown = (e) => {
        console.log('mousedown')
        e.preventDefault();
        let mouse = {
            x: e.clientX - canvas.getBoundingClientRect().left,
            y: e.clientY - canvas.getBoundingClientRect().top
        };

        let len = this.circleArray.length;
        for (let i = 0; i < len; i++) {
            let shape = this.circleArray[i];
            let offset = {
                x: mouse.x - shape.x,
                y: mouse.y - shape.y
            };
            if (this.isMouseInGraph(mouse, shape)) {
                let handleMousemove = (e) => {
                    let mouse = {
                        x: e.clientX - canvas.getBoundingClientRect().left,
                        y: e.clientY - canvas.getBoundingClientRect().top
                    };
                    shape.x = mouse.x - offset.x;
                    shape.y = mouse.y - offset.y;
                    // 重新绘制图形
                    this.clear();
                    this.draw();
                }
                let handleMouseup = function (e) {
                    canvas.removeEventListener('mousemove', handleMousemove)
                    canvas.removeEventListener('mouseup', handleMouseup)
                }

                canvas.addEventListener('mousemove', handleMousemove)
                canvas.addEventListener('mouseup', handleMouseup)
                break;
            }
        }
    }

    isMouseInGraph = (mouse, shape) => {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
        return ctx.isPointInPath(mouse.x, mouse.y);
    }

    init = () => {
        this.getGroupXY();
        this.draw();
    }

    draw = () => {
        this.circleNumber = 1;
        Object.keys(this.pointMap).forEach(key => {
            this.pointMap[key].forEach((item, i) => {
                this.drawLine(item, this.pointMap[key][this.pointMap[key].length - 1]);
                this.drawOneCircle(item);
            })
        })
    }

    clear = () => {
        this.ctx.clearRect(0, 0, this.dWidth, this.dHeight);
    }

    getGroupXY() {
        try {
            const tree = Object.keys(this.sourceData.edgeTree);
            const len = tree.length;
            tree.forEach((key, index) => {
                const child = this.sourceData.edgeTree[key];
                this.getCenterXY(len, key, index);
                this.getAffixXY(this.minRay, key, child);
            });
        } catch (e) {
            console.error(e);
        }
    }

    getCenterXY(len = 1, id = '', index = 0) {
        try {
            let x = this.dWidth / (len + 1) * (index + 1);
            let y = this.dHeight / (len + 1) * (index + 1);
            let r = this.radius[0];
            this.pointMap[id] = [new Circle(x, y, r, this.sourceData.nodeTree[id])];
        } catch (e) {
            console.error(e);
        }
    }

    // 找到圆的坐标
    getAffixXY(minRay, key = '', child = []) {
        try {
            let r = this.radius[1];
            let n = child.length;
            let origin = this.pointMap[key][0];
            let getNode = i => this.sourceData.nodeTree[child[i]['_node']];

            if (n <= 0) return;

            // 其他的圆坐标是围绕这个中心点上
            // 计算圆之间的夹角
            let list = [];
            let ang = 360 / n;
            let hu = 2 * Math.PI / 360;
            let maxRayX = origin.x - r;
            let maxRayY = origin.y - r;

            for (let i = 0; i < n; i++) {
                let hudu = hu * ang * i;
                let x = origin.x + Math.sin(hudu) * minRay;
                // 注意此处是“-”号，因为我们要得到的Y是相对于（0,0）而言的。
                let y = origin.y - Math.cos(hudu) * minRay;

                // 检查是否重叠
                if (i === 1 && minRay < Math.min(maxRayX, maxRayY)) {
                    let pre = list[list.length - 1];
                    let xSpan = x - pre.x;
                    let ySpan = y - pre.y;
                    let margin = Math.floor(Math.sqrt(Math.pow(xSpan, 2) + Math.pow(ySpan, 2))) - 2 * r;
                    if (margin <= this.minMargin) {
                        break;
                    }
                }

                list.push(new Circle(x, y, r, getNode(i), hudu));
            }

            // 检查是否需要扩大射线长度
            if (list.length < n) {
                let nextRay = Math.min(maxRayX, maxRayY, minRay * 1.2);
                return this.getAffixXY(nextRay, key, child);
            }

            this.pointMap[key] = list.concat(this.pointMap[key]);
        } catch (e) {
            console.error(e);
        }
    }

    drawOneCircle(c) {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = c.c;
        ctx.fillStyle = c.c;
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        this.drawText(c);
    }

    drawLine(target, origin) {
        const ctx = this.canvas.getContext("2d");
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }

    drawText(c) {
        const ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.hudu);
        ctx.fillStyle = 'black';
        let len = c.name.length;
        let margin = len * 6 / 2;
        ctx.fillText(c.name, - margin, 6);
        ctx.restore();
    }

    render() {
        return (
            <canvas ref={el => this.cvs = el} id="canvas" height={window.innerHeight - 190} width={window.innerWidth - 20} style={defaultStyle}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>
        )
    }

}


export default Topology;
