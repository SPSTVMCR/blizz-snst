<script>

export default {
  setup() {

  },
};
</script>

<template>
  <h1>Lobby</h1>
  <BCard class="w-100 h-100 mx-auto bg-primary" no-body>
    <h1 class="text-center text-white">Join a chatroom!</h1>
    <BForm class="bg-light w-75 mx-auto">
      <BFormInput placeholder="Room ID"></BFormInput>
      <BButton>Join</BButton>
    </BForm>
  </BCard>
</template>

<style scoped></style>
