(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-236466c0"],{"01f7":function(e,t,i){var n=i("8b75");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var r=i("499e").default;r("7f356092",n,!0,{sourceMap:!1,shadowMode:!1})},"0bb8":function(e,t,i){var n=i("78b7");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var r=i("499e").default;r("5ab41aa4",n,!0,{sourceMap:!1,shadowMode:!1})},"0c48":function(e,t,i){t=e.exports=i("2350")(!1),t.push([e.i,".van-list__error-text,.van-list__finished-text,.van-list__loading{color:#969799;font-size:3.733vw;line-height:13.333vw;text-align:center}.van-list__placeholder{height:0;pointer-events:none}",""])},"2a53":function(e,t,i){"use strict";i("3cd0"),i("d548")},"2bdd":function(e,t,i){"use strict";var n=i("d282");function r(e){var t=window.getComputedStyle(e),i="none"===t.display,n=null===e.offsetParent&&"fixed"!==t.position;return i||n}var a=i("a8c1"),o=i("5fbe"),l=i("543e"),c=Object(n["a"])("list"),s=c[0],u=c[1],d=c[2];t["a"]=s({mixins:[Object(o["a"])((function(e){this.scroller||(this.scroller=Object(a["b"])(this.$el)),e(this.scroller,"scroll",this.check)}))],model:{prop:"loading"},props:{error:Boolean,loading:Boolean,finished:Boolean,errorText:String,loadingText:String,finishedText:String,immediateCheck:{type:Boolean,default:!0},offset:{type:[Number,String],default:300},direction:{type:String,default:"down"}},data:function(){return{innerLoading:this.loading}},updated:function(){this.innerLoading=this.loading},mounted:function(){this.immediateCheck&&this.check()},watch:{loading:"check",finished:"check"},methods:{check:function(){var e=this;this.$nextTick((function(){if(!(e.innerLoading||e.finished||e.error)){var t,i=e.$el,n=e.scroller,a=e.offset,o=e.direction;t=n.getBoundingClientRect?n.getBoundingClientRect():{top:0,bottom:n.innerHeight};var l=t.bottom-t.top;if(!l||r(i))return!1;var c=!1,s=e.$refs.placeholder.getBoundingClientRect();c="up"===o?t.top-s.top<=a:s.bottom-t.bottom<=a,c&&(e.innerLoading=!0,e.$emit("input",!0),e.$emit("load"))}}))},clickErrorText:function(){this.$emit("update:error",!1),this.check()},genLoading:function(){var e=this.$createElement;if(this.innerLoading&&!this.finished)return e("div",{key:"loading",class:u("loading")},[this.slots("loading")||e(l["a"],{attrs:{size:"16"}},[this.loadingText||d("loading")])])},genFinishedText:function(){var e=this.$createElement;if(this.finished){var t=this.slots("finished")||this.finishedText;if(t)return e("div",{class:u("finished-text")},[t])}},genErrorText:function(){var e=this.$createElement;if(this.error){var t=this.slots("error")||this.errorText;if(t)return e("div",{on:{click:this.clickErrorText},class:u("error-text")},[t])}}},render:function(){var e=arguments[0],t=e("div",{ref:"placeholder",key:"placeholder",class:u("placeholder")});return e("div",{class:u(),attrs:{role:"feed","aria-busy":this.innerLoading}},["down"===this.direction?this.slots():t,this.genLoading(),this.genFinishedText(),this.genErrorText(),"up"===this.direction?this.slots():t])}})},"2c7a":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"layout__page"},[i("div",{staticClass:"layout__header"},[i("van-nav-bar",{attrs:{title:"名言警句三百篇","left-arrow":""},on:{"click-left":e.handleClickLeft}})],1),i("div",{directives:[{name:"touch",rawName:"v-touch:swipe",value:e.handleSwipeRight,expression:"handleSwipeRight",arg:"swipe"}],staticClass:"layout__body"},[i("van-cell-group",{staticClass:"info__list"},e._l(e.list,(function(e){return i("van-cell",{key:e.id,attrs:{title:e.content+"  --"+e.creator}})})),1),e.isLoading?i("div",{staticClass:"info__loading-wrapper"},[i("van-loading",{attrs:{type:"spinner",color:"#1989fa"}})],1):e._e()],1)])},r=[],a=(i("2397"),i("96cf"),i("3b8d")),o=i("d225"),l=i("b0b4"),c=i("4e2b"),s=i("308d"),u=i("6bb5"),d=(i("da02"),i("6b41")),f=(i("93b0"),i("2bdd")),v=(i("3ec1"),i("7744")),b=(i("2a53"),i("34e9")),h=(i("3cd0"),i("25bb"),i("543e")),p=i("9ab4"),g=i("60a3"),w=i("db18"),m=i("5339");function x(e){var t=_();return function(){var i,n=Object(u["a"])(e);if(t){var r=Object(u["a"])(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return Object(s["a"])(this,i)}}function _(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return window.$sentry.log({error:e,fileName:"/home/runner/work/mobile-web-best-practice/mobile-web-best-practice/src/views/quote/index.vue",lineNo:void 0,scope:"_isNativeReflectConstruct()"}),!1}}g["d"].use(d["a"]).use(f["a"]).use(v["a"]).use(b["a"]).use(h["a"]);var k=function(e){Object(c["a"])(i,e);var t=x(i);function i(){var e;return Object(o["a"])(this,i),e=t.apply(this,arguments),e.list=[],e.isLoading=!1,e}return Object(l["a"])(i,[{key:"handleClickLeft",value:function(){this.$router.go(-1)}},{key:"getQuoteList",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,this.isLoading=!0,e.next=4,m["a"].getQuoteList();case 4:this.list=e.sent,e.next=11;break;case 7:e.prev=7,e.t0=e["catch"](0),window.$sentry.log({error:e.t0,fileName:"/home/runner/work/mobile-web-best-practice/mobile-web-best-practice/src/views/quote/index.vue",lineNo:21,scope:"Quote -> value -> _getQuoteList"}),console.log(e.t0);case 11:return e.prev=11,this.isLoading=!1,e.finish(11);case 14:case"end":return e.stop()}}),e,this,[[0,7,11,14]])})));function t(){return e.apply(this,arguments)}return t}()},{key:"created",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.getQuoteList();case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()}]),i}(Object(g["b"])(w["a"]));k=Object(p["b"])([g["a"]],k);var y=k,O=y,j=(i("3bec"),i("2877")),R=Object(j["a"])(O,n,r,!1,null,"00deb010",null);t["default"]=R.exports},"34e9":function(e,t,i){"use strict";var n=i("2638"),r=i.n(n),a=i("d282"),o=i("ba31"),l=i("b1d2"),c=Object(a["a"])("cell-group"),s=c[0],u=c[1];function d(e,t,i,n){var a,c=e("div",r()([{class:[u({inset:t.inset}),(a={},a[l["e"]]=t.border,a)]},Object(o["b"])(n,!0)]),[null==i.default?void 0:i.default()]);return t.title||i.title?e("div",{key:n.data.key},[e("div",{class:u("title",{inset:t.inset})},[i.title?i.title():t.title]),c]):c}d.props={title:String,inset:Boolean,border:{type:Boolean,default:!0}},t["a"]=s(d)},"37ff":function(e,t,i){var n=i("0c48");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var r=i("499e").default;r("33b58afb",n,!0,{sourceMap:!1,shadowMode:!1})},"3bec":function(e,t,i){"use strict";i("0bb8")},"3ec1":function(e,t,i){"use strict";i("3cd0"),i("1a44"),i("acc2"),i("01f7")},7744:function(e,t,i){"use strict";var n=i("c31d"),r=i("2638"),a=i.n(r),o=i("d282"),l=i("a142"),c=i("ba31"),s=i("48f4"),u=i("dfaf"),d=i("ad06"),f=Object(o["a"])("cell"),v=f[0],b=f[1];function h(e,t,i,n){var r,o=t.icon,u=t.size,f=t.title,v=t.label,h=t.value,p=t.isLink,g=i.title||Object(l["c"])(f);function w(){var n=i.label||Object(l["c"])(v);if(n)return e("div",{class:[b("label"),t.labelClass]},[i.label?i.label():v])}function m(){if(g)return e("div",{class:[b("title"),t.titleClass],style:t.titleStyle},[i.title?i.title():e("span",[f]),w()])}function x(){var n=i.default||Object(l["c"])(h);if(n)return e("div",{class:[b("value",{alone:!g}),t.valueClass]},[i.default?i.default():e("span",[h])])}function _(){return i.icon?i.icon():o?e(d["a"],{class:b("left-icon"),attrs:{name:o,classPrefix:t.iconPrefix}}):void 0}function k(){var n=i["right-icon"];if(n)return n();if(p){var r=t.arrowDirection;return e(d["a"],{class:b("right-icon"),attrs:{name:r?"arrow-"+r:"arrow"}})}}function y(e){Object(c["a"])(n,"click",e),Object(s["a"])(n)}var O=null!=(r=t.clickable)?r:p,j={clickable:O,center:t.center,required:t.required,borderless:!t.border};return u&&(j[u]=u),e("div",a()([{class:b(j),attrs:{role:O?"button":null,tabindex:O?0:null},on:{click:y}},Object(c["b"])(n)]),[_(),m(),x(),k(),null==i.extra?void 0:i.extra()])}h.props=Object(n["a"])({},u["a"],s["c"]),t["a"]=v(h)},"78b7":function(e,t,i){t=e.exports=i("2350")(!1),t.push([e.i,".info__list[data-v-00deb010]{margin-top:5.333vw}.info__loading-wrapper[data-v-00deb010]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%}",""])},"7d68":function(e,t,i){t=e.exports=i("2350")(!1),t.push([e.i,".van-cell-group{background-color:#fff}.van-cell-group--inset{margin:0 4.267vw;overflow:hidden;border-radius:2.133vw}.van-cell-group__title{padding:4.267vw 4.267vw 2.133vw;color:#969799;font-size:3.733vw;line-height:4.267vw}.van-cell-group__title--inset{padding:4.267vw 4.267vw 2.133vw 8.533vw}",""])},"8b75":function(e,t,i){t=e.exports=i("2350")(!1),t.push([e.i,'.van-cell{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;box-sizing:border-box;width:100%;padding:2.667vw 4.267vw;overflow:hidden;color:#323233;font-size:3.733vw;line-height:6.4vw;background-color:#fff}.van-cell:after{position:absolute;box-sizing:border-box;content:" ";pointer-events:none;right:4.267vw;bottom:0;left:4.267vw;border-bottom:1px solid #ebedf0;-webkit-transform:scaleY(.5);transform:scaleY(.5)}.van-cell--borderless:after,.van-cell:last-child:after{display:none}.van-cell__label{margin-top:1.067vw;color:#969799;font-size:3.2vw;line-height:4.8vw}.van-cell__title,.van-cell__value{-webkit-box-flex:1;-webkit-flex:1;flex:1}.van-cell__value{position:relative;overflow:hidden;color:#969799;text-align:right;vertical-align:middle;word-wrap:break-word}.van-cell__value--alone{color:#323233;text-align:left}.van-cell__left-icon,.van-cell__right-icon{height:6.4vw;font-size:4.267vw;line-height:6.4vw}.van-cell__left-icon{margin-right:1.067vw}.van-cell__right-icon{margin-left:1.067vw;color:#969799}.van-cell--clickable{cursor:pointer}.van-cell--clickable:active{background-color:#f2f3f5}.van-cell--required{overflow:visible}.van-cell--required:before{position:absolute;left:2.133vw;color:#ee0a24;font-size:3.733vw;content:"*"}.van-cell--center{-webkit-box-align:center;-webkit-align-items:center;align-items:center}.van-cell--large{padding-top:3.2vw;padding-bottom:3.2vw}.van-cell--large .van-cell__title{font-size:4.267vw}.van-cell--large .van-cell__label{font-size:3.733vw}',""])},"93b0":function(e,t,i){"use strict";i("3cd0"),i("25bb"),i("37ff")},d548:function(e,t,i){var n=i("7d68");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var r=i("499e").default;r("22cb4fc5",n,!0,{sourceMap:!1,shadowMode:!1})},db18:function(e,t,i){"use strict";i("2397"),i("96cf");var n=i("3b8d"),r=i("d225"),a=i("b0b4"),o=i("4e2b"),l=i("308d"),c=i("6bb5"),s=i("9ab4"),u=i("60a3");function d(e){var t=f();return function(){var i,n=Object(c["a"])(e);if(t){var r=Object(c["a"])(this).constructor;i=Reflect.construct(n,arguments,r)}else i=n.apply(this,arguments);return Object(l["a"])(this,i)}}function f(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return window.$sentry.log({error:e,fileName:"/home/runner/work/mobile-web-best-practice/mobile-web-best-practice/src/utils/swipe-right-mixin.ts",lineNo:void 0,scope:"_isNativeReflectConstruct()"}),!1}}var v=function(e){Object(o["a"])(i,e);var t=d(i);function i(){return Object(r["a"])(this,i),t.apply(this,arguments)}return Object(a["a"])(i,[{key:"handleSwipeRight",value:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var i,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:i=t.deltaX,n=t.direction,4===n&&Math.abs(i)>10&&this.$router.go(-1);case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()}]),i}(u["d"]);v=Object(s["b"])([u["a"]],v),t["a"]=v},dfaf:function(e,t,i){"use strict";i.d(t,"a",(function(){return n}));var n={icon:String,size:String,center:Boolean,isLink:Boolean,required:Boolean,iconPrefix:String,titleStyle:null,titleClass:null,valueClass:null,labelClass:null,title:[Number,String],value:[Number,String],label:[Number,String],arrowDirection:String,border:{type:Boolean,default:!0},clickable:{type:Boolean,default:null}}}}]);
//# sourceMappingURL=chunk-236466c0.a237f146.js.map