Vue.component('about-section', {
  template: `
    <section class="about">
      <h2 class="about-title">このアプリについて</h2>

      <div class="help-sections">
        <div class="help-section">
          <p class="help-text"><i class="far fa-eye"></i>を押すと、入力の文字に似てる部首を検索出来ます。検索対象になった似た部首には&#x1F441;が付きます。</p>
          <table class="help-input-chart">
            <thead>
              <tr>
                <th class="help-input-chart_header">入力</th>
                <th class="help-input-chart_header">検索対象</th>
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
          <p class="help-text">特定の文字の前に！を入力すると変形に変換されます。</p>
          <table class="help-input-chart">
            <thead>
              <tr>
                <th class="help-input-chart_header">入力</th>
                <th class="help-input-chart_header">変形</th>
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
    </section>
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
