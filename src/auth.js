module.exports = function requireApiKey(req, res) {
  const envKey = process.env.API_KEY;
  // If no API_KEY is configured, skip auth (e.g. in tests or before you enable it)
  if (!envKey) {
    return true;
  }

  // Read the key from header (you could also support a query‐param fallback here)
  const supplied = req.headers['x-api-key'];

  if (supplied !== envKey) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return false;
  }

  return true;
};