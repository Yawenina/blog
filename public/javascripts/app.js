import '../sass/style.scss';

import Vue from 'vue';
import Blog from './components/Blog.vue';

new Vue({
  el: '.content',
  components: {
    Blog,
  },
});
