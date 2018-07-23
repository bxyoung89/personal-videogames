module.exports = [
	{
		name: 'All',
		matcher: () => {
			return true;
		}
	},
	{
		name: 'Beaten or Completed',
		matcher: (game) => {
			return game.status === 'beaten' || game.status === 'completed';
		}
	},
	{
		name: 'Completed',
		matcher: (game) => {
			return game.status === 'completed';
		}
	},
	{
		name: 'Beaten',
		matcher: (game) => {
			return game.status === 'beaten';
		}
	},
	{
		name: 'Unbeaten',
		matcher: (game) => {
			return game.status === 'unplayed' || game.status === 'unfinished';
		}
	},
	{
		name: 'N/A',
		matcher: (game) => {
			return game.status === 'null';
		}
	},
];