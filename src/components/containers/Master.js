import React, { Component } from "react";
import { Layout, Menu, Icon, Col, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import Home from "../Home";
import { withRouter } from "react-router";
import rootStores from "../../stores";
import { observer } from "mobx-react";
import Inbox from "../Inbox";
import MessagePage from "./MessagePage";
const { Header, Footer, Content } = Layout;
const medalliaLogo = require("../../assets/medallia-logo.png");
const db = require("../../db.json");

@observer
class Master extends Component {
  handleMenuClicked = path => this.props.history.push(path);

  render() {
    return (
      <Layout className="layout">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys="2"
          className="menu-master"
        >
          <Col span={6}>
            <Menu.Item
              className="logo"
              key="1"
              onClick={() => this.handleMenuClicked("/home")}
            >
              <img src={medalliaLogo} className="medallia-logo" />
            </Menu.Item>
          </Col>
          <Col span={18}>
            <Row type="flex" className="tab-container">
              <Menu.Item
                className="tab"
                key="2"
                onClick={() => this.handleMenuClicked("/home")}
              >
                <Icon className="icon" fontSize={16} type="home" />
                Home
              </Menu.Item>
              <Menu.Item
                key="3"
                className="tab"
                onClick={() => this.handleMenuClicked("/inbox")}
              >
                <Icon className="icon" fontSize={16} type="mail" />
                Inbox
              </Menu.Item>
            </Row>
          </Col>
        </Menu>
        <Content className="content-container">
          <Switch>
            <Route path={"/home"} exact component={Home} />
            <Route path={"/inbox"} exact component={Inbox} />
            <Route path={"/message/:id"} exact component={MessagePage} />
          </Switch>
        </Content>
        <Footer className="footer">
          Message App ©2019 Created by Eliran Hasin.
        </Footer>
      </Layout>
    );
  }
}

export default withRouter(Master);
