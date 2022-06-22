/**
 * 注册接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');

router.post('/user/reigist', async (ctx) => {
  try {
    ctx.body = util.success();
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
