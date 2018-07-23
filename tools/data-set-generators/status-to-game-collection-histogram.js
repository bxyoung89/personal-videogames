const fs = require('fs');
const backloggeryStatuses = require('../../data/constants/backloggery-statuses');

module.exports = (name, mappingFunction) => {
	return (mappedGiantBombData) => {
		const statusToPropertyMap = {};
		backloggeryStatuses.forEach(status => statusToPropertyMap[status.name] = 0);
		mappedGiantBombData.filter(mappingFunction).forEach(game => {
			backloggeryStatuses.forEach(status => {
				if (!status.matcher(game)) {
					return;
				}
				statusToPropertyMap[status.name] += 1;
			});
		});

		fs.writeFileSync(`./data/data-sets/status-to-${name}-histogram.json`, JSON.stringify(statusToPropertyMap));
	};
};