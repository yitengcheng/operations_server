/**
 * 获取属于我的故障工单统计
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/fault/myreport', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    if (!companyTemplate) {
      ctx.body = util.success({ cc: 0, create: 0, handle: 0 });
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const cc = await faultModule.countDocuments({ cc: user._id, status: 1 });
    const assist = await faultModule.countDocuments({ assistUser: user._id, status: 1 });
    const create = await faultModule.countDocuments({ reportUser: user._id, status: 1 });
    const handle = await faultModule.countDocuments({ dispose: user._id, status: 1 });
    ctx.body = util.success({ cc, create, handle, assist });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
