import React, { PureComponent } from 'react';


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
    constructor(x, y, r, color) {
        this.x = x
        this.y = y
        this.r = r,
            this.c = color ? color : this.getRandomColor()
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
        this.circleArray = [];
        this.circleNumber = 1;

    }

    componentDidMount() {
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
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
        return this.ctx.isPointInPath(mouse.x, mouse.y);
    }

    init = () => {
        const list = this.getXYR(this.minRay);
        this.drawLine();
        list.sort((a, b) => b.r - a.r).forEach(c => {
            this.drawOneCircle(c);
        });
    }

    draw = () => {
        this.circleNumber = 1;
        this.drawLine();
        this.circleArray.sort((a, b) => b.r - a.r).forEach(c => {
            this.drawOneCircle(c);
        });
    }

    clear = () => {
        this.ctx.clearRect(0, 0, this.dWidth, this.dHeight);
    }

    // 找到圆的坐标
    getXYR(minRay) {

        let x0 = this.dWidth / 2;
        let y0 = this.dHeight / 2;
        let r0 = this.radius[0];
        let r1 = this.radius[1];
        let n = this.total - 1;

        // 第一个点绘制在画面的中心
        if (this.total && this.circleArray.length === 0) {
            this.circleArray.push(new Circle(x0, y0, r0));
        }

        if (!n || n < 0) return this.circleArray;

        // 其他的圆坐标是围绕这个中心点上
        // 计算圆之间的夹角
        let list = [];
        let ang = 360 / n;
        let hu = 2 * Math.PI / 360;
        let maxRayX = x0 - r1;
        let maxRayY = y0 - r1;

        for (let i = 0; i < n; i++) {
            let hudu = hu * ang * i;
            let x1 = x0 + Math.sin(hudu) * minRay;
            // 注意此处是“-”号，因为我们要得到的Y是相对于（0,0）而言的。
            let y1 = y0 - Math.cos(hudu) * minRay;

            // 检查是否重叠
            if (i === 1 && minRay < Math.min(maxRayX, maxRayY)) {
                let pre = list[list.length - 1];
                let xSpan = x1 - pre.x;
                let ySpan = y1 - pre.y;
                let margin = Math.floor(Math.sqrt(Math.pow(xSpan, 2) + Math.pow(ySpan, 2))) - 2 * r1;
                if (margin <= this.minMargin) {
                    break;
                }
            }

            list.push(new Circle(x1, y1, r1));
        }

        // 检查是否需要扩大射线长度
        if (list.length < n) {
            let nextRay = Math.min(maxRayX, maxRayY, minRay * 1.2);
            return this.getXYR(nextRay);
        }

        this.circleArray = this.circleArray.concat(list);
        return this.circleArray;
    }

    drawOneCircle(c) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = c.c;
        ctx.fillStyle = c.c;
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.fillText('No:' + this.circleNumber, c.x - 12, c.y + 5);
        this.circleNumber++;
    }

    drawLine() {
        const ctx = this.ctx;

        let { x: x0, y: y0 } = this.circleArray[0];
        let list = this.circleArray.slice(1);

        list.forEach(({ x, y }) => {
            ctx.moveTo(x0, y0);
            ctx.lineTo(x, y);
            ctx.stroke();
        });
    }

    render() {
        return (
            <canvas ref={el => this.cvs = el} id="canvas" height={500} width={500} style={defaultStyle}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>
        )
    }

}


export default Topology;
