import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../stores";
import MessagesStore from "../stores/MessagesStore";
import get from "lodash/get";
import { Button } from "antd";
const db = require("../db.json");

const messagesStore = rootStores[MessagesStore];

@observer
class Home extends Component {
  onViewMessagesClicked = () => {
    this.props.history.push("/inbox");
  };
  render() {
    const user = messagesStore.getCurrentUser
      ? messagesStore.getCurrentUser
      : null;
    const messages = messagesStore.getMessagesArray;
    return (
      <div className="home-main-container">
        <div className="title">
          <h2 className="title">
            Hello {user.name}, Wellcome to Your messanger
          </h2>
        </div>
        <div className="content">
          <div className="box-items">
            <h3>
              You Have{" "}
              <b style={{ textDecoration: "underline" }}>
                {messagesStore.getUnReadMessages}
              </b>{" "}
              unread messages out of {messages ? messages.length : 0} total
            </h3>

            <Button
              className="btn"
              type="primary"
              onClick={() => this.onViewMessagesClicked()}
            >
              View Messages
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
