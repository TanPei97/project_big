$(function () {
    var form = layui.form;
    var layer = layui.layer;
    var str_state = null;
    var id = location.search.split("=")[1];
    //渲染下拉列表
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章类型失败')
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
                initArticle();
            }
        })
    }
    initCate();
    // 渲染要编辑的文章内容
    function initArticle() {
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章内容失败')
                form.val('form-edit', res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                str_state = res.data.state;
                //渲染之前编写的文章封面
                $image.attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img);
                // 3. 初始化裁剪区域
                $image.cropper(options);
            }
        })
    }
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
    //  得到发布的状态
    $('#btnSave1').on('click', function () {
        str_state = '已发布';
    })
    $('#btnSave2').on('click', function () {
        str_state = '草稿';
    })
    // 编辑完后获取表单信息发布文章
    $('#form-edit').on('submit', function (e) {
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
                editlishArticle(fd);
            })
    })
    function editlishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) return layer.msg('更新文章失败');
                layer.msg('更新文章成功!');
                window.parent.document.querySelector('#articlelist').click();
            }
        })
    }
})