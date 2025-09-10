"use client";

import ArticleCard from "@/shared/ui/article-card/ArticleCard";
import mockData from "@/shared/ui/article-card/mock.json";
import Tag from "@/shared/ui/tag/Tag";
import TagIcon from "@/shared/assets/icons/common/tagIcon-test.svg";

export default function MainPage() {
  return (
    <div>
      <ArticleCard data={mockData} variant="large" />
      <Tag
        icon={<TagIcon />}
        label={"CSS"}
        onRemove={() => {
          ("");
        }}
      />
    </div>
  );
}
