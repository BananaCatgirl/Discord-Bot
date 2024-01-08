const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

const CHEESE_Tenor = `https://media.tenor.com/Psy7Fy33mk0AAAAC/cheese.gif`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`cheese`)
		.setDescription(`do you Like cheese?`),
	async execute(interaction)
	{
		const embed = new EmbedBuilder()
			.setColor(`Yellow`)
			.setTitle(`CHEESE!`)
			.setDescription(`Cheese is Great!`)
			.setImage(CHEESE_Tenor);
		await interaction.reply({ embeds: [embed] });
	},
};