var usersPublic = {},
    bonzis = {};
function utmRemover() {
    window.utmRemoverRun = !0;
    var cleanSearch = window.location.search
            .replace(/utm_[^&]+&?/g, "")
            .replace(/&$/, "")
            .replace(/^\?$/, ""),
        cleanHash = window.location.hash
            .replace(/utm_[^&]+&?/g, "")
            .replace(/&$/, "")
            .replace(/^\#$/, "");
    window.history.replaceState({}, "", window.location.pathname + cleanSearch + cleanHash);
}
function showToast(icon, title) {
    if (!icon || !title) return;
    Swal.mixin({
        toast: !0,
        position: "top-end",
        showConfirmButton: !1,
        timer: 3e3,
        timerProgressBar: !0,
        onOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer), toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    }).fire({ icon: icon, title: title });
}
function generateTSString(uuid) {
    return String(new Date().getTime().toString() + "-" + (window.uuid || "x") + "-" + (window.guid || "z") + "-" + (window.fingerprint || "f"));
}
function login(name, room, extras) {
    var p = new Audio("./js/start.wav");
    p.play();
    function _openSocket(token) {
        window.socket.open(),
            setTimeout(function () {
                !(function (token) {
                    window.socket.connected || window.socket.open(),
                        window.sendFinger(),
                        window.dataLayer.push({ event: "login", name: name, room: room }),
                        socket.emit("login", { z: window.generateTSString(), name: name || "Anonymous", room: room || "default", extras: extras || null, token: token }),
                        bzSetup();
                })(token);
            }, 250);
    }
    return _openSocket();
}
function _showPageError() {
    window.banned || window.kicked || $("#page_error").show();
}
function disconnectTimeout() {
    window._tmots.disconnect = setTimeout(function () {
        (socket && socket.connected) || (console.log("Disconnect timeout - showing error."), $("#page_error").show());
    }, 9e4);
}
function errorFatal() {
    window.banned || window.kicked || disconnectTimeout();
}
function showAds() {
    window.adsShown = !0;
}
function setupHeartbeat() {
    window._heartbeat.setup ||
        ((window._heartbeat.setup = !0),
        (window._heartbeat.i = setInterval(function () {
            window._doHeartbeat();
        }, 5e3)),
        socket.on("pong", function (data) {
            (window._heartbeat.latency = data), (window._heartbeat.last = moment().toISOString());
        }),
        window._doHeartbeat());
}
function bzSetup() {
    window.adsShown || ((window.adsShown = !0), showAds()),
        setupHeartbeat(),
        $("#chat_send").click(sendInput),
        $("#chat_message").keypress(function (e) {
            13 === e.which && sendInput();
        }),
        (window._heartbeat.enabled = !0),
        socket.on("room", function (data) {
            $("#room_owner")[data.isOwner ? "show" : "hide"](), $("#room_public")[data.isPublic ? "show" : "hide"](), $("#room_private")[data.isPublic ? "hide" : "show"](), $(".room_id").text(data.room), (window.identity.room = data.room);
        }),
        socket.on("room:changed", function () {
            usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("updateAll", function (data) {
            $("#page_login").hide(), (usersPublic = data.usersPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("update", function (data) {
            window.identity && window.identity.guid === data.guid && (window.identity.name = data.userPublic.name), (window.usersPublic[data.guid] = data.userPublic), usersUpdate(), BonziHandler.bonzisCheck();
        }),
        socket.on("img", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.img(a);
        }),
        socket.on("surf", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.surf(), (a = new Audio("jump_off.wav")), a.play();
        }),
        socket.on("talk", function (data) {
            var b = bonzis[data.guid];
            b.cancel(), b.runSingleEvent([{ type: "text", text: data.text, say: data.say || data.text }]);
        }),
        socket.on("talk2", function (data) {
            var b = bonzis[data.guid];
            b.runSingleEvent([{ type: "text", text: data.text, say: data.say || data.text }]);
        }),
        socket.on("joke", function (data) {
            var b = bonzis[data.guid];
            b && ((b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.joke());
        }),
        socket.on("youtube", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.youtube(data.vid));
        }),
        socket.on("image", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(!0), b.image(data));
        }),
        socket.on("video", function (data) {
            var b = bonzis[data.guid];
            b && b.video(data);
        }),
        socket.on("fact", function (data) {
            var b = bonzis[data.guid];
            b && ((b.rng = new Math.seedrandom(data.rng)), b.cancel(), b.fact());
        }),
        socket.on("backflip", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.backflip(data.swag));
        }),
        socket.on("fly", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.fly(data.swag));
        }),
        socket.on("cooldown", function (a) {
            speak.play("Cooldown activated: please do not spam.");
        }),
        socket.on("sad", function (a) {
            var b = bonzis[a.guid];
            b.sad();
            if (b.color === "robby") {
                var aud = new Audio("robby_sad.wav");
                aud.play();
            }
        }),
        socket.on("shrug", function (a) {
            var b = bonzis[a.guid];
            b.shrug();
        }),
        socket.on("greet", function (a) {
            rf;
            var b = bonzis[a.guid];
            b.greet();
        }),
        socket.on("think", function (a) {
            var b = bonzis[a.guid];
            b.think();
        }),
        socket.on("wave", function (a) {
            var b = bonzis[a.guid];
            b.wave();
        }),
        socket.on("banana", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.banana();
        }),
        socket.on("nod", function (a) {
            var b = bonzis[a.guid];
            b.nod();
        }),
        socket.on("acknowledge", function (a) {
            var b = bonzis[a.guid];
            b.nod();
        }),
        socket.on("banana", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.banana();
        }),
        socket.on("surprised", function (a) {
            var b = bonzis[a.guid];
            b.surprised();
            var a = new Audio("surprised.wav");
            a.play();
        }),
        socket.on("laugh", function (a) {
            var b = bonzis[a.guid];
            b.cancel();
            b.laugh();
            var a = new Audio("laugh.ogg");
            a.play();
        }),
        socket.on("write", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write();
        }),
        socket.on("write_once", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write2();
        }),
        socket.on("write_infinite", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.write3();
        }),
        socket.on("clap", function (a) {
            var b = bonzis[a.guid];
            b.clap();
            setTimeout(function () {
                if (b.color == "robot") {
                    var a = new Audio("zap5.wav");
                    a.play();
                } else {
                    var a = new Audio("clap.wav");
                    a.play();
                }
            }, 600);
        }),
        socket.on("swag", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.swag();
        }),
        socket.on("confused", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.confused();
        }),
        socket.on("earth", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.earth();
        }),
        socket.on("grin", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.grin();
        }),
        socket.on("alert", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.alert();
        }),
        socket.on("uncertain", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.uncertain();
        }),
        socket.on("dvdbounce", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.dvdbounce(data.status || "off"));
        }),
        socket.on("asshole", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.asshole(data.target, data));
        }),
        socket.on("welcome", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.welcome(a.target);
        }),
        socket.on("merlinbaby", function (a) {
            var b = bonzis[a.guid];
            b.cancel(), b.merlinbaby(a.target);
        }),
        socket.on("owo", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.owo(data.target, data));
        }),
        socket.on("triggered", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.runSingleEvent(b.data.event_list_triggered));
        }),
        socket.on("linux", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.runSingleEvent(b.data.event_list_linux));
        }),
        socket.on("pawn", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.runSingleEvent(b.data.event_list_pawn));
        }),
        socket.on("bees", function (data) {
            var b = bonzis[data.guid];
            b && (b.cancel(), b.runSingleEvent(b.data.event_list_bees));
        }),
        socket.on("vaporwave", function (data) {
            $("body").addClass("vaporwave");
        }),
        socket.on("unvaporwave", function (data) {
            $("body").removeClass("vaporwave");
        }),
        socket.on("leave", function (data) {
            var b = bonzis[data.guid];
            setTimeout(function () {
                if (b.color == "diogo") {
                    var aud = new Audio("diogo_surfgone.ogg");
                    aud.play();
                } else if (b.color == "peedy") {
                    var aud = new Audio("peedy_surfgone.mp3");
                    aud.play();
                } else if (b.color == "merlin") {
                    var aud = new Audio("merlin_surfgone.mp3");
                    aud.play();
                } else if (b.color == "pm") {
                    var aud = new Audio("pmgreen_surf.wav");
                    aud.play();
                } else if (b.color == "rover") {
                } else if (b.color == "dogpope") {
                } else if (b.color == "genie") {
                    var aud = new Audio("genie_surfgone.ogg");
                    aud.play();
                } else if (b.color == "robby") {
                    var aud = new Audio("robby_surfintro.ogg");
                    aud.play();
                } else if (b.color == "clippy") {
                    var aud = new Audio("clippy_surfgone.ogg");
                    aud.play();
                } else if (b.color == "qmark") {
                    var aud = new Audio("qmark_surfleave.wav");
                    aud.play();
                } else if (b.color == "f1") {
                    var aud = new Audio("f1_surfleave.wav");
                    aud.play();
                } else if (b.color == "genius") {
                    var aud = new Audio("genius_surf.wav");
                    aud.play();
                } else if (b.color == "unbojih") {
                    var aud = new Audio("port_suckout1.wav");
                    aud.play();
                } else if (b.color == "unbojihpope") {
                    var aud = new Audio("port_suckout1.wav");
                    aud.play();
                } else if (d.color == "max") {
                    var a = new Audio("max_surfintro.wav");
                    a.play();
                } else {
                    var aud = new Audio("bye.mp3");
                    aud.play();
                }
            }, 250);
            void 0 !== b &&
                b.exit(
                    function (data) {
                        this.deconstruct(), delete bonzis[data.guid], delete usersPublic[data.guid], usersUpdate();
                    }.bind(b, data)
                );
        });
}
(window._heartbeat = { enabled: !0, setup: !1, last: null }),
    (window.utmRemover = utmRemover),
    setTimeout(window.utmRemover, 3e3),
    (window.showToast = showToast),
    (window.generateTSString = generateTSString),
    (window.bonziLogin = login),
    socket.on("user", function (data) {
        window.user = data;
    }),
    socket.on("identity", function (data) {
        (window.guid = data.guid), (window.identity = data), (window._heartbeat.enabled = !0);
    }),
    socket.on("s-heartbeat", function (args, callback) {
        "function" == typeof callback && callback({ timestamp: moment() });
    }),
    socket.on("reconnect", function () {
        if (!window.kicked && !window.banned)
            try {
                if (window.identity && window.identity.name) {
                    var extras = null;
                    if (window.identity.guid) {
                        var bz = bonzis[window.identity.guid];
                        bz && bz.userPublic && (extras = bz.userPublic);
                    }
                    window.bonziLogin(window.identity.name, window.identity.room, extras);
                    try {
                        clearTimeout(window._tmots.disconnect);
                    } catch (ignoreErr) {}
                }
                $("#page_error").hide(),
                    setTimeout(function () {
                        $("#page_error").hide();
                    }, 5e3);
            } catch (error) {
                console.error(error);
            }
    }),
    socket.on("reconnect_attempt", () => {
        if (window.identity) {
            if (((socket.io.opts.query = socket.io.opts.query || {}), window.identity.guid)) {
                socket.io.opts.query.guid = window.identity.guid;
                try {
                    var bz = bonzis[window.identity.guid];
                    bz && bz.userPublic && bz.userPublic.color && (socket.io.opts.query.color = bz.userPublic.color);
                } catch (error) {
                    console.error(error);
                }
            }
            window.roomPasscode && (socket.io.opts.query.passcode = window.roomPasscode),
                window.identity.name && (socket.io.opts.query.name = window.identity.name),
                window.identity.room && (socket.io.opts.query.room = window.identity.room);
        }
    }),
    $(function () {
        $("body").on("click", "#page_sidebar_close", function () {
            $("#page_sidebar").slideUp("slow", function () {
                $("#page_sidebar").empty();
            });
        }),
            socket.on("ban", function (data) {
                (window.banned = !0), (window.banData = data), $("#ban_reason").html(data.reason || "Being retarded? IDK. The fucker that banned you didn't specify.");
                var banEnds = moment(data.end);
                $("#ban_end").html(banEnds.format("MMMM Do YYYY, h:mm:ss A") + " (" + banEnds.fromNow() + ")"), $("#page_error").hide(), $("#page_kick").hide(), $("#page_ban").show(), $("body").addClass("banned");
            }),
            socket.on("kick", function (data) {
                (window.kicked = !0),
                    (window.kickData = data),
                    $("#kick_reason").html(data.reason || "Being retarded? IDK. The fucker that kicked you didn't specify."),
                    $("#page_error").hide(),
                    $("#page_ban").hide(),
                    $("#page_kick").show(),
                    $("body").addClass("kicked");
            }),
            socket.on("loginFail", function (data) {
                console.dir(data);
                $("#login_card").show(),
                    $("#login_load").hide(),
                    $("#login_error")
                        .show()
                        .text("Error: " + { nameLength: "Name too long.", full: "Room is full.", nameMal: "Nice try. Why would anyone join a room named that anyway?" }[data.reason] + " (" + data.reason + ")");
            }),
            socket.on("disconnect", function () {
                errorFatal();
            });
    }),
    (window._doHeartbeat = function () {
        if (window._heartbeat.enabled && socket && !socket.disconnected) {
            var hbo = { z: window.generateTSString(), ts: moment().toISOString() };
            window.fingerprint && (hbo.fp = window.fingerprint), window.identity.uuid && (hbo.uuid = window.identity.uuid), window.identity.guid && (hbo.guid = window.identity.guid), socket.emit("ping", hbo);
        }
    });
var usersAmt = 0,
    usersKeys = [];
function usersUpdate() {
    (usersKeys = Object.keys(usersPublic)), (usersAmt = usersKeys.length);
}
function sendInput(t) {
    var text = $("#chat_message").val();
    setTimeout(function () {
        if (("string" == typeof t && t.length > 0 && (text = t), !("string" != typeof (text = text.trim()) || text.length <= 0))) {
            $("#chat_message").val("");
            var youtube = youtubeParser(text);
            if (youtube) return window.dataLayer.push({ event: "send_command", command: "youtube", video: youtube }), void socket.emit("command", { z: window.generateTSString(), list: ["youtube", youtube] });
            if ("/" != text.substring(1, 0)) window.dataLayer.push({ event: "send_talk", text: text }), socket.emit("talk", { z: window.generateTSString(), text: text });
            else {
                var list = text.substring(1).split(" ");
                try {
                    switch (list[0].toLowerCase()) {
                        case "name":
                            window.dataLayer.push({ event: "change_name", name: text.substring(text.indexOf(" ") + 1) });
                            break;
                        case "speed":
                            window.dataLayer.push({ event: "change_speed", speed: text.substring(text.indexOf(" ") + 1) });
                            break;
                        case "pitch":
                            window.dataLayer.push({ event: "change_pitch", pitch: text.substring(text.indexOf(" ") + 1) });
                            break;
                        case "color":
                            window.dataLayer.push({ event: "change_color", color: text.substring(text.indexOf(" ") + 1) });
                            break;
                        case "joke":
                            window.dataLayer.push({ event: "tell_joke" });
                            break;
                        case "backflip":
                            window.dataLayer.push({ event: "do_backflip" });
                            break;
                        case "asshole":
                            window.dataLayer.push({ event: "call_asshole", target: text.substring(text.indexOf(" ") + 1) });
                            break;
                        case "triggered":
                            window.dataLayer.push({ event: "get_triggered" });
                            break;
                        case "linux":
                            window.dataLayer.push({ event: "linux_is_best" });
                            break;
                        case "pawn":
                            window.dataLayer.push({ event: "bonzi_pawn" });
                            break;
                        case "bees":
                            window.dataLayer.push({ event: "bees" });
                            break;
                        case "vaporwave":
                            window.dataLayer.push({ event: "vaporwave" });
                            break;
                        case "unvaporwave":
                            window.dataLayer.push({ event: "unvaporwave" });
                            break;
                        case "owo":
                            window.dataLayer.push({ event: "owo", target: text.indexOf(" ") > 0 ? text.slice(text.indexOf(" ") + 1) : "nobody" });
                    }
                    window.dataLayer.push({ event: "send_command", command: list[0], full: list.join(" ") });
                } catch (error) {}
                socket.emit("command", { z: window.generateTSString(), list: list });
            }
        }
    }, 100);
}
