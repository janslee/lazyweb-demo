(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[6432],{70347:function(){},7104:function(){},18067:function(){},68536:function(j,x,i){"use strict";i.r(x),i.d(x,{default:function(){return V}});var p=i(58024),g=i(91894),h=i(18106),m=i(6416),O=i(67294),E=i(27878),T=i(50880),v=i(33365),M=i(41557),S=i(57663),F=i(71577),w=i(47673),C=i(4107),D=i(11849),B=i(2824),A=i(93224),c=i(85893),L=["value","onChange","readyPost","phoneNumber"],U=function(b){var t=b.value,e=b.onChange,n=b.readyPost,r=b.phoneNumber,u=(0,A.Z)(b,L),o=(0,O.useState)(0),a=(0,B.Z)(o,2),s=a[0],y=a[1],l=function f(){var _=arguments.length>0&&arguments[0]!==void 0?arguments[0]:20;_<0||(y(_),setTimeout(function(){f(_-1)},1e3))};return(0,c.jsxs)("div",{style:{display:"inline-flex",width:"100%",alignItems:"center"},children:[(0,c.jsx)(C.Z,(0,D.Z)((0,D.Z)({},u),{},{style:(0,D.Z)({marginRight:5},u.style),value:t,onChange:e})),(0,c.jsxs)("div",{style:{flexShrink:0,color:"#999",width:100,height:35,display:"flex",alignItems:"center",justifyContent:"center"},children:[s===0&&(0,c.jsx)(F.Z,{disabled:!n,block:!0,onClick:function(){r&&console.log("post code by phone number ".concat(r)),l()},children:"\u53D1\u9001\u9A8C\u8BC1\u7801"}),s>0&&(0,c.jsxs)("span",{children:["\u5269\u4F59",s,"\u79D2"]})]})]})},W=(0,E.Np)({validateFirst:!0}),K=(0,E.Np)({validateFirst:!0}),I=(0,T.cA)({components:{FormItem:v.xJ,Input:v.II,Password:v.ro,VerifyCode:U},scope:{icon:function(b){return O.createElement(M[b])}}}),Z={type:"object",properties:{username:{type:"string",title:"\u7528\u6237\u540D",required:!0,"x-decorator":"FormItem","x-component":"Input","x-component-props":{prefix:"{{icon('UserOutlined')}}"}},password:{type:"string",title:"\u5BC6\u7801",required:!0,"x-decorator":"FormItem","x-component":"Password","x-component-props":{prefix:"{{icon('LockOutlined')}}"}}}},N={type:"object",properties:{phone:{type:"string",title:"\u624B\u673A\u53F7",required:!0,"x-validator":"phone","x-decorator":"FormItem","x-component":"Input","x-component-props":{prefix:"{{icon('PhoneOutlined')}}"}},verifyCode:{type:"string",title:"\u9A8C\u8BC1\u7801",required:!0,"x-decorator":"FormItem","x-component":"VerifyCode","x-component-props":{prefix:"{{icon('LockOutlined')}}"},"x-reactions":[{dependencies:[".phone#value",".phone#valid"],fulfill:{state:{"component[1].readyPost":"{{$deps[0] && $deps[1]}}","component[1].phoneNumber":"{{$deps[0]}}"}}}]}}},V=function(){return(0,c.jsx)("div",{style:{display:"flex",justifyContent:"center",background:"#eee",padding:"40px 0"},children:(0,c.jsxs)(g.Z,{style:{width:400},children:[(0,c.jsxs)(m.Z,{style:{overflow:"visible",marginTop:-10},children:[(0,c.jsx)(m.Z.TabPane,{tab:"\u8D26\u5BC6\u767B\u5F55",children:(0,c.jsxs)(v.l0,{form:W,layout:"vertical",size:"large",onAutoSubmit:console.log,children:[(0,c.jsx)(I,{schema:Z}),(0,c.jsx)(v.k4,{block:!0,size:"large",children:"\u767B\u5F55"})]})},"1"),(0,c.jsx)(m.Z.TabPane,{tab:"\u624B\u673A\u767B\u5F55",children:(0,c.jsxs)(v.l0,{form:K,layout:"vertical",size:"large",onAutoSubmit:console.log,children:[(0,c.jsx)(I,{schema:N}),(0,c.jsx)(v.k4,{block:!0,size:"large",children:"\u767B\u5F55"})]})},"2")]}),(0,c.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,c.jsx)("a",{href:"#\u65B0\u7528\u6237\u6CE8\u518C",children:"\u65B0\u7528\u6237\u6CE8\u518C"}),(0,c.jsx)("a",{href:"#\u5FD8\u8BB0\u5BC6\u7801",children:"\u5FD8\u8BB0\u5BC6\u7801?"})]})]})})}},58024:function(j,x,i){"use strict";var p=i(38663),g=i.n(p),h=i(70347),m=i.n(h),O=i(71748),E=i(18106)},47673:function(j,x,i){"use strict";var p=i(38663),g=i.n(p),h=i(7104),m=i.n(h),O=i(57663)},71748:function(j,x,i){"use strict";var p=i(38663),g=i.n(p),h=i(18067),m=i.n(h)},70655:function(j,x,i){"use strict";i.d(x,{ZT:function(){return g},pi:function(){return h},_T:function(){return m},gn:function(){return O},fM:function(){return E},w6:function(){return T},mG:function(){return v},Jh:function(){return M},XA:function(){return w},CR:function(){return C},pr:function(){return B},ev:function(){return A}});var p=function(t,e){return p=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var u in r)Object.prototype.hasOwnProperty.call(r,u)&&(n[u]=r[u])},p(t,e)};function g(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");p(t,e);function n(){this.constructor=t}t.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}var h=function(){return h=Object.assign||function(e){for(var n,r=1,u=arguments.length;r<u;r++){n=arguments[r];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},h.apply(this,arguments)};function m(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var u=0,r=Object.getOwnPropertySymbols(t);u<r.length;u++)e.indexOf(r[u])<0&&Object.prototype.propertyIsEnumerable.call(t,r[u])&&(n[r[u]]=t[r[u]]);return n}function O(t,e,n,r){var u=arguments.length,o=u<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,n,r);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(o=(u<3?a(o):u>3?a(e,n,o):a(e,n))||o);return u>3&&o&&Object.defineProperty(e,n,o),o}function E(t,e){return function(n,r){e(n,r,t)}}function T(t,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(t,e)}function v(t,e,n,r){function u(o){return o instanceof n?o:new n(function(a){a(o)})}return new(n||(n=Promise))(function(o,a){function s(f){try{l(r.next(f))}catch(_){a(_)}}function y(f){try{l(r.throw(f))}catch(_){a(_)}}function l(f){f.done?o(f.value):u(f.value).then(s,y)}l((r=r.apply(t,e||[])).next())})}function M(t,e){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},r,u,o,a;return a={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function s(l){return function(f){return y([l,f])}}function y(l){if(r)throw new TypeError("Generator is already executing.");for(;a&&(a=0,l[0]&&(n=0)),n;)try{if(r=1,u&&(o=l[0]&2?u.return:l[0]?u.throw||((o=u.return)&&o.call(u),0):u.next)&&!(o=o.call(u,l[1])).done)return o;switch(u=0,o&&(l=[l[0]&2,o.value]),l[0]){case 0:case 1:o=l;break;case 4:return n.label++,{value:l[1],done:!1};case 5:n.label++,u=l[1],l=[0];continue;case 7:l=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(l[0]===6||l[0]===2)){n=0;continue}if(l[0]===3&&(!o||l[1]>o[0]&&l[1]<o[3])){n.label=l[1];break}if(l[0]===6&&n.label<o[1]){n.label=o[1],o=l;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(l);break}o[2]&&n.ops.pop(),n.trys.pop();continue}l=e.call(t,n)}catch(f){l=[6,f],u=0}finally{r=o=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}var S=Object.create?function(t,e,n,r){r===void 0&&(r=n);var u=Object.getOwnPropertyDescriptor(e,n);(!u||("get"in u?!e.__esModule:u.writable||u.configurable))&&(u={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(t,r,u)}:function(t,e,n,r){r===void 0&&(r=n),t[r]=e[n]};function F(t,e){for(var n in t)n!=="default"&&!Object.prototype.hasOwnProperty.call(e,n)&&S(e,t,n)}function w(t){var e=typeof Symbol=="function"&&Symbol.iterator,n=e&&t[e],r=0;if(n)return n.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function C(t,e){var n=typeof Symbol=="function"&&t[Symbol.iterator];if(!n)return t;var r=n.call(t),u,o=[],a;try{for(;(e===void 0||e-- >0)&&!(u=r.next()).done;)o.push(u.value)}catch(s){a={error:s}}finally{try{u&&!u.done&&(n=r.return)&&n.call(r)}finally{if(a)throw a.error}}return o}function D(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(C(arguments[e]));return t}function B(){for(var t=0,e=0,n=arguments.length;e<n;e++)t+=arguments[e].length;for(var r=Array(t),u=0,e=0;e<n;e++)for(var o=arguments[e],a=0,s=o.length;a<s;a++,u++)r[u]=o[a];return r}function A(t,e,n){if(n||arguments.length===2)for(var r=0,u=e.length,o;r<u;r++)(o||!(r in e))&&(o||(o=Array.prototype.slice.call(e,0,r)),o[r]=e[r]);return t.concat(o||Array.prototype.slice.call(e))}function c(t){return this instanceof c?(this.v=t,this):new c(t)}function L(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=n.apply(t,e||[]),u,o=[];return u={},a("next"),a("throw"),a("return"),u[Symbol.asyncIterator]=function(){return this},u;function a(d){r[d]&&(u[d]=function(P){return new Promise(function(R,G){o.push([d,P,R,G])>1||s(d,P)})})}function s(d,P){try{y(r[d](P))}catch(R){_(o[0][3],R)}}function y(d){d.value instanceof c?Promise.resolve(d.value.v).then(l,f):_(o[0][2],d)}function l(d){s("next",d)}function f(d){s("throw",d)}function _(d,P){d(P),o.shift(),o.length&&s(o[0][0],o[0][1])}}function U(t){var e,n;return e={},r("next"),r("throw",function(u){throw u}),r("return"),e[Symbol.iterator]=function(){return this},e;function r(u,o){e[u]=t[u]?function(a){return(n=!n)?{value:c(t[u](a)),done:u==="return"}:o?o(a):a}:o}}function W(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],n;return e?e.call(t):(t=typeof w=="function"?w(t):t[Symbol.iterator](),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(o){n[o]=t[o]&&function(a){return new Promise(function(s,y){a=t[o](a),u(s,y,a.done,a.value)})}}function u(o,a,s,y){Promise.resolve(y).then(function(l){o({value:l,done:s})},a)}}function K(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var I=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e};function Z(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var n in t)n!=="default"&&Object.prototype.hasOwnProperty.call(t,n)&&S(e,t,n);return I(e,t),e}function N(t){return t&&t.__esModule?t:{default:t}}function V(t,e,n,r){if(n==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?r:n==="a"?r.call(t):r?r.value:e.get(t)}function z(t,e,n,r,u){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!u)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!u:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?u.call(t,n):u?u.value=n:e.set(t,n),n}function b(t,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof t=="function"?e===t:t.has(e)}}}]);