/**
 * 获取巡检相关筛选项
 */
const router = require('koa-router')();
const InspectionAddress = require('../../models/inspectionAddressSchema');
const util = require('../../utils/util');

router.post('/patrol/filterOptions', async (ctx) => {
  try {
    const { user } = ctx.state;
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: user?._id };
    }
    const parents = await InspectionAddress.find(
      {
        companyId: user.companyId,
        ...customer,
        parentId: { $exists: false },
      },
      { office: 1, _id: 1 },
    );
    const childrens = await InspectionAddress.find(
      {
        companyId: user.companyId,
        ...customer,
        parentId: { $exists: true },
      },
      { office: 1, _id: 1 },
    );
    ctx.body = util.success({ parents, childrens });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
