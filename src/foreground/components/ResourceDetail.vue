<template>
  <section class="resource-detail">
    <button @click="handleClose">close</button>
    <h3>{{ item.metadata.name }}</h3>
    <details>
      <summary style="cursor: pointer">
        <strong>JSON manifest</strong>
      </summary>
      <pre>{{ JSON.stringify(item, null, 2) }}</pre>
    </details>
  </section>
</template>

<script>
export default {
  props: [ 'item' ],
  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss">
.resource-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: white;
  max-width: 50vw;
  overflow: auto;
  padding: 1rem;
  background-color: var(--color-detail-background);
  box-shadow: 0 0 3px 0 var(--color-dark-cookie);

  pre {
    background-color: var(--color-glace);
    max-height: 25rem;
    overflow: auto;
    border: 1px solid black;
  }
}
</style>
