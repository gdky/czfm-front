import React from 'react'
import BaseTable from 'component/compBaseTable'
import model from './modelSwsxx'

const c  = React.createClass({
    getDefaultProps(){
        return {
            data:{}
        }
    },
    render(){
        let {data} = this.props;
        return <BaseTable data = {data}  model ={model} bordered striped />
    }

});

module.exports = c;