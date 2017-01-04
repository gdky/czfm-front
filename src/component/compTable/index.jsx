/**
 * 单实体数据表格展示组件
 * @props.data {Object} 实体数据集
 * @props.model {Object} 描述实体的属性定义，以及每行显示的属性组数
 * @props.header {Object} 描述表格的表头列
 * @props.bordered {boolean} 是否有边框
 * @props.loading {Object} 是否加载数据
 * 参考用法: const demo = <CompTable data={data} model={model} header={header} loading={loading} bordered/>
 */
import React from 'react'
import ReactDom from 'react-dom'
import {Spin,Icon} from 'antd'
import './style.css'

const compTable = React.createClass({
    onClick(value){
        this.props.onColumnClick;
    },

    //渲染空数据
    getEmptyText() {
    const data = this.props.dataSource;
    return !data.length ? (
      <div className={`compTable-empty`}>
        <span><Icon type="frown" />暂无数据</span>
      </div>
    ) : null;
    },
    render(){
        let headerCol=this.props.header;//表头列
        let columns=this.props.columns;//数据列
        let datalist=this.props.dataSource;//数据集
        let size=this.props.size;
        let headerCount = headerCol.length;//表头列的个数
        let colCount = columns.length;//数据列的个数
        let sizeClass="ant-table-large";
        const colgroup = [];
        const th=[];
        const tr = [];
        let td = [];
        let lbj=0;//列序号
        let rowbj=1;//行序号
        let xCol=[];//记录合并行的列
        let xCount=0;//需要添加计算的列数
        const bodyStyle={};//表格style
        const tableStyle = {};
        const scroll=this.props.scroll;
        if(size=="small"){
            sizeClass="ant-table-small";
        }else if(size=="middle"){
            sizeClass="ant-table-middle";
        }

        if(scroll){
        if(scroll.x){
            bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
        }
        if (scroll.y) {
            bodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
            bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
        }
        if (scroll.x === true) {
          tableStyle.tableLayout = 'fixed';
        } else {
          tableStyle.width = scroll.x;
        }
        }
        //渲染colgroup
        for (let i = 0; i < colCount; i++) {
            colgroup.push(<col key={'col-'+columns[i].key}></col>);
        }
        
        //渲染表格表头
        for(let i=0;i<headerCount;i++){
            let colSpan=headerCol[i].colSpan;
            let rowSpan=headerCol[i].rowSpan;
            if(!colSpan){colSpan=1};
            if(!rowSpan){rowSpan=1};
            if(rowSpan>1){xCol.push({row:rowSpan-1,col:colSpan})};
            if(rowSpan==1){
                if(colSpan==1){
                    td.push(<th key={headerCol[i].key} >{headerCol[i].title}</th>);
                }else{
                    td.push(<th key={headerCol[i].key} colSpan={colSpan}>{headerCol[i].title}</th>);
                }
            }else{
                if(colSpan==1){
                    td.push(<th key={headerCol[i].key} rowSpan={rowSpan}>{headerCol[i].title}</th>);
                }else{
                    td.push(<th key={headerCol[i].key} rowSpan={rowSpan} colSpan={colSpan}>{headerCol[i].title}</th>);
                }
            }
            lbj+=colSpan;
            if(lbj%colCount==0){
                th.push(<tr key={rowbj}>{td}</tr>);
                lbj=0;
                rowbj++;
                for(let j=0;j<xCol.length;j++){
                if(xCol[j].row>0){ xCount+=xCol[j].col;}}
                lbj+=xCount;
                for(let j=0;j<xCol.length;j++){
                xCol[j].row=xCol[j].row-1}
                xCount=0;
                td=[];
            }
        }
          
        //渲染数据
        if(datalist.length==0){
            td.push(<td key="empty"  colSpan={colCount} style={{height:"100px"}}>
            {this.getEmptyText()}
            </td>);
            tr.push(<tr key="empty" className="ant-table-row  ant-table-row-level-0" >{td}</tr>);
            td=[];
        }else{
            for(let i=0;i<datalist.length;i++){
                let record=datalist[i];
                let index=i;
                let key=index;
                const rowKey=this.props.rowKey;
                if(typeof rowKey === 'function'){
                    key=rowKey(record,index);
                }else{
                    key=typeof record[rowKey] !== 'undefined' ? record[rowKey] : index;
                }
                for(let j=0;j<colCount;j++){
                    let column=columns[j];
                    const { dataIndex, render, className = '' } = column;
                    let text = record[dataIndex];
                    if (render) {
                        text = render(text, record, index);
                    }
                    td.push(<td key={column.key}>{text}</td>);
                }
                tr.push(<tr key={key} className="ant-table-row  ant-table-row-level-0">{td}</tr>);
                td=[];
            }
        }
        

        return <Spin spinning={this.props.loading}>
        <div>
        <div className={"ant-table "+ sizeClass+ " ant-table-scroll-position-left "+
             (this.props.bordered?' comp-table ant-table-bordered  ':' ')}>
        <div className={"ant-table-content"}>
        <div className={(this.props.scroll? " ant-table-scroll ":' ')}>
        <span>
        <div className={"ant-table-body"} style={bodyStyle}>
        <table style={tableStyle}>
        <colgroup>{colgroup}</colgroup>
        <thead className={"ant-table-thead comp-table"}>{th}</thead>
        <tbody className={"ant-table-tbody"}>{tr}</tbody>
        </table>
        </div>
        </span>
        </div>
        </div>
        </div>
        </div> 
        </Spin>
    }
});

module.exports=compTable;