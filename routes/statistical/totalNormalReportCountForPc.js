/**
 * 正常巡检总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const config = require("../../config");

router.post("/statistical/totalNormalReportCount", async (ctx) => {
  try {
    const { user } = ctx.state;
    const reportTotal = await InspectionReport.countDocuments({ companyId: user.companyId, status: 1 });
    ctx.body = util.success({ reportTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
