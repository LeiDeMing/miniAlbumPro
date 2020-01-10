module.exports = async function (ctx, next) {
    const sessionKey = ctx.get('x-session');
    if(!sessionKey) ctx.throw(401,'请求头中未包含x-session');
    const user = await findBySessionKey(sessionKey);

    if(/^\/admin/i.test(ctx.url) && !ctx.state.user.isAdmin){
        ctx.throw(401,'当前资源仅支持管理员访问');
    }
}