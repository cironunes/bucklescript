'use strict';

var CamlinternalLazy = require("../../lib/js/camlinternalLazy.js");

function fix(param) {
  return /* Fix */[CamlinternalLazy.from_fun((function (param) {
                  return fix(undefined);
                }))];
}

exports.fix = fix;
/* No side effect */
