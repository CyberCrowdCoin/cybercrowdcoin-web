<template>
  <div class="pagination">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1, //默认第一页
    },
    limit: {
      type: Number,
      default: 10, //默认每页20条
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    pageSizes: {
      type: Array,
      default: [10, 20, 50, 100],
    },
  },

  computed: {
    // 第几页
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val); //改变的第几页的值赋值给父组件
      },
    },

    //每页显示几条数据
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val); //改变的当前页几条数据的值赋值给父组件
      },
    },
  },

  methods: {
    //当前页多少条数据的方法
    handleSizeChange(val) {
      this.$emit("pagination", { pageIndex: 1, pageSize: val });
    },

    //显示第几页
    handleCurrentChange(val) {
      this.$emit("pagination", { pageIndex: val, pageSize: this.pageSize });
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .el-pager li {
    background-color: #e0e0e0;
  }

  /deep/ .el-pagination {
    .el-select .el-input .el-input__inner {
      border-radius: 10px;
    }

    .el-input.is-focus .el-input__inner,
    .el-select .el-input__inner:focus,
    .el-pagination__sizes .el-input .el-input__inner:hover {
      border-color: #eaceff !important;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #eaceff;
    }
  }
}
</style>

<style>
@import "../../Index.scss";

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li,
.el-pagination__editor.el-input .el-input__inner,
.el-pagination.is-background .el-pager li:not(.disabled).active {
  border-radius: 17px !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #eaceff;
}
</style>
