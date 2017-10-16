<template id="article">
  <div class="article">
    <div class="article__info">
      <div class="article__title title">{{article.title}}</div>
      <div class="article__created">- {{ created }} -</div>
    </div>
    <Markdown :input="article.content" class="article__content" />
    <div class="article__tags">
      <li v-for="tag in article.tags" :key="tag" class="tag__item">
        <a :href="'/tags/'+tag" class="tag__link">
          <span class="tag__name"># {{tag}}</span>
        </a>
      </li>
    </div>
    <div class="social-share" v-bind:data-title="article.title" v-bind:data-description="`${article.content.slice(0, 80)}...`"></div>
    <div id="disqus_thread"></div>
  </div>
</template>

<script>                        
import moment from 'moment';
import 'social-share.js/dist/css/share.min.css';
import share from 'social-share.js/dist/js/social-share.min.js';

import Markdown from './Markdown.vue';

moment.locale('zh-cn');

export default {
  template: '#article',
  props: ['article'],
  components: {
    Markdown,
  },
  mounted() {
    this.initDisqus();
  },
  computed: {
    created() {
      return moment(this.article.created).format("dddd, MMMM Do YYYY");
    }
  },
  methods: {
    initDisqus() {
      const d = document,
      s = d.createElement('script');
      s.src = 'https://yawenina-now-sh-1.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    }
  }
}
</script>

<style>
#disqus_thread {
  padding-top: 20px;
}
</style>


