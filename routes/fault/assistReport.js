/**
 * 分享故障接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");

router.post("/fault/assist", async (ctx) => {
  try {
    const { assistId, id } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const res = await faultModule.updateOne({ _id: id }, { $set: { assistUser: assistId } });
    if (res.modifiedCount > 0) {
      ctx.body = util.success({}, "分享成功");
    } else {
      ctx.body = util.fail("", "分享失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
