//# sourceMappingURL=blockly_compressed.js.map
var process = process || {
    env: {
        NODE_ENV: "development"
    }
};
(function(e, w) {
    "function" === typeof define && define.amd ? define([], w) : "object" === typeof exports ? module.exports = w() : e.Blockly = w()
}
)(this, function() {
    const e = {};
    var w = w || {};
    w.scope = {};
    w.createTemplateTagFirstArg = function(a) {
        return a.raw = a
    }
    ;
    w.createTemplateTagFirstArgWithRaw = function(a, b) {
        a.raw = b;
        return a
    }
    ;
    w.arrayIteratorImpl = function(a) {
        var b = 0;
        return function() {
            return b < a.length ? {
                done: !1,
                value: a[b++]
            } : {
                done: !0
            }
        }
    }
    ;
    w.arrayIterator = function(a) {
        return {
            next: w.arrayIteratorImpl(a)
        }
    }
    ;
    w.makeIterator = function(a) {
        var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return b ? b.call(a) : w.arrayIterator(a)
    }
    ;
    w.arrayFromIterator = function(a) {
        for (var b, c = []; !(b = a.next()).done; )
            c.push(b.value);
        return c
    }
    ;
    w.arrayFromIterable = function(a) {
        return a instanceof Array ? a : w.arrayFromIterator(w.makeIterator(a))
    }
    ;
    w.owns = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    }
    ;
    w.ASSUME_ES5 = !1;
    w.ASSUME_NO_NATIVE_MAP = !1;
    w.ASSUME_NO_NATIVE_SET = !1;
    w.SIMPLE_FROUND_POLYFILL = !1;
    w.ISOLATE_POLYFILLS = !1;
    w.FORCE_POLYFILL_PROMISE = !1;
    w.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
    w.defineProperty = w.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        if (a == Array.prototype || a == Object.prototype)
            return a;
        a[b] = c.value;
        return a
    }
    ;
    w.getGlobal = function(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math)
                return c
        }
        throw Error("Cannot find global object");
    }
    ;
    w.global = w.getGlobal(this);
    w.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
    w.TRUST_ES6_POLYFILLS = !w.ISOLATE_POLYFILLS || w.IS_SYMBOL_NATIVE;
    w.polyfills = {};
    w.propertyToPolyfillSymbol = {};
    w.POLYFILL_PREFIX = "$jscp$";
    w.polyfill = function(a, b, c, d) {
        b && (w.ISOLATE_POLYFILLS ? w.polyfillIsolated(a, b, c, d) : w.polyfillUnisolated(a, b, c, d))
    }
    ;
    w.polyfillUnisolated = function(a, b, c, d) {
        c = w.global;
        a = a.split(".");
        for (d = 0; d < a.length - 1; d++) {
            var f = a[d];
            if (!(f in c))
                return;
            c = c[f]
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && null != b && w.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
    ;
    w.polyfillIsolated = function(a, b, c, d) {
        var f = a.split(".");
        a = 1 === f.length;
        d = f[0];
        d = !a && d in w.polyfills ? w.polyfills : w.global;
        for (var g = 0; g < f.length - 1; g++) {
            var k = f[g];
            if (!(k in d))
                return;
            d = d[k]
        }
        f = f[f.length - 1];
        c = w.IS_SYMBOL_NATIVE && "es6" === c ? d[f] : null;
        b = b(c);
        null != b && (a ? w.defineProperty(w.polyfills, f, {
            configurable: !0,
            writable: !0,
            value: b
        }) : b !== c && (void 0 === w.propertyToPolyfillSymbol[f] && (c = 1E9 * Math.random() >>> 0,
        w.propertyToPolyfillSymbol[f] = w.IS_SYMBOL_NATIVE ? w.global.Symbol(f) : w.POLYFILL_PREFIX + c + "$" + f),
        w.defineProperty(d, w.propertyToPolyfillSymbol[f], {
            configurable: !0,
            writable: !0,
            value: b
        })))
    }
    ;
    w.assign = w.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (d)
                for (var f in d)
                    w.owns(d, f) && (a[f] = d[f])
        }
        return a
    }
    ;
    w.objectCreate = w.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
        var b = function() {};
        b.prototype = a;
        return new b
    }
    ;
    w.getConstructImplementation = function() {
        function a() {
            function c() {}
            new c;
            Reflect.construct(c, [], function() {});
            return new c instanceof c
        }
        if (w.TRUST_ES6_POLYFILLS && "undefined" != typeof Reflect && Reflect.construct) {
            if (a())
                return Reflect.construct;
            var b = Reflect.construct;
            return function(c, d, f) {
                c = b(c, d);
                f && Reflect.setPrototypeOf(c, f.prototype);
                return c
            }
        }
        return function(c, d, f) {
            void 0 === f && (f = c);
            f = w.objectCreate(f.prototype || Object.prototype);
            return Function.prototype.apply.call(c, f, d) || f
        }
    }
    ;
    w.construct = {
        valueOf: w.getConstructImplementation
    }.valueOf();
    w.underscoreProtoCanBeSet = function() {
        var a = {
            a: !0
        }
          , b = {};
        try {
            return b.__proto__ = a,
            b.a
        } catch (c) {}
        return !1
    }
    ;
    w.setPrototypeOf = w.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : w.underscoreProtoCanBeSet() ? function(a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b)
            throw new TypeError(a + " is not extensible");
        return a
    }
    : null;
    w.inherits = function(a, b) {
        a.prototype = w.objectCreate(b.prototype);
        a.prototype.constructor = a;
        if (w.setPrototypeOf) {
            var c = w.setPrototypeOf;
            c(a, b)
        } else
            for (c in b)
                if ("prototype" != c)
                    if (Object.defineProperties) {
                        var d = Object.getOwnPropertyDescriptor(b, c);
                        d && Object.defineProperty(a, c, d)
                    } else
                        a[c] = b[c];
        a.superClass_ = b.prototype
    }
    ;
    w.polyfill("Reflect", function(a) {
        return a ? a : {}
    }, "es6", "es3");
    w.polyfill("Reflect.construct", function(a) {
        return w.construct
    }, "es6", "es3");
    w.polyfill("Reflect.setPrototypeOf", function(a) {
        if (a)
            return a;
        if (w.setPrototypeOf) {
            var b = w.setPrototypeOf;
            return function(c, d) {
                try {
                    return b(c, d),
                    !0
                } catch (f) {
                    return !1
                }
            }
        }
        return null
    }, "es6", "es5");
    w.polyfill("globalThis", function(a) {
        return a || w.global
    }, "es_2020", "es3");
    w.checkStringArgs = function(a, b, c) {
        if (null == a)
            throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
        if (b instanceof RegExp)
            throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
        return a + ""
    }
    ;
    w.polyfill("String.prototype.startsWith", function(a) {
        return a ? a : function(b, c) {
            var d = w.checkStringArgs(this, b, "startsWith");
            b += "";
            var f = d.length
              , g = b.length;
            c = Math.max(0, Math.min(c | 0, d.length));
            for (var k = 0; k < g && c < f; )
                if (d[c++] != b[k++])
                    return !1;
            return k >= g
        }
    }, "es6", "es3");
    w.initSymbol = function() {}
    ;
    w.polyfill("Symbol", function(a) {
        if (a)
            return a;
        var b = function(g, k) {
            this.$jscomp$symbol$id_ = g;
            w.defineProperty(this, "description", {
                configurable: !0,
                writable: !0,
                value: k
            })
        };
        b.prototype.toString = function() {
            return this.$jscomp$symbol$id_
        }
        ;
        var c = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_"
          , d = 0
          , f = function(g) {
            if (this instanceof f)
                throw new TypeError("Symbol is not a constructor");
            return new b(c + (g || "") + "_" + d++,g)
        };
        return f
    }, "es6", "es3");
    w.polyfill("Symbol.iterator", function(a) {
        if (a)
            return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = w.global[b[c]];
            "function" === typeof d && "function" != typeof d.prototype[a] && w.defineProperty(d.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return w.iteratorPrototype(w.arrayIteratorImpl(this))
                }
            })
        }
        return a
    }, "es6", "es3");
    w.iteratorPrototype = function(a) {
        a = {
            next: a
        };
        a[Symbol.iterator] = function() {
            return this
        }
        ;
        return a
    }
    ;
    w.iteratorFromArray = function(a, b) {
        a instanceof String && (a += "");
        var c = 0
          , d = !1
          , f = {
            next: function() {
                if (!d && c < a.length) {
                    var g = c++;
                    return {
                        value: b(g, a[g]),
                        done: !1
                    }
                }
                d = !0;
                return {
                    done: !0,
                    value: void 0
                }
            }
        };
        f[Symbol.iterator] = function() {
            return f
        }
        ;
        return f
    }
    ;
    w.polyfill("Array.prototype.keys", function(a) {
        return a ? a : function() {
            return w.iteratorFromArray(this, function(b) {
                return b
            })
        }
    }, "es6", "es3");
    w.polyfill("Object.setPrototypeOf", function(a) {
        return a || w.setPrototypeOf
    }, "es6", "es5");
    w.polyfill("Array.prototype.values", function(a) {
        return a ? a : function() {
            return w.iteratorFromArray(this, function(b, c) {
                return c
            })
        }
    }, "es8", "es3");
    w.polyfill("Object.entries", function(a) {
        return a ? a : function(b) {
            var c = [], d;
            for (d in b)
                w.owns(b, d) && c.push([d, b[d]]);
            return c
        }
    }, "es8", "es3");
    w.polyfill("Array.prototype.fill", function(a) {
        return a ? a : function(b, c, d) {
            var f = this.length || 0;
            0 > c && (c = Math.max(0, f + c));
            if (null == d || d > f)
                d = f;
            d = Number(d);
            0 > d && (d = Math.max(0, f + d));
            for (c = Number(c || 0); c < d; c++)
                this[c] = b;
            return this
        }
    }, "es6", "es3");
    w.typedArrayFill = function(a) {
        return a ? a : Array.prototype.fill
    }
    ;
    w.polyfill("Int8Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Uint8Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Uint8ClampedArray.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Int16Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Uint16Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Int32Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Uint32Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Float32Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    w.polyfill("Float64Array.prototype.fill", w.typedArrayFill, "es6", "es5");
    var lb = lb || {};
    lb.global = globalThis || root;
    lb.define = function(a, b) {
        return b
    }
    ;
    lb.DEBUG = !1;
    lb.DISALLOW_TEST_ONLY_CODE = !lb.DEBUG;
    lb.provide = function(a) {}
    ;
    lb.module = function(a) {}
    ;
    lb.module.get = function(a) {}
    ;
    lb.module.declareLegacyNamespace = function() {}
    ;
    lb.setTestOnly = function(a) {
        if (lb.DISALLOW_TEST_ONLY_CODE)
            throw a = a || "",
            Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
    }
    ;
    lb.require = function(a) {}
    ;
    lb.requireType = function(a) {}
    ;
    var V = {
        warn: function(a, b, c, d) {
            a = a + " was deprecated on " + b + " and will be deleted on " + c + ".";
            d && (a += "\nUse " + d + " instead.");
            console.warn(a)
        }
    }
      , Ia = {}
      , Kd = !1;
    Ia.register = function(a) {
        if (Kd)
            throw Error("CSS already injected");
        Array.isArray(a) ? ((0,
        V.warn)("Registering CSS by passing an array of strings", "September 2021", "September 2022", "css.register passing a multiline string"),
        Ia.content += "\n" + a.join("\n")) : Ia.content += "\n" + a
    }
    ;
    Ia.inject = function(a, b) {
        Kd || (Kd = !0,
        a && (a = b.replace(/[\\/]$/, ""),
        b = Ia.content.replace(/<<<PATH>>>/g, a),
        Ia.content = "",
        a = document.createElement("style"),
        a.id = "blockly-common-style",
        b = document.createTextNode(b),
        a.appendChild(b),
        document.head.insertBefore(a, document.head.firstChild)))
    }
    ;
    Ia.content = '\n  .blocklySvg {\n    background-color: #fff;\n    outline: none;\n    overflow: hidden;  /* IE overflows by default. */\n    position: absolute;\n    display: block;\n  }\n\n  .blocklyWidgetDiv {\n    display: none;\n    position: absolute;\n    z-index: 99999;  /* big value for bootstrap3 compatibility */\n  }\n\n  .injectionDiv {\n    height: 100%;\n    position: relative;\n    overflow: hidden;  /* So blocks in drag surface disappear at edges */\n    touch-action: none;\n  }\n\n  .blocklyNonSelectable {\n    user-select: none;\n    -ms-user-select: none;\n    -webkit-user-select: none;\n  }\n\n  .blocklyWsDragSurface {\n    display: none;\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  /* Added as a separate rule with multiple classes to make it more specific\n     than a bootstrap rule that selects svg:root. See issue #1275 for context.\n  */\n  .blocklyWsDragSurface.blocklyOverflowVisible {\n    overflow: visible;\n  }\n\n  .blocklyBlockDragSurface {\n    display: none;\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    overflow: visible !important;\n    z-index: 50;  /* Display below toolbox, but above everything else. */\n  }\n\n  .blocklyBlockCanvas.blocklyCanvasTransitioning,\n  .blocklyBubbleCanvas.blocklyCanvasTransitioning {\n    transition: transform .5s;\n  }\n\n  .blocklyTooltipDiv {\n    background-color: #ffffc7;\n    border: 1px solid #ddc;\n    box-shadow: 4px 4px 20px 1px rgba(0,0,0,.15);\n    color: #000;\n    display: none;\n    font: 9pt sans-serif;\n    opacity: .9;\n    padding: 2px;\n    position: absolute;\n    z-index: 100000;  /* big value for bootstrap3 compatibility */\n  }\n\n  .blocklyDropDownDiv {\n    position: absolute;\n    left: 0;\n    top: 0;\n    z-index: 1000;\n    display: none;\n    border: 1px solid;\n    border-color: #dadce0;\n    background-color: #fff;\n    border-radius: 2px;\n    padding: 4px;\n    box-shadow: 0 0 3px 1px rgba(0,0,0,.3);\n  }\n\n  .blocklyDropDownDiv.blocklyFocused {\n    box-shadow: 0 0 6px 1px rgba(0,0,0,.3);\n  }\n\n  .blocklyDropDownContent {\n    max-height: 300px;  // @todo: spec for maximum height.\n    overflow: auto;\n    overflow-x: hidden;\n    position: relative;\n  }\n\n  .blocklyDropDownArrow {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 16px;\n    height: 16px;\n    z-index: -1;\n    background-color: inherit;\n    border-color: inherit;\n  }\n\n  .blocklyDropDownButton {\n    display: inline-block;\n    float: left;\n    padding: 0;\n    margin: 4px;\n    border-radius: 4px;\n    outline: none;\n    border: 1px solid;\n    transition: box-shadow .1s;\n    cursor: pointer;\n  }\n\n  .blocklyArrowTop {\n    border-top: 1px solid;\n    border-left: 1px solid;\n    border-top-left-radius: 4px;\n    border-color: inherit;\n  }\n\n  .blocklyArrowBottom {\n    border-bottom: 1px solid;\n    border-right: 1px solid;\n    border-bottom-right-radius: 4px;\n    border-color: inherit;\n  }\n\n  .blocklyResizeSE {\n    cursor: se-resize;\n    fill: #aaa;\n  }\n\n  .blocklyResizeSW {\n    cursor: sw-resize;\n    fill: #aaa;\n  }\n\n  .blocklyResizeLine {\n    stroke: #515A5A;\n    stroke-width: 1;\n  }\n\n  .blocklyHighlightedConnectionPath {\n    fill: none;\n    stroke: #fc3;\n    stroke-width: 4px;\n  }\n\n  .blocklyPathLight {\n    fill: none;\n    stroke-linecap: round;\n    stroke-width: 1;\n  }\n\n  .blocklySelected>.blocklyPathLight {\n    display: none;\n  }\n\n  .blocklyDraggable {\n    /* backup for browsers (e.g. IE11) that don\'t support grab */\n    cursor: url("<<<PATH>>>/handopen.cur"), auto;\n    cursor: grab;\n    cursor: -webkit-grab;\n  }\n\n    /* backup for browsers (e.g. IE11) that don\'t support grabbing */\n  .blocklyDragging {\n    /* backup for browsers (e.g. IE11) that don\'t support grabbing */\n    cursor: url("<<<PATH>>>/handclosed.cur"), auto;\n    cursor: grabbing;\n    cursor: -webkit-grabbing;\n  }\n\n    /* Changes cursor on mouse down. Not effective in Firefox because of\n       https://bugzilla.mozilla.org/show_bug.cgi?id=771241 */\n  .blocklyDraggable:active {\n    /* backup for browsers (e.g. IE11) that don\'t support grabbing */\n    cursor: url("<<<PATH>>>/handclosed.cur"), auto;\n    cursor: grabbing;\n    cursor: -webkit-grabbing;\n  }\n\n  /* Change the cursor on the whole drag surface in case the mouse gets\n     ahead of block during a drag. This way the cursor is still a closed hand.\n    */\n  .blocklyBlockDragSurface .blocklyDraggable {\n    /* backup for browsers (e.g. IE11) that don\'t support grabbing */\n    cursor: url("<<<PATH>>>/handclosed.cur"), auto;\n    cursor: grabbing;\n    cursor: -webkit-grabbing;\n  }\n\n  .blocklyDragging.blocklyDraggingDelete {\n    cursor: url("<<<PATH>>>/handdelete.cur"), auto;\n  }\n\n  .blocklyDragging>.blocklyPath,\n  .blocklyDragging>.blocklyPathLight {\n    fill-opacity: .8;\n    stroke-opacity: .8;\n  }\n\n  .blocklyDragging>.blocklyPathDark {\n    display: none;\n  }\n\n  .blocklyDisabled>.blocklyPath {\n    fill-opacity: .5;\n    stroke-opacity: .5;\n  }\n\n  .blocklyDisabled>.blocklyPathLight,\n  .blocklyDisabled>.blocklyPathDark {\n    display: none;\n  }\n\n  .blocklyInsertionMarker>.blocklyPath,\n  .blocklyInsertionMarker>.blocklyPathLight,\n  .blocklyInsertionMarker>.blocklyPathDark {\n    fill-opacity: .2;\n    stroke: none;\n  }\n\n  .blocklyMultilineText {\n    font-family: monospace;\n  }\n\n  .blocklyNonEditableText>text {\n    pointer-events: none;\n  }\n\n  .blocklyFlyout {\n    position: absolute;\n    z-index: 20;\n  }\n\n  .blocklyText text {\n    cursor: default;\n  }\n\n  /*\n    Don\'t allow users to select text.  It gets annoying when trying to\n    drag a block and selected text moves instead.\n  */\n  .blocklySvg text,\n  .blocklyBlockDragSurface text {\n    user-select: none;\n    -ms-user-select: none;\n    -webkit-user-select: none;\n    cursor: inherit;\n  }\n\n  .blocklyHidden {\n    display: none;\n  }\n\n  .blocklyFieldDropdown:not(.blocklyHidden) {\n    display: block;\n  }\n\n  .blocklyIconGroup {\n    cursor: default;\n  }\n\n  .blocklyIconGroup:not(:hover),\n  .blocklyIconGroupReadonly {\n    opacity: .6;\n  }\n\n  .blocklyIconShape {\n    fill: #00f;\n    stroke: #fff;\n    stroke-width: 1px;\n  }\n\n  .blocklyIconSymbol {\n    fill: #fff;\n  }\n\n  .blocklyMinimalBody {\n    margin: 0;\n    padding: 0;\n  }\n\n  .blocklyHtmlInput {\n    border: none;\n    border-radius: 4px;\n    height: 100%;\n    margin: 0;\n    outline: none;\n    padding: 0;\n    width: 100%;\n    text-align: center;\n    display: block;\n    box-sizing: border-box;\n  }\n\n  /* Edge and IE introduce a close icon when the input value is longer than a\n     certain length. This affects our sizing calculations of the text input.\n     Hiding the close icon to avoid that. */\n  .blocklyHtmlInput::-ms-clear {\n    display: none;\n  }\n\n  .blocklyMainBackground {\n    stroke-width: 1;\n    stroke: #c6c6c6;  /* Equates to #ddd due to border being off-pixel. */\n  }\n\n  .blocklyMutatorBackground {\n    fill: #fff;\n    stroke: #ddd;\n    stroke-width: 1;\n  }\n\n  .blocklyFlyoutBackground {\n    fill: #ddd;\n    fill-opacity: .8;\n  }\n\n  .blocklyMainWorkspaceScrollbar {\n    z-index: 20;\n  }\n\n  .blocklyFlyoutScrollbar {\n    z-index: 30;\n  }\n\n  .blocklyScrollbarHorizontal,\n  .blocklyScrollbarVertical {\n    position: absolute;\n    outline: none;\n  }\n\n  .blocklyScrollbarBackground {\n    opacity: 0;\n  }\n\n  .blocklyScrollbarHandle {\n    fill: #ccc;\n  }\n\n  .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,\n  .blocklyScrollbarHandle:hover {\n    fill: #bbb;\n  }\n\n  /* Darken flyout scrollbars due to being on a grey background. */\n  /* By contrast, workspace scrollbars are on a white background. */\n  .blocklyFlyout .blocklyScrollbarHandle {\n    fill: #bbb;\n  }\n\n  .blocklyFlyout .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,\n  .blocklyFlyout .blocklyScrollbarHandle:hover {\n    fill: #aaa;\n  }\n\n  .blocklyInvalidInput {\n    background: #faa;\n  }\n\n  .blocklyVerticalMarker {\n    stroke-width: 3px;\n    fill: rgba(255,255,255,.5);\n    pointer-events: none;\n  }\n\n  .blocklyComputeCanvas {\n    position: absolute;\n    width: 0;\n    height: 0;\n  }\n\n  .blocklyNoPointerEvents {\n    pointer-events: none;\n  }\n\n  .blocklyContextMenu {\n    border-radius: 4px;\n    max-height: 100%;\n  }\n\n  .blocklyDropdownMenu {\n    border-radius: 2px;\n    padding: 0 !important;\n  }\n\n  .blocklyDropdownMenu .blocklyMenuItem {\n    /* 28px on the left for icon or checkbox. */\n    padding-left: 28px;\n  }\n\n  /* BiDi override for the resting state. */\n  .blocklyDropdownMenu .blocklyMenuItemRtl {\n    /* Flip left/right padding for BiDi. */\n    padding-left: 5px;\n    padding-right: 28px;\n  }\n\n  .blocklyWidgetDiv .blocklyMenu {\n    background: #fff;\n    border: 1px solid transparent;\n    box-shadow: 0 0 3px 1px rgba(0,0,0,.3);\n    font: normal 13px Arial, sans-serif;\n    margin: 0;\n    outline: none;\n    padding: 4px 0;\n    position: absolute;\n    overflow-y: auto;\n    overflow-x: hidden;\n    max-height: 100%;\n    z-index: 20000;  /* Arbitrary, but some apps depend on it... */\n  }\n\n  .blocklyWidgetDiv .blocklyMenu.blocklyFocused {\n    box-shadow: 0 0 6px 1px rgba(0,0,0,.3);\n  }\n\n  .blocklyDropDownDiv .blocklyMenu {\n    background: inherit;  /* Compatibility with gapi, reset from goog-menu */\n    border: inherit;  /* Compatibility with gapi, reset from goog-menu */\n    font: normal 13px "Helvetica Neue", Helvetica, sans-serif;\n    outline: none;\n    position: relative;  /* Compatibility with gapi, reset from goog-menu */\n    z-index: 20000;  /* Arbitrary, but some apps depend on it... */\n  }\n\n  /* State: resting. */\n  .blocklyMenuItem {\n    border: none;\n    color: #000;\n    cursor: pointer;\n    list-style: none;\n    margin: 0;\n    /* 7em on the right for shortcut. */\n    min-width: 7em;\n    padding: 6px 15px;\n    white-space: nowrap;\n  }\n\n  /* State: disabled. */\n  .blocklyMenuItemDisabled {\n    color: #ccc;\n    cursor: inherit;\n  }\n\n  /* State: hover. */\n  .blocklyMenuItemHighlight {\n    background-color: rgba(0,0,0,.1);\n  }\n\n  /* State: selected/checked. */\n  .blocklyMenuItemCheckbox {\n    height: 16px;\n    position: absolute;\n    width: 16px;\n  }\n\n  .blocklyMenuItemSelected .blocklyMenuItemCheckbox {\n    background: url(<<<PATH>>>/sprites.png) no-repeat -48px -16px;\n    float: left;\n    margin-left: -24px;\n    position: static;  /* Scroll with the menu. */\n  }\n\n  .blocklyMenuItemRtl .blocklyMenuItemCheckbox {\n    float: right;\n    margin-right: -24px;\n  }\n';
    e.module$exports$Blockly$utils$string = {
        startsWith: function(a, b) {
            return 0 === a.lastIndexOf(b, 0)
        },
        shortestStringLength: function(a) {
            return a.length ? a.reduce(function(b, c) {
                return b.length < c.length ? b : c
            }).length : 0
        },
        commonWordPrefix: function(a, b) {
            if (!a.length)
                return 0;
            if (1 === a.length)
                return a[0].length;
            var c = 0;
            b = b || (0,
            e.module$exports$Blockly$utils$string.shortestStringLength)(a);
            var d;
            for (d = 0; d < b; d++) {
                for (var f = a[0][d], g = 1; g < a.length; g++)
                    if (f !== a[g][d])
                        return c;
                " " === f && (c = d + 1)
            }
            for (f = 1; f < a.length; f++)
                if ((g = a[f][d]) && " " !== g)
                    return c;
            return b
        },
        commonWordSuffix: function(a, b) {
            if (!a.length)
                return 0;
            if (1 === a.length)
                return a[0].length;
            var c = 0;
            b = b || (0,
            e.module$exports$Blockly$utils$string.shortestStringLength)(a);
            var d;
            for (d = 0; d < b; d++) {
                for (var f = a[0].substr(-d - 1, 1), g = 1; g < a.length; g++)
                    if (f !== a[g].substr(-d - 1, 1))
                        return c;
                " " === f && (c = d + 1)
            }
            for (f = 1; f < a.length; f++)
                if ((g = a[f].charAt(a[f].length - d - 1)) && " " !== g)
                    return c;
            return b
        },
        wrap: function(a, b) {
            a = a.split("\n");
            for (var c = 0; c < a.length; c++)
                a[c] = Qe(a[c], b);
            return a.join("\n")
        }
    };
    var Qe = function(a, b) {
        if (a.length <= b)
            return a;
        for (var c = a.trim().split(/\s+/), d = 0; d < c.length; d++)
            c[d].length > b && (b = c[d].length);
        var f = -Infinity
          , g = 1;
        do {
            d = f;
            var k = a;
            a = [];
            f = c.length / g;
            for (var n = 1, x = 0; x < c.length - 1; x++)
                n < (x + 1.5) / f ? (n++,
                a[x] = !0) : a[x] = !1;
            a = ce(c, a, b);
            f = Ld(c, a, b);
            a = Re(c, a);
            g++
        } while (f > d);
        return k
    };
    var Ld = function(a, b, c) {
        for (var d = [0], f = [], g = 0; g < a.length; g++)
            d[d.length - 1] += a[g].length,
            !0 === b[g] ? (d.push(0),
            f.push(a[g].charAt(a[g].length - 1))) : !1 === b[g] && d[d.length - 1]++;
        a = Math.max.apply(Math, d);
        for (g = b = 0; g < d.length; g++)
            b -= 2 * Math.pow(Math.abs(c - d[g]), 1.5),
            b -= Math.pow(a - d[g], 1.5),
            -1 !== ".?!".indexOf(f[g]) ? b += c / 3 : -1 !== ",;)]}".indexOf(f[g]) && (b += c / 4);
        1 < d.length && d[d.length - 1] <= d[d.length - 2] && (b += .5);
        return b
    };
    var ce = function(a, b, c) {
        for (var d = Ld(a, b, c), f, g = 0; g < b.length - 1; g++)
            if (b[g] !== b[g + 1]) {
                var k = [].concat(b);
                k[g] = !k[g];
                k[g + 1] = !k[g + 1];
                var n = Ld(a, k, c);
                n > d && (d = n,
                f = k)
            }
        return f ? ce(a, f, c) : b
    };
    var Re = function(a, b) {
        for (var c = [], d = 0; d < a.length; d++)
            c.push(a[d]),
            void 0 !== b[d] && c.push(b[d] ? "\n" : " ");
        return c.join("")
    };
    e.module$exports$Blockly$utils$string.isNumber = function(a) {
        return /^\s*-?\d+(\.\d+)?\s*$/.test(a)
    }
    ;
    e.module$exports$Blockly$ConnectionType = {
        ConnectionType: {
            INPUT_VALUE: 1,
            OUTPUT_VALUE: 2,
            NEXT_STATEMENT: 3,
            PREVIOUS_STATEMENT: 4
        }
    };
    e.module$exports$Blockly$internalConstants = {
        LINE_MODE_MULTIPLIER: 40,
        PAGE_MODE_MULTIPLIER: 125,
        DRAG_RADIUS: 5,
        FLYOUT_DRAG_RADIUS: 10,
        SNAP_RADIUS: 28
    };
    e.module$exports$Blockly$internalConstants.CONNECTING_SNAP_RADIUS = e.module$exports$Blockly$internalConstants.SNAP_RADIUS;
    e.module$exports$Blockly$internalConstants.CURRENT_CONNECTION_PREFERENCE = 8;
    e.module$exports$Blockly$internalConstants.BUMP_DELAY = 250;
    e.module$exports$Blockly$internalConstants.BUMP_RANDOMNESS = 10;
    e.module$exports$Blockly$internalConstants.COLLAPSE_CHARS = 30;
    e.module$exports$Blockly$internalConstants.LONGPRESS = 750;
    e.module$exports$Blockly$internalConstants.SOUND_LIMIT = 100;
    e.module$exports$Blockly$internalConstants.DRAG_STACK = !0;
    e.module$exports$Blockly$internalConstants.SPRITE = {
        width: 96,
        height: 124,
        url: "sprites.png"
    };
    e.module$exports$Blockly$internalConstants.DRAG_NONE = 0;
    e.module$exports$Blockly$internalConstants.DRAG_STICKY = 1;
    e.module$exports$Blockly$internalConstants.DRAG_BEGIN = 1;
    e.module$exports$Blockly$internalConstants.DRAG_FREE = 2;
    e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE = [];
    e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE] = e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE;
    e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE] = e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE;
    e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT] = e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT;
    e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT] = e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT;
    e.module$exports$Blockly$internalConstants.RENAME_VARIABLE_ID = "RENAME_VARIABLE_ID";
    e.module$exports$Blockly$internalConstants.DELETE_VARIABLE_ID = "DELETE_VARIABLE_ID";
    e.module$exports$Blockly$utils$global = {};
    e.module$exports$Blockly$utils$global.globalThis = function() {
        return "object" === typeof globalThis ? globalThis : "object" === typeof self ? self : "object" === typeof window ? window : "object" === typeof global ? global : this
    }();
    var N = {};
    N.TOUCH_ENABLED = "ontouchstart"in e.module$exports$Blockly$utils$global.globalThis || !!(e.module$exports$Blockly$utils$global.globalThis.document && document.documentElement && "ontouchstart"in document.documentElement) || !(!e.module$exports$Blockly$utils$global.globalThis.navigator || !e.module$exports$Blockly$utils$global.globalThis.navigator.maxTouchPoints && !e.module$exports$Blockly$utils$global.globalThis.navigator.msMaxTouchPoints);
    var Sc = null;
    N.TOUCH_MAP = {};
    e.module$exports$Blockly$utils$global.globalThis.PointerEvent ? N.TOUCH_MAP = {
        mousedown: ["pointerdown"],
        mouseenter: ["pointerenter"],
        mouseleave: ["pointerleave"],
        mousemove: ["pointermove"],
        mouseout: ["pointerout"],
        mouseover: ["pointerover"],
        mouseup: ["pointerup", "pointercancel"],
        touchend: ["pointerup"],
        touchcancel: ["pointercancel"]
    } : N.TOUCH_ENABLED && (N.TOUCH_MAP = {
        mousedown: ["touchstart"],
        mousemove: ["touchmove"],
        mouseup: ["touchend", "touchcancel"]
    });
    var hd = 0;
    N.longStart = function(a, b) {
        (0,
        N.longStop)();
        a.changedTouches && 1 !== a.changedTouches.length || (hd = setTimeout(function() {
            a.changedTouches && (a.button = 2,
            a.clientX = a.changedTouches[0].clientX,
            a.clientY = a.changedTouches[0].clientY);
            b && b.handleRightClick(a)
        }, e.module$exports$Blockly$internalConstants.LONGPRESS))
    }
    ;
    N.longStop = function() {
        hd && (clearTimeout(hd),
        hd = 0)
    }
    ;
    N.clearTouchIdentifier = function() {
        Sc = null
    }
    ;
    N.shouldHandleEvent = function(a) {
        return !(0,
        N.isMouseOrTouchEvent)(a) || (0,
        N.checkTouchIdentifier)(a)
    }
    ;
    N.getTouchIdentifierFromEvent = function(a) {
        return void 0 !== a.pointerId ? a.pointerId : a.changedTouches && a.changedTouches[0] && void 0 !== a.changedTouches[0].identifier && null !== a.changedTouches[0].identifier ? a.changedTouches[0].identifier : "mouse"
    }
    ;
    N.checkTouchIdentifier = function(a) {
        var b = (0,
        N.getTouchIdentifierFromEvent)(a);
        return void 0 !== Sc && null !== Sc ? Sc === b : "mousedown" === a.type || "touchstart" === a.type || "pointerdown" === a.type ? (Sc = b,
        !0) : !1
    }
    ;
    N.setClientFromTouch = function(a) {
        if ((0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "touch")) {
            var b = a.changedTouches[0];
            a.clientX = b.clientX;
            a.clientY = b.clientY
        }
    }
    ;
    N.isMouseOrTouchEvent = function(a) {
        return (0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "touch") || (0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "mouse") || (0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "pointer")
    }
    ;
    N.isTouchEvent = function(a) {
        return (0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "touch") || (0,
        e.module$exports$Blockly$utils$string.startsWith)(a.type, "pointer")
    }
    ;
    N.splitEventByTouches = function(a) {
        var b = [];
        if (a.changedTouches)
            for (var c = 0; c < a.changedTouches.length; c++)
                b[c] = {
                    type: a.type,
                    changedTouches: [a.changedTouches[c]],
                    target: a.target,
                    stopPropagation: function() {
                        a.stopPropagation()
                    },
                    preventDefault: function() {
                        a.preventDefault()
                    }
                };
        else
            b.push(a);
        return b
    }
    ;
    var O = {};
    (function(a) {
        function b(d) {
            return -1 !== c.indexOf(d.toUpperCase())
        }
        O.raw = a;
        var c = O.raw.toUpperCase();
        O.IE = b("Trident") || b("MSIE");
        O.EDGE = b("Edge");
        O.JavaFx = b("JavaFX");
        O.CHROME = (b("Chrome") || b("CriOS")) && !O.EDGE;
        O.WEBKIT = b("WebKit") && !O.EDGE;
        O.GECKO = b("Gecko") && !O.WEBKIT && !O.IE && !O.EDGE;
        O.ANDROID = b("Android");
        a = e.module$exports$Blockly$utils$global.globalThis.navigator && e.module$exports$Blockly$utils$global.globalThis.navigator.maxTouchPoints;
        O.IPAD = b("iPad") || b("Macintosh") && 0 < a;
        O.IPOD = b("iPod");
        O.IPHONE = b("iPhone") && !O.IPAD && !O.IPOD;
        O.MAC = b("Macintosh");
        O.TABLET = O.IPAD || O.ANDROID && !b("Mobile") || b("Silk");
        O.MOBILE = !O.TABLET && (O.IPOD || O.IPHONE || O.ANDROID || b("IEMobile"))
    }
    )(e.module$exports$Blockly$utils$global.globalThis.navigator && e.module$exports$Blockly$utils$global.globalThis.navigator.userAgent || "");
    var u = {
        conditionalBind: function(a, b, c, d, f, g) {
            var k = !1
              , n = function(ya) {
                var Qa = !f;
                ya = (0,
                N.splitEventByTouches)(ya);
                for (var za = 0; za < ya.length; za++) {
                    var tc = ya[za];
                    if (!Qa || (0,
                    N.shouldHandleEvent)(tc))
                        (0,
                        N.setClientFromTouch)(tc),
                        c ? d.call(c, tc) : d(tc),
                        k = !0
                }
            }
              , x = [];
            if (e.module$exports$Blockly$utils$global.globalThis.PointerEvent && b in N.TOUCH_MAP)
                for (var B = 0; B < N.TOUCH_MAP[b].length; B++) {
                    var P = N.TOUCH_MAP[b][B];
                    a.addEventListener(P, n, !1);
                    x.push([a, P, n])
                }
            else if (a.addEventListener(b, n, !1),
            x.push([a, b, n]),
            b in N.TOUCH_MAP)
                for (B = function(ya) {
                    n(ya);
                    var Qa = !g;
                    k && Qa && ya.preventDefault()
                }
                ,
                P = 0; P < N.TOUCH_MAP[b].length; P++) {
                    var la = N.TOUCH_MAP[b][P];
                    a.addEventListener(la, B, !1);
                    x.push([a, la, B])
                }
            return x
        },
        bind: function(a, b, c, d) {
            var f = function(B) {
                c ? d.call(c, B) : d(B)
            }
              , g = [];
            if (e.module$exports$Blockly$utils$global.globalThis.PointerEvent && b in N.TOUCH_MAP)
                for (var k = 0; k < N.TOUCH_MAP[b].length; k++) {
                    var n = N.TOUCH_MAP[b][k];
                    a.addEventListener(n, f, !1);
                    g.push([a, n, f])
                }
            else if (a.addEventListener(b, f, !1),
            g.push([a, b, f]),
            b in N.TOUCH_MAP)
                for (k = function(B) {
                    if (B.changedTouches && 1 === B.changedTouches.length) {
                        var P = B.changedTouches[0];
                        B.clientX = P.clientX;
                        B.clientY = P.clientY
                    }
                    f(B);
                    B.preventDefault()
                }
                ,
                n = 0; n < N.TOUCH_MAP[b].length; n++) {
                    var x = N.TOUCH_MAP[b][n];
                    a.addEventListener(x, k, !1);
                    g.push([a, x, k])
                }
            return g
        },
        unbind: function(a) {
            for (var b; a.length; ) {
                b = a.pop();
                var c = b[0]
                  , d = b[1];
                b = b[2];
                c.removeEventListener(d, b, !1)
            }
            return b
        },
        isTargetInput: function(a) {
            return "textarea" === a.target.type || "text" === a.target.type || "number" === a.target.type || "email" === a.target.type || "password" === a.target.type || "search" === a.target.type || "tel" === a.target.type || "url" === a.target.type || a.target.isContentEditable || a.target.dataset && "true" === a.target.dataset.isTextInput
        },
        isRightButton: function(a) {
            return a.ctrlKey && O.MAC ? !0 : 2 === a.button
        },
        mouseToSvg: function(a, b, c) {
            var d = b.createSVGPoint();
            d.x = a.clientX;
            d.y = a.clientY;
            c || (c = b.getScreenCTM().inverse());
            return d.matrixTransform(c)
        },
        getScrollDeltaPixels: function(a) {
            switch (a.deltaMode) {
            default:
                return {
                    x: a.deltaX,
                    y: a.deltaY
                };
            case 1:
                return {
                    x: a.deltaX * e.module$exports$Blockly$internalConstants.LINE_MODE_MULTIPLIER,
                    y: a.deltaY * e.module$exports$Blockly$internalConstants.LINE_MODE_MULTIPLIER
                };
            case 2:
                return {
                    x: a.deltaX * e.module$exports$Blockly$internalConstants.PAGE_MODE_MULTIPLIER,
                    y: a.deltaY * e.module$exports$Blockly$internalConstants.PAGE_MODE_MULTIPLIER
                }
            }
        }
    };
    e.module$exports$Blockly$blocks = {};
    e.module$exports$Blockly$blocks.Blocks = Object.create(null);
    var de;
    e.module$exports$Blockly$common = {};
    e.module$exports$Blockly$common.getMainWorkspace = function() {
        return de
    }
    ;
    e.module$exports$Blockly$common.setMainWorkspace = function(a) {
        de = a
    }
    ;
    var ee = null;
    e.module$exports$Blockly$common.getSelected = function() {
        return ee
    }
    ;
    e.module$exports$Blockly$common.setSelected = function(a) {
        ee = a
    }
    ;
    var fe;
    e.module$exports$Blockly$common.getParentContainer = function() {
        return fe
    }
    ;
    e.module$exports$Blockly$common.setParentContainer = function(a) {
        fe = a
    }
    ;
    e.module$exports$Blockly$common.svgResize = function(a) {
        for (; a.options.parentWorkspace; )
            a = a.options.parentWorkspace;
        var b = a.getParentSvg()
          , c = a.getCachedParentSvgSize()
          , d = b.parentNode;
        if (d) {
            var f = d.offsetWidth;
            d = d.offsetHeight;
            c.width !== f && (b.setAttribute("width", f + "px"),
            a.setCachedParentSvgSize(f, null));
            c.height !== d && (b.setAttribute("height", d + "px"),
            a.setCachedParentSvgSize(null, d));
            a.resize()
        }
    }
    ;
    e.module$exports$Blockly$common.draggingConnections = [];
    e.module$exports$Blockly$common.getBlockTypeCounts = function(a, b) {
        var c = Object.create(null)
          , d = a.getDescendants(!0);
        b && (a = a.getNextBlock()) && (a = d.indexOf(a),
        d.splice(a, d.length - a));
        for (a = 0; b = d[a]; a++)
            c[b.type] ? c[b.type]++ : c[b.type] = 1;
        return c
    }
    ;
    var Se = function(a) {
        return function() {
            this.jsonInit(a)
        }
    };
    e.module$exports$Blockly$common.defineBlocksWithJsonArray = function(a) {
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            if (c) {
                var d = c.type;
                d ? (e.module$exports$Blockly$blocks.Blocks[d] && console.warn("Block definition #" + b + ' in JSON array overwrites prior definition of "' + d + '".'),
                e.module$exports$Blockly$blocks.Blocks[d] = {
                    init: Se(c)
                }) : console.warn("Block definition #" + b + " in JSON array is missing a type attribute. Skipping.")
            } else
                console.warn("Block definition #" + b + " in JSON array is " + c + ". Skipping.")
        }
    }
    ;
    var T = {}
      , Tc = !1;
    T.isVisible = function() {
        return Tc
    }
    ;
    Object.defineProperties(T, {
        visible: {
            get: function() {
                (0,
                V.warn)("Blockly.Tooltip.visible", "September 2021", "September 2022", "Blockly.Tooltip.isVisible()");
                return (0,
                T.isVisible)()
            }
        }
    });
    var Kc = !1;
    T.LIMIT = 50;
    var ge = 0
      , Uc = 0
      , Md = 0
      , Nd = 0
      , Ob = null
      , Vc = null;
    T.OFFSET_X = 0;
    T.OFFSET_Y = 10;
    T.RADIUS_OK = 10;
    T.HOVER_MS = 750;
    T.MARGINS = 5;
    var Ra = null;
    T.getDiv = function() {
        return Ra
    }
    ;
    Object.defineProperties(T, {
        DIV: {
            get: function() {
                (0,
                V.warn)("Blockly.Tooltip.DIV", "September 2021", "September 2022", "Blockly.Tooltip.getDiv()");
                return (0,
                T.getDiv)()
            }
        }
    });
    T.getTooltipOfObject = function(a) {
        if (a = he(a)) {
            for (a = a.tooltip; "function" === typeof a; )
                a = a();
            if ("string" !== typeof a)
                throw Error("Tooltip function must return a string.");
            return a
        }
        return ""
    }
    ;
    var he = function(a) {
        for (; a && a.tooltip; ) {
            if ("string" === typeof a.tooltip || "function" === typeof a.tooltip)
                return a;
            a = a.tooltip
        }
        return null
    };
    T.createDom = function() {
        Ra || (Ra = document.createElement("div"),
        Ra.className = "blocklyTooltipDiv",
        ((0,
        e.module$exports$Blockly$common.getParentContainer)() || document.body).appendChild(Ra))
    }
    ;
    T.bindMouseEvents = function(a) {
        a.mouseOverWrapper_ = (0,
        u.bind)(a, "mouseover", null, Te);
        a.mouseOutWrapper_ = (0,
        u.bind)(a, "mouseout", null, Ue);
        a.addEventListener("mousemove", ie, !1)
    }
    ;
    T.unbindMouseEvents = function(a) {
        a && ((0,
        u.unbind)(a.mouseOverWrapper_),
        (0,
        u.unbind)(a.mouseOutWrapper_),
        a.removeEventListener("mousemove", ie))
    }
    ;
    var Te = function(a) {
        Kc || (a = he(a.currentTarget),
        Ob !== a && ((0,
        T.hide)(),
        Vc = null,
        Ob = a),
        clearTimeout(ge))
    }
      , Ue = function(a) {
        Kc || (ge = setTimeout(function() {
            Vc = Ob = null;
            (0,
            T.hide)()
        }, 1),
        clearTimeout(Uc))
    }
      , ie = function(a) {
        if (Ob && Ob.tooltip && !Kc)
            if (Tc) {
                var b = Md - a.pageX;
                a = Nd - a.pageY;
                Math.sqrt(b * b + a * a) > T.RADIUS_OK && (0,
                T.hide)()
            } else
                Vc !== Ob && (clearTimeout(Uc),
                Md = a.pageX,
                Nd = a.pageY,
                Uc = setTimeout(Ve, T.HOVER_MS))
    };
    T.dispose = function() {
        Vc = Ob = null;
        (0,
        T.hide)()
    }
    ;
    T.hide = function() {
        Tc && (Tc = !1,
        Ra && (Ra.style.display = "none"));
        Uc && clearTimeout(Uc)
    }
    ;
    T.block = function() {
        (0,
        T.hide)();
        Kc = !0
    }
    ;
    T.unblock = function() {
        Kc = !1
    }
    ;
    var Ve = function() {
        if (!Kc && (Vc = Ob,
        Ra)) {
            Ra.textContent = "";
            var a = (0,
            T.getTooltipOfObject)(Ob);
            a = (0,
            e.module$exports$Blockly$utils$string.wrap)(a, T.LIMIT);
            a = a.split("\n");
            for (var b = 0; b < a.length; b++) {
                var c = document.createElement("div");
                c.appendChild(document.createTextNode(a[b]));
                Ra.appendChild(c)
            }
            a = Ob.RTL;
            b = document.documentElement.clientWidth;
            c = document.documentElement.clientHeight;
            Ra.style.direction = a ? "rtl" : "ltr";
            Ra.style.display = "block";
            Tc = !0;
            var d = Md;
            d = a ? d - (T.OFFSET_X + Ra.offsetWidth) : d + T.OFFSET_X;
            var f = Nd + T.OFFSET_Y;
            f + Ra.offsetHeight > c + window.scrollY && (f -= Ra.offsetHeight + 2 * T.OFFSET_Y);
            a ? d = Math.max(T.MARGINS - window.scrollX, d) : d + Ra.offsetWidth > b + window.scrollX - 2 * T.MARGINS && (d = b - Ra.offsetWidth - 2 * T.MARGINS);
            Ra.style.top = f + "px";
            Ra.style.left = d + "px"
        }
    }
      , l = {
        SVG_NS: "http://www.w3.org/2000/svg",
        HTML_NS: "http://www.w3.org/1999/xhtml",
        XLINK_NS: "http://www.w3.org/1999/xlink",
        NodeType: {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3,
            COMMENT_NODE: 8,
            DOCUMENT_POSITION_CONTAINED_BY: 16
        }
    }
      , Cb = null
      , Od = 0
      , id = null;
    l.createSvgElement = function(a, b, c) {
        a = document.createElementNS(l.SVG_NS, String(a));
        for (var d in b)
            a.setAttribute(d, b[d]);
        document.body.runtimeStyle && (a.runtimeStyle = a.currentStyle = a.style);
        c && c.appendChild(a);
        return a
    }
    ;
    l.addClass = function(a, b) {
        var c = a.getAttribute("class") || "";
        if (-1 !== (" " + c + " ").indexOf(" " + b + " "))
            return !1;
        c && (c += " ");
        a.setAttribute("class", c + b);
        return !0
    }
    ;
    l.removeClasses = function(a, b) {
        b = b.split(" ");
        for (var c = 0; c < b.length; c++)
            (0,
            l.removeClass)(a, b[c])
    }
    ;
    l.removeClass = function(a, b) {
        var c = a.getAttribute("class");
        if (-1 === (" " + c + " ").indexOf(" " + b + " "))
            return !1;
        c = c.split(/\s+/);
        for (var d = 0; d < c.length; d++)
            c[d] && c[d] !== b || (c.splice(d, 1),
            d--);
        c.length ? a.setAttribute("class", c.join(" ")) : a.removeAttribute("class");
        return !0
    }
    ;
    l.hasClass = function(a, b) {
        return -1 !== (" " + a.getAttribute("class") + " ").indexOf(" " + b + " ")
    }
    ;
    l.removeNode = function(a) {
        return a && a.parentNode ? a.parentNode.removeChild(a) : null
    }
    ;
    l.insertAfter = function(a, b) {
        var c = b.nextSibling;
        b = b.parentNode;
        if (!b)
            throw Error("Reference node has no parent.");
        c ? b.insertBefore(a, c) : b.appendChild(a)
    }
    ;
    l.containsNode = function(a, b) {
        return !!(a.compareDocumentPosition(b) & l.NodeType.DOCUMENT_POSITION_CONTAINED_BY)
    }
    ;
    l.setCssTransform = function(a, b) {
        a.style.transform = b;
        a.style["-webkit-transform"] = b
    }
    ;
    l.startTextWidthCache = function() {
        Od++;
        Cb || (Cb = Object.create(null))
    }
    ;
    l.stopTextWidthCache = function() {
        Od--;
        Od || (Cb = null)
    }
    ;
    l.getTextWidth = function(a) {
        var b = a.textContent + "\n" + a.className.baseVal, c;
        if (Cb && (c = Cb[b]))
            return c;
        try {
            c = O.IE || O.EDGE ? a.getBBox().width : a.getComputedTextLength()
        } catch (d) {
            return 8 * a.textContent.length
        }
        Cb && (Cb[b] = c);
        return c
    }
    ;
    l.getFastTextWidth = function(a, b, c, d) {
        return (0,
        l.getFastTextWidthWithSizeString)(a, b + "pt", c, d)
    }
    ;
    l.getFastTextWidthWithSizeString = function(a, b, c, d) {
        var f = a.textContent;
        a = f + "\n" + a.className.baseVal;
        var g;
        if (Cb && (g = Cb[a]))
            return g;
        id || (g = document.createElement("canvas"),
        g.className = "blocklyComputeCanvas",
        document.body.appendChild(g),
        id = g.getContext("2d"));
        id.font = c + " " + b + " " + d;
        g = id.measureText(f).width;
        Cb && (Cb[a] = g);
        return g
    }
    ;
    l.measureFontMetrics = function(a, b, c, d) {
        var f = document.createElement("span");
        f.style.font = c + " " + b + " " + d;
        f.textContent = a;
        a = document.createElement("div");
        a.style.width = "1px";
        a.style.height = 0;
        b = document.createElement("div");
        b.setAttribute("style", "position: fixed; top: 0; left: 0; display: flex;");
        b.appendChild(f);
        b.appendChild(a);
        document.body.appendChild(b);
        c = {
            height: 0,
            baseline: 0
        };
        try {
            b.style.alignItems = "baseline",
            c.baseline = a.offsetTop - f.offsetTop,
            b.style.alignItems = "flex-end",
            c.height = a.offsetTop - f.offsetTop
        } finally {
            document.body.removeChild(b)
        }
        return c
    }
    ;
    var ma = {}, jd = null, kd = null, Wc = "", Xc = "", Db;
    ma.getDiv = function() {
        return Db
    }
    ;
    ma.testOnly_setDiv = function(a) {
        Db = a
    }
    ;
    Object.defineProperties(ma, {
        DIV: {
            get: function() {
                (0,
                V.warn)("Blockly.WidgetDiv.DIV", "September 2021", "September 2022", "Blockly.WidgetDiv.getDiv()");
                return (0,
                ma.getDiv)()
            }
        }
    });
    ma.createDom = function() {
        Db || (Db = document.createElement("div"),
        Db.className = "blocklyWidgetDiv",
        ((0,
        e.module$exports$Blockly$common.getParentContainer)() || document.body).appendChild(Db))
    }
    ;
    ma.show = function(a, b, c) {
        (0,
        ma.hide)();
        jd = a;
        kd = c;
        a = Db;
        a.style.direction = b ? "rtl" : "ltr";
        a.style.display = "block";
        b = (0,
        e.module$exports$Blockly$common.getMainWorkspace)();
        Wc = b.getRenderer().getClassName();
        Xc = b.getTheme().getClassName();
        (0,
        l.addClass)(a, Wc);
        (0,
        l.addClass)(a, Xc)
    }
    ;
    ma.hide = function() {
        if ((0,
        ma.isVisible)()) {
            jd = null;
            var a = Db;
            a.style.display = "none";
            a.style.left = "";
            a.style.top = "";
            kd && kd();
            kd = null;
            a.textContent = "";
            Wc && ((0,
            l.removeClass)(a, Wc),
            Wc = "");
            Xc && ((0,
            l.removeClass)(a, Xc),
            Xc = "");
            (0,
            e.module$exports$Blockly$common.getMainWorkspace)().markFocused()
        }
    }
    ;
    ma.isVisible = function() {
        return !!jd
    }
    ;
    ma.hideIfOwner = function(a) {
        jd === a && (0,
        ma.hide)()
    }
    ;
    var je = function(a, b, c) {
        Db.style.left = a + "px";
        Db.style.top = b + "px";
        Db.style.height = c + "px"
    };
    ma.positionWithAnchor = function(a, b, c, d) {
        var f = b.bottom + c.height >= a.bottom ? b.top - c.height : b.bottom;
        a = d ? Math.min(Math.max(b.right - c.width, a.left), a.right - c.width) : Math.max(Math.min(b.left, a.right - c.width), a.left);
        0 > f ? je(a, 0, c.height + f) : je(a, f, c.height)
    }
    ;
    var J = {
        Role: {
            GRID: "grid",
            GRIDCELL: "gridcell",
            GROUP: "group",
            LISTBOX: "listbox",
            MENU: "menu",
            MENUITEM: "menuitem",
            MENUITEMCHECKBOX: "menuitemcheckbox",
            OPTION: "option",
            PRESENTATION: "presentation",
            ROW: "row",
            TREE: "tree",
            TREEITEM: "treeitem"
        },
        State: {
            ACTIVEDESCENDANT: "activedescendant",
            COLCOUNT: "colcount",
            DISABLED: "disabled",
            EXPANDED: "expanded",
            INVALID: "invalid",
            LABEL: "label",
            LABELLEDBY: "labelledby",
            LEVEL: "level",
            ORIENTATION: "orientation",
            POSINSET: "posinset",
            ROWCOUNT: "rowcount",
            SELECTED: "selected",
            SETSIZE: "setsize",
            VALUEMAX: "valuemax",
            VALUEMIN: "valuemin"
        },
        setRole: function(a, b) {
            a.setAttribute("role", b)
        },
        setState: function(a, b, c) {
            Array.isArray(c) && (c = c.join(" "));
            a.setAttribute("aria-" + b, c)
        }
    }
      , Va = {
        TEST_ONLY: {}
    }
      , We = 0;
    Va.getNextUniqueId = function() {
        return "blockly-" + (We++).toString(36)
    }
    ;
    Va.TEST_ONLY.genUid = function() {
        for (var a = [], b = 0; 20 > b; b++)
            a[b] = "!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(88 * Math.random());
        return a.join("")
    }
    ;
    Va.genUid = function() {
        return Va.TEST_ONLY.genUid()
    }
    ;
    var r = {}
      , uc = Object.create(null);
    r.TEST_ONLY = {
        typeMap: uc
    };
    var ld = Object.create(null);
    r.DEFAULT = "default";
    r.Type = function(a) {
        this.name_ = a
    }
    ;
    r.Type.prototype.toString = function() {
        return this.name_
    }
    ;
    r.Type.CONNECTION_CHECKER = new r.Type("connectionChecker");
    r.Type.CURSOR = new r.Type("cursor");
    r.Type.EVENT = new r.Type("event");
    r.Type.FIELD = new r.Type("field");
    r.Type.RENDERER = new r.Type("renderer");
    r.Type.TOOLBOX = new r.Type("toolbox");
    r.Type.THEME = new r.Type("theme");
    r.Type.TOOLBOX_ITEM = new r.Type("toolboxItem");
    r.Type.FLYOUTS_VERTICAL_TOOLBOX = new r.Type("flyoutsVerticalToolbox");
    r.Type.FLYOUTS_HORIZONTAL_TOOLBOX = new r.Type("flyoutsHorizontalToolbox");
    r.Type.METRICS_MANAGER = new r.Type("metricsManager");
    r.Type.BLOCK_DRAGGER = new r.Type("blockDragger");
    r.Type.SERIALIZER = new r.Type("serializer");
    r.register = function(a, b, c, d) {
        if (!(a instanceof r.Type) && "string" !== typeof a || "" === String(a).trim())
            throw Error('Invalid type "' + a + '". The type must be a non-empty string or a Blockly.registry.Type.');
        a = String(a).toLowerCase();
        if ("string" !== typeof b || "" === b.trim())
            throw Error('Invalid name "' + b + '". The name must be a non-empty string.');
        var f = b.toLowerCase();
        if (!c)
            throw Error("Can not register a null value");
        var g = uc[a]
          , k = ld[a];
        g || (g = uc[a] = Object.create(null),
        k = ld[a] = Object.create(null));
        switch (a) {
        case String(r.Type.FIELD):
            if ("function" !== typeof c.fromJson)
                throw Error('Type "' + a + '" must have a fromJson function');
        }
        if (!d && g[f])
            throw Error('Name "' + f + '" with type "' + a + '" already registered.');
        g[f] = c;
        k[f] = b
    }
    ;
    r.unregister = function(a, b) {
        a = String(a).toLowerCase();
        b = b.toLowerCase();
        var c = uc[a];
        c && c[b] ? (delete uc[a][b],
        delete ld[a][b]) : console.warn("Unable to unregister [" + b + "][" + a + "] from the registry.")
    }
    ;
    var ke = function(a, b, c) {
        a = String(a).toLowerCase();
        b = b.toLowerCase();
        var d = uc[a];
        if (!d || !d[b]) {
            b = "Unable to find [" + b + "][" + a + "] in the registry.";
            if (c)
                throw Error(b + " You must require or register a " + a + " plugin.");
            console.warn(b);
            return null
        }
        return d[b]
    };
    r.hasItem = function(a, b) {
        a = String(a).toLowerCase();
        b = b.toLowerCase();
        return (a = uc[a]) ? !!a[b] : !1
    }
    ;
    r.getClass = function(a, b, c) {
        return ke(a, b, c)
    }
    ;
    r.getObject = function(a, b, c) {
        return ke(a, b, c)
    }
    ;
    r.getAllItems = function(a, b, c) {
        a = String(a).toLowerCase();
        var d = uc[a];
        if (!d) {
            d = "Unable to find [" + a + "] in the registry.";
            if (c)
                throw Error(d + " You must require or register a " + a + " plugin.");
            console.warn(d);
            return null
        }
        if (!b)
            return d;
        a = ld[a];
        c = Object.create(null);
        b = Object.keys(d);
        for (var f = 0; f < b.length; f++) {
            var g = b[f];
            c[a[g]] = d[g]
        }
        return c
    }
    ;
    r.getClassFromOptions = function(a, b, c) {
        b = b.plugins[a.toString()] || r.DEFAULT;
        return "function" === typeof b ? b : (0,
        r.getClass)(a, b, c)
    }
    ;
    var h = {}
      , le = ""
      , Yc = !0;
    h.setRecordUndo = function(a) {
        Yc = a
    }
    ;
    h.getRecordUndo = function() {
        return Yc
    }
    ;
    var Pd = 0;
    h.CREATE = "create";
    h.BLOCK_CREATE = h.CREATE;
    h.DELETE = "delete";
    h.BLOCK_DELETE = h.DELETE;
    h.CHANGE = "change";
    h.BLOCK_CHANGE = h.CHANGE;
    h.MOVE = "move";
    h.BLOCK_MOVE = h.MOVE;
    h.VAR_CREATE = "var_create";
    h.VAR_DELETE = "var_delete";
    h.VAR_RENAME = "var_rename";
    h.UI = "ui";
    h.BLOCK_DRAG = "drag";
    h.SELECTED = "selected";
    h.CLICK = "click";
    h.MARKER_MOVE = "marker_move";
    h.BUBBLE_OPEN = "bubble_open";
    h.TRASHCAN_OPEN = "trashcan_open";
    h.TOOLBOX_ITEM_SELECT = "toolbox_item_select";
    h.THEME_CHANGE = "theme_change";
    h.VIEWPORT_CHANGE = "viewport_change";
    h.COMMENT_CREATE = "comment_create";
    h.COMMENT_DELETE = "comment_delete";
    h.COMMENT_CHANGE = "comment_change";
    h.COMMENT_MOVE = "comment_move";
    h.FINISHED_LOADING = "finished_loading";
    h.BUMP_EVENTS = [h.CREATE, h.MOVE, h.COMMENT_CREATE, h.COMMENT_MOVE];
    var Lc = [];
    h.fire = function(a) {
        (0,
        h.isEnabled)() && (Lc.length || setTimeout(me, 0),
        Lc.push(a))
    }
    ;
    var me = function() {
        for (var a = (0,
        h.filter)(Lc, !0), b = Lc.length = 0, c; c = a[b]; b++)
            if (c.workspaceId) {
                var d = I.Workspace.getById(c.workspaceId);
                d && d.fireChangeListener(c)
            }
    };
    h.filter = function(a, b) {
        a = a.slice();
        b || a.reverse();
        for (var c = [], d = Object.create(null), f = 0, g = void 0; g = a[f]; f++)
            if (!g.isNull()) {
                var k = [g.isUiEvent ? h.UI : g.type, g.blockId, g.workspaceId].join(" ")
                  , n = d[k]
                  , x = n ? n.event : null;
                if (!n)
                    d[k] = {
                        event: g,
                        index: f
                    },
                    c.push(g);
                else if (g.type === h.MOVE && n.index === f - 1)
                    x.newParentId = g.newParentId,
                    x.newInputName = g.newInputName,
                    x.newCoordinate = g.newCoordinate,
                    n.index = f;
                else if (g.type === h.CHANGE && g.element === x.element && g.name === x.name)
                    x.newValue = g.newValue;
                else if (g.type === h.VIEWPORT_CHANGE)
                    x.viewTop = g.viewTop,
                    x.viewLeft = g.viewLeft,
                    x.scale = g.scale,
                    x.oldScale = g.oldScale;
                else if (g.type !== h.CLICK || x.type !== h.BUBBLE_OPEN)
                    d[k] = {
                        event: g,
                        index: f
                    },
                    c.push(g)
            }
        a = c.filter(function(B) {
            return !B.isNull()
        });
        b || a.reverse();
        b = 1;
        for (c = void 0; c = a[b]; b++)
            c.type === h.CHANGE && "mutation" === c.element && a.unshift(a.splice(b, 1)[0]);
        return a
    }
    ;
    h.clearPendingUndo = function() {
        for (var a = 0, b; b = Lc[a]; a++)
            b.recordUndo = !1
    }
    ;
    h.disable = function() {
        Pd++
    }
    ;
    h.enable = function() {
        Pd--
    }
    ;
    h.isEnabled = function() {
        return 0 === Pd
    }
    ;
    h.getGroup = function() {
        return le
    }
    ;
    h.setGroup = function(a) {
        le = "boolean" === typeof a ? a ? (0,
        Va.genUid)() : "" : a
    }
    ;
    h.getDescendantIds = function(a) {
        var b = [];
        a = a.getDescendants(!1);
        for (var c = 0, d; d = a[c]; c++)
            b[c] = d.id;
        return b
    }
    ;
    h.fromJson = function(a, b) {
        var c = (0,
        h.get)(a.type);
        if (!c)
            throw Error("Unknown event type.");
        c = new c;
        c.fromJson(a);
        c.workspaceId = b.id;
        return c
    }
    ;
    h.get = function(a) {
        return (0,
        r.getClass)(r.Type.EVENT, a)
    }
    ;
    h.disableOrphans = function(a) {
        if ((a.type === h.MOVE || a.type === h.CREATE) && a.workspaceId) {
            var b = I.Workspace.getById(a.workspaceId)
              , c = b.getBlockById(a.blockId);
            if (c) {
                a = Yc;
                try {
                    Yc = !1;
                    var d = c.getParent();
                    if (d && d.isEnabled()) {
                        var f = c.getDescendants(!1);
                        b = 0;
                        for (d = void 0; d = f[b]; b++)
                            d.setEnabled(!0)
                    } else if ((c.outputConnection || c.previousConnection) && !b.isDragging()) {
                        do
                            c.setEnabled(!1),
                            c = c.getNextBlock();
                        while (c)
                    }
                } finally {
                    Yc = a
                }
            }
        }
    }
    ;
    h.TEST_ONLY = {
        FIRE_QUEUE: Lc,
        fireNow: me
    };
    var xb = {
        toRadians: function(a) {
            return a * Math.PI / 180
        },
        toDegrees: function(a) {
            return 180 * a / Math.PI
        },
        clamp: function(a, b, c) {
            if (c < a) {
                var d = c;
                c = a;
                a = d
            }
            return Math.max(a, Math.min(b, c))
        }
    }
      , wc = {
        bumpIntoBounds: function(a, b, c) {
            var d = c.getBoundingRectangle()
              , f = d.right - d.left
              , g = (0,
            xb.clamp)(b.top, d.top, b.top + b.height - (d.bottom - d.top)) - d.top
              , k = b.left;
            b = b.left + b.width - f;
            a.RTL ? k = Math.min(b, k) : b = Math.max(k, b);
            return (a = (0,
            xb.clamp)(k, d.left, b) - d.left) || g ? (c.moveBy(a, g),
            !0) : !1
        },
        bumpIntoBoundsHandler: function(a) {
            return function(b) {
                var c = a.getMetricsManager();
                if (c.hasFixedEdges() && !a.isDragging())
                    if (-1 !== h.BUMP_EVENTS.indexOf(b.type)) {
                        c = c.getScrollMetrics(!0);
                        var d = null;
                        switch (b.type) {
                        case h.CREATE:
                        case h.MOVE:
                            (d = a.getBlockById(b.blockId)) && (d = d.getRootBlock());
                            break;
                        case h.COMMENT_CREATE:
                        case h.COMMENT_MOVE:
                            d = a.getCommentById(b.commentId)
                        }
                        if (d) {
                            var f = (0,
                            h.getGroup)();
                            (0,
                            h.setGroup)(b.group);
                            (0,
                            wc.bumpIntoBounds)(a, c, d) && !b.group && console.warn("Moved object in bounds but there was no event group. This may break undo.");
                            null !== f && (0,
                            h.setGroup)(f)
                        }
                    } else
                        b.type === h.VIEWPORT_CHANGE && b.scale > b.oldScale && (0,
                        wc.bumpTopObjectsIntoBounds)(a)
            }
        },
        bumpTopObjectsIntoBounds: function(a) {
            var b = a.getMetricsManager();
            if (b.hasFixedEdges() && !a.isDragging()) {
                b = b.getScrollMetrics(!0);
                for (var c = a.getTopBoundedElements(), d = 0, f; f = c[d]; d++)
                    (0,
                    wc.bumpIntoBounds)(a, b, f)
            }
        }
    }
      , E = function(a, b) {
        this.x = a;
        this.y = b
    };
    E.equals = function(a, b) {
        return a === b ? !0 : a && b ? a.x === b.x && a.y === b.y : !1
    }
    ;
    E.distance = function(a, b) {
        var c = a.x - b.x;
        a = a.y - b.y;
        return Math.sqrt(c * c + a * a)
    }
    ;
    E.magnitude = function(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y)
    }
    ;
    E.difference = function(a, b) {
        return new E(a.x - b.x,a.y - b.y)
    }
    ;
    E.sum = function(a, b) {
        return new E(a.x + b.x,a.y + b.y)
    }
    ;
    E.prototype.clone = function() {
        return new E(this.x,this.y)
    }
    ;
    E.prototype.scale = function(a) {
        this.x *= a;
        this.y *= a;
        return this
    }
    ;
    E.prototype.translate = function(a, b) {
        this.x += a;
        this.y += b;
        return this
    }
    ;
    var Ja = function(a, b) {
        this.width = a;
        this.height = b
    };
    Ja.equals = function(a, b) {
        return a === b ? !0 : a && b ? a.width === b.width && a.height === b.height : !1
    }
    ;
    var na = {
        getSize: function(a) {
            if ("none" !== ne(a, "display"))
                return new Ja(a.offsetWidth,a.offsetHeight);
            var b = a.style
              , c = b.display
              , d = b.visibility
              , f = b.position;
            b.visibility = "hidden";
            b.position = "absolute";
            b.display = "inline";
            var g = a.offsetWidth;
            a = a.offsetHeight;
            b.display = c;
            b.position = f;
            b.visibility = d;
            return new Ja(g,a)
        }
    }
      , ne = function(a, b) {
        return (0,
        na.getComputedStyle)(a, b) || (0,
        na.getCascadedStyle)(a, b) || a.style && a.style[b]
    };
    na.getComputedStyle = function(a, b) {
        return document.defaultView && document.defaultView.getComputedStyle && (a = document.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : ""
    }
    ;
    na.getCascadedStyle = function(a, b) {
        return a.currentStyle ? a.currentStyle[b] : null
    }
    ;
    na.getPageOffset = function(a) {
        var b = new E(0,0);
        a = a.getBoundingClientRect();
        var c = document.documentElement;
        c = new E(window.pageXOffset || c.scrollLeft,window.pageYOffset || c.scrollTop);
        b.x = a.left + c.x;
        b.y = a.top + c.y;
        return b
    }
    ;
    na.getViewportPageOffset = function() {
        var a = document.body
          , b = document.documentElement;
        return new E(a.scrollLeft || b.scrollLeft,a.scrollTop || b.scrollTop)
    }
    ;
    na.setElementShown = function(a, b) {
        a.style.display = b ? "" : "none"
    }
    ;
    na.isRightToLeft = function(a) {
        return "rtl" === ne(a, "direction")
    }
    ;
    na.getBorderBox = function(a) {
        var b = (0,
        na.getComputedStyle)(a, "borderLeftWidth")
          , c = (0,
        na.getComputedStyle)(a, "borderRightWidth")
          , d = (0,
        na.getComputedStyle)(a, "borderTopWidth");
        a = (0,
        na.getComputedStyle)(a, "borderBottomWidth");
        return {
            top: parseFloat(d),
            right: parseFloat(c),
            bottom: parseFloat(a),
            left: parseFloat(b)
        }
    }
    ;
    na.scrollIntoContainerView = function(a, b, c) {
        a = (0,
        na.getContainerOffsetToScrollInto)(a, b, c);
        b.scrollLeft = a.x;
        b.scrollTop = a.y
    }
    ;
    na.getContainerOffsetToScrollInto = function(a, b, c) {
        var d = (0,
        na.getPageOffset)(a)
          , f = (0,
        na.getPageOffset)(b)
          , g = (0,
        na.getBorderBox)(b)
          , k = d.x - f.x - g.left;
        d = d.y - f.y - g.top;
        f = new Ja(a.offsetWidth,a.offsetHeight);
        a = b.clientWidth - f.width;
        f = b.clientHeight - f.height;
        g = b.scrollLeft;
        b = b.scrollTop;
        c ? (g += k - a / 2,
        b += d - f / 2) : (g += Math.min(k, Math.max(k - a, 0)),
        b += Math.min(d, Math.max(d - f, 0)));
        return new E(g,b)
    }
    ;
    var Aa = function(a, b, c, d) {
        this.top = a;
        this.bottom = b;
        this.left = c;
        this.right = d
    };
    Aa.prototype.contains = function(a, b) {
        return a >= this.left && a <= this.right && b >= this.top && b <= this.bottom
    }
    ;
    Aa.prototype.intersects = function(a) {
        return !(this.left > a.right || this.right < a.left || this.top > a.bottom || this.bottom < a.top)
    }
    ;
    var ca = {}
      , oe = /translate\(\s*([-+\d.e]+)([ ,]\s*([-+\d.e]+)\s*)?/
      , pe = /transform:\s*translate(?:3d)?\(\s*([-+\d.e]+)\s*px([ ,]\s*([-+\d.e]+)\s*px)?/;
    ca.getRelativeXY = function(a) {
        var b = new E(0,0)
          , c = a.getAttribute("x");
        c && (b.x = parseInt(c, 10));
        if (c = a.getAttribute("y"))
            b.y = parseInt(c, 10);
        if (c = (c = a.getAttribute("transform")) && c.match(oe))
            b.x += Number(c[1]),
            c[3] && (b.y += Number(c[3]));
        (a = a.getAttribute("style")) && -1 < a.indexOf("translate") && (a = a.match(pe)) && (b.x += Number(a[1]),
        a[3] && (b.y += Number(a[3])));
        return b
    }
    ;
    ca.getInjectionDivXY = function(a) {
        for (var b = 0, c = 0; a; ) {
            var d = (0,
            ca.getRelativeXY)(a);
            b += d.x;
            c += d.y;
            if (-1 !== (" " + (a.getAttribute("class") || "") + " ").indexOf(" injectionDiv "))
                break;
            a = a.parentNode
        }
        return new E(b,c)
    }
    ;
    ca.is3dSupported = function() {
        if (void 0 !== ca.is3dSupported.cached_)
            return ca.is3dSupported.cached_;
        if (!e.module$exports$Blockly$utils$global.globalThis.getComputedStyle)
            return !1;
        var a = document.createElement("p")
          , b = "none"
          , c = {
            webkitTransform: "-webkit-transform",
            OTransform: "-o-transform",
            msTransform: "-ms-transform",
            MozTransform: "-moz-transform",
            transform: "transform"
        };
        document.body.insertBefore(a, null);
        for (var d in c)
            if (void 0 !== a.style[d]) {
                a.style[d] = "translate3d(1px,1px,1px)";
                b = e.module$exports$Blockly$utils$global.globalThis.getComputedStyle(a);
                if (!b)
                    return document.body.removeChild(a),
                    !1;
                b = b.getPropertyValue(c[d])
            }
        document.body.removeChild(a);
        ca.is3dSupported.cached_ = "none" !== b;
        return ca.is3dSupported.cached_
    }
    ;
    ca.getViewportBBox = function() {
        var a = (0,
        na.getViewportPageOffset)();
        return new Aa(a.y,document.documentElement.clientHeight + a.y,a.x,document.documentElement.clientWidth + a.x)
    }
    ;
    ca.getDocumentScroll = function() {
        var a = document.documentElement
          , b = window;
        return O.IE && b.pageYOffset !== a.scrollTop ? new E(a.scrollLeft,a.scrollTop) : new E(b.pageXOffset || a.scrollLeft,b.pageYOffset || a.scrollTop)
    }
    ;
    ca.screenToWsCoordinates = function(a, b) {
        var c = b.x;
        b = b.y;
        var d = a.getInjectionDiv().getBoundingClientRect();
        c = new E(c - d.left,b - d.top);
        b = a.getOriginOffsetInPixels();
        return E.difference(c, b).scale(1 / a.scale)
    }
    ;
    ca.svgSize = function(a) {
        (0,
        V.warn)("Blockly.svgSize", "March 2021", "March 2022", "workspace.getCachedParentSvgSize");
        return new Ja(a.cachedWidth_,a.cachedHeight_)
    }
    ;
    ca.TEST_ONLY = {
        XY_REGEX: oe,
        XY_STYLE_REGEX: pe
    };
    var q = function(a) {
        this.tagName_ = a
    };
    q.prototype.toString = function() {
        return this.tagName_
    }
    ;
    q.ANIMATE = new q("animate");
    q.CIRCLE = new q("circle");
    q.CLIPPATH = new q("clipPath");
    q.DEFS = new q("defs");
    q.FECOMPOSITE = new q("feComposite");
    q.FECOMPONENTTRANSFER = new q("feComponentTransfer");
    q.FEFLOOD = new q("feFlood");
    q.FEFUNCA = new q("feFuncA");
    q.FEGAUSSIANBLUR = new q("feGaussianBlur");
    q.FEPOINTLIGHT = new q("fePointLight");
    q.FESPECULARLIGHTING = new q("feSpecularLighting");
    q.FILTER = new q("filter");
    q.FOREIGNOBJECT = new q("foreignObject");
    q.G = new q("g");
    q.IMAGE = new q("image");
    q.LINE = new q("line");
    q.PATH = new q("path");
    q.PATTERN = new q("pattern");
    q.POLYGON = new q("polygon");
    q.RECT = new q("rect");
    q.SVG = new q("svg");
    q.TEXT = new q("text");
    q.TSPAN = new q("tspan");
    var Na = function(a) {
        this.container_ = a;
        this.createDom()
    };
    Na.prototype.SVG_ = null;
    Na.prototype.dragGroup_ = null;
    Na.prototype.container_ = null;
    Na.prototype.scale_ = 1;
    Na.prototype.surfaceXY_ = null;
    Na.prototype.childSurfaceXY_ = new E(0,0);
    Na.prototype.createDom = function() {
        this.SVG_ || (this.SVG_ = (0,
        l.createSvgElement)(q.SVG, {
            xmlns: l.SVG_NS,
            "xmlns:html": l.HTML_NS,
            "xmlns:xlink": l.XLINK_NS,
            version: "1.1",
            "class": "blocklyBlockDragSurface"
        }, this.container_),
        this.dragGroup_ = (0,
        l.createSvgElement)(q.G, {}, this.SVG_))
    }
    ;
    Na.prototype.setBlocksAndShow = function(a) {
        if (this.dragGroup_.childNodes.length)
            throw Error("Already dragging a block.");
        this.dragGroup_.appendChild(a);
        this.SVG_.style.display = "block";
        this.surfaceXY_ = new E(0,0)
    }
    ;
    Na.prototype.translateAndScaleGroup = function(a, b, c) {
        this.scale_ = c;
        a = a.toFixed(0);
        b = b.toFixed(0);
        this.childSurfaceXY_.x = parseInt(a, 10);
        this.childSurfaceXY_.y = parseInt(b, 10);
        this.dragGroup_.setAttribute("transform", "translate(" + a + "," + b + ") scale(" + c + ")")
    }
    ;
    Na.prototype.translateSurfaceInternal_ = function() {
        var a = this.surfaceXY_.x
          , b = this.surfaceXY_.y;
        a = a.toFixed(0);
        b = b.toFixed(0);
        this.SVG_.style.display = "block";
        (0,
        l.setCssTransform)(this.SVG_, "translate3d(" + a + "px, " + b + "px, 0)")
    }
    ;
    Na.prototype.translateBy = function(a, b) {
        this.surfaceXY_ = new E(this.surfaceXY_.x + a,this.surfaceXY_.y + b);
        this.translateSurfaceInternal_()
    }
    ;
    Na.prototype.translateSurface = function(a, b) {
        this.surfaceXY_ = new E(a * this.scale_,b * this.scale_);
        this.translateSurfaceInternal_()
    }
    ;
    Na.prototype.getSurfaceTranslation = function() {
        var a = (0,
        ca.getRelativeXY)(this.SVG_);
        return new E(a.x / this.scale_,a.y / this.scale_)
    }
    ;
    Na.prototype.getGroup = function() {
        return this.dragGroup_
    }
    ;
    Na.prototype.getSvgRoot = function() {
        return this.SVG_
    }
    ;
    Na.prototype.getCurrentBlock = function() {
        return this.dragGroup_.firstChild
    }
    ;
    Na.prototype.getWsTranslation = function() {
        return this.childSurfaceXY_.clone()
    }
    ;
    Na.prototype.clearAndHide = function(a) {
        a ? a.appendChild(this.getCurrentBlock()) : this.dragGroup_.removeChild(this.getCurrentBlock());
        this.SVG_.style.display = "none";
        if (this.dragGroup_.childNodes.length)
            throw Error("Drag group was not cleared.");
        this.surfaceXY_ = null
    }
    ;
    var y = function() {};
    y.ARROW_SIZE = 16;
    y.BORDER_SIZE = 1;
    y.ARROW_HORIZONTAL_PADDING = 12;
    y.PADDING_Y = 16;
    y.ANIMATION_TIME = .25;
    y.animateOutTimer_ = null;
    y.onHide_ = null;
    y.rendererClassName_ = "";
    y.themeClassName_ = "";
    y.boundsElement_ = null;
    y.owner_ = null;
    y.positionToField_ = null;
    y.createDom = function() {
        if (!y.DIV_) {
            var a = document.createElement("div");
            a.className = "blocklyDropDownDiv";
            ((0,
            e.module$exports$Blockly$common.getParentContainer)() || document.body).appendChild(a);
            y.DIV_ = a;
            a = document.createElement("div");
            a.className = "blocklyDropDownContent";
            y.DIV_.appendChild(a);
            y.content_ = a;
            a = document.createElement("div");
            a.className = "blocklyDropDownArrow";
            y.DIV_.appendChild(a);
            y.arrow_ = a;
            y.DIV_.style.opacity = 0;
            y.DIV_.style.transition = "transform " + y.ANIMATION_TIME + "s, opacity " + y.ANIMATION_TIME + "s";
            y.DIV_.addEventListener("focusin", function() {
                (0,
                l.addClass)(y.DIV_, "blocklyFocused")
            });
            y.DIV_.addEventListener("focusout", function() {
                (0,
                l.removeClass)(y.DIV_, "blocklyFocused")
            })
        }
    }
    ;
    y.setBoundsElement = function(a) {
        y.boundsElement_ = a
    }
    ;
    y.getContentDiv = function() {
        return y.content_
    }
    ;
    y.clearContent = function() {
        y.content_.textContent = "";
        y.content_.style.width = ""
    }
    ;
    y.setColour = function(a, b) {
        y.DIV_.style.backgroundColor = a;
        y.DIV_.style.borderColor = b
    }
    ;
    y.showPositionedByBlock = function(a, b, c, d) {
        return qe(re(b), a, c, d)
    }
    ;
    y.showPositionedByField = function(a, b, c) {
        y.positionToField_ = !0;
        return qe(se(a), a, b, c)
    }
    ;
    var Zc = {}
      , re = function(a) {
        var b = a.getSvgRoot()
          , c = b.getBBox()
          , d = a.workspace.scale;
        a = c.height * d;
        c = c.width * d;
        b = (0,
        na.getPageOffset)(b);
        return new Aa(b.y,b.y + a,b.x,b.x + c)
    }
      , se = function(a) {
        a = a.getScaledBBox();
        return new Aa(a.top,a.bottom,a.left,a.right)
    }
      , qe = function(a, b, c, d) {
        var f = a.left + (a.right - a.left) / 2
          , g = a.bottom;
        a = a.top;
        d && (a += d);
        d = b.getSourceBlock();
        for (var k = d.workspace; k.options.parentWorkspace; )
            k = k.options.parentWorkspace;
        y.setBoundsElement(k.getParentSvg().parentNode);
        return y.show(b, d.RTL, f, g, f, a, c)
    };
    y.show = function(a, b, c, d, f, g, k) {
        y.owner_ = a;
        y.onHide_ = k || null;
        a = y.DIV_;
        a.style.direction = b ? "rtl" : "ltr";
        b = (0,
        e.module$exports$Blockly$common.getMainWorkspace)();
        y.rendererClassName_ = b.getRenderer().getClassName();
        y.themeClassName_ = b.getTheme().getClassName();
        (0,
        l.addClass)(a, y.rendererClassName_);
        (0,
        l.addClass)(a, y.themeClassName_);
        return te(c, d, f, g)
    }
    ;
    Zc.getBoundsInfo = function() {
        var a = (0,
        na.getPageOffset)(y.boundsElement_)
          , b = (0,
        na.getSize)(y.boundsElement_);
        return {
            left: a.x,
            right: a.x + b.width,
            top: a.y,
            bottom: a.y + b.height,
            width: b.width,
            height: b.height
        }
    }
    ;
    Zc.getPositionMetrics = function(a, b, c, d) {
        var f = Zc.getBoundsInfo()
          , g = (0,
        na.getSize)(y.DIV_);
        b + g.height < f.bottom ? a = ue(a, b, f, g) : d - g.height > f.top ? a = ve(c, d, f, g) : b + g.height < document.documentElement.clientHeight ? a = ue(a, b, f, g) : d - g.height > document.documentElement.clientTop ? a = ve(c, d, f, g) : (a = y.getPositionX(a, f.left, f.right, g.width),
        a = {
            initialX: a.divX,
            initialY: 0,
            finalX: a.divX,
            finalY: 0,
            arrowAtTop: null,
            arrowX: null,
            arrowY: null,
            arrowVisible: !1
        });
        return a
    }
    ;
    var ue = function(a, b, c, d) {
        a = y.getPositionX(a, c.left, c.right, d.width);
        return {
            initialX: a.divX,
            initialY: b,
            finalX: a.divX,
            finalY: b + y.PADDING_Y,
            arrowX: a.arrowX,
            arrowY: -(y.ARROW_SIZE / 2 + y.BORDER_SIZE),
            arrowAtTop: !0,
            arrowVisible: !0
        }
    }
      , ve = function(a, b, c, d) {
        a = y.getPositionX(a, c.left, c.right, d.width);
        return {
            initialX: a.divX,
            initialY: b - d.height,
            finalX: a.divX,
            finalY: b - d.height - y.PADDING_Y,
            arrowX: a.arrowX,
            arrowY: d.height - 2 * y.BORDER_SIZE - y.ARROW_SIZE / 2,
            arrowAtTop: !1,
            arrowVisible: !0
        }
    };
    y.getPositionX = function(a, b, c, d) {
        b = (0,
        xb.clamp)(b, a - d / 2, c - d);
        a = a - y.ARROW_SIZE / 2 - b;
        c = y.ARROW_HORIZONTAL_PADDING;
        a = (0,
        xb.clamp)(c, a, d - c - y.ARROW_SIZE);
        return {
            arrowX: a,
            divX: b
        }
    }
    ;
    y.isVisible = function() {
        return !!y.owner_
    }
    ;
    y.hideIfOwner = function(a, b) {
        return y.owner_ === a ? (b ? y.hideWithoutAnimation() : y.hide(),
        !0) : !1
    }
    ;
    y.hide = function() {
        y.DIV_.style.transform = "translate(0, 0)";
        y.DIV_.style.opacity = 0;
        y.animateOutTimer_ = setTimeout(function() {
            y.hideWithoutAnimation()
        }, 1E3 * y.ANIMATION_TIME);
        y.onHide_ && (y.onHide_(),
        y.onHide_ = null)
    }
    ;
    y.hideWithoutAnimation = function() {
        if (y.isVisible()) {
            y.animateOutTimer_ && clearTimeout(y.animateOutTimer_);
            var a = y.DIV_;
            a.style.transform = "";
            a.style.left = "";
            a.style.top = "";
            a.style.opacity = 0;
            a.style.display = "none";
            a.style.backgroundColor = "";
            a.style.borderColor = "";
            y.onHide_ && (y.onHide_(),
            y.onHide_ = null);
            y.clearContent();
            y.owner_ = null;
            y.rendererClassName_ && ((0,
            l.removeClass)(a, y.rendererClassName_),
            y.rendererClassName_ = "");
            y.themeClassName_ && ((0,
            l.removeClass)(a, y.themeClassName_),
            y.themeClassName_ = "");
            (0,
            e.module$exports$Blockly$common.getMainWorkspace)().markFocused()
        }
    }
    ;
    var te = function(a, b, c, d) {
        a = Zc.getPositionMetrics(a, b, c, d);
        a.arrowVisible ? (y.arrow_.style.display = "",
        y.arrow_.style.transform = "translate(" + a.arrowX + "px," + a.arrowY + "px) rotate(45deg)",
        y.arrow_.setAttribute("class", a.arrowAtTop ? "blocklyDropDownArrow blocklyArrowTop" : "blocklyDropDownArrow blocklyArrowBottom")) : y.arrow_.style.display = "none";
        b = Math.floor(a.initialX);
        c = Math.floor(a.initialY);
        d = Math.floor(a.finalX);
        var f = Math.floor(a.finalY)
          , g = y.DIV_;
        g.style.left = b + "px";
        g.style.top = c + "px";
        g.style.display = "block";
        g.style.opacity = 1;
        g.style.transform = "translate(" + (d - b) + "px," + (f - c) + "px)";
        return !!a.arrowAtTop
    };
    y.repositionForWindowResize = function() {
        if (y.owner_) {
            var a = y.owner_
              , b = a.getSourceBlock();
            a = y.positionToField_ ? se(a) : re(b);
            b = a.left + (a.right - a.left) / 2;
            te(b, a.bottom, b, a.top)
        } else
            y.hide()
    }
    ;
    y.TEST_ONLY = Zc;
    var yb = function(a, b) {
        this.gridPattern_ = a;
        this.spacing_ = b.spacing;
        this.length_ = b.length;
        this.line2_ = (this.line1_ = a.firstChild) && this.line1_.nextSibling;
        this.snapToGrid_ = b.snap
    };
    yb.prototype.scale_ = 1;
    yb.prototype.dispose = function() {
        this.gridPattern_ = null
    }
    ;
    yb.prototype.shouldSnap = function() {
        return this.snapToGrid_
    }
    ;
    yb.prototype.getSpacing = function() {
        return this.spacing_
    }
    ;
    yb.prototype.getPatternId = function() {
        return this.gridPattern_.id
    }
    ;
    yb.prototype.update = function(a) {
        this.scale_ = a;
        var b = this.spacing_ * a || 100;
        this.gridPattern_.setAttribute("width", b);
        this.gridPattern_.setAttribute("height", b);
        b = Math.floor(this.spacing_ / 2) + .5;
        var c = b - this.length_ / 2
          , d = b + this.length_ / 2;
        b *= a;
        c *= a;
        d *= a;
        this.setLineAttributes_(this.line1_, a, c, d, b, b);
        this.setLineAttributes_(this.line2_, a, b, b, c, d)
    }
    ;
    yb.prototype.setLineAttributes_ = function(a, b, c, d, f, g) {
        a && (a.setAttribute("stroke-width", b),
        a.setAttribute("x1", c),
        a.setAttribute("y1", f),
        a.setAttribute("x2", d),
        a.setAttribute("y2", g))
    }
    ;
    yb.prototype.moveTo = function(a, b) {
        this.gridPattern_.setAttribute("x", a);
        this.gridPattern_.setAttribute("y", b);
        (O.IE || O.EDGE) && this.update(this.scale_)
    }
    ;
    yb.createDom = function(a, b, c) {
        a = (0,
        l.createSvgElement)(q.PATTERN, {
            id: "blocklyGridPattern" + a,
            patternUnits: "userSpaceOnUse"
        }, c);
        0 < b.length && 0 < b.spacing ? ((0,
        l.createSvgElement)(q.LINE, {
            stroke: b.colour
        }, a),
        1 < b.length && (0,
        l.createSvgElement)(q.LINE, {
            stroke: b.colour
        }, a)) : (0,
        l.createSvgElement)(q.LINE, {}, a);
        return a
    }
    ;
    e.module$exports$Blockly$Msg = {};
    e.module$exports$Blockly$Msg.Msg = Object.create(null);
    e.module$exports$Blockly$utils$xml = {
        NAME_SPACE: "https://developers.google.com/blockly/xml"
    };
    var md = e.module$exports$Blockly$utils$global.globalThis.document;
    e.module$exports$Blockly$utils$xml.getDocument = function() {
        return md
    }
    ;
    e.module$exports$Blockly$utils$xml.setDocument = function(a) {
        md = a
    }
    ;
    e.module$exports$Blockly$utils$xml.createElement = function(a) {
        return md.createElementNS(e.module$exports$Blockly$utils$xml.NAME_SPACE, a)
    }
    ;
    e.module$exports$Blockly$utils$xml.createTextNode = function(a) {
        return md.createTextNode(a)
    }
    ;
    e.module$exports$Blockly$utils$xml.textToDomDocument = function(a) {
        return (new DOMParser).parseFromString(a, "text/xml")
    }
    ;
    e.module$exports$Blockly$utils$xml.domToText = function(a) {
        return (new XMLSerializer).serializeToString(a)
    }
    ;
    e.module$exports$Blockly$inputTypes = {};
    e.module$exports$Blockly$inputTypes.inputTypes = {
        VALUE: e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE,
        STATEMENT: e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT,
        DUMMY: 5
    };
    e.module$exports$Blockly$Xml = {
        workspaceToDom: function(a, b) {
            var c = (0,
            e.module$exports$Blockly$utils$xml.createElement)("xml")
              , d = (0,
            e.module$exports$Blockly$Xml.variablesToDom)(e.module$exports$Blockly$Variables.allUsedVarModels(a));
            d.hasChildNodes() && c.appendChild(d);
            d = a.getTopComments(!0);
            for (var f = 0; f < d.length; f++)
                c.appendChild(d[f].toXmlWithXY(b));
            a = a.getTopBlocks(!0);
            for (d = 0; d < a.length; d++)
                c.appendChild((0,
                e.module$exports$Blockly$Xml.blockToDomWithXY)(a[d], b));
            return c
        },
        variablesToDom: function(a) {
            for (var b = (0,
            e.module$exports$Blockly$utils$xml.createElement)("variables"), c = 0; c < a.length; c++) {
                var d = a[c]
                  , f = (0,
                e.module$exports$Blockly$utils$xml.createElement)("variable");
                f.appendChild((0,
                e.module$exports$Blockly$utils$xml.createTextNode)(d.name));
                d.type && f.setAttribute("type", d.type);
                f.id = d.getId();
                b.appendChild(f)
            }
            return b
        },
        blockToDomWithXY: function(a, b) {
            if (a.isInsertionMarker() && (a = a.getChildren(!1)[0],
            !a))
                return new DocumentFragment;
            var c;
            a.workspace.RTL && (c = a.workspace.getWidth());
            b = (0,
            e.module$exports$Blockly$Xml.blockToDom)(a, b);
            var d = a.getRelativeToSurfaceXY();
            b.setAttribute("x", Math.round(a.workspace.RTL ? c - d.x : d.x));
            b.setAttribute("y", Math.round(d.y));
            return b
        }
    };
    var Xe = function(a) {
        if (a.isSerializable()) {
            var b = (0,
            e.module$exports$Blockly$utils$xml.createElement)("field");
            b.setAttribute("name", a.name || "");
            return a.toXml(b)
        }
        return null
    };
    var Ye = function(a, b) {
        for (var c = 0; c < a.inputList.length; c++)
            for (var d = a.inputList[c], f = 0; f < d.fieldRow.length; f++) {
                var g = Xe(d.fieldRow[f]);
                g && b.appendChild(g)
            }
    };
    e.module$exports$Blockly$Xml.blockToDom = function(a, b) {
        if (a.isInsertionMarker())
            return (b = a.getChildren(!1)[0]) ? (0,
            e.module$exports$Blockly$Xml.blockToDom)(b) : new DocumentFragment;
        var c = (0,
        e.module$exports$Blockly$utils$xml.createElement)(a.isShadow() ? "shadow" : "block");
        c.setAttribute("type", a.type);
        b || c.setAttribute("id", a.id);
        if (a.mutationToDom) {
            var d = a.mutationToDom();
            d && (d.hasChildNodes() || d.hasAttributes()) && c.appendChild(d)
        }
        Ye(a, c);
        if (d = a.getCommentText()) {
            var f = a.commentModel.size
              , g = a.commentModel.pinned
              , k = (0,
            e.module$exports$Blockly$utils$xml.createElement)("comment");
            k.appendChild((0,
            e.module$exports$Blockly$utils$xml.createTextNode)(d));
            k.setAttribute("pinned", g);
            k.setAttribute("h", f.height);
            k.setAttribute("w", f.width);
            c.appendChild(k)
        }
        a.data && (d = (0,
        e.module$exports$Blockly$utils$xml.createElement)("data"),
        d.appendChild((0,
        e.module$exports$Blockly$utils$xml.createTextNode)(a.data)),
        c.appendChild(d));
        for (d = 0; d < a.inputList.length; d++)
            if (f = a.inputList[d],
            g = void 0,
            k = !0,
            f.type !== e.module$exports$Blockly$inputTypes.inputTypes.DUMMY) {
                var n = f.connection.targetBlock();
                f.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? g = (0,
                e.module$exports$Blockly$utils$xml.createElement)("value") : f.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT && (g = (0,
                e.module$exports$Blockly$utils$xml.createElement)("statement"));
                var x = f.connection.getShadowDom();
                !x || n && n.isShadow() || g.appendChild(we(x, b));
                n && (n = (0,
                e.module$exports$Blockly$Xml.blockToDom)(n, b),
                n.nodeType === l.NodeType.ELEMENT_NODE && (g.appendChild(n),
                k = !1));
                g.setAttribute("name", f.name);
                k || c.appendChild(g)
            }
        void 0 !== a.inputsInline && a.inputsInline !== a.inputsInlineDefault && c.setAttribute("inline", a.inputsInline);
        a.isCollapsed() && c.setAttribute("collapsed", !0);
        a.isEnabled() || c.setAttribute("disabled", !0);
        a.isDeletable() || a.isShadow() || c.setAttribute("deletable", !1);
        a.isMovable() || a.isShadow() || c.setAttribute("movable", !1);
        a.isEditable() || c.setAttribute("editable", !1);
        if ((d = a.getNextBlock()) && (f = (0,
        e.module$exports$Blockly$Xml.blockToDom)(d, b),
        f.nodeType === l.NodeType.ELEMENT_NODE)) {
            var B = (0,
            e.module$exports$Blockly$utils$xml.createElement)("next");
            B.appendChild(f);
            c.appendChild(B)
        }
        a = a.nextConnection && a.nextConnection.getShadowDom();
        !a || d && d.isShadow() || B.appendChild(we(a, b));
        return c
    }
    ;
    var we = function(a, b) {
        for (var c = a = a.cloneNode(!0), d; c; )
            if (b && "shadow" === c.nodeName && c.removeAttribute("id"),
            c.firstChild)
                c = c.firstChild;
            else {
                for (; c && !c.nextSibling; )
                    d = c,
                    c = c.parentNode,
                    d.nodeType === l.NodeType.TEXT_NODE && "" === d.data.trim() && c.firstChild !== d && (0,
                    l.removeNode)(d);
                c && (d = c,
                c = c.nextSibling,
                d.nodeType === l.NodeType.TEXT_NODE && "" === d.data.trim() && (0,
                l.removeNode)(d))
            }
        return a
    };
    e.module$exports$Blockly$Xml.domToText = function(a) {
        return (0,
        e.module$exports$Blockly$utils$xml.domToText)(a).replace(/<(\w+)([^<]*)\/>/g, "<$1$2></$1>")
    }
    ;
    e.module$exports$Blockly$Xml.domToPrettyText = function(a) {
        a = (0,
        e.module$exports$Blockly$Xml.domToText)(a).split("<");
        for (var b = "", c = 1; c < a.length; c++) {
            var d = a[c];
            "/" === d[0] && (b = b.substring(2));
            a[c] = b + "<" + d;
            "/" !== d[0] && "/>" !== d.slice(-2) && (b += "  ")
        }
        a = a.join("\n");
        a = a.replace(/(<(\w+)\b[^>]*>[^\n]*)\n *<\/\2>/g, "$1</$2>");
        return a.replace(/^\n/, "")
    }
    ;
    e.module$exports$Blockly$Xml.textToDom = function(a) {
        var b = (0,
        e.module$exports$Blockly$utils$xml.textToDomDocument)(a);
        if (!b || !b.documentElement || b.getElementsByTagName("parsererror").length)
            throw Error("textToDom was unable to parse: " + a);
        return b.documentElement
    }
    ;
    e.module$exports$Blockly$Xml.clearWorkspaceAndLoadFromXml = function(a, b) {
        b.setResizesEnabled(!1);
        b.clear();
        a = (0,
        e.module$exports$Blockly$Xml.domToWorkspace)(a, b);
        b.setResizesEnabled(!0);
        return a
    }
    ;
    e.module$exports$Blockly$Xml.domToWorkspace = function(a, b) {
        if (a instanceof I.Workspace) {
            var c = a;
            a = b;
            b = c;
            console.warn("Deprecated call to domToWorkspace, swap the arguments.")
        }
        var d;
        b.RTL && (d = b.getWidth());
        c = [];
        (0,
        l.startTextWidthCache)();
        var f = (0,
        h.getGroup)();
        f || (0,
        h.setGroup)(!0);
        b.setResizesEnabled && b.setResizesEnabled(!1);
        var g = !0;
        try {
            for (var k = 0, n = void 0; n = a.childNodes[k]; k++) {
                var x = n.nodeName.toLowerCase()
                  , B = n;
                if ("block" === x || "shadow" === x && !(0,
                h.getRecordUndo)()) {
                    var P = (0,
                    e.module$exports$Blockly$Xml.domToBlock)(B, b);
                    c.push(P.id);
                    var la = B.hasAttribute("x") ? parseInt(B.getAttribute("x"), 10) : 10
                      , ya = B.hasAttribute("y") ? parseInt(B.getAttribute("y"), 10) : 10;
                    isNaN(la) || isNaN(ya) || P.moveBy(b.RTL ? d - la : la, ya);
                    g = !1
                } else {
                    if ("shadow" === x)
                        throw TypeError("Shadow block cannot be a top-level block.");
                    if ("comment" === x)
                        if (b.rendered) {
                            var Qa = L.WorkspaceCommentSvg;
                            Qa ? Qa.fromXml(B, b, d) : console.warn("Missing require for Blockly.WorkspaceCommentSvg, ignoring workspace comment.")
                        } else {
                            var za = oa.WorkspaceComment;
                            za ? za.fromXml(B, b) : console.warn("Missing require for Blockly.WorkspaceComment, ignoring workspace comment.")
                        }
                    else if ("variables" === x) {
                        if (g)
                            (0,
                            e.module$exports$Blockly$Xml.domToVariables)(B, b);
                        else
                            throw Error("'variables' tag must exist once before block and shadow tag elements in the workspace XML, but it was found in another location.");
                        g = !1
                    }
                }
            }
        } finally {
            f || (0,
            h.setGroup)(!1),
            (0,
            l.stopTextWidthCache)()
        }
        b.setResizesEnabled && b.setResizesEnabled(!0);
        (0,
        h.fire)(new ((0,
        h.get)(h.FINISHED_LOADING))(b));
        return c
    }
    ;
    e.module$exports$Blockly$Xml.appendDomToWorkspace = function(a, b) {
        var c;
        Object.prototype.hasOwnProperty.call(b, "scale") && (c = b.getBlocksBoundingBox());
        a = (0,
        e.module$exports$Blockly$Xml.domToWorkspace)(a, b);
        if (c && c.top !== c.bottom) {
            var d = c.bottom;
            c = b.RTL ? c.right : c.left;
            for (var f = Infinity, g = -Infinity, k = Infinity, n = 0; n < a.length; n++) {
                var x = b.getBlockById(a[n]).getRelativeToSurfaceXY();
                x.y < k && (k = x.y);
                x.x < f && (f = x.x);
                x.x > g && (g = x.x)
            }
            d = d - k + 10;
            c = b.RTL ? c - g : c - f;
            for (f = 0; f < a.length; f++)
                b.getBlockById(a[f]).moveBy(c, d)
        }
        return a
    }
    ;
    e.module$exports$Blockly$Xml.domToBlock = function(a, b) {
        if (a instanceof I.Workspace) {
            var c = a;
            a = b;
            b = c;
            console.warn("Deprecated call to domToBlock, swap the arguments.")
        }
        (0,
        h.disable)();
        c = b.getAllVariables();
        try {
            var d = Qd(a, b)
              , f = d.getDescendants(!1);
            if (b.rendered) {
                d.setConnectionTracking(!1);
                for (var g = f.length - 1; 0 <= g; g--)
                    f[g].initSvg();
                for (var k = f.length - 1; 0 <= k; k--)
                    f[k].render(!1);
                setTimeout(function() {
                    d.disposed || d.setConnectionTracking(!0)
                }, 1);
                d.updateDisabled();
                b.resizeContents()
            } else
                for (var n = f.length - 1; 0 <= n; n--)
                    f[n].initModel()
        } finally {
            (0,
            h.enable)()
        }
        if ((0,
        h.isEnabled)()) {
            a = e.module$exports$Blockly$Variables.getAddedVariables(b, c);
            for (b = 0; b < a.length; b++)
                f = a[b],
                (0,
                h.fire)(new ((0,
                h.get)(h.VAR_CREATE))(f));
            (0,
            h.fire)(new ((0,
            h.get)(h.CREATE))(d))
        }
        return d
    }
    ;
    e.module$exports$Blockly$Xml.domToVariables = function(a, b) {
        for (var c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            if (d.nodeType === l.NodeType.ELEMENT_NODE) {
                var f = d.getAttribute("type")
                  , g = d.getAttribute("id");
                b.createVariable(d.textContent, f, g)
            }
        }
    }
    ;
    var Ze = function(a, b) {
        for (var c = 0; c < a.length; c++) {
            var d = a[c]
              , f = d.textContent
              , g = "true" === d.getAttribute("pinned")
              , k = parseInt(d.getAttribute("w"), 10);
            d = parseInt(d.getAttribute("h"), 10);
            b.setCommentText(f);
            b.commentModel.pinned = g;
            isNaN(k) || isNaN(d) || (b.commentModel.size = new Ja(k,d));
            g && b.getCommentIcon && !b.isInFlyout && setTimeout(function() {
                b.getCommentIcon().setVisible(!0)
            }, 1)
        }
    }
      , xe = function(a) {
        for (var b = {
            childBlockElement: null,
            childShadowElement: null
        }, c = 0; c < a.childNodes.length; c++) {
            var d = a.childNodes[c];
            d.nodeType === l.NodeType.ELEMENT_NODE && ("block" === d.nodeName.toLowerCase() ? b.childBlockElement = d : "shadow" === d.nodeName.toLowerCase() && (b.childShadowElement = d))
        }
        return b
    }
      , Qd = function(a, b, c, d) {
        var f = a.getAttribute("type");
        if (!f)
            throw TypeError("Block type unspecified: " + a.outerHTML);
        var g = a.getAttribute("id");
        g = b.newBlock(f, g);
        for (var k = a, n = [], x = [], B = [], P = [], la = [], ya = [], Qa = 0; Qa < k.childNodes.length; Qa++) {
            var za = k.childNodes[Qa];
            if (za.nodeType !== l.NodeType.TEXT_NODE)
                switch (za.nodeName.toLowerCase()) {
                case "mutation":
                    n.push(za);
                    break;
                case "comment":
                    if (!Ka) {
                        console.warn("Missing require for Comment, ignoring block comment.");
                        break
                    }
                    x.push(za);
                    break;
                case "data":
                    B.push(za);
                    break;
                case "title":
                case "field":
                    P.push(za);
                    break;
                case "value":
                case "statement":
                    la.push(za);
                    break;
                case "next":
                    ya.push(za);
                    break;
                default:
                    console.warn("Ignoring unknown tag: " + za.nodeName)
                }
        }
        k = g;
        Qa = !1;
        for (za = 0; za < n.length; za++) {
            var tc = n[za];
            k.domToMutation && (k.domToMutation(tc),
            k.initSvg && (Qa = !0))
        }
        n = Qa;
        Ze(x, g);
        x = g;
        for (k = 0; k < B.length; k++)
            x.data = B[k].textContent;
        if (c)
            if (d)
                if (g.previousConnection)
                    c.connect(g.previousConnection);
                else
                    throw TypeError("Next block does not have previous statement.");
            else if (g.outputConnection)
                c.connect(g.outputConnection);
            else if (g.previousConnection)
                c.connect(g.previousConnection);
            else
                throw TypeError("Child block does not have output or previous statement.");
        c = g;
        for (d = 0; d < P.length; d++)
            k = P[d],
            x = k.getAttribute("name"),
            B = c,
            (Qa = B.getField(x)) ? Qa.fromXml(k) : console.warn("Ignoring non-existent field " + x + " in block " + B.type);
        P = b;
        c = g;
        for (d = 0; d < la.length; d++) {
            B = la[d];
            x = B.getAttribute("name");
            k = c.getInput(x);
            if (!k) {
                console.warn("Ignoring non-existent input " + x + " in block " + f);
                break
            }
            B = xe(B);
            if (B.childBlockElement) {
                if (!k.connection)
                    throw TypeError("Input connection does not exist.");
                Qd(B.childBlockElement, P, k.connection, !1)
            }
            B.childShadowElement && k.connection.setShadowDom(B.childShadowElement)
        }
        f = b;
        la = g;
        for (P = 0; P < ya.length; P++) {
            c = xe(ya[P]);
            if (c.childBlockElement) {
                if (!la.nextConnection)
                    throw TypeError("Next statement does not exist.");
                if (la.nextConnection.isConnected())
                    throw TypeError("Next statement is already connected.");
                Qd(c.childBlockElement, f, la.nextConnection, !0)
            }
            c.childShadowElement && la.nextConnection && la.nextConnection.setShadowDom(c.childShadowElement)
        }
        n && g.initSvg();
        (b = a.getAttribute("inline")) && g.setInputsInline("true" === b);
        (b = a.getAttribute("disabled")) && g.setEnabled("true" !== b && "disabled" !== b);
        (b = a.getAttribute("deletable")) && g.setDeletable("true" === b);
        (b = a.getAttribute("movable")) && g.setMovable("true" === b);
        (b = a.getAttribute("editable")) && g.setEditable("true" === b);
        (b = a.getAttribute("collapsed")) && g.setCollapsed("true" === b);
        if ("shadow" === a.nodeName.toLowerCase()) {
            a = g.getChildren(!1);
            for (b = 0; b < a.length; b++)
                if (!a[b].isShadow())
                    throw TypeError("Shadow block not allowed non-shadow child.");
            if (g.getVarModels().length)
                throw TypeError("Shadow blocks cannot have variable references.");
            g.setShadow(!0)
        }
        return g
    };
    e.module$exports$Blockly$Xml.deleteNext = function(a) {
        for (var b = 0; b < a.childNodes.length; b++) {
            var c = a.childNodes[b];
            if ("next" === c.nodeName.toLowerCase()) {
                a.removeChild(c);
                break
            }
        }
    }
    ;
    var Q = {
        Position: {
            TOP: 0,
            BOTTOM: 1,
            LEFT: 2,
            RIGHT: 3
        },
        convertToolboxDefToJson: function(a) {
            if (!a)
                return null;
            if (a instanceof Element || "string" === typeof a) {
                a = (0,
                Q.parseToolboxTree)(a);
                var b = {
                    contents: Rd(a)
                };
                a instanceof Node && ye(a, b);
                a = b
            }
            b = a;
            var c = b.kind;
            b = b.contents;
            if (c && "flyoutToolbox" !== c && "categoryToolbox" !== c)
                throw Error("Invalid toolbox kind " + c + ". Please supply either flyoutToolbox or categoryToolbox");
            if (!b)
                throw Error("Toolbox must have a contents attribute.");
            return a
        },
        convertFlyoutDefToJsonArray: function(a) {
            return a ? a.contents ? a.contents : Array.isArray(a) && 0 < a.length && !a[0].nodeType ? a : Rd(a) : []
        },
        hasCategories: function(a) {
            if (!a)
                return !1;
            var b = a.kind;
            return b ? "categoryToolbox" === b : !!a.contents.filter(function(c) {
                return "CATEGORY" === c.kind.toUpperCase()
            }).length
        },
        isCategoryCollapsible: function(a) {
            return a && a.contents ? !!a.contents.filter(function(b) {
                return "CATEGORY" === b.kind.toUpperCase()
            }).length : !1
        }
    }
      , Rd = function(a) {
        var b = []
          , c = a.childNodes;
        c || (c = a);
        a = 0;
        for (var d; d = c[a]; a++)
            if (d.tagName) {
                var f = {}
                  , g = d.tagName.toUpperCase();
                f.kind = g;
                "BLOCK" === g ? f.blockxml = d : d.childNodes && 0 < d.childNodes.length && (f.contents = Rd(d));
                ye(d, f);
                b.push(f)
            }
        return b
    }
      , ye = function(a, b) {
        for (var c = 0; c < a.attributes.length; c++) {
            var d = a.attributes[c];
            -1 < d.nodeName.indexOf("css-") ? (b.cssconfig = b.cssconfig || {},
            b.cssconfig[d.nodeName.replace("css-", "")] = d.value) : b[d.nodeName] = d.value
        }
    };
    Q.parseToolboxTree = function(a) {
        if (a) {
            if ("string" !== typeof a && (O.IE && a.outerHTML ? a = a.outerHTML : a instanceof Element || (a = null)),
            "string" === typeof a && (a = (0,
            e.module$exports$Blockly$Xml.textToDom)(a),
            "xml" !== a.nodeName.toLowerCase()))
                throw TypeError("Toolbox should be an <xml> document.");
        } else
            a = null;
        return a
    }
    ;
    e.module$exports$Blockly$utils$object = {
        inherits: function(a, b) {
            a.superClass_ = b.prototype;
            Object.setPrototypeOf(a, b);
            a.prototype = Object.create(b.prototype);
            a.prototype.constructor = a
        },
        mixin: function(a, b) {
            for (var c in b)
                a[c] = b[c]
        },
        deepMerge: function(a, b) {
            for (var c in b)
                a[c] = null !== b[c] && "object" === typeof b[c] ? (0,
                e.module$exports$Blockly$utils$object.deepMerge)(a[c] || Object.create(null), b[c]) : b[c];
            return a
        },
        values: function(a) {
            return Object.values ? Object.values(a) : Object.keys(a).map(function(b) {
                return a[b]
            })
        }
    };
    var fb = function(a, b, c, d) {
        this.name = a;
        this.blockStyles = b || Object.create(null);
        this.categoryStyles = c || Object.create(null);
        this.componentStyles = d || Object.create(null);
        this.fontStyle = Object.create(null);
        this.startHats = null;
        (0,
        r.register)(r.Type.THEME, a, this)
    };
    fb.prototype.getClassName = function() {
        return this.name + "-theme"
    }
    ;
    fb.prototype.setBlockStyle = function(a, b) {
        this.blockStyles[a] = b
    }
    ;
    fb.prototype.setCategoryStyle = function(a, b) {
        this.categoryStyles[a] = b
    }
    ;
    fb.prototype.getComponentStyle = function(a) {
        return (a = this.componentStyles[a]) && "string" === typeof a && this.getComponentStyle(a) ? this.getComponentStyle(a) : a ? String(a) : null
    }
    ;
    fb.prototype.setComponentStyle = function(a, b) {
        this.componentStyles[a] = b
    }
    ;
    fb.prototype.setFontStyle = function(a) {
        this.fontStyle = a
    }
    ;
    fb.prototype.setStartHats = function(a) {
        this.startHats = a
    }
    ;
    fb.defineTheme = function(a, b) {
        var c = new fb(a)
          , d = b.base;
        d && ("string" === typeof d && (d = (0,
        r.getObject)(r.Type.THEME, d)),
        d instanceof fb && ((0,
        e.module$exports$Blockly$utils$object.deepMerge)(c, d),
        c.name = a));
        (0,
        e.module$exports$Blockly$utils$object.deepMerge)(c.blockStyles, b.blockStyles);
        (0,
        e.module$exports$Blockly$utils$object.deepMerge)(c.categoryStyles, b.categoryStyles);
        (0,
        e.module$exports$Blockly$utils$object.deepMerge)(c.componentStyles, b.componentStyles);
        (0,
        e.module$exports$Blockly$utils$object.deepMerge)(c.fontStyle, b.fontStyle);
        null !== b.startHats && (c.startHats = b.startHats);
        return c
    }
    ;
    var nd = new fb("classic",{
        colour_blocks: {
            colourPrimary: "20"
        },
        list_blocks: {
            colourPrimary: "260"
        },
        logic_blocks: {
            colourPrimary: "210"
        },
        loop_blocks: {
            colourPrimary: "120"
        },
        math_blocks: {
            colourPrimary: "230"
        },
        procedure_blocks: {
            colourPrimary: "290"
        },
        text_blocks: {
            colourPrimary: "160"
        },
        variable_blocks: {
            colourPrimary: "330"
        },
        variable_dynamic_blocks: {
            colourPrimary: "310"
        },
        hat_blocks: {
            colourPrimary: "330",
            hat: "cap"
        }
    },{
        colour_category: {
            colour: "20"
        },
        list_category: {
            colour: "260"
        },
        logic_category: {
            colour: "210"
        },
        loop_category: {
            colour: "120"
        },
        math_category: {
            colour: "230"
        },
        procedure_category: {
            colour: "290"
        },
        text_category: {
            colour: "160"
        },
        variable_category: {
            colour: "330"
        },
        variable_dynamic_category: {
            colour: "310"
        }
    });
    var gb = {
        Options: function(a) {
            var b = null
              , c = !1
              , d = !1
              , f = !1
              , g = !1
              , k = !1
              , n = !1
              , x = !!a.readOnly;
            x || (b = (0,
            Q.convertToolboxDefToJson)(a.toolbox),
            c = (0,
            Q.hasCategories)(b),
            d = a.trashcan,
            void 0 === d && (d = c),
            f = a.collapse,
            void 0 === f && (f = c),
            g = a.comments,
            void 0 === g && (g = c),
            k = a.disable,
            void 0 === k && (k = c),
            n = a.sounds,
            void 0 === n && (n = !0));
            var B = a.maxTrashcanContents;
            d ? void 0 === B && (B = 32) : B = 0;
            var P = !!a.rtl
              , la = a.horizontalLayout;
            void 0 === la && (la = !1);
            var ya = a.toolboxPosition;
            ya = "end" !== ya;
            ya = la ? ya ? Q.Position.TOP : Q.Position.BOTTOM : ya === P ? Q.Position.RIGHT : Q.Position.LEFT;
            var Qa = a.css;
            void 0 === Qa && (Qa = !0);
            var za = "https://blockly-demo.appspot.com/static/media/";
            a.media ? za = a.media : a.path && (za = a.path + "media/");
            var tc = void 0 === a.oneBasedIndex ? !0 : !!a.oneBasedIndex
              , $e = a.renderer || "geras"
              , af = a.plugins || {};
            this.RTL = P;
            this.oneBasedIndex = tc;
            this.collapse = f;
            this.comments = g;
            this.disable = k;
            this.readOnly = x;
            this.maxBlocks = a.maxBlocks || Infinity;
            this.maxInstances = a.maxInstances;
            this.pathToMedia = za;
            this.hasCategories = c;
            this.moveOptions = gb.Options.parseMoveOptions_(a, c);
            this.hasScrollbars = !!this.moveOptions.scrollbars;
            this.hasTrashcan = d;
            this.maxTrashcanContents = B;
            this.hasSounds = n;
            this.hasCss = Qa;
            this.horizontalLayout = la;
            this.languageTree = b;
            this.gridOptions = gb.Options.parseGridOptions_(a);
            this.zoomOptions = gb.Options.parseZoomOptions_(a);
            this.toolboxPosition = ya;
            this.theme = gb.Options.parseThemeOptions_(a);
            this.renderer = $e;
            this.rendererOverrides = a.rendererOverrides;
            this.gridPattern = null;
            this.parentWorkspace = a.parentWorkspace;
            this.plugins = af
        }
    };
    gb.Options.parseMoveOptions_ = function(a, b) {
        var c = a.move || {}
          , d = {};
        void 0 === c.scrollbars && void 0 === a.scrollbars ? d.scrollbars = b : "object" === typeof c.scrollbars ? (d.scrollbars = {},
        d.scrollbars.horizontal = !!c.scrollbars.horizontal,
        d.scrollbars.vertical = !!c.scrollbars.vertical,
        d.scrollbars.horizontal && d.scrollbars.vertical ? d.scrollbars = !0 : d.scrollbars.horizontal || d.scrollbars.vertical || (d.scrollbars = !1)) : d.scrollbars = !!c.scrollbars || !!a.scrollbars;
        d.wheel = d.scrollbars && void 0 !== c.wheel ? !!c.wheel : "object" === typeof d.scrollbars;
        d.drag = d.scrollbars ? void 0 === c.drag ? !0 : !!c.drag : !1;
        return d
    }
    ;
    gb.Options.parseZoomOptions_ = function(a) {
        a = a.zoom || {};
        var b = {};
        b.controls = void 0 === a.controls ? !1 : !!a.controls;
        b.wheel = void 0 === a.wheel ? !1 : !!a.wheel;
        b.startScale = void 0 === a.startScale ? 1 : Number(a.startScale);
        b.maxScale = void 0 === a.maxScale ? 3 : Number(a.maxScale);
        b.minScale = void 0 === a.minScale ? .3 : Number(a.minScale);
        b.scaleSpeed = void 0 === a.scaleSpeed ? 1.2 : Number(a.scaleSpeed);
        b.pinch = void 0 === a.pinch ? b.wheel || b.controls : !!a.pinch;
        return b
    }
    ;
    gb.Options.parseGridOptions_ = function(a) {
        a = a.grid || {};
        var b = {};
        b.spacing = Number(a.spacing) || 0;
        b.colour = a.colour || "#888";
        b.length = void 0 === a.length ? 1 : Number(a.length);
        b.snap = 0 < b.spacing && !!a.snap;
        return b
    }
    ;
    gb.Options.parseThemeOptions_ = function(a) {
        a = a.theme || nd;
        return "string" === typeof a ? (0,
        r.getObject)(r.Type.THEME, a) : a instanceof fb ? a : fb.defineTheme(a.name || "builtin" + (0,
        Va.getNextUniqueId)(), a)
    }
    ;
    var G = {
        Scrollbar: function(a, b, c, d, f) {
            this.workspace_ = a;
            this.pair_ = c || !1;
            this.horizontal_ = b;
            this.margin_ = void 0 !== f ? f : G.Scrollbar.DEFAULT_SCROLLBAR_MARGIN;
            this.ratio = this.oldHostMetrics_ = null;
            this.createDom_(d);
            this.position = new E(0,0);
            a = G.Scrollbar.scrollbarThickness;
            b ? (this.svgBackground_.setAttribute("height", a),
            this.outerSvg_.setAttribute("height", a),
            this.svgHandle_.setAttribute("height", a - 5),
            this.svgHandle_.setAttribute("y", 2.5),
            this.lengthAttribute_ = "width",
            this.positionAttribute_ = "x") : (this.svgBackground_.setAttribute("width", a),
            this.outerSvg_.setAttribute("width", a),
            this.svgHandle_.setAttribute("width", a - 5),
            this.svgHandle_.setAttribute("x", 2.5),
            this.lengthAttribute_ = "height",
            this.positionAttribute_ = "y");
            this.onMouseDownBarWrapper_ = (0,
            u.conditionalBind)(this.svgBackground_, "mousedown", this, this.onMouseDownBar_);
            this.onMouseDownHandleWrapper_ = (0,
            u.conditionalBind)(this.svgHandle_, "mousedown", this, this.onMouseDownHandle_)
        }
    };
    G.Scrollbar.prototype.origin_ = new E(0,0);
    G.Scrollbar.prototype.startDragMouse_ = 0;
    G.Scrollbar.prototype.scrollbarLength_ = 0;
    G.Scrollbar.prototype.handleLength_ = 0;
    G.Scrollbar.prototype.handlePosition_ = 0;
    G.Scrollbar.prototype.isVisible_ = !0;
    G.Scrollbar.prototype.containerVisible_ = !0;
    G.Scrollbar.scrollbarThickness = 15;
    N.TOUCH_ENABLED && (G.Scrollbar.scrollbarThickness = 25);
    G.Scrollbar.DEFAULT_SCROLLBAR_MARGIN = .5;
    G.Scrollbar.metricsAreEquivalent_ = function(a, b) {
        return a.viewWidth === b.viewWidth && a.viewHeight === b.viewHeight && a.viewLeft === b.viewLeft && a.viewTop === b.viewTop && a.absoluteTop === b.absoluteTop && a.absoluteLeft === b.absoluteLeft && a.scrollWidth === b.scrollWidth && a.scrollHeight === b.scrollHeight && a.scrollLeft === b.scrollLeft && a.scrollTop === b.scrollTop
    }
    ;
    G.Scrollbar.prototype.dispose = function() {
        this.cleanUp_();
        (0,
        u.unbind)(this.onMouseDownBarWrapper_);
        this.onMouseDownBarWrapper_ = null;
        (0,
        u.unbind)(this.onMouseDownHandleWrapper_);
        this.onMouseDownHandleWrapper_ = null;
        (0,
        l.removeNode)(this.outerSvg_);
        this.svgBackground_ = this.svgGroup_ = this.outerSvg_ = null;
        this.svgHandle_ && (this.workspace_.getThemeManager().unsubscribe(this.svgHandle_),
        this.svgHandle_ = null);
        this.workspace_ = null
    }
    ;
    G.Scrollbar.prototype.constrainHandleLength_ = function(a) {
        return 0 >= a || isNaN(a) ? 0 : Math.min(a, this.scrollbarLength_)
    }
    ;
    G.Scrollbar.prototype.setHandleLength_ = function(a) {
        this.handleLength_ = a;
        this.svgHandle_.setAttribute(this.lengthAttribute_, this.handleLength_)
    }
    ;
    G.Scrollbar.prototype.constrainHandlePosition_ = function(a) {
        return 0 >= a || isNaN(a) ? 0 : Math.min(a, this.scrollbarLength_ - this.handleLength_)
    }
    ;
    G.Scrollbar.prototype.setHandlePosition = function(a) {
        this.handlePosition_ = a;
        this.svgHandle_.setAttribute(this.positionAttribute_, this.handlePosition_)
    }
    ;
    G.Scrollbar.prototype.setScrollbarLength_ = function(a) {
        this.scrollbarLength_ = a;
        this.outerSvg_.setAttribute(this.lengthAttribute_, this.scrollbarLength_);
        this.svgBackground_.setAttribute(this.lengthAttribute_, this.scrollbarLength_)
    }
    ;
    G.Scrollbar.prototype.setPosition = function(a, b) {
        this.position.x = a;
        this.position.y = b;
        (0,
        l.setCssTransform)(this.outerSvg_, "translate(" + (this.position.x + this.origin_.x) + "px," + (this.position.y + this.origin_.y) + "px)")
    }
    ;
    G.Scrollbar.prototype.resize = function(a) {
        if (a || (a = this.workspace_.getMetrics(),
        a))
            this.oldHostMetrics_ && G.Scrollbar.metricsAreEquivalent_(a, this.oldHostMetrics_) || (this.horizontal_ ? this.resizeHorizontal_(a) : this.resizeVertical_(a),
            this.oldHostMetrics_ = a,
            this.updateMetrics_())
    }
    ;
    G.Scrollbar.prototype.requiresViewResize_ = function(a) {
        return this.oldHostMetrics_ ? this.oldHostMetrics_.viewWidth !== a.viewWidth || this.oldHostMetrics_.viewHeight !== a.viewHeight || this.oldHostMetrics_.absoluteLeft !== a.absoluteLeft || this.oldHostMetrics_.absoluteTop !== a.absoluteTop : !0
    }
    ;
    G.Scrollbar.prototype.resizeHorizontal_ = function(a) {
        this.requiresViewResize_(a) ? this.resizeViewHorizontal(a) : this.resizeContentHorizontal(a)
    }
    ;
    G.Scrollbar.prototype.resizeViewHorizontal = function(a) {
        var b = a.viewWidth - 2 * this.margin_;
        this.pair_ && (b -= G.Scrollbar.scrollbarThickness);
        this.setScrollbarLength_(Math.max(0, b));
        b = a.absoluteLeft + this.margin_;
        this.pair_ && this.workspace_.RTL && (b += G.Scrollbar.scrollbarThickness);
        this.setPosition(b, a.absoluteTop + a.viewHeight - G.Scrollbar.scrollbarThickness - this.margin_);
        this.resizeContentHorizontal(a)
    }
    ;
    G.Scrollbar.prototype.resizeContentHorizontal = function(a) {
        if (a.viewWidth >= a.scrollWidth)
            this.setHandleLength_(this.scrollbarLength_),
            this.setHandlePosition(0),
            this.pair_ || this.setVisible(!1);
        else {
            this.pair_ || this.setVisible(!0);
            var b = this.scrollbarLength_ * a.viewWidth / a.scrollWidth;
            b = this.constrainHandleLength_(b);
            this.setHandleLength_(b);
            b = a.scrollWidth - a.viewWidth;
            var c = this.scrollbarLength_ - this.handleLength_;
            a = (a.viewLeft - a.scrollLeft) / b * c;
            a = this.constrainHandlePosition_(a);
            this.setHandlePosition(a);
            this.ratio = c / b
        }
    }
    ;
    G.Scrollbar.prototype.resizeVertical_ = function(a) {
        this.requiresViewResize_(a) ? this.resizeViewVertical(a) : this.resizeContentVertical(a)
    }
    ;
    G.Scrollbar.prototype.resizeViewVertical = function(a) {
        var b = a.viewHeight - 2 * this.margin_;
        this.pair_ && (b -= G.Scrollbar.scrollbarThickness);
        this.setScrollbarLength_(Math.max(0, b));
        this.setPosition(this.workspace_.RTL ? a.absoluteLeft + this.margin_ : a.absoluteLeft + a.viewWidth - G.Scrollbar.scrollbarThickness - this.margin_, a.absoluteTop + this.margin_);
        this.resizeContentVertical(a)
    }
    ;
    G.Scrollbar.prototype.resizeContentVertical = function(a) {
        if (a.viewHeight >= a.scrollHeight)
            this.setHandleLength_(this.scrollbarLength_),
            this.setHandlePosition(0),
            this.pair_ || this.setVisible(!1);
        else {
            this.pair_ || this.setVisible(!0);
            var b = this.scrollbarLength_ * a.viewHeight / a.scrollHeight;
            b = this.constrainHandleLength_(b);
            this.setHandleLength_(b);
            b = a.scrollHeight - a.viewHeight;
            var c = this.scrollbarLength_ - this.handleLength_;
            a = (a.viewTop - a.scrollTop) / b * c;
            a = this.constrainHandlePosition_(a);
            this.setHandlePosition(a);
            this.ratio = c / b
        }
    }
    ;
    G.Scrollbar.prototype.createDom_ = function(a) {
        var b = "blocklyScrollbar" + (this.horizontal_ ? "Horizontal" : "Vertical");
        a && (b += " " + a);
        this.outerSvg_ = (0,
        l.createSvgElement)(q.SVG, {
            "class": b
        }, null);
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {}, this.outerSvg_);
        this.svgBackground_ = (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyScrollbarBackground"
        }, this.svgGroup_);
        a = Math.floor((G.Scrollbar.scrollbarThickness - 5) / 2);
        this.svgHandle_ = (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyScrollbarHandle",
            rx: a,
            ry: a
        }, this.svgGroup_);
        this.workspace_.getThemeManager().subscribe(this.svgHandle_, "scrollbarColour", "fill");
        this.workspace_.getThemeManager().subscribe(this.svgHandle_, "scrollbarOpacity", "fill-opacity");
        (0,
        l.insertAfter)(this.outerSvg_, this.workspace_.getParentSvg())
    }
    ;
    G.Scrollbar.prototype.isVisible = function() {
        return this.isVisible_
    }
    ;
    G.Scrollbar.prototype.setContainerVisible = function(a) {
        var b = a !== this.containerVisible_;
        this.containerVisible_ = a;
        b && this.updateDisplay_()
    }
    ;
    G.Scrollbar.prototype.setVisible = function(a) {
        var b = a !== this.isVisible();
        if (this.pair_)
            throw Error("Unable to toggle visibility of paired scrollbars.");
        this.isVisible_ = a;
        b && this.updateDisplay_()
    }
    ;
    G.Scrollbar.prototype.updateDisplay_ = function() {
        this.containerVisible_ && this.isVisible() ? this.outerSvg_.setAttribute("display", "block") : this.outerSvg_.setAttribute("display", "none")
    }
    ;
    G.Scrollbar.prototype.onMouseDownBar_ = function(a) {
        this.workspace_.markFocused();
        (0,
        N.clearTouchIdentifier)();
        this.cleanUp_();
        if ((0,
        u.isRightButton)(a))
            a.stopPropagation();
        else {
            var b = (0,
            u.mouseToSvg)(a, this.workspace_.getParentSvg(), this.workspace_.getInverseScreenCTM());
            b = this.horizontal_ ? b.x : b.y;
            var c = (0,
            ca.getInjectionDivXY)(this.svgHandle_);
            c = this.horizontal_ ? c.x : c.y;
            var d = this.handlePosition_
              , f = .95 * this.handleLength_;
            b <= c ? d -= f : b >= c + this.handleLength_ && (d += f);
            this.setHandlePosition(this.constrainHandlePosition_(d));
            this.updateMetrics_();
            a.stopPropagation();
            a.preventDefault()
        }
    }
    ;
    G.Scrollbar.prototype.onMouseDownHandle_ = function(a) {
        this.workspace_.markFocused();
        this.cleanUp_();
        (0,
        u.isRightButton)(a) ? a.stopPropagation() : (this.startDragHandle = this.handlePosition_,
        this.workspace_.setupDragSurface(),
        this.startDragMouse_ = this.horizontal_ ? a.clientX : a.clientY,
        G.Scrollbar.onMouseUpWrapper_ = (0,
        u.conditionalBind)(document, "mouseup", this, this.onMouseUpHandle_),
        G.Scrollbar.onMouseMoveWrapper_ = (0,
        u.conditionalBind)(document, "mousemove", this, this.onMouseMoveHandle_),
        a.stopPropagation(),
        a.preventDefault())
    }
    ;
    G.Scrollbar.prototype.onMouseMoveHandle_ = function(a) {
        this.setHandlePosition(this.constrainHandlePosition_(this.startDragHandle + ((this.horizontal_ ? a.clientX : a.clientY) - this.startDragMouse_)));
        this.updateMetrics_()
    }
    ;
    G.Scrollbar.prototype.onMouseUpHandle_ = function() {
        this.workspace_.resetDragSurface();
        (0,
        N.clearTouchIdentifier)();
        this.cleanUp_()
    }
    ;
    G.Scrollbar.prototype.cleanUp_ = function() {
        this.workspace_.hideChaff(!0);
        G.Scrollbar.onMouseUpWrapper_ && ((0,
        u.unbind)(G.Scrollbar.onMouseUpWrapper_),
        G.Scrollbar.onMouseUpWrapper_ = null);
        G.Scrollbar.onMouseMoveWrapper_ && ((0,
        u.unbind)(G.Scrollbar.onMouseMoveWrapper_),
        G.Scrollbar.onMouseMoveWrapper_ = null)
    }
    ;
    G.Scrollbar.prototype.getRatio_ = function() {
        var a = this.handlePosition_ / (this.scrollbarLength_ - this.handleLength_);
        isNaN(a) && (a = 0);
        return a
    }
    ;
    G.Scrollbar.prototype.updateMetrics_ = function() {
        var a = this.getRatio_()
          , b = {};
        this.horizontal_ ? b.x = a : b.y = a;
        this.workspace_.setMetrics(b)
    }
    ;
    G.Scrollbar.prototype.set = function(a, b) {
        this.setHandlePosition(this.constrainHandlePosition_(a * this.ratio));
        (b || void 0 === b) && this.updateMetrics_()
    }
    ;
    G.Scrollbar.prototype.setOrigin = function(a, b) {
        this.origin_ = new E(a,b)
    }
    ;
    var hb = function(a, b, c, d, f) {
        this.workspace_ = a;
        b = void 0 === b ? !0 : b;
        c = void 0 === c ? !0 : c;
        var g = b && c;
        b && (this.hScroll = new G.Scrollbar(a,!0,g,d,f));
        c && (this.vScroll = new G.Scrollbar(a,!1,g,d,f));
        g && (this.corner_ = (0,
        l.createSvgElement)(q.RECT, {
            height: G.Scrollbar.scrollbarThickness,
            width: G.Scrollbar.scrollbarThickness,
            "class": "blocklyScrollbarBackground"
        }, null),
        (0,
        l.insertAfter)(this.corner_, a.getBubbleCanvas()));
        this.oldHostMetrics_ = null
    };
    hb.prototype.dispose = function() {
        (0,
        l.removeNode)(this.corner_);
        this.oldHostMetrics_ = this.workspace_ = this.corner_ = null;
        this.hScroll && (this.hScroll.dispose(),
        this.hScroll = null);
        this.vScroll && (this.vScroll.dispose(),
        this.vScroll = null)
    }
    ;
    hb.prototype.resize = function() {
        var a = this.workspace_.getMetrics();
        if (a) {
            var b = !1
              , c = !1;
            this.oldHostMetrics_ && this.oldHostMetrics_.viewWidth === a.viewWidth && this.oldHostMetrics_.viewHeight === a.viewHeight && this.oldHostMetrics_.absoluteTop === a.absoluteTop && this.oldHostMetrics_.absoluteLeft === a.absoluteLeft ? (this.oldHostMetrics_ && this.oldHostMetrics_.scrollWidth === a.scrollWidth && this.oldHostMetrics_.viewLeft === a.viewLeft && this.oldHostMetrics_.scrollLeft === a.scrollLeft || (b = !0),
            this.oldHostMetrics_ && this.oldHostMetrics_.scrollHeight === a.scrollHeight && this.oldHostMetrics_.viewTop === a.viewTop && this.oldHostMetrics_.scrollTop === a.scrollTop || (c = !0)) : c = b = !0;
            if (b || c) {
                try {
                    (0,
                    h.disable)(),
                    this.hScroll && b && this.hScroll.resize(a),
                    this.vScroll && c && this.vScroll.resize(a)
                } finally {
                    (0,
                    h.enable)()
                }
                this.workspace_.maybeFireViewportChangeEvent()
            }
            this.hScroll && this.vScroll && (this.oldHostMetrics_ && this.oldHostMetrics_.viewWidth === a.viewWidth && this.oldHostMetrics_.absoluteLeft === a.absoluteLeft || this.corner_.setAttribute("x", this.vScroll.position.x),
            this.oldHostMetrics_ && this.oldHostMetrics_.viewHeight === a.viewHeight && this.oldHostMetrics_.absoluteTop === a.absoluteTop || this.corner_.setAttribute("y", this.hScroll.position.y));
            this.oldHostMetrics_ = a
        }
    }
    ;
    hb.prototype.canScrollHorizontally = function() {
        return !!this.hScroll
    }
    ;
    hb.prototype.canScrollVertically = function() {
        return !!this.vScroll
    }
    ;
    hb.prototype.setOrigin = function(a, b) {
        this.hScroll && this.hScroll.setOrigin(a, b);
        this.vScroll && this.vScroll.setOrigin(a, b)
    }
    ;
    hb.prototype.set = function(a, b, c) {
        this.hScroll && this.hScroll.set(a, !1);
        this.vScroll && this.vScroll.set(b, !1);
        if (c || void 0 === c)
            a = {},
            this.hScroll && (a.x = this.hScroll.getRatio_()),
            this.vScroll && (a.y = this.vScroll.getRatio_()),
            this.workspace_.setMetrics(a)
    }
    ;
    hb.prototype.setX = function(a) {
        this.hScroll && this.hScroll.set(a, !0)
    }
    ;
    hb.prototype.setY = function(a) {
        this.vScroll && this.vScroll.set(a, !0)
    }
    ;
    hb.prototype.setContainerVisible = function(a) {
        this.hScroll && this.hScroll.setContainerVisible(a);
        this.vScroll && this.vScroll.setContainerVisible(a)
    }
    ;
    hb.prototype.isVisible = function() {
        var a = !1;
        this.hScroll && (a = this.hScroll.isVisible());
        this.vScroll && (a = a || this.vScroll.isVisible());
        return a
    }
    ;
    hb.prototype.resizeContent = function(a) {
        this.hScroll && this.hScroll.resizeContentHorizontal(a);
        this.vScroll && this.vScroll.resizeContentVertical(a)
    }
    ;
    hb.prototype.resizeView = function(a) {
        this.hScroll && this.hScroll.resizeViewHorizontal(a);
        this.vScroll && this.vScroll.resizeViewVertical(a)
    }
    ;
    var H = {
        WIN_KEY_FF_LINUX: 0,
        MAC_ENTER: 3,
        BACKSPACE: 8,
        TAB: 9,
        NUM_CENTER: 12,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        PLUS_SIGN: 43,
        PRINT_SCREEN: 44,
        INSERT: 45,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        FF_SEMICOLON: 59,
        FF_EQUALS: 61,
        FF_DASH: 173,
        FF_HASH: 163,
        QUESTION_MARK: 63,
        AT_SIGN: 64,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        META: 91,
        WIN_KEY_RIGHT: 92,
        CONTEXT_MENU: 93,
        NUM_ZERO: 96,
        NUM_ONE: 97,
        NUM_TWO: 98,
        NUM_THREE: 99,
        NUM_FOUR: 100,
        NUM_FIVE: 101,
        NUM_SIX: 102,
        NUM_SEVEN: 103,
        NUM_EIGHT: 104,
        NUM_NINE: 105,
        NUM_MULTIPLY: 106,
        NUM_PLUS: 107,
        NUM_MINUS: 109,
        NUM_PERIOD: 110,
        NUM_DIVISION: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUMLOCK: 144,
        SCROLL_LOCK: 145,
        FIRST_MEDIA_KEY: 166,
        LAST_MEDIA_KEY: 183,
        SEMICOLON: 186,
        DASH: 189,
        EQUALS: 187,
        COMMA: 188,
        PERIOD: 190,
        SLASH: 191,
        APOSTROPHE: 192,
        TILDE: 192,
        SINGLE_QUOTE: 222,
        OPEN_SQUARE_BRACKET: 219,
        BACKSLASH: 220,
        CLOSE_SQUARE_BRACKET: 221,
        WIN_KEY: 224,
        MAC_FF_META: 224,
        MAC_WK_CMD_LEFT: 91,
        MAC_WK_CMD_RIGHT: 93,
        WIN_IME: 229,
        VK_NONAME: 252,
        PHANTOM: 255
    }
      , K = {
        ShortcutRegistry: function() {
            K.ShortcutRegistry.registry = this;
            this.registry_ = Object.create(null);
            this.keyMap_ = Object.create(null)
        }
    };
    K.ShortcutRegistry.modifierKeys = {
        Shift: H.SHIFT,
        Control: H.CTRL,
        Alt: H.ALT,
        Meta: H.META
    };
    K.ShortcutRegistry.prototype.register = function(a, b) {
        if (this.registry_[a.name] && !b)
            throw Error('Shortcut with name "' + a.name + '" already exists.');
        this.registry_[a.name] = a
    }
    ;
    K.ShortcutRegistry.prototype.unregister = function(a) {
        if (!this.registry_[a])
            return console.warn('Keyboard shortcut with name "' + a + '" not found.'),
            !1;
        this.removeAllKeyMappings(a);
        delete this.registry_[a];
        return !0
    }
    ;
    K.ShortcutRegistry.prototype.addKeyMapping = function(a, b, c) {
        a = String(a);
        var d = this.keyMap_[a];
        if (d && !c)
            throw Error('Shortcut with name "' + b + '" collides with shortcuts ' + d.toString());
        d && c ? d.unshift(b) : this.keyMap_[a] = [b]
    }
    ;
    K.ShortcutRegistry.prototype.removeKeyMapping = function(a, b, c) {
        var d = this.keyMap_[a];
        if (!d && !c)
            return console.warn('No keyboard shortcut with name "' + b + '" registered with key code "' + a + '"'),
            !1;
        var f = d.indexOf(b);
        if (-1 < f)
            return d.splice(f, 1),
            0 === d.length && delete this.keyMap_[a],
            !0;
        c || console.warn('No keyboard shortcut with name "' + b + '" registered with key code "' + a + '"');
        return !1
    }
    ;
    K.ShortcutRegistry.prototype.removeAllKeyMappings = function(a) {
        for (var b in this.keyMap_)
            this.removeKeyMapping(b, a, !0)
    }
    ;
    K.ShortcutRegistry.prototype.setKeyMap = function(a) {
        this.keyMap_ = a
    }
    ;
    K.ShortcutRegistry.prototype.getKeyMap = function() {
        return (0,
        e.module$exports$Blockly$utils$object.deepMerge)(Object.create(null), this.keyMap_)
    }
    ;
    K.ShortcutRegistry.prototype.getRegistry = function() {
        return (0,
        e.module$exports$Blockly$utils$object.deepMerge)(Object.create(null), this.registry_)
    }
    ;
    K.ShortcutRegistry.prototype.onKeyDown = function(a, b) {
        var c = this.serializeKeyEvent_(b);
        c = this.getShortcutNamesByKeyCode(c);
        if (!c)
            return !1;
        for (var d = 0, f; f = c[d]; d++)
            if (f = this.registry_[f],
            (!f.preconditionFn || f.preconditionFn(a)) && f.callback && f.callback(a, b, f))
                return !0;
        return !1
    }
    ;
    K.ShortcutRegistry.prototype.getShortcutNamesByKeyCode = function(a) {
        return this.keyMap_[a] || []
    }
    ;
    K.ShortcutRegistry.prototype.getKeyCodesByShortcutName = function(a) {
        var b = [], c;
        for (c in this.keyMap_)
            -1 < this.keyMap_[c].indexOf(a) && b.push(c);
        return b
    }
    ;
    K.ShortcutRegistry.prototype.serializeKeyEvent_ = function(a) {
        var b = "", c;
        for (c in K.ShortcutRegistry.modifierKeys)
            a.getModifierState(c) && ("" !== b && (b += "+"),
            b += c);
        "" !== b && a.keyCode ? b = b + "+" + a.keyCode : a.keyCode && (b = a.keyCode.toString());
        return b
    }
    ;
    K.ShortcutRegistry.prototype.checkModifiers_ = function(a) {
        for (var b = (0,
        e.module$exports$Blockly$utils$object.values)(K.ShortcutRegistry.modifierKeys), c = 0, d; d = a[c]; c++)
            if (0 > b.indexOf(d))
                throw Error(d + " is not a valid modifier key.");
    }
    ;
    K.ShortcutRegistry.prototype.createSerializedKey = function(a, b) {
        var c = "";
        if (b) {
            this.checkModifiers_(b);
            for (var d in K.ShortcutRegistry.modifierKeys)
                -1 < b.indexOf(K.ShortcutRegistry.modifierKeys[d]) && ("" !== c && (c += "+"),
                c += d)
        }
        "" !== c && a ? c = c + "+" + a : a && (c = a.toString());
        return c
    }
    ;
    new K.ShortcutRegistry;
    var bc = function(a) {
        this.container_ = a;
        this.createDom()
    };
    bc.prototype.SVG_ = null;
    bc.prototype.container_ = null;
    bc.prototype.createDom = function() {
        this.SVG_ || (this.SVG_ = (0,
        l.createSvgElement)(q.SVG, {
            xmlns: l.SVG_NS,
            "xmlns:html": l.HTML_NS,
            "xmlns:xlink": l.XLINK_NS,
            version: "1.1",
            "class": "blocklyWsDragSurface blocklyOverflowVisible"
        }, null),
        this.container_.appendChild(this.SVG_))
    }
    ;
    bc.prototype.translateSurface = function(a, b) {
        a = a.toFixed(0);
        b = b.toFixed(0);
        this.SVG_.style.display = "block";
        (0,
        l.setCssTransform)(this.SVG_, "translate3d(" + a + "px, " + b + "px, 0)")
    }
    ;
    bc.prototype.getSurfaceTranslation = function() {
        return (0,
        ca.getRelativeXY)(this.SVG_)
    }
    ;
    bc.prototype.clearAndHide = function(a) {
        if (!a)
            throw Error("Couldn't clear and hide the drag surface: missing new surface.");
        var b = this.SVG_.childNodes[0]
          , c = this.SVG_.childNodes[1];
        if (!(b && c && (0,
        l.hasClass)(b, "blocklyBlockCanvas") && (0,
        l.hasClass)(c, "blocklyBubbleCanvas")))
            throw Error("Couldn't clear and hide the drag surface. A node was missing.");
        null !== this.previousSibling_ ? (0,
        l.insertAfter)(b, this.previousSibling_) : a.insertBefore(b, a.firstChild);
        (0,
        l.insertAfter)(c, b);
        this.SVG_.style.display = "none";
        if (this.SVG_.childNodes.length)
            throw Error("Drag surface was not cleared.");
        (0,
        l.setCssTransform)(this.SVG_, "");
        this.previousSibling_ = null
    }
    ;
    bc.prototype.setContentsAndShow = function(a, b, c, d, f, g) {
        if (this.SVG_.childNodes.length)
            throw Error("Already dragging a block.");
        this.previousSibling_ = c;
        a.setAttribute("transform", "translate(0, 0) scale(" + g + ")");
        b.setAttribute("transform", "translate(0, 0) scale(" + g + ")");
        this.SVG_.setAttribute("width", d);
        this.SVG_.setAttribute("height", f);
        this.SVG_.appendChild(a);
        this.SVG_.appendChild(b);
        this.SVG_.style.display = "block"
    }
    ;
    var rb = {}
      , cc = null;
    rb.copy = function(a) {
        cc = a.toCopyData()
    }
    ;
    rb.paste = function() {
        if (!cc)
            return !1;
        var a = cc.source;
        a.isFlyout && (a = a.targetWorkspace);
        return cc.typeCounts && a.isCapacityAvailable(cc.typeCounts) ? ((0,
        h.setGroup)(!0),
        a.paste(cc.saveInfo),
        (0,
        h.setGroup)(!1),
        !0) : !1
    }
    ;
    rb.duplicate = function(a) {
        var b = cc;
        (0,
        rb.copy)(a);
        a.workspace.paste(cc.saveInfo);
        cc = b
    }
    ;
    var Ya = function(a, b) {
        this.content_ = a;
        this.value_ = b;
        this.enabled_ = !0;
        this.element_ = null;
        this.rightToLeft_ = !1;
        this.roleName_ = null;
        this.highlight_ = this.checked_ = this.checkable_ = !1;
        this.actionHandler_ = null
    };
    Ya.prototype.createDom = function() {
        var a = document.createElement("div");
        a.id = (0,
        Va.getNextUniqueId)();
        this.element_ = a;
        a.className = "blocklyMenuItem goog-menuitem " + (this.enabled_ ? "" : "blocklyMenuItemDisabled goog-menuitem-disabled ") + (this.checked_ ? "blocklyMenuItemSelected goog-option-selected " : "") + (this.highlight_ ? "blocklyMenuItemHighlight goog-menuitem-highlight " : "") + (this.rightToLeft_ ? "blocklyMenuItemRtl goog-menuitem-rtl " : "");
        var b = document.createElement("div");
        b.className = "blocklyMenuItemContent goog-menuitem-content";
        if (this.checkable_) {
            var c = document.createElement("div");
            c.className = "blocklyMenuItemCheckbox goog-menuitem-checkbox";
            b.appendChild(c)
        }
        c = this.content_;
        "string" === typeof this.content_ && (c = document.createTextNode(this.content_));
        b.appendChild(c);
        a.appendChild(b);
        this.roleName_ && (0,
        J.setRole)(a, this.roleName_);
        (0,
        J.setState)(a, J.State.SELECTED, this.checkable_ && this.checked_ || !1);
        (0,
        J.setState)(a, J.State.DISABLED, !this.enabled_);
        return a
    }
    ;
    Ya.prototype.dispose = function() {
        this.element_ = null
    }
    ;
    Ya.prototype.getElement = function() {
        return this.element_
    }
    ;
    Ya.prototype.getId = function() {
        return this.element_.id
    }
    ;
    Ya.prototype.getValue = function() {
        return this.value_
    }
    ;
    Ya.prototype.setRightToLeft = function(a) {
        this.rightToLeft_ = a
    }
    ;
    Ya.prototype.setRole = function(a) {
        this.roleName_ = a
    }
    ;
    Ya.prototype.setCheckable = function(a) {
        this.checkable_ = a
    }
    ;
    Ya.prototype.setChecked = function(a) {
        this.checked_ = a 
    }
    ;
    Ya.prototype.setHighlighted = function(a) {
        this.highlight_ = a;
        var b = this.getElement();
        b && this.isEnabled() && (a ? ((0,
        l.addClass)(b, "blocklyMenuItemHighlight"),
        (0,
        l.addClass)(b, "goog-menuitem-highlight")) : ((0,
        l.removeClass)(b, "blocklyMenuItemHighlight"),
        (0,
        l.removeClass)(b, "goog-menuitem-highlight")))
    }
    ;
    Ya.prototype.isEnabled = function() {
        return this.enabled_
    }
    ;
    Ya.prototype.setEnabled = function(a) {
        this.enabled_ = a
    }
    ;
    Ya.prototype.performAction = function() {
        this.isEnabled() && this.actionHandler_ && this.actionHandler_(this)
    }
    ;
    Ya.prototype.onAction = function(a, b) {
        this.actionHandler_ = a.bind(b)
    }
    ;
    var Fa = function() {
        this.menuItems_ = [];
        this.roleName_ = this.element_ = this.onKeyDownHandler_ = this.mouseLeaveHandler_ = this.mouseEnterHandler_ = this.clickHandler_ = this.mouseOverHandler_ = this.highlightedItem_ = this.openingCoords = null
    };
    Fa.prototype.addChild = function(a) {
        this.menuItems_.push(a)
    }
    ;
    Fa.prototype.render = function(a) {
        var b = document.createElement("div");
        b.className = "blocklyMenu goog-menu blocklyNonSelectable";
        b.tabIndex = 0;
        this.roleName_ && (0,
        J.setRole)(b, this.roleName_);
        this.element_ = b;
        for (var c = 0, d; d = this.menuItems_[c]; c++)
            b.appendChild(d.createDom());
        this.mouseOverHandler_ = (0,
        u.conditionalBind)(b, "mouseover", this, this.handleMouseOver_, !0);
        this.clickHandler_ = (0,
        u.conditionalBind)(b, "click", this, this.handleClick_, !0);
        this.mouseEnterHandler_ = (0,
        u.conditionalBind)(b, "mouseenter", this, this.handleMouseEnter_, !0);
        this.mouseLeaveHandler_ = (0,
        u.conditionalBind)(b, "mouseleave", this, this.handleMouseLeave_, !0);
        this.onKeyDownHandler_ = (0,
        u.conditionalBind)(b, "keydown", this, this.handleKeyEvent_);
        a.appendChild(b)
    }
    ;
    Fa.prototype.getElement = function() {
        return this.element_
    }
    ;
    Fa.prototype.focus = function() {
        var a = this.getElement();
        a && (a.focus({
            preventScroll: !0
        }),
        (0,
        l.addClass)(a, "blocklyFocused"))
    }
    ;
    Fa.prototype.blur_ = function() {
        var a = this.getElement();
        a && (a.blur(),
        (0,
        l.removeClass)(a, "blocklyFocused"))
    }
    ;
    Fa.prototype.setRole = function(a) {
        this.roleName_ = a
    }
    ;
    Fa.prototype.dispose = function() {
        this.mouseOverHandler_ && ((0,
        u.unbind)(this.mouseOverHandler_),
        this.mouseOverHandler_ = null);
        this.clickHandler_ && ((0,
        u.unbind)(this.clickHandler_),
        this.clickHandler_ = null);
        this.mouseEnterHandler_ && ((0,
        u.unbind)(this.mouseEnterHandler_),
        this.mouseEnterHandler_ = null);
        this.mouseLeaveHandler_ && ((0,
        u.unbind)(this.mouseLeaveHandler_),
        this.mouseLeaveHandler_ = null);
        this.onKeyDownHandler_ && ((0,
        u.unbind)(this.onKeyDownHandler_),
        this.onKeyDownHandler_ = null);
        for (var a = 0, b; b = this.menuItems_[a]; a++)
            b.dispose();
        this.element_ = null
    }
    ;
    Fa.prototype.getMenuItem_ = function(a) {
        for (var b = this.getElement(); a && a !== b; ) {
            if ((0,
            l.hasClass)(a, "blocklyMenuItem"))
                for (var c = 0, d; d = this.menuItems_[c]; c++)
                    if (d.getElement() === a)
                        return d;
            a = a.parentElement
        }
        return null
    }
    ;
    Fa.prototype.setHighlighted = function(a) {
        var b = this.highlightedItem_;
        b && (b.setHighlighted(!1),
        this.highlightedItem_ = null);
        a && (a.setHighlighted(!0),
        this.highlightedItem_ = a,
        b = this.getElement(),
        (0,
        na.scrollIntoContainerView)(a.getElement(), b),
        (0,
        J.setState)(b, J.State.ACTIVEDESCENDANT, a.getId()))
    }
    ;
    Fa.prototype.highlightNext = function() {
        var a = this.menuItems_.indexOf(this.highlightedItem_);
        this.highlightHelper_(a, 1)
    }
    ;
    Fa.prototype.highlightPrevious = function() {
        var a = this.menuItems_.indexOf(this.highlightedItem_);
        this.highlightHelper_(0 > a ? this.menuItems_.length : a, -1)
    }
    ;
    Fa.prototype.highlightFirst_ = function() {
        this.highlightHelper_(-1, 1)
    }
    ;
    Fa.prototype.highlightLast_ = function() {
        this.highlightHelper_(this.menuItems_.length, -1)
    }
    ;
    Fa.prototype.highlightHelper_ = function(a, b) {
        a += b;
        for (var c; c = this.menuItems_[a]; ) {
            if (c.isEnabled()) {
                this.setHighlighted(c);
                break
            }
            a += b
        }
    }
    ;
    Fa.prototype.handleMouseOver_ = function(a) {
        (a = this.getMenuItem_(a.target)) && (a.isEnabled() ? this.highlightedItem_ !== a && this.setHighlighted(a) : this.setHighlighted(null))
    }
    ;
    Fa.prototype.handleClick_ = function(a) {
        var b = this.openingCoords;
        this.openingCoords = null;
        if (b && "number" === typeof a.clientX) {
            var c = new E(a.clientX,a.clientY);
            if (1 > E.distance(b, c))
                return
        }
        (a = this.getMenuItem_(a.target)) && a.performAction()
    }
    ;
    Fa.prototype.handleMouseEnter_ = function(a) {
        this.focus()
    }
    ;
    Fa.prototype.handleMouseLeave_ = function(a) {
        this.getElement() && (this.blur_(),
        this.setHighlighted(null))
    }
    ;
    Fa.prototype.handleKeyEvent_ = function(a) {
        if (this.menuItems_.length && !(a.shiftKey || a.ctrlKey || a.metaKey || a.altKey)) {
            var b = this.highlightedItem_;
            switch (a.keyCode) {
            case H.ENTER:
            case H.SPACE:
                b && b.performAction();
                break;
            case H.UP:
                this.highlightPrevious();
                break;
            case H.DOWN:
                this.highlightNext();
                break;
            case H.PAGE_UP:
            case H.HOME:
                this.highlightFirst_();
                break;
            case H.PAGE_DOWN:
            case H.END:
                this.highlightLast_();
                break;
            default:
                return
            }
            a.preventDefault();
            a.stopPropagation()
        }
    }
    ;
    Fa.prototype.getSize = function() {
        var a = this.getElement()
          , b = (0,
        na.getSize)(a);
        b.height = a.scrollHeight;
        return b
    }
    ;
    var Sd = {
        VARIABLES: 100,
        BLOCKS: 50
    }
      , Td = {
        register: function(a, b) {
            (0,
            r.register)(r.Type.SERIALIZER, a, b)
        },
        unregister: function(a) {
            (0,
            r.unregister)(r.Type.SERIALIZER, a)
        }
    }
      , ua = {
        DeserializationError: function() {
            var a = Error.apply(this, arguments);
            this.message = a.message;
            "stack"in a && (this.stack = a.stack)
        }
    };
    w.inherits(ua.DeserializationError, Error);
    ua.MissingBlockType = function(a) {
        ua.DeserializationError.call(this, "Expected to find a 'type' property, defining the block type");
        this.state = a
    }
    ;
    w.inherits(ua.MissingBlockType, ua.DeserializationError);
    ua.MissingConnection = function(a, b, c) {
        ua.DeserializationError.call(this, "The block " + b.toDevString() + " is missing a(n) " + a + "\nconnection");
        this.block = b;
        this.state = c
    }
    ;
    w.inherits(ua.MissingConnection, ua.DeserializationError);
    ua.BadConnectionCheck = function(a, b, c, d) {
        ua.DeserializationError.call(this, "The block " + c.toDevString() + " could not connect its\n" + b + " to its parent, because: " + a);
        this.childBlock = c;
        this.childState = d
    }
    ;
    w.inherits(ua.BadConnectionCheck, ua.DeserializationError);
    ua.RealChildOfShadow = function(a) {
        ua.DeserializationError.call(this, "Encountered a real block which is defined as a child of a shadow\nblock. It is an invariant of Blockly that shadow blocks only have shadow\nchildren");
        this.state = a
    }
    ;
    w.inherits(ua.RealChildOfShadow, ua.DeserializationError);
    var od = function() {};
    od.prototype.save = function(a) {}
    ;
    od.prototype.load = function(a, b) {}
    ;
    od.prototype.clear = function(a) {}
    ;
    var Sa = {
        save: function(a, b) {
            var c = void 0 === b ? {} : b;
            b = void 0 === c.addCoordinates ? !1 : c.addCoordinates;
            var d = void 0 === c.addInputBlocks ? !0 : c.addInputBlocks
              , f = void 0 === c.addNextBlocks ? !0 : c.addNextBlocks;
            c = void 0 === c.doFullSerialization ? !0 : c.doFullSerialization;
            if (a.isInsertionMarker())
                return null;
            var g = {
                type: a.type,
                id: a.id
            };
            if (b) {
                b = a;
                var k = b.workspace;
                b = b.getRelativeToSurfaceXY();
                g.x = Math.round(k.RTL ? k.getWidth() - b.x : b.x);
                g.y = Math.round(b.y)
            }
            a.isCollapsed() && (g.collapsed = !0);
            a.isEnabled() || (g.enabled = !1);
            void 0 !== a.inputsInline && a.inputsInline !== a.inputsInlineDefault && (g.inline = a.inputsInline);
            a.data && (g.data = a.data);
            b = a;
            b.saveExtraState ? (b = b.saveExtraState(),
            null !== b && (g.extraState = b)) : b.mutationToDom && (b = b.mutationToDom(),
            null !== b && (g.extraState = (0,
            e.module$exports$Blockly$Xml.domToText)(b).replace(' xmlns="https://developers.google.com/blockly/xml"', "")));
            a.getCommentText() && (g.icons = {
                comment: {
                    text: a.getCommentText(),
                    pinned: a.commentModel.pinned,
                    height: Math.round(a.commentModel.size.height),
                    width: Math.round(a.commentModel.size.width)
                }
            });
            b = c;
            k = Object.create(null);
            for (var n = 0; n < a.inputList.length; n++)
                for (var x = a.inputList[n], B = 0; B < x.fieldRow.length; B++) {
                    var P = x.fieldRow[B];
                    P.isSerializable() && (k[P.name] = P.saveState(b))
                }
            Object.keys(k).length && (g.fields = k);
            if (d) {
                d = c;
                b = Object.create(null);
                for (k = 0; k < a.inputList.length; k++)
                    n = a.inputList[k],
                    n.type !== e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && (x = ze(n.connection, d)) && (b[n.name] = x);
                Object.keys(b).length && (g.inputs = b)
            }
            f && a.nextConnection && (a = ze(a.nextConnection, c)) && (g.next = a);
            return g
        }
    }
      , ze = function(a, b) {
        var c = a.getShadowState(!0);
        a = a.targetBlock();
        if (!c && !a)
            return null;
        var d = Object.create(null);
        c && (d.shadow = c);
        a && !a.isShadow() && (d.block = (0,
        Sa.save)(a, {
            doFullSerialization: b
        }));
        return d
    };
    Sa.append = function(a, b, c) {
        c = void 0 === c ? {} : c;
        return (0,
        Sa.appendInternal)(a, b, {
            recordUndo: void 0 === c.recordUndo ? !1 : c.recordUndo
        })
    }
    ;
    Sa.appendInternal = function(a, b, c) {
        var d = void 0 === c ? {} : c;
        c = void 0 === d.parentConnection ? void 0 : d.parentConnection;
        var f = void 0 === d.isShadow ? !1 : d.isShadow
          , g = void 0 === d.recordUndo ? !1 : d.recordUndo;
        d = (0,
        h.getRecordUndo)();
        (0,
        h.setRecordUndo)(g);
        (g = (0,
        h.getGroup)()) || (0,
        h.setGroup)(!0);
        (0,
        h.disable)();
        var k = Ae(a, b, {
            parentConnection: c,
            isShadow: f
        });
        (0,
        h.enable)();
        (0,
        h.fire)(new ((0,
        h.get)(h.CREATE))(k));
        (0,
        h.setGroup)(g);
        (0,
        h.setRecordUndo)(d);
        b.rendered && setTimeout(function() {
            k.disposed || k.setConnectionTracking(!0)
        }, 1);
        return k
    }
    ;
    var Ae = function(a, b, c) {
        var d = void 0 === c ? {} : c;
        c = void 0 === d.parentConnection ? void 0 : d.parentConnection;
        d = void 0 === d.isShadow ? !1 : d.isShadow;
        if (!a.type)
            throw new ua.MissingBlockType(a);
        var f = b.newBlock(a.type, a.id);
        f.setShadow(d);
        d = a;
        var g = void 0 === d.x ? 0 : d.x;
        d = void 0 === d.y ? 0 : d.y;
        var k = f.workspace;
        g = k.RTL ? k.getWidth() - g : g;
        f.moveBy(g, d);
        a.collapsed && f.setCollapsed(!0);
        !1 === a.enabled && f.setEnabled(!1);
        void 0 !== a.inline && f.setInputsInline(a.inline);
        void 0 !== a.data && (f.data = a.data);
        a.extraState && (f.loadExtraState ? f.loadExtraState(a.extraState) : f.domToMutation((0,
        e.module$exports$Blockly$Xml.textToDom)(a.extraState)));
        if (c) {
            if (c.getSourceBlock().isShadow() && !f.isShadow())
                throw new ua.RealChildOfShadow(a);
            if (c.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE) {
                var n = f.outputConnection;
                if (!n)
                    throw new ua.MissingConnection("output",f,a);
            } else if (n = f.previousConnection,
            !n)
                throw new ua.MissingConnection("previous",f,a);
            if (!c.connect(n))
                throw b = f.workspace.connectionChecker,
                new ua.BadConnectionCheck(b.getErrorMessage(b.canConnectWithReason(n, c, !1), n, c),c.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? "output connection" : "previous connection",f,a);
        }
        bf(f, a);
        if (a.fields)
            for (n = Object.keys(a.fields),
            c = 0; c < n.length; c++)
                d = n[c],
                g = a.fields[d],
                (k = f.getField(d)) ? k.loadState(g) : console.warn("Ignoring non-existant field " + d + " in block " + f.type);
        if (a.inputs)
            for (n = Object.keys(a.inputs),
            c = 0; c < n.length; c++) {
                d = n[c];
                g = f.getInput(d);
                if (!g || !g.connection)
                    throw new ua.MissingConnection(d,f,a);
                Be(g.connection, a.inputs[d])
            }
        if (a.next) {
            if (!f.nextConnection)
                throw new ua.MissingConnection("next",f,a);
            Be(f.nextConnection, a.next)
        }
        b.rendered ? (f.setConnectionTracking(!1),
        f.initSvg(),
        f.render(!1)) : f.initModel();
        return f
    }
      , bf = function(a, b) {
        b.icons && (b = b.icons.comment) && (a.setCommentText(b.text),
        a.commentModel.pinned = b.pinned,
        a.commentModel.size = new Ja(b.width,b.height),
        b.pinned && a.getCommentIcon && !a.isInFlyout && setTimeout(function() {
            return a.getCommentIcon().setVisible(!0)
        }, 1))
    }
      , Be = function(a, b) {
        b.shadow && a.setShadowState(b.shadow);
        b.block && Ae(b.block, a.getSourceBlock().workspace, {
            parentConnection: a
        })
    }
      , cf = Sa.save
      , pd = function() {
        this.priority = Sd.BLOCKS
    };
    pd.prototype.save = function(a) {
        var b = [];
        a = w.makeIterator(a.getTopBlocks(!1));
        for (var c = a.next(); !c.done; c = a.next())
            (c = cf(c.value, {
                addCoordinates: !0,
                doFullSerialization: !1
            })) && b.push(c);
        return b.length ? {
            languageVersion: 0,
            blocks: b
        } : null
    }
    ;
    pd.prototype.load = function(a, b) {
        a = w.makeIterator(a.blocks);
        for (var c = a.next(); !c.done; c = a.next())
            (0,
            Sa.append)(c.value, b, {
                recordUndo: (0,
                h.getRecordUndo)()
            })
    }
    ;
    pd.prototype.clear = function(a) {
        a = w.makeIterator(a.getTopBlocks(!1));
        for (var b = a.next(); !b.done; b = a.next())
            b.value.dispose(!1)
    }
    ;
    (0,
    Td.register)("blocks", new pd);
    var zb = function() {
        this.isBlank = null;
        this.workspaceId = void 0;
        this.group = (0,
        h.getGroup)();
        this.recordUndo = (0,
        h.getRecordUndo)()
    };
    zb.prototype.isUiEvent = !1;
    zb.prototype.toJson = function() {
        var a = {
            type: this.type
        };
        this.group && (a.group = this.group);
        return a
    }
    ;
    zb.prototype.fromJson = function(a) {
        this.isBlank = !1;
        this.group = a.group
    }
    ;
    zb.prototype.isNull = function() {
        return !1
    }
    ;
    zb.prototype.run = function(a) {}
    ;
    zb.prototype.getEventWorkspace_ = function() {
        var a;
        this.workspaceId && (a = I.Workspace.getById(this.workspaceId));
        if (!a)
            throw Error("Workspace is null. Event must have been generated from real Blockly events.");
        return a
    }
    ;
    var Eb = {
        BlockBase: function(a) {
            Eb.BlockBase.superClass_.constructor.call(this);
            this.blockId = (this.isBlank = "undefined" === typeof a) ? "" : a.id;
            this.workspaceId = this.isBlank ? "" : a.workspace.id
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Eb.BlockBase, zb);
    Eb.BlockBase.prototype.toJson = function() {
        var a = Eb.BlockBase.superClass_.toJson.call(this);
        a.blockId = this.blockId;
        return a
    }
    ;
    Eb.BlockBase.prototype.fromJson = function(a) {
        Eb.BlockBase.superClass_.fromJson.call(this, a);
        this.blockId = a.blockId
    }
    ;
    var Pb = {
        BlockCreate: function(a) {
            Pb.BlockCreate.superClass_.constructor.call(this, a);
            a && (a.isShadow() && (this.recordUndo = !1),
            this.xml = (0,
            e.module$exports$Blockly$Xml.blockToDomWithXY)(a),
            this.ids = (0,
            h.getDescendantIds)(a),
            this.json = (0,
            Sa.save)(a, {
                addCoordinates: !0
            }))
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Pb.BlockCreate, Eb.BlockBase);
    Pb.BlockCreate.prototype.type = h.CREATE;
    Pb.BlockCreate.prototype.toJson = function() {
        var a = Pb.BlockCreate.superClass_.toJson.call(this);
        a.xml = (0,
        e.module$exports$Blockly$Xml.domToText)(this.xml);
        a.ids = this.ids;
        a.json = this.json;
        this.recordUndo || (a.recordUndo = this.recordUndo);
        return a
    }
    ;
    Pb.BlockCreate.prototype.fromJson = function(a) {
        Pb.BlockCreate.superClass_.fromJson.call(this, a);
        this.xml = (0,
        e.module$exports$Blockly$Xml.textToDom)(a.xml);
        this.ids = a.ids;
        this.json = a.json;
        void 0 !== a.recordUndo && (this.recordUndo = a.recordUndo)
    }
    ;
    Pb.BlockCreate.prototype.run = function(a) {
        var b = this.getEventWorkspace_();
        if (a)
            (0,
            Sa.append)(this.json, b);
        else
            for (a = 0; a < this.ids.length; a++) {
                var c = this.ids[a]
                  , d = b.getBlockById(c);
                d ? d.dispose(!1) : c === this.blockId && console.warn("Can't uncreate non-existent block: " + c)
            }
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.CREATE, Pb.BlockCreate);
    e.module$exports$Blockly$ContextMenu = {};
    var qd = null;
    e.module$exports$Blockly$ContextMenu.getCurrentBlock = function() {
        return qd
    }
    ;
    e.module$exports$Blockly$ContextMenu.setCurrentBlock = function(a) {
        qd = a
    }
    ;
    Object.defineProperties(e.module$exports$Blockly$ContextMenu, {
        currentBlock: {
            get: function() {
                (0,
                V.warn)("Blockly.ContextMenu.currentBlock", "September 2021", "September 2022", "Blockly.Tooltip.getCurrentBlock()");
                return (0,
                e.module$exports$Blockly$ContextMenu.getCurrentBlock)()
            },
            set: function(a) {
                (0,
                V.warn)("Blockly.ContextMenu.currentBlock", "September 2021", "September 2022", "Blockly.Tooltip.setCurrentBlock(block)");
                (0,
                e.module$exports$Blockly$ContextMenu.setCurrentBlock)(a)
            }
        }
    });
    var rd = null;
    e.module$exports$Blockly$ContextMenu.show = function(a, b, c) {
        (0,
        ma.show)(e.module$exports$Blockly$ContextMenu, c, e.module$exports$Blockly$ContextMenu.dispose);
        if (b.length) {
            var d = df(b, c);
            rd = d;
            ef(d, a, c);
            setTimeout(function() {
                d.focus()
            }, 1);
            qd = null
        } else
            (0,
            e.module$exports$Blockly$ContextMenu.hide)()
    }
    ;
    var df = function(a, b) {
        var c = new Fa;
        c.setRole(J.Role.MENU);
        for (var d = 0; d < a.length; d++) {
            var f = a[d]
              , g = new Ya(f.text);
            g.setRightToLeft(b);
            g.setRole(J.Role.MENUITEM);
            c.addChild(g);
            g.setEnabled(f.enabled);
            if (f.enabled)
                g.onAction(function(k) {
                    (0,
                    e.module$exports$Blockly$ContextMenu.hide)();
                    this.callback(this.scope)
                }, f)
        }
        return c
    }
      , ef = function(a, b, c) {
        var d = (0,
        ca.getViewportBBox)();
        b = new Aa(b.clientY + d.top,b.clientY + d.top,b.clientX + d.left,b.clientX + d.left);
        var f = (0,
        ma.getDiv)();
        if (!f)
            throw Error("Attempting to create a context menu when widget div is null");
        a.render(f);
        f = a.getElement();
        (0,
        l.addClass)(f, "blocklyContextMenu");
        (0,
        u.conditionalBind)(f, "contextmenu", null, ff);
        a.focus();
        f = a.getSize();
        c && (b.left += f.width,
        b.right += f.width,
        d.left += f.width,
        d.right += f.width);
        (0,
        ma.positionWithAnchor)(d, b, f, c);
        a.focus()
    }
      , ff = function(a) {
        a.preventDefault();
        a.stopPropagation()
    };
    e.module$exports$Blockly$ContextMenu.hide = function() {
        (0,
        ma.hideIfOwner)(e.module$exports$Blockly$ContextMenu);
        qd = null
    }
    ;
    e.module$exports$Blockly$ContextMenu.dispose = function() {
        rd && (rd.dispose(),
        rd = null)
    }
    ;
    e.module$exports$Blockly$ContextMenu.callbackFactory = function(a, b) {
        return function() {
            (0,
            h.disable)();
            try {
                var c = (0,
                e.module$exports$Blockly$Xml.domToBlock)(b, a.workspace)
                  , d = a.getRelativeToSurfaceXY();
                d.x = a.RTL ? d.x - e.module$exports$Blockly$internalConstants.SNAP_RADIUS : d.x + e.module$exports$Blockly$internalConstants.SNAP_RADIUS;
                d.y += 2 * e.module$exports$Blockly$internalConstants.SNAP_RADIUS;
                c.moveBy(d.x, d.y)
            } finally {
                (0,
                h.enable)()
            }
            (0,
            h.isEnabled)() && !c.isShadow() && (0,
            h.fire)(new ((0,
            h.get)(h.CREATE))(c));
            c.select()
        }
    }
    ;
    e.module$exports$Blockly$ContextMenu.commentDeleteOption = function(a) {
        return {
            text: e.module$exports$Blockly$Msg.Msg.REMOVE_COMMENT,
            enabled: !0,
            callback: function() {
                (0,
                h.setGroup)(!0);
                a.dispose();
                (0,
                h.setGroup)(!1)
            }
        }
    }
    ;
    e.module$exports$Blockly$ContextMenu.commentDuplicateOption = function(a) {
        return {
            text: e.module$exports$Blockly$Msg.Msg.DUPLICATE_COMMENT,
            enabled: !0,
            callback: function() {
                (0,
                rb.duplicate)(a)
            }
        }
    }
    ;
    e.module$exports$Blockly$ContextMenu.workspaceCommentOption = function(a, b) {
        var c = L;
        if (!c)
            throw Error("Missing require for Blockly.WorkspaceCommentSvg");
        var d = {
            enabled: !O.IE
        };
        d.text = e.module$exports$Blockly$Msg.Msg.ADD_COMMENT;
        d.callback = function() {
            var f = new c(a,e.module$exports$Blockly$Msg.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT,c.DEFAULT_SIZE,c.DEFAULT_SIZE)
              , g = a.getInjectionDiv().getBoundingClientRect();
            g = new E(b.clientX - g.left,b.clientY - g.top);
            var k = a.getOriginOffsetInPixels();
            g = E.difference(g, k);
            g.scale(1 / a.scale);
            f.moveBy(g.x, g.y);
            a.rendered && (f.initSvg(),
            f.render(),
            f.select())
        }
        ;
        return d
    }
    ;
    var sb = function(a, b) {
        b = a.indexOf(b);
        if (-1 === b)
            return !1;
        a.splice(b, 1);
        return !0
    }
      , Fb = {}
      , Ud = !1;
    Fb.isDebuggerEnabled = function() {
        return Ud
    }
    ;
    Fb.startDebugger = function() {
        Ud = !0
    }
    ;
    Fb.stopDebugger = function() {
        Ud = !1
    }
    ;
    var m = {
        NONE: 0,
        FIELD: 1,
        HAT: 2,
        ICON: 4,
        SPACER: 8,
        BETWEEN_ROW_SPACER: 16,
        IN_ROW_SPACER: 32,
        EXTERNAL_VALUE_INPUT: 64,
        INPUT: 128,
        INLINE_INPUT: 256,
        STATEMENT_INPUT: 512,
        CONNECTION: 1024,
        PREVIOUS_CONNECTION: 2048,
        NEXT_CONNECTION: 4096,
        OUTPUT_CONNECTION: 8192,
        CORNER: 16384,
        LEFT_SQUARE_CORNER: 32768,
        LEFT_ROUND_CORNER: 65536,
        RIGHT_SQUARE_CORNER: 131072,
        RIGHT_ROUND_CORNER: 262144,
        JAGGED_EDGE: 524288,
        ROW: 1048576,
        TOP_ROW: 2097152,
        BOTTOM_ROW: 4194304,
        INPUT_ROW: 8388608
    };
    m.LEFT_CORNER = m.LEFT_SQUARE_CORNER | m.LEFT_ROUND_CORNER;
    m.RIGHT_CORNER = m.RIGHT_SQUARE_CORNER | m.RIGHT_ROUND_CORNER;
    m.nextTypeValue_ = 16777216;
    m.getType = function(a) {
        Object.prototype.hasOwnProperty.call(m, a) || (m[a] = m.nextTypeValue_,
        m.nextTypeValue_ <<= 1);
        return m[a]
    }
    ;
    m.isField = function(a) {
        return a.type & m.FIELD
    }
    ;
    m.isHat = function(a) {
        return a.type & m.HAT
    }
    ;
    m.isIcon = function(a) {
        return a.type & m.ICON
    }
    ;
    m.isSpacer = function(a) {
        return a.type & m.SPACER
    }
    ;
    m.isInRowSpacer = function(a) {
        return a.type & m.IN_ROW_SPACER
    }
    ;
    m.isInput = function(a) {
        return a.type & m.INPUT
    }
    ;
    m.isExternalInput = function(a) {
        return a.type & m.EXTERNAL_VALUE_INPUT
    }
    ;
    m.isInlineInput = function(a) {
        return a.type & m.INLINE_INPUT
    }
    ;
    m.isStatementInput = function(a) {
        return a.type & m.STATEMENT_INPUT
    }
    ;
    m.isPreviousConnection = function(a) {
        return a.type & m.PREVIOUS_CONNECTION
    }
    ;
    m.isNextConnection = function(a) {
        return a.type & m.NEXT_CONNECTION
    }
    ;
    m.isPreviousOrNextConnection = function(a) {
        return a.type & (m.PREVIOUS_CONNECTION | m.NEXT_CONNECTION)
    }
    ;
    m.isLeftRoundedCorner = function(a) {
        return a.type & m.LEFT_ROUND_CORNER
    }
    ;
    m.isRightRoundedCorner = function(a) {
        return a.type & m.RIGHT_ROUND_CORNER
    }
    ;
    m.isLeftSquareCorner = function(a) {
        return a.type & m.LEFT_SQUARE_CORNER
    }
    ;
    m.isRightSquareCorner = function(a) {
        return a.type & m.RIGHT_SQUARE_CORNER
    }
    ;
    m.isCorner = function(a) {
        return a.type & m.CORNER
    }
    ;
    m.isJaggedEdge = function(a) {
        return a.type & m.JAGGED_EDGE
    }
    ;
    m.isRow = function(a) {
        return a.type & m.ROW
    }
    ;
    m.isBetweenRowSpacer = function(a) {
        return a.type & m.BETWEEN_ROW_SPACER
    }
    ;
    m.isTopRow = function(a) {
        return a.type & m.TOP_ROW
    }
    ;
    m.isBottomRow = function(a) {
        return a.type & m.BOTTOM_ROW
    }
    ;
    m.isTopOrBottomRow = function(a) {
        return a.type & (m.TOP_ROW | m.BOTTOM_ROW)
    }
    ;
    m.isInputRow = function(a) {
        return a.type & m.INPUT_ROW
    }
    ;
    var Gb = function(a) {
        this.type = m.ROW;
        this.elements = [];
        this.xPos = this.yPos = this.widthWithConnectedBlocks = this.minWidth = this.minHeight = this.width = this.height = 0;
        this.hasJaggedEdge = this.hasDummyInput = this.hasInlineInput = this.hasStatement = this.hasExternalInput = !1;
        this.constants_ = a;
        this.notchOffset = this.constants_.NOTCH_OFFSET_LEFT;
        this.align = null
    };
    Gb.prototype.getLastInput = function() {
        for (var a = this.elements.length - 1; 0 <= a; a--) {
            var b = this.elements[a];
            if (m.isInput(b))
                return b
        }
        return null
    }
    ;
    Gb.prototype.measure = function() {
        throw Error("Unexpected attempt to measure a base Row.");
    }
    ;
    Gb.prototype.startsWithElemSpacer = function() {
        return !0
    }
    ;
    Gb.prototype.endsWithElemSpacer = function() {
        return !0
    }
    ;
    Gb.prototype.getFirstSpacer = function() {
        for (var a = 0; a < this.elements.length; a++) {
            var b = this.elements[a];
            if (m.isSpacer(b))
                return b
        }
        return null
    }
    ;
    Gb.prototype.getLastSpacer = function() {
        for (var a = this.elements.length - 1; 0 <= a; a--) {
            var b = this.elements[a];
            if (m.isSpacer(b))
                return b
        }
        return null
    }
    ;
    var Qb = {
        BottomRow: function(a) {
            Qb.BottomRow.superClass_.constructor.call(this, a);
            this.type |= m.BOTTOM_ROW;
            this.hasNextConnection = !1;
            this.connection = null;
            this.baseline = this.descenderHeight = 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Qb.BottomRow, Gb);
    Qb.BottomRow.prototype.hasLeftSquareCorner = function(a) {
        return !!a.outputConnection || !!a.getNextBlock()
    }
    ;
    Qb.BottomRow.prototype.hasRightSquareCorner = function(a) {
        return !0
    }
    ;
    Qb.BottomRow.prototype.measure = function() {
        for (var a = 0, b = 0, c = 0, d = 0; d < this.elements.length; d++) {
            var f = this.elements[d];
            b += f.width;
            m.isSpacer(f) || (m.isNextConnection(f) ? c = Math.max(c, f.height) : a = Math.max(a, f.height))
        }
        this.width = Math.max(this.minWidth, b);
        this.height = Math.max(this.minHeight, a) + c;
        this.descenderHeight = c;
        this.widthWithConnectedBlocks = this.width
    }
    ;
    Qb.BottomRow.prototype.startsWithElemSpacer = function() {
        return !1
    }
    ;
    Qb.BottomRow.prototype.endsWithElemSpacer = function() {
        return !1
    }
    ;
    var Rb = function(a) {
        this.height = this.width = 0;
        this.type = m.NONE;
        this.centerline = this.xPos = 0;
        this.constants_ = a;
        this.notchOffset = this.constants_.NOTCH_OFFSET_LEFT
    }
      , xc = {
        Connection: function(a, b) {
            xc.Connection.superClass_.constructor.call(this, a);
            this.connectionModel = b;
            this.shape = this.constants_.shapeFor(b);
            this.isDynamicShape = !!this.shape.isDynamic;
            this.type |= m.CONNECTION
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(xc.Connection, Rb);
    var ha = {}
      , Vd = .45;
    ha.getHsvSaturation = function() {
        return Vd
    }
    ;
    ha.setHsvSaturation = function(a) {
        Vd = a
    }
    ;
    var Wd = .65;
    ha.getHsvValue = function() {
        return Wd
    }
    ;
    ha.setHsvValue = function(a) {
        Wd = a
    }
    ;
    ha.parse = function(a) {
        a = String(a).toLowerCase().trim();
        var b = ha.names[a];
        if (b)
            return b;
        b = "0x" === a.substring(0, 2) ? "#" + a.substring(2) : a;
        b = "#" === b[0] ? b : "#" + b;
        if (/^#[0-9a-f]{6}$/.test(b))
            return b;
        if (/^#[0-9a-f]{3}$/.test(b))
            return ["#", b[1], b[1], b[2], b[2], b[3], b[3]].join("");
        var c = a.match(/^(?:rgb)?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
        return c && (a = Number(c[1]),
        b = Number(c[2]),
        c = Number(c[3]),
        0 <= a && 256 > a && 0 <= b && 256 > b && 0 <= c && 256 > c) ? (0,
        ha.rgbToHex)(a, b, c) : null
    }
    ;
    ha.rgbToHex = function(a, b, c) {
        b = a << 16 | b << 8 | c;
        return 16 > a ? "#" + (16777216 | b).toString(16).substr(1) : "#" + b.toString(16)
    }
    ;
    ha.hexToRgb = function(a) {
        a = (0,
        ha.parse)(a);
        if (!a)
            return [0, 0, 0];
        a = parseInt(a.substr(1), 16);
        return [a >> 16, a >> 8 & 255, a & 255]
    }
    ;
    ha.hsvToHex = function(a, b, c) {
        var d = 0
          , f = 0
          , g = 0;
        if (0 === b)
            g = f = d = c;
        else {
            var k = Math.floor(a / 60)
              , n = a / 60 - k;
            a = c * (1 - b);
            var x = c * (1 - b * n);
            b = c * (1 - b * (1 - n));
            switch (k) {
            case 1:
                d = x;
                f = c;
                g = a;
                break;
            case 2:
                d = a;
                f = c;
                g = b;
                break;
            case 3:
                d = a;
                f = x;
                g = c;
                break;
            case 4:
                d = b;
                f = a;
                g = c;
                break;
            case 5:
                d = c;
                f = a;
                g = x;
                break;
            case 6:
            case 0:
                d = c,
                f = b,
                g = a
            }
        }
        return (0,
        ha.rgbToHex)(Math.floor(d), Math.floor(f), Math.floor(g))
    }
    ;
    ha.blend = function(a, b, c) {
        a = (0,
        ha.parse)(a);
        if (!a)
            return null;
        b = (0,
        ha.parse)(b);
        if (!b)
            return null;
        a = (0,
        ha.hexToRgb)(a);
        b = (0,
        ha.hexToRgb)(b);
        return (0,
        ha.rgbToHex)(Math.round(b[0] + c * (a[0] - b[0])), Math.round(b[1] + c * (a[1] - b[1])), Math.round(b[2] + c * (a[2] - b[2])))
    }
    ;
    ha.names = {
        aqua: "#00ffff",
        black: "#000000",
        blue: "#0000ff",
        fuchsia: "#ff00ff",
        gray: "#808080",
        green: "#008000",
        lime: "#00ff00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        purple: "#800080",
        red: "#ff0000",
        silver: "#c0c0c0",
        teal: "#008080",
        white: "#ffffff",
        yellow: "#ffff00"
    };
    ha.hueToHex = function(a) {
        return (0,
        ha.hsvToHex)(a, Vd, 255 * Wd)
    }
    ;
    var p = {
        point: function(a, b) {
            return " " + a + "," + b + " "
        },
        curve: function(a, b) {
            return " " + a + b.join("")
        },
        moveTo: function(a, b) {
            return " M " + a + "," + b + " "
        },
        moveBy: function(a, b) {
            return " m " + a + "," + b + " "
        },
        lineTo: function(a, b) {
            return " l " + a + "," + b + " "
        },
        line: function(a) {
            return " l" + a.join("")
        },
        lineOnAxis: function(a, b) {
            return " " + a + " " + b + " "
        },
        arc: function(a, b, c, d) {
            return a + " " + c + " " + c + " " + b + d
        }
    }
      , da = {}
      , Xd = function(a, b) {
        var c = []
          , d = a.split("");
        d.push("");
        var f = 0;
        a = [];
        for (var g = null, k = 0; k < d.length; k++) {
            var n = d[k];
            0 === f ? "%" === n ? ((f = a.join("")) && c.push(f),
            a.length = 0,
            f = 1) : a.push(n) : 1 === f ? "%" === n ? (a.push(n),
            f = 0) : b && "0" <= n && "9" >= n ? (f = 2,
            g = n,
            (n = a.join("")) && c.push(n),
            a.length = 0) : "{" === n ? f = 3 : (a.push("%", n),
            f = 0) : 2 === f ? "0" <= n && "9" >= n ? g += n : (c.push(parseInt(g, 10)),
            k--,
            f = 0) : 3 === f && ("" === n ? (a.splice(0, 0, "%{"),
            k--,
            f = 0) : "}" !== n ? a.push(n) : (f = a.join(""),
            /[A-Z]\w*/i.test(f) ? (n = f.toUpperCase(),
            (n = (0,
            e.module$exports$Blockly$utils$string.startsWith)(n, "BKY_") ? n.substring(4) : null) && n in e.module$exports$Blockly$Msg.Msg ? (f = e.module$exports$Blockly$Msg.Msg[n],
            "string" === typeof f ? Array.prototype.push.apply(c, Xd(f, b)) : b ? c.push(String(f)) : c.push(f)) : c.push("%{" + f + "}")) : c.push("%{" + f + "}"),
            f = a.length = 0))
        }
        (b = a.join("")) && c.push(b);
        d = [];
        for (g = a.length = 0; g < c.length; g++)
            "string" === typeof c[g] ? a.push(c[g]) : ((b = a.join("")) && d.push(b),
            a.length = 0,
            d.push(c[g]));
        (b = a.join("")) && d.push(b);
        a.length = 0;
        return d
    };
    da.tokenizeInterpolation = function(a) {
        return Xd(a, !0)
    }
    ;
    da.replaceMessageReferences = function(a) {
        if ("string" !== typeof a)
            return a;
        a = Xd(a, !1);
        return a.length ? String(a[0]) : ""
    }
    ;
    da.checkMessageReferences = function(a) {
        for (var b = !0, c = e.module$exports$Blockly$Msg.Msg, d = a.match(/%{BKY_[A-Z]\w*}/ig), f = 0; f < d.length; f++) {
            var g = d[f].toUpperCase();
            void 0 === c[g.slice(6, -1)] && (console.warn("No message string for " + d[f] + " in " + a),
            b = !1)
        }
        return b
    }
    ;
    da.parseBlockColour = function(a) {
        var b = "string" === typeof a ? (0,
        da.replaceMessageReferences)(a) : a
          , c = Number(b);
        if (!isNaN(c) && 0 <= c && 360 >= c)
            return {
                hue: c,
                hex: (0,
                ha.hsvToHex)(c, (0,
                ha.getHsvSaturation)(), 255 * (0,
                ha.getHsvValue)())
            };
        if (c = (0,
        ha.parse)(b))
            return {
                hue: null,
                hex: c
            };
        c = 'Invalid colour: "' + b + '"';
        a !== b && (c += ' (from "' + a + '")');
        throw Error(c);
    }
    ;
    var pa = function() {
        this.NO_PADDING = 0;
        this.SMALL_PADDING = 3;
        this.MEDIUM_PADDING = 5;
        this.MEDIUM_LARGE_PADDING = 8;
        this.LARGE_PADDING = 10;
        this.TALL_INPUT_FIELD_OFFSET_Y = this.MEDIUM_PADDING;
        this.TAB_HEIGHT = 15;
        this.TAB_OFFSET_FROM_TOP = 5;
        this.TAB_VERTICAL_OVERLAP = 2.5;
        this.TAB_WIDTH = 8;
        this.NOTCH_WIDTH = 15;
        this.NOTCH_HEIGHT = 4;
        this.MIN_BLOCK_WIDTH = 12;
        this.EMPTY_BLOCK_SPACER_HEIGHT = 16;
        this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = this.DUMMY_INPUT_MIN_HEIGHT = this.TAB_HEIGHT;
        this.CORNER_RADIUS = 8;
        this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT = 15;
        this.STATEMENT_BOTTOM_SPACER = 0;
        this.STATEMENT_INPUT_PADDING_LEFT = 20;
        this.BETWEEN_STATEMENT_PADDING_Y = 4;
        this.TOP_ROW_MIN_HEIGHT = this.MEDIUM_PADDING;
        this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;
        this.BOTTOM_ROW_MIN_HEIGHT = this.MEDIUM_PADDING;
        this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;
        this.ADD_START_HATS = !1;
        this.START_HAT_HEIGHT = 15;
        this.START_HAT_WIDTH = 100;
        this.SPACER_DEFAULT_HEIGHT = 15;
        this.MIN_BLOCK_HEIGHT = 24;
        this.EMPTY_INLINE_INPUT_PADDING = 14.5;
        this.EMPTY_INLINE_INPUT_HEIGHT = this.TAB_HEIGHT + 11;
        this.EXTERNAL_VALUE_INPUT_PADDING = 2;
        this.EMPTY_STATEMENT_INPUT_HEIGHT = this.MIN_BLOCK_HEIGHT;
        this.START_POINT = (0,
        p.moveBy)(0, 0);
        this.JAGGED_TEETH_HEIGHT = 12;
        this.JAGGED_TEETH_WIDTH = 6;
        this.FIELD_TEXT_FONTSIZE = 11;
        this.FIELD_TEXT_FONTWEIGHT = "normal";
        this.FIELD_TEXT_FONTFAMILY = "sans-serif";
        this.FIELD_TEXT_BASELINE = this.FIELD_TEXT_HEIGHT = -1;
        this.FIELD_BORDER_RECT_RADIUS = 4;
        this.FIELD_BORDER_RECT_HEIGHT = 16;
        this.FIELD_BORDER_RECT_X_PADDING = 5;
        this.FIELD_BORDER_RECT_Y_PADDING = 3;
        this.FIELD_BORDER_RECT_COLOUR = "#fff";
        this.FIELD_TEXT_BASELINE_CENTER = !O.IE && !O.EDGE;
        this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;
        this.FIELD_DROPDOWN_SVG_ARROW = this.FIELD_DROPDOWN_COLOURED_DIV = this.FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW = !1;
        this.FIELD_DROPDOWN_SVG_ARROW_PADDING = this.FIELD_BORDER_RECT_X_PADDING;
        this.FIELD_DROPDOWN_SVG_ARROW_SIZE = 12;
        this.FIELD_DROPDOWN_SVG_ARROW_DATAURI = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMi43MSIgaGVpZ2h0PSI4Ljc5IiB2aWV3Qm94PSIwIDAgMTIuNzEgOC43OSI+PHRpdGxlPmRyb3Bkb3duLWFycm93PC90aXRsZT48ZyBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0xMi43MSwyLjQ0QTIuNDEsMi40MSwwLDAsMSwxMiw0LjE2TDguMDgsOC4wOGEyLjQ1LDIuNDUsMCwwLDEtMy40NSwwTDAuNzIsNC4xNkEyLjQyLDIuNDIsMCwwLDEsMCwyLjQ0LDIuNDgsMi40OCwwLDAsMSwuNzEuNzFDMSwwLjQ3LDEuNDMsMCw2LjM2LDBTMTEuNzUsMC40NiwxMiwuNzFBMi40NCwyLjQ0LDAsMCwxLDEyLjcxLDIuNDRaIiBmaWxsPSIjMjMxZjIwIi8+PC9nPjxwYXRoIGQ9Ik02LjM2LDcuNzlhMS40MywxLjQzLDAsMCwxLTEtLjQyTDEuNDIsMy40NWExLjQ0LDEuNDQsMCwwLDEsMC0yYzAuNTYtLjU2LDkuMzEtMC41Niw5Ljg3LDBhMS40NCwxLjQ0LDAsMCwxLDAsMkw3LjM3LDcuMzdBMS40MywxLjQzLDAsMCwxLDYuMzYsNy43OVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
        this.FIELD_COLOUR_FULL_BLOCK = this.FIELD_TEXTINPUT_BOX_SHADOW = !1;
        this.FIELD_COLOUR_DEFAULT_WIDTH = 26;
        this.FIELD_COLOUR_DEFAULT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;
        this.FIELD_CHECKBOX_X_OFFSET = this.FIELD_BORDER_RECT_X_PADDING - 3;
        this.randomIdentifier = String(Math.random()).substring(2);
        this.defs_ = null;
        this.embossFilterId = "";
        this.embossFilter_ = null;
        this.disabledPatternId = "";
        this.disabledPattern_ = null;
        this.debugFilterId = "";
        this.cssNode_ = this.debugFilter_ = null;
        this.CURSOR_COLOUR = "#cc0a0a";
        this.MARKER_COLOUR = "#4286f4";
        this.CURSOR_WS_WIDTH = 100;
        this.WS_CURSOR_HEIGHT = 5;
        this.CURSOR_STACK_PADDING = 10;
        this.CURSOR_BLOCK_PADDING = 2;
        this.CURSOR_STROKE_WIDTH = 4;
        this.FULL_BLOCK_FIELDS = !1;
        this.INSERTION_MARKER_COLOUR = "#000000";
        this.INSERTION_MARKER_OPACITY = .2;
        this.SHAPES = {
            PUZZLE: 1,
            NOTCH: 2
        }
    };
    pa.prototype.init = function() {
        this.JAGGED_TEETH = this.makeJaggedTeeth();
        this.NOTCH = this.makeNotch();
        this.START_HAT = this.makeStartHat();
        this.PUZZLE_TAB = this.makePuzzleTab();
        this.INSIDE_CORNERS = this.makeInsideCorners();
        this.OUTSIDE_CORNERS = this.makeOutsideCorners()
    }
    ;
    pa.prototype.setTheme = function(a) {
        this.blockStyles = Object.create(null);
        var b = a.blockStyles, c;
        for (c in b)
            this.blockStyles[c] = this.validatedBlockStyle_(b[c]);
        this.setDynamicProperties_(a)
    }
    ;
    pa.prototype.setDynamicProperties_ = function(a) {
        this.setFontConstants_(a);
        this.setComponentConstants_(a);
        this.ADD_START_HATS = null !== a.startHats ? a.startHats : this.ADD_START_HATS
    }
    ;
    pa.prototype.setFontConstants_ = function(a) {
        this.FIELD_TEXT_FONTFAMILY = a.fontStyle && void 0 !== a.fontStyle.family ? a.fontStyle.family : this.FIELD_TEXT_FONTFAMILY;
        this.FIELD_TEXT_FONTWEIGHT = a.fontStyle && void 0 !== a.fontStyle.weight ? a.fontStyle.weight : this.FIELD_TEXT_FONTWEIGHT;
        this.FIELD_TEXT_FONTSIZE = a.fontStyle && void 0 !== a.fontStyle.size ? a.fontStyle.size : this.FIELD_TEXT_FONTSIZE;
        a = (0,
        l.measureFontMetrics)("Hg", this.FIELD_TEXT_FONTSIZE + "pt", this.FIELD_TEXT_FONTWEIGHT, this.FIELD_TEXT_FONTFAMILY);
        this.FIELD_TEXT_HEIGHT = a.height;
        this.FIELD_TEXT_BASELINE = a.baseline
    }
    ;
    pa.prototype.setComponentConstants_ = function(a) {
        this.CURSOR_COLOUR = a.getComponentStyle("cursorColour") || this.CURSOR_COLOUR;
        this.MARKER_COLOUR = a.getComponentStyle("markerColour") || this.MARKER_COLOUR;
        this.INSERTION_MARKER_COLOUR = a.getComponentStyle("insertionMarkerColour") || this.INSERTION_MARKER_COLOUR;
        this.INSERTION_MARKER_OPACITY = Number(a.getComponentStyle("insertionMarkerOpacity")) || this.INSERTION_MARKER_OPACITY
    }
    ;
    pa.prototype.getBlockStyleForColour = function(a) {
        var b = "auto_" + a;
        this.blockStyles[b] || (this.blockStyles[b] = this.createBlockStyle_(a));
        return {
            style: this.blockStyles[b],
            name: b
        }
    }
    ;
    pa.prototype.getBlockStyle = function(a) {
        return this.blockStyles[a || ""] || (a && 0 === a.indexOf("auto_") ? this.getBlockStyleForColour(a.substring(5)).style : this.createBlockStyle_("#000000"))
    }
    ;
    pa.prototype.createBlockStyle_ = function(a) {
        return this.validatedBlockStyle_({
            colourPrimary: a
        })
    }
    ;
    pa.prototype.validatedBlockStyle_ = function(a) {
        var b = {};
        a && (0,
        e.module$exports$Blockly$utils$object.mixin)(b, a);
        a = (0,
        da.parseBlockColour)(b.colourPrimary || "#000");
        b.colourPrimary = a.hex;
        b.colourSecondary = b.colourSecondary ? (0,
        da.parseBlockColour)(b.colourSecondary).hex : this.generateSecondaryColour_(b.colourPrimary);
        b.colourTertiary = b.colourTertiary ? (0,
        da.parseBlockColour)(b.colourTertiary).hex : this.generateTertiaryColour_(b.colourPrimary);
        b.hat = b.hat || "";
        return b
    }
    ;
    pa.prototype.generateSecondaryColour_ = function(a) {
        return (0,
        ha.blend)("#fff", a, .6) || a
    }
    ;
    pa.prototype.generateTertiaryColour_ = function(a) {
        return (0,
        ha.blend)("#fff", a, .3) || a
    }
    ;
    pa.prototype.dispose = function() {
        this.embossFilter_ && (0,
        l.removeNode)(this.embossFilter_);
        this.disabledPattern_ && (0,
        l.removeNode)(this.disabledPattern_);
        this.debugFilter_ && (0,
        l.removeNode)(this.debugFilter_);
        this.cssNode_ = null
    }
    ;
    pa.prototype.makeJaggedTeeth = function() {
        var a = this.JAGGED_TEETH_HEIGHT
          , b = this.JAGGED_TEETH_WIDTH
          , c = (0,
        p.line)([(0,
        p.point)(b, a / 4), (0,
        p.point)(2 * -b, a / 2), (0,
        p.point)(b, a / 4)]);
        return {
            height: a,
            width: b,
            path: c
        }
    }
    ;
    pa.prototype.makeStartHat = function() {
        var a = this.START_HAT_HEIGHT
          , b = this.START_HAT_WIDTH
          , c = (0,
        p.curve)("c", [(0,
        p.point)(30, -a), (0,
        p.point)(70, -a), (0,
        p.point)(b, 0)]);
        return {
            height: a,
            width: b,
            path: c
        }
    }
    ;
    pa.prototype.makePuzzleTab = function() {
        function a(g) {
            g = g ? -1 : 1;
            var k = -g
              , n = c / 2
              , x = n + 2.5
              , B = n + .5
              , P = (0,
            p.point)(-b, g * n);
            n = (0,
            p.point)(b, g * n);
            return (0,
            p.curve)("c", [(0,
            p.point)(0, g * x), (0,
            p.point)(-b, k * B), P]) + (0,
            p.curve)("s", [(0,
            p.point)(b, 2.5 * k), n])
        }
        var b = this.TAB_WIDTH
          , c = this.TAB_HEIGHT
          , d = a(!0)
          , f = a(!1);
        return {
            type: this.SHAPES.PUZZLE,
            width: b,
            height: c,
            pathDown: f,
            pathUp: d
        }
    }
    ;
    pa.prototype.makeNotch = function() {
        function a(k) {
            return (0,
            p.line)([(0,
            p.point)(k * d, c), (0,
            p.point)(3 * k, 0), (0,
            p.point)(k * d, -c)])
        }
        var b = this.NOTCH_WIDTH
          , c = this.NOTCH_HEIGHT
          , d = (b - 3) / 2
          , f = a(1)
          , g = a(-1);
        return {
            type: this.SHAPES.NOTCH,
            width: b,
            height: c,
            pathLeft: f,
            pathRight: g
        }
    }
    ;
    pa.prototype.makeInsideCorners = function() {
        var a = this.CORNER_RADIUS
          , b = (0,
        p.arc)("a", "0 0,0", a, (0,
        p.point)(-a, a))
          , c = (0,
        p.arc)("a", "0 0,0", a, (0,
        p.point)(a, a));
        return {
            width: a,
            height: a,
            pathTop: b,
            pathBottom: c
        }
    }
    ;
    pa.prototype.makeOutsideCorners = function() {
        var a = this.CORNER_RADIUS
          , b = (0,
        p.moveBy)(0, a) + (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(a, -a))
          , c = (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(a, a))
          , d = (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(-a, -a))
          , f = (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(-a, a));
        return {
            topLeft: b,
            topRight: c,
            bottomRight: f,
            bottomLeft: d,
            rightHeight: a
        }
    }
    ;
    pa.prototype.shapeFor = function(a) {
        switch (a.type) {
        case e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE:
        case e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE:
            return this.PUZZLE_TAB;
        case e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT:
        case e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT:
            return this.NOTCH;
        default:
            throw Error("Unknown connection type");
        }
    }
    ;
    pa.prototype.createDom = function(a, b, c) {
        this.injectCSS_(b, c);
        this.defs_ = (0,
        l.createSvgElement)(q.DEFS, {}, a);
        a = (0,
        l.createSvgElement)(q.FILTER, {
            id: "blocklyEmbossFilter" + this.randomIdentifier
        }, this.defs_);
        (0,
        l.createSvgElement)(q.FEGAUSSIANBLUR, {
            "in": "SourceAlpha",
            stdDeviation: 1,
            result: "blur"
        }, a);
        b = (0,
        l.createSvgElement)(q.FESPECULARLIGHTING, {
            "in": "blur",
            surfaceScale: 1,
            specularConstant: .5,
            specularExponent: 10,
            "lighting-color": "white",
            result: "specOut"
        }, a);
        (0,
        l.createSvgElement)(q.FEPOINTLIGHT, {
            x: -5E3,
            y: -1E4,
            z: 2E4
        }, b);
        (0,
        l.createSvgElement)(q.FECOMPOSITE, {
            "in": "specOut",
            in2: "SourceAlpha",
            operator: "in",
            result: "specOut"
        }, a);
        (0,
        l.createSvgElement)(q.FECOMPOSITE, {
            "in": "SourceGraphic",
            in2: "specOut",
            operator: "arithmetic",
            k1: 0,
            k2: 1,
            k3: 1,
            k4: 0
        }, a);
        this.embossFilterId = a.id;
        this.embossFilter_ = a;
        a = (0,
        l.createSvgElement)(q.PATTERN, {
            id: "blocklyDisabledPattern" + this.randomIdentifier,
            patternUnits: "userSpaceOnUse",
            width: 10,
            height: 10
        }, this.defs_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 10,
            height: 10,
            fill: "#aaa"
        }, a);
        (0,
        l.createSvgElement)(q.PATH, {
            d: "M 0 0 L 10 10 M 10 0 L 0 10",
            stroke: "#cc0"
        }, a);
        this.disabledPatternId = a.id;
        this.disabledPattern_ = a;
        this.createDebugFilter()
    }
    ;
    pa.prototype.createDebugFilter = function() {
        if (!this.debugFilter_) {
            var a = (0,
            l.createSvgElement)(q.FILTER, {
                id: "blocklyDebugFilter" + this.randomIdentifier,
                height: "160%",
                width: "180%",
                y: "-30%",
                x: "-40%"
            }, this.defs_)
              , b = (0,
            l.createSvgElement)(q.FECOMPONENTTRANSFER, {
                result: "outBlur"
            }, a);
            (0,
            l.createSvgElement)(q.FEFUNCA, {
                type: "table",
                tableValues: "0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
            }, b);
            (0,
            l.createSvgElement)(q.FEFLOOD, {
                "flood-color": "#ff0000",
                "flood-opacity": .5,
                result: "outColor"
            }, a);
            (0,
            l.createSvgElement)(q.FECOMPOSITE, {
                "in": "outColor",
                in2: "outBlur",
                operator: "in",
                result: "outGlow"
            }, a);
            this.debugFilterId = a.id;
            this.debugFilter_ = a
        }
    }
    ;
    pa.prototype.injectCSS_ = function(a, b) {
        b = this.getCSS_(b);
        a = "blockly-renderer-style-" + a;
        this.cssNode_ = document.getElementById(a);
        var c = b.join("\n");
        this.cssNode_ ? this.cssNode_.firstChild.textContent = c : (b = document.createElement("style"),
        b.id = a,
        a = document.createTextNode(c),
        b.appendChild(a),
        document.head.insertBefore(b, document.head.firstChild),
        this.cssNode_ = b)
    }
    ;
    pa.prototype.getCSS_ = function(a) {
        return [a + " .blocklyText, ", a + " .blocklyFlyoutLabelText {", "font: " + this.FIELD_TEXT_FONTWEIGHT + " " + this.FIELD_TEXT_FONTSIZE + "pt " + this.FIELD_TEXT_FONTFAMILY + ";", "}", a + " .blocklyText {", "fill: #fff;", "}", a + " .blocklyNonEditableText>rect,", a + " .blocklyEditableText>rect {", "fill: " + this.FIELD_BORDER_RECT_COLOUR + ";", "fill-opacity: .6;", "stroke: none;", "}", a + " .blocklyNonEditableText>text,", a + " .blocklyEditableText>text {", "fill: #000;", "}", a + " .blocklyFlyoutLabelText {", "fill: #000;", "}", a + " .blocklyText.blocklyBubbleText {", "fill: #000;", "}", a + " .blocklyEditableText:not(.editing):hover>rect {", "stroke: #fff;", "stroke-width: 2;", "}", a + " .blocklyHtmlInput {", "font-family: " + this.FIELD_TEXT_FONTFAMILY + ";", "font-weight: " + this.FIELD_TEXT_FONTWEIGHT + ";", "}", a + " .blocklySelected>.blocklyPath {", "stroke: #fc3;", "stroke-width: 3px;", "}", a + " .blocklyHighlightedConnectionPath {", "stroke: #fc3;", "}", a + " .blocklyReplaceable .blocklyPath {", "fill-opacity: .5;", "}", a + " .blocklyReplaceable .blocklyPathLight,", a + " .blocklyReplaceable .blocklyPathDark {", "display: none;", "}", a + " .blocklyInsertionMarker>.blocklyPath {", "fill-opacity: " + this.INSERTION_MARKER_OPACITY + ";", "stroke: none;", "}"]
    }
    ;
    var mb = {
        register: function(a, b) {
            (0,
            r.register)(r.Type.FIELD, a, b)
        },
        unregister: function(a) {
            (0,
            r.unregister)(r.Type.FIELD, a)
        },
        fromJson: function(a) {
            var b = (0,
            r.getObject)(r.Type.FIELD, a.type);
            return b ? b.fromJson(a) : (console.warn("Blockly could not create a field of type " + a.type + ". The field is probably not being registered. This could be because the file is not loaded, the field does not register itself (Issue #1584), or the registration is not being reached."),
            null)
        }
    }
      , nb = function(a) {
        this.cursorSvg_ = this.cursor_ = null;
        this.markers_ = Object.create(null);
        this.workspace_ = a
    };
    nb.LOCAL_MARKER = "local_marker_1";
    nb.prototype.registerMarker = function(a, b) {
        this.markers_[a] && this.unregisterMarker(a);
        b.setDrawer(this.workspace_.getRenderer().makeMarkerDrawer(this.workspace_, b));
        this.setMarkerSvg(b.getDrawer().createDom());
        this.markers_[a] = b
    }
    ;
    nb.prototype.unregisterMarker = function(a) {
        var b = this.markers_[a];
        if (b)
            b.dispose(),
            delete this.markers_[a];
        else
            throw Error("Marker with ID " + a + " does not exist. Can only unregister markers that exist.");
    }
    ;
    nb.prototype.getCursor = function() {
        return this.cursor_
    }
    ;
    nb.prototype.getMarker = function(a) {
        return this.markers_[a] || null
    }
    ;
    nb.prototype.setCursor = function(a) {
        this.cursor_ && this.cursor_.getDrawer() && this.cursor_.getDrawer().dispose();
        if (this.cursor_ = a)
            a = this.workspace_.getRenderer().makeMarkerDrawer(this.workspace_, this.cursor_),
            this.cursor_.setDrawer(a),
            this.setCursorSvg(this.cursor_.getDrawer().createDom())
    }
    ;
    nb.prototype.setCursorSvg = function(a) {
        a ? (this.workspace_.getBlockCanvas().appendChild(a),
        this.cursorSvg_ = a) : this.cursorSvg_ = null
    }
    ;
    nb.prototype.setMarkerSvg = function(a) {
        a ? this.workspace_.getBlockCanvas() && (this.cursorSvg_ ? this.workspace_.getBlockCanvas().insertBefore(a, this.cursorSvg_) : this.workspace_.getBlockCanvas().appendChild(a)) : this.markerSvg_ = null
    }
    ;
    nb.prototype.updateMarkers = function() {
        this.workspace_.keyboardAccessibilityMode && this.cursorSvg_ && this.workspace_.getCursor().draw()
    }
    ;
    nb.prototype.dispose = function() {
        for (var a = Object.keys(this.markers_), b = 0, c; c = a[b]; b++)
            this.unregisterMarker(c);
        this.markers_ = null;
        this.cursor_ && (this.cursor_.dispose(),
        this.cursor_ = null)
    }
    ;
    var $a = {
        BlockChange: function(a, b, c, d, f) {
            $a.BlockChange.superClass_.constructor.call(this, a);
            a && (this.element = "undefined" === typeof b ? "" : b,
            this.name = "undefined" === typeof c ? "" : c,
            this.oldValue = "undefined" === typeof d ? "" : d,
            this.newValue = "undefined" === typeof f ? "" : f)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)($a.BlockChange, Eb.BlockBase);
    $a.BlockChange.prototype.type = h.CHANGE;
    $a.BlockChange.prototype.toJson = function() {
        var a = $a.BlockChange.superClass_.toJson.call(this);
        a.element = this.element;
        this.name && (a.name = this.name);
        a.oldValue = this.oldValue;
        a.newValue = this.newValue;
        return a
    }
    ;
    $a.BlockChange.prototype.fromJson = function(a) {
        $a.BlockChange.superClass_.fromJson.call(this, a);
        this.element = a.element;
        this.name = a.name;
        this.oldValue = a.oldValue;
        this.newValue = a.newValue
    }
    ;
    $a.BlockChange.prototype.isNull = function() {
        return this.oldValue === this.newValue
    }
    ;
    $a.BlockChange.prototype.run = function(a) {
        var b = this.getEventWorkspace_().getBlockById(this.blockId);
        if (b)
            switch (b.mutator && b.mutator.setVisible(!1),
            a = a ? this.newValue : this.oldValue,
            this.element) {
            case "field":
                (b = b.getField(this.name)) ? b.setValue(a) : console.warn("Can't set non-existent field: " + this.name);
                break;
            case "comment":
                b.setCommentText(a || null);
                break;
            case "collapsed":
                b.setCollapsed(!!a);
                break;
            case "disabled":
                b.setEnabled(!a);
                break;
            case "inline":
                b.setInputsInline(!!a);
                break;
            case "mutation":
                var c = $a.BlockChange.getExtraBlockState_(b);
                b.loadExtraState ? b.loadExtraState(JSON.parse(a || "{}")) : b.domToMutation && b.domToMutation((0,
                e.module$exports$Blockly$Xml.textToDom)(a || "<mutation/>"));
                (0,
                h.fire)(new $a.BlockChange(b,"mutation",null,c,a));
                break;
            default:
                console.warn("Unknown change type: " + this.element)
            }
        else
            console.warn("Can't change non-existent block: " + this.blockId)
    }
    ;
    $a.BlockChange.getExtraBlockState_ = function(a) {
        return a.saveExtraState ? (a = a.saveExtraState()) ? JSON.stringify(a) : "" : a.mutationToDom ? (a = a.mutationToDom()) ? (0,
        e.module$exports$Blockly$Xml.domToText)(a) : "" : ""
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.CHANGE, $a.BlockChange);
    var Hb = {}
      , Yd = 0
      , sd = null;
    Hb.disposeUiEffect = function(a) {
        var b = a.workspace
          , c = a.getSvgRoot();
        b.getAudioManager().play("delete");
        a = b.getSvgXY(c);
        c = c.cloneNode(!0);
        c.translateX_ = a.x;
        c.translateY_ = a.y;
        c.setAttribute("transform", "translate(" + a.x + "," + a.y + ")");
        b.getParentSvg().appendChild(c);
        c.bBox_ = c.getBBox();
        Ce(c, b.RTL, new Date, b.scale)
    }
    ;
    var Ce = function(a, b, c, d) {
        var f = (new Date - c) / 150;
        1 < f ? (0,
        l.removeNode)(a) : (a.setAttribute("transform", "translate(" + (a.translateX_ + (b ? -1 : 1) * a.bBox_.width * d / 2 * f) + "," + (a.translateY_ + a.bBox_.height * d * f) + ") scale(" + (1 - f) * d + ")"),
        setTimeout(Ce, 10, a, b, c, d))
    };
    Hb.connectionUiEffect = function(a) {
        var b = a.workspace
          , c = b.scale;
        b.getAudioManager().play("click");
        if (!(1 > c)) {
            var d = b.getSvgXY(a.getSvgRoot());
            a.outputConnection ? (d.x += (a.RTL ? 3 : -3) * c,
            d.y += 13 * c) : a.previousConnection && (d.x += (a.RTL ? -23 : 23) * c,
            d.y += 3 * c);
            a = (0,
            l.createSvgElement)(q.CIRCLE, {
                cx: d.x,
                cy: d.y,
                r: 0,
                fill: "none",
                stroke: "#888",
                "stroke-width": 10
            }, b.getParentSvg());
            De(a, new Date, c)
        }
    }
    ;
    var De = function(a, b, c) {
        var d = (new Date - b) / 150;
        1 < d ? (0,
        l.removeNode)(a) : (a.setAttribute("r", 25 * d * c),
        a.style.opacity = 1 - d,
        Yd = setTimeout(De, 10, a, b, c))
    };
    Hb.disconnectUiEffect = function(a) {
        a.workspace.getAudioManager().play("disconnect");
        if (!(1 > a.workspace.scale)) {
            var b = a.getHeightWidth().height;
            b = Math.atan(10 / b) / Math.PI * 180;
            a.RTL || (b *= -1);
            Ee(a.getSvgRoot(), b, new Date)
        }
    }
    ;
    var Ee = function(a, b, c) {
        var d = (new Date - c) / 200;
        1 < d ? a.skew_ = "" : (a.skew_ = "skewX(" + Math.round(Math.sin(d * Math.PI * 3) * (1 - d) * b) + ")",
        sd = a,
        Yd = setTimeout(Ee, 10, a, b, c));
        a.setAttribute("transform", a.translate_ + a.skew_)
    };
    Hb.disconnectUiStop = function() {
        if (sd) {
            clearTimeout(Yd);
            var a = sd;
            a.skew_ = "";
            a.setAttribute("transform", a.translate_);
            sd = null
        }
    }
    ;
    var ia = function() {
        this.componentData_ = Object.create(null);
        this.capabilityToComponentIds_ = Object.create(null)
    };
    ia.prototype.addComponent = function(a, b) {
        var c = a.component.id;
        if (!b && this.componentData_[c])
            throw Error('Plugin "' + c + '" with capabilities "' + this.componentData_[c].capabilities + '" already added.');
        this.componentData_[c] = a;
        b = [];
        for (var d = 0; d < a.capabilities.length; d++) {
            var f = String(a.capabilities[d]).toLowerCase();
            b.push(f);
            void 0 === this.capabilityToComponentIds_[f] ? this.capabilityToComponentIds_[f] = [c] : this.capabilityToComponentIds_[f].push(c)
        }
        this.componentData_[c].capabilities = b
    }
    ;
    ia.prototype.removeComponent = function(a) {
        var b = this.componentData_[a];
        if (b) {
            for (var c = 0; c < b.capabilities.length; c++) {
                var d = String(b.capabilities[c]).toLowerCase();
                (0,
                sb)(this.capabilityToComponentIds_[d], a)
            }
            delete this.componentData_[a]
        }
    }
    ;
    ia.prototype.addCapability = function(a, b) {
        if (!this.getComponent(a))
            throw Error('Cannot add capability, "' + b + '". Plugin "' + a + '" has not been added to the ComponentManager');
        this.hasCapability(a, b) ? console.warn('Plugin "' + a + 'already has capability "' + b + '"') : (b = String(b).toLowerCase(),
        this.componentData_[a].capabilities.push(b),
        this.capabilityToComponentIds_[b].push(a))
    }
    ;
    ia.prototype.removeCapability = function(a, b) {
        if (!this.getComponent(a))
            throw Error('Cannot remove capability, "' + b + '". Plugin "' + a + '" has not been added to the ComponentManager');
        this.hasCapability(a, b) ? (b = String(b).toLowerCase(),
        (0,
        sb)(this.componentData_[a].capabilities, b),
        (0,
        sb)(this.capabilityToComponentIds_[b], a)) : console.warn('Plugin "' + a + "doesn't have capability \"" + b + '" to remove')
    }
    ;
    ia.prototype.hasCapability = function(a, b) {
        b = String(b).toLowerCase();
        return -1 !== this.componentData_[a].capabilities.indexOf(b)
    }
    ;
    ia.prototype.getComponent = function(a) {
        return this.componentData_[a] && this.componentData_[a].component
    }
    ;
    ia.prototype.getComponents = function(a, b) {
        a = String(a).toLowerCase();
        a = this.capabilityToComponentIds_[a];
        if (!a)
            return [];
        var c = [];
        if (b) {
            var d = []
              , f = this.componentData_;
            a.forEach(function(k) {
                d.push(f[k])
            });
            d.sort(function(k, n) {
                return k.weight - n.weight
            });
            d.forEach(function(k) {
                c.push(k.component)
            })
        } else {
            var g = this.componentData_;
            a.forEach(function(k) {
                c.push(g[k].component)
            })
        }
        return c
    }
    ;
    ia.Capability = function(a) {
        this.name_ = a
    }
    ;
    ia.Capability.prototype.toString = function() {
        return this.name_
    }
    ;
    ia.Capability.POSITIONABLE = new ia.Capability("positionable");
    ia.Capability.DRAG_TARGET = new ia.Capability("drag_target");
    ia.Capability.DELETE_AREA = new ia.Capability("delete_area");
    ia.Capability.AUTOHIDEABLE = new ia.Capability("autohideable");
    var Oa = {}
      , Fe = function(a, b) {
        window.alert(a);
        b && b()
    }
      , Ge = function(a, b) {
        b(window.confirm(a))
    }
      , He = function(a, b, c) {
        c(window.prompt(a, b))
    };
    Oa.alert = function(a, b) {
        Fe(a, b)
    }
    ;
    Oa.setAlert = function(a) {
        Fe = a
    }
    ;
    Oa.confirm = function(a, b) {
        Ge(a, b)
    }
    ;
    Oa.setConfirm = function(a) {
        Ge = a
    }
    ;
    Oa.prompt = function(a, b, c) {
        He(a, b, c)
    }
    ;
    Oa.setPrompt = function(a) {
        He = a
    }
    ;
    var Sb = {
        VarBase: function(a) {
            Sb.VarBase.superClass_.constructor.call(this);
            this.varId = (this.isBlank = "undefined" === typeof a) ? "" : a.getId();
            this.workspaceId = this.isBlank ? "" : a.workspace.id
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Sb.VarBase, zb);
    Sb.VarBase.prototype.toJson = function() {
        var a = Sb.VarBase.superClass_.toJson.call(this);
        a.varId = this.varId;
        return a
    }
    ;
    Sb.VarBase.prototype.fromJson = function(a) {
        Sb.VarBase.superClass_.toJson.call(this);
        this.varId = a.varId
    }
    ;
    var Tb = {
        VarCreate: function(a) {
            Tb.VarCreate.superClass_.constructor.call(this, a);
            a && (this.varType = a.type,
            this.varName = a.name)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Tb.VarCreate, Sb.VarBase);
    Tb.VarCreate.prototype.type = h.VAR_CREATE;
    Tb.VarCreate.prototype.toJson = function() {
        var a = Tb.VarCreate.superClass_.toJson.call(this);
        a.varType = this.varType;
        a.varName = this.varName;
        return a
    }
    ;
    Tb.VarCreate.prototype.fromJson = function(a) {
        Tb.VarCreate.superClass_.fromJson.call(this, a);
        this.varType = a.varType;
        this.varName = a.varName
    }
    ;
    Tb.VarCreate.prototype.run = function(a) {
        var b = this.getEventWorkspace_();
        a ? b.createVariable(this.varName, this.varType, this.varId) : b.deleteVariableById(this.varId)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.VAR_CREATE, Tb.VarCreate);
    var yc = function(a, b, c, d) {
        this.workspace = a;
        this.name = b;
        this.type = c || "";
        this.id_ = d || (0,
        Va.genUid)();
        (0,
        h.fire)(new ((0,
        h.get)(h.VAR_CREATE))(this))
    };
    yc.prototype.getId = function() {
        return this.id_
    }
    ;
    yc.compareByName = function(a, b) {
        return a.name.localeCompare(b.name, void 0, {
            sensitivity: "base"
        })
    }
    ;
    e.module$exports$Blockly$Variables = {
        CATEGORY_NAME: "VARIABLE",
        allUsedVarModels: function(a) {
            var b = a.getAllBlocks(!1);
            a = Object.create(null);
            for (var c = 0; c < b.length; c++) {
                var d = b[c].getVarModels();
                if (d)
                    for (var f = 0; f < d.length; f++) {
                        var g = d[f]
                          , k = g.getId();
                        k && (a[k] = g)
                    }
            }
            b = [];
            for (var n in a)
                b.push(a[n]);
            return b
        }
    };
    var Ie = {};
    e.module$exports$Blockly$Variables.allDeveloperVariables = function(a) {
        a = a.getAllBlocks(!1);
        for (var b = Object.create(null), c = 0, d; d = a[c]; c++) {
            var f = d.getDeveloperVariables;
            !f && d.getDeveloperVars && (f = d.getDeveloperVars,
            Ie[d.type] || (console.warn("Function getDeveloperVars() deprecated. Use getDeveloperVariables() (block type '" + d.type + "')"),
            Ie[d.type] = !0));
            if (f)
                for (d = f(),
                f = 0; f < d.length; f++)
                    b[d[f]] = !0
        }
        return Object.keys(b)
    }
    ;
    e.module$exports$Blockly$Variables.flyoutCategory = function(a) {
        var b = []
          , c = document.createElement("button");
        c.setAttribute("text", "%{BKY_NEW_VARIABLE}");
        c.setAttribute("callbackKey", "CREATE_VARIABLE");
        a.registerButtonCallback("CREATE_VARIABLE", function(d) {
            (0,
            e.module$exports$Blockly$Variables.createVariableButtonHandler)(d.getTargetWorkspace())
        });
        b.push(c);
        a = (0,
        e.module$exports$Blockly$Variables.flyoutCategoryBlocks)(a);
        return b = b.concat(a)
    }
    ;
    e.module$exports$Blockly$Variables.flyoutCategoryBlocks = function(a) {
        a = a.getVariablesOfType("");
        var b = [];
        if (0 < a.length) {
            var c = a[a.length - 1];
            if (e.module$exports$Blockly$blocks.Blocks.variables_set) {
                var d = (0,
                e.module$exports$Blockly$utils$xml.createElement)("block");
                d.setAttribute("type", "variables_set");
                d.setAttribute("gap", e.module$exports$Blockly$blocks.Blocks.math_change ? 8 : 24);
                d.appendChild((0,
                e.module$exports$Blockly$Variables.generateVariableFieldDom)(c));
                b.push(d)
            }
            e.module$exports$Blockly$blocks.Blocks.math_change && (d = (0,
            e.module$exports$Blockly$utils$xml.createElement)("block"),
            d.setAttribute("type", "math_change"),
            d.setAttribute("gap", e.module$exports$Blockly$blocks.Blocks.variables_get ? 20 : 8),
            d.appendChild((0,
            e.module$exports$Blockly$Variables.generateVariableFieldDom)(c)),
            c = (0,
            e.module$exports$Blockly$Xml.textToDom)('<value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>'),
            d.appendChild(c),
            b.push(d));
            if (e.module$exports$Blockly$blocks.Blocks.variables_get)
                for (a.sort(yc.compareByName),
                c = 0; d = a[c]; c++) {
                    var f = (0,
                    e.module$exports$Blockly$utils$xml.createElement)("block");
                    f.setAttribute("type", "variables_get");
                    f.setAttribute("gap", 8);
                    f.appendChild((0,
                    e.module$exports$Blockly$Variables.generateVariableFieldDom)(d));
                    b.push(f)
                }
        }
        return b
    }
    ;
    e.module$exports$Blockly$Variables.VAR_LETTER_OPTIONS = "ijkmnopqrstuvwxyzabcdefgh";
    e.module$exports$Blockly$Variables.generateUniqueName = function(a) {
        return (0,
        e.module$exports$Blockly$Variables.generateUniqueNameFromOptions)(e.module$exports$Blockly$Variables.VAR_LETTER_OPTIONS.charAt(0), a.getAllVariableNames())
    }
    ;
    e.module$exports$Blockly$Variables.generateUniqueNameFromOptions = function(a, b) {
        if (!b.length)
            return a;
        for (var c = e.module$exports$Blockly$Variables.VAR_LETTER_OPTIONS, d = "", f = c.indexOf(a); ; ) {
            for (var g = !1, k = 0; k < b.length; k++)
                if (b[k].toLowerCase() === a) {
                    g = !0;
                    break
                }
            if (!g)
                return a;
            f++;
            f === c.length && (f = 0,
            d = Number(d) + 1);
            a = c.charAt(f) + d
        }
    }
    ;
    e.module$exports$Blockly$Variables.createVariableButtonHandler = function(a, b, c) {
        var d = c || ""
          , f = function(g) {
            (0,
            e.module$exports$Blockly$Variables.promptName)(e.module$exports$Blockly$Msg.Msg.NEW_VARIABLE_TITLE, g, function(k) {
                if (k) {
                    var n = (0,
                    e.module$exports$Blockly$Variables.nameUsedWithAnyType)(k, a);
                    if (n) {
                        if (n.type === d)
                            var x = e.module$exports$Blockly$Msg.Msg.VARIABLE_ALREADY_EXISTS.replace("%1", n.name);
                        else
                            x = e.module$exports$Blockly$Msg.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE,
                            x = x.replace("%1", n.name).replace("%2", n.type);
                        (0,
                        Oa.alert)(x, function() {
                            f(k)
                        })
                    } else
                        a.createVariable(k, d),
                        b && b(k)
                } else
                    b && b(null)
            })
        };
        f("")
    }
    ;
    e.module$exports$Blockly$Variables.renameVariable = function(a, b, c) {
        var d = function(f) {
            var g = e.module$exports$Blockly$Msg.Msg.RENAME_VARIABLE_TITLE.replace("%1", b.name);
            (0,
            e.module$exports$Blockly$Variables.promptName)(g, f, function(k) {
                if (k) {
                    var n = gf(k, b.type, a);
                    n ? (n = e.module$exports$Blockly$Msg.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE.replace("%1", n.name).replace("%2", n.type),
                    (0,
                    Oa.alert)(n, function() {
                        d(k)
                    })) : (a.renameVariableById(b.getId(), k),
                    c && c(k))
                } else
                    c && c(null)
            })
        };
        d("")
    }
    ;
    e.module$exports$Blockly$Variables.promptName = function(a, b, c) {
        (0,
        Oa.prompt)(a, b, function(d) {
            d && (d = d.replace(/[\s\xa0]+/g, " ").trim(),
            d === e.module$exports$Blockly$Msg.Msg.RENAME_VARIABLE || d === e.module$exports$Blockly$Msg.Msg.NEW_VARIABLE) && (d = null);
            c(d)
        })
    }
    ;
    var gf = function(a, b, c) {
        c = c.getVariableMap().getAllVariables();
        a = a.toLowerCase();
        for (var d = 0, f; f = c[d]; d++)
            if (f.name.toLowerCase() === a && f.type !== b)
                return f;
        return null
    };
    e.module$exports$Blockly$Variables.nameUsedWithAnyType = function(a, b) {
        b = b.getVariableMap().getAllVariables();
        a = a.toLowerCase();
        for (var c = 0, d; d = b[c]; c++)
            if (d.name.toLowerCase() === a)
                return d;
        return null
    }
    ;
    e.module$exports$Blockly$Variables.generateVariableFieldDom = function(a) {
        var b = (0,
        e.module$exports$Blockly$utils$xml.createElement)("field");
        b.setAttribute("name", "VAR");
        b.setAttribute("id", a.getId());
        b.setAttribute("variabletype", a.type);
        a = (0,
        e.module$exports$Blockly$utils$xml.createTextNode)(a.name);
        b.appendChild(a);
        return b
    }
    ;
    e.module$exports$Blockly$Variables.getOrCreateVariablePackage = function(a, b, c, d) {
        var f = (0,
        e.module$exports$Blockly$Variables.getVariable)(a, b, c, d);
        f || (f = a.getPotentialVariableMap(),
        c || (c = e.module$exports$Blockly$Variables.generateUniqueName(a.isFlyout ? a.targetWorkspace : a)),
        f = f ? f.createVariable(c, d, b) : a.createVariable(c, d, b));
        return f
    }
    ;
    e.module$exports$Blockly$Variables.getVariable = function(a, b, c, d) {
        var f = a.getPotentialVariableMap()
          , g = null;
        if (b && (g = a.getVariableById(b),
        !g && f && (g = f.getVariableById(b)),
        g))
            return g;
        if (c) {
            if (void 0 === d)
                throw Error("Tried to look up a variable by name without a type");
            g = a.getVariable(c, d);
            !g && f && (g = f.getVariable(c, d))
        }
        return g
    }
    ;
    e.module$exports$Blockly$Variables.getAddedVariables = function(a, b) {
        a = a.getAllVariables();
        var c = [];
        if (b.length !== a.length)
            for (var d = 0; d < a.length; d++) {
                var f = a[d];
                -1 === b.indexOf(f) && c.push(f)
            }
        return c
    }
    ;
    e.module$exports$Blockly$Names = {
        Names: function(a, b) {
            this.variablePrefix_ = b || "";
            this.reservedDict_ = Object.create(null);
            if (a)
                for (a = a.split(","),
                b = 0; b < a.length; b++)
                    this.reservedDict_[a[b]] = !0;
            this.reset()
        },
        NameType: {
            DEVELOPER_VARIABLE: "DEVELOPER_VARIABLE",
            VARIABLE: "VARIABLE",
            PROCEDURE: "PROCEDURE"
        }
    };
    e.module$exports$Blockly$Names.Names.DEVELOPER_VARIABLE_TYPE = e.module$exports$Blockly$Names.NameType.DEVELOPER_VARIABLE;
    e.module$exports$Blockly$Names.Names.prototype.reset = function() {
        this.db_ = Object.create(null);
        this.dbReverse_ = Object.create(null);
        this.variableMap_ = null
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.setVariableMap = function(a) {
        this.variableMap_ = a
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.getNameForUserVariable_ = function(a) {
        return this.variableMap_ ? (a = this.variableMap_.getVariableById(a)) ? a.name : null : (console.warn("Deprecated call to Names.prototype.getName without defining a variable map. To fix, add the following code in your generator's init() function:\nBlockly.YourGeneratorName.nameDB_.setVariableMap(workspace.getVariableMap());"),
        null)
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.populateVariables = function(a) {
        a = (0,
        e.module$exports$Blockly$Variables.allUsedVarModels)(a);
        for (var b = 0; b < a.length; b++)
            this.getName(a[b].getId(), e.module$exports$Blockly$Names.NameType.VARIABLE)
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.populateProcedures = function(a) {
        a = e.module$exports$Blockly$Procedures.allProcedures(a);
        a = a[0].concat(a[1]);
        for (var b = 0; b < a.length; b++)
            this.getName(a[b][0], e.module$exports$Blockly$Names.NameType.PROCEDURE)
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.getName = function(a, b) {
        var c = a;
        b === e.module$exports$Blockly$Names.NameType.VARIABLE && (a = this.getNameForUserVariable_(a)) && (c = a);
        a = c.toLowerCase();
        var d = b === e.module$exports$Blockly$Names.NameType.VARIABLE || b === e.module$exports$Blockly$Names.NameType.DEVELOPER_VARIABLE ? this.variablePrefix_ : "";
        b in this.db_ || (this.db_[b] = Object.create(null));
        var f = this.db_[b];
        if (a in f)
            return d + f[a];
        b = this.getDistinctName(c, b);
        f[a] = b.substr(d.length);
        return b
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.getUserNames = function(a) {
        return Object.keys(this.db_[a] || {})
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.getDistinctName = function(a, b) {
        a = this.safeName_(a);
        for (var c = ""; this.dbReverse_[a + c] || a + c in this.reservedDict_; )
            c = c ? c + 1 : 2;
        a += c;
        this.dbReverse_[a] = !0;
        return (b === e.module$exports$Blockly$Names.NameType.VARIABLE || b === e.module$exports$Blockly$Names.NameType.DEVELOPER_VARIABLE ? this.variablePrefix_ : "") + a
    }
    ;
    e.module$exports$Blockly$Names.Names.prototype.safeName_ = function(a) {
        a ? (a = encodeURI(a.replace(/ /g, "_")).replace(/[^\w]/g, "_"),
        -1 !== "0123456789".indexOf(a[0]) && (a = "my_" + a)) : a = e.module$exports$Blockly$Msg.Msg.UNNAMED_KEY || "unnamed";
        return a
    }
    ;
    e.module$exports$Blockly$Names.Names.equals = function(a, b) {
        return a.toLowerCase() === b.toLowerCase()
    }
    ;
    var Ub = {
        VarDelete: function(a) {
            Ub.VarDelete.superClass_.constructor.call(this, a);
            a && (this.varType = a.type,
            this.varName = a.name)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ub.VarDelete, Sb.VarBase);
    Ub.VarDelete.prototype.type = h.VAR_DELETE;
    Ub.VarDelete.prototype.toJson = function() {
        var a = Ub.VarDelete.superClass_.toJson.call(this);
        a.varType = this.varType;
        a.varName = this.varName;
        return a
    }
    ;
    Ub.VarDelete.prototype.fromJson = function(a) {
        Ub.VarDelete.superClass_.fromJson.call(this, a);
        this.varType = a.varType;
        this.varName = a.varName
    }
    ;
    Ub.VarDelete.prototype.run = function(a) {
        var b = this.getEventWorkspace_();
        a ? b.deleteVariableById(this.varId) : b.createVariable(this.varName, this.varType, this.varId)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.VAR_DELETE, Ub.VarDelete);
    var Vb = {
        VarRename: function(a, b) {
            Vb.VarRename.superClass_.constructor.call(this, a);
            a && (this.oldName = a.name,
            this.newName = "undefined" === typeof b ? "" : b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Vb.VarRename, Sb.VarBase);
    Vb.VarRename.prototype.type = h.VAR_RENAME;
    Vb.VarRename.prototype.toJson = function() {
        var a = Vb.VarRename.superClass_.toJson.call(this);
        a.oldName = this.oldName;
        a.newName = this.newName;
        return a
    }
    ;
    Vb.VarRename.prototype.fromJson = function(a) {
        Vb.VarRename.superClass_.fromJson.call(this, a);
        this.oldName = a.oldName;
        this.newName = a.newName
    }
    ;
    Vb.VarRename.prototype.run = function(a) {
        var b = this.getEventWorkspace_();
        a ? b.renameVariableById(this.varId, this.newName) : b.renameVariableById(this.varId, this.oldName)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.VAR_RENAME, Vb.VarRename);
    var Ta = function(a) {
        this.variableMap_ = Object.create(null);
        this.workspace = a
    };
    Ta.prototype.clear = function() {
        this.variableMap_ = Object.create(null)
    }
    ;
    Ta.prototype.renameVariable = function(a, b) {
        var c = this.getVariable(b, a.type)
          , d = this.workspace.getAllBlocks(!1);
        (0,
        h.setGroup)(!0);
        try {
            c && c.getId() !== a.getId() ? this.renameVariableWithConflict_(a, b, c, d) : this.renameVariableAndUses_(a, b, d)
        } finally {
            (0,
            h.setGroup)(!1)
        }
    }
    ;
    Ta.prototype.renameVariableById = function(a, b) {
        var c = this.getVariableById(a);
        if (!c)
            throw Error("Tried to rename a variable that didn't exist. ID: " + a);
        this.renameVariable(c, b)
    }
    ;
    Ta.prototype.renameVariableAndUses_ = function(a, b, c) {
        (0,
        h.fire)(new ((0,
        h.get)(h.VAR_RENAME))(a,b));
        a.name = b;
        for (b = 0; b < c.length; b++)
            c[b].updateVarName(a)
    }
    ;
    Ta.prototype.renameVariableWithConflict_ = function(a, b, c, d) {
        var f = a.type;
        b !== c.name && this.renameVariableAndUses_(c, b, d);
        for (b = 0; b < d.length; b++)
            d[b].renameVarById(a.getId(), c.getId());
        (0,
        h.fire)(new ((0,
        h.get)(h.VAR_DELETE))(a));
        (0,
        sb)(this.variableMap_[f], a)
    }
    ;
    Ta.prototype.createVariable = function(a, b, c) {
        var d = this.getVariable(a, b);
        if (d) {
            if (c && d.getId() !== c)
                throw Error('Variable "' + a + '" is already in use and its id is "' + d.getId() + '" which conflicts with the passed in id, "' + c + '".');
            return d
        }
        if (c && this.getVariableById(c))
            throw Error('Variable id, "' + c + '", is already in use.');
        d = c || (0,
        Va.genUid)();
        b = b || "";
        d = new yc(this.workspace,a,b,d);
        a = this.variableMap_[b] || [];
        a.push(d);
        delete this.variableMap_[b];
        this.variableMap_[b] = a;
        return d
    }
    ;
    Ta.prototype.deleteVariable = function(a) {
        for (var b = a.getId(), c = this.variableMap_[a.type], d = 0; d < c.length; d++)
            if (c[d].getId() === b) {
                c.splice(d, 1);
                (0,
                h.fire)(new ((0,
                h.get)(h.VAR_DELETE))(a));
                break
            }
    }
    ;
    Ta.prototype.deleteVariableById = function(a) {
        var b = this.getVariableById(a);
        if (b) {
            var c = b.name
              , d = this.getVariableUsesById(a);
            a = 0;
            for (var f = void 0; f = d[a]; a++)
                if ("procedures_defnoreturn" === f.type || "procedures_defreturn" === f.type) {
                    a = String(f.getFieldValue("NAME"));
                    c = e.module$exports$Blockly$Msg.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE.replace("%1", c).replace("%2", a);
                    (0,
                    Oa.alert)(c);
                    return
                }
            var g = this;
            1 < d.length ? (c = e.module$exports$Blockly$Msg.Msg.DELETE_VARIABLE_CONFIRMATION.replace("%1", String(d.length)).replace("%2", c),
            (0,
            Oa.confirm)(c, function(k) {
                k && b && g.deleteVariableInternal(b, d)
            })) : g.deleteVariableInternal(b, d)
        } else
            console.warn("Can't delete non-existent variable: " + a)
    }
    ;
    Ta.prototype.deleteVariableInternal = function(a, b) {
        var c = (0,
        h.getGroup)();
        c || (0,
        h.setGroup)(!0);
        try {
            for (var d = 0; d < b.length; d++)
                b[d].dispose(!0);
            this.deleteVariable(a)
        } finally {
            c || (0,
            h.setGroup)(!1)
        }
    }
    ;
    Ta.prototype.getVariable = function(a, b) {
        if (b = this.variableMap_[b || ""])
            for (var c = 0, d; d = b[c]; c++)
                if (e.module$exports$Blockly$Names.Names.equals(d.name, a))
                    return d;
        return null
    }
    ;
    Ta.prototype.getVariableById = function(a) {
        for (var b = Object.keys(this.variableMap_), c = 0; c < b.length; c++)
            for (var d = b[c], f = 0, g; g = this.variableMap_[d][f]; f++)
                if (g.getId() === a)
                    return g;
        return null
    }
    ;
    Ta.prototype.getVariablesOfType = function(a) {
        return (a = this.variableMap_[a || ""]) ? a.slice() : []
    }
    ;
    Ta.prototype.getVariableTypes = function(a) {
        var b = {};
        (0,
        e.module$exports$Blockly$utils$object.mixin)(b, this.variableMap_);
        a && a.getPotentialVariableMap() && (0,
        e.module$exports$Blockly$utils$object.mixin)(b, a.getPotentialVariableMap().variableMap_);
        a = Object.keys(b);
        b = !1;
        for (var c = 0; c < a.length; c++)
            "" === a[c] && (b = !0);
        b || a.push("");
        return a
    }
    ;
    Ta.prototype.getAllVariables = function() {
        var a = [], b;
        for (b in this.variableMap_)
            a = a.concat(this.variableMap_[b]);
        return a
    }
    ;
    Ta.prototype.getAllVariableNames = function() {
        var a = [], b;
        for (b in this.variableMap_)
            for (var c = this.variableMap_[b], d = 0, f; f = c[d]; d++)
                a.push(f.name);
        return a
    }
    ;
    Ta.prototype.getVariableUsesById = function(a) {
        for (var b = [], c = this.workspace.getAllBlocks(!1), d = 0; d < c.length; d++) {
            var f = c[d].getVarModels();
            if (f)
                for (var g = 0; g < f.length; g++)
                    f[g].getId() === a && b.push(c[d])
        }
        return b
    }
    ;
    var tb = {
        BlockMove: function(a) {
            tb.BlockMove.superClass_.constructor.call(this, a);
            a && (a.isShadow() && (this.recordUndo = !1),
            a = this.currentLocation_(),
            this.oldParentId = a.parentId,
            this.oldInputName = a.inputName,
            this.oldCoordinate = a.coordinate)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(tb.BlockMove, Eb.BlockBase);
    tb.BlockMove.prototype.type = h.MOVE;
    tb.BlockMove.prototype.toJson = function() {
        var a = tb.BlockMove.superClass_.toJson.call(this);
        this.newParentId && (a.newParentId = this.newParentId);
        this.newInputName && (a.newInputName = this.newInputName);
        this.newCoordinate && (a.newCoordinate = Math.round(this.newCoordinate.x) + "," + Math.round(this.newCoordinate.y));
        this.recordUndo || (a.recordUndo = this.recordUndo);
        return a
    }
    ;
    tb.BlockMove.prototype.fromJson = function(a) {
        tb.BlockMove.superClass_.fromJson.call(this, a);
        this.newParentId = a.newParentId;
        this.newInputName = a.newInputName;
        if (a.newCoordinate) {
            var b = a.newCoordinate.split(",");
            this.newCoordinate = new E(Number(b[0]),Number(b[1]))
        }
        void 0 !== a.recordUndo && (this.recordUndo = a.recordUndo)
    }
    ;
    tb.BlockMove.prototype.recordNew = function() {
        var a = this.currentLocation_();
        this.newParentId = a.parentId;
        this.newInputName = a.inputName;
        this.newCoordinate = a.coordinate
    }
    ;
    tb.BlockMove.prototype.currentLocation_ = function() {
        var a = this.getEventWorkspace_().getBlockById(this.blockId)
          , b = {}
          , c = a.getParent();
        if (c) {
            if (b.parentId = c.id,
            a = c.getInputWithBlock(a))
                b.inputName = a.name
        } else
            b.coordinate = a.getRelativeToSurfaceXY();
        return b
    }
    ;
    tb.BlockMove.prototype.isNull = function() {
        return this.oldParentId === this.newParentId && this.oldInputName === this.newInputName && E.equals(this.oldCoordinate, this.newCoordinate)
    }
    ;
    tb.BlockMove.prototype.run = function(a) {
        var b = this.getEventWorkspace_()
          , c = b.getBlockById(this.blockId);
        if (c) {
            var d = a ? this.newParentId : this.oldParentId
              , f = a ? this.newInputName : this.oldInputName;
            a = a ? this.newCoordinate : this.oldCoordinate;
            if (d) {
                var g = b.getBlockById(d);
                if (!g) {
                    console.warn("Can't connect to non-existent block: " + d);
                    return
                }
            }
            c.getParent() && c.unplug();
            if (a)
                f = c.getRelativeToSurfaceXY(),
                c.moveBy(a.x - f.x, a.y - f.y);
            else {
                b = c.outputConnection;
                if (!b || c.previousConnection && c.previousConnection.isConnected())
                    b = c.previousConnection;
                c = b.type;
                if (f) {
                    if (c = g.getInput(f))
                        var k = c.connection
                } else
                    c === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT && (k = g.nextConnection);
                k ? b.connect(k) : console.warn("Can't connect to non-existent input: " + f)
            }
        } else
            console.warn("Can't move non-existent block: " + this.blockId)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.MOVE, tb.BlockMove);
    var dc = {
        COLLAPSED_INPUT_NAME: "_TEMP_COLLAPSED_INPUT",
        COLLAPSED_FIELD_NAME: "_TEMP_COLLAPSED_FIELD"
    }
      , F = function(a, b) {
        this.sourceBlock_ = a;
        this.type = b
    };
    F.CAN_CONNECT = 0;
    F.REASON_SELF_CONNECTION = 1;
    F.REASON_WRONG_TYPE = 2;
    F.REASON_TARGET_NULL = 3;
    F.REASON_CHECKS_FAILED = 4;
    F.REASON_DIFFERENT_WORKSPACES = 5;
    F.REASON_SHADOW_PARENT = 6;
    F.REASON_DRAG_CHECKS_FAILED = 7;
    F.REASON_PREVIOUS_AND_OUTPUT = 8;
    F.prototype.targetConnection = null;
    F.prototype.disposed = !1;
    F.prototype.check_ = null;
    F.prototype.shadowDom_ = null;
    F.prototype.x = 0;
    F.prototype.y = 0;
    F.prototype.connect_ = function(a) {
        var b = e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE
          , c = this.getSourceBlock()
          , d = a.getSourceBlock();
        a.isConnected() && a.disconnect();
        if (this.isConnected()) {
            var f = this.stashShadowState_()
              , g = this.targetBlock();
            if (g.isShadow())
                g.dispose(!1);
            else {
                this.disconnect();
                var k = g
            }
            this.applyShadowState_(f)
        }
        var n;
        (0,
        h.isEnabled)() && (n = new ((0,
        h.get)(h.MOVE))(d));
        f = a;
        if (!this || !f)
            throw Error("Cannot connect null connections.");
        this.targetConnection = f;
        f.targetConnection = this;
        d.setParent(c);
        n && (n.recordNew(),
        (0,
        h.fire)(n));
        if (k)
            if (a = this.type === b ? k.outputConnection : k.previousConnection,
            d = F.getConnectionForOrphanedConnection(d, a))
                a.connect(d);
            else
                a.onFailedConnect(this)
    }
    ;
    F.prototype.dispose = function() {
        if (this.isConnected()) {
            this.setShadowStateInternal_();
            var a = this.targetBlock();
            a && a.unplug()
        }
        this.disposed = !0
    }
    ;
    F.prototype.getSourceBlock = function() {
        return this.sourceBlock_
    }
    ;
    F.prototype.isSuperior = function() {
        return this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE || this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT
    }
    ;
    F.prototype.isConnected = function() {
        return !!this.targetConnection
    }
    ;
    F.prototype.getConnectionChecker = function() {
        return this.sourceBlock_.workspace.connectionChecker
    }
    ;
    F.prototype.onFailedConnect = function(a) {}
    ;
    F.prototype.connect = function(a) {
        if (this.targetConnection === a)
            return !0;
        if (this.getConnectionChecker().canConnect(this, a, !1)) {
            var b = (0,
            h.getGroup)();
            b || (0,
            h.setGroup)(!0);
            this.isSuperior() ? this.connect_(a) : a.connect_(this);
            b || (0,
            h.setGroup)(!1)
        }
        return this.isConnected()
    }
    ;
    var hf = function(a, b) {
        var c = null;
        b = b.outputConnection;
        for (var d = b.getConnectionChecker(), f = 0, g; g = a.inputList[f]; f++)
            if ((g = g.connection) && d.canConnect(b, g, !1)) {
                if (c)
                    return null;
                c = g
            }
        return c
    };
    F.getConnectionForOrphanedConnection = function(a, b) {
        if (b.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE) {
            a: {
                b = b.getSourceBlock();
                for (var c; c = hf(a, b); )
                    if (a = c.targetBlock(),
                    !a || a.isShadow()) {
                        b = c;
                        break a
                    }
                b = null
            }
            return b
        }
        a = a.lastConnectionInStack(!0);
        c = b.getConnectionChecker();
        return a && c.canConnect(b, a, !1) ? a : null
    }
    ;
    F.prototype.disconnect = function() {
        var a = this.targetConnection;
        if (!a)
            throw Error("Source connection not connected.");
        if (a.targetConnection !== this)
            throw Error("Target connection not connected to source connection.");
        if (this.isSuperior()) {
            var b = this.sourceBlock_
              , c = a.getSourceBlock();
            a = this
        } else
            b = a.getSourceBlock(),
            c = this.sourceBlock_;
        var d = (0,
        h.getGroup)();
        d || (0,
        h.setGroup)(!0);
        this.disconnectInternal_(b, c);
        c.isShadow() || a.respawnShadow_();
        d || (0,
        h.setGroup)(!1)
    }
    ;
    F.prototype.disconnectInternal_ = function(a, b) {
        var c;
        (0,
        h.isEnabled)() && (c = new ((0,
        h.get)(h.MOVE))(b));
        this.targetConnection = this.targetConnection.targetConnection = null;
        b.setParent(null);
        c && (c.recordNew(),
        (0,
        h.fire)(c))
    }
    ;
    F.prototype.respawnShadow_ = function() {
        this.createShadowBlock_(!0)
    }
    ;
    F.prototype.targetBlock = function() {
        return this.isConnected() ? this.targetConnection.getSourceBlock() : null
    }
    ;
    F.prototype.onCheckChanged_ = function() {
        !this.isConnected() || this.targetConnection && this.getConnectionChecker().canConnect(this, this.targetConnection, !1) || (this.isSuperior() ? this.targetBlock() : this.sourceBlock_).unplug()
    }
    ;
    F.prototype.setCheck = function(a) {
        a ? (Array.isArray(a) || (a = [a]),
        this.check_ = a,
        this.onCheckChanged_()) : this.check_ = null;
        return this
    }
    ;
    F.prototype.getCheck = function() {
        return this.check_
    }
    ;
    F.prototype.setShadowDom = function(a) {
        this.setShadowStateInternal_({
            shadowDom: a
        })
    }
    ;
    F.prototype.getShadowDom = function(a) {
        return a && this.targetBlock().isShadow() ? (0,
        e.module$exports$Blockly$Xml.blockToDom)(this.targetBlock()) : this.shadowDom_
    }
    ;
    F.prototype.setShadowState = function(a) {
        this.setShadowStateInternal_({
            shadowState: a
        })
    }
    ;
    F.prototype.getShadowState = function(a) {
        return a && this.targetBlock() && this.targetBlock().isShadow() ? (0,
        Sa.save)(this.targetBlock()) : this.shadowState_
    }
    ;
    F.prototype.neighbours = function(a) {
        return []
    }
    ;
    F.prototype.getParentInput = function() {
        for (var a = null, b = this.sourceBlock_.inputList, c = 0; c < b.length; c++)
            if (b[c].connection === this) {
                a = b[c];
                break
            }
        return a
    }
    ;
    F.prototype.toString = function() {
        var a = this.sourceBlock_;
        if (!a)
            return "Orphan Connection";
        if (a.outputConnection === this)
            var b = "Output Connection of ";
        else if (a.previousConnection === this)
            b = "Previous Connection of ";
        else if (a.nextConnection === this)
            b = "Next Connection of ";
        else {
            b = null;
            for (var c = 0, d; d = a.inputList[c]; c++)
                if (d.connection === this) {
                    b = d;
                    break
                }
            if (b)
                b = 'Input "' + b.name + '" connection on ';
            else
                return console.warn("Connection not actually connected to sourceBlock_"),
                "Orphan Connection"
        }
        return b + a.toDevString()
    }
    ;
    F.prototype.stashShadowState_ = function() {
        var a = this.getShadowDom(!0)
          , b = this.getShadowState(!0);
        this.shadowState_ = this.shadowDom_ = null;
        return {
            shadowDom: a,
            shadowState: b
        }
    }
    ;
    F.prototype.applyShadowState_ = function(a) {
        var b = a.shadowState;
        this.shadowDom_ = a.shadowDom;
        this.shadowState_ = b
    }
    ;
    F.prototype.setShadowStateInternal_ = function(a) {
        a = void 0 === a ? {} : a;
        var b = void 0 === a.shadowState ? null : a.shadowState;
        this.shadowDom_ = void 0 === a.shadowDom ? null : a.shadowDom;
        this.shadowState_ = b;
        (a = this.targetBlock()) ? a.isShadow() ? (a.dispose(!1),
        this.respawnShadow_(),
        this.targetBlock() && this.targetBlock().isShadow() && this.serializeShadow_(this.targetBlock())) : (a = this.createShadowBlock_(!1),
        this.serializeShadow_(a),
        a && a.dispose(!1)) : (this.respawnShadow_(),
        this.targetBlock() && this.targetBlock().isShadow() && this.serializeShadow_(this.targetBlock()))
    }
    ;
    F.prototype.createShadowBlock_ = function(a) {
        var b = this.getSourceBlock()
          , c = this.getShadowState()
          , d = this.getShadowDom();
        if (!b.workspace || !c && !d)
            return null;
        if (c)
            return (0,
            Sa.appendInternal)(c, b.workspace, {
                parentConnection: a ? this : void 0,
                isShadow: !0,
                recordUndo: !1
            });
        if (d) {
            b = (0,
            e.module$exports$Blockly$Xml.domToBlock)(d, b.workspace);
            if (a)
                if (this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE) {
                    if (!b.outputConnection)
                        throw Error("Shadow block is missing an output connection");
                    if (!this.connect(b.outputConnection))
                        throw Error("Could not connect shadow block to connection");
                } else if (this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT) {
                    if (!b.previousConnection)
                        throw Error("Shadow block is missing previous connection");
                    if (!this.connect(b.previousConnection))
                        throw Error("Could not connect shadow block to connection");
                } else
                    throw Error("Cannot connect a shadow block to a previous/output connection");
            return b
        }
        return null
    }
    ;
    F.prototype.serializeShadow_ = function(a) {
        a && (this.shadowDom_ = (0,
        e.module$exports$Blockly$Xml.blockToDom)(a),
        this.shadowState_ = (0,
        Sa.save)(a))
    }
    ;
    var ec = function() {};
    ec.prototype.canConnect = function(a, b, c, d) {
        return this.canConnectWithReason(a, b, c, d) === F.CAN_CONNECT
    }
    ;
    ec.prototype.canConnectWithReason = function(a, b, c, d) {
        var f = this.doSafetyChecks(a, b);
        return f !== F.CAN_CONNECT ? f : this.doTypeChecks(a, b) ? c && !this.doDragChecks(a, b, d || 0) ? F.REASON_DRAG_CHECKS_FAILED : F.CAN_CONNECT : F.REASON_CHECKS_FAILED
    }
    ;
    ec.prototype.getErrorMessage = function(a, b, c) {
        switch (a) {
        case F.REASON_SELF_CONNECTION:
            return "Attempted to connect a block to itself.";
        case F.REASON_DIFFERENT_WORKSPACES:
            return "Blocks not on same workspace.";
        case F.REASON_WRONG_TYPE:
            return "Attempt to connect incompatible types.";
        case F.REASON_TARGET_NULL:
            return "Target connection is null.";
        case F.REASON_CHECKS_FAILED:
            return "Connection checks failed. " + (b + " expected " + b.getCheck() + ", found " + c.getCheck());
        case F.REASON_SHADOW_PARENT:
            return "Connecting non-shadow to shadow block.";
        case F.REASON_DRAG_CHECKS_FAILED:
            return "Drag checks failed.";
        case F.REASON_PREVIOUS_AND_OUTPUT:
            return "Block would have an output and a previous connection.";
        default:
            return "Unknown connection failure: this should never happen!"
        }
    }
    ;
    ec.prototype.doSafetyChecks = function(a, b) {
        if (!a || !b)
            return F.REASON_TARGET_NULL;
        if (a.isSuperior())
            var c = a.getSourceBlock()
              , d = b.getSourceBlock()
              , f = b;
        else
            d = a.getSourceBlock(),
            c = b.getSourceBlock(),
            f = a,
            a = b;
        return c === d ? F.REASON_SELF_CONNECTION : f.type !== e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[a.type] ? F.REASON_WRONG_TYPE : c.workspace !== d.workspace ? F.REASON_DIFFERENT_WORKSPACES : c.isShadow() && !d.isShadow() ? F.REASON_SHADOW_PARENT : f.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE && d.previousConnection && d.previousConnection.isConnected() || f.type === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT && d.outputConnection && d.outputConnection.isConnected() ? F.REASON_PREVIOUS_AND_OUTPUT : F.CAN_CONNECT
    }
    ;
    ec.prototype.doTypeChecks = function(a, b) {
        a = a.getCheck();
        b = b.getCheck();
        if (!a || !b)
            return !0;
        for (var c = 0; c < a.length; c++)
            if (-1 !== b.indexOf(a[c]))
                return !0;
        return !1
    }
    ;
    ec.prototype.doDragChecks = function(a, b, c) {
        if (a.distanceFrom(b) > c || b.getSourceBlock().isInsertionMarker())
            return !1;
        switch (b.type) {
        case e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT:
            return this.canConnectToPrevious_(a, b);
        case e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE:
            if (b.isConnected() && !b.targetBlock().isInsertionMarker() || a.isConnected())
                return !1;
            break;
        case e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE:
            if (b.isConnected() && !b.targetBlock().isMovable() && !b.targetBlock().isShadow())
                return !1;
            break;
        case e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT:
            if (b.isConnected() && !a.getSourceBlock().nextConnection && !b.targetBlock().isShadow() && b.targetBlock().nextConnection)
                return !1;
            break;
        default:
            return !1
        }
        return -1 !== e.module$exports$Blockly$common.draggingConnections.indexOf(b) ? !1 : !0
    }
    ;
    ec.prototype.canConnectToPrevious_ = function(a, b) {
        if (a.targetConnection || -1 !== e.module$exports$Blockly$common.draggingConnections.indexOf(b))
            return !1;
        if (!b.targetConnection)
            return !0;
        a = b.targetBlock();
        return a.isInsertionMarker() ? !a.getPreviousBlock() : !1
    }
    ;
    (0,
    r.register)(r.Type.CONNECTION_CHECKER, r.DEFAULT, ec);
    var I = {}
      , $c = Object.create(null);
    I.Workspace = function(a) {
        this.id = (0,
        Va.genUid)();
        $c[this.id] = this;
        this.options = a || new gb.Options({});
        this.RTL = !!this.options.RTL;
        this.horizontalLayout = !!this.options.horizontalLayout;
        this.toolboxPosition = this.options.toolboxPosition;
        this.connectionChecker = new ((0,
        r.getClassFromOptions)(r.Type.CONNECTION_CHECKER, this.options, !0))(this);
        this.topBlocks_ = [];
        this.topComments_ = [];
        this.commentDB_ = Object.create(null);
        this.listeners_ = [];
        this.undoStack_ = [];
        this.redoStack_ = [];
        this.blockDB_ = Object.create(null);
        this.typedBlocksDB_ = Object.create(null);
        this.variableMap_ = new Ta(this);
        this.potentialVariableMap_ = null
    }
    ;
    I.Workspace.prototype.rendered = !1;
    I.Workspace.prototype.isClearing = !1;
    I.Workspace.prototype.MAX_UNDO = 1024;
    I.Workspace.prototype.connectionDBList = null;
    I.Workspace.prototype.dispose = function() {
        this.listeners_.length = 0;
        this.clear();
        delete $c[this.id]
    }
    ;
    I.Workspace.SCAN_ANGLE = 3;
    I.Workspace.prototype.sortObjects_ = function(a, b) {
        a = a.getRelativeToSurfaceXY();
        b = b.getRelativeToSurfaceXY();
        return a.y + I.Workspace.prototype.sortObjects_.offset * a.x - (b.y + I.Workspace.prototype.sortObjects_.offset * b.x)
    }
    ;
    I.Workspace.prototype.addTopBlock = function(a) {
        this.topBlocks_.push(a)
    }
    ;
    I.Workspace.prototype.removeTopBlock = function(a) {
        if (!(0,
        sb)(this.topBlocks_, a))
            throw Error("Block not present in workspace's list of top-most blocks.");
    }
    ;
    I.Workspace.prototype.getTopBlocks = function(a) {
        var b = [].concat(this.topBlocks_);
        a && 1 < b.length && (this.sortObjects_.offset = Math.sin((0,
        xb.toRadians)(I.Workspace.SCAN_ANGLE)),
        this.RTL && (this.sortObjects_.offset *= -1),
        b.sort(this.sortObjects_));
        return b
    }
    ;
    I.Workspace.prototype.addTypedBlock = function(a) {
        this.typedBlocksDB_[a.type] || (this.typedBlocksDB_[a.type] = []);
        this.typedBlocksDB_[a.type].push(a)
    }
    ;
    I.Workspace.prototype.removeTypedBlock = function(a) {
        (0,
        sb)(this.typedBlocksDB_[a.type], a);
        this.typedBlocksDB_[a.type].length || delete this.typedBlocksDB_[a.type]
    }
    ;
    I.Workspace.prototype.getBlocksByType = function(a, b) {
        if (!this.typedBlocksDB_[a])
            return [];
        a = this.typedBlocksDB_[a].slice(0);
        b && 1 < a.length && (this.sortObjects_.offset = Math.sin((0,
        xb.toRadians)(I.Workspace.SCAN_ANGLE)),
        this.RTL && (this.sortObjects_.offset *= -1),
        a.sort(this.sortObjects_));
        return a.filter(function(c) {
            return !c.isInsertionMarker()
        })
    }
    ;
    I.Workspace.prototype.addTopComment = function(a) {
        this.topComments_.push(a);
        this.commentDB_[a.id] && console.warn('Overriding an existing comment on this workspace, with id "' + a.id + '"');
        this.commentDB_[a.id] = a
    }
    ;
    I.Workspace.prototype.removeTopComment = function(a) {
        if (!(0,
        sb)(this.topComments_, a))
            throw Error("Comment not present in workspace's list of top-most comments.");
        delete this.commentDB_[a.id]
    }
    ;
    I.Workspace.prototype.getTopComments = function(a) {
        var b = [].concat(this.topComments_);
        a && 1 < b.length && (this.sortObjects_.offset = Math.sin((0,
        xb.toRadians)(I.Workspace.SCAN_ANGLE)),
        this.RTL && (this.sortObjects_.offset *= -1),
        b.sort(this.sortObjects_));
        return b
    }
    ;
    I.Workspace.prototype.getAllBlocks = function(a) {
        if (a) {
            var b = this.getTopBlocks(!0);
            a = [];
            for (var c = 0; c < b.length; c++)
                a.push.apply(a, b[c].getDescendants(!0))
        } else
            for (a = this.getTopBlocks(!1),
            b = 0; b < a.length; b++)
                a.push.apply(a, a[b].getChildren(!1));
        return a.filter(function(d) {
            return !d.isInsertionMarker()
        })
    }
    ;
    I.Workspace.prototype.clear = function() {
        this.isClearing = !0;
        try {
            var a = (0,
            h.getGroup)();
            for (a || (0,
            h.setGroup)(!0); this.topBlocks_.length; )
                this.topBlocks_[0].dispose(!1);
            for (; this.topComments_.length; )
                this.topComments_[this.topComments_.length - 1].dispose();
            a || (0,
            h.setGroup)(!1);
            this.variableMap_.clear();
            this.potentialVariableMap_ && this.potentialVariableMap_.clear()
        } finally {
            this.isClearing = !1
        }
    }
    ;
    I.Workspace.prototype.renameVariableById = function(a, b) {
        this.variableMap_.renameVariableById(a, b)
    }
    ;
    I.Workspace.prototype.createVariable = function(a, b, c) {
        return this.variableMap_.createVariable(a, b, c)
    }
    ;
    I.Workspace.prototype.getVariableUsesById = function(a) {
        return this.variableMap_.getVariableUsesById(a)
    }
    ;
    I.Workspace.prototype.deleteVariableById = function(a) {
        this.variableMap_.deleteVariableById(a)
    }
    ;
    I.Workspace.prototype.getVariable = function(a, b) {
        return this.variableMap_.getVariable(a, b)
    }
    ;
    I.Workspace.prototype.getVariableById = function(a) {
        return this.variableMap_.getVariableById(a)
    }
    ;
    I.Workspace.prototype.getVariablesOfType = function(a) {
        return this.variableMap_.getVariablesOfType(a)
    }
    ;
    I.Workspace.prototype.getVariableTypes = function() {
        return this.variableMap_.getVariableTypes(this)
    }
    ;
    I.Workspace.prototype.getAllVariables = function() {
        return this.variableMap_.getAllVariables()
    }
    ;
    I.Workspace.prototype.getAllVariableNames = function() {
        return this.variableMap_.getAllVariableNames()
    }
    ;
    I.Workspace.prototype.getWidth = function() {
        return 0
    }
    ;
    I.Workspace.prototype.newBlock = function(a, b) {
        return new A.Block(this,a,b)
    }
    ;
    I.Workspace.prototype.remainingCapacity = function() {
        return isNaN(this.options.maxBlocks) ? Infinity : this.options.maxBlocks - this.getAllBlocks(!1).length
    }
    ;
    I.Workspace.prototype.remainingCapacityOfType = function(a) {
        return this.options.maxInstances ? (void 0 !== this.options.maxInstances[a] ? this.options.maxInstances[a] : Infinity) - this.getBlocksByType(a, !1).length : Infinity
    }
    ;
    I.Workspace.prototype.isCapacityAvailable = function(a) {
        if (!this.hasBlockLimits())
            return !0;
        var b = 0, c;
        for (c in a) {
            if (a[c] > this.remainingCapacityOfType(c))
                return !1;
            b += a[c]
        }
        return b > this.remainingCapacity() ? !1 : !0
    }
    ;
    I.Workspace.prototype.hasBlockLimits = function() {
        return Infinity !== this.options.maxBlocks || !!this.options.maxInstances
    }
    ;
    I.Workspace.prototype.getUndoStack = function() {
        return this.undoStack_
    }
    ;
    I.Workspace.prototype.getRedoStack = function() {
        return this.redoStack_
    }
    ;
    I.Workspace.prototype.undo = function(a) {
        var b = a ? this.redoStack_ : this.undoStack_
          , c = a ? this.undoStack_ : this.redoStack_
          , d = b.pop();
        if (d) {
            for (var f = [d]; b.length && d.group && d.group === b[b.length - 1].group; )
                f.push(b.pop());
            for (b = 0; b < f.length; b++)
                c.push(f[b]);
            f = (0,
            h.filter)(f, a);
            (0,
            h.setRecordUndo)(!1);
            try {
                for (c = 0; c < f.length; c++)
                    f[c].run(a)
            } finally {
                (0,
                h.setRecordUndo)(!0)
            }
        }
    }
    ;
    I.Workspace.prototype.clearUndo = function() {
        this.undoStack_.length = 0;
        this.redoStack_.length = 0;
        (0,
        h.clearPendingUndo)()
    }
    ;
    I.Workspace.prototype.addChangeListener = function(a) {
        this.listeners_.push(a);
        return a
    }
    ;
    I.Workspace.prototype.removeChangeListener = function(a) {
        (0,
        sb)(this.listeners_, a)
    }
    ;
    I.Workspace.prototype.fireChangeListener = function(a) {
        if (a.recordUndo)
            for (this.undoStack_.push(a),
            this.redoStack_.length = 0; this.undoStack_.length > this.MAX_UNDO && 0 <= this.MAX_UNDO; )
                this.undoStack_.shift();
        for (var b = 0; b < this.listeners_.length; b++)
            (0,
            this.listeners_[b])(a)
    }
    ;
    I.Workspace.prototype.getBlockById = function(a) {
        return this.blockDB_[a] || null
    }
    ;
    I.Workspace.prototype.setBlockById = function(a, b) {
        this.blockDB_[a] = b
    }
    ;
    I.Workspace.prototype.removeBlockById = function(a) {
        delete this.blockDB_[a]
    }
    ;
    I.Workspace.prototype.getCommentById = function(a) {
        return this.commentDB_[a] || null
    }
    ;
    I.Workspace.prototype.allInputsFilled = function(a) {
        for (var b = this.getTopBlocks(!1), c = 0; c < b.length; c++)
            if (!b[c].allInputsFilled(a))
                return !1;
        return !0
    }
    ;
    I.Workspace.prototype.getPotentialVariableMap = function() {
        return this.potentialVariableMap_
    }
    ;
    I.Workspace.prototype.createPotentialVariableMap = function() {
        this.potentialVariableMap_ = new Ta(this)
    }
    ;
    I.Workspace.prototype.getVariableMap = function() {
        return this.variableMap_
    }
    ;
    I.Workspace.prototype.setVariableMap = function(a) {
        this.variableMap_ = a
    }
    ;
    I.Workspace.getById = function(a) {
        return $c[a] || null
    }
    ;
    I.Workspace.getAll = function() {
        var a = [], b;
        for (b in $c)
            a.push($c[b]);
        return a
    }
    ;
    var C = {
        Bubble: function(a, b, c, d, f, g) {
            this.workspace_ = a;
            this.content_ = b;
            this.shape_ = c;
            this.onMouseDownResizeWrapper_ = this.onMouseDownBubbleWrapper_ = this.moveCallback_ = this.resizeCallback_ = null;
            this.disposed = !1;
            c = C.Bubble.ARROW_ANGLE;
            this.workspace_.RTL && (c = -c);
            this.arrow_radians_ = (0,
            xb.toRadians)(c);
            a.getBubbleCanvas().appendChild(this.createDom_(b, !(!f || !g)));
            this.setAnchorLocation(d);
            f && g || (a = this.content_.getBBox(),
            f = a.width + 2 * C.Bubble.BORDER_WIDTH,
            g = a.height + 2 * C.Bubble.BORDER_WIDTH);
            this.setBubbleSize(f, g);
            this.positionBubble_();
            this.renderArrow_();
            this.rendered_ = !0
        }
    };
    C.Bubble.BORDER_WIDTH = 6;
    C.Bubble.ARROW_THICKNESS = 5;
    C.Bubble.ARROW_ANGLE = 20;
    C.Bubble.ARROW_BEND = 4;
    C.Bubble.ANCHOR_RADIUS = 8;
    C.Bubble.onMouseUpWrapper_ = null;
    C.Bubble.onMouseMoveWrapper_ = null;
    C.Bubble.unbindDragEvents_ = function() {
        C.Bubble.onMouseUpWrapper_ && ((0,
        u.unbind)(C.Bubble.onMouseUpWrapper_),
        C.Bubble.onMouseUpWrapper_ = null);
        C.Bubble.onMouseMoveWrapper_ && ((0,
        u.unbind)(C.Bubble.onMouseMoveWrapper_),
        C.Bubble.onMouseMoveWrapper_ = null)
    }
    ;
    C.Bubble.bubbleMouseUp_ = function(a) {
        (0,
        N.clearTouchIdentifier)();
        C.Bubble.unbindDragEvents_()
    }
    ;
    C.Bubble.prototype.rendered_ = !1;
    C.Bubble.prototype.anchorXY_ = null;
    C.Bubble.prototype.relativeLeft_ = 0;
    C.Bubble.prototype.relativeTop_ = 0;
    C.Bubble.prototype.width_ = 0;
    C.Bubble.prototype.height_ = 0;
    C.Bubble.prototype.autoLayout_ = !0;
    C.Bubble.prototype.createDom_ = function(a, b) {
        this.bubbleGroup_ = (0,
        l.createSvgElement)(q.G, {}, null);
        var c = {
            filter: "url(#" + this.workspace_.getRenderer().getConstants().embossFilterId + ")"
        };
        O.JAVA_FX && (c = {});
        c = (0,
        l.createSvgElement)(q.G, c, this.bubbleGroup_);
        this.bubbleArrow_ = (0,
        l.createSvgElement)(q.PATH, {}, c);
        this.bubbleBack_ = (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyDraggable",
            x: 0,
            y: 0,
            rx: C.Bubble.BORDER_WIDTH,
            ry: C.Bubble.BORDER_WIDTH
        }, c);
        b ? (this.resizeGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": this.workspace_.RTL ? "blocklyResizeSW" : "blocklyResizeSE"
        }, this.bubbleGroup_),
        b = 2 * C.Bubble.BORDER_WIDTH,
        (0,
        l.createSvgElement)(q.POLYGON, {
            points: "0,x x,x x,0".replace(/x/g, b.toString())
        }, this.resizeGroup_),
        (0,
        l.createSvgElement)(q.LINE, {
            "class": "blocklyResizeLine",
            x1: b / 3,
            y1: b - 1,
            x2: b - 1,
            y2: b / 3
        }, this.resizeGroup_),
        (0,
        l.createSvgElement)(q.LINE, {
            "class": "blocklyResizeLine",
            x1: 2 * b / 3,
            y1: b - 1,
            x2: b - 1,
            y2: 2 * b / 3
        }, this.resizeGroup_)) : this.resizeGroup_ = null;
        this.workspace_.options.readOnly || (this.onMouseDownBubbleWrapper_ = (0,
        u.conditionalBind)(this.bubbleBack_, "mousedown", this, this.bubbleMouseDown_),
        this.resizeGroup_ && (this.onMouseDownResizeWrapper_ = (0,
        u.conditionalBind)(this.resizeGroup_, "mousedown", this, this.resizeMouseDown_)));
        this.bubbleGroup_.appendChild(a);
        return this.bubbleGroup_
    }
    ;
    C.Bubble.prototype.getSvgRoot = function() {
        return this.bubbleGroup_
    }
    ;
    C.Bubble.prototype.setSvgId = function(a) {
        this.bubbleGroup_.dataset && (this.bubbleGroup_.dataset.blockId = a)
    }
    ;
    C.Bubble.prototype.bubbleMouseDown_ = function(a) {
        var b = this.workspace_.getGesture(a);
        b && b.handleBubbleStart(a, this)
    }
    ;
    C.Bubble.prototype.showContextMenu = function(a) {}
    ;
    C.Bubble.prototype.isDeletable = function() {
        return !1
    }
    ;
    C.Bubble.prototype.setDeleteStyle = function(a) {}
    ;
    C.Bubble.prototype.resizeMouseDown_ = function(a) {
        this.promote();
        C.Bubble.unbindDragEvents_();
        (0,
        u.isRightButton)(a) || (this.workspace_.startDrag(a, new E(this.workspace_.RTL ? -this.width_ : this.width_,this.height_)),
        C.Bubble.onMouseUpWrapper_ = (0,
        u.conditionalBind)(document, "mouseup", this, C.Bubble.bubbleMouseUp_),
        C.Bubble.onMouseMoveWrapper_ = (0,
        u.conditionalBind)(document, "mousemove", this, this.resizeMouseMove_),
        this.workspace_.hideChaff());
        a.stopPropagation()
    }
    ;
    C.Bubble.prototype.resizeMouseMove_ = function(a) {
        this.autoLayout_ = !1;
        a = this.workspace_.moveDrag(a);
        this.setBubbleSize(this.workspace_.RTL ? -a.x : a.x, a.y);
        this.workspace_.RTL && this.positionBubble_()
    }
    ;
    C.Bubble.prototype.registerResizeEvent = function(a) {
        this.resizeCallback_ = a
    }
    ;
    C.Bubble.prototype.registerMoveEvent = function(a) {
        this.moveCallback_ = a
    }
    ;
    C.Bubble.prototype.promote = function() {
        var a = this.bubbleGroup_.parentNode;
        return a.lastChild !== this.bubbleGroup_ ? (a.appendChild(this.bubbleGroup_),
        !0) : !1
    }
    ;
    C.Bubble.prototype.setAnchorLocation = function(a) {
        this.anchorXY_ = a;
        this.rendered_ && this.positionBubble_()
    }
    ;
    C.Bubble.prototype.layoutBubble_ = function() {
        var a = this.workspace_.getMetricsManager().getViewMetrics(!0)
          , b = this.getOptimalRelativeLeft_(a)
          , c = this.getOptimalRelativeTop_(a)
          , d = this.shape_.getBBox()
          , f = {
            x: b,
            y: -this.height_ - this.workspace_.getRenderer().getConstants().MIN_BLOCK_HEIGHT
        }
          , g = {
            x: -this.width_ - 30,
            y: c
        };
        c = {
            x: d.width,
            y: c
        };
        var k = {
            x: b,
            y: d.height
        };
        b = d.width < d.height ? c : k;
        d = d.width < d.height ? k : c;
        c = this.getOverlap_(f, a);
        k = this.getOverlap_(g, a);
        var n = this.getOverlap_(b, a);
        a = this.getOverlap_(d, a);
        a = Math.max(c, k, n, a);
        c === a ? (this.relativeLeft_ = f.x,
        this.relativeTop_ = f.y) : k === a ? (this.relativeLeft_ = g.x,
        this.relativeTop_ = g.y) : n === a ? (this.relativeLeft_ = b.x,
        this.relativeTop_ = b.y) : (this.relativeLeft_ = d.x,
        this.relativeTop_ = d.y)
    }
    ;
    C.Bubble.prototype.getOverlap_ = function(a, b) {
        var c = this.workspace_.RTL ? this.anchorXY_.x - a.x - this.width_ : a.x + this.anchorXY_.x;
        a = a.y + this.anchorXY_.y;
        return Math.max(0, Math.min(1, (Math.min(c + this.width_, b.left + b.width) - Math.max(c, b.left)) * (Math.min(a + this.height_, b.top + b.height) - Math.max(a, b.top)) / (this.width_ * this.height_)))
    }
    ;
    C.Bubble.prototype.getOptimalRelativeLeft_ = function(a) {
        var b = -this.width_ / 4;
        if (this.width_ > a.width)
            return b;
        if (this.workspace_.RTL) {
            var c = this.anchorXY_.x - b
              , d = a.left + a.width;
            a = a.left + G.Scrollbar.scrollbarThickness / this.workspace_.scale;
            c - this.width_ < a ? b = -(a - this.anchorXY_.x + this.width_) : c > d && (b = -(d - this.anchorXY_.x))
        } else {
            c = b + this.anchorXY_.x;
            d = c + this.width_;
            var f = a.left;
            a = a.left + a.width - G.Scrollbar.scrollbarThickness / this.workspace_.scale;
            c < f ? b = f - this.anchorXY_.x : d > a && (b = a - this.anchorXY_.x - this.width_)
        }
        return b
    }
    ;
    C.Bubble.prototype.getOptimalRelativeTop_ = function(a) {
        var b = -this.height_ / 4;
        if (this.height_ > a.height)
            return b;
        var c = this.anchorXY_.y + b
          , d = c + this.height_
          , f = a.top;
        a = a.top + a.height - G.Scrollbar.scrollbarThickness / this.workspace_.scale;
        var g = this.anchorXY_.y;
        c < f ? b = f - g : d > a && (b = a - g - this.height_);
        return b
    }
    ;
    C.Bubble.prototype.positionBubble_ = function() {
        var a = this.anchorXY_.x;
        a = this.workspace_.RTL ? a - (this.relativeLeft_ + this.width_) : a + this.relativeLeft_;
        this.moveTo(a, this.relativeTop_ + this.anchorXY_.y)
    }
    ;
    C.Bubble.prototype.moveTo = function(a, b) {
        this.bubbleGroup_.setAttribute("transform", "translate(" + a + "," + b + ")")
    }
    ;
    C.Bubble.prototype.setDragging = function(a) {
        !a && this.moveCallback_ && this.moveCallback_()
    }
    ;
    C.Bubble.prototype.getBubbleSize = function() {
        return new Ja(this.width_,this.height_)
    }
    ;
    C.Bubble.prototype.setBubbleSize = function(a, b) {
        var c = 2 * C.Bubble.BORDER_WIDTH;
        a = Math.max(a, c + 45);
        b = Math.max(b, c + 20);
        this.width_ = a;
        this.height_ = b;
        this.bubbleBack_.setAttribute("width", a);
        this.bubbleBack_.setAttribute("height", b);
        this.resizeGroup_ && (this.workspace_.RTL ? this.resizeGroup_.setAttribute("transform", "translate(" + 2 * C.Bubble.BORDER_WIDTH + "," + (b - c) + ") scale(-1 1)") : this.resizeGroup_.setAttribute("transform", "translate(" + (a - c) + "," + (b - c) + ")"));
        this.autoLayout_ && this.layoutBubble_();
        this.positionBubble_();
        this.renderArrow_();
        this.resizeCallback_ && this.resizeCallback_()
    }
    ;
    C.Bubble.prototype.renderArrow_ = function() {
        var a = []
          , b = this.width_ / 2
          , c = this.height_ / 2
          , d = -this.relativeLeft_
          , f = -this.relativeTop_;
        if (b === d && c === f)
            a.push("M " + b + "," + c);
        else {
            f -= c;
            d -= b;
            this.workspace_.RTL && (d *= -1);
            var g = Math.sqrt(f * f + d * d)
              , k = Math.acos(d / g);
            0 > f && (k = 2 * Math.PI - k);
            var n = k + Math.PI / 2;
            n > 2 * Math.PI && (n -= 2 * Math.PI);
            var x = Math.sin(n)
              , B = Math.cos(n)
              , P = this.getBubbleSize();
            n = (P.width + P.height) / C.Bubble.ARROW_THICKNESS;
            n = Math.min(n, P.width, P.height) / 4;
            P = 1 - C.Bubble.ANCHOR_RADIUS / g;
            d = b + P * d;
            f = c + P * f;
            P = b + n * B;
            var la = c + n * x;
            b -= n * B;
            c -= n * x;
            x = k + this.arrow_radians_;
            x > 2 * Math.PI && (x -= 2 * Math.PI);
            k = Math.sin(x) * g / C.Bubble.ARROW_BEND;
            g = Math.cos(x) * g / C.Bubble.ARROW_BEND;
            a.push("M" + P + "," + la);
            a.push("C" + (P + g) + "," + (la + k) + " " + d + "," + f + " " + d + "," + f);
            a.push("C" + d + "," + f + " " + (b + g) + "," + (c + k) + " " + b + "," + c)
        }
        a.push("z");
        this.bubbleArrow_.setAttribute("d", a.join(" "))
    }
    ;
    C.Bubble.prototype.setColour = function(a) {
        this.bubbleBack_.setAttribute("fill", a);
        this.bubbleArrow_.setAttribute("fill", a)
    }
    ;
    C.Bubble.prototype.dispose = function() {
        this.onMouseDownBubbleWrapper_ && (0,
        u.unbind)(this.onMouseDownBubbleWrapper_);
        this.onMouseDownResizeWrapper_ && (0,
        u.unbind)(this.onMouseDownResizeWrapper_);
        C.Bubble.unbindDragEvents_();
        (0,
        l.removeNode)(this.bubbleGroup_);
        this.disposed = !0
    }
    ;
    C.Bubble.prototype.moveDuringDrag = function(a, b) {
        a ? a.translateSurface(b.x, b.y) : this.moveTo(b.x, b.y);
        this.relativeLeft_ = this.workspace_.RTL ? this.anchorXY_.x - b.x - this.width_ : b.x - this.anchorXY_.x;
        this.relativeTop_ = b.y - this.anchorXY_.y;
        this.renderArrow_()
    }
    ;
    C.Bubble.prototype.getRelativeToSurfaceXY = function() {
        return new E(this.workspace_.RTL ? -this.relativeLeft_ + this.anchorXY_.x - this.width_ : this.anchorXY_.x + this.relativeLeft_,this.anchorXY_.y + this.relativeTop_)
    }
    ;
    C.Bubble.prototype.setAutoLayout = function(a) {
        this.autoLayout_ = a
    }
    ;
    C.Bubble.textToDom = function(a) {
        var b = (0,
        l.createSvgElement)(q.TEXT, {
            "class": "blocklyText blocklyBubbleText blocklyNoPointerEvents",
            y: C.Bubble.BORDER_WIDTH
        }, null);
        a = a.split("\n");
        for (var c = 0; c < a.length; c++) {
            var d = (0,
            l.createSvgElement)(q.TSPAN, {
                dy: "1em",
                x: C.Bubble.BORDER_WIDTH
            }, b)
              , f = document.createTextNode(a[c]);
            d.appendChild(f)
        }
        return b
    }
    ;
    C.Bubble.createNonEditableBubble = function(a, b, c) {
        c = new C.Bubble(b.workspace,a,b.pathObject.svgPath,c,null,null);
        c.setSvgId(b.id);
        if (b.RTL) {
            b = a.getBBox().width;
            for (var d = 0, f; f = a.childNodes[d]; d++)
                f.setAttribute("text-anchor", "end"),
                f.setAttribute("x", b + C.Bubble.BORDER_WIDTH)
        }
        return c
    }
    ;
    var ub = function(a) {
        this.commentId = (this.isBlank = "undefined" === typeof a) ? "" : a.id;
        this.workspaceId = this.isBlank ? "" : a.workspace.id;
        this.group = (0,
        h.getGroup)();
        this.recordUndo = (0,
        h.getRecordUndo)()
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ub, zb);
    ub.prototype.toJson = function() {
        var a = ub.superClass_.toJson.call(this);
        this.commentId && (a.commentId = this.commentId);
        return a
    }
    ;
    ub.prototype.fromJson = function(a) {
        ub.superClass_.fromJson.call(this, a);
        this.commentId = a.commentId
    }
    ;
    ub.CommentCreateDeleteHelper = function(a, b) {
        var c = a.getEventWorkspace_();
        b ? (b = (0,
        e.module$exports$Blockly$utils$xml.createElement)("xml"),
        b.appendChild(a.xml),
        (0,
        e.module$exports$Blockly$Xml.domToWorkspace)(b, c)) : (c = c.getCommentById(a.commentId)) ? c.dispose() : console.warn("Can't uncreate non-existent comment: " + a.commentId)
    }
    ;
    var vb = {
        CommentMove: function(a) {
            vb.CommentMove.superClass_.constructor.call(this, a);
            a && (this.comment_ = a,
            this.oldCoordinate_ = a.getXY(),
            this.newCoordinate_ = null)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(vb.CommentMove, ub);
    vb.CommentMove.prototype.recordNew = function() {
        if (!this.comment_)
            throw Error("Tried to record the new position of a comment on the same event twice.");
        this.newCoordinate_ = this.comment_.getXY();
        this.comment_ = null
    }
    ;
    vb.CommentMove.prototype.type = h.COMMENT_MOVE;
    vb.CommentMove.prototype.setOldCoordinate = function(a) {
        this.oldCoordinate_ = a
    }
    ;
    vb.CommentMove.prototype.toJson = function() {
        var a = vb.CommentMove.superClass_.toJson.call(this);
        this.oldCoordinate_ && (a.oldCoordinate = Math.round(this.oldCoordinate_.x) + "," + Math.round(this.oldCoordinate_.y));
        this.newCoordinate_ && (a.newCoordinate = Math.round(this.newCoordinate_.x) + "," + Math.round(this.newCoordinate_.y));
        return a
    }
    ;
    vb.CommentMove.prototype.fromJson = function(a) {
        vb.CommentMove.superClass_.fromJson.call(this, a);
        if (a.oldCoordinate) {
            var b = a.oldCoordinate.split(",");
            this.oldCoordinate_ = new E(Number(b[0]),Number(b[1]))
        }
        a.newCoordinate && (a = a.newCoordinate.split(","),
        this.newCoordinate_ = new E(Number(a[0]),Number(a[1])))
    }
    ;
    vb.CommentMove.prototype.isNull = function() {
        return E.equals(this.oldCoordinate_, this.newCoordinate_)
    }
    ;
    vb.CommentMove.prototype.run = function(a) {
        var b = this.getEventWorkspace_().getCommentById(this.commentId);
        if (b) {
            a = a ? this.newCoordinate_ : this.oldCoordinate_;
            var c = b.getXY();
            b.moveBy(a.x - c.x, a.y - c.y)
        } else
            console.warn("Can't move non-existent comment: " + this.commentId)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.COMMENT_MOVE, vb.CommentMove);
    var Ib = function(a, b) {
        this.draggingBubble_ = a;
        this.workspace_ = b;
        this.dragTarget_ = null;
        this.wouldDeleteBubble_ = !1;
        this.startXY_ = this.draggingBubble_.getRelativeToSurfaceXY();
        this.dragSurface_ = (0,
        ca.is3dSupported)() && b.getBlockDragSurface() ? b.getBlockDragSurface() : null
    };
    Ib.prototype.dispose = function() {
        this.dragSurface_ = this.workspace_ = this.draggingBubble_ = null
    }
    ;
    Ib.prototype.startBubbleDrag = function() {
        (0,
        h.getGroup)() || (0,
        h.setGroup)(!0);
        this.workspace_.setResizesEnabled(!1);
        this.draggingBubble_.setAutoLayout(!1);
        this.dragSurface_ && this.moveToDragSurface_();
        this.draggingBubble_.setDragging && this.draggingBubble_.setDragging(!0)
    }
    ;
    Ib.prototype.dragBubble = function(a, b) {
        b = this.pixelsToWorkspaceUnits_(b);
        b = E.sum(this.startXY_, b);
        this.draggingBubble_.moveDuringDrag(this.dragSurface_, b);
        b = this.dragTarget_;
        this.dragTarget_ = this.workspace_.getDragTarget(a);
        a = this.wouldDeleteBubble_;
        this.wouldDeleteBubble_ = this.shouldDelete_(this.dragTarget_);
        a !== this.wouldDeleteBubble_ && this.updateCursorDuringBubbleDrag_();
        this.dragTarget_ !== b && (b && b.onDragExit(this.draggingBubble_),
        this.dragTarget_ && this.dragTarget_.onDragEnter(this.draggingBubble_));
        this.dragTarget_ && this.dragTarget_.onDragOver(this.draggingBubble_)
    }
    ;
    Ib.prototype.shouldDelete_ = function(a) {
        return a && this.workspace_.getComponentManager().hasCapability(a.id, ia.Capability.DELETE_AREA) ? a.wouldDelete(this.draggingBubble_, !1) : !1
    }
    ;
    Ib.prototype.updateCursorDuringBubbleDrag_ = function() {
        this.draggingBubble_.setDeleteStyle(this.wouldDeleteBubble_)
    }
    ;
    Ib.prototype.endBubbleDrag = function(a, b) {
        this.dragBubble(a, b);
        this.dragTarget_ && this.dragTarget_.shouldPreventMove(this.draggingBubble_) ? a = this.startXY_ : (a = this.pixelsToWorkspaceUnits_(b),
        a = E.sum(this.startXY_, a));
        this.draggingBubble_.moveTo(a.x, a.y);
        if (this.dragTarget_)
            this.dragTarget_.onDrop(this.draggingBubble_);
        this.wouldDeleteBubble_ ? (this.fireMoveEvent_(),
        this.draggingBubble_.dispose(!1, !0)) : (this.dragSurface_ && this.dragSurface_.clearAndHide(this.workspace_.getBubbleCanvas()),
        this.draggingBubble_.setDragging && this.draggingBubble_.setDragging(!1),
        this.fireMoveEvent_());
        this.workspace_.setResizesEnabled(!0);
        (0,
        h.setGroup)(!1)
    }
    ;
    Ib.prototype.fireMoveEvent_ = function() {
        if (this.draggingBubble_.isComment) {
            var a = new ((0,
            h.get)(h.COMMENT_MOVE))(this.draggingBubble_);
            a.setOldCoordinate(this.startXY_);
            a.recordNew();
            (0,
            h.fire)(a)
        }
    }
    ;
    Ib.prototype.pixelsToWorkspaceUnits_ = function(a) {
        a = new E(a.x / this.workspace_.scale,a.y / this.workspace_.scale);
        this.workspace_.isMutator && a.scale(1 / this.workspace_.options.parentWorkspace.scale);
        return a
    }
    ;
    Ib.prototype.moveToDragSurface_ = function() {
        this.draggingBubble_.moveTo(0, 0);
        this.dragSurface_.translateSurface(this.startXY_.x, this.startXY_.y);
        this.dragSurface_.setBlocksAndShow(this.draggingBubble_.getSvgRoot())
    }
    ;
    var Mc = function(a) {
        this.workspace_ = a;
        this.horizontalScrollEnabled_ = this.workspace_.isMovableHorizontally();
        this.verticalScrollEnabled_ = this.workspace_.isMovableVertically();
        this.startScrollXY_ = new E(a.scrollX,a.scrollY)
    };
    Mc.prototype.dispose = function() {
        this.workspace_ = null
    }
    ;
    Mc.prototype.startDrag = function() {
        (0,
        e.module$exports$Blockly$common.getSelected)() && (0,
        e.module$exports$Blockly$common.getSelected)().unselect();
        this.workspace_.setupDragSurface()
    }
    ;
    Mc.prototype.endDrag = function(a) {
        this.drag(a);
        this.workspace_.resetDragSurface()
    }
    ;
    Mc.prototype.drag = function(a) {
        a = E.sum(this.startScrollXY_, a);
        if (this.horizontalScrollEnabled_ && this.verticalScrollEnabled_)
            this.workspace_.scroll(a.x, a.y);
        else if (this.horizontalScrollEnabled_)
            this.workspace_.scroll(a.x, this.workspace_.scrollY);
        else if (this.verticalScrollEnabled_)
            this.workspace_.scroll(this.workspace_.scrollX, a.y);
        else
            throw new TypeError("Invalid state.");
    }
    ;
    var ea = function(a) {
        (0,
        e.module$exports$Blockly$common.setSelected)(a);
        this.topBlock_ = a;
        this.workspace_ = a.workspace;
        this.lastMarker_ = this.lastOnStack_ = null;
        this.firstMarker_ = this.createMarkerBlock_(this.topBlock_);
        this.localConnection_ = this.closestConnection_ = null;
        this.wouldDeleteBlock_ = !1;
        this.fadedBlock_ = this.highlightedBlock_ = this.markerConnection_ = null;
        this.availableConnections_ = this.initAvailableConnections_()
    };
    ea.PREVIEW_TYPE = {
        INSERTION_MARKER: 0,
        INPUT_OUTLINE: 1,
        REPLACEMENT_FADE: 2
    };
    ea.DUPLICATE_BLOCK_ERROR = "The insertion marker manager tried to create a marker but the result is missing %1. If you are using a mutator, make sure your domToMutation method is properly defined.";
    ea.prototype.dispose = function() {
        this.availableConnections_.length = 0;
        (0,
        h.disable)();
        try {
            this.firstMarker_ && this.firstMarker_.dispose(),
            this.lastMarker_ && this.lastMarker_.dispose()
        } finally {
            (0,
            h.enable)()
        }
    }
    ;
    ea.prototype.updateAvailableConnections = function() {
        this.availableConnections_ = this.initAvailableConnections_()
    }
    ;
    ea.prototype.wouldDeleteBlock = function() {
        return this.wouldDeleteBlock_
    }
    ;
    ea.prototype.wouldConnectBlock = function() {
        return !!this.closestConnection_
    }
    ;
    ea.prototype.applyConnections = function() {
        if (this.closestConnection_ && ((0,
        h.disable)(),
        this.hidePreview_(),
        (0,
        h.enable)(),
        this.localConnection_.connect(this.closestConnection_),
        this.topBlock_.rendered)) {
            var a = this.localConnection_.isSuperior() ? this.closestConnection_ : this.localConnection_;
            (0,
            Hb.connectionUiEffect)(a.getSourceBlock());
            this.topBlock_.getRootBlock().bringToFront()
        }
    }
    ;
    ea.prototype.update = function(a, b) {
        var c = this.getCandidate_(a);
        if ((this.wouldDeleteBlock_ = this.shouldDelete_(c, b)) || this.shouldUpdatePreviews_(c, a))
            (0,
            h.disable)(),
            this.maybeHidePreview_(c),
            this.maybeShowPreview_(c),
            (0,
            h.enable)()
    }
    ;
    ea.prototype.createMarkerBlock_ = function(a) {
        var b = a.type;
        (0,
        h.disable)();
        try {
            var c = this.workspace_.newBlock(b);
            c.setInsertionMarker(!0);
            if (a.saveExtraState) {
                var d = a.saveExtraState();
                d && c.loadExtraState(d)
            } else if (a.mutationToDom) {
                var f = a.mutationToDom();
                f && c.domToMutation(f)
            }
            for (b = 0; b < a.inputList.length; b++) {
                var g = a.inputList[b];
                if (g.name !== dc.COLLAPSED_INPUT_NAME) {
                    var k = c.inputList[b];
                    if (!k)
                        throw Error(ea.DUPLICATE_BLOCK_ERROR.replace("%1", "an input"));
                    for (d = 0; d < g.fieldRow.length; d++) {
                        var n = g.fieldRow[d]
                          , x = k.fieldRow[d];
                        if (!x)
                            throw Error(ea.DUPLICATE_BLOCK_ERROR.replace("%1", "a field"));
                        x.setValue(n.getValue())
                    }
                }
            }
            c.setCollapsed(a.isCollapsed());
            c.setInputsInline(a.getInputsInline());
            c.initSvg();
            c.getSvgRoot().setAttribute("visibility", "hidden")
        } finally {
            (0,
            h.enable)()
        }
        return c
    }
    ;
    ea.prototype.initAvailableConnections_ = function() {
        var a = this.topBlock_.getConnections_(!1)
          , b = this.topBlock_.lastConnectionInStack(!0);
        if (b && b !== this.topBlock_.nextConnection) {
            a.push(b);
            this.lastOnStack_ = b;
            if (this.lastMarker_) {
                (0,
                h.disable)();
                try {
                    this.lastMarker_.dispose()
                } finally {
                    (0,
                    h.enable)()
                }
            }
            this.lastMarker_ = this.createMarkerBlock_(b.getSourceBlock())
        }
        return a
    }
    ;
    ea.prototype.shouldUpdatePreviews_ = function(a, b) {
        var c = a.local
          , d = a.closest;
        a = a.radius;
        if (c && d) {
            if (this.localConnection_ && this.closestConnection_) {
                if (this.closestConnection_ === d && this.localConnection_ === c)
                    return !1;
                c = this.localConnection_.x + b.x - this.closestConnection_.x;
                b = this.localConnection_.y + b.y - this.closestConnection_.y;
                b = Math.sqrt(c * c + b * b);
                return !(d && a > b - e.module$exports$Blockly$internalConstants.CURRENT_CONNECTION_PREFERENCE)
            }
            if (this.localConnection_ || this.closestConnection_)
                console.error("Only one of localConnection_ and closestConnection_ was set.");
            else
                return !0
        } else
            return !(!this.localConnection_ || !this.closestConnection_);
        console.error("Returning true from shouldUpdatePreviews, but it's not clear why.");
        return !0
    }
    ;
    ea.prototype.getCandidate_ = function(a) {
        for (var b = this.getStartRadius_(), c = null, d = null, f = 0; f < this.availableConnections_.length; f++) {
            var g = this.availableConnections_[f]
              , k = g.closest(b, a);
            k.connection && (c = k.connection,
            d = g,
            b = k.radius)
        }
        return {
            closest: c,
            local: d,
            radius: b
        }
    }
    ;
    ea.prototype.getStartRadius_ = function() {
        return e.module$exports$Blockly$internalConstants.SNAP_RADIUS
    }
    ;
    ea.prototype.shouldDelete_ = function(a, b) {
        return b && this.workspace_.getComponentManager().hasCapability(b.id, ia.Capability.DELETE_AREA) ? b.wouldDelete(this.topBlock_, a && !!a.closest) : !1
    }
    ;
    ea.prototype.maybeShowPreview_ = function(a) {
        if (!this.wouldDeleteBlock_) {
            var b = a.closest;
            a = a.local;
            b && (b === this.closestConnection_ || b.getSourceBlock().isInsertionMarker() ? console.log("Trying to connect to an insertion marker") : (this.closestConnection_ = b,
            this.localConnection_ = a,
            this.showPreview_()))
        }
    }
    ;
    ea.prototype.showPreview_ = function() {
        var a = this.closestConnection_
          , b = this.workspace_.getRenderer();
        switch (b.getConnectionPreviewMethod(a, this.localConnection_, this.topBlock_)) {
        case ea.PREVIEW_TYPE.INPUT_OUTLINE:
            this.showInsertionInputOutline_();
            break;
        case ea.PREVIEW_TYPE.INSERTION_MARKER:
            this.showInsertionMarker_();
            break;
        case ea.PREVIEW_TYPE.REPLACEMENT_FADE:
            this.showReplacementFade_()
        }
        a && b.shouldHighlightConnection(a) && a.highlight()
    }
    ;
    ea.prototype.maybeHidePreview_ = function(a) {
        if (a.closest) {
            var b = this.closestConnection_ !== a.closest;
            a = this.localConnection_ !== a.local;
            this.closestConnection_ && this.localConnection_ && (b || a || this.wouldDeleteBlock_) && this.hidePreview_()
        } else
            this.hidePreview_();
        this.localConnection_ = this.closestConnection_ = this.markerConnection_ = null
    }
    ;
    ea.prototype.hidePreview_ = function() {
        this.closestConnection_ && this.closestConnection_.targetBlock() && this.workspace_.getRenderer().shouldHighlightConnection(this.closestConnection_) && this.closestConnection_.unhighlight();
        this.fadedBlock_ ? this.hideReplacementFade_() : this.highlightedBlock_ ? this.hideInsertionInputOutline_() : this.markerConnection_ && this.hideInsertionMarker_()
    }
    ;
    ea.prototype.showInsertionMarker_ = function() {
        var a = this.localConnection_
          , b = this.closestConnection_
          , c = this.lastOnStack_ && a === this.lastOnStack_ ? this.lastMarker_ : this.firstMarker_;
        a = c.getMatchingConnection(a.getSourceBlock(), a);
        if (a === this.markerConnection_)
            throw Error("Made it to showInsertionMarker_ even though the marker isn't changing");
        c.render();
        c.rendered = !0;
        c.getSvgRoot().setAttribute("visibility", "visible");
        a && b && c.positionNearConnection(a, b);
        b && a.connect(b);
        this.markerConnection_ = a
    }
    ;
    ea.prototype.hideInsertionMarker_ = function() {
        if (this.markerConnection_) {
            var a = this.markerConnection_
              , b = a.getSourceBlock()
              , c = b.nextConnection
              , d = b.previousConnection
              , f = b.outputConnection;
            f = a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE && !(f && f.targetConnection);
            !(a !== c || d && d.targetConnection) || f ? a.targetBlock().unplug(!1) : a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT && a !== c ? (c = a.targetConnection,
            c.getSourceBlock().unplug(!1),
            d = d ? d.targetConnection : null,
            b.unplug(!0),
            d && d.connect(c)) : b.unplug(!0);
            if (a.targetConnection)
                throw Error("markerConnection_ still connected at the end of disconnectInsertionMarker");
            this.markerConnection_ = null;
            (a = b.getSvgRoot()) && a.setAttribute("visibility", "hidden")
        } else
            console.log("No insertion marker connection to disconnect")
    }
    ;
    ea.prototype.showInsertionInputOutline_ = function() {
        var a = this.closestConnection_;
        this.highlightedBlock_ = a.getSourceBlock();
        this.highlightedBlock_.highlightShapeForInput(a, !0)
    }
    ;
    ea.prototype.hideInsertionInputOutline_ = function() {
        this.highlightedBlock_.highlightShapeForInput(this.closestConnection_, !1);
        this.highlightedBlock_ = null
    }
    ;
    ea.prototype.showReplacementFade_ = function() {
        this.fadedBlock_ = this.closestConnection_.targetBlock();
        this.fadedBlock_.fadeForReplacement(!0)
    }
    ;
    ea.prototype.hideReplacementFade_ = function() {
        this.fadedBlock_.fadeForReplacement(!1);
        this.fadedBlock_ = null
    }
    ;
    ea.prototype.getInsertionMarkers = function() {
        var a = [];
        this.firstMarker_ && a.push(this.firstMarker_);
        this.lastMarker_ && a.push(this.lastMarker_);
        return a
    }
    ;
    var ob = {
        UiBase: function(a) {
            ob.UiBase.superClass_.constructor.call(this);
            this.isBlank = "undefined" === typeof a;
            this.workspaceId = a ? a : "";
            this.recordUndo = !1
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ob.UiBase, zb);
    ob.UiBase.prototype.isUiEvent = !0;
    var fc = {
        BlockDrag: function(a, b, c) {
            fc.BlockDrag.superClass_.constructor.call(this, a ? a.workspace.id : void 0);
            this.blockId = a ? a.id : null;
            this.isStart = b;
            this.blocks = c
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(fc.BlockDrag, ob.UiBase);
    fc.BlockDrag.prototype.type = h.BLOCK_DRAG;
    fc.BlockDrag.prototype.toJson = function() {
        var a = fc.BlockDrag.superClass_.toJson.call(this);
        a.isStart = this.isStart;
        a.blockId = this.blockId;
        a.blocks = this.blocks;
        return a
    }
    ;
    fc.BlockDrag.prototype.fromJson = function(a) {
        fc.BlockDrag.superClass_.fromJson.call(this, a);
        this.isStart = a.isStart;
        this.blockId = a.blockId;
        this.blocks = a.blocks
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.BLOCK_DRAG, fc.BlockDrag);
    var Ua = function(a, b) {
        this.draggingBlock_ = a;
        this.workspace_ = b;
        this.draggedConnectionManager_ = new ea(this.draggingBlock_);
        this.dragTarget_ = null;
        this.wouldDeleteBlock_ = !1;
        this.startXY_ = this.draggingBlock_.getRelativeToSurfaceXY();
        b = [];
        a = a.getDescendants(!1);
        for (var c = 0, d; d = a[c]; c++) {
            d = d.getIcons();
            for (var f = 0; f < d.length; f++) {
                var g = {
                    location: d[f].getIconLocation(),
                    icon: d[f]
                };
                b.push(g)
            }
        }
        this.dragIconData_ = b
    };
    Ua.prototype.dispose = function() {
        this.dragIconData_.length = 0;
        this.draggedConnectionManager_ && this.draggedConnectionManager_.dispose()
    }
    ;
    Ua.prototype.startDrag = function(a, b) {
        (0,
        h.getGroup)() || (0,
        h.setGroup)(!0);
        this.fireDragStartEvent_();
        this.workspace_.isMutator && this.draggingBlock_.bringToFront();
        (0,
        l.startTextWidthCache)();
        this.workspace_.setResizesEnabled(!1);
        (0,
        Hb.disconnectUiStop)();
        this.shouldDisconnect_(b) && this.disconnectBlock_(b, a);
        this.draggingBlock_.setDragging(!0);
        this.draggingBlock_.moveToDragSurface()
    }
    ;
    Ua.prototype.shouldDisconnect_ = function(a) {
        return !!(this.draggingBlock_.getParent() || a && this.draggingBlock_.nextConnection && this.draggingBlock_.nextConnection.targetBlock())
    }
    ;
    Ua.prototype.disconnectBlock_ = function(a, b) {
        this.draggingBlock_.unplug(a);
        a = this.pixelsToWorkspaceUnits_(b);
        a = E.sum(this.startXY_, a);
        this.draggingBlock_.translate(a.x, a.y);
        (0,
        Hb.disconnectUiEffect)(this.draggingBlock_);
        this.draggedConnectionManager_.updateAvailableConnections()
    }
    ;
    Ua.prototype.fireDragStartEvent_ = function() {
        var a = new ((0,
        h.get)(h.BLOCK_DRAG))(this.draggingBlock_,!0,this.draggingBlock_.getDescendants(!1));
        (0,
        h.fire)(a)
    }
    ;
    Ua.prototype.drag = function(a, b) {
        b = this.pixelsToWorkspaceUnits_(b);
        var c = E.sum(this.startXY_, b);
        this.draggingBlock_.moveDuringDrag(c);
        this.dragIcons_(b);
        c = this.dragTarget_;
        this.dragTarget_ = this.workspace_.getDragTarget(a);
        this.draggedConnectionManager_.update(b, this.dragTarget_);
        a = this.wouldDeleteBlock_;
        this.wouldDeleteBlock_ = this.draggedConnectionManager_.wouldDeleteBlock();
        a !== this.wouldDeleteBlock_ && this.updateCursorDuringBlockDrag_();
        this.dragTarget_ !== c && (c && c.onDragExit(this.draggingBlock_),
        this.dragTarget_ && this.dragTarget_.onDragEnter(this.draggingBlock_));
        this.dragTarget_ && this.dragTarget_.onDragOver(this.draggingBlock_)
    }
    ;
    Ua.prototype.endDrag = function(a, b) {
        this.drag(a, b);
        this.dragIconData_ = [];
        this.fireDragEndEvent_();
        (0,
        l.stopTextWidthCache)();
        (0,
        Hb.disconnectUiStop)();
        if (this.dragTarget_ && this.dragTarget_.shouldPreventMove(this.draggingBlock_))
            a = this.startXY_;
        else {
            a = this.getNewLocationAfterDrag_(b);
            var c = a.delta;
            a = a.newLocation
        }
        this.draggingBlock_.moveOffDragSurface(a);
        if (this.dragTarget_)
            this.dragTarget_.onDrop(this.draggingBlock_);
        this.maybeDeleteBlock_() || (this.draggingBlock_.setDragging(!1),
        c ? this.updateBlockAfterMove_(c) : (0,
        wc.bumpIntoBounds)(this.draggingBlock_.workspace, this.workspace_.getMetricsManager().getScrollMetrics(!0), this.draggingBlock_));
        this.workspace_.setResizesEnabled(!0);
        (0,
        h.setGroup)(!1)
    }
    ;
    Ua.prototype.getNewLocationAfterDrag_ = function(a) {
        var b = {};
        b.delta = this.pixelsToWorkspaceUnits_(a);
        b.newLocation = E.sum(this.startXY_, b.delta);
        return b
    }
    ;
    Ua.prototype.maybeDeleteBlock_ = function() {
        return this.wouldDeleteBlock_ ? (this.fireMoveEvent_(),
        this.draggingBlock_.dispose(!1, !0),
        e.module$exports$Blockly$common.draggingConnections.length = 0,
        !0) : !1
    }
    ;
    Ua.prototype.updateBlockAfterMove_ = function(a) {
        this.draggingBlock_.moveConnections(a.x, a.y);
        this.fireMoveEvent_();
        this.draggedConnectionManager_.wouldConnectBlock() ? this.draggedConnectionManager_.applyConnections() : this.draggingBlock_.render();
        this.draggingBlock_.scheduleSnapAndBump()
    }
    ;
    Ua.prototype.fireDragEndEvent_ = function() {
        var a = new ((0,
        h.get)(h.BLOCK_DRAG))(this.draggingBlock_,!1,this.draggingBlock_.getDescendants(!1));
        (0,
        h.fire)(a)
    }
    ;
    Ua.prototype.updateToolboxStyle_ = function(a) {
        var b = this.workspace_.getToolbox();
        if (b) {
            var c = this.draggingBlock_.isDeletable() ? "blocklyToolboxDelete" : "blocklyToolboxGrab";
            a && "function" === typeof b.removeStyle ? b.removeStyle(c) : a || "function" !== typeof b.addStyle || b.addStyle(c)
        }
    }
    ;
    Ua.prototype.fireMoveEvent_ = function() {
        var a = new ((0,
        h.get)(h.MOVE))(this.draggingBlock_);
        a.oldCoordinate = this.startXY_;
        a.recordNew();
        (0,
        h.fire)(a)
    }
    ;
    Ua.prototype.updateCursorDuringBlockDrag_ = function() {
        this.draggingBlock_.setDeleteStyle(this.wouldDeleteBlock_)
    }
    ;
    Ua.prototype.pixelsToWorkspaceUnits_ = function(a) {
        a = new E(a.x / this.workspace_.scale,a.y / this.workspace_.scale);
        this.workspace_.isMutator && a.scale(1 / this.workspace_.options.parentWorkspace.scale);
        return a
    }
    ;
    Ua.prototype.dragIcons_ = function(a) {
        for (var b = 0; b < this.dragIconData_.length; b++) {
            var c = this.dragIconData_[b];
            c.icon.setIconLocation(E.sum(c.location, a))
        }
    }
    ;
    Ua.prototype.getInsertionMarkers = function() {
        return this.draggedConnectionManager_ && this.draggedConnectionManager_.getInsertionMarkers ? this.draggedConnectionManager_.getInsertionMarkers() : []
    }
    ;
    (0,
    r.register)(r.Type.BLOCK_DRAGGER, r.DEFAULT, Ua);
    var gc = {
        Click: function(a, b, c) {
            gc.Click.superClass_.constructor.call(this, a ? a.workspace.id : b);
            this.blockId = a ? a.id : null;
            this.targetType = c
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(gc.Click, ob.UiBase);
    gc.Click.prototype.type = h.CLICK;
    gc.Click.prototype.toJson = function() {
        var a = gc.Click.superClass_.toJson.call(this);
        a.targetType = this.targetType;
        this.blockId && (a.blockId = this.blockId);
        return a
    }
    ;
    gc.Click.prototype.fromJson = function(a) {
        gc.Click.superClass_.fromJson.call(this, a);
        this.targetType = a.targetType;
        this.blockId = a.blockId
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.CLICK, gc.Click);
    var U = function(a, b) {
        this.mouseDownXY_ = null;
        this.currentDragDeltaXY_ = new E(0,0);
        this.startWorkspace_ = this.targetBlock_ = this.startBlock_ = this.startField_ = this.startBubble_ = null;
        this.creatorWorkspace_ = b;
        this.isDraggingBubble_ = this.isDraggingBlock_ = this.isDraggingWorkspace_ = this.hasExceededDragRadius_ = !1;
        this.mostRecentEvent_ = a;
        this.flyout_ = this.workspaceDragger_ = this.blockDragger_ = this.bubbleDragger_ = this.onUpWrapper_ = this.onMoveWrapper_ = null;
        this.isEnding_ = this.hasStarted_ = this.calledUpdateIsDragging_ = !1;
        this.healStack_ = !e.module$exports$Blockly$internalConstants.DRAG_STACK
    };
    U.prototype.dispose = function() {
        (0,
        N.clearTouchIdentifier)();
        (0,
        T.unblock)();
        this.creatorWorkspace_.clearGesture();
        this.onMoveWrapper_ && (0,
        u.unbind)(this.onMoveWrapper_);
        this.onUpWrapper_ && (0,
        u.unbind)(this.onUpWrapper_);
        this.blockDragger_ && this.blockDragger_.dispose();
        this.workspaceDragger_ && this.workspaceDragger_.dispose();
        this.bubbleDragger_ && this.bubbleDragger_.dispose()
    }
    ;
    U.prototype.updateFromEvent_ = function(a) {
        var b = new E(a.clientX,a.clientY);
        this.updateDragDelta_(b) && (this.updateIsDragging_(),
        (0,
        N.longStop)());
        this.mostRecentEvent_ = a
    }
    ;
    U.prototype.updateDragDelta_ = function(a) {
        this.currentDragDeltaXY_ = E.difference(a, this.mouseDownXY_);
        return this.hasExceededDragRadius_ ? !1 : this.hasExceededDragRadius_ = E.magnitude(this.currentDragDeltaXY_) > (this.flyout_ ? e.module$exports$Blockly$internalConstants.FLYOUT_DRAG_RADIUS : e.module$exports$Blockly$internalConstants.DRAG_RADIUS)
    }
    ;
    U.prototype.updateIsDraggingFromFlyout_ = function() {
        return this.targetBlock_ && this.flyout_.isBlockCreatable_(this.targetBlock_) ? !this.flyout_.isScrollable() || this.flyout_.isDragTowardWorkspace(this.currentDragDeltaXY_) ? (this.startWorkspace_ = this.flyout_.targetWorkspace,
        this.startWorkspace_.updateScreenCalculationsIfScrolled(),
        (0,
        h.getGroup)() || (0,
        h.setGroup)(!0),
        this.startBlock_ = null,
        this.targetBlock_ = this.flyout_.createBlock(this.targetBlock_),
        this.targetBlock_.select(),
        !0) : !1 : !1
    }
    ;
    U.prototype.updateIsDraggingBubble_ = function() {
        if (!this.startBubble_)
            return !1;
        this.isDraggingBubble_ = !0;
        this.startDraggingBubble_();
        return !0
    }
    ;
    U.prototype.updateIsDraggingBlock_ = function() {
        if (!this.targetBlock_)
            return !1;
        this.flyout_ ? this.isDraggingBlock_ = this.updateIsDraggingFromFlyout_() : this.targetBlock_.isMovable() && (this.isDraggingBlock_ = !0);
        return this.isDraggingBlock_ ? (this.startDraggingBlock_(),
        !0) : !1
    }
    ;
    U.prototype.updateIsDraggingWorkspace_ = function() {
        if (this.flyout_ ? this.flyout_.isScrollable() : this.startWorkspace_ && this.startWorkspace_.isDraggable())
            this.workspaceDragger_ = new Mc(this.startWorkspace_),
            this.isDraggingWorkspace_ = !0,
            this.workspaceDragger_.startDrag()
    }
    ;
    U.prototype.updateIsDragging_ = function() {
        if (this.calledUpdateIsDragging_)
            throw Error("updateIsDragging_ should only be called once per gesture.");
        this.calledUpdateIsDragging_ = !0;
        this.updateIsDraggingBubble_() || this.updateIsDraggingBlock_() || this.updateIsDraggingWorkspace_()
    }
    ;
    U.prototype.startDraggingBlock_ = function() {
        this.blockDragger_ = new ((0,
        r.getClassFromOptions)(r.Type.BLOCK_DRAGGER, this.creatorWorkspace_.options, !0))(this.targetBlock_,this.startWorkspace_);
        this.blockDragger_.startDrag(this.currentDragDeltaXY_, this.healStack_);
        this.blockDragger_.drag(this.mostRecentEvent_, this.currentDragDeltaXY_)
    }
    ;
    U.prototype.startDraggingBubble_ = function() {
        this.bubbleDragger_ = new Ib(this.startBubble_,this.startWorkspace_);
        this.bubbleDragger_.startBubbleDrag();
        this.bubbleDragger_.dragBubble(this.mostRecentEvent_, this.currentDragDeltaXY_)
    }
    ;
    U.prototype.doStart = function(a) {
        (0,
        u.isTargetInput)(a) ? this.cancel() : (this.hasStarted_ = !0,
        (0,
        Hb.disconnectUiStop)(),
        this.startWorkspace_.updateScreenCalculationsIfScrolled(),
        this.startWorkspace_.isMutator && this.startWorkspace_.resize(),
        this.startWorkspace_.hideChaff(!!this.flyout_),
        this.startWorkspace_.markFocused(),
        this.mostRecentEvent_ = a,
        (0,
        T.block)(),
        this.targetBlock_ && this.targetBlock_.select(),
        (0,
        u.isRightButton)(a) ? this.handleRightClick(a) : ("touchstart" !== a.type.toLowerCase() && "pointerdown" !== a.type.toLowerCase() || "mouse" === a.pointerType || (0,
        N.longStart)(a, this),
        this.mouseDownXY_ = new E(a.clientX,a.clientY),
        this.healStack_ = a.altKey || a.ctrlKey || a.metaKey,
        this.bindMouseEvents(a)))
    }
    ;
    U.prototype.bindMouseEvents = function(a) {
        this.onMoveWrapper_ = (0,
        u.conditionalBind)(document, "mousemove", null, this.handleMove.bind(this));
        this.onUpWrapper_ = (0,
        u.conditionalBind)(document, "mouseup", null, this.handleUp.bind(this));
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    U.prototype.handleMove = function(a) {
        this.updateFromEvent_(a);
        this.isDraggingWorkspace_ ? this.workspaceDragger_.drag(this.currentDragDeltaXY_) : this.isDraggingBlock_ ? this.blockDragger_.drag(this.mostRecentEvent_, this.currentDragDeltaXY_) : this.isDraggingBubble_ && this.bubbleDragger_.dragBubble(this.mostRecentEvent_, this.currentDragDeltaXY_);
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    U.prototype.handleUp = function(a) {
        this.updateFromEvent_(a);
        (0,
        N.longStop)();
        this.isEnding_ ? console.log("Trying to end a gesture recursively.") : (this.isEnding_ = !0,
        this.isDraggingBubble_ ? this.bubbleDragger_.endBubbleDrag(a, this.currentDragDeltaXY_) : this.isDraggingBlock_ ? this.blockDragger_.endDrag(a, this.currentDragDeltaXY_) : this.isDraggingWorkspace_ ? this.workspaceDragger_.endDrag(this.currentDragDeltaXY_) : this.isBubbleClick_() ? this.doBubbleClick_() : this.isFieldClick_() ? this.doFieldClick_() : this.isBlockClick_() ? this.doBlockClick_() : this.isWorkspaceClick_() && this.doWorkspaceClick_(a),
        a.preventDefault(),
        a.stopPropagation(),
        this.dispose())
    }
    ;
    U.prototype.cancel = function() {
        this.isEnding_ || ((0,
        N.longStop)(),
        this.isDraggingBubble_ ? this.bubbleDragger_.endBubbleDrag(this.mostRecentEvent_, this.currentDragDeltaXY_) : this.isDraggingBlock_ ? this.blockDragger_.endDrag(this.mostRecentEvent_, this.currentDragDeltaXY_) : this.isDraggingWorkspace_ && this.workspaceDragger_.endDrag(this.currentDragDeltaXY_),
        this.dispose())
    }
    ;
    U.prototype.handleRightClick = function(a) {
        this.targetBlock_ ? (this.bringBlockToFront_(),
        this.targetBlock_.workspace.hideChaff(!!this.flyout_),
        this.targetBlock_.showContextMenu(a)) : this.startBubble_ ? this.startBubble_.showContextMenu(a) : this.startWorkspace_ && !this.flyout_ && (this.startWorkspace_.hideChaff(),
        this.startWorkspace_.showContextMenu(a));
        a.preventDefault();
        a.stopPropagation();
        this.dispose()
    }
    ;
    U.prototype.handleWsStart = function(a, b) {
        if (this.hasStarted_)
            throw Error("Tried to call gesture.handleWsStart, but the gesture had already been started.");
        this.setStartWorkspace_(b);
        this.mostRecentEvent_ = a;
        this.doStart(a)
    }
    ;
    U.prototype.fireWorkspaceClick_ = function(a) {
        (0,
        h.fire)(new ((0,
        h.get)(h.CLICK))(null,a.id,"workspace"))
    }
    ;
    U.prototype.handleFlyoutStart = function(a, b) {
        if (this.hasStarted_)
            throw Error("Tried to call gesture.handleFlyoutStart, but the gesture had already been started.");
        this.setStartFlyout_(b);
        this.handleWsStart(a, b.getWorkspace())
    }
    ;
    U.prototype.handleBlockStart = function(a, b) {
        if (this.hasStarted_)
            throw Error("Tried to call gesture.handleBlockStart, but the gesture had already been started.");
        this.setStartBlock(b);
        this.mostRecentEvent_ = a
    }
    ;
    U.prototype.handleBubbleStart = function(a, b) {
        if (this.hasStarted_)
            throw Error("Tried to call gesture.handleBubbleStart, but the gesture had already been started.");
        this.setStartBubble(b);
        this.mostRecentEvent_ = a
    }
    ;
    U.prototype.doBubbleClick_ = function() {
        this.startBubble_.setFocus && this.startBubble_.setFocus();
        this.startBubble_.select && this.startBubble_.select()
    }
    ;
    U.prototype.doFieldClick_ = function() {
        this.startField_.showEditor(this.mostRecentEvent_);
        this.bringBlockToFront_()
    }
    ;
    U.prototype.doBlockClick_ = function() {
        if (this.flyout_ && this.flyout_.autoClose)
            this.targetBlock_.isEnabled() && ((0,
            h.getGroup)() || (0,
            h.setGroup)(!0),
            this.flyout_.createBlock(this.targetBlock_).scheduleSnapAndBump());
        else {
            var a = new ((0,
            h.get)(h.CLICK))(this.startBlock_,this.startWorkspace_.id,"block");
            (0,
            h.fire)(a)
        }
        this.bringBlockToFront_();
        (0,
        h.setGroup)(!1)
    }
    ;
    U.prototype.doWorkspaceClick_ = function(a) {
        a = this.creatorWorkspace_;
        (0,
        e.module$exports$Blockly$common.getSelected)() && (0,
        e.module$exports$Blockly$common.getSelected)().unselect();
        this.fireWorkspaceClick_(this.startWorkspace_ || a)
    }
    ;
    U.prototype.bringBlockToFront_ = function() {
        this.targetBlock_ && !this.flyout_ && this.targetBlock_.bringToFront()
    }
    ;
    U.prototype.setStartField = function(a) {
        if (this.hasStarted_)
            throw Error("Tried to call gesture.setStartField, but the gesture had already been started.");
        this.startField_ || (this.startField_ = a)
    }
    ;
    U.prototype.setStartBubble = function(a) {
        this.startBubble_ || (this.startBubble_ = a)
    }
    ;
    U.prototype.setStartBlock = function(a) {
        this.startBlock_ || this.startBubble_ || (this.startBlock_ = a,
        a.isInFlyout && a !== a.getRootBlock() ? this.setTargetBlock_(a.getRootBlock()) : this.setTargetBlock_(a))
    }
    ;
    U.prototype.setTargetBlock_ = function(a) {
        a.isShadow() ? this.setTargetBlock_(a.getParent()) : this.targetBlock_ = a
    }
    ;
    U.prototype.setStartWorkspace_ = function(a) {
        this.startWorkspace_ || (this.startWorkspace_ = a)
    }
    ;
    U.prototype.setStartFlyout_ = function(a) {
        this.flyout_ || (this.flyout_ = a)
    }
    ;
    U.prototype.isBubbleClick_ = function() {
        return !!this.startBubble_ && !this.hasExceededDragRadius_
    }
    ;
    U.prototype.isBlockClick_ = function() {
        return !!this.startBlock_ && !this.hasExceededDragRadius_ && !this.isFieldClick_()
    }
    ;
    U.prototype.isFieldClick_ = function() {
        return (this.startField_ ? this.startField_.isClickable() : !1) && !this.hasExceededDragRadius_ && (!this.flyout_ || !this.flyout_.autoClose)
    }
    ;
    U.prototype.isWorkspaceClick_ = function() {
        return !this.startBlock_ && !this.startBubble_ && !this.startField_ && !this.hasExceededDragRadius_
    }
    ;
    U.prototype.isDragging = function() {
        return this.isDraggingWorkspace_ || this.isDraggingBlock_ || this.isDraggingBubble_
    }
    ;
    U.prototype.hasStarted = function() {
        return this.hasStarted_
    }
    ;
    U.prototype.getInsertionMarkers = function() {
        return this.blockDragger_ ? this.blockDragger_.getInsertionMarkers() : []
    }
    ;
    U.prototype.getCurrentDragger = function() {
        return this.isDraggingBlock_ ? this.blockDragger_ : this.isDraggingWorkspace_ ? this.workspaceDragger_ : this.isDraggingBubble_ ? this.bubbleDragger_ : null
    }
    ;
    U.inProgress = function() {
        for (var a = I.Workspace.getAll(), b = 0, c; c = a[b]; b++)
            if (c.currentGesture_)
                return !0;
        return !1
    }
    ;
    var D = function(a, b, c) {
        this.value_ = this.DEFAULT_VALUE;
        this.tooltip_ = this.validator_ = null;
        this.size_ = new Ja(0,0);
        this.constants_ = this.mouseDownWrapper_ = this.textContent_ = this.textElement_ = this.borderRect_ = this.fieldGroup_ = this.markerSvg_ = this.cursorSvg_ = null;
        c && this.configure_(c);
        this.setValue(a);
        b && this.setValidator(b)
    };
    D.prototype.DEFAULT_VALUE = null;
    D.prototype.name = void 0;
    D.prototype.disposed = !1;
    D.prototype.maxDisplayLength = 50;
    D.prototype.sourceBlock_ = null;
    D.prototype.isDirty_ = !0;
    D.prototype.visible_ = !0;
    D.prototype.enabled_ = !0;
    D.prototype.clickTarget_ = null;
    D.NBSP = "\u00a0";
    D.prototype.EDITABLE = !0;
    D.prototype.SERIALIZABLE = !1;
    D.prototype.configure_ = function(a) {
        var b = a.tooltip;
        "string" === typeof b && (b = (0,
        da.replaceMessageReferences)(a.tooltip));
        b && this.setTooltip(b)
    }
    ;
    D.prototype.setSourceBlock = function(a) {
        if (this.sourceBlock_)
            throw Error("Field already bound to a block");
        this.sourceBlock_ = a
    }
    ;
    D.prototype.getConstants = function() {
        !this.constants_ && this.sourceBlock_ && this.sourceBlock_.workspace && this.sourceBlock_.workspace.rendered && (this.constants_ = this.sourceBlock_.workspace.getRenderer().getConstants());
        return this.constants_
    }
    ;
    D.prototype.getSourceBlock = function() {
        return this.sourceBlock_
    }
    ;
    D.prototype.init = function() {
        this.fieldGroup_ || (this.fieldGroup_ = (0,
        l.createSvgElement)(q.G, {}, null),
        this.isVisible() || (this.fieldGroup_.style.display = "none"),
        this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_),
        this.initView(),
        this.updateEditable(),
        this.setTooltip(this.tooltip_),
        this.bindEvents_(),
        this.initModel())
    }
    ;
    D.prototype.initView = function() {
        this.createBorderRect_();
        this.createTextElement_()
    }
    ;
    D.prototype.initModel = function() {}
    ;
    D.prototype.createBorderRect_ = function() {
        this.borderRect_ = (0,
        l.createSvgElement)(q.RECT, {
            rx: this.getConstants().FIELD_BORDER_RECT_RADIUS,
            ry: this.getConstants().FIELD_BORDER_RECT_RADIUS,
            x: 0,
            y: 0,
            height: this.size_.height,
            width: this.size_.width,
            "class": "blocklyFieldRect"
        }, this.fieldGroup_)
    }
    ;
    D.prototype.createTextElement_ = function() {
        this.textElement_ = (0,
        l.createSvgElement)(q.TEXT, {
            "class": "blocklyText"
        }, this.fieldGroup_);
        this.getConstants().FIELD_TEXT_BASELINE_CENTER && this.textElement_.setAttribute("dominant-baseline", "central");
        this.textContent_ = document.createTextNode("");
        this.textElement_.appendChild(this.textContent_)
    }
    ;
    D.prototype.bindEvents_ = function() {
        (0,
        T.bindMouseEvents)(this.getClickTarget_());
        this.mouseDownWrapper_ = (0,
        u.conditionalBind)(this.getClickTarget_(), "mousedown", this, this.onMouseDown_)
    }
    ;
    D.prototype.fromXml = function(a) {
        this.setValue(a.textContent)
    }
    ;
    D.prototype.toXml = function(a) {
        a.textContent = this.getValue();
        return a
    }
    ;
    D.prototype.saveState = function(a) {
        a = this.saveLegacyState(D);
        return null !== a ? a : this.getValue()
    }
    ;
    D.prototype.loadState = function(a) {
        this.loadLegacyState(D, a) || this.setValue(a)
    }
    ;
    D.prototype.saveLegacyState = function(a) {
        return a.prototype.saveState === this.saveState && a.prototype.toXml !== this.toXml ? (a = (0,
        e.module$exports$Blockly$utils$xml.createElement)("field"),
        a.setAttribute("name", this.name || ""),
        (0,
        e.module$exports$Blockly$Xml.domToText)(this.toXml(a)).replace(' xmlns="https://developers.google.com/blockly/xml"', "")) : null
    }
    ;
    D.prototype.loadLegacyState = function(a, b) {
        return a.prototype.loadState === this.loadState && a.prototype.fromXml !== this.fromXml ? (this.fromXml((0,
        e.module$exports$Blockly$Xml.textToDom)(b)),
        !0) : !1
    }
    ;
    D.prototype.dispose = function() {
        y.hideIfOwner(this);
        (0,
        ma.hideIfOwner)(this);
        (0,
        T.unbindMouseEvents)(this.getClickTarget_());
        this.mouseDownWrapper_ && (0,
        u.unbind)(this.mouseDownWrapper_);
        (0,
        l.removeNode)(this.fieldGroup_);
        this.disposed = !0
    }
    ;
    D.prototype.updateEditable = function() {
        var a = this.fieldGroup_;
        this.EDITABLE && a && (this.enabled_ && this.sourceBlock_.isEditable() ? ((0,
        l.addClass)(a, "blocklyEditableText"),
        (0,
        l.removeClass)(a, "blocklyNonEditableText"),
        a.style.cursor = this.CURSOR) : ((0,
        l.addClass)(a, "blocklyNonEditableText"),
        (0,
        l.removeClass)(a, "blocklyEditableText"),
        a.style.cursor = ""))
    }
    ;
    D.prototype.setEnabled = function(a) {
        this.enabled_ = a;
        this.updateEditable()
    }
    ;
    D.prototype.isEnabled = function() {
        return this.enabled_
    }
    ;
    D.prototype.isClickable = function() {
        return this.enabled_ && !!this.sourceBlock_ && this.sourceBlock_.isEditable() && !!this.showEditor_ && "function" === typeof this.showEditor_
    }
    ;
    D.prototype.isCurrentlyEditable = function() {
        return this.enabled_ && this.EDITABLE && !!this.sourceBlock_ && this.sourceBlock_.isEditable()
    }
    ;
    D.prototype.isSerializable = function() {
        var a = !1;
        this.name && (this.SERIALIZABLE ? a = !0 : this.EDITABLE && (console.warn("Detected an editable field that was not serializable. Please define SERIALIZABLE property as true on all editable custom fields. Proceeding with serialization."),
        a = !0));
        return a
    }
    ;
    D.prototype.isVisible = function() {
        return this.visible_
    }
    ;
    D.prototype.setVisible = function(a) {
        if (this.visible_ !== a) {
            this.visible_ = a;
            var b = this.getSvgRoot();
            b && (b.style.display = a ? "block" : "none")
        }
    }
    ;
    D.prototype.setValidator = function(a) {
        this.validator_ = a
    }
    ;
    D.prototype.getValidator = function() {
        return this.validator_
    }
    ;
    D.prototype.getSvgRoot = function() {
        return this.fieldGroup_
    }
    ;
    D.prototype.applyColour = function() {}
    ;
    D.prototype.render_ = function() {
        this.textContent_ && (this.textContent_.nodeValue = this.getDisplayText_());
        this.updateSize_()
    }
    ;
    D.prototype.showEditor = function(a) {
        this.isClickable() && this.showEditor_(a)
    }
    ;
    D.prototype.updateSize_ = function(a) {
        var b = this.getConstants();
        a = void 0 !== a ? a : this.borderRect_ ? this.getConstants().FIELD_BORDER_RECT_X_PADDING : 0;
        var c = 2 * a
          , d = b.FIELD_TEXT_HEIGHT
          , f = 0;
        this.textElement_ && (f = (0,
        l.getFastTextWidth)(this.textElement_, b.FIELD_TEXT_FONTSIZE, b.FIELD_TEXT_FONTWEIGHT, b.FIELD_TEXT_FONTFAMILY),
        c += f);
        this.borderRect_ && (d = Math.max(d, b.FIELD_BORDER_RECT_HEIGHT));
        this.size_.height = d;
        this.size_.width = c;
        this.positionTextElement_(a, f);
        this.positionBorderRect_()
    }
    ;
    D.prototype.positionTextElement_ = function(a, b) {
        if (this.textElement_) {
            var c = this.getConstants()
              , d = this.size_.height / 2;
            this.textElement_.setAttribute("x", this.sourceBlock_.RTL ? this.size_.width - b - a : a);
            this.textElement_.setAttribute("y", c.FIELD_TEXT_BASELINE_CENTER ? d : d - c.FIELD_TEXT_HEIGHT / 2 + c.FIELD_TEXT_BASELINE)
        }
    }
    ;
    D.prototype.positionBorderRect_ = function() {
        this.borderRect_ && (this.borderRect_.setAttribute("width", this.size_.width),
        this.borderRect_.setAttribute("height", this.size_.height),
        this.borderRect_.setAttribute("rx", this.getConstants().FIELD_BORDER_RECT_RADIUS),
        this.borderRect_.setAttribute("ry", this.getConstants().FIELD_BORDER_RECT_RADIUS))
    }
    ;
    D.prototype.getSize = function() {
        if (!this.isVisible())
            return new Ja(0,0);
        this.isDirty_ ? (this.render_(),
        this.isDirty_ = !1) : this.visible_ && 0 === this.size_.width && (console.warn("Deprecated use of setting size_.width to 0 to rerender a field. Set field.isDirty_ to true instead."),
        this.render_());
        return this.size_
    }
    ;
    D.prototype.getScaledBBox = function() {
        if (this.borderRect_)
            var a = this.borderRect_.getBoundingClientRect()
              , b = (0,
            na.getPageOffset)(this.borderRect_)
              , c = a.width
              , d = a.height;
        else
            d = this.sourceBlock_.getHeightWidth(),
            a = this.sourceBlock_.workspace.scale,
            b = this.getAbsoluteXY_(),
            c = d.width * a,
            d = d.height * a,
            O.GECKO ? (b.x += 1.5 * a,
            b.y += 1.5 * a) : O.EDGE || O.IE || (b.x -= .5 * a,
            b.y -= .5 * a),
            c += 1 * a,
            d += 1 * a;
        return new Aa(b.y,b.y + d,b.x,b.x + c)
    }
    ;
    D.prototype.getDisplayText_ = function() {
        var a = this.getText();
        if (!a)
            return D.NBSP;
        a.length > this.maxDisplayLength && (a = a.substring(0, this.maxDisplayLength - 2) + "\u2026");
        a = a.replace(/\s/g, D.NBSP);
        this.sourceBlock_ && this.sourceBlock_.RTL && (a += "\u200f");
        return a
    }
    ;
    D.prototype.getText = function() {
        if (this.getText_) {
            var a = this.getText_.call(this);
            if (null !== a)
                return String(a)
        }
        return String(this.getValue())
    }
    ;
    D.prototype.markDirty = function() {
        this.isDirty_ = !0;
        this.constants_ = null
    }
    ;
    D.prototype.forceRerender = function() {
        this.isDirty_ = !0;
        this.sourceBlock_ && this.sourceBlock_.rendered && (this.sourceBlock_.render(),
        this.sourceBlock_.bumpNeighbours(),
        this.updateMarkers_())
    }
    ;
    D.prototype.setValue = function(a) {
        if (null !== a) {
            var b = this.doClassValidation_(a);
            a = this.processValidation_(a, b);
            if (!(a instanceof Error)) {
                if (b = this.getValidator())
                    if (b = b.call(this, a),
                    a = this.processValidation_(a, b),
                    a instanceof Error)
                        return;
                b = this.sourceBlock_;
                if (!b || !b.disposed) {
                    var c = this.getValue();
                    c === a ? this.doValueUpdate_(a) : (this.doValueUpdate_(a),
                    b && (0,
                    h.isEnabled)() && (0,
                    h.fire)(new ((0,
                    h.get)(h.CHANGE))(b,"field",this.name || null,c,a)),
                    this.isDirty_ && this.forceRerender())
                }
            }
        }
    }
    ;
    D.prototype.processValidation_ = function(a, b) {
        if (null === b)
            return this.doValueInvalid_(a),
            this.isDirty_ && this.forceRerender(),
            Error();
        void 0 !== b && (a = b);
        return a
    }
    ;
    D.prototype.getValue = function() {
        return this.value_
    }
    ;
    D.prototype.doClassValidation_ = function(a) {
        return null === a || void 0 === a ? null : a
    }
    ;
    D.prototype.doValueUpdate_ = function(a) {
        this.value_ = a;
        this.isDirty_ = !0
    }
    ;
    D.prototype.doValueInvalid_ = function(a) {}
    ;
    D.prototype.onMouseDown_ = function(a) {
        this.sourceBlock_ && this.sourceBlock_.workspace && (a = this.sourceBlock_.workspace.getGesture(a)) && a.setStartField(this)
    }
    ;
    D.prototype.setTooltip = function(a) {
        a || "" === a || (a = this.sourceBlock_);
        var b = this.getClickTarget_();
        b ? b.tooltip = a : this.tooltip_ = a
    }
    ;
    D.prototype.getTooltip = function() {
        var a = this.getClickTarget_();
        return a ? (0,
        T.getTooltipOfObject)(a) : (0,
        T.getTooltipOfObject)({
            tooltip: this.tooltip_
        })
    }
    ;
    D.prototype.getClickTarget_ = function() {
        return this.clickTarget_ || this.getSvgRoot()
    }
    ;
    D.prototype.getAbsoluteXY_ = function() {
        return (0,
        na.getPageOffset)(this.getClickTarget_())
    }
    ;
    D.prototype.referencesVariables = function() {
        return !1
    }
    ;
    D.prototype.getParentInput = function() {
        for (var a = null, b = this.sourceBlock_, c = b.inputList, d = 0; d < b.inputList.length; d++)
            for (var f = c[d], g = f.fieldRow, k = 0; k < g.length; k++)
                if (g[k] === this) {
                    a = f;
                    break
                }
        return a
    }
    ;
    D.prototype.getFlipRtl = function() {
        return !1
    }
    ;
    D.prototype.isTabNavigable = function() {
        return !1
    }
    ;
    D.prototype.onShortcut = function(a) {
        return !1
    }
    ;
    D.prototype.setCursorSvg = function(a) {
        a ? (this.fieldGroup_.appendChild(a),
        this.cursorSvg_ = a) : this.cursorSvg_ = null
    }
    ;
    D.prototype.setMarkerSvg = function(a) {
        a ? (this.fieldGroup_.appendChild(a),
        this.markerSvg_ = a) : this.markerSvg_ = null
    }
    ;
    D.prototype.updateMarkers_ = function() {
        var a = this.sourceBlock_.workspace;
        a.keyboardAccessibilityMode && this.cursorSvg_ && a.getCursor().draw();
        a.keyboardAccessibilityMode && this.markerSvg_ && a.getMarker(nb.LOCAL_MARKER).draw()
    }
    ;
    e.module$exports$Blockly$FieldLabel = {
        FieldLabel: function(a, b, c) {
            this.class_ = null;
            e.module$exports$Blockly$FieldLabel.FieldLabel.superClass_.constructor.call(this, a, null, c);
            c || (this.class_ = b || null)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$FieldLabel.FieldLabel, D);
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.DEFAULT_VALUE = "";
    e.module$exports$Blockly$FieldLabel.FieldLabel.fromJson = function(a) {
        return new this((0,
        da.replaceMessageReferences)(a.text),void 0,a)
    }
    ;
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.EDITABLE = !1;
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.configure_ = function(a) {
        e.module$exports$Blockly$FieldLabel.FieldLabel.superClass_.configure_.call(this, a);
        this.class_ = a["class"]
    }
    ;
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.initView = function() {
        this.createTextElement_();
        this.class_ && (0,
        l.addClass)(this.textElement_, this.class_)
    }
    ;
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.doClassValidation_ = function(a) {
        return null === a || void 0 === a ? null : String(a)
    }
    ;
    e.module$exports$Blockly$FieldLabel.FieldLabel.prototype.setClass = function(a) {
        this.textElement_ && (this.class_ && (0,
        l.removeClass)(this.textElement_, this.class_),
        a && (0,
        l.addClass)(this.textElement_, a));
        this.class_ = a
    }
    ;
    (0,
    mb.register)("field_label", e.module$exports$Blockly$FieldLabel.FieldLabel);
    var Ba = function(a) {
        this.debugElements_ = [];
        this.svgRoot_ = null;
        this.constants_ = a
    };
    Ba.config = {
        rowSpacers: !0,
        elemSpacers: !0,
        rows: !0,
        elems: !0,
        connections: !0,
        blockBounds: !0,
        connectedBlockBounds: !0,
        render: !0
    };
    Ba.prototype.clearElems = function() {
        for (var a = 0; a < this.debugElements_.length; a++)
            (0,
            l.removeNode)(this.debugElements_[a]);
        this.debugElements_ = []
    }
    ;
    Ba.prototype.drawSpacerRow = function(a, b, c) {
        if (Ba.config.rowSpacers) {
            var d = Math.abs(a.height)
              , f = 0 > a.height;
            f && (b -= d);
            this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "rowSpacerRect blockRenderDebug",
                x: c ? -(a.xPos + a.width) : a.xPos,
                y: b,
                width: a.width,
                height: d,
                stroke: f ? "black" : "blue",
                fill: "blue",
                "fill-opacity": "0.5",
                "stroke-width": "1px"
            }, this.svgRoot_))
        }
    }
    ;
    Ba.prototype.drawSpacerElem = function(a, b, c) {
        if (Ba.config.elemSpacers) {
            b = Math.abs(a.width);
            var d = 0 > a.width
              , f = d ? a.xPos - b : a.xPos;
            c && (f = -(f + b));
            this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "elemSpacerRect blockRenderDebug",
                x: f,
                y: a.centerline - a.height / 2,
                width: b,
                height: a.height,
                stroke: "pink",
                fill: d ? "black" : "pink",
                "fill-opacity": "0.5",
                "stroke-width": "1px"
            }, this.svgRoot_))
        }
    }
    ;
    Ba.prototype.drawRenderedElem = function(a, b) {
        if (Ba.config.elems) {
            var c = a.xPos;
            b && (c = -(c + a.width));
            b = a.centerline - a.height / 2;
            this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "rowRenderingRect blockRenderDebug",
                x: c,
                y: b,
                width: a.width,
                height: a.height,
                stroke: "black",
                fill: "none",
                "stroke-width": "1px"
            }, this.svgRoot_));
            m.isField(a) && a.field instanceof e.module$exports$Blockly$FieldLabel.FieldLabel && this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "rowRenderingRect blockRenderDebug",
                x: c,
                y: b + this.constants_.FIELD_TEXT_BASELINE,
                width: a.width,
                height: "0.1px",
                stroke: "red",
                fill: "none",
                "stroke-width": "0.5px"
            }, this.svgRoot_))
        }
        m.isInput(a) && Ba.config.connections && this.drawConnection(a.connectionModel)
    }
    ;
    Ba.prototype.drawConnection = function(a) {
        if (Ba.config.connections) {
            if (a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE)
                var b = 4
                  , c = "magenta"
                  , d = "none";
            else
                a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE ? (b = 2,
                d = c = "magenta") : a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT ? (b = 4,
                c = "goldenrod",
                d = "none") : a.type === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT && (b = 2,
                d = c = "goldenrod");
            this.debugElements_.push((0,
            l.createSvgElement)(q.CIRCLE, {
                "class": "blockRenderDebug",
                cx: a.offsetInBlock_.x,
                cy: a.offsetInBlock_.y,
                r: b,
                fill: d,
                stroke: c
            }, this.svgRoot_))
        }
    }
    ;
    Ba.prototype.drawRenderedRow = function(a, b, c) {
        Ba.config.rows && (this.debugElements_.push((0,
        l.createSvgElement)(q.RECT, {
            "class": "elemRenderingRect blockRenderDebug",
            x: c ? -(a.xPos + a.width) : a.xPos,
            y: a.yPos,
            width: a.width,
            height: a.height,
            stroke: "red",
            fill: "none",
            "stroke-width": "1px"
        }, this.svgRoot_)),
        m.isTopOrBottomRow(a) || Ba.config.connectedBlockBounds && this.debugElements_.push((0,
        l.createSvgElement)(q.RECT, {
            "class": "connectedBlockWidth blockRenderDebug",
            x: c ? -(a.xPos + a.widthWithConnectedBlocks) : a.xPos,
            y: a.yPos,
            width: a.widthWithConnectedBlocks,
            height: a.height,
            stroke: this.randomColour_,
            fill: "none",
            "stroke-width": "1px",
            "stroke-dasharray": "3,3"
        }, this.svgRoot_)))
    }
    ;
    Ba.prototype.drawRowWithElements = function(a, b, c) {
        for (var d = 0; d < a.elements.length; d++) {
            var f = a.elements[d];
            f ? m.isSpacer(f) ? this.drawSpacerElem(f, a.height, c) : this.drawRenderedElem(f, c) : console.warn("A row has an undefined or null element.", a, f)
        }
        this.drawRenderedRow(a, b, c)
    }
    ;
    Ba.prototype.drawBoundingBox = function(a) {
        if (Ba.config.blockBounds) {
            var b = a.RTL ? -a.width : 0;
            this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "blockBoundingBox blockRenderDebug",
                x: b,
                y: 0,
                width: a.width,
                height: a.height,
                stroke: "black",
                fill: "none",
                "stroke-width": "1px",
                "stroke-dasharray": "5,5"
            }, this.svgRoot_));
            Ba.config.connectedBlockBounds && (b = a.RTL ? -a.widthWithChildren : 0,
            this.debugElements_.push((0,
            l.createSvgElement)(q.RECT, {
                "class": "blockRenderDebug",
                x: b,
                y: 0,
                width: a.widthWithChildren,
                height: a.height,
                stroke: "#DF57BC",
                fill: "none",
                "stroke-width": "1px",
                "stroke-dasharray": "3,3"
            }, this.svgRoot_)))
        }
    }
    ;
    Ba.prototype.drawDebug = function(a, b) {
        this.clearElems();
        this.svgRoot_ = a.getSvgRoot();
        this.randomColour_ = "#" + Math.floor(16777215 * Math.random()).toString(16);
        for (var c = 0, d = 0; d < b.rows.length; d++) {
            var f = b.rows[d];
            m.isBetweenRowSpacer(f) ? this.drawSpacerRow(f, c, b.RTL) : this.drawRowWithElements(f, c, b.RTL);
            c += f.height
        }
        a.previousConnection && this.drawConnection(a.previousConnection);
        a.nextConnection && this.drawConnection(a.nextConnection);
        a.outputConnection && this.drawConnection(a.outputConnection);
        b.rightSide && this.drawRenderedElem(b.rightSide, b.RTL);
        this.drawBoundingBox(b);
        this.drawRender(a.pathObject.svgPath)
    }
    ;
    Ba.prototype.drawRender = function(a) {
        Ba.config.render && (a.setAttribute("filter", "url(#" + this.constants_.debugFilterId + ")"),
        setTimeout(function() {
            a.setAttribute("filter", "")
        }, 100))
    }
    ;
    var va = function(a, b) {
        this.block_ = a;
        this.info_ = b;
        this.topLeft_ = a.getRelativeToSurfaceXY();
        this.inlinePath_ = this.outlinePath_ = "";
        this.constants_ = b.getRenderer().getConstants()
    };
    va.prototype.draw = function() {
        this.hideHiddenIcons_();
        this.drawOutline_();
        this.drawInternals_();
        this.block_.pathObject.setPath(this.outlinePath_ + "\n" + this.inlinePath_);
        this.info_.RTL && this.block_.pathObject.flipRTL();
        (0,
        Fb.isDebuggerEnabled)() && this.block_.renderingDebugger.drawDebug(this.block_, this.info_);
        this.recordSizeOnBlock_()
    }
    ;
    va.prototype.recordSizeOnBlock_ = function() {
        this.block_.height = this.info_.height;
        this.block_.width = this.info_.widthWithChildren
    }
    ;
    va.prototype.hideHiddenIcons_ = function() {
        for (var a = 0, b; b = this.info_.hiddenIcons[a]; a++)
            b.icon.iconGroup_.setAttribute("display", "none")
    }
    ;
    va.prototype.drawOutline_ = function() {
        this.drawTop_();
        for (var a = 1; a < this.info_.rows.length - 1; a++) {
            var b = this.info_.rows[a];
            b.hasJaggedEdge ? this.drawJaggedEdge_(b) : b.hasStatement ? this.drawStatementInput_(b) : b.hasExternalInput ? this.drawValueInput_(b) : this.drawRightSideRow_(b)
        }
        this.drawBottom_();
        this.drawLeft_()
    }
    ;
    va.prototype.drawTop_ = function() {
        var a = this.info_.topRow
          , b = a.elements;
        this.positionPreviousConnection_();
        this.outlinePath_ += (0,
        p.moveBy)(a.xPos, this.info_.startY);
        for (var c = 0, d; d = b[c]; c++)
            m.isLeftRoundedCorner(d) ? this.outlinePath_ += this.constants_.OUTSIDE_CORNERS.topLeft : m.isRightRoundedCorner(d) ? this.outlinePath_ += this.constants_.OUTSIDE_CORNERS.topRight : m.isPreviousConnection(d) ? this.outlinePath_ += d.shape.pathLeft : m.isHat(d) ? this.outlinePath_ += this.constants_.START_HAT.path : m.isSpacer(d) && (this.outlinePath_ += (0,
            p.lineOnAxis)("h", d.width));
        this.outlinePath_ += (0,
        p.lineOnAxis)("v", a.height)
    }
    ;
    va.prototype.drawJaggedEdge_ = function(a) {
        this.outlinePath_ += this.constants_.JAGGED_TEETH.path + (0,
        p.lineOnAxis)("v", a.height - this.constants_.JAGGED_TEETH.height)
    }
    ;
    va.prototype.drawValueInput_ = function(a) {
        var b = a.getLastInput();
        this.positionExternalValueConnection_(a);
        var c = "function" === typeof b.shape.pathDown ? b.shape.pathDown(b.height) : b.shape.pathDown;
        this.outlinePath_ += (0,
        p.lineOnAxis)("H", b.xPos + b.width) + c + (0,
        p.lineOnAxis)("v", a.height - b.connectionHeight)
    }
    ;
    va.prototype.drawStatementInput_ = function(a) {
        var b = a.getLastInput()
          , c = b.xPos + b.notchOffset + b.shape.width;
        b = b.shape.pathRight + (0,
        p.lineOnAxis)("h", -(b.notchOffset - this.constants_.INSIDE_CORNERS.width)) + this.constants_.INSIDE_CORNERS.pathTop;
        var d = a.height - 2 * this.constants_.INSIDE_CORNERS.height;
        this.outlinePath_ += (0,
        p.lineOnAxis)("H", c) + b + (0,
        p.lineOnAxis)("v", d) + this.constants_.INSIDE_CORNERS.pathBottom + (0,
        p.lineOnAxis)("H", a.xPos + a.width);
        this.positionStatementInputConnection_(a)
    }
    ;
    va.prototype.drawRightSideRow_ = function(a) {
        this.outlinePath_ += (0,
        p.lineOnAxis)("V", a.yPos + a.height)
    }
    ;
    va.prototype.drawBottom_ = function() {
        var a = this.info_.bottomRow
          , b = a.elements;
        this.positionNextConnection_();
        for (var c = 0, d = "", f = b.length - 1, g; g = b[f]; f--)
            m.isNextConnection(g) ? d += g.shape.pathRight : m.isLeftSquareCorner(g) ? d += (0,
            p.lineOnAxis)("H", a.xPos) : m.isLeftRoundedCorner(g) ? d += this.constants_.OUTSIDE_CORNERS.bottomLeft : m.isRightRoundedCorner(g) ? (d += this.constants_.OUTSIDE_CORNERS.bottomRight,
            c = this.constants_.OUTSIDE_CORNERS.rightHeight) : m.isSpacer(g) && (d += (0,
            p.lineOnAxis)("h", -1 * g.width));
        this.outlinePath_ += (0,
        p.lineOnAxis)("V", a.baseline - c);
        this.outlinePath_ += d
    }
    ;
    va.prototype.drawLeft_ = function() {
        var a = this.info_.outputConnection;
        this.positionOutputConnection_();
        if (a) {
            var b = a.connectionOffsetY + a.height;
            a = "function" === typeof a.shape.pathUp ? a.shape.pathUp(a.height) : a.shape.pathUp;
            this.outlinePath_ += (0,
            p.lineOnAxis)("V", b) + a
        }
        this.outlinePath_ += "z"
    }
    ;
    va.prototype.drawInternals_ = function() {
        for (var a = 0, b; b = this.info_.rows[a]; a++)
            for (var c = 0, d; d = b.elements[c]; c++)
                m.isInlineInput(d) ? this.drawInlineInput_(d) : (m.isIcon(d) || m.isField(d)) && this.layoutField_(d)
    }
    ;
    va.prototype.layoutField_ = function(a) {
        if (m.isField(a))
            var b = a.field.getSvgRoot();
        else
            m.isIcon(a) && (b = a.icon.iconGroup_);
        var c = a.centerline - a.height / 2
          , d = a.xPos
          , f = "";
        this.info_.RTL && (d = -(d + a.width),
        a.flipRtl && (d += a.width,
        f = "scale(-1 1)"));
        m.isIcon(a) ? (b.setAttribute("display", "block"),
        b.setAttribute("transform", "translate(" + d + "," + c + ")"),
        a.icon.computeIconLocation()) : b.setAttribute("transform", "translate(" + d + "," + c + ")" + f);
        this.info_.isInsertionMarker && b.setAttribute("display", "none")
    }
    ;
    va.prototype.drawInlineInput_ = function(a) {
        var b = a.width
          , c = a.height
          , d = a.connectionOffsetY
          , f = a.connectionHeight + d;
        this.inlinePath_ += (0,
        p.moveTo)(a.xPos + a.connectionWidth, a.centerline - c / 2) + (0,
        p.lineOnAxis)("v", d) + a.shape.pathDown + (0,
        p.lineOnAxis)("v", c - f) + (0,
        p.lineOnAxis)("h", b - a.connectionWidth) + (0,
        p.lineOnAxis)("v", -c) + "z";
        this.positionInlineInputConnection_(a)
    }
    ;
    va.prototype.positionInlineInputConnection_ = function(a) {
        var b = a.centerline - a.height / 2;
        if (a.connectionModel) {
            var c = a.xPos + a.connectionWidth + a.connectionOffsetX;
            this.info_.RTL && (c *= -1);
            a.connectionModel.setOffsetInBlock(c, b + a.connectionOffsetY)
        }
    }
    ;
    va.prototype.positionStatementInputConnection_ = function(a) {
        var b = a.getLastInput();
        if (b.connectionModel) {
            var c = a.xPos + a.statementEdge + b.notchOffset;
            this.info_.RTL && (c *= -1);
            b.connectionModel.setOffsetInBlock(c, a.yPos)
        }
    }
    ;
    va.prototype.positionExternalValueConnection_ = function(a) {
        var b = a.getLastInput();
        if (b.connectionModel) {
            var c = a.xPos + a.width;
            this.info_.RTL && (c *= -1);
            b.connectionModel.setOffsetInBlock(c, a.yPos)
        }
    }
    ;
    va.prototype.positionPreviousConnection_ = function() {
        var a = this.info_.topRow;
        if (a.connection) {
            var b = a.xPos + a.notchOffset;
            a.connection.connectionModel.setOffsetInBlock(this.info_.RTL ? -b : b, 0)
        }
    }
    ;
    va.prototype.positionNextConnection_ = function() {
        var a = this.info_.bottomRow;
        if (a.connection) {
            var b = a.connection
              , c = b.xPos;
            b.connectionModel.setOffsetInBlock(this.info_.RTL ? -c : c, a.baseline)
        }
    }
    ;
    va.prototype.positionOutputConnection_ = function() {
        if (this.info_.outputConnection) {
            var a = this.info_.startX + this.info_.outputConnection.connectionOffsetX;
            this.block_.outputConnection.setOffsetInBlock(this.info_.RTL ? -a : a, this.info_.outputConnection.connectionOffsetY)
        }
    }
    ;
    var Nc = {
        InputConnection: function(a, b) {
            Nc.InputConnection.superClass_.constructor.call(this, a, b.connection);
            this.type |= m.INPUT;
            this.input = b;
            this.align = b.align;
            (this.connectedBlock = b.connection && b.connection.targetBlock() ? b.connection.targetBlock() : null) ? (a = this.connectedBlock.getHeightWidth(),
            this.connectedBlockWidth = a.width,
            this.connectedBlockHeight = a.height) : this.connectedBlockHeight = this.connectedBlockWidth = 0;
            this.connectionOffsetY = this.connectionOffsetX = 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Nc.InputConnection, xc.Connection);
    var ad = {
        ExternalValueInput: function(a, b) {
            ad.ExternalValueInput.superClass_.constructor.call(this, a, b);
            this.type |= m.EXTERNAL_VALUE_INPUT;
            this.height = this.connectedBlock ? this.connectedBlockHeight - this.constants_.TAB_OFFSET_FROM_TOP - this.constants_.MEDIUM_PADDING : this.shape.height;
            this.width = this.shape.width + this.constants_.EXTERNAL_VALUE_INPUT_PADDING;
            this.connectionOffsetY = this.constants_.TAB_OFFSET_FROM_TOP;
            this.connectionHeight = this.shape.height;
            this.connectionWidth = this.shape.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ad.ExternalValueInput, Nc.InputConnection);
    var td = {
        Field: function(a, b, c) {
            td.Field.superClass_.constructor.call(this, a);
            this.field = b;
            this.isEditable = b.EDITABLE;
            this.flipRtl = b.getFlipRtl();
            this.type |= m.FIELD;
            a = this.field.getSize();
            this.height = a.height;
            this.width = a.width;
            this.parentInput = c
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(td.Field, Rb);
    var ud = {
        Hat: function(a) {
            ud.Hat.superClass_.constructor.call(this, a);
            this.type |= m.HAT;
            this.height = this.constants_.START_HAT.height;
            this.width = this.constants_.START_HAT.width;
            this.ascenderHeight = this.height
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ud.Hat, Rb);
    var vd = {
        Icon: function(a, b) {
            vd.Icon.superClass_.constructor.call(this, a);
            this.icon = b;
            this.isVisible = b.isVisible();
            this.type |= m.ICON;
            a = b.getCorrectedSize();
            this.height = a.height;
            this.width = a.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(vd.Icon, Rb);
    var ib = {
        InRowSpacer: function(a, b) {
            ib.InRowSpacer.superClass_.constructor.call(this, a);
            this.type = this.type | m.SPACER | m.IN_ROW_SPACER;
            this.width = b;
            this.height = this.constants_.SPACER_DEFAULT_HEIGHT
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ib.InRowSpacer, Rb);
    var bd = {
        InlineInput: function(a, b) {
            bd.InlineInput.superClass_.constructor.call(this, a, b);
            this.type |= m.INLINE_INPUT;
            this.connectedBlock ? (this.width = this.connectedBlockWidth,
            this.height = this.connectedBlockHeight) : (this.height = this.constants_.EMPTY_INLINE_INPUT_HEIGHT,
            this.width = this.constants_.EMPTY_INLINE_INPUT_PADDING);
            this.connectionHeight = this.isDynamicShape ? this.shape.height(this.height) : this.shape.height;
            this.connectionWidth = this.isDynamicShape ? this.shape.width(this.height) : this.shape.width;
            this.connectedBlock || (this.width += this.connectionWidth * (this.isDynamicShape ? 2 : 1));
            this.connectionOffsetY = this.isDynamicShape ? this.shape.connectionOffsetY(this.connectionHeight) : this.constants_.TAB_OFFSET_FROM_TOP;
            this.connectionOffsetX = this.isDynamicShape ? this.shape.connectionOffsetX(this.connectionWidth) : 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(bd.InlineInput, Nc.InputConnection);
    var zc = {
        InputRow: function(a) {
            zc.InputRow.superClass_.constructor.call(this, a);
            this.type |= m.INPUT_ROW;
            this.connectedBlockWidths = 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(zc.InputRow, Gb);
    zc.InputRow.prototype.measure = function() {
        this.width = this.minWidth;
        this.height = this.minHeight;
        for (var a = 0, b = 0; b < this.elements.length; b++) {
            var c = this.elements[b];
            this.width += c.width;
            m.isInput(c) && (m.isStatementInput(c) ? a += c.connectedBlockWidth : m.isExternalInput(c) && 0 !== c.connectedBlockWidth && (a += c.connectedBlockWidth - c.connectionWidth));
            m.isSpacer(c) || (this.height = Math.max(this.height, c.height))
        }
        this.connectedBlockWidths = a;
        this.widthWithConnectedBlocks = this.width + a
    }
    ;
    zc.InputRow.prototype.endsWithElemSpacer = function() {
        return !this.hasExternalInput && !this.hasStatement
    }
    ;
    var wd = {
        JaggedEdge: function(a) {
            wd.JaggedEdge.superClass_.constructor.call(this, a);
            this.type |= m.JAGGED_EDGE;
            this.height = this.constants_.JAGGED_TEETH.height;
            this.width = this.constants_.JAGGED_TEETH.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(wd.JaggedEdge, Rb);
    var v = {
        ASTNode: function(a, b, c) {
            if (!b)
                throw Error("Cannot create a node without a location.");
            this.type_ = a;
            this.isConnection_ = v.ASTNode.isConnectionType_(a);
            this.location_ = b;
            this.wsCoordinate_ = null;
            this.processParams_(c || null)
        }
    };
    v.ASTNode.types = {
        FIELD: "field",
        BLOCK: "block",
        INPUT: "input",
        OUTPUT: "output",
        NEXT: "next",
        PREVIOUS: "previous",
        STACK: "stack",
        WORKSPACE: "workspace"
    };
    v.ASTNode.NAVIGATE_ALL_FIELDS = !1;
    v.ASTNode.DEFAULT_OFFSET_Y = -20;
    v.ASTNode.isConnectionType_ = function(a) {
        switch (a) {
        case v.ASTNode.types.PREVIOUS:
        case v.ASTNode.types.NEXT:
        case v.ASTNode.types.INPUT:
        case v.ASTNode.types.OUTPUT:
            return !0
        }
        return !1
    }
    ;
    v.ASTNode.createFieldNode = function(a) {
        return a ? new v.ASTNode(v.ASTNode.types.FIELD,a) : null
    }
    ;
    v.ASTNode.createConnectionNode = function(a) {
        if (!a)
            return null;
        var b = a.type;
        return b === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE || b === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT && a.getParentInput() ? v.ASTNode.createInputNode(a.getParentInput()) : b === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT ? new v.ASTNode(v.ASTNode.types.NEXT,a) : b === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE ? new v.ASTNode(v.ASTNode.types.OUTPUT,a) : b === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT ? new v.ASTNode(v.ASTNode.types.PREVIOUS,a) : null
    }
    ;
    v.ASTNode.createInputNode = function(a) {
        return a && a.connection ? new v.ASTNode(v.ASTNode.types.INPUT,a.connection) : null
    }
    ;
    v.ASTNode.createBlockNode = function(a) {
        return a ? new v.ASTNode(v.ASTNode.types.BLOCK,a) : null
    }
    ;
    v.ASTNode.createStackNode = function(a) {
        return a ? new v.ASTNode(v.ASTNode.types.STACK,a) : null
    }
    ;
    v.ASTNode.createWorkspaceNode = function(a, b) {
        return b && a ? new v.ASTNode(v.ASTNode.types.WORKSPACE,a,{
            wsCoordinate: b
        }) : null
    }
    ;
    var xd = function(a) {
        var b = a.outputConnection;
        if (!b || a.previousConnection && a.previousConnection.isConnected())
            b = a.previousConnection;
        return b
    };
    v.ASTNode.createTopNode = function(a) {
        var b = xd(a);
        return b ? v.ASTNode.createConnectionNode(b) : v.ASTNode.createBlockNode(a)
    }
    ;
    v.ASTNode.prototype.processParams_ = function(a) {
        a && a.wsCoordinate && (this.wsCoordinate_ = a.wsCoordinate)
    }
    ;
    v.ASTNode.prototype.getLocation = function() {
        return this.location_
    }
    ;
    v.ASTNode.prototype.getType = function() {
        return this.type_
    }
    ;
    v.ASTNode.prototype.getWsCoordinate = function() {
        return this.wsCoordinate_
    }
    ;
    v.ASTNode.prototype.isConnection = function() {
        return this.isConnection_
    }
    ;
    v.ASTNode.prototype.findNextForInput_ = function() {
        var a = this.location_.getParentInput()
          , b = a.getSourceBlock();
        for (a = b.inputList.indexOf(a) + 1; a < b.inputList.length; a++) {
            for (var c = b.inputList[a], d = c.fieldRow, f = 0; f < d.length; f++) {
                var g = d[f];
                if (g.isClickable() || v.ASTNode.NAVIGATE_ALL_FIELDS)
                    return v.ASTNode.createFieldNode(g)
            }
            if (c.connection)
                return v.ASTNode.createInputNode(c)
        }
        return null
    }
    ;
    v.ASTNode.prototype.findNextForField_ = function() {
        var a = this.location_
          , b = a.getParentInput()
          , c = a.getSourceBlock()
          , d = c.inputList.indexOf(b);
        for (a = b.fieldRow.indexOf(a) + 1; d < c.inputList.length; d++) {
            b = c.inputList[d];
            for (var f = b.fieldRow; a < f.length; ) {
                if (f[a].isClickable() || v.ASTNode.NAVIGATE_ALL_FIELDS)
                    return v.ASTNode.createFieldNode(f[a]);
                a++
            }
            a = 0;
            if (b.connection)
                return v.ASTNode.createInputNode(b)
        }
        return null
    }
    ;
    v.ASTNode.prototype.findPrevForInput_ = function() {
        for (var a = this.location_.getParentInput(), b = a.getSourceBlock(), c = b.inputList.indexOf(a); 0 <= c; c--) {
            var d = b.inputList[c];
            if (d.connection && d !== a)
                return v.ASTNode.createInputNode(d);
            d = d.fieldRow;
            for (var f = d.length - 1; 0 <= f; f--) {
                var g = d[f];
                if (g.isClickable() || v.ASTNode.NAVIGATE_ALL_FIELDS)
                    return v.ASTNode.createFieldNode(g)
            }
        }
        return null
    }
    ;
    v.ASTNode.prototype.findPrevForField_ = function() {
        var a = this.location_
          , b = a.getParentInput()
          , c = a.getSourceBlock()
          , d = c.inputList.indexOf(b);
        for (a = b.fieldRow.indexOf(a) - 1; 0 <= d; d--) {
            var f = c.inputList[d];
            if (f.connection && f !== b)
                return v.ASTNode.createInputNode(f);
            for (f = f.fieldRow; -1 < a; ) {
                if (f[a].isClickable() || v.ASTNode.NAVIGATE_ALL_FIELDS)
                    return v.ASTNode.createFieldNode(f[a]);
                a--
            }
            0 <= d - 1 && (a = c.inputList[d - 1].fieldRow.length - 1)
        }
        return null
    }
    ;
    v.ASTNode.prototype.navigateBetweenStacks_ = function(a) {
        var b = this.getLocation();
        b.getSourceBlock && (b = b.getSourceBlock());
        if (!b || !b.workspace)
            return null;
        var c = b.getRootBlock();
        b = c.workspace.getTopBlocks(!0);
        for (var d = 0; d < b.length; d++)
            if (c.id === b[d].id)
                return a = d + (a ? 1 : -1),
                -1 === a || a === b.length ? null : v.ASTNode.createStackNode(b[a]);
        throw Error("Couldn't find " + (a ? "next" : "previous") + " stack?!");
    }
    ;
    v.ASTNode.prototype.findTopASTNodeForBlock_ = function(a) {
        var b = xd(a);
        return b ? v.ASTNode.createConnectionNode(b) : v.ASTNode.createBlockNode(a)
    }
    ;
    v.ASTNode.prototype.getOutAstNodeForBlock_ = function(a) {
        if (!a)
            return null;
        a = a.getTopStackBlock();
        var b = xd(a);
        return b && b.targetConnection && b.targetConnection.getParentInput() ? v.ASTNode.createInputNode(b.targetConnection.getParentInput()) : v.ASTNode.createStackNode(a)
    }
    ;
    v.ASTNode.prototype.findFirstFieldOrInput_ = function(a) {
        a = a.inputList;
        for (var b = 0; b < a.length; b++) {
            for (var c = a[b], d = c.fieldRow, f = 0; f < d.length; f++) {
                var g = d[f];
                if (g.isClickable() || v.ASTNode.NAVIGATE_ALL_FIELDS)
                    return v.ASTNode.createFieldNode(g)
            }
            if (c.connection)
                return v.ASTNode.createInputNode(c)
        }
        return null
    }
    ;
    v.ASTNode.prototype.getSourceBlock = function() {
        return this.getType() === v.ASTNode.types.BLOCK ? this.getLocation() : this.getType() === v.ASTNode.types.STACK ? this.getLocation() : this.getType() === v.ASTNode.types.WORKSPACE ? null : this.getLocation().getSourceBlock()
    }
    ;
    v.ASTNode.prototype.next = function() {
        switch (this.type_) {
        case v.ASTNode.types.STACK:
            return this.navigateBetweenStacks_(!0);
        case v.ASTNode.types.OUTPUT:
            return v.ASTNode.createBlockNode(this.location_.getSourceBlock());
        case v.ASTNode.types.FIELD:
            return this.findNextForField_();
        case v.ASTNode.types.INPUT:
            return this.findNextForInput_();
        case v.ASTNode.types.BLOCK:
            return v.ASTNode.createConnectionNode(this.location_.nextConnection);
        case v.ASTNode.types.PREVIOUS:
            return v.ASTNode.createBlockNode(this.location_.getSourceBlock());
        case v.ASTNode.types.NEXT:
            return v.ASTNode.createConnectionNode(this.location_.targetConnection)
        }
        return null
    }
    ;
    v.ASTNode.prototype.in = function() {
        switch (this.type_) {
        case v.ASTNode.types.WORKSPACE:
            var a = this.location_.getTopBlocks(!0);
            if (0 < a.length)
                return v.ASTNode.createStackNode(a[0]);
            break;
        case v.ASTNode.types.STACK:
            return this.findTopASTNodeForBlock_(this.location_);
        case v.ASTNode.types.BLOCK:
            return this.findFirstFieldOrInput_(this.location_);
        case v.ASTNode.types.INPUT:
            return v.ASTNode.createConnectionNode(this.location_.targetConnection)
        }
        return null
    }
    ;
    v.ASTNode.prototype.prev = function() {
        switch (this.type_) {
        case v.ASTNode.types.STACK:
            return this.navigateBetweenStacks_(!1);
        case v.ASTNode.types.FIELD:
            return this.findPrevForField_();
        case v.ASTNode.types.INPUT:
            return this.findPrevForInput_();
        case v.ASTNode.types.BLOCK:
            var a = xd(this.location_);
            return v.ASTNode.createConnectionNode(a);
        case v.ASTNode.types.PREVIOUS:
            if ((a = this.location_.targetConnection) && !a.getParentInput())
                return v.ASTNode.createConnectionNode(a);
            break;
        case v.ASTNode.types.NEXT:
            return v.ASTNode.createBlockNode(this.location_.getSourceBlock())
        }
        return null
    }
    ;
    v.ASTNode.prototype.out = function() {
        switch (this.type_) {
        case v.ASTNode.types.STACK:
            var a = this.location_
              , b = a.getRelativeToSurfaceXY();
            b = new E(b.x,b.y + v.ASTNode.DEFAULT_OFFSET_Y);
            return v.ASTNode.createWorkspaceNode(a.workspace, b);
        case v.ASTNode.types.OUTPUT:
            return a = this.location_,
            (b = a.targetConnection) ? v.ASTNode.createConnectionNode(b) : v.ASTNode.createStackNode(a.getSourceBlock());
        case v.ASTNode.types.FIELD:
            return v.ASTNode.createBlockNode(this.location_.getSourceBlock());
        case v.ASTNode.types.INPUT:
            return v.ASTNode.createBlockNode(this.location_.getSourceBlock());
        case v.ASTNode.types.BLOCK:
            return this.getOutAstNodeForBlock_(this.location_);
        case v.ASTNode.types.PREVIOUS:
            return this.getOutAstNodeForBlock_(this.location_.getSourceBlock());
        case v.ASTNode.types.NEXT:
            return this.getOutAstNodeForBlock_(this.location_.getSourceBlock())
        }
        return null
    }
    ;
    var hc = {
        MarkerMove: function(a, b, c, d) {
            var f = a ? a.workspace.id : void 0;
            d && d.getType() === v.ASTNode.types.WORKSPACE && (f = d.getLocation().id);
            hc.MarkerMove.superClass_.constructor.call(this, f);
            this.blockId = a ? a.id : null;
            this.oldNode = c;
            this.newNode = d;
            this.isCursor = b
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(hc.MarkerMove, ob.UiBase);
    hc.MarkerMove.prototype.type = h.MARKER_MOVE;
    hc.MarkerMove.prototype.toJson = function() {
        var a = hc.MarkerMove.superClass_.toJson.call(this);
        a.isCursor = this.isCursor;
        a.blockId = this.blockId;
        a.oldNode = this.oldNode;
        a.newNode = this.newNode;
        return a
    }
    ;
    hc.MarkerMove.prototype.fromJson = function(a) {
        hc.MarkerMove.superClass_.fromJson.call(this, a);
        this.isCursor = a.isCursor;
        this.blockId = a.blockId;
        this.oldNode = a.oldNode;
        this.newNode = a.newNode
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.MARKER_MOVE, hc.MarkerMove);
    var ja = function(a, b, c) {
        this.workspace_ = a;
        this.marker_ = c;
        this.parent_ = null;
        this.constants_ = b;
        this.currentMarkerSvg = null;
        a = this.isCursor() ? this.constants_.CURSOR_COLOUR : this.constants_.MARKER_COLOUR;
        this.colour_ = c.colour || a
    };
    ja.prototype.getSvgRoot = function() {
        return this.svgGroup_
    }
    ;
    ja.prototype.getMarker = function() {
        return this.marker_
    }
    ;
    ja.prototype.isCursor = function() {
        return "cursor" === this.marker_.type
    }
    ;
    ja.prototype.createDom = function() {
        var a = this.isCursor() ? "blocklyCursor" : "blocklyMarker";
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": a
        }, null);
        this.createDomInternal_();
        return this.svgGroup_
    }
    ;
    ja.prototype.setParent_ = function(a) {
        this.isCursor() ? (this.parent_ && this.parent_.setCursorSvg(null),
        a.setCursorSvg(this.getSvgRoot())) : (this.parent_ && this.parent_.setMarkerSvg(null),
        a.setMarkerSvg(this.getSvgRoot()));
        this.parent_ = a
    }
    ;
    ja.prototype.draw = function(a, b) {
        if (b) {
            this.constants_ = this.workspace_.getRenderer().getConstants();
            var c = this.isCursor() ? this.constants_.CURSOR_COLOUR : this.constants_.MARKER_COLOUR;
            this.colour_ = this.marker_.colour || c;
            this.applyColour_(b);
            this.showAtLocation_(b);
            this.fireMarkerEvent_(a, b);
            a = this.currentMarkerSvg.childNodes[0];
            void 0 !== a && a.beginElement && a.beginElement()
        } else
            this.hide()
    }
    ;
    ja.prototype.showAtLocation_ = function(a) {
        var b = a.getLocation().type;
        a.getType() === v.ASTNode.types.BLOCK ? this.showWithBlock_(a) : a.getType() === v.ASTNode.types.OUTPUT ? this.showWithOutput_(a) : b === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE ? this.showWithInput_(a) : b === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT ? this.showWithNext_(a) : a.getType() === v.ASTNode.types.PREVIOUS ? this.showWithPrevious_(a) : a.getType() === v.ASTNode.types.FIELD ? this.showWithField_(a) : a.getType() === v.ASTNode.types.WORKSPACE ? this.showWithCoordinates_(a) : a.getType() === v.ASTNode.types.STACK && this.showWithStack_(a)
    }
    ;
    ja.prototype.showWithBlockPrevOutput_ = function(a) {
        a = a.getSourceBlock();
        var b = a.width
          , c = a.height
          , d = .75 * c
          , f = this.constants_.CURSOR_BLOCK_PADDING;
        a.previousConnection ? (c = this.constants_.shapeFor(a.previousConnection),
        this.positionPrevious_(b, f, d, c)) : a.outputConnection ? (d = this.constants_.shapeFor(a.outputConnection),
        this.positionOutput_(b, c, d)) : this.positionBlock_(b, f, d);
        this.setParent_(a);
        this.showCurrent_()
    }
    ;
    ja.prototype.showWithBlock_ = function(a) {
        this.showWithBlockPrevOutput_(a)
    }
    ;
    ja.prototype.showWithPrevious_ = function(a) {
        this.showWithBlockPrevOutput_(a)
    }
    ;
    ja.prototype.showWithOutput_ = function(a) {
        this.showWithBlockPrevOutput_(a)
    }
    ;
    ja.prototype.showWithCoordinates_ = function(a) {
        var b = a.getWsCoordinate();
        a = b.x;
        b = b.y;
        this.workspace_.RTL && (a -= this.constants_.CURSOR_WS_WIDTH);
        this.positionLine_(a, b, this.constants_.CURSOR_WS_WIDTH);
        this.setParent_(this.workspace_);
        this.showCurrent_()
    }
    ;
    ja.prototype.showWithField_ = function(a) {
        a = a.getLocation();
        var b = a.getSize().width
          , c = a.getSize().height;
        this.positionRect_(0, 0, b, c);
        this.setParent_(a);
        this.showCurrent_()
    }
    ;
    ja.prototype.showWithInput_ = function(a) {
        a = a.getLocation();
        var b = a.getSourceBlock();
        this.positionInput_(a);
        this.setParent_(b);
        this.showCurrent_()
    }
    ;
    ja.prototype.showWithNext_ = function(a) {
        var b = a.getLocation();
        a = b.getSourceBlock();
        var c = 0;
        b = b.getOffsetInBlock().y;
        var d = a.getHeightWidth().width;
        this.workspace_.RTL && (c = -d);
        this.positionLine_(c, b, d);
        this.setParent_(a);
        this.showCurrent_()
    }
    ;
    ja.prototype.showWithStack_ = function(a) {
        a = a.getLocation();
        var b = a.getHeightWidth()
          , c = b.width + this.constants_.CURSOR_STACK_PADDING;
        b = b.height + this.constants_.CURSOR_STACK_PADDING;
        var d = -this.constants_.CURSOR_STACK_PADDING / 2
          , f = -this.constants_.CURSOR_STACK_PADDING / 2
          , g = d;
        this.workspace_.RTL && (g = -(c + d));
        this.positionRect_(g, f, c, b);
        this.setParent_(a);
        this.showCurrent_()
    }
    ;
    ja.prototype.showCurrent_ = function() {
        this.hide();
        this.currentMarkerSvg.style.display = ""
    }
    ;
    ja.prototype.positionBlock_ = function(a, b, c) {
        a = (0,
        p.moveBy)(-b, c) + (0,
        p.lineOnAxis)("V", -b) + (0,
        p.lineOnAxis)("H", a + 2 * b) + (0,
        p.lineOnAxis)("V", c);
        this.markerBlock_.setAttribute("d", a);
        this.workspace_.RTL && this.flipRtl_(this.markerBlock_);
        this.currentMarkerSvg = this.markerBlock_
    }
    ;
    ja.prototype.positionInput_ = function(a) {
        var b = a.getOffsetInBlock().x
          , c = a.getOffsetInBlock().y;
        a = (0,
        p.moveTo)(0, 0) + this.constants_.shapeFor(a).pathDown;
        this.markerInput_.setAttribute("d", a);
        this.markerInput_.setAttribute("transform", "translate(" + b + "," + c + ")" + (this.workspace_.RTL ? " scale(-1 1)" : ""));
        this.currentMarkerSvg = this.markerInput_
    }
    ;
    ja.prototype.positionLine_ = function(a, b, c) {
        this.markerSvgLine_.setAttribute("x", a);
        this.markerSvgLine_.setAttribute("y", b);
        this.markerSvgLine_.setAttribute("width", c);
        this.currentMarkerSvg = this.markerSvgLine_
    }
    ;
    ja.prototype.positionOutput_ = function(a, b, c) {
        a = (0,
        p.moveBy)(a, 0) + (0,
        p.lineOnAxis)("h", -(a - c.width)) + (0,
        p.lineOnAxis)("v", this.constants_.TAB_OFFSET_FROM_TOP) + c.pathDown + (0,
        p.lineOnAxis)("V", b) + (0,
        p.lineOnAxis)("H", a);
        this.markerBlock_.setAttribute("d", a);
        this.workspace_.RTL && this.flipRtl_(this.markerBlock_);
        this.currentMarkerSvg = this.markerBlock_
    }
    ;
    ja.prototype.positionPrevious_ = function(a, b, c, d) {
        a = (0,
        p.moveBy)(-b, c) + (0,
        p.lineOnAxis)("V", -b) + (0,
        p.lineOnAxis)("H", this.constants_.NOTCH_OFFSET_LEFT) + d.pathLeft + (0,
        p.lineOnAxis)("H", a + 2 * b) + (0,
        p.lineOnAxis)("V", c);
        this.markerBlock_.setAttribute("d", a);
        this.workspace_.RTL && this.flipRtl_(this.markerBlock_);
        this.currentMarkerSvg = this.markerBlock_
    }
    ;
    ja.prototype.positionRect_ = function(a, b, c, d) {
        this.markerSvgRect_.setAttribute("x", a);
        this.markerSvgRect_.setAttribute("y", b);
        this.markerSvgRect_.setAttribute("width", c);
        this.markerSvgRect_.setAttribute("height", d);
        this.currentMarkerSvg = this.markerSvgRect_
    }
    ;
    ja.prototype.flipRtl_ = function(a) {
        a.setAttribute("transform", "scale(-1 1)")
    }
    ;
    ja.prototype.hide = function() {
        this.markerSvgLine_.style.display = "none";
        this.markerSvgRect_.style.display = "none";
        this.markerInput_.style.display = "none";
        this.markerBlock_.style.display = "none"
    }
    ;
    ja.prototype.fireMarkerEvent_ = function(a, b) {
        var c = b.getSourceBlock();
        a = new ((0,
        h.get)(h.MARKER_MOVE))(c,this.isCursor(),a,b);
        (0,
        h.fire)(a)
    }
    ;
    ja.prototype.getBlinkProperties_ = function() {
        return {
            attributeType: "XML",
            attributeName: "fill",
            dur: "1s",
            values: this.colour_ + ";transparent;transparent;",
            repeatCount: "indefinite"
        }
    }
    ;
    ja.prototype.createDomInternal_ = function() {
        this.markerSvg_ = (0,
        l.createSvgElement)(q.G, {
            width: this.constants_.CURSOR_WS_WIDTH,
            height: this.constants_.WS_CURSOR_HEIGHT
        }, this.svgGroup_);
        this.markerSvgLine_ = (0,
        l.createSvgElement)(q.RECT, {
            width: this.constants_.CURSOR_WS_WIDTH,
            height: this.constants_.WS_CURSOR_HEIGHT,
            style: "display: none"
        }, this.markerSvg_);
        this.markerSvgRect_ = (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyVerticalMarker",
            rx: 10,
            ry: 10,
            style: "display: none"
        }, this.markerSvg_);
        this.markerInput_ = (0,
        l.createSvgElement)(q.PATH, {
            transform: "",
            style: "display: none"
        }, this.markerSvg_);
        this.markerBlock_ = (0,
        l.createSvgElement)(q.PATH, {
            transform: "",
            style: "display: none",
            fill: "none",
            "stroke-width": this.constants_.CURSOR_STROKE_WIDTH
        }, this.markerSvg_);
        if (this.isCursor()) {
            var a = this.getBlinkProperties_();
            (0,
            l.createSvgElement)(q.ANIMATE, a, this.markerSvgLine_);
            (0,
            l.createSvgElement)(q.ANIMATE, a, this.markerInput_);
            a.attributeName = "stroke";
            (0,
            l.createSvgElement)(q.ANIMATE, a, this.markerBlock_)
        }
        return this.markerSvg_
    }
    ;
    ja.prototype.applyColour_ = function(a) {
        this.markerSvgLine_.setAttribute("fill", this.colour_);
        this.markerSvgRect_.setAttribute("stroke", this.colour_);
        this.markerInput_.setAttribute("fill", this.colour_);
        this.markerBlock_.setAttribute("stroke", this.colour_);
        this.isCursor() && (a = this.colour_ + ";transparent;transparent;",
        this.markerSvgLine_.firstChild.setAttribute("values", a),
        this.markerInput_.firstChild.setAttribute("values", a),
        this.markerBlock_.firstChild.setAttribute("values", a))
    }
    ;
    ja.prototype.dispose = function() {
        this.svgGroup_ && (0,
        l.removeNode)(this.svgGroup_)
    }
    ;
    var yd = {
        NextConnection: function(a, b) {
            yd.NextConnection.superClass_.constructor.call(this, a, b);
            this.type |= m.NEXT_CONNECTION;
            this.height = this.shape.height;
            this.width = this.shape.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(yd.NextConnection, xc.Connection);
    var zd = {
        OutputConnection: function(a, b) {
            zd.OutputConnection.superClass_.constructor.call(this, a, b);
            this.type |= m.OUTPUT_CONNECTION;
            this.height = this.isDynamicShape ? 0 : this.shape.height;
            this.startX = this.width = this.isDynamicShape ? 0 : this.shape.width;
            this.connectionOffsetY = this.constants_.TAB_OFFSET_FROM_TOP;
            this.connectionOffsetX = 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(zd.OutputConnection, xc.Connection);
    var Pa = function(a, b, c) {
        this.constants = c;
        this.svgRoot = a;
        this.svgPath = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyPath"
        }, this.svgRoot);
        this.style = b;
        this.markerSvg = this.cursorSvg = null
    };
    Pa.prototype.setPath = function(a) {
        this.svgPath.setAttribute("d", a)
    }
    ;
    Pa.prototype.flipRTL = function() {
        this.svgPath.setAttribute("transform", "scale(-1 1)")
    }
    ;
    Pa.prototype.setCursorSvg = function(a) {
        a ? (this.svgRoot.appendChild(a),
        this.cursorSvg = a) : this.cursorSvg = null
    }
    ;
    Pa.prototype.setMarkerSvg = function(a) {
        a ? (this.cursorSvg ? this.svgRoot.insertBefore(a, this.cursorSvg) : this.svgRoot.appendChild(a),
        this.markerSvg = a) : this.markerSvg = null
    }
    ;
    Pa.prototype.applyColour = function(a) {
        this.svgPath.setAttribute("stroke", this.style.colourTertiary);
        this.svgPath.setAttribute("fill", this.style.colourPrimary);
        this.updateShadow_(a.isShadow());
        this.updateDisabled_(!a.isEnabled() || a.getInheritedDisabled())
    }
    ;
    Pa.prototype.setStyle = function(a) {
        this.style = a
    }
    ;
    Pa.prototype.setClass_ = function(a, b) {
        b ? (0,
        l.addClass)(this.svgRoot, a) : (0,
        l.removeClass)(this.svgRoot, a)
    }
    ;
    Pa.prototype.updateHighlighted = function(a) {
        a ? this.svgPath.setAttribute("filter", "url(#" + this.constants.embossFilterId + ")") : this.svgPath.setAttribute("filter", "none")
    }
    ;
    Pa.prototype.updateShadow_ = function(a) {
        a && (this.svgPath.setAttribute("stroke", "none"),
        this.svgPath.setAttribute("fill", this.style.colourSecondary))
    }
    ;
    Pa.prototype.updateDisabled_ = function(a) {
        this.setClass_("blocklyDisabled", a);
        a && this.svgPath.setAttribute("fill", "url(#" + this.constants.disabledPatternId + ")")
    }
    ;
    Pa.prototype.updateSelected = function(a) {
        this.setClass_("blocklySelected", a)
    }
    ;
    Pa.prototype.updateDraggingDelete = function(a) {
        this.setClass_("blocklyDraggingDelete", a)
    }
    ;
    Pa.prototype.updateInsertionMarker = function(a) {
        this.setClass_("blocklyInsertionMarker", a)
    }
    ;
    Pa.prototype.updateMovable = function(a) {
        this.setClass_("blocklyDraggable", a)
    }
    ;
    Pa.prototype.updateReplacementFade = function(a) {
        this.setClass_("blocklyReplaceable", a)
    }
    ;
    Pa.prototype.updateShapeForInputHighlight = function(a, b) {}
    ;
    var Ad = {
        PreviousConnection: function(a, b) {
            Ad.PreviousConnection.superClass_.constructor.call(this, a, b);
            this.type |= m.PREVIOUS_CONNECTION;
            this.height = this.shape.height;
            this.width = this.shape.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ad.PreviousConnection, xc.Connection);
    e.module$exports$Blockly$Input = {
        Align: {
            LEFT: -1,
            CENTRE: 0,
            RIGHT: 1
        },
        Input: function(a, b, c, d) {
            if (a !== e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && !b)
                throw Error("Value inputs and statement inputs must have non-empty name.");
            this.type = a;
            this.name = b;
            this.sourceBlock_ = c;
            this.connection = d;
            this.fieldRow = []
        }
    };
    e.module$exports$Blockly$Input.Input.prototype.align = e.module$exports$Blockly$Input.Align.LEFT;
    e.module$exports$Blockly$Input.Input.prototype.visible_ = !0;
    e.module$exports$Blockly$Input.Input.prototype.getSourceBlock = function() {
        return this.sourceBlock_
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.appendField = function(a, b) {
        this.insertFieldAt(this.fieldRow.length, a, b);
        return this
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.insertFieldAt = function(a, b, c) {
        if (0 > a || a > this.fieldRow.length)
            throw Error("index " + a + " out of bounds.");
        if (!(b || "" === b && c))
            return a;
        "string" === typeof b && (b = (0,
        mb.fromJson)({
            type: "field_label",
            text: b
        }));
        b.setSourceBlock(this.sourceBlock_);
        this.sourceBlock_.rendered && (b.init(),
        b.applyColour());
        b.name = c;
        b.setVisible(this.isVisible());
        b.prefixField && (a = this.insertFieldAt(a, b.prefixField));
        this.fieldRow.splice(a, 0, b);
        a++;
        b.suffixField && (a = this.insertFieldAt(a, b.suffixField));
        this.sourceBlock_.rendered && (this.sourceBlock_ = this.sourceBlock_,
        this.sourceBlock_.render(),
        this.sourceBlock_.bumpNeighbours());
        return a
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.removeField = function(a, b) {
        for (var c = 0, d; d = this.fieldRow[c]; c++)
            if (d.name === a)
                return d.dispose(),
                this.fieldRow.splice(c, 1),
                this.sourceBlock_.rendered && (this.sourceBlock_ = this.sourceBlock_,
                this.sourceBlock_.render(),
                this.sourceBlock_.bumpNeighbours()),
                !0;
        if (b)
            return !1;
        throw Error('Field "' + a + '" not found.');
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.isVisible = function() {
        return this.visible_
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.setVisible = function(a) {
        var b = [];
        if (this.visible_ === a)
            return b;
        this.visible_ = a;
        for (var c = 0, d; d = this.fieldRow[c]; c++)
            d.setVisible(a);
        this.connection && (this.connection = this.connection,
        a ? b = this.connection.startTrackingAll() : this.connection.stopTrackingAll(),
        c = this.connection.targetBlock()) && (c.getSvgRoot().style.display = a ? "block" : "none");
        return b
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.markDirty = function() {
        for (var a = 0, b; b = this.fieldRow[a]; a++)
            b.markDirty()
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.setCheck = function(a) {
        if (!this.connection)
            throw Error("This input does not have a connection.");
        this.connection.setCheck(a);
        return this
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.setAlign = function(a) {
        this.align = a;
        this.sourceBlock_.rendered && (this.sourceBlock_ = this.sourceBlock_,
        this.sourceBlock_.render());
        return this
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.setShadowDom = function(a) {
        if (!this.connection)
            throw Error("This input does not have a connection.");
        this.connection.setShadowDom(a);
        return this
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.getShadowDom = function() {
        if (!this.connection)
            throw Error("This input does not have a connection.");
        return this.connection.getShadowDom()
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.init = function() {
        if (this.sourceBlock_.workspace.rendered)
            for (var a = 0; a < this.fieldRow.length; a++)
                this.fieldRow[a].init()
    }
    ;
    e.module$exports$Blockly$Input.Input.prototype.dispose = function() {
        for (var a = 0, b; b = this.fieldRow[a]; a++)
            b.dispose();
        this.connection && this.connection.dispose();
        this.sourceBlock_ = null
    }
    ;
    var Ac = {
        RoundCorner: function(a, b) {
            Ac.RoundCorner.superClass_.constructor.call(this, a);
            this.type = (b && "left" !== b ? m.RIGHT_ROUND_CORNER : m.LEFT_ROUND_CORNER) | m.CORNER;
            this.width = this.constants_.CORNER_RADIUS;
            this.height = this.constants_.CORNER_RADIUS / 2
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ac.RoundCorner, Rb);
    var cd = {
        SpacerRow: function(a, b, c) {
            cd.SpacerRow.superClass_.constructor.call(this, a);
            this.type = this.type | m.SPACER | m.BETWEEN_ROW_SPACER;
            this.width = c;
            this.height = b;
            this.followsStatement = !1;
            this.widthWithConnectedBlocks = 0;
            this.elements = [new ib.InRowSpacer(this.constants_,c)]
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(cd.SpacerRow, Gb);
    cd.SpacerRow.prototype.measure = function() {}
    ;
    var Bc = {
        SquareCorner: function(a, b) {
            Bc.SquareCorner.superClass_.constructor.call(this, a);
            this.type = (b && "left" !== b ? m.RIGHT_SQUARE_CORNER : m.LEFT_SQUARE_CORNER) | m.CORNER;
            this.width = this.height = this.constants_.NO_PADDING
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Bc.SquareCorner, Rb);
    var Oc = {
        StatementInput: function(a, b) {
            Oc.StatementInput.superClass_.constructor.call(this, a, b);
            this.type |= m.STATEMENT_INPUT;
            this.height = this.connectedBlock ? this.connectedBlockHeight + this.constants_.STATEMENT_BOTTOM_SPACER : this.constants_.EMPTY_STATEMENT_INPUT_HEIGHT;
            this.width = this.constants_.STATEMENT_INPUT_NOTCH_OFFSET + this.shape.width
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Oc.StatementInput, Nc.InputConnection);
    var Wb = {
        TopRow: function(a) {
            Wb.TopRow.superClass_.constructor.call(this, a);
            this.type |= m.TOP_ROW;
            this.ascenderHeight = this.capline = 0;
            this.hasPreviousConnection = !1;
            this.connection = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Wb.TopRow, Gb);
    Wb.TopRow.prototype.hasLeftSquareCorner = function(a) {
        var b = (a.hat ? "cap" === a.hat : this.constants_.ADD_START_HATS) && !a.outputConnection && !a.previousConnection
          , c = a.getPreviousBlock();
        return !!a.outputConnection || b || (c ? c.getNextBlock() === a : !1)
    }
    ;
    Wb.TopRow.prototype.hasRightSquareCorner = function(a) {
        return !0
    }
    ;
    Wb.TopRow.prototype.measure = function() {
        for (var a = 0, b = 0, c = 0, d = 0; d < this.elements.length; d++) {
            var f = this.elements[d];
            b += f.width;
            m.isSpacer(f) || (m.isHat(f) ? c = Math.max(c, f.ascenderHeight) : a = Math.max(a, f.height))
        }
        this.width = Math.max(this.minWidth, b);
        this.height = Math.max(this.minHeight, a) + c;
        this.capline = this.ascenderHeight = c;
        this.widthWithConnectedBlocks = this.width
    }
    ;
    Wb.TopRow.prototype.startsWithElemSpacer = function() {
        return !1
    }
    ;
    Wb.TopRow.prototype.endsWithElemSpacer = function() {
        return !1
    }
    ;
    var qa = function(a, b) {
        this.block_ = b;
        this.renderer_ = a;
        this.constants_ = this.renderer_.getConstants();
        this.outputConnection = b.outputConnection ? new zd.OutputConnection(this.constants_,b.outputConnection) : null;
        this.isInline = b.getInputsInline() && !b.isCollapsed();
        this.isCollapsed = b.isCollapsed();
        this.isInsertionMarker = b.isInsertionMarker();
        this.RTL = b.RTL;
        this.statementEdge = this.width = this.widthWithChildren = this.height = 0;
        this.rows = [];
        this.inputRows = [];
        this.hiddenIcons = [];
        this.topRow = new Wb.TopRow(this.constants_);
        this.bottomRow = new Qb.BottomRow(this.constants_);
        this.startY = this.startX = 0
    };
    qa.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    qa.prototype.measure = function() {
        this.createRows_();
        this.addElemSpacing_();
        this.addRowSpacing_();
        this.computeBounds_();
        this.alignRowElements_();
        this.finalize_()
    }
    ;
    qa.prototype.createRows_ = function() {
        this.populateTopRow_();
        this.rows.push(this.topRow);
        var a = new zc.InputRow(this.constants_);
        this.inputRows.push(a);
        for (var b = this.block_.getIcons(), c = 0, d; d = b[c]; c++) {
            var f = new vd.Icon(this.constants_,d);
            this.isCollapsed && d.collapseHidden ? this.hiddenIcons.push(f) : a.elements.push(f)
        }
        d = null;
        for (b = 0; c = this.block_.inputList[b]; b++)
            if (c.isVisible()) {
                this.shouldStartNewRow_(c, d) && (this.rows.push(a),
                a = new zc.InputRow(this.constants_),
                this.inputRows.push(a));
                for (d = 0; f = c.fieldRow[d]; d++)
                    a.elements.push(new td.Field(this.constants_,f,c));
                this.addInput_(c, a);
                d = c
            }
        this.isCollapsed && (a.hasJaggedEdge = !0,
        a.elements.push(new wd.JaggedEdge(this.constants_)));
        (a.elements.length || a.hasDummyInput) && this.rows.push(a);
        this.populateBottomRow_();
        this.rows.push(this.bottomRow)
    }
    ;
    qa.prototype.populateTopRow_ = function() {
        var a = !!this.block_.previousConnection
          , b = (this.block_.hat ? "cap" === this.block_.hat : this.constants_.ADD_START_HATS) && !this.outputConnection && !a
          , c = this.topRow.hasLeftSquareCorner(this.block_) ? Bc.SquareCorner : Ac.RoundCorner;
        this.topRow.elements.push(new c(this.constants_));
        b ? (a = new ud.Hat(this.constants_),
        this.topRow.elements.push(a),
        this.topRow.capline = a.ascenderHeight) : a && (this.topRow.hasPreviousConnection = !0,
        this.topRow.connection = new Ad.PreviousConnection(this.constants_,this.block_.previousConnection),
        this.topRow.elements.push(this.topRow.connection));
        this.block_.inputList.length && this.block_.inputList[0].type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT && !this.block_.isCollapsed() ? this.topRow.minHeight = this.constants_.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT : this.topRow.minHeight = this.constants_.TOP_ROW_MIN_HEIGHT;
        c = this.topRow.hasRightSquareCorner(this.block_) ? Bc.SquareCorner : Ac.RoundCorner;
        this.topRow.elements.push(new c(this.constants_,"right"))
    }
    ;
    qa.prototype.populateBottomRow_ = function() {
        this.bottomRow.hasNextConnection = !!this.block_.nextConnection;
        this.bottomRow.minHeight = this.block_.inputList.length && this.block_.inputList[this.block_.inputList.length - 1].type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT ? this.constants_.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT : this.constants_.BOTTOM_ROW_MIN_HEIGHT;
        this.bottomRow.hasLeftSquareCorner(this.block_) ? this.bottomRow.elements.push(new Bc.SquareCorner(this.constants_)) : this.bottomRow.elements.push(new Ac.RoundCorner(this.constants_));
        this.bottomRow.hasNextConnection && (this.bottomRow.connection = new yd.NextConnection(this.constants_,this.block_.nextConnection),
        this.bottomRow.elements.push(this.bottomRow.connection));
        this.bottomRow.hasRightSquareCorner(this.block_) ? this.bottomRow.elements.push(new Bc.SquareCorner(this.constants_,"right")) : this.bottomRow.elements.push(new Ac.RoundCorner(this.constants_,"right"))
    }
    ;
    qa.prototype.addInput_ = function(a, b) {
        this.isInline && a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? (b.elements.push(new bd.InlineInput(this.constants_,a)),
        b.hasInlineInput = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT ? (b.elements.push(new Oc.StatementInput(this.constants_,a)),
        b.hasStatement = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? (b.elements.push(new ad.ExternalValueInput(this.constants_,a)),
        b.hasExternalInput = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && (b.minHeight = Math.max(b.minHeight, a.getSourceBlock() && a.getSourceBlock().isShadow() ? this.constants_.DUMMY_INPUT_SHADOW_MIN_HEIGHT : this.constants_.DUMMY_INPUT_MIN_HEIGHT),
        b.hasDummyInput = !0);
        null === b.align && (b.align = a.align)
    }
    ;
    qa.prototype.shouldStartNewRow_ = function(a, b) {
        return b ? a.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT || b.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT ? !0 : a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE || a.type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY ? !this.isInline : !1 : !1
    }
    ;
    qa.prototype.addElemSpacing_ = function() {
        for (var a = 0, b; b = this.rows[a]; a++) {
            var c = b.elements;
            b.elements = [];
            b.startsWithElemSpacer() && b.elements.push(new ib.InRowSpacer(this.constants_,this.getInRowSpacing_(null, c[0])));
            if (c.length) {
                for (var d = 0; d < c.length - 1; d++) {
                    b.elements.push(c[d]);
                    var f = this.getInRowSpacing_(c[d], c[d + 1]);
                    b.elements.push(new ib.InRowSpacer(this.constants_,f))
                }
                b.elements.push(c[c.length - 1]);
                b.endsWithElemSpacer() && b.elements.push(new ib.InRowSpacer(this.constants_,this.getInRowSpacing_(c[c.length - 1], null)))
            }
        }
    }
    ;
    qa.prototype.getInRowSpacing_ = function(a, b) {
        if (!a && b && m.isStatementInput(b))
            return this.constants_.STATEMENT_INPUT_PADDING_LEFT;
        if (a && m.isInput(a) && !b) {
            if (m.isExternalInput(a))
                return this.constants_.NO_PADDING;
            if (m.isInlineInput(a))
                return this.constants_.LARGE_PADDING;
            if (m.isStatementInput(a))
                return this.constants_.NO_PADDING
        }
        return a && m.isLeftSquareCorner(a) && b && (m.isPreviousConnection(b) || m.isNextConnection(b)) ? b.notchOffset : a && m.isLeftRoundedCorner(a) && b && (m.isPreviousConnection(b) || m.isNextConnection(b)) ? b.notchOffset - this.constants_.CORNER_RADIUS : this.constants_.MEDIUM_PADDING
    }
    ;
    qa.prototype.computeBounds_ = function() {
        for (var a = 0, b = 0, c = 0, d = 0, f; f = this.rows[d]; d++) {
            f.measure();
            b = Math.max(b, f.width);
            if (f.hasStatement) {
                var g = f.getLastInput();
                a = Math.max(a, f.width - g.width)
            }
            c = Math.max(c, f.widthWithConnectedBlocks)
        }
        this.statementEdge = a;
        this.width = b;
        for (a = 0; d = this.rows[a]; a++)
            d.hasStatement && (d.statementEdge = this.statementEdge);
        this.widthWithChildren = Math.max(b, c);
        this.outputConnection && (this.startX = this.outputConnection.width,
        this.width += this.outputConnection.width,
        this.widthWithChildren += this.outputConnection.width)
    }
    ;
    qa.prototype.alignRowElements_ = function() {
        for (var a = 0, b; b = this.rows[a]; a++)
            if (b.hasStatement)
                this.alignStatementRow_(b);
            else {
                var c = b.width;
                c = this.getDesiredRowWidth_(b) - c;
                0 < c && this.addAlignmentPadding_(b, c);
                m.isTopOrBottomRow(b) && (b.widthWithConnectedBlocks = b.width)
            }
    }
    ;
    qa.prototype.getDesiredRowWidth_ = function(a) {
        return this.width - this.startX
    }
    ;
    qa.prototype.addAlignmentPadding_ = function(a, b) {
        var c = a.getFirstSpacer()
          , d = a.getLastSpacer();
        if (a.hasExternalInput || a.hasStatement)
            a.widthWithConnectedBlocks += b;
        a.align === e.module$exports$Blockly$Input.Align.LEFT ? d.width += b : a.align === e.module$exports$Blockly$Input.Align.CENTRE ? (c.width += b / 2,
        d.width += b / 2) : a.align === e.module$exports$Blockly$Input.Align.RIGHT ? c.width += b : d.width += b;
        a.width += b
    }
    ;
    qa.prototype.alignStatementRow_ = function(a) {
        var b = a.getLastInput()
          , c = a.width - b.width
          , d = this.statementEdge;
        c = d - c;
        0 < c && this.addAlignmentPadding_(a, c);
        c = a.width;
        d = this.getDesiredRowWidth_(a);
        b.width += d - c;
        b.height = Math.max(b.height, a.height);
        a.width += d - c;
        a.widthWithConnectedBlocks = Math.max(a.width, this.statementEdge + a.connectedBlockWidths)
    }
    ;
    qa.prototype.addRowSpacing_ = function() {
        var a = this.rows;
        this.rows = [];
        for (var b = 0; b < a.length; b++)
            this.rows.push(a[b]),
            b !== a.length - 1 && this.rows.push(this.makeSpacerRow_(a[b], a[b + 1]))
    }
    ;
    qa.prototype.makeSpacerRow_ = function(a, b) {
        var c = this.getSpacerRowHeight_(a, b)
          , d = this.getSpacerRowWidth_(a, b);
        c = new cd.SpacerRow(this.constants_,c,d);
        a.hasStatement && (c.followsStatement = !0);
        b.hasStatement && (c.precedesStatement = !0);
        return c
    }
    ;
    qa.prototype.getSpacerRowWidth_ = function(a, b) {
        return this.width - this.startX
    }
    ;
    qa.prototype.getSpacerRowHeight_ = function(a, b) {
        return this.constants_.MEDIUM_PADDING
    }
    ;
    qa.prototype.getElemCenterline_ = function(a, b) {
        return m.isSpacer(b) ? a.yPos + b.height / 2 : m.isBottomRow(a) ? (a = a.yPos + a.height - a.descenderHeight,
        m.isNextConnection(b) ? a + b.height / 2 : a - b.height / 2) : m.isTopRow(a) ? m.isHat(b) ? a.capline - b.height / 2 : a.capline + b.height / 2 : a.yPos + a.height / 2
    }
    ;
    qa.prototype.recordElemPositions_ = function(a) {
        for (var b = a.xPos, c = 0, d; d = a.elements[c]; c++)
            m.isSpacer(d) && (d.height = a.height),
            d.xPos = b,
            d.centerline = this.getElemCenterline_(a, d),
            b += d.width
    }
    ;
    qa.prototype.finalize_ = function() {
        for (var a = 0, b = 0, c = 0, d; d = this.rows[c]; c++)
            d.yPos = b,
            d.xPos = this.startX,
            b += d.height,
            a = Math.max(a, d.widthWithConnectedBlocks),
            this.recordElemPositions_(d);
        this.outputConnection && this.block_.nextConnection && this.block_.nextConnection.isConnected() && (a = Math.max(a, this.block_.nextConnection.targetBlock().getHeightWidth().width));
        this.widthWithChildren = a + this.startX;
        this.height = b;
        this.startY = this.topRow.capline;
        this.bottomRow.baseline = b - this.bottomRow.descenderHeight
    }
    ;
    var La = function(a) {
        this.name = a;
        this.overrides = this.constants_ = null
    };
    La.prototype.getClassName = function() {
        return this.name + "-renderer"
    }
    ;
    La.prototype.init = function(a, b) {
        this.constants_ = this.makeConstants_();
        b && (this.overrides = b,
        (0,
        e.module$exports$Blockly$utils$object.mixin)(this.constants_, b));
        this.constants_.setTheme(a);
        this.constants_.init()
    }
    ;
    La.prototype.createDom = function(a, b) {
        this.constants_.createDom(a, this.name + "-" + b.name, "." + this.getClassName() + "." + b.getClassName())
    }
    ;
    La.prototype.refreshDom = function(a, b) {
        var c = this.getConstants();
        c.dispose();
        this.constants_ = this.makeConstants_();
        this.overrides && (0,
        e.module$exports$Blockly$utils$object.mixin)(this.constants_, this.overrides);
        this.constants_.randomIdentifier = c.randomIdentifier;
        this.constants_.setTheme(b);
        this.constants_.init();
        this.createDom(a, b)
    }
    ;
    La.prototype.dispose = function() {
        this.constants_ && this.constants_.dispose()
    }
    ;
    La.prototype.makeConstants_ = function() {
        return new pa
    }
    ;
    La.prototype.makeRenderInfo_ = function(a) {
        return new qa(this,a)
    }
    ;
    La.prototype.makeDrawer_ = function(a, b) {
        return new va(a,b)
    }
    ;
    La.prototype.makeDebugger_ = function() {
        if (!Ba)
            throw Error("Missing require for Blockly.blockRendering.Debug");
        return new Ba(this.getConstants())
    }
    ;
    La.prototype.makeMarkerDrawer = function(a, b) {
        return new ja(a,this.getConstants(),b)
    }
    ;
    La.prototype.makePathObject = function(a, b) {
        return new Pa(a,b,this.constants_)
    }
    ;
    La.prototype.getConstants = function() {
        return this.constants_
    }
    ;
    La.prototype.shouldHighlightConnection = function(a) {
        return !0
    }
    ;
    La.prototype.orphanCanConnectAtEnd = function(a, b, c) {
        return !!F.getConnectionForOrphanedConnection(a, c === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE ? b.outputConnection : b.previousConnection)
    }
    ;
    La.prototype.getConnectionPreviewMethod = function(a, b, c) {
        return b.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE || b.type === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT ? !a.isConnected() || this.orphanCanConnectAtEnd(c, a.targetBlock(), b.type) ? ea.PREVIEW_TYPE.INSERTION_MARKER : ea.PREVIEW_TYPE.REPLACEMENT_FADE : ea.PREVIEW_TYPE.INSERTION_MARKER
    }
    ;
    La.prototype.render = function(a) {
        (0,
        Fb.isDebuggerEnabled)() && !a.renderingDebugger && (a.renderingDebugger = this.makeDebugger_());
        var b = this.makeRenderInfo_(a);
        b.measure();
        this.makeDrawer_(a, b).draw()
    }
    ;
    var fa = {
        isDebuggerEnabled: function() {
            (0,
            V.warn)("Blockly.blockRendering.isDebuggerEnabled()", "September 2021", "September 2022", "Blockly.blockRendering.debug.isDebuggerEnabled()");
            return (0,
            Fb.isDebuggerEnabled)()
        },
        register: function(a, b) {
            (0,
            r.register)(r.Type.RENDERER, a, b)
        },
        unregister: function(a) {
            (0,
            r.unregister)(r.Type.RENDERER, a)
        },
        startDebugger: function() {
            (0,
            V.warn)("Blockly.blockRendering.startDebugger()", "September 2021", "September 2022", "Blockly.blockRendering.debug.startDebugger()");
            (0,
            Fb.startDebugger)()
        },
        stopDebugger: function() {
            (0,
            V.warn)("Blockly.blockRendering.stopDebugger()", "September 2021", "September 2022", "Blockly.blockRendering.debug.stopDebugger()");
            (0,
            Fb.stopDebugger)()
        },
        init: function(a, b, c) {
            a = new ((0,
            r.getClass)(r.Type.RENDERER, a))(a);
            a.init(b, c);
            return a
        }
    };
    fa.BottomRow = Qb.BottomRow;
    fa.Connection = xc.Connection;
    fa.ConstantProvider = pa;
    fa.Debug = Ba;
    fa.Drawer = va;
    fa.ExternalValueInput = ad.ExternalValueInput;
    fa.Field = td.Field;
    fa.Hat = ud.Hat;
    fa.Icon = vd.Icon;
    fa.InRowSpacer = ib.InRowSpacer;
    fa.InlineInput = bd.InlineInput;
    fa.InputConnection = Nc.InputConnection;
    fa.InputRow = zc.InputRow;
    fa.IPathObject = function(a, b) {}
    ;
    fa.JaggedEdge = wd.JaggedEdge;
    fa.MarkerSvg = ja;
    fa.Measurable = Rb;
    fa.NextConnection = yd.NextConnection;
    fa.OutputConnection = zd.OutputConnection;
    fa.PathObject = Pa;
    fa.PreviousConnection = Ad.PreviousConnection;
    fa.Renderer = La;
    fa.RenderInfo = qa;
    fa.RoundCorner = Ac.RoundCorner;
    fa.Row = Gb;
    fa.SpacerRow = cd.SpacerRow;
    fa.SquareCorner = Bc.SquareCorner;
    fa.StatementInput = Oc.StatementInput;
    fa.TopRow = Wb.TopRow;
    fa.Types = m;
    fa.debug = Fb;
    e.module$exports$Blockly$Extensions = {};
    var Pc = Object.create(null);
    e.module$exports$Blockly$Extensions.TEST_ONLY = {
        allExtensions: Pc
    };
    e.module$exports$Blockly$Extensions.register = function(a, b) {
        if ("string" !== typeof a || "" === a.trim())
            throw Error('Error: Invalid extension name "' + a + '"');
        if (Pc[a])
            throw Error('Error: Extension "' + a + '" is already registered.');
        if ("function" !== typeof b)
            throw Error('Error: Extension "' + a + '" must be a function');
        Pc[a] = b
    }
    ;
    e.module$exports$Blockly$Extensions.registerMixin = function(a, b) {
        if (!b || "object" !== typeof b)
            throw Error('Error: Mixin "' + a + '" must be a object');
        (0,
        e.module$exports$Blockly$Extensions.register)(a, function() {
            this.mixin(b)
        })
    }
    ;
    e.module$exports$Blockly$Extensions.registerMutator = function(a, b, c, d) {
        var f = 'Error when registering mutator "' + a + '": ';
        Je(f, b);
        var g = Bd(b.compose, b.decompose, f + " compose/decompose");
        if (c && "function" !== typeof c)
            throw Error(f + 'Extension "' + a + '" is not a function');
        (0,
        e.module$exports$Blockly$Extensions.register)(a, function() {
            if (g) {
                var k = e.module$exports$Blockly$Mutator.Mutator;
                if (!k)
                    throw Error(f + "Missing require for Blockly.Mutator");
                this.setMutator(new k(d || []))
            }
            this.mixin(b);
            c && c.apply(this)
        })
    }
    ;
    e.module$exports$Blockly$Extensions.unregister = function(a) {
        (0,
        e.module$exports$Blockly$Extensions.isRegistered)(a) ? delete Pc[a] : console.warn('No extension mapping for name "' + a + '" found to unregister')
    }
    ;
    e.module$exports$Blockly$Extensions.isRegistered = function(a) {
        return !!Pc[a]
    }
    ;
    e.module$exports$Blockly$Extensions.apply = function(a, b, c) {
        var d = Pc[a];
        if ("function" !== typeof d)
            throw Error('Error: Extension "' + a + '" not found.');
        if (c) {
            if (Zd(b).length)
                throw Error('Error: tried to apply mutation "' + a + '" to a block that already has mutator functions.  Block id: ' + b.id);
        } else
            var f = Zd(b);
        d.apply(b);
        if (c)
            Je('Error after applying mutator "' + a + '": ', b);
        else {
            a: if (c = f,
            b = Zd(b),
            b.length !== c.length)
                b = !1;
            else {
                for (d = 0; d < b.length; d++)
                    if (c[d] !== b[d]) {
                        b = !1;
                        break a
                    }
                b = !0
            }
            if (!b)
                throw Error('Error when applying extension "' + a + '": mutation properties changed when applying a non-mutator extension.');
        }
    }
    ;
    var Bd = function(a, b, c) {
        if (a && b) {
            if ("function" !== typeof a || "function" !== typeof b)
                throw Error(c + " must be a function");
            return !0
        }
        if (!a && !b)
            return !1;
        throw Error(c + "Must have both or neither functions");
    }
      , Je = function(a, b) {
        var c = Bd(b.mutationToDom, b.domToMutation, a + " mutationToDom/domToMutation")
          , d = Bd(b.saveExtraState, b.loadExtraState, a + " saveExtraState/loadExtraState");
        if (!c && !d)
            throw Error(a + "Mutations must contain either XML hooks, or JSON hooks, or both");
        Bd(b.compose, b.decompose, a + " compose/decompose")
    }
      , Zd = function(a) {
        var b = [];
        void 0 !== a.domToMutation && b.push(a.domToMutation);
        void 0 !== a.mutationToDom && b.push(a.mutationToDom);
        void 0 !== a.saveExtraState && b.push(a.saveExtraState);
        void 0 !== a.loadExtraState && b.push(a.loadExtraState);
        void 0 !== a.compose && b.push(a.compose);
        void 0 !== a.decompose && b.push(a.decompose);
        return b
    };
    e.module$exports$Blockly$Extensions.runAfterPageLoad = function(a) {
        if ("object" !== typeof document)
            throw Error("runAfterPageLoad() requires browser document.");
        if ("complete" === document.readyState)
            a();
        else
            var b = setInterval(function() {
                "complete" === document.readyState && (clearInterval(b),
                a())
            }, 10)
    }
    ;
    e.module$exports$Blockly$Extensions.buildTooltipForDropdown = function(a, b) {
        var c = [];
        "object" === typeof document && (0,
        e.module$exports$Blockly$Extensions.runAfterPageLoad)(function() {
            for (var d in b)
                (0,
                da.checkMessageReferences)(b[d])
        });
        return function() {
            this.type && -1 === c.indexOf(this.type) && (jf(this, a, b),
            c.push(this.type));
            this.setTooltip(function() {
                var d = String(this.getFieldValue(a))
                  , f = b[d];
                null === f ? -1 === c.indexOf(this.type) && (d = "No tooltip mapping for value " + d + " of field " + a,
                null !== this.type && (d += " of block type " + this.type),
                console.warn(d + ".")) : f = (0,
                da.replaceMessageReferences)(f);
                return f
            }
            .bind(this))
        }
    }
    ;
    var jf = function(a, b, c) {
        var d = a.getField(b);
        if (!d.isOptionListDynamic()) {
            d = d.getOptions();
            for (var f = 0; f < d.length; f++) {
                var g = d[f][1];
                null === c[g] && console.warn("No tooltip mapping for value " + g + " of field " + b + " of block type " + a.type)
            }
        }
    };
    e.module$exports$Blockly$Extensions.buildTooltipWithFieldText = function(a, b) {
        "object" === typeof document && (0,
        e.module$exports$Blockly$Extensions.runAfterPageLoad)(function() {
            (0,
            da.checkMessageReferences)(a)
        });
        return function() {
            this.setTooltip(function() {
                var c = this.getField(b);
                return (0,
                da.replaceMessageReferences)(a).replace("%1", c ? c.getText() : "")
            }
            .bind(this))
        }
    }
    ;
    (0,
    e.module$exports$Blockly$Extensions.register)("parent_tooltip_when_inline", function() {
        this.tooltipWhenNotConnected = this.tooltip;
        this.setTooltip(function() {
            var a = this.getParent();
            return a && a.getInputsInline() && a.tooltip || this.tooltipWhenNotConnected
        }
        .bind(this))
    });
    var W = {
        aria: J,
        colour: ha
    };
    W.Coordinate = E;
    W.deprecation = V;
    W.dom = l;
    W.global = e.module$exports$Blockly$utils$global.globalThis;
    W.idGenerator = Va;
    W.KeyCodes = H;
    W.math = xb;
    W.Metrics = function() {}
    ;
    W.object = e.module$exports$Blockly$utils$object;
    W.parsing = da;
    W.Rect = Aa;
    W.Size = Ja;
    W.string = e.module$exports$Blockly$utils$string;
    W.style = na;
    W.Svg = q;
    W.svgPaths = p;
    W.svgMath = ca;
    W.toolbox = Q;
    W.userAgent = O;
    W.xml = e.module$exports$Blockly$utils$xml;
    W.noEvent = function(a) {
        (0,
        V.warn)("Blockly.utils.noEvent", "September 2021", "September 2022");
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    W.isTargetInput = function(a) {
        (0,
        V.warn)("Blockly.utils.isTargetInput", "September 2021", "September 2022", "Blockly.browserEvents.isTargetInput");
        return (0,
        u.isTargetInput)(a)
    }
    ;
    W.getRelativeXY = function(a) {
        (0,
        V.warn)("Blockly.utils.getRelativeXY", "December 2021", "December 2022", "Blockly.utils.svgMath.getRelativeXY");
        return (0,
        ca.getRelativeXY)(a)
    }
    ;
    W.getInjectionDivXY_ = function(a) {
        (0,
        V.warn)("Blockly.utils.getInjectionDivXY_", "December 2021", "December 2022", "Blockly.utils.svgMath.getInjectionDivXY");
        return (0,
        ca.getInjectionDivXY)(a)
    }
    ;
    W.isRightButton = function(a) {
        (0,
        V.warn)("Blockly.utils.isRightButton", "September 2021", "September 2022", "Blockly.browserEvents.isRightButton");
        return (0,
        u.isRightButton)(a)
    }
    ;
    W.mouseToSvg = function(a, b, c) {
        (0,
        V.warn)("Blockly.utils.mouseToSvg", "September 2021", "September 2022", "Blockly.browserEvents.mouseToSvg");
        return (0,
        u.mouseToSvg)(a, b, c)
    }
    ;
    W.getScrollDeltaPixels = function(a) {
        (0,
        V.warn)("Blockly.utils.getScrollDeltaPixels", "September 2021", "September 2022", "Blockly.browserEvents.getScrollDeltaPixels");
        return (0,
        u.getScrollDeltaPixels)(a)
    }
    ;
    W.tokenizeInterpolation = function(a) {
        (0,
        V.warn)("Blockly.utils.tokenizeInterpolation", "December 2021", "December 2022", "Blockly.utils.parsing.tokenizeInterpolation");
        return (0,
        da.tokenizeInterpolation)(a)
    }
    ;
    W.replaceMessageReferences = function(a) {
        (0,
        V.warn)("Blockly.utils.replaceMessageReferences", "December 2021", "December 2022", "Blockly.utils.parsing.replaceMessageReferences");
        return (0,
        da.replaceMessageReferences)(a)
    }
    ;
    W.checkMessageReferences = function(a) {
        (0,
        V.warn)("Blockly.utils.checkMessageReferences", "December 2021", "December 2022", "Blockly.utils.parsing.checkMessageReferences");
        return (0,
        da.checkMessageReferences)(a)
    }
    ;
    W.genUid = function() {
        (0,
        V.warn)("Blockly.utils.genUid", "September 2021", "September 2022", "Blockly.utils.idGenerator.genUid");
        return (0,
        Va.genUid)()
    }
    ;
    W.is3dSupported = function() {
        (0,
        V.warn)("Blockly.utils.is3dSupported", "December 2021", "December 2022", "Blockly.utils.svgMath.is3dSupported");
        return (0,
        ca.is3dSupported)()
    }
    ;
    W.getViewportBBox = function() {
        (0,
        V.warn)("Blockly.utils.getViewportBBox", "December 2021", "December 2022", "Blockly.utils.svgMath.getViewportBBox");
        return (0,
        ca.getViewportBBox)()
    }
    ;
    W.arrayRemove = function(a, b) {
        (0,
        V.warn)("Blockly.utils.arrayRemove", "December 2021", "December 2022");
        return (0,
        sb)(a, b)
    }
    ;
    W.getDocumentScroll = function() {
        (0,
        V.warn)("Blockly.utils.getDocumentScroll", "December 2021", "December 2022", "Blockly.utils.svgMath.getDocumentScroll");
        return (0,
        ca.getDocumentScroll)()
    }
    ;
    W.getBlockTypeCounts = function(a, b) {
        (0,
        V.warn)("Blockly.utils.getBlockTypeCounts", "December 2021", "December 2022", "Blockly.common.getBlockTypeCounts");
        return (0,
        e.module$exports$Blockly$common.getBlockTypeCounts)(a, b)
    }
    ;
    W.screenToWsCoordinates = function(a, b) {
        (0,
        V.warn)("Blockly.utils.screenToWsCoordinates", "December 2021", "December 2022", "Blockly.utils.svgMath.screenToWsCoordinates");
        return (0,
        ca.screenToWsCoordinates)(a, b)
    }
    ;
    W.parseBlockColour = function(a) {
        (0,
        V.warn)("Blockly.utils.parseBlockColour", "December 2021", "December 2022", "Blockly.utils.parsing.parseBlockColour");
        return (0,
        da.parseBlockColour)(a)
    }
    ;
    W.runAfterPageLoad = function(a) {
        (0,
        V.warn)("Blockly.utils.runAfterPageLoad", "December 2021", "December 2022");
        (0,
        e.module$exports$Blockly$Extensions.runAfterPageLoad)(a)
    }
    ;
    var Xb = {
        BlockDelete: function(a) {
            Xb.BlockDelete.superClass_.constructor.call(this, a);
            if (a) {
                if (a.getParent())
                    throw Error("Connected blocks cannot be deleted.");
                a.isShadow() && (this.recordUndo = !1);
                this.oldXml = (0,
                e.module$exports$Blockly$Xml.blockToDomWithXY)(a);
                this.ids = (0,
                h.getDescendantIds)(a);
                this.wasShadow = a.isShadow();
                this.oldJson = (0,
                Sa.save)(a, {
                    addCoordinates: !0
                })
            }
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Xb.BlockDelete, Eb.BlockBase);
    Xb.BlockDelete.prototype.type = h.DELETE;
    Xb.BlockDelete.prototype.toJson = function() {
        var a = Xb.BlockDelete.superClass_.toJson.call(this);
        a.oldXml = (0,
        e.module$exports$Blockly$Xml.domToText)(this.oldXml);
        a.ids = this.ids;
        a.wasShadow = this.wasShadow;
        a.oldJson = this.oldJson;
        this.recordUndo || (a.recordUndo = this.recordUndo);
        return a
    }
    ;
    Xb.BlockDelete.prototype.fromJson = function(a) {
        Xb.BlockDelete.superClass_.fromJson.call(this, a);
        this.oldXml = (0,
        e.module$exports$Blockly$Xml.textToDom)(a.oldXml);
        this.ids = a.ids;
        this.wasShadow = a.wasShadow || "shadow" === this.oldXml.tagName.toLowerCase();
        this.oldJson = a.oldJson;
        void 0 !== a.recordUndo && (this.recordUndo = a.recordUndo)
    }
    ;
    Xb.BlockDelete.prototype.run = function(a) {
        var b = this.getEventWorkspace_();
        if (a)
            for (a = 0; a < this.ids.length; a++) {
                var c = this.ids[a]
                  , d = b.getBlockById(c);
                d ? d.dispose(!1) : c === this.blockId && console.warn("Can't delete non-existent block: " + c)
            }
        else
            (0,
            Sa.append)(this.oldJson, b)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.DELETE, Xb.BlockDelete);
    var A = {
        Block: function(a, b, c) {
            var d = e.module$exports$Blockly$Generator.Generator;
            if (d && "undefined" !== typeof d.prototype[b])
                throw Error('Block prototypeName "' + b + '" conflicts with Blockly.Generator members.');
            this.id = c && !a.getBlockById(c) ? c : (0,
            Va.genUid)();
            a.setBlockById(this.id, this);
            this.previousConnection = this.nextConnection = this.outputConnection = null;
            this.inputList = [];
            this.inputsInline = void 0;
            this.disabled = !1;
            this.tooltip = "";
            this.contextMenu = !0;
            this.parentBlock_ = null;
            this.childBlocks_ = [];
            this.editable_ = this.movable_ = this.deletable_ = !0;
            this.collapsed_ = this.isShadow_ = !1;
            this.comment = this.outputShape_ = null;
            this.commentModel = {
                text: null,
                pinned: !1,
                size: new Ja(160,80)
            };
            this.xy_ = new E(0,0);
            this.workspace = a;
            this.isInFlyout = a.isFlyout;
            this.isInMutator = a.isMutator;
            this.RTL = a.RTL;
            this.isInsertionMarker_ = !1;
            this.hat = void 0;
            this.rendered = null;
            this.statementInputCount = 0;
            if (b) {
                this.type = b;
                c = e.module$exports$Blockly$blocks.Blocks[b];
                if (!c || "object" !== typeof c)
                    throw TypeError("Unknown block type: " + b);
                (0,
                e.module$exports$Blockly$utils$object.mixin)(this, c)
            }
            a.addTopBlock(this);
            a.addTypedBlock(this);
            (a = (0,
            h.getGroup)()) || (0,
            h.setGroup)(!0);
            b = (0,
            h.getRecordUndo)();
            try {
                "function" === typeof this.init && ((0,
                h.setRecordUndo)(!1),
                this.init(),
                (0,
                h.setRecordUndo)(b)),
                (0,
                h.isEnabled)() && (0,
                h.fire)(new ((0,
                h.get)(h.CREATE))(this))
            } finally {
                a || (0,
                h.setGroup)(!1),
                (0,
                h.setRecordUndo)(b)
            }
            this.inputsInlineDefault = this.inputsInline;
            "function" === typeof this.onchange && this.setOnChange(this.onchange)
        }
    };
    A.Block.COLLAPSED_INPUT_NAME = dc.COLLAPSED_INPUT_NAME;
    A.Block.COLLAPSED_FIELD_NAME = dc.COLLAPSED_FIELD_NAME;
    A.Block.prototype.data = null;
    A.Block.prototype.disposed = !1;
    A.Block.prototype.hue_ = null;
    A.Block.prototype.colour_ = "#000000";
    A.Block.prototype.styleName_ = "";
    A.Block.prototype.dispose = function(a) {
        if (this.workspace) {
            this.onchangeWrapper_ && this.workspace.removeChangeListener(this.onchangeWrapper_);
            this.unplug(a);
            (0,
            h.isEnabled)() && (0,
            h.fire)(new ((0,
            h.get)(h.DELETE))(this));
            (0,
            h.disable)();
            try {
                this.workspace && (this.workspace.removeTopBlock(this),
                this.workspace.removeTypedBlock(this),
                this.workspace.removeBlockById(this.id),
                this.workspace = null);
                (0,
                e.module$exports$Blockly$common.getSelected)() === this && (0,
                e.module$exports$Blockly$common.setSelected)(null);
                for (var b = this.childBlocks_.length - 1; 0 <= b; b--)
                    this.childBlocks_[b].dispose(!1);
                a = 0;
                for (b = void 0; b = this.inputList[a]; a++)
                    b.dispose();
                this.inputList.length = 0;
                var c = this.getConnections_(!0);
                a = 0;
                for (b = void 0; b = c[a]; a++)
                    b.dispose()
            } finally {
                (0,
                h.enable)(),
                this.disposed = !0
            }
        }
    }
    ;
    A.Block.prototype.initModel = function() {
        for (var a = 0, b; b = this.inputList[a]; a++)
            for (var c = 0, d; d = b.fieldRow[c]; c++)
                d.initModel && d.initModel()
    }
    ;
    A.Block.prototype.unplug = function(a) {
        this.outputConnection && this.unplugFromRow_(a);
        this.previousConnection && this.unplugFromStack_(a)
    }
    ;
    A.Block.prototype.unplugFromRow_ = function(a) {
        var b = null;
        this.outputConnection.isConnected() && (b = this.outputConnection.targetConnection,
        this.outputConnection.disconnect());
        if (b && a && (a = this.getOnlyValueConnection_()) && a.isConnected() && !a.targetBlock().isShadow())
            if (a = a.targetConnection,
            a.disconnect(),
            this.workspace.connectionChecker.canConnect(a, b, !1))
                b.connect(a);
            else
                a.onFailedConnect(b)
    }
    ;
    A.Block.prototype.getOnlyValueConnection_ = function() {
        for (var a = null, b = 0; b < this.inputList.length; b++) {
            var c = this.inputList[b].connection;
            if (c && c.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE && c.targetConnection) {
                if (a)
                    return null;
                a = c
            }
        }
        return a
    }
    ;
    A.Block.prototype.unplugFromStack_ = function(a) {
        var b = null;
        this.previousConnection.isConnected() && (b = this.previousConnection.targetConnection,
        this.previousConnection.disconnect());
        var c = this.getNextBlock();
        a && c && !c.isShadow() && (a = this.nextConnection.targetConnection,
        a.disconnect(),
        b && this.workspace.connectionChecker.canConnect(b, a, !1) && b.connect(a))
    }
    ;
    A.Block.prototype.getConnections_ = function(a) {
        a = [];
        this.outputConnection && a.push(this.outputConnection);
        this.previousConnection && a.push(this.previousConnection);
        this.nextConnection && a.push(this.nextConnection);
        for (var b = 0, c; c = this.inputList[b]; b++)
            c.connection && a.push(c.connection);
        return a
    }
    ;
    A.Block.prototype.lastConnectionInStack = function(a) {
        for (var b = this.nextConnection; b; ) {
            var c = b.targetBlock();
            if (!c || a && c.isShadow())
                return b;
            b = c.nextConnection
        }
        return null
    }
    ;
    A.Block.prototype.bumpNeighbours = function() {}
    ;
    A.Block.prototype.getParent = function() {
        return this.parentBlock_
    }
    ;
    A.Block.prototype.getInputWithBlock = function(a) {
        for (var b = 0, c; c = this.inputList[b]; b++)
            if (c.connection && c.connection.targetBlock() === a)
                return c;
        return null
    }
    ;
    A.Block.prototype.getSurroundParent = function() {
        var a = this;
        do {
            var b = a;
            a = a.getParent();
            if (!a)
                return null
        } while (a.getNextBlock() === b);
        return a
    }
    ;
    A.Block.prototype.getNextBlock = function() {
        return this.nextConnection && this.nextConnection.targetBlock()
    }
    ;
    A.Block.prototype.getPreviousBlock = function() {
        return this.previousConnection && this.previousConnection.targetBlock()
    }
    ;
    A.Block.prototype.getFirstStatementConnection = function() {
        for (var a = 0, b; b = this.inputList[a]; a++)
            if (b.connection && b.connection.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT)
                return b.connection;
        return null
    }
    ;
    A.Block.prototype.getRootBlock = function() {
        var a = this;
        do {
            var b = a;
            a = b.parentBlock_
        } while (a);
        return b
    }
    ;
    A.Block.prototype.getTopStackBlock = function() {
        var a = this;
        do
            var b = a.getPreviousBlock();
        while (b && b.getNextBlock() === a && (a = b));
        return a
    }
    ;
    A.Block.prototype.getChildren = function(a) {
        if (!a)
            return this.childBlocks_;
        a = [];
        for (var b = 0, c; c = this.inputList[b]; b++)
            c.connection && (c = c.connection.targetBlock()) && a.push(c);
        (b = this.getNextBlock()) && a.push(b);
        return a
    }
    ;
    A.Block.prototype.setParent = function(a) {
        if (a !== this.parentBlock_) {
            var b = this.previousConnection && this.previousConnection.targetBlock() || this.outputConnection && this.outputConnection.targetBlock()
              , c = !!b;
            if (c && a && b !== a)
                throw Error("Block connected to superior one that is not new parent.");
            if (!c && a)
                throw Error("Block not connected to new parent.");
            if (c && !a)
                throw Error("Cannot set parent to null while block is still connected to superior block.");
            this.parentBlock_ ? (0,
            sb)(this.parentBlock_.childBlocks_, this) : this.workspace.removeTopBlock(this);
            (this.parentBlock_ = a) ? a.childBlocks_.push(this) : this.workspace.addTopBlock(this)
        }
    }
    ;
    A.Block.prototype.getDescendants = function(a) {
        for (var b = [this], c = this.getChildren(a), d, f = 0; d = c[f]; f++)
            b.push.apply(b, d.getDescendants(a));
        return b
    }
    ;
    A.Block.prototype.isDeletable = function() {
        return this.deletable_ && !this.isShadow_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    A.Block.prototype.setDeletable = function(a) {
        this.deletable_ = a
    }
    ;
    A.Block.prototype.isMovable = function() {
        return this.movable_ && !this.isShadow_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    A.Block.prototype.setMovable = function(a) {
        this.movable_ = a
    }
    ;
    A.Block.prototype.isDuplicatable = function() {
        return this.workspace.hasBlockLimits() ? this.workspace.isCapacityAvailable((0,
        e.module$exports$Blockly$common.getBlockTypeCounts)(this, !0)) : !0
    }
    ;
    A.Block.prototype.isShadow = function() {
        return this.isShadow_
    }
    ;
    A.Block.prototype.setShadow = function(a) {
        this.isShadow_ = a
    }
    ;
    A.Block.prototype.isInsertionMarker = function() {
        return this.isInsertionMarker_
    }
    ;
    A.Block.prototype.setInsertionMarker = function(a) {
        this.isInsertionMarker_ = a
    }
    ;
    A.Block.prototype.isEditable = function() {
        return this.editable_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    A.Block.prototype.setEditable = function(a) {
        this.editable_ = a;
        a = 0;
        for (var b; b = this.inputList[a]; a++)
            for (var c = 0, d; d = b.fieldRow[c]; c++)
                d.updateEditable()
    }
    ;
    A.Block.prototype.isDisposed = function() {
        return this.disposed
    }
    ;
    A.Block.prototype.getMatchingConnection = function(a, b) {
        var c = this.getConnections_(!0);
        a = a.getConnections_(!0);
        if (c.length !== a.length)
            throw Error("Connection lists did not match in length.");
        for (var d = 0; d < a.length; d++)
            if (a[d] === b)
                return c[d];
        return null
    }
    ;
    A.Block.prototype.setHelpUrl = function(a) {
        this.helpUrl = a
    }
    ;
    A.Block.prototype.setTooltip = function(a) {
        this.tooltip = a
    }
    ;
    A.Block.prototype.getTooltip = function() {
        return (0,
        T.getTooltipOfObject)(this)
    }
    ;
    A.Block.prototype.getColour = function() {
        return this.colour_
    }
    ;
    A.Block.prototype.getStyleName = function() {
        return this.styleName_
    }
    ;
    A.Block.prototype.getHue = function() {
        return this.hue_
    }
    ;
    A.Block.prototype.setColour = function(a) {
        a = (0,
        da.parseBlockColour)(a);
        this.hue_ = a.hue;
        this.colour_ = a.hex
    }
    ;
    A.Block.prototype.setStyle = function(a) {
        this.styleName_ = a
    }
    ;
    A.Block.prototype.setOnChange = function(a) {
        if (a && "function" !== typeof a)
            throw Error("onchange must be a function.");
        this.onchangeWrapper_ && this.workspace.removeChangeListener(this.onchangeWrapper_);
        if (this.onchange = a)
            this.onchangeWrapper_ = a.bind(this),
            this.workspace.addChangeListener(this.onchangeWrapper_)
    }
    ;
    A.Block.prototype.getField = function(a) {
        if ("string" !== typeof a)
            throw TypeError("Block.prototype.getField expects a string with the field name but received " + (void 0 === a ? "nothing" : a + " of type " + typeof a) + " instead");
        for (var b = 0, c; c = this.inputList[b]; b++)
            for (var d = 0, f; f = c.fieldRow[d]; d++)
                if (f.name === a)
                    return f;
        return null
    }
    ;
    A.Block.prototype.getVars = function() {
        for (var a = [], b = 0, c; c = this.inputList[b]; b++)
            for (var d = 0, f; f = c.fieldRow[d]; d++)
                f.referencesVariables() && a.push(f.getValue());
        return a
    }
    ;
    A.Block.prototype.getVarModels = function() {
        for (var a = [], b = 0, c; c = this.inputList[b]; b++)
            for (var d = 0, f; f = c.fieldRow[d]; d++)
                f.referencesVariables() && (f = this.workspace.getVariableById(f.getValue())) && a.push(f);
        return a
    }
    ;
    A.Block.prototype.updateVarName = function(a) {
        for (var b = 0, c; c = this.inputList[b]; b++)
            for (var d = 0, f; f = c.fieldRow[d]; d++)
                f.referencesVariables() && a.getId() === f.getValue() && f.refreshVariableName()
    }
    ;
    A.Block.prototype.renameVarById = function(a, b) {
        for (var c = 0, d; d = this.inputList[c]; c++)
            for (var f = 0, g; g = d.fieldRow[f]; f++)
                g.referencesVariables() && a === g.getValue() && g.setValue(b)
    }
    ;
    A.Block.prototype.getFieldValue = function(a) {
        return (a = this.getField(a)) ? a.getValue() : null
    }
    ;
    A.Block.prototype.setFieldValue = function(a, b) {
        var c = this.getField(b);
        if (!c)
            throw Error('Field "' + b + '" not found.');
        c.setValue(a)
    }
    ;
    A.Block.prototype.setPreviousStatement = function(a, b) {
        if (a)
            void 0 === b && (b = null),
            this.previousConnection || (this.previousConnection = this.makeConnection_(e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT)),
            this.previousConnection.setCheck(b);
        else if (this.previousConnection) {
            if (this.previousConnection.isConnected())
                throw Error("Must disconnect previous statement before removing connection.");
            this.previousConnection.dispose();
            this.previousConnection = null
        }
    }
    ;
    A.Block.prototype.setNextStatement = function(a, b) {
        if (a)
            void 0 === b && (b = null),
            this.nextConnection || (this.nextConnection = this.makeConnection_(e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT)),
            this.nextConnection.setCheck(b);
        else if (this.nextConnection) {
            if (this.nextConnection.isConnected())
                throw Error("Must disconnect next statement before removing connection.");
            this.nextConnection.dispose();
            this.nextConnection = null
        }
    }
    ;
    A.Block.prototype.setOutput = function(a, b) {
        if (a)
            void 0 === b && (b = null),
            this.outputConnection || (this.outputConnection = this.makeConnection_(e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE)),
            this.outputConnection.setCheck(b);
        else if (this.outputConnection) {
            if (this.outputConnection.isConnected())
                throw Error("Must disconnect output value before removing connection.");
            this.outputConnection.dispose();
            this.outputConnection = null
        }
    }
    ;
    A.Block.prototype.setInputsInline = function(a) {
        this.inputsInline !== a && ((0,
        h.fire)(new ((0,
        h.get)(h.CHANGE))(this,"inline",null,this.inputsInline,a)),
        this.inputsInline = a)
    }
    ;
    A.Block.prototype.getInputsInline = function() {
        if (void 0 !== this.inputsInline)
            return this.inputsInline;
        for (var a = 1; a < this.inputList.length; a++)
            if (this.inputList[a - 1].type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && this.inputList[a].type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY)
                return !1;
        for (a = 1; a < this.inputList.length; a++)
            if (this.inputList[a - 1].type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE && this.inputList[a].type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY)
                return !0;
        return !1
    }
    ;
    A.Block.prototype.setOutputShape = function(a) {
        this.outputShape_ = a
    }
    ;
    A.Block.prototype.getOutputShape = function() {
        return this.outputShape_
    }
    ;
    A.Block.prototype.isEnabled = function() {
        return !this.disabled
    }
    ;
    A.Block.prototype.setEnabled = function(a) {
        if (this.isEnabled() !== a) {
            var b = this.disabled;
            this.disabled = !a;
            (0,
            h.fire)(new ((0,
            h.get)(h.CHANGE))(this,"disabled",null,b,!a))
        }
    }
    ;
    A.Block.prototype.getInheritedDisabled = function() {
        for (var a = this.getSurroundParent(); a; ) {
            if (a.disabled)
                return !0;
            a = a.getSurroundParent()
        }
        return !1
    }
    ;
    A.Block.prototype.isCollapsed = function() {
        return this.collapsed_
    }
    ;
    A.Block.prototype.setCollapsed = function(a) {
        this.collapsed_ !== a && ((0,
        h.fire)(new ((0,
        h.get)(h.CHANGE))(this,"collapsed",null,this.collapsed_,a)),
        this.collapsed_ = a)
    }
    ;
    A.Block.prototype.toString = function(a, b) {
        function c(B) {
            var P = B.getCheck();
            !P && B.targetConnection && (P = B.targetConnection.getCheck());
            return !!P && (-1 !== P.indexOf("Boolean") || -1 !== P.indexOf("Number"))
        }
        function d() {
            k && k.getType() === n.getType() && k.getLocation() === n.getLocation() && (k = null)
        }
        var f = [];
        b = b || "?";
        var g = v.ASTNode.NAVIGATE_ALL_FIELDS;
        v.ASTNode.NAVIGATE_ALL_FIELDS = !0;
        for (var k = v.ASTNode.createBlockNode(this), n = k; k; ) {
            switch (k.getType()) {
            case v.ASTNode.types.INPUT:
                var x = k.getLocation();
                k.in() ? c(x) && f.push("(") : f.push(b);
                break;
            case v.ASTNode.types.FIELD:
                x = k.getLocation(),
                x.name !== dc.COLLAPSED_FIELD_NAME && f.push(x.getText())
            }
            x = k;
            k = x.in() || x.next();
            if (!k) {
                k = x.out();
                for (d(); k && !k.next(); )
                    k = k.out(),
                    d(),
                    k && k.getType() === v.ASTNode.types.INPUT && c(k.getLocation()) && f.push(")");
                k && (k = k.next())
            }
        }
        v.ASTNode.NAVIGATE_ALL_FIELDS = g;
        for (b = 2; b < f.length; b++)
            "(" === f[b - 2] && ")" === f[b] && (f[b - 2] = f[b - 1],
            f.splice(b - 1, 2));
        f = f.reduce(function(B, P) {
            return B + ("(" === B.substr(-1) || ")" === P ? "" : " ") + P
        }, "");
        f = f.trim() || "???";
        a && f.length > a && (f = f.substring(0, a - 3) + "...");
        return f
    }
    ;
    A.Block.prototype.appendValueInput = function(a) {
        return this.appendInput_(e.module$exports$Blockly$inputTypes.inputTypes.VALUE, a)
    }
    ;
    A.Block.prototype.appendStatementInput = function(a) {
        return this.appendInput_(e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT, a)
    }
    ;
    A.Block.prototype.appendDummyInput = function(a) {
        return this.appendInput_(e.module$exports$Blockly$inputTypes.inputTypes.DUMMY, a || "")
    }
    ;
    A.Block.prototype.jsonInit = function(a) {
        var b = a.type ? 'Block "' + a.type + '": ' : "";
        if (a.output && a.previousStatement)
            throw Error(b + "Must not have both an output and a previousStatement.");
        a.style && a.style.hat && (this.hat = a.style.hat,
        a.style = null);
        if (a.style && a.colour)
            throw Error(b + "Must not have both a colour and a style.");
        a.style ? this.jsonInitStyle_(a, b) : this.jsonInitColour_(a, b);
        for (var c = 0; void 0 !== a["message" + c]; )
            this.interpolate_(a["message" + c], a["args" + c] || [], a["lastDummyAlign" + c], b),
            c++;
        void 0 !== a.inputsInline && this.setInputsInline(a.inputsInline);
        void 0 !== a.output && this.setOutput(!0, a.output);
        void 0 !== a.outputShape && this.setOutputShape(a.outputShape);
        void 0 !== a.previousStatement && this.setPreviousStatement(!0, a.previousStatement);
        void 0 !== a.nextStatement && this.setNextStatement(!0, a.nextStatement);
        void 0 !== a.tooltip && (c = (0,
        da.replaceMessageReferences)(a.tooltip),
        this.setTooltip(c));
        void 0 !== a.enableContextMenu && (this.contextMenu = !!a.enableContextMenu);
        void 0 !== a.suppressPrefixSuffix && (this.suppressPrefixSuffix = !!a.suppressPrefixSuffix);
        void 0 !== a.helpUrl && (c = (0,
        da.replaceMessageReferences)(a.helpUrl),
        this.setHelpUrl(c));
        "string" === typeof a.extensions && (console.warn(b + "JSON attribute 'extensions' should be an array of strings. Found raw string in JSON for '" + a.type + "' block."),
        a.extensions = [a.extensions]);
        void 0 !== a.mutator && (0,
        e.module$exports$Blockly$Extensions.apply)(a.mutator, this, !0);
        a = a.extensions;
        if (Array.isArray(a))
            for (b = 0; b < a.length; b++)
                (0,
                e.module$exports$Blockly$Extensions.apply)(a[b], this, !1)
    }
    ;
    A.Block.prototype.jsonInitColour_ = function(a, b) {
        if ("colour"in a)
            if (void 0 === a.colour)
                console.warn(b + "Undefined colour value.");
            else {
                a = a.colour;
                try {
                    this.setColour(a)
                } catch (c) {
                    console.warn(b + "Illegal colour value: ", a)
                }
            }
    }
    ;
    A.Block.prototype.jsonInitStyle_ = function(a, b) {
        a = a.style;
        try {
            this.setStyle(a)
        } catch (c) {
            console.warn(b + "Style does not exist: ", a)
        }
    }
    ;
    A.Block.prototype.mixin = function(a, b) {
        if (void 0 !== b && "boolean" !== typeof b)
            throw Error("opt_disableCheck must be a boolean if provided");
        if (!b) {
            b = [];
            for (var c in a)
                void 0 !== this[c] && b.push(c);
            if (b.length)
                throw Error("Mixin will overwrite block members: " + JSON.stringify(b));
        }
        (0,
        e.module$exports$Blockly$utils$object.mixin)(this, a)
    }
    ;
    A.Block.prototype.interpolate_ = function(a, b, c, d) {
        a = (0,
        da.tokenizeInterpolation)(a);
        this.validateTokens_(a, b.length);
        b = this.interpolateArguments_(a, b, c);
        c = [];
        a = 0;
        for (var f; f = b[a]; a++)
            if (this.isInputKeyword_(f.type)) {
                if (f = this.inputFromJson_(f, d)) {
                    for (var g = 0, k; k = c[g]; g++)
                        f.appendField(k[0], k[1]);
                    c.length = 0
                }
            } else
                (g = this.fieldFromJson_(f)) && c.push([g, f.name])
    }
    ;
    A.Block.prototype.validateTokens_ = function(a, b) {
        for (var c = [], d = 0, f = 0; f < a.length; f++) {
            var g = a[f];
            if ("number" === typeof g) {
                if (1 > g || g > b)
                    throw Error('Block "' + this.type + '": Message index %' + g + " out of range.");
                if (c[g])
                    throw Error('Block "' + this.type + '": Message index %' + g + " duplicated.");
                c[g] = !0;
                d++
            }
        }
        if (d !== b)
            throw Error('Block "' + this.type + '": Message does not reference all ' + b + " arg(s).");
    }
    ;
    A.Block.prototype.interpolateArguments_ = function(a, b, c) {
        for (var d = [], f = 0; f < a.length; f++) {
            var g = a[f];
            "number" === typeof g && (g = b[g - 1]);
            ("string" !== typeof g || (g = this.stringToFieldJson_(g),
            g)) && d.push(g)
        }
        (a = d.length) && !this.isInputKeyword_(d[a - 1].type) && (a = {
            type: "input_dummy"
        },
        c && (a.align = c),
        d.push(a));
        return d
    }
    ;
    A.Block.prototype.fieldFromJson_ = function(a) {
        var b = (0,
        mb.fromJson)(a);
        return !b && a.alt ? "string" === typeof a.alt ? (a = this.stringToFieldJson_(a.alt)) ? this.fieldFromJson_(a) : null : this.fieldFromJson_(a.alt) : b
    }
    ;
    A.Block.prototype.inputFromJson_ = function(a, b) {
        var c = {
            LEFT: e.module$exports$Blockly$Input.Align.LEFT,
            RIGHT: e.module$exports$Blockly$Input.Align.RIGHT,
            CENTRE: e.module$exports$Blockly$Input.Align.CENTRE,
            CENTER: e.module$exports$Blockly$Input.Align.CENTRE
        }
          , d = null;
        switch (a.type) {
        case "input_value":
            d = this.appendValueInput(a.name);
            break;
        case "input_statement":
            d = this.appendStatementInput(a.name);
            break;
        case "input_dummy":
            d = this.appendDummyInput(a.name)
        }
        if (!d)
            return null;
        a.check && d.setCheck(a.check);
        a.align && (c = c[a.align.toUpperCase()],
        void 0 === c ? console.warn(b + "Illegal align value: ", a.align) : d.setAlign(c));
        return d
    }
    ;
    A.Block.prototype.isInputKeyword_ = function(a) {
        return "input_value" === a || "input_statement" === a || "input_dummy" === a
    }
    ;
    A.Block.prototype.stringToFieldJson_ = function(a) {
        return (a = a.trim()) ? {
            type: "field_label",
            text: a
        } : null
    }
    ;
    A.Block.prototype.appendInput_ = function(a, b) {
        var c = null;
        if (a === e.module$exports$Blockly$inputTypes.inputTypes.VALUE || a === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT)
            c = this.makeConnection_(a);
        a === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT && this.statementInputCount++;
        a = new e.module$exports$Blockly$Input.Input(a,b,this,c);
        this.inputList.push(a);
        return a
    }
    ;
    A.Block.prototype.moveInputBefore = function(a, b) {
        if (a !== b) {
            for (var c = -1, d = b ? -1 : this.inputList.length, f = 0, g; g = this.inputList[f]; f++)
                if (g.name === a) {
                    if (c = f,
                    -1 !== d)
                        break
                } else if (b && g.name === b && (d = f,
                -1 !== c))
                    break;
            if (-1 === c)
                throw Error('Named input "' + a + '" not found.');
            if (-1 === d)
                throw Error('Reference input "' + b + '" not found.');
            this.moveNumberedInputBefore(c, d)
        }
    }
    ;
    A.Block.prototype.moveNumberedInputBefore = function(a, b) {
        if (a === b)
            throw Error("Can't move input to itself.");
        if (a >= this.inputList.length)
            throw RangeError("Input index " + a + " out of bounds.");
        if (b > this.inputList.length)
            throw RangeError("Reference input " + b + " out of bounds.");
        var c = this.inputList[a];
        this.inputList.splice(a, 1);
        a < b && b--;
        this.inputList.splice(b, 0, c)
    }
    ;
    A.Block.prototype.removeInput = function(a, b) {
        for (var c = 0, d; d = this.inputList[c]; c++)
            if (d.name === a)
                return d.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT && this.statementInputCount--,
                d.dispose(),
                this.inputList.splice(c, 1),
                !0;
        if (b)
            return !1;
        throw Error("Input not found: " + a);
    }
    ;
    A.Block.prototype.getInput = function(a) {
        for (var b = 0, c; c = this.inputList[b]; b++)
            if (c.name === a)
                return c;
        return null
    }
    ;
    A.Block.prototype.getInputTargetBlock = function(a) {
        return (a = this.getInput(a)) && a.connection && a.connection.targetBlock()
    }
    ;
    A.Block.prototype.getCommentText = function() {
        return this.commentModel.text
    }
    ;
    A.Block.prototype.setCommentText = function(a) {
        this.commentModel.text !== a && ((0,
        h.fire)(new ((0,
        h.get)(h.CHANGE))(this,"comment",null,this.commentModel.text,a)),
        this.comment = this.commentModel.text = a)
    }
    ;
    A.Block.prototype.setWarningText = function(a, b) {}
    ;
    A.Block.prototype.setMutator = function(a) {}
    ;
    A.Block.prototype.getRelativeToSurfaceXY = function() {
        return this.xy_
    }
    ;
    A.Block.prototype.moveBy = function(a, b) {
        if (this.parentBlock_)
            throw Error("Block has parent.");
        var c = new ((0,
        h.get)(h.MOVE))(this);
        this.xy_.translate(a, b);
        c.recordNew();
        (0,
        h.fire)(c)
    }
    ;
    A.Block.prototype.makeConnection_ = function(a) {
        return new F(this,a)
    }
    ;
    A.Block.prototype.allInputsFilled = function(a) {
        void 0 === a && (a = !0);
        if (!a && this.isShadow())
            return !1;
        for (var b = 0, c; c = this.inputList[b]; b++)
            if (c.connection && (c = c.connection.targetBlock(),
            !c || !c.allInputsFilled(a)))
                return !1;
        return (b = this.getNextBlock()) ? b.allInputsFilled(a) : !0
    }
    ;
    A.Block.prototype.toDevString = function() {
        var a = this.type ? '"' + this.type + '" block' : "Block";
        this.id && (a += ' (id="' + this.id + '")');
        return a
    }
    ;
    var ba = {
        ContextMenuRegistry: function() {
            ba.ContextMenuRegistry.registry = this;
            this.registry_ = Object.create(null)
        }
    };
    ba.ContextMenuRegistry.ScopeType = {
        BLOCK: "block",
        WORKSPACE: "workspace"
    };
    ba.ContextMenuRegistry.registry = null;
    ba.ContextMenuRegistry.prototype.register = function(a) {
        if (this.registry_[a.id])
            throw Error('Menu item with ID "' + a.id + '" is already registered.');
        this.registry_[a.id] = a
    }
    ;
    ba.ContextMenuRegistry.prototype.unregister = function(a) {
        if (!this.registry_[a])
            throw Error('Menu item with ID "' + a + '" not found.');
        delete this.registry_[a]
    }
    ;
    ba.ContextMenuRegistry.prototype.getItem = function(a) {
        return this.registry_[a] || null
    }
    ;
    ba.ContextMenuRegistry.prototype.getContextMenuOptions = function(a, b) {
        var c = []
          , d = this.registry_;
        Object.keys(d).forEach(function(f) {
            f = d[f];
            if (a === f.scopeType) {
                var g = f.preconditionFn(b);
                "hidden" !== g && (f = {
                    text: "function" === typeof f.displayText ? f.displayText(b) : f.displayText,
                    enabled: "enabled" === g,
                    callback: f.callback,
                    scope: b,
                    weight: f.weight
                },
                c.push(f))
            }
        });
        c.sort(function(f, g) {
            return f.weight - g.weight
        });
        return c
    }
    ;
    new ba.ContextMenuRegistry;
    var Y = {
        RenderedConnection: function(a, b) {
            Y.RenderedConnection.superClass_.constructor.call(this, a, b);
            this.db_ = a.workspace.connectionDBList[b];
            this.dbOpposite_ = a.workspace.connectionDBList[e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE[b]];
            this.offsetInBlock_ = new E(0,0);
            this.trackedState_ = Y.RenderedConnection.TrackedState.WILL_TRACK;
            this.targetConnection = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Y.RenderedConnection, F);
    Y.RenderedConnection.TrackedState = {
        WILL_TRACK: -1,
        UNTRACKED: 0,
        TRACKED: 1
    };
    Y.RenderedConnection.prototype.dispose = function() {
        Y.RenderedConnection.superClass_.dispose.call(this);
        this.trackedState_ === Y.RenderedConnection.TrackedState.TRACKED && this.db_.removeConnection(this, this.y)
    }
    ;
    Y.RenderedConnection.prototype.getSourceBlock = function() {
        return Y.RenderedConnection.superClass_.getSourceBlock.call(this)
    }
    ;
    Y.RenderedConnection.prototype.targetBlock = function() {
        return Y.RenderedConnection.superClass_.targetBlock.call(this)
    }
    ;
    Y.RenderedConnection.prototype.distanceFrom = function(a) {
        var b = this.x - a.x;
        a = this.y - a.y;
        return Math.sqrt(b * b + a * a)
    }
    ;
    Y.RenderedConnection.prototype.bumpAwayFrom = function(a) {
        if (!this.sourceBlock_.workspace.isDragging()) {
            var b = this.sourceBlock_.getRootBlock();
            if (!b.isInFlyout) {
                var c = !1;
                if (!b.isMovable()) {
                    b = a.getSourceBlock().getRootBlock();
                    if (!b.isMovable())
                        return;
                    a = this;
                    c = !0
                }
                var d = (0,
                e.module$exports$Blockly$common.getSelected)() == b;
                d || b.addSelect();
                var f = a.x + e.module$exports$Blockly$internalConstants.SNAP_RADIUS + Math.floor(Math.random() * e.module$exports$Blockly$internalConstants.BUMP_RANDOMNESS) - this.x
                  , g = a.y + e.module$exports$Blockly$internalConstants.SNAP_RADIUS + Math.floor(Math.random() * e.module$exports$Blockly$internalConstants.BUMP_RANDOMNESS) - this.y;
                c && (g = -g);
                b.RTL && (f = a.x - e.module$exports$Blockly$internalConstants.SNAP_RADIUS - Math.floor(Math.random() * e.module$exports$Blockly$internalConstants.BUMP_RANDOMNESS) - this.x);
                b.moveBy(f, g);
                d || b.removeSelect()
            }
        }
    }
    ;
    Y.RenderedConnection.prototype.moveTo = function(a, b) {
        this.trackedState_ === Y.RenderedConnection.TrackedState.WILL_TRACK ? (this.db_.addConnection(this, b),
        this.trackedState_ = Y.RenderedConnection.TrackedState.TRACKED) : this.trackedState_ === Y.RenderedConnection.TrackedState.TRACKED && (this.db_.removeConnection(this, this.y),
        this.db_.addConnection(this, b));
        this.x = a;
        this.y = b
    }
    ;
    Y.RenderedConnection.prototype.moveBy = function(a, b) {
        this.moveTo(this.x + a, this.y + b)
    }
    ;
    Y.RenderedConnection.prototype.moveToOffset = function(a) {
        this.moveTo(a.x + this.offsetInBlock_.x, a.y + this.offsetInBlock_.y)
    }
    ;
    Y.RenderedConnection.prototype.setOffsetInBlock = function(a, b) {
        this.offsetInBlock_.x = a;
        this.offsetInBlock_.y = b
    }
    ;
    Y.RenderedConnection.prototype.getOffsetInBlock = function() {
        return this.offsetInBlock_
    }
    ;
    Y.RenderedConnection.prototype.tighten = function() {
        var a = this.targetConnection.x - this.x
          , b = this.targetConnection.y - this.y;
        if (0 !== a || 0 !== b) {
            var c = this.targetBlock()
              , d = c.getSvgRoot();
            if (!d)
                throw Error("block is not rendered.");
            d = (0,
            ca.getRelativeXY)(d);
            c.getSvgRoot().setAttribute("transform", "translate(" + (d.x - a) + "," + (d.y - b) + ")");
            c.moveConnections(-a, -b)
        }
    }
    ;
    Y.RenderedConnection.prototype.closest = function(a, b) {
        return this.dbOpposite_.searchForClosest(this, a, b)
    }
    ;
    Y.RenderedConnection.prototype.highlight = function() {
        var a = this.sourceBlock_.workspace.getRenderer().getConstants()
          , b = a.shapeFor(this);
        this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE || this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE ? (a = a.TAB_OFFSET_FROM_TOP,
        b = (0,
        p.moveBy)(0, -a) + (0,
        p.lineOnAxis)("v", a) + b.pathDown + (0,
        p.lineOnAxis)("v", a)) : (a = a.NOTCH_OFFSET_LEFT - a.CORNER_RADIUS,
        b = (0,
        p.moveBy)(-a, 0) + (0,
        p.lineOnAxis)("h", a) + b.pathLeft + (0,
        p.lineOnAxis)("h", a));
        a = this.sourceBlock_.getRelativeToSurfaceXY();
        F.highlightedPath_ = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyHighlightedConnectionPath",
            d: b,
            transform: "translate(" + (this.x - a.x) + "," + (this.y - a.y) + ")" + (this.sourceBlock_.RTL ? " scale(-1 1)" : "")
        }, this.sourceBlock_.getSvgRoot())
    }
    ;
    Y.RenderedConnection.prototype.unhighlight = function() {
        (0,
        l.removeNode)(F.highlightedPath_);
        delete F.highlightedPath_
    }
    ;
    Y.RenderedConnection.prototype.setTracking = function(a) {
        a && this.trackedState_ === Y.RenderedConnection.TrackedState.TRACKED || !a && this.trackedState_ === Y.RenderedConnection.TrackedState.UNTRACKED || this.sourceBlock_.isInFlyout || (a ? (this.db_.addConnection(this, this.y),
        this.trackedState_ = Y.RenderedConnection.TrackedState.TRACKED) : (this.trackedState_ === Y.RenderedConnection.TrackedState.TRACKED && this.db_.removeConnection(this, this.y),
        this.trackedState_ = Y.RenderedConnection.TrackedState.UNTRACKED))
    }
    ;
    Y.RenderedConnection.prototype.stopTrackingAll = function() {
        this.setTracking(!1);
        if (this.targetConnection)
            for (var a = this.targetBlock().getDescendants(!1), b = 0; b < a.length; b++) {
                for (var c = a[b], d = c.getConnections_(!0), f = 0; f < d.length; f++)
                    d[f].setTracking(!1);
                c = c.getIcons();
                for (d = 0; d < c.length; d++)
                    c[d].setVisible(!1)
            }
    }
    ;
    Y.RenderedConnection.prototype.startTrackingAll = function() {
        this.setTracking(!0);
        var a = [];
        if (this.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE && this.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT)
            return a;
        var b = this.targetBlock();
        if (b) {
            if (b.isCollapsed()) {
                var c = [];
                b.outputConnection && c.push(b.outputConnection);
                b.nextConnection && c.push(b.nextConnection);
                b.previousConnection && c.push(b.previousConnection)
            } else
                c = b.getConnections_(!0);
            for (var d = 0; d < c.length; d++)
                a.push.apply(a, c[d].startTrackingAll());
            a.length || (a = [b])
        }
        return a
    }
    ;
    Y.RenderedConnection.prototype.onFailedConnect = function(a) {
        var b = this.getSourceBlock();
        if ((0,
        h.getRecordUndo)()) {
            var c = (0,
            h.getGroup)();
            setTimeout(function() {
                b.isDisposed() || b.getParent() || ((0,
                h.setGroup)(c),
                this.bumpAwayFrom(a),
                (0,
                h.setGroup)(!1))
            }
            .bind(this), e.module$exports$Blockly$internalConstants.BUMP_DELAY)
        }
    }
    ;
    Y.RenderedConnection.prototype.disconnectInternal_ = function(a, b) {
        Y.RenderedConnection.superClass_.disconnectInternal_.call(this, a, b);
        a.rendered && a.render();
        b.rendered && (b.updateDisabled(),
        b.render(),
        b.getSvgRoot().style.display = "block")
    }
    ;
    Y.RenderedConnection.prototype.respawnShadow_ = function() {
        Y.RenderedConnection.superClass_.respawnShadow_.call(this);
        var a = this.targetBlock();
        a && (a.initSvg(),
        a.render(!1),
        a = this.getSourceBlock(),
        a.rendered && a.render())
    }
    ;
    Y.RenderedConnection.prototype.neighbours = function(a) {
        return this.dbOpposite_.getNeighbours(this, a)
    }
    ;
    Y.RenderedConnection.prototype.connect_ = function(a) {
        Y.RenderedConnection.superClass_.connect_.call(this, a);
        var b = this.getSourceBlock();
        a = a.getSourceBlock();
        var c = b.rendered
          , d = a.rendered;
        c && b.updateDisabled();
        d && a.updateDisabled();
        c && d && (this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT || this.type === e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT ? a.render() : b.render());
        if (b = b.getInputWithBlock(a))
            b = b.isVisible(),
            a.getSvgRoot().style.display = b ? "block" : "none"
    }
    ;
    Y.RenderedConnection.prototype.onCheckChanged_ = function() {
        !this.isConnected() || this.targetConnection && this.getConnectionChecker().canConnect(this, this.targetConnection, !1) || ((this.isSuperior() ? this.targetBlock() : this.sourceBlock_).unplug(),
        this.sourceBlock_.bumpNeighbours())
    }
    ;
    var ic = function() {
        this.drawer_ = this.curNode_ = this.colour = null;
        this.type = "marker"
    };
    ic.prototype.setDrawer = function(a) {
        this.drawer_ = a
    }
    ;
    ic.prototype.getDrawer = function() {
        return this.drawer_
    }
    ;
    ic.prototype.getCurNode = function() {
        return this.curNode_
    }
    ;
    ic.prototype.setCurNode = function(a) {
        var b = this.curNode_;
        this.curNode_ = a;
        this.drawer_ && this.drawer_.draw(b, this.curNode_)
    }
    ;
    ic.prototype.draw = function() {
        this.drawer_ && this.drawer_.draw(this.curNode_, this.curNode_)
    }
    ;
    ic.prototype.hide = function() {
        this.drawer_ && this.drawer_.hide()
    }
    ;
    ic.prototype.dispose = function() {
        this.getDrawer() && this.getDrawer().dispose()
    }
    ;
    var jc = {
        Cursor: function() {
            jc.Cursor.superClass_.constructor.call(this);
            this.type = "cursor"
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(jc.Cursor, ic);
    jc.Cursor.prototype.next = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        for (a = a.next(); a && a.next() && (a.getType() === v.ASTNode.types.NEXT || a.getType() === v.ASTNode.types.BLOCK); )
            a = a.next();
        a && this.setCurNode(a);
        return a
    }
    ;
    jc.Cursor.prototype.in = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        if (a.getType() === v.ASTNode.types.PREVIOUS || a.getType() === v.ASTNode.types.OUTPUT)
            a = a.next();
        (a = a.in()) && this.setCurNode(a);
        return a
    }
    ;
    jc.Cursor.prototype.prev = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        for (a = a.prev(); a && a.prev() && (a.getType() === v.ASTNode.types.NEXT || a.getType() === v.ASTNode.types.BLOCK); )
            a = a.prev();
        a && this.setCurNode(a);
        return a
    }
    ;
    jc.Cursor.prototype.out = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        (a = a.out()) && a.getType() === v.ASTNode.types.BLOCK && (a = a.prev() || a);
        a && this.setCurNode(a);
        return a
    }
    ;
    (0,
    r.register)(r.Type.CURSOR, r.DEFAULT, jc.Cursor);
    var ab = {
        BasicCursor: function() {
            ab.BasicCursor.superClass_.constructor.call(this)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ab.BasicCursor, jc.Cursor);
    ab.BasicCursor.registrationName = "basicCursor";
    ab.BasicCursor.prototype.next = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        (a = this.getNextNode_(a, this.validNode_)) && this.setCurNode(a);
        return a
    }
    ;
    ab.BasicCursor.prototype.in = function() {
        return this.next()
    }
    ;
    ab.BasicCursor.prototype.prev = function() {
        var a = this.getCurNode();
        if (!a)
            return null;
        (a = this.getPreviousNode_(a, this.validNode_)) && this.setCurNode(a);
        return a
    }
    ;
    ab.BasicCursor.prototype.out = function() {
        return this.prev()
    }
    ;
    ab.BasicCursor.prototype.getNextNode_ = function(a, b) {
        if (!a)
            return null;
        var c = a.in() || a.next();
        if (b(c))
            return c;
        if (c)
            return this.getNextNode_(c, b);
        a = this.findSiblingOrParent_(a.out());
        return b(a) ? a : a ? this.getNextNode_(a, b) : null
    }
    ;
    ab.BasicCursor.prototype.getPreviousNode_ = function(a, b) {
        if (!a)
            return null;
        var c = a.prev();
        c = c ? this.getRightMostChild_(c) : a.out();
        return b(c) ? c : c ? this.getPreviousNode_(c, b) : null
    }
    ;
    ab.BasicCursor.prototype.validNode_ = function(a) {
        var b = !1;
        a = a && a.getType();
        if (a === v.ASTNode.types.OUTPUT || a === v.ASTNode.types.INPUT || a === v.ASTNode.types.FIELD || a === v.ASTNode.types.NEXT || a === v.ASTNode.types.PREVIOUS || a === v.ASTNode.types.WORKSPACE)
            b = !0;
        return b
    }
    ;
    ab.BasicCursor.prototype.findSiblingOrParent_ = function(a) {
        if (!a)
            return null;
        var b = a.next();
        return b ? b : this.findSiblingOrParent_(a.out())
    }
    ;
    ab.BasicCursor.prototype.getRightMostChild_ = function(a) {
        if (!a.in())
            return a;
        for (a = a.in(); a.next(); )
            a = a.next();
        return this.getRightMostChild_(a)
    }
    ;
    (0,
    r.register)(r.Type.CURSOR, ab.BasicCursor.registrationName, ab.BasicCursor);
    var dd = {
        TabNavigateCursor: function() {
            dd.TabNavigateCursor.superClass_.constructor.call(this)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(dd.TabNavigateCursor, ab.BasicCursor);
    dd.TabNavigateCursor.prototype.validNode_ = function(a) {
        var b = !1
          , c = a && a.getType();
        a && (a = a.getLocation(),
        c === v.ASTNode.types.FIELD && a && a.isTabNavigable() && a.isClickable() && (b = !0));
        return b
    }
    ;
    var kc = {
        Selected: function(a, b, c) {
            kc.Selected.superClass_.constructor.call(this, c);
            this.oldElementId = a;
            this.newElementId = b
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(kc.Selected, ob.UiBase);
    kc.Selected.prototype.type = h.SELECTED;
    kc.Selected.prototype.toJson = function() {
        var a = kc.Selected.superClass_.toJson.call(this);
        a.oldElementId = this.oldElementId;
        a.newElementId = this.newElementId;
        return a
    }
    ;
    kc.Selected.prototype.fromJson = function(a) {
        kc.Selected.superClass_.fromJson.call(this, a);
        this.oldElementId = a.oldElementId;
        this.newElementId = a.newElementId
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.SELECTED, kc.Selected);
    var z = {
        BlockSvg: function(a, b, c) {
            this.svgGroup_ = (0,
            l.createSvgElement)(q.G, {}, null);
            this.svgGroup_.translate_ = "";
            this.style = a.getRenderer().getConstants().getBlockStyle(null);
            this.pathObject = a.getRenderer().makePathObject(this.svgGroup_, this.style);
            this.renderIsInProgress_ = this.rendered = !1;
            this.workspace = a;
            this.previousConnection = this.nextConnection = this.outputConnection = null;
            this.useDragSurface_ = (0,
            ca.is3dSupported)() && !!a.getBlockDragSurface();
            var d = this.pathObject.svgPath;
            d.tooltip = this;
            (0,
            T.bindMouseEvents)(d);
            z.BlockSvg.superClass_.constructor.call(this, a, b, c);
            this.svgGroup_.dataset ? this.svgGroup_.dataset.id = this.id : O.IE && this.svgGroup_.setAttribute("data-id", this.id)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(z.BlockSvg, A.Block);
    z.BlockSvg.prototype.height = 0;
    z.BlockSvg.prototype.width = 0;
    z.BlockSvg.prototype.warningTextDb_ = null;
    z.BlockSvg.INLINE = -1;
    z.BlockSvg.COLLAPSED_WARNING_ID = "TEMP_COLLAPSED_WARNING_";
    z.BlockSvg.prototype.initSvg = function() {
        if (!this.workspace.rendered)
            throw TypeError("Workspace is headless.");
        for (var a = 0, b; b = this.inputList[a]; a++)
            b.init();
        a = this.getIcons();
        for (b = 0; b < a.length; b++)
            a[b].createIcon();
        this.applyColour();
        this.pathObject.updateMovable(this.isMovable());
        a = this.getSvgRoot();
        this.workspace.options.readOnly || this.eventsInit_ || !a || (0,
        u.conditionalBind)(a, "mousedown", this, this.onMouseDown_);
        this.eventsInit_ = !0;
        a.parentNode || this.workspace.getCanvas().appendChild(a)
    }
    ;
    z.BlockSvg.prototype.getColourSecondary = function() {
        return this.style.colourSecondary
    }
    ;
    z.BlockSvg.prototype.getColourTertiary = function() {
        return this.style.colourTertiary
    }
    ;
    z.BlockSvg.prototype.select = function() {
        if (this.isShadow() && this.getParent())
            this.getParent().select();
        else if ((0,
        e.module$exports$Blockly$common.getSelected)() !== this) {
            var a = null;
            if ((0,
            e.module$exports$Blockly$common.getSelected)()) {
                a = (0,
                e.module$exports$Blockly$common.getSelected)().id;
                (0,
                h.disable)();
                try {
                    (0,
                    e.module$exports$Blockly$common.getSelected)().unselect()
                } finally {
                    (0,
                    h.enable)()
                }
            }
            a = new ((0,
            h.get)(h.SELECTED))(a,this.id,this.workspace.id);
            (0,
            h.fire)(a);
            (0,
            e.module$exports$Blockly$common.setSelected)(this);
            this.addSelect()
        }
    }
    ;
    z.BlockSvg.prototype.unselect = function() {
        if ((0,
        e.module$exports$Blockly$common.getSelected)() === this) {
            var a = new ((0,
            h.get)(h.SELECTED))(this.id,null,this.workspace.id);
            a.workspaceId = this.workspace.id;
            (0,
            h.fire)(a);
            (0,
            e.module$exports$Blockly$common.setSelected)(null);
            this.removeSelect()
        }
    }
    ;
    z.BlockSvg.prototype.mutator = null;
    z.BlockSvg.prototype.comment = null;
    z.BlockSvg.prototype.commentIcon_ = null;
    z.BlockSvg.prototype.warning = null;
    z.BlockSvg.prototype.getIcons = function() {
        var a = [];
        this.mutator && a.push(this.mutator);
        this.commentIcon_ && a.push(this.commentIcon_);
        this.warning && a.push(this.warning);
        return a
    }
    ;
    z.BlockSvg.prototype.setParent = function(a) {
        var b = this.parentBlock_;
        if (a !== b) {
            (0,
            l.startTextWidthCache)();
            z.BlockSvg.superClass_.setParent.call(this, a);
            (0,
            l.stopTextWidthCache)();
            var c = this.getSvgRoot();
            if (!this.workspace.isClearing && c) {
                var d = this.getRelativeToSurfaceXY();
                a ? (a.getSvgRoot().appendChild(c),
                a = this.getRelativeToSurfaceXY(),
                this.moveConnections(a.x - d.x, a.y - d.y)) : b && (this.workspace.getCanvas().appendChild(c),
                this.translate(d.x, d.y));
                this.applyColour()
            }
        }
    }
    ;
    z.BlockSvg.prototype.getRelativeToSurfaceXY = function() {
        var a = 0
          , b = 0
          , c = this.useDragSurface_ ? this.workspace.getBlockDragSurface().getGroup() : null
          , d = this.getSvgRoot();
        if (d) {
            do {
                var f = (0,
                ca.getRelativeXY)(d);
                a += f.x;
                b += f.y;
                this.useDragSurface_ && this.workspace.getBlockDragSurface().getCurrentBlock() === d && (f = this.workspace.getBlockDragSurface().getSurfaceTranslation(),
                a += f.x,
                b += f.y);
                d = d.parentNode
            } while (d && d !== this.workspace.getCanvas() && d !== c)
        }
        return new E(a,b)
    }
    ;
    z.BlockSvg.prototype.moveBy = function(a, b) {
        if (this.parentBlock_)
            throw Error("Block has parent.");
        var c = (0,
        h.isEnabled)(), d;
        c && (d = new ((0,
        h.get)(h.MOVE))(this));
        var f = this.getRelativeToSurfaceXY();
        this.translate(f.x + a, f.y + b);
        this.moveConnections(a, b);
        c && (d.recordNew(),
        (0,
        h.fire)(d));
        this.workspace.resizeContents()
    }
    ;
    z.BlockSvg.prototype.translate = function(a, b) {
        this.getSvgRoot().setAttribute("transform", "translate(" + a + "," + b + ")")
    }
    ;
    z.BlockSvg.prototype.moveToDragSurface = function() {
        if (this.useDragSurface_) {
            var a = this.getRelativeToSurfaceXY();
            this.clearTransformAttributes_();
            this.workspace.getBlockDragSurface().translateSurface(a.x, a.y);
            (a = this.getSvgRoot()) && this.workspace.getBlockDragSurface().setBlocksAndShow(a)
        }
    }
    ;
    z.BlockSvg.prototype.moveTo = function(a) {
        var b = this.getRelativeToSurfaceXY();
        this.moveBy(a.x - b.x, a.y - b.y)
    }
    ;
    z.BlockSvg.prototype.moveOffDragSurface = function(a) {
        this.useDragSurface_ && (this.translate(a.x, a.y),
        this.workspace.getBlockDragSurface().clearAndHide(this.workspace.getCanvas()))
    }
    ;
    z.BlockSvg.prototype.moveDuringDrag = function(a) {
        this.useDragSurface_ ? this.workspace.getBlockDragSurface().translateSurface(a.x, a.y) : (this.svgGroup_.translate_ = "translate(" + a.x + "," + a.y + ")",
        this.svgGroup_.setAttribute("transform", this.svgGroup_.translate_ + this.svgGroup_.skew_))
    }
    ;
    z.BlockSvg.prototype.clearTransformAttributes_ = function() {
        this.getSvgRoot().removeAttribute("transform")
    }
    ;
    z.BlockSvg.prototype.snapToGrid = function() {
        if (this.workspace && !this.workspace.isDragging() && !this.getParent() && !this.isInFlyout) {
            var a = this.workspace.getGrid();
            if (a && a.shouldSnap()) {
                var b = a.getSpacing()
                  , c = b / 2
                  , d = this.getRelativeToSurfaceXY();
                a = Math.round(Math.round((d.x - c) / b) * b + c - d.x);
                b = Math.round(Math.round((d.y - c) / b) * b + c - d.y);
                (a || b) && this.moveBy(a, b)
            }
        }
    }
    ;
    z.BlockSvg.prototype.getBoundingRectangle = function() {
        var a = this.getRelativeToSurfaceXY()
          , b = this.getHeightWidth();
        if (this.RTL)
            var c = a.x - b.width
              , d = a.x;
        else
            c = a.x,
            d = a.x + b.width;
        return new Aa(a.y,a.y + b.height,c,d)
    }
    ;
    z.BlockSvg.prototype.markDirty = function() {
        this.pathObject.constants = this.workspace.getRenderer().getConstants();
        for (var a = 0, b; b = this.inputList[a]; a++)
            b.markDirty()
    }
    ;
    z.BlockSvg.prototype.setCollapsed = function(a) {
        this.collapsed_ !== a && (z.BlockSvg.superClass_.setCollapsed.call(this, a),
        a ? this.rendered && this.render() : this.updateCollapsed_())
    }
    ;
    z.BlockSvg.prototype.updateCollapsed_ = function() {
        for (var a = this.isCollapsed(), b = dc.COLLAPSED_INPUT_NAME, c = dc.COLLAPSED_FIELD_NAME, d = 0, f; f = this.inputList[d]; d++)
            f.name !== b && f.setVisible(!a);
        if (a) {
            a = this.getIcons();
            for (d = 0; f = a[d]; d++)
                f.setVisible(!1);
            a = this.toString(e.module$exports$Blockly$internalConstants.COLLAPSE_CHARS);
            (d = this.getField(c)) ? d.setValue(a) : (this.getInput(b) || this.appendDummyInput(b)).appendField(new e.module$exports$Blockly$FieldLabel.FieldLabel(a), c)
        } else
            this.updateDisabled(),
            this.removeInput(b)
    }
    ;
    z.BlockSvg.prototype.tab = function(a, b) {
        var c = new dd.TabNavigateCursor;
        c.setCurNode(v.ASTNode.createFieldNode(a));
        a = c.getCurNode();
        b ? c.next() : c.prev();
        (b = c.getCurNode()) && b !== a && (b.getLocation().showEditor(),
        this.workspace.keyboardAccessibilityMode && this.workspace.getCursor().setCurNode(b))
    }
    ;
    z.BlockSvg.prototype.onMouseDown_ = function(a) {
        var b = this.workspace && this.workspace.getGesture(a);
        b && b.handleBlockStart(a, this)
    }
    ;
    z.BlockSvg.prototype.showHelp = function() {
        var a = "function" === typeof this.helpUrl ? this.helpUrl() : this.helpUrl;
        a && window.open(a)
    }
    ;
    z.BlockSvg.prototype.generateContextMenu = function() {
        if (this.workspace.options.readOnly || !this.contextMenu)
            return null;
        var a = ba.ContextMenuRegistry.registry.getContextMenuOptions(ba.ContextMenuRegistry.ScopeType.BLOCK, {
            block: this
        });
        this.customContextMenu && this.customContextMenu(a);
        return a
    }
    ;
    z.BlockSvg.prototype.showContextMenu = function(a) {
        var b = this.generateContextMenu();
        b && b.length && ((0,
        e.module$exports$Blockly$ContextMenu.show)(a, b, this.RTL),
        (0,
        e.module$exports$Blockly$ContextMenu.setCurrentBlock)(this))
    }
    ;
    z.BlockSvg.prototype.moveConnections = function(a, b) {
        if (this.rendered) {
            for (var c = this.getConnections_(!1), d = 0; d < c.length; d++)
                c[d].moveBy(a, b);
            c = this.getIcons();
            for (d = 0; d < c.length; d++)
                c[d].computeIconLocation();
            for (c = 0; c < this.childBlocks_.length; c++)
                this.childBlocks_[c].moveConnections(a, b)
        }
    }
    ;
    z.BlockSvg.prototype.setDragging = function(a) {
        if (a) {
            var b = this.getSvgRoot();
            b.translate_ = "";
            b.skew_ = "";
            e.module$exports$Blockly$common.draggingConnections.push.apply(e.module$exports$Blockly$common.draggingConnections, w.arrayFromIterable(this.getConnections_(!0)));
            (0,
            l.addClass)(this.svgGroup_, "blocklyDragging")
        } else
            e.module$exports$Blockly$common.draggingConnections.length = 0,
            (0,
            l.removeClass)(this.svgGroup_, "blocklyDragging");
        for (b = 0; b < this.childBlocks_.length; b++)
            this.childBlocks_[b].setDragging(a)
    }
    ;
    z.BlockSvg.prototype.setMovable = function(a) {
        z.BlockSvg.superClass_.setMovable.call(this, a);
        this.pathObject.updateMovable(a)
    }
    ;
    z.BlockSvg.prototype.setEditable = function(a) {
        z.BlockSvg.superClass_.setEditable.call(this, a);
        a = this.getIcons();
        for (var b = 0; b < a.length; b++)
            a[b].updateEditable()
    }
    ;
    z.BlockSvg.prototype.setShadow = function(a) {
        z.BlockSvg.superClass_.setShadow.call(this, a);
        this.applyColour()
    }
    ;
    z.BlockSvg.prototype.setInsertionMarker = function(a) {
        this.isInsertionMarker_ !== a && (this.isInsertionMarker_ = a) && (this.setColour(this.workspace.getRenderer().getConstants().INSERTION_MARKER_COLOUR),
        this.pathObject.updateInsertionMarker(!0))
    }
    ;
    z.BlockSvg.prototype.getSvgRoot = function() {
        return this.svgGroup_
    }
    ;
    z.BlockSvg.prototype.dispose = function(a, b) {
        if (this.workspace) {
            (0,
            T.dispose)();
            (0,
            T.unbindMouseEvents)(this.pathObject.svgPath);
            (0,
            l.startTextWidthCache)();
            var c = this.workspace;
            (0,
            e.module$exports$Blockly$common.getSelected)() === this && (this.unselect(),
            this.workspace.cancelCurrentGesture());
            (0,
            e.module$exports$Blockly$ContextMenu.getCurrentBlock)() === this && (0,
            e.module$exports$Blockly$ContextMenu.hide)();
            b && this.rendered && (this.unplug(a),
            (0,
            Hb.disposeUiEffect)(this));
            this.rendered = !1;
            if (this.warningTextDb_) {
                for (var d in this.warningTextDb_)
                    clearTimeout(this.warningTextDb_[d]);
                this.warningTextDb_ = null
            }
            b = this.getIcons();
            for (d = 0; d < b.length; d++)
                b[d].dispose();
            z.BlockSvg.superClass_.dispose.call(this, !!a);
            (0,
            l.removeNode)(this.svgGroup_);
            c.resizeContents();
            this.svgGroup_ = null;
            (0,
            l.stopTextWidthCache)()
        }
    }
    ;
    z.BlockSvg.prototype.checkAndDelete = function() {
        this.workspace.isFlyout || ((0,
        h.setGroup)(!0),
        this.workspace.hideChaff(),
        this.outputConnection ? this.dispose(!1, !0) : this.dispose(!0, !0),
        (0,
        h.setGroup)(!1))
    }
    ;
    z.BlockSvg.prototype.toCopyData = function() {
        return this.isInsertionMarker_ ? null : {
            saveInfo: (0,
            Sa.save)(this, {
                addCoordinates: !0,
                addNextBlocks: !1
            }),
            source: this.workspace,
            typeCounts: (0,
            e.module$exports$Blockly$common.getBlockTypeCounts)(this, !0)
        }
    }
    ;
    z.BlockSvg.prototype.applyColour = function() {
        this.pathObject.applyColour(this);
        for (var a = this.getIcons(), b = 0; b < a.length; b++)
            a[b].applyColour();
        for (a = 0; b = this.inputList[a]; a++)
            for (var c = 0, d; d = b.fieldRow[c]; c++)
                d.applyColour()
    }
    ;
    z.BlockSvg.prototype.updateDisabled = function() {
        var a = this.getChildren(!1);
        this.applyColour();
        if (!this.isCollapsed())
            for (var b = 0, c; c = a[b]; b++)
                c.rendered && c.updateDisabled()
    }
    ;
    z.BlockSvg.prototype.getCommentIcon = function() {
        return this.commentIcon_
    }
    ;
    z.BlockSvg.prototype.setCommentText = function(a) {
        var b = Ka.Comment;
        if (!b)
            throw Error("Missing require for Blockly.Comment");
        this.commentModel.text !== a && (z.BlockSvg.superClass_.setCommentText.call(this, a),
        a = null !== a,
        !!this.commentIcon_ === a ? this.commentIcon_.updateText() : (a ? this.comment = this.commentIcon_ = new b(this) : (this.commentIcon_.dispose(),
        this.comment = this.commentIcon_ = null),
        this.rendered && (this.render(),
        this.bumpNeighbours())))
    }
    ;
    z.BlockSvg.prototype.setWarningText = function(a, b) {
        var c = Ab.Warning;
        if (!c)
            throw Error("Missing require for Blockly.Warning");
        this.warningTextDb_ || (this.warningTextDb_ = Object.create(null));
        var d = b || "";
        if (d)
            this.warningTextDb_[d] && (clearTimeout(this.warningTextDb_[d]),
            delete this.warningTextDb_[d]);
        else {
            b = w.makeIterator(Object.keys(this.warningTextDb_));
            for (var f = b.next(); !f.done; f = b.next())
                f = f.value,
                clearTimeout(this.warningTextDb_[f]),
                delete this.warningTextDb_[f]
        }
        if (this.workspace.isDragging()) {
            var g = this;
            this.warningTextDb_[d] = setTimeout(function() {
                g.workspace && (delete g.warningTextDb_[d],
                g.setWarningText(a, d))
            }, 100)
        } else {
            this.isInFlyout && (a = null);
            b = !1;
            if ("string" === typeof a) {
                f = this.getSurroundParent();
                for (var k = null; f; )
                    f.isCollapsed() && (k = f),
                    f = f.getSurroundParent();
                k && k.setWarningText(e.module$exports$Blockly$Msg.Msg.COLLAPSED_WARNINGS_WARNING, z.BlockSvg.COLLAPSED_WARNING_ID);
                this.warning || (this.warning = new c(this),
                b = !0);
                this.warning.setText(a, d)
            } else
                this.warning && !d ? (this.warning.dispose(),
                b = !0) : this.warning && (c = this.warning.getText(),
                this.warning.setText("", d),
                (b = this.warning.getText()) || this.warning.dispose(),
                b = c !== b);
            b && this.rendered && (this.render(),
            this.bumpNeighbours())
        }
    }
    ;
    z.BlockSvg.prototype.setMutator = function(a) {
        this.mutator && this.mutator !== a && this.mutator.dispose();
        a && (a.setBlock(this),
        this.mutator = a,
        a.createIcon());
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.setEnabled = function(a) {
        this.isEnabled() !== a && (z.BlockSvg.superClass_.setEnabled.call(this, a),
        this.rendered && !this.getInheritedDisabled() && this.updateDisabled())
    }
    ;
    z.BlockSvg.prototype.setHighlighted = function(a) {
        this.rendered && this.pathObject.updateHighlighted(a)
    }
    ;
    z.BlockSvg.prototype.addSelect = function() {
        this.pathObject.updateSelected(!0)
    }
    ;
    z.BlockSvg.prototype.removeSelect = function() {
        this.pathObject.updateSelected(!1)
    }
    ;
    z.BlockSvg.prototype.setDeleteStyle = function(a) {
        this.pathObject.updateDraggingDelete(a)
    }
    ;
    z.BlockSvg.prototype.getColour = function() {
        return this.style.colourPrimary
    }
    ;
    z.BlockSvg.prototype.setColour = function(a) {
        z.BlockSvg.superClass_.setColour.call(this, a);
        a = this.workspace.getRenderer().getConstants().getBlockStyleForColour(this.colour_);
        this.pathObject.setStyle(a.style);
        this.style = a.style;
        this.styleName_ = a.name;
        this.applyColour()
    }
    ;
    z.BlockSvg.prototype.setStyle = function(a) {
        var b = this.workspace.getRenderer().getConstants().getBlockStyle(a);
        this.styleName_ = a;
        if (b)
            this.hat = b.hat,
            this.pathObject.setStyle(b),
            this.colour_ = b.colourPrimary,
            this.style = b,
            this.applyColour();
        else
            throw Error("Invalid style name: " + a);
    }
    ;
    z.BlockSvg.prototype.bringToFront = function() {
        var a = this;
        do {
            var b = a.getSvgRoot()
              , c = b.parentNode
              , d = c.childNodes;
            d[d.length - 1] !== b && c.appendChild(b);
            a = a.getParent()
        } while (a)
    }
    ;
    z.BlockSvg.prototype.setPreviousStatement = function(a, b) {
        z.BlockSvg.superClass_.setPreviousStatement.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.setNextStatement = function(a, b) {
        z.BlockSvg.superClass_.setNextStatement.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.setOutput = function(a, b) {
        z.BlockSvg.superClass_.setOutput.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.setInputsInline = function(a) {
        z.BlockSvg.superClass_.setInputsInline.call(this, a);
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.removeInput = function(a, b) {
        a = z.BlockSvg.superClass_.removeInput.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours());
        return a
    }
    ;
    z.BlockSvg.prototype.moveNumberedInputBefore = function(a, b) {
        z.BlockSvg.superClass_.moveNumberedInputBefore.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours())
    }
    ;
    z.BlockSvg.prototype.appendInput_ = function(a, b) {
        a = z.BlockSvg.superClass_.appendInput_.call(this, a, b);
        this.rendered && (this.render(),
        this.bumpNeighbours());
        return a
    }
    ;
    z.BlockSvg.prototype.setConnectionTracking = function(a) {
        this.previousConnection && this.previousConnection.setTracking(a);
        this.outputConnection && this.outputConnection.setTracking(a);
        if (this.nextConnection) {
            this.nextConnection.setTracking(a);
            var b = this.nextConnection.targetBlock();
            b && b.setConnectionTracking(a)
        }
        if (!this.collapsed_)
            for (b = 0; b < this.inputList.length; b++) {
                var c = this.inputList[b].connection;
                c && (c.setTracking(a),
                (c = c.targetBlock()) && c.setConnectionTracking(a))
            }
    }
    ;
    z.BlockSvg.prototype.getConnections_ = function(a) {
        var b = [];
        if (a || this.rendered)
            if (this.outputConnection && b.push(this.outputConnection),
            this.previousConnection && b.push(this.previousConnection),
            this.nextConnection && b.push(this.nextConnection),
            a || !this.collapsed_) {
                a = 0;
                for (var c; c = this.inputList[a]; a++)
                    c.connection && b.push(c.connection)
            }
        return b
    }
    ;
    z.BlockSvg.prototype.lastConnectionInStack = function(a) {
        return z.BlockSvg.superClass_.lastConnectionInStack.call(this, a)
    }
    ;
    z.BlockSvg.prototype.getMatchingConnection = function(a, b) {
        return z.BlockSvg.superClass_.getMatchingConnection.call(this, a, b)
    }
    ;
    z.BlockSvg.prototype.makeConnection_ = function(a) {
        return new Y.RenderedConnection(this,a)
    }
    ;
    z.BlockSvg.prototype.bumpNeighbours = function() {
        if (this.workspace && !this.workspace.isDragging()) {
            var a = this.getRootBlock();
            if (!a.isInFlyout)
                for (var b = this.getConnections_(!1), c = 0, d; d = b[c]; c++) {
                    d.isConnected() && d.isSuperior() && d.targetBlock().bumpNeighbours();
                    for (var f = d.neighbours(e.module$exports$Blockly$internalConstants.SNAP_RADIUS), g = 0, k; k = f[g]; g++)
                        d.isConnected() && k.isConnected() || k.getSourceBlock().getRootBlock() !== a && (d.isSuperior() ? k.bumpAwayFrom(d) : d.bumpAwayFrom(k))
                }
        }
    }
    ;
    z.BlockSvg.prototype.scheduleSnapAndBump = function() {
        var a = this
          , b = (0,
        h.getGroup)();
        setTimeout(function() {
            (0,
            h.setGroup)(b);
            a.snapToGrid();
            (0,
            h.setGroup)(!1)
        }, e.module$exports$Blockly$internalConstants.BUMP_DELAY / 2);
        setTimeout(function() {
            (0,
            h.setGroup)(b);
            a.bumpNeighbours();
            (0,
            h.setGroup)(!1)
        }, e.module$exports$Blockly$internalConstants.BUMP_DELAY)
    }
    ;
    z.BlockSvg.prototype.positionNearConnection = function(a, b) {
        a.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT && a.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE || this.moveBy(b.x - a.x, b.y - a.y)
    }
    ;
    z.BlockSvg.prototype.getParent = function() {
        return z.BlockSvg.superClass_.getParent.call(this)
    }
    ;
    z.BlockSvg.prototype.getRootBlock = function() {
        return z.BlockSvg.superClass_.getRootBlock.call(this)
    }
    ;
    z.BlockSvg.prototype.render = function(a) {
        if (!this.renderIsInProgress_) {
            this.renderIsInProgress_ = !0;
            try {
                this.rendered = !0;
                (0,
                l.startTextWidthCache)();
                this.isCollapsed() && this.updateCollapsed_();
                this.workspace.getRenderer().render(this);
                this.updateConnectionLocations_();
                if (!1 !== a) {
                    var b = this.getParent();
                    b ? b.render(!0) : this.workspace.resizeContents()
                }
                (0,
                l.stopTextWidthCache)();
                this.updateMarkers_()
            } finally {
                this.renderIsInProgress_ = !1
            }
        }
    }
    ;
    z.BlockSvg.prototype.updateMarkers_ = function() {
        this.workspace.keyboardAccessibilityMode && this.pathObject.cursorSvg && this.workspace.getCursor().draw();
        this.workspace.keyboardAccessibilityMode && this.pathObject.markerSvg && this.workspace.getMarker(nb.LOCAL_MARKER).draw()
    }
    ;
    z.BlockSvg.prototype.updateConnectionLocations_ = function() {
        var a = this.getRelativeToSurfaceXY();
        this.previousConnection && this.previousConnection.moveToOffset(a);
        this.outputConnection && this.outputConnection.moveToOffset(a);
        for (var b = 0; b < this.inputList.length; b++) {
            var c = this.inputList[b].connection;
            c && (c.moveToOffset(a),
            c.isConnected() && c.tighten())
        }
        this.nextConnection && (this.nextConnection.moveToOffset(a),
        this.nextConnection.isConnected() && this.nextConnection.tighten())
    }
    ;
    z.BlockSvg.prototype.setCursorSvg = function(a) {
        this.pathObject.setCursorSvg(a)
    }
    ;
    z.BlockSvg.prototype.setMarkerSvg = function(a) {
        this.pathObject.setMarkerSvg(a)
    }
    ;
    z.BlockSvg.prototype.getHeightWidth = function() {
        var a = this.height
          , b = this.width
          , c = this.getNextBlock();
        if (c) {
            c = c.getHeightWidth();
            var d = this.workspace.getRenderer().getConstants().NOTCH_HEIGHT;
            a += c.height - d;
            b = Math.max(b, c.width)
        }
        return {
            height: a,
            width: b
        }
    }
    ;
    z.BlockSvg.prototype.fadeForReplacement = function(a) {
        this.pathObject.updateReplacementFade(a)
    }
    ;
    z.BlockSvg.prototype.highlightShapeForInput = function(a, b) {
        this.pathObject.updateShapeForInputHighlight(a, b)
    }
    ;
    var pb = function(a) {
        this.connections_ = [];
        this.connectionChecker_ = a
    };
    pb.prototype.addConnection = function(a, b) {
        b = this.calculateIndexForYPos_(b);
        this.connections_.splice(b, 0, a)
    }
    ;
    pb.prototype.findIndexOfConnection_ = function(a, b) {
        if (!this.connections_.length)
            return -1;
        var c = this.calculateIndexForYPos_(b);
        if (c >= this.connections_.length)
            return -1;
        b = a.y;
        for (var d = c; 0 <= d && this.connections_[d].y === b; ) {
            if (this.connections_[d] === a)
                return d;
            d--
        }
        for (d = c; d < this.connections_.length && this.connections_[d].y === b; ) {
            if (this.connections_[d] === a)
                return d;
            d++
        }
        return -1
    }
    ;
    pb.prototype.calculateIndexForYPos_ = function(a) {
        if (!this.connections_.length)
            return 0;
        for (var b = 0, c = this.connections_.length; b < c; ) {
            var d = Math.floor((b + c) / 2);
            if (this.connections_[d].y < a)
                b = d + 1;
            else if (this.connections_[d].y > a)
                c = d;
            else {
                b = d;
                break
            }
        }
        return b
    }
    ;
    pb.prototype.removeConnection = function(a, b) {
        a = this.findIndexOfConnection_(a, b);
        if (-1 === a)
            throw Error("Unable to find connection in connectionDB.");
        this.connections_.splice(a, 1)
    }
    ;
    pb.prototype.getNeighbours = function(a, b) {
        function c(B) {
            var P = f - d[B].x
              , la = g - d[B].y;
            Math.sqrt(P * P + la * la) <= b && x.push(d[B]);
            return la < b
        }
        var d = this.connections_
          , f = a.x
          , g = a.y;
        a = 0;
        for (var k = d.length - 2, n = k; a < n; )
            d[n].y < g ? a = n : k = n,
            n = Math.floor((a + k) / 2);
        var x = [];
        k = a = n;
        if (d.length) {
            for (; 0 <= a && c(a); )
                a--;
            do
                k++;
            while (k < d.length && c(k))
        }
        return x
    }
    ;
    pb.prototype.isInYRange_ = function(a, b, c) {
        return Math.abs(this.connections_[a].y - b) <= c
    }
    ;
    pb.prototype.searchForClosest = function(a, b, c) {
        if (!this.connections_.length)
            return {
                connection: null,
                radius: b
            };
        var d = a.y
          , f = a.x;
        a.x = f + c.x;
        a.y = d + c.y;
        var g = this.calculateIndexForYPos_(a.y);
        c = null;
        for (var k = b, n, x = g - 1; 0 <= x && this.isInYRange_(x, a.y, b); )
            n = this.connections_[x],
            this.connectionChecker_.canConnect(a, n, !0, k) && (c = n,
            k = n.distanceFrom(a)),
            x--;
        for (; g < this.connections_.length && this.isInYRange_(g, a.y, b); )
            n = this.connections_[g],
            this.connectionChecker_.canConnect(a, n, !0, k) && (c = n,
            k = n.distanceFrom(a)),
            g++;
        a.x = f;
        a.y = d;
        return {
            connection: c,
            radius: k
        }
    }
    ;
    pb.init = function(a) {
        var b = [];
        b[e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE] = new pb(a);
        b[e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE] = new pb(a);
        b[e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT] = new pb(a);
        b[e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT] = new pb(a);
        return b
    }
    ;
    var lc = function(a, b) {
        this.workspace_ = a;
        this.theme_ = b;
        this.subscribedWorkspaces_ = [];
        this.componentDB_ = Object.create(null)
    };
    lc.prototype.getTheme = function() {
        return this.theme_
    }
    ;
    lc.prototype.setTheme = function(a) {
        var b = this.theme_;
        this.theme_ = a;
        if (a = this.workspace_.getInjectionDiv())
            b && (0,
            l.removeClass)(a, b.getClassName()),
            (0,
            l.addClass)(a, this.theme_.getClassName());
        for (b = 0; a = this.subscribedWorkspaces_[b]; b++)
            a.refreshTheme();
        b = 0;
        a = Object.keys(this.componentDB_);
        for (var c; c = a[b]; b++)
            for (var d = 0, f; f = this.componentDB_[c][d]; d++) {
                var g = f.element;
                f = f.propertyName;
                var k = this.theme_ && this.theme_.getComponentStyle(c);
                g.style[f] = k || ""
            }
        b = w.makeIterator(this.subscribedWorkspaces_);
        for (a = b.next(); !a.done; a = b.next())
            a.value.hideChaff()
    }
    ;
    lc.prototype.subscribeWorkspace = function(a) {
        this.subscribedWorkspaces_.push(a)
    }
    ;
    lc.prototype.unsubscribeWorkspace = function(a) {
        if (!(0,
        sb)(this.subscribedWorkspaces_, a))
            throw Error("Cannot unsubscribe a workspace that hasn't been subscribed.");
    }
    ;
    lc.prototype.subscribe = function(a, b, c) {
        this.componentDB_[b] || (this.componentDB_[b] = []);
        this.componentDB_[b].push({
            element: a,
            propertyName: c
        });
        b = this.theme_ && this.theme_.getComponentStyle(b);
        a.style[c] = b || ""
    }
    ;
    lc.prototype.unsubscribe = function(a) {
        if (a)
            for (var b = Object.keys(this.componentDB_), c = 0, d; d = b[c]; c++) {
                for (var f = this.componentDB_[d], g = f.length - 1; 0 <= g; g--)
                    f[g].element === a && f.splice(g, 1);
                this.componentDB_[d].length || delete this.componentDB_[d]
            }
    }
    ;
    lc.prototype.dispose = function() {
        this.componentDB_ = this.subscribedWorkspaces_ = this.theme_ = this.owner_ = null
    }
    ;
    var ra = {
        TouchGesture: function(a, b) {
            ra.TouchGesture.superClass_.constructor.call(this, a, b);
            this.isMultiTouch_ = !1;
            this.cachedPoints_ = Object.create(null);
            this.startDistance_ = this.previousScale_ = 0;
            this.isPinchZoomEnabled_ = this.onStartWrapper_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ra.TouchGesture, U);
    ra.TouchGesture.ZOOM_IN_MULTIPLIER = 5;
    ra.TouchGesture.ZOOM_OUT_MULTIPLIER = 6;
    ra.TouchGesture.prototype.doStart = function(a) {
        this.isPinchZoomEnabled_ = this.startWorkspace_.options.zoomOptions && this.startWorkspace_.options.zoomOptions.pinch;
        ra.TouchGesture.superClass_.doStart.call(this, a);
        !this.isEnding_ && (0,
        N.isTouchEvent)(a) && this.handleTouchStart(a)
    }
    ;
    ra.TouchGesture.prototype.bindMouseEvents = function(a) {
        this.onStartWrapper_ = (0,
        u.conditionalBind)(document, "mousedown", null, this.handleStart.bind(this), !0);
        this.onMoveWrapper_ = (0,
        u.conditionalBind)(document, "mousemove", null, this.handleMove.bind(this), !0);
        this.onUpWrapper_ = (0,
        u.conditionalBind)(document, "mouseup", null, this.handleUp.bind(this), !0);
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    ra.TouchGesture.prototype.handleStart = function(a) {
        !this.isDragging() && (0,
        N.isTouchEvent)(a) && (this.handleTouchStart(a),
        this.isMultiTouch() && (0,
        N.longStop)())
    }
    ;
    ra.TouchGesture.prototype.handleMove = function(a) {
        this.isDragging() ? (0,
        N.shouldHandleEvent)(a) && ra.TouchGesture.superClass_.handleMove.call(this, a) : this.isMultiTouch() ? ((0,
        N.isTouchEvent)(a) && this.handleTouchMove(a),
        (0,
        N.longStop)()) : ra.TouchGesture.superClass_.handleMove.call(this, a)
    }
    ;
    ra.TouchGesture.prototype.handleUp = function(a) {
        (0,
        N.isTouchEvent)(a) && !this.isDragging() && this.handleTouchEnd(a);
        !this.isMultiTouch() || this.isDragging() ? (0,
        N.shouldHandleEvent)(a) && ra.TouchGesture.superClass_.handleUp.call(this, a) : (a.preventDefault(),
        a.stopPropagation(),
        this.dispose())
    }
    ;
    ra.TouchGesture.prototype.isMultiTouch = function() {
        return this.isMultiTouch_
    }
    ;
    ra.TouchGesture.prototype.dispose = function() {
        ra.TouchGesture.superClass_.dispose.call(this);
        this.onStartWrapper_ && (0,
        u.unbind)(this.onStartWrapper_)
    }
    ;
    ra.TouchGesture.prototype.handleTouchStart = function(a) {
        var b = (0,
        N.getTouchIdentifierFromEvent)(a);
        this.cachedPoints_[b] = this.getTouchPoint(a);
        b = Object.keys(this.cachedPoints_);
        2 === b.length && (this.startDistance_ = E.distance(this.cachedPoints_[b[0]], this.cachedPoints_[b[1]]),
        this.isMultiTouch_ = !0,
        a.preventDefault())
    }
    ;
    ra.TouchGesture.prototype.handleTouchMove = function(a) {
        var b = (0,
        N.getTouchIdentifierFromEvent)(a);
        this.cachedPoints_[b] = this.getTouchPoint(a);
        b = Object.keys(this.cachedPoints_);
        this.isPinchZoomEnabled_ && 2 === b.length ? this.handlePinch_(a) : ra.TouchGesture.superClass_.handleMove.call(this, a)
    }
    ;
    ra.TouchGesture.prototype.handlePinch_ = function(a) {
        var b = Object.keys(this.cachedPoints_);
        b = E.distance(this.cachedPoints_[b[0]], this.cachedPoints_[b[1]]) / this.startDistance_;
        if (0 < this.previousScale_ && Infinity > this.previousScale_) {
            var c = b - this.previousScale_;
            c = 0 < c ? c * ra.TouchGesture.ZOOM_IN_MULTIPLIER : c * ra.TouchGesture.ZOOM_OUT_MULTIPLIER;
            var d = this.startWorkspace_
              , f = (0,
            u.mouseToSvg)(a, d.getParentSvg(), d.getInverseScreenCTM());
            d.zoom(f.x, f.y, c)
        }
        this.previousScale_ = b;
        a.preventDefault()
    }
    ;
    ra.TouchGesture.prototype.handleTouchEnd = function(a) {
        a = (0,
        N.getTouchIdentifierFromEvent)(a);
        this.cachedPoints_[a] && delete this.cachedPoints_[a];
        2 > Object.keys(this.cachedPoints_).length && (this.cachedPoints_ = Object.create(null),
        this.previousScale_ = 0)
    }
    ;
    ra.TouchGesture.prototype.getTouchPoint = function(a) {
        return this.startWorkspace_ ? new E(a.changedTouches ? a.changedTouches[0].pageX : a.pageX,a.changedTouches ? a.changedTouches[0].pageY : a.pageY) : null
    }
    ;
    var Cc = function(a) {
        this.parentWorkspace_ = a;
        this.SOUNDS_ = Object.create(null)
    };
    Cc.prototype.lastSound_ = null;
    Cc.prototype.dispose = function() {
        this.SOUNDS_ = this.parentWorkspace_ = null
    }
    ;
    Cc.prototype.load = function(a, b) {
        if (a.length) {
            try {
                var c = new e.module$exports$Blockly$utils$global.globalThis.Audio
            } catch (n) {
                return
            }
            for (var d, f = 0; f < a.length; f++) {
                var g = a[f]
                  , k = g.match(/\.(\w+)$/);
                if (k && c.canPlayType("audio/" + k[1])) {
                    d = new e.module$exports$Blockly$utils$global.globalThis.Audio(g);
                    break
                }
            }
            d && d.play && (this.SOUNDS_[b] = d)
        }
    }
    ;
    Cc.prototype.preload = function() {
        for (var a in this.SOUNDS_) {
            var b = this.SOUNDS_[a];
            b.volume = .01;
            var c = b.play();
            void 0 !== c ? c.then(b.pause).catch(function() {}) : b.pause();
            if (O.IPAD || O.IPHONE)
                break
        }
    }
    ;
    Cc.prototype.play = function(a, b) {
        var c = this.SOUNDS_[a];
        c ? (a = new Date,
        null !== this.lastSound_ && a - this.lastSound_ < e.module$exports$Blockly$internalConstants.SOUND_LIMIT || (this.lastSound_ = a,
        c = O.IPAD || O.ANDROID ? c : c.cloneNode(),
        c.volume = void 0 === b ? 1 : b,
        c.play())) : this.parentWorkspace_ && this.parentWorkspace_.getAudioManager().play(a, b)
    }
    ;
    var mc = {
        ThemeChange: function(a, b) {
            mc.ThemeChange.superClass_.constructor.call(this, b);
            this.themeName = a
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(mc.ThemeChange, ob.UiBase);
    mc.ThemeChange.prototype.type = h.THEME_CHANGE;
    mc.ThemeChange.prototype.toJson = function() {
        var a = mc.ThemeChange.superClass_.toJson.call(this);
        a.themeName = this.themeName;
        return a
    }
    ;
    mc.ThemeChange.prototype.fromJson = function(a) {
        mc.ThemeChange.superClass_.fromJson.call(this, a);
        this.themeName = a.themeName
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.THEME_CHANGE, mc.ThemeChange);
    var nc = {
        ViewportChange: function(a, b, c, d, f) {
            nc.ViewportChange.superClass_.constructor.call(this, d);
            this.viewTop = a;
            this.viewLeft = b;
            this.scale = c;
            this.oldScale = f
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(nc.ViewportChange, ob.UiBase);
    nc.ViewportChange.prototype.type = h.VIEWPORT_CHANGE;
    nc.ViewportChange.prototype.toJson = function() {
        var a = nc.ViewportChange.superClass_.toJson.call(this);
        a.viewTop = this.viewTop;
        a.viewLeft = this.viewLeft;
        a.scale = this.scale;
        a.oldScale = this.oldScale;
        return a
    }
    ;
    nc.ViewportChange.prototype.fromJson = function(a) {
        nc.ViewportChange.superClass_.fromJson.call(this, a);
        this.viewTop = a.viewTop;
        this.viewLeft = a.viewLeft;
        this.scale = a.scale;
        this.oldScale = a.oldScale
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.VIEWPORT_CHANGE, nc.ViewportChange);
    var bb = function(a) {
        this.workspace_ = a
    };
    bb.prototype.getDimensionsPx_ = function(a) {
        var b = 0
          , c = 0;
        a && (b = a.getWidth(),
        c = a.getHeight());
        return new Ja(b,c)
    }
    ;
    bb.prototype.getFlyoutMetrics = function(a) {
        a = this.getDimensionsPx_(this.workspace_.getFlyout(a));
        return {
            width: a.width,
            height: a.height,
            position: this.workspace_.toolboxPosition
        }
    }
    ;
    bb.prototype.getToolboxMetrics = function() {
        var a = this.getDimensionsPx_(this.workspace_.getToolbox());
        return {
            width: a.width,
            height: a.height,
            position: this.workspace_.toolboxPosition
        }
    }
    ;
    bb.prototype.getSvgMetrics = function() {
        return this.workspace_.getCachedParentSvgSize()
    }
    ;
    bb.prototype.getAbsoluteMetrics = function() {
        var a = 0
          , b = this.getToolboxMetrics()
          , c = this.getFlyoutMetrics(!0)
          , d = !!this.workspace_.getToolbox()
          , f = !!this.workspace_.getFlyout(!0)
          , g = d ? b.position : c.position
          , k = g === Q.Position.LEFT;
        g = g === Q.Position.TOP;
        d && k ? a = b.width : f && k && (a = c.width);
        k = 0;
        d && g ? k = b.height : f && g && (k = c.height);
        return {
            top: k,
            left: a
        }
    }
    ;
    bb.prototype.getViewMetrics = function(a) {
        a = a ? this.workspace_.scale : 1;
        var b = this.getSvgMetrics()
          , c = this.getToolboxMetrics()
          , d = this.getFlyoutMetrics(!0)
          , f = this.workspace_.getToolbox() ? c.position : d.position;
        if (this.workspace_.getToolbox())
            if (f === Q.Position.TOP || f === Q.Position.BOTTOM)
                b.height -= c.height;
            else {
                if (f === Q.Position.LEFT || f === Q.Position.RIGHT)
                    b.width -= c.width
            }
        else if (this.workspace_.getFlyout(!0))
            if (f === Q.Position.TOP || f === Q.Position.BOTTOM)
                b.height -= d.height;
            else if (f === Q.Position.LEFT || f === Q.Position.RIGHT)
                b.width -= d.width;
        return {
            height: b.height / a,
            width: b.width / a,
            top: -this.workspace_.scrollY / a,
            left: -this.workspace_.scrollX / a
        }
    }
    ;
    bb.prototype.getContentMetrics = function(a) {
        a = a ? 1 : this.workspace_.scale;
        var b = this.workspace_.getBlocksBoundingBox();
        return {
            height: (b.bottom - b.top) * a,
            width: (b.right - b.left) * a,
            top: b.top * a,
            left: b.left * a
        }
    }
    ;
    bb.prototype.hasFixedEdges = function() {
        return !this.workspace_.isMovableHorizontally() || !this.workspace_.isMovableVertically()
    }
    ;
    bb.prototype.getComputedFixedEdges_ = function(a) {
        if (!this.hasFixedEdges())
            return {};
        var b = this.workspace_.isMovableHorizontally()
          , c = this.workspace_.isMovableVertically();
        a = a || this.getViewMetrics(!1);
        var d = {};
        c || (d.top = a.top,
        d.bottom = a.top + a.height);
        b || (d.left = a.left,
        d.right = a.left + a.width);
        return d
    }
    ;
    bb.prototype.getPaddedContent_ = function(a, b) {
        var c = b.top + b.height
          , d = b.left + b.width
          , f = a.width;
        a = a.height;
        var g = f / 2
          , k = a / 2;
        return {
            top: Math.min(b.top - k, c - a),
            bottom: Math.max(c + k, b.top + a),
            left: Math.min(b.left - g, d - f),
            right: Math.max(d + g, b.left + f)
        }
    }
    ;
    bb.prototype.getScrollMetrics = function(a, b, c) {
        a = a ? this.workspace_.scale : 1;
        b = b || this.getViewMetrics(!1);
        var d = c || this.getContentMetrics();
        c = this.getComputedFixedEdges_(b);
        b = this.getPaddedContent_(b, d);
        d = void 0 !== c.top ? c.top : b.top;
        var f = void 0 !== c.left ? c.left : b.left;
        return {
            top: d / a,
            left: f / a,
            width: ((void 0 !== c.right ? c.right : b.right) - f) / a,
            height: ((void 0 !== c.bottom ? c.bottom : b.bottom) - d) / a
        }
    }
    ;
    bb.prototype.getUiMetrics = function() {
        return {
            viewMetrics: this.getViewMetrics(),
            absoluteMetrics: this.getAbsoluteMetrics(),
            toolboxMetrics: this.getToolboxMetrics()
        }
    }
    ;
    bb.prototype.getMetrics = function() {
        var a = this.getToolboxMetrics()
          , b = this.getFlyoutMetrics(!0)
          , c = this.getSvgMetrics()
          , d = this.getAbsoluteMetrics()
          , f = this.getViewMetrics()
          , g = this.getContentMetrics()
          , k = this.getScrollMetrics(!1, f, g);
        return {
            contentHeight: g.height,
            contentWidth: g.width,
            contentTop: g.top,
            contentLeft: g.left,
            scrollHeight: k.height,
            scrollWidth: k.width,
            scrollTop: k.top,
            scrollLeft: k.left,
            viewHeight: f.height,
            viewWidth: f.width,
            viewTop: f.top,
            viewLeft: f.left,
            absoluteTop: d.top,
            absoluteLeft: d.left,
            svgHeight: c.height,
            svgWidth: c.width,
            toolboxWidth: a.width,
            toolboxHeight: a.height,
            toolboxPosition: a.position,
            flyoutWidth: b.width,
            flyoutHeight: b.height
        }
    }
    ;
    (0,
    r.register)(r.Type.METRICS_MANAGER, r.DEFAULT, bb);
    var t = {
        WorkspaceSvg: function(a, b, c) {
            t.WorkspaceSvg.superClass_.constructor.call(this, a);
            this.metricsManager_ = new ((0,
            r.getClassFromOptions)(r.Type.METRICS_MANAGER, a, !0))(this);
            this.getMetrics = a.getMetrics || this.metricsManager_.getMetrics.bind(this.metricsManager_);
            this.setMetrics = a.setMetrics || t.WorkspaceSvg.setTopLevelWorkspaceMetrics_;
            this.componentManager_ = new ia;
            this.connectionDBList = pb.init(this.connectionChecker);
            b && (this.blockDragSurface_ = b);
            c && (this.workspaceDragSurface_ = c);
            this.useWorkspaceDragSurface_ = !!this.workspaceDragSurface_ && (0,
            ca.is3dSupported)();
            this.highlightedBlocks_ = [];
            this.audioManager_ = new Cc(a.parentWorkspace);
            this.grid_ = this.options.gridPattern ? new yb(this.options.gridPattern,a.gridOptions) : null;
            this.markerManager_ = new nb(this);
            this.toolboxCategoryCallbacks_ = Object.create(null);
            this.flyoutButtonCallbacks_ = Object.create(null);
            (a = e.module$exports$Blockly$Variables) && a.flyoutCategory && this.registerToolboxCategoryCallback(a.CATEGORY_NAME, a.flyoutCategory);
            (a = Dc) && a.flyoutCategory && this.registerToolboxCategoryCallback(a.CATEGORY_NAME, a.flyoutCategory);
            (a = e.module$exports$Blockly$Procedures) && a.flyoutCategory && (this.registerToolboxCategoryCallback(a.CATEGORY_NAME, a.flyoutCategory),
            this.addChangeListener(a.mutatorOpenListener));
            this.themeManager_ = this.options.parentWorkspace ? this.options.parentWorkspace.getThemeManager() : new lc(this,this.options.theme || nd);
            this.themeManager_.subscribeWorkspace(this);
            this.renderer_ = (0,
            fa.init)(this.options.renderer || "geras", this.getTheme(), this.options.rendererOverrides);
            this.cachedParentSvg_ = null;
            this.keyboardAccessibilityMode = !1;
            this.topBoundedElements_ = [];
            this.dragTargetAreas_ = [];
            this.cachedParentSvgSize_ = new Ja(0,0)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(t.WorkspaceSvg, I.Workspace);
    t.WorkspaceSvg.prototype.resizeHandlerWrapper_ = null;
    t.WorkspaceSvg.prototype.rendered = !0;
    t.WorkspaceSvg.prototype.isVisible_ = !0;
    t.WorkspaceSvg.prototype.isFlyout = !1;
    t.WorkspaceSvg.prototype.isMutator = !1;
    t.WorkspaceSvg.prototype.resizesEnabled_ = !0;
    t.WorkspaceSvg.prototype.scrollX = 0;
    t.WorkspaceSvg.prototype.scrollY = 0;
    t.WorkspaceSvg.prototype.startScrollX = 0;
    t.WorkspaceSvg.prototype.startScrollY = 0;
    t.WorkspaceSvg.prototype.dragDeltaXY_ = null;
    t.WorkspaceSvg.prototype.scale = 1;
    t.WorkspaceSvg.prototype.oldScale_ = 1;
    t.WorkspaceSvg.prototype.oldTop_ = 0;
    t.WorkspaceSvg.prototype.oldLeft_ = 0;
    t.WorkspaceSvg.prototype.trashcan = null;
    t.WorkspaceSvg.prototype.scrollbar = null;
    t.WorkspaceSvg.prototype.flyout_ = null;
    t.WorkspaceSvg.prototype.toolbox_ = null;
    t.WorkspaceSvg.prototype.currentGesture_ = null;
    t.WorkspaceSvg.prototype.blockDragSurface_ = null;
    t.WorkspaceSvg.prototype.workspaceDragSurface_ = null;
    t.WorkspaceSvg.prototype.useWorkspaceDragSurface_ = !1;
    t.WorkspaceSvg.prototype.isDragSurfaceActive_ = !1;
    t.WorkspaceSvg.prototype.injectionDiv_ = null;
    t.WorkspaceSvg.prototype.lastRecordedPageScroll_ = null;
    t.WorkspaceSvg.prototype.targetWorkspace = null;
    t.WorkspaceSvg.prototype.inverseScreenCTM_ = null;
    t.WorkspaceSvg.prototype.inverseScreenCTMDirty_ = !0;
    t.WorkspaceSvg.prototype.getMarkerManager = function() {
        return this.markerManager_
    }
    ;
    t.WorkspaceSvg.prototype.getMetricsManager = function() {
        return this.metricsManager_
    }
    ;
    t.WorkspaceSvg.prototype.setMetricsManager = function(a) {
        this.metricsManager_ = a;
        this.getMetrics = this.metricsManager_.getMetrics.bind(this.metricsManager_)
    }
    ;
    t.WorkspaceSvg.prototype.getComponentManager = function() {
        return this.componentManager_
    }
    ;
    t.WorkspaceSvg.prototype.setCursorSvg = function(a) {
        this.markerManager_.setCursorSvg(a)
    }
    ;
    t.WorkspaceSvg.prototype.setMarkerSvg = function(a) {
        this.markerManager_.setMarkerSvg(a)
    }
    ;
    t.WorkspaceSvg.prototype.getMarker = function(a) {
        return this.markerManager_ ? this.markerManager_.getMarker(a) : null
    }
    ;
    t.WorkspaceSvg.prototype.getCursor = function() {
        return this.markerManager_ ? this.markerManager_.getCursor() : null
    }
    ;
    t.WorkspaceSvg.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    t.WorkspaceSvg.prototype.getThemeManager = function() {
        return this.themeManager_
    }
    ;
    t.WorkspaceSvg.prototype.getTheme = function() {
        return this.themeManager_.getTheme()
    }
    ;
    t.WorkspaceSvg.prototype.setTheme = function(a) {
        a || (a = nd);
        this.themeManager_.setTheme(a)
    }
    ;
    t.WorkspaceSvg.prototype.refreshTheme = function() {
        this.svgGroup_ && this.renderer_.refreshDom(this.svgGroup_, this.getTheme());
        this.updateBlockStyles_(this.getAllBlocks(!1).filter(function(b) {
            return !!b.getStyleName()
        }));
        this.refreshToolboxSelection();
        this.toolbox_ && this.toolbox_.refreshTheme();
        this.isVisible() && this.setVisible(!0);
        var a = new ((0,
        h.get)(h.THEME_CHANGE))(this.getTheme().name,this.id);
        (0,
        h.fire)(a)
    }
    ;
    t.WorkspaceSvg.prototype.updateBlockStyles_ = function(a) {
        for (var b = 0, c; c = a[b]; b++) {
            var d = c.getStyleName();
            d && (c.setStyle(d),
            c.mutator && c.mutator.updateBlockStyle())
        }
    }
    ;
    t.WorkspaceSvg.prototype.getInverseScreenCTM = function() {
        if (this.inverseScreenCTMDirty_) {
            var a = this.getParentSvg().getScreenCTM();
            a && (this.inverseScreenCTM_ = a.inverse(),
            this.inverseScreenCTMDirty_ = !1)
        }
        return this.inverseScreenCTM_
    }
    ;
    t.WorkspaceSvg.prototype.updateInverseScreenCTM = function() {
        this.inverseScreenCTMDirty_ = !0
    }
    ;
    t.WorkspaceSvg.prototype.isVisible = function() {
        return this.isVisible_
    }
    ;
    t.WorkspaceSvg.prototype.getSvgXY = function(a) {
        var b = 0
          , c = 0
          , d = 1;
        if ((0,
        l.containsNode)(this.getCanvas(), a) || (0,
        l.containsNode)(this.getBubbleCanvas(), a))
            d = this.scale;
        do {
            var f = (0,
            ca.getRelativeXY)(a);
            if (a === this.getCanvas() || a === this.getBubbleCanvas())
                d = 1;
            b += f.x * d;
            c += f.y * d;
            a = a.parentNode
        } while (a && a !== this.getParentSvg());
        return new E(b,c)
    }
    ;
    t.WorkspaceSvg.prototype.getCachedParentSvgSize = function() {
        var a = this.cachedParentSvgSize_;
        return new Ja(a.width,a.height)
    }
    ;
    t.WorkspaceSvg.prototype.getOriginOffsetInPixels = function() {
        return (0,
        ca.getInjectionDivXY)(this.getCanvas())
    }
    ;
    t.WorkspaceSvg.prototype.getInjectionDiv = function() {
        if (!this.injectionDiv_)
            for (var a = this.svgGroup_; a; ) {
                if (-1 !== (" " + (a.getAttribute("class") || "") + " ").indexOf(" injectionDiv ")) {
                    this.injectionDiv_ = a;
                    break
                }
                a = a.parentNode
            }
        return this.injectionDiv_
    }
    ;
    t.WorkspaceSvg.prototype.getBlockCanvas = function() {
        return this.svgBlockCanvas_
    }
    ;
    t.WorkspaceSvg.prototype.setResizeHandlerWrapper = function(a) {
        this.resizeHandlerWrapper_ = a
    }
    ;
    t.WorkspaceSvg.prototype.createDom = function(a) {
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyWorkspace"
        }, null);
        a && (this.svgBackground_ = (0,
        l.createSvgElement)(q.RECT, {
            height: "100%",
            width: "100%",
            "class": a
        }, this.svgGroup_),
        "blocklyMainBackground" === a && this.grid_ ? this.svgBackground_.style.fill = "url(#" + this.grid_.getPatternId() + ")" : this.themeManager_.subscribe(this.svgBackground_, "workspaceBackgroundColour", "fill"));
        this.svgBlockCanvas_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyBlockCanvas"
        }, this.svgGroup_);
        this.svgBubbleCanvas_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyBubbleCanvas"
        }, this.svgGroup_);
        this.isFlyout || ((0,
        u.conditionalBind)(this.svgGroup_, "mousedown", this, this.onMouseDown_, !1, !0),
        document.body.addEventListener("wheel", function() {}),
        (0,
        u.conditionalBind)(this.svgGroup_, "wheel", this, this.onMouseWheel_));
        this.options.hasCategories && (this.toolbox_ = new ((0,
        r.getClassFromOptions)(r.Type.TOOLBOX, this.options, !0))(this));
        this.grid_ && this.grid_.update(this.scale);
        this.recordDragTargets();
        (a = (0,
        r.getClassFromOptions)(r.Type.CURSOR, this.options)) && this.markerManager_.setCursor(new a);
        this.renderer_.createDom(this.svgGroup_, this.getTheme());
        return this.svgGroup_
    }
    ;
    t.WorkspaceSvg.prototype.dispose = function() {
        this.rendered = !1;
        this.currentGesture_ && this.currentGesture_.cancel();
        this.svgGroup_ && ((0,
        l.removeNode)(this.svgGroup_),
        this.svgGroup_ = null);
        this.svgBubbleCanvas_ = this.svgBlockCanvas_ = null;
        this.toolbox_ && (this.toolbox_.dispose(),
        this.toolbox_ = null);
        this.flyout_ && (this.flyout_.dispose(),
        this.flyout_ = null);
        this.trashcan && (this.trashcan.dispose(),
        this.trashcan = null);
        this.scrollbar && (this.scrollbar.dispose(),
        this.scrollbar = null);
        this.zoomControls_ && (this.zoomControls_.dispose(),
        this.zoomControls_ = null);
        this.audioManager_ && (this.audioManager_.dispose(),
        this.audioManager_ = null);
        this.grid_ && (this.grid_.dispose(),
        this.grid_ = null);
        this.renderer_.dispose();
        this.markerManager_ && (this.markerManager_.dispose(),
        this.markerManager_ = null);
        t.WorkspaceSvg.superClass_.dispose.call(this);
        this.themeManager_ && (this.themeManager_.unsubscribeWorkspace(this),
        this.themeManager_.unsubscribe(this.svgBackground_),
        this.options.parentWorkspace || (this.themeManager_.dispose(),
        this.themeManager_ = null));
        this.flyoutButtonCallbacks_ = this.toolboxCategoryCallbacks_ = this.connectionDBList = null;
        if (!this.options.parentWorkspace) {
            var a = this.getParentSvg();
            a && a.parentNode && (0,
            l.removeNode)(a.parentNode)
        }
        this.resizeHandlerWrapper_ && ((0,
        u.unbind)(this.resizeHandlerWrapper_),
        this.resizeHandlerWrapper_ = null)
    }
    ;
    t.WorkspaceSvg.prototype.newBlock = function(a, b) {
        return new z.BlockSvg(this,a,b)
    }
    ;
    t.WorkspaceSvg.prototype.addTrashcan = function() {
        var a = aa.Trashcan;
        if (!a)
            throw Error("Missing require for Blockly.Trashcan");
        this.trashcan = new a(this);
        a = this.trashcan.createDom();
        this.svgGroup_.insertBefore(a, this.svgBlockCanvas_)
    }
    ;
    t.WorkspaceSvg.prototype.addZoomControls = function() {
        var a = Ga.ZoomControls;
        if (!a)
            throw Error("Missing require for Blockly.ZoomControls");
        this.zoomControls_ = new a(this);
        a = this.zoomControls_.createDom();
        this.svgGroup_.appendChild(a)
    }
    ;
    t.WorkspaceSvg.prototype.addFlyout = function(a) {
        var b = new gb.Options({
            parentWorkspace: this,
            rtl: this.RTL,
            oneBasedIndex: this.options.oneBasedIndex,
            horizontalLayout: this.horizontalLayout,
            renderer: this.options.renderer,
            rendererOverrides: this.options.rendererOverrides,
            move: {
                scrollbars: !0
            }
        });
        b.toolboxPosition = this.options.toolboxPosition;
        this.flyout_ = this.horizontalLayout ? new ((0,
        r.getClassFromOptions)(r.Type.FLYOUTS_HORIZONTAL_TOOLBOX, this.options, !0))(b) : new ((0,
        r.getClassFromOptions)(r.Type.FLYOUTS_VERTICAL_TOOLBOX, this.options, !0))(b);
        this.flyout_.autoClose = !1;
        this.flyout_.getWorkspace().setVisible(!0);
        return this.flyout_.createDom(a)
    }
    ;
    t.WorkspaceSvg.prototype.getFlyout = function(a) {
        return this.flyout_ || a ? this.flyout_ : this.toolbox_ ? this.toolbox_.getFlyout() : null
    }
    ;
    t.WorkspaceSvg.prototype.getToolbox = function() {
        return this.toolbox_
    }
    ;
    t.WorkspaceSvg.prototype.updateScreenCalculations_ = function() {
        this.updateInverseScreenCTM();
        this.recordDragTargets()
    }
    ;
    t.WorkspaceSvg.prototype.resizeContents = function() {
        this.resizesEnabled_ && this.rendered && (this.scrollbar && this.scrollbar.resize(),
        this.updateInverseScreenCTM())
    }
    ;
    t.WorkspaceSvg.prototype.resize = function() {
        this.toolbox_ && this.toolbox_.position();
        this.flyout_ && this.flyout_.position();
        for (var a = this.componentManager_.getComponents(ia.Capability.POSITIONABLE, !0), b = this.getMetricsManager().getUiMetrics(), c = [], d = 0, f; f = a[d]; d++)
            f.position(b, c),
            (f = f.getBoundingRectangle()) && c.push(f);
        this.scrollbar && this.scrollbar.resize();
        this.updateScreenCalculations_()
    }
    ;
    t.WorkspaceSvg.prototype.updateScreenCalculationsIfScrolled = function() {
        var a = (0,
        ca.getDocumentScroll)();
        E.equals(this.lastRecordedPageScroll_, a) || (this.lastRecordedPageScroll_ = a,
        this.updateScreenCalculations_())
    }
    ;
    t.WorkspaceSvg.prototype.getCanvas = function() {
        return this.svgBlockCanvas_
    }
    ;
    t.WorkspaceSvg.prototype.setCachedParentSvgSize = function(a, b) {
        var c = this.getParentSvg();
        a && (this.cachedParentSvgSize_.width = a,
        c.cachedWidth_ = a);
        b && (this.cachedParentSvgSize_.height = b,
        c.cachedHeight_ = b)
    }
    ;
    t.WorkspaceSvg.prototype.getBubbleCanvas = function() {
        return this.svgBubbleCanvas_
    }
    ;
    t.WorkspaceSvg.prototype.getParentSvg = function() {
        if (!this.cachedParentSvg_)
            for (var a = this.svgGroup_; a; ) {
                if ("svg" === a.tagName) {
                    this.cachedParentSvg_ = a;
                    break
                }
                a = a.parentNode
            }
        return this.cachedParentSvg_
    }
    ;
    t.WorkspaceSvg.prototype.maybeFireViewportChangeEvent = function() {
        if ((0,
        h.isEnabled)()) {
            var a = this.scale
              , b = -this.scrollY
              , c = -this.scrollX;
            if (!(a === this.oldScale_ && 1 > Math.abs(b - this.oldTop_) && 1 > Math.abs(c - this.oldLeft_))) {
                var d = new ((0,
                h.get)(h.VIEWPORT_CHANGE))(b,c,a,this.id,this.oldScale_);
                this.oldScale_ = a;
                this.oldTop_ = b;
                this.oldLeft_ = c;
                (0,
                h.fire)(d)
            }
        }
    }
    ;
    t.WorkspaceSvg.prototype.translate = function(a, b) {
        if (this.useWorkspaceDragSurface_ && this.isDragSurfaceActive_)
            this.workspaceDragSurface_.translateSurface(a, b);
        else {
            var c = "translate(" + a + "," + b + ") scale(" + this.scale + ")";
            this.svgBlockCanvas_.setAttribute("transform", c);
            this.svgBubbleCanvas_.setAttribute("transform", c)
        }
        this.blockDragSurface_ && this.blockDragSurface_.translateAndScaleGroup(a, b, this.scale);
        this.grid_ && this.grid_.moveTo(a, b);
        this.maybeFireViewportChangeEvent()
    }
    ;
    t.WorkspaceSvg.prototype.resetDragSurface = function() {
        if (this.useWorkspaceDragSurface_) {
            this.isDragSurfaceActive_ = !1;
            var a = this.workspaceDragSurface_.getSurfaceTranslation();
            this.workspaceDragSurface_.clearAndHide(this.svgGroup_);
            a = "translate(" + a.x + "," + a.y + ") scale(" + this.scale + ")";
            this.svgBlockCanvas_.setAttribute("transform", a);
            this.svgBubbleCanvas_.setAttribute("transform", a)
        }
    }
    ;
    t.WorkspaceSvg.prototype.setupDragSurface = function() {
        if (this.useWorkspaceDragSurface_ && !this.isDragSurfaceActive_) {
            this.isDragSurfaceActive_ = !0;
            var a = this.svgBlockCanvas_.previousSibling
              , b = parseInt(this.getParentSvg().getAttribute("width"), 10)
              , c = parseInt(this.getParentSvg().getAttribute("height"), 10)
              , d = (0,
            ca.getRelativeXY)(this.getCanvas());
            this.workspaceDragSurface_.setContentsAndShow(this.getCanvas(), this.getBubbleCanvas(), a, b, c, this.scale);
            this.workspaceDragSurface_.translateSurface(d.x, d.y)
        }
    }
    ;
    t.WorkspaceSvg.prototype.getBlockDragSurface = function() {
        return this.blockDragSurface_
    }
    ;
    t.WorkspaceSvg.prototype.getWidth = function() {
        var a = this.getMetrics();
        return a ? a.viewWidth / this.scale : 0
    }
    ;
    t.WorkspaceSvg.prototype.setVisible = function(a) {
        this.isVisible_ = a;
        if (this.svgGroup_)
            if (this.scrollbar && this.scrollbar.setContainerVisible(a),
            this.getFlyout() && this.getFlyout().setContainerVisible(a),
            this.getParentSvg().style.display = a ? "block" : "none",
            this.toolbox_ && this.toolbox_.setVisible(a),
            a) {
                a = this.getAllBlocks(!1);
                for (var b = a.length - 1; 0 <= b; b--)
                    a[b].markDirty();
                this.render();
                this.toolbox_ && this.toolbox_.position()
            } else
                this.hideChaff(!0)
    }
    ;
    t.WorkspaceSvg.prototype.render = function() {
        for (var a = this.getAllBlocks(!1), b = a.length - 1; 0 <= b; b--)
            a[b].render(!1);
        if (this.currentGesture_)
            for (a = this.currentGesture_.getInsertionMarkers(),
            b = 0; b < a.length; b++)
                a[b].render(!1);
        this.markerManager_.updateMarkers()
    }
    ;
    t.WorkspaceSvg.prototype.highlightBlock = function(a, b) {
        if (void 0 === b) {
            for (var c = 0, d; d = this.highlightedBlocks_[c]; c++)
                d.setHighlighted(!1);
            this.highlightedBlocks_.length = 0
        }
        if (a = a ? this.getBlockById(a) : null)
            (b = void 0 === b || b) ? -1 === this.highlightedBlocks_.indexOf(a) && this.highlightedBlocks_.push(a) : (0,
            sb)(this.highlightedBlocks_, a),
            a.setHighlighted(b)
    }
    ;
    t.WorkspaceSvg.prototype.paste = function(a) {
        this.rendered && (a.type || a.tagName) && (this.currentGesture_ && this.currentGesture_.cancel(),
        a.type ? this.pasteBlock_(null, a) : "comment" === a.tagName.toLowerCase() ? this.pasteWorkspaceComment_(a) : this.pasteBlock_(a, null))
    }
    ;
    t.WorkspaceSvg.prototype.pasteBlock_ = function(a, b) {
        (0,
        h.disable)();
        try {
            var c = 0
              , d = 0;
            if (a) {
                var f = (0,
                e.module$exports$Blockly$Xml.domToBlock)(a, this);
                c = parseInt(a.getAttribute("x"), 10);
                this.RTL && (c = -c);
                d = parseInt(a.getAttribute("y"), 10)
            } else
                b && (f = (0,
                Sa.append)(b, this),
                c = b.x || 10,
                this.RTL && (c = this.getWidth() - c),
                d = b.y || 10);
            if (!isNaN(c) && !isNaN(d)) {
                do {
                    var g = !1
                      , k = this.getAllBlocks(!1);
                    a = 0;
                    for (b = void 0; b = k[a]; a++) {
                        var n = b.getRelativeToSurfaceXY();
                        if (1 >= Math.abs(c - n.x) && 1 >= Math.abs(d - n.y)) {
                            g = !0;
                            break
                        }
                    }
                    if (!g) {
                        var x = f.getConnections_(!1);
                        a = 0;
                        for (b = void 0; b = x[a]; a++)
                            if (b.closest(e.module$exports$Blockly$internalConstants.SNAP_RADIUS, new E(c,d)).connection) {
                                g = !0;
                                break
                            }
                    }
                    g && (c = this.RTL ? c - e.module$exports$Blockly$internalConstants.SNAP_RADIUS : c + e.module$exports$Blockly$internalConstants.SNAP_RADIUS,
                    d += 2 * e.module$exports$Blockly$internalConstants.SNAP_RADIUS)
                } while (g);
                f.moveTo(new E(c,d))
            }
        } finally {
            (0,
            h.enable)()
        }
        (0,
        h.isEnabled)() && !f.isShadow() && (0,
        h.fire)(new ((0,
        h.get)(h.CREATE))(f));
        f.select()
    }
    ;
    t.WorkspaceSvg.prototype.pasteWorkspaceComment_ = function(a) {
        (0,
        h.disable)();
        try {
            var b = L.fromXml(a, this)
              , c = parseInt(a.getAttribute("x"), 10)
              , d = parseInt(a.getAttribute("y"), 10);
            isNaN(c) || isNaN(d) || (this.RTL && (c = -c),
            b.moveBy(c + 50, d + 50))
        } finally {
            (0,
            h.enable)()
        }
        (0,
        h.isEnabled)() && oa.fireCreateEvent(b);
        b.select()
    }
    ;
    t.WorkspaceSvg.prototype.refreshToolboxSelection = function() {
        var a = this.isFlyout ? this.targetWorkspace : this;
        a && !a.currentGesture_ && a.toolbox_ && a.toolbox_.getFlyout() && a.toolbox_.refreshSelection()
    }
    ;
    t.WorkspaceSvg.prototype.renameVariableById = function(a, b) {
        t.WorkspaceSvg.superClass_.renameVariableById.call(this, a, b);
        this.refreshToolboxSelection()
    }
    ;
    t.WorkspaceSvg.prototype.deleteVariableById = function(a) {
        t.WorkspaceSvg.superClass_.deleteVariableById.call(this, a);
        this.refreshToolboxSelection()
    }
    ;
    t.WorkspaceSvg.prototype.createVariable = function(a, b, c) {
        a = t.WorkspaceSvg.superClass_.createVariable.call(this, a, b, c);
        this.refreshToolboxSelection();
        return a
    }
    ;
    t.WorkspaceSvg.prototype.recordDeleteAreas = function() {
        W.deprecation.warn("WorkspaceSvg.prototype.recordDeleteAreas", "June 2021", "June 2022", "WorkspaceSvg.prototype.recordDragTargets");
        this.recordDragTargets()
    }
    ;
    t.WorkspaceSvg.prototype.recordDragTargets = function() {
        var a = this.componentManager_.getComponents(ia.Capability.DRAG_TARGET, !0);
        this.dragTargetAreas_ = [];
        for (var b = 0, c; c = a[b]; b++) {
            var d = c.getClientRect();
            d && this.dragTargetAreas_.push({
                component: c,
                clientRect: d
            })
        }
    }
    ;
    t.WorkspaceSvg.prototype.getDragTarget = function(a) {
        for (var b = 0, c; c = this.dragTargetAreas_[b]; b++)
            if (c.clientRect.contains(a.clientX, a.clientY))
                return c.component;
        return null
    }
    ;
    t.WorkspaceSvg.prototype.onMouseDown_ = function(a) {
        var b = this.getGesture(a);
        b && b.handleWsStart(a, this)
    }
    ;
    t.WorkspaceSvg.prototype.startDrag = function(a, b) {
        a = (0,
        u.mouseToSvg)(a, this.getParentSvg(), this.getInverseScreenCTM());
        a.x /= this.scale;
        a.y /= this.scale;
        this.dragDeltaXY_ = E.difference(b, a)
    }
    ;
    t.WorkspaceSvg.prototype.moveDrag = function(a) {
        a = (0,
        u.mouseToSvg)(a, this.getParentSvg(), this.getInverseScreenCTM());
        a.x /= this.scale;
        a.y /= this.scale;
        return E.sum(this.dragDeltaXY_, a)
    }
    ;
    t.WorkspaceSvg.prototype.isDragging = function() {
        return null !== this.currentGesture_ && this.currentGesture_.isDragging()
    }
    ;
    t.WorkspaceSvg.prototype.isDraggable = function() {
        return this.options.moveOptions && this.options.moveOptions.drag
    }
    ;
    t.WorkspaceSvg.prototype.isMovable = function() {
        return this.options.moveOptions && !!this.options.moveOptions.scrollbars || this.options.moveOptions && this.options.moveOptions.wheel || this.options.moveOptions && this.options.moveOptions.drag || this.options.zoomOptions && this.options.zoomOptions.wheel || this.options.zoomOptions && this.options.zoomOptions.pinch
    }
    ;
    t.WorkspaceSvg.prototype.isMovableHorizontally = function() {
        var a = !!this.scrollbar;
        return this.isMovable() && (!a || a && this.scrollbar.canScrollHorizontally())
    }
    ;
    t.WorkspaceSvg.prototype.isMovableVertically = function() {
        var a = !!this.scrollbar;
        return this.isMovable() && (!a || a && this.scrollbar.canScrollVertically())
    }
    ;
    t.WorkspaceSvg.prototype.onMouseWheel_ = function(a) {
        if (U.inProgress())
            a.preventDefault(),
            a.stopPropagation();
        else {
            var b = this.options.zoomOptions && this.options.zoomOptions.wheel
              , c = this.options.moveOptions && this.options.moveOptions.wheel;
            if (b || c) {
                var d = (0,
                u.getScrollDeltaPixels)(a);
                if (O.MAC)
                    var f = a.metaKey;
                b && (a.ctrlKey || f || !c) ? (d = -d.y / 50,
                b = (0,
                u.mouseToSvg)(a, this.getParentSvg(), this.getInverseScreenCTM()),
                this.zoom(b.x, b.y, d)) : (b = this.scrollX - d.x,
                c = this.scrollY - d.y,
                a.shiftKey && !d.x && (b = this.scrollX - d.y,
                c = this.scrollY),
                this.scroll(b, c));
                a.preventDefault()
            }
        }
    }
    ;
    t.WorkspaceSvg.prototype.getBlocksBoundingBox = function() {
        var a = this.getTopBoundedElements();
        if (!a.length)
            return new Aa(0,0,0,0);
        for (var b = a[0].getBoundingRectangle(), c = 1; c < a.length; c++) {
            var d = a[c];
            d.isInsertionMarker && d.isInsertionMarker() || (d = d.getBoundingRectangle(),
            d.top < b.top && (b.top = d.top),
            d.bottom > b.bottom && (b.bottom = d.bottom),
            d.left < b.left && (b.left = d.left),
            d.right > b.right && (b.right = d.right))
        }
        return b
    }
    ;
    t.WorkspaceSvg.prototype.cleanUp = function() {
        this.setResizesEnabled(!1);
        (0,
        h.setGroup)(!0);
        for (var a = this.getTopBlocks(!0), b = 0, c = 0, d; d = a[c]; c++)
            if (d.isMovable()) {
                var f = d.getRelativeToSurfaceXY();
                d.moveBy(-f.x, b - f.y);
                d.snapToGrid();
                b = d.getRelativeToSurfaceXY().y + d.getHeightWidth().height + this.renderer_.getConstants().MIN_BLOCK_HEIGHT
            }
        (0,
        h.setGroup)(!1);
        this.setResizesEnabled(!0)
    }
    ;
    t.WorkspaceSvg.prototype.showContextMenu = function(a) {
        if (!this.options.readOnly && !this.isFlyout) {
            var b = ba.ContextMenuRegistry.registry.getContextMenuOptions(ba.ContextMenuRegistry.ScopeType.WORKSPACE, {
                workspace: this
            });
            this.configureContextMenu && this.configureContextMenu(b, a);
            (0,
            e.module$exports$Blockly$ContextMenu.show)(a, b, this.RTL)
        }
    }
    ;
    t.WorkspaceSvg.prototype.updateToolbox = function(a) {
        if (a = (0,
        Q.convertToolboxDefToJson)(a)) {
            if (!this.options.languageTree)
                throw Error("Existing toolbox is null.  Can't create new toolbox.");
            if ((0,
            Q.hasCategories)(a)) {
                if (!this.toolbox_)
                    throw Error("Existing toolbox has no categories.  Can't change mode.");
                this.options.languageTree = a;
                this.toolbox_.render(a)
            } else {
                if (!this.flyout_)
                    throw Error("Existing toolbox has categories.  Can't change mode.");
                this.options.languageTree = a;
                this.flyout_.show(a)
            }
        } else if (this.options.languageTree)
            throw Error("Can't nullify an existing toolbox.");
    }
    ;
    t.WorkspaceSvg.prototype.markFocused = function() {
        this.options.parentWorkspace ? this.options.parentWorkspace.markFocused() : ((0,
        e.module$exports$Blockly$common.setMainWorkspace)(this),
        this.setBrowserFocus())
    }
    ;
    t.WorkspaceSvg.prototype.setBrowserFocus = function() {
        document.activeElement && document.activeElement.blur && document.activeElement.blur();
        try {
            this.getParentSvg().focus({
                preventScroll: !0
            })
        } catch (a) {
            try {
                this.getParentSvg().parentNode.setActive()
            } catch (b) {
                this.getParentSvg().parentNode.focus({
                    preventScroll: !0
                })
            }
        }
    }
    ;
    t.WorkspaceSvg.prototype.zoom = function(a, b, c) {
        c = Math.pow(this.options.zoomOptions.scaleSpeed, c);
        var d = this.scale * c;
        if (this.scale !== d) {
            d > this.options.zoomOptions.maxScale ? c = this.options.zoomOptions.maxScale / this.scale : d < this.options.zoomOptions.minScale && (c = this.options.zoomOptions.minScale / this.scale);
            var f = this.getCanvas().getCTM()
              , g = this.getParentSvg().createSVGPoint();
            g.x = a;
            g.y = b;
            g = g.matrixTransform(f.inverse());
            a = g.x;
            b = g.y;
            f = f.translate(a * (1 - c), b * (1 - c)).scale(c);
            this.scrollX = f.e;
            this.scrollY = f.f;
            this.setScale(d)
        }
    }
    ;
    t.WorkspaceSvg.prototype.zoomCenter = function(a) {
        var b = this.getMetrics();
        if (this.flyout_) {
            var c = b.svgWidth ? b.svgWidth / 2 : 0;
            b = b.svgHeight ? b.svgHeight / 2 : 0
        } else
            c = b.viewWidth / 2 + b.absoluteLeft,
            b = b.viewHeight / 2 + b.absoluteTop;
        this.zoom(c, b, a)
    }
    ;
    t.WorkspaceSvg.prototype.zoomToFit = function() {
        if (this.isMovable()) {
            var a = this.getMetrics()
              , b = a.viewWidth;
            a = a.viewHeight;
            var c = this.getBlocksBoundingBox()
              , d = c.right - c.left;
            c = c.bottom - c.top;
            if (d) {
                this.flyout_ && (this.horizontalLayout ? (a += this.flyout_.getHeight(),
                c += this.flyout_.getHeight() / this.scale) : (b += this.flyout_.getWidth(),
                d += this.flyout_.getWidth() / this.scale));
                b /= d;
                a /= c;
                (0,
                h.disable)();
                try {
                    this.setScale(Math.min(b, a)),
                    this.scrollCenter()
                } finally {
                    (0,
                    h.enable)()
                }
                this.maybeFireViewportChangeEvent()
            }
        } else
            console.warn("Tried to move a non-movable workspace. This could result in blocks becoming inaccessible.")
    }
    ;
    t.WorkspaceSvg.prototype.beginCanvasTransition = function() {
        (0,
        l.addClass)(this.svgBlockCanvas_, "blocklyCanvasTransitioning");
        (0,
        l.addClass)(this.svgBubbleCanvas_, "blocklyCanvasTransitioning")
    }
    ;
    t.WorkspaceSvg.prototype.endCanvasTransition = function() {
        (0,
        l.removeClass)(this.svgBlockCanvas_, "blocklyCanvasTransitioning");
        (0,
        l.removeClass)(this.svgBubbleCanvas_, "blocklyCanvasTransitioning")
    }
    ;
    t.WorkspaceSvg.prototype.scrollCenter = function() {
        if (this.isMovable()) {
            var a = this.getMetrics()
              , b = (a.scrollWidth - a.viewWidth) / 2
              , c = (a.scrollHeight - a.viewHeight) / 2;
            b = -b - a.scrollLeft;
            c = -c - a.scrollTop;
            this.scroll(b, c)
        } else
            console.warn("Tried to move a non-movable workspace. This could result in blocks becoming inaccessible.")
    }
    ;
    t.WorkspaceSvg.prototype.centerOnBlock = function(a) {
        if (this.isMovable()) {
            if (a = a ? this.getBlockById(a) : null) {
                var b = a.getRelativeToSurfaceXY()
                  , c = a.getHeightWidth()
                  , d = this.scale;
                a = (b.x + (this.RTL ? -1 : 1) * c.width / 2) * d;
                b = (b.y + c.height / 2) * d;
                c = this.getMetrics();
                this.scroll(-(a - c.viewWidth / 2), -(b - c.viewHeight / 2))
            }
        } else
            console.warn("Tried to move a non-movable workspace. This could result in blocks becoming inaccessible.")
    }
    ;
    t.WorkspaceSvg.prototype.setScale = function(a) {
        this.options.zoomOptions.maxScale && a > this.options.zoomOptions.maxScale ? a = this.options.zoomOptions.maxScale : this.options.zoomOptions.minScale && a < this.options.zoomOptions.minScale && (a = this.options.zoomOptions.minScale);
        this.scale = a;
        this.hideChaff(!1);
        (a = this.getFlyout(!1)) && a.isVisible() && (a.reflow(),
        this.recordDragTargets());
        this.grid_ && this.grid_.update(this.scale);
        a = this.getMetrics();
        this.scrollX -= a.absoluteLeft;
        this.scrollY -= a.absoluteTop;
        a.viewLeft += a.absoluteLeft;
        a.viewTop += a.absoluteTop;
        this.scroll(this.scrollX, this.scrollY);
        this.scrollbar && (this.flyout_ ? this.scrollbar.resizeView(a) : this.scrollbar.resizeContent(a))
    }
    ;
    t.WorkspaceSvg.prototype.getScale = function() {
        return this.options.parentWorkspace ? this.options.parentWorkspace.getScale() : this.scale
    }
    ;
    t.WorkspaceSvg.prototype.scroll = function(a, b) {
        this.hideChaff(!0);
        var c = this.getMetrics();
        a = Math.min(a, -c.scrollLeft);
        b = Math.min(b, -c.scrollTop);
        var d = c.scrollTop + Math.max(0, c.scrollHeight - c.viewHeight);
        a = Math.max(a, -(c.scrollLeft + Math.max(0, c.scrollWidth - c.viewWidth)));
        b = Math.max(b, -d);
        this.scrollX = a;
        this.scrollY = b;
        this.scrollbar && this.scrollbar.set(-(a + c.scrollLeft), -(b + c.scrollTop), !1);
        a += c.absoluteLeft;
        b += c.absoluteTop;
        this.translate(a, b)
    }
    ;
    t.WorkspaceSvg.setTopLevelWorkspaceMetrics_ = function(a) {
        var b = this.getMetrics();
        "number" === typeof a.x && (this.scrollX = -(b.scrollLeft + (b.scrollWidth - b.viewWidth) * a.x));
        "number" === typeof a.y && (this.scrollY = -(b.scrollTop + (b.scrollHeight - b.viewHeight) * a.y));
        this.translate(this.scrollX + b.absoluteLeft, this.scrollY + b.absoluteTop)
    }
    ;
    t.WorkspaceSvg.prototype.getBlockById = function(a) {
        return t.WorkspaceSvg.superClass_.getBlockById.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.getTopBlocks = function(a) {
        return t.WorkspaceSvg.superClass_.getTopBlocks.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.addTopBlock = function(a) {
        this.addTopBoundedElement(a);
        t.WorkspaceSvg.superClass_.addTopBlock.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.removeTopBlock = function(a) {
        this.removeTopBoundedElement(a);
        t.WorkspaceSvg.superClass_.removeTopBlock.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.addTopComment = function(a) {
        this.addTopBoundedElement(a);
        t.WorkspaceSvg.superClass_.addTopComment.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.removeTopComment = function(a) {
        this.removeTopBoundedElement(a);
        t.WorkspaceSvg.superClass_.removeTopComment.call(this, a)
    }
    ;
    t.WorkspaceSvg.prototype.addTopBoundedElement = function(a) {
        this.topBoundedElements_.push(a)
    }
    ;
    t.WorkspaceSvg.prototype.removeTopBoundedElement = function(a) {
        (0,
        sb)(this.topBoundedElements_, a)
    }
    ;
    t.WorkspaceSvg.prototype.getTopBoundedElements = function() {
        return [].concat(this.topBoundedElements_)
    }
    ;
    t.WorkspaceSvg.prototype.setResizesEnabled = function(a) {
        var b = !this.resizesEnabled_ && a;
        this.resizesEnabled_ = a;
        b && this.resizeContents()
    }
    ;
    t.WorkspaceSvg.prototype.clear = function() {
        this.setResizesEnabled(!1);
        t.WorkspaceSvg.superClass_.clear.call(this);
        this.topBoundedElements_ = [];
        this.setResizesEnabled(!0)
    }
    ;
    t.WorkspaceSvg.prototype.registerButtonCallback = function(a, b) {
        if ("function" !== typeof b)
            throw TypeError("Button callbacks must be functions.");
        this.flyoutButtonCallbacks_[a] = b
    }
    ;
    t.WorkspaceSvg.prototype.getButtonCallback = function(a) {
        return (a = this.flyoutButtonCallbacks_[a]) ? a : null
    }
    ;
    t.WorkspaceSvg.prototype.removeButtonCallback = function(a) {
        this.flyoutButtonCallbacks_[a] = null
    }
    ;
    t.WorkspaceSvg.prototype.registerToolboxCategoryCallback = function(a, b) {
        if ("function" !== typeof b)
            throw TypeError("Toolbox category callbacks must be functions.");
        this.toolboxCategoryCallbacks_[a] = b
    }
    ;
    t.WorkspaceSvg.prototype.getToolboxCategoryCallback = function(a) {
        return this.toolboxCategoryCallbacks_[a] || null
    }
    ;
    t.WorkspaceSvg.prototype.removeToolboxCategoryCallback = function(a) {
        this.toolboxCategoryCallbacks_[a] = null
    }
    ;
    t.WorkspaceSvg.prototype.getGesture = function(a) {
        var b = "mousedown" === a.type || "touchstart" === a.type || "pointerdown" === a.type
          , c = this.currentGesture_;
        return c ? b && c.hasStarted() ? (console.warn("Tried to start the same gesture twice."),
        c.cancel(),
        null) : c : b ? this.currentGesture_ = new ra.TouchGesture(a,this) : null
    }
    ;
    t.WorkspaceSvg.prototype.clearGesture = function() {
        this.currentGesture_ = null
    }
    ;
    t.WorkspaceSvg.prototype.cancelCurrentGesture = function() {
        this.currentGesture_ && this.currentGesture_.cancel()
    }
    ;
    t.WorkspaceSvg.prototype.getAudioManager = function() {
        return this.audioManager_
    }
    ;
    t.WorkspaceSvg.prototype.getGrid = function() {
        return this.grid_
    }
    ;
    t.WorkspaceSvg.prototype.hideChaff = function(a) {
        (0,
        T.hide)();
        (0,
        ma.hide)();
        y.hideWithoutAnimation();
        var b = !!a;
        this.getComponentManager().getComponents(ia.Capability.AUTOHIDEABLE, !0).forEach(function(c) {
            return c.autoHide(b)
        })
    }
    ;
    t.resizeSvgContents = function(a) {
        a.resizeContents()
    }
    ;
    var kf = function(a, b) {
        a.setAttribute("dir", "LTR");
        (0,
        Ia.inject)(b.hasCss, b.pathToMedia);
        a = (0,
        l.createSvgElement)(q.SVG, {
            xmlns: l.SVG_NS,
            "xmlns:html": l.HTML_NS,
            "xmlns:xlink": l.XLINK_NS,
            version: "1.1",
            "class": "blocklySvg",
            tabindex: "0"
        }, a);
        var c = (0,
        l.createSvgElement)(q.DEFS, {}, a)
          , d = String(Math.random()).substring(2);
        b.gridPattern = yb.createDom(d, b.gridOptions, c);
        return a
    }
      , lf = function(a, b, c, d) {
        b.parentWorkspace = null;
        b = new t.WorkspaceSvg(b,c,d);
        c = b.options;
        b.scale = c.zoomOptions.startScale;
        a.appendChild(b.createDom("blocklyMainBackground"));
        (0,
        l.addClass)(b.getInjectionDiv(), b.getRenderer().getClassName());
        (0,
        l.addClass)(b.getInjectionDiv(), b.getTheme().getClassName());
        !c.hasCategories && c.languageTree && (d = b.addFlyout(q.SVG),
        (0,
        l.insertAfter)(d, a));
        c.hasTrashcan && b.addTrashcan();
        c.zoomOptions && c.zoomOptions.controls && b.addZoomControls();
        b.getThemeManager().subscribe(a, "workspaceBackgroundColour", "background-color");
        b.translate(0, 0);
        b.addChangeListener((0,
        wc.bumpIntoBoundsHandler)(b));
        (0,
        e.module$exports$Blockly$common.svgResize)(b);
        (0,
        ma.createDom)();
        y.createDom();
        (0,
        T.createDom)();
        return b
    }
      , of = function(a) {
        var b = a.options
          , c = a.getParentSvg();
        (0,
        u.conditionalBind)(c.parentNode, "contextmenu", null, function(f) {
            (0,
            u.isTargetInput)(f) || f.preventDefault()
        });
        c = (0,
        u.conditionalBind)(window, "resize", null, function() {
            a.hideChaff(!0);
            (0,
            e.module$exports$Blockly$common.svgResize)(a);
            wc.bumpTopObjectsIntoBounds(a)
        });
        a.setResizeHandlerWrapper(c);
        mf();
        if (b.languageTree) {
            c = a.getToolbox();
            var d = a.getFlyout(!0);
            c ? c.init() : d && (d.init(a),
            d.show(b.languageTree),
            "function" === typeof d.scrollToStart && d.scrollToStart())
        }
        b.hasTrashcan && a.trashcan.init();
        b.zoomOptions && b.zoomOptions.controls && a.zoomControls_.init();
        b.moveOptions && b.moveOptions.scrollbars ? (a.scrollbar = new hb(a,!0 === b.moveOptions.scrollbars || !!b.moveOptions.scrollbars.horizontal,!0 === b.moveOptions.scrollbars || !!b.moveOptions.scrollbars.vertical,"blocklyMainWorkspaceScrollbar"),
        a.scrollbar.resize()) : a.setMetrics({
            x: .5,
            y: .5
        });
        b.hasSounds && nf(b.pathToMedia, a)
    }
      , pf = function(a) {
        var b = (0,
        e.module$exports$Blockly$common.getMainWorkspace)();
        if (b && !((0,
        u.isTargetInput)(a) || b.rendered && !b.isVisible()))
            K.ShortcutRegistry.registry.onKeyDown(b, a)
    }
      , Ke = !1
      , mf = function() {
        Ke || ((0,
        u.conditionalBind)(document, "scroll", null, function() {
            for (var a = I.Workspace.getAll(), b = 0, c; c = a[b]; b++)
                c.updateInverseScreenCTM && c.updateInverseScreenCTM()
        }),
        (0,
        u.conditionalBind)(document, "keydown", null, pf),
        (0,
        u.bind)(document, "touchend", null, N.longStop),
        (0,
        u.bind)(document, "touchcancel", null, N.longStop),
        O.IPAD && (0,
        u.conditionalBind)(window, "orientationchange", document, function() {
            (0,
            e.module$exports$Blockly$common.svgResize)((0,
            e.module$exports$Blockly$common.getMainWorkspace)())
        }));
        Ke = !0
    }
      , nf = function(a, b) {
        var c = b.getAudioManager();
        c.load([a + "click.mp3", a + "click.wav", a + "click.ogg"], "click");
        c.load([a + "disconnect.wav", a + "disconnect.mp3", a + "disconnect.ogg"], "disconnect");
        c.load([a + "delete.mp3", a + "delete.ogg", a + "delete.wav"], "delete");
        var d = [];
        a = function() {
            for (; d.length; )
                (0,
                u.unbind)(d.pop());
            c.preload()
        }
        ;
        d.push((0,
        u.conditionalBind)(document, "mousemove", null, a, !0));
        d.push((0,
        u.conditionalBind)(document, "touchstart", null, a, !0))
    }
      , Ec = function() {};
    Ec.prototype.onDragEnter = function(a) {}
    ;
    Ec.prototype.onDragOver = function(a) {}
    ;
    Ec.prototype.onDragExit = function(a) {}
    ;
    Ec.prototype.onDrop = function(a) {}
    ;
    Ec.prototype.shouldPreventMove = function(a) {
        return !1
    }
    ;
    var vc = {
        DeleteArea: function() {
            vc.DeleteArea.superClass_.constructor.call(this);
            this.wouldDelete_ = !1
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(vc.DeleteArea, Ec);
    vc.DeleteArea.prototype.wouldDelete = function(a, b) {
        a instanceof z.BlockSvg ? (a = !a.getParent() && a.isDeletable(),
        this.updateWouldDelete_(a && !b)) : this.updateWouldDelete_(a.isDeletable());
        return this.wouldDelete_
    }
    ;
    vc.DeleteArea.prototype.updateWouldDelete_ = function(a) {
        this.wouldDelete_ = a
    }
    ;
    var Fc = {
        FlyoutMetricsManager: function(a, b) {
            this.flyout_ = b;
            Fc.FlyoutMetricsManager.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Fc.FlyoutMetricsManager, bb);
    Fc.FlyoutMetricsManager.prototype.getBoundingBox_ = function() {
        try {
            var a = this.workspace_.getCanvas().getBBox()
        } catch (b) {
            a = {
                height: 0,
                y: 0,
                width: 0,
                x: 0
            }
        }
        return a
    }
    ;
    Fc.FlyoutMetricsManager.prototype.getContentMetrics = function(a) {
        var b = this.getBoundingBox_();
        a = a ? 1 : this.workspace_.scale;
        return {
            height: b.height * a,
            width: b.width * a,
            top: b.y * a,
            left: b.x * a
        }
    }
    ;
    Fc.FlyoutMetricsManager.prototype.getScrollMetrics = function(a, b, c) {
        b = c || this.getContentMetrics();
        c = this.flyout_.MARGIN * this.workspace_.scale;
        a = a ? this.workspace_.scale : 1;
        return {
            height: (b.height + 2 * c) / a,
            width: (b.width + b.left + c) / a,
            top: 0,
            left: 0
        }
    }
    ;
    var R = {
        Flyout: function(a) {
            R.Flyout.superClass_.constructor.call(this);
            a.setMetrics = this.setMetrics_.bind(this);
            this.workspace_ = new t.WorkspaceSvg(a);
            this.workspace_.setMetricsManager(new Fc.FlyoutMetricsManager(this.workspace_,this));
            this.workspace_.isFlyout = !0;
            this.workspace_.setVisible(this.isVisible_);
            this.id = (0,
            Va.genUid)();
            this.RTL = !!a.RTL;
            this.horizontalLayout = !1;
            this.toolboxPosition_ = a.toolboxPosition;
            this.eventWrappers_ = [];
            this.mats_ = [];
            this.buttons_ = [];
            this.listeners_ = [];
            this.permanentlyDisabled_ = [];
            this.tabWidth_ = this.workspace_.getRenderer().getConstants().TAB_WIDTH;
            this.targetWorkspace = null;
            this.recycledBlocks_ = []
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(R.Flyout, vc.DeleteArea);
    R.Flyout.prototype.autoClose = !0;
    R.Flyout.prototype.isVisible_ = !1;
    R.Flyout.prototype.containerVisible_ = !0;
    R.Flyout.prototype.CORNER_RADIUS = 8;
    R.Flyout.prototype.MARGIN = R.Flyout.prototype.CORNER_RADIUS;
    R.Flyout.prototype.GAP_X = 3 * R.Flyout.prototype.MARGIN;
    R.Flyout.prototype.GAP_Y = 3 * R.Flyout.prototype.MARGIN;
    R.Flyout.prototype.SCROLLBAR_MARGIN = 2.5;
    R.Flyout.prototype.width_ = 0;
    R.Flyout.prototype.height_ = 0;
    R.Flyout.prototype.dragAngleRange_ = 70;
    R.Flyout.prototype.createDom = function(a) {
        this.svgGroup_ = (0,
        l.createSvgElement)(a, {
            "class": "blocklyFlyout",
            style: "display: none"
        }, null);
        this.svgBackground_ = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyFlyoutBackground"
        }, this.svgGroup_);
        this.svgGroup_.appendChild(this.workspace_.createDom());
        this.workspace_.getThemeManager().subscribe(this.svgBackground_, "flyoutBackgroundColour", "fill");
        this.workspace_.getThemeManager().subscribe(this.svgBackground_, "flyoutOpacity", "fill-opacity");
        return this.svgGroup_
    }
    ;
    R.Flyout.prototype.init = function(a) {
        this.targetWorkspace = a;
        this.workspace_.targetWorkspace = a;
        this.workspace_.scrollbar = new hb(this.workspace_,this.horizontalLayout,!this.horizontalLayout,"blocklyFlyoutScrollbar",this.SCROLLBAR_MARGIN);
        this.hide();
        Array.prototype.push.apply(this.eventWrappers_, (0,
        u.conditionalBind)(this.svgGroup_, "wheel", this, this.wheel_));
        this.autoClose || (this.filterWrapper_ = this.filterForCapacity_.bind(this),
        this.targetWorkspace.addChangeListener(this.filterWrapper_));
        Array.prototype.push.apply(this.eventWrappers_, (0,
        u.conditionalBind)(this.svgBackground_, "mousedown", this, this.onMouseDown_));
        this.workspace_.getGesture = this.targetWorkspace.getGesture.bind(this.targetWorkspace);
        this.workspace_.setVariableMap(this.targetWorkspace.getVariableMap());
        this.workspace_.createPotentialVariableMap();
        a.getComponentManager().addComponent({
            component: this,
            weight: 1,
            capabilities: [ia.Capability.DELETE_AREA, ia.Capability.DRAG_TARGET]
        })
    }
    ;
    R.Flyout.prototype.dispose = function() {
        this.hide();
        this.workspace_.getComponentManager().removeComponent(this.id);
        (0,
        u.unbind)(this.eventWrappers_);
        this.filterWrapper_ && (this.targetWorkspace.removeChangeListener(this.filterWrapper_),
        this.filterWrapper_ = null);
        this.workspace_ && (this.workspace_.getThemeManager().unsubscribe(this.svgBackground_),
        this.workspace_.targetWorkspace = null,
        this.workspace_.dispose(),
        this.workspace_ = null);
        this.svgGroup_ && ((0,
        l.removeNode)(this.svgGroup_),
        this.svgGroup_ = null);
        this.targetWorkspace = this.svgBackground_ = null
    }
    ;
    R.Flyout.prototype.getWidth = function() {
        return this.width_
    }
    ;
    R.Flyout.prototype.getHeight = function() {
        return this.height_
    }
    ;
    R.Flyout.prototype.getFlyoutScale = function() {
        return this.targetWorkspace.scale
    }
    ;
    R.Flyout.prototype.getWorkspace = function() {
        return this.workspace_
    }
    ;
    R.Flyout.prototype.isVisible = function() {
        return this.isVisible_
    }
    ;
    R.Flyout.prototype.setVisible = function(a) {
        var b = a !== this.isVisible();
        this.isVisible_ = a;
        b && (this.autoClose || this.workspace_.recordDragTargets(),
        this.updateDisplay_())
    }
    ;
    R.Flyout.prototype.setContainerVisible = function(a) {
        var b = a !== this.containerVisible_;
        this.containerVisible_ = a;
        b && this.updateDisplay_()
    }
    ;
    R.Flyout.prototype.updateDisplay_ = function() {
        var a = this.containerVisible_ ? this.isVisible() : !1;
        this.svgGroup_.style.display = a ? "block" : "none";
        this.workspace_.scrollbar.setContainerVisible(a)
    }
    ;
    R.Flyout.prototype.positionAt_ = function(a, b, c, d) {
        this.svgGroup_.setAttribute("width", a);
        this.svgGroup_.setAttribute("height", b);
        this.workspace_.setCachedParentSvgSize(a, b);
        "svg" === this.svgGroup_.tagName ? (0,
        l.setCssTransform)(this.svgGroup_, "translate(" + c + "px," + d + "px)") : this.svgGroup_.setAttribute("transform", "translate(" + c + "," + d + ")");
        if (a = this.workspace_.scrollbar)
            a.setOrigin(c, d),
            a.resize(),
            a.hScroll && a.hScroll.setPosition(a.hScroll.position.x, a.hScroll.position.y),
            a.vScroll && a.vScroll.setPosition(a.vScroll.position.x, a.vScroll.position.y)
    }
    ;
    R.Flyout.prototype.hide = function() {
        if (this.isVisible()) {
            this.setVisible(!1);
            for (var a = 0, b; b = this.listeners_[a]; a++)
                (0,
                u.unbind)(b);
            this.listeners_.length = 0;
            this.reflowWrapper_ && (this.workspace_.removeChangeListener(this.reflowWrapper_),
            this.reflowWrapper_ = null)
        }
    }
    ;
    R.Flyout.prototype.show = function(a) {
        this.workspace_.setResizesEnabled(!1);
        this.hide();
        this.clearOldBlocks_();
        "string" === typeof a && (a = this.getDynamicCategoryContents_(a));
        this.setVisible(!0);
        a = (0,
        Q.convertFlyoutDefToJsonArray)(a);
        a = this.createFlyoutInfo_(a);
        this.layout_(a.contents, a.gaps);
        this.listeners_.push((0,
        u.conditionalBind)(this.svgBackground_, "mouseover", this, function() {
            for (var b = this.workspace_.getTopBlocks(!1), c = 0, d; d = b[c]; c++)
                d.removeSelect()
        }));
        this.horizontalLayout ? this.height_ = 0 : this.width_ = 0;
        this.workspace_.setResizesEnabled(!0);
        this.reflow();
        this.filterForCapacity_();
        this.position();
        this.reflowWrapper_ = this.reflow.bind(this);
        this.workspace_.addChangeListener(this.reflowWrapper_);
        this.emptyRecycledBlocks_()
    }
    ;
    R.Flyout.prototype.createFlyoutInfo_ = function(a) {
        var b = []
          , c = [];
        this.permanentlyDisabled_.length = 0;
        for (var d = this.horizontalLayout ? this.GAP_X : this.GAP_Y, f = 0, g; g = a[f]; f++)
            switch (g.custom && (g = this.getDynamicCategoryContents_(g.custom),
            g = (0,
            Q.convertFlyoutDefToJsonArray)(g),
            a.splice.apply(a, [f, 1].concat(g)),
            g = a[f]),
            g.kind.toUpperCase()) {
            case "BLOCK":
                var k = this.createFlyoutBlock_(g);
                b.push({
                    type: "block",
                    block: k
                });
                this.addBlockGap_(g, c, d);
                break;
            case "SEP":
                this.addSeparatorGap_(g, c, d);
                break;
            case "LABEL":
                g = this.createButton_(g, !0);
                b.push({
                    type: "button",
                    button: g
                });
                c.push(d);
                break;
            case "BUTTON":
                g = this.createButton_(g, !1),
                b.push({
                    type: "button",
                    button: g
                }),
                c.push(d)
            }
        return {
            contents: b,
            gaps: c
        }
    }
    ;
    R.Flyout.prototype.getDynamicCategoryContents_ = function(a) {
        a = this.workspace_.targetWorkspace.getToolboxCategoryCallback(a);
        if ("function" !== typeof a)
            throw TypeError("Couldn't find a callback function when opening a toolbox category.");
        return a(this.workspace_.targetWorkspace)
    }
    ;
    R.Flyout.prototype.createButton_ = function(a, b) {
        var c = Wa.FlyoutButton;
        if (!c)
            throw Error("Missing require for Blockly.FlyoutButton");
        return new c(this.workspace_,this.targetWorkspace,a,b)
    }
    ;
    R.Flyout.prototype.createFlyoutBlock_ = function(a) {
        var b;
        a.blockxml ? (a = "string" === typeof a.blockxml ? (0,
        e.module$exports$Blockly$Xml.textToDom)(a.blockxml) : a.blockxml,
        (b = this.getRecycledBlock_(a.getAttribute("type"))) || (b = (0,
        e.module$exports$Blockly$Xml.domToBlock)(a, this.workspace_))) : (b = this.getRecycledBlock_(a.type),
        b || (void 0 === a.enabled && (a.enabled = "true" !== a.disabled && !0 !== a.disabled),
        b = (0,
        Sa.append)(a, this.workspace_)));
        b.isEnabled() || this.permanentlyDisabled_.push(b);
        return b
    }
    ;
    R.Flyout.prototype.getRecycledBlock_ = function(a) {
        for (var b = -1, c = 0; c < this.recycledBlocks_.length; c++)
            if (this.recycledBlocks_[c].type === a) {
                b = c;
                break
            }
        return -1 === b ? void 0 : this.recycledBlocks_.splice(b, 1)[0]
    }
    ;
    R.Flyout.prototype.addBlockGap_ = function(a, b, c) {
        if (a.gap)
            var d = parseInt(a.gap, 10);
        else
            a.blockxml && (a = "string" === typeof a.blockxml ? (0,
            e.module$exports$Blockly$Xml.textToDom)(a.blockxml) : a.blockxml,
            d = parseInt(a.getAttribute("gap"), 10));
        b.push(isNaN(d) ? c : d)
    }
    ;
    R.Flyout.prototype.addSeparatorGap_ = function(a, b, c) {
        a = parseInt(a.gap, 10);
        !isNaN(a) && 0 < b.length ? b[b.length - 1] = a : b.push(c)
    }
    ;
    R.Flyout.prototype.clearOldBlocks_ = function() {
        for (var a = this.workspace_.getTopBlocks(!1), b = 0, c; c = a[b]; b++)
            this.blockIsRecyclable_(c) ? this.recycleBlock_(c) : c.dispose(!1, !1);
        for (a = 0; a < this.mats_.length; a++)
            if (b = this.mats_[a])
                (0,
                T.unbindMouseEvents)(b),
                (0,
                l.removeNode)(b);
        for (a = this.mats_.length = 0; b = this.buttons_[a]; a++)
            b.dispose();
        this.buttons_.length = 0;
        this.workspace_.getPotentialVariableMap().clear()
    }
    ;
    R.Flyout.prototype.emptyRecycledBlocks_ = function() {
        for (var a = 0; a < this.recycledBlocks_.length; a++)
            this.recycledBlocks_[a].dispose();
        this.recycledBlocks_ = []
    }
    ;
    R.Flyout.prototype.blockIsRecyclable_ = function(a) {
        return !1
    }
    ;
    R.Flyout.prototype.recycleBlock_ = function(a) {
        var b = a.getRelativeToSurfaceXY();
        a.moveBy(-b.x, -b.y);
        this.recycledBlocks_.push(a)
    }
    ;
    R.Flyout.prototype.addBlockListeners_ = function(a, b, c) {
        this.listeners_.push((0,
        u.conditionalBind)(a, "mousedown", null, this.blockMouseDown_(b)));
        this.listeners_.push((0,
        u.conditionalBind)(c, "mousedown", null, this.blockMouseDown_(b)));
        this.listeners_.push((0,
        u.bind)(a, "mouseenter", b, b.addSelect));
        this.listeners_.push((0,
        u.bind)(a, "mouseleave", b, b.removeSelect));
        this.listeners_.push((0,
        u.bind)(c, "mouseenter", b, b.addSelect));
        this.listeners_.push((0,
        u.bind)(c, "mouseleave", b, b.removeSelect))
    }
    ;
    R.Flyout.prototype.blockMouseDown_ = function(a) {
        var b = this;
        return function(c) {
            var d = b.targetWorkspace.getGesture(c);
            d && (d.setStartBlock(a),
            d.handleFlyoutStart(c, b))
        }
    }
    ;
    R.Flyout.prototype.onMouseDown_ = function(a) {
        var b = this.targetWorkspace.getGesture(a);
        b && b.handleFlyoutStart(a, this)
    }
    ;
    R.Flyout.prototype.isBlockCreatable_ = function(a) {
        return a.isEnabled()
    }
    ;
    R.Flyout.prototype.createBlock = function(a) {
        var b = null;
        (0,
        h.disable)();
        var c = this.targetWorkspace.getAllVariables();
        this.targetWorkspace.setResizesEnabled(!1);
        try {
            b = this.placeNewBlock_(a)
        } finally {
            (0,
            h.enable)()
        }
        this.targetWorkspace.hideChaff();
        a = (0,
        e.module$exports$Blockly$Variables.getAddedVariables)(this.targetWorkspace, c);
        if ((0,
        h.isEnabled)()) {
            (0,
            h.setGroup)(!0);
            for (c = 0; c < a.length; c++) {
                var d = a[c];
                (0,
                h.fire)(new ((0,
                h.get)(h.VAR_CREATE))(d))
            }
            (0,
            h.fire)(new ((0,
            h.get)(h.CREATE))(b))
        }
        this.autoClose ? this.hide() : this.filterForCapacity_();
        return b
    }
    ;
    R.Flyout.prototype.initFlyoutButton_ = function(a, b, c) {
        var d = a.createDom();
        a.moveTo(b, c);
        a.show();
        this.listeners_.push((0,
        u.conditionalBind)(d, "mousedown", this, this.onMouseDown_));
        this.buttons_.push(a)
    }
    ;
    R.Flyout.prototype.createRect_ = function(a, b, c, d, f) {
        b = (0,
        l.createSvgElement)(q.RECT, {
            "fill-opacity": 0,
            x: b,
            y: c,
            height: d.height,
            width: d.width
        }, null);
        b.tooltip = a;
        (0,
        T.bindMouseEvents)(b);
        this.workspace_.getCanvas().insertBefore(b, a.getSvgRoot());
        a.flyoutRect_ = b;
        return this.mats_[f] = b
    }
    ;
    R.Flyout.prototype.moveRectToBlock_ = function(a, b) {
        var c = b.getHeightWidth();
        a.setAttribute("width", c.width);
        a.setAttribute("height", c.height);
        b = b.getRelativeToSurfaceXY();
        a.setAttribute("y", b.y);
        a.setAttribute("x", this.RTL ? b.x - c.width : b.x)
    }
    ;
    R.Flyout.prototype.filterForCapacity_ = function() {
        for (var a = this.workspace_.getTopBlocks(!1), b = 0, c; c = a[b]; b++)
            if (-1 === this.permanentlyDisabled_.indexOf(c))
                for (var d = this.targetWorkspace.isCapacityAvailable((0,
                e.module$exports$Blockly$common.getBlockTypeCounts)(c)); c; )
                    c.setEnabled(d),
                    c = c.getNextBlock()
    }
    ;
    R.Flyout.prototype.reflow = function() {
        this.reflowWrapper_ && this.workspace_.removeChangeListener(this.reflowWrapper_);
        this.reflowInternal_();
        this.reflowWrapper_ && this.workspace_.addChangeListener(this.reflowWrapper_)
    }
    ;
    R.Flyout.prototype.isScrollable = function() {
        return this.workspace_.scrollbar ? this.workspace_.scrollbar.isVisible() : !1
    }
    ;
    R.Flyout.prototype.placeNewBlock_ = function(a) {
        var b = this.targetWorkspace;
        if (!a.getSvgRoot())
            throw Error("oldBlock is not rendered.");
        var c = (0,
        Sa.save)(a);
        b.setResizesEnabled(!1);
        b = (0,
        Sa.append)(c, b);
        this.positionNewBlock_(a, b);
        return b
    }
    ;
    R.Flyout.prototype.positionNewBlock_ = function(a, b) {
        var c = this.targetWorkspace
          , d = c.getOriginOffsetInPixels()
          , f = this.workspace_.getOriginOffsetInPixels();
        a = a.getRelativeToSurfaceXY();
        a.scale(this.workspace_.scale);
        f = E.sum(f, a);
        d = E.difference(f, d);
        d.scale(1 / c.scale);
        b.moveTo(new E(d.x,d.y))
    }
    ;
    var cb = {
        VerticalFlyout: function(a) {
            cb.VerticalFlyout.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(cb.VerticalFlyout, R.Flyout);
    cb.VerticalFlyout.registryName = "verticalFlyout";
    cb.VerticalFlyout.prototype.setMetrics_ = function(a) {
        if (this.isVisible()) {
            var b = this.workspace_.getMetricsManager()
              , c = b.getScrollMetrics()
              , d = b.getViewMetrics();
            b = b.getAbsoluteMetrics();
            "number" === typeof a.y && (this.workspace_.scrollY = -(c.top + (c.height - d.height) * a.y));
            this.workspace_.translate(this.workspace_.scrollX + b.left, this.workspace_.scrollY + b.top)
        }
    }
    ;
    cb.VerticalFlyout.prototype.getX = function() {
        if (!this.isVisible())
            return 0;
        var a = this.targetWorkspace.getMetricsManager()
          , b = a.getAbsoluteMetrics()
          , c = a.getViewMetrics();
        a = a.getToolboxMetrics();
        return this.targetWorkspace.toolboxPosition === this.toolboxPosition_ ? this.targetWorkspace.getToolbox() ? this.toolboxPosition_ === Q.Position.LEFT ? a.width : c.width - this.width_ : this.toolboxPosition_ === Q.Position.LEFT ? 0 : c.width : this.toolboxPosition_ === Q.Position.LEFT ? 0 : c.width + b.left - this.width_
    }
    ;
    cb.VerticalFlyout.prototype.getY = function() {
        return 0
    }
    ;
    cb.VerticalFlyout.prototype.position = function() {
        if (this.isVisible() && this.targetWorkspace.isVisible()) {
            var a = this.targetWorkspace.getMetricsManager().getViewMetrics();
            this.height_ = a.height;
            this.setBackgroundPath_(this.width_ - this.CORNER_RADIUS, a.height - 2 * this.CORNER_RADIUS);
            a = this.getX();
            var b = this.getY();
            this.positionAt_(this.width_, this.height_, a, b)
        }
    }
    ;
    cb.VerticalFlyout.prototype.setBackgroundPath_ = function(a, b) {
        var c = this.toolboxPosition_ === Q.Position.RIGHT
          , d = a + this.CORNER_RADIUS;
        d = ["M " + (c ? d : 0) + ",0"];
        d.push("h", c ? -a : a);
        d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, c ? 0 : 1, c ? -this.CORNER_RADIUS : this.CORNER_RADIUS, this.CORNER_RADIUS);
        d.push("v", Math.max(0, b));
        d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, c ? 0 : 1, c ? this.CORNER_RADIUS : -this.CORNER_RADIUS, this.CORNER_RADIUS);
        d.push("h", c ? a : -a);
        d.push("z");
        this.svgBackground_.setAttribute("d", d.join(" "))
    }
    ;
    cb.VerticalFlyout.prototype.scrollToStart = function() {
        this.workspace_.scrollbar.setY(0)
    }
    ;
    cb.VerticalFlyout.prototype.wheel_ = function(a) {
        var b = (0,
        u.getScrollDeltaPixels)(a);
        if (b.y) {
            var c = this.workspace_.getMetricsManager()
              , d = c.getScrollMetrics();
            b = c.getViewMetrics().top - d.top + b.y;
            this.workspace_.scrollbar.setY(b);
            (0,
            ma.hide)();
            y.hideWithoutAnimation()
        }
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    cb.VerticalFlyout.prototype.layout_ = function(a, b) {
        this.workspace_.scale = this.targetWorkspace.scale;
        for (var c = this.MARGIN, d = this.RTL ? c : c + this.tabWidth_, f = 0, g; g = a[f]; f++)
            if ("block" === g.type) {
                g = g.block;
                for (var k = g.getDescendants(!1), n = 0, x; x = k[n]; n++)
                    x.isInFlyout = !0;
                g.render();
                k = g.getSvgRoot();
                n = g.getHeightWidth();
                x = g.outputConnection ? d - this.tabWidth_ : d;
                g.moveBy(x, c);
                x = this.createRect_(g, this.RTL ? x - n.width : x, c, n, f);
                this.addBlockListeners_(k, g, x);
                c += n.height + b[f]
            } else
                "button" === g.type && (this.initFlyoutButton_(g.button, d, c),
                c += g.button.height + b[f])
    }
    ;
    cb.VerticalFlyout.prototype.isDragTowardWorkspace = function(a) {
        a = Math.atan2(a.y, a.x) / Math.PI * 180;
        var b = this.dragAngleRange_;
        return a < b && a > -b || a < -180 + b || a > 180 - b ? !0 : !1
    }
    ;
    cb.VerticalFlyout.prototype.getClientRect = function() {
        if (!this.svgGroup_ || this.autoClose || !this.isVisible())
            return null;
        var a = this.svgGroup_.getBoundingClientRect()
          , b = a.left;
        return this.toolboxPosition_ === Q.Position.LEFT ? new Aa(-1E9,1E9,-1E9,b + a.width) : new Aa(-1E9,1E9,b,1E9)
    }
    ;
    cb.VerticalFlyout.prototype.reflowInternal_ = function() {
        this.workspace_.scale = this.getFlyoutScale();
        for (var a = 0, b = this.workspace_.getTopBlocks(!1), c = 0, d; d = b[c]; c++) {
            var f = d.getHeightWidth().width;
            d.outputConnection && (f -= this.tabWidth_);
            a = Math.max(a, f)
        }
        for (c = 0; d = this.buttons_[c]; c++)
            a = Math.max(a, d.width);
        a += 1.5 * this.MARGIN + this.tabWidth_;
        a *= this.workspace_.scale;
        a += G.Scrollbar.scrollbarThickness;
        if (this.width_ !== a) {
            for (c = 0; d = b[c]; c++) {
                if (this.RTL) {
                    f = d.getRelativeToSurfaceXY().x;
                    var g = a / this.workspace_.scale - this.MARGIN;
                    d.outputConnection || (g -= this.tabWidth_);
                    d.moveBy(g - f, 0)
                }
                d.flyoutRect_ && this.moveRectToBlock_(d.flyoutRect_, d)
            }
            if (this.RTL)
                for (b = 0; c = this.buttons_[b]; b++)
                    d = c.getPosition().y,
                    c.moveTo(a / this.workspace_.scale - c.width - this.MARGIN - this.tabWidth_, d);
            this.targetWorkspace.toolboxPosition !== this.toolboxPosition_ || this.toolboxPosition_ !== Q.Position.LEFT || this.targetWorkspace.getToolbox() || this.targetWorkspace.translate(this.targetWorkspace.scrollX + a, this.targetWorkspace.scrollY);
            this.width_ = a;
            this.position();
            this.targetWorkspace.recordDragTargets()
        }
    }
    ;
    (0,
    r.register)(r.Type.FLYOUTS_VERTICAL_TOOLBOX, r.DEFAULT, cb.VerticalFlyout);
    var Jb = function(a, b, c) {
        this.id_ = a.toolboxitemid || (0,
        Va.getNextUniqueId)();
        this.level_ = (this.parent_ = c || null) ? this.parent_.getLevel() + 1 : 0;
        this.toolboxItemDef_ = a;
        this.parentToolbox_ = b;
        this.workspace_ = this.parentToolbox_.getWorkspace()
    };
    Jb.prototype.init = function() {}
    ;
    Jb.prototype.getDiv = function() {
        return null
    }
    ;
    Jb.prototype.getId = function() {
        return this.id_
    }
    ;
    Jb.prototype.getParent = function() {
        return null
    }
    ;
    Jb.prototype.getLevel = function() {
        return this.level_
    }
    ;
    Jb.prototype.isSelectable = function() {
        return !1
    }
    ;
    Jb.prototype.isCollapsible = function() {
        return !1
    }
    ;
    Jb.prototype.dispose = function() {}
    ;
    var X = {
        ToolboxCategory: function(a, b, c) {
            X.ToolboxCategory.superClass_.constructor.call(this, a, b, c);
            this.name_ = (0,
            da.replaceMessageReferences)(a.name);
            this.colour_ = this.getColour_(a);
            this.labelDom_ = this.iconDom_ = this.rowContents_ = this.rowDiv_ = this.htmlDiv_ = null;
            this.cssConfig_ = this.makeDefaultCssConfig_();
            (0,
            e.module$exports$Blockly$utils$object.mixin)(this.cssConfig_, a.cssconfig || a.cssConfig);
            this.isDisabled_ = this.isHidden_ = !1;
            this.flyoutItems_ = [];
            this.parseContents_(a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(X.ToolboxCategory, Jb);
    X.ToolboxCategory.registrationName = "category";
    X.ToolboxCategory.nestedPadding = 19;
    X.ToolboxCategory.borderWidth = 8;
    X.ToolboxCategory.defaultBackgroundColour = "#57e";
    X.ToolboxCategory.prototype.makeDefaultCssConfig_ = function() {
        return {
            container: "blocklyToolboxCategory",
            row: "blocklyTreeRow",
            rowcontentcontainer: "blocklyTreeRowContentContainer",
            icon: "blocklyTreeIcon",
            label: "blocklyTreeLabel",
            contents: "blocklyToolboxContents",
            selected: "blocklyTreeSelected",
            openicon: "blocklyTreeIconOpen",
            closedicon: "blocklyTreeIconClosed"
        }
    }
    ;
    X.ToolboxCategory.prototype.parseContents_ = function(a) {
        var b = a.contents;
        if (a.custom)
            this.flyoutItems_ = a.custom;
        else if (b)
            for (a = 0; a < b.length; a++)
                this.flyoutItems_.push(b[a])
    }
    ;
    X.ToolboxCategory.prototype.init = function() {
        this.createDom_();
        "true" === this.toolboxItemDef_.hidden && this.hide()
    }
    ;
    X.ToolboxCategory.prototype.createDom_ = function() {
        this.htmlDiv_ = this.createContainer_();
        (0,
        J.setRole)(this.htmlDiv_, J.Role.TREEITEM);
        (0,
        J.setState)(this.htmlDiv_, J.State.SELECTED, !1);
        (0,
        J.setState)(this.htmlDiv_, J.State.LEVEL, this.level_);
        this.rowDiv_ = this.createRowContainer_();
        this.rowDiv_.style.pointerEvents = "auto";
        this.htmlDiv_.appendChild(this.rowDiv_);
        this.rowContents_ = this.createRowContentsContainer_();
        this.rowContents_.style.pointerEvents = "none";
        this.rowDiv_.appendChild(this.rowContents_);
        this.iconDom_ = this.createIconDom_();
        (0,
        J.setRole)(this.iconDom_, J.Role.PRESENTATION);
        this.rowContents_.appendChild(this.iconDom_);
        this.labelDom_ = this.createLabelDom_(this.name_);
        this.rowContents_.appendChild(this.labelDom_);
        (0,
        J.setState)(this.htmlDiv_, J.State.LABELLEDBY, this.labelDom_.getAttribute("id"));
        this.addColourBorder_(this.colour_);
        return this.htmlDiv_
    }
    ;
    X.ToolboxCategory.prototype.createContainer_ = function() {
        var a = document.createElement("div");
        (0,
        l.addClass)(a, this.cssConfig_.container);
        return a
    }
    ;
    X.ToolboxCategory.prototype.createRowContainer_ = function() {
        var a = document.createElement("div");
        (0,
        l.addClass)(a, this.cssConfig_.row);
        var b = X.ToolboxCategory.nestedPadding * this.getLevel();
        b = b.toString() + "px";
        this.workspace_.RTL ? a.style.paddingRight = b : a.style.paddingLeft = b;
        return a
    }
    ;
    X.ToolboxCategory.prototype.createRowContentsContainer_ = function() {
        var a = document.createElement("div");
        (0,
        l.addClass)(a, this.cssConfig_.rowcontentcontainer);
        return a
    }
    ;
    X.ToolboxCategory.prototype.createIconDom_ = function() {
        var a = document.createElement("span");
        this.parentToolbox_.isHorizontal() || (0,
        l.addClass)(a, this.cssConfig_.icon);
        a.style.display = "inline-block";
        return a
    }
    ;
    X.ToolboxCategory.prototype.createLabelDom_ = function(a) {
        var b = document.createElement("span");
        b.setAttribute("id", this.getId() + ".label");
        b.textContent = a;
        (0,
        l.addClass)(b, this.cssConfig_.label);
        return b
    }
    ;
    X.ToolboxCategory.prototype.refreshTheme = function() {
        this.colour_ = this.getColour_(this.toolboxItemDef_);
        this.addColourBorder_(this.colour_)
    }
    ;
    X.ToolboxCategory.prototype.addColourBorder_ = function(a) {
        a && (a = X.ToolboxCategory.borderWidth + "px solid " + (a || "#ddd"),
        this.workspace_.RTL ? this.rowDiv_.style.borderRight = a : this.rowDiv_.style.borderLeft = a)
    }
    ;
    X.ToolboxCategory.prototype.getColour_ = function(a) {
        var b = a.categorystyle || a.categoryStyle;
        if ((a = a.colour) && b)
            console.warn('Toolbox category "' + this.name_ + '" must not have both a style and a colour');
        else
            return b ? this.getColourfromStyle_(b) : this.parseColour_(a);
        return ""
    }
    ;
    X.ToolboxCategory.prototype.getColourfromStyle_ = function(a) {
        var b = this.workspace_.getTheme();
        if (a && b) {
            if ((b = b.categoryStyles[a]) && b.colour)
                return this.parseColour_(b.colour);
            console.warn('Style "' + a + '" must exist and contain a colour value')
        }
        return ""
    }
    ;
    X.ToolboxCategory.prototype.getClickTarget = function() {
        return this.rowDiv_
    }
    ;
    X.ToolboxCategory.prototype.parseColour_ = function(a) {
        a = (0,
        da.replaceMessageReferences)(a);
        if (null == a || "" === a)
            return "";
        var b = Number(a);
        if (isNaN(b)) {
            if (b = (0,
            ha.parse)(a))
                return b;
            console.warn('Toolbox category "' + this.name_ + '" has unrecognized colour attribute: ' + a);
            return ""
        }
        return (0,
        ha.hueToHex)(b)
    }
    ;
    X.ToolboxCategory.prototype.openIcon_ = function(a) {
        a && ((0,
        l.removeClasses)(a, this.cssConfig_.closedicon),
        (0,
        l.addClass)(a, this.cssConfig_.openicon))
    }
    ;
    X.ToolboxCategory.prototype.closeIcon_ = function(a) {
        a && ((0,
        l.removeClasses)(a, this.cssConfig_.openicon),
        (0,
        l.addClass)(a, this.cssConfig_.closedicon))
    }
    ;
    X.ToolboxCategory.prototype.setVisible_ = function(a) {
        this.htmlDiv_.style.display = a ? "block" : "none";
        this.isHidden_ = !a;
        this.parentToolbox_.getSelectedItem() === this && this.parentToolbox_.clearSelection()
    }
    ;
    X.ToolboxCategory.prototype.hide = function() {
        this.setVisible_(!1)
    }
    ;
    X.ToolboxCategory.prototype.show = function() {
        this.setVisible_(!0)
    }
    ;
    X.ToolboxCategory.prototype.isVisible = function() {
        return !this.isHidden_ && this.allAncestorsExpanded_()
    }
    ;
    X.ToolboxCategory.prototype.allAncestorsExpanded_ = function() {
        for (var a = this; a.getParent(); )
            if (a = a.getParent(),
            !a.isExpanded())
                return !1;
        return !0
    }
    ;
    X.ToolboxCategory.prototype.isSelectable = function() {
        return this.isVisible() && !this.isDisabled_
    }
    ;
    X.ToolboxCategory.prototype.onClick = function(a) {}
    ;
    X.ToolboxCategory.prototype.setSelected = function(a) {
        if (a) {
            var b = this.parseColour_(X.ToolboxCategory.defaultBackgroundColour);
            this.rowDiv_.style.backgroundColor = this.colour_ || b;
            (0,
            l.addClass)(this.rowDiv_, this.cssConfig_.selected)
        } else
            this.rowDiv_.style.backgroundColor = "",
            (0,
            l.removeClass)(this.rowDiv_, this.cssConfig_.selected);
        (0,
        J.setState)(this.htmlDiv_, J.State.SELECTED, a)
    }
    ;
    X.ToolboxCategory.prototype.setDisabled = function(a) {
        this.isDisabled_ = a;
        this.getDiv().setAttribute("disabled", a);
        a ? this.getDiv().setAttribute("disabled", "true") : this.getDiv().removeAttribute("disabled")
    }
    ;
    X.ToolboxCategory.prototype.getName = function() {
        return this.name_
    }
    ;
    X.ToolboxCategory.prototype.getParent = function() {
        return this.parent_
    }
    ;
    X.ToolboxCategory.prototype.getDiv = function() {
        return this.htmlDiv_
    }
    ;
    X.ToolboxCategory.prototype.getContents = function() {
        return this.flyoutItems_
    }
    ;
    X.ToolboxCategory.prototype.updateFlyoutContents = function(a) {
        this.flyoutItems_ = [];
        "string" === typeof a ? this.toolboxItemDef_.custom = a : (delete this.toolboxItemDef_.custom,
        this.toolboxItemDef_.contents = (0,
        Q.convertFlyoutDefToJsonArray)(a));
        this.parseContents_(this.toolboxItemDef_)
    }
    ;
    X.ToolboxCategory.prototype.dispose = function() {
        (0,
        l.removeNode)(this.htmlDiv_)
    }
    ;
    (0,
    Ia.register)('\n  .blocklyTreeRow:not(.blocklyTreeSelected):hover {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n\n  .blocklyToolboxDiv[layout="h"] .blocklyToolboxCategory {\n    margin: 1px 5px 1px 0;\n  }\n\n  .blocklyToolboxDiv[dir="RTL"][layout="h"] .blocklyToolboxCategory {\n    margin: 1px 0 1px 5px;\n  }\n\n  .blocklyTreeRow {\n    height: 22px;\n    line-height: 22px;\n    margin-bottom: 3px;\n    padding-right: 8px;\n    white-space: nowrap;\n  }\n\n  .blocklyToolboxDiv[dir="RTL"] .blocklyTreeRow {\n    margin-left: 8px;\n    padding-right: 0;\n  }\n\n  .blocklyTreeIcon {\n    background-image: url(<<<PATH>>>/sprites.png);\n    height: 16px;\n    vertical-align: middle;\n    visibility: hidden;\n    width: 16px;\n  }\n\n  .blocklyTreeIconClosed {\n    background-position: -32px -1px;\n  }\n\n  .blocklyToolboxDiv[dir="RTL"] .blocklyTreeIconClosed {\n    background-position: 0 -1px;\n  }\n\n  .blocklyTreeSelected>.blocklyTreeIconClosed {\n    background-position: -32px -17px;\n  }\n\n  .blocklyToolboxDiv[dir="RTL"] .blocklyTreeSelected>.blocklyTreeIconClosed {\n    background-position: 0 -17px;\n  }\n\n  .blocklyTreeIconOpen {\n    background-position: -16px -1px;\n  }\n\n  .blocklyTreeSelected>.blocklyTreeIconOpen {\n    background-position: -16px -17px;\n  }\n\n  .blocklyTreeLabel {\n    cursor: default;\n    font: 16px sans-serif;\n    padding: 0 3px;\n    vertical-align: middle;\n  }\n\n  .blocklyToolboxDelete .blocklyTreeLabel {\n    cursor: url("<<<PATH>>>/handdelete.cur"), auto;\n  }\n\n  .blocklyTreeSelected .blocklyTreeLabel {\n    color: #fff;\n  }\n');
    (0,
    r.register)(r.Type.TOOLBOX_ITEM, X.ToolboxCategory.registrationName, X.ToolboxCategory);
    var Kb = {
        ToolboxSeparator: function(a, b) {
            Kb.ToolboxSeparator.superClass_.constructor.call(this, a, b);
            this.cssConfig_ = {
                container: "blocklyTreeSeparator"
            };
            (0,
            e.module$exports$Blockly$utils$object.mixin)(this.cssConfig_, a.cssconfig || a.cssConfig)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Kb.ToolboxSeparator, Jb);
    Kb.ToolboxSeparator.registrationName = "sep";
    Kb.ToolboxSeparator.prototype.init = function() {
        this.createDom_()
    }
    ;
    Kb.ToolboxSeparator.prototype.createDom_ = function() {
        var a = document.createElement("div");
        (0,
        l.addClass)(a, this.cssConfig_.container);
        return this.htmlDiv_ = a
    }
    ;
    Kb.ToolboxSeparator.prototype.getDiv = function() {
        return this.htmlDiv_
    }
    ;
    Kb.ToolboxSeparator.prototype.dispose = function() {
        (0,
        l.removeNode)(this.htmlDiv_)
    }
    ;
    (0,
    Ia.register)('\n  .blocklyTreeSeparator {\n    border-bottom: solid #e5e5e5 1px;\n    height: 0;\n    margin: 5px 0;\n  }\n\n  .blocklyToolboxDiv[layout="h"] .blocklyTreeSeparator {\n    border-right: solid #e5e5e5 1px;\n    border-bottom: none;\n    height: auto;\n    margin: 0 5px 0 5px;\n    padding: 5px 0;\n    width: 0;\n  }\n');
    (0,
    r.register)(r.Type.TOOLBOX_ITEM, Kb.ToolboxSeparator.registrationName, Kb.ToolboxSeparator);
    var sa = {
        CollapsibleToolboxCategory: function(a, b, c) {
            this.subcategoriesDiv_ = null;
            this.expanded_ = !1;
            this.toolboxItems_ = [];
            sa.CollapsibleToolboxCategory.superClass_.constructor.call(this, a, b, c)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(sa.CollapsibleToolboxCategory, X.ToolboxCategory);
    sa.CollapsibleToolboxCategory.registrationName = "collapsibleCategory";
    sa.CollapsibleToolboxCategory.prototype.makeDefaultCssConfig_ = function() {
        var a = sa.CollapsibleToolboxCategory.superClass_.makeDefaultCssConfig_.call(this);
        a.contents = "blocklyToolboxContents";
        return a
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.parseContents_ = function(a) {
        var b = a.contents
          , c = !0;
        if (a.custom)
            this.flyoutItems_ = a.custom;
        else if (b)
            for (a = 0; a < b.length; a++) {
                var d = b[a];
                !(0,
                r.hasItem)(r.Type.TOOLBOX_ITEM, d.kind) || d.kind.toLowerCase() === Kb.ToolboxSeparator.registrationName && c ? (this.flyoutItems_.push(d),
                c = !0) : (this.createToolboxItem_(d),
                c = !1)
            }
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.createToolboxItem_ = function(a) {
        var b = a.kind;
        "CATEGORY" == b.toUpperCase() && (0,
        Q.isCategoryCollapsible)(a) && (b = sa.CollapsibleToolboxCategory.registrationName);
        a = new ((0,
        r.getClass)(r.Type.TOOLBOX_ITEM, b))(a,this.parentToolbox_,this);
        this.toolboxItems_.push(a)
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.init = function() {
        sa.CollapsibleToolboxCategory.superClass_.init.call(this);
        this.setExpanded("true" === this.toolboxItemDef_.expanded || this.toolboxItemDef_.expanded)
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.createDom_ = function() {
        sa.CollapsibleToolboxCategory.superClass_.createDom_.call(this);
        var a = this.getChildToolboxItems();
        this.subcategoriesDiv_ = this.createSubCategoriesDom_(a);
        (0,
        J.setRole)(this.subcategoriesDiv_, J.Role.GROUP);
        this.htmlDiv_.appendChild(this.subcategoriesDiv_);
        return this.htmlDiv_
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.createIconDom_ = function() {
        var a = document.createElement("span");
        this.parentToolbox_.isHorizontal() || ((0,
        l.addClass)(a, this.cssConfig_.icon),
        a.style.visibility = "visible");
        a.style.display = "inline-block";
        return a
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.createSubCategoriesDom_ = function(a) {
        var b = document.createElement("div");
        (0,
        l.addClass)(b, this.cssConfig_.contents);
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            d.init();
            var f = d.getDiv();
            b.appendChild(f);
            d.getClickTarget && d.getClickTarget().setAttribute("id", d.getId())
        }
        return b
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.setExpanded = function(a) {
        this.expanded_ !== a && ((this.expanded_ = a) ? (this.subcategoriesDiv_.style.display = "block",
        this.openIcon_(this.iconDom_)) : (this.subcategoriesDiv_.style.display = "none",
        this.closeIcon_(this.iconDom_)),
        (0,
        J.setState)(this.htmlDiv_, J.State.EXPANDED, a),
        this.parentToolbox_.handleToolboxItemResize())
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.setVisible_ = function(a) {
        this.htmlDiv_.style.display = a ? "block" : "none";
        for (var b = this.getChildToolboxItems(), c = 0; c < b.length; c++)
            b[c].setVisible_(a);
        this.isHidden_ = !a;
        this.parentToolbox_.getSelectedItem() === this && this.parentToolbox_.clearSelection()
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.isExpanded = function() {
        return this.expanded_
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.isCollapsible = function() {
        return !0
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.onClick = function(a) {
        this.toggleExpanded()
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.toggleExpanded = function() {
        this.setExpanded(!this.expanded_)
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.getDiv = function() {
        return this.htmlDiv_
    }
    ;
    sa.CollapsibleToolboxCategory.prototype.getChildToolboxItems = function() {
        return this.toolboxItems_
    }
    ;
    (0,
    r.register)(r.Type.TOOLBOX_ITEM, sa.CollapsibleToolboxCategory.registrationName, sa.CollapsibleToolboxCategory);
    var oc = {
        ToolboxItemSelect: function(a, b, c) {
            oc.ToolboxItemSelect.superClass_.constructor.call(this, c);
            this.oldItem = a;
            this.newItem = b
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(oc.ToolboxItemSelect, ob.UiBase);
    oc.ToolboxItemSelect.prototype.type = h.TOOLBOX_ITEM_SELECT;
    oc.ToolboxItemSelect.prototype.toJson = function() {
        var a = oc.ToolboxItemSelect.superClass_.toJson.call(this);
        a.oldItem = this.oldItem;
        a.newItem = this.newItem;
        return a
    }
    ;
    oc.ToolboxItemSelect.prototype.fromJson = function(a) {
        oc.ToolboxItemSelect.superClass_.fromJson.call(this, a);
        this.oldItem = a.oldItem;
        this.newItem = a.newItem
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.TOOLBOX_ITEM_SELECT, oc.ToolboxItemSelect);
    var S = {
        Toolbox: function(a) {
            S.Toolbox.superClass_.constructor.call(this);
            this.workspace_ = a;
            this.id = "toolbox";
            this.toolboxDef_ = a.options.languageTree || {
                contents: []
            };
            this.horizontalLayout_ = a.options.horizontalLayout;
            this.contentsDiv_ = this.HtmlDiv = null;
            this.isVisible_ = !1;
            this.contents_ = [];
            this.height_ = this.width_ = 0;
            this.RTL = a.options.RTL;
            this.flyout_ = null;
            this.contentMap_ = Object.create(null);
            this.toolboxPosition = a.options.toolboxPosition;
            this.previouslySelectedItem_ = this.selectedItem_ = null;
            this.boundEvents_ = []
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(S.Toolbox, vc.DeleteArea);
    S.Toolbox.prototype.onShortcut = function(a) {
        return !1
    }
    ;
    S.Toolbox.prototype.init = function() {
        var a = this.workspace_
          , b = a.getParentSvg();
        this.flyout_ = this.createFlyout_();
        this.HtmlDiv = this.createDom_(this.workspace_);
        (0,
        l.insertAfter)(this.flyout_.createDom("svg"), b);
        this.setVisible(!0);
        this.flyout_.init(a);
        this.render(this.toolboxDef_);
        a = a.getThemeManager();
        a.subscribe(this.HtmlDiv, "toolboxBackgroundColour", "background-color");
        a.subscribe(this.HtmlDiv, "toolboxForegroundColour", "color");
        this.workspace_.getComponentManager().addComponent({
            component: this,
            weight: 1,
            capabilities: [ia.Capability.AUTOHIDEABLE, ia.Capability.DELETE_AREA, ia.Capability.DRAG_TARGET]
        })
    }
    ;
    S.Toolbox.prototype.createDom_ = function(a) {
        a = a.getParentSvg();
        var b = this.createContainer_();
        this.contentsDiv_ = this.createContentsContainer_();
        this.contentsDiv_.tabIndex = 0;
        (0,
        J.setRole)(this.contentsDiv_, J.Role.TREE);
        b.appendChild(this.contentsDiv_);
        a.parentNode.insertBefore(b, a);
        this.attachEvents_(b, this.contentsDiv_);
        return b
    }
    ;
    S.Toolbox.prototype.createContainer_ = function() {
        var a = document.createElement("div");
        a.setAttribute("layout", this.isHorizontal() ? "h" : "v");
        (0,
        l.addClass)(a, "blocklyToolboxDiv");
        (0,
        l.addClass)(a, "blocklyNonSelectable");
        a.setAttribute("dir", this.RTL ? "RTL" : "LTR");
        return a
    }
    ;
    S.Toolbox.prototype.createContentsContainer_ = function() {
        var a = document.createElement("div");
        (0,
        l.addClass)(a, "blocklyToolboxContents");
        this.isHorizontal() && (a.style.flexDirection = "row");
        return a
    }
    ;
    S.Toolbox.prototype.attachEvents_ = function(a, b) {
        a = (0,
        u.conditionalBind)(a, "click", this, this.onClick_, !1, !0);
        this.boundEvents_.push(a);
        b = (0,
        u.conditionalBind)(b, "keydown", this, this.onKeyDown_, !1, !0);
        this.boundEvents_.push(b)
    }
    ;
    S.Toolbox.prototype.onClick_ = function(a) {
        if ((0,
        u.isRightButton)(a) || a.target === this.HtmlDiv)
            (0,
            e.module$exports$Blockly$common.getMainWorkspace)().hideChaff(!1);
        else {
            var b = a.target.getAttribute("id");
            b && (b = this.getToolboxItemById(b),
            b.isSelectable() && (this.setSelectedItem(b),
            b.onClick(a)));
            (0,
            e.module$exports$Blockly$common.getMainWorkspace)().hideChaff(!0)
        }
        (0,
        N.clearTouchIdentifier)()
    }
    ;
    S.Toolbox.prototype.onKeyDown_ = function(a) {
        var b = !1;
        switch (a.keyCode) {
        case H.DOWN:
            b = this.selectNext_();
            break;
        case H.UP:
            b = this.selectPrevious_();
            break;
        case H.LEFT:
            b = this.selectParent_();
            break;
        case H.RIGHT:
            b = this.selectChild_();
            break;
        case H.ENTER:
        case H.SPACE:
            this.selectedItem_ && this.selectedItem_.isCollapsible() && (this.selectedItem_.toggleExpanded(),
            b = !0);
            break;
        default:
            b = !1
        }
        !b && this.selectedItem_ && this.selectedItem_.onKeyDown && (b = this.selectedItem_.onKeyDown(a));
        b && a.preventDefault()
    }
    ;
    S.Toolbox.prototype.createFlyout_ = function() {
        var a = this.workspace_
          , b = new gb.Options({
            parentWorkspace: a,
            rtl: a.RTL,
            oneBasedIndex: a.options.oneBasedIndex,
            horizontalLayout: a.horizontalLayout,
            renderer: a.options.renderer,
            rendererOverrides: a.options.rendererOverrides,
            move: {
                scrollbars: !0
            }
        });
        b.toolboxPosition = a.options.toolboxPosition;
        return new (a.horizontalLayout ? (0,
        r.getClassFromOptions)(r.Type.FLYOUTS_HORIZONTAL_TOOLBOX, a.options, !0) : (0,
        r.getClassFromOptions)(r.Type.FLYOUTS_VERTICAL_TOOLBOX, a.options, !0))(b)
    }
    ;
    S.Toolbox.prototype.render = function(a) {
        this.toolboxDef_ = a;
        for (var b = 0; b < this.contents_.length; b++) {
            var c = this.contents_[b];
            c && c.dispose()
        }
        this.contents_ = [];
        this.contentMap_ = Object.create(null);
        this.renderContents_(a.contents);
        this.position();
        this.handleToolboxItemResize()
    }
    ;
    S.Toolbox.prototype.renderContents_ = function(a) {
        for (var b = document.createDocumentFragment(), c = 0; c < a.length; c++)
            this.createToolboxItem_(a[c], b);
        this.contentsDiv_.appendChild(b)
    }
    ;
    S.Toolbox.prototype.createToolboxItem_ = function(a, b) {
        var c = a.kind;
        "CATEGORY" === c.toUpperCase() && (0,
        Q.isCategoryCollapsible)(a) && (c = sa.CollapsibleToolboxCategory.registrationName);
        if (c = (0,
        r.getClass)(r.Type.TOOLBOX_ITEM, c.toLowerCase()))
            a = new c(a,this),
            this.addToolboxItem_(a),
            a.init(),
            (c = a.getDiv()) && b.appendChild(c),
            a.getClickTarget && a.getClickTarget().setAttribute("id", a.getId())
    }
    ;
    S.Toolbox.prototype.addToolboxItem_ = function(a) {
        this.contents_.push(a);
        this.contentMap_[a.getId()] = a;
        if (a.isCollapsible()) {
            a = a.getChildToolboxItems();
            for (var b = 0; b < a.length; b++)
                this.addToolboxItem_(a[b])
        }
    }
    ;
    S.Toolbox.prototype.getToolboxItems = function() {
        return this.contents_
    }
    ;
    S.Toolbox.prototype.addStyle = function(a) {
        (0,
        l.addClass)(this.HtmlDiv, a)
    }
    ;
    S.Toolbox.prototype.removeStyle = function(a) {
        (0,
        l.removeClass)(this.HtmlDiv, a)
    }
    ;
    S.Toolbox.prototype.getClientRect = function() {
        if (!this.HtmlDiv || !this.isVisible_)
            return null;
        var a = this.HtmlDiv.getBoundingClientRect()
          , b = a.top
          , c = b + a.height
          , d = a.left;
        a = d + a.width;
        return this.toolboxPosition === Q.Position.TOP ? new Aa(-1E7,c,-1E7,1E7) : this.toolboxPosition === Q.Position.BOTTOM ? new Aa(b,1E7,-1E7,1E7) : this.toolboxPosition === Q.Position.LEFT ? new Aa(-1E7,1E7,-1E7,a) : new Aa(-1E7,1E7,d,1E7)
    }
    ;
    S.Toolbox.prototype.wouldDelete = function(a, b) {
        a instanceof z.BlockSvg ? this.updateWouldDelete_(!a.getParent() && a.isDeletable()) : this.updateWouldDelete_(a.isDeletable());
        return this.wouldDelete_
    }
    ;
    S.Toolbox.prototype.onDragEnter = function(a) {
        this.updateCursorDeleteStyle_(!0)
    }
    ;
    S.Toolbox.prototype.onDragExit = function(a) {
        this.updateCursorDeleteStyle_(!1)
    }
    ;
    S.Toolbox.prototype.onDrop = function(a) {
        this.updateCursorDeleteStyle_(!1)
    }
    ;
    S.Toolbox.prototype.updateWouldDelete_ = function(a) {
        a !== this.wouldDelete_ && (this.updateCursorDeleteStyle_(!1),
        this.wouldDelete_ = a,
        this.updateCursorDeleteStyle_(!0))
    }
    ;
    S.Toolbox.prototype.updateCursorDeleteStyle_ = function(a) {
        var b = this.wouldDelete_ ? "blocklyToolboxDelete" : "blocklyToolboxGrab";
        a ? this.addStyle(b) : this.removeStyle(b)
    }
    ;
    S.Toolbox.prototype.getToolboxItemById = function(a) {
        return this.contentMap_[a] || null
    }
    ;
    S.Toolbox.prototype.getWidth = function() {
        return this.width_
    }
    ;
    S.Toolbox.prototype.getHeight = function() {
        return this.height_
    }
    ;
    S.Toolbox.prototype.getFlyout = function() {
        return this.flyout_
    }
    ;
    S.Toolbox.prototype.getWorkspace = function() {
        return this.workspace_
    }
    ;
    S.Toolbox.prototype.getSelectedItem = function() {
        return this.selectedItem_
    }
    ;
    S.Toolbox.prototype.getPreviouslySelectedItem = function() {
        return this.previouslySelectedItem_
    }
    ;
    S.Toolbox.prototype.isHorizontal = function() {
        return this.horizontalLayout_
    }
    ;
    S.Toolbox.prototype.position = function() {
        var a = this.workspace_.getMetrics()
          , b = this.HtmlDiv;
        b && (this.horizontalLayout_ ? (b.style.left = "0",
        b.style.height = "auto",
        b.style.width = "100%",
        this.height_ = b.offsetHeight,
        this.width_ = a.viewWidth,
        this.toolboxPosition === Q.Position.TOP ? b.style.top = "0" : b.style.bottom = "0") : (this.toolboxPosition === Q.Position.RIGHT ? b.style.right = "0" : b.style.left = "0",
        b.style.height = "100%",
        this.width_ = b.offsetWidth,
        this.height_ = a.viewHeight),
        this.flyout_.position())
    }
    ;
    S.Toolbox.prototype.handleToolboxItemResize = function() {
        var a = this.workspace_
          , b = this.HtmlDiv.getBoundingClientRect();
        a.translate(this.toolboxPosition === Q.Position.LEFT ? a.scrollX + b.width : a.scrollX, this.toolboxPosition === Q.Position.TOP ? a.scrollY + b.height : a.scrollY);
        (0,
        e.module$exports$Blockly$common.svgResize)(a)
    }
    ;
    S.Toolbox.prototype.clearSelection = function() {
        this.setSelectedItem(null)
    }
    ;
    S.Toolbox.prototype.refreshTheme = function() {
        for (var a = 0; a < this.contents_.length; a++) {
            var b = this.contents_[a];
            b.refreshTheme && b.refreshTheme()
        }
    }
    ;
    S.Toolbox.prototype.refreshSelection = function() {
        this.selectedItem_ && this.selectedItem_.isSelectable() && this.selectedItem_.getContents().length && this.flyout_.show(this.selectedItem_.getContents())
    }
    ;
    S.Toolbox.prototype.setVisible = function(a) {
        this.isVisible_ !== a && (this.HtmlDiv.style.display = a ? "block" : "none",
        this.isVisible_ = a,
        this.workspace_.recordDragTargets())
    }
    ;
    S.Toolbox.prototype.autoHide = function(a) {
        !a && this.flyout_ && this.flyout_.autoClose && this.clearSelection()
    }
    ;
    S.Toolbox.prototype.setSelectedItem = function(a) {
        var b = this.selectedItem_;
        !a && !b || a && !a.isSelectable() || (this.shouldDeselectItem_(b, a) && null !== b && this.deselectItem_(b),
        this.shouldSelectItem_(b, a) && null !== a && this.selectItem_(b, a),
        this.updateFlyout_(b, a),
        this.fireSelectEvent_(b, a))
    }
    ;
    S.Toolbox.prototype.shouldDeselectItem_ = function(a, b) {
        return null !== a && (!a.isCollapsible() || a !== b)
    }
    ;
    S.Toolbox.prototype.shouldSelectItem_ = function(a, b) {
        return null !== b && b !== a
    }
    ;
    S.Toolbox.prototype.deselectItem_ = function(a) {
        this.selectedItem_ = null;
        this.previouslySelectedItem_ = a;
        a.setSelected(!1);
        (0,
        J.setState)(this.contentsDiv_, J.State.ACTIVEDESCENDANT, "")
    }
    ;
    S.Toolbox.prototype.selectItem_ = function(a, b) {
        this.selectedItem_ = b;
        this.previouslySelectedItem_ = a;
        b.setSelected(!0);
        (0,
        J.setState)(this.contentsDiv_, J.State.ACTIVEDESCENDANT, b.getId())
    }
    ;
    S.Toolbox.prototype.selectItemByPosition = function(a) {
        -1 < a && a < this.contents_.length && (a = this.contents_[a],
        a.isSelectable() && this.setSelectedItem(a))
    }
    ;
    S.Toolbox.prototype.updateFlyout_ = function(a, b) {
        b && (a !== b || b.isCollapsible()) && b.getContents().length ? (this.flyout_.show(b.getContents()),
        this.flyout_.scrollToStart()) : this.flyout_.hide()
    }
    ;
    S.Toolbox.prototype.fireSelectEvent_ = function(a, b) {
        var c = a && a.getName()
          , d = b && b.getName();
        a === b && (d = null);
        a = new ((0,
        h.get)(h.TOOLBOX_ITEM_SELECT))(c,d,this.workspace_.id);
        (0,
        h.fire)(a)
    }
    ;
    S.Toolbox.prototype.selectParent_ = function() {
        return this.selectedItem_ ? this.selectedItem_.isCollapsible() && this.selectedItem_.isExpanded() ? (this.selectedItem_.setExpanded(!1),
        !0) : this.selectedItem_.getParent() && this.selectedItem_.getParent().isSelectable() ? (this.setSelectedItem(this.selectedItem_.getParent()),
        !0) : !1 : !1
    }
    ;
    S.Toolbox.prototype.selectChild_ = function() {
        if (!this.selectedItem_ || !this.selectedItem_.isCollapsible())
            return !1;
        var a = this.selectedItem_;
        a.isExpanded() ? this.selectNext_() : a.setExpanded(!0);
        return !0
    }
    ;
    S.Toolbox.prototype.selectNext_ = function() {
        if (!this.selectedItem_)
            return !1;
        var a = this.contents_.indexOf(this.selectedItem_) + 1;
        if (-1 < a && a < this.contents_.length) {
            for (var b = this.contents_[a]; b && !b.isSelectable(); )
                b = this.contents_[++a];
            if (b && b.isSelectable())
                return this.setSelectedItem(b),
                !0
        }
        return !1
    }
    ;
    S.Toolbox.prototype.selectPrevious_ = function() {
        if (!this.selectedItem_)
            return !1;
        var a = this.contents_.indexOf(this.selectedItem_) - 1;
        if (-1 < a && a < this.contents_.length) {
            for (var b = this.contents_[a]; b && !b.isSelectable(); )
                b = this.contents_[--a];
            if (b && b.isSelectable())
                return this.setSelectedItem(b),
                !0
        }
        return !1
    }
    ;
    S.Toolbox.prototype.dispose = function() {
        this.workspace_.getComponentManager().removeComponent("toolbox");
        this.flyout_.dispose();
        for (var a = 0; a < this.contents_.length; a++)
            this.contents_[a].dispose();
        for (a = 0; a < this.boundEvents_.length; a++)
            (0,
            u.unbind)(this.boundEvents_[a]);
        this.boundEvents_ = [];
        this.contents_ = [];
        this.workspace_.getThemeManager().unsubscribe(this.HtmlDiv);
        (0,
        l.removeNode)(this.HtmlDiv)
    }
    ;
    (0,
    Ia.register)('\n  .blocklyToolboxDelete {\n    cursor: url("<<<PATH>>>/handdelete.cur"), auto;\n  }\n\n  .blocklyToolboxGrab {\n    cursor: url("<<<PATH>>>/handclosed.cur"), auto;\n    cursor: grabbing;\n    cursor: -webkit-grabbing;\n  }\n\n  /* Category tree in Toolbox. */\n  .blocklyToolboxDiv {\n    background-color: #ddd;\n    overflow-x: visible;\n    overflow-y: auto;\n    padding: 4px 0 4px 0;\n    position: absolute;\n    z-index: 70;  /* so blocks go under toolbox when dragging */\n    -webkit-tap-highlight-color: transparent;  /* issue #1345 */\n  }\n\n  .blocklyToolboxContents {\n    display: flex;\n    flex-wrap: wrap;\n    flex-direction: column;\n  }\n\n  .blocklyToolboxContents:focus {\n    outline: none;\n  }\n');
    (0,
    r.register)(r.Type.TOOLBOX, r.DEFAULT, S.Toolbox);
    var jb = {
        HorizontalFlyout: function(a) {
            jb.HorizontalFlyout.superClass_.constructor.call(this, a);
            this.horizontalLayout = !0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(jb.HorizontalFlyout, R.Flyout);
    jb.HorizontalFlyout.prototype.setMetrics_ = function(a) {
        if (this.isVisible()) {
            var b = this.workspace_.getMetricsManager()
              , c = b.getScrollMetrics()
              , d = b.getViewMetrics();
            b = b.getAbsoluteMetrics();
            "number" === typeof a.x && (this.workspace_.scrollX = -(c.left + (c.width - d.width) * a.x));
            this.workspace_.translate(this.workspace_.scrollX + b.left, this.workspace_.scrollY + b.top)
        }
    }
    ;
    jb.HorizontalFlyout.prototype.getX = function() {
        return 0
    }
    ;
    jb.HorizontalFlyout.prototype.getY = function() {
        if (!this.isVisible())
            return 0;
        var a = this.targetWorkspace.getMetricsManager()
          , b = a.getAbsoluteMetrics()
          , c = a.getViewMetrics();
        a = a.getToolboxMetrics();
        var d = this.toolboxPosition_ === Q.Position.TOP;
        return this.targetWorkspace.toolboxPosition === this.toolboxPosition_ ? this.targetWorkspace.getToolbox() ? d ? a.height : c.height - this.height_ : d ? 0 : c.height : d ? 0 : c.height + b.top - this.height_
    }
    ;
    jb.HorizontalFlyout.prototype.position = function() {
        if (this.isVisible() && this.targetWorkspace.isVisible()) {
            var a = this.targetWorkspace.getMetricsManager().getViewMetrics();
            this.width_ = a.width;
            this.setBackgroundPath_(a.width - 2 * this.CORNER_RADIUS, this.height_ - this.CORNER_RADIUS);
            a = this.getX();
            var b = this.getY();
            this.positionAt_(this.width_, this.height_, a, b)
        }
    }
    ;
    jb.HorizontalFlyout.prototype.setBackgroundPath_ = function(a, b) {
        var c = this.toolboxPosition_ === Q.Position.TOP
          , d = ["M 0," + (c ? 0 : this.CORNER_RADIUS)];
        c ? (d.push("h", a + 2 * this.CORNER_RADIUS),
        d.push("v", b),
        d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, this.CORNER_RADIUS),
        d.push("h", -a),
        d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, -this.CORNER_RADIUS, -this.CORNER_RADIUS)) : (d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, -this.CORNER_RADIUS),
        d.push("h", a),
        d.push("a", this.CORNER_RADIUS, this.CORNER_RADIUS, 0, 0, 1, this.CORNER_RADIUS, this.CORNER_RADIUS),
        d.push("v", b),
        d.push("h", -a - 2 * this.CORNER_RADIUS));
        d.push("z");
        this.svgBackground_.setAttribute("d", d.join(" "))
    }
    ;
    jb.HorizontalFlyout.prototype.scrollToStart = function() {
        this.workspace_.scrollbar.setX(this.RTL ? Infinity : 0)
    }
    ;
    jb.HorizontalFlyout.prototype.wheel_ = function(a) {
        var b = (0,
        u.getScrollDeltaPixels)(a);
        if (b = b.x || b.y) {
            var c = this.workspace_.getMetricsManager()
              , d = c.getScrollMetrics();
            b = c.getViewMetrics().left - d.left + b;
            this.workspace_.scrollbar.setX(b);
            (0,
            ma.hide)();
            y.hideWithoutAnimation()
        }
        a.preventDefault();
        a.stopPropagation()
    }
    ;
    jb.HorizontalFlyout.prototype.layout_ = function(a, b) {
        this.workspace_.scale = this.targetWorkspace.scale;
        var c = this.MARGIN
          , d = c + this.tabWidth_;
        this.RTL && (a = a.reverse());
        for (var f = 0, g; g = a[f]; f++)
            if ("block" === g.type) {
                g = g.block;
                for (var k = g.getDescendants(!1), n = 0, x; x = k[n]; n++)
                    x.isInFlyout = !0;
                g.render();
                k = g.getSvgRoot();
                n = g.getHeightWidth();
                x = g.outputConnection ? this.tabWidth_ : 0;
                x = this.RTL ? d + n.width : d - x;
                g.moveBy(x, c);
                x = this.createRect_(g, x, c, n, f);
                d += n.width + b[f];
                this.addBlockListeners_(k, g, x)
            } else
                "button" === g.type && (this.initFlyoutButton_(g.button, d, c),
                d += g.button.width + b[f])
    }
    ;
    jb.HorizontalFlyout.prototype.isDragTowardWorkspace = function(a) {
        a = Math.atan2(a.y, a.x) / Math.PI * 180;
        var b = this.dragAngleRange_;
        return a < 90 + b && a > 90 - b || a > -90 - b && a < -90 + b ? !0 : !1
    }
    ;
    jb.HorizontalFlyout.prototype.getClientRect = function() {
        if (!this.svgGroup_ || this.autoClose || !this.isVisible())
            return null;
        var a = this.svgGroup_.getBoundingClientRect()
          , b = a.top;
        return this.toolboxPosition_ === Q.Position.TOP ? new Aa(-1E9,b + a.height,-1E9,1E9) : new Aa(b,1E9,-1E9,1E9)
    }
    ;
    jb.HorizontalFlyout.prototype.reflowInternal_ = function() {
        this.workspace_.scale = this.getFlyoutScale();
        for (var a = 0, b = this.workspace_.getTopBlocks(!1), c = 0, d; d = b[c]; c++)
            a = Math.max(a, d.getHeightWidth().height);
        c = this.buttons_;
        d = 0;
        for (var f; f = c[d]; d++)
            a = Math.max(a, f.height);
        a += 1.5 * this.MARGIN;
        a *= this.workspace_.scale;
        a += G.Scrollbar.scrollbarThickness;
        if (this.height_ !== a) {
            for (c = 0; d = b[c]; c++)
                d.flyoutRect_ && this.moveRectToBlock_(d.flyoutRect_, d);
            this.targetWorkspace.toolboxPosition !== this.toolboxPosition_ || this.toolboxPosition_ !== Q.Position.TOP || this.targetWorkspace.getToolbox() || this.targetWorkspace.translate(this.targetWorkspace.scrollX, this.targetWorkspace.scrollY + a);
            this.height_ = a;
            this.position();
            this.targetWorkspace.recordDragTargets()
        }
    }
    ;
    (0,
    r.register)(r.Type.FLYOUTS_HORIZONTAL_TOOLBOX, r.DEFAULT, jb.HorizontalFlyout);
    e.module$exports$Blockly$Generator = {
        Generator: function(a) {
            this.name_ = a;
            this.FUNCTION_NAME_PLACEHOLDER_REGEXP_ = new RegExp(this.FUNCTION_NAME_PLACEHOLDER_,"g")
        }
    };
    e.module$exports$Blockly$Generator.Generator.prototype.INFINITE_LOOP_TRAP = null;
    e.module$exports$Blockly$Generator.Generator.prototype.STATEMENT_PREFIX = null;
    e.module$exports$Blockly$Generator.Generator.prototype.STATEMENT_SUFFIX = null;
    e.module$exports$Blockly$Generator.Generator.prototype.INDENT = "  ";
    e.module$exports$Blockly$Generator.Generator.prototype.COMMENT_WRAP = 60;
    e.module$exports$Blockly$Generator.Generator.prototype.ORDER_OVERRIDES = [];
    e.module$exports$Blockly$Generator.Generator.prototype.isInitialized = null;
    e.module$exports$Blockly$Generator.Generator.prototype.workspaceToCode = function(a) {
        a || (console.warn("No workspace specified in workspaceToCode call.  Guessing."),
        a = (0,
        e.module$exports$Blockly$common.getMainWorkspace)());
        var b = [];
        this.init(a);
        a = a.getTopBlocks(!0);
        for (var c = 0, d; d = a[c]; c++) {
            var f = this.blockToCode(d);
            Array.isArray(f) && (f = f[0]);
            f && (d.outputConnection && (f = this.scrubNakedValue(f),
            this.STATEMENT_PREFIX && !d.suppressPrefixSuffix && (f = this.injectId(this.STATEMENT_PREFIX, d) + f),
            this.STATEMENT_SUFFIX && !d.suppressPrefixSuffix && (f += this.injectId(this.STATEMENT_SUFFIX, d))),
            b.push(f))
        }
        b = b.join("\n");
        b = this.finish(b);
        b = b.replace(/^\s+\n/, "");
        b = b.replace(/\n\s+$/, "\n");
        return b.replace(/[ \t]+\n/g, "\n")
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.prefixLines = function(a, b) {
        return b + a.replace(/(?!\n$)\n/g, "\n" + b)
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.allNestedComments = function(a) {
        var b = [];
        a = a.getDescendants(!0);
        for (var c = 0; c < a.length; c++) {
            var d = a[c].getCommentText();
            d && b.push(d)
        }
        b.length && b.push("");
        return b.join("\n")
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.blockToCode = function(a, b) {
        !1 === this.isInitialized && console.warn("Generator init was not called before blockToCode was called.");
        if (!a)
            return "";
        if (!a.isEnabled())
            return b ? "" : this.blockToCode(a.getNextBlock());
        if (a.isInsertionMarker())
            return b ? "" : this.blockToCode(a.getChildren(!1)[0]);
        var c = this[a.type];
        if ("function" !== typeof c)
            throw Error('Language "' + this.name_ + '" does not know how to generate code for block type "' + a.type + '".');
        c = c.call(a, a);
        if (Array.isArray(c)) {
            if (!a.outputConnection)
                throw TypeError("Expecting string from statement block: " + a.type);
            return [this.scrub_(a, c[0], b), c[1]]
        }
        if ("string" === typeof c)
            return this.STATEMENT_PREFIX && !a.suppressPrefixSuffix && (c = this.injectId(this.STATEMENT_PREFIX, a) + c),
            this.STATEMENT_SUFFIX && !a.suppressPrefixSuffix && (c += this.injectId(this.STATEMENT_SUFFIX, a)),
            this.scrub_(a, c, b);
        if (null === c)
            return "";
        throw SyntaxError("Invalid code generated: " + c);
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.valueToCode = function(a, b, c) {
        if (isNaN(c))
            throw TypeError("Expecting valid order from block: " + a.type);
        var d = a.getInputTargetBlock(b);
        if (!d)
            return "";
        b = this.blockToCode(d);
        if ("" === b)
            return "";
        if (!Array.isArray(b))
            throw TypeError("Expecting tuple from value block: " + d.type);
        a = b[0];
        b = b[1];
        if (isNaN(b))
            throw TypeError("Expecting valid order from value block: " + d.type);
        if (!a)
            return "";
        d = !1;
        var f = Math.floor(c)
          , g = Math.floor(b);
        if (f <= g && (f !== g || 0 !== f && 99 !== f))
            for (d = !0,
            f = 0; f < this.ORDER_OVERRIDES.length; f++)
                if (this.ORDER_OVERRIDES[f][0] === c && this.ORDER_OVERRIDES[f][1] === b) {
                    d = !1;
                    break
                }
        d && (a = "(" + a + ")");
        return a
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.statementToCode = function(a, b) {
        a = a.getInputTargetBlock(b);
        b = this.blockToCode(a);
        if ("string" !== typeof b)
            throw TypeError("Expecting code from statement block: " + (a && a.type));
        b && (b = this.prefixLines(b, this.INDENT));
        return b
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.addLoopTrap = function(a, b) {
        this.INFINITE_LOOP_TRAP && (a = this.prefixLines(this.injectId(this.INFINITE_LOOP_TRAP, b), this.INDENT) + a);
        this.STATEMENT_SUFFIX && !b.suppressPrefixSuffix && (a = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, b), this.INDENT) + a);
        this.STATEMENT_PREFIX && !b.suppressPrefixSuffix && (a += this.prefixLines(this.injectId(this.STATEMENT_PREFIX, b), this.INDENT));
        return a
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.injectId = function(a, b) {
        b = b.id.replace(/\$/g, "$$$$");
        return a.replace(/%1/g, "'" + b + "'")
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.RESERVED_WORDS_ = "";
    e.module$exports$Blockly$Generator.Generator.prototype.addReservedWords = function(a) {
        this.RESERVED_WORDS_ += a + ","
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.FUNCTION_NAME_PLACEHOLDER_ = "{leCUI8hutHZI4480Dc}";
    Object.defineProperties(e.module$exports$Blockly$Generator.Generator.prototype, {
        variableDB_: {
            get: function() {
                (0,
                V.warn)("variableDB_", "May 2021", "May 2026", "nameDB_");
                return this.nameDB_
            },
            set: function(a) {
                (0,
                V.warn)("variableDB_", "May 2021", "May 2026", "nameDB_");
                this.nameDB_ = a
            }
        }
    });
    e.module$exports$Blockly$Generator.Generator.prototype.provideFunction_ = function(a, b) {
        if (!this.definitions_[a]) {
            var c = this.nameDB_.getDistinctName(a, e.module$exports$Blockly$Names.NameType.PROCEDURE);
            this.functionNames_[a] = c;
            b = b.join("\n").replace(this.FUNCTION_NAME_PLACEHOLDER_REGEXP_, c);
            for (var d; d !== b; )
                d = b,
                b = b.replace(/^(( {2})*) {2}/gm, "$1\x00");
            b = b.replace(/\0/g, this.INDENT);
            this.definitions_[a] = b
        }
        return this.functionNames_[a]
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.init = function(a) {
        this.definitions_ = Object.create(null);
        this.functionNames_ = Object.create(null)
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.scrub_ = function(a, b, c) {
        return b
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.finish = function(a) {
        delete this.definitions_;
        delete this.functionNames_;
        return a
    }
    ;
    e.module$exports$Blockly$Generator.Generator.prototype.scrubNakedValue = function(a) {
        return a
    }
    ;
    e.module$exports$Blockly$FieldDropdown = {
        FieldDropdown: function(a, b, c) {
            "function" !== typeof a && Le(a);
            this.menuGenerator_ = a;
            this.suffixField = this.prefixField = this.generatedOptions_ = null;
            this.trimOptions_();
            this.selectedOption_ = this.getOptions(!1)[0];
            e.module$exports$Blockly$FieldDropdown.FieldDropdown.superClass_.constructor.call(this, this.selectedOption_[1], b, c);
            this.svgArrow_ = this.arrow_ = this.imageElement_ = this.menu_ = this.selectedMenuItem_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$FieldDropdown.FieldDropdown, D);
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.fromJson = function(a) {
        return new this(a.options,void 0,a)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.fromXml = function(a) {
        this.isOptionListDynamic() && this.getOptions(!1);
        this.setValue(a.textContent)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.loadState = function(a) {
        this.loadLegacyState(e.module$exports$Blockly$FieldDropdown.FieldDropdown, a) || (this.isOptionListDynamic() && this.getOptions(!1),
        this.setValue(a))
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.SERIALIZABLE = !0;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.CHECKMARK_OVERHANG = 25;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.MAX_MENU_HEIGHT_VH = .45;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.ARROW_CHAR = O.ANDROID ? "\u25bc" : "\u25be";
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.CURSOR = "default";
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.initView = function() {
        this.shouldAddBorderRect_() ? this.createBorderRect_() : this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        this.createTextElement_();
        this.imageElement_ = (0,
        l.createSvgElement)(q.IMAGE, {}, this.fieldGroup_);
        this.getConstants().FIELD_DROPDOWN_SVG_ARROW ? this.createSVGArrow_() : this.createTextArrow_();
        this.borderRect_ && (0,
        l.addClass)(this.borderRect_, "blocklyDropdownRect")
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.shouldAddBorderRect_ = function() {
        return !this.getConstants().FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW || this.getConstants().FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW && !this.sourceBlock_.isShadow()
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.createTextArrow_ = function() {
        this.arrow_ = (0,
        l.createSvgElement)(q.TSPAN, {}, this.textElement_);
        this.arrow_.appendChild(document.createTextNode(this.sourceBlock_.RTL ? e.module$exports$Blockly$FieldDropdown.FieldDropdown.ARROW_CHAR + " " : " " + e.module$exports$Blockly$FieldDropdown.FieldDropdown.ARROW_CHAR));
        this.sourceBlock_.RTL ? this.textElement_.insertBefore(this.arrow_, this.textContent_) : this.textElement_.appendChild(this.arrow_)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.createSVGArrow_ = function() {
        this.svgArrow_ = (0,
        l.createSvgElement)(q.IMAGE, {
            height: this.getConstants().FIELD_DROPDOWN_SVG_ARROW_SIZE + "px",
            width: this.getConstants().FIELD_DROPDOWN_SVG_ARROW_SIZE + "px"
        }, this.fieldGroup_);
        this.svgArrow_.setAttributeNS(l.XLINK_NS, "xlink:href", this.getConstants().FIELD_DROPDOWN_SVG_ARROW_DATAURI)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.showEditor_ = function(a) {
        this.dropdownCreate_();
        this.menu_.openingCoords = a && "number" === typeof a.clientX ? new E(a.clientX,a.clientY) : null;
        y.clearContent();
        this.menu_.render(y.getContentDiv());
        a = this.menu_.getElement();
        (0,
        l.addClass)(a, "blocklyDropdownMenu");
        if (this.getConstants().FIELD_DROPDOWN_COLOURED_DIV) {
            a = this.sourceBlock_.isShadow() ? this.sourceBlock_.getParent().getColour() : this.sourceBlock_.getColour();
            var b = this.sourceBlock_.isShadow() ? this.sourceBlock_.getParent().style.colourTertiary : this.sourceBlock_.style.colourTertiary;
            y.setColour(a, b)
        }
        y.showPositionedByField(this, this.dropdownDispose_.bind(this));
        this.menu_.focus();
        this.selectedMenuItem_ && this.menu_.setHighlighted(this.selectedMenuItem_);
        this.applyColour()
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.dropdownCreate_ = function() {
        var a = new Fa;
        a.setRole(J.Role.LISTBOX);
        this.menu_ = a;
        var b = this.getOptions(!1);
        this.selectedMenuItem_ = null;
        for (var c = 0; c < b.length; c++) {
            var d = b[c][0]
              , f = b[c][1];
            if ("object" === typeof d) {
                var g = new Image(d.width,d.height);
                g.src = d.src;
                g.alt = d.alt || "";
                d = g
            }
            d = new Ya(d,f);
            d.setRole(J.Role.OPTION);
            d.setRightToLeft(this.sourceBlock_.RTL);
            d.setCheckable(!0);
            a.addChild(d);
            d.setChecked(f === this.value_);
            f === this.value_ && (this.selectedMenuItem_ = d);
            d.onAction(this.handleMenuActionEvent_, this)
        }
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.dropdownDispose_ = function() {
        this.menu_ && this.menu_.dispose();
        this.selectedMenuItem_ = this.menu_ = null;
        this.applyColour()
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.handleMenuActionEvent_ = function(a) {
        y.hideIfOwner(this, !0);
        this.onItemSelected_(this.menu_, a)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.onItemSelected_ = function(a, b) {
        this.setValue(b.getValue())
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.trimOptions_ = function() {
        var a = this.menuGenerator_;
        if (Array.isArray(a)) {
            for (var b = !1, c = 0; c < a.length; c++) {
                var d = a[c][0];
                "string" === typeof d ? a[c][0] = (0,
                da.replaceMessageReferences)(d) : (null !== d.alt && (a[c][0].alt = (0,
                da.replaceMessageReferences)(d.alt)),
                b = !0)
            }
            if (!(b || 2 > a.length)) {
                b = [];
                for (c = 0; c < a.length; c++)
                    b.push(a[c][0]);
                c = (0,
                e.module$exports$Blockly$utils$string.shortestStringLength)(b);
                d = (0,
                e.module$exports$Blockly$utils$string.commonWordPrefix)(b, c);
                var f = (0,
                e.module$exports$Blockly$utils$string.commonWordSuffix)(b, c);
                !d && !f || c <= d + f || (d && (this.prefixField = b[0].substring(0, d - 1)),
                f && (this.suffixField = b[0].substr(1 - f)),
                this.menuGenerator_ = e.module$exports$Blockly$FieldDropdown.FieldDropdown.applyTrim_(a, d, f))
            }
        }
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.applyTrim_ = function(a, b, c) {
        for (var d = [], f = 0; f < a.length; f++) {
            var g = a[f][0]
              , k = a[f][1];
            g = g.substring(b, g.length - c);
            d[f] = [g, k]
        }
        return d
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.isOptionListDynamic = function() {
        return "function" === typeof this.menuGenerator_
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.getOptions = function(a) {
        return this.isOptionListDynamic() ? (this.generatedOptions_ && a || (this.generatedOptions_ = this.menuGenerator_.call(this),
        Le(this.generatedOptions_)),
        this.generatedOptions_) : this.menuGenerator_
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.doClassValidation_ = function(a) {
        for (var b = !1, c = this.getOptions(!0), d = 0, f; f = c[d]; d++)
            if (f[1] === a) {
                b = !0;
                break
            }
        return b ? a : (this.sourceBlock_ && console.warn("Cannot set the dropdown's value to an unavailable option. Block type: " + this.sourceBlock_.type + ", Field name: " + this.name + ", Value: " + a),
        null)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.doValueUpdate_ = function(a) {
        e.module$exports$Blockly$FieldDropdown.FieldDropdown.superClass_.doValueUpdate_.call(this, a);
        a = this.getOptions(!0);
        for (var b = 0, c; c = a[b]; b++)
            c[1] === this.value_ && (this.selectedOption_ = c)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.applyColour = function() {
        this.borderRect_ && (this.borderRect_.setAttribute("stroke", this.sourceBlock_.style.colourTertiary),
        this.menu_ ? this.borderRect_.setAttribute("fill", this.sourceBlock_.style.colourTertiary) : this.borderRect_.setAttribute("fill", "transparent"));
        this.sourceBlock_ && this.arrow_ && (this.sourceBlock_.isShadow() ? this.arrow_.style.fill = this.sourceBlock_.style.colourSecondary : this.arrow_.style.fill = this.sourceBlock_.style.colourPrimary)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.render_ = function() {
        this.textContent_.nodeValue = "";
        this.imageElement_.style.display = "none";
        var a = this.selectedOption_ && this.selectedOption_[0];
        a && "object" === typeof a ? this.renderSelectedImage_(a) : this.renderSelectedText_();
        this.positionBorderRect_()
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.renderSelectedImage_ = function(a) {
        this.imageElement_.style.display = "";
        this.imageElement_.setAttributeNS(l.XLINK_NS, "xlink:href", a.src);
        this.imageElement_.setAttribute("height", a.height);
        this.imageElement_.setAttribute("width", a.width);
        var b = Number(a.height);
        a = Number(a.width);
        var c = !!this.borderRect_
          , d = Math.max(c ? this.getConstants().FIELD_DROPDOWN_BORDER_RECT_HEIGHT : 0, b + 10);
        c = c ? this.getConstants().FIELD_BORDER_RECT_X_PADDING : 0;
        var f = this.svgArrow_ ? this.positionSVGArrow_(a + c, d / 2 - this.getConstants().FIELD_DROPDOWN_SVG_ARROW_SIZE / 2) : (0,
        l.getFastTextWidth)(this.arrow_, this.getConstants().FIELD_TEXT_FONTSIZE, this.getConstants().FIELD_TEXT_FONTWEIGHT, this.getConstants().FIELD_TEXT_FONTFAMILY);
        this.size_.width = a + f + 2 * c;
        this.size_.height = d;
        var g = 0;
        this.sourceBlock_.RTL ? this.imageElement_.setAttribute("x", c + f) : (g = a + f,
        this.textElement_.setAttribute("text-anchor", "end"),
        this.imageElement_.setAttribute("x", c));
        this.imageElement_.setAttribute("y", d / 2 - b / 2);
        this.positionTextElement_(g + c, a + f)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.renderSelectedText_ = function() {
        this.textContent_.nodeValue = this.getDisplayText_();
        (0,
        l.addClass)(this.textElement_, "blocklyDropdownText");
        this.textElement_.setAttribute("text-anchor", "start");
        var a = !!this.borderRect_
          , b = Math.max(a ? this.getConstants().FIELD_DROPDOWN_BORDER_RECT_HEIGHT : 0, this.getConstants().FIELD_TEXT_HEIGHT)
          , c = (0,
        l.getFastTextWidth)(this.textElement_, this.getConstants().FIELD_TEXT_FONTSIZE, this.getConstants().FIELD_TEXT_FONTWEIGHT, this.getConstants().FIELD_TEXT_FONTFAMILY);
        a = a ? this.getConstants().FIELD_BORDER_RECT_X_PADDING : 0;
        var d = 0;
        this.svgArrow_ && (d = this.positionSVGArrow_(c + a, b / 2 - this.getConstants().FIELD_DROPDOWN_SVG_ARROW_SIZE / 2));
        this.size_.width = c + d + 2 * a;
        this.size_.height = b;
        this.positionTextElement_(a, c)
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.positionSVGArrow_ = function(a, b) {
        if (!this.svgArrow_)
            return 0;
        var c = this.borderRect_ ? this.getConstants().FIELD_BORDER_RECT_X_PADDING : 0
          , d = this.getConstants().FIELD_DROPDOWN_SVG_ARROW_PADDING
          , f = this.getConstants().FIELD_DROPDOWN_SVG_ARROW_SIZE;
        this.svgArrow_.setAttribute("transform", "translate(" + (this.sourceBlock_.RTL ? c : a + d) + "," + b + ")");
        return f + d
    }
    ;
    e.module$exports$Blockly$FieldDropdown.FieldDropdown.prototype.getText_ = function() {
        if (!this.selectedOption_)
            return null;
        var a = this.selectedOption_[0];
        return "object" === typeof a ? a.alt : a
    }
    ;
    var Le = function(a) {
        if (!Array.isArray(a))
            throw TypeError("FieldDropdown options must be an array.");
        if (!a.length)
            throw TypeError("FieldDropdown options must not be an empty array.");
        for (var b = !1, c = 0; c < a.length; c++) {
            var d = a[c];
            Array.isArray(d) ? "string" !== typeof d[1] ? (b = !0,
            console.error("Invalid option[" + c + "]: Each FieldDropdown option id must be a string. Found " + d[1] + " in: ", d)) : d[0] && "string" !== typeof d[0] && "string" !== typeof d[0].src && (b = !0,
            console.error("Invalid option[" + c + "]: Each FieldDropdown option must have a string label or image description. Found" + d[0] + " in: ", d)) : (b = !0,
            console.error("Invalid option[" + c + "]: Each FieldDropdown option must be an array. Found: ", d))
        }
        if (b)
            throw TypeError("Found invalid FieldDropdown options.");
    };
    (0,
    mb.register)("field_dropdown", e.module$exports$Blockly$FieldDropdown.FieldDropdown);
    var ka = {
        FieldVariable: function(a, b, c, d, f) {
            this.menuGenerator_ = ka.FieldVariable.dropdownCreate;
            this.defaultVariableName = "string" === typeof a ? a : "";
            this.size_ = new Ja(0,0);
            f && this.configure_(f);
            b && this.setValidator(b);
            f || this.setTypes_(c, d)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ka.FieldVariable, e.module$exports$Blockly$FieldDropdown.FieldDropdown);
    ka.FieldVariable.fromJson = function(a) {
        return new this((0,
        da.replaceMessageReferences)(a.variable),void 0,void 0,void 0,a)
    }
    ;
    ka.FieldVariable.prototype.SERIALIZABLE = !0;
    ka.FieldVariable.prototype.configure_ = function(a) {
        ka.FieldVariable.superClass_.configure_.call(this, a);
        this.setTypes_(a.variableTypes, a.defaultType)
    }
    ;
    ka.FieldVariable.prototype.initModel = function() {
        if (!this.variable_) {
            var a = (0,
            e.module$exports$Blockly$Variables.getOrCreateVariablePackage)(this.sourceBlock_.workspace, null, this.defaultVariableName, this.defaultType_);
            this.doValueUpdate_(a.getId())
        }
    }
    ;
    ka.FieldVariable.prototype.shouldAddBorderRect_ = function() {
        return ka.FieldVariable.superClass_.shouldAddBorderRect_.call(this) && (!this.getConstants().FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW || "variables_get" !== this.sourceBlock_.type)
    }
    ;
    ka.FieldVariable.prototype.fromXml = function(a) {
        var b = a.getAttribute("id")
          , c = a.textContent
          , d = a.getAttribute("variabletype") || a.getAttribute("variableType") || "";
        b = (0,
        e.module$exports$Blockly$Variables.getOrCreateVariablePackage)(this.sourceBlock_.workspace, b, c, d);
        if (null !== d && d !== b.type)
            throw Error("Serialized variable type with id '" + b.getId() + "' had type " + b.type + ", and does not match variable field that references it: " + (0,
            e.module$exports$Blockly$Xml.domToText)(a) + ".");
        this.setValue(b.getId())
    }
    ;
    ka.FieldVariable.prototype.toXml = function(a) {
        this.initModel();
        a.id = this.variable_.getId();
        a.textContent = this.variable_.name;
        this.variable_.type && a.setAttribute("variabletype", this.variable_.type);
        return a
    }
    ;
    ka.FieldVariable.prototype.saveState = function(a) {
        var b = this.saveLegacyState(ka.FieldVariable);
        if (null !== b)
            return b;
        this.initModel();
        b = {
            id: this.variable_.getId()
        };
        a && (b.name = this.variable_.name,
        b.type = this.variable_.type);
        return b
    }
    ;
    ka.FieldVariable.prototype.loadState = function(a) {
        this.loadLegacyState(ka.FieldVariable, a) || (a = (0,
        e.module$exports$Blockly$Variables.getOrCreateVariablePackage)(this.sourceBlock_.workspace, a.id || null, a.name, a.type || ""),
        this.setValue(a.getId()))
    }
    ;
    ka.FieldVariable.prototype.setSourceBlock = function(a) {
        if (a.isShadow())
            throw Error("Variable fields are not allowed to exist on shadow blocks.");
        ka.FieldVariable.superClass_.setSourceBlock.call(this, a)
    }
    ;
    ka.FieldVariable.prototype.getValue = function() {
        return this.variable_ ? this.variable_.getId() : null
    }
    ;
    ka.FieldVariable.prototype.getText = function() {
        return this.variable_ ? this.variable_.name : ""
    }
    ;
    ka.FieldVariable.prototype.getVariable = function() {
        return this.variable_
    }
    ;
    ka.FieldVariable.prototype.getValidator = function() {
        return this.variable_ ? this.validator_ : null
    }
    ;
    ka.FieldVariable.prototype.doClassValidation_ = function(a) {
        if (null === a)
            return null;
        var b = (0,
        e.module$exports$Blockly$Variables.getVariable)(this.sourceBlock_.workspace, a);
        if (!b)
            return console.warn("Variable id doesn't point to a real variable! ID was " + a),
            null;
        b = b.type;
        return this.typeIsAllowed_(b) ? a : (console.warn("Variable type doesn't match this field!  Type was " + b),
        null)
    }
    ;
    ka.FieldVariable.prototype.doValueUpdate_ = function(a) {
        this.variable_ = (0,
        e.module$exports$Blockly$Variables.getVariable)(this.sourceBlock_.workspace, a);
        ka.FieldVariable.superClass_.doValueUpdate_.call(this, a)
    }
    ;
    ka.FieldVariable.prototype.typeIsAllowed_ = function(a) {
        var b = this.getVariableTypes_();
        if (!b)
            return !0;
        for (var c = 0; c < b.length; c++)
            if (a === b[c])
                return !0;
        return !1
    }
    ;
    ka.FieldVariable.prototype.getVariableTypes_ = function() {
        var a = this.variableTypes;
        if (null === a && this.sourceBlock_ && this.sourceBlock_.workspace)
            return this.sourceBlock_.workspace.getVariableTypes();
        a = a || [""];
        if (0 === a.length)
            throw a = this.getText(),
            Error("'variableTypes' of field variable " + a + " was an empty list");
        return a
    }
    ;
    ka.FieldVariable.prototype.setTypes_ = function(a, b) {
        b = b || "";
        if (null === a || void 0 === a)
            a = null;
        else if (Array.isArray(a)) {
            for (var c = !1, d = 0; d < a.length; d++)
                a[d] === b && (c = !0);
            if (!c)
                throw Error("Invalid default type '" + b + "' in the definition of a FieldVariable");
        } else
            throw Error("'variableTypes' was not an array in the definition of a FieldVariable");
        this.defaultType_ = b;
        this.variableTypes = a
    }
    ;
    ka.FieldVariable.prototype.refreshVariableName = function() {
        this.forceRerender()
    }
    ;
    ka.FieldVariable.dropdownCreate = function() {
        if (!this.variable_)
            throw Error("Tried to call dropdownCreate on a variable field with no variable selected.");
        var a = this.getText()
          , b = [];
        if (this.sourceBlock_ && this.sourceBlock_.workspace)
            for (var c = this.getVariableTypes_(), d = 0; d < c.length; d++) {
                var f = this.sourceBlock_.workspace.getVariablesOfType(c[d]);
                b = b.concat(f)
            }
        b.sort(yc.compareByName);
        c = [];
        for (d = 0; d < b.length; d++)
            c[d] = [b[d].name, b[d].getId()];
        c.push([e.module$exports$Blockly$Msg.Msg.RENAME_VARIABLE, e.module$exports$Blockly$internalConstants.RENAME_VARIABLE_ID]);
        e.module$exports$Blockly$Msg.Msg.DELETE_VARIABLE && c.push([e.module$exports$Blockly$Msg.Msg.DELETE_VARIABLE.replace("%1", a), e.module$exports$Blockly$internalConstants.DELETE_VARIABLE_ID]);
        return c
    }
    ;
    ka.FieldVariable.prototype.onItemSelected_ = function(a, b) {
        a = b.getValue();
        if (this.sourceBlock_ && this.sourceBlock_.workspace) {
            if (a === e.module$exports$Blockly$internalConstants.RENAME_VARIABLE_ID) {
                (0,
                e.module$exports$Blockly$Variables.renameVariable)(this.sourceBlock_.workspace, this.variable_);
                return
            }
            if (a === e.module$exports$Blockly$internalConstants.DELETE_VARIABLE_ID) {
                this.sourceBlock_.workspace.deleteVariableById(this.variable_.getId());
                return
            }
        }
        this.setValue(a)
    }
    ;
    ka.FieldVariable.prototype.referencesVariables = function() {
        return !0
    }
    ;
    (0,
    mb.register)("field_variable", ka.FieldVariable);
    e.module$exports$Blockly$FieldTextInput = {
        FieldTextInput: function(a, b, c) {
            this.spellcheck_ = !0;
            e.module$exports$Blockly$FieldTextInput.FieldTextInput.superClass_.constructor.call(this, a, b, c);
            this.onKeyInputWrapper_ = this.onKeyDownWrapper_ = this.htmlInput_ = null;
            this.fullBlockClickTarget_ = !1;
            this.workspace_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$FieldTextInput.FieldTextInput, D);
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.DEFAULT_VALUE = "";
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.fromJson = function(a) {
        return new this((0,
        da.replaceMessageReferences)(a.text),void 0,a)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.SERIALIZABLE = !0;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.BORDERRADIUS = 4;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.CURSOR = "text";
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.configure_ = function(a) {
        e.module$exports$Blockly$FieldTextInput.FieldTextInput.superClass_.configure_.call(this, a);
        "boolean" === typeof a.spellcheck && (this.spellcheck_ = a.spellcheck)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.initView = function() {
        if (this.getConstants().FULL_BLOCK_FIELDS) {
            for (var a = 0, b = 0, c = 0, d; d = this.sourceBlock_.inputList[c]; c++) {
                for (var f = 0; d.fieldRow[f]; f++)
                    a++;
                d.connection && b++
            }
            this.fullBlockClickTarget_ = 1 >= a && this.sourceBlock_.outputConnection && !b
        } else
            this.fullBlockClickTarget_ = !1;
        this.fullBlockClickTarget_ ? this.clickTarget_ = this.sourceBlock_.getSvgRoot() : this.createBorderRect_();
        this.createTextElement_()
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.doClassValidation_ = function(a) {
        return null === a || void 0 === a ? null : String(a)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.doValueInvalid_ = function(a) {
        this.isBeingEdited_ && (this.isTextValid_ = !1,
        a = this.value_,
        this.value_ = this.htmlInput_.untypedDefaultValue_,
        this.sourceBlock_ && (0,
        h.isEnabled)() && (0,
        h.fire)(new ((0,
        h.get)(h.CHANGE))(this.sourceBlock_,"field",this.name || null,a,this.value_)))
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.doValueUpdate_ = function(a) {
        this.isTextValid_ = !0;
        this.value_ = a;
        this.isBeingEdited_ || (this.isDirty_ = !0)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.applyColour = function() {
        this.sourceBlock_ && this.getConstants().FULL_BLOCK_FIELDS && (this.borderRect_ ? this.borderRect_.setAttribute("stroke", this.sourceBlock_.style.colourTertiary) : this.sourceBlock_.pathObject.svgPath.setAttribute("fill", this.getConstants().FIELD_BORDER_RECT_COLOUR))
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.render_ = function() {
        e.module$exports$Blockly$FieldTextInput.FieldTextInput.superClass_.render_.call(this);
        if (this.isBeingEdited_) {
            this.resizeEditor_();
            var a = this.htmlInput_;
            this.isTextValid_ ? ((0,
            l.removeClass)(a, "blocklyInvalidInput"),
            (0,
            J.setState)(a, J.State.INVALID, !1)) : ((0,
            l.addClass)(a, "blocklyInvalidInput"),
            (0,
            J.setState)(a, J.State.INVALID, !0))
        }
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.setSpellcheck = function(a) {
        a !== this.spellcheck_ && (this.spellcheck_ = a,
        this.htmlInput_ && this.htmlInput_.setAttribute("spellcheck", this.spellcheck_))
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.showEditor_ = function(a, b) {
        this.workspace_ = this.sourceBlock_.workspace;
        a = b || !1;
        !a && (O.MOBILE || O.ANDROID || O.IPAD) ? this.showPromptEditor_() : this.showInlineEditor_(a)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.showPromptEditor_ = function() {
        (0,
        Oa.prompt)(e.module$exports$Blockly$Msg.Msg.CHANGE_VALUE_TITLE, this.getText(), function(a) {
            null !== a && this.setValue(this.getValueFromEditorText_(a))
        }
        .bind(this))
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.showInlineEditor_ = function(a) {
        (0,
        ma.show)(this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
        this.htmlInput_ = this.widgetCreate_();
        this.isBeingEdited_ = !0;
        a || (this.htmlInput_.focus({
            preventScroll: !0
        }),
        this.htmlInput_.select())
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.widgetCreate_ = function() {
        (0,
        h.setGroup)(!0);
        var a = (0,
        ma.getDiv)();
        (0,
        l.addClass)(this.getClickTarget_(), "editing");
        var b = document.createElement("input");
        b.className = "blocklyHtmlInput";
        b.setAttribute("spellcheck", this.spellcheck_);
        var c = this.workspace_.getScale()
          , d = this.getConstants().FIELD_TEXT_FONTSIZE * c + "pt";
        a.style.fontSize = d;
        b.style.fontSize = d;
        d = e.module$exports$Blockly$FieldTextInput.FieldTextInput.BORDERRADIUS * c + "px";
        if (this.fullBlockClickTarget_) {
            d = this.getScaledBBox();
            d = (d.bottom - d.top) / 2 + "px";
            var f = this.sourceBlock_.getParent() ? this.sourceBlock_.getParent().style.colourTertiary : this.sourceBlock_.style.colourTertiary;
            b.style.border = 1 * c + "px solid " + f;
            a.style.borderRadius = d;
            a.style.transition = "box-shadow 0.25s ease 0s";
            this.getConstants().FIELD_TEXTINPUT_BOX_SHADOW && (a.style.boxShadow = "rgba(255, 255, 255, 0.3) 0 0 0 " + 4 * c + "px")
        }
        b.style.borderRadius = d;
        a.appendChild(b);
        b.value = b.defaultValue = this.getEditorText_(this.value_);
        b.untypedDefaultValue_ = this.value_;
        b.oldValue_ = null;
        this.resizeEditor_();
        this.bindInputEvents_(b);
        return b
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.widgetDispose_ = function() {
        this.isBeingEdited_ = !1;
        this.isTextValid_ = !0;
        this.forceRerender();
        if (this.onFinishEditing_)
            this.onFinishEditing_(this.value_);
        (0,
        h.setGroup)(!1);
        this.unbindInputEvents_();
        var a = (0,
        ma.getDiv)().style;
        a.width = "auto";
        a.height = "auto";
        a.fontSize = "";
        a.transition = "";
        a.boxShadow = "";
        this.htmlInput_ = null;
        (0,
        l.removeClass)(this.getClickTarget_(), "editing")
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.bindInputEvents_ = function(a) {
        this.onKeyDownWrapper_ = (0,
        u.conditionalBind)(a, "keydown", this, this.onHtmlInputKeyDown_);
        this.onKeyInputWrapper_ = (0,
        u.conditionalBind)(a, "input", this, this.onHtmlInputChange_)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.unbindInputEvents_ = function() {
        this.onKeyDownWrapper_ && ((0,
        u.unbind)(this.onKeyDownWrapper_),
        this.onKeyDownWrapper_ = null);
        this.onKeyInputWrapper_ && ((0,
        u.unbind)(this.onKeyInputWrapper_),
        this.onKeyInputWrapper_ = null)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.onHtmlInputKeyDown_ = function(a) {
        a.keyCode === H.ENTER ? ((0,
        ma.hide)(),
        y.hideWithoutAnimation()) : a.keyCode === H.ESC ? (this.setValue(this.htmlInput_.untypedDefaultValue_),
        (0,
        ma.hide)(),
        y.hideWithoutAnimation()) : a.keyCode === H.TAB && ((0,
        ma.hide)(),
        y.hideWithoutAnimation(),
        this.sourceBlock_.tab(this, !a.shiftKey),
        a.preventDefault())
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.onHtmlInputChange_ = function(a) {
        a = this.htmlInput_.value;
        a !== this.htmlInput_.oldValue_ && (this.htmlInput_.oldValue_ = a,
        a = this.getValueFromEditorText_(a),
        this.setValue(a),
        this.forceRerender(),
        this.resizeEditor_())
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.setEditorValue_ = function(a) {
        this.isDirty_ = !0;
        this.isBeingEdited_ && (this.htmlInput_.value = this.getEditorText_(a));
        this.setValue(a)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.resizeEditor_ = function() {
        var a = (0,
        ma.getDiv)()
          , b = this.getScaledBBox();
        a.style.width = b.right - b.left + "px";
        a.style.height = b.bottom - b.top + "px";
        b = new E(this.sourceBlock_.RTL ? b.right - a.offsetWidth : b.left,b.top);
        a.style.left = b.x + "px";
        a.style.top = b.y + "px"
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.isTabNavigable = function() {
        return !0
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.getText_ = function() {
        return this.isBeingEdited_ && this.htmlInput_ ? this.htmlInput_.value : null
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.getEditorText_ = function(a) {
        return String(a)
    }
    ;
    e.module$exports$Blockly$FieldTextInput.FieldTextInput.prototype.getValueFromEditorText_ = function(a) {
        return a
    }
    ;
    (0,
    mb.register)("field_input", e.module$exports$Blockly$FieldTextInput.FieldTextInput);
    var Ha = {
        FieldNumber: function(a, b, c, d, f, g) {
            this.min_ = -Infinity;
            this.max_ = Infinity;
            this.precision_ = 0;
            this.decimalPlaces_ = null;
            Ha.FieldNumber.superClass_.constructor.call(this, a, f, g);
            g || this.setConstraints(b, c, d)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ha.FieldNumber, e.module$exports$Blockly$FieldTextInput.FieldTextInput);
    Ha.FieldNumber.prototype.DEFAULT_VALUE = 0;
    Ha.FieldNumber.fromJson = function(a) {
        return new this(a.value,void 0,void 0,void 0,void 0,a)
    }
    ;
    Ha.FieldNumber.prototype.SERIALIZABLE = !0;
    Ha.FieldNumber.prototype.configure_ = function(a) {
        Ha.FieldNumber.superClass_.configure_.call(this, a);
        this.setMinInternal_(a.min);
        this.setMaxInternal_(a.max);
        this.setPrecisionInternal_(a.precision)
    }
    ;
    Ha.FieldNumber.prototype.setConstraints = function(a, b, c) {
        this.setMinInternal_(a);
        this.setMaxInternal_(b);
        this.setPrecisionInternal_(c);
        this.setValue(this.getValue())
    }
    ;
    Ha.FieldNumber.prototype.setMin = function(a) {
        this.setMinInternal_(a);
        this.setValue(this.getValue())
    }
    ;
    Ha.FieldNumber.prototype.setMinInternal_ = function(a) {
        null == a ? this.min_ = -Infinity : (a = Number(a),
        isNaN(a) || (this.min_ = a))
    }
    ;
    Ha.FieldNumber.prototype.getMin = function() {
        return this.min_
    }
    ;
    Ha.FieldNumber.prototype.setMax = function(a) {
        this.setMaxInternal_(a);
        this.setValue(this.getValue())
    }
    ;
    Ha.FieldNumber.prototype.setMaxInternal_ = function(a) {
        null == a ? this.max_ = Infinity : (a = Number(a),
        isNaN(a) || (this.max_ = a))
    }
    ;
    Ha.FieldNumber.prototype.getMax = function() {
        return this.max_
    }
    ;
    Ha.FieldNumber.prototype.setPrecision = function(a) {
        this.setPrecisionInternal_(a);
        this.setValue(this.getValue())
    }
    ;
    Ha.FieldNumber.prototype.setPrecisionInternal_ = function(a) {
        this.precision_ = Number(a) || 0;
        var b = String(this.precision_);
        -1 !== b.indexOf("e") && (b = this.precision_.toLocaleString("en-US", {
            maximumFractionDigits: 20
        }));
        var c = b.indexOf(".");
        this.decimalPlaces_ = -1 === c ? a ? 0 : null : b.length - c - 1
    }
    ;
    Ha.FieldNumber.prototype.getPrecision = function() {
        return this.precision_
    }
    ;
    Ha.FieldNumber.prototype.doClassValidation_ = function(a) {
        if (null === a)
            return null;
        a = String(a);
        a = a.replace(/O/ig, "0");
        a = a.replace(/,/g, "");
        a = a.replace(/infinity/i, "Infinity");
        a = Number(a || 0);
        if (isNaN(a))
            return null;
        a = Math.min(Math.max(a, this.min_), this.max_);
        this.precision_ && isFinite(a) && (a = Math.round(a / this.precision_) * this.precision_);
        null !== this.decimalPlaces_ && (a = Number(a.toFixed(this.decimalPlaces_)));
        return a
    }
    ;
    Ha.FieldNumber.prototype.widgetCreate_ = function() {
        var a = Ha.FieldNumber.superClass_.widgetCreate_.call(this);
        -Infinity < this.min_ && (0,
        J.setState)(a, J.State.VALUEMIN, this.min_);
        Infinity > this.max_ && (0,
        J.setState)(a, J.State.VALUEMAX, this.max_);
        return a
    }
    ;
    (0,
    mb.register)("field_number", Ha.FieldNumber);
    var wa = {
        FieldMultilineInput: function(a, b, c) {
            wa.FieldMultilineInput.superClass_.constructor.call(this, a, b, c);
            this.textGroup_ = null;
            this.maxLines_ = Infinity;
            this.isOverflowedY_ = !1
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(wa.FieldMultilineInput, e.module$exports$Blockly$FieldTextInput.FieldTextInput);
    wa.FieldMultilineInput.prototype.configure_ = function(a) {
        wa.FieldMultilineInput.superClass_.configure_.call(this, a);
        a.maxLines && this.setMaxLines(a.maxLines)
    }
    ;
    wa.FieldMultilineInput.fromJson = function(a) {
        return new this((0,
        da.replaceMessageReferences)(a.text),void 0,a)
    }
    ;
    wa.FieldMultilineInput.prototype.toXml = function(a) {
        a.textContent = this.getValue().replace(/\n/g, "&#10;");
        return a
    }
    ;
    wa.FieldMultilineInput.prototype.fromXml = function(a) {
        this.setValue(a.textContent.replace(/&#10;/g, "\n"))
    }
    ;
    wa.FieldMultilineInput.prototype.saveState = function() {
        var a = this.saveLegacyState(wa.FieldMultilineInput);
        return null !== a ? a : this.getValue()
    }
    ;
    wa.FieldMultilineInput.prototype.loadState = function(a) {
        this.loadLegacyState(D, a) || this.setValue(a)
    }
    ;
    wa.FieldMultilineInput.prototype.initView = function() {
        this.createBorderRect_();
        this.textGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyEditableText"
        }, this.fieldGroup_)
    }
    ;
    wa.FieldMultilineInput.prototype.getDisplayText_ = function() {
        var a = this.getText();
        if (!a)
            return D.NBSP;
        var b = a.split("\n");
        a = "";
        for (var c = this.isOverflowedY_ ? this.maxLines_ : b.length, d = 0; d < c; d++) {
            var f = b[d];
            f.length > this.maxDisplayLength ? f = f.substring(0, this.maxDisplayLength - 4) + "..." : this.isOverflowedY_ && d === c - 1 && (f = f.substring(0, f.length - 3) + "...");
            f = f.replace(/\s/g, D.NBSP);
            a += f;
            d !== c - 1 && (a += "\n")
        }
        this.sourceBlock_.RTL && (a += "\u200f");
        return a
    }
    ;
    wa.FieldMultilineInput.prototype.doValueUpdate_ = function(a) {
        wa.FieldMultilineInput.superClass_.doValueUpdate_.call(this, a);
        this.isOverflowedY_ = this.value_.split("\n").length > this.maxLines_
    }
    ;
    wa.FieldMultilineInput.prototype.render_ = function() {
        for (var a; a = this.textGroup_.firstChild; )
            this.textGroup_.removeChild(a);
        a = this.getDisplayText_().split("\n");
        for (var b = 0, c = 0; c < a.length; c++) {
            var d = this.getConstants().FIELD_TEXT_HEIGHT + this.getConstants().FIELD_BORDER_RECT_Y_PADDING;
            (0,
            l.createSvgElement)(q.TEXT, {
                "class": "blocklyText blocklyMultilineText",
                x: this.getConstants().FIELD_BORDER_RECT_X_PADDING,
                y: b + this.getConstants().FIELD_BORDER_RECT_Y_PADDING,
                dy: this.getConstants().FIELD_TEXT_BASELINE
            }, this.textGroup_).appendChild(document.createTextNode(a[c]));
            b += d
        }
        this.isBeingEdited_ && (a = this.htmlInput_,
        this.isOverflowedY_ ? (0,
        l.addClass)(a, "blocklyHtmlTextAreaInputOverflowedY") : (0,
        l.removeClass)(a, "blocklyHtmlTextAreaInputOverflowedY"));
        this.updateSize_();
        this.isBeingEdited_ && (this.sourceBlock_.RTL ? setTimeout(this.resizeEditor_.bind(this), 0) : this.resizeEditor_(),
        a = this.htmlInput_,
        this.isTextValid_ ? ((0,
        l.removeClass)(a, "blocklyInvalidInput"),
        (0,
        J.setState)(a, J.State.INVALID, !1)) : ((0,
        l.addClass)(a, "blocklyInvalidInput"),
        (0,
        J.setState)(a, J.State.INVALID, !0)))
    }
    ;
    wa.FieldMultilineInput.prototype.updateSize_ = function() {
        for (var a = this.textGroup_.childNodes, b = 0, c = 0, d = 0; d < a.length; d++) {
            var f = (0,
            l.getTextWidth)(a[d]);
            f > b && (b = f);
            c += this.getConstants().FIELD_TEXT_HEIGHT + (0 < d ? this.getConstants().FIELD_BORDER_RECT_Y_PADDING : 0)
        }
        if (this.isBeingEdited_) {
            a = this.value_.split("\n");
            d = (0,
            l.createSvgElement)(q.TEXT, {
                "class": "blocklyText blocklyMultilineText"
            });
            f = this.getConstants().FIELD_TEXT_FONTSIZE;
            for (var g = this.getConstants().FIELD_TEXT_FONTWEIGHT, k = this.getConstants().FIELD_TEXT_FONTFAMILY, n = 0; n < a.length; n++) {
                a[n].length > this.maxDisplayLength && (a[n] = a[n].substring(0, this.maxDisplayLength));
                d.textContent = a[n];
                var x = (0,
                l.getFastTextWidth)(d, f, g, k);
                x > b && (b = x)
            }
            b += this.htmlInput_.offsetWidth - this.htmlInput_.clientWidth
        }
        this.borderRect_ && (c += 2 * this.getConstants().FIELD_BORDER_RECT_Y_PADDING,
        b += 2 * this.getConstants().FIELD_BORDER_RECT_X_PADDING,
        this.borderRect_.setAttribute("width", b),
        this.borderRect_.setAttribute("height", c));
        this.size_.width = b;
        this.size_.height = c;
        this.positionBorderRect_()
    }
    ;
    wa.FieldMultilineInput.prototype.showEditor_ = function(a, b) {
        wa.FieldMultilineInput.superClass_.showEditor_.call(this, a, b);
        this.forceRerender()
    }
    ;
    wa.FieldMultilineInput.prototype.widgetCreate_ = function() {
        var a = (0,
        ma.getDiv)()
          , b = this.workspace_.getScale()
          , c = document.createElement("textarea");
        c.className = "blocklyHtmlInput blocklyHtmlTextAreaInput";
        c.setAttribute("spellcheck", this.spellcheck_);
        var d = this.getConstants().FIELD_TEXT_FONTSIZE * b + "pt";
        a.style.fontSize = d;
        c.style.fontSize = d;
        c.style.borderRadius = e.module$exports$Blockly$FieldTextInput.FieldTextInput.BORDERRADIUS * b + "px";
        d = this.getConstants().FIELD_BORDER_RECT_X_PADDING * b;
        var f = this.getConstants().FIELD_BORDER_RECT_Y_PADDING * b / 2;
        c.style.padding = f + "px " + d + "px " + f + "px " + d + "px";
        d = this.getConstants().FIELD_TEXT_HEIGHT + this.getConstants().FIELD_BORDER_RECT_Y_PADDING;
        c.style.lineHeight = d * b + "px";
        a.appendChild(c);
        c.value = c.defaultValue = this.getEditorText_(this.value_);
        c.untypedDefaultValue_ = this.value_;
        c.oldValue_ = null;
        O.GECKO ? setTimeout(this.resizeEditor_.bind(this), 0) : this.resizeEditor_();
        this.bindInputEvents_(c);
        return c
    }
    ;
    wa.FieldMultilineInput.prototype.setMaxLines = function(a) {
        "number" === typeof a && 0 < a && a !== this.maxLines_ && (this.maxLines_ = a,
        this.forceRerender())
    }
    ;
    wa.FieldMultilineInput.prototype.getMaxLines = function() {
        return this.maxLines_
    }
    ;
    wa.FieldMultilineInput.prototype.onHtmlInputKeyDown_ = function(a) {
        a.keyCode !== H.ENTER && wa.FieldMultilineInput.superClass_.onHtmlInputKeyDown_.call(this, a)
    }
    ;
    (0,
    Ia.register)("\n  .blocklyHtmlTextAreaInput {\n    font-family: monospace;\n    resize: none;\n    overflow: hidden;\n    height: 100%;\n    text-align: left;\n  }\n\n  .blocklyHtmlTextAreaInputOverflowedY {\n    overflow-y: scroll;\n  }\n");
    (0,
    mb.register)("field_multilinetext", wa.FieldMultilineInput);
    var Gc = {
        FieldLabelSerializable: function(a, b, c) {
            Gc.FieldLabelSerializable.superClass_.constructor.call(this, a, b, c)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Gc.FieldLabelSerializable, e.module$exports$Blockly$FieldLabel.FieldLabel);
    Gc.FieldLabelSerializable.fromJson = function(a) {
        return new this((0,
        da.replaceMessageReferences)(a.text),void 0,a)
    }
    ;
    Gc.FieldLabelSerializable.prototype.EDITABLE = !1;
    Gc.FieldLabelSerializable.prototype.SERIALIZABLE = !0;
    (0,
    mb.register)("field_label_serializable", Gc.FieldLabelSerializable);
    var Z = {
        FieldColour: function(a, b, c) {
            Z.FieldColour.superClass_.constructor.call(this, a, b, c);
            this.onKeyDownWrapper_ = this.onMouseLeaveWrapper_ = this.onMouseEnterWrapper_ = this.onMouseMoveWrapper_ = this.onClickWrapper_ = this.highlightedIndex_ = this.picker_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Z.FieldColour, D);
    Z.FieldColour.fromJson = function(a) {
        return new this(a.colour,void 0,a)
    }
    ;
    Z.FieldColour.prototype.SERIALIZABLE = !0;
    Z.FieldColour.prototype.CURSOR = "default";
    Z.FieldColour.prototype.isDirty_ = !1;
    Z.FieldColour.prototype.colours_ = null;
    Z.FieldColour.prototype.titles_ = null;
    Z.FieldColour.prototype.columns_ = 0;
    Z.FieldColour.prototype.configure_ = function(a) {
        Z.FieldColour.superClass_.configure_.call(this, a);
        a.colourOptions && (this.colours_ = a.colourOptions,
        this.titles_ = a.colourTitles);
        a.columns && (this.columns_ = a.columns)
    }
    ;
    Z.FieldColour.prototype.initView = function() {
        this.size_ = new Ja(this.getConstants().FIELD_COLOUR_DEFAULT_WIDTH,this.getConstants().FIELD_COLOUR_DEFAULT_HEIGHT);
        this.getConstants().FIELD_COLOUR_FULL_BLOCK ? this.clickTarget_ = this.sourceBlock_.getSvgRoot() : (this.createBorderRect_(),
        this.borderRect_.style.fillOpacity = "1")
    }
    ;
    Z.FieldColour.prototype.applyColour = function() {
        this.getConstants().FIELD_COLOUR_FULL_BLOCK ? (this.sourceBlock_.pathObject.svgPath.setAttribute("fill", this.getValue()),
        this.sourceBlock_.pathObject.svgPath.setAttribute("stroke", "#fff")) : this.borderRect_ && (this.borderRect_.style.fill = this.getValue())
    }
    ;
    Z.FieldColour.prototype.doClassValidation_ = function(a) {
        return "string" !== typeof a ? null : (0,
        ha.parse)(a)
    }
    ;
    Z.FieldColour.prototype.doValueUpdate_ = function(a) {
        this.value_ = a;
        this.borderRect_ ? this.borderRect_.style.fill = a : this.sourceBlock_ && this.sourceBlock_.rendered && (this.sourceBlock_.pathObject.svgPath.setAttribute("fill", a),
        this.sourceBlock_.pathObject.svgPath.setAttribute("stroke", "#fff"))
    }
    ;
    Z.FieldColour.prototype.getText = function() {
        var a = this.value_;
        /^#(.)\1(.)\2(.)\3$/.test(a) && (a = "#" + a[1] + a[3] + a[5]);
        return a
    }
    ;
    Z.FieldColour.COLOURS = "#ffffff #cccccc #c0c0c0 #999999 #666666 #333333 #000000 #ffcccc #ff6666 #ff0000 #cc0000 #990000 #660000 #330000 #ffcc99 #ff9966 #ff9900 #ff6600 #cc6600 #993300 #663300 #ffff99 #ffff66 #ffcc66 #ffcc33 #cc9933 #996633 #663333 #ffffcc #ffff33 #ffff00 #ffcc00 #999900 #666600 #333300 #99ff99 #66ff99 #33ff33 #33cc00 #009900 #006600 #003300 #99ffff #33ffff #66cccc #00cccc #339999 #336666 #003333 #ccffff #66ffff #33ccff #3366ff #3333ff #000099 #000066 #ccccff #9999ff #6666cc #6633ff #6600cc #333399 #330099 #ffccff #ff99ff #cc66cc #cc33cc #993399 #663366 #330033".split(" ");
    Z.FieldColour.prototype.DEFAULT_VALUE = Z.FieldColour.COLOURS[0];
    Z.FieldColour.TITLES = [];
    Z.FieldColour.COLUMNS = 7;
    Z.FieldColour.prototype.setColours = function(a, b) {
        this.colours_ = a;
        b && (this.titles_ = b);
        return this
    }
    ;
    Z.FieldColour.prototype.setColumns = function(a) {
        this.columns_ = a;
        return this
    }
    ;
    Z.FieldColour.prototype.showEditor_ = function() {
        this.dropdownCreate_();
        y.getContentDiv().appendChild(this.picker_);
        y.showPositionedByField(this, this.dropdownDispose_.bind(this));
        this.picker_.focus({
            preventScroll: !0
        })
    }
    ;
    Z.FieldColour.prototype.onClick_ = function(a) {
        a = (a = a.target) && a.label;
        null !== a && (this.setValue(a),
        y.hideIfOwner(this))
    }
    ;
    Z.FieldColour.prototype.onKeyDown_ = function(a) {
        var b = !1;
        if (a.keyCode === H.UP)
            this.moveHighlightBy_(0, -1),
            b = !0;
        else if (a.keyCode === H.DOWN)
            this.moveHighlightBy_(0, 1),
            b = !0;
        else if (a.keyCode === H.LEFT)
            this.moveHighlightBy_(-1, 0),
            b = !0;
        else if (a.keyCode === H.RIGHT)
            this.moveHighlightBy_(1, 0),
            b = !0;
        else if (a.keyCode === H.ENTER) {
            if (b = this.getHighlighted_())
                b = b && b.label,
                null !== b && this.setValue(b);
            y.hideWithoutAnimation();
            b = !0
        }
        b && a.stopPropagation()
    }
    ;
    Z.FieldColour.prototype.moveHighlightBy_ = function(a, b) {
        var c = this.colours_ || Z.FieldColour.COLOURS
          , d = this.columns_ || Z.FieldColour.COLUMNS
          , f = this.highlightedIndex_ % d
          , g = Math.floor(this.highlightedIndex_ / d);
        f += a;
        g += b;
        0 > a ? 0 > f && 0 < g ? (f = d - 1,
        g--) : 0 > f && (f = 0) : 0 < a ? f > d - 1 && g < Math.floor(c.length / d) - 1 ? (f = 0,
        g++) : f > d - 1 && f-- : 0 > b ? 0 > g && (g = 0) : 0 < b && g > Math.floor(c.length / d) - 1 && (g = Math.floor(c.length / d) - 1);
        this.setHighlightedCell_(this.picker_.childNodes[g].childNodes[f], g * d + f)
    }
    ;
    Z.FieldColour.prototype.onMouseMove_ = function(a) {
        var b = (a = a.target) && Number(a.getAttribute("data-index"));
        null !== b && b !== this.highlightedIndex_ && this.setHighlightedCell_(a, b)
    }
    ;
    Z.FieldColour.prototype.onMouseEnter_ = function() {
        this.picker_.focus({
            preventScroll: !0
        })
    }
    ;
    Z.FieldColour.prototype.onMouseLeave_ = function() {
        this.picker_.blur();
        var a = this.getHighlighted_();
        a && (0,
        l.removeClass)(a, "blocklyColourHighlighted")
    }
    ;
    Z.FieldColour.prototype.getHighlighted_ = function() {
        var a = this.columns_ || Z.FieldColour.COLUMNS
          , b = this.picker_.childNodes[Math.floor(this.highlightedIndex_ / a)];
        return b ? b.childNodes[this.highlightedIndex_ % a] : null
    }
    ;
    Z.FieldColour.prototype.setHighlightedCell_ = function(a, b) {
        var c = this.getHighlighted_();
        c && (0,
        l.removeClass)(c, "blocklyColourHighlighted");
        (0,
        l.addClass)(a, "blocklyColourHighlighted");
        this.highlightedIndex_ = b;
        (0,
        J.setState)(this.picker_, J.State.ACTIVEDESCENDANT, a.getAttribute("id"))
    }
    ;
    Z.FieldColour.prototype.dropdownCreate_ = function() {
        var a = this.columns_ || Z.FieldColour.COLUMNS
          , b = this.colours_ || Z.FieldColour.COLOURS
          , c = this.titles_ || Z.FieldColour.TITLES
          , d = this.getValue()
          , f = document.createElement("table");
        f.className = "blocklyColourTable";
        f.tabIndex = 0;
        f.dir = "ltr";
        (0,
        J.setRole)(f, J.Role.GRID);
        (0,
        J.setState)(f, J.State.EXPANDED, !0);
        (0,
        J.setState)(f, J.State.ROWCOUNT, Math.floor(b.length / a));
        (0,
        J.setState)(f, J.State.COLCOUNT, a);
        for (var g, k = 0; k < b.length; k++) {
            0 === k % a && (g = document.createElement("tr"),
            (0,
            J.setRole)(g, J.Role.ROW),
            f.appendChild(g));
            var n = document.createElement("td");
            g.appendChild(n);
            n.label = b[k];
            n.title = c[k] || b[k];
            n.id = (0,
            Va.getNextUniqueId)();
            n.setAttribute("data-index", k);
            (0,
            J.setRole)(n, J.Role.GRIDCELL);
            (0,
            J.setState)(n, J.State.LABEL, b[k]);
            (0,
            J.setState)(n, J.State.SELECTED, b[k] === d);
            n.style.backgroundColor = b[k];
            b[k] === d && (n.className = "blocklyColourSelected",
            this.highlightedIndex_ = k)
        }
        this.onClickWrapper_ = (0,
        u.conditionalBind)(f, "click", this, this.onClick_, !0);
        this.onMouseMoveWrapper_ = (0,
        u.conditionalBind)(f, "mousemove", this, this.onMouseMove_, !0);
        this.onMouseEnterWrapper_ = (0,
        u.conditionalBind)(f, "mouseenter", this, this.onMouseEnter_, !0);
        this.onMouseLeaveWrapper_ = (0,
        u.conditionalBind)(f, "mouseleave", this, this.onMouseLeave_, !0);
        this.onKeyDownWrapper_ = (0,
        u.conditionalBind)(f, "keydown", this, this.onKeyDown_);
        this.picker_ = f
    }
    ;
    Z.FieldColour.prototype.dropdownDispose_ = function() {
        this.onClickWrapper_ && ((0,
        u.unbind)(this.onClickWrapper_),
        this.onClickWrapper_ = null);
        this.onMouseMoveWrapper_ && ((0,
        u.unbind)(this.onMouseMoveWrapper_),
        this.onMouseMoveWrapper_ = null);
        this.onMouseEnterWrapper_ && ((0,
        u.unbind)(this.onMouseEnterWrapper_),
        this.onMouseEnterWrapper_ = null);
        this.onMouseLeaveWrapper_ && ((0,
        u.unbind)(this.onMouseLeaveWrapper_),
        this.onMouseLeaveWrapper_ = null);
        this.onKeyDownWrapper_ && ((0,
        u.unbind)(this.onKeyDownWrapper_),
        this.onKeyDownWrapper_ = null);
        this.highlightedIndex_ = this.picker_ = null
    }
    ;
    (0,
    Ia.register)("\n  .blocklyColourTable {\n    border-collapse: collapse;\n    display: block;\n    outline: none;\n    padding: 1px;\n  }\n\n  .blocklyColourTable>tr>td {\n    border: .5px solid #888;\n    box-sizing: border-box;\n    cursor: pointer;\n    display: inline-block;\n    height: 20px;\n    padding: 0;\n    width: 20px;\n  }\n\n  .blocklyColourTable>tr>td.blocklyColourHighlighted {\n    border-color: #eee;\n    box-shadow: 2px 2px 7px 2px rgba(0,0,0,.3);\n    position: relative;\n  }\n\n  .blocklyColourSelected, .blocklyColourSelected:hover {\n    border-color: #eee !important;\n    outline: 1px solid #333;\n    position: relative;\n  }\n");
    (0,
    mb.register)("field_colour", Z.FieldColour);
    e.module$exports$Blockly$FieldCheckbox = {
        FieldCheckbox: function(a, b, c) {
            this.checkChar_ = null;
            e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.superClass_.constructor.call(this, a, b, c)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$FieldCheckbox.FieldCheckbox, D);
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.DEFAULT_VALUE = !1;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.fromJson = function(a) {
        return new this(a.checked,void 0,a)
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.CHECK_CHAR = "\u2713";
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.SERIALIZABLE = !0;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.CURSOR = "default";
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.configure_ = function(a) {
        e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.superClass_.configure_.call(this, a);
        a.checkCharacter && (this.checkChar_ = a.checkCharacter)
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.saveState = function() {
        var a = this.saveLegacyState(e.module$exports$Blockly$FieldCheckbox.FieldCheckbox);
        return null !== a ? a : this.getValueBoolean()
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.initView = function() {
        e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.superClass_.initView.call(this);
        (0,
        l.addClass)(this.textElement_, "blocklyCheckbox");
        this.textElement_.style.display = this.value_ ? "block" : "none"
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.render_ = function() {
        this.textContent_ && (this.textContent_.nodeValue = this.getDisplayText_());
        this.updateSize_(this.getConstants().FIELD_CHECKBOX_X_OFFSET)
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.getDisplayText_ = function() {
        return this.checkChar_ || e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.CHECK_CHAR
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.setCheckCharacter = function(a) {
        this.checkChar_ = a;
        this.forceRerender()
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.showEditor_ = function() {
        this.setValue(!this.value_)
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.doClassValidation_ = function(a) {
        return !0 === a || "TRUE" === a ? "TRUE" : !1 === a || "FALSE" === a ? "FALSE" : null
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.doValueUpdate_ = function(a) {
        this.value_ = this.convertValueToBool_(a);
        this.textElement_ && (this.textElement_.style.display = this.value_ ? "block" : "none")
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.getValue = function() {
        return this.value_ ? "TRUE" : "FALSE"
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.getValueBoolean = function() {
        return this.value_
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.getText = function() {
        return String(this.convertValueToBool_(this.value_))
    }
    ;
    e.module$exports$Blockly$FieldCheckbox.FieldCheckbox.prototype.convertValueToBool_ = function(a) {
        return "string" === typeof a ? "TRUE" === a : !!a
    }
    ;
    (0,
    mb.register)("field_checkbox", e.module$exports$Blockly$FieldCheckbox.FieldCheckbox);
    var M = {
        FieldAngle: function(a, b, c) {
            this.clockwise_ = M.FieldAngle.CLOCKWISE;
            this.offset_ = M.FieldAngle.OFFSET;
            this.wrap_ = M.FieldAngle.WRAP;
            this.round_ = M.FieldAngle.ROUND;
            M.FieldAngle.superClass_.constructor.call(this, a, b, c);
            this.moveSurfaceWrapper_ = this.clickSurfaceWrapper_ = this.clickWrapper_ = this.line_ = this.gauge_ = this.editor_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(M.FieldAngle, e.module$exports$Blockly$FieldTextInput.FieldTextInput);
    M.FieldAngle.prototype.DEFAULT_VALUE = 0;
    M.FieldAngle.fromJson = function(a) {
        return new this(a.angle,void 0,a)
    }
    ;
    M.FieldAngle.prototype.SERIALIZABLE = !0;
    M.FieldAngle.ROUND = 15;
    M.FieldAngle.HALF = 50;
    M.FieldAngle.CLOCKWISE = !1;
    M.FieldAngle.OFFSET = 0;
    M.FieldAngle.WRAP = 360;
    M.FieldAngle.RADIUS = M.FieldAngle.HALF - 1;
    M.FieldAngle.prototype.configure_ = function(a) {
        M.FieldAngle.superClass_.configure_.call(this, a);
        switch (a.mode) {
        case "compass":
            this.clockwise_ = !0;
            this.offset_ = 90;
            break;
        case "protractor":
            this.clockwise_ = !1,
            this.offset_ = 0
        }
        var b = a.clockwise;
        "boolean" === typeof b && (this.clockwise_ = b);
        b = a.offset;
        null !== b && (b = Number(b),
        isNaN(b) || (this.offset_ = b));
        b = a.wrap;
        null !== b && (b = Number(b),
        isNaN(b) || (this.wrap_ = b));
        a = a.round;
        null !== a && (a = Number(a),
        isNaN(a) || (this.round_ = a))
    }
    ;
    M.FieldAngle.prototype.initView = function() {
        M.FieldAngle.superClass_.initView.call(this);
        this.symbol_ = (0,
        l.createSvgElement)(q.TSPAN, {}, null);
        this.symbol_.appendChild(document.createTextNode("\u00b0"));
        this.textElement_.appendChild(this.symbol_)
    }
    ;
    M.FieldAngle.prototype.render_ = function() {
        M.FieldAngle.superClass_.render_.call(this);
        this.updateGraph_()
    }
    ;
    M.FieldAngle.prototype.showEditor_ = function(a) {
        M.FieldAngle.superClass_.showEditor_.call(this, a, O.MOBILE || O.ANDROID || O.IPAD);
        this.dropdownCreate_();
        y.getContentDiv().appendChild(this.editor_);
        y.setColour(this.sourceBlock_.style.colourPrimary, this.sourceBlock_.style.colourTertiary);
        y.showPositionedByField(this, this.dropdownDispose_.bind(this));
        this.updateGraph_()
    }
    ;
    M.FieldAngle.prototype.dropdownCreate_ = function() {
        var a = (0,
        l.createSvgElement)(q.SVG, {
            xmlns: l.SVG_NS,
            "xmlns:html": l.HTML_NS,
            "xmlns:xlink": l.XLINK_NS,
            version: "1.1",
            height: 2 * M.FieldAngle.HALF + "px",
            width: 2 * M.FieldAngle.HALF + "px",
            style: "touch-action: none"
        }, null)
          , b = (0,
        l.createSvgElement)(q.CIRCLE, {
            cx: M.FieldAngle.HALF,
            cy: M.FieldAngle.HALF,
            r: M.FieldAngle.RADIUS,
            "class": "blocklyAngleCircle"
        }, a);
        this.gauge_ = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyAngleGauge"
        }, a);
        this.line_ = (0,
        l.createSvgElement)(q.LINE, {
            x1: M.FieldAngle.HALF,
            y1: M.FieldAngle.HALF,
            "class": "blocklyAngleLine"
        }, a);
        for (var c = 0; 360 > c; c += 15)
            (0,
            l.createSvgElement)(q.LINE, {
                x1: M.FieldAngle.HALF + M.FieldAngle.RADIUS,
                y1: M.FieldAngle.HALF,
                x2: M.FieldAngle.HALF + M.FieldAngle.RADIUS - (0 === c % 45 ? 10 : 5),
                y2: M.FieldAngle.HALF,
                "class": "blocklyAngleMarks",
                transform: "rotate(" + c + "," + M.FieldAngle.HALF + "," + M.FieldAngle.HALF + ")"
            }, a);
        this.clickWrapper_ = (0,
        u.conditionalBind)(a, "click", this, this.hide_);
        this.clickSurfaceWrapper_ = (0,
        u.conditionalBind)(b, "click", this, this.onMouseMove_, !0, !0);
        this.moveSurfaceWrapper_ = (0,
        u.conditionalBind)(b, "mousemove", this, this.onMouseMove_, !0, !0);
        this.editor_ = a
    }
    ;
    M.FieldAngle.prototype.dropdownDispose_ = function() {
        this.clickWrapper_ && ((0,
        u.unbind)(this.clickWrapper_),
        this.clickWrapper_ = null);
        this.clickSurfaceWrapper_ && ((0,
        u.unbind)(this.clickSurfaceWrapper_),
        this.clickSurfaceWrapper_ = null);
        this.moveSurfaceWrapper_ && ((0,
        u.unbind)(this.moveSurfaceWrapper_),
        this.moveSurfaceWrapper_ = null);
        this.line_ = this.gauge_ = null
    }
    ;
    M.FieldAngle.prototype.hide_ = function() {
        y.hideIfOwner(this);
        (0,
        ma.hide)()
    }
    ;
    M.FieldAngle.prototype.onMouseMove_ = function(a) {
        var b = this.gauge_.ownerSVGElement.getBoundingClientRect()
          , c = a.clientX - b.left - M.FieldAngle.HALF;
        a = a.clientY - b.top - M.FieldAngle.HALF;
        b = Math.atan(-a / c);
        isNaN(b) || (b = (0,
        xb.toDegrees)(b),
        0 > c ? b += 180 : 0 < a && (b += 360),
        b = this.clockwise_ ? this.offset_ + 360 - b : 360 - (this.offset_ - b),
        this.displayMouseOrKeyboardValue_(b))
    }
    ;
    M.FieldAngle.prototype.displayMouseOrKeyboardValue_ = function(a) {
        this.round_ && (a = Math.round(a / this.round_) * this.round_);
        a = this.wrapValue_(a);
        a !== this.value_ && this.setEditorValue_(a)
    }
    ;
    M.FieldAngle.prototype.updateGraph_ = function() {
        if (this.gauge_) {
            var a = Number(this.getText()) + this.offset_
              , b = (0,
            xb.toRadians)(a % 360);
            a = ["M ", M.FieldAngle.HALF, ",", M.FieldAngle.HALF];
            var c = M.FieldAngle.HALF
              , d = M.FieldAngle.HALF;
            if (!isNaN(b)) {
                var f = Number(this.clockwise_)
                  , g = (0,
                xb.toRadians)(this.offset_)
                  , k = Math.cos(g) * M.FieldAngle.RADIUS
                  , n = Math.sin(g) * -M.FieldAngle.RADIUS;
                f && (b = 2 * g - b);
                c += Math.cos(b) * M.FieldAngle.RADIUS;
                d -= Math.sin(b) * M.FieldAngle.RADIUS;
                b = Math.abs(Math.floor((b - g) / Math.PI) % 2);
                f && (b = 1 - b);
                a.push(" l ", k, ",", n, " A ", M.FieldAngle.RADIUS, ",", M.FieldAngle.RADIUS, " 0 ", b, " ", f, " ", c, ",", d, " z")
            }
            this.gauge_.setAttribute("d", a.join(""));
            this.line_.setAttribute("x2", c);
            this.line_.setAttribute("y2", d)
        }
    }
    ;
    M.FieldAngle.prototype.onHtmlInputKeyDown_ = function(a) {
        M.FieldAngle.superClass_.onHtmlInputKeyDown_.call(this, a);
        var b;
        a.keyCode === H.LEFT ? b = this.sourceBlock_.RTL ? 1 : -1 : a.keyCode === H.RIGHT ? b = this.sourceBlock_.RTL ? -1 : 1 : a.keyCode === H.DOWN ? b = -1 : a.keyCode === H.UP && (b = 1);
        if (b) {
            var c = this.getValue();
            this.displayMouseOrKeyboardValue_(c + b * this.round_);
            a.preventDefault();
            a.stopPropagation()
        }
    }
    ;
    M.FieldAngle.prototype.doClassValidation_ = function(a) {
        a = Number(a);
        return isNaN(a) || !isFinite(a) ? null : this.wrapValue_(a)
    }
    ;
    M.FieldAngle.prototype.wrapValue_ = function(a) {
        a %= 360;
        0 > a && (a += 360);
        a > this.wrap_ && (a -= 360);
        return a
    }
    ;
    (0,
    Ia.register)("\n  .blocklyAngleCircle {\n    stroke: #444;\n    stroke-width: 1;\n    fill: #ddd;\n    fill-opacity: .8;\n  }\n\n  .blocklyAngleMarks {\n    stroke: #444;\n    stroke-width: 1;\n  }\n\n  .blocklyAngleGauge {\n    fill: #f88;\n    fill-opacity: .8;\n    pointer-events: none;\n  }\n\n  .blocklyAngleLine {\n    stroke: #f00;\n    stroke-width: 2;\n    stroke-linecap: round;\n    pointer-events: none;\n  }\n");
    (0,
    mb.register)("field_angle", M.FieldAngle);
    var Hc = {
        TopRow: function(a) {
            Hc.TopRow.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Hc.TopRow, Wb.TopRow);
    Hc.TopRow.prototype.endsWithElemSpacer = function() {
        return !1
    }
    ;
    Hc.TopRow.prototype.hasLeftSquareCorner = function(a) {
        var b = (a.hat ? "cap" === a.hat : this.constants_.ADD_START_HATS) && !a.outputConnection && !a.previousConnection;
        return !!a.outputConnection || b
    }
    ;
    Hc.TopRow.prototype.hasRightSquareCorner = function(a) {
        return !!a.outputConnection && !a.statementInputCount && !a.nextConnection
    }
    ;
    var Cd = {
        StatementInput: function(a, b) {
            Cd.StatementInput.superClass_.constructor.call(this, a, b);
            if (this.connectedBlock) {
                for (a = this.connectedBlock; b = a.getNextBlock(); )
                    a = b;
                a.nextConnection || (this.height = this.connectedBlockHeight,
                this.connectedBottomNextConnection = !0)
            }
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Cd.StatementInput, Oc.StatementInput);
    var Dd = {
        RightConnectionShape: function(a) {
            Dd.RightConnectionShape.superClass_.constructor.call(this, a);
            this.type |= m.getType("RIGHT_CONNECTION");
            this.width = this.height = 0
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Dd.RightConnectionShape, Rb);
    var kb = {
        MarkerSvg: function(a, b, c) {
            kb.MarkerSvg.superClass_.constructor.call(this, a, b, c)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(kb.MarkerSvg, ja);
    kb.MarkerSvg.prototype.showWithInputOutput_ = function(a) {
        var b = a.getSourceBlock();
        a = a.getLocation().getOffsetInBlock();
        this.positionCircle_(a.x, a.y);
        this.setParent_(b);
        this.showCurrent_()
    }
    ;
    kb.MarkerSvg.prototype.showWithOutput_ = function(a) {
        this.showWithInputOutput_(a)
    }
    ;
    kb.MarkerSvg.prototype.showWithInput_ = function(a) {
        this.showWithInputOutput_(a)
    }
    ;
    kb.MarkerSvg.prototype.showWithBlock_ = function(a) {
        a = a.getLocation();
        var b = a.getHeightWidth();
        this.positionRect_(0, 0, b.width, b.height);
        this.setParent_(a);
        this.showCurrent_()
    }
    ;
    kb.MarkerSvg.prototype.positionCircle_ = function(a, b) {
        this.markerCircle_.setAttribute("cx", a);
        this.markerCircle_.setAttribute("cy", b);
        this.currentMarkerSvg = this.markerCircle_
    }
    ;
    kb.MarkerSvg.prototype.hide = function() {
        kb.MarkerSvg.superClass_.hide.call(this);
        this.markerCircle_.style.display = "none"
    }
    ;
    kb.MarkerSvg.prototype.createDomInternal_ = function() {
        kb.MarkerSvg.superClass_.createDomInternal_.call(this);
        this.markerCircle_ = (0,
        l.createSvgElement)(q.CIRCLE, {
            r: this.constants_.CURSOR_RADIUS,
            style: "display: none",
            "stroke-width": this.constants_.CURSOR_STROKE_WIDTH
        }, this.markerSvg_);
        if (this.isCursor()) {
            var a = this.getBlinkProperties_();
            (0,
            l.createSvgElement)(q.ANIMATE, a, this.markerCircle_)
        }
        return this.markerSvg_
    }
    ;
    kb.MarkerSvg.prototype.applyColour_ = function(a) {
        kb.MarkerSvg.superClass_.applyColour_.call(this, a);
        this.markerCircle_.setAttribute("fill", this.colour_);
        this.markerCircle_.setAttribute("stroke", this.colour_);
        this.isCursor() && this.markerCircle_.firstChild.setAttribute("values", this.colour_ + ";transparent;transparent;")
    }
    ;
    var Ca = {
        ConstantProvider: function() {
            Ca.ConstantProvider.superClass_.constructor.call(this);
            this.SMALL_PADDING = this.GRID_UNIT = 4;
            this.MEDIUM_PADDING = 2 * this.GRID_UNIT;
            this.MEDIUM_LARGE_PADDING = 3 * this.GRID_UNIT;
            this.LARGE_PADDING = 4 * this.GRID_UNIT;
            this.CORNER_RADIUS = 1 * this.GRID_UNIT;
            this.NOTCH_WIDTH = 9 * this.GRID_UNIT;
            this.NOTCH_HEIGHT = 2 * this.GRID_UNIT;
            this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT;
            this.MIN_BLOCK_WIDTH = 2 * this.GRID_UNIT;
            this.MIN_BLOCK_HEIGHT = 12 * this.GRID_UNIT;
            this.EMPTY_STATEMENT_INPUT_HEIGHT = 6 * this.GRID_UNIT;
            this.TAB_OFFSET_FROM_TOP = 0;
            this.TOP_ROW_MIN_HEIGHT = this.CORNER_RADIUS;
            this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;
            this.BOTTOM_ROW_MIN_HEIGHT = this.CORNER_RADIUS;
            this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = 6 * this.GRID_UNIT;
            this.STATEMENT_BOTTOM_SPACER = -this.NOTCH_HEIGHT;
            this.STATEMENT_INPUT_SPACER_MIN_WIDTH = 40 * this.GRID_UNIT;
            this.STATEMENT_INPUT_PADDING_LEFT = 4 * this.GRID_UNIT;
            this.EMPTY_INLINE_INPUT_PADDING = 4 * this.GRID_UNIT;
            this.EMPTY_INLINE_INPUT_HEIGHT = 8 * this.GRID_UNIT;
            this.DUMMY_INPUT_MIN_HEIGHT = 8 * this.GRID_UNIT;
            this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 6 * this.GRID_UNIT;
            this.CURSOR_WS_WIDTH = 20 * this.GRID_UNIT;
            this.CURSOR_COLOUR = "#ffa200";
            this.CURSOR_RADIUS = 5;
            this.JAGGED_TEETH_WIDTH = this.JAGGED_TEETH_HEIGHT = 0;
            this.START_HAT_HEIGHT = 22;
            this.START_HAT_WIDTH = 96;
            this.SHAPES = {
                HEXAGONAL: 1,
                ROUND: 2,
                SQUARE: 3,
                PUZZLE: 4,
                NOTCH: 5
            };
            this.SHAPE_IN_SHAPE_PADDING = {
                1: {
                    0: 5 * this.GRID_UNIT,
                    1: 2 * this.GRID_UNIT,
                    2: 5 * this.GRID_UNIT,
                    3: 5 * this.GRID_UNIT
                },
                2: {
                    0: 3 * this.GRID_UNIT,
                    1: 3 * this.GRID_UNIT,
                    2: 1 * this.GRID_UNIT,
                    3: 2 * this.GRID_UNIT
                },
                3: {
                    0: 2 * this.GRID_UNIT,
                    1: 2 * this.GRID_UNIT,
                    2: 2 * this.GRID_UNIT,
                    3: 2 * this.GRID_UNIT
                }
            };
            this.FULL_BLOCK_FIELDS = !0;
            this.FIELD_TEXT_FONTSIZE = 3 * this.GRID_UNIT;
            this.FIELD_TEXT_FONTWEIGHT = "bold";
            this.FIELD_TEXT_FONTFAMILY = '"Helvetica Neue", "Segoe UI", Helvetica, sans-serif';
            this.FIELD_BORDER_RECT_RADIUS = this.CORNER_RADIUS;
            this.FIELD_BORDER_RECT_X_PADDING = 2 * this.GRID_UNIT;
            this.FIELD_BORDER_RECT_Y_PADDING = 1.625 * this.GRID_UNIT;
            this.FIELD_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;
            this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;
            this.FIELD_DROPDOWN_SVG_ARROW = this.FIELD_DROPDOWN_COLOURED_DIV = this.FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW = !0;
            this.FIELD_DROPDOWN_SVG_ARROW_PADDING = this.FIELD_BORDER_RECT_X_PADDING;
            this.FIELD_COLOUR_FULL_BLOCK = this.FIELD_TEXTINPUT_BOX_SHADOW = !0;
            this.FIELD_COLOUR_DEFAULT_WIDTH = 2 * this.GRID_UNIT;
            this.FIELD_COLOUR_DEFAULT_HEIGHT = 4 * this.GRID_UNIT;
            this.FIELD_CHECKBOX_X_OFFSET = 1 * this.GRID_UNIT;
            this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH = 12 * this.GRID_UNIT;
            this.SELECTED_GLOW_COLOUR = "#fff200";
            this.SELECTED_GLOW_SIZE = .5;
            this.REPLACEMENT_GLOW_COLOUR = "#fff200";
            this.REPLACEMENT_GLOW_SIZE = 2;
            this.selectedGlowFilterId = "";
            this.selectedGlowFilter_ = null;
            this.replacementGlowFilterId = "";
            this.replacementGlowFilter_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ca.ConstantProvider, pa);
    Ca.ConstantProvider.prototype.setFontConstants_ = function(a) {
        Ca.ConstantProvider.superClass_.setFontConstants_.call(this, a);
        this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT = this.FIELD_TEXT_HEIGHT + 2 * this.FIELD_BORDER_RECT_Y_PADDING
    }
    ;
    Ca.ConstantProvider.prototype.init = function() {
        Ca.ConstantProvider.superClass_.init.call(this);
        this.HEXAGONAL = this.makeHexagonal();
        this.ROUNDED = this.makeRounded();
        this.SQUARED = this.makeSquared();
        this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT + this.INSIDE_CORNERS.rightWidth
    }
    ;
    Ca.ConstantProvider.prototype.setDynamicProperties_ = function(a) {
        Ca.ConstantProvider.superClass_.setDynamicProperties_.call(this, a);
        this.SELECTED_GLOW_COLOUR = a.getComponentStyle("selectedGlowColour") || this.SELECTED_GLOW_COLOUR;
        var b = Number(a.getComponentStyle("selectedGlowSize"));
        this.SELECTED_GLOW_SIZE = b && !isNaN(b) ? b : this.SELECTED_GLOW_SIZE;
        this.REPLACEMENT_GLOW_COLOUR = a.getComponentStyle("replacementGlowColour") || this.REPLACEMENT_GLOW_COLOUR;
        this.REPLACEMENT_GLOW_SIZE = (a = Number(a.getComponentStyle("replacementGlowSize"))) && !isNaN(a) ? a : this.REPLACEMENT_GLOW_SIZE
    }
    ;
    Ca.ConstantProvider.prototype.dispose = function() {
        Ca.ConstantProvider.superClass_.dispose.call(this);
        this.selectedGlowFilter_ && (0,
        l.removeNode)(this.selectedGlowFilter_);
        this.replacementGlowFilter_ && (0,
        l.removeNode)(this.replacementGlowFilter_)
    }
    ;
    Ca.ConstantProvider.prototype.makeStartHat = function() {
        var a = this.START_HAT_HEIGHT
          , b = this.START_HAT_WIDTH
          , c = (0,
        p.curve)("c", [(0,
        p.point)(25, -a), (0,
        p.point)(71, -a), (0,
        p.point)(b, 0)]);
        return {
            height: a,
            width: b,
            path: c
        }
    }
    ;
    Ca.ConstantProvider.prototype.makeHexagonal = function() {
        function a(c, d, f) {
            var g = c / 2;
            g = g > b ? b : g;
            f = f ? -1 : 1;
            c = (d ? -1 : 1) * c / 2;
            return (0,
            p.lineTo)(-f * g, c) + (0,
            p.lineTo)(f * g, c)
        }
        var b = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        return {
            type: this.SHAPES.HEXAGONAL,
            isDynamic: !0,
            width: function(c) {
                c /= 2;
                return c > b ? b : c
            },
            height: function(c) {
                return c
            },
            connectionOffsetY: function(c) {
                return c / 2
            },
            connectionOffsetX: function(c) {
                return -c
            },
            pathDown: function(c) {
                return a(c, !1, !1)
            },
            pathUp: function(c) {
                return a(c, !0, !1)
            },
            pathRightDown: function(c) {
                return a(c, !1, !0)
            },
            pathRightUp: function(c) {
                return a(c, !1, !0)
            }
        }
    }
    ;
    Ca.ConstantProvider.prototype.makeRounded = function() {
        function a(d, f, g) {
            var k = d > c ? d - c : 0;
            d = (d > c ? c : d) / 2;
            return (0,
            p.arc)("a", "0 0,1", d, (0,
            p.point)((f ? -1 : 1) * d, (f ? -1 : 1) * d)) + (0,
            p.lineOnAxis)("v", (g ? 1 : -1) * k) + (0,
            p.arc)("a", "0 0,1", d, (0,
            p.point)((f ? 1 : -1) * d, (f ? -1 : 1) * d))
        }
        var b = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH
          , c = 2 * b;
        return {
            type: this.SHAPES.ROUND,
            isDynamic: !0,
            width: function(d) {
                d /= 2;
                return d > b ? b : d
            },
            height: function(d) {
                return d
            },
            connectionOffsetY: function(d) {
                return d / 2
            },
            connectionOffsetX: function(d) {
                return -d
            },
            pathDown: function(d) {
                return a(d, !1, !1)
            },
            pathUp: function(d) {
                return a(d, !0, !1)
            },
            pathRightDown: function(d) {
                return a(d, !1, !0)
            },
            pathRightUp: function(d) {
                return a(d, !1, !0)
            }
        }
    }
    ;
    Ca.ConstantProvider.prototype.makeSquared = function() {
        function a(c, d, f) {
            c -= 2 * b;
            return (0,
            p.arc)("a", "0 0,1", b, (0,
            p.point)((d ? -1 : 1) * b, (d ? -1 : 1) * b)) + (0,
            p.lineOnAxis)("v", (f ? 1 : -1) * c) + (0,
            p.arc)("a", "0 0,1", b, (0,
            p.point)((d ? 1 : -1) * b, (d ? -1 : 1) * b))
        }
        var b = this.CORNER_RADIUS;
        return {
            type: this.SHAPES.SQUARE,
            isDynamic: !0,
            width: function(c) {
                return b
            },
            height: function(c) {
                return c
            },
            connectionOffsetY: function(c) {
                return c / 2
            },
            connectionOffsetX: function(c) {
                return -c
            },
            pathDown: function(c) {
                return a(c, !1, !1)
            },
            pathUp: function(c) {
                return a(c, !0, !1)
            },
            pathRightDown: function(c) {
                return a(c, !1, !0)
            },
            pathRightUp: function(c) {
                return a(c, !1, !0)
            }
        }
    }
    ;
    Ca.ConstantProvider.prototype.shapeFor = function(a) {
        var b = a.getCheck();
        !b && a.targetConnection && (b = a.targetConnection.getCheck());
        switch (a.type) {
        case e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE:
        case e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE:
            a = a.getSourceBlock().getOutputShape();
            if (null !== a)
                switch (a) {
                case this.SHAPES.HEXAGONAL:
                    return this.HEXAGONAL;
                case this.SHAPES.ROUND:
                    return this.ROUNDED;
                case this.SHAPES.SQUARE:
                    return this.SQUARED
                }
            if (b && -1 !== b.indexOf("Boolean"))
                return this.HEXAGONAL;
            if (b && -1 !== b.indexOf("Number"))
                return this.ROUNDED;
            b && b.indexOf("String");
            return this.ROUNDED;
        case e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT:
        case e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT:
            return this.NOTCH;
        default:
            throw Error("Unknown type");
        }
    }
    ;
    Ca.ConstantProvider.prototype.makeNotch = function() {
        function a(B) {
            return (0,
            p.curve)("c", [(0,
            p.point)(B * f / 2, 0), (0,
            p.point)(B * f * 3 / 4, k / 2), (0,
            p.point)(B * f, k)]) + (0,
            p.line)([(0,
            p.point)(B * f, g)]) + (0,
            p.curve)("c", [(0,
            p.point)(B * f / 4, k / 2), (0,
            p.point)(B * f / 2, k), (0,
            p.point)(B * f, k)]) + (0,
            p.lineOnAxis)("h", B * d) + (0,
            p.curve)("c", [(0,
            p.point)(B * f / 2, 0), (0,
            p.point)(B * f * 3 / 4, -(k / 2)), (0,
            p.point)(B * f, -k)]) + (0,
            p.line)([(0,
            p.point)(B * f, -g)]) + (0,
            p.curve)("c", [(0,
            p.point)(B * f / 4, -(k / 2)), (0,
            p.point)(B * f / 2, -k), (0,
            p.point)(B * f, -k)])
        }
        var b = this.NOTCH_WIDTH
          , c = this.NOTCH_HEIGHT
          , d = b / 3
          , f = d / 3
          , g = c / 2
          , k = g / 2
          , n = a(1)
          , x = a(-1);
        return {
            type: this.SHAPES.NOTCH,
            width: b,
            height: c,
            pathLeft: n,
            pathRight: x
        }
    }
    ;
    Ca.ConstantProvider.prototype.makeInsideCorners = function() {
        var a = this.CORNER_RADIUS
          , b = (0,
        p.arc)("a", "0 0,0", a, (0,
        p.point)(-a, a))
          , c = (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(-a, a))
          , d = (0,
        p.arc)("a", "0 0,0", a, (0,
        p.point)(a, a))
          , f = (0,
        p.arc)("a", "0 0,1", a, (0,
        p.point)(a, a));
        return {
            width: a,
            height: a,
            pathTop: b,
            pathBottom: d,
            rightWidth: a,
            rightHeight: a,
            pathTopRight: c,
            pathBottomRight: f
        }
    }
    ;
    Ca.ConstantProvider.prototype.generateSecondaryColour_ = function(a) {
        return (0,
        ha.blend)("#000", a, .15) || a
    }
    ;
    Ca.ConstantProvider.prototype.generateTertiaryColour_ = function(a) {
        return (0,
        ha.blend)("#000", a, .25) || a
    }
    ;
    Ca.ConstantProvider.prototype.createDom = function(a, b, c) {
        Ca.ConstantProvider.superClass_.createDom.call(this, a, b, c);
        a = (0,
        l.createSvgElement)(q.DEFS, {}, a);
        b = (0,
        l.createSvgElement)(q.FILTER, {
            id: "blocklySelectedGlowFilter" + this.randomIdentifier,
            height: "160%",
            width: "180%",
            y: "-30%",
            x: "-40%"
        }, a);
        (0,
        l.createSvgElement)(q.FEGAUSSIANBLUR, {
            "in": "SourceGraphic",
            stdDeviation: this.SELECTED_GLOW_SIZE
        }, b);
        c = (0,
        l.createSvgElement)(q.FECOMPONENTTRANSFER, {
            result: "outBlur"
        }, b);
        (0,
        l.createSvgElement)(q.FEFUNCA, {
            type: "table",
            tableValues: "0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
        }, c);
        (0,
        l.createSvgElement)(q.FEFLOOD, {
            "flood-color": this.SELECTED_GLOW_COLOUR,
            "flood-opacity": 1,
            result: "outColor"
        }, b);
        (0,
        l.createSvgElement)(q.FECOMPOSITE, {
            "in": "outColor",
            in2: "outBlur",
            operator: "in",
            result: "outGlow"
        }, b);
        this.selectedGlowFilterId = b.id;
        this.selectedGlowFilter_ = b;
        a = (0,
        l.createSvgElement)(q.FILTER, {
            id: "blocklyReplacementGlowFilter" + this.randomIdentifier,
            height: "160%",
            width: "180%",
            y: "-30%",
            x: "-40%"
        }, a);
        (0,
        l.createSvgElement)(q.FEGAUSSIANBLUR, {
            "in": "SourceGraphic",
            stdDeviation: this.REPLACEMENT_GLOW_SIZE
        }, a);
        b = (0,
        l.createSvgElement)(q.FECOMPONENTTRANSFER, {
            result: "outBlur"
        }, a);
        (0,
        l.createSvgElement)(q.FEFUNCA, {
            type: "table",
            tableValues: "0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1"
        }, b);
        (0,
        l.createSvgElement)(q.FEFLOOD, {
            "flood-color": this.REPLACEMENT_GLOW_COLOUR,
            "flood-opacity": 1,
            result: "outColor"
        }, a);
        (0,
        l.createSvgElement)(q.FECOMPOSITE, {
            "in": "outColor",
            in2: "outBlur",
            operator: "in",
            result: "outGlow"
        }, a);
        (0,
        l.createSvgElement)(q.FECOMPOSITE, {
            "in": "SourceGraphic",
            in2: "outGlow",
            operator: "over"
        }, a);
        this.replacementGlowFilterId = a.id;
        this.replacementGlowFilter_ = a
    }
    ;
    Ca.ConstantProvider.prototype.getCSS_ = function(a) {
        return [a + " .blocklyText,", a + " .blocklyFlyoutLabelText {", "font: " + this.FIELD_TEXT_FONTWEIGHT + " " + this.FIELD_TEXT_FONTSIZE + "pt " + this.FIELD_TEXT_FONTFAMILY + ";", "}", a + " .blocklyText {", "fill: #fff;", "}", a + " .blocklyNonEditableText>rect:not(.blocklyDropdownRect),", a + " .blocklyEditableText>rect:not(.blocklyDropdownRect) {", "fill: " + this.FIELD_BORDER_RECT_COLOUR + ";", "}", a + " .blocklyNonEditableText>text,", a + " .blocklyEditableText>text,", a + " .blocklyNonEditableText>g>text,", a + " .blocklyEditableText>g>text {", "fill: #575E75;", "}", a + " .blocklyFlyoutLabelText {", "fill: #575E75;", "}", a + " .blocklyText.blocklyBubbleText {", "fill: #575E75;", "}", a + " .blocklyDraggable:not(.blocklyDisabled)", " .blocklyEditableText:not(.editing):hover>rect,", a + " .blocklyDraggable:not(.blocklyDisabled)", " .blocklyEditableText:not(.editing):hover>.blocklyPath {", "stroke: #fff;", "stroke-width: 2;", "}", a + " .blocklyHtmlInput {", "font-family: " + this.FIELD_TEXT_FONTFAMILY + ";", "font-weight: " + this.FIELD_TEXT_FONTWEIGHT + ";", "color: #575E75;", "}", a + " .blocklyDropdownText {", "fill: #fff !important;", "}", a + ".blocklyWidgetDiv .goog-menuitem,", a + ".blocklyDropDownDiv .goog-menuitem {", "font-family: " + this.FIELD_TEXT_FONTFAMILY + ";", "}", a + ".blocklyDropDownDiv .goog-menuitem-content {", "color: #fff;", "}", a + " .blocklyHighlightedConnectionPath {", "stroke: " + this.SELECTED_GLOW_COLOUR + ";", "}", a + " .blocklyDisabled > .blocklyOutlinePath {", "fill: url(#blocklyDisabledPattern" + this.randomIdentifier + ")", "}", a + " .blocklyInsertionMarker>.blocklyPath {", "fill-opacity: " + this.INSERTION_MARKER_OPACITY + ";", "stroke: none;", "}"]
    }
    ;
    var db = {
        Drawer: function(a, b) {
            db.Drawer.superClass_.constructor.call(this, a, b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(db.Drawer, va);
    db.Drawer.prototype.draw = function() {
        var a = this.block_.pathObject;
        a.beginDrawing();
        this.hideHiddenIcons_();
        this.drawOutline_();
        this.drawInternals_();
        a.setPath(this.outlinePath_ + "\n" + this.inlinePath_);
        this.info_.RTL && a.flipRTL();
        (0,
        Fb.isDebuggerEnabled)() && this.block_.renderingDebugger.drawDebug(this.block_, this.info_);
        this.recordSizeOnBlock_();
        this.info_.outputConnection && (a.outputShapeType = this.info_.outputConnection.shape.type);
        a.endDrawing()
    }
    ;
    db.Drawer.prototype.drawOutline_ = function() {
        this.info_.outputConnection && this.info_.outputConnection.isDynamicShape && !this.info_.hasStatementInput && !this.info_.bottomRow.hasNextConnection ? (this.drawFlatTop_(),
        this.drawRightDynamicConnection_(),
        this.drawFlatBottom_(),
        this.drawLeftDynamicConnection_()) : db.Drawer.superClass_.drawOutline_.call(this)
    }
    ;
    db.Drawer.prototype.drawLeft_ = function() {
        this.info_.outputConnection && this.info_.outputConnection.isDynamicShape ? this.drawLeftDynamicConnection_() : db.Drawer.superClass_.drawLeft_.call(this)
    }
    ;
    db.Drawer.prototype.drawRightSideRow_ = function(a) {
        if (!(0 >= a.height))
            if (a.precedesStatement || a.followsStatement) {
                var b = this.constants_.INSIDE_CORNERS.rightHeight;
                b = a.height - (a.precedesStatement ? b : 0);
                this.outlinePath_ += (a.followsStatement ? this.constants_.INSIDE_CORNERS.pathBottomRight : "") + (0 < b ? (0,
                p.lineOnAxis)("V", a.yPos + b) : "") + (a.precedesStatement ? this.constants_.INSIDE_CORNERS.pathTopRight : "")
            } else
                this.outlinePath_ += (0,
                p.lineOnAxis)("V", a.yPos + a.height)
    }
    ;
    db.Drawer.prototype.drawRightDynamicConnection_ = function() {
        this.outlinePath_ += this.info_.outputConnection.shape.pathRightDown(this.info_.outputConnection.height)
    }
    ;
    db.Drawer.prototype.drawLeftDynamicConnection_ = function() {
        this.positionOutputConnection_();
        this.outlinePath_ += this.info_.outputConnection.shape.pathUp(this.info_.outputConnection.height);
        this.outlinePath_ += "z"
    }
    ;
    db.Drawer.prototype.drawFlatTop_ = function() {
        var a = this.info_.topRow;
        this.positionPreviousConnection_();
        this.outlinePath_ += (0,
        p.moveBy)(a.xPos, this.info_.startY);
        this.outlinePath_ += (0,
        p.lineOnAxis)("h", a.width)
    }
    ;
    db.Drawer.prototype.drawFlatBottom_ = function() {
        var a = this.info_.bottomRow;
        this.positionNextConnection_();
        this.outlinePath_ += (0,
        p.lineOnAxis)("V", a.baseline);
        this.outlinePath_ += (0,
        p.lineOnAxis)("h", -a.width)
    }
    ;
    db.Drawer.prototype.drawInlineInput_ = function(a) {
        this.positionInlineInputConnection_(a);
        var b = a.input.name;
        if (!a.connectedBlock && !this.info_.isInsertionMarker) {
            var c = a.width - 2 * a.connectionWidth;
            a = (0,
            p.moveTo)(a.xPos + a.connectionWidth, a.centerline - a.height / 2) + (0,
            p.lineOnAxis)("h", c) + a.shape.pathRightDown(a.height) + (0,
            p.lineOnAxis)("h", -c) + a.shape.pathUp(a.height) + "z";
            this.block_.pathObject.setOutlinePath(b, a)
        }
    }
    ;
    db.Drawer.prototype.drawStatementInput_ = function(a) {
        var b = a.getLastInput()
          , c = b.xPos + b.notchOffset + b.shape.width
          , d = b.shape.pathRight + (0,
        p.lineOnAxis)("h", -(b.notchOffset - this.constants_.INSIDE_CORNERS.width)) + this.constants_.INSIDE_CORNERS.pathTop
          , f = a.height - 2 * this.constants_.INSIDE_CORNERS.height;
        b = this.constants_.INSIDE_CORNERS.pathBottom + (0,
        p.lineOnAxis)("h", b.notchOffset - this.constants_.INSIDE_CORNERS.width) + (b.connectedBottomNextConnection ? "" : b.shape.pathLeft);
        this.outlinePath_ += (0,
        p.lineOnAxis)("H", c) + d + (0,
        p.lineOnAxis)("v", f) + b + (0,
        p.lineOnAxis)("H", a.xPos + a.width);
        this.positionStatementInputConnection_(a)
    }
    ;
    var Xa = {
        PathObject: function(a, b, c) {
            Xa.PathObject.superClass_.constructor.call(this, a, b, c);
            this.constants = c;
            this.svgPathSelected_ = null;
            this.outlines_ = Object.create(null);
            this.outputShapeType = this.remainingOutlines_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Xa.PathObject, Pa);
    Xa.PathObject.prototype.setPath = function(a) {
        Xa.PathObject.superClass_.setPath.call(this, a);
        this.svgPathSelected_ && this.svgPathSelected_.setAttribute("d", a)
    }
    ;
    Xa.PathObject.prototype.applyColour = function(a) {
        Xa.PathObject.superClass_.applyColour.call(this, a);
        a.isShadow() && a.getParent() && this.svgPath.setAttribute("stroke", a.getParent().style.colourTertiary);
        for (var b in this.outlines_)
            this.outlines_[b].setAttribute("fill", this.style.colourTertiary)
    }
    ;
    Xa.PathObject.prototype.flipRTL = function() {
        Xa.PathObject.superClass_.flipRTL.call(this);
        for (var a in this.outlines_)
            this.outlines_[a].setAttribute("transform", "scale(-1 1)")
    }
    ;
    Xa.PathObject.prototype.updateSelected = function(a) {
        this.setClass_("blocklySelected", a);
        a ? this.svgPathSelected_ || (this.svgPathSelected_ = this.svgPath.cloneNode(!0),
        this.svgPathSelected_.setAttribute("fill", "none"),
        this.svgPathSelected_.setAttribute("filter", "url(#" + this.constants.selectedGlowFilterId + ")"),
        this.svgRoot.appendChild(this.svgPathSelected_)) : this.svgPathSelected_ && (this.svgRoot.removeChild(this.svgPathSelected_),
        this.svgPathSelected_ = null)
    }
    ;
    Xa.PathObject.prototype.updateReplacementFade = function(a) {
        this.setClass_("blocklyReplaceable", a);
        a ? this.svgPath.setAttribute("filter", "url(#" + this.constants.replacementGlowFilterId + ")") : this.svgPath.removeAttribute("filter")
    }
    ;
    Xa.PathObject.prototype.updateShapeForInputHighlight = function(a, b) {
        a = a.getParentInput().name;
        (a = this.getOutlinePath_(a)) && (b ? a.setAttribute("filter", "url(#" + this.constants.replacementGlowFilterId + ")") : a.removeAttribute("filter"))
    }
    ;
    Xa.PathObject.prototype.beginDrawing = function() {
        this.remainingOutlines_ = Object.create(null);
        for (var a in this.outlines_)
            this.remainingOutlines_[a] = 1
    }
    ;
    Xa.PathObject.prototype.endDrawing = function() {
        if (this.remainingOutlines_)
            for (var a in this.remainingOutlines_)
                this.removeOutlinePath_(a);
        this.remainingOutlines_ = null
    }
    ;
    Xa.PathObject.prototype.setOutlinePath = function(a, b) {
        a = this.getOutlinePath_(a);
        a.setAttribute("d", b);
        a.setAttribute("fill", this.style.colourTertiary)
    }
    ;
    Xa.PathObject.prototype.getOutlinePath_ = function(a) {
        this.outlines_[a] || (this.outlines_[a] = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyOutlinePath",
            d: ""
        }, this.svgRoot));
        this.remainingOutlines_ && delete this.remainingOutlines_[a];
        return this.outlines_[a]
    }
    ;
    Xa.PathObject.prototype.removeOutlinePath_ = function(a) {
        this.outlines_[a].parentNode.removeChild(this.outlines_[a]);
        delete this.outlines_[a]
    }
    ;
    var Ic = {
        BottomRow: function(a) {
            Ic.BottomRow.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ic.BottomRow, Qb.BottomRow);
    Ic.BottomRow.prototype.endsWithElemSpacer = function() {
        return !1
    }
    ;
    Ic.BottomRow.prototype.hasLeftSquareCorner = function(a) {
        return !!a.outputConnection
    }
    ;
    Ic.BottomRow.prototype.hasRightSquareCorner = function(a) {
        return !!a.outputConnection && !a.statementInputCount && !a.nextConnection
    }
    ;
    e.module$exports$Blockly$FieldImage = {
        FieldImage: function(a, b, c, d, f, g, k) {
            if (!a)
                throw Error("Src value of an image field is required");
            a = (0,
            da.replaceMessageReferences)(a);
            c = Number((0,
            da.replaceMessageReferences)(c));
            b = Number((0,
            da.replaceMessageReferences)(b));
            if (isNaN(c) || isNaN(b))
                throw Error("Height and width values of an image field must cast to numbers.");
            if (0 >= c || 0 >= b)
                throw Error("Height and width values of an image field must be greater than 0.");
            this.flipRtl_ = !1;
            this.altText_ = "";
            e.module$exports$Blockly$FieldImage.FieldImage.superClass_.constructor.call(this, a, null, k);
            k || (this.flipRtl_ = !!g,
            this.altText_ = (0,
            da.replaceMessageReferences)(d) || "");
            this.size_ = new Ja(b,c + e.module$exports$Blockly$FieldImage.FieldImage.Y_PADDING);
            this.imageHeight_ = c;
            this.clickHandler_ = null;
            "function" === typeof f && (this.clickHandler_ = f);
            this.imageElement_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$FieldImage.FieldImage, D);
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.DEFAULT_VALUE = "";
    e.module$exports$Blockly$FieldImage.FieldImage.fromJson = function(a) {
        return new this(a.src,a.width,a.height,void 0,void 0,void 0,a)
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.Y_PADDING = 1;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.EDITABLE = !1;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.isDirty_ = !1;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.configure_ = function(a) {
        e.module$exports$Blockly$FieldImage.FieldImage.superClass_.configure_.call(this, a);
        this.flipRtl_ = !!a.flipRtl;
        this.altText_ = (0,
        da.replaceMessageReferences)(a.alt) || ""
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.initView = function() {
        this.imageElement_ = (0,
        l.createSvgElement)(q.IMAGE, {
            height: this.imageHeight_ + "px",
            width: this.size_.width + "px",
            alt: this.altText_
        }, this.fieldGroup_);
        this.imageElement_.setAttributeNS(l.XLINK_NS, "xlink:href", this.value_);
        this.clickHandler_ && (this.imageElement_.style.cursor = "pointer")
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.updateSize_ = function() {}
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.doClassValidation_ = function(a) {
        return "string" !== typeof a ? null : a
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.doValueUpdate_ = function(a) {
        this.value_ = a;
        this.imageElement_ && this.imageElement_.setAttributeNS(l.XLINK_NS, "xlink:href", String(this.value_))
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.getFlipRtl = function() {
        return this.flipRtl_
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.setAlt = function(a) {
        a !== this.altText_ && (this.altText_ = a || "",
        this.imageElement_ && this.imageElement_.setAttribute("alt", this.altText_))
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.showEditor_ = function() {
        this.clickHandler_ && this.clickHandler_(this)
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.setOnClickHandler = function(a) {
        this.clickHandler_ = a
    }
    ;
    e.module$exports$Blockly$FieldImage.FieldImage.prototype.getText_ = function() {
        return this.altText_
    }
    ;
    (0,
    mb.register)("field_image", e.module$exports$Blockly$FieldImage.FieldImage);
    var xa = {
        RenderInfo: function(a, b) {
            xa.RenderInfo.superClass_.constructor.call(this, a, b);
            this.topRow = new Hc.TopRow(this.constants_);
            this.bottomRow = new Ic.BottomRow(this.constants_);
            this.isInline = !0;
            this.isMultiRow = !b.getInputsInline() || b.isCollapsed();
            this.hasStatementInput = 0 < b.statementInputCount;
            this.rightSide = this.outputConnection ? new Dd.RightConnectionShape(this.constants_) : null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(xa.RenderInfo, qa);
    xa.RenderInfo.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    xa.RenderInfo.prototype.measure = function() {
        this.createRows_();
        this.addElemSpacing_();
        this.addRowSpacing_();
        this.adjustXPosition_();
        this.computeBounds_();
        this.alignRowElements_();
        this.finalize_()
    }
    ;
    xa.RenderInfo.prototype.shouldStartNewRow_ = function(a, b) {
        return b ? a.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT || b.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT ? !0 : a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE || a.type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY ? !this.isInline || this.isMultiRow : !1 : !1
    }
    ;
    xa.RenderInfo.prototype.getDesiredRowWidth_ = function(a) {
        return a.hasStatement ? this.width - this.startX - (this.constants_.INSIDE_CORNERS.rightWidth || 0) : xa.RenderInfo.superClass_.getDesiredRowWidth_.call(this, a)
    }
    ;
    xa.RenderInfo.prototype.getInRowSpacing_ = function(a, b) {
        return a && b || !this.outputConnection || !this.outputConnection.isDynamicShape || this.hasStatementInput || this.bottomRow.hasNextConnection ? !a && b && m.isStatementInput(b) ? this.constants_.STATEMENT_INPUT_PADDING_LEFT : a && m.isLeftRoundedCorner(a) && b && (m.isPreviousConnection(b) || m.isNextConnection(b)) ? b.notchOffset - this.constants_.CORNER_RADIUS : a && m.isLeftSquareCorner(a) && b && m.isHat(b) ? this.constants_.NO_PADDING : this.constants_.MEDIUM_PADDING : this.constants_.NO_PADDING
    }
    ;
    xa.RenderInfo.prototype.getSpacerRowHeight_ = function(a, b) {
        if (m.isTopRow(a) && m.isBottomRow(b))
            return this.constants_.EMPTY_BLOCK_SPACER_HEIGHT;
        var c = m.isInputRow(a) && a.hasStatement
          , d = m.isInputRow(b) && b.hasStatement;
        return d || c ? (a = Math.max(this.constants_.NOTCH_HEIGHT, this.constants_.INSIDE_CORNERS.rightHeight || 0),
        d && c ? Math.max(a, this.constants_.DUMMY_INPUT_MIN_HEIGHT) : a) : m.isTopRow(a) ? a.hasPreviousConnection || this.outputConnection && !this.hasStatementInput ? this.constants_.NO_PADDING : Math.abs(this.constants_.NOTCH_HEIGHT - this.constants_.CORNER_RADIUS) : m.isBottomRow(b) ? this.outputConnection ? !b.hasNextConnection && this.hasStatementInput ? Math.abs(this.constants_.NOTCH_HEIGHT - this.constants_.CORNER_RADIUS) : this.constants_.NO_PADDING : Math.max(this.topRow.minHeight, Math.max(this.constants_.NOTCH_HEIGHT, this.constants_.CORNER_RADIUS)) - this.constants_.CORNER_RADIUS : this.constants_.MEDIUM_PADDING
    }
    ;
    xa.RenderInfo.prototype.getSpacerRowWidth_ = function(a, b) {
        var c = this.width - this.startX;
        return m.isInputRow(a) && a.hasStatement || m.isInputRow(b) && b.hasStatement ? Math.max(c, this.constants_.STATEMENT_INPUT_SPACER_MIN_WIDTH) : c
    }
    ;
    xa.RenderInfo.prototype.getElemCenterline_ = function(a, b) {
        if (a.hasStatement && !m.isSpacer(b) && !m.isStatementInput(b))
            return a.yPos + this.constants_.EMPTY_STATEMENT_INPUT_HEIGHT / 2;
        if (m.isInlineInput(b)) {
            var c = b.connectedBlock;
            if (c && c.outputConnection && c.nextConnection)
                return a.yPos + c.height / 2
        }
        return xa.RenderInfo.superClass_.getElemCenterline_.call(this, a, b)
    }
    ;
    xa.RenderInfo.prototype.addInput_ = function(a, b) {
        if (a.type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && b.hasDummyInput && b.align === e.module$exports$Blockly$Input.Align.LEFT && a.align === e.module$exports$Blockly$Input.Align.RIGHT)
            b.rightAlignedDummyInput = a;
        else if (a.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT) {
            b.elements.push(new Cd.StatementInput(this.constants_,a));
            b.hasStatement = !0;
            null === b.align && (b.align = a.align);
            return
        }
        xa.RenderInfo.superClass_.addInput_.call(this, a, b)
    }
    ;
    xa.RenderInfo.prototype.addAlignmentPadding_ = function(a, b) {
        if (a.rightAlignedDummyInput) {
            for (var c, d = 0; d < a.elements.length; d++) {
                var f = a.elements[d];
                m.isSpacer(f) && (c = f);
                if (m.isField(f) && f.parentInput === a.rightAlignedDummyInput)
                    break
            }
            if (c) {
                c.width += b;
                a.width += b;
                return
            }
        }
        xa.RenderInfo.superClass_.addAlignmentPadding_.call(this, a, b)
    }
    ;
    xa.RenderInfo.prototype.adjustXPosition_ = function() {
        for (var a = this.constants_.NOTCH_OFFSET_LEFT + this.constants_.NOTCH_WIDTH, b = a, c = 2; c < this.rows.length - 1; c += 2) {
            var d = this.rows[c - 1]
              , f = this.rows[c]
              , g = this.rows[c + 1];
            d = 2 === c ? !!this.topRow.hasPreviousConnection : !!d.followsStatement;
            g = c + 2 >= this.rows.length - 1 ? !!this.bottomRow.hasNextConnection : !!g.precedesStatement;
            if (m.isInputRow(f) && f.hasStatement)
                f.measure(),
                b = f.width - f.getLastInput().width + a;
            else if (d && (2 === c || g) && m.isInputRow(f) && !f.hasStatement) {
                g = f.xPos;
                d = null;
                for (var k = 0; k < f.elements.length; k++) {
                    var n = f.elements[k];
                    m.isSpacer(n) && (d = n);
                    !(d && (m.isField(n) || m.isInput(n)) && g < b) || m.isField(n) && (n.field instanceof e.module$exports$Blockly$FieldLabel.FieldLabel || n.field instanceof e.module$exports$Blockly$FieldImage.FieldImage) || (d.width += b - g);
                    g += n.width
                }
            }
        }
    }
    ;
    xa.RenderInfo.prototype.finalizeOutputConnection_ = function() {
        if (this.outputConnection && this.outputConnection.isDynamicShape) {
            for (var a = 0, b = 0; b < this.rows.length; b++) {
                var c = this.rows[b];
                c.yPos = a;
                a += c.height
            }
            this.height = a;
            b = this.bottomRow.hasNextConnection ? this.height - this.bottomRow.descenderHeight : this.height;
            a = this.outputConnection.shape.height(b);
            b = this.outputConnection.shape.width(b);
            this.outputConnection.height = a;
            this.outputConnection.width = b;
            this.outputConnection.startX = b;
            this.outputConnection.connectionOffsetY = this.outputConnection.shape.connectionOffsetY(a);
            this.outputConnection.connectionOffsetX = this.outputConnection.shape.connectionOffsetX(b);
            c = 0;
            this.hasStatementInput || this.bottomRow.hasNextConnection || (c = b,
            this.rightSide.height = a,
            this.rightSide.width = c,
            this.rightSide.centerline = a / 2,
            this.rightSide.xPos = this.width + c);
            this.startX = b;
            this.width += b + c;
            this.widthWithChildren += b + c
        }
    }
    ;
    xa.RenderInfo.prototype.finalizeHorizontalAlignment_ = function() {
        if (this.outputConnection && !this.hasStatementInput && !this.bottomRow.hasNextConnection) {
            for (var a = 0, b = 0; b < this.rows.length; b++) {
                var c = this.rows[b];
                if (m.isInputRow(c)) {
                    a = c.elements[c.elements.length - 2];
                    var d = this.getNegativeSpacing_(c.elements[1])
                      , f = this.getNegativeSpacing_(a);
                    a = d + f;
                    var g = this.constants_.MIN_BLOCK_WIDTH + 2 * this.outputConnection.width;
                    this.width - a < g && (a = this.width - g,
                    d = a / 2,
                    f = a / 2);
                    c.elements.unshift(new ib.InRowSpacer(this.constants_,-d));
                    c.elements.push(new ib.InRowSpacer(this.constants_,-f))
                }
            }
            if (a)
                for (this.width -= a,
                this.widthWithChildren -= a,
                this.rightSide.xPos -= a,
                b = 0; b < this.rows.length; b++)
                    c = this.rows[b],
                    m.isTopOrBottomRow(c) && (c.elements[1].width -= a,
                    c.elements[1].widthWithConnectedBlocks -= a),
                    c.width -= a,
                    c.widthWithConnectedBlocks -= a
        }
    }
    ;
    xa.RenderInfo.prototype.getNegativeSpacing_ = function(a) {
        if (!a)
            return 0;
        var b = this.outputConnection.width
          , c = this.outputConnection.shape.type
          , d = this.constants_;
        if (this.isMultiRow && 1 < this.inputRows.length)
            switch (c) {
            case d.SHAPES.ROUND:
                return c = this.constants_.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH,
                c = this.height / 2 > c ? c : this.height / 2,
                b - c * (1 - Math.sin(Math.acos((c - this.constants_.SMALL_PADDING) / c)));
            default:
                return 0
            }
        if (m.isInlineInput(a)) {
            var f = a.connectedBlock;
            a = f ? f.pathObject.outputShapeType : a.shape.type;
            return f && f.outputConnection && (f.statementInputCount || f.nextConnection) || c === d.SHAPES.HEXAGONAL && c !== a ? 0 : b - this.constants_.SHAPE_IN_SHAPE_PADDING[c][a]
        }
        return m.isField(a) ? c === d.SHAPES.ROUND && a.field instanceof e.module$exports$Blockly$FieldTextInput.FieldTextInput ? b - 2.75 * d.GRID_UNIT : b - this.constants_.SHAPE_IN_SHAPE_PADDING[c][0] : m.isIcon(a) ? this.constants_.SMALL_PADDING : 0
    }
    ;
    xa.RenderInfo.prototype.finalizeVerticalAlignment_ = function() {
        if (!this.outputConnection)
            for (var a = 2; a < this.rows.length - 1; a += 2) {
                var b = this.rows[a - 1]
                  , c = this.rows[a]
                  , d = this.rows[a + 1]
                  , f = 2 === a
                  , g = a + 2 >= this.rows.length - 1 ? !!this.bottomRow.hasNextConnection : !!d.precedesStatement;
                if (f ? this.topRow.hasPreviousConnection : b.followsStatement) {
                    var k = 3 === c.elements.length && (c.elements[1].field instanceof e.module$exports$Blockly$FieldLabel.FieldLabel || c.elements[1].field instanceof e.module$exports$Blockly$FieldImage.FieldImage);
                    if (!f && k)
                        b.height -= this.constants_.SMALL_PADDING,
                        d.height -= this.constants_.SMALL_PADDING,
                        c.height -= this.constants_.MEDIUM_PADDING;
                    else if (!f && !g)
                        b.height += this.constants_.SMALL_PADDING;
                    else if (g) {
                        f = !1;
                        for (g = 0; g < c.elements.length; g++)
                            if (k = c.elements[g],
                            m.isInlineInput(k) && k.connectedBlock && !k.connectedBlock.isShadow() && 40 <= k.connectedBlock.getHeightWidth().height) {
                                f = !0;
                                break
                            }
                        f && (b.height -= this.constants_.SMALL_PADDING,
                        d.height -= this.constants_.SMALL_PADDING)
                    }
                }
            }
    }
    ;
    xa.RenderInfo.prototype.finalize_ = function() {
        this.finalizeOutputConnection_();
        this.finalizeHorizontalAlignment_();
        this.finalizeVerticalAlignment_();
        xa.RenderInfo.superClass_.finalize_.call(this);
        this.rightSide && (this.widthWithChildren += this.rightSide.width)
    }
    ;
    var Bb = {
        Renderer: function(a) {
            Bb.Renderer.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Bb.Renderer, La);
    Bb.Renderer.prototype.makeConstants_ = function() {
        return new Ca.ConstantProvider
    }
    ;
    Bb.Renderer.prototype.makeRenderInfo_ = function(a) {
        return new xa.RenderInfo(this,a)
    }
    ;
    Bb.Renderer.prototype.makeDrawer_ = function(a, b) {
        return new db.Drawer(a,b)
    }
    ;
    Bb.Renderer.prototype.makeMarkerDrawer = function(a, b) {
        return new kb.MarkerSvg(a,this.getConstants(),b)
    }
    ;
    Bb.Renderer.prototype.makePathObject = function(a, b) {
        return new Xa.PathObject(a,b,this.getConstants())
    }
    ;
    Bb.Renderer.prototype.shouldHighlightConnection = function(a) {
        return a.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE && a.type !== e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE
    }
    ;
    Bb.Renderer.prototype.getConnectionPreviewMethod = function(a, b, c) {
        return b.type === e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE ? a.isConnected() ? ea.PREVIEW_TYPE.REPLACEMENT_FADE : ea.PREVIEW_TYPE.INPUT_OUTLINE : Bb.Renderer.superClass_.getConnectionPreviewMethod(a, b, c)
    }
    ;
    (0,
    fa.register)("zelos", Bb.Renderer);
    var Lb = {};
    Lb.BottomRow = Ic.BottomRow;
    Lb.ConstantProvider = Ca.ConstantProvider;
    Lb.Drawer = db.Drawer;
    Lb.MarkerSvg = kb.MarkerSvg;
    Lb.PathObject = Xa.PathObject;
    Lb.RenderInfo = xa.RenderInfo;
    Lb.Renderer = Bb.Renderer;
    Lb.RightConnectionShape = Dd.RightConnectionShape;
    Lb.StatementInput = Cd.StatementInput;
    Lb.TopRow = Hc.TopRow;
    var Yb = {
        RenderInfo: function(a, b) {
            Yb.RenderInfo.superClass_.constructor.call(this, a, b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Yb.RenderInfo, qa);
    Yb.RenderInfo.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    Yb.RenderInfo.prototype.addElemSpacing_ = function() {
        for (var a = !1, b = 0; b < this.rows.length; b++)
            if (this.rows[b].hasExternalInput) {
                a = !0;
                break
            }
        for (b = 0; b < this.rows.length; b++) {
            var c = this.rows[b]
              , d = c.elements;
            c.elements = [];
            c.startsWithElemSpacer() && c.elements.push(new ib.InRowSpacer(this.constants_,this.getInRowSpacing_(null, d[0])));
            for (var f = 0; f < d.length - 1; f++) {
                c.elements.push(d[f]);
                var g = this.getInRowSpacing_(d[f], d[f + 1]);
                c.elements.push(new ib.InRowSpacer(this.constants_,g))
            }
            c.elements.push(d[d.length - 1]);
            c.endsWithElemSpacer() && (d = this.getInRowSpacing_(d[d.length - 1], null),
            a && c.hasDummyInput && (d += this.constants_.TAB_WIDTH),
            c.elements.push(new ib.InRowSpacer(this.constants_,d)))
        }
    }
    ;
    Yb.RenderInfo.prototype.getInRowSpacing_ = function(a, b) {
        if (!a)
            return b && m.isField(b) && b.isEditable ? this.constants_.MEDIUM_PADDING : b && m.isInlineInput(b) ? this.constants_.MEDIUM_LARGE_PADDING : b && m.isStatementInput(b) ? this.constants_.STATEMENT_INPUT_PADDING_LEFT : this.constants_.LARGE_PADDING;
        if (!m.isInput(a) && !b)
            return m.isField(a) && a.isEditable ? this.constants_.MEDIUM_PADDING : m.isIcon(a) ? 2 * this.constants_.LARGE_PADDING + 1 : m.isHat(a) ? this.constants_.NO_PADDING : m.isPreviousOrNextConnection(a) ? this.constants_.LARGE_PADDING : m.isLeftRoundedCorner(a) ? this.constants_.MIN_BLOCK_WIDTH : m.isJaggedEdge(a) ? this.constants_.NO_PADDING : this.constants_.LARGE_PADDING;
        if (m.isInput(a) && !b) {
            if (m.isExternalInput(a))
                return this.constants_.NO_PADDING;
            if (m.isInlineInput(a))
                return this.constants_.LARGE_PADDING;
            if (m.isStatementInput(a))
                return this.constants_.NO_PADDING
        }
        if (!m.isInput(a) && b && m.isInput(b)) {
            if (m.isField(a) && a.isEditable) {
                if (m.isInlineInput(b) || m.isExternalInput(b))
                    return this.constants_.SMALL_PADDING
            } else {
                if (m.isInlineInput(b) || m.isExternalInput(b))
                    return this.constants_.MEDIUM_LARGE_PADDING;
                if (m.isStatementInput(b))
                    return this.constants_.LARGE_PADDING
            }
            return this.constants_.LARGE_PADDING - 1
        }
        if (m.isIcon(a) && b && !m.isInput(b))
            return this.constants_.LARGE_PADDING;
        if (m.isInlineInput(a) && b && m.isField(b))
            return b.isEditable ? this.constants_.MEDIUM_PADDING : this.constants_.LARGE_PADDING;
        if (m.isLeftSquareCorner(a) && b) {
            if (m.isHat(b))
                return this.constants_.NO_PADDING;
            if (m.isPreviousConnection(b) || m.isNextConnection(b))
                return b.notchOffset
        }
        return m.isLeftRoundedCorner(a) && b ? b.notchOffset - this.constants_.CORNER_RADIUS : m.isField(a) && b && m.isField(b) && a.isEditable === b.isEditable || b && m.isJaggedEdge(b) ? this.constants_.LARGE_PADDING : this.constants_.MEDIUM_PADDING
    }
    ;
    Yb.RenderInfo.prototype.getSpacerRowHeight_ = function(a, b) {
        return m.isTopRow(a) && m.isBottomRow(b) ? this.constants_.EMPTY_BLOCK_SPACER_HEIGHT : m.isTopRow(a) || m.isBottomRow(b) ? this.constants_.NO_PADDING : a.hasExternalInput && b.hasExternalInput ? this.constants_.LARGE_PADDING : !a.hasStatement && b.hasStatement ? this.constants_.BETWEEN_STATEMENT_PADDING_Y : a.hasStatement && b.hasStatement || a.hasDummyInput || b.hasDummyInput ? this.constants_.LARGE_PADDING : this.constants_.MEDIUM_PADDING
    }
    ;
    Yb.RenderInfo.prototype.getElemCenterline_ = function(a, b) {
        if (m.isSpacer(b))
            return a.yPos + b.height / 2;
        if (m.isBottomRow(a))
            return a = a.yPos + a.height - a.descenderHeight,
            m.isNextConnection(b) ? a + b.height / 2 : a - b.height / 2;
        if (m.isTopRow(a))
            return m.isHat(b) ? a.capline - b.height / 2 : a.capline + b.height / 2;
        var c = a.yPos;
        return m.isField(b) && a.hasStatement ? c + (this.constants_.TALL_INPUT_FIELD_OFFSET_Y + b.height / 2) : c + a.height / 2
    }
    ;
    Yb.RenderInfo.prototype.finalize_ = function() {
        for (var a = 0, b = 0, c = 0; c < this.rows.length; c++) {
            var d = this.rows[c];
            d.yPos = b;
            d.xPos = this.startX;
            b += d.height;
            a = Math.max(a, d.widthWithConnectedBlocks);
            var f = b - this.topRow.ascenderHeight;
            d === this.bottomRow && f < this.constants_.MIN_BLOCK_HEIGHT && (f = this.constants_.MIN_BLOCK_HEIGHT - f,
            this.bottomRow.height += f,
            b += f);
            this.recordElemPositions_(d)
        }
        this.outputConnection && this.block_.nextConnection && this.block_.nextConnection.isConnected() && (a = Math.max(a, this.block_.nextConnection.targetBlock().getHeightWidth().width));
        this.bottomRow.baseline = b - this.bottomRow.descenderHeight;
        this.widthWithChildren = a + this.startX;
        this.height = b;
        this.startY = this.topRow.capline
    }
    ;
    var ed = {
        Renderer: function(a) {
            ed.Renderer.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ed.Renderer, La);
    ed.Renderer.prototype.makeRenderInfo_ = function(a) {
        return new Yb.RenderInfo(this,a)
    }
    ;
    (0,
    fa.register)("thrasos", ed.Renderer);
    var $d = {};
    $d.RenderInfo = Yb.RenderInfo;
    $d.Renderer = ed.Renderer;
    var Ed = function() {
        this.priority = Sd.VARIABLES
    };
    Ed.prototype.save = function(a) {
        var b = [];
        a = w.makeIterator(a.getAllVariables());
        for (var c = a.next(); !c.done; c = a.next()) {
            c = c.value;
            var d = {
                name: c.name,
                id: c.getId()
            };
            c.type && (d.type = c.type);
            b.push(d)
        }
        return b.length ? b : null
    }
    ;
    Ed.prototype.load = function(a, b) {
        a = w.makeIterator(a);
        for (var c = a.next(); !c.done; c = a.next())
            c = c.value,
            b.createVariable(c.name, c.type, c.id)
    }
    ;
    Ed.prototype.clear = function(a) {
        a.getVariableMap().clear()
    }
    ;
    (0,
    Td.register)("variables", new Ed);
    var Fd = {
        ConstantProvider: function() {
            Fd.ConstantProvider.superClass_.constructor.call(this)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Fd.ConstantProvider, pa);
    var Gd = {
        Drawer: function(a, b) {
            Gd.Drawer.superClass_.constructor.call(this, a, b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Gd.Drawer, va);
    var fd = {
        RenderInfo: function(a, b) {
            fd.RenderInfo.superClass_.constructor.call(this, a, b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(fd.RenderInfo, qa);
    fd.RenderInfo.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    var Jc = {
        Renderer: function(a) {
            Jc.Renderer.superClass_.constructor.call(this, a)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Jc.Renderer, La);
    Jc.Renderer.prototype.makeConstants_ = function() {
        return new Fd.ConstantProvider
    }
    ;
    Jc.Renderer.prototype.makeRenderInfo_ = function(a) {
        return new fd.RenderInfo(this,a)
    }
    ;
    Jc.Renderer.prototype.makeDrawer_ = function(a, b) {
        return new Gd.Drawer(a,b)
    }
    ;
    (0,
    fa.register)("minimalist", Jc.Renderer);
    var gd = {};
    gd.ConstantProvider = Fd.ConstantProvider;
    gd.Drawer = Gd.Drawer;
    gd.RenderInfo = fd.RenderInfo;
    gd.Renderer = Jc.Renderer;
    var Hd = {
        StatementInput: function(a, b) {
            Hd.StatementInput.superClass_.constructor.call(this, a, b);
            this.connectedBlock && (this.height += this.constants_.DARK_PATH_OFFSET)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Hd.StatementInput, Oc.StatementInput);
    var wb = function(a, b, c) {
        this.constants = c;
        this.svgRoot = a;
        this.svgPathDark = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyPathDark",
            transform: "translate(1,1)"
        }, this.svgRoot);
        this.svgPath = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyPath"
        }, this.svgRoot);
        this.svgPathLight = (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyPathLight"
        }, this.svgRoot);
        this.colourDark = "#000000";
        this.style = b
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(wb, Pa);
    wb.prototype.setPath = function(a) {
        this.svgPath.setAttribute("d", a);
        this.svgPathDark.setAttribute("d", a)
    }
    ;
    wb.prototype.setHighlightPath = function(a) {
        this.svgPathLight.setAttribute("d", a)
    }
    ;
    wb.prototype.flipRTL = function() {
        this.svgPath.setAttribute("transform", "scale(-1 1)");
        this.svgPathLight.setAttribute("transform", "scale(-1 1)");
        this.svgPathDark.setAttribute("transform", "translate(1,1) scale(-1 1)")
    }
    ;
    wb.prototype.applyColour = function(a) {
        this.svgPathLight.style.display = "";
        this.svgPathDark.style.display = "";
        this.svgPathLight.setAttribute("stroke", this.style.colourTertiary);
        this.svgPathDark.setAttribute("fill", this.colourDark);
        wb.superClass_.applyColour.call(this, a);
        this.svgPath.setAttribute("stroke", "none")
    }
    ;
    wb.prototype.setStyle = function(a) {
        this.style = a;
        this.colourDark = (0,
        ha.blend)("#000", this.style.colourPrimary, .2) || this.colourDark
    }
    ;
    wb.prototype.updateHighlighted = function(a) {
        a ? (this.svgPath.setAttribute("filter", "url(#" + this.constants.embossFilterId + ")"),
        this.svgPathLight.style.display = "none") : (this.svgPath.setAttribute("filter", "none"),
        this.svgPathLight.style.display = "inline")
    }
    ;
    wb.prototype.updateShadow_ = function(a) {
        a && (this.svgPathLight.style.display = "none",
        this.svgPathDark.setAttribute("fill", this.style.colourSecondary),
        this.svgPath.setAttribute("stroke", "none"),
        this.svgPath.setAttribute("fill", this.style.colourSecondary))
    }
    ;
    wb.prototype.updateDisabled_ = function(a) {
        wb.superClass_.updateDisabled_.call(this, a);
        a && this.svgPath.setAttribute("stroke", "none")
    }
    ;
    var Qc = {
        ConstantProvider: function() {
            Qc.ConstantProvider.superClass_.constructor.call(this);
            this.FIELD_TEXT_BASELINE_CENTER = !1;
            this.DARK_PATH_OFFSET = 1;
            this.MAX_BOTTOM_WIDTH = 30;
            this.STATEMENT_BOTTOM_SPACER = -this.NOTCH_HEIGHT / 2
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Qc.ConstantProvider, pa);
    Qc.ConstantProvider.prototype.getCSS_ = function(a) {
        return Qc.ConstantProvider.superClass_.getCSS_.call(this, a).concat([a + " .blocklyInsertionMarker>.blocklyPathLight,", a + " .blocklyInsertionMarker>.blocklyPathDark {", "fill-opacity: " + this.INSERTION_MARKER_OPACITY + ";", "stroke: none;", "}"])
    }
    ;
    var Mb = function(a) {
        this.info_ = a;
        this.inlineSteps_ = this.steps_ = "";
        this.RTL_ = this.info_.RTL;
        a = a.getRenderer();
        this.constants_ = a.getConstants();
        this.highlightConstants_ = a.getHighlightConstants();
        this.highlightOffset_ = this.highlightConstants_.OFFSET;
        this.outsideCornerPaths_ = this.highlightConstants_.OUTSIDE_CORNER;
        this.insideCornerPaths_ = this.highlightConstants_.INSIDE_CORNER;
        this.puzzleTabPaths_ = this.highlightConstants_.PUZZLE_TAB;
        this.notchPaths_ = this.highlightConstants_.NOTCH;
        this.startPaths_ = this.highlightConstants_.START_HAT;
        this.jaggedTeethPaths_ = this.highlightConstants_.JAGGED_TEETH
    };
    Mb.prototype.getPath = function() {
        return this.steps_ + "\n" + this.inlineSteps_
    }
    ;
    Mb.prototype.drawTopCorner = function(a) {
        this.steps_ += (0,
        p.moveBy)(a.xPos, this.info_.startY);
        for (var b = 0, c; c = a.elements[b]; b++)
            m.isLeftSquareCorner(c) ? this.steps_ += this.highlightConstants_.START_POINT : m.isLeftRoundedCorner(c) ? this.steps_ += this.outsideCornerPaths_.topLeft(this.RTL_) : m.isPreviousConnection(c) ? this.steps_ += this.notchPaths_.pathLeft : m.isHat(c) ? this.steps_ += this.startPaths_.path(this.RTL_) : m.isSpacer(c) && 0 !== c.width && (this.steps_ += (0,
            p.lineOnAxis)("H", c.xPos + c.width - this.highlightOffset_));
        this.steps_ += (0,
        p.lineOnAxis)("H", a.xPos + a.width - this.highlightOffset_)
    }
    ;
    Mb.prototype.drawJaggedEdge_ = function(a) {
        this.info_.RTL && (this.steps_ += this.jaggedTeethPaths_.pathLeft + (0,
        p.lineOnAxis)("v", a.height - this.jaggedTeethPaths_.height - this.highlightOffset_))
    }
    ;
    Mb.prototype.drawValueInput = function(a) {
        var b = a.getLastInput();
        if (this.RTL_) {
            var c = a.height - b.connectionHeight;
            this.steps_ += (0,
            p.moveTo)(b.xPos + b.width - this.highlightOffset_, a.yPos) + this.puzzleTabPaths_.pathDown(this.RTL_) + (0,
            p.lineOnAxis)("v", c)
        } else
            this.steps_ += (0,
            p.moveTo)(b.xPos + b.width, a.yPos) + this.puzzleTabPaths_.pathDown(this.RTL_)
    }
    ;
    Mb.prototype.drawStatementInput = function(a) {
        var b = a.getLastInput();
        if (this.RTL_) {
            var c = a.height - 2 * this.insideCornerPaths_.height;
            this.steps_ += (0,
            p.moveTo)(b.xPos, a.yPos) + this.insideCornerPaths_.pathTop(this.RTL_) + (0,
            p.lineOnAxis)("v", c) + this.insideCornerPaths_.pathBottom(this.RTL_) + (0,
            p.lineTo)(a.width - b.xPos - this.insideCornerPaths_.width, 0)
        } else
            this.steps_ += (0,
            p.moveTo)(b.xPos, a.yPos + a.height) + this.insideCornerPaths_.pathBottom(this.RTL_) + (0,
            p.lineTo)(a.width - b.xPos - this.insideCornerPaths_.width, 0)
    }
    ;
    Mb.prototype.drawRightSideRow = function(a) {
        var b = a.xPos + a.width - this.highlightOffset_;
        a.followsStatement && (this.steps_ += (0,
        p.lineOnAxis)("H", b));
        this.RTL_ && (this.steps_ += (0,
        p.lineOnAxis)("H", b),
        a.height > this.highlightOffset_ && (this.steps_ += (0,
        p.lineOnAxis)("V", a.yPos + a.height - this.highlightOffset_)))
    }
    ;
    Mb.prototype.drawBottomRow = function(a) {
        if (this.RTL_)
            this.steps_ += (0,
            p.lineOnAxis)("V", a.baseline - this.highlightOffset_);
        else {
            var b = this.info_.bottomRow.elements[0];
            m.isLeftSquareCorner(b) ? this.steps_ += (0,
            p.moveTo)(a.xPos + this.highlightOffset_, a.baseline - this.highlightOffset_) : m.isLeftRoundedCorner(b) && (this.steps_ += (0,
            p.moveTo)(a.xPos, a.baseline),
            this.steps_ += this.outsideCornerPaths_.bottomLeft())
        }
    }
    ;
    Mb.prototype.drawLeft = function() {
        var a = this.info_.outputConnection;
        a && (a = a.connectionOffsetY + a.height,
        this.RTL_ ? this.steps_ += (0,
        p.moveTo)(this.info_.startX, a) : (this.steps_ += (0,
        p.moveTo)(this.info_.startX + this.highlightOffset_, this.info_.bottomRow.baseline - this.highlightOffset_),
        this.steps_ += (0,
        p.lineOnAxis)("V", a)),
        this.steps_ += this.puzzleTabPaths_.pathUp(this.RTL_));
        this.RTL_ || (a = this.info_.topRow,
        m.isLeftRoundedCorner(a.elements[0]) ? this.steps_ += (0,
        p.lineOnAxis)("V", this.outsideCornerPaths_.height) : this.steps_ += (0,
        p.lineOnAxis)("V", a.capline + this.highlightOffset_))
    }
    ;
    Mb.prototype.drawInlineInput = function(a) {
        var b = this.highlightOffset_
          , c = a.xPos + a.connectionWidth
          , d = a.centerline - a.height / 2
          , f = a.width - a.connectionWidth
          , g = d + b;
        this.RTL_ ? (d = a.connectionOffsetY - b,
        a = a.height - (a.connectionOffsetY + a.connectionHeight) + b,
        this.inlineSteps_ += (0,
        p.moveTo)(c - b, g) + (0,
        p.lineOnAxis)("v", d) + this.puzzleTabPaths_.pathDown(this.RTL_) + (0,
        p.lineOnAxis)("v", a) + (0,
        p.lineOnAxis)("h", f)) : this.inlineSteps_ += (0,
        p.moveTo)(a.xPos + a.width + b, g) + (0,
        p.lineOnAxis)("v", a.height) + (0,
        p.lineOnAxis)("h", -f) + (0,
        p.moveTo)(c, d + a.connectionOffsetY) + this.puzzleTabPaths_.pathDown(this.RTL_)
    }
    ;
    var Da = {
        Drawer: function(a, b) {
            Da.Drawer.superClass_.constructor.call(this, a, b);
            this.highlighter_ = new Mb(b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Da.Drawer, va);
    Da.Drawer.prototype.draw = function() {
        this.hideHiddenIcons_();
        this.drawOutline_();
        this.drawInternals_();
        var a = this.block_.pathObject;
        a.setPath(this.outlinePath_ + "\n" + this.inlinePath_);
        a.setHighlightPath(this.highlighter_.getPath());
        this.info_.RTL && a.flipRTL();
        (0,
        Fb.isDebuggerEnabled)() && this.block_.renderingDebugger.drawDebug(this.block_, this.info_);
        this.recordSizeOnBlock_()
    }
    ;
    Da.Drawer.prototype.drawTop_ = function() {
        this.highlighter_.drawTopCorner(this.info_.topRow);
        this.highlighter_.drawRightSideRow(this.info_.topRow);
        Da.Drawer.superClass_.drawTop_.call(this)
    }
    ;
    Da.Drawer.prototype.drawJaggedEdge_ = function(a) {
        this.highlighter_.drawJaggedEdge_(a);
        Da.Drawer.superClass_.drawJaggedEdge_.call(this, a)
    }
    ;
    Da.Drawer.prototype.drawValueInput_ = function(a) {
        this.highlighter_.drawValueInput(a);
        Da.Drawer.superClass_.drawValueInput_.call(this, a)
    }
    ;
    Da.Drawer.prototype.drawStatementInput_ = function(a) {
        this.highlighter_.drawStatementInput(a);
        Da.Drawer.superClass_.drawStatementInput_.call(this, a)
    }
    ;
    Da.Drawer.prototype.drawRightSideRow_ = function(a) {
        this.highlighter_.drawRightSideRow(a);
        this.outlinePath_ += (0,
        p.lineOnAxis)("H", a.xPos + a.width) + (0,
        p.lineOnAxis)("V", a.yPos + a.height)
    }
    ;
    Da.Drawer.prototype.drawBottom_ = function() {
        this.highlighter_.drawBottomRow(this.info_.bottomRow);
        Da.Drawer.superClass_.drawBottom_.call(this)
    }
    ;
    Da.Drawer.prototype.drawLeft_ = function() {
        this.highlighter_.drawLeft();
        Da.Drawer.superClass_.drawLeft_.call(this)
    }
    ;
    Da.Drawer.prototype.drawInlineInput_ = function(a) {
        this.highlighter_.drawInlineInput(a);
        Da.Drawer.superClass_.drawInlineInput_.call(this, a)
    }
    ;
    Da.Drawer.prototype.positionInlineInputConnection_ = function(a) {
        var b = a.centerline - a.height / 2;
        if (a.connectionModel) {
            var c = a.xPos + a.connectionWidth + this.constants_.DARK_PATH_OFFSET;
            this.info_.RTL && (c *= -1);
            a.connectionModel.setOffsetInBlock(c, b + a.connectionOffsetY + this.constants_.DARK_PATH_OFFSET)
        }
    }
    ;
    Da.Drawer.prototype.positionStatementInputConnection_ = function(a) {
        var b = a.getLastInput();
        if (b.connectionModel) {
            var c = a.xPos + a.statementEdge + b.notchOffset;
            c = this.info_.RTL ? -1 * c : c + this.constants_.DARK_PATH_OFFSET;
            b.connectionModel.setOffsetInBlock(c, a.yPos + this.constants_.DARK_PATH_OFFSET)
        }
    }
    ;
    Da.Drawer.prototype.positionExternalValueConnection_ = function(a) {
        var b = a.getLastInput();
        if (b.connectionModel) {
            var c = a.xPos + a.width + this.constants_.DARK_PATH_OFFSET;
            this.info_.RTL && (c *= -1);
            b.connectionModel.setOffsetInBlock(c, a.yPos)
        }
    }
    ;
    Da.Drawer.prototype.positionNextConnection_ = function() {
        var a = this.info_.bottomRow;
        if (a.connection) {
            var b = a.connection
              , c = b.xPos;
            b.connectionModel.setOffsetInBlock((this.info_.RTL ? -c : c) + this.constants_.DARK_PATH_OFFSET / 2, a.baseline + this.constants_.DARK_PATH_OFFSET)
        }
    }
    ;
    var pc = function(a) {
        this.constantProvider = a;
        this.OFFSET = .5;
        this.START_POINT = (0,
        p.moveBy)(this.OFFSET, this.OFFSET)
    };
    pc.prototype.init = function() {
        this.INSIDE_CORNER = this.makeInsideCorner();
        this.OUTSIDE_CORNER = this.makeOutsideCorner();
        this.PUZZLE_TAB = this.makePuzzleTab();
        this.NOTCH = this.makeNotch();
        this.JAGGED_TEETH = this.makeJaggedTeeth();
        this.START_HAT = this.makeStartHat()
    }
    ;
    pc.prototype.makeInsideCorner = function() {
        var a = this.constantProvider.CORNER_RADIUS
          , b = this.OFFSET
          , c = (1 - Math.SQRT1_2) * (a + b) - b
          , d = (0,
        p.moveBy)(c, c) + (0,
        p.arc)("a", "0 0,0", a, (0,
        p.point)(-c - b, a - c))
          , f = (0,
        p.arc)("a", "0 0,0", a + b, (0,
        p.point)(a + b, a + b))
          , g = (0,
        p.moveBy)(c, -c) + (0,
        p.arc)("a", "0 0,0", a + b, (0,
        p.point)(a - c, c + b));
        return {
            width: a + b,
            height: a,
            pathTop: function(k) {
                return k ? d : ""
            },
            pathBottom: function(k) {
                return k ? f : g
            }
        }
    }
    ;
    pc.prototype.makeOutsideCorner = function() {
        var a = this.constantProvider.CORNER_RADIUS
          , b = this.OFFSET
          , c = (1 - Math.SQRT1_2) * (a - b) + b
          , d = (0,
        p.moveBy)(c, c) + (0,
        p.arc)("a", "0 0,1", a - b, (0,
        p.point)(a - c, -c + b))
          , f = (0,
        p.moveBy)(b, a) + (0,
        p.arc)("a", "0 0,1", a - b, (0,
        p.point)(a, -a + b))
          , g = -c
          , k = (0,
        p.moveBy)(c, g) + (0,
        p.arc)("a", "0 0,1", a - b, (0,
        p.point)(-c + b, -g - a));
        return {
            height: a,
            topLeft: function(n) {
                return n ? d : f
            },
            bottomLeft: function() {
                return k
            }
        }
    }
    ;
    pc.prototype.makePuzzleTab = function() {
        var a = this.constantProvider.TAB_WIDTH
          , b = this.constantProvider.TAB_HEIGHT
          , c = (0,
        p.moveBy)(-2, -b + 3.4) + (0,
        p.lineTo)(-.45 * a, -2.1)
          , d = (0,
        p.lineOnAxis)("v", 2.5) + (0,
        p.moveBy)(.97 * -a, 2.5) + (0,
        p.curve)("q", [(0,
        p.point)(.05 * -a, 10), (0,
        p.point)(.3 * a, 9.5)]) + (0,
        p.moveBy)(.67 * a, -1.9) + (0,
        p.lineOnAxis)("v", 2.5)
          , f = (0,
        p.lineOnAxis)("v", -1.5) + (0,
        p.moveBy)(-.92 * a, -.5) + (0,
        p.curve)("q", [(0,
        p.point)(-.19 * a, -5.5), (0,
        p.point)(0, -11)]) + (0,
        p.moveBy)(.92 * a, 1)
          , g = (0,
        p.moveBy)(-5, b - .7) + (0,
        p.lineTo)(.46 * a, -2.1);
        return {
            width: a,
            height: b,
            pathUp: function(k) {
                return k ? c : f
            },
            pathDown: function(k) {
                return k ? d : g
            }
        }
    }
    ;
    pc.prototype.makeNotch = function() {
        return {
            pathLeft: (0,
            p.lineOnAxis)("h", this.OFFSET) + this.constantProvider.NOTCH.pathLeft
        }
    }
    ;
    pc.prototype.makeJaggedTeeth = function() {
        return {
            pathLeft: (0,
            p.lineTo)(5.1, 2.6) + (0,
            p.moveBy)(-10.2, 6.8) + (0,
            p.lineTo)(5.1, 2.6),
            height: 12,
            width: 10.2
        }
    }
    ;
    pc.prototype.makeStartHat = function() {
        var a = this.constantProvider.START_HAT.height
          , b = (0,
        p.moveBy)(25, -8.7) + (0,
        p.curve)("c", [(0,
        p.point)(29.7, -6.2), (0,
        p.point)(57.2, -.5), (0,
        p.point)(75, 8.7)])
          , c = (0,
        p.curve)("c", [(0,
        p.point)(17.8, -9.2), (0,
        p.point)(45.3, -14.9), (0,
        p.point)(75, -8.7)]) + (0,
        p.moveTo)(100.5, a + .5);
        return {
            path: function(d) {
                return d ? b : c
            }
        }
    }
    ;
    var Id = {
        InlineInput: function(a, b) {
            Id.InlineInput.superClass_.constructor.call(this, a, b);
            this.connectedBlock && (this.width += this.constants_.DARK_PATH_OFFSET,
            this.height += this.constants_.DARK_PATH_OFFSET)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Id.InlineInput, bd.InlineInput);
    var Za = {
        RenderInfo: function(a, b) {
            Za.RenderInfo.superClass_.constructor.call(this, a, b)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Za.RenderInfo, qa);
    Za.RenderInfo.prototype.getRenderer = function() {
        return this.renderer_
    }
    ;
    Za.RenderInfo.prototype.populateBottomRow_ = function() {
        Za.RenderInfo.superClass_.populateBottomRow_.call(this);
        this.block_.inputList.length && this.block_.inputList[this.block_.inputList.length - 1].type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT || (this.bottomRow.minHeight = this.constants_.MEDIUM_PADDING - this.constants_.DARK_PATH_OFFSET)
    }
    ;
    Za.RenderInfo.prototype.addInput_ = function(a, b) {
        this.isInline && a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? (b.elements.push(new Id.InlineInput(this.constants_,a)),
        b.hasInlineInput = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT ? (b.elements.push(new Hd.StatementInput(this.constants_,a)),
        b.hasStatement = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.VALUE ? (b.elements.push(new ad.ExternalValueInput(this.constants_,a)),
        b.hasExternalInput = !0) : a.type === e.module$exports$Blockly$inputTypes.inputTypes.DUMMY && (b.minHeight = Math.max(b.minHeight, this.constants_.DUMMY_INPUT_MIN_HEIGHT),
        b.hasDummyInput = !0);
        this.isInline || null !== b.align || (b.align = a.align)
    }
    ;
    Za.RenderInfo.prototype.addElemSpacing_ = function() {
        for (var a = !1, b = 0, c; c = this.rows[b]; b++)
            c.hasExternalInput && (a = !0);
        for (b = 0; c = this.rows[b]; b++) {
            var d = c.elements;
            c.elements = [];
            c.startsWithElemSpacer() && c.elements.push(new ib.InRowSpacer(this.constants_,this.getInRowSpacing_(null, d[0])));
            if (d.length) {
                for (var f = 0; f < d.length - 1; f++) {
                    c.elements.push(d[f]);
                    var g = this.getInRowSpacing_(d[f], d[f + 1]);
                    c.elements.push(new ib.InRowSpacer(this.constants_,g))
                }
                c.elements.push(d[d.length - 1]);
                c.endsWithElemSpacer() && (d = this.getInRowSpacing_(d[d.length - 1], null),
                a && c.hasDummyInput && (d += this.constants_.TAB_WIDTH),
                c.elements.push(new ib.InRowSpacer(this.constants_,d)))
            }
        }
    }
    ;
    Za.RenderInfo.prototype.getInRowSpacing_ = function(a, b) {
        if (!a)
            return b && m.isField(b) && b.isEditable ? this.constants_.MEDIUM_PADDING : b && m.isInlineInput(b) ? this.constants_.MEDIUM_LARGE_PADDING : b && m.isStatementInput(b) ? this.constants_.STATEMENT_INPUT_PADDING_LEFT : this.constants_.LARGE_PADDING;
        if (!m.isInput(a) && (!b || m.isStatementInput(b)))
            return m.isField(a) && a.isEditable ? this.constants_.MEDIUM_PADDING : m.isIcon(a) ? 2 * this.constants_.LARGE_PADDING + 1 : m.isHat(a) ? this.constants_.NO_PADDING : m.isPreviousOrNextConnection(a) ? this.constants_.LARGE_PADDING : m.isLeftRoundedCorner(a) ? this.constants_.MIN_BLOCK_WIDTH : m.isJaggedEdge(a) ? this.constants_.NO_PADDING : this.constants_.LARGE_PADDING;
        if (m.isInput(a) && !b) {
            if (m.isExternalInput(a))
                return this.constants_.NO_PADDING;
            if (m.isInlineInput(a))
                return this.constants_.LARGE_PADDING;
            if (m.isStatementInput(a))
                return this.constants_.NO_PADDING
        }
        if (!m.isInput(a) && b && m.isInput(b)) {
            if (m.isField(a) && a.isEditable) {
                if (m.isInlineInput(b) || m.isExternalInput(b))
                    return this.constants_.SMALL_PADDING
            } else {
                if (m.isInlineInput(b) || m.isExternalInput(b))
                    return this.constants_.MEDIUM_LARGE_PADDING;
                if (m.isStatementInput(b))
                    return this.constants_.LARGE_PADDING
            }
            return this.constants_.LARGE_PADDING - 1
        }
        if (m.isIcon(a) && b && !m.isInput(b))
            return this.constants_.LARGE_PADDING;
        if (m.isInlineInput(a) && b && m.isField(b))
            return b.isEditable ? this.constants_.MEDIUM_PADDING : this.constants_.LARGE_PADDING;
        if (m.isLeftSquareCorner(a) && b) {
            if (m.isHat(b))
                return this.constants_.NO_PADDING;
            if (m.isPreviousConnection(b))
                return b.notchOffset;
            if (m.isNextConnection(b))
                return b.notchOffset + (this.RTL ? 1 : -1) * this.constants_.DARK_PATH_OFFSET / 2
        }
        if (m.isLeftRoundedCorner(a) && b) {
            if (m.isPreviousConnection(b))
                return b.notchOffset - this.constants_.CORNER_RADIUS;
            if (m.isNextConnection(b))
                return b.notchOffset - this.constants_.CORNER_RADIUS + (this.RTL ? 1 : -1) * this.constants_.DARK_PATH_OFFSET / 2
        }
        return m.isField(a) && b && m.isField(b) && a.isEditable === b.isEditable || b && m.isJaggedEdge(b) ? this.constants_.LARGE_PADDING : this.constants_.MEDIUM_PADDING
    }
    ;
    Za.RenderInfo.prototype.getSpacerRowHeight_ = function(a, b) {
        return m.isTopRow(a) && m.isBottomRow(b) ? this.constants_.EMPTY_BLOCK_SPACER_HEIGHT : m.isTopRow(a) || m.isBottomRow(b) ? this.constants_.NO_PADDING : a.hasExternalInput && b.hasExternalInput ? this.constants_.LARGE_PADDING : !a.hasStatement && b.hasStatement ? this.constants_.BETWEEN_STATEMENT_PADDING_Y : a.hasStatement && b.hasStatement || !a.hasStatement && b.hasDummyInput || a.hasDummyInput ? this.constants_.LARGE_PADDING : this.constants_.MEDIUM_PADDING
    }
    ;
    Za.RenderInfo.prototype.getElemCenterline_ = function(a, b) {
        if (m.isSpacer(b))
            return a.yPos + b.height / 2;
        if (m.isBottomRow(a))
            return a = a.yPos + a.height - a.descenderHeight,
            m.isNextConnection(b) ? a + b.height / 2 : a - b.height / 2;
        if (m.isTopRow(a))
            return m.isHat(b) ? a.capline - b.height / 2 : a.capline + b.height / 2;
        var c = a.yPos;
        m.isField(b) || m.isIcon(b) ? (c += b.height / 2,
        (a.hasInlineInput || a.hasStatement) && b.height + this.constants_.TALL_INPUT_FIELD_OFFSET_Y <= a.height && (c += this.constants_.TALL_INPUT_FIELD_OFFSET_Y)) : c = m.isInlineInput(b) ? c + b.height / 2 : c + a.height / 2;
        return c
    }
    ;
    Za.RenderInfo.prototype.alignRowElements_ = function() {
        if (this.isInline) {
            for (var a = 0, b = null, c = this.rows.length - 1, d; d = this.rows[c]; c--)
                d.nextRightEdge = a,
                m.isInputRow(d) && (d.hasStatement && this.alignStatementRow_(d),
                b && b.hasStatement && d.width < b.width ? d.nextRightEdge = b.width : a = d.width,
                b = d);
            for (a = c = 0; b = this.rows[a]; a++)
                b.hasStatement ? c = this.getDesiredRowWidth_(b) : m.isSpacer(b) ? b.width = Math.max(c, b.nextRightEdge) : (c = Math.max(c, b.nextRightEdge) - b.width,
                0 < c && this.addAlignmentPadding_(b, c),
                c = b.width)
        } else
            Za.RenderInfo.superClass_.alignRowElements_.call(this)
    }
    ;
    Za.RenderInfo.prototype.getDesiredRowWidth_ = function(a) {
        return this.isInline && a.hasStatement ? this.statementEdge + this.constants_.MAX_BOTTOM_WIDTH + this.startX : Za.RenderInfo.superClass_.getDesiredRowWidth_.call(this, a)
    }
    ;
    Za.RenderInfo.prototype.finalize_ = function() {
        for (var a = 0, b = 0, c = 0, d; d = this.rows[c]; c++) {
            d.yPos = b;
            d.xPos = this.startX;
            b += d.height;
            a = Math.max(a, d.widthWithConnectedBlocks);
            var f = b - this.topRow.ascenderHeight;
            d === this.bottomRow && f < this.constants_.MIN_BLOCK_HEIGHT && (f = this.constants_.MIN_BLOCK_HEIGHT - f,
            this.bottomRow.height += f,
            b += f);
            this.recordElemPositions_(d)
        }
        this.outputConnection && this.block_.nextConnection && this.block_.nextConnection.isConnected() && (a = Math.max(a, this.block_.nextConnection.targetBlock().getHeightWidth().width - this.constants_.DARK_PATH_OFFSET));
        this.bottomRow.baseline = b - this.bottomRow.descenderHeight;
        this.widthWithChildren = a + this.startX + this.constants_.DARK_PATH_OFFSET;
        this.width += this.constants_.DARK_PATH_OFFSET;
        this.height = b + this.constants_.DARK_PATH_OFFSET;
        this.startY = this.topRow.capline
    }
    ;
    var qb = {
        Renderer: function(a) {
            qb.Renderer.superClass_.constructor.call(this, a);
            this.highlightConstants_ = null
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(qb.Renderer, La);
    qb.Renderer.prototype.init = function(a, b) {
        qb.Renderer.superClass_.init.call(this, a, b);
        this.highlightConstants_ = this.makeHighlightConstants_();
        this.highlightConstants_.init()
    }
    ;
    qb.Renderer.prototype.refreshDom = function(a, b) {
        qb.Renderer.superClass_.refreshDom.call(this, a, b);
        this.getHighlightConstants().init()
    }
    ;
    qb.Renderer.prototype.makeConstants_ = function() {
        return new Qc.ConstantProvider
    }
    ;
    qb.Renderer.prototype.makeRenderInfo_ = function(a) {
        return new Za.RenderInfo(this,a)
    }
    ;
    qb.Renderer.prototype.makeDrawer_ = function(a, b) {
        return new Da.Drawer(a,b)
    }
    ;
    qb.Renderer.prototype.makePathObject = function(a, b) {
        return new wb(a,b,this.getConstants())
    }
    ;
    qb.Renderer.prototype.makeHighlightConstants_ = function() {
        return new pc(this.getConstants())
    }
    ;
    qb.Renderer.prototype.getHighlightConstants = function() {
        return this.highlightConstants_
    }
    ;
    (0,
    fa.register)("geras", qb.Renderer);
    var Zb = {};
    Zb.ConstantProvider = Qc.ConstantProvider;
    Zb.Drawer = Da.Drawer;
    Zb.HighlightConstantProvider = pc;
    Zb.Highlighter = Mb;
    Zb.InlineInput = Id.InlineInput;
    Zb.PathObject = wb;
    Zb.RenderInfo = Za.RenderInfo;
    Zb.Renderer = qb.Renderer;
    Zb.StatementInput = Hd.StatementInput;
    var qf = new fb("zelos",{
        colour_blocks: {
            colourPrimary: "#CF63CF",
            colourSecondary: "#C94FC9",
            colourTertiary: "#BD42BD"
        },
        list_blocks: {
            colourPrimary: "#9966FF",
            colourSecondary: "#855CD6",
            colourTertiary: "#774DCB"
        },
        logic_blocks: {
            colourPrimary: "#4C97FF",
            colourSecondary: "#4280D7",
            colourTertiary: "#3373CC"
        },
        loop_blocks: {
            colourPrimary: "#0fBD8C",
            colourSecondary: "#0DA57A",
            colourTertiary: "#0B8E69"
        },
        math_blocks: {
            colourPrimary: "#59C059",
            colourSecondary: "#46B946",
            colourTertiary: "#389438"
        },
        procedure_blocks: {
            colourPrimary: "#FF6680",
            colourSecondary: "#FF4D6A",
            colourTertiary: "#FF3355"
        },
        text_blocks: {
            colourPrimary: "#FFBF00",
            colourSecondary: "#E6AC00",
            colourTertiary: "#CC9900"
        },
        variable_blocks: {
            colourPrimary: "#FF8C1A",
            colourSecondary: "#FF8000",
            colourTertiary: "#DB6E00"
        },
        variable_dynamic_blocks: {
            colourPrimary: "#FF8C1A",
            colourSecondary: "#FF8000",
            colourTertiary: "#DB6E00"
        },
        hat_blocks: {
            colourPrimary: "#4C97FF",
            colourSecondary: "#4280D7",
            colourTertiary: "#3373CC",
            hat: "cap"
        }
    },{
        colour_category: {
            colour: "#CF63CF"
        },
        list_category: {
            colour: "#9966FF"
        },
        logic_category: {
            colour: "#4C97FF"
        },
        loop_category: {
            colour: "#0fBD8C"
        },
        math_category: {
            colour: "#59C059"
        },
        procedure_category: {
            colour: "#FF6680"
        },
        text_category: {
            colour: "#FFBF00"
        },
        variable_category: {
            colour: "#FF8C1A"
        },
        variable_dynamic_category: {
            colour: "#FF8C1A"
        }
    });
    var ae = {};
    ae.Classic = nd;
    ae.Zelos = qf;
    var eb = {
        names: {
            ESCAPE: "escape",
            DELETE: "delete",
            COPY: "copy",
            CUT: "cut",
            PASTE: "paste",
            UNDO: "undo",
            REDO: "redo"
        },
        registerEscape: function() {
            var a = {
                name: eb.names.ESCAPE,
                preconditionFn: function(b) {
                    return !b.options.readOnly
                },
                callback: function(b) {
                    b.hideChaff();
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            K.ShortcutRegistry.registry.addKeyMapping(H.ESC, a.name)
        },
        registerDelete: function() {
            var a = {
                name: eb.names.DELETE,
                preconditionFn: function(b) {
                    var c = (0,
                    e.module$exports$Blockly$common.getSelected)();
                    return !b.options.readOnly && c && c.isDeletable()
                },
                callback: function(b, c) {
                    c.preventDefault();
                    if (U.inProgress())
                        return !1;
                    (0,
                    e.module$exports$Blockly$common.getSelected)().checkAndDelete();
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            K.ShortcutRegistry.registry.addKeyMapping(H.DELETE, a.name);
            K.ShortcutRegistry.registry.addKeyMapping(H.BACKSPACE, a.name)
        },
        registerCopy: function() {
            var a = {
                name: eb.names.COPY,
                preconditionFn: function(c) {
                    var d = (0,
                    e.module$exports$Blockly$common.getSelected)();
                    return !c.options.readOnly && !U.inProgress() && d && d.isDeletable() && d.isMovable()
                },
                callback: function(c, d) {
                    d.preventDefault();
                    c.hideChaff();
                    (0,
                    rb.copy)((0,
                    e.module$exports$Blockly$common.getSelected)());
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            var b = K.ShortcutRegistry.registry.createSerializedKey(H.C, [H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.C, [H.ALT]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.C, [H.META]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name)
        },
        registerCut: function() {
            var a = {
                name: eb.names.CUT,
                preconditionFn: function(c) {
                    var d = (0,
                    e.module$exports$Blockly$common.getSelected)();
                    return !c.options.readOnly && !U.inProgress() && d && d.isDeletable() && d.isMovable() && !d.workspace.isFlyout
                },
                callback: function() {
                    var c = (0,
                    e.module$exports$Blockly$common.getSelected)();
                    if (!c)
                        return !1;
                    (0,
                    rb.copy)(c);
                    c.checkAndDelete();
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            var b = K.ShortcutRegistry.registry.createSerializedKey(H.X, [H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.X, [H.ALT]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.X, [H.META]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name)
        },
        registerPaste: function() {
            var a = {
                name: eb.names.PASTE,
                preconditionFn: function(c) {
                    return !c.options.readOnly && !U.inProgress()
                },
                callback: function() {
                    return (0,
                    rb.paste)()
                }
            };
            K.ShortcutRegistry.registry.register(a);
            var b = K.ShortcutRegistry.registry.createSerializedKey(H.V, [H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.V, [H.ALT]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.V, [H.META]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name)
        },
        registerUndo: function() {
            var a = {
                name: eb.names.UNDO,
                preconditionFn: function(c) {
                    return !c.options.readOnly && !U.inProgress()
                },
                callback: function(c) {
                    c.hideChaff();
                    c.undo(!1);
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            var b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.ALT]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.META]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name)
        },
        registerRedo: function() {
            var a = {
                name: eb.names.REDO,
                preconditionFn: function(c) {
                    return !U.inProgress() && !c.options.readOnly
                },
                callback: function(c) {
                    c.hideChaff();
                    c.undo(!0);
                    return !0
                }
            };
            K.ShortcutRegistry.registry.register(a);
            var b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.SHIFT, H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.SHIFT, H.ALT]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.Z, [H.SHIFT, H.META]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name);
            b = K.ShortcutRegistry.registry.createSerializedKey(H.Y, [H.CTRL]);
            K.ShortcutRegistry.registry.addKeyMapping(b, a.name)
        },
        registerDefaultShortcuts: function() {
            (0,
            eb.registerEscape)();
            (0,
            eb.registerDelete)();
            (0,
            eb.registerCopy)();
            (0,
            eb.registerCut)();
            (0,
            eb.registerPaste)();
            (0,
            eb.registerUndo)();
            (0,
            eb.registerRedo)()
        }
    };
    (0,
    eb.registerDefaultShortcuts)();
    var Rc = function(a) {
        this.isBlank = "undefined" === typeof a;
        this.workspaceId = a ? a.id : "";
        this.group = (0,
        h.getGroup)();
        this.recordUndo = !1
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Rc, zb);
    Rc.prototype.type = h.FINISHED_LOADING;
    Rc.prototype.toJson = function() {
        var a = {
            type: this.type
        };
        this.group && (a.group = this.group);
        this.workspaceId && (a.workspaceId = this.workspaceId);
        return a
    }
    ;
    Rc.prototype.fromJson = function(a) {
        this.isBlank = !1;
        this.workspaceId = a.workspaceId;
        this.group = a.group
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.FINISHED_LOADING, Rc);
    var qc = {
        Ui: function(a, b, c, d) {
            qc.Ui.superClass_.constructor.call(this, a ? a.workspace.id : void 0);
            this.blockId = a ? a.id : null;
            this.element = "undefined" === typeof b ? "" : b;
            this.oldValue = "undefined" === typeof c ? "" : c;
            this.newValue = "undefined" === typeof d ? "" : d
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(qc.Ui, ob.UiBase);
    qc.Ui.prototype.type = h.UI;
    qc.Ui.prototype.toJson = function() {
        var a = qc.Ui.superClass_.toJson.call(this);
        a.element = this.element;
        void 0 !== this.newValue && (a.newValue = this.newValue);
        this.blockId && (a.blockId = this.blockId);
        return a
    }
    ;
    qc.Ui.prototype.fromJson = function(a) {
        qc.Ui.superClass_.fromJson.call(this, a);
        this.element = a.element;
        this.newValue = a.newValue;
        this.blockId = a.blockId
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.UI, qc.Ui);
    var rc = {
        BubbleOpen: function(a, b, c) {
            rc.BubbleOpen.superClass_.constructor.call(this, a ? a.workspace.id : void 0);
            this.blockId = a ? a.id : null;
            this.isOpen = b;
            this.bubbleType = c
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(rc.BubbleOpen, ob.UiBase);
    rc.BubbleOpen.prototype.type = h.BUBBLE_OPEN;
    rc.BubbleOpen.prototype.toJson = function() {
        var a = rc.BubbleOpen.superClass_.toJson.call(this);
        a.isOpen = this.isOpen;
        a.bubbleType = this.bubbleType;
        a.blockId = this.blockId;
        return a
    }
    ;
    rc.BubbleOpen.prototype.fromJson = function(a) {
        rc.BubbleOpen.superClass_.fromJson.call(this, a);
        this.isOpen = a.isOpen;
        this.bubbleType = a.bubbleType;
        this.blockId = a.blockId
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.BUBBLE_OPEN, rc.BubbleOpen);
    var Nb = {
        CommentChange: function(a, b, c) {
            Nb.CommentChange.superClass_.constructor.call(this, a);
            a && (this.oldContents_ = "undefined" === typeof b ? "" : b,
            this.newContents_ = "undefined" === typeof c ? "" : c)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Nb.CommentChange, ub);
    Nb.CommentChange.prototype.type = h.COMMENT_CHANGE;
    Nb.CommentChange.prototype.toJson = function() {
        var a = Nb.CommentChange.superClass_.toJson.call(this);
        a.oldContents = this.oldContents_;
        a.newContents = this.newContents_;
        return a
    }
    ;
    Nb.CommentChange.prototype.fromJson = function(a) {
        Nb.CommentChange.superClass_.fromJson.call(this, a);
        this.oldContents_ = a.oldContents;
        this.newContents_ = a.newContents
    }
    ;
    Nb.CommentChange.prototype.isNull = function() {
        return this.oldContents_ === this.newContents_
    }
    ;
    Nb.CommentChange.prototype.run = function(a) {
        var b = this.getEventWorkspace_().getCommentById(this.commentId);
        b ? b.setContent(a ? this.newContents_ : this.oldContents_) : console.warn("Can't change non-existent comment: " + this.commentId)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.COMMENT_CHANGE, Nb.CommentChange);
    var $b = {
        CommentCreate: function(a) {
            $b.CommentCreate.superClass_.constructor.call(this, a);
            a && (this.xml = a.toXmlWithXY())
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)($b.CommentCreate, ub);
    $b.CommentCreate.prototype.type = h.COMMENT_CREATE;
    $b.CommentCreate.prototype.toJson = function() {
        var a = $b.CommentCreate.superClass_.toJson.call(this);
        a.xml = (0,
        e.module$exports$Blockly$Xml.domToText)(this.xml);
        return a
    }
    ;
    $b.CommentCreate.prototype.fromJson = function(a) {
        $b.CommentCreate.superClass_.fromJson.call(this, a);
        this.xml = (0,
        e.module$exports$Blockly$Xml.textToDom)(a.xml)
    }
    ;
    $b.CommentCreate.prototype.run = function(a) {
        ub.CommentCreateDeleteHelper(this, a)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.COMMENT_CREATE, $b.CommentCreate);
    var ac = {
        CommentDelete: function(a) {
            ac.CommentDelete.superClass_.constructor.call(this, a);
            a && (this.xml = a.toXmlWithXY())
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(ac.CommentDelete, ub);
    ac.CommentDelete.prototype.type = h.COMMENT_DELETE;
    ac.CommentDelete.prototype.toJson = function() {
        return ac.CommentDelete.superClass_.toJson.call(this)
    }
    ;
    ac.CommentDelete.prototype.fromJson = function(a) {
        ac.CommentDelete.superClass_.fromJson.call(this, a)
    }
    ;
    ac.CommentDelete.prototype.run = function(a) {
        ub.CommentCreateDeleteHelper(this, !a)
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.COMMENT_DELETE, ac.CommentDelete);
    var sc = {
        TrashcanOpen: function(a, b) {
            sc.TrashcanOpen.superClass_.constructor.call(this, b);
            this.isOpen = a
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(sc.TrashcanOpen, ob.UiBase);
    sc.TrashcanOpen.prototype.type = h.TRASHCAN_OPEN;
    sc.TrashcanOpen.prototype.toJson = function() {
        var a = sc.TrashcanOpen.superClass_.toJson.call(this);
        a.isOpen = this.isOpen;
        return a
    }
    ;
    sc.TrashcanOpen.prototype.fromJson = function(a) {
        sc.TrashcanOpen.superClass_.fromJson.call(this, a);
        this.isOpen = a.isOpen
    }
    ;
    (0,
    r.register)(r.Type.EVENT, h.TRASHCAN_OPEN, sc.TrashcanOpen);
    e.module$exports$Blockly$Events = {
        Abstract: zb
    };
    e.module$exports$Blockly$Events.BubbleOpen = rc.BubbleOpen;
    e.module$exports$Blockly$Events.BlockBase = Eb.BlockBase;
    e.module$exports$Blockly$Events.BlockChange = $a.BlockChange;
    e.module$exports$Blockly$Events.BlockCreate = Pb.BlockCreate;
    e.module$exports$Blockly$Events.BlockDelete = Xb.BlockDelete;
    e.module$exports$Blockly$Events.BlockDrag = fc.BlockDrag;
    e.module$exports$Blockly$Events.BlockMove = tb.BlockMove;
    e.module$exports$Blockly$Events.Click = gc.Click;
    e.module$exports$Blockly$Events.CommentBase = ub;
    e.module$exports$Blockly$Events.CommentChange = Nb.CommentChange;
    e.module$exports$Blockly$Events.CommentCreate = $b.CommentCreate;
    e.module$exports$Blockly$Events.CommentDelete = ac.CommentDelete;
    e.module$exports$Blockly$Events.CommentMove = vb.CommentMove;
    e.module$exports$Blockly$Events.FinishedLoading = Rc;
    e.module$exports$Blockly$Events.MarkerMove = hc.MarkerMove;
    e.module$exports$Blockly$Events.Selected = kc.Selected;
    e.module$exports$Blockly$Events.ThemeChange = mc.ThemeChange;
    e.module$exports$Blockly$Events.ToolboxItemSelect = oc.ToolboxItemSelect;
    e.module$exports$Blockly$Events.TrashcanOpen = sc.TrashcanOpen;
    e.module$exports$Blockly$Events.Ui = qc.Ui;
    e.module$exports$Blockly$Events.UiBase = ob.UiBase;
    e.module$exports$Blockly$Events.VarBase = Sb.VarBase;
    e.module$exports$Blockly$Events.VarCreate = Tb.VarCreate;
    e.module$exports$Blockly$Events.VarDelete = Ub.VarDelete;
    e.module$exports$Blockly$Events.VarRename = Vb.VarRename;
    e.module$exports$Blockly$Events.ViewportChange = nc.ViewportChange;
    e.module$exports$Blockly$Events.BLOCK_CHANGE = h.CHANGE;
    e.module$exports$Blockly$Events.BLOCK_CREATE = h.CREATE;
    e.module$exports$Blockly$Events.BLOCK_DELETE = h.DELETE;
    e.module$exports$Blockly$Events.BLOCK_DRAG = h.BLOCK_DRAG;
    e.module$exports$Blockly$Events.BLOCK_MOVE = h.MOVE;
    e.module$exports$Blockly$Events.BUBBLE_OPEN = h.BUBBLE_OPEN;
    e.module$exports$Blockly$Events.BumpEvent = h.BumpEvent;
    e.module$exports$Blockly$Events.BUMP_EVENTS = h.BUMP_EVENTS;
    e.module$exports$Blockly$Events.CHANGE = h.CHANGE;
    e.module$exports$Blockly$Events.CLICK = h.CLICK;
    e.module$exports$Blockly$Events.COMMENT_CHANGE = h.COMMENT_CHANGE;
    e.module$exports$Blockly$Events.COMMENT_CREATE = h.COMMENT_CREATE;
    e.module$exports$Blockly$Events.COMMENT_DELETE = h.COMMENT_DELETE;
    e.module$exports$Blockly$Events.COMMENT_MOVE = h.COMMENT_MOVE;
    e.module$exports$Blockly$Events.CREATE = h.CREATE;
    e.module$exports$Blockly$Events.DELETE = h.DELETE;
    e.module$exports$Blockly$Events.FINISHED_LOADING = h.FINISHED_LOADING;
    e.module$exports$Blockly$Events.MARKER_MOVE = h.MARKER_MOVE;
    e.module$exports$Blockly$Events.MOVE = h.MOVE;
    e.module$exports$Blockly$Events.SELECTED = h.SELECTED;
    e.module$exports$Blockly$Events.THEME_CHANGE = h.THEME_CHANGE;
    e.module$exports$Blockly$Events.TOOLBOX_ITEM_SELECT = h.TOOLBOX_ITEM_SELECT;
    e.module$exports$Blockly$Events.TRASHCAN_OPEN = h.TRASHCAN_OPEN;
    e.module$exports$Blockly$Events.UI = h.UI;
    e.module$exports$Blockly$Events.VAR_CREATE = h.VAR_CREATE;
    e.module$exports$Blockly$Events.VAR_DELETE = h.VAR_DELETE;
    e.module$exports$Blockly$Events.VAR_RENAME = h.VAR_RENAME;
    e.module$exports$Blockly$Events.VIEWPORT_CHANGE = h.VIEWPORT_CHANGE;
    e.module$exports$Blockly$Events.clearPendingUndo = h.clearPendingUndo;
    e.module$exports$Blockly$Events.disable = h.disable;
    e.module$exports$Blockly$Events.enable = h.enable;
    e.module$exports$Blockly$Events.filter = h.filter;
    e.module$exports$Blockly$Events.fire = h.fire;
    e.module$exports$Blockly$Events.fromJson = h.fromJson;
    e.module$exports$Blockly$Events.getDescendantIds = h.getDescendantIds;
    e.module$exports$Blockly$Events.get = h.get;
    e.module$exports$Blockly$Events.getGroup = h.getGroup;
    e.module$exports$Blockly$Events.getRecordUndo = h.getRecordUndo;
    e.module$exports$Blockly$Events.isEnabled = h.isEnabled;
    e.module$exports$Blockly$Events.setGroup = h.setGroup;
    e.module$exports$Blockly$Events.setRecordUndo = h.setRecordUndo;
    e.module$exports$Blockly$Events.disableOrphans = h.disableOrphans;
    Object.defineProperties(e.module$exports$Blockly$Events, {
        recordUndo: {
            get: function() {
                (0,
                V.warn)("Blockly.Events.recordUndo", "September 2021", "September 2022", "Blockly.Events.getRecordUndo()");
                return (0,
                h.getRecordUndo)()
            },
            set: function(a) {
                (0,
                V.warn)("Blockly.Events.recordUndo", "September 2021", "September 2022", "Blockly.Events.setRecordUndo()");
                (0,
                h.setRecordUndo)(a)
            }
        }
    });
    var ta = {
        registerUndo: function() {
            ba.ContextMenuRegistry.registry.register({
                displayText: function() {
                    return e.module$exports$Blockly$Msg.Msg.UNDO
                },
                preconditionFn: function(a) {
                    return 0 < a.workspace.getUndoStack().length ? "enabled" : "disabled"
                },
                callback: function(a) {
                    a.workspace.undo(!1)
                },
                scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
                id: "undoWorkspace",
                weight: 1
            })
        },
        registerRedo: function() {
            ba.ContextMenuRegistry.registry.register({
                displayText: function() {
                    return e.module$exports$Blockly$Msg.Msg.REDO
                },
                preconditionFn: function(a) {
                    return 0 < a.workspace.getRedoStack().length ? "enabled" : "disabled"
                },
                callback: function(a) {
                    a.workspace.undo(!0)
                },
                scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
                id: "redoWorkspace",
                weight: 2
            })
        },
        registerCleanup: function() {
            ba.ContextMenuRegistry.registry.register({
                displayText: function() {
                    return e.module$exports$Blockly$Msg.Msg.CLEAN_UP
                },
                preconditionFn: function(a) {
                    return a.workspace.isMovable() ? 1 < a.workspace.getTopBlocks(!1).length ? "enabled" : "disabled" : "hidden"
                },
                callback: function(a) {
                    a.workspace.cleanUp()
                },
                scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
                id: "cleanWorkspace",
                weight: 3
            })
        }
    }
      , Me = function(a, b) {
        var c = 0
          , d = 0
          , f = function(n) {
            d--;
            n.setCollapsed(a);
            0 === d && (0,
            e.module$exports$Blockly$Events.setGroup)(!1)
        };
        (0,
        e.module$exports$Blockly$Events.setGroup)(!0);
        for (var g = 0; g < b.length; g++)
            for (var k = b[g]; k; )
                d++,
                setTimeout(f.bind(null, k), c),
                k = k.getNextBlock(),
                c += 10
    };
    ta.registerCollapse = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function() {
                return e.module$exports$Blockly$Msg.Msg.COLLAPSE_ALL
            },
            preconditionFn: function(a) {
                if (a.workspace.options.collapse) {
                    a = a.workspace.getTopBlocks(!1);
                    for (var b = 0; b < a.length; b++)
                        for (var c = a[b]; c; ) {
                            if (!c.isCollapsed())
                                return "enabled";
                            c = c.getNextBlock()
                        }
                    return "disabled"
                }
                return "hidden"
            },
            callback: function(a) {
                Me(!0, a.workspace.getTopBlocks(!0))
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
            id: "collapseWorkspace",
            weight: 4
        })
    }
    ;
    ta.registerExpand = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function() {
                return e.module$exports$Blockly$Msg.Msg.EXPAND_ALL
            },
            preconditionFn: function(a) {
                if (a.workspace.options.collapse) {
                    a = a.workspace.getTopBlocks(!1);
                    for (var b = 0; b < a.length; b++)
                        for (var c = a[b]; c; ) {
                            if (c.isCollapsed())
                                return "enabled";
                            c = c.getNextBlock()
                        }
                    return "disabled"
                }
                return "hidden"
            },
            callback: function(a) {
                Me(!1, a.workspace.getTopBlocks(!0))
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
            id: "expandWorkspace",
            weight: 5
        })
    }
    ;
    var Ne = function(a, b) {
        if (a.isDeletable())
            Array.prototype.push.apply(b, a.getDescendants(!1));
        else {
            a = a.getChildren(!1);
            for (var c = 0; c < a.length; c++)
                Ne(a[c], b)
        }
    }
      , be = function(a) {
        var b = [];
        a = a.getTopBlocks(!0);
        for (var c = 0; c < a.length; c++)
            Ne(a[c], b);
        return b
    }
      , Jd = function(a, b) {
        (0,
        h.setGroup)(b);
        var c = a.shift();
        c && (c.workspace ? (c.dispose(!1, !0),
        setTimeout(Jd, 10, a, b)) : Jd(a, b));
        (0,
        h.setGroup)(!1)
    };
    ta.registerDeleteAll = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                if (a.workspace)
                    return a = be(a.workspace).length,
                    1 === a ? e.module$exports$Blockly$Msg.Msg.DELETE_BLOCK : e.module$exports$Blockly$Msg.Msg.DELETE_X_BLOCKS.replace("%1", String(a))
            },
            preconditionFn: function(a) {
                if (a.workspace)
                    return 0 < be(a.workspace).length ? "enabled" : "disabled"
            },
            callback: function(a) {
                if (a.workspace) {
                    a.workspace.cancelCurrentGesture();
                    var b = be(a.workspace)
                      , c = (0,
                    Va.genUid)();
                    2 > b.length ? Jd(b, c) : (0,
                    Oa.confirm)(e.module$exports$Blockly$Msg.Msg.DELETE_ALL_BLOCKS.replace("%1", String(b.length)), function(d) {
                        d && Jd(b, c)
                    })
                }
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.WORKSPACE,
            id: "workspaceDelete",
            weight: 6
        })
    }
    ;
    ta.registerDuplicate = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function() {
                return e.module$exports$Blockly$Msg.Msg.DUPLICATE_BLOCK
            },
            preconditionFn: function(a) {
                a = a.block;
                return !a.isInFlyout && a.isDeletable() && a.isMovable() ? a.isDuplicatable() ? "enabled" : "disabled" : "hidden"
            },
            callback: function(a) {
                a.block && (0,
                rb.duplicate)(a.block)
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockDuplicate",
            weight: 1
        })
    }
    ;
    ta.registerComment = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                return a.block.getCommentIcon() ? e.module$exports$Blockly$Msg.Msg.REMOVE_COMMENT : e.module$exports$Blockly$Msg.Msg.ADD_COMMENT
            },
            preconditionFn: function(a) {
                a = a.block;
                return O.IE || a.isInFlyout || !a.workspace.options.comments || a.isCollapsed() || !a.isEditable() ? "hidden" : "enabled"
            },
            callback: function(a) {
                a = a.block;
                a.getCommentIcon() ? a.setCommentText(null) : a.setCommentText("")
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockComment",
            weight: 2
        })
    }
    ;
    ta.registerInline = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                return a.block.getInputsInline() ? e.module$exports$Blockly$Msg.Msg.EXTERNAL_INPUTS : e.module$exports$Blockly$Msg.Msg.INLINE_INPUTS
            },
            preconditionFn: function(a) {
                a = a.block;
                if (!a.isInFlyout && a.isMovable() && !a.isCollapsed())
                    for (var b = 1; b < a.inputList.length; b++)
                        if (a.inputList[b - 1].type !== e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT && a.inputList[b].type !== e.module$exports$Blockly$inputTypes.inputTypes.STATEMENT)
                            return "enabled";
                return "hidden"
            },
            callback: function(a) {
                a.block.setInputsInline(!a.block.getInputsInline())
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockInline",
            weight: 3
        })
    }
    ;
    ta.registerCollapseExpandBlock = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                return a.block.isCollapsed() ? e.module$exports$Blockly$Msg.Msg.EXPAND_BLOCK : e.module$exports$Blockly$Msg.Msg.COLLAPSE_BLOCK
            },
            preconditionFn: function(a) {
                a = a.block;
                return !a.isInFlyout && a.isMovable() && a.workspace.options.collapse ? "enabled" : "hidden"
            },
            callback: function(a) {
                a.block.setCollapsed(!a.block.isCollapsed())
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockCollapseExpand",
            weight: 4
        })
    }
    ;
    ta.registerDisable = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                return a.block.isEnabled() ? e.module$exports$Blockly$Msg.Msg.DISABLE_BLOCK : e.module$exports$Blockly$Msg.Msg.ENABLE_BLOCK
            },
            preconditionFn: function(a) {
                a = a.block;
                return !a.isInFlyout && a.workspace.options.disable && a.isEditable() ? a.getInheritedDisabled() ? "disabled" : "enabled" : "hidden"
            },
            callback: function(a) {
                a = a.block;
                var b = (0,
                h.getGroup)();
                b || (0,
                h.setGroup)(!0);
                a.setEnabled(!a.isEnabled());
                b || (0,
                h.setGroup)(!1)
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockDisable",
            weight: 5
        })
    }
    ;
    ta.registerDelete = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function(a) {
                var b = a.block;
                a = b.getDescendants(!1).length;
                (b = b.getNextBlock()) && (a -= b.getDescendants(!1).length);
                return 1 === a ? e.module$exports$Blockly$Msg.Msg.DELETE_BLOCK : e.module$exports$Blockly$Msg.Msg.DELETE_X_BLOCKS.replace("%1", String(a))
            },
            preconditionFn: function(a) {
                return !a.block.isInFlyout && a.block.isDeletable() ? "enabled" : "hidden"
            },
            callback: function(a) {
                a.block && a.block.checkAndDelete()
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockDelete",
            weight: 6
        })
    }
    ;
    ta.registerHelp = function() {
        ba.ContextMenuRegistry.registry.register({
            displayText: function() {
                return e.module$exports$Blockly$Msg.Msg.HELP
            },
            preconditionFn: function(a) {
                a = a.block;
                return ("function" === typeof a.helpUrl ? a.helpUrl() : a.helpUrl) ? "enabled" : "hidden"
            },
            callback: function(a) {
                a.block.showHelp()
            },
            scopeType: ba.ContextMenuRegistry.ScopeType.BLOCK,
            id: "blockHelp",
            weight: 7
        })
    }
    ;
    ta.registerDefaultOptions = function() {
        (0,
        ta.registerUndo)();
        (0,
        ta.registerRedo)();
        (0,
        ta.registerCleanup)();
        (0,
        ta.registerCollapse)();
        (0,
        ta.registerExpand)();
        (0,
        ta.registerDeleteAll)();
        (0,
        ta.registerDuplicate)();
        (0,
        ta.registerComment)();
        (0,
        ta.registerInline)();
        (0,
        ta.registerCollapseExpandBlock)();
        (0,
        ta.registerDisable)();
        (0,
        ta.registerDelete)();
        (0,
        ta.registerHelp)()
    }
    ;
    (0,
    ta.registerDefaultOptions)();
    var Ea = function(a) {
        this.block_ = a;
        this.iconGroup_ = null
    };
    Ea.prototype.collapseHidden = !0;
    Ea.prototype.SIZE = 17;
    Ea.prototype.bubble_ = null;
    Ea.prototype.iconXY_ = null;
    Ea.prototype.createIcon = function() {
        this.iconGroup_ || (this.iconGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyIconGroup"
        }, null),
        this.block_.isInFlyout && (0,
        l.addClass)(this.iconGroup_, "blocklyIconGroupReadonly"),
        this.drawIcon_(this.iconGroup_),
        this.block_.getSvgRoot().appendChild(this.iconGroup_),
        (0,
        u.conditionalBind)(this.iconGroup_, "mouseup", this, this.iconClick_),
        this.updateEditable())
    }
    ;
    Ea.prototype.dispose = function() {
        (0,
        l.removeNode)(this.iconGroup_);
        this.iconGroup_ = null;
        this.setVisible(!1);
        this.block_ = null
    }
    ;
    Ea.prototype.updateEditable = function() {}
    ;
    Ea.prototype.isVisible = function() {
        return !!this.bubble_
    }
    ;
    Ea.prototype.iconClick_ = function(a) {
        this.block_.workspace.isDragging() || this.block_.isInFlyout || (0,
        u.isRightButton)(a) || this.setVisible(!this.isVisible())
    }
    ;
    Ea.prototype.applyColour = function() {
        this.isVisible() && this.bubble_.setColour(this.block_.style.colourPrimary)
    }
    ;
    Ea.prototype.setIconLocation = function(a) {
        this.iconXY_ = a;
        this.isVisible() && this.bubble_.setAnchorLocation(a)
    }
    ;
    Ea.prototype.computeIconLocation = function() {
        var a = this.block_.getRelativeToSurfaceXY()
          , b = (0,
        ca.getRelativeXY)(this.iconGroup_);
        a = new E(a.x + b.x + this.SIZE / 2,a.y + b.y + this.SIZE / 2);
        E.equals(this.getIconLocation(), a) || this.setIconLocation(a)
    }
    ;
    Ea.prototype.getIconLocation = function() {
        return this.iconXY_
    }
    ;
    Ea.prototype.getCorrectedSize = function() {
        return new Ja(Ea.prototype.SIZE,Ea.prototype.SIZE - 2)
    }
    ;
    var Ab = {
        Warning: function(a) {
            Ab.Warning.superClass_.constructor.call(this, a);
            this.createIcon();
            this.text_ = Object.create(null)
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ab.Warning, Ea);
    Ab.Warning.prototype.collapseHidden = !1;
    Ab.Warning.prototype.drawIcon_ = function(a) {
        (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyIconShape",
            d: "M2,15Q-1,15 0.5,12L6.5,1.7Q8,-1 9.5,1.7L15.5,12Q17,15 14,15z"
        }, a);
        (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyIconSymbol",
            d: "m7,4.8v3.16l0.27,2.27h1.46l0.27,-2.27v-3.16z"
        }, a);
        (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyIconSymbol",
            x: "7",
            y: "11",
            height: "2",
            width: "2"
        }, a)
    }
    ;
    Ab.Warning.prototype.setVisible = function(a) {
        a !== this.isVisible() && ((0,
        h.fire)(new ((0,
        h.get)(h.BUBBLE_OPEN))(this.block_,a,"warning")),
        a ? this.createBubble_() : this.disposeBubble_())
    }
    ;
    Ab.Warning.prototype.createBubble_ = function() {
        this.paragraphElement_ = C.Bubble.textToDom(this.getText());
        this.bubble_ = C.Bubble.createNonEditableBubble(this.paragraphElement_, this.block_, this.iconXY_);
        this.applyColour()
    }
    ;
    Ab.Warning.prototype.disposeBubble_ = function() {
        this.bubble_.dispose();
        this.paragraphElement_ = this.bubble_ = null
    }
    ;
    Ab.Warning.prototype.setText = function(a, b) {
        this.text_[b] !== a && (a ? this.text_[b] = a : delete this.text_[b],
        this.isVisible() && (this.setVisible(!1),
        this.setVisible(!0)))
    }
    ;
    Ab.Warning.prototype.getText = function() {
        var a = [], b;
        for (b in this.text_)
            a.push(this.text_[b]);
        return a.join("\n")
    }
    ;
    Ab.Warning.prototype.dispose = function() {
        this.block_.warning = null;
        Ea.prototype.dispose.call(this)
    }
    ;
    var Ka = {
        Comment: function(a) {
            Ka.Comment.superClass_.constructor.call(this, a);
            this.model_ = a.commentModel;
            this.model_.text = this.model_.text || "";
            this.cachedText_ = "";
            this.onInputWrapper_ = this.onChangeWrapper_ = this.onWheelWrapper_ = this.onMouseUpWrapper_ = null;
            this.createIcon()
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(Ka.Comment, Ea);
    Ka.Comment.prototype.drawIcon_ = function(a) {
        (0,
        l.createSvgElement)(q.CIRCLE, {
            "class": "blocklyIconShape",
            r: "8",
            cx: "8",
            cy: "8"
        }, a);
        (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyIconSymbol",
            d: "m6.8,10h2c0.003,-0.617 0.271,-0.962 0.633,-1.266 2.875,-2.4050.607,-5.534 -3.765,-3.874v1.7c3.12,-1.657 3.698,0.118 2.336,1.25-1.201,0.998 -1.201,1.528 -1.204,2.19z"
        }, a);
        (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyIconSymbol",
            x: "6.8",
            y: "10.78",
            height: "2",
            width: "2"
        }, a)
    }
    ;
    Ka.Comment.prototype.createEditor_ = function() {
        this.foreignObject_ = (0,
        l.createSvgElement)(q.FOREIGNOBJECT, {
            x: C.Bubble.BORDER_WIDTH,
            y: C.Bubble.BORDER_WIDTH
        }, null);
        var a = document.createElementNS(l.HTML_NS, "body");
        a.setAttribute("xmlns", l.HTML_NS);
        a.className = "blocklyMinimalBody";
        var b = this.textarea_ = document.createElementNS(l.HTML_NS, "textarea");
        b.className = "blocklyCommentTextarea";
        b.setAttribute("dir", this.block_.RTL ? "RTL" : "LTR");
        b.value = this.model_.text;
        this.resizeTextarea_();
        a.appendChild(b);
        this.foreignObject_.appendChild(a);
        this.onMouseUpWrapper_ = (0,
        u.conditionalBind)(b, "mouseup", this, this.startEdit_, !0, !0);
        this.onWheelWrapper_ = (0,
        u.conditionalBind)(b, "wheel", this, function(c) {
            c.stopPropagation()
        });
        this.onChangeWrapper_ = (0,
        u.conditionalBind)(b, "change", this, function(c) {
            this.cachedText_ !== this.model_.text && (0,
            h.fire)(new ((0,
            h.get)(h.CHANGE))(this.block_,"comment",null,this.cachedText_,this.model_.text))
        });
        this.onInputWrapper_ = (0,
        u.conditionalBind)(b, "input", this, function(c) {
            this.model_.text = b.value
        });
        setTimeout(b.focus.bind(b), 0);
        return this.foreignObject_
    }
    ;
    Ka.Comment.prototype.updateEditable = function() {
        Ka.Comment.superClass_.updateEditable.call(this);
        this.isVisible() && (this.disposeBubble_(),
        this.createBubble_())
    }
    ;
    Ka.Comment.prototype.onBubbleResize_ = function() {
        this.isVisible() && (this.model_.size = this.bubble_.getBubbleSize(),
        this.resizeTextarea_())
    }
    ;
    Ka.Comment.prototype.resizeTextarea_ = function() {
        var a = this.model_.size
          , b = 2 * C.Bubble.BORDER_WIDTH
          , c = a.width - b;
        a = a.height - b;
        this.foreignObject_.setAttribute("width", c);
        this.foreignObject_.setAttribute("height", a);
        this.textarea_.style.width = c - 4 + "px";
        this.textarea_.style.height = a - 4 + "px"
    }
    ;
    Ka.Comment.prototype.setVisible = function(a) {
        a !== this.isVisible() && ((0,
        h.fire)(new ((0,
        h.get)(h.BUBBLE_OPEN))(this.block_,a,"comment")),
        (this.model_.pinned = a) ? this.createBubble_() : this.disposeBubble_())
    }
    ;
    Ka.Comment.prototype.createBubble_ = function() {
        !this.block_.isEditable() || O.IE ? this.createNonEditableBubble_() : this.createEditableBubble_()
    }
    ;
    Ka.Comment.prototype.createEditableBubble_ = function() {
        this.bubble_ = new C.Bubble(this.block_.workspace,this.createEditor_(),this.block_.pathObject.svgPath,this.iconXY_,this.model_.size.width,this.model_.size.height);
        this.bubble_.setSvgId(this.block_.id);
        this.bubble_.registerResizeEvent(this.onBubbleResize_.bind(this));
        this.applyColour()
    }
    ;
    Ka.Comment.prototype.createNonEditableBubble_ = function() {
        this.paragraphElement_ = C.Bubble.textToDom(this.block_.getCommentText());
        this.bubble_ = C.Bubble.createNonEditableBubble(this.paragraphElement_, this.block_, this.iconXY_);
        this.applyColour()
    }
    ;
    Ka.Comment.prototype.disposeBubble_ = function() {
        this.onMouseUpWrapper_ && ((0,
        u.unbind)(this.onMouseUpWrapper_),
        this.onMouseUpWrapper_ = null);
        this.onWheelWrapper_ && ((0,
        u.unbind)(this.onWheelWrapper_),
        this.onWheelWrapper_ = null);
        this.onChangeWrapper_ && ((0,
        u.unbind)(this.onChangeWrapper_),
        this.onChangeWrapper_ = null);
        this.onInputWrapper_ && ((0,
        u.unbind)(this.onInputWrapper_),
        this.onInputWrapper_ = null);
        this.bubble_.dispose();
        this.paragraphElement_ = this.foreignObject_ = this.textarea_ = this.bubble_ = null
    }
    ;
    Ka.Comment.prototype.startEdit_ = function(a) {
        this.bubble_.promote() && this.textarea_.focus();
        this.cachedText_ = this.model_.text
    }
    ;
    Ka.Comment.prototype.getBubbleSize = function() {
        return this.model_.size
    }
    ;
    Ka.Comment.prototype.setBubbleSize = function(a, b) {
        this.bubble_ ? this.bubble_.setBubbleSize(a, b) : (this.model_.size.width = a,
        this.model_.size.height = b)
    }
    ;
    Ka.Comment.prototype.updateText = function() {
        this.textarea_ ? this.textarea_.value = this.model_.text : this.paragraphElement_ && (this.paragraphElement_.firstChild.textContent = this.model_.text)
    }
    ;
    Ka.Comment.prototype.dispose = function() {
        this.block_.comment = null;
        Ea.prototype.dispose.call(this)
    }
    ;
    (0,
    Ia.register)("\n  .blocklyCommentTextarea {\n    background-color: #fef49c;\n    border: 0;\n    display: block;\n    margin: 0;\n    outline: 0;\n    padding: 3px;\n    resize: none;\n    text-overflow: hidden;\n  }\n");
    var Ma = {
        verticalPosition: {
            TOP: 0,
            BOTTOM: 1
        },
        horizontalPosition: {
            LEFT: 0,
            RIGHT: 1
        },
        bumpDirection: {
            UP: 0,
            DOWN: 1
        },
        getStartPositionRect: function(a, b, c, d, f, g) {
            var k = g.scrollbar && g.scrollbar.canScrollVertically();
            a.horizontal === Ma.horizontalPosition.LEFT ? (c = f.absoluteMetrics.left + c,
            k && g.RTL && (c += G.Scrollbar.scrollbarThickness)) : (c = f.absoluteMetrics.left + f.viewMetrics.width - b.width - c,
            k && !g.RTL && (c -= G.Scrollbar.scrollbarThickness));
            a.vertical === Ma.verticalPosition.TOP ? a = f.absoluteMetrics.top + d : (a = f.absoluteMetrics.top + f.viewMetrics.height - b.height - d,
            g.scrollbar && g.scrollbar.canScrollHorizontally() && (a -= G.Scrollbar.scrollbarThickness));
            return new Aa(a,a + b.height,c,c + b.width)
        },
        getCornerOppositeToolbox: function(a, b) {
            return {
                horizontal: b.toolboxMetrics.position === Q.Position.LEFT || a.horizontalLayout && !a.RTL ? Ma.horizontalPosition.RIGHT : Ma.horizontalPosition.LEFT,
                vertical: b.toolboxMetrics.position === Q.Position.BOTTOM ? Ma.verticalPosition.TOP : Ma.verticalPosition.BOTTOM
            }
        },
        bumpPositionRect: function(a, b, c, d) {
            for (var f = a.left, g = a.right - a.left, k = a.bottom - a.top, n = 0; n < d.length; n++) {
                var x = d[n];
                a.intersects(x) && (a = c === Ma.bumpDirection.UP ? x.top - k - b : x.bottom + b,
                a = new Aa(a,a + k,f,f + g),
                n = -1)
            }
            return a
        }
    }
      , Ga = {
        ZoomControls: function(a) {
            this.workspace_ = a;
            this.id = "zoomControls";
            this.zoomResetGroup_ = this.zoomOutGroup_ = this.zoomInGroup_ = this.onZoomOutWrapper_ = this.onZoomInWrapper_ = this.onZoomResetWrapper_ = null
        }
    };
    Ga.ZoomControls.prototype.WIDTH_ = 32;
    Ga.ZoomControls.prototype.HEIGHT_ = 32;
    Ga.ZoomControls.prototype.SMALL_SPACING_ = 2;
    Ga.ZoomControls.prototype.LARGE_SPACING_ = 11;
    Ga.ZoomControls.prototype.MARGIN_VERTICAL_ = 20;
    Ga.ZoomControls.prototype.MARGIN_HORIZONTAL_ = 20;
    Ga.ZoomControls.prototype.svgGroup_ = null;
    Ga.ZoomControls.prototype.left_ = 0;
    Ga.ZoomControls.prototype.top_ = 0;
    Ga.ZoomControls.prototype.initialized_ = !1;
    Ga.ZoomControls.prototype.createDom = function() {
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {}, null);
        var a = String(Math.random()).substring(2);
        this.createZoomOutSvg_(a);
        this.createZoomInSvg_(a);
        this.workspace_.isMovable() && this.createZoomResetSvg_(a);
        return this.svgGroup_
    }
    ;
    Ga.ZoomControls.prototype.init = function() {
        this.workspace_.getComponentManager().addComponent({
            component: this,
            weight: 2,
            capabilities: [ia.Capability.POSITIONABLE]
        });
        this.initialized_ = !0
    }
    ;
    Ga.ZoomControls.prototype.dispose = function() {
        this.workspace_.getComponentManager().removeComponent("zoomControls");
        this.svgGroup_ && (0,
        l.removeNode)(this.svgGroup_);
        this.onZoomResetWrapper_ && (0,
        u.unbind)(this.onZoomResetWrapper_);
        this.onZoomInWrapper_ && (0,
        u.unbind)(this.onZoomInWrapper_);
        this.onZoomOutWrapper_ && (0,
        u.unbind)(this.onZoomOutWrapper_)
    }
    ;
    Ga.ZoomControls.prototype.getBoundingRectangle = function() {
        var a = this.SMALL_SPACING_ + 2 * this.HEIGHT_;
        this.zoomResetGroup_ && (a += this.LARGE_SPACING_ + this.HEIGHT_);
        return new Aa(this.top_,this.top_ + a,this.left_,this.left_ + this.WIDTH_)
    }
    ;
    Ga.ZoomControls.prototype.position = function(a, b) {
        if (this.initialized_) {
            var c = (0,
            Ma.getCornerOppositeToolbox)(this.workspace_, a)
              , d = this.SMALL_SPACING_ + 2 * this.HEIGHT_;
            this.zoomResetGroup_ && (d += this.LARGE_SPACING_ + this.HEIGHT_);
            a = (0,
            Ma.getStartPositionRect)(c, new Ja(this.WIDTH_,d), this.MARGIN_HORIZONTAL_, this.MARGIN_VERTICAL_, a, this.workspace_);
            c = c.vertical;
            b = (0,
            Ma.bumpPositionRect)(a, this.MARGIN_VERTICAL_, c === Ma.verticalPosition.TOP ? Ma.bumpDirection.DOWN : Ma.bumpDirection.UP, b);
            c === Ma.verticalPosition.TOP ? (c = this.SMALL_SPACING_ + this.HEIGHT_,
            this.zoomInGroup_.setAttribute("transform", "translate(0, " + c + ")"),
            this.zoomResetGroup_ && this.zoomResetGroup_.setAttribute("transform", "translate(0, " + (c + this.LARGE_SPACING_ + this.HEIGHT_) + ")")) : (c = this.zoomResetGroup_ ? this.LARGE_SPACING_ + this.HEIGHT_ : 0,
            this.zoomInGroup_.setAttribute("transform", "translate(0, " + c + ")"),
            this.zoomOutGroup_.setAttribute("transform", "translate(0, " + (c + this.SMALL_SPACING_ + this.HEIGHT_) + ")"));
            this.top_ = b.top;
            this.left_ = b.left;
            this.svgGroup_.setAttribute("transform", "translate(" + this.left_ + "," + this.top_ + ")")
        }
    }
    ;
    Ga.ZoomControls.prototype.createZoomOutSvg_ = function(a) {
        this.zoomOutGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyZoom"
        }, this.svgGroup_);
        var b = (0,
        l.createSvgElement)(q.CLIPPATH, {
            id: "blocklyZoomoutClipPath" + a
        }, this.zoomOutGroup_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 32,
            height: 32
        }, b);
        (0,
        l.createSvgElement)(q.IMAGE, {
            width: e.module$exports$Blockly$internalConstants.SPRITE.width,
            height: e.module$exports$Blockly$internalConstants.SPRITE.height,
            x: -64,
            y: -92,
            "clip-path": "url(#blocklyZoomoutClipPath" + a + ")"
        }, this.zoomOutGroup_).setAttributeNS(l.XLINK_NS, "xlink:href", this.workspace_.options.pathToMedia + e.module$exports$Blockly$internalConstants.SPRITE.url);
        this.onZoomOutWrapper_ = (0,
        u.conditionalBind)(this.zoomOutGroup_, "mousedown", null, this.zoom_.bind(this, -1))
    }
    ;
    Ga.ZoomControls.prototype.createZoomInSvg_ = function(a) {
        this.zoomInGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyZoom"
        }, this.svgGroup_);
        var b = (0,
        l.createSvgElement)(q.CLIPPATH, {
            id: "blocklyZoominClipPath" + a
        }, this.zoomInGroup_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 32,
            height: 32
        }, b);
        (0,
        l.createSvgElement)(q.IMAGE, {
            width: e.module$exports$Blockly$internalConstants.SPRITE.width,
            height: e.module$exports$Blockly$internalConstants.SPRITE.height,
            x: -32,
            y: -92,
            "clip-path": "url(#blocklyZoominClipPath" + a + ")"
        }, this.zoomInGroup_).setAttributeNS(l.XLINK_NS, "xlink:href", this.workspace_.options.pathToMedia + e.module$exports$Blockly$internalConstants.SPRITE.url);
        this.onZoomInWrapper_ = (0,
        u.conditionalBind)(this.zoomInGroup_, "mousedown", null, this.zoom_.bind(this, 1))
    }
    ;
    Ga.ZoomControls.prototype.zoom_ = function(a, b) {
        this.workspace_.markFocused();
        this.workspace_.zoomCenter(a);
        this.fireZoomEvent_();
        (0,
        N.clearTouchIdentifier)();
        b.stopPropagation();
        b.preventDefault()
    }
    ;
    Ga.ZoomControls.prototype.createZoomResetSvg_ = function(a) {
        this.zoomResetGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyZoom"
        }, this.svgGroup_);
        var b = (0,
        l.createSvgElement)(q.CLIPPATH, {
            id: "blocklyZoomresetClipPath" + a
        }, this.zoomResetGroup_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 32,
            height: 32
        }, b);
        (0,
        l.createSvgElement)(q.IMAGE, {
            width: e.module$exports$Blockly$internalConstants.SPRITE.width,
            height: e.module$exports$Blockly$internalConstants.SPRITE.height,
            y: -92,
            "clip-path": "url(#blocklyZoomresetClipPath" + a + ")"
        }, this.zoomResetGroup_).setAttributeNS(l.XLINK_NS, "xlink:href", this.workspace_.options.pathToMedia + e.module$exports$Blockly$internalConstants.SPRITE.url);
        this.onZoomResetWrapper_ = (0,
        u.conditionalBind)(this.zoomResetGroup_, "mousedown", null, this.resetZoom_.bind(this))
    }
    ;
    Ga.ZoomControls.prototype.resetZoom_ = function(a) {
        this.workspace_.markFocused();
        var b = Math.log(this.workspace_.options.zoomOptions.startScale / this.workspace_.scale) / Math.log(this.workspace_.options.zoomOptions.scaleSpeed);
        this.workspace_.beginCanvasTransition();
        this.workspace_.zoomCenter(b);
        this.workspace_.scrollCenter();
        setTimeout(this.workspace_.endCanvasTransition.bind(this.workspace_), 500);
        this.fireZoomEvent_();
        (0,
        N.clearTouchIdentifier)();
        a.stopPropagation();
        a.preventDefault()
    }
    ;
    Ga.ZoomControls.prototype.fireZoomEvent_ = function() {
        var a = new ((0,
        h.get)(h.CLICK))(null,this.workspace_.id,"zoom_controls");
        (0,
        h.fire)(a)
    }
    ;
    (0,
    Ia.register)("\n  .blocklyZoom>image, .blocklyZoom>svg>image {\n    opacity: .4;\n  }\n\n  .blocklyZoom>image:hover, .blocklyZoom>svg>image:hover {\n    opacity: .6;\n  }\n\n  .blocklyZoom>image:active, .blocklyZoom>svg>image:active {\n    opacity: .8;\n  }\n");
    var oa = {
        WorkspaceComment: function(a, b, c, d, f) {
            this.id = f && !a.getCommentById(f) ? f : (0,
            Va.genUid)();
            a.addTopComment(this);
            this.xy_ = new E(0,0);
            this.height_ = c;
            this.width_ = d;
            this.workspace = a;
            this.RTL = a.RTL;
            this.editable_ = this.movable_ = this.deletable_ = !0;
            this.content_ = b;
            this.disposed_ = !1;
            this.isComment = !0;
            oa.WorkspaceComment.fireCreateEvent(this)
        }
    };
    oa.WorkspaceComment.prototype.dispose = function() {
        this.disposed_ || ((0,
        h.isEnabled)() && (0,
        h.fire)(new ((0,
        h.get)(h.COMMENT_DELETE))(this)),
        this.workspace.removeTopComment(this),
        this.disposed_ = !0)
    }
    ;
    oa.WorkspaceComment.prototype.getHeight = function() {
        return this.height_
    }
    ;
    oa.WorkspaceComment.prototype.setHeight = function(a) {
        this.height_ = a
    }
    ;
    oa.WorkspaceComment.prototype.getWidth = function() {
        return this.width_
    }
    ;
    oa.WorkspaceComment.prototype.setWidth = function(a) {
        this.width_ = a
    }
    ;
    oa.WorkspaceComment.prototype.getXY = function() {
        return new E(this.xy_.x,this.xy_.y)
    }
    ;
    oa.WorkspaceComment.prototype.moveBy = function(a, b) {
        var c = new ((0,
        h.get)(h.COMMENT_MOVE))(this);
        this.xy_.translate(a, b);
        c.recordNew();
        (0,
        h.fire)(c)
    }
    ;
    oa.WorkspaceComment.prototype.isDeletable = function() {
        return this.deletable_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    oa.WorkspaceComment.prototype.setDeletable = function(a) {
        this.deletable_ = a
    }
    ;
    oa.WorkspaceComment.prototype.isMovable = function() {
        return this.movable_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    oa.WorkspaceComment.prototype.setMovable = function(a) {
        this.movable_ = a
    }
    ;
    oa.WorkspaceComment.prototype.isEditable = function() {
        return this.editable_ && !(this.workspace && this.workspace.options.readOnly)
    }
    ;
    oa.WorkspaceComment.prototype.setEditable = function(a) {
        this.editable_ = a
    }
    ;
    oa.WorkspaceComment.prototype.getContent = function() {
        return this.content_
    }
    ;
    oa.WorkspaceComment.prototype.setContent = function(a) {
        this.content_ !== a && ((0,
        h.fire)(new ((0,
        h.get)(h.COMMENT_CHANGE))(this,this.content_,a)),
        this.content_ = a)
    }
    ;
    oa.WorkspaceComment.prototype.toXmlWithXY = function(a) {
        a = this.toXml(a);
        a.setAttribute("x", Math.round(this.xy_.x));
        a.setAttribute("y", Math.round(this.xy_.y));
        a.setAttribute("h", this.height_);
        a.setAttribute("w", this.width_);
        return a
    }
    ;
    oa.WorkspaceComment.prototype.toXml = function(a) {
        var b = (0,
        e.module$exports$Blockly$utils$xml.createElement)("comment");
        a || (b.id = this.id);
        b.textContent = this.getContent();
        return b
    }
    ;
    oa.WorkspaceComment.fireCreateEvent = function(a) {
        if ((0,
        h.isEnabled)()) {
            var b = (0,
            h.getGroup)();
            b || (0,
            h.setGroup)(!0);
            try {
                (0,
                h.fire)(new ((0,
                h.get)(h.COMMENT_CREATE))(a))
            } finally {
                b || (0,
                h.setGroup)(!1)
            }
        }
    }
    ;
    oa.WorkspaceComment.fromXml = function(a, b) {
        var c = oa.WorkspaceComment.parseAttributes(a);
        b = new oa.WorkspaceComment(b,c.content,c.h,c.w,c.id);
        c = parseInt(a.getAttribute("x"), 10);
        a = parseInt(a.getAttribute("y"), 10);
        isNaN(c) || isNaN(a) || b.moveBy(c, a);
        oa.WorkspaceComment.fireCreateEvent(b);
        return b
    }
    ;
    oa.WorkspaceComment.parseAttributes = function(a) {
        var b = a.getAttribute("h")
          , c = a.getAttribute("w");
        return {
            id: a.getAttribute("id"),
            h: b ? parseInt(b, 10) : 100,
            w: c ? parseInt(c, 10) : 100,
            x: parseInt(a.getAttribute("x"), 10),
            y: parseInt(a.getAttribute("y"), 10),
            content: a.textContent
        }
    }
    ;
    var L = {
        WorkspaceCommentSvg: function(a, b, c, d, f) {
            this.onMouseMoveWrapper_ = this.onMouseUpWrapper_ = null;
            this.svgGroup_ = (0,
            l.createSvgElement)(q.G, {
                "class": "blocklyComment"
            }, null);
            this.svgGroup_.translate_ = "";
            this.svgRect_ = (0,
            l.createSvgElement)(q.RECT, {
                "class": "blocklyCommentRect",
                x: 0,
                y: 0,
                rx: 3,
                ry: 3
            });
            this.svgGroup_.appendChild(this.svgRect_);
            this.rendered_ = !1;
            this.useDragSurface_ = (0,
            ca.is3dSupported)() && !!a.getBlockDragSurface();
            L.WorkspaceCommentSvg.superClass_.constructor.call(this, a, b, c, d, f);
            this.render()
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(L.WorkspaceCommentSvg, oa.WorkspaceComment);
    L.WorkspaceCommentSvg.DEFAULT_SIZE = 100;
    L.WorkspaceCommentSvg.TOP_OFFSET = 10;
    L.WorkspaceCommentSvg.prototype.dispose = function() {
        this.disposed_ || ((0,
        e.module$exports$Blockly$common.getSelected)() === this && (this.unselect(),
        this.workspace.cancelCurrentGesture()),
        (0,
        h.isEnabled)() && (0,
        h.fire)(new ((0,
        h.get)(h.COMMENT_DELETE))(this)),
        (0,
        l.removeNode)(this.svgGroup_),
        this.disposeInternal_(),
        (0,
        h.disable)(),
        L.WorkspaceCommentSvg.superClass_.dispose.call(this),
        (0,
        h.enable)())
    }
    ;
    L.WorkspaceCommentSvg.prototype.initSvg = function(a) {
        if (!this.workspace.rendered)
            throw TypeError("Workspace is headless.");
        this.workspace.options.readOnly || this.eventsInit_ || ((0,
        u.conditionalBind)(this.svgRectTarget_, "mousedown", this, this.pathMouseDown_),
        (0,
        u.conditionalBind)(this.svgHandleTarget_, "mousedown", this, this.pathMouseDown_));
        this.eventsInit_ = !0;
        this.updateMovable();
        this.getSvgRoot().parentNode || this.workspace.getBubbleCanvas().appendChild(this.getSvgRoot());
        !a && this.textarea_ && this.textarea_.select()
    }
    ;
    L.WorkspaceCommentSvg.prototype.pathMouseDown_ = function(a) {
        var b = this.workspace.getGesture(a);
        b && b.handleBubbleStart(a, this)
    }
    ;
    L.WorkspaceCommentSvg.prototype.showContextMenu = function(a) {
        if (!this.workspace.options.readOnly) {
            var b = [];
            this.isDeletable() && this.isMovable() && (b.push((0,
            e.module$exports$Blockly$ContextMenu.commentDuplicateOption)(this)),
            b.push((0,
            e.module$exports$Blockly$ContextMenu.commentDeleteOption)(this)));
            (0,
            e.module$exports$Blockly$ContextMenu.show)(a, b, this.RTL)
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.select = function() {
        if ((0,
        e.module$exports$Blockly$common.getSelected)() !== this) {
            var a = null;
            if ((0,
            e.module$exports$Blockly$common.getSelected)()) {
                a = (0,
                e.module$exports$Blockly$common.getSelected)().id;
                (0,
                h.disable)();
                try {
                    (0,
                    e.module$exports$Blockly$common.getSelected)().unselect()
                } finally {
                    (0,
                    h.enable)()
                }
            }
            a = new ((0,
            h.get)(h.SELECTED))(a,this.id,this.workspace.id);
            (0,
            h.fire)(a);
            (0,
            e.module$exports$Blockly$common.setSelected)(this);
            this.addSelect()
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.unselect = function() {
        if ((0,
        e.module$exports$Blockly$common.getSelected)() === this) {
            var a = new ((0,
            h.get)(h.SELECTED))(this.id,null,this.workspace.id);
            (0,
            h.fire)(a);
            (0,
            e.module$exports$Blockly$common.setSelected)(null);
            this.removeSelect();
            this.blurFocus()
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.addSelect = function() {
        (0,
        l.addClass)(this.svgGroup_, "blocklySelected");
        this.setFocus()
    }
    ;
    L.WorkspaceCommentSvg.prototype.removeSelect = function() {
        (0,
        l.removeClass)(this.svgGroup_, "blocklySelected");
        this.blurFocus()
    }
    ;
    L.WorkspaceCommentSvg.prototype.addFocus = function() {
        (0,
        l.addClass)(this.svgGroup_, "blocklyFocused")
    }
    ;
    L.WorkspaceCommentSvg.prototype.removeFocus = function() {
        (0,
        l.removeClass)(this.svgGroup_, "blocklyFocused")
    }
    ;
    L.WorkspaceCommentSvg.prototype.getRelativeToSurfaceXY = function() {
        var a = 0
          , b = 0
          , c = this.useDragSurface_ ? this.workspace.getBlockDragSurface().getGroup() : null
          , d = this.getSvgRoot();
        if (d) {
            do {
                var f = (0,
                ca.getRelativeXY)(d);
                a += f.x;
                b += f.y;
                this.useDragSurface_ && this.workspace.getBlockDragSurface().getCurrentBlock() === d && (f = this.workspace.getBlockDragSurface().getSurfaceTranslation(),
                a += f.x,
                b += f.y);
                d = d.parentNode
            } while (d && d !== this.workspace.getBubbleCanvas() && d !== c)
        }
        return this.xy_ = new E(a,b)
    }
    ;
    L.WorkspaceCommentSvg.prototype.moveBy = function(a, b) {
        var c = new ((0,
        h.get)(h.COMMENT_MOVE))(this)
          , d = this.getRelativeToSurfaceXY();
        this.translate(d.x + a, d.y + b);
        this.xy_ = new E(d.x + a,d.y + b);
        c.recordNew();
        (0,
        h.fire)(c);
        this.workspace.resizeContents()
    }
    ;
    L.WorkspaceCommentSvg.prototype.translate = function(a, b) {
        this.xy_ = new E(a,b);
        this.getSvgRoot().setAttribute("transform", "translate(" + a + "," + b + ")")
    }
    ;
    L.WorkspaceCommentSvg.prototype.moveToDragSurface = function() {
        if (this.useDragSurface_) {
            var a = this.getRelativeToSurfaceXY();
            this.clearTransformAttributes_();
            this.workspace.getBlockDragSurface().translateSurface(a.x, a.y);
            this.workspace.getBlockDragSurface().setBlocksAndShow(this.getSvgRoot())
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.moveDuringDrag = function(a, b) {
        a ? a.translateSurface(b.x, b.y) : (this.svgGroup_.translate_ = "translate(" + b.x + "," + b.y + ")",
        this.svgGroup_.setAttribute("transform", this.svgGroup_.translate_ + this.svgGroup_.skew_))
    }
    ;
    L.WorkspaceCommentSvg.prototype.moveTo = function(a, b) {
        this.translate(a, b)
    }
    ;
    L.WorkspaceCommentSvg.prototype.clearTransformAttributes_ = function() {
        this.getSvgRoot().removeAttribute("transform")
    }
    ;
    L.WorkspaceCommentSvg.prototype.getBoundingRectangle = function() {
        var a = this.getRelativeToSurfaceXY()
          , b = this.getHeightWidth()
          , c = a.y
          , d = a.y + b.height;
        if (this.RTL) {
            var f = a.x - b.width;
            a = a.x
        } else
            f = a.x,
            a = a.x + b.width;
        return new Aa(c,d,f,a)
    }
    ;
    L.WorkspaceCommentSvg.prototype.updateMovable = function() {
        this.isMovable() ? (0,
        l.addClass)(this.svgGroup_, "blocklyDraggable") : (0,
        l.removeClass)(this.svgGroup_, "blocklyDraggable")
    }
    ;
    L.WorkspaceCommentSvg.prototype.setMovable = function(a) {
        L.WorkspaceCommentSvg.superClass_.setMovable.call(this, a);
        this.updateMovable()
    }
    ;
    L.WorkspaceCommentSvg.prototype.setEditable = function(a) {
        L.WorkspaceCommentSvg.superClass_.setEditable.call(this, a);
        this.textarea_ && (this.textarea_.readOnly = !a)
    }
    ;
    L.WorkspaceCommentSvg.prototype.setDragging = function(a) {
        a ? (a = this.getSvgRoot(),
        a.translate_ = "",
        a.skew_ = "",
        (0,
        l.addClass)(this.svgGroup_, "blocklyDragging")) : (0,
        l.removeClass)(this.svgGroup_, "blocklyDragging")
    }
    ;
    L.WorkspaceCommentSvg.prototype.getSvgRoot = function() {
        return this.svgGroup_
    }
    ;
    L.WorkspaceCommentSvg.prototype.getContent = function() {
        return this.textarea_ ? this.textarea_.value : this.content_
    }
    ;
    L.WorkspaceCommentSvg.prototype.setContent = function(a) {
        L.WorkspaceCommentSvg.superClass_.setContent.call(this, a);
        this.textarea_ && (this.textarea_.value = a)
    }
    ;
    L.WorkspaceCommentSvg.prototype.setDeleteStyle = function(a) {
        a ? (0,
        l.addClass)(this.svgGroup_, "blocklyDraggingDelete") : (0,
        l.removeClass)(this.svgGroup_, "blocklyDraggingDelete")
    }
    ;
    L.WorkspaceCommentSvg.prototype.setAutoLayout = function(a) {}
    ;
    L.WorkspaceCommentSvg.fromXml = function(a, b, c) {
        (0,
        h.disable)();
        try {
            var d = oa.WorkspaceComment.parseAttributes(a)
              , f = new L.WorkspaceCommentSvg(b,d.content,d.h,d.w,d.id);
            b.rendered && (f.initSvg(!0),
            f.render());
            if (!isNaN(d.x) && !isNaN(d.y))
                if (b.RTL) {
                    var g = c || b.getWidth();
                    f.moveBy(g - d.x, d.y)
                } else
                    f.moveBy(d.x, d.y)
        } finally {
            (0,
            h.enable)()
        }
        oa.WorkspaceComment.fireCreateEvent(f);
        return f
    }
    ;
    L.WorkspaceCommentSvg.prototype.toXmlWithXY = function(a) {
        var b;
        this.workspace.RTL && (b = this.workspace.getWidth());
        a = this.toXml(a);
        var c = this.getRelativeToSurfaceXY();
        a.setAttribute("x", Math.round(this.workspace.RTL ? b - c.x : c.x));
        a.setAttribute("y", Math.round(c.y));
        a.setAttribute("h", this.getHeight());
        a.setAttribute("w", this.getWidth());
        return a
    }
    ;
    L.WorkspaceCommentSvg.prototype.toCopyData = function() {
        return {
            saveInfo: this.toXmlWithXY(),
            source: this.workspace,
            typeCounts: null
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.getHeightWidth = function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.render = function() {
        if (!this.rendered_) {
            var a = this.getHeightWidth();
            this.createEditor_();
            this.svgGroup_.appendChild(this.foreignObject_);
            this.svgHandleTarget_ = (0,
            l.createSvgElement)(q.RECT, {
                "class": "blocklyCommentHandleTarget",
                x: 0,
                y: 0
            });
            this.svgGroup_.appendChild(this.svgHandleTarget_);
            this.svgRectTarget_ = (0,
            l.createSvgElement)(q.RECT, {
                "class": "blocklyCommentTarget",
                x: 0,
                y: 0,
                rx: 3,
                ry: 3
            });
            this.svgGroup_.appendChild(this.svgRectTarget_);
            this.addResizeDom_();
            this.isDeletable() && this.addDeleteDom_();
            this.setSize_(a.width, a.height);
            this.textarea_.value = this.content_;
            this.rendered_ = !0;
            this.resizeGroup_ && (0,
            u.conditionalBind)(this.resizeGroup_, "mousedown", this, this.resizeMouseDown_);
            this.isDeletable() && ((0,
            u.conditionalBind)(this.deleteGroup_, "mousedown", this, this.deleteMouseDown_),
            (0,
            u.conditionalBind)(this.deleteGroup_, "mouseout", this, this.deleteMouseOut_),
            (0,
            u.conditionalBind)(this.deleteGroup_, "mouseup", this, this.deleteMouseUp_))
        }
    }
    ;
    L.WorkspaceCommentSvg.prototype.createEditor_ = function() {
        this.foreignObject_ = (0,
        l.createSvgElement)(q.FOREIGNOBJECT, {
            x: 0,
            y: L.WorkspaceCommentSvg.TOP_OFFSET,
            "class": "blocklyCommentForeignObject"
        }, null);
        var a = document.createElementNS(l.HTML_NS, "body");
        a.setAttribute("xmlns", l.HTML_NS);
        a.className = "blocklyMinimalBody";
        var b = document.createElementNS(l.HTML_NS, "textarea");
        b.className = "blocklyCommentTextarea";
        b.setAttribute("dir", this.RTL ? "RTL" : "LTR");
        b.readOnly = !this.isEditable();
        a.appendChild(b);
        this.textarea_ = b;
        this.foreignObject_.appendChild(a);
        (0,
        u.conditionalBind)(b, "wheel", this, function(c) {
            c.stopPropagation()
        });
        (0,
        u.conditionalBind)(b, "change", this, function(c) {
            this.setContent(b.value)
        });
        return this.foreignObject_
    }
    ;
    L.WorkspaceCommentSvg.prototype.addResizeDom_ = function() {
        this.resizeGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": this.RTL ? "blocklyResizeSW" : "blocklyResizeSE"
        }, this.svgGroup_);
        (0,
        l.createSvgElement)(q.POLYGON, {
            points: "0,x x,x x,0".replace(/x/g, (8).toString())
        }, this.resizeGroup_);
        (0,
        l.createSvgElement)(q.LINE, {
            "class": "blocklyResizeLine",
            x1: 8 / 3,
            y1: 7,
            x2: 7,
            y2: 8 / 3
        }, this.resizeGroup_);
        (0,
        l.createSvgElement)(q.LINE, {
            "class": "blocklyResizeLine",
            x1: 16 / 3,
            y1: 7,
            x2: 7,
            y2: 16 / 3
        }, this.resizeGroup_)
    }
    ;
    L.WorkspaceCommentSvg.prototype.addDeleteDom_ = function() {
        this.deleteGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyCommentDeleteIcon"
        }, this.svgGroup_);
        this.deleteIconBorder_ = (0,
        l.createSvgElement)(q.CIRCLE, {
            "class": "blocklyDeleteIconShape",
            r: "7",
            cx: "7.5",
            cy: "7.5"
        }, this.deleteGroup_);
        (0,
        l.createSvgElement)(q.LINE, {
            x1: "5",
            y1: "10",
            x2: "10",
            y2: "5",
            stroke: "#fff",
            "stroke-width": "2"
        }, this.deleteGroup_);
        (0,
        l.createSvgElement)(q.LINE, {
            x1: "5",
            y1: "5",
            x2: "10",
            y2: "10",
            stroke: "#fff",
            "stroke-width": "2"
        }, this.deleteGroup_)
    }
    ;
    L.WorkspaceCommentSvg.prototype.resizeMouseDown_ = function(a) {
        this.unbindDragEvents_();
        (0,
        u.isRightButton)(a) || (this.workspace.startDrag(a, new E(this.workspace.RTL ? -this.width_ : this.width_,this.height_)),
        this.onMouseUpWrapper_ = (0,
        u.conditionalBind)(document, "mouseup", this, this.resizeMouseUp_),
        this.onMouseMoveWrapper_ = (0,
        u.conditionalBind)(document, "mousemove", this, this.resizeMouseMove_),
        this.workspace.hideChaff());
        a.stopPropagation()
    }
    ;
    L.WorkspaceCommentSvg.prototype.deleteMouseDown_ = function(a) {
        (0,
        l.addClass)(this.deleteIconBorder_, "blocklyDeleteIconHighlighted");
        a.stopPropagation()
    }
    ;
    L.WorkspaceCommentSvg.prototype.deleteMouseOut_ = function(a) {
        (0,
        l.removeClass)(this.deleteIconBorder_, "blocklyDeleteIconHighlighted")
    }
    ;
    L.WorkspaceCommentSvg.prototype.deleteMouseUp_ = function(a) {
        this.dispose();
        a.stopPropagation()
    }
    ;
    L.WorkspaceCommentSvg.prototype.unbindDragEvents_ = function() {
        this.onMouseUpWrapper_ && ((0,
        u.unbind)(this.onMouseUpWrapper_),
        this.onMouseUpWrapper_ = null);
        this.onMouseMoveWrapper_ && ((0,
        u.unbind)(this.onMouseMoveWrapper_),
        this.onMouseMoveWrapper_ = null)
    }
    ;
    L.WorkspaceCommentSvg.prototype.resizeMouseUp_ = function(a) {
        (0,
        N.clearTouchIdentifier)();
        this.unbindDragEvents_()
    }
    ;
    L.WorkspaceCommentSvg.prototype.resizeMouseMove_ = function(a) {
        this.autoLayout_ = !1;
        a = this.workspace.moveDrag(a);
        this.setSize_(this.RTL ? -a.x : a.x, a.y)
    }
    ;
    L.WorkspaceCommentSvg.prototype.resizeComment_ = function() {
        var a = this.getHeightWidth()
          , b = L.WorkspaceCommentSvg.TOP_OFFSET;
        this.foreignObject_.setAttribute("width", a.width);
        this.foreignObject_.setAttribute("height", a.height - b);
        this.RTL && this.foreignObject_.setAttribute("x", -a.width);
        this.textarea_.style.width = a.width - 4 + "px";
        this.textarea_.style.height = a.height - 4 - b + "px"
    }
    ;
    L.WorkspaceCommentSvg.prototype.setSize_ = function(a, b) {
        a = Math.max(a, 45);
        b = Math.max(b, 20 + L.WorkspaceCommentSvg.TOP_OFFSET);
        this.width_ = a;
        this.height_ = b;
        this.svgRect_.setAttribute("width", a);
        this.svgRect_.setAttribute("height", b);
        this.svgRectTarget_.setAttribute("width", a);
        this.svgRectTarget_.setAttribute("height", b);
        this.svgHandleTarget_.setAttribute("width", a);
        this.svgHandleTarget_.setAttribute("height", L.WorkspaceCommentSvg.TOP_OFFSET);
        this.RTL && (this.svgRect_.setAttribute("transform", "scale(-1 1)"),
        this.svgRectTarget_.setAttribute("transform", "scale(-1 1)"));
        this.resizeGroup_ && (this.RTL ? (this.resizeGroup_.setAttribute("transform", "translate(" + (-a + 8) + "," + (b - 8) + ") scale(-1 1)"),
        this.deleteGroup_.setAttribute("transform", "translate(" + (-a + 8) + ",-8) scale(-1 1)")) : (this.resizeGroup_.setAttribute("transform", "translate(" + (a - 8) + "," + (b - 8) + ")"),
        this.deleteGroup_.setAttribute("transform", "translate(" + (a - 8) + ",-8)")));
        this.resizeComment_()
    }
    ;
    L.WorkspaceCommentSvg.prototype.disposeInternal_ = function() {
        this.svgHandleTarget_ = this.svgRectTarget_ = this.foreignObject_ = this.textarea_ = null;
        this.disposed_ = !0
    }
    ;
    L.WorkspaceCommentSvg.prototype.setFocus = function() {
        var a = this;
        this.focused_ = !0;
        setTimeout(function() {
            a.disposed_ || (a.textarea_.focus(),
            a.addFocus(),
            (0,
            l.addClass)(a.svgRectTarget_, "blocklyCommentTargetFocused"),
            (0,
            l.addClass)(a.svgHandleTarget_, "blocklyCommentHandleTargetFocused"))
        }, 0)
    }
    ;
    L.WorkspaceCommentSvg.prototype.blurFocus = function() {
        var a = this;
        this.focused_ = !1;
        setTimeout(function() {
            a.disposed_ || (a.textarea_.blur(),
            a.removeFocus(),
            (0,
            l.removeClass)(a.svgRectTarget_, "blocklyCommentTargetFocused"),
            (0,
            l.removeClass)(a.svgHandleTarget_, "blocklyCommentHandleTargetFocused"))
        }, 0)
    }
    ;
    (0,
    Ia.register)("\n  .blocklyCommentForeignObject {\n    position: relative;\n    z-index: 0;\n  }\n\n  .blocklyCommentRect {\n    fill: #E7DE8E;\n    stroke: #bcA903;\n    stroke-width: 1px;\n  }\n\n  .blocklyCommentTarget {\n    fill: transparent;\n    stroke: #bcA903;\n  }\n\n  .blocklyCommentTargetFocused {\n    fill: none;\n  }\n\n  .blocklyCommentHandleTarget {\n    fill: none;\n  }\n\n  .blocklyCommentHandleTargetFocused {\n    fill: transparent;\n  }\n\n  .blocklyFocused>.blocklyCommentRect {\n    fill: #B9B272;\n    stroke: #B9B272;\n  }\n\n  .blocklySelected>.blocklyCommentTarget {\n    stroke: #fc3;\n    stroke-width: 3px;\n  }\n\n  .blocklyCommentDeleteIcon {\n    cursor: pointer;\n    fill: #000;\n    display: none;\n  }\n\n  .blocklySelected > .blocklyCommentDeleteIcon {\n    display: block;\n  }\n\n  .blocklyDeleteIconShape {\n    fill: #000;\n    stroke: #000;\n    stroke-width: 1px;\n  }\n\n  .blocklyDeleteIconShape.blocklyDeleteIconHighlighted {\n    stroke: #fc3;\n  }\n");
    var aa = {
        Trashcan: function(a) {
            aa.Trashcan.superClass_.constructor.call(this);
            this.workspace_ = a;
            this.id = "trashcan";
            this.contents_ = [];
            this.flyout = null;
            0 >= this.workspace_.options.maxTrashcanContents || (a = new gb.Options({
                scrollbars: !0,
                parentWorkspace: this.workspace_,
                rtl: this.workspace_.RTL,
                oneBasedIndex: this.workspace_.options.oneBasedIndex,
                renderer: this.workspace_.options.renderer,
                rendererOverrides: this.workspace_.options.rendererOverrides,
                move: {
                    scrollbars: !0
                }
            }),
            this.workspace_.horizontalLayout ? (a.toolboxPosition = this.workspace_.toolboxPosition === Q.Position.TOP ? Q.Position.BOTTOM : Q.Position.TOP,
            this.flyout = new ((0,
            r.getClassFromOptions)(r.Type.FLYOUTS_HORIZONTAL_TOOLBOX, this.workspace_.options, !0))(a)) : (a.toolboxPosition = this.workspace_.toolboxPosition === Q.Position.RIGHT ? Q.Position.LEFT : Q.Position.RIGHT,
            this.flyout = new ((0,
            r.getClassFromOptions)(r.Type.FLYOUTS_VERTICAL_TOOLBOX, this.workspace_.options, !0))(a)),
            this.workspace_.addChangeListener(this.onDelete_.bind(this)))
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(aa.Trashcan, vc.DeleteArea);
    aa.Trashcan.prototype.isLidOpen = !1;
    aa.Trashcan.prototype.minOpenness_ = 0;
    aa.Trashcan.prototype.svgGroup_ = null;
    aa.Trashcan.prototype.svgLid_ = null;
    aa.Trashcan.prototype.lidTask_ = 0;
    aa.Trashcan.prototype.lidOpen_ = 0;
    aa.Trashcan.prototype.left_ = 0;
    aa.Trashcan.prototype.top_ = 0;
    aa.Trashcan.prototype.initialized_ = !1;
    aa.Trashcan.prototype.createDom = function() {
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": "blocklyTrash"
        }, null);
        var a = String(Math.random()).substring(2)
          , b = (0,
        l.createSvgElement)(q.CLIPPATH, {
            id: "blocklyTrashBodyClipPath" + a
        }, this.svgGroup_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 47,
            height: 44,
            y: 16
        }, b);
        var c = (0,
        l.createSvgElement)(q.IMAGE, {
            width: e.module$exports$Blockly$internalConstants.SPRITE.width,
            x: -0,
            height: e.module$exports$Blockly$internalConstants.SPRITE.height,
            y: -32,
            "clip-path": "url(#blocklyTrashBodyClipPath" + a + ")"
        }, this.svgGroup_);
        c.setAttributeNS(l.XLINK_NS, "xlink:href", this.workspace_.options.pathToMedia + e.module$exports$Blockly$internalConstants.SPRITE.url);
        b = (0,
        l.createSvgElement)(q.CLIPPATH, {
            id: "blocklyTrashLidClipPath" + a
        }, this.svgGroup_);
        (0,
        l.createSvgElement)(q.RECT, {
            width: 47,
            height: 16
        }, b);
        this.svgLid_ = (0,
        l.createSvgElement)(q.IMAGE, {
            width: e.module$exports$Blockly$internalConstants.SPRITE.width,
            x: -0,
            height: e.module$exports$Blockly$internalConstants.SPRITE.height,
            y: -32,
            "clip-path": "url(#blocklyTrashLidClipPath" + a + ")"
        }, this.svgGroup_);
        this.svgLid_.setAttributeNS(l.XLINK_NS, "xlink:href", this.workspace_.options.pathToMedia + e.module$exports$Blockly$internalConstants.SPRITE.url);
        (0,
        u.bind)(this.svgGroup_, "mousedown", this, this.blockMouseDownWhenOpenable_);
        (0,
        u.bind)(this.svgGroup_, "mouseup", this, this.click);
        (0,
        u.bind)(c, "mouseover", this, this.mouseOver_);
        (0,
        u.bind)(c, "mouseout", this, this.mouseOut_);
        this.animateLid_();
        return this.svgGroup_
    }
    ;
    aa.Trashcan.prototype.init = function() {
        0 < this.workspace_.options.maxTrashcanContents && ((0,
        l.insertAfter)(this.flyout.createDom(q.SVG), this.workspace_.getParentSvg()),
        this.flyout.init(this.workspace_));
        this.workspace_.getComponentManager().addComponent({
            component: this,
            weight: 1,
            capabilities: [ia.Capability.AUTOHIDEABLE, ia.Capability.DELETE_AREA, ia.Capability.DRAG_TARGET, ia.Capability.POSITIONABLE]
        });
        this.initialized_ = !0;
        this.setLidOpen(!1)
    }
    ;
    aa.Trashcan.prototype.dispose = function() {
        this.workspace_.getComponentManager().removeComponent("trashcan");
        this.svgGroup_ && ((0,
        l.removeNode)(this.svgGroup_),
        this.svgGroup_ = null);
        this.workspace_ = this.svgLid_ = null;
        clearTimeout(this.lidTask_)
    }
    ;
    aa.Trashcan.prototype.hasContents_ = function() {
        return !!this.contents_.length
    }
    ;
    aa.Trashcan.prototype.contentsIsOpen = function() {
        return !!this.flyout && this.flyout.isVisible()
    }
    ;
    aa.Trashcan.prototype.openFlyout = function() {
        if (!this.contentsIsOpen()) {
            var a = this.contents_.map(function(b) {
                return JSON.parse(b)
            });
            this.flyout.show(a);
            this.fireUiEvent_(!0)
        }
    }
    ;
    aa.Trashcan.prototype.closeFlyout = function() {
        this.contentsIsOpen() && (this.flyout.hide(),
        this.fireUiEvent_(!1),
        this.workspace_.recordDragTargets())
    }
    ;
    aa.Trashcan.prototype.autoHide = function(a) {
        !a && this.flyout && this.closeFlyout()
    }
    ;
    aa.Trashcan.prototype.emptyContents = function() {
        this.hasContents_() && (this.contents_.length = 0,
        this.setMinOpenness_(0),
        this.closeFlyout())
    }
    ;
    aa.Trashcan.prototype.position = function(a, b) {
        if (this.initialized_) {
            var c = (0,
            Ma.getCornerOppositeToolbox)(this.workspace_, a);
            a = (0,
            Ma.getStartPositionRect)(c, new Ja(47,60), 20, 20, a, this.workspace_);
            b = (0,
            Ma.bumpPositionRect)(a, 20, c.vertical === Ma.verticalPosition.TOP ? Ma.bumpDirection.DOWN : Ma.bumpDirection.UP, b);
            this.top_ = b.top;
            this.left_ = b.left;
            this.svgGroup_.setAttribute("transform", "translate(" + this.left_ + "," + this.top_ + ")")
        }
    }
    ;
    aa.Trashcan.prototype.getBoundingRectangle = function() {
        return new Aa(this.top_,this.top_ + 44 + 16,this.left_,this.left_ + 47)
    }
    ;
    aa.Trashcan.prototype.getClientRect = function() {
        if (!this.svgGroup_)
            return null;
        var a = this.svgGroup_.getBoundingClientRect()
          , b = a.top + 32 - 10;
        a = a.left + 0 - 10;
        return new Aa(b,b + 16 + 44 + 20,a,a + 47 + 20)
    }
    ;
    aa.Trashcan.prototype.onDragOver = function(a) {
        this.setLidOpen(this.wouldDelete_)
    }
    ;
    aa.Trashcan.prototype.onDragExit = function(a) {
        this.setLidOpen(!1)
    }
    ;
    aa.Trashcan.prototype.onDrop = function(a) {
        setTimeout(this.setLidOpen.bind(this, !1), 100)
    }
    ;
    aa.Trashcan.prototype.setLidOpen = function(a) {
        this.isLidOpen !== a && (clearTimeout(this.lidTask_),
        this.isLidOpen = a,
        this.animateLid_())
    }
    ;
    aa.Trashcan.prototype.animateLid_ = function() {
        this.lidOpen_ += this.isLidOpen ? .2 : -.2;
        this.lidOpen_ = Math.min(Math.max(this.lidOpen_, this.minOpenness_), 1);
        this.setLidAngle_(45 * this.lidOpen_);
        this.svgGroup_.style.opacity = .4 + .4 * this.lidOpen_;
        this.lidOpen_ > this.minOpenness_ && 1 > this.lidOpen_ && (this.lidTask_ = setTimeout(this.animateLid_.bind(this), 20))
    }
    ;
    aa.Trashcan.prototype.setLidAngle_ = function(a) {
        var b = this.workspace_.toolboxPosition === Q.Position.RIGHT || this.workspace_.horizontalLayout && this.workspace_.RTL;
        this.svgLid_.setAttribute("transform", "rotate(" + (b ? -a : a) + "," + (b ? 4 : 43) + ",14)")
    }
    ;
    aa.Trashcan.prototype.setMinOpenness_ = function(a) {
        this.minOpenness_ = a;
        this.isLidOpen || this.setLidAngle_(45 * a)
    }
    ;
    aa.Trashcan.prototype.closeLid = function() {
        this.setLidOpen(!1)
    }
    ;
    aa.Trashcan.prototype.click = function() {
        this.hasContents_() && this.openFlyout()
    }
    ;
    aa.Trashcan.prototype.fireUiEvent_ = function(a) {
        a = new ((0,
        h.get)(h.TRASHCAN_OPEN))(a,this.workspace_.id);
        (0,
        h.fire)(a)
    }
    ;
    aa.Trashcan.prototype.blockMouseDownWhenOpenable_ = function(a) {
        !this.contentsIsOpen() && this.hasContents_() && a.stopPropagation()
    }
    ;
    aa.Trashcan.prototype.mouseOver_ = function() {
        this.hasContents_() && this.setLidOpen(!0)
    }
    ;
    aa.Trashcan.prototype.mouseOut_ = function() {
        this.setLidOpen(!1)
    }
    ;
    aa.Trashcan.prototype.onDelete_ = function(a) {
        if (!(0 >= this.workspace_.options.maxTrashcanContents || a.type !== h.DELETE || a.wasShadow) && (a = this.cleanBlockJson_(a.oldJson),
        -1 === this.contents_.indexOf(a))) {
            for (this.contents_.unshift(a); this.contents_.length > this.workspace_.options.maxTrashcanContents; )
                this.contents_.pop();
            this.setMinOpenness_(.1)
        }
    }
    ;
    aa.Trashcan.prototype.cleanBlockJson_ = function(a) {
        function b(c) {
            if (c) {
                delete c.id;
                delete c.x;
                delete c.y;
                delete c.enabled;
                if (c.icons && c.icons.comment) {
                    var d = c.icons.comment;
                    delete d.height;
                    delete d.width;
                    delete d.pinned
                }
                d = c.inputs;
                for (var f in d) {
                    var g = d[f];
                    b(g.block);
                    b(g.shadow)
                }
                c.next && (c = c.next,
                b(c.block),
                b(c.shadow))
            }
        }
        a = JSON.parse(JSON.stringify(a));
        b(a);
        a.kind = "BLOCK";
        return JSON.stringify(a)
    }
    ;
    var Wa = {
        FlyoutButton: function(a, b, c, d) {
            this.workspace_ = a;
            this.targetWorkspace_ = b;
            this.text_ = c.text;
            this.position_ = new E(0,0);
            this.isLabel_ = d;
            this.callbackKey_ = c.callbackKey || c.callbackkey;
            this.cssClass_ = c["web-class"] || null;
            this.onMouseUpWrapper_ = null;
            this.info = c
        }
    };
    Wa.FlyoutButton.MARGIN_X = 5;
    Wa.FlyoutButton.MARGIN_Y = 2;
    Wa.FlyoutButton.prototype.width = 0;
    Wa.FlyoutButton.prototype.height = 0;
    Wa.FlyoutButton.prototype.createDom = function() {
        var a = this.isLabel_ ? "blocklyFlyoutLabel" : "blocklyFlyoutButton";
        this.cssClass_ && (a += " " + this.cssClass_);
        this.svgGroup_ = (0,
        l.createSvgElement)(q.G, {
            "class": a
        }, this.workspace_.getCanvas());
        var b;
        this.isLabel_ || (b = (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyFlyoutButtonShadow",
            rx: 4,
            ry: 4,
            x: 1,
            y: 1
        }, this.svgGroup_));
        a = (0,
        l.createSvgElement)(q.RECT, {
            "class": this.isLabel_ ? "blocklyFlyoutLabelBackground" : "blocklyFlyoutButtonBackground",
            rx: 4,
            ry: 4
        }, this.svgGroup_);
        var c = (0,
        l.createSvgElement)(q.TEXT, {
            "class": this.isLabel_ ? "blocklyFlyoutLabelText" : "blocklyText",
            x: 0,
            y: 0,
            "text-anchor": "middle"
        }, this.svgGroup_)
          , d = (0,
        da.replaceMessageReferences)(this.text_);
        this.workspace_.RTL && (d += "\u200f");
        c.textContent = d;
        this.isLabel_ && (this.svgText_ = c,
        this.workspace_.getThemeManager().subscribe(this.svgText_, "flyoutForegroundColour", "fill"));
        var f = (0,
        na.getComputedStyle)(c, "fontSize")
          , g = (0,
        na.getComputedStyle)(c, "fontWeight")
          , k = (0,
        na.getComputedStyle)(c, "fontFamily");
        this.width = (0,
        l.getFastTextWidthWithSizeString)(c, f, g, k);
        d = (0,
        l.measureFontMetrics)(d, f, g, k);
        this.height = d.height;
        this.isLabel_ || (this.width += 2 * Wa.FlyoutButton.MARGIN_X,
        this.height += 2 * Wa.FlyoutButton.MARGIN_Y,
        b.setAttribute("width", this.width),
        b.setAttribute("height", this.height));
        a.setAttribute("width", this.width);
        a.setAttribute("height", this.height);
        c.setAttribute("x", this.width / 2);
        c.setAttribute("y", this.height / 2 - d.height / 2 + d.baseline);
        this.updateTransform_();
        this.onMouseUpWrapper_ = (0,
        u.conditionalBind)(this.svgGroup_, "mouseup", this, this.onMouseUp_);
        return this.svgGroup_
    }
    ;
    Wa.FlyoutButton.prototype.show = function() {
        this.updateTransform_();
        this.svgGroup_.setAttribute("display", "block")
    }
    ;
    Wa.FlyoutButton.prototype.updateTransform_ = function() {
        this.svgGroup_.setAttribute("transform", "translate(" + this.position_.x + "," + this.position_.y + ")")
    }
    ;
    Wa.FlyoutButton.prototype.moveTo = function(a, b) {
        this.position_.x = a;
        this.position_.y = b;
        this.updateTransform_()
    }
    ;
    Wa.FlyoutButton.prototype.isLabel = function() {
        return this.isLabel_
    }
    ;
    Wa.FlyoutButton.prototype.getPosition = function() {
        return this.position_
    }
    ;
    Wa.FlyoutButton.prototype.getButtonText = function() {
        return this.text_
    }
    ;
    Wa.FlyoutButton.prototype.getTargetWorkspace = function() {
        return this.targetWorkspace_
    }
    ;
    Wa.FlyoutButton.prototype.dispose = function() {
        this.onMouseUpWrapper_ && (0,
        u.unbind)(this.onMouseUpWrapper_);
        this.svgGroup_ && (0,
        l.removeNode)(this.svgGroup_);
        this.svgText_ && this.workspace_.getThemeManager().unsubscribe(this.svgText_)
    }
    ;
    Wa.FlyoutButton.prototype.onMouseUp_ = function(a) {
        (a = this.targetWorkspace_.getGesture(a)) && a.cancel();
        this.isLabel_ && this.callbackKey_ ? console.warn("Labels should not have callbacks. Label text: " + this.text_) : this.isLabel_ || this.callbackKey_ && this.targetWorkspace_.getButtonCallback(this.callbackKey_) ? this.isLabel_ || this.targetWorkspace_.getButtonCallback(this.callbackKey_)(this) : console.warn("Buttons should have callbacks. Button text: " + this.text_)
    }
    ;
    (0,
    Ia.register)("\n  .blocklyFlyoutButton {\n    fill: #888;\n    cursor: default;\n  }\n\n  .blocklyFlyoutButtonShadow {\n    fill: #666;\n  }\n\n  .blocklyFlyoutButton:hover {\n    fill: #aaa;\n  }\n\n  .blocklyFlyoutLabel {\n    cursor: default;\n  }\n\n  .blocklyFlyoutLabelBackground {\n    opacity: 0;\n  }\n");
    var Dc = {
        CATEGORY_NAME: "VARIABLE_DYNAMIC",
        onCreateVariableButtonClick_String: function(a) {
            (0,
            e.module$exports$Blockly$Variables.createVariableButtonHandler)(a.getTargetWorkspace(), void 0, "String")
        },
        onCreateVariableButtonClick_Number: function(a) {
            (0,
            e.module$exports$Blockly$Variables.createVariableButtonHandler)(a.getTargetWorkspace(), void 0, "Number")
        },
        onCreateVariableButtonClick_Colour: function(a) {
            (0,
            e.module$exports$Blockly$Variables.createVariableButtonHandler)(a.getTargetWorkspace(), void 0, "Colour")
        },
        flyoutCategory: function(a) {
            var b = []
              , c = document.createElement("button");
            c.setAttribute("text", e.module$exports$Blockly$Msg.Msg.NEW_STRING_VARIABLE);
            c.setAttribute("callbackKey", "CREATE_VARIABLE_STRING");
            b.push(c);
            c = document.createElement("button");
            c.setAttribute("text", e.module$exports$Blockly$Msg.Msg.NEW_NUMBER_VARIABLE);
            c.setAttribute("callbackKey", "CREATE_VARIABLE_NUMBER");
            b.push(c);
            c = document.createElement("button");
            c.setAttribute("text", e.module$exports$Blockly$Msg.Msg.NEW_COLOUR_VARIABLE);
            c.setAttribute("callbackKey", "CREATE_VARIABLE_COLOUR");
            b.push(c);
            a.registerButtonCallback("CREATE_VARIABLE_STRING", Dc.onCreateVariableButtonClick_String);
            a.registerButtonCallback("CREATE_VARIABLE_NUMBER", Dc.onCreateVariableButtonClick_Number);
            a.registerButtonCallback("CREATE_VARIABLE_COLOUR", Dc.onCreateVariableButtonClick_Colour);
            a = (0,
            Dc.flyoutCategoryBlocks)(a);
            return b.concat(a)
        },
        flyoutCategoryBlocks: function(a) {
            a = a.getAllVariables();
            var b = [];
            if (0 < a.length) {
                if (e.module$exports$Blockly$blocks.Blocks.variables_set_dynamic) {
                    var c = a[a.length - 1]
                      , d = (0,
                    e.module$exports$Blockly$utils$xml.createElement)("block");
                    d.setAttribute("type", "variables_set_dynamic");
                    d.setAttribute("gap", 24);
                    d.appendChild((0,
                    e.module$exports$Blockly$Variables.generateVariableFieldDom)(c));
                    b.push(d)
                }
                if (e.module$exports$Blockly$blocks.Blocks.variables_get_dynamic)
                    for (a.sort(yc.compareByName),
                    c = 0; d = a[c]; c++) {
                        var f = (0,
                        e.module$exports$Blockly$utils$xml.createElement)("block");
                        f.setAttribute("type", "variables_get_dynamic");
                        f.setAttribute("gap", 8);
                        f.appendChild((0,
                        e.module$exports$Blockly$Variables.generateVariableFieldDom)(d));
                        b.push(f)
                    }
            }
            return b
        }
    };
    e.module$exports$Blockly$Procedures = {
        CATEGORY_NAME: "PROCEDURE",
        DEFAULT_ARG: "x",
        allProcedures: function(a) {
            var b = a.getBlocksByType("procedures_defnoreturn", !1).map(function(c) {
                return c.getProcedureDef()
            });
            a = a.getBlocksByType("procedures_defreturn", !1).map(function(c) {
                return c.getProcedureDef()
            });
            b.sort(Oe);
            a.sort(Oe);
            return [b, a]
        }
    };
    var Oe = function(a, b) {
        return a[0].localeCompare(b[0], void 0, {
            sensitivity: "base"
        })
    };
    e.module$exports$Blockly$Procedures.findLegalName = function(a, b) {
        if (b.isInFlyout)
            return a;
        for (a = a || e.module$exports$Blockly$Msg.Msg.UNNAMED_KEY || "unnamed"; !rf(a, b.workspace, b); ) {
            var c = a.match(/^(.*?)(\d+)$/);
            a = c ? c[1] + (parseInt(c[2], 10) + 1) : a + "2"
        }
        return a
    }
    ;
    var rf = function(a, b, c) {
        return !(0,
        e.module$exports$Blockly$Procedures.isNameUsed)(a, b, c)
    };
    e.module$exports$Blockly$Procedures.isNameUsed = function(a, b, c) {
        b = b.getAllBlocks(!1);
        for (var d = 0; d < b.length; d++)
            if (b[d] !== c && b[d].getProcedureDef) {
                var f = b[d].getProcedureDef();
                if (e.module$exports$Blockly$Names.Names.equals(f[0], a))
                    return !0
            }
        return !1
    }
    ;
    e.module$exports$Blockly$Procedures.rename = function(a) {
        a = a.trim();
        var b = (0,
        e.module$exports$Blockly$Procedures.findLegalName)(a, this.getSourceBlock())
          , c = this.getValue();
        if (c !== a && c !== b) {
            a = this.getSourceBlock().workspace.getAllBlocks(!1);
            for (var d = 0; d < a.length; d++)
                a[d].renameProcedure && a[d].renameProcedure(c, b)
        }
        return b
    }
    ;
    e.module$exports$Blockly$Procedures.flyoutCategory = function(a) {
        function b(g, k) {
            for (var n = 0; n < g.length; n++) {
                var x = g[n][0]
                  , B = g[n][1]
                  , P = (0,
                e.module$exports$Blockly$utils$xml.createElement)("block");
                P.setAttribute("type", k);
                P.setAttribute("gap", 16);
                var la = (0,
                e.module$exports$Blockly$utils$xml.createElement)("mutation");
                la.setAttribute("name", x);
                P.appendChild(la);
                for (x = 0; x < B.length; x++) {
                    var ya = (0,
                    e.module$exports$Blockly$utils$xml.createElement)("arg");
                    ya.setAttribute("name", B[x]);
                    la.appendChild(ya)
                }
                c.push(P)
            }
        }
        var c = [];
        if (e.module$exports$Blockly$blocks.Blocks.procedures_defnoreturn) {
            var d = (0,
            e.module$exports$Blockly$utils$xml.createElement)("block");
            d.setAttribute("type", "procedures_defnoreturn");
            d.setAttribute("gap", 16);
            var f = (0,
            e.module$exports$Blockly$utils$xml.createElement)("field");
            f.setAttribute("name", "NAME");
            f.appendChild((0,
            e.module$exports$Blockly$utils$xml.createTextNode)(e.module$exports$Blockly$Msg.Msg.PROCEDURES_DEFNORETURN_PROCEDURE));
            d.appendChild(f);
            c.push(d)
        }
        e.module$exports$Blockly$blocks.Blocks.procedures_defreturn && (d = (0,
        e.module$exports$Blockly$utils$xml.createElement)("block"),
        d.setAttribute("type", "procedures_defreturn"),
        d.setAttribute("gap", 16),
        f = (0,
        e.module$exports$Blockly$utils$xml.createElement)("field"),
        f.setAttribute("name", "NAME"),
        f.appendChild((0,
        e.module$exports$Blockly$utils$xml.createTextNode)(e.module$exports$Blockly$Msg.Msg.PROCEDURES_DEFRETURN_PROCEDURE)),
        d.appendChild(f),
        c.push(d));
        e.module$exports$Blockly$blocks.Blocks.procedures_ifreturn && (d = (0,
        e.module$exports$Blockly$utils$xml.createElement)("block"),
        d.setAttribute("type", "procedures_ifreturn"),
        d.setAttribute("gap", 16),
        c.push(d));
        c.length && c[c.length - 1].setAttribute("gap", 24);
        a = (0,
        e.module$exports$Blockly$Procedures.allProcedures)(a);
        b(a[0], "procedures_callnoreturn");
        b(a[1], "procedures_callreturn");
        return c
    }
    ;
    var Pe = function(a) {
        for (var b = [], c = a.getBlocksByType("procedures_mutatorarg", !1), d = 0, f; f = c[d]; d++)
            b.push(f.getFieldValue("NAME"));
        c = (0,
        e.module$exports$Blockly$utils$xml.createElement)("xml");
        d = (0,
        e.module$exports$Blockly$utils$xml.createElement)("block");
        d.setAttribute("type", "procedures_mutatorarg");
        f = (0,
        e.module$exports$Blockly$utils$xml.createElement)("field");
        f.setAttribute("name", "NAME");
        b = (0,
        e.module$exports$Blockly$Variables.generateUniqueNameFromOptions)(e.module$exports$Blockly$Procedures.DEFAULT_ARG, b);
        b = (0,
        e.module$exports$Blockly$utils$xml.createTextNode)(b);
        f.appendChild(b);
        d.appendChild(f);
        c.appendChild(d);
        a.updateToolbox(c)
    };
    e.module$exports$Blockly$Procedures.mutatorOpenListener = function(a) {
        if (a.type === h.BUBBLE_OPEN && "mutator" === a.bubbleType && a.isOpen) {
            a = I.Workspace.getById(a.workspaceId).getBlockById(a.blockId);
            var b = a.type;
            if ("procedures_defnoreturn" === b || "procedures_defreturn" === b)
                a = a.mutator.getWorkspace(),
                Pe(a),
                a.addChangeListener(sf)
        }
    }
    ;
    var sf = function(a) {
        if (a.type === h.CREATE || a.type === h.DELETE || a.type === h.CHANGE)
            a = I.Workspace.getById(a.workspaceId),
            Pe(a)
    };
    e.module$exports$Blockly$Procedures.getCallers = function(a, b) {
        var c = [];
        b = b.getAllBlocks(!1);
        for (var d = 0; d < b.length; d++)
            if (b[d].getProcedureCall) {
                var f = b[d].getProcedureCall();
                f && e.module$exports$Blockly$Names.Names.equals(f, a) && c.push(b[d])
            }
        return c
    }
    ;
    e.module$exports$Blockly$Procedures.mutateCallers = function(a) {
        var b = (0,
        h.getRecordUndo)()
          , c = a.getProcedureDef()[0]
          , d = a.mutationToDom(!0);
        a = (0,
        e.module$exports$Blockly$Procedures.getCallers)(c, a.workspace);
        c = 0;
        for (var f; f = a[c]; c++) {
            var g = f.mutationToDom();
            g = g && (0,
            e.module$exports$Blockly$Xml.domToText)(g);
            f.domToMutation(d);
            var k = f.mutationToDom();
            k = k && (0,
            e.module$exports$Blockly$Xml.domToText)(k);
            g !== k && ((0,
            h.setRecordUndo)(!1),
            (0,
            h.fire)(new ((0,
            h.get)(h.CHANGE))(f,"mutation",null,g,k)),
            (0,
            h.setRecordUndo)(b))
        }
    }
    ;
    e.module$exports$Blockly$Procedures.getDefinition = function(a, b) {
        b = b.getAllBlocks(!1);
        for (var c = 0; c < b.length; c++)
            if (b[c].getProcedureDef) {
                var d = b[c].getProcedureDef();
                if (d && e.module$exports$Blockly$Names.Names.equals(d[0], a))
                    return b[c]
            }
        return null
    }
    ;
    e.module$exports$Blockly$Mutator = {
        Mutator: function(a) {
            e.module$exports$Blockly$Mutator.Mutator.superClass_.constructor.call(this, null);
            this.quarkNames_ = a
        }
    };
    (0,
    e.module$exports$Blockly$utils$object.inherits)(e.module$exports$Blockly$Mutator.Mutator, Ea);
    e.module$exports$Blockly$Mutator.Mutator.prototype.workspace_ = null;
    e.module$exports$Blockly$Mutator.Mutator.prototype.workspaceWidth_ = 0;
    e.module$exports$Blockly$Mutator.Mutator.prototype.workspaceHeight_ = 0;
    e.module$exports$Blockly$Mutator.Mutator.prototype.setBlock = function(a) {
        this.block_ = a
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.getWorkspace = function() {
        return this.workspace_
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.drawIcon_ = function(a) {
        (0,
        l.createSvgElement)(q.RECT, {
            "class": "blocklyIconShape",
            rx: "4",
            ry: "4",
            height: "16",
            width: "16"
        }, a);
        (0,
        l.createSvgElement)(q.PATH, {
            "class": "blocklyIconSymbol",
            d: "m4.203,7.296 0,1.368 -0.92,0.677 -0.11,0.41 0.9,1.559 0.41,0.11 1.043,-0.457 1.187,0.683 0.127,1.134 0.3,0.3 1.8,0 0.3,-0.299 0.127,-1.138 1.185,-0.682 1.046,0.458 0.409,-0.11 0.9,-1.559 -0.11,-0.41 -0.92,-0.677 0,-1.366 0.92,-0.677 0.11,-0.41 -0.9,-1.559 -0.409,-0.109 -1.046,0.458 -1.185,-0.682 -0.127,-1.138 -0.3,-0.299 -1.8,0 -0.3,0.3 -0.126,1.135 -1.187,0.682 -1.043,-0.457 -0.41,0.11 -0.899,1.559 0.108,0.409z"
        }, a);
        (0,
        l.createSvgElement)(q.CIRCLE, {
            "class": "blocklyIconShape",
            r: "2.7",
            cx: "8",
            cy: "8"
        }, a)
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.iconClick_ = function(a) {
        this.block_.isEditable() && Ea.prototype.iconClick_.call(this, a)
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.createEditor_ = function() {
        this.svgDialog_ = (0,
        l.createSvgElement)(q.SVG, {
            x: C.Bubble.BORDER_WIDTH,
            y: C.Bubble.BORDER_WIDTH
        }, null);
        if (this.quarkNames_.length)
            for (var a = (0,
            e.module$exports$Blockly$utils$xml.createElement)("xml"), b = 0, c; c = this.quarkNames_[b]; b++) {
                var d = (0,
                e.module$exports$Blockly$utils$xml.createElement)("block");
                d.setAttribute("type", c);
                a.appendChild(d)
            }
        else
            a = null;
        b = new gb.Options({
            disable: !1,
            parentWorkspace: this.block_.workspace,
            media: this.block_.workspace.options.pathToMedia,
            rtl: this.block_.RTL,
            horizontalLayout: !1,
            renderer: this.block_.workspace.options.renderer,
            rendererOverrides: this.block_.workspace.options.rendererOverrides
        });
        b.toolboxPosition = this.block_.RTL ? Q.Position.RIGHT : Q.Position.LEFT;
        if (c = !!a)
            b.languageTree = (0,
            Q.convertToolboxDefToJson)(a);
        this.workspace_ = new t.WorkspaceSvg(b);
        this.workspace_.isMutator = !0;
        this.workspace_.addChangeListener(h.disableOrphans);
        a = c ? this.workspace_.addFlyout(q.G) : null;
        b = this.workspace_.createDom("blocklyMutatorBackground");
        a && b.insertBefore(a, this.workspace_.svgBlockCanvas_);
        this.svgDialog_.appendChild(b);
        return this.svgDialog_
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.updateEditable = function() {
        e.module$exports$Blockly$Mutator.Mutator.superClass_.updateEditable.call(this);
        this.block_.isInFlyout || (this.block_.isEditable() ? this.iconGroup_ && (0,
        l.removeClass)(this.iconGroup_, "blocklyIconGroupReadonly") : (this.setVisible(!1),
        this.iconGroup_ && (0,
        l.addClass)(this.iconGroup_, "blocklyIconGroupReadonly")))
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.resizeBubble_ = function() {
        var a = 2 * C.Bubble.BORDER_WIDTH
          , b = this.workspace_.getCanvas().getBBox()
          , c = b.width + b.x
          , d = b.height + 3 * a
          , f = this.workspace_.getFlyout();
        if (f) {
            var g = f.getWorkspace().getMetricsManager().getScrollMetrics();
            d = Math.max(d, g.height + 20);
            c += f.getWidth()
        }
        this.block_.RTL && (c = -b.x);
        c += 3 * a;
        if (Math.abs(this.workspaceWidth_ - c) > a || Math.abs(this.workspaceHeight_ - d) > a)
            this.workspaceWidth_ = c,
            this.workspaceHeight_ = d,
            this.bubble_.setBubbleSize(c + a, d + a),
            this.svgDialog_.setAttribute("width", this.workspaceWidth_),
            this.svgDialog_.setAttribute("height", this.workspaceHeight_),
            this.workspace_.setCachedParentSvgSize(this.workspaceWidth_, this.workspaceHeight_);
        this.block_.RTL && (a = "translate(" + this.workspaceWidth_ + ",0)",
        this.workspace_.getCanvas().setAttribute("transform", a));
        this.workspace_.resize()
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.onBubbleMove_ = function() {
        this.workspace_ && this.workspace_.recordDragTargets()
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.setVisible = function(a) {
        if (a !== this.isVisible())
            if ((0,
            h.fire)(new ((0,
            h.get)(h.BUBBLE_OPEN))(this.block_,a,"mutator")),
            a) {
                this.bubble_ = new C.Bubble(this.block_.workspace,this.createEditor_(),this.block_.pathObject.svgPath,this.iconXY_,null,null);
                this.bubble_.setSvgId(this.block_.id);
                this.bubble_.registerMoveEvent(this.onBubbleMove_.bind(this));
                var b = this.workspace_.options.languageTree;
                a = this.workspace_.getFlyout();
                b && (a.init(this.workspace_),
                a.show(b));
                this.rootBlock_ = this.block_.decompose(this.workspace_);
                b = this.rootBlock_.getDescendants(!1);
                for (var c = 0, d = void 0; d = b[c]; c++)
                    d.render();
                this.rootBlock_.setMovable(!1);
                this.rootBlock_.setDeletable(!1);
                a ? (b = 2 * a.CORNER_RADIUS,
                a = this.rootBlock_.RTL ? a.getWidth() + b : b) : a = b = 16;
                this.block_.RTL && (a = -a);
                this.rootBlock_.moveBy(a, b);
                if (this.block_.saveConnections) {
                    var f = this
                      , g = this.block_;
                    g.saveConnections(this.rootBlock_);
                    this.sourceListener_ = function() {
                        g.saveConnections(f.rootBlock_)
                    }
                    ;
                    this.block_.workspace.addChangeListener(this.sourceListener_)
                }
                this.resizeBubble_();
                this.workspace_.addChangeListener(this.workspaceChanged_.bind(this));
                this.updateWorkspace_();
                this.applyColour()
            } else
                this.svgDialog_ = null,
                this.workspace_.dispose(),
                this.rootBlock_ = this.workspace_ = null,
                this.bubble_.dispose(),
                this.bubble_ = null,
                this.workspaceHeight_ = this.workspaceWidth_ = 0,
                this.sourceListener_ && (this.block_.workspace.removeChangeListener(this.sourceListener_),
                this.sourceListener_ = null)
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.workspaceChanged_ = function(a) {
        a.isUiEvent || a.type === h.CHANGE && "disabled" === a.element || a.type === h.CREATE || this.updateWorkspace_()
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.updateWorkspace_ = function() {
        if (!this.workspace_.isDragging())
            for (var a = this.workspace_.getTopBlocks(!1), b = 0, c = void 0; c = a[b]; b++) {
                var d = c.getRelativeToSurfaceXY();
                20 > d.y && c.moveBy(0, 20 - d.y);
                if (c.RTL) {
                    var f = -20
                      , g = this.workspace_.getFlyout();
                    g && (f -= g.getWidth());
                    d.x > f && c.moveBy(f - d.x, 0)
                } else
                    20 > d.x && c.moveBy(20 - d.x, 0)
            }
        if (this.rootBlock_.workspace === this.workspace_) {
            (0,
            h.setGroup)(!0);
            var k = this.block_;
            a = $a.BlockChange.getExtraBlockState_(k);
            b = k.rendered;
            k.rendered = !1;
            k.compose(this.rootBlock_);
            k.rendered = b;
            k.initSvg();
            k.rendered && k.render();
            b = $a.BlockChange.getExtraBlockState_(k);
            if (a !== b) {
                (0,
                h.fire)(new ((0,
                h.get)(h.CHANGE))(k,"mutation",null,a,b));
                var n = (0,
                h.getGroup)();
                setTimeout(function() {
                    (0,
                    h.setGroup)(n);
                    k.bumpNeighbours();
                    (0,
                    h.setGroup)(!1)
                }, e.module$exports$Blockly$internalConstants.BUMP_DELAY)
            }
            this.workspace_.isDragging() || this.resizeBubble_();
            (0,
            h.setGroup)(!1)
        }
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.dispose = function() {
        this.block_.mutator = null;
        Ea.prototype.dispose.call(this)
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.prototype.updateBlockStyle = function() {
        var a = this.workspace_;
        if (a && a.getAllBlocks(!1)) {
            for (var b = a.getAllBlocks(!1), c = 0, d; d = b[c]; c++)
                d.setStyle(d.getStyleName());
            if (a = a.getFlyout())
                for (a = a.workspace_.getAllBlocks(!1),
                b = 0; c = a[b]; b++)
                    c.setStyle(c.getStyleName())
        }
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.reconnect = function(a, b, c) {
        if (!a || !a.getSourceBlock().workspace)
            return !1;
        c = b.getInput(c).connection;
        var d = a.targetBlock();
        return d && d !== b || c.targetConnection === a ? !1 : (c.isConnected() && c.disconnect(),
        c.connect(a),
        !0)
    }
    ;
    e.module$exports$Blockly$Mutator.Mutator.findParentWs = function(a) {
        var b = null;
        if (a && a.options) {
            var c = a.options.parentWorkspace;
            a.isFlyout ? c && c.options && (b = c.options.parentWorkspace) : c && (b = c)
        }
        return b
    }
    ;
    e.Blockly = {
        VERSION: "7.20211209.4"
    };
    e.Blockly.ALIGN_LEFT = e.module$exports$Blockly$Input.Align.LEFT;
    e.Blockly.ALIGN_CENTRE = e.module$exports$Blockly$Input.Align.CENTRE;
    e.Blockly.ALIGN_RIGHT = e.module$exports$Blockly$Input.Align.RIGHT;
    e.Blockly.INPUT_VALUE = e.module$exports$Blockly$ConnectionType.ConnectionType.INPUT_VALUE;
    e.Blockly.OUTPUT_VALUE = e.module$exports$Blockly$ConnectionType.ConnectionType.OUTPUT_VALUE;
    e.Blockly.NEXT_STATEMENT = e.module$exports$Blockly$ConnectionType.ConnectionType.NEXT_STATEMENT;
    e.Blockly.PREVIOUS_STATEMENT = e.module$exports$Blockly$ConnectionType.ConnectionType.PREVIOUS_STATEMENT;
    e.Blockly.DUMMY_INPUT = e.module$exports$Blockly$inputTypes.inputTypes.DUMMY;
    e.Blockly.TOOLBOX_AT_TOP = Q.Position.TOP;
    e.Blockly.TOOLBOX_AT_BOTTOM = Q.Position.BOTTOM;
    e.Blockly.TOOLBOX_AT_LEFT = Q.Position.LEFT;
    e.Blockly.TOOLBOX_AT_RIGHT = Q.Position.RIGHT;
    e.Blockly.svgResize = e.module$exports$Blockly$common.svgResize;
    e.Blockly.hideChaff = function(a) {
        (0,
        e.module$exports$Blockly$common.getMainWorkspace)().hideChaff(a)
    }
    ;
    e.Blockly.getMainWorkspace = e.module$exports$Blockly$common.getMainWorkspace;
    e.Blockly.defineBlocksWithJsonArray = e.module$exports$Blockly$common.defineBlocksWithJsonArray;
    e.Blockly.setParentContainer = e.module$exports$Blockly$common.setParentContainer;
    Object.defineProperties(e.Blockly, {
        alert: {
            set: function(a) {
                (0,
                V.warn)("Blockly.alert", "December 2021", "December 2022");
                (0,
                Oa.setAlert)(a)
            },
            get: function() {
                (0,
                V.warn)("Blockly.alert", "December 2021", "December 2022", "Blockly.dialog.alert()");
                return Oa.alert
            }
        },
        confirm: {
            set: function(a) {
                (0,
                V.warn)("Blockly.confirm", "December 2021", "December 2022");
                (0,
                Oa.setConfirm)(a)
            },
            get: function() {
                (0,
                V.warn)("Blockly.confirm", "December 2021", "December 2022", "Blockly.dialog.confirm()");
                return Oa.confirm
            }
        },
        mainWorkspace: {
            set: function(a) {
                (0,
                e.module$exports$Blockly$common.setMainWorkspace)(a)
            },
            get: function() {
                return (0,
                e.module$exports$Blockly$common.getMainWorkspace)()
            }
        },
        prompt: {
            set: function(a) {
                (0,
                V.warn)("Blockly.prompt", "December 2021", "December 2022");
                (0,
                Oa.setPrompt)(a)
            },
            get: function() {
                (0,
                V.warn)("Blockly.prompt", "December 2021", "December 2022", "Blockly.dialog.prompt()");
                return Oa.prompt
            }
        },
        selected: {
            get: function() {
                return (0,
                e.module$exports$Blockly$common.getSelected)()
            },
            set: function(a) {
                (0,
                e.module$exports$Blockly$common.setSelected)(a)
            }
        },
        HSV_SATURATION: {
            get: function() {
                return W.colour.getHsvSaturation()
            },
            set: function(a) {
                W.colour.setHsvSaturation(a)
            }
        },
        HSV_VALUE: {
            get: function() {
                return W.colour.getHsvValue()
            },
            set: function(a) {
                W.colour.setHsvValue(a)
            }
        }
    });
    e.Blockly.svgSize = ca.svgSize;
    e.Blockly.resizeSvgContents = function(a) {
        (0,
        V.warn)("Blockly.resizeSvgContents", "December 2021", "December 2022", "Blockly.WorkspaceSvg.resizeSvgContents");
        (0,
        t.resizeSvgContents)(a)
    }
    ;
    e.Blockly.copy = function(a) {
        (0,
        V.warn)("Blockly.copy", "December 2021", "December 2022", "Blockly.clipboard.copy");
        (0,
        rb.copy)(a)
    }
    ;
    e.Blockly.paste = function() {
        (0,
        V.warn)("Blockly.paste", "December 2021", "December 2022", "Blockly.clipboard.paste");
        return (0,
        rb.paste)()
    }
    ;
    e.Blockly.duplicate = function(a) {
        (0,
        V.warn)("Blockly.duplicate", "December 2021", "December 2022", "Blockly.clipboard.duplicate");
        (0,
        rb.duplicate)(a)
    }
    ;
    e.Blockly.isNumber = function(a) {
        (0,
        V.warn)("Blockly.isNumber", "December 2021", "December 2022", "Blockly.utils.string.isNumber");
        return W.string.isNumber(a)
    }
    ;
    e.Blockly.hueToHex = function(a) {
        (0,
        V.warn)("Blockly.hueToHex", "December 2021", "December 2022", "Blockly.utils.colour.hueToHex");
        return (0,
        ha.hueToHex)(a)
    }
    ;
    e.Blockly.bindEvent_ = function(a, b, c, d) {
        (0,
        V.warn)("Blockly.bindEvent_", "December 2021", "December 2022", "Blockly.browserEvents.bind");
        return (0,
        u.bind)(a, b, c, d)
    }
    ;
    e.Blockly.unbindEvent_ = function(a) {
        (0,
        V.warn)("Blockly.unbindEvent_", "December 2021", "December 2022", "Blockly.browserEvents.unbind");
        return (0,
        u.unbind)(a)
    }
    ;
    e.Blockly.bindEventWithChecks_ = function(a, b, c, d, f, g) {
        (0,
        V.warn)("Blockly.bindEventWithChecks_", "December 2021", "December 2022", "Blockly.browserEvents.conditionalBind");
        return (0,
        u.conditionalBind)(a, b, c, d, f, g)
    }
    ;
    e.Blockly.LINE_MODE_MULTIPLIER = e.module$exports$Blockly$internalConstants.LINE_MODE_MULTIPLIER;
    e.Blockly.PAGE_MODE_MULTIPLIER = e.module$exports$Blockly$internalConstants.PAGE_MODE_MULTIPLIER;
    e.Blockly.DRAG_RADIUS = e.module$exports$Blockly$internalConstants.DRAG_RADIUS;
    e.Blockly.FLYOUT_DRAG_RADIUS = e.module$exports$Blockly$internalConstants.FLYOUT_DRAG_RADIUS;
    e.Blockly.SNAP_RADIUS = e.module$exports$Blockly$internalConstants.SNAP_RADIUS;
    e.Blockly.CONNECTING_SNAP_RADIUS = e.module$exports$Blockly$internalConstants.SNAP_RADIUS;
    e.Blockly.CURRENT_CONNECTION_PREFERENCE = e.module$exports$Blockly$internalConstants.CURRENT_CONNECTION_PREFERENCE;
    e.Blockly.BUMP_DELAY = e.module$exports$Blockly$internalConstants.BUMP_DELAY;
    e.Blockly.BUMP_RANDOMNESS = e.module$exports$Blockly$internalConstants.BUMP_RANDOMNESS;
    e.Blockly.COLLAPSE_CHARS = e.module$exports$Blockly$internalConstants.COLLAPSE_CHARS;
    e.Blockly.LONGPRESS = e.module$exports$Blockly$internalConstants.LONGPRESS;
    e.Blockly.SOUND_LIMIT = e.module$exports$Blockly$internalConstants.SOUND_LIMIT;
    e.Blockly.DRAG_STACK = e.module$exports$Blockly$internalConstants.DRAG_STACK;
    e.Blockly.SPRITE = e.module$exports$Blockly$internalConstants.SPRITE;
    e.Blockly.DRAG_NONE = e.module$exports$Blockly$internalConstants.DRAG_NONE;
    e.Blockly.DRAG_STICKY = e.module$exports$Blockly$internalConstants.DRAG_STICKY;
    e.Blockly.DRAG_BEGIN = e.module$exports$Blockly$internalConstants.DRAG_BEGIN;
    e.Blockly.DRAG_FREE = e.module$exports$Blockly$internalConstants.DRAG_FREE;
    e.Blockly.OPPOSITE_TYPE = e.module$exports$Blockly$internalConstants.OPPOSITE_TYPE;
    e.Blockly.RENAME_VARIABLE_ID = e.module$exports$Blockly$internalConstants.RENAME_VARIABLE_ID;
    e.Blockly.DELETE_VARIABLE_ID = e.module$exports$Blockly$internalConstants.DELETE_VARIABLE_ID;
    e.Blockly.COLLAPSED_INPUT_NAME = dc.COLLAPSED_INPUT_NAME;
    e.Blockly.COLLAPSED_FIELD_NAME = dc.COLLAPSED_FIELD_NAME;
    e.Blockly.VARIABLE_CATEGORY_NAME = e.module$exports$Blockly$Variables.CATEGORY_NAME;
    e.Blockly.VARIABLE_DYNAMIC_CATEGORY_NAME = Dc.CATEGORY_NAME;
    e.Blockly.PROCEDURE_CATEGORY_NAME = e.module$exports$Blockly$Procedures.CATEGORY_NAME;
    e.Blockly.ASTNode = v.ASTNode;
    e.Blockly.BasicCursor = ab.BasicCursor;
    e.Blockly.Block = A.Block;
    e.Blockly.BlocklyOptions = function() {}
    ;
    e.Blockly.BlockDragger = Ua;
    e.Blockly.BlockDragSurfaceSvg = Na;
    e.Blockly.BlockSvg = z.BlockSvg;
    e.Blockly.Blocks = e.module$exports$Blockly$blocks.Blocks;
    e.Blockly.Bubble = C.Bubble;
    e.Blockly.BubbleDragger = Ib;
    e.Blockly.CollapsibleToolboxCategory = sa.CollapsibleToolboxCategory;
    e.Blockly.Comment = Ka.Comment;
    e.Blockly.ComponentManager = ia;
    e.Blockly.Connection = F;
    e.Blockly.ConnectionType = e.module$exports$Blockly$ConnectionType.ConnectionType;
    e.Blockly.ConnectionChecker = ec;
    e.Blockly.ConnectionDB = pb;
    e.Blockly.ContextMenu = e.module$exports$Blockly$ContextMenu;
    e.Blockly.ContextMenuItems = ta;
    e.Blockly.ContextMenuRegistry = ba.ContextMenuRegistry;
    e.Blockly.Css = Ia;
    e.Blockly.Cursor = jc.Cursor;
    e.Blockly.DeleteArea = vc.DeleteArea;
    e.Blockly.DragTarget = Ec;
    e.Blockly.DropDownDiv = y;
    e.Blockly.Events = e.module$exports$Blockly$Events;
    e.Blockly.Extensions = e.module$exports$Blockly$Extensions;
    e.Blockly.Field = D;
    e.Blockly.FieldAngle = M.FieldAngle;
    e.Blockly.FieldCheckbox = e.module$exports$Blockly$FieldCheckbox.FieldCheckbox;
    e.Blockly.FieldColour = Z.FieldColour;
    e.Blockly.FieldDropdown = e.module$exports$Blockly$FieldDropdown.FieldDropdown;
    e.Blockly.FieldImage = e.module$exports$Blockly$FieldImage.FieldImage;
    e.Blockly.FieldLabel = e.module$exports$Blockly$FieldLabel.FieldLabel;
    e.Blockly.FieldLabelSerializable = Gc.FieldLabelSerializable;
    e.Blockly.FieldMultilineInput = wa.FieldMultilineInput;
    e.Blockly.FieldNumber = Ha.FieldNumber;
    e.Blockly.FieldTextInput = e.module$exports$Blockly$FieldTextInput.FieldTextInput;
    e.Blockly.FieldVariable = ka.FieldVariable;
    e.Blockly.Flyout = R.Flyout;
    e.Blockly.FlyoutButton = Wa.FlyoutButton;
    e.Blockly.FlyoutMetricsManager = Fc.FlyoutMetricsManager;
    e.Blockly.Generator = e.module$exports$Blockly$Generator.Generator;
    e.Blockly.Gesture = U;
    e.Blockly.Grid = yb;
    e.Blockly.HorizontalFlyout = jb.HorizontalFlyout;
    e.Blockly.IASTNodeLocation = function() {}
    ;
    e.Blockly.IASTNodeLocationSvg = function() {}
    ;
    e.Blockly.IASTNodeLocationWithBlock = function() {}
    ;
    e.Blockly.IAutoHideable = function() {}
    ;
    e.Blockly.IBlockDragger = function() {}
    ;
    e.Blockly.IBoundedElement = function() {}
    ;
    e.Blockly.IBubble = function() {}
    ;
    e.Blockly.ICollapsibleToolboxItem = function() {}
    ;
    e.Blockly.IComponent = function() {}
    ;
    e.Blockly.IConnectionChecker = function() {}
    ;
    e.Blockly.IContextMenu = function() {}
    ;
    e.Blockly.Icon = Ea;
    e.Blockly.ICopyable = function() {}
    ;
    e.Blockly.IDeletable = function() {}
    ;
    e.Blockly.IDeleteArea = function() {}
    ;
    e.Blockly.IDragTarget = function() {}
    ;
    e.Blockly.IDraggable = function() {}
    ;
    e.Blockly.IFlyout = function() {}
    ;
    e.Blockly.IKeyboardAccessible = function() {}
    ;
    e.Blockly.IMetricsManager = function() {}
    ;
    e.Blockly.IMovable = function() {}
    ;
    e.Blockly.Input = e.module$exports$Blockly$Input.Input;
    e.Blockly.InsertionMarkerManager = ea;
    e.Blockly.IPositionable = function() {}
    ;
    e.Blockly.IRegistrable = function() {}
    ;
    e.Blockly.IRegistrableField = {};
    e.Blockly.ISelectable = function() {}
    ;
    e.Blockly.ISelectableToolboxItem = function() {}
    ;
    e.Blockly.IStyleable = function() {}
    ;
    e.Blockly.IToolbox = function() {}
    ;
    e.Blockly.IToolboxItem = function() {}
    ;
    e.Blockly.Marker = ic;
    e.Blockly.MarkerManager = nb;
    e.Blockly.Menu = Fa;
    e.Blockly.MenuItem = Ya;
    e.Blockly.MetricsManager = bb;
    e.Blockly.Mutator = e.module$exports$Blockly$Mutator.Mutator;
    e.Blockly.Msg = e.module$exports$Blockly$Msg.Msg;
    e.Blockly.Names = e.module$exports$Blockly$Names.Names;
    e.Blockly.Options = gb.Options;
    e.Blockly.Procedures = e.module$exports$Blockly$Procedures;
    e.Blockly.RenderedConnection = Y.RenderedConnection;
    e.Blockly.Scrollbar = G.Scrollbar;
    e.Blockly.ScrollbarPair = hb;
    e.Blockly.ShortcutItems = eb;
    e.Blockly.ShortcutRegistry = K.ShortcutRegistry;
    e.Blockly.TabNavigateCursor = dd.TabNavigateCursor;
    e.Blockly.Theme = fb;
    e.Blockly.Themes = ae;
    e.Blockly.ThemeManager = lc;
    e.Blockly.Toolbox = S.Toolbox;
    e.Blockly.ToolboxCategory = X.ToolboxCategory;
    e.Blockly.ToolboxItem = Jb;
    e.Blockly.ToolboxSeparator = Kb.ToolboxSeparator;
    e.Blockly.Tooltip = T;
    e.Blockly.Touch = N;
    e.Blockly.TouchGesture = ra.TouchGesture;
    e.Blockly.Trashcan = aa.Trashcan;
    e.Blockly.VariableMap = Ta;
    e.Blockly.VariableModel = yc;
    e.Blockly.Variables = e.module$exports$Blockly$Variables;
    e.Blockly.VariablesDynamic = Dc;
    e.Blockly.VerticalFlyout = cb.VerticalFlyout;
    e.Blockly.Warning = Ab.Warning;
    e.Blockly.WidgetDiv = ma;
    e.Blockly.Workspace = I.Workspace;
    e.Blockly.WorkspaceAudio = Cc;
    e.Blockly.WorkspaceComment = oa.WorkspaceComment;
    e.Blockly.WorkspaceCommentSvg = L.WorkspaceCommentSvg;
    e.Blockly.WorkspaceDragSurfaceSvg = bc;
    e.Blockly.WorkspaceDragger = Mc;
    e.Blockly.WorkspaceSvg = t.WorkspaceSvg;
    e.Blockly.Xml = e.module$exports$Blockly$Xml;
    e.Blockly.ZoomControls = Ga.ZoomControls;
    e.Blockly.blockAnimations = Hb;
    e.Blockly.blockRendering = fa;
    e.Blockly.browserEvents = u;
    e.Blockly.bumpObjects = wc;
    e.Blockly.clipboard = rb;
    e.Blockly.common = e.module$exports$Blockly$common;
    e.Blockly.connectionTypes = e.module$exports$Blockly$ConnectionType.ConnectionType;
    e.Blockly.constants = dc;
    e.Blockly.dialog = Oa;
    e.Blockly.fieldRegistry = mb;
    e.Blockly.geras = Zb;
    e.Blockly.inject = function(a, b) {
        "string" === typeof a && (a = document.getElementById(a) || document.querySelector(a));
        if (!a || !(0,
        l.containsNode)(document, a))
            throw Error("Error: container is not in current document.");
        b = new gb.Options(b || {});
        var c = document.createElement("div");
        c.className = "injectionDiv";
        c.tabIndex = 0;
        (0,
        J.setState)(c, J.State.LABEL, e.module$exports$Blockly$Msg.Msg.WORKSPACE_ARIA_LABEL);
        a.appendChild(c);
        a = kf(c, b);
        var d = new Na(c)
          , f = new bc(c)
          , g = lf(a, b, d, f);
        of(g);
        (0,
        e.module$exports$Blockly$common.setMainWorkspace)(g);
        (0,
        e.module$exports$Blockly$common.svgResize)(g);
        c.addEventListener("focusin", function() {
            (0,
            e.module$exports$Blockly$common.setMainWorkspace)(g)
        });
        return g
    }
    ;
    e.Blockly.inputTypes = e.module$exports$Blockly$inputTypes.inputTypes;
    e.Blockly.minimalist = gd;
    e.Blockly.registry = r;
    e.Blockly.serialization = {
        blocks: Sa,
        exceptions: ua,
        priorities: Sd,
        registry: Td,
        variables: {},
        workspaces: {
            save: function(a) {
                var b = Object.create(null), c = (0,
                r.getAllItems)(r.Type.SERIALIZER, !0), d;
                for (d in c) {
                    var f = c[d].save(a);
                    f && (b[d] = f)
                }
                return b
            },
            load: function(a, b, c) {
                c = void 0 === c ? {} : c;
                var d = void 0 === c.recordUndo ? !1 : c.recordUndo;
                if (c = (0,
                r.getAllItems)(r.Type.SERIALIZER, !0)) {
                    var f = Object.entries(c).sort(function(n, x) {
                        return x[1].priority - n[1].priority
                    });
                    c = (0,
                    h.getRecordUndo)();
                    (0,
                    h.setRecordUndo)(d);
                    (d = (0,
                    h.getGroup)()) || (0,
                    h.setGroup)(!0);
                    (0,
                    l.startTextWidthCache)();
                    b.setResizesEnabled && b.setResizesEnabled(!1);
                    for (var g = w.makeIterator(f.reverse()), k = g.next(); !k.done; k = g.next())
                        k = w.makeIterator(k.value),
                        k.next(),
                        k.next().value.clear(b);
                    f = w.makeIterator(f.reverse());
                    for (g = f.next(); !g.done; g = f.next())
                        k = w.makeIterator(g.value),
                        g = k.next().value,
                        k = k.next().value,
                        a[g] && k.load(a[g], b);
                    b.setResizesEnabled && b.setResizesEnabled(!0);
                    (0,
                    l.stopTextWidthCache)();
                    (0,
                    h.fire)(new ((0,
                    h.get)(h.FINISHED_LOADING))(b));
                    (0,
                    h.setGroup)(d);
                    (0,
                    h.setRecordUndo)(c)
                }
            }
        },
        ISerializer: od
    };
    e.Blockly.thrasos = $d;
    e.Blockly.uiPosition = Ma;
    e.Blockly.utils = W;
    e.Blockly.zelos = Lb;
    "Blockly"in e.module$exports$Blockly$utils$global.globalThis || (e.module$exports$Blockly$utils$global.globalThis.Blockly = {
        Msg: e.module$exports$Blockly$Msg.Msg
    });
    e.Blockly.internal_ = e;
    return e.Blockly
});
