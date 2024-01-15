import Vue from "vue";
import Vuex from "vuex";
import { swapUrl } from "@/api/apiUrl";
import { request } from "@/api/request";
import { ethers } from "ethers";
import { chainNameMap } from "../util/config";
import { isSourceToken } from "../util/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    baseInfo: {},
    publicNodes: {},
    selectCoinBalance: 0,
    userName: ''
  },
  mutations: {
    SET_BASEINFO(state, value) {
      state.baseInfo = value
    },
    SET_PUBLICNODES(state, value) {
      state.publicNodes = value
    },
    SET_SELECTCOINBALANCE(state, value) {
      state.selectCoinBalance = value
    },
    SET_USERNAME(state, value) {
      state.userName = value
    },
  },
  actions: {
    // 获取基本信息
    getBaseInfo({state, commit}) {
      const opt = {
        url: swapUrl.getBaseInfo,
        method: "get",
        resFunc: (res) => {
          if (res.data.resCode == 100) {
            commit('SET_BASEINFO', res.data.data.tokens)
          }
        },
        errFunc: (err) => {
          console.log(err, "err1");
        },
      };
      request(opt);
    },
    // 获取链的rpc地址信息
    async getPublicNodes({state, commit}) {
      if (!state.userName) return
      const opt = {
        url: swapUrl.publicNode,
        method: "post",
        params: {
          equipmentNo: state.userName.slice(0, 32) || 'Xd46spYt9P22jI8Z90QPvu4Rj2i7D6uw',
          mainNetwork: "",
          source: "cybercrowdcoin",
        },
        resFunc: (res) => {
          if (res.data.resCode == 800) {
            commit('SET_PUBLICNODES', res.data.data)
          }
        },
        errFunc: (err) => {
          console.log(err, "err1");
        },
      };
      request(opt);
    },
    // 获取当前地址对应币种的余额
    async getBalanceOfTokens({state, commit}, info) {
      if (!state.userName) return
      let chainUrl
      if (state.publicNodes[info.chain]) {
        chainUrl = state.publicNodes[info.chain]
      } else
      if ([chainNameMap[info.chain]]) {
        chainUrl = state.publicNodes[chainNameMap[info.chain]]
      }
      if (!chainUrl) return
      const url = chainUrl.split(',')[0]
      const abiCoder = new ethers.utils.AbiCoder()
      const res = abiCoder.encode(['address'], [state.userName])
      const selecter = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('balanceOf(address)')).substr(2, 8)
      const calldata = `0x${selecter}${res.substr(2,res.length)}`
      const pros = info.list.map(e => {
        const obj = {
          id: e.address,
          jsonrpc: "2.0",
          method: "eth_call",
          params: null
        }
        if (isSourceToken(e.address)) {
          obj.method = 'eth_getBalance'
          obj.params = [state.userName, "latest"]
        } else {
          obj.method = 'eth_call',
          obj.params = [{
            data: calldata,
            from: state.userName,
            to: e.address
          }, "latest"]
        }
        return obj
      })
      //
      
      while (pros.length) {
        getBalance(pros.splice(0,100), url, info)
      }
    },
    // 获取当前地址的余额
    async getBalances({state, commit}, info) {
      if (!state.userName) return
      let chainUrl
      if (state.publicNodes[info.chain]) {
        chainUrl = state.publicNodes[info.chain]
      } else
      if ([chainNameMap[info.chain]]) {
        chainUrl = state.publicNodes[chainNameMap[info.chain]]
      }
      if (!chainUrl) return
      const url = chainUrl.split(',')[0]
      const abiCoder = new ethers.utils.AbiCoder()
      const res = abiCoder.encode(['address'], [state.userName])
      const selecter = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('balanceOf(address)')).substr(2, 8)
      const calldata = `0x${selecter}${res.substr(2,res.length)}`
      const params = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_call",
        params: null
      }
      if (isSourceToken(info.address)) {
        params.method = 'eth_getBalance'
        params.params = [state.userName, "latest"]
      } else {
        params.method = 'eth_call',
        params.params = [{
          data: calldata,
          from: state.userName,
          to: info.address
        }, "latest"]
      }
      const opt = {
        url: url,
        method: "post",
        params: params,
        resFunc: (res) => {
          const data = res.data
          if (!data) return
          commit('SET_SELECTCOINBALANCE', ethers.utils.formatUnits(data.result || '0x00', info.decimals))
        },
        errFunc: (err) => {
          console.log(err, "err1");
        },
      };
      request(opt);
    }
  },
  modules: {},
  getters: {
    chainList(state) {
      return Object.keys(state.baseInfo)
    },
    coinListOfChain: (state, getter) => (key) => {
      return state.baseInfo[getter.chainList[key]]
    }
  }
});
export default store

function getBalance(params, url, info) {
  const opt = {
    url: url,
    method: "post",
    params: params,
    resFunc: (res) => {
      const data = res.data
      if (!data) return
      const obj = Object.assign({}, store.state.baseInfo)
      const coinList = obj[info.chain]
      coinList.forEach(e => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id ===  e.address) {
            e.balance =  ethers.utils.formatUnits(data[i].result || '0x00', e.decimals)
          }
        }
      })
      store.commit('SET_BASEINFO', obj)
    },
    errFunc: (err) => {
      console.log(err, "err1");
    },
  };
  request(opt);
}