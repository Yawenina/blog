<template id="markdown">
  <div class="markdown markdown-body" v-html="compiledMarkdown"></div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js'
import 'github-markdown-css';
import 'highlight.js/styles/color-brewer.css';

// set marked options
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

export default {
  props: ['input'],
  computed: {
    compiledMarkdown() {
      return marked(this.input, { sanitize: true });
    }
  }
}
</script>

