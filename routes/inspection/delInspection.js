/**
 * 删除巡检地点接口
 */
const router = require('koa-router')();
const InspectionAddress = require('../../models/inspectionAddressSchema');
const util = require('../../utils/util');

router.post('/patrol/address/delete', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const inspection = await InspectionAddress.remove({ _id: id });
    const inspectionChild = await InspectionAddress.remove({ parentId: id });
    let flag = false;
    if (inspection.deletedCount > 0) {
      flag = true;
    }
    if (inspectionChild.deletedCount > 0) {
      flag = true;
    }
    if (flag) {
      ctx.body = util.success({}, '删除成功');
    } else {
      ctx.body = util.fail('', '删除失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
