import clsx from "clsx";
import { useContext } from "react";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import AlarmIcon from "@/shared/assets/icons/alarm/alarm.svg";
import * as S from "./AlarmDropdownTrigger.css";

export default function AlarmDropdownTrigger() {
  const { isBoxOpen, toggleBoxOpen } = useContext(DropdownContext);

  const handleClick = () => {
    toggleBoxOpen();
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(S.button, { [S.active]: isBoxOpen })}
    >
      <AlarmIcon className={S.icon} />
      알림
    </button>
  );
}
