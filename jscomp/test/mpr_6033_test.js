'use strict';

var Mt = require("./mt.js");
var Block = require("../../lib/js/block.js");
var CamlinternalLazy = require("../../lib/js/camlinternalLazy.js");

var suites = /* record */[/* contents : [] */0];

var test_id = /* record */[/* contents */0];

function eq(loc, x, y) {
  test_id[/* contents */0] = test_id[/* contents */0] + 1 | 0;
  suites[/* contents */0] = /* :: */[
    /* tuple */[
      loc + (" id " + String(test_id[/* contents */0])),
      (function (param) {
          return /* Eq */Block.__(0, [
                    x,
                    y
                  ]);
        })
    ],
    suites[/* contents */0]
  ];
  return /* () */0;
}

function f(x) {
  var y = CamlinternalLazy.force(x);
  return y + "abc";
}

var x = "def";

CamlinternalLazy.force(x);

var u = f(x);

eq("File \"mpr_6033_test.ml\", line 20, characters 6-13", u, "defabc");

Mt.from_pair_suites("Mpr_6033_test", suites[/* contents */0]);

exports.suites = suites;
exports.test_id = test_id;
exports.eq = eq;
exports.f = f;
exports.u = u;
/*  Not a pure module */
