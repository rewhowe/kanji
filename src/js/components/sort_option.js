Vue.component('sort-option', {
  props: {
    sort: String,
    order: String,
    label: String,
  },
  template: `
    <div class="search_sortOption" v-on:click="$emit('click', order)">
      <input class="search_sortOptionInput"
             type="radio"
             name="sort"
             v-bind:id="id"
             v-bind:value="order"
             v-model="sort">
      <label class="search_sortOptionLabel" v-bind:for="id">{{ label }}</label>
    </div>
  `,
  computed: {
    id: function () {
      return 'sort_' + this.order;
    },
  },
});
