import React, { Component } from "react";
import { Checkbox, Tooltip } from "antd";
import MessagesStore from "../stores/MessagesStore";

export default class MessageInline extends Component {
  state = {
    messageSelected: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.clearSelectedMessages !== this.props.clearSelectedMessages) {
      this.props.changeSelectedMessageValue();
      this.handleMessageSelected(false);
    }
  }

  onCheckBoxChanged = e => {
    e.preventDefault();
    const addedAction = e.target.checked;
    this.handleMessageSelected(addedAction);
    this.props.onSelectedArrayChanged(addedAction, this.props.message);
  };

  onMessageClicked = () => {
    const { message } = this.props;
    this.props.setMessageAsRead(message);
    this.props.history.replace(`/message/${message.id}`);
  };

  clearCheckBox = () => {
    this.handleMessageSelected(false);
  };

  clearData = () => {
    this.handleMessageSelected(false);
  };

  handleMessageSelected = bool => {
    this.setState({ messageSelected: bool });
  };

  render() {
    const { message } = this.props;
    const unReadMessageBehavior = !message.isRead ? "unread" : "";
    const selectedMessageBehavior = this.state.messageSelected
      ? "selected"
      : "";

    const value =
      !this.props.clearSelectedMessages && this.state.messageSelected;
    return (
      <div
        className={`message-inline-container ${unReadMessageBehavior} ${selectedMessageBehavior}`}
      >
        <div className="details-container">
          <span className="check-box">
            <div className="check-box-container">
              <Checkbox
                checked={value}
                onChange={e => this.onCheckBoxChanged(e)}
              />
            </div>
          </span>
          <span
            className="other-details-container"
            onClick={() => this.onMessageClicked()}
          >
            <div className="name">
              <span>{message ? message.from : ""}</span>
            </div>
            <div className="message-content">
              <div className="message-container-overflow">
                <Tooltip
                  placement="left"
                  title={message ? message.content : ""}
                >
                  <span className="content-text">
                    {message ? message.content : ""}
                  </span>
                </Tooltip>
              </div>
            </div>
            <div className="date-container">
              <span className="date-text">
                {message ? message.createdAt : ""}
              </span>
            </div>
          </span>
        </div>
      </div>
    );
  }
}
