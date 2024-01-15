<template>
  <div class="dialog-box">
    <div @click.stop="toggleShowSelectCoin" class="dialog-box-bg"></div>
    <div class="dialog" style="width: 620px">
      <div class="cont" style="background: transparent">
        <div class="searchMaxPC">
          <input
            v-model="filter"
            placeholder="搜索名称或输入地址"
            class="search"
          />
          <i class="el-icon-search icon search_icon"></i>
        </div>
        <div class="coin-content">
          <div class="name-list">
            <div
              class="name"
              :class="key === chainActive && 'active'"
              @click="selectChain(key)"
              v-for="(item, key) in chainList"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
          <div class="coin-list">
            <div class="list">
              <div
                class="coin_list"
                :class="item.isEnable === 'N' && 'bgOpacity'"
                v-for="(item, key) in filterCoinListOfChain(chainActive)"
                :key="item.symbol"
                @click="selectCoin(item, key)"
              >
                <div class="left">
                  <div class="van-image van-image--round imgPC">
                    <img :src="item.logoURI" alt="" class="van-image__img" />
                  </div>
                  <div class="coin" :class="isSelectedTarget(key) && 'active'">
                    <span class="coin-name">{{ item.symbol }}</span
                    ><span>{{ chainList[chainActive] }}</span>
                  </div>
                </div>
                <div class="right">
                  <svg
                    v-if="isSelectedTarget(key)"
                    t="1623379876661"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1063"
                    width="200"
                    height="200"
                    class="icon"
                  >
                    <path
                      d="M512 102.4c226.21184 0 409.6 183.38816 409.6 409.6S738.21184 921.6 512 921.6 102.4 738.21184 102.4 512s183.38816-409.6 409.6-409.6z m180.95104 265.68704h-42.5984c-9.2672 0-18.08384 4.096-23.53152 11.1104L484.02432 561.3568l-64.67584-82.54464c-5.44768-6.94272-14.16192-11.12064-23.52128-11.12064h-42.5984c-5.90848 0-9.35936 6.18496-5.90848 10.61888l113.18272 144.384c11.53024 14.78656 35.4304 14.78656 46.96064 0l191.30368-243.98848c3.54304-4.42368 0.09216-10.60864-5.81632-10.60864z"
                      fill="#526EFF"
                      p-id="1064"
                    ></path>
                  </svg>
                  <div
                    class="blance-box"
                    :class="isSelectedTarget(key) && 'active'"
                  >
                    <span>{{ item.balance || "0.0" }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!---->
          </div>
        </div>
        <!-- <div class="add-token">
          <i class="van-icon van-icon-plus"></i>&nbsp;AddToken
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
  inject: ["getSelectCoinInfo", "toggleShowSelectCoin"],
  props: ["activeList"],
  computed: {
    ...mapGetters(["chainList", "coinListOfChain"]),
    ...mapState({
      baseInfo: (state) => state.baseInfo,
    }),
    isSelectedTarget() {
      return (key) => {
        return (
          this.targetActive[0] === this.chainActive &&
          this.targetActive[1] === key
        );
      };
    },
    filterCoinListOfChain() {
      return (item) => {
        const list = this.coinListOfChain(item);
        return list.filter((e) =>
          e.symbol.toLocaleUpperCase().includes(this.filter.toLocaleUpperCase())
        );
      };
    },
  },
  data() {
    return {
      chainActive: 0,
      targetActive: [0, null],
      filter: "",
    };
  },

  mounted() {
    this.targetActive = this.activeList;
    this.selectChain(this.targetActive[0]);
    // this.chainActive = this.targetActive[0];
  },
  methods: {
    ...mapMutations(["SET_BASEINFO"]),
    selectChain(key) {
      this.chainActive = key;
      const info = {
        chain: this.chainList[key],
        list: this.coinListOfChain(this.chainActive),
      };
      this.$store.dispatch("getBalanceOfTokens", info);
    },
    selectCoin(item, key) {
      if (item.isEnable === "N") {
        this.$message({
          showClose: true,
          message: "不支持该币种",
          type: "error",
        });
        return;
      }
      this.targetActive = [this.chainActive, key];
      const info = {
        chain: this.chainList[this.chainActive],
        ...item,
      };
      this.getSelectCoinInfo(info, this.targetActive);
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-box {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  // backdrop-filter: blur(10px);
  .dialog-box-bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
}

.dialog-box .dialog {
  position: relative;
  top: -1%;
  height: auto;
  border-radius: 10px;
  transition: 0.5s ease;
}

.dialog-box .dialog .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.dialog-box .dialog .header .title {
  height: 30px;
  line-height: 30px;
  font-weight: 700;
}

.dialog-box .dialog .header .close-dialog {
  height: 30px;
  width: 30px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box .dialog .cont {
  box-sizing: border-box;
  padding: 20px;
  border-radius: 20px;
  z-index: 11;
  background: rgba(25, 27, 34, 0.48) !important;
  // backdrop-filter: blur(20px);
  border: 1px solid #18212e;
}

.searchMaxPC {
  position: relative;
}

.searchMaxPC .search {
  box-sizing: border-box;
  width: 100%;
  position: relative;
  padding-left: 50px;
  font-size: 16px;
  height: 60px;
  background: #151f2c;
  border-radius: 60px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-family: Poppins-Medium, Poppins;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  outline: none;
  -webkit-appearance: none;
  color: #fff;
}

.searchMaxPC .search_icon {
  position: absolute;
  top: 20px;
  left: 15px;
  width: 25px;
  height: 25px;
  color: #fff;
}

.coin-content {
  width: 100%;
  display: flex;
}

.coin-content .name-list {
  padding-right: 20px;
  max-height: 480px;
  overflow: hidden;
  overflow-y: auto;
  /* 隐藏滚动条，但仍然可以滚动内容 */
  &::-webkit-scrollbar {
    display: none;
  }
}

.coin-content .name-list .name {
  width: 130px;
  height: 35px;
  line-height: 35px;
  background: #151f2c;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
  color: #8f98ae;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
}

.coin-content .name-list .name.active {
  background: #277ffa;
  color: #fff;
}

.coin-content .coin-list {
  flex: 1;
  height: 480px;
}

.coin-content .coin-list .list {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  /* 隐藏滚动条，但仍然可以滚动内容 */
  &::-webkit-scrollbar {
    display: none;
  }
}

.add-token {
  margin: 0 -20px -20px;
  height: 54px;
  line-height: 54px;
  text-align: center;
  font-size: 16px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #277ffa;
  cursor: pointer;
  background: #000710;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 5px 0;
  border-radius: 2px;
  color: #8f98ae;
}

.coin_list.bgOpacity {
  opacity: 0.4;
}

.coin_list.coin_userAdd,
.coin_list:hover {
  color: #fff;
}

.coin_list.M {
  margin-bottom: 5px;
  padding: 5px 0;
}

.coin_list .left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.coin_list .left .imgM {
  width: 25px;
  height: 25px;
  margin-right: 15px;
  border-radius: 25px;
}

.coin_list .left .imgPC {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 15px;
  overflow: hidden;
  display: flex;
  img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
}

.coin_list .left .coin {
  text-align: left;
  font-family: Poppins-SemiBold, Poppins;
}

.coin_list .left .coin span {
  width: 100%;
  display: inherit;
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
}

.coin_list .left .coin .nft-info {
  display: inline-block;
  margin-left: 10px;
}

.coin_list .left .coin .coin-name {
  font-size: 16px;
  font-weight: 700;
}

.coin_list .left .coin.active {
  color: #fff;
}

.coin_list .right {
  text-align: right;
  .blance-box {
    font-size: 12px;
    color: #8f98ae;
    &.active {
      color: #fff;
    }
  }
}

.coin_list .right svg {
  width: 15px;
  height: 15px;
}

.coin_list .right .import {
  font-size: 16px;
  display: inline-block;
  background: #277ffa;
  padding: 0.1rem 0.1rem;
  border-radius: 0.1rem;
  cursor: pointer;
}

.coin_list.disable {
  opacity: 0.3;
  color: #8f98ae !important;
}
</style>
