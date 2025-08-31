<<<<<<< HEAD
"use client"

import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import * as S from "@/shared//ui/dropdown/Dropdown.css";

export default function MainPage() {
  return <div>MainPage
<div style={{width:100}}>

        <Dropdown>
      <Dropdown.Trigger>
            <Dropdown.Value>
          {({ selectedOption }) =>
            selectedOption ? (selectedOption) : "으어"
          }
        </Dropdown.Value>
        <Dropdown.Icon side="right"/>
      </Dropdown.Trigger>
      <Dropdown.Menu className="S.">

        <Dropdown.Option optionId={1}>
          OPTION1
        </Dropdown.Option>
                <Dropdown.Option optionId={2}>
          OPTION2
        </Dropdown.Option>
                <Dropdown.Option optionId={3}>
          OPTION3
        </Dropdown.Option>
      </Dropdown.Menu>
    </Dropdown>
    </div>
  </div>;
=======
import ArticleCard from "@/shared/ui/molecules/article-card/ArticleCard";
import mockData from "@/shared/ui/molecules/article-card/mock.json";

export default function MainPage() {
  return (
    <div>
      <ArticleCard data={mockData} variant="large" />
    </div>
  );
>>>>>>> develop
}

