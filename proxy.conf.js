const PROXY_CONFIG = {
    "/api/register": {
        "target": "https://dataprivacy-portal-dpo-bff-dev.mybluemix.net",
        "secure": false,
        "pathRewrite": {"^/api": ""},
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/api/*": {
        "target": "https://dataprivacy-portal-dpo-bff-dev.mybluemix.net",
        "secure": false,
        "pathRewrite": {"^/api": ""},
        "changeOrigin": true,
        "logLevel": "debug"
    }
}; 

module.exports = PROXY_CONFIG;
