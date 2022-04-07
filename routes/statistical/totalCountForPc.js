/**
 * 资产、工单、巡检总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/statistical/totalCount", async (ctx) => {
  try {
    const { user } = ctx.state;
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    let faultSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const assetTotal = await assetsModule.countDocuments();
    const faultTotal = await faultModule.countDocuments();
    const reportTotal = await InspectionReport.countDocuments({ companyId: user.companyId });
    ctx.body = util.success({ assetTotal, faultTotal, reportTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
