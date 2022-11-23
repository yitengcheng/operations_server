/**
 * 添加/修改 部门定额接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const branchQuotaSchema = require('../../models/branchQuotaSchema');

router.post('/branchQutas/handleBranchQutas', async (ctx) => {
  try {
    const { id, departmentId, goodId, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec } = ctx.request.body;
    const { user } = ctx.state;
    const branchQuota = await branchQuotaSchema.findOne({
      departmentId,
      goodId,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    if (branchQuota && id !== branchQuota._id.toString()) {
      ctx.body = util.fail('', '此物品已在该部门中设置了定额');
      return;
    }
    if (id) {
      await branchQuotaSchema.updateOne(
        { _id: id, delFlag: false },
        { departmentId, goodId, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec },
      );
      ctx.body = util.success({}, '修改成功');
    } else {
      await branchQuotaSchema.create({
        departmentId,
        goodId,
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
        belongs: user?.belongs ?? user._id,
        delFlag: false,
      });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
