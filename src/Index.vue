<template>
  <div class="ccc-index">
    <div class="head_logo">
      <div class="head_logo_l">
        <img src="./assets/logo.png" alt="" />
        <p>CCC</p>
      </div>
      <div class="head_logo_r">
        <div
          style="cursor: pointer; margin-right: 25px"
          @click="loginWithMetaMask"
        >
          <i class="iconfont icon-wangluo"></i>
          <span>Connect Wallet</span>
        </div>
        <div>
          <i class="icon-geren iconfont"></i>
          <span>{{ userName }}</span>
        </div>
      </div>
    </div>
    <el-container>
      <el-aside width="230px" style="position: relative">
        <div class="ccc-menu">
          <el-menu :default-active="onRoutes">
            <div v-for="(item, index) in submenuList" :key="index">
              <!-- 一级菜单（没有任何子级菜单）-->
              <el-menu-item
                @click="goCon(item.path)"
                :index="item.path"
                v-if="!item.menuList"
              >
                <i :class="item.icon + ' iconfont'"></i>
                {{ item.title }}
              </el-menu-item>

              <!-- 一级菜单（有子级菜单）-->
              <el-submenu :index="item.path" v-else>
                <template slot="title"
                  ><i :class="item.icon + ' iconfont'"></i
                  >{{ item.title }}</template
                >

                <!-- 遍历二级菜单容器 -->
                <div v-for="(i, index) in item.menuList" :key="index">
                  <!-- 判断二级菜单（没有三级菜单）-->
                  <el-menu-item
                    @click="goCon(i.path)"
                    :index="i.path"
                    v-if="!i.list"
                    style="font-size: 13px"
                  >
                    <i style="margin-right: 7px; font-weight: bold"></i>
                    {{ i.title }}</el-menu-item
                  >

                  <!-- 判断二级菜单（有三级菜单）-->
                  <el-submenu
                    :index="i.path"
                    v-else
                    style="padding-left: 15px !important"
                    class="two_have_three_menu"
                  >
                    <template slot="title"
                      ><span style="font-size: 13px">{{
                        i.title
                      }}</span></template
                    >
                    <el-menu-item
                      :index="j.path"
                      v-for="(j, index) in i.list"
                      :key="index"
                      @click="goCon(j.path)"
                      style="padding-left: 27px"
                    >
                      {{ j.title }}
                    </el-menu-item>
                  </el-submenu>
                </div>
              </el-submenu>
            </div>
          </el-menu>
        </div>

        <div class="aside_footer">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="iconfont iconfont icon-shezhi-xianxing"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div @click="handleLogout">
                <el-dropdown-item icon="iconfont icon-tuichudenglu"
                  >Log out</el-dropdown-item
                >
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-aside>

      <el-container class="el-container123" style="padding: 0 20px" width="70%">
        <router-view name="main" />
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Web3 from "web3";
import { ethers } from "ethers";
import axios from "axios";

export default {
  inject: ["reload"],
  data() {
    return {
      isCollapse: false,
      account: null,
      userName: "",

      submenuList: [
        {
          title: "Home",
          path: "/",
          icon: "icon-shouye",
        },
        {
          title: "Demand Market",
          path: "/DemandMarket/DemandList",
          icon: "icon-gongzuo",
          menuList: [
            { title: "ALL Demand List", path: "/DemandMarket/DemandList" },
            {
              title: "ALL Candidate List",
              path: "/DemandMarket/CandidateList",
            },
          ],
        },
        {
          title: "Personal Center",
          path: "/PersonalCenter",
          icon: "icon-geren",
          menuList: [
            {
              title: "Employer Demand",
              path: "/PersonalCenter/DemandNew",
              list: [
                { title: "Demand New", path: "/PersonalCenter/DemandNew" },
                { title: "Demand List", path: "/PersonalCenter/DemandList" },
              ],
            },
            {
              title: "Candidate Protocol",
              path: "/PersonalCenter/ProtocolList",
              list: [
                {
                  title: "Protocol List",
                  path: "/PersonalCenter/ProtocolList",
                },
              ],
            },
            {
              title: "Candidate Profile",
              path: "/PersonalCenter/CandidateProfile",
              list: [
                {
                  title: "Register",
                  path: "/PersonalCenter/CandidateProfile",
                },
              ],
            },
          ],
        },
      ],
    };
  },

  mounted() {
    this.userName = localStorage.getItem("userName");
    let expire = localStorage.getItem("expire");
    let now = Date.now();
    if (now <= expire) {
      this.userName =
        this.userName.slice(0, 5) + "..." + this.userName.slice(-4);
    } else {
      this.userName = "";
    }
  },

  methods: {
    goCon(conE) {
      if (this.$route.path === conE) {
        return;
      } else {
        this.$router.push(conE);
      }
    },

    async loginWithMetaMask() {
      if (typeof window.ethereum !== "undefined") {
        const web3 = new Web3(window.ethereum);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        try {
          // 请求用户账户地址
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          // 获取与当前帐户关联的签名者
          const signer = provider.getSigner();
          // 获取签名者的地址（这应该与上面获取的账户地址相同）
          const signerAddress = await signer.getAddress();
          console.log("Signer address:", signerAddress);

          console.log("Connected account:", account);
          let nonce, sign;
          axios
            .get(
              "https://demand.cybercrowdchain.org/ccc/user/nonce?address=" + signerAddress
            )
            .then((res) => {
              nonce = res.data.data.nonce;
            })
            .then(() => {
              console.log(nonce);
              const msgParams = {
                domain: {
                  chainId: window.ethereum.chainId,
                  name: "Login",
                  version: "1",
                },
                message: {
                  contents: "Login",
                  nonce: nonce,
                },
                primaryType: "Login",
                types: {
                  EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                  ],
                  Login: [
                    { name: "contents", type: "string" },
                    { name: "nonce", type: "uint256" },
                  ],
                },
              };
              window.ethereum
                .request({
                  method: "eth_signTypedData_v4",
                  params: [signerAddress, JSON.stringify(msgParams)],
                })
                .then((res) => {
                  sign = res;
                  console.log(res);
                })
                .then(() => {
                  axios
                    .post("https://demand.cybercrowdchain.org/ccc/user/sign-check", {
                      chainId: window.ethereum.chainId,
                      address: signerAddress,
                      signature: sign,
                    })
                    .then((res) => {
                      if (res.data.success) {
                        localStorage.setItem("token", res.data.data.token);
                        localStorage.setItem("expire", Date.now() + 3600000);
                        localStorage.setItem("userName", signerAddress);
                        this.$message.success("Login success");
                        window.location.reload();
                        return { success: true, account: signerAddress };
                      } else {
                        this.$message.error("Login failed");
                        return { success: false };
                      }
                    });
                });
            });
        } catch (error) {
          console.error("User rejected request:", error);
        }
      } else {
        alert("请安装MetaMask！");
      }
    },

    handleLogout() {
      this.$confirm("Are you sure you want to log out?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          this.$message({
            type: "success",
            message: "You have successfully logged out!",
          });
          this.refresh();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled operation",
          });
        });
    },

    // 刷新
    refresh() {
      this.reload();
    },
  },

  computed: {
    // 动态返回对应的路由path
    onRoutes() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Index.scss";
* {
  font-weight: 400;
}
</style>
