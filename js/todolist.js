$(function () {
    var going_on_num = 0, complete_num = 0;
    var local = getData();
    load();
    function complete(int) {
        if (int > 0) {
            $(".tag1").addClass("com");
        }
        else {
            if ($(".tag1").hasClass("com")) {
                $(".tag1").removeClass("com");
            }
        }
    }
    //获取本地缓存
    function getData() {
        var data = localStorage.getItem('mytodo');
        return data != null ? JSON.parse(data) : [];
    }
    //更新本地缓存
    function saveData() {
        localStorage.setItem('mytodo', JSON.stringify(local));
    }

    function find(str) {
        var re = -1;
        $.each(local, function (i, n) {
            if (n['content'] == str) {
                re = i;
            }
        })
        return re;
    }
    //加载本地缓存
    function load() {
        var num_1 = 0, num_2 = 0;
        $.each(local, function (i, n) {
            if (n['done'] == false) {
                ++num_1;
                $(".going-on").prepend("<li><input type='checkbox' name='' id=''><p>" + n['content'] + "</p><div class = 'font'></div></li>");
                $(".going-on li:first").attr('index', i);
            }
            else {
                ++num_2;
                $(".complete").prepend("<li><input type='checkbox' checked = 'checked' name='' id=''><p>" + n['content'] + "</p><div class = 'font'></div></li>");
                $(".complete li:first").attr('index', i);
            }
        })
        $(".tag1").text(num_1);
        if (num_1 > 0) {
            $(".tag1").addClass('com');
        }
        $(".tag2").text(num_2);

        going_on_num = num_1, complete_num = num_2;
    }
    // $(".header-input").on("focus", function(event){
    //     event.preventDefault();
    // })
    $(".header-input").on("keydown", function (event) {
        if (event.keyCode == 13 && $(this).val() == "") {
            alert("请输入内容");
        }
        else if (event.keyCode == 13) {
            var p = $("<p></p>");
            var li = $("<li></li>");
            ++going_on_num;
            complete(going_on_num);
            p.html($(this).val());
            local.push({ content: p.html(), done: false });
            saveData();
            li.html("<input type='checkbox' name='' id=''><p>" + p.html() + "</p><div class = 'font'></div>");
            $(this).val("");
            $(".going-on").append(li);
            $(".tag1").html(going_on_num);
        }
    });

    $(".going-on").on("dblclick", "li", (e) => {
        var input = $("<input class = 'ghost'>");
        $(e.currentTarget).append(input);
        $(".ghost").focus();
        input.val($(".ghost").focus().siblings().text().slice(0,-1));
        // console.log($(".ghost").focus().siblings().text());
        $('.ghost').on({
            keydown: function (e) {
                if (e.keyCode == 13) {
                    const str = $(this).val();
                    if (str != "") {
                        // console.log($(this).siblings()[1]);
                        const p = $(this).siblings()[1];
                        const ind = find(p.innerText);
                        local[ind]['content'] = $(".ghost").val();
                        saveData();
                        p.innerText = $(".ghost").val();
                    }
                    $(this).remove();
                }
            },
            blur: function () {
                // console.log($(".ghost").prev().val());
                const str = $(this).val();
                if (str != "") {
                    // console.log($(this).siblings()[1].innerText);
                    const p = $(this).siblings()[1];
                    const ind = find(p.innerText);
                    local[ind]['content'] = $(".ghost").val();
                    saveData();
                    p.innerText = $(".ghost").val();
                }
                $(this).remove();
            }
        })
    })

    $(".going-on").on("click", "input", function (event) {
        --going_on_num, ++complete_num;
        var ind = find($(this).siblings('p').text());
        if (ind != -1) {
            local[ind]['done'] = true;
        }
        saveData();
        //修改tag样式
        complete(going_on_num);
        //移除li
        var li = $(this).parent();
        $(this).parent().remove();
        $(".complete").prepend(li);
        $(".tag1").html(going_on_num);
        $(".tag2").html(complete_num);
    })

    $(".complete").on("click", "input", function (event) {
        --complete_num, ++going_on_num;
        var ind = find($(this).siblings('p').text());
        if (ind != -1) {
            local[ind]['done'] = false;
        }
        saveData();
        //修改tag样式
        complete(going_on_num);
        //移除li
        var li = $(this).parent();
        $(this).parent().remove();
        $(".going-on").prepend(li);
        $(".tag1").html(going_on_num);
        $(".tag2").html(complete_num);
    })

    var flag1 = true, flag2 = true;
    $(".going-on-h2").on("click", function () {
        if (flag1) {
            $(this).siblings(".going-on").stop(false, true).slideUp(500);
            flag1 = false;
        }
        else {
            $(this).siblings(".going-on").stop(false, true).slideDown(500);
            flag1 = true;
        }
    })

    $(".complete-h2").on("click", function () {
        if (flag2) {
            $(this).siblings(".complete").stop(false, true).slideUp(500);
            flag2 = false;
        }
        else {
            $(this).siblings(".complete").stop(false, true).slideDown(500);
            flag2 = true;
        }
    })

    $("section .going-on").on("click", ".font", function (event) {
        //从本地缓存删除li
        var ind = find($(this).siblings('p').text());
        if (ind != -1) {
            local.splice(ind, 1);
        }
        saveData();
        //删除li
        $(this).parent().remove();
        --going_on_num;
        complete(going_on_num);
        $(".tag1").html(going_on_num);
    })

    $("section .complete").on("click", ".font", function (event) {
        //从本地缓存删除li
        var ind = find($(this).siblings('p').text());
        if (ind != -1) {
            local.splice(ind, 1);
        }
        saveData();
        //删除li
        $(this).parent().remove();
        --complete_num;
        $(".tag2").html(complete_num);
    })
})