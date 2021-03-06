'use strict';

var Mt = require("./mt.js");
var Block = require("../../lib/js/block.js");

var suites = /* record */[/* contents : [] */0];

var counter = /* record */[/* contents */0];

function add_test(loc, test) {
  counter[/* contents */0] = counter[/* contents */0] + 1 | 0;
  var id = loc + (" id " + String(counter[/* contents */0]));
  suites[/* contents */0] = /* :: */[
    /* tuple */[
      id,
      test
    ],
    suites[/* contents */0]
  ];
  return /* () */0;
}

function eq(loc, x, y) {
  return add_test(loc, (function (param) {
                return /* Eq */Block.__(0, [
                          x,
                          y
                        ]);
              }));
}

eq("File \"js_cast_test.ml\", line 13, characters 12-19", true, 1);

eq("File \"js_cast_test.ml\", line 15, characters 12-19", false, 0);

eq("File \"js_cast_test.ml\", line 17, characters 12-19", 0, 0.0);

eq("File \"js_cast_test.ml\", line 19, characters 12-19", 1, 1.0);

eq("File \"js_cast_test.ml\", line 21, characters 12-19", 123456789, 123456789.0);

Mt.from_pair_suites("Js_cast_test", suites[/* contents */0]);

exports.suites = suites;
exports.add_test = add_test;
exports.eq = eq;
/*  Not a pure module */
