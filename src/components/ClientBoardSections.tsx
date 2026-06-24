"use client";

import dynamic from "next/dynamic";
import { BoardLoadingPlaceholder } from "@/components/BoardLoadingPlaceholder";

export const ClientHomeDashboard = dynamic(
  () => import("@/components/HomeDashboard").then((m) => m.HomeDashboard),
  {
    ssr: false,
    loading: () => <BoardLoadingPlaceholder />,
  },
);

export const ClientResearchBoardSection = dynamic(
  () => import("@/components/ResearchBoardSection").then((m) => m.ResearchBoardSection),
  {
    ssr: false,
    loading: () => <BoardLoadingPlaceholder />,
  },
);
