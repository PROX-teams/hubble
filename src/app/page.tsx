"use client"

import { Dropdown } from "@/shared/ui/dropdown/Dropdown";

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
        <Dropdown.Icon/>
      </Dropdown.Trigger>
      <Dropdown.Menu >

        <Dropdown.Option optionId={1}>
          OPTION1ㅇㅈㅇㅈㅇㄹㄷㄹㄷ
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
}
