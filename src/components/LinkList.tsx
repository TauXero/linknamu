"use client";

import { useEffect, useState } from "react";
import type { LinkItem } from "@/data/profile";
import LinkCard from "@/components/LinkCard";

function trackClick(linkId: string) {
  const body = JSON.stringify({ linkId });
  // 페이지를 떠나도 요청이 유실되지 않도록 sendBeacon 우선 사용
  if (typeof navigator.sendBeacon === "function") {
    const queued = navigator.sendBeacon("/api/click", new Blob([body], { type: "application/json" }));
    if (queued) return;
  }
  fetch("/api/click", {
    method: "POST",
    body,
    keepalive: true,
    headers: { "Content-Type": "application/json" },
  }).catch(() => {});
}

export default function LinkList({ links }: { links: LinkItem[] }) {
  // 데이터를 받기 전에는 모두 0회로 표시
  const [counts, setCounts] = useState<Record<string, number>>({});

  // 페이지가 열릴 때 모든 링크의 클릭 수를 한 번에 조회
  useEffect(() => {
    let cancelled = false;
    fetch("/api/click", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        if (cancelled || !data?.counts) return;
        const fetched = data.counts;
        // 응답 도착 전에 누른 클릭(+1)이 덮어써지지 않도록 큰 값을 유지
        setCounts((prev) => {
          const next = { ...fetched };
          for (const [id, n] of Object.entries(prev)) next[id] = Math.max(n, next[id] ?? 0);
          return next;
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = (linkId: string) => {
    trackClick(linkId);
    setCounts((prev) => ({ ...prev, [linkId]: (prev[linkId] ?? 0) + 1 }));
  };

  return (
    <ul className="mt-10 flex w-full max-w-xs flex-col gap-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard link={link} count={counts[link.id] ?? 0} onClick={() => handleClick(link.id)} />
        </li>
      ))}
    </ul>
  );
}
