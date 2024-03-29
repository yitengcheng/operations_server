/**
 * 根据分类以及状态统计资产接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const _ = require('lodash');

router.post('/statistical/count/assetsByField', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { classification, status } = ctx.request.body;
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: user?._id };
    }
    const classifyRes = await assetsModule
      .aggregate()
      .match(customer)
      .group({ _id: `$${classification}`, total: { $sum: 1 } });
    const classifyList = _.map(classifyRes, '_id');
    let res = {};
    for (const [index, classify] of classifyList.entries()) {
      res[classify] = {
        total: classifyRes?.[index]?.total,
        status: await assetsModule
          .aggregate()
          .match({ [classification]: classify, ...customer })
          .group({ _id: `$${status}`, count: { $sum: 1 } }),
      };
    }
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
