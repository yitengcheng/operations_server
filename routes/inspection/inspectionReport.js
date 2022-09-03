/**
 * 获取巡检详情
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');
const dayjs = require('dayjs');
const { default: mongoose } = require('mongoose');

router.post('/patrol/inspectionReport', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const res = await InspectionReport.findById(id).populate([
      { path: 'parentId', select: { office: 1 } },
      { path: 'childrenId', select: { office: 1 } },
      { path: 'reportUser', select: { nickName: 1 } },
      { path: 'headUser', select: { nickName: 1 } },
      { path: 'customerId', select: { name: 1 } },
    ]);
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
