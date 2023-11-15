<template>
  <div class="all_candidate">
    <div class="all_candidate_content" v-if="candidateList.length > 0">
      <div
        v-for="(item, i) in candidateList"
        :key="i"
        class="all_candidate_content_a"
      >
        <div class="all_candidate_content_l">
          <el-image
            style="width: 80px; height: 80px; margin-right: 10px"
            :src="item.gender == 'male' ? manUrl : womanUrl"
          >
          </el-image>
          <div class="all_demand_content_l_tag-s1">
            {{ item.qualification }}
          </div>
          <div class="all_demand_content_l_tag-s2">Age: {{ item.age }}</div>
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
          <div>
            <i class="el-icon-info" style="color: #8b8b8b"></i>
            <span style="font-weight: 400">{{ item.status }}</span>
          </div>
        </div>
        <div class="all_candidate_content_r">
          <p style="font-size: 14px; font-weight: 400; margin: 10px 0">
            {{ item.user }}
          </p>

          <div style="margin-top: 10px">
            <a :href="'https://twitter.com/' + item.twitter" target="_blank"
              ><i class="iconfont icon-birdxiaoniao bird_icon"></i
            ></a>
            <a :href="'https://t.me/' + item.telegram" target="_blank"
              ><i class="iconfont icon-telegram-plane bird_icon"></i
            ></a>
          </div>

          <div style="justify-content: flex-end; height: 37px">
            <el-button type="info" @click="handleInvite(item)"
              >Invite</el-button
            >
            <el-button @click="handleSeeSkills(item)" type="success"
              >Skills</el-button
            >
          </div>

          <el-dialog :visible.sync="dialogVisibleSkills" width="30%">
            <div slot="title" class="dialog_skills_title">
              <i class="iconfont icon-guanli01"></i>
              <span>Skills</span>
            </div>
            <div>
              <i class="iconfont icon-geren"></i
              ><span>{{ candidateListDialog.user }}</span>
            </div>
            <div style="margin-top: 15px">
              <div class="all_demand_content_l_tag-s1">
                {{ candidateListDialog.qualification }}
              </div>
              <div class="all_demand_content_l_tag-s2">
                Age:{{ candidateListDialog.age }}
              </div>
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

            <div style="margin-top: 15px">
              <a
                :href="'https://twitter.com/' + candidateListDialog.twitter"
                target="_blank"
                ><i class="iconfont icon-birdxiaoniao bird_icon"></i
              ></a>
              <a
                :href="'https://t.me/' + candidateListDialog.telegram"
                target="_blank"
              >
                <i class="iconfont icon-telegram-plane bird_icon"></i>
              </a>
            </div>
            <div class="dialog_skills_tags">
              <div v-for="(skill, i) in candidateListDialog.skills" :key="i">
                {{ skill }}
              </div>
            </div>
            <div class="dialog_skills_desc">
              <span><i class="iconfont icon-describe"></i>Description：</span>
              <p>
                {{ candidateListDialog.description }}
              </p>
            </div>
          </el-dialog>

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
import { showLoading, hideLoading } from "@/util/loading";

import Pagination from "@/component/Pagination";

export default {
  components: {
    Pagination,
  },
  inject: ["reload"],

  data() {
    return {
      candidateList: [],
      candidateListDialog: [],
      skillList: [],
      manUrl: require("@/assets/man.png"),
      womanUrl: require("@/assets/woman.png"),

      dialogVisibleSkills: false,
      dialogVisibleInvite: false,

      contractData: "",

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
      url: reqUrl.allCandidateList,
      resFunc: (res) => {
        console.log(res.data);
        if (res.data.errno == 0) {
          this.candidateList = res.data.data.list;
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
    handleSeeSkills(item) {
      this.dialogVisibleSkills = true;
      this.candidateListDialog = item;
    },

    handleInvite(item) {
      this.dialogVisibleInvite = true;
      this.candidateAds = item.user;
    },

    handleInviteSubmit() {
      showLoading();
      const opt = {
        url: reqUrl.inviteCandidate,
        method: "POST",
        params: {
          contract: this.contractData,
          candidate: this.candidateAds,
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
    },

    handlePageChange(data) {
      showLoading();
      const opt = {
        url: reqUrl.allCandidateList,
        params: {
          page: data.pageIndex,
          pageSize: data.pageSize,
        },
        resFunc: (res) => {
          console.log(res.data);
          if (res.data.errno == 0) {
            this.candidateList = res.data.data.list;
            this.pageLength = res.data.data.total;
            this.pageSize = data.pageSize;
            this.currentPage = data.pageIndex;
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

    // 刷新
    refresh() {
      this.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.all_candidate {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  margin-top: -10px;
}
</style>

<style>
@import "../../Index.scss";
</style>
