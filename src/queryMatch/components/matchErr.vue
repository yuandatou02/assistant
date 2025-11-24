<template>
    <div class="w-full h-full flex justify-center items-center">
        <n-result size="large" status="500" title="查询战绩数据失败" description="或许这与英雄联盟服务器有关">
            <template #footer>
                <n-button type="error" @click.prevent="reload">重新加载</n-button>
            </template>
        </n-result>
    </div>
</template>

<script lang="ts" setup>
import { NResult, NButton } from "naive-ui";

const emit = defineEmits(["reload"]);

const reload = () => {
    emit("reload");
};
</script>