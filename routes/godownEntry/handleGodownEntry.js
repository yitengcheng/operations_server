/**
 * 添加入库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const godownEntrySchema = require('../../models/godownEntrySchema');
const goodsSchema = require('../../models/goodsSchema');
const lodash = require('lodash');

router.post('/godownEntry/handleGodownEntry', async (ctx) => {
  try {
    const { storageTime, orderNo, storageType, supplierId, handleUser, remark, goodIds, hasSynchronous } =
      ctx.request.body;
    const { user } = ctx.state;
    const newGodownEntry = await godownEntrySchema.create({
      storageTime,
      orderNo,
      storageType,
      supplierId,
      handleUser,
      remark,
      voucherUser: user._id,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    let godownEntryIds = [];
    for (const good of goodIds) {
      const res = await godownEntryItemSchema.create({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        godownEntryId: newGodownEntry._id,
        remark: hasSynchronous ? remark : '',
        goodId: good?._id,
        goodNum: good?.goodNum,
      });
      await goodsSchema.findByIdAndUpdate(good?._id, { $inc: { inventoryNumber: good?.goodNum } });
      godownEntryIds.push(res._id);
    }
    await godownEntrySchema.updateOne(
      { _id: newGodownEntry._id },
      {
        godownEntryIds: godownEntryIds,
        numberTotal: lodash.sumBy(goodIds, 'goodNum'),
        amountTotal: lodash.sumBy(goodIds, (o) => {
          return o.goodNum * o.price;
        }),
      },
    );
    ctx.body = util.success({}, '添加成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
