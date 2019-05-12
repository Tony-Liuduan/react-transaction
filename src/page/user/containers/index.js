/** @jsx Ldreact.createElement */
import Ldreact, { Component } from 'ldreact';



//const App = (props) => <div name={props.name}>{props.name}</div>



class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
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
        // this.setState({
        //     date: new Date()
        // });
    }

    render() {

        return (
            <div>
                <a href="/index.html">原生react</a>
                <h1>Hello, ldreact!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }

}


export default App