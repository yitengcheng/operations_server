/**
 * 根据分类以及状态统计故障接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const _ = require('lodash');

router.post('/statistical/count/faultByField', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { classification, status } = ctx.request.body;
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    let faultSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const classifyRes = await faultModule.aggregate().group({ _id: `$${classification}`, total: { $sum: 1 } });
    const classifyList = _.map(classifyRes, '_id');
    let res = {};
    for (const [index, classify] of classifyList.entries()) {
      res[classify] = {
        total: classifyRes?.[index]?.total,
        status: await faultModule
          .aggregate()
          .match({ [classification]: classify })
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
