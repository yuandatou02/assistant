<template>
    <div class="navDiv bg-white shadow dark:bg-zinc-900">
        <div class="flex w-full justify-between mx-2">
            <n-icon class=" transition! cursor-pointer! dark:text-slate-100" v-for="item in icons" :key="item.index"
                size="26" :color="curPos === item.index ? iconColor[0] : iconColor[1]"
                @click.prevent="changePos(item.route, item.index)">
                <component :is="item.icon" />
            </n-icon>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { NIcon } from "naive-ui";
import { HomeOutline, ListSharp, FileTrayStackedOutline, BookmarksOutline, SkullOutline } from "@vicons/ionicons5";

defineProps<{ curPos: number; }>();

const icons = [
    { icon: HomeOutline, index: 0, route: 'home' },
    { icon: ListSharp, index: 1, route: 'rank' },
    { icon: SkullOutline, index: 2, route: 'teammate' },
    { icon: FileTrayStackedOutline, index: 3, route: 'rune' },
    { icon: BookmarksOutline, index: 4, route: 'record' },
];

const iconColor = localStorage.getItem('theme') !== 'dark' ? ['#18a058', ''] : ["#63e2b7", "#f1f5f9"];

const emit = defineEmits(['changePos']);

const changePos = (route: string, index: number) => {
    emit('changePos', route, index);
}

</script>