const tencentcloud = require("tencentcloud-sdk-nodejs");
const smsClient = tencentcloud.sms.v20210111.Client;
const log4j = require("./log4");

const sendSMS = (phonenumber) => {
  const client = new smsClient({
    credential: {
      secretId: "AKIDfBRR9cojNltkKdfQu73j8G7i24rPggPs",
      secretKey: "D9nAH7gxzkERu73h4GBpCI7eutcAVZNu",
    },
    region: "ap-guangzhou",
    profile: {
      signMethod: "HmacSHA256",
      httpProfile: {
        reqMethod: "POST",
        reqTimeout: 30,
        endpoint: "sms.tencentcloudapi.com",
      },
    },
  });
  const smsParams = {
    SmsSdkAppId: "1400640967",
    SignName: "辰达新胜",
    TemplateId: "1321513",
    TemplateParamSet: [],
    PhoneNumberSet: [`+86${phonenumber}`],
  };
  client.SendSms(smsParams, (err, response) => {
    if (err) {
      log4j.error(err);
      return;
    }
    log4j.debug(response);
  });
};

module.exports = sendSMS;
