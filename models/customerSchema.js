/**
 * 客户实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String, // 客户名
  companyId: { type: mongoose.Types.ObjectId, ref: 'companys' }, // 所属维护公司
  password: String, // 用户密码
  username: String, // 登录账户
  address: String, // 公司地址
  phone: String, // 联系方式
  headName: String, // 负责人
  type: Number, // 角色类型
  repairMan: { type: mongoose.Types.ObjectId, ref: 'users' }, // 客户专属运维人员
});

module.exports = mongoose.model('customers', schema, 'customers'); // 模型名 schema 数据库集合名
