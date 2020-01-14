module.exports = async function (ctx, next) {
    const sessionKey = ctx.get('x-session');
    ctx.logger.debug(`[auth]获取到的sessionKey为${sessionKey}`);
    if(!sessionKey) ctx.throw(401,'请求头中未包含x-session');
    const user = await findBySessionKey(sessionKey);
    if(user){
        
    }
    if(/^\/admin/i.test(ctx.url) && !ctx.state.user.isAdmin){
        ctx.throw(401,'当前资源仅支持管理员访问');
    }
    await next();
}