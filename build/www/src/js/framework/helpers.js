function range(begin, end) {
  var array = [];
  for (var i = begin; i <= end; i++) {
    array.push(i);
  }

  for (var i = begin; i >= end; i--) {
    array.push(i);
  }

  return array;
}

function replaceAll(t, s, r) {
  return t.replace(new RegExp(s, 'g'), r);
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

// http://stackoverflow.com/a/8260383/2605226
function youtubeParser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

// http://codereview.stackexchange.com/q/47889
function rtimeOut(callback, delay) {
  var dateNow = Date.now;
  var requestAnimation = window.requestAnimationFrame;
  var start = dateNow();
  var stop;
  var timeoutFunc = function () {
    dateNow() - start < delay ? stop || requestAnimation(timeoutFunc) : callback();
  };

  requestAnimation(timeoutFunc);
  return {
    clear: function () {
      stop = 1;
    }
  };
}

function rInterval(callback, delay) {
  var dateNow = Date.now;
  var requestAnimation = window.requestAnimationFrame;
  var start = dateNow();
  var stop;
  var intervalFunc = function () {
    dateNow() - start < delay || (start += delay, callback());
    stop || requestAnimation(intervalFunc);
  };

  requestAnimation(intervalFunc);
  return {
    clear: function () {
      stop = 1;
    }
  };
}

// http://stackoverflow.com/a/14853974/2605226
// Warn if overriding existing method
if (Array.prototype.equals) {
  console.warn('Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there\'s a framework conflict or you\'ve got double inclusions in your code.');
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (this.length != array.length) {
    return false;
  }

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (Array.isArray(this[i]) && Array.isArray(array[i])) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) {
        return false;
      }
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }

  return true;
};

if (String.prototype.toColour) {
  console.warn('Overriding existing String.prototype.toColour. Possible causes: New API defines the method, there\'s a framework conflict or you\'ve got double inclusions in your code.');
}

String.prototype.toColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }

  return colour;
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

// http://stackoverflow.com/a/14333691/2605226
function linkify(text) {
  var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig;
  return text.replace(regex, '<a href=\'$1\' target=\'_blank\'>$1</a>');
}
