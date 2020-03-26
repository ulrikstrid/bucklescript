'use strict';

var Mt = require("./mt.js");
var Caml_option = require("../../lib/js/caml_option.js");

var suites = {
  contents: /* [] */0
};

var test_id = {
  contents: 0
};

function eq(loc, x, y) {
  return Mt.eq_suites(test_id, suites, loc, x, y);
}

function b(loc, b$1) {
  return Mt.bool_suites(test_id, suites, loc, b$1);
}

function makeWrapper(foo, param) {
  var tmp = { };
  if (foo !== void 0) {
    tmp.foo = (function () {
          switch (Caml_option.valFromOption(foo)) {
            case 97 :
                return "a";
            case 98 :
                return "b";
            
          }
        })();
  }
  console.log(tmp);
  
}

function makeWrapper2(foo, param) {
  console.log({
        foo: (function () {
              switch (foo) {
                case 97 :
                    return "a";
                case 98 :
                    return "b";
                
              }
            })()
      });
  
}

makeWrapper2(/* a */97, void 0);

function makeWrapper3(foo, param) {
  console.log(2);
  var tmp = { };
  if (foo !== void 0) {
    tmp.foo = (function () {
          switch (Caml_option.valFromOption(foo)) {
            case 97 :
                return "a";
            case 98 :
                return "b";
            
          }
        })();
  }
  return tmp;
}

function makeWrapper4(foo, param) {
  console.log(2);
  var tmp = { };
  var tmp$1 = foo > 100 ? void 0 : (
      foo > 10 ? /* b */98 : /* a */97
    );
  if (tmp$1 !== void 0) {
    tmp.foo = (function () {
          switch (Caml_option.valFromOption(tmp$1)) {
            case 97 :
                return "a";
            case 98 :
                return "b";
            
          }
        })();
  }
  return tmp;
}

b("File \"gpr_2503_test.ml\", line 31, characters 5-12", "a" === makeWrapper3(/* a */97, void 0).foo);

b("File \"gpr_2503_test.ml\", line 34, characters 5-12", void 0 === makeWrapper3(void 0, void 0).foo);

b("File \"gpr_2503_test.ml\", line 37, characters 5-12", "a" === makeWrapper4(1, void 0).foo);

b("File \"gpr_2503_test.ml\", line 40, characters 5-12", "b" === makeWrapper4(11, void 0).foo);

b("File \"gpr_2503_test.ml\", line 43, characters 5-12", void 0 === makeWrapper4(111, void 0).foo);

Mt.from_pair_suites("Gpr_2503_test", suites.contents);

exports.suites = suites;
exports.test_id = test_id;
exports.eq = eq;
exports.b = b;
exports.makeWrapper = makeWrapper;
exports.makeWrapper2 = makeWrapper2;
exports.makeWrapper3 = makeWrapper3;
exports.makeWrapper4 = makeWrapper4;
/*  Not a pure module */
