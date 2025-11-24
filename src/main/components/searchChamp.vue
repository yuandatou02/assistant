<template>
    <n-auto-complete size="small" :clear-after-select="true" v-model:value="inputValue" spellcheck="false"
        placeholder="请输入你想查询的英雄" @select="selectFunction" style="width: 162px;" :render-label="renderLabel"
        :options="autoOptions" />
    <n-button size="small" secondary type="info" @click.prevent="handleButton">搜索</n-button>
</template>


<script lang="ts" setup>
import { keywordsList } from "@/resources/champList";
import { NAutoComplete, NAvatar, NButton, type SelectOption } from "naive-ui";
import { computed, h, ref, type VNodeChild } from "vue";

const inputValue = ref("");
// 渲染提示框
const renderLabel = (option: SelectOption): VNodeChild => [
    h("div", { style: "display: flex; align-items: center;" }, [
        h(NAvatar, {
            style: "margin-right: 8px;",
            size: 24,
            round: false,
            src: `https://game.gtimg.cn/images/lol/act/img/champion/${option.value}.png`
        }),
        option.label as string
    ])
];

// 生成输入框渲染提示选项
const autoOptions = computed<SelectOption[]>(() => {
    if (inputValue.value === '' || inputValue.value === null) return [];
    const keyword = inputValue.value.toLowerCase();
    const renderList = keywordsList.filter((item) => item.keywords.toLowerCase().includes(keyword)).slice(0, 5);
    console.log(renderList);

    return renderList.map((champ) => {
        return {
            value: champ.alias,
            label: champ.name
        };
    });
});

const emit = defineEmits(["selectFunction"]);

const selectFunction = (value: string) => {
    emit("selectFunction", value);
};

const handleButton = () => {
    if (autoOptions.value?.length) {
        selectFunction(autoOptions.value[0].value);
    } else {
        selectFunction(inputValue.value);
    }
};
</script>