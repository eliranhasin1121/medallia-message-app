import { observable, action, computed, toJS } from "mobx";
import get from "lodash/get";
import { array } from "prop-types";

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

  @action
  deleteMessages = messagesToDelete => {
    let unReadMessages = 0;
    let unDeletedMessagesArray = [];
    this.getMessagesArray.forEach(message => {
      if (!messagesToDelete.includes(message)) {
        unDeletedMessagesArray.push(message);
      }
    });
    messagesToDelete.forEach(messageToDelete => {
      if (!messageToDelete.isRead) {
        unReadMessages += 1;
      }
    });
    this.setMessageArray(unDeletedMessagesArray);

    // messagesToDelete.forEach(messageToDelete => {
    //   if (!messageToDelete.isRead) {
    //     unReadMessages += 1;
    //   }
    // if (this.getMessagesArray.includes(messageToDelete)) {
    //   this.getMessagesArray.remove(messageToDelete);
    // }
    // let index = this.getMessagesArray.indexOf(messagesToDelete);
    // if (index > -1) {
    //   this.getMessagesArray.splice(index, 1);
    // }
    //   this.getMessagesArray.forEach(message => {
    //     if (
    //       message.id != messageToDelete.id &&
    //       !unDeletedMessagesArray.includes(message)
    //     ) {
    //       unDeletedMessagesArray.push(message);
    //     } else if (
    //       message.id === messageToDelete.id &&
    //       !unDeletedMessagesArray.includes(message)
    //     ) {
    //       message.deleted = true;
    //     }
    //   });
    // });
    // this.setMessageArray(unDeletedMessagesArray);
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
    if (found && !found.isRead) {
      found.isRead = true;
      this.setUnReadMessages(this.getUnReadMessages - 1);
    }
  };

  @action
  setMessagesAsRead = messagesAsReadArray => {
    messagesAsReadArray.forEach(message => {
      this.setMessageAsRead(message);
    });
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
