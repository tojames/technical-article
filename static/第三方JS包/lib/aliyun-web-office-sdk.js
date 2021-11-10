!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = e || self).aliyun = {}))
})(this, function (e) {
  'use strict'
  var t = function () {
    return (t =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var a in (t = arguments[n])) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a])
        return e
      }).apply(this, arguments)
  }
  function n(e, t, n, r) {
    return new (n || (n = Promise))(function (a, i) {
      function o(e) {
        try {
          c(r.next(e))
        } catch (e) {
          i(e)
        }
      }
      function s(e) {
        try {
          c(r.throw(e))
        } catch (e) {
          i(e)
        }
      }
      function c(e) {
        var t
        e.done
          ? a(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t)
                })).then(o, s)
      }
      c((r = r.apply(e, t || [])).next())
    })
  }
  function r(e, t) {
    var n,
      r,
      a,
      i,
      o = {
        label: 0,
        sent: function () {
          if (1 & a[0]) throw a[1]
          return a[1]
        },
        trys: [],
        ops: [],
      }
    return (
      (i = { next: s(0), throw: s(1), return: s(2) }),
      'function' == typeof Symbol &&
        (i[Symbol.iterator] = function () {
          return this
        }),
      i
    )
    function s(i) {
      return function (s) {
        return (function (i) {
          if (n) throw new TypeError('Generator is already executing.')
          for (; o; )
            try {
              if (((n = 1), r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done))
                return a
              switch (((r = 0), a && (i = [2 & i[0], a.value]), i[0])) {
                case 0:
                case 1:
                  a = i
                  break
                case 4:
                  return o.label++, { value: i[1], done: !1 }
                case 5:
                  o.label++, (r = i[1]), (i = [0])
                  continue
                case 7:
                  ;(i = o.ops.pop()), o.trys.pop()
                  continue
                default:
                  if (!(a = (a = o.trys).length > 0 && a[a.length - 1]) && (6 === i[0] || 2 === i[0])) {
                    o = 0
                    continue
                  }
                  if (3 === i[0] && (!a || (i[1] > a[0] && i[1] < a[3]))) {
                    o.label = i[1]
                    break
                  }
                  if (6 === i[0] && o.label < a[1]) {
                    ;(o.label = a[1]), (a = i)
                    break
                  }
                  if (a && o.label < a[2]) {
                    ;(o.label = a[2]), o.ops.push(i)
                    break
                  }
                  a[2] && o.ops.pop(), o.trys.pop()
                  continue
              }
              i = t.call(e, o)
            } catch (e) {
              ;(i = [6, e]), (r = 0)
            } finally {
              n = a = 0
            }
          if (5 & i[0]) throw i[1]
          return { value: i[0] ? i[1] : void 0, done: !0 }
        })([i, s])
      }
    }
  }
  var a = (function () {
    function e() {}
    return (
      (e.add = function (t) {
        e.HANDLE_LIST.push(t), window.addEventListener('message', t, !1)
      }),
      (e.remove = function (t) {
        var n = e.HANDLE_LIST.indexOf(t)
        n >= 0 && e.HANDLE_LIST.splice(n, 1), window.removeEventListener('message', t, !1)
      }),
      (e.empty = function () {
        for (; e.HANDLE_LIST.length; ) window.removeEventListener('message', e.HANDLE_LIST.shift(), !1)
      }),
      (e.parse = function (e) {
        try {
          return 'object' == typeof e ? e : e ? JSON.parse(e) : e
        } catch (t) {
          return console.log('Message.parse Error:', t), e
        }
      }),
      (e.HANDLE_LIST = []),
      e
    )
  })()
  function i(e) {
    return '[object Function]' === {}.toString.call(e)
  }
  var o,
    s,
    c,
    u,
    l = { origin: '' }
  function d(e, t) {
    l[e] = t
  }
  function f(e) {
    return l[e]
  }
  function p(e) {
    var t = f('origin')
    return (
      !!(function (e, t) {
        return e !== t && (e.replace(/www\./i, '').toLowerCase() !== t.replace(/www\./i, '').toLowerCase() || (e.match('www.') ? void 0 : (d('origin', t), !1)))
      })(t, e.origin) && (console.warn('postMessage 鍩熷悕妫€鏌ヤ笉閫氳繃', { safeOrigin: t, eventOrigin: e.origin }), !0)
    )
  }
  !(function (e) {
    ;(e.unknown = 'unknown'), (e.spreadsheet = 's'), (e.writer = 'w'), (e.presentation = 'p'), (e.pdf = 'f')
  })(o || (o = {})),
    (function (e) {
      ;(e.wps = 'w'), (e.et = 's'), (e.presentation = 'p'), (e.pdf = 'f')
    })(s || (s = {})),
    (function (e) {
      ;(e.nomal = 'nomal'), (e.simple = 'simple')
    })(c || (c = {})),
    (function (e) {
      ;(e[(e.requestFullscreen = 1)] = 'requestFullscreen'), (e[(e.exitFullscreen = 0)] = 'exitFullscreen')
    })(u || (u = {}))
  var v,
    b,
    h,
    m =
      ((v = 0),
      function () {
        return (v += 1)
      }),
    g = function (e, t, n) {
      void 0 === n && (n = !0)
      var r = t
      if (!b) {
        var a = function e(t) {
          var n = t.clientHeight
          var r = t.clientWidth
          0 !== n || 0 !== r || h
            ? (0 === n && 0 === r) || !h || (h.disconnect(), (h = null))
            : window.ResizeObserver &&
              (h = new ResizeObserver(function (n) {
                e(t)
              })).observe(t)
          b.style.cssText += 'height: ' + n + 'px; width: ' + r + 'px'
        }.bind(null, r)
        ;(b = document.createElement('iframe')).classList.add('web-office-iframe')
        var i = {
          id: 'office-iframe',
          src: e,
          scrolling: 'no',
          frameborder: '0',
          allowfullscreen: 'allowfullscreen',
          webkitallowfullscreen: 'true',
          mozallowfullscreen: 'true',
        }
        for (var o in (r
          ? ((i.style = 'width: ' + r.clientWidth + 'px; height: ' + r.clientHeight + 'px;'), n && window.addEventListener('resize', a))
          : ((r = document.createElement('div')).classList.add('web-office-default-container'),
            (function (e) {
              var t = document.createElement('style')
              document.head.appendChild(t)
              var n = t.sheet
              n.insertRule(e, n.cssRules.length)
            })('.web-office-default-container {position: absolute; padding: 0;  margin: 0; width: 100%; height: 100%; left: 0; top: 0;}'),
            document.body.appendChild(r),
            (i.style = 'position: fixed; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;')),
        i))
          b.setAttribute(o, i[o])
        r.appendChild(b),
          (b.destroy = function () {
            b.parentNode.removeChild(b), (b = null), window.removeEventListener('resize', a), h && (h.disconnect(), (h = null))
          })
      }
      return b
    }
  var w = function (e) {
    g().contentWindow.postMessage(JSON.stringify(e), f('origin'))
  }
  function y(e, t, n) {
    return new Promise(function (r) {
      var i = m(),
        o = function (e) {
          if (!p(e)) {
            var t = a.parse(e.data)
            t.eventName === n && t.msgId === i && (r(t.data), a.remove(o))
          }
        }
      a.add(o), w({ data: e, msgId: i, eventName: t })
    })
  }
  var k = function (e) {
      return y(e, 'wps.jssdk.api', 'wps.api.reply')
    },
    j = function (e) {
      return y(e, 'api.basic', 'api.basic.reply')
    },
    I = { idMap: {} }
  function O(e) {
    return n(this, void 0, void 0, function () {
      var t, n, i, o, s, c, u, l, d, f
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return p(e)
              ? [2]
              : ((t = a.parse(e.data)),
                (n = t.eventName),
                (i = t.callbackId),
                (o = t.data),
                i && (s = I.idMap[i])
                  ? ((c = s.split(':')),
                    (u = c[0]),
                    (l = c[1]),
                    'api.callback' === n && I[u] && I[u][l] ? [4, (f = I[u][l]).callback.apply(f, o.args)] : [3, 2])
                  : [3, 2])
          case 1:
            ;(d = r.sent()), w({ result: d, callbackId: i, eventName: 'api.callback.reply' }), (r.label = 2)
          case 2:
            return [2]
        }
      })
    })
  }
  var x = function (e) {
      return n(void 0, void 0, void 0, function () {
        function t() {
          return Object.keys(I.idMap).find(function (e) {
            return I.idMap[e] === i + ':' + n
          })
        }
        var n, i, o, s, c, u, l, d, f
        return r(this, function (r) {
          switch (r.label) {
            case 0:
              return (n = e.prop), (i = e.parentObjId), [4, C([(o = e.value)])]
            case 1:
              return (
                (s = r.sent()),
                (c = s[0]),
                (u = s[1]),
                (e.value = c[0]),
                (l = Object.keys(u)[0]),
                (d = I[i]),
                null === o &&
                  d &&
                  d[n] &&
                  ((f = t()) && delete I.idMap[f], delete d[n], Object.keys(d).length || delete I[i], Object.keys(I.idMap).length || a.remove(O)),
                l &&
                  (Object.keys(I.idMap).length || a.add(O),
                  I[i] || (I[i] = {}),
                  (I[i][n] = { callbackId: l, callback: u[l] }),
                  (f = t()) && delete I.idMap[f],
                  (I.idMap[l] = i + ':' + n)),
                [2]
              )
          }
        })
      })
    },
    _ = function (e, i, o, s) {
      return n(void 0, void 0, void 0, function () {
        var c, u, l, d, f, v, b, h
        return r(this, function (g) {
          switch (g.label) {
            case 0:
              return (
                (c = m()),
                (d = new Promise(function (e, t) {
                  ;(u = e), (l = t)
                })),
                (f = {}),
                i.args ? [4, C(i.args)] : [3, 2]
              )
            case 1:
              ;(v = g.sent()), (b = v[0]), (h = v[1]), (i.args = b), (f = h), (g.label = 2)
            case 2:
              return 'api.setter' !== e ? [3, 4] : [4, x(i)]
            case 3:
              g.sent(), (g.label = 4)
            case 4:
              return (
                (function (e) {
                  var n = e[0],
                    r = e[1]
                  'function' == typeof (n = t({}, n)).data && (n.data = n.data())
                  r(), w(n)
                })([
                  { eventName: e, data: i, msgId: c },
                  function () {
                    var t = this,
                      i = function (d) {
                        return n(t, void 0, void 0, function () {
                          var t, n, v
                          return r(this, function (r) {
                            switch (r.label) {
                              case 0:
                                return p(d)
                                  ? [2]
                                  : 'api.callback' === (t = a.parse(d.data)).eventName && t.callbackId && f[t.callbackId]
                                  ? [4, f[t.callbackId].apply(f, t.data.args)]
                                  : [3, 2]
                              case 1:
                                ;(n = r.sent()), w({ result: n, eventName: 'api.callback.reply', callbackId: t.callbackId }), (r.label = 2)
                              case 2:
                                return (
                                  t.eventName === e + '.reply' &&
                                    t.msgId === c &&
                                    (t.error ? (((v = new Error('')).stack = t.error + '\n' + o), s && s(), l(v)) : u(t.result), a.remove(i)),
                                  [2]
                                )
                            }
                          })
                        })
                      }
                    return a.add(i), d
                  },
                ]),
                [2, d]
              )
          }
        })
      })
    }
  function C(e) {
    return n(this, void 0, void 0, function () {
      var t, n, a, i, o, s, c, u, l, d, f
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            ;(t = {}), (n = []), (a = e.slice(0)), (r.label = 1)
          case 1:
            return a.length ? ((i = void 0), [4, a.shift()]) : [3, 13]
          case 2:
            return (o = r.sent()) && o.done ? [4, o.done()] : [3, 4]
          case 3:
            r.sent(), (r.label = 4)
          case 4:
            if (
              !(function (e) {
                if (!e) return !1
                for (var t = e; null !== Object.getPrototypeOf(t); ) t = Object.getPrototypeOf(t)
                return Object.getPrototypeOf(e) === t
              })(i)
            )
              return [3, 11]
            for (c in ((i = {}), (s = []), o)) s.push(c)
            ;(u = 0), (r.label = 5)
          case 5:
            return u < s.length ? ((l = s[u]), (d = o[l]), /^[A-Z]/.test(l) ? (d && d.done ? [4, d.done()] : [3, 7]) : [3, 8]) : [3, 10]
          case 6:
            r.sent(), (r.label = 7)
          case 7:
            d && d.objId ? (d = { objId: d.objId }) : 'function' == typeof d && ((f = m()), (t[f] = d), (d = { callbackId: f })), (r.label = 8)
          case 8:
            ;(i[l] = d), (r.label = 9)
          case 9:
            return u++, [3, 5]
          case 10:
            return [3, 12]
          case 11:
            o && o.objId ? (i = { objId: o.objId }) : 'function' == typeof o && void 0 === o.objId ? ((f = m()), (t[f] = o), (i = { callbackId: f })) : (i = o),
              (r.label = 12)
          case 12:
            return n.push(i), [3, 1]
          case 13:
            return [2, [n, t]]
        }
      })
    })
  }
  var E = function (e, n) {
      void 0 === n && (n = !0)
      var r = t({}, e),
        a = r.headers,
        i = void 0 === a ? {} : a,
        o = r.subscriptions,
        s = void 0 === o ? {} : o,
        u = r.mode,
        l = void 0 === u ? c.nomal : u,
        d = r.commonOptions,
        f = i.backBtn,
        p = void 0 === f ? {} : f,
        v = i.shareBtn,
        b = void 0 === v ? {} : v,
        h = i.otherMenuBtn,
        m = void 0 === h ? {} : h,
        g = function (e, t) {
          e.subscribe && 'function' == typeof e.subscribe && ((e.callback = t), (s[t] = e.subscribe), n && delete e.subscribe)
        }
      if ((g(p, 'wpsconfig_back_btn'), g(b, 'wpsconfig_share_btn'), g(m, 'wpsconfig_other_menu_btn'), m.items && Array.isArray(m.items))) {
        var w = []
        m.items.forEach(function (e, t) {
          switch ((void 0 === e && (e = {}), e.type)) {
            case 'export_img':
              ;(e.type = 1), (e.callback = 'export_img')
              break
            case 'export_pdf':
              ;(e.type = 1), (e.callback = 'export_pdf')
              break
            case 'save_version':
              ;(e.type = 1), (e.callback = 'save_version')
              break
            case 'about_wps':
              ;(e.type = 1), (e.callback = 'about_wps')
              break
            case 'split_line':
              e.type = 2
              break
            case 'custom':
              ;(e.type = 3), g(e, 'wpsconfig_other_menu_btn_' + t), w.push(e)
          }
        }),
          w.length && (L || P) && (m.items = w)
      }
      r.url = r.url || r.wpsUrl
      var y = []
      if (
        ((l === c.simple || (d && !1 === d.isShowTopArea)) && y.push('simple', 'hidecmb'),
        r.debug && y.push('debugger'),
        r.url && y.length && (r.url = r.url + (r.url.indexOf('?') >= 0 ? '&' : '?') + y.join('&')),
        d &&
          (d.isParentFullscreen || d.isBrowserViewFullscreen) &&
          (document.addEventListener('fullscreenchange', F),
          document.addEventListener('webkitfullscreenchange', F),
          document.addEventListener('mozfullscreenchange', F)),
        r.wordOptions && (r.wpsOptions = r.wordOptions),
        r.excelOptions && (r.etOptions = r.excelOptions),
        r.pptOptions && (r.wppOptions = r.pptOptions),
        'object' == typeof s.print)
      ) {
        var k = 'wpsconfig_print'
        'function' == typeof s.print.subscribe &&
          ((s[k] = s.print.subscribe), (r.print = { callback: k }), void 0 !== s.print.custom && (r.print.custom = s.print.custom)),
          delete s.print
      }
      'function' == typeof s.exportPdf && ((s[(k = 'wpsconfig_export_pdf')] = s.exportPdf), (r.exportPdf = { callback: k }), delete s.exportPdf)
      return r.commandBars && N(r.commandBars, !1), t(t({}, r), { subscriptions: s })
    },
    S = function (e) {
      void 0 === e && (e = '')
      var t = ''
      if (!t && e) {
        var n = e.toLowerCase()
        ;-1 !== n.indexOf('/office/s/') && (t = o.spreadsheet),
          -1 !== n.indexOf('/office/w/') && (t = o.writer),
          -1 !== n.indexOf('/office/p/') && (t = o.presentation),
          -1 !== n.indexOf('/office/f/') && (t = o.pdf)
      }
      if (!t) {
        var r = e.match(/[\?&]type=([a-z]+)/) || []
        t = s[r[1]] || ''
      }
      return t
    }
  function N(e, t) {
    void 0 === t && (t = !0)
    var n = e.map(function (e) {
      var t = e.attributes
      if (!Array.isArray(t)) {
        var n = []
        for (var r in t)
          if (t.hasOwnProperty(r)) {
            var a = { name: r, value: t[r] }
            n.push(a)
          }
        e.attributes = n
      }
      return e
    })
    return t && w({ data: n, eventName: 'setCommandBars' }), n
  }
  var T = window.navigator.userAgent.toLowerCase(),
    L = /Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(T),
    P = (function () {
      try {
        return -1 !== window._parent.location.search.indexOf('from=wxminiprogram')
      } catch (e) {
        return !1
      }
    })()
  function F() {
    var e = { status: u.requestFullscreen },
      t = document,
      n = t.fullscreenElement || t.webkitFullscreenElement || t.mozFullScreenElement
    ;(e.status = n ? u.requestFullscreen : u.exitFullscreen), w({ data: e, eventName: 'fullscreenchange' })
  }
  var A = function () {
    I.idMap = {}
  }
  var D = 0,
    B = new Set()
  function V(e) {
    return (
      (D += 1),
      !e &&
        (function (e) {
          B.forEach(function (t) {
            return t(e)
          })
        })(D),
      D
    )
  }
  function H() {
    var e = new Error('')
    return (e.stack || e.message || '').split('\n').slice(2).join('\n')
  }
  function M(e, i) {
    var s,
      c = this,
      u = i.Events,
      l = i.Enum,
      d = i.Props,
      f = d[0],
      v = d[1],
      b = { objId: D }
    switch (
      ((function e(n, r, a) {
        var i = r.slice(0)
        var o = function () {
          var r = i.shift()
          !r.alias && ~R.indexOf(r.prop) && i.push(t(t({}, r), { alias: r.prop + 'Async' })),
            Object.defineProperty(n, r.alias || r.prop, {
              get: function () {
                var i = this,
                  o = 1 === r.cache,
                  s = o && this['__' + r.prop + 'CacheValue']
                if (!s) {
                  var c = H(),
                    u = V(o),
                    l = function () {
                      for (var e, i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o]
                      void 0 !== r.caller
                        ? (function e(n, r, a) {
                            var i = r.slice(0)
                            var o = function () {
                              var r = i.shift()
                              !r.alias && ~R.indexOf(r.prop) && i.push(t(t({}, r), { alias: r.prop + 'Async' })),
                                Object.defineProperty(n, r.alias || r.prop, {
                                  get: function () {
                                    var t = this,
                                      i = 1 === r.cache,
                                      o = i && this['__' + r.prop + 'CacheValue']
                                    if (!o) {
                                      var s = H(),
                                        c = V(i),
                                        u = function () {
                                          for (var t, i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o]
                                          void 0 !== r.caller ? e((t = { objId: V() }), a[r.caller], a) : (t = {})
                                          return q(u, t, 'api.caller', { obj: u, args: i, parentObjId: n.objId, objId: t.objId, prop: r.prop }, s), t
                                        }
                                      return (
                                        (u.objId = -1),
                                        void 0 !== r.getter && ((u.objId = c), e(u, a[r.getter], a)),
                                        q(n, u, 'api.getter', { parentObjId: n.objId, objId: u.objId, prop: r.prop }, s, function () {
                                          delete t['__' + r.prop + 'CacheValue']
                                        }),
                                        i && (this['__' + r.prop + 'CacheValue'] = u),
                                        u
                                      )
                                    }
                                    return o
                                  },
                                  set: function (e) {
                                    var t = H()
                                    return q(n, {}, 'api.setter', { value: e, parentObjId: n.objId, objId: -1, prop: r.prop }, t)
                                  },
                                })
                            }
                            for (; i.length; ) o()
                          })((e = { objId: V() }), a[r.caller], a)
                        : (e = {})
                      return q(l, e, 'api.caller', { obj: l, args: i, parentObjId: n.objId, objId: e.objId, prop: r.prop }, c), e
                    }
                  return (
                    (l.objId = -1),
                    void 0 !== r.getter && ((l.objId = u), e(l, a[r.getter], a)),
                    q(n, l, 'api.getter', { parentObjId: n.objId, objId: l.objId, prop: r.prop }, c, function () {
                      delete i['__' + r.prop + 'CacheValue']
                    }),
                    o && (this['__' + r.prop + 'CacheValue'] = l),
                    l
                  )
                }
                return s
              },
              set: function (e) {
                var t = H()
                return q(n, {}, 'api.setter', { value: e, parentObjId: n.objId, objId: -1, prop: r.prop }, t)
              },
            })
        }
        for (; i.length; ) o()
      })(b, f, v),
      (b.Events = u),
      (b.Enum = l),
      (e.Enum = b.Enum),
      (e.Events = b.Events),
      (e.Props = d),
      S(e.url))
    ) {
      case o.writer:
        e.WordApplication = e.WpsApplication = function () {
          return b
        }
        break
      case o.spreadsheet:
        e.ExcelApplication = e.EtApplication = function () {
          return b
        }
        break
      case o.presentation:
        e.PPTApplication = e.WppApplication = function () {
          return b
        }
        break
      case o.pdf:
        e.PDFApplication = function () {
          return b
        }
    }
    ;(e.Application = b),
      (e.Free = function (e) {
        return _('api.free', { objId: e }, '')
      }),
      (e.Stack = b.Stack =
        ((s = function (t) {
          e && e.Free(t)
        }),
        function () {
          var e = [],
            t = function (t) {
              e.push(t)
            }
          return (
            B.add(t),
            {
              End: function () {
                s(e), B.delete(t)
              },
            }
          )
        }))
    var h = {}
    a.add(function (e) {
      return n(c, void 0, void 0, function () {
        var t, n, i, o, s
        return r(this, function (r) {
          switch (r.label) {
            case 0:
              return p(e)
                ? [2]
                : 'api.event' === (t = a.parse(e.data)).eventName && t.data
                ? ((n = t.data), (i = n.eventName), (o = n.data), (s = h[i]) ? [4, s(o)] : [3, 2])
                : [3, 2]
            case 1:
              r.sent(), (r.label = 2)
            case 2:
              return [2]
          }
        })
      })
    }),
      (b.Sub = {})
    var m = function (e) {
      var t = u[e]
      Object.defineProperty(b.Sub, t, {
        set: function (e) {
          ;(h[t] = e), w({ eventName: 'api.event.register', data: { eventName: t, register: !!e, objId: (D += 1) } })
        },
      })
    }
    for (var g in u) m(g)
  }
  var R = ['ExportAsFixedFormat', 'GetOperatorsInfo', 'ImportDataIntoFields', 'ReplaceText', 'ReplaceBookmark', 'GetBookmarkText', 'GetComments']
  function z(e, n, r) {
    var a = n.slice(0)
    var i = function () {
      var n = a.shift()
      if (!n.alias && ~R.indexOf(n.prop)) {
        a.push(t(t({}, n), { alias: n.prop + 'Async' }))
      }
      Object.defineProperty(e, n.alias || n.prop, {
        get: function () {
          var t = this
          var a = n.cache === 1
          var i = a && this['__' + n.prop + 'CacheValue']
          if (!i) {
            var o = H()
            var s = V(a)
            var c = function () {
              for (var t = [], a = 0, i; a < arguments.length; a++) {
                t[a] = arguments[a]
              }
              if (n.caller !== undefined) {
                i = { objId: V() }
                z(i, r[n.caller], r)
              } else {
                i = {}
              }
              return q(u, i, 'api.caller', { obj: u, args: t, parentObjId: e.objId, objId: i.objId, prop: n.prop }, o), i
            }
            var u = c
            u.objId = -1
            if (n.getter !== undefined) {
              u.objId = s
              z(u, r[n.getter], r)
            }
            q(e, u, 'api.getter', { parentObjId: e.objId, objId: u.objId, prop: n.prop }, o, function () {
              delete t['__' + n.prop + 'CacheValue']
            })
            if (a) {
              this['__' + n.prop + 'CacheValue'] = u
            }
            return u
          }
          return i
        },
        set: function (t) {
          var r = H()
          return q(e, {}, 'api.setter', { value: t, parentObjId: e.objId, objId: -1, prop: n.prop }, r)
        },
      })
    }
    while (a.length) {
      i()
    }
  }
  function q(e, t, n, r, a, i) {
    var o,
      s = (e.done ? e.done() : Promise.resolve()).then(function () {
        return o || (o = _(n, r, a, i)), o
      })
    ;(t.done = function () {
      return s
    }),
      (t.then = function (e, n) {
        return r.objId >= 0
          ? ((t.then = null),
            (t.catch = null),
            s
              .then(function () {
                e(t)
              })
              .catch(function (e) {
                return n(e)
              }))
          : s.then(e, n)
      }),
      (t.catch = function (e) {
        return s.catch(e)
      }),
      (t.Destroy = function () {
        return _('api.free', { objId: t.objId }, '')
      })
  }
  var W = [],
    G = null,
    J = {
      fileOpen: 'fileOpen',
      tabSwitch: 'tabSwitch',
      fileSaved: 'fileSaved',
      fileStatus: 'fileStatus',
      fullscreenChange: 'fullscreenChange',
      error: 'error',
      stage: 'stage',
    },
    U = { getToken: 'api.getToken', onToast: 'event.toast', onHyperLinkOpen: 'event.hyperLinkOpen', getClipboardData: 'api.getClipboardData' }
  function K(e, i, o, s, c, u, l) {
    var d = this
    void 0 === o && (o = {})
    a.add(function (f) {
      return n(d, void 0, void 0, function () {
        var n, d, v, b, h, m, g, y, k, j, I, O, x, _, C, E, S, N, T
        return r(this, function (r) {
          switch (r.label) {
            case 0:
              return p(f)
                ? [2]
                : ((n = a.parse(f.data)),
                  (d = n.eventName),
                  (v = void 0 === d ? '' : d),
                  (b = n.data),
                  (h = void 0 === b ? null : b),
                  (m = n.url),
                  (g = void 0 === m ? null : m),
                  -1 !== ['wps.jssdk.api'].indexOf(v)
                    ? [2]
                    : 'ready' !== v
                    ? [3, 1]
                    : (w({ eventName: 'setConfig', data: t(t({}, o), { version: e.version }) }),
                      e.tokenData && e.setToken(t(t({}, e.tokenData), { hasRefreshTokenConfig: !!o.refreshToken })),
                      c.apiReadySended && w({ eventName: 'api.ready' }),
                      W.forEach(function (t) {
                        return e.on(t.eventName, t.handle)
                      }),
                      (e.iframeReady = !0),
                      [3, 17]))
            case 1:
              return 'error' !== v ? [3, 2] : (i.emit(J.error, h), [3, 17])
            case 2:
              return 'open.result' !== v
                ? [3, 3]
                : (void 0 !== (null === (S = null == h ? void 0 : h.fileInfo) || void 0 === S ? void 0 : S.officeVersion) &&
                    ((e.mainVersion = h.fileInfo.officeVersion), console.log('aliyun Main Version: V' + e.mainVersion)),
                  i.emit(J.fileOpen, h),
                  [3, 17])
            case 3:
              return 'file.saved' !== v ? [3, 4] : (i.emit(J.fileStatus, h), i.emit(J.fileSaved, h), [3, 17])
            case 4:
              return 'tab.switch' !== v ? [3, 5] : (i.emit(J.tabSwitch, h), [3, 17])
            case 5:
              return 'api.scroll' !== v ? [3, 6] : (window.scrollTo(h.x, h.y), [3, 17])
            case 6:
              if (v !== U.getToken) return [3, 11]
              ;(y = { token: !1 }), (r.label = 7)
            case 7:
              return r.trys.push([7, 9, , 10]), [4, c.refreshToken()]
            case 8:
              return (y = r.sent()), [3, 10]
            case 9:
              return (k = r.sent()), console.error('refreshToken: ' + (k || 'fail to get')), [3, 10]
            case 10:
              return w({ eventName: U.getToken + '.reply', data: y }), [3, 17]
            case 11:
              if (v !== U.getClipboardData) return [3, 16]
              ;(j = { text: '', html: '' }), (r.label = 12)
            case 12:
              return r.trys.push([12, 14, , 15]), [4, c.getClipboardData()]
            case 13:
              return (j = r.sent()), [3, 15]
            case 14:
              return (I = r.sent()), console.error('getClipboardData: ' + (I || 'fail to get')), [3, 15]
            case 15:
              return w({ eventName: U.getClipboardData + '.reply', data: j }), [3, 17]
            case 16:
              v === U.onToast
                ? c.onToast(h)
                : v === U.onHyperLinkOpen
                ? c.onHyperLinkOpen(h)
                : 'stage' === v
                ? i.emit(J.stage, h)
                : 'event.callback' === v
                ? ((O = h.eventName),
                  (x = h.data),
                  (_ = O),
                  'fullScreenChange' === O && (_ = J.fullscreenChange),
                  ((null === (N = o.commonOptions) || void 0 === N ? void 0 : N.isBrowserViewFullscreen) ||
                    (null === (T = o.commonOptions) || void 0 === T ? void 0 : T.isParentFullscreen)) &&
                  'fullscreenchange' === _
                    ? ((C = x.status),
                      (E = x.isDispatchEvent),
                      o.commonOptions.isBrowserViewFullscreen
                        ? (function (e, t, n, r) {
                            0 === e
                              ? (t.style = 'position: static; width: ' + n.width + '; height: ' + n.height)
                              : 1 === e && (t.style = 'position: absolute; width: 100%; height: 100%'),
                              r &&
                                (function (e) {
                                  ;['fullscreen', 'fullscreenElement'].forEach(function (t) {
                                    Object.defineProperty(document, t, {
                                      get: function () {
                                        return !!e.status
                                      },
                                      configurable: !0,
                                    })
                                  })
                                  var t = new CustomEvent('fullscreenchange')
                                  document.dispatchEvent(t)
                                })({ status: e })
                          })(C, u, l, E)
                        : o.commonOptions.isParentFullscreen &&
                          (function (e, t, n) {
                            var r = document.querySelector(n),
                              a = r && 1 === r.nodeType ? r : t
                            if (0 === e) {
                              var i = document,
                                o = i.exitFullscreen || i.mozCancelFullScreen || i.msExitFullscreen || i.webkitCancelFullScreen || i.webkitExitFullscreen
                              o.call(document)
                            } else if (1 === e) {
                              var s = a.requestFullscreen || a.mozRequestFullScreen || a.msRequestFullscreen || a.webkitRequestFullscreen
                              s.call(a)
                            }
                          })(C, u, o.commonOptions.isParentFullscreen),
                      i.emit(_, x))
                    : i.emit(_, x))
                : 'api.ready' === v && M(e, h),
                (r.label = 17)
            case 17:
              return 'function' == typeof s[v] && s[v](e, g || h), [2]
          }
        })
      })
    })
  }
  function Z(e) {
    return new Promise(function (t) {
      var n = function (r) {
        p(r) || (a.parse(r.data).eventName === e && (t(), a.remove(n)))
      }
      a.add(n)
    })
  }
  function Q(e) {
    void 0 === e && (e = {}), G && G.destroy()
    try {
      var t = E(e),
        o = t.subscriptions,
        s = void 0 === o ? {} : o,
        c = t.mount,
        u = void 0 === c ? null : c,
        l = t.url,
        f = t.refreshToken,
        p = t.onToast,
        v = t.onHyperLinkOpen,
        b = t.getClipboardData
      d('origin', (l.match(/https*:\/\/[^\/]+/g) || [])[0])
      var h = g(l, u),
        m = Z('ready'),
        y = Z('open.result'),
        I = Z('api.ready'),
        O = u ? { width: u.clientWidth + 'px', height: u.clientHeight + 'px' } : { width: '100vw', height: '100vh' }
      delete t.mount, l && delete t.url, delete t.subscriptions
      var x =
          ((C = C || Object.create(null)),
          {
            on: function (e, t) {
              ;(C[e] || (C[e] = [])).push(t)
            },
            off: function (e, t) {
              C[e] && C[e].splice(C[e].indexOf(t) >>> 0, 1)
            },
            emit: function (e, t) {
              ;(C[e] || []).slice().map(function (e) {
                e(t)
              }),
                (C['*'] || []).slice().map(function (n) {
                  n(e, t)
                })
            },
          }),
        _ = { apiReadySended: !1 }
      return (
        (G = {
          url: l,
          iframe: h,
          version: '1.1.15',
          iframeReady: !1,
          tokenData: null,
          commandBars: null,
          tabs: {
            getTabs: function () {
              return n(this, void 0, void 0, function () {
                return r(this, function (e) {
                  switch (e.label) {
                    case 0:
                      return [4, m]
                    case 1:
                      return e.sent(), [2, j({ api: 'tab.getTabs' })]
                  }
                })
              })
            },
            switchTab: function (e) {
              return n(this, void 0, void 0, function () {
                return r(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [4, m]
                    case 1:
                      return t.sent(), [2, j({ api: 'tab.switchTab', args: { tabKey: e } })]
                  }
                })
              })
            },
          },
          setCooperUserColor: function (e) {
            return n(this, void 0, void 0, function () {
              return r(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, m]
                  case 1:
                    return t.sent(), [2, j({ api: 'setCooperUserColor', args: e })]
                }
              })
            })
          },
          setToken: function (e) {
            return n(this, void 0, void 0, function () {
              return r(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, m]
                  case 1:
                    return t.sent(), (G.tokenData = e), w({ eventName: 'setToken', data: e }), [2]
                }
              })
            })
          },
          ready: function () {
            return n(this, void 0, void 0, function () {
              return r(this, function (e) {
                switch (e.label) {
                  case 0:
                    return _.apiReadySended ? [3, 2] : [4, y]
                  case 1:
                    e.sent(), (_.apiReadySended = !0), w({ eventName: 'api.ready' }), (e.label = 2)
                  case 2:
                    return [4, I]
                  case 3:
                    return (
                      e.sent(),
                      [
                        2,
                        new Promise(function (e) {
                          return setTimeout(function () {
                            return e(null == G ? void 0 : G.Application)
                          }, 0)
                        }),
                      ]
                    )
                }
              })
            })
          },
          destroy: function () {
            h.destroy(), a.empty(), (G = null), (W = []), (B = new Set()), (D = 0), document.removeEventListener('fullscreenchange', F), A()
          },
          save: function () {
            return n(this, void 0, void 0, function () {
              return r(this, function (e) {
                switch (e.label) {
                  case 0:
                    return [4, m]
                  case 1:
                    return e.sent(), [2, k({ api: 'save' })]
                }
              })
            })
          },
          setCommandBars: function (e) {
            return n(this, void 0, void 0, function () {
              return r(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, m]
                  case 1:
                    return t.sent(), N(e), [2]
                }
              })
            })
          },
          updateConfig: function (e) {
            return (
              void 0 === e && (e = {}),
              n(this, void 0, void 0, function () {
                return r(this, function (t) {
                  switch (t.label) {
                    case 0:
                      return [4, m]
                    case 1:
                      return (
                        t.sent(),
                        e.commandBars
                          ? (console.warn(
                              'Deprecated: `updateConfig()` 鏂规硶鍗冲皢搴熷純锛岃浣跨敤`setCommandBars()`浠ｆ浛`updateConfig()`鏇存柊`commandBars`閰嶇疆銆�'
                            ),
                            [4, N(e.commandBars)])
                          : [3, 3]
                      )
                    case 2:
                      t.sent(), (t.label = 3)
                    case 3:
                      return [2]
                  }
                })
              })
            )
          },
          executeCommandBar: function (e) {
            return n(this, void 0, void 0, function () {
              return r(this, function (t) {
                switch (t.label) {
                  case 0:
                    return [4, m]
                  case 1:
                    return t.sent(), N([{ cmbId: e, attributes: [{ name: 'click', value: !0 }] }]), [2]
                }
              })
            })
          },
          on: function (e, t) {
            return n(this, void 0, void 0, function () {
              var n, a
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    return (
                      -1 ===
                      (n = W.findIndex(function (t) {
                        return t.eventName === e
                      }))
                        ? W.push({ eventName: e, handle: t })
                        : (W[n] = { eventName: e, handle: t }),
                      [4, m]
                    )
                  case 1:
                    return (
                      r.sent(),
                      (a = e),
                      e === J.fileSaved && console.warn('fileSaved浜嬩欢鐩戝惉鍗冲皢寮冪敤锛� 鎺ㄨ崘浣跨敤fileStatus杩涜鏂囦欢鐘舵€佺殑鐩戝惉'),
                      e === J.fullscreenChange && (a = 'fullscreenchange'),
                      X(a, 'on'),
                      x.on(e, t),
                      [2]
                    )
                }
              })
            })
          },
          off: function (e, t) {
            return n(this, void 0, void 0, function () {
              return r(this, function (n) {
                switch (n.label) {
                  case 0:
                    return (
                      (W = W.filter(function (t) {
                        t.eventName !== e && t.handle
                      })),
                      [4, m]
                    )
                  case 1:
                    return n.sent(), X(e, 'off'), x.off(e, t), [2]
                }
              })
            })
          },
        }),
        (function (e, t, n, r, a, o) {
          t && i(t) && ((a.refreshToken = t), (e.refreshToken = { eventName: U.getToken }))
          o && i(o) && ((a.getClipboardData = o), (e.getClipboardData = { eventName: U.getClipboardData }))
          n && i(n) && ((a.onToast = n), (e.onToast = { eventName: U.onToast }))
          r && i(r) && ((a.onHyperLinkOpen = r), (e.onHyperLinkOpen = { eventName: U.onHyperLinkOpen }))
        })(t, f, p, v, _, b),
        K(G, x, t, s, _, h, O),
        G
      )
    } catch (e) {
      console.error(e)
    }
    var C
  }
  function X(e, t) {
    var n = e
    ;['error', 'fileOpen'].includes(n) || ('fileSaved' === n && (n = 'fileStatus'), w({ eventName: 'basic.event', data: { eventName: n, action: t } }))
  }
  console.log('aliyun JS-SDK V1.1.15')
  var Y = Object.freeze({ __proto__: null, listener: K, config: Q })
  window.WPS = Y
  var $ = Q,
    ee = { config: $ }
  ;(e.config = $), (e.default = ee), Object.defineProperty(e, '__esModule', { value: !0 })
})
