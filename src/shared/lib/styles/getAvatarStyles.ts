const AVATAR_COLORS = [
  "#AA47BD",
  "#7B1FA2",
  "#77919D",
  "#455A65",
  "#EC417A",
  "#C1175C",
  "#5D6AC0",
  "#0388D2",
  "#00579B",
  "#0098A7",
  "#00897B",
  "#004D40",
  "#68A039",
  "#34691E",
  "#8C6E63",
  "#5D4138",
  "#7D57C1",
  "#512DA7",
  "#EF6C00",
  "#F6511E",
  "#BE360B",
];

// Avatar의 크기와 userId를 받아 동적으로 스타일을 생성하는 함수
const getAvatarStyles = (size: number, userId: number, img: boolean) => {
  // userId가 1부터 시작한다고 가정
  const remainder = userId % AVATAR_COLORS.length;
  const colorIdx = remainder === 0 ? AVATAR_COLORS.length - 1 : remainder - 1;

  return {
    width: size ? `${size}px` : "2.5rem",
    height: size ? `${size}px` : "2.5rem",
    backgroundColor: img ? undefined : AVATAR_COLORS[colorIdx],
  };
};

export default getAvatarStyles;
