import React from 'react'
import './style.css'
const c = React.createClass({
    render(){
        const {children} = this.props;
        let ul = '';
        let li = React.Children.map(children, child=><li>{child}</li>);
        li.reverse();
        if (li) {
            ul = <ul className="clearfix">{li}</ul>
        }
        return <div className = "comp-toolbar">
            {ul}
        </div>
    }
});

module.exports = c;