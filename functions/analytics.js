
// 导入助手函数
import { parseUrl, extractOS } from './utils.js';

export async function onRequest(context) {
    const { env, request } = context;
    const { headers, method } = request;

    // 定义 CORS 响应头
    const corsHeaders = {
        status: 200
        ,headers: {
            'Access-Control-Allow-Origin': '*'
            ,'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            ,'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            ,'Access-Control-Max-Age': '86400'
        }
    };

    // Preflight 预检请求 OPTIONS 请求
    if ( method === 'OPTIONS' ) {
        return new Response(null, corsHeaders);
    }

    // 获取POST数据 url referrer
    let requestPostData = {};
    try {
        requestPostData = await request.json();
    } catch ( error ) {
        return new Response(
            JSON.stringify({success: false, code: 10001, message: '异常请求😒'})
            ,corsHeaders
        );
    }

    // cloudflare request 的数据
    let source      = parseUrl(requestPostData.url);
    let userAgent   = headers.get('user-agent') || 'unknown';
    let clientIP    = headers.get('cf-connecting-ip') || '0.0.0.0';
    let os          = extractOS(userAgent);

    let domainList = `${env.DOMAIN}`.split('|');
    // 校验是否在统计域名名单里
    if ( !domainList.includes(source.hostname) ) {
        return new Response(
            JSON.stringify({success: false, code: 10002, message: '不在统计域名名单里😆'})
            ,corsHeaders
        );
    }

    // 调用第三方IP地理位置API
    let locationData = {};
    try {
        let res = await fetch(`http://ip-api.com/json/${clientIP}`);
        locationData = await res.json();
    } catch ( error ) { /* 忽略错误 */ }

    // 构建分析数据
    let analyticsData = {
        url: requestPostData.url
        ,protocol: source.protocol
        ,hostname: source.hostname
        ,userAgent
        ,clientIP
        ,os
        // 12项
        ,location: locationData.status === 'success' ? locationData : {
            'country': ''
            ,'countryCode': ''
            ,'region': ''
            ,'regionName': ''
            ,'city': ''
            ,'district': ''
            ,'lat': ''
            ,'lon': ''
            ,'isp': ''
            ,'org': ''
            ,'as': ''
            ,'asname': ''
        }
        ,referrer: requestPostData.referrer
    };

    // 数据入库
    env.AnalyticsEngineBinding.writeDataPoint({
        blobs: [
            analyticsData.url
            ,analyticsData.protocol
            ,analyticsData.hostname
            ,analyticsData.userAgent
            ,analyticsData.clientIP
            ,analyticsData.os

            ,analyticsData.location.country
            ,analyticsData.location.countryCode
            ,analyticsData.location.region
            ,analyticsData.location.regionName
            ,analyticsData.location.city
            ,analyticsData.location.district
            ,analyticsData.location.lat
            ,analyticsData.location.lon
            ,analyticsData.location.isp
            ,analyticsData.location.org
            ,analyticsData.location.as
            ,analyticsData.location.asname

            ,analyticsData.referrer
        ]
    });
    
    // 返回JSON响应
    return new Response(
        JSON.stringify({success: true, code: 7355608, message: '人帅枪刚牛子大🎁'})
        ,corsHeaders
    );
}