/**
 * 调班实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  dutyTime: String, // 调班日期
  mixUser: { type: mongoose.Types.ObjectId, ref: "users" }, // 调换值班人员
  applyUser: { type: mongoose.Types.ObjectId, ref: "users" }, // 申请调换人员
  mixRemark: String, // 调班备注
  companyId: { type: mongoose.Types.ObjectId, ref: "companys" }, // 公司id
  status: { type: Number, default: 1 }, // 状态 1 待处理 2 同意调班申请 3 拒绝调班申请
  createTime: String, // 创建时间
  reason: String, // 上级备注
});

module.exports = mongoose.model("changeSchedulings", schema, "changeSchedulings"); // 模型名 schema 数据库集合名
