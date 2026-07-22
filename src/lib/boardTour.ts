export const BOARD_TOUR_STORAGE_KEY = "chip-sense.tour.v1";

export type BoardTourStep = {
  /** CSS selector for the element to spotlight. Omit for a centered intro card. */
  selector?: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

/**
 * Ordered walkthrough of the board. Each step points at a `data-tour` anchor so
 * the tour stays decoupled from styling. Copy is intentionally short and plain —
 * the goal is orientation, not documentation.
 */
export const BOARD_TOUR_STEPS: BoardTourStep[] = [
  {
    title: "Welcome to Chip Sense",
    description:
      "A live map of the semiconductor supply chain — the companies, fabs, and relationships behind modern chips. Here's a quick 30-second tour. You can skip anytime.",
  },
  {
    selector: '[data-tour="map"]',
    title: "The map",
    description:
      "Each pin is a company HQ, fab, or country. Colored lines are supply relationships (who supplies whom), not shipping routes. Hover a pin for a quick card; click it for full detail and sources.",
    side: "top",
    align: "center",
  },
  {
    selector: '[data-tour="lenses"]',
    title: "Industry lenses",
    description:
      "Narrow everything to one story — memory, CPUs, GPUs, or data centers. \u201CAll\u201D shows the full picture.",
    side: "bottom",
    align: "start",
  },
  {
    selector: '[data-tour="search"]',
    title: "Find anything",
    description:
      "Search for any company, fab, or country and jump straight to it — no panning or zooming required.",
    side: "bottom",
    align: "start",
  },
  {
    selector: '[data-tour="scenario"]',
    title: "Stress scenarios",
    description:
      "Pick a scenario — like a Taiwan Strait disruption — and the map restyles to show chokepoints and affected links. These are illustrative stress tests, not forecasts.",
    side: "bottom",
    align: "center",
  },
  {
    selector: '[data-tour="layers"]',
    title: "Layers & filters",
    description:
      "Choose which relationship types and trade flows appear, focus on visible connections, or switch to the core supply-chain view.",
    side: "bottom",
    align: "end",
  },
  {
    selector: '[data-tour="inspector"]',
    title: "The detail panel",
    description:
      "Everything you select shows up here — company profiles under Selection, the full registry under Browse, scenario assumptions under Scenario, and cited sources under Links.",
    side: "left",
    align: "start",
  },
  {
    selector: '[data-tour="quickstart"]',
    title: "Not sure where to start?",
    description:
      "These one-click starting points jump you straight into a scenario, an industry lens, or a key company like TSMC — a good way to see the board in action.",
    side: "left",
    align: "start",
  },
  {
    selector: '[data-tour="guide"]',
    title: "You're set",
    description:
      "That's the tour. Reopen it anytime from Guide. The buttons beside it let you copy a shareable link to the current view or export the map as an image.",
    side: "bottom",
    align: "end",
  },
];

export function hasSeenBoardTour(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(BOARD_TOUR_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markBoardTourSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOARD_TOUR_STORAGE_KEY, "1");
  } catch {
    /* ignore private-mode / disabled storage */
  }
}
