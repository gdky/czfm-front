import React from 'react'
import {Row,Col,Form,Checkbox,Button,Input,DatePicker,Modal,InputNumber  } from 'antd'
import {SelectorCSNum,SelectorMZ,SelectorXL,SelectorZZMM,SelectorXB,
    SelectorZW,SelectorIS,SelectorZYSWSZXYY,SelectorJGXZ,SelectorRSLB,SelectorISGZ} from 'component/compSelector'
import './untils.js'
import Model from './model.js' 

const createForm = Form.create;
const InputGroup = Input.Group;
const TrWrapper = React.createClass({
    render(){
        return <tr>{this.props.children}</tr>
    }
})

let baseTable = React.createClass({
    // componentWillReceiveProps(nextProps){//检测父组件state变化
    //     if (this.props.re!=nextProps.re) {
    //         this.handleReset();
    //     };
    // },
     getDefaultProps(){
        return {
            nbsj:[],
        }
    },
    getInitialState(){
        return {

        wysS:[]
        }
    },
    handleReset(e) {
        this.props.form.resetFields();
    },
    valueReset(e){
        e.preventDefault();
        this.props.valueReset();
    },

    handleSubmit(){
        this.props.form.validateFieldsAndScroll((errors, values) => {//条件校验处理
              if (!!errors) {
                    Modal.info({ title: '提示', content: (<div><p><b>请检查所有必填项是否填写和格式是否正确</b></p> </div>)});
                return;
            }

            let value = values;
            //重构内部机构设置的传递类型
            let nbjgsz=[];
            let nbjgszbg=[];
            if (!!this.props.nbjgsz) {
                for (let i = 0; i < this.props.nbjgsz.rowNum; i++) {
                    let nbzsRow=[];
                    let target=[];
                    if (this.props.nbsj.length>0) {
                        let dat=this.props.nbsj[i];
                         for (let key in dat) {
                            target.push(dat[key]);
                        };
                    };
                    for (let j = 0;j < this.props.nbjgsz.rows.length; j++) {
                        let prop = this.props.nbjgsz.rows[j];
                        let values=value[prop.dataIndex+'_'+(i+1)+'_'+j];
                        nbzsRow.push(!values?null:values);
                        if (!!target) {
                            let sCol = (this.props.nbjgsz.startCol>0?this.props.nbjgsz.startCol:0);
                            if (values!=target[j+sCol]) {//是否变更数据
                                    nbjgszbg.push(i+'_'+j);
                            };  
                        };
                        delete value[prop.dataIndex+'_'+(i+1)+'_'+j];
                    }
                    nbjgsz.push(nbzsRow);
                }
                if (!this.props.bglx) {
                    value.nbjgsz=nbjgsz;
                }
            }
            if (this.props.bglx) {
            let ls = [];
            const old = this.props.data;
            for(let key in value){
                    if(Object.prototype.toString.call(value[key])=="[object Date]"){//时间格式化
                        let dd = value[key].Format("yyyy-MM-dd");
                        value[key]=dd;
                    };
                    if(Object.prototype.toString.call(value[key])=="[object Undefined]"){
                        value[key]=null;
                    };
                    if (old[key]!=value[key]) {//是否变更数据
                                if(Object.prototype.toString.call(value[key])=="[object Number]"){//变更项代码--名称转换
                                ls.push({mc:Model.props[key],jzhi:Model.dzb[key][old[key]],xzhi:Model.dzb[key][value[key]]});
                            }else{
                                ls.push({mc:Model.props[key],jzhi:old[key],xzhi:value[key]});
                            };
                    };
            };
            if (ls.length!=0||nbjgszbg.length!=0) {
                value.bgjl=ls;
                if (!!this.props.nbjgsz) {
                    value.nbjgsz=nbjgsz;
                }
                this.props.onSubmit(value);
            }else{
                Modal.info({ title: '提示', content: (<div><p>没有数据更新，请检查后提交</p> </div>)});
                return;
            };
        }else{
                for(let key in value){
                    if(Object.prototype.toString.call(value[key])=="[object Date]"){//时间格式化
                            let dd = value[key].Format("yyyy-MM-dd");
                            value[key]=dd;
                        };
                    if(Object.prototype.toString.call(value[key])=="[object Undefined]"){
                        value[key]=null;
                    };
                };
                let wys=this.state.wysS;
                if (wys.length>0) {
                    for(let i=0;i<wys.length;i++){
                        let name=wys[i];
                        value[name]=this.refs[name].handleValue();
                    }
                };
                this.props.onSubmit(value);
        };

            });
    },
    showConfirm(e) {
            e.preventDefault();
            let that=this;
              Modal.confirm({
                title: this.props.title,
                content: this.props.content,
                onOk() {
                  that.handleSubmit();
                },
              });
            },
    getLetValues(){
        return this.props.form.getFieldsValue();
    },
    render(){
        const { getFieldProps } = this.props.form;
        let colCount = 0;
        const colgroup = [];
        const tr = [];
        let td = [];
        this.state.wysS=[];
        const colGroupNum = this.props.model.colGroupNum < 5 ? this.props.model.colGroupNum : 2
        //设置colgroup样式
        for (let i = 0; i < colGroupNum; i++) {
            let spanKey = 24 / (colGroupNum * 3);
            let spanValue = 24 * 2 / (colGroupNum * 3);
            if (colGroupNum == 3) {
                spanKey = 3;
                spanValue = 5;
            }
            colgroup.push(<col key={'c-k-'+i} className={'col-'+spanKey}></col>);
            colgroup.push(<col key={'c-v-'+i} className={'col-'+spanValue}></col>);
        }
        //将实体内容以key:value放置到对应的td组中，再按照colGroupNum分列
        for (let i = 0; i < this.props.model.props.length; i++) {
            let prop = this.props.model.props[i];
            //处理跨列项目
            if (prop.groupspan) {
                if (colGroupNum < colCount + prop.groupspan) {
                    tr.push(<TrWrapper key={'tr-'+tr.length+1}>{td}</TrWrapper>);
                    td = [];
                    colCount = 0;
                }
                 if (prop.required) {
                td.push(<td key={'td-k-'+prop.id} style={{'width':'200px'}} className="prop-name"><span style={{'color':'red',fontSize:'large'}}>*</span>{prop.name}</td>);
                }else{
                td.push(<td key={'td-k-'+prop.id} style={{'width':'200px'}} className="prop-name">{prop.name}</td>);
                };
                if (!!prop.inputType) {
                    switch(prop.inputType){
                        case "date":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><DatePicker disabled={prop.disabled} { ...getFieldProps(prop.id, {rules: [{ type: prop.type,required: !!prop.required}]})}></DatePicker></td>);break;
                        case "cs":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorCSNum labelInValue disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorCSNum></td>);break;
                        case "mz":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorMZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorMZ></td>);break;
                        case "xl":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorXL disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorXL></td>);break;
                        case "xb":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorXB disabled={prop.disabled} style={{'width':prop.width?prop.width:'100px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorXB></td>);break;
                        case "zzmm":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorZZMM disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZZMM></td>);break;
                        case "zw":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorZW disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZW></td>);break;
                        case "is":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorIS disabled={prop.disabled} style={{'width':prop.width?prop.width:'100px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorIS></td>);break;
                        case "number":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><InputNumber style={{'width':prop.width?prop.width:'200px'}} disabled={prop.disabled} { ...getFieldProps(prop.id, { rules: [{ required: !!prop.required}]})}></InputNumber></td>);break;
                        case "textarea":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1}  ><Col span={prop.span?prop.span:20}><Input disabled={prop.disabled} type="textarea" rows={prop.rows} { ...getFieldProps(prop.id, { rules: [{ required: !!prop.required}]})}></Input></Col></td>);break;
                        case "wys":
                                 let  WYS =require('component/compWYSIHtml');
                                 let wys=this.state.wysS;
                                 wys.push(prop.id);
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1}  ><WYS ref={prop.id} style={{'width':prop.width?prop.width:'100%',}} value={this.props.data[prop.id]}/></td>);break;
                        case "zyzxyy":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorZYSWSZXYY disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZYSWSZXYY></td>);break;
                        case "jgxz":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorJGXZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorJGXZ></td>);break;
                        case "rslb":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorRSLB disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorRSLB></td>);break;
                        case "isgz":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorISGZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorISGZ></td>);break;
                         case "unInput":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ></td>);break;
                    }
                }else{
                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><Input style={{'width':prop.width?prop.width:'200px'}} disabled={prop.disabled} { ...getFieldProps(prop.id, { rules: [{type: prop.type, required: !!prop.required}]})}></Input></td>);
                };
                colCount += prop.groupspan
                //处理非跨列项目
            } else {
                if (prop.required) {
                td.push(<td key={'td-k-'+prop.id} style={{'width':'200px'}} className="prop-name"><span style={{'color':'red',fontSize:'large'}}>*</span>{prop.name}</td>);
                }else{
                td.push(<td key={'td-k-'+prop.id} style={{'width':'200px'}} className="prop-name">{prop.name}</td>);
                };
                if (!!prop.inputType) {
                    switch(prop.inputType){
                        case "date":
                                 td.push(<td key={'td-v-'+prop.id}><DatePicker disabled={prop.disabled} { ...getFieldProps(prop.id, {rules: [{ type: prop.type,required: !!prop.required}]})}></DatePicker></td>);break;
                        case "cs":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorCSNum disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorCSNum></td>);break;
                        case "mz":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorMZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorMZ></td>);break;
                        case "xl":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorXL disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorXL></td>);break;
                        case "xb":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorXB disabled={prop.disabled} style={{'width':prop.width?prop.width:'100px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorXB></td>);break;
                        case "zzmm":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorZZMM disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZZMM></td>);break;
                        case "zw":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorZW disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZW></td>);break;
                        case "is":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorIS disabled={prop.disabled} style={{'width':prop.width?prop.width:'100px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorIS></td>);break;
                        case "number":
                                 td.push(<td key={'td-v-'+prop.id}><Input style={{'width':prop.width?prop.width:'200px'}} disabled={prop.disabled} { ...getFieldProps(prop.id, { rules: [{ required: !!prop.required}]})}></Input></td>);break;
                        case "textarea":
                                 td.push(<td key={'td-v-'+prop.id} ><Col span={prop.span?prop.span:20}><Input disabled={prop.disabled} type="textarea" rows={prop.rows} { ...getFieldProps(prop.id, { rules: [{ required: !!prop.required}]})}></Input></Col></td>);break;
                        case "zyzxyy":
                                 td.push(<td key={'td-v-'+prop.id}><SelectorZYSWSZXYY disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorZYSWSZXYY></td>);break;
                        case "password":
                                 td.push(<td key={'td-v-'+prop.id}><Input style={{'width':prop.width?prop.width:'200px'}} disabled={prop.disabled} type="password" { ...getFieldProps(prop.id, { rules: [{type: prop.type, required: !!prop.required}]})}></Input></td>);break;
                        case "jgxz":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorJGXZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorJGXZ></td>);break;
                        case "rslb":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorRSLB disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorRSLB></td>);break;
                        case "isgz":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ><SelectorISGZ disabled={prop.disabled} style={{'width':prop.width?prop.width:'200px'}} { ...getFieldProps(prop.id, { rules: [{ type: prop.type,required: !!prop.required}]})}></SelectorISGZ></td>);break;
                        case "unInput":
                                 td.push(<td key={'td-v-'+prop.id} colSpan={prop.groupspan*2-1} ></td>);break;
                    }
                }else{
                 td.push(<td key={'td-v-'+prop.id}><Input style={{'width':prop.width?prop.width:'200px'}} disabled={prop.disabled} { ...getFieldProps(prop.id, { rules: [{type: prop.type, required: !!prop.required}]})}></Input></td>);
                };
                colCount += 1;
            }
            if (colCount == colGroupNum) {
                tr.push(<TrWrapper key={'tr-'+tr.length+1}>{td}</TrWrapper>);
                td = [];
                colCount = 0;
            } else if (i == this.props.model.props.length - 1) {
                tr.push(<TrWrapper key={'tr-'+tr.length+1}>{td}</TrWrapper>);
            }
        }
        let nbzs=[];
        if (!!this.props.nbjgsz) {
            nbzs.push(<tr className="nbjgsz" key="0004"><td key="0004" colSpan='10' style={{textAlign:'left'}}>{!this.props.nbTitle?null:this.props.nbTitle}</td></tr>);
            let nbzsRow=[];
            for (let i = 0; i < this.props.nbjgsz.rowNum+1; i++) {
                if (i==0) {
                    let nbzsCol=[];
                    for (let j = 0;j < this.props.nbjgsz.rows.length; j++) {
                        let prop = this.props.nbjgsz.rows[j];
                        nbzsCol.push(<td key={'td-title-'+prop.dataIndex} style={{'width':prop.width?prop.width:'auto',textAlign:'center'}} className="prop-name">{prop.title}</td>);
                    };
                    nbzsRow.push(<TrWrapper key={'tr-nbjgsz'+i}>{nbzsCol}</TrWrapper>);
                    continue
                };
                let target=[];
                if (this.props.nbsj.length>0) {
                    let dat=this.props.nbsj[i-1];
                     for (let key in dat) {
                        target.push(dat[key]);
                    };
                };
                let nbzsCol=[];
                    for (let j = 0;j < this.props.nbjgsz.rows.length; j++) {
                        let prop = this.props.nbjgsz.rows[j];
                        if (!!target) {
                        let sCol = (this.props.nbjgsz.startCol>0?this.props.nbjgsz.startCol:0);
                        nbzsCol.push(<td key={'td-nbjgsz-'+prop.dataIndex} className="prop-name"><Input { ...getFieldProps(prop.dataIndex+'_'+i+'_'+j,{ initialValue: target[j+sCol]})}/></td>);
                        }else{
                        nbzsCol.push(<td key={'td-nbjgsz-'+prop.dataIndex} className="prop-name"><Input { ...getFieldProps(prop.dataIndex+'_'+i+'_'+j)}/></td>);
                        };
                    };
                    nbzsRow.push(<TrWrapper key={'tr-nbjgsz'+i}>{nbzsCol}</TrWrapper>);
            };
            nbzs.push(<tr key="0009"><td key="0010" colSpan='10' ><div key="0005"><table key="0006"> <tbody key="0007">{nbzsRow}</tbody></table></div></td></tr>);
        };
        return <div className={'base-table '+
             (this.props.bordered?'table-bordered ':' ')+
             (this.props.striped?'table-striped ':' ')}>
            <table>
                <colgroup>
                     {colgroup}
                </colgroup>
                <tbody key="0001">
                {tr}
                </tbody>
                <tbody key="0002">
                    {nbzs}
                </tbody>
                <tbody key="0003">
                    <tr key="0005"><td key="0005" colSpan='10'><div style={{float:'right'}}>
                        <Button type="primary"  htmlType="submit" onClick={this.props.showConfirm?this.showConfirm:this.handleSubmit} disabled={this.props.disabled} loading={this.props.submitLoading}>提交</Button>
                        {this.props.reset?<span ><span className="ant-divider"></span><Button type="ghost"  htmlType="submit" onClick={this.handleReset} >重置</Button></span>:null}
                        {this.props.valueReset?<span ><span className="ant-divider"></span><Button type="ghost"  htmlType="submit" onClick={this.valueReset} >重置</Button></span>:null}
                    </div></td></tr>
                </tbody>
                
            </table>
        </div>
    }
})
baseTable = createForm({
    mapPropsToFields(props) {
        let result = {};
        for (let i = 0; i < props.model.props.length; i++) {
            let prop = props.model.props[i];
            if (prop.inputType=="date") {
                let dd = null;
                if (!!props.data[prop.id]) {
                         dd = new Date(props.data[prop.id].toString().replace(/-/g, "/"));
                 };
                result[prop.id] = {value: dd};
            }else if (prop.inputType=="number") {
                let num = null;
                if (!!props.data[prop.id]) {
                         num = String(props.data[prop.id]);
                 };
                result[prop.id] = {value: num};
            }else{
            result[prop.id] = {value: props.data[prop.id]}
            };
        };
        if (!!props.nbjgsz) {
            for(let j=0;j<props.nbjgsz.rowNum;j++){
                for (let k = 0;k < props.nbjgsz.rows.length; k++) {
                    let prop = props.nbjgsz.rows[k];
                    result[prop.dataIndex+'_'+j+'_'+k] = {value: props.data[prop.dataIndex+'_'+j+'_'+k]}
                }
            }
        }
        return result;
    }
})(baseTable);
module.exports = baseTable;