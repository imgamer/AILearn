//# sourceMappingURL=xterm.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
};
!function(Bb, ja) {
    if ("object" == typeof exports && "object" == typeof module)
        module.exports = ja();
    else if ("function" == typeof define && define.amd)
        define([], ja);
    else {
        ja = ja();
        for (var A in ja)
            ("object" == typeof exports ? exports : Bb)[A] = ja[A]
    }
}(self, function() {
    return ( () => {
        var Bb = {
            4567: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(c, a) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(b, e) {
                        b.__proto__ = e
                    }
                    || function(b, e) {
                        for (var f in e)
                            Object.prototype.hasOwnProperty.call(e, f) && (b[f] = e[f])
                    }
                    ,
                    h(c, a)
                }
                ,
                function(c, a) {
                    function b() {
                        this.constructor = c
                    }
                    if ("function" != typeof a && null !== a)
                        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
                    h(c, a);
                    c.prototype = null === a ? Object.create(a) : (b.prototype = a.prototype,
                    new b)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.AccessibilityManager = void 0;
                var p = q(9042)
                  , t = q(6114)
                  , n = q(9924)
                  , g = q(3656);
                A = q(844);
                var k = q(5596)
                  , d = q(9631);
                q = function(c) {
                    function a(b, e) {
                        var f = c.call(this) || this;
                        f._terminal = b;
                        f._renderService = e;
                        f._liveRegionLineCount = 0;
                        f._charsToConsume = [];
                        f._charsToAnnounce = "";
                        f._accessibilityTreeRoot = document.createElement("div");
                        f._accessibilityTreeRoot.setAttribute("role", "document");
                        f._accessibilityTreeRoot.classList.add("xterm-accessibility");
                        f._accessibilityTreeRoot.tabIndex = 0;
                        f._rowContainer = document.createElement("div");
                        f._rowContainer.setAttribute("role", "list");
                        f._rowContainer.classList.add("xterm-accessibility-tree");
                        f._rowElements = [];
                        for (b = 0; b < f._terminal.rows; b++)
                            f._rowElements[b] = f._createAccessibilityTreeNode(),
                            f._rowContainer.appendChild(f._rowElements[b]);
                        if (f._topBoundaryFocusListener = function(m) {
                            return f._onBoundaryFocus(m, 0)
                        }
                        ,
                        f._bottomBoundaryFocusListener = function(m) {
                            return f._onBoundaryFocus(m, 1)
                        }
                        ,
                        f._rowElements[0].addEventListener("focus", f._topBoundaryFocusListener),
                        f._rowElements[f._rowElements.length - 1].addEventListener("focus", f._bottomBoundaryFocusListener),
                        f._refreshRowsDimensions(),
                        f._accessibilityTreeRoot.appendChild(f._rowContainer),
                        f._renderRowsDebouncer = new n.TimeBasedDebouncer(f._renderRows.bind(f)),
                        f._refreshRows(),
                        f._liveRegion = document.createElement("div"),
                        f._liveRegion.classList.add("live-region"),
                        f._liveRegion.setAttribute("aria-live", "assertive"),
                        f._accessibilityTreeRoot.appendChild(f._liveRegion),
                        !f._terminal.element)
                            throw Error("Cannot enable accessibility before Terminal.open");
                        return f._terminal.element.insertAdjacentElement("afterbegin", f._accessibilityTreeRoot),
                        f.register(f._renderRowsDebouncer),
                        f.register(f._terminal.onResize(function(m) {
                            return f._onResize(m.rows)
                        })),
                        f.register(f._terminal.onRender(function(m) {
                            return f._refreshRows(m.start, m.end)
                        })),
                        f.register(f._terminal.onScroll(function() {
                            return f._refreshRows()
                        })),
                        f.register(f._terminal.onA11yChar(function(m) {
                            return f._onChar(m)
                        })),
                        f.register(f._terminal.onLineFeed(function() {
                            return f._onChar("\n")
                        })),
                        f.register(f._terminal.onA11yTab(function(m) {
                            return f._onTab(m)
                        })),
                        f.register(f._terminal.onKey(function(m) {
                            return f._onKey(m.key)
                        })),
                        f.register(f._terminal.onBlur(function() {
                            return f._clearLiveRegion()
                        })),
                        f.register(f._renderService.onDimensionsChange(function() {
                            return f._refreshRowsDimensions()
                        })),
                        f._screenDprMonitor = new k.ScreenDprMonitor,
                        f.register(f._screenDprMonitor),
                        f._screenDprMonitor.setListener(function() {
                            return f._refreshRowsDimensions()
                        }),
                        f.register((0,
                        g.addDisposableDomListener)(window, "resize", function() {
                            return f._refreshRowsDimensions()
                        })),
                        f
                    }
                    return v(a, c),
                    a.prototype.dispose = function() {
                        c.prototype.dispose.call(this);
                        (0,
                        d.removeElementFromParent)(this._accessibilityTreeRoot);
                        this._rowElements.length = 0
                    }
                    ,
                    a.prototype._onBoundaryFocus = function(b, e) {
                        var f = b.target
                          , m = this._rowElements[0 === e ? 1 : this._rowElements.length - 2];
                        if (f.getAttribute("aria-posinset") !== (0 === e ? "1" : "" + this._terminal.buffer.lines.length) && b.relatedTarget === m) {
                            var u, w;
                            (0 === e ? (u = f,
                            w = this._rowElements.pop(),
                            this._rowContainer.removeChild(w)) : (u = this._rowElements.shift(),
                            w = f,
                            this._rowContainer.removeChild(u)),
                            u.removeEventListener("focus", this._topBoundaryFocusListener),
                            w.removeEventListener("focus", this._bottomBoundaryFocusListener),
                            0 === e) ? (f = this._createAccessibilityTreeNode(),
                            this._rowElements.unshift(f),
                            this._rowContainer.insertAdjacentElement("afterbegin", f)) : (f = this._createAccessibilityTreeNode(),
                            this._rowElements.push(f),
                            this._rowContainer.appendChild(f));
                            this._rowElements[0].addEventListener("focus", this._topBoundaryFocusListener);
                            this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener);
                            this._terminal.scrollLines(0 === e ? -1 : 1);
                            this._rowElements[0 === e ? 1 : this._rowElements.length - 2].focus();
                            b.preventDefault();
                            b.stopImmediatePropagation()
                        }
                    }
                    ,
                    a.prototype._onResize = function(b) {
                        this._rowElements[this._rowElements.length - 1].removeEventListener("focus", this._bottomBoundaryFocusListener);
                        for (var e = this._rowContainer.children.length; e < this._terminal.rows; e++)
                            this._rowElements[e] = this._createAccessibilityTreeNode(),
                            this._rowContainer.appendChild(this._rowElements[e]);
                        for (; this._rowElements.length > b; )
                            this._rowContainer.removeChild(this._rowElements.pop());
                        this._rowElements[this._rowElements.length - 1].addEventListener("focus", this._bottomBoundaryFocusListener);
                        this._refreshRowsDimensions()
                    }
                    ,
                    a.prototype._createAccessibilityTreeNode = function() {
                        var b = document.createElement("div");
                        return b.setAttribute("role", "listitem"),
                        b.tabIndex = -1,
                        this._refreshRowDimensions(b),
                        b
                    }
                    ,
                    a.prototype._onTab = function(b) {
                        for (var e = 0; e < b; e++)
                            this._onChar(" ")
                    }
                    ,
                    a.prototype._onChar = function(b) {
                        var e = this;
                        21 > this._liveRegionLineCount && (0 < this._charsToConsume.length ? this._charsToConsume.shift() !== b && (this._charsToAnnounce += b) : this._charsToAnnounce += b,
                        "\n" === b && (this._liveRegionLineCount++,
                        21 === this._liveRegionLineCount && (this._liveRegion.textContent += p.tooMuchOutput)),
                        t.isMac && this._liveRegion.textContent && 0 < this._liveRegion.textContent.length && !this._liveRegion.parentNode && setTimeout(function() {
                            e._accessibilityTreeRoot.appendChild(e._liveRegion)
                        }, 0))
                    }
                    ,
                    a.prototype._clearLiveRegion = function() {
                        this._liveRegion.textContent = "";
                        this._liveRegionLineCount = 0;
                        t.isMac && (0,
                        d.removeElementFromParent)(this._liveRegion)
                    }
                    ,
                    a.prototype._onKey = function(b) {
                        this._clearLiveRegion();
                        this._charsToConsume.push(b)
                    }
                    ,
                    a.prototype._refreshRows = function(b, e) {
                        this._renderRowsDebouncer.refresh(b, e, this._terminal.rows)
                    }
                    ,
                    a.prototype._renderRows = function(b, e) {
                        for (var f = this._terminal.buffer, m = f.lines.length.toString(); b <= e; b++) {
                            var u = f.translateBufferLineToString(f.ydisp + b, !0)
                              , w = (f.ydisp + b + 1).toString()
                              , r = this._rowElements[b];
                            r && (0 === u.length ? r.innerText = "\u00a0" : r.textContent = u,
                            r.setAttribute("aria-posinset", w),
                            r.setAttribute("aria-setsize", m))
                        }
                        this._announceCharacters()
                    }
                    ,
                    a.prototype._refreshRowsDimensions = function() {
                        if (this._renderService.dimensions.actualCellHeight) {
                            this._rowElements.length !== this._terminal.rows && this._onResize(this._terminal.rows);
                            for (var b = 0; b < this._terminal.rows; b++)
                                this._refreshRowDimensions(this._rowElements[b])
                        }
                    }
                    ,
                    a.prototype._refreshRowDimensions = function(b) {
                        b.style.height = this._renderService.dimensions.actualCellHeight + "px"
                    }
                    ,
                    a.prototype._announceCharacters = function() {
                        0 !== this._charsToAnnounce.length && (this._liveRegion.textContent += this._charsToAnnounce,
                        this._charsToAnnounce = "")
                    }
                    ,
                    a
                }(A.Disposable);
                l.AccessibilityManager = q
            },
            3614: (A, l) => {
                function q(t) {
                    return t.replace(/\r?\n/g, "\r")
                }
                function h(t, n) {
                    return n ? "\u001b[200~" + t + "\u001b[201~" : t
                }
                function v(t, n, g) {
                    t = h(t = q(t), g.decPrivateModes.bracketedPasteMode);
                    g.triggerDataEvent(t, !0);
                    n.value = ""
                }
                function p(t, n, g) {
                    var k = g.getBoundingClientRect();
                    g = t.clientX - k.left - 10;
                    t = t.clientY - k.top - 10;
                    n.style.width = "20px";
                    n.style.height = "20px";
                    n.style.left = g + "px";
                    n.style.top = t + "px";
                    n.style.zIndex = "1000";
                    n.focus()
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.rightClickHandler = l.moveTextAreaUnderMouseCursor = l.paste = l.handlePasteEvent = l.copyHandler = l.bracketTextForPaste = l.prepareTextForTerminal = void 0;
                l.prepareTextForTerminal = q;
                l.bracketTextForPaste = h;
                l.copyHandler = function(t, n) {
                    t.clipboardData && t.clipboardData.setData("text/plain", n.selectionText);
                    t.preventDefault()
                }
                ;
                l.handlePasteEvent = function(t, n, g) {
                    t.stopPropagation();
                    t.clipboardData && v(t.clipboardData.getData("text/plain"), n, g)
                }
                ;
                l.paste = v;
                l.moveTextAreaUnderMouseCursor = p;
                l.rightClickHandler = function(t, n, g, k, d) {
                    p(t, n, g);
                    d && k.rightClickSelect(t);
                    n.value = k.selectionText;
                    n.select()
                }
            }
            ,
            4774: (A, l) => {
                function q(n) {
                    n = n.toString(16);
                    return 2 > n.length ? "0" + n : n
                }
                function h(n, g) {
                    return n < g ? (g + .05) / (n + .05) : (n + .05) / (g + .05)
                }
                var v, p, t;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.contrastRatio = l.toPaddedHex = l.rgba = l.rgb = l.css = l.color = l.channels = void 0;
                (function(n) {
                    n.toCss = function(g, k, d, c) {
                        return void 0 !== c ? "#" + q(g) + q(k) + q(d) + q(c) : "#" + q(g) + q(k) + q(d)
                    }
                    ;
                    n.toRgba = function(g, k, d, c) {
                        return void 0 === c && (c = 255),
                        (g << 24 | k << 16 | d << 8 | c) >>> 0
                    }
                }
                )(v = l.channels || (l.channels = {}));
                (A = l.color || (l.color = {})).blend = function(n, g) {
                    var k = (255 & g.rgba) / 255;
                    if (1 === k)
                        return {
                            css: g.css,
                            rgba: g.rgba
                        };
                    var d = n.rgba >> 24 & 255
                      , c = n.rgba >> 16 & 255;
                    n = n.rgba >> 8 & 255;
                    d += Math.round(((g.rgba >> 24 & 255) - d) * k);
                    c += Math.round(((g.rgba >> 16 & 255) - c) * k);
                    g = n + Math.round(((g.rgba >> 8 & 255) - n) * k);
                    return {
                        css: v.toCss(d, c, g),
                        rgba: v.toRgba(d, c, g)
                    }
                }
                ;
                A.isOpaque = function(n) {
                    return 255 == (255 & n.rgba)
                }
                ;
                A.ensureContrastRatio = function(n, g, k) {
                    if (n = t.ensureContrastRatio(n.rgba, g.rgba, k))
                        return t.toColor(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255)
                }
                ;
                A.opaque = function(n) {
                    n = (255 | n.rgba) >>> 0;
                    var g = t.toChannels(n);
                    return {
                        css: v.toCss(g[0], g[1], g[2]),
                        rgba: n
                    }
                }
                ;
                A.opacity = function(n, g) {
                    g = Math.round(255 * g);
                    var k = t.toChannels(n.rgba);
                    n = k[0];
                    var d = k[1];
                    k = k[2];
                    return {
                        css: v.toCss(n, d, k, g),
                        rgba: v.toRgba(n, d, k, g)
                    }
                }
                ;
                A.toColorRGB = function(n) {
                    return [n.rgba >> 24 & 255, n.rgba >> 16 & 255, n.rgba >> 8 & 255]
                }
                ;
                (l.css || (l.css = {})).toColor = function(n) {
                    switch (n.length) {
                    case 7:
                        return {
                            css: n,
                            rgba: (parseInt(n.slice(1), 16) << 8 | 255) >>> 0
                        };
                    case 9:
                        return {
                            css: n,
                            rgba: parseInt(n.slice(1), 16) >>> 0
                        }
                    }
                    throw Error("css.toColor: Unsupported css format");
                }
                ;
                (function(n) {
                    function g(k, d, c) {
                        k /= 255;
                        d /= 255;
                        c /= 255;
                        return .2126 * (.03928 >= k ? k / 12.92 : Math.pow((k + .055) / 1.055, 2.4)) + .7152 * (.03928 >= d ? d / 12.92 : Math.pow((d + .055) / 1.055, 2.4)) + .0722 * (.03928 >= c ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4))
                    }
                    n.relativeLuminance = function(k) {
                        return g(k >> 16 & 255, k >> 8 & 255, 255 & k)
                    }
                    ;
                    n.relativeLuminance2 = g
                }
                )(p = l.rgb || (l.rgb = {}));
                (function(n) {
                    function g(d, c, a) {
                        var b = d >> 24 & 255
                          , e = d >> 16 & 255;
                        d = d >> 8 & 255;
                        var f = c >> 24 & 255
                          , m = c >> 16 & 255;
                        c = c >> 8 & 255;
                        for (var u = h(p.relativeLuminance2(f, c, m), p.relativeLuminance2(b, e, d)); u < a && (0 < f || 0 < m || 0 < c); )
                            f -= Math.max(0, Math.ceil(.1 * f)),
                            m -= Math.max(0, Math.ceil(.1 * m)),
                            c -= Math.max(0, Math.ceil(.1 * c)),
                            u = h(p.relativeLuminance2(f, c, m), p.relativeLuminance2(b, e, d));
                        return (f << 24 | m << 16 | c << 8 | 255) >>> 0
                    }
                    function k(d, c, a) {
                        var b = d >> 24 & 255
                          , e = d >> 16 & 255;
                        d = d >> 8 & 255;
                        var f = c >> 24 & 255
                          , m = c >> 16 & 255;
                        c = c >> 8 & 255;
                        for (var u = h(p.relativeLuminance2(f, c, m), p.relativeLuminance2(b, e, d)); u < a && (255 > f || 255 > m || 255 > c); )
                            f = Math.min(255, f + Math.ceil(.1 * (255 - f))),
                            m = Math.min(255, m + Math.ceil(.1 * (255 - m))),
                            c = Math.min(255, c + Math.ceil(.1 * (255 - c))),
                            u = h(p.relativeLuminance2(f, c, m), p.relativeLuminance2(b, e, d));
                        return (f << 24 | m << 16 | c << 8 | 255) >>> 0
                    }
                    n.ensureContrastRatio = function(d, c, a) {
                        var b = p.relativeLuminance(d >> 8)
                          , e = p.relativeLuminance(c >> 8);
                        if (h(b, e) < a)
                            return e < b ? g(d, c, a) : k(d, c, a)
                    }
                    ;
                    n.reduceLuminance = g;
                    n.increaseLuminance = k;
                    n.toChannels = function(d) {
                        return [d >> 24 & 255, d >> 16 & 255, d >> 8 & 255, 255 & d]
                    }
                    ;
                    n.toColor = function(d, c, a) {
                        return {
                            css: v.toCss(d, c, a),
                            rgba: v.toRgba(d, c, a)
                        }
                    }
                }
                )(t = l.rgba || (l.rgba = {}));
                l.toPaddedHex = q;
                l.contrastRatio = h
            }
            ,
            7239: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ColorContrastCache = void 0;
                A = function() {
                    function q() {
                        this._color = {};
                        this._rgba = {}
                    }
                    return q.prototype.clear = function() {
                        this._color = {};
                        this._rgba = {}
                    }
                    ,
                    q.prototype.setCss = function(h, v, p) {
                        this._rgba[h] || (this._rgba[h] = {});
                        this._rgba[h][v] = p
                    }
                    ,
                    q.prototype.getCss = function(h, v) {
                        return this._rgba[h] ? this._rgba[h][v] : void 0
                    }
                    ,
                    q.prototype.setColor = function(h, v, p) {
                        this._color[h] || (this._color[h] = {});
                        this._color[h][v] = p
                    }
                    ,
                    q.prototype.getColor = function(h, v) {
                        return this._color[h] ? this._color[h][v] : void 0
                    }
                    ,
                    q
                }();
                l.ColorContrastCache = A
            }
            ,
            5680: function(A, l, q) {
                var h = this && this.__spreadArray || function(c, a, b) {
                    if (b || 2 === arguments.length)
                        for (var e, f = 0, m = a.length; f < m; f++)
                            !e && f in a || (e || (e = Array.prototype.slice.call(a, 0, f)),
                            e[f] = a[f]);
                    return c.concat(e || Array.prototype.slice.call(a))
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ColorManager = l.DEFAULT_ANSI_COLORS = void 0;
                var v = q(4774)
                  , p = q(7239)
                  , t = v.css.toColor("#ffffff")
                  , n = v.css.toColor("#000000")
                  , g = v.css.toColor("#ffffff")
                  , k = v.css.toColor("#000000")
                  , d = {
                    css: "rgba(255, 255, 255, 0.3)",
                    rgba: 4294967117
                };
                l.DEFAULT_ANSI_COLORS = Object.freeze(function() {
                    for (var c = [v.css.toColor("#2e3436"), v.css.toColor("#cc0000"), v.css.toColor("#4e9a06"), v.css.toColor("#c4a000"), v.css.toColor("#3465a4"), v.css.toColor("#75507b"), v.css.toColor("#06989a"), v.css.toColor("#d3d7cf"), v.css.toColor("#555753"), v.css.toColor("#ef2929"), v.css.toColor("#8ae234"), v.css.toColor("#fce94f"), v.css.toColor("#729fcf"), v.css.toColor("#ad7fa8"), v.css.toColor("#34e2e2"), v.css.toColor("#eeeeec")], a = [0, 95, 135, 175, 215, 255], b = 0; 216 > b; b++) {
                        var e = a[b / 36 % 6 | 0]
                          , f = a[b / 6 % 6 | 0]
                          , m = a[b % 6];
                        c.push({
                            css: v.channels.toCss(e, f, m),
                            rgba: v.channels.toRgba(e, f, m)
                        })
                    }
                    for (b = 0; 24 > b; b++)
                        a = 8 + 10 * b,
                        c.push({
                            css: v.channels.toCss(a, a, a),
                            rgba: v.channels.toRgba(a, a, a)
                        });
                    return c
                }());
                A = function() {
                    function c(a, b) {
                        this.allowTransparency = b;
                        a = a.createElement("canvas");
                        a.width = 1;
                        a.height = 1;
                        a = a.getContext("2d");
                        if (!a)
                            throw Error("Could not get rendering context");
                        this._ctx = a;
                        this._ctx.globalCompositeOperation = "copy";
                        this._litmusColor = this._ctx.createLinearGradient(0, 0, 1, 1);
                        this._contrastCache = new p.ColorContrastCache;
                        this.colors = {
                            foreground: t,
                            background: n,
                            cursor: g,
                            cursorAccent: k,
                            selectionTransparent: d,
                            selectionOpaque: v.color.blend(n, d),
                            ansi: l.DEFAULT_ANSI_COLORS.slice(),
                            contrastCache: this._contrastCache
                        };
                        this._updateRestoreColors()
                    }
                    return c.prototype.onOptionsChange = function(a) {
                        "minimumContrastRatio" === a && this._contrastCache.clear()
                    }
                    ,
                    c.prototype.setTheme = function(a) {
                        void 0 === a && (a = {});
                        this.colors.foreground = this._parseColor(a.foreground, t);
                        this.colors.background = this._parseColor(a.background, n);
                        this.colors.cursor = this._parseColor(a.cursor, g, !0);
                        this.colors.cursorAccent = this._parseColor(a.cursorAccent, k, !0);
                        this.colors.selectionTransparent = this._parseColor(a.selection, d, !0);
                        this.colors.selectionOpaque = v.color.blend(this.colors.background, this.colors.selectionTransparent);
                        v.color.isOpaque(this.colors.selectionTransparent) && (this.colors.selectionTransparent = v.color.opacity(this.colors.selectionTransparent, .3));
                        this.colors.ansi[0] = this._parseColor(a.black, l.DEFAULT_ANSI_COLORS[0]);
                        this.colors.ansi[1] = this._parseColor(a.red, l.DEFAULT_ANSI_COLORS[1]);
                        this.colors.ansi[2] = this._parseColor(a.green, l.DEFAULT_ANSI_COLORS[2]);
                        this.colors.ansi[3] = this._parseColor(a.yellow, l.DEFAULT_ANSI_COLORS[3]);
                        this.colors.ansi[4] = this._parseColor(a.blue, l.DEFAULT_ANSI_COLORS[4]);
                        this.colors.ansi[5] = this._parseColor(a.magenta, l.DEFAULT_ANSI_COLORS[5]);
                        this.colors.ansi[6] = this._parseColor(a.cyan, l.DEFAULT_ANSI_COLORS[6]);
                        this.colors.ansi[7] = this._parseColor(a.white, l.DEFAULT_ANSI_COLORS[7]);
                        this.colors.ansi[8] = this._parseColor(a.brightBlack, l.DEFAULT_ANSI_COLORS[8]);
                        this.colors.ansi[9] = this._parseColor(a.brightRed, l.DEFAULT_ANSI_COLORS[9]);
                        this.colors.ansi[10] = this._parseColor(a.brightGreen, l.DEFAULT_ANSI_COLORS[10]);
                        this.colors.ansi[11] = this._parseColor(a.brightYellow, l.DEFAULT_ANSI_COLORS[11]);
                        this.colors.ansi[12] = this._parseColor(a.brightBlue, l.DEFAULT_ANSI_COLORS[12]);
                        this.colors.ansi[13] = this._parseColor(a.brightMagenta, l.DEFAULT_ANSI_COLORS[13]);
                        this.colors.ansi[14] = this._parseColor(a.brightCyan, l.DEFAULT_ANSI_COLORS[14]);
                        this.colors.ansi[15] = this._parseColor(a.brightWhite, l.DEFAULT_ANSI_COLORS[15]);
                        this._contrastCache.clear();
                        this._updateRestoreColors()
                    }
                    ,
                    c.prototype.restoreColor = function(a) {
                        if (void 0 !== a)
                            switch (a) {
                            case 256:
                                this.colors.foreground = this._restoreColors.foreground;
                                break;
                            case 257:
                                this.colors.background = this._restoreColors.background;
                                break;
                            case 258:
                                this.colors.cursor = this._restoreColors.cursor;
                                break;
                            default:
                                this.colors.ansi[a] = this._restoreColors.ansi[a]
                            }
                        else
                            for (a = 0; a < this._restoreColors.ansi.length; ++a)
                                this.colors.ansi[a] = this._restoreColors.ansi[a]
                    }
                    ,
                    c.prototype._updateRestoreColors = function() {
                        this._restoreColors = {
                            foreground: this.colors.foreground,
                            background: this.colors.background,
                            cursor: this.colors.cursor,
                            ansi: h([], this.colors.ansi, !0)
                        }
                    }
                    ,
                    c.prototype._parseColor = function(a, b, e) {
                        if (void 0 === e && (e = this.allowTransparency),
                        void 0 === a)
                            return b;
                        if (this._ctx.fillStyle = this._litmusColor,
                        this._ctx.fillStyle = a,
                        "string" != typeof this._ctx.fillStyle)
                            return console.warn("Color: " + a + " is invalid using fallback " + b.css),
                            b;
                        this._ctx.fillRect(0, 0, 1, 1);
                        var f = this._ctx.getImageData(0, 0, 1, 1).data;
                        if (255 !== f[3]) {
                            if (!e)
                                return console.warn("Color: " + a + " is using transparency, but allowTransparency is false. Using fallback " + b.css + "."),
                                b;
                            b = this._ctx.fillStyle.substring(5, this._ctx.fillStyle.length - 1).split(",").map(function(m) {
                                return Number(m)
                            });
                            return {
                                rgba: v.channels.toRgba(b[0], b[1], b[2], Math.round(255 * b[3])),
                                css: a
                            }
                        }
                        return {
                            css: this._ctx.fillStyle,
                            rgba: v.channels.toRgba(f[0], f[1], f[2], f[3])
                        }
                    }
                    ,
                    c
                }();
                l.ColorManager = A
            },
            9631: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.removeElementFromParent = void 0;
                l.removeElementFromParent = function() {
                    for (var q, h = [], v = 0; v < arguments.length; v++)
                        h[v] = arguments[v];
                    for (v = 0; v < h.length; v++) {
                        var p = h[v];
                        null === (q = null == p ? void 0 : p.parentElement) || void 0 === q || q.removeChild(p)
                    }
                }
            }
            ,
            3656: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.addDisposableDomListener = void 0;
                l.addDisposableDomListener = function(q, h, v, p) {
                    q.addEventListener(h, v, p);
                    var t = !1;
                    return {
                        dispose: function() {
                            t || (t = !0,
                            q.removeEventListener(h, v, p))
                        }
                    }
                }
            }
            ,
            3551: function(A, l, q) {
                var h = this && this.__decorate || function(g, k, d, c) {
                    var a, b = arguments.length, e = 3 > b ? k : null === c ? c = Object.getOwnPropertyDescriptor(k, d) : c;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        e = Reflect.decorate(g, k, d, c);
                    else
                        for (var f = g.length - 1; 0 <= f; f--)
                            (a = g[f]) && (e = (3 > b ? a(e) : 3 < b ? a(k, d, e) : a(k, d)) || e);
                    return 3 < b && e && Object.defineProperty(k, d, e),
                    e
                }
                  , v = this && this.__param || function(g, k) {
                    return function(d, c) {
                        k(d, c, g)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.MouseZone = l.Linkifier = void 0;
                var p = q(8460)
                  , t = q(2585);
                A = function() {
                    function g(k, d, c) {
                        this._bufferService = k;
                        this._logService = d;
                        this._unicodeService = c;
                        this._linkMatchers = [];
                        this._nextLinkMatcherId = 0;
                        this._onShowLinkUnderline = new p.EventEmitter;
                        this._onHideLinkUnderline = new p.EventEmitter;
                        this._onLinkTooltip = new p.EventEmitter;
                        this._rowsToLinkify = {
                            start: void 0,
                            end: void 0
                        }
                    }
                    return Object.defineProperty(g.prototype, "onShowLinkUnderline", {
                        get: function() {
                            return this._onShowLinkUnderline.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(g.prototype, "onHideLinkUnderline", {
                        get: function() {
                            return this._onHideLinkUnderline.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(g.prototype, "onLinkTooltip", {
                        get: function() {
                            return this._onLinkTooltip.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    g.prototype.attachToDom = function(k, d) {
                        this._element = k;
                        this._mouseZoneManager = d
                    }
                    ,
                    g.prototype.linkifyRows = function(k, d) {
                        var c = this;
                        this._mouseZoneManager && (void 0 === this._rowsToLinkify.start || void 0 === this._rowsToLinkify.end ? (this._rowsToLinkify.start = k,
                        this._rowsToLinkify.end = d) : (this._rowsToLinkify.start = Math.min(this._rowsToLinkify.start, k),
                        this._rowsToLinkify.end = Math.max(this._rowsToLinkify.end, d)),
                        this._mouseZoneManager.clearAll(k, d),
                        this._rowsTimeoutId && clearTimeout(this._rowsTimeoutId),
                        this._rowsTimeoutId = setTimeout(function() {
                            return c._linkifyRows()
                        }, g._timeBeforeLatency))
                    }
                    ,
                    g.prototype._linkifyRows = function() {
                        this._rowsTimeoutId = void 0;
                        var k = this._bufferService.buffer;
                        if (void 0 !== this._rowsToLinkify.start && void 0 !== this._rowsToLinkify.end) {
                            var d = k.ydisp + this._rowsToLinkify.start;
                            if (!(d >= k.lines.length)) {
                                var c = Math.ceil(2E3 / this._bufferService.cols);
                                for (k = this._bufferService.buffer.iterator(!1, d, k.ydisp + Math.min(this._rowsToLinkify.end, this._bufferService.rows) + 1, c, c); k.hasNext(); )
                                    for (d = k.next(),
                                    c = 0; c < this._linkMatchers.length; c++)
                                        this._doLinkifyRow(d.range.first, d.content, this._linkMatchers[c]);
                                this._rowsToLinkify.start = void 0;
                                this._rowsToLinkify.end = void 0
                            }
                        } else
                            this._logService.debug("_rowToLinkify was unset before _linkifyRows was called")
                    }
                    ,
                    g.prototype.registerLinkMatcher = function(k, d, c) {
                        if (void 0 === c && (c = {}),
                        !d)
                            throw Error("handler must be defined");
                        k = {
                            id: this._nextLinkMatcherId++,
                            regex: k,
                            handler: d,
                            matchIndex: c.matchIndex,
                            validationCallback: c.validationCallback,
                            hoverTooltipCallback: c.tooltipCallback,
                            hoverLeaveCallback: c.leaveCallback,
                            willLinkActivate: c.willLinkActivate,
                            priority: c.priority || 0
                        };
                        return this._addLinkMatcherToList(k),
                        k.id
                    }
                    ,
                    g.prototype._addLinkMatcherToList = function(k) {
                        if (0 !== this._linkMatchers.length) {
                            for (var d = this._linkMatchers.length - 1; 0 <= d; d--)
                                if (k.priority <= this._linkMatchers[d].priority)
                                    return void this._linkMatchers.splice(d + 1, 0, k);
                            this._linkMatchers.splice(0, 0, k)
                        } else
                            this._linkMatchers.push(k)
                    }
                    ,
                    g.prototype.deregisterLinkMatcher = function(k) {
                        for (var d = 0; d < this._linkMatchers.length; d++)
                            if (this._linkMatchers[d].id === k)
                                return this._linkMatchers.splice(d, 1),
                                !0;
                        return !1
                    }
                    ,
                    g.prototype._doLinkifyRow = function(k, d, c) {
                        for (var a, b = this, e = new RegExp(c.regex.source,(c.regex.flags || "") + "g"), f = -1, m = function() {
                            var w = a["number" != typeof c.matchIndex ? 0 : c.matchIndex];
                            if (!w)
                                return u._logService.debug("match found without corresponding matchIndex", a, c),
                                "break";
                            if (f = d.indexOf(w, f + 1),
                            e.lastIndex = f + w.length,
                            0 > f)
                                return "break";
                            var r = u._bufferService.buffer.stringIndexToBufferIndex(k, f);
                            if (0 > r[0])
                                return "break";
                            var z = u._bufferService.buffer.lines.get(r[0]);
                            if (!z)
                                return "break";
                            var C = (z = z.getFg(r[1])) ? z >> 9 & 511 : void 0;
                            c.validationCallback ? c.validationCallback(w, function(J) {
                                b._rowsTimeoutId || J && b._addLink(r[1], r[0] - b._bufferService.buffer.ydisp, w, c, C)
                            }) : u._addLink(r[1], r[0] - u._bufferService.buffer.ydisp, w, c, C)
                        }, u = this; null !== (a = e.exec(d)) && "break" !== m(); )
                            ;
                    }
                    ,
                    g.prototype._addLink = function(k, d, c, a, b) {
                        var e = this;
                        if (this._mouseZoneManager && this._element) {
                            var f = this._unicodeService.getStringCellWidth(c)
                              , m = k % this._bufferService.cols
                              , u = d + Math.floor(k / this._bufferService.cols)
                              , w = (m + f) % this._bufferService.cols
                              , r = u + Math.floor((m + f) / this._bufferService.cols);
                            0 === w && (w = this._bufferService.cols,
                            r--);
                            this._mouseZoneManager.add(new n(m + 1,u + 1,w + 1,r + 1,function(z) {
                                if (a.handler)
                                    return a.handler(z, c);
                                (z = window.open()) ? (z.opener = null,
                                z.location.href = c) : console.warn("Opening link blocked as opener could not be cleared")
                            }
                            ,function() {
                                e._onShowLinkUnderline.fire(e._createLinkHoverEvent(m, u, w, r, b));
                                e._element.classList.add("xterm-cursor-pointer")
                            }
                            ,function(z) {
                                e._onLinkTooltip.fire(e._createLinkHoverEvent(m, u, w, r, b));
                                a.hoverTooltipCallback && a.hoverTooltipCallback(z, c, {
                                    start: {
                                        x: m,
                                        y: u
                                    },
                                    end: {
                                        x: w,
                                        y: r
                                    }
                                })
                            }
                            ,function() {
                                e._onHideLinkUnderline.fire(e._createLinkHoverEvent(m, u, w, r, b));
                                e._element.classList.remove("xterm-cursor-pointer");
                                a.hoverLeaveCallback && a.hoverLeaveCallback()
                            }
                            ,function(z) {
                                return !a.willLinkActivate || a.willLinkActivate(z, c)
                            }
                            ))
                        }
                    }
                    ,
                    g.prototype._createLinkHoverEvent = function(k, d, c, a, b) {
                        return {
                            x1: k,
                            y1: d,
                            x2: c,
                            y2: a,
                            cols: this._bufferService.cols,
                            fg: b
                        }
                    }
                    ,
                    g._timeBeforeLatency = 200,
                    g = h([v(0, t.IBufferService), v(1, t.ILogService), v(2, t.IUnicodeService)], g)
                }();
                l.Linkifier = A;
                var n = function(g, k, d, c, a, b, e, f, m) {
                    this.x1 = g;
                    this.y1 = k;
                    this.x2 = d;
                    this.y2 = c;
                    this.clickCallback = a;
                    this.hoverCallback = b;
                    this.tooltipCallback = e;
                    this.leaveCallback = f;
                    this.willLinkActivate = m
                };
                l.MouseZone = n
            },
            6465: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(c, a) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(b, e) {
                        b.__proto__ = e
                    }
                    || function(b, e) {
                        for (var f in e)
                            Object.prototype.hasOwnProperty.call(e, f) && (b[f] = e[f])
                    }
                    ,
                    h(c, a)
                }
                ,
                function(c, a) {
                    function b() {
                        this.constructor = c
                    }
                    if ("function" != typeof a && null !== a)
                        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
                    h(c, a);
                    c.prototype = null === a ? Object.create(a) : (b.prototype = a.prototype,
                    new b)
                }
                ), p = this && this.__decorate || function(c, a, b, e) {
                    var f, m = arguments.length, u = 3 > m ? a : null === e ? e = Object.getOwnPropertyDescriptor(a, b) : e;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        u = Reflect.decorate(c, a, b, e);
                    else
                        for (var w = c.length - 1; 0 <= w; w--)
                            (f = c[w]) && (u = (3 > m ? f(u) : 3 < m ? f(a, b, u) : f(a, b)) || u);
                    return 3 < m && u && Object.defineProperty(a, b, u),
                    u
                }
                , t = this && this.__param || function(c, a) {
                    return function(b, e) {
                        a(b, e, c)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Linkifier2 = void 0;
                var n = q(2585)
                  , g = q(8460)
                  , k = q(844)
                  , d = q(3656);
                A = function(c) {
                    function a(b) {
                        var e = c.call(this) || this;
                        return e._bufferService = b,
                        e._linkProviders = [],
                        e._linkCacheDisposables = [],
                        e._isMouseOut = !0,
                        e._activeLine = -1,
                        e._onShowLinkUnderline = e.register(new g.EventEmitter),
                        e._onHideLinkUnderline = e.register(new g.EventEmitter),
                        e.register((0,
                        k.getDisposeArrayDisposable)(e._linkCacheDisposables)),
                        e
                    }
                    return v(a, c),
                    Object.defineProperty(a.prototype, "currentLink", {
                        get: function() {
                            return this._currentLink
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(a.prototype, "onShowLinkUnderline", {
                        get: function() {
                            return this._onShowLinkUnderline.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(a.prototype, "onHideLinkUnderline", {
                        get: function() {
                            return this._onHideLinkUnderline.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    a.prototype.registerLinkProvider = function(b) {
                        var e = this;
                        return this._linkProviders.push(b),
                        {
                            dispose: function() {
                                var f = e._linkProviders.indexOf(b);
                                -1 !== f && e._linkProviders.splice(f, 1)
                            }
                        }
                    }
                    ,
                    a.prototype.attachToDom = function(b, e, f) {
                        var m = this;
                        this._element = b;
                        this._mouseService = e;
                        this._renderService = f;
                        this.register((0,
                        d.addDisposableDomListener)(this._element, "mouseleave", function() {
                            m._isMouseOut = !0;
                            m._clearCurrentLink()
                        }));
                        this.register((0,
                        d.addDisposableDomListener)(this._element, "mousemove", this._onMouseMove.bind(this)));
                        this.register((0,
                        d.addDisposableDomListener)(this._element, "click", this._onClick.bind(this)))
                    }
                    ,
                    a.prototype._onMouseMove = function(b) {
                        if (this._lastMouseEvent = b,
                        this._element && this._mouseService) {
                            var e = this._positionFromMouseEvent(b, this._element, this._mouseService);
                            if (e) {
                                this._isMouseOut = !1;
                                b = b.composedPath();
                                for (var f = 0; f < b.length; f++) {
                                    var m = b[f];
                                    if (m.classList.contains("xterm"))
                                        break;
                                    if (m.classList.contains("xterm-hover"))
                                        return
                                }
                                this._lastBufferCell && e.x === this._lastBufferCell.x && e.y === this._lastBufferCell.y || (this._onHover(e),
                                this._lastBufferCell = e)
                            }
                        }
                    }
                    ,
                    a.prototype._onHover = function(b) {
                        if (this._activeLine !== b.y)
                            return this._clearCurrentLink(),
                            void this._askForLink(b, !1);
                        this._currentLink && this._linkAtPosition(this._currentLink.link, b) || (this._clearCurrentLink(),
                        this._askForLink(b, !0))
                    }
                    ,
                    a.prototype._askForLink = function(b, e) {
                        var f, m = this;
                        this._activeProviderReplies && e || (null === (f = this._activeProviderReplies) || void 0 === f || f.forEach(function(w) {
                            null == w || w.forEach(function(r) {
                                r.link.dispose && r.link.dispose()
                            })
                        }),
                        this._activeProviderReplies = new Map,
                        this._activeLine = b.y);
                        var u = !1;
                        this._linkProviders.forEach(function(w, r) {
                            var z;
                            e ? (null === (z = m._activeProviderReplies) || void 0 === z ? 0 : z.get(r)) && (u = m._checkLinkProviderResult(r, b, u)) : w.provideLinks(b.y, function(C) {
                                var J, F;
                                m._isMouseOut || (C = null == C ? void 0 : C.map(function(B) {
                                    return {
                                        link: B
                                    }
                                }),
                                null === (J = m._activeProviderReplies) || void 0 === J || J.set(r, C),
                                u = m._checkLinkProviderResult(r, b, u),
                                (null === (F = m._activeProviderReplies) || void 0 === F ? void 0 : F.size) === m._linkProviders.length && m._removeIntersectingLinks(b.y, m._activeProviderReplies))
                            })
                        })
                    }
                    ,
                    a.prototype._removeIntersectingLinks = function(b, e) {
                        for (var f = new Set, m = 0; m < e.size; m++) {
                            var u = e.get(m);
                            if (u)
                                for (var w = 0; w < u.length; w++) {
                                    var r = u[w]
                                      , z = r.link.range.end.y > b ? this._bufferService.cols : r.link.range.end.x;
                                    for (r = r.link.range.start.y < b ? 0 : r.link.range.start.x; r <= z; r++) {
                                        if (f.has(r)) {
                                            u.splice(w--, 1);
                                            break
                                        }
                                        f.add(r)
                                    }
                                }
                        }
                    }
                    ,
                    a.prototype._checkLinkProviderResult = function(b, e, f) {
                        var m, u = this;
                        if (!this._activeProviderReplies)
                            return f;
                        for (var w = this._activeProviderReplies.get(b), r = !1, z = 0; z < b; z++)
                            this._activeProviderReplies.has(z) && !this._activeProviderReplies.get(z) || (r = !0);
                        !r && w && (z = w.find(function(C) {
                            return u._linkAtPosition(C.link, e)
                        })) && (f = !0,
                        this._handleNewLink(z));
                        if (this._activeProviderReplies.size === this._linkProviders.length && !f)
                            for (z = 0; z < this._activeProviderReplies.size; z++)
                                if (b = null === (m = this._activeProviderReplies.get(z)) || void 0 === m ? void 0 : m.find(function(C) {
                                    return u._linkAtPosition(C.link, e)
                                })) {
                                    f = !0;
                                    this._handleNewLink(b);
                                    break
                                }
                        return f
                    }
                    ,
                    a.prototype._onClick = function(b) {
                        if (this._element && this._mouseService && this._currentLink) {
                            var e = this._positionFromMouseEvent(b, this._element, this._mouseService);
                            e && this._linkAtPosition(this._currentLink.link, e) && this._currentLink.link.activate(b, this._currentLink.link.text)
                        }
                    }
                    ,
                    a.prototype._clearCurrentLink = function(b, e) {
                        this._element && this._currentLink && this._lastMouseEvent && (!b || !e || this._currentLink.link.range.start.y >= b && this._currentLink.link.range.end.y <= e) && (this._linkLeave(this._element, this._currentLink.link, this._lastMouseEvent),
                        this._currentLink = void 0,
                        (0,
                        k.disposeArray)(this._linkCacheDisposables))
                    }
                    ,
                    a.prototype._handleNewLink = function(b) {
                        var e = this;
                        if (this._element && this._lastMouseEvent && this._mouseService) {
                            var f = this._positionFromMouseEvent(this._lastMouseEvent, this._element, this._mouseService);
                            f && this._linkAtPosition(b.link, f) && (this._currentLink = b,
                            this._currentLink.state = {
                                decorations: {
                                    underline: void 0 === b.link.decorations || b.link.decorations.underline,
                                    pointerCursor: void 0 === b.link.decorations || b.link.decorations.pointerCursor
                                },
                                isHovered: !0
                            },
                            this._linkHover(this._element, b.link, this._lastMouseEvent),
                            b.link.decorations = {},
                            Object.defineProperties(b.link.decorations, {
                                pointerCursor: {
                                    get: function() {
                                        var m, u;
                                        return null === (u = null === (m = e._currentLink) || void 0 === m ? void 0 : m.state) || void 0 === u ? void 0 : u.decorations.pointerCursor
                                    },
                                    set: function(m) {
                                        var u, w;
                                        (null === (u = e._currentLink) || void 0 === u ? 0 : u.state) && e._currentLink.state.decorations.pointerCursor !== m && (e._currentLink.state.decorations.pointerCursor = m,
                                        e._currentLink.state.isHovered && (null === (w = e._element) || void 0 === w || w.classList.toggle("xterm-cursor-pointer", m)))
                                    }
                                },
                                underline: {
                                    get: function() {
                                        var m, u;
                                        return null === (u = null === (m = e._currentLink) || void 0 === m ? void 0 : m.state) || void 0 === u ? void 0 : u.decorations.underline
                                    },
                                    set: function(m) {
                                        var u, w, r;
                                        (null === (u = e._currentLink) || void 0 === u ? 0 : u.state) && (null === (r = null === (w = e._currentLink) || void 0 === w ? void 0 : w.state) || void 0 === r ? void 0 : r.decorations.underline) !== m && (e._currentLink.state.decorations.underline = m,
                                        e._currentLink.state.isHovered && e._fireUnderlineEvent(b.link, m))
                                    }
                                }
                            }),
                            this._renderService && this._linkCacheDisposables.push(this._renderService.onRenderedBufferChange(function(m) {
                                e._clearCurrentLink(0 === m.start ? 0 : m.start + 1 + e._bufferService.buffer.ydisp, m.end + 1 + e._bufferService.buffer.ydisp)
                            })))
                        }
                    }
                    ,
                    a.prototype._linkHover = function(b, e, f) {
                        var m;
                        (null === (m = this._currentLink) || void 0 === m ? 0 : m.state) && (this._currentLink.state.isHovered = !0,
                        this._currentLink.state.decorations.underline && this._fireUnderlineEvent(e, !0),
                        this._currentLink.state.decorations.pointerCursor && b.classList.add("xterm-cursor-pointer"));
                        e.hover && e.hover(f, e.text)
                    }
                    ,
                    a.prototype._fireUnderlineEvent = function(b, e) {
                        b = b.range;
                        var f = this._bufferService.buffer.ydisp;
                        b = this._createLinkUnderlineEvent(b.start.x - 1, b.start.y - f - 1, b.end.x, b.end.y - f - 1, void 0);
                        (e ? this._onShowLinkUnderline : this._onHideLinkUnderline).fire(b)
                    }
                    ,
                    a.prototype._linkLeave = function(b, e, f) {
                        var m;
                        (null === (m = this._currentLink) || void 0 === m ? 0 : m.state) && (this._currentLink.state.isHovered = !1,
                        this._currentLink.state.decorations.underline && this._fireUnderlineEvent(e, !1),
                        this._currentLink.state.decorations.pointerCursor && b.classList.remove("xterm-cursor-pointer"));
                        e.leave && e.leave(f, e.text)
                    }
                    ,
                    a.prototype._linkAtPosition = function(b, e) {
                        var f = b.range.start.y < e.y
                          , m = b.range.end.y > e.y;
                        return (b.range.start.y === b.range.end.y && b.range.start.x <= e.x && b.range.end.x >= e.x || f && b.range.end.x >= e.x || m && b.range.start.x <= e.x || f && m) && b.range.start.y <= e.y && b.range.end.y >= e.y
                    }
                    ,
                    a.prototype._positionFromMouseEvent = function(b, e, f) {
                        if (b = f.getCoords(b, e, this._bufferService.cols, this._bufferService.rows))
                            return {
                                x: b[0],
                                y: b[1] + this._bufferService.buffer.ydisp
                            }
                    }
                    ,
                    a.prototype._createLinkUnderlineEvent = function(b, e, f, m, u) {
                        return {
                            x1: b,
                            y1: e,
                            x2: f,
                            y2: m,
                            cols: this._bufferService.cols,
                            fg: u
                        }
                    }
                    ,
                    p([t(0, n.IBufferService)], a)
                }(k.Disposable);
                l.Linkifier2 = A
            },
            9042: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.promptLabel = "Terminal input";
                l.tooMuchOutput = "Too much output to announce, navigate to rows manually to read"
            }
            ,
            6954: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                ), p = this && this.__decorate || function(d, c, a, b) {
                    var e, f = arguments.length, m = 3 > f ? c : null === b ? b = Object.getOwnPropertyDescriptor(c, a) : b;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        m = Reflect.decorate(d, c, a, b);
                    else
                        for (var u = d.length - 1; 0 <= u; u--)
                            (e = d[u]) && (m = (3 > f ? e(m) : 3 < f ? e(c, a, m) : e(c, a)) || m);
                    return 3 < f && m && Object.defineProperty(c, a, m),
                    m
                }
                , t = this && this.__param || function(d, c) {
                    return function(a, b) {
                        c(a, b, d)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.MouseZoneManager = void 0;
                A = q(844);
                var n = q(3656)
                  , g = q(4725)
                  , k = q(2585);
                q = function(d) {
                    function c(a, b, e, f, m, u) {
                        var w = d.call(this) || this;
                        return w._element = a,
                        w._screenElement = b,
                        w._bufferService = e,
                        w._mouseService = f,
                        w._selectionService = m,
                        w._optionsService = u,
                        w._zones = [],
                        w._areZonesActive = !1,
                        w._lastHoverCoords = [void 0, void 0],
                        w._initialSelectionLength = 0,
                        w.register((0,
                        n.addDisposableDomListener)(w._element, "mousedown", function(r) {
                            return w._onMouseDown(r)
                        })),
                        w._mouseMoveListener = function(r) {
                            return w._onMouseMove(r)
                        }
                        ,
                        w._mouseLeaveListener = function(r) {
                            return w._onMouseLeave(r)
                        }
                        ,
                        w._clickListener = function(r) {
                            return w._onClick(r)
                        }
                        ,
                        w
                    }
                    return v(c, d),
                    c.prototype.dispose = function() {
                        d.prototype.dispose.call(this);
                        this._deactivate()
                    }
                    ,
                    c.prototype.add = function(a) {
                        this._zones.push(a);
                        1 === this._zones.length && this._activate()
                    }
                    ,
                    c.prototype.clearAll = function(a, b) {
                        if (0 !== this._zones.length) {
                            a && b || (a = 0,
                            b = this._bufferService.rows - 1);
                            for (var e = 0; e < this._zones.length; e++) {
                                var f = this._zones[e];
                                (f.y1 > a && f.y1 <= b + 1 || f.y2 > a && f.y2 <= b + 1 || f.y1 < a && f.y2 > b + 1) && (this._currentZone && this._currentZone === f && (this._currentZone.leaveCallback(),
                                this._currentZone = void 0),
                                this._zones.splice(e--, 1))
                            }
                            0 === this._zones.length && this._deactivate()
                        }
                    }
                    ,
                    c.prototype._activate = function() {
                        this._areZonesActive || (this._areZonesActive = !0,
                        this._element.addEventListener("mousemove", this._mouseMoveListener),
                        this._element.addEventListener("mouseleave", this._mouseLeaveListener),
                        this._element.addEventListener("click", this._clickListener))
                    }
                    ,
                    c.prototype._deactivate = function() {
                        this._areZonesActive && (this._areZonesActive = !1,
                        this._element.removeEventListener("mousemove", this._mouseMoveListener),
                        this._element.removeEventListener("mouseleave", this._mouseLeaveListener),
                        this._element.removeEventListener("click", this._clickListener))
                    }
                    ,
                    c.prototype._onMouseMove = function(a) {
                        this._lastHoverCoords[0] === a.pageX && this._lastHoverCoords[1] === a.pageY || (this._onHover(a),
                        this._lastHoverCoords = [a.pageX, a.pageY])
                    }
                    ,
                    c.prototype._onHover = function(a) {
                        var b = this
                          , e = this._findZoneEventAt(a);
                        e !== this._currentZone && (this._currentZone && (this._currentZone.leaveCallback(),
                        this._currentZone = void 0,
                        this._tooltipTimeout && clearTimeout(this._tooltipTimeout)),
                        e && (this._currentZone = e,
                        e.hoverCallback && e.hoverCallback(a),
                        this._tooltipTimeout = window.setTimeout(function() {
                            return b._onTooltip(a)
                        }, this._optionsService.rawOptions.linkTooltipHoverDuration)))
                    }
                    ,
                    c.prototype._onTooltip = function(a) {
                        this._tooltipTimeout = void 0;
                        var b = this._findZoneEventAt(a);
                        null == b || b.tooltipCallback(a)
                    }
                    ,
                    c.prototype._onMouseDown = function(a) {
                        if (this._initialSelectionLength = this._getSelectionLength(),
                        this._areZonesActive) {
                            var b = this._findZoneEventAt(a);
                            (null == b ? 0 : b.willLinkActivate(a)) && (a.preventDefault(),
                            a.stopImmediatePropagation())
                        }
                    }
                    ,
                    c.prototype._onMouseLeave = function(a) {
                        this._currentZone && (this._currentZone.leaveCallback(),
                        this._currentZone = void 0,
                        this._tooltipTimeout && clearTimeout(this._tooltipTimeout))
                    }
                    ,
                    c.prototype._onClick = function(a) {
                        var b = this._findZoneEventAt(a)
                          , e = this._getSelectionLength();
                        b && e === this._initialSelectionLength && (b.clickCallback(a),
                        a.preventDefault(),
                        a.stopImmediatePropagation())
                    }
                    ,
                    c.prototype._getSelectionLength = function() {
                        var a = this._selectionService.selectionText;
                        return a ? a.length : 0
                    }
                    ,
                    c.prototype._findZoneEventAt = function(a) {
                        var b = this._mouseService.getCoords(a, this._screenElement, this._bufferService.cols, this._bufferService.rows);
                        if (b) {
                            a = b[0];
                            b = b[1];
                            for (var e = 0; e < this._zones.length; e++) {
                                var f = this._zones[e];
                                if (f.y1 === f.y2) {
                                    if (b === f.y1 && a >= f.x1 && a < f.x2)
                                        return f
                                } else if (b === f.y1 && a >= f.x1 || b === f.y2 && a < f.x2 || b > f.y1 && b < f.y2)
                                    return f
                            }
                        }
                    }
                    ,
                    p([t(2, k.IBufferService), t(3, g.IMouseService), t(4, g.ISelectionService), t(5, k.IOptionsService)], c)
                }(A.Disposable);
                l.MouseZoneManager = q
            },
            6193: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.RenderDebouncer = void 0;
                A = function() {
                    function q(h) {
                        this._renderCallback = h
                    }
                    return q.prototype.dispose = function() {
                        this._animationFrame && (window.cancelAnimationFrame(this._animationFrame),
                        this._animationFrame = void 0)
                    }
                    ,
                    q.prototype.refresh = function(h, v, p) {
                        var t = this;
                        this._rowCount = p;
                        h = void 0 !== h ? h : 0;
                        v = void 0 !== v ? v : this._rowCount - 1;
                        this._rowStart = void 0 !== this._rowStart ? Math.min(this._rowStart, h) : h;
                        this._rowEnd = void 0 !== this._rowEnd ? Math.max(this._rowEnd, v) : v;
                        this._animationFrame || (this._animationFrame = window.requestAnimationFrame(function() {
                            return t._innerRefresh()
                        }))
                    }
                    ,
                    q.prototype._innerRefresh = function() {
                        if (void 0 !== this._rowStart && void 0 !== this._rowEnd && void 0 !== this._rowCount) {
                            var h = Math.max(this._rowStart, 0)
                              , v = Math.min(this._rowEnd, this._rowCount - 1);
                            this._animationFrame = this._rowEnd = this._rowStart = void 0;
                            this._renderCallback(h, v)
                        }
                    }
                    ,
                    q
                }();
                l.RenderDebouncer = A
            }
            ,
            5596: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(p, t) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(n, g) {
                        n.__proto__ = g
                    }
                    || function(n, g) {
                        for (var k in g)
                            Object.prototype.hasOwnProperty.call(g, k) && (n[k] = g[k])
                    }
                    ,
                    h(p, t)
                }
                ,
                function(p, t) {
                    function n() {
                        this.constructor = p
                    }
                    if ("function" != typeof t && null !== t)
                        throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
                    h(p, t);
                    p.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype,
                    new n)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ScreenDprMonitor = void 0;
                A = function(p) {
                    function t() {
                        var n = null !== p && p.apply(this, arguments) || this;
                        return n._currentDevicePixelRatio = window.devicePixelRatio,
                        n
                    }
                    return v(t, p),
                    t.prototype.setListener = function(n) {
                        var g = this;
                        this._listener && this.clearListener();
                        this._listener = n;
                        this._outerListener = function() {
                            g._listener && (g._listener(window.devicePixelRatio, g._currentDevicePixelRatio),
                            g._updateDpr())
                        }
                        ;
                        this._updateDpr()
                    }
                    ,
                    t.prototype.dispose = function() {
                        p.prototype.dispose.call(this);
                        this.clearListener()
                    }
                    ,
                    t.prototype._updateDpr = function() {
                        var n;
                        this._outerListener && (null === (n = this._resolutionMediaMatchList) || void 0 === n || n.removeListener(this._outerListener),
                        this._currentDevicePixelRatio = window.devicePixelRatio,
                        this._resolutionMediaMatchList = window.matchMedia("screen and (resolution: " + window.devicePixelRatio + "dppx)"),
                        this._resolutionMediaMatchList.addListener(this._outerListener))
                    }
                    ,
                    t.prototype.clearListener = function() {
                        this._resolutionMediaMatchList && this._listener && this._outerListener && (this._resolutionMediaMatchList.removeListener(this._outerListener),
                        this._resolutionMediaMatchList = void 0,
                        this._listener = void 0,
                        this._outerListener = void 0)
                    }
                    ,
                    t
                }(q(844).Disposable);
                l.ScreenDprMonitor = A
            },
            3236: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(D, M) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(H, x) {
                        H.__proto__ = x
                    }
                    || function(H, x) {
                        for (var N in x)
                            Object.prototype.hasOwnProperty.call(x, N) && (H[N] = x[N])
                    }
                    ,
                    h(D, M)
                }
                ,
                function(D, M) {
                    function H() {
                        this.constructor = D
                    }
                    if ("function" != typeof M && null !== M)
                        throw new TypeError("Class extends value " + String(M) + " is not a constructor or null");
                    h(D, M);
                    D.prototype = null === M ? Object.create(M) : (H.prototype = M.prototype,
                    new H)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Terminal = void 0;
                var p = q(2950)
                  , t = q(1680)
                  , n = q(3614)
                  , g = q(2584)
                  , k = q(5435)
                  , d = q(3525)
                  , c = q(3551)
                  , a = q(9312)
                  , b = q(6114)
                  , e = q(3656)
                  , f = q(9042)
                  , m = q(357)
                  , u = q(6954)
                  , w = q(4567)
                  , r = q(1296)
                  , z = q(7399)
                  , C = q(8460)
                  , J = q(8437)
                  , F = q(5680)
                  , B = q(3230)
                  , y = q(4725)
                  , E = q(428)
                  , G = q(8934)
                  , I = q(6465)
                  , Q = q(5114);
                A = q(8969);
                var R = q(4774)
                  , W = q(4269)
                  , V = q(5941)
                  , S = "undefined" != typeof window ? window.document : null;
                q = function(D) {
                    function M(H) {
                        void 0 === H && (H = {});
                        var x = D.call(this, H) || this;
                        return x.browser = b,
                        x._keyDownHandled = !1,
                        x._keyPressHandled = !1,
                        x._unprocessedDeadKey = !1,
                        x._onCursorMove = new C.EventEmitter,
                        x._onKey = new C.EventEmitter,
                        x._onRender = new C.EventEmitter,
                        x._onSelectionChange = new C.EventEmitter,
                        x._onTitleChange = new C.EventEmitter,
                        x._onBell = new C.EventEmitter,
                        x._onFocus = new C.EventEmitter,
                        x._onBlur = new C.EventEmitter,
                        x._onA11yCharEmitter = new C.EventEmitter,
                        x._onA11yTabEmitter = new C.EventEmitter,
                        x._setup(),
                        x.linkifier = x._instantiationService.createInstance(c.Linkifier),
                        x.linkifier2 = x.register(x._instantiationService.createInstance(I.Linkifier2)),
                        x.register(x._inputHandler.onRequestBell(function() {
                            return x.bell()
                        })),
                        x.register(x._inputHandler.onRequestRefreshRows(function(N, O) {
                            return x.refresh(N, O)
                        })),
                        x.register(x._inputHandler.onRequestSendFocus(function() {
                            return x._reportFocus()
                        })),
                        x.register(x._inputHandler.onRequestReset(function() {
                            return x.reset()
                        })),
                        x.register(x._inputHandler.onRequestWindowsOptionsReport(function(N) {
                            return x._reportWindowsOptions(N)
                        })),
                        x.register(x._inputHandler.onColor(function(N) {
                            return x._handleColorEvent(N)
                        })),
                        x.register((0,
                        C.forwardEvent)(x._inputHandler.onCursorMove, x._onCursorMove)),
                        x.register((0,
                        C.forwardEvent)(x._inputHandler.onTitleChange, x._onTitleChange)),
                        x.register((0,
                        C.forwardEvent)(x._inputHandler.onA11yChar, x._onA11yCharEmitter)),
                        x.register((0,
                        C.forwardEvent)(x._inputHandler.onA11yTab, x._onA11yTabEmitter)),
                        x.register(x._bufferService.onResize(function(N) {
                            return x._afterResize(N.cols, N.rows)
                        })),
                        x
                    }
                    return v(M, D),
                    Object.defineProperty(M.prototype, "onCursorMove", {
                        get: function() {
                            return this._onCursorMove.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onKey", {
                        get: function() {
                            return this._onKey.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onRender", {
                        get: function() {
                            return this._onRender.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onSelectionChange", {
                        get: function() {
                            return this._onSelectionChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onTitleChange", {
                        get: function() {
                            return this._onTitleChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onBell", {
                        get: function() {
                            return this._onBell.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onFocus", {
                        get: function() {
                            return this._onFocus.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onBlur", {
                        get: function() {
                            return this._onBlur.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onA11yChar", {
                        get: function() {
                            return this._onA11yCharEmitter.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(M.prototype, "onA11yTab", {
                        get: function() {
                            return this._onA11yTabEmitter.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    M.prototype._handleColorEvent = function(H) {
                        var x, N;
                        if (this._colorManager) {
                            for (var O = 0; O < H.length; O++) {
                                var U = H[O];
                                switch (U.index) {
                                case 256:
                                    var Y = "foreground";
                                    var Z = "10";
                                    break;
                                case 257:
                                    Y = "background";
                                    Z = "11";
                                    break;
                                case 258:
                                    Y = "cursor";
                                    Z = "12";
                                    break;
                                default:
                                    Y = "ansi",
                                    Z = "4;" + U.index
                                }
                                if (Y)
                                    switch (U.type) {
                                    case 0:
                                        U = R.color.toColorRGB("ansi" === Y ? this._colorManager.colors.ansi[U.index] : this._colorManager.colors[Y]);
                                        this.coreService.triggerDataEvent(g.C0.ESC + "]" + Z + ";" + (0,
                                        V.toRgbString)(U) + g.C0.BEL);
                                        break;
                                    case 1:
                                        "ansi" === Y ? this._colorManager.colors.ansi[U.index] = R.rgba.toColor.apply(R.rgba, U.color) : this._colorManager.colors[Y] = R.rgba.toColor.apply(R.rgba, U.color);
                                        break;
                                    case 2:
                                        this._colorManager.restoreColor(U.index)
                                    }
                            }
                            null === (x = this._renderService) || void 0 === x || x.setColors(this._colorManager.colors);
                            null === (N = this.viewport) || void 0 === N || N.onThemeChange(this._colorManager.colors)
                        }
                    }
                    ,
                    M.prototype.dispose = function() {
                        var H, x, N;
                        this._isDisposed || (D.prototype.dispose.call(this),
                        null === (H = this._renderService) || void 0 === H || H.dispose(),
                        this._customKeyEventHandler = void 0,
                        this.write = function() {}
                        ,
                        null === (N = null === (x = this.element) || void 0 === x ? void 0 : x.parentNode) || void 0 === N || N.removeChild(this.element))
                    }
                    ,
                    M.prototype._setup = function() {
                        D.prototype._setup.call(this);
                        this._customKeyEventHandler = void 0
                    }
                    ,
                    Object.defineProperty(M.prototype, "buffer", {
                        get: function() {
                            return this.buffers.active
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    M.prototype.focus = function() {
                        this.textarea && this.textarea.focus({
                            preventScroll: !0
                        })
                    }
                    ,
                    M.prototype._updateOptions = function(H) {
                        var x, N, O, U;
                        switch (D.prototype._updateOptions.call(this, H),
                        H) {
                        case "fontFamily":
                        case "fontSize":
                            null === (x = this._renderService) || void 0 === x || x.clear();
                            null === (N = this._charSizeService) || void 0 === N || N.measure();
                            break;
                        case "cursorBlink":
                        case "cursorStyle":
                            this.refresh(this.buffer.y, this.buffer.y);
                            break;
                        case "customGlyphs":
                        case "drawBoldTextInBrightColors":
                        case "letterSpacing":
                        case "lineHeight":
                        case "fontWeight":
                        case "fontWeightBold":
                        case "minimumContrastRatio":
                            this._renderService && (this._renderService.clear(),
                            this._renderService.onResize(this.cols, this.rows),
                            this.refresh(0, this.rows - 1));
                            break;
                        case "rendererType":
                            this._renderService && (this._renderService.setRenderer(this._createRenderer()),
                            this._renderService.onResize(this.cols, this.rows));
                            break;
                        case "scrollback":
                            null === (O = this.viewport) || void 0 === O || O.syncScrollArea();
                            break;
                        case "screenReaderMode":
                            this.optionsService.rawOptions.screenReaderMode ? !this._accessibilityManager && this._renderService && (this._accessibilityManager = new w.AccessibilityManager(this,this._renderService)) : (null === (U = this._accessibilityManager) || void 0 === U || U.dispose(),
                            this._accessibilityManager = void 0);
                            break;
                        case "tabStopWidth":
                            this.buffers.setupTabStops();
                            break;
                        case "theme":
                            this._setTheme(this.optionsService.rawOptions.theme)
                        }
                    }
                    ,
                    M.prototype._onTextAreaFocus = function(H) {
                        this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(g.C0.ESC + "[I");
                        this.updateCursorStyle(H);
                        this.element.classList.add("focus");
                        this._showCursor();
                        this._onFocus.fire()
                    }
                    ,
                    M.prototype.blur = function() {
                        var H;
                        return null === (H = this.textarea) || void 0 === H ? void 0 : H.blur()
                    }
                    ,
                    M.prototype._onTextAreaBlur = function() {
                        this.textarea.value = "";
                        this.refresh(this.buffer.y, this.buffer.y);
                        this.coreService.decPrivateModes.sendFocus && this.coreService.triggerDataEvent(g.C0.ESC + "[O");
                        this.element.classList.remove("focus");
                        this._onBlur.fire()
                    }
                    ,
                    M.prototype._syncTextArea = function() {
                        if (this.textarea && this.buffer.isCursorInViewport && !this._compositionHelper.isComposing && this._renderService) {
                            var H = this.buffer.lines.get(this.buffer.ybase + this.buffer.y);
                            if (H) {
                                var x = Math.min(this.buffer.x, this.cols - 1)
                                  , N = this._renderService.dimensions.actualCellHeight;
                                H = H.getWidth(x);
                                H *= this._renderService.dimensions.actualCellWidth;
                                var O = this.buffer.y * this._renderService.dimensions.actualCellHeight;
                                this.textarea.style.left = x * this._renderService.dimensions.actualCellWidth + "px";
                                this.textarea.style.top = O + "px";
                                this.textarea.style.width = H + "px";
                                this.textarea.style.height = N + "px";
                                this.textarea.style.lineHeight = N + "px";
                                this.textarea.style.zIndex = "-5"
                            }
                        }
                    }
                    ,
                    M.prototype._initGlobal = function() {
                        var H = this;
                        this._bindKeys();
                        this.register((0,
                        e.addDisposableDomListener)(this.element, "copy", function(N) {
                            H.hasSelection() && (0,
                            n.copyHandler)(N, H._selectionService)
                        }));
                        var x = function(N) {
                            return (0,
                            n.handlePasteEvent)(N, H.textarea, H.coreService)
                        };
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "paste", x));
                        this.register((0,
                        e.addDisposableDomListener)(this.element, "paste", x));
                        b.isFirefox ? this.register((0,
                        e.addDisposableDomListener)(this.element, "mousedown", function(N) {
                            2 === N.button && (0,
                            n.rightClickHandler)(N, H.textarea, H.screenElement, H._selectionService, H.options.rightClickSelectsWord)
                        })) : this.register((0,
                        e.addDisposableDomListener)(this.element, "contextmenu", function(N) {
                            (0,
                            n.rightClickHandler)(N, H.textarea, H.screenElement, H._selectionService, H.options.rightClickSelectsWord)
                        }));
                        b.isLinux && this.register((0,
                        e.addDisposableDomListener)(this.element, "auxclick", function(N) {
                            1 === N.button && (0,
                            n.moveTextAreaUnderMouseCursor)(N, H.textarea, H.screenElement)
                        }))
                    }
                    ,
                    M.prototype._bindKeys = function() {
                        var H = this;
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "keyup", function(x) {
                            return H._keyUp(x)
                        }, !0));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "keydown", function(x) {
                            return H._keyDown(x)
                        }, !0));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "keypress", function(x) {
                            return H._keyPress(x)
                        }, !0));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "compositionstart", function() {
                            return H._compositionHelper.compositionstart()
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "compositionupdate", function(x) {
                            return H._compositionHelper.compositionupdate(x)
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "compositionend", function() {
                            return H._compositionHelper.compositionend()
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "input", function(x) {
                            return H._inputEvent(x)
                        }, !0));
                        this.register(this.onRender(function() {
                            return H._compositionHelper.updateCompositionElements()
                        }));
                        this.register(this.onRender(function(x) {
                            return H._queueLinkification(x.start, x.end)
                        }))
                    }
                    ,
                    M.prototype.open = function(H) {
                        var x = this;
                        if (!H)
                            throw Error("Terminal requires a parent element.");
                        H.isConnected || this._logService.debug("Terminal.open was called on an element that was not attached to the DOM");
                        this._document = H.ownerDocument;
                        this.element = this._document.createElement("div");
                        this.element.dir = "ltr";
                        this.element.classList.add("terminal");
                        this.element.classList.add("xterm");
                        this.element.setAttribute("tabindex", "0");
                        H.appendChild(this.element);
                        H = S.createDocumentFragment();
                        this._viewportElement = S.createElement("div");
                        this._viewportElement.classList.add("xterm-viewport");
                        H.appendChild(this._viewportElement);
                        this._viewportScrollArea = S.createElement("div");
                        this._viewportScrollArea.classList.add("xterm-scroll-area");
                        this._viewportElement.appendChild(this._viewportScrollArea);
                        this.screenElement = S.createElement("div");
                        this.screenElement.classList.add("xterm-screen");
                        this._helperContainer = S.createElement("div");
                        this._helperContainer.classList.add("xterm-helpers");
                        this.screenElement.appendChild(this._helperContainer);
                        H.appendChild(this.screenElement);
                        this.textarea = S.createElement("textarea");
                        this.textarea.classList.add("xterm-helper-textarea");
                        this.textarea.setAttribute("aria-label", f.promptLabel);
                        this.textarea.setAttribute("aria-multiline", "false");
                        this.textarea.setAttribute("autocorrect", "off");
                        this.textarea.setAttribute("autocapitalize", "off");
                        this.textarea.setAttribute("spellcheck", "false");
                        this.textarea.tabIndex = 0;
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "focus", function(O) {
                            return x._onTextAreaFocus(O)
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(this.textarea, "blur", function() {
                            return x._onTextAreaBlur()
                        }));
                        this._helperContainer.appendChild(this.textarea);
                        var N = this._instantiationService.createInstance(Q.CoreBrowserService, this.textarea);
                        this._instantiationService.setService(y.ICoreBrowserService, N);
                        this._charSizeService = this._instantiationService.createInstance(E.CharSizeService, this._document, this._helperContainer);
                        this._instantiationService.setService(y.ICharSizeService, this._charSizeService);
                        this._theme = this.options.theme || this._theme;
                        this._colorManager = new F.ColorManager(S,this.options.allowTransparency);
                        this.register(this.optionsService.onOptionChange(function(O) {
                            return x._colorManager.onOptionsChange(O)
                        }));
                        this._colorManager.setTheme(this._theme);
                        this._characterJoinerService = this._instantiationService.createInstance(W.CharacterJoinerService);
                        this._instantiationService.setService(y.ICharacterJoinerService, this._characterJoinerService);
                        N = this._createRenderer();
                        this._renderService = this.register(this._instantiationService.createInstance(B.RenderService, N, this.rows, this.screenElement));
                        this._instantiationService.setService(y.IRenderService, this._renderService);
                        this.register(this._renderService.onRenderedBufferChange(function(O) {
                            return x._onRender.fire(O)
                        }));
                        this.onResize(function(O) {
                            return x._renderService.resize(O.cols, O.rows)
                        });
                        this._compositionView = S.createElement("div");
                        this._compositionView.classList.add("composition-view");
                        this._compositionHelper = this._instantiationService.createInstance(p.CompositionHelper, this.textarea, this._compositionView);
                        this._helperContainer.appendChild(this._compositionView);
                        this.element.appendChild(H);
                        this._soundService = this._instantiationService.createInstance(m.SoundService);
                        this._instantiationService.setService(y.ISoundService, this._soundService);
                        this._mouseService = this._instantiationService.createInstance(G.MouseService);
                        this._instantiationService.setService(y.IMouseService, this._mouseService);
                        this.viewport = this._instantiationService.createInstance(t.Viewport, function(O) {
                            return x.scrollLines(O, !0, 1)
                        }, this._viewportElement, this._viewportScrollArea, this.element);
                        this.viewport.onThemeChange(this._colorManager.colors);
                        this.register(this._inputHandler.onRequestSyncScrollBar(function() {
                            return x.viewport.syncScrollArea()
                        }));
                        this.register(this.viewport);
                        this.register(this.onCursorMove(function() {
                            x._renderService.onCursorMove();
                            x._syncTextArea()
                        }));
                        this.register(this.onResize(function() {
                            return x._renderService.onResize(x.cols, x.rows)
                        }));
                        this.register(this.onBlur(function() {
                            return x._renderService.onBlur()
                        }));
                        this.register(this.onFocus(function() {
                            return x._renderService.onFocus()
                        }));
                        this.register(this._renderService.onDimensionsChange(function() {
                            return x.viewport.syncScrollArea()
                        }));
                        this._selectionService = this.register(this._instantiationService.createInstance(a.SelectionService, this.element, this.screenElement, this.linkifier2));
                        this._instantiationService.setService(y.ISelectionService, this._selectionService);
                        this.register(this._selectionService.onRequestScrollLines(function(O) {
                            return x.scrollLines(O.amount, O.suppressScrollEvent)
                        }));
                        this.register(this._selectionService.onSelectionChange(function() {
                            return x._onSelectionChange.fire()
                        }));
                        this.register(this._selectionService.onRequestRedraw(function(O) {
                            return x._renderService.onSelectionChanged(O.start, O.end, O.columnSelectMode)
                        }));
                        this.register(this._selectionService.onLinuxMouseSelection(function(O) {
                            x.textarea.value = O;
                            x.textarea.focus();
                            x.textarea.select()
                        }));
                        this.register(this._onScroll.event(function(O) {
                            x.viewport.syncScrollArea();
                            x._selectionService.refresh()
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(this._viewportElement, "scroll", function() {
                            return x._selectionService.refresh()
                        }));
                        this._mouseZoneManager = this._instantiationService.createInstance(u.MouseZoneManager, this.element, this.screenElement);
                        this.register(this._mouseZoneManager);
                        this.register(this.onScroll(function() {
                            return x._mouseZoneManager.clearAll()
                        }));
                        this.linkifier.attachToDom(this.element, this._mouseZoneManager);
                        this.linkifier2.attachToDom(this.screenElement, this._mouseService, this._renderService);
                        this.register((0,
                        e.addDisposableDomListener)(this.element, "mousedown", function(O) {
                            return x._selectionService.onMouseDown(O)
                        }));
                        this.coreMouseService.areMouseEventsActive ? (this._selectionService.disable(),
                        this.element.classList.add("enable-mouse-events")) : this._selectionService.enable();
                        this.options.screenReaderMode && (this._accessibilityManager = new w.AccessibilityManager(this,this._renderService));
                        this._charSizeService.measure();
                        this.refresh(0, this.rows - 1);
                        this._initGlobal();
                        this.bindMouse()
                    }
                    ,
                    M.prototype._createRenderer = function() {
                        switch (this.options.rendererType) {
                        case "canvas":
                            return this._instantiationService.createInstance(d.Renderer, this._colorManager.colors, this.screenElement, this.linkifier, this.linkifier2);
                        case "dom":
                            return this._instantiationService.createInstance(r.DomRenderer, this._colorManager.colors, this.element, this.screenElement, this._viewportElement, this.linkifier, this.linkifier2);
                        default:
                            throw Error('Unrecognized rendererType "' + this.options.rendererType + '"');
                        }
                    }
                    ,
                    M.prototype._setTheme = function(H) {
                        var x, N, O;
                        this._theme = H;
                        null === (x = this._colorManager) || void 0 === x || x.setTheme(H);
                        null === (N = this._renderService) || void 0 === N || N.setColors(this._colorManager.colors);
                        null === (O = this.viewport) || void 0 === O || O.onThemeChange(this._colorManager.colors)
                    }
                    ,
                    M.prototype.bindMouse = function() {
                        function H(P) {
                            var aa, ka = N._mouseService.getRawByteCoords(P, N.screenElement, N.cols, N.rows);
                            if (!ka)
                                return !1;
                            switch (P.overrideType || P.type) {
                            case "mousemove":
                                var ha = 32;
                                void 0 === P.buttons ? (aa = 3,
                                void 0 !== P.button && (aa = 3 > P.button ? P.button : 3)) : aa = 1 & P.buttons ? 0 : 4 & P.buttons ? 1 : 2 & P.buttons ? 2 : 3;
                                break;
                            case "mouseup":
                                ha = 0;
                                aa = 3 > P.button ? P.button : 3;
                                break;
                            case "mousedown":
                                ha = 1;
                                aa = 3 > P.button ? P.button : 3;
                                break;
                            case "wheel":
                                0 !== P.deltaY && (ha = 0 > P.deltaY ? 0 : 1);
                                aa = 4;
                                break;
                            default:
                                return !1
                            }
                            return !(void 0 === ha || void 0 === aa || 4 < aa) && N.coreMouseService.triggerMouseEvent({
                                col: ka.x - 33,
                                row: ka.y - 33,
                                button: aa,
                                action: ha,
                                ctrl: P.ctrlKey,
                                alt: P.altKey,
                                shift: P.shiftKey
                            })
                        }
                        var x = this
                          , N = this
                          , O = this.element
                          , U = null
                          , Y = null
                          , Z = null
                          , la = null
                          , wa = function(P) {
                            return H(P),
                            P.buttons || (x._document.removeEventListener("mouseup", U),
                            Z && x._document.removeEventListener("mousemove", Z)),
                            x.cancel(P)
                        }
                          , ra = function(P) {
                            return H(P),
                            x.cancel(P, !0)
                        }
                          , xa = function(P) {
                            P.buttons && H(P)
                        }
                          , sa = function(P) {
                            P.buttons || H(P)
                        };
                        this.register(this.coreMouseService.onProtocolChange(function(P) {
                            P ? ("debug" === x.optionsService.rawOptions.logLevel && x._logService.debug("Binding to mouse events:", x.coreMouseService.explainEvents(P)),
                            x.element.classList.add("enable-mouse-events"),
                            x._selectionService.disable()) : (x._logService.debug("Unbinding from mouse events."),
                            x.element.classList.remove("enable-mouse-events"),
                            x._selectionService.enable());
                            8 & P ? la || (O.addEventListener("mousemove", sa),
                            la = sa) : (O.removeEventListener("mousemove", la),
                            la = null);
                            16 & P ? Y || (O.addEventListener("wheel", ra, {
                                passive: !1
                            }),
                            Y = ra) : (O.removeEventListener("wheel", Y),
                            Y = null);
                            2 & P ? U || (U = wa) : (x._document.removeEventListener("mouseup", U),
                            U = null);
                            4 & P ? Z || (Z = xa) : (x._document.removeEventListener("mousemove", Z),
                            Z = null)
                        }));
                        this.coreMouseService.activeProtocol = this.coreMouseService.activeProtocol;
                        this.register((0,
                        e.addDisposableDomListener)(O, "mousedown", function(P) {
                            if (P.preventDefault(),
                            x.focus(),
                            x.coreMouseService.areMouseEventsActive && !x._selectionService.shouldForceSelection(P))
                                return H(P),
                                U && x._document.addEventListener("mouseup", U),
                                Z && x._document.addEventListener("mousemove", Z),
                                x.cancel(P)
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(O, "wheel", function(P) {
                            if (!Y) {
                                if (!x.buffer.hasScrollback) {
                                    var aa = x.viewport.getLinesScrolled(P);
                                    if (0 === aa)
                                        return;
                                    for (var ka = g.C0.ESC + (x.coreService.decPrivateModes.applicationCursorKeys ? "O" : "[") + (0 > P.deltaY ? "A" : "B"), ha = "", ta = 0; ta < Math.abs(aa); ta++)
                                        ha += ka;
                                    return x.coreService.triggerDataEvent(ha, !0),
                                    x.cancel(P, !0)
                                }
                                return x.viewport.onWheel(P) ? x.cancel(P) : void 0
                            }
                        }, {
                            passive: !1
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(O, "touchstart", function(P) {
                            if (!x.coreMouseService.areMouseEventsActive)
                                return x.viewport.onTouchStart(P),
                                x.cancel(P)
                        }, {
                            passive: !0
                        }));
                        this.register((0,
                        e.addDisposableDomListener)(O, "touchmove", function(P) {
                            if (!x.coreMouseService.areMouseEventsActive)
                                return x.viewport.onTouchMove(P) ? void 0 : x.cancel(P)
                        }, {
                            passive: !1
                        }))
                    }
                    ,
                    M.prototype.refresh = function(H, x) {
                        var N;
                        null === (N = this._renderService) || void 0 === N || N.refreshRows(H, x)
                    }
                    ,
                    M.prototype._queueLinkification = function(H, x) {
                        var N;
                        null === (N = this.linkifier) || void 0 === N || N.linkifyRows(H, x)
                    }
                    ,
                    M.prototype.updateCursorStyle = function(H) {
                        var x;
                        (null === (x = this._selectionService) || void 0 === x ? 0 : x.shouldColumnSelect(H)) ? this.element.classList.add("column-select") : this.element.classList.remove("column-select")
                    }
                    ,
                    M.prototype._showCursor = function() {
                        this.coreService.isCursorInitialized || (this.coreService.isCursorInitialized = !0,
                        this.refresh(this.buffer.y, this.buffer.y))
                    }
                    ,
                    M.prototype.scrollLines = function(H, x, N) {
                        void 0 === N && (N = 0);
                        D.prototype.scrollLines.call(this, H, x, N);
                        this.refresh(0, this.rows - 1)
                    }
                    ,
                    M.prototype.paste = function(H) {
                        (0,
                        n.paste)(H, this.textarea, this.coreService)
                    }
                    ,
                    M.prototype.attachCustomKeyEventHandler = function(H) {
                        this._customKeyEventHandler = H
                    }
                    ,
                    M.prototype.registerLinkMatcher = function(H, x, N) {
                        H = this.linkifier.registerLinkMatcher(H, x, N);
                        return this.refresh(0, this.rows - 1),
                        H
                    }
                    ,
                    M.prototype.deregisterLinkMatcher = function(H) {
                        this.linkifier.deregisterLinkMatcher(H) && this.refresh(0, this.rows - 1)
                    }
                    ,
                    M.prototype.registerLinkProvider = function(H) {
                        return this.linkifier2.registerLinkProvider(H)
                    }
                    ,
                    M.prototype.registerCharacterJoiner = function(H) {
                        if (!this._characterJoinerService)
                            throw Error("Terminal must be opened first");
                        H = this._characterJoinerService.register(H);
                        return this.refresh(0, this.rows - 1),
                        H
                    }
                    ,
                    M.prototype.deregisterCharacterJoiner = function(H) {
                        if (!this._characterJoinerService)
                            throw Error("Terminal must be opened first");
                        this._characterJoinerService.deregister(H) && this.refresh(0, this.rows - 1)
                    }
                    ,
                    Object.defineProperty(M.prototype, "markers", {
                        get: function() {
                            return this.buffer.markers
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    M.prototype.addMarker = function(H) {
                        if (this.buffer === this.buffers.normal)
                            return this.buffer.addMarker(this.buffer.ybase + this.buffer.y + H)
                    }
                    ,
                    M.prototype.hasSelection = function() {
                        return !!this._selectionService && this._selectionService.hasSelection
                    }
                    ,
                    M.prototype.select = function(H, x, N) {
                        this._selectionService.setSelection(H, x, N)
                    }
                    ,
                    M.prototype.getSelection = function() {
                        return this._selectionService ? this._selectionService.selectionText : ""
                    }
                    ,
                    M.prototype.getSelectionPosition = function() {
                        if (this._selectionService && this._selectionService.hasSelection)
                            return {
                                startColumn: this._selectionService.selectionStart[0],
                                startRow: this._selectionService.selectionStart[1],
                                endColumn: this._selectionService.selectionEnd[0],
                                endRow: this._selectionService.selectionEnd[1]
                            }
                    }
                    ,
                    M.prototype.clearSelection = function() {
                        var H;
                        null === (H = this._selectionService) || void 0 === H || H.clearSelection()
                    }
                    ,
                    M.prototype.selectAll = function() {
                        var H;
                        null === (H = this._selectionService) || void 0 === H || H.selectAll()
                    }
                    ,
                    M.prototype.selectLines = function(H, x) {
                        var N;
                        null === (N = this._selectionService) || void 0 === N || N.selectLines(H, x)
                    }
                    ,
                    M.prototype._keyDown = function(H) {
                        if (this._keyDownHandled = !1,
                        this._customKeyEventHandler && !1 === this._customKeyEventHandler(H))
                            return !1;
                        if (!this._compositionHelper.keydown(H))
                            return this.buffer.ybase !== this.buffer.ydisp && this._bufferService.scrollToBottom(),
                            !1;
                        "Dead" !== H.key && "AltGraph" !== H.key || (this._unprocessedDeadKey = !0);
                        var x = (0,
                        z.evaluateKeyboardEvent)(H, this.coreService.decPrivateModes.applicationCursorKeys, this.browser.isMac, this.options.macOptionIsMeta);
                        if (this.updateCursorStyle(H),
                        3 === x.type || 2 === x.type) {
                            var N = this.rows - 1;
                            return this.scrollLines(2 === x.type ? -N : N),
                            this.cancel(H, !0)
                        }
                        return 1 === x.type && this.selectAll(),
                        !!this._isThirdLevelShift(this.browser, H) || (x.cancel && this.cancel(H, !0),
                        !x.key || (this._unprocessedDeadKey ? (this._unprocessedDeadKey = !1,
                        !0) : (x.key !== g.C0.ETX && x.key !== g.C0.CR || (this.textarea.value = ""),
                        this._onKey.fire({
                            key: x.key,
                            domEvent: H
                        }),
                        this._showCursor(),
                        this.coreService.triggerDataEvent(x.key, !0),
                        this.optionsService.rawOptions.screenReaderMode ? void (this._keyDownHandled = !0) : this.cancel(H, !0))))
                    }
                    ,
                    M.prototype._isThirdLevelShift = function(H, x) {
                        H = H.isMac && !this.options.macOptionIsMeta && x.altKey && !x.ctrlKey && !x.metaKey || H.isWindows && x.altKey && x.ctrlKey && !x.metaKey || H.isWindows && x.getModifierState("AltGraph");
                        return "keypress" === x.type ? H : H && (!x.keyCode || 47 < x.keyCode)
                    }
                    ,
                    M.prototype._keyUp = function(H) {
                        this._customKeyEventHandler && !1 === this._customKeyEventHandler(H) || (16 === H.keyCode || 17 === H.keyCode || 18 === H.keyCode || this.focus(),
                        this.updateCursorStyle(H),
                        this._keyPressHandled = !1)
                    }
                    ,
                    M.prototype._keyPress = function(H) {
                        if ((this._keyPressHandled = !1,
                        this._keyDownHandled) || this._customKeyEventHandler && !1 === this._customKeyEventHandler(H))
                            return !1;
                        if (this.cancel(H),
                        H.charCode)
                            var x = H.charCode;
                        else if (null === H.which || void 0 === H.which)
                            x = H.keyCode;
                        else {
                            if (0 === H.which || 0 === H.charCode)
                                return !1;
                            x = H.which
                        }
                        return !(!x || (H.altKey || H.ctrlKey || H.metaKey) && !this._isThirdLevelShift(this.browser, H) || (x = String.fromCharCode(x),
                        this._onKey.fire({
                            key: x,
                            domEvent: H
                        }),
                        this._showCursor(),
                        this.coreService.triggerDataEvent(x, !0),
                        this._keyPressHandled = !0,
                        this._unprocessedDeadKey = !1,
                        0))
                    }
                    ,
                    M.prototype._inputEvent = function(H) {
                        if (H.data && "insertText" === H.inputType && !H.composed && !this.optionsService.rawOptions.screenReaderMode) {
                            if (this._keyPressHandled)
                                return !1;
                            this._unprocessedDeadKey = !1;
                            return this.coreService.triggerDataEvent(H.data, !0),
                            this.cancel(H),
                            !0
                        }
                        return !1
                    }
                    ,
                    M.prototype.bell = function() {
                        var H;
                        this._soundBell() && (null === (H = this._soundService) || void 0 === H || H.playBellSound());
                        this._onBell.fire()
                    }
                    ,
                    M.prototype.resize = function(H, x) {
                        H !== this.cols || x !== this.rows ? D.prototype.resize.call(this, H, x) : this._charSizeService && !this._charSizeService.hasValidSize && this._charSizeService.measure()
                    }
                    ,
                    M.prototype._afterResize = function(H, x) {
                        var N, O;
                        null === (N = this._charSizeService) || void 0 === N || N.measure();
                        null === (O = this.viewport) || void 0 === O || O.syncScrollArea(!0)
                    }
                    ,
                    M.prototype.clear = function() {
                        if (0 !== this.buffer.ybase || 0 !== this.buffer.y) {
                            this.buffer.lines.set(0, this.buffer.lines.get(this.buffer.ybase + this.buffer.y));
                            this.buffer.lines.length = 1;
                            this.buffer.ydisp = 0;
                            this.buffer.ybase = 0;
                            this.buffer.y = 0;
                            for (var H = 1; H < this.rows; H++)
                                this.buffer.lines.push(this.buffer.getBlankLine(J.DEFAULT_ATTR_DATA));
                            this.refresh(0, this.rows - 1);
                            this._onScroll.fire({
                                position: this.buffer.ydisp,
                                source: 0
                            })
                        }
                    }
                    ,
                    M.prototype.reset = function() {
                        var H, x;
                        this.options.rows = this.rows;
                        this.options.cols = this.cols;
                        var N = this._customKeyEventHandler;
                        this._setup();
                        D.prototype.reset.call(this);
                        null === (H = this._selectionService) || void 0 === H || H.reset();
                        this._customKeyEventHandler = N;
                        this.refresh(0, this.rows - 1);
                        null === (x = this.viewport) || void 0 === x || x.syncScrollArea()
                    }
                    ,
                    M.prototype.clearTextureAtlas = function() {
                        var H; 
                        null === (H = this._renderService) || void 0 === H || H.clearTextureAtlas()
                    }
                    ,
                    M.prototype._reportFocus = function() {
                        var H;
                        (null === (H = this.element) || void 0 === H ? 0 : H.classList.contains("focus")) ? this.coreService.triggerDataEvent(g.C0.ESC + "[I") : this.coreService.triggerDataEvent(g.C0.ESC + "[O")
                    }
                    ,
                    M.prototype._reportWindowsOptions = function(H) {
                        if (this._renderService)
                            switch (H) {
                            case k.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:
                                H = this._renderService.dimensions.scaledCanvasWidth.toFixed(0);
                                var x = this._renderService.dimensions.scaledCanvasHeight.toFixed(0);
                                this.coreService.triggerDataEvent(g.C0.ESC + "[4;" + x + ";" + H + "t");
                                break;
                            case k.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:
                                H = this._renderService.dimensions.scaledCellWidth.toFixed(0),
                                x = this._renderService.dimensions.scaledCellHeight.toFixed(0),
                                this.coreService.triggerDataEvent(g.C0.ESC + "[6;" + x + ";" + H + "t")
                            }
                    }
                    ,
                    M.prototype.cancel = function(H, x) {
                        if (this.options.cancelEvents || x)
                            return H.preventDefault(),
                            H.stopPropagation(),
                            !1
                    }
                    ,
                    M.prototype._visualBell = function() {
                        return !1
                    }
                    ,
                    M.prototype._soundBell = function() {
                        return "sound" === this.options.bellStyle
                    }
                    ,
                    M
                }(A.CoreTerminal);
                l.Terminal = q
            },
            9924: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.TimeBasedDebouncer = void 0;
                A = function() {
                    function q(h, v) {
                        void 0 === v && (v = 1E3);
                        this._renderCallback = h;
                        this._debounceThresholdMS = v;
                        this._lastRefreshMs = 0;
                        this._additionalRefreshRequested = !1
                    }
                    return q.prototype.dispose = function() {
                        this._refreshTimeoutID && clearTimeout(this._refreshTimeoutID)
                    }
                    ,
                    q.prototype.refresh = function(h, v, p) {
                        var t = this;
                        this._rowCount = p;
                        h = void 0 !== h ? h : 0;
                        v = void 0 !== v ? v : this._rowCount - 1;
                        this._rowStart = void 0 !== this._rowStart ? Math.min(this._rowStart, h) : h;
                        this._rowEnd = void 0 !== this._rowEnd ? Math.max(this._rowEnd, v) : v;
                        h = Date.now();
                        h - this._lastRefreshMs >= this._debounceThresholdMS ? (this._lastRefreshMs = h,
                        this._innerRefresh()) : this._additionalRefreshRequested || (h = this._debounceThresholdMS - (h - this._lastRefreshMs),
                        this._additionalRefreshRequested = !0,
                        this._refreshTimeoutID = window.setTimeout(function() {
                            t._lastRefreshMs = Date.now();
                            t._innerRefresh();
                            t._additionalRefreshRequested = !1;
                            t._refreshTimeoutID = void 0
                        }, h))
                    }
                    ,
                    q.prototype._innerRefresh = function() {
                        if (void 0 !== this._rowStart && void 0 !== this._rowEnd && void 0 !== this._rowCount) {
                            var h = Math.max(this._rowStart, 0)
                              , v = Math.min(this._rowEnd, this._rowCount - 1);
                            this._rowEnd = this._rowStart = void 0;
                            this._renderCallback(h, v)
                        }
                    }
                    ,
                    q
                }();
                l.TimeBasedDebouncer = A
            }
            ,
            1680: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                ), p = this && this.__decorate || function(d, c, a, b) {
                    var e, f = arguments.length, m = 3 > f ? c : null === b ? b = Object.getOwnPropertyDescriptor(c, a) : b;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        m = Reflect.decorate(d, c, a, b);
                    else
                        for (var u = d.length - 1; 0 <= u; u--)
                            (e = d[u]) && (m = (3 > f ? e(m) : 3 < f ? e(c, a, m) : e(c, a)) || m);
                    return 3 < f && m && Object.defineProperty(c, a, m),
                    m
                }
                , t = this && this.__param || function(d, c) {
                    return function(a, b) {
                        c(a, b, d)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Viewport = void 0;
                A = q(844);
                var n = q(3656)
                  , g = q(4725)
                  , k = q(2585);
                q = function(d) {
                    function c(a, b, e, f, m, u, w, r) {
                        var z = d.call(this) || this;
                        return z._scrollLines = a,
                        z._viewportElement = b,
                        z._scrollArea = e,
                        z._element = f,
                        z._bufferService = m,
                        z._optionsService = u,
                        z._charSizeService = w,
                        z._renderService = r,
                        z.scrollBarWidth = 0,
                        z._currentRowHeight = 0,
                        z._currentScaledCellHeight = 0,
                        z._lastRecordedBufferLength = 0,
                        z._lastRecordedViewportHeight = 0,
                        z._lastRecordedBufferHeight = 0,
                        z._lastTouchY = 0,
                        z._lastScrollTop = 0,
                        z._lastHadScrollBar = !1,
                        z._wheelPartialScroll = 0,
                        z._refreshAnimationFrame = null,
                        z._ignoreNextScrollEvent = !1,
                        z.scrollBarWidth = z._viewportElement.offsetWidth - z._scrollArea.offsetWidth || 15,
                        z._lastHadScrollBar = !0,
                        z.register((0,
                        n.addDisposableDomListener)(z._viewportElement, "scroll", z._onScroll.bind(z))),
                        z._activeBuffer = z._bufferService.buffer,
                        z.register(z._bufferService.buffers.onBufferActivate(function(C) {
                            return z._activeBuffer = C.activeBuffer
                        })),
                        z._renderDimensions = z._renderService.dimensions,
                        z.register(z._renderService.onDimensionsChange(function(C) {
                            return z._renderDimensions = C
                        })),
                        setTimeout(function() {
                            return z.syncScrollArea()
                        }, 0),
                        z
                    }
                    return v(c, d),
                    c.prototype.onThemeChange = function(a) {
                        this._viewportElement.style.backgroundColor = a.background.css
                    }
                    ,
                    c.prototype._refresh = function(a) {
                        var b = this;
                        if (a)
                            return this._innerRefresh(),
                            void (null !== this._refreshAnimationFrame && cancelAnimationFrame(this._refreshAnimationFrame));
                        null === this._refreshAnimationFrame && (this._refreshAnimationFrame = requestAnimationFrame(function() {
                            return b._innerRefresh()
                        }))
                    }
                    ,
                    c.prototype._innerRefresh = function() {
                        if (0 < this._charSizeService.height) {
                            this._currentRowHeight = this._renderService.dimensions.scaledCellHeight / window.devicePixelRatio;
                            this._currentScaledCellHeight = this._renderService.dimensions.scaledCellHeight;
                            this._lastRecordedViewportHeight = this._viewportElement.offsetHeight;
                            var a = Math.round(this._currentRowHeight * this._lastRecordedBufferLength) + (this._lastRecordedViewportHeight - this._renderService.dimensions.canvasHeight);
                            this._lastRecordedBufferHeight !== a && (this._lastRecordedBufferHeight = a,
                            this._scrollArea.style.height = this._lastRecordedBufferHeight + "px")
                        }
                        a = this._bufferService.buffer.ydisp * this._currentRowHeight;
                        this._viewportElement.scrollTop !== a && (this._ignoreNextScrollEvent = !0,
                        this._viewportElement.scrollTop = a);
                        0 === this._optionsService.rawOptions.scrollback ? this.scrollBarWidth = 0 : this.scrollBarWidth = this._viewportElement.offsetWidth - this._scrollArea.offsetWidth || 15;
                        this._lastHadScrollBar = 0 < this.scrollBarWidth;
                        a = window.getComputedStyle(this._element);
                        a = parseInt(a.paddingLeft) + parseInt(a.paddingRight);
                        this._viewportElement.style.width = (this._renderService.dimensions.actualCellWidth * this._bufferService.cols + this.scrollBarWidth + (this._lastHadScrollBar ? a : 0)).toString() + "px";
                        this._refreshAnimationFrame = null
                    }
                    ,
                    c.prototype.syncScrollArea = function(a) {
                        if (void 0 === a && (a = !1),
                        this._lastRecordedBufferLength !== this._bufferService.buffer.lines.length)
                            return this._lastRecordedBufferLength = this._bufferService.buffer.lines.length,
                            void this._refresh(a);
                        this._lastRecordedViewportHeight === this._renderService.dimensions.canvasHeight && this._lastScrollTop === this._activeBuffer.ydisp * this._currentRowHeight && this._renderDimensions.scaledCellHeight === this._currentScaledCellHeight ? this._lastHadScrollBar !== 0 < this._optionsService.rawOptions.scrollback && this._refresh(a) : this._refresh(a)
                    }
                    ,
                    c.prototype._onScroll = function(a) {
                        if (this._lastScrollTop = this._viewportElement.scrollTop,
                        this._viewportElement.offsetParent) {
                            if (this._ignoreNextScrollEvent)
                                return this._ignoreNextScrollEvent = !1,
                                void this._scrollLines(0);
                            this._scrollLines(Math.round(this._lastScrollTop / this._currentRowHeight) - this._bufferService.buffer.ydisp)
                        }
                    }
                    ,
                    c.prototype._bubbleScroll = function(a, b) {
                        var e = this._viewportElement.scrollTop + this._lastRecordedViewportHeight;
                        return !(0 > b && 0 !== this._viewportElement.scrollTop || 0 < b && e < this._lastRecordedBufferHeight) || (a.cancelable && a.preventDefault(),
                        !1)
                    }
                    ,
                    c.prototype.onWheel = function(a) {
                        var b = this._getPixelsScrolled(a);
                        return 0 !== b && (this._viewportElement.scrollTop += b,
                        this._bubbleScroll(a, b))
                    }
                    ,
                    c.prototype._getPixelsScrolled = function(a) {
                        if (0 === a.deltaY || a.shiftKey)
                            return 0;
                        var b = this._applyScrollModifier(a.deltaY, a);
                        return a.deltaMode === WheelEvent.DOM_DELTA_LINE ? b *= this._currentRowHeight : a.deltaMode === WheelEvent.DOM_DELTA_PAGE && (b *= this._currentRowHeight * this._bufferService.rows),
                        b
                    }
                    ,
                    c.prototype.getLinesScrolled = function(a) {
                        if (0 === a.deltaY || a.shiftKey)
                            return 0;
                        var b = this._applyScrollModifier(a.deltaY, a);
                        return a.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? (b /= this._currentRowHeight + 0,
                        this._wheelPartialScroll += b,
                        b = Math.floor(Math.abs(this._wheelPartialScroll)) * (0 < this._wheelPartialScroll ? 1 : -1),
                        this._wheelPartialScroll %= 1) : a.deltaMode === WheelEvent.DOM_DELTA_PAGE && (b *= this._bufferService.rows),
                        b
                    }
                    ,
                    c.prototype._applyScrollModifier = function(a, b) {
                        var e = this._optionsService.rawOptions.fastScrollModifier;
                        return "alt" === e && b.altKey || "ctrl" === e && b.ctrlKey || "shift" === e && b.shiftKey ? a * this._optionsService.rawOptions.fastScrollSensitivity * this._optionsService.rawOptions.scrollSensitivity : a * this._optionsService.rawOptions.scrollSensitivity
                    }
                    ,
                    c.prototype.onTouchStart = function(a) {
                        this._lastTouchY = a.touches[0].pageY
                    }
                    ,
                    c.prototype.onTouchMove = function(a) {
                        var b = this._lastTouchY - a.touches[0].pageY;
                        return this._lastTouchY = a.touches[0].pageY,
                        0 !== b && (this._viewportElement.scrollTop += b,
                        this._bubbleScroll(a, b))
                    }
                    ,
                    p([t(4, k.IBufferService), t(5, k.IOptionsService), t(6, g.ICharSizeService), t(7, g.IRenderService)], c)
                }(A.Disposable);
                l.Viewport = q
            },
            2950: function(A, l, q) {
                var h = this && this.__decorate || function(n, g, k, d) {
                    var c, a = arguments.length, b = 3 > a ? g : null === d ? d = Object.getOwnPropertyDescriptor(g, k) : d;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        b = Reflect.decorate(n, g, k, d);
                    else
                        for (var e = n.length - 1; 0 <= e; e--)
                            (c = n[e]) && (b = (3 > a ? c(b) : 3 < a ? c(g, k, b) : c(g, k)) || b);
                    return 3 < a && b && Object.defineProperty(g, k, b),
                    b
                }
                  , v = this && this.__param || function(n, g) {
                    return function(k, d) {
                        g(k, d, n)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CompositionHelper = void 0;
                var p = q(4725)
                  , t = q(2585);
                A = function() {
                    function n(g, k, d, c, a, b) {
                        this._textarea = g;
                        this._compositionView = k;
                        this._bufferService = d;
                        this._optionsService = c;
                        this._coreService = a;
                        this._renderService = b;
                        this._isSendingComposition = this._isComposing = !1;
                        this._compositionPosition = {
                            start: 0,
                            end: 0
                        };
                        this._dataAlreadySent = ""
                    }
                    return Object.defineProperty(n.prototype, "isComposing", {
                        get: function() {
                            return this._isComposing
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    n.prototype.compositionstart = function() {
                        this._isComposing = !0;
                        this._compositionPosition.start = this._textarea.value.length;
                        this._dataAlreadySent = this._compositionView.textContent = "";
                        this._compositionView.classList.add("active")
                    }
                    ,
                    n.prototype.compositionupdate = function(g) {
                        var k = this;
                        this._compositionView.textContent = g.data;
                        this.updateCompositionElements();
                        setTimeout(function() {
                            k._compositionPosition.end = k._textarea.value.length
                        }, 0)
                    }
                    ,
                    n.prototype.compositionend = function() {
                        this._finalizeComposition(!0)
                    }
                    ,
                    n.prototype.keydown = function(g) {
                        if (this._isComposing || this._isSendingComposition) {
                            if (229 === g.keyCode || 16 === g.keyCode || 17 === g.keyCode || 18 === g.keyCode)
                                return !1;
                            this._finalizeComposition(!1)
                        }
                        return 229 !== g.keyCode || (this._handleAnyTextareaChanges(),
                        !1)
                    }
                    ,
                    n.prototype._finalizeComposition = function(g) {
                        var k = this;
                        if (this._compositionView.classList.remove("active"),
                        this._isComposing = !1,
                        g) {
                            var d = this._compositionPosition.start
                              , c = this._compositionPosition.end;
                            this._isSendingComposition = !0;
                            setTimeout(function() {
                                if (k._isSendingComposition) {
                                    k._isSendingComposition = !1;
                                    var a;
                                    d += k._dataAlreadySent.length;
                                    0 < (a = k._isComposing ? k._textarea.value.substring(d, c) : k._textarea.value.substring(d)).length && k._coreService.triggerDataEvent(a, !0)
                                }
                            }, 0)
                        } else
                            this._isSendingComposition = !1,
                            g = this._textarea.value.substring(this._compositionPosition.start, this._compositionPosition.end),
                            this._coreService.triggerDataEvent(g, !0)
                    }
                    ,
                    n.prototype._handleAnyTextareaChanges = function() {
                        var g = this
                          , k = this._textarea.value;
                        setTimeout(function() {
                            if (!g._isComposing) {
                                var d = g._textarea.value.replace(k, "");
                                0 < d.length && (g._dataAlreadySent = d,
                                g._coreService.triggerDataEvent(d, !0))
                            }
                        }, 0)
                    }
                    ,
                    n.prototype.updateCompositionElements = function(g) {
                        var k = this;
                        if (this._isComposing) {
                            if (this._bufferService.buffer.isCursorInViewport) {
                                var d = this._renderService.dimensions.actualCellHeight
                                  , c = this._bufferService.buffer.y * this._renderService.dimensions.actualCellHeight
                                  , a = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1) * this._renderService.dimensions.actualCellWidth;
                                this._compositionView.style.left = a + "px";
                                this._compositionView.style.top = c + "px";
                                this._compositionView.style.height = d + "px";
                                this._compositionView.style.lineHeight = d + "px";
                                this._compositionView.style.fontFamily = this._optionsService.rawOptions.fontFamily;
                                this._compositionView.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
                                d = this._compositionView.getBoundingClientRect();
                                this._textarea.style.left = a + "px";
                                this._textarea.style.top = c + "px";
                                this._textarea.style.width = Math.max(d.width, 1) + "px";
                                this._textarea.style.height = Math.max(d.height, 1) + "px";
                                this._textarea.style.lineHeight = d.height + "px"
                            }
                            g || setTimeout(function() {
                                return k.updateCompositionElements(!0)
                            }, 0)
                        }
                    }
                    ,
                    h([v(2, t.IBufferService), v(3, t.IOptionsService), v(4, t.ICoreService), v(5, p.IRenderService)], n)
                }();
                l.CompositionHelper = A
            },
            9806: (A, l) => {
                function q(h, v) {
                    v = v.getBoundingClientRect();
                    return [h.clientX - v.left, h.clientY - v.top]
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.getRawByteCoords = l.getCoords = l.getCoordsRelativeToElement = void 0;
                l.getCoordsRelativeToElement = q;
                l.getCoords = function(h, v, p, t, n, g, k, d) {
                    if (n && (h = q(h, v)))
                        return h[0] = Math.ceil((h[0] + (d ? g / 2 : 0)) / g),
                        h[1] = Math.ceil(h[1] / k),
                        h[0] = Math.min(Math.max(h[0], 1), p + (d ? 1 : 0)),
                        h[1] = Math.min(Math.max(h[1], 1), t),
                        h
                }
                ;
                l.getRawByteCoords = function(h) {
                    if (h)
                        return {
                            x: h[0] + 32,
                            y: h[1] + 32
                        }
                }
            }
            ,
            9504: (A, l, q) => {
                function h(k, d, c, a) {
                    var b = k - v(c, k)
                      , e = d - v(c, d);
                    b = Math.abs(b - e);
                    e = 0;
                    for (var f = k - v(c, k), m = d - v(c, d), u = 0; u < Math.abs(f - m); u++) {
                        var w = c.buffer.lines.get(f + ("A" === (k > d ? "A" : "B") ? -1 : 1) * u);
                        (null == w ? 0 : w.isWrapped) && e++
                    }
                    return n(b - e, t(k > d ? "A" : "B", a))
                }
                function v(k, d) {
                    for (var c = 0, a = k.buffer.lines.get(d), b = null == a ? void 0 : a.isWrapped; b && 0 <= d && d < k.rows; )
                        c++,
                        b = null == (a = k.buffer.lines.get(--d)) ? void 0 : a.isWrapped;
                    return c
                }
                function p(k, d, c, a, b, e) {
                    for (var f = k, m = ""; f !== c || d !== a; )
                        f += b ? 1 : -1,
                        b && f > e.cols - 1 ? (m += e.buffer.translateBufferLineToString(d, !1, k, f),
                        f = 0,
                        k = 0,
                        d++) : !b && 0 > f && (m += e.buffer.translateBufferLineToString(d, !1, 0, k + 1),
                        k = f = e.cols - 1,
                        d--);
                    return m + e.buffer.translateBufferLineToString(d, !1, k, f)
                }
                function t(k, d) {
                    return g.C0.ESC + (d ? "O" : "[") + k
                }
                function n(k, d) {
                    k = Math.floor(k);
                    for (var c = "", a = 0; a < k; a++)
                        c += d;
                    return c
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.moveToCellSequence = void 0;
                var g = q(2584);
                l.moveToCellSequence = function(k, d, c, a) {
                    var b, e = c.buffer.x, f = c.buffer.y;
                    return c.buffer.hasScrollback ? f === d ? (b = e > k ? "D" : "C",
                    n(Math.abs(e - k), t(b, a))) : n(c.cols - (f > d ? k : e) + (Math.abs(f - d) - 1) * c.cols + 1 + ((f > d ? e : k) - 1), t(f > d ? "D" : "C", a)) : function(m, u, w, r, z, C) {
                        return 0 === h(u, r, z, C).length ? "" : n(p(m, u, m, u - v(z, u), !1, z).length, t("D", C))
                    }(e, f, 0, d, c, a) + h(f, d, c, a) + function(m, u, w, r, z, C) {
                        var J = 0 < h(u, r, z, C).length ? r - v(z, r) : u;
                        var F;
                        u = (F = 0 < h(w, r, z, C).length ? r - v(z, r) : u,
                        m < w && F <= r || m >= w && F < r ? "C" : "D");
                        return n(p(m, J, w, r, "C" === u, z).length, t(u, C))
                    }(e, f, k, d, c, a)
                }
            }
            ,
            4389: function(A, l, q) {
                var h = this && this.__assign || function() {
                    return h = Object.assign || function(c) {
                        for (var a, b = 1, e = arguments.length; b < e; b++)
                            for (var f in a = arguments[b])
                                Object.prototype.hasOwnProperty.call(a, f) && (c[f] = a[f]);
                        return c
                    }
                    ,
                    h.apply(this, arguments)
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Terminal = void 0;
                var v = q(3236)
                  , p = q(9042)
                  , t = q(7975)
                  , n = q(7090)
                  , g = q(5741)
                  , k = q(8285)
                  , d = ["cols", "rows"];
                A = function() {
                    function c(a) {
                        var b = this;
                        this._core = new v.Terminal(a);
                        this._addonManager = new g.AddonManager;
                        this._publicOptions = h({}, this._core.options);
                        a = function(u) {
                            return b._core.options[u]
                        }
                        ;
                        var e = function(u, w) {
                            b._checkReadonlyOptions(u);
                            b._core.options[u] = w
                        }, f;
                        for (f in this._core.options) {
                            var m = {
                                get: a.bind(this, f),
                                set: e.bind(this, f)
                            };
                            Object.defineProperty(this._publicOptions, f, m)
                        }
                    }
                    return c.prototype._checkReadonlyOptions = function(a) {
                        if (d.includes(a))
                            throw Error('Option "' + a + '" can only be set in the constructor');
                    }
                    ,
                    c.prototype._checkProposedApi = function() {
                        if (!this._core.optionsService.rawOptions.allowProposedApi)
                            throw Error("You must set the allowProposedApi option to true to use proposed API");
                    }
                    ,
                    Object.defineProperty(c.prototype, "onBell", {
                        get: function() {
                            return this._core.onBell
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onBinary", {
                        get: function() {
                            return this._core.onBinary
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onCursorMove", {
                        get: function() {
                            return this._core.onCursorMove
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onData", {
                        get: function() {
                            return this._core.onData
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onKey", {
                        get: function() {
                            return this._core.onKey
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onLineFeed", {
                        get: function() {
                            return this._core.onLineFeed
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onRender", {
                        get: function() {
                            return this._core.onRender
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onResize", {
                        get: function() {
                            return this._core.onResize
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onScroll", {
                        get: function() {
                            return this._core.onScroll
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onSelectionChange", {
                        get: function() {
                            return this._core.onSelectionChange
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onTitleChange", {
                        get: function() {
                            return this._core.onTitleChange
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "element", {
                        get: function() {
                            return this._core.element
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "parser", {
                        get: function() {
                            return this._checkProposedApi(),
                            this._parser || (this._parser = new t.ParserApi(this._core)),
                            this._parser
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "unicode", {
                        get: function() {
                            return this._checkProposedApi(),
                            new n.UnicodeApi(this._core)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "textarea", {
                        get: function() {
                            return this._core.textarea
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "rows", {
                        get: function() {
                            return this._core.rows
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "cols", {
                        get: function() {
                            return this._core.cols
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "buffer", {
                        get: function() {
                            return this._checkProposedApi(),
                            this._buffer || (this._buffer = new k.BufferNamespaceApi(this._core)),
                            this._buffer
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "markers", {
                        get: function() {
                            return this._checkProposedApi(),
                            this._core.markers
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "modes", {
                        get: function() {
                            var a = this._core.coreService.decPrivateModes
                              , b = "none";
                            switch (this._core.coreMouseService.activeProtocol) {
                            case "X10":
                                b = "x10";
                                break;
                            case "VT200":
                                b = "vt200";
                                break;
                            case "DRAG":
                                b = "drag";
                                break;
                            case "ANY":
                                b = "any"
                            }
                            return {
                                applicationCursorKeysMode: a.applicationCursorKeys,
                                applicationKeypadMode: a.applicationKeypad,
                                bracketedPasteMode: a.bracketedPasteMode,
                                insertMode: this._core.coreService.modes.insertMode,
                                mouseTrackingMode: b,
                                originMode: a.origin,
                                reverseWraparoundMode: a.reverseWraparound,
                                sendFocusMode: a.sendFocus,
                                wraparoundMode: a.wraparound
                            }
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "options", {
                        get: function() {
                            return this._publicOptions
                        },
                        set: function(a) {
                            for (var b in a)
                                this._publicOptions[b] = a[b]
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype.blur = function() {
                        this._core.blur()
                    }
                    ,
                    c.prototype.focus = function() {
                        this._core.focus()
                    }
                    ,
                    c.prototype.resize = function(a, b) {
                        this._verifyIntegers(a, b);
                        this._core.resize(a, b)
                    }
                    ,
                    c.prototype.open = function(a) {
                        this._core.open(a)
                    }
                    ,
                    c.prototype.attachCustomKeyEventHandler = function(a) {
                        this._core.attachCustomKeyEventHandler(a)
                    }
                    ,
                    c.prototype.registerLinkMatcher = function(a, b, e) {
                        return this._checkProposedApi(),
                        this._core.registerLinkMatcher(a, b, e)
                    }
                    ,
                    c.prototype.deregisterLinkMatcher = function(a) {
                        this._checkProposedApi();
                        this._core.deregisterLinkMatcher(a)
                    }
                    ,
                    c.prototype.registerLinkProvider = function(a) {
                        return this._checkProposedApi(),
                        this._core.registerLinkProvider(a)
                    }
                    ,
                    c.prototype.registerCharacterJoiner = function(a) {
                        return this._checkProposedApi(),
                        this._core.registerCharacterJoiner(a)
                    }
                    ,
                    c.prototype.deregisterCharacterJoiner = function(a) {
                        this._checkProposedApi();
                        this._core.deregisterCharacterJoiner(a)
                    }
                    ,
                    c.prototype.registerMarker = function(a) {
                        return this._checkProposedApi(),
                        this._verifyIntegers(a),
                        this._core.addMarker(a)
                    }
                    ,
                    c.prototype.addMarker = function(a) {
                        return this.registerMarker(a)
                    }
                    ,
                    c.prototype.hasSelection = function() {
                        return this._core.hasSelection()
                    }
                    ,
                    c.prototype.select = function(a, b, e) {
                        this._verifyIntegers(a, b, e);
                        this._core.select(a, b, e)
                    }
                    ,
                    c.prototype.getSelection = function() {
                        return this._core.getSelection()
                    }
                    ,
                    c.prototype.getSelectionPosition = function() {
                        return this._core.getSelectionPosition()
                    }
                    ,
                    c.prototype.clearSelection = function() {
                        this._core.clearSelection()
                    }
                    ,
                    c.prototype.selectAll = function() {
                        this._core.selectAll()
                    }
                    ,
                    c.prototype.selectLines = function(a, b) {
                        this._verifyIntegers(a, b);
                        this._core.selectLines(a, b)
                    }
                    ,
                    c.prototype.dispose = function() {
                        this._addonManager.dispose();
                        this._core.dispose()
                    }
                    ,
                    c.prototype.scrollLines = function(a) {
                        this._verifyIntegers(a);
                        this._core.scrollLines(a)
                    }
                    ,
                    c.prototype.scrollPages = function(a) {
                        this._verifyIntegers(a);
                        this._core.scrollPages(a)
                    }
                    ,
                    c.prototype.scrollToTop = function() {
                        this._core.scrollToTop()
                    }
                    ,
                    c.prototype.scrollToBottom = function() {
                        this._core.scrollToBottom()
                    }
                    ,
                    c.prototype.scrollToLine = function(a) {
                        this._verifyIntegers(a);
                        this._core.scrollToLine(a)
                    }
                    ,
                    c.prototype.clear = function() {
                        this._core.clear()
                    }
                    ,
                    c.prototype.write = function(a, b) {
                        this._core.write(a, b)
                    }
                    ,
                    c.prototype.writeUtf8 = function(a, b) {
                        this._core.write(a, b)
                    }
                    ,
                    c.prototype.writeln = function(a, b) {
                        this._core.write(a);
                        this._core.write("\r\n", b)
                    }
                    ,
                    c.prototype.paste = function(a) {
                        this._core.paste(a)
                    }
                    ,
                    c.prototype.getOption = function(a) {
                        return this._core.optionsService.getOption(a)
                    }
                    ,
                    c.prototype.setOption = function(a, b) {
                        this._checkReadonlyOptions(a);
                        this._core.optionsService.setOption(a, b)
                    }
                    ,
                    c.prototype.refresh = function(a, b) {
                        this._verifyIntegers(a, b);
                        this._core.refresh(a, b)
                    }
                    ,
                    c.prototype.reset = function() {
                        this._core.reset()
                    }
                    ,
                    c.prototype.clearTextureAtlas = function() {
                        this._core.clearTextureAtlas()
                    }
                    ,
                    c.prototype.loadAddon = function(a) {
                        return this._addonManager.loadAddon(this, a)
                    }
                    ,
                    Object.defineProperty(c, "strings", {
                        get: function() {
                            return p
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype._verifyIntegers = function() {
                        for (var a = [], b = 0; b < arguments.length; b++)
                            a[b] = arguments[b];
                        for (b = 0; b < a.length; b++) {
                            var e = a[b];
                            if (e === 1 / 0 || isNaN(e) || 0 != e % 1)
                                throw Error("This API only accepts integers");
                        }
                    }
                    ,
                    c
                }();
                l.Terminal = A
            },
            1546: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BaseRenderLayer = void 0;
                var h = q(643)
                  , v = q(8803)
                  , p = q(1420)
                  , t = q(3734)
                  , n = q(1752)
                  , g = q(4774)
                  , k = q(9631)
                  , d = q(8978);
                A = function() {
                    function c(a, b, e, f, m, u, w, r) {
                        this._container = a;
                        this._alpha = f;
                        this._colors = m;
                        this._rendererId = u;
                        this._bufferService = w;
                        this._optionsService = r;
                        this._scaledCharTop = this._scaledCharLeft = this._scaledCellHeight = this._scaledCellWidth = this._scaledCharHeight = this._scaledCharWidth = 0;
                        this._currentGlyphIdentifier = {
                            chars: "",
                            code: 0,
                            bg: 0,
                            fg: 0,
                            bold: !1,
                            dim: !1,
                            italic: !1
                        };
                        this._canvas = document.createElement("canvas");
                        this._canvas.classList.add("xterm-" + b + "-layer");
                        this._canvas.style.zIndex = e.toString();
                        this._initCanvas();
                        this._container.appendChild(this._canvas)
                    }
                    return c.prototype.dispose = function() {
                        var a;
                        (0,
                        k.removeElementFromParent)(this._canvas);
                        null === (a = this._charAtlas) || void 0 === a || a.dispose()
                    }
                    ,
                    c.prototype._initCanvas = function() {
                        this._ctx = (0,
                        n.throwIfFalsy)(this._canvas.getContext("2d", {
                            alpha: this._alpha
                        }));
                        this._alpha || this._clearAll()
                    }
                    ,
                    c.prototype.onOptionsChanged = function() {}
                    ,
                    c.prototype.onBlur = function() {}
                    ,
                    c.prototype.onFocus = function() {}
                    ,
                    c.prototype.onCursorMove = function() {}
                    ,
                    c.prototype.onGridChanged = function(a, b) {}
                    ,
                    c.prototype.onSelectionChanged = function(a, b, e) {}
                    ,
                    c.prototype.setColors = function(a) {
                        this._refreshCharAtlas(a)
                    }
                    ,
                    c.prototype._setTransparency = function(a) {
                        if (a !== this._alpha) {
                            var b = this._canvas;
                            this._alpha = a;
                            this._canvas = this._canvas.cloneNode();
                            this._initCanvas();
                            this._container.replaceChild(this._canvas, b);
                            this._refreshCharAtlas(this._colors);
                            this.onGridChanged(0, this._bufferService.rows - 1)
                        }
                    }
                    ,
                    c.prototype._refreshCharAtlas = function(a) {
                        0 >= this._scaledCharWidth && 0 >= this._scaledCharHeight || (this._charAtlas = (0,
                        p.acquireCharAtlas)(this._optionsService.rawOptions, this._rendererId, a, this._scaledCharWidth, this._scaledCharHeight),
                        this._charAtlas.warmUp())
                    }
                    ,
                    c.prototype.resize = function(a) {
                        this._scaledCellWidth = a.scaledCellWidth;
                        this._scaledCellHeight = a.scaledCellHeight;
                        this._scaledCharWidth = a.scaledCharWidth;
                        this._scaledCharHeight = a.scaledCharHeight;
                        this._scaledCharLeft = a.scaledCharLeft;
                        this._scaledCharTop = a.scaledCharTop;
                        this._canvas.width = a.scaledCanvasWidth;
                        this._canvas.height = a.scaledCanvasHeight;
                        this._canvas.style.width = a.canvasWidth + "px";
                        this._canvas.style.height = a.canvasHeight + "px";
                        this._alpha || this._clearAll();
                        this._refreshCharAtlas(this._colors)
                    }
                    ,
                    c.prototype.clearTextureAtlas = function() {
                        var a;
                        null === (a = this._charAtlas) || void 0 === a || a.clear()
                    }
                    ,
                    c.prototype._fillCells = function(a, b, e, f) {
                        this._ctx.fillRect(a * this._scaledCellWidth, b * this._scaledCellHeight, e * this._scaledCellWidth, f * this._scaledCellHeight)
                    }
                    ,
                    c.prototype._fillMiddleLineAtCells = function(a, b, e) {
                        void 0 === e && (e = 1);
                        this._ctx.fillRect(a * this._scaledCellWidth, (b + 1) * this._scaledCellHeight - Math.ceil(.5 * this._scaledCellHeight) - window.devicePixelRatio, e * this._scaledCellWidth, window.devicePixelRatio)
                    }
                    ,
                    c.prototype._fillBottomLineAtCells = function(a, b, e) {
                        void 0 === e && (e = 1);
                        this._ctx.fillRect(a * this._scaledCellWidth, (b + 1) * this._scaledCellHeight - window.devicePixelRatio - 1, e * this._scaledCellWidth, window.devicePixelRatio)
                    }
                    ,
                    c.prototype._fillLeftLineAtCell = function(a, b, e) {
                        this._ctx.fillRect(a * this._scaledCellWidth, b * this._scaledCellHeight, window.devicePixelRatio * e, this._scaledCellHeight)
                    }
                    ,
                    c.prototype._strokeRectAtCell = function(a, b, e, f) {
                        this._ctx.lineWidth = window.devicePixelRatio;
                        this._ctx.strokeRect(a * this._scaledCellWidth + window.devicePixelRatio / 2, b * this._scaledCellHeight + window.devicePixelRatio / 2, e * this._scaledCellWidth - window.devicePixelRatio, f * this._scaledCellHeight - window.devicePixelRatio)
                    }
                    ,
                    c.prototype._clearAll = function() {
                        this._alpha ? this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height) : (this._ctx.fillStyle = this._colors.background.css,
                        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height))
                    }
                    ,
                    c.prototype._clearCells = function(a, b, e, f) {
                        this._alpha ? this._ctx.clearRect(a * this._scaledCellWidth, b * this._scaledCellHeight, e * this._scaledCellWidth, f * this._scaledCellHeight) : (this._ctx.fillStyle = this._colors.background.css,
                        this._ctx.fillRect(a * this._scaledCellWidth, b * this._scaledCellHeight, e * this._scaledCellWidth, f * this._scaledCellHeight))
                    }
                    ,
                    c.prototype._fillCharTrueColor = function(a, b, e) {
                        this._ctx.font = this._getFont(!1, !1);
                        this._ctx.textBaseline = v.TEXT_BASELINE;
                        this._clipRow(e);
                        var f = !1;
                        !1 !== this._optionsService.rawOptions.customGlyphs && (f = (0,
                        d.tryDrawCustomChar)(this._ctx, a.getChars(), b * this._scaledCellWidth, e * this._scaledCellHeight, this._scaledCellWidth, this._scaledCellHeight));
                        f || this._ctx.fillText(a.getChars(), b * this._scaledCellWidth + this._scaledCharLeft, e * this._scaledCellHeight + this._scaledCharTop + this._scaledCharHeight)
                    }
                    ,
                    c.prototype._drawChars = function(a, b, e) {
                        var f, m, u, w = this._getContrastColor(a);
                        w || a.isFgRGB() || a.isBgRGB() ? this._drawUncachedChars(a, b, e, w) : (a.isInverse() ? (m = a.isBgDefault() ? v.INVERTED_DEFAULT_COLOR : a.getBgColor(),
                        u = a.isFgDefault() ? v.INVERTED_DEFAULT_COLOR : a.getFgColor()) : (u = a.isBgDefault() ? h.DEFAULT_COLOR : a.getBgColor(),
                        m = a.isFgDefault() ? h.DEFAULT_COLOR : a.getFgColor()),
                        m += this._optionsService.rawOptions.drawBoldTextInBrightColors && a.isBold() && 8 > m ? 8 : 0,
                        this._currentGlyphIdentifier.chars = a.getChars() || h.WHITESPACE_CELL_CHAR,
                        this._currentGlyphIdentifier.code = a.getCode() || h.WHITESPACE_CELL_CODE,
                        this._currentGlyphIdentifier.bg = u,
                        this._currentGlyphIdentifier.fg = m,
                        this._currentGlyphIdentifier.bold = !!a.isBold(),
                        this._currentGlyphIdentifier.dim = !!a.isDim(),
                        this._currentGlyphIdentifier.italic = !!a.isItalic(),
                        (null === (f = this._charAtlas) || void 0 === f ? void 0 : f.draw(this._ctx, this._currentGlyphIdentifier, b * this._scaledCellWidth + this._scaledCharLeft, e * this._scaledCellHeight + this._scaledCharTop)) || this._drawUncachedChars(a, b, e))
                    }
                    ,
                    c.prototype._drawUncachedChars = function(a, b, e, f) {
                        (this._ctx.save(),
                        this._ctx.font = this._getFont(!!a.isBold(), !!a.isItalic()),
                        this._ctx.textBaseline = v.TEXT_BASELINE,
                        a.isInverse()) ? f ? this._ctx.fillStyle = f.css : a.isBgDefault() ? this._ctx.fillStyle = g.color.opaque(this._colors.background).css : a.isBgRGB() ? this._ctx.fillStyle = "rgb(" + t.AttributeData.toColorRGB(a.getBgColor()).join(",") + ")" : (f = a.getBgColor(),
                        this._optionsService.rawOptions.drawBoldTextInBrightColors && a.isBold() && 8 > f && (f += 8),
                        this._ctx.fillStyle = this._colors.ansi[f].css) : f ? this._ctx.fillStyle = f.css : a.isFgDefault() ? this._ctx.fillStyle = this._colors.foreground.css : a.isFgRGB() ? this._ctx.fillStyle = "rgb(" + t.AttributeData.toColorRGB(a.getFgColor()).join(",") + ")" : (f = a.getFgColor(),
                        this._optionsService.rawOptions.drawBoldTextInBrightColors && a.isBold() && 8 > f && (f += 8),
                        this._ctx.fillStyle = this._colors.ansi[f].css);
                        this._clipRow(e);
                        a.isDim() && (this._ctx.globalAlpha = v.DIM_OPACITY);
                        f = !1;
                        !1 !== this._optionsService.rawOptions.customGlyphs && (f = (0,
                        d.tryDrawCustomChar)(this._ctx, a.getChars(), b * this._scaledCellWidth, e * this._scaledCellHeight, this._scaledCellWidth, this._scaledCellHeight));
                        f || this._ctx.fillText(a.getChars(), b * this._scaledCellWidth + this._scaledCharLeft, e * this._scaledCellHeight + this._scaledCharTop + this._scaledCharHeight);
                        this._ctx.restore()
                    }
                    ,
                    c.prototype._clipRow = function(a) {
                        this._ctx.beginPath();
                        this._ctx.rect(0, a * this._scaledCellHeight, this._bufferService.cols * this._scaledCellWidth, this._scaledCellHeight);
                        this._ctx.clip()
                    }
                    ,
                    c.prototype._getFont = function(a, b) {
                        return (b ? "italic" : "") + " " + (a ? this._optionsService.rawOptions.fontWeightBold : this._optionsService.rawOptions.fontWeight) + " " + this._optionsService.rawOptions.fontSize * window.devicePixelRatio + "px " + this._optionsService.rawOptions.fontFamily
                    }
                    ,
                    c.prototype._getContrastColor = function(a) {
                        if (1 !== this._optionsService.rawOptions.minimumContrastRatio) {
                            var b = this._colors.contrastCache.getColor(a.bg, a.fg);
                            if (void 0 !== b)
                                return b || void 0;
                            b = a.getFgColor();
                            var e = a.getFgColorMode()
                              , f = a.getBgColor()
                              , m = a.getBgColorMode()
                              , u = !!a.isInverse()
                              , w = !!a.isInverse();
                            if (u) {
                                var r = b;
                                b = f;
                                f = r;
                                r = e;
                                e = m;
                                m = r
                            }
                            f = this._resolveBackgroundRgba(m, f, u);
                            b = this._resolveForegroundRgba(e, b, u, w);
                            if (b = g.rgba.ensureContrastRatio(f, b, this._optionsService.rawOptions.minimumContrastRatio))
                                return b = {
                                    css: g.channels.toCss(b >> 24 & 255, b >> 16 & 255, b >> 8 & 255),
                                    rgba: b
                                },
                                this._colors.contrastCache.setColor(a.bg, a.fg, b),
                                b;
                            this._colors.contrastCache.setColor(a.bg, a.fg, null)
                        }
                    }
                    ,
                    c.prototype._resolveBackgroundRgba = function(a, b, e) {
                        switch (a) {
                        case 16777216:
                        case 33554432:
                            return this._colors.ansi[b].rgba;
                        case 50331648:
                            return b << 8;
                        default:
                            return e ? this._colors.foreground.rgba : this._colors.background.rgba
                        }
                    }
                    ,
                    c.prototype._resolveForegroundRgba = function(a, b, e, f) {
                        switch (a) {
                        case 16777216:
                        case 33554432:
                            return this._optionsService.rawOptions.drawBoldTextInBrightColors && f && 8 > b && (b += 8),
                            this._colors.ansi[b].rgba;
                        case 50331648:
                            return b << 8;
                        default:
                            return e ? this._colors.background.rgba : this._colors.foreground.rgba
                        }
                    }
                    ,
                    c
                }();
                l.BaseRenderLayer = A
            }
            ,
            2512: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(c, a) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(b, e) {
                        b.__proto__ = e
                    }
                    || function(b, e) {
                        for (var f in e)
                            Object.prototype.hasOwnProperty.call(e, f) && (b[f] = e[f])
                    }
                    ,
                    h(c, a)
                }
                ,
                function(c, a) {
                    function b() {
                        this.constructor = c
                    }
                    if ("function" != typeof a && null !== a)
                        throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
                    h(c, a);
                    c.prototype = null === a ? Object.create(a) : (b.prototype = a.prototype,
                    new b)
                }
                ), p = this && this.__decorate || function(c, a, b, e) {
                    var f, m = arguments.length, u = 3 > m ? a : null === e ? e = Object.getOwnPropertyDescriptor(a, b) : e;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        u = Reflect.decorate(c, a, b, e);
                    else
                        for (var w = c.length - 1; 0 <= w; w--)
                            (f = c[w]) && (u = (3 > m ? f(u) : 3 < m ? f(a, b, u) : f(a, b)) || u);
                    return 3 < m && u && Object.defineProperty(a, b, u),
                    u
                }
                , t = this && this.__param || function(c, a) {
                    return function(b, e) {
                        a(b, e, c)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CursorRenderLayer = void 0;
                A = q(1546);
                var n = q(511)
                  , g = q(2585)
                  , k = q(4725);
                q = function(c) {
                    function a(b, e, f, m, u, w, r, z, C) {
                        b = c.call(this, b, "cursor", e, !0, f, m, w, r) || this;
                        return b._onRequestRedraw = u,
                        b._coreService = z,
                        b._coreBrowserService = C,
                        b._cell = new n.CellData,
                        b._state = {
                            x: 0,
                            y: 0,
                            isFocused: !1,
                            style: "",
                            width: 0
                        },
                        b._cursorRenderers = {
                            bar: b._renderBarCursor.bind(b),
                            block: b._renderBlockCursor.bind(b),
                            underline: b._renderUnderlineCursor.bind(b)
                        },
                        b
                    }
                    return v(a, c),
                    a.prototype.dispose = function() {
                        this._cursorBlinkStateManager && (this._cursorBlinkStateManager.dispose(),
                        this._cursorBlinkStateManager = void 0);
                        c.prototype.dispose.call(this)
                    }
                    ,
                    a.prototype.resize = function(b) {
                        c.prototype.resize.call(this, b);
                        this._state = {
                            x: 0,
                            y: 0,
                            isFocused: !1,
                            style: "",
                            width: 0
                        }
                    }
                    ,
                    a.prototype.reset = function() {
                        var b;
                        this._clearCursor();
                        null === (b = this._cursorBlinkStateManager) || void 0 === b || b.restartBlinkAnimation();
                        this.onOptionsChanged()
                    }
                    ,
                    a.prototype.onBlur = function() {
                        var b;
                        null === (b = this._cursorBlinkStateManager) || void 0 === b || b.pause();
                        this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }
                    ,
                    a.prototype.onFocus = function() {
                        var b;
                        null === (b = this._cursorBlinkStateManager) || void 0 === b || b.resume();
                        this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }
                    ,
                    a.prototype.onOptionsChanged = function() {
                        var b, e = this;
                        this._optionsService.rawOptions.cursorBlink ? this._cursorBlinkStateManager || (this._cursorBlinkStateManager = new d(this._coreBrowserService.isFocused,function() {
                            e._render(!0)
                        }
                        )) : (null === (b = this._cursorBlinkStateManager) || void 0 === b || b.dispose(),
                        this._cursorBlinkStateManager = void 0);
                        this._onRequestRedraw.fire({
                            start: this._bufferService.buffer.y,
                            end: this._bufferService.buffer.y
                        })
                    }
                    ,
                    a.prototype.onCursorMove = function() {
                        var b;
                        null === (b = this._cursorBlinkStateManager) || void 0 === b || b.restartBlinkAnimation()
                    }
                    ,
                    a.prototype.onGridChanged = function(b, e) {
                        !this._cursorBlinkStateManager || this._cursorBlinkStateManager.isPaused ? this._render(!1) : this._cursorBlinkStateManager.restartBlinkAnimation()
                    }
                    ,
                    a.prototype._render = function(b) {
                        if (this._coreService.isCursorInitialized && !this._coreService.isCursorHidden) {
                            var e = this._bufferService.buffer.ybase + this._bufferService.buffer.y;
                            b = e - this._bufferService.buffer.ydisp;
                            if (0 > b || b >= this._bufferService.rows)
                                this._clearCursor();
                            else {
                                var f = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1);
                                if (this._bufferService.buffer.lines.get(e).loadCell(f, this._cell),
                                void 0 !== this._cell.content) {
                                    if (!this._coreBrowserService.isFocused)
                                        return this._clearCursor(),
                                        this._ctx.save(),
                                        this._ctx.fillStyle = this._colors.cursor.css,
                                        e = this._optionsService.rawOptions.cursorStyle,
                                        e && "block" !== e ? this._cursorRenderers[e](f, b, this._cell) : this._renderBlurCursor(f, b, this._cell),
                                        this._ctx.restore(),
                                        this._state.x = f,
                                        this._state.y = b,
                                        this._state.isFocused = !1,
                                        this._state.style = e,
                                        void (this._state.width = this._cell.getWidth());
                                    if (!this._cursorBlinkStateManager || this._cursorBlinkStateManager.isCursorVisible) {
                                        if (this._state) {
                                            if (this._state.x === f && this._state.y === b && this._state.isFocused === this._coreBrowserService.isFocused && this._state.style === this._optionsService.rawOptions.cursorStyle && this._state.width === this._cell.getWidth())
                                                return;
                                            this._clearCursor()
                                        }
                                        this._ctx.save();
                                        this._cursorRenderers[this._optionsService.rawOptions.cursorStyle || "block"](f, b, this._cell);
                                        this._ctx.restore();
                                        this._state.x = f;
                                        this._state.y = b;
                                        this._state.isFocused = !1;
                                        this._state.style = this._optionsService.rawOptions.cursorStyle;
                                        this._state.width = this._cell.getWidth()
                                    } else
                                        this._clearCursor()
                                }
                            }
                        } else
                            this._clearCursor()
                    }
                    ,
                    a.prototype._clearCursor = function() {
                        this._state && (1 > window.devicePixelRatio ? this._clearAll() : this._clearCells(this._state.x, this._state.y, this._state.width, 1),
                        this._state = {
                            x: 0,
                            y: 0,
                            isFocused: !1,
                            style: "",
                            width: 0
                        })
                    }
                    ,
                    a.prototype._renderBarCursor = function(b, e, f) {
                        this._ctx.save();
                        this._ctx.fillStyle = this._colors.cursor.css;
                        this._fillLeftLineAtCell(b, e, this._optionsService.rawOptions.cursorWidth);
                        this._ctx.restore()
                    }
                    ,
                    a.prototype._renderBlockCursor = function(b, e, f) {
                        this._ctx.save();
                        this._ctx.fillStyle = this._colors.cursor.css;
                        this._fillCells(b, e, f.getWidth(), 1);
                        this._ctx.fillStyle = this._colors.cursorAccent.css;
                        this._fillCharTrueColor(f, b, e);
                        this._ctx.restore()
                    }
                    ,
                    a.prototype._renderUnderlineCursor = function(b, e, f) {
                        this._ctx.save();
                        this._ctx.fillStyle = this._colors.cursor.css;
                        this._fillBottomLineAtCells(b, e);
                        this._ctx.restore()
                    }
                    ,
                    a.prototype._renderBlurCursor = function(b, e, f) {
                        this._ctx.save();
                        this._ctx.strokeStyle = this._colors.cursor.css;
                        this._strokeRectAtCell(b, e, f.getWidth(), 1);
                        this._ctx.restore()
                    }
                    ,
                    p([t(5, g.IBufferService), t(6, g.IOptionsService), t(7, g.ICoreService), t(8, k.ICoreBrowserService)], a)
                }(A.BaseRenderLayer);
                l.CursorRenderLayer = q;
                var d = function() {
                    function c(a, b) {
                        this._renderCallback = b;
                        this.isCursorVisible = !0;
                        a && this._restartInterval()
                    }
                    return Object.defineProperty(c.prototype, "isPaused", {
                        get: function() {
                            return !(this._blinkStartTimeout || this._blinkInterval)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype.dispose = function() {
                        this._blinkInterval && (window.clearInterval(this._blinkInterval),
                        this._blinkInterval = void 0);
                        this._blinkStartTimeout && (window.clearTimeout(this._blinkStartTimeout),
                        this._blinkStartTimeout = void 0);
                        this._animationFrame && (window.cancelAnimationFrame(this._animationFrame),
                        this._animationFrame = void 0)
                    }
                    ,
                    c.prototype.restartBlinkAnimation = function() {
                        var a = this;
                        this.isPaused || (this._animationTimeRestarted = Date.now(),
                        this.isCursorVisible = !0,
                        this._animationFrame || (this._animationFrame = window.requestAnimationFrame(function() {
                            a._renderCallback();
                            a._animationFrame = void 0
                        })))
                    }
                    ,
                    c.prototype._restartInterval = function(a) {
                        var b = this;
                        void 0 === a && (a = 600);
                        this._blinkInterval && (window.clearInterval(this._blinkInterval),
                        this._blinkInterval = void 0);
                        this._blinkStartTimeout = window.setTimeout(function() {
                            if (b._animationTimeRestarted) {
                                var e = 600 - (Date.now() - b._animationTimeRestarted);
                                if (b._animationTimeRestarted = void 0,
                                0 < e)
                                    return void b._restartInterval(e)
                            }
                            b.isCursorVisible = !1;
                            b._animationFrame = window.requestAnimationFrame(function() {
                                b._renderCallback();
                                b._animationFrame = void 0
                            });
                            b._blinkInterval = window.setInterval(function() {
                                if (b._animationTimeRestarted) {
                                    var f = 600 - (Date.now() - b._animationTimeRestarted);
                                    return b._animationTimeRestarted = void 0,
                                    void b._restartInterval(f)
                                }
                                b.isCursorVisible = !b.isCursorVisible;
                                b._animationFrame = window.requestAnimationFrame(function() {
                                    b._renderCallback();
                                    b._animationFrame = void 0
                                })
                            }, 600)
                        }, a)
                    }
                    ,
                    c.prototype.pause = function() {
                        this.isCursorVisible = !0;
                        this._blinkInterval && (window.clearInterval(this._blinkInterval),
                        this._blinkInterval = void 0);
                        this._blinkStartTimeout && (window.clearTimeout(this._blinkStartTimeout),
                        this._blinkStartTimeout = void 0);
                        this._animationFrame && (window.cancelAnimationFrame(this._animationFrame),
                        this._animationFrame = void 0)
                    }
                    ,
                    c.prototype.resume = function() {
                        this.pause();
                        this._animationTimeRestarted = void 0;
                        this._restartInterval();
                        this.restartBlinkAnimation()
                    }
                    ,
                    c
                }()
            },
            8978: (A, l, q) => {
                function h(L, K, ia) {
                    return void 0 === ia && (ia = 0),
                    Math.max(Math.min(L, K), ia)
                }
                function v(L, K, ia, ya, za) {
                    L = L.map(function(ma) {
                        return parseFloat(ma) || parseInt(ma)
                    });
                    if (2 > L.length)
                        throw Error("Too few arguments for instruction");
                    for (var ca = 0; ca < L.length; ca += 2)
                        L[ca] *= K,
                        0 !== L[ca] && (L[ca] = h(Math.round(L[ca] + .5) - .5, K, 0)),
                        L[ca] += ya;
                    for (K = 1; K < L.length; K += 2)
                        L[K] *= ia,
                        0 !== L[K] && (L[K] = h(Math.round(L[K] + .5) - .5, ia, 0)),
                        L[K] += za;
                    return L
                }
                var p, t, n, g, k, d, c, a, b, e, f, m, u, w, r, z, C, J, F, B, y, E, G, I, Q, R, W, V, S, D, M, H, x, N, O, U, Y, Z, la, wa, ra, xa, sa, P, aa, ka, ha, ta, Cb, Db, Eb, Fb, Gb, Hb, Ib, Jb, Kb, Lb, Mb, Nb, Ob, Pb, Da, Ea, Fa, Ga, Ha, Ia, Ja, Ka, La, Ma, Na, Oa, Pa, Qa, Ra, Sa, Ta, Ua, Va, Wa, Xa, Ya, Za, $a, ab, bb, cb, db, eb, fb, gb, hb, ib, jb, kb, lb, mb, nb, ob, pb, qb, rb, sb, tb, ub, vb, wb, xb, yb, zb, Qb, Rb, Sb, Tb, Ub, Vb, Wb, Xb, Yb, Zb, $b, ac, bc, cc, dc, ec;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.tryDrawCustomChar = l.boxDrawingDefinitions = l.blockElementDefinitions = void 0;
                var ic = q(1752);
                l.blockElementDefinitions = {
                    "\u2580": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 4
                    }],
                    "\u2581": [{
                        x: 0,
                        y: 7,
                        w: 8,
                        h: 1
                    }],
                    "\u2582": [{
                        x: 0,
                        y: 6,
                        w: 8,
                        h: 2
                    }],
                    "\u2583": [{
                        x: 0,
                        y: 5,
                        w: 8,
                        h: 3
                    }],
                    "\u2584": [{
                        x: 0,
                        y: 4,
                        w: 8,
                        h: 4
                    }],
                    "\u2585": [{
                        x: 0,
                        y: 3,
                        w: 8,
                        h: 5
                    }],
                    "\u2586": [{
                        x: 0,
                        y: 2,
                        w: 8,
                        h: 6
                    }],
                    "\u2587": [{
                        x: 0,
                        y: 1,
                        w: 8,
                        h: 7
                    }],
                    "\u2588": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 8
                    }],
                    "\u2589": [{
                        x: 0,
                        y: 0,
                        w: 7,
                        h: 8
                    }],
                    "\u258a": [{
                        x: 0,
                        y: 0,
                        w: 6,
                        h: 8
                    }],
                    "\u258b": [{
                        x: 0,
                        y: 0,
                        w: 5,
                        h: 8
                    }],
                    "\u258c": [{
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 8
                    }],
                    "\u258d": [{
                        x: 0,
                        y: 0,
                        w: 3,
                        h: 8
                    }],
                    "\u258e": [{
                        x: 0,
                        y: 0,
                        w: 2,
                        h: 8
                    }],
                    "\u258f": [{
                        x: 0,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\u2590": [{
                        x: 4,
                        y: 0,
                        w: 4,
                        h: 8
                    }],
                    "\u2594": [{
                        x: 0,
                        y: 0,
                        w: 9,
                        h: 1
                    }],
                    "\u2595": [{
                        x: 7,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\u2596": [{
                        x: 0,
                        y: 4,
                        w: 4,
                        h: 4
                    }],
                    "\u2597": [{
                        x: 4,
                        y: 4,
                        w: 4,
                        h: 4
                    }],
                    "\u2598": [{
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 4
                    }],
                    "\u2599": [{
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 8
                    }, {
                        x: 0,
                        y: 4,
                        w: 8,
                        h: 4
                    }],
                    "\u259a": [{
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 4
                    }, {
                        x: 4,
                        y: 4,
                        w: 4,
                        h: 4
                    }],
                    "\u259b": [{
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 8
                    }, {
                        x: 0,
                        y: 0,
                        w: 4,
                        h: 8
                    }],
                    "\u259c": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 4
                    }, {
                        x: 4,
                        y: 0,
                        w: 4,
                        h: 8
                    }],
                    "\u259d": [{
                        x: 4,
                        y: 0,
                        w: 4,
                        h: 4
                    }],
                    "\u259e": [{
                        x: 4,
                        y: 0,
                        w: 4,
                        h: 4
                    }, {
                        x: 0,
                        y: 4,
                        w: 4,
                        h: 4
                    }],
                    "\u259f": [{
                        x: 4,
                        y: 0,
                        w: 4,
                        h: 8
                    }, {
                        x: 0,
                        y: 4,
                        w: 8,
                        h: 4
                    }],
                    "\ud83e\udf70": [{
                        x: 1,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf71": [{
                        x: 2,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf72": [{
                        x: 3,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf73": [{
                        x: 4,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf74": [{
                        x: 5,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf75": [{
                        x: 6,
                        y: 0,
                        w: 1,
                        h: 8
                    }],
                    "\ud83e\udf76": [{
                        x: 0,
                        y: 1,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf77": [{
                        x: 0,
                        y: 2,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf78": [{
                        x: 0,
                        y: 3,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf79": [{
                        x: 0,
                        y: 4,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7a": [{
                        x: 0,
                        y: 5,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7b": [{
                        x: 0,
                        y: 6,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7c": [{
                        x: 0,
                        y: 0,
                        w: 1,
                        h: 8
                    }, {
                        x: 0,
                        y: 7,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7d": [{
                        x: 0,
                        y: 0,
                        w: 1,
                        h: 8
                    }, {
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7e": [{
                        x: 7,
                        y: 0,
                        w: 1,
                        h: 8
                    }, {
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf7f": [{
                        x: 7,
                        y: 0,
                        w: 1,
                        h: 8
                    }, {
                        x: 0,
                        y: 7,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf80": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 1
                    }, {
                        x: 0,
                        y: 7,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf81": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 1
                    }, {
                        x: 0,
                        y: 2,
                        w: 8,
                        h: 1
                    }, {
                        x: 0,
                        y: 4,
                        w: 8,
                        h: 1
                    }, {
                        x: 0,
                        y: 7,
                        w: 8,
                        h: 1
                    }],
                    "\ud83e\udf82": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 2
                    }],
                    "\ud83e\udf83": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 3
                    }],
                    "\ud83e\udf84": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 5
                    }],
                    "\ud83e\udf85": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 6
                    }],
                    "\ud83e\udf86": [{
                        x: 0,
                        y: 0,
                        w: 8,
                        h: 7
                    }],
                    "\ud83e\udf87": [{
                        x: 6,
                        y: 0,
                        w: 2,
                        h: 8
                    }],
                    "\ud83e\udf88": [{
                        x: 5,
                        y: 0,
                        w: 3,
                        h: 8
                    }],
                    "\ud83e\udf89": [{
                        x: 3,
                        y: 0,
                        w: 5,
                        h: 8
                    }],
                    "\ud83e\udf8a": [{
                        x: 2,
                        y: 0,
                        w: 6,
                        h: 8
                    }],
                    "\ud83e\udf8b": [{
                        x: 1,
                        y: 0,
                        w: 7,
                        h: 8
                    }],
                    "\ud83e\udf95": [{
                        x: 0,
                        y: 0,
                        w: 2,
                        h: 2
                    }, {
                        x: 4,
                        y: 0,
                        w: 2,
                        h: 2
                    }, {
                        x: 2,
                        y: 2,
                        w: 2,
                        h: 2
                    }, {
                        x: 6,
                        y: 2,
                        w: 2,
                        h: 2
                    }, {
                        x: 0,
                        y: 4,
                        w: 2,
                        h: 2
                    }, {
                        x: 4,
                        y: 4,
                        w: 2,
                        h: 2
                    }, {
                        x: 2,
                        y: 6,
                        w: 2,
                        h: 2
                    }, {
                        x: 6,
                        y: 6,
                        w: 2,
                        h: 2
                    }],
                    "\ud83e\udf96": [{
                        x: 2,
                        y: 0,
                        w: 2,
                        h: 2
                    }, {
                        x: 6,
                        y: 0,
                        w: 2,
                        h: 2
                    }, {
                        x: 0,
                        y: 2,
                        w: 2,
                        h: 2
                    }, {
                        x: 4,
                        y: 2,
                        w: 2,
                        h: 2
                    }, {
                        x: 2,
                        y: 4,
                        w: 2,
                        h: 2
                    }, {
                        x: 6,
                        y: 4,
                        w: 2,
                        h: 2
                    }, {
                        x: 0,
                        y: 6,
                        w: 2,
                        h: 2
                    }, {
                        x: 4,
                        y: 6,
                        w: 2,
                        h: 2
                    }],
                    "\ud83e\udf97": [{
                        x: 0,
                        y: 2,
                        w: 8,
                        h: 2
                    }, {
                        x: 0,
                        y: 6,
                        w: 8,
                        h: 2
                    }]
                };
                var kc = {
                    "\u2591": [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
                    "\u2592": [[1, 0], [0, 0], [0, 1], [0, 0]],
                    "\u2593": [[0, 1], [1, 1], [1, 0], [1, 1]]
                };
                l.boxDrawingDefinitions = {
                    "\u2500": (p = {},
                    p[1] = "M0,.5 L1,.5",
                    p),
                    "\u2501": (t = {},
                    t[3] = "M0,.5 L1,.5",
                    t),
                    "\u2502": (n = {},
                    n[1] = "M.5,0 L.5,1",
                    n),
                    "\u2503": (g = {},
                    g[3] = "M.5,0 L.5,1",
                    g),
                    "\u250c": (k = {},
                    k[1] = "M0.5,1 L.5,.5 L1,.5",
                    k),
                    "\u250f": (d = {},
                    d[3] = "M0.5,1 L.5,.5 L1,.5",
                    d),
                    "\u2510": (c = {},
                    c[1] = "M0,.5 L.5,.5 L.5,1",
                    c),
                    "\u2513": (a = {},
                    a[3] = "M0,.5 L.5,.5 L.5,1",
                    a),
                    "\u2514": (b = {},
                    b[1] = "M.5,0 L.5,.5 L1,.5",
                    b),
                    "\u2517": (e = {},
                    e[3] = "M.5,0 L.5,.5 L1,.5",
                    e),
                    "\u2518": (f = {},
                    f[1] = "M.5,0 L.5,.5 L0,.5",
                    f),
                    "\u251b": (m = {},
                    m[3] = "M.5,0 L.5,.5 L0,.5",
                    m),
                    "\u251c": (u = {},
                    u[1] = "M.5,0 L.5,1 M.5,.5 L1,.5",
                    u),
                    "\u2523": (w = {},
                    w[3] = "M.5,0 L.5,1 M.5,.5 L1,.5",
                    w),
                    "\u2524": (r = {},
                    r[1] = "M.5,0 L.5,1 M.5,.5 L0,.5",
                    r),
                    "\u252b": (z = {},
                    z[3] = "M.5,0 L.5,1 M.5,.5 L0,.5",
                    z),
                    "\u252c": (C = {},
                    C[1] = "M0,.5 L1,.5 M.5,.5 L.5,1",
                    C),
                    "\u2533": (J = {},
                    J[3] = "M0,.5 L1,.5 M.5,.5 L.5,1",
                    J),
                    "\u2534": (F = {},
                    F[1] = "M0,.5 L1,.5 M.5,.5 L.5,0",
                    F),
                    "\u253b": (B = {},
                    B[3] = "M0,.5 L1,.5 M.5,.5 L.5,0",
                    B),
                    "\u253c": (y = {},
                    y[1] = "M0,.5 L1,.5 M.5,0 L.5,1",
                    y),
                    "\u254b": (E = {},
                    E[3] = "M0,.5 L1,.5 M.5,0 L.5,1",
                    E),
                    "\u2574": (G = {},
                    G[1] = "M.5,.5 L0,.5",
                    G),
                    "\u2578": (I = {},
                    I[3] = "M.5,.5 L0,.5",
                    I),
                    "\u2575": (Q = {},
                    Q[1] = "M.5,.5 L.5,0",
                    Q),
                    "\u2579": (R = {},
                    R[3] = "M.5,.5 L.5,0",
                    R),
                    "\u2576": (W = {},
                    W[1] = "M.5,.5 L1,.5",
                    W),
                    "\u257a": (V = {},
                    V[3] = "M.5,.5 L1,.5",
                    V),
                    "\u2577": (S = {},
                    S[1] = "M.5,.5 L.5,1",
                    S),
                    "\u257b": (D = {},
                    D[3] = "M.5,.5 L.5,1",
                    D),
                    "\u2550": (M = {},
                    M[1] = function(L, K) {
                        return "M0," + (.5 - K) + " L1," + (.5 - K) + " M0," + (.5 + K) + " L1," + (.5 + K)
                    }
                    ,
                    M),
                    "\u2551": (H = {},
                    H[1] = function(L, K) {
                        return "M" + (.5 - L) + ",0 L" + (.5 - L) + ",1 M" + (.5 + L) + ",0 L" + (.5 + L) + ",1"
                    }
                    ,
                    H),
                    "\u2552": (x = {},
                    x[1] = function(L, K) {
                        return "M.5,1 L.5," + (.5 - K) + " L1," + (.5 - K) + " M.5," + (.5 + K) + " L1," + (.5 + K)
                    }
                    ,
                    x),
                    "\u2553": (N = {},
                    N[1] = function(L, K) {
                        return "M" + (.5 - L) + ",1 L" + (.5 - L) + ",.5 L1,.5 M" + (.5 + L) + ",.5 L" + (.5 + L) + ",1"
                    }
                    ,
                    N),
                    "\u2554": (O = {},
                    O[1] = function(L, K) {
                        return "M1," + (.5 - K) + " L" + (.5 - L) + "," + (.5 - K) + " L" + (.5 - L) + ",1 M1," + (.5 + K) + " L" + (.5 + L) + "," + (.5 + K) + " L" + (.5 + L) + ",1"
                    }
                    ,
                    O),
                    "\u2555": (U = {},
                    U[1] = function(L, K) {
                        return "M0," + (.5 - K) + " L.5," + (.5 - K) + " L.5,1 M0," + (.5 + K) + " L.5," + (.5 + K)
                    }
                    ,
                    U),
                    "\u2556": (Y = {},
                    Y[1] = function(L, K) {
                        return "M" + (.5 + L) + ",1 L" + (.5 + L) + ",.5 L0,.5 M" + (.5 - L) + ",.5 L" + (.5 - L) + ",1"
                    }
                    ,
                    Y),
                    "\u2557": (Z = {},
                    Z[1] = function(L, K) {
                        return "M0," + (.5 + K) + " L" + (.5 - L) + "," + (.5 + K) + " L" + (.5 - L) + ",1 M0," + (.5 - K) + " L" + (.5 + L) + "," + (.5 - K) + " L" + (.5 + L) + ",1"
                    }
                    ,
                    Z),
                    "\u2558": (la = {},
                    la[1] = function(L, K) {
                        return "M.5,0 L.5," + (.5 + K) + " L1," + (.5 + K) + " M.5," + (.5 - K) + " L1," + (.5 - K)
                    }
                    ,
                    la),
                    "\u2559": (wa = {},
                    wa[1] = function(L, K) {
                        return "M1,.5 L" + (.5 - L) + ",.5 L" + (.5 - L) + ",0 M" + (.5 + L) + ",.5 L" + (.5 + L) + ",0"
                    }
                    ,
                    wa),
                    "\u255a": (ra = {},
                    ra[1] = function(L, K) {
                        return "M1," + (.5 - K) + " L" + (.5 + L) + "," + (.5 - K) + " L" + (.5 + L) + ",0 M1," + (.5 + K) + " L" + (.5 - L) + "," + (.5 + K) + " L" + (.5 - L) + ",0"
                    }
                    ,
                    ra),
                    "\u255b": (xa = {},
                    xa[1] = function(L, K) {
                        return "M0," + (.5 + K) + " L.5," + (.5 + K) + " L.5,0 M0," + (.5 - K) + " L.5," + (.5 - K)
                    }
                    ,
                    xa),
                    "\u255c": (sa = {},
                    sa[1] = function(L, K) {
                        return "M0,.5 L" + (.5 + L) + ",.5 L" + (.5 + L) + ",0 M" + (.5 - L) + ",.5 L" + (.5 - L) + ",0"
                    }
                    ,
                    sa),
                    "\u255d": (P = {},
                    P[1] = function(L, K) {
                        return "M0," + (.5 - K) + " L" + (.5 - L) + "," + (.5 - K) + " L" + (.5 - L) + ",0 M0," + (.5 + K) + " L" + (.5 + L) + "," + (.5 + K) + " L" + (.5 + L) + ",0"
                    }
                    ,
                    P),
                    "\u255e": (aa = {},
                    aa[1] = function(L, K) {
                        return "M.5,0 L.5,1 M.5," + (.5 - K) + " L1," + (.5 - K) + " M.5," + (.5 + K) + " L1," + (.5 + K)
                    }
                    ,
                    aa),
                    "\u255f": (ka = {},
                    ka[1] = function(L, K) {
                        return "M" + (.5 - L) + ",0 L" + (.5 - L) + ",1 M" + (.5 + L) + ",0 L" + (.5 + L) + ",1 M" + (.5 + L) + ",.5 L1,.5"
                    }
                    ,
                    ka),
                    "\u2560": (ha = {},
                    ha[1] = function(L, K) {
                        return "M" + (.5 - L) + ",0 L" + (.5 - L) + ",1 M1," + (.5 + K) + " L" + (.5 + L) + "," + (.5 + K) + " L" + (.5 + L) + ",1 M1," + (.5 - K) + " L" + (.5 + L) + "," + (.5 - K) + " L" + (.5 + L) + ",0"
                    }
                    ,
                    ha),
                    "\u2561": (ta = {},
                    ta[1] = function(L, K) {
                        return "M.5,0 L.5,1 M0," + (.5 - K) + " L.5," + (.5 - K) + " M0," + (.5 + K) + " L.5," + (.5 + K)
                    }
                    ,
                    ta),
                    "\u2562": (Cb = {},
                    Cb[1] = function(L, K) {
                        return "M0,.5 L" + (.5 - L) + ",.5 M" + (.5 - L) + ",0 L" + (.5 - L) + ",1 M" + (.5 + L) + ",0 L" + (.5 + L) + ",1"
                    }
                    ,
                    Cb),
                    "\u2563": (Db = {},
                    Db[1] = function(L, K) {
                        return "M" + (.5 + L) + ",0 L" + (.5 + L) + ",1 M0," + (.5 + K) + " L" + (.5 - L) + "," + (.5 + K) + " L" + (.5 - L) + ",1 M0," + (.5 - K) + " L" + (.5 - L) + "," + (.5 - K) + " L" + (.5 - L) + ",0"
                    }
                    ,
                    Db),
                    "\u2564": (Eb = {},
                    Eb[1] = function(L, K) {
                        return "M0," + (.5 - K) + " L1," + (.5 - K) + " M0," + (.5 + K) + " L1," + (.5 + K) + " M.5," + (.5 + K) + " L.5,1"
                    }
                    ,
                    Eb),
                    "\u2565": (Fb = {},
                    Fb[1] = function(L, K) {
                        return "M0,.5 L1,.5 M" + (.5 - L) + ",.5 L" + (.5 - L) + ",1 M" + (.5 + L) + ",.5 L" + (.5 + L) + ",1"
                    }
                    ,
                    Fb),
                    "\u2566": (Gb = {},
                    Gb[1] = function(L, K) {
                        return "M0," + (.5 - K) + " L1," + (.5 - K) + " M0," + (.5 + K) + " L" + (.5 - L) + "," + (.5 + K) + " L" + (.5 - L) + ",1 M1," + (.5 + K) + " L" + (.5 + L) + "," + (.5 + K) + " L" + (.5 + L) + ",1"
                    }
                    ,
                    Gb),
                    "\u2567": (Hb = {},
                    Hb[1] = function(L, K) {
                        return "M.5,0 L.5," + (.5 - K) + " M0," + (.5 - K) + " L1," + (.5 - K) + " M0," + (.5 + K) + " L1," + (.5 + K)
                    }
                    ,
                    Hb),
                    "\u2568": (Ib = {},
                    Ib[1] = function(L, K) {
                        return "M0,.5 L1,.5 M" + (.5 - L) + ",.5 L" + (.5 - L) + ",0 M" + (.5 + L) + ",.5 L" + (.5 + L) + ",0"
                    }
                    ,
                    Ib),
                    "\u2569": (Jb = {},
                    Jb[1] = function(L, K) {
                        return "M0," + (.5 + K) + " L1," + (.5 + K) + " M0," + (.5 - K) + " L" + (.5 - L) + "," + (.5 - K) + " L" + (.5 - L) + ",0 M1," + (.5 - K) + " L" + (.5 + L) + "," + (.5 - K) + " L" + (.5 + L) + ",0"
                    }
                    ,
                    Jb),
                    "\u256a": (Kb = {},
                    Kb[1] = function(L, K) {
                        return "M.5,0 L.5,1 M0," + (.5 - K) + " L1," + (.5 - K) + " M0," + (.5 + K) + " L1," + (.5 + K)
                    }
                    ,
                    Kb),
                    "\u256b": (Lb = {},
                    Lb[1] = function(L, K) {
                        return "M0,.5 L1,.5 M" + (.5 - L) + ",0 L" + (.5 - L) + ",1 M" + (.5 + L) + ",0 L" + (.5 + L) + ",1"
                    }
                    ,
                    Lb),
                    "\u256c": (Mb = {},
                    Mb[1] = function(L, K) {
                        return "M0," + (.5 + K) + " L" + (.5 - L) + "," + (.5 + K) + " L" + (.5 - L) + ",1 M1," + (.5 + K) + " L" + (.5 + L) + "," + (.5 + K) + " L" + (.5 + L) + ",1 M0," + (.5 - K) + " L" + (.5 - L) + "," + (.5 - K) + " L" + (.5 - L) + ",0 M1," + (.5 - K) + " L" + (.5 + L) + "," + (.5 - K) + " L" + (.5 + L) + ",0"
                    }
                    ,
                    Mb),
                    "\u2571": (Nb = {},
                    Nb[1] = "M1,0 L0,1",
                    Nb),
                    "\u2572": (Ob = {},
                    Ob[1] = "M0,0 L1,1",
                    Ob),
                    "\u2573": (Pb = {},
                    Pb[1] = "M1,0 L0,1 M0,0 L1,1",
                    Pb),
                    "\u257c": (Da = {},
                    Da[1] = "M.5,.5 L0,.5",
                    Da[3] = "M.5,.5 L1,.5",
                    Da),
                    "\u257d": (Ea = {},
                    Ea[1] = "M.5,.5 L.5,0",
                    Ea[3] = "M.5,.5 L.5,1",
                    Ea),
                    "\u257e": (Fa = {},
                    Fa[1] = "M.5,.5 L1,.5",
                    Fa[3] = "M.5,.5 L0,.5",
                    Fa),
                    "\u257f": (Ga = {},
                    Ga[1] = "M.5,.5 L.5,1",
                    Ga[3] = "M.5,.5 L.5,0",
                    Ga),
                    "\u250d": (Ha = {},
                    Ha[1] = "M.5,.5 L.5,1",
                    Ha[3] = "M.5,.5 L1,.5",
                    Ha),
                    "\u250e": (Ia = {},
                    Ia[1] = "M.5,.5 L1,.5",
                    Ia[3] = "M.5,.5 L.5,1",
                    Ia),
                    "\u2511": (Ja = {},
                    Ja[1] = "M.5,.5 L.5,1",
                    Ja[3] = "M.5,.5 L0,.5",
                    Ja),
                    "\u2512": (Ka = {},
                    Ka[1] = "M.5,.5 L0,.5",
                    Ka[3] = "M.5,.5 L.5,1",
                    Ka),
                    "\u2515": (La = {},
                    La[1] = "M.5,.5 L.5,0",
                    La[3] = "M.5,.5 L1,.5",
                    La),
                    "\u2516": (Ma = {},
                    Ma[1] = "M.5,.5 L1,.5",
                    Ma[3] = "M.5,.5 L.5,0",
                    Ma),
                    "\u2519": (Na = {},
                    Na[1] = "M.5,.5 L.5,0",
                    Na[3] = "M.5,.5 L0,.5",
                    Na),
                    "\u251a": (Oa = {},
                    Oa[1] = "M.5,.5 L0,.5",
                    Oa[3] = "M.5,.5 L.5,0",
                    Oa),
                    "\u251d": (Pa = {},
                    Pa[1] = "M.5,0 L.5,1",
                    Pa[3] = "M.5,.5 L1,.5",
                    Pa),
                    "\u251e": (Qa = {},
                    Qa[1] = "M0.5,1 L.5,.5 L1,.5",
                    Qa[3] = "M.5,.5 L.5,0",
                    Qa),
                    "\u251f": (Ra = {},
                    Ra[1] = "M.5,0 L.5,.5 L1,.5",
                    Ra[3] = "M.5,.5 L.5,1",
                    Ra),
                    "\u2520": (Sa = {},
                    Sa[1] = "M.5,.5 L1,.5",
                    Sa[3] = "M.5,0 L.5,1",
                    Sa),
                    "\u2521": (Ta = {},
                    Ta[1] = "M.5,.5 L.5,1",
                    Ta[3] = "M.5,0 L.5,.5 L1,.5",
                    Ta),
                    "\u2522": (Ua = {},
                    Ua[1] = "M.5,.5 L.5,0",
                    Ua[3] = "M0.5,1 L.5,.5 L1,.5",
                    Ua),
                    "\u2525": (Va = {},
                    Va[1] = "M.5,0 L.5,1",
                    Va[3] = "M.5,.5 L0,.5",
                    Va),
                    "\u2526": (Wa = {},
                    Wa[1] = "M0,.5 L.5,.5 L.5,1",
                    Wa[3] = "M.5,.5 L.5,0",
                    Wa),
                    "\u2527": (Xa = {},
                    Xa[1] = "M.5,0 L.5,.5 L0,.5",
                    Xa[3] = "M.5,.5 L.5,1",
                    Xa),
                    "\u2528": (Ya = {},
                    Ya[1] = "M.5,.5 L0,.5",
                    Ya[3] = "M.5,0 L.5,1",
                    Ya),
                    "\u2529": (Za = {},
                    Za[1] = "M.5,.5 L.5,1",
                    Za[3] = "M.5,0 L.5,.5 L0,.5",
                    Za),
                    "\u252a": ($a = {},
                    $a[1] = "M.5,.5 L.5,0",
                    $a[3] = "M0,.5 L.5,.5 L.5,1",
                    $a),
                    "\u252d": (ab = {},
                    ab[1] = "M0.5,1 L.5,.5 L1,.5",
                    ab[3] = "M.5,.5 L0,.5",
                    ab),
                    "\u252e": (bb = {},
                    bb[1] = "M0,.5 L.5,.5 L.5,1",
                    bb[3] = "M.5,.5 L1,.5",
                    bb),
                    "\u252f": (cb = {},
                    cb[1] = "M.5,.5 L.5,1",
                    cb[3] = "M0,.5 L1,.5",
                    cb),
                    "\u2530": (db = {},
                    db[1] = "M0,.5 L1,.5",
                    db[3] = "M.5,.5 L.5,1",
                    db),
                    "\u2531": (eb = {},
                    eb[1] = "M.5,.5 L1,.5",
                    eb[3] = "M0,.5 L.5,.5 L.5,1",
                    eb),
                    "\u2532": (fb = {},
                    fb[1] = "M.5,.5 L0,.5",
                    fb[3] = "M0.5,1 L.5,.5 L1,.5",
                    fb),
                    "\u2535": (gb = {},
                    gb[1] = "M.5,0 L.5,.5 L1,.5",
                    gb[3] = "M.5,.5 L0,.5",
                    gb),
                    "\u2536": (hb = {},
                    hb[1] = "M.5,0 L.5,.5 L0,.5",
                    hb[3] = "M.5,.5 L1,.5",
                    hb),
                    "\u2537": (ib = {},
                    ib[1] = "M.5,.5 L.5,0",
                    ib[3] = "M0,.5 L1,.5",
                    ib),
                    "\u2538": (jb = {},
                    jb[1] = "M0,.5 L1,.5",
                    jb[3] = "M.5,.5 L.5,0",
                    jb),
                    "\u2539": (kb = {},
                    kb[1] = "M.5,.5 L1,.5",
                    kb[3] = "M.5,0 L.5,.5 L0,.5",
                    kb),
                    "\u253a": (lb = {},
                    lb[1] = "M.5,.5 L0,.5",
                    lb[3] = "M.5,0 L.5,.5 L1,.5",
                    lb),
                    "\u253d": (mb = {},
                    mb[1] = "M.5,0 L.5,1 M.5,.5 L1,.5",
                    mb[3] = "M.5,.5 L0,.5",
                    mb),
                    "\u253e": (nb = {},
                    nb[1] = "M.5,0 L.5,1 M.5,.5 L0,.5",
                    nb[3] = "M.5,.5 L1,.5",
                    nb),
                    "\u253f": (ob = {},
                    ob[1] = "M.5,0 L.5,1",
                    ob[3] = "M0,.5 L1,.5",
                    ob),
                    "\u2540": (pb = {},
                    pb[1] = "M0,.5 L1,.5 M.5,.5 L.5,1",
                    pb[3] = "M.5,.5 L.5,0",
                    pb),
                    "\u2541": (qb = {},
                    qb[1] = "M.5,.5 L.5,0 M0,.5 L1,.5",
                    qb[3] = "M.5,.5 L.5,1",
                    qb),
                    "\u2542": (rb = {},
                    rb[1] = "M0,.5 L1,.5",
                    rb[3] = "M.5,0 L.5,1",
                    rb),
                    "\u2543": (sb = {},
                    sb[1] = "M0.5,1 L.5,.5 L1,.5",
                    sb[3] = "M.5,0 L.5,.5 L0,.5",
                    sb),
                    "\u2544": (tb = {},
                    tb[1] = "M0,.5 L.5,.5 L.5,1",
                    tb[3] = "M.5,0 L.5,.5 L1,.5",
                    tb),
                    "\u2545": (ub = {},
                    ub[1] = "M.5,0 L.5,.5 L1,.5",
                    ub[3] = "M0,.5 L.5,.5 L.5,1",
                    ub),
                    "\u2546": (vb = {},
                    vb[1] = "M.5,0 L.5,.5 L0,.5",
                    vb[3] = "M0.5,1 L.5,.5 L1,.5",
                    vb),
                    "\u2547": (wb = {},
                    wb[1] = "M.5,.5 L.5,1",
                    wb[3] = "M.5,.5 L.5,0 M0,.5 L1,.5",
                    wb),
                    "\u2548": (xb = {},
                    xb[1] = "M.5,.5 L.5,0",
                    xb[3] = "M0,.5 L1,.5 M.5,.5 L.5,1",
                    xb),
                    "\u2549": (yb = {},
                    yb[1] = "M.5,.5 L1,.5",
                    yb[3] = "M.5,0 L.5,1 M.5,.5 L0,.5",
                    yb),
                    "\u254a": (zb = {},
                    zb[1] = "M.5,.5 L0,.5",
                    zb[3] = "M.5,0 L.5,1 M.5,.5 L1,.5",
                    zb),
                    "\u254c": (Qb = {},
                    Qb[1] = "M.1,.5 L.4,.5 M.6,.5 L.9,.5",
                    Qb),
                    "\u254d": (Rb = {},
                    Rb[3] = "M.1,.5 L.4,.5 M.6,.5 L.9,.5",
                    Rb),
                    "\u2504": (Sb = {},
                    Sb[1] = "M.0667,.5 L.2667,.5 M.4,.5 L.6,.5 M.7333,.5 L.9333,.5",
                    Sb),
                    "\u2505": (Tb = {},
                    Tb[3] = "M.0667,.5 L.2667,.5 M.4,.5 L.6,.5 M.7333,.5 L.9333,.5",
                    Tb),
                    "\u2508": (Ub = {},
                    Ub[1] = "M.05,.5 L.2,.5 M.3,.5 L.45,.5 M.55,.5 L.7,.5 M.8,.5 L.95,.5",
                    Ub),
                    "\u2509": (Vb = {},
                    Vb[3] = "M.05,.5 L.2,.5 M.3,.5 L.45,.5 M.55,.5 L.7,.5 M.8,.5 L.95,.5",
                    Vb),
                    "\u254e": (Wb = {},
                    Wb[1] = "M.5,.1 L.5,.4 M.5,.6 L.5,.9",
                    Wb),
                    "\u254f": (Xb = {},
                    Xb[3] = "M.5,.1 L.5,.4 M.5,.6 L.5,.9",
                    Xb),
                    "\u2506": (Yb = {},
                    Yb[1] = "M.5,.0667 L.5,.2667 M.5,.4 L.5,.6 M.5,.7333 L.5,.9333",
                    Yb),
                    "\u2507": (Zb = {},
                    Zb[3] = "M.5,.0667 L.5,.2667 M.5,.4 L.5,.6 M.5,.7333 L.5,.9333",
                    Zb),
                    "\u250a": ($b = {},
                    $b[1] = "M.5,.05 L.5,.2 M.5,.3 L.5,.45 L.5,.55 M.5,.7 L.5,.95",
                    $b),
                    "\u250b": (ac = {},
                    ac[3] = "M.5,.05 L.5,.2 M.5,.3 L.5,.45 L.5,.55 M.5,.7 L.5,.95",
                    ac),
                    "\u256d": (bc = {},
                    bc[1] = "C.5,1,.5,.5,1,.5",
                    bc),
                    "\u256e": (cc = {},
                    cc[1] = "C.5,1,.5,.5,0,.5",
                    cc),
                    "\u256f": (dc = {},
                    dc[1] = "C.5,0,.5,.5,0,.5",
                    dc),
                    "\u2570": (ec = {},
                    ec[1] = "C.5,0,.5,.5,1,.5",
                    ec)
                };
                l.tryDrawCustomChar = function(L, K, ia, ya, za, ca) {
                    var ma = l.blockElementDefinitions[K];
                    if (ma)
                        return function(ba, da, Aa, Ba, ua, va) {
                            for (var ea = 0; ea < da.length; ea++) {
                                var T = da[ea]
                                  , X = ua / 8
                                  , fa = va / 8;
                                ba.fillRect(Aa + T.x * X, Ba + T.y * fa, T.w * X, T.h * fa)
                            }
                        }(L, ma, ia, ya, za, ca),
                        !0;
                    if (ma = kc[K])
                        return function(ba, da, Aa, Ba, ua, va) {
                            var ea = jc.get(da);
                            ea || (ea = new Map,
                            jc.set(da, ea));
                            var T = ba.fillStyle;
                            if ("string" != typeof T)
                                throw Error('Unexpected fillStyle type "' + T + '"');
                            var X = ea.get(T);
                            if (!X) {
                                X = da[0].length;
                                var fa = da.length
                                  , na = document.createElement("canvas");
                                na.width = X;
                                na.height = fa;
                                var Ab = (0,
                                ic.throwIfFalsy)(na.getContext("2d"))
                                  , Ca = new ImageData(X,fa)
                                  , fc = void 0
                                  , gc = void 0
                                  , hc = void 0;
                                var oa = void 0;
                                if (T.startsWith("#"))
                                    fc = parseInt(T.substr(1, 2), 16),
                                    gc = parseInt(T.substr(3, 2), 16),
                                    hc = parseInt(T.substr(5, 2), 16),
                                    oa = 7 < T.length && parseInt(T.substr(7, 2), 16) || 1;
                                else {
                                    if (!T.startsWith("rgba"))
                                        throw Error('Unexpected fillStyle color format "' + T + '" when drawing pattern glyph');
                                    fc = (oa = T.substring(5, T.length - 1).split(",").map(function(lc) {
                                        return parseFloat(lc)
                                    }))[0];
                                    gc = oa[1];
                                    hc = oa[2];
                                    oa = oa[3]
                                }
                                for (var pa = 0; pa < fa; pa++)
                                    for (var qa = 0; qa < X; qa++)
                                        Ca.data[4 * (pa * X + qa)] = fc,
                                        Ca.data[4 * (pa * X + qa) + 1] = gc,
                                        Ca.data[4 * (pa * X + qa) + 2] = hc,
                                        Ca.data[4 * (pa * X + qa) + 3] = 255 * da[pa][qa] * oa;
                                Ab.putImageData(Ca, 0, 0);
                                X = (0,
                                ic.throwIfFalsy)(ba.createPattern(na, null));
                                ea.set(T, X)
                            }
                            ba.fillStyle = X;
                            ba.fillRect(Aa, Ba, ua, va)
                        }(L, ma, ia, ya, za, ca),
                        !0;
                    K = l.boxDrawingDefinitions[K];
                    return !!K && (function(ba, da, Aa, Ba, ua, va) {
                        ba.strokeStyle = ba.fillStyle;
                        var ea = 0;
                        for (da = Object.entries(da); ea < da.length; ea++) {
                            var T = da[ea]
                              , X = T[0];
                            T = T[1];
                            ba.beginPath();
                            ba.lineWidth = window.devicePixelRatio * Number.parseInt(X);
                            X = 0;
                            for (T = ("function" == typeof T ? T(.15, .15 / va * ua) : T).split(" "); X < T.length; X++) {
                                var fa = T[X]
                                  , na = fa[0]
                                  , Ab = mc[na];
                                Ab ? (fa = fa.substring(1).split(","),
                                fa[0] && fa[1] && Ab(ba, v(fa, ua, va, Aa, Ba))) : console.error('Could not find drawing instructions for "' + na + '"')
                            }
                            ba.stroke();
                            ba.closePath()
                        }
                    }(L, K, ia, ya, za, ca),
                    !0)
                }
                ;
                var jc = new Map
                  , mc = {
                    C: function(L, K) {
                        return L.bezierCurveTo(K[0], K[1], K[2], K[3], K[4], K[5])
                    },
                    L: function(L, K) {
                        return L.lineTo(K[0], K[1])
                    },
                    M: function(L, K) {
                        return L.moveTo(K[0], K[1])
                    }
                }
            }
            ,
            3700: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.GridCache = void 0;
                A = function() {
                    function q() {
                        this.cache = []
                    }
                    return q.prototype.resize = function(h, v) {
                        for (var p = 0; p < h; p++) {
                            this.cache.length <= p && this.cache.push([]);
                            for (var t = this.cache[p].length; t < v; t++)
                                this.cache[p].push(void 0);
                            this.cache[p].length = v
                        }
                        this.cache.length = h
                    }
                    ,
                    q.prototype.clear = function() {
                        for (var h = 0; h < this.cache.length; h++)
                            for (var v = 0; v < this.cache[h].length; v++)
                                this.cache[h][v] = void 0
                    }
                    ,
                    q
                }();
                l.GridCache = A
            }
            ,
            5098: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                ), p = this && this.__decorate || function(d, c, a, b) {
                    var e, f = arguments.length, m = 3 > f ? c : null === b ? b = Object.getOwnPropertyDescriptor(c, a) : b;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        m = Reflect.decorate(d, c, a, b);
                    else
                        for (var u = d.length - 1; 0 <= u; u--)
                            (e = d[u]) && (m = (3 > f ? e(m) : 3 < f ? e(c, a, m) : e(c, a)) || m);
                    return 3 < f && m && Object.defineProperty(c, a, m),
                    m
                }
                , t = this && this.__param || function(d, c) {
                    return function(a, b) {
                        c(a, b, d)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.LinkRenderLayer = void 0;
                A = q(1546);
                var n = q(8803)
                  , g = q(2040)
                  , k = q(2585);
                q = function(d) {
                    function c(a, b, e, f, m, u, w, r) {
                        var z = d.call(this, a, "link", b, !0, e, f, w, r) || this;
                        return m.onShowLinkUnderline(function(C) {
                            return z._onShowLinkUnderline(C)
                        }),
                        m.onHideLinkUnderline(function(C) {
                            return z._onHideLinkUnderline(C)
                        }),
                        u.onShowLinkUnderline(function(C) {
                            return z._onShowLinkUnderline(C)
                        }),
                        u.onHideLinkUnderline(function(C) {
                            return z._onHideLinkUnderline(C)
                        }),
                        z
                    }
                    return v(c, d),
                    c.prototype.resize = function(a) {
                        d.prototype.resize.call(this, a);
                        this._state = void 0
                    }
                    ,
                    c.prototype.reset = function() {
                        this._clearCurrentLink()
                    }
                    ,
                    c.prototype._clearCurrentLink = function() {
                        if (this._state) {
                            this._clearCells(this._state.x1, this._state.y1, this._state.cols - this._state.x1, 1);
                            var a = this._state.y2 - this._state.y1 - 1;
                            0 < a && this._clearCells(0, this._state.y1 + 1, this._state.cols, a);
                            this._clearCells(0, this._state.y2, this._state.x2, 1);
                            this._state = void 0
                        }
                    }
                    ,
                    c.prototype._onShowLinkUnderline = function(a) {
                        if (a.fg === n.INVERTED_DEFAULT_COLOR ? this._ctx.fillStyle = this._colors.background.css : a.fg && (0,
                        g.is256Color)(a.fg) ? this._ctx.fillStyle = this._colors.ansi[a.fg].css : this._ctx.fillStyle = this._colors.foreground.css,
                        a.y1 === a.y2)
                            this._fillBottomLineAtCells(a.x1, a.y1, a.x2 - a.x1);
                        else {
                            this._fillBottomLineAtCells(a.x1, a.y1, a.cols - a.x1);
                            for (var b = a.y1 + 1; b < a.y2; b++)
                                this._fillBottomLineAtCells(0, b, a.cols);
                            this._fillBottomLineAtCells(0, a.y2, a.x2)
                        }
                        this._state = a
                    }
                    ,
                    c.prototype._onHideLinkUnderline = function(a) {
                        this._clearCurrentLink()
                    }
                    ,
                    p([t(6, k.IBufferService), t(7, k.IOptionsService)], c)
                }(A.BaseRenderLayer);
                l.LinkRenderLayer = q
            },
            3525: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(m, u) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(w, r) {
                        w.__proto__ = r
                    }
                    || function(w, r) {
                        for (var z in r)
                            Object.prototype.hasOwnProperty.call(r, z) && (w[z] = r[z])
                    }
                    ,
                    h(m, u)
                }
                ,
                function(m, u) {
                    function w() {
                        this.constructor = m
                    }
                    if ("function" != typeof u && null !== u)
                        throw new TypeError("Class extends value " + String(u) + " is not a constructor or null");
                    h(m, u);
                    m.prototype = null === u ? Object.create(u) : (w.prototype = u.prototype,
                    new w)
                }
                ), p = this && this.__decorate || function(m, u, w, r) {
                    var z, C = arguments.length, J = 3 > C ? u : null === r ? r = Object.getOwnPropertyDescriptor(u, w) : r;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        J = Reflect.decorate(m, u, w, r);
                    else
                        for (var F = m.length - 1; 0 <= F; F--)
                            (z = m[F]) && (J = (3 > C ? z(J) : 3 < C ? z(u, w, J) : z(u, w)) || J);
                    return 3 < C && J && Object.defineProperty(u, w, J),
                    J
                }
                , t = this && this.__param || function(m, u) {
                    return function(w, r) {
                        u(w, r, m)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Renderer = void 0;
                var n = q(9596)
                  , g = q(4149)
                  , k = q(2512)
                  , d = q(5098);
                A = q(844);
                var c = q(4725)
                  , a = q(2585)
                  , b = q(1420)
                  , e = q(8460)
                  , f = 1;
                q = function(m) {
                    function u(w, r, z, C, J, F, B, y) {
                        var E = m.call(this) || this;
                        E._colors = w;
                        E._screenElement = r;
                        E._bufferService = F;
                        E._charSizeService = B;
                        E._optionsService = y;
                        E._id = f++;
                        E._onRequestRedraw = new e.EventEmitter;
                        return E._renderLayers = [J.createInstance(n.TextRenderLayer, E._screenElement, 0, E._colors, E._optionsService.rawOptions.allowTransparency, E._id), J.createInstance(g.SelectionRenderLayer, E._screenElement, 1, E._colors, E._id), J.createInstance(d.LinkRenderLayer, E._screenElement, 2, E._colors, E._id, z, C), J.createInstance(k.CursorRenderLayer, E._screenElement, 3, E._colors, E._id, E._onRequestRedraw)],
                        E.dimensions = {
                            scaledCharWidth: 0,
                            scaledCharHeight: 0,
                            scaledCellWidth: 0,
                            scaledCellHeight: 0,
                            scaledCharLeft: 0,
                            scaledCharTop: 0,
                            scaledCanvasWidth: 0,
                            scaledCanvasHeight: 0,
                            canvasWidth: 0,
                            canvasHeight: 0,
                            actualCellWidth: 0,
                            actualCellHeight: 0
                        },
                        E._devicePixelRatio = window.devicePixelRatio,
                        E._updateDimensions(),
                        E.onOptionsChanged(),
                        E
                    }
                    return v(u, m),
                    Object.defineProperty(u.prototype, "onRequestRedraw", {
                        get: function() {
                            return this._onRequestRedraw.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    u.prototype.dispose = function() {
                        for (var w = 0, r = this._renderLayers; w < r.length; w++)
                            r[w].dispose();
                        m.prototype.dispose.call(this);
                        (0,
                        b.removeTerminalFromCache)(this._id)
                    }
                    ,
                    u.prototype.onDevicePixelRatioChange = function() {
                        this._devicePixelRatio !== window.devicePixelRatio && (this._devicePixelRatio = window.devicePixelRatio,
                        this.onResize(this._bufferService.cols, this._bufferService.rows))
                    }
                    ,
                    u.prototype.setColors = function(w) {
                        this._colors = w;
                        w = 0;
                        for (var r = this._renderLayers; w < r.length; w++) {
                            var z = r[w];
                            z.setColors(this._colors);
                            z.reset()
                        }
                    }
                    ,
                    u.prototype.onResize = function(w, r) {
                        this._updateDimensions();
                        w = 0;
                        for (r = this._renderLayers; w < r.length; w++)
                            r[w].resize(this.dimensions);
                        this._screenElement.style.width = this.dimensions.canvasWidth + "px";
                        this._screenElement.style.height = this.dimensions.canvasHeight + "px"
                    }
                    ,
                    u.prototype.onCharSizeChanged = function() {
                        this.onResize(this._bufferService.cols, this._bufferService.rows)
                    }
                    ,
                    u.prototype.onBlur = function() {
                        this._runOperation(function(w) {
                            return w.onBlur()
                        })
                    }
                    ,
                    u.prototype.onFocus = function() {
                        this._runOperation(function(w) {
                            return w.onFocus()
                        })
                    }
                    ,
                    u.prototype.onSelectionChanged = function(w, r, z) {
                        void 0 === z && (z = !1);
                        this._runOperation(function(C) {
                            return C.onSelectionChanged(w, r, z)
                        })
                    }
                    ,
                    u.prototype.onCursorMove = function() {
                        this._runOperation(function(w) {
                            return w.onCursorMove()
                        })
                    }
                    ,
                    u.prototype.onOptionsChanged = function() {
                        this._runOperation(function(w) {
                            return w.onOptionsChanged()
                        })
                    }
                    ,
                    u.prototype.clear = function() {
                        this._runOperation(function(w) {
                            return w.reset()
                        })
                    }
                    ,
                    u.prototype._runOperation = function(w) {
                        for (var r = 0, z = this._renderLayers; r < z.length; r++)
                            w(z[r])
                    }
                    ,
                    u.prototype.renderRows = function(w, r) {
                        for (var z = 0, C = this._renderLayers; z < C.length; z++)
                            C[z].onGridChanged(w, r)
                    }
                    ,
                    u.prototype.clearTextureAtlas = function() {
                        for (var w = 0, r = this._renderLayers; w < r.length; w++)
                            r[w].clearTextureAtlas()
                    }
                    ,
                    u.prototype._updateDimensions = function() {
                        this._charSizeService.hasValidSize && (this.dimensions.scaledCharWidth = Math.floor(this._charSizeService.width * window.devicePixelRatio),
                        this.dimensions.scaledCharHeight = Math.ceil(this._charSizeService.height * window.devicePixelRatio),
                        this.dimensions.scaledCellHeight = Math.floor(this.dimensions.scaledCharHeight * this._optionsService.rawOptions.lineHeight),
                        this.dimensions.scaledCharTop = 1 === this._optionsService.rawOptions.lineHeight ? 0 : Math.round((this.dimensions.scaledCellHeight - this.dimensions.scaledCharHeight) / 2),
                        this.dimensions.scaledCellWidth = this.dimensions.scaledCharWidth + Math.round(this._optionsService.rawOptions.letterSpacing),
                        this.dimensions.scaledCharLeft = Math.floor(this._optionsService.rawOptions.letterSpacing / 2),
                        this.dimensions.scaledCanvasHeight = this._bufferService.rows * this.dimensions.scaledCellHeight,
                        this.dimensions.scaledCanvasWidth = this._bufferService.cols * this.dimensions.scaledCellWidth,
                        this.dimensions.canvasHeight = Math.round(this.dimensions.scaledCanvasHeight / window.devicePixelRatio),
                        this.dimensions.canvasWidth = Math.round(this.dimensions.scaledCanvasWidth / window.devicePixelRatio),
                        this.dimensions.actualCellHeight = this.dimensions.canvasHeight / this._bufferService.rows,
                        this.dimensions.actualCellWidth = this.dimensions.canvasWidth / this._bufferService.cols)
                    }
                    ,
                    p([t(4, a.IInstantiationService), t(5, a.IBufferService), t(6, c.ICharSizeService), t(7, a.IOptionsService)], u)
                }(A.Disposable);
                l.Renderer = q
            },
            1752: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.throwIfFalsy = void 0;
                l.throwIfFalsy = function(q) {
                    if (!q)
                        throw Error("value must not be falsy");
                    return q
                }
            }
            ,
            4149: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(g, k) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(d, c) {
                        d.__proto__ = c
                    }
                    || function(d, c) {
                        for (var a in c)
                            Object.prototype.hasOwnProperty.call(c, a) && (d[a] = c[a])
                    }
                    ,
                    h(g, k)
                }
                ,
                function(g, k) {
                    function d() {
                        this.constructor = g
                    }
                    if ("function" != typeof k && null !== k)
                        throw new TypeError("Class extends value " + String(k) + " is not a constructor or null");
                    h(g, k);
                    g.prototype = null === k ? Object.create(k) : (d.prototype = k.prototype,
                    new d)
                }
                ), p = this && this.__decorate || function(g, k, d, c) {
                    var a, b = arguments.length, e = 3 > b ? k : null === c ? c = Object.getOwnPropertyDescriptor(k, d) : c;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        e = Reflect.decorate(g, k, d, c);
                    else
                        for (var f = g.length - 1; 0 <= f; f--)
                            (a = g[f]) && (e = (3 > b ? a(e) : 3 < b ? a(k, d, e) : a(k, d)) || e);
                    return 3 < b && e && Object.defineProperty(k, d, e),
                    e
                }
                , t = this && this.__param || function(g, k) {
                    return function(d, c) {
                        k(d, c, g)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.SelectionRenderLayer = void 0;
                A = q(1546);
                var n = q(2585);
                q = function(g) {
                    function k(d, c, a, b, e, f) {
                        d = g.call(this, d, "selection", c, !0, a, b, e, f) || this;
                        return d._clearState(),
                        d
                    }
                    return v(k, g),
                    k.prototype._clearState = function() {
                        this._state = {
                            start: void 0,
                            end: void 0,
                            columnSelectMode: void 0,
                            ydisp: void 0
                        }
                    }
                    ,
                    k.prototype.resize = function(d) {
                        g.prototype.resize.call(this, d);
                        this._clearState()
                    }
                    ,
                    k.prototype.reset = function() {
                        this._state.start && this._state.end && (this._clearState(),
                        this._clearAll())
                    }
                    ,
                    k.prototype.onSelectionChanged = function(d, c, a) {
                        if (this._didStateChange(d, c, a, this._bufferService.buffer.ydisp))
                            if (this._clearAll(),
                            d && c) {
                                var b = d[1] - this._bufferService.buffer.ydisp
                                  , e = c[1] - this._bufferService.buffer.ydisp
                                  , f = Math.max(b, 0)
                                  , m = Math.min(e, this._bufferService.rows - 1);
                                f >= this._bufferService.rows || 0 > m || ((this._ctx.fillStyle = this._colors.selectionTransparent.css,
                                a) ? (b = d[0],
                                this._fillCells(b, f, c[0] - b, m - f + 1)) : (b = b === f ? d[0] : 0,
                                this._fillCells(b, f, (f === e ? c[0] : this._bufferService.cols) - b, 1),
                                (this._fillCells(0, f + 1, this._bufferService.cols, Math.max(m - f - 1, 0)),
                                f !== m) && this._fillCells(0, m, e === m ? c[0] : this._bufferService.cols, 1)),
                                this._state.start = [d[0], d[1]],
                                this._state.end = [c[0], c[1]],
                                this._state.columnSelectMode = a);
                                this._state.ydisp = this._bufferService.buffer.ydisp
                            } else
                                this._clearState()
                    }
                    ,
                    k.prototype._didStateChange = function(d, c, a, b) {
                        return !this._areCoordinatesEqual(d, this._state.start) || !this._areCoordinatesEqual(c, this._state.end) || a !== this._state.columnSelectMode || b !== this._state.ydisp
                    }
                    ,
                    k.prototype._areCoordinatesEqual = function(d, c) {
                        return !(!d || !c) && d[0] === c[0] && d[1] === c[1]
                    }
                    ,
                    p([t(4, n.IBufferService), t(5, n.IOptionsService)], k)
                }(A.BaseRenderLayer);
                l.SelectionRenderLayer = q
            },
            9596: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(e, f) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(m, u) {
                        m.__proto__ = u
                    }
                    || function(m, u) {
                        for (var w in u)
                            Object.prototype.hasOwnProperty.call(u, w) && (m[w] = u[w])
                    }
                    ,
                    h(e, f)
                }
                ,
                function(e, f) {
                    function m() {
                        this.constructor = e
                    }
                    if ("function" != typeof f && null !== f)
                        throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
                    h(e, f);
                    e.prototype = null === f ? Object.create(f) : (m.prototype = f.prototype,
                    new m)
                }
                ), p = this && this.__decorate || function(e, f, m, u) {
                    var w, r = arguments.length, z = 3 > r ? f : null === u ? u = Object.getOwnPropertyDescriptor(f, m) : u;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        z = Reflect.decorate(e, f, m, u);
                    else
                        for (var C = e.length - 1; 0 <= C; C--)
                            (w = e[C]) && (z = (3 > r ? w(z) : 3 < r ? w(f, m, z) : w(f, m)) || z);
                    return 3 < r && z && Object.defineProperty(f, m, z),
                    z
                }
                , t = this && this.__param || function(e, f) {
                    return function(m, u) {
                        f(m, u, e)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.TextRenderLayer = void 0;
                var n = q(3700);
                A = q(1546);
                var g = q(3734)
                  , k = q(643)
                  , d = q(511)
                  , c = q(2585)
                  , a = q(4725)
                  , b = q(4269);
                q = function(e) {
                    function f(m, u, w, r, z, C, J, F) {
                        m = e.call(this, m, "text", u, r, w, z, C, J) || this;
                        return m._characterJoinerService = F,
                        m._characterWidth = 0,
                        m._characterFont = "",
                        m._characterOverlapCache = {},
                        m._workCell = new d.CellData,
                        m._state = new n.GridCache,
                        m
                    }
                    return v(f, e),
                    f.prototype.resize = function(m) {
                        e.prototype.resize.call(this, m);
                        var u = this._getFont(!1, !1);
                        this._characterWidth === m.scaledCharWidth && this._characterFont === u || (this._characterWidth = m.scaledCharWidth,
                        this._characterFont = u,
                        this._characterOverlapCache = {});
                        this._state.clear();
                        this._state.resize(this._bufferService.cols, this._bufferService.rows)
                    }
                    ,
                    f.prototype.reset = function() {
                        this._state.clear();
                        this._clearAll()
                    }
                    ,
                    f.prototype._forEachCell = function(m, u, w) {
                        for (; m <= u; m++) {
                            var r = m + this._bufferService.buffer.ydisp
                              , z = this._bufferService.buffer.lines.get(r);
                            r = this._characterJoinerService.getJoinedCharacters(r);
                            for (var C = 0; C < this._bufferService.cols; C++) {
                                z.loadCell(C, this._workCell);
                                var J = this._workCell
                                  , F = !1
                                  , B = C;
                                0 !== J.getWidth() && (0 < r.length && C === r[0][0] && (F = !0,
                                B = r.shift(),
                                J = new b.JoinedCellData(this._workCell,z.translateToString(!0, B[0], B[1]),B[1] - B[0]),
                                B = B[1] - 1),
                                !F && this._isOverlapping(J) && B < z.length - 1 && z.getCodePoint(B + 1) === k.NULL_CELL_CODE && (J.content &= -12582913,
                                J.content |= 8388608),
                                w(J, C, m),
                                C = B)
                            }
                        }
                    }
                    ,
                    f.prototype._drawBackground = function(m, u) {
                        var w = this
                          , r = this._ctx
                          , z = this._bufferService.cols
                          , C = 0
                          , J = 0
                          , F = null;
                        r.save();
                        this._forEachCell(m, u, function(B, y, E) {
                            var G = null;
                            B.isInverse() ? G = B.isFgDefault() ? w._colors.foreground.css : B.isFgRGB() ? "rgb(" + g.AttributeData.toColorRGB(B.getFgColor()).join(",") + ")" : w._colors.ansi[B.getFgColor()].css : B.isBgRGB() ? G = "rgb(" + g.AttributeData.toColorRGB(B.getBgColor()).join(",") + ")" : B.isBgPalette() && (G = w._colors.ansi[B.getBgColor()].css);
                            null === F && (C = y,
                            J = E);
                            E !== J ? (r.fillStyle = F || "",
                            w._fillCells(C, J, z - C, 1),
                            C = y,
                            J = E) : F !== G && (r.fillStyle = F || "",
                            w._fillCells(C, J, y - C, 1),
                            C = y,
                            J = E);
                            F = G
                        });
                        null !== F && (r.fillStyle = F,
                        this._fillCells(C, J, z - C, 1));
                        r.restore()
                    }
                    ,
                    f.prototype._drawForeground = function(m, u) {
                        var w = this;
                        this._forEachCell(m, u, function(r, z, C) {
                            if (!r.isInvisible() && (w._drawChars(r, z, C),
                            r.isUnderline() || r.isStrikethrough())) {
                                if (w._ctx.save(),
                                r.isInverse())
                                    if (r.isBgDefault())
                                        w._ctx.fillStyle = w._colors.background.css;
                                    else if (r.isBgRGB())
                                        w._ctx.fillStyle = "rgb(" + g.AttributeData.toColorRGB(r.getBgColor()).join(",") + ")";
                                    else {
                                        var J = r.getBgColor();
                                        w._optionsService.rawOptions.drawBoldTextInBrightColors && r.isBold() && 8 > J && (J += 8);
                                        w._ctx.fillStyle = w._colors.ansi[J].css
                                    }
                                else
                                    r.isFgDefault() ? w._ctx.fillStyle = w._colors.foreground.css : r.isFgRGB() ? w._ctx.fillStyle = "rgb(" + g.AttributeData.toColorRGB(r.getFgColor()).join(",") + ")" : (J = r.getFgColor(),
                                    w._optionsService.rawOptions.drawBoldTextInBrightColors && r.isBold() && 8 > J && (J += 8),
                                    w._ctx.fillStyle = w._colors.ansi[J].css);
                                r.isStrikethrough() && w._fillMiddleLineAtCells(z, C, r.getWidth());
                                r.isUnderline() && w._fillBottomLineAtCells(z, C, r.getWidth());
                                w._ctx.restore()
                            }
                        })
                    }
                    ,
                    f.prototype.onGridChanged = function(m, u) {
                        0 !== this._state.cache.length && (this._charAtlas && this._charAtlas.beginFrame(),
                        this._clearCells(0, m, this._bufferService.cols, u - m + 1),
                        this._drawBackground(m, u),
                        this._drawForeground(m, u))
                    }
                    ,
                    f.prototype.onOptionsChanged = function() {
                        this._setTransparency(this._optionsService.rawOptions.allowTransparency)
                    }
                    ,
                    f.prototype._isOverlapping = function(m) {
                        if (1 !== m.getWidth() || 256 > m.getCode())
                            return !1;
                        m = m.getChars();
                        if (this._characterOverlapCache.hasOwnProperty(m))
                            return this._characterOverlapCache[m];
                        this._ctx.save();
                        this._ctx.font = this._characterFont;
                        var u = Math.floor(this._ctx.measureText(m).width) > this._characterWidth;
                        return this._ctx.restore(),
                        this._characterOverlapCache[m] = u,
                        u
                    }
                    ,
                    p([t(5, c.IBufferService), t(6, c.IOptionsService), t(7, a.ICharacterJoinerService)], f)
                }(A.BaseRenderLayer);
                l.TextRenderLayer = q
            },
            9616: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BaseCharAtlas = void 0;
                A = function() {
                    function q() {
                        this._didWarmUp = !1
                    }
                    return q.prototype.dispose = function() {}
                    ,
                    q.prototype.warmUp = function() {
                        this._didWarmUp || (this._doWarmUp(),
                        this._didWarmUp = !0)
                    }
                    ,
                    q.prototype._doWarmUp = function() {}
                    ,
                    q.prototype.clear = function() {}
                    ,
                    q.prototype.beginFrame = function() {}
                    ,
                    q
                }();
                l.BaseCharAtlas = A
            }
            ,
            1420: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.removeTerminalFromCache = l.acquireCharAtlas = void 0;
                var h = q(2040)
                  , v = q(1906)
                  , p = [];
                l.acquireCharAtlas = function(t, n, g, k, d) {
                    t = (0,
                    h.generateConfig)(k, d, t, g);
                    for (g = 0; g < p.length; g++)
                        if (k = (d = p[g]).ownedBy.indexOf(n),
                        0 <= k) {
                            if ((0,
                            h.configEquals)(d.config, t))
                                return d.atlas;
                            1 === d.ownedBy.length ? (d.atlas.dispose(),
                            p.splice(g, 1)) : d.ownedBy.splice(k, 1);
                            break
                        }
                    for (g = 0; g < p.length; g++)
                        if (d = p[g],
                        (0,
                        h.configEquals)(d.config, t))
                            return d.ownedBy.push(n),
                            d.atlas;
                    n = {
                        atlas: new v.DynamicCharAtlas(document,t),
                        config: t,
                        ownedBy: [n]
                    };
                    return p.push(n),
                    n.atlas
                }
                ;
                l.removeTerminalFromCache = function(t) {
                    for (var n = 0; n < p.length; n++) {
                        var g = p[n].ownedBy.indexOf(t);
                        if (-1 !== g) {
                            1 === p[n].ownedBy.length ? (p[n].atlas.dispose(),
                            p.splice(n, 1)) : p[n].ownedBy.splice(g, 1);
                            break
                        }
                    }
                }
            }
            ,
            2040: function(A, l, q) {
                var h = this && this.__spreadArray || function(p, t, n) {
                    if (n || 2 === arguments.length)
                        for (var g, k = 0, d = t.length; k < d; k++)
                            !g && k in t || (g || (g = Array.prototype.slice.call(t, 0, k)),
                            g[k] = t[k]);
                    return p.concat(g || Array.prototype.slice.call(t))
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.is256Color = l.configEquals = l.generateConfig = void 0;
                var v = q(643);
                l.generateConfig = function(p, t, n, g) {
                    g = {
                        foreground: g.foreground,
                        background: g.background,
                        cursor: void 0,
                        cursorAccent: void 0,
                        selection: void 0,
                        ansi: h([], g.ansi, !0)
                    };
                    return {
                        devicePixelRatio: window.devicePixelRatio,
                        scaledCharWidth: p,
                        scaledCharHeight: t,
                        fontFamily: n.fontFamily,
                        fontSize: n.fontSize,
                        fontWeight: n.fontWeight,
                        fontWeightBold: n.fontWeightBold,
                        allowTransparency: n.allowTransparency,
                        colors: g
                    }
                }
                ;
                l.configEquals = function(p, t) {
                    for (var n = 0; n < p.colors.ansi.length; n++)
                        if (p.colors.ansi[n].rgba !== t.colors.ansi[n].rgba)
                            return !1;
                    return p.devicePixelRatio === t.devicePixelRatio && p.fontFamily === t.fontFamily && p.fontSize === t.fontSize && p.fontWeight === t.fontWeight && p.fontWeightBold === t.fontWeightBold && p.allowTransparency === t.allowTransparency && p.scaledCharWidth === t.scaledCharWidth && p.scaledCharHeight === t.scaledCharHeight && p.colors.foreground === t.colors.foreground && p.colors.background === t.colors.background
                }
                ;
                l.is256Color = function(p) {
                    return p < v.DEFAULT_COLOR
                }
            },
            8803: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CHAR_ATLAS_CELL_SPACING = l.TEXT_BASELINE = l.DIM_OPACITY = l.INVERTED_DEFAULT_COLOR = void 0;
                A = q(6114);
                l.INVERTED_DEFAULT_COLOR = 257;
                l.DIM_OPACITY = .5;
                l.TEXT_BASELINE = A.isFirefox ? "bottom" : "ideographic";
                l.CHAR_ATLAS_CELL_SPACING = 1
            }
            ,
            1906: function(A, l, q) {
                function h(e) {
                    return e.code << 21 | e.bg << 12 | e.fg << 3 | (e.bold ? 0 : 4) + (e.dim ? 0 : 2) + (e.italic ? 0 : 1)
                }
                function v(e, f) {
                    var m = !0
                      , u = f.rgba >>> 24
                      , w = f.rgba >>> 16 & 255;
                    f = f.rgba >>> 8 & 255;
                    for (var r = 0; r < e.data.length; r += 4)
                        e.data[r] === u && e.data[r + 1] === w && e.data[r + 2] === f ? e.data[r + 3] = 0 : m = !1;
                    return m
                }
                var p, t = this && this.__extends || (p = function(e, f) {
                    return p = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(m, u) {
                        m.__proto__ = u
                    }
                    || function(m, u) {
                        for (var w in u)
                            Object.prototype.hasOwnProperty.call(u, w) && (m[w] = u[w])
                    }
                    ,
                    p(e, f)
                }
                ,
                function(e, f) {
                    function m() {
                        this.constructor = e
                    }
                    if ("function" != typeof f && null !== f)
                        throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
                    p(e, f);
                    e.prototype = null === f ? Object.create(f) : (m.prototype = f.prototype,
                    new m)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.NoneCharAtlas = l.DynamicCharAtlas = l.getGlyphCacheKey = void 0;
                var n = q(8803);
                A = q(9616);
                var g = q(5680)
                  , k = q(7001)
                  , d = q(6114)
                  , c = q(1752)
                  , a = q(4774)
                  , b = {
                    css: "rgba(0, 0, 0, 0)",
                    rgba: 0
                };
                l.getGlyphCacheKey = h;
                q = function(e) {
                    function f(m, u) {
                        var w = e.call(this) || this;
                        w._config = u;
                        w._drawToCacheCount = 0;
                        w._glyphsWaitingOnBitmap = [];
                        w._bitmapCommitTimeout = null;
                        w._bitmap = null;
                        w._cacheCanvas = m.createElement("canvas");
                        w._cacheCanvas.width = 1024;
                        w._cacheCanvas.height = 1024;
                        w._cacheCtx = (0,
                        c.throwIfFalsy)(w._cacheCanvas.getContext("2d", {
                            alpha: !0
                        }));
                        m = m.createElement("canvas");
                        m.width = w._config.scaledCharWidth;
                        m.height = w._config.scaledCharHeight;
                        w._tmpCtx = (0,
                        c.throwIfFalsy)(m.getContext("2d", {
                            alpha: w._config.allowTransparency
                        }));
                        w._width = Math.floor(1024 / w._config.scaledCharWidth);
                        w._height = Math.floor(1024 / w._config.scaledCharHeight);
                        m = w._width * w._height;
                        return w._cacheMap = new k.LRUMap(m),
                        w._cacheMap.prealloc(m),
                        w
                    }
                    return t(f, e),
                    f.prototype.dispose = function() {
                        null !== this._bitmapCommitTimeout && (window.clearTimeout(this._bitmapCommitTimeout),
                        this._bitmapCommitTimeout = null)
                    }
                    ,
                    f.prototype.beginFrame = function() {
                        this._drawToCacheCount = 0
                    }
                    ,
                    f.prototype.clear = function() {
                        if (0 < this._cacheMap.size) {
                            var m = this._width * this._height;
                            this._cacheMap = new k.LRUMap(m);
                            this._cacheMap.prealloc(m)
                        }
                        this._cacheCtx.clearRect(0, 0, 1024, 1024);
                        this._tmpCtx.clearRect(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight)
                    }
                    ,
                    f.prototype.draw = function(m, u, w, r) {
                        if (32 === u.code)
                            return !0;
                        if (!this._canCache(u))
                            return !1;
                        var z = h(u)
                          , C = this._cacheMap.get(z);
                        return null != C ? (this._drawFromCache(m, C, w, r),
                        !0) : 100 > this._drawToCacheCount ? (C = this._cacheMap.size < this._cacheMap.capacity ? this._cacheMap.size : this._cacheMap.peek().index,
                        u = this._drawToCache(u, C),
                        this._cacheMap.set(z, u),
                        this._drawFromCache(m, u, w, r),
                        !0) : !1
                    }
                    ,
                    f.prototype._canCache = function(m) {
                        return 256 > m.code
                    }
                    ,
                    f.prototype._toCoordinateX = function(m) {
                        return m % this._width * this._config.scaledCharWidth
                    }
                    ,
                    f.prototype._toCoordinateY = function(m) {
                        return Math.floor(m / this._width) * this._config.scaledCharHeight
                    }
                    ,
                    f.prototype._drawFromCache = function(m, u, w, r) {
                        if (!u.isEmpty) {
                            var z = this._toCoordinateX(u.index)
                              , C = this._toCoordinateY(u.index);
                            m.drawImage(u.inBitmap ? this._bitmap : this._cacheCanvas, z, C, this._config.scaledCharWidth, this._config.scaledCharHeight, w, r, this._config.scaledCharWidth, this._config.scaledCharHeight)
                        }
                    }
                    ,
                    f.prototype._getColorFromAnsiIndex = function(m) {
                        return m < this._config.colors.ansi.length ? this._config.colors.ansi[m] : g.DEFAULT_ANSI_COLORS[m]
                    }
                    ,
                    f.prototype._getBackgroundColor = function(m) {
                        return this._config.allowTransparency ? b : m.bg === n.INVERTED_DEFAULT_COLOR ? this._config.colors.foreground : 256 > m.bg ? this._getColorFromAnsiIndex(m.bg) : this._config.colors.background
                    }
                    ,
                    f.prototype._getForegroundColor = function(m) {
                        return m.fg === n.INVERTED_DEFAULT_COLOR ? a.color.opaque(this._config.colors.background) : 256 > m.fg ? this._getColorFromAnsiIndex(m.fg) : this._config.colors.foreground
                    }
                    ,
                    f.prototype._drawToCache = function(m, u) {
                        this._drawToCacheCount++;
                        this._tmpCtx.save();
                        var w = this._getBackgroundColor(m);
                        this._tmpCtx.globalCompositeOperation = "copy";
                        this._tmpCtx.fillStyle = w.css;
                        this._tmpCtx.fillRect(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight);
                        this._tmpCtx.globalCompositeOperation = "source-over";
                        this._tmpCtx.font = (m.italic ? "italic" : "") + " " + (m.bold ? this._config.fontWeightBold : this._config.fontWeight) + " " + this._config.fontSize * this._config.devicePixelRatio + "px " + this._config.fontFamily;
                        this._tmpCtx.textBaseline = n.TEXT_BASELINE;
                        this._tmpCtx.fillStyle = this._getForegroundColor(m).css;
                        m.dim && (this._tmpCtx.globalAlpha = n.DIM_OPACITY);
                        this._tmpCtx.fillText(m.chars, 0, this._config.scaledCharHeight);
                        var r = this._tmpCtx.getImageData(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight)
                          , z = !1;
                        if (this._config.allowTransparency || (z = v(r, w)),
                        z && "_" === m.chars && !this._config.allowTransparency)
                            for (var C = 1; 5 >= C && (this._tmpCtx.fillText(m.chars, 0, this._config.scaledCharHeight - C),
                            z = v(r = this._tmpCtx.getImageData(0, 0, this._config.scaledCharWidth, this._config.scaledCharHeight), w)); C++)
                                ;
                        this._tmpCtx.restore();
                        m = this._toCoordinateX(u);
                        w = this._toCoordinateY(u);
                        this._cacheCtx.putImageData(r, m, w);
                        u = {
                            index: u,
                            isEmpty: z,
                            inBitmap: !1
                        };
                        return this._addGlyphToBitmap(u),
                        u
                    }
                    ,
                    f.prototype._addGlyphToBitmap = function(m) {
                        var u = this;
                        !("createImageBitmap"in window) || d.isFirefox || d.isSafari || (this._glyphsWaitingOnBitmap.push(m),
                        null === this._bitmapCommitTimeout && (this._bitmapCommitTimeout = window.setTimeout(function() {
                            return u._generateBitmap()
                        }, 100)))
                    }
                    ,
                    f.prototype._generateBitmap = function() {
                        var m = this
                          , u = this._glyphsWaitingOnBitmap;
                        this._glyphsWaitingOnBitmap = [];
                        window.createImageBitmap(this._cacheCanvas).then(function(w) {
                            m._bitmap = w;
                            for (w = 0; w < u.length; w++)
                                u[w].inBitmap = !0
                        });
                        this._bitmapCommitTimeout = null
                    }
                    ,
                    f
                }(A.BaseCharAtlas);
                l.DynamicCharAtlas = q;
                q = function(e) {
                    function f(m, u) {
                        return e.call(this) || this
                    }
                    return t(f, e),
                    f.prototype.draw = function(m, u, w, r) {
                        return !1
                    }
                    ,
                    f
                }(A.BaseCharAtlas);
                l.NoneCharAtlas = q
            },
            7001: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.LRUMap = void 0;
                A = function() {
                    function q(h) {
                        this.capacity = h;
                        this._map = {};
                        this._tail = this._head = null;
                        this._nodePool = [];
                        this.size = 0
                    }
                    return q.prototype._unlinkNode = function(h) {
                        var v = h.prev
                          , p = h.next;
                        h === this._head && (this._head = p);
                        h === this._tail && (this._tail = v);
                        null !== v && (v.next = p);
                        null !== p && (p.prev = v)
                    }
                    ,
                    q.prototype._appendNode = function(h) {
                        var v = this._tail;
                        null !== v && (v.next = h);
                        h.prev = v;
                        h.next = null;
                        this._tail = h;
                        null === this._head && (this._head = h)
                    }
                    ,
                    q.prototype.prealloc = function(h) {
                        for (var v = this._nodePool, p = 0; p < h; p++)
                            v.push({
                                prev: null,
                                next: null,
                                key: null,
                                value: null
                            })
                    }
                    ,
                    q.prototype.get = function(h) {
                        h = this._map[h];
                        return void 0 !== h ? (this._unlinkNode(h),
                        this._appendNode(h),
                        h.value) : null
                    }
                    ,
                    q.prototype.peekValue = function(h) {
                        h = this._map[h];
                        return void 0 !== h ? h.value : null
                    }
                    ,
                    q.prototype.peek = function() {
                        var h = this._head;
                        return null === h ? null : h.value
                    }
                    ,
                    q.prototype.set = function(h, v) {
                        var p = this._map[h];
                        if (void 0 !== p)
                            p = this._map[h],
                            this._unlinkNode(p),
                            p.value = v;
                        else if (this.size >= this.capacity)
                            p = this._head,
                            this._unlinkNode(p),
                            delete this._map[p.key],
                            p.key = h,
                            p.value = v,
                            this._map[h] = p;
                        else {
                            var t = this._nodePool;
                            0 < t.length ? ((p = t.pop()).key = h,
                            p.value = v) : p = {
                                prev: null,
                                next: null,
                                key: h,
                                value: v
                            };
                            this._map[h] = p;
                            this.size++
                        }
                        this._appendNode(p)
                    }
                    ,
                    q
                }();
                l.LRUMap = A
            }
            ,
            1296: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(f, m) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(u, w) {
                        u.__proto__ = w
                    }
                    || function(u, w) {
                        for (var r in w)
                            Object.prototype.hasOwnProperty.call(w, r) && (u[r] = w[r])
                    }
                    ,
                    h(f, m)
                }
                ,
                function(f, m) {
                    function u() {
                        this.constructor = f
                    }
                    if ("function" != typeof m && null !== m)
                        throw new TypeError("Class extends value " + String(m) + " is not a constructor or null");
                    h(f, m);
                    f.prototype = null === m ? Object.create(m) : (u.prototype = m.prototype,
                    new u)
                }
                ), p = this && this.__decorate || function(f, m, u, w) {
                    var r, z = arguments.length, C = 3 > z ? m : null === w ? w = Object.getOwnPropertyDescriptor(m, u) : w;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        C = Reflect.decorate(f, m, u, w);
                    else
                        for (var J = f.length - 1; 0 <= J; J--)
                            (r = f[J]) && (C = (3 > z ? r(C) : 3 < z ? r(m, u, C) : r(m, u)) || C);
                    return 3 < z && C && Object.defineProperty(m, u, C),
                    C
                }
                , t = this && this.__param || function(f, m) {
                    return function(u, w) {
                        m(u, w, f)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.DomRenderer = void 0;
                var n = q(3787)
                  , g = q(8803);
                A = q(844);
                var k = q(4725)
                  , d = q(2585)
                  , c = q(8460)
                  , a = q(4774)
                  , b = q(9631)
                  , e = 1;
                q = function(f) {
                    function m(u, w, r, z, C, J, F, B, y, E) {
                        var G = f.call(this) || this;
                        return G._colors = u,
                        G._element = w,
                        G._screenElement = r,
                        G._viewportElement = z,
                        G._linkifier = C,
                        G._linkifier2 = J,
                        G._charSizeService = B,
                        G._optionsService = y,
                        G._bufferService = E,
                        G._terminalClass = e++,
                        G._rowElements = [],
                        G._rowContainer = document.createElement("div"),
                        G._rowContainer.classList.add("xterm-rows"),
                        G._rowContainer.style.lineHeight = "normal",
                        G._rowContainer.setAttribute("aria-hidden", "true"),
                        G._refreshRowElements(G._bufferService.cols, G._bufferService.rows),
                        G._selectionContainer = document.createElement("div"),
                        G._selectionContainer.classList.add("xterm-selection"),
                        G._selectionContainer.setAttribute("aria-hidden", "true"),
                        G.dimensions = {
                            scaledCharWidth: 0,
                            scaledCharHeight: 0,
                            scaledCellWidth: 0,
                            scaledCellHeight: 0,
                            scaledCharLeft: 0,
                            scaledCharTop: 0,
                            scaledCanvasWidth: 0,
                            scaledCanvasHeight: 0,
                            canvasWidth: 0,
                            canvasHeight: 0,
                            actualCellWidth: 0,
                            actualCellHeight: 0
                        },
                        G._updateDimensions(),
                        G._injectCss(),
                        G._rowFactory = F.createInstance(n.DomRendererRowFactory, document, G._colors),
                        G._element.classList.add("xterm-dom-renderer-owner-" + G._terminalClass),
                        G._screenElement.appendChild(G._rowContainer),
                        G._screenElement.appendChild(G._selectionContainer),
                        G._linkifier.onShowLinkUnderline(function(I) {
                            return G._onLinkHover(I)
                        }),
                        G._linkifier.onHideLinkUnderline(function(I) {
                            return G._onLinkLeave(I)
                        }),
                        G._linkifier2.onShowLinkUnderline(function(I) {
                            return G._onLinkHover(I)
                        }),
                        G._linkifier2.onHideLinkUnderline(function(I) {
                            return G._onLinkLeave(I)
                        }),
                        G
                    }
                    return v(m, f),
                    Object.defineProperty(m.prototype, "onRequestRedraw", {
                        get: function() {
                            return (new c.EventEmitter).event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    m.prototype.dispose = function() {
                        this._element.classList.remove("xterm-dom-renderer-owner-" + this._terminalClass);
                        (0,
                        b.removeElementFromParent)(this._rowContainer, this._selectionContainer, this._themeStyleElement, this._dimensionsStyleElement);
                        f.prototype.dispose.call(this)
                    }
                    ,
                    m.prototype._updateDimensions = function() {
                        this.dimensions.scaledCharWidth = this._charSizeService.width * window.devicePixelRatio;
                        this.dimensions.scaledCharHeight = Math.ceil(this._charSizeService.height * window.devicePixelRatio);
                        this.dimensions.scaledCellWidth = this.dimensions.scaledCharWidth + Math.round(this._optionsService.rawOptions.letterSpacing);
                        this.dimensions.scaledCellHeight = Math.floor(this.dimensions.scaledCharHeight * this._optionsService.rawOptions.lineHeight);
                        this.dimensions.scaledCharLeft = 0;
                        this.dimensions.scaledCharTop = 0;
                        this.dimensions.scaledCanvasWidth = this.dimensions.scaledCellWidth * this._bufferService.cols;
                        this.dimensions.scaledCanvasHeight = this.dimensions.scaledCellHeight * this._bufferService.rows;
                        this.dimensions.canvasWidth = Math.round(this.dimensions.scaledCanvasWidth / window.devicePixelRatio);
                        this.dimensions.canvasHeight = Math.round(this.dimensions.scaledCanvasHeight / window.devicePixelRatio);
                        this.dimensions.actualCellWidth = this.dimensions.canvasWidth / this._bufferService.cols;
                        this.dimensions.actualCellHeight = this.dimensions.canvasHeight / this._bufferService.rows;
                        for (var u = 0, w = this._rowElements; u < w.length; u++) {
                            var r = w[u];
                            r.style.width = this.dimensions.canvasWidth + "px";
                            r.style.height = this.dimensions.actualCellHeight + "px";
                            r.style.lineHeight = this.dimensions.actualCellHeight + "px";
                            r.style.overflow = "hidden"
                        }
                        this._dimensionsStyleElement || (this._dimensionsStyleElement = document.createElement("style"),
                        this._screenElement.appendChild(this._dimensionsStyleElement));
                        this._dimensionsStyleElement.textContent = this._terminalSelector + " .xterm-rows span { display: inline-block; height: 100%; vertical-align: top; width: " + this.dimensions.actualCellWidth + "px}";
                        this._selectionContainer.style.height = this._viewportElement.style.height;
                        this._screenElement.style.width = this.dimensions.canvasWidth + "px";
                        this._screenElement.style.height = this.dimensions.canvasHeight + "px"
                    }
                    ,
                    m.prototype.setColors = function(u) {
                        this._colors = u;
                        this._injectCss()
                    }
                    ,
                    m.prototype._injectCss = function() {
                        var u = this;
                        this._themeStyleElement || (this._themeStyleElement = document.createElement("style"),
                        this._screenElement.appendChild(this._themeStyleElement));
                        var w = this._terminalSelector + " .xterm-rows { color: " + this._colors.foreground.css + "; font-family: " + this._optionsService.rawOptions.fontFamily + "; font-size: " + this._optionsService.rawOptions.fontSize + "px;}";
                        w += this._terminalSelector + " span:not(." + n.BOLD_CLASS + ") { font-weight: " + this._optionsService.rawOptions.fontWeight + ";}" + this._terminalSelector + " span." + n.BOLD_CLASS + " { font-weight: " + this._optionsService.rawOptions.fontWeightBold + ";}" + this._terminalSelector + " span." + n.ITALIC_CLASS + " { font-style: italic;}";
                        w += "@keyframes blink_box_shadow_" + this._terminalClass + " { 50% {  box-shadow: none; }}";
                        w += "@keyframes blink_block_" + this._terminalClass + " { 0% {  background-color: " + this._colors.cursor.css + ";  color: " + this._colors.cursorAccent.css + "; } 50% {  background-color: " + this._colors.cursorAccent.css + ";  color: " + this._colors.cursor.css + "; }}";
                        w += this._terminalSelector + " .xterm-rows:not(.xterm-focus) ." + n.CURSOR_CLASS + "." + n.CURSOR_STYLE_BLOCK_CLASS + " { outline: 1px solid " + this._colors.cursor.css + "; outline-offset: -1px;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + n.CURSOR_CLASS + "." + n.CURSOR_BLINK_CLASS + ":not(." + n.CURSOR_STYLE_BLOCK_CLASS + ") { animation: blink_box_shadow_" + this._terminalClass + " 1s step-end infinite;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + n.CURSOR_CLASS + "." + n.CURSOR_BLINK_CLASS + "." + n.CURSOR_STYLE_BLOCK_CLASS + " { animation: blink_block_" + this._terminalClass + " 1s step-end infinite;}" + this._terminalSelector + " .xterm-rows.xterm-focus ." + n.CURSOR_CLASS + "." + n.CURSOR_STYLE_BLOCK_CLASS + " { background-color: " + this._colors.cursor.css + "; color: " + this._colors.cursorAccent.css + ";}" + this._terminalSelector + " .xterm-rows ." + n.CURSOR_CLASS + "." + n.CURSOR_STYLE_BAR_CLASS + " { box-shadow: " + this._optionsService.rawOptions.cursorWidth + "px 0 0 " + this._colors.cursor.css + " inset;}" + this._terminalSelector + " .xterm-rows ." + n.CURSOR_CLASS + "." + n.CURSOR_STYLE_UNDERLINE_CLASS + " { box-shadow: 0 -1px 0 " + this._colors.cursor.css + " inset;}";
                        w += this._terminalSelector + " .xterm-selection { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}" + this._terminalSelector + " .xterm-selection div { position: absolute; background-color: " + this._colors.selectionTransparent.css + ";}";
                        this._colors.ansi.forEach(function(r, z) {
                            w += u._terminalSelector + " .xterm-fg-" + z + " { color: " + r.css + "; }" + u._terminalSelector + " .xterm-bg-" + z + " { background-color: " + r.css + "; }"
                        });
                        w += this._terminalSelector + " .xterm-fg-" + g.INVERTED_DEFAULT_COLOR + " { color: " + a.color.opaque(this._colors.background).css + "; }" + this._terminalSelector + " .xterm-bg-" + g.INVERTED_DEFAULT_COLOR + " { background-color: " + this._colors.foreground.css + "; }";
                        this._themeStyleElement.textContent = w
                    }
                    ,
                    m.prototype.onDevicePixelRatioChange = function() {
                        this._updateDimensions()
                    }
                    ,
                    m.prototype._refreshRowElements = function(u, w) {
                        for (u = this._rowElements.length; u <= w; u++) {
                            var r = document.createElement("div");
                            this._rowContainer.appendChild(r);
                            this._rowElements.push(r)
                        }
                        for (; this._rowElements.length > w; )
                            this._rowContainer.removeChild(this._rowElements.pop())
                    }
                    ,
                    m.prototype.onResize = function(u, w) {
                        this._refreshRowElements(u, w);
                        this._updateDimensions()
                    }
                    ,
                    m.prototype.onCharSizeChanged = function() {
                        this._updateDimensions()
                    }
                    ,
                    m.prototype.onBlur = function() {
                        this._rowContainer.classList.remove("xterm-focus")
                    }
                    ,
                    m.prototype.onFocus = function() {
                        this._rowContainer.classList.add("xterm-focus")
                    }
                    ,
                    m.prototype.onSelectionChanged = function(u, w, r) {
                        for (; this._selectionContainer.children.length; )
                            this._selectionContainer.removeChild(this._selectionContainer.children[0]);
                        if (u && w) {
                            var z = u[1] - this._bufferService.buffer.ydisp
                              , C = w[1] - this._bufferService.buffer.ydisp
                              , J = Math.max(z, 0)
                              , F = Math.min(C, this._bufferService.rows - 1);
                            if (!(J >= this._bufferService.rows || 0 > F)) {
                                var B = document.createDocumentFragment();
                                r ? B.appendChild(this._createSelectionElement(J, u[0], w[0], F - J + 1)) : (B.appendChild(this._createSelectionElement(J, z === J ? u[0] : 0, J === C ? w[0] : this._bufferService.cols)),
                                (B.appendChild(this._createSelectionElement(J + 1, 0, this._bufferService.cols, F - J - 1)),
                                J !== F) && B.appendChild(this._createSelectionElement(F, 0, C === F ? w[0] : this._bufferService.cols)));
                                this._selectionContainer.appendChild(B)
                            }
                        }
                    }
                    ,
                    m.prototype._createSelectionElement = function(u, w, r, z) {
                        void 0 === z && (z = 1);
                        var C = document.createElement("div");
                        return C.style.height = z * this.dimensions.actualCellHeight + "px",
                        C.style.top = u * this.dimensions.actualCellHeight + "px",
                        C.style.left = w * this.dimensions.actualCellWidth + "px",
                        C.style.width = this.dimensions.actualCellWidth * (r - w) + "px",
                        C
                    }
                    ,
                    m.prototype.onCursorMove = function() {}
                    ,
                    m.prototype.onOptionsChanged = function() {
                        this._updateDimensions();
                        this._injectCss()
                    }
                    ,
                    m.prototype.clear = function() {
                        for (var u = 0, w = this._rowElements; u < w.length; u++)
                            w[u].innerText = ""
                    }
                    ,
                    m.prototype.renderRows = function(u, w) {
                        for (var r = this._bufferService.buffer.ybase + this._bufferService.buffer.y, z = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1), C = this._optionsService.rawOptions.cursorBlink; u <= w; u++) {
                            var J = this._rowElements[u];
                            J.innerText = "";
                            var F = u + this._bufferService.buffer.ydisp
                              , B = this._bufferService.buffer.lines.get(F);
                            J.appendChild(this._rowFactory.createRow(B, F, F === r, this._optionsService.rawOptions.cursorStyle, z, C, this.dimensions.actualCellWidth, this._bufferService.cols))
                        }
                    }
                    ,
                    Object.defineProperty(m.prototype, "_terminalSelector", {
                        get: function() {
                            return ".xterm-dom-renderer-owner-" + this._terminalClass
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    m.prototype._onLinkHover = function(u) {
                        this._setCellUnderline(u.x1, u.x2, u.y1, u.y2, u.cols, !0)
                    }
                    ,
                    m.prototype._onLinkLeave = function(u) {
                        this._setCellUnderline(u.x1, u.x2, u.y1, u.y2, u.cols, !1)
                    }
                    ,
                    m.prototype._setCellUnderline = function(u, w, r, z, C, J) {
                        for (; u !== w || r !== z; ) {
                            var F = this._rowElements[r];
                            if (!F)
                                break;
                            (F = F.children[u]) && (F.style.textDecoration = J ? "underline" : "none");
                            ++u >= C && (u = 0,
                            r++)
                        }
                    }
                    ,
                    p([t(6, d.IInstantiationService), t(7, k.ICharSizeService), t(8, d.IOptionsService), t(9, d.IBufferService)], m)
                }(A.Disposable);
                l.DomRenderer = q
            },
            3787: function(A, l, q) {
                function h(b, e, f) {
                    for (; b.length < f; )
                        b = e + b;
                    return b
                }
                var v = this && this.__decorate || function(b, e, f, m) {
                    var u, w = arguments.length, r = 3 > w ? e : null === m ? m = Object.getOwnPropertyDescriptor(e, f) : m;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        r = Reflect.decorate(b, e, f, m);
                    else
                        for (var z = b.length - 1; 0 <= z; z--)
                            (u = b[z]) && (r = (3 > w ? u(r) : 3 < w ? u(e, f, r) : u(e, f)) || r);
                    return 3 < w && r && Object.defineProperty(e, f, r),
                    r
                }
                  , p = this && this.__param || function(b, e) {
                    return function(f, m) {
                        e(f, m, b)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.DomRendererRowFactory = l.CURSOR_STYLE_UNDERLINE_CLASS = l.CURSOR_STYLE_BAR_CLASS = l.CURSOR_STYLE_BLOCK_CLASS = l.CURSOR_BLINK_CLASS = l.CURSOR_CLASS = l.STRIKETHROUGH_CLASS = l.UNDERLINE_CLASS = l.ITALIC_CLASS = l.DIM_CLASS = l.BOLD_CLASS = void 0;
                var t = q(8803)
                  , n = q(643)
                  , g = q(511)
                  , k = q(2585)
                  , d = q(4774)
                  , c = q(4725)
                  , a = q(4269);
                l.BOLD_CLASS = "xterm-bold";
                l.DIM_CLASS = "xterm-dim";
                l.ITALIC_CLASS = "xterm-italic";
                l.UNDERLINE_CLASS = "xterm-underline";
                l.STRIKETHROUGH_CLASS = "xterm-strikethrough";
                l.CURSOR_CLASS = "xterm-cursor";
                l.CURSOR_BLINK_CLASS = "xterm-cursor-blink";
                l.CURSOR_STYLE_BLOCK_CLASS = "xterm-cursor-block";
                l.CURSOR_STYLE_BAR_CLASS = "xterm-cursor-bar";
                l.CURSOR_STYLE_UNDERLINE_CLASS = "xterm-cursor-underline";
                A = function() {
                    function b(e, f, m, u, w) {
                        this._document = e;
                        this._colors = f;
                        this._characterJoinerService = m;
                        this._optionsService = u;
                        this._coreService = w;
                        this._workCell = new g.CellData
                    }
                    return b.prototype.setColors = function(e) {
                        this._colors = e
                    }
                    ,
                    b.prototype.createRow = function(e, f, m, u, w, r, z, C) {
                        var J = this._document.createDocumentFragment();
                        f = this._characterJoinerService.getJoinedCharacters(f);
                        for (var F = 0, B = Math.min(e.length, C) - 1; 0 <= B; B--)
                            if (e.loadCell(B, this._workCell).getCode() !== n.NULL_CELL_CODE || m && B === w) {
                                F = B + 1;
                                break
                            }
                        for (B = 0; B < F; B++) {
                            e.loadCell(B, this._workCell);
                            var y = this._workCell.getWidth();
                            if (0 !== y) {
                                var E = !1;
                                C = B;
                                var G = this._workCell;
                                0 < f.length && B === f[0][0] && (E = !0,
                                C = f.shift(),
                                G = new a.JoinedCellData(this._workCell,e.translateToString(!0, C[0], C[1]),C[1] - C[0]),
                                C = C[1] - 1,
                                y = G.getWidth());
                                var I = this._document.createElement("span");
                                if (1 < y && (I.style.width = z * y + "px"),
                                E && (I.style.display = "inline",
                                w >= B && w <= C && (w = B)),
                                !this._coreService.isCursorHidden && m && B === w)
                                    switch (I.classList.add(l.CURSOR_CLASS),
                                    r && I.classList.add(l.CURSOR_BLINK_CLASS),
                                    u) {
                                    case "bar":
                                        I.classList.add(l.CURSOR_STYLE_BAR_CLASS);
                                        break;
                                    case "underline":
                                        I.classList.add(l.CURSOR_STYLE_UNDERLINE_CLASS);
                                        break;
                                    default:
                                        I.classList.add(l.CURSOR_STYLE_BLOCK_CLASS)
                                    }
                                G.isBold() && I.classList.add(l.BOLD_CLASS);
                                G.isItalic() && I.classList.add(l.ITALIC_CLASS);
                                G.isDim() && I.classList.add(l.DIM_CLASS);
                                G.isUnderline() && I.classList.add(l.UNDERLINE_CLASS);
                                G.isInvisible() ? I.textContent = n.WHITESPACE_CELL_CHAR : I.textContent = G.getChars() || n.WHITESPACE_CELL_CHAR;
                                G.isStrikethrough() && I.classList.add(l.STRIKETHROUGH_CLASS);
                                B = G.getFgColor();
                                var Q = G.getFgColorMode();
                                E = G.getBgColor();
                                y = G.getBgColorMode();
                                var R = !!G.isInverse();
                                if (R) {
                                    var W = B;
                                    B = E;
                                    E = W;
                                    W = Q;
                                    Q = y;
                                    y = W
                                }
                                switch (Q) {
                                case 16777216:
                                case 33554432:
                                    G.isBold() && 8 > B && this._optionsService.rawOptions.drawBoldTextInBrightColors && (B += 8);
                                    this._applyMinimumContrast(I, this._colors.background, this._colors.ansi[B]) || I.classList.add("xterm-fg-" + B);
                                    break;
                                case 50331648:
                                    G = d.rgba.toColor(B >> 16 & 255, B >> 8 & 255, 255 & B);
                                    this._applyMinimumContrast(I, this._colors.background, G) || this._addStyle(I, "color:#" + h(B.toString(16), "0", 6));
                                    break;
                                default:
                                    this._applyMinimumContrast(I, this._colors.background, this._colors.foreground) || R && I.classList.add("xterm-fg-" + t.INVERTED_DEFAULT_COLOR)
                                }
                                switch (y) {
                                case 16777216:
                                case 33554432:
                                    I.classList.add("xterm-bg-" + E);
                                    break;
                                case 50331648:
                                    this._addStyle(I, "background-color:#" + h(E.toString(16), "0", 6));
                                    break;
                                default:
                                    R && I.classList.add("xterm-bg-" + t.INVERTED_DEFAULT_COLOR)
                                }
                                J.appendChild(I);
                                B = C
                            }
                        }
                        return J
                    }
                    ,
                    b.prototype._applyMinimumContrast = function(e, f, m) {
                        if (1 === this._optionsService.rawOptions.minimumContrastRatio)
                            return !1;
                        var u = this._colors.contrastCache.getColor(this._workCell.bg, this._workCell.fg);
                        return void 0 === u && (u = d.color.ensureContrastRatio(f, m, this._optionsService.rawOptions.minimumContrastRatio),
                        this._colors.contrastCache.setColor(this._workCell.bg, this._workCell.fg, null != u ? u : null)),
                        !!u && (this._addStyle(e, "color:" + u.css),
                        !0)
                    }
                    ,
                    b.prototype._addStyle = function(e, f) {
                        e.setAttribute("style", "" + (e.getAttribute("style") || "") + f + ";")
                    }
                    ,
                    v([p(2, c.ICharacterJoinerService), p(3, k.IOptionsService), p(4, k.ICoreService)], b)
                }();
                l.DomRendererRowFactory = A
            },
            456: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.SelectionModel = void 0;
                A = function() {
                    function q(h) {
                        this._bufferService = h;
                        this.isSelectAllActive = !1;
                        this.selectionStartLength = 0
                    }
                    return q.prototype.clearSelection = function() {
                        this.selectionEnd = this.selectionStart = void 0;
                        this.isSelectAllActive = !1;
                        this.selectionStartLength = 0
                    }
                    ,
                    Object.defineProperty(q.prototype, "finalSelectionStart", {
                        get: function() {
                            return this.isSelectAllActive ? [0, 0] : this.selectionEnd && this.selectionStart && this.areSelectionValuesReversed() ? this.selectionEnd : this.selectionStart
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(q.prototype, "finalSelectionEnd", {
                        get: function() {
                            if (this.isSelectAllActive)
                                return [this._bufferService.cols, this._bufferService.buffer.ybase + this._bufferService.rows - 1];
                            if (this.selectionStart) {
                                if (!this.selectionEnd || this.areSelectionValuesReversed()) {
                                    var h = this.selectionStart[0] + this.selectionStartLength;
                                    return h > this._bufferService.cols ? 0 == h % this._bufferService.cols ? [this._bufferService.cols, this.selectionStart[1] + Math.floor(h / this._bufferService.cols) - 1] : [h % this._bufferService.cols, this.selectionStart[1] + Math.floor(h / this._bufferService.cols)] : [h, this.selectionStart[1]]
                                }
                                return this.selectionStartLength && this.selectionEnd[1] === this.selectionStart[1] ? [Math.max(this.selectionStart[0] + this.selectionStartLength, this.selectionEnd[0]), this.selectionEnd[1]] : this.selectionEnd
                            }
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    q.prototype.areSelectionValuesReversed = function() {
                        var h = this.selectionStart
                          , v = this.selectionEnd;
                        return !(!h || !v) && (h[1] > v[1] || h[1] === v[1] && h[0] > v[0])
                    }
                    ,
                    q.prototype.onTrim = function(h) {
                        return this.selectionStart && (this.selectionStart[1] -= h),
                        this.selectionEnd && (this.selectionEnd[1] -= h),
                        this.selectionEnd && 0 > this.selectionEnd[1] ? (this.clearSelection(),
                        !0) : (this.selectionStart && 0 > this.selectionStart[1] && (this.selectionStart[1] = 0),
                        !1)
                    }
                    ,
                    q
                }();
                l.SelectionModel = A
            }
            ,
            428: function(A, l, q) {
                var h = this && this.__decorate || function(g, k, d, c) {
                    var a, b = arguments.length, e = 3 > b ? k : null === c ? c = Object.getOwnPropertyDescriptor(k, d) : c;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        e = Reflect.decorate(g, k, d, c);
                    else
                        for (var f = g.length - 1; 0 <= f; f--)
                            (a = g[f]) && (e = (3 > b ? a(e) : 3 < b ? a(k, d, e) : a(k, d)) || e);
                    return 3 < b && e && Object.defineProperty(k, d, e),
                    e
                }
                  , v = this && this.__param || function(g, k) {
                    return function(d, c) {
                        k(d, c, g)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CharSizeService = void 0;
                var p = q(2585)
                  , t = q(8460);
                A = function() {
                    function g(k, d, c) {
                        this._optionsService = c;
                        this.height = this.width = 0;
                        this._onCharSizeChange = new t.EventEmitter;
                        this._measureStrategy = new n(k,d,this._optionsService)
                    }
                    return Object.defineProperty(g.prototype, "hasValidSize", {
                        get: function() {
                            return 0 < this.width && 0 < this.height
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(g.prototype, "onCharSizeChange", {
                        get: function() {
                            return this._onCharSizeChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    g.prototype.measure = function() {
                        var k = this._measureStrategy.measure();
                        k.width === this.width && k.height === this.height || (this.width = k.width,
                        this.height = k.height,
                        this._onCharSizeChange.fire())
                    }
                    ,
                    h([v(2, p.IOptionsService)], g)
                }();
                l.CharSizeService = A;
                var n = function() {
                    function g(k, d, c) {
                        this._document = k;
                        this._parentElement = d;
                        this._optionsService = c;
                        this._result = {
                            width: 0,
                            height: 0
                        };
                        this._measureElement = this._document.createElement("span");
                        this._measureElement.classList.add("xterm-char-measure-element");
                        this._measureElement.textContent = "W";
                        this._measureElement.setAttribute("aria-hidden", "true");
                        this._parentElement.appendChild(this._measureElement)
                    }
                    return g.prototype.measure = function() {
                        this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily;
                        this._measureElement.style.fontSize = this._optionsService.rawOptions.fontSize + "px";
                        var k = this._measureElement.getBoundingClientRect();
                        return 0 !== k.width && 0 !== k.height && (this._result.width = k.width,
                        this._result.height = Math.ceil(k.height)),
                        this._result
                    }
                    ,
                    g
                }()
            },
            4269: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                ), p = this && this.__decorate || function(d, c, a, b) {
                    var e, f = arguments.length, m = 3 > f ? c : null === b ? b = Object.getOwnPropertyDescriptor(c, a) : b;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        m = Reflect.decorate(d, c, a, b);
                    else
                        for (var u = d.length - 1; 0 <= u; u--)
                            (e = d[u]) && (m = (3 > f ? e(m) : 3 < f ? e(c, a, m) : e(c, a)) || m);
                    return 3 < f && m && Object.defineProperty(c, a, m),
                    m
                }
                , t = this && this.__param || function(d, c) {
                    return function(a, b) {
                        c(a, b, d)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CharacterJoinerService = l.JoinedCellData = void 0;
                A = q(3734);
                var n = q(643)
                  , g = q(511)
                  , k = q(2585);
                q = function(d) {
                    function c(a, b, e) {
                        var f = d.call(this) || this;
                        return f.content = 0,
                        f.fg = a.fg,
                        f.bg = a.bg,
                        f.combinedData = b,
                        f._width = e,
                        f
                    }
                    return v(c, d),
                    c.prototype.isCombined = function() {
                        return 2097152
                    }
                    ,
                    c.prototype.getWidth = function() {
                        return this._width
                    }
                    ,
                    c.prototype.getChars = function() {
                        return this.combinedData
                    }
                    ,
                    c.prototype.getCode = function() {
                        return 2097151
                    }
                    ,
                    c.prototype.setFromCharData = function(a) {
                        throw Error("not implemented");
                    }
                    ,
                    c.prototype.getAsCharData = function() {
                        return [this.fg, this.getChars(), this.getWidth(), this.getCode()]
                    }
                    ,
                    c
                }(A.AttributeData);
                l.JoinedCellData = q;
                q = function() {
                    function d(c) {
                        this._bufferService = c;
                        this._characterJoiners = [];
                        this._nextCharacterJoinerId = 0;
                        this._workCell = new g.CellData
                    }
                    return d.prototype.register = function(c) {
                        c = {
                            id: this._nextCharacterJoinerId++,
                            handler: c
                        };
                        return this._characterJoiners.push(c),
                        c.id
                    }
                    ,
                    d.prototype.deregister = function(c) {
                        for (var a = 0; a < this._characterJoiners.length; a++)
                            if (this._characterJoiners[a].id === c)
                                return this._characterJoiners.splice(a, 1),
                                !0;
                        return !1
                    }
                    ,
                    d.prototype.getJoinedCharacters = function(c) {
                        if (0 === this._characterJoiners.length)
                            return [];
                        c = this._bufferService.buffer.lines.get(c);
                        if (!c || 0 === c.length)
                            return [];
                        for (var a = [], b = c.translateToString(!0), e = 0, f = 0, m = 0, u = c.getFg(0), w = c.getBg(0), r = 0; r < c.getTrimmedLength(); r++)
                            if (c.loadCell(r, this._workCell),
                            0 !== this._workCell.getWidth()) {
                                if (this._workCell.fg !== u || this._workCell.bg !== w) {
                                    if (1 < r - e)
                                        for (e = this._getJoinedRanges(b, m, f, c, e),
                                        m = 0; m < e.length; m++)
                                            a.push(e[m]);
                                    e = r;
                                    m = f;
                                    u = this._workCell.fg;
                                    w = this._workCell.bg
                                }
                                f += this._workCell.getChars().length || n.WHITESPACE_CELL_CHAR.length
                            }
                        if (1 < this._bufferService.cols - e)
                            for (e = this._getJoinedRanges(b, m, f, c, e),
                            m = 0; m < e.length; m++)
                                a.push(e[m]);
                        return a
                    }
                    ,
                    d.prototype._getJoinedRanges = function(c, a, b, e, f) {
                        c = c.substring(a, b);
                        a = [];
                        try {
                            a = this._characterJoiners[0].handler(c)
                        } catch (w) {
                            console.error(w)
                        }
                        for (b = 1; b < this._characterJoiners.length; b++)
                            try {
                                for (var m = this._characterJoiners[b].handler(c), u = 0; u < m.length; u++)
                                    d._mergeRanges(a, m[u])
                            } catch (w) {
                                console.error(w)
                            }
                        return this._stringRangesToCellRanges(a, e, f),
                        a
                    }
                    ,
                    d.prototype._stringRangesToCellRanges = function(c, a, b) {
                        var e = 0
                          , f = !1
                          , m = 0
                          , u = c[e];
                        if (u) {
                            for (; b < this._bufferService.cols; b++) {
                                var w = a.getWidth(b)
                                  , r = a.getString(b).length || n.WHITESPACE_CELL_CHAR.length;
                                if (0 !== w) {
                                    if (!f && u[0] <= m && (u[0] = b,
                                    f = !0),
                                    u[1] <= m) {
                                        if (u[1] = b,
                                        !(u = c[++e]))
                                            break;
                                        u[0] <= m ? (u[0] = b,
                                        f = !0) : f = !1
                                    }
                                    m += r
                                }
                            }
                            u && (u[1] = this._bufferService.cols)
                        }
                    }
                    ,
                    d._mergeRanges = function(c, a) {
                        for (var b = !1, e = 0; e < c.length; e++) {
                            var f = c[e];
                            if (b) {
                                if (a[1] <= f[0])
                                    return c[e - 1][1] = a[1],
                                    c;
                                if (a[1] <= f[1])
                                    return c[e - 1][1] = Math.max(a[1], f[1]),
                                    c.splice(e, 1),
                                    c;
                                c.splice(e, 1);
                                e--
                            } else {
                                if (a[1] <= f[0])
                                    return c.splice(e, 0, a),
                                    c;
                                if (a[1] <= f[1])
                                    return f[0] = Math.min(a[0], f[0]),
                                    c;
                                a[0] < f[1] && (f[0] = Math.min(a[0], f[0]),
                                b = !0)
                            }
                        }
                        return b ? c[c.length - 1][1] = a[1] : c.push(a),
                        c
                    }
                    ,
                    d = p([t(0, k.IBufferService)], d)
                }();
                l.CharacterJoinerService = q
            },
            5114: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CoreBrowserService = void 0;
                A = function() {
                    function q(h) {
                        this._textarea = h
                    }
                    return Object.defineProperty(q.prototype, "isFocused", {
                        get: function() {
                            return (this._textarea.getRootNode ? this._textarea.getRootNode() : document).activeElement === this._textarea && document.hasFocus()
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    q
                }();
                l.CoreBrowserService = A
            }
            ,
            8934: function(A, l, q) {
                var h = this && this.__decorate || function(n, g, k, d) {
                    var c, a = arguments.length, b = 3 > a ? g : null === d ? d = Object.getOwnPropertyDescriptor(g, k) : d;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        b = Reflect.decorate(n, g, k, d);
                    else
                        for (var e = n.length - 1; 0 <= e; e--)
                            (c = n[e]) && (b = (3 > a ? c(b) : 3 < a ? c(g, k, b) : c(g, k)) || b);
                    return 3 < a && b && Object.defineProperty(g, k, b),
                    b
                }
                  , v = this && this.__param || function(n, g) {
                    return function(k, d) {
                        g(k, d, n)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.MouseService = void 0;
                var p = q(4725)
                  , t = q(9806);
                A = function() {
                    function n(g, k) {
                        this._renderService = g;
                        this._charSizeService = k
                    }
                    return n.prototype.getCoords = function(g, k, d, c, a) {
                        return (0,
                        t.getCoords)(g, k, d, c, this._charSizeService.hasValidSize, this._renderService.dimensions.actualCellWidth, this._renderService.dimensions.actualCellHeight, a)
                    }
                    ,
                    n.prototype.getRawByteCoords = function(g, k, d, c) {
                        g = this.getCoords(g, k, d, c);
                        return (0,
                        t.getRawByteCoords)(g)
                    }
                    ,
                    h([v(0, p.IRenderService), v(1, p.ICharSizeService)], n)
                }();
                l.MouseService = A
            },
            3230: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(b, e) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(f, m) {
                        f.__proto__ = m
                    }
                    || function(f, m) {
                        for (var u in m)
                            Object.prototype.hasOwnProperty.call(m, u) && (f[u] = m[u])
                    }
                    ,
                    h(b, e)
                }
                ,
                function(b, e) {
                    function f() {
                        this.constructor = b
                    }
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
                    h(b, e);
                    b.prototype = null === e ? Object.create(e) : (f.prototype = e.prototype,
                    new f)
                }
                ), p = this && this.__decorate || function(b, e, f, m) {
                    var u, w = arguments.length, r = 3 > w ? e : null === m ? m = Object.getOwnPropertyDescriptor(e, f) : m;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        r = Reflect.decorate(b, e, f, m);
                    else
                        for (var z = b.length - 1; 0 <= z; z--)
                            (u = b[z]) && (r = (3 > w ? u(r) : 3 < w ? u(e, f, r) : u(e, f)) || r);
                    return 3 < w && r && Object.defineProperty(e, f, r),
                    r
                }
                , t = this && this.__param || function(b, e) {
                    return function(f, m) {
                        e(f, m, b)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.RenderService = void 0;
                var n = q(6193)
                  , g = q(8460);
                A = q(844);
                var k = q(5596)
                  , d = q(3656)
                  , c = q(2585)
                  , a = q(4725);
                q = function(b) {
                    function e(f, m, u, w, r, z) {
                        var C = b.call(this) || this;
                        if (C._renderer = f,
                        C._rowCount = m,
                        C._charSizeService = r,
                        C._isPaused = !1,
                        C._needsFullRefresh = !1,
                        C._isNextRenderRedrawOnly = !0,
                        C._needsSelectionRefresh = !1,
                        C._canvasWidth = 0,
                        C._canvasHeight = 0,
                        C._selectionState = {
                            start: void 0,
                            end: void 0,
                            columnSelectMode: !1
                        },
                        C._onDimensionsChange = new g.EventEmitter,
                        C._onRender = new g.EventEmitter,
                        C._onRefreshRequest = new g.EventEmitter,
                        C.register({
                            dispose: function() {
                                return C._renderer.dispose()
                            }
                        }),
                        C._renderDebouncer = new n.RenderDebouncer(function(F, B) {
                            return C._renderRows(F, B)
                        }
                        ),
                        C.register(C._renderDebouncer),
                        C._screenDprMonitor = new k.ScreenDprMonitor,
                        C._screenDprMonitor.setListener(function() {
                            return C.onDevicePixelRatioChange()
                        }),
                        C.register(C._screenDprMonitor),
                        C.register(z.onResize(function(F) {
                            return C._fullRefresh()
                        })),
                        C.register(w.onOptionChange(function() {
                            return C._renderer.onOptionsChanged()
                        })),
                        C.register(C._charSizeService.onCharSizeChange(function() {
                            return C.onCharSizeChanged()
                        })),
                        C._renderer.onRequestRedraw(function(F) {
                            return C.refreshRows(F.start, F.end, !0)
                        }),
                        C.register((0,
                        d.addDisposableDomListener)(window, "resize", function() {
                            return C.onDevicePixelRatioChange()
                        })),
                        "IntersectionObserver"in window) {
                            var J = new IntersectionObserver(function(F) {
                                return C._onIntersectionChange(F[F.length - 1])
                            }
                            ,{
                                threshold: 0
                            });
                            J.observe(u);
                            C.register({
                                dispose: function() {
                                    return J.disconnect()
                                }
                            })
                        }
                        return C
                    }
                    return v(e, b),
                    Object.defineProperty(e.prototype, "onDimensionsChange", {
                        get: function() {
                            return this._onDimensionsChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "onRenderedBufferChange", {
                        get: function() {
                            return this._onRender.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "onRefreshRequest", {
                        get: function() {
                            return this._onRefreshRequest.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(e.prototype, "dimensions", {
                        get: function() {
                            return this._renderer.dimensions
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    e.prototype._onIntersectionChange = function(f) {
                        (this._isPaused = void 0 === f.isIntersecting ? 0 === f.intersectionRatio : !f.isIntersecting) || this._charSizeService.hasValidSize || this._charSizeService.measure();
                        !this._isPaused && this._needsFullRefresh && (this.refreshRows(0, this._rowCount - 1),
                        this._needsFullRefresh = !1)
                    }
                    ,
                    e.prototype.refreshRows = function(f, m, u) {
                        void 0 === u && (u = !1);
                        this._isPaused ? this._needsFullRefresh = !0 : (u || (this._isNextRenderRedrawOnly = !1),
                        this._renderDebouncer.refresh(f, m, this._rowCount))
                    }
                    ,
                    e.prototype._renderRows = function(f, m) {
                        this._renderer.renderRows(f, m);
                        this._needsSelectionRefresh && (this._renderer.onSelectionChanged(this._selectionState.start, this._selectionState.end, this._selectionState.columnSelectMode),
                        this._needsSelectionRefresh = !1);
                        this._isNextRenderRedrawOnly || this._onRender.fire({
                            start: f,
                            end: m
                        });
                        this._isNextRenderRedrawOnly = !0
                    }
                    ,
                    e.prototype.resize = function(f, m) {
                        this._rowCount = m;
                        this._fireOnCanvasResize()
                    }
                    ,
                    e.prototype.changeOptions = function() {
                        this._renderer.onOptionsChanged();
                        this.refreshRows(0, this._rowCount - 1);
                        this._fireOnCanvasResize()
                    }
                    ,
                    e.prototype._fireOnCanvasResize = function() {
                        this._renderer.dimensions.canvasWidth === this._canvasWidth && this._renderer.dimensions.canvasHeight === this._canvasHeight || this._onDimensionsChange.fire(this._renderer.dimensions)
                    }
                    ,
                    e.prototype.dispose = function() {
                        b.prototype.dispose.call(this)
                    }
                    ,
                    e.prototype.setRenderer = function(f) {
                        var m = this;
                        this._renderer.dispose();
                        this._renderer = f;
                        this._renderer.onRequestRedraw(function(u) {
                            return m.refreshRows(u.start, u.end, !0)
                        });
                        this._needsSelectionRefresh = !0;
                        this._fullRefresh()
                    }
                    ,
                    e.prototype._fullRefresh = function() {
                        this._isPaused ? this._needsFullRefresh = !0 : this.refreshRows(0, this._rowCount - 1)
                    }
                    ,
                    e.prototype.clearTextureAtlas = function() {
                        var f, m;
                        null === (m = null === (f = this._renderer) || void 0 === f ? void 0 : f.clearTextureAtlas) || void 0 === m || m.call(f);
                        this._fullRefresh()
                    }
                    ,
                    e.prototype.setColors = function(f) {
                        this._renderer.setColors(f);
                        this._fullRefresh()
                    }
                    ,
                    e.prototype.onDevicePixelRatioChange = function() {
                        this._charSizeService.measure();
                        this._renderer.onDevicePixelRatioChange();
                        this.refreshRows(0, this._rowCount - 1)
                    }
                    ,
                    e.prototype.onResize = function(f, m) {
                        this._renderer.onResize(f, m);
                        this._fullRefresh()
                    }
                    ,
                    e.prototype.onCharSizeChanged = function() {
                        this._renderer.onCharSizeChanged()
                    }
                    ,
                    e.prototype.onBlur = function() {
                        this._renderer.onBlur()
                    }
                    ,
                    e.prototype.onFocus = function() {
                        this._renderer.onFocus()
                    }
                    ,
                    e.prototype.onSelectionChanged = function(f, m, u) {
                        this._selectionState.start = f;
                        this._selectionState.end = m;
                        this._selectionState.columnSelectMode = u;
                        this._renderer.onSelectionChanged(f, m, u)
                    }
                    ,
                    e.prototype.onCursorMove = function() {
                        this._renderer.onCursorMove()
                    }
                    ,
                    e.prototype.clear = function() {
                        this._renderer.clear()
                    }
                    ,
                    p([t(3, c.IOptionsService), t(4, a.ICharSizeService), t(5, c.IBufferService)], e)
                }(A.Disposable);
                l.RenderService = q
            },
            9312: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(u, w) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(r, z) {
                        r.__proto__ = z
                    }
                    || function(r, z) {
                        for (var C in z)
                            Object.prototype.hasOwnProperty.call(z, C) && (r[C] = z[C])
                    }
                    ,
                    h(u, w)
                }
                ,
                function(u, w) {
                    function r() {
                        this.constructor = u
                    }
                    if ("function" != typeof w && null !== w)
                        throw new TypeError("Class extends value " + String(w) + " is not a constructor or null");
                    h(u, w);
                    u.prototype = null === w ? Object.create(w) : (r.prototype = w.prototype,
                    new r)
                }
                ), p = this && this.__decorate || function(u, w, r, z) {
                    var C, J = arguments.length, F = 3 > J ? w : null === z ? z = Object.getOwnPropertyDescriptor(w, r) : z;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        F = Reflect.decorate(u, w, r, z);
                    else
                        for (var B = u.length - 1; 0 <= B; B--)
                            (C = u[B]) && (F = (3 > J ? C(F) : 3 < J ? C(w, r, F) : C(w, r)) || F);
                    return 3 < J && F && Object.defineProperty(w, r, F),
                    F
                }
                , t = this && this.__param || function(u, w) {
                    return function(r, z) {
                        w(r, z, u)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.SelectionService = void 0;
                var n = q(6114)
                  , g = q(456)
                  , k = q(511)
                  , d = q(8460)
                  , c = q(4725)
                  , a = q(2585)
                  , b = q(9806)
                  , e = q(9504);
                A = q(844);
                var f = q(4841);
                q = String.fromCharCode(160);
                var m = new RegExp(q,"g");
                q = function(u) {
                    function w(r, z, C, J, F, B, y, E) {
                        var G = u.call(this) || this;
                        return G._element = r,
                        G._screenElement = z,
                        G._linkifier = C,
                        G._bufferService = J,
                        G._coreService = F,
                        G._mouseService = B,
                        G._optionsService = y,
                        G._renderService = E,
                        G._dragScrollAmount = 0,
                        G._enabled = !0,
                        G._workCell = new k.CellData,
                        G._mouseDownTimeStamp = 0,
                        G._oldHasSelection = !1,
                        G._oldSelectionStart = void 0,
                        G._oldSelectionEnd = void 0,
                        G._onLinuxMouseSelection = G.register(new d.EventEmitter),
                        G._onRedrawRequest = G.register(new d.EventEmitter),
                        G._onSelectionChange = G.register(new d.EventEmitter),
                        G._onRequestScrollLines = G.register(new d.EventEmitter),
                        G._mouseMoveListener = function(I) {
                            return G._onMouseMove(I)
                        }
                        ,
                        G._mouseUpListener = function(I) {
                            return G._onMouseUp(I)
                        }
                        ,
                        G._coreService.onUserInput(function() {
                            G.hasSelection && G.clearSelection()
                        }),
                        G._trimListener = G._bufferService.buffer.lines.onTrim(function(I) {
                            return G._onTrim(I)
                        }),
                        G.register(G._bufferService.buffers.onBufferActivate(function(I) {
                            return G._onBufferActivate(I)
                        })),
                        G.enable(),
                        G._model = new g.SelectionModel(G._bufferService),
                        G._activeSelectionMode = 0,
                        G
                    }
                    return v(w, u),
                    Object.defineProperty(w.prototype, "onLinuxMouseSelection", {
                        get: function() {
                            return this._onLinuxMouseSelection.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "onRequestRedraw", {
                        get: function() {
                            return this._onRedrawRequest.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "onSelectionChange", {
                        get: function() {
                            return this._onSelectionChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "onRequestScrollLines", {
                        get: function() {
                            return this._onRequestScrollLines.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    w.prototype.dispose = function() {
                        this._removeMouseDownListeners()
                    }
                    ,
                    w.prototype.reset = function() {
                        this.clearSelection()
                    }
                    ,
                    w.prototype.disable = function() {
                        this.clearSelection();
                        this._enabled = !1
                    }
                    ,
                    w.prototype.enable = function() {
                        this._enabled = !0
                    }
                    ,
                    Object.defineProperty(w.prototype, "selectionStart", {
                        get: function() {
                            return this._model.finalSelectionStart
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "selectionEnd", {
                        get: function() {
                            return this._model.finalSelectionEnd
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "hasSelection", {
                        get: function() {
                            var r = this._model.finalSelectionStart
                              , z = this._model.finalSelectionEnd;
                            return !(!r || !z || r[0] === z[0] && r[1] === z[1])
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(w.prototype, "selectionText", {
                        get: function() {
                            var r = this._model.finalSelectionStart
                              , z = this._model.finalSelectionEnd;
                            if (!r || !z)
                                return "";
                            var C = this._bufferService.buffer
                              , J = [];
                            if (3 === this._activeSelectionMode) {
                                if (r[0] === z[0])
                                    return "";
                                for (var F = r[1]; F <= z[1]; F++) {
                                    var B = C.translateBufferLineToString(F, !0, r[0], z[0]);
                                    J.push(B)
                                }
                            } else {
                                J.push(C.translateBufferLineToString(r[1], !0, r[0], r[1] === z[1] ? z[0] : void 0));
                                for (F = r[1] + 1; F <= z[1] - 1; F++) {
                                    var y = C.lines.get(F);
                                    B = C.translateBufferLineToString(F, !0);
                                    (null == y ? 0 : y.isWrapped) ? J[J.length - 1] += B : J.push(B)
                                }
                                r[1] !== z[1] && (y = C.lines.get(z[1]),
                                B = C.translateBufferLineToString(z[1], !0, 0, z[0]),
                                y && y.isWrapped ? J[J.length - 1] += B : J.push(B))
                            }
                            return J.map(function(E) {
                                return E.replace(m, " ")
                            }).join(n.isWindows ? "\r\n" : "\n")
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    w.prototype.clearSelection = function() {
                        this._model.clearSelection();
                        this._removeMouseDownListeners();
                        this.refresh();
                        this._onSelectionChange.fire()
                    }
                    ,
                    w.prototype.refresh = function(r) {
                        var z = this;
                        this._refreshAnimationFrame || (this._refreshAnimationFrame = window.requestAnimationFrame(function() {
                            return z._refresh()
                        }));
                        n.isLinux && r && this.selectionText.length && this._onLinuxMouseSelection.fire(this.selectionText)
                    }
                    ,
                    w.prototype._refresh = function() {
                        this._refreshAnimationFrame = void 0;
                        this._onRedrawRequest.fire({
                            start: this._model.finalSelectionStart,
                            end: this._model.finalSelectionEnd,
                            columnSelectMode: 3 === this._activeSelectionMode
                        })
                    }
                    ,
                    w.prototype._isClickInSelection = function(r) {
                        r = this._getMouseBufferCoords(r);
                        var z = this._model.finalSelectionStart
                          , C = this._model.finalSelectionEnd;
                        return !!(z && C && r) && this._areCoordsInSelection(r, z, C)
                    }
                    ,
                    w.prototype._areCoordsInSelection = function(r, z, C) {
                        return r[1] > z[1] && r[1] < C[1] || z[1] === C[1] && r[1] === z[1] && r[0] >= z[0] && r[0] < C[0] || z[1] < C[1] && r[1] === C[1] && r[0] < C[0] || z[1] < C[1] && r[1] === z[1] && r[0] >= z[0]
                    }
                    ,
                    w.prototype._selectWordAtCursor = function(r, z) {
                        var C, J, F = null === (J = null === (C = this._linkifier.currentLink) || void 0 === C ? void 0 : C.link) || void 0 === J ? void 0 : J.range;
                        if (F)
                            return this._model.selectionStart = [F.start.x - 1, F.start.y - 1],
                            this._model.selectionStartLength = (0,
                            f.getRangeLength)(F, this._bufferService.cols),
                            this._model.selectionEnd = void 0,
                            !0;
                        r = this._getMouseBufferCoords(r);
                        return !!r && (this._selectWordAt(r, z),
                        this._model.selectionEnd = void 0,
                        !0)
                    }
                    ,
                    w.prototype.selectAll = function() {
                        this._model.isSelectAllActive = !0;
                        this.refresh();
                        this._onSelectionChange.fire()
                    }
                    ,
                    w.prototype.selectLines = function(r, z) {
                        this._model.clearSelection();
                        r = Math.max(r, 0);
                        z = Math.min(z, this._bufferService.buffer.lines.length - 1);
                        this._model.selectionStart = [0, r];
                        this._model.selectionEnd = [this._bufferService.cols, z];
                        this.refresh();
                        this._onSelectionChange.fire()
                    }
                    ,
                    w.prototype._onTrim = function(r) {
                        this._model.onTrim(r) && this.refresh()
                    }
                    ,
                    w.prototype._getMouseBufferCoords = function(r) {
                        if (r = this._mouseService.getCoords(r, this._screenElement, this._bufferService.cols, this._bufferService.rows, !0))
                            return r[0]--,
                            r[1]--,
                            r[1] += this._bufferService.buffer.ydisp,
                            r
                    }
                    ,
                    w.prototype._getMouseEventScrollAmount = function(r) {
                        r = (0,
                        b.getCoordsRelativeToElement)(r, this._screenElement)[1];
                        var z = this._renderService.dimensions.canvasHeight;
                        return 0 <= r && r <= z ? 0 : (r > z && (r -= z),
                        r = Math.min(Math.max(r, -50), 50),
                        (r /= 50) / Math.abs(r) + Math.round(14 * r))
                    }
                    ,
                    w.prototype.shouldForceSelection = function(r) {
                        return n.isMac ? r.altKey && this._optionsService.rawOptions.macOptionClickForcesSelection : r.shiftKey
                    }
                    ,
                    w.prototype.onMouseDown = function(r) {
                        if (this._mouseDownTimeStamp = r.timeStamp,
                        (2 !== r.button || !this.hasSelection) && 0 === r.button) {
                            if (!this._enabled) {
                                if (!this.shouldForceSelection(r))
                                    return;
                                r.stopPropagation()
                            }
                            r.preventDefault();
                            this._dragScrollAmount = 0;
                            this._enabled && r.shiftKey ? this._onIncrementalClick(r) : 1 === r.detail ? this._onSingleClick(r) : 2 === r.detail ? this._onDoubleClick(r) : 3 === r.detail && this._onTripleClick(r);
                            this._addMouseDownListeners();
                            this.refresh(!0)
                        }
                    }
                    ,
                    w.prototype._addMouseDownListeners = function() {
                        var r = this;
                        this._screenElement.ownerDocument && (this._screenElement.ownerDocument.addEventListener("mousemove", this._mouseMoveListener),
                        this._screenElement.ownerDocument.addEventListener("mouseup", this._mouseUpListener));
                        this._dragScrollIntervalTimer = window.setInterval(function() {
                            return r._dragScroll()
                        }, 50)
                    }
                    ,
                    w.prototype._removeMouseDownListeners = function() {
                        this._screenElement.ownerDocument && (this._screenElement.ownerDocument.removeEventListener("mousemove", this._mouseMoveListener),
                        this._screenElement.ownerDocument.removeEventListener("mouseup", this._mouseUpListener));
                        clearInterval(this._dragScrollIntervalTimer);
                        this._dragScrollIntervalTimer = void 0
                    }
                    ,
                    w.prototype._onIncrementalClick = function(r) {
                        this._model.selectionStart && (this._model.selectionEnd = this._getMouseBufferCoords(r))
                    }
                    ,
                    w.prototype._onSingleClick = function(r) {
                        if (this._model.selectionStartLength = 0,
                        this._model.isSelectAllActive = !1,
                        this._activeSelectionMode = this.shouldColumnSelect(r) ? 3 : 0,
                        this._model.selectionStart = this._getMouseBufferCoords(r),
                        this._model.selectionStart)
                            this._model.selectionEnd = void 0,
                            (r = this._bufferService.buffer.lines.get(this._model.selectionStart[1])) && r.length !== this._model.selectionStart[0] && 0 === r.hasWidth(this._model.selectionStart[0]) && this._model.selectionStart[0]++
                    }
                    ,
                    w.prototype._onDoubleClick = function(r) {
                        this._selectWordAtCursor(r, !0) && (this._activeSelectionMode = 1)
                    }
                    ,
                    w.prototype._onTripleClick = function(r) {
                        (r = this._getMouseBufferCoords(r)) && (this._activeSelectionMode = 2,
                        this._selectLineAt(r[1]))
                    }
                    ,
                    w.prototype.shouldColumnSelect = function(r) {
                        return r.altKey && !(n.isMac && this._optionsService.rawOptions.macOptionClickForcesSelection)
                    }
                    ,
                    w.prototype._onMouseMove = function(r) {
                        if (r.stopImmediatePropagation(),
                        this._model.selectionStart) {
                            var z = this._model.selectionEnd ? [this._model.selectionEnd[0], this._model.selectionEnd[1]] : null;
                            (this._model.selectionEnd = this._getMouseBufferCoords(r),
                            this._model.selectionEnd) ? (2 === this._activeSelectionMode ? this._model.selectionEnd[1] < this._model.selectionStart[1] ? this._model.selectionEnd[0] = 0 : this._model.selectionEnd[0] = this._bufferService.cols : 1 === this._activeSelectionMode && this._selectToWordAt(this._model.selectionEnd),
                            this._dragScrollAmount = this._getMouseEventScrollAmount(r),
                            3 !== this._activeSelectionMode && (0 < this._dragScrollAmount ? this._model.selectionEnd[0] = this._bufferService.cols : 0 > this._dragScrollAmount && (this._model.selectionEnd[0] = 0)),
                            r = this._bufferService.buffer,
                            this._model.selectionEnd[1] < r.lines.length && (r = r.lines.get(this._model.selectionEnd[1])) && 0 === r.hasWidth(this._model.selectionEnd[0]) && this._model.selectionEnd[0]++,
                            z && z[0] === this._model.selectionEnd[0] && z[1] === this._model.selectionEnd[1] || this.refresh(!0)) : this.refresh(!0)
                        }
                    }
                    ,
                    w.prototype._dragScroll = function() {
                        if (this._model.selectionEnd && this._model.selectionStart && this._dragScrollAmount) {
                            this._onRequestScrollLines.fire({
                                amount: this._dragScrollAmount,
                                suppressScrollEvent: !1
                            });
                            var r = this._bufferService.buffer;
                            0 < this._dragScrollAmount ? (3 !== this._activeSelectionMode && (this._model.selectionEnd[0] = this._bufferService.cols),
                            this._model.selectionEnd[1] = Math.min(r.ydisp + this._bufferService.rows, r.lines.length - 1)) : (3 !== this._activeSelectionMode && (this._model.selectionEnd[0] = 0),
                            this._model.selectionEnd[1] = r.ydisp);
                            this.refresh()
                        }
                    }
                    ,
                    w.prototype._onMouseUp = function(r) {
                        var z = r.timeStamp - this._mouseDownTimeStamp;
                        (this._removeMouseDownListeners(),
                        1 >= this.selectionText.length && 500 > z && r.altKey && this._optionsService.getOption("altClickMovesCursor")) ? this._bufferService.buffer.ybase === this._bufferService.buffer.ydisp && (r = this._mouseService.getCoords(r, this._element, this._bufferService.cols, this._bufferService.rows, !1)) && void 0 !== r[0] && void 0 !== r[1] && (r = (0,
                        e.moveToCellSequence)(r[0] - 1, r[1] - 1, this._bufferService, this._coreService.decPrivateModes.applicationCursorKeys),
                        this._coreService.triggerDataEvent(r, !0)) : this._fireEventIfSelectionChanged()
                    }
                    ,
                    w.prototype._fireEventIfSelectionChanged = function() {
                        var r = this._model.finalSelectionStart
                          , z = this._model.finalSelectionEnd
                          , C = !(!r || !z || r[0] === z[0] && r[1] === z[1]);
                        C ? r && z && (this._oldSelectionStart && this._oldSelectionEnd && r[0] === this._oldSelectionStart[0] && r[1] === this._oldSelectionStart[1] && z[0] === this._oldSelectionEnd[0] && z[1] === this._oldSelectionEnd[1] || this._fireOnSelectionChange(r, z, C)) : this._oldHasSelection && this._fireOnSelectionChange(r, z, C)
                    }
                    ,
                    w.prototype._fireOnSelectionChange = function(r, z, C) {
                        this._oldSelectionStart = r;
                        this._oldSelectionEnd = z;
                        this._oldHasSelection = C;
                        this._onSelectionChange.fire()
                    }
                    ,
                    w.prototype._onBufferActivate = function(r) {
                        var z = this;
                        this.clearSelection();
                        this._trimListener.dispose();
                        this._trimListener = r.activeBuffer.lines.onTrim(function(C) {
                            return z._onTrim(C)
                        })
                    }
                    ,
                    w.prototype._convertViewportColToCharacterIndex = function(r, z) {
                        for (var C = z[0], J = 0; z[0] >= J; J++) {
                            var F = r.loadCell(J, this._workCell).getChars().length;
                            0 === this._workCell.getWidth() ? C-- : 1 < F && z[0] !== J && (C += F - 1)
                        }
                        return C
                    }
                    ,
                    w.prototype.setSelection = function(r, z, C) {
                        this._model.clearSelection();
                        this._removeMouseDownListeners();
                        this._model.selectionStart = [r, z];
                        this._model.selectionStartLength = C;
                        this.refresh()
                    }
                    ,
                    w.prototype.rightClickSelect = function(r) {
                        this._isClickInSelection(r) || (this._selectWordAtCursor(r, !1) && this.refresh(!0),
                        this._fireEventIfSelectionChanged())
                    }
                    ,
                    w.prototype._getWordAt = function(r, z, C, J) {
                        if (void 0 === C && (C = !0),
                        void 0 === J && (J = !0),
                        !(r[0] >= this._bufferService.cols)) {
                            var F = this._bufferService.buffer
                              , B = F.lines.get(r[1]);
                            if (B) {
                                var y = F.translateBufferLineToString(r[1], !1)
                                  , E = this._convertViewportColToCharacterIndex(B, r)
                                  , G = E
                                  , I = r[0] - E
                                  , Q = 0
                                  , R = 0
                                  , W = 0
                                  , V = 0;
                                if (" " === y.charAt(E)) {
                                    for (; 0 < E && " " === y.charAt(E - 1); )
                                        E--;
                                    for (; G < y.length && " " === y.charAt(G + 1); )
                                        G++
                                } else {
                                    var S = r[0]
                                      , D = r[0];
                                    0 === B.getWidth(S) && (Q++,
                                    S--);
                                    2 === B.getWidth(D) && (R++,
                                    D++);
                                    var M = B.getString(D).length;
                                    for (1 < M && (V += M - 1,
                                    G += M - 1); 0 < S && 0 < E && !this._isCharWordSeparator(B.loadCell(S - 1, this._workCell)); )
                                        B.loadCell(S - 1, this._workCell),
                                        M = this._workCell.getChars().length,
                                        0 === this._workCell.getWidth() ? (Q++,
                                        S--) : 1 < M && (W += M - 1,
                                        E -= M - 1),
                                        E--,
                                        S--;
                                    for (; D < B.length && G + 1 < y.length && !this._isCharWordSeparator(B.loadCell(D + 1, this._workCell)); )
                                        B.loadCell(D + 1, this._workCell),
                                        S = this._workCell.getChars().length,
                                        2 === this._workCell.getWidth() ? (R++,
                                        D++) : 1 < S && (V += S - 1,
                                        G += S - 1),
                                        G++,
                                        D++
                                }
                                G++;
                                I = E + I - Q + W;
                                Q = Math.min(this._bufferService.cols, G - E + Q + R - W - V);
                                if (z || "" !== y.slice(E, G).trim())
                                    return C && 0 === I && 32 !== B.getCodePoint(0) && (z = F.lines.get(r[1] - 1)) && B.isWrapped && 32 !== z.getCodePoint(this._bufferService.cols - 1) && (z = this._getWordAt([this._bufferService.cols - 1, r[1] - 1], !1, !0, !1)) && (z = this._bufferService.cols - z.start,
                                    I -= z,
                                    Q += z),
                                    J && I + Q === this._bufferService.cols && 32 !== B.getCodePoint(this._bufferService.cols - 1) && (J = F.lines.get(r[1] + 1),
                                    (null == J ? 0 : J.isWrapped) && 32 !== J.getCodePoint(0) && (r = this._getWordAt([0, r[1] + 1], !1, !1, !0)) && (Q += r.length)),
                                    {
                                        start: I,
                                        length: Q
                                    }
                            }
                        }
                    }
                    ,
                    w.prototype._selectWordAt = function(r, z) {
                        if (z = this._getWordAt(r, z)) {
                            for (; 0 > z.start; )
                                z.start += this._bufferService.cols,
                                r[1]--;
                            this._model.selectionStart = [z.start, r[1]];
                            this._model.selectionStartLength = z.length
                        }
                    }
                    ,
                    w.prototype._selectToWordAt = function(r) {
                        var z = this._getWordAt(r, !0);
                        if (z) {
                            for (r = r[1]; 0 > z.start; )
                                z.start += this._bufferService.cols,
                                r--;
                            if (!this._model.areSelectionValuesReversed())
                                for (; z.start + z.length > this._bufferService.cols; )
                                    z.length -= this._bufferService.cols,
                                    r++;
                            this._model.selectionEnd = [this._model.areSelectionValuesReversed() ? z.start : z.start + z.length, r]
                        }
                    }
                    ,
                    w.prototype._isCharWordSeparator = function(r) {
                        return 0 !== r.getWidth() && 0 <= this._optionsService.rawOptions.wordSeparator.indexOf(r.getChars())
                    }
                    ,
                    w.prototype._selectLineAt = function(r) {
                        r = this._bufferService.buffer.getWrappedRangeForLine(r);
                        this._model.selectionStart = [0, r.first];
                        this._model.selectionEnd = [this._bufferService.cols, r.last];
                        this._model.selectionStartLength = 0
                    }
                    ,
                    p([t(3, a.IBufferService), t(4, a.ICoreService), t(5, c.IMouseService), t(6, a.IOptionsService), t(7, c.IRenderService)], w)
                }(A.Disposable);
                l.SelectionService = q
            },
            4725: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ICharacterJoinerService = l.ISoundService = l.ISelectionService = l.IRenderService = l.IMouseService = l.ICoreBrowserService = l.ICharSizeService = void 0;
                A = q(8343);
                l.ICharSizeService = (0,
                A.createDecorator)("CharSizeService");
                l.ICoreBrowserService = (0,
                A.createDecorator)("CoreBrowserService");
                l.IMouseService = (0,
                A.createDecorator)("MouseService");
                l.IRenderService = (0,
                A.createDecorator)("RenderService");
                l.ISelectionService = (0,
                A.createDecorator)("SelectionService");
                l.ISoundService = (0,
                A.createDecorator)("SoundService");
                l.ICharacterJoinerService = (0,
                A.createDecorator)("CharacterJoinerService")
            }
            ,
            357: function(A, l, q) {
                var h = this && this.__decorate || function(t, n, g, k) {
                    var d, c = arguments.length, a = 3 > c ? n : null === k ? k = Object.getOwnPropertyDescriptor(n, g) : k;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        a = Reflect.decorate(t, n, g, k);
                    else
                        for (var b = t.length - 1; 0 <= b; b--)
                            (d = t[b]) && (a = (3 > c ? d(a) : 3 < c ? d(n, g, a) : d(n, g)) || a);
                    return 3 < c && a && Object.defineProperty(n, g, a),
                    a
                }
                  , v = this && this.__param || function(t, n) {
                    return function(g, k) {
                        n(g, k, t)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.SoundService = void 0;
                var p = q(2585);
                A = function() {
                    function t(n) {
                        this._optionsService = n
                    }
                    return Object.defineProperty(t, "audioContext", {
                        get: function() {
                            if (!t._audioContext) {
                                var n = window.AudioContext || window.webkitAudioContext;
                                if (!n)
                                    return console.warn("Web Audio API is not supported by this browser. Consider upgrading to the latest version"),
                                    null;
                                t._audioContext = new n
                            }
                            return t._audioContext
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype.playBellSound = function() {
                        var n = t.audioContext;
                        if (n) {
                            var g = n.createBufferSource();
                            n.decodeAudioData(this._base64ToArrayBuffer(this._removeMimeType(this._optionsService.rawOptions.bellSound)), function(k) {
                                g.buffer = k;
                                g.connect(n.destination);
                                g.start(0)
                            })
                        }
                    }
                    ,
                    t.prototype._base64ToArrayBuffer = function(n) {
                        n = window.atob(n);
                        for (var g = n.length, k = new Uint8Array(g), d = 0; d < g; d++)
                            k[d] = n.charCodeAt(d);
                        return k.buffer
                    }
                    ,
                    t.prototype._removeMimeType = function(n) {
                        return n.split(",")[1]
                    }
                    ,
                    t = h([v(0, p.IOptionsService)], t)
                }();
                l.SoundService = A
            },
            6349: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CircularList = void 0;
                var h = q(8460);
                A = function() {
                    function v(p) {
                        this._maxLength = p;
                        this.onDeleteEmitter = new h.EventEmitter;
                        this.onInsertEmitter = new h.EventEmitter;
                        this.onTrimEmitter = new h.EventEmitter;
                        this._array = Array(this._maxLength);
                        this._length = this._startIndex = 0
                    }
                    return Object.defineProperty(v.prototype, "onDelete", {
                        get: function() {
                            return this.onDeleteEmitter.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(v.prototype, "onInsert", {
                        get: function() {
                            return this.onInsertEmitter.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(v.prototype, "onTrim", {
                        get: function() {
                            return this.onTrimEmitter.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(v.prototype, "maxLength", {
                        get: function() {
                            return this._maxLength
                        },
                        set: function(p) {
                            if (this._maxLength !== p) {
                                for (var t = Array(p), n = 0; n < Math.min(p, this.length); n++)
                                    t[n] = this._array[this._getCyclicIndex(n)];
                                this._array = t;
                                this._maxLength = p;
                                this._startIndex = 0
                            }
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(v.prototype, "length", {
                        get: function() {
                            return this._length
                        },
                        set: function(p) {
                            if (p > this._length)
                                for (var t = this._length; t < p; t++)
                                    this._array[t] = void 0;
                            this._length = p
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    v.prototype.get = function(p) {
                        return this._array[this._getCyclicIndex(p)]
                    }
                    ,
                    v.prototype.set = function(p, t) {
                        this._array[this._getCyclicIndex(p)] = t
                    }
                    ,
                    v.prototype.push = function(p) {
                        this._array[this._getCyclicIndex(this._length)] = p;
                        this._length === this._maxLength ? (this._startIndex = ++this._startIndex % this._maxLength,
                        this.onTrimEmitter.fire(1)) : this._length++
                    }
                    ,
                    v.prototype.recycle = function() {
                        if (this._length !== this._maxLength)
                            throw Error("Can only recycle when the buffer is full");
                        return this._startIndex = ++this._startIndex % this._maxLength,
                        this.onTrimEmitter.fire(1),
                        this._array[this._getCyclicIndex(this._length - 1)]
                    }
                    ,
                    Object.defineProperty(v.prototype, "isFull", {
                        get: function() {
                            return this._length === this._maxLength
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    v.prototype.pop = function() {
                        return this._array[this._getCyclicIndex(this._length-- - 1)]
                    }
                    ,
                    v.prototype.splice = function(p, t) {
                        for (var n = [], g = 2; g < arguments.length; g++)
                            n[g - 2] = arguments[g];
                        if (t) {
                            for (g = p; g < this._length - t; g++)
                                this._array[this._getCyclicIndex(g)] = this._array[this._getCyclicIndex(g + t)];
                            this._length -= t;
                            this.onDeleteEmitter.fire({
                                index: p,
                                amount: t
                            })
                        }
                        for (g = this._length - 1; g >= p; g--)
                            this._array[this._getCyclicIndex(g + n.length)] = this._array[this._getCyclicIndex(g)];
                        for (g = 0; g < n.length; g++)
                            this._array[this._getCyclicIndex(p + g)] = n[g];
                        (n.length && this.onInsertEmitter.fire({
                            index: p,
                            amount: n.length
                        }),
                        this._length + n.length > this._maxLength) ? (n = this._length + n.length - this._maxLength,
                        this._startIndex += n,
                        this._length = this._maxLength,
                        this.onTrimEmitter.fire(n)) : this._length += n.length
                    }
                    ,
                    v.prototype.trimStart = function(p) {
                        p > this._length && (p = this._length);
                        this._startIndex += p;
                        this._length -= p;
                        this.onTrimEmitter.fire(p)
                    }
                    ,
                    v.prototype.shiftElements = function(p, t, n) {
                        if (!(0 >= t)) {
                            if (0 > p || p >= this._length)
                                throw Error("start argument out of range");
                            if (0 > p + n)
                                throw Error("Cannot shift elements in list beyond index 0");
                            if (0 < n) {
                                for (var g = t - 1; 0 <= g; g--)
                                    this.set(p + g + n, this.get(p + g));
                                p = p + t + n - this._length;
                                if (0 < p)
                                    for (this._length += p; this._length > this._maxLength; )
                                        this._length--,
                                        this._startIndex++,
                                        this.onTrimEmitter.fire(1)
                            } else
                                for (g = 0; g < t; g++)
                                    this.set(p + g + n, this.get(p + g))
                        }
                    }
                    ,
                    v.prototype._getCyclicIndex = function(p) {
                        return (this._startIndex + p) % this._maxLength
                    }
                    ,
                    v
                }();
                l.CircularList = A
            }
            ,
            1439: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.clone = void 0;
                l.clone = function p(h, v) {
                    if (void 0 === v && (v = 5),
                    "object" != typeof h)
                        return h;
                    var t = Array.isArray(h) ? [] : {}, n;
                    for (n in h)
                        t[n] = 1 >= v ? h[n] : h[n] && p(h[n], v - 1);
                    return t
                }
            }
            ,
            8969: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(z, C) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(J, F) {
                        J.__proto__ = F
                    }
                    || function(J, F) {
                        for (var B in F)
                            Object.prototype.hasOwnProperty.call(F, B) && (J[B] = F[B])
                    }
                    ,
                    h(z, C)
                }
                ,
                function(z, C) {
                    function J() {
                        this.constructor = z
                    }
                    if ("function" != typeof C && null !== C)
                        throw new TypeError("Class extends value " + String(C) + " is not a constructor or null");
                    h(z, C);
                    z.prototype = null === C ? Object.create(C) : (J.prototype = C.prototype,
                    new J)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CoreTerminal = void 0;
                A = q(844);
                var p = q(2585)
                  , t = q(4348)
                  , n = q(7866)
                  , g = q(744)
                  , k = q(7302)
                  , d = q(6975)
                  , c = q(8460)
                  , a = q(1753)
                  , b = q(3730)
                  , e = q(1480)
                  , f = q(7994)
                  , m = q(9282)
                  , u = q(5435)
                  , w = q(5981)
                  , r = !1;
                q = function(z) {
                    function C(J) {
                        var F = z.call(this) || this;
                        return F._onBinary = new c.EventEmitter,
                        F._onData = new c.EventEmitter,
                        F._onLineFeed = new c.EventEmitter,
                        F._onResize = new c.EventEmitter,
                        F._onScroll = new c.EventEmitter,
                        F._instantiationService = new t.InstantiationService,
                        F.optionsService = new k.OptionsService(J),
                        F._instantiationService.setService(p.IOptionsService, F.optionsService),
                        F._bufferService = F.register(F._instantiationService.createInstance(g.BufferService)),
                        F._instantiationService.setService(p.IBufferService, F._bufferService),
                        F._logService = F._instantiationService.createInstance(n.LogService),
                        F._instantiationService.setService(p.ILogService, F._logService),
                        F.coreService = F.register(F._instantiationService.createInstance(d.CoreService, function() {
                            return F.scrollToBottom()
                        })),
                        F._instantiationService.setService(p.ICoreService, F.coreService),
                        F.coreMouseService = F._instantiationService.createInstance(a.CoreMouseService),
                        F._instantiationService.setService(p.ICoreMouseService, F.coreMouseService),
                        F._dirtyRowService = F._instantiationService.createInstance(b.DirtyRowService),
                        F._instantiationService.setService(p.IDirtyRowService, F._dirtyRowService),
                        F.unicodeService = F._instantiationService.createInstance(e.UnicodeService),
                        F._instantiationService.setService(p.IUnicodeService, F.unicodeService),
                        F._charsetService = F._instantiationService.createInstance(f.CharsetService),
                        F._instantiationService.setService(p.ICharsetService, F._charsetService),
                        F._inputHandler = new u.InputHandler(F._bufferService,F._charsetService,F.coreService,F._dirtyRowService,F._logService,F.optionsService,F.coreMouseService,F.unicodeService),
                        F.register((0,
                        c.forwardEvent)(F._inputHandler.onLineFeed, F._onLineFeed)),
                        F.register(F._inputHandler),
                        F.register((0,
                        c.forwardEvent)(F._bufferService.onResize, F._onResize)),
                        F.register((0,
                        c.forwardEvent)(F.coreService.onData, F._onData)),
                        F.register((0,
                        c.forwardEvent)(F.coreService.onBinary, F._onBinary)),
                        F.register(F.optionsService.onOptionChange(function(B) {
                            return F._updateOptions(B)
                        })),
                        F.register(F._bufferService.onScroll(function(B) {
                            F._onScroll.fire({
                                position: F._bufferService.buffer.ydisp,
                                source: 0
                            });
                            F._dirtyRowService.markRangeDirty(F._bufferService.buffer.scrollTop, F._bufferService.buffer.scrollBottom)
                        })),
                        F.register(F._inputHandler.onScroll(function(B) {
                            F._onScroll.fire({
                                position: F._bufferService.buffer.ydisp,
                                source: 0
                            });
                            F._dirtyRowService.markRangeDirty(F._bufferService.buffer.scrollTop, F._bufferService.buffer.scrollBottom)
                        })),
                        F._writeBuffer = new w.WriteBuffer(function(B, y) {
                            return F._inputHandler.parse(B, y)
                        }
                        ),
                        F
                    }
                    return v(C, z),
                    Object.defineProperty(C.prototype, "onBinary", {
                        get: function() {
                            return this._onBinary.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "onData", {
                        get: function() {
                            return this._onData.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "onLineFeed", {
                        get: function() {
                            return this._onLineFeed.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "onResize", {
                        get: function() {
                            return this._onResize.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "onScroll", {
                        get: function() {
                            var J = this;
                            return this._onScrollApi || (this._onScrollApi = new c.EventEmitter,
                            this.register(this._onScroll.event(function(F) {
                                var B;
                                null === (B = J._onScrollApi) || void 0 === B || B.fire(F.position)
                            }))),
                            this._onScrollApi.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "cols", {
                        get: function() {
                            return this._bufferService.cols
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "rows", {
                        get: function() {
                            return this._bufferService.rows
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "buffers", {
                        get: function() {
                            return this._bufferService.buffers
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(C.prototype, "options", {
                        get: function() {
                            return this.optionsService.options
                        },
                        set: function(J) {
                            for (var F in J)
                                this.optionsService.options[F] = J[F]
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    C.prototype.dispose = function() {
                        var J;
                        this._isDisposed || (z.prototype.dispose.call(this),
                        null === (J = this._windowsMode) || void 0 === J || J.dispose(),
                        this._windowsMode = void 0)
                    }
                    ,
                    C.prototype.write = function(J, F) {
                        this._writeBuffer.write(J, F)
                    }
                    ,
                    C.prototype.writeSync = function(J, F) {
                        this._logService.logLevel <= p.LogLevelEnum.WARN && !r && (this._logService.warn("writeSync is unreliable and will be removed soon."),
                        r = !0);
                        this._writeBuffer.writeSync(J, F)
                    }
                    ,
                    C.prototype.resize = function(J, F) {
                        isNaN(J) || isNaN(F) || (J = Math.max(J, g.MINIMUM_COLS),
                        F = Math.max(F, g.MINIMUM_ROWS),
                        this._bufferService.resize(J, F))
                    }
                    ,
                    C.prototype.scroll = function(J, F) {
                        void 0 === F && (F = !1);
                        this._bufferService.scroll(J, F)
                    }
                    ,
                    C.prototype.scrollLines = function(J, F, B) {
                        this._bufferService.scrollLines(J, F, B)
                    }
                    ,
                    C.prototype.scrollPages = function(J) {
                        this._bufferService.scrollPages(J)
                    }
                    ,
                    C.prototype.scrollToTop = function() {
                        this._bufferService.scrollToTop()
                    }
                    ,
                    C.prototype.scrollToBottom = function() {
                        this._bufferService.scrollToBottom()
                    }
                    ,
                    C.prototype.scrollToLine = function(J) {
                        this._bufferService.scrollToLine(J)
                    }
                    ,
                    C.prototype.registerEscHandler = function(J, F) {
                        return this._inputHandler.registerEscHandler(J, F)
                    }
                    ,
                    C.prototype.registerDcsHandler = function(J, F) {
                        return this._inputHandler.registerDcsHandler(J, F)
                    }
                    ,
                    C.prototype.registerCsiHandler = function(J, F) {
                        return this._inputHandler.registerCsiHandler(J, F)
                    }
                    ,
                    C.prototype.registerOscHandler = function(J, F) {
                        return this._inputHandler.registerOscHandler(J, F)
                    }
                    ,
                    C.prototype._setup = function() {
                        this.optionsService.rawOptions.windowsMode && this._enableWindowsMode()
                    }
                    ,
                    C.prototype.reset = function() {
                        this._inputHandler.reset();
                        this._bufferService.reset();
                        this._charsetService.reset();
                        this.coreService.reset();
                        this.coreMouseService.reset()
                    }
                    ,
                    C.prototype._updateOptions = function(J) {
                        var F;
                        switch (J) {
                        case "scrollback":
                            this.buffers.resize(this.cols, this.rows);
                            break;
                        case "windowsMode":
                            this.optionsService.rawOptions.windowsMode ? this._enableWindowsMode() : (null === (F = this._windowsMode) || void 0 === F || F.dispose(),
                            this._windowsMode = void 0)
                        }
                    }
                    ,
                    C.prototype._enableWindowsMode = function() {
                        var J = this;
                        if (!this._windowsMode) {
                            var F = [];
                            F.push(this.onLineFeed(m.updateWindowsModeWrappedState.bind(null, this._bufferService)));
                            F.push(this.registerCsiHandler({
                                final: "H"
                            }, function() {
                                return (0,
                                m.updateWindowsModeWrappedState)(J._bufferService),
                                !1
                            }));
                            this._windowsMode = {
                                dispose: function() {
                                    for (var B = 0; B < F.length; B++)
                                        F[B].dispose()
                                }
                            }
                        }
                    }
                    ,
                    C
                }(A.Disposable);
                l.CoreTerminal = q
            },
            8460: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.forwardEvent = l.EventEmitter = void 0;
                A = function() {
                    function q() {
                        this._listeners = [];
                        this._disposed = !1
                    }
                    return Object.defineProperty(q.prototype, "event", {
                        get: function() {
                            var h = this;
                            return this._event || (this._event = function(v) {
                                return h._listeners.push(v),
                                {
                                    dispose: function() {
                                        if (!h._disposed)
                                            for (var p = 0; p < h._listeners.length; p++)
                                                if (h._listeners[p] === v)
                                                    return void h._listeners.splice(p, 1)
                                    }
                                }
                            }
                            ),
                            this._event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    q.prototype.fire = function(h, v) {
                        for (var p = [], t = 0; t < this._listeners.length; t++)
                            p.push(this._listeners[t]);
                        for (t = 0; t < p.length; t++)
                            p[t].call(void 0, h, v)
                    }
                    ,
                    q.prototype.dispose = function() {
                        this._listeners && (this._listeners.length = 0);
                        this._disposed = !0
                    }
                    ,
                    q
                }();
                l.EventEmitter = A;
                l.forwardEvent = function(q, h) {
                    return q(function(v) {
                        return h.fire(v)
                    })
                }
            }
            ,
            5435: function(A, l, q) {
                function h(F, B) {
                    if (24 < F)
                        return B.setWinLines || !1;
                    switch (F) {
                    case 1:
                        return !!B.restoreWin;
                    case 2:
                        return !!B.minimizeWin;
                    case 3:
                        return !!B.setWinPosition;
                    case 4:
                        return !!B.setWinSizePixels;
                    case 5:
                        return !!B.raiseWin;
                    case 6:
                        return !!B.lowerWin;
                    case 7:
                        return !!B.refreshWin;
                    case 8:
                        return !!B.setWinSizeChars;
                    case 9:
                        return !!B.maximizeWin;
                    case 10:
                        return !!B.fullscreenWin;
                    case 11:
                        return !!B.getWinState;
                    case 13:
                        return !!B.getWinPosition;
                    case 14:
                        return !!B.getWinSizePixels;
                    case 15:
                        return !!B.getScreenSizePixels;
                    case 16:
                        return !!B.getCellSizePixels;
                    case 18:
                        return !!B.getWinSizeChars;
                    case 19:
                        return !!B.getScreenSizeChars;
                    case 20:
                        return !!B.getIconTitle;
                    case 21:
                        return !!B.getWinTitle;
                    case 22:
                        return !!B.pushTitle;
                    case 23:
                        return !!B.popTitle;
                    case 24:
                        return !!B.setWinLines
                    }
                    return !1
                }
                var v, p = this && this.__extends || (v = function(F, B) {
                    return v = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(y, E) {
                        y.__proto__ = E
                    }
                    || function(y, E) {
                        for (var G in E)
                            Object.prototype.hasOwnProperty.call(E, G) && (y[G] = E[G])
                    }
                    ,
                    v(F, B)
                }
                ,
                function(F, B) {
                    function y() {
                        this.constructor = F
                    }
                    if ("function" != typeof B && null !== B)
                        throw new TypeError("Class extends value " + String(B) + " is not a constructor or null");
                    v(F, B);
                    F.prototype = null === B ? Object.create(B) : (y.prototype = B.prototype,
                    new y)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.InputHandler = l.WindowsOptionsReportType = void 0;
                var t, n = q(2584), g = q(7116), k = q(2015);
                A = q(844);
                var d = q(8273)
                  , c = q(482)
                  , a = q(8437)
                  , b = q(8460)
                  , e = q(643)
                  , f = q(511)
                  , m = q(3734)
                  , u = q(2585)
                  , w = q(6242)
                  , r = q(6351)
                  , z = q(5941)
                  , C = {
                    "(": 0,
                    ")": 1,
                    "*": 2,
                    "+": 3,
                    "-": 1,
                    ".": 2
                };
                !function(F) {
                    F[F.GET_WIN_SIZE_PIXELS = 0] = "GET_WIN_SIZE_PIXELS";
                    F[F.GET_CELL_SIZE_PIXELS = 1] = "GET_CELL_SIZE_PIXELS"
                }(t = l.WindowsOptionsReportType || (l.WindowsOptionsReportType = {}));
                var J = function() {
                    function F(B, y, E, G) {
                        this._bufferService = B;
                        this._coreService = y;
                        this._logService = E;
                        this._optionsService = G;
                        this._data = new Uint32Array(0)
                    }
                    return F.prototype.hook = function(B) {
                        this._data = new Uint32Array(0)
                    }
                    ,
                    F.prototype.put = function(B, y, E) {
                        this._data = (0,
                        d.concat)(this._data, B.subarray(y, E))
                    }
                    ,
                    F.prototype.unhook = function(B) {
                        if (!B)
                            return this._data = new Uint32Array(0),
                            !0;
                        B = (0,
                        c.utf32ToString)(this._data);
                        switch (this._data = new Uint32Array(0),
                        B) {
                        case '"q':
                            this._coreService.triggerDataEvent(n.C0.ESC + 'P1$r0"q' + n.C0.ESC + "\\");
                            break;
                        case '"p':
                            this._coreService.triggerDataEvent(n.C0.ESC + 'P1$r61;1"p' + n.C0.ESC + "\\");
                            break;
                        case "r":
                            this._coreService.triggerDataEvent(n.C0.ESC + "P1$r" + (this._bufferService.buffer.scrollTop + 1 + ";" + (this._bufferService.buffer.scrollBottom + 1) + "r") + n.C0.ESC + "\\");
                            break;
                        case "m":
                            this._coreService.triggerDataEvent(n.C0.ESC + "P1$r0m" + n.C0.ESC + "\\");
                            break;
                        case " q":
                            B = {
                                block: 2,
                                underline: 4,
                                bar: 6
                            }[this._optionsService.rawOptions.cursorStyle];
                            B -= this._optionsService.rawOptions.cursorBlink ? 1 : 0;
                            this._coreService.triggerDataEvent(n.C0.ESC + "P1$r" + B + " q" + n.C0.ESC + "\\");
                            break;
                        default:
                            this._logService.debug("Unknown DCS $q %s", B),
                            this._coreService.triggerDataEvent(n.C0.ESC + "P0$r" + n.C0.ESC + "\\")
                        }
                        return !0
                    }
                    ,
                    F
                }();
                q = function(F) {
                    function B(y, E, G, I, Q, R, W, V, S) {
                        void 0 === S && (S = new k.EscapeSequenceParser);
                        var D = F.call(this) || this;
                        D._bufferService = y;
                        D._charsetService = E;
                        D._coreService = G;
                        D._dirtyRowService = I;
                        D._logService = Q;
                        D._optionsService = R;
                        D._coreMouseService = W;
                        D._unicodeService = V;
                        D._parser = S;
                        D._parseBuffer = new Uint32Array(4096);
                        D._stringDecoder = new c.StringToUtf32;
                        D._utf8Decoder = new c.Utf8ToUtf32;
                        D._workCell = new f.CellData;
                        D._windowTitle = "";
                        D._iconName = "";
                        D._windowTitleStack = [];
                        D._iconNameStack = [];
                        D._curAttrData = a.DEFAULT_ATTR_DATA.clone();
                        D._eraseAttrDataInternal = a.DEFAULT_ATTR_DATA.clone();
                        D._onRequestBell = new b.EventEmitter;
                        D._onRequestRefreshRows = new b.EventEmitter;
                        D._onRequestReset = new b.EventEmitter;
                        D._onRequestSendFocus = new b.EventEmitter;
                        D._onRequestSyncScrollBar = new b.EventEmitter;
                        D._onRequestWindowsOptionsReport = new b.EventEmitter;
                        D._onA11yChar = new b.EventEmitter;
                        D._onA11yTab = new b.EventEmitter;
                        D._onCursorMove = new b.EventEmitter;
                        D._onLineFeed = new b.EventEmitter;
                        D._onScroll = new b.EventEmitter;
                        D._onTitleChange = new b.EventEmitter;
                        D._onColor = new b.EventEmitter;
                        D._parseStack = {
                            paused: !1,
                            cursorStartX: 0,
                            cursorStartY: 0,
                            decodedLength: 0,
                            position: 0
                        };
                        D._specialColors = [256, 257, 258];
                        D.register(D._parser);
                        D._activeBuffer = D._bufferService.buffer;
                        D.register(D._bufferService.buffers.onBufferActivate(function(x) {
                            return D._activeBuffer = x.activeBuffer
                        }));
                        D._parser.setCsiHandlerFallback(function(x, N) {
                            D._logService.debug("Unknown CSI code: ", {
                                identifier: D._parser.identToString(x),
                                params: N.toArray()
                            })
                        });
                        D._parser.setEscHandlerFallback(function(x) {
                            D._logService.debug("Unknown ESC code: ", {
                                identifier: D._parser.identToString(x)
                            })
                        });
                        D._parser.setExecuteHandlerFallback(function(x) {
                            D._logService.debug("Unknown EXECUTE code: ", {
                                code: x
                            })
                        });
                        D._parser.setOscHandlerFallback(function(x, N, O) {
                            D._logService.debug("Unknown OSC code: ", {
                                identifier: x,
                                action: N,
                                data: O
                            })
                        });
                        D._parser.setDcsHandlerFallback(function(x, N, O) {
                            "HOOK" === N && (O = O.toArray());
                            D._logService.debug("Unknown DCS code: ", {
                                identifier: D._parser.identToString(x),
                                action: N,
                                payload: O
                            })
                        });
                        D._parser.setPrintHandler(function(x, N, O) {
                            return D.print(x, N, O)
                        });
                        D._parser.registerCsiHandler({
                            final: "@"
                        }, function(x) {
                            return D.insertChars(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: " ",
                            final: "@"
                        }, function(x) {
                            return D.scrollLeft(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "A"
                        }, function(x) {
                            return D.cursorUp(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: " ",
                            final: "A"
                        }, function(x) {
                            return D.scrollRight(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "B"
                        }, function(x) {
                            return D.cursorDown(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "C"
                        }, function(x) {
                            return D.cursorForward(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "D"
                        }, function(x) {
                            return D.cursorBackward(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "E"
                        }, function(x) {
                            return D.cursorNextLine(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "F"
                        }, function(x) {
                            return D.cursorPrecedingLine(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "G"
                        }, function(x) {
                            return D.cursorCharAbsolute(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "H"
                        }, function(x) {
                            return D.cursorPosition(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "I"
                        }, function(x) {
                            return D.cursorForwardTab(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "J"
                        }, function(x) {
                            return D.eraseInDisplay(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: "?",
                            final: "J"
                        }, function(x) {
                            return D.eraseInDisplay(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "K"
                        }, function(x) {
                            return D.eraseInLine(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: "?",
                            final: "K"
                        }, function(x) {
                            return D.eraseInLine(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "L"
                        }, function(x) {
                            return D.insertLines(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "M"
                        }, function(x) {
                            return D.deleteLines(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "P"
                        }, function(x) {
                            return D.deleteChars(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "S"
                        }, function(x) {
                            return D.scrollUp(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "T"
                        }, function(x) {
                            return D.scrollDown(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "X"
                        }, function(x) {
                            return D.eraseChars(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "Z"
                        }, function(x) {
                            return D.cursorBackwardTab(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "`"
                        }, function(x) {
                            return D.charPosAbsolute(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "a"
                        }, function(x) {
                            return D.hPositionRelative(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "b"
                        }, function(x) {
                            return D.repeatPrecedingCharacter(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "c"
                        }, function(x) {
                            return D.sendDeviceAttributesPrimary(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: ">",
                            final: "c"
                        }, function(x) {
                            return D.sendDeviceAttributesSecondary(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "d"
                        }, function(x) {
                            return D.linePosAbsolute(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "e"
                        }, function(x) {
                            return D.vPositionRelative(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "f"
                        }, function(x) {
                            return D.hVPosition(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "g"
                        }, function(x) {
                            return D.tabClear(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "h"
                        }, function(x) {
                            return D.setMode(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: "?",
                            final: "h"
                        }, function(x) {
                            return D.setModePrivate(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "l"
                        }, function(x) {
                            return D.resetMode(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: "?",
                            final: "l"
                        }, function(x) {
                            return D.resetModePrivate(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "m"
                        }, function(x) {
                            return D.charAttributes(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "n"
                        }, function(x) {
                            return D.deviceStatus(x)
                        });
                        D._parser.registerCsiHandler({
                            prefix: "?",
                            final: "n"
                        }, function(x) {
                            return D.deviceStatusPrivate(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: "!",
                            final: "p"
                        }, function(x) {
                            return D.softReset(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: " ",
                            final: "q"
                        }, function(x) {
                            return D.setCursorStyle(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "r"
                        }, function(x) {
                            return D.setScrollRegion(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "s"
                        }, function(x) {
                            return D.saveCursor(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "t"
                        }, function(x) {
                            return D.windowOptions(x)
                        });
                        D._parser.registerCsiHandler({
                            final: "u"
                        }, function(x) {
                            return D.restoreCursor(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: "'",
                            final: "}"
                        }, function(x) {
                            return D.insertColumns(x)
                        });
                        D._parser.registerCsiHandler({
                            intermediates: "'",
                            final: "~"
                        }, function(x) {
                            return D.deleteColumns(x)
                        });
                        D._parser.setExecuteHandler(n.C0.BEL, function() {
                            return D.bell()
                        });
                        D._parser.setExecuteHandler(n.C0.LF, function() {
                            return D.lineFeed()
                        });
                        D._parser.setExecuteHandler(n.C0.VT, function() {
                            return D.lineFeed()
                        });
                        D._parser.setExecuteHandler(n.C0.FF, function() {
                            return D.lineFeed()
                        });
                        D._parser.setExecuteHandler(n.C0.CR, function() {
                            return D.carriageReturn()
                        });
                        D._parser.setExecuteHandler(n.C0.BS, function() {
                            return D.backspace()
                        });
                        D._parser.setExecuteHandler(n.C0.HT, function() {
                            return D.tab()
                        });
                        D._parser.setExecuteHandler(n.C0.SO, function() {
                            return D.shiftOut()
                        });
                        D._parser.setExecuteHandler(n.C0.SI, function() {
                            return D.shiftIn()
                        });
                        D._parser.setExecuteHandler(n.C1.IND, function() {
                            return D.index()
                        });
                        D._parser.setExecuteHandler(n.C1.NEL, function() {
                            return D.nextLine()
                        });
                        D._parser.setExecuteHandler(n.C1.HTS, function() {
                            return D.tabSet()
                        });
                        D._parser.registerOscHandler(0, new w.OscHandler(function(x) {
                            return D.setTitle(x),
                            D.setIconName(x),
                            !0
                        }
                        ));
                        D._parser.registerOscHandler(1, new w.OscHandler(function(x) {
                            return D.setIconName(x)
                        }
                        ));
                        D._parser.registerOscHandler(2, new w.OscHandler(function(x) {
                            return D.setTitle(x)
                        }
                        ));
                        D._parser.registerOscHandler(4, new w.OscHandler(function(x) {
                            return D.setOrReportIndexedColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(10, new w.OscHandler(function(x) {
                            return D.setOrReportFgColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(11, new w.OscHandler(function(x) {
                            return D.setOrReportBgColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(12, new w.OscHandler(function(x) {
                            return D.setOrReportCursorColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(104, new w.OscHandler(function(x) {
                            return D.restoreIndexedColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(110, new w.OscHandler(function(x) {
                            return D.restoreFgColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(111, new w.OscHandler(function(x) {
                            return D.restoreBgColor(x)
                        }
                        ));
                        D._parser.registerOscHandler(112, new w.OscHandler(function(x) {
                            return D.restoreCursorColor(x)
                        }
                        ));
                        D._parser.registerEscHandler({
                            final: "7"
                        }, function() {
                            return D.saveCursor()
                        });
                        D._parser.registerEscHandler({
                            final: "8"
                        }, function() {
                            return D.restoreCursor()
                        });
                        D._parser.registerEscHandler({
                            final: "D"
                        }, function() {
                            return D.index()
                        });
                        D._parser.registerEscHandler({
                            final: "E"
                        }, function() {
                            return D.nextLine()
                        });
                        D._parser.registerEscHandler({
                            final: "H"
                        }, function() {
                            return D.tabSet()
                        });
                        D._parser.registerEscHandler({
                            final: "M"
                        }, function() {
                            return D.reverseIndex()
                        });
                        D._parser.registerEscHandler({
                            final: "="
                        }, function() {
                            return D.keypadApplicationMode()
                        });
                        D._parser.registerEscHandler({
                            final: ">"
                        }, function() {
                            return D.keypadNumericMode()
                        });
                        D._parser.registerEscHandler({
                            final: "c"
                        }, function() {
                            return D.fullReset()
                        });
                        D._parser.registerEscHandler({
                            final: "n"
                        }, function() {
                            return D.setgLevel(2)
                        });
                        D._parser.registerEscHandler({
                            final: "o"
                        }, function() {
                            return D.setgLevel(3)
                        });
                        D._parser.registerEscHandler({
                            final: "|"
                        }, function() {
                            return D.setgLevel(3)
                        });
                        D._parser.registerEscHandler({
                            final: "}"
                        }, function() {
                            return D.setgLevel(2)
                        });
                        D._parser.registerEscHandler({
                            final: "~"
                        }, function() {
                            return D.setgLevel(1)
                        });
                        D._parser.registerEscHandler({
                            intermediates: "%",
                            final: "@"
                        }, function() {
                            return D.selectDefaultCharset()
                        });
                        D._parser.registerEscHandler({
                            intermediates: "%",
                            final: "G"
                        }, function() {
                            return D.selectDefaultCharset()
                        });
                        y = function(x) {
                            M._parser.registerEscHandler({
                                intermediates: "(",
                                final: x
                            }, function() {
                                return D.selectCharset("(" + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: ")",
                                final: x
                            }, function() {
                                return D.selectCharset(")" + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: "*",
                                final: x
                            }, function() {
                                return D.selectCharset("*" + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: "+",
                                final: x
                            }, function() {
                                return D.selectCharset("+" + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: "-",
                                final: x
                            }, function() {
                                return D.selectCharset("-" + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: ".",
                                final: x
                            }, function() {
                                return D.selectCharset("." + x)
                            });
                            M._parser.registerEscHandler({
                                intermediates: "/",
                                final: x
                            }, function() {
                                return D.selectCharset("/" + x)
                            })
                        }
                        ;
                        var M = this, H;
                        for (H in g.CHARSETS)
                            y(H);
                        return D._parser.registerEscHandler({
                            intermediates: "#",
                            final: "8"
                        }, function() {
                            return D.screenAlignmentPattern()
                        }),
                        D._parser.setErrorHandler(function(x) {
                            return D._logService.error("Parsing error: ", x),
                            x
                        }),
                        D._parser.registerDcsHandler({
                            intermediates: "$",
                            final: "q"
                        }, new J(D._bufferService,D._coreService,D._logService,D._optionsService)),
                        D
                    }
                    return p(B, F),
                    Object.defineProperty(B.prototype, "onRequestBell", {
                        get: function() {
                            return this._onRequestBell.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onRequestRefreshRows", {
                        get: function() {
                            return this._onRequestRefreshRows.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onRequestReset", {
                        get: function() {
                            return this._onRequestReset.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onRequestSendFocus", {
                        get: function() {
                            return this._onRequestSendFocus.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onRequestSyncScrollBar", {
                        get: function() {
                            return this._onRequestSyncScrollBar.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onRequestWindowsOptionsReport", {
                        get: function() {
                            return this._onRequestWindowsOptionsReport.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onA11yChar", {
                        get: function() {
                            return this._onA11yChar.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onA11yTab", {
                        get: function() {
                            return this._onA11yTab.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onCursorMove", {
                        get: function() {
                            return this._onCursorMove.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onLineFeed", {
                        get: function() {
                            return this._onLineFeed.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onScroll", {
                        get: function() {
                            return this._onScroll.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onTitleChange", {
                        get: function() {
                            return this._onTitleChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(B.prototype, "onColor", {
                        get: function() {
                            return this._onColor.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    B.prototype.dispose = function() {
                        F.prototype.dispose.call(this)
                    }
                    ,
                    B.prototype._preserveStack = function(y, E, G, I) {
                        this._parseStack.paused = !0;
                        this._parseStack.cursorStartX = y;
                        this._parseStack.cursorStartY = E;
                        this._parseStack.decodedLength = G;
                        this._parseStack.position = I
                    }
                    ,
                    B.prototype._logSlowResolvingAsync = function(y) {
                        this._logService.logLevel <= u.LogLevelEnum.WARN && Promise.race([y, new Promise(function(E, G) {
                            return setTimeout(function() {
                                return G("#SLOW_TIMEOUT")
                            }, 5E3)
                        }
                        )]).catch(function(E) {
                            if ("#SLOW_TIMEOUT" !== E)
                                throw E;
                            console.warn("async parser handler taking longer than 5000 ms")
                        })
                    }
                    ,
                    B.prototype.parse = function(y, E) {
                        var G, I = this._activeBuffer.x, Q = this._activeBuffer.y, R = 0, W = this._parseStack.paused;
                        if (W) {
                            if (G = this._parser.parse(this._parseBuffer, this._parseStack.decodedLength, E))
                                return this._logSlowResolvingAsync(G),
                                G;
                            I = this._parseStack.cursorStartX;
                            Q = this._parseStack.cursorStartY;
                            this._parseStack.paused = !1;
                            131072 < y.length && (R = this._parseStack.position + 131072)
                        }
                        if (this._logService.logLevel <= u.LogLevelEnum.DEBUG && this._logService.debug("parsing data" + ("string" == typeof y ? ' "' + y + '"' : ""), "string" == typeof y ? y.split("").map(function(S) {
                            return S.charCodeAt(0)
                        }) : y),
                        this._parseBuffer.length < y.length && 131072 > this._parseBuffer.length && (this._parseBuffer = new Uint32Array(Math.min(y.length, 131072))),
                        W || this._dirtyRowService.clearRange(),
                        131072 < y.length)
                            for (E = R; E < y.length; E += 131072) {
                                G = E + 131072 < y.length ? E + 131072 : y.length;
                                var V = "string" == typeof y ? this._stringDecoder.decode(y.substring(E, G), this._parseBuffer) : this._utf8Decoder.decode(y.subarray(E, G), this._parseBuffer);
                                if (G = this._parser.parse(this._parseBuffer, V))
                                    return this._preserveStack(I, Q, V, E),
                                    this._logSlowResolvingAsync(G),
                                    G
                            }
                        else if (!W && (V = "string" == typeof y ? this._stringDecoder.decode(y, this._parseBuffer) : this._utf8Decoder.decode(y, this._parseBuffer),
                        G = this._parser.parse(this._parseBuffer, V)))
                            return this._preserveStack(I, Q, V, 0),
                            this._logSlowResolvingAsync(G),
                            G;
                        this._activeBuffer.x === I && this._activeBuffer.y === Q || this._onCursorMove.fire();
                        this._onRequestRefreshRows.fire(this._dirtyRowService.start, this._dirtyRowService.end)
                    }
                    ,
                    B.prototype.print = function(y, E, G) {
                        var I, Q, R = this._charsetService.charset, W = this._optionsService.rawOptions.screenReaderMode, V = this._bufferService.cols, S = this._coreService.decPrivateModes.wraparound, D = this._coreService.modes.insertMode, M = this._curAttrData, H = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                        this._dirtyRowService.markDirty(this._activeBuffer.y);
                        this._activeBuffer.x && 0 < G - E && 2 === H.getWidth(this._activeBuffer.x - 1) && H.setCellFromCodePoint(this._activeBuffer.x - 1, 0, 1, M.fg, M.bg, M.extended);
                        for (var x = E; x < G; ++x) {
                            if (I = y[x],
                            Q = this._unicodeService.wcwidth(I),
                            127 > I && R) {
                                var N = R[String.fromCharCode(I)];
                                N && (I = N.charCodeAt(0))
                            }
                            if (W && this._onA11yChar.fire((0,
                            c.stringFromCodePoint)(I)),
                            Q || !this._activeBuffer.x) {
                                if (this._activeBuffer.x + Q - 1 >= V)
                                    if (S) {
                                        for (; this._activeBuffer.x < V; )
                                            H.setCellFromCodePoint(this._activeBuffer.x++, 0, 1, M.fg, M.bg, M.extended);
                                        this._activeBuffer.x = 0;
                                        this._activeBuffer.y++;
                                        this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--,
                                        this._bufferService.scroll(this._eraseAttrData(), !0)) : (this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1),
                                        this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !0);
                                        H = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y)
                                    } else if (this._activeBuffer.x = V - 1,
                                    2 === Q)
                                        continue;
                                if (D && (H.insertCells(this._activeBuffer.x, Q, this._activeBuffer.getNullCell(M), M),
                                2 === H.getWidth(V - 1) && H.setCellFromCodePoint(V - 1, e.NULL_CELL_CODE, e.NULL_CELL_WIDTH, M.fg, M.bg, M.extended)),
                                H.setCellFromCodePoint(this._activeBuffer.x++, I, Q, M.fg, M.bg, M.extended),
                                0 < Q)
                                    for (; --Q; )
                                        H.setCellFromCodePoint(this._activeBuffer.x++, 0, 0, M.fg, M.bg, M.extended)
                            } else
                                H.getWidth(this._activeBuffer.x - 1) ? H.addCodepointToCell(this._activeBuffer.x - 1, I) : H.addCodepointToCell(this._activeBuffer.x - 2, I)
                        }
                        0 < G - E && (H.loadCell(this._activeBuffer.x - 1, this._workCell),
                        2 === this._workCell.getWidth() || 65535 < this._workCell.getCode() ? this._parser.precedingCodepoint = 0 : this._workCell.isCombined() ? this._parser.precedingCodepoint = this._workCell.getChars().charCodeAt(0) : this._parser.precedingCodepoint = this._workCell.content);
                        this._activeBuffer.x < V && 0 < G - E && 0 === H.getWidth(this._activeBuffer.x) && !H.hasContent(this._activeBuffer.x) && H.setCellFromCodePoint(this._activeBuffer.x, 0, 1, M.fg, M.bg, M.extended);
                        this._dirtyRowService.markDirty(this._activeBuffer.y)
                    }
                    ,
                    B.prototype.registerCsiHandler = function(y, E) {
                        var G = this;
                        return "t" !== y.final || y.prefix || y.intermediates ? this._parser.registerCsiHandler(y, E) : this._parser.registerCsiHandler(y, function(I) {
                            return !h(I.params[0], G._optionsService.rawOptions.windowOptions) || E(I)
                        })
                    }
                    ,
                    B.prototype.registerDcsHandler = function(y, E) {
                        return this._parser.registerDcsHandler(y, new r.DcsHandler(E))
                    }
                    ,
                    B.prototype.registerEscHandler = function(y, E) {
                        return this._parser.registerEscHandler(y, E)
                    }
                    ,
                    B.prototype.registerOscHandler = function(y, E) {
                        return this._parser.registerOscHandler(y, new w.OscHandler(E))
                    }
                    ,
                    B.prototype.bell = function() {
                        return this._onRequestBell.fire(),
                        !0
                    }
                    ,
                    B.prototype.lineFeed = function() {
                        return this._dirtyRowService.markDirty(this._activeBuffer.y),
                        this._optionsService.rawOptions.convertEol && (this._activeBuffer.x = 0),
                        this._activeBuffer.y++,
                        this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--,
                        this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1),
                        this._activeBuffer.x >= this._bufferService.cols && this._activeBuffer.x--,
                        this._dirtyRowService.markDirty(this._activeBuffer.y),
                        this._onLineFeed.fire(),
                        !0
                    }
                    ,
                    B.prototype.carriageReturn = function() {
                        return this._activeBuffer.x = 0,
                        !0
                    }
                    ,
                    B.prototype.backspace = function() {
                        var y;
                        if (!this._coreService.decPrivateModes.reverseWraparound)
                            return this._restrictCursor(),
                            0 < this._activeBuffer.x && this._activeBuffer.x--,
                            !0;
                        (this._restrictCursor(this._bufferService.cols),
                        0 < this._activeBuffer.x) ? this._activeBuffer.x-- : 0 === this._activeBuffer.x && this._activeBuffer.y > this._activeBuffer.scrollTop && this._activeBuffer.y <= this._activeBuffer.scrollBottom && (null === (y = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y)) || void 0 === y ? 0 : y.isWrapped) && (this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y).isWrapped = !1,
                        this._activeBuffer.y--,
                        this._activeBuffer.x = this._bufferService.cols - 1,
                        y = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y),
                        y.hasWidth(this._activeBuffer.x) && !y.hasContent(this._activeBuffer.x) && this._activeBuffer.x--);
                        return this._restrictCursor(),
                        !0
                    }
                    ,
                    B.prototype.tab = function() {
                        if (this._activeBuffer.x >= this._bufferService.cols)
                            return !0;
                        var y = this._activeBuffer.x;
                        return this._activeBuffer.x = this._activeBuffer.nextStop(),
                        this._optionsService.rawOptions.screenReaderMode && this._onA11yTab.fire(this._activeBuffer.x - y),
                        !0
                    }
                    ,
                    B.prototype.shiftOut = function() {
                        return this._charsetService.setgLevel(1),
                        !0
                    }
                    ,
                    B.prototype.shiftIn = function() {
                        return this._charsetService.setgLevel(0),
                        !0
                    }
                    ,
                    B.prototype._restrictCursor = function(y) {
                        void 0 === y && (y = this._bufferService.cols - 1);
                        this._activeBuffer.x = Math.min(y, Math.max(0, this._activeBuffer.x));
                        this._activeBuffer.y = this._coreService.decPrivateModes.origin ? Math.min(this._activeBuffer.scrollBottom, Math.max(this._activeBuffer.scrollTop, this._activeBuffer.y)) : Math.min(this._bufferService.rows - 1, Math.max(0, this._activeBuffer.y));
                        this._dirtyRowService.markDirty(this._activeBuffer.y)
                    }
                    ,
                    B.prototype._setCursor = function(y, E) {
                        this._dirtyRowService.markDirty(this._activeBuffer.y);
                        this._coreService.decPrivateModes.origin ? (this._activeBuffer.x = y,
                        this._activeBuffer.y = this._activeBuffer.scrollTop + E) : (this._activeBuffer.x = y,
                        this._activeBuffer.y = E);
                        this._restrictCursor();
                        this._dirtyRowService.markDirty(this._activeBuffer.y)
                    }
                    ,
                    B.prototype._moveCursor = function(y, E) {
                        this._restrictCursor();
                        this._setCursor(this._activeBuffer.x + y, this._activeBuffer.y + E)
                    }
                    ,
                    B.prototype.cursorUp = function(y) {
                        var E = this._activeBuffer.y - this._activeBuffer.scrollTop;
                        return 0 <= E ? this._moveCursor(0, -Math.min(E, y.params[0] || 1)) : this._moveCursor(0, -(y.params[0] || 1)),
                        !0
                    }
                    ,
                    B.prototype.cursorDown = function(y) {
                        var E = this._activeBuffer.scrollBottom - this._activeBuffer.y;
                        return 0 <= E ? this._moveCursor(0, Math.min(E, y.params[0] || 1)) : this._moveCursor(0, y.params[0] || 1),
                        !0
                    }
                    ,
                    B.prototype.cursorForward = function(y) {
                        return this._moveCursor(y.params[0] || 1, 0),
                        !0
                    }
                    ,
                    B.prototype.cursorBackward = function(y) {
                        return this._moveCursor(-(y.params[0] || 1), 0),
                        !0
                    }
                    ,
                    B.prototype.cursorNextLine = function(y) {
                        return this.cursorDown(y),
                        this._activeBuffer.x = 0,
                        !0
                    }
                    ,
                    B.prototype.cursorPrecedingLine = function(y) {
                        return this.cursorUp(y),
                        this._activeBuffer.x = 0,
                        !0
                    }
                    ,
                    B.prototype.cursorCharAbsolute = function(y) {
                        return this._setCursor((y.params[0] || 1) - 1, this._activeBuffer.y),
                        !0
                    }
                    ,
                    B.prototype.cursorPosition = function(y) {
                        return this._setCursor(2 <= y.length ? (y.params[1] || 1) - 1 : 0, (y.params[0] || 1) - 1),
                        !0
                    }
                    ,
                    B.prototype.charPosAbsolute = function(y) {
                        return this._setCursor((y.params[0] || 1) - 1, this._activeBuffer.y),
                        !0
                    }
                    ,
                    B.prototype.hPositionRelative = function(y) {
                        return this._moveCursor(y.params[0] || 1, 0),
                        !0
                    }
                    ,
                    B.prototype.linePosAbsolute = function(y) {
                        return this._setCursor(this._activeBuffer.x, (y.params[0] || 1) - 1),
                        !0
                    }
                    ,
                    B.prototype.vPositionRelative = function(y) {
                        return this._moveCursor(0, y.params[0] || 1),
                        !0
                    }
                    ,
                    B.prototype.hVPosition = function(y) {
                        return this.cursorPosition(y),
                        !0
                    }
                    ,
                    B.prototype.tabClear = function(y) {
                        y = y.params[0];
                        return 0 === y ? delete this._activeBuffer.tabs[this._activeBuffer.x] : 3 === y && (this._activeBuffer.tabs = {}),
                        !0
                    }
                    ,
                    B.prototype.cursorForwardTab = function(y) {
                        if (this._activeBuffer.x >= this._bufferService.cols)
                            return !0;
                        for (y = y.params[0] || 1; y--; )
                            this._activeBuffer.x = this._activeBuffer.nextStop();
                        return !0
                    }
                    ,
                    B.prototype.cursorBackwardTab = function(y) {
                        if (this._activeBuffer.x >= this._bufferService.cols)
                            return !0;
                        for (y = y.params[0] || 1; y--; )
                            this._activeBuffer.x = this._activeBuffer.prevStop();
                        return !0
                    }
                    ,
                    B.prototype._eraseInBufferLine = function(y, E, G, I) {
                        void 0 === I && (I = !1);
                        y = this._activeBuffer.lines.get(this._activeBuffer.ybase + y);
                        y.replaceCells(E, G, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData());
                        I && (y.isWrapped = !1)
                    }
                    ,
                    B.prototype._resetBufferLine = function(y) {
                        y = this._activeBuffer.lines.get(this._activeBuffer.ybase + y);
                        y.fill(this._activeBuffer.getNullCell(this._eraseAttrData()));
                        y.isWrapped = !1
                    }
                    ,
                    B.prototype.eraseInDisplay = function(y) {
                        switch (this._restrictCursor(this._bufferService.cols),
                        y.params[0]) {
                        case 0:
                            y = this._activeBuffer.y;
                            this._dirtyRowService.markDirty(y);
                            for (this._eraseInBufferLine(y++, this._activeBuffer.x, this._bufferService.cols, 0 === this._activeBuffer.x); y < this._bufferService.rows; y++)
                                this._resetBufferLine(y);
                            this._dirtyRowService.markDirty(y);
                            break;
                        case 1:
                            y = this._activeBuffer.y;
                            this._dirtyRowService.markDirty(y);
                            this._eraseInBufferLine(y, 0, this._activeBuffer.x + 1, !0);
                            for (this._activeBuffer.x + 1 >= this._bufferService.cols && (this._activeBuffer.lines.get(y + 1).isWrapped = !1); y--; )
                                this._resetBufferLine(y);
                            this._dirtyRowService.markDirty(0);
                            break;
                        case 2:
                            y = this._bufferService.rows;
                            for (this._dirtyRowService.markDirty(y - 1); y--; )
                                this._resetBufferLine(y);
                            this._dirtyRowService.markDirty(0);
                            break;
                        case 3:
                            y = this._activeBuffer.lines.length - this._bufferService.rows,
                            0 < y && (this._activeBuffer.lines.trimStart(y),
                            this._activeBuffer.ybase = Math.max(this._activeBuffer.ybase - y, 0),
                            this._activeBuffer.ydisp = Math.max(this._activeBuffer.ydisp - y, 0),
                            this._onScroll.fire(0))
                        }
                        return !0
                    }
                    ,
                    B.prototype.eraseInLine = function(y) {
                        switch (this._restrictCursor(this._bufferService.cols),
                        y.params[0]) {
                        case 0:
                            this._eraseInBufferLine(this._activeBuffer.y, this._activeBuffer.x, this._bufferService.cols, 0 === this._activeBuffer.x);
                            break;
                        case 1:
                            this._eraseInBufferLine(this._activeBuffer.y, 0, this._activeBuffer.x + 1, !1);
                            break;
                        case 2:
                            this._eraseInBufferLine(this._activeBuffer.y, 0, this._bufferService.cols, !0)
                        }
                        return this._dirtyRowService.markDirty(this._activeBuffer.y),
                        !0
                    }
                    ,
                    B.prototype.insertLines = function(y) {
                        this._restrictCursor();
                        y = y.params[0] || 1;
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        for (var E = this._activeBuffer.ybase + this._activeBuffer.y, G = this._bufferService.rows - 1 + this._activeBuffer.ybase - (this._bufferService.rows - 1 - this._activeBuffer.scrollBottom) + 1; y--; )
                            this._activeBuffer.lines.splice(G - 1, 1),
                            this._activeBuffer.lines.splice(E, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom),
                        this._activeBuffer.x = 0,
                        !0
                    }
                    ,
                    B.prototype.deleteLines = function(y) {
                        this._restrictCursor();
                        y = y.params[0] || 1;
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        var E = this._activeBuffer.ybase + this._activeBuffer.y;
                        var G = this._bufferService.rows - 1 - this._activeBuffer.scrollBottom;
                        for (G = this._bufferService.rows - 1 + this._activeBuffer.ybase - G; y--; )
                            this._activeBuffer.lines.splice(E, 1),
                            this._activeBuffer.lines.splice(G, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.y, this._activeBuffer.scrollBottom),
                        this._activeBuffer.x = 0,
                        !0
                    }
                    ,
                    B.prototype.insertChars = function(y) {
                        this._restrictCursor();
                        var E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                        return E && (E.insertCells(this._activeBuffer.x, y.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()),
                        this._dirtyRowService.markDirty(this._activeBuffer.y)),
                        !0
                    }
                    ,
                    B.prototype.deleteChars = function(y) {
                        this._restrictCursor();
                        var E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                        return E && (E.deleteCells(this._activeBuffer.x, y.params[0] || 1, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()),
                        this._dirtyRowService.markDirty(this._activeBuffer.y)),
                        !0
                    }
                    ,
                    B.prototype.scrollUp = function(y) {
                        for (y = y.params[0] || 1; y--; )
                            this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 1),
                            this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 0, this._activeBuffer.getBlankLine(this._eraseAttrData()));
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.scrollDown = function(y) {
                        for (y = y.params[0] || 1; y--; )
                            this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollBottom, 1),
                            this._activeBuffer.lines.splice(this._activeBuffer.ybase + this._activeBuffer.scrollTop, 0, this._activeBuffer.getBlankLine(a.DEFAULT_ATTR_DATA));
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.scrollLeft = function(y) {
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        y = y.params[0] || 1;
                        for (var E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
                            var G = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
                            G.deleteCells(0, y, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData());
                            G.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.scrollRight = function(y) {
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        y = y.params[0] || 1;
                        for (var E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
                            var G = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
                            G.insertCells(0, y, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData());
                            G.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.insertColumns = function(y) {
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        y = y.params[0] || 1;
                        for (var E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
                            var G = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
                            G.insertCells(this._activeBuffer.x, y, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData());
                            G.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.deleteColumns = function(y) {
                        if (this._activeBuffer.y > this._activeBuffer.scrollBottom || this._activeBuffer.y < this._activeBuffer.scrollTop)
                            return !0;
                        y = y.params[0] || 1;
                        for (var E = this._activeBuffer.scrollTop; E <= this._activeBuffer.scrollBottom; ++E) {
                            var G = this._activeBuffer.lines.get(this._activeBuffer.ybase + E);
                            G.deleteCells(this._activeBuffer.x, y, this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData());
                            G.isWrapped = !1
                        }
                        return this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom),
                        !0
                    }
                    ,
                    B.prototype.eraseChars = function(y) {
                        this._restrictCursor();
                        var E = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y);
                        return E && (E.replaceCells(this._activeBuffer.x, this._activeBuffer.x + (y.params[0] || 1), this._activeBuffer.getNullCell(this._eraseAttrData()), this._eraseAttrData()),
                        this._dirtyRowService.markDirty(this._activeBuffer.y)),
                        !0
                    }
                    ,
                    B.prototype.repeatPrecedingCharacter = function(y) {
                        if (!this._parser.precedingCodepoint)
                            return !0;
                        y = y.params[0] || 1;
                        for (var E = new Uint32Array(y), G = 0; G < y; ++G)
                            E[G] = this._parser.precedingCodepoint;
                        return this.print(E, 0, E.length),
                        !0
                    }
                    ,
                    B.prototype.sendDeviceAttributesPrimary = function(y) {
                        return 0 < y.params[0] || (this._is("xterm") || this._is("rxvt-unicode") || this._is("screen") ? this._coreService.triggerDataEvent(n.C0.ESC + "[?1;2c") : this._is("linux") && this._coreService.triggerDataEvent(n.C0.ESC + "[?6c")),
                        !0
                    }
                    ,
                    B.prototype.sendDeviceAttributesSecondary = function(y) {
                        return 0 < y.params[0] || (this._is("xterm") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>0;276;0c") : this._is("rxvt-unicode") ? this._coreService.triggerDataEvent(n.C0.ESC + "[>85;95;0c") : this._is("linux") ? this._coreService.triggerDataEvent(y.params[0] + "c") : this._is("screen") && this._coreService.triggerDataEvent(n.C0.ESC + "[>83;40003;0c")),
                        !0
                    }
                    ,
                    B.prototype._is = function(y) {
                        return 0 === (this._optionsService.rawOptions.termName + "").indexOf(y)
                    }
                    ,
                    B.prototype.setMode = function(y) {
                        for (var E = 0; E < y.length; E++)
                            4 === y.params[E] && (this._coreService.modes.insertMode = !0);
                        return !0
                    }
                    ,
                    B.prototype.setModePrivate = function(y) {
                        for (var E = 0; E < y.length; E++)
                            switch (y.params[E]) {
                            case 1:
                                this._coreService.decPrivateModes.applicationCursorKeys = !0;
                                break;
                            case 2:
                                this._charsetService.setgCharset(0, g.DEFAULT_CHARSET);
                                this._charsetService.setgCharset(1, g.DEFAULT_CHARSET);
                                this._charsetService.setgCharset(2, g.DEFAULT_CHARSET);
                                this._charsetService.setgCharset(3, g.DEFAULT_CHARSET);
                                break;
                            case 3:
                                this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(132, this._bufferService.rows),
                                this._onRequestReset.fire());
                                break;
                            case 6:
                                this._coreService.decPrivateModes.origin = !0;
                                this._setCursor(0, 0);
                                break;
                            case 7:
                                this._coreService.decPrivateModes.wraparound = !0;
                                break;
                            case 45:
                                this._coreService.decPrivateModes.reverseWraparound = !0;
                                break;
                            case 66:
                                this._logService.debug("Serial port requested application keypad.");
                                this._coreService.decPrivateModes.applicationKeypad = !0;
                                this._onRequestSyncScrollBar.fire();
                                break;
                            case 9:
                                this._coreMouseService.activeProtocol = "X10";
                                break;
                            case 1E3:
                                this._coreMouseService.activeProtocol = "VT200";
                                break;
                            case 1002:
                                this._coreMouseService.activeProtocol = "DRAG";
                                break;
                            case 1003:
                                this._coreMouseService.activeProtocol = "ANY";
                                break;
                            case 1004:
                                this._coreService.decPrivateModes.sendFocus = !0;
                                this._onRequestSendFocus.fire();
                                break;
                            case 1005:
                                this._logService.debug("DECSET 1005 not supported (see #2507)");
                                break;
                            case 1006:
                                this._coreMouseService.activeEncoding = "SGR";
                                break;
                            case 1015:
                                this._logService.debug("DECSET 1015 not supported (see #2507)");
                                break;
                            case 25:
                                this._coreService.isCursorHidden = !1;
                                break;
                            case 1048:
                                this.saveCursor();
                                break;
                            case 1049:
                                this.saveCursor();
                            case 47:
                            case 1047:
                                this._bufferService.buffers.activateAltBuffer(this._eraseAttrData());
                                this._coreService.isCursorInitialized = !0;
                                this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1);
                                this._onRequestSyncScrollBar.fire();
                                break;
                            case 2004:
                                this._coreService.decPrivateModes.bracketedPasteMode = !0
                            }
                        return !0
                    }
                    ,
                    B.prototype.resetMode = function(y) {
                        for (var E = 0; E < y.length; E++)
                            4 === y.params[E] && (this._coreService.modes.insertMode = !1);
                        return !0
                    }
                    ,
                    B.prototype.resetModePrivate = function(y) {
                        for (var E = 0; E < y.length; E++)
                            switch (y.params[E]) {
                            case 1:
                                this._coreService.decPrivateModes.applicationCursorKeys = !1;
                                break;
                            case 3:
                                this._optionsService.rawOptions.windowOptions.setWinLines && (this._bufferService.resize(80, this._bufferService.rows),
                                this._onRequestReset.fire());
                                break;
                            case 6:
                                this._coreService.decPrivateModes.origin = !1;
                                this._setCursor(0, 0);
                                break;
                            case 7:
                                this._coreService.decPrivateModes.wraparound = !1;
                                break;
                            case 45:
                                this._coreService.decPrivateModes.reverseWraparound = !1;
                                break;
                            case 66:
                                this._logService.debug("Switching back to normal keypad.");
                                this._coreService.decPrivateModes.applicationKeypad = !1;
                                this._onRequestSyncScrollBar.fire();
                                break;
                            case 9:
                            case 1E3:
                            case 1002:
                            case 1003:
                                this._coreMouseService.activeProtocol = "NONE";
                                break;
                            case 1004:
                                this._coreService.decPrivateModes.sendFocus = !1;
                                break;
                            case 1005:
                                this._logService.debug("DECRST 1005 not supported (see #2507)");
                                break;
                            case 1006:
                                this._coreMouseService.activeEncoding = "DEFAULT";
                                break;
                            case 1015:
                                this._logService.debug("DECRST 1015 not supported (see #2507)");
                                break;
                            case 25:
                                this._coreService.isCursorHidden = !0;
                                break;
                            case 1048:
                                this.restoreCursor();
                                break;
                            case 1049:
                            case 47:
                            case 1047:
                                this._bufferService.buffers.activateNormalBuffer();
                                1049 === y.params[E] && this.restoreCursor();
                                this._coreService.isCursorInitialized = !0;
                                this._onRequestRefreshRows.fire(0, this._bufferService.rows - 1);
                                this._onRequestSyncScrollBar.fire();
                                break;
                            case 2004:
                                this._coreService.decPrivateModes.bracketedPasteMode = !1
                            }
                        return !0
                    }
                    ,
                    B.prototype._updateAttrColor = function(y, E, G, I, Q) {
                        return 2 === E ? (y |= 50331648,
                        y &= -16777216,
                        y |= m.AttributeData.fromColorRGB([G, I, Q])) : 5 === E && (y &= -50331904,
                        y |= 33554432 | 255 & G),
                        y
                    }
                    ,
                    B.prototype._extractColor = function(y, E, G) {
                        var I = [0, 0, -1, 0, 0, 0]
                          , Q = 0
                          , R = 0;
                        do {
                            if (I[R + Q] = y.params[E + R],
                            y.hasSubParams(E + R)) {
                                y = y.getSubParams(E + R);
                                E = 0;
                                do
                                    5 === I[1] && (Q = 1),
                                    I[R + E + 1 + Q] = y[E];
                                while (++E < y.length && E + R + 1 + Q < I.length);
                                break
                            }
                            if (5 === I[1] && 2 <= R + Q || 2 === I[1] && 5 <= R + Q)
                                break;
                            I[1] && (Q = 1)
                        } while (++R + E < y.length && R + Q < I.length);
                        for (E = 2; E < I.length; ++E)
                            -1 === I[E] && (I[E] = 0);
                        switch (I[0]) {
                        case 38:
                            G.fg = this._updateAttrColor(G.fg, I[1], I[3], I[4], I[5]);
                            break;
                        case 48:
                            G.bg = this._updateAttrColor(G.bg, I[1], I[3], I[4], I[5]);
                            break;
                        case 58:
                            G.extended = G.extended.clone(),
                            G.extended.underlineColor = this._updateAttrColor(G.extended.underlineColor, I[1], I[3], I[4], I[5])
                        }
                        return R
                    }
                    ,
                    B.prototype._processUnderline = function(y, E) {
                        E.extended = E.extended.clone();
                        (!~y || 5 < y) && (y = 1);
                        E.extended.underlineStyle = y;
                        E.fg |= 268435456;
                        0 === y && (E.fg &= -268435457);
                        E.updateExtended()
                    }
                    ,
                    B.prototype.charAttributes = function(y) {
                        if (1 === y.length && 0 === y.params[0])
                            return this._curAttrData.fg = a.DEFAULT_ATTR_DATA.fg,
                            this._curAttrData.bg = a.DEFAULT_ATTR_DATA.bg,
                            !0;
                        for (var E, G = y.length, I = this._curAttrData, Q = 0; Q < G; Q++)
                            30 <= (E = y.params[Q]) && 37 >= E ? (I.fg &= -50331904,
                            I.fg = I.fg | 16777216 | E - 30) : 40 <= E && 47 >= E ? (I.bg &= -50331904,
                            I.bg = I.bg | 16777216 | E - 40) : 90 <= E && 97 >= E ? (I.fg &= -50331904,
                            I.fg = I.fg | 16777224 | E - 90) : 100 <= E && 107 >= E ? (I.bg &= -50331904,
                            I.bg = I.bg | 16777224 | E - 100) : 0 === E ? (I.fg = a.DEFAULT_ATTR_DATA.fg,
                            I.bg = a.DEFAULT_ATTR_DATA.bg) : 1 === E ? I.fg |= 134217728 : 3 === E ? I.bg |= 67108864 : 4 === E ? (I.fg |= 268435456,
                            this._processUnderline(y.hasSubParams(Q) ? y.getSubParams(Q)[0] : 1, I)) : 5 === E ? I.fg |= 536870912 : 7 === E ? I.fg |= 67108864 : 8 === E ? I.fg |= 1073741824 : 9 === E ? I.fg |= 2147483648 : 2 === E ? I.bg |= 134217728 : 21 === E ? this._processUnderline(2, I) : 22 === E ? (I.fg &= -134217729,
                            I.bg &= -134217729) : 23 === E ? I.bg &= -67108865 : 24 === E ? I.fg &= -268435457 : 25 === E ? I.fg &= -536870913 : 27 === E ? I.fg &= -67108865 : 28 === E ? I.fg &= -1073741825 : 29 === E ? I.fg &= 2147483647 : 39 === E ? (I.fg &= -67108864,
                            I.fg |= 16777215 & a.DEFAULT_ATTR_DATA.fg) : 49 === E ? (I.bg &= -67108864,
                            I.bg |= 16777215 & a.DEFAULT_ATTR_DATA.bg) : 38 === E || 48 === E || 58 === E ? Q += this._extractColor(y, Q, I) : 59 === E ? (I.extended = I.extended.clone(),
                            I.extended.underlineColor = -1,
                            I.updateExtended()) : 100 === E ? (I.fg &= -67108864,
                            I.fg |= 16777215 & a.DEFAULT_ATTR_DATA.fg,
                            I.bg &= -67108864,
                            I.bg |= 16777215 & a.DEFAULT_ATTR_DATA.bg) : this._logService.debug("Unknown SGR attribute: %d.", E);
                        return !0
                    }
                    ,
                    B.prototype.deviceStatus = function(y) {
                        switch (y.params[0]) {
                        case 5:
                            this._coreService.triggerDataEvent(n.C0.ESC + "[0n");
                            break;
                        case 6:
                            this._coreService.triggerDataEvent(n.C0.ESC + "[" + (this._activeBuffer.y + 1) + ";" + (this._activeBuffer.x + 1) + "R")
                        }
                        return !0
                    }
                    ,
                    B.prototype.deviceStatusPrivate = function(y) {
                        6 === y.params[0] && this._coreService.triggerDataEvent(n.C0.ESC + "[?" + (this._activeBuffer.y + 1) + ";" + (this._activeBuffer.x + 1) + "R");
                        return !0
                    }
                    ,
                    B.prototype.softReset = function(y) {
                        return this._coreService.isCursorHidden = !1,
                        this._onRequestSyncScrollBar.fire(),
                        this._activeBuffer.scrollTop = 0,
                        this._activeBuffer.scrollBottom = this._bufferService.rows - 1,
                        this._curAttrData = a.DEFAULT_ATTR_DATA.clone(),
                        this._coreService.reset(),
                        this._charsetService.reset(),
                        this._activeBuffer.savedX = 0,
                        this._activeBuffer.savedY = this._activeBuffer.ybase,
                        this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg,
                        this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg,
                        this._activeBuffer.savedCharset = this._charsetService.charset,
                        this._coreService.decPrivateModes.origin = !1,
                        !0
                    }
                    ,
                    B.prototype.setCursorStyle = function(y) {
                        y = y.params[0] || 1;
                        switch (y) {
                        case 1:
                        case 2:
                            this._optionsService.options.cursorStyle = "block";
                            break;
                        case 3:
                        case 4:
                            this._optionsService.options.cursorStyle = "underline";
                            break;
                        case 5:
                        case 6:
                            this._optionsService.options.cursorStyle = "bar"
                        }
                        return this._optionsService.options.cursorBlink = 1 == y % 2,
                        !0
                    }
                    ,
                    B.prototype.setScrollRegion = function(y) {
                        var E, G = y.params[0] || 1;
                        return (2 > y.length || (E = y.params[1]) > this._bufferService.rows || 0 === E) && (E = this._bufferService.rows),
                        E > G && (this._activeBuffer.scrollTop = G - 1,
                        this._activeBuffer.scrollBottom = E - 1,
                        this._setCursor(0, 0)),
                        !0
                    }
                    ,
                    B.prototype.windowOptions = function(y) {
                        if (!h(y.params[0], this._optionsService.rawOptions.windowOptions))
                            return !0;
                        var E = 1 < y.length ? y.params[1] : 0;
                        switch (y.params[0]) {
                        case 14:
                            2 !== E && this._onRequestWindowsOptionsReport.fire(t.GET_WIN_SIZE_PIXELS);
                            break;
                        case 16:
                            this._onRequestWindowsOptionsReport.fire(t.GET_CELL_SIZE_PIXELS);
                            break;
                        case 18:
                            this._bufferService && this._coreService.triggerDataEvent(n.C0.ESC + "[8;" + this._bufferService.rows + ";" + this._bufferService.cols + "t");
                            break;
                        case 22:
                            0 !== E && 2 !== E || (this._windowTitleStack.push(this._windowTitle),
                            10 < this._windowTitleStack.length && this._windowTitleStack.shift());
                            0 !== E && 1 !== E || (this._iconNameStack.push(this._iconName),
                            10 < this._iconNameStack.length && this._iconNameStack.shift());
                            break;
                        case 23:
                            0 !== E && 2 !== E || this._windowTitleStack.length && this.setTitle(this._windowTitleStack.pop()),
                            0 !== E && 1 !== E || this._iconNameStack.length && this.setIconName(this._iconNameStack.pop())
                        }
                        return !0
                    }
                    ,
                    B.prototype.saveCursor = function(y) {
                        return this._activeBuffer.savedX = this._activeBuffer.x,
                        this._activeBuffer.savedY = this._activeBuffer.ybase + this._activeBuffer.y,
                        this._activeBuffer.savedCurAttrData.fg = this._curAttrData.fg,
                        this._activeBuffer.savedCurAttrData.bg = this._curAttrData.bg,
                        this._activeBuffer.savedCharset = this._charsetService.charset,
                        !0
                    }
                    ,
                    B.prototype.restoreCursor = function(y) {
                        return this._activeBuffer.x = this._activeBuffer.savedX || 0,
                        this._activeBuffer.y = Math.max(this._activeBuffer.savedY - this._activeBuffer.ybase, 0),
                        this._curAttrData.fg = this._activeBuffer.savedCurAttrData.fg,
                        this._curAttrData.bg = this._activeBuffer.savedCurAttrData.bg,
                        this._charsetService.charset = this._savedCharset,
                        this._activeBuffer.savedCharset && (this._charsetService.charset = this._activeBuffer.savedCharset),
                        this._restrictCursor(),
                        !0
                    }
                    ,
                    B.prototype.setTitle = function(y) {
                        return this._windowTitle = y,
                        this._onTitleChange.fire(y),
                        !0
                    }
                    ,
                    B.prototype.setIconName = function(y) {
                        return this._iconName = y,
                        !0
                    }
                    ,
                    B.prototype.setOrReportIndexedColor = function(y) {
                        var E = [];
                        for (y = y.split(";"); 1 < y.length; ) {
                            var G = y.shift()
                              , I = y.shift();
                            /^\d+$/.exec(G) && (G = parseInt(G),
                            0 <= G && 256 > G && ("?" === I ? E.push({
                                type: 0,
                                index: G
                            }) : (I = (0,
                            z.parseColor)(I)) && E.push({
                                type: 1,
                                index: G,
                                color: I
                            })))
                        }
                        return E.length && this._onColor.fire(E),
                        !0
                    }
                    ,
                    B.prototype._setOrReportSpecialColor = function(y, E) {
                        y = y.split(";");
                        for (var G = 0; G < y.length && !(E >= this._specialColors.length); ++G,
                        ++E)
                            if ("?" === y[G])
                                this._onColor.fire([{
                                    type: 0,
                                    index: this._specialColors[E]
                                }]);
                            else {
                                var I = (0,
                                z.parseColor)(y[G]);
                                I && this._onColor.fire([{
                                    type: 1,
                                    index: this._specialColors[E],
                                    color: I
                                }])
                            }
                        return !0
                    }
                    ,
                    B.prototype.setOrReportFgColor = function(y) {
                        return this._setOrReportSpecialColor(y, 0)
                    }
                    ,
                    B.prototype.setOrReportBgColor = function(y) {
                        return this._setOrReportSpecialColor(y, 1)
                    }
                    ,
                    B.prototype.setOrReportCursorColor = function(y) {
                        return this._setOrReportSpecialColor(y, 2)
                    }
                    ,
                    B.prototype.restoreIndexedColor = function(y) {
                        if (!y)
                            return this._onColor.fire([{
                                type: 2
                            }]),
                            !0;
                        var E = [];
                        y = y.split(";");
                        for (var G = 0; G < y.length; ++G)
                            if (/^\d+$/.exec(y[G])) {
                                var I = parseInt(y[G]);
                                0 <= I && 256 > I && E.push({
                                    type: 2,
                                    index: I
                                })
                            }
                        return E.length && this._onColor.fire(E),
                        !0
                    }
                    ,
                    B.prototype.restoreFgColor = function(y) {
                        return this._onColor.fire([{
                            type: 2,
                            index: 256
                        }]),
                        !0
                    }
                    ,
                    B.prototype.restoreBgColor = function(y) {
                        return this._onColor.fire([{
                            type: 2,
                            index: 257
                        }]),
                        !0
                    }
                    ,
                    B.prototype.restoreCursorColor = function(y) {
                        return this._onColor.fire([{
                            type: 2,
                            index: 258
                        }]),
                        !0
                    }
                    ,
                    B.prototype.nextLine = function() {
                        return this._activeBuffer.x = 0,
                        this.index(),
                        !0
                    }
                    ,
                    B.prototype.keypadApplicationMode = function() {
                        return this._logService.debug("Serial port requested application keypad."),
                        this._coreService.decPrivateModes.applicationKeypad = !0,
                        this._onRequestSyncScrollBar.fire(),
                        !0
                    }
                    ,
                    B.prototype.keypadNumericMode = function() {
                        return this._logService.debug("Switching back to normal keypad."),
                        this._coreService.decPrivateModes.applicationKeypad = !1,
                        this._onRequestSyncScrollBar.fire(),
                        !0
                    }
                    ,
                    B.prototype.selectDefaultCharset = function() {
                        return this._charsetService.setgLevel(0),
                        this._charsetService.setgCharset(0, g.DEFAULT_CHARSET),
                        !0
                    }
                    ,
                    B.prototype.selectCharset = function(y) {
                        return 2 !== y.length ? (this.selectDefaultCharset(),
                        !0) : ("/" === y[0] || this._charsetService.setgCharset(C[y[0]], g.CHARSETS[y[1]] || g.DEFAULT_CHARSET),
                        !0)
                    }
                    ,
                    B.prototype.index = function() {
                        return this._restrictCursor(),
                        this._activeBuffer.y++,
                        this._activeBuffer.y === this._activeBuffer.scrollBottom + 1 ? (this._activeBuffer.y--,
                        this._bufferService.scroll(this._eraseAttrData())) : this._activeBuffer.y >= this._bufferService.rows && (this._activeBuffer.y = this._bufferService.rows - 1),
                        this._restrictCursor(),
                        !0
                    }
                    ,
                    B.prototype.tabSet = function() {
                        return this._activeBuffer.tabs[this._activeBuffer.x] = !0,
                        !0
                    }
                    ,
                    B.prototype.reverseIndex = function() {
                        (this._restrictCursor(),
                        this._activeBuffer.y === this._activeBuffer.scrollTop) ? (this._activeBuffer.lines.shiftElements(this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.scrollBottom - this._activeBuffer.scrollTop, 1),
                        this._activeBuffer.lines.set(this._activeBuffer.ybase + this._activeBuffer.y, this._activeBuffer.getBlankLine(this._eraseAttrData())),
                        this._dirtyRowService.markRangeDirty(this._activeBuffer.scrollTop, this._activeBuffer.scrollBottom)) : (this._activeBuffer.y--,
                        this._restrictCursor());
                        return !0
                    }
                    ,
                    B.prototype.fullReset = function() {
                        return this._parser.reset(),
                        this._onRequestReset.fire(),
                        !0
                    }
                    ,
                    B.prototype.reset = function() {
                        this._curAttrData = a.DEFAULT_ATTR_DATA.clone();
                        this._eraseAttrDataInternal = a.DEFAULT_ATTR_DATA.clone()
                    }
                    ,
                    B.prototype._eraseAttrData = function() {
                        return this._eraseAttrDataInternal.bg &= -67108864,
                        this._eraseAttrDataInternal.bg |= 67108863 & this._curAttrData.bg,
                        this._eraseAttrDataInternal
                    }
                    ,
                    B.prototype.setgLevel = function(y) {
                        return this._charsetService.setgLevel(y),
                        !0
                    }
                    ,
                    B.prototype.screenAlignmentPattern = function() {
                        var y = new f.CellData;
                        y.content = 4194373;
                        y.fg = this._curAttrData.fg;
                        y.bg = this._curAttrData.bg;
                        this._setCursor(0, 0);
                        for (var E = 0; E < this._bufferService.rows; ++E) {
                            var G = this._activeBuffer.lines.get(this._activeBuffer.ybase + this._activeBuffer.y + E);
                            G && (G.fill(y),
                            G.isWrapped = !1)
                        }
                        return this._dirtyRowService.markAllDirty(),
                        this._setCursor(0, 0),
                        !0
                    }
                    ,
                    B
                }(A.Disposable);
                l.InputHandler = q
            },
            844: (A, l) => {
                function q(h) {
                    for (var v = 0; v < h.length; v++)
                        h[v].dispose();
                    h.length = 0
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.getDisposeArrayDisposable = l.disposeArray = l.Disposable = void 0;
                A = function() {
                    function h() {
                        this._disposables = [];
                        this._isDisposed = !1
                    }
                    return h.prototype.dispose = function() {
                        this._isDisposed = !0;
                        for (var v = 0, p = this._disposables; v < p.length; v++)
                            p[v].dispose();
                        this._disposables.length = 0
                    }
                    ,
                    h.prototype.register = function(v) {
                        return this._disposables.push(v),
                        v
                    }
                    ,
                    h.prototype.unregister = function(v) {
                        v = this._disposables.indexOf(v);
                        -1 !== v && this._disposables.splice(v, 1)
                    }
                    ,
                    h
                }();
                l.Disposable = A;
                l.disposeArray = q;
                l.getDisposeArrayDisposable = function(h) {
                    return {
                        dispose: function() {
                            return q(h)
                        }
                    }
                }
            }
            ,
            6114: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.isLinux = l.isWindows = l.isIphone = l.isIpad = l.isMac = l.isSafari = l.isFirefox = void 0;
                var q = "undefined" == typeof navigator;
                A = q ? "node" : navigator.userAgent;
                q = q ? "node" : navigator.platform;
                l.isFirefox = A.includes("Firefox");
                l.isSafari = /^((?!chrome|android).)*safari/i.test(A);
                l.isMac = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].includes(q);
                l.isIpad = "iPad" === q;
                l.isIphone = "iPhone" === q;
                l.isWindows = ["Windows", "Win16", "Win32", "WinCE"].includes(q);
                l.isLinux = 0 <= q.indexOf("Linux")
            }
            ,
            8273: (A, l) => {
                function q(h, v, p, t) {
                    if (void 0 === p && (p = 0),
                    void 0 === t && (t = h.length),
                    p >= h.length)
                        return h;
                    p = (h.length + p) % h.length;
                    for (t = t >= h.length ? h.length : (h.length + t) % h.length; p < t; ++p)
                        h[p] = v;
                    return h
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.concat = l.fillFallback = l.fill = void 0;
                l.fill = function(h, v, p, t) {
                    return h.fill ? h.fill(v, p, t) : q(h, v, p, t)
                }
                ;
                l.fillFallback = q;
                l.concat = function(h, v) {
                    var p = new h.constructor(h.length + v.length);
                    return p.set(h),
                    p.set(v, h.length),
                    p
                }
            }
            ,
            9282: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.updateWindowsModeWrappedState = void 0;
                var h = q(643);
                l.updateWindowsModeWrappedState = function(v) {
                    var p = v.buffer.lines.get(v.buffer.ybase + v.buffer.y - 1);
                    p = null == p ? void 0 : p.get(v.cols - 1);
                    (v = v.buffer.lines.get(v.buffer.ybase + v.buffer.y)) && p && (v.isWrapped = p[h.CHAR_DATA_CODE_INDEX] !== h.NULL_CELL_CODE && p[h.CHAR_DATA_CODE_INDEX] !== h.WHITESPACE_CELL_CODE)
                }
            }
            ,
            3734: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ExtendedAttrs = l.AttributeData = void 0;
                A = function() {
                    function h() {
                        this.bg = this.fg = 0;
                        this.extended = new q
                    }
                    return h.toColorRGB = function(v) {
                        return [v >>> 16 & 255, v >>> 8 & 255, 255 & v]
                    }
                    ,
                    h.fromColorRGB = function(v) {
                        return (255 & v[0]) << 16 | (255 & v[1]) << 8 | 255 & v[2]
                    }
                    ,
                    h.prototype.clone = function() {
                        var v = new h;
                        return v.fg = this.fg,
                        v.bg = this.bg,
                        v.extended = this.extended.clone(),
                        v
                    }
                    ,
                    h.prototype.isInverse = function() {
                        return 67108864 & this.fg
                    }
                    ,
                    h.prototype.isBold = function() {
                        return 134217728 & this.fg
                    }
                    ,
                    h.prototype.isUnderline = function() {
                        return 268435456 & this.fg
                    }
                    ,
                    h.prototype.isBlink = function() {
                        return 536870912 & this.fg
                    }
                    ,
                    h.prototype.isInvisible = function() {
                        return 1073741824 & this.fg
                    }
                    ,
                    h.prototype.isItalic = function() {
                        return 67108864 & this.bg
                    }
                    ,
                    h.prototype.isDim = function() {
                        return 134217728 & this.bg
                    }
                    ,
                    h.prototype.isStrikethrough = function() {
                        return 2147483648 & this.fg
                    }
                    ,
                    h.prototype.getFgColorMode = function() {
                        return 50331648 & this.fg
                    }
                    ,
                    h.prototype.getBgColorMode = function() {
                        return 50331648 & this.bg
                    }
                    ,
                    h.prototype.isFgRGB = function() {
                        return 50331648 == (50331648 & this.fg)
                    }
                    ,
                    h.prototype.isBgRGB = function() {
                        return 50331648 == (50331648 & this.bg)
                    }
                    ,
                    h.prototype.isFgPalette = function() {
                        return 16777216 == (50331648 & this.fg) || 33554432 == (50331648 & this.fg)
                    }
                    ,
                    h.prototype.isBgPalette = function() {
                        return 16777216 == (50331648 & this.bg) || 33554432 == (50331648 & this.bg)
                    }
                    ,
                    h.prototype.isFgDefault = function() {
                        return 0 == (50331648 & this.fg)
                    }
                    ,
                    h.prototype.isBgDefault = function() {
                        return 0 == (50331648 & this.bg)
                    }
                    ,
                    h.prototype.isAttributeDefault = function() {
                        return 0 === this.fg && 0 === this.bg
                    }
                    ,
                    h.prototype.getFgColor = function() {
                        switch (50331648 & this.fg) {
                        case 16777216:
                        case 33554432:
                            return 255 & this.fg;
                        case 50331648:
                            return 16777215 & this.fg;
                        default:
                            return -1
                        }
                    }
                    ,
                    h.prototype.getBgColor = function() {
                        switch (50331648 & this.bg) {
                        case 16777216:
                        case 33554432:
                            return 255 & this.bg;
                        case 50331648:
                            return 16777215 & this.bg;
                        default:
                            return -1
                        }
                    }
                    ,
                    h.prototype.hasExtendedAttrs = function() {
                        return 268435456 & this.bg
                    }
                    ,
                    h.prototype.updateExtended = function() {
                        this.extended.isEmpty() ? this.bg &= -268435457 : this.bg |= 268435456
                    }
                    ,
                    h.prototype.getUnderlineColor = function() {
                        if (268435456 & this.bg && ~this.extended.underlineColor)
                            switch (50331648 & this.extended.underlineColor) {
                            case 16777216:
                            case 33554432:
                                return 255 & this.extended.underlineColor;
                            case 50331648:
                                return 16777215 & this.extended.underlineColor
                            }
                        return this.getFgColor()
                    }
                    ,
                    h.prototype.getUnderlineColorMode = function() {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 50331648 & this.extended.underlineColor : this.getFgColorMode()
                    }
                    ,
                    h.prototype.isUnderlineColorRGB = function() {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 50331648 == (50331648 & this.extended.underlineColor) : this.isFgRGB()
                    }
                    ,
                    h.prototype.isUnderlineColorPalette = function() {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 16777216 == (50331648 & this.extended.underlineColor) || 33554432 == (50331648 & this.extended.underlineColor) : this.isFgPalette()
                    }
                    ,
                    h.prototype.isUnderlineColorDefault = function() {
                        return 268435456 & this.bg && ~this.extended.underlineColor ? 0 == (50331648 & this.extended.underlineColor) : this.isFgDefault()
                    }
                    ,
                    h.prototype.getUnderlineStyle = function() {
                        return 268435456 & this.fg ? 268435456 & this.bg ? this.extended.underlineStyle : 1 : 0
                    }
                    ,
                    h
                }();
                l.AttributeData = A;
                var q = function() {
                    function h(v, p) {
                        void 0 === v && (v = 0);
                        void 0 === p && (p = -1);
                        this.underlineStyle = v;
                        this.underlineColor = p
                    }
                    return h.prototype.clone = function() {
                        return new h(this.underlineStyle,this.underlineColor)
                    }
                    ,
                    h.prototype.isEmpty = function() {
                        return 0 === this.underlineStyle
                    }
                    ,
                    h
                }();
                l.ExtendedAttrs = q
            }
            ,
            9092: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferStringIterator = l.Buffer = l.MAX_BUFFER_SIZE = void 0;
                var h = q(6349)
                  , v = q(8437)
                  , p = q(511)
                  , t = q(643)
                  , n = q(4634)
                  , g = q(4863)
                  , k = q(7116)
                  , d = q(3734);
                l.MAX_BUFFER_SIZE = 4294967295;
                A = function() {
                    function a(b, e, f) {
                        this._hasScrollback = b;
                        this._optionsService = e;
                        this._bufferService = f;
                        this.savedX = this.savedY = this.x = this.y = this.ybase = this.ydisp = 0;
                        this.savedCurAttrData = v.DEFAULT_ATTR_DATA.clone();
                        this.savedCharset = k.DEFAULT_CHARSET;
                        this.markers = [];
                        this._nullCell = p.CellData.fromCharData([0, t.NULL_CELL_CHAR, t.NULL_CELL_WIDTH, t.NULL_CELL_CODE]);
                        this._whitespaceCell = p.CellData.fromCharData([0, t.WHITESPACE_CELL_CHAR, t.WHITESPACE_CELL_WIDTH, t.WHITESPACE_CELL_CODE]);
                        this._cols = this._bufferService.cols;
                        this._rows = this._bufferService.rows;
                        this.lines = new h.CircularList(this._getCorrectBufferLength(this._rows));
                        this.scrollTop = 0;
                        this.scrollBottom = this._rows - 1;
                        this.setupTabStops()
                    }
                    return a.prototype.getNullCell = function(b) {
                        return b ? (this._nullCell.fg = b.fg,
                        this._nullCell.bg = b.bg,
                        this._nullCell.extended = b.extended) : (this._nullCell.fg = 0,
                        this._nullCell.bg = 0,
                        this._nullCell.extended = new d.ExtendedAttrs),
                        this._nullCell
                    }
                    ,
                    a.prototype.getWhitespaceCell = function(b) {
                        return b ? (this._whitespaceCell.fg = b.fg,
                        this._whitespaceCell.bg = b.bg,
                        this._whitespaceCell.extended = b.extended) : (this._whitespaceCell.fg = 0,
                        this._whitespaceCell.bg = 0,
                        this._whitespaceCell.extended = new d.ExtendedAttrs),
                        this._whitespaceCell
                    }
                    ,
                    a.prototype.getBlankLine = function(b, e) {
                        return new v.BufferLine(this._bufferService.cols,this.getNullCell(b),e)
                    }
                    ,
                    Object.defineProperty(a.prototype, "hasScrollback", {
                        get: function() {
                            return this._hasScrollback && this.lines.maxLength > this._rows
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(a.prototype, "isCursorInViewport", {
                        get: function() {
                            var b = this.ybase + this.y - this.ydisp;
                            return 0 <= b && b < this._rows
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    a.prototype._getCorrectBufferLength = function(b) {
                        if (!this._hasScrollback)
                            return b;
                        b += this._optionsService.rawOptions.scrollback;
                        return b > l.MAX_BUFFER_SIZE ? l.MAX_BUFFER_SIZE : b
                    }
                    ,
                    a.prototype.fillViewportRows = function(b) {
                        if (0 === this.lines.length) {
                            void 0 === b && (b = v.DEFAULT_ATTR_DATA);
                            for (var e = this._rows; e--; )
                                this.lines.push(this.getBlankLine(b))
                        }
                    }
                    ,
                    a.prototype.clear = function() {
                        this.x = this.y = this.ybase = this.ydisp = 0;
                        this.lines = new h.CircularList(this._getCorrectBufferLength(this._rows));
                        this.scrollTop = 0;
                        this.scrollBottom = this._rows - 1;
                        this.setupTabStops()
                    }
                    ,
                    a.prototype.resize = function(b, e) {
                        var f = this.getNullCell(v.DEFAULT_ATTR_DATA)
                          , m = this._getCorrectBufferLength(e);
                        if (m > this.lines.maxLength && (this.lines.maxLength = m),
                        0 < this.lines.length) {
                            if (this._cols < b)
                                for (var u = 0; u < this.lines.length; u++)
                                    this.lines.get(u).resize(b, f);
                            u = 0;
                            if (this._rows < e)
                                for (var w = this._rows; w < e; w++)
                                    this.lines.length < e + this.ybase && (this._optionsService.rawOptions.windowsMode ? this.lines.push(new v.BufferLine(b,f)) : 0 < this.ybase && this.lines.length <= this.ybase + this.y + u + 1 ? (this.ybase--,
                                    u++,
                                    0 < this.ydisp && this.ydisp--) : this.lines.push(new v.BufferLine(b,f)));
                            else
                                for (w = this._rows; w > e; w--)
                                    this.lines.length > e + this.ybase && (this.lines.length > this.ybase + this.y + 1 ? this.lines.pop() : (this.ybase++,
                                    this.ydisp++));
                            m < this.lines.maxLength && (w = this.lines.length - m,
                            0 < w && (this.lines.trimStart(w),
                            this.ybase = Math.max(this.ybase - w, 0),
                            this.ydisp = Math.max(this.ydisp - w, 0),
                            this.savedY = Math.max(this.savedY - w, 0)),
                            this.lines.maxLength = m);
                            this.x = Math.min(this.x, b - 1);
                            this.y = Math.min(this.y, e - 1);
                            u && (this.y += u);
                            this.savedX = Math.min(this.savedX, b - 1);
                            this.scrollTop = 0
                        }
                        if (this.scrollBottom = e - 1,
                        this._isReflowEnabled && (this._reflow(b, e),
                        this._cols > b))
                            for (u = 0; u < this.lines.length; u++)
                                this.lines.get(u).resize(b, f);
                        this._cols = b;
                        this._rows = e
                    }
                    ,
                    Object.defineProperty(a.prototype, "_isReflowEnabled", {
                        get: function() {
                            return this._hasScrollback && !this._optionsService.rawOptions.windowsMode
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    a.prototype._reflow = function(b, e) {
                        this._cols !== b && (b > this._cols ? this._reflowLarger(b, e) : this._reflowSmaller(b, e))
                    }
                    ,
                    a.prototype._reflowLarger = function(b, e) {
                        var f = (0,
                        n.reflowLargerGetLinesToRemove)(this.lines, this._cols, b, this.ybase + this.y, this.getNullCell(v.DEFAULT_ATTR_DATA));
                        0 < f.length && (f = (0,
                        n.reflowLargerCreateNewLayout)(this.lines, f),
                        (0,
                        n.reflowLargerApplyNewLayout)(this.lines, f.layout),
                        this._reflowLargerAdjustViewport(b, e, f.countRemoved))
                    }
                    ,
                    a.prototype._reflowLargerAdjustViewport = function(b, e, f) {
                        for (var m = this.getNullCell(v.DEFAULT_ATTR_DATA), u = f; 0 < u--; )
                            0 === this.ybase ? (0 < this.y && this.y--,
                            this.lines.length < e && this.lines.push(new v.BufferLine(b,m))) : (this.ydisp === this.ybase && this.ydisp--,
                            this.ybase--);
                        this.savedY = Math.max(this.savedY - f, 0)
                    }
                    ,
                    a.prototype._reflowSmaller = function(b, e) {
                        for (var f = this.getNullCell(v.DEFAULT_ATTR_DATA), m = [], u = 0, w = this.lines.length - 1; 0 <= w; w--) {
                            var r = this.lines.get(w);
                            if (!(!r || !r.isWrapped && r.getTrimmedLength() <= b)) {
                                for (var z = [r]; r.isWrapped && 0 < w; )
                                    r = this.lines.get(--w),
                                    z.unshift(r);
                                r = this.ybase + this.y;
                                if (!(r >= w && r < w + z.length)) {
                                    var C = z[z.length - 1].getTrimmedLength()
                                      , J = (0,
                                    n.reflowSmallerGetNewLineLengths)(z, this._cols, b)
                                      , F = J.length - z.length;
                                    var B = 0 === this.ybase && this.y !== this.lines.length - 1 ? Math.max(0, this.y - this.lines.maxLength + F) : Math.max(0, this.lines.length - this.lines.maxLength + F);
                                    var y = [];
                                    for (r = 0; r < F; r++) {
                                        var E = this.getBlankLine(v.DEFAULT_ATTR_DATA, !0);
                                        y.push(E)
                                    }
                                    0 < y.length && (m.push({
                                        start: w + z.length + u,
                                        newLines: y
                                    }),
                                    u += y.length);
                                    z.push.apply(z, y);
                                    r = J.length - 1;
                                    y = J[r];
                                    0 === y && (y = J[--r]);
                                    for (E = z.length - F - 1; 0 <= E; ) {
                                        var G = Math.min(C, y);
                                        if (void 0 === z[r])
                                            break;
                                        if (z[r].copyCellsFrom(z[E], C - G, y - G, G, !0),
                                        0 == (y -= G) && (y = J[--r]),
                                        0 == (C -= G))
                                            E--,
                                            C = Math.max(E, 0),
                                            C = (0,
                                            n.getWrappedLineTrimmedLength)(z, C, this._cols)
                                    }
                                    for (r = 0; r < z.length; r++)
                                        J[r] < b && z[r].setCell(J[r], f);
                                    for (r = F - B; 0 < r--; )
                                        0 === this.ybase ? this.y < e - 1 ? (this.y++,
                                        this.lines.pop()) : (this.ybase++,
                                        this.ydisp++) : this.ybase < Math.min(this.lines.maxLength, this.lines.length + u) - e && (this.ybase === this.ydisp && this.ydisp++,
                                        this.ybase++);
                                    this.savedY = Math.min(this.savedY + F, this.ybase + e - 1)
                                }
                            }
                        }
                        if (0 < m.length) {
                            b = [];
                            f = [];
                            for (r = 0; r < this.lines.length; r++)
                                f.push(this.lines.get(r));
                            e = this.lines.length;
                            w = e - 1;
                            z = 0;
                            F = m[z];
                            this.lines.length = Math.min(this.lines.maxLength, this.lines.length + u);
                            B = 0;
                            for (r = Math.min(this.lines.maxLength - 1, e + u - 1); 0 <= r; r--)
                                if (F && F.start > w + B) {
                                    for (J = F.newLines.length - 1; 0 <= J; J--)
                                        this.lines.set(r--, F.newLines[J]);
                                    r++;
                                    b.push({
                                        index: w + 1,
                                        amount: F.newLines.length
                                    });
                                    B += F.newLines.length;
                                    F = m[++z]
                                } else
                                    this.lines.set(r, f[w--]);
                            m = 0;
                            for (r = b.length - 1; 0 <= r; r--)
                                b[r].index += m,
                                this.lines.onInsertEmitter.fire(b[r]),
                                m += b[r].amount;
                            u = Math.max(0, e + u - this.lines.maxLength);
                            0 < u && this.lines.onTrimEmitter.fire(u)
                        }
                    }
                    ,
                    a.prototype.stringIndexToBufferIndex = function(b, e, f) {
                        for (void 0 === f && (f = !1); e; ) {
                            var m = this.lines.get(b);
                            if (!m)
                                return [-1, -1];
                            for (var u = f ? m.getTrimmedLength() : m.length, w = 0; w < u; ++w)
                                if (m.get(w)[t.CHAR_DATA_WIDTH_INDEX] && (e -= m.get(w)[t.CHAR_DATA_CHAR_INDEX].length || 1),
                                0 > e)
                                    return [b, w];
                            b++
                        }
                        return [b, 0]
                    }
                    ,
                    a.prototype.translateBufferLineToString = function(b, e, f, m) {
                        void 0 === f && (f = 0);
                        return (b = this.lines.get(b)) ? b.translateToString(e, f, m) : ""
                    }
                    ,
                    a.prototype.getWrappedRangeForLine = function(b) {
                        for (var e = b; 0 < e && this.lines.get(e).isWrapped; )
                            e--;
                        for (; b + 1 < this.lines.length && this.lines.get(b + 1).isWrapped; )
                            b++;
                        return {
                            first: e,
                            last: b
                        }
                    }
                    ,
                    a.prototype.setupTabStops = function(b) {
                        for (null != b ? this.tabs[b] || (b = this.prevStop(b)) : (this.tabs = {},
                        b = 0); b < this._cols; b += this._optionsService.rawOptions.tabStopWidth)
                            this.tabs[b] = !0
                    }
                    ,
                    a.prototype.prevStop = function(b) {
                        for (null == b && (b = this.x); !this.tabs[--b] && 0 < b; )
                            ;
                        return b >= this._cols ? this._cols - 1 : 0 > b ? 0 : b
                    }
                    ,
                    a.prototype.nextStop = function(b) {
                        for (null == b && (b = this.x); !this.tabs[++b] && b < this._cols; )
                            ;
                        return b >= this._cols ? this._cols - 1 : 0 > b ? 0 : b
                    }
                    ,
                    a.prototype.addMarker = function(b) {
                        var e = this
                          , f = new g.Marker(b);
                        return this.markers.push(f),
                        f.register(this.lines.onTrim(function(m) {
                            f.line -= m;
                            0 > f.line && f.dispose()
                        })),
                        f.register(this.lines.onInsert(function(m) {
                            f.line >= m.index && (f.line += m.amount)
                        })),
                        f.register(this.lines.onDelete(function(m) {
                            f.line >= m.index && f.line < m.index + m.amount && f.dispose();
                            f.line > m.index && (f.line -= m.amount)
                        })),
                        f.register(f.onDispose(function() {
                            return e._removeMarker(f)
                        })),
                        f
                    }
                    ,
                    a.prototype._removeMarker = function(b) {
                        this.markers.splice(this.markers.indexOf(b), 1)
                    }
                    ,
                    a.prototype.iterator = function(b, e, f, m, u) {
                        return new c(this,b,e,f,m,u)
                    }
                    ,
                    a
                }();
                l.Buffer = A;
                var c = function() {
                    function a(b, e, f, m, u, w) {
                        void 0 === f && (f = 0);
                        void 0 === m && (m = b.lines.length);
                        void 0 === u && (u = 0);
                        void 0 === w && (w = 0);
                        this._buffer = b;
                        this._trimRight = e;
                        this._startIndex = f;
                        this._endIndex = m;
                        this._startOverscan = u;
                        this._endOverscan = w;
                        0 > this._startIndex && (this._startIndex = 0);
                        this._endIndex > this._buffer.lines.length && (this._endIndex = this._buffer.lines.length);
                        this._current = this._startIndex
                    }
                    return a.prototype.hasNext = function() {
                        return this._current < this._endIndex
                    }
                    ,
                    a.prototype.next = function() {
                        var b = this._buffer.getWrappedRangeForLine(this._current);
                        b.first < this._startIndex - this._startOverscan && (b.first = this._startIndex - this._startOverscan);
                        b.last > this._endIndex + this._endOverscan && (b.last = this._endIndex + this._endOverscan);
                        b.first = Math.max(b.first, 0);
                        b.last = Math.min(b.last, this._buffer.lines.length);
                        for (var e = "", f = b.first; f <= b.last; ++f)
                            e += this._buffer.translateBufferLineToString(f, this._trimRight);
                        return this._current = b.last + 1,
                        {
                            range: b,
                            content: e
                        }
                    }
                    ,
                    a
                }();
                l.BufferStringIterator = c
            }
            ,
            8437: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferLine = l.DEFAULT_ATTR_DATA = void 0;
                var h = q(482)
                  , v = q(643)
                  , p = q(511)
                  , t = q(3734);
                l.DEFAULT_ATTR_DATA = Object.freeze(new t.AttributeData);
                A = function() {
                    function n(g, k, d) {
                        void 0 === d && (d = !1);
                        this.isWrapped = d;
                        this._combined = {};
                        this._extendedAttrs = {};
                        this._data = new Uint32Array(3 * g);
                        k = k || p.CellData.fromCharData([0, v.NULL_CELL_CHAR, v.NULL_CELL_WIDTH, v.NULL_CELL_CODE]);
                        for (d = 0; d < g; ++d)
                            this.setCell(d, k);
                        this.length = g
                    }
                    return n.prototype.get = function(g) {
                        var k = this._data[3 * g]
                          , d = 2097151 & k;
                        return [this._data[3 * g + 1], 2097152 & k ? this._combined[g] : d ? (0,
                        h.stringFromCodePoint)(d) : "", k >> 22, 2097152 & k ? this._combined[g].charCodeAt(this._combined[g].length - 1) : d]
                    }
                    ,
                    n.prototype.set = function(g, k) {
                        this._data[3 * g + 1] = k[v.CHAR_DATA_ATTR_INDEX];
                        1 < k[v.CHAR_DATA_CHAR_INDEX].length ? (this._combined[g] = k[1],
                        this._data[3 * g] = 2097152 | g | k[v.CHAR_DATA_WIDTH_INDEX] << 22) : this._data[3 * g] = k[v.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | k[v.CHAR_DATA_WIDTH_INDEX] << 22
                    }
                    ,
                    n.prototype.getWidth = function(g) {
                        return this._data[3 * g] >> 22
                    }
                    ,
                    n.prototype.hasWidth = function(g) {
                        return 12582912 & this._data[3 * g]
                    }
                    ,
                    n.prototype.getFg = function(g) {
                        return this._data[3 * g + 1]
                    }
                    ,
                    n.prototype.getBg = function(g) {
                        return this._data[3 * g + 2]
                    }
                    ,
                    n.prototype.hasContent = function(g) {
                        return 4194303 & this._data[3 * g]
                    }
                    ,
                    n.prototype.getCodePoint = function(g) {
                        var k = this._data[3 * g];
                        return 2097152 & k ? this._combined[g].charCodeAt(this._combined[g].length - 1) : 2097151 & k
                    }
                    ,
                    n.prototype.isCombined = function(g) {
                        return 2097152 & this._data[3 * g]
                    }
                    ,
                    n.prototype.getString = function(g) {
                        var k = this._data[3 * g];
                        return 2097152 & k ? this._combined[g] : 2097151 & k ? (0,
                        h.stringFromCodePoint)(2097151 & k) : ""
                    }
                    ,
                    n.prototype.loadCell = function(g, k) {
                        var d = 3 * g;
                        return k.content = this._data[d + 0],
                        k.fg = this._data[d + 1],
                        k.bg = this._data[d + 2],
                        2097152 & k.content && (k.combinedData = this._combined[g]),
                        268435456 & k.bg && (k.extended = this._extendedAttrs[g]),
                        k
                    }
                    ,
                    n.prototype.setCell = function(g, k) {
                        2097152 & k.content && (this._combined[g] = k.combinedData);
                        268435456 & k.bg && (this._extendedAttrs[g] = k.extended);
                        this._data[3 * g] = k.content;
                        this._data[3 * g + 1] = k.fg;
                        this._data[3 * g + 2] = k.bg
                    }
                    ,
                    n.prototype.setCellFromCodePoint = function(g, k, d, c, a, b) {
                        268435456 & a && (this._extendedAttrs[g] = b);
                        this._data[3 * g] = k | d << 22;
                        this._data[3 * g + 1] = c;
                        this._data[3 * g + 2] = a
                    }
                    ,
                    n.prototype.addCodepointToCell = function(g, k) {
                        var d = this._data[3 * g];
                        2097152 & d ? this._combined[g] += (0,
                        h.stringFromCodePoint)(k) : (2097151 & d ? (this._combined[g] = (0,
                        h.stringFromCodePoint)(2097151 & d) + (0,
                        h.stringFromCodePoint)(k),
                        d &= -2097152,
                        d |= 2097152) : d = k | 4194304,
                        this._data[3 * g] = d)
                    }
                    ,
                    n.prototype.insertCells = function(g, k, d, c) {
                        if ((g %= this.length) && 2 === this.getWidth(g - 1) && this.setCellFromCodePoint(g - 1, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs),
                        k < this.length - g) {
                            for (var a = new p.CellData, b = this.length - g - k - 1; 0 <= b; --b)
                                this.setCell(g + k + b, this.loadCell(g + b, a));
                            for (b = 0; b < k; ++b)
                                this.setCell(g + b, d)
                        } else
                            for (b = g; b < this.length; ++b)
                                this.setCell(b, d);
                        2 === this.getWidth(this.length - 1) && this.setCellFromCodePoint(this.length - 1, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs)
                    }
                    ,
                    n.prototype.deleteCells = function(g, k, d, c) {
                        if (g %= this.length,
                        k < this.length - g) {
                            for (var a = new p.CellData, b = 0; b < this.length - g - k; ++b)
                                this.setCell(g + b, this.loadCell(g + k + b, a));
                            b = this.length - k
                        } else
                            b = g;
                        for (; b < this.length; ++b)
                            this.setCell(b, d);
                        g && 2 === this.getWidth(g - 1) && this.setCellFromCodePoint(g - 1, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs);
                        0 !== this.getWidth(g) || this.hasContent(g) || this.setCellFromCodePoint(g, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs)
                    }
                    ,
                    n.prototype.replaceCells = function(g, k, d, c) {
                        g && 2 === this.getWidth(g - 1) && this.setCellFromCodePoint(g - 1, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs);
                        for (k < this.length && 2 === this.getWidth(k - 1) && this.setCellFromCodePoint(k, 0, 1, (null == c ? void 0 : c.fg) || 0, (null == c ? void 0 : c.bg) || 0, (null == c ? void 0 : c.extended) || new t.ExtendedAttrs); g < k && g < this.length; )
                            this.setCell(g++, d)
                    }
                    ,
                    n.prototype.resize = function(g, k) {
                        if (g !== this.length) {
                            if (g > this.length) {
                                var d = new Uint32Array(3 * g);
                                this.length && (3 * g < this._data.length ? d.set(this._data.subarray(0, 3 * g)) : d.set(this._data));
                                this._data = d;
                                for (d = this.length; d < g; ++d)
                                    this.setCell(d, k)
                            } else if (g)
                                for ((d = new Uint32Array(3 * g)).set(this._data.subarray(0, 3 * g)),
                                this._data = d,
                                k = Object.keys(this._combined),
                                d = 0; d < k.length; d++) {
                                    var c = parseInt(k[d], 10);
                                    c >= g && delete this._combined[c]
                                }
                            else
                                this._data = new Uint32Array(0),
                                this._combined = {};
                            this.length = g
                        }
                    }
                    ,
                    n.prototype.fill = function(g) {
                        this._combined = {};
                        this._extendedAttrs = {};
                        for (var k = 0; k < this.length; ++k)
                            this.setCell(k, g)
                    }
                    ,
                    n.prototype.copyFrom = function(g) {
                        for (var k in this.length !== g.length ? this._data = new Uint32Array(g._data) : this._data.set(g._data),
                        this.length = g.length,
                        this._combined = {},
                        g._combined)
                            this._combined[k] = g._combined[k];
                        for (k in this._extendedAttrs = {},
                        g._extendedAttrs)
                            this._extendedAttrs[k] = g._extendedAttrs[k];
                        this.isWrapped = g.isWrapped
                    }
                    ,
                    n.prototype.clone = function() {
                        var g = new n(0), k;
                        for (k in g._data = new Uint32Array(this._data),
                        g.length = this.length,
                        this._combined)
                            g._combined[k] = this._combined[k];
                        for (k in this._extendedAttrs)
                            g._extendedAttrs[k] = this._extendedAttrs[k];
                        return g.isWrapped = this.isWrapped,
                        g
                    }
                    ,
                    n.prototype.getTrimmedLength = function() {
                        for (var g = this.length - 1; 0 <= g; --g)
                            if (4194303 & this._data[3 * g])
                                return g + (this._data[3 * g] >> 22);
                        return 0
                    }
                    ,
                    n.prototype.copyCellsFrom = function(g, k, d, c, a) {
                        var b = g._data;
                        if (a)
                            for (var e = c - 1; 0 <= e; e--)
                                for (a = 0; 3 > a; a++)
                                    this._data[3 * (d + e) + a] = b[3 * (k + e) + a];
                        else
                            for (e = 0; e < c; e++)
                                for (a = 0; 3 > a; a++)
                                    this._data[3 * (d + e) + a] = b[3 * (k + e) + a];
                        c = Object.keys(g._combined);
                        for (a = 0; a < c.length; a++)
                            b = parseInt(c[a], 10),
                            b >= k && (this._combined[b - k + d] = g._combined[b])
                    }
                    ,
                    n.prototype.translateToString = function(g, k, d) {
                        void 0 === g && (g = !1);
                        void 0 === k && (k = 0);
                        void 0 === d && (d = this.length);
                        g && (d = Math.min(d, this.getTrimmedLength()));
                        for (g = ""; k < d; ) {
                            var c = this._data[3 * k]
                              , a = 2097151 & c;
                            g += 2097152 & c ? this._combined[k] : a ? (0,
                            h.stringFromCodePoint)(a) : v.WHITESPACE_CELL_CHAR;
                            k += c >> 22 || 1
                        }
                        return g
                    }
                    ,
                    n
                }();
                l.BufferLine = A
            }
            ,
            4841: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.getRangeLength = void 0;
                l.getRangeLength = function(q, h) {
                    if (q.start.y > q.end.y)
                        throw Error("Buffer range end (" + q.end.x + ", " + q.end.y + ") cannot be before start (" + q.start.x + ", " + q.start.y + ")");
                    return h * (q.end.y - q.start.y) + (q.end.x - q.start.x + 1)
                }
            }
            ,
            4634: (A, l) => {
                function q(h, v, p) {
                    if (v === h.length - 1)
                        return h[v].getTrimmedLength();
                    var t = !h[v].hasContent(p - 1) && 1 === h[v].getWidth(p - 1);
                    h = 2 === h[v + 1].getWidth(0);
                    return t && h ? p - 1 : p
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.getWrappedLineTrimmedLength = l.reflowSmallerGetNewLineLengths = l.reflowLargerApplyNewLayout = l.reflowLargerCreateNewLayout = l.reflowLargerGetLinesToRemove = void 0;
                l.reflowLargerGetLinesToRemove = function(h, v, p, t, n) {
                    for (var g = [], k = 0; k < h.length - 1; k++) {
                        var d = k
                          , c = h.get(++d);
                        if (c.isWrapped) {
                            for (var a = [h.get(k)]; d < h.length && c.isWrapped; )
                                a.push(c),
                                c = h.get(++d);
                            if (!(t >= k && t < d)) {
                                d = 0;
                                c = q(a, d, v);
                                for (var b = 1, e = 0; b < a.length; ) {
                                    var f = q(a, b, v)
                                      , m = Math.min(f - e, p - c);
                                    a[d].copyCellsFrom(a[b], e, c, m, !1);
                                    (c += m) === p && (d++,
                                    c = 0);
                                    (e += m) === f && (b++,
                                    e = 0);
                                    0 === c && 0 !== d && 2 === a[d - 1].getWidth(p - 1) && (a[d].copyCellsFrom(a[d - 1], p - 1, c++, 1, !1),
                                    a[d - 1].setCell(p - 1, n))
                                }
                                a[d].replaceCells(c, p, n);
                                c = 0;
                                for (b = a.length - 1; 0 < b && (b > d || 0 === a[b].getTrimmedLength()); b--)
                                    c++;
                                0 < c && (g.push(k + a.length - c),
                                g.push(c))
                            }
                            k += a.length - 1
                        }
                    }
                    return g
                }
                ;
                l.reflowLargerCreateNewLayout = function(h, v) {
                    for (var p = [], t = 0, n = v[t], g = 0, k = 0; k < h.length; k++)
                        n === k ? (n = v[++t],
                        h.onDeleteEmitter.fire({
                            index: k - g,
                            amount: n
                        }),
                        k += n - 1,
                        g += n,
                        n = v[++t]) : p.push(k);
                    return {
                        layout: p,
                        countRemoved: g
                    }
                }
                ;
                l.reflowLargerApplyNewLayout = function(h, v) {
                    for (var p = [], t = 0; t < v.length; t++)
                        p.push(h.get(v[t]));
                    for (t = 0; t < p.length; t++)
                        h.set(t, p[t]);
                    h.length = v.length
                }
                ;
                l.reflowSmallerGetNewLineLengths = function(h, v, p) {
                    for (var t = [], n = h.map(function(a, b) {
                        return q(h, b, v)
                    }).reduce(function(a, b) {
                        return a + b
                    }), g = 0, k = 0, d = 0; d < n; ) {
                        if (n - d < p) {
                            t.push(n - d);
                            break
                        }
                        g += p;
                        var c = q(h, k, v);
                        g > c && (g -= c,
                        k++);
                        (c = 2 === h[k].getWidth(g - 1)) && g--;
                        c = c ? p - 1 : p;
                        t.push(c);
                        d += c
                    }
                    return t
                }
                ;
                l.getWrappedLineTrimmedLength = q
            }
            ,
            5295: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(n, g) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(k, d) {
                        k.__proto__ = d
                    }
                    || function(k, d) {
                        for (var c in d)
                            Object.prototype.hasOwnProperty.call(d, c) && (k[c] = d[c])
                    }
                    ,
                    h(n, g)
                }
                ,
                function(n, g) {
                    function k() {
                        this.constructor = n
                    }
                    if ("function" != typeof g && null !== g)
                        throw new TypeError("Class extends value " + String(g) + " is not a constructor or null");
                    h(n, g);
                    n.prototype = null === g ? Object.create(g) : (k.prototype = g.prototype,
                    new k)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferSet = void 0;
                var p = q(9092)
                  , t = q(8460);
                A = function(n) {
                    function g(k, d) {
                        var c = n.call(this) || this;
                        return c._optionsService = k,
                        c._bufferService = d,
                        c._onBufferActivate = c.register(new t.EventEmitter),
                        c.reset(),
                        c
                    }
                    return v(g, n),
                    Object.defineProperty(g.prototype, "onBufferActivate", {
                        get: function() {
                            return this._onBufferActivate.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    g.prototype.reset = function() {
                        this._normal = new p.Buffer(!0,this._optionsService,this._bufferService);
                        this._normal.fillViewportRows();
                        this._alt = new p.Buffer(!1,this._optionsService,this._bufferService);
                        this._activeBuffer = this._normal;
                        this._onBufferActivate.fire({
                            activeBuffer: this._normal,
                            inactiveBuffer: this._alt
                        });
                        this.setupTabStops()
                    }
                    ,
                    Object.defineProperty(g.prototype, "alt", {
                        get: function() {
                            return this._alt
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(g.prototype, "active", {
                        get: function() {
                            return this._activeBuffer
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(g.prototype, "normal", {
                        get: function() {
                            return this._normal
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    g.prototype.activateNormalBuffer = function() {
                        this._activeBuffer !== this._normal && (this._normal.x = this._alt.x,
                        this._normal.y = this._alt.y,
                        this._alt.clear(),
                        this._activeBuffer = this._normal,
                        this._onBufferActivate.fire({
                            activeBuffer: this._normal,
                            inactiveBuffer: this._alt
                        }))
                    }
                    ,
                    g.prototype.activateAltBuffer = function(k) {
                        this._activeBuffer !== this._alt && (this._alt.fillViewportRows(k),
                        this._alt.x = this._normal.x,
                        this._alt.y = this._normal.y,
                        this._activeBuffer = this._alt,
                        this._onBufferActivate.fire({
                            activeBuffer: this._alt,
                            inactiveBuffer: this._normal
                        }))
                    }
                    ,
                    g.prototype.resize = function(k, d) {
                        this._normal.resize(k, d);
                        this._alt.resize(k, d)
                    }
                    ,
                    g.prototype.setupTabStops = function(k) {
                        this._normal.setupTabStops(k);
                        this._alt.setupTabStops(k)
                    }
                    ,
                    g
                }(q(844).Disposable);
                l.BufferSet = A
            },
            511: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(g, k) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(d, c) {
                        d.__proto__ = c
                    }
                    || function(d, c) {
                        for (var a in c)
                            Object.prototype.hasOwnProperty.call(c, a) && (d[a] = c[a])
                    }
                    ,
                    h(g, k)
                }
                ,
                function(g, k) {
                    function d() {
                        this.constructor = g
                    }
                    if ("function" != typeof k && null !== k)
                        throw new TypeError("Class extends value " + String(k) + " is not a constructor or null");
                    h(g, k);
                    g.prototype = null === k ? Object.create(k) : (d.prototype = k.prototype,
                    new d)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CellData = void 0;
                var p = q(482)
                  , t = q(643)
                  , n = q(3734);
                A = function(g) {
                    function k() {
                        var d = null !== g && g.apply(this, arguments) || this;
                        return d.content = 0,
                        d.fg = 0,
                        d.bg = 0,
                        d.extended = new n.ExtendedAttrs,
                        d.combinedData = "",
                        d
                    }
                    return v(k, g),
                    k.fromCharData = function(d) {
                        var c = new k;
                        return c.setFromCharData(d),
                        c
                    }
                    ,
                    k.prototype.isCombined = function() {
                        return 2097152 & this.content
                    }
                    ,
                    k.prototype.getWidth = function() {
                        return this.content >> 22
                    }
                    ,
                    k.prototype.getChars = function() {
                        return 2097152 & this.content ? this.combinedData : 2097151 & this.content ? (0,
                        p.stringFromCodePoint)(2097151 & this.content) : ""
                    }
                    ,
                    k.prototype.getCode = function() {
                        return this.isCombined() ? this.combinedData.charCodeAt(this.combinedData.length - 1) : 2097151 & this.content
                    }
                    ,
                    k.prototype.setFromCharData = function(d) {
                        this.fg = d[t.CHAR_DATA_ATTR_INDEX];
                        this.bg = 0;
                        var c = !1;
                        if (2 < d[t.CHAR_DATA_CHAR_INDEX].length)
                            c = !0;
                        else if (2 === d[t.CHAR_DATA_CHAR_INDEX].length) {
                            var a = d[t.CHAR_DATA_CHAR_INDEX].charCodeAt(0);
                            if (55296 <= a && 56319 >= a) {
                                var b = d[t.CHAR_DATA_CHAR_INDEX].charCodeAt(1);
                                56320 <= b && 57343 >= b ? this.content = 1024 * (a - 55296) + b - 56320 + 65536 | d[t.CHAR_DATA_WIDTH_INDEX] << 22 : c = !0
                            } else
                                c = !0
                        } else
                            this.content = d[t.CHAR_DATA_CHAR_INDEX].charCodeAt(0) | d[t.CHAR_DATA_WIDTH_INDEX] << 22;
                        c && (this.combinedData = d[t.CHAR_DATA_CHAR_INDEX],
                        this.content = 2097152 | d[t.CHAR_DATA_WIDTH_INDEX] << 22)
                    }
                    ,
                    k.prototype.getAsCharData = function() {
                        return [this.fg, this.getChars(), this.getWidth(), this.getCode()]
                    }
                    ,
                    k
                }(n.AttributeData);
                l.CellData = A
            },
            643: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.DEFAULT_COLOR = 256;
                l.DEFAULT_ATTR = 256 | l.DEFAULT_COLOR << 9;
                l.CHAR_DATA_ATTR_INDEX = 0;
                l.CHAR_DATA_CHAR_INDEX = 1;
                l.CHAR_DATA_WIDTH_INDEX = 2;
                l.CHAR_DATA_CODE_INDEX = 3;
                l.NULL_CELL_CHAR = "";
                l.NULL_CELL_WIDTH = 1;
                l.NULL_CELL_CODE = 0;
                l.WHITESPACE_CELL_CHAR = " ";
                l.WHITESPACE_CELL_WIDTH = 1;
                l.WHITESPACE_CELL_CODE = 32
            }
            ,
            4863: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(t, n) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(g, k) {
                        g.__proto__ = k
                    }
                    || function(g, k) {
                        for (var d in k)
                            Object.prototype.hasOwnProperty.call(k, d) && (g[d] = k[d])
                    }
                    ,
                    h(t, n)
                }
                ,
                function(t, n) {
                    function g() {
                        this.constructor = t
                    }
                    if ("function" != typeof n && null !== n)
                        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
                    h(t, n);
                    t.prototype = null === n ? Object.create(n) : (g.prototype = n.prototype,
                    new g)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Marker = void 0;
                var p = q(8460);
                A = function(t) {
                    function n(g) {
                        var k = t.call(this) || this;
                        return k.line = g,
                        k._id = n._nextId++,
                        k.isDisposed = !1,
                        k._onDispose = new p.EventEmitter,
                        k
                    }
                    return v(n, t),
                    Object.defineProperty(n.prototype, "id", {
                        get: function() {
                            return this._id
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(n.prototype, "onDispose", {
                        get: function() {
                            return this._onDispose.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    n.prototype.dispose = function() {
                        this.isDisposed || (this.isDisposed = !0,
                        this.line = -1,
                        this._onDispose.fire(),
                        t.prototype.dispose.call(this))
                    }
                    ,
                    n._nextId = 1,
                    n
                }(q(844).Disposable);
                l.Marker = A
            },
            7116: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CHARSETS = {};
                l.DEFAULT_CHARSET = l.CHARSETS.B;
                l.CHARSETS[0] = {
                    "`": "\u25c6",
                    a: "\u2592",
                    b: "\u2409",
                    c: "\u240c",
                    d: "\u240d",
                    e: "\u240a",
                    f: "\u00b0",
                    g: "\u00b1",
                    h: "\u2424",
                    i: "\u240b",
                    j: "\u2518",
                    k: "\u2510",
                    l: "\u250c",
                    m: "\u2514",
                    n: "\u253c",
                    o: "\u23ba",
                    p: "\u23bb",
                    q: "\u2500",
                    r: "\u23bc",
                    s: "\u23bd",
                    t: "\u251c",
                    u: "\u2524",
                    v: "\u2534",
                    w: "\u252c",
                    x: "\u2502",
                    y: "\u2264",
                    z: "\u2265",
                    "{": "\u03c0",
                    "|": "\u2260",
                    "}": "\u00a3",
                    "~": "\u00b7"
                };
                l.CHARSETS.A = {
                    "#": "\u00a3"
                };
                l.CHARSETS.B = void 0;
                l.CHARSETS[4] = {
                    "#": "\u00a3",
                    "@": "\u00be",
                    "[": "ij",
                    "\\": "\u00bd",
                    "]": "|",
                    "{": "\u00a8",
                    "|": "f",
                    "}": "\u00bc",
                    "~": "\u00b4"
                };
                l.CHARSETS.C = l.CHARSETS[5] = {
                    "[": "\u00c4",
                    "\\": "\u00d6",
                    "]": "\u00c5",
                    "^": "\u00dc",
                    "`": "\u00e9",
                    "{": "\u00e4",
                    "|": "\u00f6",
                    "}": "\u00e5",
                    "~": "\u00fc"
                };
                l.CHARSETS.R = {
                    "#": "\u00a3",
                    "@": "\u00e0",
                    "[": "\u00b0",
                    "\\": "\u00e7",
                    "]": "\u00a7",
                    "{": "\u00e9",
                    "|": "\u00f9",
                    "}": "\u00e8",
                    "~": "\u00a8"
                };
                l.CHARSETS.Q = {
                    "@": "\u00e0",
                    "[": "\u00e2",
                    "\\": "\u00e7",
                    "]": "\u00ea",
                    "^": "\u00ee",
                    "`": "\u00f4",
                    "{": "\u00e9",
                    "|": "\u00f9",
                    "}": "\u00e8",
                    "~": "\u00fb"
                };
                l.CHARSETS.K = {
                    "@": "\u00a7",
                    "[": "\u00c4",
                    "\\": "\u00d6",
                    "]": "\u00dc",
                    "{": "\u00e4",
                    "|": "\u00f6",
                    "}": "\u00fc",
                    "~": "\u00df"
                };
                l.CHARSETS.Y = {
                    "#": "\u00a3",
                    "@": "\u00a7",
                    "[": "\u00b0",
                    "\\": "\u00e7",
                    "]": "\u00e9",
                    "`": "\u00f9",
                    "{": "\u00e0",
                    "|": "\u00f2",
                    "}": "\u00e8",
                    "~": "\u00ec"
                };
                l.CHARSETS.E = l.CHARSETS[6] = {
                    "@": "\u00c4",
                    "[": "\u00c6",
                    "\\": "\u00d8",
                    "]": "\u00c5",
                    "^": "\u00dc",
                    "`": "\u00e4",
                    "{": "\u00e6",
                    "|": "\u00f8",
                    "}": "\u00e5",
                    "~": "\u00fc"
                };
                l.CHARSETS.Z = {
                    "#": "\u00a3",
                    "@": "\u00a7",
                    "[": "\u00a1",
                    "\\": "\u00d1",
                    "]": "\u00bf",
                    "{": "\u00b0",
                    "|": "\u00f1",
                    "}": "\u00e7"
                };
                l.CHARSETS.H = l.CHARSETS[7] = {
                    "@": "\u00c9",
                    "[": "\u00c4",
                    "\\": "\u00d6",
                    "]": "\u00c5",
                    "^": "\u00dc",
                    "`": "\u00e9",
                    "{": "\u00e4",
                    "|": "\u00f6",
                    "}": "\u00e5",
                    "~": "\u00fc"
                };
                l.CHARSETS["="] = {
                    "#": "\u00f9",
                    "@": "\u00e0",
                    "[": "\u00e9",
                    "\\": "\u00e7",
                    "]": "\u00ea",
                    "^": "\u00ee",
                    _: "\u00e8",
                    "`": "\u00f4",
                    "{": "\u00e4",
                    "|": "\u00f6",
                    "}": "\u00fc",
                    "~": "\u00fb"
                }
            }
            ,
            2584: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.C1 = l.C0 = void 0;
                (A = l.C0 || (l.C0 = {})).NUL = "\x00";
                A.SOH = "\u0001";
                A.STX = "\u0002";
                A.ETX = "\u0003";
                A.EOT = "\u0004";
                A.ENQ = "\u0005";
                A.ACK = "\u0006";
                A.BEL = "\u0007";
                A.BS = "\b";
                A.HT = "\t";
                A.LF = "\n";
                A.VT = "\v";
                A.FF = "\f";
                A.CR = "\r";
                A.SO = "\u000e";
                A.SI = "\u000f";
                A.DLE = "\u0010";
                A.DC1 = "\u0011";
                A.DC2 = "\u0012";
                A.DC3 = "\u0013";
                A.DC4 = "\u0014";
                A.NAK = "\u0015";
                A.SYN = "\u0016";
                A.ETB = "\u0017";
                A.CAN = "\u0018";
                A.EM = "\u0019";
                A.SUB = "\u001a";
                A.ESC = "\u001b";
                A.FS = "\u001c";
                A.GS = "\u001d";
                A.RS = "\u001e";
                A.US = "\u001f";
                A.SP = " ";
                A.DEL = "\u007f";
                (l = l.C1 || (l.C1 = {})).PAD = "\u0080";
                l.HOP = "\u0081";
                l.BPH = "\u0082";
                l.NBH = "\u0083";
                l.IND = "\u0084";
                l.NEL = "\u0085";
                l.SSA = "\u0086";
                l.ESA = "\u0087";
                l.HTS = "\u0088";
                l.HTJ = "\u0089";
                l.VTS = "\u008a";
                l.PLD = "\u008b";
                l.PLU = "\u008c";
                l.RI = "\u008d";
                l.SS2 = "\u008e";
                l.SS3 = "\u008f";
                l.DCS = "\u0090";
                l.PU1 = "\u0091";
                l.PU2 = "\u0092";
                l.STS = "\u0093";
                l.CCH = "\u0094";
                l.MW = "\u0095";
                l.SPA = "\u0096";
                l.EPA = "\u0097";
                l.SOS = "\u0098";
                l.SGCI = "\u0099";
                l.SCI = "\u009a";
                l.CSI = "\u009b";
                l.ST = "\u009c";
                l.OSC = "\u009d";
                l.PM = "\u009e";
                l.APC = "\u009f"
            }
            ,
            7399: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.evaluateKeyboardEvent = void 0;
                var h = q(2584)
                  , v = {
                    48: ["0", ")"],
                    49: ["1", "!"],
                    50: ["2", "@"],
                    51: ["3", "#"],
                    52: ["4", "$"],
                    53: ["5", "%"],
                    54: ["6", "^"],
                    55: ["7", "&"],
                    56: ["8", "*"],
                    57: ["9", "("],
                    186: [";", ":"],
                    187: ["=", "+"],
                    188: [",", "<"],
                    189: ["-", "_"],
                    190: [".", ">"],
                    191: ["/", "?"],
                    192: ["`", "~"],
                    219: ["[", "{"],
                    220: ["\\", "|"],
                    221: ["]", "}"],
                    222: ["'", '"']
                };
                l.evaluateKeyboardEvent = function(p, t, n, g) {
                    var k = {
                        type: 0,
                        cancel: !1,
                        key: void 0
                    }
                      , d = (p.shiftKey ? 1 : 0) | (p.altKey ? 2 : 0) | (p.ctrlKey ? 4 : 0) | (p.metaKey ? 8 : 0);
                    switch (p.keyCode) {
                    case 0:
                        "UIKeyInputUpArrow" === p.key ? k.key = t ? h.C0.ESC + "OA" : h.C0.ESC + "[A" : "UIKeyInputLeftArrow" === p.key ? k.key = t ? h.C0.ESC + "OD" : h.C0.ESC + "[D" : "UIKeyInputRightArrow" === p.key ? k.key = t ? h.C0.ESC + "OC" : h.C0.ESC + "[C" : "UIKeyInputDownArrow" === p.key && (k.key = t ? h.C0.ESC + "OB" : h.C0.ESC + "[B");
                        break;
                    case 8:
                        if (p.shiftKey) {
                            k.key = h.C0.BS;
                            break
                        }
                        if (p.altKey) {
                            k.key = h.C0.ESC + h.C0.DEL;
                            break
                        }
                        k.key = h.C0.DEL;
                        break;
                    case 9:
                        if (p.shiftKey) {
                            k.key = h.C0.ESC + "[Z";
                            break
                        }
                        k.key = h.C0.HT;
                        k.cancel = !0;
                        break;
                    case 13:
                        k.key = p.altKey ? h.C0.ESC + h.C0.CR : h.C0.CR;
                        k.cancel = !0;
                        break;
                    case 27:
                        k.key = h.C0.ESC;
                        p.altKey && (k.key = h.C0.ESC + h.C0.ESC);
                        k.cancel = !0;
                        break;
                    case 37:
                        if (p.metaKey)
                            break;
                        d ? (k.key = h.C0.ESC + "[1;" + (d + 1) + "D",
                        k.key === h.C0.ESC + "[1;3D" && (k.key = h.C0.ESC + (n ? "b" : "[1;5D"))) : k.key = t ? h.C0.ESC + "OD" : h.C0.ESC + "[D";
                        break;
                    case 39:
                        if (p.metaKey)
                            break;
                        d ? (k.key = h.C0.ESC + "[1;" + (d + 1) + "C",
                        k.key === h.C0.ESC + "[1;3C" && (k.key = h.C0.ESC + (n ? "f" : "[1;5C"))) : k.key = t ? h.C0.ESC + "OC" : h.C0.ESC + "[C";
                        break;
                    case 38:
                        if (p.metaKey)
                            break;
                        d ? (k.key = h.C0.ESC + "[1;" + (d + 1) + "A",
                        n || k.key !== h.C0.ESC + "[1;3A" || (k.key = h.C0.ESC + "[1;5A")) : k.key = t ? h.C0.ESC + "OA" : h.C0.ESC + "[A";
                        break;
                    case 40:
                        if (p.metaKey)
                            break;
                        d ? (k.key = h.C0.ESC + "[1;" + (d + 1) + "B",
                        n || k.key !== h.C0.ESC + "[1;3B" || (k.key = h.C0.ESC + "[1;5B")) : k.key = t ? h.C0.ESC + "OB" : h.C0.ESC + "[B";
                        break;
                    case 45:
                        p.shiftKey || p.ctrlKey || (k.key = h.C0.ESC + "[2~");
                        break;
                    case 46:
                        k.key = d ? h.C0.ESC + "[3;" + (d + 1) + "~" : h.C0.ESC + "[3~";
                        break;
                    case 36:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "H" : t ? h.C0.ESC + "OH" : h.C0.ESC + "[H";
                        break;
                    case 35:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "F" : t ? h.C0.ESC + "OF" : h.C0.ESC + "[F";
                        break;
                    case 33:
                        p.shiftKey ? k.type = 2 : k.key = h.C0.ESC + "[5~";
                        break;
                    case 34:
                        p.shiftKey ? k.type = 3 : k.key = h.C0.ESC + "[6~";
                        break;
                    case 112:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "P" : h.C0.ESC + "OP";
                        break;
                    case 113:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "Q" : h.C0.ESC + "OQ";
                        break;
                    case 114:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "R" : h.C0.ESC + "OR";
                        break;
                    case 115:
                        k.key = d ? h.C0.ESC + "[1;" + (d + 1) + "S" : h.C0.ESC + "OS";
                        break;
                    case 116:
                        k.key = d ? h.C0.ESC + "[15;" + (d + 1) + "~" : h.C0.ESC + "[15~";
                        break;
                    case 117:
                        k.key = d ? h.C0.ESC + "[17;" + (d + 1) + "~" : h.C0.ESC + "[17~";
                        break;
                    case 118:
                        k.key = d ? h.C0.ESC + "[18;" + (d + 1) + "~" : h.C0.ESC + "[18~";
                        break;
                    case 119:
                        k.key = d ? h.C0.ESC + "[19;" + (d + 1) + "~" : h.C0.ESC + "[19~";
                        break;
                    case 120:
                        k.key = d ? h.C0.ESC + "[20;" + (d + 1) + "~" : h.C0.ESC + "[20~";
                        break;
                    case 121:
                        k.key = d ? h.C0.ESC + "[21;" + (d + 1) + "~" : h.C0.ESC + "[21~";
                        break;
                    case 122:
                        k.key = d ? h.C0.ESC + "[23;" + (d + 1) + "~" : h.C0.ESC + "[23~";
                        break;
                    case 123:
                        k.key = d ? h.C0.ESC + "[24;" + (d + 1) + "~" : h.C0.ESC + "[24~";
                        break;
                    default:
                        !p.ctrlKey || p.shiftKey || p.altKey || p.metaKey ? n && !g || !p.altKey || p.metaKey ? !n || p.altKey || p.ctrlKey || p.shiftKey || !p.metaKey ? p.key && !p.ctrlKey && !p.altKey && !p.metaKey && 48 <= p.keyCode && 1 === p.key.length ? k.key = p.key : p.key && p.ctrlKey && "_" === p.key && (k.key = h.C0.US) : 65 === p.keyCode && (k.type = 1) : (t = v[p.keyCode],
                        (t = null == t ? void 0 : t[p.shiftKey ? 1 : 0]) ? k.key = h.C0.ESC + t : 65 <= p.keyCode && 90 >= p.keyCode && (k.key = h.C0.ESC + String.fromCharCode(p.ctrlKey ? p.keyCode - 64 : p.keyCode + 32))) : 65 <= p.keyCode && 90 >= p.keyCode ? k.key = String.fromCharCode(p.keyCode - 64) : 32 === p.keyCode ? k.key = h.C0.NUL : 51 <= p.keyCode && 55 >= p.keyCode ? k.key = String.fromCharCode(p.keyCode - 51 + 27) : 56 === p.keyCode ? k.key = h.C0.DEL : 219 === p.keyCode ? k.key = h.C0.ESC : 220 === p.keyCode ? k.key = h.C0.FS : 221 === p.keyCode && (k.key = h.C0.GS)
                    }
                    return k
                }
            }
            ,
            482: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Utf8ToUtf32 = l.StringToUtf32 = l.utf32ToString = l.stringFromCodePoint = void 0;
                l.stringFromCodePoint = function(q) {
                    return 65535 < q ? (q -= 65536,
                    String.fromCharCode(55296 + (q >> 10)) + String.fromCharCode(q % 1024 + 56320)) : String.fromCharCode(q)
                }
                ;
                l.utf32ToString = function(q, h, v) {
                    void 0 === h && (h = 0);
                    void 0 === v && (v = q.length);
                    for (var p = ""; h < v; ++h) {
                        var t = q[h];
                        65535 < t ? (t -= 65536,
                        p += String.fromCharCode(55296 + (t >> 10)) + String.fromCharCode(t % 1024 + 56320)) : p += String.fromCharCode(t)
                    }
                    return p
                }
                ;
                A = function() {
                    function q() {
                        this._interim = 0
                    }
                    return q.prototype.clear = function() {
                        this._interim = 0
                    }
                    ,
                    q.prototype.decode = function(h, v) {
                        var p = h.length;
                        if (!p)
                            return 0;
                        var t = 0
                          , n = 0;
                        for (this._interim && (56320 <= (k = h.charCodeAt(n++)) && 57343 >= k ? v[t++] = 1024 * (this._interim - 55296) + k - 56320 + 65536 : (v[t++] = this._interim,
                        v[t++] = k),
                        this._interim = 0); n < p; ++n) {
                            var g = h.charCodeAt(n);
                            if (55296 <= g && 56319 >= g) {
                                if (++n >= p)
                                    return this._interim = g,
                                    t;
                                var k;
                                56320 <= (k = h.charCodeAt(n)) && 57343 >= k ? v[t++] = 1024 * (g - 55296) + k - 56320 + 65536 : (v[t++] = g,
                                v[t++] = k)
                            } else
                                65279 !== g && (v[t++] = g)
                        }
                        return t
                    }
                    ,
                    q
                }();
                l.StringToUtf32 = A;
                A = function() {
                    function q() {
                        this.interim = new Uint8Array(3)
                    }
                    return q.prototype.clear = function() {
                        this.interim.fill(0)
                    }
                    ,
                    q.prototype.decode = function(h, v) {
                        var p = h.length;
                        if (!p)
                            return 0;
                        var t, n, g, k, d = 0, c = 0, a = 0;
                        if (this.interim[0]) {
                            var b = !1
                              , e = this.interim[0];
                            e &= 192 == (224 & e) ? 31 : 224 == (240 & e) ? 15 : 7;
                            for (var f = 0, m; (m = 63 & this.interim[++f]) && 4 > f; )
                                e <<= 6,
                                e |= m;
                            for (var u = 192 == (224 & this.interim[0]) ? 2 : 224 == (240 & this.interim[0]) ? 3 : 4, w = u - f; a < w; ) {
                                if (a >= p)
                                    return 0;
                                if (128 != (192 & (m = h[a++]))) {
                                    a--;
                                    b = !0;
                                    break
                                }
                                this.interim[f++] = m;
                                e <<= 6;
                                e |= 63 & m
                            }
                            b || (2 === u ? 128 > e ? a-- : v[d++] = e : 3 === u ? 2048 > e || 55296 <= e && 57343 >= e || 65279 === e || (v[d++] = e) : 65536 > e || 1114111 < e || (v[d++] = e));
                            this.interim.fill(0)
                        }
                        for (b = p - 4; a < p; ) {
                            for (; !(!(a < b) || 128 & (t = h[a]) || 128 & (n = h[a + 1]) || 128 & (g = h[a + 2]) || 128 & (k = h[a + 3])); )
                                v[d++] = t,
                                v[d++] = n,
                                v[d++] = g,
                                v[d++] = k,
                                a += 4;
                            if (128 > (t = h[a++]))
                                v[d++] = t;
                            else if (192 == (224 & t)) {
                                if (a >= p)
                                    return this.interim[0] = t,
                                    d;
                                128 != (192 & (n = h[a++])) ? a-- : 128 > (c = (31 & t) << 6 | 63 & n) ? a-- : v[d++] = c
                            } else if (224 == (240 & t)) {
                                if (a >= p)
                                    return this.interim[0] = t,
                                    d;
                                if (128 != (192 & (n = h[a++])))
                                    a--;
                                else {
                                    if (a >= p)
                                        return this.interim[0] = t,
                                        this.interim[1] = n,
                                        d;
                                    128 != (192 & (g = h[a++])) ? a-- : 2048 > (c = (15 & t) << 12 | (63 & n) << 6 | 63 & g) || 55296 <= c && 57343 >= c || 65279 === c || (v[d++] = c)
                                }
                            } else if (240 == (248 & t)) {
                                if (a >= p)
                                    return this.interim[0] = t,
                                    d;
                                if (128 != (192 & (n = h[a++])))
                                    a--;
                                else {
                                    if (a >= p)
                                        return this.interim[0] = t,
                                        this.interim[1] = n,
                                        d;
                                    if (128 != (192 & (g = h[a++])))
                                        a--;
                                    else {
                                        if (a >= p)
                                            return this.interim[0] = t,
                                            this.interim[1] = n,
                                            this.interim[2] = g,
                                            d;
                                        128 != (192 & (k = h[a++])) ? a-- : 65536 > (c = (7 & t) << 18 | (63 & n) << 12 | (63 & g) << 6 | 63 & k) || 1114111 < c || (v[d++] = c)
                                    }
                                }
                            }
                        }
                        return d
                    }
                    ,
                    q
                }();
                l.Utf8ToUtf32 = A
            }
            ,
            225: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.UnicodeV6 = void 0;
                var h, v = q(8273), p = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531]], t = [[68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
                A = function() {
                    function n() {
                        if (this.version = "6",
                        !h) {
                            h = new Uint8Array(65536);
                            (0,
                            v.fill)(h, 1);
                            h[0] = 0;
                            (0,
                            v.fill)(h, 0, 1, 32);
                            (0,
                            v.fill)(h, 0, 127, 160);
                            (0,
                            v.fill)(h, 2, 4352, 4448);
                            h[9001] = 2;
                            h[9002] = 2;
                            (0,
                            v.fill)(h, 2, 11904, 42192);
                            h[12351] = 1;
                            (0,
                            v.fill)(h, 2, 44032, 55204);
                            (0,
                            v.fill)(h, 2, 63744, 64256);
                            (0,
                            v.fill)(h, 2, 65040, 65050);
                            (0,
                            v.fill)(h, 2, 65072, 65136);
                            (0,
                            v.fill)(h, 2, 65280, 65377);
                            (0,
                            v.fill)(h, 2, 65504, 65511);
                            for (var g = 0; g < p.length; ++g)
                                (0,
                                v.fill)(h, 0, p[g][0], p[g][1] + 1)
                        }
                    }
                    return n.prototype.wcwidth = function(g) {
                        if (32 > g)
                            g = 0;
                        else if (127 > g)
                            g = 1;
                        else if (65536 > g)
                            g = h[g];
                        else {
                            var k;
                            a: {
                                var d = 0
                                  , c = t.length - 1;
                                if (!(g < t[0][0] || g > t[c][1]))
                                    for (; c >= d; )
                                        if (g > t[k = d + c >> 1][1])
                                            d = k + 1;
                                        else {
                                            if (!(g < t[k][0])) {
                                                k = !0;
                                                break a
                                            }
                                            c = k - 1
                                        }
                                k = !1
                            }
                            g = k ? 0 : 131072 <= g && 196605 >= g || 196608 <= g && 262141 >= g ? 2 : 1
                        }
                        return g
                    }
                    ,
                    n
                }();
                l.UnicodeV6 = A
            }
            ,
            5981: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.WriteBuffer = void 0;
                var q = "undefined" == typeof queueMicrotask ? function(h) {
                    Promise.resolve().then(h)
                }
                : queueMicrotask;
                A = function() {
                    function h(v) {
                        this._action = v;
                        this._writeBuffer = [];
                        this._callbacks = [];
                        this._bufferOffset = this._pendingData = 0;
                        this._isSyncWriting = !1;
                        this._syncCalls = 0
                    }
                    return h.prototype.writeSync = function(v, p) {
                        if (void 0 !== p && this._syncCalls > p)
                            this._syncCalls = 0;
                        else if (this._pendingData += v.length,
                        this._writeBuffer.push(v),
                        this._callbacks.push(void 0),
                        this._syncCalls++,
                        !this._isSyncWriting) {
                            for (this._isSyncWriting = !0; v = this._writeBuffer.shift(); )
                                this._action(v),
                                (v = this._callbacks.shift()) && v();
                            this._pendingData = 0;
                            this._bufferOffset = 2147483647;
                            this._isSyncWriting = !1;
                            this._syncCalls = 0
                        }
                    }
                    ,
                    h.prototype.write = function(v, p) {
                        var t = this;
                        if (5E7 < this._pendingData)
                            throw Error("write data discarded, use flow control to avoid losing data");
                        this._writeBuffer.length || (this._bufferOffset = 0,
                        setTimeout(function() {
                            return t._innerWrite()
                        }));
                        this._pendingData += v.length;
                        this._writeBuffer.push(v);
                        this._callbacks.push(p)
                    }
                    ,
                    h.prototype._innerWrite = function(v, p) {
                        var t = this;
                        void 0 === v && (v = 0);
                        void 0 === p && (p = !0);
                        for (var n = v || Date.now(); this._writeBuffer.length > this._bufferOffset; ) {
                            v = this._writeBuffer[this._bufferOffset];
                            var g = this._action(v, p);
                            if (g)
                                return void g.catch(function(k) {
                                    return q(function() {
                                        throw k;
                                    }),
                                    Promise.resolve(!1)
                                }).then(function(k) {
                                    return 12 <= Date.now() - n ? setTimeout(function() {
                                        return t._innerWrite(0, k)
                                    }) : t._innerWrite(n, k)
                                });
                            g = this._callbacks[this._bufferOffset];
                            if (g && g(),
                            this._bufferOffset++,
                            this._pendingData -= v.length,
                            12 <= Date.now() - n)
                                break
                        }
                        this._writeBuffer.length > this._bufferOffset ? (50 < this._bufferOffset && (this._writeBuffer = this._writeBuffer.slice(this._bufferOffset),
                        this._callbacks = this._callbacks.slice(this._bufferOffset),
                        this._bufferOffset = 0),
                        setTimeout(function() {
                            return t._innerWrite()
                        })) : (this._writeBuffer.length = 0,
                        this._callbacks.length = 0,
                        this._pendingData = 0,
                        this._bufferOffset = 0)
                    }
                    ,
                    h
                }();
                l.WriteBuffer = A
            }
            ,
            5941: (A, l) => {
                function q(p, t) {
                    p = p.toString(16);
                    var n = 2 > p.length ? "0" + p : p;
                    switch (t) {
                    case 4:
                        return p[0];
                    case 8:
                        return n;
                    case 12:
                        return (n + n).slice(0, 3);
                    default:
                        return n + n
                    }
                }
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.toRgbString = l.parseColor = void 0;
                var h = /^([\da-f]{1})\/([\da-f]{1})\/([\da-f]{1})$|^([\da-f]{2})\/([\da-f]{2})\/([\da-f]{2})$|^([\da-f]{3})\/([\da-f]{3})\/([\da-f]{3})$|^([\da-f]{4})\/([\da-f]{4})\/([\da-f]{4})$/
                  , v = /^[\da-f]+$/;
                l.parseColor = function(p) {
                    if (p)
                        if (p = p.toLowerCase(),
                        0 === p.indexOf("rgb:")) {
                            if (p = p.slice(4),
                            p = h.exec(p)) {
                                var t = p[1] ? 15 : p[4] ? 255 : p[7] ? 4095 : 65535;
                                return [Math.round(parseInt(p[1] || p[4] || p[7] || p[10], 16) / t * 255), Math.round(parseInt(p[2] || p[5] || p[8] || p[11], 16) / t * 255), Math.round(parseInt(p[3] || p[6] || p[9] || p[12], 16) / t * 255)]
                            }
                        } else if (0 === p.indexOf("#") && (p = p.slice(1),
                        v.exec(p) && [3, 6, 9, 12].includes(p.length))) {
                            t = p.length / 3;
                            for (var n = [0, 0, 0], g = 0; 3 > g; ++g) {
                                var k = parseInt(p.slice(t * g, t * g + t), 16);
                                n[g] = 1 === t ? k << 4 : 2 === t ? k : 3 === t ? k >> 4 : k >> 8
                            }
                            return n
                        }
                }
                ;
                l.toRgbString = function(p, t) {
                    void 0 === t && (t = 16);
                    var n = p[1]
                      , g = p[2];
                    return "rgb:" + q(p[0], t) + "/" + q(n, t) + "/" + q(g, t)
                }
            }
            ,
            5770: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.PAYLOAD_LIMIT = 1E7
            }
            ,
            6351: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.DcsHandler = l.DcsParser = void 0;
                var h = q(482);
                A = q(8742);
                var v = q(5770)
                  , p = [];
                q = function() {
                    function n() {
                        this._handlers = Object.create(null);
                        this._active = p;
                        this._ident = 0;
                        this._handlerFb = function() {}
                        ;
                        this._stack = {
                            paused: !1,
                            loopPosition: 0,
                            fallThrough: !1
                        }
                    }
                    return n.prototype.dispose = function() {
                        this._handlers = Object.create(null);
                        this._handlerFb = function() {}
                        ;
                        this._active = p
                    }
                    ,
                    n.prototype.registerHandler = function(g, k) {
                        void 0 === this._handlers[g] && (this._handlers[g] = []);
                        var d = this._handlers[g];
                        return d.push(k),
                        {
                            dispose: function() {
                                var c = d.indexOf(k);
                                -1 !== c && d.splice(c, 1)
                            }
                        }
                    }
                    ,
                    n.prototype.clearHandler = function(g) {
                        this._handlers[g] && delete this._handlers[g]
                    }
                    ,
                    n.prototype.setHandlerFallback = function(g) {
                        this._handlerFb = g
                    }
                    ,
                    n.prototype.reset = function() {
                        if (this._active.length)
                            for (var g = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; 0 <= g; --g)
                                this._active[g].unhook(!1);
                        this._stack.paused = !1;
                        this._active = p;
                        this._ident = 0
                    }
                    ,
                    n.prototype.hook = function(g, k) {
                        if (this.reset(),
                        this._ident = g,
                        this._active = this._handlers[g] || p,
                        this._active.length)
                            for (g = this._active.length - 1; 0 <= g; g--)
                                this._active[g].hook(k);
                        else
                            this._handlerFb(this._ident, "HOOK", k)
                    }
                    ,
                    n.prototype.put = function(g, k, d) {
                        if (this._active.length)
                            for (var c = this._active.length - 1; 0 <= c; c--)
                                this._active[c].put(g, k, d);
                        else
                            this._handlerFb(this._ident, "PUT", (0,
                            h.utf32ToString)(g, k, d))
                    }
                    ,
                    n.prototype.unhook = function(g, k) {
                        if (void 0 === k && (k = !0),
                        this._active.length) {
                            var d = !1
                              , c = this._active.length - 1
                              , a = !1;
                            if (this._stack.paused && (c = this._stack.loopPosition - 1,
                            d = k,
                            a = this._stack.fallThrough,
                            this._stack.paused = !1),
                            !a && !1 === d) {
                                for (; 0 <= c && !0 !== (d = this._active[c].unhook(g)); c--)
                                    if (d instanceof Promise)
                                        return this._stack.paused = !0,
                                        this._stack.loopPosition = c,
                                        this._stack.fallThrough = !1,
                                        d;
                                c--
                            }
                            for (; 0 <= c; c--)
                                if ((d = this._active[c].unhook(!1))instanceof Promise)
                                    return this._stack.paused = !0,
                                    this._stack.loopPosition = c,
                                    this._stack.fallThrough = !0,
                                    d
                        } else
                            this._handlerFb(this._ident, "UNHOOK", g);
                        this._active = p;
                        this._ident = 0
                    }
                    ,
                    n
                }();
                l.DcsParser = q;
                var t = new A.Params;
                t.addParam(0);
                q = function() {
                    function n(g) {
                        this._handler = g;
                        this._data = "";
                        this._params = t;
                        this._hitLimit = !1
                    }
                    return n.prototype.hook = function(g) {
                        this._params = 1 < g.length || g.params[0] ? g.clone() : t;
                        this._data = "";
                        this._hitLimit = !1
                    }
                    ,
                    n.prototype.put = function(g, k, d) {
                        this._hitLimit || (this._data += (0,
                        h.utf32ToString)(g, k, d),
                        this._data.length > v.PAYLOAD_LIMIT && (this._data = "",
                        this._hitLimit = !0))
                    }
                    ,
                    n.prototype.unhook = function(g) {
                        var k = this
                          , d = !1;
                        if (this._hitLimit)
                            d = !1;
                        else if (g && (d = this._handler(this._data, this._params))instanceof Promise)
                            return d.then(function(c) {
                                return k._params = t,
                                k._data = "",
                                k._hitLimit = !1,
                                c
                            });
                        return this._params = t,
                        this._data = "",
                        this._hitLimit = !1,
                        d
                    }
                    ,
                    n
                }();
                l.DcsHandler = q
            }
            ,
            2015: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                );
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.EscapeSequenceParser = l.VT500_TRANSITION_TABLE = l.TransitionTable = void 0;
                A = q(844);
                var p = q(8273)
                  , t = q(8742)
                  , n = q(6242)
                  , g = q(6351)
                  , k = function() {
                    function d(c) {
                        this.table = new Uint8Array(c)
                    }
                    return d.prototype.setDefault = function(c, a) {
                        (0,
                        p.fill)(this.table, c << 4 | a)
                    }
                    ,
                    d.prototype.add = function(c, a, b, e) {
                        this.table[a << 8 | c] = b << 4 | e
                    }
                    ,
                    d.prototype.addMany = function(c, a, b, e) {
                        for (var f = 0; f < c.length; f++)
                            this.table[a << 8 | c[f]] = b << 4 | e
                    }
                    ,
                    d
                }();
                l.TransitionTable = k;
                l.VT500_TRANSITION_TABLE = function() {
                    var d = new k(4095)
                      , c = Array.apply(null, Array(256)).map(function(u, w) {
                        return w
                    })
                      , a = function(u, w) {
                        return c.slice(u, w)
                    }
                      , b = a(32, 127)
                      , e = a(0, 24);
                    e.push(25);
                    e.push.apply(e, a(28, 32));
                    var f, m = a(0, 14);
                    for (f in d.setDefault(1, 0),
                    d.addMany(b, 0, 2, 0),
                    m)
                        d.addMany([24, 26, 153, 154], f, 3, 0),
                        d.addMany(a(128, 144), f, 3, 0),
                        d.addMany(a(144, 152), f, 3, 0),
                        d.add(156, f, 0, 0),
                        d.add(27, f, 11, 1),
                        d.add(157, f, 4, 8),
                        d.addMany([152, 158, 159], f, 0, 7),
                        d.add(155, f, 11, 3),
                        d.add(144, f, 11, 9);
                    return d.addMany(e, 0, 3, 0),
                    d.addMany(e, 1, 3, 1),
                    d.add(127, 1, 0, 1),
                    d.addMany(e, 8, 0, 8),
                    d.addMany(e, 3, 3, 3),
                    d.add(127, 3, 0, 3),
                    d.addMany(e, 4, 3, 4),
                    d.add(127, 4, 0, 4),
                    d.addMany(e, 6, 3, 6),
                    d.addMany(e, 5, 3, 5),
                    d.add(127, 5, 0, 5),
                    d.addMany(e, 2, 3, 2),
                    d.add(127, 2, 0, 2),
                    d.add(93, 1, 4, 8),
                    d.addMany(b, 8, 5, 8),
                    d.add(127, 8, 5, 8),
                    d.addMany([156, 27, 24, 26, 7], 8, 6, 0),
                    d.addMany(a(28, 32), 8, 0, 8),
                    d.addMany([88, 94, 95], 1, 0, 7),
                    d.addMany(b, 7, 0, 7),
                    d.addMany(e, 7, 0, 7),
                    d.add(156, 7, 0, 0),
                    d.add(127, 7, 0, 7),
                    d.add(91, 1, 11, 3),
                    d.addMany(a(64, 127), 3, 7, 0),
                    d.addMany(a(48, 60), 3, 8, 4),
                    d.addMany([60, 61, 62, 63], 3, 9, 4),
                    d.addMany(a(48, 60), 4, 8, 4),
                    d.addMany(a(64, 127), 4, 7, 0),
                    d.addMany([60, 61, 62, 63], 4, 0, 6),
                    d.addMany(a(32, 64), 6, 0, 6),
                    d.add(127, 6, 0, 6),
                    d.addMany(a(64, 127), 6, 0, 0),
                    d.addMany(a(32, 48), 3, 9, 5),
                    d.addMany(a(32, 48), 5, 9, 5),
                    d.addMany(a(48, 64), 5, 0, 6),
                    d.addMany(a(64, 127), 5, 7, 0),
                    d.addMany(a(32, 48), 4, 9, 5),
                    d.addMany(a(32, 48), 1, 9, 2),
                    d.addMany(a(32, 48), 2, 9, 2),
                    d.addMany(a(48, 127), 2, 10, 0),
                    d.addMany(a(48, 80), 1, 10, 0),
                    d.addMany(a(81, 88), 1, 10, 0),
                    d.addMany([89, 90, 92], 1, 10, 0),
                    d.addMany(a(96, 127), 1, 10, 0),
                    d.add(80, 1, 11, 9),
                    d.addMany(e, 9, 0, 9),
                    d.add(127, 9, 0, 9),
                    d.addMany(a(28, 32), 9, 0, 9),
                    d.addMany(a(32, 48), 9, 9, 12),
                    d.addMany(a(48, 60), 9, 8, 10),
                    d.addMany([60, 61, 62, 63], 9, 9, 10),
                    d.addMany(e, 11, 0, 11),
                    d.addMany(a(32, 128), 11, 0, 11),
                    d.addMany(a(28, 32), 11, 0, 11),
                    d.addMany(e, 10, 0, 10),
                    d.add(127, 10, 0, 10),
                    d.addMany(a(28, 32), 10, 0, 10),
                    d.addMany(a(48, 60), 10, 8, 10),
                    d.addMany([60, 61, 62, 63], 10, 0, 11),
                    d.addMany(a(32, 48), 10, 9, 12),
                    d.addMany(e, 12, 0, 12),
                    d.add(127, 12, 0, 12),
                    d.addMany(a(28, 32), 12, 0, 12),
                    d.addMany(a(32, 48), 12, 9, 12),
                    d.addMany(a(48, 64), 12, 0, 11),
                    d.addMany(a(64, 127), 12, 12, 13),
                    d.addMany(a(64, 127), 10, 12, 13),
                    d.addMany(a(64, 127), 9, 12, 13),
                    d.addMany(e, 13, 13, 13),
                    d.addMany(b, 13, 13, 13),
                    d.add(127, 13, 0, 13),
                    d.addMany([27, 156, 24, 26], 13, 14, 0),
                    d.add(160, 0, 2, 0),
                    d.add(160, 8, 5, 8),
                    d.add(160, 6, 0, 6),
                    d.add(160, 11, 0, 11),
                    d.add(160, 13, 13, 13),
                    d
                }();
                q = function(d) {
                    function c(a) {
                        void 0 === a && (a = l.VT500_TRANSITION_TABLE);
                        var b = d.call(this) || this;
                        return b._transitions = a,
                        b._parseStack = {
                            state: 0,
                            handlers: [],
                            handlerPos: 0,
                            transition: 0,
                            chunkPos: 0
                        },
                        b.initialState = 0,
                        b.currentState = b.initialState,
                        b._params = new t.Params,
                        b._params.addParam(0),
                        b._collect = 0,
                        b.precedingCodepoint = 0,
                        b._printHandlerFb = function(e, f, m) {}
                        ,
                        b._executeHandlerFb = function(e) {}
                        ,
                        b._csiHandlerFb = function(e, f) {}
                        ,
                        b._escHandlerFb = function(e) {}
                        ,
                        b._errorHandlerFb = function(e) {
                            return e
                        }
                        ,
                        b._printHandler = b._printHandlerFb,
                        b._executeHandlers = Object.create(null),
                        b._csiHandlers = Object.create(null),
                        b._escHandlers = Object.create(null),
                        b._oscParser = new n.OscParser,
                        b._dcsParser = new g.DcsParser,
                        b._errorHandler = b._errorHandlerFb,
                        b.registerEscHandler({
                            final: "\\"
                        }, function() {
                            return !0
                        }),
                        b
                    }
                    return v(c, d),
                    c.prototype._identifier = function(a, b) {
                        void 0 === b && (b = [64, 126]);
                        var e = 0;
                        if (a.prefix) {
                            if (1 < a.prefix.length)
                                throw Error("only one byte as prefix supported");
                            if ((e = a.prefix.charCodeAt(0)) && 60 > e || 63 < e)
                                throw Error("prefix must be in range 0x3c .. 0x3f");
                        }
                        if (a.intermediates) {
                            if (2 < a.intermediates.length)
                                throw Error("only two bytes as intermediates are supported");
                            for (var f = 0; f < a.intermediates.length; ++f) {
                                var m = a.intermediates.charCodeAt(f);
                                if (32 > m || 47 < m)
                                    throw Error("intermediate must be in range 0x20 .. 0x2f");
                                e <<= 8;
                                e |= m
                            }
                        }
                        if (1 !== a.final.length)
                            throw Error("final must be a single byte");
                        a = a.final.charCodeAt(0);
                        if (b[0] > a || a > b[1])
                            throw Error("final must be in range " + b[0] + " .. " + b[1]);
                        return e << 8 | a
                    }
                    ,
                    c.prototype.identToString = function(a) {
                        for (var b = []; a; )
                            b.push(String.fromCharCode(255 & a)),
                            a >>= 8;
                        return b.reverse().join("")
                    }
                    ,
                    c.prototype.dispose = function() {
                        this._csiHandlers = Object.create(null);
                        this._executeHandlers = Object.create(null);
                        this._escHandlers = Object.create(null);
                        this._oscParser.dispose();
                        this._dcsParser.dispose()
                    }
                    ,
                    c.prototype.setPrintHandler = function(a) {
                        this._printHandler = a
                    }
                    ,
                    c.prototype.clearPrintHandler = function() {
                        this._printHandler = this._printHandlerFb
                    }
                    ,
                    c.prototype.registerEscHandler = function(a, b) {
                        a = this._identifier(a, [48, 126]);
                        void 0 === this._escHandlers[a] && (this._escHandlers[a] = []);
                        var e = this._escHandlers[a];
                        return e.push(b),
                        {
                            dispose: function() {
                                var f = e.indexOf(b);
                                -1 !== f && e.splice(f, 1)
                            }
                        }
                    }
                    ,
                    c.prototype.clearEscHandler = function(a) {
                        this._escHandlers[this._identifier(a, [48, 126])] && delete this._escHandlers[this._identifier(a, [48, 126])]
                    }
                    ,
                    c.prototype.setEscHandlerFallback = function(a) {
                        this._escHandlerFb = a
                    }
                    ,
                    c.prototype.setExecuteHandler = function(a, b) {
                        this._executeHandlers[a.charCodeAt(0)] = b
                    }
                    ,
                    c.prototype.clearExecuteHandler = function(a) {
                        this._executeHandlers[a.charCodeAt(0)] && delete this._executeHandlers[a.charCodeAt(0)]
                    }
                    ,
                    c.prototype.setExecuteHandlerFallback = function(a) {
                        this._executeHandlerFb = a
                    }
                    ,
                    c.prototype.registerCsiHandler = function(a, b) {
                        a = this._identifier(a);
                        void 0 === this._csiHandlers[a] && (this._csiHandlers[a] = []);
                        var e = this._csiHandlers[a];
                        return e.push(b),
                        {
                            dispose: function() {
                                var f = e.indexOf(b);
                                -1 !== f && e.splice(f, 1)
                            }
                        }
                    }
                    ,
                    c.prototype.clearCsiHandler = function(a) {
                        this._csiHandlers[this._identifier(a)] && delete this._csiHandlers[this._identifier(a)]
                    }
                    ,
                    c.prototype.setCsiHandlerFallback = function(a) {
                        this._csiHandlerFb = a
                    }
                    ,
                    c.prototype.registerDcsHandler = function(a, b) {
                        return this._dcsParser.registerHandler(this._identifier(a), b)
                    }
                    ,
                    c.prototype.clearDcsHandler = function(a) {
                        this._dcsParser.clearHandler(this._identifier(a))
                    }
                    ,
                    c.prototype.setDcsHandlerFallback = function(a) {
                        this._dcsParser.setHandlerFallback(a)
                    }
                    ,
                    c.prototype.registerOscHandler = function(a, b) {
                        return this._oscParser.registerHandler(a, b)
                    }
                    ,
                    c.prototype.clearOscHandler = function(a) {
                        this._oscParser.clearHandler(a)
                    }
                    ,
                    c.prototype.setOscHandlerFallback = function(a) {
                        this._oscParser.setHandlerFallback(a)
                    }
                    ,
                    c.prototype.setErrorHandler = function(a) {
                        this._errorHandler = a
                    }
                    ,
                    c.prototype.clearErrorHandler = function() {
                        this._errorHandler = this._errorHandlerFb
                    }
                    ,
                    c.prototype.reset = function() {
                        this.currentState = this.initialState;
                        this._oscParser.reset();
                        this._dcsParser.reset();
                        this._params.reset();
                        this._params.addParam(0);
                        this.precedingCodepoint = this._collect = 0;
                        0 !== this._parseStack.state && (this._parseStack.state = 2,
                        this._parseStack.handlers = [])
                    }
                    ,
                    c.prototype._preserveStack = function(a, b, e, f, m) {
                        this._parseStack.state = a;
                        this._parseStack.handlers = b;
                        this._parseStack.handlerPos = e;
                        this._parseStack.transition = f;
                        this._parseStack.chunkPos = m
                    }
                    ,
                    c.prototype.parse = function(a, b, e) {
                        var f, m = 0, u = 0;
                        if (this._parseStack.state)
                            if (2 === this._parseStack.state)
                                this._parseStack.state = 0,
                                u = this._parseStack.chunkPos + 1;
                            else {
                                if (void 0 === e || 1 === this._parseStack.state)
                                    throw this._parseStack.state = 1,
                                    Error("improper continuation due to previous async handler, giving up parsing");
                                var w = this._parseStack.handlers;
                                u = this._parseStack.handlerPos - 1;
                                switch (this._parseStack.state) {
                                case 3:
                                    if (!1 === e && -1 < u)
                                        for (; 0 <= u && !0 !== (f = w[u](this._params)); u--)
                                            if (f instanceof Promise)
                                                return this._parseStack.handlerPos = u,
                                                f;
                                    this._parseStack.handlers = [];
                                    break;
                                case 4:
                                    if (!1 === e && -1 < u)
                                        for (; 0 <= u && !0 !== (f = w[u]()); u--)
                                            if (f instanceof Promise)
                                                return this._parseStack.handlerPos = u,
                                                f;
                                    this._parseStack.handlers = [];
                                    break;
                                case 6:
                                    if (m = a[this._parseStack.chunkPos],
                                    f = this._dcsParser.unhook(24 !== m && 26 !== m, e))
                                        return f;
                                    27 === m && (this._parseStack.transition |= 1);
                                    this._params.reset();
                                    this._params.addParam(0);
                                    this._collect = 0;
                                    break;
                                case 5:
                                    if (m = a[this._parseStack.chunkPos],
                                    f = this._oscParser.end(24 !== m && 26 !== m, e))
                                        return f;
                                    27 === m && (this._parseStack.transition |= 1);
                                    this._params.reset();
                                    this._params.addParam(0);
                                    this._collect = 0
                                }
                                this._parseStack.state = 0;
                                u = this._parseStack.chunkPos + 1;
                                this.precedingCodepoint = 0;
                                this.currentState = 15 & this._parseStack.transition
                            }
                        for (; u < b; ++u) {
                            switch (m = a[u],
                            (e = this._transitions.table[this.currentState << 8 | (160 > m ? m : 160)]) >> 4) {
                            case 2:
                                for (var r = u + 1; ; ++r) {
                                    if (r >= b || 32 > (m = a[r]) || 126 < m && 160 > m) {
                                        this._printHandler(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                    if (++r >= b || 32 > (m = a[r]) || 126 < m && 160 > m) {
                                        this._printHandler(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                    if (++r >= b || 32 > (m = a[r]) || 126 < m && 160 > m) {
                                        this._printHandler(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                    if (++r >= b || 32 > (m = a[r]) || 126 < m && 160 > m) {
                                        this._printHandler(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                }
                                break;
                            case 3:
                                this._executeHandlers[m] ? this._executeHandlers[m]() : this._executeHandlerFb(m);
                                this.precedingCodepoint = 0;
                                break;
                            case 1:
                                if (this._errorHandler({
                                    position: u,
                                    code: m,
                                    currentState: this.currentState,
                                    collect: this._collect,
                                    params: this._params,
                                    abort: !1
                                }).abort)
                                    return;
                                break;
                            case 7:
                                for (r = (w = this._csiHandlers[this._collect << 8 | m]) ? w.length - 1 : -1; 0 <= r && !0 !== (f = w[r](this._params)); r--)
                                    if (f instanceof Promise)
                                        return this._preserveStack(3, w, r, e, u),
                                        f;
                                0 > r && this._csiHandlerFb(this._collect << 8 | m, this._params);
                                this.precedingCodepoint = 0;
                                break;
                            case 8:
                                do
                                    switch (m) {
                                    case 59:
                                        this._params.addParam(0);
                                        break;
                                    case 58:
                                        this._params.addSubParam(-1);
                                        break;
                                    default:
                                        this._params.addDigit(m - 48)
                                    }
                                while (++u < b && 47 < (m = a[u]) && 60 > m);
                                u--;
                                break;
                            case 9:
                                this._collect <<= 8;
                                this._collect |= m;
                                break;
                            case 10:
                                for (var z = (r = this._escHandlers[this._collect << 8 | m]) ? r.length - 1 : -1; 0 <= z && !0 !== (f = r[z]()); z--)
                                    if (f instanceof Promise)
                                        return this._preserveStack(4, r, z, e, u),
                                        f;
                                0 > z && this._escHandlerFb(this._collect << 8 | m);
                                this.precedingCodepoint = 0;
                                break;
                            case 11:
                                this._params.reset();
                                this._params.addParam(0);
                                this._collect = 0;
                                break;
                            case 12:
                                this._dcsParser.hook(this._collect << 8 | m, this._params);
                                break;
                            case 13:
                                for (r = u + 1; ; ++r)
                                    if (r >= b || 24 === (m = a[r]) || 26 === m || 27 === m || 127 < m && 160 > m) {
                                        this._dcsParser.put(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                break;
                            case 14:
                                if (f = this._dcsParser.unhook(24 !== m && 26 !== m))
                                    return this._preserveStack(6, [], 0, e, u),
                                    f;
                                27 === m && (e |= 1);
                                this._params.reset();
                                this._params.addParam(0);
                                this.precedingCodepoint = this._collect = 0;
                                break;
                            case 4:
                                this._oscParser.start();
                                break;
                            case 5:
                                for (r = u + 1; ; r++)
                                    if (r >= b || 32 > (m = a[r]) || 127 < m && 160 > m) {
                                        this._oscParser.put(a, u, r);
                                        u = r - 1;
                                        break
                                    }
                                break;
                            case 6:
                                if (f = this._oscParser.end(24 !== m && 26 !== m))
                                    return this._preserveStack(5, [], 0, e, u),
                                    f;
                                27 === m && (e |= 1);
                                this._params.reset();
                                this._params.addParam(0);
                                this.precedingCodepoint = this._collect = 0
                            }
                            this.currentState = 15 & e
                        }
                    }
                    ,
                    c
                }(A.Disposable);
                l.EscapeSequenceParser = q
            },
            6242: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.OscHandler = l.OscParser = void 0;
                var h = q(5770)
                  , v = q(482)
                  , p = [];
                A = function() {
                    function t() {
                        this._state = 0;
                        this._active = p;
                        this._id = -1;
                        this._handlers = Object.create(null);
                        this._handlerFb = function() {}
                        ;
                        this._stack = {
                            paused: !1,
                            loopPosition: 0,
                            fallThrough: !1
                        }
                    }
                    return t.prototype.registerHandler = function(n, g) {
                        void 0 === this._handlers[n] && (this._handlers[n] = []);
                        var k = this._handlers[n];
                        return k.push(g),
                        {
                            dispose: function() {
                                var d = k.indexOf(g);
                                -1 !== d && k.splice(d, 1)
                            }
                        }
                    }
                    ,
                    t.prototype.clearHandler = function(n) {
                        this._handlers[n] && delete this._handlers[n]
                    }
                    ,
                    t.prototype.setHandlerFallback = function(n) {
                        this._handlerFb = n
                    }
                    ,
                    t.prototype.dispose = function() {
                        this._handlers = Object.create(null);
                        this._handlerFb = function() {}
                        ;
                        this._active = p
                    }
                    ,
                    t.prototype.reset = function() {
                        if (2 === this._state)
                            for (var n = this._stack.paused ? this._stack.loopPosition - 1 : this._active.length - 1; 0 <= n; --n)
                                this._active[n].end(!1);
                        this._stack.paused = !1;
                        this._active = p;
                        this._id = -1;
                        this._state = 0
                    }
                    ,
                    t.prototype._start = function() {
                        if (this._active = this._handlers[this._id] || p,
                        this._active.length)
                            for (var n = this._active.length - 1; 0 <= n; n--)
                                this._active[n].start();
                        else
                            this._handlerFb(this._id, "START")
                    }
                    ,
                    t.prototype._put = function(n, g, k) {
                        if (this._active.length)
                            for (var d = this._active.length - 1; 0 <= d; d--)
                                this._active[d].put(n, g, k);
                        else
                            this._handlerFb(this._id, "PUT", (0,
                            v.utf32ToString)(n, g, k))
                    }
                    ,
                    t.prototype.start = function() {
                        this.reset();
                        this._state = 1
                    }
                    ,
                    t.prototype.put = function(n, g, k) {
                        if (3 !== this._state) {
                            if (1 === this._state)
                                for (; g < k; ) {
                                    var d = n[g++];
                                    if (59 === d) {
                                        this._state = 2;
                                        this._start();
                                        break
                                    }
                                    if (48 > d || 57 < d)
                                        return void (this._state = 3);
                                    -1 === this._id && (this._id = 0);
                                    this._id = 10 * this._id + d - 48
                                }
                            2 === this._state && 0 < k - g && this._put(n, g, k)
                        }
                    }
                    ,
                    t.prototype.end = function(n, g) {
                        if (void 0 === g && (g = !0),
                        0 !== this._state) {
                            if (3 !== this._state)
                                if (1 === this._state && this._start(),
                                this._active.length) {
                                    var k = !1
                                      , d = this._active.length - 1
                                      , c = !1;
                                    if (this._stack.paused && (d = this._stack.loopPosition - 1,
                                    k = g,
                                    c = this._stack.fallThrough,
                                    this._stack.paused = !1),
                                    !c && !1 === k) {
                                        for (; 0 <= d && !0 !== (k = this._active[d].end(n)); d--)
                                            if (k instanceof Promise)
                                                return this._stack.paused = !0,
                                                this._stack.loopPosition = d,
                                                this._stack.fallThrough = !1,
                                                k;
                                        d--
                                    }
                                    for (; 0 <= d; d--)
                                        if ((k = this._active[d].end(!1))instanceof Promise)
                                            return this._stack.paused = !0,
                                            this._stack.loopPosition = d,
                                            this._stack.fallThrough = !0,
                                            k
                                } else
                                    this._handlerFb(this._id, "END", n);
                            this._active = p;
                            this._id = -1;
                            this._state = 0
                        }
                    }
                    ,
                    t
                }();
                l.OscParser = A;
                A = function() {
                    function t(n) {
                        this._handler = n;
                        this._data = "";
                        this._hitLimit = !1
                    }
                    return t.prototype.start = function() {
                        this._data = "";
                        this._hitLimit = !1
                    }
                    ,
                    t.prototype.put = function(n, g, k) {
                        this._hitLimit || (this._data += (0,
                        v.utf32ToString)(n, g, k),
                        this._data.length > h.PAYLOAD_LIMIT && (this._data = "",
                        this._hitLimit = !0))
                    }
                    ,
                    t.prototype.end = function(n) {
                        var g = this
                          , k = !1;
                        if (this._hitLimit)
                            k = !1;
                        else if (n && (k = this._handler(this._data))instanceof Promise)
                            return k.then(function(d) {
                                return g._data = "",
                                g._hitLimit = !1,
                                d
                            });
                        return this._data = "",
                        this._hitLimit = !1,
                        k
                    }
                    ,
                    t
                }();
                l.OscHandler = A
            }
            ,
            8742: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.Params = void 0;
                A = function() {
                    function q(h, v) {
                        if (void 0 === h && (h = 32),
                        void 0 === v && (v = 32),
                        this.maxLength = h,
                        this.maxSubParamsLength = v,
                        256 < v)
                            throw Error("maxSubParamsLength must not be greater than 256");
                        this.params = new Int32Array(h);
                        this.length = 0;
                        this._subParams = new Int32Array(v);
                        this._subParamsLength = 0;
                        this._subParamsIdx = new Uint16Array(h);
                        this._digitIsSub = this._rejectSubDigits = this._rejectDigits = !1
                    }
                    return q.fromArray = function(h) {
                        var v = new q;
                        if (!h.length)
                            return v;
                        for (var p = Array.isArray(h[0]) ? 1 : 0; p < h.length; ++p) {
                            var t = h[p];
                            if (Array.isArray(t))
                                for (var n = 0; n < t.length; ++n)
                                    v.addSubParam(t[n]);
                            else
                                v.addParam(t)
                        }
                        return v
                    }
                    ,
                    q.prototype.clone = function() {
                        var h = new q(this.maxLength,this.maxSubParamsLength);
                        return h.params.set(this.params),
                        h.length = this.length,
                        h._subParams.set(this._subParams),
                        h._subParamsLength = this._subParamsLength,
                        h._subParamsIdx.set(this._subParamsIdx),
                        h._rejectDigits = this._rejectDigits,
                        h._rejectSubDigits = this._rejectSubDigits,
                        h._digitIsSub = this._digitIsSub,
                        h
                    }
                    ,
                    q.prototype.toArray = function() {
                        for (var h = [], v = 0; v < this.length; ++v) {
                            h.push(this.params[v]);
                            var p = this._subParamsIdx[v] >> 8
                              , t = 255 & this._subParamsIdx[v];
                            0 < t - p && h.push(Array.prototype.slice.call(this._subParams, p, t))
                        }
                        return h
                    }
                    ,
                    q.prototype.reset = function() {
                        this._subParamsLength = this.length = 0;
                        this._digitIsSub = this._rejectSubDigits = this._rejectDigits = !1
                    }
                    ,
                    q.prototype.addParam = function(h) {
                        if (this._digitIsSub = !1,
                        this.length >= this.maxLength)
                            this._rejectDigits = !0;
                        else {
                            if (-1 > h)
                                throw Error("values lesser than -1 are not allowed");
                            this._subParamsIdx[this.length] = this._subParamsLength << 8 | this._subParamsLength;
                            this.params[this.length++] = 2147483647 < h ? 2147483647 : h
                        }
                    }
                    ,
                    q.prototype.addSubParam = function(h) {
                        if (this._digitIsSub = !0,
                        this.length)
                            if (this._rejectDigits || this._subParamsLength >= this.maxSubParamsLength)
                                this._rejectSubDigits = !0;
                            else {
                                if (-1 > h)
                                    throw Error("values lesser than -1 are not allowed");
                                this._subParams[this._subParamsLength++] = 2147483647 < h ? 2147483647 : h;
                                this._subParamsIdx[this.length - 1]++
                            }
                    }
                    ,
                    q.prototype.hasSubParams = function(h) {
                        return 0 < (255 & this._subParamsIdx[h]) - (this._subParamsIdx[h] >> 8)
                    }
                    ,
                    q.prototype.getSubParams = function(h) {
                        var v = this._subParamsIdx[h] >> 8;
                        h = 255 & this._subParamsIdx[h];
                        return 0 < h - v ? this._subParams.subarray(v, h) : null
                    }
                    ,
                    q.prototype.getSubParamsAll = function() {
                        for (var h = {}, v = 0; v < this.length; ++v) {
                            var p = this._subParamsIdx[v] >> 8
                              , t = 255 & this._subParamsIdx[v];
                            0 < t - p && (h[v] = this._subParams.slice(p, t))
                        }
                        return h
                    }
                    ,
                    q.prototype.addDigit = function(h) {
                        var v;
                        if (!(this._rejectDigits || !(v = this._digitIsSub ? this._subParamsLength : this.length) || this._digitIsSub && this._rejectSubDigits)) {
                            var p = this._digitIsSub ? this._subParams : this.params
                              , t = p[v - 1];
                            p[v - 1] = ~t ? Math.min(10 * t + h, 2147483647) : h
                        }
                    }
                    ,
                    q
                }();
                l.Params = A
            }
            ,
            5741: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.AddonManager = void 0;
                A = function() {
                    function q() {
                        this._addons = []
                    }
                    return q.prototype.dispose = function() {
                        for (var h = this._addons.length - 1; 0 <= h; h--)
                            this._addons[h].instance.dispose()
                    }
                    ,
                    q.prototype.loadAddon = function(h, v) {
                        var p = this
                          , t = {
                            instance: v,
                            dispose: v.dispose,
                            isDisposed: !1
                        };
                        this._addons.push(t);
                        v.dispose = function() {
                            return p._wrappedAddonDispose(t)
                        }
                        ;
                        v.activate(h)
                    }
                    ,
                    q.prototype._wrappedAddonDispose = function(h) {
                        if (!h.isDisposed) {
                            for (var v = -1, p = 0; p < this._addons.length; p++)
                                if (this._addons[p] === h) {
                                    v = p;
                                    break
                                }
                            if (-1 === v)
                                throw Error("Could not dispose an addon that has not been loaded");
                            h.isDisposed = !0;
                            h.dispose.apply(h.instance);
                            this._addons.splice(v, 1)
                        }
                    }
                    ,
                    q
                }();
                l.AddonManager = A
            }
            ,
            8771: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferApiView = void 0;
                var h = q(3785)
                  , v = q(511);
                A = function() {
                    function p(t, n) {
                        this._buffer = t;
                        this.type = n
                    }
                    return p.prototype.init = function(t) {
                        return this._buffer = t,
                        this
                    }
                    ,
                    Object.defineProperty(p.prototype, "cursorY", {
                        get: function() {
                            return this._buffer.y
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "cursorX", {
                        get: function() {
                            return this._buffer.x
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "viewportY", {
                        get: function() {
                            return this._buffer.ydisp
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "baseY", {
                        get: function() {
                            return this._buffer.ybase
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "length", {
                        get: function() {
                            return this._buffer.lines.length
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    p.prototype.getLine = function(t) {
                        if (t = this._buffer.lines.get(t))
                            return new h.BufferLineApiView(t)
                    }
                    ,
                    p.prototype.getNullCell = function() {
                        return new v.CellData
                    }
                    ,
                    p
                }();
                l.BufferApiView = A
            }
            ,
            3785: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferLineApiView = void 0;
                var h = q(511);
                A = function() {
                    function v(p) {
                        this._line = p
                    }
                    return Object.defineProperty(v.prototype, "isWrapped", {
                        get: function() {
                            return this._line.isWrapped
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(v.prototype, "length", {
                        get: function() {
                            return this._line.length
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    v.prototype.getCell = function(p, t) {
                        if (!(0 > p || p >= this._line.length))
                            return t ? (this._line.loadCell(p, t),
                            t) : this._line.loadCell(p, new h.CellData)
                    }
                    ,
                    v.prototype.translateToString = function(p, t, n) {
                        return this._line.translateToString(p, t, n)
                    }
                    ,
                    v
                }();
                l.BufferLineApiView = A
            }
            ,
            8285: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferNamespaceApi = void 0;
                var h = q(8771)
                  , v = q(8460);
                A = function() {
                    function p(t) {
                        var n = this;
                        this._core = t;
                        this._onBufferChange = new v.EventEmitter;
                        this._normal = new h.BufferApiView(this._core.buffers.normal,"normal");
                        this._alternate = new h.BufferApiView(this._core.buffers.alt,"alternate");
                        this._core.buffers.onBufferActivate(function() {
                            return n._onBufferChange.fire(n.active)
                        })
                    }
                    return Object.defineProperty(p.prototype, "onBufferChange", {
                        get: function() {
                            return this._onBufferChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "active", {
                        get: function() {
                            if (this._core.buffers.active === this._core.buffers.normal)
                                return this.normal;
                            if (this._core.buffers.active === this._core.buffers.alt)
                                return this.alternate;
                            throw Error("Active buffer is neither normal nor alternate");
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "normal", {
                        get: function() {
                            return this._normal.init(this._core.buffers.normal)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "alternate", {
                        get: function() {
                            return this._alternate.init(this._core.buffers.alt)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    p
                }();
                l.BufferNamespaceApi = A
            }
            ,
            7975: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.ParserApi = void 0;
                A = function() {
                    function q(h) {
                        this._core = h
                    }
                    return q.prototype.registerCsiHandler = function(h, v) {
                        return this._core.registerCsiHandler(h, function(p) {
                            return v(p.toArray())
                        })
                    }
                    ,
                    q.prototype.addCsiHandler = function(h, v) {
                        return this.registerCsiHandler(h, v)
                    }
                    ,
                    q.prototype.registerDcsHandler = function(h, v) {
                        return this._core.registerDcsHandler(h, function(p, t) {
                            return v(p, t.toArray())
                        })
                    }
                    ,
                    q.prototype.addDcsHandler = function(h, v) {
                        return this.registerDcsHandler(h, v)
                    }
                    ,
                    q.prototype.registerEscHandler = function(h, v) {
                        return this._core.registerEscHandler(h, v)
                    }
                    ,
                    q.prototype.addEscHandler = function(h, v) {
                        return this.registerEscHandler(h, v)
                    }
                    ,
                    q.prototype.registerOscHandler = function(h, v) {
                        return this._core.registerOscHandler(h, v)
                    }
                    ,
                    q.prototype.addOscHandler = function(h, v) {
                        return this.registerOscHandler(h, v)
                    }
                    ,
                    q
                }();
                l.ParserApi = A
            }
            ,
            7090: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.UnicodeApi = void 0;
                A = function() {
                    function q(h) {
                        this._core = h
                    }
                    return q.prototype.register = function(h) {
                        this._core.unicodeService.register(h)
                    }
                    ,
                    Object.defineProperty(q.prototype, "versions", {
                        get: function() {
                            return this._core.unicodeService.versions
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(q.prototype, "activeVersion", {
                        get: function() {
                            return this._core.unicodeService.activeVersion
                        },
                        set: function(h) {
                            this._core.unicodeService.activeVersion = h
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    q
                }();
                l.UnicodeApi = A
            }
            ,
            744: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(d, c) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(a, b) {
                        a.__proto__ = b
                    }
                    || function(a, b) {
                        for (var e in b)
                            Object.prototype.hasOwnProperty.call(b, e) && (a[e] = b[e])
                    }
                    ,
                    h(d, c)
                }
                ,
                function(d, c) {
                    function a() {
                        this.constructor = d
                    }
                    if ("function" != typeof c && null !== c)
                        throw new TypeError("Class extends value " + String(c) + " is not a constructor or null");
                    h(d, c);
                    d.prototype = null === c ? Object.create(c) : (a.prototype = c.prototype,
                    new a)
                }
                ), p = this && this.__decorate || function(d, c, a, b) {
                    var e, f = arguments.length, m = 3 > f ? c : null === b ? b = Object.getOwnPropertyDescriptor(c, a) : b;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        m = Reflect.decorate(d, c, a, b);
                    else
                        for (var u = d.length - 1; 0 <= u; u--)
                            (e = d[u]) && (m = (3 > f ? e(m) : 3 < f ? e(c, a, m) : e(c, a)) || m);
                    return 3 < f && m && Object.defineProperty(c, a, m),
                    m
                }
                , t = this && this.__param || function(d, c) {
                    return function(a, b) {
                        c(a, b, d)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.BufferService = l.MINIMUM_ROWS = l.MINIMUM_COLS = void 0;
                var n = q(2585)
                  , g = q(5295)
                  , k = q(8460);
                A = q(844);
                l.MINIMUM_COLS = 2;
                l.MINIMUM_ROWS = 1;
                A = function(d) {
                    function c(a) {
                        var b = d.call(this) || this;
                        return b._optionsService = a,
                        b.isUserScrolling = !1,
                        b._onResize = new k.EventEmitter,
                        b._onScroll = new k.EventEmitter,
                        b.cols = Math.max(a.rawOptions.cols || 0, l.MINIMUM_COLS),
                        b.rows = Math.max(a.rawOptions.rows || 0, l.MINIMUM_ROWS),
                        b.buffers = new g.BufferSet(a,b),
                        b
                    }
                    return v(c, d),
                    Object.defineProperty(c.prototype, "onResize", {
                        get: function() {
                            return this._onResize.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "onScroll", {
                        get: function() {
                            return this._onScroll.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "buffer", {
                        get: function() {
                            return this.buffers.active
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype.dispose = function() {
                        d.prototype.dispose.call(this);
                        this.buffers.dispose()
                    }
                    ,
                    c.prototype.resize = function(a, b) {
                        this.cols = a;
                        this.rows = b;
                        this.buffers.resize(a, b);
                        this.buffers.setupTabStops(this.cols);
                        this._onResize.fire({
                            cols: a,
                            rows: b
                        })
                    }
                    ,
                    c.prototype.reset = function() {
                        this.buffers.reset();
                        this.isUserScrolling = !1
                    }
                    ,
                    c.prototype.scroll = function(a, b) {
                        void 0 === b && (b = !1);
                        var e, f = this.buffer;
                        (e = this._cachedBlankLine) && e.length === this.cols && e.getFg(0) === a.fg && e.getBg(0) === a.bg || (e = f.getBlankLine(a, b),
                        this._cachedBlankLine = e);
                        e.isWrapped = b;
                        b = f.ybase + f.scrollTop;
                        a = f.ybase + f.scrollBottom;
                        0 === f.scrollTop ? (b = f.lines.isFull,
                        a === f.lines.length - 1 ? b ? f.lines.recycle().copyFrom(e) : f.lines.push(e.clone()) : f.lines.splice(a + 1, 0, e.clone()),
                        b ? this.isUserScrolling && (f.ydisp = Math.max(f.ydisp - 1, 0)) : (f.ybase++,
                        this.isUserScrolling || f.ydisp++)) : (f.lines.shiftElements(b + 1, a - b + 1 - 1, -1),
                        f.lines.set(a, e.clone()));
                        this.isUserScrolling || (f.ydisp = f.ybase);
                        this._onScroll.fire(f.ydisp)
                    }
                    ,
                    c.prototype.scrollLines = function(a, b, e) {
                        e = this.buffer;
                        if (0 > a) {
                            if (0 === e.ydisp)
                                return;
                            this.isUserScrolling = !0
                        } else
                            a + e.ydisp >= e.ybase && (this.isUserScrolling = !1);
                        var f = e.ydisp;
                        e.ydisp = Math.max(Math.min(e.ydisp + a, e.ybase), 0);
                        f !== e.ydisp && (b || this._onScroll.fire(e.ydisp))
                    }
                    ,
                    c.prototype.scrollPages = function(a) {
                        this.scrollLines(a * (this.rows - 1))
                    }
                    ,
                    c.prototype.scrollToTop = function() {
                        this.scrollLines(-this.buffer.ydisp)
                    }
                    ,
                    c.prototype.scrollToBottom = function() {
                        this.scrollLines(this.buffer.ybase - this.buffer.ydisp)
                    }
                    ,
                    c.prototype.scrollToLine = function(a) {
                        a -= this.buffer.ydisp;
                        0 !== a && this.scrollLines(a)
                    }
                    ,
                    p([t(0, n.IOptionsService)], c)
                }(A.Disposable);
                l.BufferService = A
            },
            7994: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CharsetService = void 0;
                A = function() {
                    function q() {
                        this.glevel = 0;
                        this._charsets = []
                    }
                    return q.prototype.reset = function() {
                        this.charset = void 0;
                        this._charsets = [];
                        this.glevel = 0
                    }
                    ,
                    q.prototype.setgLevel = function(h) {
                        this.glevel = h;
                        this.charset = this._charsets[h]
                    }
                    ,
                    q.prototype.setgCharset = function(h, v) {
                        this._charsets[h] = v;
                        this.glevel === h && (this.charset = v)
                    }
                    ,
                    q
                }();
                l.CharsetService = A
            }
            ,
            1753: function(A, l, q) {
                function h(c, a) {
                    var b = (c.ctrl ? 16 : 0) | (c.shift ? 4 : 0) | (c.alt ? 8 : 0);
                    return 4 === c.button ? (b |= 64,
                    b |= c.action) : (b |= 3 & c.button,
                    4 & c.button && (b |= 64),
                    8 & c.button && (b |= 128),
                    32 === c.action ? b |= 32 : 0 !== c.action || a || (b |= 3)),
                    b
                }
                var v = this && this.__decorate || function(c, a, b, e) {
                    var f, m = arguments.length, u = 3 > m ? a : null === e ? e = Object.getOwnPropertyDescriptor(a, b) : e;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        u = Reflect.decorate(c, a, b, e);
                    else
                        for (var w = c.length - 1; 0 <= w; w--)
                            (f = c[w]) && (u = (3 > m ? f(u) : 3 < m ? f(a, b, u) : f(a, b)) || u);
                    return 3 < m && u && Object.defineProperty(a, b, u),
                    u
                }
                  , p = this && this.__param || function(c, a) {
                    return function(b, e) {
                        a(b, e, c)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CoreMouseService = void 0;
                var t = q(2585)
                  , n = q(8460)
                  , g = {
                    NONE: {
                        events: 0,
                        restrict: function() {
                            return !1
                        }
                    },
                    X10: {
                        events: 1,
                        restrict: function(c) {
                            return 4 !== c.button && 1 === c.action && (c.ctrl = !1,
                            c.alt = !1,
                            c.shift = !1,
                            !0)
                        }
                    },
                    VT200: {
                        events: 19,
                        restrict: function(c) {
                            return 32 !== c.action
                        }
                    },
                    DRAG: {
                        events: 23,
                        restrict: function(c) {
                            return 32 !== c.action || 3 !== c.button
                        }
                    },
                    ANY: {
                        events: 31,
                        restrict: function(c) {
                            return !0
                        }
                    }
                }
                  , k = String.fromCharCode
                  , d = {
                    DEFAULT: function(c) {
                        c = [h(c, !1) + 32, c.col + 32, c.row + 32];
                        return 255 < c[0] || 255 < c[1] || 255 < c[2] ? "" : "\u001b[M" + k(c[0]) + k(c[1]) + k(c[2])
                    },
                    SGR: function(c) {
                        var a = 0 === c.action && 4 !== c.button ? "m" : "M";
                        return "\u001b[<" + h(c, !0) + ";" + c.col + ";" + c.row + a
                    }
                };
                A = function() {
                    function c(a, b) {
                        this._bufferService = a;
                        this._coreService = b;
                        this._protocols = {};
                        this._encodings = {};
                        this._activeEncoding = this._activeProtocol = "";
                        this._onProtocolChange = new n.EventEmitter;
                        this._lastEvent = null;
                        a = 0;
                        for (b = Object.keys(g); a < b.length; a++) {
                            var e = b[a];
                            this.addProtocol(e, g[e])
                        }
                        a = 0;
                        for (b = Object.keys(d); a < b.length; a++)
                            e = b[a],
                            this.addEncoding(e, d[e]);
                        this.reset()
                    }
                    return c.prototype.addProtocol = function(a, b) {
                        this._protocols[a] = b
                    }
                    ,
                    c.prototype.addEncoding = function(a, b) {
                        this._encodings[a] = b
                    }
                    ,
                    Object.defineProperty(c.prototype, "activeProtocol", {
                        get: function() {
                            return this._activeProtocol
                        },
                        set: function(a) {
                            if (!this._protocols[a])
                                throw Error('unknown protocol "' + a + '"');
                            this._activeProtocol = a;
                            this._onProtocolChange.fire(this._protocols[a].events)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "areMouseEventsActive", {
                        get: function() {
                            return 0 !== this._protocols[this._activeProtocol].events
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(c.prototype, "activeEncoding", {
                        get: function() {
                            return this._activeEncoding
                        },
                        set: function(a) {
                            if (!this._encodings[a])
                                throw Error('unknown encoding "' + a + '"');
                            this._activeEncoding = a
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype.reset = function() {
                        this.activeProtocol = "NONE";
                        this.activeEncoding = "DEFAULT";
                        this._lastEvent = null
                    }
                    ,
                    Object.defineProperty(c.prototype, "onProtocolChange", {
                        get: function() {
                            return this._onProtocolChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    c.prototype.triggerMouseEvent = function(a) {
                        if (0 > a.col || a.col >= this._bufferService.cols || 0 > a.row || a.row >= this._bufferService.rows || 4 === a.button && 32 === a.action || 3 === a.button && 32 !== a.action || 4 !== a.button && (2 === a.action || 3 === a.action) || (a.col++,
                        a.row++,
                        32 === a.action && this._lastEvent && this._compareEvents(this._lastEvent, a)) || !this._protocols[this._activeProtocol].restrict(a))
                            return !1;
                        var b = this._encodings[this._activeEncoding](a);
                        return b && ("DEFAULT" === this._activeEncoding ? this._coreService.triggerBinaryEvent(b) : this._coreService.triggerDataEvent(b, !0)),
                        this._lastEvent = a,
                        !0
                    }
                    ,
                    c.prototype.explainEvents = function(a) {
                        return {
                            down: !!(1 & a),
                            up: !!(2 & a),
                            drag: !!(4 & a),
                            move: !!(8 & a),
                            wheel: !!(16 & a)
                        }
                    }
                    ,
                    c.prototype._compareEvents = function(a, b) {
                        return a.col === b.col && a.row === b.row && a.button === b.button && a.action === b.action && a.ctrl === b.ctrl && a.alt === b.alt && a.shift === b.shift
                    }
                    ,
                    v([p(0, t.IBufferService), p(1, t.ICoreService)], c)
                }();
                l.CoreMouseService = A
            },
            6975: function(A, l, q) {
                var h, v = this && this.__extends || (h = function(a, b) {
                    return h = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(e, f) {
                        e.__proto__ = f
                    }
                    || function(e, f) {
                        for (var m in f)
                            Object.prototype.hasOwnProperty.call(f, m) && (e[m] = f[m])
                    }
                    ,
                    h(a, b)
                }
                ,
                function(a, b) {
                    function e() {
                        this.constructor = a
                    }
                    if ("function" != typeof b && null !== b)
                        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                    h(a, b);
                    a.prototype = null === b ? Object.create(b) : (e.prototype = b.prototype,
                    new e)
                }
                ), p = this && this.__decorate || function(a, b, e, f) {
                    var m, u = arguments.length, w = 3 > u ? b : null === f ? f = Object.getOwnPropertyDescriptor(b, e) : f;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        w = Reflect.decorate(a, b, e, f);
                    else
                        for (var r = a.length - 1; 0 <= r; r--)
                            (m = a[r]) && (w = (3 > u ? m(w) : 3 < u ? m(b, e, w) : m(b, e)) || w);
                    return 3 < u && w && Object.defineProperty(b, e, w),
                    w
                }
                , t = this && this.__param || function(a, b) {
                    return function(e, f) {
                        b(e, f, a)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.CoreService = void 0;
                var n = q(2585)
                  , g = q(8460)
                  , k = q(1439);
                A = q(844);
                var d = Object.freeze({
                    insertMode: !1
                })
                  , c = Object.freeze({
                    applicationCursorKeys: !1,
                    applicationKeypad: !1,
                    bracketedPasteMode: !1,
                    origin: !1,
                    reverseWraparound: !1,
                    sendFocus: !1,
                    wraparound: !0
                });
                A = function(a) {
                    function b(e, f, m, u) {
                        var w = a.call(this) || this;
                        return w._bufferService = f,
                        w._logService = m,
                        w._optionsService = u,
                        w.isCursorInitialized = !1,
                        w.isCursorHidden = !1,
                        w._onData = w.register(new g.EventEmitter),
                        w._onUserInput = w.register(new g.EventEmitter),
                        w._onBinary = w.register(new g.EventEmitter),
                        w._scrollToBottom = e,
                        w.register({
                            dispose: function() {
                                return w._scrollToBottom = void 0
                            }
                        }),
                        w.modes = (0,
                        k.clone)(d),
                        w.decPrivateModes = (0,
                        k.clone)(c),
                        w
                    }
                    return v(b, a),
                    Object.defineProperty(b.prototype, "onData", {
                        get: function() {
                            return this._onData.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(b.prototype, "onUserInput", {
                        get: function() {
                            return this._onUserInput.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(b.prototype, "onBinary", {
                        get: function() {
                            return this._onBinary.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    b.prototype.reset = function() {
                        this.modes = (0,
                        k.clone)(d);
                        this.decPrivateModes = (0,
                        k.clone)(c)
                    }
                    ,
                    b.prototype.triggerDataEvent = function(e, f) {
                        if (void 0 === f && (f = !1),
                        !this._optionsService.rawOptions.disableStdin) {
                            var m = this._bufferService.buffer;
                            m.ybase !== m.ydisp && this._scrollToBottom();
                            f && this._onUserInput.fire();
                            this._logService.debug('sending data "' + e + '"', function() {
                                return e.split("").map(function(u) {
                                    return u.charCodeAt(0)
                                })
                            });
                            this._onData.fire(e)
                        }
                    }
                    ,
                    b.prototype.triggerBinaryEvent = function(e) {
                        this._optionsService.rawOptions.disableStdin || (this._logService.debug('sending binary "' + e + '"', function() {
                            return e.split("").map(function(f) {
                                return f.charCodeAt(0)
                            })
                        }),
                        this._onBinary.fire(e))
                    }
                    ,
                    p([t(1, n.IBufferService), t(2, n.ILogService), t(3, n.IOptionsService)], b)
                }(A.Disposable);
                l.CoreService = A
            },
            3730: function(A, l, q) {
                var h = this && this.__decorate || function(t, n, g, k) {
                    var d, c = arguments.length, a = 3 > c ? n : null === k ? k = Object.getOwnPropertyDescriptor(n, g) : k;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        a = Reflect.decorate(t, n, g, k);
                    else
                        for (var b = t.length - 1; 0 <= b; b--)
                            (d = t[b]) && (a = (3 > c ? d(a) : 3 < c ? d(n, g, a) : d(n, g)) || a);
                    return 3 < c && a && Object.defineProperty(n, g, a),
                    a
                }
                  , v = this && this.__param || function(t, n) {
                    return function(g, k) {
                        n(g, k, t)
                    }
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.DirtyRowService = void 0;
                var p = q(2585);
                A = function() {
                    function t(n) {
                        this._bufferService = n;
                        this.clearRange()
                    }
                    return Object.defineProperty(t.prototype, "start", {
                        get: function() {
                            return this._start
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(t.prototype, "end", {
                        get: function() {
                            return this._end
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype.clearRange = function() {
                        this._end = this._start = this._bufferService.buffer.y
                    }
                    ,
                    t.prototype.markDirty = function(n) {
                        n < this._start ? this._start = n : n > this._end && (this._end = n)
                    }
                    ,
                    t.prototype.markRangeDirty = function(n, g) {
                        if (n > g) {
                            var k = n;
                            n = g;
                            g = k
                        }
                        n < this._start && (this._start = n);
                        g > this._end && (this._end = g)
                    }
                    ,
                    t.prototype.markAllDirty = function() {
                        this.markRangeDirty(0, this._bufferService.rows - 1)
                    }
                    ,
                    h([v(0, p.IBufferService)], t)
                }();
                l.DirtyRowService = A
            },
            4348: function(A, l, q) {
                var h = this && this.__spreadArray || function(n, g, k) {
                    if (k || 2 === arguments.length)
                        for (var d, c = 0, a = g.length; c < a; c++)
                            !d && c in g || (d || (d = Array.prototype.slice.call(g, 0, c)),
                            d[c] = g[c]);
                    return n.concat(d || Array.prototype.slice.call(g))
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.InstantiationService = l.ServiceCollection = void 0;
                var v = q(2585)
                  , p = q(8343)
                  , t = function() {
                    function n() {
                        for (var g = [], k = 0; k < arguments.length; k++)
                            g[k] = arguments[k];
                        this._entries = new Map;
                        for (k = 0; k < g.length; k++) {
                            var d = g[k];
                            this.set(d[0], d[1])
                        }
                    }
                    return n.prototype.set = function(g, k) {
                        var d = this._entries.get(g);
                        return this._entries.set(g, k),
                        d
                    }
                    ,
                    n.prototype.forEach = function(g) {
                        this._entries.forEach(function(k, d) {
                            return g(d, k)
                        })
                    }
                    ,
                    n.prototype.has = function(g) {
                        return this._entries.has(g)
                    }
                    ,
                    n.prototype.get = function(g) {
                        return this._entries.get(g)
                    }
                    ,
                    n
                }();
                l.ServiceCollection = t;
                A = function() {
                    function n() {
                        this._services = new t;
                        this._services.set(v.IInstantiationService, this)
                    }
                    return n.prototype.setService = function(g, k) {
                        this._services.set(g, k)
                    }
                    ,
                    n.prototype.getService = function(g) {
                        return this._services.get(g)
                    }
                    ,
                    n.prototype.createInstance = function(g) {
                        for (var k = [], d = 1; d < arguments.length; d++)
                            k[d - 1] = arguments[d];
                        var c = (0,
                        p.getServiceDependencies)(g).sort(function(f, m) {
                            return f.index - m.index
                        });
                        d = [];
                        for (var a = 0; a < c.length; a++) {
                            var b = c[a]
                              , e = this._services.get(b.id);
                            if (!e)
                                throw Error("[createInstance] " + g.name + " depends on UNKNOWN service " + b.id + ".");
                            d.push(e)
                        }
                        c = 0 < c.length ? c[0].index : k.length;
                        if (k.length !== c)
                            throw Error("[createInstance] First service dependency of " + g.name + " at position " + (c + 1) + " conflicts with " + k.length + " static arguments");
                        return new (g.bind.apply(g, h([void 0], h(h([], k, !0), d, !0), !1)))
                    }
                    ,
                    n
                }();
                l.InstantiationService = A
            },
            7866: function(A, l, q) {
                var h = this && this.__decorate || function(g, k, d, c) {
                    var a, b = arguments.length, e = 3 > b ? k : null === c ? c = Object.getOwnPropertyDescriptor(k, d) : c;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        e = Reflect.decorate(g, k, d, c);
                    else
                        for (var f = g.length - 1; 0 <= f; f--)
                            (a = g[f]) && (e = (3 > b ? a(e) : 3 < b ? a(k, d, e) : a(k, d)) || e);
                    return 3 < b && e && Object.defineProperty(k, d, e),
                    e
                }
                  , v = this && this.__param || function(g, k) {
                    return function(d, c) {
                        k(d, c, g)
                    }
                }
                  , p = this && this.__spreadArray || function(g, k, d) {
                    if (d || 2 === arguments.length)
                        for (var c, a = 0, b = k.length; a < b; a++)
                            !c && a in k || (c || (c = Array.prototype.slice.call(k, 0, a)),
                            c[a] = k[a]);
                    return g.concat(c || Array.prototype.slice.call(k))
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.LogService = void 0;
                var t = q(2585)
                  , n = {
                    debug: t.LogLevelEnum.DEBUG,
                    info: t.LogLevelEnum.INFO,
                    warn: t.LogLevelEnum.WARN,
                    error: t.LogLevelEnum.ERROR,
                    off: t.LogLevelEnum.OFF
                };
                A = function() {
                    function g(k) {
                        var d = this;
                        this._optionsService = k;
                        this.logLevel = t.LogLevelEnum.OFF;
                        this._updateLogLevel();
                        this._optionsService.onOptionChange(function(c) {
                            "logLevel" === c && d._updateLogLevel()
                        })
                    }
                    return g.prototype._updateLogLevel = function() {
                        this.logLevel = n[this._optionsService.rawOptions.logLevel]
                    }
                    ,
                    g.prototype._evalLazyOptionalParams = function(k) {
                        for (var d = 0; d < k.length; d++)
                            "function" == typeof k[d] && (k[d] = k[d]())
                    }
                    ,
                    g.prototype._log = function(k, d, c) {
                        this._evalLazyOptionalParams(c);
                        k.call.apply(k, p([console, "xterm.js: " + d], c, !1))
                    }
                    ,
                    g.prototype.debug = function(k) {
                        for (var d = [], c = 1; c < arguments.length; c++)
                            d[c - 1] = arguments[c];
                        this.logLevel <= t.LogLevelEnum.DEBUG && this._log(console.log, k, d)
                    }
                    ,
                    g.prototype.info = function(k) {
                        for (var d = [], c = 1; c < arguments.length; c++)
                            d[c - 1] = arguments[c];
                        this.logLevel <= t.LogLevelEnum.INFO && this._log(console.info, k, d)
                    }
                    ,
                    g.prototype.warn = function(k) {
                        for (var d = [], c = 1; c < arguments.length; c++)
                            d[c - 1] = arguments[c];
                        this.logLevel <= t.LogLevelEnum.WARN && this._log(console.warn, k, d)
                    }
                    ,
                    g.prototype.error = function(k) {
                        for (var d = [], c = 1; c < arguments.length; c++)
                            d[c - 1] = arguments[c];
                        this.logLevel <= t.LogLevelEnum.ERROR && this._log(console.error, k, d)
                    }
                    ,
                    h([v(0, t.IOptionsService)], g)
                }();
                l.LogService = A
            },
            7302: function(A, l, q) {
                var h = this && this.__assign || function() {
                    return h = Object.assign || function(t) {
                        for (var n, g = 1, k = arguments.length; g < k; g++)
                            for (var d in n = arguments[g])
                                Object.prototype.hasOwnProperty.call(n, d) && (t[d] = n[d]);
                        return t
                    }
                    ,
                    h.apply(this, arguments)
                }
                ;
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.OptionsService = l.DEFAULT_OPTIONS = l.DEFAULT_BELL_SOUND = void 0;
                var v = q(8460);
                A = q(6114);
                l.DEFAULT_BELL_SOUND = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
                l.DEFAULT_OPTIONS = {
                    cols: 80,
                    rows: 24,
                    cursorBlink: !1,
                    cursorStyle: "block",
                    cursorWidth: 1,
                    customGlyphs: !0,
                    bellSound: l.DEFAULT_BELL_SOUND,
                    bellStyle: "none",
                    drawBoldTextInBrightColors: !0,
                    fastScrollModifier: "alt",
                    fastScrollSensitivity: 5,
                    fontFamily: "courier-new, courier, monospace",
                    fontSize: 15,
                    fontWeight: "normal",
                    fontWeightBold: "bold",
                    lineHeight: 1,
                    linkTooltipHoverDuration: 500,
                    letterSpacing: 0,
                    logLevel: "info",
                    scrollback: 1E3,
                    scrollSensitivity: 1,
                    screenReaderMode: !1,
                    macOptionIsMeta: !1,
                    macOptionClickForcesSelection: !1,
                    minimumContrastRatio: 1,
                    disableStdin: !1,
                    allowProposedApi: !0,
                    allowTransparency: !1,
                    tabStopWidth: 8,
                    theme: {},
                    rightClickSelectsWord: A.isMac,
                    rendererType: "canvas",
                    windowOptions: {},
                    windowsMode: !1,
                    wordSeparator: " ()[]{}',\"`",
                    altClickMovesCursor: !0,
                    convertEol: !1,
                    termName: "xterm",
                    cancelEvents: !1
                };
                var p = "normal bold 100 200 300 400 500 600 700 800 900".split(" ");
                A = function() {
                    function t(n) {
                        this._onOptionChange = new v.EventEmitter;
                        var g = h({}, l.DEFAULT_OPTIONS), k;
                        for (k in n)
                            if (k in g)
                                try {
                                    g[k] = this._sanitizeAndValidateOption(k, n[k])
                                } catch (d) {
                                    console.error(d)
                                }
                        this.rawOptions = g;
                        this.options = h({}, g);
                        this._setupOptions()
                    }
                    return Object.defineProperty(t.prototype, "onOptionChange", {
                        get: function() {
                            return this._onOptionChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    t.prototype._setupOptions = function() {
                        var n = this, g = function(a) {
                            if (!(a in l.DEFAULT_OPTIONS))
                                throw Error('No option with key "' + a + '"');
                            return n.rawOptions[a]
                        }, k = function(a, b) {
                            if (!(a in l.DEFAULT_OPTIONS))
                                throw Error('No option with key "' + a + '"');
                            b = n._sanitizeAndValidateOption(a, b);
                            n.rawOptions[a] !== b && (n.rawOptions[a] = b,
                            n._onOptionChange.fire(a))
                        }, d;
                        for (d in this.rawOptions) {
                            var c = {
                                get: g.bind(this, d),
                                set: k.bind(this, d)
                            };
                            Object.defineProperty(this.options, d, c)
                        }
                    }
                    ,
                    t.prototype.setOption = function(n, g) {
                        this.options[n] = g
                    }
                    ,
                    t.prototype._sanitizeAndValidateOption = function(n, g) {
                        switch (n) {
                        case "bellStyle":
                        case "cursorStyle":
                        case "rendererType":
                        case "wordSeparator":
                            g || (g = l.DEFAULT_OPTIONS[n]);
                            break;
                        case "fontWeight":
                        case "fontWeightBold":
                            if ("number" == typeof g && 1 <= g && 1E3 >= g)
                                break;
                            g = p.includes(g) ? g : l.DEFAULT_OPTIONS[n];
                            break;
                        case "cursorWidth":
                            g = Math.floor(g);
                        case "lineHeight":
                        case "tabStopWidth":
                            if (1 > g)
                                throw Error(n + " cannot be less than 1, value: " + g);
                            break;
                        case "minimumContrastRatio":
                            g = Math.max(1, Math.min(21, Math.round(10 * g) / 10));
                            break;
                        case "scrollback":
                            if (0 > (g = Math.min(g, 4294967295)))
                                throw Error(n + " cannot be less than 0, value: " + g);
                            break;
                        case "fastScrollSensitivity":
                        case "scrollSensitivity":
                            if (0 >= g)
                                throw Error(n + " cannot be less than or equal to 0, value: " + g);
                        case "rows":
                        case "cols":
                            if (!g && 0 !== g)
                                throw Error(n + " must be numeric, value: " + g);
                        }
                        return g
                    }
                    ,
                    t.prototype.getOption = function(n) {
                        return this.options[n]
                    }
                    ,
                    t
                }();
                l.OptionsService = A
            },
            8343: (A, l) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.createDecorator = l.getServiceDependencies = l.serviceRegistry = void 0;
                l.serviceRegistry = new Map;
                l.getServiceDependencies = function(q) {
                    return q.di$dependencies || []
                }
                ;
                l.createDecorator = function(q) {
                    if (l.serviceRegistry.has(q))
                        return l.serviceRegistry.get(q);
                    var h = function(v, p, t) {
                        if (3 !== arguments.length)
                            throw Error("@IServiceName-decorator can only be used to decorate a parameter");
                        var n = h;
                        v.di$target === v ? v.di$dependencies.push({
                            id: n,
                            index: t
                        }) : (v.di$dependencies = [{
                            id: n,
                            index: t
                        }],
                        v.di$target = v)
                    };
                    return h.toString = function() {
                        return q
                    }
                    ,
                    l.serviceRegistry.set(q, h),
                    h
                }
            }
            ,
            2585: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.IUnicodeService = l.IOptionsService = l.ILogService = l.LogLevelEnum = l.IInstantiationService = l.IDirtyRowService = l.ICharsetService = l.ICoreService = l.ICoreMouseService = l.IBufferService = void 0;
                var h;
                A = q(8343);
                l.IBufferService = (0,
                A.createDecorator)("BufferService");
                l.ICoreMouseService = (0,
                A.createDecorator)("CoreMouseService");
                l.ICoreService = (0,
                A.createDecorator)("CoreService");
                l.ICharsetService = (0,
                A.createDecorator)("CharsetService");
                l.IDirtyRowService = (0,
                A.createDecorator)("DirtyRowService");
                l.IInstantiationService = (0,
                A.createDecorator)("InstantiationService");
                (h = l.LogLevelEnum || (l.LogLevelEnum = {}))[h.DEBUG = 0] = "DEBUG";
                h[h.INFO = 1] = "INFO";
                h[h.WARN = 2] = "WARN";
                h[h.ERROR = 3] = "ERROR";
                h[h.OFF = 4] = "OFF";
                l.ILogService = (0,
                A.createDecorator)("LogService");
                l.IOptionsService = (0,
                A.createDecorator)("OptionsService");
                l.IUnicodeService = (0,
                A.createDecorator)("UnicodeService")
            }
            ,
            1480: (A, l, q) => {
                Object.defineProperty(l, "__esModule", {
                    value: !0
                });
                l.UnicodeService = void 0;
                var h = q(8460)
                  , v = q(225);
                A = function() {
                    function p() {
                        this._providers = Object.create(null);
                        this._active = "";
                        this._onChange = new h.EventEmitter;
                        var t = new v.UnicodeV6;
                        this.register(t);
                        this._active = t.version;
                        this._activeProvider = t
                    }
                    return Object.defineProperty(p.prototype, "onChange", {
                        get: function() {
                            return this._onChange.event
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "versions", {
                        get: function() {
                            return Object.keys(this._providers)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    Object.defineProperty(p.prototype, "activeVersion", {
                        get: function() {
                            return this._active
                        },
                        set: function(t) {
                            if (!this._providers[t])
                                throw Error('unknown Unicode version "' + t + '"');
                            this._active = t;
                            this._activeProvider = this._providers[t];
                            this._onChange.fire(t)
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                    p.prototype.register = function(t) {
                        this._providers[t.version] = t
                    }
                    ,
                    p.prototype.wcwidth = function(t) {
                        return this._activeProvider.wcwidth(t)
                    }
                    ,
                    p.prototype.getStringCellWidth = function(t) {
                        for (var n = 0, g = t.length, k = 0; k < g; ++k) {
                            var d = t.charCodeAt(k);
                            if (55296 <= d && 56319 >= d) {
                                if (++k >= g)
                                    return n + this.wcwidth(d);
                                var c = t.charCodeAt(k);
                                56320 <= c && 57343 >= c ? d = 1024 * (d - 55296) + c - 56320 + 65536 : n += this.wcwidth(c)
                            }
                            n += this.wcwidth(d)
                        }
                        return n
                    }
                    ,
                    p
                }();
                l.UnicodeService = A
            }
        }
          , ja = {};
        return function q(l) {
            var h = ja[l];
            if (void 0 !== h)
                return h.exports;
            h = ja[l] = {
                exports: {}
            };
            return Bb[l].call(h.exports, h, h.exports, q),
            h.exports
        }(4389)
    }
    )()
});
