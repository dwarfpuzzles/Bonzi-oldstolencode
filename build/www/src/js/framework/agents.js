console.log("Loading All Agents");
function getRange(begin, end) {
    var array = [];
    for (var i = begin; i <= end; i++) {
        array.push(i);
    }

    for (var i = begin; i >= end; i--) {
        array.push(i);
    }

    return array;
}
function Agent(name, args) {
    var self = this;
    if (!name || !args) {
        return;
    }
    var defaultSize = {
        x: 200,
        y: 160,
    };

    self.size = args.size || defaultSize || { x: 200, y: 160 };
    self.overlayOffset = {
        left: 0,
        top: 0,
    };
    if (args.size.x !== defaultSize.x) {
        self.overlayOffset.left = parseInt(((defaultSize.x - self.size.x) / 2).toFixed(2), 10);
    }
    if (args.size.y !== defaultSize.y) {
        self.overlayOffset.top = parseInt(((defaultSize.y - self.size.y) / 2).toFixed(2), 10);
    }

    self.name = name.trim();
    self.slug = self.name.toLowerCase();
    self.src = `/img/bonzi/${self.slug}${window.environment === "development" ? "" : ""}.png`;
    if (self.slug !== "clippy") {
        self.src = `/img/bonzi/${self.slug}.png`;
    }

    if (self.slug === "bonzi") {
        self.src = "/img/bonzi/purple.png";
    }

    args.frameSize = args.frameSize || (args.sprite && args.sprite.frames) || { width: 200, height: 160 };
    self.size = self.size || args.frameSize;

    self.extras = self.extras || {};
    self.frames = args.frameSize || self.size;
    self.ticks = args.ticks || (args.sprite && args.sprite.ticks) || {};
    self.animations = args.animations || (args.sprite && args.sprite.animations) || {};
}

Agent.prototype.getTicks = function (animation, def) {
    var self = this;
    if (isNaN(def) && !def) {
        def = 15;
    }

    if (!animation || !self.ticks) {
        return def;
    }

    if (self.animations[animation]) {
        if (self.animations[animation].ticks) {
            return self.animations[animation].ticks;
        }
    }

    return _.get(self, `ticks.${animation}`, 15);
};

function BZWAgents() {
    this._agents = [];
}

BZWAgents.prototype.addAgent = function (agent) {
    var self = this;
    if (!agent) {
        return;
    }

    self._agents.push(agent);
    self[agent.name] = agent;
};
BZWAgents.prototype.getAgent = function (name) {
    var self = this;
    if (!name) {
        return;
    }

    var bonziColors = ["black", "blue", "brown", "green", "purple", "red", "pink", "pope"];
    if (bonziColors.includes(name.toLowerCase())) {
        name = "Bonzi";
    }

    return (
        _.find(self._agents, function (agent) {
            return name.toLowerCase() === agent.slug;
        }) || self.Bonzi
    );
};

BZWAgents.prototype.getAgents = function () {
    return this._agents || [];
};

window.bzwAgents = window.bzwAgents || new BZWAgents();

var clippy = new Agent("Clippy", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    clippy2 = new Agent("Red_Clippy", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    pm = new Agent("Pm", {
        size: { x: 130, y: 160 },
        frameSize: { width: 130, height: 160 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(28, 1), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(1, 28), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 9999,
        },
    }),
    james = new Agent("James", {
        size: { x: 150, y: 187 },
        frameSize: { width: 150, height: 187 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(210, 235), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(120, 137), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            shrug_fwd: [1, 9, "shrug_still", 1],
            shrug_still: 9,
            shrug_back: { frames: range(9, 1), next: "idle", speed: 1 },
            gone: 9999,
        },
    }),
    unbojih = new Agent("Unbojih", {
        size: { x: 414, y: 346 },
        frameSize: { width: 414, height: 346 },
        extras: { nameplateOffset: 20 },
        animations: {
            idle: 0,
            surf_away: { frames: [0, 40, 41, 38, 37, 25], next: "gone", ticks: 52, speed: 0.3 },
            surf_intro: { frames: [25, 37, 38, 0, 30, 40, 41], next: "idle", ticks: 25, speed: 0.3 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            greet_fwd: { frames: [0, 30], next: "greet_still", speed: 0.2 },
            greet_still: 30,
            greet_back: { frames: [30, 0], next: "idle", speed: 1 },
            grin_fwd: { frames: [0, 70], next: "grin_still", speed: 0.2 },
            grin_still: 70,
            grin_back: { frames: [70, 0], next: "idle", speed: 0.2 },
            banana_fwd: { frames: [0, 0, 0, 0, 59, 59, 59, 59, 60, 60, 60, 61, 61, 61, 62, 62, 63, 63, 63], next: "idle", speed: 0.5 },
            banana_back: { frames: [58, 0], next: "idle", speed: 0.5 },
            laugh_fwd: { frames: [0, 68], next: "laugh_still", speed: 0.5 },
            laugh_still: { frames: [68], next: "laugh_still", speed: 0.5 },
            laugh_back: { frames: [68, 0], next: "idle", speed: 0.5 },
            surprised_fwd: { frames: range(12, 12), next: "surprised_still", speed: 1 },
            surprised_still: 12,
            surprised_back: { frames: range(12, 12), next: "idle", speed: 1 },
            sad_fwd: { frames: [0, 69], next: "sad_still", speed: 1 },
            sad_still: 69,
            sad_back: { frames: [69, 0], next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 25,
        },
    }),
    unbojih2 = new Agent("UnbojihPope", {
        size: { x: 414, y: 346 },
        frameSize: { width: 414, height: 346 },
        extras: { nameplateOffset: 20 },
        animations: {
            idle: 0,
            surf_away: { frames: [0, 40, 41, 38, 37, 25], next: "gone", ticks: 52, speed: 0.3 },
            surf_intro: { frames: [25, 37, 38, 0, 30, 40, 41], next: "idle", ticks: 25, speed: 0.3 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            greet_fwd: { frames: [0, 30], next: "greet_still", speed: 0.2 },
            greet_still: 30,
            greet_back: { frames: [30, 0], next: "idle", speed: 1 },
            grin_fwd: { frames: [0, 70], next: "grin_still", speed: 0.2 },
            grin_still: 70,
            grin_back: { frames: [70, 0], next: "idle", speed: 0.2 },
            banana_fwd: { frames: [0, 0, 0, 0, 59, 59, 59, 59, 60, 60, 60, 61, 61, 61, 62, 62, 63, 63, 63], next: "idle", speed: 0.5 },
            banana_back: { frames: [58, 0], next: "idle", speed: 0.5 },
            laugh_fwd: { frames: [0, 68], next: "laugh_still", speed: 0.5 },
            laugh_still: { frames: [68], next: "laugh_still", speed: 0.5 },
            laugh_back: { frames: [68, 0], next: "idle", speed: 0.5 },
            surprised_fwd: { frames: range(12, 12), next: "surprised_still", speed: 1 },
            surprised_still: 12,
            surprised_back: { frames: range(12, 12), next: "idle", speed: 1 },
            sad_fwd: { frames: [0, 69], next: "sad_still", speed: 1 },
            sad_still: 69,
            sad_back: { frames: [69, 0], next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 25,
        },
    }),
    pm2 = new Agent("PmPope", {
        size: { x: 130, y: 160 },
        frameSize: { width: 130, height: 160 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(28, 1), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(1, 28), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 9999,
        },
    }),
    links = new Agent("Links", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    robby = new Agent("Robby", {
        size: { x: 128, y: 128 },
        frameSize: { width: 128, height: 128 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(69, 53), next: "gone", ticks: 52, speed: 0.8 },
            surf_intro: { frames: range(53, 69), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            shrug_fwd: [23, 37, "shrug_still", 1],
            shrug_still: 37,
            shrug_back: { frames: range(46, 52), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    genius = new Agent("Genius", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    rocky = new Agent("Rocky", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    f1 = new Agent("F1", {
        size: { x: 124, y: 93 },
        frameSize: { width: 124, height: 93 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    max = new Agent("Max", {
        size: { x: 168, y: 142 },
        frameSize: { width: 168, height: 142 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(96, 115), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(196, 218), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            shrug_fwd: [10, 17, "shrug_still", 1],
            shrug_still: 17,
            shrug_back: { frames: range(17, 10), next: "idle", speed: 1 },
            surf_across_fwd: [156, 163, "surf_across_still", 1],
            surf_across_still: 163,
            surf_across_back: { frames: range(164, 166), next: "idle", speed: 1 },
            surf_across_swap_fwd: [168, 175, "surf_across_still", 1],
            surf_across_swap_still: 175,
            surf_across_swap_back: { frames: range(180, 183), next: "idle", speed: 1 },
            greet_fwd: [25, 29, "greet_still", 1],
            greet_still: 29,
            greet_back: { frames: range(29, 25), next: "idle", speed: 1 },
            grin_fwd: [275, 288, "grin_still", 1],
            grin_still: 282,
            grin_back: { frames: range(282, 275), next: "idle", speed: 1 },
            surprised_fwd: [234, 240, "surprised_still", 1],
            surprised_still: 240,
            surprised_back: { frames: range(249, 251), next: "idle", speed: 1 },
            praise_fwd: [88, 91, "praise_still", 1],
            praise_still: 91,
            praise_back: { frames: range(91, 88), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    max2 = new Agent("MaxPope", {
        size: { x: 168, y: 140 },
        frameSize: { width: 168, height: 140 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            shrug_fwd: [10, 17, "shrug_still", 1],
            shrug_still: 17,
            shrug_back: { frames: range(17, 10), next: "idle", speed: 1 },
            greet_fwd: [25, 29, "greet_still", 1],
            greet_still: 29,
            greet_back: { frames: range(29, 25), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    peedy = new Agent("Peedy", {
        size: { x: 160, y: 128 },
        frameSize: { width: 160, height: 128 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    peedy_pope = new Agent("Peedy_Pope", {
        size: { x: 160, y: 128 },
        frameSize: { width: 160, height: 128 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_intro: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_intro_emote: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_away: [23, 45, "gone", 1],
            surf_away_emote: [23, 40, "gone_emote", 0.8],
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    rover = new Agent("Rover", {
        size: { x: 80, y: 80 },
        frameSize: { width: 80, height: 80 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_intro: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_intro_emote: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_away: [23, 45, "gone", 1],
            surf_away_emote: [23, 40, "gone_emote", 0.8],
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    rover2 = new Agent("Dogpope", {
        size: { x: 80, y: 80 },
        frameSize: { width: 80, height: 80 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_intro: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_intro_emote: { frames: range(45, 23), next: "idle", speed: 0.6 },
            surf_away: [23, 45, "gone", 1],
            surf_away_emote: [23, 40, "gone_emote", 0.8],
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    merlin = new Agent("Merlin", {
        size: { x: 128, y: 128 },
        frameSize: { width: 128, height: 128 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    }),
    genie = new Agent("Genie", {
        size: { x: 128, y: 128 },
        frameSize: { width: 128, height: 128 },
        extras: { nameplateOffset: 15 },
        animations: {
            idle: 0,
            surf_away: { frames: range(360, 412), next: "gone", ticks: 52, speed: 1 },
            surf_intro: { frames: range(823, 848), next: "idle", ticks: 25, speed: 1 },
            backflip: { frames: range(0, 901), next: "idle", ticks: 901, speed: 1 },
            look_left_fwd: [193, 196, "look_left_still", 1],
            look_left_still: 196,
            look_left_back: { frames: range(196, 193), next: "idle", speed: 1 },
            praise_fwd: [199, 214, "praise_still", 1],
            praise_still: 215,
            praise_back: { frames: range(205, 199), next: "idle", speed: 1 },
            gone: 902,
        },
    });
window.bzwAgents.addAgent(clippy),
    window.bzwAgents.addAgent(clippy2),
    window.bzwAgents.addAgent(rocky),
    window.bzwAgents.addAgent(links),
    window.bzwAgents.addAgent(genius),
    window.bzwAgents.addAgent(f1),
    window.bzwAgents.addAgent(pm),
    window.bzwAgents.addAgent(james),
    window.bzwAgents.addAgent(max),
    window.bzwAgents.addAgent(pm2),
    window.bzwAgents.addAgent(max2),
    window.bzwAgents.addAgent(peedy),
    window.bzwAgents.addAgent(peedy_pope),
    window.bzwAgents.addAgent(rover),
    window.bzwAgents.addAgent(unbojih),
    window.bzwAgents.addAgent(unbojih2),
    window.bzwAgents.addAgent(rover2),
    window.bzwAgents.addAgent(merlin),
    window.bzwAgents.addAgent(genie),
    window.bzwAgents.addAgent(robby);
