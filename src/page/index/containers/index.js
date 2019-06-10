import React, { Component } from 'react';
// import Topology from '../components/Topology';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    componentWillMount() {
        console.log('Will Mount');
    }

    componentDidMount() {
        console.log('Did Mount');
    }

    tick = (e) => {
        // e.persist();
        console.log('tick', e.target)
        this.setState((state) => ({
            count: state.count + 1
        }), () => {
            console.log(1, this.state.count);
        });
        this.setState((state) => ({
            count: state.count + 1
        }), () => {
            console.log(2, this.state.count);
        });

        setTimeout(() => {
            console.log(e.target);
        }, 0);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
    }

    render() {

        return <div onClick={this.tick}>测试文本: {this.state.count}</div>

    }

}


/* 

var reELe = document.createElement('react')
var event = document.createEvent('Event');
event.initEvent('react-click', false, false);
reELe.addEventListener('react-click', function (e) {
    console.warn('react test')
}, false);

reELe.dispatchEvent(event);

 */