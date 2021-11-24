(function () {
	var loadQueue = new createjs.LoadQueue();
	var loadDone = [];
	var loadNeeded = [
		"bonziBlack",
		"bonziBlue",
		"bonziBrown",
		"bonziGreen",
		"bonziPurple",
		"bonziRed",
		"bonziPink"
	];

	window.lini = window.lini || false;

	function showLogin(force) {
		if (window.lini && !force) {
			return;
		}

		window.lini = true;
		$('#login_card').show();
		$('#login_load').hide();

		loadBonzis();
	}

	$( window ).on('load', function() {
		try {
		  showLogin();
		} catch (err) {
			console.error(err);
			showLogin();
		}
	});

	function loadBonzis(callback) {
		var manifest = [
			{
				id: 'bonziBlack',
				src: '/img/bonzi/black.png'
			},
			{
				id: 'bonziBlue',
				src:'/img/bonzi/blue.png'
			},
			{
				id: 'bonziBrown',
				src:'/img/bonzi/brown.png'
			},
			{
				id: 'bonziGreen',
				src:'/img/bonzi/green.png'
			},
			{
				id: 'bonziPurple',
				src:'/img/bonzi/purple.png'
			},
			{
				id: 'bonziRed',
				src:'/img/bonzi/red.png'
			},
			{
				id: 'bonziPink',
				src:'/img/bonzi/pink.png'
			}
		];
		if (window.bzwAgents) {
			var agents = window.bzwAgents.getAgents();
  		var bonzi = new Agent('Bonzi', BonziData);
  		window.bzwAgents.addAgent(bonzi);
			agents.forEach(agent => {
				manifest.push({
					id: agent.slug,
					src: agent.src
				});
			});
		}

		loadQueue.loadManifest(manifest);
		loadQueue.on('fileload', function(e) {
			loadDone.push(e.item.id);
		}, this);
		if (callback) {
			loadQueue.on('complete', callback, this);
		}
	}
})();
