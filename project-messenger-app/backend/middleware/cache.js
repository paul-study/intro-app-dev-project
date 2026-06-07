const cacheStore = new Map();

const makeCacheKey = (req) => {
  const path = req.originalUrl || req.url;
  return `${req.method}:${path}`;
};
export const clearCacheStore = () => {
  cacheStore.clear();
};

export const cacheGet = (req, res, next) => {
  const key = makeCacheKey(req);
  const cached = cacheStore.get(key);

  if (cached && Date.now() < cached.expiresAt) {
    return res.status(cached.status).json(cached.body);
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    cacheStore.set(key, {
      status: res.statusCode,
      body,
      expiresAt: Date.now() + 30_000,
    });
    return originalJson(body);
  };

  next();
};

export const clearCache = (req, res, next) => {
  cacheStore.clear();
  next();
};

export default { cacheGet, clearCache, clearCacheStore };