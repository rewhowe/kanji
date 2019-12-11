Vue.component('help-modal', {
  data: function () {
    return {
      tab: 'similar',
      display: false,
    };
  },
  template: `
    <div>
      <i class="help-icon" v-on:click="display = true">?</i>

      <div v-if="display" class="help-overlay" v-on:click="display = false">
        <div class="help-modal" v-on:click.stop>
          <div class="help-tabs">
            <input id="help_tab_similar" type="radio" name="help_tab" value="similar" v-model="tab">
            <label for="help_tab_similar" class="help-tab">似てる部首一覧</label>
            <input id="help_tab_variant" type="radio" name="help_tab" value="variant" v-model="tab">
            <label for="help_tab_variant" class="help-tab">変形一覧</label>
          </div>

          <div v-html="help_text"></div>

          <table>
            <thead>
              <tr v-if="tab === 'similar'">
                <td>入力</td>
                <td>検索対象</td>
              </tr>
              <tr v-else-if="tab === 'variant'">
                <td>入力</td>
                <td>変形</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(input, search_radicals) in input_chart">
                <td>{{ input }}</td>
                <td>{{ search_radicals }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  computed: {
    help_text: function () {
      switch (this.tab) {
        case 'similar':
          return '入力の文字に似てる部首を検索出来ます。検索対象になった似た部首には&#x1F441;が付きます。';
        case 'variant':
          return '特定の文字の前に！を入力すると変形に変換されます。';
        default:
          return '';
      }
    },

    input_chart: function () {
      switch (this.tab) {
        case 'similar':
          return this.getSimilarInputChart();
        case 'variant':
          return this.getVariantInputChart();
        default:
          return [];
      }
    },
  },

  created: function () {
    const self = this;
    document.addEventListener('keyup', function (e) {
      if (e.keyCode === 27) { // ESC
        self.display = false;
      }
    });
  },

  methods: {
    getSimilarInputChart: function () {
      const chart = {};
      Object.keys(LOOKALIKES).forEach(function (input) {
        const search_radicals = LOOKALIKES[input].map(function (radical) {
          return RADK_DISPLAY[radical] || radical;
        }).join(' ');

        if (chart[search_radicals]) {
          chart[search_radicals] += ' or ' + input;
        } else {
          chart[search_radicals] = input;
        }
      });
      return chart;
    },

    getVariantInputChart: function () {
      const chart = {};
      Object.keys(ALTERNATE_FORMS).forEach(function (input) {
        chart[ALTERNATE_FORMS[input]] = '！' + input;
      });
      return chart;
    },
  },
});
