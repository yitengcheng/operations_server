/**
 * 故障处理完成接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/fault/conclusion', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { id, conclusion, conclusionPhoto } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司故障模板');
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const res = await faultModule.updateOne(
      { _id: id },
      {
        $set: { conclusion, conclusionPhoto, status: 2 },
      },
    );
    if (res.modifiedCount > 0) {
      ctx.body = util.success({}, '处理成功');
    } else {
      ctx.body = util.fail('', '处理失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
