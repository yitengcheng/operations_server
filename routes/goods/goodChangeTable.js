/**
 * 库存变动列表接口（分页）
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const lodash = require('lodash');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');

router.post('/goods/goodChangeTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { time } = ctx.request.body;
    const outboundTimeParams = util.timeQuery(time, 'outboundTime');
    const godownEntryTimeParams = util.timeQuery(time, 'storageTime');

    const goods = await goodsSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false });
    const goodIds = lodash.map(goods, '_id');
    const outboundItemsList = await outboundOrderItemSchema
      .find({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        goodId: { $in: goodIds },
      })
      .populate([
        { path: 'outboundOrderId', match: { status: 4, ...outboundTimeParams } },
        { path: 'goodId', populate: ['unit'] },
      ]);
    const godownEntryItemsList = await godownEntryItemSchema
      .find({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        goodId: { $in: goodIds },
      })
      .populate([
        { path: 'godownEntryId', match: { status: 1, ...godownEntryTimeParams } },
        { path: 'goodId', populate: ['unit'] },
      ]);
    let list = [];

    lodash.map(
      lodash.concat(
        lodash.map(outboundItemsList, (o) => {
          return { ...o?._doc, goodNum: o?.goodNum * -1 };
        }),
        godownEntryItemsList,
      ),
      (item) => {
        if (item) {
          list.push({
            key: item?._id,
            date: item?.outboundOrderId?.outboundTime ?? item?.godownEntryId?.storageTime,
            orderNo: item?.outboundOrderId?.orderNo ?? item?.godownEntryId?.orderNo,
            goodName: item?.goodId?.name,
            goodModels: item?.goodId?.models,
            goodUnit: item?.goodId?.unit?.name,
            goodNum: item?.goodNum,
            goodPrice: item?.goodId?.price,
            goodAmount: item?.goodId?.price * item?.goodNum,
          });
        }
      },
    );
    ctx.body = util.success({
      total: lodash.filter(list, (o) => {
        return o?.orderNo;
      }).length,
      list: lodash.sortBy(
        lodash.filter(list, (o) => {
          return o?.orderNo;
        }),
        'date',
      ),
    });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
