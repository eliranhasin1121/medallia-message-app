import MessagesStore from "./MessagesStore";

//init all the stores

const messagesStore = new MessagesStore();

const rootStores = {
  [MessagesStore]: messagesStore
};

window["stores"] = rootStores;
export default rootStores;
