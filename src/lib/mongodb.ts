import mongoose from "mongoose";
import dns from "dns";
import { promisify } from "util";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// On Windows, the local DNS resolver refuses SRV queries. The mongodb driver
// uses its own c-ares binding that ignores dns.setServers(), so we resolve
// the SRV record ourselves via Node's dns module (which does respect setServers)
// and hand mongoose a plain mongodb:// URI. Production (Linux) skips this entirely.
async function resolveMongoUri(uri: string): Promise<string> {
  if (process.platform !== "win32") return uri;
  if (!uri.startsWith("mongodb+srv://")) return uri;
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    const resolveSrv = promisify(dns.resolveSrv);
    const resolveTxt = promisify(dns.resolveTxt);
    const url = new URL(uri);
    const hostname = url.hostname;
    const [srvRecords, txtRecords] = await Promise.all([
      resolveSrv(`_mongodb._tcp.${hostname}`),
      resolveTxt(hostname).catch(() => [] as string[][]),
    ]);
    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");
    const txtOptions = (txtRecords as string[][]).flat().join("&");
    const auth = url.username
      ? `${encodeURIComponent(url.username)}:${encodeURIComponent(url.password)}@`
      : "";
    const qs = [txtOptions, url.search.replace(/^\?/, ""), "tls=true"]
      .filter(Boolean)
      .join("&");
    return `mongodb://${auth}${hosts}${url.pathname}?${qs}`;
  } catch (e) {
    console.warn("[mongodb] SRV resolve failed, using original URI:", e);
    return uri;
  }
}

declare global {
  var __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = await resolveMongoUri(MONGODB_URI);
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
