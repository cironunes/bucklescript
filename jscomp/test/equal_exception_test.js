'use strict';

var Mt = require("./mt.js");
var Bytes = require("../../lib/js/bytes.js");
var Caml_bytes = require("../../lib/js/caml_bytes.js");
var Caml_exceptions = require("../../lib/js/caml_exceptions.js");
var Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");
var Caml_builtin_exceptions = require("../../lib/js/caml_builtin_exceptions.js");

var v = "gso";

function is_equal(param) {
  if (Caml_bytes.get(Bytes.make(3, /* "a" */97), 0) !== /* "a" */97) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "equal_exception_test.ml",
            9,
            4
          ]
        ];
  }
  if (Bytes.make(3, /* "a" */97)[0] !== /* "a" */97) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "equal_exception_test.ml",
            10,
            4
          ]
        ];
  }
  var u = Bytes.make(3, /* "a" */97);
  u[0] = /* "b" */98;
  if (u[0] !== /* "b" */98) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "equal_exception_test.ml",
            13,
            4
          ]
        ];
  }
  
}

function is_exception(param) {
  try {
    throw Caml_builtin_exceptions.not_found;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return ;
    }
    throw exn;
  }
}

function is_normal_exception(_x) {
  var A = Caml_exceptions.create("A");
  var v = [
    A,
    3
  ];
  try {
    throw v;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === A) {
      if (exn[1] === 3) {
        return ;
      }
      throw exn;
    }
    throw exn;
  }
}

function is_arbitrary_exception(param) {
  var A = Caml_exceptions.create("A");
  try {
    throw A;
  }
  catch (exn){
    return ;
  }
}

var suites_000 = /* tuple */[
  "is_equal",
  is_equal
];

var suites_001 = /* :: */[
  /* tuple */[
    "is_exception",
    is_exception
  ],
  /* :: */[
    /* tuple */[
      "is_normal_exception",
      is_normal_exception
    ],
    /* :: */[
      /* tuple */[
        "is_arbitrary_exception",
        is_arbitrary_exception
      ],
      /* [] */0
    ]
  ]
];

var suites = /* :: */[
  suites_000,
  suites_001
];

Mt.from_suites("exception", suites);

exports.v = v;
exports.is_equal = is_equal;
exports.is_exception = is_exception;
exports.is_normal_exception = is_normal_exception;
exports.is_arbitrary_exception = is_arbitrary_exception;
exports.suites = suites;
/*  Not a pure module */
