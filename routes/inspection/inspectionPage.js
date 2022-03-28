/**
 * 巡检地点列表接口(不分页)
 */
const router = require("koa-router")();
const InspectionAddress = require("../../models/inspectionAddressSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/patrol/address/page", async (ctx) => {
  try {
    const { parentId = undefined } = ctx.request.body;
    const { user } = ctx.state;
    const res = await InspectionAddress.find({ companyId: user.companyId, parentId }, { office: 1 });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
