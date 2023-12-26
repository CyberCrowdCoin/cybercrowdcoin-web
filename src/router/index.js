import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../Index.vue";
import Home from "../views/Home/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      {
        path: "/",
        name: "home",
        components: {
          main: () => import("../views/Home/index.vue"), // 首页
        },
      },
      {
        path: "/DemandMarket/DemandList",
        name: "DemandMarketdemandList",
        components: {
          main: () => import("../views/DemandMarket/AllDemandList.vue"), // 所有需求列表
        },
      },
      {
        path: "/DemandMarket/CandidateList",
        name: "candidateList",
        components: {
          main: () => import("../views/DemandMarket/ALLCandidateList.vue"), // 所有候选列表
        },
      },
      {
        path: "PersonalCenter/DemandNew",
        name: "demandNew",
        components: {
          main: () =>
            import("../views/PersonalCenter/EmployerDemand/DemandNew.vue"), // 个人中心-新建
        },
      },
      {
        path: "/PersonalCenter/DemandList",
        name: "PersonalCenterdemandList",
        components: {
          main: () =>
            import("../views/PersonalCenter/EmployerDemand/DemandList.vue"), // 个人中心-列表
        },
      },

      {
        path: "/PersonalCenter/DemandList/ProtocolMessage",
        name: "protocolMessage",
        components: {
          main: () => import("../views/PersonalCenter/ProtocolMessage.vue"), // 个人中心--操作-Protocol Message
        },
      },

      {
        path: "/PersonalCenter/ProtocolList",
        name: "protocolList",
        components: {
          main: () =>
            import(
              "../views/PersonalCenter/CandidateProtocol/ProtocolList.vue"
            ), // 个人中心-候选人协议-协议列表
        },
      },

      {
        path: "/PersonalCenter/CandidateProfile",
        name: "candidateProfile",
        components: {
          main: () =>
            import("../views/PersonalCenter/CandidateProfile/Register.vue"), // 个人中心-注册候选人
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
