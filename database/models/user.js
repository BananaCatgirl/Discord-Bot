const mongo = require(`mongoose`);

const Schema = new mongo.Schema({
	UniqueId: String,
	DisplayName: String,
});

module.exports = mongo.model(`Discord-Bot`, Schema);
