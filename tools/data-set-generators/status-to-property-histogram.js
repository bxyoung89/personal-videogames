const fs = require('fs');
const backloggeryStatuses = require('../../data/constants/backloggery-statuses');

module.exports = (propertyName, collectionFilterFunction = () => true, collectionMapFunction = x => x) => {
	return (mappedGiantBombData) => {

		const statusToPropertyMap = {};
		backloggeryStatuses.forEach(status => statusToPropertyMap[status.name] = {});
		mappedGiantBombData.forEach(game => {
			backloggeryStatuses.forEach(status => {
				if (!status.matcher(game)) {
					return;
				}
				game[propertyName].filter(collectionFilterFunction).forEach(item => {
					const mappedItem = collectionMapFunction(item);
					if (!statusToPropertyMap[status.name][mappedItem]) {
						statusToPropertyMap[status.name][mappedItem] = 0;
					}
					statusToPropertyMap[status.name][mappedItem] += 1;
				})
			});
		});

		fs.writeFileSync(`./data/data-sets/status-to-${propertyName}-histogram.json`, JSON.stringify(statusToPropertyMap));
	}
};