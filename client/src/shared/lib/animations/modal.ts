import { easeIn, easeInOut } from "framer-motion";

export const modalVariants = {
  hidden: {
    transform: "scale(0.4)",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: easeIn,
    },
  },
  visible: {
    transform: ["scale(0.7)", "scale(1.06)", "scale(1)"],
    opacity: 1,
    transition: {
      transform: {
        duration: 0.4,
        ease: easeInOut,
        times: [0, 0.9, 1],
      },
      opacity: {
        duration: 0.2,
        ease: easeIn,
      },
    },
  },
};
