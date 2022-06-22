/**
 * 获取每日毒鸡汤接口
 */
const router = require('koa-router')();
const TaintedChicken = require('../../models/taintedChickenSchema');
const util = require('../../utils/util');
const { default: axios } = require('axios');

router.prefix('/taintedChicken');

router.post('/getOne', async (ctx) => {
  try {
    const du = await axios.get('https://api.shadiao.app/du');
    const { text } = du?.data?.data;
    let res;
    if (text) {
      res = await TaintedChicken.findOneAndUpdate({ text }, { $set: { text } }, { upsert: true, new: true });
    } else {
      res = await TaintedChicken.aggregate().sample(1);
    }

    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
