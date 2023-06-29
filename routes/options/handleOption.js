/**
 * 添加/修改 选项接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const optionSchema = require('../../models/optionSchema');

router.post('/options/handleOption', async (ctx) => {
  try {
    const { id, name, type, remark, hasShare = false } = ctx.request.body;
    const { user } = ctx.state;
    const option = await optionSchema.findOne({ name, belongs: user?.belongs ?? user._id, delFlag: false });
    if (option && id !== option._id.toString()) {
      ctx.body = util.fail('', '已有同名选项');
      return;
    }
    if (id) {
      await optionSchema.updateOne({ _id: id, delFlag: false }, { name, type, remark, hasShare });
      ctx.body = util.success({}, '修改成功');
    } else {
      await optionSchema.create({
        name,
        type,
        remark,
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        hasShare,
      });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
