<template id="tags">
  <div class="article__tags" :tags="tags.map(tag => tag.name)">
    <Model v-if="showModal" @close="clearAddTag" @submit="addTag">
      <h4 slot="header" class="model__title">创建标签</h4>
      <div slot="body" :class="{'model__input--error': errorMsg}">
        <input type="text" 
               class="model__input"
               v-model="newTag.name"
               @input="errorMsg = ''"
               >
        <span class="model__errorMsg" v-show="errorMsg"> {{errorMsg}} </span>
        <textarea rows="5" 
                  class="model__textarea" 
                  v-model="newTag.description"
                  ref="description"
                  ></textarea>
      </div>
      <span slot="footer"></span>
    </Model>
    <div class="tags__display">
      <ul class="tags__list">
        <li class="tag__item" v-for="(tag, index) in tags" :key="index">
          {{tag.name}}
          <span class="tag__remove" @click="removeTag(index)">&times;</span>
        </li>
      </ul>
      <div class="search">
        <input type="text" 
               :value="tagInput"
               @input="searchTags"
               @keyup="selectTag"
               @focus="showResults = true"
               class="search__input">
        <div class="search__results" v-if="showResults && tagInput">
          <ul v-if="searchResults.length">
            <li v-for="(result, index) in searchResults" 
                v-html="boldSearch(result.name, tagInput)"
                @click="addTagToList(result)"
                :key="index" 
                class="result__item"
                :class="{'result__item--active':resultSelectedIdx === index}">
            </li>
          </ul>
          <p v-else class="result__item result__item--active" @click="showAddTagModal">创建标签
            <span class="bold">{{tagInput}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import axios from 'axios';
import Model from './Model.vue';

export default {
  template: '#tags',
  components: {
    Model,
  },
  props: ['tag'],
  data() {
    return {
      showModal: false,
      showResults: false,
      errorMsg: '',
      tagInput: '',
      tags: this.tag || [],
      searchResults: [],
      newTag: {
        name: '',
        description: ''
      },
      resultSelectedIdx: -1,
    }
  },
  methods: {
    boldSearch(value, search) {
      const re = new RegExp(`^${search}`, 'gi');
      return value.replace(re, `<span class="bold">$&</span>`);
    },
    searchTags: debounce(function (e) {
      // detect
      this.tagInput = e.target.value;
      this.showResults = true;

      axios.get(`/api/search/tags?tag=${this.tagInput}`)
        .then(res => {
          this.searchResults = res.data || [];
          this.resultSelectedIdx = 0;
        })
    }, 300),
    selectTag(e) {
      // if they aren't pressing up, down or enter, who cares!
      if (![38, 40, 13].includes(e.keyCode)) {
        return;
      }

      if (e.keyCode === 40) {
        this.resultSelectedIdx = this.resultSelectedIdx >= this.searchResults.length - 1 
                                                        ? 0
                                                        : this.resultSelectedIdx + 1;
      } else if (e.keyCode === 38) {
        this.resultSelectedIdx = this.resultSelectedIdx <= 0 
                                  ? this.searchResults.length - 1
                                  : this.resultSelectedIdx - 1;
      } else if (e.keyCode === 13) {
        if (this.searchResults.length) {
          this.addTagToList(this.searchResults[this.resultSelectedIdx]);
        } else {
          this.showAddTagModal();
        }
      }
    },
    pushTag(value) {
      this.tags.push(value);
      this.tags = uniqBy(this.tags, 'name');
    },
    clearAddTag() {
      this.tagInput = '';
      this.newTag = {
        name: '',
        description: ''
      };
      this.errorMsg = '';
      this.showResults = false;
      this.showModal = false;
    },
    addTagToList(tag) {
      this.pushTag(tag);
      this.clearAddTag();
    },
    showAddTagModal() {
      this.showModal = true;
      this.newTag.name = this.tagInput;
      this.$nextTick(() => {
        this.$refs.description.focus();
      })
    },
    addTag() {
      if (!this.newTag.name) {
        return this.errorMsg = '请输入标签';
      }
      if (!this.newTag.description) {
        return this.errorMsg = '请输入描述';
      }
      axios.post('/addTag', this.newTag)
            .then(res => {
              if (res.data.status === 0) {
                this.addTagToList(this.newTag);
              } else {
                this.errorMsg = res.data.data.name;
              }
            })
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    blurHandler() {
      this.tagInput = '';
      this.showResults = false;
    },
  }
}
</script>

<style lang="scss">
.model {
  &__title {
    color: rgb(51, 51, 51);
  }
  &__input {
    display: block;
    width: 100% !important;
    line-height: 1.42858;
    color: #555;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  &__textarea {
    width: 100%;
    padding: 6px 12px;
    color: #555;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  &__errorMsg {
    position: absolute;
    padding: 2px;
    background: #f2dede;
    font-size: 12px;
    color: #a42625;
  }
}

.model__input--error {
  position: relative;
  .model__input,
  .model__textarea {
    border-color: #bb3636; 
  }
}

.model__input:focus,
.model__textarea:focus {
  outline: none;
  border: 1px solid #3b99fc !important;
  box-shadow: 0 0 3px 0px #3b99fc;
}

.article__tags .search__input {
  border: none;
  outline: none;
}

.tags__display {
  display: flex;
  flex-wrap: nowrap;
}

.tags__list {
  display: flex;
  align-items: center;
  padding-left: 5px;
}

.search {
  position: relative;
  flex: 1;
}

.search__results {
  position: absolute;
  margin-top: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 32rem;
  padding: 5px 0;
  box-shadow: 0px 6px 12px 0px rgba(0,0,0,0.18);
}
.result__item {
  list-style: none;
  color: #333;
  padding: 5px 10px;
  &--active,
  &:hover {
    background: #f5f5f5;
  }
}

.tag__item {
  display: inherit;
  list-style: none;
  color: #017e66;
  background-color: #e7f2ed;
  font-size: 13px;
  text-align: center;
  margin-right: .5rem;
  padding: 5px 8px;
}

.tag__remove {
  cursor: pointer;
  margin-left: 5px;
}
</style>

