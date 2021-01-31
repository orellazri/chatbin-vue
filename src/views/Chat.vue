<template>
  <div>
		<div class="notification is-danger" v-if="error">
			{{ error }}
		</div>

		<div v-if="!error">
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
					<div class="messages">
						<div v-for="message in messages"
							v-bind:key="message.text" class="bubble" :class="message.sender != userId ? 'received' : 'sent'">
							{{ message.text }}
						</div>
					</div>

					<form class="field has-addons" v-on:submit.prevent="sendMessage()">
						<div class="control is-expanded">
							<input type="text" class="input" v-model="textInput" placeholder="Say something...">
						</div>
						<div class="control">
							<button type="submit" class="button is-primary">Send</button>
						</div>
					</form>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import router from '@/router';
import store from '@/store';
import firebase from '@/firebase';
import db from '@/db';

export default {
  name: 'Chat',
  data() {
		return {
			error: null,
			code: '',
			messages: [],
			textInput: ''
		}
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

		this.$bind('messages', db.collection('rooms').doc(this.code).collection('messages').orderBy('created_at', 'asc'));
	},

	methods: {
		async deleteRoom() {
			await db.collection('rooms').doc(this.code).delete();
			router.push('/');
		},

		async sendMessage() {
			const text = this.textInput;
			this.textInput = '';

			await db.collection('rooms').doc(this.code).collection('messages').doc().set({
				text: text,
				sender: this.userId,
				created_at: firebase.firestore.FieldValue.serverTimestamp()
			});
		},
	},
}
</script>

<style lang="scss" scoped>
.chatbox {
	background: #fff;
	border-radius: 5px;

	.messages {
		min-height: 60vh;		

		.bubble {
			position: relative;
			background: #4849A1;
			color: #fff;
			padding: 0.6rem;
			border-bottom: 2px solid #eee;
			border-radius: .4em;
			-webkit-box-shadow: 5px 5px 9px -6px rgba(112,112,112,0.3); 
			box-shadow: 5px 5px 9px -6px rgba(112,112,112,0.3);
			margin-bottom: 10px;
			display: inline-block;
			max-width: 600px;
			float: left;
			clear: both;
		}

		.received {
			float: right !important;
			background:#777 !important;
		}
	}
}
</style>
