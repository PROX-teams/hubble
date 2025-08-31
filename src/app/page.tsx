import ArticleCard from "@/shared/ui/molecules/article-card/ArticleCard";
import mockData from "@/shared/ui/molecules/article-card/mock.json";

export default function MainPage() {
  return (
    <div>
      <ArticleCard data={mockData} variant="large" />
    </div>
  );
}
