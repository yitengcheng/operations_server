/**
 * 添加/修改 物品接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const goodsSchema = require('../../models/goodsSchema');
const dayjs = require('dayjs');

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
      hasFixed,
      brand,
      id,
    } = ctx.request.body;
    const { user } = ctx.state;
    if (id) {
      let good = await goodsSchema.findById(id);
      let fixedNumber = good?.fixedNumber;
      if (hasFixed && !good?.fixedNumber) {
        fixedNumber = `GD${dayjs().format('YYYYMMDDHHmmss')}`;
      }
      await goodsSchema.updateOne(
        { _id: id, delFlag: false },
        {
          name,
          models,
          unit,
          classification,
          price,
          inventoryMax,
          inventoryMin,
          supplierId,
          remark,
          hasFixed,
          brand,
          fixedNumber,
        },
      );
      ctx.body = util.success({}, '修改成功');
    } else {
      let fixedNumber;
      if (hasFixed) {
        fixedNumber = `GD${dayjs().format('YYYYMMDDHHmmss')}`;
      }
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
        hasFixed,
        brand,
        fixedNumber,
      });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
