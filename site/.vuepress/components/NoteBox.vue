
<template>

  <div class="note custom-block">
    <p v-if="title" class="custom-block-title">{{ title }}</p>
    <slot></slot>
  </div>

</template>

<style>

.custom-block.note {
  background-color: #f3f5f7;
  border-color: #a3a5a7;
}

.custom-block.note {
    padding: 0.1rem 1.5rem;
    border-left-width: 0.5rem;
    border-left-style: solid;
    margin: 1rem 0;
}

</style>

<script>
export default {
  props: {
    title: String
  }
}
</script>
