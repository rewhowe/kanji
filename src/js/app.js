// TODO:
// * help charts for lookalikes and alternate forms
// * compile js / css

const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/radicals.json';
const COLLOCATIONS_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/collocations.json';

let RADICAL_MAPPING = [];
let COLLOCATIONS = [];

const app = new Vue({
  el: '#app',
  data: {
    input: '',
    candidates: [],
    include_similar: false,
    radical_selection: undefined,
    sort: 'stroke',
    ready: false,
    searching: false,
  },
  methods: {
    lookup: function () {
      app.searching = true;

      const radicals = getRadicals();
      const candidates = getCandidates(radicals);

      updateSelection();

      sortBy(candidates, app.sort, candidates => app.candidates = candidates);

      app.searching = false;
    },

    selectRadical: function (radical) {
      app.searching = true;

      const radical_data = RADICAL_MAPPING[radical];
      const is_selected = app.radical_selection[radical_data.strokes][radical].selected;
      const is_available = app.radical_selection[radical_data.strokes][radical].available;

      if (!is_available && !is_selected) return;

      const display_radical = RADK_DISPLAY[radical] || radical;
      app.input = app.input.replace(new RegExp(display_radical, 'g'), '');
      if (!is_selected) {
        app.input = app.input + display_radical;
      }

      app.lookup();
    },

    sortCandidates: function () {
      app.searching = true;
      sortBy(app.candidates, app.sort, candidates => app.candidates = candidates);
      app.searching = false;
    },
  },
});

function getRadicals() {
  app.input = app.input.replace(/[!！][^!！]/g, s => ALTERNATE_FORMS[s[1]] || s[1]);

  return [...app.input].map(function (radical) {
    return (app.include_similar && LOOKALIKES[radical]) || [RADK[radical] || radical];
  });
}

function getCandidates(radicals) {
  if (radicals.length == 0) return [];

  let candidates;

  radicals.forEach(function (radical) {
    if (candidates && candidates.length == 0) return;

    const kanji = getKanjiWithRadical(radical);

    if (candidates === undefined) {
      candidates = kanji;
    } else {
      candidates = intersect(candidates, kanji);
    }
  });

  return [...new Set(candidates)];
}

function getKanjiWithRadical(radical) {
  if (radical instanceof Array) return radical.map(getKanjiWithRadical).flat();

  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}

function updateSelection() {
  const input = [...app.input];
  const available_radicals = getAvailableRadicals(input);

  initialiseRadicalSelection(available_radicals === undefined);

  input.forEach(function (radical) {
    setSelection(radical, 'selected');

    if (app.include_similar && LOOKALIKES[radical]) {
      LOOKALIKES[radical].forEach(r => setSelection(r, 'lookalike_selected'));
    }
  });

  if (available_radicals === undefined) return;

  available_radicals.forEach(function (radical) {
    setSelection(radical, 'available');
  });
}

function getAvailableRadicals(input) {
  let available_radicals;
  const input_radicals = [];

  input.forEach(function (radical) {
    radical = RADK[radical] || radical;

    if (!COLLOCATIONS[radical]) return;

    input_radicals.push([radical]);

    // lookup by 1 radical
    // 一 -> ノ, 人, 丶, 九, 口, 自, マ, 丷, 女, 大, ...
    if (input_radicals.length == 1) {
      available_radicals = COLLOCATIONS[radical];

    // lookup by 2 radical pair
    // 一人 -> ノ, 丶, 口, マ, 丷, 女, 大, ...
    } else if (input_radicals.length == 2) {
      const pair = input_radicals.sort().join('');
      available_radicals = COLLOCATIONS[pair] || [];

    // brute force: compare possible kanji of current input and possible kanji of radicals for next radical
    //
    // 3 case
    // input: 一人口
    // (available_kanji)   一人  = 関, 病, 復, 春, 券, 臨, 傷, 咲, 奉, ...
    // (possible_radicals) 一口 -> ｜, 羊, 阡, 女, 个, 心, 丷, 女, 大
    // (possible_kanji 1)  ｜    = 中, 出, 東, 業, 選, 円, 奉, ... -> available (common: 奉, ...)
    // (possible_kanji 2)  羊    = 業, 鮮, 着, 義, 差, 美, ...     -> unavailable (no common kanji)
    // ...
    // (possible_kanji 7)  丷    = 前, 業, 新, 金, 関, 咲, ...     -> available (common: 関, 咲, ...)
    // ...
    //
    // 4 case
    // input: 一人口丷
    // (available_kanji)   一人口 = 塩, 咲, 倹, 僉, 儉, ...
    // (possible_radicals) 一丷  -> 皿, ハ, 冂, 山, 大
    // (possible_kanji 1)  皿     = 盟, 益, 盛, 血, 温, ... -> unavailable (no common kanji)
    // ...
    // (possible_kanji 5)  大     = 大, 実, 決, 勝, 咲, ... -> available (common: 咲)
    // ...
    } else {
      available_radicals = [];
      // get possible radicals via pair (to reduce the possibilies)
      const next_pair = [input_radicals[0], [radical]].sort().join('');
      const possible_radicals = COLLOCATIONS[next_pair] || [];

      const available_kanji = getCandidates(input_radicals);

      possible_radicals.forEach(function (r) {
        const possible_kanji = RADICAL_MAPPING[r].kanji;
        if (intersect(available_kanji, possible_kanji).length > 0) {
          available_radicals.push(r);
        }
      });
    }
  });

  return available_radicals;
}

function setSelection(radical, property) {
  radical = RADK[radical] || radical;
  const radical_data = RADICAL_MAPPING[radical];
  if (radical_data) app.radical_selection[radical_data.strokes][radical][property] = true;
}

function initialiseRadicalSelection(is_all_available) {
  const radical_selection = {};

  Object.keys(RADICAL_MAPPING).forEach(function (radical) {
    const radical_data = RADICAL_MAPPING[radical];

    if (!radical_selection[radical_data.strokes]) radical_selection[radical_data.strokes] = {};

    radical_selection[radical_data.strokes][radical] = {
      display: RADK_DISPLAY[radical] || radical,
      selected: false,
      lookalike_selected: false,
      available: is_all_available,
    };
  });

  app.radical_selection = radical_selection;
}

getJson(RADICALS_JSON_URL, function (data) {
  RADICAL_MAPPING = data;

  initialiseRadicalSelection(true);

  getJson(COLLOCATIONS_JSON_URL, function (data) {
    COLLOCATIONS = data;

    app.ready = true;
  });
});
