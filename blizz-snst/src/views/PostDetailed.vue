<template>
  <h1>Post Detailed</h1>
  <div v-if="post">
    <BCard class="post mb my-3 mx-3 p-0" no-body>
      <div class="d-flex flex-row post-content-div">
        <div class="d-flex flex-row bg-light info-container" style="width: 45%">
          <img
            src="https://media.istockphoto.com/id/470107850/vector/snowflakes-icon-white-on-the-blue-background.jpg?s=612x612&w=0&k=20&c=6wY43xcp29gSVyctNP4X6j5nz1PMsFyU4xoa4YBguqQ="
          />
          <div class="d-flex flex-column align-items-start wrap">
            <h5 class="card-title mt-3 mb-2 mx-3">{{ post.user }}</h5>
            <small class="text-muted mx-3"> Blizz Snowview User </small>
          </div>
        </div>
        <div class="d-flex flex-column align-items-start w-100">
          <div
            class="bg-primary d-flex flex-row align-items-center w-100 justify-content-between"
          >
            <p class="card-title mx-3 my-2 fw-bold fs-6 text-light">
              {{ post.title }}
            </p>
          </div>
          <p class="card-text mx-3 my-3">
            {{ post.content }}
          </p>
        </div>
      </div>

      <BCardFooter class="px-0">
        <small>{{ formatDate(post.timestamp) }}</small>
      </BCardFooter>
    </BCard>
    <div class="d-flex flex-column align-items-center w-100 mt-3">
      <div class="d-flex flex-row align-items-start w-100 mx-3">
        <h4 class="text-info fw-bold text-decoration-underline mx-4">
          Comments
        </h4>
        <BButton variant="outline-primary" @click="commentToggle"
          >Comment</BButton
        >
      </div>
    </div>
    <TransitionGroup name="fade">
      <BForm
        @submit.prevent="addComment"
        class="w-100 d-flex flex-row justify-content-evenly mx-3"
        v-if="commenting"
      >
        <div class="d-flex flex-column align-items-center w-75">
          <BFormTextarea
            v-model="postContent"
            placeholder="Your thoughts on this?"
            class="mt-2 mx-3 h-100"
            required
          ></BFormTextarea>
        </div>
        <div class="d-flex flex-column w-25 mt-3 mx-3">
          <BButton type="submit" variant="primary" class="me-2 h-50"
            >Post</BButton
          >
          <BButton
            variant="outline-danger"
            class="me-2 mt-2 h-50"
            @click="clearpostContent"
            >Clear</BButton
          >
        </div>
      </BForm>
    </TransitionGroup>
  </div>
  <div class="d-flex align-items-center m-3" v-else>
    <strong>Loading...</strong>
    <BSpinner class="ms-auto" variant="primary" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "../firebase/firebase";
import { watch } from "vue";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const post = ref(null);
    const commenting = ref(false);
    const postContent = ref(null);

    const postId = route.params.id;
    const postRef = doc(db, "generalPosts", postId);

    //Fetching the post
    const fetchPost = async () => {
      //Get the post's id from the route params
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        post.value = postSnapshot.data();
      } else {
        console.log("Post not found");
      }
    };
    //Formatting the date
    const formatDate = (timestamp) => {
      const date = timestamp.toDate();
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`; //Convert to local time string on the end user device
    };

    //Comment function
    const commentToggle = async () => {
      commenting.value = !commenting.value;
    };
    //Adding a new comment
    const addComment = async () => {
      try {
        console.log(postContent);
        await addDoc(collection(postRef, "comments"), {
          content: postContent.value,
          timestamp: Timestamp.fromDate(new Date()),
          user: userStore.user.displayName,
        });
        console.log("added comment");
        postContent.value = "";
      } catch (error) {
        console.error("Error adding comment:", error);
      }
      console.log(postRef);
    };
    //On rendering
    onMounted(() => {
      fetchPost();
    });

    return {
      post,
      formatDate,
      commentToggle,
      commenting,
      addComment,
    };
  },
};
</script>
<style scoped>
body {
  overflow: hidden;
}
@media screen and (max-width: 600px) {
  img {
    width: 5rem;
    height: 5rem;
  }
  .post-content-div {
    flex-direction: column !important;
  }
  .info-container {
    width: 100% !important;
  }
}
@media screen and (min-width: 600px) {
  img {
    width: 10rem;
    height: 10rem;
  }
  .post-content-div {
    flex-direction: row !important;
  }
  .info-container {
    width: 45% !important;
    height: 100% !important;
  }
}
</style>
