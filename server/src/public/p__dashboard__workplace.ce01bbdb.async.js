(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[8767],{49843:function(d,o,t){"use strict";var r=t(67294),u=t(14547),m=t(29640),p=t(79360),N=t(24770),c=t(80803),T=function(a,h){var P={};for(var l in a)Object.prototype.hasOwnProperty.call(a,l)&&h.indexOf(l)<0&&(P[l]=a[l]);if(a!=null&&typeof Object.getOwnPropertySymbols=="function")for(var g=0,l=Object.getOwnPropertySymbols(a);g<l.length;g++)h.indexOf(l[g])<0&&Object.prototype.propertyIsEnumerable.call(a,l[g])&&(P[l[g]]=a[l[g]]);return P},E=(0,r.forwardRef)(function(a,h){var P=a.chartRef,l=a.style,g=l===void 0?{height:"inherit"}:l,B=a.className,I=a.loading,j=a.loadingTemplate,C=a.errorTemplate,R=T(a,["chartRef","style","className","loading","loadingTemplate","errorTemplate"]),L=(0,m.Z)(u.Fk,R),Z=L.chart,G=L.container;return(0,r.useEffect)(function(){(0,p.J)(P,Z.current)},[Z.current]),(0,r.useImperativeHandle)(h,function(){return{getChart:function(){return Z.current}}}),r.createElement(N.Z,{errorTemplate:C},I&&r.createElement(c.Z,{loadingTemplate:j,theme:a.theme}),r.createElement("div",{className:B,style:g,ref:G}))});o.Z=E},84489:function(d){d.exports={linkGroup:"linkGroup___3u5k3"}},27322:function(d){d.exports={activitiesList:"activitiesList___1iz4w",username:"username___2CaQo",event:"event___37Bra",pageHeaderContent:"pageHeaderContent___1v9Rj",avatar:"avatar___2REGU",content:"content___2JXYM",contentTitle:"contentTitle___2ZQYk",extraContent:"extraContent___171XZ",statItem:"statItem___WnzK8",members:"members___pCbZL",member:"member___1PrAP",projectList:"projectList___1-phY",cardTitle:"cardTitle___i2mGR",projectGrid:"projectGrid___2_ET-",projectItemContent:"projectItemContent___1Af7z",datetime:"datetime___3wNS1",activeCard:"activeCard___2L47N"}},68122:function(d,o,t){"use strict";t.r(o),t.d(o,{default:function(){return st}});var r=t(13062),u=t(71230),m=t(89032),p=t(15746),N=t(58024),c=t(91894),T=t(54421),E=t(38272),a=t(95300),h=t(7277),P=t(94233),l=t(51890),g=t(71748),B=t(19586),I=t(49843),j=t(38563),C=t(73727),R=t(78009),L=t(30381),Z=t.n(L),G=t(57663),H=t(71577),$=t(67294),k=t(49101),Q=t(84489),X=t.n(Q),e=t(85893),S=function(v){var n=v.links,D=v.linkElement,M=v.onAdd;return(0,e.jsxs)("div",{className:X().linkGroup,children:[n.map(function(y){return(0,$.createElement)(D,{key:"linkGroup-item-".concat(y.id||y.title),to:y.href,href:y.href},y.title)}),(0,e.jsxs)(H.Z,{size:"small",type:"primary",ghost:!0,onClick:M,children:[(0,e.jsx)(k.Z,{})," \u6DFB\u52A0"]})]})};S.defaultProps={links:[],onAdd:function(){},linkElement:"a"};var J=S,V=t(27322),s=t.n(V),_=t(39428),F=t(3182);function w(){return b.apply(this,arguments)}function b(){return b=(0,F.Z)((0,_.Z)().mark(function x(){return(0,_.Z)().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,j.WY)("/api/project/notice"));case 1:case"end":return n.stop()}},x)})),b.apply(this,arguments)}function q(){return U.apply(this,arguments)}function U(){return U=(0,F.Z)((0,_.Z)().mark(function x(){return(0,_.Z)().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,j.WY)("/api/activities"));case 1:case"end":return n.stop()}},x)})),U.apply(this,arguments)}function tt(){return W.apply(this,arguments)}function W(){return W=(0,F.Z)((0,_.Z)().mark(function x(){return(0,_.Z)().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,j.WY)("/api/fake_workplace_chart_data"));case 1:case"end":return n.stop()}},x)})),W.apply(this,arguments)}var et=[{title:"\u64CD\u4F5C\u4E00",href:""},{title:"\u64CD\u4F5C\u4E8C",href:""},{title:"\u64CD\u4F5C\u4E09",href:""},{title:"\u64CD\u4F5C\u56DB",href:""},{title:"\u64CD\u4F5C\u4E94",href:""},{title:"\u64CD\u4F5C\u516D",href:""}],at=function(v){var n=v.currentUser,D=n&&Object.keys(n).length;return D?(0,e.jsxs)("div",{className:s().pageHeaderContent,children:[(0,e.jsx)("div",{className:s().avatar,children:(0,e.jsx)(l.C,{size:"large",src:n.avatar})}),(0,e.jsxs)("div",{className:s().content,children:[(0,e.jsxs)("div",{className:s().contentTitle,children:["\u65E9\u5B89\uFF0C",n.name,"\uFF0C\u795D\u4F60\u5F00\u5FC3\u6BCF\u4E00\u5929\uFF01"]}),(0,e.jsxs)("div",{children:[n.title," |",n.group]})]})]}):(0,e.jsx)(B.Z,{avatar:!0,paragraph:{rows:1},active:!0})},nt=function(){return(0,e.jsxs)("div",{className:s().extraContent,children:[(0,e.jsx)("div",{className:s().statItem,children:(0,e.jsx)(h.Z,{title:"\u9879\u76EE\u6570",value:56})}),(0,e.jsx)("div",{className:s().statItem,children:(0,e.jsx)(h.Z,{title:"\u56E2\u961F\u5185\u6392\u540D",value:8,suffix:"/ 24"})}),(0,e.jsx)("div",{className:s().statItem,children:(0,e.jsx)(h.Z,{title:"\u9879\u76EE\u8BBF\u95EE",value:2223})})]})},rt=function(){var v,n=(0,j.QT)(w),D=n.loading,M=n.data,y=M===void 0?[]:M,K=(0,j.QT)(q),z=K.loading,Y=K.data,lt=Y===void 0?[]:Y,it=(0,j.QT)(tt),O=it.data,dt=function(f){var ut=f.template.split(/@\{([^{}]*)\}/gi).map(function(A){return f[A]?(0,e.jsx)("a",{href:f[A].link,children:f[A].name},f[A].name):A});return(0,e.jsx)(E.ZP.Item,{children:(0,e.jsx)(E.ZP.Item.Meta,{avatar:(0,e.jsx)(l.C,{src:f.user.avatar}),title:(0,e.jsxs)("span",{children:[(0,e.jsx)("a",{className:s().username,children:f.user.name}),"\xA0",(0,e.jsx)("span",{className:s().event,children:ut})]}),description:(0,e.jsx)("span",{className:s().datetime,title:f.updatedAt,children:Z()(f.updatedAt).fromNow()})})},f.id)},ot=[{key:"detail",tab:"\u8BE6\u60C5",children:(0,e.jsx)("div",{children:"\u8BE6\u60C511"})},{key:"rule",tab:"\u89C4\u5219",children:(0,e.jsx)("div",{children:"\u89C4\u521922"})}];return(0,e.jsx)(R.ZP,{tabList:ot,content:(0,e.jsx)(at,{currentUser:{avatar:"https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",name:"\u5434\u5F66\u7956",userid:"00000001",email:"antdesign@alipay.com",signature:"\u6D77\u7EB3\u767E\u5DDD\uFF0C\u6709\u5BB9\u4E43\u5927",title:"\u4EA4\u4E92\u4E13\u5BB6",group:"\u8682\u8681\u91D1\u670D\uFF0D\u67D0\u67D0\u67D0\u4E8B\u4E1A\u7FA4\uFF0D\u67D0\u67D0\u5E73\u53F0\u90E8\uFF0D\u67D0\u67D0\u6280\u672F\u90E8\uFF0DUED"}}),extraContent:(0,e.jsx)(nt,{}),children:(0,e.jsxs)(u.Z,{gutter:24,children:[(0,e.jsxs)(p.Z,{xl:16,lg:24,md:24,sm:24,xs:24,children:[(0,e.jsx)(c.Z,{className:s().projectList,style:{marginBottom:24},title:"\u8FDB\u884C\u4E2D\u7684\u9879\u76EE",bordered:!1,extra:(0,e.jsx)(C.rU,{to:"/",children:"\u5168\u90E8\u9879\u76EE"}),loading:D,bodyStyle:{padding:0},children:y.map(function(i){return(0,e.jsx)(c.Z.Grid,{className:s().projectGrid,children:(0,e.jsxs)(c.Z,{bodyStyle:{padding:0},bordered:!1,children:[(0,e.jsx)(c.Z.Meta,{title:(0,e.jsxs)("div",{className:s().cardTitle,children:[(0,e.jsx)(l.C,{size:"small",src:i.logo}),(0,e.jsx)(C.rU,{to:i.href,children:i.title})]}),description:i.description}),(0,e.jsxs)("div",{className:s().projectItemContent,children:[(0,e.jsx)(C.rU,{to:i.memberLink,children:i.member||""}),i.updatedAt&&(0,e.jsx)("span",{className:s().datetime,title:i.updatedAt,children:Z()(i.updatedAt).fromNow()})]})]})},i.id)})}),(0,e.jsx)(c.Z,{bodyStyle:{padding:0},bordered:!1,className:s().activeCard,title:"\u52A8\u6001",loading:z,children:(0,e.jsx)(E.ZP,{loading:z,renderItem:function(f){return dt(f)},dataSource:lt,className:s().activitiesList,size:"large"})})]}),(0,e.jsxs)(p.Z,{xl:8,lg:24,md:24,sm:24,xs:24,children:[(0,e.jsx)(c.Z,{style:{marginBottom:24},title:"\u5FEB\u901F\u5F00\u59CB / \u4FBF\u6377\u5BFC\u822A",bordered:!1,bodyStyle:{padding:0},children:(0,e.jsx)(J,{onAdd:function(){},links:et,linkElement:C.rU})}),(0,e.jsx)(c.Z,{style:{marginBottom:24},bordered:!1,title:"XX \u6307\u6570",loading:(O==null||(v=O.radarData)===null||v===void 0?void 0:v.length)===0,children:(0,e.jsx)("div",{className:s().chart,children:(0,e.jsx)(I.Z,{height:343,data:(O==null?void 0:O.radarData)||[],angleField:"label",seriesField:"name",radiusField:"value",area:{visible:!1},point:{visible:!0},legend:{position:"bottom-center"}})})}),(0,e.jsx)(c.Z,{bodyStyle:{paddingTop:12,paddingBottom:12},bordered:!1,title:"\u56E2\u961F",loading:D,children:(0,e.jsx)("div",{className:s().members,children:(0,e.jsx)(u.Z,{gutter:48,children:y.map(function(i){return(0,e.jsx)(p.Z,{span:12,children:(0,e.jsxs)(C.rU,{to:i.href,children:[(0,e.jsx)(l.C,{src:i.logo,size:"small"}),(0,e.jsx)("span",{className:s().member,children:i.member})]})},"members-item-".concat(i.id))})})})})]})]})})},st=rt},15746:function(d,o,t){"use strict";var r=t(21584);o.Z=r.Z},89032:function(d,o,t){"use strict";var r=t(38663),u=t.n(r),m=t(6999)},71230:function(d,o,t){"use strict";var r=t(92820);o.Z=r.Z},13062:function(d,o,t){"use strict";var r=t(38663),u=t.n(r),m=t(6999)},29932:function(d){function o(t,r){for(var u=-1,m=t==null?0:t.length,p=Array(m);++u<m;)p[u]=r(t[u],u,t);return p}d.exports=o},40371:function(d){function o(t){return function(r){return r==null?void 0:r[t]}}d.exports=o},80531:function(d,o,t){var r=t(62705),u=t(29932),m=t(1469),p=t(33448),N=1/0,c=r?r.prototype:void 0,T=c?c.toString:void 0;function E(a){if(typeof a=="string")return a;if(m(a))return u(a,E)+"";if(p(a))return T?T.call(a):"";var h=a+"";return h=="0"&&1/a==-N?"-0":h}d.exports=E},79833:function(d,o,t){var r=t(80531);function u(m){return m==null?"":r(m)}d.exports=u}}]);