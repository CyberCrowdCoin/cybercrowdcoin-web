<template>
  <div class="protocol_msg">
    <div @click="handleBack">
      <i class="el-icon-arrow-left"></i
      ><span v-if="this.$route.query.type == 'Demand'"
        >Back Employer Demand List</span
      ><span v-else-if="this.$route.query.type == 'Candidate'"
        >Back Candidate Protocol List</span
      >
    </div>

    <el-table :data="protocolMsgList" style="width: 100%">
      <el-table-column prop="protocolId" label="protocolId"> </el-table-column>
      <el-table-column prop="type" label="type"> </el-table-column>
      <el-table-column prop="creator" label="creator" width="500">
      </el-table-column>
      <el-table-column prop="content" label="content"> </el-table-column>
    </el-table>

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
import { requestGet } from "@/api/request";
import { showLoading, hideLoading } from "@/util/loading";

import Pagination from "@/component/Pagination";

export default {
  components: {
    Pagination,
  },

  data() {
    return {
      protocolMsgList: [],

      // 分页数据
      currentPage: 1,
      pageLength: 0,
      pageSize: 10, //要传过去的数据 每页多少条数据
      pageSizes: [10, 20, 50, 100, 200],
    };
  },

  mounted() {
    showLoading();
    const opt = {
      url: reqUrl.listByProtocolMessage,
      params: {
        protocolId: this.$route.query.id,
      },
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.protocolMsgList = res.data.data.list;
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
    handleBack() {
      if (this.$route.query.type == "Candidate") {
        this.$router.push("/PersonalCenter/ProtocolList");
      } else if (this.$route.query.type == "Demand") {
        this.$router.push("/PersonalCenter/DemandList");
      }
    },

    handlePageChange(data) {
      showLoading();
      const opt = {
        url: reqUrl.listByProtocolMessage,
        params: {
          protocolId: this.$route.query.id,
          page: data.pageIndex,
          pageSize: data.pageSize,
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.protocolMsgList = res.data.data.list;
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
  },
};
</script>

<style lang="scss" scoped>
i {
  margin-right: 10px;
  cursor: pointer;
}

.protocol_msg {
  width: 100%;

  /deep/ .el-table {
    box-shadow: 0 0 18px -7px #c77dff;
    margin-top: 15px;
    border-radius: 15px;
  }
}
</style>
