Vue.component('radical-selection', {
  props: {
    radical_selection: [],
  },
  template: `
    <table>
      <tbody>
        <tr v-for="(radicals, stroke_num) in radical_selection" v-bind:key="stroke_num">
          <th>{{ stroke_num }}</th>
          <td>
            <span v-for="(data, radical) in radicals"
                  v-bind:key="radical"
                  v-on:click="$emit('select-radical', radical)"
                  class="radical"
                  v-bind:class="{
                    selected:             data.selected,
                    'lookalike-selected': data.lookalike_selected,
                    unavailable:          !data.available,
                  }">{{ data.display }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  `,
});
