// 並び替え：画数が少ない順
const STROKE_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/stroke_order.json';
let STROKE_ORDER = [];

// TODO: replace with lazy load and store in local storage
axios.get(STROKE_ORDER_JSON_URL)
.then(function (response) {
  STROKE_ORDER = response.data;
});

// 並び替え：日本語での使用頻度が多い順
const FREQ_JA_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_ja_order.json';
let FREQ_JA_ORDER = [];

// TODO: replace with lazy load and store in local storage
axios.get(FREQ_JA_ORDER_JSON_URL)
.then(function (response) {
  FREQ_JA_ORDER = response.data;
});

// 並び替え：中国語での使用頻度が多い順
const FREQ_CN_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_cn_order.json';
let FREQ_CN_ORDER = [];

// TODO: replace with lazy load and store in local storage
axios.get(FREQ_CN_ORDER_JSON_URL)
.then(function (response) {
  FREQ_CN_ORDER = response.data;
});

function sortBy(candidates, order) {
  if (order == 'stroke') {
    candidates.sort(function (a, b) {
      return (STROKE_ORDER[a] || Infinity) - (STROKE_ORDER[b] || Infinity);
    });
  } else if (order == 'freq_ja') {
    candidates.sort(function (a, b) {
      return (FREQ_JA_ORDER[a] || Infinity) - (FREQ_JA_ORDER[b] || Infinity);
    });
  } else if (order == 'freq_cn') {
    candidates.sort(function (a, b) {
      return (FREQ_CN_ORDER[a] || Infinity) - (FREQ_CN_ORDER[b] || Infinity);
    });
  }
  return candidates;
};
