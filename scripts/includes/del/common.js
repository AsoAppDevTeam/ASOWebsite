(function (b) {
    var a = {
        init: function (d) {
            var e = this;
            if (!e.data("jqv") || e.data("jqv") == null) {
                a._saveOptions(e, d);
                b(".formError").live("click", function () {
                    b(this).fadeOut(150, function () {
                        b(this).remove()
                    })
                })
            }
        },
        attach: function (g) {
            var f = this;
            var e;
            if (g) {
                e = a._saveOptions(f, g)
            } else {
                e = f.data("jqv")
            }
            var d = (f.find("[data-validation-engine*=validate]")) ? "data-validation-engine" : "class";
            if (!e.binded) {
                if (e.bindMethod == "bind") {
                    f.find("[class*=validate]").not("[type=checkbox]").not("[type=radio]").not(".datepicker").bind(e.validationEventTrigger, a._onFieldEvent);
                    f.find("[class*=validate][type=checkbox],[class*=validate][type=radio]").bind("click", a._onFieldEvent);
                    f.find("[class*=validate][class*=datepicker]").bind(e.validationEventTrigger, {
                        delay: 300
                    }, a._onFieldEvent);
                    f.bind("submit", a._onSubmitEvent)
                } else {
                    if (e.bindMethod == "live") {
                        f.find("[class*=validate]").not("[type=checkbox]").not(".datepicker").live(e.validationEventTrigger, a._onFieldEvent);
                        f.find("[class*=validate][type=checkbox]").live("click", a._onFieldEvent);
                        f.find("[class*=validate][class*=datepicker]").live(e.validationEventTrigger, {
                            delay: 300
                        }, a._onFieldEvent);
                        f.live("submit", a._onSubmitEvent)
                    }
                }
                e.binded = true
            }
            return this
        },
        detach: function () {
            var e = this;
            var d = e.data("jqv");
            if (d.binded) {
                e.find("[class*=validate]").not("[type=checkbox]").unbind(d.validationEventTrigger, a._onFieldEvent);
                e.find("[class*=validate][type=checkbox],[class*=validate][type=radio]").unbind("click", a._onFieldEvent);
                e.unbind("submit", a.onAjaxFormComplete);
                e.find("[class*=validate]").not("[type=checkbox]").die(d.validationEventTrigger, a._onFieldEvent);
                e.find("[class*=validate][type=checkbox]").die("click", a._onFieldEvent);
                e.die("submit", a.onAjaxFormComplete);
                e.removeData("jqv")
            }
        },
        validate: function () {
            return a._validateFields(this)
        },
        validateField: function (e) {
            var d = b(this).data("jqv");
            return a._validateField(b(e), d)
        },
        validateform: function () {
            return a._onSubmitEvent.call(this)
        },
        updatePromptsPosition: function () {
            var e = this.closest("form");
            var d = e.data("jqv");
            e.find("[class*=validate]").not(":hidden").not(":disabled").each(function () {
                var h = b(this);
                var f = a._getPrompt(h);
                var g = b(f).find(".formErrorContent").html();
                if (f) {
                    a._updatePrompt(h, b(f), g, undefined, false, d)
                }
            })
        },
        showPrompt: function (e, g, j, f) {
            var h = this.closest("form");
            var d = h.data("jqv");
            if (!d) {
                d = a._saveOptions(this, d)
            }
            if (j) {
                d.promptPosition = j
            }
            d.showArrow = f == true;
            a._showPrompt(this, e, g, false, d)
        },
        hidePrompt: function () {
            var d = "." + a._getClassName(b(this).attr("id")) + "formError";
            b(d).fadeTo("fast", 0.3, function () {
                b(this).remove()
            })
        },
        hide: function () {
            var d;
            if (b(this).is("form")) {
                d = "parentForm" + b(this).attr("id")
            } else {
                d = b(this).attr("id") + "formError"
            }
            b("." + d).fadeTo("fast", 0.3, function () {
                b(this).remove()
            })
        },
        hideAll: function () {
            b(".formError").fadeTo("fast", 0.3, function () {
                b(this).remove()
            })
        },
        _onFieldEvent: function (f) {
            var g = b(this);
            var e = g.closest("form");
            var d = e.data("jqv");
            window.setTimeout(function () {
                a._validateField(g, d)
            }, (f.data) ? f.data.delay : 0)
        },
        _onSubmitEvent: function () {
            var f = b(this);
            var d = f.data("jqv");
            var e = a._validateFields(f, true);
            if (e && d.ajaxFormValidation) {
                a._validateFormWithAjax(f, d);
                return false
            }
            if (d.onValidationComplete) {
                d.onValidationComplete(f, e);
                return false
            }
            return e
        },
        _checkAjaxStatus: function (e) {
            var d = true;
            b.each(e.ajaxValidCache, function (f, g) {
                if (!g) {
                    d = false;
                    return false
                }
            });
            return d
        },
        _validateFields: function (g, q) {
            var r = g.data("jqv");
            var h = false;
            g.trigger("jqv.form.validating");
            g.find("[class*=validate]").not(":hidden").not(":disabled").each(function () {
                var d = b(this);
                h |= a._validateField(d, r, q)
            });
            g.trigger("jqv.form.result", [h]);
            if (h) {
                if (r.scroll) {
                    var p = Number.MAX_VALUE;
                    var k = 0;
                    var m = b(".formError:not('.greenPopup')");
                    for (var l = 0; l < m.length; l++) {
                        var n = b(m[l]).offset().top;
                        if (n < p) {
                            p = n;
                            k = b(m[l]).offset().left
                        }
                    }
                    if (!r.isOverflown) {
                        b("html:not(:animated),body:not(:animated)").animate({
                            scrollTop: p,
                            scrollLeft: k
                        }, 1100)
                    } else {
                        var e = b(r.overflownDIV);
                        var f = e.scrollTop();
                        var j = -parseInt(e.offset().top);
                        p += f + j - 5;
                        var o = b(r.overflownDIV + ":not(:animated)");
                        o.animate({
                            scrollTop: p
                        }, 1100);
                        b("html:not(:animated),body:not(:animated)").animate({
                            scrollTop: e.offset().top,
                            scrollLeft: k
                        }, 1100)
                    }
                }
                return false
            }
            return true
        },
        _validateFormWithAjax: function (f, e) {
            var g = f.serialize();
            var d = (e.ajaxFormValidationURL) ? e.ajaxFormValidationURL : f.attr("action");
            b.ajax({
                type: "GET",
                url: d,
                cache: false,
                dataType: "json",
                data: g,
                form: f,
                methods: a,
                options: e,
                beforeSend: function () {
                    return e.onBeforeAjaxFormValidation(f, e)
                },
                error: function (h, j) {
                    a._ajaxError(h, j)
                },
                success: function (m) {
                    if (m !== true) {
                        var k = false;
                        for (var l = 0; l < m.length; l++) {
                            var n = m[l];
                            var p = n[0];
                            var j = b(b("#" + p)[0]);
                            if (j.length == 1) {
                                var o = n[2];
                                if (n[1] == true) {
                                    if (o == "" || !o) {
                                        a._closePrompt(j)
                                    } else {
                                        if (e.allrules[o]) {
                                            var h = e.allrules[o].alertTextOk;
                                            if (h) {
                                                o = h
                                            }
                                        }
                                        a._showPrompt(j, o, "pass", false, e, true)
                                    }
                                } else {
                                    k |= true;
                                    if (e.allrules[o]) {
                                        var h = e.allrules[o].alertText;
                                        if (h) {
                                            o = h
                                        }
                                    }
                                    a._showPrompt(j, o, "", false, e, true)
                                }
                            }
                        }
                        e.onAjaxFormComplete(!k, f, m, e)
                    } else {
                        e.onAjaxFormComplete(true, f, "", e)
                    }
                }
            })
        },
        _validateField: function (p, v, q) {
            if (!p.attr("id")) {
                b.error("jQueryValidate: an ID attribute is required for this field: " + p.attr("name") + " class:" + p.attr("class"))
            }
            var u = p.attr("class");
            var k = /validate\[(.*)\]/.exec(u);
            if (!k) {
                return false
            }
            var o = k[1];
            var t = o.split(/\[|,|\]/);
            var f = false;
            var r = p.attr("name");
            var d = "";
            var n = false;
            v.isError = false;
            v.showArrow = true;
            for (var j = 0; j < t.length; j++) {
                var m = undefined;
                switch (t[j]) {
                    case "required":
                        n = true;
                        m = a._required(p, t, j, v);
                        break;
                    case "custom":
                        m = a._customRegex(p, t, j, v);
                        break;
                    case "groupRequired":
                        var e = "[class*=" + t[j + 1] + "]";
                        var h = p.closest("form").find(e).eq(0);
                        if (h[0] != p[0]) {
                            a._validateField(h, v, q);
                            v.showArrow = true;
                            continue
                        }
                        m = a._groupRequired(p, t, j, v);
                        if (m) {
                            n = true
                        }
                        v.showArrow = false;
                        break;
                    case "ajax":
                        if (!q) {
                            a._ajax(p, t, j, v);
                            f = true
                        }
                        break;
                    case "minSize":
                        m = a._minSize(p, t, j, v);
                        break;
                    case "maxSize":
                        m = a._maxSize(p, t, j, v);
                        break;
                    case "min":
                        m = a._min(p, t, j, v);
                        break;
                    case "max":
                        m = a._max(p, t, j, v);
                        break;
                    case "past":
                        m = a._past(p, t, j, v);
                        break;
                    case "future":
                        m = a._future(p, t, j, v);
                        break;
                    case "dateRange":
                        var e = "[class*=" + t[j + 1] + "]";
                        var h = p.closest("form").find(e).eq(0);
                        var g = p.closest("form").find(e).eq(1);
                        if (h[0].value || g[0].value) {
                            m = a._dateRange(h, g, t, j, v)
                        }
                        if (m) {
                            n = true
                        }
                        v.showArrow = false;
                        break;
                    case "dateTimeRange":
                        var e = "[class*=" + t[j + 1] + "]";
                        var h = p.closest("form").find(e).eq(0);
                        var g = p.closest("form").find(e).eq(1);
                        if (h[0].value || g[0].value) {
                            m = a._dateTimeRange(h, g, t, j, v)
                        }
                        if (m) {
                            n = true
                        }
                        v.showArrow = false;
                        break;
                    case "maxCheckbox":
                        m = a._maxCheckbox(p, t, j, v);
                        p = b(b("input[name='" + r + "']"));
                        break;
                    case "minCheckbox":
                        m = a._minCheckbox(p, t, j, v);
                        p = b(b("input[name='" + r + "']"));
                        break;
                    case "equals":
                        m = a._equals(p, t, j, v);
                        break;
                    case "funcCall":
                        m = a._funcCall(p, t, j, v);
                        break;
                    default:
                }
                if (m !== undefined) {
                    d += m + "<br/>";
                    v.isError = true
                }
            }
            if (!n) {
                if (p.val() == "") {
                    v.isError = false
                }
            }
            var l = p.attr("type");
            if ((l == "radio" || l == "checkbox") && b("input[name='" + r + "']").size() > 1) {
                p = b(b("input[name='" + r + "'][type!=hidden]:first"));
                v.showArrow = false
            }
            if (l == "text" && b("input[name='" + r + "']").size() > 1) {
                p = b(b("input[name='" + r + "'][type!=hidden]:first"));
                v.showArrow = false
            }
            if (v.isError) {
                a._showPrompt(p, d, "", false, v)
            } else {
                if (!f) {
                    a._closePrompt(p)
                }
            }
            p.trigger("jqv.field.result", [p, v.isError, d]);
            return v.isError
        },
        _required: function (g, h, f, e) {
            switch (g.attr("type")) {
                case "text":
                case "password":
                case "textarea":
                case "file":
                default:
                    if (!g.val()) {
                        return e.allrules[h[f]].alertText
                    }
                    break;
                case "radio":
                case "checkbox":
                    var d = g.attr("name");
                    if (b("input[name='" + d + "']:checked").size() == 0) {
                        if (b("input[name='" + d + "']").size() == 1) {
                            return e.allrules[h[f]].alertTextCheckboxe
                        } else {
                            return e.allrules[h[f]].alertTextCheckboxMultiple
                        }
                    }
                    break;
                case "select-one":
                    if (!g.val()) {
                        return e.allrules[h[f]].alertText
                    }
                    break;
                case "select-multiple":
                    if (!g.find("option:selected").val()) {
                        return e.allrules[h[f]].alertText
                    }
                    break
            }
        },
        _groupRequired: function (g, j, e, d) {
            var h = "[class*=" + j[e + 1] + "]";
            var f = false;
            g.closest("form").find(h).each(function () {
                if (!a._required(b(this), j, e, d)) {
                    f = true;
                    return false
                }
            });
            if (!f) {
                return d.allrules[j[e]].alertText
            }
        },
        _customRegex: function (k, l, g, e) {
            var d = l[g + 1];
            var j = e.allrules[d];
            if (!j) {
                alert("jqv:custom rule not found " + d);
                return
            }
            var f = j.regex;
            if (!f) {
                alert("jqv:custom regex not found " + d);
                return
            }
            var h = new RegExp(f);
            if (!h.test(k.val())) {
                return e.allrules[d].alertText
            }
        },
        _funcCall: function (h, j, e, d) {
            var g = j[e + 1];
            var f = window[g];
            if (typeof (f) == "function") {
                return f(h, j, e, d)
            }
        },
        _equals: function (g, h, f, e) {
            var d = h[f + 1];
            if (g.val() != b("#" + d).val()) {
                return e.allrules.equals.alertText
            }
        },
        _maxSize: function (j, k, g, f) {
            var e = k[g + 1];
            var d = j.val().length;
            if (d > e) {
                var h = f.allrules.maxSize;
                return h.alertText + e + h.alertText2
            }
        },
        _minSize: function (j, k, g, e) {
            var f = k[g + 1];
            var d = j.val().length;
            if (d < f) {
                var h = e.allrules.minSize;
                return h.alertText + f + h.alertText2
            }
        },
        _min: function (j, k, g, e) {
            var f = parseFloat(k[g + 1]);
            var d = parseFloat(j.val());
            if (d < f) {
                var h = e.allrules.min;
                if (h.alertText2) {
                    return h.alertText + f + h.alertText2
                }
                return h.alertText + f
            }
        },
        _max: function (j, k, g, f) {
            var e = parseFloat(k[g + 1]);
            var d = parseFloat(j.val());
            if (d > e) {
                var h = f.allrules.max;
                if (h.alertText2) {
                    return h.alertText + e + h.alertText2
                }
                return h.alertText + e
            }
        },
        _past: function (k, l, f, d) {
            var j = l[f + 1];
            var e = (j.toLowerCase() == "now") ? new Date() : a._parseDate(j);
            var g = a._parseDate(k.val());
            if (g < e) {
                var h = d.allrules.past;
                if (h.alertText2) {
                    return h.alertText + a._dateToString(e) + h.alertText2
                }
                return h.alertText + a._dateToString(e)
            }
        },
        _future: function (k, l, f, d) {
            var j = l[f + 1];
            var e = (j.toLowerCase() == "now") ? new Date() : a._parseDate(j);
            var g = a._parseDate(k.val());
            if (g > e) {
                var h = d.allrules.future;
                if (h.alertText2) {
                    return h.alertText + a._dateToString(e) + h.alertText2
                }
                return h.alertText + a._dateToString(e)
            }
        },
        _isDate: function (e) {
            var d = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
            if (d.test(e)) {
                return true
            }
            return false
        },
        _isDateTime: function (e) {
            var d = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
            if (d.test(e)) {
                return true
            }
            return false
        },
        _dateCompare: function (e, d) {
            return (new Date(e.toString()) < new Date(d.toString()))
        },
        _dateRange: function (h, e, g, f, d) {
            if ((!h[0].value && e[0].value) || (h[0].value && !e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
            if (!a._isDate(h[0].value) || !a._isDate(e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
            if (!a._dateCompare(h[0].value, e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
        },
        _dateTimeRange: function (h, e, g, f, d) {
            if ((!h[0].value && e[0].value) || (h[0].value && !e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
            if (!a._isDateTime(h[0].value) || !a._isDateTime(e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
            if (!a._dateCompare(h[0].value, e[0].value)) {
                return d.allrules[g[f]].alertText + d.allrules[g[f]].alertText2
            }
        },
        _maxCheckbox: function (j, k, h, g) {
            var e = k[h + 1];
            var f = j.attr("name");
            var d = b("input[name='" + f + "']:checked").size();
            if (d > e) {
                g.showArrow = false;
                if (g.allrules.maxCheckbox.alertText2) {
                    return g.allrules.maxCheckbox.alertText + " " + e + " " + g.allrules.maxCheckbox.alertText2
                }
                return g.allrules.maxCheckbox.alertText
            }
        },
        _minCheckbox: function (j, k, h, g) {
            var e = k[h + 1];
            var f = j.attr("name");
            var d = b("input[name='" + f + "']:checked").size();
            if (d < e) {
                g.showArrow = false;
                return g.allrules.minCheckbox.alertText + " " + e + " " + g.allrules.minCheckbox.alertText2
            }
        },
        _ajax: function (n, p, j, q) {
            var o = p[j + 1];
            var m = q.allrules[o];
            var f = m.extraData;
            var k = m.extraDataDynamic;
            if (!f) {
                f = ""
            }
            if (k) {
                var h = [];
                var l = String(k).split(",");
                for (var j = 0; j < l.length; j++) {
                    var d = l[j];
                    if (b(d).length) {
                        var e = n.closest("form").find(d).val();
                        var g = d.replace("#", "") + "=" + escape(e);
                        h.push(g)
                    }
                }
                k = h.join("&")
            } else {
                k = ""
            }
            if (!q.isError) {
                b.ajax({
                    type: "GET",
                    url: m.url,
                    cache: false,
                    dataType: "json",
                    data: "fieldId=" + n.attr("id") + "&fieldValue=" + n.val() + "&extraData=" + f + "&" + k,
                    field: n,
                    rule: m,
                    methods: a,
                    options: q,
                    beforeSend: function () {
                        var r = m.alertTextLoad;
                        if (r) {
                            a._showPrompt(n, r, "load", true, q)
                        }
                    },
                    error: function (r, t) {
                        a._ajaxError(r, t)
                    },
                    success: function (v) {
                        var y = v[0];
                        var u = b(b("#" + y)[0]);
                        if (u.length == 1) {
                            var t = v[1];
                            var w = v[2];
                            if (!t) {
                                q.ajaxValidCache[y] = false;
                                q.isError = true;
                                if (w) {
                                    if (q.allrules[w]) {
                                        var r = q.allrules[w].alertText;
                                        if (r) {
                                            w = r
                                        }
                                    }
                                } else {
                                    w = m.alertText
                                }
                                a._showPrompt(u, w, "", true, q)
                            } else {
                                if (q.ajaxValidCache[y] !== undefined) {
                                    q.ajaxValidCache[y] = true
                                }
                                if (w) {
                                    if (q.allrules[w]) {
                                        var r = q.allrules[w].alertTextOk;
                                        if (r) {
                                            w = r
                                        }
                                    }
                                } else {
                                    w = m.alertTextOk
                                }
                                if (w) {
                                    a._showPrompt(u, w, "pass", true, q)
                                } else {
                                    a._closePrompt(u)
                                }
                            }
                        }
                    }
                })
            }
        },
        _ajaxError: function (d, e) {
            if (d.status == 0 && e == null) {
                alert("The page is not served from a server! ajax call failed")
            } else {
                if (typeof console != "undefined") {
                    console.log("Ajax error: " + d.status + " " + e)
                }
            }
        },
        _dateToString: function (d) {
            return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
        },
        _parseDate: function (f) {
            var e = f.split("-");
            if (e == f) {
                e = f.split("/")
            }
            return new Date(e[0], (e[1] - 1), e[2])
        },
        _showPrompt: function (k, h, j, g, f, e) {
            var d = a._getPrompt(k);
            if (e) {
                d = false
            }
            if (d) {
                a._updatePrompt(k, d, h, j, g, f)
            } else {
                a._buildPrompt(k, h, j, g, f)
            }
        },
        _buildPrompt: function (h, d, f, k, l) {
            var e = b("<div>");
            e.addClass(a._getClassName(h.attr("id")) + "formError");
            if (h.is(":input")) {
                e.addClass("parentForm" + a._getClassName(h.parents("form").attr("id")))
            }
            e.addClass("formError");
            switch (f) {
                case "pass":
                    e.addClass("greenPopup");
                    break;
                case "load":
                    e.addClass("blackPopup")
            }
            if (k) {
                e.addClass("ajaxed")
            }
            var m = b("<div>").addClass("formErrorContent").html(d).appendTo(e);
            if (l.showArrow) {
                var j = b("<div>").addClass("formErrorArrow");
                switch (l.promptPosition) {
                    case "bottomLeft":
                    case "bottomRight":
                        e.find(".formErrorContent").before(j);
                        j.addClass("formErrorArrowBottom").html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                        break;
                    case "topLeft":
                    case "topRight":
                        j.html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                        e.append(j);
                        break
                }
            }
            if (l.isOverflown) {
                h.before(e)
            } else {
                b("body").append(e)
            }
            var g = a._calculatePosition(h, e, l);
            e.css({
                top: g.callerTopPosition,
                left: g.callerleftPosition,
                marginTop: g.marginTopSize,
                opacity: 0
            });
            return e.animate({
                opacity: 0.87
            })
        },
        _updatePrompt: function (j, d, g, h, f, e) {
            if (d) {
                if (h == "pass") {
                    d.addClass("greenPopup")
                } else {
                    d.removeClass("greenPopup")
                }
                if (h == "load") {
                    d.addClass("blackPopup")
                } else {
                    d.removeClass("blackPopup")
                }
                if (f) {
                    d.addClass("ajaxed")
                } else {
                    d.removeClass("ajaxed")
                }
                d.find(".formErrorContent").html(g);
                var k = a._calculatePosition(j, d, e);
                d.animate({
                    top: k.callerTopPosition,
                    left: k.callerleftPosition,
                    marginTop: k.marginTopSize
                })
            }
        },
        _closePrompt: function (e) {
            var d = a._getPrompt(e);
            if (d) {
                d.fadeTo("fast", 0, function () {
                    d.remove()
                })
            }
        },
        closePrompt: function (d) {
            return a._closePrompt(d)
        },
        _getPrompt: function (f) {
            var e = f.attr("id").replace(":", "_") + "formError";
            var d = b("." + a._escapeExpression(e))[0];
            if (d) {
                return b(d)
            }
        },
        _escapeExpression: function (d) {
            return d.replace(/([#;&,\.\+\*\~':"\!\^$\[\]\(\)=>\|])/g, "\\$1")
        },
        _calculatePosition: function (k, f, n) {
            var d, l, j;
            var h = k.width();
            var m = f.height();
            var e = n.isOverflown;
            if (e) {
                d = l = 0;
                j = -m
            } else {
                var g = k.offset();
                d = g.top;
                l = g.left;
                j = 0
            }
            switch (n.promptPosition) {
                default:
                case "topRight":
                    if (e) {
                        l += h - 30
                    } else {
                        l += h - 30;
                        d += -m - 2
                    }
                    break;
                case "topLeft":
                    d += -m - 10;
                    break;
                case "centerRight":
                    l += h + 13;
                    break;
                case "bottomLeft":
                    d = d + k.height() + 15;
                    break;
                case "bottomRight":
                    l += h - 30;
                    d += k.height() + 5
            }
            return {
                callerTopPosition: d + "px",
                callerleftPosition: l + "px",
                marginTopSize: j + "px"
            }
        },
        _saveOptions: function (f, e) {
            if (b.validationEngineLanguage) {
                var d = b.validationEngineLanguage.allRules
            } else {
                b.error("jQuery.validationEngine rules are not loaded, plz add localization files to the page")
            }
            b.validationEngine.defaults.allrules = d;
            var g = b.extend({}, b.validationEngine.defaults, e);
            f.data("jqv", g);
            return g
        },
        _getClassName: function (d) {
            return d.replace(":", "_").replace(".", "_")
        }
    };
    b.fn.validationEngine = function (e) {
        var d = b(this);
        if (!d[0]) {
            return false
        }
        if (typeof (e) == "string" && e.charAt(0) != "_" && a[e]) {
            if (e != "showPrompt" && e != "hidePrompt" && e != "hide" && e != "hideAll") {
                a.init.apply(d)
            }
            return a[e].apply(d, Array.prototype.slice.call(arguments, 1))
        } else {
            if (typeof e == "object" || !e) {
                a.init.apply(d, arguments);
                return a.attach.apply(d)
            } else {
                b.error("Method " + e + " does not exist in jQuery.validationEngine")
            }
        }
    };
    b.validationEngine = {
        defaults: {
            validationEventTrigger: "blur",
            scroll: true,
            promptPosition: "topRight",
            bindMethod: "bind",
            inlineAjax: false,
            ajaxFormValidation: false,
            ajaxFormValidationURL: false,
            onAjaxFormComplete: b.noop,
            onBeforeAjaxFormValidation: b.noop,
            onValidationComplete: false,
            isOverflown: false,
            overflownDIV: "",
            binded: false,
            showArrow: true,
            isError: false,
            ajaxValidCache: {}
        }
    }
})(jQuery);
(function (a) {
    a.fn.validationEngineLanguage = function () {};
    a.validationEngineLanguage = {
        newLang: function () {
            a.validationEngineLanguage.allRules = {
                required: {
                    regex: "none",
                    alertText: "* This field is required",
                    alertTextCheckboxMultiple: "* Please select an option",
                    alertTextCheckboxe: "* This checkbox is required"
                },
                minSize: {
                    regex: "none",
                    alertText: "* Minimum ",
                    alertText2: " characters required"
                },
                maxSize: {
                    regex: "none",
                    alertText: "* Maximum ",
                    alertText2: " characters allowed"
                },
                min: {
                    regex: "none",
                    alertText: "* Minimum value is "
                },
                max: {
                    regex: "none",
                    alertText: "* Maximum value is "
                },
                past: {
                    regex: "none",
                    alertText: "* Date prior to "
                },
                future: {
                    regex: "none",
                    alertText: "* Date past "
                },
                maxCheckbox: {
                    regex: "none",
                    alertText: "* Checks allowed Exceeded"
                },
                minCheckbox: {
                    regex: "none",
                    alertText: "* Please select ",
                    alertText2: " options"
                },
                equals: {
                    regex: "none",
                    alertText: "* Fields do not match"
                },
                phone: {
                    regex: /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
                    alertText: "* Invalid phone number"
                },
                email: {
                    regex: /^([A-Za-z0-9_\-\.\'])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/,
                    alertText: "* Invalid email address"
                },
                integer: {
                    regex: /^[\-\+]?\d+$/,
                    alertText: "* Not a valid integer"
                },
                number: {
                    regex: /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/,
                    alertText: "* Invalid floating decimal number"
                },
                date: {
                    regex: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    alertText: "* Invalid date, must be in YYYY-MM-DD format"
                },
                ipv4: {
                    regex: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    alertText: "* Invalid IP address"
                },
                url: {
                    regex: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
                    alertText: "* Invalid URL"
                },
                onlyNumberSp: {
                    regex: /^[0-9\ ]+$/,
                    alertText: "* Numbers only"
                },
                onlyLetterSp: {
                    regex: /^[a-zA-Z\ \']+$/,
                    alertText: "* Letters only"
                },
                onlyLetterNumber: {
                    regex: /^[0-9a-zA-Z]+$/,
                    alertText: "* No special characters allowed"
                },
                simplePhone: {
                    regex: /^\d{10}$/,
                    alertText: "* Not a valid 10 digit phone number"
                },
                zip: {
                    regex: /^[0-9A-Za-z]{5,9}$/,
                    alertText: "* Not a valid zip/postal code (5-9 alphanumeric)"
                },
                relaxedemail: {
                    regex: /^[A-Za-z0-9_][+A-Za-z0-9._-]*[A-Za-z0-9_]*@[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z]+$/,
                    alertText: "* Invalid email address"
                }
            }
        }
    };
    a.validationEngineLanguage.newLang()
})(jQuery);

function getTarget(b) {
    var a;
    if (!b) {
        var b = window.event
    }
    if (b.target) {
        a = b.target
    } else {
        if (b.srcElement) {
            a = b.srcElement
        }
    }
    if (a.nodeType == 3) {
        a = a.parentNode
    }
    return a
}
var gPopupWinOnload = false;
var gNotificationRedirect = false;
var gSavingsAjaxSearch = false;

function displayNotification(a) {
    var b = function () {
        showPopWin(a, 860, 800, function () {
            if (gNotificationRedirect != false) {
                window.location.href = gNotificationRedirect
            }
        })
    };
    openModalWithAuthRequired(b)
}
function popupWinOnload(a) {
    gPopupWinOnload = a
}
function displayInviteMe() {
    showPopWin(BASE_URL + "/inviteme?modal=true", 860, 500, function () {}, "friendModal")
}
function showIfHidden(a) {
    if ($("#" + a).length != 0 && $("#" + a).css("display") == "none") {
        $("#" + a).css("display", "inline")
    }
}
function hideIfShowing(a) {
    if ($("#" + a).length != 0 && $("#" + a).css("display") != "none") {
        $("#" + a).css("display", "none")
    }
}
function showIfNotVisible(a) {
    if ($("#" + a).length != 0 && $("#" + a).css("visibility") == "hidden") {
        $("#" + a).css("visibility", "visible")
    }
}
function hideIfVisible(a) {
    if ($("#" + a).length != 0 && $("#" + a).css("visibility") != "hidden") {
        $("#" + a).css("visibility", "hidden")
    }
}
function showProgressAnim(a) {
    if (a) {
        showIfHidden(a);
        showIfNotVisible(a)
    } else {
        showIfNotVisible("infoloaderdiv")
    }
}
function hideProgressAnim(a) {
    if (a) {
        hideIfShowing(a);
        hideIfVisible(a)
    } else {
        hideIfVisible("infoloaderdiv")
    }
}
function stopigation(a) {
    stopProp(a)
}
function stopProp(a) {
    a = a || event;
    if (typeof a.stopPropagation == "function") {
        a.stopPropagation()
    } else {
        a.cancelBubble = true
    }
}
function promptAuthForPage(a) {
    displayAuthDialog(function () {
        window.location = a
    }, true)
}
function displayAuthDialog(b, e) {
    var d = 860;
    var a = 600;
    if (jQuery.browser.msie) {
        d = 870;
        a = 600
    }
    if (!b) {
        b = function () {}
    }
    if (e) {
        var f = b
    } else {
        var f = function () {
            b();
            $("body").css("cursor", "wait");
            var g = new RegExp(HOSTBASE + "/?(logon)?$", "i");
            if (g.test(window.location)) {
                window.location = SECBASE_URL
            } else {
                window.location.reload(true)
            }
        }
    }
    showPopWin(SECBASE_URL + "/logon/modal?modal=true", d, a, f)
}
function displayUpdateEmailDialog() {
    var b = 860;
    var a = 600;
    if (jQuery.browser.msie) {
        b = 870;
        a = 600
    }
    showPopWin(SECBASE_URL + "/creditsignup/updateemail", b, a, function () {})
}
function ajaxResponse(j, f, d, g, l, k, a, e) {
    hideProgressAnim(g);
    var b = new RegExp("Caught Error:");
    var h = b.test(d.responseText);
    if (h) {
        return l("")
    }
    if (d.responseText == "") {
        return l("")
    }
    if (j.length < 1) {
        return null
    }
    if (!j[0]) {
        if (e) {
            alert("Your session has expired for your protection, and this window will now automatically close. Please reopen it and you will be prompted to logon.");
            closeThis()
        } else {
            if (!k) {
                k = function () {}
            }
            displayAuthDialog(k, a)
        }
        return null
    }
    return l(j[1])
}
function ajaxRequest(a, k, e, f, g, j, b, d) {
    if (!f) {
        showProgressAnim(g)
    }
    if (!j) {
        j = function () {
            ajaxRequest(a, k, e, f, g, j, b, d)
        }
    }
    e.stk = Cookie.get(TRKCK);
    var h = function (m, l, n) {
        ajaxResponse(m, l, n, g, k, j, b, d)
    };
    gSavingsAjaxSearch = $.ajax({
        url: a,
        type: "post",
        success: h,
        dataType: "json",
        data: e
    })
}
function openModalWithAuthRequired(a) {
    ajaxRequest(TRUEBASE_URL + "/mainajax/authcheck", a, {}, false, false, a, true)
}
function openModalWithAuthRequiredAndReloadPageOnSuccess(a) {
    ajaxRequest(TRUEBASE_URL + "/mainajax/authcheck", a, {}, false, false, a, false)
}
function logEvent(g, f, a, j, e, h, b) {
    if (g == "AutoInsClick") {
        var k = document.createElement("script");
        k.src = "https://pixel.mathtag.com/event/js?mt_id=101886&mt_adid=146&v1=&v2=&v3=&s1=&s2=&s3=";
        k.type = "text/javascript";
        document.getElementsByTagName("body")[0].appendChild(k)
    }
    var d = {
        eventCode: g
    };
    if (f) {
        d.eventInformation = f
    }
    if (a) {
        d.site = a
    }
    if (j) {
        d.extraparams = j
    }
    if (e) {
        d.prefix = e
    }
    if (h) {
        d.ovmtc = h
    }
    if (b) {
        d.impressionofferid = b
    }
    ajaxRequest(BASE_URL + "/events/fire/", function () {}, d, true)
}
function logAndOpenUrl(d, a, b) {
    logEvent(d, a, b);
    window.open(b)
}
function logBankrateAd(b, f, g, e, a, d) {
    params = {
        subnavLink: b,
        requestUri: f,
        title: g,
        width: e,
        height: a,
        adId: d
    };
    ajaxRequest(BASE_URL + "/mainajax/bankrateads", function () {}, params, true)
}
function addElement(b, a) {
    b.append(a);
    return a
}
function addElementWithText(b, d, a) {
    a.append(document.createTextNode(d));
    b.append(a);
    return a
}
function addStrongWithText(b, d) {
    var a = new Element("strong");
    addElementWithText(b, d, a);
    return a
}
function addtxt(a, b) {
    a.appendChild(document.createTextNode(b))
}
function addStyledText(parent, jsonStr) {
    var _jsonObj = eval(jsonStr);
    for (var i = 0; i < _jsonObj.items.length; i++) {
        var _txt = _jsonObj.items[i].text;
        var _color = _jsonObj.items[i].color;
        var _txt_element = new Element("span", {
            id: "_txt" + i
        });
        if (Prototype.Browser.IE) {
            _txt_element.style.color = _color
        } else {
            _txt_element.setAttribute("style", "color:" + _color + ";")
        }
        parent.appendChild(_txt_element);
        _txt_element.appendChild(document.createTextNode(_txt))
    }
}
function formatDate(d) {
    var a = new Date(d * 1000);
    var e = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var b = a.getDate().toString();
    return e[a.getDay()] + " " + translateMonth(a.getMonth()) + " " + b + ", " + a.getFullYear() + " " + formatTime(a)
}
function translateMonth(a) {
    var b = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return b[a]
}
function formatTime(b) {
    var a = b.getHours();
    var d = "AM";
    if (a >= 12) {
        d = "PM";
        a -= 12
    }
    if (a == 0) {
        a = "12"
    }
    var e = b.getMinutes();
    if (e < 10) {
        e = "0" + e
    }
    return a + ":" + e + " " + d
}
function toggleScoreHistory(a) {
    if (a == 1) {
        $("#aboutLink").attr("class", "active");
        $("#historyLink").attr("class", "");
        $("#aboutScoreArea").css("display", "block");
        $("#flashScoreBlock").css("display", "none");
        $("#aboutHeader").css("display", "inline");
        $("#historyHeader").css("display", "none");
        $("#scoreToggleSelected").val("about")
    } else {
        $("#aboutLink").attr("class", "");
        $("#historyLink").attr("class", "active");
        $("#aboutScoreArea").css("display", "none");
        $("#flashScoreBlock").css("display", "block");
        $("#aboutHeader").css("display", "none");
        $("#historyHeader").css("display", "inline");
        $("#scoreToggleSelected").val("history")
    }
}
function getContent(j, h, d, f, b, g) {
    var e = {};
    deselectAllTabs();
    if (h) {
        e.pg = h
    }
    if (d) {
        e.concat = d
    }
    if (f) {
        e.nocount = true
    }
    e.isajax = true;
    var a = function (k) {
        j(k)
    };
    ajaxRequest(BASE_URL + b, a, e)
}
function sendToFriend(d, b) {
    var a = function () {
        showPopWin(BASE_URL + "/shareoffer?modal=true&content=" + d + "&type=" + b, 860, 650, function () {}, "friendModal")
    };
    openModalWithAuthRequired(a)
}
function toggleAlert(contentId, type) {
    openModalWithAuthRequired(function () {
        var toggleCallback = function (response) {
            if (!response) {
                alert("A problem occurred. Please try again later.");
                return
            }
            var data = eval(response);
            var alertExists = data.alertExists;
            var p = $("#commentAlert0");
            if (p.length != 0) {
                p.removeClass("articleDeleteCommentAlert");
                p.removeClass("articleAddCommentAlert");
                p.addClass(alertExists == "true" ? "articleDeleteCommentAlert" : "articleAddCommentAlert")
            }
            for (var i = 1; i < 11; i++) {
                var c = $("#commentAlert" + i);
                if (c.length != 0) {
                    c.removeClass("alertNotChecked");
                    c.removeClass("alertChecked");
                    c.addClass(alertExists == "true" ? "alertChecked" : "alertNotChecked")
                }
            }
        };
        var progressIconId = false;
        var url = "/mainajax/comments/alert";
        var params = {
            content: contentId,
            type: type
        };
        ajaxRequest(TRUEBASE_URL + url, toggleCallback, params, false, progressIconId)
    })
}
function showMenu(b, a) {
    $(b).css("display", "block");
    a.click = function () {
        hideMenu(b, a);
        return false
    }
}
function hideMenu(b, a) {
    $(b).css("display", "none");
    a.click = function () {
        showMenu(b, a);
        return false
    }
}
function makeTooltip(k, o, q, e, p, g, m) {
    var f = $("#" + k);
    var j = $("#" + o);
    var d = ".25";
    var b = "1";
    var n = "-";
    var l = "-";
    var r = m ? m : "251";
    j.css("width", r + "px");
    if (g == "bottom") {
        d = ".25";
        b = ".05";
        l = ""
    } else {
        if (g == "right") {
            d = "1";
            b = ".15"
        } else {
            if (g == "left") {
                d = ".02";
                b = ".15";
                n = ""
            }
        }
    }
    if (q) {
        f.onclick = function () {
            return false
        };
        f.css("cursor", "help")
    }
    if (p) {
        var t = j.width();
        var a = $("#vbr" + o).width();
        $("#vtl" + o).css("width", (t - a) + "px");
        $("#vbl" + o).css("width", (t - a) + "px");
        var v = $("#vbl" + o).height();
        $("#vbr" + o).css("height", (v) + "px");
        var u = n + (t * d);
        var h = l + (j.height() * b);
        j.css("left", u + "px");
        j.css("top", h + "px");
        f.focus(function () {
            j.css("display", "block")
        });
        f.blur(function () {
            j.css("display", "none")
        })
    }
    if (!e) {
        f.mouseover(function () {
            j.css("display", "block")
        });
        f.mouseout(function () {
            j.css("display", "none")
        })
    }
    if (!p) {
        f.bind("mouseover", function () {
            j.css("display", "block");
            var A = j.width();
            var y = $("#vbr" + o).width();
            $("#vtl" + o).css("width", (A - y) + "px");
            $("#vbl" + o).css("width", (A - y) + "px");
            var z = $("#vbl" + o).height();
            $("#vbr" + o).css("height", (z) + "px");
            var w = n + (A * d);
            var B = l + (j.height() * b);
            j.css("left", w + "px");
            j.css("top", B + "px")
        })
    }
    j.css("display", "none");
    j.css("z-index", 1000)
}
function setupHoverAction(b, d) {
    var a = $("#" + b);
    var e = $("#" + d);
    if (!a) {
        return
    }
    a.bind("mouseover", function () {
        e.css("display", "block")
    });
    a.bind("mouseout", function () {
        e.css("display", "none")
    })
}
function showConfirmAuth(d, a, b) {
    var e = function () {
        $(d).action = b;
        $(d).submit();
        var f = $("#updateScoreButton");
        if (a && f != null) {
            f.click = function () {
                return false
            };
            f.attr("class", "updateScoreWorking")
        }
    };
    showPopWin(BASE_URL + "/mainajax/confirmauth?modal=true", 860, 400, e, "confirmAuth")
}
function showConfirmAuthForScore(e, a, d, b) {
    var f = function () {
        $(e).action = d;
        $(e).submit();
        var g = $("#updateScoreButton");
        if (a && g != null) {
            g.click = function () {
                return false
            };
            g.attr("class", "updateScoreWorking")
        }
    };
    showPopWin(BASE_URL + "/mainajax/confirmauth/score?modal=true&type=" + b, 860, 400, f, "confirmAuth")
}
function showCreditErr(b, a, d) {
    popupWinOnload(function () {
        showPopWin(BASE_URL + b, 860, 500, function () {});
        if (a && d) {
            $(a).click = function () {
                alert(d);
                return false
            }
        }
    })
}
function getSelected(a) {
    var b = $("#" + a);
    if (b == null) {
        return null
    }
    return b.val()
}
function setSelected(b, a) {
    s = $("#" + b);
    s.val(a)
}
function getNumber(a, b) {
    if (!isDefined(b)) {
        b = false
    }
    if (a == null) {
        return false
    }
    var d = $("#" + a).val();
    d = parseInt(d.replace(/\$|\,|%/g, ""));
    if (!b && d == 0) {
        return false
    }
    if (isNaN(d)) {
        return false
    }
    return d + 0
}
var Cookie = {
    set: function (e, g, a, h, f) {
        var b = e + "=" + escape(g || "");
        if (a) {
            var j = new Date();
            j.setTime(j.getTime() + (86400000 * parseFloat(a)));
            b += "; expires=" + j.toGMTString()
        }
        if (h) {
            b += "; path=" + escape(h)
        }
        if (f) {
            b += "; domain=" + escape(f)
        }
        return (document.cookie = b)
    },
    get: function (a) {
        var b = document.cookie.match(new RegExp("(^|;)\\s*" + escape(a) + "=([^;\\s]*)"));
        return (b ? unescape(b[2]) : null)
    },
    erase: function (a) {
        var b = Cookie.get(a) || true;
        Cookie.set(a, "", -1);
        return b
    },
    accept: function () {
        if (typeof navigator.cookieEnabled == "boolean") {
            return navigator.cookieEnabled
        }
        Cookie.set("_test", "1");
        return (Cookie.erase("_test") === "1")
    }
};

function getMostCommentedContent(f, a, b, e) {
    var d = function (g) {
        updateContent(g, e, "mostcmntli")
    };
    getContent(d, f, a, b, "/all/" + e + "/mostcommented", "mostcmntli");
    setSeeAllLink(e, "mostcommented", "See all most commented " + e + "...");
    return false
}
function getHighestRatedContent(f, a, b, e) {
    var d = function (g) {
        updateContent(g, e, "highrateli")
    };
    getContent(d, f, a, b, "/all/" + e + "/highestrated", "highrateli");
    setSeeAllLink(e, "highestrated", "See all highest rated " + e + "...");
    return false
}
function getPopularContent(f, a, b, e) {
    var d = function (g) {
        updateContent(g, e, "popularli")
    };
    getContent(d, f, a, b, "/all/" + e + "/mostviewed", "popularli");
    setSeeAllLink(e, "mostviewed", "See all most popular " + e + "...");
    return false
}
function getRecentContent(f, a, b, e) {
    var d = function (g) {
        updateContent(g, e, "recentli")
    };
    getContent(d, f, a, b, "/all/" + e + "/recent", "recentli");
    setSeeAllLink(e, "recent", "See all recent " + e + "...");
    return false
}
function setSeeAllLink(e, b, d) {
    var a = $("#seeAllLink");
    url = INSECBASE_URL + "/all/" + e + "/";
    a.update(d);
    url += b;
    a.href = url
}
function deselectAllTabs() {
    $("#recentli,#popularli,#mostcmntli,#highrateli").removeClass("selected")
}
function deselectAllHomeTabs() {
    var a = ["karmaOffers", "newsArticles", "creditTools", "qa"];
    a.each(function (b) {
        $("#" + b + "Li").removeClass("selected");
        $("#" + b + "Container").css("display", "none")
    })
}
function chooseHomeTab(b, d, e) {
    deselectAllHomeTabs();
    $("#" + b + "Li").addClass("selected");
    $("#" + b + "Container").css("display", "block");
    var a = $("#seeAllLink");
    a.href = INSECBASE_URL + e;
    a.update(d)
}
function updateContent(response, contentType, toggledTab) {
    var contentList = $(contentType);
    contentList.innerHTML = response;
    var scriptElements = contentList.getElementsByTagName("script");
    for (var i = 0; i < scriptElements.length; i++) {
        eval(scriptElements[i].innerHTML)
    }
    hideProgressAnim();
    $(toggledTab).addClass("selected")
}
function setClassAttribute(a, b) {
    a = $(a);
    a.attr("class", b)
}
function setupRecentContent(a) {
    getRecentContent(1, false, true, a)
}
function setupHighestRatedContent(a) {
    getHighestRatedContent(1, false, true, a)
}
function showRatings() {
    return toggleRatings("block", "Collapse", hideRatings)
}
function hideRatings() {
    return toggleRatings("none", "Expand", showRatings)
}
function toggleRatings(d, b, a) {
    $("#ratingExpand").css("display", "block");
    var e = $("#ratingToggleLnk");
    e.onclick = a;
    e.update(b);
    return false
}
function printHeader() {
    var b = window.open("", "", "width=665,height=600");
    var a = '<html><head><link rel="stylesheet" type="text/css" href="' + BASE_URL + '/res/css/global.css" /> <!--[if IE]> <link rel="stylesheet" type="text/css" href="' + BASE_URL + '/res/css/ie.css" /><![endif]--></head><body><div id="printWindowArea">';
    if (showCkLogo) {
        a += '<img id="printWindowLogo" src="' + BASE_URL + '/res/img/ck_logo.png" alt="Credit Karma" />'
    }
    a += '<div class="content-top-round"></div><div id="mainContent"><h2>' + $("#itemTitle").html() + "</h2>";
    b.document.write(a);
    return b
}
function closePrint(a) {
    a.document.write('</div><div class="content-bottom-gray"></div></div></body></html>');
    a.document.close();
    a.print()
}
function printItem() {
    var a = printHeader();
    a.document.write($("#itemContent").html());
    closePrint(a)
}
function printFactor() {
    var a = printHeader();
    a.document.write("<p>" + $("#itemContent").html() + "</p>");
    a.document.write("<h2>How to Fix</h2>");
    a.document.write("<p>" + $("#fixContent").html() + "</p>");
    closePrint(a)
}
function printQuestion() {
    var a = printHeader();
    a.document.write($("#qaAnswer").html());
    closePrint(a)
}
function trim(a) {
    if (a) {
        return a.replace(/^\s+|\s+$/g, "")
    } else {
        return ""
    }
}
function selectNav(a) {
    if (a) {
        a.addClass("active");
        $(a).parent().addClass("activeLI")
    }
    return true
}
function checkRequiredPref(b, a) {
    if (b.checked) {
        $(a).checked = true
    }
}
function toggleSubPref(d, b) {
    for (var a in b) {
        $(b[a]).checked = d.checked
    }
}
function placeDropdown(d) {
    var a = $("#catLink" + d);
    var b = $("#catMenu" + d);
    if (!a || !b) {
        return
    }
    Element.clonePosition(b, a, {
        offsetLeft: -10,
        offsetTop: 17,
        setWidth: false,
        setHeight: false
    })
}
function chooseTab(d, f, e, g, b, a) {
    $("a." + f).removeClass("selected");
    $("#" + e + d + g).addClass("selected");
    $("div." + b).css("display", "none");
    $("#" + d + a).css("display", "block")
}
function chooseQuestionTab(a) {
    chooseTab(a, "questionA", "", "Li", "questionTabDiv", "Tab")
}
function chooseCcTab(a) {
    chooseTab(a, "ccSplashNav", "ccSplashNav_", "", "ccTabData", "Tab")
}
function sortCCOffers(b, e) {
    var d = $("#sortKeyField");
    if (d.val() == b) {
        if (sortDirection == "sortAscending") {
            sortDirection = "sortDescending"
        } else {
            sortDirection = "sortAscending"
        }
    } else {
        if (b) {
            d.val() = b
        }
    }
    var a = BASE_URL + "/all/creditcards/" + sortDirection;
    if (e) {
        document.forms.ccSortForm.action = a + "/pg/" + e
    } else {
        document.forms.ccSortForm.action = a
    }
    document.forms.ccSortForm.submit()
}
function updateCardRec(a) {
    $(".ccwidgetTabs, .widgetGradient").removeClass("selected");
    $("#ccwidgetTab" + a).addClass("selected");
    $("#ccwidget" + a).addClass("selected")
}
function submitSurvey() {
    var h = function () {
        displaySurveyResults($("#survey").value)
    };
    var g = {};
    var f = new Array();
    var e = $("#survey_form");
    var a = 0;
    for (var d = 0; d < e.elements.length; d++) {
        if (e.elements[d].type == "checkbox") {
            if (e.elements[d].checked == true) {
                f[a] = e.elements[d].value;
                a++
            }
        }
        if (e.elements[d].type == "radio") {
            if (e.elements[d].checked == true) {
                f[a] = e.elements[d].value;
                a++
            }
        }
    }
    if (a == 0) {
        alert("Please select an answer to complete the survey.");
        hideSurveyProgressAnim();
        return false
    }
    g.answer = f.toString();
    g.survey = $("#survey").val();
    var b = "/mainajax/surveys/save";
    showSurveyProgressAnim();
    ajaxRequest(BASE_URL + b, h, g, false, false, false, true)
}
function displaySurveyResults(e) {
    var d = function (t) {
        if (!t) {
            return
        }
        var u = $("#result_list");
        while (u.hasChildNodes()) {
            u.removeChild(u.firstChild)
        }
        var y = t.survey.showScores;
        var j = y == 1 ? true : false;
        var o = 850;
        var q = 0;
        var m = 0;
        if (j) {
            for (var r = 0; r < t.answers.length; r++) {
                if (t.answers[r].avgScore > q) {
                    q = t.answers[r].avgScore
                }
                if (t.answers[r].avgScore < o) {
                    o = t.answers[r].avgScore
                }
            }
            o = o - 40;
            m = 195 / (q - o);
            $("#scoreExpl").css("display", "block")
        } else {
            $("#scoreExpl").css("display", "none")
        }
        for (var r = 0; r < t.answers.length; r++) {
            var h = t.answers[r].answerId;
            var v = t.answers[r].cnt;
            var n = t.answers[r].avgScore;
            var k = t.answers[r].percent;
            var z = t.answers[r].answer;
            var l = document.createElement("li");
            var f = document.createElement("p");
            f.className = "surveyResult";
            var p = document.createElement("span");
            p.className = "surveyResultBar";
            if (j) {
                p.style.width = ((n - o) * m) + "px"
            } else {
                p.style.width = (k * 1.95) + "px"
            }
            f.appendChild(p);
            var A = document.createElement("strong");
            if (j) {
                if (n == 0) {
                    n = "N/A"
                }
                A.appendChild(document.createTextNode(" " + n))
            } else {
                A.appendChild(document.createTextNode(" " + k + "%"))
            }
            f.appendChild(A);
            var w = document.createElement("p");
            w.className = "surveyAnswer";
            w.appendChild(document.createTextNode(z));
            l.appendChild(w);
            l.appendChild(f);
            u.appendChild(l)
        }
        $("#question").html(t.survey.question);
        $("#surveyVotesCounter").html("(Total Votes: " + t.total + ")");
        $("#survey").value = t.survey.surveyId;
        var g = t.surveyCount > 1 ? true : false;
        if (e == 0 || !g) {
            $("#all_done").css("display", "block")
        }
        toggleSurveyVisible("results", g)
    };
    var a = "/mainajax/surveys/getresults";
    var b = {
        survey: e,
        surveyDontget: $("#survey").value
    };
    ajaxRequest(BASE_URL + a, d, b, false)
}
function nextSurvey() {
    var e = function b(w) {
        if (!w) {
            return
        }
        if (w.survey == undefined) {
            displaySurveyResults(0);
            return
        }
        var t = w.survey.surveyId;
        var l = w.survey.question;
        var g = w.survey.multiSelect == 1 ? true : false;
        var h = g ? "checkbox" : "radio";
        var q = $("#answer_list");
        while (q.hasChildNodes()) {
            q.removeChild(q.firstChild)
        }
        for (var m = 0; m < w.answers.length; m++) {
            var v = w.answers[m].answerId;
            var o = w.answers[m].answer;
            var f = w.answers[m].isRadio == 1 ? true : false;
            var u = document.createElement("li");
            var r = "";
            if (g) {
                if (f) {
                    r += "_radio"
                }
                r += "_" + v
            }
            try {
                var n = "";
                if (g) {
                    if (f) {
                        n = 'onclick="uncheckOtherAnswers(' + v + ')"'
                    } else {
                        n = 'onclick="uncheckRadioAnswers(' + v + ')"'
                    }
                }
                newInput = document.createElement('<input type="' + h + '" id="answer' + r + '" name="answer' + r + '" value="' + v + '" ' + n + " />")
            } catch (k) {
                newInput = document.createElement("input");
                newInput.setAttribute("type", h);
                newInput.setAttribute("name", "answer" + r);
                newInput.setAttribute("id", "answer" + r);
                newInput.setAttribute("value", v);
                if (g) {
                    if (f) {
                        newInput.setAttribute("onclick", "uncheckOtherAnswers(" + v + ")")
                    } else {
                        newInput.setAttribute("onclick", "uncheckRadioAnswers(" + v + ")")
                    }
                }
            }
            u.appendChild(newInput);
            var j = document.createTextNode(" " + o);
            var p = document.createElement("span");
            p.appendChild(j);
            u.appendChild(p);
            q.appendChild(u)
        }
        $("#question").html(l);
        $("#survey").val("surveyId");
        toggleSurveyVisible("survey")
    };
    showSurveyProgressAnim();
    var a = "/mainajax/surveys/getnext";
    var d = {};
    ajaxRequest(BASE_URL + a, e, d, false)
}
function uncheckOtherAnswers(e) {
    var d = $("answer_radio_" + e);
    if (!d.checked) {
        return
    }
    var b = $("#survey_form");
    for (var a = 0; a < b.elements.length; a++) {
        if (b.elements[a].type == "checkbox" && b.elements[a].value != e && b.elements[a].checked == true) {
            b.elements[a].checked = false
        }
    }
}
function uncheckRadioAnswers(e) {
    var d = $("answer_" + e);
    if (!d.checked) {
        return
    }
    var b = $("#survey_form");
    for (var a = 0; a < b.elements.length; a++) {
        if (b.elements[a].type == "checkbox" && b.elements[a].value != e && b.elements[a].checked == true) {
            if (b.elements[a].name.substring(0, 12) == "answer_radio") {
                b.elements[a].checked = false
            }
        }
    }
}
function toggleSurveyVisible(b, a) {
    if (b == "results") {
        $("#submitButton").css("display", "none");
        if (a) {
            $("#nextSurvey").css("display", "block")
        }
        $("#surveyOptions").css("display", "none");
        $("#surveyResults").css("display", "block");
        $("#surveyVotesCounter").css("display", "block")
    } else {
        $("#submitButton").css("display", "block");
        $("#nextSurvey").css("display", "none");
        $("#surveyOptions").css("display", "block");
        $("#surveyResults").css("display", "none");
        $("#surveyVotesCounter").css("display", "none");
        $("#scoreExpl").css("display", "none")
    }
    hideSurveyProgressAnim();
    hideProgressAnim()
}
function showSurveyProgressAnim() {
    showIfHidden("infoloaderdiv_survey");
    showIfHidden("infoloader_survey")
}
function hideSurveyProgressAnim() {
    hideIfShowing("infoloaderdiv_survey");
    hideIfShowing("infoloader_survey")
}
function updateOvernightAvgs(d, a) {
    $("#ratesWidget").html(d);
    var b = $(a);
    $("#tabOneNOA").removeClass("selected");
    $("#tabTwoNOA").removeClass("selected");
    $("#tabThreeNOA").removeClass("selected");
    b.addClass("selected")
}
function showScoreDetails() {
    $("#offerScoreExpand").css("display", "block");
    var a = $("#offerScoreToggle");
    a.click = hideScoreDetails;
    a.update("Close Score Details");
    return false
}
function hideScoreDetails() {
    $("#offerScoreExpand").css("display", "block");
    var a = $("#offerScoreToggle");
    a.click = showScoreDetails;
    a.update("Score Details");
    return false
}
function toggleAll(a, b) {
    $(a).each(function (d) {
        d.checked = b
    })
}
function cancelBubble(a) {
    if (!a) {
        var a = window.event
    }
    a.cancelBubble = true;
    if (a.stopPropagation) {
        a.stopPropagation()
    }
}
var axel = Math.random() + "";
var ord = axel * 1000000000000000000;
$(window).bind("load", function () {
    var a = parseFloat(navigator.appVersion.split("MSIE")[1]);
    if ((a >= 5.5) && (a < 7) && (document.body.filters)) {
        $(".ie-fix-opacity").each(function (b) {
            var e = b.currentStyle.backgroundImage;
            var d = e.substring(e.indexOf('"') + 1, e.lastIndexOf('"'));
            b.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + d + "', sizingMethod='scale')";
            b.style.backgroundImage = "none"
        })
    }
}, false);

function formatCurrency(a, e) {
    if (a == null) {
        a = 0
    }
    a = a.toString().replace(/\$|\,/g, "");
    if (isNaN(a)) {
        a = 0
    }
    a = Math.round(a).toString();
    for (var b = 0; b < Math.floor((a.length - (1 + b)) / 3); b++) {
        a = a.substring(0, a.length - (4 * b + 3)) + "," + a.substring(a.length - (4 * b + 3))
    }
    var d = "";
    if (!isDefined(e) || e) {
        d = "N"
    }
    return d + a
}
function formatCurrencyNoNegative(a, b) {
    if (a == null) {
        a = 0
    }
    a = a.toString().replace(/\$|\,|-/g, "");
    return formatCurrency(a, b)
}
function formatPercent(b) {
    if (b == null || isNaN(b)) {
        b = 0
    }
    var a = Math.round(b * 100) / 100;
    return (a > 100) ? 100 : a
}
function activateTwitter() {
    $("#twitterLink").css("text-decoration", "underline");
    return false
}
function deactivateTwitter() {
    $("#twitterLink").css("text-decoration", "none");
    return false
}
function isDefined(a) {
    return (typeof (a) == "undefined") ? false : true
}
function toggleFilters(a, b) {
    var a = document.getElementById(a);
    var b = document.getElementById(b);
    if (a && $(a).css && $(a).css("display") != "none") {
        $(a).css("display", "none");
        $(b).removeClass("expanded")
    } else {
        $(a).css("display", "block");
        $(b).addClass("expanded")
    }
}
function textCountDown(b, a, d) {
    $("#" + b).bind("keyup", function () {
        $("#" + a).html(d - $("#" + b).val().length)
    });
    $("#" + a).html(d - $("#" + b).val().length)
}
function removeTutorialBar() {
    ajaxRequest(BASE_URL + "/mainajax/endsession/tutorial", function () {}, {}, true, false, true);
    $("#tutorialBar").hide()
}
function removeMaintenance() {
    ajaxRequest(BASE_URL + "/mainajax/endsession/maintenance", function () {}, {}, true, false, true);
    $("#maintenanceWarning").hide()
}
function pingAndHide(a, b) {
    ajaxRequest(a, function () {}, {}, true, false, true);
    $("#" + b).hide()
}
function vantageUpdate() {
    showPopWin(BASE_URL + "/mainajax/modal/vantageupdate", 900, 740, function () {
        window.location.href = "/scorevantage"
    })
}
function transriskUpdate(a) {
    showPopWin(BASE_URL + "/mainajax/modal/transriskupdate", 900, 740, function () {
        window.location.href = a
    })
}
function autoinsuranceUpdate() {
    showPopWin(BASE_URL + "/savings/autoinsurance/editdetailsscore", 900, 740, function () {
        window.location.href = "/scoreinsurance"
    })
}
function setupUsabillaSurvey() {
    var a = {
        id: "13376670634d13b37780bff",
        title: "What do you think of our new Score Center?",
        description: "Participate in a short visual survey and help us to improve our website.",
        button: "Give feedback",
        label: "in just 2 minutes"
    };
    document.write('<style type="text/css">');
    document.write("#u_widget {display:none; color: #434343; background: #dbfaff;background: -moz-linear-gradient(100% 100% 90deg, #b4e8f1, #dbfaff); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#dbfaff), to(#b4e8f1)); font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; position: fixed; bottom: 20px; right: 50px; width: 240px; padding: 10px;  box-shadow: 1px 1px 5px rgba(130, 130, 130, .4); -webkit-box-shadow: 1px 1px 5px rgba(130, 130, 130, .4); -moz-box-shadow: 1px 1px 5px rgba(130, 130, 130, .4); border: 1px solid #91d1db;}");
    document.write("#u_widget:hover { filter:alpha(opacity=100); -moz-opacity:1; -khtml-opacity: 1; opacity: 1;}");
    document.write(".u_title { display: block; font-weight: bold; padding: 0 0 10px 0; text-shadow: 0 0 3px rgba(255, 255, 255, 1);}");
    document.write(".u_description { font-weight: normal; font-size: 12px; display: block; padding: 0 0 10px 0; text-shadow: 0 0 3px rgba(255, 255, 255, 1);}");
    document.write(".u_cta {  display: block; float: left; font-weight: normal; font-size: 12px; margin-top: 5px;}");
    document.write(".u_cta a { background: #cf4900; background: -moz-linear-gradient(100% 100% 90deg,#b74000,#ff5a00); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ff5a00), to(#b74000)); color: white; padding: 3px 7px; margin-right: 3px;  border-radius: 2px; -moz-border-radius: 2px; border: 1px solid #ddf6fa;  font-weight: bold; text-decoration: none; }");
    document.write(".u_cta a:hover { border-color: white; background: #cf4900; background: -moz-linear-gradient(100% 100% 90deg, #ff5a01, #f05400); background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#f05400), to(#ff5a01));  }");
    document.write("</style>");
    document.write('<div id="u_widget">');
    document.write('    <span class="u_title">' + a.title + "</span>");
    document.write('    <span class="u_description">' + a.description + "</span>");
    document.write('    <span class="u_cta"><a href="http://usabilla.com/rate/' + a.id + '/start/?src=widget" class="u_button">' + a.button + "</a> " + a.label + "</span>");
    document.write("</div>");
    checkSurveyDisplay();
    $(window).bind("resize", checkSurveyDisplay)
}
function checkSurveyDisplay() {
    var a = document.viewport.getDimensions();
    var b = $("#u_widget");
    if (b != null) {
        if (a.width >= 1556) {
            b.css("display", "block")
        } else {
            b.css("display", "none")
        }
    }
}
function confirmScreenName(g_signupStep) {
    var snameEle = $("#sname");
    var sname = $("#sname").val();
    var snameTitle = $("#lbl-sname");
    var statusTxtEle = $("#advice-sname");
    var statusImgEle = $("#img-sname");
    statusImgEle.show();
    statusImgEle.css("display", "inline");
    statusImgEle.attr("src", MEDIA_URL + "/res/img/layout/loading-animation.gif");
    var callback = function (response) {
        statusTxtEle.show();
        var data = eval(response);
        if (data.exists) {
            snameEle.removeClass("validation-failed");
            snameEle.addClass("validation-passed");
            snameEle.addClass("screenname-available");
            snameTitle.removeClass("validation-failed");
            snameTitle.addClass("validation-passed");
            statusTxtEle.html("This screen name is available");
            statusTxtEle.css("color", "#09a701");
            statusImgEle.attr("src", MEDIA_URL + "/res/img/layout/check.png")
        } else {
            snameEle.removeClass("screenname-available");
            snameEle.removeClass("validation-passed");
            snameEle.addClass("validation-failed");
            snameTitle.removeClass("validation-passed");
            snameTitle.addClass("validation-failed");
            statusTxtEle.html("This screen name is already in use");
            statusImgEle.attr("src", MEDIA_URL + "/res/img/layout/error.png")
        }
        if (g_signupStep != "partnerOneStep" && g_signupStep != "partner1") {
            toggleSignupStep1Button()
        }
    };
    var progressID = "snameSpinner";
    var params = {
        userName: $("#sname").val()
    };
    var url = BASE_URL + "/mainajax/screenname/validate";
    ajaxRequest(url, callback, params, false, progressID)
}
function toggleInfoGraphic() {
    var a = getCacheSelector("div#infoGraphicReplacement");
    var b = getCacheSelector("div#myProfile");
    if (a.css("display") == "none") {
        a.css("display", "block");
        b.css("display", "none")
    } else {
        a.css("display", "none");
        b.css("display", "block")
    }
}
function getCacheSelector(a) {
    if (typeof getCacheSelector.areas == "undefined") {
        getCacheSelector.areas = []
    }
    if (typeof getCacheSelector.areas[a] == "undefined") {
        getCacheSelector.areas[a] = $(a)
    }
    return getCacheSelector.areas[a]
}
function http_build_query(b, h, a) {
    var g, e, d = [],
        f = this;
    var j = function (o, p, l) {
        var m, n = [];
        if (p === true) {
            p = "1"
        } else {
            if (p === false) {
                p = "0"
            }
        }
        if (p !== null && typeof (p) === "object") {
            for (m in p) {
                if (p[m] !== null) {
                    n.push(j(o + "[" + m + "]", p[m], l))
                }
            }
            return n.join(l)
        } else {
            if (typeof (p) !== "function") {
                return f.urlencode(o) + "=" + f.urlencode(p)
            } else {
                throw new Error("There was an error processing for http_build_query().")
            }
        }
    };
    if (!a) {
        a = "&"
    }
    for (e in b) {
        g = b[e];
        if (h && !isNaN(e)) {
            e = String(h) + e
        }
        d.push(j(e, g, a))
    }
    return d.join(a)
}
function urlencode(a) {
    a = (a + "").toString();
    return encodeURIComponent(a).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+")
}
function is_object(a) {
    if (Object.prototype.toString.call(a) === "[object Array]") {
        return false
    }
    return a !== null && typeof a == "object"
}
$(document).ready(function () {
    if ($("li#hlogon a") != null) {
        $("li#hlogon a").click(function (a) {
            a.preventDefault();
            displayAuthDialog()
        })
    }
});

function deactivateLinkAfterClick(a) {
    if (this.clicked) {
        a.stop()
    }
    this.clicked = true
}
var gRecordedImpressions = false;

function recordOfferImpressions(b) {
    if (b === false) {
        return false
    }
    for (var a = 0; a < b.length; a++) {
        if (!isDefined(gRecordedImpressions[b[a].impressionOfferId])) {
            ajaxRequest("/events/pixel/recordimpression", function (d) {}, b[a]);
            gRecordedImpressions[b[a].impressionOfferId] = true
        }
    }
    return true
}
var g_CommentSubmitDeactive = false;

function submitComment(b, k, d, e, f) {
    if (g_CommentSubmitDeactive) {
        return
    }
    g_CommentSubmitDeactive = true;
    $(document).bind("ck:modalclose", function (p) {
        g_CommentSubmitDeactive = false
    });
    var o = (f) ? "cBodyError" + f : "cBodyError";
    var j = false;
    var n;
    var g = {
        content: b,
        type: k,
        isanon: (g_isAnonComment ? 1 : 0)
    };
    if (!e) {
        n = CKEDITOR.instances.cBody;
        g.body = n.getData();
        if (document.getElementById("cTitle") != null) {
            g.title = document.getElementById("cTitle").value
        }
        if (typeof ratingSelection == "string" && ratingSelection >= 1 && ratingSelection <= 5) {
            g.rating = ratingSelection
        }
        if (typeof customerServiceRatingSelection == "string" && customerServiceRatingSelection >= 1 && customerServiceRatingSelection <= 5) {
            g.customerServiceRating = customerServiceRatingSelection
        }
        if (typeof applicationProcessRatingSelection == "string" && applicationProcessRatingSelection >= 1 && applicationProcessRatingSelection <= 5) {
            g.applicationProcessRating = applicationProcessRatingSelection
        }
        if ($("#userProductRelationshipSelector") != null) {
            var h = $("#userProductRelationshipSelector").val();
            var m = parseInt(h);
            if (h == "Select" || m > 3 || m < 1) {
                scrollToEle($("#userProductRelationshipSelector"));
                $("#selectionError").css("display", "block");
                g_CommentSubmitDeactive = false;
                return
            }
            g.authorProductRelationship = h
        }
    } else {
        j = "infoloaderdiv" + f;
        n = CKEDITOR.instances["cBody" + f];
        g.body = n.getData();
        g.replyTo = e
    }
    var a = "/mainajax/comments/add";
    var l = function (p) {
        hideProgressAnim();
        if ($("#" + o)) {
            $("+" + o).css("display", "none")
        }
        if ($("#ratingError")) {
            $("#ratingError").css("display", "none")
        }
        g_CommentSubmitDeactive = false;
        if (p == "needsratingandbody") {
            $("#ratingError").css("display", "block");
            $("#" + o).css("display", "block");
            scrollToEle($(".rating-container"));
            return
        }
        if (p == "empty") {
            $("#" + o).css("display", "block");
            return
        }
        if (p == "needsrating") {
            $("#ratingError").css("display", "block");
            return
        }
        if (!p) {
            alert("A problem occurred while submitting your message. Please try again later.");
            return
        }
        clearCommentFields(e, f);
        if (p[1]) {
            if (!isDefined(e) && $("#commentSorting").length != 0 && $("#commentSorting").val() == "1") {
                window.location.hash = "commentsHeader";
                if ($("#currentPg").val() == 1) {
                    window.location.reload(true);
                    return
                }
                var u = window.location.href;
                if (k == 7) {
                    var r = new RegExp("/[0-9]+/?#?w*", "g");
                    var t = u.replace(r, "/1/#")
                } else {
                    var r = new RegExp("(\\?pg=[0-9]*)?#w*", "g");
                    var t = u.replace(r, "?pg=1#")
                }
                window.location.href = t
            } else {
                if (!isDefined(e) && $("#commentsFull").length != 0 && $("lastPage").length != 0) {
                    window.location.hash = "lastComment";
                    var u = window.location.href;
                    if (k == 7) {
                        var r = new RegExp("/[0-9]+/?#?w*", "g");
                        var t = u.replace(r, "/" + $("#lastPage").val() + "/#")
                    } else {
                        var r = new RegExp("(\\?pg=[0-9]*)?#w*", "g");
                        var t = u.replace(r, "?pg=" + $("#lastPage").val() + "#")
                    }
                    window.location.href = t
                } else {
                    if (isDefined(f)) {
                        var q = f.substring(0, f.indexOf("-"));
                        window.location.hash = "#comment-" + q;
                        window.location.reload(true)
                    } else {
                        if (window.location.hash !== "#lastComment") {
                            window.location.hash = "#lastComment";
                            window.location.reload(true)
                        } else {
                            window.location.reload(true)
                        }
                    }
                }
            }
        } else {
            showPopWin(BASE_URL + "/mainajax/modal/commentsubmit?modal=true&type=" + k, 860, 460, null, "confirmComment")
        }
    };
    ajaxRequest(TRUEBASE_URL + a, l, g, false, j, false, true);
    return false
}
var g_isAnonComment = false;

function switchCommenType(a) {
    g_isAnonComment = a;
    var b = getCacheSelector(".alertingBlock");
    if (b[0]) {
        $(b[0]).css("display", g_isAnonComment ? "none" : "block")
    }
    $(getCacheSelector("#imgpostuser")[0]).css("display", g_isAnonComment ? "none" : "block");
    $(getCacheSelector("#imgpostanon")[0]).css("display", g_isAnonComment ? "block" : "none")
}
function clearCommentFields(a, b) {
    var d;
    if (!a) {
        d = CKEDITOR.instances.cBody
    } else {
        d = CKEDITOR.instances["cBody" + b]
    }
    d.setData("");
    if (!a) {
        if ($("#cTitle") != null) {
            $("#cTitle").val("")
        }
        if ($("#userProductRelationshipSelector") != null) {
            $("#userProductRelationshipSelector").val("Select")
        }
    }
    if (typeof setSelectedStars == "function") {
        setSelectedStars(0, "star");
        setSelectedStars(0, "applicationstar");
        setSelectedStars(0, "csstar")
    }
}
function setupCommentValidation() {
    var a = new Validation("commentForm", {
        onSubmit: true
    });
    Validation.add("len-cbody", "Comments must not exceed 65,536 characters.", {
        maxLength: 65536
    });
    hideProgressAnim()
}
function setupReplyCommentValidation(a) {
    var b = new Validation("commentForm" + a, {
        onSubmit: true
    });
    Validation.add("len-cbody" + a, "Comments must not exceed 65,536 characters.", {
        maxLength: 65536
    });
    hideProgressAnim()
}
function editProfileImage() {
    openModalWithAuthRequired(function () {
        showPopWin(BASE_URL + "/profileEdit/image", 860, 650, function () {
            window.location.reload(true)
        })
    })
}
function flag(a, b) {
    openModalWithAuthRequired(function () {
        showPopWin(BASE_URL + "/flag/" + a + "/" + b, 860, 500, function () {}, "flagModal")
    })
}
function showAuthorTooltip(a) {
    document.getElementById("commentTTId-" + a).style.display = "block"
}
function hideAuthorTooltip(a) {
    document.getElementById("commentTTId-" + a).style.display = "none"
}
var _gCKEditorConfig = {
    uiColor: "",
    resize_dir: "vertical",
    height: 100,
    toolbar: [
        ["Bold", "Italic", "-", "NumberedList", "BulletedList", "-", "Link", "Unlink"]
    ],
    toolbarCanCollapse: false,
    startupFocus: false,
    browserContextMenu: false,
    browserContextMenuOnCtrl: false,
    removePlugins: "scayt,menubutton,contextmenu",
    language: "en",
    customConfig: ""
};

function showCommentReplyBlock(f) {
    hideAllCommentReplyBlocks();
    var e = $("#commentResponse" + f);
    var d = $("#commentCancelLink" + f);
    var a = $("#commentResponseLink" + f);
    if (e.css("display") == "none") {
        e.css("display", "block")
    }
    if (d.css("display") == "none") {
        d.css("display", "inline")
    }
    if (a.css("display") != "none") {
        a.css("display", "none")
    }
    var b = "cBody" + f;
    if (typeof CKEDITOR.instances[b] != "object") {
        CKEDITOR.replace(b, _gCKEditorConfig)
    } else {
        CKEDITOR.instances[b].focus()
    }
    return false
}
function hideAllCommentReplyBlocks() {
    $(".replyCopy").each(function (a, b) {
        if ($(b).css("display") != "none") {
            $(b).css("display", "none")
        }
    });
    $(".cancelReply").each(function (a, b) {
        if ($(b).css("display") != "none") {
            $(b).css("display", "none")
        }
    });
    $(".replyToComment").each(function (a, b) {
        if ($(b).css("display") == "none") {
            $(b).css("display", "inline")
        }
    });
    return false
}
function hideCommentReplyBlock(e) {
    var d = $("#commentResponse" + e);
    var b = $("#commentCancelLink" + e);
    var a = $("#commentResponseLink" + e);
    if (d.css("display") != "none") {
        d.css("display", "none")
    }
    if (b.css("display") != "none") {
        b.css("display", "none")
    }
    if (a.css("display") == "none") {
        a.css("display", "inline")
    }
    return false
}
function voteHelpful(e) {
    var f = $(e).attr("commentId");
    var d = $(".notHelpful-" + f)[0].checked;
    if (e.checked) {
        var b = $(".helpful-" + f);
        checkAll(b);
        $(document).bind("ck:modalclose", function (g) {
            uncheckAll(b)
        });
        openModalWithAuthRequiredAndReloadPageOnSuccess(function () {
            ajaxRequest(TRUEBASE_URL + "/mainajax/comments/vote/commentId/" + f, function (g) {
                uncheckAll(b);
                if (g !== false) {
                    addToAllCounters("helpfulCount-", f, 1);
                    addToAllCounters("commentAuthorHelped-", g, 1);
                    if (!d) {
                        addToAllCounters("totalResponseCount-", f, 1)
                    }
                    checkAll(b)
                }
            }, {
                returnNumId: true
            })
        })
    } else {
        var b = $(".helpful-" + f);
        for (var a = 0; a < b.length; a++) {
            b[a].checked = true
        }
    }
}
function uncheckAll(a) {
    for (var b = 0; b < a.length; b++) {
        a[b].checked = false
    }
}
function checkAll(a) {
    var d = a.attr("commentid");
    if (a.hasClass("notHelpful-" + d)) {
        uncheckAll($(".helpful-" + d))
    }
    if (a.hasClass("helpful-" + d)) {
        uncheckAll($(".notHelpful-" + d))
    }
    for (var b = 0; b < a.length; b++) {
        a[b].checked = true
    }
}
function voteNotHelpful(e) {
    var f = $(e).attr("commentId");
    var d = $(".helpful-" + f)[0].checked;
    if (e.checked) {
        var b = $(".notHelpful-" + f);
        checkAll(b);
        $(document).bind("ck:modalclose", function (g) {
            uncheckAll(b)
        });
        openModalWithAuthRequiredAndReloadPageOnSuccess(function () {
            ajaxRequest(TRUEBASE_URL + "/mainajax/comments/vote/commentId/" + f, function (g) {
                uncheckAll(b);
                if (g !== false) {
                    if (!d) {
                        addToAllCounters("totalResponseCount-", f, 1)
                    } else {
                        addToAllCounters("helpfulCount-", f, -1);
                        addToAllCounters("commentAuthorHelped-", g, -1)
                    }
                    checkAll(b)
                }
            }, {
                negativeVote: true,
                returnNumId: true
            })
        })
    } else {
        var b = $(".notHelpful-" + f);
        for (var a = 0; a < b.length; a++) {
            b[a].checked = true
        }
    }
}
function addToAllCounters(b, g, j) {
    var d = $("." + b + g);
    for (var e = 0; e < d.length; e++) {
        var k = getInnerText(d[e]);
        var h = k.indexOf(" ");
        var a = "";
        if (h != -1) {
            a = k.slice(h, k.length);
            var f = parseInt(k.slice(0, h))
        } else {
            var f = parseInt(k)
        }
        f = f + j;
        if (a == " Person Helped" || a == " People Helped") {
            if (f == 1) {
                updateInnerText(d[e], f.toString() + " Person Helped")
            } else {
                updateInnerText(d[e], f.toString() + " People Helped")
            }
        } else {
            if (containsInnerHtmlTags(d[e])) {
                updateInnerText(d[e], f.toString())
            } else {
                d[e].innerHTML = f.toString()
            }
        }
    }
    $(".helpful-desc.helpfulcounts-" + g).css("display", "block")
}
function containsInnerHtmlTags(a) {
    var d = $(a).contents();
    for (var b = 0; b < d.length; b++) {
        if (d[b].nodeType == 3) {
            return true
        }
    }
    return false
}
function getInnerText(a) {
    var d = $(a).contents();
    for (var b = 0; b < d.length; b++) {
        if (d[b].nodeType == 3) {
            return d[b].nodeValue.toString()
        }
    }
    return ""
}
function updateInnerText(a, b) {
    var d = $(a).contents().filter(function () {
        return this.nodeType == 3
    });
    if (d.length) {
        d.replaceWith(b)
    }
}
var ratingSelection = 0;
var applicationProcessRatingSelection = 0;
var customerServiceRatingSelection = 0;
var rating = new Array();
rating.star = 0;
rating.applicationstar = 0;
rating.csstar = 0;

function resetApplicationStars() {
    rating.applicationstar = 0;
    setSelectedStars(0, "applicationstar")
}
function resetCsStars() {
    rating.csstar = 0;
    setSelectedStars(0, "csstar")
}
function setSelectedStars(f, e) {
    if (f < 0 || f > 5 || !isDefined(f)) {
        return
    }
    var b = "ratingStars starOn";
    for (var d = 1; d <= 5; d++) {
        if (d - 1 == f) {
            b = "ratingStars starEmpty"
        }
        var a = $("#" + e + d);
        if (a.length != 0) {
            a.attr("class", b)
        }
    }
    switch (e) {
        case "star":
            ratingSelection = f;
            break;
        case "applicationstar":
            applicationProcessRatingSelection = f;
            break;
        case "csstar":
            customerServiceRatingSelection = f;
            break
    }
    if (f == 0) {
        for (var d = 1; d <= 5; d++) {
            $("#" + e + d).attr("class", "ratingStars")
        }
        if ($("." + e) != null) {
            $("." + e).css("display", "none")
        }
    } else {
        if ($("." + e) != null) {
            $("." + e).css("display", "block")
        }
    }
}
function scrollToEle(e) {
    if (typeof e != "object" || e.length != 1) {
        return
    }
    var f = e.offset().top;
    var b = e.height();
    var a = $(window).scrollTop();
    var d = $(window).height();
    if (f < a) {
        a = f - 100
    } else {
        if (f + b > a + d) {
            a = f + b - d + 100
        } else {
            return
        }
    }
    $("html, body").animate({
        scrollTop: a
    }, 500)
}
$(document).ready(function () {
    if ($("img.commentUpVoteAction") != null) {
        $("img.commentUpVoteAction").click(function () {
            var d = $(this).attr("commentId");
            openModalWithAuthRequired(function () {
                ajaxRequest(TRUEBASE_URL + "/mainajax/comments/vote/commentId/" + d, function (e) {
                    if (e == false) {} else {
                        $(".voteCount-" + d).html("+" + e)
                    }
                    $(".upVoteAction-" + d).css("display", "none");
                    $(".upVoteVoted-" + d).css("display", "inline")
                }, {})
            })
        })
    }
    if ($(".commentFlag img") != null) {
        $(".commentFlag img").click(function () {
            var d = $(this).attr("commentId");
            flag("comment", d)
        })
    }
    var b = $("#commentSorting");
    if (b) {
        b.change(function (f) {
            var d = getTarget(f);
            ajaxRequest(TRUEBASE_URL + "/mainajax/comments/changesortorder/sortorder/" + d.options[d.selectedIndex].value + "/contenttype/" + d.className, function (e) {
                if (e) {
                    window.location.reload(true)
                }
            }, {})
        })
    }
    if ($(".flagQuestion") != null) {
        $(".flagQuestion").each(function (d, e) {
            var f = $(e).attr("cid");
            $(e).click(function (g) {
                flag("qa", f)
            })
        })
    }
    if ($("span.bestComment") != null) {
        $("span.bestComment").click(function () {
            var d = $(this).attr("commentId");
            openModalWithAuthRequired(function () {
                ajaxRequest(TRUEBASE_URL + "/mainajax/comments/best/commentId/" + d, function (e) {
                    if (window.location.hash !== "#bestResponseHeaderBlock") {
                        window.location.hash = "#bestResponseHeaderBlock"
                    }
                    window.location.reload(true)
                }, {})
            })
        })
    }
    var a = function () {
        var d = $(this).attr("id");
        d = d.substring(0, d.length - 1);
        $(this).click(function () {
            var e = this.id.replace(d, "");
            rating[d] = e;
            setSelectedStars(rating[d], d)
        });
        $(this).mouseover(function () {
            var e = this.id.replace(d, "");
            var f = "ratingStars starHover";
            for (var g = 1; g <= 5; g++) {
                if (g - 1 == e) {
                    f = "ratingStars starEmpty"
                }
                $("#" + d + g).attr("class", f)
            }
        });
        $(this).mouseout(function () {
            if (!isDefined(rating[d] || rating[d] == 0)) {
                for (var e = 1; e <= 5; e++) {
                    $("#" + d + e).attr("class", "ratingStars")
                }
            } else {
                setSelectedStars(rating[d], d)
            }
        })
    };
    if ($(".offerRatingWidget span.ratingStars") != null) {
        $(".offerRatingWidget span.ratingStars").each(a)
    }
    if ($("#cTitle") != null) {
        $("#cTitle").keypress(function (d) {
            if (d.keyCode == 13) {
                d.preventDefault();
                $("#commentSubmitButton").click();
                return false
            }
        })
    }
    $("#userProductRelationshipSelector").change(function () {
        $("#selectionError").hide()
    });
    $(".offerRatingWidget").click(function () {
        $("#ratingError").hide()
    })
});
var CommentReplies = new(function () {
    this.numberVisible = 2;
    this.numberToAdd = 4;
    this.init = function () {
        $(".comment-bubble").each(function () {
            var e = $(this).attr("id");
            if (!e) {
                return
            }
            e = e.replace("comment-", "");
            var a = $(this);
            var b = 0;
            while (a.next().hasClass("reply-bubble")) {
                a = a.next();
                a.attr({
                    "data-cid": e
                });
                b++;
                if (b > CommentReplies.numberVisible) {
                    a.hide().addClass("hidden")
                } else {
                    a.show()
                }
            }
            if (b > CommentReplies.numberVisible) {
                var d = "<div class='clear'></div><a class='showMoreReplies' data-cid='" + e + "'>Show more replies</a>";
                a.after(d)
            }
        });
        $(".showMoreReplies").click(function () {
            var d = $(this).data("cid");
            var b = $(".reply-bubble[data-cid=" + d + "]");
            var a = 0;
            b.each(function () {
                if ($(this).hasClass("hidden")) {
                    a++;
                    if (a > CommentReplies.numberToAdd) {
                        return
                    }
                    $(this).show().removeClass("hidden")
                }
            });
            if (a <= CommentReplies.numberToAdd) {
                $(this).remove()
            }
        })
    };
    $(document).ready(this.init)
});

function voteFromBlock(f, b, e, d, a) {
    genericVote(f, b, e, buildVotesOnBlock, function () {}, d, "#voteInfoloaderdiv" + f, a)
}
function buildVotesOnBlock(h, o, n, f, g, e) {
    if (!e) {
        e = ""
    }
    if (g.toUpperCase() == "YES") {
        var l = "Active";
        var k = "Inactive"
    } else {
        var l = "Inactive";
        var k = "Active"
    }
    var d = $("#yesVote" + h);
    var b = $("#noVote" + h);
    d.attr("class", "yes" + e + l + " fl");
    b.attr("class", "no" + e + k + " fl");
    d.bind("click", function () {
        return false
    });
    b.bind("click", function () {
        return false
    });
    var m = $("#goodOfferCount" + h);
    if (m.length != 0) {
        if (n == 1) {
            var j = "member";
            var a = "thinks"
        } else {
            var j = "members";
            var a = "think"
        }
        m.html(n + " " + j + " " + a + " this is a good card")
    }
}
function genericVote(j, f, h, e, d, g, a, b) {
    ajaxOnSuccess = function (k) {
        handleVoteResponse(f, h, e, d, k, b)
    };
    if (!a) {
        a = "#voteInfoloaderdiv"
    }
    ajaxRequest(BASE_URL + "/mainajax/vote", ajaxOnSuccess, {
        content: j,
        vote: h,
        type: g
    }, false, a, false, true);
    return false
}
function handleVoteResponse(f, j, e, b, d, a) {
    if (!d) {
        return
    }
    var g = "No";
    if (j == 1) {
        g = "Yes"
    }
    var h = e(f, d[0], d[1], d[2], g, a);
    if (b) {
        b(h)
    }
}
function sidevote(e, d, b, a) {
    genericVote(e, d, buildVoteElementsSidebar, null, b, a)
}
function buildVoteElementsSidebar(a, o, n, e, f, l, m) {
    n = (n > 0) ? n : "0";
    o = (o > 0) ? o : "0";
    var d = parseInt(n) + parseInt(e);
    var g = $("#totalUsers");
    if (d > 0) {
        if (d == 1) {
            var k = " user"
        } else {
            var k = " users"
        }
        if (g) {
            g.html(" from " + d + k)
        }
        $("#userRating").html(o)
    } else {
        if (g) {
            $("#totalUsers").html(" - be the first to vote!")
        }
        $("#userRating").html("NA")
    }
    var h = $('<div id="votearea"></div>');
    $("#votediv").replaceWith(h, $("#votearea"));
    addVoteElements(h, f, a, l, sidevote);
    if (n == 1) {
        var j = " member";
        var b = " says"
    } else {
        var j = " members";
        var b = " say"
    }
    $("#memberPollResults").update("<strong>" + n + "</strong> " + j + " " + b + ' <span style="color: green; font-weight: bold;">Yes</span>');
    var h = $('<div style="display:inline" id="recommendBarVotearea"></div>');
    $("#recommendBar").replaceWith(h, $("#recommendBarVotearea"));
    addVoteElements(h, f, a, l, sidevote, "infoloaderdiv");
    return h
}
function addVoteElements(h, e, a, f, l, b) {
    if (!e || e == "false") {
        var j = $('<div class="question"></div>');
        var k = $('<a href="#" class="yes"></a>').appendTo("div_question");
        k.onclick = function () {
            l(a, 1, f, b);
            return false
        };
        k.update("&nbsp;");
        j.appendChild(document.createTextNode("\u00a0"));
        var k = $('<a href="#" class="no"></a>').appendTo("div_question");
        a_no.bind("click", function () {
            l(a, 0, f, b);
            return false
        });
        a_no.update("&nbsp;");
        h.appendChild(j)
    } else {
        var g = $("<p></p>");
        if (e.toUpperCase() == "YES") {
            var d = $('<span class="yes result">Yes</span>')
        } else {
            var d = $('<span class="no result">No</span>')
        }
        h.appendChild(d)
    }
    return h
}
function voteFromSimpleBlock(e, a, d, b) {
    genericVote(e, a, d, buildVotesOnSimpleBlock, function () {}, b, false)
}
function buildVotesOnSimpleBlock(a, e, f, b, d) {
    $(".voteCount-" + a).each(function (g, h) {
        $(h).html("+" + f)
    });
    $(".upVoteAction-" + a).each(function (g, h) {
        $(h).css("display", "none")
    });
    $(".upVoteVoted-" + a).each(function (g, h) {
        $(h).css("display", "inline")
    });
    if ($("#qArrow")) {
        $("#qArrow").css("display", "none")
    }
}
function expand(a) {
    $("#summary" + a).css("display", "block");
    var b = $("#toggle" + a);
    b.removeClass("expand");
    b.addClass("contract");
    b.click = function (d) {
        return function () {
            hideSummary(d);
            return false
        }
    }(a);
    b.html("Hide Summary")
}
function hideSummary(a) {
    $("#summary" + a).css("display", "none");
    var b = $("#toggle" + a);
    b.removeClass("contract");
    b.addClass("expand");
    b.click = function (d) {
        return function () {
            expand(d);
            return false
        }
    }(a);
    b.html("Expand Offer")
}
function toggleAllExpand(a, b) {
    $(a).each(function (d, e) {
        if (b) {
            expand(e.getAttribute("name"))
        } else {
            hideSummary(e.getAttribute("name"))
        }
    })
}
$(document).ready(function () {
    var a = $("#reviewSorting");
    if (a) {
        a.bind("change", function (d) {
            var b = getTarget(d);
            ajaxRequest(TRUEBASE_URL + "/mainajax/reviews/changesortorder/sortorder/" + b.options[b.selectedIndex].value, function (e) {
                if (e) {
                    window.location.reload(true)
                }
            }, {})
        })
    }
});

function submitChangeEmail() {
    var b = {
        new_email: $("#new_email").val(),
        old_email: $("#old_email").val()
    };
    var a = function (d) {
        getChangeEmailStatus(d)
    };
    ajaxRequest(BASE_URL + "/signup/changeemail", a, b)
}
function are_cookies_enabled() {
    var a = (navigator.cookieEnabled) ? true : false;
    if (typeof navigator.cookieEnabled == "undefined" && !a) {
        document.cookie = "testcookie";
        a = (document.cookie.indexOf("testcookie") != -1) ? true : false
    }
    return (a)
}
function getChangeEmailStatus(b) {
    if (!b) {
        printGeneralError()
    }
    var a = b.status;
    var d = b.newEmail;
    if (a == "success") {
        hideAllConfirmationPrompts();
        $("#emailChanged").css("display", "block");
        $("#new_email").val("");
        $("#old_email").val(d);
        $("#email").val(d)
    } else {
        if (a == "no_code") {
            printGeneralError();
            $("#new_email").val("")
        } else {
            if (a == "email_exists") {
                hideAllConfirmationPrompts();
                $("emailInUse").css("display", "block")
            } else {
                if (a == "bad_email") {} else {
                    printGeneralError()
                }
            }
        }
    }
}
function printGeneralError() {
    hideAllConfirmationPrompts();
    $("#genericError").css("display", "block");
    $("#new_email").val("")
}
function resendEmail() {
    var d = function (e) {
        if (!e) {
            return
        }
        if (e.success) {
            hideAllConfirmationPrompts();
            $("#resentEmail").css("display", "block")
        } else {
            hideAllConfirmationPrompts();
            $("#resendError").css("display", "block")
        }
    };
    var a = "/signup/resend";
    var b = {
        email: $("#email").val()
    };
    ajaxRequest(BASE_URL + a, d, b, false, "resendinfoloaderdiv", false, true)
}
function hideAllConfirmationPrompts() {
    var a = ["clickToActivate", "emailChanged", "emailInUse", "genericError", "resentEmail", "resendError"];
    a.each(function (b) {
        var d = $(b);
        d.css("display", "none")
    })
}
function cleanNumber(a) {
    a.value = a.value.replace(/[^\d]/g, "");
    return true
}
function updateIncomeFields(b) {
    if ($(b).attr("name") == "income2") {
        var a = $(b).val().replace(/[^\d]/g, "");
        if (a == "") {
            $("#income3").val("")
        } else {
            $("#income3").val(addCommas(Math.round(a / 12)));
            $(b).val(addCommas($(b).val()))
        }
        $("#tacagree").focus()
    } else {
        if ($(b).attr("name") == "income3") {
            var a = $(b).val().replace(/[^\d]/g, "");
            if (a == "") {
                $("#income2").val("")
            } else {
                $("#income2").val(addCommas(a * 12));
                $(b).val(addCommas($(b).val()))
            }
        }
    }
}
$.extend({
    all: function (a, b) {
        var e;
        var d = $(a).map(b);
        if ($.inArray(false, d) == -1) {
            e = true
        } else {
            e = false
        }
        return e
    }
});
$.extend({
    uniq: function (b) {
        var e, a = b.length,
            d = [],
            f = {};
        for (e = 0; e < a; e++) {
            f[b[e]] = 0
        }
        for (e in f) {
            d.push(e)
        }
        return d
    }
});

function signupStep1FormValidationCallback(a, b) {
    return $("#sname").hasClass("screenname-available")
}
function signupInputValidationCallback(m, e) {
    if (!g_signupStep || (g_signupStep != 1 && g_signupStep != 2 && g_signupStep != "partnerOneStep" && g_signupStep != "partner1")) {
        return
    }
    var k = e.attr("name");
    var f = e.hasClass("validation-passed");
    var d = $("#img-" + k);
    if ((g_signupStep == 1 || g_signupStep == "partnerOneStep" || g_signupStep == "partner1") && k == "sname") {
        $("#advice-" + k).css("color", "");
        if (m) {
            confirmScreenName(g_signupStep)
        }
    }
    if (g_signupStep == 2 || g_signupStep == "partnerOneStep") {
        var h = ["loccity", "locstate", "loczip"];
        var b = ["pharea", "phxchg", "phline"];
        var l = ["months", "days", "years"];
        var g = g_requireFullAbc ? ["abc1", "abc2", "abc3"] : ["abc3"];
        var a = function (n) {
            return $("#" + n).hasClass("validation-passed") || $("#" + n).hasClass("validation-failed")
        };
        var j = "";
        if (g_signupStep != "partnerOneStep" && $.inArray(k, h) != -1) {
            if ($.all(h, a)) {
                f = $.all(h, function (n) {
                    return $("#" + n).hasClass("validation-passed")
                });
                d = $("#img-loc")
            }
        } else {
            if ($.inArray(k, b) != -1) {
                if ($.all(b, a)) {
                    f = $.all(b, function (n) {
                        return $("#" + n).hasClass("validation-passed")
                    });
                    d = $("#img-phone");
                    j = f ? "" : "Phone number must contain exactly 10 numeric characters.";
                    $("#advice-phone").html(j)
                }
            } else {
                if ($.inArray(k, l) != -1) {
                    if ($.all(l, a)) {
                        f = $.all(l, function (n) {
                            return $("#" + n).hasClass("validation-passed")
                        });
                        d = $("#img-dob")
                    }
                } else {
                    if ($.inArray(k, g) != -1) {
                        if ($.all(g, a)) {
                            f = $.all(g, function (n) {
                                return $("#" + n).hasClass("validation-passed")
                            });
                            d = $("#img-abc");
                            j = "";
                            if (!f) {
                                j = g_requireFullAbc ? "SSN must be a number consisting of 9 digits." : "Your entry must be a number consisting of 4 digits."
                            }
                            $("#advice-abc").html(j)
                        }
                    }
                }
            }
        }
    }
    if (d) {
        $(d).show();
        $(d).css("display", "inline");
        $(d).attr("src", MEDIA_URL + "/res/img/layout/loading-animation.gif");
        if (f) {
            $(d).attr("src", MEDIA_URL + "/res/img/layout/check.png")
        } else {
            $(d).attr("src", MEDIA_URL + "/res/img/layout/error.png")
        }
    }
    switch (g_signupStep) {
        case 1:
            toggleSignupStep1Button();
            break;
        case 2:
            toggleSignupStep2Button();
            break;
        case 3:
            break;
        case "1step":
            toggleSignupOneStepButton();
            break;
        default:
            break
    }
}
function toggleOneStepDefaultText(b, e) {
    var d = "";
    var a = "";
    switch (b) {
        case "email":
            d = (defaultMessages.hasOwnProperty("email")) ? defaultMessages.email : "example@domain.com";
            break;
        case "retypeemail":
            d = (defaultMessages.hasOwnProperty("retypeemail")) ? defaultMessages.retypeemail : "re-enter your email address";
            break;
        case "sname":
            d = (defaultMessages.hasOwnProperty("sname")) ? defaultMessages.sname : "username1234";
            break;
        case "fname":
            d = (defaultMessages.hasOwnProperty("fname")) ? defaultMessages.fname : "enter your full, legal first name";
            break;
        case "lname":
            d = (defaultMessages.hasOwnProperty("lname")) ? defaultMessages.lname : "enter your full, legal last name";
            break;
        case "locaddr1":
            d = (defaultMessages.hasOwnProperty("locaddr1")) ? defaultMessages.locaddr1 : "required";
            break;
        case "loccity":
            d = (defaultMessages.hasOwnProperty("loccity")) ? defaultMessages.loccity : "required";
            break;
        case "locapt":
            d = (defaultMessages.hasOwnProperty("locapt")) ? defaultMessages.locapt : "optional";
            break;
        case "loczip":
            d = (defaultMessages.hasOwnProperty("loczip")) ? defaultMessages.loczip : "11111";
            break;
        case "password":
            a = "password";
            break;
        case "retypepw":
            a = "password";
            break;
        case "secqans":
            d = (defaultMessages.hasOwnProperty("secqans")) ? defaultMessages.secqans : "enter your answer";
            break;
        case "pharea":
            d = (defaultMessages.hasOwnProperty("pharea")) ? defaultMessages.pharea : "123";
            break;
        case "phxchg":
            d = (defaultMessages.hasOwnProperty("phxchg")) ? defaultMessages.phxchg : "456";
            break;
        case "phline":
            d = (defaultMessages.hasOwnProperty("phline")) ? defaultMessages.phline : "7890";
            break;
        case "abc3":
            d = (defaultMessages.hasOwnProperty("abc3")) ? defaultMessages.abc3 : "0000";
            break
    }
    if (d && e == "focus" && $("#" + b).val() == d) {
        $("#" + b).val("");
        $("#" + b).css("color", "#000000");
        $("#" + b).select()
    } else {
        if (d && e == "blur" && $("#" + b).val() == "") {
            $("#" + b).val(d);
            $("#" + b).css("color", "#878787")
        }
    }
    if (a && e == "focus") {
        $("#preInput-" + b).hide()
    } else {
        if (a && e == "blur" && $("#" + b).val() == "") {
            $("#preInput-" + b).show()
        }
    }
}
function toggleSignupStep1Button() {
    var e = ["email", "retypeemail", "sname", "password", "retypepw", "secqcode", "secqans"];
    var d = $.all(e, function (f, g) {
        return ($("#" + g).hasClass("validation-passed") && !$("#" + g).hasClass("validation-failed"))
    });
    var b = $("#sname").hasClass("screenname-available");
    var a = d && b ? "nextStep" : "nextStepInactive";
    if (are_cookies_enabled) {
        setClassAttribute($("#submitImage"), a)
    }
}
function toggleSignupStep2Button() {
    var b = ["fname", "lname", "locaddr1", "loccity", "locstate", "loczip", "pharea", "phxchg", "phline", "months", "days", "years", "abc3"];
    if (g_requireFullAbc) {
        b.push("abc1", "abc2")
    }
    var a = $.all(b, function (d, e) {
        return ($("#" + e).hasClass("validation-passed") && !$("#" + e).hasClass("validation-failed"))
    });
    if (!a) {
        setClassAttribute($("#submitButton"), "nextStepInactive");
        return
    }
    if (!$("#tacagree").is(":checked")) {
        setClassAttribute($("#submitButton"), "nextStepInactive");
        return
    }
    setClassAttribute($("#submitButton"), "nextStep")
}
function toggleSignupStep3Button() {
    var a = $.uniq($("#validateForm input[type=radio]").map(function (d, e) {
        return e.name
    }));

    function b(d, e) {
        map = $("#validateForm input[name=" + e + "]").map(function (f, g) {
            return $(g).is(":checked")
        });
        if ($.inArray(true, map) >= 0) {
            return true
        } else {
            return false
        }
    }
    if ($.all(a, b)) {
        setClassAttribute($("#submitImage"), "getMyScoreOOW")
    }
}
function toggleSignupOneStepButton() {
    var d = ["email", "retypeemail", "sname", "password", "retypepw", "secqcode", "secqans", "fname", "lname", "locaddr1", "loccity", "locstate", "loczip", "pharea", "phxchg", "phline", "months", "days", "years", "abc3"];
    var b = $.all(d, function (e, f) {
        return ($("#" + f).hasClass("validation-passed") && !$("#" + f).hasClass("validation-failed"))
    });
    var a = $("#sname").hasClass("screenname-available");
    if (b && a) {
        $("#submitImage").removeClass("nextStepInactive")
    } else {
        $("#submitImage").addClass("nextStepInactive")
    }
}
function addCommas(b) {
    b += "";
    x = b.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var a = /(\d+)(\d{3})/;
    while (a.test(x1)) {
        x1 = x1.replace(a, "$1,$2")
    }
    return x1 + x2
}
function handleCreditNotificationsOptin() {
    if ($("#rcvNotifications").is(":checked")) {
        if ($("#monitoringPrefs").length != 0) {
            $("#rcvCreditAlerts").attr("checked", "checked");
            $("#monitoringPrefsWarning").css("display", "none")
        } else {
            $("#monitoringPrefsWarning2").css("display", "none")
        }
    } else {
        if ($("#monitoringPrefs").length != 0) {
            $("#rcvCreditAlerts").removeAttr("checked");
            $("#monitoringPrefsWarning").css("display", "block")
        } else {
            $("#monitoringPrefsWarning2").css("display", "block")
        }
    }
}
function handleCreditAlertsOptin() {
    if ($("#rcvCreditAlerts").is(":checked")) {
        $("#rcvNotifications").attr("checked", "checked");
        $("#monitoringPrefsWarning").css("display", "none")
    }
}
var isNN = (navigator.appName.indexOf("Netscape") != -1);

function autoTab(d, a, h) {
    var g = (isNN) ? h.which : h.keyCode;
    var f = (isNN) ? [0, 8, 9] : [0, 8, 9, 16, 17, 18, 37, 38, 39, 40, 46];
    if (d.value.length >= a && !b(f, g)) {
        d.value = d.value.slice(0, a);
        d.form[(j(d) + 1) % d.form.length].focus()
    }
    function b(e, m) {
        var l = false,
            k = 0;
        while (!l && k < e.length) {
            if (e[k] == m) {
                l = true
            } else {
                k++
            }
        }
        return l
    }
    function j(e) {
        var k = -1,
            l = 0,
            m = false;
        while (l < e.form.length && k == -1) {
            if (e.form[l] == e) {
                k = l
            } else {
                l++
            }
        }
        return k
    }
    return true
}
var monthDays = new Array();
monthDays[0] = 31;
monthDays[1] = 28;
monthDays[2] = 31;
monthDays[3] = 30;
monthDays[4] = 31;
monthDays[5] = 30;
monthDays[6] = 31;
monthDays[7] = 31;
monthDays[8] = 30;
monthDays[9] = 31;
monthDays[10] = 30;
monthDays[11] = 31;

function printOptions(d, f, e) {
    for (var b = 0; b < d; b++) {
        var a = b + 1;
        var g = a;
        if (g < 10) {
            g = "0" + g
        }
        selectedString = "";
        if (e == a) {
            selectedString = "selected='selected'"
        }
        document.writeln("<option id=" + f + "-" + a + " value='" + a + "' " + selectedString + ">" + g + "</option>")
    }
}
function populateMonths(a) {
    printOptions(monthDays.length, "month", a)
}
function populateDays(b, a) {
    printOptions(31, "day", a);
    updateDays(b)
}
function populateYears(b) {
    for (var a = 2008; a > 1900; a--) {
        selectedString = "";
        if (b == a) {
            selectedString = "selected='selected'"
        }
        document.writeln("<option value='" + a + "' " + selectedString + ">" + a)
    }
}
function updateDays(h) {
    var f = $(h);
    var a = monthDays[f.months.selectedIndex - 1];
    var e = 0;
    if (a == 28) {
        var d = parseInt(f.years.value);
        if ((d % 4 == 0 && d % 100 != 0) || (d % 400 == 0)) {
            a++
        }
    }
    for (var b = 29; b <= 31; b++) {
        var g = $("#day-" + b);
        if (a < b) {
            g.css("display", "none")
        } else {
            g.css("display", "block")
        }
    }
}
function FlashTag(f, b, a, e, g, d) {
    this.src = f;
    this.width = b;
    this.height = a;
    this.version = "7,0,14,0";
    this.id = g;
    this.bgcolor = "ffffff";
    this.flashVars = d;
    this.protocol = e;
    this.wmode = "opaque"
}
FlashTag.prototype.setVersion = function (a) {
    this.version = a
};
FlashTag.prototype.setId = function (a) {
    this.id = a
};
FlashTag.prototype.setBgcolor = function (a) {
    this.bgcolor = a
};
FlashTag.prototype.setFlashvars = function (a) {
    this.flashVars = a
};
FlashTag.prototype.setWmode = function (a) {
    this.wmode = a
};
FlashTag.prototype.toString = function () {
    var b = (navigator.appName.indexOf("Microsoft") != -1) ? 1 : 0;
    var a = new String();
    if (b) {
        a += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
        if (this.id != null) {
            a += 'id="' + this.id + '" name="' + this.id + '" '
        }
        a += 'codebase="' + this.protocol + "download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=" + this.version + '" ';
        a += 'width="' + this.width + '" ';
        a += 'height="' + this.height + '">';
        a += '<param name="movie" value="' + this.src + '"/>';
        a += '<param name="wmode" value="' + this.wmode + '"/>';
        a += '<param name="quality" value="best"/>';
        a += '<param name="bgcolor" value="#' + this.bgcolor + '"/>';
        if (this.flashVars != null) {
            a += "<param name='flashvars' value='" + this.flashVars + "'/>"
        }
        a += "</object>"
    } else {
        a += '<embed src="' + this.src + '" ';
        a += 'wmode="' + this.wmode + '" ';
        a += 'quality="best" ';
        a += 'bgcolor="#' + this.bgcolor + '" ';
        a += 'width="' + this.width + '" ';
        a += 'height="' + this.height + '" ';
        a += 'type="application/x-shockwave-flash" ';
        if (this.flashVars != null) {
            a += "flashvars='" + this.flashVars + "' "
        }
        if (this.id != null) {
            a += 'id="' + this.id + '" name="' + this.id + '" '
        }
        a += 'pluginspage="' + this.protocol + 'www.macromedia.com/go/getflashplayer">';
        a += "</embed>"
    }
    return a
};
FlashTag.prototype.write = function (a) {
    a.write(this.toString())
};
FlashTag.prototype.append = function (a) {
    if (typeof (a.html) != "function") {
        return
    }
    a.html(this.toString())
}
/*!
 * SUBMODAL v1.5
 * Used for displaying DHTML only popups instead of using buggy modal windows.
 *
 * By Seth Banks
 * http://www.subimage.com/
 *
 * Contributions by:
 *     Eric Angel - tab index code
 *     Scott - hiding/showing selects for IE users
 *    Todd Huss - inserting modal dynamically and anchor classes
 *
 * Up to date code can be found at http://www.subimage.com/dhtml/subModal
 *
 *
 * This code is free for you to use anywhere, just keep this comment block.
 */;
var gPopupMask = null;
var gPopupContainer = null;
var gPopFrame = null;
var gReturnFunc;
var gPopupIsShown = false;
var gHideSelects = false;
var gPopFrameName = null;
var gTransport = null;
var gIframeClass = false;
var gPopupReady = false;
var gTabIndexes = new Array();
var gTabbableTags = new Array("A", "BUTTON", "TEXTAREA", "INPUT", "IFRAME");
var gUseIFrame = true;
if (!document.all) {
    document.onkeypress = keyDownHandler
}
$(function () {
    initPopUp();
    if (typeof gPopupWinOnload == "function") {
        gPopupWinOnload()
    }
});

function initPopUp() {
    popmask = $('<div id="popupMask"></div>').appendTo("body");
    popcont = $('<div id="popupContainer"></div>').appendTo("div#container");
    var d = $("BODY")[0];
    var b = $("#container");
    if (b) {
        b.append(popcont)
    }
    gPopupMask = $("#popupMask");
    gPopupContainer = $("#popupContainer");
    var a = parseInt(window.navigator.appVersion.charAt(0), 10);
    if (a <= 6 && window.navigator.userAgent.indexOf("MSIE") > -1) {
        gHideSelects = true
    }
    gPopupReady = true;
    var e = $("a");
    for (i = 0; i < e.length; i++) {
        if (e[i].className.indexOf("submodal") == 0) {
            e[i].bind("click", function () {
                var g = 400;
                var f = 200;
                var h = this.className.split("-");
                if (h.length == 3) {
                    g = parseInt(h[1]);
                    f = parseInt(h[2])
                }
                showPopWin(this.href, g, f, null);
                return false
            })
        }
    }
}
function showPopWin(a, d, k, e, f, g, h, j) {
    if (gPopupReady == false) {
        return
    }
    gPopFrameName = "popupFrame" + new Date().getTime();
    gUseIFrame = (typeof h === "undefined");
    var b = "";
    if (is_object(j)) {
        b += '<form id="popupFrameForm" target="' + gPopFrameName + '" method="post" action="' + a + '">';
        $.each(j, function (n, o) {
            b += '<input type="hiden" name="' + n + '" value="' + o + '" />'
        });
        b += '<input type="hiden" name="stk" value="' + Cookie.get(TRKCK) + '" />';
        b += "</form>";
        gUseIFrame = true;
        a = "javascript:false;"
    }
    if (gUseIFrame) {
        $(gPopupContainer).html('<div id="popupInner"><iframe src="' + a + '" style="background-color:transparent;" frameborder="0" scrolling="no" allowtransparency="true" id="popupFrame" name="' + gPopFrameName + '"></iframe></div>' + b)
    } else {
        $(gPopupContainer).html('<div id="popupInner"><div id="popupFrame" style="background-color:white;" frameborder="0" allowtransparency="true">' + h + "</div></div>")
    }
    if (is_object(j)) {
        $("#popupFrameForm").submit()
    }
    gPopFrame = $("#popupFrame");
    if (f) {
        gIframeClass = f;
        gPopFrame.addClass(f)
    }
    gPopupIsShown = true;
    disableTabIndexes();
    setMaskSize();
    $(gPopupMask).css("display", "block");
    var m;
    if (typeof g_Widget_FS !== "undefined" && g_Widget_FS === true) {
        m = "273px";
        if (d > 810) {
            d = 810
        }
    } else {
        if (typeof APPID !== "undefined" && APPID == "truecredit") {
            m = "140px"
        } else {
            var l = $(window).scrollTop();
            m = (l < 120 ? 120 : l) + "px"
        }
    }
    $(gPopupContainer).css({
        display: "block",
        width: d + "px",
        height: k + "px",
        top: m
    });
    $(gPopFrame).css("height", k + "px");
    centerPopWin();
    gReturnFunc = e;
    if (gHideSelects == true) {
        hideSelectBoxes()
    }
}
function centerPopWin() {
    if (gPopupIsShown == true) {
        var a = $(gPopupContainer);
        a.css("left", ((($(window).width() - a.outerWidth()) / 2) + $(window).scrollLeft() + "px"))
    }
}
$(window).bind("resize", centerPopWin);

function setMaskSize() {
    var g;
    var e;
    var d = $("HTML");
    var a = d.height();
    var f = d.width();
    var b = $("BODY")[0];
    if (a > b.scrollHeight) {
        g = a
    } else {
        g = b.scrollHeight
    }
    if (f > b.scrollWidth) {
        e = f
    } else {
        e = b.scrollWidth
    }
    $(gPopupMask).css("height", g + "px");
    $(gPopupMask).css("width", e + "px")
}
function hidePopWin(a) {
    gPopupIsShown = false;
    var b = $("BODY");
    b.css("overflow", "");
    restoreTabIndexes();
    if (gIframeClass) {
        gPopFrame.removeClass(gIframeClass);
        gIframeClass = false
    }
    if (gPopupMask == null) {
        return
    }
    gPopupMask.css("display", "none");
    gPopupContainer.css("display", "none");
    if (gHideSelects == true) {
        displaySelectBoxes()
    }
    if (a == true && gReturnFunc != null) {
        window.setTimeout("gReturnFunc();", 1)
    }
    gPopupContainer.html("");
    $(document).trigger("ck:modalclose")
}
function keyDownHandler(a) {
    if (gPopupIsShown && a.keyCode == 9) {
        return false
    }
}
function disableTabIndexes() {
    if (document.all) {
        var d = 0;
        for (var b = 0; b < gTabbableTags.length; b++) {
            var e = document.getElementsByTagName(gTabbableTags[b]);
            for (var a = 0; a < e.length; a++) {
                gTabIndexes[d] = e[a].tabIndex;
                e[a].tabIndex = "-1";
                d++
            }
        }
    }
}
function restoreTabIndexes() {
    if (document.all) {
        var d = 0;
        for (var b = 0; b < gTabbableTags.length; b++) {
            var e = document.getElementsByTagName(gTabbableTags[b]);
            for (var a = 0; a < e.length; a++) {
                e[a].tabIndex = gTabIndexes[d];
                e[a].tabEnabled = true;
                d++
            }
        }
    }
}
function hideSelectBoxes() {
    $("SELECT").css("visibility", "hidden")
}
function displaySelectBoxes() {
    $("SELECT").css("visibility", "visible")
}
function getViewportHeight() {
    if (window.innerHeight != window.undefined) {
        return window.innerHeight
    }
    if (document.compatMode == "CSS1Compat") {
        return document.documentElement.clientHeight
    }
    if (document.body) {
        return document.body.clientHeight
    }
    return window.undefined
}
function getViewportWidth() {
    var b = 17;
    var a = null;
    if (window.innerWidth != window.undefined) {
        return window.innerWidth
    }
    if (document.compatMode == "CSS1Compat") {
        return document.documentElement.clientWidth
    }
    if (document.body) {
        return document.body.clientWidth
    }
}
function getScrollTop(a) {
    if (a.defaultView && a.defaultView.pageYOffset) {
        return a.defaultView.pageYOffset
    } else {
        if (a.documentElement && a.documentElement.scrollTop) {
            return a.documentElement.scrollTop
        } else {
            if (a.body) {
                return a.body.scrollTop
            }
        }
    }
}
function getScrollLeft(a) {
    if (a.defaultView && a.defaultView.pageXOffset) {
        return a.defaultView.pageXOffset
    } else {
        if (a.documentElement && a.documentElement.scrollLeft) {
            return a.documentElement.scrollLeft
        } else {
            if (a.body) {
                return a.body.scrollLeft
            }
        }
    }
}
function getPageSize(d) {
    var g, a;
    if (d.defaultView && d.defaultView.innerHeight && d.defaultView.scrollMaxY) {
        g = d.body.scrollWidth;
        a = d.defaultView.innerHeight + d.defaultView.scrollMaxY
    } else {
        if (d.body.scrollHeight > d.body.offsetHeight) {
            g = d.body.scrollWidth;
            a = d.body.scrollHeight
        } else {
            g = d.body.offsetWidth;
            a = d.body.offsetHeight
        }
    }
    var e, h;
    if (d.defaultView && d.defaultView.innerHeight) {
        e = d.defaultView.innerWidth;
        h = d.defaultView.innerHeight
    } else {
        if (d.documentElement && d.documentElement.clientHeight) {
            e = d.documentElement.clientWidth;
            h = d.documentElement.clientHeight
        } else {
            if (d.body) {
                e = d.body.clientWidth;
                h = d.body.clientHeight
            }
        }
    }
    var b = e + g;
    var f = h + a;
    return {
        pageWidth: b,
        pageHeight: f,
        windowWidth: e,
        windowHeight: h
    }
}
function closeThis(a) {
    hidePopWin(a);
    return false
}
function parentRedir(a) {
    parent.location.href = a
}
function parseUri(f) {
    var e = parseUri.options,
        a = e.parser[e.strictMode ? "strict" : "loose"].exec(f),
        d = {}, b = 14;
    while (b--) {
        d[e.key[b]] = a[b] || ""
    }
    d[e.q.name] = {};
    d[e.key[12]].replace(e.q.parser, function (h, g, j) {
        if (g) {
            d[e.q.name][g] = j
        }
    });
    return d
}
parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};
if (window.postMessage) {
    if (window.addEventListener) {
        window.addEventListener("message", getMessage, false)
    } else {
        window.attachEvent("onmessage", getMessage)
    }
}
function getMessage(a) {
    if (a.origin.match(/https?:\/\/([^\/]+\.|)creditkarma.com\/?/)) {
        processMessage(a.data)
    }
}
function processMessage(a) {
    switch (a) {
        case _gCloseTrue:
            closeThis(true);
            break;
        case _gCloseFalse:
            closeThis(false);
            break;
        default:
            break
    }
}
function sendCloseThis(a) {
    if (gUseIFrame) {
        if (window.postMessage) {
            var d = a ? _gCloseTrue : _gCloseFalse;
            window.parent.postMessage(d, "*")
        } else {
            var b = a ? _gCloseTrueUrl : _gCloseFalseUrl;
            window.location = b
        }
    } else {
        var d = a ? _gCloseTrue : _gCloseFalse;
        processMessage(d)
    }
    return false
}
/*!
 * Copyright (c) 2007 Andrew Tetlaw
 */
function Validator(d, b, e, a) {
    if (typeof e == "function") {
        this.options = a;
        this._test = e
    } else {
        this.options = e;
        this._test = function () {
            return true
        }
    }
    this.error = b || "Validation failed.";
    this.className = d
}
Validator.prototype.test = function (a, f) {
    var e;
    var d = [];
    for (var b in this.options) {
        if (this.options.hasOwnProperty(b)) {
            res = Validator.methods[b] ? Validator.methods[b](a, f, this.options[b]) : true;
            d.push(res)
        }
    }
    if ($.inArray(false, d) == -1) {
        e = true
    } else {
        e = false
    }
    return (this._test(a, f) && e)
};
Validator.methods = {
    pattern: function (a, d, b) {
        return Validation.get("IsEmpty").test(a) || b.test(a)
    },
    minLength: function (a, d, b) {
        return a.length >= b
    },
    maxLength: function (a, d, b) {
        return a.length <= b
    },
    min: function (a, d, b) {
        return a >= parseFloat(b)
    },
    max: function (a, d, b) {
        return a <= parseFloat(b)
    },
    notOneOf: function (a, f, b) {
        var e;
        var d = $(b).map(function (g, h) {
            return a != h
        });
        if ($.inArray(false, d) == -1) {
            e = true
        } else {
            e = false
        }
        return e
    },
    oneOf: function (a, f, b) {
        var e;
        var d = $(b).map(function (g, h) {
            return a == h
        });
        if ($.inArray(true, d) == -1) {
            e = false
        } else {
            e = true
        }
        return e
    },
    is: function (a, d, b) {
        return a == b
    },
    isNot: function (a, d, b) {
        return a != b
    },
    equalToField: function (a, d, b) {
        return a == $("#" + b).val()
    },
    notEqualToField: function (a, d, b) {
        return a != $("#" + b).val()
    },
    include: function (a, f, b) {
        var e;
        var d = $(b).map(function (g, h) {
            return Validation.get(h).test(a, f)
        });
        if ($.inArray(false, d) == -1) {
            e = true
        } else {
            e = false
        }
        return e
    }
};

function Validation(h, e) {
    this.options = jQuery.extend({
        onSubmit: true,
        stopOnFirst: false,
        immediate: true,
        focusOnError: true,
        useTitles: false,
        eventBlur: false,
        onFormValidate: function (j, k) {
            return true
        },
        onFormSubmit: function (j) {},
        onElementValidate: function (j, k) {},
        onElementValidateKeyUp: false,
        onElementValidateBlur: false,
        onElementValidateClick: false
    }, e || {});
    this.form = h;
    if (this.options.onSubmit) {
        var b = this;
        $("#" + this.form).bind("submit", function (j) {
            if (!b.validate()) {
                j.preventDefault()
            } else {
                b.options.onFormSubmit(b.form)
            }
        })
    }
    if (this.options.immediate) {
        var f = this.options.useTitles;
        var g = this.options.onElementValidateKeyUp ? this.options.onElementValidateKeyUp : this.options.onElementValidate;
        var d = this.options.onElementValidateBlur ? this.options.onElementValidateBlur : this.options.onElementValidate;
        var a = this.options.onElementValidateClick ? this.options.onElementValidateClick : this.options.onElementValidate;
        $("#" + this.form + " input, #" + this.form + " select").each(function (j, k) {
            $(k).bind("keyup", function (l) {
                Validation.validate($(this), {
                    useTitle: f,
                    onElementValidate: g,
                    keyup: true
                })
            });
            $(k).bind("blur", function (l) {
                if ($(this).is("#username")) {
                    $(this).val($.trim($(this).val()))
                }
                Validation.validate($(this), {
                    useTitle: f,
                    onElementValidate: d,
                    keyup: false
                })
            });
            if ($(k).attr("type") == "checkbox" || $(k).attr("type") == "radio") {
                $(k).bind("click", function (l) {
                    Validation.validate($(this), {
                        useTitle: f,
                        onElementValidate: a,
                        keyup: false
                    })
                })
            }
        })
    }
}
Validation.prototype.validate = function () {
    var a = false;
    var d = this.options.useTitles;
    var f = this.options.onElementValidate;
    var e = $("#" + this.form + " input, #" + this.form + " select").map(function (g, h) {
        return Validation.validate(h, {
            useTitle: d,
            onElementValidate: f
        })
    });
    if ($.inArray(false, e) == -1) {
        a = true
    } else {
        a = false
    }
    if (!a && this.options.focusOnError) {
        $(jQuery.grep($("#" + this.form + " input, #" + this.form + " select"), function (h, g) {
            return $(h).hasClass("validation-failed")
        })).first().focus()
    }
    var b = this.options.onFormValidate(a, this.form);
    return a && b
};
Validation.prototype.reset = function () {
    $("#" + this.form + " input, #" + this.form + " select").each(Validation.reset)
};
jQuery.extend(Validation, {
    validate: function (h, d) {
        d = jQuery.extend({
            useTitle: false,
            onElementValidate: function (j, k) {}
        }, d || {});
        var b = $(h).attr("class");
        if (typeof b !== "undefined" && b !== false) {
            var g;
            var f = $(h).attr("class").split(" ");
            var e = false;
            var g = $(f).map(function (j, k) {
                if (!e) {
                    var l = Validation.test(k, h, d.useTitle, d.keyup);
                    if (l == false) {
                        e = true
                    }
                    return l
                }
            });
            var a;
            if ($.inArray(false, g) == -1) {
                a = true
            } else {
                a = false
            }
            d.onElementValidate(a, h);
            return a
        }
    },
    test: function (b, h, l, a) {
        var m = Validation.get(b);
        var k = Validation.getErrImg(h);
        var d = Validation.getHelper(h);
        var e = Validation.getAdvice(h);
        var j = Validation.getLbl(h);
        Validation.markIncluded(h);
        var g;
        if ($(h).attr("type") == "checkbox" && !$(h).is(":checked")) {
            g = !m.test(null, h)
        } else {
            g = !m.test($(h).val(), h)
        }
        if (Validation.isVisible(h) && g) {
            if (a) {
                return true
            }
            var f = l ? ((h && h.title) ? h.title : m.error) : m.error;
            Validation.markInvalid(h, f);
            return false
        } else {
            Validation.markValid(h);
            return true
        }
    },
    markIncluded: function (a) {
        $(a).addClass("has-validation")
    },
    markValid: function (b) {
        var a = Validation.getAssociatedFields(b);
        if (a.helper.length != 0) {
            $(a.helper).css("display", "block")
        }
        if (a.advice.length != 0) {
            $(a.advice).html("")
        }
        if (a.errImg.length != 0) {
            $(a.errImg).hide()
        }
        if (a.lbl.length != 0) {
            $(a.lbl).removeClass("validation-failed");
            $(a.lbl).addClass("validation-passed")
        }
        $(b).removeClass("validation-failed");
        $(b).addClass("validation-passed")
    },
    markInvalid: function (d, b) {
        var a = Validation.getAssociatedFields(d);
        if (a.errImg.length != 0) {
            $(a.errImg).css("display", "inline")
        }
        if (a.helper.length != 0) {
            $(a.helper).css("display", "block")
        }
        if (a.advice.length != 0) {
            $(a.advice).html(b)
        }
        if (a.lbl.length != 0) {
            $(a.lbl).removeClass("validation-passed");
            $(a.lbl).addClass("validation-failed")
        }
        $(d).removeClass("validation-passed");
        $(d).addClass("validation-failed")
    },
    isVisible: function (a) {
        while ($(a)[0].tagName != "BODY") {
            if (a && !$(a).attr("display") == "block") {
                return false
            }
            a = $($(a)[0].parentNode)
        }
        return true
    },
    getAssociatedFields: function (a) {
        return {
            errImg: Validation.getErrImg(a),
            helper: Validation.getHelper(a),
            advice: Validation.getAdvice(a),
            lbl: Validation.getLbl(a)
        }
    },
    getAdvice: function (a) {
        return $("#advice-" + Validation.getElmID(a))
    },
    getErrImg: function (a) {
        return $("#errImg-" + Validation.getElmID(a))
    },
    getLbl: function (a) {
        return $("#lbl-" + Validation.getElmID(a))
    },
    getHelper: function (a) {
        return $("#helper-" + Validation.getElmID(a))
    },
    getElmID: function (a) {
        return $(a).attr("id") ? $(a).attr("id") : $(a).attr("name")
    },
    reset: function (d) {
        d = $(d);
        var a = $(d).attr("class");
        if (typeof a !== "undefined" && a !== false) {
            var b = $(d).attr("class").split(" ");
            b.each(function (f) {
                var g = "__advice" + f.camelize();
                if (d[g]) {
                    var e = Validation.getAdvice(d);
                    $(e).hide();
                    d[g] = ""
                }
                d.removeClass("validation-failed");
                d.removeClass("validation-passed")
            })
        }
    },
    add: function (e, d, f, b) {
        var a = {};
        a[e] = new Validator(e, d, f, b);
        jQuery.extend(Validation.methods, a)
    },
    addAllThese: function (a) {
        var b = {};
        jQuery.each(a, function (d, e) {
            b[e[0]] = new Validator(e[0], e[1], e[2], (e.length > 3 ? e[3] : {}))
        });
        jQuery.extend(Validation.methods, b)
    },
    get: function (a) {
        return Validation.methods[a] ? Validation.methods[a] : Validation.methods._LikeNoIDIEverSaw_
    },
    methods: {
        _LikeNoIDIEverSaw_: new Validator("_LikeNoIDIEverSaw_", "", {})
    }
});
Validation.add("IsEmpty", "", function (a) {
    return ((a == null) || (a.length == 0))
});
Validation.addAllThese([
    ["required", "This is a required field.", function (a) {
        return !Validation.get("IsEmpty").test(a)
    }],
    ["valid-number", "Please enter a valid number in this field.", function (a) {
        return Validation.get("IsEmpty").test(a) || (!isNaN(a) && !/^\s+$/.test(a))
    }],
    ["valid-digits", "Please use numbers only in this field.", function (a) {
        return Validation.get("IsEmpty").test(a) || !/[^\d]/.test(a)
    }],
    ["valid-alpha", "Please use letters only in this field.", function (a) {
        return Validation.get("IsEmpty").test(a) || /^[a-zA-Z]+$/.test(a)
    }],
    ["valid-alphanum", "Please use letters and numbers only in this field.", function (a) {
        return Validation.get("IsEmpty").test(a) || /^[a-zA-Z0-9]+$/.test(a)
    }],
    ["valid-email", "Please enter a valid email address.", function (a) {
        return Validation.get("IsEmpty").test(a) || /^[A-Za-z0-9_][+A-Za-z0-9._-]*[A-Za-z0-9_]*@(?:[A-Za-z0-9][A-Za-z0-9_-]*\.)+[A-Za-z]+$/.test(a)
    }]
]);

function addUrlValidator() {
    Validation.add("valid-url", "Please enter a valid URL.", function (a) {
        return Validation.get("IsEmpty").test(a) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(a)
    })
}
function addDateValidators() {
    Validation.addAllThese([
        ["valid-date-au", "Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.", function (a) {
            if (Validation.get("IsEmpty").test(a)) {
                return true
            }
            var b = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            if (!b.test(a)) {
                return false
            }
            var e = new Date(a.replace(b, "$2/$1/$3"));
            return (parseInt(RegExp.$2, 10) == (1 + e.getMonth())) && (parseInt(RegExp.$1, 10) == e.getDate()) && (parseInt(RegExp.$3, 10) == e.getFullYear())
        }],
        ["valid-date", "Please enter a valid date.", function (a) {
            var b = new Date(a);
            return Validation.get("IsEmpty").test(a) || !isNaN(b)
        }]
    ])
}
function addCurrencyValidator() {
    Validation.add("valid-currency-dollar", "Please enter a valid $ amount. For example $100.00", function (a) {
        return Validation.get("IsEmpty").test(a) || /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(a)
    })
}
function addSelectionValidators() {
    Validation.addAllThese([
        ["valid-selection", "Please make a selection.", function (a, b) {
            return b[0].options ? b[0].selectedIndex > 0 : !Validation.get("IsEmpty").test(a)
        }],
        ["valid-one-required", "Please select one of the above options.", function (a, g) {
            var e = g[0].parentNode;
            var b = e.getElementsByTagName("INPUT");
            var f;
            var d = $(b).map(function (h) {
                return $(h).getVal()
            });
            if ($.inArray(true, d) == -1) {
                f = false
            } else {
                f = true
            }
            return f
        }]
    ])
}
function addNameValidators() {
    Validation.add("valid-name", "Please enter a valid name.", function (a) {
        return /^[ A-Za-z\'-]*$/.test(a)
    });
    Validation.add("len-lname", "Last name must be between 1 and 25 characters.", {
        minLength: 1,
        maxLength: 25
    });
    Validation.add("valid-displayname", "Please enter a valid name.", function (a) {
        return /^[ A-Za-z0-9\-_\/&]*$/.test(a)
    })
}
function addScreenNameValidators() {
    Validation.add("len-sname", "Screen names must be between 3 and 30 characters.", {
        minLength: 3,
        maxLength: 30
    });
    Validation.add("valid-sname", "Screen names should not resemble a Social Security Number.", function (a) {
        return !/[0-9]{9}/.test(a)
    })
}
function addEmailConfirmationValidators() {
    Validation.add("match-email", "Email address must match.", {
        equalToField: "email"
    })
}
function addPasswordValidators() {
    Validation.add("len-password", "Passwords must be at least 8 characters.", {
        minLength: 8
    });
    Validation.add("valid-password", "Passwords must contain at least one number.", function (a) {
        return /.*[0-9].*/.test(a)
    });
    Validation.add("match-password", "Password must match.", {
        equalToField: "password"
    });
    Validation.add("match-newpw", "Password must match.", {
        equalToField: "newpw"
    })
}
function addSecAnswerValidators() {
    Validation.add("valid-secanswer", "Security answers may contain numbers, letters, and the following characters: - , ? !", function (a) {
        return /^[ A-Za-z0-9?,!-]*$/.test(a)
    });
    Validation.add("len-secanswer", "Security answers must be between 2 and 20 characters in length.", {
        minLength: 2,
        maxLength: 20
    })
}
function addAddressValidators() {
    Validation.add("valid-address", "Unit numbers may only contain letters, numbers, commas, dashes, and spaces.", function (a) {
        return /^[ A-Za-z0-9.,-\/]*$/.test(a)
    });
    Validation.add("valid-city", "Cities may only contain letters and spaces.", function (a) {
        return /^[A-Za-z ]*$/.test(a)
    });
    Validation.add("len-zip", "Zip codes must be exactly 5 digits long.", {
        minLength: 5,
        maxLength: 5
    });
    Validation.add("valid-zip", "Zip codes must be exactly 5 digits long.", function (a) {
        return /^[0-9]{5}$/.test(a)
    })
}
function addCSVEmailValidators() {
    Validation.add("valid-csvemails", "E-mails must be valid and comma-separated.", function (a) {
        return /^([A-Za-z0-9][+A-Za-z0-9._-]+[A-Za-z0-9]*@[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z]+)([ ]*,[ ]*[A-Za-z0-9][+A-Za-z0-9._-]+[A-Za-z0-9]*@[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z]+)*$/.test(a)
    })
}
function addQuestionTitleValidators() {
    Validation.add("len-question-title", "Questions must be 15-100 characters", {
        minLength: 15,
        maxLength: 100
    })
}
function addFixedLengthValidators() {
    Validation.add("len-exactly-2", "Input must be 2 characters!", {
        minLength: 2,
        maxLength: 2
    });
    Validation.add("len-exactly-3", "Input must be 3 characters!", {
        minLength: 3,
        maxLength: 3
    });
    Validation.add("len-exactly-4", "Input must be 4 characters!", {
        minLength: 4,
        maxLength: 4
    })
}
chartDataArray = new Array();
chartSettingsArray = new Array();

function amChartInited(e) {
    var d = document.getElementById(e);
    if (d && d.setData) {
        if (isDefined(chartDataArray[e] && chartDataArray[e].length)) {
            if (isDefined(chartSettingsArray[e])) {
                var b = chartSettingsArray[e];
                if (b.length == undefined) {
                    for (var a in b) {
                        d.setParam(a, b[a])
                    }
                }
            }
            d.setData(chartDataArray[e])
        }
    }
}
function logFbookSubmit(f, d, b) {
    var a = "useScore=" + (f ? "1" : "0") + ";copyId=" + d;
    var e = (b === null || b == "null") ? "FBCancel" : "FBSubmit";
    logEvent(e, a)
}
function facebook_share(b, e, d, g, f) {
    var a = g ? g : "http://www.creditkarma.com/res/img/facebook/fb_bg_tile_image_DEFAULT.png";
    FB.ui({
        method: "feed",
        name: "Credit Karma",
        link: e,
        picture: a,
        source: a,
        description: d,
        actions: [{
            name: "Become a fan",
            link: "http://www.facebook.com/CreditKarma"
        }]
    }, function (j) {
        var h = j && j.post_id ? j.post_id : null;
        logFbookSubmit(false, b, h);
        if (typeof f == "function") {
            f()
        }
    })
}
function facebook_onlogin(a, d) {
    var b = false;
    if ($("#fbCheck").length != 0) {
        b = $("#fbCheck").attr("checked") == "" || $("#fbCheck").attr("checked") ? true : false
    }
    if (b) {
        facebook_share("score1", "http://www.creditkarma.com/events/redirect?returnURL=/&adcopy=FBScore2&adgroup=img&s=fbk", "I'm in the " + a + " percentile nationwide. Find out how your credit score stacks up at Credit Karma, a completely free service with no hidden fees.", "http://www.creditkarma.com/res/img/facebook/score" + d + ".png")
    } else {
        facebook_share("anon1", "http://www.creditkarma.com/events/redirect?returnURL=/&adcopy=FBAnon2&adgroup=href&s=fbk", "I just updated my credit score at Credit Karma, a completely free service with no hidden fees.")
    }
}
function facebook_footer() {
    facebook_share("footer", "http://www.creditkarma.com/events/redirect?returnURL=/&adcopy=FBFooter&adgroup=href&s=fbk", "I get my credit score at Credit Karma, a completely free service with no hidden fees.")
}
function facebook_vantage() {
    facebook_share("vantage", "http://www.creditkarma.com/events/redirect?returnURL=/&adcopy=FBVantage&adgroup=href&s=fbk", "I get my credit score at Credit Karma, a completely free service with no hidden fees.", false, fbCloseWhenReady)
}
$(function () {
    $("#fbToggle").bind("click", function () {
        var a = (Cookie.get("ffw") ? Cookie.get("ffw") : 984) == 50 ? 984 : 50;
        Cookie.set("ffw", a, false, "/", ".creditkarma.com");
        $(this).attr("class", a == 984 ? "fbDown" : "fbUp");
        $("#facebookFooter").animate({
            width: a
        }, 1000)
    })
});
(function (n) {
    var k = n.writeCaptureSupport = n.writeCaptureSupport || {};
    var l = (function () {
        var d = document.createElement("script");
        var a = "script" + (new Date).getTime();
        var e = document.documentElement;
        d.type = "text/javascript";
        try {
            d.appendChild(document.createTextNode("window." + a + "=1;"))
        } catch (b) {}
        e.insertBefore(d, e.firstChild);
        if (window[a]) {
            delete window[a];
            return true
        }
        return false
    })();

    function o(a) {
        if (a && /\S/.test(a)) {
            var b = document.getElementsByTagName("head")[0] || document.documentElement,
                d = document.createElement("script");
            d.type = "text/javascript";
            if (l) {
                d.appendChild(document.createTextNode(a))
            } else {
                d.text = a
            }
            b.insertBefore(d, b.firstChild);
            b.removeChild(d)
        }
    }
    n.writeCaptureSupport = {
        _original: n.writeCaptureSupport,
        noConflict: function () {
            n.writeCaptureSupport = this._original;
            return this
        },
        ajax: function (f) {
            if (f.dataType === "script") {
                q(f.url, f.success, f.error);
                return
            }
            var g = j(),
                a = false,
                b;
            g.open("GET", f.url, f.async);
            g.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            g.setRequestHeader("Accept", "text/javascript, application/javascript, */*");

            function e() {
                if (!a && g && (g.readyState == 4)) {
                    a = true;
                    if (b) {
                        clearInterval(b);
                        b = null
                    }
                    var r = false;
                    try {
                        r = !g.status && location.protocol == "file:" || (g.status >= 200 && g.status < 300) || g.status == 304 || g.status == 1223
                    } catch (h) {}
                    if (r) {
                        f.success(g.responseText)
                    } else {
                        f.error(g, "error", "xhr.status=" + g.status)
                    }
                    if (f.async) {
                        g = null
                    }
                }
            }
            if (f.async) {
                b = setInterval(e, 20)
            }
            try {
                g.send()
            } catch (d) {
                f.error(g, null, d)
            }
            if (!f.async) {
                e()
            }
        },
        $: m,
        replaceWith: function (t, d) {
            var g, e, u = m(t),
                a = u.parentNode || u.ownerDocument,
                b = document.createElement("div"),
                h = [],
                f = d.replace(/<script(?:[\s\S]*?)>([\S\s]*?)<\/script>/g, function (r, v) {
                    h.push(v);
                    return ""
                });
            b.innerHTML = f;
            for (g = 0, e = b.childNodes.length; g < e; g++) {
                a.insertBefore(b.childNodes.item(g).cloneNode(true), u)
            }
            a.removeChild(u);
            for (g = 0, e = h.length; g < e; g++) {
                o(h[g])
            }
        }
    };

    function p(a) {
        return a && a.nodeType == 1
    }
    function m(a) {
        if (p(a)) {
            return a
        }
        a = a && a.replace(/^\s*/, "").replace(/\s*$/, "");
        if (!/^#[a-zA-Z0-9_:\.\-]+$/.test(a)) {
            throw "nolib-support only allows id based selectors. selector=" + a
        }
        return document.getElementById(a.substring(1))
    }
    var j = n.ActiveXObject ? function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        } : function () {
            return new XMLHttpRequest()
        };

    function q(d, a) {
        var b = document.getElementsByTagName("head")[0];
        var e = document.createElement("script");
        e.src = d;
        var f = false;
        e.onload = e.onreadystatechange = function () {
            if (!f && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                f = true;
                a();
                e.onload = e.onreadystatechange = null;
                b.removeChild(e)
            }
        };
        b.appendChild(e)
    }
})(this);
(function (ar, aW) {
    var aN = aW.document;

    function aw(a) {
        var b = aN.createElement("div");
        aN.body.insertBefore(b, null);
        ar.replaceWith(b, '<script type="text/javascript">' + a + "<\/script>")
    }
    ar = ar || (function (a) {
        return {
            ajax: a.ajax,
            $: function (b) {
                return a(b)[0]
            },
            replaceWith: function (g, b) {
                var d = a(g)[0];
                var e = d.nextSibling,
                    f = d.parentNode;
                a(d).remove();
                if (e) {
                    a(e).before(b)
                } else {
                    a(f).append(b)
                }
            },
            onLoad: function (b) {
                a(b)
            },
            copyAttrs: function (b, g) {
                var e = a(g),
                    j = b.attributes;
                for (var f = 0, h = j.length; f < h; f++) {
                    if (j[f] && j[f].value) {
                        try {
                            e.attr(j[f].name, j[f].value)
                        } catch (d) {}
                    }
                }
            }
        }
    })(aW.jQuery);
    ar.copyAttrs = ar.copyAttrs || function () {};
    ar.onLoad = ar.onLoad || function () {
        throw "error: autoAsync cannot be used without jQuery or defining writeCaptureSupport.onLoad"
    };

    function ag(b, e) {
        for (var d = 0, a = b.length; d < a; d++) {
            if (e(b[d]) === false) {
                return
            }
        }
    }
    function aB(a) {
        return Object.prototype.toString.call(a) === "[object Function]"
    }
    function aH(a) {
        return Object.prototype.toString.call(a) === "[object String]"
    }
    function aC(d, b, a) {
        return Array.prototype.slice.call(d, b || 0, a || d && d.length)
    }
    function at(b, e) {
        var a = false;
        ag(b, d);

        function d(f) {
            return !(a = e(f))
        }
        return a
    }
    function ak(a) {
        this._queue = [];
        this._children = [];
        this._parent = a;
        if (a) {
            a._addChild(this)
        }
    }
    ak.prototype = {
        _addChild: function (a) {
            this._children.push(a)
        },
        push: function (a) {
            this._queue.push(a);
            this._bubble("_doRun")
        },
        pause: function () {
            this._bubble("_doPause")
        },
        resume: function () {
            this._bubble("_doResume")
        },
        _bubble: function (b) {
            var a = this;
            while (!a[b]) {
                a = a._parent
            }
            return a[b]()
        },
        _next: function () {
            if (at(this._children, a)) {
                return true
            }
            function a(d) {
                return d._next()
            }
            var b = this._queue.shift();
            if (b) {
                b()
            }
            return !!b
        }
    };

    function aO(a) {
        if (a) {
            return new ak(a)
        }
        ak.call(this);
        this.paused = 0
    }
    aO.prototype = (function () {
        function a() {}
        a.prototype = ak.prototype;
        return new a()
    })();
    aO.prototype._doRun = function () {
        if (!this.running) {
            this.running = true;
            try {
                while (this.paused < 1 && this._next()) {}
            } finally {
                this.running = false
            }
        }
    };
    aO.prototype._doPause = function () {
        this.paused++
    };
    aO.prototype._doResume = function () {
        this.paused--;
        this._doRun()
    };

    function aj() {}
    aj.prototype = {
        _html: "",
        open: function () {
            this._opened = true;
            if (this._delegate) {
                this._delegate.open()
            }
        },
        write: function (a) {
            if (this._closed) {
                return
            }
            this._written = true;
            if (this._delegate) {
                this._delegate.write(a)
            } else {
                this._html += a
            }
        },
        writeln: function (a) {
            this.write(a + "\n")
        },
        close: function () {
            this._closed = true;
            if (this._delegate) {
                this._delegate.close()
            }
        },
        copyTo: function (a) {
            this._delegate = a;
            a.foobar = true;
            if (this._opened) {
                a.open()
            }
            if (this._written) {
                a.write(this._html)
            }
            if (this._closed) {
                a.close()
            }
        }
    };
    var aS = (function () {
        var a = {
            f: aN.getElementById
        };
        try {
            a.f.call(aN, "abc");
            return true
        } catch (b) {
            return false
        }
    })();

    function an(a) {
        ag(a, function (d) {
            var b = aN.getElementById(d.id);
            if (!b) {
                aL("<proxyGetElementById - finish>", "no element in writen markup with id " + d.id);
                return
            }
            ag(d.el.childNodes, function (e) {
                b.appendChild(e)
            });
            if (b.contentWindow) {
                aW.setTimeout(function () {
                    d.el.contentWindow.document.copyTo(b.contentWindow.document)
                }, 1)
            }
            ar.copyAttrs(d.el, b)
        })
    }
    function aE(b, a) {
        if (a && a[b] === false) {
            return false
        }
        return a && a[b] || aI[b]
    }
    function az(b, e) {
        var j = [],
            k = aE("proxyGetElementById", e),
            g = aE("writeOnGetElementById", e),
            d = {
                write: aN.write,
                writeln: aN.writeln,
                finish: function () {},
                out: ""
            };
        b.state = d;
        aN.write = f;
        aN.writeln = a;
        if (k || g) {
            d.getEl = aN.getElementById;
            aN.getElementById = m;
            if (g) {
                findEl = h
            } else {
                findEl = l;
                d.finish = function () {
                    an(j)
                }
            }
        }
        function f(n) {
            d.out += n
        }
        function a(n) {
            d.out += n + "\n"
        }
        function l(n) {
            var o = aN.createElement("div");
            j.push({
                id: n,
                el: o
            });
            o.contentWindow = {
                document: new aj()
            };
            return o
        }
        function h(n) {
            var p = ar.$(b.target);
            var o = aN.createElement("div");
            p.parentNode.insertBefore(o, p);
            ar.replaceWith(o, d.out);
            d.out = "";
            return aS ? d.getEl.call(aN, n) : d.getEl(n)
        }
        function m(n) {
            var o = aS ? d.getEl.call(aN, n) : d.getEl(n);
            return o || findEl(n)
        }
        return d
    }
    function ab(a) {
        aN.write = a.write;
        aN.writeln = a.writeln;
        if (a.getEl) {
            aN.getElementById = a.getEl
        }
        return a.out
    }
    function ai(a) {
        return a && a.replace(/^\s*<!(\[CDATA\[|--)/, "").replace(/(\]\]|--)>\s*$/, "")
    }
    function aV() {}
    function aT(b, a) {
        console.error("Error", a, "executing code:", b)
    }
    var aL = aB(aW.console && console.error) ? aT : aV;

    function ae(f, e, b) {
        var d = az(e, b);
        try {
            aw(ai(f))
        } catch (a) {
            aL(f, a)
        } finally {
            ab(d)
        }
        return d
    }
    function ah(b) {
        var a = /^(\w+:)?\/\/([^\/?#]+)/.exec(b);
        return a && (a[1] && a[1] != location.protocol || a[2] != location.host)
    }
    function ad(a) {
        return new RegExp(a + "=(?:([\"'])([\\s\\S]*?)\\1|([^\\s>]+))", "i")
    }
    function aM(a) {
        var b = ad(a);
        return function (e) {
            var d = b.exec(e) || [];
            return d[2] || d[3]
        }
    }
    var aF = /(<script[\s\S]*?>)([\s\S]*?)<\/script>/ig,
        aJ = ad("src"),
        Z = aM("src"),
        aG = aM("type"),
        Q = aM("language"),
        au = "__document_write_ajax_callbacks__",
        av = "__document_write_ajax_div-",
        aQ = "window['" + au + "']['%d']();",
        aK = aW[au] = {}, aA = '<script type="text/javascript">' + aQ + "<\/script>",
        ao = 0;

    function aU() {
        return (++ao).toString()
    }
    function ap(d, b) {
        var a;
        if (aB(d)) {
            a = d;
            d = null
        }
        d = d || {};
        a = a || d && d.done;
        d.done = b ? function () {
            b(a)
        } : a;
        return d
    }
    var ax = new aO();
    var ay = [];
    var aR = window._debugWriteCapture ? function () {} : function (a, d, b) {
            ay.push({
                type: a,
                src: d,
                data: b
            })
        };
    var al = window._debugWriteCapture ? function () {} : function () {
            ay.push(arguments)
        };

    function aa(a) {
        var b = aU();
        aK[b] = function () {
            a();
            delete aK[b]
        };
        return b
    }
    function am(a) {
        return aA.replace(/%d/, aa(a))
    }
    function af(j, e, a, g) {
        var h = a && new aO(a) || ax;
        e = ap(e);
        var k = aE("done", e);
        var d = "";
        var b = aE("fixUrls", e);
        if (!aB(b)) {
            b = function (l) {
                return l
            }
        }
        if (aB(k)) {
            d = am(function () {
                h.push(k)
            })
        }
        return j.replace(aF, f) + d;

        function f(E, p, F) {
            var A = Z(p),
                B = aG(p) || "",
                u = Q(p) || "",
                w = (!B && !u) || B.toLowerCase().indexOf("javascript") !== -1 || u.toLowerCase().indexOf("javascript") !== -1;
            aR("replace", A, E);
            if (!w) {
                return E
            }
            var o = aa(y),
                z = av + o,
                q, C = {
                    target: "#" + z,
                    parent: g
                };

            function y() {
                h.push(q)
            }
            if (A) {
                A = b(A);
                p = p.replace(aJ, "");
                if (ah(A)) {
                    q = l
                } else {
                    if (aE("asyncAll", e)) {
                        q = m()
                    } else {
                        q = r
                    }
                }
            } else {
                q = n
            }
            function n() {
                G(F)
            }
            function r() {
                ar.ajax({
                    url: A,
                    type: "GET",
                    dataType: "text",
                    async: false,
                    success: function (H) {
                        G(H)
                    }
                })
            }
            function D(H, J, I) {
                aL("<XHR for " + A + ">", I);
                h.resume()
            }
            function v() {
                return am(function () {
                    h.resume()
                })
            }
            function m() {
                var H, I;

                function J(L, M) {
                    if (!H) {
                        I = L;
                        return
                    }
                    try {
                        G(L, v())
                    } catch (K) {
                        aL(L, K)
                    }
                }
                ar.ajax({
                    url: A,
                    type: "GET",
                    dataType: "text",
                    async: true,
                    success: J,
                    error: D
                });
                return function () {
                    H = true;
                    if (I) {
                        G(I)
                    } else {
                        h.pause()
                    }
                }
            }
            function l(J) {
                var H = az(C, e);
                h.pause();
                aR("pause", A);
                ar.ajax({
                    url: A,
                    type: "GET",
                    dataType: "script",
                    success: I,
                    error: D
                });

                function I(K, L, M) {
                    aR("out", A, H.out);
                    t(ab(H), am(H.finish) + v());
                    aR("resume", A)
                }
            }
            function G(I, J) {
                var H = ae(I, C, e);
                J = am(H.finish) + (J || "");
                t(H.out, J)
            }
            function t(H, I) {
                ar.replaceWith(C.target, af(H, null, h, C) + (I || ""))
            }
            return '<div style="display: none" id="' + z + '"></div>' + p + aQ.replace(/%d/, o) + "<\/script>"
        }
    }
    function aq(d, b) {
        var a = ax;
        ag(d, function (f) {
            a.push(e);

            function e() {
                f.action(af(f.html, f.options, a), f)
            }
        });
        if (b) {
            a.push(b)
        }
    }
    function ac(a) {
        var b = a;
        while (b && b.nodeType === 1) {
            a = b;
            b = b.lastChild;
            while (b && b.nodeType !== 1) {
                b = b.previousSibling
            }
        }
        return a
    }
    function aP(d) {
        var g = aN.write,
            a = aN.writeln,
            f, e = [];
        aN.writeln = function (h) {
            aN.write(h + "\n")
        };
        var b;
        aN.write = function (h) {
            var j = ac(aN.body);
            if (j !== f) {
                f = j;
                e.push(b = {
                    el: j,
                    out: []
                })
            }
            b.out.push(h)
        };
        ar.onLoad(function () {
            var j, n, l, o, h;
            d = ap(d);
            h = d.done;
            d.done = function () {
                aN.write = g;
                aN.writeln = a;
                if (h) {
                    h()
                }
            };
            for (var k = 0, m = e.length; k < m; k++) {
                j = e[k].el;
                n = aN.createElement("div");
                j.parentNode.insertBefore(n, j.nextSibling);
                l = e[k].out.join("");
                o = m - k === 1 ? af(l, d) : af(l);
                ar.replaceWith(n, o)
            }
        })
    }
    var aD = "writeCapture";
    var aI = aW[aD] = {
        _original: aW[aD],
        fixUrls: function (a) {
            return a.replace(/&amp;/g, "&")
        },
        noConflict: function () {
            aW[aD] = this._original;
            return this
        },
        debug: ay,
        proxyGetElementById: false,
        _forTest: {
            Q: aO,
            GLOBAL_Q: ax,
            $: ar,
            matchAttr: aM,
            slice: aC,
            capture: az,
            uncapture: ab,
            captureWrite: ae
        },
        replaceWith: function (a, d, b) {
            ar.replaceWith(a, af(d, b))
        },
        html: function (a, b, e) {
            var d = ar.$(a);
            d.innerHTML = "<span/>";
            ar.replaceWith(d.firstChild, af(b, e))
        },
        load: function (a, d, b) {
            ar.ajax({
                url: d,
                dataType: "text",
                type: "GET",
                success: function (e) {
                    aI.html(a, e, b)
                }
            })
        },
        autoAsync: aP,
        sanitize: af,
        sanitizeSerial: aq
    }
})(this.writeCaptureSupport, this);
var inheriting = {}, AmCharts = {
    Class: function (f) {
        var e = function () {
            arguments[0] !== inheriting && (this.events = {}, this.construct.apply(this, arguments))
        };
        f.inherits ? (e.prototype = new f.inherits(inheriting), e.base = f.inherits.prototype, delete f.inherits) : (e.prototype.createEvents = function () {
            for (var h = 0, d = arguments.length; h < d; h++) {
                this.events[arguments[h]] = []
            }
        }, e.prototype.listenTo = function (j, h, k) {
            j.events[h].push({
                handler: k,
                scope: this
            })
        }, e.prototype.addListener = function (j, h, k) {
            this.events[j].push({
                handler: h,
                scope: k
            })
        }, e.prototype.removeListener = function (j, h, k) {
            j = j.events[h];
            for (h = j.length - 1; 0 <= h; h--) {
                j[h].handler === k && j.splice(h, 1)
            }
        }, e.prototype.fire = function (l, k) {
            for (var p = this.events[l], o = 0, n = p.length; o < n; o++) {
                var m = p[o];
                m.handler.call(m.scope, k)
            }
        });
        for (var g in f) {
            e.prototype[g] = f[g]
        }
        return e
    },
    charts: [],
    addChart: function (b) {
        AmCharts.charts.push(b)
    },
    removeChart: function (f) {
        for (var e = AmCharts.charts, g = e.length - 1; 0 <= g; g--) {
            e[g] == f && e.splice(g, 1)
        }
    }
};
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, AmCharts.dx = 0, AmCharts.dy = 0);
if (document.addEventListener || window.opera) {
    AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5
}
window.chrome && (AmCharts.chrome = !0);
AmCharts.IEversion = 0; - 1 != navigator.appVersion.indexOf("MSIE") && document.documentMode && (AmCharts.IEversion = document.documentMode);
9 <= AmCharts.IEversion && (AmCharts.ddd = 0.5);
AmCharts.handleResize = function () {
    for (var f = AmCharts.charts, e = 0; e < f.length; e++) {
        var g = f[e];
        g && g.div && g.handleResize()
    }
};
AmCharts.handleMouseUp = function (g) {
    for (var f = AmCharts.charts, j = 0; j < f.length; j++) {
        var h = f[j];
        h && h.handleReleaseOutside(g)
    }
};
AmCharts.handleMouseMove = function (g) {
    for (var f = AmCharts.charts, j = 0; j < f.length; j++) {
        var h = f[j];
        h && h.handleMouseMove(g)
    }
};
AmCharts.resetMouseOver = function () {
    for (var f = AmCharts.charts, e = 0; e < f.length; e++) {
        var g = f[e];
        if (g) {
            g.mouseIsOver = false
        }
    }
};
AmCharts.onReadyArray = [];
AmCharts.ready = function (b) {
    AmCharts.onReadyArray.push(b)
};
AmCharts.handleLoad = function () {
    for (var e = AmCharts.onReadyArray, d = 0; d < e.length; d++) {
        (0, e[d])()
    }
};
AmCharts.useUTC = !1;
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function () {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.AmChart = AmCharts.Class({
    construct: function () {
        this.version = "2.6.13";
        AmCharts.addChart(this);
        this.createEvents("dataUpdated");
        this.height = this.width = "100%";
        this.dataChanged = !0;
        this.chartCreated = !1;
        this.previousWidth = this.previousHeight = 0;
        this.backgroundColor = "#FFFFFF";
        this.borderAlpha = this.backgroundAlpha = 0;
        this.color = this.borderColor = "#000000";
        this.fontFamily = "Verdana";
        this.fontSize = 11;
        this.numberFormatter = {
            precision: -1,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.percentFormatter = {
            precision: 2,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.labels = [];
        this.allLabels = [];
        this.titles = [];
        this.autoMarginOffset = 0;
        var e = document.createElement("div"),
            d = e.style;
        d.overflow = "hidden";
        d.position = "relative";
        d.textAlign = "left";
        this.chartDiv = e;
        e = document.createElement("div");
        d = e.style;
        d.overflow = "hidden";
        d.position = "relative";
        this.legendDiv = e;
        this.balloon = new AmCharts.AmBalloon;
        this.balloon.chart = this;
        this.titleHeight = 0;
        this.prefixesOfBigNumbers = [{
            number: 1000,
            prefix: "k"
        }, {
            number: 1000000,
            prefix: "M"
        }, {
            number: 1000000000,
            prefix: "G"
        }, {
            number: 1000000000000,
            prefix: "T"
        }, {
            number: 1000000000000000,
            prefix: "P"
        }, {
            number: 1000000000000000000,
            prefix: "E"
        }, {
            number: 1e+21,
            prefix: "Z"
        }, {
            number: 1e+24,
            prefix: "Y"
        }];
        this.prefixesOfSmallNumbers = [{
            number: 1e-24,
            prefix: "y"
        }, {
            number: 1e-21,
            prefix: "z"
        }, {
            number: 1e-18,
            prefix: "a"
        }, {
            number: 1e-15,
            prefix: "f"
        }, {
            number: 1e-12,
            prefix: "p"
        }, {
            number: 1e-9,
            prefix: "n"
        }, {
            number: 0.000001,
            prefix: "\u03bc"
        }, {
            number: 0.001,
            prefix: "m"
        }];
        this.panEventsEnabled = !1
    },
    drawChart: function () {
        var h = this.container,
            g = this.realWidth,
            l = this.realHeight,
            k = this.set,
            j = AmCharts.polygon(h, [0, g - 1, g - 1, 0], [0, 0, l - 1, l - 1], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        this.background = j;
        k.push(j);
        if (j = this.backgroundImage) {
            this.path && (j = this.path + j), this.bgImg = h = h.image(j, 0, 0, g, l), k.push(h)
        }
        this.redrawLabels();
        this.drawTitles()
    },
    drawTitles: function () {
        var k = this.titles;
        if (AmCharts.ifArray(k)) {
            for (var j = 20, p = 0; p < k.length; p++) {
                var o = k[p],
                    n = o.color;
                void 0 == n && (n = this.color);
                var m = o.size;
                isNaN(o.alpha);
                var l = this.marginLeft,
                    n = AmCharts.text(this.container, o.text, n, this.fontFamily, m);
                n.translate(l + (this.divRealWidth - this.marginRight - l) / 2, j);
                l = !0;
                void 0 != o.bold && (l = o.bold);
                l && n.attr({
                    "font-weight": "bold"
                });
                j += m + 6;
                this.freeLabelsSet.push(n)
            }
        }
    },
    write: function (k) {
        var j = this.balloon;
        j && !j.chart && (j.chart = this);
        this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
        this.div = k = "object" != typeof k ? document.getElementById(k) : k;
        k.style.overflow = "hidden";
        var j = this.chartDiv,
            p = this.legendDiv,
            o = this.legend,
            n = p.style,
            m = j.style;
        this.measure();
        if (o) {
            switch (o.position) {
                case "bottom":
                    k.appendChild(j);
                    k.appendChild(p);
                    break;
                case "top":
                    k.appendChild(p);
                    k.appendChild(j);
                    break;
                case "absolute":
                    var l = document.createElement("div");
                    l.style.position = "relative";
                    k.appendChild(l);
                    n.position = "absolute";
                    m.position = "absolute";
                    void 0 != o.left && (n.left = o.left);
                    void 0 != o.right && (n.right = o.right);
                    void 0 != o.top && (n.top = o.top);
                    void 0 != o.bottom && (n.bottom = o.bottom);
                    l.appendChild(j);
                    l.appendChild(p);
                    break;
                case "right":
                    n.position = "relative";
                    m.position = "absolute";
                    k.appendChild(j);
                    k.appendChild(p);
                    break;
                case "left":
                    n.position = "relative", m.position = "absolute", k.appendChild(j), k.appendChild(p)
            }
        } else {
            k.appendChild(j)
        }
        this.initChart()
    },
    createLabelsSet: function () {
        AmCharts.remove(this.labelsSet);
        this.labelsSet = this.container.set();
        this.freeLabelsSet.push(this.labelsSet)
    },
    initChart: function () {
        this.divIsFixed = AmCharts.findIfFixed(this.chartDiv);
        this.previousHeight = this.realHeight;
        this.previousWidth = this.realWidth;
        this.destroy();
        var e = 0;
        if (document.attachEvent && !window.opera) {
            var e = 1,
                d = this.legend;
            if (d && (d = d.position, "right" == d || "left" == d)) {
                e = 2
            }
        }
        AmCharts.isNN && AmCharts.findIfAuto(this.chartDiv) && (e = 3);
        this.mouseMode = e;
        e = this.container = new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight);
        this.set = e.set();
        this.gridSet = e.set();
        this.columnSet = e.set();
        this.graphsSet = e.set();
        this.trendLinesSet = e.set();
        this.axesLabelsSet = e.set();
        this.axesSet = e.set();
        this.cursorSet = e.set();
        this.scrollbarsSet = e.set();
        this.bulletSet = e.set();
        this.freeLabelsSet = e.set();
        this.balloonsSet = e.set();
        this.zoomButtonSet = e.set();
        this.linkSet = e.set();
        this.drb();
        this.renderFix()
    },
    measure: function () {
        var j = this.div,
            h = this.chartDiv,
            n = j.offsetWidth,
            m = j.offsetHeight,
            l = this.container;
        j.clientHeight && (n = j.clientWidth, m = j.clientHeight);
        var j = AmCharts.toCoordinate(this.width, n),
            k = AmCharts.toCoordinate(this.height, m);
        if (j != this.previousWidth || k != this.previousHeight) {
            h.style.width = j + "px", h.style.height = k + "px", l && l.setSize(j, k), this.balloon.setBounds(2, 2, j - 2, k)
        }
        this.realWidth = j;
        this.realHeight = k;
        this.divRealWidth = n;
        this.divRealHeight = m
    },
    destroy: function () {
        this.chartDiv.innerHTML = "";
        this.clearTimeOuts()
    },
    clearTimeOuts: function () {
        var e = this.timeOuts;
        if (e) {
            for (var d = 0; d < e.length; d++) {
                clearTimeout(e[d])
            }
        }
        this.timeOuts = []
    },
    clear: function () {
        AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
        this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
        this.clearTimeOuts();
        this.container && this.container.remove();
        AmCharts.removeChart(this)
    },
    setMouseCursor: function (b) {
        "auto" == b && AmCharts.isNN && (b = "default");
        this.chartDiv.style.cursor = b;
        this.legendDiv.style.cursor = b
    },
    redrawLabels: function () {
        this.labels = [];
        var e = this.allLabels;
        this.createLabelsSet();
        for (var d = 0; d < e.length; d++) {
            this.drawLabel(e[d])
        }
    },
    drawLabel: function (v) {
        if (this.container) {
            var u = v.y,
                t = v.text,
                r = v.align,
                q = v.size,
                p = v.color,
                o = v.rotation,
                n = v.alpha,
                m = v.bold,
                l = AmCharts.toCoordinate(v.x, this.realWidth),
                u = AmCharts.toCoordinate(u, this.realHeight);
            l || (l = 0);
            u || (u = 0);
            void 0 == p && (p = this.color);
            isNaN(q) && (q = this.fontSize);
            r || (r = "start");
            "left" == r && (r = "start");
            "right" == r && (r = "end");
            "center" == r && (r = "middle", o ? u = this.realHeight - u + u / 2 : l = this.realWidth / 2 - l);
            void 0 == n && (n = 1);
            void 0 == o && (o = 0);
            u += q / 2;
            v = AmCharts.text(this.container, t, p, this.fontFamily, q, r, m, n);
            v.translate(l, u);
            0 != o && v.rotate(o);
            this.labelsSet.push(v);
            this.labels.push(v)
        }
    },
    addLabel: function (t, r, q, p, o, n, m, l, k) {
        t = {
            x: t,
            y: r,
            text: q,
            align: p,
            size: o,
            color: n,
            alpha: l,
            rotation: m,
            bold: k
        };
        this.container && this.drawLabel(t);
        this.allLabels.push(t)
    },
    clearLabels: function () {
        for (var e = this.labels, d = e.length - 1; 0 <= d; d--) {
            e[d].remove()
        }
        this.labels = [];
        this.allLabels = []
    },
    updateHeight: function () {
        var f = this.divRealHeight,
            e = this.legend;
        if (e) {
            var g = this.legendDiv.offsetHeight,
                e = e.position;
            if ("top" == e || "bottom" == e) {
                f -= g, 0 > f && (f = 0), this.chartDiv.style.height = f + "px"
            }
        }
        return f
    },
    updateWidth: function () {
        var k = this.divRealWidth,
            j = this.divRealHeight,
            p = this.legend;
        if (p) {
            var o = this.legendDiv,
                n = o.offsetWidth,
                m = o.offsetHeight,
                o = o.style,
                l = this.chartDiv.style,
                p = p.position;
            if ("right" == p || "left" == p) {
                k -= n, 0 > k && (k = 0), l.width = k + "px", "left" == p ? l.left = AmCharts.findPosX(this.div) + n + "px" : o.left = k + "px", o.top = (j - m) / 2 + "px"
            }
        }
        return k
    },
    getTitleHeight: function () {
        var f = 0,
            e = this.titles;
        if (0 < e.length) {
            for (var f = 15, g = 0; g < e.length; g++) {
                f += e[g].size + 6
            }
        }
        return f
    },
    addTitle: function (h, g, l, k, j) {
        isNaN(g) && (g = this.fontSize + 2);
        h = {
            text: h,
            size: g,
            color: l,
            alpha: k,
            bold: j
        };
        this.titles.push(h);
        return h
    },
    addListeners: function () {
        var e = this,
            d = e.chartDiv;
        AmCharts.isNN && (e.panEventsEnabled && "ontouchstart" in document.documentElement && (d.addEventListener("touchstart", function (a) {
            e.handleTouchMove.call(e, a)
        }, !0), d.addEventListener("touchmove", function (a) {
            e.handleTouchMove.call(e, a)
        }, !0), d.addEventListener("touchstart", function (a) {
            e.handleTouchStart.call(e, a)
        }), d.addEventListener("touchend", function (a) {
            e.handleTouchEnd.call(e, a)
        })), d.addEventListener("mousedown", function (a) {
            e.handleMouseDown.call(e, a)
        }, !0), d.addEventListener("mouseover", function (a) {
            e.handleMouseOver.call(e, a)
        }, !0), d.addEventListener("mouseout", function (a) {
            e.handleMouseOut.call(e, a)
        }, !0));
        AmCharts.isIE && (d.attachEvent("onmousedown", function (a) {
            e.handleMouseDown.call(e, a)
        }), d.attachEvent("onmouseover", function (a) {
            e.handleMouseOver.call(e, a)
        }), d.attachEvent("onmouseout", function (a) {
            e.handleMouseOut.call(e, a)
        }))
    },
    dispDUpd: function () {
        this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, this.fire("dataUpdated", {
            type: "dataUpdated",
            chart: this
        }))
    },
    drb: function () {},
    invalidateSize: function () {
        var f = this;
        f.measure();
        var e = f.legend;
        if ((f.realWidth != f.previousWidth || f.realHeight != f.previousHeight) && f.chartCreated) {
            if (e) {
                clearTimeout(f.legendInitTO);
                var g = setTimeout(function () {
                    e.invalidateSize()
                }, 100);
                f.timeOuts.push(g);
                f.legendInitTO = g
            }
            clearTimeout(f.initTO);
            g = setTimeout(function () {
                f.initChart()
            }, 100);
            f.timeOuts.push(g);
            f.initTO = g
        }
        f.renderFix();
        e && e.renderFix()
    },
    validateData: function (b) {
        this.chartCreated && (this.dataChanged = !0, this.initChart(b))
    },
    validateNow: function () {
        this.initChart()
    },
    showItem: function (b) {
        b.hidden = !1;
        this.initChart()
    },
    hideItem: function (b) {
        b.hidden = !0;
        this.initChart()
    },
    hideBalloon: function () {
        var b = this;
        b.hoverInt = setTimeout(function () {
            b.hideBalloonReal.call(b)
        }, 80)
    },
    hideBalloonReal: function () {
        var b = this.balloon;
        b && b.hide()
    },
    showBalloon: function (j, h, n, m, l) {
        var k = this;
        clearTimeout(k.balloonTO);
        k.balloonTO = setTimeout(function () {
            k.showBalloonReal.call(k, j, h, n, m, l)
        }, 1)
    },
    showBalloonReal: function (j, h, n, m, l) {
        this.handleMouseMove();
        var k = this.balloon;
        k.enabled && (k.followCursor(!1), k.changeColor(h), n || k.setPosition(m, l), k.followCursor(n), j && k.showBalloon(j))
    },
    handleTouchMove: function (e) {
        this.hideBalloon();
        var d = this.chartDiv;
        e.touches && (e = e.touches.item(0), this.mouseX = e.pageX - AmCharts.findPosX(d), this.mouseY = e.pageY - AmCharts.findPosY(d))
    },
    handleMouseOver: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0
    },
    handleMouseOut: function () {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !1
    },
    handleMouseMove: function (g) {
        if (this.mouseIsOver) {
            var f = this.chartDiv;
            g || (g = window.event);
            var j, h;
            if (g) {
                switch (this.mouseMode) {
                    case 3:
                        j = g.pageX - AmCharts.findPosX(f) + AmCharts.findScrollLeft(f, 0);
                        h = g.pageY - AmCharts.findPosY(f) + AmCharts.findScrollTop(f, 0);
                        break;
                    case 2:
                        j = g.x - AmCharts.findPosX(f);
                        h = g.y - AmCharts.findPosY(f);
                        break;
                    case 1:
                        j = g.x;
                        h = g.y;
                        break;
                    case 0:
                        this.divIsFixed ? (j = g.clientX - AmCharts.findPosX(f), h = g.clientY - AmCharts.findPosY(f)) : (j = g.pageX - AmCharts.findPosX(f), h = g.pageY - AmCharts.findPosY(f))
                }
                this.mouseX = j;
                this.mouseY = h
            }
        }
    },
    handleTouchStart: function (b) {
        this.handleMouseDown(b)
    },
    handleTouchEnd: function (b) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(b)
    },
    handleReleaseOutside: function () {},
    handleMouseDown: function (b) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        b && b.preventDefault && b.preventDefault()
    },
    addLegend: function (e) {
        this.legend = e;
        e.chart = this;
        e.div = this.legendDiv;
        var d = this.handleLegendEvent;
        this.listenTo(e, "showItem", d);
        this.listenTo(e, "hideItem", d);
        this.listenTo(e, "clickMarker", d);
        this.listenTo(e, "rollOverItem", d);
        this.listenTo(e, "rollOutItem", d);
        this.listenTo(e, "rollOverMarker", d);
        this.listenTo(e, "rollOutMarker", d);
        this.listenTo(e, "clickLabel", d)
    },
    removeLegend: function () {
        this.legend = void 0
    },
    handleResize: function () {
        (AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSize();
        this.renderFix()
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var b = this.container;
            b && b.renderFix()
        }
    },
    getSVG: function () {
        if (AmCharts.hasSVG) {
            return this.container
        }
    }
});
AmCharts.Slice = AmCharts.Class({
    construct: function () {}
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function () {}
});
AmCharts.Guide = AmCharts.Class({
    construct: function () {}
});
AmCharts.toBoolean = function (e, d) {
    if (void 0 == e) {
        return d
    }
    switch (("" + e).toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return !0;
        case "false":
        case "no":
        case "0":
        case null:
            return !1;
        default:
            return Boolean(e)
    }
};
AmCharts.removeFromArray = function (f, e) {
    for (var g = f.length - 1; 0 <= g; g--) {
        f[g] == e && f.splice(g, 1)
    }
};
AmCharts.getURL = function (f, e) {
    if (f) {
        if ("_self" == e || !e) {
            window.location.href = f
        } else {
            var g = document.getElementsByName(e)[0];
            g ? g.src = f : window.open(f)
        }
    }
};
AmCharts.formatMilliseconds = function (g, f) {
    if (-1 != g.indexOf("fff")) {
        var j = f.getMilliseconds(),
            h = "" + j;
        10 > j && (h = "00" + j);
        10 <= j && 100 > j && (h = "0" + j);
        g = g.replace(/fff/g, h)
    }
    return g
};
AmCharts.ifArray = function (b) {
    return b && 0 < b.length ? !0 : !1
};
AmCharts.callMethod = function (k, j) {
    for (var p = 0; p < j.length; p++) {
        var o = j[p];
        if (o) {
            if (o[k]) {
                o[k]()
            }
            var n = o.length;
            if (0 < n) {
                for (var m = 0; m < n; m++) {
                    var l = o[m];
                    if (l && l[k]) {
                        l[k]()
                    }
                }
            }
        }
    }
};
AmCharts.toNumber = function (b) {
    return "number" == typeof b ? b : Number(("" + b).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function (f) {
    if ("" != f && void 0 != f) {
        if (-1 != f.indexOf(",")) {
            for (var f = f.split(","), e = 0; e < f.length; e++) {
                var g = f[e].substring(f[e].length - 6, f[e].length);
                f[e] = "#" + g
            }
        } else {
            f = f.substring(f.length - 6, f.length), f = "#" + f
        }
    }
    return f
};
AmCharts.toCoordinate = function (g, f, j) {
    var h;
    void 0 != g && (g = g.toString(), j && j < f && (f = j), h = Number(g), -1 != g.indexOf("!") && (h = f - Number(g.substr(1))), -1 != g.indexOf("%") && (h = f * Number(g.substr(0, g.length - 1)) / 100));
    return h
};
AmCharts.fitToBounds = function (f, e, g) {
    f < e && (f = e);
    f > g && (f = g);
    return f
};
AmCharts.isDefined = function (b) {
    return void 0 == b ? !1 : !0
};
AmCharts.stripNumbers = function (b) {
    return b.replace(/[0-9]+/g, "")
};
AmCharts.extractPeriod = function (f) {
    var e = AmCharts.stripNumbers(f),
        g = 1;
    e != f && (g = Number(f.slice(0, f.indexOf(e))));
    return {
        period: e,
        count: g
    }
};
AmCharts.resetDateToMin = function (y, w, v, u) {
    void 0 == u && (u = 1);
    var t = y.getFullYear(),
        r = y.getMonth(),
        q = y.getDate(),
        p = y.getHours(),
        o = y.getMinutes(),
        n = y.getSeconds(),
        m = y.getMilliseconds(),
        y = y.getDay();
    switch (w) {
        case "YYYY":
            t = Math.floor(t / v) * v;
            r = 0;
            q = 1;
            m = n = o = p = 0;
            break;
        case "MM":
            r = Math.floor(r / v) * v;
            q = 1;
            m = n = o = p = 0;
            break;
        case "WW":
            0 == y && 0 < u && (y = 7);
            q = q - y + u;
            m = n = o = p = 0;
            break;
        case "DD":
            q = Math.floor(q / v) * v;
            m = n = o = p = 0;
            break;
        case "hh":
            p = Math.floor(p / v) * v;
            m = n = o = 0;
            break;
        case "mm":
            o = Math.floor(o / v) * v;
            m = n = 0;
            break;
        case "ss":
            n = Math.floor(n / v) * v;
            m = 0;
            break;
        case "fff":
            m = Math.floor(m / v) * v
    }
    return y = new Date(t, r, q, p, o, n, m)
};
AmCharts.getPeriodDuration = function (f, e) {
    void 0 == e && (e = 1);
    var g;
    switch (f) {
        case "YYYY":
            g = 31622400000;
            break;
        case "MM":
            g = 2678400000;
            break;
        case "WW":
            g = 604800000;
            break;
        case "DD":
            g = 86400000;
            break;
        case "hh":
            g = 3600000;
            break;
        case "mm":
            g = 60000;
            break;
        case "ss":
            g = 1000;
            break;
        case "fff":
            g = 1
    }
    return g * e
};
AmCharts.roundTo = function (f, e) {
    if (0 > e) {
        return f
    }
    var g = Math.pow(10, e);
    return Math.round(f * g) / g
};
AmCharts.intervals = {
    s: {
        nextInterval: "ss",
        contains: 1000
    },
    ss: {
        nextInterval: "mm",
        contains: 60,
        count: 0
    },
    mm: {
        nextInterval: "hh",
        contains: 60,
        count: 1
    },
    hh: {
        nextInterval: "DD",
        contains: 24,
        count: 2
    },
    DD: {
        nextInterval: "",
        contains: Infinity,
        count: 3
    }
};
AmCharts.getMaxInterval = function (f, e) {
    var g = AmCharts.intervals;
    return f >= g[e].contains ? (f = Math.round(f / g[e].contains), e = g[e].nextInterval, AmCharts.getMaxInterval(f, e)) : "ss" == e ? g[e].nextInterval : e
};
AmCharts.formatDuration = function (t, r, q, p, o, n) {
    var m = AmCharts.intervals,
        l = n.decimalSeparator;
    if (t >= m[r].contains) {
        var k = t - Math.floor(t / m[r].contains) * m[r].contains;
        "ss" == r && (k = AmCharts.formatNumber(k, n), 1 == k.split(l)[0].length && (k = "0" + k));
        if (("mm" == r || "hh" == r) && 10 > k) {
            k = "0" + k
        }
        q = k + "" + p[r] + "" + q;
        t = Math.floor(t / m[r].contains);
        r = m[r].nextInterval;
        return AmCharts.formatDuration(t, r, q, p, o, n)
    }
    "ss" == r && (t = AmCharts.formatNumber(t, n), 1 == t.split(l)[0].length && (t = "0" + t));
    if (("mm" == r || "hh" == r) && 10 > t) {
        t = "0" + t
    }
    q = t + "" + p[r] + "" + q;
    if (m[o].count > m[r].count) {
        for (t = m[r].count; t < m[o].count; t++) {
            r = m[r].nextInterval, "ss" == r || "mm" == r || "hh" == r ? q = "00" + p[r] + "" + q : "DD" == r && (q = "0" + p[r] + "" + q)
        }
    }
    ":" == q.charAt(q.length - 1) && (q = q.substring(0, q.length - 1));
    return q
};
AmCharts.formatNumber = function (y, w, v, u, t) {
    y = AmCharts.roundTo(y, w.precision);
    isNaN(v) && (v = w.precision);
    var r = w.decimalSeparator,
        w = w.thousandsSeparator,
        q = 0 > y ? "-" : "",
        y = Math.abs(y),
        p = y.toString();
    if (-1 == p.indexOf("e")) {
        for (var p = p.split("."), o = "", n = p[0].toString(), m = n.length; 0 <= m; m -= 3) {
            o = m != n.length ? 0 != m ? n.substring(m - 3, m) + w + o : n.substring(m - 3, m) + o : n.substring(m - 3, m)
        }
        void 0 != p[1] && (o = o + r + p[1]);
        void 0 != v && (0 < v && "0" != o) && (o = AmCharts.addZeroes(o, r, v))
    } else {
        o = p
    }
    o = q + o;
    "" == q && (!0 == u && 0 != y) && (o = "+" + o);
    !0 == t && (o += "%");
    return o
};
AmCharts.addZeroes = function (f, e, g) {
    f = f.split(e);
    void 0 == f[1] && 0 < g && (f[1] = "0");
    return f[1].length < g ? (f[1] += "0", AmCharts.addZeroes(f[0] + e + f[1], e, g)) : void 0 != f[1] ? f[0] + e + f[1] : f[0]
};
AmCharts.scientificToNormal = function (g) {
    var f, g = g.toString().split("e");
    if ("-" == g[1].substr(0, 1)) {
        f = "0.";
        for (var j = 0; j < Math.abs(Number(g[1])) - 1; j++) {
            f += "0"
        }
        f += g[0].split(".").join("")
    } else {
        var h = 0;
        f = g[0].split(".");
        f[1] && (h = f[1].length);
        f = g[0].split(".").join("");
        for (j = 0; j < Math.abs(Number(g[1])) - h; j++) {
            f += "0"
        }
    }
    return f
};
AmCharts.toScientific = function (f, e) {
    if (0 == f) {
        return "0"
    }
    var g = Math.floor(Math.log(Math.abs(f)) * Math.LOG10E);
    Math.pow(10, g);
    mantissa = mantissa.toString().split(".").join(e);
    return mantissa.toString() + "e" + g
};
AmCharts.randomColor = function () {
    function b() {
        return Math.floor(256 * Math.random()).toString(16)
    }
    return "#" + b() + b() + b()
};
AmCharts.hitTest = function (t, r, q) {
    var p = !1,
        o = t.x,
        n = t.x + t.width,
        m = t.y,
        l = t.y + t.height,
        k = AmCharts.isInRectangle;
    p || (p = k(o, m, r));
    p || (p = k(o, l, r));
    p || (p = k(n, m, r));
    p || (p = k(n, l, r));
    !p && !0 != q && (p = AmCharts.hitTest(r, t, !0));
    return p
};
AmCharts.isInRectangle = function (f, e, g) {
    return f >= g.x - 5 && f <= g.x + g.width + 5 && e >= g.y - 5 && e <= g.y + g.height + 5 ? !0 : !1
};
AmCharts.isPercents = function (b) {
    if (-1 != ("" + b).indexOf("%")) {
        return !0
    }
};
AmCharts.dayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
AmCharts.monthNames = "January February March April May June July August September October November December".split(" ");
AmCharts.shortMonthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
AmCharts.formatDate = function (I, H) {
    var G, F, E, D, C, B, A, z;
    AmCharts.useUTC ? (G = I.getUTCFullYear(), F = I.getUTCMonth(), E = I.getUTCDate(), D = I.getUTCDay(), C = I.getUTCHours(), B = I.getUTCMinutes(), A = I.getUTCSeconds(), z = I.getUTCMilliseconds()) : (G = I.getFullYear(), F = I.getMonth(), E = I.getDate(), D = I.getDay(), C = I.getHours(), B = I.getMinutes(), A = I.getSeconds(), z = I.getMilliseconds());
    var y = ("" + G).substr(2, 2),
        u = F + 1;
    9 > F && (u = "0" + u);
    var t = E;
    10 > E && (t = "0" + E);
    var w = "0" + D,
        v = C;
    24 == v && (v = 0);
    var r = v;
    10 > r && (r = "0" + r);
    H = H.replace(/JJ/g, r);
    H = H.replace(/J/g, v);
    v = C;
    0 == v && (v = 24);
    r = v;
    10 > r && (r = "0" + r);
    H = H.replace(/HH/g, r);
    H = H.replace(/H/g, v);
    v = C;
    11 < v && (v -= 12);
    r = v;
    10 > r && (r = "0" + r);
    H = H.replace(/KK/g, r);
    H = H.replace(/K/g, v);
    v = C;
    0 == v && (v = 12);
    12 < v && (v -= 12);
    r = v;
    10 > r && (r = "0" + r);
    H = H.replace(/LL/g, r);
    H = H.replace(/L/g, v);
    v = B;
    10 > v && (v = "0" + v);
    H = H.replace(/NN/g, v);
    H = H.replace(/N/g, B);
    B = A;
    10 > B && (B = "0" + B);
    H = H.replace(/SS/g, B);
    H = H.replace(/S/g, A);
    A = z;
    10 > A && (A = "00" + A);
    100 > A && (A = "0" + A);
    B = z;
    10 > B && (B = "00" + B);
    H = H.replace(/QQQ/g, A);
    H = H.replace(/QQ/g, B);
    H = H.replace(/Q/g, z);
    H = 12 > C ? H.replace(/A/g, "am") : H.replace(/A/g, "pm");
    H = H.replace(/YYYY/g, "@IIII@");
    H = H.replace(/YY/g, "@II@");
    H = H.replace(/MMMM/g, "@XXXX@");
    H = H.replace(/MMM/g, "@XXX@");
    H = H.replace(/MM/g, "@XX@");
    H = H.replace(/M/g, "@X@");
    H = H.replace(/DD/g, "@RR@");
    H = H.replace(/D/g, "@R@");
    H = H.replace(/EEEE/g, "@PPPP@");
    H = H.replace(/EEE/g, "@PPP@");
    H = H.replace(/EE/g, "@PP@");
    H = H.replace(/E/g, "@P@");
    H = H.replace(/@IIII@/g, G);
    H = H.replace(/@II@/g, y);
    H = H.replace(/@XXXX@/g, AmCharts.monthNames[F]);
    H = H.replace(/@XXX@/g, AmCharts.shortMonthNames[F]);
    H = H.replace(/@XX@/g, u);
    H = H.replace(/@X@/g, F + 1);
    H = H.replace(/@RR@/g, t);
    H = H.replace(/@R@/g, E);
    H = H.replace(/@PPPP@/g, AmCharts.dayNames[D]);
    H = H.replace(/@PPP@/g, AmCharts.shortDayNames[D]);
    H = H.replace(/@PP@/g, w);
    return H = H.replace(/@P@/g, D)
};
AmCharts.findPosX = function (e) {
    for (var d = e.offsetLeft; e = e.offsetParent;) {
        d += e.offsetLeft, e != document.body && e != document.documentElement && (d -= e.scrollLeft)
    }
    return d
};
AmCharts.findPosY = function (e) {
    for (var d = e.offsetTop; e = e.offsetParent;) {
        d += e.offsetTop, e != document.body && e != document.documentElement && (d -= e.scrollTop)
    }
    return d
};
AmCharts.findIfFixed = function (b) {
    for (; b = b.offsetParent;) {
        if ("fixed" == b.style.position) {
            return !0
        }
    }
    return !1
};
AmCharts.findIfAuto = function (b) {
    return b.style && "auto" == b.style.overflow ? !0 : b.parentNode ? AmCharts.findIfAuto(b.parentNode) : !1
};
AmCharts.findScrollLeft = function (e, d) {
    e.scrollLeft && (d += e.scrollLeft);
    return e.parentNode ? AmCharts.findScrollLeft(e.parentNode, d) : d
};
AmCharts.findScrollTop = function (e, d) {
    e.scrollTop && (d += e.scrollTop);
    return e.parentNode ? AmCharts.findScrollTop(e.parentNode, d) : d
};
AmCharts.formatValue = function (y, w, v, u, t, r, q, p) {
    if (w) {
        void 0 == t && (t = "");
        for (var o = 0; o < v.length; o++) {
            var n = v[o],
                m = w[n];
            void 0 != m && (m = r ? AmCharts.addPrefix(m, p, q, u) : AmCharts.formatNumber(m, u), y = y.replace(RegExp("\\[\\[" + t + "" + n + "\\]\\]", "g"), m))
        }
    }
    return y
};
AmCharts.formatDataContextValue = function (h, g) {
    if (h) {
        for (var l = h.match(/\[\[.*?\]\]/g), k = 0; k < l.length; k++) {
            var j = l[k],
                j = j.substr(2, j.length - 4);
            void 0 != g[j] && (h = h.replace(RegExp("\\[\\[" + j + "\\]\\]", "g"), g[j]))
        }
    }
    return h
};
AmCharts.massReplace = function (g, f) {
    for (var j in f) {
        var h = f[j];
        void 0 == h && (h = "");
        g = g.replace(j, h)
    }
    return g
};
AmCharts.cleanFromEmpty = function (b) {
    return b.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function (k, j, p, o) {
    var n = AmCharts.formatNumber(k, o),
        m = "",
        l;
    if (0 == k) {
        return "0"
    }
    0 > k && (m = "-");
    k = Math.abs(k);
    if (1 < k) {
        for (l = j.length - 1; - 1 < l; l--) {
            if (k >= j[l].number) {
                k /= j[l].number;
                o = Number(o.precision);
                1 > o && (o = 1);
                k = AmCharts.roundTo(k, o);
                n = m + "" + k + "" + j[l].prefix;
                break
            }
        }
    } else {
        for (l = 0; l < p.length; l++) {
            if (k <= p[l].number) {
                k /= p[l].number;
                o = Math.abs(Math.round(Math.log(k) * Math.LOG10E));
                k = AmCharts.roundTo(k, o);
                n = m + "" + k + "" + p[l].prefix;
                break
            }
        }
    }
    return n
};
AmCharts.remove = function (b) {
    b && b.remove()
};
AmCharts.copyProperties = function (f, e) {
    for (var g in f) {
        "events" != g && (void 0 != f[g] && "function" != typeof f[g]) && (e[g] = f[g])
    }
};
AmCharts.recommended = function () {
    var b = "js";
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (b = "flash");
    return b
};
AmCharts.getEffect = function (b) {
    ">" == b && (b = "easeOutSine");
    "<" == b && (b = "easeInSine");
    "elastic" == b && (b = "easeOutElastic");
    return b
};
AmCharts.Bezier = AmCharts.Class({
    construct: function (v, u, t, r, q, p, o, n, m, l) {
        "object" == typeof o && (o = o[0]);
        "object" == typeof n && (n = n[0]);
        p = {
            fill: o,
            "fill-opacity": n,
            "stroke-width": p
        };
        void 0 != m && 0 < m && (p["stroke-dasharray"] = m);
        isNaN(q) || (p["stroke-opacity"] = q);
        r && (p.stroke = r);
        r = "M" + Math.round(u[0]) + "," + Math.round(t[0]);
        q = [];
        for (m = 0; m < u.length; m++) {
            q.push({
                x: u[m],
                y: t[m]
            })
        }
        1 < q.length && (u = this.interpolate(q), r += this.drawBeziers(u));
        l ? r += l : AmCharts.VML || (r += "M0,0 L0,0");
        this.path = v.path(r).attr(p)
    },
    interpolate: function (k) {
        var j = [];
        j.push({
            x: k[0].x,
            y: k[0].y
        });
        var p = k[1].x - k[0].x,
            o = k[1].y - k[0].y;
        j.push({
            x: k[0].x + p / 6,
            y: k[0].y + o / 6
        });
        for (var n = 1; n < k.length - 1; n++) {
            var m = k[n - 1],
                l = k[n],
                o = k[n + 1],
                p = o.x - l.x,
                o = o.y - m.y,
                m = l.x - m.x;
            m > p && (m = p);
            j.push({
                x: l.x - m / 3,
                y: l.y - o / 6
            });
            j.push({
                x: l.x,
                y: l.y
            });
            j.push({
                x: l.x + m / 3,
                y: l.y + o / 6
            })
        }
        o = k[k.length - 1].y - k[k.length - 2].y;
        p = k[k.length - 1].x - k[k.length - 2].x;
        j.push({
            x: k[k.length - 1].x - p / 3,
            y: k[k.length - 1].y - o / 6
        });
        j.push({
            x: k[k.length - 1].x,
            y: k[k.length - 1].y
        });
        return j
    },
    drawBeziers: function (f) {
        for (var e = "", g = 0; g < (f.length - 1) / 3; g++) {
            e += this.drawBezierMidpoint(f[3 * g], f[3 * g + 1], f[3 * g + 2], f[3 * g + 3])
        }
        return e
    },
    drawBezierMidpoint: function (v, u, t, r) {
        var q = Math.round,
            p = this.getPointOnSegment(v, u, 0.75),
            o = this.getPointOnSegment(r, t, 0.75),
            n = (r.x - v.x) / 16,
            m = (r.y - v.y) / 16,
            l = this.getPointOnSegment(v, u, 0.375),
            v = this.getPointOnSegment(p, o, 0.375);
        v.x -= n;
        v.y -= m;
        u = this.getPointOnSegment(o, p, 0.375);
        u.x += n;
        u.y += m;
        t = this.getPointOnSegment(r, t, 0.375);
        n = this.getMiddle(l, v);
        p = this.getMiddle(p, o);
        o = this.getMiddle(u, t);
        l = " Q" + q(l.x) + "," + q(l.y) + "," + q(n.x) + "," + q(n.y);
        l += " Q" + q(v.x) + "," + q(v.y) + "," + q(p.x) + "," + q(p.y);
        l += " Q" + q(u.x) + "," + q(u.y) + "," + q(o.x) + "," + q(o.y);
        return l += " Q" + q(t.x) + "," + q(t.y) + "," + q(r.x) + "," + q(r.y)
    },
    getMiddle: function (e, d) {
        return {
            x: (e.x + d.x) / 2,
            y: (e.y + d.y) / 2
        }
    },
    getPointOnSegment: function (f, e, g) {
        return {
            x: f.x + (e.x - f.x) * g,
            y: f.y + (e.y - f.y) * g
        }
    }
});
AmCharts.Cuboid = AmCharts.Class({
    construct: function (C, B, A, z, y, w, v, u, t, r, q, n, m) {
        this.set = C.set();
        this.container = C;
        this.h = Math.round(A);
        this.w = Math.round(B);
        this.dx = z;
        this.dy = y;
        this.colors = w;
        this.alpha = v;
        this.bwidth = u;
        this.bcolor = t;
        this.balpha = r;
        this.colors = w;
        m ? 0 > B && 0 == q && (q = 180) : 0 > A && 270 == q && (q = 90);
        this.gradientRotation = q;
        0 == z && 0 == y && (this.cornerRadius = n);
        this.draw()
    },
    draw: function () {
        var U = this.set;
        U.clear();
        var T = this.container,
            S = this.w,
            R = this.h,
            Q = this.dx,
            P = this.dy,
            O = this.colors,
            N = this.alpha,
            M = this.bwidth,
            L = this.bcolor,
            K = this.balpha,
            H = this.gradientRotation,
            G = this.cornerRadius;
        if (0 < Q || 0 < P) {
            var J = O,
                I = O;
            "object" == typeof O && (J = O[0], I = O[O.length - 1]);
            var F = I,
                E = AmCharts.adjustLuminosity(J, -0.2),
                E = AmCharts.adjustLuminosity(J, -0.2),
                J = AmCharts.polygon(T, [0, Q, S + Q, S, 0], [0, P, P, 0, 0], E, N, 0, 0, 0, H);
            if (0 < K) {
                var B = AmCharts.line(T, [0, Q, S + Q], [0, P, P], L, K, M)
            }
            I = AmCharts.polygon(T, [0, 0, S, S, 0], [0, R, R, 0, 0], E, N, 0, 0, 0, 0, H);
            I.translate(Q, P);
            if (0 < K) {
                var A = AmCharts.line(T, [Q, Q], [P, P + R], L, 1, M)
            }
            var y = AmCharts.polygon(T, [0, 0, Q, Q, 0], [0, R, R + P, P, 0], E, N, 0, 0, 0, H),
                v = AmCharts.polygon(T, [S, S, S + Q, S + Q, S], [0, R, R + P, P, 0], E, N, 0, 0, 0, H);
            if (0 < K) {
                var D = AmCharts.line(T, [S, S + Q, S + Q, S], [0, P, R + P, R], L, K, M)
            }
            E = AmCharts.adjustLuminosity(F, 0.2);
            F = AmCharts.polygon(T, [0, Q, S + Q, S, 0], [R, R + P, R + P, R, R], E, N, 0, 0, 0, H);
            if (0 < K) {
                var z = AmCharts.line(T, [0, Q, S + Q], [R, R + P, R + P], L, K, M)
            }
        }
        1 > Math.abs(R) && (R = 0);
        1 > Math.abs(S) && (S = 0);
        T = 0 == R ? AmCharts.line(T, [0, S], [0, 0], L, K, M) : 0 == S ? AmCharts.line(T, [0, 0], [0, R], L, K, M) : 0 < G ? AmCharts.rect(T, S, R, O, N, M, L, K, G, H) : AmCharts.polygon(T, [0, 0, S, S, 0], [0, R, R, 0, 0], O, N, M, L, K, H);
        R = 0 > R ? [J, B, I, A, y, v, D, F, z, T] : [F, z, I, A, y, v, J, B, D, T];
        for (B = 0; B < R.length; B++) {
            (A = R[B]) && U.push(A)
        }
    },
    width: function (b) {
        this.w = b;
        this.draw()
    },
    height: function (b) {
        this.h = b;
        this.draw()
    },
    animateHeight: function (f, e) {
        var g = this;
        g.easing = e;
        g.totalFrames = 1000 * f / AmCharts.updateRate;
        g.rh = g.h;
        g.frame = 0;
        g.height(1);
        setTimeout(function () {
            g.updateHeight.call(g)
        }, AmCharts.updateRate)
    },
    updateHeight: function () {
        var e = this;
        e.frame++;
        var d = e.totalFrames;
        e.frame <= d && (d = e.easing(0, e.frame, 1, e.rh - 1, d), e.height(d), setTimeout(function () {
            e.updateHeight.call(e)
        }, AmCharts.updateRate))
    },
    animateWidth: function (f, e) {
        var g = this;
        g.easing = e;
        g.totalFrames = 1000 * f / AmCharts.updateRate;
        g.rw = g.w;
        g.frame = 0;
        g.width(1);
        setTimeout(function () {
            g.updateWidth.call(g)
        }, AmCharts.updateRate)
    },
    updateWidth: function () {
        var e = this;
        e.frame++;
        var d = e.totalFrames;
        e.frame <= d && (d = e.easing(0, e.frame, 1, e.rw - 1, d), e.width(d), setTimeout(function () {
            e.updateWidth.call(e)
        }, AmCharts.updateRate))
    }
});
AmCharts.AmLegend = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
        this.position = "bottom";
        this.borderColor = this.color = "#000000";
        this.borderAlpha = 0;
        this.markerLabelGap = 5;
        this.verticalGap = 10;
        this.align = "left";
        this.horizontalGap = 0;
        this.spacing = 10;
        this.markerDisabledColor = "#AAB3B3";
        this.markerType = "square";
        this.markerSize = 16;
        this.markerBorderAlpha;
        this.markerBorderThickness = 1;
        this.marginBottom = this.marginTop = 0;
        this.marginLeft = this.marginRight = 20;
        this.autoMargins = !0;
        this.valueWidth = 50;
        this.switchable = !0;
        this.switchType = "x";
        this.switchColor = "#FFFFFF";
        this.rollOverColor = "#CC0000";
        this.selectedColor;
        this.reversedOrder = !1;
        this.labelText = "[[title]]";
        this.valueText = "[[value]]";
        this.useMarkerColorForLabels = !1;
        this.rollOverGraphAlpha = 1;
        this.textClickEnabled = !1;
        this.equalWidths = !0;
        this.dateFormat = "DD-MM-YYYY";
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.ly;
        this.lx
    },
    setData: function (b) {
        this.data = b;
        this.invalidateSize()
    },
    invalidateSize: function () {
        this.destroy();
        this.entries = [];
        this.valueLabels = [];
        AmCharts.ifArray(this.data) && this.drawLegend()
    },
    drawLegend: function () {
        var k = this.chart,
            j = this.position,
            q = this.width,
            p = k.realWidth,
            o = k.realHeight,
            n = this.div,
            m = this.data;
        isNaN(this.fontSize) && (this.fontSize = k.fontSize);
        if ("right" == j || "left" == j) {
            this.maxColumns = 1, this.marginLeft = this.marginRight = 10
        } else {
            if (this.autoMargins) {
                this.marginRight = k.marginRight;
                this.marginLeft = k.marginLeft;
                var l = k.autoMarginOffset;
                "bottom" == j ? (this.marginBottom = l, this.marginTop = 0) : (this.marginTop = l, this.marginBottom = 0)
            }
        }
        this.divWidth = j = void 0 != q ? AmCharts.toCoordinate(q, p) : k.realWidth;
        n.style.width = j + "px";
        this.container = new AmCharts.AmDraw(n, j, o);
        this.lx = 0;
        this.ly = 8;
        o = this.markerSize;
        o > this.fontSize && (this.ly = o / 2 - 1);
        0 < o && (this.lx += o + this.markerLabelGap);
        this.titleWidth = 0;
        if (o = this.title) {
            k = AmCharts.text(this.container, o, this.color, k.fontFamily, this.fontSize, "start", !0), k.translate(0, this.marginTop + this.verticalGap + this.ly + 1), k = k.getBBox(), this.titleWidth = k.width + 15, this.titleHeight = k.height + 6
        }
        for (k = this.index = this.maxLabelWidth = 0; k < m.length; k++) {
            this.createEntry(m[k])
        }
        for (k = this.index = 0; k < m.length; k++) {
            this.createValue(m[k])
        }
        this.arrangeEntries();
        this.updateValues()
    },
    arrangeEntries: function () {
        var W = this.position,
            V = this.marginLeft + this.titleWidth,
            U = this.marginRight,
            T = this.marginTop,
            S = this.marginBottom,
            R = this.horizontalGap,
            Q = this.div,
            P = this.divWidth,
            O = this.maxColumns,
            N = this.verticalGap,
            M = this.spacing,
            J = P - U - V,
            I = 0,
            L = 0,
            K = this.container,
            G = K.set();
        this.set = G;
        K = K.set();
        G.push(K);
        for (var F = this.entries, D = 0; D < F.length; D++) {
            var B = F[D].getBBox(),
                y = B.width;
            y > I && (I = y);
            B = B.height;
            B > L && (L = B)
        }
        for (var v = y = 0, E = R, D = 0; D < F.length; D++) {
            var z = F[D];
            this.reversedOrder && (z = F[F.length - D - 1]);
            var B = z.getBBox(),
                H;
            this.equalWidths ? H = R + v * (I + M + this.markerLabelGap) : (H = E, E = E + B.width + R + M);
            H + B.width > J && 0 < D && (y++, v = 0, H = R, E = H + B.width + R + M);
            z.translate(H, (L + N) * y);
            v++;
            !isNaN(O) && v >= O && (v = 0, y++);
            K.push(z)
        }
        B = K.getBBox();
        O = B.height + 2 * N - 1;
        "left" == W || "right" == W ? (P = B.width + 2 * R, Q.style.width = P + V + U + "px") : P = P - V - U - 1;
        U = AmCharts.polygon(this.container, [0, P, P, 0], [0, 0, O, O], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        G.push(U);
        G.translate(V, T);
        U.toBack();
        V = R;
        if ("top" == W || "bottom" == W) {
            "center" == this.align ? V = R + (P - B.width) / 2 : "right" == this.align && (V = R + P - B.width)
        }
        K.translate(V, N + 1);
        this.titleHeight > O && (O = this.titleHeight);
        W = O + T + S + 1;
        0 > W && (W = 0);
        Q.style.height = Math.round(W) + "px"
    },
    createEntry: function (y) {
        if (!1 !== y.visibleInLegend) {
            var w = this.chart,
                v = y.markerType;
            v || (v = this.markerType);
            var u = y.color,
                t = y.alpha;
            y.legendKeyColor && (u = y.legendKeyColor());
            y.legendKeyAlpha && (t = y.legendKeyAlpha());
            !0 == y.hidden && (u = this.markerDisabledColor);
            var r = this.createMarker(v, u, t);
            this.addListeners(r, y);
            t = this.container.set([r]);
            this.switchable && t.setAttr("cursor", "pointer");
            var q = this.switchType;
            if (q) {
                var p;
                p = "x" == q ? this.createX() : this.createV();
                p.dItem = y;
                !0 != y.hidden ? "x" == q ? p.hide() : p.show() : "x" != q && p.hide();
                this.switchable || p.hide();
                this.addListeners(p, y);
                y.legendSwitch = p;
                t.push(p)
            }
            q = this.color;
            y.showBalloon && (this.textClickEnabled && void 0 != this.selectedColor) && (q = this.selectedColor);
            this.useMarkerColorForLabels && (q = u);
            !0 == y.hidden && (q = this.markerDisabledColor);
            u = AmCharts.massReplace(this.labelText, {
                "[[title]]": y.title
            });
            p = this.fontSize;
            var o = this.markerSize;
            if (r && o < p) {
                var n = 0;
                if ("bubble" == v || "circle" == v) {
                    n = o / 2
                }
                r.translate(n, n + this.ly - p / 2 + (p + 2 - o) / 2)
            }
            if (u) {
                var m = AmCharts.text(this.container, u, q, w.fontFamily, p, "start");
                m.translate(this.lx, this.ly);
                t.push(m);
                w = m.getBBox().width;
                this.maxLabelWidth < w && (this.maxLabelWidth = w)
            }
            this.entries[this.index] = t;
            y.legendEntry = this.entries[this.index];
            y.legendLabel = m;
            this.index++
        }
    },
    addListeners: function (f, e) {
        var g = this;
        f && f.mouseover(function () {
            g.rollOverMarker(e)
        }).mouseout(function () {
            g.rollOutMarker(e)
        }).click(function () {
            g.clickMarker(e)
        })
    },
    rollOverMarker: function (b) {
        this.switchable && this.dispatch("rollOverMarker", b);
        this.dispatch("rollOverItem", b)
    },
    rollOutMarker: function (b) {
        this.switchable && this.dispatch("rollOutMarker", b);
        this.dispatch("rollOutItem", b)
    },
    clickMarker: function (b) {
        this.switchable ? !0 == b.hidden ? this.dispatch("showItem", b) : this.dispatch("hideItem", b) : this.textClickEnabled && this.dispatch("clickMarker", b)
    },
    rollOverLabel: function (b) {
        b.hidden || (this.textClickEnabled && b.legendLabel && b.legendLabel.attr({
            fill: this.rollOverColor
        }), this.dispatch("rollOverItem", b))
    },
    rollOutLabel: function (e) {
        if (!e.hidden) {
            if (this.textClickEnabled && e.legendLabel) {
                var d = this.color;
                void 0 != this.selectedColor && e.showBalloon && (d = this.selectedColor);
                this.useMarkerColorForLabels && (d = e.lineColor, void 0 == d && (d = e.color));
                e.legendLabel.attr({
                    fill: d
                })
            }
            this.dispatch("rollOutItem", e)
        }
    },
    clickLabel: function (b) {
        this.textClickEnabled ? b.hidden || this.dispatch("clickLabel", b) : this.switchable && (!0 == b.hidden ? this.dispatch("showItem", b) : this.dispatch("hideItem", b))
    },
    dispatch: function (e, d) {
        this.fire(e, {
            type: e,
            dataItem: d,
            target: this,
            chart: this.chart
        })
    },
    createValue: function (k) {
        var j = this,
            q = j.fontSize;
        if (!1 !== k.visibleInLegend) {
            var p = j.maxLabelWidth;
            j.equalWidths || (j.valueAlign = "left");
            "left" == j.valueAlign && (p = k.legendEntry.getBBox().width);
            var o = p;
            if (j.valueText) {
                var n = j.color;
                j.useMarkerColorForLabels && (n = k.color);
                !0 == k.hidden && (n = j.markerDisabledColor);
                var m = j.valueText,
                    p = p + j.lx + j.markerLabelGap + j.valueWidth,
                    l = "end";
                "left" == j.valueAlign && (p -= j.valueWidth, l = "start");
                n = AmCharts.text(j.container, m, n, j.chart.fontFamily, q, l);
                n.translate(p, j.ly);
                j.entries[j.index].push(n);
                o += j.valueWidth + j.markerLabelGap;
                n.dItem = k;
                j.valueLabels.push(n)
            }
            j.index++;
            n = j.markerSize;
            n < q + 7 && (n = q + 7, AmCharts.VML && (n += 3));
            q = j.container.rect(j.markerSize + j.markerLabelGap, 0, o, n, 0, 0).attr({
                stroke: "none",
                fill: "#FFFFFF",
                "fill-opacity": 0.005
            });
            q.dItem = k;
            j.entries[j.index - 1].push(q);
            q.mouseover(function () {
                j.rollOverLabel(k)
            }).mouseout(function () {
                j.rollOutLabel(k)
            }).click(function () {
                j.clickLabel(k)
            })
        }
    },
    createV: function () {
        var b = this.markerSize;
        return AmCharts.polygon(this.container, [b / 5, b / 2, b - b / 5, b / 2], [b / 3, b - b / 5, b / 5, b / 1.7], this.switchColor)
    },
    createX: function () {
        var g = this.markerSize - 3,
            f = {
                stroke: this.switchColor,
                "stroke-width": 3
            }, j = this.container,
            h = AmCharts.line(j, [3, g], [3, g]).attr(f),
            g = AmCharts.line(j, [3, g], [g, 3]).attr(f);
        return this.container.set([h, g])
    },
    createMarker: function (k, j, q) {
        var p = this.markerSize,
            o = this.container,
            n, m = this.markerBorderThickness,
            l = this.markerBorderAlpha;
        switch (k) {
            case "square":
                n = AmCharts.polygon(o, [0, p, p, 0], [0, 0, p, p], j, q, m, j, l);
                break;
            case "circle":
                n = AmCharts.circle(o, p / 2, j, q, m, j, l);
                n.translate(p / 2, p / 2);
                break;
            case "line":
                n = AmCharts.line(o, [0, p], [p / 2, p / 2], j, q, m);
                break;
            case "dashedLine":
                n = AmCharts.line(o, [0, p], [p / 2, p / 2], j, q, m, 3);
                break;
            case "triangleUp":
                n = AmCharts.polygon(o, [0, p / 2, p, p], [p, 0, p, p], j, q, m, j, l);
                break;
            case "triangleDown":
                n = AmCharts.polygon(o, [0, p / 2, p, p], [0, p, 0, 0], j, q, m, j, l);
                break;
            case "bubble":
                n = AmCharts.circle(o, p / 2, j, q, m, j, l, !0), n.translate(p / 2, p / 2)
        }
        return n
    },
    validateNow: function () {
        this.invalidateSize()
    },
    updateValues: function () {
        for (var k = this.valueLabels, j = this.chart, p = 0; p < k.length; p++) {
            var o = k[p],
                n = o.dItem;
            if (void 0 != n.type) {
                var m = n.currentDataItem;
                if (m) {
                    var l = this.valueText;
                    n.legendValueText && (l = n.legendValueText);
                    n = l;
                    n = j.formatString(n, m);
                    o.text(n)
                } else {
                    o.text(" ")
                }
            } else {
                m = j.formatString(this.valueText, n), o.text(m)
            }
        }
    },
    renderFix: function () {
        if (!AmCharts.VML) {
            var b = this.container;
            b && b.renderFix()
        }
    },
    destroy: function () {
        this.div.innerHTML = "";
        AmCharts.remove(this.set)
    }
});
AmCharts.AmBalloon = AmCharts.Class({
    construct: function () {
        this.enabled = !0;
        this.fillColor = "#CC0000";
        this.fillAlpha = 1;
        this.borderThickness = 2;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = 1;
        this.cornerRadius = 6;
        this.maximumWidth = 220;
        this.horizontalPadding = 8;
        this.verticalPadding = 5;
        this.pointerWidth = 10;
        this.pointerOrientation = "V";
        this.color = "#FFFFFF";
        this.textShadowColor = "#000000";
        this.adjustBorderColor = !1;
        this.showBullet = !0;
        this.show = this.follow = !1;
        this.bulletSize = 3
    },
    draw: function () {
        var P = this.pointToX,
            O = this.pointToY;
        if (!isNaN(P)) {
            var N = this.chart,
                M = N.container,
                L = this.set;
            AmCharts.remove(L);
            AmCharts.remove(this.pointer);
            this.set = L = M.set();
            if (this.show) {
                var K = this.l,
                    J = this.t,
                    I = this.r,
                    H = this.b,
                    G = this.textShadowColor;
                this.color == G && (G = void 0);
                var F = this.balloonColor,
                    C = this.fillColor,
                    B = this.borderColor;
                void 0 != F && (this.adjustBorderColor ? B = F : C = F);
                var E = this.horizontalPadding,
                    D = this.verticalPadding,
                    F = this.pointerWidth,
                    A = this.pointerOrientation,
                    z = this.cornerRadius,
                    y = N.fontFamily,
                    v = this.fontSize;
                void 0 == v && (v = N.fontSize);
                N = AmCharts.text(M, this.text, this.color, y, v);
                L.push(N);
                if (void 0 != G) {
                    var u = AmCharts.text(M, this.text, G, y, v, "middle", !1, 0.4);
                    L.push(u)
                }
                y = N.getBBox();
                G = y.height + 2 * D;
                E = y.width + 2 * E;
                window.opera && (G += 2);
                D = E / 2;
                v = v / 2 + 5;
                N.translate(D, v);
                u && u.translate(D + 1, v + 1);
                "H" != A ? (D = P - E / 2, v = O < J + G + 10 && "down" != A ? O + F : O - G - F) : (2 * F > G && (F = G / 2), v = O - G / 2, D = P < K + (I - K) / 2 ? P + F : P - E - F);
                v + G >= H && (v = H - G);
                v < J && (v = J);
                D < K && (D = K);
                D + E > I && (D = I - E);
                0 < z || 0 == F ? (B = AmCharts.rect(M, E, G, C, this.fillAlpha, this.borderThickness, B, this.borderAlpha, this.cornerRadius), this.showBullet && (M = AmCharts.circle(M, this.bulletSize, C, this.fillAlpha), M.translate(P, O), this.pointer = M)) : (H = [], z = [], "H" != A ? (K = P - D, K > E - F && (K = E - F), K < F && (K = F), H = [0, K - F, P - D, K + F, E, E, 0, 0], z = O < J + G + 10 && "down" != A ? [0, 0, O - v, 0, 0, G, G, 0] : [G, G, O - v, G, G, 0, 0, G]) : (J = O - v, J > G - F && (J = G - F), J < F && (J = F), z = [0, J - F, O - v, J + F, G, G, 0, 0], H = P < K + (I - K) / 2 ? [0, 0, P - D, 0, 0, E, E, 0] : [E, E, P - D, E, E, 0, 0, E]), B = AmCharts.polygon(M, H, z, C, this.fillAlpha, this.borderThickness, B, this.borderAlpha));
                L.push(B);
                B.toFront();
                u && u.toFront();
                N.toFront();
                L.translate(D, v);
                y = B.getBBox();
                this.bottom = v + y.y + y.height;
                this.yPos = y.y + v
            }
        }
    },
    followMouse: function () {
        if (this.follow && this.show) {
            var h = this.chart.mouseX,
                g = this.chart.mouseY - 3;
            this.pointToX = h;
            this.pointToY = g;
            if (h != this.previousX || g != this.previousY) {
                if (this.previousX = h, this.previousY = g, 0 == this.cornerRadius) {
                    this.draw()
                } else {
                    var l = this.set;
                    if (l) {
                        var k = l.getBBox(),
                            h = h - k.width / 2,
                            j = g - k.height - 10;
                        h < this.l && (h = this.l);
                        h > this.r - k.width && (h = this.r - k.width);
                        j < this.t && (j = g + 10);
                        l.translate(h, j)
                    }
                }
            }
        }
    },
    changeColor: function (b) {
        this.balloonColor = b
    },
    setBounds: function (g, f, j, h) {
        this.l = g;
        this.t = f;
        this.r = j;
        this.b = h
    },
    showBalloon: function (b) {
        this.text = b;
        this.show = !0;
        this.draw()
    },
    hide: function () {
        this.follow = this.show = !1;
        this.destroy()
    },
    setPosition: function (f, e, g) {
        this.pointToX = f;
        this.pointToY = e;
        g && (f != this.previousX || e != this.previousY) && this.draw();
        this.previousX = f;
        this.previousY = e
    },
    followCursor: function (g) {
        var f = this;
        (f.follow = g) ? (f.pShowBullet = f.showBullet, f.showBullet = !1) : void 0 != f.pShowBullet && (f.showBullet = f.pShowBullet);
        clearInterval(f.interval);
        var j = f.chart.mouseX,
            h = f.chart.mouseY;
        !isNaN(j) && g && (f.pointToX = j, f.pointToY = h - 3, f.interval = setInterval(function () {
            f.followMouse.call(f)
        }, 40))
    },
    destroy: function () {
        clearInterval(this.interval);
        AmCharts.remove(this.set);
        AmCharts.remove(this.pointer)
    }
});
AmCharts.AmCoordinateChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function () {
        AmCharts.AmCoordinateChart.base.construct.call(this);
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
        this.plotAreaFillColors = "#FFFFFF";
        this.plotAreaFillAlphas = 0;
        this.plotAreaBorderColor = "#000000";
        this.plotAreaBorderAlpha = 0;
        this.startAlpha = 1;
        this.startDuration = 0;
        this.startEffect = "elastic";
        this.sequencedAnimation = !0;
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.balloonDateFormat = "MMM DD, YYYY";
        this.valueAxes = [];
        this.graphs = []
    },
    initChart: function () {
        AmCharts.AmCoordinateChart.base.initChart.call(this);
        this.createValueAxes();
        AmCharts.VML && (this.startAlpha = 1);
        var b = this.legend;
        b && b.setData(this.graphs)
    },
    createValueAxes: function () {
        0 == this.valueAxes.length && this.addValueAxis(new AmCharts.ValueAxis)
    },
    parseData: function () {
        this.processValueAxes();
        this.processGraphs()
    },
    parseSerialData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        var L = this.graphs,
            K = this.seriesIdField;
        K || (K = this.categoryField);
        this.chartData = [];
        var J = this.dataProvider;
        if (J) {
            var I = !1;
            this.categoryAxis && (I = this.categoryAxis.parseDates);
            if (I) {
                var H = AmCharts.extractPeriod(this.categoryAxis.minPeriod),
                    G = H.period,
                    H = H.count
            }
            var F = {};
            this.lookupTable = F;
            for (var E = 0; E < J.length; E++) {
                var D = {}, C = J[E],
                    B = C[this.categoryField];
                D.category = B;
                F[C[K]] = D;
                I && (B = new Date(B.getFullYear(), B.getMonth(), B.getDate(), B.getHours(), B.getMinutes(), B.getSeconds(), B.getMilliseconds()), B = AmCharts.resetDateToMin(B, G, H), D.category = B, D.time = B.getTime());
                var y = this.valueAxes;
                D.axes = {};
                D.x = {};
                for (var w = 0; w < y.length; w++) {
                    var A = y[w].id;
                    D.axes[A] = {};
                    D.axes[A].graphs = {};
                    for (var z = 0; z < L.length; z++) {
                        var B = L[z],
                            v = B.id,
                            u = B.periodValue;
                        if (B.valueAxis.id == A) {
                            D.axes[A].graphs[v] = {};
                            var t = {};
                            t.index = E;
                            t.values = this.processValues(C, B, u);
                            this.processFields(B, t, C);
                            t.category = D.category;
                            t.serialDataItem = D;
                            t.graph = B;
                            D.axes[A].graphs[v] = t
                        }
                    }
                }
                this.chartData[E] = D
            }
        }
        for (K = 0; K < L.length; K++) {
            B = L[K], B.dataProvider && this.parseGraphData(B)
        }
    },
    processValues: function (h, g, l) {
        var k = {}, j = Number(h[g.valueField + l]);
        isNaN(j) || (k.value = j);
        j = Number(h[g.openField + l]);
        isNaN(j) || (k.open = j);
        j = Number(h[g.closeField + l]);
        isNaN(j) || (k.close = j);
        j = Number(h[g.lowField + l]);
        isNaN(j) || (k.low = j);
        j = Number(h[g.highField + l]);
        isNaN(j) || (k.high = j);
        return k
    },
    parseGraphData: function (k) {
        var j = k.dataProvider,
            p = k.seriesIdField;
        p || (p = this.seriesIdField);
        p || (p = this.categoryField);
        for (var o = 0; o < j.length; o++) {
            var n = j[o],
                m = this.lookupTable["" + n[p]],
                l = k.valueAxis.id;
            m && (l = m.axes[l].graphs[k.id], l.serialDataItem = m, l.values = this.processValues(n, k, k.periodValue), this.processFields(k, l, n))
        }
    },
    addValueAxis: function (b) {
        b.chart = this;
        this.valueAxes.push(b);
        this.validateData()
    },
    removeValueAxesAndGraphs: function () {
        for (var e = this.valueAxes, d = e.length - 1; - 1 < d; d--) {
            this.removeValueAxis(e[d])
        }
    },
    removeValueAxis: function (g) {
        var f = this.graphs,
            j;
        for (j = f.length - 1; 0 <= j; j--) {
            var h = f[j];
            h && h.valueAxis == g && this.removeGraph(h)
        }
        f = this.valueAxes;
        for (j = f.length - 1; 0 <= j; j--) {
            f[j] == g && f.splice(j, 1)
        }
        this.validateData()
    },
    addGraph: function (b) {
        this.graphs.push(b);
        this.chooseGraphColor(b, this.graphs.length - 1);
        this.validateData()
    },
    removeGraph: function (f) {
        for (var e = this.graphs, g = e.length - 1; 0 <= g; g--) {
            e[g] == f && (e.splice(g, 1), f.destroy())
        }
        this.validateData()
    },
    processValueAxes: function () {
        for (var f = this.valueAxes, e = 0; e < f.length; e++) {
            var g = f[e];
            g.chart = this;
            g.id || (g.id = "valueAxis" + e);
            if (!0 === this.usePrefixes || !1 === this.usePrefixes) {
                g.usePrefixes = this.usePrefixes
            }
        }
    },
    processGraphs: function () {
        for (var f = this.graphs, e = 0; e < f.length; e++) {
            var g = f[e];
            g.chart = this;
            g.valueAxis || (g.valueAxis = this.valueAxes[0]);
            g.id || (g.id = "graph" + e)
        }
    },
    formatString: function (g, f) {
        var j = f.graph,
            h = j.valueAxis;
        h.duration && f.values.value && (h = AmCharts.formatDuration(f.values.value, h.duration, "", h.durationUnits, h.maxInterval, h.numberFormatter), g = g.split("[[value]]").join(h));
        g = AmCharts.massReplace(g, {
            "[[title]]": j.title,
            "[[description]]": f.description,
            "<br>": "\n"
        });
        return g = AmCharts.cleanFromEmpty(g)
    },
    getBalloonColor: function (j, h) {
        var n = j.lineColor,
            m = j.balloonColor,
            l = j.fillColors;
        "object" == typeof l ? n = l[0] : void 0 != l && (n = l);
        if (h.isNegative) {
            var l = j.negativeLineColor,
                k = j.negativeFillColors;
            "object" == typeof k ? l = k[0] : void 0 != k && (l = k);
            void 0 != l && (n = l)
        }
        void 0 != h.color && (n = h.color);
        void 0 == m && (m = n);
        return m
    },
    getGraphById: function (b) {
        return this.getObjById(this.graphs, b)
    },
    getValueAxisById: function (b) {
        return this.getObjById(this.valueAxes, b)
    },
    getObjById: function (h, g) {
        for (var l, k = 0; k < h.length; k++) {
            var j = h[k];
            j.id == g && (l = j)
        }
        return l
    },
    processFields: function (k, j, p) {
        if (k.itemColors) {
            var o = k.itemColors,
                n = j.index;
            j.color = n < o.length ? o[n] : AmCharts.randomColor()
        }
        o = "color alpha fillColors description bullet customBullet bulletSize bulletConfig url".split(" ");
        for (n = 0; n < o.length; n++) {
            var m = o[n],
                l = k[m + "Field"];
            l && (l = p[l], AmCharts.isDefined(l) && (j[m] = l))
        }
        j.dataContext = p
    },
    chooseGraphColor: function (f, e) {
        if (void 0 == f.lineColor) {
            var g;
            g = this.colors.length > e ? this.colors[e] : AmCharts.randomColor();
            f.lineColor = g
        }
    },
    handleLegendEvent: function (g) {
        var f = g.type;
        if (g = g.dataItem) {
            var j = g.hidden,
                h = g.showBalloon;
            switch (f) {
                case "clickMarker":
                    h ? this.hideGraphsBalloon(g) : this.showGraphsBalloon(g);
                    break;
                case "clickLabel":
                    h ? this.hideGraphsBalloon(g) : this.showGraphsBalloon(g);
                    break;
                case "rollOverItem":
                    j || this.highlightGraph(g);
                    break;
                case "rollOutItem":
                    j || this.unhighlightGraph();
                    break;
                case "hideItem":
                    this.hideGraph(g);
                    break;
                case "showItem":
                    this.showGraph(g)
            }
        }
    },
    highlightGraph: function (h) {
        var g = this.graphs,
            l, k = 0.2;
        this.legend && (k = this.legend.rollOverGraphAlpha);
        if (1 != k) {
            for (l = 0; l < g.length; l++) {
                var j = g[l];
                j != h && j.changeOpacity(k)
            }
        }
    },
    unhighlightGraph: function () {
        this.legend && (alpha = this.legend.rollOverGraphAlpha);
        if (1 != alpha) {
            for (var e = this.graphs, d = 0; d < e.length; d++) {
                e[d].changeOpacity(1)
            }
        }
    },
    showGraph: function (b) {
        b.hidden = !1;
        this.initChart()
    },
    hideGraph: function (b) {
        b.hidden = !0;
        this.initChart()
    },
    hideGraphsBalloon: function (b) {
        b.showBalloon = !1;
        this.updateLegend()
    },
    showGraphsBalloon: function (b) {
        b.showBalloon = !0;
        this.updateLegend()
    },
    updateLegend: function () {
        this.legend && this.legend.invalidateSize()
    },
    animateAgain: function () {
        var e = this.graphs;
        if (e) {
            for (var d = 0; d < e.length; d++) {
                e[d].animationPlayed = !1
            }
        }
    }
});
AmCharts.AmRectangularChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRectangularChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
        this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
        this.heightMultiplyer = this.widthMultiplyer = 1;
        this.zoomOutText = "Show all";
        this.zbSet;
        this.zoomOutButton = {
            backgroundColor: "#b2e1ff",
            backgroundAlpha: 1
        };
        this.trendLines = [];
        this.autoMargins = !0;
        this.marginsUpdated = !1;
        this.autoMarginOffset = 10
    },
    initChart: function () {
        AmCharts.AmRectangularChart.base.initChart.call(this);
        this.updateDxy();
        var b = !0;
        !this.marginsUpdated && this.autoMargins && (this.resetMargins(), b = !1);
        this.updateMargins();
        this.updatePlotArea();
        this.updateScrollbars();
        this.updateTrendLines();
        this.updateChartCursor();
        this.updateValueAxes();
        b && (this.scrollbarOnly || this.updateGraphs())
    },
    drawChart: function () {
        AmCharts.AmRectangularChart.base.drawChart.call(this);
        this.drawPlotArea();
        if (AmCharts.ifArray(this.chartData)) {
            var b = this.chartCursor;
            b && b.draw();
            b = this.zoomOutText;
            "" != b && b && this.drawZoomOutButton()
        }
    },
    resetMargins: function () {
        var h = {};
        if ("serial" == this.chartType) {
            for (var g = this.valueAxes, l = 0; l < g.length; l++) {
                var k = g[l];
                k.ignoreAxisWidth || (k.setOrientation(this.rotate), k.fixAxisPosition(), h[k.position] = !0)
            }
            if ((l = this.categoryAxis) && !l.ignoreAxisWidth) {
                l.setOrientation(!this.rotate), l.fixAxisPosition(), l.fixAxisPosition(), h[l.position] = !0
            }
        } else {
            k = this.xAxes;
            g = this.yAxes;
            for (l = 0; l < k.length; l++) {
                var j = k[l];
                j.ignoreAxisWidth || (j.setOrientation(!0), j.fixAxisPosition(), h[j.position] = !0)
            }
            for (l = 0; l < g.length; l++) {
                k = g[l], k.ignoreAxisWidth || (k.setOrientation(!1), k.fixAxisPosition(), h[k.position] = !0)
            }
        }
        h.left && (this.marginLeft = 0);
        h.right && (this.marginRight = 0);
        h.top && (this.marginTop = 0);
        h.bottom && (this.marginBottom = 0);
        this.fixMargins = h
    },
    measureMargins: function () {
        var v = this.valueAxes,
            u, t = this.autoMarginOffset,
            r = this.fixMargins,
            q = this.realWidth,
            p = this.realHeight,
            o = t,
            n = t,
            m = q - t;
        u = p - t;
        for (var l = 0; l < v.length; l++) {
            u = this.getAxisBounds(v[l], o, m, n, u), o = u.l, m = u.r, n = u.t, u = u.b
        }
        if (v = this.categoryAxis) {
            u = this.getAxisBounds(v, o, m, n, u), o = u.l, m = u.r, n = u.t, u = u.b
        }
        r.left && o < t && (this.marginLeft = Math.round(-o + t));
        r.right && m > q - t && (this.marginRight = Math.round(m - q + t));
        r.top && n < t && (this.marginTop = Math.round(this.marginTop - n + t + this.titleHeight));
        r.bottom && u > p - t && (this.marginBottom = Math.round(u - p + t));
        this.animateAgain();
        this.initChart()
    },
    getAxisBounds: function (k, j, p, o, n) {
        if (!k.ignoreAxisWidth) {
            var m = k.labelsSet,
                l = k.tickLength;
            k.inside && (l = 0);
            if (m) {
                switch (m = k.getBBox(), k.position) {
                    case "top":
                        k = m.y;
                        o > k && (o = k);
                        break;
                    case "bottom":
                        k = m.y + m.height;
                        n < k && (n = k);
                        break;
                    case "right":
                        k = m.x + m.width + l + 3;
                        p < k && (p = k);
                        break;
                    case "left":
                        k = m.x - l, j > k && (j = k)
                }
            }
        }
        return {
            l: j,
            t: o,
            r: p,
            b: n
        }
    },
    drawZoomOutButton: function () {
        var h = this,
            g = h.container.set();
        h.zoomButtonSet.push(g);
        var l = h.color,
            k = h.fontSize,
            j = h.zoomOutButton;
        if (j && (j.fontSize && (k = j.fontSize), j.color)) {
            l = j.color
        }
        l = AmCharts.text(h.container, h.zoomOutText, l, h.fontFamily, k, "start");
        k = l.getBBox();
        l.translate(29, 6 + k.height / 2);
        j = AmCharts.rect(h.container, k.width + 40, k.height + 15, j.backgroundColor, j.backgroundAlpha);
        g.push(j);
        h.zbBG = j;
        void 0 != h.pathToImages && (j = h.container.image(h.pathToImages + "lens.png", 0, 0, 16, 16), j.translate(7, k.height / 2 - 1), j.toFront(), g.push(j));
        l.toFront();
        g.push(l);
        j = g.getBBox();
        g.translate(h.marginLeftReal + h.plotAreaWidth - j.width, h.marginTopReal);
        g.hide();
        g.mouseover(function () {
            h.rollOverZB()
        }).mouseout(function () {
            h.rollOutZB()
        }).click(function () {
            h.clickZB()
        }).touchstart(function () {
            h.rollOverZB()
        }).touchend(function () {
            h.rollOutZB();
            h.clickZB()
        });
        for (j = 0; j < g.length; j++) {
            g[j].attr({
                cursor: "pointer"
            })
        }
        h.zbSet = g
    },
    rollOverZB: function () {
        this.zbBG.show()
    },
    rollOutZB: function () {
        this.zbBG.hide()
    },
    clickZB: function () {
        this.zoomOut()
    },
    zoomOut: function () {
        this.updateScrollbar = !0;
        this.zoom()
    },
    drawPlotArea: function () {
        var v = this.dx,
            u = this.dy,
            t = this.marginLeftReal,
            r = this.marginTopReal,
            q = this.plotAreaWidth,
            p = this.plotAreaHeight,
            o = this.plotAreaFillColors,
            n = this.plotAreaFillAlphas,
            m = this.plotAreaBorderColor,
            l = this.plotAreaBorderAlpha;
        this.trendLinesSet.clipRect(t, r, q, p);
        "object" == typeof n && (n = n[0]);
        o = AmCharts.polygon(this.container, [0, q, q, 0], [0, 0, p, p], o, n, 1, m, l, this.plotAreaGradientAngle);
        o.translate(t + v, r + u);
        this.set.push(o);
        0 != v && 0 != u && (o = this.plotAreaFillColors, "object" == typeof o && (o = o[0]), o = AmCharts.adjustLuminosity(o, -0.15), q = AmCharts.polygon(this.container, [0, v, q + v, q, 0], [0, u, u, 0, 0], o, n, 1, m, l), q.translate(t, r + p), this.set.push(q), v = AmCharts.polygon(this.container, [0, 0, v, v, 0], [0, p, p + u, u, 0], o, n, 1, m, l), v.translate(t, r), this.set.push(v))
    },
    updatePlotArea: function () {
        this.realWidth = this.updateWidth() - 1;
        this.realHeight = this.updateHeight() - 1;
        var e = this.realWidth - this.marginLeftReal - this.marginRightReal - this.dx,
            d = this.realHeight - this.marginTopReal - this.marginBottomReal;
        1 > e && (e = 1);
        1 > d && (d = 1);
        this.plotAreaWidth = Math.round(e);
        this.plotAreaHeight = Math.round(d)
    },
    updateDxy: function () {
        this.dx = this.depth3D * Math.cos(this.angle * Math.PI / 180);
        this.dy = -this.depth3D * Math.sin(this.angle * Math.PI / 180)
    },
    updateMargins: function () {
        var b = this.getTitleHeight();
        this.titleHeight = b;
        this.marginTopReal = this.marginTop - this.dy + b;
        this.marginBottomReal = this.marginBottom;
        this.marginLeftReal = this.marginLeft;
        this.marginRightReal = this.marginRight
    },
    updateValueAxes: function () {
        for (var k = this.valueAxes, j = this.marginLeftReal, p = this.marginTopReal, o = this.plotAreaHeight, n = this.plotAreaWidth, m = 0; m < k.length; m++) {
            var l = k[m];
            l.axisRenderer = AmCharts.RecAxis;
            l.guideFillRenderer = AmCharts.RecFill;
            l.axisItemRenderer = AmCharts.RecItem;
            l.dx = this.dx;
            l.dy = this.dy;
            l.viW = n;
            l.viH = o;
            l.marginsChanged = !0;
            l.viX = j;
            l.viY = p;
            this.updateObjectSize(l)
        }
    },
    updateObjectSize: function (b) {
        b.width = this.plotAreaWidth * this.widthMultiplyer;
        b.height = this.plotAreaHeight * this.heightMultiplyer;
        b.x = this.marginLeftReal + this.horizontalPosition;
        b.y = this.marginTopReal + this.verticalPosition
    },
    updateGraphs: function () {
        for (var f = this.graphs, e = 0; e < f.length; e++) {
            var g = f[e];
            g.x = this.marginLeftReal + this.horizontalPosition;
            g.y = this.marginTopReal + this.verticalPosition;
            g.width = this.plotAreaWidth * this.widthMultiplyer;
            g.height = this.plotAreaHeight * this.heightMultiplyer;
            g.index = e;
            g.dx = this.dx;
            g.dy = this.dy;
            g.rotate = this.rotate;
            g.chartType = this.chartType
        }
    },
    updateChartCursor: function () {
        var b = this.chartCursor;
        b && (b.x = this.marginLeftReal, b.y = this.marginTopReal, b.width = this.plotAreaWidth, b.height = this.plotAreaHeight, b.chart = this)
    },
    updateScrollbars: function () {},
    addChartCursor: function (b) {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        b && (this.listenTo(b, "changed", this.handleCursorChange), this.listenTo(b, "zoomed", this.handleCursorZoom));
        this.chartCursor = b
    },
    removeChartCursor: function () {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        this.chartCursor = null
    },
    zoomTrendLines: function () {
        for (var f = this.trendLines, e = 0; e < f.length; e++) {
            var g = f[e];
            g.valueAxis.recalculateToPercents ? g.set && g.set.hide() : (g.x = this.marginLeftReal + this.horizontalPosition, g.y = this.marginTopReal + this.verticalPosition, g.draw())
        }
    },
    addTrendLine: function (b) {
        this.trendLines.push(b)
    },
    removeTrendLine: function (f) {
        for (var e = this.trendLines, g = e.length - 1; 0 <= g; g--) {
            e[g] == f && e.splice(g, 1)
        }
    },
    adjustMargins: function (f, e) {
        var g = f.scrollbarHeight;
        "top" == f.position ? e ? this.marginLeftReal += g : this.marginTopReal += g : e ? this.marginRightReal += g : this.marginBottomReal += g
    },
    getScrollbarPosition: function (f, e, g) {
        f.position = e ? "bottom" == g || "left" == g ? "bottom" : "top" : "top" == g || "right" == g ? "bottom" : "top"
    },
    updateChartScrollbar: function (k, j) {
        if (k) {
            k.rotate = j;
            var p = this.marginTopReal,
                o = this.marginLeftReal,
                n = k.scrollbarHeight,
                m = this.dx,
                l = this.dy;
            "top" == k.position ? j ? (k.y = p, k.x = o - n) : (k.y = p - n + l, k.x = o + m) : j ? (k.y = p + l, k.x = o + this.plotAreaWidth + m) : (k.y = p + this.plotAreaHeight + 1, k.x = this.marginLeftReal)
        }
    },
    showZB: function (e) {
        var d = this.zbSet;
        d && (e ? d.show() : d.hide(), this.zbBG.hide())
    },
    handleReleaseOutside: function (b) {
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, b);
        (b = this.chartCursor) && b.handleReleaseOutside()
    },
    handleMouseDown: function (e) {
        AmCharts.AmRectangularChart.base.handleMouseDown.call(this, e);
        var d = this.chartCursor;
        d && d.handleMouseDown(e)
    },
    handleCursorChange: function () {}
});
AmCharts.TrendLine = AmCharts.Class({
    construct: function () {
        this.createEvents("click");
        this.isProtected = !1;
        this.dashLength = 0;
        this.lineColor = "#00CC00";
        this.lineThickness = this.lineAlpha = 1
    },
    draw: function () {
        var N = this;
        N.destroy();
        var M = N.chart,
            L = M.container,
            K, J, I, H, G = N.categoryAxis,
            F = N.initialDate,
            E = N.initialCategory,
            D = N.finalDate,
            A = N.finalCategory,
            z = N.valueAxis,
            C = N.valueAxisX,
            B = N.initialXValue,
            y = N.finalXValue,
            w = N.initialValue,
            v = N.finalValue,
            u = z.recalculateToPercents;
        G && (F && (K = G.dateToCoordinate(F)), E && (K = G.categoryToCoordinate(E)), D && (J = G.dateToCoordinate(D)), A && (J = G.categoryToCoordinate(A)));
        C && !u && (isNaN(B) || (K = C.getCoordinate(B)), isNaN(y) || (J = C.getCoordinate(y)));
        z && !u && (isNaN(w) || (I = z.getCoordinate(w)), isNaN(v) || (H = z.getCoordinate(v)));
        !isNaN(K) && (!isNaN(J) && !isNaN(I) && !isNaN(I)) && (M.rotate ? (G = [I, H], J = [K, J]) : (G = [K, J], J = [I, H]), I = N.lineColor, K = AmCharts.line(L, G, J, I, N.lineAlpha, N.lineThickness, N.dashLength), J = AmCharts.line(L, G, J, I, 0.005, 5), L = L.set([K, J]), L.translate(M.marginLeftReal, M.marginTopReal), M.trendLinesSet.push(L), N.line = K, N.set = L, J.mouseup(function () {
            N.handleLineClick()
        }).mouseover(function () {
            N.handleLineOver()
        }).mouseout(function () {
            N.handleLineOut()
        }))
    },
    handleLineClick: function () {
        var b = {
            type: "click",
            trendLine: this,
            chart: this.chart
        };
        this.fire(b.type, b)
    },
    handleLineOver: function () {
        var b = this.rollOverColor;
        void 0 != b && this.line.attr({
            stroke: b
        })
    },
    handleLineOut: function () {
        this.line.attr({
            stroke: this.lineColor
        })
    },
    destroy: function () {
        AmCharts.remove(this.set)
    }
});
AmCharts.AmSerialChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmSerialChart.base.construct.call(this);
        this.createEvents("changed");
        this.columnSpacing = 5;
        this.columnWidth = 0.8;
        this.updateScrollbar = !0;
        var b = new AmCharts.CategoryAxis;
        b.chart = this;
        this.categoryAxis = b;
        this.chartType = "serial";
        this.zoomOutOnDataUpdate = !0;
        this.skipZoom = !1;
        this.minSelectedTime = 0
    },
    initChart: function () {
        AmCharts.AmSerialChart.base.initChart.call(this);
        this.updateCategoryAxis();
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins())
    },
    validateData: function (b) {
        this.marginsUpdated = !1;
        this.zoomOutOnDataUpdate && !b && (this.endTime = this.end = this.startTime = this.start = NaN);
        AmCharts.AmSerialChart.base.validateData.call(this)
    },
    drawChart: function () {
        AmCharts.AmSerialChart.base.drawChart.call(this);
        var g = this.chartData;
        if (AmCharts.ifArray(g)) {
            var f = this.chartScrollbar;
            f && f.draw();
            var f = g.length - 1,
                j, h;
            j = this.categoryAxis;
            if (j.parseDates && !j.equalSpacing) {
                if (j = this.startTime, h = this.endTime, isNaN(j) || isNaN(h)) {
                    j = g[0].time, h = g[f].time
                }
            } else {
                if (j = this.start, h = this.end, isNaN(j) || isNaN(h)) {
                    j = 0, h = f
                }
            }
            this.endTime = this.startTime = this.end = this.start = void 0;
            this.zoom(j, h)
        } else {
            this.cleanChart()
        }
        this.chartCreated = !0;
        this.dispDUpd()
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.categoryAxis, this.chartScrollbar, this.chartCursor])
    },
    updateCategoryAxis: function () {
        var b = this.categoryAxis;
        b.id = "categoryAxis";
        b.rotate = this.rotate;
        b.axisRenderer = AmCharts.RecAxis;
        b.guideFillRenderer = AmCharts.RecFill;
        b.axisItemRenderer = AmCharts.RecItem;
        b.setOrientation(!this.rotate);
        b.x = this.marginLeftReal;
        b.y = this.marginTopReal;
        b.dx = this.dx;
        b.dy = this.dy;
        b.width = this.plotAreaWidth;
        b.height = this.plotAreaHeight;
        b.viW = this.plotAreaWidth;
        b.viH = this.plotAreaHeight;
        b.viX = this.marginLeftReal;
        b.viY = this.marginTopReal;
        b.marginsChanged = !0
    },
    updateValueAxes: function () {
        AmCharts.AmSerialChart.base.updateValueAxes.call(this);
        for (var g = this.valueAxes, f = 0; f < g.length; f++) {
            var j = g[f],
                h = this.rotate;
            j.rotate = h;
            j.setOrientation(h);
            h = this.categoryAxis;
            if (!h.startOnAxis || h.parseDates) {
                j.expandMinMax = !0
            }
        }
    },
    updateData: function () {
        this.parseData();
        var g = this.countColumns(),
            f = this.chartCursor;
        f && f.updateData();
        for (var f = this.graphs, j = 0; j < f.length; j++) {
            var h = f[j];
            h.columnCount = g;
            h.data = this.chartData
        }
    },
    updateMargins: function () {
        AmCharts.AmSerialChart.base.updateMargins.call(this);
        var b = this.chartScrollbar;
        b && (this.getScrollbarPosition(b, this.rotate, this.categoryAxis.position), this.adjustMargins(b, this.rotate))
    },
    updateScrollbars: function () {
        this.updateChartScrollbar(this.chartScrollbar, this.rotate)
    },
    zoom: function (f, e) {
        var g = this.categoryAxis;
        g.parseDates && !g.equalSpacing ? this.timeZoom(f, e) : this.indexZoom(f, e);
        this.updateColumnsDepth()
    },
    timeZoom: function (k, j) {
        var q = this.maxSelectedTime;
        if (!isNaN(q) && (j != this.endTime && j - k > q && (k = j - q, this.updateScrollbar = !0), k != this.startTime && j - k > q)) {
            j = k + q, this.updateScrollbar = !0
        }
        var p = this.minSelectedTime;
        if (0 < p && j - k < p) {
            var o = Math.round(k + (j - k) / 2),
                p = Math.round(p / 2),
                k = o - p,
                j = o + p
        }
        var n = this.chartData,
            o = this.categoryAxis;
        if (AmCharts.ifArray(n) && (k != this.startTime || j != this.endTime)) {
            var m = o.minDuration();
            this.firstTime = p = n[0].time;
            var l = n[n.length - 1].time;
            this.lastTime = l;
            k || (k = p, isNaN(q) || (k = l - q));
            j || (j = l);
            k > l && (k = l);
            j < p && (j = p);
            k < p && (k = p);
            j > l && (j = l);
            j < k && (j = k + m);
            this.startTime = k;
            this.endTime = j;
            q = n.length - 1;
            m = this.getClosestIndex(n, "time", k, !0, 0, q);
            n = this.getClosestIndex(n, "time", j, !1, m, q);
            o.timeZoom(k, j);
            o.zoom(m, n);
            this.start = AmCharts.fitToBounds(m, 0, q);
            this.end = AmCharts.fitToBounds(n, 0, q);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            k != p || j != l ? this.showZB(!0) : this.showZB(!1);
            this.dispatchTimeZoomEvent()
        }
    },
    indexZoom: function (g, f) {
        var j = this.maxSelectedSeries;
        if (!isNaN(j) && (f != this.end && f - g > j && (g = f - j, this.updateScrollbar = !0), g != this.start && f - g > j)) {
            f = g + j, this.updateScrollbar = !0
        }
        if (g != this.start || f != this.end) {
            var h = this.chartData.length - 1;
            isNaN(g) && (g = 0, isNaN(j) || (g = h - j));
            isNaN(f) && (f = h);
            f < g && (f = g);
            f > h && (f = h);
            g > h && (g = h - 1);
            0 > g && (g = 0);
            this.start = g;
            this.end = f;
            this.categoryAxis.zoom(g, f);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            0 != g || f != this.chartData.length - 1 ? this.showZB(!0) : this.showZB(!1);
            this.dispatchIndexZoomEvent()
        }
    },
    updateGraphs: function () {
        AmCharts.AmSerialChart.base.updateGraphs.call(this);
        for (var f = this.graphs, e = 0; e < f.length; e++) {
            var g = f[e];
            g.columnWidth = this.columnWidth;
            g.categoryAxis = this.categoryAxis
        }
    },
    updateColumnsDepth: function () {
        var h, g = this.graphs;
        AmCharts.remove(this.columnsSet);
        this.columnsArray = [];
        for (h = 0; h < g.length; h++) {
            var l = g[h],
                k = l.columnsArray;
            if (k) {
                for (var j = 0; j < k.length; j++) {
                    this.columnsArray.push(k[j])
                }
            }
        }
        this.columnsArray.sort(this.compareDepth);
        if (0 < this.columnsArray.length) {
            g = this.container.set();
            this.columnSet.push(g);
            for (h = 0; h < this.columnsArray.length; h++) {
                g.push(this.columnsArray[h].column.set)
            }
            l && g.translate(l.x, l.y);
            this.columnsSet = g
        }
    },
    compareDepth: function (e, d) {
        return e.depth > d.depth ? 1 : -1
    },
    zoomScrollbar: function () {
        var e = this.chartScrollbar,
            d = this.categoryAxis;
        e && this.updateScrollbar && (d.parseDates && !d.equalSpacing ? e.timeZoom(this.startTime, this.endTime) : e.zoom(this.start, this.end), this.updateScrollbar = !0)
    },
    updateTrendLines: function () {
        for (var f = this.trendLines, e = 0; e < f.length; e++) {
            var g = f[e];
            g.chart = this;
            g.valueAxis || (g.valueAxis = this.valueAxes[0]);
            g.categoryAxis = this.categoryAxis
        }
    },
    zoomAxesAndGraphs: function () {
        if (!this.scrollbarOnly) {
            for (var e = this.valueAxes, d = 0; d < e.length; d++) {
                e[d].zoom(this.start, this.end)
            }
            e = this.graphs;
            for (d = 0; d < e.length; d++) {
                e[d].zoom(this.start, this.end)
            }
            this.zoomTrendLines();
            (d = this.chartCursor) && d.zoom(this.start, this.end, this.startTime, this.endTime)
        }
    },
    countColumns: function () {
        for (var t = 0, r = this.valueAxes.length, q = this.graphs.length, p, o, n = !1, m, l = 0; l < r; l++) {
            o = this.valueAxes[l];
            var k = o.stackType;
            if ("100%" == k || "regular" == k) {
                n = !1;
                for (m = 0; m < q; m++) {
                    p = this.graphs[m], !p.hidden && (p.valueAxis == o && "column" == p.type) && (!n && p.stackable && (t++, n = !0), p.stackable || t++, p.columnIndex = t - 1)
                }
            }
            if ("none" == k || "3d" == k) {
                for (m = 0; m < q; m++) {
                    p = this.graphs[m], !p.hidden && (p.valueAxis == o && "column" == p.type) && (p.columnIndex = t, t++)
                }
            }
            if ("3d" == k) {
                for (l = 0; l < q; l++) {
                    p = this.graphs[l], p.depthCount = t
                }
                t = 1
            }
        }
        return t
    },
    parseData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        this.parseSerialData()
    },
    getCategoryIndexByValue: function (g) {
        for (var f = this.chartData, j, h = 0; h < f.length; h++) {
            f[h].category == g && (j = h)
        }
        return j
    },
    handleCursorChange: function (b) {
        this.updateLegendValues(b.index)
    },
    handleCursorZoom: function (b) {
        this.updateScrollbar = !0;
        this.zoom(b.start, b.end)
    },
    handleScrollbarZoom: function (b) {
        this.updateScrollbar = !1;
        this.zoom(b.start, b.end)
    },
    dispatchTimeZoomEvent: function () {
        if (this.prevStartTime != this.startTime || this.prevEndTime != this.endTime) {
            var f = {
                type: "zoomed"
            };
            f.startDate = new Date(this.startTime);
            f.endDate = new Date(this.endTime);
            f.startIndex = this.start;
            f.endIndex = this.end;
            this.startIndex = this.start;
            this.endIndex = this.end;
            this.prevStartTime = this.startTime;
            this.prevEndTime = this.endTime;
            var e = this.categoryAxis,
                g = AmCharts.extractPeriod(e.minPeriod).period,
                e = e.dateFormatsObject[g];
            f.startValue = AmCharts.formatDate(f.startDate, e);
            f.endValue = AmCharts.formatDate(f.endDate, e);
            f.chart = this;
            f.target = this;
            this.fire(f.type, f)
        }
    },
    dispatchIndexZoomEvent: function () {
        if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
            this.startIndex = this.start;
            this.endIndex = this.end;
            var e = this.chartData;
            if (AmCharts.ifArray(e) && !isNaN(this.start) && !isNaN(this.end)) {
                var d = {
                    chart: this,
                    target: this,
                    type: "zoomed"
                };
                d.startIndex = this.start;
                d.endIndex = this.end;
                d.startValue = e[this.start].category;
                d.endValue = e[this.end].category;
                this.categoryAxis.parseDates && (this.startTime = e[this.start].time, this.endTime = e[this.end].time, d.startDate = new Date(this.startTime), d.endDate = new Date(this.endTime));
                this.prevStartIndex = this.start;
                this.prevEndIndex = this.end;
                this.fire(d.type, d)
            }
        }
    },
    updateLegendValues: function (g) {
        for (var f = this.graphs, j = 0; j < f.length; j++) {
            var h = f[j];
            h.currentDataItem = isNaN(g) ? void 0 : this.chartData[g].axes[h.valueAxis.id].graphs[h.id]
        }
        this.legend && this.legend.updateValues()
    },
    getClosestIndex: function (k, j, q, p, o, n) {
        0 > o && (o = 0);
        n > k.length - 1 && (n = k.length - 1);
        var m = o + Math.round((n - o) / 2),
            l = k[m][j];
        if (1 >= n - o) {
            if (p) {
                return o
            }
            p = k[n][j];
            return Math.abs(k[o][j] - q) < Math.abs(p - q) ? o : n
        }
        return q == l ? m : q < l ? this.getClosestIndex(k, j, q, p, o, m) : this.getClosestIndex(k, j, q, p, m, n)
    },
    zoomToIndexes: function (g, f) {
        this.updateScrollbar = !0;
        var j = this.chartData;
        if (j) {
            var h = j.length;
            0 < h && (0 > g && (g = 0), f > h - 1 && (f = h - 1), h = this.categoryAxis, h.parseDates && !h.equalSpacing ? this.zoom(j[g].time, j[f].time) : this.zoom(g, f))
        }
    },
    zoomToDates: function (g, f) {
        this.updateScrollbar = !0;
        var j = this.chartData;
        if (this.categoryAxis.equalSpacing) {
            var h = this.getClosestIndex(j, "time", g.getTime(), !0, 0, j.length),
                j = this.getClosestIndex(j, "time", f.getTime(), !1, 0, j.length);
            this.zoom(h, j)
        } else {
            this.zoom(g.getTime(), f.getTime())
        }
    },
    zoomToCategoryValues: function (e, d) {
        this.updateScrollbar = !0;
        this.zoom(this.getCategoryIndexByValue(e), this.getCategoryIndexByValue(d))
    },
    formatString: function (j, h) {
        var n = h.graph;
        if (-1 != j.indexOf("[[category]]")) {
            var m = h.serialDataItem.category;
            if (this.categoryAxis.parseDates) {
                var l = this.balloonDateFormat,
                    k = this.chartCursor;
                k && (l = k.categoryBalloonDateFormat); - 1 != j.indexOf("[[category]]") && (l = AmCharts.formatDate(m, l), -1 != l.indexOf("fff") && (l = AmCharts.formatMilliseconds(l, m)), m = l)
            }
            j = j.replace(/\[\[category\]\]/g, "" + m)
        }
        n = n.numberFormatter;
        n || (n = this.numberFormatter);
        m = h.graph.valueAxis;
        if ((l = m.duration) && !isNaN(h.values.value)) {
            m = AmCharts.formatDuration(h.values.value, l, "", m.durationUnits, m.maxInterval, n), j = j.replace(RegExp("\\[\\[value\\]\\]", "g"), m)
        }
        m = ["value", "open", "low", "high", "close"];
        l = this.percentFormatter;
        j = AmCharts.formatValue(j, h.percents, m, l, "percents.");
        j = AmCharts.formatValue(j, h.values, m, n, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        j = AmCharts.formatValue(j, h.values, ["percents"], l); - 1 != j.indexOf("[[") && (j = AmCharts.formatDataContextValue(j, h.dataContext));
        return j = AmCharts.AmSerialChart.base.formatString.call(this, j, h)
    },
    addChartScrollbar: function (b) {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        b && (b.chart = this, this.listenTo(b, "zoomed", this.handleScrollbarZoom));
        this.rotate ? void 0 == b.width && (b.width = b.scrollbarHeight) : void 0 == b.height && (b.height = b.scrollbarHeight);
        this.chartScrollbar = b
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        this.chartScrollbar = null
    },
    handleReleaseOutside: function (b) {
        AmCharts.AmSerialChart.base.handleReleaseOutside.call(this, b);
        AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar])
    }
});
AmCharts.AmRadarChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function () {
        AmCharts.AmRadarChart.base.construct.call(this);
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 0;
        this.chartType = "radar";
        this.radius = "35%"
    },
    initChart: function () {
        AmCharts.AmRadarChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.drawChart()
    },
    updateData: function () {
        this.parseData();
        for (var e = this.graphs, d = 0; d < e.length; d++) {
            e[d].data = this.chartData
        }
    },
    updateGraphs: function () {
        for (var f = this.graphs, e = 0; e < f.length; e++) {
            var g = f[e];
            g.index = e;
            g.width = this.realRadius;
            g.height = this.realRadius;
            g.x = this.marginLeftReal;
            g.y = this.marginTopReal;
            g.chartType = this.chartType
        }
    },
    parseData: function () {
        AmCharts.AmRadarChart.base.parseData.call(this);
        this.parseSerialData()
    },
    updateValueAxes: function () {
        for (var f = this.valueAxes, e = 0; e < f.length; e++) {
            var g = f[e];
            g.axisRenderer = AmCharts.RadAxis;
            g.guideFillRenderer = AmCharts.RadarFill;
            g.axisItemRenderer = AmCharts.RadItem;
            g.autoGridCount = !1;
            g.x = this.marginLeftReal;
            g.y = this.marginTopReal;
            g.width = this.realRadius;
            g.height = this.realRadius
        }
    },
    drawChart: function () {
        AmCharts.AmRadarChart.base.drawChart.call(this);
        var g = this.updateWidth(),
            f = this.updateHeight(),
            j = this.marginTop + this.getTitleHeight(),
            h = this.marginLeft,
            f = f - j - this.marginBottom;
        this.marginLeftReal = h + (g - h - this.marginRight) / 2;
        this.marginTopReal = j + f / 2;
        this.realRadius = AmCharts.toCoordinate(this.radius, g, f);
        this.updateValueAxes();
        this.updateGraphs();
        g = this.chartData;
        if (AmCharts.ifArray(g)) {
            g = g.length - 1;
            h = this.valueAxes;
            for (j = 0; j < h.length; j++) {
                h[j].zoom(0, g)
            }
            h = this.graphs;
            for (j = 0; j < h.length; j++) {
                h[j].zoom(0, g)
            }
        } else {
            this.cleanChart()
        }
        this.chartCreated = !0;
        this.dispDUpd()
    },
    formatString: function (f, e) {
        var g = e.graph; - 1 != f.indexOf("[[category]]") && (f = f.replace(/\[\[category\]\]/g, "" + e.serialDataItem.category));
        g = g.numberFormatter;
        g || (g = this.numberFormatter);
        f = AmCharts.formatValue(f, e.values, ["value"], g, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        return f = AmCharts.AmRadarChart.base.formatString.call(this, f, e)
    },
    cleanChart: function () {
        this.callMethod("destroy", [this.valueAxes, this.graphs])
    }
});
AmCharts.AxisBase = AmCharts.Class({
    construct: function () {
        this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
        this.axisWidth;
        this.axisThickness = 1;
        this.axisColor = "#000000";
        this.axisAlpha = 1;
        this.gridCount = this.tickLength = 5;
        this.gridAlpha = 0.15;
        this.gridThickness = 1;
        this.gridColor = "#000000";
        this.dashLength = 0;
        this.labelFrequency = 1;
        this.showLastLabel = this.showFirstLabel = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0;
        this.labelsEnabled = !0;
        this.labelRotation = 0;
        this.autoGridCount = !0;
        this.valueRollOverColor = "#CC0000";
        this.offset = 0;
        this.guides = [];
        this.visible = !0;
        this.counter = 0;
        this.guides = [];
        this.ignoreAxisWidth = this.inside = !1;
        this.titleColor;
        this.titleFontSize;
        this.titleBold = !0
    },
    zoom: function (e, d) {
        this.start = e;
        this.end = d;
        this.dataChanged = !0;
        this.draw()
    },
    fixAxisPosition: function () {
        var b = this.position;
        "H" == this.orientation ? ("left" == b && (b = "bottom"), "right" == b && (b = "top")) : ("bottom" == b && (b = "left"), "top" == b && (b = "right"));
        this.position = b
    },
    draw: function () {
        var f = this.chart;
        void 0 == this.titleColor && (this.titleColor = f.color);
        isNaN(this.titleFontSize) && (this.titleFontSize = f.fontSize + 1);
        this.allLabels = [];
        this.counter = 0;
        this.destroy();
        this.fixAxisPosition();
        this.labels = [];
        var e = f.container,
            g = e.set();
        f.gridSet.push(g);
        this.set = g;
        e = e.set();
        f.axesLabelsSet.push(e);
        this.labelsSet = e;
        this.axisLine = new this.axisRenderer(this);
        this.autoGridCount && ("V" == this.orientation ? (f = this.height / 35, 3 > f && (f = 3)) : f = this.width / 75, this.gridCount = f);
        this.axisWidth = this.axisLine.axisWidth;
        this.addTitle()
    },
    setOrientation: function (b) {
        this.orientation = b ? "H" : "V"
    },
    addTitle: function () {
        var e = this.title;
        if (e) {
            var d = this.chart;
            this.titleLabel = AmCharts.text(d.container, e, this.titleColor, d.fontFamily, this.titleFontSize, "middle", this.titleBold)
        }
    },
    positionTitle: function () {
        var A = this.titleLabel;
        if (A) {
            var z, y, w = this.labelsSet,
                v = {};
            0 < w.length() ? v = w.getBBox() : (v.x = 0, v.y = 0, v.width = this.viW, v.height = this.viH);
            w.push(A);
            var w = v.x,
                u = v.y;
            AmCharts.VML && (this.rotate ? w -= this.x : u -= this.y);
            var t = v.width,
                v = v.height,
                r = this.viW,
                q = this.viH;
            A.getBBox();
            var p = 0,
                n = this.titleFontSize / 2,
                m = this.inside;
            switch (this.position) {
                case "top":
                    z = r / 2;
                    y = u - 10 - n;
                    break;
                case "bottom":
                    z = r / 2;
                    y = u + v + 10 + n;
                    break;
                case "left":
                    z = w - 10 - n;
                    m && (z -= 5);
                    y = q / 2;
                    p = -90;
                    break;
                case "right":
                    z = w + t + 10 + n - 3, m && (z += 7), y = q / 2, p = -90
            }
            this.marginsChanged ? (A.translate(z, y), this.tx = z, this.ty = y) : A.translate(this.tx, this.ty);
            this.marginsChanged = !1;
            0 != p && A.rotate(p)
        }
    },
    pushAxisItem: function (e) {
        var d = e.graphics();
        0 < d.length() && this.set.push(d);
        (e = e.getLabel()) && this.labelsSet.push(e)
    },
    addGuide: function (b) {
        this.guides.push(b)
    },
    removeGuide: function (f) {
        for (var e = this.guides, g = 0; g < e.length; g++) {
            e[g] == f && e.splice(g, 1)
        }
    },
    handleGuideOver: function (g) {
        clearTimeout(this.chart.hoverInt);
        var f = g.graphics.getBBox(),
            j = f.x + f.width / 2,
            f = f.y + f.height / 2,
            h = g.fillColor;
        void 0 == h && (h = g.lineColor);
        this.chart.showBalloon(g.balloonText, h, !0, j, f)
    },
    handleGuideOut: function () {
        this.chart.hideBalloon()
    },
    addEventListeners: function (f, e) {
        var g = this;
        f.mouseover(function () {
            g.handleGuideOver(e)
        });
        f.mouseout(function () {
            g.handleGuideOut(e)
        })
    },
    getBBox: function () {
        var b = this.labelsSet.getBBox();
        AmCharts.VML || (b = {
            x: b.x + this.x,
            y: b.y + this.y,
            width: b.width,
            height: b.height
        });
        return b
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.labelsSet);
        var b = this.axisLine;
        b && AmCharts.remove(b.set);
        AmCharts.remove(this.grid0)
    }
});
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
        AmCharts.ValueAxis.base.construct.call(this);
        this.dataChanged = !0;
        this.gridCount = 8;
        this.stackType = "none";
        this.position = "left";
        this.unitPosition = "right";
        this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
        this.duration;
        this.durationUnits = {
            DD: "d. ",
            hh: ":",
            mm: ":",
            ss: ""
        };
        this.scrollbar = !1;
        this.maxDecCount;
        this.baseValue = 0;
        this.radarCategoriesEnabled = !0;
        this.gridType = "polygons";
        this.useScientificNotation = !1;
        this.axisTitleOffset = 10
    },
    updateData: function () {
        0 >= this.gridCount && (this.gridCount = 1);
        this.data = this.chart.chartData;
        "xy" != this.chart.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
        this.recalculateToPercents && this.recalculate();
        this.synchronizationMultiplyer && this.synchronizeWithAxis ? this.foundGraphs = !0 : (this.foundGraphs = !1, this.getMinMax())
    },
    draw: function () {
        AmCharts.ValueAxis.base.draw.call(this);
        var aa = this.chart,
            Z = this.set;
        "duration" == this.type && (this.duration = "ss");
        !0 == this.dataChanged && (this.updateData(), this.dataChanged = !1);
        if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum)) {
            this.fire("logarithmicAxisFailed", {
                type: "logarithmicAxisFailed",
                chart: aa
            })
        } else {
            this.grid0 = null;
            var Y, X, W = aa.dx,
                V = aa.dy,
                U = !1,
                T = this.logarithmic,
                S = aa.chartType;
            if (!isNaN(this.min) && !isNaN(this.max) && this.foundGraphs && Infinity != this.min && -Infinity != this.max) {
                var R = this.labelFrequency,
                    Q = this.showFirstLabel,
                    M = this.showLastLabel,
                    L = 1,
                    P = 0,
                    O = Math.round((this.max - this.min) / this.step) + 1;
                if (!0 == T) {
                    var J = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E;
                    this.stepWidth = this.axisWidth / J;
                    2 < J && (O = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, P = Math.round(Math.log(this.minReal) * Math.LOG10E), O > this.gridCount && (L = Math.ceil(O / this.gridCount)))
                } else {
                    this.stepWidth = this.axisWidth / (this.max - this.min)
                }
                Y = 0;
                1 > this.step && -1 < this.step && (X = this.step.toString(), Y = -1 != X.indexOf("e-") ? Number(X.split("-")[1]) : X.split(".")[1].length);
                this.integersOnly && (Y = 0);
                Y > this.maxDecCount && (Y = this.maxDecCount);
                isNaN(this.precision) || (Y = this.precision);
                this.max = AmCharts.roundTo(this.max, this.maxDecCount);
                this.min = AmCharts.roundTo(this.min, this.maxDecCount);
                var I = {};
                I.precision = Y;
                I.decimalSeparator = aa.numberFormatter.decimalSeparator;
                I.thousandsSeparator = aa.numberFormatter.thousandsSeparator;
                this.numberFormatter = I;
                var G = this.guides,
                    E = G.length;
                if (0 < E) {
                    var z = this.fillAlpha;
                    for (X = this.fillAlpha = 0; X < E; X++) {
                        var y = G[X],
                            H = NaN;
                        if (!isNaN(y.toValue)) {
                            var H = this.getCoordinate(y.toValue),
                                B = new this.axisItemRenderer(this, H, "", !0, NaN, NaN, y);
                            this.pushAxisItem(B)
                        }
                        var K = NaN;
                        isNaN(y.value) || (K = this.getCoordinate(y.value), B = new this.axisItemRenderer(this, K, y.label, !0, NaN, (H - K) / 2, y), this.pushAxisItem(B));
                        isNaN(H - K) || (B = new this.guideFillRenderer(this, K, H, y), this.pushAxisItem(B), B = B.graphics(), y.graphics = B, y.balloonText && this.addEventListeners(B, y))
                    }
                    this.fillAlpha = z
                }
                G = !1;
                for (X = P; X < O; X += L) {
                    B = AmCharts.roundTo(this.step * X + this.min, Y), -1 != ("" + B).indexOf("e") && (G = !0, ("" + B).split("e"))
                }
                this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
                for (X = P; X < O; X += L) {
                    if (P = this.step * X + this.min, P = AmCharts.roundTo(P, this.maxDecCount + 1), !(this.integersOnly && Math.round(P) != P)) {
                        !0 == T && (0 == P && (P = this.minReal), 2 < J && (P = Math.pow(10, X)), G = -1 != ("" + P).indexOf("e") ? !0 : !1);
                        this.useScientificNotation && (G = !0);
                        this.usePrefixes && (G = !1);
                        G ? (B = -1 == ("" + P).indexOf("e") ? P.toExponential(15) : "" + P, B = B.split("e"), Y = Number(B[0]), B = Number(B[1]), 10 == Y && (Y = 1, B += 1), B = Y + "e" + B, 0 == P && (B = "0"), 1 == P && (B = "1")) : (T && (Y = ("" + P).split("."), I.precision = Y[1] ? Y[1].length : -1), B = this.usePrefixes ? AmCharts.addPrefix(P, aa.prefixesOfBigNumbers, aa.prefixesOfSmallNumbers, I) : AmCharts.formatNumber(P, I, I.precision));
                        this.duration && (B = AmCharts.formatDuration(P, this.duration, "", this.durationUnits, this.maxInterval, I));
                        this.recalculateToPercents ? B += "%" : (Y = this.unit) && (B = "left" == this.unitPosition ? Y + B : B + Y);
                        Math.round(X / R) != X / R && (B = void 0);
                        if (0 == X && !Q || X == O - 1 && !M) {
                            B = " "
                        }
                        Y = this.getCoordinate(P);
                        B = new this.axisItemRenderer(this, Y, B);
                        this.pushAxisItem(B);
                        if (P == this.baseValue && "radar" != S) {
                            var v, F, E = this.viW,
                                z = this.viH,
                                P = this.viX,
                                B = this.viY;
                            "H" == this.orientation ? 0 <= Y && Y <= E + 1 && (v = [Y, Y, Y + W], F = [z, 0, V]) : 0 <= Y && Y <= z + 1 && (v = [0, E, E + W], F = [Y, Y, Y + V]);
                            v && (Y = AmCharts.fitToBounds(2 * this.gridAlpha, 0, 1), Y = AmCharts.line(aa.container, v, F, this.gridColor, Y, 1, this.dashLength), Y.translate(P, B), this.grid0 = Y, aa.axesSet.push(Y), Y.toBack())
                        }
                    }
                }
                W = this.baseValue;
                this.min > this.baseValue && this.max > this.baseValue && (W = this.min);
                this.min < this.baseValue && this.max < this.baseValue && (W = this.max);
                T && W < this.minReal && (W = this.minReal);
                this.baseCoord = this.getCoordinate(W);
                aa = {
                    type: "axisChanged",
                    target: this,
                    chart: aa
                };
                aa.min = T ? this.minReal : this.min;
                aa.max = this.max;
                this.fire("axisChanged", aa);
                this.axisCreated = !0
            } else {
                U = !0
            }
            T = this.axisLine.set;
            aa = this.labelsSet;
            this.positionTitle();
            "radar" != S ? (S = this.viX, W = this.viY, Z.translate(S, W), aa.translate(S, W)) : T.toFront();
            !this.visible || U ? (Z.hide(), T.hide(), aa.hide()) : (Z.show(), T.show(), aa.show())
        }
    },
    stackGraphs: function (A) {
        var z = this.stackType;
        "stacked" == z && (z = "regular");
        "line" == z && (z = "none");
        "100% stacked" == z && (z = "100%");
        this.stackType = z;
        var y = [],
            w = [],
            v = [],
            u = [],
            t, r = this.chart.graphs,
            q, p, n, m = this.baseValue;
        if (("line" == A || "step" == A || "smoothedLine" == A) && ("regular" == z || "100%" == z)) {
            for (n = 0; n < r.length; n++) {
                t = r[n], t.hidden || (p = t.type, t.chart == this.chart && (t.valueAxis == this && A == p && t.stackable) && (q && (t.stackGraph = q), q = t))
            }
        }
        for (q = this.start; q <= this.end; q++) {
            for (n = 0; n < r.length; n++) {
                if (t = r[n], !t.hidden && (p = t.type, t.chart == this.chart && (t.valueAxis == this && A == p && t.stackable) && (p = this.data[q].axes[this.id].graphs[t.id], t = p.values.value, !isNaN(t) && (u[q] = isNaN(u[q]) ? Math.abs(t) : u[q] + Math.abs(t), "regular" == z)))) {
                    if ("line" == A || "step" == A || "smoothedLine" == A) {
                        isNaN(y[q]) ? (y[q] = t, p.values.close = t, p.values.open = this.baseValue) : (p.values.close = isNaN(t) ? y[q] : t + y[q], p.values.open = y[q], y[q] = p.values.close)
                    }
                    "column" == A && !isNaN(t) && (p.values.close = t, 0 > t ? (p.values.close = t, isNaN(w[q]) ? p.values.open = m : (p.values.close += w[q], p.values.open = w[q]), w[q] = p.values.close) : (p.values.close = t, isNaN(v[q]) ? p.values.open = m : (p.values.close += v[q], p.values.open = v[q]), v[q] = p.values.close))
                }
            }
        }
        for (q = this.start; q <= this.end; q++) {
            for (n = 0; n < r.length; n++) {
                t = r[n], t.hidden || (p = t.type, t.chart == this.chart && (t.valueAxis == this && A == p && t.stackable) && (p = this.data[q].axes[this.id].graphs[t.id], t = p.values.value, isNaN(t) || (y = 100 * (t / u[q]), p.values.percents = y, p.values.total = u[q], "100%" == z && (isNaN(w[q]) && (w[q] = 0), isNaN(v[q]) && (v[q] = 0), 0 > y ? (p.values.close = y + w[q], p.values.open = w[q], w[q] = p.values.close) : (p.values.close = y + v[q], p.values.open = v[q], v[q] = p.values.close)))))
            }
        }
    },
    recalculate: function () {
        for (var v = this.chart.graphs, u = 0; u < v.length; u++) {
            var t = v[u];
            if (t.valueAxis == this) {
                var r = "value";
                if ("candlestick" == t.type || "ohlc" == t.type) {
                    r = "open"
                }
                var q, p, o = this.end + 2,
                    o = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1),
                    n = this.start;
                0 < n && n--;
                for (var m = this.start; m <= o && !(p = this.data[m].axes[this.id].graphs[t.id], q = p.values[r], !isNaN(q)); m++) {}
                for (r = n; r <= o; r++) {
                    p = this.data[r].axes[this.id].graphs[t.id];
                    p.percents = {};
                    var n = p.values,
                        l;
                    for (l in n) {
                        p.percents[l] = "percents" != l ? 100 * (n[l] / q) - 100 : n[l]
                    }
                }
            }
        }
    },
    getMinMax: function () {
        for (var h = !1, g = this.chart, l = g.graphs, k = 0; k < l.length; k++) {
            var j = l[k].type;
            if ("line" == j || "step" == j || "smoothedLine" == j) {
                this.expandMinMax && (h = !0)
            }
        }
        h && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
        "serial" == g.chartType && !0 == g.categoryAxis.parseDates && !h && this.end < this.data.length - 1 && this.end++;
        this.min = this.getMin(this.start, this.end);
        this.max = this.getMax();
        h = this.guides.length;
        if (this.includeGuidesInMinMax && 0 < h) {
            for (g = 0; g < h; g++) {
                if (l = this.guides[g], l.toValue < this.min && (this.min = l.toValue), l.value < this.min && (this.min = l.value), l.toValue > this.max && (this.max = l.toValue), l.value > this.max) {
                    this.max = l.value
                }
            }
        }
        isNaN(this.minimum) || (this.min = this.minimum);
        isNaN(this.maximum) || (this.max = this.maximum);
        this.min > this.max && (h = this.max, this.max = this.min, this.min = h);
        isNaN(this.minTemp) || (this.min = this.minTemp);
        isNaN(this.maxTemp) || (this.max = this.maxTemp);
        this.minReal = this.min;
        this.maxReal = this.max;
        0 == this.min && 0 == this.max && (this.max = 9);
        this.min > this.max && (this.min = this.max - 1);
        h = this.min;
        g = this.max;
        l = this.max - this.min;
        k = 0 == l ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(l)) * Math.LOG10E)) / 10;
        isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / k) * k + k);
        isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min / k) * k - k);
        0 > this.min && 0 <= h && (this.min = 0);
        0 < this.max && 0 >= g && (this.max = 0);
        "100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
        l = this.max - this.min;
        k = Math.pow(10, Math.floor(Math.log(Math.abs(l)) * Math.LOG10E)) / 10;
        this.step = Math.ceil(l / this.gridCount / k) * k;
        l = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
        l = l.toExponential(0).split("e");
        k = Number(l[1]);
        9 == Number(l[0]) && k++;
        l = this.generateNumber(1, k);
        k = Math.ceil(this.step / l);
        5 < k && (k = 10);
        5 >= k && 2 < k && (k = 5);
        this.step = Math.ceil(this.step / (l * k)) * l * k;
        1 > l ? (this.maxDecCount = Math.abs(Math.log(Math.abs(l)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
        this.min = this.step * Math.floor(this.min / this.step);
        this.max = this.step * Math.ceil(this.max / this.step);
        0 > this.min && 0 <= h && (this.min = 0);
        0 < this.max && 0 >= g && (this.max = 0);
        1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
        l = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) * Math.LOG10E));
        0 == this.min && (this.minReal = l);
        0 == this.min && 1 < this.minReal && (this.minReal = 1);
        0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
        l = Math.log(g) * Math.LOG10E - Math.log(h) * Math.LOG10E;
        this.logarithmic && (2 < l ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(h)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(g)) * Math.LOG10E))) : (g = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, h = Math.pow(10, Math.floor(Math.log(Math.abs(h)) * Math.LOG10E)) / 10, g < h && (this.minReal = this.min = 10 * h)))
    },
    generateNumber: function (h, g) {
        var l = "",
            k;
        k = 0 > g ? Math.abs(g) - 1 : Math.abs(g);
        for (var j = 0; j < k; j++) {
            l += "0"
        }
        return 0 > g ? Number("0." + l + ("" + h)) : Number("" + h + l)
    },
    getMin: function (t, r) {
        for (var q, p = t; p <= r; p++) {
            var o = this.data[p].axes[this.id].graphs,
                n;
            for (n in o) {
                var m = this.chart.getGraphById(n);
                if (m.includeInMinMax && (!m.hidden || this.includeHidden)) {
                    isNaN(q) && (q = Infinity);
                    this.foundGraphs = !0;
                    m = o[n].values;
                    this.recalculateToPercents && (m = o[n].percents);
                    var l;
                    if (this.minMaxField) {
                        l = m[this.minMaxField], l < q && (q = l)
                    } else {
                        for (var k in m) {
                            "percents" != k && "total" != k && (l = m[k], l < q && (q = l))
                        }
                    }
                }
            }
        }
        return q
    },
    getMax: function () {
        for (var k, j = this.start; j <= this.end; j++) {
            var p = this.data[j].axes[this.id].graphs,
                o;
            for (o in p) {
                var n = this.chart.getGraphById(o);
                if (n.includeInMinMax && (!n.hidden || this.includeHidden)) {
                    isNaN(k) && (k = -Infinity);
                    this.foundGraphs = !0;
                    n = p[o].values;
                    this.recalculateToPercents && (n = p[o].percents);
                    var m;
                    if (this.minMaxField) {
                        m = n[this.minMaxField], m > k && (k = m)
                    } else {
                        for (var l in n) {
                            "percents" != l && "total" != l && (m = n[l], m > k && (k = m))
                        }
                    }
                }
            }
        }
        return k
    },
    dispatchZoomEvent: function (f, e) {
        var g = {
            type: "axisZoomed",
            startValue: f,
            endValue: e,
            target: this,
            chart: this.chart
        };
        this.fire(g.type, g)
    },
    zoomToValues: function (f, e) {
        if (e < f) {
            var g = e,
                e = f,
                f = g
        }
        f < this.min && (f = this.min);
        e > this.max && (e = this.max);
        g = {
            type: "axisSelfZoomed"
        };
        g.chart = this.chart;
        g.valueAxis = this;
        g.multiplyer = this.axisWidth / Math.abs(this.getCoordinate(e) - this.getCoordinate(f));
        g.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(f) - this.y : this.getCoordinate(e) - this.y : this.reversed ? this.getCoordinate(e) - this.x : this.getCoordinate(f) - this.x;
        this.fire(g.type, g)
    },
    coordinateToValue: function (k) {
        if (isNaN(k)) {
            return NaN
        }
        var j = this.axisWidth,
            p = this.stepWidth,
            o = this.reversed,
            n = this.rotate,
            m = this.min,
            l = this.minReal;
        return !0 == this.logarithmic ? Math.pow(10, (n ? !0 == o ? (j - k) / p : k / p : !0 == o ? k / p : (j - k) / p) + Math.log(l) * Math.LOG10E) : !0 == o ? n ? m - (k - j) / p : k / p + m : n ? k / p + m : m - (k - j) / p
    },
    getCoordinate: function (k) {
        if (isNaN(k)) {
            return NaN
        }
        var j = this.rotate,
            p = this.reversed,
            o = this.axisWidth,
            n = this.stepWidth,
            m = this.min,
            l = this.minReal;
        !0 == this.logarithmic ? (k = Math.log(k) * Math.LOG10E - Math.log(l) * Math.LOG10E, j = j ? !0 == p ? o - n * k : n * k : !0 == p ? n * k : o - n * k) : j = !0 == p ? j ? o - n * (k - m) : n * (k - m) : j ? n * (k - m) : o - n * (k - m);
        j = this.rotate ? j + (this.x - this.viX) : j + (this.y - this.viY);
        return Math.round(j)
    },
    synchronizeWithAxis: function (b) {
        this.synchronizeWithAxis = b;
        this.removeListener(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization);
        this.listenTo(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization)
    },
    handleSynchronization: function () {
        var g = this.synchronizeWithAxis,
            f = g.min,
            j = g.max,
            g = g.step,
            h = this.synchronizationMultiplyer;
        h && (this.min = f * h, this.max = j * h, this.step = g * h, f = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), f = Math.abs(Math.log(Math.abs(f)) * Math.LOG10E), this.maxDecCount = f = Math.round(f), this.draw())
    }
});
AmCharts.CategoryAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function () {
        AmCharts.CategoryAxis.base.construct.call(this);
        this.minPeriod = "DD";
        this.equalSpacing = this.parseDates = !1;
        this.position = "bottom";
        this.startOnAxis = !1;
        this.firstDayOfWeek = 1;
        this.gridPosition = "middle";
        this.boldPeriodBeginning = !0;
        this.periods = [{
            period: "ss",
            count: 1
        }, {
            period: "ss",
            count: 5
        }, {
            period: "ss",
            count: 10
        }, {
            period: "ss",
            count: 30
        }, {
            period: "mm",
            count: 1
        }, {
            period: "mm",
            count: 5
        }, {
            period: "mm",
            count: 10
        }, {
            period: "mm",
            count: 30
        }, {
            period: "hh",
            count: 1
        }, {
            period: "hh",
            count: 3
        }, {
            period: "hh",
            count: 6
        }, {
            period: "hh",
            count: 12
        }, {
            period: "DD",
            count: 1
        }, {
            period: "WW",
            count: 1
        }, {
            period: "MM",
            count: 1
        }, {
            period: "MM",
            count: 2
        }, {
            period: "MM",
            count: 3
        }, {
            period: "MM",
            count: 6
        }, {
            period: "YYYY",
            count: 1
        }, {
            period: "YYYY",
            count: 2
        }, {
            period: "YYYY",
            count: 5
        }, {
            period: "YYYY",
            count: 10
        }, {
            period: "YYYY",
            count: 50
        }, {
            period: "YYYY",
            count: 100
        }];
        this.dateFormats = [{
            period: "fff",
            format: "JJ:NN:SS"
        }, {
            period: "ss",
            format: "JJ:NN:SS"
        }, {
            period: "mm",
            format: "JJ:NN"
        }, {
            period: "hh",
            format: "JJ:NN"
        }, {
            period: "DD",
            format: "MMM DD"
        }, {
            period: "WW",
            format: "MMM DD"
        }, {
            period: "MM",
            format: "MMM"
        }, {
            period: "YYYY",
            format: "YYYY"
        }];
        this.nextPeriod = {};
        this.nextPeriod.fff = "ss";
        this.nextPeriod.ss = "mm";
        this.nextPeriod.mm = "hh";
        this.nextPeriod.hh = "DD";
        this.nextPeriod.DD = "MM";
        this.nextPeriod.MM = "YYYY"
    },
    draw: function () {
        AmCharts.CategoryAxis.base.draw.call(this);
        this.generateDFObject();
        var L = this.chart.chartData;
        this.data = L;
        if (AmCharts.ifArray(L)) {
            var K = this.chart,
                J = this.start,
                I = this.labelFrequency,
                H = 0,
                G = this.end - J + 1,
                F = this.gridCount,
                E = this.showFirstLabel,
                D = this.showLastLabel,
                C, B = "",
                B = AmCharts.extractPeriod(this.minPeriod);
            C = AmCharts.getPeriodDuration(B.period, B.count);
            var y, w, A, z, v;
            y = this.rotate;
            var u = this.firstDayOfWeek,
                L = AmCharts.resetDateToMin(new Date(L[L.length - 1].time + 1.05 * C), this.minPeriod, 1, u).getTime();
            this.endTime > L && (this.endTime = L);
            if (this.parseDates && !this.equalSpacing) {
                if (this.timeDifference = this.endTime - this.startTime, J = this.choosePeriod(0), I = J.period, y = J.count, w = AmCharts.getPeriodDuration(I, y), w < C && (I = B.period, y = B.count, w = C), L = I, "WW" == L && (L = "DD"), this.stepWidth = this.getStepWidth(this.timeDifference), F = Math.ceil(this.timeDifference / w) + 1, B = AmCharts.resetDateToMin(new Date(this.startTime - w), I, y, u).getTime(), L == I && 1 == y && (A = w * this.stepWidth), this.cellWidth = C * this.stepWidth, G = Math.round(B / w), J = -1, G / 2 == Math.round(G / 2) && (J = -2, B -= w), 0 < this.gridCount) {
                    for (G = J; G <= F; G++) {
                        z = B + 1.5 * w;
                        z = AmCharts.resetDateToMin(new Date(z), I, y, u).getTime();
                        C = (z - this.startTime) * this.stepWidth;
                        v = !1;
                        this.nextPeriod[L] && (v = this.checkPeriodChange(this.nextPeriod[L], 1, z, B));
                        var t = !1;
                        v ? (B = this.dateFormatsObject[this.nextPeriod[L]], t = !0) : B = this.dateFormatsObject[L];
                        this.boldPeriodBeginning || (t = !1);
                        B = AmCharts.formatDate(new Date(z), B);
                        if (G == J && !E || G == F && !D) {
                            B = " "
                        }
                        C = new this.axisItemRenderer(this, C, B, !1, A, 0, !1, t);
                        this.pushAxisItem(C);
                        B = z
                    }
                }
            } else {
                if (this.parseDates) {
                    if (this.parseDates && this.equalSpacing) {
                        H = this.start;
                        this.startTime = this.data[this.start].time;
                        this.endTime = this.data[this.end].time;
                        this.timeDifference = this.endTime - this.startTime;
                        J = this.choosePeriod(0);
                        I = J.period;
                        y = J.count;
                        w = AmCharts.getPeriodDuration(I, y);
                        w < C && (I = B.period, y = B.count, w = C);
                        L = I;
                        "WW" == L && (L = "DD");
                        this.stepWidth = this.getStepWidth(G);
                        F = Math.ceil(this.timeDifference / w) + 1;
                        B = AmCharts.resetDateToMin(new Date(this.startTime - w), I, y, u).getTime();
                        this.cellWidth = this.getStepWidth(G);
                        G = Math.round(B / w);
                        J = -1;
                        G / 2 == Math.round(G / 2) && (J = -2, B -= w);
                        G = this.start;
                        G / 2 == Math.round(G / 2) && G--;
                        0 > G && (G = 0);
                        A = this.end + 2;
                        A >= this.data.length && (A = this.data.length);
                        u = !1;
                        for (this.end - this.start > this.gridCount && (u = !0); G < A; G++) {
                            if (z = this.data[G].time, this.checkPeriodChange(I, y, z, B)) {
                                C = this.getCoordinate(G - this.start);
                                v = !1;
                                this.nextPeriod[L] && (v = this.checkPeriodChange(this.nextPeriod[L], 1, z, B));
                                t = !1;
                                v ? (B = this.dateFormatsObject[this.nextPeriod[L]], t = !0) : B = this.dateFormatsObject[L];
                                B = AmCharts.formatDate(new Date(z), B);
                                if (G == J && !E || G == F && !D) {
                                    B = " "
                                }
                                u ? u = !1 : (C = new this.axisItemRenderer(this, C, B, void 0, void 0, void 0, void 0, t), C.graphics(), this.pushAxisItem(C));
                                B = z
                            }
                        }
                    }
                } else {
                    if (this.cellWidth = this.getStepWidth(G), G < F && (F = G), H += this.start, this.stepWidth = this.getStepWidth(G), 0 < F) {
                        F = Math.floor(G / F);
                        G = H;
                        G / 2 == Math.round(G / 2) && G--;
                        0 > G && (G = 0);
                        for (A = 0; G <= this.end + 2; G += F) {
                            A++;
                            B = 0 <= G && G < this.data.length ? this.data[G].category : "";
                            C = this.getCoordinate(G - H);
                            u = 0;
                            "start" == this.gridPosition && (C -= this.cellWidth / 2, u = this.cellWidth / 2);
                            if (G == J && !E || G == this.end && !D) {
                                B = " "
                            }
                            Math.round(A / I) != A / I && (B = " ");
                            L = this.cellWidth;
                            y && (L = NaN);
                            C = new this.axisItemRenderer(this, C, B, !0, L, u, void 0, !1, u);
                            this.pushAxisItem(C)
                        }
                    }
                }
            }
            for (G = 0; G < this.data.length; G++) {
                if (E = this.data[G]) {
                    D = this.parseDates && !this.equalSpacing ? Math.round((E.time - this.startTime) * this.stepWidth + this.cellWidth / 2) : this.getCoordinate(G - H), E.x[this.id] = D
                }
            }
        }
        E = this.guides.length;
        for (G = 0; G < E; G++) {
            D = this.guides[G], A = F = J = NaN, D.toCategory && (A = K.getCategoryIndexByValue(D.toCategory), isNaN(A) || (J = this.getCoordinate(A - H), C = new this.axisItemRenderer(this, J, "", !0, NaN, NaN, D), this.pushAxisItem(C))), D.category && (A = K.getCategoryIndexByValue(D.category), isNaN(A) || (F = this.getCoordinate(A - H), A = (J - F) / 2, C = new this.axisItemRenderer(this, F, D.label, !0, NaN, A, D), this.pushAxisItem(C))), D.toDate && (this.equalSpacing ? (A = K.getClosestIndex(this.data, "time", D.toDate.getTime(), !1, 0, this.data.length - 1), isNaN(A) || (J = this.getCoordinate(A - H))) : J = (D.toDate.getTime() - this.startTime) * this.stepWidth, C = new this.axisItemRenderer(this, J, "", !0, NaN, NaN, D), this.pushAxisItem(C)), D.date && (this.equalSpacing ? (A = K.getClosestIndex(this.data, "time", D.date.getTime(), !1, 0, this.data.length - 1), isNaN(A) || (F = this.getCoordinate(A - H))) : F = (D.date.getTime() - this.startTime) * this.stepWidth, A = (J - F) / 2, C = "H" == this.orientation ? new this.axisItemRenderer(this, F, D.label, !1, 2 * A, NaN, D) : new this.axisItemRenderer(this, F, D.label, !1, NaN, A, D), this.pushAxisItem(C)), J = new this.guideFillRenderer(this, F, J, D), F = J.graphics(), this.pushAxisItem(J), D.graphics = F, F.index = G, D.balloonText && this.addEventListeners(F, D)
        }
        this.axisCreated = !0;
        K = this.x;
        H = this.y;
        this.set.translate(K, H);
        this.labelsSet.translate(K, H);
        this.positionTitle();
        (K = this.axisLine.set) && K.toFront()
    },
    choosePeriod: function (e) {
        var d = AmCharts.getPeriodDuration(this.periods[e].period, this.periods[e].count);
        return Math.ceil(this.timeDifference / d) <= this.gridCount ? this.periods[e] : e + 1 < this.periods.length ? this.choosePeriod(e + 1) : this.periods[e]
    },
    getStepWidth: function (e) {
        var d;
        this.startOnAxis ? (d = this.axisWidth / (e - 1), 1 == e && (d = this.axisWidth)) : d = this.axisWidth / e;
        return d
    },
    getCoordinate: function (b) {
        b *= this.stepWidth;
        this.startOnAxis || (b += this.stepWidth / 2);
        return Math.round(b)
    },
    timeZoom: function (e, d) {
        this.startTime = e;
        this.endTime = d + this.minDuration()
    },
    minDuration: function () {
        var b = AmCharts.extractPeriod(this.minPeriod);
        return AmCharts.getPeriodDuration(b.period, b.count)
    },
    checkPeriodChange: function (h, g, l, k) {
        var k = new Date(k),
            j = this.firstDayOfWeek,
            l = AmCharts.resetDateToMin(new Date(l), h, g, j).getTime(),
            h = AmCharts.resetDateToMin(k, h, g, j).getTime();
        return l != h ? !0 : !1
    },
    generateDFObject: function () {
        this.dateFormatsObject = {};
        for (var e = 0; e < this.dateFormats.length; e++) {
            var d = this.dateFormats[e];
            this.dateFormatsObject[d.period] = d.format
        }
    },
    xToIndex: function (j) {
        var h = this.data,
            n = this.chart,
            m = n.rotate,
            l = this.stepWidth;
        this.parseDates && !this.equalSpacing ? (j = this.startTime + Math.round(j / l) - this.minDuration() / 2, n = n.getClosestIndex(h, "time", j, !1, this.start, this.end + 1)) : (this.startOnAxis || (j -= l / 2), n = this.start + Math.round(j / l));
        var n = AmCharts.fitToBounds(n, 0, h.length - 1),
            k;
        h[n] && (k = h[n].x[this.id]);
        m ? k > this.height + 1 && n-- : k > this.width + 1 && n--;
        0 > k && n++;
        return n = AmCharts.fitToBounds(n, 0, h.length - 1)
    },
    dateToCoordinate: function (b) {
        return this.parseDates && !this.equalSpacing ? (b.getTime() - this.startTime) * this.stepWidth : this.parseDates && this.equalSpacing ? this.getCoordinate(this.chart.getClosestIndex(this.data, "time", b.getTime(), !1, 0, this.data.length - 1) - this.start) : NaN
    },
    categoryToCoordinate: function (b) {
        return this.chart ? this.getCoordinate(this.chart.getCategoryIndexByValue(b) - this.start) : NaN
    },
    coordinateToDate: function (b) {
        return this.equalSpacing ? (b = this.xToIndex(b), new Date(this.data[b].time)) : new Date(this.startTime + b / this.stepWidth)
    }
});
AmCharts.RecAxis = AmCharts.Class({
    construct: function (C) {
        var B = C.chart,
            A = C.axisThickness,
            z = C.axisColor,
            y = C.axisAlpha,
            w = C.offset,
            v = C.dx,
            u = C.dy,
            t = C.viX,
            r = C.viY,
            q = C.viH,
            n = C.viW,
            m = B.container;
        "H" == C.orientation ? (z = AmCharts.line(m, [0, n], [0, 0], z, y, A), this.axisWidth = C.width, "bottom" == C.position ? (C = A / 2 + w + q + r - 1, A = t) : (C = -A / 2 - w + r + u, A = v + t)) : (this.axisWidth = C.height, "right" == C.position ? (z = AmCharts.line(m, [0, 0, -v], [0, q, q - u], z, y, A), C = r + u, A = A / 2 + w + v + n + t - 1) : (z = AmCharts.line(m, [0, 0], [0, q], z, y, A), C = r, A = -A / 2 - w + t));
        z.translate(A, C);
        B.axesSet.push(z);
        this.set = z
    }
});
AmCharts.RecItem = AmCharts.Class({
    construct: function (aG, aF, aE, aD, aC, aB, aA, az, ay) {
        aF = Math.round(aF);
        void 0 == aE && (aE = "");
        ay || (ay = 0);
        void 0 == aD && (aD = !0);
        var ax = aG.chart.fontFamily,
            aw = aG.fontSize;
        void 0 == aw && (aw = aG.chart.fontSize);
        var at = aG.color;
        void 0 == at && (at = aG.chart.color);
        var ar = aG.chart.container,
            av = ar.set();
        this.set = av;
        var au = aG.axisThickness,
            aq = aG.axisColor,
            ap = aG.axisAlpha,
            ao = aG.tickLength,
            an = aG.gridAlpha,
            ak = aG.gridThickness,
            aj = aG.gridColor,
            ab = aG.dashLength,
            am = aG.fillColor,
            ad = aG.fillAlpha,
            O = aG.labelsEnabled,
            Z = aG.labelRotation,
            F = aG.counter,
            X = aG.inside,
            V = aG.dx,
            Y = aG.dy,
            z = aG.orientation,
            W = aG.position,
            M = aG.previousCoord,
            af = aG.viH,
            ah = aG.viW,
            ae = aG.offset,
            aH, S;
        if (aA) {
            if (O = !0, isNaN(aA.tickLength) || (ao = aA.tickLength), void 0 != aA.lineColor && (aj = aA.lineColor), isNaN(aA.lineAlpha) || (an = aA.lineAlpha), isNaN(aA.dashLength) || (ab = aA.dashLength), isNaN(aA.lineThickness) || (ak = aA.lineThickness), !0 == aA.inside && (X = !0), !isNaN(aA.labelRotation)) {
                Z = aA.labelRotation
            }
        } else {
            aE || (an /= 3, ao /= 2)
        }
        S = "start";
        aC && (S = "middle");
        var H = Z * Math.PI / 180,
            ag, ac = 0,
            al = 0,
            y = 0,
            ai = ag = 0;
        "V" == z && (Z = 0);
        if (O) {
            var G = AmCharts.text(ar, aE, at, ax, aw, S, az),
                ai = G.getBBox().width
        }
        if ("H" == z) {
            if (0 <= aF && aF <= ah + 1 && (0 < ao && (0 < ap && aF + ay <= ah + 1) && (aH = AmCharts.line(ar, [aF + ay, aF + ay], [0, ao], aq, ap, ak), av.push(aH)), 0 < an)) {
                S = AmCharts.line(ar, [aF, aF + V, aF + V], [af, af + Y, Y], aj, an, ak, ab), av.push(S)
            }
            al = 0;
            ac = aF;
            aA && 90 == Z && (ac -= aw);
            !1 == aD ? (S = "start", al = "bottom" == W ? X ? al + ao : al - ao : X ? al - ao : al + ao, ac += 3, aC && (ac += aC / 2, S = "middle"), 0 < Z && (S = "middle")) : S = "middle";
            1 == F && (0 < ad && !aA && M < ah) && (aD = AmCharts.fitToBounds(aF, 0, ah), M = AmCharts.fitToBounds(M, 0, ah), ag = aD - M, 0 < ag && (fill = AmCharts.rect(ar, ag, aG.height, am, ad), fill.translate(aD - ag + V, Y), av.push(fill)));
            "bottom" == W ? (al += af + aw / 2 + ae, X ? 0 < Z ? (al = af - ai / 2 * Math.sin(H) - ao - 3, ac += ai / 2 * Math.cos(H)) : al -= ao + aw + 3 + 3 : 0 < Z ? (al = af + ai / 2 * Math.sin(H) + ao + 3, ac -= ai / 2 * Math.cos(H)) : al += ao + au + 3 + 3) : (al += Y + aw / 2 - ae, ac += V, X ? 0 < Z ? (al = ai / 2 * Math.sin(H) + ao + 3, ac -= ai / 2 * Math.cos(H)) : al += ao + 3 : 0 < Z ? (al = -(ai / 2) * Math.sin(H) - ao - 6, ac += ai / 2 * Math.cos(H)) : al -= ao + aw + 3 + au + 3);
            "bottom" == W ? ag = (X ? af - ao - 1 : af + au - 1) + ae : (y = V, ag = (X ? Y : Y - ao - au + 1) - ae);
            aB && (ac += aB);
            Y = ac;
            0 < Z && (Y += ai / 2 * Math.cos(H));
            if (G && (W = 0, X && (W = ai * Math.cos(H)), Y + W > ah + 1 || 0 > Y)) {
                G.remove(), G = null
            }
        } else {
            if (0 <= aF && aF <= af + 1 && (0 < ao && (0 < ap && aF + ay <= af + 1) && (aH = AmCharts.line(ar, [0, ao], [aF + ay, aF + ay], aq, ap, ak), av.push(aH)), 0 < an)) {
                S = AmCharts.line(ar, [0, V, ah + V], [aF, aF + Y, aF + Y], aj, an, ak, ab), av.push(S)
            }
            S = "end";
            if (!0 == X && "left" == W || !1 == X && "right" == W) {
                S = "start"
            }
            al = aF - aw / 2;
            1 == F && (0 < ad && !aA) && (aD = AmCharts.fitToBounds(aF, 0, af), M = AmCharts.fitToBounds(M, 0, af), H = aD - M, fill = AmCharts.polygon(ar, [0, aG.width, aG.width, 0], [0, 0, H, H], am, ad), fill.translate(V, aD - H + Y), av.push(fill));
            al += aw / 2;
            "right" == W ? (ac += V + ah + ae, al += Y, X ? (ac -= ao + 4, aB || (al -= aw / 2 + 3)) : (ac += ao + 4 + au, al -= 2)) : X ? (ac += ao + 4 - ae, aB || (al -= aw / 2 + 3), aA && (ac += V, al += Y)) : (ac += -ao - au - 4 - 2 - ae, al -= 2);
            aH && ("right" == W ? (y += V + ae + ah, ag += Y, y = X ? y - au : y + au) : (y -= ae, X || (y -= ao + au)));
            aB && (al += aB);
            X = -3;
            "right" == W && (X += Y);
            if (G && (al > af + 1 || al < X)) {
                G.remove(), G = null
            }
        }
        aH && aH.translate(y, ag);
        !1 == aG.visible && (aH && aH.remove(), G && (G.remove(), G = null));
        G && (G.attr({
            "text-anchor": S
        }), G.translate(ac, al), 0 != Z && G.rotate(-Z), aG.allLabels.push(G), " " != aE && (this.label = G));
        aG.counter = 0 == F ? 1 : 0;
        aG.previousCoord = aF;
        0 == this.set.node.childNodes.length && this.set.remove()
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RecFill = AmCharts.Class({
    construct: function (v, u, t, r) {
        var q = v.dx,
            p = v.dy,
            o = v.orientation,
            n = 0;
        if (t < u) {
            var m = u,
                u = t,
                t = m
        }
        var l = r.fillAlpha;
        isNaN(l) && (l = 0);
        m = v.chart.container;
        r = r.fillColor;
        "V" == o ? (u = AmCharts.fitToBounds(u, 0, v.viH), t = AmCharts.fitToBounds(t, 0, v.viH)) : (u = AmCharts.fitToBounds(u, 0, v.viW), t = AmCharts.fitToBounds(t, 0, v.viW));
        t -= u;
        isNaN(t) && (t = 4, n = 2, l = 0);
        0 > t && "object" == typeof r && (r = r.join(",").split(",").reverse());
        "V" == o ? (v = AmCharts.rect(m, v.width, t, r, l), v.translate(q, u - n + p)) : (v = AmCharts.rect(m, t, v.height, r, l), v.translate(u - n + q, p));
        this.set = m.set([v])
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.RadAxis = AmCharts.Class({
    construct: function (L) {
        var K = L.chart,
            J = L.axisThickness,
            I = L.axisColor,
            H = L.axisAlpha,
            G = L.x,
            F = L.y;
        this.set = K.container.set();
        K.axesSet.push(this.set);
        var E = L.axisTitleOffset,
            D = L.radarCategoriesEnabled,
            C = L.chart.fontFamily,
            B = L.fontSize;
        void 0 == B && (B = L.chart.fontSize);
        var y = L.color;
        void 0 == y && (y = L.chart.color);
        if (K) {
            this.axisWidth = L.height;
            for (var L = K.chartData, w = L.length, A = 0; A < w; A++) {
                var z = 180 - 360 / w * A,
                    v = G + this.axisWidth * Math.sin(z / 180 * Math.PI),
                    u = F + this.axisWidth * Math.cos(z / 180 * Math.PI);
                this.set.push(AmCharts.line(K.container, [G, v], [F, u], I, H, J));
                if (D) {
                    var t = "start",
                        v = G + (this.axisWidth + E) * Math.sin(z / 180 * Math.PI),
                        u = F + (this.axisWidth + E) * Math.cos(z / 180 * Math.PI);
                    if (180 == z || 0 == z) {
                        t = "middle", v -= 5
                    }
                    0 > z && (t = "end", v -= 10);
                    180 == z && (u -= 5);
                    0 == z && (u += 5);
                    z = AmCharts.text(K.container, L[A].category, y, C, B, t);
                    z.translate(v + 5, u);
                    this.set.push(z);
                    z.getBBox()
                }
            }
        }
    }
});
AmCharts.RadItem = AmCharts.Class({
    construct: function (ak, aj, ai, ah, ag, af, ae) {
        void 0 == ai && (ai = "");
        var ad = ak.chart.fontFamily,
            ac = ak.fontSize;
        void 0 == ac && (ac = ak.chart.fontSize);
        var ab = ak.color;
        void 0 == ab && (ab = ak.chart.color);
        var aa = ak.chart.container;
        this.set = ah = aa.set();
        var X = ak.axisColor,
            W = ak.axisAlpha,
            Z = ak.tickLength,
            Y = ak.gridAlpha,
            S = ak.gridThickness,
            R = ak.gridColor,
            P = ak.dashLength,
            M = ak.fillColor,
            H = ak.fillAlpha,
            G = ak.labelsEnabled,
            ag = ak.counter,
            Q = ak.inside,
            J = ak.gridType,
            aj = aj - ak.height,
            V, af = ak.x,
            z = ak.y;
        ae ? (G = !0, isNaN(ae.tickLength) || (Z = ae.tickLength), void 0 != ae.lineColor && (R = ae.lineColor), isNaN(ae.lineAlpha) || (Y = ae.lineAlpha), isNaN(ae.dashLength) || (P = ae.dashLength), isNaN(ae.lineThickness) || (S = ae.lineThickness), !0 == ae.inside && (Q = !0)) : ai || (Y /= 3, Z /= 2);
        var O = "end",
            y = -1;
        Q && (O = "start", y = 1);
        if (G) {
            var F = AmCharts.text(aa, ai, ab, ad, ac, O);
            F.translate(af + (Z + 3) * y, aj);
            ah.push(F);
            this.label = F;
            V = AmCharts.line(aa, [af, af + Z * y], [aj, aj], X, W, S);
            ah.push(V)
        }
        aj = ak.y - aj;
        if ("polygons" == J) {
            for (var B = [], L = [], v = ak.data.length, ai = 0; ai < v; ai++) {
                ad = 180 - 360 / v * ai, B.push(aj * Math.sin(ad / 180 * Math.PI)), L.push(aj * Math.cos(ad / 180 * Math.PI))
            }
            B.push(B[0]);
            L.push(L[0]);
            ai = AmCharts.line(aa, B, L, R, Y, S, P)
        } else {
            ai = AmCharts.circle(aa, aj, "#FFFFFF", 0, S, R, Y)
        }
        ai.translate(af, z);
        ah.push(ai);
        if (1 == ag && 0 < H && !ae) {
            ae = ak.previousCoord;
            if ("polygons" == J) {
                for (ai = v; 0 <= ai; ai--) {
                    ad = 180 - 360 / v * ai, B.push(ae * Math.sin(ad / 180 * Math.PI)), L.push(ae * Math.cos(ad / 180 * Math.PI))
                }
                B = AmCharts.polygon(aa, B, L, M, H)
            } else {
                B = AmCharts.wedge(aa, 0, 0, 0, -360, aj, aj, ae, 0, {
                    fill: M,
                    "fill-opacity": H,
                    stroke: 0,
                    "stroke-opacity": 0,
                    "stroke-width": 0
                })
            }
            ah.push(B);
            B.translate(af, z)
        }!1 == ak.visible && (V && V.hide(), F && F.hide());
        ak.counter = 0 == ag ? 1 : 0;
        ak.previousCoord = aj
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {
        return this.label
    }
});
AmCharts.RadarFill = AmCharts.Class({
    construct: function (y, w, v, u) {
        var t = Math.max(w, v),
            w = v = Math.min(w, v),
            v = y.chart.container,
            r = u.fillAlpha,
            q = u.fillColor,
            t = Math.abs(t) - y.y,
            w = Math.abs(w) - y.y,
            p = -u.angle,
            u = -u.toAngle;
        isNaN(p) && (p = 0);
        isNaN(u) && (u = -360);
        this.set = v.set();
        void 0 == q && (q = "#000000");
        isNaN(r) && (r = 0);
        if ("polygons" == y.gridType) {
            for (var u = [], o = [], n = y.data.length, m = 0; m < n; m++) {
                p = 180 - 360 / n * m, u.push(t * Math.sin(p / 180 * Math.PI)), o.push(t * Math.cos(p / 180 * Math.PI))
            }
            u.push(u[0]);
            o.push(o[0]);
            for (m = n; 0 <= m; m--) {
                p = 180 - 360 / n * m, u.push(w * Math.sin(p / 180 * Math.PI)), o.push(w * Math.cos(p / 180 * Math.PI))
            }
            this.fill = AmCharts.polygon(v, u, o, q, r)
        } else {
            this.fill = AmCharts.wedge(v, 0, 0, p, u - p, t, t, w, 0, {
                fill: q,
                "fill-opacity": r,
                stroke: 0,
                "stroke-opacity": 0,
                "stroke-width": 0
            })
        }
        this.set.push(this.fill);
        this.fill.translate(y.x, y.y)
    },
    graphics: function () {
        return this.set
    },
    getLabel: function () {}
});
AmCharts.AmGraph = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem");
        this.type = "line";
        this.stackable = !0;
        this.columnCount = 1;
        this.columnIndex = 0;
        this.centerCustomBullets = this.showBalloon = !0;
        this.maxBulletSize = 50;
        this.minBulletSize = 0;
        this.balloonText = "[[value]]";
        this.hidden = this.scrollbar = this.animationPlayed = !1;
        this.columnWidth = 0.8;
        this.pointPosition = "middle";
        this.depthCount = 1;
        this.includeInMinMax = !0;
        this.negativeBase = 0;
        this.visibleInLegend = !0;
        this.showAllValueLabels = !1;
        this.showBalloonAt = "close";
        this.lineThickness = 1;
        this.dashLength = 0;
        this.connect = !0;
        this.lineAlpha = 1;
        this.bullet = "none";
        this.bulletBorderThickness = 2;
        this.bulletAlpha = this.bulletBorderAlpha = 1;
        this.bulletSize = 8;
        this.hideBulletsCount = this.bulletOffset = 0;
        this.labelPosition = "top";
        this.cornerRadiusTop = 0;
        this.cursorBulletAlpha = 1;
        this.gradientOrientation = "vertical";
        this.dy = this.dx = 0;
        this.periodValue = "";
        this.y = this.x = 0
    },
    draw: function () {
        var j = this.chart,
            h = j.container;
        this.container = h;
        this.destroy();
        var n = h.set();
        j.graphsSet.push(n);
        var m = h.set();
        j.bulletSet.push(m);
        this.bulletSet = m;
        if (!this.scrollbar) {
            var l = j.marginLeftReal,
                j = j.marginTopReal;
            n.translate(l, j);
            m.translate(l, j)
        }
        if ("column" == this.type) {
            var k = h.set()
        }
        AmCharts.remove(this.columnsSet);
        n.push(k);
        this.set = n;
        this.columnsSet = k;
        this.columnsArray = [];
        this.ownColumns = [];
        this.allBullets = [];
        this.animationArray = [];
        AmCharts.ifArray(this.data) && (h = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (h = !0) : this.valueAxis.axisCreated && (h = !0), !this.hidden && h && this.createGraph())
    },
    createGraph: function () {
        var b = this.chart;
        "inside" == this.labelPosition && (this.labelPosition = "bottom");
        this.startAlpha = b.startAlpha;
        this.seqAn = b.sequencedAnimation;
        this.baseCoord = this.valueAxis.baseCoord;
        this.fillColors || (this.fillColors = this.lineColor);
        void 0 == this.fillAlphas && (this.fillAlphas = 0);
        void 0 == this.bulletColor && (this.bulletColor = this.lineColor, this.bulletColorNegative = this.negativeLineColor);
        void 0 == this.bulletAlpha && (this.bulletAlpha = this.lineAlpha);
        this.bulletBorderColor || (this.bulletBorderAlpha = 0);
        if (!isNaN(this.valueAxis.min) && !isNaN(this.valueAxis.max)) {
            switch (this.chartType) {
                case "serial":
                    this.createSerialGraph();
                    break;
                case "radar":
                    this.createRadarGraph();
                    break;
                case "xy":
                    this.createXYGraph(), this.positiveClip(this.set)
            }
            this.animationPlayed = !0
        }
    },
    createXYGraph: function () {
        var v = [],
            u = [],
            t = this.xAxis,
            r = this.yAxis;
        this.pmh = r.viH + 1;
        this.pmw = t.viW + 1;
        this.pmy = this.pmx = 0;
        for (var q = this.start; q <= this.end; q++) {
            var p = this.data[q].axes[t.id].graphs[this.id],
                o = p.values,
                n = o.x,
                m = o.y,
                o = t.getCoordinate(n),
                l = r.getCoordinate(m);
            !isNaN(n) && !isNaN(m) && (v.push(o), u.push(l), (n = this.createBullet(p, o, l, q)) || (n = 0), this.labelText && (p = this.createLabel(p, o, l), this.positionLabel(o, l, p, this.labelPosition, n)))
        }
        this.drawLineGraph(v, u);
        this.launchAnimation()
    },
    createRadarGraph: function () {
        for (var v = this.valueAxis.stackType, u = [], t = [], r, q, p = this.start; p <= this.end; p++) {
            var o = this.data[p].axes[this.valueAxis.id].graphs[this.id],
                n;
            n = "none" == v || "3d" == v ? o.values.value : o.values.close;
            if (isNaN(n)) {
                this.drawLineGraph(u, t), u = [], t = []
            } else {
                var m = this.y - (this.valueAxis.getCoordinate(n) - this.height),
                    l = 180 - 360 / (this.end - this.start + 1) * p;
                n = m * Math.sin(l / 180 * Math.PI);
                m *= Math.cos(l / 180 * Math.PI);
                u.push(n);
                t.push(m);
                (l = this.createBullet(o, n, m, p)) || (l = 0);
                this.labelText && (o = this.createLabel(o, n, m), this.positionLabel(n, m, o, this.labelPosition, l));
                isNaN(r) && (r = n);
                isNaN(q) && (q = m)
            }
        }
        u.push(r);
        t.push(q);
        this.drawLineGraph(u, t);
        this.launchAnimation()
    },
    positionLabel: function (j, h, n, m, l) {
        var k = n.getBBox();
        switch (m) {
            case "left":
                j -= (k.width + l) / 2 + 2;
                break;
            case "top":
                h -= (l + k.height) / 2 + 1;
                break;
            case "right":
                j += (k.width + l) / 2 + 2;
                break;
            case "bottom":
                h += (l + k.height) / 2 + 1
        }
        n.translate(j, h)
    },
    createSerialGraph: function () {
        var a7 = this.id,
            a6 = this.index,
            a3 = this.data,
            a2 = this.chart.container,
            a0 = this.valueAxis,
            aZ = this.type,
            aX = this.columnWidth,
            aW = this.width,
            aU = this.height,
            aS = this.y,
            aR = this.rotate,
            aN = this.columnCount,
            aL = AmCharts.toCoordinate(this.cornerRadiusTop, aX / 2),
            aQ = this.connect,
            aO = [],
            aK = [],
            aJ, aI, aH = this.chart.graphs.length,
            aE, aD = this.dx / this.depthCount,
            bJ = this.dy / this.depthCount,
            aG = a0.stackType,
            bL = this.labelPosition,
            br = this.start,
            bG = this.end,
            bj = this.scrollbar,
            by = this.categoryAxis,
            bv = this.baseCoord,
            bF = this.negativeBase,
            bi = this.columnIndex,
            bx = this.lineThickness,
            bo = this.lineAlpha,
            aq = this.lineColor,
            bY = this.dashLength,
            bR = this.set;
        "above" == bL && (bL = "top");
        "below" == bL && (bL = "bottom");
        var bq = 270;
        "horizontal" == this.gradientOrientation && (bq = 0);
        this.gradientRotation = bq;
        var bt = this.chart.columnSpacing,
            bm = by.cellWidth,
            bT = (bm * aX - aN) / aN;
        bt > bT && (bt = bT);
        var bK, aF, ag, aP = aU + 1,
            bl = aW + 1,
            aj = 0,
            b0 = 0,
            bN, a9, b9, bX, bD = this.fillColors,
            bU = this.negativeFillColors,
            a8 = this.negativeLineColor,
            bz = this.fillAlphas,
            aY = this.negativeFillAlphas;
        "object" == typeof bz && (bz = bz[0]);
        "object" == typeof aY && (aY = aY[0]);
        var bH = a0.getCoordinate(a0.min);
        a0.logarithmic && (bH = a0.getCoordinate(a0.minReal));
        this.minCoord = bH;
        this.resetBullet && (this.bullet = "none");
        if (!bj && ("line" == aZ || "smoothedLine" == aZ || "step" == aZ)) {
            if (1 == a3.length && ("step" != aZ && "none" == this.bullet) && (this.bullet = "round", this.resetBullet = !0), bU || void 0 != a8) {
                var ay = bF;
                ay > a0.max && (ay = a0.max);
                ay < a0.min && (ay = a0.min);
                a0.logarithmic && (ay = a0.minReal);
                var a4 = a0.getCoordinate(ay),
                    bS = a0.getCoordinate(a0.max);
                aR ? (aP = aU, bl = Math.abs(bS - a4), bN = aU, a9 = Math.abs(bH - a4), bX = b0 = 0, a0.reversed ? (aj = 0, b9 = a4) : (aj = a4, b9 = 0)) : (bl = aW, aP = Math.abs(bS - a4), a9 = aW, bN = Math.abs(bH - a4), b9 = aj = 0, a0.reversed ? (bX = aS, b0 = a4) : bX = a4 + 1)
            }
        }
        var aw = Math.round;
        this.pmx = aw(aj);
        this.pmy = aw(b0);
        this.pmh = aw(aP);
        this.pmw = aw(bl);
        this.nmx = aw(b9);
        this.nmy = aw(bX);
        this.nmh = aw(bN);
        this.nmw = aw(a9);
        aX = "column" == aZ ? (bm * aX - bt * (aN - 1)) / aN : bm * aX;
        1 > aX && (aX = 1);
        var bs;
        if ("line" == aZ || "step" == aZ || "smoothedLine" == aZ) {
            if (0 < br) {
                for (bs = br - 1; - 1 < bs; bs--) {
                    if (bK = a3[bs], aF = bK.axes[a0.id].graphs[a7], ag = aF.values.value) {
                        br = bs;
                        break
                    }
                }
            }
            if (bG < a3.length - 1) {
                for (bs = bG + 1; bs < a3.length; bs++) {
                    if (bK = a3[bs], aF = bK.axes[a0.id].graphs[a7], ag = aF.values.value) {
                        bG = bs;
                        break
                    }
                }
            }
        }
        bG < a3.length - 1 && bG++;
        var at = [],
            ai = [],
            az = !1;
        if ("line" == aZ || "step" == aZ || "smoothedLine" == aZ) {
            if (this.stackable && "regular" == aG || "100%" == aG) {
                az = !0
            }
        }
        for (bs = br; bs <= bG; bs++) {
            bK = a3[bs];
            aF = bK.axes[a0.id].graphs[a7];
            aF.index = bs;
            var b8 = NaN,
                aA = NaN,
                aB = NaN,
                bf = NaN,
                bk = NaN,
                a5 = NaN,
                am = NaN,
                ax = NaN,
                ac = NaN,
                bh = NaN,
                bg = NaN,
                ak = NaN,
                cc = NaN,
                bp = NaN,
                aV = void 0,
                bZ = bD,
                au = bz,
                be = aq;
            void 0 != aF.color && (bZ = aF.color);
            aF.fillColors && (bZ = aF.fillColors);
            isNaN(aF.alpha) || (au = aF.alpha);
            var bW = aF.values;
            a0.recalculateToPercents && (bW = aF.percents);
            if (bW) {
                bp = !this.stackable || "none" == aG || "3d" == aG ? bW.value : bW.close;
                if ("candlestick" == aZ || "ohlc" == aZ) {
                    var bp = bW.close,
                        an = bW.low,
                        am = a0.getCoordinate(an),
                        ad = bW.high,
                        ac = a0.getCoordinate(ad)
                }
                var bw = bW.open,
                    aB = a0.getCoordinate(bp);
                isNaN(bw) || (bk = a0.getCoordinate(bw));
                if (!bj) {
                    switch (this.showBalloonAt) {
                        case "close":
                            aF.y = aB;
                            break;
                        case "open":
                            aF.y = bk;
                            break;
                        case "high":
                            aF.y = ac;
                            break;
                        case "low":
                            aF.y = am
                    }
                }
                var b8 = bK.x[by.id],
                    b1 = Math.round(bm / 2),
                    b2 = b1;
                "start" == this.pointPosition && (b8 -= bm / 2, b1 = 0, b2 = bm);
                bj || (aF.x = b8); - 100000 > b8 && (b8 = -100000);
                b8 > aW + 100000 && (b8 = aW + 100000);
                aR ? (aA = aB, bf = bk, bk = aB = b8, isNaN(bw) && (bf = bv), a5 = am, ax = ac) : (bf = aA = b8, isNaN(bw) && (bk = bv));
                switch (aZ) {
                    case "line":
                        if (isNaN(bp)) {
                            aQ || (this.drawLineGraph(aO, aK, at, ai), aO = [], aK = [], at = [], ai = [])
                        } else {
                            if (bp < bF && (aF.isNegative = !0), aO.push(aA), aK.push(aB), bh = aA, bg = aB, ak = aA, cc = aB, az) {
                                at.push(bf), ai.push(bk)
                            }
                        }
                        break;
                    case "smoothedLine":
                        if (isNaN(bp)) {
                            aQ || (this.drawSmoothedGraph(aO, aK, at, ai), aO = [], aK = [], at = [], ai = [])
                        } else {
                            if (bp < bF && (aF.isNegative = !0), aO.push(aA), aK.push(aB), bh = aA, bg = aB, ak = aA, cc = aB, az) {
                                at.push(bf), ai.push(bk)
                            }
                        }
                        break;
                    case "step":
                        isNaN(bp) ? aQ || (aI = NaN, this.drawLineGraph(aO, aK, at, ai), aO = [], aK = [], at = [], ai = []) : (bp < bF && (aF.isNegative = !0), aR ? (isNaN(aJ) || (aO.push(aJ), aK.push(aB - b1)), aK.push(aB - b1), aO.push(aA), aK.push(aB + b2), aO.push(aA)) : (isNaN(aI) || (aK.push(aI), aO.push(aA - b1)), aO.push(aA - b1), aK.push(aB), aO.push(aA + b2), aK.push(aB)), aJ = aA, aI = aB, bh = aA, bg = aB, ak = aA, cc = aB);
                        break;
                    case "column":
                        if (!isNaN(bp)) {
                            bp < bF && (aF.isNegative = !0, bU && (bZ = bU), void 0 != a8 && (be = a8));
                            var bu = a0.min,
                                aT = a0.max;
                            if (!(bp < bu && (bw < bu || void 0 == bw) || bp > aT && bw > aT)) {
                                if (aR) {
                                    if ("3d" == aG) {
                                        var bB = aB - 0.5 * (aX + bt) + bt / 2 + bJ * bi,
                                            bA = bf + aD * bi
                                    } else {
                                        bB = aB - (aN / 2 - bi) * (aX + bt) + bt / 2, bA = bf
                                    }
                                    var bC = aX,
                                        bh = aA,
                                        bg = bB + aX / 2,
                                        ak = aA,
                                        cc = bB + aX / 2;
                                    bB + bC > aU && (bC = aU - bB);
                                    0 > bB && (bC += bB, bB = 0);
                                    var bc = aA - bf,
                                        a1 = bA,
                                        bA = AmCharts.fitToBounds(bA, 0, aW),
                                        bc = bc + (a1 - bA),
                                        bc = AmCharts.fitToBounds(bc, -bA, aW - bA + aD * bi);
                                    bB < aU && 0 < bC && (aV = new AmCharts.Cuboid(a2, bc, bC, aD, bJ, bZ, au, bx, be, bo, bq, aL, aR), "bottom" != bL && (bL = "right", 0 > bp ? bL = "left" : (bh += this.dx, "regular" != aG && "100%" != aG && (bg += this.dy))))
                                } else {
                                    "3d" == aG ? (bA = aA - 0.5 * (aX + bt) + bt / 2 + aD * bi, bB = bk + bJ * bi) : (bA = aA - (aN / 2 - bi) * (aX + bt) + bt / 2, bB = bk);
                                    bC = aX;
                                    bh = bA + aX / 2;
                                    bg = aB;
                                    ak = bA + aX / 2;
                                    cc = aB;
                                    bA + bC > aW + bi * aD && (bC = aW - bA + bi * aD);
                                    0 > bA && (bC += bA, bA = 0);
                                    var bc = aB - bk,
                                        av = bB,
                                        bB = AmCharts.fitToBounds(bB, 0, aU),
                                        bc = bc + (av - bB),
                                        bc = AmCharts.fitToBounds(bc, -bB + bJ * bi, aU - bB);
                                    bA < aW + bi * aD && 0 < bC && (aV = new AmCharts.Cuboid(a2, bC, bc, aD, bJ, bZ, au, bx, be, this.lineAlpha, bq, aL, aR), 0 > bp ? bL = "bottom" : ("regular" != aG && "100%" != aG && (bh += this.dx), bg += this.dy))
                                }
                            }
                            if (aV) {
                                var bE = aV.set;
                                bE.translate(bA, bB);
                                this.columnsSet.push(bE);
                                aF.url && bE.setAttr("cursor", "pointer");
                                if (!bj) {
                                    "none" == aG && (aE = aR ? (this.end + 1 - bs) * aH - a6 : aH * bs + a6);
                                    "3d" == aG && (aR ? (aE = (aH - a6) * (this.end + 1 - bs), bg = bB + aX / 2) : (aE = (aH - a6) * (bs + 1), bh += aD * this.columnIndex), bg += bJ * this.columnIndex);
                                    if ("regular" == aG || "100%" == aG) {
                                        bL = "middle", aE = aR ? 0 < bW.value ? (this.end + 1 - bs) * aH + a6 : (this.end + 1 - bs) * aH - a6 : 0 < bW.value ? aH * bs + a6 : aH * bs - a6
                                    }
                                    this.columnsArray.push({
                                        column: aV,
                                        depth: aE
                                    });
                                    aF.x = aR ? bB + bC / 2 : bA + bC / 2;
                                    this.ownColumns.push(aV);
                                    this.animateColumns(aV, bs, aA, bf, aB, bk);
                                    this.addListeners(bE, aF)
                                }
                                aF.columnSprite = bE
                            }
                        }
                        break;
                    case "candlestick":
                        if (!isNaN(bw) && !isNaN(ad) && !isNaN(an) && !isNaN(bp)) {
                            var al, bP;
                            bp < bw && (aF.isNegative = !0, bU && (bZ = bU), aY && (au = aY), void 0 != a8 && (be = a8));
                            if (aR) {
                                if (bB = aB - aX / 2, bA = bf, bC = aX, bB + bC > aU && (bC = aU - bB), 0 > bB && (bC += bB, bB = 0), bB < aU && 0 < bC) {
                                    var bd, aC;
                                    bp > bw ? (bd = [aA, ax], aC = [bf, a5]) : (bd = [bf, ax], aC = [aA, a5]);
                                    aB < aU && 0 < aB && (al = AmCharts.line(a2, bd, [aB, aB], be, bo, bx), bP = AmCharts.line(a2, aC, [aB, aB], be, bo, bx));
                                    bc = aA - bf;
                                    aV = new AmCharts.Cuboid(a2, bc, bC, aD, bJ, bZ, bz, bx, be, bo, bq, aL, aR)
                                }
                            } else {
                                if (bA = aA - aX / 2, bB = bk + bx / 2, bC = aX, bA + bC > aW && (bC = aW - bA), 0 > bA && (bC += bA, bA = 0), bc = aB - bk, bA < aW && 0 < bC) {
                                    var aV = new AmCharts.Cuboid(a2, bC, bc, aD, bJ, bZ, au, bx, be, bo, bq, aL, aR),
                                        ao, ae;
                                    bp > bw ? (ao = [aB, ac], ae = [bk, am]) : (ao = [bk, ac], ae = [aB, am]);
                                    aA < aW && 0 < aA && (al = AmCharts.line(a2, [aA, aA], ao, be, bo, bx), bP = AmCharts.line(a2, [aA, aA], ae, be, bo, bx))
                                }
                            }
                            if (aV && (bE = aV.set, bR.push(bE), bE.translate(bA, bB), aF.url && bE.setAttr("cursor", "pointer"), al && (bR.push(al), bR.push(bP)), bh = aA, bg = aB, ak = aA, cc = aB, !bj)) {
                                aF.x = aR ? bB + bC / 2 : bA + bC / 2, this.animateColumns(aV, bs, aA, bf, aB, bk), this.addListeners(bE, aF)
                            }
                        }
                        break;
                    case "ohlc":
                        if (!isNaN(bw) && !isNaN(ad) && !isNaN(an) && !isNaN(bp)) {
                            bp < bw && (aF.isNegative = !0, void 0 != a8 && (be = a8));
                            var b3, bI, bQ;
                            if (aR) {
                                var bn = aB - aX / 2,
                                    bn = AmCharts.fitToBounds(bn, 0, aU),
                                    ar = AmCharts.fitToBounds(aB, 0, aU),
                                    aM = aB + aX / 2,
                                    aM = AmCharts.fitToBounds(aM, 0, aU);
                                bI = AmCharts.line(a2, [bf, bf], [bn, ar], be, bo, bx, bY);
                                0 < aB && aB < aU && (b3 = AmCharts.line(a2, [a5, ax], [aB, aB], be, bo, bx, bY));
                                bQ = AmCharts.line(a2, [aA, aA], [ar, aM], be, bo, bx, bY)
                            } else {
                                var ap = aA - aX / 2,
                                    ap = AmCharts.fitToBounds(ap, 0, aW),
                                    ah = AmCharts.fitToBounds(aA, 0, aW),
                                    af = aA + aX / 2,
                                    af = AmCharts.fitToBounds(af, 0, aW);
                                bI = AmCharts.line(a2, [ap, ah], [bk, bk], be, bo, bx, bY);
                                0 < aA && aA < aW && (b3 = AmCharts.line(a2, [aA, aA], [am, ac], be, bo, bx, bY));
                                bQ = AmCharts.line(a2, [ah, af], [aB, aB], be, bo, bx, bY)
                            }
                            bR.push(bI);
                            bR.push(b3);
                            bR.push(bQ);
                            bh = aA;
                            bg = aB;
                            ak = aA;
                            cc = aB
                        }
                }
                if (!bj && !isNaN(bp)) {
                    var b7 = this.hideBulletsCount;
                    if (this.end - this.start <= b7 || 0 == b7) {
                        var bO = this.createBullet(aF, ak, cc, bs);
                        bO || (bO = 0);
                        if (this.labelText) {
                            var b5 = this.createLabel(aF, 0, 0),
                                bM = 0,
                                b6 = 0,
                                bV = b5.getBBox(),
                                cd = bV.width,
                                b4 = bV.height;
                            switch (bL) {
                                case "left":
                                    bM = -(cd / 2 + bO / 2 + 3);
                                    break;
                                case "top":
                                    b6 = -(b4 / 2 + bO / 2 + 3);
                                    break;
                                case "right":
                                    bM = bO / 2 + 2 + cd / 2;
                                    break;
                                case "bottom":
                                    aR && "column" == aZ ? (bh = bv, 0 > bp ? (bM = -6, b5.attr({
                                        "text-anchor": "end"
                                    })) : (bM = 6, b5.attr({
                                        "text-anchor": "start"
                                    }))) : (b6 = bO / 2 + b4 / 2, b5.x = -(cd / 2 + 2));
                                    break;
                                case "middle":
                                    "column" == aZ && (aR ? (bM = -(aA - bf) / 2 - aD, 0 > bc && (bM += aD), Math.abs(aA - bf) < cd && !this.showAllValueLabels && (b5.remove(), b5 = null)) : (b6 = -(aB - bk) / 2, 0 > bc && (b6 -= bJ), Math.abs(aB - bk) < b4 && !this.showAllValueLabels && (b5.remove(), b5 = null)))
                            }
                            if (b5) {
                                if (bh += bM, bg += b6, b5.translate(bh, bg), aR) {
                                    if (0 > bg || bg > aU) {
                                        b5.remove(), b5 = null
                                    }
                                } else {
                                    if (0 > bh || bh > aW) {
                                        b5.remove(), b5 = null
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ("line" == aZ || "step" == aZ || "smoothedLine" == aZ) {
            "smoothedLine" == aZ ? this.drawSmoothedGraph(aO, aK, at, ai) : this.drawLineGraph(aO, aK, at, ai), bj || this.launchAnimation()
        }
    },
    animateColumns: function (g, f) {
        var j = this,
            h = j.chart.startDuration;
        0 < h && !j.animationPlayed && (j.seqAn ? (g.set.hide(), j.animationArray.push(g), h = setTimeout(function () {
            j.animate.call(j)
        }, 1000 * h / (j.end - j.start + 1) * (f - j.start)), j.timeOuts.push(h)) : j.animate(g))
    },
    createLabel: function (j, h, n) {
        var m = this.chart,
            l = this.color;
        void 0 == l && (l = m.color);
        var k = this.fontSize;
        void 0 == k && (k = m.fontSize);
        j = m.formatString(this.labelText, j, this);
        j = AmCharts.cleanFromEmpty(j);
        m = AmCharts.text(this.container, j, l, m.fontFamily, k);
        m.translate(h, n);
        this.bulletSet.push(m);
        this.allBullets.push(m);
        return m
    },
    positiveClip: function (b) {
        b.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
    },
    negativeClip: function (b) {
        b.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
    },
    drawLineGraph: function (K, J, I, H) {
        if (1 < K.length) {
            var G = this.set,
                F = this.container,
                E = F.set(),
                D = F.set();
            G.push(E);
            G.push(D);
            var C = this.lineAlpha,
                B = this.lineThickness,
                A = this.dashLength,
                G = this.fillAlphas,
                w = this.fillColors,
                v = this.negativeLineColor,
                z = this.negativeFillColors,
                y = this.negativeFillAlphas,
                u = this.baseCoord,
                t = AmCharts.line(F, K, J, this.lineColor, C, B, A, !1, !0);
            E.push(t);
            void 0 != v && (C = AmCharts.line(F, K, J, v, C, B, A, !1, !0), D.push(C));
            if (0 < G && (C = K.join(";").split(";"), B = J.join(";").split(";"), "serial" == this.chartType && (0 < I.length ? (I.reverse(), H.reverse(), C = K.concat(I), B = J.concat(H)) : this.rotate ? (B.push(B[B.length - 1]), C.push(u), B.push(B[0]), C.push(u), B.push(B[0]), C.push(C[0])) : (C.push(C[C.length - 1]), B.push(u), C.push(C[0]), B.push(u), C.push(K[0]), B.push(B[0]))), K = AmCharts.polygon(F, C, B, w, G, 0, 0, 0, this.gradientRotation), E.push(K), z || void 0 != v)) {
                y || (y = G), z || (z = v), F = AmCharts.polygon(F, C, B, z, y, 0, 0, 0, this.gradientRotation), D.push(F)
            }
            this.applyMask(D, E)
        }
    },
    applyMask: function (f, e) {
        var g = f.length();
        "serial" == this.chartType && !this.scrollbar && (this.positiveClip(e), 0 < g && this.negativeClip(f));
        0 == g && AmCharts.remove(f)
    },
    drawSmoothedGraph: function (G, F) {
        if (1 < G.length) {
            var E = this.set,
                D = this.container,
                C = D.set(),
                B = D.set();
            E.push(C);
            E.push(B);
            var A = this.lineAlpha,
                z = this.lineThickness,
                E = this.dashLength,
                y = this.fillAlphas,
                w = this.fillColors,
                v = this.negativeLineColor,
                r = this.negativeFillColors,
                q = this.negativeFillAlphas,
                u = this.baseCoord,
                t = new AmCharts.Bezier(D, G, F, this.lineColor, A, z, w, 0, E);
            C.push(t.path);
            void 0 != v && (A = new AmCharts.Bezier(D, G, F, v, A, z, w, 0, E), B.push(A.path));
            if (0 < y && (A = "", this.rotate ? (A += " L" + u + "," + F[F.length - 1], A += " L" + u + "," + F[0]) : (A += " L" + G[G.length - 1] + "," + u, A += " L" + G[0] + "," + u), A += " L" + G[0] + "," + F[0], w = new AmCharts.Bezier(D, G, F, NaN, 0, 0, w, y, E, A), C.push(w.path), r || void 0 != v)) {
                q || (q = y), r || (r = v), D = new AmCharts.Bezier(D, G, F, NaN, 0, 0, r, q, E, A), B.push(D.path)
            }
            this.applyMask(B, C)
        }
    },
    launchAnimation: function () {
        var g = this,
            f = g.chart.startDuration;
        if (0 < f && !g.animationPlayed) {
            var j = g.set,
                h = g.bulletSet;
            AmCharts.VML || (j.attr({
                opacity: g.startAlpha
            }), h.attr({
                opacity: g.startAlpha
            }));
            j.hide();
            h.hide();
            g.seqAn ? (f = setTimeout(function () {
                g.animateGraphs.call(g)
            }, 1000 * g.index * f), g.timeOuts.push(f)) : g.animateGraphs()
        }
    },
    animateGraphs: function () {
        var j = this.chart,
            h = this.set,
            n = this.bulletSet,
            m = this.x,
            l = this.y;
        h.show();
        n.show();
        var k = j.startDuration,
            j = j.startEffect;
        h && (this.rotate ? (h.translate(-1000, l), n.translate(-1000, l)) : (h.translate(m, -1000), n.translate(m, -1000)), h.animate({
            opacity: 1,
            translate: m + "," + l
        }, k, j), n.animate({
            opacity: 1,
            translate: m + "," + l
        }, k, j))
    },
    animate: function (g) {
        var f = this.chart,
            j = this.container,
            h = this.animationArray;
        !g && 0 < h.length && (g = h[0], h.shift());
        j = j[AmCharts.getEffect(f.startEffect)];
        f = f.startDuration;
        g && (this.rotate ? g.animateWidth(f, j) : g.animateHeight(f, j), g.set.show())
    },
    legendKeyColor: function () {
        var e = this.legendColor,
            d = this.lineAlpha;
        void 0 == e && (e = this.lineColor, 0 == d && (d = this.fillColors) && (e = "object" == typeof d ? d[0] : d));
        return e
    },
    legendKeyAlpha: function () {
        var b = this.legendAlpha;
        void 0 == b && (b = this.lineAlpha, 0 == b && this.fillAlphas && (b = this.fillAlphas), 0 == b && (b = this.bulletAlpha), 0 == b && (b = 1));
        return b
    },
    createBullet: function (C, B, A) {
        var z = this.container,
            y = this.bulletOffset,
            w = this.bulletSize;
        isNaN(C.bulletSize) || (w = C.bulletSize);
        if (!isNaN(this.maxValue)) {
            var v = C.values.value;
            isNaN(v) || (w = v / this.maxValue * this.maxBulletSize)
        }
        w < this.minBulletSize && (w = this.minBulletSize);
        this.rotate ? B += y : A -= y;
        var u;
        if ("none" != this.bullet || C.bullet) {
            var t = this.bulletColor;
            C.isNegative && void 0 != this.bulletColorNegative && (t = this.bulletColorNegative);
            void 0 != C.color && (t = C.color);
            y = this.bullet;
            C.bullet && (y = C.bullet);
            var v = this.bulletBorderThickness,
                r = this.bulletBorderColor,
                q = this.bulletBorderAlpha,
                n = this.bulletAlpha,
                m = C.alpha;
            isNaN(m) || (n = m);
            switch (y) {
                case "round":
                    u = AmCharts.circle(z, w / 2, t, n, v, r, q);
                    break;
                case "square":
                    u = AmCharts.polygon(z, [0, w, w, 0], [0, 0, w, w], t, n, v, r, q);
                    B -= w / 2;
                    A -= w / 2;
                    break;
                case "triangleUp":
                    u = AmCharts.triangle(z, w, 0, t, n, v, r, q);
                    break;
                case "triangleDown":
                    u = AmCharts.triangle(z, w, 180, t, n, v, r, q);
                    break;
                case "triangleLeft":
                    u = AmCharts.triangle(z, w, 270, t, n, v, r, q);
                    break;
                case "triangleRight":
                    u = AmCharts.triangle(z, w, 90, t, n, v, r, q);
                    break;
                case "bubble":
                    u = AmCharts.circle(z, w / 2, t, n, v, r, q, !0)
            }
        }
        if (this.customBullet || C.customBullet) {
            if (y = this.customBullet, C.customBullet && (y = C.customBullet), y) {
                u && u.remove(), "function" == typeof y ? (u = new y, u.chart = this.chart, C.bulletConfig && (u.availableSpace = A, u.graph = this, C.bulletConfig.minCoord = this.minCoord - A, u.bulletConfig = C.bulletConfig), u.write(z), u = u.set) : (this.chart.path && (y = this.chart.path + y), u = z.image(y, 0, 0, w, w).attr({
                    preserveAspectRatio: !0
                }), this.centerCustomBullets && (B -= w / 2, A -= w / 2))
            }
        }
        if (u) {
            C.url && u.setAttr("cursor", "pointer");
            this.allBullets.push(u);
            if ("serial" == this.chartType && (0 > B || B > this.width || A < -w / 2 || A > this.height)) {
                u.remove(), u = null
            }
            u && (this.bulletSet.push(u), u.translate(B, A), this.addListeners(u, C))
        }
        return w
    },
    showBullets: function () {
        for (var e = this.allBullets, d = 0; d < e.length; d++) {
            e[d].show()
        }
    },
    hideBullets: function () {
        for (var e = this.allBullets, d = 0; d < e.length; d++) {
            e[d].hide()
        }
    },
    addListeners: function (f, e) {
        var g = this;
        f.mouseover(function () {
            g.handleRollOver(e)
        }).mouseout(function () {
            g.handleRollOut(e)
        }).click(function () {
            g.handleClick(e)
        }).dblclick(function () {
            g.handleDoubleClick(e)
        })
    },
    handleRollOver: function (f) {
        if (f) {
            var e = this.chart,
                g = {
                    type: "rollOverGraphItem",
                    item: f,
                    index: f.index,
                    graph: this,
                    target: this,
                    chart: this.chart
                };
            this.fire("rollOverGraphItem", g);
            e.fire("rollOverGraphItem", g);
            clearTimeout(e.hoverInt);
            g = this.showBalloon;
            e.chartCursor && "serial" == this.chartType && (g = !1, !e.chartCursor.valueBalloonsEnabled && this.showBalloon && (g = !0));
            g && (g = e.formatString(this.balloonText, f, f.graph), g = AmCharts.cleanFromEmpty(g), f = e.getBalloonColor(this, f), e.balloon.showBullet = !1, e.balloon.pointerOrientation = "V", e.showBalloon(g, f, !0))
        }
    },
    handleRollOut: function (b) {
        this.chart.hideBalloon();
        b && (b = {
            type: "rollOutGraphItem",
            item: b,
            index: b.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("rollOutGraphItem", b), this.chart.fire("rollOutGraphItem", b))
    },
    handleClick: function (e) {
        if (e) {
            var d = {
                type: "clickGraphItem",
                item: e,
                index: e.index,
                graph: this,
                target: this,
                chart: this.chart
            };
            this.fire("clickGraphItem", d);
            this.chart.fire("clickGraphItem", d);
            AmCharts.getURL(e.url, this.urlTarget)
        }
    },
    handleDoubleClick: function (b) {
        b && (b = {
            type: "doubleClickGraphItem",
            item: b,
            index: b.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("doubleClickGraphItem", b), this.chart.fire("doubleClickGraphItem", b))
    },
    zoom: function (e, d) {
        this.start = e;
        this.end = d;
        this.draw()
    },
    changeOpacity: function (g) {
        var f = this.set;
        f && f.setAttr("opacity", g);
        if (f = this.ownColumns) {
            for (var j = 0; j < f.length; j++) {
                var h = f[j].set;
                h && h.setAttr("opacity", g)
            }
        }(f = this.bulletSet) && f.setAttr("opacity", g)
    },
    destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.bulletSet);
        var e = this.timeOuts;
        if (e) {
            for (var d = 0; d < e.length; d++) {
                clearTimeout(e[d])
            }
        }
        this.timeOuts = []
    }
});
AmCharts.ChartCursor = AmCharts.Class({
    construct: function () {
        this.createEvents("changed", "zoomed", "onHideCursor", "draw");
        this.enabled = !0;
        this.cursorAlpha = 1;
        this.selectionAlpha = 0.2;
        this.cursorColor = "#CC0000";
        this.categoryBalloonAlpha = 1;
        this.color = "#FFFFFF";
        this.type = "cursor";
        this.zoomed = !1;
        this.zoomable = !0;
        this.pan = !1;
        this.animate = !0;
        this.categoryBalloonDateFormat = "MMM DD, YYYY";
        this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
        this.rolledOver = !1;
        this.cursorPosition = "middle";
        this.bulletsEnabled = this.skipZoomDispatch = !1;
        this.bulletSize = 8;
        this.oneBalloonOnly = !1
    },
    draw: function () {
        var g = this;
        g.destroy();
        var f = g.chart,
            j = f.container;
        g.rotate = f.rotate;
        g.container = j;
        j = j.set();
        j.translate(g.x, g.y);
        g.set = j;
        f.cursorSet.push(j);
        j = new AmCharts.AmBalloon;
        j.chart = f;
        g.categoryBalloon = j;
        j.cornerRadius = 0;
        j.borderThickness = 0;
        j.borderAlpha = 0;
        j.showBullet = !1;
        var h = g.categoryBalloonColor;
        void 0 == h && (h = g.cursorColor);
        j.fillColor = h;
        j.fillAlpha = g.categoryBalloonAlpha;
        j.borderColor = h;
        j.color = g.color;
        g.rotate && (j.pointerOrientation = "H");
        if (g.valueBalloonsEnabled) {
            for (j = 0; j < f.graphs.length; j++) {
                h = new AmCharts.AmBalloon, h.chart = f, AmCharts.copyProperties(f.balloon, h), f.graphs[j].valueBalloon = h
            }
        }
        "cursor" == g.type ? g.createCursor() : g.createCrosshair();
        g.interval = setInterval(function () {
            g.detectMovement.call(g)
        }, 40)
    },
    updateData: function () {
        var b = this.chart.chartData;
        this.data = b;
        AmCharts.ifArray(b) && (this.firstTime = b[0].time, this.lastTime = b[b.length - 1].time)
    },
    createCursor: function () {
        var I = this.chart,
            H = this.cursorAlpha,
            G = I.categoryAxis,
            F = G.position,
            E = G.inside,
            D = G.axisThickness,
            C = this.categoryBalloon,
            B, A, z = I.dx,
            y = I.dy,
            u = this.x,
            t = this.y,
            w = this.width,
            v = this.height,
            I = I.rotate,
            r = G.tickLength;
        C.pointerWidth = r;
        I ? (B = [0, w, w + z], A = [0, 0, y]) : (B = [z, 0, 0], A = [y, 0, v - 1]);
        this.line = H = AmCharts.line(this.container, B, A, this.cursorColor, H, 1);
        this.set.push(H);
        I ? (E && (C.pointerWidth = 0), "right" == F ? E ? C.setBounds(u, t + y, u + w + z, t + v + y) : C.setBounds(u + w + z + D, t + y, u + w + 1000, t + v + y) : E ? C.setBounds(u, t, w + u, v + t) : C.setBounds(-1000, -1000, u - r - D, t + v + 15)) : (C.maxWidth = w, G.parseDates && (r = 0, C.pointerWidth = 0), "top" == F ? E ? C.setBounds(u + z, t + y, w + z + u, v + t) : C.setBounds(u + z, -1000, w + z + u, t + y - r - D) : E ? C.setBounds(u, t, w + u, v + t - r) : C.setBounds(u, t + v + r + D - 1, u + w, t + v + r + D));
        this.hideCursor()
    },
    createCrosshair: function () {
        var f = this.cursorAlpha,
            e = this.container,
            g = AmCharts.line(e, [0, 0], [0, this.height], this.cursorColor, f, 1),
            f = AmCharts.line(e, [0, this.width], [0, 0], this.cursorColor, f, 1);
        this.set.push(g);
        this.set.push(f);
        this.vLine = g;
        this.hLine = f;
        this.hideCursor()
    },
    detectMovement: function () {
        var f = this.chart;
        if (f.mouseIsOver) {
            var e = f.mouseX - this.x,
                g = f.mouseY - this.y;
            0 < e && e < this.width && 0 < g && g < this.height ? (this.drawing ? this.rolledOver || f.setMouseCursor("crosshair") : this.pan && (this.rolledOver || f.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        } else {
            this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        }
    },
    getMousePosition: function () {
        var f, e = this.width,
            g = this.height;
        f = this.chart;
        this.rotate ? (f = f.mouseY - this.y, 0 > f && (f = 0), f > g && (f = g)) : (f = f.mouseX - this.x, 0 > f && (f = 0), f > e && (f = e));
        return f
    },
    updateCrosshair: function () {
        var h = this.chart,
            g = h.mouseX - this.x,
            l = h.mouseY - this.y,
            k = this.vLine,
            j = this.hLine,
            g = AmCharts.fitToBounds(g, 0, this.width),
            l = AmCharts.fitToBounds(l, 0, this.height);
        0 < this.cursorAlpha && (k.show(), j.show(), k.translate(g, 0), j.translate(0, l));
        this.zooming && this.updateSelectionSize(g, l);
        !h.mouseIsOver && !this.zooming && this.hideCursor()
    },
    updateSelectionSize: function (k, j) {
        AmCharts.remove(this.selection);
        var q = this.selectionPosX,
            p = this.selectionPosY,
            o = 0,
            n = 0,
            m = this.width,
            l = this.height;
        if (!isNaN(k) && (q > k && (o = k, m = q - k), q < k && (o = q, m = k - q), q == k)) {
            o = k, m = 0
        }
        if (!isNaN(j) && (p > j && (n = j, l = p - j), p < j && (n = p, l = j - p), p == j)) {
            n = j, l = 0
        }
        0 < m && 0 < l && (q = AmCharts.rect(this.container, m, l, this.cursorColor, this.selectionAlpha), q.translate(o + this.x, n + this.y), this.selection = q)
    },
    arrangeBalloons: function () {
        var j = this.valueBalloons,
            h = this.x,
            n = this.y,
            m = this.height + n;
        j.sort(this.compareY);
        for (var l = 0; l < j.length; l++) {
            var k = j[l].balloon;
            k.setBounds(h, n, h + this.width, m);
            k.draw();
            m = k.yPos - 3
        }
        this.arrangeBalloons2()
    },
    compareY: function (e, d) {
        return e.yy < d.yy ? 1 : -1
    },
    arrangeBalloons2: function () {
        var k = this.valueBalloons;
        k.reverse();
        for (var j, p = this.x, o, n = 0; n < k.length; n++) {
            var m = k[n].balloon;
            j = m.bottom;
            var l = m.bottom - m.yPos;
            0 < n && j - l < o + 3 && (m.setBounds(p, o + 3, p + this.width, o + l + 3), m.draw());
            m.set && m.set.show();
            o = m.bottom
        }
    },
    showBullets: function () {
        AmCharts.remove(this.allBullets);
        var k = this.container,
            j = k.set();
        this.set.push(j);
        this.set.show();
        this.allBullets = j;
        for (var j = this.chart.graphs, q = 0; q < j.length; q++) {
            var p = j[q];
            if (!p.hidden && p.balloonText) {
                var o = this.data[this.index].axes[p.valueAxis.id].graphs[p.id],
                    n = o.y;
                if (!isNaN(n)) {
                    var m, l;
                    m = o.x;
                    this.rotate ? (l = n, n = m) : l = m;
                    p = AmCharts.circle(k, this.bulletSize / 2, this.chart.getBalloonColor(p, o), p.cursorBulletAlpha);
                    p.translate(l, n);
                    this.allBullets.push(p)
                }
            }
        }
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.selection);
        this.selection = null;
        var b = this.categoryBalloon;
        b && b.destroy();
        this.destroyValueBalloons();
        AmCharts.remove(this.set)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    destroyValueBalloons: function () {
        var e = this.valueBalloons;
        if (e) {
            for (var d = 0; d < e.length; d++) {
                e[d].balloon.hide()
            }
        }
    },
    zoom: function (k, j, q, p) {
        var o = this.chart;
        this.destroyValueBalloons();
        this.zooming = !1;
        var n;
        this.rotate ? this.selectionPosY = n = o.mouseY : this.selectionPosX = n = o.mouseX;
        this.start = k;
        this.end = j;
        this.startTime = q;
        this.endTime = p;
        this.zoomed = !0;
        var m = o.categoryAxis,
            o = this.rotate;
        n = this.width;
        var l = this.height;
        m.parseDates && !m.equalSpacing ? (k = p - q + m.minDuration(), k = o ? l / k : n / k) : k = o ? l / (j - k) : n / (j - k);
        this.stepWidth = k;
        this.setPosition();
        this.hideCursor()
    },
    hideObj: function (b) {
        b && b.hide()
    },
    hideCursor: function (b) {
        void 0 == b && (b = !0);
        this.hideObj(this.set);
        this.hideObj(this.categoryBalloon);
        this.hideObj(this.line);
        this.hideObj(this.vLine);
        this.hideObj(this.hLine);
        this.hideObj(this.allBullets);
        this.destroyValueBalloons();
        AmCharts.remove(this.selection);
        this.previousIndex = NaN;
        b && this.fire("onHideCursor", {
            type: "onHideCursor",
            chart: this.chart,
            target: this
        });
        this.drawing || this.chart.setMouseCursor("auto")
    },
    setPosition: function (f, e) {
        void 0 == e && (e = !0);
        if ("cursor" == this.type) {
            if (AmCharts.ifArray(this.data)) {
                f || (f = this.getMousePosition());
                if ((f != this.previousMousePosition || !0 == this.zoomed || this.oneBalloonOnly) && !isNaN(f)) {
                    var g = this.chart.categoryAxis.xToIndex(f);
                    if (g != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly) {
                        this.updateCursor(g, e), this.zoomed = !1
                    }
                }
                this.previousMousePosition = f
            }
        } else {
            this.updateCrosshair()
        }
    },
    updateCursor: function (ac, ab) {
        var aa = this.chart,
            Z = aa.mouseX - this.x,
            Y = aa.mouseY - this.y;
        this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.x + this.drawStartX, this.x + Z], [this.y + this.drawStartY, this.y + Y], this.cursorColor, 1, 1));
        if (this.enabled) {
            void 0 == ab && (ab = !0);
            this.index = ac;
            var X = aa.categoryAxis,
                W = aa.dx,
                V = aa.dy,
                U = this.x,
                S = this.y,
                R = this.width,
                O = this.height,
                M = this.data[ac],
                Q = M.x[X.id],
                P = aa.rotate,
                K = X.inside,
                J = this.stepWidth,
                H = this.categoryBalloon,
                F = this.firstTime,
                B = this.lastTime,
                z = this.cursorPosition,
                I = X.position,
                E = this.zooming,
                L = this.panning,
                y = aa.graphs,
                G = X.axisThickness;
            if (aa.mouseIsOver || E || L || this.forceShow) {
                if (this.forceShow = !1, L) {
                    R = this.panClickPos;
                    aa = this.panClickEndTime;
                    E = this.panClickStartTime;
                    U = this.panClickEnd;
                    S = this.panClickStart;
                    Z = (P ? R - Y : R - Z) / J;
                    if (!X.parseDates || X.equalSpacing) {
                        Z = Math.round(Z)
                    }
                    0 != Z && (R = {
                        type: "zoomed",
                        target: this
                    }, R.chart = this.chart, X.parseDates && !X.equalSpacing ? (aa + Z > B && (Z = B - aa), E + Z < F && (Z = F - E), R.start = E + Z, R.end = aa + Z, this.fire(R.type, R)) : U + Z >= this.data.length || 0 > S + Z || (R.start = S + Z, R.end = U + Z, this.fire(R.type, R)))
                } else {
                    "start" == z && (Q -= X.cellWidth / 2);
                    "mouse" == z && (Q = P ? Y - 2 : Z - 2);
                    if (P) {
                        if (0 > Q) {
                            if (E) {
                                Q = 0
                            } else {
                                this.hideCursor();
                                return
                            }
                        }
                        if (Q > O + 1) {
                            if (E) {
                                Q = O + 1
                            } else {
                                this.hideCursor();
                                return
                            }
                        }
                    } else {
                        if (0 > Q) {
                            if (E) {
                                Q = 0
                            } else {
                                this.hideCursor();
                                return
                            }
                        }
                        if (Q > R) {
                            if (E) {
                                Q = R
                            } else {
                                this.hideCursor();
                                return
                            }
                        }
                    }
                    0 < this.cursorAlpha && (F = this.line, P ? F.translate(0, Q + V) : F.translate(Q, 0), F.show());
                    this.linePos = P ? Q + V : Q;
                    E && (P ? this.updateSelectionSize(NaN, Q) : this.updateSelectionSize(Q, NaN));
                    F = !0;
                    E && (F = !1);
                    this.categoryBalloonEnabled && F ? (P ? (K && ("right" == I ? H.setBounds(U, S + V, U + R + W, S + Q + V) : H.setBounds(U, S + V, U + R + W, S + Q)), "right" == I ? K ? H.setPosition(U + R + W, S + Q + V) : H.setPosition(U + R + W + G, S + Q + V) : K ? H.setPosition(U, S + Q) : H.setPosition(U - G, S + Q)) : "top" == I ? K ? H.setPosition(U + Q + W, S + V) : H.setPosition(U + Q + W, S + V - G + 1) : K ? H.setPosition(U + Q, S + O) : H.setPosition(U + Q, S + O + G - 1), X.parseDates) ? (X = AmCharts.formatDate(M.category, this.categoryBalloonDateFormat), -1 != X.indexOf("fff") && (X = AmCharts.formatMilliseconds(X, M.category)), H.showBalloon(X)) : H.showBalloon(M.category) : H.hide();
                    y && this.bulletsEnabled && this.showBullets();
                    this.destroyValueBalloons();
                    if (y && this.valueBalloonsEnabled && F && aa.balloon.enabled) {
                        this.valueBalloons = X = [];
                        if (this.oneBalloonOnly) {
                            for (var W = Infinity, v, F = 0; F < y.length; F++) {
                                J = y[F], J.showBalloon && (!J.hidden && J.balloonText) && (H = M.axes[J.valueAxis.id].graphs[J.id], B = H.y, isNaN(B) || (P ? Math.abs(Z - B) < W && (W = Math.abs(Z - B), v = J) : Math.abs(Y - B) < W && (W = Math.abs(Y - B), v = J)))
                            }
                        }
                        for (F = 0; F < y.length; F++) {
                            if (J = y[F], !(this.oneBalloonOnly && J != v) && (J.showBalloon && !J.hidden && J.balloonText) && (H = M.axes[J.valueAxis.id].graphs[J.id], B = H.y, !isNaN(B))) {
                                V = H.x;
                                Q = !0;
                                if (P) {
                                    if (W = B, 0 > V || V > O) {
                                        Q = !1
                                    }
                                } else {
                                    if (W = V, V = B, 0 > W || W > R) {
                                        Q = !1
                                    }
                                }
                                Q && (Q = J.valueBalloon, K = aa.getBalloonColor(J, H), Q.setBounds(U, S, U + R, S + O), Q.pointerOrientation = "H", Q.changeColor(K), void 0 != J.balloonAlpha && (Q.fillAlpha = J.balloonAlpha), void 0 != J.balloonTextColor && (Q.color = J.balloonTextColor), Q.setPosition(W + U, V + S), J = aa.formatString(J.balloonText, H, J), "" != J && Q.showBalloon(J), !P && Q.set && Q.set.hide(), X.push({
                                    yy: B,
                                    balloon: Q
                                }))
                            }
                        }
                        P || this.arrangeBalloons()
                    }
                    ab ? (R = {
                        type: "changed"
                    }, R.index = ac, R.target = this, R.chart = this.chart, R.zooming = E, R.position = P ? Y : Z, R.target = this, aa.fire("changed", R), this.fire("changed", R), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, aa.updateLegendValues(ac));
                    this.previousIndex = ac
                }
            }
        } else {
            this.hideCursor()
        }
    },
    enableDrawing: function (b) {
        this.enabled = !b;
        this.hideCursor();
        this.rolledOver = !1;
        this.drawing = b
    },
    isZooming: function (b) {
        b && b != this.zooming && this.handleMouseDown("fake");
        !b && b != this.zooming && this.handleMouseUp()
    },
    handleMouseOut: function () {
        if (this.enabled) {
            if (this.zooming) {
                this.setPosition()
            } else {
                this.index = void 0;
                var b = {
                    type: "changed",
                    index: void 0,
                    target: this
                };
                b.chart = this.chart;
                this.fire("changed", b);
                this.hideCursor()
            }
        }
    },
    handleReleaseOutside: function () {
        this.handleMouseUp()
    },
    handleMouseUp: function () {
        var k = this.chart,
            j = k.mouseX - this.x,
            p = k.mouseY - this.y;
        if (this.drawingNow) {
            this.drawingNow = !1;
            AmCharts.remove(this.drawingLine);
            var o = this.drawStartX,
                n = this.drawStartY;
            if (2 < Math.abs(o - j) || 2 < Math.abs(n - p)) {
                k = {
                    type: "draw",
                    target: this,
                    chart: k,
                    initialX: o,
                    initialY: n,
                    finalX: j,
                    finalY: p
                }, this.fire(k.type, k)
            }
        }
        if (this.enabled) {
            if (this.pan) {
                this.rolledOver = !1
            } else {
                if (this.zoomable && this.zooming) {
                    k = {
                        type: "zoomed",
                        target: this
                    };
                    k.chart = this.chart;
                    if ("cursor" == this.type) {
                        if (this.rotate ? this.selectionPosY = p : this.selectionPosX = p = j, !(2 > Math.abs(p - this.initialMouse) && this.fromIndex == this.index)) {
                            this.index < this.fromIndex ? (k.end = this.fromIndex, k.start = this.index) : (k.end = this.index, k.start = this.fromIndex), p = this.chart.categoryAxis, p.parseDates && !p.equalSpacing && (k.start = this.data[k.start].time, k.end = this.data[k.end].time), this.skipZoomDispatch || this.fire(k.type, k)
                        }
                    } else {
                        var m = this.initialMouseX,
                            l = this.initialMouseY;
                        3 > Math.abs(j - m) && 3 > Math.abs(p - l) || (o = Math.min(m, j), n = Math.min(l, p), j = Math.abs(m - j), p = Math.abs(l - p), k.selectionHeight = p, k.selectionWidth = j, k.selectionY = n, k.selectionX = o, this.skipZoomDispatch || this.fire(k.type, k))
                    }
                    AmCharts.remove(this.selection)
                }
            }
            this.panning = this.zooming = this.skipZoomDispatch = !1
        }
    },
    handleMouseDown: function (h) {
        if (this.zoomable || this.pan || this.drawing) {
            var g = this.rotate,
                l = this.chart,
                k = l.mouseX - this.x,
                j = l.mouseY - this.y;
            if (0 < k && k < this.width && 0 < j && j < this.height || "fake" == h) {
                this.setPosition(), this.drawing ? (this.drawStartY = j, this.drawStartX = k, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, l.setMouseCursor("move"), this.panning = !0, this.panClickPos = g ? j : k, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) : this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, g ? (this.initialMouse = j, this.selectionPosY = this.linePos) : (this.initialMouse = k, this.selectionPosX = this.linePos)) : (this.initialMouseX = k, this.initialMouseY = j, this.selectionPosX = k, this.selectionPosY = j), this.zooming = !0)
            }
        }
    }
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function () {
        this.createEvents("zoomed");
        this.backgroundColor = "#D4D4D4";
        this.backgroundAlpha = 1;
        this.selectedBackgroundColor = "#EFEFEF";
        this.scrollDuration = this.selectedBackgroundAlpha = 1;
        this.resizeEnabled = !0;
        this.hideResizeGrips = !1;
        this.scrollbarHeight = 20;
        this.updateOnReleaseOnly = !1;
        9 > document.documentMode && (this.updateOnReleaseOnly = !0);
        this.dragIconWidth = 11;
        this.dragIconHeight = 18
    },
    draw: function () {
        var k = this;
        k.destroy();
        k.interval = setInterval(function () {
            k.updateScrollbar.call(k)
        }, 40);
        var j = k.chart.container,
            q = k.rotate,
            p = k.chart,
            o = j.set();
        k.set = o;
        p.scrollbarsSet.push(o);
        var n, m;
        q ? (n = k.scrollbarHeight, m = p.plotAreaHeight) : (m = k.scrollbarHeight, n = p.plotAreaWidth);
        k.width = n;
        if ((k.height = m) && n) {
            var l = AmCharts.rect(j, n, m, k.backgroundColor, k.backgroundAlpha);
            k.bg = l;
            o.push(l);
            l = AmCharts.rect(j, n, m, "#000", 0.005);
            o.push(l);
            k.invisibleBg = l;
            l.click(function () {
                k.handleBgClick()
            }).mouseover(function () {
                k.handleMouseOver()
            }).mouseout(function () {
                k.handleMouseOut()
            }).touchend(function () {
                k.handleBgClick()
            });
            l = AmCharts.rect(j, n, m, k.selectedBackgroundColor, k.selectedBackgroundAlpha);
            k.selectedBG = l;
            o.push(l);
            n = AmCharts.rect(j, n, m, "#000", 0.005);
            k.dragger = n;
            o.push(n);
            n.mousedown(function (a) {
                k.handleDragStart(a)
            }).mouseup(function () {
                k.handleDragStop()
            }).mouseover(function () {
                k.handleDraggerOver()
            }).mouseout(function () {
                k.handleMouseOut()
            }).touchstart(function (a) {
                k.handleDragStart(a)
            }).touchend(function () {
                k.handleDragStop()
            });
            n = p.pathToImages;
            q ? (l = n + "dragIconH.gif", m = k.dragIconWidth, n = k.dragIconHeight) : (l = n + "dragIcon.gif", n = k.dragIconWidth, m = k.dragIconHeight);
            q = j.image(l, 0, 0, n, m);
            n = j.image(l, 0, 0, n, m);
            m = AmCharts.rect(j, 10, 20, "#000", 0.005);
            l = AmCharts.rect(j, 10, 20, "#000", 0.005);
            q = j.set([q, l]);
            j = j.set([n, m]);
            k.iconLeft = q;
            o.push(k.iconLeft);
            k.iconRight = j;
            o.push(j);
            q.mousedown(function () {
                k.leftDragStart()
            }).mouseup(function () {
                k.leftDragStop()
            }).mouseover(function () {
                k.iconRollOver()
            }).mouseout(function () {
                k.iconRollOut()
            }).touchstart(function () {
                k.leftDragStart()
            }).touchend(function () {
                k.leftDragStop()
            });
            j.mousedown(function () {
                k.rightDragStart()
            }).mouseup(function () {
                k.rightDragStop()
            }).mouseover(function () {
                k.iconRollOver()
            }).mouseout(function () {
                k.iconRollOut()
            }).touchstart(function () {
                k.rightDragStart()
            }).touchend(function () {
                k.rightDragStop()
            });
            AmCharts.ifArray(p.chartData) ? o.show() : o.hide();
            k.hideDragIcons()
        }
        o.translate(k.x, k.y);
        k.clipDragger(!1)
    },
    updateScrollbarSize: function (k, j) {
        var p = this.dragger,
            o, n, m, l;
        this.rotate ? (o = 0, n = k, m = this.width + 1, l = j - k, p.setAttr("height", j - k), p.setAttr("y", n)) : (o = k, n = 0, m = j - k, l = this.height + 1, p.setAttr("width", j - k), p.setAttr("x", o));
        this.clipAndUpdate(o, n, m, l)
    },
    updateScrollbar: function () {
        var G, F = !1,
            E, D, C = this.x,
            B = this.y,
            A = this.dragger,
            z = this.getDBox();
        E = z.x + C;
        D = z.y + B;
        var y = z.width,
            z = z.height,
            w = this.rotate,
            v = this.chart,
            r = this.width,
            q = this.height,
            u = v.mouseX,
            t = v.mouseY;
        G = this.initialMouse;
        v.mouseIsOver && (this.dragging && (v = this.initialCoord, w ? (G = v + (t - G), 0 > G && (G = 0), v = q - z, G > v && (G = v), A.setAttr("y", G)) : (G = v + (u - G), 0 > G && (G = 0), v = r - y, G > v && (G = v), A.setAttr("x", G))), this.resizingRight && (w ? (G = t - D, G + D > q + B && (G = q - D + B), 0 > G ? (this.resizingRight = !1, F = this.resizingLeft = !0) : (0 == G && (G = 0.1), A.setAttr("height", G))) : (G = u - E, G + E > r + C && (G = r - E + C), 0 > G ? (this.resizingRight = !1, F = this.resizingLeft = !0) : (0 == G && (G = 0.1), A.setAttr("width", G)))), this.resizingLeft && (w ? (E = D, D = t, D < B && (D = B), D > q + B && (D = q + B), G = !0 == F ? E - D : z + E - D, 0 > G ? (this.resizingRight = !0, this.resizingLeft = !1, A.setAttr("y", E + z - B)) : (0 == G && (G = 0.1), A.setAttr("y", D - B), A.setAttr("height", G))) : (D = u, D < C && (D = C), D > r + C && (D = r + C), G = !0 == F ? E - D : y + E - D, 0 > G ? (this.resizingRight = !0, this.resizingLeft = !1, A.setAttr("x", E + y - C)) : (0 == G && (G = 0.1), A.setAttr("x", D - C), A.setAttr("width", G)))), this.clipDragger(!0))
    },
    clipDragger: function (j) {
        var h = this.getDBox(),
            n = h.x,
            m = h.y,
            l = h.width,
            h = h.height,
            k = !1;
        if (this.rotate) {
            if (n = 0, l = this.width + 1, this.clipY != m || this.clipH != h) {
                k = !0
            }
        } else {
            if (m = 0, h = this.height + 1, this.clipX != n || this.clipW != l) {
                k = !0
            }
        }
        k && (this.clipAndUpdate(n, m, l, h), j && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
    },
    maskGraphs: function () {},
    clipAndUpdate: function (g, f, j, h) {
        this.clipX = g;
        this.clipY = f;
        this.clipW = j;
        this.clipH = h;
        this.selectedBG.clipRect(g, f, j, h);
        this.updateDragIconPositions();
        this.maskGraphs(g, f, j, h)
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) {
            this.skipEvent = !1
        } else {
            var h = this.chart;
            h.hideBalloon();
            var g = this.getDBox(),
                l = g.x,
                k = g.y,
                j = g.width,
                g = g.height;
            this.rotate ? (l = k, j = this.height / g) : j = this.width / j;
            h = {
                type: "zoomed",
                position: l,
                chart: h,
                target: this,
                multiplyer: j
            };
            this.fire(h.type, h)
        }
    },
    updateDragIconPositions: function () {
        var k = this.getDBox(),
            j = k.x,
            q = k.y,
            p = this.iconLeft,
            o = this.iconRight,
            n, m, l = this.scrollbarHeight;
        this.rotate ? (n = this.dragIconWidth, m = this.dragIconHeight, p.translate((l - m) / 2, q - n / 2), o.translate((l - m) / 2, q + k.height - n / 2)) : (n = this.dragIconHeight, m = this.dragIconWidth, p.translate(j - m / 2, (l - n) / 2), o.translate(j + -m / 2 + k.width, (l - n) / 2))
    },
    showDragIcons: function () {
        this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
    },
    hideDragIcons: function () {
        !this.resizingLeft && (!this.resizingRight && !this.dragging) && (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()), this.removeCursors())
    },
    removeCursors: function () {
        this.chart.setMouseCursor("auto")
    },
    relativeZoom: function (e, d) {
        this.dragger.stop();
        this.multiplyer = e;
        this.position = d;
        this.updateScrollbarSize(d, this.rotate ? d + this.height / e : d + this.width / e)
    },
    destroy: function () {
        this.clear();
        AmCharts.remove(this.set)
    },
    clear: function () {
        clearInterval(this.interval)
    },
    handleDragStart: function () {
        var e = this.chart;
        this.dragger.stop();
        this.removeCursors();
        this.dragging = !0;
        var d = this.getDBox();
        this.rotate ? (this.initialCoord = d.y, this.initialMouse = e.mouseY) : (this.initialCoord = d.x, this.initialMouse = e.mouseX)
    },
    handleDragStop: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
        this.dragging = !1;
        this.mouseIsOver && this.removeCursors();
        this.updateScrollbar()
    },
    handleDraggerOver: function () {
        this.handleMouseOver()
    },
    leftDragStart: function () {
        this.dragger.stop();
        this.resizingLeft = !0
    },
    leftDragStop: function () {
        this.resizingLeft = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    rightDragStart: function () {
        this.dragger.stop();
        this.resizingRight = !0
    },
    rightDragStop: function () {
        this.resizingRight = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    iconRollOut: function () {
        this.removeCursors()
    },
    iconRollOver: function () {
        this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
        this.handleMouseOver()
    },
    getDBox: function () {
        return this.dragger.getBBox()
    },
    handleBgClick: function () {
        if (!this.resizingRight && !this.resizingLeft) {
            this.zooming = !0;
            var t, r, q = this.scrollDuration,
                p = this.dragger;
            t = this.getDBox();
            var o = t.height,
                n = t.width;
            r = this.chart;
            var m = this.y,
                l = this.x,
                k = this.rotate;
            k ? (t = "y", r = r.mouseY - o / 2 - m, r = AmCharts.fitToBounds(r, 0, this.height - o)) : (t = "x", r = r.mouseX - n / 2 - l, r = AmCharts.fitToBounds(r, 0, this.width - n));
            this.updateOnReleaseOnly ? (this.skipEvent = !1, p.setAttr(t, r), this.dispatchScrollbarEvent(), this.clipDragger()) : (r = Math.round(r), k ? p.animate({
                y: r
            }, q, ">") : p.animate({
                x: r
            }, q, ">"))
        }
    },
    updateOnRelease: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
    },
    handleReleaseOutside: function () {
        if (this.set) {
            if (this.resizingLeft || this.resizingRight || this.dragging) {
                this.updateOnRelease(), this.removeCursors()
            }
            this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
            this.hideDragIcons();
            this.updateScrollbar()
        }
    },
    handleMouseOver: function () {
        this.mouseIsOver = !0;
        this.showDragIcons()
    },
    handleMouseOut: function () {
        this.mouseIsOver = !1;
        this.hideDragIcons()
    }
});
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar,
    construct: function () {
        AmCharts.ChartScrollbar.base.construct.call(this);
        this.graphLineColor = "#BBBBBB";
        this.graphLineAlpha = 0;
        this.graphFillColor = "#BBBBBB";
        this.graphFillAlpha = 1;
        this.selectedGraphLineColor = "#888888";
        this.selectedGraphLineAlpha = 0;
        this.selectedGraphFillColor = "#888888";
        this.selectedGraphFillAlpha = 1;
        this.gridCount = 0;
        this.gridColor = "#FFFFFF";
        this.gridAlpha = 0.7;
        this.skipEvent = this.autoGridCount = !1;
        this.color = "#FFFFFF";
        this.scrollbarCreated = !1
    },
    init: function () {
        var e = this.categoryAxis,
            d = this.chart;
        e || (this.categoryAxis = e = new AmCharts.CategoryAxis);
        e.chart = d;
        e.id = "scrollbar";
        e.dateFormats = d.categoryAxis.dateFormats;
        e.axisItemRenderer = AmCharts.RecItem;
        e.axisRenderer = AmCharts.RecAxis;
        e.guideFillRenderer = AmCharts.RecFill;
        e.inside = !0;
        e.fontSize = this.fontSize;
        e.tickLength = 0;
        e.axisAlpha = 0;
        if (this.graph && (e = this.valueAxis, e || (this.valueAxis = e = new AmCharts.ValueAxis, e.visible = !1, e.scrollbar = !0, e.axisItemRenderer = AmCharts.RecItem, e.axisRenderer = AmCharts.RecAxis, e.guideFillRenderer = AmCharts.RecFill, e.labelsEnabled = !1, e.chart = d), d = this.unselectedGraph, d || (d = new AmCharts.AmGraph, d.scrollbar = !0, this.unselectedGraph = d), d = this.selectedGraph, !d)) {
            d = new AmCharts.AmGraph, d.scrollbar = !0, this.selectedGraph = d
        }
        this.scrollbarCreated = !0
    },
    draw: function () {
        var K = this;
        AmCharts.ChartScrollbar.base.draw.call(K);
        K.scrollbarCreated || K.init();
        var J = K.chart,
            I = J.chartData,
            H = K.categoryAxis,
            G = K.rotate,
            F = K.x,
            E = K.y,
            D = K.width,
            C = K.height,
            B = J.categoryAxis,
            A = K.set;
        H.setOrientation(!G);
        H.parseDates = B.parseDates;
        H.rotate = G;
        H.equalSpacing = B.equalSpacing;
        H.minPeriod = B.minPeriod;
        H.startOnAxis = B.startOnAxis;
        H.viW = D;
        H.viH = C;
        H.width = D;
        H.height = C;
        H.gridCount = K.gridCount;
        H.gridColor = K.gridColor;
        H.gridAlpha = K.gridAlpha;
        H.color = K.color;
        H.autoGridCount = K.autoGridCount;
        H.parseDates && !H.equalSpacing && H.timeZoom(I[0].time, I[I.length - 1].time);
        H.zoom(0, I.length - 1);
        if (B = K.graph) {
            var w = K.valueAxis,
                v = B.valueAxis;
            w.id = v.id;
            w.rotate = G;
            w.setOrientation(G);
            w.width = D;
            w.height = C;
            w.viW = D;
            w.viH = C;
            w.dataProvider = I;
            w.reversed = v.reversed;
            w.logarithmic = v.logarithmic;
            w.gridAlpha = 0;
            w.axisAlpha = 0;
            A.push(w.set);
            G ? w.y = E : w.x = F;
            for (var F = Infinity, E = -Infinity, z = 0; z < I.length; z++) {
                var y = I[z].axes[v.id].graphs[B.id].values,
                    u;
                for (u in y) {
                    if ("percents" != u && "total" != u) {
                        var t = y[u];
                        t < F && (F = t);
                        t > E && (E = t)
                    }
                }
            }
            Infinity != F && (w.minimum = F); - Infinity != E && (w.maximum = E + 0.1 * (E - F));
            F == E && (w.minimum -= 1, w.maximum += 1);
            w.zoom(0, I.length - 1);
            u = K.unselectedGraph;
            u.id = B.id;
            u.rotate = G;
            u.chart = J;
            u.chartType = J.chartType;
            u.data = I;
            u.valueAxis = w;
            u.chart = B.chart;
            u.categoryAxis = K.categoryAxis;
            u.valueField = B.valueField;
            u.openField = B.openField;
            u.closeField = B.closeField;
            u.highField = B.highField;
            u.lowField = B.lowField;
            u.lineAlpha = K.graphLineAlpha;
            u.lineColor = K.graphLineColor;
            u.fillAlphas = K.graphFillAlpha;
            u.fillColors = K.graphFillColor;
            u.connect = B.connect;
            u.hidden = B.hidden;
            u.width = D;
            u.height = C;
            v = K.selectedGraph;
            v.id = B.id;
            v.rotate = G;
            v.chart = J;
            v.chartType = J.chartType;
            v.data = I;
            v.valueAxis = w;
            v.chart = B.chart;
            v.categoryAxis = H;
            v.valueField = B.valueField;
            v.openField = B.openField;
            v.closeField = B.closeField;
            v.highField = B.highField;
            v.lowField = B.lowField;
            v.lineAlpha = K.selectedGraphLineAlpha;
            v.lineColor = K.selectedGraphLineColor;
            v.fillAlphas = K.selectedGraphFillAlpha;
            v.fillColors = K.selectedGraphFillColor;
            v.connect = B.connect;
            v.hidden = B.hidden;
            v.width = D;
            v.height = C;
            J = K.graphType;
            J || (J = B.type);
            u.type = J;
            v.type = J;
            I = I.length - 1;
            u.zoom(0, I);
            v.zoom(0, I);
            v.set.click(function () {
                K.handleBackgroundClick()
            }).mouseover(function () {
                K.handleMouseOver()
            }).mouseout(function () {
                K.handleMouseOut()
            });
            u.set.click(function () {
                K.handleBackgroundClick()
            }).mouseover(function () {
                K.handleMouseOver()
            }).mouseout(function () {
                K.handleMouseOut()
            });
            A.push(u.set);
            A.push(v.set)
        }
        A.push(H.set);
        A.push(H.labelsSet);
        K.bg.toBack();
        K.invisibleBg.toFront();
        K.dragger.toFront();
        K.iconLeft.toFront();
        K.iconRight.toFront()
    },
    timeZoom: function (e, d) {
        this.startTime = e;
        this.endTime = d;
        this.timeDifference = d - e;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    zoom: function (e, d) {
        this.start = e;
        this.end = d;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    dispatchScrollbarEvent: function () {
        if (this.skipEvent) {
            this.skipEvent = !1
        } else {
            var k = this.chart.chartData,
                j, p, o = this.dragger.getBBox();
            j = o.x;
            p = o.y;
            var n = o.width,
                o = o.height;
            this.rotate ? (j = p, p = o) : p = n;
            n = {
                type: "zoomed",
                target: this
            };
            n.chart = this.chart;
            var o = this.categoryAxis,
                m = this.stepWidth;
            if (o.parseDates && !o.equalSpacing) {
                var k = k[0].time,
                    l = o.minDuration(),
                    o = Math.round(j / m) + k,
                    k = this.dragging ? o + this.timeDifference : Math.round((j + p) / m) + k - l;
                o > k && (o = k);
                if (o != this.startTime || k != this.endTime) {
                    this.startTime = o, this.endTime = k, n.start = o, n.end = k, n.startDate = new Date(o), n.endDate = new Date(k), this.fire(n.type, n)
                }
            } else {
                if (o.startOnAxis || (j += m / 2), p -= this.stepWidth / 2, m = o.xToIndex(j), j = o.xToIndex(j + p), m != this.start || this.end != j) {
                    o.startOnAxis && (this.resizingRight && m == j && j++, this.resizingLeft && m == j && (0 < m ? m-- : j = 1));
                    this.start = m;
                    this.end = this.dragging ? this.start + this.difference : j;
                    n.start = this.start;
                    n.end = this.end;
                    if (o.parseDates && (k[this.start] && (n.startDate = new Date(k[this.start].time)), k[this.end])) {
                        n.endDate = new Date(k[this.end].time)
                    }
                    this.fire(n.type, n)
                }
            }
        }
    },
    zoomScrollbar: function () {
        var g, f;
        f = this.chart.chartData;
        var j = this.categoryAxis,
            h;
        j.parseDates && !j.equalSpacing ? (h = j.stepWidth, f = f[0].time, g = h * (this.startTime - f), f = h * (this.endTime - f + j.minDuration())) : (g = f[this.start].x[j.id], f = f[this.end].x[j.id], h = j.stepWidth, j.startOnAxis || (j = h / 2, g -= j, f += j));
        this.stepWidth = h;
        this.updateScrollbarSize(g, f)
    },
    maskGraphs: function (h, g, l, k) {
        var j = this.selectedGraph;
        j && j.set.clipRect(h, g, l, k)
    },
    handleDragStart: function () {
        AmCharts.ChartScrollbar.base.handleDragStart.call(this);
        this.difference = this.end - this.start;
        this.timeDifference = this.endTime - this.startTime;
        0 > this.timeDifference && (this.timeDifference = 0)
    },
    handleBackgroundClick: function () {
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
        this.dragging || (this.difference = this.end - this.start, this.timeDifference = this.endTime - this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
    }
});
AmCharts.circle = function (k, j, q, p, o, n, m, l) {
    if (void 0 == o || 0 == o) {
        o = 1
    }
    void 0 == n && (n = "#000000");
    void 0 == m && (m = 0);
    p = {
        fill: q,
        stroke: n,
        "fill-opacity": p,
        "stroke-width": o,
        "stroke-opacity": m
    };
    k = k.circle(0, 0, j).attr(p);
    l && k.gradient("radialGradient", [q, AmCharts.adjustLuminosity(q, -0.6)]);
    return k
};
AmCharts.text = function (k, j, q, p, o, n, m, l) {
    n || (n = "middle");
    q = {
        fill: q,
        "font-family": p,
        "font-size": o,
        opacity: l
    };
    !0 == m && (q["font-weight"] = "bold");
    q["text-anchor"] = n;
    return k.text(j, q)
};
AmCharts.polygon = function (A, z, y, w, v, u, t, r, q) {
    isNaN(u) && (u = 0);
    isNaN(r) && (r = v);
    var p = w,
        n = !1;
    "object" == typeof p && 1 < p.length && (n = !0, p = p[0]);
    void 0 == t && (t = p);
    for (var v = {
        fill: p,
        stroke: t,
        "fill-opacity": v,
        "stroke-width": u,
        "stroke-opacity": r
    }, u = AmCharts.dx, t = AmCharts.dy, r = Math.round, p = "M" + (r(z[0]) + u) + "," + (r(y[0]) + t), m = 1; m < z.length; m++) {
        p += " L" + (r(z[m]) + u) + "," + (r(y[m]) + t)
    }
    A = A.path(p + " Z").attr(v);
    n && A.gradient("linearGradient", w, q);
    return A
};
AmCharts.rect = function (E, D, C, B, A, z, y, w, v, u) {
    isNaN(z) && (z = 0);
    void 0 == v && (v = 0);
    void 0 == u && (u = 270);
    isNaN(A) && (A = 0);
    var t = B,
        q = !1;
    "object" == typeof t && (t = t[0], q = !0);
    void 0 == y && (y = t);
    void 0 == w && (w = A);
    var D = Math.round(D),
        C = Math.round(C),
        n = 0,
        r = 0;
    0 > D && (D = Math.abs(D), n = -D);
    0 > C && (C = Math.abs(C), r = -C);
    n += AmCharts.dx;
    r += AmCharts.dy;
    A = {
        fill: t,
        stroke: y,
        "fill-opacity": A,
        "stroke-opacity": w
    };
    E = E.rect(n, r, D, C, v, z).attr(A);
    q && E.gradient("linearGradient", B, u);
    return E
};
AmCharts.triangle = function (t, r, q, p, o, n, m, l) {
    if (void 0 == n || 0 == n) {
        n = 1
    }
    void 0 == m && (m = "#000");
    void 0 == l && (l = 0);
    var p = {
        fill: p,
        stroke: m,
        "fill-opacity": o,
        "stroke-width": n,
        "stroke-opacity": l
    }, r = r / 2,
        k;
    0 == q && (k = " M" + -r + "," + r + " L0," + -r + " L" + r + "," + r + " Z");
    180 == q && (k = " M" + -r + "," + -r + " L0," + r + " L" + r + "," + -r + " Z");
    90 == q && (k = " M" + -r + "," + -r + " L" + r + ",0 L" + -r + "," + r + " Z");
    270 == q && (k = " M" + -r + ",0 L" + r + "," + r + " L" + r + "," + -r + " Z");
    return t.path(k).attr(p)
};
AmCharts.line = function (v, u, t, r, q, p, o, n, m) {
    p = {
        fill: "none",
        "stroke-width": p
    };
    void 0 != o && 0 < o && (p["stroke-dasharray"] = o);
    isNaN(q) || (p["stroke-opacity"] = q);
    r && (p.stroke = r);
    for (var r = Math.round, q = AmCharts.dx, o = AmCharts.dy, n = "M" + (r(u[0]) + q) + "," + (r(t[0]) + o), l = 1; l < u.length; l++) {
        n += " L" + (r(u[l]) + q) + "," + (r(t[l]) + o)
    }
    if (AmCharts.VML) {
        return v.path(n, void 0, !0).attr(p)
    }
    m && (n += " M0,0 L0,0");
    return v.path(n).attr(p)
};
AmCharts.wedge = function (Y, X, W, V, U, T, S, R, Q, P) {
    var O = Math.round,
        T = O(T),
        S = O(S),
        R = O(R),
        K = O(S / T * R),
        J = AmCharts.VML; - 359.9 >= U && (U = -359.9);
    var M = 1 / 180 * Math.PI,
        L = X + Math.cos(V * M) * R,
        H = W + Math.sin(-V * M) * K,
        G = X + Math.cos(V * M) * T,
        E = W + Math.sin(-V * M) * S,
        D = X + Math.cos((V + U) * M) * T,
        z = W + Math.sin((-V - U) * M) * S,
        y = X + Math.cos((V + U) * M) * R,
        M = W + Math.sin((-V - U) * M) * K,
        F = {
            fill: AmCharts.adjustLuminosity(P.fill, -0.2),
            "stroke-opacity": 0
        }, B = 0;
    180 < Math.abs(U) && (B = 1);
    var V = Y.set(),
        I;
    J && (L = O(10 * L), G = O(10 * G), D = O(10 * D), y = O(10 * y), H = O(10 * H), E = O(10 * E), z = O(10 * z), M = O(10 * M), X = O(10 * X), Q = O(10 * Q), W = O(10 * W), T *= 10, S *= 10, R *= 10, K *= 10, 1 > Math.abs(U) && (1 >= Math.abs(D - G) && 1 >= Math.abs(z - E)) && (I = !0));
    if (0 < Q) {
        var v;
        J ? (path = " M" + L + "," + (H + Q) + " L" + G + "," + (E + Q), I || (path += " A" + (X - T) + "," + (Q + W - S) + "," + (X + T) + "," + (Q + W + S) + "," + G + "," + (E + Q) + "," + D + "," + (z + Q)), path += " L" + y + "," + (M + Q), 0 < R && (I || (path += " B" + (X - R) + "," + (Q + W - K) + "," + (X + R) + "," + (Q + W + K) + "," + y + "," + (Q + M) + "," + L + "," + (Q + H)))) : (path = " M" + L + "," + (H + Q) + " L" + G + "," + (E + Q), path += " A" + T + "," + S + ",0," + B + ",1," + D + "," + (z + Q) + " L" + y + "," + (M + Q), 0 < R && (path += " A" + R + "," + K + ",0," + B + ",0," + L + "," + (H + Q)));
        path += " Z";
        c = Y.path(path, void 0, void 0, "1000,1000").attr(F);
        V.push(c);
        U = Y.path(" M" + L + "," + H + " L" + L + "," + (H + Q) + " L" + G + "," + (E + Q) + " L" + G + "," + E + " L" + L + "," + H + " Z", void 0, void 0, "1000,1000").attr(F);
        Q = Y.path(" M" + D + "," + z + " L" + D + "," + (z + Q) + " L" + y + "," + (M + Q) + " L" + y + "," + M + " L" + D + "," + z + " Z", void 0, void 0, "1000,1000").attr(F);
        V.push(U);
        V.push(Q)
    }
    J ? (I || (v = " A" + O(X - T) + "," + O(W - S) + "," + O(X + T) + "," + O(W + S) + "," + O(G) + "," + O(E) + "," + O(D) + "," + O(z)), T = " M" + O(L) + "," + O(H) + " L" + O(G) + "," + O(E) + v + " L" + O(y) + "," + O(M)) : T = " M" + L + "," + H + " L" + G + "," + E + (" A" + T + "," + S + ",0," + B + ",1," + D + "," + z) + " L" + y + "," + M;
    0 < R && (J ? I || (T += " B" + (X - R) + "," + (W - K) + "," + (X + R) + "," + (W + K) + "," + y + "," + M + "," + L + "," + H) : T += " A" + R + "," + K + ",0," + B + ",0," + L + "," + H);
    Y = Y.path(T + " Z", void 0, void 0, "1000,1000").attr(P);
    V.push(Y);
    return V
};
AmCharts.adjustLuminosity = function (h, g) {
    h = ("" + h).replace(/[^0-9a-f]/gi, "");
    6 > h.length && (h = "" + h[0] + ("" + h[0]) + ("" + h[1]) + ("" + h[1]) + ("" + h[2]) + ("" + h[2]));
    var g = g || 0,
        l = "#",
        k, j;
    for (j = 0; 3 > j; j++) {
        k = parseInt(h.substr(2 * j, 2), 16), k = Math.round(Math.min(Math.max(0, k + k * g), 255)).toString(16), l += ("00" + k).substr(k.length)
    }
    return l
};
AmCharts.AmPieChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function () {
        this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice");
        AmCharts.AmPieChart.base.construct.call(this);
        this.colors = "#FF0F00 #FF6600 #FF9E01 #FCD202 #F8FF01 #B0DE09 #04D215 #0D8ECF #0D52D1 #2A0CD0 #8A0CCF #CD0D74 #754DEB #DDDDDD #999999 #333333 #000000 #57032A #CA9726 #990000 #4B0C25".split(" ");
        this.pieAlpha = 1;
        this.pieBaseColor;
        this.pieBrightnessStep = 30;
        this.groupPercent = 0;
        this.groupedTitle = "Other";
        this.groupedPulled = !1;
        this.groupedAlpha = 1;
        this.marginLeft = 0;
        this.marginBottom = this.marginTop = 10;
        this.marginRight = 0;
        this.minRadius = 10;
        this.hoverAlpha = 1;
        this.depth3D = 0;
        this.startAngle = 90;
        this.angle = this.innerRadius = 0;
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 0;
        this.outlineThickness = 1;
        this.startRadius = "500%";
        this.startDuration = this.startAlpha = 1;
        this.startEffect = "bounce";
        this.sequencedAnimation = !1;
        this.pullOutRadius = "20%";
        this.pullOutDuration = 1;
        this.pullOutEffect = "bounce";
        this.pullOnHover = this.pullOutOnlyOne = !1;
        this.labelsEnabled = !0;
        this.labelRadius = 30;
        this.labelTickColor = "#000000";
        this.labelTickAlpha = 0.2;
        this.labelText = "[[title]]: [[percents]]%";
        this.hideLabelsPercent = 0;
        this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
        this.dataProvider;
        this.urlTarget = "_self";
        this.previousScale = 1;
        this.autoMarginOffset = 10
    },
    initChart: function () {
        AmCharts.AmPieChart.base.initChart.call(this);
        this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1, this.legend && this.legend.setData(this.chartData));
        this.drawChart()
    },
    handleLegendEvent: function (f) {
        var e = f.type;
        if (f = f.dataItem) {
            var g = f.hidden;
            switch (e) {
                case "clickMarker":
                    g || this.clickSlice(f);
                    break;
                case "clickLabel":
                    g || this.clickSlice(f);
                    break;
                case "rollOverItem":
                    g || this.rollOverSlice(f, !1);
                    break;
                case "rollOutItem":
                    g || this.rollOutSlice(f);
                    break;
                case "hideItem":
                    this.hideSlice(f);
                    break;
                case "showItem":
                    this.showSlice(f)
            }
        }
    },
    invalidateVisibility: function () {
        this.recalculatePercents();
        this.initChart();
        var b = this.legend;
        b && b.invalidateSize()
    },
    drawChart: function () {
        var P = this;
        AmCharts.AmPieChart.base.drawChart.call(P);
        var O = P.chartData;
        if (AmCharts.ifArray(O)) {
            AmCharts.VML && (P.startAlpha = 1);
            var N = P.startDuration,
                M = P.container,
                L = P.updateWidth();
            P.realWidth = L;
            var K = P.updateHeight();
            P.realHeight = K;
            var J = AmCharts.toCoordinate,
                I = J(P.marginLeft, L),
                H = J(P.marginRight, L),
                G = J(P.marginTop, K) + P.getTitleHeight(),
                F = J(P.marginBottom, K);
            P.chartDataLabels = [];
            P.ticks = [];
            var C, B, E, D = AmCharts.toNumber(P.labelRadius),
                A = P.measureMaxLabel();
            if (!P.labelText || !P.labelsEnabled) {
                D = A = 0
            }
            C = void 0 == P.pieX ? (L - I - H) / 2 + I : J(P.pieX, P.realWidth);
            B = void 0 == P.pieY ? (K - G - F) / 2 + G : J(P.pieY, K);
            E = J(P.radius, L, K);
            P.pullOutRadiusReal = AmCharts.toCoordinate(P.pullOutRadius, E);
            E || (L = 0 <= D ? L - I - H - 2 * A : L - I - H, K = K - G - F, E = Math.min(L, K), K < L && (E /= 1 - P.angle / 90, E > L && (E = L)), P.pullOutRadiusReal = AmCharts.toCoordinate(P.pullOutRadius, E), E = 0 <= D ? E - 1.8 * (D + P.pullOutRadiusReal) : E - 1.8 * P.pullOutRadiusReal, E /= 2);
            E < P.minRadius && (E = P.minRadius);
            P.pullOutRadiusReal = J(P.pullOutRadius, E);
            J = J(P.innerRadius, E);
            J >= E && (J = E - 1);
            K = AmCharts.fitToBounds(P.startAngle, 0, 360);
            0 < P.depth3D && (K = 270 <= K ? 270 : 90);
            G = E - E * P.angle / 90;
            for (F = 0; F < O.length; F++) {
                if (L = O[F], !0 != L.hidden && 0 < L.percents) {
                    var z = 360 * -L.percents / 100,
                        H = Math.cos((K + z / 2) / 180 * Math.PI),
                        A = Math.sin((-K - z / 2) / 180 * Math.PI) * (G / E),
                        I = {
                            fill: L.color,
                            stroke: P.outlineColor,
                            "stroke-width": P.outlineThickness,
                            "stroke-opacity": P.outlineAlpha
                        };
                    L.url && (I.cursor = "pointer");
                    I = AmCharts.wedge(M, C, B, K, z, E, G, J, P.depth3D, I);
                    P.addEventListeners(I, L);
                    L.startAngle = K;
                    O[F].wedge = I;
                    if (0 < N) {
                        var y = P.startAlpha;
                        P.chartCreated && (y = L.alpha);
                        I.setAttr("opacity", y)
                    }
                    L.ix = H;
                    L.iy = A;
                    L.wedge = I;
                    L.index = F;
                    if (P.labelsEnabled && P.labelText && L.percents >= P.hideLabelsPercent) {
                        z = K + z / 2;
                        0 >= z && (z += 360);
                        var H = C + H * (E + D),
                            y = B + A * (E + D),
                            v, A = 0;
                        if (0 <= D) {
                            var u;
                            90 >= z && 0 <= z ? (u = 0, v = "start", A = 8) : 360 >= z && 270 < z ? (u = 1, v = "start", A = 8) : 270 >= z && 180 < z ? (u = 2, v = "end", A = -8) : 180 >= z && 90 < z && (u = 3, v = "end", A = -8);
                            L.labelQuarter = u
                        } else {
                            v = "middle"
                        }
                        z = P.formatString(P.labelText, L);
                        z = AmCharts.text(M, z, P.color, P.fontFamily, P.fontSize, v);
                        z.translate(H + 1.5 * A, y);
                        L.tx = H + 1.5 * A;
                        L.ty = y;
                        y = setTimeout(function () {
                            P.showLabels.call(P)
                        }, 1000 * N);
                        P.timeOuts.push(y);
                        0 <= P.labelRadius ? I.push(z) : P.freeLabelsSet.push(z);
                        L.label = z;
                        P.chartDataLabels[F] = z;
                        L.tx = H;
                        L.tx2 = H + A
                    }
                    P.graphsSet.push(I);
                    (0 == L.alpha || 0 < N && !P.chartCreated) && I.hide();
                    K -= 360 * L.percents / 100;
                    0 >= K && (K += 360)
                }
            }
            0 < D && P.arrangeLabels();
            P.pieXReal = C;
            P.pieYReal = B;
            P.radiusReal = E;
            P.innerRadiusReal = J;
            0 < D && P.drawTicks();
            P = this;
            P.chartCreated ? P.pullSlices(!0) : (y = setTimeout(function () {
                P.pullSlices.call(P)
            }, 1200 * N), P.timeOuts.push(y));
            P.chartCreated || P.startSlices();
            P.chartCreated = !0;
            P.dispDUpd()
        }
        P.setDepths()
    },
    setDepths: function () {
        for (var g = this.chartData, f = 0; f < g.length; f++) {
            var j = g[f],
                h = j.wedge,
                j = j.startAngle;
            90 >= j && 0 <= j || 360 >= j && 270 < j ? h.toFront() : (270 >= j && 180 < j || 180 >= j && 90 < j) && h.toBack()
        }
    },
    addEventListeners: function (f, e) {
        var g = this;
        f.mouseover(function () {
            g.rollOverSlice(e, !0)
        }).mouseout(function () {
            g.rollOutSlice(e)
        }).click(function () {
            g.clickSlice(e)
        })
    },
    formatString: function (e, d) {
        e = AmCharts.formatValue(e, d, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        e = AmCharts.formatValue(e, d, ["percents"], this.percentFormatter);
        e = AmCharts.massReplace(e, {
            "[[title]]": d.title,
            "[[description]]": d.description,
            "<br>": "\n"
        });
        return e = AmCharts.cleanFromEmpty(e)
    },
    drawTicks: function () {
        for (var h = this.chartData, g = 0; g < h.length; g++) {
            if (this.chartDataLabels[g]) {
                var l = h[g],
                    k = l.ty,
                    j = this.radiusReal,
                    k = AmCharts.line(this.container, [this.pieXReal + l.ix * j, l.tx, l.tx2], [this.pieYReal + l.iy * j, k, k], this.labelTickColor, this.labelTickAlpha);
                l.wedge.push(k);
                this.ticks[g] = k
            }
        }
    },
    arrangeLabels: function () {
        for (var g = this.chartData, f = g.length, j, h = f - 1; 0 <= h; h--) {
            j = g[h], 0 == j.labelQuarter && !j.hidden && this.checkOverlapping(h, j, 0, !0, 0)
        }
        for (h = 0; h < f; h++) {
            j = g[h], 1 == j.labelQuarter && !j.hidden && this.checkOverlapping(h, j, 1, !1, 0)
        }
        for (h = f - 1; 0 <= h; h--) {
            j = g[h], 2 == j.labelQuarter && !j.hidden && this.checkOverlapping(h, j, 2, !0, 0)
        }
        for (h = 0; h < f; h++) {
            j = g[h], 3 == j.labelQuarter && !j.hidden && this.checkOverlapping(h, j, 3, !1, 0)
        }
    },
    checkOverlapping: function (v, u, t, r, q) {
        var p, o, n = this.chartData,
            m = n.length,
            l = u.label;
        if (l) {
            if (!0 == r) {
                for (o = v + 1; o < m; o++) {
                    (p = this.checkOverlappingReal(u, n[o], t)) && (o = m)
                }
            } else {
                for (o = v - 1; 0 <= o; o--) {
                    (p = this.checkOverlappingReal(u, n[o], t)) && (o = 0)
                }
            }!0 == p && 100 > q && (p = u.ty + 3 * u.iy, u.ty = p, l.translate(u.tx2, p), this.checkOverlapping(v, u, t, r, q + 1))
        }
    },
    checkOverlappingReal: function (j, h, n) {
        var m = !1,
            l = j.label,
            k = h.label;
        j.labelQuarter == n && (!j.hidden && !h.hidden && k) && (l = l.getBBox(), n = {}, n.width = l.width, n.height = l.height, n.y = j.ty, n.x = j.tx, j = k.getBBox(), k = {}, k.width = j.width, k.height = j.height, k.y = h.ty, k.x = h.tx, AmCharts.hitTest(n, k) && (m = !0));
        return m
    },
    startSlices: function () {
        for (var g = this, f = 500 * (g.startDuration / g.chartData.length), j = 0; j < g.chartData.length; j++) {
            if (0 < g.startDuration && g.sequencedAnimation) {
                var h = setTimeout(function () {
                    g.startSequenced.call(g)
                }, f * j);
                g.timeOuts.push(h)
            } else {
                g.startSlice(g.chartData[j])
            }
        }
    },
    pullSlices: function (g) {
        for (var f = this.chartData, j = 0; j < f.length; j++) {
            var h = f[j];
            h.pulled && this.pullSlice(h, 1, g)
        }
    },
    startSequenced: function () {
        for (var e = this.chartData, d = 0; d < e.length; d++) {
            if (!e[d].started) {
                this.startSlice(this.chartData[d]);
                break
            }
        }
    },
    startSlice: function (g) {
        g.started = !0;
        var f = g.wedge,
            j = this.startDuration;
        if (f && 0 < j) {
            0 < g.alpha && f.show();
            var h = AmCharts.toCoordinate(this.startRadius, this.radiusReal);
            f.translate(Math.round(g.ix * h), Math.round(g.iy * h));
            f.animate({
                opacity: g.alpha,
                translate: "0,0"
            }, j, this.startEffect)
        }
    },
    showLabels: function () {
        for (var f = this.chartData, e = 0; e < f.length; e++) {
            if (0 < f[e].alpha) {
                var g = this.chartDataLabels[e];
                g && g.show();
                (g = this.ticks[e]) && g.show()
            }
        }
    },
    showSlice: function (b) {
        isNaN(b) ? b.hidden = !1 : this.chartData[b].hidden = !1;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    hideSlice: function (b) {
        isNaN(b) ? b.hidden = !0 : this.chartData[b].hidden = !0;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    rollOverSlice: function (j, h) {
        isNaN(j) || (j = this.chartData[j]);
        clearTimeout(this.hoverInt);
        this.pullOnHover && this.pullSlice(j, 1);
        var n = this.innerRadiusReal + (this.radiusReal - this.innerRadiusReal) / 2;
        j.pulled && (n += this.pullOutRadiusReal);
        1 > this.hoverAlpha && j.wedge && j.wedge.attr({
            opacity: this.hoverAlpha
        });
        var m;
        m = j.ix * n + this.pieXReal;
        var n = j.iy * n + this.pieYReal,
            l = this.formatString(this.balloonText, j),
            k = AmCharts.adjustLuminosity(j.color, -0.15);
        this.showBalloon(l, k, h, m, n);
        m = {
            type: "rollOverSlice",
            dataItem: j,
            chart: this
        };
        this.fire(m.type, m)
    },
    rollOutSlice: function (b) {
        isNaN(b) || (b = this.chartData[b]);
        b.wedge && b.wedge.attr({
            opacity: b.alpha
        });
        this.hideBalloon();
        b = {
            type: "rollOutSlice",
            dataItem: b,
            chart: this
        };
        this.fire(b.type, b)
    },
    clickSlice: function (b) {
        isNaN(b) || (b = this.chartData[b]);
        this.hideBalloon();
        b.pulled ? this.pullSlice(b, 0) : this.pullSlice(b, 1);
        AmCharts.getURL(b.url, this.urlTarget);
        b = {
            type: "clickSlice",
            dataItem: b,
            chart: this
        };
        this.fire(b.type, b)
    },
    pullSlice: function (k, j, p) {
        var o = k.ix,
            n = k.iy,
            m = this.pullOutDuration;
        !0 === p && (m = 0);
        var p = k.wedge,
            l = this.pullOutRadiusReal;
        p && p.animate({
            translate: j * o * l + "," + j * n * l
        }, m, this.pullOutEffect);
        1 == j ? (k.pulled = !0, this.pullOutOnlyOne && this.pullInAll(k.index), k = {
            type: "pullOutSlice",
            dataItem: k,
            chart: this
        }) : (k.pulled = !1, k = {
            type: "pullInSlice",
            dataItem: k,
            chart: this
        });
        this.fire(k.type, k)
    },
    pullInAll: function (f) {
        for (var e = this.chartData, g = 0; g < this.chartData.length; g++) {
            g != f && e[g].pulled && this.pullSlice(e[g], 0)
        }
    },
    pullOutAll: function () {
        for (var e = this.chartData, d = 0; d < e.length; d++) {
            e[d].pulled || this.pullSlice(e[d], 1)
        }
    },
    parseData: function () {
        var k = [];
        this.chartData = k;
        var j = this.dataProvider;
        if (void 0 != j) {
            for (var q = j.length, p = 0, o = 0; o < q; o++) {
                var n = {}, m = j[o];
                n.dataContext = m;
                n.value = Number(m[this.valueField]);
                var l = m[this.titleField];
                l || (l = "");
                n.title = l;
                n.pulled = AmCharts.toBoolean(m[this.pulledField], !1);
                (l = m[this.descriptionField]) || (l = "");
                n.description = l;
                n.url = m[this.urlField];
                n.visibleInLegend = AmCharts.toBoolean(m[this.visibleInLegendField], !0);
                l = m[this.alphaField];
                n.alpha = void 0 != l ? Number(l) : this.pieAlpha;
                m = m[this.colorField];
                void 0 != m && (n.color = AmCharts.toColor(m));
                p += n.value;
                n.hidden = !1;
                k[o] = n
            }
            for (o = j = 0; o < q; o++) {
                n = k[o], n.percents = 100 * (n.value / p), n.percents < this.groupPercent && j++
            }
            1 < j && (this.groupValue = 0, this.removeSmallSlices(), k.push({
                title: this.groupedTitle,
                value: this.groupValue,
                percents: 100 * (this.groupValue / p),
                pulled: this.groupedPulled,
                color: this.groupedColor,
                url: this.groupedUrl,
                description: this.groupedDescription,
                alpha: this.groupedAlpha
            }));
            for (o = 0; o < k.length; o++) {
                if (this.pieBaseColor ? m = AmCharts.adjustLuminosity(this.pieBaseColor, o * this.pieBrightnessStep / 100) : (m = this.colors[o], void 0 == m && (m = AmCharts.randomColor())), void 0 == k[o].color) {
                    k[o].color = m
                }
            }
            this.recalculatePercents()
        }
    },
    recalculatePercents: function () {
        for (var g = this.chartData, f = 0, j = 0; j < g.length; j++) {
            var h = g[j];
            !h.hidden && 0 < h.value && (f += h.value)
        }
        for (j = 0; j < g.length; j++) {
            h = this.chartData[j], h.percents = !h.hidden && 0 < h.value ? 100 * h.value / f : 0
        }
    },
    removeSmallSlices: function () {
        for (var e = this.chartData, d = e.length - 1; 0 <= d; d--) {
            e[d].percents < this.groupPercent && (this.groupValue += e[d].value, e.splice(d, 1))
        }
    },
    animateAgain: function () {
        var e = this;
        e.startSlices();
        var d = setTimeout(function () {
            e.pullSlices.call(e)
        }, 1200 * e.startDuration);
        e.timeOuts.push(d)
    },
    measureMaxLabel: function () {
        for (var h = this.chartData, g = 0, l = 0; l < h.length; l++) {
            var k = this.formatString(this.labelText, h[l]),
                k = AmCharts.text(this.container, k, this.color, this.fontFamily, this.fontSize),
                j = k.getBBox().width;
            j > g && (g = j);
            k.remove()
        }
        return g
    }
});
AmCharts.AmXYChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart,
    construct: function () {
        AmCharts.AmXYChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.xAxes;
        this.yAxes;
        this.scrollbarV;
        this.scrollbarH;
        this.maxZoomFactor = 20;
        this.chartType = "xy"
    },
    initChart: function () {
        AmCharts.AmXYChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins());
        var g = this.marginLeftReal,
            f = this.marginTopReal,
            j = this.plotAreaWidth,
            h = this.plotAreaHeight;
        this.graphsSet.clipRect(g, f, j, h);
        this.bulletSet.clipRect(g, f, j, h);
        this.trendLinesSet.clipRect(g, f, j, h)
    },
    createValueAxes: function () {
        var j = [],
            h = [];
        this.xAxes = j;
        this.yAxes = h;
        for (var n = this.valueAxes, m = 0; m < n.length; m++) {
            var l = n[m],
                k = l.position;
            if ("top" == k || "bottom" == k) {
                l.rotate = !0
            }
            l.setOrientation(l.rotate);
            k = l.orientation;
            "V" == k && h.push(l);
            "H" == k && j.push(l)
        }
        0 == h.length && (l = new AmCharts.ValueAxis, l.rotate = !1, l.setOrientation(!1), n.push(l), h.push(l));
        0 == j.length && (l = new AmCharts.ValueAxis, l.rotate = !0, l.setOrientation(!0), n.push(l), j.push(l));
        for (m = 0; m < n.length; m++) {
            this.processValueAxis(n[m], m)
        }
        j = this.graphs;
        for (m = 0; m < j.length; m++) {
            this.processGraph(j[m], m)
        }
    },
    drawChart: function () {
        AmCharts.AmXYChart.base.drawChart.call(this);
        AmCharts.ifArray(this.chartData) ? (this.chartScrollbar && (this.updateScrollbars(), this.scrollbarH.draw(), this.scrollbarV.draw()), this.zoomChart()) : this.cleanChart();
        this.chartCreated = !0;
        this.dispDUpd()
    },
    cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.scrollbarV, this.scrollbarH, this.chartCursor])
    },
    zoomChart: function () {
        this.toggleZoomOutButton();
        this.zoomObjects(this.valueAxes);
        this.zoomObjects(this.graphs);
        this.zoomTrendLines();
        this.dispatchAxisZoom()
    },
    toggleZoomOutButton: function () {
        1 == this.heightMultiplyer && 1 == this.widthMultiplyer ? this.showZB(!1) : this.showZB(!0)
    },
    dispatchAxisZoom: function () {
        for (var j = this.valueAxes, h = 0; h < j.length; h++) {
            var n = j[h];
            if (!isNaN(n.min) && !isNaN(n.max)) {
                var m, l;
                "V" == n.orientation ? (m = n.coordinateToValue(-this.verticalPosition), l = n.coordinateToValue(-this.verticalPosition + this.plotAreaHeight)) : (m = n.coordinateToValue(-this.horizontalPosition), l = n.coordinateToValue(-this.horizontalPosition + this.plotAreaWidth));
                if (!isNaN(m) && !isNaN(l)) {
                    if (m > l) {
                        var k = l;
                        l = m;
                        m = k
                    }
                    n.dispatchZoomEvent(m, l)
                }
            }
        }
    },
    zoomObjects: function (g) {
        for (var f = g.length, j = 0; j < f; j++) {
            var h = g[j];
            this.updateObjectSize(h);
            h.zoom(0, this.chartData.length - 1)
        }
    },
    updateData: function () {
        this.parseData();
        for (var v = this.chartData, u = v.length - 1, t = this.graphs, r = this.dataProvider, q = 0; q < t.length; q++) {
            var p = t[q];
            p.data = v;
            p.zoom(0, u);
            var o = p.valueField,
                n = 0;
            if (o) {
                for (var m = 0; m < r.length; m++) {
                    var l = r[m][o];
                    l > n && (n = l)
                }
            }
            p.maxValue = n
        }
        if (v = this.chartCursor) {
            v.updateData(), v.type = "crosshair", v.valueBalloonsEnabled = !1
        }
    },
    zoomOut: function () {
        this.verticalPosition = this.horizontalPosition = 0;
        this.heightMultiplyer = this.widthMultiplyer = 1;
        this.zoomChart();
        this.zoomScrollbars()
    },
    processValueAxis: function (b) {
        b.chart = this;
        b.minMaxField = "H" == b.orientation ? "x" : "y";
        b.minTemp = NaN;
        b.maxTemp = NaN;
        this.listenTo(b, "axisSelfZoomed", this.handleAxisSelfZoom)
    },
    processGraph: function (b) {
        b.xAxis || (b.xAxis = this.xAxes[0]);
        b.yAxis || (b.yAxis = this.yAxes[0])
    },
    parseData: function () {
        AmCharts.AmXYChart.base.parseData.call(this);
        this.chartData = [];
        for (var E = this.dataProvider, D = this.valueAxes, C = this.graphs, B = 0; B < E.length; B++) {
            for (var A = {
                axes: {},
                x: {},
                y: {}
            }, z = E[B], y = 0; y < D.length; y++) {
                var w = D[y].id;
                A.axes[w] = {};
                A.axes[w].graphs = {};
                for (var v = 0; v < C.length; v++) {
                    var u = C[v],
                        t = u.id;
                    if (u.xAxis.id == w || u.yAxis.id == w) {
                        var q = {};
                        q.serialDataItem = A;
                        q.index = B;
                        var n = {}, r = Number(z[u.valueField]);
                        isNaN(r) || (n.value = r);
                        r = Number(z[u.xField]);
                        isNaN(r) || (n.x = r);
                        r = Number(z[u.yField]);
                        isNaN(r) || (n.y = r);
                        q.values = n;
                        this.processFields(u, q, z);
                        q.serialDataItem = A;
                        q.graph = u;
                        A.axes[w].graphs[t] = q
                    }
                }
            }
            this.chartData[B] = A
        }
    },
    formatString: function (f, e) {
        var g = e.graph.numberFormatter;
        g || (g = this.numberFormatter);
        f = AmCharts.formatValue(f, e.values, ["value", "x", "y"], g); - 1 != f.indexOf("[[") && (f = AmCharts.formatDataContextValue(f, e.dataContext));
        return f = AmCharts.AmSerialChart.base.formatString.call(this, f, e)
    },
    addChartScrollbar: function (g) {
        AmCharts.callMethod("destroy", [this.chartScrollbar, this.scrollbarH, this.scrollbarV]);
        if (g) {
            var f = new AmCharts.SimpleChartScrollbar,
                j = new AmCharts.SimpleChartScrollbar;
            f.skipEvent = !0;
            j.skipEvent = !0;
            f.chart = this;
            j.chart = this;
            this.listenTo(f, "zoomed", this.handleVSBZoom);
            this.listenTo(j, "zoomed", this.handleHSBZoom);
            var h = "backgroundColor backgroundAlpha selectedBackgroundColor selectedBackgroundAlpha scrollDuration resizeEnabled hideResizeGrips scrollbarHeight updateOnReleaseOnly".split(" ");
            AmCharts.copyProperties(g, f, h);
            AmCharts.copyProperties(g, j, h);
            f.rotate = !0;
            j.rotate = !1;
            this.scrollbarHeight = g.scrollbarHeight;
            this.scrollbarH = j;
            this.scrollbarV = f;
            this.chartScrollbar = g
        }
    },
    updateTrendLines: function () {
        for (var f = this.trendLines, e = 0; e < f.length; e++) {
            var g = f[e];
            g.chart = this;
            g.valueAxis || (g.valueAxis = this.yAxes[0]);
            g.valueAxisX || (g.valueAxisX = this.xAxes[0])
        }
    },
    updateMargins: function () {
        AmCharts.AmXYChart.base.updateMargins.call(this);
        var b = this.scrollbarV;
        b && (this.getScrollbarPosition(b, !0, this.yAxes[0].position), this.adjustMargins(b, !0));
        if (b = this.scrollbarH) {
            this.getScrollbarPosition(b, !1, this.xAxes[0].position), this.adjustMargins(b, !1)
        }
    },
    updateScrollbars: function () {
        this.updateChartScrollbar(this.scrollbarV, !0);
        this.updateChartScrollbar(this.scrollbarH, !1)
    },
    zoomScrollbars: function () {
        var b = this.scrollbarH;
        b && b.relativeZoom(this.widthMultiplyer, -this.horizontalPosition / this.widthMultiplyer);
        (b = this.scrollbarV) && b.relativeZoom(this.heightMultiplyer, -this.verticalPosition / this.heightMultiplyer)
    },
    fitMultiplyer: function (b) {
        b > this.maxZoomFactor && (b = this.maxZoomFactor);
        return b
    },
    handleHSBZoom: function (f) {
        var e = this.fitMultiplyer(f.multiplyer),
            f = -f.position * e,
            g = -(this.plotAreaWidth * e - this.plotAreaWidth);
        f < g && (f = g);
        this.widthMultiplyer = e;
        this.horizontalPosition = f;
        this.zoomChart()
    },
    handleVSBZoom: function (f) {
        var e = this.fitMultiplyer(f.multiplyer),
            f = -f.position * e,
            g = -(this.plotAreaHeight * e - this.plotAreaHeight);
        f < g && (f = g);
        this.heightMultiplyer = e;
        this.verticalPosition = f;
        this.zoomChart()
    },
    handleCursorZoom: function (f) {
        var e = this.widthMultiplyer * this.plotAreaWidth / f.selectionWidth,
            g = this.heightMultiplyer * this.plotAreaHeight / f.selectionHeight,
            e = this.fitMultiplyer(e),
            g = this.fitMultiplyer(g);
        this.horizontalPosition = (this.horizontalPosition - f.selectionX) * e / this.widthMultiplyer;
        this.verticalPosition = (this.verticalPosition - f.selectionY) * g / this.heightMultiplyer;
        this.widthMultiplyer = e;
        this.heightMultiplyer = g;
        this.zoomChart();
        this.zoomScrollbars()
    },
    handleAxisSelfZoom: function (f) {
        if ("H" == f.valueAxis.orientation) {
            var e = this.fitMultiplyer(f.multiplyer),
                f = -f.position / this.widthMultiplyer * e,
                g = -(this.plotAreaWidth * e - this.plotAreaWidth);
            f < g && (f = g);
            this.horizontalPosition = f;
            this.widthMultiplyer = e
        } else {
            e = this.fitMultiplyer(f.multiplyer), f = -f.position / this.heightMultiplyer * e, g = -(this.plotAreaHeight * e - this.plotAreaHeight), f < g && (f = g), this.verticalPosition = f, this.heightMultiplyer = e
        }
        this.zoomChart();
        this.zoomScrollbars()
    },
    removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.scrollbarH, this.scrollbarV]);
        this.scrollbarV = this.scrollbarH = null
    },
    handleReleaseOutside: function (b) {
        AmCharts.AmXYChart.base.handleReleaseOutside.call(this, b);
        AmCharts.callMethod("handleReleaseOutside", [this.scrollbarH, this.scrollbarV])
    }
});
AmCharts.AmDraw = AmCharts.Class({
    construct: function (g, f, j) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
        AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
        1 > f && (f = 10);
        1 > j && (j = 10);
        this.div = g;
        this.width = f;
        this.height = j;
        this.rBin = document.createElement("div");
        if (AmCharts.hasSVG) {
            var h = this.createSvgElement("svg");
            h.style.position = "absolute";
            h.style.width = f + "px";
            h.style.height = j + "px";
            h.setAttribute("version", "1.1");
            g.appendChild(h);
            this.container = h;
            this.R = new AmCharts.SVGRenderer(this)
        } else {
            AmCharts.isIE && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("v", "urn:schemas-microsoft-com:vml"), f = document.createStyleSheet(), f.addRule("v\\:shape", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:polyline", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:roundrect", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:stroke", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:fill", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:oval", "behavior:url(#default#VML); display:inline-block; antialias:true"), f.addRule("v\\:curve", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = f), this.container = g, this.R = new AmCharts.VMLRenderer(this), this.R.disableSelection(g))
        }
    },
    createSvgElement: function (b) {
        return document.createElementNS(AmCharts.SVG_NS, b)
    },
    circle: function (h, g, l, k) {
        var j = new AmCharts.AmDObject("circle", this);
        j.attr({
            r: l,
            cx: h,
            cy: g
        });
        this.addToContainer(j.node, k);
        return j
    },
    setSize: function () {},
    rect: function (k, j, q, p, o, n, m) {
        var l = new AmCharts.AmDObject("rect", this);
        AmCharts.VML && (o = 100 * o / Math.min(q, p), q += 2 * n, p += 2 * n, l.bw = n, l.node.style.marginLeft = -n, l.node.style.marginTop = -n);
        1 > q && (q = 1);
        1 > p && (p = 1);
        l.attr({
            x: k,
            y: j,
            width: q,
            height: p,
            rx: o,
            ry: o,
            "stroke-width": n
        });
        this.addToContainer(l.node, m);
        return l
    },
    image: function (k, j, p, o, n, m) {
        var l = new AmCharts.AmDObject("image", this);
        l.attr({
            x: j,
            y: p,
            width: o,
            height: n
        });
        this.R.path(l, k);
        this.addToContainer(l.node, m);
        return l
    },
    addToContainer: function (e, d) {
        d || (d = this.container);
        d.appendChild(e)
    },
    text: function (f, e, g) {
        return this.R.text(f, e, g)
    },
    path: function (h, g, l, k) {
        var j = new AmCharts.AmDObject("path", this);
        k || (k = "100,100");
        j.attr({
            cs: k
        });
        l ? j.attr({
            dd: h
        }) : j.attr({
            d: h
        });
        this.addToContainer(j.node, g);
        return j
    },
    set: function (b) {
        return this.R.set(b)
    },
    remove: function (e) {
        if (e) {
            var d = this.rBin;
            d.appendChild(e);
            d.innerHTML = ""
        }
    },
    bounce: function (h, g, l, k, j) {
        return (g /= j) < 1 / 2.75 ? k * 7.5625 * g * g + l : g < 2 / 2.75 ? k * (7.5625 * (g -= 1.5 / 2.75) * g + 0.75) + l : g < 2.5 / 2.75 ? k * (7.5625 * (g -= 2.25 / 2.75) * g + 0.9375) + l : k * (7.5625 * (g -= 2.625 / 2.75) * g + 0.984375) + l
    },
    easeInSine: function (h, g, l, k, j) {
        return -k * Math.cos(g / j * (Math.PI / 2)) + k + l
    },
    easeOutSine: function (h, g, l, k, j) {
        return k * Math.sin(g / j * (Math.PI / 2)) + l
    },
    easeOutElastic: function (k, j, p, o, n) {
        var k = 1.70158,
            m = 0,
            l = o;
        if (0 == j) {
            return p
        }
        if (1 == (j /= n)) {
            return p + o
        }
        m || (m = 0.3 * n);
        l < Math.abs(o) ? (l = o, k = m / 4) : k = m / (2 * Math.PI) * Math.asin(o / l);
        return l * Math.pow(2, -10 * j) * Math.sin((j * n - k) * 2 * Math.PI / m) + o + p
    },
    renderFix: function () {
        var e = this.container,
            d = e.style;
        d.left = "0px";
        d.top = "0px";
        e = e.getScreenCTM() || e.createSVGMatrix();
        d.left = -(e.e - Math.floor(e.e)) + "px";
        d.top = -(e.f - Math.floor(e.f)) + "px"
    }
});
AmCharts.AmDObject = AmCharts.Class({
    construct: function (e, d) {
        this.D = d;
        this.R = d.R;
        this.node = this.R.create(this, e);
        this.children = []
    },
    attr: function (b) {
        this.R.attr(this, b);
        return this
    },
    getAttr: function (b) {
        return this.node.getAttribute(b)
    },
    setAttr: function (e, d) {
        this.R.setAttr(this, e, d);
        return this
    },
    clipRect: function (g, f, j, h) {
        this.R.clipRect(this, g, f, j, h)
    },
    translate: function (e, d) {
        this.R.move(this, Math.round(e), Math.round(d))
    },
    rotate: function (b) {
        this.R.rotate(this, b)
    },
    animate: function (j, h, n) {
        for (var m in j) {
            var l = m,
                k = j[m],
                n = AmCharts.getEffect(n);
            this.R.animate(this, l, k, h, n)
        }
    },
    push: function (f) {
        if (f) {
            var e = this.node;
            e.appendChild(f.node);
            var g = f.clipPath;
            g && e.appendChild(g);
            (g = f.grad) && e.appendChild(g);
            this.children.push(f)
        }
    },
    text: function (b) {
        this.R.setText(this, b)
    },
    remove: function () {
        this.R.remove(this)
    },
    clear: function () {
        var b = this.node;
        if (b.hasChildNodes()) {
            for (; 1 <= b.childNodes.length;) {
                b.removeChild(b.firstChild)
            }
        }
    },
    hide: function () {
        this.setAttr("visibility", "hidden")
    },
    show: function () {
        this.setAttr("visibility", "visible")
    },
    getBBox: function () {
        return this.R.getBBox(this)
    },
    toFront: function () {
        var e = this.node;
        if (e) {
            var d = e.parentNode;
            d && d.appendChild(e)
        }
    },
    toBack: function () {
        var f = this.node;
        if (f) {
            var e = f.parentNode;
            if (e) {
                var g = e.firstChild;
                g && e.insertBefore(f, g)
            }
        }
    },
    mouseover: function (b) {
        this.R.addListener(this, "mouseover", b);
        return this
    },
    mouseout: function (b) {
        this.R.addListener(this, "mouseout", b);
        return this
    },
    click: function (b) {
        this.R.addListener(this, "click", b);
        return this
    },
    dblclick: function (b) {
        this.R.addListener(this, "dblclick", b);
        return this
    },
    mousedown: function (b) {
        this.R.addListener(this, "mousedown", b);
        return this
    },
    mouseup: function (b) {
        this.R.addListener(this, "mouseup", b);
        return this
    },
    touchstart: function (b) {
        this.R.addListener(this, "touchstart", b);
        return this
    },
    touchend: function (b) {
        this.R.addListener(this, "touchend", b);
        return this
    },
    stop: function () {
        var b = this.animationX;
        b && AmCharts.removeFromArray(this.R.animations, b);
        (b = this.animationY) && AmCharts.removeFromArray(this.R.animations, b)
    },
    length: function () {
        return this.node.childNodes.length
    },
    gradient: function (f, e, g) {
        this.R.gradient(this, f, e, g)
    }
});
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function (b) {
        this.D = b;
        this.cNames = {
            circle: "oval",
            rect: "roundrect",
            path: "shape"
        };
        this.styleMap = {
            x: "left",
            y: "top",
            width: "width",
            height: "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            visibility: "visibility"
        };
        this.animations = []
    },
    create: function (g, f) {
        var j;
        if ("group" == f) {
            j = document.createElement("div"), g.type = "div"
        } else {
            if ("text" == f) {
                j = document.createElement("div"), g.type = "text"
            } else {
                if ("image" == f) {
                    j = document.createElement("img"), g.type = "image"
                } else {
                    g.type = "shape";
                    g.shapeType = this.cNames[f];
                    j = document.createElement("v:" + this.cNames[f]);
                    var h = document.createElement("v:stroke");
                    j.appendChild(h);
                    g.stroke = h;
                    h = document.createElement("v:fill");
                    j.appendChild(h);
                    g.fill = h
                }
            }
        }
        j.style.position = "absolute";
        j.style.top = 0;
        j.style.left = 0;
        return j
    },
    path: function (e, d) {
        e.node.setAttribute("src", d)
    },
    setAttr: function (k, j, q) {
        if (void 0 !== q) {
            if (8 === document.documentMode) {
                var p = !0
            }
            var o = k.node,
                n = k.type,
                m = o.style;
            "r" == j && (m.width = 2 * q, m.height = 2 * q);
            if ("roundrect" == k.shapeType && ("width" == j || "height" == j)) {
                q -= 1
            }
            "cursor" == j && (m.cursor = q);
            "cx" == j && (m.left = q - this.removePx(m.width) / 2);
            "cy" == j && (m.top = q - this.removePx(m.height) / 2);
            var l = this.styleMap[j];
            void 0 != l && (m[l] = q);
            if ("text" == n) {
                if ("text-anchor" == j && (k.anchor = q, l = o.clientWidth, "end" == q && (m.marginLeft = -l + "px"), "middle" == q && (m.marginLeft = -(l / 2) + "px"), "start" == q)) {
                    m.marginLeft = "0px"
                }
                "fill" == j && (m.color = q);
                "font-weight" == j && (m.fontWeight = q)
            }
            m = k.children;
            for (l = 0; l < m.length; l++) {
                m[l].setAttr(j, q)
            }
            if ("shape" == n) {
                "cs" == j && (o.style.width = "100px", o.style.height = "100px", o.setAttribute("coordsize", q));
                "d" == j && o.setAttribute("path", this.svgPathToVml(q));
                "dd" == j && o.setAttribute("path", q);
                n = k.stroke;
                k = k.fill;
                "stroke" == j && (p ? n.color = q : n.setAttribute("color", q));
                "stroke-width" == j && (p ? n.weight = q : n.setAttribute("weight", q));
                "stroke-opacity" == j && (p ? n.opacity = q : n.setAttribute("opacity", q));
                "stroke-dasharray" == j && (m = "solid", 0 < q && 3 > q && (m = "dot"), 3 <= q && 6 >= q && (m = "dash"), 6 < q && (m = "longdash"), p ? n.dashstyle = m : n.setAttribute("dashstyle", m));
                if ("fill-opacity" == j || "opacity" == j) {
                    0 == q ? p ? k.on = !1 : k.setAttribute("on", !1) : p ? k.opacity = q : k.setAttribute("opacity", q)
                }
                "fill" == j && (p ? k.color = q : k.setAttribute("color", q));
                "rx" == j && (p ? o.arcSize = q + "%" : o.setAttribute("arcsize", q + "%"))
            }
        }
    },
    attr: function (f, e) {
        for (var g in e) {
            this.setAttr(f, g, e[g])
        }
    },
    text: function (h, g, l) {
        var k = new AmCharts.AmDObject("text", this.D),
            j = k.node;
        j.style.whiteSpace = "pre";
        h = document.createTextNode(h);
        j.appendChild(h);
        this.D.addToContainer(j, l);
        this.attr(k, g);
        return k
    },
    getBBox: function (b) {
        return this.getBox(b.node)
    },
    getBox: function (y) {
        var w = y.offsetLeft,
            v = y.offsetTop,
            u = y.offsetWidth,
            t = y.offsetHeight,
            r;
        if (y.hasChildNodes()) {
            for (var q, p, o = 0; o < y.childNodes.length; o++) {
                r = this.getBox(y.childNodes[o]);
                var n = r.x;
                isNaN(n) || (isNaN(q) ? q = n : n < q && (q = n));
                var m = r.y;
                isNaN(m) || (isNaN(p) ? p = m : m < p && (p = m));
                n = r.width + n;
                isNaN(n) || (u = Math.max(u, n));
                r = r.height + m;
                isNaN(r) || (t = Math.max(t, r))
            }
            0 > q && (w += q);
            0 > p && (v += p)
        }
        return {
            x: w,
            y: v,
            width: u,
            height: t
        }
    },
    setText: function (f, e) {
        var g = f.node;
        g && (g.removeChild(g.firstChild), g.appendChild(document.createTextNode(e)));
        this.setAttr(f, "text-anchor", f.anchor)
    },
    addListener: function (f, e, g) {
        f.node["on" + e] = g
    },
    move: function (h, g, l) {
        var k = h.node,
            j = k.style;
        "text" == h.type && (l -= this.removePx(j.fontSize) / 2 - 1);
        "oval" == h.shapeType && (g -= this.removePx(j.width) / 2, l -= this.removePx(j.height) / 2);
        h = h.bw;
        isNaN(h) || (g -= h, l -= h);
        k.style.left = g + "px";
        k.style.top = l + "px"
    },
    removePx: function (b) {
        return Number(b.substring(0, b.length - 2))
    },
    svgPathToVml: function (E) {
        for (var D = E.split(" "), E = "", C, B = Math.round, A = 0; A < D.length; A++) {
            var z = D[A],
                y = z.substring(0, 1),
                z = z.substring(1),
                w = z.split(","),
                v = B(w[0]) + "," + B(w[1]);
            "M" == y && (E += " m " + v);
            "L" == y && (E += " l " + v);
            "Z" == y && (E += " x e");
            if ("Q" == y) {
                var u = C.length,
                    t = C[u - 1],
                    q = w[0],
                    n = w[1],
                    v = w[2],
                    r = w[3];
                C = B(C[u - 2] / 3 + 2 / 3 * q);
                t = B(t / 3 + 2 / 3 * n);
                q = B(2 / 3 * q + v / 3);
                n = B(2 / 3 * n + r / 3);
                E += " c " + C + "," + t + "," + q + "," + n + "," + v + "," + r
            }
            "A" == y && (E += " wa " + z);
            "B" == y && (E += " at " + z);
            C = w
        }
        return E
    },
    animate: function (k, j, q, p, o) {
        var n = this,
            m = k.node;
        if ("translate" == j) {
            var l = q.split(","),
                j = l[1],
                q = m.offsetTop,
                m = {
                    obj: k,
                    frame: 0,
                    attribute: "left",
                    from: m.offsetLeft,
                    to: l[0],
                    time: p,
                    effect: o
                };
            n.animations.push(m);
            p = {
                obj: k,
                frame: 0,
                attribute: "top",
                from: q,
                to: j,
                time: p,
                effect: o
            };
            n.animations.push(p);
            k.animationX = m;
            k.animationY = p
        }
        n.interval || (n.interval = setInterval(function () {
            n.updateAnimations.call(n)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        for (var k = this.animations.length - 1; 0 <= k; k--) {
            var j = this.animations[k],
                q = 1000 * j.time / AmCharts.updateRate,
                p = j.frame + 1,
                o = j.obj,
                n = j.attribute;
            if (p <= q) {
                j.frame++;
                var m = Number(j.from),
                    l = Number(j.to) - m,
                    j = this.D[j.effect](0, p, m, l, q);
                0 == l ? this.animations.splice(k, 1) : o.node.style[n] = j
            } else {
                o.node.style[n] = Number(j.to), this.animations.splice(k, 1)
            }
        }
    },
    clipRect: function (h, g, l, k, j) {
        h.node.style.clip = "rect(" + l + "px " + (g + k) + "px " + (l + j) + "px " + g + "px)"
    },
    rotate: function (y, w) {
        var v = y.node,
            u = v.style,
            t = this.getBGColor(v.parentNode);
        u.backgroundColor = t;
        u.paddingLeft = 1;
        var t = w * Math.PI / 180,
            r = Math.cos(t),
            q = Math.sin(t),
            p = this.removePx(u.left),
            o = this.removePx(u.top),
            n = v.offsetWidth,
            v = v.offsetHeight,
            m = w / Math.abs(w);
        u.left = p + n / 2 - n / 2 * Math.cos(t) - m * v / 2 * Math.sin(t) + 3;
        u.top = o - m * n / 2 * Math.sin(t) + m * v / 2 * Math.sin(t);
        u.cssText = u.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + r + "', M12='" + -q + "', M21='" + q + "', M22='" + r + "', sizingmethod='auto expand');"
    },
    getBGColor: function (f) {
        var e = "#FFFFFF";
        if (f.style) {
            var g = f.style.backgroundColor;
            "" != g ? e = g : f.parentNode && (e = this.getBGColor(f.parentNode))
        }
        return e
    },
    set: function (f) {
        var e = new AmCharts.AmDObject("group", this.D);
        this.D.container.appendChild(e.node);
        if (f) {
            for (var g = 0; g < f.length; g++) {
                e.push(f[g])
            }
        }
        return e
    },
    gradient: function (k, j, p, o) {
        var n = "";
        "radialGradient" == j && (j = "gradientradial", p.reverse());
        "linearGradient" == j && (j = "gradient");
        for (var m = 0; m < p.length; m++) {
            var l = Math.round(100 * m / (p.length - 1)),
                n = n + (l + "% " + p[m]);
            m < p.length - 1 && (n += ",")
        }
        k = k.fill;
        90 == o ? o = 0 : 270 == o ? o = 180 : 180 == o ? o = 90 : 0 == o && (o = 270);
        8 === document.documentMode ? (k.type = j, k.angle = o) : (k.setAttribute("type", j), k.setAttribute("angle", o));
        n && (k.colors.value = n)
    },
    remove: function (b) {
        b.clipPath && this.D.remove(b.clipPath);
        this.D.remove(b.node)
    },
    disableSelection: function (b) {
        void 0 != typeof b.onselectstart && (b.onselectstart = function () {
            return !1
        });
        b.style.cursor = "default"
    }
});
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function (b) {
        this.D = b;
        this.animations = []
    },
    create: function (e, d) {
        return document.createElementNS(AmCharts.SVG_NS, d)
    },
    attr: function (f, e) {
        for (var g in e) {
            this.setAttr(f, g, e[g])
        }
    },
    setAttr: function (f, e, g) {
        void 0 !== g && f.node.setAttribute(e, g)
    },
    animate: function (k, j, p, o, n) {
        var m = this,
            l = k.node;
        "translate" == j ? (l = (l = l.getAttribute("transform")) ? ("" + l).substring(10, l.length - 1) : "0,0", l = l.split(", ").join(" "), l = l.split(" ").join(","), 0 == l && (l = "0,0")) : l = l.getAttribute(j);
        j = {
            obj: k,
            frame: 0,
            attribute: j,
            from: l,
            to: p,
            time: o,
            effect: n
        };
        m.animations.push(j);
        k.animationX = j;
        m.interval || (m.interval = setInterval(function () {
            m.updateAnimations.call(m)
        }, AmCharts.updateRate))
    },
    updateAnimations: function () {
        for (var t = this.animations.length - 1; 0 <= t; t--) {
            var r = this.animations[t],
                q = 1000 * r.time / AmCharts.updateRate,
                p = r.frame + 1,
                o = r.obj,
                n = r.attribute;
            if (p <= q) {
                r.frame++;
                if ("translate" == n) {
                    var m = r.from.split(","),
                        n = Number(m[0]),
                        m = Number(m[1]),
                        l = r.to.split(","),
                        k = Number(l[0]),
                        l = Number(l[1]),
                        k = 0 == k - n ? k : Math.round(this.D[r.effect](0, p, n, k - n, q)),
                        r = 0 == l - m ? l : Math.round(this.D[r.effect](0, p, m, l - m, q)),
                        n = "transform",
                        r = "translate(" + k + "," + r + ")"
                } else {
                    m = Number(r.from), k = Number(r.to), k -= m, r = this.D[r.effect](0, p, m, k, q), 0 == k && this.animations.splice(t, 1)
                }
                this.setAttr(o, n, r)
            } else {
                "translate" == n ? (l = r.to.split(","), k = Number(l[0]), l = Number(l[1]), o.translate(k, l)) : (k = Number(r.to), this.setAttr(o, n, k)), this.animations.splice(t, 1)
            }
        }
    },
    getBBox: function (e) {
        if (e = e.node) {
            try {
                return e.getBBox()
            } catch (d) {}
        }
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    },
    path: function (e, d) {
        e.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", d)
    },
    clipRect: function (k, j, q, p, o) {
        var n = k.node,
            m = k.clipPath;
        m && this.D.remove(m);
        var l = n.parentNode;
        l && (n = document.createElementNS(AmCharts.SVG_NS, "clipPath"), m = AmCharts.getUniqueId(), n.setAttribute("id", m), this.D.rect(j, q, p, o, 0, 0, n), l.appendChild(n), j = "#", AmCharts.baseHref && (j = window.location.href + j), this.setAttr(k, "clip-path", "url(" + j + m + ")"), this.clipPathC++, k.clipPath = n)
    },
    text: function (k, j, p) {
        for (var o = new AmCharts.AmDObject("text", this.D), k = ("" + k).split("\n"), n = j["font-size"], m = 0; m < k.length; m++) {
            var l = this.create(null, "tspan");
            l.appendChild(document.createTextNode(k[m]));
            l.setAttribute("y", (n + 2) * m + n / 2 + 0);
            l.setAttribute("x", 0);
            o.node.appendChild(l)
        }
        o.node.setAttribute("y", n / 2 + 0);
        this.attr(o, j);
        this.D.addToContainer(o.node, p);
        return o
    },
    setText: function (f, e) {
        var g = f.node;
        g && (g.removeChild(g.firstChild), g.appendChild(document.createTextNode(e)))
    },
    move: function (f, e, g) {
        this.setAttr(f, "transform", "translate(" + e + "," + g + ")")
    },
    rotate: function (g, f) {
        var j = g.node.getAttribute("transform"),
            h = "rotate(" + f + ")";
        j && (h = j + " " + h);
        this.setAttr(g, "transform", h)
    },
    set: function (f) {
        var e = new AmCharts.AmDObject("g", this.D);
        this.D.container.appendChild(e.node);
        if (f) {
            for (var g = 0; g < f.length; g++) {
                e.push(f[g])
            }
        }
        return e
    },
    addListener: function (f, e, g) {
        f.node["on" + e] = g
    },
    gradient: function (v, u, t, r) {
        var q = v.node,
            p = v.grad;
        p && this.D.remove(p);
        u = document.createElementNS(AmCharts.SVG_NS, u);
        p = AmCharts.getUniqueId();
        u.setAttribute("id", p);
        if (!isNaN(r)) {
            var o = 0,
                n = 0,
                m = 0,
                l = 0;
            90 == r ? m = 100 : 270 == r ? l = 100 : 180 == r ? o = 100 : 0 == r && (n = 100);
            u.setAttribute("x1", o + "%");
            u.setAttribute("x2", n + "%");
            u.setAttribute("y1", m + "%");
            u.setAttribute("y2", l + "%")
        }
        for (r = 0; r < t.length; r++) {
            o = document.createElementNS(AmCharts.SVG_NS, "stop"), n = 100 * r / (t.length - 1), 0 == r && (n = 0), o.setAttribute("offset", n + "%"), o.setAttribute("stop-color", t[r]), u.appendChild(o)
        }
        q.parentNode.appendChild(u);
        t = "#";
        AmCharts.baseHref && (t = window.location.href + t);
        q.setAttribute("fill", "url(" + t + p + ")");
        v.grad = u
    },
    remove: function (b) {
        b.clipPath && this.D.remove(b.clipPath);
        b.grad && this.D.remove(b.grad);
        this.D.remove(b.node)
    }
});
AmCharts.AmDSet = AmCharts.Class({
    construct: function () {
        this.create("g")
    },
    attr: function (b) {
        this.R.attr(this.node, b)
    },
    move: function (e, d) {
        this.R.move(this.node, e, d)
    }
});
var amJsPathToImages = "/res/js/common/charts/images/";
var amJsColorDarkCursor = "#31343B";
var amJsDefaultColors = ["#3E85D7", "#D79DD8", "#F18F24", "#78A71B", "#DF9D8D", "#E2E63A"];

function setAmChartData(h, b, e, g, a, f, d) {
    f = (f) ? f : "totalData";
    d = (d) ? d : false;
    alert("what?!")
}
function prepAmDebtRepayment(b, a) {
    gTrendData = b;
    if (typeof (dRepaymentChart) == "object") {
        dRepaymentChart.dataProvider = gTrendData;
        dRepaymentChart.validateData()
    } else {
        dRepaymentChart = new AmCharts.AmPieChart();
        dRepaymentChart.dataProvider = gTrendData;
        dRepaymentChart.titleField = "name";
        dRepaymentChart.valueField = "value";
        dRepaymentChart.outlineColor = "#FFFFFF";
        dRepaymentChart.outlineAlpha = 0.8;
        dRepaymentChart.outlineThickness = 2;
        dRepaymentChart.labelsEnabled = true;
        dRepaymentChart.labelRadius = -35;
        dRepaymentChart.labelText = "[[title]]";
        dRepaymentChart.balloonText = "[[percents]]%";
        dRepaymentChart.color = "#ffffff";
        dRepaymentChart.fontSize = 12;
        dRepaymentChart.radius = 90;
        dRepaymentChart.pullOutEffect = "elastic";
        dRepaymentChart.pullOutDuration = 0.5;
        dRepaymentChart.pullOutOnlyOne = 1;
        dRepaymentChart.colors = ["#5796dd", "#489339"];
        dRepaymentChart.bold = true;
        dRepaymentChart.startAngle = 25;
        dRepaymentChart.startEffect = "elastic";
        dRepaymentChart.startOnAxis = true;
        dRepaymentChart.percentFormatter = {
            precision: 0
        };
        setBalloon(dRepaymentChart, {});
        dRepaymentChart.write(a)
    }
}
function prepAmPie(g, f, d, a) {
    chartData = g[1][d];
    var b = new Array();
    var e = new Array();
    for (i = 0; i < chartData.length; i++) {
        b.push(chartData[i]);
        if (chartData[i].color) {
            e.push(formatColorCode(chartData[i].color))
        }
    }
    gTrendData = b;
    e = (e.length > 0) ? e : amJsDefaultColors;
    chart = new AmCharts.AmPieChart();
    chart.dataProvider = gTrendData;
    chart.titleField = "name";
    chart.valueField = "debt";
    chart.descriptionField = "balloonJs";
    chart.outlineColor = "#FFFFFF";
    chart.outlineAlpha = 0.8;
    chart.outlineThickness = 2;
    chart.labelsEnabled = false;
    chart.labelRadius = 0;
    chart.radius = 107;
    chart.pullOutEffect = "elastic";
    chart.pullOutDuration = 0.5;
    chart.pullOutOnlyOne = 1;
    chart.balloonText = "[[title]]\n[[description]]";
    chart.colors = e;
    chart.startOnAxis = true;
    chart.integersOnly = true;
    setBalloon(chart, {});
    chart.write(f)
}
function prepAmTrending(j, h, f, b, g, d) {
    chartData = j[1][f];
    chartSettings = j[1]["chartSettings"];
    var e = new Array();
    for (i = 0; i < chartData.length; i++) {
        e.push(chartData[i]);
        e[i].date = new Date(chartData[i].date * 1000);
        if (d && e[i].value === "") {
            e[i].value = "undefined"
        } else {
            if (!d && !e[i].value) {
                e[i].value = "undefined"
            }
        }
        if (g) {
            e[i].value = Math.round(e[i].value)
        }
        if (b == "%" && e[i].value > 100) {
            e[i].value = 100
        }
    }
    gTrendData = e;
    var a = new AmCharts.AmSerialChart();
    a.dataProvider = gTrendData;
    a.pathToImages = amJsPathToImages;
    a.panEventsEnabled = true;
    a.categoryField = "date";
    setBalloon(a, {});
    setCursor(a);
    setCategoryAxis(a, null, true, "none", null, 10, null, null, true, true);
    setValueAxis(a, b, 10, false, true, g, null, 7, true);
    setMargins(a, 30, 30, 80, 30);
    balloonText = (b == "$") ? "[[monthYear]]<br>" + b + "[[value]]" : "[[monthYear]]<br>[[value]]" + b;
    chartSettings = {
        type: "line",
        title: "trending",
        valueField: "value",
        descriptionField: "monthYear",
        unit: b,
        balloonText: balloonText,
        lineColor: "#f89d00",
        lineAlpha: 1,
        bulletBorderColor: "#f89d00",
        bulletColor: "#ffffff",
        bulletSize: 14,
        bullet: "round",
        lineThickness: 8,
        connect: true
    };
    _addGraph(a, chartSettings);
    a.write(h)
}
function prepAmBar(g, f, e, b) {
    chartData = g[1][e];
    chartData.reverse();
    var d = new Array();
    for (i = 0; i < chartData.length; i++) {
        d.push(chartData[i])
    }
    gTrendData = chartData;
    var a = new AmCharts.AmSerialChart();
    a.dataProvider = gTrendData;
    a.categoryField = "name";
    a.rotate = true;
    a.plotAreaBorderColor = "#cccccc";
    a.plotAreaBorderAlpha = 1;
    setCategoryAxis(a, null, false, "none", "none", null, 0, "start", false);
    setValueAxis(a, b, 7, false, false, true, 0.2, 0);
    setBalloon(a, {});
    setMargins(a);
    chartSettings = {
        type: "column",
        valueField: "ccu",
        descriptionField: "balloonJs",
        colorField: "color",
        unit: b,
        balloonText: "[[name]] \n[[balloonJs]]",
        lineAlpha: 0,
        lineColor: null,
        fillAlphas: 1,
        lineThickness: 0,
        bulletSize: 0
    };
    _addGraph(a, chartSettings);
    a.write(f)
}
function prepAmMultiHistory(f, e, b) {
    gTrendData = f[1]["dataAmJs"];
    chartColors = f[1]["colorsAmJs"];
    allAccounts = f[1]["accountsAmJs"];
    allColors = [];
    $.each(chartColors, function (g, h) {
        allColors.push(formatColorCode(h))
    });
    var a = new AmCharts.AmSerialChart();
    a.dataProvider = gTrendData;
    a.pathToImages = amJsPathToImages;
    a.categoryField = "categoryTitle";
    a.colors = allColors;
    setMargins(a, 10, 40, 70, 30);
    setCategoryAxis(a, null, false, "#FFFFFF", null, null, null, null, true, false, null, {
        fillColor: "none"
    });
    setValueAxis(a, b, 6, false, true);
    setCursor(a, null, amJsColorDarkCursor, null, false, "#FFFFFF");
    legendSettings = {
        text: null,
        position: "top",
        unit: b,
        maxColumns: 3,
        align: "center"
    };
    setLegend(a, legendSettings);
    chartSettings = {
        type: "line",
        lineThickness: 4,
        bullet: "round",
        bulletSize: 8,
        unit: b
    };
    var d = 0;
    $.each(allAccounts, function (h, g) {
        chartGraph = chartSettings;
        chartGraph.title = g;
        chartGraph.valueField = d;
        chartGraph.lineColor = a.colors[h];
        graph = _addGraph(a, chartGraph);
        d++
    });
    a.write(e)
}
function prepAmAmortization(d, b, a) {
    if (a && typeof (amortChart) == "object") {
        amortChart.dataProvider = d;
        amortChart.validateData()
    } else {
        amortChart = new AmCharts.AmSerialChart();
        amortChart.dataProvider = d;
        amortChart.pathToImages = amJsPathToImages;
        amortChart.categoryField = "year";
        amortChart.balloon.color = "#FFFFFF";
        setMargins(amortChart, 35, 35, 70, 20);
        setCategoryAxis(amortChart, null, false, "none", null, 10, 1, null, false, false, "Year Of Mortgage");
        setValueAxis(amortChart, "N", 8, false, true, null, null, 7);
        setCursor(amortChart, null, "#999999", 1, false, "#FFFFFF");
        legendSettings = {
            position: "bottom",
            maxColumns: 3,
            autoMargins: true,
            align: "center",
            spacing: 8,
            markerType: "square"
        };
        setLegend(amortChart, legendSettings);
        chartSettings = {
            type: "line",
            balloonText: "N[[value]]",
            bullet: "none",
            lineAlpha: 1,
            lineThickness: 4,
            unit: "N"
        };
        interestChart = chartSettings;
        interestChart.title = "Interest Paid";
        interestChart.valueField = "interest";
        interestChart.lineColor = "#A3A3A3";
        graph = _addGraph(amortChart, interestChart);
        principleChart = chartSettings;
        principleChart.title = "Principle Paid";
        principleChart.valueField = "principle";
        principleChart.lineColor = "#000000";
        graph = _addGraph(amortChart, principleChart);
        balanceChart = chartSettings;
        balanceChart.title = "Balance";
        balanceChart.valueField = "amount";
        balanceChart.lineColor = "#FF0000";
        graph = _addGraph(amortChart, balanceChart);
        amortChart.addLabel(0, 0, "Loan Amortization Chart", "left", 14, "#373535", 0, 1, true);
        amortChart.write(b)
    }
}
function prepAmPrinciplePayment(d, b, e, a) {
    if (a && typeof (principleChart) == "object") {
        principleChart.dataProvider = d;
        amortValAxis.maximum = e;
        principleChart.validateData()
    } else {
        principleChart = new AmCharts.AmSerialChart();
        principleChart.dataProvider = d;
        principleChart.pathToImages = amJsPathToImages;
        principleChart.categoryField = "year";
        principleChart.balloon.color = "#666666";
        principleChart.plotAreaFillAlphas = 1;
        principleChart.plotAreaFillColors = "#FF0000";
        setMargins(principleChart, 35, 75, 60, 20);
        setCategoryAxis(principleChart, null, true, "none", null, 10, 1, null, false, false, "Year Of Mortgage", {
            fillColor: "none"
        });
        amortValAxis = setValueAxis(principleChart, "N", 10, false, true, null, null, 7, {
            maximum: e,
            gridColor: "none"
        });
        setCursor(principleChart, null, "#DEF6DE", 1, false, "#666666");
        legendSettings = {
            position: "bottom",
            maxColumns: 3,
            autoMargins: true,
            align: "center",
            spacing: 8,
            markerType: "square"
        };
        chartSettings = {
            type: "line",
            balloonText: "N[[value]]",
            bullet: "none",
            lineThickness: 4,
            unit: "N",
            title: "Interest Paid",
            valueField: "interest",
            fillAlphas: 1,
            fillColors: "#000000",
			lineColor: "#A3A3A3",
            balloonColor: "#FFFFFF"
        };
        graph = _addGraph(principleChart, chartSettings);
        principleChart.addLabel(90, 200, "Interest Paid", "center", 13, "#656565", 0, 1, true);
        principleChart.addLabel(-90, 50, "Principal Paid", "center", 13, "#FFFFFF", 0, 1, true);
        principleChart.addLabel(0, 0, "Principal Payment Chart", "left", 14, "#373535", 0, 1, true);
        principleChart.write(b)
    }
}
function prepAmMultiLine(f, e, d, b) {
    chartData = f[1][d][0][d];
    gTrendData = chartData;
    var a = new AmCharts.AmSerialChart();
    a.dataProvider = gTrendData;
    a.pathToImages = amJsPathToImages;
    a.panEventsEnabled = true;
    a.categoryField = "categoryTitle";
    setMargins(a, 30, 30, 70, 30);
    setCategoryAxis(a, null, false, "none", null, 10, null, null, true);
    setValueAxis(a, b, 6, false, true, null, null, 7);
    setBalloon(a, {});
    $.each(gTrendData, function (g, h) {
        if (h.data) {
            $.each(h.data, function () {
                if (!this.value) {
                    this.value = "undefined"
                }
            })
        } else {
            if (!h.value) {
                h.value = "undefined"
            }
        }
        oldAddGraph(h, a, "value")
    });
    a.write(e)
}
function prepAmTrends(f, e, d, b) {
    gTrendData = f[d];
    valueFields = f.meta["graphs"];
    var a = new AmCharts.AmSerialChart();
    a.dataProvider = gTrendData;
    a.pathToImages = amJsPathToImages;
    a.panEventsEnabled = true;
    a.categoryField = "period";
    a.colors = ["#3fa9f5", "#095fc8", "#8bd1e5"];
    a.plotAreaBorderAlpha = 1;
    a.plotAreaBorderColor = "#eee";
    setMargins(a, 10, 30, 50, 20);
    setCategoryAxis(a, null, true, null, null, 10, 7, null, true);
    setValueAxis(a, b, 6, true, true);
    setBalloon(a, {});
    setCursor(a);
    setLegend(a, {});
    chartSettings = {
        type: "line",
        lineThickness: 10,
        unit: b
    };
    $.each(valueFields, function (g, h) {
        chartGraph = chartSettings;
        chartGraph.title = h;
        chartGraph.valueField = h;
        chartGraph.lineColor = a.colors[g];
        graph = _addGraph(a, chartGraph)
    });
    a.write(e)
}
function prepAmTrendColumn(d, e, a) {
    gTrendData = d.data;
    var b = new AmCharts.AmSerialChart();
    b.dataProvider = gTrendData;
    b.pathToImages = amJsPathToImages;
    b.categoryField = "label";
    b.colors = ["#3fa9f5", "#095fc8", "#8bd1e5"];
    b.plotAreaBorderAlpha = 1;
    b.plotAreaBorderColor = "#eee";
    b.startDuration = 1;
    if (a == "columnh") {
        b.rotate = true
    }
    setMargins(b);
    setCategoryAxis(b, null, false, null, null, null, null, null, true, false);
    setValueAxis(b, null, null, true, true, true, null, null);
    setBalloon(b, {});
    chartSettings = {
        type: "column",
        title: "trend",
        valueField: "value",
        colorField: "color",
        fillAlphas: 1,
        lineAlpha: 1,
        balloonText: "[[value]]"
    };
    graph = _addGraph(b, chartSettings);
    b.write(e)
}
function prepAmScoreChart(g, f) {
    chartData = $.parseJSON(g);
    var b = new Array();
    for (i = 0; i < chartData.length; i++) {
        b.push(chartData[i]);
        b[i].date = new Date(chartData[i].date * 1000)
    }
    gTrendData = b;
    chart = new AmCharts.AmSerialChart();
    chart.pathToImages = amJsPathToImages;
    chart.panEventsEnabled = true;
    chart.zoomOutButton = {
        fontSize: 8,
        backgroundColor: "#cccccc",
        backgroundAlpha: 0.15
    };
    chart.dataProvider = gTrendData;
    chart.categoryField = "date";
    chart.autoMargins = true;
    chart.marginTop = 0;
    chart.marginRight = 5;
    chart.color = "#888888";
    chart.sequencedAnimation = true;
    chart.balloon.bulletSize = 5;
    chart.addListener("dataUpdated", zoomChart);
    var d = chart.categoryAxis;
    d.parseDates = true;
    d.minPeriod = "DD";
    d.dashLength = 1;
    d.gridAlpha = 0;
    d.axisColor = "#ccc";
    d.tickLength = 0;
    d.offset = 16;
    d.equalSpacing = true;
    var e = new AmCharts.ValueAxis();
    e.autoGridCount = true;
    e.axisAlpha = 0;
    e.gridAlpha = 1;
    e.gridColor = "#aaaaaa";
    e.fillAlpha = 1;
    e.fillColor = "#E7F6FD";
    e.gridThickness = 1;
    e.dashLength = 1;
    e.tickLength = 0;
    e.unit = null;
    chart.addValueAxis(e);
    chartSettings = {
        type: "line",
        title: "score",
        valueField: "score",
        balloonColor: amJsColorDarkCursor,
        color: "#222429",
        lineColor: "#83A6CC",
        bullet: "round",
        bulletColor: "#E67900",
        bulletSize: 14,
        fillColors: "#DF7401",
        lineAlpha: 1,
        fillAlphas: 0,
        lineThickness: 4,
        connect: true,
        unit: null
    };
    graph = _addGraph(chart, chartSettings);
    chartCursor = setCursor(chart, "mouse", amJsColorDarkCursor, false, true, "#FFFFFF");
    var a = new AmCharts.ChartScrollbar();
    a.graph = graph;
    a.scrollbarHeight = 16;
    a.graphFillAlpha = 0.1;
    a.graphFillColor = "#DF7401";
    a.graphLineAlpha = 0.1;
    a.graphLineColor = "#4B4B49";
    a.selectedGraphFillAlpha = 0;
    a.selectedGraphLineAlpha = 0.6;
    a.selectedGraphLineColor = "#DF7401";
    a.selectedBackgroundAlpha = 1;
    a.selectedBackgroundColor = "#ffffff";
    a.color = "#888888";
    a.backgroundColor = "#eeeeee";
    a.backgroundAlpha = 1;
    a.autoGridCount = true;
    a.gridColor = "#cccccc";
    chart.addChartScrollbar(a);
    chart.write(f)
}
function prepAmComparison(b, d, a) {
    gTrendData = b.dataJs;
    gXLabel = b["x-label"];
    gYLabel = b["y-label"];
    if (b["point-format"] == "value%") {
        unit = "%";
        unitPosition = "right";
        balloonText = "[[value]]%"
    } else {
        if (b["point-format"] == "$value") {
            unit = "$";
            unitPosition = "left";
            balloonText = "$[[value]]"
        } else {
            unit = "";
            unitPosition = "left";
            balloonText = "[[value]]"
        }
    }
    chartType = (b.type == "line") ? "line" : "column";
    if (a && typeof (mlChart) == "object") {
        mlChart.dataProvider = gTrendData;
        mlChart.clearLabels();
        mlChart.categoryAxis.title = gXLabel;
        mlChart.valueAxes[0].maximum = b["y-max"];
        mlChart.valueAxes[0].title = gYLabel;
        mlChart.valueAxes[0].unit = unit;
        mlChart.valueAxes[0].unitPosition = unitPosition;
        mlChart.graphs[0].type = chartType;
        mlChart.graphs[0].bullet = "none";
        mlChart.graphs[0].labelText = balloonText;
        mlChart.startDuration = 0.6;
        mlChart.startEffect = ">";
        if (chartType == "line") {
            mlChart.startEffect = "none";
            mlChart.startDuration = 0;
            mlChart.graphs[0].bullet = "round";
            mlChart.graphs[0].bulletSize = 14;
            mlChart.graphs[0].bulletColor = "#3fa9f5"
        }
        mlChart.animateAgain();
        mlChart.validateData()
    } else {
        mlChart = new AmCharts.AmSerialChart();
        mlChart.dataProvider = gTrendData;
        mlChart.pathToImages = amJsPathToImages;
        mlChart.plotAreaFillAlphas = 1;
        mlChart.plotAreaFillColors = "#fffdef";
        mlChart.categoryField = "label";
        mlChart.plotAreaBorderAlpha = 1;
        mlChart.plotAreaBorderColor = "#CCCCCC";
        mlChart.fontFamily = "Arial";
        mlChart.startDuration = 0.6;
        mlChart.columnWidth = 0.55;
        mlChart.startEffect = ">";
        mlChart.connect = true;
        setMargins(mlChart, 10, 70, 80, 10);
        setCategoryAxis(mlChart, null, false, "none", null, null, null, null, true, false, gXLabel, {
            fillColor: "none"
        });
        setValueAxis(mlChart, unit, null, true, false, false, null, null, {
            maximum: b["y-max"],
            title: gYLabel
        });
        chartSettings = {
            type: chartType,
            title: "trend",
            valueField: "value",
            colorField: "color",
            labelText: balloonText,
            fillAlphas: 1,
            lineAlpha: 1,
            lineColor: "#000000",
            showBalloon: "0",
            fillColors: ["#63a1e5", "#0f64d1"],
            gradientOrientation: "horizontal"
        };
        graph = _addGraph(mlChart, chartSettings);
        mlChart.write(d)
    }
}
function zoomChart() {
    var a = 8;
    numObjs = $(chart.dataProvider).size();
    if (parseInt(numObjs) && numObjs < (a * 2)) {
        a = parseInt(numObjs * 0.5)
    }
    chart.zoomToIndexes(chartData.length - a, chartData.length - 1)
}
function setPanSelect() {
    if (document.getElementById("rb1").checked) {
        chartCursor.pan = false;
        chartCursor.zoomable = true
    } else {
        chartCursor.pan = true
    }
    chart.validateNow()
}
function formatColorCode(a) {
    if (a.charAt(0) != "#") {
        a = "#" + a
    }
    return a
}
function setValueAxis(f, k, a, d, j, b, h, e, g) {
    var l = new AmCharts.ValueAxis();
    l.gridAlpha = 1;
    l.gridColor = "#efefef";
    l.axisAlpha = (h) ? h : 1;
    l.axisThickness = 1;
    l.axisColor = "#ccc";
    l.color = "#888888";
    l.fontSize = 10;
    l.autoGridCount = (a) ? false : true;
    l.gridCount = (a) ? a : null;
    l.unit = (k == "$" || k == "%" || k == " Months") ? k : null;
    l.unitPosition = (k == "$") ? "left" : "right";
    l.showFirstLabel = d;
    l.showLastLabel = j;
    l.integersOnly = b;
    l.tickLength = (e) ? e : null;
    if (g && g.gridColor == "none") {
        l.gridAlpha = 0
    }
    if (g && g.maximum) {
        l.maximum = g.maximum
    }
    if (g && g.maxValue > 0 && (g.minValue == g.maxValue)) {
        l.minimum = g.minValue - 4;
        l.maximum = g.maxValue + 4
    }
    if (g && k == "%" && !g.maximum) {
        l.maximum = 100
    }
    if (g && g.title) {
        l.title = g.title
    }
    f.addValueAxis(l);
    return l
}
function setCategoryAxis(f, b, a, m, j, o, e, n, l, h, k, g) {
    var d = f.categoryAxis;
    d.gridAlpha = (m == "none") ? 0 : 1;
    d.gridColor = (m) ? m : "#eee";
    d.tickLength = (e) ? e : 7;
    d.equalSpacing = true;
    d.axisAlpha = (j == "none") ? 0 : 1;
    d.axisColor = (j) ? j : "#ccc";
    d.color = (b) ? b : "#888888";
    d.startOnAxis = a;
    d.fontSize = (o) ? o : 10;
    d.title = (k) ? k : null;
    d.gridPosition = (n) ? n : "start";
    d.labelsEnabled = l;
    if (h) {
        d.parseDates = true;
        d.minPeriod = "DD";
        d.dateFormats = [{
            period: "DD",
            format: "MMM 'YY"
        }, {
            period: "MM",
            format: "MMM 'YY"
        }, {
            period: "YYYY",
            format: "MMM 'YY"
        }]
    }
    if (g && g.fillColor == "none") {
        d.fillAlpha = 0
    } else {
        d.fillAlpha = 1;
        d.fillColor = "#FAFAFA"
    }
}
function setBalloon(b, a) {
    var d = b.balloon;
    d.color = (a.color) ? a.color : "#000000";
    d.fillAlpha = (a.fillColor) ? true : false;
    d.fillColor = (a.fillColor) ? a.fillColor : "#FFFFFF";
    d.fontSize = (a.fontSize) ? a.fontSize : 12;
    d.adjustBorderColor = true;
    d.cornerRadius = 5;
    d.borderAlpha = (a.borderColor) ? true : false;
    d.borderColor = a.borderColor;
    d.borderThickness = 2
}
function setCursor(e, a, g, d, h, f) {
    var b = new AmCharts.ChartCursor();
    b.cursorColor = (g) ? g : "#f89d00";
    b.color = (f) ? f : "#000000";
    b.bulletSize = (d) ? d : 18;
    b.bulletsEnabled = true;
    b.cursorPosition = (a) ? a : null;
    b.pan = h;
    e.addChartCursor(b);
    return b
}
function setLegend(d, b) {
    var a = new AmCharts.AmLegend();
    if (b.text) {
        a.labelText = b.text
    }
    if (b.unit) {
        a.valueText = (b.unit == "$") ? b.unit + "[[value]]" : "[[value]]" + b.unit
    } else {
        a.valueText = null
    }
    a.position = (b.position) ? b.position : "top";
    a.align = (b.align) ? b.align : "left";
    a.maxColumns = (b.maxColumns) ? b.maxColumns : 2;
    a.marginLeft = (b.marginLeft) ? b.marginLeft : 30;
    a.spacing = (b.spacing) ? b.spacing : 12;
    a.rollOverGraphAlpha = 0.4;
    a.autoMargins = false;
    a.markerType = (b.markerType) ? b.markerType : "circle";
    d.addLegend(a)
}
function setMargins(d, f, a, e, b) {
    d.autoMargins = true;
    if (f || a || e || b) {
        d.autoMargins = false;
        d.marginRight = b;
        d.marginLeft = e;
        d.marginBottom = a;
        d.marginTop = f
    }
}
function _addGraph(d, a) {
    var b = new AmCharts.AmGraph();
    b.valueField = a.valueField;
    b.type = a.type;
    b.title = (a.title) ? a.title : null;
    b.lineThickness = (a.lineThickness != "undefined") ? a.lineThickness : 4;
    b.lineColor = (a.lineColor != "undefined") ? a.lineColor : null;
    b.color = (a.color != "undefined") ? a.color : null;
    b.bullet = (a.bullet != "undefined") ? a.bullet : "round";
    b.bulletSize = (a.bulletSize != "undefined") ? a.bulletSize : 8;
    b.balloonText = (a.balloonText) ? a.balloonText : "[[value]]";
    b.fillAlphas = (a.fillAlphas != "undefined") ? a.fillAlphas : null;
    b.connect = true;
    b.lineAlpha = 0;
    if (a.lineColor) {
        b.lineAlpha = 1
    }
    if (a.bulletColor) {
        b.bulletColor = a.bulletColor
    }
    if (a.bulletBorderColor) {
        b.bulletBorderColor = a.bulletBorderColor
    }
    if (a.balloonColor) {
        b.balloonColor = a.balloonColor
    }
    if (a.fillColors) {
        b.fillColors = a.fillColors
    }
    if (a.gradientOrientation) {
        b.gradientOrientation = a.gradientOrientation
    }
    if (a.colorField) {
        b.colorField = a.colorField
    }
    if (a.labelText) {
        b.labelText = a.labelText
    }
    if (a.showBalloon == "0") {
        b.showBalloon = false
    }
    d.addGraph(b);
    d.validateData();
    return b
}
function oldAddGraph(e, k, l, a, g, b, f, d, h) {
    b = (b) ? b : "round";
    f = (f) ? f : 8;
    g = (g) ? g : null;
    a = (a) ? a : "line";
    d = (d) ? d : 4;
    var j = new AmCharts.AmGraph();
    j.valueField = l;
    j.type = a;
    j.title = e;
    j.lineThickness = d;
    j.lineColor = g;
    j.bullet = b;
    j.bulletSize = f;
    j.balloonText = "$[[value]]";
    if (h) {
        j.balloonText = (h == "$") ? h + "[[value]]" : "[[value]]" + h
    }
    j.connect = true;
    k.addGraph(j);
    k.validateData()
};