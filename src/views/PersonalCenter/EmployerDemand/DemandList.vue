<template>
  <div class="demand_list">
    <div class="search">
      <el-input v-model="search.title" placeholder="Search By Title"></el-input>
      <el-select v-model="search.status" placeholder="Search By Status">
        <el-option
          v-for="item in search.optionsStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-cascader
        v-model="search.category"
        :options="search.optionsCategory"
        placeholder="Search By Category"
      ></el-cascader>
      <el-button type="info" @click="handleSearch">Search</el-button>
      <el-button type="success" @click="handleReset">Reset</el-button>
    </div>
    <div v-if="demandList.length > 0">
      <div class="all_demand_content" v-for="(item, i) in demandList" :key="i">
        <div class="all_demand_content_l">
          <p style="font-size: 26px">{{ item.title }}</p>
          <div class="all_demand_content_l_tag">
            <div
              v-if="item.status == 'open'"
              class="all_demand_content_l_tag-s1"
            >
              Open
            </div>
            <div
              v-else-if="item.status == 'completed'"
              class="all_demand_content_l_tag-s2"
            >
              Completed
            </div>
            <div
              v-else-if="item.status == 'ongoing'"
              class="all_demand_content_l_tag-s4"
            >
              Ongoing
            </div>
            <div class="all_demand_content_l_tag-s3">{{ item.category }}</div>
          </div>

          <p class="all_demand_content_l_desc">
            <i class="iconfont icon-describe"></i> Description：{{
              item.description
            }}
          </p>
          <div>
            <a :href="'https://twitter.com/' + item.twitter" target="_blank"
              ><i class="iconfont icon-birdxiaoniao bird_icon"></i
            ></a>
            <a :href="'https://t.me/' + item.telegram" target="_blank"
              ><i class="iconfont icon-telegram-plane bird_icon"></i
            ></a>
          </div>
        </div>
        <div class="all_demand_content_r">
          <div>
            <p style="font-size: 20px">${{ item.budget || 0 }}</p>
            <p style="font-size: 14px; font-weight: 400">
              Token Deposit：{{ item.tokenAmount || 0 }}
            </p>
            <div style="display: flex; flex-direction: row">
              <el-button
                type="info"
                @click="handleEnd(item)"
                :disabled="item.status == 'completed'"
                style="margin-right: 10px"
                >End</el-button
              >
              <el-button type="info" @click="handleProtocols(item)"
                >Protocols</el-button
              >
            </div>
          </div>
          <div>
            <p style="font-size: 14px">Contract：{{ item.contract }}</p>
            <p style="font-size: 14px">Creator：{{ item.creator }}</p>
          </div>
        </div>

        <el-dialog :visible.sync="dialogVisibleEnd" width="30%">
          <div slot="title" class="dialog_skills_title">
            <i class="iconfont icon-tuichudenglu"></i>
            <span>End Demand</span>
          </div>
          <p>
            Are you sure you want to end the operation and return the deposit
          </p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleEnd = false" type="success"
              >Cancel</el-button
            >
            <el-button
              type="info"
              @click="handleEndSubmit"
              style="margin-left: 10px"
              >OK</el-button
            >
          </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisibleProtocols" width="30%">
          <div slot="title" class="dialog_skills_title">
            <span>Protocols</span>
          </div>
          <div>
            <div v-if="ProtocolsListDialog.length == 0" class="nodata">
              <img src="@/assets/暂无数据.png" alt="" />
              <p>No Datas</p>
            </div>
            <div v-else>
              <div v-for="item in ProtocolsListDialog" :key="item.id">
                <div class="demand_protocols_list">
                  <div>Demand ID：{{ item.id }}</div>
                  <div>contract：{{ item.contract }}</div>
                  <div>candidate：{{ item.candidate }}</div>
                  <div class="demand_protocols_list_status">
                    <i class="el-icon-info" style="color: #8b8b8b"></i>
                    <span style="font-weight: 400; margin-left: 0">{{
                      item.status
                    }}</span>
                  </div>
                  <div>activeDate：{{ item.activeDate }}</div>

                  <div class="demand_protocols_btn">
                    <div v-if="item.status == 'invite pending'">
                      <el-button
                        type="info"
                        @click="handleClick(item, 'Cancel')"
                        >Cancel</el-button
                      >
                      <el-button
                        type="success"
                        @click="handleClick(item, 'Protocol')"
                        >Protocol Message</el-button
                      >
                    </div>
                    <div v-else-if="item.status == 'proposal pending'">
                      <el-button
                        type="info"
                        @click="handleClick(item, 'Accept')"
                        >Accept</el-button
                      >
                      <el-button
                        type="info"
                        @click="handleClick(item, 'Refuse')"
                        >Refuse</el-button
                      >
                      <el-button
                        type="success"
                        @click="handleClick(item, 'Protocol')"
                        >Protocol Message</el-button
                      >
                    </div>
                    <div v-else>
                      <el-button
                        type="success"
                        @click="handleClick(item, 'Protocol')"
                        >Protocol Message</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <Pagination
                v-show="pageLengthPro >= 0"
                :limit.sync="pageSizePro"
                :total="pageLengthPro"
                @pagination="handlePageChangeProtocols"
                :page-sizes="pageSizesPro"
              />
            </div>
          </div>
        </el-dialog>
      </div>

      <Pagination
        v-show="pageLength >= 0"
        :limit.sync="pageSize"
        :total="pageLength"
        @pagination="handlePageChange"
        :page-sizes="pageSizes"
      />
    </div>
    <div class="nodata" v-else>
      <img src="@/assets/暂无数据.png" alt="" />
      <p>No Datas</p>
    </div>
  </div>
</template>

<script>
import { reqUrl } from "@/api/apiUrl";
import { requestGet, request } from "@/api/request";
import {
  demandDetail,
  endDemandContract,
  addCandidateContract,
} from "@/service/demand_service";

import { CategoryData } from "@/data/category.js";
import { format_time_date } from "@/util/universalMethod.js";
import Pagination from "@/component/Pagination";

import { showLoading, hideLoading } from "@/util/loading";
export default {
  components: {
    Pagination,
  },
  inject: ["reload"],

  data() {
    return {
      demandList: [],

      search: {
        optionsStatus: [
          {
            value: "Open",
            label: "Open",
          },
          {
            value: "Completed",
            label: "Completed",
          },
          {
            value: "Ongoing",
            label: "Ongoing",
          },
        ],

        title: "",
        status: "",
        category: "",

        optionsCategory: [],
      },

      dialogVisibleEnd: false,
      dialogVisibleProtocols: false,
      ProtocolsListDialog: [],
      endContract: "",

      // 分页数据
      currentPage: 1,
      pageLength: 0,
      pageSize: 10, //要传过去的数据 每页多少条数据
      pageSizes: [10, 20, 50, 100, 200],
      currentPagePro: 1,
      pageLengthPro: 0,
      pageSizePro: 10, //要传过去的数据 每页多少条数据
      pageSizesPro: [10, 20, 50, 100, 200],
    };
  },

  mounted() {
    this.search.optionsCategory = CategoryData;

    showLoading();
    const opt = {
      url: reqUrl.employerDemandList,

      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.demandList = res.data.data.list;
          this.pageLength = res.data.data.total;
        }
        if (res.data.errno != 0) {
          this.$notify.error({
            title: "错误",
            message: res.data.message,
          });
          hideLoading();
        }
        hideLoading();
      },
      errFunc: (err) => {
        this.$notify.error({
          title: "错误",
          message: err,
        });
        console.log(err, "err1");
        hideLoading();
      },
    };
    requestGet(opt);
  },

  methods: {
    handleSearch() {
      showLoading();
      const opt = {
        url: reqUrl.employerDemandList,
        params: {
          title: this.search.title,
          status: this.search.status,
          contract: this.search.category[this.search.category.length - 1],
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.demandList = res.data.data.list;
            this.pageLength = res.data.data.total;
          }
          if (res.data.errno != 0) {
            this.$notify.error({
              title: "错误",
              message: res.data.message,
            });
            hideLoading();
          }
          hideLoading();
        },
        errFunc: (err) => {
          this.$notify.error({
            title: "错误",
            message: err,
          });
          console.log(err, "err1");
          hideLoading();
        },
      };
      requestGet(opt);
    },

    handleReset() {
      this.refresh();
    },

    handleEnd(item) {
      this.dialogVisibleEnd = true;
      this.endContract = item.contract;
    },

    handleEndSubmit() {
      showLoading();
      const opt = {
        url: reqUrl.endDemandCheck,
        params: {
          contract: this.endContract,
        },
        resFunc: async (res) => {
          if (res.data.errno == 0) {
            try {
              const demand = await demandDetail(this.endContract);

              await endDemandContract(this.endContract, demand.tokenAmount);
              window.location.reload();
            } catch (error) {}
          }
          if (res.data.errno != 0) {
            this.$notify.error({
              title: "error",
              message: res.data.message,
            });
            hideLoading();
          }
          hideLoading();
        },
        errFunc: (err) => {
          this.$notify.error({
            title: "error",
            message: err,
          });
          console.log(err, "err1");
          hideLoading();
        },
      };
      requestGet(opt);
    },

    handleProtocols(item) {
      this.dialogVisibleProtocols = true;
      showLoading();
      const opt = {
        url: reqUrl.listByDemandProtocol,
        params: {
          contract: item.contract,
        },
        resFunc: (res) => {
          if (res.data.errno == 0) {
            this.ProtocolsListDialog = res.data.data.list;
            this.pageLengthPro = res.data.data.total;
            res.data.data.list.map((item) => {
              if (item.activeDate != null) {
                item.activeDate = format_time_date(item.activeDate);
              }
            });
          }
          if (res.data.errno != 0) {
            this.$notify.error({
              title: "error",
              message: res.data.message,
            });
            hideLoading();
          }
          hideLoading();
        },
        errFunc: (err) => {
          this.$notify.error({
            title: "error",
            message: err,
          });
          console.log(err, "err1");
          hideLoading();
        },
      };
      requestGet(opt);
    },

    handlePageChange(data) {
      showLoading();
      const opt = {
        url: reqUrl.employerDemandList,
        params: {
          title: this.title,
          status: this.status,
          contract: this.type,
          page: data.pageIndex,
          pageSize: data.pageSize,
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.demandList = res.data.data.list;
            this.pageLength = res.data.data.total;
            this.pageSize = data.pageSize;
            this.currentPage = data.pageIndex;
          }
          if (res.data.errno != 0) {
            this.$notify.error({
              title: "错误",
              message: res.data.message,
            });
            hideLoading();
          }
          hideLoading();
        },
        errFunc: (err) => {
          this.$notify.error({
            title: "错误",
            message: err,
          });
          console.log(err, "err1");
          hideLoading();
        },
      };
      requestGet(opt);
    },

    handlePageChangeProtocols(data) {
      showLoading();
      const opt = {
        url: reqUrl.listByDemandProtocol,
        params: {
          contract: item.contract,
          page: data.pageIndex,
          pageSize: data.pageSize,
        },
        resFunc: (res) => {
          if (res.data.errno == 0) {
            this.ProtocolsListDialog = res.data.data.list;
            this.pageLengthPro = res.data.data.total;
            this.pageSizePro = data.pageSize;
            this.currentPagePro = data.pageIndex;
            res.data.data.list.map((item) => {
              if (item.activeDate != null) {
                item.activeDate = format_time_date(item.activeDate);
              }
            });
          }
          if (res.data.errno != 0) {
            this.$notify.error({
              title: "error",
              message: res.data.message,
            });
            hideLoading();
          }
          hideLoading();
        },
        errFunc: (err) => {
          this.$notify.error({
            title: "error",
            message: err,
          });
          console.log(err, "err1");
          hideLoading();
        },
      };
      requestGet(opt);
    },

    handleClick(item, type) {
      if (type == "Cancel") {
        this.$confirm(
          "Are you sure you want to cancel the invitation?",
          "Tips",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            showLoading();
            const opt = {
              url: reqUrl.cancelInvitationProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "cancel invitation success",
                  });
                  this.refresh();
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "cancel invitation failed--------" + res.data.message,
                  });
                  hideLoading();
                }
                hideLoading();
              },
              errFunc: (err) => {
                this.$notify.error({
                  title: "error",
                  message: err,
                });
                hideLoading();
              },
            };
            request(opt);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Cancelled operation",
            });
          });
      } else if (type == "Accept") {
        this.$confirm(
          "Are you sure you want to accept the invitation?",
          "Tips",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            showLoading();
            const opt = {
              url: reqUrl.acceptProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: async (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "accept proposal success",
                  });
                  if (res.data.data.url) {
                    await addCandidateContract(item.id, res.data.data.url);
                    this.refresh();
                  }
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "accept proposal failed--------" + res.data.message,
                  });
                  hideLoading();
                }
                hideLoading();
              },
              errFunc: (err) => {
                this.$notify.error({
                  title: "error",
                  message: err,
                });
                hideLoading();
              },
            };
            request(opt);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Cancelled operation",
            });
          });
      } else if (type == "Refuse") {
        this.$confirm(
          "Are you sure you want to refuse the invitation?",
          "Tips",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            showLoading();
            const opt = {
              url: reqUrl.refuseProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "refuse proposal success",
                  });
                  this.refresh();
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "refuse proposal failed--------" + res.data.message,
                  });
                  hideLoading();
                }
                hideLoading();
              },
              errFunc: (err) => {
                this.$notify.error({
                  title: "error",
                  message: err,
                });
                hideLoading();
              },
            };
            request(opt);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Cancelled operation",
            });
          });
      } else if (type == "Protocol") {
        this.$router.push({
          path: "/PersonalCenter/DemandList/ProtocolMessage",
          query: {
            id: item.id,
            type: "Demand",
          },
        });
      }
    },

    // 刷新
    refresh() {
      this.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../DemandMarket/index.scss";
@import "../../../Index.scss";

.demand_list {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;

  .demand_protocols_list {
    div {
      margin-bottom: 10px;
    }
  }
}
/deep/ .el-dialog {
  .el-dialog__body {
    padding: 5px 20px 20px !important;
  }
}
</style>
