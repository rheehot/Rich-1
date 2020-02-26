"use strict";
import getJS from "./network/getJS";
import makeAjax from "./network/makeAjax";
import getParam from "./network/getParam";
import ClassUUID from "./core/ClassUUID";
import throwError from "./core/throwError";
import Dom from "./display/Dom";
import DETECTOR from "./ditector/DETECTOR";
import dispatcher from "./core/dispatcher";
import Css from "./css/Css";
import LOOPER from "./looper/LOOPER";
import KEY from "./keyboard/KEY";
import STORAGE from "./storage/STORAGE";
import WIN from "./window/WIN";
import getCSS from "./network/getCSS";

const Rich = (_ => {
    let tempRich;
    let CLASS_NAME_TABLE = {};

    tempRich = {
        addMethod: (name, method) => {
            if (method instanceof Function) {
                if (tempRich[name]) throwError(`${name} : 이미 존재하는 메서드 네임`);
                else {
                    let t;
                    if ((t = name.charAt(0)) !== t.toLowerCase()) throwError(`${name} : 메서드 네임은 소문자로 시작해야함`);
                    else tempRich[name] = method;

                }
            } else throwError(`${name} : 함수만 메서드로 등록가능`);
        },

        addClass: (function () {
            let checkTableAndName;
            checkTableAndName = name => {
                let t;
                if (CLASS_NAME_TABLE[name]) throwError(`${name} : 이미 존재하는 클래스 네임`);
                if ((t = name.charAt(0)) !== t.toUpperCase()) throwError(`${name} : 클래스 네임은 대문자로 시작해야함`);
                return true
            }
            return (name, cls, isClassYn = true) => {
                if (cls instanceof Function) {
                    checkTableAndName(name)
                    CLASS_NAME_TABLE[name] = cls;
                    // if (isClassYn) tempRich[name] = (...arg) => {
                    //     return new cls(...arg)
                    // };
                    // else tempRich[name] = cls;
                    tempRich[name] = cls

                } else throwError(`${name} : 클래스는 함수 확장형이어야함`);
            }
        })(),
        addStatic: (name, staticObj) => {
            if (!(staticObj instanceof Function) && staticObj instanceof Object) {
                if (name !== name.toUpperCase()) throwError(`${name} : 스타틱 오브젝트 네임은 대문자만 허용함`);
                if (tempRich[name]) throwError(`${name} : 이미 존재하는 오브젝트 네임`);
                else tempRich[name] = staticObj;
            } else throwError(`${name} : 오브젝트만 스타틱으로로 등록가능`);
        },
        init: (...urls) => {
            return new Promise((resolve, reject) => {
                let tick = time => {
                    switch (document.readyState) {
                        case'complete':
                        case'loaded':
                            console.log('document.readyState :', document.readyState)
                            break;
                        case'interactive':
                            if (document.documentElement.doScroll) try {
                                document.documentElement.doScroll('left');
                            } catch (e) {
                                return requestAnimationFrame(tick)
                            }
                        default:
                            return requestAnimationFrame(tick)
                    }

                    console.log('초기화시간', time);

                    if (urls) {
                        let jsURLs = [];
                        let cssURLs = [];
                        urls.forEach(url => {
                            if (url.includes('.css')) cssURLs.push(url)
                            else if (url.includes('.js')) jsURLs.push(url)
                        });
                        let t0 = Promise.all(
                            [
                                getJS(...jsURLs),
                                getCSS(...cssURLs)
                            ]
                        ).then(_ => {
                            resolve(tempRich)
                        });
                        if (reject) t0.catch(error => reject(error))
                    } else resolve(tempRich);
                    dispatcher(window, 'resize')


                }
                requestAnimationFrame(tick)
            })
        }
    }
    // method
    tempRich.addMethod('throwError', throwError);
    tempRich.addMethod('getParam', getParam);
    tempRich.addMethod('dispatcher', dispatcher);
    tempRich.addMethod('makeAjax', makeAjax);
    tempRich.addMethod('ajaxJsonGet', makeAjax({method: 'GET', headers: {'Content-Type': 'application/json'}}));
    tempRich.addMethod('ajaxJsonPost', makeAjax({method: 'POST', headers: {'Content-Type': 'application/json'}}));
    tempRich.addMethod('getJS', getJS);
    tempRich.addMethod('getCSS', getCSS);

    // class
    tempRich.addClass('ClassUUID', ClassUUID);
    tempRich.addClass('Dom', Dom, false);
    tempRich.addClass('Css', Css, false);
    // static
    tempRich.addStatic('DETECTOR', DETECTOR);
    tempRich.addStatic('KEY', KEY);
    tempRich.addStatic('LOOPER', LOOPER);
    tempRich.addStatic('STORAGE', STORAGE);
    tempRich.addStatic('WIN', WIN);
    dispatcher(window, 'resize')
    return tempRich
})();
export default Rich;
//TODO - 이걸 동적으로 해야하나 아님 미리 박아야하나...
// base polyfill
(function (undefined) {
    function ArrayCreate(r) {
        if (1 / r == -Infinity && (r = 0), r > Math.pow(2, 32) - 1) throw new RangeError("Invalid array length");
        var n = [];
        return n.length = r, n
    }

    function Call(t, l) {
        var n = arguments.length > 2 ? arguments[2] : [];
        if (!1 === IsCallable(t)) throw new TypeError(Object.prototype.toString.call(t) + "is not a function.");
        return t.apply(l, n)
    }

    function CreateDataProperty(e, r, t) {
        var a = {value: t, writable: !0, enumerable: !0, configurable: !0};
        try {
            return Object.defineProperty(e, r, a), !0
        } catch (n) {
            return !1
        }
    }

    function CreateDataPropertyOrThrow(t, r, o) {
        var e = CreateDataProperty(t, r, o);
        if (!e) throw new TypeError("Cannot assign value `" + Object.prototype.toString.call(o) + "` to property `" + Object.prototype.toString.call(r) + "` on object `" + Object.prototype.toString.call(t) + "`");
        return e
    }

    function CreateMethodProperty(e, r, t) {
        var a = {value: t, writable: !0, enumerable: !1, configurable: !0};
        Object.defineProperty(e, r, a)
    }

    function Get(n, t) {
        return n[t]
    }

    function HasProperty(n, r) {
        return r in n
    }

    function IsArray(r) {
        return "[object Array]" === Object.prototype.toString.call(r)
    }

    function IsCallable(n) {
        return "function" == typeof n
    }

    function RequireObjectCoercible(e) {
        if (null === e || e === undefined) throw TypeError();
        return e
    }

    function SameValueNonNumber(e, n) {
        return e === n
    }

    function ToBoolean(o) {
        return Boolean(o)
    }

    function ToInteger(n) {
        var i = Number(n);
        return isNaN(i) ? 0 : 1 / i === Infinity || 1 / i == -Infinity || i === Infinity || i === -Infinity ? i : (i < 0 ? -1 : 1) * Math.floor(Math.abs(i))
    }

    function ToLength(n) {
        var t = ToInteger(n);
        return t <= 0 ? 0 : Math.min(t, Math.pow(2, 53) - 1)
    }

    function ToObject(e) {
        if (null === e || e === undefined) throw TypeError();
        return Object(e)
    }

    function GetV(t, e) {
        return ToObject(t)[e]
    }

    function GetMethod(e, n) {
        var r = GetV(e, n);
        if (null === r || r === undefined) return undefined;
        if (!1 === IsCallable(r)) throw new TypeError("Method not callable: " + n);
        return r
    }

    function ToUint32(n) {
        var i = Number(n);
        return isNaN(i) || 1 / i === Infinity || 1 / i == -Infinity || i === Infinity || i === -Infinity ? 0 : (i < 0 ? -1 : 1) * Math.floor(Math.abs(i)) >>> 0
    }

    function Type(e) {
        switch (typeof e) {
            case"undefined":
                return "undefined";
            case"boolean":
                return "boolean";
            case"number":
                return "number";
            case"string":
                return "string";
            case"symbol":
                return "symbol";
            default:
                return null === e ? "null" : "Symbol" in this && e instanceof this.Symbol ? "symbol" : "object"
        }
    }

    function CreateIterResultObject(e, r) {
        if ("boolean" !== Type(r)) throw new Error;
        var t = {};
        return CreateDataProperty(t, "value", e), CreateDataProperty(t, "done", r), t
    }

    function EnumerableOwnProperties(e, r) {
        for (var t = Object.keys(e), n = [], s = t.length, a = 0; a < s; a++) {
            var i = t[a];
            if ("string" === Type(i)) {
                var u = Object.getOwnPropertyDescriptor(e, i);
                if (u && u.enumerable) if ("key" === r) n.push(i); else {
                    var p = Get(e, i);
                    if ("value" === r) n.push(p); else {
                        var f = [i, p];
                        n.push(f)
                    }
                }
            }
        }
        return n
    }

    function GetPrototypeFromConstructor(t, o) {
        var r = Get(t, "prototype");
        return "object" !== Type(r) && (r = o), r
    }

    function OrdinaryCreateFromConstructor(r, e) {
        var t = arguments[2] || {}, o = GetPrototypeFromConstructor(r, e), a = Object.create(o);
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && Object.defineProperty(a, n, {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: t[n]
        });
        return a
    }

    function IsConstructor(t) {
        return "object" === Type(t) && ("function" == typeof t && !!t.prototype)
    }

    function Construct(r) {
        var t = arguments.length > 2 ? arguments[2] : r, o = arguments.length > 1 ? arguments[1] : [];
        if (!IsConstructor(r)) throw new TypeError("F must be a constructor.");
        if (!IsConstructor(t)) throw new TypeError("newTarget must be a constructor.");
        if (t === r) return new (Function.prototype.bind.apply(r, [null].concat(o)));
        var n = OrdinaryCreateFromConstructor(t, Object.prototype);
        return Call(r, n, o)
    }

    function ArraySpeciesCreate(r, e) {
        if (1 / e == -Infinity && (e = 0), !1 === IsArray(r)) return ArrayCreate(e);
        var t = Get(r, "constructor");
        if ("object" === Type(t) && null === (t = "Symbol" in this && "species" in this.Symbol ? Get(t, this.Symbol.species) : undefined) && (t = undefined), t === undefined) return ArrayCreate(e);
        if (!IsConstructor(t)) throw new TypeError("C must be a constructor");
        return Construct(t, [e])
    }

    function IsRegExp(e) {
        if ("object" !== Type(e)) return !1;
        var t = "Symbol" in this && "match" in this.Symbol ? Get(e, this.Symbol.match) : undefined;
        if (t !== undefined) return ToBoolean(t);
        try {
            var n = e.lastIndex;
            return e.lastIndex = 0, RegExp.prototype.exec.call(e), !0
        } catch (r) {
        } finally {
            e.lastIndex = n
        }
        return !1
    }

    function IteratorClose(r, t) {
        if ("object" !== Type(r["[[Iterator]]"])) throw new Error(Object.prototype.toString.call(r["[[Iterator]]"]) + "is not an Object.");
        var e = r["[[Iterator]]"], o = GetMethod(e, "return");
        if (o === undefined) return t;
        try {
            var n = Call(o, e)
        } catch (c) {
            var a = c
        }
        if (t) return t;
        if (a) throw a;
        if ("object" !== Type(n)) throw new TypeError("Iterator's return method returned a non-object.");
        return t
    }

    function IteratorComplete(t) {
        if ("object" !== Type(t)) throw new Error(Object.prototype.toString.call(t) + "is not an Object.");
        return ToBoolean(Get(t, "done"))
    }

    function IteratorNext(t) {
        if (arguments.length < 2) var e = Call(t["[[NextMethod]]"], t["[[Iterator]]"]); else e = Call(t["[[NextMethod]]"], t["[[Iterator]]"], [arguments[1]]);
        if ("object" !== Type(e)) throw new TypeError("bad iterator");
        return e
    }

    function IteratorStep(t) {
        var r = IteratorNext(t);
        return !0 !== IteratorComplete(r) && r
    }

    function IteratorValue(t) {
        if ("object" !== Type(t)) throw new Error(Object.prototype.toString.call(t) + "is not an Object.");
        return Get(t, "value")
    }

    function OrdinaryToPrimitive(r, t) {
        if ("string" === t) var e = ["toString", "valueOf"]; else e = ["valueOf", "toString"];
        for (var i = 0; i < e.length; ++i) {
            var n = e[i], a = Get(r, n);
            if (IsCallable(a)) {
                var o = Call(a, r);
                if ("object" !== Type(o)) return o
            }
        }
        throw new TypeError("Cannot convert to primitive.")
    }

    function SameValue(e, a) {
        return Type(e) === Type(a) && ("number" === Type(e) ? !(!isNaN(e) || !isNaN(a)) || (0 !== e || 0 !== a || 1 / e == 1 / a) && e === a : SameValueNonNumber(e, a))
    }

    function SameValueZero(n, e) {
        return Type(n) === Type(e) && ("number" === Type(n) ? !(!isNaN(n) || !isNaN(e)) || (1 / n === Infinity && 1 / e == -Infinity || (1 / n == -Infinity && 1 / e === Infinity || n === e)) : SameValueNonNumber(n, e))
    }

    function ToPrimitive(e) {
        var t = arguments.length > 1 ? arguments[1] : undefined;
        if ("object" === Type(e)) {
            if (arguments.length < 2) var i = "default"; else t === String ? i = "string" : t === Number && (i = "number");
            var r = "function" == typeof this.Symbol && "symbol" == typeof this.Symbol.toPrimitive ? GetMethod(e, this.Symbol.toPrimitive) : undefined;
            if (r !== undefined) {
                var n = Call(r, e, [i]);
                if ("object" !== Type(n)) return n;
                throw new TypeError("Cannot convert exotic object to primitive.")
            }
            return "default" === i && (i = "number"), OrdinaryToPrimitive(e, i)
        }
        return e
    }

    function ToString(t) {
        switch (Type(t)) {
            case"symbol":
                throw new TypeError("Cannot convert a Symbol value to a string");
            case"object":
                return ToString(ToPrimitive(t, "string"));
            default:
                return String(t)
        }
    }

    function UTF16Decode(e, n) {
        return 1024 * (e - 55296) + (n - 56320) + 65536
    }

    !function (t) {
        "use strict";

        function e(t) {
            switch (typeof t) {
                case"undefined":
                    return "undefined";
                case"boolean":
                    return "boolean";
                case"number":
                    return "number";
                case"string":
                    return "string";
                default:
                    return null === t ? "null" : "object"
            }
        }

        function r(t) {
            return Object.prototype.toString.call(t).replace(/^\[object *|\]$/g, "")
        }

        function n(t) {
            return "function" == typeof t
        }

        function o(t) {
            if (null === t || t === B) throw TypeError();
            return Object(t)
        }

        function i(t) {
            return t >> 0
        }

        function f(t) {
            return t >>> 0
        }

        function u(e) {
            if (!("TYPED_ARRAY_POLYFILL_NO_ARRAY_ACCESSORS" in t)) {
                if (e.length > N) throw RangeError("Array too large for polyfill");
                var r;
                for (r = 0; r < e.length; r += 1) !function n(t) {
                    Object.defineProperty(e, t, {
                        get: function () {
                            return e._getter(t)
                        }, set: function (r) {
                            e._setter(t, r)
                        }, enumerable: !0, configurable: !1
                    })
                }(r)
            }
        }

        function a(t, e) {
            var r = 32 - e;
            return t << r >> r
        }

        function h(t, e) {
            var r = 32 - e;
            return t << r >>> r
        }

        function y(t) {
            return [255 & t]
        }

        function s(t) {
            return a(t[0], 8)
        }

        function l(t) {
            return [255 & t]
        }

        function p(t) {
            return h(t[0], 8)
        }

        function c(t) {
            return t = x(Number(t)), [t < 0 ? 0 : t > 255 ? 255 : 255 & t]
        }

        function b(t) {
            return [255 & t, t >> 8 & 255]
        }

        function g(t) {
            return a(t[1] << 8 | t[0], 16)
        }

        function E(t) {
            return [255 & t, t >> 8 & 255]
        }

        function v(t) {
            return h(t[1] << 8 | t[0], 16)
        }

        function _(t) {
            return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255]
        }

        function O(t) {
            return a(t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], 32)
        }

        function d(t) {
            return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255]
        }

        function j(t) {
            return h(t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0], 32)
        }

        function P(t, e, r) {
            function n(t) {
                var e = m(t), r = t - e;
                return r < .5 ? e : r > .5 ? e + 1 : e % 2 ? e + 1 : e
            }

            var o, i, f, u = (1 << e - 1) - 1;
            if (t !== t) i = (1 << e) - 1, f = F(2, r - 1), o = 0; else if (t === Infinity || t === -Infinity) i = (1 << e) - 1, f = 0, o = t < 0 ? 1 : 0; else if (0 === t) i = 0, f = 0, o = 1 / t == -Infinity ? 1 : 0; else if (o = t < 0, (t = M(t)) >= F(2, 1 - u)) {
                i = Y(m(I(t) / S), 1023);
                var a = t / F(2, i);
                a < 1 && (i -= 1, a *= 2), a >= 2 && (i += 1, a /= 2);
                var h = F(2, r);
                f = n(a * h) - h, i += u, f / h >= 1 && (i += 1, f = 0), i > 2 * u && (i = (1 << e) - 1, f = 0)
            } else i = 0, f = n(t / F(2, 1 - u - r));
            var y, s = [];
            for (y = r; y; y -= 1) s.push(f % 2 ? 1 : 0), f = m(f / 2);
            for (y = e; y; y -= 1) s.push(i % 2 ? 1 : 0), i = m(i / 2);
            s.push(o ? 1 : 0), s.reverse();
            for (var l = s.join(""), p = []; l.length;) p.unshift(parseInt(l.substring(0, 8), 2)), l = l.substring(8);
            return p
        }

        function T(t, e, r) {
            var n, o, i, f, u, a, h, y, s = [];
            for (n = 0; n < t.length; ++n) for (i = t[n], o = 8; o; o -= 1) s.push(i % 2 ? 1 : 0), i >>= 1;
            return s.reverse(), f = s.join(""), u = (1 << e - 1) - 1, a = parseInt(f.substring(0, 1), 2) ? -1 : 1, h = parseInt(f.substring(1, 1 + e), 2), y = parseInt(f.substring(1 + e), 2), h === (1 << e) - 1 ? 0 !== y ? NaN : a * Infinity : h > 0 ? a * F(2, h - u) * (1 + y / F(2, r)) : 0 !== y ? a * F(2, -(u - 1)) * (y / F(2, r)) : a < 0 ? -0 : 0
        }

        function w(t) {
            return T(t, 11, 52)
        }

        function A(t) {
            return P(t, 11, 52)
        }

        function L(t) {
            return T(t, 8, 23)
        }

        function R(t) {
            return P(t, 8, 23)
        }

        var B = void 0, N = 1e5, S = Math.LN2, M = Math.abs, m = Math.floor, I = Math.log, U = Math.max, Y = Math.min,
            F = Math.pow, x = Math.round;
        !function () {
            var t = Object.defineProperty, e = !function () {
                try {
                    return Object.defineProperty({}, "x", {})
                } catch (t) {
                    return !1
                }
            }();
            t && !e || (Object.defineProperty = function (e, r, n) {
                if (t) try {
                    return t(e, r, n)
                } catch (o) {
                }
                if (e !== Object(e)) throw TypeError("Object.defineProperty called on non-object");
                return Object.prototype.__defineGetter__ && "get" in n && Object.prototype.__defineGetter__.call(e, r, n.get), Object.prototype.__defineSetter__ && "set" in n && Object.prototype.__defineSetter__.call(e, r, n.set), "value" in n && (e[r] = n.value), e
            })
        }(), function () {
            function a(t) {
                if ((t = i(t)) < 0) throw RangeError("ArrayBuffer size is not a small enough positive integer.");
                Object.defineProperty(this, "byteLength", {value: t}), Object.defineProperty(this, "_bytes", {value: Array(t)});
                for (var e = 0; e < t; e += 1) this._bytes[e] = 0
            }

            function h() {
                if (!arguments.length || "object" != typeof arguments[0]) return function (t) {
                    if ((t = i(t)) < 0) throw RangeError("length is not a small enough positive integer.");
                    Object.defineProperty(this, "length", {value: t}), Object.defineProperty(this, "byteLength", {value: t * this.BYTES_PER_ELEMENT}), Object.defineProperty(this, "buffer", {value: new a(this.byteLength)}), Object.defineProperty(this, "byteOffset", {value: 0})
                }.apply(this, arguments);
                if (arguments.length >= 1 && "object" === e(arguments[0]) && arguments[0] instanceof h) return function (t) {
                    if (this.constructor !== t.constructor) throw TypeError();
                    var e = t.length * this.BYTES_PER_ELEMENT;
                    Object.defineProperty(this, "buffer", {value: new a(e)}), Object.defineProperty(this, "byteLength", {value: e}), Object.defineProperty(this, "byteOffset", {value: 0}), Object.defineProperty(this, "length", {value: t.length});
                    for (var r = 0; r < this.length; r += 1) this._setter(r, t._getter(r))
                }.apply(this, arguments);
                if (arguments.length >= 1 && "object" === e(arguments[0]) && !(arguments[0] instanceof h) && !(arguments[0] instanceof a || "ArrayBuffer" === r(arguments[0]))) return function (t) {
                    var e = t.length * this.BYTES_PER_ELEMENT;
                    Object.defineProperty(this, "buffer", {value: new a(e)}), Object.defineProperty(this, "byteLength", {value: e}), Object.defineProperty(this, "byteOffset", {value: 0}), Object.defineProperty(this, "length", {value: t.length});
                    for (var r = 0; r < this.length; r += 1) {
                        var n = t[r];
                        this._setter(r, Number(n))
                    }
                }.apply(this, arguments);
                if (arguments.length >= 1 && "object" === e(arguments[0]) && (arguments[0] instanceof a || "ArrayBuffer" === r(arguments[0]))) return function (t, e, r) {
                    if ((e = f(e)) > t.byteLength) throw RangeError("byteOffset out of range");
                    if (e % this.BYTES_PER_ELEMENT) throw RangeError("buffer length minus the byteOffset is not a multiple of the element size.");
                    if (r === B) {
                        var n = t.byteLength - e;
                        if (n % this.BYTES_PER_ELEMENT) throw RangeError("length of buffer minus byteOffset not a multiple of the element size");
                        r = n / this.BYTES_PER_ELEMENT
                    } else r = f(r), n = r * this.BYTES_PER_ELEMENT;
                    if (e + n > t.byteLength) throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
                    Object.defineProperty(this, "buffer", {value: t}), Object.defineProperty(this, "byteLength", {value: n}), Object.defineProperty(this, "byteOffset", {value: e}), Object.defineProperty(this, "length", {value: r})
                }.apply(this, arguments);
                throw TypeError()
            }

            function P(t, e, r) {
                var n = function () {
                    Object.defineProperty(this, "constructor", {value: n}), h.apply(this, arguments), u(this)
                };
                "__proto__" in n ? n.__proto__ = h : (n.from = h.from, n.of = h.of), n.BYTES_PER_ELEMENT = t;
                var o = function () {
                };
                return o.prototype = T, n.prototype = new o, Object.defineProperty(n.prototype, "BYTES_PER_ELEMENT", {value: t}), Object.defineProperty(n.prototype, "_pack", {value: e}), Object.defineProperty(n.prototype, "_unpack", {value: r}), n
            }

            t.ArrayBuffer = t.ArrayBuffer || a, Object.defineProperty(h, "from", {
                value: function (t) {
                    return new this(t)
                }
            }), Object.defineProperty(h, "of", {
                value: function () {
                    return new this(arguments)
                }
            });
            var T = {};
            h.prototype = T, Object.defineProperty(h.prototype, "_getter", {
                value: function (t) {
                    if (arguments.length < 1) throw SyntaxError("Not enough arguments");
                    if ((t = f(t)) >= this.length) return B;
                    var e, r, n = [];
                    for (e = 0, r = this.byteOffset + t * this.BYTES_PER_ELEMENT; e < this.BYTES_PER_ELEMENT; e += 1, r += 1) n.push(this.buffer._bytes[r]);
                    return this._unpack(n)
                }
            }), Object.defineProperty(h.prototype, "get", {value: h.prototype._getter}), Object.defineProperty(h.prototype, "_setter", {
                value: function (t, e) {
                    if (arguments.length < 2) throw SyntaxError("Not enough arguments");
                    if (!((t = f(t)) >= this.length)) {
                        var r, n, o = this._pack(e);
                        for (r = 0, n = this.byteOffset + t * this.BYTES_PER_ELEMENT; r < this.BYTES_PER_ELEMENT; r += 1, n += 1) this.buffer._bytes[n] = o[r]
                    }
                }
            }), Object.defineProperty(h.prototype, "constructor", {value: h}), Object.defineProperty(h.prototype, "copyWithin", {
                value: function (t, e) {
                    var r = arguments[2], n = o(this), u = n.length, a = f(u);
                    a = U(a, 0);
                    var h, y = i(t);
                    h = y < 0 ? U(a + y, 0) : Y(y, a);
                    var s, l = i(e);
                    s = l < 0 ? U(a + l, 0) : Y(l, a);
                    var p;
                    p = r === B ? a : i(r);
                    var c;
                    c = p < 0 ? U(a + p, 0) : Y(p, a);
                    var b, g = Y(c - s, a - h);
                    for (s < h && h < s + g ? (b = -1, s = s + g - 1, h = h + g - 1) : b = 1; g > 0;) n._setter(h, n._getter(s)), s += b, h += b, g -= 1;
                    return n
                }
            }), Object.defineProperty(h.prototype, "every", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    for (var o = arguments[1], i = 0; i < r; i++) if (!t.call(o, e._getter(i), i, e)) return !1;
                    return !0
                }
            }), Object.defineProperty(h.prototype, "fill", {
                value: function (t) {
                    var e = arguments[1], r = arguments[2], n = o(this), u = n.length, a = f(u);
                    a = U(a, 0);
                    var h, y = i(e);
                    h = y < 0 ? U(a + y, 0) : Y(y, a);
                    var s;
                    s = r === B ? a : i(r);
                    var l;
                    for (l = s < 0 ? U(a + s, 0) : Y(s, a); h < l;) n._setter(h, t), h += 1;
                    return n
                }
            }), Object.defineProperty(h.prototype, "filter", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    for (var o = [], i = arguments[1], u = 0; u < r; u++) {
                        var a = e._getter(u);
                        t.call(i, a, u, e) && o.push(a)
                    }
                    return new this.constructor(o)
                }
            }), Object.defineProperty(h.prototype, "find", {
                value: function (t) {
                    var e = o(this), r = e.length, i = f(r);
                    if (!n(t)) throw TypeError();
                    for (var u = arguments.length > 1 ? arguments[1] : B, a = 0; a < i;) {
                        var h = e._getter(a), y = t.call(u, h, a, e);
                        if (Boolean(y)) return h;
                        ++a
                    }
                    return B
                }
            }), Object.defineProperty(h.prototype, "findIndex", {
                value: function (t) {
                    var e = o(this), r = e.length, i = f(r);
                    if (!n(t)) throw TypeError();
                    for (var u = arguments.length > 1 ? arguments[1] : B, a = 0; a < i;) {
                        var h = e._getter(a), y = t.call(u, h, a, e);
                        if (Boolean(y)) return a;
                        ++a
                    }
                    return -1
                }
            }), Object.defineProperty(h.prototype, "forEach", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    for (var o = arguments[1], i = 0; i < r; i++) t.call(o, e._getter(i), i, e)
                }
            }), Object.defineProperty(h.prototype, "indexOf", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (0 === r) return -1;
                    var n = 0;
                    if (arguments.length > 0 && (n = Number(arguments[1]), n !== n ? n = 0 : 0 !== n && n !== 1 / 0 && n !== -1 / 0 && (n = (n > 0 || -1) * m(M(n)))), n >= r) return -1;
                    for (var o = n >= 0 ? n : U(r - M(n), 0); o < r; o++) if (e._getter(o) === t) return o;
                    return -1
                }
            }), Object.defineProperty(h.prototype, "join", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    for (var e = Object(this), r = f(e.length), n = Array(r), o = 0; o < r; ++o) n[o] = e._getter(o);
                    return n.join(t === B ? "," : t)
                }
            }), Object.defineProperty(h.prototype, "lastIndexOf", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (0 === r) return -1;
                    var n = r;
                    arguments.length > 1 && (n = Number(arguments[1]), n !== n ? n = 0 : 0 !== n && n !== 1 / 0 && n !== -1 / 0 && (n = (n > 0 || -1) * m(M(n))));
                    for (var o = n >= 0 ? Y(n, r - 1) : r - M(n); o >= 0; o--) if (e._getter(o) === t) return o;
                    return -1
                }
            }), Object.defineProperty(h.prototype, "map", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    var o = [];
                    o.length = r;
                    for (var i = arguments[1], u = 0; u < r; u++) o[u] = t.call(i, e._getter(u), u, e);
                    return new this.constructor(o)
                }
            }), Object.defineProperty(h.prototype, "reduce", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    if (0 === r && 1 === arguments.length) throw TypeError();
                    var o, i = 0;
                    for (o = arguments.length >= 2 ? arguments[1] : e._getter(i++); i < r;) o = t.call(B, o, e._getter(i), i, e), i++;
                    return o
                }
            }), Object.defineProperty(h.prototype, "reduceRight", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    if (0 === r && 1 === arguments.length) throw TypeError();
                    var o, i = r - 1;
                    for (o = arguments.length >= 2 ? arguments[1] : e._getter(i--); i >= 0;) o = t.call(B, o, e._getter(i), i, e), i--;
                    return o
                }
            }), Object.defineProperty(h.prototype, "reverse", {
                value: function () {
                    if (this === B || null === this) throw TypeError();
                    for (var t = Object(this), e = f(t.length), r = m(e / 2), n = 0, o = e - 1; n < r; ++n, --o) {
                        var i = t._getter(n);
                        t._setter(n, t._getter(o)), t._setter(o, i)
                    }
                    return t
                }
            }), Object.defineProperty(h.prototype, "set", {
                value: function (t, e) {
                    if (arguments.length < 1) throw SyntaxError("Not enough arguments");
                    var r, n, o, i, u, a, h, y, s, l;
                    if ("object" == typeof arguments[0] && arguments[0].constructor === this.constructor) {
                        if (r = arguments[0], (o = f(arguments[1])) + r.length > this.length) throw RangeError("Offset plus length of array is out of range");
                        if (y = this.byteOffset + o * this.BYTES_PER_ELEMENT, s = r.length * this.BYTES_PER_ELEMENT, r.buffer === this.buffer) {
                            for (l = [], u = 0, a = r.byteOffset; u < s; u += 1, a += 1) l[u] = r.buffer._bytes[a];
                            for (u = 0, h = y; u < s; u += 1, h += 1) this.buffer._bytes[h] = l[u]
                        } else for (u = 0, a = r.byteOffset, h = y; u < s; u += 1, a += 1, h += 1) this.buffer._bytes[h] = r.buffer._bytes[a]
                    } else {
                        if ("object" != typeof arguments[0] || "undefined" == typeof arguments[0].length) throw TypeError("Unexpected argument type(s)");
                        if (n = arguments[0], i = f(n.length), (o = f(arguments[1])) + i > this.length) throw RangeError("Offset plus length of array is out of range");
                        for (u = 0; u < i; u += 1) a = n[u], this._setter(o + u, Number(a))
                    }
                }
            }), Object.defineProperty(h.prototype, "slice", {
                value: function (t, e) {
                    for (var r = o(this), n = r.length, u = f(n), a = i(t), h = a < 0 ? U(u + a, 0) : Y(a, u), y = e === B ? u : i(e), s = y < 0 ? U(u + y, 0) : Y(y, u), l = s - h, p = r.constructor, c = new p(l), b = 0; h < s;) {
                        var g = r._getter(h);
                        c._setter(b, g), ++h, ++b
                    }
                    return c
                }
            }), Object.defineProperty(h.prototype, "some", {
                value: function (t) {
                    if (this === B || null === this) throw TypeError();
                    var e = Object(this), r = f(e.length);
                    if (!n(t)) throw TypeError();
                    for (var o = arguments[1], i = 0; i < r; i++) if (t.call(o, e._getter(i), i, e)) return !0;
                    return !1
                }
            }), Object.defineProperty(h.prototype, "sort", {
                value: function (t) {
                    function e(e, r) {
                        return e !== e && r !== r ? 0 : e !== e ? 1 : r !== r ? -1 : t !== B ? t(e, r) : e < r ? -1 : e > r ? 1 : 0
                    }

                    if (this === B || null === this) throw TypeError();
                    for (var r = Object(this), n = f(r.length), o = Array(n), i = 0; i < n; ++i) o[i] = r._getter(i);
                    for (o.sort(e), i = 0; i < n; ++i) r._setter(i, o[i]);
                    return r
                }
            }), Object.defineProperty(h.prototype, "subarray", {
                value: function (t, e) {
                    function r(t, e, r) {
                        return t < e ? e : t > r ? r : t
                    }

                    t = i(t), e = i(e), arguments.length < 1 && (t = 0), arguments.length < 2 && (e = this.length), t < 0 && (t = this.length + t), e < 0 && (e = this.length + e), t = r(t, 0, this.length), e = r(e, 0, this.length);
                    var n = e - t;
                    return n < 0 && (n = 0), new this.constructor(this.buffer, this.byteOffset + t * this.BYTES_PER_ELEMENT, n)
                }
            });
            var N = P(1, y, s), S = P(1, l, p), I = P(1, c, p), F = P(2, b, g), x = P(2, E, v), k = P(4, _, O),
                C = P(4, d, j), z = P(4, R, L), D = P(8, A, w);
            t.Int8Array = t.Int8Array || N, t.Uint8Array = t.Uint8Array || S, t.Uint8ClampedArray = t.Uint8ClampedArray || I, t.Int16Array = t.Int16Array || F, t.Uint16Array = t.Uint16Array || x, t.Int32Array = t.Int32Array || k, t.Uint32Array = t.Uint32Array || C, t.Float32Array = t.Float32Array || z, t.Float64Array = t.Float64Array || D
        }(), function () {
            function e(t, e) {
                return n(t.get) ? t.get(e) : t[e]
            }

            function o(t, e, n) {
                if (!(t instanceof ArrayBuffer || "ArrayBuffer" === r(t))) throw TypeError();
                if ((e = f(e)) > t.byteLength) throw RangeError("byteOffset out of range");
                if (n = n === B ? t.byteLength - e : f(n), e + n > t.byteLength) throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
                Object.defineProperty(this, "buffer", {value: t}), Object.defineProperty(this, "byteLength", {value: n}), Object.defineProperty(this, "byteOffset", {value: e})
            }

            function i(t) {
                return function r(n, o) {
                    if ((n = f(n)) + t.BYTES_PER_ELEMENT > this.byteLength) throw RangeError("Array index out of range");
                    n += this.byteOffset;
                    for (var i = new Uint8Array(this.buffer, n, t.BYTES_PER_ELEMENT), u = [], h = 0; h < t.BYTES_PER_ELEMENT; h += 1) u.push(e(i, h));
                    return Boolean(o) === Boolean(a) && u.reverse(), e(new t(new Uint8Array(u).buffer), 0)
                }
            }

            function u(t) {
                return function r(n, o, i) {
                    if ((n = f(n)) + t.BYTES_PER_ELEMENT > this.byteLength) throw RangeError("Array index out of range");
                    var u, h, y = new t([o]), s = new Uint8Array(y.buffer), l = [];
                    for (u = 0; u < t.BYTES_PER_ELEMENT; u += 1) l.push(e(s, u));
                    Boolean(i) === Boolean(a) && l.reverse(), h = new Uint8Array(this.buffer, n, t.BYTES_PER_ELEMENT), h.set(l)
                }
            }

            var a = function () {
                var t = new Uint16Array([4660]);
                return 18 === e(new Uint8Array(t.buffer), 0)
            }();
            Object.defineProperty(o.prototype, "getUint8", {value: i(Uint8Array)}), Object.defineProperty(o.prototype, "getInt8", {value: i(Int8Array)}), Object.defineProperty(o.prototype, "getUint16", {value: i(Uint16Array)}), Object.defineProperty(o.prototype, "getInt16", {value: i(Int16Array)}), Object.defineProperty(o.prototype, "getUint32", {value: i(Uint32Array)}), Object.defineProperty(o.prototype, "getInt32", {value: i(Int32Array)}), Object.defineProperty(o.prototype, "getFloat32", {value: i(Float32Array)}), Object.defineProperty(o.prototype, "getFloat64", {value: i(Float64Array)}), Object.defineProperty(o.prototype, "setUint8", {value: u(Uint8Array)}), Object.defineProperty(o.prototype, "setInt8", {value: u(Int8Array)}), Object.defineProperty(o.prototype, "setUint16", {value: u(Uint16Array)}), Object.defineProperty(o.prototype, "setInt16", {value: u(Int16Array)}), Object.defineProperty(o.prototype, "setUint32", {value: u(Uint32Array)}), Object.defineProperty(o.prototype, "setInt32", {value: u(Int32Array)}), Object.defineProperty(o.prototype, "setFloat32", {value: u(Float32Array)}), Object.defineProperty(o.prototype, "setFloat64", {value: u(Float64Array)}), t.DataView = t.DataView || o
        }()
    }(self);
    CreateMethodProperty(Array, "of", function r() {
        var r = arguments.length, t = arguments, e = this;
        if (IsConstructor(e)) var a = Construct(e, [r]); else var a = ArrayCreate(r);
        for (var o = 0; o < r;) {
            var n = t[o], v = ToString(o);
            CreateDataPropertyOrThrow(a, v, n);
            var o = o + 1
        }
        return a.length = r, a
    });
    CreateMethodProperty(Array.prototype, "copyWithin", function t(r, e) {
        "use strict";
        var a = arguments[2];
        if (null === this || this === undefined) throw new TypeError("Cannot call method on " + this);
        var n = Object(this), i = ToInteger(n.length);
        i <= 0 && (i = 0), i = i === Infinity ? Math.pow(2, 53) - 1 : Math.min(i, Math.pow(2, 53) - 1), i = Math.max(i, 0);
        var h, o = ToInteger(r);
        h = o < 0 ? Math.max(i + o, 0) : Math.min(o, i);
        var M, m = ToInteger(e);
        M = m < 0 ? Math.max(i + m, 0) : Math.min(m, i);
        var v;
        v = a === undefined ? i : ToInteger(a);
        var p;
        p = v < 0 ? Math.max(i + v, 0) : Math.min(v, i);
        var s, d = Math.min(p - M, i - h);
        for (M < h && h < M + d ? (s = -1, M = M + d - 1, h = h + d - 1) : s = 1; d > 0;) {
            var f = String(M), g = String(h);
            if (HasProperty(n, f)) {
                var l = n[f];
                n[g] = l
            } else delete n[g];
            M += s, h += s, d -= 1
        }
        return n
    });
    CreateMethodProperty(Array.prototype, "fill", function t(e) {
        for (var r = arguments[1], n = arguments[2], o = ToObject(this), a = ToLength(Get(o, "length")), h = ToInteger(r), i = h < 0 ? Math.max(a + h, 0) : Math.min(h, a), g = n === undefined ? a : ToInteger(n), M = g < 0 ? Math.max(a + g, 0) : Math.min(g, a); i < M;) {
            o[ToString(i)] = e, i += 1
        }
        return o
    });
    CreateMethodProperty(Array.prototype, "find", function e(r) {
        var t = ToObject(this), n = ToLength(Get(t, "length"));
        if (!1 === IsCallable(r)) throw new TypeError(r + " is not a function");
        for (var o = arguments.length > 1 ? arguments[1] : undefined, a = 0; a < n;) {
            var i = ToString(a), f = Get(t, i);
            if (ToBoolean(Call(r, o, [f, a, t]))) return f;
            var a = a + 1
        }
        return undefined
    });
    CreateMethodProperty(Array.prototype, "findIndex", function e(r) {
        var t = ToObject(this), n = ToLength(Get(t, "length"));
        if (!1 === IsCallable(r)) throw new TypeError(r + " is not a function");
        for (var o = arguments.length > 1 ? arguments[1] : undefined, a = 0; a < n;) {
            var i = ToString(a), l = Get(t, i);
            if (ToBoolean(Call(r, o, [l, a, t]))) return a;
            a += 1
        }
        return -1
    });
    CreateMethodProperty(Array.prototype, "includes", function e(r) {
        "use strict";
        var t = ToObject(this), o = ToLength(Get(t, "length"));
        if (0 === o) return !1;
        var n = ToInteger(arguments[1]);
        if (n >= 0) var a = n; else (a = o + n) < 0 && (a = 0);
        for (; a < o;) {
            var i = Get(t, ToString(a));
            if (SameValueZero(r, i)) return !0;
            a += 1
        }
        return !1
    });
    !function () {
        var n = /^\s*function\s+([^\(\s]*)\s*/, t = Function, e = t.prototype, r = e.constructor, o = function (o) {
            var c, u;
            return o === t || o === r ? u = "Function" : o !== e && (c = ("" + o).match(n), u = c && c[1]), u || ""
        };
        Object.defineProperty(e, "name", {
            get: function c() {
                var n = this, t = o(n);
                return n !== e && Object.defineProperty(n, "name", {value: t, configurable: !0}), t
            }, configurable: !0
        })
    }();
    CreateMethodProperty(Math, "acosh", function t(a) {
        return isNaN(a) ? NaN : a < 1 ? NaN : 1 === a ? 0 : a === Infinity ? Infinity : Math.log(a + Math.sqrt(a * a - 1))
    });
    CreateMethodProperty(Math, "asinh", function n(i) {
        return isNaN(i) ? NaN : 0 === i && 1 / i === Infinity ? 0 : 0 === i && 1 / i == -Infinity ? -0 : i === Infinity ? Infinity : i === -Infinity ? -Infinity : Math.log(i + Math.sqrt(i * i + 1))
    });
    CreateMethodProperty(Math, "atanh", function n(t) {
        return isNaN(t) ? NaN : t < -1 ? NaN : t > 1 ? NaN : -1 === t ? -Infinity : 1 === t ? Infinity : 0 === t && 1 / t === Infinity ? 0 : 0 === t && 1 / t == -Infinity ? -0 : Math.log((1 + t) / (1 - t)) / 2
    });
    CreateMethodProperty(Math, "cbrt", function n(t) {
        if (isNaN(t)) return NaN;
        if (0 === t && 1 / t === Infinity) return 0;
        if (0 === t && 1 / t == -Infinity) return -0;
        if (t === Infinity) return Infinity;
        if (t === -Infinity) return -Infinity;
        var i = Math.pow(Math.abs(t), 1 / 3);
        return t < 0 ? -i : i
    });
    CreateMethodProperty(Math, "clz32", function t(r) {
        var e = ToUint32(r);
        return e ? 32 - e.toString(2).length : 32
    });
    CreateMethodProperty(Math, "cosh", function n(t) {
        if (isNaN(t)) return NaN;
        if (0 === t && 1 / t === Infinity) return 1;
        if (0 === t && 1 / t == -Infinity) return 1;
        if (t === Infinity) return Infinity;
        if (t === -Infinity) return Infinity;
        if ((t = Math.abs(t)) > 709) {
            var i = Math.exp(.5 * t);
            return i / 2 * i
        }
        var i = Math.exp(t);
        return (i + 1 / i) / 2
    });
    CreateMethodProperty(Math, "expm1", function n(i) {
        return isNaN(i) ? NaN : 0 === i && 1 / i === Infinity ? 0 : 0 === i && 1 / i == -Infinity ? -0 : i === Infinity ? Infinity : i === -Infinity ? -1 : i > -1e-6 && i < 1e-6 ? i + i * i / 2 : Math.exp(i) - 1
    });
    CreateMethodProperty(Math, "fround", function (n) {
        return isNaN(n) ? NaN : 1 / n == +Infinity || 1 / n == -Infinity || n === +Infinity || n === -Infinity ? n : new Float32Array([n])[0]
    });
    CreateMethodProperty(Math, "hypot", function t(n, r) {
        if (0 === arguments.length) return 0;
        for (var i = 0, e = 0, a = 0; a < arguments.length; ++a) {
            if (arguments[a] === Infinity) return Infinity;
            if (arguments[a] === -Infinity) return Infinity;
            var f = Math.abs(Number(arguments[a]));
            f > e && (i *= Math.pow(e / f, 2), e = f), 0 === f && 0 === e || (i += Math.pow(f / e, 2))
        }
        return e * Math.sqrt(i)
    });
    CreateMethodProperty(Math, "imul", function t(r, e) {
        var n = ToUint32(r), o = ToUint32(e), i = n >>> 16 & 65535, a = 65535 & n, u = o >>> 16 & 65535, h = 65535 & o;
        return a * h + (i * h + a * u << 16 >>> 0) | 0
    });
    CreateMethodProperty(Math, "log10", function t(e) {
        return Math.log(e) / Math.LN10
    });
    CreateMethodProperty(Math, "log1p", function r(t) {
        if (-1 < (t = Number(t)) && t < 1) {
            for (var o = t, e = 2; e <= 300; e++) o += Math.pow(-1, e - 1) * Math.pow(t, e) / e;
            return o
        }
        return Math.log(1 + t)
    });
    CreateMethodProperty(Math, "log2", function t(e) {
        return Math.log(e) / Math.LN2
    });
    CreateMethodProperty(Math, "sign", function i(n) {
        var n = Number(n);
        return isNaN(n) ? NaN : 1 / n == -Infinity ? -0 : 1 / n === Infinity ? 0 : n < 0 ? -1 : n > 0 ? 1 : void 0
    });
    CreateMethodProperty(Math, "sinh", function r(t) {
        var a = t < 0 ? -1 : 1, e = Math.abs(t);
        if (e < 22) {
            if (e < Math.pow(2, -28)) return t;
            var h = Math.exp(e) - 1;
            return e < 1 ? a * (2 * h - h * h / (h + 1)) / 2 : a * (h + h / (h + 1)) / 2
        }
        if (e < 709.7822265625) return a * Math.exp(e) / 2;
        var n = Math.exp(.5 * e), h = a * n / 2;
        return h * n
    });
    CreateMethodProperty(Math, "tanh", function t(n) {
        var e;
        return n === Infinity ? 1 : n === -Infinity ? -1 : ((e = Math.exp(2 * n)) - 1) / (e + 1)
    });
    CreateMethodProperty(Math, "trunc", function t(r) {
        return r < 0 ? Math.ceil(r) : Math.floor(r)
    });
    Object.defineProperty(Number, "EPSILON", {enumerable: !1, configurable: !1, writable: !1, value: Math.pow(2, -52)});
    !function () {
        var e = this;
        CreateMethodProperty(Number, "isFinite", function i(t) {
            return "number" === Type(t) && e.isFinite(t)
        })
    }();
    CreateMethodProperty(Number, "isInteger", function e(n) {
        return "number" === Type(n) && (!isNaN(n) && n !== Infinity && n !== -Infinity && ToInteger(n) === n)
    });
    !function () {
        var e = this;
        CreateMethodProperty(Number, "isNaN", function r(t) {
            return "number" === Type(t) && !!e.isNaN(t)
        })
    }();
    CreateMethodProperty(Number, "isSafeInteger", function e(r) {
        if ("number" !== Type(r)) return !1;
        if (isNaN(r) || r === Infinity || r === -Infinity) return !1;
        var t = ToInteger(r);
        return t === r && Math.abs(t) <= Math.pow(2, 53) - 1
    });
    Object.defineProperty(Number, "MAX_SAFE_INTEGER", {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: Math.pow(2, 53) - 1
    });
    Object.defineProperty(Number, "MIN_SAFE_INTEGER", {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: -(Math.pow(2, 53) - 1)
    });
    CreateMethodProperty(Number, "parseFloat", parseFloat);
    CreateMethodProperty(Number, "parseInt", parseInt);
    CreateMethodProperty(Object, "assign", function e(r, t) {
        var n = ToObject(r);
        if (1 === arguments.length) return n;
        var a, o, c, l, p = Array.prototype.slice.call(arguments, 1);
        for (a = 0; a < p.length; a++) {
            var b = p[a];
            for (b === undefined || null === b ? c = [] : (l = ToObject(b), c = Object.keys(l)), o = 0; o < c.length; o++) {
                var i, u = c[o];
                try {
                    var y = Object.getOwnPropertyDescriptor(l, u);
                    i = y !== undefined && !0 === y.enumerable
                } catch (O) {
                    i = Object.prototype.propertyIsEnumerable.call(l, u)
                }
                if (i) {
                    var f = Get(l, u);
                    n[u] = f
                }
            }
        }
        return n
    });
    !function () {
        var e = {}.toString, t = "".split;
        CreateMethodProperty(Object, "entries", function r(n) {
            var c = ToObject(n), c = "[object String]" == e.call(n) ? t.call(n, "") : Object(n);
            return EnumerableOwnProperties(c, "key+value")
        })
    }();
    CreateMethodProperty(Object, "is", function e(t, r) {
        return SameValue(t, r)
    });
    !function () {
        if (!Object.setPrototypeOf) {
            var t, e, o = Object.getOwnPropertyNames, r = Object.getOwnPropertyDescriptor, n = Object.create,
                c = Object.defineProperty, _ = Object.getPrototypeOf, f = Object.prototype, p = function (t, e) {
                    return o(e).forEach(function (o) {
                        c(t, o, r(e, o))
                    }), t
                }, O = function i(t, e) {
                    return p(n(e), t)
                };
            try {
                t = r(f, "__proto__").set, t.call({}, null), e = function a(e, o) {
                    return t.call(e, o), e
                }
            } catch (u) {
                t = {__proto__: null}, t instanceof Object ? e = O : (t.__proto__ = f, e = t instanceof Object ? function o(t, e) {
                    return t.__proto__ = e, t
                } : function r(t, e) {
                    return _(t) ? (t.__proto__ = e, t) : O(t, e)
                })
            }
            CreateMethodProperty(Object, "setPrototypeOf", e)
        }
    }();
    !function () {
        var t = {}.toString, e = "".split;
        CreateMethodProperty(Object, "values", function r(n) {
            var c = "[object String]" == t.call(n) ? e.call(n, "") : ToObject(n);
            return Object.keys(c).map(function (t) {
                return c[t]
            })
        })
    }();
    !function (n) {
        function t(r) {
            if (e[r]) return e[r].exports;
            var o = e[r] = {i: r, l: !1, exports: {}};
            return n[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
        }

        var e = {};
        t.m = n, t.c = e, t.i = function (n) {
            return n
        }, t.d = function (n, e, r) {
            t.o(n, e) || Object.defineProperty(n, e, {configurable: !1, enumerable: !0, get: r})
        }, t.n = function (n) {
            var e = n && n.__esModule ? function () {
                return n["default"]
            } : function () {
                return n
            };
            return t.d(e, "a", e), e
        }, t.o = function (n, t) {
            return Object.prototype.hasOwnProperty.call(n, t)
        }, t.p = "", t(t.s = 100)
    }({
        100: function (n, t, e) {
            (function (n) {
                var t = e(5);
                try {
                    n.Promise = t, window.Promise = t
                } catch (r) {
                }
            }).call(t, e(2))
        }, 2: function (n, t) {
            var e;
            e = function () {
                return this
            }();
            try {
                e = e || Function("return this")() || (0, eval)("this")
            } catch (r) {
                "object" == typeof window && (e = window)
            }
            n.exports = e
        }, 5: function (n, t, e) {
            (function (t) {
                !function () {
                    "use strict";

                    function e() {
                        return rn[q][B] || D
                    }

                    function r(n) {
                        return n && "object" == typeof n
                    }

                    function o(n) {
                        return "function" == typeof n
                    }

                    function i(n, t) {
                        return n instanceof t
                    }

                    function u(n) {
                        return i(n, M)
                    }

                    function c(n, t, e) {
                        if (!t(n)) throw h(e)
                    }

                    function f() {
                        try {
                            return R.apply(S, arguments)
                        } catch (n) {
                            return nn.e = n, nn
                        }
                    }

                    function s(n, t) {
                        return R = n, S = t, f
                    }

                    function a(n, t) {
                        function e() {
                            for (var e = 0; e < o;) t(r[e], r[e + 1]), r[e++] = P, r[e++] = P;
                            o = 0, r.length > n && (r.length = n)
                        }

                        var r = A(n), o = 0;
                        return function (n, t) {
                            r[o++] = n, r[o++] = t, 2 === o && rn.nextTick(e)
                        }
                    }

                    function l(n, t) {
                        var e, r, u, c, f = 0;
                        if (!n) throw h(Q);
                        var a = n[rn[q][z]];
                        if (o(a)) r = a.call(n); else {
                            if (!o(n.next)) {
                                if (i(n, A)) {
                                    for (e = n.length; f < e;) t(n[f], f++);
                                    return f
                                }
                                throw h(Q)
                            }
                            r = n
                        }
                        for (; !(u = r.next()).done;) if ((c = s(t)(u.value, f++)) === nn) throw o(r[G]) && r[G](), c.e;
                        return f
                    }

                    function h(n) {
                        return new TypeError(n)
                    }

                    function v(n) {
                        return (n ? "" : V) + (new M).stack
                    }

                    function _(n, t) {
                        var e = "on" + n.toLowerCase(), r = O[e];
                        H && H.listeners(n).length ? n === Z ? H.emit(n, t._v, t) : H.emit(n, t) : r ? r({
                            reason: t._v,
                            promise: t
                        }) : rn[n](t._v, t)
                    }

                    function p(n) {
                        return n && n._s
                    }

                    function d(n) {
                        if (p(n)) return new n(tn);
                        var t, e, r;
                        return t = new n(function (n, o) {
                            if (t) throw h();
                            e = n, r = o
                        }), c(e, o), c(r, o), t
                    }

                    function w(n, t) {
                        var e = !1;
                        return function (r) {
                            e || (e = !0, L && (n[N] = v(!0)), t === Y ? k(n, r) : x(n, t, r))
                        }
                    }

                    function y(n, t, e, r) {
                        return o(e) && (t._onFulfilled = e), o(r) && (n[J] && _(X, n), t._onRejected = r), L && (t._p = n), n[n._c++] = t, n._s !== $ && on(n, t), t
                    }

                    function m(n) {
                        if (n._umark) return !0;
                        n._umark = !0;
                        for (var t, e = 0, r = n._c; e < r;) if (t = n[e++], t._onRejected || m(t)) return !0
                    }

                    function j(n, t) {
                        function e(n) {
                            return r.push(n.replace(/^\s+|\s+$/g, ""))
                        }

                        var r = [];
                        return L && (t[N] && e(t[N]), function o(n) {
                            n && K in n && (o(n._next), e(n[K] + ""), o(n._p))
                        }(t)), (n && n.stack ? n.stack : n) + ("\n" + r.join("\n")).replace(en, "")
                    }

                    function g(n, t) {
                        return n(t)
                    }

                    function x(n, t, e) {
                        var r = 0, o = n._c;
                        if (n._s === $) for (n._s = t, n._v = e, t === U && (L && u(e) && (e.longStack = j(e, n)), un(n)); r < o;) on(n, n[r++]);
                        return n
                    }

                    function k(n, t) {
                        if (t === n && t) return x(n, U, h(W)), n;
                        if (t !== C && (o(t) || r(t))) {
                            var e = s(b)(t);
                            if (e === nn) return x(n, U, e.e), n;
                            o(e) ? (L && p(t) && (n._next = t), p(t) ? T(n, t, e) : rn.nextTick(function () {
                                T(n, t, e)
                            })) : x(n, Y, t)
                        } else x(n, Y, t);
                        return n
                    }

                    function b(n) {
                        return n.then
                    }

                    function T(n, t, e) {
                        var r = s(e, t)(function (e) {
                            t && (t = C, k(n, e))
                        }, function (e) {
                            t && (t = C, x(n, U, e))
                        });
                        r === nn && t && (x(n, U, r.e), t = C)
                    }

                    var P, R, S, C = null, F = "object" == typeof self, O = F ? self : t, E = O.Promise, H = O.process,
                        I = O.console, L = !1, A = Array, M = Error, U = 1, Y = 2, $ = 3, q = "Symbol", z = "iterator",
                        B = "species", D = q + "(" + B + ")", G = "return", J = "_uh", K = "_pt", N = "_st",
                        Q = "Invalid argument", V = "\nFrom previous ", W = "Chaining cycle detected for promise",
                        X = "rejectionHandled", Z = "unhandledRejection", nn = {e: C}, tn = function () {
                        }, en = /^.+\/node_modules\/yaku\/.+\n?/gm, rn = function (n) {
                            var t, e = this;
                            if (!r(e) || e._s !== P) throw h("Invalid this");
                            if (e._s = $, L && (e[K] = v()), n !== tn) {
                                if (!o(n)) throw h(Q);
                                (t = s(n)(w(e, Y), w(e, U))) === nn && x(e, U, t.e)
                            }
                        };
                    rn["default"] = rn, function (n, t) {
                        for (var e in t) n[e] = t[e]
                    }(rn.prototype, {
                        then: function (n, t) {
                            if (this._s === undefined) throw h();
                            return y(this, d(rn.speciesConstructor(this, rn)), n, t)
                        }, "catch": function (n) {
                            return this.then(P, n)
                        }, "finally": function (n) {
                            return this.then(function (t) {
                                return rn.resolve(n()).then(function () {
                                    return t
                                })
                            }, function (t) {
                                return rn.resolve(n()).then(function () {
                                    throw t
                                })
                            })
                        }, _c: 0, _p: C
                    }), rn.resolve = function (n) {
                        return p(n) ? n : k(d(this), n)
                    }, rn.reject = function (n) {
                        return x(d(this), U, n)
                    }, rn.race = function (n) {
                        var t = this, e = d(t), r = function (n) {
                            x(e, Y, n)
                        }, o = function (n) {
                            x(e, U, n)
                        }, i = s(l)(n, function (n) {
                            t.resolve(n).then(r, o)
                        });
                        return i === nn ? t.reject(i.e) : e
                    }, rn.all = function (n) {
                        function t(n) {
                            x(o, U, n)
                        }

                        var e, r = this, o = d(r), i = [];
                        return (e = s(l)(n, function (n, u) {
                            r.resolve(n).then(function (n) {
                                i[u] = n, --e || x(o, Y, i)
                            }, t)
                        })) === nn ? r.reject(e.e) : (e || x(o, Y, []), o)
                    }, rn.Symbol = O[q] || {}, s(function () {
                        Object.defineProperty(rn, e(), {
                            get: function () {
                                return this
                            }
                        })
                    })(), rn.speciesConstructor = function (n, t) {
                        var r = n.constructor;
                        return r ? r[e()] || t : t
                    }, rn.unhandledRejection = function (n, t) {
                        I && I.error("Uncaught (in promise)", L ? t.longStack : j(n, t))
                    }, rn.rejectionHandled = tn, rn.enableLongStackTrace = function () {
                        L = !0
                    }, rn.nextTick = F ? function (n) {
                        E ? new E(function (n) {
                            n()
                        }).then(n) : setTimeout(n)
                    } : H.nextTick, rn._s = 1;
                    var on = a(999, function (n, t) {
                        var e, r;
                        return (r = n._s !== U ? t._onFulfilled : t._onRejected) === P ? void x(t, n._s, n._v) : (e = s(g)(r, n._v)) === nn ? void x(t, U, e.e) : void k(t, e)
                    }), un = a(9, function (n) {
                        m(n) || (n[J] = 1, _(Z, n))
                    });
                    try {
                        n.exports = rn
                    } catch (cn) {
                        O.Yaku = rn
                    }
                }()
            }).call(t, e(2))
        }
    });
    Object.defineProperty(self, "Reflect", {
        value: self.Reflect || {},
        writable: !0,
        configurable: !0
    }), Object.defineProperty(self, "Reflect", {value: self.Reflect || {}, enumerable: !1});
    Object.defineProperty(RegExp.prototype, "flags", {
        configurable: !0, enumerable: !1, get: function () {
            var e = this;
            if ("object" !== Type(e)) throw new TypeError("Method called on incompatible type: must be an object.");
            var o = "";
            return ToBoolean(Get(e, "global")) && (o += "g"), ToBoolean(Get(e, "ignoreCase")) && (o += "i"), ToBoolean(Get(e, "multiline")) && (o += "m"), ToBoolean(Get(e, "unicode")) && (o += "u"), ToBoolean(Get(e, "sticky")) && (o += "y"), o
        }
    });
    CreateMethodProperty(String.prototype, "codePointAt", function e(t) {
        var r = RequireObjectCoercible(this), o = ToString(r), n = ToInteger(t), i = o.length;
        if (n < 0 || n >= i) return undefined;
        var c = String.prototype.charCodeAt.call(o, n);
        if (c < 55296 || c > 56319 || n + 1 === i) return c;
        var a = String.prototype.charCodeAt.call(o, n + 1);
        return a < 56320 || a > 57343 ? c : UTF16Decode(c, a)
    });
    CreateMethodProperty(String.prototype, "endsWith", function e(t) {
        "use strict";
        var r = arguments.length > 1 ? arguments[1] : undefined, n = RequireObjectCoercible(this), i = ToString(n);
        if (IsRegExp(t)) throw new TypeError("First argument to String.prototype.endsWith must not be a regular expression");
        var o = ToString(t), s = i.length, g = r === undefined ? s : ToInteger(r), h = Math.min(Math.max(g, 0), s),
            u = o.length, a = h - u;
        return !(a < 0) && i.substr(a, u) === o
    });
    CreateMethodProperty(String.prototype, "includes", function e(t) {
        "use strict";
        var r = arguments.length > 1 ? arguments[1] : undefined, n = RequireObjectCoercible(this), i = ToString(n);
        if (IsRegExp(t)) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
        var o = ToString(t), g = ToInteger(r), a = i.length, p = Math.min(Math.max(g, 0), a);
        return -1 !== String.prototype.indexOf.call(i, o, p)
    });
    CreateMethodProperty(String.prototype, "padEnd", function e(r) {
        "use strict";
        var t = arguments.length > 1 ? arguments[1] : undefined, n = RequireObjectCoercible(this), i = ToString(n),
            o = ToLength(r), u = i.length;
        if (o <= u) return i;
        if (t === undefined) var d = " "; else var d = ToString(t);
        if ("" === d) return i;
        for (var f = o - u, a = "", g = 0; g < f; g++) a += d;
        return a = a.substr(0, f), i + a
    });
    CreateMethodProperty(String.prototype, "padStart", function e(r) {
        "use strict";
        var t = arguments.length > 1 ? arguments[1] : undefined, n = RequireObjectCoercible(this), i = ToString(n),
            o = ToLength(r), u = i.length;
        if (o <= u) return i;
        if (t === undefined) var a = " "; else var a = ToString(t);
        if ("" === a) return i;
        for (var f = o - u, d = "", g = 0; g < f; g++) d += a;
        return (d = d.substr(0, f)) + i
    });
    CreateMethodProperty(String.prototype, "repeat", function r(e) {
        "use strict";
        var t = RequireObjectCoercible(this), n = ToString(t), o = ToInteger(e);
        if (o < 0) throw new RangeError("Invalid count value");
        if (o === Infinity) throw new RangeError("Invalid count value");
        return 0 === o ? "" : new Array(o + 1).join(n)
    });
    CreateMethodProperty(String.prototype, "startsWith", function t(e) {
        "use strict";
        var r = arguments.length > 1 ? arguments[1] : undefined, n = RequireObjectCoercible(this), i = ToString(n);
        if (IsRegExp(e)) throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
        var o = ToString(e), s = ToInteger(r), a = i.length, g = Math.min(Math.max(s, 0), a);
        return !(o.length + g > a) && 0 === i.substr(g).indexOf(e)
    });
    !function (t, r, n) {
        "use strict";
        var e, o = 0, u = "" + Math.random(), l = "__symbol:", c = l.length, a = "__symbol@@" + u,
            i = "defineProperty", f = "defineProperties", s = "getOwnPropertyNames", v = "getOwnPropertyDescriptor",
            b = "propertyIsEnumerable", h = t.prototype, y = h.hasOwnProperty, m = h[b], p = h.toString,
            g = Array.prototype.concat, w = t.getOwnPropertyNames ? t.getOwnPropertyNames(window) : [], d = t[s],
            S = function L(t) {
                if ("[object Window]" === p.call(t)) try {
                    return d(t)
                } catch (r) {
                    return g.call([], w)
                }
                return d(t)
            }, P = t[v], j = t.create, O = t.keys, E = t.freeze || t, N = t[i], _ = t[f], k = P(t, s),
            T = function (t, r, n) {
                if (!y.call(t, a)) try {
                    N(t, a, {enumerable: !1, configurable: !1, writable: !1, value: {}})
                } catch (e) {
                    t[a] = {}
                }
                t[a]["@@" + r] = n
            }, z = function (t, r) {
                var n = j(t);
                return S(r).forEach(function (t) {
                    M.call(r, t) && G(n, t, r[t])
                }), n
            }, A = function (t) {
                var r = j(t);
                return r.enumerable = !1, r
            }, D = function Q() {
            }, F = function (t) {
                return t != a && !y.call(x, t)
            }, I = function (t) {
                return t != a && y.call(x, t)
            }, M = function R(t) {
                var r = "" + t;
                return I(r) ? y.call(this, r) && this[a]["@@" + r] : m.call(this, t)
            }, W = function (r) {
                var n = {
                    enumerable: !1, configurable: !0, get: D, set: function (t) {
                        e(this, r, {enumerable: !1, configurable: !0, writable: !0, value: t}), T(this, r, !0)
                    }
                };
                try {
                    N(h, r, n)
                } catch (o) {
                    h[r] = n.value
                }
                return E(x[r] = N(t(r), "constructor", B))
            }, q = function U() {
                var t = arguments[0];
                if (this instanceof U) throw new TypeError("Symbol is not a constructor");
                return W(l.concat(t || "", u, ++o))
            }, x = j(null), B = {value: q}, C = function (t) {
                return x[t]
            }, G = function V(t, r, n) {
                var o = "" + r;
                return I(o) ? (e(t, o, n.enumerable ? A(n) : n), T(t, o, !!n.enumerable)) : N(t, r, n), t
            }, H = function (t) {
                return function (r) {
                    return y.call(t, a) && y.call(t[a], "@@" + r)
                }
            }, J = function X(t) {
                return S(t).filter(t === h ? H(t) : I).map(C)
            };
        k.value = G, N(t, i, k), k.value = J, N(t, "getOwnPropertySymbols", k), k.value = function Y(t) {
            return S(t).filter(F)
        }, N(t, s, k), k.value = function Z(t, r) {
            var n = J(r);
            return n.length ? O(r).concat(n).forEach(function (n) {
                M.call(r, n) && G(t, n, r[n])
            }) : _(t, r), t
        }, N(t, f, k), k.value = M, N(h, b, k), k.value = q, N(n, "Symbol", k), k.value = function (t) {
            var r = l.concat(l, t, u);
            return r in h ? x[r] : W(r)
        }, N(q, "for", k), k.value = function (t) {
            if (F(t)) throw new TypeError(t + " is not a symbol");
            return y.call(x, t) ? t.slice(2 * c, -u.length) : void 0
        }, N(q, "keyFor", k), k.value = function $(t, r) {
            var n = P(t, r);
            return n && I(r) && (n.enumerable = M.call(t, r)), n
        }, N(t, v, k), k.value = function (t, r) {
            return 1 === arguments.length || void 0 === r ? j(t) : z(t, r)
        }, N(t, "create", k);
        var K = null === function () {
            return this
        }.call(null);
        k.value = K ? function () {
            var t = p.call(this);
            return "[object String]" === t && I(this) ? "[object Symbol]" : t
        } : function () {
            if (this === window) return "[object Null]";
            var t = p.call(this);
            return "[object String]" === t && I(this) ? "[object Symbol]" : t
        }, N(h, "toString", k), e = function (t, r, n) {
            var e = P(h, r);
            delete h[r], N(t, r, n), t !== h && N(h, r, e)
        }
    }(Object, 0, this);
    CreateMethodProperty(Reflect, "ownKeys", function e(t) {
        if ("object" !== Type(t)) throw new TypeError(Object.prototype.toString.call(t) + " is not an Object");
        return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))
    });
    CreateMethodProperty(Object, "getOwnPropertyDescriptors", function e(r) {
        for (var t = ToObject(r), o = Reflect.ownKeys(t), n = {}, c = o.length, a = 0; a < c; a++) {
            var p = o[a], y = Object.getOwnPropertyDescriptor(r, p);
            y !== undefined && CreateDataProperty(n, p, y)
        }
        return n
    });
    Object.defineProperty(Symbol, "asyncIterator", {value: Symbol("asyncIterator")});
    Object.defineProperty(Symbol, "hasInstance", {value: Symbol("hasInstance")});
    Object.defineProperty(Symbol, "isConcatSpreadable", {value: Symbol("isConcatSpreadable")});
    Object.defineProperty(Symbol, "iterator", {value: Symbol("iterator")});

    function GetIterator(t) {
        var e = arguments.length > 1 ? arguments[1] : GetMethod(t, Symbol.iterator), r = Call(e, t);
        if ("object" !== Type(r)) throw new TypeError("bad iterator");
        var o = GetV(r, "next"), a = Object.create(null);
        return a["[[Iterator]]"] = r, a["[[NextMethod]]"] = o, a["[[Done]]"] = !1, a
    }

    Object.defineProperty(Symbol, "match", {value: Symbol("match")});
    Object.defineProperty(Symbol, "replace", {value: Symbol("replace")});
    Object.defineProperty(Symbol, "search", {value: Symbol("search")});
    Object.defineProperty(Symbol, "species", {value: Symbol("species")});
    !function (e) {
        function t(e, t) {
            if ("object" !== Type(e)) throw new TypeError("createMapIterator called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!0 !== e._es6Map) throw new TypeError("createMapIterator called on incompatible receiver " + Object.prototype.toString.call(e));
            var r = Object.create(n);
            return Object.defineProperty(r, "[[Map]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: e
            }), Object.defineProperty(r, "[[MapNextIndex]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: 0
            }), Object.defineProperty(r, "[[MapIterationKind]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: t
            }), r
        }

        var r = function () {
            try {
                var e = {};
                return Object.defineProperty(e, "t", {
                    configurable: !0, enumerable: !1, get: function () {
                        return !0
                    }, set: undefined
                }), !!e.t
            } catch (t) {
                return !1
            }
        }(), o = Symbol("undef"), a = function p() {
            if (!(this instanceof p)) throw new TypeError('Constructor Map requires "new"');
            var e = OrdinaryCreateFromConstructor(this, p.prototype, {_keys: [], _values: [], _size: 0, _es6Map: !0});
            r || Object.defineProperty(e, "size", {configurable: !0, enumerable: !1, writable: !0, value: 0});
            var t = arguments.length > 0 ? arguments[0] : undefined;
            if (null === t || t === undefined) return e;
            var o = e.set;
            if (!IsCallable(o)) throw new TypeError("Map.prototype.set is not a function");
            try {
                for (var a = GetIterator(t); ;) {
                    var n = IteratorStep(a);
                    if (!1 === n) return e;
                    var i = IteratorValue(n);
                    if ("object" !== Type(i)) try {
                        throw new TypeError("Iterator value " + i + " is not an entry object")
                    } catch (u) {
                        return IteratorClose(a, u)
                    }
                    try {
                        var l = i[0], c = i[1];
                        o.call(e, l, c)
                    } catch (f) {
                        return IteratorClose(a, f)
                    }
                }
            } catch (f) {
                if (Array.isArray(t) || "[object Arguments]" === Object.prototype.toString.call(t) || t.callee) {
                    var y, s = t.length;
                    for (y = 0; y < s; y++) o.call(e, t[y][0], t[y][1])
                }
            }
            return e
        };
        Object.defineProperty(a, "prototype", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: {}
        }), r ? Object.defineProperty(a, Symbol.species, {
            configurable: !0, enumerable: !1, get: function () {
                return this
            }, set: undefined
        }) : CreateMethodProperty(a, Symbol.species, a), CreateMethodProperty(a.prototype, "clear", function l() {
            var e = this;
            if ("object" !== Type(e)) throw new TypeError("Method Map.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!0 !== e._es6Map) throw new TypeError("Method Map.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(e));
            for (var t = e._keys, a = 0; a < t.length; a++) e._keys[a] = o, e._values[a] = o;
            return this._size = 0, r || (this.size = this._size), undefined
        }), CreateMethodProperty(a.prototype, "constructor", a), CreateMethodProperty(a.prototype, "delete", function (e) {
            var t = this;
            if ("object" !== Type(t)) throw new TypeError("Method Map.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Map) throw new TypeError("Method Map.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var a = t._keys, n = 0; n < a.length; n++) if (t._keys[n] !== o && SameValueZero(t._keys[n], e)) return this._keys[n] = o, this._values[n] = o, this._size = --this._size, r || (this.size = this._size), !0;
            return !1
        }), CreateMethodProperty(a.prototype, "entries", function c() {
            return t(this, "key+value")
        }), CreateMethodProperty(a.prototype, "forEach", function (e) {
            var t = this;
            if ("object" !== Type(t)) throw new TypeError("Method Map.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Map) throw new TypeError("Method Map.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!IsCallable(e)) throw new TypeError(Object.prototype.toString.call(e) + " is not a function.");
            if (arguments[1]) var r = arguments[1];
            for (var a = t._keys, n = 0; n < a.length; n++) t._keys[n] !== o && t._values[n] !== o && e.call(r, t._values[n], t._keys[n], t);
            return undefined
        }), CreateMethodProperty(a.prototype, "get", function y(e) {
            var t = this;
            if ("object" !== Type(t)) throw new TypeError("Method Map.prototype.get called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Map) throw new TypeError("Method Map.prototype.get called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var r = t._keys, a = 0; a < r.length; a++) if (t._keys[a] !== o && SameValueZero(t._keys[a], e)) return t._values[a];
            return undefined
        }), CreateMethodProperty(a.prototype, "has", function s(e) {
            var t = this;
            if ("object" != typeof t) throw new TypeError("Method Map.prototype.has called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Map) throw new TypeError("Method Map.prototype.has called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var r = t._keys, a = 0; a < r.length; a++) if (t._keys[a] !== o && SameValueZero(t._keys[a], e)) return !0;
            return !1
        }), CreateMethodProperty(a.prototype, "keys", function u() {
            return t(this, "key")
        }), CreateMethodProperty(a.prototype, "set", function f(e, t) {
            var a = this;
            if ("object" !== Type(a)) throw new TypeError("Method Map.prototype.set called on incompatible receiver " + Object.prototype.toString.call(a));
            if (!0 !== a._es6Map) throw new TypeError("Method Map.prototype.set called on incompatible receiver " + Object.prototype.toString.call(a));
            for (var n = a._keys, i = 0; i < n.length; i++) if (a._keys[i] !== o && SameValueZero(a._keys[i], e)) return a._values[i] = t, a;
            -0 === e && (e = 0);
            var p = {};
            return p["[[Key]]"] = e, p["[[Value]]"] = t, a._keys.push(p["[[Key]]"]), a._values.push(p["[[Value]]"]), ++a._size, r || (a.size = a._size), a
        }), r && Object.defineProperty(a.prototype, "size", {
            configurable: !0, enumerable: !1, get: function () {
                var e = this;
                if ("object" !== Type(e)) throw new TypeError("Method Map.prototype.size called on incompatible receiver " + Object.prototype.toString.call(e));
                if (!0 !== e._es6Map) throw new TypeError("Method Map.prototype.size called on incompatible receiver " + Object.prototype.toString.call(e));
                for (var t = e._keys, r = 0, a = 0; a < t.length; a++) e._keys[a] !== o && (r += 1);
                return r
            }, set: undefined
        }), CreateMethodProperty(a.prototype, "values", function h() {
            return t(this, "value")
        }), CreateMethodProperty(a.prototype, Symbol.iterator, a.prototype.entries), "name" in a || Object.defineProperty(a, "name", {
            configurable: !0,
            enumerable: !1,
            writable: !1,
            value: "Map"
        });
        var n = {};
        Object.defineProperty(n, "isMapIterator", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: !0
        }), CreateMethodProperty(n, "next", function b() {
            var e = this;
            if ("object" !== Type(e)) throw new TypeError("Method %MapIteratorPrototype%.next called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!e.isMapIterator) throw new TypeError("Method %MapIteratorPrototype%.next called on incompatible receiver " + Object.prototype.toString.call(e));
            var t = e["[[Map]]"], r = e["[[MapNextIndex]]"], a = e["[[MapIterationKind]]"];
            if (t === undefined) return CreateIterResultObject(undefined, !0);
            if (!t._es6Map) throw new Error(Object.prototype.toString.call(t) + " has a [[MapData]] internal slot.");
            for (var n = t._keys, i = n.length; r < i;) {
                var p = Object.create(null);
                if (p["[[Key]]"] = t._keys[r], p["[[Value]]"] = t._values[r], r += 1, e["[[MapNextIndex]]"] = r, p["[[Key]]"] !== o) {
                    if ("key" === a) var l = p["[[Key]]"]; else if ("value" === a) l = p["[[Value]]"]; else {
                        if ("key+value" !== a) throw new Error;
                        l = [p["[[Key]]"], p["[[Value]]"]]
                    }
                    return CreateIterResultObject(l, !1)
                }
            }
            return e["[[Map]]"] = undefined, CreateIterResultObject(undefined, !0)
        }), CreateMethodProperty(n, Symbol.iterator, function d() {
            return this
        });
        try {
            CreateMethodProperty(e, "Map", a)
        } catch (i) {
            e.Map = a
        }
    }(this);
    !function (e) {
        function t(e, t) {
            if ("object" != typeof e) throw new TypeError("createSetIterator called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!0 !== e._es6Set) throw new TypeError("createSetIterator called on incompatible receiver " + Object.prototype.toString.call(e));
            var r = Object.create(i);
            return Object.defineProperty(r, "[[IteratedSet]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: e
            }), Object.defineProperty(r, "[[SetNextIndex]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: 0
            }), Object.defineProperty(r, "[[SetIterationKind]]", {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: t
            }), r
        }

        var r = function () {
            try {
                var e = {};
                return Object.defineProperty(e, "t", {
                    configurable: !0, enumerable: !1, get: function () {
                        return !0
                    }, set: undefined
                }), !!e.t
            } catch (t) {
                return !1
            }
        }(), o = Symbol("undef"), n = function c() {
            if (!(this instanceof c)) throw new TypeError('Constructor Set requires "new"');
            var e = OrdinaryCreateFromConstructor(this, c.prototype, {_values: [], _size: 0, _es6Set: !0});
            r || Object.defineProperty(e, "size", {configurable: !0, enumerable: !1, writable: !0, value: 0});
            var t = arguments.length > 0 ? arguments[0] : undefined;
            if (null === t || t === undefined) return e;
            var o = e.add;
            if (!IsCallable(o)) throw new TypeError("Set.prototype.add is not a function");
            try {
                for (var n = GetIterator(t); ;) {
                    var a = IteratorStep(n);
                    if (!1 === a) return e;
                    var i = IteratorValue(a);
                    try {
                        o.call(e, i)
                    } catch (y) {
                        return IteratorClose(n, y)
                    }
                }
            } catch (y) {
                if (!Array.isArray(t) && "[object Arguments]" !== Object.prototype.toString.call(t) && !t.callee) throw y;
                var l, p = t.length;
                for (l = 0; l < p; l++) o.call(e, t[l])
            }
            return e
        };
        Object.defineProperty(n, "prototype", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: {}
        }), r ? Object.defineProperty(n, Symbol.species, {
            configurable: !0, enumerable: !1, get: function () {
                return this
            }, set: undefined
        }) : CreateMethodProperty(n, Symbol.species, n), CreateMethodProperty(n.prototype, "add", function p(e) {
            var t = this;
            if ("object" != typeof t) throw new TypeError("Method Set.prototype.add called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Set) throw new TypeError("Method Set.prototype.add called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var n = t._values, a = 0; a < n.length; a++) {
                var i = n[a];
                if (i !== o && SameValueZero(i, e)) return t
            }
            return 1 / e == -Infinity && (e = 0), t._values.push(e), this._size = ++this._size, r || (this.size = this._size), t
        }), CreateMethodProperty(n.prototype, "clear", function y() {
            var e = this;
            if ("object" != typeof e) throw new TypeError("Method Set.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!0 !== e._es6Set) throw new TypeError("Method Set.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(e));
            for (var t = e._values, n = 0; n < t.length; n++) t[n] = o;
            return this._size = 0, r || (this.size = this._size), undefined
        }), CreateMethodProperty(n.prototype, "constructor", n), CreateMethodProperty(n.prototype, "delete", function (e) {
            var t = this;
            if ("object" != typeof t) throw new TypeError("Method Set.prototype.delete called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Set) throw new TypeError("Method Set.prototype.delete called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var n = t._values, a = 0; a < n.length; a++) {
                var i = n[a];
                if (i !== o && SameValueZero(i, e)) return n[a] = o, this._size = --this._size, r || (this.size = this._size), !0
            }
            return !1
        }), CreateMethodProperty(n.prototype, "entries", function u() {
            return t(this, "key+value")
        }), CreateMethodProperty(n.prototype, "forEach", function f(e) {
            var t = this;
            if ("object" != typeof t) throw new TypeError("Method Set.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Set) throw new TypeError("Method Set.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!IsCallable(e)) throw new TypeError(Object.prototype.toString.call(e) + " is not a function.");
            if (arguments[1]) var r = arguments[1];
            for (var n = t._values, a = 0; a < n.length; a++) {
                var i = n[a];
                i !== o && e.call(r, i, i, t)
            }
            return undefined
        }), CreateMethodProperty(n.prototype, "has", function d(e) {
            var t = this;
            if ("object" != typeof t) throw new TypeError("Method Set.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            if (!0 !== t._es6Set) throw new TypeError("Method Set.prototype.forEach called on incompatible receiver " + Object.prototype.toString.call(t));
            for (var r = t._values, n = 0; n < r.length; n++) {
                var a = r[n];
                if (a !== o && SameValueZero(a, e)) return !0
            }
            return !1
        });
        var a = function h() {
            return t(this, "value")
        };
        CreateMethodProperty(n.prototype, "values", a), CreateMethodProperty(n.prototype, "keys", a), r && Object.defineProperty(n.prototype, "size", {
            configurable: !0,
            enumerable: !1,
            get: function () {
                var e = this;
                if ("object" != typeof e) throw new TypeError("Method Set.prototype.size called on incompatible receiver " + Object.prototype.toString.call(e));
                if (!0 !== e._es6Set) throw new TypeError("Method Set.prototype.size called on incompatible receiver " + Object.prototype.toString.call(e));
                for (var t = e._values, r = 0, n = 0; n < t.length; n++) {
                    t[n] !== o && (r += 1)
                }
                return r
            },
            set: undefined
        }), CreateMethodProperty(n.prototype, Symbol.iterator, a), "name" in n || Object.defineProperty(n, "name", {
            configurable: !0,
            enumerable: !1,
            writable: !1,
            value: "Set"
        });
        var i = {};
        Object.defineProperty(i, "isSetIterator", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: !0
        }), CreateMethodProperty(i, "next", function b() {
            var e = this;
            if ("object" != typeof e) throw new TypeError("Method %SetIteratorPrototype%.next called on incompatible receiver " + Object.prototype.toString.call(e));
            if (!e.isSetIterator) throw new TypeError("Method %SetIteratorPrototype%.next called on incompatible receiver " + Object.prototype.toString.call(e));
            var t = e["[[IteratedSet]]"], r = e["[[SetNextIndex]]"], n = e["[[SetIterationKind]]"];
            if (t === undefined) return CreateIterResultObject(undefined, !0);
            if (!t._es6Set) throw new Error(Object.prototype.toString.call(t) + " does not have [[SetData]] internal slot.");
            for (var a = t._values, i = a.length; r < i;) {
                var l = a[r];
                if (r += 1, e["[[SetNextIndex]]"] = r, l !== o) return "key+value" === n ? CreateIterResultObject([l, l], !1) : CreateIterResultObject(l, !1)
            }
            return e["[[IteratedSet]]"] = undefined, CreateIterResultObject(undefined, !0)
        }), CreateMethodProperty(i, Symbol.iterator, function s() {
            return this
        });
        try {
            CreateMethodProperty(e, "Set", n)
        } catch (l) {
            e.Set = n
        }
    }(this);
    !function () {
        function r(r) {
            return "string" == typeof r || "object" == typeof r && "[object String]" === t.call(r)
        }

        var t = Object.prototype.toString, e = String.prototype.match;
        CreateMethodProperty(Array, "from", function o(t) {
            var o = this, a = arguments.length > 1 ? arguments[1] : undefined;
            if (a === undefined) var n = !1; else {
                if (!1 === IsCallable(a)) throw new TypeError(Object.prototype.toString.call(a) + " is not a function.");
                var i = arguments.length > 2 ? arguments[2] : undefined;
                if (i !== undefined) var l = i; else l = undefined;
                n = !0
            }
            var u = GetMethod(t, Symbol.iterator);
            if (u !== undefined) {
                if (IsConstructor(o)) var f = Construct(o); else f = ArrayCreate(0);
                for (var c = GetIterator(t, u), s = 0; ;) {
                    if (s >= Math.pow(2, 53) - 1) {
                        var h = new TypeError("Iteration count can not be greater than or equal 9007199254740991.");
                        return IteratorClose(c, h)
                    }
                    var y = ToString(s), C = IteratorStep(c);
                    if (!1 === C) return f.length = s, f;
                    var g = IteratorValue(C);
                    if (n) try {
                        var p = Call(a, l, [g, s])
                    } catch (b) {
                        return IteratorClose(c, b)
                    } else p = g;
                    try {
                        CreateDataPropertyOrThrow(f, y, p)
                    } catch (b) {
                        return IteratorClose(c, b)
                    }
                    s += 1
                }
            }
            if (r(t)) var v = e.call(t, /[\uD800-\uDBFF][\uDC00-\uDFFF]?|[^\uD800-\uDFFF]|./g) || []; else v = ToObject(t);
            var d = ToLength(Get(v, "length"));
            for (f = IsConstructor(o) ? Construct(o, [d]) : ArrayCreate(d), s = 0; s < d;) {
                y = ToString(s);
                var I = Get(v, y);
                p = !0 === n ? Call(a, l, [I, s]) : I, CreateDataPropertyOrThrow(f, y, p), s += 1
            }
            return f.length = d, f
        })
    }();
    Object.defineProperty(Symbol, "split", {value: Symbol("split")});
    Object.defineProperty(Symbol, "toPrimitive", {value: Symbol("toPrimitive")});
    Object.defineProperty(Symbol, "toStringTag", {value: Symbol("toStringTag")});
    var Iterator = function () {
        var e = function () {
            return this.length = 0, this
        }, t = function (e) {
            if ("function" != typeof e) throw new TypeError(e + " is not a function");
            return e
        }, _ = function (e, n) {
            if (!(this instanceof _)) return new _(e, n);
            Object.defineProperties(this, {
                __list__: {writable: !0, value: e},
                __context__: {writable: !0, value: n},
                __nextIndex__: {writable: !0, value: 0}
            }), n && (t(n.on), n.on("_add", this._onAdd.bind(this)), n.on("_delete", this._onDelete.bind(this)), n.on("_clear", this._onClear.bind(this)))
        };
        return Object.defineProperties(_.prototype, Object.assign({
            constructor: {value: _, configurable: !0, enumerable: !1, writable: !0}, _next: {
                value: function () {
                    var e;
                    if (this.__list__) return this.__redo__ && (e = this.__redo__.shift()) !== undefined ? e : this.__nextIndex__ < this.__list__.length ? this.__nextIndex__++ : void this._unBind()
                }, configurable: !0, enumerable: !1, writable: !0
            }, next: {
                value: function () {
                    return this._createResult(this._next())
                }, configurable: !0, enumerable: !1, writable: !0
            }, _createResult: {
                value: function (e) {
                    return e === undefined ? {done: !0, value: undefined} : {done: !1, value: this._resolve(e)}
                }, configurable: !0, enumerable: !1, writable: !0
            }, _resolve: {
                value: function (e) {
                    return this.__list__[e]
                }, configurable: !0, enumerable: !1, writable: !0
            }, _unBind: {
                value: function () {
                    this.__list__ = null, delete this.__redo__, this.__context__ && (this.__context__.off("_add", this._onAdd.bind(this)), this.__context__.off("_delete", this._onDelete.bind(this)), this.__context__.off("_clear", this._onClear.bind(this)), this.__context__ = null)
                }, configurable: !0, enumerable: !1, writable: !0
            }, toString: {
                value: function () {
                    return "[object Iterator]"
                }, configurable: !0, enumerable: !1, writable: !0
            }
        }, {
            _onAdd: {
                value: function (e) {
                    if (!(e >= this.__nextIndex__)) {
                        if (++this.__nextIndex__, !this.__redo__) return void Object.defineProperty(this, "__redo__", {
                            value: [e],
                            configurable: !0,
                            enumerable: !1,
                            writable: !1
                        });
                        this.__redo__.forEach(function (t, _) {
                            t >= e && (this.__redo__[_] = ++t)
                        }, this), this.__redo__.push(e)
                    }
                }, configurable: !0, enumerable: !1, writable: !0
            }, _onDelete: {
                value: function (e) {
                    var t;
                    e >= this.__nextIndex__ || (--this.__nextIndex__, this.__redo__ && (t = this.__redo__.indexOf(e), -1 !== t && this.__redo__.splice(t, 1), this.__redo__.forEach(function (t, _) {
                        t > e && (this.__redo__[_] = --t)
                    }, this)))
                }, configurable: !0, enumerable: !1, writable: !0
            }, _onClear: {
                value: function () {
                    this.__redo__ && e.call(this.__redo__), this.__nextIndex__ = 0
                }, configurable: !0, enumerable: !1, writable: !0
            }
        })), Object.defineProperty(_.prototype, Symbol.iterator, {
            value: function () {
                return this
            }, configurable: !0, enumerable: !1, writable: !0
        }), Object.defineProperty(_.prototype, Symbol.toStringTag, {
            value: "Iterator",
            configurable: !1,
            enumerable: !1,
            writable: !0
        }), _
    }();
    var ArrayIterator = function () {
        var e = function (t, r) {
            if (!(this instanceof e)) return new e(t, r);
            Iterator.call(this, t), r = r ? String.prototype.includes.call(r, "key+value") ? "key+value" : String.prototype.includes.call(r, "key") ? "key" : "value" : "value", Object.defineProperty(this, "__kind__", {
                value: r,
                configurable: !1,
                enumerable: !1,
                writable: !1
            })
        };
        return Object.setPrototypeOf && Object.setPrototypeOf(e, Iterator.prototype), e.prototype = Object.create(Iterator.prototype, {
            constructor: {
                value: e,
                configurable: !0,
                enumerable: !1,
                writable: !0
            }, _resolve: {
                value: function (e) {
                    return "value" === this.__kind__ ? this.__list__[e] : "key+value" === this.__kind__ ? [e, this.__list__[e]] : e
                }, configurable: !0, enumerable: !1, writable: !0
            }, toString: {
                value: function () {
                    return "[object Array Iterator]"
                }, configurable: !0, enumerable: !1, writable: !0
            }
        }), e
    }();
    CreateMethodProperty(Array.prototype, "entries", function r() {
        var r = ToObject(this);
        return new ArrayIterator(r, "key+value")
    });
    CreateMethodProperty(Array.prototype, "keys", function r() {
        var r = ToObject(this);
        return new ArrayIterator(r, "key")
    });
    "Symbol" in this && "iterator" in Symbol && "function" == typeof Array.prototype[Symbol.iterator] ? CreateMethodProperty(Array.prototype, "values", Array.prototype[Symbol.iterator]) : CreateMethodProperty(Array.prototype, "values", function r() {
        var r = ToObject(this);
        return new ArrayIterator(r, "value")
    });
    CreateMethodProperty(Array.prototype, Symbol.iterator, Array.prototype.values);
    var StringIterator = function () {
        var t = function (e) {
            if (!(this instanceof t)) return new t(e);
            e = String(e), Iterator.call(this, e), Object.defineProperty(this, "__length__", {
                value: e.length,
                configurable: !1,
                enumerable: !1,
                writable: !1
            })
        };
        return Object.setPrototypeOf && Object.setPrototypeOf(t, Iterator), t.prototype = Object.create(Iterator.prototype, {
            constructor: {
                value: t,
                configurable: !0,
                enumerable: !1,
                writable: !0
            }, _next: {
                value: function () {
                    if (this.__list__) return this.__nextIndex__ < this.__length__ ? this.__nextIndex__++ : void this._unBind()
                }, configurable: !0, enumerable: !1, writable: !0
            }, _resolve: {
                value: function (t) {
                    var e, r = this.__list__[t];
                    return this.__nextIndex__ === this.__length__ ? r : (e = r.charCodeAt(0), e >= 55296 && e <= 56319 ? r + this.__list__[this.__nextIndex__++] : r)
                }, configurable: !0, enumerable: !1, writable: !0
            }, toString: {
                value: function () {
                    return "[object String Iterator]"
                }, configurable: !0, enumerable: !1, writable: !0
            }
        }), t
    }();
    CreateMethodProperty(String.prototype, Symbol.iterator, function () {
        var r = RequireObjectCoercible(this), t = ToString(r);
        return new StringIterator(t)
    });
    Object.defineProperty(Symbol, "unscopables", {value: Symbol("unscopables")});
    !function (e) {
        var t = Symbol("undef"), r = function a() {
            if (!(this instanceof a)) throw new TypeError('Constructor WeakMap requires "new"');
            var e = OrdinaryCreateFromConstructor(this, a.prototype, {_keys: [], _values: [], _es6WeakMap: !0}),
                t = arguments.length > 0 ? arguments[0] : undefined;
            if (null === t || t === undefined) return e;
            var r = Get(e, "set");
            if (!IsCallable(r)) throw new TypeError("WeakMap.prototype.set is not a function");
            try {
                for (var o = GetIterator(t); ;) {
                    var p = IteratorStep(o);
                    if (!1 === p) return e;
                    var n = IteratorValue(p);
                    if ("object" !== Type(n)) try {
                        throw new TypeError("Iterator value " + n + " is not an entry object")
                    } catch (s) {
                        return IteratorClose(o, s)
                    }
                    try {
                        var i = Get(n, "0"), l = Get(n, "1");
                        Call(r, e, [i, l])
                    } catch (u) {
                        return IteratorClose(o, u)
                    }
                }
            } catch (u) {
                if (Array.isArray(t) || "[object Arguments]" === Object.prototype.toString.call(t) || t.callee) {
                    var y, c = t.length;
                    for (y = 0; y < c; y++) {
                        var i = t[y][0], l = t[y][1];
                        Call(r, e, [i, l])
                    }
                }
            }
            return e
        };
        Object.defineProperty(r, "prototype", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: {}
        }), CreateMethodProperty(r.prototype, "constructor", r), CreateMethodProperty(r.prototype, "delete", function (e) {
            var r = this;
            if ("object" !== Type(r)) throw new TypeError("Method WeakMap.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakMap) throw new TypeError("Method WeakMap.prototype.clear called on incompatible receiver " + Object.prototype.toString.call(r));
            var o = r._keys;
            if ("object" !== Type(e)) return !1;
            for (var a = 0; a < o.length; a++) if (r._keys[a] !== t && SameValue(r._keys[a], e)) return this._keys[a] = t, this._values[a] = t, this._size = --this._size, !0;
            return !1
        }), CreateMethodProperty(r.prototype, "get", function p(e) {
            var r = this;
            if ("object" !== Type(r)) throw new TypeError("Method WeakMap.prototype.get called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakMap) throw new TypeError("Method WeakMap.prototype.get called on incompatible receiver " + Object.prototype.toString.call(r));
            var o = r._keys;
            if ("object" !== Type(e)) return undefined;
            for (var a = 0; a < o.length; a++) if (r._keys[a] !== t && SameValue(r._keys[a], e)) return r._values[a];
            return undefined
        }), CreateMethodProperty(r.prototype, "has", function n(e) {
            var r = this;
            if ("object" != typeof r) throw new TypeError("Method WeakMap.prototype.has called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakMap) throw new TypeError("Method WeakMap.prototype.has called on incompatible receiver " + Object.prototype.toString.call(r));
            var o = r._keys;
            if ("object" !== Type(e)) return !1;
            for (var a = 0; a < o.length; a++) if (r._keys[a] !== t && SameValue(r._keys[a], e)) return !0;
            return !1
        }), CreateMethodProperty(r.prototype, "set", function i(e, r) {
            var o = this;
            if ("object" !== Type(o)) throw new TypeError("Method WeakMap.prototype.set called on incompatible receiver " + Object.prototype.toString.call(o));
            if (!0 !== o._es6WeakMap) throw new TypeError("Method WeakMap.prototype.set called on incompatible receiver " + Object.prototype.toString.call(o));
            var a = o._keys;
            if ("object" !== Type(e)) throw new TypeError("Invalid value used as weak map key");
            for (var p = 0; p < a.length; p++) if (o._keys[p] !== t && SameValue(o._keys[p], e)) return o._values[p] = r, o;
            var n = {"[[Key]]": e, "[[Value]]": r};
            return o._keys.push(n["[[Key]]"]), o._values.push(n["[[Value]]"]), o
        }), "name" in r || Object.defineProperty(r, "name", {
            configurable: !0,
            enumerable: !1,
            writable: !1,
            value: "WeakMap"
        });
        try {
            CreateMethodProperty(e, "WeakMap", r)
        } catch (o) {
            e.WeakMap = r
        }
    }(this);
    !function (e) {
        var t = Symbol("undef"), r = function a() {
            if (!(this instanceof a)) throw new TypeError('Constructor WeakSet requires "new"');
            var e = OrdinaryCreateFromConstructor(this, a.prototype, {_values: [], _size: 0, _es6WeakSet: !0}),
                t = arguments.length > 0 ? arguments[0] : undefined;
            if (null === t || t === undefined) return e;
            var r = Get(e, "add");
            if (!IsCallable(r)) throw new TypeError("WeakSet.prototype.add is not a function");
            try {
                for (var o = GetIterator(t); ;) {
                    var n = IteratorStep(o);
                    if (!1 === n) return e;
                    var l = IteratorValue(n);
                    try {
                        Call(r, e, [l])
                    } catch (c) {
                        return IteratorClose(o, c)
                    }
                }
            } catch (c) {
                if (IsArray(t) || "[object Arguments]" === Object.prototype.toString.call(t) || t.callee) {
                    var i, p = t.length;
                    for (i = 0; i < p; i++) Call(r, e, [t[i]])
                }
            }
            return e
        };
        Object.defineProperty(r, "prototype", {
            configurable: !1,
            enumerable: !1,
            writable: !1,
            value: {}
        }), CreateMethodProperty(r.prototype, "add", function n(e) {
            var r = this;
            if ("object" !== Type(r)) throw new TypeError("Method WeakSet.prototype.add called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakSet) throw new TypeError("Method WeakSet.prototype.add called on incompatible receiver " + Object.prototype.toString.call(r));
            if ("object" !== Type(e)) throw new TypeError("Invalid value used in weak set");
            for (var o = r._values, a = 0; a < o.length; a++) {
                var n = o[a];
                if (n !== t && SameValueZero(n, e)) return r
            }
            return r._values.push(e), r
        }), CreateMethodProperty(r.prototype, "constructor", r), CreateMethodProperty(r.prototype, "delete", function (e) {
            var r = this;
            if ("object" !== Type(r)) throw new TypeError("Method WeakSet.prototype.delete called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakSet) throw new TypeError("Method WeakSet.prototype.delete called on incompatible receiver " + Object.prototype.toString.call(r));
            if ("object" !== Type(e)) return !1;
            for (var o = r._values, a = 0; a < o.length; a++) {
                var n = o[a];
                if (n !== t && SameValueZero(n, e)) return o[a] = t, !0
            }
            return !1
        }), CreateMethodProperty(r.prototype, "has", function l(e) {
            var r = this;
            if ("object" !== Type(r)) throw new TypeError("Method WeakSet.prototype.has called on incompatible receiver " + Object.prototype.toString.call(r));
            if (!0 !== r._es6WeakSet) throw new TypeError("Method WeakSet.prototype.has called on incompatible receiver " + Object.prototype.toString.call(r));
            var o = r._values;
            if ("object" !== Type(e)) return !1;
            for (var a = 0; a < o.length; a++) {
                var n = o[a];
                if (n !== t && SameValueZero(n, e)) return !0
            }
            return !1
        }), "name" in r || Object.defineProperty(r, "name", {
            configurable: !0,
            enumerable: !1,
            writable: !1,
            value: "WeakSet"
        });
        try {
            CreateMethodProperty(e, "WeakSet", r)
        } catch (o) {
            e.WeakSet = r
        }
    }(this);
}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});// export default result
// fetch polyfill
(function (global, factory) {
    if (!global) global = window;
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.WHATWGFetch = {})));
}(this, (function (exports) {
    'use strict';

    var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
            'FileReader' in self &&
            'Blob' in self &&
            (function () {
                try {
                    new Blob();
                    return true
                } catch (e) {
                    return false
                }
            })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
    };

    function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
    }

    if (support.arrayBuffer) {
        var viewClasses = [
            '[object Int8Array]',
            '[object Uint8Array]',
            '[object Uint8ClampedArray]',
            '[object Int16Array]',
            '[object Uint16Array]',
            '[object Int32Array]',
            '[object Uint32Array]',
            '[object Float32Array]',
            '[object Float64Array]'
        ];

        var isArrayBufferView =
            ArrayBuffer.isView ||
            function (obj) {
                return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
            };
    }

    function normalizeName(name) {
        if (typeof name !== 'string') {
            name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
    }

    function normalizeValue(value) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        return value
    }

    // Build a destructive iterator for the value list
    function iteratorFor(items) {
        var iterator = {
            next: function () {
                var value = items.shift();
                return {done: value === undefined, value: value}
            }
        };

        if (support.iterable) {
            iterator[Symbol.iterator] = function () {
                return iterator
            };
        }

        return iterator
    }

    function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
                this.append(name, value);
            }, this);
        } else if (Array.isArray(headers)) {
            headers.forEach(function (header) {
                this.append(header[0], header[1]);
            }, this);
        } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
                this.append(name, headers[name]);
            }, this);
        }
    }

    Headers.prototype.append = function (name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
    };

    Headers.prototype['delete'] = function (name) {
        delete this.map[normalizeName(name)];
    };

    Headers.prototype.get = function (name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
    };

    Headers.prototype.has = function (name) {
        return this.map.hasOwnProperty(normalizeName(name))
    };

    Headers.prototype.set = function (name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
    };

    Headers.prototype.forEach = function (callback, thisArg) {
        for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
            }
        }
    };

    Headers.prototype.keys = function () {
        var items = [];
        this.forEach(function (value, name) {
            items.push(name);
        });
        return iteratorFor(items)
    };

    Headers.prototype.values = function () {
        var items = [];
        this.forEach(function (value) {
            items.push(value);
        });
        return iteratorFor(items)
    };

    Headers.prototype.entries = function () {
        var items = [];
        this.forEach(function (value, name) {
            items.push([name, value]);
        });
        return iteratorFor(items)
    };

    if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }

    function consumed(body) {
        if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
    }

    function fileReaderReady(reader) {
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(reader.error);
            };
        })
    }

    function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
    }

    function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
    }

    function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
    }

    function bufferClone(buf) {
        if (buf.slice) {
            return buf.slice(0)
        } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer
        }
    }

    function Body() {
        this.bodyUsed = false;

        this._initBody = function (body) {
            this._bodyInit = body;
            if (!body) {
                this._bodyText = '';
            } else if (typeof body === 'string') {
                this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                // IE 10-11 can't handle a DataView body.
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
            } else {
                this._bodyText = body = Object.prototype.toString.call(body);
            }

            if (!this.headers.get('content-type')) {
                if (typeof body === 'string') {
                    this.headers.set('content-type', 'text/plain;charset=UTF-8');
                } else if (this._bodyBlob && this._bodyBlob.type) {
                    this.headers.set('content-type', this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                }
            }
        };

        if (support.blob) {
            this.blob = function () {
                var rejected = consumed(this);
                if (rejected) {
                    return rejected
                }

                if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob)
                } else if (this._bodyArrayBuffer) {
                    return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob')
                } else {
                    return Promise.resolve(new Blob([this._bodyText]))
                }
            };

            this.arrayBuffer = function () {
                if (this._bodyArrayBuffer) {
                    return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                } else {
                    return this.blob().then(readBlobAsArrayBuffer)
                }
            };
        }

        this.text = function () {
            var rejected = consumed(this);
            if (rejected) {
                return rejected
            }

            if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
            } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as text')
            } else {
                return Promise.resolve(this._bodyText)
            }
        };

        if (support.formData) {
            this.formData = function () {
                return this.text().then(decode)
            };
        }

        this.json = function () {
            return this.text().then(JSON.parse)
        };

        return this
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

    function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
    }

    function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
            if (input.bodyUsed) {
                throw new TypeError('Already read')
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
                this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
            }
        } else {
            this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
    }

    Request.prototype.clone = function () {
        return new Request(this, {body: this._bodyInit})
    };

    function decode(body) {
        var form = new FormData();
        body
            .trim()
            .split('&')
            .forEach(function (bytes) {
                if (bytes) {
                    var split = bytes.split('=');
                    var name = split.shift().replace(/\+/g, ' ');
                    var value = split.join('=').replace(/\+/g, ' ');
                    form.append(decodeURIComponent(name), decodeURIComponent(value));
                }
            });
        return form
    }

    function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
            var parts = line.split(':');
            var key = parts.shift().trim();
            if (key) {
                var value = parts.join(':').trim();
                headers.append(key, value);
            }
        });
        return headers
    }

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
        if (!options) {
            options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
    }

    Body.call(Response.prototype);

    Response.prototype.clone = function () {
        return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        })
    };

    Response.error = function () {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function (url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
    };

    exports.DOMException = self.DOMException;
    try {
        new exports.DOMException();
    } catch (err) {
        exports.DOMException = function (message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
    }

    function fetch(input, init) {
        return new Promise(function (resolve, reject) {
            var request = new Request(input, init);

            if (request.signal && request.signal.aborted) {
                return reject(new exports.DOMException('Aborted', 'AbortError'))
            }

            var xhr = new XMLHttpRequest();

            function abortXhr() {
                xhr.abort();
            }

            xhr.onload = function () {
                var options = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                };
                options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                var body = 'response' in xhr ? xhr.response : xhr.responseText;
                resolve(new Response(body, options));
            };

            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };

            xhr.ontimeout = function () {
                reject(new TypeError('Network request failed'));
            };

            xhr.onabort = function () {
                reject(new exports.DOMException('Aborted', 'AbortError'));
            };

            xhr.open(request.method, request.url, true);

            if (request.credentials === 'include') {
                xhr.withCredentials = true;
            } else if (request.credentials === 'omit') {
                xhr.withCredentials = false;
            }

            if ('responseType' in xhr && support.blob) {
                xhr.responseType = 'blob';
            }

            request.headers.forEach(function (value, name) {
                xhr.setRequestHeader(name, value);
            });

            if (request.signal) {
                request.signal.addEventListener('abort', abortXhr);

                xhr.onreadystatechange = function () {
                    // DONE (success or failure)
                    if (xhr.readyState === 4) {
                        request.signal.removeEventListener('abort', abortXhr);
                    }
                };
            }

            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
    }

    fetch.polyfill = true;

    if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
    }

    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.fetch = fetch;

    Object.defineProperty(exports, '__esModule', {value: true});

})));
