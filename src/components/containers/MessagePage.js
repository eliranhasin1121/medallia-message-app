import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../../stores";
import MessagesStore from "../../stores/MessagesStore";
import { Icon, Button } from "antd";
const db = require("../../db.json");

const messageStore = rootStores[MessagesStore];
@observer
class MessagePage extends Component {
  state = {};
  render() {
    const id = this.props.match.params.id;
    const message = messageStore.getMessagesArray
      ? messageStore.getMessagesArray.find(m => m.id == id)
      : null;

    return (
      <div className="message-main-container">
        <div className="title-with-elements">
          <div className="title-message-container">
            <h1>{message ? message.title : ""}</h1>
            <h3>
              <b>{message ? message.from : ""}</b>
              <span>{`<${message ? message.email : ""}>`}</span>
            </h3>
            <Icon type="lock" />
            <span className="small-text">to me</span>
          </div>
          <div className="element-container">
            <Button className="small-btn">
              <Icon type="printer" />
            </Button>
            <Button>
              <Icon type="switcher" />
            </Button>
          </div>
        </div>
        <div className="content-message-container">
          <div className="text-container">
            <span>{message ? message.content : ""}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MessagePage;
