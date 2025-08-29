"use client"

import Tag from "@/shared/ui/tag/Tag";
import TagIcon from "@/shared/assets/icons/common/tagIcon-test.svg"
import Link from "next/link";

export default function MainPage() {
  return <div>MainPage
    <Tag label="이거 태크" onRemove={()=>{console.log("제거")}}/>
    <Link href="/thread">
      <Tag label="이거 태크" icon={<TagIcon/>}/>
    </Link>

    <Tag label="이거 태크" icon={<TagIcon/>}/>
    <Tag label="이거 태크" icon={<TagIcon/>} count={17}/>

  </div>;
}

