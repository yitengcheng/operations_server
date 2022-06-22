/**
 * 微信urlLink接口
 */
const router = require('koa-router')();
const { default: axios } = require('axios');
const util = require('../../utils/util');

router.post('/test/wechatUrlLink', async (ctx) => {
  try {
    const {} = ctx.request.body;
    const getTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf40490ad0fe3246b&secret=fb186bd9419d53e191f9997b5af4190a';
    const response = await axios.get(getTokenUrl);
    const { access_token } = response.data;
    const getUrlLink = `https://api.weixin.qq.com/wxa/generatescheme?access_token=${access_token}`;
    const res = await axios.post(getUrlLink);
    if (res?.data?.openlink) {
      ctx.body = util.success({ url: res?.data?.openlink });
    } else {
      ctx.body = util.fail({}, '链接生成失败，请稍后重新进入');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
