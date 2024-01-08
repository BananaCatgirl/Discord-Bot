const fs = require(`node:fs`);

const configTemp =
	`{
	"clientId": " client id here ",
	"guildId": "your guild id here",
	"token": " your token here ",
	"mongoDB" : "mongoDB url Here"
}`;

if (!fs.existsSync(`config.json`))
{
	// does not exist so write file
	console.log(`config.json file does not exist creating! Please fill it out`);
	fs.writeFileSync(`config.json`, configTemp);
}
else
{
	console.log(`config.json file already exists skipping`);
}

if (!fs.existsSync(`environment.env`))
{
	console.log(`.env does not exist, Creating!`);
	fs.writeFileSync(`.env`, ``);
}
else
{
	console.log(`File already exists, skipping!`);
}