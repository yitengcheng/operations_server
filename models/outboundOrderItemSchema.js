/**
 * 出库单子项实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  outboundOrderId: { type: mongoose.Types.ObjectId, ref: 'outboundOrder' }, // 出库单
  remark: String, // 备注
  goodId: { type: mongoose.Types.ObjectId, ref: 'goods' }, // 物品
  goodNum: Number, // 物品数量
});

module.exports = mongoose.model('outboundItems', schema, 'outboundItems'); // 模型名 schema 数据库集合名
