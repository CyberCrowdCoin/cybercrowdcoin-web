<template>
  <div>
    <router-view v-if="isRefresh" />
    <select-coin :activeList="activeList" v-if="isShowSelectCoin" />
  </div>
</template>

<script>
import SelectCoin from "./component/SelectCoin/index.vue";
export default {
  components: {
    SelectCoin,
  },
  provide() {
    return {
      reload: this.reload,
      toggleShowSelectCoin: this.toggleShowSelectCoin,
      getSelectCoinInfo: this.getSelectCoinInfo,
      selectCoinInfoSource: () => {
        return this.selectCoinInfoSource;
      },
      selectCoinInfoTargrt: () => {
        return this.selectCoinInfoTargrt;
      },
      changeCoinInfo: this.changeCoinInfo,
    };
  },
  computed: {
    activeList() {
      if (this.key === 1) return this.fromActive;
      return this.toActive;
    },
  },
  data() {
    return {
      isRefresh: true,
      isShowSelectCoin: false,
      selectCoinInfoSource: {},
      selectCoinInfoTargrt: {},
      key: 1,
      fromActive: [0, null],
      toActive: [0, null],
      timer: null,
    };
  },
  methods: {
    setFromActive(val) {
      this.fromActive = val;
    },
    setToActive(val) {
      this.toActive = val;
    },
    changeCoinInfo() {
      const copyInfo = this.selectCoinInfoSource;
      this.selectCoinInfoSource = this.selectCoinInfoTargrt;
      this.selectCoinInfoTargrt = copyInfo;
      const copyList = this.fromActive;
      this.fromActive = this.toActive;
      this.toActive = copyList;
      this.getBalance();
    },
    reload() {
      this.isRefresh = false;
      this.$nextTick(() => {
        this.isRefresh = true;
      });
    },
    toggleShowSelectCoin(key) {
      if (key) {
        this.key = key;
      }
      this.isShowSelectCoin = !this.isShowSelectCoin;
    },
    getSelectCoinInfo(selectCoinInfo, activeList) {
      if (this.key === 1) {
        this.selectCoinInfoSource = selectCoinInfo;
        this.fromActive = activeList;
        this.getBalance();
      } else {
        this.selectCoinInfoTargrt = selectCoinInfo;
        this.toActive = activeList;
      }
      this.toggleShowSelectCoin(this.key);
    },
    getBalance() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.$store.dispatch("getBalances", this.selectCoinInfoSource);
      this.timer = setInterval(() => {
        this.$store.dispatch("getBalances", this.selectCoinInfoSource);
      }, 5000);
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  list-style: none;
  text-decoration: none;
}

.header_title_agent {
  height: 80px;
  display: flex;
  align-items: center;

  p {
    font-size: 22px;
    color: #202226;
    margin-right: 8px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    color: #7d828c;
  }
}

.el-select-dropdown {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 16px !important;
}

.el-date-picker.has-sidebar {
  top: 133px !important;
  left: 586px !important;
  border-radius: 20px !important;
  overflow: hidden !important;
}
</style>
