<template id="article">
  <div class="article">
    <div class="article__info">
      <div class="article__title title">{{article.title}}</div>
      <div class="article__created">- {{ created }} -</div>
    </div>
    <Markdown :input="article.content" class="article__content"/>
    <div class="article__tags">
      <li v-for="tag in article.tags" :key="tag" class="tag__item">
        <a :href="'/tags/'+tag" class="tag__link">
          <span class="tag__name"># {{tag}}</span>
        </a>
      </li>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Markdown from './Markdown.vue';

moment.locale('zh-cn');

export default {
  template: '#article',
  props: ['article'],
  components: {
    Markdown,
  },
  computed: {
    created() {
      return moment(this.article.created).format("dddd, MMMM Do YYYY");
    }
  }
}
</script>

