(function () {
	const event_list_bees = [
		{
			type: "text",
			text: "According to all known laws"
		},
		{
      type: 'anim',
      anim: 'praise_fwd',
      ticks: 15
    },
		{
			type: "text",
			text: "I'm a flaming homosexual."
		},
		{
      type: 'anim',
      anim: 'praise_back',
      ticks: 15
    }
	];
	try {
		if (BonziData) {
			BonziData.event_list_bees = event_list_bees;
		}
	} catch (err) {
		console.error(err);
	}
})();
