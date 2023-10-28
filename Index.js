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
client.login(botToken.BOT_TOKEN);

client.on("ready", function (message)
{
	console.log(`${client.user.username} is ready`);
	LoadConfigs();
	client.user.setActivity("!help", { type: discord.ActivityType.Playing });
});

let annoyAUserData = [];
let bullyStorage = [];
//annoy specific users with a special sentence and maybe only in special channels
//command: !bully set @user "phrase with space" channel(optional) minTimeBetweenMessages -- sets/overrides the bully command for a user "phrase can contain spaces" 
//command: !bully remove @user -- removes the bully command of a user for the guild the message comes from
client.on("messageCreate", function (message)
{
	try
	{
		if (message.author.bot) return;
		if (message.content.startsWith(config.default_prefix))
		{
			const commandBody = message.content.slice(config.default_prefix.length);
			const args = commandBody.split(' ');
			const command = args.shift().toLowerCase();
			if (command != 'bully') return;

			if (args.length < 2)
			{
				message.channel.send('too few arguments! you need to set it up with this syntax:\n!bully set user@  "phrase"  channelname timeBetweenMessages(seconds)\n!bully remove user@');
				return;
			}
			else
			{
				try
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

						//OLD LIST------
						if (annoyAUserData.some(d => d.UserID == data.UserID))
						{
							index = annoyAUserData.findIndex(d => d.UserID == data.UserID);
							annoyAUserData[index] = data;
							message.channel.send(`okay I changed the phrase I use to bully ${message.mentions.users.first().displayName} to: "${data.annoyString}" in channel:${channel}`);
						} else
						{
							annoyAUserData.push(data);
							message.channel.send(`okay from now on I will bully ${message.mentions.users.first().displayName} with the phrase:"${data.annoyString}"`)
						}
						//OLD LIST END---------


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
						message.channel.send(`argument 0(set / remove) was not valid! you entered "${args[0].toLowerCase()}"`)
					}

				} catch (err)
				{
					message.channel.send("oops something went wrong!");
					console.error(err);
				}
			}
			SaveConfigs();
		}
		else
		{//SEND ANNOYING MESSAGES---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
						} else
						{
							console.log("not the right channel")
						};
					} else
					{
						console.log("user not found in list to bully for this guild skipping");
					}
				}
				else
				{
					console.log(`Guild does not exist in list. so no bully!`);
				}
			}
			catch (err)
			{
				console.error(err);
				console.error("error checking if user shoud be bullied");
			}
		}
	}
	catch (err)
	{
		console.warn("something went wrong in the bully method");
		console.error(err);
	}
});

//!save_config bananatoast only
client.on("messageCreate", function (message)
{
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandBody = message.content.slice(config.default_prefix.length);
	const command = commandBody.toLowerCase();

	if (command != "save_config") return;
	if (message.author.username = "bananatoast_")
	{
		message.channel.send(`oh hey banana! you want to save the config? sure why not`);
		SaveConfigs();
	}
});

function LoadConfigs()
{
	fs.readFile('./annoyConfig.json', 'utf-8', function (err, data)
	{
		if (err)
		{
			console.error(err);
		}
		console.info("annoyConfig.json read");
		try
		{
			annoyAUserData = JSON.parse(data);//JSON.parse(data);
		} catch
		{
			console.log("error loading annoyConfig.json");
		}
	});

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



	fs.writeFile('./annoyConfig.json', JSON.stringify(annoyAUserData, undefined, 2), function (err)
	{
		if (err)
		{
			console.error(err);
		}
		console.info("annoyConfig.json saved");
	});
}

client.on("messageCreate", function (message)
{
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandbody = message.content.slice(config.default_prefix.length);
	const args = commandbody.split(' ');
	// args.toLowerCase();
	const command = args.shift().toLowerCase();

	if (command == "help")
	{

		if (args.length > 0 && args.shift().toLowerCase() == "please")
		{
			message.channel.send("okay since you asked nicely, here a.e Th..krs III c- c-");
			message.channel.send("hmm seems like Banana was a bit lazy there sorry friend.");
		} else
		{
			message.channel.send("Here are things I could do:\n lol you wish, ask Banana. or you could say 'please' you know");
		}


	}
});

client.on("messageCreate", function (message)
{
	if (message.author.bot) return;

	if (message.content.toLowerCase().includes("cheese"))
	{
		message.react("🧀");

		if (message.content.startsWith("!"))
		{
			const embedGif = new discord.Embed();
			embedGif.image
			message.channel.send(config.CHEESE_Tenor);
		}
	}
});

client.on("messageUpdate", function (oldmessage, newmessage)
{
	if (newmessage.author.bot) return;
	console.log("a message was updated");
	newmessage.react("🔁");
});
//kick command
client.on("messageCreate", function (message)
{
	if (message.author.bot) return;
	if (!message.content.startsWith(config.default_prefix)) return;

	const commandBody = message.content.slice(config.default_prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();


	if (command == "kick")
	{
		if (message.member.permissions.has(discord.PermissionsBitField.kick))
		{
			if (message.author != message.mentions.users.first())
			{
				if (message.mentions.users.first().bot)
				{
					message.channel.send("you can't kick a bot");
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
});