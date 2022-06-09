/**
 * 巡检地点列表接口(分页)
 */
const router = require("koa-router")();
const InspectionAddress = require("../../models/inspectionAddressSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/patrol/address/list", async (ctx) => {
  try {
    const { office, id, parentId = undefined, keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const fuzzyQuery = util.fuzzyQuery(["office"], keyword);
    const params = { companyId: user.companyId, parentId, ...fuzzyQuery };
    const query = InspectionAddress.find(params, { office: 1, headUser: 1 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await InspectionAddress.countDocuments(params);
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
