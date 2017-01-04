/**
 * 富文本编辑器
 * 使用方法：给本组件添加ref值，如"rich"，外层组件通过refs.rich.handleValue()取得当前编辑器内的值
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Simditor from 'simditor'
import $ from 'jquery'
import  './simditor.css' 

const WYS = React.createClass({
   getDefaultProps(){
        return {
            tID:"textarea",
        }
    },
    //  componentWillReceiveProps(nextProps){//检测父组件state变化
    //     if (this.props.collectTime!=nextProps.collectTime) {
    //         let editValue=this.state.editor.getValue();
    // 	this.props.handleValue(editValue);
    //     };
    // },
    handleValue(){
    	let editValue=this.state.editor.getValue();
    	return editValue;
    },
   componentDidMount(){
       let tName =this.props.tID;
        var textbox = ReactDOM.findDOMNode(this.refs[tName]);
        var editor = new Simditor({
            textarea: $(textbox),
            toolbar: [
                        'title',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'fontScale',
                        'color',
                        'ol',          
                        'ul',             
                        'blockquote',
                        'code' ,         
                        'table',
                        'link',
                        'image',
                        'hr' ,            
                        'indent',
                        'outdent',
                        'alignment',
                      ],
        });
        if (typeof this.props.value ==='string') {
            editor.setValue(this.props.value);
        };
        this.setState({editor:editor});
   },
    render(){
        return <div {...this.props}>
	        <textarea ref={this.props.tID} />
	        </div>
    }
});

module.exports = WYS;