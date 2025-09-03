import ArticleCard from "@/shared/ui/molecules/article-card/ArticleCard";
import mockData from "@/shared/ui/molecules/article-card/mock.json";
import StoryCard from "@/shared/ui/storycard/StoryCard";
import data from "@/shared/ui/storycard/mock.json"


export default function MainPage() {
  return (
    <div>
      <ArticleCard data={mockData} variant="large" />
      <StoryCard data={data}/>
    </div>
  );
}
