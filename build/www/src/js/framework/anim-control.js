function FPSCtrl(fps, frameCallback, tickCallback) {
  const self = this;
  fps = fps || 30;

  self.fps = fps;
  self.delay = 1000 / self.fps;
  self.time = null;
  self.frame = -1;
  self.tref;
  self.frameCallback = frameCallback || function(){};
  self.tickCallback = tickCallback || function(){};

  self.isPlaying = false;
  self.initialized = false;
  self.hasFocus = true;
}

FPSCtrl.prototype.initialize = _fpsInitalize;
FPSCtrl.prototype.loop = _fpsLoop;
FPSCtrl.prototype.setFPS = _fpsSetFrameRate;
FPSCtrl.prototype.setFrameRate = _fpsSetFrameRate;
FPSCtrl.prototype.start = _fpsStartLoop;
FPSCtrl.prototype.stop = _fpsPauseLoop;
FPSCtrl.prototype.pause = _fpsPauseLoop;
FPSCtrl.prototype.focusCheck = _fpsIsFocused;
FPSCtrl.prototype.isFocused = _fpsIsFocused;
FPSCtrl.prototype.windowFocused = _fpsWindowFocused;
FPSCtrl.prototype.windowUnfocused = _fpsWindowUnfocused;
FPSCtrl.prototype.redrawAllBonzis = redrawAllBonzis;

function _fpsInitalize() {
  const self = this;
  if (self.initialized) {
    return;
  }

  window.addEventListener('focus', function () {
    self.focusCheck();
    self.windowFocused();
  });
  window.addEventListener('blur', function () {
    self.focusCheck();
    self.windowUnfocused();
  });
}
function _fpsIsFocused() {
  const self = this;
  try {
    self.hasFocus = document.hasFocus() || (document.getElementById('iframe') && document.getElementById('iframe').contentWindow.document.hasFocus()) || false;
  } catch (err) {
    console.error(err);
    self.hasFocus = false;
  }

  return self.hasFocus;
}

function _fpsWindowFocused() {
  const self = this;
  self.setFPS(15);
  self.redrawAllBonzis(true);
}

window.redrawAllBonzis = redrawAllBonzis;
function redrawAllBonzis(skipVideo) {
  _.forIn(bonzis, function (b) {
    b.checkSprite();
  });
}

setInterval(function () {
  window.redrawAllBonzis(true);
}, 30000);

function _fpsWindowUnfocused() {
  const self = this;
  self.setFPS(15);
}
function _fpsLoop(timestamp) {
  const self = this;
  if (self.time === null) {
    self.time = timestamp;
  }

  var seg = Math.floor((timestamp - self.time) / self.delay);
  if (seg > self.frame) {
    self.frame = seg;
    self.frameCallback({
      time: timestamp,
      frame: self.frame
    });
  }

  self.tickCallback({
    time: timestamp,
    frame: self.frame
  });

  self.tref = requestAnimationFrame(self.loop.bind(self));
}

function _fpsSetFrameRate(frameRate) {
  const self = this;
  if (!frameRate || typeof frameRate !== 'number') {
    return frameRate;
  }

  if (frameRate > 60) {
    throw new Error('Unable to set framerate > 60 FPS');
  }

  self.fps = frameRate;
  self.delay = 1000 / self.fps;
  self.frame = -1;
  self.time = null;
}

function _fpsStartLoop() {
  const self = this;
  if (self.isPlaying) {
    return;
  }

  self.initialize();
  self.isPlaying = true;
  self.tref = requestAnimationFrame(self.loop.bind(self));
}

function _fpsPauseLoop() {
  const self = this;
  if (!self.isPlaying) {
    return;
  }

  self.isPlaying = false;
  cancelAnimationFrame(self.tref);
  self.time = null;
  self.frame = -1;
}
