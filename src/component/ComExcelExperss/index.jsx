import React from 'react'
import Iconv from 'iconv-lite'
import FileSaver from 'file-saver'
import {Button, notification, Icon} from 'antd'


/**
 *API属性：model，resData，type，butName
 *model：表头；扩展属性：visible：false不可见；
 *format（xml导出方式可用）：Date/Number/String,，默认String；
 *width（xml导出方式可用）：表格宽度，默认100；
 *resData：表数据，null时导出为空；
 *type：导出方式，xml/csv，默认csv，csv方式支持多表头；
 *butName：按钮名称，默认"导出"
 *fileName: 文件名
 */

let dy = React.createClass({
    getDefaultProps() {
        return {
            type: 'csv',
            header: '',
            footer: ''
        }
    },
    emitXmlHeader() {
        let headerRow = '<ss:Row>\n';
        let colStyle = '';
        const modelTypes = this.props.model;
        for (let i = 0; i < modelTypes.length; i++) {
            if (modelTypes[i].visible == false) {
                headerRow += '  <ss:Cell><ss:Data ss:Type="String"></ss:Data></ss:Cell>\n';
            } else {
                headerRow += '  <ss:Cell><ss:Data ss:Type="String">' + modelTypes[i].title + '</ss:Data></ss:Cell>\n';
                colStyle += `<ss:Column ${!modelTypes[i].format ? '' : 'ss:StyleID="s' + modelTypes[i].format + '"'} ss:Width="${!modelTypes[i].width ? '100' : modelTypes[i].width}" />\n`;
            }
        }
        headerRow += '</ss:Row>\n';
        return '<?xml version="1.0"?>\n' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
            '<ss:Styles><ss:Style ss:ID="sDate"> <ss:NumberFormat ss:Format="Short Date"/></ss:Style>' +
            '<ss:Style ss:ID="sNumber"> <ss:NumberFormat ss:Format="0.00_);[Red]\(0.00\)"/> </ss:Style></ss:Styles>' +
            '<ss:Worksheet ss:Name="Sheet1">\n' +
            '<ss:Table>\n\n' + colStyle + headerRow;
    },

    emitXmlFooter() {
        return '\n</ss:Table>\n' +
            '</ss:Worksheet>\n' +
            '</ss:Workbook>\n';
    },

    jsonToSsXml (jsonObject) {
        let data = (typeof(jsonObject) != "object" ? JSON.parse(jsonObject) : jsonObject);
        let xml = this.emitXmlHeader();
        const modelTypes = this.props.model;
        for (let row = 0; row < data.length; row++) {
            xml += '<ss:Row>\n';
            for (let i = 0; i < modelTypes.length; i++) {
                for (let col in data[row]) {
                    if (modelTypes[i].dataIndex == col) {
                        if (typeof(data[row][col]) === 'object') {
                            xml += '<ss:Cell><ss:Data ss:Type="String"></ss:Data></ss:Cell>\n';
                        } else {
                            xml += ` <ss:Cell><ss:Data ss:Type="${typeof(data[row][col]) == "number" ? 'Number' : 'String'}">` + data[row][col] + '</ss:Data></ss:Cell>\n';
                        }
                    }
                }
            }

            xml += '</ss:Row>\n';
        }

        xml += this.emitXmlFooter();
        return xml;
    },
    jsonToCSV(jsonObject){
        const {header, footer} = this.props;
        const modelTypes = this.props.model;
        var tabAll = [];

        function recursion(obj, row = 0, col = 0, ls = []) {
            let colNow = (col == 0 ? 0 : col);
            let rowNow = (row == 0 ? 0 : row);
            if (typeof tabAll[row] === 'undefined') {
                tabAll.push([]);
            }
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].visible == false) {
                    continue;
                }
                if (!Array.isArray(obj[i].children)) {
                    tabAll[rowNow][colNow] = obj[i];
                    colNow++;
                    continue;
                }
                tabAll[rowNow][colNow] = obj[i];
                colNow = recursion(obj[i].children, rowNow + 1, colNow);
            }
            return colNow;
        }

        let csv = '';
        let headCol = recursion(modelTypes);
        for (let j = 0; j < tabAll.length; j++) {
            for (let k = 0; k < headCol; k++) {
                if (typeof tabAll[j][k] === 'undefined') {
                    csv += '"\t",';
                    continue;
                }
                csv += '"\t' + tabAll[j][k].title + '",';
            }
            csv += '\n'
        }
        let data = (typeof(jsonObject) != "object" ? JSON.parse(jsonObject) : jsonObject);
        for (let row = 0; row < data.length; row++) {
            for (let i = 0; i < headCol; i++) {
                let headInx = '';
                let value = '';
                for (let j = 0; j < tabAll.length; j++) {
                    if (typeof(tabAll[j][i]) != 'undefined' && typeof(tabAll[j][i].dataIndex) != 'undefined') {
                        headInx = tabAll[j][i].dataIndex;
                        break;
                    }
                }
                for (let col in data[row]) {
                    if (headInx == col) {
                        value = data[row][col];
                        break;
                    }
                }
                if (typeof(value) === 'object' || value == '') {
                    csv += '"\t",';
                } else if (typeof value == 'number') {
                    csv += value + ','
                } else {
                    csv += '"\t' + value + '",';
                }
            }
            csv += '\n';
        }
        return Iconv.encode(header + csv + footer, 'GBK');  //转GBK编码
    },
    valueExport(e){
        e.preventDefault();
        let data = this.props.resData;
        if (data.length <= 0) {
            notification.error({
                message: '操作失败',
                description: '暂无数据可导出，请检查后再尝试'
            });
            return;
        }
        let selFuntion = {
            xml: this.jsonToSsXml(data),
            csv: this.jsonToCSV(data),
        };
        const exportWay = this.props.type;
        const fileName = (typeof(this.props.fileName) === 'string' && this.props.fileName.length != 0 ? this.props.fileName : "exportFile")
        let ex = selFuntion[exportWay];
        let blob = new Blob([ex]);
        const expName = fileName + '.' + (exportWay == 'xml' ? 'xls' : exportWay);
        FileSaver.saveAs(blob, expName);
    },
    render() {

        return <Button type="ghost" onClick={this.valueExport} {...this.props}><Icon type="export"/>
            {typeof(this.props.butName) === 'string' && this.props.butName.length != 0 ? this.props.butName : "导出"}
        </Button>

    }
});
module.exports = dy;
