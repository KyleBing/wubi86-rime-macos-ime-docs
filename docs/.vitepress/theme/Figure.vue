<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  src: string
  alt: string
  caption?: string
}>()
</script>

<template>
  <figure class="figure">
    <img :src="withBase(src)" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
