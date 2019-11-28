// TODO:
// * ciangjie
// * radical selection list
// * styling (including loading spinner)
const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/src/radicals.json';

let RADICAL_MAPPING = undefined;

axios.get(RADICALS_JSON_URL)
.then(function (response) {
  RADICAL_MAPPING = response.data;
});

const app = new Vue({
  el: '#app',
  data: {
    input: '',
    candidates: [],
    include_ciangjie: false,
    include_similar: false,
  },
  methods: {
    // TODO: v-on:input そしてタイマーを付ける
    lookup: function () {

      const radicals = getRadicals();
      const candidates = getCandidates(radicals);

      app.candidates = candidates;
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

  return candidates;
}

function getKanjiWithRadical(radical) {
  if (radical instanceof Array) return radical.map(getKanjiWithRadical).flat();

  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}
