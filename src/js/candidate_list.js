Vue.component('candidate-list', {
  props: {
    searching: false,
    candidates: [],
  },
  template: `
    <div class="candidate-list-container">
      <i v-if="searching" v-model="searching" class="loading"></i>
      <div class="candidate-list">
        <span v-for="candidate in candidates" v-bind:key="candidate" class="candidate">{{ candidate }}</span>
      </div>
      <div class="more"></div>
    </div>
  `,
});