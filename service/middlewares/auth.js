module.exports = async function (ctx, next) {
    const sessionKey = ctx.get('x-session');
    if(!sessionKey) ctx.throw(401,'请求头中未包含x-session');
    const user = await findBySessionKey(sessionKey);
}