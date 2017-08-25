<template id="model">
  <div class="model-wrapper">
    <div class="model">
      <div class="model__header">
        <slot name="header">Model Header</slot>
        <button class="model__btn model__btn--close" @click="$emit('close')">&times;</button>
      </div>
      <div class="model__body">
        <slot name="body">Model Body</slot>
      </div>
      <div class="model__footer">
        <slot name="footer">Model footer</slot>
        <button class="model__btn model__btn--cancel" @click="$emit('close')">取消</button>
        <button class="model__btn model__btn--submit" @click="$emit('addTag')">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  template: '#model'
}
</script>

<style lang="scss">
.model-wrapper {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.model {
  width: 50%;
  border-radius: 6px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  background: #fff;
  &__header {
    background-color: #f3f3f3;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__body {
    padding: 15px;
  }
  &__footer {
    padding: 15px;
    text-align: right;
  }
  &__btn {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 4px;
    &--close {
      background: transparent;
      font-size: 16px;
      padding: 0;
    }
    &--cancel {
      background: #fff;
      border-color: #ccc;
    }
    &--submit {
      background: #009a61;
      border-color: #008151;
      color: #fff;
    }
  }

}
</style>


