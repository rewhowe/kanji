// TODO:
// * add visual indicator for selected "lookalikes"
// * sort result kanji by stroke count OR by frequency in chinese
// * disable radical combinations which aren't possible
// * styling (including loading spinner)
// * help charts for lookalikes and alternate forms
// * compile js / css
const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/src/radicals.json';

let RADICAL_MAPPING = undefined;

const app = new Vue({
  el: '#app',
  data: {
    input: '',
    old_input: '',
    candidates: [],
    include_similar: false,
    radical_selection: undefined,
  },
  methods: {
    // TODO: v-on:input そしてタイマーを付ける
    lookup: function () {
      // TODO: show loading

      const radicals = getRadicals();
      const candidates = getCandidates(radicals);

      updateSelection();

      app.old_input = app.input

      app.candidates = candidates;

      // TODO: hide loading
    },

    selectRadical: function (radical) {
      let radk_radical = RADK[radical] || radical;

      const radical_data = RADICAL_MAPPING[radk_radical];
      const is_selected = ! app.radical_selection[radical_data.strokes][radical].selected;

      app.input = app.input.replace(new RegExp(radical, 'g'), '');
      if (is_selected) {
        app.input = app.input + radical;
      }

      app.lookup();
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

  return new Set(candidates);
}

function getKanjiWithRadical(radical) {
  if (radical instanceof Array) return radical.map(getKanjiWithRadical).flat();

  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}

function updateSelection() {
  const added = [...app.input].filter(radical => !app.old_input.includes(radical));
  const removed = [...app.old_input].filter(radical => !app.input.includes(radical));

  added.forEach(radical => setSelection(radical, 'selected', true));
  removed.forEach(radical => setSelection(radical, 'selected', false));
}

function setSelection(radical, property, is_selected) {
  const radical_data = RADICAL_MAPPING[RADK[radical] || radical];
  if (radical_data) {
    app.radical_selection[radical_data.strokes][RADK_DISPLAY[radical] || radical][property] = is_selected;
  } else if (LOOKALIKES[radical]) {
    LOOKALIKES[radical].forEach(r => setSelection(r, 'lookalike_selected', is_selected));
  }
}

function initialiseRadicalSelection() {
  const radical_selection = {};

  Object.keys(RADICAL_MAPPING).forEach(function (radical) {
    const radical_data = RADICAL_MAPPING[radical];

    if (!radical_selection[radical_data.strokes]) radical_selection[radical_data.strokes] = {};

    // TODO: can we simplify this to avoid flipping back and forth between display and radk?
    radical_selection[radical_data.strokes][RADK_DISPLAY[radical] || radical] = {
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
