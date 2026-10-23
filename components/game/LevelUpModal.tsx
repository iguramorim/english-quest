"use client";

import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LevelUpInfo } from "@/hooks/use-game";

export function LevelUpModal({
  info,
  onClose,
}: {
  info: LevelUpInfo | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!info} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideClose className="text-center border-amber-400/60">
        {info && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="flex flex-col items-center gap-3 py-2"
          >
            <motion.span
              className="text-5xl"
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🎉
            </motion.span>
            <p className="text-sm font-semibold text-amber-300">Level Up!</p>
            <p className="font-display text-2xl font-bold">
              Level {info.from} → Level {info.to}
            </p>
            <p className="text-sm text-parchment-100/70">
              {info.fromTitle} → <span className="text-parchment-50 font-semibold">{info.toTitle}</span>
            </p>
            <p className="mt-1 text-sm italic text-parchment-100/60">
              &ldquo;You&apos;re becoming a better English speaker!&rdquo;
            </p>
            <Button className="mt-2" onClick={onClose}>
              Keep exploring
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
