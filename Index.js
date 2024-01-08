require(`dotenv`).config();
const fs = require(`node:fs`);
const path = require(`node:path`);
const mongoose = require(`mongoose`);
const { Client, Collection, GatewayIntentBits } = require(`discord.js`);


// console.log(`env mongo:` + process.env.mongodb);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, `commands`);
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders)
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(`.js`));
	for (const file of commandFiles)
	{
		const filepath = path.join(commandsPath, file);
		const command = require(filepath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if (`data` in command && `execute` in command)
		{
			client.commands.set(command.data.name, command);
		}
		else
		{
			console.log(`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, `events`);
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(`.js`));

for (const file of eventFiles)
{
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once)
	{
		client.once(event.name, (...args) => event.execute(...args));
	}
	else
	{
		client.on(event.name, (...args) => event.execute(...args));
	}
}

mongoose.connect(process.env.mongodb);
client.login(process.env.bottoken);