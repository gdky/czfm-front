import React from 'react'
import {Button,Icon} from 'antd'
import './style.css'
const ButtonGroup = Button.Group;
const toolbar = React.createClass({
  addNode(){
    this.props.addNode();
  },
  removeNode(){
    this.props.removeNode();
  },
  render(){
    return <div className="toolbar">
      <ButtonGroup>
        <Button onClick={this.addNode}>
          添加节点
        </Button>
        <Button onClick={this.removeNode}>
          删除节点
        </Button>
      </ButtonGroup>
    </div>
  }
})

module.exports = toolbar;