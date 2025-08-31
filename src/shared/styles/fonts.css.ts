import { createThemeContract, globalFontFace } from "@vanilla-extract/css";

globalFontFace("Pretendard", {
  src: 'url(/fonts/Pretendard-Regular.woff2) format("woff2")',
});

export const fontVars = createThemeContract({
  size: {
    h1: null,
    h2: null,
    h3: null,
    h4: null,
    h5: null,
    t1: null,
    t2: null,
    b1: null,
    b2: null,
    b3: null,
    cap1: null,
    cap2: null,
    m1: null,
    m2: null,
    m3: null,
    m4: null,
    m5: null,
  },
  weight: {
    bd: null,
    sb: null,
    md: null,
    rg: null,
  },
  lineHeight: {
    base130: null,
    base140: null,
    base160: null,
    base180: null,
  },
  letterSpacing: {
    tight: null,
  },
});

export const font = {
  size: {
    h1: "1.75rem", // 28px
    h2: "1.5rem", // 24px
    h3: "1.25rem", // 20px
    h4: "1.125rem", // 18px
    h5: "1rem", // 16px
    t1: "0.9375rem", // 15px
    t2: "0.875rem", // 14px
    b1: "0.875rem", // 14px
    b2: "0.8125rem", // 13px
    b3: "0.75rem", // 12px
    cap1: "0.8125rem", // 13px
    cap2: "0.75rem", // 12px
    cap3: "0.6875rem", // 11px
    m1: "2.25rem", // 36px
    m2: "1.875rem", // 30px
    m3: "1.5rem", // 24px
    m4: "1.25rem", // 20px
    m5: "1.06rem", // 17px
  },
  weight: {
    bd: 700,
    sb: 600,
    md: 500,
    rg: 400,
  },
  lineHeight: {
    base130: "130%",
    base140: "140%",
    base160: "160%",
    base170: "170%",
    base180: "180%",
  },
  letterSpacing: {
    base: "-0.02em",
  },
};
