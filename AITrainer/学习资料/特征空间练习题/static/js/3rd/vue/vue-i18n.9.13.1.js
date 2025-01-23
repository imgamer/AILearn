/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/vue-i18n@9.13.1/dist/vue-i18n.global.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*!
  * vue-i18n v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
var VueI18n9131 = function(e, t) {
    "use strict";
    const n = "undefined" != typeof window;
    let a, r;
    {
        const e = n && window.performance;
        e && e.mark && e.measure && e.clearMarks && e.clearMeasures && (a = t => {
            e.mark(t)
        }
        ,
        r = (t, n, a) => {
            e.measure(t, n, a),
            e.clearMarks(n),
            e.clearMarks(a)
        }
        )
    }
    const o = /\{([0-9a-zA-Z]+)\}/g;
    function l(e, ...t) {
        return 1 === t.length && h(t[0]) && (t = t[0]),
        t && t.hasOwnProperty || (t = {}),
        e.replace(o, ( (e, n) => t.hasOwnProperty(n) ? t[n] : ""))
    }
    const s = (e, t=!1) => t ? Symbol.for(e) : Symbol(e)
      , i = (e, t, n) => c({
        l: e,
        k: t,
        s: n
    })
      , c = e => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027")
      , u = e => "number" == typeof e && isFinite(e)
      , _ = e => "[object Date]" === k(e)
      , m = e => "[object RegExp]" === k(e)
      , f = e => y(e) && 0 === Object.keys(e).length
      , p = Object.assign;
    let d;
    function E(e) {
        return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    }
    const g = Object.prototype.hasOwnProperty;
    function v(e, t) {
        return g.call(e, t)
    }
    const T = Array.isArray
      , N = e => "function" == typeof e
      , b = e => "string" == typeof e
      , L = e => "boolean" == typeof e
      , h = e => null !== e && "object" == typeof e
      , O = e => h(e) && N(e.then) && N(e.catch)
      , I = Object.prototype.toString
      , k = e => I.call(e)
      , y = e => {
        if (!h(e))
            return !1;
        const t = Object.getPrototypeOf(e);
        return null === t || t.constructor === Object
    }
    ;
    function A(e, t="") {
        return e.reduce(( (e, n, a) => 0 === a ? e + n : e + t + n), "")
    }
    const P = 2;
    function C(e) {
        let t = e;
        return () => ++t
    }
    function R(e, t) {
        "undefined" != typeof console && (console.warn("[intlify] " + e),
        t && console.warn(t.stack))
    }
    const S = {};
    function D() {
        const e = new Map;
        return {
            events: e,
            on(t, n) {
                const a = e.get(t);
                a && a.push(n) || e.set(t, [n])
            },
            off(t, n) {
                const a = e.get(t);
                a && a.splice(a.indexOf(n) >>> 0, 1)
            },
            emit(t, n) {
                (e.get(t) || []).slice().map((e => e(n))),
                (e.get("*") || []).slice().map((e => e(t, n)))
            }
        }
    }
    const F = e => !h(e) || T(e);
    function M(e, t) {
        if (F(e) || F(t))
            throw new Error("Invalid value");
        const n = [{
            src: e,
            des: t
        }];
        for (; n.length; ) {
            const {src: e, des: t} = n.pop();
            Object.keys(e).forEach((a => {
                F(e[a]) || F(t[a]) ? t[a] = e[a] : n.push({
                    src: e[a],
                    des: t[a]
                })
            }
            ))
        }
    }
    function U(e, t, n) {
        const a = {
            start: e,
            end: t
        };
        return null != n && (a.source = n),
        a
    }
    const w = {
        USE_MODULO_SYNTAX: 1,
        __EXTEND_POINT__: 2
    }
      , x = {
        [w.USE_MODULO_SYNTAX]: "Use modulo before '{{0}}'."
    };
    const $ = {
        EXPECTED_TOKEN: 1,
        INVALID_TOKEN_IN_PLACEHOLDER: 2,
        UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
        UNKNOWN_ESCAPE_SEQUENCE: 4,
        INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
        UNBALANCED_CLOSING_BRACE: 6,
        UNTERMINATED_CLOSING_BRACE: 7,
        EMPTY_PLACEHOLDER: 8,
        NOT_ALLOW_NEST_PLACEHOLDER: 9,
        INVALID_LINKED_FORMAT: 10,
        MUST_HAVE_MESSAGES_IN_PLURAL: 11,
        UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
        UNEXPECTED_EMPTY_LINKED_KEY: 13,
        UNEXPECTED_LEXICAL_ANALYSIS: 14,
        UNHANDLED_CODEGEN_NODE_TYPE: 15,
        UNHANDLED_MINIFIER_NODE_TYPE: 16,
        __EXTEND_POINT__: 17
    }
      , W = {
        [$.EXPECTED_TOKEN]: "Expected token: '{0}'",
        [$.INVALID_TOKEN_IN_PLACEHOLDER]: "Invalid token in placeholder: '{0}'",
        [$.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: "Unterminated single quote in placeholder",
        [$.UNKNOWN_ESCAPE_SEQUENCE]: "Unknown escape sequence: \\{0}",
        [$.INVALID_UNICODE_ESCAPE_SEQUENCE]: "Invalid unicode escape sequence: {0}",
        [$.UNBALANCED_CLOSING_BRACE]: "Unbalanced closing brace",
        [$.UNTERMINATED_CLOSING_BRACE]: "Unterminated closing brace",
        [$.EMPTY_PLACEHOLDER]: "Empty placeholder",
        [$.NOT_ALLOW_NEST_PLACEHOLDER]: "Not allowed nest placeholder",
        [$.INVALID_LINKED_FORMAT]: "Invalid linked format",
        [$.MUST_HAVE_MESSAGES_IN_PLURAL]: "Plural must have messages",
        [$.UNEXPECTED_EMPTY_LINKED_MODIFIER]: "Unexpected empty linked modifier",
        [$.UNEXPECTED_EMPTY_LINKED_KEY]: "Unexpected empty linked key",
        [$.UNEXPECTED_LEXICAL_ANALYSIS]: "Unexpected lexical analysis in token: '{0}'",
        [$.UNHANDLED_CODEGEN_NODE_TYPE]: "unhandled codegen node type: '{0}'",
        [$.UNHANDLED_MINIFIER_NODE_TYPE]: "unhandled mimifier node type: '{0}'"
    };
    function V(e, t, n={}) {
        const {domain: a, messages: r, args: o} = n
          , s = l((r || W)[e] || "", ...o || [])
          , i = new SyntaxError(String(s));
        return i.code = e,
        t && (i.location = t),
        i.domain = a,
        i
    }
    function H(e) {
        throw e
    }
    const G = /<\/?[\w\s="/.':;#-\/]+>/
      , X = e => G.test(e)
      , Y = " "
      , B = "\r"
      , j = "\n"
      , K = String.fromCharCode(8232)
      , Q = String.fromCharCode(8233);
    function z(e) {
        const t = e;
        let n = 0
          , a = 1
          , r = 1
          , o = 0;
        const l = e => t[e] === B && t[e + 1] === j
          , s = e => t[e] === Q
          , i = e => t[e] === K
          , c = e => l(e) || (e => t[e] === j)(e) || s(e) || i(e)
          , u = e => l(e) || s(e) || i(e) ? j : t[e];
        function _() {
            return o = 0,
            c(n) && (a++,
            r = 0),
            l(n) && n++,
            n++,
            r++,
            t[n]
        }
        return {
            index: () => n,
            line: () => a,
            column: () => r,
            peekOffset: () => o,
            charAt: u,
            currentChar: () => u(n),
            currentPeek: () => u(n + o),
            next: _,
            peek: function() {
                return l(n + o) && o++,
                o++,
                t[n + o]
            },
            reset: function() {
                n = 0,
                a = 1,
                r = 1,
                o = 0
            },
            resetPeek: function(e=0) {
                o = e
            },
            skipToPeek: function() {
                const e = n + o;
                for (; e !== n; )
                    _();
                o = 0
            }
        }
    }
    const J = void 0
      , q = "'"
      , Z = "tokenizer";
    function ee(e, t={}) {
        const n = !1 !== t.location
          , a = z(e)
          , r = () => a.index()
          , o = () => {
            return e = a.line(),
            t = a.column(),
            n = a.index(),
            {
                line: e,
                column: t,
                offset: n
            };
            var e, t, n
        }
          , l = o()
          , s = r()
          , i = {
            currentType: 14,
            offset: s,
            startLoc: l,
            endLoc: l,
            lastType: 14,
            lastOffset: s,
            lastStartLoc: l,
            lastEndLoc: l,
            braceNest: 0,
            inLinked: !1,
            text: ""
        }
          , c = () => i
          , {onError: u} = t;
        function _(e, t, a, ...r) {
            const o = c();
            if (t.column += a,
            t.offset += a,
            u) {
                const a = V(e, n ? U(o.startLoc, t) : null, {
                    domain: Z,
                    args: r
                });
                u(a)
            }
        }
        function m(e, t, a) {
            e.endLoc = o(),
            e.currentType = t;
            const r = {
                type: t
            };
            return n && (r.loc = U(e.startLoc, e.endLoc)),
            null != a && (r.value = a),
            r
        }
        const f = e => m(e, 14);
        function p(e, t) {
            return e.currentChar() === t ? (e.next(),
            t) : (_($.EXPECTED_TOKEN, o(), 0, t),
            "")
        }
        function d(e) {
            let t = "";
            for (; e.currentPeek() === Y || e.currentPeek() === j; )
                t += e.currentPeek(),
                e.peek();
            return t
        }
        function E(e) {
            const t = d(e);
            return e.skipToPeek(),
            t
        }
        function g(e) {
            if (e === J)
                return !1;
            const t = e.charCodeAt(0);
            return t >= 97 && t <= 122 || t >= 65 && t <= 90 || 95 === t
        }
        function v(e, t) {
            const {currentType: n} = t;
            if (2 !== n)
                return !1;
            d(e);
            const a = function(e) {
                if (e === J)
                    return !1;
                const t = e.charCodeAt(0);
                return t >= 48 && t <= 57
            }("-" === e.currentPeek() ? e.peek() : e.currentPeek());
            return e.resetPeek(),
            a
        }
        function T(e) {
            d(e);
            const t = "|" === e.currentPeek();
            return e.resetPeek(),
            t
        }
        function N(e, t=!0) {
            const n = (t=!1, a="", r=!1) => {
                const o = e.currentPeek();
                return "{" === o ? "%" !== a && t : "@" !== o && o ? "%" === o ? (e.peek(),
                n(t, "%", !0)) : "|" === o ? !("%" !== a && !r) || !(a === Y || a === j) : o === Y ? (e.peek(),
                n(!0, Y, r)) : o !== j || (e.peek(),
                n(!0, j, r)) : "%" === a || t
            }
              , a = n();
            return t && e.resetPeek(),
            a
        }
        function b(e, t) {
            const n = e.currentChar();
            return n === J ? J : t(n) ? (e.next(),
            n) : null
        }
        function L(e) {
            const t = e.charCodeAt(0);
            return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || 95 === t || 36 === t
        }
        function h(e) {
            return b(e, L)
        }
        function O(e) {
            const t = e.charCodeAt(0);
            return t >= 97 && t <= 122 || t >= 65 && t <= 90 || t >= 48 && t <= 57 || 95 === t || 36 === t || 45 === t
        }
        function I(e) {
            return b(e, O)
        }
        function k(e) {
            const t = e.charCodeAt(0);
            return t >= 48 && t <= 57
        }
        function y(e) {
            return b(e, k)
        }
        function A(e) {
            const t = e.charCodeAt(0);
            return t >= 48 && t <= 57 || t >= 65 && t <= 70 || t >= 97 && t <= 102
        }
        function P(e) {
            return b(e, A)
        }
        function C(e) {
            let t = ""
              , n = "";
            for (; t = y(e); )
                n += t;
            return n
        }
        function R(e) {
            let t = "";
            for (; ; ) {
                const n = e.currentChar();
                if ("{" === n || "}" === n || "@" === n || "|" === n || !n)
                    break;
                if ("%" === n) {
                    if (!N(e))
                        break;
                    t += n,
                    e.next()
                } else if (n === Y || n === j)
                    if (N(e))
                        t += n,
                        e.next();
                    else {
                        if (T(e))
                            break;
                        t += n,
                        e.next()
                    }
                else
                    t += n,
                    e.next()
            }
            return t
        }
        function S(e) {
            return e !== q && e !== j
        }
        function D(e) {
            const t = e.currentChar();
            switch (t) {
            case "\\":
            case "'":
                return e.next(),
                `\\${t}`;
            case "u":
                return F(e, t, 4);
            case "U":
                return F(e, t, 6);
            default:
                return _($.UNKNOWN_ESCAPE_SEQUENCE, o(), 0, t),
                ""
            }
        }
        function F(e, t, n) {
            p(e, t);
            let a = "";
            for (let r = 0; r < n; r++) {
                const n = P(e);
                if (!n) {
                    _($.INVALID_UNICODE_ESCAPE_SEQUENCE, o(), 0, `\\${t}${a}${e.currentChar()}`);
                    break
                }
                a += n
            }
            return `\\${t}${a}`
        }
        function M(e) {
            return "{" !== e && "}" !== e && e !== Y && e !== j
        }
        function w(e) {
            E(e);
            const t = p(e, "|");
            return E(e),
            t
        }
        function x(e, t) {
            let n = null;
            switch (e.currentChar()) {
            case "{":
                return t.braceNest >= 1 && _($.NOT_ALLOW_NEST_PLACEHOLDER, o(), 0),
                e.next(),
                n = m(t, 2, "{"),
                E(e),
                t.braceNest++,
                n;
            case "}":
                return t.braceNest > 0 && 2 === t.currentType && _($.EMPTY_PLACEHOLDER, o(), 0),
                e.next(),
                n = m(t, 3, "}"),
                t.braceNest--,
                t.braceNest > 0 && E(e),
                t.inLinked && 0 === t.braceNest && (t.inLinked = !1),
                n;
            case "@":
                return t.braceNest > 0 && _($.UNTERMINATED_CLOSING_BRACE, o(), 0),
                n = W(e, t) || f(t),
                t.braceNest = 0,
                n;
            default:
                {
                    let a = !0
                      , r = !0
                      , l = !0;
                    if (T(e))
                        return t.braceNest > 0 && _($.UNTERMINATED_CLOSING_BRACE, o(), 0),
                        n = m(t, 1, w(e)),
                        t.braceNest = 0,
                        t.inLinked = !1,
                        n;
                    if (t.braceNest > 0 && (5 === t.currentType || 6 === t.currentType || 7 === t.currentType))
                        return _($.UNTERMINATED_CLOSING_BRACE, o(), 0),
                        t.braceNest = 0,
                        H(e, t);
                    if (a = function(e, t) {
                        const {currentType: n} = t;
                        if (2 !== n)
                            return !1;
                        d(e);
                        const a = g(e.currentPeek());
                        return e.resetPeek(),
                        a
                    }(e, t))
                        return n = m(t, 5, function(e) {
                            E(e);
                            let t = ""
                              , n = "";
                            for (; t = I(e); )
                                n += t;
                            return e.currentChar() === J && _($.UNTERMINATED_CLOSING_BRACE, o(), 0),
                            n
                        }(e)),
                        E(e),
                        n;
                    if (r = v(e, t))
                        return n = m(t, 6, function(e) {
                            E(e);
                            let t = "";
                            return "-" === e.currentChar() ? (e.next(),
                            t += `-${C(e)}`) : t += C(e),
                            e.currentChar() === J && _($.UNTERMINATED_CLOSING_BRACE, o(), 0),
                            t
                        }(e)),
                        E(e),
                        n;
                    if (l = function(e, t) {
                        const {currentType: n} = t;
                        if (2 !== n)
                            return !1;
                        d(e);
                        const a = e.currentPeek() === q;
                        return e.resetPeek(),
                        a
                    }(e, t))
                        return n = m(t, 7, function(e) {
                            E(e),
                            p(e, "'");
                            let t = ""
                              , n = "";
                            for (; t = b(e, S); )
                                n += "\\" === t ? D(e) : t;
                            const a = e.currentChar();
                            return a === j || a === J ? (_($.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, o(), 0),
                            a === j && (e.next(),
                            p(e, "'")),
                            n) : (p(e, "'"),
                            n)
                        }(e)),
                        E(e),
                        n;
                    if (!a && !r && !l)
                        return n = m(t, 13, function(e) {
                            E(e);
                            let t = ""
                              , n = "";
                            for (; t = b(e, M); )
                                n += t;
                            return n
                        }(e)),
                        _($.INVALID_TOKEN_IN_PLACEHOLDER, o(), 0, n.value),
                        E(e),
                        n;
                    break
                }
            }
            return n
        }
        function W(e, t) {
            const {currentType: n} = t;
            let a = null;
            const r = e.currentChar();
            switch (8 !== n && 9 !== n && 12 !== n && 10 !== n || r !== j && r !== Y || _($.INVALID_LINKED_FORMAT, o(), 0),
            r) {
            case "@":
                return e.next(),
                a = m(t, 8, "@"),
                t.inLinked = !0,
                a;
            case ".":
                return E(e),
                e.next(),
                m(t, 9, ".");
            case ":":
                return E(e),
                e.next(),
                m(t, 10, ":");
            default:
                return T(e) ? (a = m(t, 1, w(e)),
                t.braceNest = 0,
                t.inLinked = !1,
                a) : function(e, t) {
                    const {currentType: n} = t;
                    if (8 !== n)
                        return !1;
                    d(e);
                    const a = "." === e.currentPeek();
                    return e.resetPeek(),
                    a
                }(e, t) || function(e, t) {
                    const {currentType: n} = t;
                    if (8 !== n && 12 !== n)
                        return !1;
                    d(e);
                    const a = ":" === e.currentPeek();
                    return e.resetPeek(),
                    a
                }(e, t) ? (E(e),
                W(e, t)) : function(e, t) {
                    const {currentType: n} = t;
                    if (9 !== n)
                        return !1;
                    d(e);
                    const a = g(e.currentPeek());
                    return e.resetPeek(),
                    a
                }(e, t) ? (E(e),
                m(t, 12, function(e) {
                    let t = ""
                      , n = "";
                    for (; t = h(e); )
                        n += t;
                    return n
                }(e))) : function(e, t) {
                    const {currentType: n} = t;
                    if (10 !== n)
                        return !1;
                    const a = () => {
                        const t = e.currentPeek();
                        return "{" === t ? g(e.peek()) : !("@" === t || "%" === t || "|" === t || ":" === t || "." === t || t === Y || !t) && (t === j ? (e.peek(),
                        a()) : N(e, !1))
                    }
                      , r = a();
                    return e.resetPeek(),
                    r
                }(e, t) ? (E(e),
                "{" === r ? x(e, t) || a : m(t, 11, function(e) {
                    const t = n => {
                        const a = e.currentChar();
                        return "{" !== a && "%" !== a && "@" !== a && "|" !== a && "(" !== a && ")" !== a && a ? a === Y ? n : (n += a,
                        e.next(),
                        t(n)) : n
                    }
                    ;
                    return t("")
                }(e))) : (8 === n && _($.INVALID_LINKED_FORMAT, o(), 0),
                t.braceNest = 0,
                t.inLinked = !1,
                H(e, t))
            }
        }
        function H(e, t) {
            let n = {
                type: 14
            };
            if (t.braceNest > 0)
                return x(e, t) || f(t);
            if (t.inLinked)
                return W(e, t) || f(t);
            switch (e.currentChar()) {
            case "{":
                return x(e, t) || f(t);
            case "}":
                return _($.UNBALANCED_CLOSING_BRACE, o(), 0),
                e.next(),
                m(t, 3, "}");
            case "@":
                return W(e, t) || f(t);
            default:
                {
                    if (T(e))
                        return n = m(t, 1, w(e)),
                        t.braceNest = 0,
                        t.inLinked = !1,
                        n;
                    const {isModulo: a, hasSpace: r} = function(e) {
                        const t = d(e)
                          , n = "%" === e.currentPeek() && "{" === e.peek();
                        return e.resetPeek(),
                        {
                            isModulo: n,
                            hasSpace: t.length > 0
                        }
                    }(e);
                    if (a)
                        return r ? m(t, 0, R(e)) : m(t, 4, function(e) {
                            E(e);
                            const t = e.currentChar();
                            return "%" !== t && _($.EXPECTED_TOKEN, o(), 0, t),
                            e.next(),
                            "%"
                        }(e));
                    if (N(e))
                        return m(t, 0, R(e));
                    break
                }
            }
            return n
        }
        return { 
            nextToken: function() {
                const {currentType: e, offset: t, startLoc: n, endLoc: l} = i;
                return i.lastType = e,
                i.lastOffset = t,
                i.lastStartLoc = n,
                i.lastEndLoc = l,
                i.offset = r(),
                i.startLoc = o(),
                a.currentChar() === J ? m(i, 14) : H(a, i)
            },
            currentOffset: r,
            currentPosition: o,
            context: c
        }
    }
    const te = "parser"
      , ne = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
    function ae(e, t, n) {
        switch (e) {
        case "\\\\":
            return "\\";
        case "\\'":
            return "'";
        default:
            {
                const e = parseInt(t || n, 16);
                return e <= 55295 || e >= 57344 ? String.fromCodePoint(e) : "�"
            }
        }
    }
    function re(e={}) {
        const t = !1 !== e.location
          , {onError: n, onWarn: a} = e;
        function r(e, a, r, o, ...l) {
            const s = e.currentPosition();
            if (s.offset += o,
            s.column += o,
            n) {
                const e = V(a, t ? U(r, s) : null, {
                    domain: te,
                    args: l
                });
                n(e)
            }
        }
        function o(e, n, r, o, ...s) {
            const i = e.currentPosition();
            if (i.offset += o,
            i.column += o,
            a) {
                const e = t ? U(r, i) : null;
                a(function(e, t, ...n) {
                    const a = l(x[e] || "", ...n || [])
                      , r = {
                        message: String(a),
                        code: e
                    };
                    return t && (r.location = t),
                    r
                }(n, e, s))
            }
        }
        function s(e, n, a) {
            const r = {
                type: e
            };
            return t && (r.start = n,
            r.end = n,
            r.loc = {
                start: a,
                end: a
            }),
            r
        }
        function i(e, n, a, r) {
            r && (e.type = r),
            t && (e.end = n,
            e.loc && (e.loc.end = a))
        }
        function c(e, t) {
            const n = e.context()
              , a = s(3, n.offset, n.startLoc);
            return a.value = t,
            i(a, e.currentOffset(), e.currentPosition()),
            a
        }
        function u(e, t) {
            const n = e.context()
              , {lastOffset: a, lastStartLoc: r} = n
              , o = s(5, a, r);
            return o.index = parseInt(t, 10),
            e.nextToken(),
            i(o, e.currentOffset(), e.currentPosition()),
            o
        }
        function _(e, t, n) {
            const a = e.context()
              , {lastOffset: r, lastStartLoc: o} = a
              , l = s(4, r, o);
            return l.key = t,
            !0 === n && (l.modulo = !0),
            e.nextToken(),
            i(l, e.currentOffset(), e.currentPosition()),
            l
        }
        function m(e, t) {
            const n = e.context()
              , {lastOffset: a, lastStartLoc: r} = n
              , o = s(9, a, r);
            return o.value = t.replace(ne, ae),
            e.nextToken(),
            i(o, e.currentOffset(), e.currentPosition()),
            o
        }
        function f(e) {
            const t = e.context()
              , n = s(6, t.offset, t.startLoc);
            let a = e.nextToken();
            if (9 === a.type) {
                const t = function(e) {
                    const t = e.nextToken()
                      , n = e.context()
                      , {lastOffset: a, lastStartLoc: o} = n
                      , l = s(8, a, o);
                    return 12 !== t.type ? (r(e, $.UNEXPECTED_EMPTY_LINKED_MODIFIER, n.lastStartLoc, 0),
                    l.value = "",
                    i(l, a, o),
                    {
                        nextConsumeToken: t,
                        node: l
                    }) : (null == t.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, n.lastStartLoc, 0, oe(t)),
                    l.value = t.value || "",
                    i(l, e.currentOffset(), e.currentPosition()),
                    {
                        node: l
                    })
                }(e);
                n.modifier = t.node,
                a = t.nextConsumeToken || e.nextToken()
            }
            switch (10 !== a.type && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(a)),
            a = e.nextToken(),
            2 === a.type && (a = e.nextToken()),
            a.type) {
            case 11:
                null == a.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(a)),
                n.key = function(e, t) {
                    const n = e.context()
                      , a = s(7, n.offset, n.startLoc);
                    return a.value = t,
                    i(a, e.currentOffset(), e.currentPosition()),
                    a
                }(e, a.value || "");
                break;
            case 5:
                null == a.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(a)),
                n.key = _(e, a.value || "");
                break;
            case 6:
                null == a.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(a)),
                n.key = u(e, a.value || "");
                break;
            case 7:
                null == a.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(a)),
                n.key = m(e, a.value || "");
                break;
            default:
                {
                    r(e, $.UNEXPECTED_EMPTY_LINKED_KEY, t.lastStartLoc, 0);
                    const o = e.context()
                      , l = s(7, o.offset, o.startLoc);
                    return l.value = "",
                    i(l, o.offset, o.startLoc),
                    n.key = l,
                    i(n, o.offset, o.startLoc),
                    {
                        nextConsumeToken: a,
                        node: n
                    }
                }
            }
            return i(n, e.currentOffset(), e.currentPosition()),
            {
                node: n
            }
        }
        function d(e) {
            const t = e.context()
              , n = s(2, 1 === t.currentType ? e.currentOffset() : t.offset, 1 === t.currentType ? t.endLoc : t.startLoc);
            n.items = [];
            let a = null
              , l = null;
            do {
                const s = a || e.nextToken();
                switch (a = null,
                s.type) {
                case 0:
                    null == s.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(s)),
                    n.items.push(c(e, s.value || ""));
                    break;
                case 6:
                    null == s.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(s)),
                    n.items.push(u(e, s.value || ""));
                    break;
                case 4:
                    l = !0;
                    break;
                case 5:
                    null == s.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(s)),
                    n.items.push(_(e, s.value || "", !!l)),
                    l && (o(e, w.USE_MODULO_SYNTAX, t.lastStartLoc, 0, oe(s)),
                    l = null);
                    break;
                case 7:
                    null == s.value && r(e, $.UNEXPECTED_LEXICAL_ANALYSIS, t.lastStartLoc, 0, oe(s)),
                    n.items.push(m(e, s.value || ""));
                    break;
                case 8:
                    {
                        const t = f(e);
                        n.items.push(t.node),
                        a = t.nextConsumeToken || null;
                        break
                    }
                }
            } while (14 !== t.currentType && 1 !== t.currentType);
            return i(n, 1 === t.currentType ? t.lastOffset : e.currentOffset(), 1 === t.currentType ? t.lastEndLoc : e.currentPosition()),
            n
        }
        function E(e) {
            const t = e.context()
              , {offset: n, startLoc: a} = t
              , o = d(e);
            return 14 === t.currentType ? o : function(e, t, n, a) {
                const o = e.context();
                let l = 0 === a.items.length;
                const c = s(1, t, n);
                c.cases = [],
                c.cases.push(a);
                do {
                    const t = d(e);
                    l || (l = 0 === t.items.length),
                    c.cases.push(t)
                } while (14 !== o.currentType);
                return l && r(e, $.MUST_HAVE_MESSAGES_IN_PLURAL, n, 0),
                i(c, e.currentOffset(), e.currentPosition()),
                c
            }(e, n, a, o)
        }
        return {
            parse: function(n) {
                const a = ee(n, p({}, e))
                  , o = a.context()
                  , l = s(0, o.offset, o.startLoc);
                return t && l.loc && (l.loc.source = n),
                l.body = E(a),
                e.onCacheKey && (l.cacheKey = e.onCacheKey(n)),
                14 !== o.currentType && r(a, $.UNEXPECTED_LEXICAL_ANALYSIS, o.lastStartLoc, 0, n[o.offset] || ""),
                i(l, a.currentOffset(), a.currentPosition()),
                l
            }
        }
    }
    function oe(e) {
        if (14 === e.type)
            return "EOF";
        const t = (e.value || "").replace(/\r?\n/gu, "\\n");
        return t.length > 10 ? t.slice(0, 9) + "…" : t
    }
    function le(e, t) {
        for (let n = 0; n < e.length; n++)
            se(e[n], t)
    }
    function se(e, t) {
        switch (e.type) {
        case 1:
            le(e.cases, t),
            t.helper("plural");
            break;
        case 2:
            le(e.items, t);
            break;
        case 6:
            se(e.key, t),
            t.helper("linked"),
            t.helper("type");
            break;
        case 5:
            t.helper("interpolate"),
            t.helper("list");
            break;
        case 4:
            t.helper("interpolate"),
            t.helper("named")
        }
    }
    function ie(e, t={}) {
        const n = function(e, t={}) {
            const n = {
                ast: e,
                helpers: new Set
            };
            return {
                context: () => n,
                helper: e => (n.helpers.add(e),
                e)
            }
        }(e);
        n.helper("normalize"),
        e.body && se(e.body, n);
        const a = n.context();
        e.helpers = Array.from(a.helpers)
    }
    function ce(e) {
        if (1 === e.items.length) {
            const t = e.items[0];
            3 !== t.type && 9 !== t.type || (e.static = t.value,
            delete t.value)
        } else {
            const t = [];
            for (let n = 0; n < e.items.length; n++) {
                const a = e.items[n];
                if (3 !== a.type && 9 !== a.type)
                    break;
                if (null == a.value)
                    break;
                t.push(a.value)
            }
            if (t.length === e.items.length) {
                e.static = A(t);
                for (let t = 0; t < e.items.length; t++) {
                    const n = e.items[t];
                    3 !== n.type && 9 !== n.type || delete n.value
                }
            }
        }
    }
    const ue = "minifier";
    function _e(e) {
        switch (e.t = e.type,
        e.type) {
        case 0:
            {
                const t = e;
                _e(t.body),
                t.b = t.body,
                delete t.body;
                break
            }
        case 1:
            {
                const t = e
                  , n = t.cases;
                for (let e = 0; e < n.length; e++)
                    _e(n[e]);
                t.c = n,
                delete t.cases;
                break
            }
        case 2:
            {
                const t = e
                  , n = t.items;
                for (let e = 0; e < n.length; e++)
                    _e(n[e]);
                t.i = n,
                delete t.items,
                t.static && (t.s = t.static,
                delete t.static);
                break
            }
        case 3:
        case 9:
        case 8:
        case 7:
            {
                const t = e;
                t.value && (t.v = t.value,
                delete t.value);
                break
            }
        case 6:
            {
                const t = e;
                _e(t.key),
                t.k = t.key,
                delete t.key,
                t.modifier && (_e(t.modifier),
                t.m = t.modifier,
                delete t.modifier);
                break
            }
        case 5:
            {
                const t = e;
                t.i = t.index,
                delete t.index;
                break
            }
        case 4:
            {
                const t = e;
                t.k = t.key,
                delete t.key;
                break
            }
        default:
            throw V($.UNHANDLED_MINIFIER_NODE_TYPE, null, {
                domain: ue,
                args: [e.type]
            })
        }
        delete e.type
    }
    const me = "parser";
    function fe(e, t) {
        const {helper: n} = e;
        switch (t.type) {
        case 0:
            !function(e, t) {
                t.body ? fe(e, t.body) : e.push("null")
            }(e, t);
            break;
        case 1:
            !function(e, t) {
                const {helper: n, needIndent: a} = e;
                if (t.cases.length > 1) {
                    e.push(`${n("plural")}([`),
                    e.indent(a());
                    const r = t.cases.length;
                    for (let n = 0; n < r && (fe(e, t.cases[n]),
                    n !== r - 1); n++)
                        e.push(", ");
                    e.deindent(a()),
                    e.push("])")
                }
            }(e, t);
            break;
        case 2:
            !function(e, t) {
                const {helper: n, needIndent: a} = e;
                e.push(`${n("normalize")}([`),
                e.indent(a());
                const r = t.items.length;
                for (let n = 0; n < r && (fe(e, t.items[n]),
                n !== r - 1); n++)
                    e.push(", ");
                e.deindent(a()),
                e.push("])")
            }(e, t);
            break;
        case 6:
            !function(e, t) {
                const {helper: n} = e;
                e.push(`${n("linked")}(`),
                fe(e, t.key),
                t.modifier ? (e.push(", "),
                fe(e, t.modifier),
                e.push(", _type")) : e.push(", undefined, _type"),
                e.push(")")
            }(e, t);
            break;
        case 8:
        case 7:
        case 9:
        case 3:
            e.push(JSON.stringify(t.value), t);
            break;
        case 5:
            e.push(`${n("interpolate")}(${n("list")}(${t.index}))`, t);
            break;
        case 4:
            e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`, t);
            break;
        default:
            throw V($.UNHANDLED_CODEGEN_NODE_TYPE, null, {
                domain: me,
                args: [t.type]
            })
        }
    }
    const pe = (e, t={}) => {
        const n = b(t.mode) ? t.mode : "normal"
          , a = b(t.filename) ? t.filename : "message.intl"
          , r = !!t.sourceMap
          , o = null != t.breakLineCode ? t.breakLineCode : "arrow" === n ? ";" : "\n"
          , l = t.needIndent ? t.needIndent : "arrow" !== n
          , s = e.helpers || []
          , i = function(e, t) {
            const {sourceMap: n, filename: a, breakLineCode: r, needIndent: o} = t
              , l = !1 !== t.location
              , s = {
                filename: a,
                code: "",
                column: 1,
                line: 1,
                offset: 0,
                map: void 0,
                breakLineCode: r,
                needIndent: o,
                indentLevel: 0
            };
            function i(e, t) {
                s.code += e
            }
            function c(e, t=!0) {
                const n = t ? r : "";
                i(o ? n + "  ".repeat(e) : n)
            }
            return l && e.loc && (s.source = e.loc.source),
            {
                context: () => s,
                push: i,
                indent: function(e=!0) {
                    const t = ++s.indentLevel;
                    e && c(t)
                },
                deindent: function(e=!0) {
                    const t = --s.indentLevel;
                    e && c(t)
                },
                newline: function() {
                    c(s.indentLevel)
                },
                helper: e => `_${e}`,
                needIndent: () => s.needIndent
            }
        }(e, {
            mode: n,
            filename: a,
            sourceMap: r,
            breakLineCode: o,
            needIndent: l
        });
        i.push("normal" === n ? "function __msg__ (ctx) {" : "(ctx) => {"),
        i.indent(l),
        s.length > 0 && (i.push(`const { ${A(s.map((e => `${e}: _${e}`)), ", ")} } = ctx`),
        i.newline()),
        i.push("return "),
        fe(i, e),
        i.deindent(l),
        i.push("}"),
        delete e.helpers;
        const {code: c, map: u} = i.context();
        return {
            ast: e,
            code: c,
            map: u ? u.toJSON() : void 0
        }
    }
    ;
    function de(e, t={}) {
        const n = p({}, t)
          , a = !!n.jit
          , r = !!n.minify
          , o = null == n.optimize || n.optimize
          , l = re(n).parse(e);
        return a ? (o && function(e) {
            const t = e.body;
            2 === t.type ? ce(t) : t.cases.forEach((e => ce(e)))
        }(l),
        r && _e(l),
        {
            ast: l,
            code: ""
        }) : (ie(l, n),
        pe(l, n))
    }
    const Ee = [];
    Ee[0] = {
        w: [0],
        i: [3, 0],
        "[": [4],
        o: [7]
    },
    Ee[1] = {
        w: [1],
        ".": [2],
        "[": [4],
        o: [7]
    },
    Ee[2] = {
        w: [2],
        i: [3, 0],
        0: [3, 0]
    },
    Ee[3] = {
        i: [3, 0],
        0: [3, 0],
        w: [1, 1],
        ".": [2, 1],
        "[": [4, 1],
        o: [7, 1]
    },
    Ee[4] = {
        "'": [5, 0],
        '"': [6, 0],
        "[": [4, 2],
        "]": [1, 3],
        o: 8,
        l: [4, 0]
    },
    Ee[5] = {
        "'": [4, 0],
        o: 8,
        l: [5, 0]
    },
    Ee[6] = {
        '"': [4, 0],
        o: 8,
        l: [6, 0]
    };
    const ge = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
    function ve(e) {
        if (null == e)
            return "o";
        switch (e.charCodeAt(0)) {
        case 91:
        case 93:
        case 46:
        case 34:
        case 39:
            return e;
        case 95:
        case 36:
        case 45:
            return "i";
        case 9:
        case 10:
        case 13:
        case 160:
        case 65279:
        case 8232:
        case 8233:
            return "w"
        }
        return "i"
    }
    function Te(e) {
        const t = e.trim();
        return ("0" !== e.charAt(0) || !isNaN(parseInt(e))) && (n = t,
        ge.test(n) ? function(e) {
            const t = e.charCodeAt(0);
            return t !== e.charCodeAt(e.length - 1) || 34 !== t && 39 !== t ? e : e.slice(1, -1)
        }(t) : "*" + t);
        var n
    }
    const Ne = new Map;
    function be(e, t) {
        return h(e) ? e[t] : null
    }
    const Le = e => e
      , he = e => ""
      , Oe = "text"
      , Ie = e => 0 === e.length ? "" : A(e)
      , ke = e => null == e ? "" : T(e) || y(e) && e.toString === I ? JSON.stringify(e, null, 2) : String(e);
    function ye(e, t) {
        return e = Math.abs(e),
        2 === t ? e ? e > 1 ? 1 : 0 : 1 : e ? Math.min(e, 2) : 0
    }
    function Ae(e={}) {
        const t = e.locale
          , n = function(e) {
            const t = u(e.pluralIndex) ? e.pluralIndex : -1;
            return e.named && (u(e.named.count) || u(e.named.n)) ? u(e.named.count) ? e.named.count : u(e.named.n) ? e.named.n : t : t
        }(e)
          , a = h(e.pluralRules) && b(t) && N(e.pluralRules[t]) ? e.pluralRules[t] : ye
          , r = h(e.pluralRules) && b(t) && N(e.pluralRules[t]) ? ye : void 0
          , o = e.list || []
          , l = e.named || {};
        u(e.pluralIndex) && function(e, t) {
            t.count || (t.count = e),
            t.n || (t.n = e)
        }(n, l);
        function s(t) {
            const n = N(e.messages) ? e.messages(t) : !!h(e.messages) && e.messages[t];
            return n || (e.parent ? e.parent.message(t) : he)
        }
        const i = y(e.processor) && N(e.processor.normalize) ? e.processor.normalize : Ie
          , c = y(e.processor) && N(e.processor.interpolate) ? e.processor.interpolate : ke
          , _ = {
            list: e => o[e],
            named: e => l[e],
            plural: e => e[a(n, e.length, r)],
            linked: (t, ...n) => {
                const [a,r] = n;
                let o = "text"
                  , l = "";
                1 === n.length ? h(a) ? (l = a.modifier || l,
                o = a.type || o) : b(a) && (l = a || l) : 2 === n.length && (b(a) && (l = a || l),
                b(r) && (o = r || o));
                const i = s(t)(_)
                  , c = "vnode" === o && T(i) && l ? i[0] : i;
                return l ? (u = l,
                e.modifiers ? e.modifiers[u] : Le)(c, o) : c;
                var u
            }
            ,
            message: s,
            type: y(e.processor) && b(e.processor.type) ? e.processor.type : Oe,
            interpolate: c,
            normalize: i,
            values: p({}, o, l)
        };
        return _
    }
    let Pe = null;
    const Ce = Re("function:translate");
    function Re(e) {
        return t => Pe && Pe.emit(e, t)
    }
    const Se = w.__EXTEND_POINT__
      , De = C(Se)
      , Fe = {
        NOT_FOUND_KEY: Se,
        FALLBACK_TO_TRANSLATE: De(),
        CANNOT_FORMAT_NUMBER: De(),
        FALLBACK_TO_NUMBER_FORMAT: De(),
        CANNOT_FORMAT_DATE: De(),
        FALLBACK_TO_DATE_FORMAT: De(),
        EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: De(),
        __EXTEND_POINT__: De()
    }
      , Me = {
        [Fe.NOT_FOUND_KEY]: "Not found '{key}' key in '{locale}' locale messages.",
        [Fe.FALLBACK_TO_TRANSLATE]: "Fall back to translate '{key}' key with '{target}' locale.",
        [Fe.CANNOT_FORMAT_NUMBER]: "Cannot format a number value due to not supported Intl.NumberFormat.",
        [Fe.FALLBACK_TO_NUMBER_FORMAT]: "Fall back to number format '{key}' key with '{target}' locale.",
        [Fe.CANNOT_FORMAT_DATE]: "Cannot format a date value due to not supported Intl.DateTimeFormat.",
        [Fe.FALLBACK_TO_DATE_FORMAT]: "Fall back to datetime format '{key}' key with '{target}' locale.",
        [Fe.EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER]: "This project is using Custom Message Compiler, which is an experimental feature. It may receive breaking changes or be removed in the future."
    };
    function Ue(e, ...t) {
        return l(Me[e], ...t)
    }
    const we = $.__EXTEND_POINT__
      , xe = C(we)
      , $e = {
        INVALID_ARGUMENT: we,
        INVALID_DATE_ARGUMENT: xe(),
        INVALID_ISO_DATE_ARGUMENT: xe(),
        NOT_SUPPORT_NON_STRING_MESSAGE: xe(),
        NOT_SUPPORT_LOCALE_PROMISE_VALUE: xe(),
        NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: xe(),
        NOT_SUPPORT_LOCALE_TYPE: xe(),
        __EXTEND_POINT__: xe()
    };
    function We(e) {
        return V(e, null, {
            messages: Ve
        })
    }
    const Ve = {
        [$e.INVALID_ARGUMENT]: "Invalid arguments",
        [$e.INVALID_DATE_ARGUMENT]: "The date provided is an invalid Date object.Make sure your Date represents a valid date.",
        [$e.INVALID_ISO_DATE_ARGUMENT]: "The argument provided is not a valid ISO date string",
        [$e.NOT_SUPPORT_NON_STRING_MESSAGE]: "Not support non-string message",
        [$e.NOT_SUPPORT_LOCALE_PROMISE_VALUE]: "cannot support promise value",
        [$e.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION]: "cannot support async function",
        [$e.NOT_SUPPORT_LOCALE_TYPE]: "cannot support locale type"
    };
    function He(e, t) {
        return null != t.locale ? Xe(t.locale) : Xe(e.locale)
    }
    let Ge;
    function Xe(e) {
        if (b(e))
            return e;
        if (N(e)) {
            if (e.resolvedOnce && null != Ge)
                return Ge;
            if ("Function" === e.constructor.name) {
                const t = e();
                if (O(t))
                    throw We($e.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
                return Ge = t
            }
            throw We($e.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)
        }
        throw We($e.NOT_SUPPORT_LOCALE_TYPE)
    }
    function Ye(e, t, n) {
        return [...new Set([n, ...T(t) ? t : h(t) ? Object.keys(t) : b(t) ? [t] : [n]])]
    }
    function Be(e, t, n) {
        const a = b(n) ? n : qe
          , r = e;
        r.__localeChainCache || (r.__localeChainCache = new Map);
        let o = r.__localeChainCache.get(a);
        if (!o) {
            o = [];
            let e = [n];
            for (; T(e); )
                e = je(o, e, t);
            const l = T(t) || !y(t) ? t : t.default ? t.default : null;
            e = b(l) ? [l] : l,
            T(e) && je(o, e, !1),
            r.__localeChainCache.set(a, o)
        }
        return o
    }
    function je(e, t, n) {
        let a = !0;
        for (let r = 0; r < t.length && L(a); r++) {
            const o = t[r];
            b(o) && (a = Ke(e, t[r], n))
        }
        return a
    }
    function Ke(e, t, n) {
        let a;
        const r = t.split("-");
        do {
            a = Qe(e, r.join("-"), n),
            r.splice(-1, 1)
        } while (r.length && !0 === a);
        return a
    }
    function Qe(e, t, n) {
        let a = !1;
        if (!e.includes(t) && (a = !0,
        t)) {
            a = "!" !== t[t.length - 1];
            const r = t.replace(/!/g, "");
            e.push(r),
            (T(n) || y(n)) && n[r] && (a = n[r])
        }
        return a
    }
    const ze = "9.13.1"
      , Je = -1
      , qe = "en-US"
      , Ze = ""
      , et = e => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
    let tt, nt, at;
    let rt = null;
    const ot = e => {
        rt = e
    }
      , lt = () => rt;
    let st = null;
    const it = e => {
        st = e
    }
      , ct = () => st;
    let ut = 0;
    function _t(e={}) {
        const t = N(e.onWarn) ? e.onWarn : R
          , n = b(e.version) ? e.version : ze
          , a = b(e.locale) || N(e.locale) ? e.locale : qe
          , r = N(a) ? qe : a
          , o = T(e.fallbackLocale) || y(e.fallbackLocale) || b(e.fallbackLocale) || !1 === e.fallbackLocale ? e.fallbackLocale : r
          , l = y(e.messages) ? e.messages : {
            [r]: {}
        }
          , s = y(e.datetimeFormats) ? e.datetimeFormats : {
            [r]: {}
        }
          , i = y(e.numberFormats) ? e.numberFormats : {
            [r]: {}
        }
          , c = p({}, e.modifiers || {}, {
            upper: (e, t) => "text" === t && b(e) ? e.toUpperCase() : "vnode" === t && h(e) && "__v_isVNode"in e ? e.children.toUpperCase() : e,
            lower: (e, t) => "text" === t && b(e) ? e.toLowerCase() : "vnode" === t && h(e) && "__v_isVNode"in e ? e.children.toLowerCase() : e,
            capitalize: (e, t) => "text" === t && b(e) ? et(e) : "vnode" === t && h(e) && "__v_isVNode"in e ? et(e.children) : e
        })
          , u = e.pluralRules || {}
          , _ = N(e.missing) ? e.missing : null
          , f = !L(e.missingWarn) && !m(e.missingWarn) || e.missingWarn
          , d = !L(e.fallbackWarn) && !m(e.fallbackWarn) || e.fallbackWarn
          , E = !!e.fallbackFormat
          , g = !!e.unresolving
          , v = N(e.postTranslation) ? e.postTranslation : null
          , O = y(e.processor) ? e.processor : null
          , I = !L(e.warnHtmlMessage) || e.warnHtmlMessage
          , k = !!e.escapeParameter
          , A = N(e.messageCompiler) ? e.messageCompiler : tt
          , P = N(e.messageResolver) ? e.messageResolver : nt || be
          , C = N(e.localeFallbacker) ? e.localeFallbacker : at || Ye
          , S = h(e.fallbackContext) ? e.fallbackContext : void 0
          , D = e
          , F = h(D.__datetimeFormatters) ? D.__datetimeFormatters : new Map
          , M = h(D.__numberFormatters) ? D.__numberFormatters : new Map
          , U = h(D.__meta) ? D.__meta : {};
        ut++;
        const w = {
            version: n,
            cid: ut,
            locale: a,
            fallbackLocale: o,
            messages: l,
            modifiers: c,
            pluralRules: u,
            missing: _,
            missingWarn: f,
            fallbackWarn: d,
            fallbackFormat: E,
            unresolving: g,
            postTranslation: v,
            processor: O,
            warnHtmlMessage: I,
            escapeParameter: k,
            messageCompiler: A,
            messageResolver: P,
            localeFallbacker: C,
            fallbackContext: S,
            onWarn: t,
            __meta: U
        };
        return w.datetimeFormats = s,
        w.numberFormats = i,
        w.__datetimeFormatters = F,
        w.__numberFormatters = M,
        w.__v_emitter = null != D.__v_emitter ? D.__v_emitter : void 0,
        function(e, t, n) {
            Pe && Pe.emit("i18n:init", {
                timestamp: Date.now(),
                i18n: e,
                version: t,
                meta: n
            })
        }(w, n, U),
        w
    }
    function mt(e, t) {
        return e instanceof RegExp ? e.test(t) : e
    }
    function ft(e, t) {
        return e instanceof RegExp ? e.test(t) : e
    }
    function pt(e, t, n, a, r) {
        const {missing: o, onWarn: l} = e;
        {
            const a = e.__v_emitter;
            a && a.emit("missing", {
                locale: n,
                key: t,
                type: r,
                groupId: `${r}:${t}`
            })
        }
        if (null !== o) {
            const a = o(e, n, t, r);
            return b(a) ? a : t
        }
        return ft(a, t) && l(Ue(Fe.NOT_FOUND_KEY, {
            key: t,
            locale: n
        })),
        t
    }
    function dt(e, t, n) {
        e.__localeChainCache = new Map,
        e.localeFallbacker(e, n, t)
    }
    function Et(e, t) {
        return e !== t && e.split("-")[0] === t.split("-")[0]
    }
    function gt(e, t) {
        const n = t.indexOf(e);
        if (-1 === n)
            return !1;
        for (let a = n + 1; a < t.length; a++)
            if (Et(e, t[a]))
                return !0;
        return !1
    }
    function vt(e) {
        return t => function(e, t) {
            const n = t.b || t.body;
            if (1 === (n.t || n.type)) {
                const t = n
                  , a = t.c || t.cases;
                return e.plural(a.reduce(( (t, n) => [...t, Tt(e, n)]), []))
            }
            return Tt(e, n)
        }(t, e)
    }
    function Tt(e, t) {
        const n = t.s || t.static;
        if (n)
            return "text" === e.type ? n : e.normalize([n]);
        {
            const n = (t.i || t.items).reduce(( (t, n) => [...t, Nt(e, n)]), []);
            return e.normalize(n)
        }
    }
    function Nt(e, t) {
        const n = t.t || t.type;
        switch (n) {
        case 3:
            {
                const e = t;
                return e.v || e.value
            }
        case 9:
            {
                const e = t;
                return e.v || e.value
            }
        case 4:
            {
                const n = t;
                return e.interpolate(e.named(n.k || n.key))
            }
        case 5:
            {
                const n = t;
                return e.interpolate(e.list(null != n.i ? n.i : n.index))
            }
        case 6:
            {
                const n = t
                  , a = n.m || n.modifier;
                return e.linked(Nt(e, n.k || n.key), a ? Nt(e, a) : void 0, e.type)
            }
        case 7:
            {
                const e = t;
                return e.v || e.value
            }
        case 8:
            {
                const e = t;
                return e.v || e.value
            }
        default:
            throw new Error(`unhandled node type on format message part: ${n}`)
        }
    }
    const bt = "Detected HTML in '{source}' message. Recommend not using HTML messages to avoid XSS.";
    const Lt = e => e;
    let ht = Object.create(null);
    function Ot(e) {
        e.code === w.USE_MODULO_SYNTAX && R(`The use of named interpolation with modulo syntax is deprecated. It will be removed in v10.\nreference: https://vue-i18n.intlify.dev/guide/essentials/syntax#rails-i18n-format \n(message compiler warning message: ${e.message})`)
    }
    const It = e => h(e) && (0 === e.t || 0 === e.type) && ("b"in e || "body"in e);
    const kt = () => ""
      , yt = e => N(e);
    function At(e, ...t) {
        const {fallbackFormat: o, postTranslation: l, unresolving: s, messageCompiler: i, fallbackLocale: c, messages: _} = e
          , [m,f] = Rt(...t)
          , d = L(f.missingWarn) ? f.missingWarn : e.missingWarn
          , g = L(f.fallbackWarn) ? f.fallbackWarn : e.fallbackWarn
          , v = L(f.escapeParameter) ? f.escapeParameter : e.escapeParameter
          , N = !!f.resolvedMessage
          , O = b(f.default) || L(f.default) ? L(f.default) ? i ? m : () => m : f.default : o ? i ? m : () => m : ""
          , I = o || "" !== O
          , k = He(e, f);
        v && function(e) {
            T(e.list) ? e.list = e.list.map((e => b(e) ? E(e) : e)) : h(e.named) && Object.keys(e.named).forEach((t => {
                b(e.named[t]) && (e.named[t] = E(e.named[t]))
            }
            ))
        }(f);
        let[y,A,P] = N ? [m, k, _[k] || {}] : Pt(e, m, k, c, g, d)
          , C = y
          , S = m;
        if (N || b(C) || It(C) || yt(C) || I && (C = O,
        S = C),
        !(N || (b(C) || It(C) || yt(C)) && b(A)))
            return s ? Je : m;
        if (b(C) && null == e.messageCompiler)
            return R(`The message format compilation is not supported in this build. Because message compiler isn't included. You need to pre-compilation all message format. So translate function return '${m}'.`),
            m;
        let D = !1;
        const F = yt(C) ? C : Ct(e, m, A, C, S, ( () => {
            D = !0
        }
        ));
        if (D)
            return C;
        const M = function(e, t, n, a) {
            const {modifiers: r, pluralRules: o, messageResolver: l, fallbackLocale: s, fallbackWarn: i, missingWarn: c, fallbackContext: _} = e
              , m = a => {
                let r = l(n, a);
                if (null == r && _) {
                    const [,,e] = Pt(_, a, t, s, i, c);
                    r = l(e, a)
                }
                if (b(r) || It(r)) {
                    let n = !1;
                    const o = Ct(e, a, t, r, a, ( () => {
                        n = !0
                    }
                    ));
                    return n ? kt : o
                }
                return yt(r) ? r : kt
            }
              , f = {
                locale: t,
                modifiers: r,
                pluralRules: o,
                messages: m
            };
            e.processor && (f.processor = e.processor);
            a.list && (f.list = a.list);
            a.named && (f.named = a.named);
            u(a.plural) && (f.pluralIndex = a.plural);
            return f
        }(e, A, P, f)
          , U = function(e, t, o) {
            let l, s, i = null;
            n && (i = window.performance.now(),
            l = "intlify-message-evaluation-start",
            s = "intlify-message-evaluation-end",
            a && a(l));
            const c = t(o);
            if (n) {
                const n = window.performance.now()
                  , o = e.__v_emitter;
                o && i && o.emit("message-evaluation", {
                    type: "message-evaluation",
                    value: c,
                    time: n - i,
                    groupId: `translate:${t.key}`
                }),
                l && s && a && r && (a(s),
                r("intlify message evaluation", l, s))
            }
            return c
        }(e, F, Ae(M))
          , w = l ? l(U, m) : U;
        {
            const t = {
                timestamp: Date.now(),
                key: b(m) ? m : yt(C) ? C.key : "",
                locale: A || (yt(C) ? C.locale : ""),
                format: b(C) ? C : yt(C) ? C.source : "",
                message: w
            };
            t.meta = p({}, e.__meta, lt() || {}),
            Ce(t)
        }
        return w
    }
    function Pt(e, t, o, l, s, i) {
        const {messages: c, onWarn: u, messageResolver: _, localeFallbacker: m} = e
          , f = m(e, l, o);
        let p, d = {}, E = null, g = o, v = null;
        const T = "translate";
        for (let l = 0; l < f.length; l++) {
            if (p = v = f[l],
            o !== p && !Et(o, p) && mt(s, t) && u(Ue(Fe.FALLBACK_TO_TRANSLATE, {
                key: t,
                target: p
            })),
            o !== p) {
                const n = e.__v_emitter;
                n && n.emit("fallback", {
                    type: T,
                    key: t,
                    from: g,
                    to: v,
                    groupId: `${T}:${t}`
                })
            }
            d = c[p] || {};
            let m, N, L = null;
            if (n && (L = window.performance.now(),
            m = "intlify-message-resolve-start",
            N = "intlify-message-resolve-end",
            a && a(m)),
            null === (E = _(d, t)) && (E = d[t]),
            n) {
                const n = window.performance.now()
                  , o = e.__v_emitter;
                o && L && E && o.emit("message-resolve", {
                    type: "message-resolve",
                    key: t,
                    message: E,
                    time: n - L,
                    groupId: `${T}:${t}`
                }),
                m && N && a && r && (a(N),
                r("intlify message resolve", m, N))
            }
            if (b(E) || It(E) || yt(E))
                break;
            if (!gt(p, f)) {
                const n = pt(e, t, p, i, T);
                n !== t && (E = n)
            }
            g = v
        }
        return [E, p, d]
    }
    function Ct(e, t, o, l, s, c) {
        const {messageCompiler: u, warnHtmlMessage: _} = e;
        if (yt(l)) {
            const e = l;
            return e.locale = e.locale || o,
            e.key = e.key || t,
            e
        }
        if (null == u) {
            const e = () => l;
            return e.locale = o,
            e.key = t,
            e
        }
        let m, f, p = null;
        n && (p = window.performance.now(),
        m = "intlify-message-compilation-start",
        f = "intlify-message-compilation-end",
        a && a(m));
        const d = u(l, function(e, t, n, a, r, o) {
            return {
                locale: t,
                key: n,
                warnHtmlMessage: r,
                onError: t => {
                    o && o(t);
                    {
                        const r = function(e) {
                            if (b(e))
                                return e;
                            if (e.loc && e.loc.source)
                                return e.loc.source
                        }(a)
                          , o = `Message compilation error: ${t.message}`
                          , l = t.location && r && function(e, t=0, n=e.length) {
                            const a = e.split(/\r?\n/);
                            let r = 0;
                            const o = [];
                            for (let e = 0; e < a.length; e++)
                                if (r += a[e].length + 1,
                                r >= t) {
                                    for (let l = e - P; l <= e + P || n > r; l++) {
                                        if (l < 0 || l >= a.length)
                                            continue;
                                        const s = l + 1;
                                        o.push(`${s}${" ".repeat(3 - String(s).length)}|  ${a[l]}`);
                                        const i = a[l].length;
                                        if (l === e) {
                                            const e = t - (r - i) + 1
                                              , a = Math.max(1, n > r ? i - e : n - t);
                                            o.push("   |  " + " ".repeat(e) + "^".repeat(a))
                                        } else if (l > e) {
                                            if (n > r) {
                                                const e = Math.max(Math.min(n - r, i), 1);
                                                o.push("   |  " + "^".repeat(e))
                                            }
                                            r += i + 1
                                        }
                                    }
                                    break
                                }
                            return o.join("\n")
                        }(r, t.location.start.offset, t.location.end.offset)
                          , s = e.__v_emitter;
                        s && r && s.emit("compile-error", {
                            message: r,
                            error: t.message,
                            start: t.location && t.location.start.offset,
                            end: t.location && t.location.end.offset,
                            groupId: `translate:${n}`
                        }),
                        console.error(l ? `${o}\n${l}` : o)
                    }
                }
                ,
                onCacheKey: e => i(t, n, e)
            }
        }(e, o, s, l, _, c));
        if (n) {
            const n = window.performance.now()
              , o = e.__v_emitter;
            o && p && o.emit("message-compilation", {
                type: "message-compilation",
                message: l,
                time: n - p,
                groupId: `translate:${t}`
            }),
            m && f && a && r && (a(f),
            r("intlify message compilation", m, f))
        }
        return d.locale = o,
        d.key = t,
        d.source = l,
        d
    }
    function Rt(...e) {
        const [t,n,a] = e
          , r = {};
        if (!(b(t) || u(t) || yt(t) || It(t)))
            throw We($e.INVALID_ARGUMENT);
        const o = u(t) ? String(t) : (yt(t),
        t);
        return u(n) ? r.plural = n : b(n) ? r.default = n : y(n) && !f(n) ? r.named = n : T(n) && (r.list = n),
        u(a) ? r.plural = a : b(a) ? r.default = a : y(a) && p(r, a),
        [o, r]
    }
    const St = "undefined" != typeof Intl
      , Dt = {
        dateTimeFormat: St && void 0 !== Intl.DateTimeFormat,
        numberFormat: St && void 0 !== Intl.NumberFormat
    };
    function Ft(e, ...t) {
        const {datetimeFormats: n, unresolving: a, fallbackLocale: r, onWarn: o, localeFallbacker: l} = e
          , {__datetimeFormatters: s} = e;
        if (!Dt.dateTimeFormat)
            return o(Ue(Fe.CANNOT_FORMAT_DATE)),
            Ze;
        const [i,c,u,_] = Ut(...t)
          , m = L(u.missingWarn) ? u.missingWarn : e.missingWarn
          , d = L(u.fallbackWarn) ? u.fallbackWarn : e.fallbackWarn
          , E = !!u.part
          , g = He(e, u)
          , v = l(e, r, g);
        if (!b(i) || "" === i)
            return new Intl.DateTimeFormat(g,_).format(c);
        let T, N = {}, h = null, O = g, I = null;
        const k = "datetime format";
        for (let t = 0; t < v.length; t++) {
            if (T = I = v[t],
            g !== T && mt(d, i) && o(Ue(Fe.FALLBACK_TO_DATE_FORMAT, {
                key: i,
                target: T
            })),
            g !== T) {
                const t = e.__v_emitter;
                t && t.emit("fallback", {
                    type: k,
                    key: i,
                    from: O,
                    to: I,
                    groupId: `${k}:${i}`
                })
            }
            if (N = n[T] || {},
            h = N[i],
            y(h))
                break;
            pt(e, i, T, m, k),
            O = I
        }
        if (!y(h) || !b(T))
            return a ? Je : i;
        let A = `${T}__${i}`;
        f(_) || (A = `${A}__${JSON.stringify(_)}`);
        let P = s.get(A);
        return P || (P = new Intl.DateTimeFormat(T,p({}, h, _)),
        s.set(A, P)),
        E ? P.formatToParts(c) : P.format(c)
    }
    const Mt = ["localeMatcher", "weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName", "formatMatcher", "hour12", "timeZone", "dateStyle", "timeStyle", "calendar", "dayPeriod", "numberingSystem", "hourCycle", "fractionalSecondDigits"];
    function Ut(...e) {
        const [t,n,a,r] = e
          , o = {};
        let l, s = {};
        if (b(t)) {
            const e = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
            if (!e)
                throw We($e.INVALID_ISO_DATE_ARGUMENT);
            const n = e[3] ? e[3].trim().startsWith("T") ? `${e[1].trim()}${e[3].trim()}` : `${e[1].trim()}T${e[3].trim()}` : e[1].trim();
            l = new Date(n);
            try {
                l.toISOString()
            } catch (e) {
                throw We($e.INVALID_ISO_DATE_ARGUMENT)
            }
        } else if (_(t)) {
            if (isNaN(t.getTime()))
                throw We($e.INVALID_DATE_ARGUMENT);
            l = t
        } else {
            if (!u(t))
                throw We($e.INVALID_ARGUMENT);
            l = t
        }
        return b(n) ? o.key = n : y(n) && Object.keys(n).forEach((e => {
            Mt.includes(e) ? s[e] = n[e] : o[e] = n[e]
        }
        )),
        b(a) ? o.locale = a : y(a) && (s = a),
        y(r) && (s = r),
        [o.key || "", l, o, s]
    }
    function wt(e, t, n) {
        const a = e;
        for (const e in n) {
            const n = `${t}__${e}`;
            a.__datetimeFormatters.has(n) && a.__datetimeFormatters.delete(n)
        }
    }
    function xt(e, ...t) {
        const {numberFormats: n, unresolving: a, fallbackLocale: r, onWarn: o, localeFallbacker: l} = e
          , {__numberFormatters: s} = e;
        if (!Dt.numberFormat)
            return o(Ue(Fe.CANNOT_FORMAT_NUMBER)),
            Ze;
        const [i,c,u,_] = Wt(...t)
          , m = L(u.missingWarn) ? u.missingWarn : e.missingWarn
          , d = L(u.fallbackWarn) ? u.fallbackWarn : e.fallbackWarn
          , E = !!u.part
          , g = He(e, u)
          , v = l(e, r, g);
        if (!b(i) || "" === i)
            return new Intl.NumberFormat(g,_).format(c);
        let T, N = {}, h = null, O = g, I = null;
        const k = "number format";
        for (let t = 0; t < v.length; t++) {
            if (T = I = v[t],
            g !== T && mt(d, i) && o(Ue(Fe.FALLBACK_TO_NUMBER_FORMAT, {
                key: i,
                target: T
            })),
            g !== T) {
                const t = e.__v_emitter;
                t && t.emit("fallback", {
                    type: k,
                    key: i,
                    from: O,
                    to: I,
                    groupId: `${k}:${i}`
                })
            }
            if (N = n[T] || {},
            h = N[i],
            y(h))
                break;
            pt(e, i, T, m, k),
            O = I
        }
        if (!y(h) || !b(T))
            return a ? Je : i;
        let A = `${T}__${i}`;
        f(_) || (A = `${A}__${JSON.stringify(_)}`);
        let P = s.get(A);
        return P || (P = new Intl.NumberFormat(T,p({}, h, _)),
        s.set(A, P)),
        E ? P.formatToParts(c) : P.format(c)
    }
    const $t = ["localeMatcher", "style", "currency", "currencyDisplay", "currencySign", "useGrouping", "minimumIntegerDigits", "minimumFractionDigits", "maximumFractionDigits", "minimumSignificantDigits", "maximumSignificantDigits", "compactDisplay", "notation", "signDisplay", "unit", "unitDisplay", "roundingMode", "roundingPriority", "roundingIncrement", "trailingZeroDisplay"];
    function Wt(...e) {
        const [t,n,a,r] = e
          , o = {};
        let l = {};
        if (!u(t))
            throw We($e.INVALID_ARGUMENT);
        const s = t;
        return b(n) ? o.key = n : y(n) && Object.keys(n).forEach((e => {
            $t.includes(e) ? l[e] = n[e] : o[e] = n[e]
        }
        )),
        b(a) ? o.locale = a : y(a) && (l = a),
        y(r) && (l = r),
        [o.key || "", s, o, l]
    }
    function Vt(e, t, n) {
        const a = e;
        for (const e in n) {
            const n = `${t}__${e}`;
            a.__numberFormatters.has(n) && a.__numberFormatters.delete(n)
        }
    }
    const Ht = "9.13.1";
    const Gt = Fe.__EXTEND_POINT__
      , Xt = C(Gt)
      , Yt = {
        FALLBACK_TO_ROOT: Gt,
        NOT_SUPPORTED_PRESERVE: Xt(),
        NOT_SUPPORTED_FORMATTER: Xt(),
        NOT_SUPPORTED_PRESERVE_DIRECTIVE: Xt(),
        NOT_SUPPORTED_GET_CHOICE_INDEX: Xt(),
        COMPONENT_NAME_LEGACY_COMPATIBLE: Xt(),
        NOT_FOUND_PARENT_SCOPE: Xt(),
        IGNORE_OBJ_FLATTEN: Xt(),
        NOTICE_DROP_ALLOW_COMPOSITION: Xt(),
        NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG: Xt()
    }
      , Bt = {
        [Yt.FALLBACK_TO_ROOT]: "Fall back to {type} '{key}' with root locale.",
        [Yt.NOT_SUPPORTED_PRESERVE]: "Not supported 'preserve'.",
        [Yt.NOT_SUPPORTED_FORMATTER]: "Not supported 'formatter'.",
        [Yt.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: "Not supported 'preserveDirectiveContent'.",
        [Yt.NOT_SUPPORTED_GET_CHOICE_INDEX]: "Not supported 'getChoiceIndex'.",
        [Yt.COMPONENT_NAME_LEGACY_COMPATIBLE]: "Component name legacy compatible: '{name}' -> 'i18n'",
        [Yt.NOT_FOUND_PARENT_SCOPE]: "Not found parent scope. use the global scope.",
        [Yt.IGNORE_OBJ_FLATTEN]: "Ignore object flatten: '{key}' key has an string value",
        [Yt.NOTICE_DROP_ALLOW_COMPOSITION]: "'allowComposition' option will be dropped in the next major version. For more information, please see 👉 https://tinyurl.com/2p97mcze",
        [Yt.NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG]: "'translateExistCompatible' option will be dropped in the next major version."
    };
    function jt(e, ...t) {
        return l(Bt[e], ...t)
    }
    const Kt = $e.__EXTEND_POINT__
      , Qt = C(Kt)
      , zt = {
        UNEXPECTED_RETURN_TYPE: Kt,
        INVALID_ARGUMENT: Qt(),
        MUST_BE_CALL_SETUP_TOP: Qt(),
        NOT_INSTALLED: Qt(),
        NOT_AVAILABLE_IN_LEGACY_MODE: Qt(),
        REQUIRED_VALUE: Qt(),
        INVALID_VALUE: Qt(),
        CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: Qt(),
        NOT_INSTALLED_WITH_PROVIDE: Qt(),
        UNEXPECTED_ERROR: Qt(),
        NOT_COMPATIBLE_LEGACY_VUE_I18N: Qt(),
        BRIDGE_SUPPORT_VUE_2_ONLY: Qt(),
        MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: Qt(),
        NOT_AVAILABLE_COMPOSITION_IN_LEGACY: Qt(),
        __EXTEND_POINT__: Qt()
    };
    function Jt(e, ...t) {
        return V(e, null, {
            messages: qt,
            args: t
        })
    }
    const qt = {
        [zt.UNEXPECTED_RETURN_TYPE]: "Unexpected return type in composer",
        [zt.INVALID_ARGUMENT]: "Invalid argument",
        [zt.MUST_BE_CALL_SETUP_TOP]: "Must be called at the top of a `setup` function",
        [zt.NOT_INSTALLED]: "Need to install with `app.use` function",
        [zt.UNEXPECTED_ERROR]: "Unexpected error",
        [zt.NOT_AVAILABLE_IN_LEGACY_MODE]: "Not available in legacy mode",
        [zt.REQUIRED_VALUE]: "Required in value: {0}",
        [zt.INVALID_VALUE]: "Invalid value",
        [zt.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: "Cannot setup vue-devtools plugin",
        [zt.NOT_INSTALLED_WITH_PROVIDE]: "Need to install with `provide` function",
        [zt.NOT_COMPATIBLE_LEGACY_VUE_I18N]: "Not compatible legacy VueI18n.",
        [zt.BRIDGE_SUPPORT_VUE_2_ONLY]: "vue-i18n-bridge support Vue 2.x only",
        [zt.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION]: "Must define ‘i18n’ option or custom block in Composition API with using local scope in Legacy API mode",
        [zt.NOT_AVAILABLE_COMPOSITION_IN_LEGACY]: "Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly"
    }
      , Zt = s("__translateVNode")
      , en = s("__datetimeParts")
      , tn = s("__numberParts")
      , nn = s("__enableEmitter")
      , an = s("__disableEmitter")
      , rn = s("__setPluralRules")
      , on = s("__injectWithOption")
      , ln = s("__dispose");
    function sn(e) {
        if (!h(e))
            return e;
        for (const t in e)
            if (v(e, t))
                if (t.includes(".")) {
                    const n = t.split(".")
                      , a = n.length - 1;
                    let r = e
                      , o = !1;
                    for (let e = 0; e < a; e++) {
                        if (n[e]in r || (r[n[e]] = {}),
                        !h(r[n[e]])) {
                            R(jt(Yt.IGNORE_OBJ_FLATTEN, {
                                key: n[e]
                            })),
                            o = !0;
                            break
                        }
                        r = r[n[e]]
                    }
                    o || (r[n[a]] = e[t],
                    delete e[t]),
                    h(r[n[a]]) && sn(r[n[a]])
                } else
                    h(e[t]) && sn(e[t]);
        return e
    }
    function cn(e, t) {
        const {messages: n, __i18n: a, messageResolver: r, flatJson: o} = t
          , l = y(n) ? n : T(a) ? {} : {
            [e]: {}
        };
        if (T(a) && a.forEach((e => {
            if ("locale"in e && "resource"in e) {
                const {locale: t, resource: n} = e;
                t ? (l[t] = l[t] || {},
                M(n, l[t])) : M(n, l)
            } else
                b(e) && M(JSON.parse(e), l)
        }
        )),
        null == r && o)
            for (const e in l)
                v(l, e) && sn(l[e]);
        return l
    }
    function un(e) {
        return e.type
    }
    function _n(e, t, n) {
        let a = h(t.messages) ? t.messages : {};
        "__i18nGlobal"in n && (a = cn(e.locale.value, {
            messages: a,
            __i18n: n.__i18nGlobal
        }));
        const r = Object.keys(a);
        if (r.length && r.forEach((t => {
            e.mergeLocaleMessage(t, a[t])
        }
        )),
        h(t.datetimeFormats)) {
            const n = Object.keys(t.datetimeFormats);
            n.length && n.forEach((n => {
                e.mergeDateTimeFormat(n, t.datetimeFormats[n])
            }
            ))
        }
        if (h(t.numberFormats)) {
            const n = Object.keys(t.numberFormats);
            n.length && n.forEach((n => {
                e.mergeNumberFormat(n, t.numberFormats[n])
            }
            ))
        }
    }
    function mn(e) {
        return t.createVNode(t.Text, null, e, 0)
    }
    const fn = "__INTLIFY_META__"
      , pn = () => []
      , dn = () => !1;
    let En = 0;
    function gn(e) {
        return (n, a, r, o) => e(a, r, t.getCurrentInstance() || void 0, o)
    }
    const vn = () => {
        const e = t.getCurrentInstance();
        let n = null;
        return e && (n = un(e)[fn]) ? {
            [fn]: n
        } : null
    }
    ;
    function Tn(e={}, a) {
        const {__root: r, __injectWithOption: o} = e
          , l = void 0 === r
          , s = e.flatJson
          , i = n ? t.ref : t.shallowRef
          , c = !!e.translateExistCompatible;
        var _;
        c && (_ = jt(Yt.NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG),
        S[_] || (S[_] = !0,
        R(_)));
        let f = !L(e.inheritLocale) || e.inheritLocale;
        const d = i(r && f ? r.locale.value : b(e.locale) ? e.locale : qe)
          , E = i(r && f ? r.fallbackLocale.value : b(e.fallbackLocale) || T(e.fallbackLocale) || y(e.fallbackLocale) || !1 === e.fallbackLocale ? e.fallbackLocale : d.value)
          , g = i(cn(d.value, e))
          , O = i(y(e.datetimeFormats) ? e.datetimeFormats : {
            [d.value]: {}
        })
          , I = i(y(e.numberFormats) ? e.numberFormats : {
            [d.value]: {}
        });
        let k = r ? r.missingWarn : !L(e.missingWarn) && !m(e.missingWarn) || e.missingWarn
          , A = r ? r.fallbackWarn : !L(e.fallbackWarn) && !m(e.fallbackWarn) || e.fallbackWarn
          , P = r ? r.fallbackRoot : !L(e.fallbackRoot) || e.fallbackRoot
          , C = !!e.fallbackFormat
          , D = N(e.missing) ? e.missing : null
          , F = N(e.missing) ? gn(e.missing) : null
          , U = N(e.postTranslation) ? e.postTranslation : null
          , w = r ? r.warnHtmlMessage : !L(e.warnHtmlMessage) || e.warnHtmlMessage
          , x = !!e.escapeParameter;
        const $ = r ? r.modifiers : y(e.modifiers) ? e.modifiers : {};
        let W, V = e.pluralRules || r && r.pluralRules;
        W = ( () => {
            l && it(null);
            const t = {
                version: Ht,
                locale: d.value,
                fallbackLocale: E.value,
                messages: g.value,
                modifiers: $,
                pluralRules: V,
                missing: null === F ? void 0 : F,
                missingWarn: k,
                fallbackWarn: A,
                fallbackFormat: C,
                unresolving: !0,
                postTranslation: null === U ? void 0 : U,
                warnHtmlMessage: w,
                escapeParameter: x,
                messageResolver: e.messageResolver,
                messageCompiler: e.messageCompiler,
                __meta: {
                    framework: "vue"
                }
            };
            t.datetimeFormats = O.value,
            t.numberFormats = I.value,
            t.__datetimeFormatters = y(W) ? W.__datetimeFormatters : void 0,
            t.__numberFormatters = y(W) ? W.__numberFormatters : void 0,
            t.__v_emitter = y(W) ? W.__v_emitter : void 0;
            const n = _t(t);
            return l && it(n),
            n
        }
        )(),
        dt(W, d.value, E.value);
        const H = t.computed({
            get: () => d.value,
            set: e => {
                d.value = e,
                W.locale = d.value
            }
        })
          , G = t.computed({
            get: () => E.value,
            set: e => {
                E.value = e,
                W.fallbackLocale = E.value,
                dt(W, d.value, e)
            }
        })
          , X = t.computed(( () => g.value))
          , Y = t.computed(( () => O.value))
          , B = t.computed(( () => I.value));
        const j = (e, t, n, a, o, s) => {
            let i;
            d.value,
            E.value,
            g.value,
            O.value,
            I.value;
            try {
                ot(vn()),
                l || (W.fallbackContext = r ? ct() : void 0),
                i = e(W)
            } finally {
                l || (W.fallbackContext = void 0)
            }
            if ("translate exists" !== n && u(i) && i === Je || "translate exists" === n && !i) {
                const [e,l] = t();
                if (r && b(e) && (c = l,
                "translate" !== n || !c.resolvedMessage)) {
                    P && (mt(A, e) || ft(k, e)) && R(jt(Yt.FALLBACK_TO_ROOT, {
                        key: e,
                        type: n
                    }));
                    {
                        const {__v_emitter: t} = W;
                        t && P && t.emit("fallback", {
                            type: n,
                            key: e,
                            to: "global",
                            groupId: `${n}:${e}`
                        })
                    }
                }
                return r && P ? a(r) : o(e)
            }
            if (s(i))
                return i;
            throw Jt(zt.UNEXPECTED_RETURN_TYPE);
            var c
        }
        ;
        function K(...e) {
            return j((t => Reflect.apply(At, null, [t, ...e])), ( () => Rt(...e)), "translate", (t => Reflect.apply(t.t, t, [...e])), (e => e), (e => b(e)))
        }
        const Q = {
            normalize: function(e) {
                return e.map((e => b(e) || u(e) || L(e) ? mn(String(e)) : e))
            },
            interpolate: e => e,
            type: "vnode"
        };
        function z(e) {
            return g.value[e] || {}
        }
        En++,
        r && n && (t.watch(r.locale, (e => {
            f && (d.value = e,
            W.locale = e,
            dt(W, d.value, E.value))
        }
        )),
        t.watch(r.fallbackLocale, (e => {
            f && (E.value = e,
            W.fallbackLocale = e,
            dt(W, d.value, E.value))
        }
        )));
        const J = {
            id: En,
            locale: H,
            fallbackLocale: G,
            get inheritLocale() {
                return f
            },
            set inheritLocale(e) {
                f = e,
                e && r && (d.value = r.locale.value,
                E.value = r.fallbackLocale.value,
                dt(W, d.value, E.value))
            },
            get availableLocales() {
                return Object.keys(g.value).sort()
            },
            messages: X,
            get modifiers() {
                return $
            },
            get pluralRules() {
                return V || {}
            },
            get isGlobal() {
                return l
            },
            get missingWarn() {
                return k
            },
            set missingWarn(e) {
                k = e,
                W.missingWarn = k
            },
            get fallbackWarn() {
                return A
            },
            set fallbackWarn(e) {
                A = e,
                W.fallbackWarn = A
            },
            get fallbackRoot() {
                return P
            },
            set fallbackRoot(e) {
                P = e
            },
            get fallbackFormat() {
                return C
            },
            set fallbackFormat(e) {
                C = e,
                W.fallbackFormat = C
            },
            get warnHtmlMessage() {
                return w
            },
            set warnHtmlMessage(e) {
                w = e,
                W.warnHtmlMessage = e
            },
            get escapeParameter() {
                return x
            },
            set escapeParameter(e) {
                x = e,
                W.escapeParameter = e
            },
            t: K,
            getLocaleMessage: z,
            setLocaleMessage: function(e, t) {
                if (s) {
                    const n = {
                        [e]: t
                    };
                    for (const e in n)
                        v(n, e) && sn(n[e]);
                    t = n[e]
                }
                g.value[e] = t,
                W.messages = g.value
            },
            mergeLocaleMessage: function(e, t) {
                g.value[e] = g.value[e] || {};
                const n = {
                    [e]: t
                };
                if (s)
                    for (const e in n)
                        v(n, e) && sn(n[e]);
                M(t = n[e], g.value[e]),
                W.messages = g.value
            },
            getPostTranslationHandler: function() {
                return N(U) ? U : null
            },
            setPostTranslationHandler: function(e) {
                U = e,
                W.postTranslation = e
            },
            getMissingHandler: function() {
                return D
            },
            setMissingHandler: function(e) {
                null !== e && (F = gn(e)),
                D = e,
                W.missing = F
            },
            [rn]: function(e) {
                V = e,
                W.pluralRules = V
            }
        };
        return J.datetimeFormats = Y,
        J.numberFormats = B,
        J.rt = function(...e) {
            const [t,n,a] = e;
            if (a && !h(a))
                throw Jt(zt.INVALID_ARGUMENT);
            return K(t, n, p({
                resolvedMessage: !0
            }, a || {}))
        }
        ,
        J.te = function(e, t) {
            return j(( () => {
                if (!e)
                    return !1;
                const n = z(b(t) ? t : d.value)
                  , a = W.messageResolver(n, e);
                return c ? null != a : It(a) || yt(a) || b(a)
            }
            ), ( () => [e]), "translate exists", (n => Reflect.apply(n.te, n, [e, t])), dn, (e => L(e)))
        }
        ,
        J.tm = function(e) {
            const t = function(e) {
                let t = null;
                const n = Be(W, E.value, d.value);
                for (let a = 0; a < n.length; a++) {
                    const r = g.value[n[a]] || {}
                      , o = W.messageResolver(r, e);
                    if (null != o) {
                        t = o;
                        break
                    }
                }
                return t
            }(e);
            return null != t ? t : r && r.tm(e) || {}
        }
        ,
        J.d = function(...e) {
            return j((t => Reflect.apply(Ft, null, [t, ...e])), ( () => Ut(...e)), "datetime format", (t => Reflect.apply(t.d, t, [...e])), ( () => Ze), (e => b(e)))
        }
        ,
        J.n = function(...e) {
            return j((t => Reflect.apply(xt, null, [t, ...e])), ( () => Wt(...e)), "number format", (t => Reflect.apply(t.n, t, [...e])), ( () => Ze), (e => b(e)))
        }
        ,
        J.getDateTimeFormat = function(e) {
            return O.value[e] || {}
        }
        ,
        J.setDateTimeFormat = function(e, t) {
            O.value[e] = t,
            W.datetimeFormats = O.value,
            wt(W, e, t)
        }
        ,
        J.mergeDateTimeFormat = function(e, t) {
            O.value[e] = p(O.value[e] || {}, t),
            W.datetimeFormats = O.value,
            wt(W, e, t)
        }
        ,
        J.getNumberFormat = function(e) {
            return I.value[e] || {}
        }
        ,
        J.setNumberFormat = function(e, t) {
            I.value[e] = t,
            W.numberFormats = I.value,
            Vt(W, e, t)
        }
        ,
        J.mergeNumberFormat = function(e, t) {
            I.value[e] = p(I.value[e] || {}, t),
            W.numberFormats = I.value,
            Vt(W, e, t)
        }
        ,
        J[on] = o,
        J[Zt] = function(...e) {
            return j((t => {
                let n;
                const a = t;
                try {
                    a.processor = Q,
                    n = Reflect.apply(At, null, [a, ...e])
                } finally {
                    a.processor = null
                }
                return n
            }
            ), ( () => Rt(...e)), "translate", (t => t[Zt](...e)), (e => [mn(e)]), (e => T(e)))
        }
        ,
        J[en] = function(...e) {
            return j((t => Reflect.apply(Ft, null, [t, ...e])), ( () => Ut(...e)), "datetime format", (t => t[en](...e)), pn, (e => b(e) || T(e)))
        }
        ,
        J[tn] = function(...e) {
            return j((t => Reflect.apply(xt, null, [t, ...e])), ( () => Wt(...e)), "number format", (t => t[tn](...e)), pn, (e => b(e) || T(e)))
        }
        ,
        J[nn] = e => {
            W.__v_emitter = e
        }
        ,
        J[an] = () => {
            W.__v_emitter = void 0
        }
        ,
        J
    }
    function Nn(e={}, t) {
        {
            const t = Tn(function(e) {
                const t = b(e.locale) ? e.locale : qe
                  , n = b(e.fallbackLocale) || T(e.fallbackLocale) || y(e.fallbackLocale) || !1 === e.fallbackLocale ? e.fallbackLocale : t
                  , a = N(e.missing) ? e.missing : void 0
                  , r = !L(e.silentTranslationWarn) && !m(e.silentTranslationWarn) || !e.silentTranslationWarn
                  , o = !L(e.silentFallbackWarn) && !m(e.silentFallbackWarn) || !e.silentFallbackWarn
                  , l = !L(e.fallbackRoot) || e.fallbackRoot
                  , s = !!e.formatFallbackMessages
                  , i = y(e.modifiers) ? e.modifiers : {}
                  , c = e.pluralizationRules
                  , u = N(e.postTranslation) ? e.postTranslation : void 0
                  , _ = !b(e.warnHtmlInMessage) || "off" !== e.warnHtmlInMessage
                  , f = !!e.escapeParameterHtml
                  , d = !L(e.sync) || e.sync;
                e.formatter && R(jt(Yt.NOT_SUPPORTED_FORMATTER)),
                e.preserveDirectiveContent && R(jt(Yt.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
                let E = e.messages;
                if (y(e.sharedMessages)) {
                    const t = e.sharedMessages;
                    E = Object.keys(t).reduce(( (e, n) => {
                        const a = e[n] || (e[n] = {});
                        return p(a, t[n]),
                        e
                    }
                    ), E || {})
                }
                const {__i18n: g, __root: v, __injectWithOption: h} = e
                  , O = e.datetimeFormats
                  , I = e.numberFormats
                  , k = e.flatJson
                  , A = e.translateExistCompatible;
                return {
                    locale: t,
                    fallbackLocale: n,
                    messages: E,
                    flatJson: k,
                    datetimeFormats: O,
                    numberFormats: I,
                    missing: a,
                    missingWarn: r,
                    fallbackWarn: o,
                    fallbackRoot: l,
                    fallbackFormat: s,
                    modifiers: i,
                    pluralRules: c,
                    postTranslation: u,
                    warnHtmlMessage: _,
                    escapeParameter: f,
                    messageResolver: e.messageResolver,
                    inheritLocale: d,
                    translateExistCompatible: A,
                    __i18n: g,
                    __root: v,
                    __injectWithOption: h
                }
            }(e))
              , {__extender: n} = e
              , a = {
                id: t.id,
                get locale() {
                    return t.locale.value
                },
                set locale(e) {
                    t.locale.value = e
                },
                get fallbackLocale() {
                    return t.fallbackLocale.value
                },
                set fallbackLocale(e) {
                    t.fallbackLocale.value = e
                },
                get messages() {
                    return t.messages.value
                },
                get datetimeFormats() {
                    return t.datetimeFormats.value
                },
                get numberFormats() {
                    return t.numberFormats.value
                },
                get availableLocales() {
                    return t.availableLocales
                },
                get formatter() {
                    return R(jt(Yt.NOT_SUPPORTED_FORMATTER)),
                    {
                        interpolate: () => []
                    }
                },
                set formatter(e) {
                    R(jt(Yt.NOT_SUPPORTED_FORMATTER))
                },
                get missing() {
                    return t.getMissingHandler()
                },
                set missing(e) {
                    t.setMissingHandler(e)
                },
                get silentTranslationWarn() {
                    return L(t.missingWarn) ? !t.missingWarn : t.missingWarn
                },
                set silentTranslationWarn(e) {
                    t.missingWarn = L(e) ? !e : e
                },
                get silentFallbackWarn() {
                    return L(t.fallbackWarn) ? !t.fallbackWarn : t.fallbackWarn
                },
                set silentFallbackWarn(e) {
                    t.fallbackWarn = L(e) ? !e : e
                },
                get modifiers() {
                    return t.modifiers
                },
                get formatFallbackMessages() {
                    return t.fallbackFormat
                },
                set formatFallbackMessages(e) {
                    t.fallbackFormat = e
                },
                get postTranslation() {
                    return t.getPostTranslationHandler()
                },
                set postTranslation(e) {
                    t.setPostTranslationHandler(e)
                },
                get sync() {
                    return t.inheritLocale
                },
                set sync(e) {
                    t.inheritLocale = e
                },
                get warnHtmlInMessage() {
                    return t.warnHtmlMessage ? "warn" : "off"
                },
                set warnHtmlInMessage(e) {
                    t.warnHtmlMessage = "off" !== e
                },
                get escapeParameterHtml() {
                    return t.escapeParameter
                },
                set escapeParameterHtml(e) {
                    t.escapeParameter = e
                },
                get preserveDirectiveContent() {
                    return R(jt(Yt.NOT_SUPPORTED_PRESERVE_DIRECTIVE)),
                    !0
                },
                set preserveDirectiveContent(e) {
                    R(jt(Yt.NOT_SUPPORTED_PRESERVE_DIRECTIVE))
                },
                get pluralizationRules() {
                    return t.pluralRules || {}
                },
                __composer: t,
                t(...e) {
                    const [n,a,r] = e
                      , o = {};
                    let l = null
                      , s = null;
                    if (!b(n))
                        throw Jt(zt.INVALID_ARGUMENT);
                    const i = n;
                    return b(a) ? o.locale = a : T(a) ? l = a : y(a) && (s = a),
                    T(r) ? l = r : y(r) && (s = r),
                    Reflect.apply(t.t, t, [i, l || s || {}, o])
                },
                rt: (...e) => Reflect.apply(t.rt, t, [...e]),
                tc(...e) {
                    const [n,a,r] = e
                      , o = {
                        plural: 1
                    };
                    let l = null
                      , s = null;
                    if (!b(n))
                        throw Jt(zt.INVALID_ARGUMENT);
                    const i = n;
                    return b(a) ? o.locale = a : u(a) ? o.plural = a : T(a) ? l = a : y(a) && (s = a),
                    b(r) ? o.locale = r : T(r) ? l = r : y(r) && (s = r),
                    Reflect.apply(t.t, t, [i, l || s || {}, o])
                },
                te: (e, n) => t.te(e, n),
                tm: e => t.tm(e),
                getLocaleMessage: e => t.getLocaleMessage(e),
                setLocaleMessage(e, n) {
                    t.setLocaleMessage(e, n)
                },
                mergeLocaleMessage(e, n) {
                    t.mergeLocaleMessage(e, n)
                },
                d: (...e) => Reflect.apply(t.d, t, [...e]),
                getDateTimeFormat: e => t.getDateTimeFormat(e),
                setDateTimeFormat(e, n) {
                    t.setDateTimeFormat(e, n)
                },
                mergeDateTimeFormat(e, n) {
                    t.mergeDateTimeFormat(e, n)
                },
                n: (...e) => Reflect.apply(t.n, t, [...e]),
                getNumberFormat: e => t.getNumberFormat(e),
                setNumberFormat(e, n) {
                    t.setNumberFormat(e, n)
                },
                mergeNumberFormat(e, n) {
                    t.mergeNumberFormat(e, n)
                },
                getChoiceIndex: (e, t) => (R(jt(Yt.NOT_SUPPORTED_GET_CHOICE_INDEX)),
                -1)
            };
            return a.__extender = n,
            a.__enableEmitter = e => {
                const n = t;
                n[nn] && n[nn](e)
            }
            ,
            a.__disableEmitter = () => {
                const e = t;
                e[an] && e[an]()
            }
            ,
            a
        }
    }
    const bn = {
        tag: {
            type: [String, Object]
        },
        locale: {
            type: String
        },
        scope: {
            type: String,
            validator: e => "parent" === e || "global" === e,
            default: "parent"
        },
        i18n: {
            type: Object
        }
    };
    function Ln(e) {
        return t.Fragment
    }
    const hn = t.defineComponent({
        name: "i18n-t",
        props: p({
            keypath: {
                type: String,
                required: !0
            },
            plural: {
                type: [Number, String],
                validator: e => u(e) || !isNaN(e)
            }
        }, bn),
        setup(e, n) {
            const {slots: a, attrs: r} = n
              , o = e.i18n || ra({
                useScope: e.scope,
                __useComponent: !0
            });
            return () => {
                const l = Object.keys(a).filter((e => "_" !== e))
                  , s = {};
                e.locale && (s.locale = e.locale),
                void 0 !== e.plural && (s.plural = b(e.plural) ? +e.plural : e.plural);
                const i = function({slots: e}, n) {
                    if (1 === n.length && "default" === n[0])
                        return (e.default ? e.default() : []).reduce(( (e, n) => [...e, ...n.type === t.Fragment ? n.children : [n]]), []);
                    return n.reduce(( (t, n) => {
                        const a = e[n];
                        return a && (t[n] = a()),
                        t
                    }
                    ), {})
                }(n, l)
                  , c = o[Zt](e.keypath, i, s)
                  , u = p({}, r)
                  , _ = b(e.tag) || h(e.tag) ? e.tag : Ln();
                return t.h(_, u, c)
            }
        }
    })
      , On = hn;
    function In(e, n, a, r) {
        const {slots: o, attrs: l} = n;
        return () => {
            const n = {
                part: !0
            };
            let s = {};
            e.locale && (n.locale = e.locale),
            b(e.format) ? n.key = e.format : h(e.format) && (b(e.format.key) && (n.key = e.format.key),
            s = Object.keys(e.format).reduce(( (t, n) => a.includes(n) ? p({}, t, {
                [n]: e.format[n]
            }) : t), {}));
            const i = r(e.value, n, s);
            let c = [n.key];
            T(i) ? c = i.map(( (e, t) => {
                const n = o[e.type]
                  , a = n ? n({
                    [e.type]: e.value,
                    index: t,
                    parts: i
                }) : [e.value];
                var r;
                return T(r = a) && !b(r[0]) && (a[0].key = `${e.type}-${t}`),
                a
            }
            )) : b(i) && (c = [i]);
            const u = p({}, l)
              , _ = b(e.tag) || h(e.tag) ? e.tag : Ln();
            return t.h(_, u, c)
        }
    }
    const kn = t.defineComponent({
        name: "i18n-n",
        props: p({
            value: {
                type: Number,
                required: !0
            },
            format: {
                type: [String, Object]
            }
        }, bn),
        setup(e, t) {
            const n = e.i18n || ra({
                useScope: e.scope,
                __useComponent: !0
            });
            return In(e, t, $t, ( (...e) => n[tn](...e)))
        }
    })
      , yn = kn
      , An = t.defineComponent({
        name: "i18n-d",
        props: p({
            value: {
                type: [Number, Date],
                required: !0
            },
            format: {
                type: [String, Object]
            }
        }, bn),
        setup(e, t) {
            const n = e.i18n || ra({
                useScope: e.scope,
                __useComponent: !0
            });
            return In(e, t, Mt, ( (...e) => n[en](...e)))
        }
    })
      , Pn = An;
    function Cn(e) {
        const a = t => {
            const {instance: n, modifiers: a, value: r} = t;
            if (!n || !n.$)
                throw Jt(zt.UNEXPECTED_ERROR);
            const o = function(e, t) {
                const n = e;
                if ("composition" === e.mode)
                    return n.__getInstance(t) || e.global;
                {
                    const a = n.__getInstance(t);
                    return null != a ? a.__composer : e.global.__composer
                }
            }(e, n.$);
            a.preserve && R(jt(Yt.NOT_SUPPORTED_PRESERVE));
            const l = Rn(r);
            return [Reflect.apply(o.t, o, [...Sn(l)]), o]
        }
        ;
        return {
            created: (r, o) => {
                const [l,s] = a(o);
                n && e.global === s && (r.__i18nWatcher = t.watch(s.locale, ( () => {
                    o.instance && o.instance.$forceUpdate()
                }
                ))),
                r.__composer = s,
                r.textContent = l
            }
            ,
            unmounted: e => {
                n && e.__i18nWatcher && (e.__i18nWatcher(),
                e.__i18nWatcher = void 0,
                delete e.__i18nWatcher),
                e.__composer && (e.__composer = void 0,
                delete e.__composer)
            }
            ,
            beforeUpdate: (e, {value: t}) => {
                if (e.__composer) {
                    const n = e.__composer
                      , a = Rn(t);
                    e.textContent = Reflect.apply(n.t, n, [...Sn(a)])
                }
            }
            ,
            getSSRProps: e => {
                const [t] = a(e);
                return {
                    textContent: t
                }
            }
        }
    }
    function Rn(e) {
        if (b(e))
            return {
                path: e
            };
        if (y(e)) {
            if (!("path"in e))
                throw Jt(zt.REQUIRED_VALUE, "path");
            return e
        }
        throw Jt(zt.INVALID_VALUE)
    }
    function Sn(e) {
        const {path: t, locale: n, args: a, choice: r, plural: o} = e
          , l = {}
          , s = a || {};
        return b(n) && (l.locale = n),
        u(r) && (l.plural = r),
        u(o) && (l.plural = o),
        [t, s, l]
    }
    var Dn = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
    function Fn() {
        return "undefined" != typeof navigator && "undefined" != typeof window ? window : void 0 !== Dn ? Dn : {}
    }
    const Mn = "function" == typeof Proxy
      , Un = "devtools-plugin:setup";
    let wn, xn;
    function $n() {
        return void 0 !== wn || ("undefined" != typeof window && window.performance ? (wn = !0,
        xn = window.performance) : void 0 !== Dn && (null === (e = Dn.perf_hooks) || void 0 === e ? void 0 : e.performance) ? (wn = !0,
        xn = Dn.perf_hooks.performance) : wn = !1),
        wn ? xn.now() : Date.now();
        var e
    }
    class Wn {
        constructor(e, t) {
            this.target = null,
            this.targetQueue = [],
            this.onQueue = [],
            this.plugin = e,
            this.hook = t;
            const n = {};
            if (e.settings)
                for (const t in e.settings) {
                    const a = e.settings[t];
                    n[t] = a.defaultValue
                }
            const a = `__vue-devtools-plugin-settings__${e.id}`;
            let r = Object.assign({}, n);
            try {
                const e = localStorage.getItem(a)
                  , t = JSON.parse(e);
                Object.assign(r, t)
            } catch (e) {}
            this.fallbacks = {
                getSettings: () => r,
                setSettings(e) {
                    try {
                        localStorage.setItem(a, JSON.stringify(e))
                    } catch (e) {}
                    r = e
                },
                now: () => $n()
            },
            t && t.on("plugin:settings:set", ( (e, t) => {
                e === this.plugin.id && this.fallbacks.setSettings(t)
            }
            )),
            this.proxiedOn = new Proxy({},{
                get: (e, t) => this.target ? this.target.on[t] : (...e) => {
                    this.onQueue.push({
                        method: t,
                        args: e
                    })
                }
            }),
            this.proxiedTarget = new Proxy({},{
                get: (e, t) => this.target ? this.target[t] : "on" === t ? this.proxiedOn : Object.keys(this.fallbacks).includes(t) ? (...e) => (this.targetQueue.push({
                    method: t,
                    args: e,
                    resolve: () => {}
                }),
                this.fallbacks[t](...e)) : (...e) => new Promise((n => {
                    this.targetQueue.push({
                        method: t,
                        args: e,
                        resolve: n
                    })
                }
                ))
            })
        }
        async setRealTarget(e) {
            this.target = e;
            for (const e of this.onQueue)
                this.target.on[e.method](...e.args);
            for (const e of this.targetQueue)
                e.resolve(await this.target[e.method](...e.args))
        }
    }
    function Vn(e, t) {
        const n = e
          , a = Fn()
          , r = Fn().__VUE_DEVTOOLS_GLOBAL_HOOK__
          , o = Mn && n.enableEarlyProxy;
        if (!r || !a.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ && o) {
            const e = o ? new Wn(n,r) : null;
            (a.__VUE_DEVTOOLS_PLUGINS__ = a.__VUE_DEVTOOLS_PLUGINS__ || []).push({
                pluginDescriptor: n,
                setupFn: t,
                proxy: e
            }),
            e && t(e.proxiedTarget)
        } else
            r.emit(Un, e, t)
    }
    const Hn = {
        "vue-devtools-plugin-vue-i18n": "Vue I18n devtools",
        "vue-i18n-resource-inspector": "I18n Resources",
        "vue-i18n-timeline": "Vue I18n"
    }
      , Gn = {
        "vue-i18n-resource-inspector": "Search for scopes ..."
    }
      , Xn = {
        "vue-i18n-timeline": 16764185
    }
      , Yn = "vue-i18n: composer properties";
    let Bn;
    async function jn(e, t) {
        return new Promise(( (n, a) => {
            try {
                Vn({
                    id: "vue-devtools-plugin-vue-i18n",
                    label: Hn["vue-devtools-plugin-vue-i18n"],
                    packageName: "vue-i18n",
                    homepage: "https://vue-i18n.intlify.dev",
                    logo: "https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png",
                    componentStateTypes: [Yn],
                    app: e
                }, (a => {
                    Bn = a,
                    a.on.visitComponentTree(( ({componentInstance: e, treeNode: n}) => {
                        !function(e, t, n) {
                            const a = "composition" === n.mode ? n.global : n.global.__composer;
                            if (e && e.vnode.el && e.vnode.el.__VUE_I18N__ && e.vnode.el.__VUE_I18N__ !== a) {
                                const n = {
                                    label: `i18n (${Kn(e)} Scope)`,
                                    textColor: 0,
                                    backgroundColor: 16764185
                                };
                                t.tags.push(n)
                            }
                        }(e, n, t)
                    }
                    )),
                    a.on.inspectComponent(( ({componentInstance: e, instanceData: n}) => {
                        e.vnode.el && e.vnode.el.__VUE_I18N__ && n && ("legacy" === t.mode ? e.vnode.el.__VUE_I18N__ !== t.global.__composer && Qn(n, e.vnode.el.__VUE_I18N__) : Qn(n, e.vnode.el.__VUE_I18N__))
                    }
                    )),
                    a.addInspector({
                        id: "vue-i18n-resource-inspector",
                        label: Hn["vue-i18n-resource-inspector"],
                        icon: "language",
                        treeFilterPlaceholder: Gn["vue-i18n-resource-inspector"]
                    }),
                    a.on.getInspectorTree((n => {
                        n.app === e && "vue-i18n-resource-inspector" === n.inspectorId && function(e, t) {
                            e.rootNodes.push({
                                id: "global",
                                label: "Global Scope"
                            });
                            const n = "composition" === t.mode ? t.global : t.global.__composer;
                            for (const [a,r] of t.__instances) {
                                const o = "composition" === t.mode ? r : r.__composer;
                                n !== o && e.rootNodes.push({
                                    id: o.id.toString(),
                                    label: `${Kn(a)} Scope`
                                })
                            }
                        }(n, t)
                    }
                    ));
                    const r = new Map;
                    a.on.getInspectorState((async n => {
                        if (n.app === e && "vue-i18n-resource-inspector" === n.inspectorId)
                            if (a.unhighlightElement(),
                            function(e, t) {
                                const n = ea(e.nodeId, t);
                                n && (e.state = function(e) {
                                    const t = {}
                                      , n = "Locale related info"
                                      , a = [{
                                        type: n,
                                        key: "locale",
                                        editable: !0,
                                        value: e.locale.value
                                    }, {
                                        type: n,
                                        key: "fallbackLocale",
                                        editable: !0,
                                        value: e.fallbackLocale.value
                                    }, {
                                        type: n,
                                        key: "availableLocales",
                                        editable: !1,
                                        value: e.availableLocales
                                    }, {
                                        type: n,
                                        key: "inheritLocale",
                                        editable: !0,
                                        value: e.inheritLocale
                                    }];
                                    t[n] = a;
                                    const r = "Locale messages info"
                                      , o = [{
                                        type: r,
                                        key: "messages",
                                        editable: !1,
                                        value: zn(e.messages.value)
                                    }];
                                    t[r] = o;
                                    {
                                        const n = "Datetime formats info"
                                          , a = [{
                                            type: n,
                                            key: "datetimeFormats",
                                            editable: !1,
                                            value: e.datetimeFormats.value
                                        }];
                                        t[n] = a;
                                        const r = "Datetime formats info"
                                          , o = [{
                                            type: r,
                                            key: "numberFormats",
                                            editable: !1,
                                            value: e.numberFormats.value
                                        }];
                                        t[r] = o
                                    }
                                    return t
                                }(n))
                            }(n, t),
                            "global" === n.nodeId) {
                                if (!r.has(n.app)) {
                                    const [e] = await a.getComponentInstances(n.app);
                                    r.set(n.app, e)
                                }
                                a.highlightElement(r.get(n.app))
                            } else {
                                const e = function(e, t) {
                                    let n = null;
                                    if ("global" !== e)
                                        for (const [a,r] of t.__instances.entries())
                                            if (r.id.toString() === e) {
                                                n = a;
                                                break
                                            }
                                    return n
                                }(n.nodeId, t);
                                e && a.highlightElement(e)
                            }
                    }
                    )),
                    a.on.editInspectorState((n => {
                        n.app === e && "vue-i18n-resource-inspector" === n.inspectorId && function(e, t) {
                            const n = ea(e.nodeId, t);
                            if (n) {
                                const [t] = e.path;
                                "locale" === t && b(e.state.value) ? n.locale.value = e.state.value : "fallbackLocale" === t && (b(e.state.value) || T(e.state.value) || h(e.state.value)) ? n.fallbackLocale.value = e.state.value : "inheritLocale" === t && L(e.state.value) && (n.inheritLocale = e.state.value)
                            }
                        }(n, t)
                    }
                    )),
                    a.addTimelineLayer({
                        id: "vue-i18n-timeline",
                        label: Hn["vue-i18n-timeline"],
                        color: Xn["vue-i18n-timeline"]
                    }),
                    n(!0)
                }
                ))
            } catch (e) {
                console.error(e),
                a(!1)
            }
        }
        ))
    }
    function Kn(e) {
        return e.type.name || e.type.displayName || e.type.__file || "Anonymous"
    }
    function Qn(e, t) {
        const n = Yn;
        e.state.push({
            type: n,
            key: "locale",
            editable: !0,
            value: t.locale.value
        }),
        e.state.push({
            type: n,
            key: "availableLocales",
            editable: !1,
            value: t.availableLocales
        }),
        e.state.push({
            type: n,
            key: "fallbackLocale",
            editable: !0,
            value: t.fallbackLocale.value
        }),
        e.state.push({
            type: n,
            key: "inheritLocale",
            editable: !0,
            value: t.inheritLocale
        }),
        e.state.push({
            type: n,
            key: "messages",
            editable: !1,
            value: zn(t.messages.value)
        }),
        e.state.push({
            type: n,
            key: "datetimeFormats",
            editable: !1,
            value: t.datetimeFormats.value
        }),
        e.state.push({
            type: n,
            key: "numberFormats",
            editable: !1,
            value: t.numberFormats.value
        })
    }
    function zn(e) {
        const t = {};
        return Object.keys(e).forEach((n => {
            const a = e[n];
            var r;
            N(a) && "source"in a ? t[n] = {
                _custom: {
                    type: "function",
                    display: "<span>ƒ</span> " + ((r = a).source ? `("${qn(r.source)}")` : "(?)")
                }
            } : It(a) && a.loc && a.loc.source ? t[n] = a.loc.source : h(a) ? t[n] = zn(a) : t[n] = a
        }
        )),
        t
    }
    const Jn = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "&": "&amp;"
    };
    function qn(e) {
        return e.replace(/[<>"&]/g, Zn)
    }
    function Zn(e) {
        return Jn[e] || e
    }
    function ea(e, t) {
        if ("global" === e)
            return "composition" === t.mode ? t.global : t.global.__composer;
        {
            const n = Array.from(t.__instances.values()).find((t => t.id.toString() === e));
            return n ? "composition" === t.mode ? n : n.__composer : null
        }
    }
    function ta(e, t) {
        if (Bn) {
            let n;
            t && "groupId"in t && (n = t.groupId,
            delete t.groupId),
            Bn.addTimelineEvent({
                layerId: "vue-i18n-timeline",
                event: {
                    title: e,
                    groupId: n,
                    time: Date.now(),
                    meta: {},
                    data: t || {},
                    logType: "compile-error" === e ? "error" : "fallback" === e || "missing" === e ? "warning" : "default"
                }
            })
        }
    }
    function na(e, t) {
        e.locale = t.locale || e.locale,
        e.fallbackLocale = t.fallbackLocale || e.fallbackLocale,
        e.missing = t.missing || e.missing,
        e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn,
        e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn,
        e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages,
        e.postTranslation = t.postTranslation || e.postTranslation,
        e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage,
        e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml,
        e.sync = t.sync || e.sync,
        e.__composer[rn](t.pluralizationRules || e.pluralizationRules);
        const n = cn(e.locale, {
            messages: t.messages,
            __i18n: t.__i18n
        });
        return Object.keys(n).forEach((t => e.mergeLocaleMessage(t, n[t]))),
        t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((n => e.mergeDateTimeFormat(n, t.datetimeFormats[n]))),
        t.numberFormats && Object.keys(t.numberFormats).forEach((n => e.mergeNumberFormat(n, t.numberFormats[n]))),
        e
    }
    const aa = s("global-vue-i18n");
    function ra(e={}) {
        const n = t.getCurrentInstance();
        if (null == n)
            throw Jt(zt.MUST_BE_CALL_SETUP_TOP);
        if (!n.isCE && null != n.appContext.app && !n.appContext.app.__VUE_I18N_SYMBOL__)
            throw Jt(zt.NOT_INSTALLED);
        const a = function(e) {
            {
                const n = t.inject(e.isCE ? aa : e.appContext.app.__VUE_I18N_SYMBOL__);
                if (!n)
                    throw Jt(e.isCE ? zt.NOT_INSTALLED_WITH_PROVIDE : zt.UNEXPECTED_ERROR);
                return n
            }
        }(n)
          , r = function(e) {
            return "composition" === e.mode ? e.global : e.global.__composer
        }(a)
          , o = un(n)
          , l = function(e, t) {
            return f(e) ? "__i18n"in t ? "local" : "global" : e.useScope ? e.useScope : "local"
        }(e, o);
        if ("legacy" === a.mode && !e.__useComponent) {
            if (!a.allowComposition)
                throw Jt(zt.NOT_AVAILABLE_IN_LEGACY_MODE);
            return function(e, n, a, r={}) {
                const o = "local" === n
                  , l = t.shallowRef(null);
                if (o && e.proxy && !e.proxy.$options.i18n && !e.proxy.$options.__i18n)
                    throw Jt(zt.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
                const s = L(r.inheritLocale) ? r.inheritLocale : !b(r.locale)
                  , i = t.ref(!o || s ? a.locale.value : b(r.locale) ? r.locale : qe)
                  , c = t.ref(!o || s ? a.fallbackLocale.value : b(r.fallbackLocale) || T(r.fallbackLocale) || y(r.fallbackLocale) || !1 === r.fallbackLocale ? r.fallbackLocale : i.value)
                  , u = t.ref(cn(i.value, r))
                  , _ = t.ref(y(r.datetimeFormats) ? r.datetimeFormats : {
                    [i.value]: {}
                })
                  , f = t.ref(y(r.numberFormats) ? r.numberFormats : {
                    [i.value]: {}
                })
                  , p = o ? a.missingWarn : !L(r.missingWarn) && !m(r.missingWarn) || r.missingWarn
                  , d = o ? a.fallbackWarn : !L(r.fallbackWarn) && !m(r.fallbackWarn) || r.fallbackWarn
                  , E = o ? a.fallbackRoot : !L(r.fallbackRoot) || r.fallbackRoot
                  , g = !!r.fallbackFormat
                  , v = N(r.missing) ? r.missing : null
                  , h = N(r.postTranslation) ? r.postTranslation : null
                  , O = o ? a.warnHtmlMessage : !L(r.warnHtmlMessage) || r.warnHtmlMessage
                  , I = !!r.escapeParameter
                  , k = o ? a.modifiers : y(r.modifiers) ? r.modifiers : {}
                  , A = r.pluralRules || o && a.pluralRules;
                function P() {
                    return [i.value, c.value, u.value, _.value, f.value]
                }
                const C = t.computed({
                    get: () => l.value ? l.value.locale.value : i.value,
                    set: e => {
                        l.value && (l.value.locale.value = e),
                        i.value = e
                    }
                })
                  , R = t.computed({
                    get: () => l.value ? l.value.fallbackLocale.value : c.value,
                    set: e => {
                        l.value && (l.value.fallbackLocale.value = e),
                        c.value = e
                    }
                })
                  , S = t.computed(( () => l.value ? l.value.messages.value : u.value))
                  , D = t.computed(( () => _.value))
                  , F = t.computed(( () => f.value));
                function M() {
                    return l.value ? l.value.getPostTranslationHandler() : h
                }
                function U(e) {
                    l.value && l.value.setPostTranslationHandler(e)
                }
                function w() {
                    return l.value ? l.value.getMissingHandler() : v
                }
                function x(e) {
                    l.value && l.value.setMissingHandler(e)
                }
                function $(e) {
                    return P(),
                    e()
                }
                function W(...e) {
                    return l.value ? $(( () => Reflect.apply(l.value.t, null, [...e]))) : $(( () => ""))
                }
                function V(...e) {
                    return l.value ? Reflect.apply(l.value.rt, null, [...e]) : ""
                }
                function H(...e) {
                    return l.value ? $(( () => Reflect.apply(l.value.d, null, [...e]))) : $(( () => ""))
                }
                function G(...e) {
                    return l.value ? $(( () => Reflect.apply(l.value.n, null, [...e]))) : $(( () => ""))
                }
                function X(e) {
                    return l.value ? l.value.tm(e) : {}
                }
                function Y(e, t) {
                    return !!l.value && l.value.te(e, t)
                }
                function B(e) {
                    return l.value ? l.value.getLocaleMessage(e) : {}
                }
                function j(e, t) {
                    l.value && (l.value.setLocaleMessage(e, t),
                    u.value[e] = t)
                }
                function K(e, t) {
                    l.value && l.value.mergeLocaleMessage(e, t)
                }
                function Q(e) {
                    return l.value ? l.value.getDateTimeFormat(e) : {}
                }
                function z(e, t) {
                    l.value && (l.value.setDateTimeFormat(e, t),
                    _.value[e] = t)
                }
                function J(e, t) {
                    l.value && l.value.mergeDateTimeFormat(e, t)
                }
                function q(e) {
                    return l.value ? l.value.getNumberFormat(e) : {}
                }
                function Z(e, t) {
                    l.value && (l.value.setNumberFormat(e, t),
                    f.value[e] = t)
                }
                function ee(e, t) {
                    l.value && l.value.mergeNumberFormat(e, t)
                }
                const te = {
                    get id() {
                        return l.value ? l.value.id : -1
                    },
                    locale: C,
                    fallbackLocale: R,
                    messages: S,
                    datetimeFormats: D,
                    numberFormats: F,
                    get inheritLocale() {
                        return l.value ? l.value.inheritLocale : s
                    },
                    set inheritLocale(e) {
                        l.value && (l.value.inheritLocale = e)
                    },
                    get availableLocales() {
                        return l.value ? l.value.availableLocales : Object.keys(u.value)
                    },
                    get modifiers() {
                        return l.value ? l.value.modifiers : k
                    },
                    get pluralRules() {
                        return l.value ? l.value.pluralRules : A
                    },
                    get isGlobal() {
                        return !!l.value && l.value.isGlobal
                    },
                    get missingWarn() {
                        return l.value ? l.value.missingWarn : p
                    },
                    set missingWarn(e) {
                        l.value && (l.value.missingWarn = e)
                    },
                    get fallbackWarn() {
                        return l.value ? l.value.fallbackWarn : d
                    },
                    set fallbackWarn(e) {
                        l.value && (l.value.missingWarn = e)
                    },
                    get fallbackRoot() {
                        return l.value ? l.value.fallbackRoot : E
                    },
                    set fallbackRoot(e) {
                        l.value && (l.value.fallbackRoot = e)
                    },
                    get fallbackFormat() {
                        return l.value ? l.value.fallbackFormat : g
                    },
                    set fallbackFormat(e) {
                        l.value && (l.value.fallbackFormat = e)
                    },
                    get warnHtmlMessage() {
                        return l.value ? l.value.warnHtmlMessage : O
                    },
                    set warnHtmlMessage(e) {
                        l.value && (l.value.warnHtmlMessage = e)
                    },
                    get escapeParameter() {
                        return l.value ? l.value.escapeParameter : I
                    },
                    set escapeParameter(e) {
                        l.value && (l.value.escapeParameter = e)
                    },
                    t: W,
                    getPostTranslationHandler: M,
                    setPostTranslationHandler: U,
                    getMissingHandler: w,
                    setMissingHandler: x,
                    rt: V,
                    d: H,
                    n: G,
                    tm: X,
                    te: Y,
                    getLocaleMessage: B,
                    setLocaleMessage: j,
                    mergeLocaleMessage: K,
                    getDateTimeFormat: Q,
                    setDateTimeFormat: z,
                    mergeDateTimeFormat: J,
                    getNumberFormat: q,
                    setNumberFormat: Z,
                    mergeNumberFormat: ee
                };
                function ne(e) {
                    e.locale.value = i.value,
                    e.fallbackLocale.value = c.value,
                    Object.keys(u.value).forEach((t => {
                        e.mergeLocaleMessage(t, u.value[t])
                    }
                    )),
                    Object.keys(_.value).forEach((t => {
                        e.mergeDateTimeFormat(t, _.value[t])
                    }
                    )),
                    Object.keys(f.value).forEach((t => {
                        e.mergeNumberFormat(t, f.value[t])
                    }
                    )),
                    e.escapeParameter = I,
                    e.fallbackFormat = g,
                    e.fallbackRoot = E,
                    e.fallbackWarn = d,
                    e.missingWarn = p,
                    e.warnHtmlMessage = O
                }
                return t.onBeforeMount(( () => {
                    if (null == e.proxy || null == e.proxy.$i18n)
                        throw Jt(zt.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
                    const t = l.value = e.proxy.$i18n.__composer;
                    "global" === n ? (i.value = t.locale.value,
                    c.value = t.fallbackLocale.value,
                    u.value = t.messages.value,
                    _.value = t.datetimeFormats.value,
                    f.value = t.numberFormats.value) : o && ne(t)
                }
                )),
                te
            }(n, l, r, e)
        }
        if ("global" === l)
            return _n(r, e, o),
            r;
        if ("parent" === l) {
            let t = function(e, t, n=!1) {
                let a = null;
                const r = t.root;
                let o = function(e, t=!1) {
                    if (null == e)
                        return null;
                    return t && e.vnode.ctx || e.parent
                }(t, n);
                for (; null != o; ) {
                    const t = e;
                    if ("composition" === e.mode)
                        a = t.__getInstance(o);
                    else {
                        const e = t.__getInstance(o);
                        null != e && (a = e.__composer,
                        n && a && !a[on] && (a = null))
                    }
                    if (null != a)
                        break;
                    if (r === o)
                        break;
                    o = o.parent
                }
                return a
            }(a, n, e.__useComponent);
            return null == t && (R(jt(Yt.NOT_FOUND_PARENT_SCOPE)),
            t = r),
            t
        }
        const s = a;
        let i = s.__getInstance(n);
        if (null == i) {
            const a = p({}, e);
            "__i18n"in o && (a.__i18n = o.__i18n),
            r && (a.__root = r),
            i = Tn(a),
            s.__composerExtend && (i[ln] = s.__composerExtend(i)),
            function(e, n, a) {
                let r = null;
                t.onMounted(( () => {
                    if (n.vnode.el) {
                        n.vnode.el.__VUE_I18N__ = a,
                        r = D();
                        const e = a;
                        e[nn] && e[nn](r),
                        r.on("*", ta)
                    }
                }
                ), n),
                t.onUnmounted(( () => {
                    const t = a;
                    n.vnode.el && n.vnode.el.__VUE_I18N__ && (r && r.off("*", ta),
                    t[an] && t[an](),
                    delete n.vnode.el.__VUE_I18N__),
                    e.__deleteInstance(n);
                    const o = t[ln];
                    o && (o(),
                    delete t[ln])
                }
                ), n)
            }(s, n, i),
            s.__setInstance(n, i)
        }
        return i
    }
    const oa = ["locale", "fallbackLocale", "availableLocales"]
      , la = ["t", "rt", "d", "n", "tm", "te"];
    var sa;
    tt = function(e, t) {
        if (t.onWarn = Ot,
        b(e)) {
            const n = !L(t.warnHtmlMessage) || t.warnHtmlMessage;
            !function(e, t) {
                t && X(e) && R(l(bt, {
                    source: e
                }))
            }(e, n);
            const a = (t.onCacheKey || Lt)(e)
              , r = ht[a];
            if (r)
                return r;
            const {ast: o, detectError: s} = function(e, t={}) {
                let n = !1;
                const a = t.onError || H;
                return t.onError = e => {
                    n = !0,
                    a(e)
                }
                ,
                {
                    ...de(e, t),
                    detectError: n
                }
            }(e, {
                ...t,
                location: !0,
                jit: !0
            })
              , i = vt(o);
            return s ? i : ht[a] = i
        }
        {
            if (!It(e))
                return R(`the message that is resolve with key '${t.key}' is not supported for jit compilation`),
                () => e;
            const n = e.cacheKey;
            return n ? ht[n] || (ht[n] = vt(e)) : vt(e)
        }
    }
    ,
    nt = function(e, t) {
        if (!h(e))
            return null;
        let n = Ne.get(t);
        if (n || (n = function(e) {
            const t = [];
            let n, a, r, o, l, s, i, c = -1, u = 0, _ = 0;
            const m = [];
            function f() {
                const t = e[c + 1];
                if (5 === u && "'" === t || 6 === u && '"' === t)
                    return c++,
                    r = "\\" + t,
                    m[0](),
                    !0
            }
            for (m[0] = () => {
                void 0 === a ? a = r : a += r
            }
            ,
            m[1] = () => {
                void 0 !== a && (t.push(a),
                a = void 0)
            }
            ,
            m[2] = () => {
                m[0](),
                _++
            }
            ,
            m[3] = () => {
                if (_ > 0)
                    _--,
                    u = 4,
                    m[0]();
                else {
                    if (_ = 0,
                    void 0 === a)
                        return !1;
                    if (a = Te(a),
                    !1 === a)
                        return !1;
                    m[1]()
                }
            }
            ; null !== u; )
                if (c++,
                n = e[c],
                "\\" !== n || !f()) {
                    if (o = ve(n),
                    i = Ee[u],
                    l = i[o] || i.l || 8,
                    8 === l)
                        return;
                    if (u = l[0],
                    void 0 !== l[1] && (s = m[l[1]],
                    s && (r = n,
                    !1 === s())))
                        return;
                    if (7 === u)
                        return t
                }
        }(t),
        n && Ne.set(t, n)),
        !n)
            return null;
        const a = n.length;
        let r = e
          , o = 0;
        for (; o < a; ) {
            const e = r[n[o]];
            if (void 0 === e)
                return null;
            if (N(r))
                return null;
            r = e,
            o++
        }
        return r
    }
    ,
    at = Be;
    {
        const e = d || (d = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {});
        e.__INTLIFY__ = !0,
        sa = e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__,
        Pe = sa
    }
    return console.info("You are running a development build of vue-i18n.\nMake sure to use the production build (*.prod.js) when deploying for production."),
    e.DatetimeFormat = An,
    e.I18nD = Pn,
    e.I18nInjectionKey = aa,
    e.I18nN = yn,
    e.I18nT = On,
    e.NumberFormat = kn,
    e.Translation = hn,
    e.VERSION = Ht,
    e.castToVueI18n = e => {
        if (!("__VUE_I18N_BRIDGE__"in e))
            throw Jt(zt.NOT_COMPATIBLE_LEGACY_VUE_I18N);
        return e
    }
    ,
    e.createI18n = function(e={}, n) {
        const a = !L(e.legacy) || e.legacy
          , r = !L(e.globalInjection) || e.globalInjection
          , o = !a || !!e.allowComposition
          , l = new Map
          , [i,c] = function(e, n, a) {
            const r = t.effectScope();
            {
                const t = n ? r.run(( () => Nn(e))) : r.run(( () => Tn(e)));
                if (null == t)
                    throw Jt(zt.UNEXPECTED_ERROR);
                return [r, t]
            }
        }(e, a)
          , u = s("vue-i18n");
        a && o && R(jt(Yt.NOTICE_DROP_ALLOW_COMPOSITION));
        {
            const e = {
                get mode() {
                    return a ? "legacy" : "composition"
                },
                get allowComposition() {
                    return o
                },
                async install(n, ...o) {
                    if (n.__VUE_I18N__ = e,
                    n.__VUE_I18N_SYMBOL__ = u,
                    n.provide(n.__VUE_I18N_SYMBOL__, e),
                    y(o[0])) {
                        const t = o[0];
                        e.__composerExtend = t.__composerExtend,
                        e.__vueI18nExtend = t.__vueI18nExtend
                    }
                    let l = null;
                    !a && r && (l = function(e, n) {
                        const a = Object.create(null);
                        oa.forEach((e => {
                            const r = Object.getOwnPropertyDescriptor(n, e);
                            if (!r)
                                throw Jt(zt.UNEXPECTED_ERROR);
                            const o = t.isRef(r.value) ? {
                                get: () => r.value.value,
                                set(e) {
                                    r.value.value = e
                                }
                            } : {
                                get: () => r.get && r.get()
                            };
                            Object.defineProperty(a, e, o)
                        }
                        )),
                        e.config.globalProperties.$i18n = a,
                        la.forEach((t => {
                            const a = Object.getOwnPropertyDescriptor(n, t);
                            if (!a || !a.value)
                                throw Jt(zt.UNEXPECTED_ERROR);
                            Object.defineProperty(e.config.globalProperties, `$${t}`, a)
                        }
                        ));
                        const r = () => {
                            delete e.config.globalProperties.$i18n,
                            la.forEach((t => {
                                delete e.config.globalProperties[`$${t}`]
                            }
                            ))
                        }
                        ;
                        return r
                    }(n, e.global)),
                    function(e, t, ...n) {
                        const a = y(n[0]) ? n[0] : {}
                          , r = !!a.useI18nComponentName
                          , o = !L(a.globalInstall) || a.globalInstall;
                        o && r && R(jt(Yt.COMPONENT_NAME_LEGACY_COMPATIBLE, {
                            name: hn.name
                        })),
                        o && ([r ? "i18n" : hn.name, "I18nT"].forEach((t => e.component(t, hn))),
                        [kn.name, "I18nN"].forEach((t => e.component(t, kn))),
                        [An.name, "I18nD"].forEach((t => e.component(t, An)))),
                        e.directive("t", Cn(t))
                    }(n, e, ...o),
                    a && n.mixin(function(e, n, a) {
                        return {
                            beforeCreate() {
                                const r = t.getCurrentInstance();
                                if (!r)
                                    throw Jt(zt.UNEXPECTED_ERROR);
                                const o = this.$options;
                                if (o.i18n) {
                                    const t = o.i18n;
                                    if (o.__i18n && (t.__i18n = o.__i18n),
                                    t.__root = n,
                                    this === this.$root)
                                        this.$i18n = na(e, t);
                                    else {
                                        t.__injectWithOption = !0,
                                        t.__extender = a.__vueI18nExtend,
                                        this.$i18n = Nn(t);
                                        const e = this.$i18n;
                                        e.__extender && (e.__disposer = e.__extender(this.$i18n))
                                    }
                                } else if (o.__i18n)
                                    if (this === this.$root)
                                        this.$i18n = na(e, o);
                                    else {
                                        this.$i18n = Nn({
                                            __i18n: o.__i18n,
                                            __injectWithOption: !0,
                                            __extender: a.__vueI18nExtend,
                                            __root: n
                                        });
                                        const e = this.$i18n;
                                        e.__extender && (e.__disposer = e.__extender(this.$i18n))
                                    }
                                else
                                    this.$i18n = e;
                                o.__i18nGlobal && _n(n, o, o),
                                this.$t = (...e) => this.$i18n.t(...e),
                                this.$rt = (...e) => this.$i18n.rt(...e),
                                this.$tc = (...e) => this.$i18n.tc(...e),
                                this.$te = (e, t) => this.$i18n.te(e, t),
                                this.$d = (...e) => this.$i18n.d(...e),
                                this.$n = (...e) => this.$i18n.n(...e),
                                this.$tm = e => this.$i18n.tm(e),
                                a.__setInstance(r, this.$i18n)
                            },
                            mounted() {
                                if (this.$el && this.$i18n) {
                                    const e = this.$i18n;
                                    this.$el.__VUE_I18N__ = e.__composer;
                                    const t = this.__v_emitter = D();
                                    e.__enableEmitter && e.__enableEmitter(t),
                                    t.on("*", ta)
                                }
                            },
                            unmounted() {
                                const e = t.getCurrentInstance();
                                if (!e)
                                    throw Jt(zt.UNEXPECTED_ERROR);
                                const n = this.$i18n;
                                this.$el && this.$el.__VUE_I18N__ && (this.__v_emitter && (this.__v_emitter.off("*", ta),
                                delete this.__v_emitter),
                                this.$i18n && (n.__disableEmitter && n.__disableEmitter(),
                                delete this.$el.__VUE_I18N__)),
                                delete this.$t,
                                delete this.$rt,
                                delete this.$tc,
                                delete this.$te,
                                delete this.$d,
                                delete this.$n,
                                delete this.$tm,
                                n.__disposer && (n.__disposer(),
                                delete n.__disposer,
                                delete n.__extender),
                                a.__deleteInstance(e),
                                delete this.$i18n
                            }
                        }
                    }(c, c.__composer, e));
                    const s = n.unmount;
                    n.unmount = () => {
                        l && l(),
                        e.dispose(),
                        s()
                    }
                    ;
                    {
                        if (!await jn(n, e))
                            throw Jt(zt.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN);
                        const t = D();
                        if (a) {
                            const e = c;
                            e.__enableEmitter && e.__enableEmitter(t)
                        } else {
                            const e = c;
                            e[nn] && e[nn](t)
                        }
                        t.on("*", ta)
                    }
                },
                get global() {
                    return c
                },
                dispose() {
                    i.stop()
                },
                __instances: l,
                __getInstance: function(e) {
                    return l.get(e) || null
                },
                __setInstance: function(e, t) {
                    l.set(e, t)
                },
                __deleteInstance: function(e) {
                    l.delete(e)
                }
            };
            return e
        }
    }
    ,
    e.useI18n = ra,
    e.vTDirective = Cn,
    e
}({}, Vue);
//# sourceMappingURL=/sm/92a27409e7db8b21791d7ef863e2079e35c4f026721358cf8f5986b111d1dfe7.map
