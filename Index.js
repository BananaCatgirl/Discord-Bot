const discord = require("discord.js");
const config = require("./config.json");
const botToken = require("./TokenConfig.json");
const client = new discord.Client({
	intents:
		[
			discord.GatewayIntentBits.Guilds,
			discord.GatewayIntentBits.GuildMessages,
			discord.GatewayIntentBits.MessageContent,
			// discord.GatewayIntentBits.GuildMessages,
			discord.GatewayIntentBits.GuildMembers,
			discord.GatewayIntentBits.DirectMessages,
			discord.GatewayIntentBits.GuildModeration,
			discord.GatewayIntentBits.GuildPresences
		]
});
client.login(botToken.BOT_TOKEN);


client.on("ready", function (message) {
	console.log(`${client.user.username} is ready`);
	client.user.setActivity("!help", { type: discord.ActivityType.Playing });
});

client.on("messageCreate", function (message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandbody = message.content.slice(config.default_prefix.length);
	const args = commandbody.split(' ');
	// args.toLowerCase();
	const command = args.shift().toLowerCase();

	if (command == "help") {

		if (args.length > 0 && args.shift().toLowerCase() == "please") {
			message.channel.send("okay since you asked nicely, here a.e Th..krs III c- c-");
			message.channel.send("hmm seems like Banana was a bit lazy there sorry friend.");
		} else {
			message.channel.send("Here are things I could do:\n lol you wish, ask Banana. or you could say 'please' you know");
		}


	}
});

client.on("messageCreate", function (message) {
	if (message.author.bot) return;

	if (message.content.toLowerCase().includes("cheese")) {
		message.react("🧀");

		if (message.content.startsWith("!")) {
			const embedGif = new discord.Embed();
			embedGif.image
			message.channel.send(config.CHEESE_Tenor);
		}
	}
});

client.on("messageUpdate", function (oldmessage, newmessage) {
	if (newmessage.author.bot) return;
	console.log("a message was updated");
	newmessage.react("🔁");
});

client.on("messageCreate", function (message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandBody = message.content.slice(config.default_prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();


	if (command == "kick") {
		if (message.member.permissions.has(discord.PermissionsBitField.kick)) {
			if (message.author != message.mentions.users.first()) {
				if (message.mentions.users.first().bot) {
					message.channel.send("you can't kick a bot");
					return;
				}
				message.guild.members.kick(message.mentions.users.first().id, args.shift());
			} else {
				message.channel.send("you can't kick yourself, silly ❤️");
			}
		} else {
			message.channel.send("Ha nice try! you do NOT have permission to kick people!");
		}

	}
});