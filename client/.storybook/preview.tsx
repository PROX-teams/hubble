import React, { useEffect } from "react";
import type { Preview } from "@storybook/nextjs";
import "../src/shared/styles/global.css";
import { lightTheme, darkTheme } from "../src/shared/styles/theme.css";

const preview: Preview = {
  globalTypes: {
    // 테마 값 툴바 설정
    theme: {
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark Mode" },
          { value: "light", title: "Light Mode" },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    // 스토리 내 커스텀 배경색 설정
    backgrounds: {
      default: "dark",
      values: [
        { name: "light", value: "#fff" },
        { name: "dark", value: "#171717" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story, context) => {
      // 툴바에서 선택된 테마 값 가져오기
      const { theme } = context.globals;

      // 테마 값에 따라 테마 클래스와 배경색 설정
      const themeClass = theme === "dark" ? darkTheme : lightTheme;
      const backgroundColor = theme === "dark" ? "#171717" : "#fff";

      // 테마가 바뀔 때마다 배경색 변경
      useEffect(() => {
        const previewBody = document.querySelector("body");
        if (previewBody) {
          previewBody.style.backgroundColor = backgroundColor;
        }
      }, [theme]);

      return (
        <div className={themeClass}>
          <Story {...context} />
        </div>
      );
    },
  ],
};

export default preview;
