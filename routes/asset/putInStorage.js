/**
 * 资产入库接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/assets/insert', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { data, templateId, id, customerId } = ctx.request.body;
    const companyTemplate = await CompanyTemplate.findById(templateId);
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司资产模板');
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    if (id) {
      const res = await assetsModule.findByIdAndUpdate(id, { $set: { ...data, customerId } }, { new: true });
      if (res) {
        ctx.body = util.success({}, '修改成功');
      } else {
        ctx.body = util.fail('', '修改失败');
      }
      return;
    }
    await assetsModule.create({ ...data, customerId });
    ctx.body = util.success({}, '添加成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
