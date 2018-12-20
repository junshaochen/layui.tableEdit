# layui.tableEdit
基于Layui的table组件编辑扩展
[Layui](https://www.layui.com/)

经典模块化前端框架

## 参数

| 参数           | 类型               | 默认值                 |描述                                                           |
|----------------|--------------------|------------------------|---------------------------------------------------------------|
| tableId           | string      | -                      | table对象ID              |
| tableObj           | object             | null                   | table渲染后的对象    |
| addEmptyRow           | bool            | true                      | 是否自动添加新行                         |
| emptyRowData         | object             | {}                    | 新行默认数据                                    |
| rowEditCustomer  | function |null | 自定义编辑框渲染，返回Jquery对象 function (field, rowData) { return $('<div></div>'); 自定义渲染的改变事件自行处理}
| rowEditChange       | function           | null                      | 编辑框改变事件回调 function (data, field) { }          |
| rowEditRender       | function              | null                    | 自定义渲染编辑框时回调 当 editRow="customer" 触发回调 function (field, inputId, rowData) { }  |


## 获取编辑后数据
var tableEditObj = tableEidt.render(options);
var data = tableEditObj.data();

## table cols 参数扩展
扩展 editRow = "customer|number|float"

customer：自定渲染（默认创建一个input）
number：只能输入数字的文本框
float：只能输入数字和小数的文本框

例：{field:'key', width:150,editRow:'customer'}

## Demo展示
![Demo](https://github.com/junshaochen/layui.tableEdit/blob/master/demo.gif)

## 有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(446252517#qq.com, 把#换成@)
