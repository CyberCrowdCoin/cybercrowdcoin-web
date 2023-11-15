<template>
  <div class="protocol_list">
    <div class="all_candidate_content" v-if="candidateList.length > 0">
      <div
        v-for="(item, i) in candidateList"
        :key="i"
        class="all_candidate_content_a"
      >
        <div>
          <p>Demand Contract：{{ item.contract }}</p>
          <p>Employer：{{ item.employer }}</p>
          <p>Candidate：{{ item.candidate }}</p>
          <p>ActiveDate：{{ item.activeDate }}</p>
          <div>
            <i class="el-icon-info" style="color: #8b8b8b"></i>
            <span style="font-weight: 400">{{ item.status }}</span>
          </div>
        </div>
        <div class="all_candidate_content_r_p">
          <div v-if="item.status == 'invite pending'">
            <el-button type="info" @click="handleClick(item, 'Accept')"
              >Accept</el-button
            >
            <el-button type="info" @click="handleClick(item, 'Refuse')"
              >Refuse</el-button
            >
            <el-button type="success" @click="handleClick(item, 'Protocol')"
              >Protocol Message</el-button
            >
          </div>
          <div v-else-if="item.status == 'active'">
            <el-button type="info" @click="handleClick(item, 'Finish')"
              >Finish</el-button
            >
            <el-button type="success" @click="handleClick(item, 'Protocol')"
              >Protocol Message</el-button
            >
          </div>
          <div v-else>
            <el-button type="success" @click="handleClick(item, 'Protocol')"
              >Protocol Message</el-button
            >
          </div>
        </div>
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
import { showLoading, hideLoading } from "@/util/loading";

import { format_time_date } from "@/util/universalMethod.js";

import Pagination from "@/component/Pagination";

export default {
  components: {
    Pagination,
  },
  inject: ["reload"],

  data() {
    return {
      candidateList: [],

      // 分页数据
      currentPage: 1, // 当前页
      pageLength: 0,
      pageSize: 10, //要传过去的数据 每页多少条数据
      pageSizes: [10, 20, 50, 100, 200],
    };
  },

  mounted() {
    showLoading();
    const opt = {
      url: reqUrl.candidateProtocolList,
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          if (res.data.data.list.length > 0) {
            this.candidateList = res.data.data.list;
            this.pageLength = res.data.data.total;

            res.data.data.list.map((item) => {
              if (item.activeDate != null) {
                item.activeDate = format_time_date(item.activeDate);
              }
            });
          }
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

  methods: {
    handlePageChange(data) {
      showLoading();
      const opt = {
        url: reqUrl.candidateProtocolList,
        params: {
          page: data.pageIndex,
          pageSize: data.pageSize,
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            if (res.data.data.list.length > 0) {
              this.candidateList = res.data.data.list;
              this.pageLength = res.data.data.total;
              this.pageSize = data.pageSize;
              this.currentPage = data.pageIndex;

              res.data.data.list.map((item) => {
                if (item.activeDate != null) {
                  item.activeDate = format_time_date(item.activeDate);
                }
              });
            }
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
      if (type == "Accept") {
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
              url: reqUrl.acceptInvitationProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: async (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "accept invitation success",
                  });
                  this.refresh();
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "accept invitation failed--------" + res.data.message,
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
              url: reqUrl.refuseInvitationProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "refuse invitation success",
                  });
                  this.refresh();
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "refuse invitation failed--------" + res.data.message,
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
      } else if (type == "Finish") {
        this.$confirm(
          "Are you sure you want to finish protocol the invitation?",
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
              url: reqUrl.finishProtocol,
              method: "POST",
              params: {
                protocolId: item.id,
              },
              resFunc: (res) => {
                if (res.data.errno == 0) {
                  this.$message({
                    type: "success",
                    message: "finish protocol success",
                  });
                  this.refresh();
                }
                if (res.data.errno != 0) {
                  this.$notify.error({
                    title: "error",
                    message:
                      "finish protocol failed--------" + res.data.message,
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
            type: "Candidate",
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

.protocol_list {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;

  .all_candidate_content_a {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  p {
    margin-bottom: 10px;
    font-weight: 400 !important;
  }

  i {
    margin-right: 8px;
  }

  .all_candidate_content_r_p {
    display: flex;
  }
}
</style>
