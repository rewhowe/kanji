const APP_KEY = 'search_kanji';

const LOCAL_STORAGE_AVAILABLE = (() => { try { return !!localStorage; } catch (e) { return false; } })();

function getJson(url, callback) {
  if (LOCAL_STORAGE_AVAILABLE && localStorage[url]) {
    callback(JSON.parse(localStorage[url]));
  } else {
    axios.get(url)
    .then(function (response) {
      if (LOCAL_STORAGE_AVAILABLE) localStorage[url] = JSON.stringify(response.data);
      callback(response.data);
    });
  }
}

function intersect(a, b) {
  return a.filter(element => b.includes(element));
}

function unique(s) {
  return String.prototype.concat(...new Set(s));
}
