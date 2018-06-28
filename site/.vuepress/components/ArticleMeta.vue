
<template>

  <div class="article-meta">
    <p class="article-meta-title">

      If you enjoyed this article, please <a
      href="mailto:joseph@well-conditioned.com">email me</a> and let me know.
      Keep in touch by <a href="http://twitter.com/@sdbo">following me on
      Twitter</a>.

    </p>

    <p class="updated-line" v-if="updated">Last updated {{updated}}.</p>
  </div>

</template>

<style>

.article-meta {
  background-color: #f3f5f7;
  border-color: #a3a5a7;
  padding: 0.1rem 1.5rem;
  margin: 1rem 0;
}

.article-meta .updated-line {
  font-style: italic;
}

</style>

<script>
export default {
  props: {
    updated: String
  }
}
</script>
