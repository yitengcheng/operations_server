/**
 * 毒鸡汤实体
 */
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  text: String,
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("taintedChicken", schema, "taintedChicken"); // 模型名 schema 数据库集合名
