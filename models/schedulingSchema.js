/**
 * 排班实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  dateOnDuty: String, // 值班日期
  staffIds: [{ type: mongoose.Types.ObjectId, ref: 'users' }], // 值班员工
  companyId: { type: mongoose.Types.ObjectId, ref: 'companys' }, // 公司id
});

module.exports = mongoose.model('schedulings', schema, 'schedulings'); // 模型名 schema 数据库集合名
