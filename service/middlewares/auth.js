const { findBySessionKey } = require('../lib/db/user')

module.exports=async function(ctx,next){
    const sessionKey = ctx.get('x-session')
}