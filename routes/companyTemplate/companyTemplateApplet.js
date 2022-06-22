/**
 * 小程序获取公司故障模板信息接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const { default: mongoose } = require('mongoose');
const { CODE } = require('../../utils/util');

router.post('/applet/template', async (ctx) => {
  try {
    const { companyId } = ctx.request.body;
    if (!companyId) {
      ctx.body = util.fail('', '参数错误', CODE.PARAM_ERROR);
      return;
    }
    const res = await CompanyTemplate.findOne({ companyId: new mongoose.Types.ObjectId(companyId), type: '2' });
    ctx.body = util.success(res ?? {});
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
