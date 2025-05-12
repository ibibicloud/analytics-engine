
// 解析url字符串
export const parseUrl = (urlString) => {
	try {
		if ( !urlString ) {
			return {
				protocol: 'unknown'
				,hostname: 'unknown'
				,href: 'unknown'
			};
		}
		const parsedUrl = new URL(urlString);
		return {
			protocol: parsedUrl.protocol.replace(':', '') || 'unknown'
			,hostname: parsedUrl.hostname || 'unknown'
			,href: parsedUrl.href || 'unknown'
		};
	} catch ( error ) {
		return {
			protocol: 'unknown'
			,hostname: 'unknown'
			,href: 'unknown'
		};
	}
}

// 从User-Agent中提取操作系统信息
export const extractOS = (userAgent) => {
	if ( !userAgent ) return 'unknown';
    const ua = userAgent.toLowerCase();
    const osMap = [
        [/windows/, 'Windows'],
        [/macintosh|mac os x/, 'macOS'],
        [/android/, 'Android'],
        [/iphone|ipad|ipod|ios/, 'iOS'],
        [/linux/, 'Linux'],
        [/freebsd/, 'FreeBSD'],
        [/openbsd/, 'OpenBSD'],
        [/netbsd/, 'NetBSD']
    ];
    return osMap.find(([regex]) => regex.test(ua))?.[1] || 'unknown';
}