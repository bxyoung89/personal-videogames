(() => {
	let outputCounter = 2;
	const imageToStatusMap = {
		'images/unplayed.gif': 'unplayed',
		'images/unfinished.gif': 'unfinished',
		'images/beaten.gif': 'beaten',
		'images/completed.gif': 'completed',
		'images/null.gif': 'null',
		'images/mastered.gif': 'mastered',
	};

	const getHtmlFromB = (b) => {
		const html = $(b[0]).html() || '';
		return html.trim();
	};

	const scrapeGames = () => {
		const gameboxes = $('.gamebox:not(.systemend)');
		const games = [];
		for(let x = 0; x < gameboxes.length; x++){
			const gamebox = $(gameboxes[x]);
			const images = gamebox.find('img');
			const statusImage = images[1];
			const statusImageSrc = $(statusImage).attr('src');
			const name = getHtmlFromB(gamebox.find('h2 > b'));
			const systemName = getHtmlFromB(gamebox.find('.gamerow > b'));
			const status = imageToStatusMap[statusImageSrc];
			games.push({
				name,
				systemName,
				status,
			});
		}
		console.log(games);
		window.scrapedGames = games;
		return games;
	};

	const loadAllInterval = setInterval(() => {
		if ($('img[src$="images/AJAX_loading.gif"]]').length > 0) {
			return;
		}
		const loadMoreButton = $(`#output${outputCounter}>input`);
		if (loadMoreButton.length === 0) {
			clearInterval(loadAllInterval);
			scrapeGames();
			return;
		}

		loadMoreButton.click();
		outputCounter++;
	}, 1000);
})();