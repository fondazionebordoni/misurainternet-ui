!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([function(e,t,n){"use strict";function o(e){for(var t=0;t<e.length;t++){try{e[t].onprogress=null,e[t].onload=null,e[t].onerror=null}catch(e){console.log(e)}try{e[t].upload.onprogress=null,e[t].upload.onload=null,e[t].upload.onerror=null}catch(e){console.log(e)}try{e[t].abort()}catch(e){console.log(e)}try{delete e[t]}catch(e){console.log(e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.closeAllConnections=o,t.handleDownloadAndUploadErrors=function(e,t,n){o(n),e&&clearInterval(e);t&&clearInterval(t)},t.generateTestData=function(e){for(var t=[],n=new ArrayBuffer(1048576),o=new Uint32Array(n),r=Math.pow(2,33)-1,a=0;a<o.length;a++)o[a]=Math.floor(Math.random()*r);for(var s=0;s<e;s++)t.push(o);return new Blob(t)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.uploadTest=function(e,t,n,r,a,s,l,i,u){var f=Date.now(),c=0,d=f,p=0,v=(0,o.generateTestData)(t/Math.pow(1024,2)),g=0,y=!1,h=[],M=void 0,w=void 0,S={type:"upload",start:new Date(f).toISOString(),byte:null,value:null};self.postMessage(JSON.stringify({type:"measure",content:{test_type:"upload"}}));var b=0,O=[];l.forEach(function(t,n){O[n]=e+":"+t});for(var m=0;m<n;m++)b>=O.length&&(b=0),D(m,100*m,O[b]),b++;function D(e,t,n){setTimeout(function(){if(!y){var t="http://"+n+"?r="+Math.random(),r=(Math.random(),0),a=new XMLHttpRequest;h[e]=a,h[e].upload.onprogress=function(e){s(e.loaded)},h[e].onerror=function(e){(0,o.handleDownloadAndUploadErrors)(M,w,h),self.postMessage(JSON.stringify({type:"error",content:1237}))},h[e].upload.onload=function(t){h[e].abort(),s(t.loaded),D(e,0,n)},h[e].upload.onabort=function(e){s(e.loaded)},h[e].open("POST",t),h[e].send(v)}function s(e){var t=e<=0?0:e-r;g+=t,r=e}},t)}M=setInterval(function(){var e=Date.now(),t=e-d,n=g,s=n-c,l=8*s/1e3/t,v=Math.abs((l-p)/l);if(self.postMessage(JSON.stringify({type:"tachometer",content:{value:l,message:{info:"Prequalifica in corso. Attendere prego..."}}})),d=e,c=n,p=l,v<a||e-f>=1e4){var b=!1;if(e-f>=1e4){if(0===l)return(0,o.handleDownloadAndUploadErrors)(M,w,h),void self.postMessage(JSON.stringify({type:"error",content:1238}));b=!0}var O=Date.now();g=0,clearInterval(M),w=setInterval(function(){var e=Date.now(),t=e-O,n=g,a=8*n/1e3/t;if(b?self.postMessage(JSON.stringify({type:"tachometer",content:{value:a,message:{warning:"La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di upload potrebbe non essere del tutto accurato"}}})):self.postMessage(JSON.stringify({type:"tachometer",content:{value:a,message:{info:"Misurazione in corso..."}}})),e-O>=r){(0,o.closeAllConnections)(h),clearInterval(w),y=!0;var s=e-O,l=1e3*a;if(S.byte=n,S.value=s,i.tests.push(S),self.postMessage(JSON.stringify({type:"result",content:{test_type:"upload",result:l}})),u)return void u()}},500)}},3e3)};var o=n(0)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.downloadTest=function(e,t,n,r,a,s,l,i,u){var f=Date.now(),c=0,d=f,p=0,v=0,g=!1,y=[],h=void 0,M=void 0,w={type:"download",start:new Date(f).toISOString(),byte:null,value:null};self.postMessage(JSON.stringify({type:"measure",content:{test_type:"download"}}));var S=0,b=[];l.forEach(function(t,n){b[n]=e+":"+t});for(var O=0;O<n;O++)S>=b.length&&(S=0),m(O,100*O,b[S]),S++;function m(e,n,r){setTimeout(function(){if(!g){var n={request:"download",data_length:t},a=JSON.stringify(n),s="http://"+r+"?r="+Math.random()+"&data="+encodeURIComponent(a),l=0,i=new XMLHttpRequest;y[e]=i,y[e].onprogress=function(e){u(e.loaded)},y[e].onerror=function(e){(0,o.handleDownloadAndUploadErrors)(h,M,y),self.postMessage(JSON.stringify({type:"error",content:1236}))},y[e].onload=function(t){y[e].abort(),u(t.loaded),m(e,0,r)},y[e].onabort=function(e){u(e.loaded)},y[e].responseType="arraybuffer",y[e].open("GET",s),y[e].send()}function u(e){var t=e<=0?0:e-l;v+=t,l=e}},n)}h=setInterval(function(){var e=Date.now(),t=e-d,n=v,s=n-c,l=8*s/1e3/t,S=Math.abs((l-p)/l);if(self.postMessage(JSON.stringify({type:"tachometer",content:{value:l,message:{info:"Prequalifica in corso. Attendere prego ..."}}})),d=e,c=n,p=l,S<a||e-f>1e4){var b=!1;if(e-f>1e4){if(0===l)return(0,o.handleDownloadAndUploadErrors)(h,M,y),void self.postMessage(JSON.stringify({type:"error",content:1238}));b=!0}var O=Date.now();v=0,clearInterval(h),M=setInterval(function(){var e=Date.now(),t=e-O,n=v,a=8*n/1e3/t;if(b?self.postMessage(JSON.stringify({type:"tachometer",content:{value:a,message:{warning:"La tua connessione non risulta essere particolarmente stabile. Pertanto il risultato del test di download potrebbe non essere del tutto accurato"}}})):self.postMessage(JSON.stringify({type:"tachometer",content:{value:a,message:{info:"Misurazione in corso..."}}})),e-O>=r){(0,o.closeAllConnections)(y),clearInterval(M),g=!0;var s=e-O,l=1e3*a;if(w.byte=n,w.value=s,i.tests.push(w),self.postMessage(JSON.stringify({type:"result",content:{test_type:"download",result:l}})),u)return void u()}},500)}},3e3)};var o=n(0)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pingCodeWrapper=function(e,t,n,o,r,a){var s=void 0,l=void 0;self.postMessage(JSON.stringify({type:"measure",content:{test_type:"ping"}})),function e(t,n,a,i){var u=[];for(var f=0;f<n;f++){u.push({type:"ping",start:null,byte:0,value:null})}var c=t[0];var d=c+":"+o[0];var p=!1;var v=0;var g=0;var y=0;var h=void 0;var M=!1;var w=new WebSocket("ws://"+d);var S=setTimeout(function(){0===w.readyState&&w.close()},2e3);w.onopen=function(){clearTimeout(S),O()};w.onclose=function(e){e.code};w.onmessage=function(){if(!M){var e=Date.now();if(clearTimeout(h),p){var t=e-y;if(u[v].start=new Date(y).toISOString(),u[v].value=t,g+=t,++v===n){var o=g/v;r.server?s&&o<s&&(r.server=c,s=o,l=u):(r.server=c,s=o,l=u),console.log("handle2"),b()}else O()}else{p=!0,O()}}};function b(){if(w.readyState<3&&w.close(),1===t.length){if(i&&r.server)return r.tests=r.tests.concat(l),self.postMessage(JSON.stringify({type:"result",content:{test_type:"ping",result:{ping:s,jitter:function(e,t,n){for(var o=0,r=0;r<n;r++){var a=t[r].value-e;o+=a*a}return o/=n,Math.sqrt(o)}(s,u,n)}}})),void i();r.server||self.postMessage(JSON.stringify({type:"error",content:1235}))}else t.shift(),e(t,n,a,i)}function O(){y=Date.now(),w.send(""),h=setTimeout(function(){M=!0,b()},a)}}(e,t,n,a)}},function(e,t,n){"use strict";var o=n(3),r=n(2),a=n(1),s={type:"speedtest",version:"3.0.0",server:null,start:null,stop:null,tests:[]},l=["60100","60101","60102","60103","60104","60105","60106","60107","60108","60109"],i=!0,u=["localhost"];function f(e){s.start=(new Date).toISOString();(0,o.pingCodeWrapper)(e,10,1e3,l,s,function(){(0,r.downloadTest)(s.server,52428800,20,1e4,.1,500,l,s,function(){(0,a.uploadTest)(s.server,52428800,20,1e4,.1,500,l,s,c)})})}function c(){s.stop=(new Date).toISOString(),self.postMessage(JSON.stringify(s)),self.close()}self.onmessage=function(e){if(i)f(u);else{var t=JSON.parse(e.data);t.request&&"startMeasure"===t.request&&t.servers&&t.servers.length>0&&f(t.servers)}}}]);