var CALCIMG_URLPREFIX = "";

function updateOptionsDisplay(c, b) {
    if (c == "simple") {
        var a = ["interest", "rates", "years"];
        var d = $("#calcTableBody")
    } else {
        if (c == "debtrepayment") {
            var a = ["balance", "debtRates", "payments"];
            var d = $("#Calc2")
        } else {
            throw new Exception("Unknown calculator type")
        }
    }
    $(a).each(function (e, g) {
        var h = $("#" + g + "Header");
        var f = $("#" + g + "Btn");
        if (b == g) {
            h.addClass("selected");
            f.attr("src", CALCIMG_URLPREFIX + g + "Inactive.png");
            f.css("cursor", "default")
        } else {
            h.removeClass("selected");
            f.attr("src", CALCIMG_URLPREFIX + g + "Active.png");
            f.css("cursor", "pointer")
        }
    });
    if (d.css("display") == "none") {
        d.css("display", "block");
        d.css("padding-bottom", "20px")
    }
}
function LoanValues() {
    this.loan = parseFloat($("#loanVal").val());
    this.yearlyRate = parseFloat($("#rateVal").val());
    this.year = parseFloat($("#monthVal").val());
    this.pay = calculateMoPayment(this.loan, this.yearlyRate, this.year)
}
LoanValues.prototype.invalid = function () {
    return !this.loan || !this.yearlyRate || !this.year || this.loan < 0 || this.yearlyRate < 0 || this.year < 0
};

function calculateMoPayment(c, b, d) {
    var a = d * 12;
    var e = b / 1200;
    return c * (e / (1 - (Math.pow((1 + e), -a))))
}
function updateMoPay(c, f, b, a, d) {
    var e = calculateMoPayment(b, a, d);
    $("#colMoPay" + f + c).html(formatCurrency(e))
}
function updateLoanResults(l) {
    var k = new LoanValues();
    if (k.invalid()) {
        alert("Please provide non-zero values for loan amount, interest rate, and number of years");
        return
    }
    $("#colAmountBox").html(formatCurrency(k.loan));
    $("#colInterestBox").html(k.yearlyRate + "%");
    $("#colYearsBox").html(k.year);
    var n = $("#payVal");
    n.html(formatCurrency(k.pay));
    if (n) {
        n.css("font-weight", "700");
        n.css("color", "#000000");
        n.css("font-size", "20px");
        n.css("padding", "0");
        n.css("padding", ".52em 0")
    }
    if (l == "interest") {
        var h = function (o) {
            $("#colAmountMinus" + o).html(formatCurrency(k.loan - k.loan * (o / 100)));
            $("#colAmountMinus" + o).css("background-color", "#f1ffed")
        };
        var d = function (o) {
            $("#colIntMinus" + o).html(k.yearlyRate + "%");
            $("#colIntMinus" + o).css("background-color", "#ffffff")
        };
        var g = function (o) {
            $("#colYearMinus" + o).html(k.year);
            $("#colYearMinus" + o).css("background-color", "#ffffff")
        };
        var b = function (o) {
            updateMoPay(o, "Minus", k.loan - k.loan * (o / 100), k.yearlyRate, k.year)
        };
        var c = function (o) {
            $("#colAmountPlus" + o).html(formatCurrency(k.loan + k.loan * (o / 100)));
            $("#colAmountPlus" + o).css("background-color", "#f1ffed")
        };
        var a = function (o) {
            $("#colIntPlus" + o).html(k.yearlyRate + "%");
            $("#colIntPlus" + o).css("background-color", "#ffffff")
        };
        var e = function (o) {
            $("#colYearPlus" + o).html(k.year);
            $("#colYearPlus" + o).css("background-color", "#ffffff")
        };
        var j = function (o) {
            updateMoPay(o, "Plus", k.loan + k.loan * (o / 100), k.yearlyRate, k.year)
        }
    } else {
        if (l == "rates") {
            var m = function (p, o) {
                if (o) {
                    var r = 1
                } else {
                    var r = -1
                }
                var q = parseFloat(k.yearlyRate + (r * k.yearlyRate * (p / 100)));
                return q.toFixed(2)
            };
            var h = function (o) {
                $("#colAmountMinus" + o).html(formatCurrency(k.loan));
                $("#colAmountMinus" + o).css("background-color", "#fff")
            };
            var d = function (o) {
                $("#colIntMinus" + o).html(m(o, false) + "%");
                $("#colIntMinus" + o).css("background-color", "#f1ffed")
            };
            var g = function (o) {
                $("#colYearMinus" + o).html(k.year);
                $("#colYearMinus" + o).css("background-color", "#fff")
            };
            var b = function (o) {
                updateMoPay(o, "Minus", k.loan, m(o, false), k.year)
            };
            var c = function (o) {
                $("#colAmountPlus" + o).html(formatCurrency(k.loan));
                $("#colAmountPlus" + o).css("background-color", "#ffffff")
            };
            var a = function (o) {
                $("#colIntPlus" + o).html(m(o, true) + "%");
                $("#colIntPlus" + o).css("background-color", "#f1ffed")
            };
            var e = function (o) {
                $("#colYearPlus" + o).html(k.year);
                $("#colYearPlus" + o).css("background-color", "#ffffff")
            };
            var j = function (o) {
                updateMoPay(o, "Plus", k.loan, m(o, true), k.year)
            }
        } else {
            if (l == "years") {
                var h = function (o) {
                    $("#colAmountMinus" + o).html(formatCurrency(k.loan));
                    $("#colAmountMinus" + o).css("background-color", "#ffffff")
                };
                var d = function (o) {
                    $("#colIntMinus" + o).html((parseFloat(k.yearlyRate).toFixed(2)) + "%");
                    $("#colIntMinus" + o).css("background-color", "#ffffff")
                };
                var g = function (o) {
                    $("#colYearMinus" + o).html(k.year - k.year * (o / 100));
                    $("#colYearMinus" + o).css("background-color", "#f1ffed")
                };
                var b = function (o) {
                    updateMoPay(o, "Minus", k.loan, k.yearlyRate, k.year - k.year * (o / 100))
                };
                var c = function (o) {
                    $("#colAmountPlus" + o).html(formatCurrency(k.loan));
                    $("#colAmountPlus" + o).css("background-color", "#ffffff")
                };
                var a = function (o) {
                    $("#colIntPlus" + o).html((parseFloat(k.yearlyRate).toFixed(2)) + "%");
                    $("#colIntPlus" + o).css("background-color", "#ffffff")
                };
                var e = function (o) {
                    $("#colYearPlus" + o).html(k.year + k.year * (o / 100));
                    $("#colYearPlus" + o).css("background-color", "#f1ffed")
                };
                var j = function (o) {
                    updateMoPay(o, "Plus", k.loan, k.yearlyRate, k.year + k.year * (o / 100))
                }
            }
        }
    }
    for (var f = 15; f >= 5; f -= 5) {
        h(f);
        d(f);
        g(f);
        b(f);
        c(f);
        a(f);
        e(f);
        j(f)
    }
    updateOptionsDisplay("simple", l)
}
function updateAffordability() {
    var g = parseFloat($("#income").val());
    var c = parseFloat($("#debtpmts").val());
    var f = parseFloat($("#downpmt").val());
    var e = parseFloat($("#intrrate").val());
    var d = new LoanStats(g, c, f, e);
    if (!d.isReady()) {
        alert("Please provide values for monthly income, down payment, debt payments, and interest rate.");
        return
    }
    if (d.totalMonthlyPayment <= 0 || d.loanAmt <= 0) {
        alert("Your monthly debt to income ratio is too high. Please reduce your debt payments and try again.");
        return
    }
    $("#calcResults").css("display", "none");
    $("#Calc3").css("display", "block");
    var a = formatCurrency(d.totalMonthlyPayment);
    $("#pmi").html(formatCurrency(d.pmi));
    $("#monthlyTotal").html(a);
    $("#monthlyPrinc").html(formatCurrency(d.monthlyPrincAndIntr));
    $("#loanAmount").html(formatCurrency(d.loanAmt));
    $("#homeowners").html(formatCurrency(LoanStats.insurance));
    $("#proptax").html(formatCurrency(LoanStats.propertyTaxes));
    $("#homePurchasePrice").html(formatCurrency(d.maxAllowableHouseValue));
    $("#downPaymentPrcnt").html(d.downPmtPercentage + "%");
    var b = $("#monthlyPayments");
    b.html(a);
    if (b) {
        b.css("font-weight", "700");
        b.css("color", "#000000");
        b.css("font-size", "20px");
        b.css("padding", "0");
        b.css("padding", ".52em 0")
    }
}
function LoanStats(d, a, c, b) {
    this.mortgageInterestRate = b / (12 * 100);
    this.monthlyIncome = d;
    this.debtPmts = a;
    this.downPmt = c;
    this.totalMonthlyPayment = this.monthlyIncome * 0.39 - this.debtPmts;
    if (this.downPmt == false) {
        this.downPmt = 0
    }
    if (this.debtPmts == false) {
        this.debtPmts = 0
    }
    this.pmi = 0;
    this.calcLoanAmtStats();
    if (this.downPmtPercentage < 20) {
        this.pmi = this.loanAmt / 100000 * 75;
        this.calcLoanAmtStats()
    }
}
LoanStats.prototype.calcLoanAmtStats = function () {
    this.monthlyPrincAndIntr = this.totalMonthlyPayment - this.pmi - LoanStats.insurance - LoanStats.propertyTaxes;
    this.loanAmt = (this.monthlyPrincAndIntr) * (1 - Math.pow(1 + this.mortgageInterestRate, -LoanStats.duration)) / this.mortgageInterestRate;
    this.maxAllowableHouseValue = this.loanAmt + this.downPmt;
    var a = 100 * this.downPmt / this.maxAllowableHouseValue;
    this.downPmtPercentage = Math.round(a)
};
LoanStats.prototype.isReady = function () {
    if (!this.monthlyIncome || this.monthlyIncome < 800 || !this.mortgageInterestRate || isNaN(this.loanAmt)) {
        return false
    }
    return true
};
LoanStats.propertyTaxes = 292;
LoanStats.insurance = 41;
LoanStats.duration = 360;

function DebtValues() {
    this.balance = parseFloat($("#balanceVal").val());
    this.yearlyRate = parseFloat($("#debtRateVal").val());
    this.fixedPmt = parseFloat($("#debtMonthVal").val());
    this.payoffMonths = parseFloat($("#payoffTime").val())
}
DebtValues.prototype.invalid = function () {
    return !this.balance || !this.yearlyRate || (!this.fixedPmt && !this.payoffMonths) || this.balance < 0 || this.yearlyRate < 0 || (this.fixedPmt < 0 || this.payoffMonths < 0)
};
DebtValues.prototype.updateRow = function (g, n, m, c, o) {
    m = m || this.balance;
    c = c || this.yearlyRate;
    o = o || this.fixedPmt;
    m = Math.round(m);
    c = Math.round(c * 100) / 100;
    o = Math.round(o);
    var k = calculatePayoffTime(m, c, o);
    if (isNaN(k)) {
        k = "Payment is too low"
    } else {
        k += " months"
    }
    var d = $("#colBalance" + g);
    d.html(formatCurrency(m));
    var b = $("#colInt" + g);
    b.html(c + "%");
    var h = $("#colPayments" + g);
    h.html(formatCurrency(o));
    var e = $("#colMoToPay" + g);
    e.html(k);
    var a;
    switch (n) {
        case "balance":
            a = d;
            var l = [b, h];
            break;
        case "int":
            a = b;
            var l = [d, h];
            break;
        default:
            a = h;
            var l = [d, b];
            break
    }
    var f;
    for (f = 0; f < l.length; f++) {
        l[f].css("background-color", "#ffffff")
    }
    a.css("background-color", "#f1ffed")
};

function calculatePayoffTime(d, a, c) {
    var b = a / 1200;
    return Math.round(Math.log(1 - (d / c) * b) / Math.log(1 + b)) * -1
}
function calculateMinimumPayment(f, c, b, a) {
    var e = c / 1200;
    var d = f * e / (1 - (Math.pow((1 + e), -b)));
    if (!a) {
        return Math.round(d)
    } else {
        return d
    }
}
var gHaveRunDebtRepayment = false;
var gDataDebtRepayment = "";
var gDataDebtRepaymentArray = {};

function updateDebtResults(j) {
    var h = new DebtValues();
    if (h.invalid()) {
        alert("Please provide non-zero values for balance amount, interest rate, and amount of monthly payments");
        return
    }
    if (!h.fixedPmt) {
        h.fixedPmt = calculateMinimumPayment(h.balance, h.yearlyRate, h.payoffMonths)
    }
    var f = calculatePayoffTime(h.balance, h.yearlyRate, h.fixedPmt);
    if (isNaN(f) || (f == Infinity)) {
        var a = calculateMinimumPayment(h.balance, h.yearlyRate, 36);
        alert("Expected monthly payment is too low. For example, the minimum payment on a 36 month plan would be $" + a);
        return
    }
    var e, k, m = h.balance,
        l = h.yearlyRate / 1200;
    var g, b = 0,
        p = 0;
    for (e = 1; e <= f; e++) {
        k = m * l;
        g = h.fixedPmt - k;
        m = m - g;
        b += k;
        p += g
    }
    var d = Math.round(p);
    var o = Math.round(b);
    gDataDebtRepayment = "Principal;" + d + "\nInterest;" + o;
    gDataDebtRepaymentObj = [{
        name: "Principle",
        value: d
    }, {
        name: "Interest",
        value: o
    }];
    $("#chartprincipal").html(formatCurrency(d));
    $("#chartinterest").html(formatCurrency(o));
    $("#CalcGraphs").css("display", "block");
    $("#CalcGraphsInactive").css("display", "none");
    $("#balance").html(formatCurrency(h.balance));
    $("#interestRate").html(h.yearlyRate + "%");
    $("#expectedMonthlyPayment").html(formatCurrency(h.fixedPmt));
    var c = $("#payoffTimeSummary");
    c.html(f + " months");
    c.css("font-size", "21px");
    c.css("font-weight", "bold");
    $("#payoffOptions").html("Click on a column to see results for similar loan amounts, interest rates, and durations");
    if (j == "balance") {
        var n = function (q) {
            h.updateRow(q, "balance", h.balance + (h.balance * q / 100), null, null)
        }
    } else {
        if (j == "debtRates") {
            var n = function (q) {
                h.updateRow(q, "int", null, h.yearlyRate + (h.yearlyRate * q / 100), null)
            }
        } else {
            var n = function (q) {
                h.updateRow(q, "fixedpmt", null, null, h.fixedPmt + (h.fixedPmt * q / 100))
            }
        }
    }
    for (var e = 30; e >= -30; e -= 10) {
        if (e) {
            n(e)
        }
    }
    if (gHaveRunDebtRepayment) {
        prepAmDebtRepayment(gDataDebtRepaymentObj, "debtChart", "data")
    } else {
        gHaveRunDebtRepayment = true;
        prepAmDebtRepayment(gDataDebtRepaymentObj, "debtChart", "data")
    }
    updateOptionsDisplay("debtrepayment", j)
}
function debtRepaymentInputChg(a) {
    if (a == "debtMonthVal") {
        var b = "payoffTime"
    } else {
        var b = "debtMonthVal"
    }
    if (getNumber(a)) {
        $("#" + a + "Label").removeClass("payoffInactive");
        $("#" + b + "Label").addClass("payoffInactive");
        $("#" + b).val("")
    } else {
        $("#" + a + "Label").addClass("payoffInactive");
        if (getNumber(b)) {
            $("#" + b + "Label").removeClass("payoffInactive")
        }
    }
}
var gHaveRunAmortization = false;
var gDataAmortization = "";
var gDataIntrPrin = "";
var gDataIntrPrinMaxPmt = "";
var gDataAmortizationJs = new Array();
var gDataPrincipleJs = new Array();

function amortization() {
    gDataAmortizationJs = new Array();
    gDataPrincipleJs = new Array();
    var c = parseFloat($("#loanVal").val());
    var b = parseFloat($("#rateVal").val());
    var d = parseFloat($("#monthVal").val());
    var a = d * 12;
    $("#loanAmortizationChart").css("display", "block");
    $("#principalPaymentChart").css("display", "block");
    $("#scrollableDiv").css("display", "block");
    $("#loanAmortizationChartStatic").css("display", "none");
    $("#principalPaymentChartStatic").css("display", "none");
    $("#amortizationNote").css("display", "none");
    if (!c || !b || !d) {
        alert("Please provide non-zero values for Loan Amount, Interest Rate, and Number of Years");
        return
    }
    if (c < 0 || b < 0 || d < 0) {
        alert("Please provide positive values for Loan Amount, Interest Rate, and Number of Years");
        return
    }
    if (b >= 100) {
        alert("Please provide an interest rate that is less than 100%.");
        return
    }
    calcAmorMoPmt(c, b, a);
    $("#Calc2").css("display", "block");
    if (gHaveRunAmortization) {
        prepAmAmortization(gDataAmortizationJs, "BalChart", true);
        prepAmPrinciplePayment(gDataPrincipleJs, "PrincipleChart", gDataIntrPrinMaxPmt, true)
    } else {
        prepAmAmortization(gDataAmortizationJs, "BalChart");
        prepAmPrinciplePayment(gDataPrincipleJs, "PrincipleChart", gDataIntrPrinMaxPmt);
        gHaveRunAmortization = true
    }
}
function calcAmorMoPmt(r, d, m) {
    var e = formatCurrency(r);
    var l = d / 1200;
    var h = calculateMinimumPayment(r, d, m, true);
    var j = formatCurrency(Math.round(h));
    var p = 1;
    var f = 0;
    var b = 0;
    var a;
    var o = $('<tbody id="fullTableBody"></tbody>');
    var s = new Date();
    gDataAmortization = "";
    gDataIntrPrin = "";
    gDataIntrPrinMaxPmt = Math.round(h);
    var c = 0;
    var q = 0;
    var k = 0;
    for (p = 1; p <= m; p++) {
        s.setMonth(s.getMonth() + 1);
        f = r * l;
        b = h - f;
        r = r - b;
        a = $("<tr></tr>");
        addElementWithText(a, p + " - " + translateMonth(s.getMonth()) + " " + s.getFullYear(), $('<td width="250" style="text-align:left;padding-left:5px;font-weight:700"></td>'));
        addElementWithText(a, j, $('<td width="150"></td>'));
        addElementWithText(a, formatCurrency(Math.round(f)), $('<td width="150"></td>'));
        addElementWithText(a, formatCurrency(Math.round(b)), $('<td width="150"></td>'));
        addElementWithText(a, "", $('<td width="7" style+"border-top:none;border-bottom:none;background-color:#fff;"></td>'));
        addElementWithText(a, formatCurrency(Math.round(r)), $('<td width="170"></td>'));
        o.append(a);
        c += f;
        q += b;
        if (p % 12 == 0) {
            k = p / 12;
            gDataAmortization += k + ";" + Math.round(c) + ";" + Math.round(q) + ";" + Math.round(r) + "\n";
            gDataIntrPrin += k + ";" + Math.round(f) + "\n";
            gDataAmortizationJs.push({
                year: k,
                interest: Math.round(c),
                principle: Math.round(q),
                amount: Math.round(r)
            });
            gDataPrincipleJs.push({
                year: k,
                interest: Math.round(f)
            })
        }
    }
    $("#colAmountBox").html(j);
    $("#colInterestBox").html(Math.ceil(m));
    $("#colYearsBox").html(formatCurrency(Math.round(m * h)));
    var n = $("#payVal");
    n.html(e);
    n.css("font-size", "20px");
    n.css("font-weight", "bold");
    var g = $("#fullTableBody");
    if (g) {
        $(g).remove()
    }
    $("#fullTable").append(o)
}
function amReturnData(a, b) {
    alert("chart id: " + a + ", data: " + b)
}
function handleEnterKey(c, a) {
    if (c.keyCode && c.keyCode == 13) {
        var b = new Array();
        for (var d = 0; d < arguments.length; d++) {
            if (d > 1) {
                b.push(arguments[d])
            }
        }
        window[a](b);
        return false
    } else {
        return true
    }
};