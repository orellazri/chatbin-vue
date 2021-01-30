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
					<p v-for="message in messages" v-bind:key="message.text">
						{{ message.text }}
					</p>

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
import router from '@/router';
import db from '@/db';
import firebase from '@/firebase';

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

	async created() {
		// TODO: uncomment this validation
		const room = await db.collection('rooms').doc(this.$route.params.code).get();

		if (!room.exists) {
			this.error = 'This room does not exist!';
			return;
		}

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
}
</style>
