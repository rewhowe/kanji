Vue.component('about-section', {
  template: `
    <div class="about">
      <h2 class="about-title">このアプリについて</h2>

      <div class="help-sections">
        <div class="help-section">
          <div class="help-text">
            &#x1F441;を押すと、入力の文字に似てる部首を検索出来ます。検索対象になった似た部首には&#x1F441;が付きます。
          </div>
          <table class="help-input-chart">
            <thead>
              <tr>
                <td>入力</td>
                <td>検索対象</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(input, search_radicals) in similar_input_chart">
                <td>{{ input }}</td>
                <td>{{ search_radicals }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="help-section">
          <div class="help-text">
            特定の文字の前に！を入力すると変形に変換されます。
          </div>
          <table class="help-input-chart">
            <thead>
              <tr>
                <td>入力</td>
                <td>変形</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(variant, input) in variant_input_chart">
                <td>！{{ input }}</td>
                <td>{{ variant }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul class="about-links">
        <li><a class="about-link" href="https://github.com/rewhowe/kanji">GitHub</a></li>
        <!-- TODO personal contributor links -->
      </ul>
    </div>
  `,
  computed: {
    similar_input_chart: function () {
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

    variant_input_chart: function () {
      return ALTERNATE_FORMS;
    },
  },
});
