const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`deletemessages`)
		.setDescription(`deletes the last x amount of messages`),
	async execute(interaction, amount)
	{
		interaction.reply(`can't delete messages yet. you wanted to delete ${amount} messages`);
		// const lastMessages = interaction.channel.messages.fetch({ limit: amount });
		// for (const message in lastMessages)
		// {
		// 	message.delete();
		// }
	},

};