const discord = require("discord.js");
const config = require("./config.json");
const botToken = require("./TokenConfig.json");
const client = new discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers]
});

client.login(config.BOT_TOKEN);


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