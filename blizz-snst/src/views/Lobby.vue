<template>
  <div class="lobby-view">
    <h1>Join a Chat Room</h1>
    <form class="join-room-form" @submit.prevent="joinRoom">
      <input type="text" v-model="roomId" placeholder="Enter Room ID">
      <button type="submit">Join</button>
    </form>
    <div class="recent-rooms">
      <h3>Recent Rooms</h3>
      <ul>
        <li v-for="room in recentRooms" :key="room" @click="joinRoom(room)">
          {{ room }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/user';

export default {
  setup() {
    const roomId = ref('');
    const router = useRouter();
    const userStore = useUserStore();

    const joinRoom = (roomId = '') => {
      if (!roomId) {
        roomId.value = roomId;
      }
      router.push({name: 'Chat', params: {roomId}});
      userStore.addRecentRoom(roomId);
    };

    return {
      roomId,
      joinRoom,
      recentRooms: userStore.recentRooms,
    };
  },
};
</script>

<style scoped>
.lobby-view {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.join-room-form {
  margin-bottom: 20px;
}

.join-room-form input[type='text'] {
  width: 80%;
  height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.join-room-form button[type='submit'] {
  width: 20%;
  height: 40px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

.recent-rooms {
  margin-top: 20px;
}

.recent-rooms ul {
  list-style: none;
  padding: 0;
}

.recent-rooms li {
  cursor: pointer;
  margin-bottom: 10px;
}
</style>