import React, { Component } from 'react';
import Topology from '../components/Topology';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {

        return (
            <div>
                <a href="/user.html">我的react</a>
                <h1>Hello, react!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
                <Topology />
            </div>
        );
    }

}
