// Workspace: https://app.slack.com/client/T014GSPLNH2/C014FQ47P26
// Bot controls: https://api.slack.com/apps/A0150GPN4BS

// Plan for no-database system is to receive a message from one user and immediately pass it to another
// Persistence options: https://botkit.ai/docs/v4/core.html#enable-conversation-persistence
// https://www.npmjs.com/package/botbuilder-storage-mongodb
// Or just use process.env.MONGO_URI in bot.js

// const { SlackDialog } = require('botbuilder-adapter-slack');

module.exports = function(controller) {
	controller.on('slash_command', async(bot, message) => {
		const assigner = message.user_id;
		
		const messageParts = message.text.match(/<@(U\w+)\|(\w+)>\s*(.*)/); // regexr.com/55tlg
		
		if (!messageParts || !messageParts[3]) {
			
			await bot.replyPrivate(message, "😞 Sorry, I didn't catch that. I need you to ask me like this: */delegate @user Do the thing*");
			
		} else {
			console.log(message);
			
			const worker = messageParts[1];
			const task = messageParts[3];

			await bot.replyPublic(message, `"${task}" has been delegated to <@${worker}>.`);

			await bot.startPrivateConversation(worker);
			
			await bot.say({
				"blocks": [
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": `<@${assigner}> has a new task for you: ${task}`,
						},
						"accessory": {
							"type": "button",
							"text": {
								"type": "plain_text",
								"text": "Complete",
								"emoji": true
							},
							"value":  message.channel_id + "|" + assigner + "|" + task
						}
					}
				]
			});
			
		}
	});
	
	controller.on('block_actions', async(bot, message) => {
		console.log(message);
		
		// Button value looks like this: channelId|assigner|task
		const messageArray = message.text.split('|');
		const channelId = messageArray.shift();
		const assigner = messageArray.shift();
		const task = messageArray.join('|'); // in case task has any pipe characters in it
		const worker = message.user;
		
		await bot.startConversationInChannel(channelId);
		await bot.say(`<@${worker}> reports that the task <@${assigner}> delegated to them is complete: ${task}`);
	});
}
