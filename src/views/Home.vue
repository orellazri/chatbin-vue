<template>
  <div class="columns is-centered">
    <div class="column is-half">
      <h1 class="title">Welcome to chatbin!</h1>
      <p>
        Your code is: <span class="has-text-weight-bold">{{ hostCode }}</span>
      </p>
      <div class="field">
        <a class="button is-primary" @click="hostRoom()">Host a room</a>
      </div>
      <hr />
      <p>Got someone's code? Join instead:</p>
      <div class="field">
        <input
          type="text"
          class="input"
          id="joinCode"
          v-model="joinCode"
          placeholder="Enter a code..."
        />
      </div>
      <div class="field">
        <a class="button is-primary" @click="joinRoom()">Join a room</a>
      </div>

      <div
        class="notification is-danger is-light"
        v-for="error in errors"
        v-bind:key="error"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import store from "@/store";
//import firebase from "@/firebase";
import db from "@/db";

export default {
  name: "Home",
  data() {
    return {
      errors: [],
      joinCode: "",
    };
  },

  async created() {
    store.dispatch("logIn");
  },

  computed: {
    hostCode() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
  },

  methods: {
    hostRoom() {
      db.collection("rooms")
        .doc(this.hostCode)
        .set({});
      router.push("/chat/" + this.hostCode);
    },

    async joinRoom() {
      if (this.joinCode.trim() == "") return;

      const room = await db
        .collection("rooms")
        .doc(this.joinCode)
        .get();
      if (room.exists) {
        router.push("/chat/" + this.joinCode);
      } else {
        this.errors.push("Room code does not exist.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#joinCode {
  max-width: 150px;
}
</style>
