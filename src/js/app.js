const RADICALS_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/radicals.json';
let RADICAL_MAPPING = [];

const COLLOCATIONS_JSON_URL = 'https://rewhowe.github.io/kanji/public/json/collocations.json';
let COLLOCATIONS = [];

const app = new Vue({
  el: '#app',
  data: {
    input: '',

    include_similar: false,
    sort_options: SORT_OPTIONS,
    sort: 'stroke',

    candidates: [],
    radical_selection: undefined,

    searching: false,

    is_dropdown_open: false,
  },
  template: `
    <div class="app">
      <section class="search">
        <div class="search_bar">
          <div class="search_sort" v-bind:class="{ open: is_dropdown_open }">
            <div class="search_sortTrigger" v-on:click="toggleDropdown"><span class="search_sortLabel">{{ sort_options[sort] }}</span></div>
            <div class="search_sortOptions">
              <sort-option v-for="(label, order) in sort_options"
                           v-bind:key="order"
                           v-bind:order="order"
                           v-bind:label="label"
                           v-bind:sort="sort"
                           v-bind:class="{ selected: sort == order }"
                           v-on:click="selectSort"></sort-option>
            </div>
          </div>
          <input type="text" v-model="input" v-on:change="lookup" class="search_input">
          <div class="search_includeSimilar">
            <input id="include_similar" type="checkbox" v-model="include_similar" v-on:change="includeSimilar"　class="search_checkBox">
            <label class="search_includeSimilarLabel" for="include_similar" v-bind:class="{ selected: include_similar }"><i class="far fa-eye"></i></label>
          </div>
        </div>

        <candidate-list v-bind:candidates="candidates" v-bind:searching="searching"></candidate-list>

        <radical-selection v-bind:radical_selection="radical_selection"
                           v-on:select-radical="selectRadical"></radical-selection>
      </section>

      <about-section></about-section>

      <footer class="footer">
        <a class="about-link" href="https://github.com/rewhowe/kanji">GitHub</a>
      </footer>
    </div>
  `,

  methods: {
    lookup: function () {
      const self = this;
      self.searching = true;

      // Delay so that loading spinner can render
      window.setTimeout(function () {
        const radicals = self.getRadicals();
        const candidates = self.getCandidates(radicals);

        self.updateSelection();

        sortBy(candidates, self.sort, candidates => self.candidates = candidates);

        self.searching = false;
      }, 1);
    },

    toggleDropdown: function (e) {
      this.is_dropdown_open = !this.is_dropdown_open;
      e.stopPropagation();
    },

    selectSort: function (order) {
      this.is_dropdown_open = false;
      this.sortCandidates(order);
    },

    includeSimilar: function() {
      this.isIncludeSimilar = !this.isIncludeSimilar;
      this.lookup();
    },

    selectRadical: function (radical) {
      const self = this;

      const radical_data          = RADICAL_MAPPING[radical];
      const is_currently_selected = self.radical_selection[radical_data.strokes][radical].selected;
      const is_available          = self.radical_selection[radical_data.strokes][radical].available;

      if (!is_available && !is_currently_selected) return;

      self.searching = true;

      // Delay so that loading spinner can render
      window.setTimeout(function () {
        const display_radical = RADK_DISPLAY[radical] || radical;
        self.input = self.input.replace(new RegExp(display_radical, 'g'), '');
        if (!is_currently_selected) {
          self.input = self.input + display_radical;
        }

        self.lookup();
      }, 1);
    },

    sortCandidates: function (order) {
      const self = this;
      self.sort = order;
      self.searching = true;
      sortBy(self.candidates, self.sort, candidates => self.candidates = candidates);
      self.searching = false;
    },

    initialiseRadicalSelection: function (is_all_available) {
      const self = this;
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

      self.radical_selection = radical_selection;
    },

    getRadicals: function () {
      const self = this;
      self.input = self.input.replace(/[!！][^!！]/g, s => ALTERNATE_FORMS[s[1]] || s[1]);

      return [...self.input].map(function (radical) {
        return (self.include_similar && LOOKALIKES[radical]) || [RADK[radical] || radical];
      });
    },

    getCandidates: function (radicals) {
      if (radicals.length == 0) return [];

      const self = this;
      let candidates;

      radicals.forEach(function (radical) {
        if (candidates && candidates.length == 0) return;

        const kanji = self.getKanjiWithRadical(radical);

        if (candidates === undefined) {
          candidates = kanji;
        } else {
          candidates = intersect(candidates, kanji);
        }
      });

      return [...new Set(candidates)];
    },

    getKanjiWithRadical: function (radical) {
      const self = this;
      if (radical instanceof Array) return radical.map(self.getKanjiWithRadical).flat();

      return RADICAL_MAPPING[radical] ? RADICAL_MAPPING[radical].kanji : [];
    },

    updateSelection: function () {
      const self = this;
      const input = [...self.input];
      const available_radicals = self.getAvailableRadicals(input);

      self.initialiseRadicalSelection(available_radicals === undefined);

      input.forEach(function (radical) {
        self.setSelection(radical, 'selected');

        if (self.include_similar && LOOKALIKES[radical]) {
          LOOKALIKES[radical].forEach(r => self.setSelection(r, 'lookalike_selected'));
        }
      });

      if (available_radicals === undefined) return;

      available_radicals.forEach(function (radical) {
        self.setSelection(radical, 'available');
      });
    },

    setSelection: function (radical, property) {
      const self = this;
      radical = RADK[radical] || radical;
      const radical_data = RADICAL_MAPPING[radical];
      if (radical_data) self.radical_selection[radical_data.strokes][radical][property] = true;
    },

    getAvailableRadicals: function (input) {
      const self = this;
      const input_radicals = [];
      let available_radicals;

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

          const available_kanji = self.getCandidates(input_radicals);

          possible_radicals.forEach(function (r) {
            const possible_kanji = RADICAL_MAPPING[r].kanji;
            if (intersect(available_kanji, possible_kanji).length > 0) {
              available_radicals.push(r);
            }
          });
        }
      });

      return available_radicals;
    },
  },

  beforeMount: function () {
    const self = this;
    getJson(RADICALS_JSON_URL, function (data) {
      RADICAL_MAPPING = data;
      self.initialiseRadicalSelection(true);
    });
    getJson(COLLOCATIONS_JSON_URL, function (data) {
      COLLOCATIONS = data;
    });
  },

  mounted: function () {
    const self = this;
    document.addEventListener('click', function () {
      self.is_dropdown_open = false;
    });
  },
});
