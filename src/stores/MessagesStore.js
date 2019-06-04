import { observable, action, computed, toJS } from "mobx";
import get from "lodash/get";

const db = require("../db.json");

export default class MessagesStore {
  constructor() {
    let unReadMessages = 0;
    if (get(this.currentUser, "messages.length") > 0) {
      this.currentUser.messages.forEach(message => {
        if (!message.isRead) {
          unReadMessages += 1;
        }
      });
      this.setUnReadMessages(unReadMessages);
    }
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
    this.messagesArray = messages;
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
    return this.currentUser ? toJS(this.currentUser.messages) : [];
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
