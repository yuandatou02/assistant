<template>
    <div class="main bg-neutral-100 dark:bg-neutral-900">
        <dashboard />
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <navigation :cur-pos="curPos" @change-pos="gameState.navigateToPage" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dashboard from './components/dashboard.vue';
import { useRouter } from 'vue-router';
import navigation from './components/navigation.vue';
import { useMessage, MessageReactive } from "naive-ui";

const router = useRouter();
const curPos = ref(0);
const message = useMessage();

onMounted(() => {
    router.push({ name: 'home' });
});

class GameState {
    private curFlow = "None";

    // 改变底部图标
    public navigateToPage = (route: string, index: number) => {
        if (!this.preventAccess(index)) {
            const msg = index === 2 ? '选择英雄阶段，方可使用' : '选择英雄之后，才可使用';
            message.warning(msg, { duration: 2000 });
            return;
        }

        curPos.value = index;
        router.push({ name: route });
    };
    // 防止访问
    public preventAccess = (index: number) => {
        switch (index) {
            case 2:
                return this.curFlow === 'ChampSelect' || this.curFlow === 'Champion';
            case 3:
                return this.curFlow === 'ChampSelect' || this.curFlow === 'Champion';
            default:
                return true;
        }
    };
}
const gameState = new GameState();

</script>