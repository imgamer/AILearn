//# sourceMappingURL=prettify_compiled.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
};
(function() {
    window.PR_SHOULD_USE_CONTINUATION = !0;
    window.PR_TAB_WIDTH = 8;
    window.PR_normalizedHtml = void 0;
    window.PR = void 0;
    window.prettyPrintOne = void 0;
    window.prettyPrint = void 0;
    window._pr_isIE6 = function() {
        var B = navigator && navigator.userAgent && navigator.userAgent.match(/\bMSIE ([678])\./);
        B = B ? +B[1] : !1;
        window._pr_isIE6 = function() {
            return B
        }
        ;
        return B
    }
    ;
    (function() {
        function B(b) {
            return b.replace(J, "&amp;").replace(K, "&lt;").replace(L, "&gt;")
        }
        function G(b, f, h) {
            switch (b.nodeType) {
            case 1:
                var l = b.tagName.toLowerCase();
                f.push("<", l);
                var p = b.attributes
                  , x = p.length;
                if (x) {
                    if (h) {
                        for (var t = [], n = x; 0 <= --n; )
                            t[n] = p[n];
                        t.sort(function(k, u) {
                            return k.name < u.name ? -1 : k.name === u.name ? 0 : 1
                        });
                        p = t
                    }
                    for (n = 0; n < x; ++n)
                        t = p[n],
                        t.specified && f.push(" ", t.name.toLowerCase(), '="', t.value.replace(J, "&amp;").replace(K, "&lt;").replace(L, "&gt;").replace(S, "&quot;"), '"')
                }
                f.push(">");
                for (p = b.firstChild; p; p = p.nextSibling)
                    G(p, f, h);
                !b.firstChild && /^(?:br|link|img)$/.test(l) || f.push("</", l, ">");
                break;
            case 3:
            case 4:
                f.push(B(b.nodeValue))
            }
        }
        function M(b) {
            function f(c) {
                if ("\\" !== c.charAt(0))
                    return c.charCodeAt(0);
                switch (c.charAt(1)) {
                case "b":
                    return 8;
                case "t":
                    return 9;
                case "n":
                    return 10;
                case "v":
                    return 11;
                case "f":
                    return 12;
                case "r":
                    return 13;
                case "u":
                case "x":
                    return parseInt(c.substring(2), 16) || c.charCodeAt(1);
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                    return parseInt(c.substring(1), 8);
                default:
                    return c.charCodeAt(1)
                }
            }
            function h(c) {
                if (32 > c)
                    return (16 > c ? "\\x0" : "\\x") + c.toString(16);
                c = String.fromCharCode(c);
                if ("\\" === c || "-" === c || "[" === c || "]" === c)
                    c = "\\" + c;
                return c
            }
            function l(c) {
                var d = c.substring(1, c.length - 1).match(/\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\s\S]|-|[^-\\]/g);
                c = [];
                for (var a = [], q = "^" === d[0], e = q ? 1 : 0, m = d.length; e < m; ++e) {
                    var g = d[e];
                    switch (g) {
                    case "\\B":
                    case "\\b":
                    case "\\D":
                    case "\\d":
                    case "\\S":
                    case "\\s":
                    case "\\W":
                    case "\\w":
                        c.push(g);
                        continue
                    }
                    g = f(g);
                    if (e + 2 < m && "-" === d[e + 1]) {
                        var v = f(d[e + 2]);
                        e += 2
                    } else
                        v = g;
                    a.push([g, v]);
                    65 > v || 122 < g || (65 > v || 90 < g || a.push([Math.max(65, g) | 32, Math.min(v, 90) | 32]),
                    97 > v || 122 < g || a.push([Math.max(97, g) & -33, Math.min(v, 122) & -33]))
                }
                a.sort(function(A, C) {
                    return A[0] - C[0] || C[1] - A[1]
                });
                d = [];
                g = [NaN, NaN]; 
                for (e = 0; e < a.length; ++e)
                    m = a[e],
                    m[0] <= g[1] + 1 ? g[1] = Math.max(g[1], m[1]) : d.push(g = m);
                a = ["["];
                q && a.push("^");
                a.push.apply(a, c);
                for (e = 0; e < d.length; ++e)
                    m = d[e],
                    a.push(h(m[0])),
                    m[1] > m[0] && (m[1] + 1 > m[0] && a.push("-"),
                    a.push(h(m[1])));
                a.push("]");
                return a.join("")
            }
            function p(c) {
                for (var d = c.source.match(/(?:\[(?:[^\x5C\x5D]|\\[\s\S])*\]|\\u[A-Fa-f0-9]{4}|\\x[A-Fa-f0-9]{2}|\\[0-9]+|\\[^ux0-9]|\(\?[:!=]|[\(\)\^]|[^\x5B\x5C\(\)\^]+)/g), a = d.length, q = [], e = 0, m = 0; e < a; ++e) {
                    var g = d[e];
                    "(" === g ? ++m : "\\" === g.charAt(0) && (g = +g.substring(1)) && g <= m && (q[g] = -1)
                }
                for (e = 1; e < q.length; ++e)
                    -1 === q[e] && (q[e] = ++x);
                for (m = e = 0; e < a; ++e)
                    g = d[e],
                    "(" === g ? (++m,
                    void 0 === q[m] && (d[e] = "(?:")) : "\\" === g.charAt(0) && (g = +g.substring(1)) && g <= m && (d[e] = "\\" + q[m]);
                for (m = e = 0; e < a; ++e)
                    "^" === d[e] && "^" !== d[e + 1] && (d[e] = "");
                if (c.ignoreCase && t)
                    for (e = 0; e < a; ++e)
                        g = d[e],
                        c = g.charAt(0),
                        2 <= g.length && "[" === c ? d[e] = l(g) : "\\" !== c && (d[e] = g.replace(/[a-zA-Z]/g, function(v) {
                            v = v.charCodeAt(0);
                            return "[" + String.fromCharCode(v & -33, v | 32) + "]"
                        }));
                return d.join("")
            }
            for (var x = 0, t = !1, n = !1, k = 0, u = b.length; k < u; ++k) {
                var w = b[k];
                if (w.ignoreCase)
                    n = !0;
                else if (/[a-z]/i.test(w.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
                    t = !0;
                    n = !1;
                    break
                }
            }
            var r = [];
            k = 0;
            for (u = b.length; k < u; ++k) {
                w = b[k];
                if (w.global || w.multiline)
                    throw Error("" + w);
                r.push("(?:" + p(w) + ")")
            }
            return new RegExp(r.join("|"),n ? "gi" : "g")
        }
        function T(b) {
            var f = 0;
            return function(h) {
                for (var l = null, p = 0, x = 0, t = h.length; x < t; ++x)
                    switch (h.charAt(x)) {
                    case "\t":
                        l || (l = []);
                        l.push(h.substring(p, x));
                        p = b - f % b;
                        for (f += p; 0 <= p; p -= 16)
                            l.push("                ".substring(0, p));
                        p = x + 1;
                        break;
                    case "\n":
                        f = 0;
                        break;
                    default:
                        ++f
                    }
                if (!l)
                    return h;
                l.push(h.substring(p));
                return l.join("")
            }
        }
        function H(b, f, h, l) {
            f && (b = {
                source: f,
                basePos: b
            },
            h(b),
            l.push.apply(l, b.decorations))
        }
        function D(b, f) {
            var h = {}, l;
            (function() {
                for (var t = b.concat(f), n = [], k = {}, u = 0, w = t.length; u < w; ++u) {
                    var r = t[u]
                      , c = r[3];
                    if (c)
                        for (var d = c.length; 0 <= --d; )
                            h[c.charAt(d)] = r;
                    r = r[1];
                    c = "" + r;
                    k.hasOwnProperty(c) || (n.push(r),
                    k[c] = null)
                }
                n.push(/[\0-\uffff]/);
                l = M(n)
            }
            )();
            var p = f.length
              , x = function(t) {
                var n = t.source
                  , k = t.basePos
                  , u = [k, "pln"]
                  , w = 0;
                n = n.match(l) || [];
                for (var r = {}, c = 0, d = n.length; c < d; ++c) {
                    var a = n[c]
                      , q = r[a]
                      , e = void 0;
                    if ("string" === typeof q)
                        var m = !1;
                    else {
                        var g = h[a.charAt(0)];
                        if (g)
                            e = a.match(g[1]),
                            q = g[0];
                        else {
                            for (m = 0; m < p; ++m)
                                if (g = f[m],
                                e = a.match(g[1])) {
                                    q = g[0];
                                    break
                                }
                            e || (q = "pln")
                        }
                        !(m = 5 <= q.length && "lang-" === q.substring(0, 5)) || e && "string" === typeof e[1] || (m = !1,
                        q = "src");
                        m || (r[a] = q)
                    }
                    g = w;
                    w += a.length;
                    if (m) {
                        m = e[1];
                        var v = a.indexOf(m)
                          , A = v + m.length;
                        e[2] && (A = a.length - e[2].length,
                        v = A - m.length);
                        q = q.substring(5);
                        H(k + g, a.substring(0, v), x, u);
                        H(k + g + v, m, N(q, m), u);
                        H(k + g + A, a.substring(A), x, u)
                    } else
                        u.push(k + g, q)
                }
                t.decorations = u
            };
            return x
        }
        function z(b) {
            var f = []
              , h = [];
            b.tripleQuotedStrings ? f.push(["str", /^(?:'''(?:[^'\\]|\\[\s\S]|'{1,2}(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\s\S]|"{1,2}(?=[^"]))*(?:"""|$)|'(?:[^\\']|\\[\s\S])*(?:'|$)|"(?:[^\\"]|\\[\s\S])*(?:"|$))/, null, "'\""]) : b.multiLineStrings ? f.push(["str", /^(?:'(?:[^\\']|\\[\s\S])*(?:'|$)|"(?:[^\\"]|\\[\s\S])*(?:"|$)|`(?:[^\\`]|\\[\s\S])*(?:`|$))/, null, "'\"`"]) : f.push(["str", /^(?:'(?:[^\\'\r\n]|\\.)*(?:'|$)|"(?:[^\\"\r\n]|\\.)*(?:"|$))/, null, "\"'"]);
            b.verbatimStrings && h.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, null]);
            var l = b.hashComments;
            l && (b.cStyleComments ? (1 < l ? f.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#"]) : f.push(["com", /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#"]),
            h.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, null])) : f.push(["com", /^#[^\r\n]*/, null, "#"]));
            b.cStyleComments && (h.push(["com", /^\/\/[^\r\n]*/, null]),
            h.push(["com", /^\/\*[\s\S]*?(?:\*\/|$)/, null]));
            b.regexLiterals && h.push(["lang-regex", new RegExp("^" + U + "(/(?=[^/*])(?:[^/\\x5B\\x5C]|\\x5C[\\s\\S]|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+/)")]);
            b = b.keywords.replace(/^\s+|\s+$/g, "");
            b.length && h.push(["kwd", new RegExp("^(?:" + b.replace(/\s+/g, "|") + ")\\b"), null]);
            f.push(["pln", /^\s+/, null, " \r\n\t\u00a0"]);
            h.push(["lit", /^@[a-z_$][a-z_$@0-9]*/i, null], ["typ", /^@?[A-Z]+[a-z][A-Za-z_$@0-9]*/, null], ["pln", /^[a-z_$][a-z_$@0-9]*/i, null], ["lit", /^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i, null, "0123456789"], ["pun", /^.[^\s\w\.$@'"`\/#]*/, null]);
            return D(f, h)
        }
        function V(b) {
            function f(E) {
                if (E > k) {
                    u && u !== w && (n.push("</span>"),
                    u = null);
                    !u && w && (u = w,
                    n.push('<span class="', u, '">'));
                    var O = B(d(h.substring(k, E))).replace(g ? q : a, "$1&#160;");
                    g = m.test(O);
                    n.push(O.replace(e, P));
                    k = E
                }
            }
            var h = b.source
              , l = b.extractedTags
              , p = b.decorations
              , x = b.numberLines
              , t = b.sourceNode
              , n = []
              , k = 0
              , u = null
              , w = null
              , r = 0
              , c = 0
              , d = T(window.PR_TAB_WIDTH)
              , a = /([\r\n ]) /g
              , q = /(^| ) /gm
              , e = /\r\n?|\n/g
              , m = /[ \r\n]$/
              , g = !0
              , v = window._pr_isIE6();
            t = v ? t && "PRE" === t.tagName ? 6 === v ? "&#160;\r\n" : 7 === v ? "&#160;<br />\r" : 8 === v ? "&#160;<br />" : "&#160;\r" : "&#160;<br />" : "<br />";
            if (x) {
                var A = [];
                for (v = 0; 10 > v; ++v)
                    A[v] = t + '</li><li class="L' + v + '">';
                var C = "number" === typeof x ? x - 1 : 0;
                n.push('<ol class="linenums"><li class="L', C % 10, '"');
                C && n.push(' value="', C + 1, '"');
                n.push(">");
                var P = function() {
                    var E = A[++C % 10];
                    return u ? "</span>" + E + '<span class="' + u + '">' : E
                }
            } else
                P = t;
            for (; ; )
                if (t = r < l.length ? c < p.length ? l[r] <= p[c] : !0 : !1)
                    f(l[r]),
                    u && (n.push("</span>"),
                    u = null),
                    n.push(l[r + 1]),
                    r += 2;
                else if (c < p.length)
                    f(p[c]),
                    w = p[c + 1],
                    c += 2;
                else
                    break;
            f(h.length);
            u && n.push("</span>");
            x && n.push("</li></ol>");
            b.prettyPrintedHtml = n.join("")
        }
        function y(b, f) {
            for (var h = f.length; 0 <= --h; ) {
                var l = f[h];
                F.hasOwnProperty(l) ? "console"in window && console.warn("cannot override language handler %s", l) : F[l] = b
            }
        }
        function N(b, f) {
            b && F.hasOwnProperty(b) || (b = /^\s*</.test(f) ? "default-markup" : "default-code");
            return F[b]
        }
        function Q(b) {
            var f = b.sourceCodeHtml
              , h = b.langExtension;
            b.prettyPrintedHtml = f;
            try {
                var l = f.match(W);
                f = [];
                var p = 0
                  , x = [];
                if (l)
                    for (var t = 0, n = l.length; t < n; ++t) {
                        var k = l[t];
                        if (1 < k.length && "<" === k.charAt(0)) {
                            if (!X.test(k))
                                if (Y.test(k))
                                    f.push(k.substring(9, k.length - 3)),
                                    p += k.length - 12;
                                else if (Z.test(k))
                                    f.push("\n"),
                                    ++p;
                                else if (0 <= k.indexOf("nocode") && k.replace(/\s(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g, ' $1="$2$3$4"').match(/[cC][lL][aA][sS][sS]="[^"]*\bnocode\b/)) {
                                    var u = k.match(R)[2]
                                      , w = 1
                                      , r = t + 1;
                                    a: for (; r < n; ++r) {
                                        var c = l[r].match(R);
                                        if (c && c[2] === u)
                                            if ("/" === c[1]) {
                                                if (0 === --w)
                                                    break a
                                            } else
                                                ++w
                                    }
                                    r < n ? (x.push(p, l.slice(t, r + 1).join("")),
                                    t = r) : x.push(p, k)
                                } else
                                    x.push(p, k)
                        } else {
                            w = k;
                            var d = w.indexOf("&");
                            if (0 > d)
                                var a = w;
                            else {
                                for (--d; 0 <= (d = w.indexOf("&#", d + 1)); ) {
                                    var q = w.indexOf(";", d);
                                    if (0 <= q) {
                                        var e = w.substring(d + 3, q);
                                        r = 10;
                                        e && "x" === e.charAt(0) && (e = e.substring(1),
                                        r = 16);
                                        var m = parseInt(e, r);
                                        isNaN(m) || (w = w.substring(0, d) + String.fromCharCode(m) + w.substring(q + 1))
                                    }
                                }
                                a = w.replace(aa, "<").replace(ba, ">").replace(ca, "'").replace(da, '"').replace(ea, " ").replace(fa, "&")
                            }
                            f.push(a);
                            p += a.length
                        }
                    }
                var g = f.join("");
                b.source = g;
                b.basePos = 0;
                b.extractedTags = x;
                N(h, g)(b);
                V(b)
            } catch (v) {
                "console"in window && console.log(v && v.stack ? v.stack : v)
            }
        }
        var U = function() {
            for (var b = "! != !== # % %= & && &&= &= ( * *= += , -= -> / /= : :: ; < << <<= <= = == === > >= >> >>= >>> >>>= ? @ [ ^ ^= ^^ ^^= { | |= || ||= ~ break case continue delete do else finally instanceof return throw try typeof".split(" "), f = "(?:^^|[+-]", h = 0; h < b.length; ++h)
                f += "|" + b[h].replace(/([^=<>:&a-z])/g, "\\$1");
            return f + ")\\s*"
        }()
          , J = /&/g
          , K = /</g
          , L = />/g
          , S = /"/g
          , aa = /&lt;/g
          , ba = /&gt;/g
          , ca = /&apos;/g
          , da = /&quot;/g
          , fa = /&amp;/g
          , ea = /&nbsp;/g
          , ha = /[\r\n]/g
          , I = null
          , W = /[^<]+|\x3c!--[\s\S]*?--\x3e|<!\[CDATA\[[\s\S]*?\]\]>|<\/?[a-zA-Z](?:[^>"']|'[^']*'|"[^"]*")*>|</g
          , X = /^\x3c!--/
          , Y = /^<!\[CDATA\[/
          , Z = /^<br\b/i
          , R = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)/
          , ia = z({
            keywords: "break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual wchar_t where break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient as base by checked decimal delegate descending dynamic event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof debugger eval export function get null set undefined var with Infinity NaN caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END break continue do else for if return while and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None break continue do else for if return while alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END break continue do else for if return while case done elif esac eval fi function in local set then until ",
            hashComments: !0,
            cStyleComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        })
          , F = {};
        y(ia, ["default-code"]);
        y(D([], [["pln", /^[^<?]+/], ["dec", /^<!\w[^>]*(?:>|$)/], ["com", /^\x3c!--[\s\S]*?(?:-\->|$)/], ["lang-", /^<\?([\s\S]+?)(?:\?>|$)/], ["lang-", /^<%([\s\S]+?)(?:%>|$)/], ["pun", /^(?:<[%?]|[%?]>)/], ["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i], ["lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i], ["lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i], ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]]), "default-markup htm html mxml xhtml xml xsl".split(" "));
        y(D([["pln", /^[\s]+/, null, " \t\r\n"], ["atv", /^(?:"[^"]*"?|'[^']*'?)/, null, "\"'"]], [["tag", /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i], ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ["lang-uq.val", /^=\s*([^>'"\s]*(?:[^>'"\s\/]|\/(?=\s)))/], ["pun", /^[=<>\/]+/], ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i], ["lang-js", /^on\w+\s*=\s*'([^']+)'/i], ["lang-js", /^on\w+\s*=\s*([^"'>\s]+)/i], ["lang-css", /^style\s*=\s*"([^"]+)"/i], ["lang-css", /^style\s*=\s*'([^']+)'/i], ["lang-css", /^style\s*=\s*([^"'>\s]+)/i]]), ["in.tag"]);
        y(D([], [["atv", /^[\s\S]+/]]), ["uq.val"]);
        y(z({
            keywords: "break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename using virtual wchar_t where ",
            hashComments: !0,
            cStyleComments: !0
        }), "c cc cpp cxx cyc m".split(" "));
        y(z({
            keywords: "null true false"
        }), ["json"]);
        y(z({
            keywords: "break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient as base by checked decimal delegate descending dynamic event fixed foreach from group implicit in interface internal into is lock object out override orderby params partial readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var ",
            hashComments: !0,
            cStyleComments: !0,
            verbatimStrings: !0
        }), ["cs"]);
        y(z({
            keywords: "break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof abstract boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient ",
            cStyleComments: !0
        }), ["java"]);
        y(z({
            keywords: "break continue do else for if return while case done elif esac eval fi function in local set then until ",
            hashComments: !0,
            multiLineStrings: !0
        }), ["bsh", "csh", "sh"]);
        y(z({
            keywords: "break continue do else for if return while and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None ",
            hashComments: !0,
            multiLineStrings: !0,
            tripleQuotedStrings: !0
        }), ["cv", "py"]);
        y(z({
            keywords: "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        }), ["perl", "pl", "pm"]);
        y(z({
            keywords: "break continue do else for if return while alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END ",
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        }), ["rb"]);
        y(z({
            keywords: "break continue do else for if return while auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile catch class delete false import new operator private protected public this throw true try typeof debugger eval export function get null set undefined var with Infinity NaN ",
            cStyleComments: !0,
            regexLiterals: !0
        }), ["js"]);
        y(z({
            keywords: "all and by catch class else extends false finally for if in is isnt loop new no not null of off on or return super then true try unless until when while yes ",
            hashComments: 3,
            cStyleComments: !0,
            multilineStrings: !0,
            tripleQuotedStrings: !0,
            regexLiterals: !0
        }), ["coffee"]);
        y(D([], [["str", /^[\s\S]+/]]), ["regex"]);
        window.PR_normalizedHtml = G;
        window.prettyPrintOne = function(b, f, h) {
            b = {
                sourceCodeHtml: b,
                langExtension: f,
                numberLines: h
            };
            Q(b);
            return b.prettyPrintedHtml
        }
        ;
        window.prettyPrint = function(b) {
            function f() {
                for (var w = window.PR_SHOULD_USE_CONTINUATION ? n.now() + 250 : Infinity; k < l.length && n.now() < w; k++) {
                    var r = l[k];
                    if (r.className && 0 <= r.className.indexOf("prettyprint")) {
                        var c = r.className.match(/\blang-(\w+)\b/);
                        c && (c = c[1]);
                        for (var d = !1, a = r.parentNode; a; a = a.parentNode)
                            if (("pre" === a.tagName || "code" === a.tagName || "xmp" === a.tagName) && a.className && 0 <= a.className.indexOf("prettyprint")) {
                                d = !0;
                                break
                            }
                        if (!d) {
                            a = r;
                            null === I && (d = document.createElement("PRE"),
                            d.appendChild(document.createTextNode('<!DOCTYPE foo PUBLIC "foo bar">\n<foo />')),
                            I = !/</.test(d.innerHTML));
                            if (I)
                                if (d = a.innerHTML,
                                "XMP" === a.tagName)
                                    d = B(d);
                                else {
                                    if ("PRE" !== a.tagName && ha.test(d)) {
                                        var q = "";
                                        a.currentStyle ? q = a.currentStyle.whiteSpace : window.getComputedStyle && (q = window.getComputedStyle(a, null).whiteSpace);
                                        a = !q || "pre" === q
                                    } else
                                        a = !0;
                                    a || (d = d.replace(/(<br\s*\/?>)[\r\n]+/g, "$1").replace(/(?:[\r\n]+[ \t]*)+/g, " "))
                                }
                            else {
                                d = [];
                                for (a = a.firstChild; a; a = a.nextSibling)
                                    G(a, d);
                                d = d.join("")
                            }
                            d = d.replace(/(?:\r\n?|\n)$/, "");
                            a = r.className.match(/\blinenums\b(?::(\d+))?/);
                            u = {
                                sourceCodeHtml: d,
                                langExtension: c,
                                sourceNode: r,
                                numberLines: a ? a[1] && a[1].length ? +a[1] : !0 : !1
                            };
                            Q(u);
                            if (r = u.prettyPrintedHtml)
                                if (c = u.sourceNode,
                                "XMP" === c.tagName) {
                                    d = document.createElement("PRE");
                                    for (a = 0; a < c.attributes.length; ++a)
                                        if (q = c.attributes[a],
                                        q.specified)
                                            "class" === q.name.toLowerCase() ? d.className = q.value : d.setAttribute(q.name, q.value);
                                    d.innerHTML = r;
                                    c.parentNode.replaceChild(d, c)
                                } else
                                    c.innerHTML = r
                        }
                    }
                }
                k < l.length ? setTimeout(f, 250) : b && b()
            }
            for (var h = [document.getElementsByTagName("pre"), document.getElementsByTagName("code"), document.getElementsByTagName("xmp")], l = [], p = 0; p < h.length; ++p)
                for (var x = 0, t = h[p].length; x < t; ++x)
                    l.push(h[p][x]);
            h = null;
            var n = Date;
            n.now || (n = {
                now: function() {
                    return (new Date).getTime()
                }
            });
            var k = 0, u;
            f()
        }
        ;
        window.PR = {
            combinePrefixPatterns: M,
            createSimpleLexer: D,
            registerLangHandler: y,
            sourceDecorator: z,
            PR_ATTRIB_NAME: "atn",
            PR_ATTRIB_VALUE: "atv",
            PR_COMMENT: "com",
            PR_DECLARATION: "dec",
            PR_KEYWORD: "kwd",
            PR_LITERAL: "lit",
            PR_NOCODE: "nocode",
            PR_PLAIN: "pln",
            PR_PUNCTUATION: "pun",
            PR_SOURCE: "src",
            PR_STRING: "str",
            PR_TAG: "tag",
            PR_TYPE: "typ"
        }
    }
    )();
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_COMMENT, /^#[^\r\n]*/, null, "#"], [PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^"(?:[^"\\]|\\[\s\S])*(?:"|$)/, null, '"']], [[PR.PR_KEYWORD, /^(?:ADS|AD|AUG|BZF|BZMF|CAE|CAF|CA|CCS|COM|CS|DAS|DCA|DCOM|DCS|DDOUBL|DIM|DOUBLE|DTCB|DTCF|DV|DXCH|EDRUPT|EXTEND|INCR|INDEX|NDX|INHINT|LXCH|MASK|MSK|MP|MSU|NOOP|OVSK|QXCH|RAND|READ|RELINT|RESUME|RETURN|ROR|RXOR|SQUARE|SU|TCR|TCAA|OVSK|TCF|TC|TS|WAND|WOR|WRITE|XCH|XLQ|XXALQ|ZL|ZQ|ADD|ADZ|SUB|SUZ|MPY|MPR|MPZ|DVP|COM|ABS|CLA|CLZ|LDQ|STO|STQ|ALS|LLS|LRS|TRA|TSQ|TMI|TOV|AXT|TIX|DLY|INP|OUT)\s/, null], [PR.PR_TYPE, /^(?:-?GENADR|=MINUS|2BCADR|VN|BOF|MM|-?2CADR|-?[1-6]DNADR|ADRES|BBCON|[SE]?BANK=?|BLOCK|BNKSUM|E?CADR|COUNT\*?|2?DEC\*?|-?DNCHAN|-?DNPTR|EQUALS|ERASE|MEMORY|2?OCT|REMADR|SETLOC|SUBRO|ORG|BSS|BES|SYN|EQU|DEFINE|END)\s/, null], [PR.PR_LITERAL, /^'(?:-*(?:\w|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?)?/], [PR.PR_PLAIN, /^-*(?:[!-z_]|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0()"\\';]+/]]), ["apollo", "agc", "aea"]);
    PR.registerLangHandler(PR.createSimpleLexer([["opn", /^[\(\{\[]+/, null, "([{"], ["clo", /^[\)\}\]]+/, null, ")]}"], [PR.PR_COMMENT, /^;[^\r\n]*/, null, ";"], [PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^"(?:[^"\\]|\\[\s\S])*(?:"|$)/, null, '"']], [[PR.PR_KEYWORD, /^(?:def|if|do|let|quote|var|fn|loop|recur|throw|try|monitor-enter|monitor-exit|defmacro|defn|defn-|macroexpand|macroexpand-1|for|doseq|dosync|dotimes|and|or|when|not|assert|doto|proxy|defstruct|first|rest|cons|defprotocol|deftype|defrecord|reify|defmulti|defmethod|meta|with-meta|ns|in-ns|create-ns|import|intern|refer|alias|namespace|resolve|ref|deref|refset|new|set!|memfn|to-array|into-array|aset|gen-class|reduce|map|filter|find|nil?|empty?|hash-map|hash-set|vec|vector|seq|flatten|reverse|assoc|dissoc|list|list?|disj|get|union|difference|intersection|extend|extend-type|extend-protocol|prn)\b/, null], [PR.PR_TYPE, /^:[0-9a-zA-Z\-]+/]]), ["clj"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[ \t\r\n\f]+/, null, " \t\r\n\f"]], [[PR.PR_STRING, /^"(?:[^\n\r\f\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*"/, null], [PR.PR_STRING, /^'(?:[^\n\r\f\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*'/, null], ["lang-css-str", /^url\(([^\)"']*)\)/i], [PR.PR_KEYWORD, /^(?:url|rgb|!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i, null], ["lang-css-kw", /^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i], [PR.PR_COMMENT, /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//], [PR.PR_COMMENT, /^(?:\x3c!--|--\x3e)/], [PR.PR_LITERAL, /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i], [PR.PR_LITERAL, /^#(?:[0-9a-f]{3}){1,2}/i], [PR.PR_PLAIN, /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i], [PR.PR_PUNCTUATION, /^[^\s\w'"]+/]]), ["css"]);
    PR.registerLangHandler(PR.createSimpleLexer([], [[PR.PR_KEYWORD, /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]]), ["css-kw"]);
    PR.registerLangHandler(PR.createSimpleLexer([], [[PR.PR_STRING, /^[^\)"']+/]]), ["css-str"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_PLAIN, /^(?:"(?:[^"\\]|\\[\s\S])*(?:"|$)|'(?:[^'\\]|\\[\s\S])+(?:'|$))/, null, "\"'"]], [[PR.PR_COMMENT, /^(?:\/\/[^\r\n]*|\/\*[\s\S]*?\*\/)/], [PR.PR_PLAIN, /^(?:[^\/"']|\/(?![\/\*]))+/i]]), ["go"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\x0B\x0C\r ]+/, null, "\t\n\x0B\f\r "], [PR.PR_STRING, /^"(?:[^"\\\n\x0C\r]|\\[\s\S])*(?:"|$)/, null, '"'], [PR.PR_STRING, /^'(?:[^'\\\n\x0C\r]|\\[^&])'?/, null, "'"], [PR.PR_LITERAL, /^(?:0o[0-7]+|0x[\da-f]+|\d+(?:\.\d+)?(?:e[+\-]?\d+)?)/i, null, "0123456789"]], [[PR.PR_COMMENT, /^(?:(?:--+(?:[^\r\n\x0C]*)?)|(?:\{-(?:[^-]|-+[^-\}])*-\}))/], [PR.PR_KEYWORD, /^(?:case|class|data|default|deriving|do|else|if|import|in|infix|infixl|infixr|instance|let|module|newtype|of|then|type|where|_)(?=[^a-zA-Z0-9']|$)/, null], [PR.PR_PLAIN, /^(?:[A-Z][\w']*\.)*[a-zA-Z][\w']*/], [PR.PR_PUNCTUATION, /^[^\t\n\x0B\x0C\r a-zA-Z0-9'"]+/]]), ["hs"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_PUNCTUATION, /^[.!%&()*+,\-;<=>?\[\\\]^{|}:]+/, null, ".!%&()*+,-;<=>?[\\]^{|}:"]], [[PR.PR_KEYWORD, /^\b(package|public|protected|private|open|abstract|constructor|final|override|import|for|while|as|typealias|get|set|((data|enum|annotation|sealed) )?class|this|super|val|var|fun|is|in|throw|return|break|continue|(companion )?object|if|try|else|do|when|init|interface|typeof|suspend)\b/], [PR.PR_LITERAL, /^(?:true|false|null)\b/], [PR.PR_LITERAL, /^(0[xX][0-9a-fA-F_]+L?|0[bB][0-1]+L?|[0-9_.]+([eE]-?[0-9]+)?[fFL]?)/], [PR.PR_TYPE, /^(\b[A-Z]+[a-z][a-zA-Z0-9_$@]*|`.*`)/, null], [PR.PR_COMMENT, /^\/\/.*/], [PR.PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/], [PR.PR_STRING, /'.'/], [PR.PR_STRING, /^"([^"\\]|\\[\s\S])*"/], [PR.PR_STRING, /^"{3}[\s\S]*?[^\\]"{3}/], [PR.PR_LITERAL, /^@([a-zA-Z0-9_$@]*|`.*`)/], [PR.PR_LITERAL, /^[a-zA-Z0-9_]+@/]]), ["kotlin"]);
    PR.registerLangHandler(PR.createSimpleLexer([["opn", /^\(+/, null, "("], ["clo", /^\)+/, null, ")"], [PR.PR_COMMENT, /^;[^\r\n]*/, null, ";"], [PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^"(?:[^"\\]|\\[\s\S])*(?:"|$)/, null, '"']], [[PR.PR_KEYWORD, /^(?:block|c[ad]+r|catch|con[ds]|def(?:ine|un)|do|eq|eql|equal|equalp|eval-when|flet|format|go|if|labels|lambda|let|load-time-value|locally|macrolet|multiple-value-call|nil|progn|progv|quote|require|return-from|setq|symbol-macrolet|t|tagbody|the|throw|unwind)\b/, null], [PR.PR_LITERAL, /^[+\-]?(?:[0#]x[0-9a-f]+|\d+\/\d+|(?:\.\d+|\d+(?:\.\d*)?)(?:[ed][+\-]?\d+)?)/i], [PR.PR_LITERAL, /^'(?:-*(?:\w|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?)?/], [PR.PR_PLAIN, /^-*(?:[a-z_]|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0()"\\';]+/]]), ["cl", "el", "lisp", "scm"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^(?:"(?:[^"\\]|\\[\s\S])*(?:"|$)|'(?:[^'\\]|\\[\s\S])*(?:'|$))/, null, "\"'"]], [[PR.PR_COMMENT, /^--(?:\[(=*)\[[\s\S]*?(?:\]\1\]|$)|[^\r\n]*)/], [PR.PR_STRING, /^\[(=*)\[[\s\S]*?(?:\]\1\]|$)/], [PR.PR_KEYWORD, /^(?:and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/, null], [PR.PR_LITERAL, /^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i], [PR.PR_PLAIN, /^[a-z_]\w*/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0][^\w\t\n\r \xA0"'\-\+=]*/]]), ["lua"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_COMMENT, /^#(?:if[\t\n\r \xA0]+(?:[a-z_$][\w']*|``[^\r\n\t`]*(?:``|$))|else|endif|light)/i, null, "#"], [PR.PR_STRING, /^(?:"(?:[^"\\]|\\[\s\S])*(?:"|$)|'(?:[^'\\]|\\[\s\S])(?:'|$))/, null, "\"'"]], [[PR.PR_COMMENT, /^(?:\/\/[^\r\n]*|\(\*[\s\S]*?\*\))/], [PR.PR_KEYWORD, /^(?:abstract|and|as|assert|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|if|in|inherit|inline|interface|internal|lazy|let|match|member|module|mutable|namespace|new|null|of|open|or|override|private|public|rec|return|static|struct|then|to|true|try|type|upcast|use|val|void|when|while|with|yield|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|global|include|method|mixin|object|parallel|process|protected|pure|sealed|trait|virtual|volatile)\b/], [PR.PR_LITERAL, /^[+\-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i], [PR.PR_PLAIN, /^(?:[a-z_][\w']*[!?#]?|``[^\r\n\t`]*(?:``|$))/i], [PR.PR_PUNCTUATION, /^[^\t\n\r \xA0"'\w]+/]]), ["fs", "ml"]);
    PR.registerLangHandler(PR.sourceDecorator({
        keywords: "bool bytes default double enum extend extensions false fixed32 fixed64 float group import int32 int64 max message option optional package repeated required returns rpc service sfixed32 sfixed64 sint32 sint64 string syntax to true uint32 uint64",
        cStyleComments: !0
    }), ["proto"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^(?:"(?:(?:""(?:""?(?!")|[^\\"]|\\.)*"{0,3})|(?:[^"\r\n\\]|\\.)*"?))/, null, '"'], [PR.PR_LITERAL, /^`(?:[^\r\n\\`]|\\.)*`?/, null, "`"], [PR.PR_PUNCTUATION, /^[!#%&()*+,\-:;<=>?@\[\\\]^{|}~]+/, null, "!#%&()*+,-:;<=>?@[\\]^{|}~"]], [[PR.PR_STRING, /^'(?:[^\r\n\\']|\\(?:'|[^\r\n']+))'/], [PR.PR_LITERAL, /^'[a-zA-Z_$][\w$]*(?!['$\w])/], [PR.PR_KEYWORD, /^(?:abstract|case|catch|class|def|do|else|extends|final|finally|for|forSome|if|implicit|import|lazy|match|new|object|override|package|private|protected|requires|return|sealed|super|throw|trait|try|type|val|var|while|with|yield)\b/], [PR.PR_LITERAL, /^(?:true|false|null|this)\b/], [PR.PR_LITERAL, /^(?:(?:0(?:[0-7]+|X[0-9A-F]+))L?|(?:(?:0|[1-9][0-9]*)(?:(?:\.[0-9]+)?(?:E[+\-]?[0-9]+)?F?|L?))|\\.[0-9]+(?:E[+\-]?[0-9]+)?F?)/i], [PR.PR_TYPE, /^[$_]*[A-Z][_$A-Z0-9]*[a-z][\w$]*/], [PR.PR_PLAIN, /^[$a-zA-Z_][\w$]*/], [PR.PR_COMMENT, /^\/(?:\/.*|\*(?:\/|\**[^*/])*(?:\*+\/?)?)/], [PR.PR_PUNCTUATION, /^(?:\.+|\/)/]]), ["scala"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"], [PR.PR_STRING, /^(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, null, "\"'"]], [[PR.PR_COMMENT, /^(?:--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$))/], [PR.PR_KEYWORD, /^(?:ADD|ALL|ALTER|AND|ANY|AS|ASC|AUTHORIZATION|BACKUP|BEGIN|BETWEEN|BREAK|BROWSE|BULK|BY|CASCADE|CASE|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COMMIT|COMPUTE|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATABASE|DBCC|DEALLOCATE|DECLARE|DEFAULT|DELETE|DENY|DESC|DISK|DISTINCT|DISTRIBUTED|DOUBLE|DROP|DUMMY|DUMP|ELSE|END|ERRLVL|ESCAPE|EXCEPT|EXEC|EXECUTE|EXISTS|EXIT|FETCH|FILE|FILLFACTOR|FOR|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GOTO|GRANT|GROUP|HAVING|HOLDLOCK|IDENTITY|IDENTITYCOL|IDENTITY_INSERT|IF|IN|INDEX|INNER|INSERT|INTERSECT|INTO|IS|JOIN|KEY|KILL|LEFT|LIKE|LINENO|LOAD|NATIONAL|NOCHECK|NONCLUSTERED|NOT|NULL|NULLIF|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPENXML|OPTION|OR|ORDER|OUTER|OVER|PERCENT|PLAN|PRECISION|PRIMARY|PRINT|PROC|PROCEDURE|PUBLIC|RAISERROR|READ|READTEXT|RECONFIGURE|REFERENCES|REPLICATION|RESTORE|RESTRICT|RETURN|REVOKE|RIGHT|ROLLBACK|ROWCOUNT|ROWGUIDCOL|RULE|SAVE|SCHEMA|SELECT|SESSION_USER|SET|SETUSER|SHUTDOWN|SOME|STATISTICS|SYSTEM_USER|TABLE|TEXTSIZE|THEN|TO|TOP|TRAN|TRANSACTION|TRIGGER|TRUNCATE|TSEQUAL|UNION|UNIQUE|UPDATE|UPDATETEXT|USE|USER|VALUES|VARYING|VIEW|WAITFOR|WHEN|WHERE|WHILE|WITH|WRITETEXT)(?=[^\w-]|$)/i, null], [PR.PR_LITERAL, /^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i], [PR.PR_PLAIN, /^[a-z_][\w-]*/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0"'][^\w\t\n\r \xA0+\-"']*/]]), ["sql"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[ \n\r\t\v\f\0]+/, null, " \n\r\t\v\f\x00"], [PR.PR_STRING, /^"(?:[^"\\]|(?:\\.)|(?:\\\((?:[^"\\)]|\\.)*\)))*"/, null, '"']], [[PR.PR_LITERAL, /^(?:(?:0x[\da-fA-F][\da-fA-F_]*\.[\da-fA-F][\da-fA-F_]*[pP]?)|(?:\d[\d_]*\.\d[\d_]*[eE]?))[+-]?\d[\d_]*/, null], [PR.PR_LITERAL, /^-?(?:(?:0(?:(?:b[01][01_]*)|(?:o[0-7][0-7_]*)|(?:x[\da-fA-F][\da-fA-F_]*)))|(?:\d[\d_]*))/, null], [PR.PR_LITERAL, /^(?:true|false|nil)\b/, null], [PR.PR_KEYWORD, /^\b(?:__COLUMN__|__FILE__|__FUNCTION__|__LINE__|associativity|as|break|case|class|continue|convenience|default|deinit|didSet|do|dynamic|dynamicType|else|enum|fallthrough|final|for|func|get|import|infix|init|inout|internal|if|in|is|lazy|left|let|mutating|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|protocol|Protocol|public|required|return|right|safe|self|set|static|struct|subscript|super|switch|Type|typealias|unowned|unsafe|var|weak|while|willSet)\b/, null], [PR.PR_COMMENT, /^\/\/.*?[\n\r]/, null], [PR.PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/, null], [PR.PR_PUNCTUATION, /^<<=|<=|<<|>>=|>=|>>|===|==|\.\.\.|&&=|\.\.<|!==|!=|&=|~=|~|\(|\)|\[|\]|{|}|@|#|;|\.|,|:|\|\|=|\?\?|\|\||&&|&\*|&\+|&-|&=|\+=|-=|\/=|\*=|\^=|%=|\|=|->|`|==|\+\+|--|\/|\+|!|\*|%|<|>|&|\||\^|\?|=|-|_/, null], [PR.PR_TYPE, /^\b(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null]]), ["swift"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0\u2028\u2029]+/, null, "\t\n\r \u00a0\u2028\u2029"], [PR.PR_STRING, /^(?:["\u201C\u201D](?:[^"\u201C\u201D]|["\u201C\u201D]{2})(?:["\u201C\u201D]c|$)|["\u201C\u201D](?:[^"\u201C\u201D]|["\u201C\u201D]{2})*(?:["\u201C\u201D]|$))/i, null, '"\u201c\u201d'], [PR.PR_COMMENT, /^['\u2018\u2019][^\r\n\u2028\u2029]*/, null, "'\u2018\u2019"]], [[PR.PR_KEYWORD, /^(?:AddHandler|AddressOf|Alias|And|AndAlso|Ansi|As|Assembly|Auto|Boolean|ByRef|Byte|ByVal|Call|Case|Catch|CBool|CByte|CChar|CDate|CDbl|CDec|Char|CInt|Class|CLng|CObj|Const|CShort|CSng|CStr|CType|Date|Decimal|Declare|Default|Delegate|Dim|DirectCast|Do|Double|Each|Else|ElseIf|End|EndIf|Enum|Erase|Error|Event|Exit|Finally|For|Friend|Function|Get|GetType|GoSub|GoTo|Handles|If|Implements|Imports|In|Inherits|Integer|Interface|Is|Let|Lib|Like|Long|Loop|Me|Mod|Module|MustInherit|MustOverride|MyBase|MyClass|Namespace|New|Next|Not|NotInheritable|NotOverridable|Object|On|Option|Optional|Or|OrElse|Overloads|Overridable|Overrides|ParamArray|Preserve|Private|Property|Protected|Public|RaiseEvent|ReadOnly|ReDim|RemoveHandler|Resume|Return|Select|Set|Shadows|Shared|Short|Single|Static|Step|Stop|String|Structure|Sub|SyncLock|Then|Throw|To|Try|TypeOf|Unicode|Until|Variant|Wend|When|While|With|WithEvents|WriteOnly|Xor|EndIf|GoSub|Let|Variant|Wend)\b/i, null], [PR.PR_COMMENT, /^REM[^\r\n\u2028\u2029]*/i], [PR.PR_LITERAL, /^(?:True\b|False\b|Nothing\b|\d+(?:E[+\-]?\d+[FRD]?|[FRDSIL])?|(?:&H[0-9A-F]+|&O[0-7]+)[SIL]?|\d*\.\d+(?:E[+\-]?\d+)?[FRD]?|#\s+(?:\d+[\-\/]\d+[\-\/]\d+(?:\s+\d+:\d+(?::\d+)?(\s*(?:AM|PM))?)?|\d+:\d+(?::\d+)?(\s*(?:AM|PM))?)\s+#)/i], [PR.PR_PLAIN, /^(?:(?:[a-z]|_\w)\w*|\[(?:[a-z]|_\w)\w*\])/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r "'\[\]\xA0\u2018\u2019\u201C\u201D\u2028\u2029]+/], [PR.PR_PUNCTUATION, /^(?:\[|\])/]]), ["vb", "vbs"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \u00a0"]], [[PR.PR_STRING, /^(?:[BOX]?"(?:[^"]|"")*"|'.')/i], [PR.PR_COMMENT, /^--[^\r\n]*/], [PR.PR_KEYWORD, /^(?:abs|access|after|alias|all|and|architecture|array|assert|attribute|begin|block|body|buffer|bus|case|component|configuration|constant|disconnect|downto|else|elsif|end|entity|exit|file|for|function|generate|generic|group|guarded|if|impure|in|inertial|inout|is|label|library|linkage|literal|loop|map|mod|nand|new|next|nor|not|null|of|on|open|or|others|out|package|port|postponed|procedure|process|pure|range|record|register|reject|rem|report|return|rol|ror|select|severity|shared|signal|sla|sll|sra|srl|subtype|then|to|transport|type|unaffected|units|until|use|variable|wait|when|while|with|xnor|xor)(?=[^\w-]|$)/i, null], [PR.PR_TYPE, /^(?:bit|bit_vector|character|boolean|integer|real|time|string|severity_level|positive|natural|signed|unsigned|line|text|std_u?logic(?:_vector)?)(?=[^\w-]|$)/i, null], [PR.PR_TYPE, /^'(?:ACTIVE|ASCENDING|BASE|DELAYED|DRIVING|DRIVING_VALUE|EVENT|HIGH|IMAGE|INSTANCE_NAME|LAST_ACTIVE|LAST_EVENT|LAST_VALUE|LEFT|LEFTOF|LENGTH|LOW|PATH_NAME|POS|PRED|QUIET|RANGE|REVERSE_RANGE|RIGHT|RIGHTOF|SIMPLE_NAME|STABLE|SUCC|TRANSACTION|VAL|VALUE)(?=[^\w-]|$)/i, null], [PR.PR_LITERAL, /^\d+(?:_\d+)*(?:#[\w\\.]+#(?:[+\-]?\d+(?:_\d+)*)?|(?:\.\d+(?:_\d+)*)?(?:E[+\-]?\d+(?:_\d+)*)?)/i], [PR.PR_PLAIN, /^(?:[a-z]\w*|\\[^\\]*\\)/i], [PR.PR_PUNCTUATION, /^[^\w\t\n\r \xA0"'][^\w\t\n\r \xA0\-"']*/]]), ["vhdl", "vhd"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN, /^[\t \xA0a-gi-z0-9]+/, null, "\t \u00a0abcdefgijklmnopqrstuvwxyz0123456789"], [PR.PR_PUNCTUATION, /^[=*~\^\[\]]+/, null, "=*~^[]"]], [["lang-wiki.meta", /(?:^^|\r\n?|\n)(#[a-z]+)\b/], [PR.PR_LITERAL, /^(?:[A-Z][a-z][a-z0-9]+[A-Z][a-z][a-zA-Z0-9]+)\b/], ["lang-", /^\{\{\{([\s\S]+?)\}\}\}/], ["lang-", /^`([^\r\n`]+)`/], [PR.PR_STRING, /^https?:\/\/[^\/?#\s]*(?:\/[^?#\s]*)?(?:\?[^#\s]*)?(?:#\S*)?/i], [PR.PR_PLAIN, /^(?:\r\n|[\s\S])[^#=*~^A-Zh\{`\[\r\n]*/]]), ["wiki"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_KEYWORD, /^#[a-z]+/i, null, "#"]], []), ["wiki.meta"]);
    PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PUNCTUATION, /^[:|>?]+/, null, ":|>?"], [PR.PR_DECLARATION, /^%(?:YAML|TAG)[^#\r\n]+/, null, "%"], [PR.PR_TYPE, /^[&]\S+/, null, "&"], [PR.PR_TYPE, /^!\S*/, null, "!"], [PR.PR_STRING, /^"(?:[^\\"]|\\.)*(?:"|$)/, null, '"'], [PR.PR_STRING, /^'(?:[^']|'')*(?:'|$)/, null, "'"], [PR.PR_COMMENT, /^#[^\r\n]*/, null, "#"], [PR.PR_PLAIN, /^\s+/, null, " \t\r\n"]], [[PR.PR_DECLARATION, /^(?:---|\.\.\.)(?:[\r\n]|$)/], [PR.PR_PUNCTUATION, /^-/], [PR.PR_KEYWORD, /^\w+:[ \r\n]/], [PR.PR_PLAIN, /^\w+/]]), ["yaml", "yml"])
}
).call(this);
