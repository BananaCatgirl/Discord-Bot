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
//git credentials? v2

client.on("ready", function (message)
{
	console.log(`${client.user.username} is ready`);
	client.user.setActivity("!help", { type: discord.ActivityType.Playing });
});

let annoyAUserData = [];
//CURRENT:
// {
// 	UserID: 0,
// 	annoyString: "lol",
// 	annoyChannel: "test",
//  GuildID: 19687
// },
//-----------------------------------
//PLANED:
//{
//	Guild
//	{
//		ID:1,
//		{
//			{
// 				UserID: 0,
// 				annoyString: "annoy 0",
// 				annoyChannel: "test0",
// 			},
//			{
// 				UserID: 1,
// 				annoyString: "annoy1",
// 				annoyChannel: "test1",
// 			},
//		}
//	}
//	Guild
//	{
//		ID:2,
//		{
//			{
// 				UserID: 3,
// 				annoyString: "annoy 3",
// 				annoyChannel: "test3",
// 			},
//			{
// 				UserID: 1,
// 				annoyString: "annoy1",
// 				annoyChannel: "test1",
// 			},
//		}
//	}
//}



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

			if (message.author.id != 145544937423896577)
			{
				message.channel.send("NYI - canceling");//----------------------------------------NYI REURN
				return;
			}//-----------------------------------------------------------------------------------NYI REURN

			if (args.length < 2)
			{
				message.channel.send('too few arguments! you need to set it up with this syntax:\n!bully set user@  "phrase"  channelname timeBetweenMessages(seconds)\n!bully remove user@');
				return;
			} else
			{
				try
				{
					if (args.length >= 4 && args[0].toLowerCase() == "set")
					{

						const bullyString = commandBody.split('"')[1];//----------------------TODO: Fix adding actual message
						console.log(`bully user with string:${bullyString}`);
						const bullyChannel = "specify channel" || "-1" // get the channel from the message || -1 for any channel //TODO: actually implement channel
						// 	UserID: 2,
						// 	annoyString: "wub wub",
						// 	annoyChannel: "test2"
						let data = {
							UserID: message.mentions.users.first().id,
							annoyString: bullyString,
							annoyChannel: bullyChannel,
							GuildID: message.channel.guildId
						};
						if (annoyAUserData.some(d => d.UserID == data.UserID))
						{
							index = annoyAUserData.findIndex(d => d.UserID == data.UserID);
							annoyAUserData[index] = data;
							console.log(`user overwriten: UserID: ${data.UserID}, annoyString:${data.annoyString}, annnoyChannel:${data.annoyChannel}, GuildID:${data.GuildID} `)
						} else
						{
							annoyAUserData.push(data);
							console.log(`new user to annoy was set: UserID: ${data.UserID}, annoyString:${data.annoyString}, annnoyChannel:${data.annoyChannel}, GuildID:${data.GuildID} `)
						}
					}
					else if (args[0].toLowerCase() == "remove")
					{// remove command----------------


						//SaveFile(annoyAUserData); //save the array
					}
					else { message.channel.send(`argument 0(set / remove) was not valid you entered "${args[0].toLowerCase()}"`) }

				} catch (err)
				{
					message.channel.send("oops something went wrong!");
					console.err(err);
				}
			}

		}
		else
		{//SEND ANNOYING MESSAGES---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
			try
			{
				if (annoyAUserData.some(data => data.UserID == message.author.id))
				{
					const lol = annoyAUserData.find(s => s.UserID == message.author.id);
					message.reply(lol.annoyString);
				}
				else
				{
					console.info(`nope ${message.author.id} does not exist inside the list of users`);
				}
			}
			catch
			{
				console.err("error checking if user shoud be bullied");
			}
		}
	}
	catch (err)
	{
		console.warn("something went wrong in the bully method");
		console.error(err);
	}
});


function SaveFile(data)
{
	fs.writeFile('/bullyConfig.json', data, function (err)
	{
		if (err)
		{
			console.log(err);
		}
		console.log("bullyConfig.json saved");
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