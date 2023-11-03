const interface = require("app.js");
const discord = require("discord.js");
const fs = require("fs");
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
LoadConfigs();
client.login(botToken.BOT_TOKEN);
//---data storage--------------------------------------------------------------------
let bullyStorage = [];

//---event handlers------------------------------------------------------------------
client.on("ready", function (message)
{
	console.log(`${client.user.username} is ready`);
	client.user.setActivity("!help", { type: discord.ActivityType.Playing });
});

client.on("messageCreate", function (message)
{
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandbody = message.content.slice(config.default_prefix.length);
	const args = commandbody.split(' ');
	const command = args.shift().toLowerCase();

	switch (command)
	{
		case "help":
			help(args, message);
			break;

		case "kick":
			kick(args, message);
			break;

		case "bully":
			try
			{
				bully(args, message);
			}
			catch (err)
			{
				console.warn("something went wrong in the bully method");
				console.error(err);
			}
			break;

	}

	try
	{

		const GuildIndex = bullyStorage.findIndex(guilds => guilds.guildId == message.guildId);
		if (GuildIndex != -1)// is even any person registered to bully in this guild
		{
			const userIndex = bullyStorage[GuildIndex].Users.findIndex(u => u.UserID == message.author.id);
			if (userIndex != -1)
			{
				const userData = bullyStorage[GuildIndex].Users[userIndex];
				if (userData.annoyChannel == "-1" || message.channel.id == userData.annoyChannel)
				{
					message.reply(userData.annoyString);
				}
			}
		}


		if (message.content.toLowerCase().includes("cheese"))
		{
			message.react("🧀");

			if (message.content.startsWith("!"))
			{
				// const embedGif = new discord.Embed();
				message.channel.send(config.CHEESE_Tenor);
			}
		}
	}
	catch (err)
	{
		console.log("something went wrong");
		console.err(err);
	}
});

//---functions----------------------------------------------------------------------
function help(args, message)
{
	if (!(args.length > 0 && args.shift().toLowerCase() == "please"))
	{
		message.channel.send("Here are things I could do:\n lol you wish, ask Banana. or you could say 'help please' you know");
	} else
	{
		message.channel.send("okay since you asked nicely. \n-help: shows this\n-kick\n-bully");
	}
}
function bully(args, command)
{
	//!bully annoy specific users with a special sentence and maybe only in special channels
	//command: !bully set @user "phrase with space" channel(optional) minTimeBetweenMessages -- sets/overrides the bully command for a user "phrase can contain spaces"
	//command: !bully remove @user -- removes the bully command of a user for the guild the message comes from
	if (message.author.bot) return;
	if (command != 'bully') return;
	if (args.length < 2)
	{
		message.channel.send('too few arguments! you need to set it up with this syntax:\n!bully set user@ "phrase" channelname timeBetweenMessages(seconds)\n!bully remove user@');
		return;
	}
	else
	{

		if (args[0].toLowerCase().includes("set"))
		{
			const bullyString = commandBody.split('"')[1];
			console.log(`bully user with string:${bullyString}`);
			const bullyChannel = "-1";
			if (message.mentions.channels.length > 0)
			{
				bullyChannel = message.mentions.channels.first().id // get the channel from the message || -1 for any channel
			}
			let data = {
				UserID: message.mentions.users.first().id,
				annoyString: bullyString,
				annoyChannel: bullyChannel
			};
			const channel = "all channels";
			if (data.annoyChannel != "-1") channel = data.annoyChannel;

			if (bullyStorage.some(g => g.guildId == message.guildId))
			{
				const GuildIndex = bullyStorage.findIndex(g => g.guildId == message.guildId);
				if (bullyStorage[GuildIndex].Users.some(u => u.UserID == data.UserID))
				{
					const UserIndex = bullyStorage[GuildIndex].Users.findIndex(u => u.UserID == data.UserID);
					bullyStorage[GuildIndex].Users[UserIndex] = data;
					console.log(`found User at Guildindex ${GuildIndex} with userIndex ${UserIndex}`);
				} else
				{
					bullyStorage[GuildIndex].Users.push(data);
					console.log(`bullystorage at specified Guildindex(${GuildIndex}) did not contain a user with that UserID:${data.UserID}`);
				}
			} else
			{
				let NewGuild = {
					guildId: message.guild.id,
					Users:
						[
							data,
						]
				};
				bullyStorage.push(NewGuild);
				console.log(`created new Guild Entry in bullystorage because no guild with specified id was found`);
			}
		}
		else if (args[0].toLowerCase().includes("remove"))
		{
			if (annoyAUserData.some(data => data.UserID == message.mentions.users.first().id))
			{
				const index = annoyAUserData.findIndex(data => data.UserID == message.mentions.users.first().id)
				if (annoyAUserData.length - 1 == index)
				{
					annoyAUserData[index].UserID = "-1";
				} else
				{
					annoyAUserData[index] = annoyAUserData.pop();
				}

				message.channel.send(`I won't bully ${message.mentions.users.first().displayName} anymore on this server`);
			} else
			{
				message.channel.send(" I am not currently bullying this user in this server");
			}
		}
		else 
		{
			console.log(`invallid argument for remove command`);
		}
	}
	SaveConfigs();




}
function LoadConfigs()
{
	fs.readFile('./bullyConfig.json', 'utf-8', function (err, data)
	{
		if (err)
		{
			console.error(err);
		}
		console.info("bullyConfig.json read");
		try
		{
			bullyStorage = JSON.parse(data);//JSON.parse(data);
		} catch
		{
			console.log("error loading bullyconfig.json");
		}
	});
}
function SaveConfigs()
{
	fs.writeFile('./bullyConfig.json', JSON.stringify(bullyStorage, undefined, 2), function (err)
	{
		if (err)
		{
			console.error(err);
		}
		console.info("bullyConfig.json saved");
	});
}
function kick(args, message)
{
	if (message.member.permissions.has(discord.PermissionsBitField.kick))
	{
		if (message.author != message.mentions.users.first())
		{
			if (message.mentions.users.first().bot)
			{
				message.channel.send("you can't make me kick a bot");
				return;
			}
			message.guild.members.kick(message.mentions.users.first().id, args.shift());
		} else
		{
			message.channel.send("you can't kick yourself, silly ❤️");
		}
	} else
	{
		message.channel.send("Ha nice try! you do NOT have permission to kick people!");
	}
}
