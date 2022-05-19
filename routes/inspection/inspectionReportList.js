/**
 * 获取巡检记录
 */
const router = require("koa-router")();
const InspectionReport = require("../../models/inspectionReportSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/patrol/list", async (ctx) => {
  try {
    const { keyword, createTime } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const fuzzyQuery = util.fuzzyQuery(["remark"], keyword);
    let createTimeParams = createTime && { createTime };
    let params = { companyId: user.companyId, ...createTimeParams, ...fuzzyQuery };
    const role = await Role.findById(user.roleId);
    if (role.name === "运维工人") {
      params.reportUser = user._id;
    }
    const query = InspectionReport.find(params).populate([
      { path: "parentId", select: { office: 1 } },
      { path: "childrenId", select: { office: 1 } },
      { path: "reportUser", select: { nickName: 1 } },
    ]);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await InspectionReport.countDocuments(params);
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
