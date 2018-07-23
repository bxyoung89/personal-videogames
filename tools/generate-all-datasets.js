const mappedGiantBombData = require('../data/mapped-giant-bomb-data');
const statusToPropertyHistogram = require('./data-set-generators/status-to-property-histogram');
const statusToReleaseDateHistogram = require('./data-set-generators/status-to-release-date-histogram');
const statusToGameCollectionHistogram = require('./data-set-generators/status-to-game-collection-histogram');
//game => game.platformIds.length === 1


const dataSetGenerators = [
	statusToPropertyHistogram('ratings', (rating) => rating.indexOf('ESRB') !== -1, rating => rating.replace('ESRB: ', '')),
	statusToPropertyHistogram('concepts'),
	statusToPropertyHistogram('developers'),
	statusToPropertyHistogram('franchises'),
	statusToPropertyHistogram('genres'),
	statusToPropertyHistogram('publishers'),
	statusToPropertyHistogram('themes'),
	statusToReleaseDateHistogram('YYYY', 'year'),
	statusToReleaseDateHistogram('MMMM', 'month'),
	statusToReleaseDateHistogram('Do', 'day-of-month'),
	statusToReleaseDateHistogram('Q', 'quarter'),
	statusToGameCollectionHistogram('exclusives', game => game.platformIds.length === 1),
	statusToGameCollectionHistogram('multi-platforms', game => game.platformIds.length > 1),
	statusToGameCollectionHistogram('multiple-copies', game => game.ownedPlatformIds.length > 1),
];

dataSetGenerators.forEach(generator => generator(mappedGiantBombData));
