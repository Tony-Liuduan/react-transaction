import React, { Component } from 'react';
import './index.scss';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        init();
        main();
    }

    render() {
        return <div className="d3-wrap">
            <svg className="svg-container"></svg>
            <div id="drillTip"></div>
        </div>
    }

}

var dataset = [];


function populateData(vertex) {
    dataset.push({
        'vertex': { id: 0, name: '张1', },
        'nodes': Array(50).fill(null).map((d, i) => ({ id: i + 1, name: '张' + (i + 1) })),
    });
}

function populateData2(vertex) {
    dataset.push({
        'vertex': { id: 20, name: '张20', },
        'nodes': Array(50).fill(null).map((d, i) => ({ id: i + 51, name: '张' + (i + 51) })),
    });
}


var CONSTANTS = {
    SVG_WIDTH: 600,
    SVG_HEIGHT: 600,
    VERTEX_RADIUS: 10,
    NODES_RADIUS: 5,
    EDGE_LENGTH: 70,
    EDGE_MARGIN: 30,

    VERTEX_POSSIBLE_SITES: [],
};


var svg = null;

populateData({ id: 0, name: '张一', });


function init() {
    CONSTANTS.VERTEX_POSSIBLE_SITES = [];

    // 计算当前canvas能承载vertex的最大值
    var xCount = CONSTANTS.SVG_WIDTH / (2 * (CONSTANTS.EDGE_LENGTH + CONSTANTS.EDGE_MARGIN));
    var yCount = CONSTANTS.SVG_HEIGHT / (2 * (CONSTANTS.EDGE_LENGTH + CONSTANTS.EDGE_MARGIN));

    for (let i = 0; i < yCount; i++) {

        let row = [];

        for (let j = 0; j < xCount; j++) {
            row.push({
                x: ((j === 0) ? (j + 1) : (2 * j + 1)) * (CONSTANTS.EDGE_LENGTH + CONSTANTS.EDGE_MARGIN),
                y: ((i === 0) ? (i + 1) : (2 * i + 1)) * (CONSTANTS.EDGE_LENGTH + CONSTANTS.EDGE_MARGIN),
            })
        }

        CONSTANTS.VERTEX_POSSIBLE_SITES.push(row);
    }

    console.log(CONSTANTS.VERTEX_POSSIBLE_SITES)
}




function main() {
    svg = d3.select('svg')
        .attr("width", CONSTANTS.SVG_WIDTH)
        .attr("height", CONSTANTS.SVG_HEIGHT);

    // 隐藏 drillTip
    svg.on('click', () => {
        document.getElementById('drillTip').style.display = 'none';
    });

    dataset.forEach((dataItem, i) => {
        digitVertex(dataItem, i);
        digitNodes(dataItem);
        digitEdges(dataItem);

        console.log(dataset);

        paintEdges(dataItem);
        paintVerdex(dataItem);
        paintNodes(dataItem);

    })

}



function digitVertex(dataItem, i) {

    function getPossiblePosition(i) {
        let x, y;

        if (i === 0) {
            x = CONSTANTS.VERTEX_POSSIBLE_SITES[1][1].x;
            y = CONSTANTS.VERTEX_POSSIBLE_SITES[1][1].y;
        } else {
            x = CONSTANTS.VERTEX_POSSIBLE_SITES[1][2].x;
            y = CONSTANTS.VERTEX_POSSIBLE_SITES[1][2].y;
        }

        return { x, y };
    }



    let { x, y } = getPossiblePosition(i);

    dataItem.vertex.x = x;
    dataItem.vertex.y = y;
}



function digitNodes(dataItem) {

    function randomOffset() {
        var arc = Math.random() * 2 * Math.PI;
        var offsetX = Math.cos(arc) * CONSTANTS.EDGE_LENGTH;
        var offsetY = Math.sin(arc) * CONSTANTS.EDGE_LENGTH;
        return { offsetX, offsetY };
    }

    function divideOffset(i, n) {
        var arc = 2 * Math.PI * (i + 1) / n;
        var offsetX = Math.cos(arc) * CONSTANTS.EDGE_LENGTH;
        var offsetY = Math.sin(arc) * CONSTANTS.EDGE_LENGTH;
        return { offsetX, offsetY, arc };
    }

    dataItem.nodes.forEach((item, i) => {
        var { offsetX, offsetY, arc } = divideOffset(i, dataItem.nodes.length); //randomOffset();
        item.x = dataItem.vertex.x + offsetX;
        item.y = dataItem.vertex.y + offsetY;
        item.arc = arc;
        item.pid = dataItem.vertex.id;
    })
}



function digitEdges(dataItem) {
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



function paintVerdex(dataItem) {
    var query = `circle[id="${dataItem.vertex.id}"]`;
    svg.selectAll(query)
        .data([dataItem.vertex])
        .join("circle")
        .attr("id", d => d.id)
        .attr("cy", function (d, i) { return d.y; })
        .attr("cx", function (d, i) { return d.x; })
        .attr("r", CONSTANTS.VERTEX_RADIUS)
        .exit()
        .remove()
    //.call(dragPoint)
}



function paintNodes(dataItem) {

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
        digitEdges(dataItem);
        paintEdges(dataItem);
    }
    var dragRelative = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);


    // mouse over handler
    function handleMouseOver(d, i) {
        d3.select(this)
            .attr("fill", "orange")
            .attr("r", CONSTANTS.NODES_RADIUS * 1.4);

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
        svg.append("text")
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
            .attr("r", CONSTANTS.NODES_RADIUS);
        d3.select("#t" + d.id).remove();
    }


    // click handler
    function handleClick(d, i) {
        let { clientX, clientY } = d3.event;
        let div = document.getElementById('drillTip');
        div.innerHTML = '拓展此node';
        div.onclick = function () {
            div.style.display = 'none';
            populateData2(d);

            dataset[0].nodes.splice(19, 1);

            main();
        }
        div.setAttribute('style', `display: block; position: absolute; top: ${clientY}px; left: ${clientX}px; border: 1px solid red;`);
        d3.event.stopPropagation();
    }


    var query = `circle[pid="${dataItem.vertex.id}"]`;
    svg.selectAll(query)
        .data(dataItem.nodes, d => d.id)
        .join("circle")
        .attr("id", d => d.id)
        .attr("cy", function (d, i) { return d.y; })
        .attr("cx", function (d, i) { return d.x; })
        .attr("r", CONSTANTS.NODES_RADIUS)
        .attr("pid", d => d.pid)
        .call(dragRelative)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)
        .exit()
        .remove()

}



function paintEdges(dataItem) {
    var query = `line[pid="${dataItem.vertex.id}"]`;
    svg.selectAll(query)
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


