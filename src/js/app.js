// TODO:
// * sort result kanji by stroke count OR by frequency in chinese
// * disable radical combinations which aren't possible
// * styling (including loading spinner)
// * help charts for lookalikes and alternate forms
// * compile js / css
const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/radicals.json';

let RADICAL_MAPPING = undefined;

const app = new Vue({
  el: '#app',
  data: {
    input: '',
    candidates: [],
    include_similar: false,
    radical_selection: undefined,
    sort: 'stroke',
  },
  methods: {
    // TODO: v-on:input そしてタイマーを付ける
    lookup: function () {
      // TODO: show loading

      const radicals = getRadicals();
      const candidates = getCandidates(radicals);

      updateSelection();

      app.candidates = sortBy(candidates, app.sort);

      // TODO: hide loading
    },

    selectRadical: function (radical) {
      const radical_data = RADICAL_MAPPING[radical];
      const is_selected = ! app.radical_selection[radical_data.strokes][radical].selected;

      const display_radical = RADK_DISPLAY[radical] || radical;
      app.input = app.input.replace(new RegExp(display_radical, 'g'), '');
      if (is_selected) {
        app.input = app.input + display_radical;
      }

      app.lookup();
    },

    sortCandidates: function () {
      app.candidates = sortBy(app.candidates, app.sort);
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

  return [...new Set(candidates)];
}

function getKanjiWithRadical(radical) {
  if (radical instanceof Array) return radical.map(getKanjiWithRadical).flat();

  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}

function updateSelection() {
  initialiseRadicalSelection();

  [...app.input].forEach(function (radical) {
    setSelection(radical, 'selected');

    if (app.include_similar && LOOKALIKES[radical]) {
      LOOKALIKES[radical].forEach(r => setSelection(r, 'lookalike_selected'));
    }
  });
}

function setSelection(radical, property) {
  radical = RADK[radical] || radical;
  const radical_data = RADICAL_MAPPING[radical];
  if (radical_data) app.radical_selection[radical_data.strokes][radical][property] = true;
}

function initialiseRadicalSelection() {
  const radical_selection = {};

  Object.keys(RADICAL_MAPPING).forEach(function (radical) {
    const radical_data = RADICAL_MAPPING[radical];

    if (!radical_selection[radical_data.strokes]) radical_selection[radical_data.strokes] = {};

    radical_selection[radical_data.strokes][radical] = {
      display: RADK_DISPLAY[radical] || radical,
      selected: false,
      lookalike_selected: false,
    };
  });

  app.radical_selection = radical_selection;
}

// TODO: handle error case
axios.get(RADICALS_JSON_URL)
.then(function (response) {
  RADICAL_MAPPING = response.data;

  initialiseRadicalSelection();
});
