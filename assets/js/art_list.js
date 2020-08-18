$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var data = {
        pagenum: 1,
        pagesize: 5
    };
    template.defaults.imports.newTime = function (value) {
        var dt = new Date(value);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dt.getDate();
        d = d < 10 ? '0' + d : d;
        var hh = dt.getHours();
        hh = hh < 10 ? '0' + hh : hh;
        var mm = dt.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        var ss = dt.getSeconds();
        ss = ss < 10 ? '0' + ss : ss;
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    function initArtList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: data,
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取失败')
                var htmlStr = template('tpl', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    initArtList();
    //渲染所有的分类  下拉列表中
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('文章分类获取失败')
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    initCate();
    //筛选事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        data.cate_id = cate_id;
        data.state = state;
        initArtList();
    })
    // 渲染分页功能
    function renderPage(page) {
        laypage.render({
            elem: 'pagebox',
            count: page,
            limit: data.pagesize,
            curr: data.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                if (!first) {
                    initArtList();
                }
            }
        })
    }
    //删除功能 
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除失败');
                    layer.msg('删除成功');
                    if (len === 1) {
                        data.pagenum = data.pagenum == 1 ? 1 : data.pagenum - 1;
                    }
                    initArtList();
                }
            })
            layer.close(index);
        });
    })
    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');
        location.href = 'art_edit.html?id=' + id;
    })
})