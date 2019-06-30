import React from 'react'


export default class Test extends React.PureComponent {


    render() {
        console.log('child test render ~~~~~~~~~~~~~')
        return <div style={this.props.style}>
            test
        </div>
    }
}