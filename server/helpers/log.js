module.exports = (...args) => {
  const now = new Date();
  console.log(now.toLocaleString() + ":\t", ...args);
}