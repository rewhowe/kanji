Vue.component('sort-option', {
  props: {
    sort: String,
    order: String,
    label: String,
  },
  template: `
    <label v-bind:for="id">
      <input type="radio"
             name="sort"
             v-bind:id="id"
             v-bind:value="order"
             v-model="sort"
             v-on:change="$emit('sort-candidates', order)">
      {{ label }}
    </label>
  `,
  computed: {
    id: function () {
      return 'sort_' + this.order;
    },
  },
});
