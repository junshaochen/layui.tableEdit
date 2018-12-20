layui.define(['table', 'jquery', 'form'], function (exports) {
    "use strict";

    var MOD_NAME = 'tableEdit',
        $ = layui.jquery,
        table = layui.table,
        tableEdit = {
            v: "1.0.0",
            config: {
                tableId: '',//目标tableID
                tableObj: null,//渲染后的table对象 tableId 和 tableObj 二选一
                addEmptyRow: true,//是否自动添加空行
                emptyRowData: {},//空行数据，请根据表格数据格式添加
                rowEditChange:null,// function (data, field) { },//编辑数据改变时回调 当 editRow="customer" 触发回调
                rowEditCustomer: null,//function (field, rowData) { return null; },//自定义编辑框渲染，返回Jquery对象
                rowEditRender: null,//function (field, inputId, rowData) { }//自定义渲染编辑框时回调 当 editRow="customer" 触发回调
            }
        },
        thisEdit = function () {
            var that = this;
            return {
                render: function (options) {
                    var inst = new editClass($.extend({}, that.config, options));
                    return thisEdit.call(inst);
                },
                reload: function (data) {
                    that.reload.call(that, data);
                },
                addEmptyRow: function () {
                    that.addEmptyRow.call(that);
                },
                data: function () { return that.getData(); },
                config: that.config
            }
        },
        editClass = function (options) {
            var that = this;
            that.config = $.extend({}, that.config, tableEdit.config, options);
            that.render();
        };
    editClass.prototype.render = function (options) {
        if (!this.config.tableId && !this.config.tableObj) return;
        var that = this,
            tableId = that.config.tableId;
        that.tableObj = this.config.tableObj ? this.config.tableObj : table.reload(tableId);
        var data = that.tableObj.config.data,
            cols = that.tableObj.config.cols,
            style = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 0 14px 1px; border: none; border-radius: 0;',
            createCustomerInput = function (inputId, val) {
                return $('<input id="' + inputId + '" value="' + val + '" type="text" class="layui-input" style="' + style+'"/>');
            },
            createNumberInput = function (inputId, val) {
                return $('<input id="' + inputId + '" value="' + val + '" type="text" class="layui-input" style="' + style +'" onkeyup="value=value.replace(/[^\\d]/g,\'\')"/>');
            },
            createFloatInput = function (inputId, val) {
                return $('<input id="' + inputId + '" value="' + val + '" type="text" class="layui-input" style="' + style +'" onkeyup="if(isNaN(value))execCommand(\'undo\')"/>');
            },
            inputChange = function ($input, row, field) {
                var rowData = data[row];
                $input.change(function () {
                    var newVal = $(this).val();
                    data[row][field] = newVal;
                    if (that.config.rowEditChange) {
                        var addNewRow = that.config.rowEditChange.call(that, rowData, field);
                        if (addNewRow && row == data.length - 1)
                            return that.addEmptyRow(), false;
                    }
                    that.reload();
                });
            };
        if (data && data.length > 0)
            for (var i = 0; i < data.length; i++) {
                //循环字段
                var rowData = data[i],
                    row = rowData.LAY_TABLE_INDEX;
                $.each(cols, function (n, oneCol) {
                    $.each(oneCol, function (nn, one) {
                        if (!one.field) return true;
                        if (!one.editRow) return true;
                        var $td = $("div[lay-id='" + tableId + "'] tr[data-index='" + row + "'] td[data-field='" + one.field + "']"),
                            createFunc;
                        switch (one.editRow) {
                            case "customer":
                                if (that.config.rowEditCustomer) {
                                    var $obj = that.config.rowEditCustomer(one.field, rowData);
                                    if ($obj) {
                                        var div = $('<div style="' + style + ';padding:0;"></div>');
                                        div.append($obj);
                                        $td.append(div);
                                        if (layui.form)
                                            layui.form.render();
                                        break;
                                    }
                                }
                                createFunc = createCustomerInput;
                                break;
                            case "number":
                                createFunc = createNumberInput;
                                break;
                            case "float":
                                createFunc = createFloatInput;
                                break;
                        }
                        if (createFunc) {
                            var inputId = 'rowedit_' + one.field + '_' + row,
                                $input = createFunc(inputId, rowData[one.field]);
                            inputChange($input, row, one.field);
                            $td.append($input);
                            if (one.editRow == "customer" && that.config.rowEditRender) {
                                that.config.rowEditRender.call(that, one.field, inputId, rowData);
                            }
                        }
                    });
                });
            }
        else if (that.config.addEmptyRow)
            that.addEmptyRow();
        return that;
    }
    //添加空行
    editClass.prototype.addEmptyRow = function () {
        this.tableObj.config.data.push(this.config.emptyRowData);
        this.reload();
    }
    //重载表格
    editClass.prototype.reload = function (data) {
        data = data || this.tableObj.config.data;
        if (data) {
            if (this.config.addEmptyRow) {
                //判断是否存在空行
                var lastRow = data[data.length - 1], haveEmptyRow = true;
                $.each(this.config.emptyRowData, function (key, val) {
                    if (lastRow[key] != val)
                        return haveEmptyRow = false, false;
                });
                if (!haveEmptyRow)
                    data.push(this.config.emptyRowData);
            }
        }
        var tableId = this.config.tableId;
        table.reload(tableId, { data: data });
        this.render();
    }
    //获取编辑数据
    editClass.prototype.getData = function () {
        var d = JSON.parse(JSON.stringify(this.tableObj.config.data));
        $.each(d, function (i, one) {
            one.row = one.LAY_TABLE_INDEX + 1;
            delete one.LAY_TABLE_INDEX;
        });
        //排除空行
        if (this.config.addEmptyRow)
            d.splice(d.length - 1, 1);
        return d;
    }
    //核心入口  
    tableEdit.render = function (options) {
        var inst = new editClass(options);
        return thisEdit.call(inst);
    };
    exports(MOD_NAME, tableEdit);
});