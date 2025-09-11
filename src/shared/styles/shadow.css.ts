import { createGlobalTheme } from "@vanilla-extract/css";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

const boxShadows = createGlobalTheme(":root", {
  dropdown100: "0 0 8px 0 rgba(0, 0, 0, 0.07)",
  dropdown200: "0 0 12px 0 rgba(0, 0, 0, 0.07)",
  modal:
    "0 0 0 1px rgba(84, 72, 49, 0.1), 0 4px 12px -1px rgba(0,0,0,0.12), 0 20px 48px -8px rgba(17,17,17,0.24)",
  toggle: "0 1px 6px 0 rgba(0, 0, 0, 0.06), 0 2px 1px 0 rgba(0, 0, 0, 0.04)",
  cardNote: "0 1px 6px 0 rgba(0, 0, 0, 0.04)",
  toolTip: "0 2px 8px 0 rgba(0, 0, 0, 0.24), 0 2px 1px 0 rgba(0, 0, 0, 0.06)",
  sidebar: "-2px 0 4px 0 rgba(0, 0, 0, 0.1), -6px 0 22px 0 rgba(0, 0, 0, 0.24)",
});

const sprinkles = defineProperties({
  properties: {
    boxShadow: {
      dropdown100: boxShadows.dropdown100,
      dropdown200: boxShadows.dropdown200,
      modal: boxShadows.modal,
      toggle: boxShadows.toggle,
      cardNote: boxShadows.cardNote,
      toolTip: boxShadows.toolTip,
      sidebar: boxShadows.sidebar,
    },
  },
});

export const shadowSprinkles = createSprinkles(sprinkles);
