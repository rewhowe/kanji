// 並び替え：画数が少ない順
const STROKE_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/src/stroke_order.json';
let STROKE_ORDER = [];

axios.get(STROKE_ORDER_JSON_URL)
.then(function (response) {
  STROKE_ORDER = response.data;
});

// 並び替え：日本語での使用頻度が多い順
const FREQ_JA_ORDER = [];

// 並び替え：中国語での使用頻度が多い順
const FREQ_CN_ORDER = [];

function sortBy(candidates, order) {
  if (order == 'stroke') {
    candidates.sort(function (a, b) {
      return STROKE_ORDER[a] - STROKE_ORDER[b];
    });
  }
  return candidates;
  // TODO: order == 'freq_ja'
  // TODO: order == 'freq_cn'
};
