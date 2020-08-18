$(function () {
    var layer = layui.layer;
    var form = layui.form;
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('初始化文章分类失败');
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    initCate();
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        //  为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 发布文章
    var str_state = '已发布';
    $('#btnSave2').on('click', function () {
        str_state = '草稿';
    })
    //表单提交
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        if (!(fd.get('content').trim())) return layer.msg('发布内容不能为空');
        fd.append('state', str_state);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('发布文章失败');
                layer.msg('发布文章成功!');
                window.parent.document.querySelector('#articlelist').click();
            }
        })
    }
})