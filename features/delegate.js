// Workspace: https://app.slack.com/client/T014GSPLNH2/C014FQ47P26
// Bot controls: https://api.slack.com/apps/A0150GPN4BS

// Plan for no-database system is to receive a message from one user and immediately pass it to another
// Persistence options: https://botkit.ai/docs/v4/core.html#enable-conversation-persistence
// https://www.npmjs.com/package/botbuilder-storage-mongodb
// Or just use process.env.MONGO_URI in bot.js

// const { SlackDialog } = require('botbuilder-adapter-slack');

module.exports = function(controller) {
	controller.on('slash_command', async(bot, message) => {
		const sendingUserId = message.user_id;
		
		const messageParts = message.text.match(/<@(U\w+)\|(\w+)>\s*(.*)/); // regexr.com/55tlg
		
		if (!messageParts || !messageParts[3]) {
			
			await bot.replyPrivate(message, "😞 Sorry, I didn't catch that. I need you to ask me like this: */delegate @user Do the thing*");
			
		} else {
			const receivingUserId = messageParts[1];
			const task = messageParts[3];

			await bot.replyPublic(message, `"${task}" has been delegated to <@${receivingUserId}>.`);

			await bot.startPrivateConversation(receivingUserId);
			
			// TODO: Add context link (https://api.slack.com/methods/chat.getPermalink)
			
			const blocks = {
				"blocks": [
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": `<@${sendingUserId}> has a new task for you: ${task}`,
						},
						"accessory": {
							"type": "button",
							"text": {
								"type": "plain_text",
								"text": "✔ Complete",
								"emoji": true
							},
							"value": "click_me_123"
						}
					}
				]
			}
			
			await bot.say(blocks);
			
		}
	});
}
