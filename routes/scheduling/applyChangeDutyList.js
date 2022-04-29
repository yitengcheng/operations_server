/**
 * 获取调班列表接口
 */
const router = require("koa-router")();
const ChangeScheduling = require("../../models/changeSchedulingSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/distribute/apply/list", async (ctx) => {
  try {
    const { mixStatus, keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const fuzzyQuery = util.fuzzyQuery(["dutyTime", "mixRemark", "reason"], keyword);
    let params = {
      companyId: user.companyId,
      status: mixStatus,
      ...fuzzyQuery,
    };
    const role = await Role.findOne({ _id: user.roleId._id });
    if (role && role.name == "运维工人") {
      params.applyUser = user._id;
    }
    const query = ChangeScheduling.find(params).populate([
      { path: "applyUser", select: { nickName: 1 } },
      { path: "mixUser", select: { nickName: 1 } },
    ]);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await ChangeScheduling.countDocuments(params);
    ctx.body = util.success({
      total,
      list,
    });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
