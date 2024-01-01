const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cheese")
		.setDescription("do you Like cheese?"),
	async execute(interaction)
	{
		const embed = new EmbedBuilder()
			.setColor("Yellow")
			.setTitle("CHEESE!")
			.setDescription("Cheese is Great!")
			.setImage(config.CHEESE_Tenor);
		await interaction.send({ embeds: [embed] });
		// await interaction.react("🧀");
	}
}

// if (message.author.bot) return;

// if (message.content.toLowerCase().includes("cheese"))
// {
// 	message.react("🧀");

// 	if (message.content.startsWith("!"))
// 	{
// 		const embedGif = new discord.Embed();
// 		embedGif.image
// 		message.channel.send(config.CHEESE_Tenor);
// 	}
// }