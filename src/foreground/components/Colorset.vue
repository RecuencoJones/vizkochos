<template>
  <div class="colorset">
    <div class="color color--font" :title="$t('tooltip.text')">T</div>
    <div class="color color--background" :title="$t('tooltip.background')">B</div>
    <div class="color color--link" :title="$t('tooltip.link')">L</div>
    <div class="color color--highlight" :title="$t('tooltip.highlight')">H</div>
  </div>
</template>

<style lang="scss">
.colorset {
  display: flex;
  flex-direction: row;
  align-self: center;

  .color {
    flex: 0 0 auto;
    width: 1rem;
    padding: .25rem;
    text-align: center;
    border: 1px solid var(--color-outline);
  }

  .color--font {
    color: var(--color-main-background);
    background-color: var(--color-main-text);
  }

  .color--background {
    color: var(--color-header-link);
    background-color: var(--color-header-background);
  }

  .color--link {
    color: var(--color-sidebar-background);
    background-color: var(--color-sidebar-link);
  }

  .color--highlight {
    color: var(--color-detail-data-hightlight-text);
    background-color: var(--color-detail-data-hightlight-background);
  }
}
</style>
