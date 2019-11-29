// TODO:
// * radical selection list
//   * also sort by strokes
// * sort result kanji by stroke count OR by frequency in chinese
// * styling (including loading spinner)
const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/src/radicals.json';

let RADICAL_MAPPING = undefined;

const app = new Vue({
  el: '#app',
  data: {
    input: '',
    candidates: [],
    include_ciangjie: false,
    include_similar: false,
    radical_selection: undefined,
  },
  methods: {
    // TODO: v-on:input そしてタイマーを付ける
    lookup: function () {
      // TODO: show loading

      const radicals = getRadicals();
      const candidates = getCandidates(radicals);

      app.candidates = candidates;
      // TODO: hide loading
    },

    selectRadical: function (radical) {
      const radical_data = RADICAL_MAPPING[radical];
      const is_selected = ! app.radical_selection[radical_data.strokes][radical].selected;
      app.radical_selection[radical_data.strokes][radical].selected = is_selected;

      app.input = app.input.replace(new RegExp(radical, 'g'), '');
      if (is_selected) {
        app.input = app.input + radical;
      }

      app.lookup();
    },
  },
});

function getRadicals() {
  const radicals = [];

  [...app.input].forEach(function (radical) {
    if (app.include_similar) {
      radicals.push(LOOKALIKES[radical] || RADK[radical] || radical);
    } else {
      radicals.push(RADK[radical] || radical);
    }
  });

  return radicals;
}

function getCandidates(radicals) {
  if (radicals.length == 0) return [];

  let candidates = undefined;

  radicals.forEach(function (radical) {
    const kanji = getKanjiWithRadical(radical);

    if (candidates === undefined) {
      candidates = kanji;
    } else {
      candidates = candidates.filter(candidate => kanji.includes(candidate));
    }

    if (candidates.length == 0) return;
  });

  return new Set(candidates);
}

function getKanjiWithRadical(radical) {
  if (radical instanceof Array) return radical.map(getKanjiWithRadical).flat();

  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}

function initialiseRadicalSelection() {
  const radical_selection = {};

  Object.keys(RADICAL_MAPPING).forEach(function (radical) {
    const radical_data = RADICAL_MAPPING[radical];

    if (!radical_selection[radical_data.strokes]) radical_selection[radical_data.strokes] = {};

    radical_selection[radical_data.strokes][RADK_DISPLAY[radical] || radical] = { selected: false };
  });

  app.radical_selection = radical_selection;
}

// TODO: handle error case
axios.get(RADICALS_JSON_URL)
.then(function (response) {
  RADICAL_MAPPING = response.data;

  initialiseRadicalSelection();
});
