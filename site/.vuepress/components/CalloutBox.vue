
<template>

  <div class="callout-box">
    <p class="callout-box-title" v-if="title">{{ title }}</p>
    <slot></slot>
  </div>

</template>

<style>

.callout-box {
  background-color: #f3f5f7;
  border-color: #a3a5a7;
  padding: 0.1rem 1.5rem;
  margin: 1rem 0;
}

.callout-box .callout-box-title {
  font-weight: 600;
  margin-bottom: -0.4rem;
}

</style>

<script>
export default {
  props: {
    title: String
  }
}
</script>
