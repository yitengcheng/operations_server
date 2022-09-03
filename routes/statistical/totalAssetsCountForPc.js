/**
 * 资产总数接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/statistical/totalAssetsCount', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    if (!assetsTemplate) {
      ctx.body = util.fail('', '请先在手机端设置资产模板');
      return;
    }
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    let assetTotal;
    if (user?.roleId) {
      assetTotal = await assetsModule.countDocuments();
    } else {
      assetTotal = await assetsModule.countDocuments({ customerId: user?._id });
    }
    ctx.body = util.success({ assetTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
