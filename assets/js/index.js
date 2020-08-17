$(function () {
    getUsermsg();
    // 退出
    $('#logout').on('click', function () {
        layer.confirm('是否确定退出？', { icon: 3, title: '提示' }, function (index) {
            sessionStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        })
    })
})
var layer = layui.layer;
function getUsermsg() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) return layer.msg(res.message)
            randerUsermsg(res.data)
        }
    })
}
function randerUsermsg(user) {
    var name = user.nickname || user.username;
    $('#welcome').html(name);
    if (user.user_pic) {
        $('.userImg').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var text_avatar = name[0].toUpperCase();
        $('.userImg').hide();
        $('.text-avatar').html(text_avatar).show();
    }
}