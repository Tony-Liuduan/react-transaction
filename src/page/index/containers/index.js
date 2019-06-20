import React, { Component } from 'react';
// import Topology from '../components/Topology';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            test: true,
        };
    }

    componentWillMount() {
        console.log('Will Mount');
    }

    componentDidMount() {
        console.log('Did Mount');
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidUpdate() {
        console.log('componentDidUpdate')
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

        this.setState((state) => ({
            test: !state.test,
        }));

        // setTimeout(() => {
        //     console.log(e.target);
        // }, 0);
    }

    handleDiv = e => {
        console.log('handleDiv');
        // this.setState((state) => ({
        //     count: 100,
        // }));
    }

    handleBtn = e => {
        e.stopPropagation();
        console.log('handleBtn');
    }

    render() {
        return <div className="wrap" onClick={this.handleDiv}>
            <p onClick={this.tick}>
                {this.state.count}
            </p>

            <button onClick={this.handleBtn}>
                {
                    this.state.test && <span>我出现了</span>
                }
            </button>
        </div>

    }

}


// 模拟react event
console.group('react event');
console.log('react event start');

var reELe = document.createElement('react')
var event = document.createEvent('Event');
event.initEvent('react-click', false, false);
reELe.addEventListener('react-click', function (e) {
    console.log('react event run addEventListener callback')
}, false);

reELe.dispatchEvent(event);

console.log('react event end');
console.groupEnd();