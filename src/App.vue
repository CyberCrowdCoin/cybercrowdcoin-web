<template>
  <div>
    <router-view v-if="isRefresh" />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRefresh: true,
    };
  },
  methods: {
    reload() {
      this.isRefresh = false;
      this.$nextTick(() => {
        this.isRefresh = true;
      });
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 500;
  list-style: none;
  text-decoration: none;
}

.header_title_agent {
  height: 80px;
  display: flex;
  align-items: center;

  p {
    font-size: 22px;
    color: #202226;
    margin-right: 8px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    color: #7d828c;
  }
}

.el-select-dropdown {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 16px !important;
}

.el-date-picker.has-sidebar {
  top: 133px !important;
  left: 586px !important;
  border-radius: 20px !important;
  overflow: hidden !important;
}
</style>
