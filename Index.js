const discord = require("discord.js");
const config = require("./config.json");
const botToken = require("./TokenConfig.json");
const client = new discord.Client({
	intents:
		[
			discord.GatewayIntentBits.Guilds,
			discord.GatewayIntentBits.GuildMessages,
			discord.GatewayIntentBits.MessageContent,
			discord.GatewayIntentBits.GuildMembers,
			discord.GatewayIntentBits.DirectMessages,
			discord.GatewayIntentBits.GuildModeration,
			discord.GatewayIntentBits.GuildPresences
		]
});

client.login(botToken.BOT_TOKEN);


client.on("ready", function (message) {
	console.log(`${client.user.username} is ready`);
	client.user.setActivity("being Helpfull", { type: discord.ActivityType.Playing });
	// client.user.setPresence(
	// 	{
	// 		game:
	// 			{ name: "a game", type: "watching" },
	// 		status:
	// 			'online'
	// 	});
});

client.on("messageCreate", function (message) {
	if (message.author.bot) return;

	if (message.content.toLowerCase().includes("cheese")) {
		message.react("🧀");

		if (message.startsWith("!")); {
			message.channel.send(config.CHEESE_Tenor);
		}
	}
});

client.on("messageUpdate", function (message) {
	if (!message.author.bot) return;
	message.react("❤️");
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
				message.guild.members.kick(message.mentions.users.first().id, args.shift());
			} else {
				message.channel.send("you can't kick yourself, silly ❤️");
			}
		} else {
			message.channel.send("Ha nice try! you do NOT have permission to kick people!");
		}

	}
});