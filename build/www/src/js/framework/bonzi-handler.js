window.BonziHandler = new (function () {
    var self = this;
    (this.framerate = 1 / 15),
        (this.spriteSheets = {}),
        (this.clearBonzi = function (id) {
            if (id)
                try {
                    var bz = window.bonzis[id],
                        spr = _.find(window.BonziHandler.stage.children, { id: id }) || (bz && bz.sprite);
                    spr && window.BonziHandler.stage.removeChild(spr.sprite), $(`#app_wrapper > #bonzi_${id}`).remove();
                } catch (err) {
                    console.log("Error clearing bonzi."), console.error(err);
                }
        }),
        (this.prepSprites = function () {
            for (const color of [
                "black",
                "blue",
                "brown",
                "green",
                "purple",
                "bonzi",
                "magenta",
                "red",
                "pink",
                "yellow",
                "orange",
                "white",
                "dark_purple",
                "cyan",
                "glitch",
                "glitchy",
                "rainbow",
                "buggiest",
                "grey",
                "soldier",
                "diogo2",
                "losky",
                "unbojih",
                "unbojihpope",
                "owner",
                "guestgal",
                "clippy",
                "genie",
                "merlin",
                "program",
                "robot",
                "kiddie",
                "invisible",
                "bruh",
                "clippypope",
                "pmpope",
                "qmark",
                "maxpope",
                "shitsky",
                "dunce",
                "red_clippy",
                "rover",
                "pm",
                "james",
                "max",
                "peedy",
                "pope",
                "dogpope",
                "god",
                "genius",
                "peedy_pope",
                "ban",
                "robby",
                "diogo",
                "links",
                "rocky",
                "f1",
            ]) {
                var info = BonziData.sprite,
                    imgSrc = "/img/bonzi/" + color + ".png";
                try {
                    var agentInfo = window.bzwAgents.getAgent(color);
                    agentInfo && ((info = agentInfo), (imgSrc = agentInfo.src));
                } catch (err) {
                    console.error(err);
                }
                var spriteData = { images: [imgSrc], frames: info.frames, animations: info.animations };
                this.spriteSheets[color] = new createjs.SpriteSheet(spriteData);
            }
        }),
        this.prepSprites(),
        (this.$canvas = $("#bonzi_canvas")),
        (this.stage = new createjs.StageGL(this.$canvas[0], { transparent: !0 })),
        (this.stage.tickOnUpdate = !1),
        (this.resizeCanvas = function () {
            var width = this.$canvas.width(),
                height = this.$canvas.height();
            this.$canvas.attr({ width: this.$canvas.width(), height: this.$canvas.height() }), this.stage.updateViewport(width, height), (this.needsUpdate = !0);
            for (var i = 0; i < usersAmt; i++) {
                var key = usersKeys[i];
                bonzis[key].move();
            }
        }),
        this.resizeCanvas(),
        (this.resize = function () {
            setTimeout(this.resizeCanvas.bind(this), 1);
        }),
        (this.needsUpdate = !0),
        (this.intervalHelper = setInterval(
            function () {
                this.needsUpdate = !0;
            }.bind(this),
            1e3
        ));
    var confettiColors = ["#00AEF3", "#34AAE0", "#FFFFFF", "#FF0000"];
    return (
        (this.fpsHandler = new FPSCtrl(
            15,
            function (e) {
                for (var i = 0; i < usersAmt; i++) {
                    var key = usersKeys[i];
                    bonzis[key] && bonzis[key].update();
                }
                if ((self.stage.tick(), window.roomCode && "why" === window.roomCode))
                    try {
                        if (confetti) {
                            var colors = [confettiColors[Math.floor(Math.random() * confettiColors.length)], confettiColors[Math.floor(Math.random() * confettiColors.length)]];
                            confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: colors }), confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                        }
                    } catch (err) {
                        console.dir(err);
                    }
            },
            function (e) {
                self.needsUpdate && (self.stage.update(), (self.needsUpdate = !1));
            }
        )),
        this.fpsHandler.start(),
        $(window).resize(this.resize.bind(this)),
        (this.bonzisCheck = function () {
            for (var i = 0; i < usersAmt; i++) {
                var key = usersKeys[i];
                if (key in bonzis) {
                    var b = bonzis[key];
                    (b.userPublic = usersPublic[key]), b.updateName();
                    var newColor = usersPublic[key].color;
                    b.color != newColor && ((b.color = newColor), b.updateSprite());
                } else bonzis[key] = new Bonzi(key, usersPublic[key]);
            }
        }),
        $("#btn_tile").click(function () {
            for (var winWidth = $(window).width(), winHeight = $(window).height(), minY = 0, addY = 80, x = 0, y = 0, i = 0; i < usersAmt; i++) {
                var key = usersKeys[i];
                bonzis[key].move(x, y), (x += 200) + 100 > winWidth && ((x = 0), (y += 160) + 160 > winHeight && ((minY += addY), (addY /= 2), (y = minY)));
            }
        }),
        this
    );
})();
