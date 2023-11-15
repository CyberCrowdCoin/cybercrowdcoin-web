<template>
  <div class="demand_new_list">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-form-item prop="qualification">
        <div slot="label" class="form_item_label">
          <img src="@/assets/xueli.png" alt="" />
          Qualification
        </div>
        <el-cascader
          v-model="ruleForm.qualification"
          :options="ruleForm.optionQualification"
          placeholder="Please select your Degree"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="gender">
        <div slot="label" class="form_item_label">
          <img src="@/assets/xingbie.png" alt="" />
          Gender
        </div>
        <el-select
          v-model="ruleForm.gender"
          placeholder="Please select your Gender"
        >
          <el-option
            v-for="item in ruleForm.optionsGender"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="age">
        <div slot="label" class="form_item_label">
          <img src="@/assets/age.png" alt="" />
          Age
        </div>
        <el-input
          v-model="ruleForm.age"
          placeholder="Please enter Age"
        ></el-input>
      </el-form-item>
      <el-form-item prop="twitter">
        <span slot="label">
          <i class="iconfont icon-birdxiaoniao" style="color: #44a6ff"></i>
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
          <i class="iconfont icon-telegram-plane" style="color: #44a6ff"></i>
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
      <el-form-item prop="description">
        <span slot="label">
          <i class="iconfont icon-describe" style="font-size: 19px"></i>
          Description</span
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

      <div class="el-form_tip_skills">
        <p style="color: #f56c6c">Tip: You can add extra skills</p>

        <el-form-item prop="skills">
          <span slot="label">
            <i class="iconfont icon-guanli01" style="font-size: 19px"></i>
            Skills</span
          >
          <el-collapse accordion>
            <el-collapse-item title="Increase skills">
              <el-checkbox-group v-model="ruleForm.skills">
                <el-checkbox
                  v-for="(item, i) in ruleForm.skillsList"
                  :label="item.label"
                  :key="i"
                  :value="item.value"
                ></el-checkbox>
              </el-checkbox-group>

              <div class="el-collapse-el-button">
                <el-button type="info" @click="handleConfirmSkills"
                  >Confirm new addition</el-button
                >
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item prop="skills">
          <span slot="label"> Already added Skills</span>
          <el-collapse accordion>
            <el-collapse-item
              title="Already added Skills（Select the skill you want to remove）"
            >
              <el-radio
                v-model="ruleForm.skillsDetail"
                v-for="(item, i) in ruleForm.skillsListDetail"
                :label="item.skill"
                :key="i"
                :value="item.skill.id"
                @change="handleChange(item.id)"
              ></el-radio>

              <div class="el-collapse-el-button">
                <el-button type="info" @click="handleDeleteSkills"
                  >Delete Skills</el-button
                >
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reqUrl } from "@/api/apiUrl";
import { requestGet, request } from "@/api/request";
import { showLoading, hideLoading } from "@/util/loading";

import { QualificationData } from "@/data/qualification.js";
import { SkillsData } from "@/data/skills.js";

export default {
  inject: ["reload"],
  data() {
    return {
      ruleForm: {
        qualification: "",
        category: "",
        optionQualification: [],
        gender: "",
        optionsGender: [
          { label: "male", value: "male" },
          { label: "female", value: "female" },
        ],
        age: "",
        twitter: "",
        telegram: "",
        description: "",
        skills: [],
        skillsList: [],
        skillsDetail: "",
        skillsDetailId: "",
        skillsListDetail: [],
      },
      rules: {
        qualification: [
          {
            required: true,
            message: "Please select your Degree",
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "Please select your Gender",
            trigger: "blur",
          },
        ],
        age: [{ required: true, message: "Please enter Age", trigger: "blur" }],
        twitter: [
          { required: true, message: "Please enter twitter", trigger: "blur" },
        ],
        telegram: [
          { required: true, message: "Please enter telegram", trigger: "blur" },
        ],
        demandBudget: [
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
    this.ruleForm.optionQualification = QualificationData;
    this.ruleForm.skillsList = SkillsData;

    showLoading();
    const opt = {
      url: reqUrl.candidateDetail,
      params: {
        user: localStorage.getItem("userName"),
      },
      resFunc: (res) => {
        if (res.data.errno == 0) {
          if (res.data.data) {
            this.ruleForm.skillsListDetail = res.data.data.skills;
            this.ruleForm.qualification = res.data.data.qualification;
            this.ruleForm.gender = res.data.data.gender;
            this.ruleForm.age = res.data.data.age;
            this.ruleForm.telegram = res.data.data.telegram;
            this.ruleForm.twitter = res.data.data.twitter;
            this.ruleForm.description = res.data.data.description;
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
                url: reqUrl.registerCandidat,
                method: "POST",
                params: {
                  qualification: this.ruleForm.qualification[0],
                  gender: this.ruleForm.gender,
                  age: this.ruleForm.age,
                  twitter: this.ruleForm.twitter,
                  telegram: this.ruleForm.telegram,
                  description: this.ruleForm.description,
                },
                resFunc: (res) => {
                  console.log(res.data);
                  if (res.data.errno == 0) {
                    this.$message.success("Register Successfully");
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
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "Cancelled operation",
              });
            });
        } else {
          this.$message.error(
            "Please check whether the information is correct"
          );
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleConfirmSkills() {
      this.$confirm(
        "Check whether the added skills are correct. If yes, proceed with the operation",
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
            url: reqUrl.addSkillCandidate,
            method: "POST",
            params: {
              skills: this.ruleForm.skills,
            },
            resFunc: (res) => {
              console.log(res.data);
              if (res.data.errno == 0) {
                this.$message.success("Added skill Successfully");
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled operation",
          });
        });
    },

    handleChange(val) {
      this.ruleForm.skillsDetailId = val;
    },

    handleDeleteSkills() {
      this.$confirm(
        "Are you sure you want to remove the selected skill？",
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
            url: reqUrl.deleteSkillCandidate,
            method: "POST",
            params: {
              skill: this.ruleForm.skillsDetail,
              id: this.ruleForm.skillsDetailId,
            },
            resFunc: (res) => {
              console.log(res.data);
              if (res.data.errno == 0) {
                this.$message.success("Delete Successfully");
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
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
@import "../../../Index.scss";
.demand_new_list {
  width: 70%;
  margin: 0 auto;
  height: calc(100vh - 120px);
  overflow-y: scroll;

  .demand_new_input_twitter {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 15px;
    background: #fff;
    padding-left: 15px;

    /deep/ .el-input__inner {
      width: auto;
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

.el-select-dropdown__item.hover {
  border-radius: 10px !important;
  background: #fbf3ff;
}

.el-select-dropdown__item.selected,
.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
  color: #be7eee;
}
</style>
