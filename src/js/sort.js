// 並び替え：画数が少ない順
const STROKE_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/stroke_order.json';

// 並び替え：日本語での使用頻度が多い順
const FREQ_JA_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_ja_order.json';

// 並び替え：中国語での使用頻度が多い順
const FREQ_CN_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_cn_order.json';

const SORT_OPTIONS = {
  stroke: '画数',
  freq_ja: '日本語での使用頻度',
  freq_cn: '中国語での使用頻度',
};

const SORT_OPTIONS_SHORT = {
  stroke: '画',
  freq_ja: '日',
  freq_cn: '中',
};

function sortBy(candidates, order, callback) {
  let order_json_url;

  if (order == 'stroke') {
      order_json_url = STROKE_ORDER_JSON_URL;
  } else if (order == 'freq_ja') {
      order_json_url = FREQ_JA_ORDER_JSON_URL;
  } else if (order == 'freq_cn') {
      order_json_url = FREQ_CN_ORDER_JSON_URL;
  }

  getJson(order_json_url, function (ordering) {
    candidates.sort(function (a, b) {
      return (ordering[a] || Infinity) - (ordering[b] || Infinity);
    });

    callback(candidates);
  });
};
