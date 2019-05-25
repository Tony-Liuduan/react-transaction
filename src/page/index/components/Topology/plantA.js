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
//     radiu: Number, 圆的半径的数组，当fix为true时该值必须填
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

        this.fix = props.fix || true;
        this.minMargin = props.minMargin || 10;
        this.minRadius = props.minRadius || 30;
        this.radiu = props.radiu || 30;
        this.total = props.total || 30;
        this.circleArray = [];
        this.circleNumber = 1;
    }

    componentDidMount() {
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext("2d");
        this.dWidth = this.canvas.width;
        this.dHeight = this.canvas.height;
        this.init();
    }

    // 如果生成100次新圆都失败的话，终止方案。
    // 如果生成100种方案都没有合适可用的话，终止进程。
    init() {
        let n = 0
        while (this.circleArray.length < this.total) {
            this.circleArray = []
            let i = 0;
            while (this.circleArray.length < this.total) {
                this.createOneCircle()
                i++
                if (i >= 100) {
                    break;
                }
            }
            n++
            if (n > 100) {
                break;
            }
        }

        // 根据半径从大到小画圆。
        this.circleArray.sort((a, b) => b.r - a.r).forEach(c => {
            this.drawOneCircle(c)
        })

        console.log('circleNumber', this.circleNumber - 1)
    }

    // 生成一个圆，随机生成圆心。
    // 如果连续生成200次半径都没有合适的话，终止进程
    createOneCircle() {
        let x, y, r;
        let createCircleTimes = 0
        while (true) {
            createCircleTimes++
            x = Math.floor(Math.random() * this.dWidth)
            y = Math.floor(Math.random() * this.dHeight)
            let TR = this.getR(x, y)
            if (!TR) {
                continue;
            } else {
                r = TR
            }
            if (this.check(x, y, r) || createCircleTimes > 200) {
                break
            }

        }
        this.check(x, y, r) && this.circleArray.push(new Circle(x, y, r))
    }

    check(x, y, r) {
        return !(x + r > this.dWidth || x - r < 0 || y + r > this.dHeight || y - r < 0)
    }

    // 获取一个新圆的半径，主要判断半径与最近的一个圆的距离
    // 找到与当前坐标最近的圆，如果两个圆之间符合 （{最小半径 + 最小间距 + 最近圆的半径} <= 心之间的直线距离）就算符合要求的点
    getR(x, y) {
        if (this.circleArray.length === 0) return this.fix ? this.radiu : Math.floor(Math.random() * 10 + 30);
        let lenArr = this.circleArray.map(c => {
            let xSpan = c.x - x
            let ySpan = c.y - y
            return Math.floor(Math.sqrt(Math.pow(xSpan, 2) + Math.pow(ySpan, 2))) - c.r
        })

        let minCircleLen = Math.min(...lenArr)
        let tempR = this.fix ? this.radiu : minCircleLen - this.minMargin
        let bool = this.fix ? (tempR + this.minMargin <= minCircleLen) : (tempR >= this.minRadius)
        return bool ? tempR : false
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
        ctx.fillText('No:' + this.circleNumber, c.x - 10, c.y - 5);
        ctx.fillText('R:' + c.r, c.x - 10, c.y + 5);
        this.circleNumber++
    }

    render() {
        return (
            <canvas ref={el => this.canvas = el} height={500} width={500} style={defaultStyle}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>
        )
    }

}


export default Topology;
