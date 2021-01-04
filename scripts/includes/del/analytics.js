var GAEvents = new(function () {
    this.addListeners = function () {
        var e = document.getElementsByTagName("a");
        for (var f = 0; typeof e[f] == "object"; f++) {
            if (e[f].addEventListener) {
                e[f].addEventListener("click", b)
            } else {
                if (e[f].attachEvent) {
                    e[f].attachEvent("onclick", b)
                }
            }
        }
        var d = document.getElementsByTagName("form");
        for (var f = 0; typeof d[f] == "object"; f++) {
            if (d[f].addEventListener) {
                d[f].addEventListener("submit", c)
            } else {
                if (d[f].attachEvent) {
                    d[f].attachEvent("onsubmit", c)
                }
            }
        }
    };
    var b = function (d) {
        var g = GAEvents.Util.GetEle(this, d, "A");
        var f = "Uncategorized Click";
        var h = (GAEvents.Util.GetAttr(g, "href")) ? "HREF=" + GAEvents.Util.GetAttr(g, "href") : "ONCLICK=" + GAEvents.Util.GetAttr(g, "onclick");
        var e = g.textContent || g.innerText || "";
        e = GAEvents.Util.RemoveWS(e);
        if (GAEvents.Util.EndsWith(h, "/signup")) {
            f = "Signup";
            h = "Step 1 View"
        } else {
            if (h.indexOf("/mainajax/takeoffer") != -1) {
                f = "Revenue";
                h = "TakeCCOffer";
                var i = GAEvents.Util.UrlVars(GAEvents.Util.GetAttr(g, "href"));
                if (typeof i.content == "string") {
                    e = i.content
                }
            }
        }
        GAEvents.trackEvent(f, h, e);
        setTimeout(GAEvents.addListeners, 3000)
    };
    var c = function (e) {
        var j = GAEvents.Util.GetEle(this, e, "FORM");
        var h = "Uncategorized Form Submit";
        var k = "ACTION=" + GAEvents.Util.GetAttr(j, "action");
        var f = "";
        var d = j.elements || [];
        for (var g = 0; typeof d[g] == "object"; g++) {
            if (GAEvents.Util.GetAttr(d[g], "type") == "submit") {
                f = GAEvents.Util.GetAttr(d[g], "value")
            }
        }
        f = GAEvents.Util.RemoveWS(f);
        if (GAEvents.Util.EndsWith(k, "/signup/submit")) {
            h = "Signup";
            k = "Step 1 Submit"
        } else {
            if (GAEvents.Util.EndsWith(k, "/creditsignup/startProcess")) {
                h = "Signup";
                k = "Step 2 Submit"
            } else {
                if (GAEvents.Util.EndsWith(k, "/validate/submit")) {
                    h = "Signup";
                    k = "Step 3 Submit"
                }
            }
        }
        GAEvents.trackEvent(h, k, f)
    };
    var a = false;
    this.trackEvent = function (e, f, d) {
        if (a || typeof _gaq != "object") {
            return
        }
        a = true;
        setTimeout(function () {
            a = false
        }, 500);
        _gaq.push(["_trackEvent", e, f, d])
    };
    this.Util = {
        UrlVars: function (d) {
            d = "" + d;
            var e = {};
            d.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (f, g, h) {
                e[g] = h
            });
            return e
        },
        EndsWith: function (d, e) {
            d = "" + d;
            e = "" + e;
            return d.indexOf(e, d.length - e.length) !== -1
        },
        GetAttr: function (d, e) {
            if (typeof d != "object") {
                return false
            }
            if (d.getAttribute) {
                return d.getAttribute(e)
            } else {
                if (typeof d.attributes == "object" && typeof d.attributes[e] == "string") {
                    return d.attributes[e]
                } else {
                    if (typeof d[e] != "undefined") {
                        return d[e]
                    } else {
                        return false
                    }
                }
            }
        },
        RemoveWS: function (d) {
            d = "" + d;
            return d.replace(/^\s+|\s+$/g, "").replace(/(\r\n|\n|\r)/g, " ").replace(/ +(?= )|['"]/g, "")
        },
        GetEle: function (f, d, e) {
            d = (typeof d == "object") ? d.srcElement : false;
            while (typeof d == "object" && d.nodeName != e) {
                d = d.parentNode
            }
            return (f != window) ? f : d
        }
    }
});
if (window.attachEvent) {
    window.attachEvent("onload", GAEvents.addListeners)
} else {
    if (window.onload) {
        var curOnload = window.onload;
        var newOnload = function () {
            curOnload();
            GAEvents.addListeners()
        };
        window.onload = newOnload
    } else {
        window.onload = GAEvents.addListeners
    }
}
setTimeout(GAEvents.addListeners, 3000);