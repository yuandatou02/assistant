export interface NoticeTypes {
  isShow: boolean;
  type: "create" | "error" | "info" | "success" | "warning";
  content: string;
  isButton: boolean;
  buttonContent: string;
  url: string;
  rankVersion: string;
  version: string;
  noticeId: string;
}
