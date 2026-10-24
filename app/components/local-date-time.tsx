"use client";

import { useSyncExternalStore } from "react";

function formatLocalDateTime(value: string | Date): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Waktu tidak tersedia"
    : date.toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "medium",
      });
}

export function LocalDateTime({ value }: { value: string | Date }) {
  const formatted = useSyncExternalStore(
    () => () => {},
    () => formatLocalDateTime(value),
    () => "",
  );
  const date = new Date(value);
  const dateTime = Number.isNaN(date.getTime()) ? undefined : date.toISOString();

  return (
    <time dateTime={dateTime}>
      {formatted || "Memuat waktu lokal…"}
    </time>
  );
}
