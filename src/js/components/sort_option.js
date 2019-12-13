Vue.component('sort-option', {
  props: {
    sort: String,
    order: String,
    label: String,
  },
  template: `
  <div class="search_sortOption">
    <input class="search_sortOptionInput"
           type="radio"
           name="sort"
           v-bind:id="id"
           v-bind:value="order"
           v-model="sort"
           v-on:click="$emit('click', order)">
    <label v-bind:for="id">{{ label }}</label>
  </div>
  `,
  computed: {
    id: function () {
      return 'sort_' + this.order;
    },
  },
});
