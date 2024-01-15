<template>
  <div>
    <div v-if="isInit" class="trade-box">
      <div class="trade">
        <div class="back-box">
          <div class="back" @click="$emit('close')">
            <i class="el-icon-back"></i>
            <span class="span-text">兑 换</span>
          </div>
          <div class="update-box">
            <span class="color">{{ i }}</span
            >s 后 <span @click="reLoad" class="shuaxin">刷新</span>
          </div>
        </div>
        <div>
          <div class="swap-box">
            <div class="info-item">
              <div class="coin-img van-image van-image--round">
                <img :src="sourceCoinInfo.logoURI" class="van-image__img" />
              </div>
              <div class="info">
                <div class="Transfer">
                  <div class="text">
                    转出
                    <span class="chainBlock ETH">
                      {{ sourceCoinInfo.chain }}
                    </span>
                  </div>
                  <div>
                    <span class="balance">{{ sourceAmmount }}</span>
                    &nbsp;<span class="coin-name">
                      {{ sourceCoinInfo.symbol }}
                    </span>
                  </div>
                </div>
                <div class="addr">
                  <span>{{ fromAccount }}</span>
                  &nbsp;
                  <img
                    @click="copyText(fromAccount)"
                    src="data:image/png;base64,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"
                    alt=""
                    class="copy-img"
                  />
                </div>
              </div>
            </div>
            <div class="line-box">
              <div class="line"></div>
            </div>
            <div class="info-item">
              <div class="coin-img van-image van-image--round">
                <img :src="targetCoinInfo.logoURI" class="van-image__img" />
              </div>
              <div class="info">
                <div class="receive-box Transfer">
                  <div class="text">
                    预计得到
                    <span class="chainBlock ETH">
                      {{ targetCoinInfo.chain }}
                    </span>
                    <div class="more-price">
                      <img :src="selectedDexInfo.logoUrl" alt="" class="icon" />
                      &nbsp; {{ selectedDexInfo.dex }}
                    </div>
                  </div>
                  <div class="bandc">
                    <span class="balance">{{
                      selectedDexInfo.receiveTokenAmount
                    }}</span>
                    <span class="coin-name"> {{ targetCoinInfo.symbol }}</span>
                    <span class="best-btn"></span>
                    <!-- <span class="recommended path-route"> 推荐 </span> -->
                  </div>
                </div>
                <div class="addr re">
                  <span>{{ toAddress }}</span>
                  &nbsp;
                  <img
                    @click="copyText(toAddress)"
                    src="data:image/png;base64,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"
                    alt=""
                    class="copy-img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div role="separator" class="van-divider van-divider--hairline"></div>
          <div class="info">
            <div class="list">
              <div class="left">参考汇率</div>
              <div class="right">
                1 {{ sourceCoinInfo.symbol }} ≈
                {{ selectedDexInfo.receiveTokenAmount / sourceAmmount }}
                {{ targetCoinInfo.symbol }}
              </div>
            </div>
            <div class="list" v-if="isDex">
              <div class="left">
                流动性提供者费用
                <svg
                  aria-hidden="true"
                  class="el-tooltip icon item"
                  aria-describedby="el-tooltip-2259"
                  tabindex="0"
                >
                  <use xlink:href="#icon-tishi"></use>
                </svg>
              </div>
              <div class="right">
                {{ selectedDexInfo.fee }} {{ selectedDexInfo.feeToken }}
              </div>
            </div>
            <div class="list" v-if="!isDex">
              <div class="left">手续费</div>
              <div class="right">{{ selectedDexInfo.fee * 100 }}%</div>
            </div>
            <div class="list" v-if="!isDex">
              <div class="left">矿工费</div>
              <div class="right">
                {{ selectedDexInfo.chainFee || 0 }} {{ targetCoinInfo.symbol }}
              </div>
            </div>
            <div class="list">
              <div class="left">预计得到</div>
              <div class="right">
                {{ selectedDexInfo.receiveTokenAmount }}
                {{ targetCoinInfo.symbol }}
              </div>
            </div>
            <div class="list">
              <div class="left">预计完成时间</div>
              <div class="right">
                {{ timeMap[selectedDexInfo.estimatedTime] }} 分钟
              </div>
            </div>
          </div>
          <div class="btns">
            <button
              @click="swap"
              class="getprice-btn van-button van-button--default van-button--normal"
            >
              <div class="van-button__content">
                <span class="van-button__text">
                  兑 换
                  <div class="loading" v-if="isLoading1"></div>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="more-price-content">
          <div class="title">
            More Offers
            <div class="select-box el-dropdown" v-if="false">
              <button
                type="button"
                class="el-button el-button--primary el-dropdown-selfdefine"
                aria-haspopup="list"
                aria-controls="dropdown-menu-3564"
                role="button"
                tabindex="0"
              >
                <div class="type-name">推荐</div>
                <svg aria-hidden="true" class="icon">
                  <use xlink:href="#icon-xiala"></use>
                </svg>
              </button>
              <ul
                class="el-dropdown-menu el-popper"
                id="dropdown-menu-3564"
                style="display: none"
              >
                <li tabindex="-1" class="el-dropdown-menu__item">推荐</li>
                <li tabindex="-1" class="el-dropdown-menu__item">最大回报</li>
                <li tabindex="-1" class="el-dropdown-menu__item">速度</li>
              </ul>
            </div>
          </div>
          <div class="list-box">
            <!-- <div class="list price active">
              <div class="price-box">
                <div class="top">
                  <div class="item item1">
                    <img
                      src="https://images.swft.pro/dex/glue.png"
                      alt=""
                      class="icon"
                    />
                    &nbsp;Glue
                  </div>
                  <div class="item item3">
                    <span class="recommended path-route"> 推荐 </span>
                  </div>
                </div>
                <div class="bottom">
                  <div class="item">
                    <span class="expected"> 预计得到: </span>
                    67.689492
                  </div>
                  <div class="item">
                    <span class="estimatedTime"> 1~3 分钟 </span>
                  </div>
                </div>
              </div>
            </div> -->
            <div
              class="list price"
              v-for="item in multiQuoteList"
              :key="item.dex"
              :class="item.dex === selectedDex && 'active'"
              @click="selectedDex = item.dex"
            >
              <div class="price-box">
                <div class="top">
                  <div class="item item1">
                    <img :src="item.logoUrl" alt="" class="icon" />
                    &nbsp;{{ item.dex }}
                  </div>
                  <div class="item item3"></div>
                </div>
                <div class="bottom">
                  <div class="item">
                    <span class="expected"> 预计得到: </span>
                    {{ item.receiveTokenAmount }}
                  </div>
                  <div class="item">
                    <span class="estimatedTime">
                      {{ timeMap[item.estimatedTime] }} 分钟
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="trade-box">
      <div class="trade" style="margin: 0 auto; text-align: center">
        <div class="back-box">
          <div class="back" @click="$emit('close')">
            <i class="el-icon-back"></i>
            <span class="span-text">兑 换</span>
          </div>
        </div>
        <img
          style="height: 420px"
          src="https://paths.finance/img/searching.39810ff2.gif"
          alt=""
        />
      </div>
    </div>
    <div class="dialog-box" v-if="isShowBox">
      <div class="dialog">
        <div class="cont" style="background: transparent">
          <div>
            <div class="top1">
              <div class="coinimg van-image van-image--round">
                <img :src="sourceCoinInfo.logoURI" class="van-image__img" />
              </div>
              <div class="coinname">Approve {{ sourceCoinInfo.symbol }}</div>
            </div>
            <div class="info-text">首次合约调用和新地址交易需要授权.</div>
            <div>
              <button
                @click="approveToken"
                class="approve-btn van-button van-button--default van-button--normal"
              >
                <div class="van-button__content">
                  <span class="van-button__text"
                    >授 权
                    <div class="loading" v-if="isLoading"></div
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="close-icon">
          <i @click="isShowBox = false" class="el-icon-circle-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requestGet, request } from "@/api/request";
import { ethers } from "ethers";
import { swapUrl } from "@/api/apiUrl";
import { copyText, isSourceToken } from "../../util/utils";
import {
  isContract,
  getAllowance,
  approve,
  sendTransaction,
  getChainId,
  changeChain,
} from "../../util/web3";
import { mapState } from "vuex";
export default {
  inject: [
    "toggleShowSelectCoin",
    "selectCoinInfoSource",
    "selectCoinInfoTargrt",
  ],
  props: {
    slippage: {
      type: String,
    },
    toAddress: {
      type: String,
    },
    sourceAmmount: {
      type: String,
    },
    getTransDetails: {
      type: Function,
    },
  },
  computed: {
    ...mapState({
      selectCoinBalance: (state) => state.selectCoinBalance,
      userName: (state) => state.userName,
    }),
    sourceCoinInfo() {
      return this.selectCoinInfoSource();
    },
    targetCoinInfo() {
      return this.selectCoinInfoTargrt();
    },
    selectedDexInfo() {
      return this.multiQuoteList.find((e) => e.dex === this.selectedDex);
    },
    isDex() {
      const list = ["Bridgers", "Aggregator", "SWFT"];
      return !list.includes(this.selectedDexInfo.dex);
    },
  },
  created() {
    this.init();
  },
  data() {
    return {
      isInit: false,
      multiQuoteList: [],
      fromAccount: "",
      copyText,
      selectedDex: "",
      timeMap: {
        1: "1-3",
        2: "1-10",
        3: "1-3",
      },
      isShowBox: false,
      isLoading: false,
      isLoading1: false,
      txData: {},
      isShowDetail: false,
      timer: null,
      i: 30,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    async approveToken() {
      if (this.isLoading) return;
      const amount = ethers.utils
        .parseUnits(this.sourceAmmount, this.selectedDexInfo.fromTokenDecimal)
        .toString();
      const tokenAddress = this.txData.approveAddress || this.txData.to;
      try {
        const chain = await getChainId();
        if (Number(chain) !== Number(this.txData.transferData.fromChainId)) {
          await changeChain(this.txData.transferData.fromChainId);
        }
        this.isLoading = true;
        await approve(
          this.fromAccount,
          this.sourceCoinInfo.address,
          tokenAddress,
          amount
        );
        this.isShowBox = false;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async transaction() {
      const info = await sendTransaction(
        this.txData.from,
        this.txData.to,
        this.txData.data,
        this.txData.value
      );
      try {
        const chain = await getChainId();
        if (Number(chain) !== Number(this.txData.transferData.fromChainId)) {
          await changeChain(this.txData.transferData.fromChainId);
        }
        await info.sendTransaction(info.tx).on("transactionHash", (hash) => {
          this.addTransData(hash);
        });
      } catch (error) {
        console.log(error);
        this.$message.error(error.message);
      }
    },
    async swap() {
      if (this.isLoading1) return;
      if (Number(this.sourceAmmount) > Number(this.selectCoinBalance)) {
        return this.$message.error("余额不足");
      }
      this.isLoading1 = true;
      const amount = ethers.utils
        .parseUnits(this.sourceAmmount, this.selectedDexInfo.fromTokenDecimal)
        .toString();
      const params = {
        equipmentNo:
          this.userName.slice(0, 32) || "Xd46spYt9P22jI8Z90QPvu4Rj2i7D6uw",
        userName:
          this.fromAccount.slice(0, 32) || "Xd46spYt9P22jI8Z90QPvu4Rj2i7D6uw",
        aggregator: "",
        amountOutMin: ethers.utils
          .parseUnits(
            (
              (this.selectedDexInfo.receiveTokenAmount *
                (100 - this.slippage)) /
              100
            ).toFixed(6),
            this.selectedDexInfo.toTokenDecimal
          )
          .toString(),
        amounts: [],
        dex: this.selectedDexInfo.dex,
        fromAddress: this.fromAccount,
        fromTokenAddress: this.sourceCoinInfo.address,
        fromTokenAmount: amount,
        fromTokenChain: this.sourceCoinInfo.chain,
        isNoGas: false,
        midTokenCode: "",
        routerPath: this.selectedDexInfo.routerPath || [],
        slippage: this.slippage,
        source: "cybercrowdcoin",
        toAddress: this.toAddress,
        toTokenAddress: this.targetCoinInfo.address,
        toTokenChain: this.targetCoinInfo.chain,
        txInfo: "",
        utm_source: "",
      };
      const opt = {
        url: swapUrl.commonSwap,
        method: "post",
        params: params,
        resFunc: async (res) => {
          const data = res.data;
          if (data.resCode != 100) {
            this.isLoading1 = false;
            return this.$message.error(data.resMsg);
          }
          const txData = data.data.txData;
          this.txData = txData;
          try {
            const chain = await getChainId();
            if (Number(chain) !== Number(txData.transferData.fromChainId)) {
              await changeChain(txData.transferData.fromChainId);
            }
            if (isSourceToken(this.sourceCoinInfo.address)) {
              // 原生代币
              this.transaction();
            } else {
              // token
              // 获取批准额度
              const tokenAddress = txData.approveAddress || txData.to;
              if (isContract(tokenAddress)) {
                const limit = await getAllowance(
                  this.sourceCoinInfo.address,
                  this.fromAccount,
                  tokenAddress
                );
                if (Number(limit) >= Number(amount)) {
                  this.transaction();
                } else {
                  // 批准额度
                  this.isShowBox = true;
                }
              } else {
                this.transaction();
              }
            }
          } catch (error) {
            console.log(error);
          } finally {
            this.isLoading1 = false;
          }
        },
        errFunc: (err) => {
          this.isLoading1 = false;
          this.$message({
            type: "error",
            message: err.response.data.resMsg,
          });
        },
      };
      request(opt);
    },
    async init() {
      this.fromAccount = this.userName;
      this.multiQuote();
      this.timer = setInterval(() => {
        this.i--;
        if (this.i <= 0) {
          this.reLoad();
          this.i = 30;
        }
      }, 1000);
    },
    reLoad() {
      this.i = 30;
      this.multiQuote();
    },
    async multiQuote() {
      const fromSelectedInfo = this.sourceCoinInfo;
      const toSelectedInfo = this.targetCoinInfo;
      const params = {
        equipmentNo:
          this.userName.slice(0, 32) || "Xd46spYt9P22jI8Z90QPvu4Rj2i7D6uw",
        source: "cybercrowdcoin",
        fromTokenAddress: fromSelectedInfo.address,
        toTokenAddress: toSelectedInfo.address,
        fromTokenAmount: ethers.utils
          .parseUnits(this.sourceAmmount, fromSelectedInfo.decimals)
          .toString(),
        fromTokenChain: fromSelectedInfo.chain,
        toTokenChain: toSelectedInfo.chain,
        slippage: this.slippage,
        userAddr: this.fromAccount,
      };
      if (this.toAddress) {
        params.toAddress = this.toAddress;
      }
      const opt = {
        url: swapUrl.multiQuote,
        method: "get",
        params: params,
        resFunc: (res) => {
          this.isInit = true;
          const data = res.data;
          if (data.resCode != 100) {
            this.$message({
              type: "error",
              message: data.resMsg,
            });
            return;
          }
          this.multiQuoteList = data.data.txData;
          this.selectedDex = data.data.txData[0].dex;
        },
        errFunc: (err) => {
          this.$message({
            type: "error",
            message: err.response.data.resMsg,
          });
        },
      };
      requestGet(opt);
    },
    async addTransData(hash) {
      const amount = ethers.utils
        .parseUnits(this.sourceAmmount, this.selectedDexInfo.fromTokenDecimal)
        .toString();
      const params = {
        equipmentNo:
          this.userName.slice(0, 32) || "Xd46spYt9P22jI8Z90QPvu4Rj2i7D6uw",
        fromTokenAddress: this.sourceCoinInfo.address,
        toTokenAddress: this.targetCoinInfo.address,
        fromAddress: this.fromAccount,
        toAddress: this.toAddress,
        fromTokenAmount: amount,
        slippage: this.slippage,
        from_chain: this.sourceCoinInfo.chain,
        to_chain: this.targetCoinInfo.chain,
        hash,
        toTokenAmount: this.selectedDexInfo.receiveTokenAmount,
        dexName: this.selectedDexInfo.dex,
      };
      const opt = {
        url: swapUrl.addTransData,
        method: "post",
        params: params,
        resFunc: async (res) => {
          this.getTransDetails(hash);
        },
        errFunc: (err) => {
          this.$message({
            type: "error",
            message: err.response.data.resMsg,
          });
        },
      };
      request(opt);
    },
  },
};
</script>

<style lang="scss" scoped>
.chainBlock {
  display: inline-block;
  height: 15px;
  line-height: 15px;
  text-align: center;
  box-sizing: border-box;
  padding: 0 5px;
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  border-radius: 3px;
  transform: scale(0.8);
  border: 1px solid #eaeef5;
  color: #82a5d7;
}
.trade-box {
  justify-content: space-between;
  width: 1100px;
  display: flex;
  .trade {
    box-sizing: border-box;
    width: 530px;
    position: relative;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #eaeef5;
  }

  .trade.marginAuto {
    margin: 0 auto;
  }

  .back-box {
    text-align: left;
    display: flex;
    justify-content: space-between;
  }

  .back-box .back {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }

  .back-box .back img {
    width: 30px;
    cursor: pointer;
  }

  .back-box .back .span-text {
    font-size: 16px;
    font-family: Poppins;
    color: #333;
    margin-left: 5px;
  }

  .back-box .update-box {
    width: 135px;
    height: 40px;
    line-height: 40px;
    background: #fdf9ff;
    border-radius: 20px;
    border: 1px solid #eaeef5;
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    color: #666;
  }

  .back-box .update-box .color {
    color: #007be6;
  }

  .swap-box {
    text-align: left;
  }

  .swap-box .info-item {
    display: flex;
    align-items: center;
  }

  .swap-box .info-item .coin-img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .swap-box .info-item .info {
    flex: 1;
    margin-left: 15px;
  }

  .swap-box .info-item .info .text {
    height: 30px;
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #afb2b8;
    line-height: 30px;
  }

  .swap-box .info-item .info .balance {
    height: 30px;
    font-size: 14px;
    font-family: Poppins;
    color: #333;
    line-height: 30px;
  }

  .swap-box .info-item .info .coin-name {
    height: 30px;
    font-size: 14px;
    font-family: Poppins;
    color: #99aac4;
    line-height: 30px;
  }

  .swap-box .info-item .info .addr {
    height: 23px;
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #556074;
    line-height: 23px;
    padding-left: 15px;
    img {
      cursor: pointer;
    }
  }

  .swap-box .info-item .info .addr.re {
    margin-top: 5px;
  }

  .swap-box .info-item .info .Transfer {
    padding: 0 15px;
  }

  .swap-box .info-item .info .Transfer.receive-box {
    background: #fdf9ff;
    border-radius: 18px;
    border: 1px solid #eaeef5;
    padding: 0.15rem 15px;
  }

  .swap-box .info-item .info .Transfer.receive-box .more-price {
    display: flex;
    align-items: center;
    float: right;
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #08f;
    cursor: pointer;
  }

  .swap-box .info-item .info .Transfer.receive-box .more-price .icon {
    width: 27px;
    height: 27px;
    border-radius: 27px;
  }

  .swap-box .line-box {
    height: 25px;
    margin-left: 25px;
    position: relative;
  }

  .swap-box .line-box .line {
    position: absolute;
    width: 100%;
    height: 60px;
    border-left: 2px dashed #99a8bf;
    left: 0;
    top: -10px;
    z-index: -1;
  }
  .copy-img {
    width: 15px;
  }
  .path-route {
    border: 1px solid #08f;
    color: #08f;
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    padding: 1px 5px;
    margin-left: 10px;
    border-radius: 3px;
    background: #101a29;
    display: inline-flex;
  }
  .van-divider {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin: 16px 0;
    color: #969799;
    font-size: 14px;
    line-height: 24px;
    border-color: #eaeef5;
    border-style: solid;
    border-width: 0;
  }

  .van-divider:before {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    border-width: 1px 0 0;
    content: "";
  }
  .info {
    text-align: left;
  }
  .info .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #afb2b8;
    margin-bottom: 15px;
    height: 22px;
  }

  .info .list .icon {
    width: 22px;
    height: 22px;
    float: right;
  }
  .getprice-btn {
    width: 100%;
    height: 75px;
    line-height: 75px;
    background: #277ffa;
    border-radius: 15px;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 18px;
  }

  .getprice-btn[disabled] {
    color: #fff !important;
    background: #213148 !important;
    cursor: default;
  }

  .more-price-content {
    margin: 0;
    text-align: left;
    box-sizing: border-box;
    width: 530px;
    position: relative;
    background: #fff;
    padding: 10px 20px 20px 20px;
    border-radius: 0.5rem;
    border: 1px solid #eaeef5;
  }

  .more-price-content .list-box {
    height: 50vh;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .more-price-content .title {
    font-size: 18px;
    font-family: Poppins;
    color: #333;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .more-price-content .list.fl {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .more-price-content .list.td {
    font-size: 0.2222rem;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #707792;
    padding: 10px 0;
  }

  .more-price-content .list .price-box {
    padding: 5px 10px;
    cursor: pointer;
    background: #fdf9ff;
  }

  .more-price-content .list .price-box .top {
    display: flex;
    align-items: center;
    height: 32px;
    justify-content: space-between;
  }

  .more-price-content .list .price-box .bottom {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .more-price-content .list .price-box .bottom .expected {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #5c6484;
    line-height: 14px;
    margin-right: 5px;
  }

  .more-price-content .list .free-gas {
    width: 100%;
    background: #277ffa;
    opacity: 1;
    padding: 0 5px 0 14px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .more-price-content .list .free-gas .sd {
    width: 14px;
    margin-right: 0.05rem;
  }

  .more-price-content .list .free-gas .free-text {
    width: 0;
    flex: 1;
    font-size: 10px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #fff;
    line-height: 15px;
    padding: 5px 0;
  }

  .more-price-content .list .free-gas .free-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 5px;
    font-size: 0.4rem;
  }

  .more-price-content .list.price {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #aab0c8;
    border-radius: 20px;
    box-sizing: border-box;
    border: 1px solid #eaeef5;
    margin-top: 8px;
    overflow: hidden;
  }

  .more-price-content .list.price:first-child {
    margin-top: 0;
  }

  .more-price-content .list.price.active {
    background: linear-gradient(
      90deg,
      rgba(39, 127, 250, 0.14),
      rgba(0, 77, 185, 0.14)
    );
    border: 1px solid #007be6;
    color: #fff;
  }

  .more-price-content .list .item {
    display: flex;
    align-items: center;
    color: #999;
  }
  .more-price-content .list .item1 {
    color: #333;
  }

  .more-price-content .list .item3 {
    text-align: right;
    padding-right: 12px;
  }

  .more-price-content .list .item3.green {
    color: #02bc74;
  }

  .more-price-content .list .item3.red {
    color: #cd4444;
  }

  .more-price-content .list .item3 .hot {
    width: 0.4rem;
  }

  .more-price-content .list .icon {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    margin-right: 5px;
  }

  .path-route {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    padding: 0 5px;
    margin-left: 5px;
    border-radius: 5px;
    background: #101a29;
  }

  .path-route.recommended {
    border: 1px solid #08f;
    color: #08f;
  }

  .path-route.fast,
  .path-route.maximumReturn {
    border: 1px solid #02bc74;
    color: #02bc74;
  }
}
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
}

.dialog-box .dialog {
  position: relative;
  top: -1%;
  height: auto;
  border-radius: 0.5rem;
  transition: 0.5s ease;
  width: 500px;
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
  padding: 25px;
  border-radius: 0.5rem;
  z-index: 11;
  background: #fff !important;
  // backdrop-filter: blur(20px);
  border: 0.5px solid #18212e;
}

.dialog-box .dialog .close-icon {
  text-align: center;
  padding-top: 25px;
}

.dialog-box .dialog .close-icon .el-icon-circle-close {
  font-size: 40px;
  color: #8c9ab0;
  cursor: pointer;
}

.dialog-box .dialog .close-icon .el-icon-circle-close:hover {
  color: #fff;
}

.coinimg {
  width: 85px;
  height: 85px;
  img {
    width: 100%;
    height: 100%;
  }
}

.van-image--round {
  overflow: hidden;
  border-radius: 50%;
}
.van-image {
  position: relative;
  display: inline-block;
}
.coinname {
  font-size: 16px;
  font-family: Poppins;
  color: #333;
  margin-top: 20px;
}
.top1 {
  padding: 50px 0 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.info-text {
  font-size: 14px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #aab0c8;
  margin: 20px 0;
  text-align: center;
}
.approve-btn {
  width: 100%;
  height: 54px;
  line-height: 54px;
  background: #277ffa;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top: 40px;
  color: #fff;
  font-size: 16px;
}

.approve-btn[disabled] {
  color: #fff !important;
  background: #213148 !important;
  cursor: default;
}
.van-button__text {
  position: relative;
}
.loading {
  width: 15px;
  height: 15px;
  display: inline-block;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: rotate 0.75s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -8px;
  margin-left: 30px;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

.centerDiv {
  text-align: center;
}

.centerDiv .imgDiv {
  width: 100%;
  height: auto;
  margin-bottom: 19px;
}

.centerDiv .imgDiv.mt {
  margin-top: 35px;
}

.centerDiv .imgDiv img {
  width: 35%;
  margin: 0 auto;
  padding-top: 12px;
  display: block;
}

.centerDiv .imgDiv .status {
  font-size: 16px;
}

.centerDiv .content {
  width: 100%;
  margin: 0 auto;
  height: auto;
}

.centerDiv .content .valDiv .bottom,
.centerDiv .content .valDiv .top {
  height: 65px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.centerDiv .content .valDiv .bottom .coinimg,
.centerDiv .content .valDiv .top .coinimg {
  width: 36px;
  height: 36px;
  margin-right: 15px;
}

.centerDiv .content .valDiv .bottom .info,
.centerDiv .content .valDiv .top .info {
  width: calc(100% - 45px);
  text-align: left;
}

.centerDiv .content .valDiv .bottom .info .tip,
.centerDiv .content .valDiv .top .info .tip {
  text-align: left;
  min-height: 16px;
  font-size: 10px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #000;
}

.centerDiv .content .valDiv .bottom .info .tip .span12,
.centerDiv .content .valDiv .top .info .tip .span12 {
  font-size: 12px;
  display: block;
  color: #666;
}

.centerDiv .content .valDiv .bottom .info .tip .span16,
.centerDiv .content .valDiv .top .info .tip .span16 {
  font-size: 14px;
  font-family: Poppins-Bold;
  color: #333;
}

.centerDiv .content .valDiv .bottom .info .tip .span14,
.centerDiv .content .valDiv .top .info .tip .span14 {
  font-size: 14px;
  font-family: Poppins-Bold;
  color: #666;
  padding-left: 10px;
  line-height: 30px;
}

.centerDiv .content .valDiv .bottom .info .tip .spanAddr,
.centerDiv .content .valDiv .top .info .tip .spanAddr {
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  color: #99aac4;
}

.centerDiv .content .valDiv .bottom-nfts {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.centerDiv .content .valDiv .bottom-nfts .coinimg {
  width: 36px;
  height: 36px;
  margin-right: 15px;
}

.centerDiv .content .valDiv .bottom-nfts .info {
  width: 100%;
  text-align: left;
}

.centerDiv .content .valDiv .bottom-nfts .info .tip {
  text-align: left;
  min-height: 16px;
  font-size: 10px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  color: #000;
}

.centerDiv .content .valDiv .bottom-nfts .info .tip .span12 {
  font-size: 12px;
  display: block;
  color: #afb2b8;
}

.centerDiv .content .valDiv .bottom-nfts .info .tip .span16 {
  font-size: 14px;
  font-family: Poppins-Bold;
  color: #fff;
}

.centerDiv .content .valDiv .bottom-nfts .info .tip .span14 {
  font-size: 14px;
  font-family: Poppins-Bold;
  color: #99aac4;
  padding-left: 20px;
}

.centerDiv .content .valDiv .bottom-nfts .info .tip .spanAddr {
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  color: #99aac4;
}

.centerDiv .content .valDiv .middle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.centerDiv .content .valDiv .middle .line {
  height: 24px;
  margin-left: 17px;
  border-right: 1px dashed #99a8bf;
}

.centerDiv .content .divider {
  width: 100%;
  height: 1px;
  background: #28364b;
  margin: 25px auto;
}

.centerDiv .content .rate,
.centerDiv .content .received {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  position: relative;
}

.centerDiv .content .rate.list,
.centerDiv .content .received.list {
  height: 50px;
  align-items: center;
}

.centerDiv .content .rate .left,
.centerDiv .content .received .left {
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: #666;
  text-align: left;
  white-space: nowrap;
  position: relative;
  display: flex;
  align-items: center;
}

.centerDiv .content .rate .left .status-img,
.centerDiv .content .received .left .status-img {
  float: left;
  width: 30px;
  height: 30px;
}

.centerDiv .content .rate .left .status-img img,
.centerDiv .content .received .left .status-img img {
  width: 100%;
  height: 100%;
}

.centerDiv .content .rate .left .hash-name,
.centerDiv .content .received .left .hash-name {
  margin-left: 10px;
  color: #666;
}

.centerDiv .content .rate .right,
.centerDiv .content .received .right {
  text-align: right;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #666;
  display: flex;
  align-items: center;
}

.centerDiv .content .rate .right .iconRouter,
.centerDiv .content .received .right .iconRouter {
  width: 20px;
  height: 20px;
  float: left;
  border-radius: 10px;
}

.centerDiv .content .rate .line,
.centerDiv .content .received .line {
  position: absolute;
  width: 20px;
  height: 35px;
  border-left: 1px dashed #3e8eff;
  opacity: 0.41;
  top: -0.45rem;
  left: 0.21rem;
}

.centerDiv .content .buttonDiv div {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  font-family: Poppins-Regular\, Poppins;
  font-weight: 400;
  color: #aab0c8;
}

.centerDiv .content .buttonDiv div .left {
  float: left;
}

.centerDiv .content .buttonDiv div .right {
  float: right;
  font-family: DINPro-Medium\, DINPro;
  font-weight: 500;
  color: #fff;
}

.centerDiv .content .buttonDiv div .right a {
  color: #579dff;
}

.centerDiv .content .buttonDiv button {
  width: 100%;
  background: #277ffa;
  border-radius: 40px;
  height: 55px;
  margin-top: 18px;
  font-family: Poppins;
  color: #fff;
  line-height: 55px;
  border: 0;
}

.centerDiv .closeIcon {
  width: calc(100% - 32px);
  height: 40px;
  position: absolute;
  bottom: -50px;
}

.centerDiv .closeIcon img {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.centerDiv .tip-content {
  padding: 5px 8px;
  font-size: 12px;
}

.centerDiv .infoText {
  width: 90%;
  margin-left: -20px;
  padding: 10px calc(20px + 5%);
  margin-bottom: 3px;
  background: #f2f8ff;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #89aee1;
  line-height: 18px;
  text-align: left;
}

.centerDiv .infoText .service a {
  color: #287ffa;
}
.spanAddr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 15px;
    height: 15px;
  }
}
.centerDiv .content .rate .right {
  img {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
}
.back-box .update-box .shuaxin {
  font-size: 12px;
  position: absolute;
  right: 10px;
  color: #007be6;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>