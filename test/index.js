require('babel-polyfill');
var ctx = require.context('../lib', true, /spec$/);
ctx.keys().forEach(ctx);