(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c8ad95d6"],{"0e7d":function(e,t,a){},"1b06":function(e,t,a){"use strict";a("0e7d")},"38be":function(e,t,a){},"4b3c":function(e,t,a){"use strict";a("eb9a")},6794:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));const n=e=>{if(null!==e){var t=new Date(e),a=t.getFullYear(),n=t.getMonth()+1;n=n<10?"0"+n:n;e=t.getDate();e=e<10?"0"+e:e;var i=a+"-"+n+"-"+e,s=t.getHours();s=s<10?"0"+s:s;var r=t.getMinutes();r=r<10?"0"+r:r;var o=t.getSeconds();o=o<10?"0"+o:o;var c=s+":"+r+":"+o;return i+" "+c}}},7574:function(e,t,a){"use strict";var n=function(){var e=this,t=e._self._c;return t("div",{staticClass:"pagination"},[t("el-pagination",{attrs:{background:e.background,"current-page":e.currentPage,"page-size":e.pageSize,"page-sizes":e.pageSizes,layout:e.layout,total:e.total},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"update:pageSize":function(t){e.pageSize=t},"update:page-size":function(t){e.pageSize=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)},i=[],s={props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:10},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1},pageSizes:{type:Array,default:[10,20,50,100]}},computed:{currentPage:{get(){return this.page},set(e){this.$emit("update:page",e)}},pageSize:{get(){return this.limit},set(e){this.$emit("update:limit",e)}}},methods:{handleSizeChange(e){this.$emit("pagination",{pageIndex:1,pageSize:e})},handleCurrentChange(e){this.$emit("pagination",{pageIndex:e,pageSize:this.pageSize})}}},r=s,o=(a("4b3c"),a("f739"),a("2877")),c=Object(o["a"])(r,n,i,!1,null,"381a7afa",null);t["a"]=c.exports},9012:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e._self._c;return t("div",{staticClass:"protocol_list"},[e.candidateList.length>0?t("div",{staticClass:"all_candidate_content"},[e._l(e.candidateList,(function(a,n){return t("div",{key:n,staticClass:"all_candidate_content_a"},[t("div",[t("p",[e._v("Demand Contract："+e._s(a.contract))]),t("p",[e._v("Employer："+e._s(a.employer))]),t("p",[e._v("Candidate："+e._s(a.candidate))]),t("p",[e._v("ActiveDate："+e._s(a.activeDate))]),t("div",[t("i",{staticClass:"el-icon-info",staticStyle:{color:"#8b8b8b"}}),t("span",{staticStyle:{"font-weight":"400"}},[e._v(e._s(a.status))])])]),t("div",{staticClass:"all_candidate_content_r_p"},["invite pending"==a.status?t("div",[t("el-button",{attrs:{type:"info"},on:{click:function(t){return e.handleClick(a,"Accept")}}},[e._v("Accept")]),t("el-button",{attrs:{type:"info"},on:{click:function(t){return e.handleClick(a,"Refuse")}}},[e._v("Refuse")]),t("el-button",{attrs:{type:"success"},on:{click:function(t){return e.handleClick(a,"Protocol")}}},[e._v("Protocol Message")])],1):"active"==a.status?t("div",[t("el-button",{attrs:{type:"info"},on:{click:function(t){return e.handleClick(a,"Finish")}}},[e._v("Finish")]),t("el-button",{attrs:{type:"success"},on:{click:function(t){return e.handleClick(a,"Protocol")}}},[e._v("Protocol Message")])],1):t("div",[t("el-button",{attrs:{type:"success"},on:{click:function(t){return e.handleClick(a,"Protocol")}}},[e._v("Protocol Message")])],1)])])})),t("Pagination",{directives:[{name:"show",rawName:"v-show",value:e.pageLength>=0,expression:"pageLength >= 0"}],attrs:{limit:e.pageSize,total:e.pageLength,"page-sizes":e.pageSizes},on:{"update:limit":function(t){e.pageSize=t},pagination:e.handlePageChange}})],2):t("div",{staticClass:"nodata"},[t("img",{attrs:{src:a("14a4"),alt:""}}),t("p",[e._v("No Datas")])])])},i=[],s=a("0f2e"),r=a("0c6d"),o=a("e43c"),c=a("6794"),l=a("7574"),u={components:{Pagination:l["a"]},inject:["reload"],data(){return{candidateList:[],currentPage:1,pageLength:0,pageSize:10,pageSizes:[10,20,50,100,200]}},mounted(){Object(o["b"])();const e={url:s["a"].candidateProtocolList,resFunc:e=>{console.log(e.data),0==e.data.errno&&e.data.data.list.length>0&&(this.candidateList=e.data.data.list,this.pageLength=e.data.data.total,e.data.data.list.map(e=>{null!=e.activeDate&&(e.activeDate=Object(c["a"])(e.activeDate))})),0!=e.data.errno&&(this.$notify.error({title:"error",message:e.data.message}),Object(o["a"])()),Object(o["a"])()},errFunc:e=>{this.$notify.error({title:"error",message:e}),console.log(e,"err1"),Object(o["a"])()}};Object(r["b"])(e)},methods:{handlePageChange(e){Object(o["b"])();const t={url:s["a"].candidateProtocolList,params:{page:e.pageIndex,pageSize:e.pageSize},resFunc:t=>{console.log(t.data),0==t.data.errno&&t.data.data.list.length>0&&(this.candidateList=t.data.data.list,this.pageLength=t.data.data.total,this.pageSize=e.pageSize,this.currentPage=e.pageIndex,t.data.data.list.map(e=>{null!=e.activeDate&&(e.activeDate=Object(c["a"])(e.activeDate))})),0!=t.data.errno&&(this.$notify.error({title:"error",message:t.data.message}),Object(o["a"])()),Object(o["a"])()},errFunc:e=>{this.$notify.error({title:"error",message:e}),console.log(e,"err1"),Object(o["a"])()}};Object(r["b"])(t)},handleClick(e,t){"Accept"==t?this.$confirm("Are you sure you want to accept the invitation?","Tips",{confirmButtonText:"Confirm",cancelButtonText:"Cancel",type:"warning"}).then(()=>{Object(o["b"])();const t={url:s["a"].acceptInvitationProtocol,method:"POST",params:{protocolId:e.id},resFunc:async e=>{0==e.data.errno&&(this.$message({type:"success",message:"accept invitation success"}),this.refresh()),0!=e.data.errno&&(this.$notify.error({title:"error",message:"accept invitation failed--------"+e.data.message}),Object(o["a"])()),Object(o["a"])()},errFunc:e=>{this.$notify.error({title:"error",message:e}),Object(o["a"])()}};Object(r["a"])(t)}).catch(()=>{this.$message({type:"info",message:"Cancelled operation"})}):"Refuse"==t?this.$confirm("Are you sure you want to refuse the invitation?","Tips",{confirmButtonText:"Confirm",cancelButtonText:"Cancel",type:"warning"}).then(()=>{Object(o["b"])();const t={url:s["a"].refuseInvitationProtocol,method:"POST",params:{protocolId:e.id},resFunc:e=>{0==e.data.errno&&(this.$message({type:"success",message:"refuse invitation success"}),this.refresh()),0!=e.data.errno&&(this.$notify.error({title:"error",message:"refuse invitation failed--------"+e.data.message}),Object(o["a"])()),Object(o["a"])()},errFunc:e=>{this.$notify.error({title:"error",message:e}),Object(o["a"])()}};Object(r["a"])(t)}).catch(()=>{this.$message({type:"info",message:"Cancelled operation"})}):"Finish"==t?this.$confirm("Are you sure you want to finish protocol the invitation?","Tips",{confirmButtonText:"Confirm",cancelButtonText:"Cancel",type:"warning"}).then(()=>{Object(o["b"])();const t={url:s["a"].finishProtocol,method:"POST",params:{protocolId:e.id},resFunc:e=>{0==e.data.errno&&(this.$message({type:"success",message:"finish protocol success"}),this.refresh()),0!=e.data.errno&&(this.$notify.error({title:"error",message:"finish protocol failed--------"+e.data.message}),Object(o["a"])()),Object(o["a"])()},errFunc:e=>{this.$notify.error({title:"error",message:e}),Object(o["a"])()}};Object(r["a"])(t)}).catch(()=>{this.$message({type:"info",message:"Cancelled operation"})}):"Protocol"==t&&this.$router.push({path:"/PersonalCenter/DemandList/ProtocolMessage",query:{id:e.id,type:"Candidate"}})},refresh(){this.reload()}}},d=u,p=(a("1b06"),a("2877")),g=Object(p["a"])(d,n,i,!1,null,"52f65079",null);t["default"]=g.exports},eb9a:function(e,t,a){},f739:function(e,t,a){"use strict";a("38be")}}]);
//# sourceMappingURL=chunk-c8ad95d6.a6df8b1e.js.map