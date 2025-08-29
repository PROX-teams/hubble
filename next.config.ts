import type { NextConfig } from "next";

const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        "@svgr/webpack",
        // svg 생성 시 fill, stroke 속성을 자동으로 currentColor로 설정 (현재 오류로 임시 주석 처리)
        // {
        //   loader: "@svgr/webpack",
        //   options: {
        //     svgoConfig: {
        //       plugins: [
        //         {
        //           name: "preset-default",
        //           params: {
        //             overrides: {
        //               convertColors: {
        //                 currentColor: true,
        //               },
        //             },
        //           },
        //         },
        //       ],
        //     },
        //   },
        // },
      ],
    });
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

module.exports = withVanillaExtract(nextConfig);
