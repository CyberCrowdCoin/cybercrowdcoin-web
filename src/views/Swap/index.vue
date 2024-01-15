<template>
  <div style="width: 100%; height: 83vh; overflow-y: auto">
    <div v-if="!isShowSwapConfirm" class="trade" style="margin: 0 auto">
      <div class="trade-box">
        <div class="input-box">
          <div class="top-info">
            <span>From</span>
            <span class="chainBlock ETH" v-if="sourceCoinInfo.chain">
              {{ sourceCoinInfo.chain }}
            </span>
            <span class="balance">余额:{{ selectCoinBalance || 0 }}</span>
          </div>
          <div class="input-info">
            <input placeholder="0" v-model="sourceAmmount" type="number" /><span
              @click="max"
              class="max"
              >MAX</span
            >
          </div>
        </div>
        <div class="coin-box">
          <div class="coin-item" @click="selectCoin(1)">
            <div
              v-if="sourceCoinInfo.chain"
              class="logo van-image van-image--round"
            >
              <img :src="sourceCoinInfo.logoURI" class="van-image__img" />
            </div>
            <div v-if="sourceCoinInfo.chain" class="coin-name">
              {{ sourceCoinInfo.symbol }}
            </div>
            <div v-else class="coin-name">选择</div>
            <div>
              <i class="el-icon-caret-bottom"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="return-btn">
        <img @click="changeCoinInfo" :src="swapIcon" alt="" />
      </div>
      <div class="trade-box">
        <div class="input-box">
          <div class="top-info">
            <span>To</span
            ><span class="chainBlock ETH" v-if="targetCoinInfo.chain">
              {{ targetCoinInfo.chain }}
            </span>
          </div>
          <div class="input-info">{{ targetAmount }}</div>
        </div>
        <div class="coin-box noboder">
          <div class="coin-item" @click="selectCoin(2)">
            <div
              class="logo van-image van-image--round"
              v-if="targetCoinInfo.chain"
            >
              <img :src="targetCoinInfo.logoURI" class="van-image__img" />
            </div>
            <div v-if="targetCoinInfo.chain" class="coin-name">
              {{ targetCoinInfo.symbol }}
            </div>
            <div v-else class="coin-name">选择</div>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
        <div>
          <div></div>
        </div>
      </div>
      <div class="sliding-point border-box">
        <div class="top">
          <div class="title">滑点</div>
        </div>
        <div class="point-list">
          <div
            class="point-box"
            @click="selectedSlippage = 1"
            :class="selectedSlippage === 1 && 'active'"
          >
            1%
          </div>
          <div
            class="point-box"
            @click="selectedSlippage = 2"
            :class="selectedSlippage === 2 && 'active'"
          >
            2%
          </div>
          <div
            class="el-tooltip point-box no-box item"
            :class="selectedSlippage === 3 && 'active'"
            @click="selectedSlippage = 3"
            aria-describedby="el-tooltip-9497"
            tabindex="0"
          >
            <input
              placeholder="自定义"
              type="number"
              v-model="slippageVal"
              class="number border-box"
            />
            %
          </div>
        </div>
      </div>
      <div class="receiving-address">
        <input v-model="toAddress" placeholder="接收地址" class="address" />
        <div class="tip">接收地址请勿填写交易所地址</div>
      </div>
      <div>
        <div></div>
      </div>
      <div class="btns">
        <button class="getprice-btn" @click="submit">询 价</button>
      </div>
    </div>
    <swap-confirm
      @close="isShowSwapConfirm = false"
      v-else
      :toAddress="toAddress"
      :slippage="slippage"
      :sourceAmmount="sourceAmmount"
      :getTransDetails="getTransDetails"
    />
    <el-table :data="list" style="width: 100%; margin-top: 20px">
      <el-table-column prop="createTime" label="date" width="210">
      </el-table-column>
      <el-table-column prop="name" label="from">
        <template slot-scope="scope">
          <div class="listItem">
            <div class="leftItemLeft">
              <img :src="scope.row.fromTokenUrl" alt="" />
            </div>
            <div class="leftItemRight">
              <div class="symbol">
                {{ scope.row.fromTokenSymbol }}
                <div class="chain">{{ scope.row.fromTokenChain }}</div>
              </div>
              <div class="amount">
                {{ scope.row.fromAmount }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="to">
        <template slot-scope="scope">
          <div class="listItem">
            <div class="leftItemLeft">
              <img :src="scope.row.toTokenUrl" alt="" />
            </div>
            <div class="leftItemRight">
              <div class="symbol">
                {{ scope.row.toTokenSymbol }}
                <div class="chain">{{ scope.row.toTokenChain }}</div>
              </div>
              <div class="amount">
                {{ scope.row.toTokenAmount }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="状态" width="180">
        <template slot-scope="scope">
          <span>{{
            scope.row.status === "success"
              ? "已完成"
              : scope.row.status === "pending"
              ? "正在兑换中"
              : "兑换失败"
          }}</span></template
        >
      </el-table-column>
      <el-table-column prop="createTime" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              isShowDetail = true;
              getTransDetail(scope.row.txHash);
            "
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end">
      <el-pagination
        v-if="total > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <div class="dialog-box" v-if="isShowDetail">
      <div class="dialog" style="width: 500px">
        <div class="cont" style="background: transparent">
          <div class="centerDiv">
            <!---->
            <div class="imgDiv">
              <img
                :src="
                  detailData.finalStatus == 'pending'
                    ? swapConfirm
                    : exchangeSuccess
                "
                alt=""
              />
              <div class="status" style="color: rgb(46, 221, 59)">
                {{ detailData.finalStatus == "pending" ? "进行中" : "已完成" }}
              </div>
              <!---->
            </div>
            <div class="content">
              <div class="valDiv">
                <div class="top">
                  <div class="coinimg van-image van-image--round">
                    <img
                      :src="detailData.fromTokenUrl"
                      class="van-image__img"
                    />
                  </div>
                  <div class="info">
                    <div class="tip">
                      <span class="span12">
                        转出 &nbsp;<span class="chainBlock ETH">
                          {{ detailData.fromTokenChain }}
                        </span></span
                      ><span class="span16">{{ detailData.fromAmount }}</span
                      ><span class="span14">{{
                        detailData.fromTokenSymbol
                      }}</span>
                      <div class="spanAddr">
                        <span>{{ detailData.refundAddress }}</span
                        ><img
                          @click="copyText(detailData.refundAddress)"
                          src="data:image/png;base64,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"
                          alt=""
                          class="copy-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="middle">
                  <div class="line"></div>
                </div>
                <div class="bottom">
                  <div class="coinimg van-image van-image--round">
                    <img :src="detailData.toTokenUrl" class="van-image__img" />
                  </div>
                  <div class="info">
                    <div class="tip">
                      <span class="span12">
                        收到 &nbsp;<span class="chainBlock ETH">
                          {{ detailData.toTokenChain }}
                        </span></span
                      ><span class="span16">{{ detailData.toTokenAmount }}</span
                      ><span class="span14">{{
                        detailData.toTokenSymbol
                      }}</span>
                      <div class="spanAddr">
                        <span>{{ detailData.receiveAddress }}</span
                        ><img
                          @click="copyText(detailData.receiveAddress)"
                          src="data:image/png;base64,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"
                          alt=""
                          class="copy-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!---->
              </div>
              <div class="divider"></div>
              <div class="rate">
                <div class="left">创建时间</div>
                <div class="right">{{ detailData.createTime }}</div>
              </div>
              <div class="rate">
                <div class="left">兑换路径</div>
                <div class="right">
                  <img :src="detailData.logoUrl" alt="" class="iconRouter" />
                  &nbsp; {{ detailData.dexName }}
                </div>
              </div>
              <div class="rate" v-if="detailData.finalStatus == 'pending'">
                <div class="left">预计时间</div>
                <div class="right">
                  {{ timeMap[detailData.estimatedTime] }} 分钟
                </div>
              </div>
              <!----><!---->
              <div class="rate">
                <div class="left">Hash</div>
              </div>
              <div
                class="rate list"
                v-for="item in detailData.status"
                :key="item.txHash"
              >
                <div class="left">
                  <div class="status-img">
                    <img
                      :src="
                        detailData.finalStatus == 'pending'
                          ? 'data:image/png;base64,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'
                          : 'data:image/png;base64,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'
                      "
                      alt=""
                    /><!----><!---->
                  </div>
                  <span class="hash-name">{{ item.chain }}</span>
                </div>
                <div class="right">
                  <span
                    style="
                      color: rgb(41, 128, 250);
                      word-break: break-word;
                      cursor: pointer;
                    "
                    @click="open(item.url)"
                  >
                    {{ truncateString(item.txHash, 15) }} </span
                  ><img
                    @click="copyText(item.txHash)"
                    src="data:image/png;base64,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"
                    alt=""
                    class="copy-img"
                  />
                </div>
                <!---->
              </div>
            </div>
            <!----><!---->
          </div>
        </div>
        <div class="close-icon">
          <i @click="isShowDetail = false" class="el-icon-circle-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swapIcon from "../../assets/swap.svg";
import { swapUrl } from "@/api/apiUrl";
import { requestGet } from "@/api/request";
import { mapActions, mapState } from "vuex";
import { ethers } from "ethers";
import SwapConfirm from "../SwapConfirm/index.vue";
import { estimateGas } from "../../util/web3";
import { copyText, isSourceToken, truncateString } from "../../util/utils";
import swapConfirm from "../../assets/swapConfirm.gif";
import exchangeSuccess from "../../assets/exchangeSuccess.png";
export default {
  inject: [
    "toggleShowSelectCoin",
    "selectCoinInfoSource",
    "selectCoinInfoTargrt",
    "changeCoinInfo",
  ],
  components: {
    SwapConfirm,
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
      this.multiQuote();
      return this.selectCoinInfoTargrt();
    },
    slippage() {
      switch (this.selectedSlippage) {
        case 1:
          return "1";
        case 2:
          return "2";
        default:
          return this.slippageVal;
      }
    },
  },
  data() {
    return {
      swapConfirm,
      exchangeSuccess,
      copyText,
      isSourceToken,
      truncateString,
      isShowDetail: false,
      list: [],
      sourceAmmount: "",
      targetAmount: "",
      toAddress: "",
      slippageVal: "",
      selectedSlippage: 1,
      swapIcon,
      isChange: false,
      isShowSwapConfirm: false,
      total: 0,
      params: {
        fromAddress: null,
        pageSize: 5,
        pageNo: 1,
      },
      detailData: {},
      timeMap: {
        1: "1-3",
        2: "1-10",
        3: "1-3",
      },
    };
  },
  async mounted() {
    console.log(this.userName);
    this.init();
    if (!this.userName) return;
    this.toAddress = this.userName;
    this.getList(this.toAddress);
  },
  methods: {
    ...mapActions(["getPublicNodes", "getBaseInfo"]),
    init() {
      this.getPublicNodes();
      this.getBaseInfo();
    },
    submit() {
      if (!this.userName) return this.$message.error("请链接钱包");
      if (!this.sourceCoinInfo.name || !this.targetCoinInfo.name)
        return this.$message.error("请选择币种");
      if (!this.sourceAmmount) return this.$message.error("请输入数量");
      if (!this.toAddress) return this.$message.error("请输入收币地址");
      if (!this.slippage) return this.$message.error("请设置滑点");
      this.isShowSwapConfirm = true;
    },
    async max() {
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      // const gas = await estimateGas(accounts[0], accounts[0]);
      // const formatGas = ethers.utils.formatUnits(
      //   gas.toString(),
      //   this.sourceCoinInfo.decimals
      // );
      // this.sourceAmmount = (this.sourceCoinInfo.balance - formatGas).toString();
      this.sourceAmmount = this.selectCoinBalance;
      // this.sourceAmmount = this.sourceCoinInfo.balance;
    },
    selectCoin(key) {
      this.toggleShowSelectCoin(key);
    },
    async multiQuote() {
      const fromSelectedInfo = this.selectCoinInfoSource();
      const toSelectedInfo = this.selectCoinInfoTargrt();
      if (this.sourceAmmount && toSelectedInfo.chain) {
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
        };
        if (this.toAddress) {
          params.toAddress = this.toAddress;
        }
        const opt = {
          url: swapUrl.multiQuote,
          method: "get",
          params: params,
          resFunc: (res) => {
            const data = res.data;
            if (data.resCode != 100) {
              this.$message({
                type: "error",
                message: data.resMsg,
              });
              return;
            }
            const toCoinInfo = data.data.txData.reduce(
              (prev, cur) => {
                if (Number(prev.toTokenAmount) > Number(cur.toTokenAmount)) {
                  return prev;
                } else {
                  return cur;
                }
              },
              { toTokenAmount: 0 }
            );
            this.targetAmount = toCoinInfo.toTokenAmount;
          },
          errFunc: (err) => {
            this.$message({
              type: "error",
              message: err.response.data.resMsg,
            });
            console.log(err, "err1");
          },
        };
        requestGet(opt);
      }
    },
    async getList(address) {
      this.params.fromAddress = address;
      const opt = {
        url: swapUrl.getTransData,
        method: "get",
        params: this.params,
        resFunc: async (res) => {
          const data = res.data;
          this.list = data.data.list;
          this.total = data.data.total;
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
    getTransDetails(hash) {
      this.getTransDetail(hash);
      this.isShowDetail = true;
      this.params.pageNo = 1;
      this.getList(this.toAddress);
    },
    async getTransDetail(hash) {
      const params = {
        hash,
      };
      const opt = {
        url: swapUrl.getTransDetail,
        method: "get",
        params: params,
        resFunc: async (res) => {
          const data = res.data;
          this.detailData = data.data;
          if (data.data.finalStatus !== "success" && this.isShowDetail) {
            setTimeout(() => {
              this.getTransDetail(hash);
            }, 3000);
          }
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
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList(this.toAddress);
    },
    handleCurrentChange(val) {
      this.params.pageNo = val;
      this.getList(this.toAddress);
    },
    open(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.trade {
  box-sizing: border-box;
  position: relative;
  background: #fff;
  padding: 20px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border: 0.5px solid #eaeef5;
  width: 530px;
  color: #fff;
  .return-btn {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
      border: 1px solid #eaeef5;
      border-radius: 15px;
      padding: 5px;
    }
  }
  .trade-box {
    width: 100%;
    padding: 10px 14px;
    border-radius: 5px;
    border: 1px solid #eaeef5;
    box-sizing: border-box;
    display: flex;
    text-align: left;
    background: #fdf9ff;
    position: relative;
    .input-box {
      flex: 1;
    }
    .coin-box {
      max-width: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0.25rem;
      border-left: 1px solid #eaeef5;
      cursor: pointer;
      .coin-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .coin-name {
          margin: 0 5px;
          font-size: 16px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          color: #333;
        }
      }
      .logo {
        overflow: hidden;
        border-radius: 50%;
        width: 30px;
        img {
          max-width: 100%;
          max-height: 100%;
          vertical-align: middle;
        }
      }
    }
    .top-info {
      height: 25px;
      line-height: 25px;
      font-size: 14px;
      padding-right: 13px;
      color: #8088a7;
      position: relative;
    }
    .input-info {
      color: #333;
      height: 35px;
      display: flex;
      align-items: center;
      padding-right: 14px;
      font-size: 14px;
      input {
        outline: none;
        height: 35px;
        line-height: 35px;
        padding: 0;
        border: none;
        width: 100%;
        background: none;
        font-size: 14px;
        color: #333;
      }
      .max {
        width: 60px;
        background: #277ffa;
        text-align: center;
        cursor: pointer;
        border-radius: 5px;
        font-size: 14px;
        color: #fff;
      }
    }
    .chainBlock {
      position: absolute;
      top: 3px;
      margin-left: 3px;
      transform: scale(0.8);
      border: 1px solid #eaeef5;
      color: #82a5d7;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      text-align: center;
      box-sizing: border-box;
      padding: 0 5px;
      font-size: 12px;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      border-radius: 3px;
    }
    .balance {
      font-size: 12px;
      font-family: Poppins-Medium, Poppins;
      font-weight: 500;
      color: #868686;
      float: right;
    }
  }
  .sliding-point {
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 48px;
    margin-top: 20px;
    background: #fdf9ff;
    border-radius: 5px;
    text-align: left;
    padding: 0 14px;
    justify-content: space-between;
    .top {
      justify-content: space-between;
      height: 25px;
      padding-right: 20px;
      color: #8088a7;
      display: flex;
      align-items: center;
      font-size: 11px;
      font-family: Poppins-Medium, Poppins;
    }
    .point-list {
      justify-content: flex-end;
      color: #aab0c8;
      display: flex;
      align-items: center;
      font-size: 11px;
      font-family: Poppins-Medium, Poppins;
      .point-box {
        width: 82px;
        height: 30px;
        background: #fdf9ff;
        border-radius: 5px;
        margin-left: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #5a5f67;
      }
      .active {
        background: #277ffa;
        color: #fff;
        input {
          color: #fff;
          &::placeholder {
            color: #fff;
          }
        }
      }
      .no-box {
        justify-content: space-between;
        padding: 0 5px;
        .number {
          height: 20px;
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
        }
      }
    }
  }
  .border-box {
    width: 100%;
    box-sizing: border-box;
  }
  .receiving-address {
    width: 100%;
    margin: 20px 0;
    position: relative;
    box-sizing: border-box;
    .address {
      box-sizing: border-box;
      width: 100%;
      font-size: 14px;
      outline: none;
      height: 54px;
      background: #fdf9ff;
      border-radius: 5px;
      border: 1px solid #eaeef5;
      padding: 0 13px;
      color: #333;
    }
    .tip {
      text-align: left;
      margin-top: 10px;
      font-size: 12px;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #f17373;
      padding: 0 10px;
    }
  }
  .btns {
    margin-top: 16px;
    .getprice-btn {
      width: 100%;
      height: 74px;
      line-height: 74px;
      background: #277ffa;
      border-radius: 10px;
      font-size: 20px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
  }
}
.listItem {
  display: flex;
  align-items: center;
  .leftItemLeft {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
  }
  .leftItemRight {
    .symbol {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #333;
      font-weight: bold;
      .chain {
        font-weight: normal;
        font-size: 12px;
        border: 1px solid #3a4f6b;
        line-height: 10px;
        border-radius: 5px;
        padding: 3px;
        margin-left: 10px;
      }
    }
    .amount {
      color: #999;
    }
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
  color: #fff;
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
  color: #99aac4;
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
  color: #99aac4;
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
  color: #aab0c8;
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
</style>