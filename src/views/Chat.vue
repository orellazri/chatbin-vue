<template>
  <div>
    <div class="notification is-danger" v-if="error">
      {{ error }}
    </div>

    <div v-if="!error">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h4 class="title is-4">Welcome to chat room: {{ code }}</h4>
          </div>
          <div class="column" style="text-align: right">
            <a class="button is-danger" @click="deleteRoom()">Delete Room</a>
          </div>
        </div>

        <div class="columns chatbox">
          <div class="column">
            <div class="messages" id="messagesBox">
              <p
                v-for="message in messages"
                v-bind:key="message.id"
                class="bubble"
                :class="message.sender != userId ? 'received' : 'sent'"
              >
                {{ message.text }}
              </p>
              <div id="anchor"></div>
            </div>

            <form class="field has-addons" v-on:submit.prevent="sendMessage()">
              <div class="control is-expanded">
                <input
                  type="text"
                  class="input"
                  v-model="textInput"
                  placeholder="Say something..."
                />
              </div>
              <div class="control">
                <button type="submit" class="button is-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import router from '@/router';
import firebase from '@/firebase';
import db from '@/db';

export default {
  name: 'Chat',
  data() {
    return {
      error: null,
      code: '',
      messages: [],
      textInput: '',
    };
  },

  computed: mapState(['userId']),

  async created() {
    // Check if not logged in
    if (this.userId == '') {
      router.push('/');
    }

    // TODO: uncomment this validation
    // const room = await db.collection('rooms').doc(this.$route.params.code).get();

    // if (!room.exists) {
    // 	this.error = 'This room does not exist!';
    // 	return;
    // }

    this.code = this.$route.params.code;

		// Bind messages documents to messages state
    this.$bind('messages', db.collection('rooms').doc(this.code).collection('messages').orderBy('created_at', 'asc')
    );
  },

  watch: {
    messages() {
      this.scrollToBottom();
    },
  },

  methods: {
    scrollToBottom() {
			// Scroll to the bottom of the messages box
			// TODO: Fix not scrolling to bottom sometimes (on message received)
      let messagesBox = document.getElementById('messagesBox');
      messagesBox.scrollTop = messagesBox.scrollHeight;
    },

    async deleteRoom() {
      await db.collection('rooms').doc(this.code).delete();
      router.push('/');
    },

    async sendMessage() {
      const text = this.textInput;
      if (text.trim() == '') return;

      this.textInput = '';

      // Create a new message document
      const newDoc = await db.collection('rooms').doc(this.code).collection('messages').doc();
      const newDocRef = await newDoc.get();

      // Set the fields in the message document
      newDoc.set({
        id: newDocRef.id,
        text: text,
        sender: this.userId,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chatbox {
  background: #fff;
  border-radius: 5px;

  .messages {
    height: 60vh;
    padding: 1em;
    overflow: auto;

    .bubble {
      max-width: 45%;
      border-radius: 10px;
      padding: 0.5em;
      background: #407fff;
      color: #fff;
      margin-bottom: 0.5em;
      float: left;
      clear: both;
    }

    .received {
      background: #f1f0f0;
      color: #000;
      float: right;
    }
  }
}

#messagesBox * {
  overflow-anchor: none;
}

#anchor {
  overflow-anchor: auto;
  height: 1px;
}
</style>
