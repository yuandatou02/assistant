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
import { onMounted, ref } from "vue";
import dashboard from "./components/dashboard.vue";
import { useRouter } from "vue-router";
import navigation from "./components/navigation.vue";
import { useMessage } from "naive-ui";
import { listen } from "@tauri-apps/api/event";
import { queryFriendInfo } from "@/lcu/aboutTeammate";
import { invoke } from "@tauri-apps/api/core";

const router = useRouter();
const curPos = ref(0);
const message = useMessage();

onMounted(() => {
    router.push({ name: "home" });
});

class GameState {
    private curFlow = "None";
    public islistenSession = false;

    // 改变页面
    public changPage = (id: string, page: string, index: number) => {
        this.curFlow = id;
        this.navigateToPage(page, index);
    };

    // 改变底部图标
    public navigateToPage = (route: string, index: number) => {
        if (!this.preventAccess(index)) {
            const msg =
                index === 2
                    ? "选择英雄阶段，方可使用"
                    : "选择英雄之后，才可使用";
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
                return (
                    this.curFlow === "ChampSelect" ||
                    this.curFlow === "Champion"
                );
            case 3:
                return (
                    this.curFlow === "ChampSelect" ||
                    this.curFlow === "Champion"
                );
            default:
                return true;
        }
    };

    public handleChampSelect = async (id: string) => {
        console.log("-----");
        //  this.changPage(id, "teammate", 2);
        this.handleFriendInfo();
    };
    // 获取队友数据
    public handleFriendInfo = () => {
        const queueId = this.queryGameInfo();
        queryFriendInfo(this.islistenSession).then((summonerInfo) => {
            // 启动选择英雄监听
            if (!this.islistenSession) {
                this.islistenSession = true;
                invoke("start_champ_select");
                if (summonerInfo.champId !== 0) {
                    //TODO: 配置符文
                    message.success("配置符文");
                }
            }
            const summonerIdList = summonerInfo.list.map(
                (summoner) => summoner.summonerId,
            );
        });
    };
    // 获取GameInfo
    private queryGameInfo = () => {
        const gameInfo = localStorage.getItem("gameInfo");
        if (gameInfo === null) {
            localStorage.setItem(
                "gameInfo",
                String(
                    JSON.stringify({
                        queueId: 420,
                        mapId: 11,
                    }),
                ),
            );
            return 420;
        } else {
            return JSON.parse(gameInfo).queueId;
        }
    };
}
const gameState = new GameState();
listen<{ messageId: string; content: string }>("clientStatus", (event) => {
    switch (event.payload.messageId) {
        case "ChampSelect":
            console.log("+++++++");
            return gameState.handleChampSelect("ChampSelect");
    }
});
</script>
