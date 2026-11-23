import type { LinkItem } from "@/data/profile";

type Props = {
  link: LinkItem;
  count: number;
  onClick: () => void;
};

export default function LinkCard({ link, count, onClick }: Props) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="relative block w-full rounded-2xl border border-neutral-200 bg-white px-14 py-4 text-center font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      {link.title}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-normal tabular-nums text-neutral-400 dark:text-neutral-500">
        {count.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
