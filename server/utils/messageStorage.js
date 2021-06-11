
  class Messages {
    constructor () {
      this.messages = [];
    }

    addMessageToStore (id, messageText, room) {
      var newMessage = {id, messageText, room};
      this.messages.push(newMessage);
      return newMessage;
    }

    getMessageList (room) {
      var messages = this.messages.filter((message) => message.room === room);
      var namesArray = messages.map((user) => user.messageText);
  
      return namesArray;
    }
  }
  
  module.exports = {Messages};
  