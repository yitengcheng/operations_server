/**
 * 配置文件
 */
module.exports = {
  URL: "mongodb://127.0.0.1:27017/operation_db", // 数据库地址
  unlessList: [
    /^\/api\/app\/login/,
    /^\/api\/addRouter/,
    /^\/api\/addCompany/,
    /^\/api\/applet\/template/,
    /^\/api\/oss\/upload/,
    /^\/api\/applet\/reportFault/,
    /^\/api\/downLoad/,
    /^\/api\/oss\/uploadLocal/,
    /^\/api\/test\/updateTime/,
    /^\/api\/user\/reigist/,
  ], // 接口白名单
};
