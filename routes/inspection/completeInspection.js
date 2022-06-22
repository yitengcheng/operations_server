/**
 * 巡检故障修复完成接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');

router.post('/patrol/complete', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findById(user.roleId);
    if (role.name === '运维工人') {
      const report = InspectionReport.findOne({ _id: id, $or: [{ reportUser: user._id }, { headUser: user._id }] });
      if (!report) {
        ctx.body = util.fail('', '您无法修改一个与您无关的巡检记录');
      }
      return;
    }
    const res = await InspectionReport.updateOne({ _id: id }, { $set: { status: 1, completeTime: Date.now() } });
    if (res.modifiedCount > 0) {
      ctx.body = util.success('', '修改成功');
    } else {
      ctx.body = util.fail('', '修改失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
