<template>
  <div class="demand_new_list">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item prop="title">
        <span slot="label">
          <i class="iconfont icon-a-titleoptimization"></i>
          Title</span
        >
        <el-input
          v-model="ruleForm.title"
          placeholder="Please enter Title"
        ></el-input>
      </el-form-item>
      <el-form-item prop="category">
        <span slot="label"> <i class="iconfont icon-leibie"></i> Category</span>
        <el-cascader
          v-model="ruleForm.category"
          :options="ruleForm.optionsCategory"
          placeholder="Select a category"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="twitter">
        <span slot="label">
          <i class="iconfont icon-birdxiaoniao bird_icon"></i>
          Twitter</span
        >
        <div class="demand_new_input_twitter">
          https://twitter.com/
          <el-input
            v-model="ruleForm.twitter"
            placeholder="Please enter Twitter"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="telegram">
        <span slot="label">
          <i class="iconfont icon-telegram-plane bird_icon"></i>
          Telegram</span
        >
        <div class="demand_new_input_twitter">
          https://t.me/
          <el-input
            v-model="ruleForm.telegram"
            placeholder="Please enter Telegram"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <i class="iconfont icon-cunkuan"></i> Token Deposit</span
        >
        <el-input-number
          v-model="ruleForm.tokenAmount"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item prop="budget">
        <span slot="label">
          <i class="iconfont icon-jiagebaohu"></i>
          Demand Budget</span
        >
        <el-input-number v-model="ruleForm.budget" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item prop="description">
        <span slot="label">
          <i class="iconfont icon-describe"></i> Description</span
        >
        <el-input
          type="textarea"
          v-model="ruleForm.description"
          placeholder="Please enter Description"
        ></el-input>
      </el-form-item>
      <div class="ruleForm_footer">
        <el-form-item>
          <el-button type="info" @click="submitForm('ruleForm')"
            >Submit</el-button
          >
          <el-button @click="resetForm('ruleForm')" type="success"
            >Empty</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { CategoryData } from "@/data/category.js";
import { approve, createDemandContract } from "@/service/demand_service";

import { reqUrl } from "@/api/apiUrl";
import { request } from "@/api/request";
import { showLoading, hideLoading } from "@/util/loading";

export default {
  data() {
    return {
      ruleForm: {
        title: "",
        category: "",
        optionsCategory: [],
        twitter: "",
        telegram: "",
        tokenAmount: 10,
        budget: 0,
        description: "",
      },
      rules: {
        title: [
          { required: true, message: "Please enter Title", trigger: "blur" },
        ],
        category: [
          { required: true, message: "Select a category", trigger: "blur" },
        ],
        twitter: [
          { required: true, message: "Please enter twitter", trigger: "blur" },
        ],
        telegram: [
          { required: true, message: "Please enter telegram", trigger: "blur" },
        ],
        budget: [
          {
            required: true,
            message: "Please enter the demand budget",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "Please enter Description",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.ruleForm.optionsCategory = CategoryData;
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(
            "Please confirm that the information is correct, and then continue",
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
                url: reqUrl.addipfsDemand,
                method: "POST",
                params: {
                  title: this.ruleForm.title,
                  category:
                    this.ruleForm.category[this.ruleForm.category.length - 1],
                  description: this.ruleForm.description,
                  twitter: this.ruleForm.twitter,
                  telegram: this.ruleForm.telegram,
                  budget: this.ruleForm.budget,
                  tokenAmount: this.ruleForm.tokenAmount,
                },
                resFunc: async (res) => {
                  if (res.data.errno == 0) {
                    try {
                      const ipfs = res.data.data.url || "";
                      if (ipfs) {
                        await approve(this.ruleForm.tokenAmount);
                        let dataRuleFormObj = {
                          title: this.ruleForm.title,
                          category:
                            this.ruleForm.category[
                              this.ruleForm.category.length - 1
                            ],
                          description: this.ruleForm.description,
                          twitter: this.ruleForm.twitter,
                          telegram: this.ruleForm.telegram,
                          budget: this.ruleForm.budget,
                          tokenAmount: this.ruleForm.tokenAmount,
                        };

                        const dataObj = { ...dataRuleFormObj, ipfsUrl: ipfs };
                        var transHash = await createDemandContract(dataObj);
                        this.$message.success(
                          "Created successfully and goes to Demand List Page!"
                        );
                        this.$router.push("/PersonalCenter/DemandList");
                        console.log(transHash);
                      }
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
              request(opt);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "Cancelled operation",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";

.demand_new_list {
  width: 70%;
  margin: 0 auto;
  height: calc(100vh - 120px);
  overflow-y: scroll;

  i {
    font-size: 19px;
  }

  .demand_new_input_twitter {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 15px;
    background: #fff;
    padding-left: 15px;

    /deep/ .el-input__inner {
      width: 97%;
      border: none;
      border-radius: 0px;
      border-left: 1px #dcdfe6 solid;
      margin-left: 10px;
    }
  }
}
</style>

<style>
@import "../../../Index.scss";
</style>
