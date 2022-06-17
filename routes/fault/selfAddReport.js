/**
 * 运维公司上报故障接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");
const { db } = require("../../models/companyTemplateSchema");

router.post("/fault/create", async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { data, templateId, assetsId } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findById(templateId);
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const res = new faultModule({
      ...data,
      reportUser: user._id,
      assetsId,
      dispose: user._id,
      status: 1,
      createTime: Date.now(),
      designateTime: Date.now(),
      phoneNumber: user.phonenumber,
    });
    res.save();
    ctx.body = util.success({}, "上报成功");
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
