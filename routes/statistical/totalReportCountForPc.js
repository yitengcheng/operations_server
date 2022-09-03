/**
 * 巡检总数接口
 */
const router = require('koa-router')();
const { default: mongoose } = require('mongoose');
const InspectionReport = require('../../models/inspectionReportSchema');
const util = require('../../utils/util');

router.post('/statistical/totalReportCount', async (ctx) => {
  try {
    const { user } = ctx.state;
    let reportTotal;
    if (user?.roleId) {
      reportTotal = await InspectionReport.countDocuments({ companyId: user.companyId });
    } else {
      reportTotal = await InspectionReport.countDocuments({ companyId: user.companyId, customerId: user?._id });
    }

    ctx.body = util.success({ reportTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
