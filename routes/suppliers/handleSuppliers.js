/**
 * 添加/修改 供应商接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const supplierSchema = require('../../models/supplierSchema');
const md5 = require('md5');

router.post('/suppliers/handleSuppliers', async (ctx) => {
  try {
    const { name, phone, headerUser, id, wechat, email, address, remark } = ctx.request.body;
    const { user } = ctx.state;
    const supplier = await supplierSchema.findOne({ name, belongs: user?.belongs ?? user._id, delFlag: false });
    if (supplier && id !== supplier._id.toString()) {
      ctx.body = util.fail('', `已有同名供应商`);
      return;
    }
    if (id) {
      await supplierSchema.updateOne(
        { _id: id, delFlag: false },
        { name, phone, headerUser, wechat, email, address, remark },
      );
      ctx.body = util.success({}, '修改成功');
    } else {
      await supplierSchema.create({
        name,
        phone,
        headerUser,
        wechat,
        email,
        address,
        remark,
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
