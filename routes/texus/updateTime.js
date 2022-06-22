/**
 * 修正巡检报告时间接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const util = require('../../utils/util');
const dayjs = require('dayjs');

router.post('/test/updateTime', async (ctx) => {
  try {
    const reports = await InspectionReport.find();
    for (const report of reports) {
      await InspectionReport.updateOne({ _id: report._id }, { createTime: dayjs(report.createTime).toDate() });
    }
    ctx.body = util.success({}, '修改成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
