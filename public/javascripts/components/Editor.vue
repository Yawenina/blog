<template id="editor">
  <div class='editor'>
    <textarea :value="input" @input="update" class="editor__input" name="content" required></textarea>
    <Markdown class="editor__result" :input="input" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import Markdown from './Markdown.vue';

export default {
  template: '#editor',
  components: {
    Markdown
  },
  props: ['content'],
  data() {
    return {
      input: this.content || '',
    }
  },
  methods: {
    update: debounce(function(e) {
      this.input = e.target.value;
    }, 300)
  }
}
</script>

<style>
  .editor {
    display: flex;
    min-height: 60vh;
  }
  .editor__input {
    width: 50%;
    outline: none;
    resize: none;
    border: none;
    border-right: 1px solid #ccc;
    padding: 2rem;
  }
  .editor__result {
    width: 50%;
    padding: 2rem;
  }
</style>

