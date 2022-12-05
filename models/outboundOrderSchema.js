/**
 * 出库单实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  outboundTime: { type: Date }, // 出库时间
  applyTime: { type: Date }, // 申领时间
  orderNo: String, // 单号
  outboundType: { type: mongoose.Types.ObjectId, ref: 'options' }, // 出库类型
  receiveUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 领用人
  receiveDepartment: { type: mongoose.Types.ObjectId, ref: 'departments' }, // 领用部门
  voucherUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 制单人
  remark: String, // 备注
  outboundItems: [{ type: mongoose.Types.ObjectId, ref: 'outboundItems' }], // 子项列表
  numberTotal: Number, // 数量合计
  amountTotal: Number, // 金额合计
  status: { type: Number, default: 1 }, // 状态 1待审核 2审核中 3待领用 4完成 5作废 6取消申领 7审批拒绝
  auditStatusList: [{ type: mongoose.Types.ObjectId, ref: 'auditStatus' }], // 审核状态
});

module.exports = mongoose.model('outbounds', schema, 'outbounds'); // 模型名 schema 数据库集合名
