/**
 * 库存收发结存汇总列表接口（分页）
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const lodash = require('lodash');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');

router.post('/goods/goodBalanceTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { time } = ctx.request.body;
    const outboundTimeParams = util.timeQuery(time, 'outboundTime');
    const godownEntryTimeParams = util.timeQuery(time, 'storageTime');
    const goods = await goodsSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false }).populate(['unit']);
    let res = [];

    for (const good of goods) {
      const outboundItemsList = await outboundOrderItemSchema
        .find({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          goodId: good?._id,
        })
        .populate([{ path: 'outboundOrderId', match: { status: 4, ...outboundTimeParams } }]);
      const godownEntryItemsList = await godownEntryItemSchema
        .find({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          goodId: good?._id,
        })
        .populate([{ path: 'godownEntryId', match: { status: 1, ...godownEntryTimeParams } }]);
      res.push({ ...good?._doc, outboundItemsList, godownEntryItemsList });
    }
    let data = [];
    res?.map((item) => {
      data.push({
        key: item?._id,
        goodName: item?.name,
        goodModels: item?.models,
        goodUnit: item?.unit?.name,
        outboundNum: lodash.sumBy(
          lodash.filter(item?.outboundItemsList, (o) => {
            return !lodash.isNull(o?.outboundOrderId);
          }),
          'goodNum',
        ),
        godownEntryNum: lodash.sumBy(
          lodash.filter(item?.godownEntryItemsList, (o) => {
            return !lodash.isNull(o?.godownEntryId);
          }),
          'goodNum',
        ),
        goodPrice: item?.price,
        inventoryNumber: item?.inventoryNumber,
        startNumber:
          item?.inventoryNumber +
          lodash.sumBy(
            lodash.filter(item?.outboundItemsList, (o) => {
              return !lodash.isNull(o?.outboundOrderId);
            }),
            'goodNum',
          ) -
          lodash.sumBy(
            lodash.filter(item?.godownEntryItemsList, (o) => {
              return !lodash.isNull(o?.godownEntryId);
            }),
            'goodNum',
          ),
      });
    });

    ctx.body = util.success({
      total: data.length,
      list: data,
    });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
