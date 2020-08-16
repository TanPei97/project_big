$(function () {
    $.ajaxPrefilter(function (options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        if (options.url.indexOf('/my/')) {
            options.headers = {
                Authorization: sessionStorage.getItem('token') || ''
            }
        }
        options.complete = function (res) {
            if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
                sessionStorage.removeItem('token');
                location.href = '/login.html';
            }
        }
    })
})