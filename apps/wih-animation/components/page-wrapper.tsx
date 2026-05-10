"use client";
import { type HTMLMotionProps, motion } from "motion/react";

export const PageWrapper = (props: HTMLMotionProps<"div">) => (
  <div className="bg-white">
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ delay: 1 }}
      {...props}
    />
  </div>
);
