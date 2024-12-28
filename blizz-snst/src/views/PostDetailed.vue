<template>
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
        >Comment
        </BButton
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
              v-model="currentCommentContent"
              placeholder="Your thoughts on this?"
              class="mt-2 mx-3 h-100"
              required
          ></BFormTextarea>
        </div>
        <div class="d-flex flex-column w-25 mt-3 mx-3">
          <BButton type="submit" variant="primary" class="me-2 h-50"
          >Post
          </BButton
          >
          <BButton
              variant="outline-danger"
              class="me-2 mt-2 h-50"
              @click="clearCurrentCommentContent"
          >Clear
          </BButton
          >
        </div>
      </BForm>
    </TransitionGroup>
    <div class="d-flex flex-column align-items-center mt-3">
      <BCard style="width: 90vw;"
             class="comment mb my-3 mx-3 p-0"
             no-body
             v-for="comment in comments"
             :key="comment.id ">
        <div class="d-flex flex-row comment-content-div">
          <div class="d-flex flex-row bg-light info-container" style="width: 45%">
            <img
                src="https://media.istockphoto.com/id/470107850/vector/snowflakes-icon-white-on-the-blue-background.jpg?s=612x612&w=0&k=20&c=6wY43xcp29gSVyctNP4X6j5nz1PMsFyU4xoa4YBguqQ="
            />
            <div class="d-flex flex-column align-items-start wrap">
              <h5 class="card-title mt-3 mb-2 mx-3">{{ comment.user }}</h5>
              <small class="text-muted mx-3"> Blizz Snowview User </small>
            </div>
          </div>
          <div class="d-flex flex-column align-items-start w-100">

            <p class="card-text mx-3 my-3">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <BCardFooter class="px-0">
          <small>{{ formatDate(comment.timestamp) }}</small>
        </BCardFooter>
      </BCard>
    </div>
  </div>
  <div class="d-flex align-items-center m-3" v-else>
    <strong>Loading...</strong>
    <BSpinner class="ms-auto" variant="primary"/>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {db} from "../firebase/firebase";
import {addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp,} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const post = ref(null);
    const commenting = ref(false);
    const currentCommentContent = ref(null);
    const comments = ref([]);

    const postId = route.params.id;
    const postRef = doc(db, "generalPosts", postId);
    const commentsRef = collection(postRef, "comments");
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
        console.log(currentCommentContent);
        await addDoc(collection(postRef, "comments"), {
          content: currentCommentContent.value,
          timestamp: Timestamp.fromDate(new Date()),
          user: userStore.user.displayName,
        });
        console.log("added comment");
        currentCommentContent.value = "";
      } catch (error) {
        console.error("Error adding comment:", error);
      }
      console.log(postRef);
    };
    //Fetching comments
    const fetchComments = async () => {
      comments.value = [];
      const q = query(commentsRef, orderBy("timestamp", "desc"));
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            comments.value.push(change.doc.data());
          }
        });
      });
      console.log(comments.value);

    };
    //Fetching comments on rendering

    //Clearing the comment content
    const clearCurrentCommentContent = () => {
      currentCommentContent.value = "";
    }
    //On rendering
    onMounted(() => {
      fetchPost();
      fetchComments();
    });

    return {
      post,
      currentCommentContent,
      formatDate,
      commentToggle,
      commenting,
      addComment,
      comments,
      clearCurrentCommentContent,
    };
  }
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

  .comment-content-div {
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
    flex-direction: column !important;
    width: 100% !important;
  }

  .comment-content-div {
    flex-direction: row !important;
  }

  .info-container {
    width: 45% !important;
    height: 100% !important;
  }
}
</style>
