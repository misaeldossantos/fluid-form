"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("../../node_modules/react/index.js"),r=require("./node_modules/yup/es/index.js");exports.useYupValidator=function(t){return e.useCallback(((e,a)=>{if(a)try{return t.validateSyncAt(a,e),""}catch(e){return e instanceof r.ValidationError?e.message:null}try{return t.validateSync(e,{abortEarly:!1}),{}}catch(e){const t={};return e instanceof r.ValidationError&&e.inner.forEach((e=>{t[e.path]=e.message})),t}}),[t])};