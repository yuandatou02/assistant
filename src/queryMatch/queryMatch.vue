<template>
    <div class="main bg-neutral-100 dark:bg-neutral-900">
        <div data-tauri-drag-region class="dragDiv"></div>
        <queryHeader class="h-10 mb-2" />
    </div>
</template>

<script lang="ts" setup>
import queryHeader from './components/queryHeader.vue';
</script>