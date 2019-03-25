let ConfigUtil = {
  env: 'dev',
  // env: 'production',
  isDev() {
    return ConfigUtil.env == 'dev';
  },
  isProd() {
    return ConfigUtil.env == 'production';
  },
  statusCode: {
    SUCCESS: 1000,
    NOT_AUTHORITION: 401
  },
  isSuccess(code) {
    return ConfigUtil.statusCode.SUCCESS == code;
  }
};

export default ConfigUtil;