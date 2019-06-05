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
