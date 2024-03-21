// 处理成功响应
exports.success = ({ ctx, res = null, code = 0, msg = '请求成功' }) => {
  ctx.body = {
    code,
    data: res,
    msg,
  };
  ctx.status = 200;
};
