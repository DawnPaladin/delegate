const { SlackDialog } = require('botbuilder-adapter-slack');

module.exports = function(controller) {
	controller.on('slash_command', async(bot, message) => {
		if (message.text === 'plain') {
			await bot.reply(message, 'This is a plain reply');
		} else if (message.text === 'public') {
			await bot.replyPublic(message, 'This is a public reply');
		} else if (message.text === 'private') {
			await bot.replyPrivate(message, 'This is a private reply');
		}
		
		console.log(message);

		// set http status
		bot.httpBody({text:'You can send an immediate response using bot.httpBody()'});

	});
}
