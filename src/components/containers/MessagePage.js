import React, { Component } from "react";
import { observer } from "mobx-react";
import rootStores from "../../stores";
import MessagesStore from "../../stores/MessagesStore";
import { Icon, Button, Tooltip } from "antd";

const messageStore = rootStores[MessagesStore];

@observer
class MessagePage extends Component {
  onPrintMessageClick = () => {
    window.print();
  };

  onOpenNewTabWithMessage = () => {
    window.open(`http://localhost:3000/message/${this.props.match.params.id}`);
  };
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
            <Tooltip placement="top" title={"Print Message"}>
              <Button
                onClick={() => this.onPrintMessageClick()}
                className="small-btn"
              >
                <Icon type="printer" />
              </Button>
            </Tooltip>
            <Tooltip placement="top" title={"Open message in new Tab"}>
              <Button
                onClick={() => this.onOpenNewTabWithMessage()}
                className="small-btn"
              >
                <Icon type="switcher" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="content-message-container">
          <div className="text-container">
            <span className="content-text-message">
              {message ? message.content : ""}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default MessagePage;
