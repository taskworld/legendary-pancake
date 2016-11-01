webpackJsonp([1],{

/***/ 126:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(221);

	var _README = __webpack_require__(145);

	var _README2 = _interopRequireDefault(_README);

	var _react = __webpack_require__(5);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Docs() {
	  return _react2.default.createElement('div', { className: 'Docs', dangerouslySetInnerHTML: { __html: _README2.default } });
	}

	exports.default = Docs;

/***/ },

/***/ 145:
/***/ function(module, exports) {

	module.exports = "<h1>legendary-pancake</h1>\n<blockquote>\n<p>Great repository names are short and memorable. Need inspiration? How about <strong>legendary-pancake</strong>.\n—GitHub</p>\n</blockquote>\n<p><strong>legendary-pancake</strong> is a static site generator based on Webpack, React and React Router.</p>\n<ul>\n<li>\n<p><strong>JavaScript defined pages.</strong> legendary-pancake makes no assumption about your site structure. All your pages are defined in a single <code>pages.js</code> file, so you can leverage Webpack and JavaScript to generate multiple pages from your data!</p>\n</li>\n<li>\n<p><strong>Asynchronous page loading.</strong> Pages are resolved asynchronously, so you can leverage Webpack’s code-splitting features so split your site into multiple chunks.</p>\n<p>Since it makes no assumption about how your pages are loaded, you can split by page, or group pages together in the same chunk. You can load new pages on demand, or you can preload the next page in the background.</p>\n</li>\n<li>\n<p><strong>Hot reloading.</strong> Thanks to React and declarative DOM, hot-reloading is supported!</p>\n</li>\n</ul>\n<p>More info later if this experiment ever succeed………………………</p>\n";

/***/ },

/***/ 221:
222

});