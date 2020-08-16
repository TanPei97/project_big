$(function () {
    if (localStorage.getItem('username')) {
        $('#form_login [name=username]').val(localStorage.getItem('username'));
    }
    // 登录 注册页面切换
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须在6-12位之间，且不能有空格'],
        reqpwd: function (value) {
            if (value !== $('.reg-box [name=password]').val()) return '两次密码不一致'
        }
    })
    // 注册提交
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        localStorage.removeItem('username');
        localStorage.setItem('username', data.username);
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message, { icon: 7 });
                layer.msg('注册成功', { icon: 3 });
                setTimeout(function () {
                    $('#form_login [name=username]').val(localStorage.getItem('username'));
                    $('#link_login').click();
                }, 3000)
            }
        })
    })
    //登录 
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功');
                localStorage.removeItem('username');
                localStorage.setItem('username', $('#form_login [name=username]').val())
                sessionStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})