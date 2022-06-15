/**
 * 工单总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/statistical/totalFaultCount", async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!faultTemplate) {
      ctx.body = util.fail("", "请先在手机端设置故障模板");
      return;
    }
    let faultSchema = await util.guzhangSchemaProperty(faultTemplate.content);

    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const faultTotal = await faultModule.countDocuments();
    ctx.body = util.success({ faultTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
