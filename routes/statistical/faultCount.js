/**
 * 资产总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/report/app/fault", async (ctx) => {
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const faultTotal = await faultModule.countDocuments();
    const faultCompleteTotal = await faultModule.countDocuments({ status: 2 });
    const faultPendingTotal = await faultModule.countDocuments({ status: 1 });
    ctx.body = util.success({ faultTotal, faultCompleteTotal, faultPendingTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
