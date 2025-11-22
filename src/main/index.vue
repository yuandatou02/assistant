<template>
    <div class="main bg-neutral-100 dark:bg-neutral-900">
        <dashboard />
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import dashboard from './components/dashboard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
    router.push({ name: 'home' });
});
</script>