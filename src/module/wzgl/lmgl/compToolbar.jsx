import React from 'react'
import {Button,Icon} from 'antd'
import './style.css'
const ButtonGroup = Button.Group;
const toolbar = React.createClass({
  addPnode(){
    this.props.addPnode();
  },
  addNode(){
    this.props.addNode();
  },
  removeNode(){
    this.props.removeNode();
  },
  render(){
    return <div className="toolbar">
      <ButtonGroup>
      <Button onClick={this.addPnode}>
          添加主栏目
        </Button>
        <Button onClick={this.addNode}>
          添加栏目
        </Button>
        <Button onClick={this.removeNode}>
          删除栏目
        </Button>
      </ButtonGroup>
    </div>
  }
})

module.exports = toolbar;