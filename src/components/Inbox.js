import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../stores";
import MessagesStore from "../stores/MessagesStore";
import { Button, Icon, Pagination } from "antd";
import MessageInline from "./MessageInline";
import get from "lodash/get";
const messagesStore = rootStores[MessagesStore];
const db = require("../db.json");
@observer
class Inbox extends Component {
  state = {
    messagesSelectedArray: [],
    visable: true,
    page: 1,
    clearSelectedMessages: false
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
      this.setState({ messagesSelectedArray: fillteredArray });
    }
  };

  onVisibleClicked = () => {
    this.setState({ visable: !this.state.visable });
  };

  fillteredMessages = () => {
    let bulkMessages = this.laodBulkMessagesByPage();
    let filteredMessages;
    if (messagesStore.getMessagesArray) {
      if (!this.state.visable) {
        filteredMessages = bulkMessages.filter(
          message => !message.isRead && !message.deleted
        );
      } else {
        filteredMessages = bulkMessages.filter(message => !message.deleted);
      }
      return filteredMessages;
    } else {
      return [];
    }
  };
  setMessageAsRead = message => {
    messagesStore.setMessageAsRead(message);
  };

  resetSelectedValue = () => {
    this.setState({ clearSelectedMessages: false });
  };

  setMessagesAsRead = messagesAsReadArray => {
    messagesStore.setMessagesAsRead(messagesAsReadArray);
    this.setState({ clearSelectedMessages: true });
  };

  renderAllMessages = () => {
    {
      const messagesArray = this.fillteredMessages();
      return messagesArray.map((message, index) => (
        <MessageInline
          changeSelectedMessageValue={() => this.resetSelectedValue()}
          clearSelectedMessages={this.state.clearSelectedMessages}
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

  onPageChanged = page => {
    this.setState({ page });
  };

  laodBulkMessagesByPage = () => {
    const { page } = this.state;
    let messagesBulk = [];
    let start = (page - 1) * 20;
    let end = page * 20;
    for (
      let i = start;
      i < end && i < messagesStore.getMessagesArray.length;
      i++
    ) {
      messagesBulk.push(messagesStore.getMessagesArray[i]);
    }
    return messagesBulk;
  };

  onMarkMessagesClicked = () => {
    this.setMessagesAsRead(this.state.messagesSelectedArray);
    this.setState({ clearSelectedMessages: true });
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
              <Button onClick={() => this.onMarkMessagesClicked()}>
                <Icon type="highlight" />
              </Button>
            </div>
          </div>
        </div>
        <div className="messages-container">{this.renderAllMessages()}</div>
        <div className="pagination-container">
          <Pagination
            defaultCurrent={1}
            total={messagesStore.getMessagesArray.length}
            pageSize={20}
            onChange={page => this.onPageChanged(page)}
          />
        </div>
      </div>
    );
  }
}

export default Inbox;
