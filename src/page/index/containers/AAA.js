import React from 'react';


class AAA extends React.Component {
    state = {
        value: 'init'
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return 'foo';
    }

    componentDidUpdate(preProps, preState, snapshot) {
        if (this.props.a !== preProps.a) {
            console.warn("AAA componentDidUpdate", preProps, this.props, snapshot)
            setTimeout(() => {
                this.setState({
                    value: this.props.a
                });
            }, 0);
        }
    }

    render() {
        console.warn("AAA render", this.props)
        return <div>
            我是AAA组件
            我的value值是：{this.state.value}
        </div>
    }
}

export default AAA;