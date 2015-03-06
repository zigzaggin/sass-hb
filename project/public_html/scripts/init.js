$(document).ready(function () {

    var getTemplate = function (templateName) {
        return $.ajax({
            url: "scripts/templates/" + templateName + ".hbs"
        });
    };

    var getTodos = function () {
        return $.ajax({
            url: "json/todos.json",
            dataType: "json"
        });
    };

    $.when(getTemplate("todos"), getTodos()).done(function (template, todos) {
        var render = Handlebars.compile(template[0]);
        var todo = $(".todos");
        todo.html(render(todos[0]));
        todo.parents(".loading").removeClass('loading');
    });


    $("body").on("click", ".todo label", function (e) {
        e.preventDefault();
        var todo = $(this).parents(".todo");
        if (!todo.find(".form").length) {
            getTemplate("edit-form").done(function (template) {
                todo.append(template);
            });
        }
        todo.toggleClass("controllable");
    });

    $(".page-heading .create").click(function () {
        var me = $(this);
        me.toggleClass("rotate");
        var parent = me.parents(".page-heading");
        parent.toggleClass("creating");
        $(".wrap").toggleClass("creating");
    });

    $(".todos").sortable();

    $("body").on("click", ".todo .control.delete", function () {
        $(this).parents(".todo").remove();
    });

    $("body").on("click", ".todo .control.edit", function () {
        var me = $(this);
        var todo = me.parents(".todo");
        todo.removeClass("controllable").addClass("editting");
        todo.find("input[type='text']").val(todo.find("label").text());
    });

    $("body").on("submit", ".todo-edit", function (e) {
        e.preventDefault();
        var me = $(this);
        var todo = me.parents(".todo");
        todo.find("label").text(me.find("input[type='text']").val());
        todo.removeClass("editting");
        return false;
    });

    $("body").on("submit", ".create-form", function (e) {
        e.preventDefault();
        var me = $(this);
        var clone = $(".todos .todo:first-of-type").clone();
        var input = me.find("input[type='text']");
        clone.find("label").text(input.val());
        $(".todos").append(clone);
        input.val("");
        var h = $('.todos-viewport')[0].scrollHeight;
        $('.todos-viewport').animate({scrollTop: h}, 0);
        return false;
    });

    $("body").on("click", ".save", function () {
        $(this).parents('form').submit();
    });


});