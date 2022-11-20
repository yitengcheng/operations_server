/**
 * 获取当前天气接口
 */
const router = require('koa-router')();
const { default: axios } = require('axios');
const util = require('../../utils/util');

router.post('/test/getWeather', async (ctx) => {
  try {
    const { ip } = ctx.request.body;
    const gdKey = '10d0f72d75258bae2bf4341ab981eda2';
    const ipResponse = await axios.get(`https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=${gdKey}`);
    const adcode = ipResponse?.data?.adcode;
    const weatherResponse = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${adcode}&output=json&key=${gdKey}&extensions=base`,
    );
    if (weatherResponse?.data?.lives) {
      ctx.body = util.success(weatherResponse?.data?.lives[0]);
    } else {
      ctx.body = util.fail({}, '天气查询失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;