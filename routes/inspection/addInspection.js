/**
 * 添加/修改 巡检地点接口
 */
const router = require("koa-router")();
const InspectionAddress = require("../../models/inspectionAddressSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/patrol/address/handle", async (ctx) => {
  try {
    const { office, id, parentId = undefined, headUser = undefined } = ctx.request.body;
    const { user } = ctx.state;
    let res;
    let principal;
    if (headUser) {
      principal = headUser;
    } else {
      const inspection = await InspectionAddress.findById(parentId);
      principal = inspection.headUser;
    }
    if (id) {
      res = await InspectionAddress.findByIdAndUpdate(
        id,
        { $set: { office, parentId, companyId: user.companyId, headUser: principal } },
        { upsert: true, new: true }
      );
    } else {
      res = new InspectionAddress({
        office,
        parentId,
        headUser: principal,
        companyId: user.companyId,
      });
      res.save();
    }
    if (res) {
      ctx.body = util.success({}, "添加/修改成功");
    } else {
      ctx.body = util.fail("", "添加/修改失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
