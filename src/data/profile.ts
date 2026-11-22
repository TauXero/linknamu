export type LinkItem = {
  /** 클릭 수 집계에 사용되는 고유 ID (변경하면 집계가 초기화됩니다) */
  id: string;
  title: string;
  url: string;
};

export type Profile = {
  name: string;
  bio: string;
  image: string;
  links: LinkItem[];
};

// TODO: 보여주기용 더미 값입니다. 나중에 실제 프로필/링크로 교체하세요.
export const profile: Profile = {
  name: "김클로",
  bio: "세계최강 바이브 코더",
  image: "/profile.svg",
  links: [
    { id: "link-1", title: "GitHub", url: "https://example.com/github" },
    { id: "link-2", title: "블로그", url: "https://example.com/blog" },
    { id: "link-3", title: "Instagram", url: "https://example.com/instagram" },
  ],
};
