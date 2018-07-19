const request = require('sync-request');
const sleep = require('sleep');
const fs = require('fs');
const scrapedData = require('../data/scraped-games');
const giantBombApiKey = require('./giant-bomb-api-key');

const getGameFromGiantBomb = (guid) => {
	const encodedGuid = encodeURIComponent(guid);
	const url = `https://www.giantbomb.com/api/game/${encodedGuid}/?api_key=${giantBombApiKey}&format=json&field_list=image,name,original_game_rating,original_release_date,platforms,site_detail_url,concepts,developers,franchises,genres,publishers,themes`;
	const res = request('GET', url, {
		headers: {
			'user-agent': 'https://github.com/bxyoung89/personal-videogames',
		}
	});
	const stringResponse = res.getBody('utf8');
	const parsedResponse = JSON.parse(stringResponse);
	const {results} = parsedResponse;
	if(!results){
		return undefined;
	}
	return results;
};

const getGameIdFromGiantBomb = (unencodedGameName) => {
	const gameName = encodeURIComponent(unencodedGameName);
	const res = request('GET', `https://www.giantbomb.com/api/search/?api_key=${giantBombApiKey}&query=${gameName}&limit=1&resources=game&resource_type=game&format=json&field_list=guid`, {
		headers: {
			'user-agent': 'https://github.com/bxyoung89/personal-videogames',
		}
	});
	const stringResponse = res.getBody('utf8');
	const parsedResponse = JSON.parse(stringResponse);
	const {results} = parsedResponse;
	if(results.length === 0){
		return undefined;
	}
	const {guid} = results[0];
	return guid;
};

const nameMappingFunction = thing => thing.name;

const mapGiantBombGame = (game) => {
	return {
		name: game.name,
		image: game.image.screen_large_url,
		ratings: game.original_game_rating.map(nameMappingFunction),
		releaseDate: game.original_release_date,
		platforms: game.platforms.map(nameMappingFunction),
		giantBombSite: game.site_detail_url,
		concepts: game.concepts.map(nameMappingFunction),
		developers: game.developers.map(nameMappingFunction),
		franchises: (game.franchises || []).map(nameMappingFunction),
		genres: game.genres.map(nameMappingFunction),
		publishers: game.publishers.map(nameMappingFunction),
		themes: game.themes.map(nameMappingFunction),
	};
};

const partialScrapedData = [
	scrapedData[0],
	scrapedData[1],
	scrapedData[1],
];

const completeData =  [];

const requestSleep = 1;
partialScrapedData.forEach(datum => {
	const {name, status} = datum;
	const gameId = getGameIdFromGiantBomb(name);
	sleep.sleep(requestSleep);
	if(!gameId){
		console.log(`couldn't find gameid for ${name}`);
		return;
	}
	console.log(`got gameid for ${name}`);
	const giantBombGame = getGameFromGiantBomb(gameId);
	sleep.sleep(requestSleep);
	if(!giantBombGame){
		console.log(`couldn't find data for ${name}`);
		return;
	}
	console.log(`got data for ${name}`);
	// todo maybe do some mapping to clean things up a bit?
	completeData.push({
		status,
		...mapGiantBombGame(giantBombGame),
		numberOfTimesOwned: false,
	});
});

const allGameNames = completeData.map(game => game.name);
const nameToCountMap = {};
allGameNames.forEach(name => {
	if(nameToCountMap[name] === undefined){
		nameToCountMap[name] = 0;
	}
	nameToCountMap[name]++;
});
const duplicateNames = Object.keys(nameToCountMap).filter(name => nameToCountMap[name] > 1);
// todo filter out duplicate names.

fs.writeFileSync('./output.json', JSON.stringify(completeData));
