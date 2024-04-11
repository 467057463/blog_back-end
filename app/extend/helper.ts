import { Context } from 'egg';

export default {
  success({ ctx, res = null, code = 0, msg = '请求成功' }: {ctx?: Context, res?: any, code?: number, msg?: string}) {
    ctx!.body = {
      code,
      data: res,
      msg,
    };
    ctx!.status = 200;
  },
};
