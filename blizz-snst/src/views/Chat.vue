<template>
  <div class="chat-view d-flex flex-column" style="margin-bottom: 10rem">
    <h1>Chat</h1>
    <div class="messages">
      <div class="message" v-for="message in messages" :key="message.id">
        <span class="username">{{ message.username }}:</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
  </div>
  <div
      class="input-container d-flex flex-row align-items-center justify-content-center w-100 mt-3 position-fixed bottom-0 mb-5">
    <BInputGroup style="width: 90%">
      <BFormInput type="text" v-model="newMessage" placeholder="Type your message"></BFormInput>
      <BButton @click="sendMessage">Send</BButton>
    </BInputGroup>
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

    const chatbot = async () => {
      const url = 'https://intellichat-ai-chatbot.p.rapidapi.com/chat';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': 'fb66a3adfcmshfb7690aaa83cad5p112578jsne873809a5992',
          'x-rapidapi-host': 'intellichat-ai-chatbot.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          // Delete the /chatbot from the message
          user_input: newMessage.value.toString().replace("/chatbot", ""),
        })
      };
      const response = await fetch(url, options);
      const result = await response.text();
      const messageBot = {
        text: JSON.parse(result).response,
        username: "Chatbot",
        timestamp: Timestamp.fromDate(new Date()),
      }
      await addDoc(messagesRef, messageBot);

    }
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
      const message = {
        text: newMessage.value,
        username: userStore.user.displayName,
        timestamp: Timestamp.fromDate(new Date()),
      };
      if (!newMessage.value.trim()) return;
      if (!userStore.user) return;
      if (newMessage.value.toLowerCase().includes("/chatbot")) {
        await addDoc(messagesRef, message);
        await chatbot();
      } else {
        await addDoc(messagesRef, message);
      }
      newMessage.value = "";
    };

    return {
      messages,
      newMessage,
      sendMessage,
      chatbot,
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