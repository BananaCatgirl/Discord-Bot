const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`secret-ping`)
		.setDescription(`secretly replies with Pong!`),
	async execute(interaction)
	{
		await interaction.reply({ content: `secret Pong!`, ephemeral: true });
	},
};