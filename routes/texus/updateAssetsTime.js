/**
 * 修正巡检报告时间接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const mongoose = require('mongoose');
const util = require('../../utils/util');
const dayjs = require('dayjs');
const config = require('../../config');

router.post('/test/updateAssetsTime', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司故障模板');
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);

    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const faults = await faultModule.find();
    for (const fault of faults) {
      await faultModule.updateOne(
        { _id: fault._id },
        { createTime: dayjs(fault.createTime).toDate(), designateTime: dayjs(fault.designateTime).toDate() },
      );
    }
    ctx.body = util.success({}, '修改成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
