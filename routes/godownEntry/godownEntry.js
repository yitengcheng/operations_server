/**
 * 查看入库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const godownEntrySchema = require('../../models/godownEntrySchema');
const goodsSchema = require('../../models/goodsSchema');
const lodash = require('lodash');

router.post('/godownEntry/godownEntry', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const godownEntry = await godownEntrySchema
      .findById(id)
      .populate([
        { path: 'godownEntryIds', populate: [{ path: 'goodId', populate: ['unit', 'classification', 'supplierId'] }] },
        { path: 'storageType' },
        { path: 'supplierId' },
        { path: 'handleUser' },
        { path: 'voucherUser' },
      ]);
    ctx.body = util.success(godownEntry, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
