<template>
  <div class="home_page">
    <div class="home_echarts">
      <div class="echarts_real">
        <div style="width: 95%; height: 300px">
          <div id="main"></div>
        </div>
      </div>
      <div class="echarts_real">
        <div style="width: 95%; height: 300px">
          <div id="main2"></div>
        </div>
      </div>
    </div>

    <div class="h_p_latest">
      <div class="h_p__title">
        <p>Latest Demand</p>
        <p class="h_p__title_line" @click="handleGoPage('Demand')">
          View all jobs
        </p>
      </div>
      <div class="h_p_latest_cont" v-if="latestDemandList.length > 0">
        <div
          class="h_p_latest_child"
          v-for="(item, index) in latestDemandList"
          :key="index"
        >
          <div class="h_p_latest_child_t">
            <el-popover
              placement="top-start"
              trigger="hover"
              :content="item.title"
            >
              <p class="h_p_latest_child-title" slot="reference">
                {{ item.title }}
              </p>
            </el-popover>
            <div class="all_demand_content_l_tag-s4">
              <span>{{ item.status }}</span>
            </div>
          </div>
          <p>{{ item.budget || 0 }}$</p>
          <div style="display: flex; margin: 10px 0">
            <div class="all_demand_content_l_tag-s3">
              {{ item.category }}
            </div>
          </div>
          <p class="h_p_latest_child-description">
            <i class="iconfont icon-describe"></i>
            <el-popover
              placement="top-start"
              trigger="hover"
              :content="item.description"
            >
              <span slot="reference">{{ item.description }}</span>
            </el-popover>
          </p>
        </div>
      </div>
      <div class="nodata" v-else>
        <img src="@/assets/暂无数据.png" alt="" />
        <p>No Datas</p>
      </div>
    </div>

    <div class="h_p__title">
      <p>Latest Candidate</p>
      <p class="h_p__title_line" @click="handleGoPage('Candidate')">
        View all Candidate
      </p>
    </div>
    <div class="h_p_candidate" v-if="candidateList.length > 0">
      <div
        class="h_p_candidate_cont"
        v-for="(item, i) in candidateList"
        :key="i"
      >
        <div class="h_p_candidate_cont-box">
          <el-image
            style="width: 80px; height: 80px; margin-right: 10px"
            :src="item.gender == 'male' ? manUrl : womanUrl"
          >
          </el-image>
          <div class="h_p_candidate_cont-box-a">
            <div class="h_p_candidate_cont-box-b">
              <p class="h_p_candidate_cont-box-c">{{ item.user }}</p>
              <i
                :class="
                  item.gender == 'male'
                    ? 'iconfont icon-xingbie-nan'
                    : 'iconfont icon-xingbie-nv'
                "
                :style="{
                  color: item.gender == 'male' ? '#44a6ff' : '#ff33b4',
                }"
              ></i>
            </div>
            <div class="h_p_candidate_cont-box-b box_margin">
              <a :href="'https://twitter.com/' + item.twitter" target="_blank">
                <i class="iconfont icon-birdxiaoniao bird_icon"></i
              ></a>
              <a :href="'https://t.me/' + item.telegram" target="_blank">
                <i class="iconfont icon-telegram-plane bird_icon"></i
              ></a>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div class="all_demand_content_l_tag-s1">
                {{ item.qualification }}
              </div>
            </div>
            <div class="dialog_skills_tags">
              <div
                v-for="(skill, i) in item.skills"
                :key="i"
                style="font-weight: 400; font-size: 15px"
              >
                {{ skill }}
              </div>
            </div>
          </div>
        </div>
        <el-button type="info" @click="dialogVisibleInvite = true"
          >Invite Candidate</el-button
        >

        <el-dialog :visible.sync="dialogVisibleInvite" width="30%">
          <div slot="title" class="dialog_skills_title">
            <i class="iconfont icon-a-faqi2"></i>
            <span>Invite Candidate</span>
          </div>
          <el-input
            placeholder="Please Enter contract"
            v-model="contractData"
          ></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleInvite = false" type="success"
              >Cancel</el-button
            >
            <el-button
              type="info"
              @click="handleInviteSubmit"
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
  </div>
</template>

<script>
import * as echarts from "echarts";

import { reqUrl } from "@/api/apiUrl";
import { requestGet, request } from "@/api/request";
import { showLoading, hideLoading } from "@/util/loading";

export default {
  inject: ["reload"],
  data() {
    return {
      latestDemandList: [],

      candidateList: [],
      manUrl: require("@/assets/man.png"),
      womanUrl: require("@/assets/woman.png"),
      dialogVisibleInvite: false,
      contractData: "",
    };
  },
  mounted() {
    showLoading();
    const opt = {
      url: reqUrl.homepageListData,

      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          var chartDom = document.getElementById("main");
          const option = {
            title: {
              text: "Demand",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                name: "Demand Data",
                type: "pie",
                radius: "50%",
                data: res.data.data.demand,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };

          var myChart = echarts.init(chartDom);
          myChart.setOption(option);

          var chartDom2 = document.getElementById("main2");
          const option2 = {
            title: {
              text: "Statistics Candidate",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                name: "Statistics Candidate",
                type: "pie",
                radius: "50%",
                data: res.data.data.candidate,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };

          var myChart = echarts.init(chartDom2);
          myChart.setOption(option2);
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

    showLoading();
    const optDemand = {
      url: reqUrl.allDemandList,
      params: {
        pageSize: 3,
      },
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.latestDemandList = res.data.data.list;
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
    requestGet(optDemand);

    showLoading();
    const optCandidate = {
      url: reqUrl.allCandidateList,
      params: {
        pageSize: 3,
      },
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.candidateList = res.data.data.list;
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
    requestGet(optCandidate);
  },

  methods: {
    handleGoPage(type) {
      if (type == "Demand") {
        this.$router.push("/DemandMarket/DemandList");
      } else if (type == "Candidate") {
        this.$router.push("/DemandMarket/CandidateList");
      }
    },

    handleInviteSubmit() {
      if (this.contractData !== "") {
        showLoading();
        const opt = {
          url: reqUrl.inviteCandidate,
          method: "POST",
          params: {
            contract: this.contractData,
          },
          resFunc: (res) => {
            console.log(res.data);
            if (res.data.errno == 0) {
              this.$message.success("Invitation sent successfully");
              this.refresh();
              this.dialogVisibleInvite = false;
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
      } else {
        this.$message.error("Please fill in contract");
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
@import "../DemandMarket/index.scss";
@import "./index.scss";

.all_demand_content_l_tag-s4 {
  margin-right: 0;

  span {
    font-weight: 400;
  }
}
</style>

<style>
@import "../../Index.scss";

.el-popover--plain {
  padding: 5px !important;
}
</style>
