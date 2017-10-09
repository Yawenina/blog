import Vue from 'vue';
import Blog from './components/Blog.vue';
import '../sass/style.scss';

new Vue({
  el: '.content',
  components: {
    Blog,
  },
});
