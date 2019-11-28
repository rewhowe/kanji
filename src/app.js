// TODO:
// * radical selection list
// * lookalikes
// * ciangjie
// * styling
const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/src/radicals.json';

let RADICAL_MAPPING = undefined;

axios.get(RADICALS_JSON_URL)
.then(function (response) {
  RADICAL_MAPPING = response.data;
});

const app = new Vue({
  el: '#app',
  data: {
    candidates: [],
  },
  methods: {
    // TODO: v-on:input そしてタイマーを付ける
    lookup: function (el) {

      const radicals = [...el.target.value];
      const candidates = getCandidates(radicals);

      app.candidates = candidates;
    },
  },
});

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
  return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
}
