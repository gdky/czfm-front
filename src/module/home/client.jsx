import React from 'react';
import {Row, Col,Tabs,Table,Badge,Icon,Button} from 'antd'
import Container from 'component/container'
import ZyswsList from './zyswsList'
import CyryList from './cyrylist'
import Fqr from './fqrlist'
import Czr from './czrlist'
import Szxx from './szxx'
import Swsxx from './swsxx'
import InBox from './inBox'
import auth from 'common/auth'
import req from 'common/request'
import config from 'common/configuration'
import './style.css'

const TabPane = Tabs.TabPane;
const c = React.createClass({
    //初始化state
    getInitialState(){
        return {
            summary: {},
            zysws: {},
            cyry: {}
        }
    },
    fetchSummary(){
        let jgid = auth.getJgid();
        let url = config.HOST + config.URI_API_PROJECT + '/clisummary/' + jgid;
        return req({url: url, method: 'get', type: 'json'})
    },
    fetchZysws( params= {page : 1, pagesize : 5}){
        let jgid = auth.getJgid();
        let url = config.HOST + config.URI_API_PROJECT + '/sumZysws/' + jgid;
        return req({url: url, method: 'get', type: 'json', data: {page: params.page, pagesize: params.pagesize}})
    },
    fetchCyry( params= {page : 1, pagesize : 5}){
        let jgid = auth.getJgid();
        let url = config.HOST + config.URI_API_PROJECT + '/sumCyry/' + jgid;
        return req({url: url, method: 'get', type: 'json', data: {page: params.page, pagesize: params.pagesize}})
    },
    //获取汇总信息，执业人员和从业人员名单
    async fetchData(){
        let [summary, zysws,cyry] = await Promise.all([this.fetchSummary(), this.fetchZysws(), this.fetchCyry()]);
        return {summary: summary, zysws: zysws, cyry: cyry}
    },
    componentDidMount(){
        this.fetchData().then(resp=> {
            this.setState({summary: resp.summary, zysws: resp.zysws, cyry: resp.cyry})
        });
    },
    render(){
        const unreadedBadge = <Badge count={0} style={{ backgroundColor: '#87d068' }}/>;
        const more = <a><Icon type="ellipsis"/> 展开</a>;
        return <div className="client-home wrap">
            <Row gutter={16}>
                <Col span="16">
                    <Container>
                        <Tabs size="small">
                            <TabPane key="1" tab="执业税务师">
                                <ZyswsList fetch={this.fetchZysws}
                                           data={this.state.zysws.data}
                                           total = {this.state.zysws.total} />
                            </TabPane>
                            <TabPane key="2" tab="从业人员">
                                <CyryList fetch={this.fetchCyry}
                                          data={this.state.cyry.data}
                                          total = {this.state.cyry.total}/>
                            </TabPane>
                            <TabPane key="3" tab="所长信息">
                                <Szxx data={this.state.summary.szxx} />
                            </TabPane>
                            <TabPane key="4" tab="发起人信息">
                                <Fqr data={this.state.summary.fqrxx} />
                            </TabPane>
                            <TabPane key="5" tab="出资人信息">
                                <Czr data={this.state.summary.czrxx} />
                            </TabPane>
                        </Tabs>

                    </Container>
                </Col>
                <Col span="8">
                    <Container className="tabs-for-title">
                        <Tabs size="small" tabBarExtraContent={unreadedBadge}>
                            <TabPane key="1" tab="未读消息"><InBox/></TabPane>
                        </Tabs>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Container className="tabs-for-title">
                        <Tabs size="small" tabBarExtraContent={more}>
                            <TabPane key="1" tab="事务所详细信息">
                                <Swsxx data = {this.state.summary.swsxx} />
                            </TabPane>
                        </Tabs>
                    </Container>
                </Col>
            </Row>

        </div>
    }
});

module.exports = c;