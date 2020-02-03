const {
    findBySessionKey
  } = require('../lib/db/user')
module.exports = async function (ctx, next) {
    const sessionKey = ctx.get('x-session');
    ctx.logger.debug(`[auth]获取到的sessionKey为${sessionKey}`);
    if (!sessionKey) ctx.throw(401, '请求头中未包含x-session');
    const user = await findBySessionKey(sessionKey);
    if (user) {
        ctx.logger.debug(`[auth]根据sessionKey查询到的用户为${JSON.stringify(user)}`);
        if (user.userType === -1) ctx.throw(401, '当前用户被禁用');
        ctx.state.user = {
            id: user._id,
            name: user.name,
            avatar: user.avatar,
            isAdmin: /* user.userType === 1 */true
        }
    } else {
        ctx.logger.info(`[auth]根据sessionKey未获取到用户`);
        ctx.throw(401, 'session过期');
    }
    if (/^\/admin/i.test(ctx.url) && !ctx.state.user.isAdmin) {
        ctx.logger.info(`[auth]当前的${ctx.url}仅支持管理员访问`);
        ctx.throw(401, '当前资源仅支持管理员访问');
    }
    await next();
}