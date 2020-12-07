import { fabric } from "fabric";
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = "MODULE_NOT_FOUND"), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function (require, module, exports) {
        /**
         * CrayonBrush class
         * @class fabric.CrayonBrush
         * @extends fabric.PencilBrush
         */
        (function (fabric) {
          fabric.CrayonBrush = fabric.util.createClass(fabric.SprayBrush, {
            color: "#000000",
            opacity: 0.6,
            width: 30,

            _baseWidth: 20,
            _inkAmount: 10,
            _latestStrokeLength: 0,
            _point: null,
            _sep: 5,
            _size: 0,

            initialize: function (canvas, opt) {
              opt = opt || {};

              this.canvas = canvas;
              this.width = opt.width || canvas.freeDrawingBrush.width;
              this.color = opt.color || canvas.freeDrawingBrush.color;
              this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
              this._point = new fabric.Point(0, 0);
              this._points = [];
            },

            changeColor: function (color) {
              this.color = color;
            },

            changeOpacity: function (value) {
              this.opacity = value;
            },

            onMouseDown: function (pointer) {
              this.canvas.contextTop.globalAlpha = this.opacity;
              this._size = this.width / 2 + this._baseWidth;
              this.set(pointer);
            },

            onMouseMove: function (pointer) {
              this.update(pointer);
              this.draw(this.canvas.contextTop);
              // console.log(this._point);
            },

            onMouseUp: function (pointer) {},
            // onMouseUp: function (options) {
            //   if (!this.canvas._isMainEvent(options.e)) {
            //     return true;
            //   }
            //   this.oldEnd = undefined;
            //   this._finalizeAndAddPath();
            //   return false;
            // },
            // _finalizeAndAddPath: function () {
            //   var ctx = this.canvas.contextTop;
            //   ctx.closePath();
            //   if (this.decimate) {
            //     this._points = this.decimatePoints(this._points, this.decimate);
            //   }
            //   var pathData = this.convertPointsToSVGPath(this._points).join("");
            //   if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
            //     // do not create 0 width/height paths, as they are
            //     // rendered inconsistently across browsers
            //     // Firefox 4, for example, renders a dot,
            //     // whereas Chrome 10 renders nothing
            //     this.canvas.requestRenderAll();
            //     return;
            //   }
            //   var path = this.createPath(pathData);
            //   this.canvas.clearContext(this.canvas.contextTop);
            //   this.canvas.fire("before:path:created", { path: path });
            //   this.canvas.add(path);
            //   this.canvas.requestRenderAll();
            //   path.setCoords();
            //   this._resetShadow();
            //   // fire event 'path' created
            //   this.canvas.fire("path:created", { path: path });
            // },
            // convertPointsToSVGPath: function (points) {
            //   var path = [],
            //     i,
            //     width = this.width / 1000,
            //     p1 = new fabric.Point(points[0].x, points[0].y),
            //     p2 = new fabric.Point(points[1].x, points[1].y),
            //     len = points.length,
            //     multSignX = 1,
            //     multSignY = 0,
            //     manyPoints = len > 2;
            //   if (manyPoints) {
            //     multSignX =
            //       points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
            //     multSignY =
            //       points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
            //   }
            //   path.push(
            //     "M ",
            //     p1.x - multSignX * width,
            //     " ",
            //     p1.y - multSignY * width,
            //     " "
            //   );
            //   for (i = 1; i < len; i++) {
            //     if (!p1.eq(p2)) {
            //       var midPoint = p1.midPointFrom(p2);
            //       // p1 is our bezier control point
            //       // midpoint is our endpoint
            //       // start point is p(i-1) value.
            //       path.push(
            //         "Q ",
            //         p1.x,
            //         " ",
            //         p1.y,
            //         " ",
            //         midPoint.x,
            //         " ",
            //         midPoint.y,
            //         " "
            //       );
            //     }
            //     p1 = points[i];
            //     if (i + 1 < points.length) {
            //       p2 = points[i + 1];
            //     }
            //   }
            //   if (manyPoints) {
            //     multSignX =
            //       p1.x > points[i - 2].x
            //         ? 1
            //         : p1.x === points[i - 2].x
            //         ? 0
            //         : -1;
            //     multSignY =
            //       p1.y > points[i - 2].y
            //         ? 1
            //         : p1.y === points[i - 2].y
            //         ? 0
            //         : -1;
            //   }
            //   path.push(
            //     "L ",
            //     p1.x + multSignX * width,
            //     " ",
            //     p1.y + multSignY * width
            //   );
            //   return path;
            // },

            set: function (p) {
              if (this._latest) {
                this._latest.setFromPoint(this._point);
              } else {
                this._latest = new fabric.Point(p.x, p.y);
              }
              fabric.Point.prototype.setFromPoint.call(this._point, p);
            },

            update: function (p) {
              this.set(p);
              this._latestStrokeLength = this._point
                .subtract(this._latest)
                .distanceFrom({ x: 0, y: 0 });
            },

            draw: function (ctx) {
              var i,
                j,
                p,
                r,
                c,
                x,
                y,
                w,
                h,
                v,
                s,
                stepNum,
                dotSize,
                dotNum,
                range;

              v = this._point.subtract(this._latest);
              s = Math.ceil(this._size / 2);
              stepNum = Math.floor(v.distanceFrom({ x: 0, y: 0 }) / s) + 1;
              v.normalize(s);

              dotSize =
                this._sep *
                fabric.util.clamp(
                  (this._inkAmount / this._latestStrokeLength) * 3,
                  1,
                  0.5
                );
              dotNum = Math.ceil(this._size * this._sep);

              range = this._size / 2;

              ctx.save();
              ctx.fillStyle = this.color;
              ctx.beginPath();
              for (i = 0; i < dotNum; i++) {
                for (j = 0; j < stepNum; j++) {
                  p = this._latest.add(v.multiply(j));
                  r = fabric.util.getRandom(range);
                  c = fabric.util.getRandom(Math.PI * 2);
                  w = fabric.util.getRandom(dotSize, dotSize / 2);
                  h = fabric.util.getRandom(dotSize, dotSize / 2);
                  x = p.x + r * Math.sin(c) - w / 2;
                  y = p.y + r * Math.cos(c) - h / 2;
                  ctx.rect(x, y, w, h);
                }
              }
              ctx.fill();
              ctx.restore();
            },
          });
        })(fabric);
      },
      {},
    ],
    2: [
      function (require, module, exports) {
        /**
         * Drip class
         * @class fabric.Drip
         * @extends fabric.Object
         */
        (function (fabric) {
          fabric.Drip = fabric.util.createClass(fabric.Object, {
            rate: 0,
            color: "#000000",
            amount: 10,
            life: 10,
            _point: null,
            _lastPoint: null,
            _strokeId: 0,
            _interval: 20,

            initialize: function (ctx, pointer, amount, color, _strokeId) {
              this.ctx = ctx;
              this._point = pointer;
              this._strokeId = _strokeId;
              this.amount = fabric.util.getRandom(amount, amount * 0.5);
              this.color = color;
              this.life = this.amount * 1.5;
              ctx.lineCap = ctx.lineJoin = "round";

              this._render();
            },

            _update: function (brush) {
              this._lastPoint = fabric.util.object.clone(this._point);
              this._point.addEquals({
                x: this.life * this.rate,
                y: fabric.util.getRandom((this.life * this.amount) / 30),
              });

              this.life -= 0.05;

              if (fabric.util.getRandom() < 0.03) {
                this.rate += fabric.util.getRandom(0.03, -0.03);
              } else if (fabric.util.getRandom() < 0.05) {
                this.rate *= 0.01;
              }
            },

            _draw: function () {
              this.ctx.save();
              this.line(
                this.ctx,
                this._lastPoint,
                this._point,
                this.color,
                this.amount * 0.8 + this.life * 0.2
              );
              this.ctx.restore();
            },

            _render: function () {
              var context = this;

              setTimeout(draw, this._interval);

              function draw() {
                context._update();
                context._draw();
                if (context.life > 0) {
                  setTimeout(draw, context._interval);
                }
              }
            },

            line: function (ctx, point1, point2, color, lineWidth) {
              ctx.strokeStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);

              ctx.stroke();
            },
          });
        })(fabric);
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        /**
         * InkBrush class
         * @class fabric.InkBrush
         * @extends fabric.BaseBrush
         */
        (function (fabric) {
          fabric.InkBrush = fabric.util.createClass(fabric.BaseBrush, {
            color: "#000000",
            opacity: 1,
            width: 30,

            _baseWidth: 20,
            _dripCount: 0,
            _drips: [],
            _inkAmount: 7,
            _lastPoint: null,
            _point: null,
            _range: 10,
            _strokeCount: 0,
            _strokeId: null,
            _strokeNum: 40,
            _strokes: null,

            initialize: function (canvas, opt) {
              opt = opt || {};

              this.canvas = canvas;
              this.width = opt.width || canvas.freeDrawingBrush.width;
              this.color = opt.color || canvas.freeDrawingBrush.color;
              this.opacity = opt.opacity || canvas.contextTop.globalAlpha;

              this._point = new fabric.Point();
            },

            changeColor: function (color) {
              this.color = color;
            },

            changeOpacity: function (value) {
              this.opacity = value;
              this.canvas.contextTop.globalAlpha = value;
            },

            _render: function (pointer) {
              var subtractPoint, distance, point, i, len, strokes, stroke;
              this._strokeCount++;
              if (this._strokeCount % 120 === 0 && this._dripCount < 10) {
                this._dripCount++;
              }

              point = this.setPointer(pointer);
              subtractPoint = point.subtract(this._lastPoint);
              distance = point.distanceFrom(this._lastPoint);
              strokes = this._strokes;

              for (i = 0, len = strokes.length; i < len; i++) {
                stroke = strokes[i];
                stroke.update(point, subtractPoint, distance);
                stroke.draw();
              }

              if (distance > 30) {
                this.drawSplash(point, this._inkAmount);
              } else if (
                distance < 10 &&
                fabric.util.getRandom() < 0.085 &&
                this._dripCount
              ) {
                this._drips.push(
                  new fabric.Drip(
                    this.canvas.contextTop,
                    point,
                    fabric.util.getRandom(this.size * 0.25, this.size * 0.1),
                    this.color,
                    this._strokeId
                  )
                );
                this._dripCount--;
              }
            },

            onMouseDown: function (pointer) {
              this._resetTip(pointer);
              this._strokeId = +new Date();
              this._dripCount = fabric.util.getRandom(6, 3) | 0;
            },

            onMouseMove: function (pointer) {
              if (this.canvas._isCurrentlyDrawing) {
                this._render(pointer);
              }
            },

            onMouseUp: function () {
              this._strokeCount = 0;
              this._dripCount = 0;
              this._strokeId = null;
            },

            drawSplash: function (pointer, maxSize) {
              var c,
                r,
                i,
                point,
                ctx = this.canvas.contextTop,
                num = fabric.util.getRandom(12),
                range = maxSize * 10,
                color = this.color;

              ctx.save();
              for (i = 0; i < num; i++) {
                r = fabric.util.getRandom(range, 1);
                c = fabric.util.getRandom(Math.PI * 2);
                point = new fabric.Point(
                  pointer.x + r * Math.sin(c),
                  pointer.y + r * Math.cos(c)
                );

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(
                  point.x,
                  point.y,
                  fabric.util.getRandom(maxSize) / 2,
                  0,
                  Math.PI * 2,
                  false
                );
                ctx.fill();
              }
              ctx.restore();
            },

            setPointer: function (pointer) {
              var point = new fabric.Point(pointer.x, pointer.y);

              this._lastPoint = fabric.util.object.clone(this._point);
              this._point = point;

              return point;
            },

            _resetTip: function (pointer) {
              var strokes, point, len, i;

              point = this.setPointer(pointer);
              strokes = this._strokes = [];
              this.size = this.width / 5 + this._baseWidth;
              this._strokeNum = this.size;
              this._range = this.size / 2;

              for (i = 0, len = this._strokeNum; i < len; i++) {
                strokes[i] = new fabric.Stroke(
                  this.canvas.contextTop,
                  point,
                  this._range,
                  this.color,
                  this.width,
                  this._inkAmount
                );
              }
            },
          });
        })(fabric);
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        /**
         * MarkerBrush class
         * @class fabric.MarkerBrush
         * @extends fabric.BaseBrush
         */
        (function (fabric) {
          fabric.MarkerBrush = fabric.util.createClass(fabric.BaseBrush, {
            color: "#000000",
            opacity: 1,
            width: 30,

            _baseWidth: 10,
            _lastPoint: null,
            _lineWidth: 3,
            _point: null,
            _size: 0,

            initialize: function (canvas, opt) {
              opt = opt || {};

              this.canvas = canvas;
              this.width = opt.width || canvas.freeDrawingBrush.width;
              this.color = opt.color || canvas.freeDrawingBrush.color;
              this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
              this._point = new fabric.Point();

              this.canvas.contextTop.lineJoin = "round";
              this.canvas.contextTop.lineCap = "round";
            },

            changeColor: function (color) {
              this.color = color;
            },

            changeOpacity: function (value) {
              this.opacity = value;
            },

            _render: function (pointer) {
              var ctx, lineWidthDiff, i;

              ctx = this.canvas.contextTop;

              ctx.beginPath();
              var len;
              for (
                i = 0, len = this._size / this._lineWidth / 2;
                i < len;
                i++
              ) {
                lineWidthDiff = (this._lineWidth - 1) * i;

                ctx.globalAlpha = 0.8 * this.opacity;
                ctx.moveTo(
                  this._lastPoint.x + lineWidthDiff,
                  this._lastPoint.y + lineWidthDiff
                );
                ctx.lineTo(
                  pointer.x + lineWidthDiff,
                  pointer.y + lineWidthDiff
                );
                ctx.stroke();
              }

              this._lastPoint = new fabric.Point(pointer.x, pointer.y);
            },

            onMouseDown: function (pointer) {
              this._lastPoint = pointer;
              this.canvas.contextTop.strokeStyle = this.color;
              this.canvas.contextTop.lineWidth = this._lineWidth;
              this._size = this.width + this._baseWidth;
            },

            onMouseMove: function (pointer) {
              if (this.canvas._isCurrentlyDrawing) {
                this._render(pointer);
              }
            },

            onMouseUp: function () {
              this.canvas.contextTop.globalAlpha = this.opacity;
            },
          });
        })(fabric);
      },
      {},
    ],
    6: [
      function (require, module, exports) {
        /**
         * Stroke class
         * @class fabric.Stroke
         * @extends fabric.Object
         */
        (function (fabric) {
          fabric.Stroke = fabric.util.createClass(fabric.Object, {
            color: null,
            inkAmount: null,
            lineWidth: null,
            _point: null,
            _lastPoint: null,
            _currentLineWidth: null,

            initialize: function (
              ctx,
              pointer,
              range,
              color,
              lineWidth,
              inkAmount
            ) {
              var rx = fabric.util.getRandom(range),
                c = fabric.util.getRandom(Math.PI * 2),
                c0 = fabric.util.getRandom(Math.PI * 2),
                x0 = rx * Math.sin(c0),
                y0 = (rx / 2) * Math.cos(c0),
                cos = Math.cos(c),
                sin = Math.sin(c);

              this.ctx = ctx;
              this.color = color;
              this._point = new fabric.Point(
                pointer.x + x0 * cos - y0 * sin,
                pointer.y + x0 * sin + y0 * cos
              );
              this.lineWidth = lineWidth;
              this.inkAmount = inkAmount;
              this._currentLineWidth = lineWidth;

              ctx.lineCap = "round";
            },

            update: function (pointer, subtractPoint, distance) {
              this._lastPoint = fabric.util.object.clone(this._point);
              this._point = this._point.addEquals({
                x: subtractPoint.x,
                y: subtractPoint.y,
              });

              var n = this.inkAmount / (distance + 1);
              var per = n > 0.3 ? 0.2 : n < 0 ? 0 : n;
              this._currentLineWidth = this.lineWidth * per;
            },

            draw: function () {
              var ctx = this.ctx;
              ctx.save();
              this.line(
                ctx,
                this._lastPoint,
                this._point,
                this.color,
                this._currentLineWidth
              );
              ctx.restore();
            },

            line: function (ctx, point1, point2, color, lineWidth) {
              ctx.strokeStyle = color;
              ctx.lineWidth = lineWidth;
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);

              ctx.stroke();
            },
          });
        })(fabric);
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        (function (fabric) {
          fabric.Point.prototype.angleBetween = function (that) {
            return Math.atan2(this.x - that.x, this.y - that.y);
          };

          fabric.Point.prototype.normalize = function (thickness) {
            if (null === thickness || undefined === thickness) {
              thickness = 1;
            }

            var length = this.distanceFrom({ x: 0, y: 0 });

            if (length > 0) {
              this.x = (this.x / length) * thickness;
              this.y = (this.y / length) * thickness;
            }

            return this;
          };
        })(fabric);
      },
      {},
    ],
    8: [
      function (require, module, exports) {
        (function (fabric) {
          fabric.util.getRandom = function (max, min) {
            min = min ? min : 0;
            return Math.random() * ((max ? max : 1) - min) + min;
          };

          fabric.util.clamp = function (n, max, min) {
            if (typeof min !== "number") min = 0;
            return n > max ? max : n < min ? min : n;
          };
        })(fabric);
      },
      {},
    ],
  },
  {},
  [1, 2, 3, 4, 6, 7, 8]
);
