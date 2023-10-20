const Discord = require("discord.js");
const GatewayIntentBits = require("discord.js");
const config = require("./config.json");
const botToken = require("./TokenConfig.json");
const client = new Discord.Client({
	intents:
		[
			Discord.GatewayIntentBits.Guilds,
			Discord.GatewayIntentBits.GuildMessage,
			Discord.GatewayIntentBits.MessageContent,
			Discord.GatewayIntentBits.GuildMembers
		]
});

client.login(botToken.BOT_TOKEN);


client.on("ready", function (message) {
	console.log(`${client.user.username} is ready`);
});

client.on("messageCreate", function (message) {
	if (message.author.bot) return;

	if (message.content.toLowerCase().includes("cheese")) {
		message.react("🧀");
		message.channel.send(config.CHEESE_Tenor);
	}

});

function Logout() {
	client.Logout();
}