<template>
    <div class="mainContent" v-if="show"></div>
    <div class="mainContent" v-else>
        <startGame />
    </div>
</template>


<script lang="ts" setup>
import {
    NCard,
    NAvatar,
    NProgress,
    NSpace,
    NTag,
    NDivider,
    NList,
    NListItem,
    NButton,
    NEllipsis, NModal,
} from "naive-ui";
import startGame from "./startGame.vue";
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

const show = ref(false);

onMounted(() => {
    invoke<boolean>("is_lol_client").then((val: boolean) => {
        if (val) {
            show.value = true;
        } else {
            onClientLaunch();
        }
    });
});

const onClientLaunch = async () => {
    const closeMessageOn = await listen<string>("initHome", () => {
        let timer = 0;
        const interval = setInterval(async () => {
            timer++;
            show.value = true;
            if (timer === 15) {
                clearInterval(interval);
                closeMessageOn();
            }
        }, 1000);
    });
};

</script>