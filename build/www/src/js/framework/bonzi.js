("use strict");
var _createClass = (function () {
    function defineProperties(target, props) {
        for (const descriptor of props) (descriptor.enumerable = descriptor.enumerable || !1), (descriptor.configurable = !0), "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
    return function (Constructor, protoProps, staticProps) {
        return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
    };
})();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var Bonzi = (function () {
    function Bonzi(id, userPublic) {
        var d = this;
        var _this2 = this;
        _classCallCheck(this, Bonzi),
            (this.bounceColors = ["black", "blue", "brown", "green", "purple", "red", "pink", "bonzi", "orange", "yellow", "cyan", "max", "peedy"]),
            (this.availableColours = ["black", "blue", "brown", "green", "purple", "red", "pink", "clippy", "f1", "genie", "genius", "links", "merlin", "peedy", "pm", "max", "rocky", "rover"]),
            (this.overlayOffset = { left: 0, top: 0 }),
            (this.userPublic = userPublic || { name: "BonziBUDDY", color: "purple", speed: 175, pitch: 50, amplitude: 100, voice: "en-us" }),
            (this.moving = { speed: 4 * (window.devicePixelRatio || 1), direction: "ne" }),
            (this._extras = { dvd: !1 }),
            userPublic && userPublic.extras && "on" === userPublic.extras.dvdbounce && (this._extras.dvd = !0),
            (this._sanity = 0),
            (this.color = this.userPublic.color),
            (this._agent = null);
        try {
            window.bzwAgents.getAgent(this.color) && (this._agent = BonziData);
        } catch (err) {
            console.error(err);
        }
        (this.colorPrev = null),
            (this.data = window.BonziData),
            (this.drag = !1),
            (this.dragged = !1),
            (this.eventQueue = []),
            (this.eventRun = !0),
            (this.event = null),
            (this.willCancel = !1),
            (this.run = !0),
            (this.mute = !1),
            (this.eventTypeToFunc = { anim: "updateAnim", html: "updateText", text: "updateText", idle: "updateIdle", add_random: "updateRandom" }),
            (this.id = void 0 === id ? s4() + s4() : id),
            (this.guid = this.id),
            (this.rng = new Math.seedrandom(this.seed || this.id || Math.random())),
            (this.selContainer = "#app_wrapper"),
            (this.$container = $(this.selContainer)),
            this.$container.append(
                "\n\t\t\t<div id='bonzi_" +
                    this.id +
                    "' class='bonzi'>\n\t\t\t\t<div class='bonzi_name'><div class=\"name-inner\"><div class=\"icon\"></div><div class=\"name\"></div></div></div>\n\t\t\t\t\t<div class='bonzi_placeholder'></div>\n\t\t\t\t<div style='display:none' class='bubble'>\n\t\t\t\t\t<p class='bubble-content'></p>\n\t\t\t\t<div class='close-bubble'><i class='fas fa-times' /></div></div>\n\t\t\t</div>\n\t\t"
            ),
            (this.selElement = "#bonzi_" + this.id),
            (this.selDialog = this.selElement + " > .bubble"),
            (this.closeDialog = this.selElement + " > .bubble > .close-bubble"),
            (this.selDialogCont = this.selElement + " > .bubble > p"),
            (this.selNameWrap = this.selElement + " > .bonzi_name"),
            (this.selNameIcon = this.selElement + " > .bonzi_name > .name-inner > .icon"),
            (this.selNametag = this.selElement + " > .bonzi_name > .name-inner > .name"),
            (this.selCanvas = this.selElement + " > .bonzi_placeholder"),
            $(this.selCanvas).width(this.data.size.x).height(this.data.size.y),
            (this.$nameIcon = $(this.selNameIcon)),
            (this.$closeBtn = $(this.closeDialog)),
            (this.$element = $(this.selElement)),
            (this.$canvas = $(this.selCanvas)),
            (this.$dialog = $(this.selDialog)),
            (this.$dialogCont = $(this.selDialogCont)),
            (this.$nametag = $(this.selNametag)),
            this.updateName(),
            $.data(this.$element[0], "parent", this),
            this.updateSprite(!0),
            (this.generate_event = function (a, b, c) {
                var _this = this;
                a[b](function (e) {
                    _this[c](e);
                });
            }),
            this.$closeBtn.on("click", function () {
                _this2.cancel();
            }),
            this.generate_event(this.$canvas, "mousedown", "mousedown"),
            this.generate_event($(window), "mousemove", "mousemove"),
            this.generate_event($(window), "mouseup", "mouseup");
        var coords = this.maxCoords();
        (this.x = coords.x * this.rng()),
            (this.y = coords.y * this.rng()),
            this.move(),
            $.contextMenu({
                selector: this.selCanvas,
                build: function (ignoredTrigger, ignoredEvent) {
                    return {
                        items: {
                            cancel: {
                                name: "Cancel",
                                callback: function () {
                                    _this2.cancel();
                                },
                            },
                            mute: {
                                name: function () {
                                    return _this2.mute ? "Unmute" : "Mute";
                                },
                                callback: function () {
                                    _this2.cancel(), (_this2.mute = !_this2.mute);
                                },
                            },
                            asshole: {
                                name: "Call an Asshole",
                                callback: function () {
                                    socket.emit("command", { z: window.generateTSString(), list: ["asshole", _this2.userPublic.name] });
                                },
                            },
                            owo: {
                                name: "Notice Bulge",
                                callback: function () {
                                    socket.emit("command", { z: window.generateTSString(), list: ["owo", _this2.userPublic.name] });
                                },
                            },
                            hi: {
                                name: "Say Hello",
                                callback: function () {
                                    socket.emit("command", { list: ["welcome", d.userPublic.name] });
                                },
                            },
                            kick: {
                                name: "Kick",
                                disabled: function () {
                                    return !admin;
                                },
                                callback: function () {
                                    socket.emit("command", { z: window.generateTSString(), list: ["kick", d.id] });
                                },
                            },
                            ban: {
                                name: "Ban",
                                disabled: function () {
                                    return !admin;
                                },
                                callback: function () {
                                    socket.emit("command", { z: window.generateTSString(), list: ["ban", d.id] });
                                },
                            },
                        },
                    };
                },
                animation: { duration: 175, show: "fadeIn", hide: "fadeOut" },
            }),
            (this.needsUpdate = !1),
            this.runSingleEvent([{ type: "anim", anim: "surf_intro", ticks: 30 }]),
            setTimeout(function () {
                if (d.color == "diogo") {
                    var a = new Audio("diogo_surfintro.wav");
                    a.play();
                }
            }, 100),
            setTimeout(function () {
                if (d.color == "god") {
                    var a = new Audio("god_surfintro.wav");
                    a.play();
                }
                if (d.color == "f1") {
                    var a = new Audio("f1_surfintro.wav");
                    a.play();
                }
                if (d.color == "genius") {
                    var aud = new Audio("genius_surf.wav");
                    aud.play();
                }
                if (d.color == "program") {
                    var aud = new Audio("program_surfintro.wav");
                    aud.play();
                }
            }, 1),
            setTimeout(function () {
                if (d.color === "clippy") {
                    var a = new Audio("clippy_surfintro.wav");
                    a.play();
                } else if (d.color === "red_clippy") {
                    var a = new Audio("clippy_surfintro.wav");
                    a.play();
                } else if (d.color === "clippypope") {
                    var a = new Audio("clippy_surfintro.wav");
                    a.play();
                } else if (d.color === "peedy") {
                    var a = new Audio("peedy_surfintro.mp3");
                    a.play();
                } else if (d.color === "merlin") {
                    var a = new Audio("merlin_surfintro.mp3");
                    a.play();
                } else if (d.color == "pm") {
                    setTimeout(function () {
                        var a = new Audio("pmgreen_surf.wav");
                        a.play();
                    }, 500);
                } else if (d.color === "genie") {
                    var a = new Audio("genie_surfintro.ogg");
                    a.play();
                } else if (d.color === "robby") {
                    var a = new Audio("robby_surfintro.ogg");
                    a.play();
                } else if (d.color === "unbojih") {
                    var a = new Audio("unbojih_enter.wav");
                    a.play();
                    var aud = new Audio("port_suckin1.wav");
                    aud.play();
                } else if (d.color === "unbojihpope") {
                    var a = new Audio("unbojih_enter.wav");
                    a.play();
                    var aud = new Audio("port_suckin1.wav");
                    aud.play();
                } else if (d.color == "qmark") {
                    var a = new Audio("qmark_surfintro.wav");
                    a.play();
                }
            }, 100),
            setTimeout(function () {
                if (d.color == "max") {
                    var a = new Audio("max_surfintro.wav");
                    a.play();
                }
            }, 800),
            setTimeout(function () {
                if (
                    d.color != "clippy" &&
                    d.color != "rover" &&
                    d.color != "dogpope" &&
                    d.color != "clippypope" &&
                    d.color != "red_clippy" &&
                    d.color != "genius" &&
                    d.color != "peedy" &&
                    d.color != "robby" &&
                    d.color != "merlin" &&
                    d.color != "genie" &&
                    d.color != "f1" &&
                    d.color != "qmark" &&
                    d.color != "pm" &&
                    d.color != "rover" &&
                    d.color != "losky" &&
                    d.color != "unbojih" &&
                    d.color != "unbojihpope" &&
                    d.color != "max"
                ) {
                    if (d.color == "program") {
                        var a = new Audio("diogo_jumpoff.mp3");
                        a.play();
                    } else {
                        var a = new Audio("jump_off.mp3");
                        a.play();
                    }
                }
            }, 1500);
    }
    return (
        (Bonzi.prototype.getContextMenu = function () {
            var self = this;
            return function (ignoredTrigger, ignoredEvent) {
                return {
                    items: {
                        cancel: {
                            name: "Cancel",
                            callback: function () {
                                self.cancel();
                            },
                        },
                        mute: {
                            name: function () {
                                return self.mute ? "Unmute" : "Mute";
                            },
                            callback: function () {
                                self.cancel(), (self.mute = !self.mute);
                            },
                        },
                        asshole: {
                            name: "Call an Asshole",
                            callback: function () {
                                socket.emit("command", { z: window.generateTSString(), list: ["asshole", self.userPublic.name] });
                            },
                        },
                        owo: {
                            name: "Notice Bulge",
                            callback: function () {
                                socket.emit("command", { z: window.generateTSString(), list: ["owo", self.userPublic.name] });
                            },
                        },
                        hi: {
                            name: "Say Hello",
                            callback: function () {
                                socket.emit("command", { list: ["welcome", d.userPublic.name] });
                            },
                        },
                        kick: {
                            name: "Kick",
                            disabled: function () {
                                return !admin;
                            },
                            callback: function () {
                                socket.emit("command", { z: window.generateTSString(), list: ["kick", self.id] });
                            },
                        },
                        ban: {
                            name: "Ban",
                            disabled: function () {
                                return !admin;
                            },
                            callback: function () {
                                socket.emit("command", { z: window.generateTSString(), list: ["ban", self.id] });
                            },
                        },
                    },
                };
            };
        }),
        _createClass(Bonzi, [
            {
                key: "eventMake",
                value: function (list) {
                    return {
                        list: list,
                        index: 0,
                        timer: 0,
                        cur: function () {
                            return this.list[this.index];
                        },
                    };
                },
            },
            {
                key: "mousedown",
                value: function (e) {
                    if (1 === e.which) {
                        if (this._extras.dvd) return;
                        (this.drag = !0), (this.dragged = !1), (this.drag_start = { x: e.pageX - this.x - this.overlayOffset.left, y: e.pageY - this.y - this.overlayOffset.top });
                    }
                },
            },
            {
                key: "mousemove",
                value: function (e) {
                    this.drag && (this.move(e.pageX - this.drag_start.x, e.pageY - this.drag_start.y), (this.dragged = !0));
                },
            },
            {
                key: "move",
                value: function (x, y, force) {
                    if (!(this && this._extras && this._extras.dvd) || force) {
                        0 !== arguments.length && ((this.x = x - this.overlayOffset.left), (this.y = y - this.overlayOffset.top));
                        var min_y = 100,
                            min_x = 0,
                            max = this.maxCoords();
                        (this.x = Math.min(Math.max(min_x, this.x), max.x)),
                            (this.y = Math.min(Math.max(min_y, this.y), max.y)),
                            this.$element.css({ marginLeft: this.x, marginTop: this.y }),
                            (this.sprite.x = this.x + this.overlayOffset.left),
                            (this.sprite.y = this.y + this.overlayOffset.top),
                            (BonziHandler.needsUpdate = !0),
                            this.updateDialog();
                    }
                },
            },
            {
                key: "getMovement",
                value: function () {
                    var newCoords = { x: this.x, y: this.y };
                    switch (this.moving.direction) {
                        case "ne":
                            (newCoords.x += this.moving.speed), (newCoords.y -= this.moving.speed);
                            break;
                        case "nw":
                            (newCoords.x -= this.moving.speed), (newCoords.y -= this.moving.speed);
                            break;
                        case "se":
                            (newCoords.x += this.moving.speed), (newCoords.y += this.moving.speed);
                            break;
                        case "sw":
                            (newCoords.x -= this.moving.speed), (newCoords.y += this.moving.speed);
                    }
                    return newCoords;
                },
            },
            {
                key: "dvdTick",
                value: function () {
                    if (this && this._extras && this._extras.dvd) {
                        this._extras.dvdTick = this._extras.dvdTick || 0;
                        var max = this.maxCoords(),
                            movement = this.getMovement(),
                            redo = !1,
                            redoX = !1;
                        movement.x <= 0
                            ? ((this.moving.direction = `${this.moving.direction.charAt(0)}e`), (redo = !0), (redoX = !0))
                            : movement.x >= max.x && ((this.moving.direction = `${this.moving.direction.charAt(0)}w`), (redo = !0), (redoX = !0)),
                            movement.y <= 101 ? ((this.moving.direction = `s${this.moving.direction.slice(1)}`), (redo = !0)) : movement.y >= max.y && ((this.moving.direction = `n${this.moving.direction.slice(1)}`), (redo = !0));
                        var currentAnim = this.sprite.currentAnimation;
                        redo &&
                            (this._extras.dvdTick++,
                            (movement = this.getMovement()),
                            this._extras.dvdTick > this.bounceColors.length - 1 && (this._extras.dvdTick = 0),
                            (this.color = this.bounceColors[this._extras.dvdTick]),
                            this.updateSpriteWithAnimation(currentAnim),
                            redoX && this.sprite.gotoAndPlay("w" === this.moving.direction.charAt(1) ? "surf_across_swap_back" : "surf_back_swap_back")),
                            (this.x = movement.x || this.x),
                            (this.y = movement.y || this.y),
                            (this.x = Math.min(Math.max(0, this.x), max.x)),
                            (this.y = Math.min(Math.max(0, this.y), max.y)),
                            this.$element.css({ marginLeft: this.x, marginTop: this.y }),
                            (this.sprite.x = this.x + this.overlayOffset.left),
                            (this.sprite.y = this.y + this.overlayOffset.top),
                            (BonziHandler.needsUpdate = !0),
                            this.updateDialog();
                    }
                },
            },
            {
                key: "mouseup",
                value: function (e) {
                    !this.dragged && this.drag && this.cancel(), (this.drag = !1), (this.dragged = !1);
                },
            },
            {
                key: "runSingleEvent",
                value: function (list) {
                    this.mute || this.eventQueue.push(this.eventMake(list));
                },
            },
            {
                key: "clearVideo",
                value: function () {
                    this.player && "function" == typeof this.player.destroy && (this.player.stopVideo(), this.player.destroy(), (this.player = null), delete this.player);
                },
            },
            {
                key: "clearDialog",
                value: function (tkm, skipVideo, keepOpen) {
                    var self = this;
                    function _clearDialog() {
                        keepOpen || (self.$dialogCont.html(""), self.$dialog.removeClass("video-yt"), self.$dialog.removeClass("image"), self.$dialog.removeClass("video"), self.$dialog.removeClass("autosize"), (self.openDialogId = null));
                    }
                    if (((keepOpen = keepOpen || !1), $(self.$dialog).is(":hidden"))) return _clearDialog();
                    var ckm = String(self.openDialogId);
                    "boolean" == typeof tkm ? ((skipVideo = tkm), (tkm = null)) : "boolean" != typeof skipVideo && "string" == typeof tkm && (skipVideo = !1), "boolean" != typeof skipVideo && (skipVideo = !1);
                    self = this;
                    if ("string" != typeof tkm || "string" != typeof self.openDialogId || self.openDialogId === tkm) {
                        if (self.player && "function" == typeof self.player.getPlayerState)
                            if (skipVideo) {
                                if (0 !== self.player.getPlayerState()) return;
                                self.clearVideo();
                            } else self.clearVideo();
                        ckm && self.openDialogId && ckm !== self.openDialogId
                            ? $(self.$dialog).is(":hidden") && _clearDialog()
                            : keepOpen ||
                              self.$dialog.fadeOut(400, function () {
                                  _clearDialog();
                              });
                    }
                },
            },
            {
                key: "cancel",
                value: function (skipClear) {
                    skipClear || this.clearDialog(), this.stopSpeaking(), (this.eventQueue = [this.eventMake([{ type: "idle" }])]);
                },
            },
            {
                key: "retry",
                value: function () {
                    this.clearDialog(), (this.event.timer = 0);
                },
            },
            {
                key: "stopSpeaking",
                value: function () {
                    this.goingToSpeak = !1;
                    try {
                        this.voiceSource.stop();
                    } catch (error) {}
                },
            },
            {
                key: "cancelQueue",
                value: function () {
                    this.willCancel = !0;
                },
            },
            {
                key: "updateAnim",
                value: function () {
                    0 === this.event.timer && this.sprite.gotoAndPlay(this.event.cur().anim), this.event.timer++, (BonziHandler.needsUpdate = !0), this.event.timer >= this.event.cur().ticks && this.eventNext();
                },
            },
            {
                key: "updateText",
                value: function () {
                    if (0 === this.event.timer) {
                        this.$dialog.css("display", "block"), (this.event.timer = 1);
                        var curEvent = this.event.cur();
                        this.talk(curEvent.text, curEvent.say, !0, curEvent);
                    }
                    "none" == this.$dialog.css("display") && this.eventNext();
                },
            },
            {
                key: "updateIdle",
                value: function () {
                    var goNext = "idle" == this.sprite.currentAnimation && 0 === this.event.timer;
                    (goNext = goNext || this.data.pass_idle.includes(this.sprite.currentAnimation))
                        ? this.eventNext()
                        : (0 === this.event.timer && ((this.tmp_idle_start = this.data.to_idle[this.sprite.currentAnimation]), this.sprite.gotoAndPlay(this.tmp_idle_start), (this.event.timer = 1)),
                          this.tmp_idle_start != this.sprite.currentAnimation && "idle" == this.sprite.currentAnimation && this.eventNext(),
                          (BonziHandler.needsUpdate = !0));
                },
            },
            {
                key: "updateRandom",
                value: function () {
                    var add = this.event.cur().add,
                        index = Math.floor(add.length * this.rng()),
                        e = this.eventMake(add[index]);
                    this.eventNext(), this.eventQueue.unshift(e);
                },
            },
            {
                key: "update",
                value: function () {
                    if ((this._sanity++, this._sanity > 85 && (this._sanity = 0), this.run)) {
                        if (
                            (this._extras && this._extras.dvd && this.dvdTick(),
                            0 !== this.eventQueue.length && this.eventQueue[0].index >= this.eventQueue[0].list.length && this.eventQueue.splice(0, 1),
                            (this.event = this.eventQueue[0]),
                            0 !== this.eventQueue.length && this.eventRun)
                        ) {
                            var eventType = this.event.cur().type;
                            try {
                                this[this.eventTypeToFunc[eventType]]();
                            } catch (error) {
                                this.event.index++;
                            }
                        }
                        if ((this.willCancel && (this.cancel(), (this.willCancel = !1)), this.needsUpdate))
                            try {
                                this.stage && "function" == typeof this.stage.update ? (this.stage.update(), (this.needsUpdate = !1)) : this.updateSpriteForced();
                            } catch (err) {}
                    }
                },
            },
            {
                key: "sanityCheck",
                value: function () {
                    if (((this._sanity = 0), this.run))
                        try {
                            (this.stage && "function" == typeof this.stage.update) || ((this.needsUpdate = !0), this.updateSpriteForced());
                        } catch (err) {
                            console.error(err), this.updateSpriteForced();
                        }
                },
            },
            {
                key: "eventNext",
                value: function () {
                    (this.event.timer = 0), (this.event.index += 1);
                },
            },
            {
                key: "talk",
                value: function (text, say, allowHtml, extra) {
                    var _this3 = this;
                    (allowHtml = allowHtml || !1),
                        (text = replaceAll((text = replaceAll(text, "{NAME}", this.userPublic.name)), "{COLOR}", this.color)),
                        (say = void 0 !== say ? replaceAll((say = replaceAll(say, "{NAME}", this.userPublic.name)), "{COLOR}", this.color) : text.replace("&gt;", ""));
                    var greentext = "&gt;" == (text = linkify(text)).substring(0, 4) || ">" == text[0];
                    this.$dialogCont[allowHtml ? "html" : "text"](text)[greentext ? "addClass" : "removeClass"]("bubble_greentext").css("display", "block"), this.stopSpeaking(), (_this3.openDialogId = String(s4()));
                    var tkrb = String(_this3.openDialogId);
                    if (window.muteAudio) {
                        var d = 80 * (text.length || 63);
                        return (
                            d ? (d > 15e3 ? (d = 15e3) : d < 4e3 && (d = 4e3)) : (d = 7e3),
                            void setTimeout(function () {
                                _this3.clearDialog(tkrb);
                            }, d)
                        );
                    }
                    _this3.goingToSpeak = true;
                    if (!window.muteAudio) {
                        if (window.sapi) {
                            if (this.userPublic.color == "diogo") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Damien&email=null");
                            } else if (this.userPublic.color == "rover") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Dog&email=null");
                            } else if (this.userPublic.color == "god") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Damien&email=null");
                            } else if (this.userPublic.color == "kiddie") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Shygirl&email=null");
                            } else if (this.userPublic.color == "clippy") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Conrad&email=null");
                            } else if (this.userPublic.color == "peedy") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=David&email=null");
                            } else if (this.userPublic.color == "max") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=David&email=null");
                            } else if (this.userPublic.color == "pm") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=David&email=null");
                            } else if (this.userPublic.color == "james") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Lawrence&email=null");
                            } else if (this.userPublic.color == "genie") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Charlie&email=null");
                            } else if (this.userPublic.color == "unbojih") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Charlie&email=null");
                            } else if (this.userPublic.color == "unbojihpope") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Charlie&email=null");
                            } else if (this.userPublic.color == "peedy_pope") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Conrad&email=null");
                            } else if (this.userPublic.color == "clippypope") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Conrad&email=null");
                            } else if (this.userPublic.color == "genius") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Lawrence&email=null");
                            } else if (this.userPublic.color == "merlin") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=French-fry&email=null");
                            } else if (this.userPublic.color == "glitch") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=RansomNote&email=null");
                            } else if (this.userPublic.color == "glitchy") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=RansomNote&email=null");
                            } else if (this.userPublic.color == "buggiest") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=RansomNote&email=null");
                            } else if (this.userPublic.color == "robby") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Robot&email=null");
                            } else if (this.userPublic.color == "program") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Robot&email=null");
                            } else if (this.userPublic.color == "pope") {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Conrad&email=null");
                            } else {
                                var audio = new Audio("https://api.voiceforge.com/swift_engine?HTTP-X-API-KEY=9a272b4&msg=" + encodeURIComponent(say) + "&voice=Kidaroo&email=null");
                            }

                            if (this.userPublic.color != "program") {
                                audio.play();
                                audio.onended = function () {
                                    _this3.goingToSpeak = false;
                                    _this3.clearDialog();
                                };
                            }
                        } else {
                            speak.play(
                                say,
                                {
                                    pitch: _this3.userPublic.pitch,
                                    speed: _this3.userPublic.speed,
                                },
                                function () {
                                    _this3.clearDialog();
                                },
                                function (source) {
                                    if (!_this3.goingToSpeak) source.stop();
                                    _this3.voiceSource = source;
                                }
                            );
                        }
                    }
                },
            },
            {
                key: "joke",
                value: function () {
                    this.runSingleEvent(this.data.event_list_joke);
                },
            },
            {
                key: "fact",
                value: function () {
                    this.runSingleEvent(this.data.event_list_fact);
                },
            },
            {
                key: "enter",
                value: function (callback) {
                    var self = this;
                    this.runSingleEvent([{ type: "anim", anim: "surf_intro", ticks: 30 }]),
                        setTimeout(function () {
                            (BonziHandler.needsUpdate = !0), self.$element.show(), self.updateDialog(), "function" == typeof callback && callback();
                        }, 2e3);
                },
            },
            {
                key: "exit",
                value: function (callback) {
                    var self = this;
                    this.runSingleEvent([{ type: "anim", anim: "surf_away", ticks: 30 }]),
                        setTimeout(function () {
                            self.$element.hide(), "function" == typeof callback && callback();
                        }, 2e3);
                },
            },
            {
                key: "deconstruct",
                value: function (callback) {
                    this.stopSpeaking(), BonziHandler.stage.removeChild(this.sprite), (this.run = !1), this.$element.remove(), "function" == typeof callback && callback();
                },
            },
            {
                key: "updateName",
                value: function () {
                    this.userPublic && this.userPublic.flags ? this.userPublic.flags && this.userPublic.flags.admin && this.$nameIcon.html("<i class='fas fa-gavel' title='Administrator' />") : this.$nameIcon.html(""),
                        this.$nametag.text(this.userPublic.name);
                },
            },
            {
                key: "youtube",
                value: function (vid) {
                    var self = this;
                    if (!this.mute) {
                        var ytSize = { w: 480, h: 270 },
                            thisDialogId = s4(),
                            vcid = `bz-${self.id}-yt-v`;
                        self.$dialog.addClass("video-yt"),
                            self.$dialogCont.html(`<div id="${vcid}"></div>`),
                            (self.player = new YT.Player(vcid, {
                                height: ytSize.h,
                                width: ytSize.w,
                                videoId: vid,
                                host: `${window.location.protocol}//www.youtube.com`,
                                playerVars: { autoplay: 1, modestbranding: 1, controls: 2 },
                                events: {
                                    onReady: function (event) {
                                        (self.openDialogId = String(thisDialogId)), self.$dialog.show(200);
                                    },
                                    onStateChange: function (event) {
                                        switch (event.data) {
                                            case 0:
                                                self.clearDialog(thisDialogId, !1);
                                        }
                                    },
                                },
                            }));
                    }
                },
            },
            {
                key: "video_legacy",
                value: function (a) {
                    if (!this.mute) {
                        var b = "embed";
                        this.$dialogCont.html(
                            "<object type='application/x-shockwave-flash' data='/legacy/video_player.swf' id='vv_player' width='170' height='170'><param name='movie' value='/legacy/video_player.swf'><param name='allowFullScreen' value='true'><param name='FlashVars' value='video_id=" +
                                a +
                                "'></object>"
                        ),
                            this.$dialog.show();
                    }
                },
            },
            {
                key: "video",
                value: function (a) {
                    if (!this.mute) {
                        var b = "embed";
                        this.$dialogCont.html(" <video width='170' loop autoplay controls id='bonziworld-video'><source src='" + a.vid + "' type='video/mp4' loop>Your browser does not support the video tag.</video> "), this.$dialog.show();
                    }
                },
            },
            {
                key: "bitview",
                value: function (a) {
                    if (!this.mute) {
                        var b = "embed";
                        this.$dialogCont.html("<iframe id='embedplayer' src='http://www.bitview.net/embed.php?v=" + a.vid + "'' width='448' height='382' allowfullscreen scrolling='off' frameborder='0'></iframe>"), this.$dialog.show();
                    }
                },
            },
            {
                key: "vlare",
                value: function (a) {
                    if (!this.mute) {
                        var b = "embed";
                        this.$dialogCont.html("<iframe width='170' height='170' src='https://vlare.tv/embed/" + a + "/false/true/0' frameborder='0' allowfullscreen></iframe>"), this.$dialog.show();
                    }
                },
            },
            {
                key: "img",
                value: function (a) {
                    if (!this.mute) {
                        var b = "embed";
                        this.$dialogCont.html("<img width='170' src='" + a.img + "'></img>"), this.$dialog.show();
                    }
                },
            },
            {
                key: "updateAgent",
                value: function () {
                    try {
                        var agentInfo = window.bzwAgents.getAgent(this.color);
                        agentInfo ? ((this._agent = agentInfo), (this.overlayOffset = agentInfo.overlayOffset || { left: 0, top: 0 })) : ((this._agent = null), (this.overlayOffset = { left: 0, top: 0 }));
                    } catch (err) {
                        console.error(err), (this._agent = null);
                    }
                },
            },
            {
                key: "getAnimationTicks",
                value: function (animation, def) {
                    if ((isNaN(def) && !def && (def = 15), !animation || !this._agent || (this._agent && "function" != typeof this._agent.getTicks))) return def || 15;
                    try {
                        return this._agent.getTicks(animation, def);
                    } catch (err) {
                        return console.error(err), def || 15;
                    }
                },
            },
            {
                key: "backflip",
                value: function (swag) {
                    var event = [{ type: "anim", anim: "backflip", ticks: this.getAnimationTicks("backflip", 15) }];
                    swag && (event.push({ type: "anim", anim: "cool_fwd", ticks: 30 }), event.push({ type: "idle" })), this.runSingleEvent(event);
                },
            },
            {
                key: "fly",
                value: function () {
                    var a = [{ type: "anim", anim: "fly_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "clap",
                value: function () {
                    var a = [{ type: "anim", anim: "clap_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "clap_clippy",
                value: function () {
                    var a = [{ type: "anim", anim: "clap_clippy_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "sad",
                value: function () {
                    var a = [{ type: "anim", anim: "sad_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "think",
                value: function () {
                    var a = [{ type: "anim", anim: "think_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "wave",
                value: function () {
                    var a = [{ type: "anim", anim: "wave" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "nod",
                value: function () {
                    var a = [{ type: "anim", anim: "nod" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "clap_clippy",
                value: function () {
                    var a = [{ type: "anim", anim: "clap_clippy_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "banana",
                value: function () {
                    var a = [{ type: "anim", anim: "banana_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "surprised",
                value: function () {
                    var a = [{ type: "anim", anim: "surprised_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "laugh",
                value: function () {
                    var a = [{ type: "anim", anim: "laugh_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "shrug",
                value: function () {
                    var a = [{ type: "anim", anim: "shrug_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "greet",
                value: function () {
                    var a = [{ type: "anim", anim: "greet_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "write",
                value: function () {
                    var a = [{ type: "anim", anim: "write_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "write2",
                value: function () {
                    var a = [{ type: "anim", anim: "write_once_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "write3",
                value: function () {
                    var a = [{ type: "anim", anim: "write_infinite_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "surf",
                value: function () {
                    var a = [{ type: "anim", anim: "surf_across_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "swag",
                value: function () {
                    var a = [{ type: "anim", anim: "cool_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "confused",
                value: function () {
                    var a = [{ type: "anim", anim: "confused_fwd" }];
                    this.runSingleEvent(a);
                    var a = new Audio("confused.ogg");
                    a.play();
                },
            },
            {
                key: "bang",
                value: function () {
                    var a = [{ type: "anim", anim: "beat_fwd" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "earth",
                value: function () {
                    var a = [{ type: "anim", anim: "earth_fwd", ticks: 30 }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "grin",
                value: function () {
                    var a = [{ type: "anim", anim: "grin_fwd", ticks: 30 }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "alert",
                value: function () {
                    var a = [{ type: "anim", anim: "alert_fwd", ticks: 30 }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "uncertain",
                value: function () {
                    var a = [{ type: "anim", anim: "uncertain_fwd", ticks: 30 }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "surfjoin",
                value: function () {
                    var a = [{ type: "anim", anim: "surf_intro_emote" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "surfleave",
                value: function () {
                    var a = [{ type: "anim", anim: "surf_away_emote" }];
                    this.runSingleEvent(a);
                },
            },
            {
                key: "updateDialog",
                value: function () {
                    var max = this.maxCoords();
                    this.data.size.x + this.$dialog.width() > max.x
                        ? this.y < this.$container.height() / 2 - this.data.size.x / 2
                            ? this.$dialog.removeClass("bubble-top").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-bottom")
                            : this.$dialog.removeClass("bubble-bottom").removeClass("bubble-left").removeClass("bubble-right").addClass("bubble-top")
                        : this.x < this.$container.width() / 2 - this.data.size.x / 2
                        ? this.$dialog.removeClass("bubble-left").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-right")
                        : this.$dialog.removeClass("bubble-right").removeClass("bubble-top").removeClass("bubble-bottom").addClass("bubble-left");
                },
            },
            {
                key: "maxCoords",
                value: function () {
                    return { x: this.$container.width() - this.data.size.x, y: this.$container.height() - this.data.size.y - $("#chat_bar").height() };
                },
            },
            {
                key: "asshole",
                value: function (target, data) {
                    var sapi = ((data = data || {}) && data.sapi) || null,
                        namedExtra = { audio: (sapi && sapi.named) || null },
                        commonExtra = { audio: (sapi && sapi.common) || null };
                    this.runSingleEvent([
                        { type: "text", text: "Hey, " + target + "!", extra: namedExtra, audio: namedExtra.audio },
                        { type: "text", text: "You're a fucking asshole!", say: "your a fucking asshole!", extra: commonExtra, audio: commonExtra.audio },
                        { type: "anim", anim: "grin_fwd", ticks: 15 },
                        { type: "idle" },
                    ]);
                },
            },
            {
                key: "asshole2",
                value: function (target, data) {
                    var sapi = ((data = data || {}) && data.sapi) || null,
                        namedExtra = { audio: (sapi && sapi.named) || null },
                        commonExtra = { audio: (sapi && sapi.common) || null };
                    this.runSingleEvent([
                        { type: "text", text: "Hey, " + target + "!", extra: namedExtra, audio: namedExtra.audio },
                        { type: "text", text: "You're a fucking asshole!", say: "your a fucking asshole!", extra: commonExtra, audio: commonExtra.audio },
                        { type: "anim", anim: "laugh_fwd", ticks: 15 },
                        { type: "idle" },
                    ]);
                },
            },
            {
                key: "merlinbaby",
                value: function (target, data) {
                    var sapi = ((data = data || {}) && data.sapi) || null,
                        namedExtra = { audio: (sapi && sapi.named) || null },
                        commonExtra = { audio: (sapi && sapi.common) || null };
                    this.runSingleEvent([
                        { type: "text", text: "Hey, " + target + "!", extra: namedExtra, audio: namedExtra.audio },
                        { type: "text", text: "You're a merlin baby! :D", say: "your a merlin baby!", extra: commonExtra, audio: commonExtra.audio },
                        { type: "anim", anim: "laugh_fwd", ticks: 15 },
                        { type: "idle" },
                    ]);
                },
            },
            {
                key: "welcome",
                value: function (a) {
                    this.runSingleEvent([{ type: "anim", anim: "greet_fwd", ticks: 30 }, { type: "text", text: "Hello, " + a + "." }, { type: "idle" }]);
                },
            },
            {
                key: "uwu",
                value: function (a) {
                    this.runSingleEvent([
                        { type: "text", text: "*notices " + a + "'s BonziBulge™*", say: "notices " + a + "s bonzibulge" },
                        { type: "text", text: "♥ ( 。 U ω U 。 )<br/>uwu, wat dis?", say: "[['u 'wu]]? what diss?" },
                    ]);
                },
            },
            {
                key: "blackhat",
                value: function (a) {
                    this.runSingleEvent([
                        { type: "anim", anim: "praise_fwd", ticks: 25 },
                        {
                            type: "text",
                            text: "What the fuck did you just fucking say about me, you little asshole?",
                        },
                        { type: "idle" },
                        { type: "anim", anim: "shrug_fwd", ticks: 28 },
                        {
                            type: "text",
                            text: "I'll have you know I graduated top of my class in the black hats, and I've been involved in numerous secret raids on user's PC's, and I have over 300 confirmed PC destructions.",
                        },
                        { type: "idle" },
                        {
                            type: "text",
                            text: "I am trained in JS warfare and I'm the top hacker in the entire Anonymous forces. You are nothing to me but just another target.",
                        },
                        {
                            type: "text",
                            text: "I will hack you the fuck out with precision the likes of which has never been seen before on this game, mark my fucking words.",
                        },
                        { type: "anim", anim: "grin_fwd", ticks: 28 },
                        { type: "idle" },
                        {
                            type: "text",
                            text: "You think you can get away with saying that shit to me over BonziWORLD? Think again, fucker.",
                        },
                        { type: "anim", anim: "earth_fwd", ticks: 30 },
                        {
                            type: "text",
                            text: "As we speak I am contacting my secret network of hackers across the server and your IP is being traced right now so you better prepare for the storm, maggot.",
                        },
                        { type: "idle" },
                        {
                            type: "text",
                            text:
                                " The storm that wipes out the pathetic little thing you call your PC. You're fucking dead, kid. I can be anywhere, anytime, and I can ban you in over seven hundred ways, and that's just with inspect element.",
                        },
                        {
                            type: "text",
                            text:
                                "Not only am I extensively trained in javascript commands, but I have access to the entire core of the BonziWORLD source code and I will use it to its full extent to wipe your miserable ass off the face of the game, you little shit.",
                        },
                        { type: "anim", anim: "shrug_fwd", ticks: 28 },
                        {
                            type: "text",
                            text:
                                "If only you could have known what unholy retribution your little clever asshole command was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn asshole.",
                        },
                        { type: "idle" },
                        {
                            type: "text",
                            text: "I will hack fury all over you and you will be instant banned. You're a fucking asshole, kiddo.",
                        },
                    ]);
                },
            },
            {
                key: "owo",
                value: function (target, data) {
                    var sapi = ((data = data || {}) && data.sapi) || null,
                        namedExtra = { audio: (sapi && sapi.named) || null },
                        commonExtra = { audio: (sapi && sapi.common) || null };
                    this.runSingleEvent([
                        { type: "text", text: "*notices " + target + "'s BonziBulge™*", say: "notices " + target + "s bonzibulge", extra: namedExtra, audio: namedExtra.audio },
                        { type: "text", text: "♥ ( 。 U ω U 。 )<br/>owo, wat dis?", say: "oh woah, what diss?", extra: commonExtra, audio: commonExtra.audio },
                    ]);
                },
            },
            {
                key: "dvdbounce",
                value: function (status) {
                    var self = this;
                    if ("on" === status)
                        try {
                            this.runSingleEvent([{ type: "anim", anim: "w" === self.moving.direction.charAt(1) ? "surf_back_fwd" : "surf_across_fwd", ticks: 15 }]),
                                setTimeout(function () {
                                    self._extras.dvd = !0;
                                }, 650);
                        } catch (err) {
                            self._extras.dvd = !0;
                        }
                    else (self._extras.dvd = !1), self.sprite.gotoAndStop("w" === self.moving.direction.charAt(1) ? "surf_back_back" : "surf_across_back");
                },
            },
            {
                key: "updateSpriteForced",
                value: function (hide) {
                    var stage = BonziHandler.stage;
                    this.cancel(),
                        stage.removeChild(this.sprite),
                        delete this.sprite,
                        (this.sprite = new createjs.Sprite(BonziHandler.spriteSheets[this.color], hide ? "gone" : "idle")),
                        (this.sprite.id = this.id),
                        this.updateAgent(),
                        stage.addChild(this.sprite),
                        this.move();
                },
            },
            {
                key: "updateSpriteWithAnimation",
                value: function (anim) {
                    var stage = BonziHandler.stage;
                    stage.removeChild(this.sprite),
                        this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(BonziHandler.spriteSheets[this.color], anim || "idle")), (this.sprite.id = this.id)),
                        this.updateAgent(),
                        stage.addChild(this.sprite),
                        this.move();
                },
            },
            {
                key: "updateSprite",
                value: function (hide) {
                    var stage = BonziHandler.stage;
                    this.cancel(),
                        stage.removeChild(this.sprite),
                        this.colorPrev != this.color && (delete this.sprite, (this.sprite = new createjs.Sprite(BonziHandler.spriteSheets[this.color], hide ? "gone" : "idle")), (this.sprite.id = this.id)),
                        this.updateAgent(),
                        stage.addChild(this.sprite),
                        this.move();
                },
            },
            {
                key: "checkSprite",
                value: function () {
                    var stage = BonziHandler.stage;
                    if (this.sprite) return !0;
                    (this.sprite = new createjs.Sprite(BonziHandler.spriteSheets[this.color], "idle")), (this.sprite.id = this.id), this.updateAgent(), stage.addChild(this.sprite), this.move();
                },
            },
        ]),
        Bonzi
    );
})();
function range(begin, end) {
    for (var array = [], i = begin; i <= end; i++) array.push(i);
    for (i = begin; i >= end; i--) array.push(i);
    return array;
}
function replaceAll(t, s, r) {
    return t.replace(new RegExp(s, "g"), r);
}
function s4() {
    return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
}
function youtubeParser(url) {
    var match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
    return !(!match || 11 != match[7].length) && match[7];
}
function rtimeOut(callback, delay) {
    var stop,
        dateNow = Date.now,
        requestAnimation = window.requestAnimationFrame,
        start = dateNow(),
        timeoutFunc = function () {
            dateNow() - start < delay ? stop || requestAnimation(timeoutFunc) : callback();
        };
    return (
        requestAnimation(timeoutFunc),
        {
            clear: function () {
                stop = 1;
            },
        }
    );
}
function rInterval(callback, delay) {
    var stop,
        dateNow = Date.now,
        requestAnimation = window.requestAnimationFrame,
        start = dateNow(),
        intervalFunc = function () {
            dateNow() - start < delay || ((start += delay), callback()), stop || requestAnimation(intervalFunc);
        };
    return (
        requestAnimation(intervalFunc),
        {
            clear: function () {
                stop = 1;
            },
        }
    );
}
function linkify(text) {
    return text.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/gi, "<a href='$1' target='_blank'>$1</a>");
}
window.Bonzi = Bonzi;
