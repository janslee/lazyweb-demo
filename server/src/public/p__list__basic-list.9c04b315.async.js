(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[3012],{22452:function(A,F,e){"use strict";var u=e(28991),p=e(81253),E=e(85893),d=e(67294),m=e(66758),x=e(18603),h=["fieldProps","proFieldProps"],C="dateTime",Z=d.forwardRef(function(c,g){var l=c.fieldProps,j=c.proFieldProps,P=(0,p.Z)(c,h),s=(0,d.useContext)(m.Z);return(0,E.jsx)(x.Z,(0,u.Z)({ref:g,fieldProps:(0,u.Z)({getPopupContainer:s.getPopupContainer},l),valueType:C,proFieldProps:j,filedConfig:{valueType:C,customLightMode:!0}},P))});F.Z=Z},64317:function(A,F,e){"use strict";var u=e(28991),p=e(81253),E=e(85893),d=e(22270),m=e(67294),x=e(66758),h=e(18603),C=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","showSearch","options"],Z=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","options"],c=m.forwardRef(function(s,y){var G=s.fieldProps,Y=s.children,O=s.params,X=s.proFieldProps,$=s.mode,H=s.valueEnum,b=s.request,J=s.showSearch,L=s.options,B=(0,p.Z)(s,C),Q=(0,m.useContext)(x.Z);return(0,E.jsx)(h.Z,(0,u.Z)((0,u.Z)({valueEnum:(0,d.h)(H),request:b,params:O,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,u.Z)({options:L,mode:$,showSearch:J,getPopupContainer:Q.getPopupContainer},G),ref:y,proFieldProps:X},B),{},{children:Y}))}),g=m.forwardRef(function(s,y){var G=s.fieldProps,Y=s.children,O=s.params,X=s.proFieldProps,$=s.mode,H=s.valueEnum,b=s.request,J=s.options,L=(0,p.Z)(s,Z),B=(0,u.Z)({options:J,mode:$||"multiple",labelInValue:!0,showSearch:!0,showArrow:!1,autoClearSearchValue:!0,optionLabelProp:"label"},G),Q=(0,m.useContext)(x.Z);return(0,E.jsx)(h.Z,(0,u.Z)((0,u.Z)({valueEnum:(0,d.h)(H),request:b,params:O,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,u.Z)({getPopupContainer:Q.getPopupContainer},B),ref:y,proFieldProps:X},L),{},{children:Y}))}),l=c,j=g,P=l;P.SearchSelect=j,P.displayName="ProFormComponent",F.Z=P},90672:function(A,F,e){"use strict";var u=e(28991),p=e(81253),E=e(85893),d=e(67294),m=e(18603),x=["fieldProps","proFieldProps"],h=function(Z,c){var g=Z.fieldProps,l=Z.proFieldProps,j=(0,p.Z)(Z,x);return(0,E.jsx)(m.Z,(0,u.Z)({ref:c,valueType:"textarea",fieldProps:g,proFieldProps:l},j))};F.Z=d.forwardRef(h)},5966:function(A,F,e){"use strict";var u=e(28991),p=e(81253),E=e(85893),d=e(18603),m=["fieldProps","proFieldProps"],x=["fieldProps","proFieldProps"],h="text",C=function(l){var j=l.fieldProps,P=l.proFieldProps,s=(0,p.Z)(l,m);return(0,E.jsx)(d.Z,(0,u.Z)({valueType:h,fieldProps:j,filedConfig:{valueType:h},proFieldProps:P},s))},Z=function(l){var j=l.fieldProps,P=l.proFieldProps,s=(0,p.Z)(l,x);return(0,E.jsx)(d.Z,(0,u.Z)({valueType:"password",fieldProps:j,proFieldProps:P,filedConfig:{valueType:h}},s))},c=C;c.Password=Z,c.displayName="ProFormComponent",F.Z=c},7763:function(A){A.exports={standardList:"standardList___pRhsd",headerInfo:"headerInfo___3KrKX",listContent:"listContent___weIUQ",listContentItem:"listContentItem___S_LBX",extraContentSearch:"extraContentSearch___1lMSQ",listCard:"listCard___1aWw-",standardListForm:"standardListForm___1KJ6f",formResult:"formResult___1XdZP"}},68348:function(A,F,e){"use strict";e.r(F),e.d(F,{BasicList:function(){return oe},default:function(){return Te}});var u=e(57663),p=e(71577),E=e(54421),d=e(38272),m=e(94233),x=e(51890),h=e(58024),C=e(91894),Z=e(13062),c=e(71230),g=e(89032),l=e(15746),j=e(59250),P=e(13013),s=e(30887),y=e(18515),G=e(71194),Y=e(50146),O=e(2824),X=e(34669),$=e(54458),H=e(47673),b=e(4107),J=e(88983),L=e(47933),B=e(67294),Q=e(57254),ce=e(49101),pe=e(75362),I=e(25377),ve=e(30381),me=e.n(ve),Ve=e(57106),he=e(99683),D=e(39428),V=e(3182),Pe=e(37476),fe=e(5966),Fe=e(22452),Ee=e(64317),xe=e(90672),Ce=e(7763),f=e.n(Ce),t=e(85893),Ze=function(a){var o=a.done,r=a.visible,M=a.current,W=a.onDone,K=a.onSubmit,re=a.children;return r?(0,t.jsx)(Pe.Y,{visible:r,title:o?null:"\u4EFB\u52A1".concat(M?"\u7F16\u8F91":"\u6DFB\u52A0"),className:f().standardListForm,width:640,onFinish:function(){var S=(0,V.Z)((0,D.Z)().mark(function z(U){return(0,D.Z)().wrap(function(N){for(;;)switch(N.prev=N.next){case 0:K(U);case 1:case"end":return N.stop()}},z)}));return function(z){return S.apply(this,arguments)}}(),initialValues:M,submitter:{render:function(z,U){return o?null:U}},trigger:(0,t.jsx)(t.Fragment,{children:re}),modalProps:{onCancel:function(){return W()},destroyOnClose:!0,bodyStyle:o?{padding:"72px 0"}:{}},children:o?(0,t.jsx)(he.ZP,{status:"success",title:"\u64CD\u4F5C\u6210\u529F",subTitle:"\u4E00\u7CFB\u5217\u7684\u4FE1\u606F\u63CF\u8FF0\uFF0C\u5F88\u77ED\u540C\u6837\u4E5F\u53EF\u4EE5\u5E26\u6807\u70B9\u3002",extra:(0,t.jsx)(p.Z,{type:"primary",onClick:W,children:"\u77E5\u9053\u4E86"}),className:f().formResult}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(fe.Z,{name:"title",label:"\u4EFB\u52A1\u540D\u79F0",rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0"}],placeholder:"\u8BF7\u8F93\u5165"}),(0,t.jsx)(Fe.Z,{name:"createdAt",label:"\u5F00\u59CB\u65F6\u95F4",rules:[{required:!0,message:"\u8BF7\u9009\u62E9\u5F00\u59CB\u65F6\u95F4"}],fieldProps:{style:{width:"100%"}},placeholder:"\u8BF7\u9009\u62E9"}),(0,t.jsx)(Ee.Z,{name:"owner",label:"\u4EFB\u52A1\u8D1F\u8D23\u4EBA",rules:[{required:!0,message:"\u8BF7\u9009\u62E9\u4EFB\u52A1\u8D1F\u8D23\u4EBA"}],options:[{label:"\u4ED8\u6653\u6653",value:"xiao"},{label:"\u5468\u6BDB\u6BDB",value:"mao"}],placeholder:"\u8BF7\u9009\u62E9\u7BA1\u7406\u5458"}),(0,t.jsx)(xe.Z,{name:"subDescription",label:"\u4EA7\u54C1\u63CF\u8FF0",rules:[{message:"\u8BF7\u8F93\u5165\u81F3\u5C11\u4E94\u4E2A\u5B57\u7B26\u7684\u4EA7\u54C1\u63CF\u8FF0\uFF01",min:5}],placeholder:"\u8BF7\u8F93\u5165\u81F3\u5C11\u4E94\u4E2A\u5B57\u7B26"})]})}):null},je=Ze,R=e(11849);function De(i){return w.apply(this,arguments)}function w(){return w=(0,V.Z)((0,D.Z)().mark(function i(a){return(0,D.Z)().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",(0,I.WY)("/api/get_list",{params:a}));case 1:case"end":return r.stop()}},i)})),w.apply(this,arguments)}function Me(i){return k.apply(this,arguments)}function k(){return k=(0,V.Z)((0,D.Z)().mark(function i(a){return(0,D.Z)().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",(0,I.WY)("/api/post_fake_list",{method:"POST",data:(0,R.Z)((0,R.Z)({},a),{},{method:"delete"})}));case 1:case"end":return r.stop()}},i)})),k.apply(this,arguments)}function ge(i){return _.apply(this,arguments)}function _(){return _=(0,V.Z)((0,D.Z)().mark(function i(a){return(0,D.Z)().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",(0,I.WY)("/api/post_fake_list",{method:"POST",data:(0,R.Z)((0,R.Z)({},a),{},{method:"post"})}));case 1:case"end":return r.stop()}},i)})),_.apply(this,arguments)}function ye(i){return q.apply(this,arguments)}function q(){return q=(0,V.Z)((0,D.Z)().mark(function i(a){return(0,D.Z)().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",(0,I.WY)("/api/post_fake_list",{method:"POST",data:(0,R.Z)((0,R.Z)({},a),{},{method:"update"})}));case 1:case"end":return r.stop()}},i)})),q.apply(this,arguments)}var ee=L.ZP.Button,Oe=L.ZP.Group,Be=b.Z.Search,te=function(a){var o=a.title,r=a.value,M=a.bordered;return(0,t.jsxs)("div",{className:f().headerInfo,children:[(0,t.jsx)("span",{children:o}),(0,t.jsx)("p",{children:r}),M&&(0,t.jsx)("em",{})]})},Se=function(a){var o=a.data,r=o.owner,M=o.createdAt,W=o.percent,K=o.status;return(0,t.jsxs)("div",{className:f().listContent,children:[(0,t.jsxs)("div",{className:f().listContentItem,children:[(0,t.jsx)("span",{children:"Owner"}),(0,t.jsx)("p",{children:r})]}),(0,t.jsxs)("div",{className:f().listContentItem,children:[(0,t.jsx)("span",{children:"\u5F00\u59CB\u65F6\u95F4"}),(0,t.jsx)("p",{children:me()(M).format("YYYY-MM-DD HH:mm")})]}),(0,t.jsx)("div",{className:f().listContentItem,children:(0,t.jsx)($.Z,{percent:W,status:K,strokeWidth:6,style:{width:180}})})]})},oe=function(){var a=(0,B.useState)(!1),o=(0,O.Z)(a,2),r=o[0],M=o[1],W=(0,B.useState)(!1),K=(0,O.Z)(W,2),re=K[0],S=K[1],z=(0,B.useState)(void 0),U=(0,O.Z)(z,2),le=U[0],N=U[1],se=(0,I.QT)(function(){return De({count:50})}),ne=se.data,Ae=se.loading,Le=se.mutate,Ie=(0,I.QT)(function(v,n){return v==="remove"?Me(n):v==="update"?ye(n):ge(n)},{manual:!0,onSuccess:function(n){Le(n)}}),ue=Ie.run,ie=(ne==null?void 0:ne.list)||[],Re={showSizeChanger:!0,showQuickJumper:!0,pageSize:5,total:ie.length},de=function(n){S(!0),N(n)},We=function(n){ue("remove",{id:n})},Ke=function(n,T){n==="edit"?de(T):n==="delete"&&Y.Z.confirm({title:"\u5220\u9664\u4EFB\u52A1",content:"\u786E\u5B9A\u5220\u9664\u8BE5\u4EFB\u52A1\u5417\uFF1F",okText:"\u786E\u8BA4",cancelText:"\u53D6\u6D88",onOk:function(){return We(T.id)}})},Ue=(0,t.jsxs)("div",{className:f().extraContent,children:[(0,t.jsxs)(Oe,{defaultValue:"all",children:[(0,t.jsx)(ee,{value:"all",children:"\u5168\u90E8"}),(0,t.jsx)(ee,{value:"progress",children:"\u8FDB\u884C\u4E2D"}),(0,t.jsx)(ee,{value:"waiting",children:"\u7B49\u5F85\u4E2D"})]}),(0,t.jsx)(Be,{className:f().extraContentSearch,placeholder:"\u8BF7\u8F93\u5165",onSearch:function(){return{}}})]}),Ne=function(n){var T=n.item;return(0,t.jsx)(P.Z,{overlay:(0,t.jsxs)(y.Z,{onClick:function(be){var Qe=be.key;return Ke(Qe,T)},children:[(0,t.jsx)(y.Z.Item,{children:"\u7F16\u8F91"},"edit"),(0,t.jsx)(y.Z.Item,{children:"\u5220\u9664"},"delete")]}),children:(0,t.jsxs)("a",{children:["\u66F4\u591A ",(0,t.jsx)(Q.Z,{})]})})},Ye=function(){M(!1),S(!1),N({})},$e=function(n){M(!0);var T=n!=null&&n.id?"update":"add";ue(T,n)};return(0,t.jsxs)("div",{children:[(0,t.jsx)(pe.ZP,{children:(0,t.jsxs)("div",{className:f().standardList,children:[(0,t.jsx)(C.Z,{bordered:!1,children:(0,t.jsxs)(c.Z,{children:[(0,t.jsx)(l.Z,{sm:8,xs:24,children:(0,t.jsx)(te,{title:"\u6211\u7684\u5F85\u529E",value:"8\u4E2A\u4EFB\u52A1",bordered:!0})}),(0,t.jsx)(l.Z,{sm:8,xs:24,children:(0,t.jsx)(te,{title:"\u672C\u5468\u4EFB\u52A1\u5E73\u5747\u5904\u7406\u65F6\u95F4",value:"32\u5206\u949F",bordered:!0})}),(0,t.jsx)(l.Z,{sm:8,xs:24,children:(0,t.jsx)(te,{title:"\u672C\u5468\u5B8C\u6210\u4EFB\u52A1\u6570",value:"24\u4E2A\u4EFB\u52A1"})})]})}),(0,t.jsx)(C.Z,{className:f().listCard,bordered:!1,title:"\u57FA\u672C\u5217\u8868",style:{marginTop:24},bodyStyle:{padding:"0 32px 40px 32px"},extra:Ue,children:(0,t.jsx)(d.ZP,{size:"large",rowKey:"id",loading:Ae,pagination:Re,dataSource:ie,renderItem:function(n){return(0,t.jsxs)(d.ZP.Item,{actions:[(0,t.jsx)("a",{onClick:function(ae){ae.preventDefault(),de(n)},children:"\u7F16\u8F91"},"edit"),(0,t.jsx)(Ne,{item:n},"more")],children:[(0,t.jsx)(d.ZP.Item.Meta,{avatar:(0,t.jsx)(x.C,{src:n.logo,shape:"square",size:"large"}),title:(0,t.jsx)("a",{href:n.href,children:n.title}),description:n.subDescription}),(0,t.jsx)(Se,{data:n})]})}})})]})}),(0,t.jsxs)(p.Z,{type:"dashed",onClick:function(){S(!0)},style:{width:"100%",marginBottom:8},children:[(0,t.jsx)(ce.Z,{}),"\u6DFB\u52A0"]}),(0,t.jsx)(je,{done:r,visible:re,current:le,onDone:Ye,onSubmit:$e})]})},Te=oe}}]);
