export const rankOptions = [
  {
    label: "国服排位英雄数据",
    key: "CN",
  },
  {
    label: "韩服排位英雄数据",
    key: "KR",
  },
];

export const cnOptions = [
  {
    label: "铂金•王者",
    value: 200,
  },
  {
    label: "全部•段位",
    value: 999,
  },
  {
    label: "王者•段位",
    value: 0,
  },
  {
    label: "宗师•段位",
    value: 5,
  },
  {
    label: "大师•段位",
    value: 6,
  },
  {
    label: "钻石•段位",
    value: 10,
  },
  {
    label: "翡翠•段位",
    value: 15,
  },
  {
    label: "铂金•段位",
    value: 20,
  },
  {
    label: "黄金•段位",
    value: 30,
  },
  {
    label: "白银•段位",
    value: 40,
  },
  {
    label: "黄铜•段位",
    value: 50,
  },
  {
    label: "黑铁•段位",
    value: 80,
  },
];

export const krOptions = [
  {
    label: "翡翠•王者",
    value: 2,
  },
  {
    label: "钻石•王者",
    value: 13,
  },
  {
    label: "大师•王者",
    value: 3,
  },
  {
    label: "青铜•铂金",
    value: 1,
  },
];

export const positionOptions = [
  {
    label: "上路",
    key: "top",
  },
  {
    label: "打野",
    key: "jungle",
  },
  {
    label: "中路",
    key: "mid",
  },
  {
    label: "射手",
    key: "bottom",
  },
  {
    label: "辅助",
    key: "support",
  },
];

export const getLocalDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1); // 昨天
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return Number(`${year}${month}${day}`);
};
