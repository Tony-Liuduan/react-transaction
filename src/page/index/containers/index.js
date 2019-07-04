import React, { Component } from 'react';
import AAA from './AAA';
// import Topology from '../components/Topology';


export default class App extends Component {
    // 触发时机：props || state改变时触发，在will
    // 这个getDerivedStateFromProps是一个静态函数，所以函数体内不能访问this，
    // 这时一个纯函数，纯函数输出完全由输入决定。
    // 目的：强制开发者在render之前只做无副作用的操作，而且能做的操作局限在根据props和state决定新的state而已
    // 用来替换willMount、willRecviewProps、willUpdate 三个有副作用的生命周期钩子
    static getDerivedStateFromProps(nextProps, prevState) {
        // 老实做一个运算就行，别在这里搞什么别的动作。别搞Fetch在这里
        console.log("getDerivedStateFromProps", nextProps, prevState);
        // 根据nextProps和prevState计算出预期的状态改变，返回结果会被送给setState
        return {
            a: 1,
            //test: false,
        }
    }

    // 在render后update前执行，可以获取到dom变更前的快照
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log("getSnapshotBeforeUpdate", document.getElementById('span'))
        return document.getElementById('span');
    }

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            test: true,
        };
    }
    
    // componentWillReceiveProps(nextProps) {
        
    // }

    // componentWillMount() {
    //     console.log('Will Mount');
    // }

    componentDidMount() {
        console.log('Did Mount');
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate', snapshot, document.getElementById('span'))
    }

    tick = (e) => {
        // e.persist();
        // setTimeout(() => {
        //     console.log(e.target);
        // }, 0);

        console.log('handleClickNumber', e.target);
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
        //     this.setState((state) => ({
        //         count: state.count + 1
        //     }), () => {
        //         console.log(1, this.state.count);
        //     });
        //     this.setState((state) => ({
        //         count: state.count + 1
        //     }), () => {
        //         console.log(2, this.state.count);
        //     });

        //     this.setState((state) => ({
        //         test: !state.test,
        //     }));
        // }, 0);

    }

    handleDiv = e => {
        console.log('handleWrapDiv');
        // this.setState((state) => ({
        //     count: 100,
        // }));
    }

    handleBtn = e => {
        e.stopPropagation();
        console.log('handleBtn');
    }

    render() {
        console.error('render', this.state);
        return <div className="wrap" onClick={this.handleDiv}>
            <p onClick={this.tick}>
                {this.state.count}
            </p>

            <button onClick={this.handleBtn}>
                {
                    this.state.test && <span id="span">我出现了</span>
                }
            </button>

            <AAA a={this.state.count}></AAA>
        </div>

    }

}


// 模拟react event
/* console.group('react event');
console.log('react event start');

var reELe = document.createElement('react')
var event = document.createEvent('Event');
event.initEvent('react-click', false, false);
reELe.addEventListener('react-click', function (e) {
    console.log('react event run addEventListener callback')
}, false);

reELe.dispatchEvent(event);

console.log('react event end');
console.groupEnd(); */