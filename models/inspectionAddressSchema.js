/**
 * 巡检地点实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  companyId: { type: mongoose.Types.ObjectId, ref: "companys" }, // 公司Id
  office: String, // 办公点名称
  parentId: { type: mongoose.Types.ObjectId, ref: "inspectionAddress" }, // 上级地点id
  headUser: { type: mongoose.Types.ObjectId, ref: "users" }, // 巡检点负责人
});

module.exports = mongoose.model("inspectionAddress", schema, "inspectionAddress"); // 模型名 schema 数据库集合名
