<template>
  <div class="chat-view">
    <h1>Chat</h1>
    <div class="messages">
      <div class="message" v-for="message in messages" :key="message.id">
        <span class="username">{{ message.username }}:</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <div class="input-container">
      <input type="text" v-model="newMessage" placeholder="Type your message">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {db} from "../firebase/firebase";
import {addDoc, collection, doc, onSnapshot, orderBy, query, Timestamp,} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";

export default {
  setup() {
    const messages = ref([]);
    const newMessage = ref("");
    const route = useRoute();
    const roomId = route.params.id;
    const roomRef = doc(db, "chatrooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const userStore = useUserStore();

    // Fetch messages from Firestore
    const fetchMessages = async () => {
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            messages.value.push(change.doc.data());
          }
        });

      });

    };

    onMounted(fetchMessages);

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;
      if (!userStore.user) return;

      const message = {
        text: newMessage.value,
        username: userStore.user.displayName,
        timestamp: Timestamp.fromDate(new Date()),
      };
      await addDoc(messagesRef, message);
      newMessage.value = "";
    };

    return {
      messages,
      newMessage,
      sendMessage,
    };
  }
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