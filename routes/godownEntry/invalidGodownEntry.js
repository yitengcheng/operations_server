/**
 * 作废入库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const godownEntrySchema = require('../../models/godownEntrySchema');
const goodsSchema = require('../../models/goodsSchema');
const lodash = require('lodash');

router.post('/godownEntry/invalidGodownEntry', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const godownEntry = await godownEntrySchema
      .findById(id)
      .populate([{ path: 'godownEntryIds', populate: ['goodId'] }]);
    const godownEntryItems = godownEntry?.godownEntryIds;
    for (const godownEntryItem of godownEntryItems) {
      if (godownEntryItem?.goodNum > godownEntryItem?.goodId?.inventoryNumber) {
        ctx.body = util.success({}, '库存量不足，无法作废');
        return;
      }
      const res = await goodsSchema.updateOne(
        { _id: godownEntryItem?.goodId?._id },
        { $inc: { inventoryNumber: godownEntryItem?.goodNum * -1 } },
      );
      if (res?.modifiedCount === 0) {
        ctx.body = util.success({}, '作废时调整库存出错');
        return;
      }
    }
    await godownEntrySchema.findByIdAndUpdate(id, { status: 2 });
    ctx.body = util.success({}, '作废成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
