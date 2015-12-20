/**
 * Created by lqg on 2015/12/2.
 */
mini.MyComponent = function () {
    mini.MyComponent.superclass.constructor.call(this);
};

mini.extend(mini.MyComponent, mini.TextBox,
    {
        emptyText: "请输入税率",
        uiCls: "mini-mycomponent",
        vtype: "float",
        InputErrorText:"输入有误",
        maxLength: 7,
        _create: function () {

            var html = '<input type="' + this._InputType + '" class="mini-textbox-input" autocomplete="off"/>';
            if (this._InputType == "textarea") {
                html = '<textarea class="mini-textbox-input" autocomplete="off"/></textarea>';
            }
            html = '<span class="mini-textbox-border">' + html + '</span>';
            html += '<input type="hidden"/>';


            this.el = document.createElement("span");
            this.el.className = "mini-textbox";
            this.el.innerHTML = html;

            this._borderEl = this.el.firstChild;
            this._textEl = this._borderEl.firstChild;
            this._valueEl = this.el.lastChild;

            this._doEmpty();
            // 失去焦点事件
            this.on('blur', this.___OnBlur, this);
            // 焦点事件
            this.on('focus', this.___OnFocus, this);
        },
        ___OnBlur: function (e) {
            if (this.getInputText().trim() !== "") {
                var value = this.getInputText().trim();
                // 如果用户没有输入百分号自动加上
                if(value.charAt(value.length-1)!=="%")
                    value = value + "%";
                this.__setValue(value);
            }
        },
        ___OnFocus: function () {
            if (this.getInputText().trim() !== "") {
                var value = this.getInputText().trim();
                var length = value.length;
                var temp = value.substr(0, length - 1);
                this.__setValue(temp);
            }
        },
        // rewrite _initEvents function
        _initEvents: function () {
            mini._BindEvents(function () {
                mini_onOne(this._textEl, "drop", this.__OnDropText, this);
                mini_onOne(this._textEl, "change", this.__OnInputTextChanged, this);
                mini_onOne(this._textEl, "focus", this.__OnFocus, this);
                mini_onOne(this.el, "mousedown", this.__OnMouseDown, this);
                /**增加onpaste的支持 潘正锋 2013-10-12*/
                mini_onOne(this._textEl, "paste", this.__OnPaste, this);
                // 增加 propertychange 为了兼容ie8 及以下版本 该属性为ie特有
                mini_onOne(this._textEl, "propertychange", this.__OnInputIE, this);
                // 增加oninput 属性 （html5 属性）
                mini_onOne(this._textEl, "input", this.__OnInput, this);
                var v = this.value;
                /**原先是this.value=null,导致setValue方法中的if语句为真，改为“” */
                this.value = "";
                this.setValue(v);
            }, this);
            this.on("validation", this.___OnValidation, this);
        },
        __OnInputIE:function(e){
            var temp = this.getInputText().trim();
            if(temp.charAt(temp.length-1)!=="%"){
                // 输入判断 合法返回ture
                var re = /^\d*(?:\.\d{0,2})?$/.test(temp);
                // 如果不是两位小数
                if (!re) {
                    var temp1 = temp.substr(0, temp.length - 1);
                    // 不覆盖原有的setValue方法
                    this.__setValue(temp1);
                }
            }
        },
        __OnInput: function (e) {
            var temp = this.getInputText().trim();
            // 输入判断 合法返回ture
            var re = /^\d*(?:\.\d{0,2})?$/.test(temp);
            // 如果不是两位小数
            if (!re) {
                var temp1 = temp.substr(0, temp.length - 1);
                // 不覆盖原有的setValue方法
                this.__setValue(temp1);
            }
        },
        __setValue: function (value, firechangedevent) {
            if (value === null || value === undefined)
                value = "";
            value = String(value);
            if (value.length > this.maxLength) {
                value = value.substring(0, this.maxLength);
                /**解决ie下  长度校验在第二次粘贴后失效的问题 */
                this._textEl.value = value;
            }

            this.value = value;
            this._valueEl.value = this._textEl.value = value;
            this._doEmpty();

            /* 解决setValue不触发valuechanged事件的问题  */
            /* when call the setValue("") method,the valid event will be trigger,cause the error icon show  */
            if (firechangedevent === undefined)
                firechangedevent = true;
            if (firechangedevent)
                this._OnValueChanged();

        },
        ___OnValidation: function (e) {
            if (e.isValid == false)
                return;
            var temp = e.value.substr(0, e.value.length - 1);
            if (this.getValue().trim() !== "" && temp>100) {
                e.isValid = false;
                e.errorText = this.InputErrorText;
            }

        }

    });

mini.regClass(mini.MyComponent, 'mycomponent');