import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../stores";
import MessagesStore from "../stores/MessagesStore";
import { Button, Icon } from "antd";
import MessageInline from "./MessageInline";
import get from "lodash/get";
const messagesStore = rootStores[MessagesStore];
const db = require("../db.json");
@observer
class Inbox extends Component {
  state = {
    messagesSelectedArray: [],
    visable: true
  };
  onSelectedArrayChanged = (action, message) => {
    if (action) {
      this.setState({
        messagesSelectedArray: [...this.state.messagesSelectedArray, message]
      });
    } else {
      const fillteredArray = this.state.messagesSelectedArray.filter(m => {
        return m.id !== message.id;
      });
      this.setState({ messagesSelectedArray: fillteredArray }, () => {
        console.log({ messages: this.state.messagesSelectedArray });
      });
    }
  };

  onVisibleClicked = () => {
    this.setState({ visable: !this.state.visable });
  };

  fillteredMessages = () => {
    let filteredMessages;
    if (messagesStore.getMessagesArray) {
      if (!this.state.visable) {
        filteredMessages = messagesStore.getMessagesArray.filter(
          message => !message.isRead && !message.deleted
        );
      } else {
        filteredMessages = messagesStore.getMessagesArray.filter(
          message => !message.deleted
        );
      }
      console.log({ filteredMessages });
      return filteredMessages;
    } else {
      return [];
    }
  };
  setMessageAsRead = message => {
    messagesStore.setMessageAsRead(message);
  };

  renderAllMessages = () => {
    {
      const messagesArray = this.fillteredMessages();
      return messagesArray.map((message, index) => (
        <MessageInline
          key={index}
          setMessageAsRead={message => this.setMessageAsRead(message)}
          message={message}
          history={this.props.history}
          onSelectedArrayChanged={(action, message) =>
            this.onSelectedArrayChanged(action, message)
          }
        />
      ));
    }
  };

  refreshPage = () => {
    window.location.reload();
  };

  onDeleteClicked = () => {
    if (!this.state.messagesSelectedArray.length) {
      return;
    } else {
      messagesStore.deleteMessages(this.state.messagesSelectedArray);
    }
    this.fillteredMessages();
    this.setState({ messagesSelectedArray: [] });
  };

  render() {
    const unReadMessages = messagesStore.getUnReadMessages;
    const unReadText = unReadMessages ? `(${unReadMessages})` : "";
    return (
      <div className="main-inbox-container">
        <div className="header-mail-box">
          <div className="left-container">
            <div className="inbox-text">
              <h2>{`Inbox ${unReadText}`}</h2>
            </div>
            <div className="group-btn">
              <Button onClick={() => this.refreshPage()} className="btn-inbox">
                <Icon type="sync" /> Refresh
              </Button>
              <Button
                onClick={() => this.onVisibleClicked()}
                className="btn-inbox"
              >
                {this.state.visable ? (
                  <Icon type="eye" />
                ) : (
                  <Icon type="read" />
                )}
              </Button>
              <Button
                onClick={() => this.onDeleteClicked()}
                className="btn-inbox"
              >
                <Icon type="delete" />
              </Button>
            </div>
          </div>
          <div className="right-container">
            <Button>
              <Icon type="arrow-left" />
            </Button>
            <Button>
              <Icon type="arrow-right" />
            </Button>
          </div>
        </div>
        <div className="messages-container">{this.renderAllMessages()}</div>
      </div>
    );
  }
}

export default Inbox;
