<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelAllMemberCount }}</div>
        <div class="desc">累计用户</div>
      </el-col>
      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelTodayMemberCount }}</div>
        <div class="desc">今日新增</div>
      </el-col>
      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelTodayActiveMemberCount }}</div>
        <div class="desc">今日活跃</div>
      </el-col>

      <el-col :span="2" :offset="11">
        <el-button type="primary" @click="open">导出</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelIosDeviceCount }}</div>
        <div class="desc">苹果设备数量</div>
      </el-col>

      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelAndroidDeviceCount }}</div>
        <div class="desc">安卓设备数量</div>
      </el-col>

      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelChargeCount }}</div>
        <div class="desc">充值数量</div>
      </el-col>

      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelChargeAmount }}</div>
        <div class="desc">充值金额</div>
      </el-col>

      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelChargeRate }}</div>
        <div class="desc">充值比例</div>
      </el-col>

      <el-col :span="3">
        <div class="val">{{ this.summaryInfo.channelAvgConsumption }}</div>
        <div class="desc">人均消费</div>
      </el-col>

    </el-row>

    <el-form ref="query" :model="query" label-width="80px;" :inline="true">

      <el-form-item label="数据选项:" prop="state">
        <el-select v-model="query.dataOptionValue" clearable placeholder="请选择">
          <el-option
            v-for="(option) in dataOption"
            :key="option.id"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="日期选项">
        <el-col :span="11">
          <el-form-item prop="startDate">
            <el-date-picker v-model="query.startDate" type="date" placeholder="选择开始时间" style="width: 100%;" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1" style="text-align: center;margin-right: 10px;">至</el-col>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker v-model="query.endDate" type="date" placeholder="选择结束时间" style="width: 104%;" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" style="margin-left: 100px;" @click="handleFilter('query')">搜索</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="handleReset('query')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="table" :data="list" :height="tableHeight" style="width: 100%;margin-top:5px;">
      <el-table-column align="center" label="用户id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用设备">
        <template slot-scope="scope">
          {{ scope.row.os }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员状态">
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="消费金额">
        <template slot-scope="scope">
          {{ scope.row.trade_amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单信息">
        <template slot-scope="scope">
          {{ scope.row.order_info }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="340">
        <template slot-scope="scope">
          <pre>
            注册时间：{{ scope.row.create_time }}
            <span v-show="scope.row.vip_expired">会员到期时间：{{ scope.row.vip_expired }}</span>
          </pre>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="query.page" :limit.sync="query.pageSize" @pagination="channelUserLists"/>
  </div>
</template>

<script>
import { channelUserLists,summaryInfo } from '@/api/user'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const defaultQuery = {
  page: 1,
  pageSize: 10
}

export default {
  name: 'Dashboard',
  components: { Pagination },
  data() {
    return {
      query: Object.assign({}, defaultQuery),
      pageSizes:[10, 20, 30, 40, 50, 100],
      list: [],
      tableHeight: 600,
      total: 0,
      dataOption: [{
        id: 1,
        value: 1,
        label: '今天数据'
      }, {
        id: 2,
        value: 2,
        label: '昨天数据'
      }],
      summaryInfo:{}
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    this.summaryInfo1(this.query)
    this.channelUserLists(this.query)
  },
  methods: {
    channelUserLists: async function() {
      const res = await channelUserLists(this.query)
      this.list = res.items
      this.total = res.total
    },
    handleFilter: function() {
        this.summaryInfo1(this.query)
       this.channelUserLists(this.query)
    },
    summaryInfo1: async function() {
      const res = await summaryInfo(this.query)
      this.$nextTick(function() {
        this.summaryInfo = res
      })
    },
    handleReset: function() {
      this.$data.query = {
        page: this.query.page,
        pageSize: this.query.pageSize
      }
      this.summaryInfo1(this.query)
      this.channelUserLists(this.query)
    },
    open() {
      this.$confirm('确定要导出渠道统计内容吗?', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {


        let url = '',data = this.query;
        for(let i in data){
          url += "&" + i + "=" + data[i]
        }

        url = url.substring(1)+"&channel_id="+this.summaryInfo.channelId;

        window.location.href = "/test/exportFirstPageStatistics?" + url;

      }).catch(() => {

      });
    }
  }

}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  //min-height: 36px;
  height: 30px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>
