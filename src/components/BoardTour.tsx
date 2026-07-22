"use client";

import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import {
  BOARD_TOUR_STEPS,
  hasSeenBoardTour,
  markBoardTourSeen,
} from "@/lib/boardTour";

let tourRunning = false;

function buildSteps(): DriveStep[] {
  return BOARD_TOUR_STEPS.map((step) => ({
    element: step.selector,
    popover: {
      title: step.title,
      description: step.description,
      side: step.side,
      align: step.align,
    },
  }));
}

/** Start the board walkthrough. Safe to call from anywhere (e.g. the Guide button). */
export function startBoardTour() {
  if (typeof window === "undefined" || tourRunning) return;
  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const tour = driver({
    showProgress: true,
    progressText: "{{current}} of {{total}}",
    overlayColor: "#04070c",
    overlayOpacity: 0.72,
    stagePadding: 6,
    stageRadius: 10,
    smoothScroll: true,
    animate: !prefersReduced,
    allowClose: true,
    popoverClass: "chip-sense-tour",
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Done",
    steps: buildSteps(),
    onDestroyed: () => {
      tourRunning = false;
      markBoardTourSeen();
    },
  });

  tourRunning = true;
  tour.drive();
}

const REQUIRED_ANCHORS = [
  '[data-tour="map"]',
  '[data-tour="search"]',
  '[data-tour="inspector"]',
];

/**
 * Auto-starts the tour on a visitor's first board load, once the key sections
 * have mounted. Renders nothing. Marks the tour seen as soon as it starts so a
 * mid-tour refresh doesn't nag returning visitors.
 */
export function BoardTourLauncher() {
  useEffect(() => {
    if (hasSeenBoardTour()) return;

    let cancelled = false;
    let started = false;
    let timer: number | undefined;
    const deadline = Date.now() + 8000;

    const tick = () => {
      if (cancelled || started) return;
      const ready = REQUIRED_ANCHORS.every((sel) => document.querySelector(sel));
      if (ready) {
        started = true;
        markBoardTourSeen();
        startBoardTour();
        return;
      }
      if (Date.now() > deadline) return;
      timer = window.setTimeout(tick, 200);
    };

    timer = window.setTimeout(tick, 600);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
