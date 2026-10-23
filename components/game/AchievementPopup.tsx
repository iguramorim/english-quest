"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewAchievementInfo } from "@/hooks/use-game";

export function AchievementPopup({
  achievement,
  onDismiss,
}: {
  achievement: NewAchievementInfo | null;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    if (!achievement) return;
    const t = window.setTimeout(onDismiss, 3600);
    return () => window.clearTimeout(t);
  }, [achievement, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {achievement && (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl2 border border-amber-400 bg-ink-900 px-5 py-3 shadow-panel"
            role="status"
          >
            <span className="text-3xl">{achievement.emoji}</span>
            <div>
              <p className="text-xs text-amber-300">Achievement unlocked</p>
              <p className="font-display font-semibold">{achievement.title}</p>
              <p className="text-xs text-parchment-100/60">{achievement.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
