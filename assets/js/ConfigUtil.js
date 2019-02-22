let ConfigUtil = {
  env: 'dev',
  // env: 'production',
  isDev() {
    return ConfigUtil.env == 'dev';
  },
  isProd() {
    return ConfigUtil.env == 'production';
  }
};

export default ConfigUtil;