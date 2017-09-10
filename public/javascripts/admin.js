import Vue from 'vue';
import axios from 'axios';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

import Editor from './components/Editor.vue';
import TagsInput from './components/TagsInput.vue';

import '../sass/admin.scss';

new Vue({
  el: '.content',
  components: {
    Editor,
    TagsInput,
  },
});

function articleContent() {
  const form = document.forms.articleForm;
  const children = form.elements;
  const title = children.title.value;
  const content = children.content.value;

  if (!title) {
    swal('请输入标题！', '标题不能为空哦🙅‍', 'error');
    return false;
  }

  if (!content) {
    swal('请输入内容！', '内容不能为空哦🙅‍', 'error');
    return false;
  }

  let tags = document
    .querySelector('.article__tags')
    .getAttribute('tags');
  tags = tags.trim() === ''
    ? []
    : tags.split(',');
  const category = children.category.value;

  return {
    title,
    tags,
    category,
    content,
  };
}

function postArticle(e) {
  e.preventDefault();
  const article = articleContent();
  if (!article) {
    return;
  }
  const form = document.forms.articleForm;
  axios
    .post(form.action, article)
    .then((res) => {
      if (res.data.status === 1) {
        swal(res.data.text, '跳转到文章中...', 'success');
        setTimeout(() => {
          window.location.href = res.data.link;
        }, 1200);
        return false;
      } else {
        swal(res.data.text, '', 'error');
      }
    });
}

const publishBtn = document.querySelector('.btn--publish');
if (publishBtn) {
  publishBtn.addEventListener('click', postArticle);
}
