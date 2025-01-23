//# sourceMappingURL=acorn_interpreter.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
}
  , mod$$inline_58 = function(a) {
    function b(e) {
        v = e || {};
        for (var g in Cb)
            Object.prototype.hasOwnProperty.call(v, g) || (v[g] = Cb[g]);
        bb = v.sourceFile || null
    }
    function c(e, g) {
        var k = sc(r, e);
        g += " (" + k.line + ":" + k.column + ")";
        g = new SyntaxError(g);
        g.pos = e;
        g.loc = k;
        g.raisedAt = l;
        throw g;
    }
    function d(e) {
        function g(D) {
            if (1 == D.length)
                return k += "return str === " + JSON.stringify(D[0]) + ";";
            k += "switch(str){";
            for (var R = 0; R < D.length; ++R)
                k += "case " + JSON.stringify(D[R]) + ":";
            k += "return true}return false;"
        }
        e = e.split(" ");
        var k = ""
          , m = []
          , t = 0;
        a: for (; t < e.length; ++t) {
            for (var L = 0; L < m.length; ++L)
                if (m[L][0].length == e[t].length) {
                    m[L].push(e[t]);
                    continue a
                }
            m.push([e[t]])
        }
        if (3 < m.length) {
            m.sort(function(D, R) {
                return R.length - D.length
            });
            k += "switch(str.length){";
            for (t = 0; t < m.length; ++t)
                e = m[t],
                k += "case " + e[0].length + ":",
                g(e);
            k += "}"
        } else
            g(e);
        return new Function("str",k)
    }
    function f() {
        this.line = W;
        this.column = l - S
    }
    function h(e, g) {
        qa = l;
        v.locations && (Ga = new f);
        w = e;
        q();
        X = g;
        ja = e.beforeExpr
    }
    function n() {
        for (var e = l, g = v.onComment && v.locations && new f, k = r.charCodeAt(l += 2); l < ka && 10 !== k && 13 !== k && 8232 !== k && 8233 !== k; )
            ++l,
            k = r.charCodeAt(l);
        if (v.onComment)
            v.onComment(!1, r.slice(e + 2, l), e, l, g, v.locations && new f)
    }
    function q() {
        for (; l < ka; ) {
            var e = r.charCodeAt(l);
            if (32 === e)
                ++l;
            else if (13 === e)
                ++l,
                e = r.charCodeAt(l),
                10 === e && ++l,
                v.locations && (++W,
                S = l);
            else if (10 === e || 8232 === e || 8233 === e)
                ++l,
                v.locations && (++W,
                S = l);
            else if (8 < e && 14 > e)
                ++l;
            else if (47 === e)
                if (e = r.charCodeAt(l + 1),
                42 === e) {
                    e = v.onComment && v.locations && new f;
                    var g = l
                      , k = r.indexOf("*/", l += 2);
                    -1 === k && c(l - 2, "Unterminated comment");
                    l = k + 2;
                    if (v.locations) {
                        ta.lastIndex = g;
                        for (var m = void 0; (m = ta.exec(r)) && m.index < l; )
                            ++W,
                            S = m.index + m[0].length
                    }
                    if (v.onComment)
                        v.onComment(!0, r.slice(g + 2, k), g, l, e, v.locations && new f)
                } else if (47 === e)
                    n();
                else
                    break;
            else if (160 === e)
                ++l;
            else if (5760 <= e && tc.test(String.fromCharCode(e)))
                ++l;
            else
                break
        }
    }
    function z(e) {
        switch (e) {
        case 46:
            return e = r.charCodeAt(l + 1),
            48 <= e && 57 >= e ? e = Db(!0) : (++l,
            e = h(eb)),
            e;
        case 40:
            return ++l,
            h(Y);
        case 41:
            return ++l,
            h(U);
        case 59:
            return ++l,
            h(Z);
        case 44:
            return ++l,
            h(aa);
        case 91:
            return ++l,
            h(Qa);
        case 93:
            return ++l,
            h(Ra);
        case 123:
            return ++l,
            h(ua);
        case 125:
            return ++l,
            h(la);
        case 58:
            return ++l,
            h(va);
        case 63:
            return ++l,
            h(fb);
        case 48:
            if (e = r.charCodeAt(l + 1),
            120 === e || 88 === e)
                return l += 2,
                e = ma(16),
                null == e && c(K + 2, "Expected hexadecimal number"),
                Sa(r.charCodeAt(l)) && c(l, "Identifier directly after number"),
                h(wa, e);
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            return Db(!1);
        case 34:
        case 39:
            a: {
                l++;
                for (var g = ""; ; ) {
                    l >= ka && c(K, "Unterminated string constant");
                    var k = r.charCodeAt(l);
                    if (k === e) {
                        ++l;
                        e = h(ya, g);
                        break a
                    }
                    if (92 === k) {
                        k = r.charCodeAt(++l);
                        var m = /^[0-7]+/.exec(r.slice(l, l + 3));
                        for (m && (m = m[0]); m && 255 < parseInt(m, 8); )
                            m = m.slice(0, -1);
                        "0" === m && (m = null);
                        ++l;
                        if (m)
                            Q && c(l - 2, "Octal literal in strict mode"),
                            g += String.fromCharCode(parseInt(m, 8)),
                            l += m.length - 1;
                        else
                            switch (k) {
                            case 110:
                                g += "\n";
                                break;
                            case 114:
                                g += "\r";
                                break;
                            case 120:
                                g += String.fromCharCode(Ta(2));
                                break;
                            case 117:
                                g += String.fromCharCode(Ta(4));
                                break;
                            case 85:
                                g += String.fromCharCode(Ta(8));
                                break;
                            case 116:
                                g += "\t";
                                break;
                            case 98:
                                g += "\b";
                                break;
                            case 118:
                                g += "\x0B";
                                break;
                            case 102:
                                g += "\f";
                                break;
                            case 48:
                                g += "\x00";
                                break;
                            case 13:
                                10 === r.charCodeAt(l) && ++l;
                            case 10:
                                v.locations && (S = l,
                                ++W);
                                break;
                            default:
                                g += String.fromCharCode(k)
                            }
                    } else
                        13 !== k && 10 !== k && 8232 !== k && 8233 !== k || c(K, "Unterminated string constant"),
                        g += String.fromCharCode(k),
                        ++l
                }
            }
            return e;
        case 47:
            return e = r.charCodeAt(l + 1),
            ja ? (++l,
            e = ba()) : e = 61 === e ? C(na, 2) : C(gb, 1),
            e;
        case 37:
        case 42:
            return e = r.charCodeAt(l + 1),
            e = 61 === e ? C(na, 2) : C(Ac, 1),
            e;
        case 124:
        case 38:
            return g = r.charCodeAt(l + 1),
            e = g === e ? C(124 === e ? Nb : Ob, 2) : 61 === g ? C(na, 2) : C(124 === e ? Bc : Cc, 1),
            e;
        case 94:
            return e = r.charCodeAt(l + 1),
            e = 61 === e ? C(na, 2) : C(Dc, 1),
            e;
        case 43:
        case 45:
            return g = r.charCodeAt(l + 1),
            g === e ? 45 == g && 62 == r.charCodeAt(l + 2) && Ua.test(r.slice(ca, l)) ? (l += 3,
            n(),
            q(),
            e = G()) : e = C(Ec, 2) : e = 61 === g ? C(na, 2) : C(Fc, 1),
            e;
        case 60:
        case 62:
            return g = r.charCodeAt(l + 1),
            k = 1,
            g === e ? (k = 62 === e && 62 === r.charCodeAt(l + 2) ? 3 : 2,
            e = 61 === r.charCodeAt(l + k) ? C(na, k + 1) : C(Gc, k)) : 33 == g && 60 == e && 45 == r.charCodeAt(l + 2) && 45 == r.charCodeAt(l + 3) ? (l += 4,
            n(),
            q(),
            e = G()) : (61 === g && (k = 61 === r.charCodeAt(l + 2) ? 3 : 2),
            e = C(Hc, k)),
            e;
        case 61:
        case 33:
            return g = r.charCodeAt(l + 1),
            e = 61 === g ? C(Ic, 61 === r.charCodeAt(l + 2) ? 3 : 2) : C(61 === e ? hb : Pb, 1),
            e;
        case 126:
            return C(Pb, 1)
        }
        return !1
    }
    function G(e) {
        e ? l = K + 1 : K = l;
        v.locations && (Va = new f);
        if (e)
            return ba();
        if (l >= ka)
            return h(Wa);
        var g = r.charCodeAt(l);
        if (Sa(g) || 92 === g)
            return Qb();
        e = z(g);
        if (!1 === e) {
            g = String.fromCharCode(g);
            if ("\\" === g || Rb.test(g))
                return Qb();
            c(l, "Unexpected character '" + g + "'")
        }
        return e
    }
    function C(e, g) {
        var k = r.slice(l, l + g);
        l += g;
        h(e, k)
    }
    function ba() {
        for (var e, g, k = l; ; ) {
            l >= ka && c(k, "Unterminated regular expression");
            var m = r.charAt(l);
            Ua.test(m) && c(k, "Unterminated regular expression");
            if (e)
                e = !1;
            else {
                if ("[" === m)
                    g = !0;
                else if ("]" === m && g)
                    g = !1;
                else if ("/" === m && !g)
                    break;
                e = "\\" === m
            }
            ++l
        }
        e = r.slice(k, l);
        ++l;
        (g = Sb()) && !/^[gmsiy]*$/.test(g) && c(k, "Invalid regexp flag");
        return h(ib, new RegExp(e,g))
    }
    function ma(e, g) {
        for (var k = l, m = 0, t = 0, L = null == g ? Infinity : g; t < L; ++t) {
            var D = r.charCodeAt(l);
            D = 97 <= D ? D - 97 + 10 : 65 <= D ? D - 65 + 10 : 48 <= D && 57 >= D ? D - 48 : Infinity;
            if (D >= e)
                break;
            ++l;
            m = m * e + D
        }
        return l === k || null != g && l - k !== g ? null : m
    }
    function Db(e) {
        var g = l
          , k = !1
          , m = 48 === r.charCodeAt(l);
        e || null !== ma(10) || c(g, "Invalid number");
        46 === r.charCodeAt(l) && (++l,
        ma(10),
        k = !0);
        e = r.charCodeAt(l);
        if (69 === e || 101 === e)
            e = r.charCodeAt(++l),
            43 !== e && 45 !== e || ++l,
            null === ma(10) && c(g, "Invalid number"),
            k = !0;
        Sa(r.charCodeAt(l)) && c(l, "Identifier directly after number");
        e = r.slice(g, l);
        var t;
        k ? t = parseFloat(e) : m && 1 !== e.length ? /[89]/.test(e) || Q ? c(g, "Invalid number") : t = parseInt(e, 8) : t = parseInt(e, 10);
        return h(wa, t)
    }
    function Ta(e) {
        e = ma(16, e);
        null === e && c(K, "Bad character escape sequence");
        return e
    }
    function Sb() {
        xa = !1;
        for (var e, g = !0, k = l; ; ) {
            var m = r.charCodeAt(l);
            if (Tb(m))
                xa && (e += r.charAt(l)),
                ++l;
            else if (92 === m) {
                xa || (e = r.slice(k, l));
                xa = !0;
                117 != r.charCodeAt(++l) && c(l, "Expecting Unicode escape sequence \\uXXXX");
                ++l;
                m = Ta(4);
                var t = String.fromCharCode(m);
                t || c(l - 1, "Invalid Unicode escape");
                (g ? Sa(m) : Tb(m)) || c(l - 4, "Invalid Unicode escape");
                e += t
            } else
                break;
            g = !1
        }
        return xa ? e : r.slice(k, l)
    }
    function Qb() {
        var e = Sb()
          , g = oa;
        xa || (Jc(e) ? g = jb[e] : (v.forbidReserved && (3 === v.ecmaVersion ? Kc : Lc)(e) || Q && Ub(e)) && c(K, "The keyword '" + e + "' is reserved"));
        return h(g, e)
    }
    function B() {
        kb = K;
        ca = qa;
        lb = Ga;
        G()
    }
    function mb(e) {
        Q = e;
        l = ca;
        if (v.locations)
            for (; l < S; )
                S = r.lastIndexOf("\n", S - 2) + 1,
                --W;
        q();
        G()
    }
    function Vb() {
        this.type = null;
        this.start = K;
        this.end = null
    }
    function Wb() {
        this.start = Va;
        this.end = null;
        null !== bb && (this.source = bb)
    }
    function N() {
        var e = new Vb;
        v.locations && (e.loc = new Wb);
        v.directSourceFile && (e.sourceFile = v.directSourceFile);
        v.ranges && (e.range = [K, 0]);
        return e
    }
    function fa(e) {
        var g = new Vb;
        g.start = e.start;
        v.locations && (g.loc = new Wb,
        g.loc.start = e.loc.start);
        v.ranges && (g.range = [e.range[0], 0]);
        return g
    }
    function x(e, g) {
        e.type = g;
        e.end = ca;
        v.locations && (e.loc.end = lb);
        v.ranges && (e.range[1] = ca);
        return e
    }
    function nb(e) {
        return 5 <= v.ecmaVersion && "ExpressionStatement" === e.type && "Literal" === e.expression.type && "use strict" === e.expression.value
    }
    function F(e) {
        if (w === e)
            return B(),
            !0
    }
    function Xa() {
        return !v.strictSemicolons && (w === Wa || w === la || Ua.test(r.slice(ca, K)))
    }
    function pa() {
        F(Z) || Xa() || da()
    }
    function H(e) {
        w === e ? B() : da()
    }
    function da() {
        c(K, "Unexpected token")
    }
    function Ya(e) {
        "Identifier" !== e.type && "MemberExpression" !== e.type && c(e.start, "Assigning to rvalue");
        Q && "Identifier" === e.type && Za(e.name) && c(e.start, "Assigning to " + e.name + " in strict mode")
    }
    function V() {
        (w === gb || w === na && "/=" == X) && G(!0);
        var e = w
          , g = N();
        switch (e) {
        case ob:
        case Xb:
            B();
            var k = e === ob;
            F(Z) || Xa() ? g.label = null : w !== oa ? da() : (g.label = ea(),
            pa());
            for (var m = 0; m < I.length; ++m) {
                var t = I[m];
                if (null == g.label || t.name === g.label.name) {
                    if (null != t.kind && (k || "loop" === t.kind))
                        break;
                    if (g.label && k)
                        break
                }
            }
            m === I.length && c(g.start, "Unsyntactic " + e.keyword);
            return x(g, k ? "BreakStatement" : "ContinueStatement");
        case Yb:
            return B(),
            pa(),
            x(g, "DebuggerStatement");
        case Zb:
            return B(),
            I.push(pb),
            g.body = V(),
            I.pop(),
            H(qb),
            g.test = Ca(),
            pa(),
            x(g, "DoWhileStatement");
        case $b:
            B();
            I.push(pb);
            H(Y);
            if (w === Z)
                return rb(g, null);
            if (w === sb)
                return e = N(),
                B(),
                ac(e, !0),
                x(e, "VariableDeclaration"),
                1 === e.declarations.length && F($a) ? bc(g, e) : rb(g, e);
            e = O(!1, !0);
            return F($a) ? (Ya(e),
            bc(g, e)) : rb(g, e);
        case tb:
            return B(),
            ub(g, !0);
        case cc:
            return B(),
            g.test = Ca(),
            g.consequent = V(),
            g.alternate = F(dc) ? V() : null,
            x(g, "IfStatement");
        case ec:
            return Da || c(K, "'return' outside of function"),
            B(),
            F(Z) || Xa() ? g.argument = null : (g.argument = O(),
            pa()),
            x(g, "ReturnStatement");
        case vb:
            B();
            g.discriminant = Ca();
            g.cases = [];
            H(ua);
            for (I.push(Mc); w != la; )
                w === wb || w === fc ? (e = w === wb,
                m && x(m, "SwitchCase"),
                g.cases.push(m = N()),
                m.consequent = [],
                B(),
                e ? m.test = O() : (k && c(kb, "Multiple default clauses"),
                k = !0,
                m.test = null),
                H(va)) : (m || da(),
                m.consequent.push(V()));
            m && x(m, "SwitchCase");
            B();
            I.pop();
            return x(g, "SwitchStatement");
        case gc:
            return B(),
            Ua.test(r.slice(ca, K)) && c(ca, "Illegal newline after throw"),
            g.argument = O(),
            pa(),
            x(g, "ThrowStatement");
        case hc:
            return B(),
            g.block = Ea(),
            g.handler = null,
            w === ic && (e = N(),
            B(),
            H(Y),
            e.param = ea(),
            Q && Za(e.param.name) && c(e.param.start, "Binding " + e.param.name + " in strict mode"),
            H(U),
            e.guard = null, 
            e.body = Ea(),
            g.handler = x(e, "CatchClause")),
            g.guardedHandlers = jc,
            g.finalizer = F(kc) ? Ea() : null,
            g.handler || g.finalizer || c(g.start, "Missing catch or finally clause"),
            x(g, "TryStatement");
        case sb:
            return B(),
            ac(g),
            pa(),
            x(g, "VariableDeclaration");
        case qb:
            return B(),
            g.test = Ca(),
            I.push(pb),
            g.body = V(),
            I.pop(),
            x(g, "WhileStatement");
        case lc:
            return Q && c(K, "'with' in strict mode"),
            B(),
            g.object = Ca(),
            g.body = V(),
            x(g, "WithStatement");
        case ua:
            return Ea();
        case Z:
            return B(),
            x(g, "EmptyStatement");
        default:
            k = X;
            t = O();
            if (e === oa && "Identifier" === t.type && F(va)) {
                for (m = 0; m < I.length; ++m)
                    I[m].name === k && c(t.start, "Label '" + k + "' is already declared");
                e = w.isLoop ? "loop" : w === vb ? "switch" : null;
                I.push({
                    name: k,
                    kind: e
                });
                g.body = V();
                I.pop();
                g.label = t;
                return x(g, "LabeledStatement")
            }
            g.expression = t;
            pa();
            return x(g, "ExpressionStatement")
        }
    }
    function Ca() {
        H(Y);
        var e = O();
        H(U);
        return e
    }
    function Ea(e) {
        var g = N(), k = !0, m = !1, t;
        g.body = [];
        for (H(ua); !F(la); ) {
            var L = V();
            g.body.push(L);
            k && e && nb(L) && (t = m,
            mb(m = !0));
            k = !1
        }
        m && !t && mb(!1);
        return x(g, "BlockStatement")
    }
    function rb(e, g) {
        e.init = g;
        H(Z);
        e.test = w === Z ? null : O();
        H(Z);
        e.update = w === U ? null : O();
        H(U);
        e.body = V();
        I.pop();
        return x(e, "ForStatement")
    }
    function bc(e, g) {
        e.left = g;
        e.right = O();
        H(U);
        e.body = V();
        I.pop();
        return x(e, "ForInStatement")
    }
    function ac(e, g) {
        e.declarations = [];
        for (e.kind = "var"; ; ) {
            var k = N();
            k.id = ea();
            Q && Za(k.id.name) && c(k.id.start, "Binding " + k.id.name + " in strict mode");
            k.init = F(hb) ? O(!0, g) : null;
            e.declarations.push(x(k, "VariableDeclarator"));
            if (!F(aa))
                break
        }
        return e
    }
    function O(e, g) {
        var k = xb(g);
        if (!e && w === aa) {
            e = fa(k);
            for (e.expressions = [k]; F(aa); )
                e.expressions.push(xb(g));
            return x(e, "SequenceExpression")
        }
        return k
    }
    function xb(e) {
        var g = e;
        var k = g;
        k = yb(zb(), -1, k);
        if (F(fb)) {
            var m = fa(k);
            m.test = k;
            m.consequent = O(!0);
            H(va);
            m.alternate = O(!0, g);
            g = x(m, "ConditionalExpression")
        } else
            g = k;
        return w.isAssign ? (k = fa(g),
        k.operator = X,
        k.left = g,
        B(),
        k.right = xb(e),
        Ya(g),
        x(k, "AssignmentExpression")) : g
    }
    function yb(e, g, k) {
        var m = w.binop;
        if (null != m && (!k || w !== $a) && m > g) {
            var t = fa(e);
            t.left = e;
            t.operator = X;
            e = w;
            B();
            t.right = yb(zb(), m, k);
            m = x(t, e === Nb || e === Ob ? "LogicalExpression" : "BinaryExpression");
            return yb(m, g, k)
        }
        return e
    }
    function zb() {
        if (w.prefix) {
            var e = N()
              , g = w.isUpdate;
            e.operator = X;
            ja = e.prefix = !0;
            B();
            e.argument = zb();
            g ? Ya(e.argument) : Q && "delete" === e.operator && "Identifier" === e.argument.type && c(e.start, "Deleting local variable in strict mode");
            return x(e, g ? "UpdateExpression" : "UnaryExpression")
        }
        for (g = Fa(ab()); w.postfix && !Xa(); )
            e = fa(g),
            e.operator = X,
            e.prefix = !1,
            e.argument = g,
            Ya(g),
            B(),
            g = x(e, "UpdateExpression");
        return g
    }
    function Fa(e, g) {
        if (F(eb)) {
            var k = fa(e);
            k.object = e;
            k.property = ea(!0);
            k.computed = !1;
            return Fa(x(k, "MemberExpression"), g)
        }
        return F(Qa) ? (k = fa(e),
        k.object = e,
        k.property = O(),
        k.computed = !0,
        H(Ra),
        Fa(x(k, "MemberExpression"), g)) : !g && F(Y) ? (k = fa(e),
        k.callee = e,
        k.arguments = Ab(U, !1),
        Fa(x(k, "CallExpression"), g)) : e
    }
    function ab() {
        switch (w) {
        case mc:
            var e = N();
            B();
            return x(e, "ThisExpression");
        case oa:
            return ea();
        case wa:
        case ya:
        case ib:
            return e = N(),
            e.value = X,
            e.raw = r.slice(K, qa),
            B(),
            x(e, "Literal");
        case nc:
        case oc:
        case pc:
            return e = N(),
            e.value = w.atomValue,
            e.raw = w.keyword,
            B(),
            x(e, "Literal");
        case Y:
            e = Va;
            var g = K;
            B();
            var k = O();
            k.start = g;
            k.end = qa;
            v.locations && (k.loc.start = e,
            k.loc.end = Ga);
            v.ranges && (k.range = [g, qa]);
            H(U);
            return k;
        case Qa:
            return e = N(),
            B(),
            e.elements = Ab(Ra, !0, !0),
            x(e, "ArrayExpression");
        case ua:
            e = N();
            g = !0;
            k = !1;
            e.properties = [];
            for (B(); !F(la); ) {
                if (g)
                    g = !1;
                else if (H(aa),
                v.allowTrailingCommas && F(la))
                    break;
                var m = {
                    key: w === wa || w === ya ? ab() : ea(!0)
                }, t = !1, L;
                F(va) ? (m.value = O(!0),
                L = m.kind = "init") : 5 <= v.ecmaVersion && "Identifier" === m.key.type && ("get" === m.key.name || "set" === m.key.name) ? (t = k = !0,
                L = m.kind = m.key.name,
                m.key = w === wa || w === ya ? ab() : ea(!0),
                w !== Y && da(),
                m.value = ub(N(), !1)) : da();
                if ("Identifier" === m.key.type && (Q || k))
                    for (var D = 0; D < e.properties.length; ++D) {
                        var R = e.properties[D];
                        if (R.key.name === m.key.name) {
                            var Bb = L == R.kind || t && "init" === R.kind || "init" === L && ("get" === R.kind || "set" === R.kind);
                            Bb && !Q && "init" === L && "init" === R.kind && (Bb = !1);
                            Bb && c(m.key.start, "Redefinition of property")
                        }
                    }
                e.properties.push(m)
            }
            return x(e, "ObjectExpression");
        case tb:
            return e = N(),
            B(),
            ub(e, !1);
        case qc:
            return e = N(),
            B(),
            e.callee = Fa(ab(), !0),
            F(Y) ? e.arguments = Ab(U, !1) : e.arguments = jc,
            x(e, "NewExpression");
        default:
            da()
        }
    }
    function ub(e, g) {
        w === oa ? e.id = ea() : g ? da() : e.id = null;
        e.params = [];
        var k = !0;
        for (H(Y); !F(U); )
            k ? k = !1 : H(aa),
            e.params.push(ea());
        k = Da;
        var m = I;
        Da = !0;
        I = [];
        e.body = Ea(!0);
        Da = k;
        I = m;
        if (Q || e.body.body.length && nb(e.body.body[0]))
            for (k = e.id ? -1 : 0; k < e.params.length; ++k)
                if (m = 0 > k ? e.id : e.params[k],
                (Ub(m.name) || Za(m.name)) && c(m.start, "Defining '" + m.name + "' in strict mode"),
                0 <= k)
                    for (var t = 0; t < k; ++t)
                        m.name === e.params[t].name && c(m.start, "Argument name clash in strict mode");
        return x(e, g ? "FunctionDeclaration" : "FunctionExpression")
    }
    function Ab(e, g, k) {
        for (var m = [], t = !0; !F(e); ) {
            if (t)
                t = !1;
            else if (H(aa),
            g && v.allowTrailingCommas && F(e))
                break;
            k && w === aa ? m.push(null) : m.push(O(!0))
        }
        return m
    }
    function ea(e) {
        var g = N();
        g.name = w === oa ? X : e && !v.forbidReserved && w.keyword || da();
        ja = !1;
        B();
        return x(g, "Identifier")
    }
    a.version = "0.4.1";
    var v, r, ka, bb;
    a.parse = function(e, g) {
        r = String(e);
        ka = r.length;
        b(g);
        W = 1;
        l = S = 0;
        ja = !0;
        q();
        g = v.program;
        kb = ca = l;
        v.locations && (lb = new f);
        Da = Q = null;
        I = [];
        G();
        e = g || N();
        var k = !0;
        for (g || (e.body = []); w !== Wa; )
            g = V(),
            e.body.push(g),
            k && nb(g) && mb(!0),
            k = !1;
        return x(e, "Program")
    }
    ;
    var Cb = a.defaultOptions = {
        ecmaVersion: 5,
        strictSemicolons: !1,
        allowTrailingCommas: !0,
        forbidReserved: !1,
        locations: !1,
        onComment: null,
        ranges: !1,
        program: null,
        sourceFile: null,
        directSourceFile: null
    }
      , sc = a.getLineInfo = function(e, g) {
        for (var k = 1, m = 0; ; ) {
            ta.lastIndex = m;
            var t = ta.exec(e);
            if (t && t.index < g)
                ++k,
                m = t.index + t[0].length;
            else
                break
        }
        return {
            line: k,
            column: g - m
        }
    }
    ;
    a.tokenize = function(e, g) {
        function k(t) {
            G(t);
            m.start = K;
            m.end = qa;
            m.startLoc = Va;
            m.endLoc = Ga;
            m.type = w;
            m.value = X;
            return m
        }
        r = String(e);
        ka = r.length;
        b(g);
        W = 1;
        l = S = 0;
        ja = !0;
        q();
        var m = {};
        k.jumpTo = function(t, L) {
            l = t;
            if (v.locations) {
                W = 1;
                S = ta.lastIndex = 0;
                for (var D; (D = ta.exec(r)) && D.index < t; )
                    ++W,
                    S = D.index + D[0].length
            }
            ja = L;
            q()
        }
        ;
        return k
    }
    ;
    var l, K, qa, Va, Ga, w, X, ja, W, S, kb, ca, lb, Da, I, Q, jc = [], wa = {
        type: "num"
    }, ib = {
        type: "regexp"
    }, ya = {
        type: "string"
    }, oa = {
        type: "name"
    }, Wa = {
        type: "eof"
    }, ob = {
        keyword: "break"
    }, wb = {
        keyword: "case",
        beforeExpr: !0
    }, ic = {
        keyword: "catch"
    }, Xb = {
        keyword: "continue"
    }, Yb = {
        keyword: "debugger"
    }, fc = {
        keyword: "default"
    }, Zb = {
        keyword: "do",
        isLoop: !0
    }, dc = {
        keyword: "else",
        beforeExpr: !0
    }, kc = {
        keyword: "finally"
    }, $b = {
        keyword: "for",
        isLoop: !0
    }, tb = {
        keyword: "function"
    }, cc = {
        keyword: "if"
    }, ec = {
        keyword: "return",
        beforeExpr: !0
    }, vb = {
        keyword: "switch"
    }, gc = {
        keyword: "throw",
        beforeExpr: !0
    }, hc = {
        keyword: "try"
    }, sb = {
        keyword: "var"
    }, qb = {
        keyword: "while",
        isLoop: !0
    }, lc = {
        keyword: "with"
    }, qc = {
        keyword: "new",
        beforeExpr: !0
    }, mc = {
        keyword: "this"
    }, nc = {
        keyword: "null",
        atomValue: null
    }, oc = {
        keyword: "true",
        atomValue: !0
    }, pc = {
        keyword: "false",
        atomValue: !1
    }, $a = {
        keyword: "in",
        binop: 7,
        beforeExpr: !0
    }, jb = {
        "break": ob,
        "case": wb,
        "catch": ic,
        "continue": Xb,
        "debugger": Yb,
        "default": fc,
        "do": Zb,
        "else": dc,
        "finally": kc,
        "for": $b,
        "function": tb,
        "if": cc,
        "return": ec,
        "switch": vb,
        "throw": gc,
        "try": hc,
        "var": sb,
        "while": qb,
        "with": lc,
        "null": nc,
        "true": oc,
        "false": pc,
        "new": qc,
        "in": $a,
        "instanceof": {
            keyword: "instanceof",
            binop: 7,
            beforeExpr: !0
        },
        "this": mc,
        "typeof": {
            keyword: "typeof",
            prefix: !0,
            beforeExpr: !0
        },
        "void": {
            keyword: "void",
            prefix: !0,
            beforeExpr: !0
        },
        "delete": {
            keyword: "delete",
            prefix: !0,
            beforeExpr: !0
        }
    }, Qa = {
        type: "[",
        beforeExpr: !0
    }, Ra = {
        type: "]"
    }, ua = {
        type: "{",
        beforeExpr: !0
    }, la = {
        type: "}"
    }, Y = {
        type: "(",
        beforeExpr: !0
    }, U = {
        type: ")"
    }, aa = {
        type: ",",
        beforeExpr: !0
    }, Z = {
        type: ";",
        beforeExpr: !0
    }, va = {
        type: ":",
        beforeExpr: !0
    }, eb = {
        type: "."
    }, fb = {
        type: "?",
        beforeExpr: !0
    }, gb = {
        binop: 10,
        beforeExpr: !0
    }, hb = {
        isAssign: !0,
        beforeExpr: !0
    }, na = {
        isAssign: !0,
        beforeExpr: !0
    }, Ec = {
        postfix: !0,
        prefix: !0,
        isUpdate: !0
    }, Pb = {
        prefix: !0,
        beforeExpr: !0
    }, Nb = {
        binop: 1,
        beforeExpr: !0
    }, Ob = {
        binop: 2,
        beforeExpr: !0
    }, Bc = {
        binop: 3,
        beforeExpr: !0
    }, Dc = {
        binop: 4,
        beforeExpr: !0
    }, Cc = {
        binop: 5,
        beforeExpr: !0
    }, Ic = {
        binop: 6,
        beforeExpr: !0
    }, Hc = {
        binop: 7,
        beforeExpr: !0
    }, Gc = {
        binop: 8,
        beforeExpr: !0
    }, Fc = {
        binop: 9,
        prefix: !0,
        beforeExpr: !0
    }, Ac = {
        binop: 10,
        beforeExpr: !0
    };
    a.tokTypes = {
        bracketL: Qa,
        bracketR: Ra,
        braceL: ua,
        braceR: la,
        parenL: Y,
        parenR: U,
        comma: aa,
        semi: Z,
        colon: va,
        dot: eb,
        question: fb,
        slash: gb,
        eq: hb,
        name: oa,
        eof: Wa,
        num: wa,
        regexp: ib,
        string: ya
    };
    for (var rc in jb)
        a.tokTypes["_" + rc] = jb[rc];
    var Kc = d("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"), Lc = d("class enum extends super const export import"), Ub = d("implements interface let package private protected public static yield"), Za = d("eval arguments"), Jc = d("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"), tc = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/, Rb = /[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]/, Nc = /[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]/, Ua = /[\n\r\u2028\u2029]/, ta = /\r\n|[\n\r\u2028\u2029]/g, Sa = a.isIdentifierStart = function(e) {
        return 65 > e ? 36 === e : 91 > e ? !0 : 97 > e ? 95 === e : 123 > e ? !0 : 170 <= e && Rb.test(String.fromCharCode(e))
    }
    , Tb = a.isIdentifierChar = function(e) {
        return 48 > e ? 36 === e : 58 > e ? !0 : 65 > e ? !1 : 91 > e ? !0 : 97 > e ? 95 === e : 123 > e ? !0 : 170 <= e && Nc.test(String.fromCharCode(e))
    }
    , xa, pb = {
        kind: "loop"
    }, Mc = {
        kind: "switch"
    }
};
"object" == typeof exports && "object" == typeof module ? mod$$inline_58(exports) : "function" == typeof define && define.amd ? define(["exports"], mod$$inline_58) : mod$$inline_58(this.acorn || (this.acorn = {}));
function u(a, b) {
    "string" === typeof a && (a = acorn.parse(a, ha));
    this.ha = a;
    this.ib = b;
    this.ya = !1;
    this.V = [];
    this.Da = 0;
    this.nb = Object.create(null);
    b = /^step([A-Z]\w*)$/;
    var c, d;
    for (d in this)
        "function" === typeof this[d] && (c = d.match(b)) && (this.nb[c[1]] = this[d].bind(this));
    this.global = ia(this, this.ha, null);
    this.ha = acorn.parse(this.V.join("\n"), ha);
    this.V = void 0;
    ra(this, this.ha, void 0, void 0);
    b = new y(this.ha,this.global);
    b.done = !1;
    this.j = [b];
    this.lb();
    this.value = void 0;
    this.ha = a;
    b = new y(this.ha,this.global);
    b.done = !1;
    this.j.length = 0;
    this.j[0] = b;
    this.Ra = b.node.constructor;
    this.stateStack = this.j
}
var ha = {
    Ca: 5
}
  , sa = {
    configurable: !0,
    enumerable: !0,
    writable: !1
}
  , A = {
    configurable: !0,
    enumerable: !1,
    writable: !0
}
  , E = {
    configurable: !0,
    enumerable: !1,
    writable: !1
}
  , za = {
    configurable: !1,
    enumerable: !0,
    writable: !0
}
  , Aa = {
    STEP_ERROR: !0
}
  , Ba = {
    SCOPE_REFERENCE: !0
}
  , Ha = {
    VALUE_IN_DESCRIPTOR: !0
}
  , Ia = {
    REGEXP_TIMEOUT: !0
}
  , Ja = []
  , Ka = null
  , La = ["onmessage = function(e) {", "var result;", "var data = e.data;", "switch (data[0]) {", "case 'split':", "result = data[1].split(data[2], data[3]);", "break;", "case 'match':", "result = data[1].match(data[2]);", "break;", "case 'search':", "result = data[1].search(data[2]);", "break;", "case 'replace':", "result = data[1].replace(data[2], data[3]);", "break;", "case 'exec':", "var regexp = data[1];", "regexp.lastIndex = data[2];", "result = [regexp.exec(data[3]), data[1].lastIndex];", "break;", "default:", "throw 'Unknown RegExp operation: ' + data[0];", "}", "postMessage(result);", "};"];
u.prototype.REGEXP_MODE = 2;
u.prototype.REGEXP_THREAD_TIMEOUT = 1E3;
u.prototype.sb = function(a) {
    var b = this.j[0];
    if (!b || "Program" !== b.node.type)
        throw Error("Expecting original AST to start with a Program node.");
    "string" === typeof a && (a = acorn.parse(a, ha));
    if (!a || "Program" !== a.type)
        throw Error("Expecting new AST to start with a Program node.");
    Ma(this, a, b.scope);
    for (var c = 0, d; d = a.body[c]; c++)
        b.node.body.push(d);
    b.done = !1
}
;
u.prototype.step = function() {
    var a = this.j
      , b = a[a.length - 1];
    if (!b)
        return !1;
    var c = b.node
      , d = c.type;
    if ("Program" === d && b.done)
        return !1;
    if (this.ya)
        return !0;
    try {
        var f = this.nb[d](a, b, c)
    } catch (h) {
        if (h !== Aa)
            throw h;
    }
    f && a.push(f);
    return c.end ? !0 : this.step()
}
;
u.prototype.lb = function() {
    for (; !this.ya && this.step(); )
        ;
    return this.ya
}
;
function Na(a, b) {
    a.setProperty(b, "NaN", NaN, sa);
    a.setProperty(b, "Infinity", Infinity, sa);
    a.setProperty(b, "undefined", void 0, sa);
    a.setProperty(b, "window", b, sa);
    a.setProperty(b, "this", b, sa);
    a.setProperty(b, "self", b);
    a.G = new Oa(null);
    a.I = new Oa(a.G);
    Pa(a, b);
    cb(a, b);
    b.oa = a.G;
    a.setProperty(b, "constructor", a.m, A);
    db(a, b);
    Eb(a, b);
    Fb(a, b);
    Gb(a, b);
    Hb(a, b);
    Ib(a, b);
    Jb(a, b);
    Kb(a, b);
    Lb(a, b);
    var c = a.b(function() {
        throw EvalError("Can't happen");
    }, !1);
    c.eval = !0;
    a.setProperty(b, "eval", c);
    a.setProperty(b, "parseInt", a.b(parseInt, !1));
    a.setProperty(b, "parseFloat", a.b(parseFloat, !1));
    a.setProperty(b, "isNaN", a.b(isNaN, !1));
    a.setProperty(b, "isFinite", a.b(isFinite, !1));
    c = [[escape, "escape"], [unescape, "unescape"], [decodeURI, "decodeURI"], [decodeURIComponent, "decodeURIComponent"], [encodeURI, "encodeURI"], [encodeURIComponent, "encodeURIComponent"]];
    for (var d = 0; d < c.length; d++)
        a.setProperty(b, c[d][1], a.b(function(f) {
            return function(h) {
                try {
                    return f(h)
                } catch (n) {
                    J(a, a.pb, n.message)
                }
            }
        }(c[d][0]), !1), A);
    a.OBJECT = a.m;
    a.OBJECT_PROTO = a.G;
    a.FUNCTION = a.C;
    a.FUNCTION_PROTO = a.I;
    a.ARRAY = a.l;
    a.ARRAY_PROTO = a.ea;
    a.REGEXP = a.D;
    a.REGEXP_PROTO = a.Aa;
    a.DATE = a.S;
    a.DATE_PROTO = a.Xa;
    a.UNDEFINED = void 0;
    a.NULL = null;
    a.NAN = NaN;
    a.TRUE = !0;
    a.FALSE = !1;
    a.STRING_EMPTY = "";
    a.NUMBER_ZERO = 0;
    a.NUMBER_ONE = 1;
    a.ib && a.ib(a, b)
}
function Pa(a, b) {
    function c(h) {
        if (!(h && h.o || Mb(a).H))
            if (void 0 === h || null === h)
                h = a.global;
            else {
                var n = a.g(uc(a, h));
                n.data = h;
                h = n
            }
        return h
    }
    var d = /^[A-Za-z_$][\w$]*$/
      , f = function(h) {
        var n = vc(a) ? this : a.g(a.I)
          , q = arguments.length ? String(arguments[arguments.length - 1]) : ""
          , z = Array.prototype.slice.call(arguments, 0, -1).join(",").trim();
        if (z) {
            z = z.split(/\s*,\s*/);
            for (var G = 0; G < z.length; G++) {
                var C = z[G];
                d.test(C) || J(a, a.fa, "Invalid function argument: " + C)
            }
            z = z.join(", ")
        }
        n.ca = a.global;
        try {
            var ba = acorn.parse("(function(" + z + ") {" + q + "})", ha)
        } catch (ma) {
            J(a, a.fa, "Invalid code: " + ma.message)
        }
        1 !== ba.body.length && J(a, a.fa, "Invalid code in function body.");
        n.node = ba.body[0].expression;
        a.setProperty(n, "length", n.node.length, E);
        return n
    };
    f.id = a.Da++;
    a.C = a.g(a.I);
    a.setProperty(b, "Function", a.C);
    a.setProperty(a.C, "prototype", a.I, A);
    a.C.xa = f;
    a.setProperty(a.I, "constructor", a.C, A);
    a.I.xa = function() {}
    ;
    a.I.xa.id = a.Da++;
    a.setProperty(a.I, "length", 0, E);
    f = function(h, n) {
        var q = a.j[a.j.length - 1];
        q.Z = this;
        q.J = c(h);
        q.B = [];
        if (null !== n && void 0 !== n)
            if (n.o) {
                h = [];
                for (var z in n.a)
                    h[z] = a.v(n, z);
                h.length = wc(a.v(n, "length")) || 0;
                q.B = h
            } else
                J(a, a.h, "CreateListFromArrayLike called on non-object");
        q.Pa = !1
    }
    ;
    M(a, a.C, "apply", f);
    f = function(h) {
        var n = a.j[a.j.length - 1];
        n.Z = this;
        n.J = c(h);
        n.B = [];
        for (var q = 1; q < arguments.length; q++)
            n.B.push(arguments[q]);
        n.Pa = !1
    }
    ;
    M(a, a.C, "call", f);
    a.V.push("Object.defineProperty(Function.prototype, 'bind',", "{configurable: true, writable: true, value:", "function(oThis) {", "if (typeof this !== 'function') {", "throw TypeError('What is trying to be bound is not callable');", "}", "var aArgs   = Array.prototype.slice.call(arguments, 1),", "fToBind = this,", "fNOP    = function() {},", "fBound  = function() {", "return fToBind.apply(this instanceof fNOP", "? this", ": oThis,", "aArgs.concat(Array.prototype.slice.call(arguments)));", "};", "if (this.prototype) {", "fNOP.prototype = this.prototype;", "}", "fBound.prototype = new fNOP();", "return fBound;", "}", "});", "");
    f = function() {
        return String(this)
    }
    ;
    M(a, a.C, "toString", f);
    a.setProperty(a.C, "toString", a.b(f, !1), A);
    f = function() {
        return this.valueOf()
    }
    ;
    M(a, a.C, "valueOf", f);
    a.setProperty(a.C, "valueOf", a.b(f, !1), A)
}
function cb(a, b) {
    function c(f) {
        void 0 !== f && null !== f || J(a, a.h, "Cannot convert '" + f + "' to object")
    }
    var d = function(f) {
        if (void 0 === f || null === f)
            return vc(a) ? this : a.g(a.G);
        if (!f.o) {
            var h = a.g(uc(a, f));
            h.data = f;
            return h
        }
        return f
    };
    a.m = a.b(d, !0);
    a.setProperty(a.m, "prototype", a.G, A);
    a.setProperty(a.G, "constructor", a.m, A);
    a.setProperty(b, "Object", a.m);
    d = function(f) {
        c(f);
        return P(a, Object.getOwnPropertyNames(f.o ? f.a : f))
    }
    ;
    a.setProperty(a.m, "getOwnPropertyNames", a.b(d, !1), A);
    d = function(f) {
        c(f);
        f.o && (f = f.a);
        return P(a, Object.keys(f))
    }
    ;
    a.setProperty(a.m, "keys", a.b(d, !1), A);
    d = function(f) {
        if (null === f)
            return a.g(null);
        void 0 !== f && f.o || J(a, a.h, "Object prototype may only be an Object or null");
        return a.g(f)
    }
    ;
    a.setProperty(a.m, "create", a.b(d, !1), A);
    a.V.push("(function() {", "var create_ = Object.create;", "Object.create = function(proto, props) {", "var obj = create_(proto);", "props && Object.defineProperties(obj, props);", "return obj;", "};", "})();", "");
    d = function(f, h, n) {
        h = String(h);
        f && f.o || J(a, a.h, "Object.defineProperty called on non-object");
        n && n.o || J(a, a.h, "Property description must be an object");
        !f.a[h] && f.preventExtensions && J(a, a.h, "Can't define property '" + h + "', object is not extensible");
        a.setProperty(f, h, Ha, n.a);
        return f
    }
    ;
    a.setProperty(a.m, "defineProperty", a.b(d, !1), A);
    a.V.push("(function() {", "var defineProperty_ = Object.defineProperty;", "Object.defineProperty = function(obj, prop, d1) {", "var d2 = {};", "if ('configurable' in d1) d2.configurable = d1.configurable;", "if ('enumerable' in d1) d2.enumerable = d1.enumerable;", "if ('writable' in d1) d2.writable = d1.writable;", "if ('value' in d1) d2.value = d1.value;", "if ('get' in d1) d2.get = d1.get;", "if ('set' in d1) d2.set = d1.set;", "return defineProperty_(obj, prop, d2);", "};", "})();", "Object.defineProperty(Object, 'defineProperties',", "{configurable: true, writable: true, value:", "function(obj, props) {", "var keys = Object.keys(props);", "for (var i = 0; i < keys.length; i++) {", "Object.defineProperty(obj, keys[i], props[keys[i]]);", "}", "return obj;", "}", "});", "");
    d = function(f, h) {
        f && f.o || J(a, a.h, "Object.getOwnPropertyDescriptor called on non-object");
        h = String(h);
        if (h in f.a) {
            var n = Object.getOwnPropertyDescriptor(f.a, h)
              , q = f.O[h];
            f = f.R[h];
            if (q || f)
                n.get = q,
                n.set = f,
                delete n.value,
                delete n.writable;
            q = n.value;
            f = "value"in n;
            delete n.value;
            n = a.la(n);
            f && a.setProperty(n, "value", q);
            return n
        }
    }
    ;
    a.setProperty(a.m, "getOwnPropertyDescriptor", a.b(d, !1), A);
    d = function(f) {
        c(f);
        return uc(a, f)
    }
    ;
    a.setProperty(a.m, "getPrototypeOf", a.b(d, !1), A);
    d = function(f) {
        return !!f && !f.preventExtensions
    }
    ;
    a.setProperty(a.m, "isExtensible", a.b(d, !1), A);
    d = function(f) {
        f && f.o && (f.preventExtensions = !0);
        return f
    }
    ;
    a.setProperty(a.m, "preventExtensions", a.b(d, !1), A);
    M(a, a.m, "toString", Oa.prototype.toString);
    M(a, a.m, "toLocaleString", Oa.prototype.toString);
    M(a, a.m, "valueOf", Oa.prototype.valueOf);
    d = function(f) {
        c(this);
        return this.o ? String(f)in this.a : this.hasOwnProperty(f)
    }
    ;
    M(a, a.m, "hasOwnProperty", d);
    d = function(f) {
        c(this);
        return this.o ? Object.prototype.propertyIsEnumerable.call(this.a, f) : this.propertyIsEnumerable(f)
    }
    ;
    M(a, a.m, "propertyIsEnumerable", d);
    d = function(f) {
        for (; ; ) {
            f = uc(a, f);
            if (!f)
                return !1;
            if (f === this)
                return !0
        }
    }
    ;
    M(a, a.m, "isPrototypeOf", d)
}
function db(a, b) {
    var c = function(d) {
        var f = vc(a) ? this : a.g(a.ea)
          , h = arguments[0];
        if (1 === arguments.length && "number" === typeof h)
            isNaN(wc(h)) && J(a, a.Ya, "Invalid array length");
        else
            for (h = 0; h < arguments.length; h++)
                f.a[h] = arguments[h];
        f.a.length = h;
        return f
    };
    a.l = a.b(c, !0);
    a.ea = a.l.a.prototype;
    a.setProperty(b, "Array", a.l);
    c = function(d) {
        return d && "Array" === d.K
    }
    ;
    a.setProperty(a.l, "isArray", a.b(c, !1), A);
    M(a, a.l, "pop", function() {
        return Array.prototype.pop.call(this.a)
    });
    c = function(d) {
        return Array.prototype.push.apply(this.a, arguments)
    }
    ;
    M(a, a.l, "push", c);
    M(a, a.l, "shift", function() {
        return Array.prototype.shift.call(this.a)
    });
    c = function(d) {
        return Array.prototype.unshift.apply(this.a, arguments)
    }
    ;
    M(a, a.l, "unshift", c);
    M(a, a.l, "reverse", function() {
        Array.prototype.reverse.call(this.a);
        return this
    });
    c = function(d, f) {
        var h = Array.prototype.splice.apply(this.a, arguments);
        return P(a, h)
    }
    ;
    M(a, a.l, "splice", c);
    c = function(d, f) {
        return P(a, Array.prototype.slice.call(this.a, d, f))
    }
    ;
    M(a, a.l, "slice", c);
    c = function(d) {
        return Array.prototype.join.call(this.a, d)
    }
    ;
    M(a, a.l, "join", c);
    c = function(d) {
        for (var f = [], h = 0, n = a.v(this, "length"), q = 0; q < n; q++) {
            if (xc(a, this, q)) {
                var z = a.v(this, q);
                f[h] = z
            }
            h++
        }
        for (q = 0; q < arguments.length; q++)
            if (n = arguments[q],
            T(a, n, a.l)) {
                z = a.v(n, "length");
                for (var G = 0; G < z; G++)
                    xc(a, n, G) && (f[h] = a.v(n, G)),
                    h++
            } else
                f[h] = n;
        return P(a, f)
    }
    ;
    M(a, a.l, "concat", c);
    c = function(d, f) {
        return Array.prototype.indexOf.apply(this.a, arguments)
    }
    ;
    M(a, a.l, "indexOf", c);
    c = function(d, f) {
        return Array.prototype.lastIndexOf.apply(this.a, arguments)
    }
    ;
    M(a, a.l, "lastIndexOf", c);
    M(a, a.l, "sort", function() {
        Array.prototype.sort.call(this.a);
        return this
    });
    a.V.push("Object.defineProperty(Array.prototype, 'every',", "{configurable: true, writable: true, value:", "function(callbackfn, thisArg) {", "if (!this || typeof callbackfn !== 'function') throw TypeError();", "var T, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "k = 0;", "while (k < len) {", "if (k in O && !callbackfn.call(T, O[k], k, O)) return false;", "k++;", "}", "return true;", "}", "});", "Object.defineProperty(Array.prototype, 'filter',", "{configurable: true, writable: true, value:", "function(fun/*, thisArg*/) {", "if (this === void 0 || this === null || typeof fun !== 'function') throw TypeError();", "var t = Object(this);", "var len = t.length >>> 0;", "var res = [];", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in t) {", "var val = t[i];", "if (fun.call(thisArg, val, i, t)) res.push(val);", "}", "}", "return res;", "}", "});", "Object.defineProperty(Array.prototype, 'forEach',", "{configurable: true, writable: true, value:", "function(callback, thisArg) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var T, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "k = 0;", "while (k < len) {", "if (k in O) callback.call(T, O[k], k, O);", "k++;", "}", "}", "});", "Object.defineProperty(Array.prototype, 'map',", "{configurable: true, writable: true, value:", "function(callback, thisArg) {", "if (!this || typeof callback !== 'function') new TypeError;", "var T, A, k;", "var O = Object(this);", "var len = O.length >>> 0;", "if (arguments.length > 1) T = thisArg;", "A = new Array(len);", "k = 0;", "while (k < len) {", "if (k in O) A[k] = callback.call(T, O[k], k, O);", "k++;", "}", "return A;", "}", "});", "Object.defineProperty(Array.prototype, 'reduce',", "{configurable: true, writable: true, value:", "function(callback /*, initialValue*/) {", "if (!this || typeof callback !== 'function') throw TypeError();", "var t = Object(this), len = t.length >>> 0, k = 0, value;", "if (arguments.length === 2) {", "value = arguments[1];", "} else {", "while (k < len && !(k in t)) k++;", "if (k >= len) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = t[k++];", "}", "for (; k < len; k++) {", "if (k in t) value = callback(value, t[k], k, t);", "}", "return value;", "}", "});", "Object.defineProperty(Array.prototype, 'reduceRight',", "{configurable: true, writable: true, value:", "function(callback /*, initialValue*/) {", "if (null === this || 'undefined' === typeof this || 'function' !== typeof callback) throw TypeError();", "var t = Object(this), len = t.length >>> 0, k = len - 1, value;", "if (arguments.length >= 2) {", "value = arguments[1];", "} else {", "while (k >= 0 && !(k in t)) k--;", "if (k < 0) {", "throw TypeError('Reduce of empty array with no initial value');", "}", "value = t[k--];", "}", "for (; k >= 0; k--) {", "if (k in t) value = callback(value, t[k], k, t);", "}", "return value;", "}", "});", "Object.defineProperty(Array.prototype, 'some',", "{configurable: true, writable: true, value:", "function(fun/*, thisArg*/) {", "if (!this || typeof fun !== 'function') throw TypeError();", "var t = Object(this);", "var len = t.length >>> 0;", "var thisArg = arguments.length >= 2 ? arguments[1] : void 0;", "for (var i = 0; i < len; i++) {", "if (i in t && fun.call(thisArg, t[i], i, t)) {", "return true;", "}", "}", "return false;", "}", "});", "(function() {", "var sort_ = Array.prototype.sort;", "Array.prototype.sort = function(opt_comp) {", "if (typeof opt_comp !== 'function') {", "return sort_.call(this);", "}", "for (var i = 0; i < this.length; i++) {", "var changes = 0;", "for (var j = 0; j < this.length - i - 1; j++) {", "if (opt_comp(this[j], this[j + 1]) > 0) {", "var swap = this[j];", "this[j] = this[j + 1];", "this[j + 1] = swap;", "changes++;", "}", "}", "if (!changes) break;", "}", "return this;", "};", "})();", "Object.defineProperty(Array.prototype, 'toLocaleString',", "{configurable: true, writable: true, value:", "function() {", "var out = [];", "for (var i = 0; i < this.length; i++) {", "out[i] = (this[i] === null || this[i] === undefined) ? '' : this[i].toLocaleString();", "}", "return out.join(',');", "}", "});", "")
}
function Eb(a, b) {
    var c = function(d) {
        d = String(d);
        return vc(a) ? (this.data = d,
        this) : d
    };
    a.A = a.b(c, !0);
    a.setProperty(b, "String", a.A);
    a.setProperty(a.A, "fromCharCode", a.b(String.fromCharCode, !1), A);
    c = "charAt charCodeAt concat indexOf lastIndexOf slice substr substring toLocaleLowerCase toLocaleUpperCase toLowerCase toUpperCase trim".split(" ");
    for (b = 0; b < c.length; b++)
        M(a, a.A, c[b], String.prototype[c[b]]);
    c = function(d, f, h) {
        f = f ? a.M(f) : void 0;
        h = h ? a.M(h) : void 0;
        return String(this).localeCompare(d, f, h)
    }
    ;
    M(a, a.A, "localeCompare", c);
    c = function(d, f, h) {
        var n = String(this);
        f = f ? Number(f) : void 0;
        if (T(a, d, a.D) && (d = d.data,
        yc(a, d, h),
        2 === a.REGEXP_MODE))
            if (Ka)
                d = zc(a, "string.split(separator, limit)", {
                    string: n,
                    separator: d,
                    limit: f
                }, d, h),
                d !== Ia && h(P(a, d));
            else {
                var q = a.X()
                  , z = Qc(a, d, q, h);
                q.onmessage = function(G) {
                    clearTimeout(z);
                    h(P(a, G.data))
                }
                ;
                q.postMessage(["split", n, d, f])
            }
        else
            d = n.split(d, f),
            h(P(a, d))
    }
    ;
    Rc(a, a.A, "split", c);
    c = function(d, f) {
        var h = String(this);
        d = T(a, d, a.D) ? d.data : new RegExp(d);
        yc(a, d, f);
        if (2 === a.REGEXP_MODE)
            if (Ka)
                h = zc(a, "string.match(regexp)", {
                    string: h,
                    regexp: d
                }, d, f),
                h !== Ia && f(h && P(a, h));
            else {
                var n = a.X()
                  , q = Qc(a, d, n, f);
                n.onmessage = function(z) {
                    clearTimeout(q);
                    f(z.data && P(a, z.data))
                }
                ;
                n.postMessage(["match", h, d])
            }
        else
            h = h.match(d),
            f(h && P(a, h))
    }
    ;
    Rc(a, a.A, "match", c);
    c = function(d, f) {
        var h = String(this);
        d = T(a, d, a.D) ? d.data : new RegExp(d);
        yc(a, d, f);
        if (2 === a.REGEXP_MODE)
            if (Ka)
                h = zc(a, "string.search(regexp)", {
                    string: h,
                    regexp: d
                }, d, f),
                h !== Ia && f(h);
            else {
                var n = a.X()
                  , q = Qc(a, d, n, f);
                n.onmessage = function(z) {
                    clearTimeout(q);
                    f(z.data)
                }
                ;
                n.postMessage(["search", h, d])
            }
        else
            f(h.search(d))
    }
    ;
    Rc(a, a.A, "search", c);
    c = function(d, f, h) {
        var n = String(this);
        f = String(f);
        if (T(a, d, a.D) && (d = d.data,
        yc(a, d, h),
        2 === a.REGEXP_MODE))
            if (Ka)
                d = zc(a, "string.replace(substr, newSubstr)", {
                    string: n,
                    substr: d,
                    newSubstr: f
                }, d, h),
                d !== Ia && h(d);
            else {
                var q = a.X()
                  , z = Qc(a, d, q, h);
                q.onmessage = function(G) {
                    clearTimeout(z);
                    h(G.data)
                }
                ;
                q.postMessage(["replace", n, d, f])
            }
        else
            h(n.replace(d, f))
    }
    ;
    Rc(a, a.A, "replace", c);
    a.V.push("(function() {", "var replace_ = String.prototype.replace;", "String.prototype.replace = function(substr, newSubstr) {", "if (typeof newSubstr !== 'function') {", "return replace_.call(this, substr, newSubstr);", "}", "var str = this;", "if (substr instanceof RegExp) {", "var subs = [];", "var m = substr.exec(str);", "while (m) {", "m.push(m.index, str);", "var inject = newSubstr.apply(null, m);", "subs.push([m.index, m[0].length, inject]);", "m = substr.global ? substr.exec(str) : null;", "}", "for (var i = subs.length - 1; i >= 0; i--) {", "str = str.substring(0, subs[i][0]) + subs[i][2] + str.substring(subs[i][0] + subs[i][1]);", "}", "} else {", "var i = str.indexOf(substr);", "if (i !== -1) {", "var inject = newSubstr(str.substr(i, substr.length), i, str);", "str = str.substring(0, i) + inject + str.substring(i + substr.length);", "}", "}", "return str;", "};", "})();", "")
}
function Fb(a, b) {
    a.Wa = a.b(function(c) {
        c = !!c;
        return vc(a) ? (this.data = c,
        this) : c
    }, !0);
    a.setProperty(b, "Boolean", a.Wa)
}
function Gb(a, b) {
    var c = function(d) {
        d = Number(d);
        return vc(a) ? (this.data = d,
        this) : d
    };
    a.T = a.b(c, !0);
    a.setProperty(b, "Number", a.T);
    c = ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY", "POSITIVE_INFINITY"];
    for (b = 0; b < c.length; b++)
        a.setProperty(a.T, c[b], Number[c[b]], E);
    c = function(d) {
        try {
            return Number(this).toExponential(d)
        } catch (f) {
            J(a, a.w, f.message)
        }
    }
    ;
    M(a, a.T, "toExponential", c);
    c = function(d) {
        try {
            return Number(this).toFixed(d)
        } catch (f) {
            J(a, a.w, f.message)
        }
    }
    ;
    M(a, a.T, "toFixed", c);
    c = function(d) {
        try {
            return Number(this).toPrecision(d)
        } catch (f) {
            J(a, a.w, f.message)
        }
    }
    ;
    M(a, a.T, "toPrecision", c);
    c = function(d) {
        try {
            return Number(this).toString(d)
        } catch (f) {
            J(a, a.w, f.message)
        }
    }
    ;
    M(a, a.T, "toString", c);
    c = function(d, f) {
        d = d ? a.M(d) : void 0;
        f = f ? a.M(f) : void 0;
        return Number(this).toLocaleString(d, f)
    }
    ;
    M(a, a.T, "toLocaleString", c)
}
function Hb(a, b) {
    var c = function(f, h) {
        if (!vc(a))
            return Date();
        var n = [null].concat(Array.from(arguments));
        this.data = new (Function.prototype.bind.apply(Date, n));
        return this
    };
    a.S = a.b(c, !0);
    a.Xa = a.S.a.prototype;
    a.setProperty(b, "Date", a.S);
    a.setProperty(a.S, "now", a.b(Date.now, !1), A);
    a.setProperty(a.S, "parse", a.b(Date.parse, !1), A);
    a.setProperty(a.S, "UTC", a.b(Date.UTC, !1), A);
    b = "getDate getDay getFullYear getHours getMilliseconds getMinutes getMonth getSeconds getTime getTimezoneOffset getUTCDate getUTCDay getUTCFullYear getUTCHours getUTCMilliseconds getUTCMinutes getUTCMonth getUTCSeconds getYear setDate setFullYear setHours setMilliseconds setMinutes setMonth setSeconds setTime setUTCDate setUTCFullYear setUTCHours setUTCMilliseconds setUTCMinutes setUTCMonth setUTCSeconds setYear toDateString toISOString toJSON toGMTString toLocaleDateString toLocaleString toLocaleTimeString toTimeString toUTCString".split(" ");
    for (var d = 0; d < b.length; d++)
        c = function(f) {
            return function(h) {
                for (var n = [], q = 0; q < arguments.length; q++)
                    n[q] = a.M(arguments[q]);
                return this.data[f].apply(this.data, n)
            }
        }(b[d]),
        M(a, a.S, b[d], c)
}
function Ib(a, b) {
    var c = function(d, f) {
        var h = vc(a) ? this : a.g(a.Aa);
        d = d ? String(d) : "";
        f = f ? String(f) : "";
        Sc(a, h, new RegExp(d,f));
        return h
    };
    a.D = a.b(c, !0);
    a.Aa = a.D.a.prototype;
    a.setProperty(b, "RegExp", a.D);
    a.setProperty(a.D.a.prototype, "global", void 0, E);
    a.setProperty(a.D.a.prototype, "ignoreCase", void 0, E);
    a.setProperty(a.D.a.prototype, "multiline", void 0, E);
    a.setProperty(a.D.a.prototype, "source", "(?:)", E);
    a.V.push("Object.defineProperty(RegExp.prototype, 'test',", "{configurable: true, writable: true, value:", "function(str) {", "return String(str).search(this) !== -1", "}", "});");
    c = function(d, f) {
        function h(C) {
            if (C) {
                var ba = P(a, C);
                a.setProperty(ba, "index", C.index);
                a.setProperty(ba, "input", C.input);
                return ba
            }
            return null
        }
        var n = this
          , q = n.data;
        d = String(d);
        q.lastIndex = Number(a.v(this, "lastIndex"));
        yc(a, q, f);
        if (2 === a.REGEXP_MODE)
            if (Ka) {
                var z = zc(a, "regexp.exec(string)", {
                    string: d,
                    regexp: q
                }, q, f);
                z !== Ia && (a.setProperty(n, "lastIndex", q.lastIndex),
                f(h(z)))
            } else {
                z = a.X();
                var G = Qc(a, q, z, f);
                z.onmessage = function(C) {
                    clearTimeout(G);
                    a.setProperty(n, "lastIndex", C.data[1]);
                    f(h(C.data[0]))
                }
                ;
                z.postMessage(["exec", q, q.lastIndex, d])
            }
        else
            z = q.exec(d),
            a.setProperty(n, "lastIndex", q.lastIndex),
            f(h(z))
    }
    ;
    Rc(a, a.D, "exec", c)
}
function Jb(a, b) {
    function c(d) {
        var f = a.b(function(h) {
            var n = vc(a) ? this : a.pa(f);
            h && a.setProperty(n, "message", String(h), A);
            return n
        }, !0);
        a.setProperty(f, "prototype", a.pa(a.w), A);
        a.setProperty(f.a.prototype, "name", d, A);
        a.setProperty(b, d, f);
        return f
    }
    a.w = a.b(function(d) {
        var f = vc(a) ? this : a.pa(a.w);
        d && a.setProperty(f, "message", String(d), A);
        return f
    }, !0);
    a.setProperty(b, "Error", a.w);
    a.setProperty(a.w.a.prototype, "message", "", A);
    a.setProperty(a.w.a.prototype, "name", "Error", A);
    c("EvalError");
    a.Ya = c("RangeError");
    a.Za = c("ReferenceError");
    a.fa = c("SyntaxError");
    a.h = c("TypeError");
    a.pb = c("URIError")
}
function Kb(a, b) {
    var c = a.g(a.G);
    a.setProperty(b, "Math", c);
    b = "E LN2 LN10 LOG2E LOG10E PI SQRT1_2 SQRT2".split(" ");
    for (var d = 0; d < b.length; d++)
        a.setProperty(c, b[d], Math[b[d]], E);
    b = "abs acos asin atan atan2 ceil cos exp floor log max min pow random round sin sqrt tan".split(" ");
    for (d = 0; d < b.length; d++)
        a.setProperty(c, b[d], a.b(Math[b[d]], !1), A)
}
function Lb(a, b) {
    function c(f) {
        try {
            var h = JSON.parse(String(f))
        } catch (n) {
            J(a, a.fa, n.message)
        }
        return a.la(h)
    }
    var d = a.g(a.G);
    a.setProperty(b, "JSON", d);
    a.setProperty(d, "parse", a.b(c, !1));
    c = function(f) {
        f = a.M(f);
        try {
            var h = JSON.stringify(f)
        } catch (n) {
            J(a, a.h, n.message)
        }
        return h
    }
    ;
    a.setProperty(d, "stringify", a.b(c, !1))
}
function T(a, b, c) {
    if (null === b || void 0 === b || !c)
        return !1;
    c = c.a.prototype;
    if (b === c)
        return !0;
    for (b = uc(a, b); b; ) {
        if (b === c)
            return !0;
        b = b.oa
    }
    return !1
}
function Sc(a, b, c) {
    b.data = c;
    a.setProperty(b, "lastIndex", c.lastIndex, A);
    a.setProperty(b, "source", c.source, E);
    a.setProperty(b, "global", c.global, E);
    a.setProperty(b, "ignoreCase", c.ignoreCase, E);
    a.setProperty(b, "multiline", c.multiline, E)
}
u.prototype.X = function() {
    var a = this.X.tb;
    a || (a = new Blob([La.join("\n")],{
        type: "application/javascript"
    }),
    this.X.tb = a);
    return new Worker(URL.createObjectURL(a))
}
;
function zc(a, b, c, d, f) {
    var h = {
        timeout: a.REGEXP_THREAD_TIMEOUT
    };
    try {
        return Ka.runInNewContext(b, c, h)
    } catch (n) {
        f(null),
        J(a, a.w, "RegExp Timeout: " + d)
    }
    return Ia
}
function yc(a, b, c) {
    if (0 === a.REGEXP_MODE)
        var d = !1;
    else if (1 === a.REGEXP_MODE)
        d = !0;
    else if (Ka)
        d = !0;
    else if ("function" === typeof Worker && "function" === typeof URL)
        d = !0;
    else if ("function" === typeof require) {
        try {
            Ka = require("vm")
        } catch (f) {}
        d = !!Ka
    } else
        d = !1;
    d || (c(null),
    J(a, a.w, "Regular expressions not supported: " + b))
}
function Qc(a, b, c, d) {
    return setTimeout(function() {
        c.terminate();
        d(null);
        try {
            J(a, a.w, "RegExp Timeout: " + b)
        } catch (f) {}
    }, a.REGEXP_THREAD_TIMEOUT)
}
function wc(a) {
    var b = a >>> 0;
    return b === Number(a) ? b : NaN
}
function Tc(a) {
    var b = a >>> 0;
    return String(b) === String(a) && 4294967295 !== b ? b : NaN
}
function Oa(a) {
    this.O = Object.create(null);
    this.R = Object.create(null);
    this.a = Object.create(null);
    this.oa = a
}
p = Oa.prototype;
p.oa = null;
p.o = !0;
p.K = "Object";
p.data = null;
p.toString = function() {
    if ("Array" === this.K) {
        var a = Ja;
        a.push(this);
        try {
            for (var b = [], c = 0; c < this.a.length; c++) {
                var d = this.a[c];
                b[c] = d && d.o && -1 !== a.indexOf(d) ? "..." : d
            }
        } finally {
            a.pop()
        }
        return b.join(",")
    }
    if ("Error" === this.K) {
        a = Ja;
        if (-1 !== a.indexOf(this))
            return "[object Error]";
        d = this;
        do
            if ("name"in d.a) {
                b = d.a.name;
                break
            }
        while (d = d.oa);
        d = this;
        do
            if ("message"in d.a) {
                c = d.a.message;
                break
            }
        while (d = d.oa);
        a.push(this);
        try {
            b = b && String(b),
            c = c && String(c)
        } finally {
            a.pop()
        }
        return c ? b + ": " + c : String(b)
    }
    return null !== this.data ? String(this.data) : "[object " + this.K + "]"
}
;
p.valueOf = function() {
    return void 0 === this.data || null === this.data || this.data instanceof RegExp ? this : this.data instanceof Date ? this.data.valueOf() : this.data
}
;
p = u.prototype;
p.pa = function(a) {
    return this.g(a && a.a.prototype)
}
;
p.g = function(a) {
    if ("object" !== typeof a)
        throw Error("Non object prototype");
    a = new Oa(a);
    T(this, a, this.C) && (this.setProperty(a, "prototype", this.g(this.G || null), A),
    a.K = "Function");
    T(this, a, this.l) && (this.setProperty(a, "length", 0, {
        configurable: !1,
        enumerable: !1,
        writable: !0
    }),
    a.K = "Array");
    T(this, a, this.w) && (a.K = "Error");
    return a
}
;
function Uc(a, b, c) {
    var d = a.g(a.I);
    d.ca = c;
    d.node = b;
    a.setProperty(d, "length", d.node.params.length, E);
    return d
}
p.b = function(a, b) {
    var c = this.g(this.I);
    c.xa = a;
    a.id = this.Da++;
    this.setProperty(c, "length", a.length, E);
    b ? this.setProperty(c.a.prototype, "constructor", c, A) : !1 === b && (c.Fb = !0,
    this.setProperty(c, "prototype", void 0, A));
    return c
}
;
p.bb = function(a) {
    var b = this.g(this.I);
    b.Ka = a;
    a.id = this.Da++;
    this.setProperty(b, "length", a.length, E);
    return b
}
;
p.la = function(a) {
    if ("object" !== typeof a && "function" !== typeof a || null === a)
        return a;
    if (a instanceof RegExp) {
        var b = this.g(this.Aa);
        Sc(this, b, a);
        return b
    }
    if (a instanceof Date)
        return b = this.g(this.Xa),
        b.data = a,
        b;
    if (a instanceof Function) {
        var c = this;
        return this.b(function() {
            return c.la(a.apply(c, Array.prototype.slice.call(arguments).map(function(f) {
                return c.M(f)
            })))
        }, void 0)
    }
    if (Array.isArray(a)) {
        b = this.g(this.ea);
        for (var d = 0; d < a.length; d++)
            d in a && this.setProperty(b, d, this.la(a[d]))
    } else
        for (d in b = this.g(this.G),
        a)
            this.setProperty(b, d, this.la(a[d]));
    return b
}
;
p.M = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a || null === a)
        return a;
    if (T(this, a, this.D) || T(this, a, this.S))
        return a.data;
    b = b || {
        Ta: [],
        Fa: []
    };
    var c = b.Ta.indexOf(a);
    if (-1 !== c)
        return b.Fa[c];
    b.Ta.push(a);
    if (T(this, a, this.l)) {
        var d = [];
        b.Fa.push(d);
        var f = this.v(a, "length");
        for (c = 0; c < f; c++)
            xc(this, a, c) && (d[c] = this.M(this.v(a, c), b))
    } else
        for (f in d = {},
        b.Fa.push(d),
        a.a)
            c = a.a[f],
            d[f] = this.M(c, b);
    b.Ta.pop();
    b.Fa.pop();
    return d
}
;
function P(a, b) {
    for (var c = a.g(a.ea), d = Object.getOwnPropertyNames(b), f = 0; f < d.length; f++)
        a.setProperty(c, d[f], b[d[f]]);
    return c
}
function uc(a, b) {
    switch (typeof b) {
    case "number":
        return a.T.a.prototype;
    case "boolean":
        return a.Wa.a.prototype;
    case "string":
        return a.A.a.prototype
    }
    return b ? b.oa : null
}
p.v = function(a, b) {
    b = String(b);
    void 0 !== a && null !== a || J(this, this.h, "Cannot read property '" + b + "' of " + a);
    if ("length" === b) {
        if (T(this, a, this.A))
            return String(a).length
    } else if (64 > b.charCodeAt(0) && T(this, a, this.A)) {
        var c = Tc(b);
        if (!isNaN(c) && c < String(a).length)
            return String(a)[c]
    }
    do
        if (a.a && b in a.a)
            return (c = a.O[b]) ? (c.L = !0,
            c) : a.a[b];
    while (a = uc(this, a))
}
;
function xc(a, b, c) {
    if (!b.o)
        throw TypeError("Primitive data type has no properties");
    c = String(c);
    if ("length" === c && T(a, b, a.A))
        return !0;
    if (T(a, b, a.A)) {
        var d = Tc(c);
        if (!isNaN(d) && d < String(b).length)
            return !0
    }
    do
        if (b.a && c in b.a)
            return !0;
    while (b = uc(a, b));
    return !1
}
p.setProperty = function(a, b, c, d) {
    b = String(b);
    void 0 !== a && null !== a || J(this, this.h, "Cannot set property '" + b + "' of " + a);
    d && ("get"in d || "set"in d) && ("value"in d || "writable"in d) && J(this, this.h, "Invalid property descriptor. Cannot both specify accessors and a value or writable attribute");
    var f = !this.j || Mb(this).H;
    if (a.o) {
        if (T(this, a, this.A)) {
            var h = Tc(b);
            if ("length" === b || !isNaN(h) && h < String(a).length) {
                f && J(this, this.h, "Cannot assign to read only property '" + b + "' of String '" + a.data + "'");
                return
            }
        }
        if ("Array" === a.K)
            if (h = a.a.length,
            "length" === b) {
                if (d) {
                    if (!("value"in d))
                        return;
                    c = d.value
                }
                c = wc(c);
                isNaN(c) && J(this, this.Ya, "Invalid array length");
                if (c < h)
                    for (n in a.a) {
                        var n = Tc(n);
                        !isNaN(n) && c <= n && delete a.a[n]
                    }
            } else
                isNaN(n = Tc(b)) || (a.a.length = Math.max(h, n + 1));
        if (!a.preventExtensions || b in a.a)
            if (d) {
                "get"in d && (d.get ? a.O[b] = d.get : delete a.O[b]);
                "set"in d && (d.set ? a.R[b] = d.set : delete a.R[b]);
                f = {};
                "configurable"in d && (f.configurable = d.configurable);
                "enumerable"in d && (f.enumerable = d.enumerable);
                "writable"in d && (f.writable = d.writable,
                delete a.O[b],
                delete a.R[b]);
                "value"in d ? (f.value = d.value,
                delete a.O[b],
                delete a.R[b]) : c !== Ha && (f.value = c,
                delete a.O[b],
                delete a.R[b]);
                try {
                    Object.defineProperty(a.a, b, f)
                } catch (q) {
                    J(this, this.h, "Cannot redefine property: " + b)
                }
            } else {
                if (c === Ha)
                    throw ReferenceError("Value not specified.");
                for (d = a; !(b in d.a); )
                    if (d = uc(this, d),
                    !d) {
                        d = a;
                        break
                    }
                if (d.R && d.R[b])
                    return d.R[b];
                if (d.O && d.O[b])
                    f && J(this, this.h, "Cannot set property '" + b + "' of object '" + a + "' which only has a getter");
                else
                    try {
                        a.a[b] = c
                    } catch (q) {
                        f && J(this, this.h, "Cannot assign to read only property '" + b + "' of object '" + a + "'")
                    }
            }
        else
            f && J(this, this.h, "Can't add property '" + b + "', object is not extensible")
    } else
        f && J(this, this.h, "Can't create property '" + b + "' on '" + a + "'")
}
;
function M(a, b, c, d) {
    a.setProperty(b.a.prototype, c, a.b(d, !1), A)
}
function Rc(a, b, c, d) {
    a.setProperty(b.a.prototype, c, a.bb(d), A)
}
function Mb(a) {
    a = a.j[a.j.length - 1].scope;
    if (!a)
        throw Error("No scope found.");
    return a
}
function ia(a, b, c) {
    var d = a.g(null);
    (d.ca = c) || Na(a, d);
    Ma(a, b, d);
    d.H = !1;
    c && c.H ? d.H = !0 : (a = b.body && b.body[0]) && a.ta && "Literal" === a.ta.type && "use strict" === a.ta.value && (d.H = !0);
    return d
}
function Vc(a, b, c) {
    if (!b)
        throw Error("parentScope required");
    a = c || a.g(null);
    a.ca = b;
    a.H = b.H;
    return a
}
function Wc(a, b) {
    for (var c = Mb(a); c && c !== a.global; ) {
        if (b in c.a)
            return c.a[b];
        c = c.ca
    }
    if (c === a.global && xc(a, c, b))
        return a.v(c, b);
    c = a.j[a.j.length - 1].node;
    "UnaryExpression" === c.type && "typeof" === c.operator || J(a, a.Za, b + " is not defined")
}
function Xc(a, b, c) {
    for (var d = Mb(a), f = d.H; d && d !== a.global; ) {
        if (b in d.a) {
            d.a[b] = c;
            return
        }
        d = d.ca
    }
    if (d === a.global && (!f || xc(a, d, b)))
        return a.setProperty(d, b, c);
    J(a, a.Za, b + " is not defined")
}
function Ma(a, b, c) {
    if ("VariableDeclaration" === b.type)
        for (var d = 0; d < b.declarations.length; d++)
            a.setProperty(c, b.declarations[d].id.name, void 0, za);
    else {
        if ("FunctionDeclaration" === b.type) {
            a.setProperty(c, b.id.name, Uc(a, b, c), za);
            return
        }
        if ("FunctionExpression" === b.type || "ExpressionStatement" === b.type)
            return
    }
    var f = b.constructor, h;
    for (h in b) {
        var n = b[h];
        if (n && "object" === typeof n)
            if (Array.isArray(n))
                for (d = 0; d < n.length; d++)
                    n[d] && n[d].constructor === f && Ma(a, n[d], c);
            else
                n.constructor === f && Ma(a, n, c)
    }
}
function ra(a, b, c, d) {
    c ? b.start = c : delete b.start;
    d ? b.end = d : delete b.end;
    for (var f in b)
        if (b.hasOwnProperty(f)) {
            var h = b[f];
            h && "object" === typeof h && ra(a, h, c, d)
        }
}
function vc(a) {
    return a.j[a.j.length - 1].isConstructor
}
function Yc(a, b) {
    return b[0] === Ba ? Wc(a, b[1]) : a.v(b[0], b[1])
}
function Zc(a, b, c) {
    return b[0] === Ba ? Xc(a, b[1], c) : a.setProperty(b[0], b[1], c)
}
function J(a, b, c) {
    void 0 !== c && (b = a.pa(b),
    a.setProperty(b, "message", c, A));
    $c(a, 4, b, void 0);
    throw Aa;
}
function $c(a, b, c, d) {
    if (0 === b)
        throw TypeError("Should not unwind for NORMAL completions");
    var f = a.j;
    a: for (; 0 < f.length; f.pop()) {
        var h = f[f.length - 1];
        switch (h.node.type) {
        case "TryStatement":
            h.U = {
                type: b,
                value: c,
                label: d
            };
            return;
        case "CallExpression":
        case "NewExpression":
            if (3 === b) {
                h.value = c;
                return
            }
            if (4 !== b)
                throw Error("Unsynatctic break/continue not rejected by Acorn");
            break;
        case "Program":
            h.done = !0;
            break a
        }
        if (1 === b) {
            if (d ? h.labels && -1 !== h.labels.indexOf(d) : h.P || h.Hb) {
                f.pop();
                return
            }
        } else if (2 === b && (d ? h.labels && -1 !== h.labels.indexOf(d) : h.P))
            return
    }
    T(a, c, a.w) ? (b = {
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError
    },
    d = String(a.v(c, "name")),
    a = a.v(c, "message").valueOf(),
    a = (b[d] || Error)(a)) : a = String(c);
    throw a;
}
function ad(a, b, c) {
    c = Array.isArray(c) ? c[0] : c;
    var d = new a.Ra({
        options: {}
    });
    d.type = "CallExpression";
    a = new y(d,a.j[a.j.length - 1].scope);
    a.ja = !0;
    a.J = c;
    a.Z = b;
    a.Oa = !0;
    a.B = [];
    return a
}
function bd(a, b, c, d) {
    c = Array.isArray(c) ? c[0] : a.global;
    var f = new a.Ra({
        options: {}
    });
    f.type = "CallExpression";
    a = new y(f,a.j[a.j.length - 1].scope);
    a.ja = !0;
    a.J = c;
    a.Z = b;
    a.Oa = !0;
    a.B = [d];
    return a
}
function y(a, b) {
    this.node = a;
    this.scope = b
}
u.prototype.stepArrayExpression = function(a, b, c) {
    c = c.elements;
    var d = b.s || 0;
    for (b.Ba ? (this.setProperty(b.Ba, d, b.value),
    d++) : (b.Ba = this.g(this.ea),
    b.Ba.a.length = c.length); d < c.length; ) {
        if (c[d])
            return b.s = d,
            new y(c[d],b.scope);
        d++
    }
    a.pop();
    a[a.length - 1].value = b.Ba
}
;
u.prototype.stepAssignmentExpression = function(a, b, c) {
    if (!b.Y)
        return b.Y = !0,
        b = new y(c.left,b.scope),
        b.ia = !0,
        b;
    if (!b.sa) {
        b.ua || (b.ua = b.value);
        b.qa && (b.$ = b.value);
        if (!b.qa && "=" !== c.operator && (a = Yc(this, b.ua),
        (b.$ = a) && "object" === typeof a && a.L))
            return a.L = !1,
            b.qa = !0,
            ad(this, a, b.ua);
        b.sa = !0;
        return new y(c.right,b.scope)
    }
    if (b.ka)
        a.pop(),
        a[a.length - 1].value = b.Ua;
    else {
        var d = b.$
          , f = b.value;
        switch (c.operator) {
        case "=":
            d = f;
            break;
        case "+=":
            d += f;
            break;
        case "-=":
            d -= f;
            break;
        case "*=":
            d *= f;
            break;
        case "/=":
            d /= f;
            break;
        case "%=":
            d %= f;
            break;
        case "<<=":
            d <<= f;
            break;
        case ">>=":
            d >>= f;
            break;
        case ">>>=":
            d >>>= f;
            break;
        case "&=":
            d &= f;
            break;
        case "^=":
            d ^= f;
            break;
        case "|=":
            d |= f;
            break;
        default:
            throw SyntaxError("Unknown assignment expression: " + c.operator);
        }
        if (c = Zc(this, b.ua, d))
            return b.ka = !0,
            b.Ua = d,
            bd(this, c, b.ua, d);
        a.pop();
        a[a.length - 1].value = d
    }
}
;
u.prototype.stepBinaryExpression = function(a, b, c) {
    if (!b.Y)
        return b.Y = !0,
        new y(c.left,b.scope);
    if (!b.sa)
        return b.sa = !0,
        b.$ = b.value,
        new y(c.right,b.scope);
    a.pop();
    var d = b.$;
    b = b.value;
    switch (c.operator) {
    case "==":
        c = d == b;
        break;
    case "!=":
        c = d != b;
        break;
    case "===":
        c = d === b;
        break;
    case "!==":
        c = d !== b;
        break;
    case ">":
        c = d > b;
        break;
    case ">=":
        c = d >= b;
        break;
    case "<":
        c = d < b;
        break;
    case "<=":
        c = d <= b;
        break;
    case "+":
        c = d + b;
        break;
    case "-":
        c = d - b;
        break;
    case "*":
        c = d * b;
        break;
    case "/":
        c = d / b;
        break;
    case "%":
        c = d % b;
        break;
    case "&":
        c = d & b;
        break;
    case "|":
        c = d | b;
        break;
    case "^":
        c = d ^ b;
        break;
    case "<<":
        c = d << b;
        break;
    case ">>":
        c = d >> b;
        break;
    case ">>>":
        c = d >>> b;
        break;
    case "in":
        b && b.o || J(this, this.h, "'in' expects an object, not '" + b + "'");
        c = xc(this, b, d);
        break;
    case "instanceof":
        T(this, b, this.C) || J(this, this.h, "Right-hand side of instanceof is not an object");
        c = d.o ? T(this, d, b) : !1;
        break;
    default:
        throw SyntaxError("Unknown binary operator: " + c.operator);
    }
    a[a.length - 1].value = c
}
;
u.prototype.stepBlockStatement = function(a, b, c) {
    var d = b.s || 0;
    if (c = c.body[d])
        return b.s = d + 1,
        new y(c,b.scope);
    a.pop()
}
;
u.prototype.stepBreakStatement = function(a, b, c) {
    $c(this, 1, void 0, c.label && c.label.name)
}
;
u.prototype.stepCallExpression = function(a, b, c) {
    if (!b.ja) {
        b.ja = 1;
        var d = new y(c.callee,b.scope);
        d.ia = !0;
        return d
    }
    if (1 === b.ja) {
        b.ja = 2;
        d = b.value;
        if (Array.isArray(d)) {
            if (b.Z = Yc(this, d),
            d[0] === Ba ? b.wb = "eval" === d[1] : b.J = d[0],
            (d = b.Z) && "object" === typeof d && d.L)
                return d.L = !1,
                b.ja = 1,
                ad(this, d, b.value)
        } else
            b.Z = d;
        b.B = [];
        b.s = 0
    }
    d = b.Z;
    if (!b.Oa) {
        0 !== b.s && b.B.push(b.value);
        if (c.arguments[b.s])
            return new y(c.arguments[b.s++],b.scope);
        if ("NewExpression" === c.type) {
            d.Fb && J(this, this.h, d + " is not a constructor");
            var f = d.a.prototype;
            if ("object" !== typeof f || null === f)
                f = this.G;
            b.J = this.g(f);
            b.isConstructor = !0
        } else
            void 0 === b.J && (b.J = b.scope.H ? void 0 : this.global);
        b.Oa = !0
    }
    if (b.Pa)
        a.pop(),
        a[a.length - 1].value = b.isConstructor && "object" !== typeof b.value ? b.J : b.value;
    else {
        b.Pa = !0;
        d && d.o || J(this, this.h, d + " is not a function");
        if (a = d.node) {
            c = ia(this, a.body, d.ca);
            for (var h = 0; h < a.params.length; h++)
                this.setProperty(c, a.params[h].name, b.B.length > h ? b.B[h] : void 0);
            f = this.g(this.ea);
            for (h = 0; h < b.B.length; h++)
                this.setProperty(f, h, b.B[h]);
            this.setProperty(c, "arguments", f);
            (h = a.id && a.id.name) && this.setProperty(c, h, d);
            this.setProperty(c, "this", b.J, sa);
            b.value = void 0;
            return new y(a.body,c)
        }
        if (d.eval)
            if (d = b.B[0],
            "string" !== typeof d)
                b.value = d;
            else {
                try {
                    h = acorn.parse(String(d), ha)
                } catch (q) {
                    J(this, this.fa, "Invalid code: " + q.message)
                }
                d = new this.Ra({
                    options: {}
                });
                d.type = "EvalProgram_";
                d.body = h.body;
                ra(this, d, c.start, c.end);
                c = b.wb ? b.scope : this.global;
                c.H ? c = ia(this, h, c) : Ma(this, h, c);
                this.value = void 0;
                return new y(d,c)
            }
        else if (d.xa)
            b.value = d.xa.apply(b.J, b.B);
        else if (d.Ka) {
            var n = this;
            h = d.Ka.length - 1;
            h = b.B.concat(Array(h)).slice(0, h);
            h.push(function(q) {
                b.value = q;
                n.ya = !1
            });
            this.ya = !0;
            d.Ka.apply(b.J, h)
        } else
            J(this, this.h, d.K + " is not a function")
    }
}
;
u.prototype.stepCatchClause = function(a, b, c) {
    if (b.N)
        a.pop();
    else
        return b.N = !0,
        a = Vc(this, b.scope),
        this.setProperty(a, c.param.name, b.Ob),
        new y(c.body,a)
}
;
u.prototype.stepConditionalExpression = function(a, b, c) {
    var d = b.ba || 0;
    if (0 === d)
        return b.ba = 1,
        new y(c.test,b.scope);
    if (1 === d) {
        b.ba = 2;
        if ((d = !!b.value) && c.consequent)
            return new y(c.consequent,b.scope);
        if (!d && c.alternate)
            return new y(c.alternate,b.scope);
        this.value = void 0
    }
    a.pop();
    "ConditionalExpression" === c.type && (a[a.length - 1].value = b.value)
}
;
u.prototype.stepContinueStatement = function(a, b, c) {
    $c(this, 2, void 0, c.label && c.label.name)
}
;
u.prototype.stepDebuggerStatement = function(a) {
    a.pop()
}
;
u.prototype.stepDoWhileStatement = function(a, b, c) {
    "DoWhileStatement" === c.type && void 0 === b.W && (b.value = !0,
    b.W = !0);
    if (!b.W)
        return b.W = !0,
        new y(c.test,b.scope);
    if (!b.value)
        a.pop();
    else if (c.body)
        return b.W = !1,
        b.P = !0,
        new y(c.body,b.scope)
}
;
u.prototype.stepEmptyStatement = function(a) {
    a.pop()
}
;
u.prototype.stepEvalProgram_ = function(a, b, c) {
    var d = b.s || 0;
    if (c = c.body[d])
        return b.s = d + 1,
        new y(c,b.scope);
    a.pop();
    a[a.length - 1].value = this.value
}
;
u.prototype.stepExpressionStatement = function(a, b, c) {
    if (!b.N)
        return b.N = !0,
        new y(c.expression,b.scope);
    a.pop();
    this.value = b.value
}
;
u.prototype.stepForInStatement = function(a, b, c) {
    if (!b.Bb && (b.Bb = !0,
    c.left.declarations && c.left.declarations[0].init))
        return b.scope.H && J(this, this.fa, "for-in loop variable declaration may not have an initializer."),
        new y(c.left,b.scope);
    if (!b.ra)
        return b.ra = !0,
        b.da || (b.da = b.value),
        new y(c.right,b.scope);
    b.P || (b.P = !0,
    b.i = b.value,
    b.Va = Object.create(null));
    if (void 0 === b.Ea)
        a: for (; ; ) {
            if (b.i && b.i.o)
                for (b.na || (b.na = Object.getOwnPropertyNames(b.i.a)); ; ) {
                    var d = b.na.shift();
                    if (void 0 === d)
                        break;
                    if (Object.prototype.hasOwnProperty.call(b.i.a, d) && !b.Va[d] && (b.Va[d] = !0,
                    Object.prototype.propertyIsEnumerable.call(b.i.a, d))) {
                        b.Ea = d;
                        break a
                    }
                }
            else if (null !== b.i && void 0 !== b.i)
                for (b.na || (b.na = Object.getOwnPropertyNames(b.i)); ; ) {
                    d = b.na.shift();
                    if (void 0 === d)
                        break;
                    b.Va[d] = !0;
                    if (Object.prototype.propertyIsEnumerable.call(b.i, d)) {
                        b.Ea = d;
                        break a
                    }
                }
            b.i = uc(this, b.i);
            b.na = null;
            if (null === b.i) {
                a.pop();
                return
            }
        }
    if (!b.fb)
        if (b.fb = !0,
        a = c.left,
        "VariableDeclaration" === a.type)
            b.da = [Ba, a.declarations[0].id.name];
        else
            return b.da = null,
            b = new y(a,b.scope),
            b.ia = !0,
            b;
    b.da || (b.da = b.value);
    if (!b.ka && (b.ka = !0,
    a = b.Ea,
    d = Zc(this, b.da, a)))
        return bd(this, d, b.da, a);
    b.Ea = void 0;
    b.fb = !1;
    b.ka = !1;
    if (c.body)
        return new y(c.body,b.scope)
}
;
u.prototype.stepForStatement = function(a, b, c) {
    var d = b.ba || 0;
    if (0 === d) {
        if (b.ba = 1,
        c.init)
            return new y(c.init,b.scope)
    } else if (1 === d) {
        if (b.ba = 2,
        c.test)
            return new y(c.test,b.scope)
    } else if (2 === d)
        if (b.ba = 3,
        c.test && !b.value)
            a.pop();
        else
            return b.P = !0,
            new y(c.body,b.scope);
    else if (3 === d && (b.ba = 1,
    c.update))
        return new y(c.update,b.scope)
}
;
u.prototype.stepFunctionDeclaration = function(a) {
    a.pop()
}
;
u.prototype.stepFunctionExpression = function(a, b, c) {
    a.pop();
    a[a.length - 1].value = Uc(this, c, b.scope)
}
;
u.prototype.stepIdentifier = function(a, b, c) {
    a.pop();
    if (b.ia)
        a[a.length - 1].value = [Ba, c.name];
    else {
        var d = Wc(this, c.name);
        if (d && "object" === typeof d && d.L) {
            d.L = !1;
            for (a = b.scope; !xc(this, a, c.name); )
                a = a.ca;
            return ad(this, d, this.global)
        }
        a[a.length - 1].value = d
    }
}
;
u.prototype.stepIfStatement = u.prototype.stepConditionalExpression;
u.prototype.stepLabeledStatement = function(a, b, c) {
    a.pop();
    a = b.labels || [];
    a.push(c.label.name);
    b = new y(c.body,b.scope);
    b.labels = a;
    return b
}
;
u.prototype.stepLiteral = function(a, b, c) {
    a.pop();
    b = c.value;
    b instanceof RegExp && (c = this.g(this.Aa),
    Sc(this, c, b),
    b = c);
    a[a.length - 1].value = b
}
;
u.prototype.stepLogicalExpression = function(a, b, c) {
    if ("&&" !== c.operator && "||" !== c.operator)
        throw SyntaxError("Unknown logical operator: " + c.operator);
    if (!b.Y)
        return b.Y = !0,
        new y(c.left,b.scope);
    if (b.sa)
        a.pop(),
        a[a.length - 1].value = b.value;
    else if ("&&" === c.operator && !b.value || "||" === c.operator && b.value)
        a.pop(),
        a[a.length - 1].value = b.value;
    else
        return b.sa = !0,
        new y(c.right,b.scope)
}
;
u.prototype.stepMemberExpression = function(a, b, c) {
    if (!b.ra)
        return b.ra = !0,
        new y(c.object,b.scope);
    if (c.computed)
        if (b.Cb)
            c = b.value;
        else
            return b.i = b.value,
            b.Cb = !0,
            new y(c.property,b.scope);
    else
        b.i = b.value,
        c = c.property.name;
    a.pop();
    if (b.ia)
        a[a.length - 1].value = [b.i, c];
    else {
        if ((c = this.v(b.i, c)) && "object" === typeof c && c.L)
            return c.L = !1,
            ad(this, c, b.i);
        a[a.length - 1].value = c
    }
}
;
u.prototype.stepNewExpression = u.prototype.stepCallExpression;
u.prototype.stepObjectExpression = function(a, b, c) {
    var d = b.s || 0
      , f = c.properties[d];
    if (b.i) {
        var h = f.key;
        if ("Identifier" === h.type)
            var n = h.name;
        else if ("Literal" === h.type)
            n = h.value;
        else
            throw SyntaxError("Unknown object structure: " + h.type);
        b.za[n] || (b.za[n] = {});
        b.za[n][f.kind] = b.value;
        b.s = ++d;
        f = c.properties[d]
    } else
        b.i = this.g(this.G),
        b.za = Object.create(null);
    if (f)
        return new y(f.value,b.scope);
    for (h in b.za)
        c = b.za[h],
        "get"in c || "set"in c ? this.setProperty(b.i, h, Ha, {
            configurable: !0,
            enumerable: !0,
            get: c.get,
            set: c.set
        }) : this.setProperty(b.i, h, c.init);
    a.pop();
    a[a.length - 1].value = b.i
}
;
u.prototype.stepProgram = function(a, b, c) {
    if (a = c.body.shift())
        return b.done = !1,
        new y(a,b.scope);
    b.done = !0
}
;
u.prototype.stepReturnStatement = function(a, b, c) {
    if (c.argument && !b.N)
        return b.N = !0,
        new y(c.argument,b.scope);
    $c(this, 3, b.value, void 0)
}
;
u.prototype.stepSequenceExpression = function(a, b, c) {
    var d = b.s || 0;
    if (c = c.expressions[d])
        return b.s = d + 1,
        new y(c,b.scope);
    a.pop();
    a[a.length - 1].value = b.value
}
;
u.prototype.stepSwitchStatement = function(a, b, c) {
    if (!b.W)
        return b.W = 1,
        new y(c.discriminant,b.scope);
    for (1 === b.W && (b.W = 2,
    b.Nb = b.value,
    b.Na = -1); ; ) {
        var d = b.Qa || 0
          , f = c.cases[d];
        if (b.wa || !f || f.test)
            if (f || b.wa || -1 === b.Na)
                if (f) {
                    if (!b.wa && !b.ob && f.test)
                        return b.ob = !0,
                        new y(f.test,b.scope);
                    if (b.wa || b.value === b.Nb) {
                        b.wa = !0;
                        var h = b.s || 0;
                        if (f.consequent[h])
                            return b.Hb = !0,
                            b.s = h + 1,
                            new y(f.consequent[h],b.scope)
                    }
                    b.ob = !1;
                    b.s = 0;
                    b.Qa = d + 1
                } else {
                    a.pop();
                    break
                }
            else
                b.wa = !0,
                b.Qa = b.Na;
        else
            b.Na = d,
            b.Qa = d + 1
    }
}
;
u.prototype.stepThisExpression = function(a) {
    a.pop();
    a[a.length - 1].value = Wc(this, "this")
}
;
u.prototype.stepThrowStatement = function(a, b, c) {
    if (b.N)
        J(this, b.value);
    else
        return b.N = !0,
        new y(c.argument,b.scope)
}
;
u.prototype.stepTryStatement = function(a, b, c) {
    if (!b.xb)
        return b.xb = !0,
        new y(c.block,b.scope);
    if (b.U && 4 === b.U.type && !b.Ab && c.handler)
        return b.Ab = !0,
        a = new y(c.handler,b.scope),
        a.Ob = b.U.value,
        b.U = void 0,
        a;
    if (!b.zb && c.finalizer)
        return b.zb = !0,
        new y(c.finalizer,b.scope);
    a.pop();
    b.U && $c(this, b.U.type, b.U.value, b.U.label)
}
;
u.prototype.stepUnaryExpression = function(a, b, c) {
    if (!b.N)
        return b.N = !0,
        a = new y(c.argument,b.scope),
        a.ia = "delete" === c.operator,
        a;
    a.pop();
    var d = b.value;
    if ("-" === c.operator)
        d = -d;
    else if ("+" === c.operator)
        d = +d;
    else if ("!" === c.operator)
        d = !d;
    else if ("~" === c.operator)
        d = ~d;
    else if ("delete" === c.operator) {
        c = !0;
        if (Array.isArray(d)) {
            var f = d[0];
            f === Ba && (f = b.scope);
            d = String(d[1]);
            try {
                delete f.a[d]
            } catch (h) {
                b.scope.H ? J(this, this.h, "Cannot delete property '" + d + "' of '" + f + "'") : c = !1
            }
        }
        d = c
    } else if ("typeof" === c.operator)
        d = d && "Function" === d.K ? "function" : typeof d;
    else if ("void" === c.operator)
        d = void 0;
    else
        throw SyntaxError("Unknown unary operator: " + c.operator);
    a[a.length - 1].value = d
}
;
u.prototype.stepUpdateExpression = function(a, b, c) {
    if (!b.Y)
        return b.Y = !0,
        a = new y(c.argument,b.scope),
        a.ia = !0,
        a;
    b.va || (b.va = b.value);
    b.qa && (b.$ = b.value);
    if (!b.qa) {
        var d = Yc(this, b.va);
        if ((b.$ = d) && "object" === typeof d && d.L)
            return d.L = !1,
            b.qa = !0,
            ad(this, d, b.va)
    }
    if (b.ka)
        a.pop(),
        a[a.length - 1].value = b.Ua;
    else {
        d = Number(b.$);
        if ("++" === c.operator)
            var f = d + 1;
        else if ("--" === c.operator)
            f = d - 1;
        else
            throw SyntaxError("Unknown update expression: " + c.operator);
        c = c.prefix ? f : d;
        if (d = Zc(this, b.va, f))
            return b.ka = !0,
            b.Ua = c,
            bd(this, d, b.va, f);
        a.pop();
        a[a.length - 1].value = c
    }
}
;
u.prototype.stepVariableDeclaration = function(a, b, c) {
    c = c.declarations;
    var d = b.s || 0
      , f = c[d];
    for (b.jb && f && (Xc(this, f.id.name, b.value),
    b.jb = !1,
    f = c[++d]); f; ) {
        if (f.init)
            return b.s = d,
            b.jb = !0,
            new y(f.init,b.scope);
        f = c[++d]
    }
    a.pop()
}
;
u.prototype.stepWithStatement = function(a, b, c) {
    if (b.ra)
        if (b.yb)
            a.pop();
        else
            return b.yb = !0,
            a = Vc(this, b.scope, b.value),
            new y(c.body,a);
    else
        return b.ra = !0,
        new y(c.object,b.scope)
}
;
u.prototype.stepWhileStatement = u.prototype.stepDoWhileStatement;
this.Interpreter = u;
u.prototype.step = u.prototype.step;
u.prototype.run = u.prototype.lb;
u.prototype.appendCode = u.prototype.sb;
u.prototype.createObject = u.prototype.pa;
u.prototype.createObjectProto = u.prototype.g;
u.prototype.createAsyncFunction = u.prototype.bb;
u.prototype.createNativeFunction = u.prototype.b;
u.prototype.getProperty = u.prototype.v;
u.prototype.setProperty = u.prototype.setProperty;
u.prototype.nativeToPseudo = u.prototype.la;
u.prototype.pseudoToNative = u.prototype.M;
u.prototype.createPrimitive = function(a) {
    return a
}
;
