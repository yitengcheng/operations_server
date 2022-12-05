/**
 * 审核状态实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  auditUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 审核人
  auditStatus: Number, // 审核状态 1 待审核 2同意 3拒绝
  auditTime: Date, // 审核时间
  outboundOrderId: { type: mongoose.Types.ObjectId, ref: 'outbounds' }, // 所属出库单
});

module.exports = mongoose.model('auditStatus', schema, 'auditStatus'); // 模型名 schema 数据库集合名
