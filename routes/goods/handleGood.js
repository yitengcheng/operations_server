/**
 * 添加/修改 物品接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const goodsSchema = require('../../models/goodsSchema');

router.post('/goods/handleGood', async (ctx) => {
  try {
    const {
      name,
      models,
      unit,
      classification,
      price,
      inventoryNumber,
      inventoryMax,
      inventoryMin,
      supplierId,
      remark,
      id,
    } = ctx.request.body;
    const { user } = ctx.state;
    if (id) {
      await goodsSchema.updateOne(
        { _id: id, delFlag: false },
        { name, models, unit, classification, price, inventoryNumber, inventoryMax, inventoryMin, supplierId, remark },
      );
      ctx.body = util.success({}, '修改成功');
    } else {
      await goodsSchema.create({
        name,
        models,
        unit,
        classification,
        price,
        inventoryNumber,
        inventoryMax,
        inventoryMin,
        supplierId,
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
