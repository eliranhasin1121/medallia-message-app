import { observable, action, computed, toJS } from "mobx";
import get from "lodash/get";

const db = require("../db.json");

export default class MessagesStore {
  constructor() {
    this.setMessageArray(this.getCurrentUser.messages);
    let unReadMessages = 0;

    this.getMessagesArray.forEach(message => {
      if (!message.isRead) {
        unReadMessages += 1;
      }
    });
    this.setUnReadMessages(unReadMessages);
  }

  @observable
  currentUser = db.users[0];
  @observable
  unReadMessages = 0;

  @observable
  messagesArray = observable([]);

  // @action
  // deleteMessages = messagesToDelete => {
  //   let unReadMessageAreDeleted = 0;
  //   this.messagesArray.forEach(message => {
  //     console.log(message);
  //     if (!message.isRead) {
  //       unReadMessageAreDeleted += 1;
  //       console.log({ unReadMessageAreDeleted });
  //       debugger;
  //     }
  //     this.getMessagesArray.find(m => {
  //       const found = m.id === message.id.deleted;
  //       if (found) {
  //         found.deleted = "true";
  //       }
  //     });
  //   });
  //   this.setUnReadMessages(this.getUnReadMessages - unReadMessageAreDeleted);
  // };
  @action
  deleteMessages = messagesToDelete => {
    let unReadMessages = 0;
    let unDeletedMessagesArray = [];
    messagesToDelete.forEach(messageToDelete => {
      if (!messageToDelete.isRead) {
        debugger;
        unReadMessages += 1;
      }
      this.getMessagesArray.forEach(message => {
        if (
          message.id != messageToDelete.id &&
          !unDeletedMessagesArray.includes(message)
        ) {
          unDeletedMessagesArray.push(message);
        } else if (
          message.id === messageToDelete.id &&
          !unDeletedMessagesArray.includes(message)
        ) {
          message.deleted = true;
        }
      });
    });
    this.setMessageArray(unDeletedMessagesArray);
    this.setUnReadMessages(this.getUnReadMessages - unReadMessages);
  };
  @action
  setCurrentUser = user => {
    this.currentUser = user;
    this.setMessageArray(user.messages);
  };

  @action
  setMessageArray = messages => {
    this.messagesArray.replace(messages);
  };

  @action
  setUnReadMessages = unReadMessages => {
    this.unReadMessages = unReadMessages;
  };

  @action
  setMessageAsRead = message => {
    const found = this.getMessagesArray.find(m => m.id === message.id);
    console.log(found);
    if (found) {
      found.isRead = true;
      this.setUnReadMessages(this.getUnReadMessages - 1);
    }
  };
  @computed
  get getMessagesArray() {
    const messagesNotDeleted = this.currentUser
      ? this.currentUser.messages.filter(message => !message.deleted)
      : [];
    return messagesNotDeleted;
    // return this.currentUser ? toJS(this.currentUser.messages) : [];
  }

  @computed
  get getUnReadMessages() {
    return this.unReadMessages;
  }

  @computed
  get getCurrentUser() {
    return toJS(this.currentUser) || {};
  }
}
