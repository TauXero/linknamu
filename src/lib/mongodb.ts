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
