import React from 'react';

const list = [
    100,
    1000,
    10000,
    20000,
];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            value: "",
        };

        this.num = 100;
    }

    handleUserInput = (e) => {
        let userInput = e.target.value;
        let newRowData = [];
        for (let i = 0; i < this.num; i++) {
            newRowData.push(i + ": " + userInput);
        }
        this.setState({
            rowData: newRowData,
            value: userInput,
        });
    }

    handleClick = (val) => {
        this.num = val;
        alert(val);
    }

    renderRows() {
        return this.state.rowData.map((val, index) => {
            return (
                <tr key={index}>
                    <td>{val}</td>
                </tr>
            );
        });
    }

    renderBtns() {
        return list.map((item, i) => {
            return (
                <button key={i} onClick={this.handleClick.bind(this, item)}>
                    更新{item}个
                </button>
            );
        });
    }

    render() {
        return (
            <div>
                {this.renderBtns()}
                <div>
                    <input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleUserInput}
                        style={{ border: "1px solid #000" }}
                    />
                </div>
                <table>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>

            </div>
        );
    }
}