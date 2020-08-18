$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    // 获取文章类别渲染到页面
    function getUserArtcate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章类型失败');
                var htmlStr = template('tpl', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    getUserArtcate();
    //添加类别
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    //完成文章分类添加功能
    //绑定表单提交事件（事件委托）
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('添加文章类型失败');
                layer.msg('添加成功');
                getUserArtcate();
                layer.close(indexAdd);
            }
        })
    })
    //编辑功能
    //绑定点击事件（事件委托）
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败');
                form.val('form-edit', res.data);
            }
        })
    })
    //编辑提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('编辑失败')
                layer.msg('编辑成功');
                getUserArtcate();
                layer.close(indexEdit);
            }
        })
    })
    //删除功能
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除失败');
                    layer.msg('删除成功');
                    getUserArtcate();
                }
            })
            layer.close(index);
        });
    })
})