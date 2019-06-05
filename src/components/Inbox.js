import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../stores";
import MessagesStore from "../stores/MessagesStore";
import { Button, Icon, Pagination, Tooltip } from "antd";
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
  onSelectedArrayChanged = (addedAction, selectedMessage) => {
    if (addedAction) {
      this.setState({
        messagesSelectedArray: [
          ...this.state.messagesSelectedArray,
          selectedMessage
        ]
      });
    } else {
      const fillteredArray = this.state.messagesSelectedArray.filter(
        filteredMessage => {
          return selectedMessage.id !== filteredMessage.id;
        }
      );
      this.setState({ messagesSelectedArray: fillteredArray });
    }
  };

  onVisibleClicked = () => {
    this.setState({ visable: !this.state.visable });
  };

  filterdMessages = () => {
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
    this.changedClearSelectedMessages(false);
  };

  changedClearSelectedMessages = bool => {
    this.setState({ clearSelectedMessages: bool });
  };

  setMessagesAsRead = messagesAsReadArray => {
    messagesStore.setMessagesAsRead(messagesAsReadArray);
    this.changedClearSelectedMessages(true);
  };

  renderAllMessages = () => {
    const messagesArray = this.filterdMessages();
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
  };

  refreshPage = () => {
    window.location.reload();
  };

  onPageChanged = page => {
    this.setState({ page });
  };

  laodBulkMessagesByPage = () => {
    const pageSize = 20;
    const { page } = this.state;
    const messagesBulk = [];
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
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
    this.changedClearSelectedMessages(true);
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
              <Tooltip placement="top" title={"refresh"}>
                <Button
                  onClick={() => this.refreshPage()}
                  className="btn-inbox"
                >
                  <Icon type="sync" /> Refresh
                </Button>
              </Tooltip>
              <Tooltip placement="top" title={"unread/all messages"}>
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
              </Tooltip>
              <Tooltip placement="top" title="Mark messages as read">
                <Button onClick={() => this.onMarkMessagesClicked()}>
                  <Icon type="highlight" />
                </Button>
              </Tooltip>
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
