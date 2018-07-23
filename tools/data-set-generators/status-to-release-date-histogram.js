const moment = require('moment');
const fs = require('fs');
const backloggeryStatuses = require('../../data/constants/backloggery-statuses');

module.exports = (dateFormat, name) => {
	return (mappedGiantBombData) => {

		const statusToPropertyMap = {};
		backloggeryStatuses.forEach(status => statusToPropertyMap[status.name] = {});
		mappedGiantBombData.forEach(game => {
			backloggeryStatuses.forEach(status => {
				if (!status.matcher(game)) {
					return;
				}
				const releaseDate = moment(game.releaseDate, 'YYYY-MM-DD HH:mm:ss').format(dateFormat);
				if(releaseDate === 'Invalid date'){
					return;
				}
				if (!statusToPropertyMap[status.name][releaseDate]) {
					statusToPropertyMap[status.name][releaseDate] = 0;
				}
				statusToPropertyMap[status.name][releaseDate] += 1;
			});
		});

		fs.writeFileSync(`./data/data-sets/status-to-releaseDate-${name}-histogram.json`, JSON.stringify(statusToPropertyMap));
	}
};