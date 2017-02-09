import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, message, Input } from 'antd'
import config from 'common/configuration'
import req from 'reqwest'
import Container from 'component/container'
import FileSaver from 'file-saver'
import { jsonCopy, isEmptyObject } from 'common/utils'
import cloneDeep from 'lodash/cloneDeep';
import './style.css'

const FormItem = Form.Item;
const createForm = Form.create;
const ButtonGroup = Button.Group;

let c = React.createClass({
    getDefaultProps() {
        return {
            //接收的json数据中用来充当key的字段名
            keyCol: 'id',
            //数据来源api
            apiUrl: `pub/api/tts`,
            //初始搜索条件
            defaultWhere: {},
            //栏目名称
            title: '语音合成'
        }
    },
    getInitialState() {
        return {
            loading: false
        }
    },
    convert() {
        const {getFieldsValue} = this.props.form;
        const value = getFieldsValue();
        const {apiUrl} = this.props;
        value.text = value.text.replace(/\s+/g, "");
        let param = JSON.stringify(value);
        this.setState({ loading: true })
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.open("POST", apiUrl, true);
        xhr.responseType = "arraybuffer";
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {//Call a function when the state changes.
            if (xhr.readyState == 4 && xhr.status == 200) {
                that.setState({loading:false})
                let arrayBuffer = xhr.response;
                let blob = new Blob([arrayBuffer], { type: "audio/mpeg3" });
                FileSaver.saveAs(blob, 't2a.mp3')
            }
        }
        xhr.send(param);
    },
    reset() {
        this.props.form.resetFields();
    },

    render() {
        const {getFieldProps} = this.props.form;
        const {loading} = this.state;
        const textProps = getFieldProps('text');
        return <div className="yyhc">
            <div className="wrap">
                <Container>
                    <Form>
                        <Row>
                            输入要转换的文字：
                        </Row>
                        <Row>
                            <FormItem id="control-textarea">
                                <Input {...textProps} type="textarea" id="control-textarea" rows="10" />
                            </FormItem>
                        </Row>
                        <Row>
                            <ButtonGroup>
                                <Button loading={loading} type="primary" size="large" onClick={this.convert}>转换</Button>
                                <Button type="default" size="large" onClick={this.reset}>清空</Button>
                            </ButtonGroup>

                        </Row>

                    </Form>
                </Container>
            </div>

        </div>
    }

});
c = createForm()(c);
module.exports = c;