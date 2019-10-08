const NATIVE_ERROR_CODE_MAP: NumericDictionary<string> = {
  // 同步日历相关错误码
  6000: '任务已成功添加到手机日历中',
  6001: '系统版本太低，不支持设置日历',
  6002: '日历打开失败，请稍后重试',
  6003: '任务添加失败',
  6004: '日历同步参数错误',
  6005: '未知错误，可能是没有日历相关权限'
};

export default NATIVE_ERROR_CODE_MAP;
