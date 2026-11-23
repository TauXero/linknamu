import { MongoClient } from "mongodb";

declare global {
  // 개발 모드 HMR 시 연결이 중복 생성되지 않도록 전역에 캐시
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

/** MONGODB_URI가 설정되지 않았으면 null을 반환합니다. */
function getMongoClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return clientPromise;
}

export type ClickDoc = { linkId: string; count: number; updatedAt: Date };

export async function getClicksCollection() {
  const promise = getMongoClient();
  if (!promise) return null;
  const client = await promise;
  return client.db(process.env.MONGODB_DB ?? "linknamu").collection<ClickDoc>("clicks");
}

/** 링크별 클릭 수 맵. DB 미설정·연결 실패 시 null (페이지 렌더링은 계속되도록). */
export async function getClickCounts(): Promise<Record<string, number> | null> {
  try {
    const clicks = await getClicksCollection();
    if (!clicks) return null;
    const docs = await clicks.find({}, { projection: { _id: 0, linkId: 1, count: 1 } }).toArray();
    return Object.fromEntries(docs.map((d) => [d.linkId, d.count]));
  } catch (error) {
    console.error("[mongodb] 클릭 수 조회 실패:", error);
    return null;
  }
}
