const { scrapeTikTokProduct } = require('./index');

(async () => {
  try {
    const data = await scrapeTikTokProduct('1729789070155025084');
    console.log(data);
  } catch (err) {
    console.error(err.message);
  }
})();
