const request = require('sync-request');
const sleep = require('sleep');
const fs = require('fs');
const rawGiantBombData = require('../data/raw-giant-bomb-data');
const giantBombPlatformToSystemIdMap = require('../data/giant-bomb-platform-to-system-id-map');
const backloggerySystemToSystemIdMap = require('../data/backloggery-system-to-system-id-map');

const processedGiantBombData = rawGiantBombData.map(game => {
	const propertiesToRetain = [
		'status',
		'name',
		'image',
		'ratings',
		'releaseDate',
		'giantBombSite',
		'concepts',
		'developers',
		'franchises',
		'genres',
		'publishers',
		'themes',
	];

	const copiedFields = propertiesToRetain.reduce((sum, property) => ({...sum, [property]: game[property]}), {});
	const {platforms, backloggerySystems}  = game;
	const gamePlatforms = [...new Set(platforms.map(platform => giantBombPlatformToSystemIdMap[platform]))];
	const ownedVersions = [...new Set(backloggerySystems.map(system => backloggerySystemToSystemIdMap[system]))];


	return {
		...copiedFields,
		platformIds: gamePlatforms,
		ownedPlatformIds: ownedVersions,
	}
});

fs.writeFileSync('./mapped-data.json', JSON.stringify(processedGiantBombData));