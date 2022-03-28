/**
 * 添加巡检报告接口
 */
const router = require("koa-router")();
const InspectionReport = require("../../models/inspectionReportSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");

router.post("/patrol/insert", async (ctx) => {
  try {
    const { childrenId, parentId, remark } = ctx.request.body;
    const { user } = ctx.state;
    const inspectionReport = new InspectionReport({
      childrenId,
      parentId,
      remark,
      reportUser: user._id,
      companyId: user.companyId,
      createTime: dayjs().format("YYYY-MM-DD"),
    });
    inspectionReport.save();
    if (inspectionReport) {
      ctx.body = util.success({}, "添加成功");
    } else {
      ctx.body = util.fail("", "添加失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
