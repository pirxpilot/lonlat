module.exports = {
  parseAllFloats: parseAllFloats
};

function parseAllFloats(str) {
  if (!str) {
    return;
  }
  if (Array.isArray(str)) {
    // already parsed
    return str;
  }
  return str.split(',').map(parseFloat);
}
