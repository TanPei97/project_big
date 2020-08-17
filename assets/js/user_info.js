$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 8) return '用户昵称不能大于8位'
        }
    })
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg('用户信息获取失败');
                form.val('formUserInfo', res.data)
            }
        })
    }
    initUserInfo();
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新用户信息失败');
                layer.msg('更新用户信息成功');
                window.parent.getUsermsg();
            }
        })
    })
})