(function(r){function t(t){for(var s,l,i=t[0],n=t[1],p=t[2],h=0,u=[];h<i.length;h++)l=i[h],a[l]&&u.push(a[l][0]),a[l]=0;for(s in n)Object.prototype.hasOwnProperty.call(n,s)&&(r[s]=n[s]);c&&c(t);while(u.length)u.shift()();return o.push.apply(o,p||[]),e()}function e(){for(var r,t=0;t<o.length;t++){for(var e=o[t],s=!0,i=1;i<e.length;i++){var n=e[i];0!==a[n]&&(s=!1)}s&&(o.splice(t--,1),r=l(l.s=e[0]))}return r}var s={},a={1:0},o=[];function l(t){if(s[t])return s[t].exports;var e=s[t]={i:t,l:!1,exports:{}};return r[t].call(e.exports,e,e.exports,l),e.l=!0,e.exports}l.m=r,l.c=s,l.d=function(r,t,e){l.o(r,t)||Object.defineProperty(r,t,{enumerable:!0,get:e})},l.r=function(r){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},l.t=function(r,t){if(1&t&&(r=l(r)),8&t)return r;if(4&t&&"object"===typeof r&&r&&r.__esModule)return r;var e=Object.create(null);if(l.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:r}),2&t&&"string"!=typeof r)for(var s in r)l.d(e,s,function(t){return r[t]}.bind(null,s));return e},l.n=function(r){var t=r&&r.__esModule?function(){return r["default"]}:function(){return r};return l.d(t,"a",t),t},l.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},l.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],n=i.push.bind(i);i.push=t,i=i.slice();for(var p=0;p<i.length;p++)t(i[p]);var c=n;o.push([3,0]),e()})({3:function(r,t,e){r.exports=e("Vtdi")},OTIl:function(r,t,e){r.exports=e.p+"gh-pages/img/zalog.ro-logo.15a5f8fc.svg"},Vtdi:function(r,t,e){"use strict";e.r(t);e("VRzm");var s=e("Kw5r"),a=e("AoTc"),o=e.n(a),l=e("zlta"),i=e.n(l),n=(e("v0CA"),function(){var r=this,t=r.$createElement,s=r._self._c||t;return s("div",{attrs:{id:"app"}},[s("v-app",[s("v-navigation-drawer",{staticClass:"pa-0",attrs:{app:"",fixed:"",clipped:""},model:{value:r.drawer,callback:function(t){r.drawer=t},expression:"drawer"}},[s("v-layout",{attrs:{column:"","fill-height":""}},[s("v-list",{staticClass:"pa-0",attrs:{dense:""}},[s("v-divider"),s("v-list-tile",{attrs:{to:"/"}},[s("v-list-tile-content",[s("v-list-tile-title",{domProps:{innerHTML:r._s("Projects")}})],1)],1)],1),s("v-spacer"),s("v-list",{staticClass:"pa-0 hidden-md-and-up",attrs:{dense:""}},[s("v-divider"),r._l(r.socialProfiles,function(t,e){return s("v-list-tile",{key:e,attrs:{href:t.href,target:"_blank"}},[s("v-list-tile-action",[s("v-icon",[r._v(r._s(t.icon))])],1),s("v-list-tile-content",[s("v-list-tile-title",{domProps:{innerHTML:r._s(t.text)}})],1)],1)})],2)],1)],1),s("v-toolbar",{attrs:{app:"",fixed:"","clipped-left":"",dark:"",color:"black"}},[s("v-toolbar-side-icon",{nativeOn:{click:function(t){r.drawer=!r.drawer}}}),s("v-avatar",{attrs:{size:"36"}},[s("v-btn",{attrs:{icon:"",to:"/"}},[s("img",{attrs:{src:e("OTIl"),alt:"avatar"}})])],1),s("v-toolbar-title",[s("router-link",{attrs:{to:"/"}},[r._v("Zălog Cătălin")])],1),s("v-spacer"),s("div",{staticClass:"hidden-sm-and-down"},r._l(r.socialProfiles,function(t,e){return s("v-btn",{key:e,attrs:{href:t.href,target:"_blank",icon:"",flat:""}},[s("v-icon",{attrs:{size:"20px"}},[r._v(r._s(t.icon))])],1)}))],1),s("v-content",[s("v-container",{attrs:{fluid:""}},[s("router-view")],1)],1),s("v-footer",{attrs:{app:"",absolute:"",height:"auto"}},[s("v-layout",{attrs:{row:"",wrap:"","justify-center":""}},[s("v-layout",{staticClass:"hidden-md-and-up",attrs:{row:"",wrap:"","justify-center":""}},r._l(r.socialProfilesFooter,function(t,e){return s("v-btn",{key:e,attrs:{href:t.href,target:"_blank",icon:"",flat:""}},[s("v-icon",{attrs:{size:"20px"}},[r._v(r._s(t.icon))])],1)})),s("v-flex",{attrs:{xs12:"","py-3":"","text-xs-center":""}},[r._v("\n          ©2018 zalog.ro, +40 721 213 882\n        ")])],1)],1)],1)],1)}),p=[],c={data:function(){return{drawer:null}},computed:{socialProfiles:function(){return this.$store.state.socialProfiles},socialProfilesFooter:function(){return this.$store.state.socialProfiles.filter(function(r){if(r.footer)return r})}}},h=c,u=(e("nNx0"),e("KHd+")),m=Object(u["a"])(h,n,p,!1,null,null,null),f=m.exports,v=e("jE9Z"),d=function(){var r=this,t=r.$createElement,e=r._self._c||t;return e("div",[e("h1",{staticClass:"mb-3"},[r._v("My projects")]),e("v-container",{staticClass:"pa-0",attrs:{fluid:"","grid-list-lg":""}},[e("v-layout",{attrs:{row:"",wrap:""}},r._l(r.projects,function(r,t){return e("v-flex",{key:t,attrs:{xs12:"",sm6:""}},[e("Project",{attrs:{name:r.name,href:r.href,skills:r.skills,year:r.year}})],1)}))],1)],1)},w=[],y=(e("Vd3H"),function(){var r=this,t=r.$createElement,e=r._self._c||t;return e("v-card",{staticClass:"black--text",attrs:{color:"blue-grey lighten-5 project",height:"100%",flat:""}},[e("v-card-title",{attrs:{"primary-title":""}},[e("div",[e("h3",{staticClass:"headline"},[r._v(r._s(r.name))]),e("div",{domProps:{innerHTML:r._s(r.getSkills)}})])]),e("v-card-actions",[e("v-btn",{attrs:{href:r.href,target:"_blank",flat:""}},[r._v("Visit")]),e("v-spacer"),e("v-btn",{attrs:{flat:"",disabled:""}},[r._v(r._s(r.year))])],1)],1)}),j=[],b={name:"Project",props:{name:String,href:String,skills:Array,year:String},computed:{getSkills:function(){var r="";return this.skills.map(function(t,e){0!==e&&(r+=", "),r+="<span>".concat(t,"</span>")}),r}}},g=b,k=(e("gM3J"),Object(u["a"])(g,y,j,!1,null,"1b8f0446",null)),_=k.exports,x={name:"home",components:{Project:_},computed:{projects:function(){return this.$store.state.projects.slice().sort(function(r,t){return r.year<t.year?1:r.year>t.year?-1:0})}}},Q=x,P=Object(u["a"])(Q,d,w,!1,null,null,null),z=P.exports,O=function(){var r=this,t=r.$createElement;r._self._c;return r._m(0)},C=[function(){var r=this,t=r.$createElement,e=r._self._c||t;return e("div",[e("h1",{staticClass:"mb-3"},[r._v("About me")])])}],M={},S=Object(u["a"])(M,O,C,!1,null,null,null),E=S.exports,$=function(){var r=this,t=r.$createElement;r._self._c;return r._m(0)},T=[function(){var r=this,t=r.$createElement,e=r._self._c||t;return e("div",[e("h1",{staticClass:"mb-3"},[r._v("Contact me")])])}],H={},L=Object(u["a"])(H,$,T,!1,null,null,null),A=L.exports;s["a"].use(v["a"]);var I=new v["a"]({routes:[{path:"/",name:"home",component:z},{path:"/about",name:"about",component:E},{path:"/contact",name:"contact",component:A}]}),J=e("L2JU");s["a"].use(J["a"]);var R=new J["a"].Store({state:{projects:[{name:"revistavip.net",href:"http://www.revistavip.net/",skills:["html","css"],year:"2008"},{name:"americanexperience.ro",href:"https://www.americanexperience.ro/",skills:["html","css"],year:"2008"},{name:"turabo-cafe.ro",href:"",skills:["html","css"],year:"2008"},{name:"bmw.ro",href:"https://www.bmw.ro/",skills:["xml","html","flash"],year:"2008"},{name:"vibefm.ro",href:"http://www.vibefm.ro/",skills:["html","css"],year:"2008"},{name:"sportlaminut.ro",href:"http://www.sportlaminut.ro/",skills:["html","css"],year:"2009"},{name:"creativeweek.org",href:"http://www.creativeweek.org/",skills:["wordpress","php","html","css"],year:"2009"},{name:"greenblog.descopera.ro",href:"http://greenblog.descopera.ro/",skills:["wordpress","php","html","css"],year:"2009"},{name:"blog.provideo.ro",href:"",skills:["wordpress","php","html","css"],year:"2009"},{name:"intrefete.ro",href:"",skills:["html","css"],year:"2010"},{name:"m.apropoid.ro",href:"http://m.apropoid.ro/",skills:["html","css"],year:"2010"},{name:"prosport.ro - v2010",href:"",skills:["html","css"],year:"2010"},{name:"soferderomania.promotor.ro - v2010",href:"",skills:["html","css","jQuery","javascript"],year:"2010"},{name:"liga.prosport.ro - v2010",href:"",skills:["html","css"],year:"2010"},{name:"fratelli.ro",href:"http://www.fratelli.ro/",skills:["html","css"],year:"2011"},{name:"one.ro",href:"http://www.one.ro/",skills:["html","css","jQuery","javascript"],year:"2011"},{name:"descopera.ro",href:"http://www.descopera.ro/",skills:["html","css","jQuery"],year:"2011"},{name:"orlando.ro - v2011",href:"http://www.orlando.ro/",skills:["html","css","wordpress","php"],year:"2011"},{name:"storageroom.ro",href:"http://storageroom.ro/",skills:["wordpress","php","html","css","jQuery","javascript"],year:"2011"},{name:"oanacuzino.csid.ro",href:"http://oanacuzino.csid.ro/",skills:["wordpress","php","html","css","javascript"],year:"2011"},{name:"thecitybreak.ro",href:"http://thecitybreak.ro/",skills:["wordpress","php","html","css","jQuery","javascript"],year:"2011"},{name:"m.apropo.ro",href:"",skills:["html","css"],year:"2011"},{name:"m.ro",href:"http://www.m.ro/",skills:["html","css","jQuery","javascript"],year:"2011"},{name:"alo-moda.ro",href:"http://www.alo-moda.ro/",skills:["wordpress","php","html","css","jQuery","javascript"],year:"2011"},{name:"businessdevelopment.ro",href:"http://businessdevelopment.ro/",skills:["wordpress","php","html","css","jQuery","javascript"],year:"2012"},{name:"liga.prosport.ro",href:"http://liga.prosport.ro/",skills:["html","css","jQuery"],year:"2012"},{name:"gq.ro",href:"",skills:["html","css","jQuery","javascript"],year:"2012"},{name:"cineconduce.promotor.ro",href:"http://cineconduce.promotor.ro/",skills:["html","css","jQuery","javascript"],year:"2012"},{name:"travel.descopera.ro",href:"http://travel.descopera.ro/",skills:["html","css","jQuery","javascript"],year:"2012"},{name:"afiliere.mobilio.ro",href:"http://afiliere.mobilio.ro/",skills:["html","css","jQuery","javascript"],year:"2012"},{name:"bound.ro",href:"http://bound.ro/",skills:["wordpress","php","html","css","jQuery","javascript"],year:"2013"},{name:"tortionari.gandul.info",href:"",skills:["html","css","jQuery","javascript"],year:"2013"},{name:"prosport.ro",href:"http://www.prosport.ro/",skills:["html","css","jQuery","javascript"],year:"2013"},{name:"autopro.ro",href:"http://www.autopro.ro/",skills:["html","css","jQuery","javascript"],year:"2013"},{name:"tirbuson.ro",href:"",skills:["html","css","jQuery","javascript"],year:"2013"},{name:"csid.ro",href:"http://www.csid.ro/",skills:["html","css","jQuery","javascript"],year:"2013"},{name:"criserb.com",href:"https://www.criserb.com/blog/",skills:["wordpress","php","html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2013"},{name:"nush.ro",href:"https://nush.ro/",skills:["wordpress","php","html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2014"},{name:"cabral.ro",href:"https://www.cabral.ro/",skills:["wordpress","php","html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2014"},{name:"apropotv.ro",href:"http://www.apropotv.ro/",skills:["html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2014"},{name:"practica-ta.ro",href:"http://www.practica-ta.ro/",skills:["wordpress","php","mysql","html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2014"},{name:"ozinparis.com",href:"http://ozinparis.com/",skills:["wordpress","php","html","css","less","bootstrap","jQuery","javascript"],year:"2015"},{name:"caloria.ro",href:"http://www.caloria.ro/",skills:["html","css","less","bootstrap","jQuery","javascript"],year:"2015"},{name:"andreeaibacka.ro",href:"https://andreeaibacka.ro/",skills:["wordpress","php","html","css","less","bootstrap","jQuery","javascript","nodejs"],year:"2015"},{name:"republica.ro",href:"https://republica.ro/",skills:["html","css","sass","bootstrap","jQuery","javascript","nodejs","git","PM"],year:"2015"},{name:"suntmamica.ro",href:"http://www.suntmamica.ro/",skills:["html","php","css","sass","bootstrap","jQuery","javascript","nodejs","gulp","git"],year:"2016"},{name:"gobet.ro",href:"http://www.gobet.ro/",skills:["html","css","sass","bootstrap","jQuery","javascript","nodejs","gulp"],year:"2016"},{name:"basilica.ro",href:"http://www.basilica.ro/",skills:["wordpress","php","html","css","sass","bootstrap","jQuery","javascript","vagrant","nodejs","gulp","git"],year:"2016"},{name:"digi24.ro",href:"https://www.digi24.ro/",skills:["html","css","sass","bootstrap","jQuery","javascript","nodejs","gulp","git"],year:"2016"},{name:"m.digi24.ro",href:"https://m.digi24.ro/",skills:["html","css","sass","bootstrap","jQuery","javascript","nodejs","gulp","git"],year:"2016"},{name:"kanald.ro",href:"http://www.kanald.ro/",skills:["html","css","sass","bootstrap","javascript","nodejs","gulp","vagrant","git"],year:"2017"},{name:"gaseste.ro",href:"http://www.gaseste.ro/",skills:["php","html","css","sass","bootstrap","jQuery","javascript","nodejs","gulp","vagrant","git","PM"],year:"2017"},{name:"vreaudeviz.ro",href:"",skills:["html","css","sass","bootstrap","vue.js","javascript","nodejs","gulp"],year:"2017"},{name:"trinitas.tv",href:"https://www.trinitas.tv/",skills:["wordpress","php","mysql","sass","bootstrap","jQuery","javascript","nodejs","webpack","gulp","vagrant","git","ci","cd"],year:"2017"},{name:"ROdiaspora",href:"http://ithub.gov.ro/2016/12/09/rodiaspora/",skills:["angular","rxjs","ionic","typescript","javascript","cordova"],year:"2017"},{name:"iaa.ro",href:"http://www.iaa.ro/",skills:["wordpress","php","html","css","sass","bootstrap","jQuery","javascript","webpack","gulp","nodejs","git"],year:"2018"}],about:{intro:"<p>I am working for 1616.ro, I am from Bucharest, Romania and this is my portfolio.</p>\n        <p>Scroll down to see some of my projects</p>.\n        <p>Have fun!</p>",text:"Lorem ipsum"},socialProfiles:[{text:"Linkedin",href:"https://www.linkedin.com/in/zalog/",icon:"fa fa-linkedin",footer:!0},{text:"Github",href:"https://github.com/zalog",icon:"fa fa-github",footer:!0},{text:"Codepen",href:"https://codepen.io/zalog/",icon:"fa fa-codepen",footer:!1},{text:"Stack Overflow",href:"https://stackoverflow.com/users/2977191/zalog",icon:"fa fa-stack-overflow",footer:!1},{text:"Medium",href:"https://medium.com/@zalog",icon:"fa fa-medium",footer:!1},{text:"Instagram",href:"https://www.instagram.com/czalog/",icon:"fa fa-instagram",footer:!0},{text:"ZaBlog",href:"https://zablog.ro/",icon:"fa fa-wordpress",footer:!1},{text:"Facebook",href:"https://www.facebook.com/zablog",icon:"fa fa-facebook",footer:!0}]},mutations:{},actions:{}});s["a"].config.productionTip=!1,s["a"].use(o.a,{id:"UA-1205565-7",router:I}),s["a"].use(i.a),new s["a"]({router:I,store:R,render:function(r){return r(f)}}).$mount("#app")},gM3J:function(r,t,e){"use strict";var s=e("u/RE"),a=e.n(s);a.a},nNx0:function(r,t,e){"use strict";var s=e("uWEC"),a=e.n(s);a.a},"u/RE":function(r,t,e){},uWEC:function(r,t,e){}});