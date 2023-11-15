import Vue from "vue";
import VueRouter from "vue-router";
import i18n from "./lang/i18n";

import App from "./App.vue";
import ElementUI from "element-ui";
import * as echarts from "echarts";
import router from "./router";
import store from "./store";

import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(echarts);
Vue.use(VueRouter);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
