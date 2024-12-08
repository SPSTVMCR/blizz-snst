<template>
  <div class="home">
    <div
        class="my-2 ml-2 d-flex flex-row w-100 justify-content-evenly align-items-center overflow-hidden"
    >
      <div class="d-flex flex-column align-items-center">
        <h4 class="text-info">{{ currentTime }}</h4>
      </div>
      <BForm @submit.prevent="addPost" class="w-75 d-flex flex-row form-container">
        <div class="d-flex flex-column align-items-center w-75">
          <BFormTextarea
              v-model="postTitle"
              placeholder="Give your post a title..."
              class="mt-3 h-25 fw-bold"
              required
          >
          </BFormTextarea>
          <BFormTextarea
              v-model="postContent"
              placeholder="Post something cool..."
              class="mt-2 h-75"
              required
          ></BFormTextarea>
        </div>
        <div class="d-flex flex-column w-25 mt-3 mx-3 action-container">
          <BButton type="submit" variant="primary" class="me-2 h-50"
          >Post
          </BButton
          >
          <BButton
              variant="outline-danger"
              class="me-2 mt-2 h-50"
              @click="clearPostContent"
          >Clear
          </BButton
          >
        </div>
        <!-- <h5 class="m-3 text-primary w-25">
          Welcome, {{ currentUser.displayName || currentUser.email }}
        </h5> -->
      </BForm>
    </div>
    <!--TODO: Toggleable sidebar  -->

    <!--Post template-->
    <div v-if="posts.length > 0" class="posts mt-3">
      <BCard
          v-for="post in posts"
          :key="post.id"
          class="post mb my-3 mx-3 p-0"
          @click="navigateToDetails(post)"
          no-body
      >
        <div class="d-flex flex-row post-content-div">
          <div
              class="d-flex flex-row bg-light info-container"
              style="width: 45%"
          >
            <img
                src="https://media.istockphoto.com/id/470107850/vector/snowflakes-icon-white-on-the-blue-background.jpg?s=612x612&w=0&k=20&c=6wY43xcp29gSVyctNP4X6j5nz1PMsFyU4xoa4YBguqQ="
                alt="Snowflake Icon"/>
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
              {{ truncateText(post.content, 360) }}
            </p>
          </div>
        </div>

        <BCardFooter class="px-0">
          <small>{{ formatDate(post.timestamp) }}</small>
        </BCardFooter>
      </BCard>
    </div>
    <div class="d-flex align-items-center m-3" v-else>
      <strong>Loading...</strong>
      <BSpinner class="ms-auto" variant="primary"/>
    </div>
  </div>
</template>

<script>
//Auto generated comments cus im lazy
import {onMounted, ref, watch} from "vue";
import {db} from "../firebase/firebase";
import {addDoc, collection, onSnapshot, orderBy, query, Timestamp,} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import {useRoute, useRouter} from "vue-router";

export default {
  setup() {
    // Reactive references for posts, post title, and post content
    const posts = ref([]);
    const postTitle = ref("");
    const postContent = ref("");

    // Vue Router composables
    const route = useRoute();
    const router = useRouter();

    // User store
    const userStore = useUserStore();
    const currentUser = ref(null);

    // Initialize currentUser from localStorage
    currentUser.value = JSON.parse(localStorage.getItem("user")) || null;

    /**
     * Fetch posts from Firestore and updates the posts ref
     */
    const fetchPosts = () => {
      const postsCollection = query(
          collection(db, "generalPosts"),
          orderBy("timestamp", "desc")
      );

      onSnapshot(postsCollection, (querySnapshot) => {
        posts.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        localStorage.setItem("posts", JSON.stringify(posts.value)); // Store the posts to localStorage
      });
    };

    /**
     * Add a new post to Firestore
     */
    const addPost = async () => {
      if (!postContent.value.trim()) return; // Do nothing if post content is empty
      try {
        await addDoc(collection(db, "generalPosts"), {
          content: postContent.value,
          title: postTitle.value,
          timestamp: Timestamp.fromDate(new Date()),
          user: userStore.user.displayName,
        });
        // Clear the post content and title after successful addition
        postContent.value = "";
        postTitle.value = "";
      } catch (error) {
        console.error("Error adding post:", error);
      }
    };

    /**
     * Format a Firestore timestamp to a readable date and time string
     * @param {Timestamp} timestamp - Firestore timestamp
     * @returns {string} - Formatted date and time
     */
    const formatDate = (timestamp) => {
      const date = timestamp.toDate();
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
    };

    /**
     * Truncate text if it exceeds the specified maxLength
     * @param {string} text - Text to be truncated
     * @param {number} maxLength - Maximum length of the text
     * @returns {string} - Truncated text
     */
    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    };

    /**
     * Clear the content of the post
     */
    const clearPostContent = () => {
      postContent.value = "";
    };

    /**
     * Navigate to the detailed view of a post
     * @param {Object} post - Post object to navigate to
     */
    const navigateToDetails = (post) => {
      console.log(post.id);
      localStorage.setItem("currentPost", JSON.stringify(post));
      router.push({name: "Post", params: {id: post.id}});
    };

    // Watch for route changes and fetch posts if on the Home route
    watch(route, () => {
      if (route.name === "Home") {
        fetchPosts();
      }
    });

    // Fetch posts on component mount
    onMounted(fetchPosts);

    return {
      posts,
      postContent,
      postTitle,
      addPost,
      formatDate,
      truncateText,
      currentUser,
      clearPostContent,
      navigateToDetails,
    };
  },
};
</script>

<style scoped>
body {
  overflow: hidden !important;
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
