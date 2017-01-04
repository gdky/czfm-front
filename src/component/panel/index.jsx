import React from 'react'
import {Row,Col,Button,Icon} from 'antd'
import './style.css'

const panel = React.createClass({
    getDefaultProps(){
        return ({
            closable: false,
            title: '',
            smalltitle:'',
            toolbar: '',
            className:'',
            onClose(){}
        })
    },
    getInitialState(){
        return ({
            closed: false
        })
    },
    handleClose(e){
        e.preventDefault();
        this.setState({
            closed: true
        });
        this.props.onClose.call(this, e);
    },

    render(){
        let {title,closable} = this.props;
        let pt = null;
        if (title) {
            pt = <div className="panel-title">
                <Row>
                    <Col span="12"><h3>{title}</h3></Col>
                </Row>
            </div>;
        }

        return this.state.closed ? null : (<div className={'panel '+this.props.className}>
            {pt}
            <div className="panel-body">
                {this.props.children}
            </div>
        </div>)
    }
});

module.exports = panel;
