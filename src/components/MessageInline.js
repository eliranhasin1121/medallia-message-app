import React, { Component } from "react";
import { Checkbox } from "antd";
import MessagesStore from "../stores/MessagesStore";

export default class MessageInline extends Component {
  state = {
    messageSelected: false
  };

  onCheckBoxChanged = e => {
    e.preventDefault();
    const checked = e.target.checked;
    this.setState({ messageSelected: checked });
    this.props.onSelectedArrayChanged(checked, this.props.message);
  };

  onMessageClicked = () => {
    const { message } = this.props;
    this.props.setMessageAsRead(message);
    this.props.history.replace(`/message/${message.id}`);
  };

  render() {
    const { message } = this.props;
    const unReadMessageBehavior = !message.isRead ? "unread" : "";
    const selectedMessageBehavior = this.state.messageSelected
      ? "selected"
      : "";
    return (
      <div
        className={`message-inline-container ${unReadMessageBehavior} ${selectedMessageBehavior}`}
      >
        <div className="details-container">
          <span className="check-box">
            <div className="check-box-container">
              <Checkbox onChange={e => this.onCheckBoxChanged(e)} />
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
                <span className="content-text">
                  {message ? message.content : ""}
                </span>
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
