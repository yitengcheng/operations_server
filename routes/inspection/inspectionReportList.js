/**
 * 获取巡检记录
 */
const router = require("koa-router")();
const InspectionReport = require("../../models/inspectionReportSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");

router.post("/patrol/list", async (ctx) => {
  try {
    const { keyword, createTime, status = undefined } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const fuzzyQuery = util.fuzzyQuery(["remark"], keyword);
    const statusParams = status ? { status } : {};
    let createTimeParams = createTime && {
      createTime: {
        $gte: dayjs(dayjs(createTime).startOf("day")).toDate(),
        $lte: dayjs(dayjs(createTime).endOf("day")).toDate(),
      },
    };
    let params = { companyId: user.companyId, ...createTimeParams, ...statusParams, ...fuzzyQuery };
    const role = await Role.findById(user.roleId);
    if (role.name === "运维工人") {
      params["$or"] = [{ reportUser: user._id }, { headUser: user._id }];
    }
    const query = InspectionReport.find(params).populate([
      { path: "parentId", select: { office: 1 } },
      { path: "childrenId", select: { office: 1 } },
      { path: "reportUser", select: { nickName: 1 } },
      { path: "headUser", select: { nickName: 1 } },
    ]);
    const list = await query.skip(skipIndex).limit(page.pageSize).sort({ createTime: 1 });
    const total = await InspectionReport.countDocuments(params);
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
