module.exports = function(controller) {
	// Listen for slash commands. We have only one: /delegate @user Task to be completed
	controller.on('slash_command', async(bot, message) => {
		const assigner = message.user_id; // ID of the user assigning the task
		
		const messageParts = message.text.match(/<@(U\w+)\|(\w+)>\s*(.*)/); // regexr.com/55tlg
		
		if (!messageParts || !messageParts[3]) {
			
			await bot.replyPrivate(message, "😞 Sorry, I didn't catch that. I need you to ask me like this: */delegate @user Do the thing*");
			
		} else {
			const worker = messageParts[1]; // ID of the user being assigned to work on the task
			const task = messageParts[3]; // text of the task

			await bot.replyPublic(message, `"${task}" has been delegated to <@${worker}>.`);

			await bot.startPrivateConversation(worker);
			
			await bot.say({ // built with https://api.slack.com/tools/block-kit-builder
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
	
	// React to button when task is complete
	controller.on('block_actions', async(bot, message) => {
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
