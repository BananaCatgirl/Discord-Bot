const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`ping`)
		.setDescription(`Replies  with Pong!`),
	async execute(interaction)
	{
		await interaction.reply({ content: `secret Pong!` });
		setTimeout(60000);
		// 1000 = 1s
		// 60000 = 1min
		// 600000 = 10min
		await interaction.followUp(`I just wanted to be annoying you`);
	},
};