/**
 * 获取当前天气接口
 */
const router = require('koa-router')();
const { default: axios } = require('axios');
const util = require('../../utils/util');

router.post('/test/getWeather', async (ctx) => {
  try {
    console.log('------ip', ctx?.request?.ip);
    let ip = ctx?.request?.ip;
    const gdKey = '10d0f72d75258bae2bf4341ab981eda2';
    const ipResponse = await axios.get(`https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=${gdKey}`);
    console.log('------ipResponse', ipResponse?.data);
    const adcode = ipResponse?.data?.adcode;
    const weatherResponse = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&output=json&key=${gdKey}&extensions=base`,
    );
    console.log('------weatherResponse', weatherResponse?.data);
    if (weatherResponse?.data?.lives) {
      ctx.body = util.success(weatherResponse?.data?.lives[0]);
    } else {
      ctx.body = util.success({}, '');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
