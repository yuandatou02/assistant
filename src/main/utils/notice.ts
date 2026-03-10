import type { NoticeTypes } from "@/main/types/notice";
import { requestFetch } from "@/main/utils/request.ts";
import { h } from "vue";
import { useDialog } from "naive-ui";

declare const __APP_VERSION__: string;

export class Notice {
  private url = "https://frank-notice-1302853015.cos.ap-chongqing.myqcloud.com/frankRust.json";
  private notice: null | NoticeTypes = null;
  private dialog = useDialog();
  init = async () => {
    const timestamp = new Date().getTime();
    const res = await requestFetch<NoticeTypes>(this.url + `?date=${timestamp}`, "GET");

    if (res === null) {
      return false;
    }
    this.notice = res as NoticeTypes;

    localStorage.setItem("rankVersion", this.notice.rankVersion);
    if (!this.notice.isShow) {
      this.showUpdate(this.notice.version);
      return false;
    } else if (localStorage.getItem("oldNoticeId") === this.notice.noticeId) {
      return true;
    } else {
      localStorage.setItem("noticeId", this.notice.noticeId);
      this.showDialog(false);
      return true;
    }
  };

  private showUpdate(latestVersion: string) {
    if (latestVersion === __APP_VERSION__) return;
    this.showDialog(true);
  }

  public showDialog(isVer?: boolean) {
    const notice = this.notice as NoticeTypes;
    const versionInfo = `当前版本${__APP_VERSION__}，最新版本[ ${this.notice?.version} ↑]  请立即更新，获取最佳体验！`;

    const contentVNode = () => {
      const content = isVer ? versionInfo + notice.content : notice.content;
      const textList = content.split("/n");
      return textList.map((text: string) => {
        return h("p", [text]);
      });
    };

    this.dialog[notice.type]({
      title: isVer ? "版本更新" : "新的通知",
      content: contentVNode,
      showIcon: true,
      maskClosable: true,
      closable: false,
      autoFocus: false,
      style: "margin:8px;max-width:334px",
      positiveText: isVer ? "点击下载" : notice.buttonContent,
      negativeText: isVer ? "推荐更新" : "不再提醒",
      onPositiveClick: () => {
        open(notice.url);
      },
      onNegativeClick: () => {
        localStorage.setItem("oldNoticeId", notice.noticeId);
      },
    });
  }
}
