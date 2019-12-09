// 並び替え：画数が少ない順
const STROKE_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/stroke_order.json';

// 並び替え：日本語での使用頻度が多い順
const FREQ_JA_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_ja_order.json';

// 並び替え：中国語での使用頻度が多い順
const FREQ_CN_ORDER_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/freq_cn_order.json';

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
