const noAuthApi = ['/api/test/login', '/verifyToken/request', '/touch'];

module.exports = async (ctx, next) => {
	if (noAuthApi.contains(ctx.req.url)) {
		await next();
	} else {
		if (ctx.session.user) {
			await next();
		} else {
			ctx.body = {
				code: -3,
				resultMsg: '未登录'
			}
		}
	}
};

Array.prototype.contains = function (item) {
	let i = this.length;
	while (i--) {
		const re = new RegExp('^\\/api/anon/getSmsVerifyCode(\\/|\\/\\w+)?');
		if (this[i] === item || re.test(item)) {
			return true;
		}
	}
	return false;
};