import { NextResponse } from "next/server";
import { getClicksCollection } from "@/lib/mongodb";
import { profile } from "@/data/profile";

export const dynamic = "force-dynamic";

const validIds = new Set(profile.links.map((link) => link.id));

const notConfigured = () =>
  NextResponse.json({ error: "MONGODB_URI가 설정되지 않았습니다." }, { status: 503 });

/** 링크 클릭 1회 기록: body { linkId } */
export async function POST(request: Request) {
  let linkId: unknown;
  try {
    ({ linkId } = await request.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof linkId !== "string" || !validIds.has(linkId)) {
    return NextResponse.json({ error: "알 수 없는 링크입니다." }, { status: 400 });
  }

  const clicks = await getClicksCollection();
  if (!clicks) return notConfigured();

  await clicks.updateOne(
    { linkId },
    { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true },
  );

  return NextResponse.json({ ok: true });
}

/** 링크별 클릭 수 조회: { counts: { [linkId]: number } } */
export async function GET() {
  const clicks = await getClicksCollection();
  if (!clicks) return notConfigured();

  const docs = await clicks.find({}, { projection: { _id: 0, linkId: 1, count: 1 } }).toArray();
  const counts = Object.fromEntries(docs.map((d) => [d.linkId, d.count]));
  return NextResponse.json({ counts });
}
