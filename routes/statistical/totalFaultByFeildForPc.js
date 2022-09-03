/**
 * 根据字段分类故障统计接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const _ = require('lodash');

router.post('/statistical/total/faultByField', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    let faultSchema = await util.schemaProperty(faultTemplate.content);
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: user?._id };
    }
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const data = await faultModule.find({ ...params, ...customer });
    delete faultSchema.customerId;
    const fields = _.keys(faultSchema);
    ctx.body = util.success({ data, fields });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
