const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteMessages')
		.setDescription('deletes the last x amount of messages'),
	async execute(interaction, amount)
	{
		const lastMessages = interaction.channel.messages.fetch({ limit: amount });
		for (const message in lastMessages)
		{
			message.delete();
		}
	},

};