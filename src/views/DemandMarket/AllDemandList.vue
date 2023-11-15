<template>
  <div class="all_demand">
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
          <div style="display: flex">
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
            <el-button
              type="info"
              @click="handleSend(item)"
              :disabled="item.status !== 'open'"
              >Send Proposal</el-button
            >
          </div>
          <div>
            <p style="font-size: 14px">Contract：{{ item.contract }}</p>
            <p style="font-size: 14px">Creator：{{ item.creator }}</p>
          </div>
        </div>

        <el-dialog :visible.sync="dialogVisibleInvite" width="30%">
          <div slot="title" class="dialog_skills_title">
            <i class="iconfont icon-a-faqi2"></i>
            <span>Send Proposal</span>
          </div>
          <p>Do you want to request a task protocol?</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleInvite = false" type="success"
              >Cancel</el-button
            >
            <el-button
              type="info"
              @click="handleSubmit(item)"
              style="margin-left: 10px"
              >OK</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="nodata" v-else>
      <img src="@/assets/暂无数据.png" alt="" />
      <p>No Datas</p>
    </div>

    <Pagination
      v-show="pageLength >= 0"
      :limit.sync="pageSize"
      :total="pageLength"
      @pagination="handlePageChange"
      :page-sizes="pageSizes"
    />
  </div>
</template>

<script>
import { reqUrl } from "@/api/apiUrl";
import { requestGet, request } from "@/api/request";

import { CategoryData } from "@/data/category.js";
import Pagination from "@/component/Pagination";

import { showLoading, hideLoading } from "@/util/loading";

export default {
  components: {
    Pagination,
  },
  inject: ["reload"],

  data() {
    return {
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

      demandList: [],
      dialogVisibleInvite: false,

      // 分页数据
      currentPage: 1, // 当前页
      pageLength: 0,
      pageSize: 10, //要传过去的数据 每页多少条数据
      pageSizes: [10, 20, 50, 100, 200],
    };
  },

  mounted() {
    this.search.optionsCategory = CategoryData;

    showLoading();
    const opt = {
      url: reqUrl.allDemandList,
      params: {
        title: "",
        status: "",
        contract: "",
      },
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.demandList = res.data.data.list;
          this.pageLength = res.data.data.total;
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
    handleSearch() {
      showLoading();
      const opt = {
        url: reqUrl.allDemandList,
        params: {
          title: this.search.title,
          status: this.search.status,
          category: this.search.category[this.search.category.length - 1],
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.demandList = res.data.data.list;
            this.pageLength = res.data.data.total;
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

    handleReset() {
      this.refresh();
    },

    handleSend(item) {
      this.contract = item.contract;
      this.dialogVisibleInvite = true;
    },

    handleSubmit() {
      showLoading();
      const opt = {
        url: reqUrl.sendProposal,
        method: "POST",
        params: JSON.stringify({
          contract: this.contract,
        }),
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.$message.success("Send Successfully");
            this.dialogVisibleInvite = false;
            this.refresh();
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
      request(opt);
    },

    handlePageChange(data) {
      showLoading();
      const opt = {
        url: reqUrl.allDemandList,
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

    // 刷新
    refresh() {
      this.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../Index.scss";
@import "./index.scss";
.all_demand {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
}
</style>

<style>
@import "../../Index.scss";
</style>
