const fs = require("node:fs");

const configTemp =
	`
{
	"clientId": " client id here ",
	"guildId": "your guild id here",
	"token": " your token here "
}`;

if (!fs.existsSync("config.json"))
{
	//does not exist so write file
	console.log("config.json file does not exist creating! Please fill it out");
	fs.writeFileSync("config.json", configTemp);
} else
{
	console.log("config.json file already exists skipping");
}