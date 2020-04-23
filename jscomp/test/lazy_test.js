'use strict';

var Mt = require("./mt.js");
var Lazy = require("../../lib/js/lazy.js");
var Block = require("../../lib/js/block.js");
var CamlinternalLazy = require("../../lib/js/camlinternalLazy.js");
var Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");
var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions.js");

var u = {
  contents: 3
};

var v = CamlinternalLazy.from_fun((function (param) {
        u.contents = 32;
        
      }));

function lazy_test(param) {
  var h = u.contents;
  CamlinternalLazy.force(v);
  var g = u.contents;
  return /* tuple */[
          h,
          g
        ];
}

function f(param) {
  CamlinternalLazy.force(param[0]);
  var match = param[2].contents;
  if (match === undefined) {
    return 0;
  }
  CamlinternalLazy.force(param[1]);
  var x = param[2].contents;
  if (x !== undefined) {
    return 1;
  }
  throw [
        Caml_builtin_exceptions.match_failure,
        /* tuple */[
          "lazy_test.ml",
          11,
          8
        ]
      ];
}

var s = {
  contents: undefined
};

var set_true = CamlinternalLazy.from_fun((function (param) {
        s.contents = 1;
        
      }));

var set_false = CamlinternalLazy.from_fun((function (param) {
        s.contents = undefined;
        
      }));

var h;

try {
  h = f(/* tuple */[
        set_true,
        set_false,
        s
      ]);
}
catch (raw_exn){
  var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
  if (exn[0] === Caml_builtin_exceptions.match_failure) {
    h = 2;
  } else {
    throw exn;
  }
}

var u_v = {
  contents: 0
};

var u$1 = CamlinternalLazy.from_fun((function (param) {
        u_v.contents = 2;
        
      }));

CamlinternalLazy.force(u$1);

var exotic = CamlinternalLazy.force;

var l_from_fun = Lazy.from_fun((function (param) {
        return 3;
      }));

var forward_test = CamlinternalLazy.from_fun((function (param) {
        var u = 3;
        u = u + 1 | 0;
        return u;
      }));

var f005 = CamlinternalLazy.from_fun((function (param) {
        return 6;
      }));

var f006 = CamlinternalLazy.from_fun((function (param) {
        return (function (param) {
            return 3;
          });
      }));

var f007 = CamlinternalLazy.from_fun((function (param) {
        throw Caml_builtin_exceptions.not_found;
      }));

var f008 = CamlinternalLazy.from_fun((function (param) {
        console.log("hi");
        throw Caml_builtin_exceptions.not_found;
      }));

Mt.from_pair_suites("Lazy_test", /* :: */[
      /* tuple */[
        "simple",
        (function (param) {
            return /* Eq */Block.__(0, [
                      lazy_test(undefined),
                      /* tuple */[
                        3,
                        32
                      ]
                    ]);
          })
      ],
      /* :: */[
        /* tuple */[
          "lazy_match",
          (function (param) {
              return /* Eq */Block.__(0, [
                        h,
                        2
                      ]);
            })
        ],
        /* :: */[
          /* tuple */[
            "lazy_force",
            (function (param) {
                return /* Eq */Block.__(0, [
                          u_v.contents,
                          2
                        ]);
              })
          ],
          /* :: */[
            /* tuple */[
              "lazy_from_fun",
              (function (param) {
                  return /* Eq */Block.__(0, [
                            CamlinternalLazy.force(l_from_fun),
                            3
                          ]);
                })
            ],
            /* :: */[
              /* tuple */[
                "lazy_from_val",
                (function (param) {
                    return /* Eq */Block.__(0, [
                              CamlinternalLazy.force(Lazy.from_val(3)),
                              3
                            ]);
                  })
              ],
              /* :: */[
                /* tuple */[
                  "lazy_from_val2",
                  (function (param) {
                      return /* Eq */Block.__(0, [
                                CamlinternalLazy.force(CamlinternalLazy.force(Lazy.from_val(3))),
                                3
                              ]);
                    })
                ],
                /* :: */[
                  /* tuple */[
                    "lazy_from_val3",
                    (function (param) {
                        debugger;
                        return /* Eq */Block.__(0, [
                                  CamlinternalLazy.force(CamlinternalLazy.force(Lazy.from_val(forward_test))),
                                  4
                                ]);
                      })
                  ],
                  /* [] */0
                ]
              ]
            ]
          ]
        ]
      ]
    ]);

exports.v = v;
exports.lazy_test = lazy_test;
exports.f = f;
exports.s = s;
exports.set_true = set_true;
exports.set_false = set_false;
exports.h = h;
exports.u_v = u_v;
exports.u = u$1;
exports.exotic = exotic;
exports.l_from_fun = l_from_fun;
exports.forward_test = forward_test;
exports.f005 = f005;
exports.f006 = f006;
exports.f007 = f007;
exports.f008 = f008;
/* v Not a pure module */
