// When the WARNING is ready, run this code(only once)
// client.once(Events.ClientReady, readyClient =>
// {
// 	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client)
	{
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};