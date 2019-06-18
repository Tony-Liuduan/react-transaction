import React, { Component } from 'react';
import Painter from 'page/d3/lib/painter';
import './index.scss';

const painter = new Painter();

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        painter.init();
        painter.paint();
    }

    render() {
        return <div className="d3-wrap">
            <svg className="svg-container"></svg>
            <div id="drillTip"></div>
        </div>
    }

}