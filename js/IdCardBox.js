mini.IdCardBox = function () {
    mini.IdCardBox.superclass.constructor.call(this);
}
mini.extend(mini.IdCardBox, mini.TextBox,
    {
        emptyText: "请输入身份证号码",
        requiredErrorText: "身份证号码不能为空",
        formatErrorText: "身份证号码格式错误",
        uiCls: "mini-idcardbox",
        width: 160,
        maxLength: 18,
        isPopup: false,
        vtype:"int",
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
            this._createPopup();
            this._doEmpty();
            // 失去焦点事件
            this.on('blur', this.___OnBlur, this);
            // 焦点事件
            this.on('focus', this.___OnFocus, this);

        },
        _createPopup: function () {
            this.ToolTipEl = mini.append(document.body, '<div class="mini-idcardbox-popup hidden"><span></span></div>');
        },
        _setToolTipContent: function (value) {
            this.ToolTipEl.innerHTML = value;
        },
        _getToolTipPosition: function () {
            var box = mini.getBox(this.el);
            var x = box.left;
            var y = box.top - 36;
            if (x < 0)x = 0;
            if (y < 0)y = 0;
            return {x: x, y: y};
        },
        _moveTooltipPosition: function (position) {
            mini.setStyle(this.ToolTipEl, "left:" + position.x + "px;top:" + position.y + "px");
        },
        _showTooltip: function () {
            var position = this._getToolTipPosition();
            this._moveTooltipPosition(position);
            mini.removeClass(this.ToolTipEl, 'hidden');
            mini.addClass(this.ToolTipEl, 'show');
            this.isPopup = true;
        },
        _hideTooltip: function () {
            mini.removeClass(this.ToolTipEl, 'show');
            mini.addClass(this.ToolTipEl, 'hidden');
            this.isPopup = false;
        },
        _formatIdCard: function (value) {
            var IDArrStr = new Array();
            IDArrStr = value.split("");
            var resultList = "";

            for (var i = 0; i < IDArrStr.length; i++) {
                resultList += IDArrStr[i];
                if (i == 5 || i == 13) {
                    resultList += " ";
                }
            }
            return resultList;

        },
        setValue: function (value, firechangedevent) {
            mini.IdCardBox.superclass.setValue.call(this, value, firechangedevent);
            this._setToolTipContent(this._formatIdCard(this.getInputText()));
        },
        __OnInputKeyUp: function (e) {
            if (this.getInputText().trim() === "") {
                this._hideTooltip();
            } else {
                if (!this.isPopup) {
                    this._showTooltip();
                }
            }
            this._setToolTipContent(this._formatIdCard(this.getInputText()));
        },
        ___OnFocus: function (e) {
            if (this.getInputText().trim() !== "")
                this._showTooltip();

        },
        /**
         * 注意这里有3个_，没有覆盖父类的方法
         * @param e
         * @private
         */
        ___OnBlur: function (e) {

            this._hideTooltip();
        },
        __OnValidation: function (e) {

            if (e.isValid == false) return;
            if (this.getValue().trim() !== "" && !this._isIdCardNumber(this.getValue())) {
                e.isValid = false;
                e.errorText = this.formatErrorText;
            }

        },
        _isIdCardNumber: function (value) {
            var Pattern = /^(\d{15}|\d{17}[\dxX])$/;
            if (Pattern.test(value)) {
                return true;
            }
            return false;
        }

    }
);

mini.regClass(mini.IdCardBox, 'idcardbox');
