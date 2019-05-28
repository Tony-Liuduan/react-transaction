import React, { Component } from 'react';
import Topology from '../components/Topology';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    tick = () => {
        this.setState({
            count: this.state.count + 1
        });
        // this.setState({
        //     count: this.state.count + 2
        // });
    }

    render() {

        return (
            <div>
                <a href="/user.html">我的react</a>
                <br />
                <button onClick={this.tick}>点我</button>
                <div>count: {this.state.count}</div>
                <Topology />
            </div>

        );
    }

}
