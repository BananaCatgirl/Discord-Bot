const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`deletemessages`)
		.setDescription(`deletes the last x amount of messages`),
	async execute(interaction, amount)
	{
		const userId = interaction.user.id;
		const disName = interaction.user.displayName;
		interaction.reply(`can't delete messages yet. you wanted to delete ${amount} messages, right ${disName} ${userId}? `);

		// const lastMessages = interaction.channel.messages.fetch({ limit: amount });
		// for (const message in lastMessages)
		// {
		// 	message.delete();
		// }
	},

};