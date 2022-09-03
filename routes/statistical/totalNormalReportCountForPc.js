/**
 * 分类巡检总数接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const util = require('../../utils/util');

router.post('/statistical/totalClassifyReportCount', async (ctx) => {
  try {
    const { user } = ctx.state;
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: user?._id };
    }
    const completeTotal = await InspectionReport.countDocuments({ companyId: user.companyId, status: 1, ...customer });
    const serviceTotal = await InspectionReport.countDocuments({ companyId: user.companyId, status: 2, ...customer });
    ctx.body = util.success({ completeTotal, serviceTotal });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
