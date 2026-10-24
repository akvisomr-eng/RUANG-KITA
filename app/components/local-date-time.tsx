"use client";

import { useEffect, useState } from "react";

export function LocalDateTime({ value }: { value: string | Date }) {
  const [formatted, setFormatted] = useState("");
  useEffect(() => {
    const date = new Date(value);
    setFormatted(Number.isNaN(date.getTime()) ? "Waktu tidak tersedia" : date.toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "medium",
    }));
  }, [value]);

  return <time dateTime={new Date(value).toISOString()}>{formatted || "Memuat waktu lokal…"}</time>;
}
