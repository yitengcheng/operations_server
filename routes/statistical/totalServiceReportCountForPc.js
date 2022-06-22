/**
 * 故障巡检总数接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const util = require('../../utils/util');

router.post('/statistical/totalServiceReportCount', async (ctx) => {
  try {
    const { user } = ctx.state;
    const reportTotal = await InspectionReport.countDocuments({ companyId: user.companyId, status: 2 });
    ctx.body = util.success({ reportTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
