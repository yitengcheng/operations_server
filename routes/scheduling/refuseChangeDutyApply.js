/**
 * 拒绝申请调班接口
 */
const router = require('koa-router')();
const ChangeScheduling = require('../../models/changeSchedulingSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');

router.post('/distribute/mix/refuse', async (ctx) => {
  try {
    const { id, reason } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findOne({ _id: user.roleId._id });
    if (role && role.name == '运维工人') {
      ctx.body = util.fail('', '您没有审核调班的权力');
      return;
    }
    const changeScheduling = await ChangeScheduling.updateOne({ _id: id }, { $set: { status: 3, reason } });
    if (changeScheduling.modifiedCount > 0) {
      ctx.body = util.success('', '已拒绝调班申请');
    } else {
      ctx.body = util.fail('', '拒绝调班申请失败，请稍后再试');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
