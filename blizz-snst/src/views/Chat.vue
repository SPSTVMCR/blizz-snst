<template>
  <div class="chat-view">
    <h1>Chat</h1>
    <div class="messages-container">
      <div v-for="message in messages" :key="message.id" class="message">
        <span class="username">{{ message.username }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <form class="send-message-form" @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" placeholder="Type a message...">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import {db} from '../firebase/firebase';
import {addDoc, collection, onSnapshot, orderBy, query, Timestamp,} from 'firebase/firestore';
import {useUserStore} from '@/stores/user.js';
import router from "@/router/index.js";

export default {
  setup() {
    const messages = ref([]);
    const newMessage = ref('');
    const chatroomId = router.currentRoute.value.params.roomId;

    const fetchMessages = async () => {
      const messagesQuery = query(
          collection(db, 'chatrooms', chatroomId.value, 'messages'), // Update the path to the specific chatroom
          orderBy('timestamp', 'asc')
      );

      try {
        onSnapshot(messagesQuery, (querySnapshot) => {
          messages.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const sendMessage = async () => {
      try {
        await addDoc(
            collection(db, 'chatrooms', chatroomId.value, 'messages'), // Update the path to the specific chatroom
            {
              text: newMessage.value,
              username: useUserStore().user.displayName,
              timestamp: Timestamp.fromDate(new Date()),
            }
        );
        newMessage.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    onMounted(() => {
      fetchMessages();
    });

    return {
      messages,
      newMessage,
      sendMessage,
      chatroomId, // Add the chatroomId to the returned object
    };
  },
};
</script>

<style scoped>
.chat-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.messages-container {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.message {
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
  margin-right: 10px;
}

.text {
  color: #666;
}

.send-message-form {
  padding: 20px;
}

.send-message-form input[type='text'] {
  width: 80%;
  height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-message-form button[type='submit'] {
  width: 20%;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

.send-message-form button[type='submit']:hover {
  background-color: #3e8e41;
}
</style>