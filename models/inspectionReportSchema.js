/**
 * 巡检报告实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  companyId: { type: mongoose.Types.ObjectId, ref: 'companys' }, // 公司Id
  parentId: { type: mongoose.Types.ObjectId, ref: 'inspectionAddress' }, // 巡检点
  childrenId: { type: mongoose.Types.ObjectId, ref: 'inspectionAddress' }, // 办公点
  customerId: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属客户
  remark: String, // 巡检情况
  status: Number, // 状态 1 已完成 2 维修中
  remarkPhoto: [{ type: String }], // 巡检照片
  reportUser: { type: mongoose.Types.ObjectId, ref: 'users' }, // 上报人Id
  headUser: { type: mongoose.Types.ObjectId, ref: 'users' }, // 负责人Id
  createTime: { type: Date, default: Date.now }, // 上报时间
  serviceTime: Date, // 维修时间
  completeTime: Date, // 完成时间
});

module.exports = mongoose.model('inspectionReport', schema, 'inspectionReport'); // 模型名 schema 数据库集合名
