export function memoryBucket() {
  const records = new Map();
  let revision = 0;
  return {
    async get(key) {
      const entry = records.get(key);
      return entry && { etag: entry.etag, json: async () => JSON.parse(entry.value) };
    },
    async put(key, value, { onlyIf } = {}) {
      const current = records.get(key);
      if (onlyIf instanceof Headers && onlyIf.get('If-None-Match') === '*' && current) return null;
      if (onlyIf?.etagMatches && onlyIf.etagMatches !== current?.etag) return null;
      const entry = { value, etag: String(++revision) };
      records.set(key, entry);
      return entry;
    },
  };
}
