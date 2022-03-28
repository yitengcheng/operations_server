/**
 * 巡检报告实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  companyId: { type: mongoose.Types.ObjectId, ref: "companys" }, // 公司Id
  parentId: { type: mongoose.Types.ObjectId, ref: "inspectionAddress" }, // 巡检点
  childrenId: { type: mongoose.Types.ObjectId, ref: "inspectionAddress" }, // 办公点
  remark: String, // 巡检情况
  reportUser: { type: mongoose.Types.ObjectId, ref: "users" }, // 上报人Id
  createTime: String, // 上报时间
});

module.exports = mongoose.model("inspectionReport", schema, "inspectionReport"); // 模型名 schema 数据库集合名
