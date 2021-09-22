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
            <el-date-picker v-model="startDate" type="date" placeholder="选择开始时间" style="width: 100%;" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="1" style="text-align: center;margin-right: 10px;">至</el-col>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker v-model="endDate" type="date" placeholder="选择结束时间" style="width: 104%;" value-format="yyyy-MM-dd" />
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
      <el-table-column align="center" label="订单信息" width="340">
        <template slot-scope="scope">
          <div style="text-align: left">
            {{ scope.row.order_info.buy_time}}
            <br/>
            {{ scope.row.order_info.buy_title}}
            <br/>
            <!--<span v-if="scope.row.order_info" @mouseover="showMore(scope.row.id)">查看更多...</span>-->
            <span v-if="scope.row.order_count>1" @click="showMore(scope.row.id)" style="color: #409eff">查看更多...</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="340">
        <template slot-scope="scope">
          <pre>
            注册时间：{{ scope.row.create_time }}
            <span v-if="scope.row.vip_expired">会员到期：{{ scope.row.vip_expired }}</span>
            <span v-if="scope.row.last_access">最近访问：{{ scope.row.last_access }}</span>
          </pre>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="query.page" :limit.sync="query.pageSize" @pagination="channelUserLists"/>

    <el-dialog title="订单列表"  :lock-scroll="true" width="35%" :visible.sync="dialogTableVisible" @closed="closeOrderList">
      <el-table :data="gridData" >
        <el-table-column property="trade_amount" label="消费金额" width="150"></el-table-column>
        <el-table-column property="title" label="购买商品"></el-table-column>
        <el-table-column property="update_time" label="购买时间"></el-table-column>
      </el-table>
      <pagination v-show="true" :total="orderTotal" :page-sizes="pageSizes" :page.sync="orderQuery.page" :limit.sync="orderQuery.pageSize"  @pagination="userOrderLists"/>
    </el-dialog>
  </div>
</template>

<script>
import { channelUserLists,summaryInfo,getMoreOrder } from '@/api/user'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const defaultQuery = {
  page: 1,
  pageSize: 10,
  dataOptionValue:null
}

export default {
  name: 'Dashboard',
  components: { Pagination },
  data() {
    return {
      startDate:'',
      endDate:'',
      startDateComp:'',
      endDateComp:'',
      query: Object.assign({}, defaultQuery),
      orderQuery: Object.assign({}, defaultQuery),
      pageSizes:[10, 20, 30, 40, 50, 100],
      list: [],
      tableHeight: 600,
      total: 0,
      orderTotal: 0,
      dataOption: [{
        id: 1,
        value: 1,
        label: '今天数据'
      }, {
        id: 2,
        value: 2,
        label: '昨天数据'
      }],
      summaryInfo:{},
      dialogTableVisible: false,
      gridData: []
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
  watch: {
    startDate(val) {
      if(val){
        this.startDateComp = val;
        this.startDateComp = this.startDateComp.replace(/-/g, "")

        if(this.endDate){
          this.endDateComp = this.endDate;
          this.endDateComp = this.endDateComp.replace(/-/g, "")

          if(Number(this.startDateComp)>Number(this.endDateComp)){
            this.$message.error('开始日期应该小于结束日期');
            this.startDate = '';
            this.query.startDate = this.startDate;
            return ;
          }
        }

        this.query.startDate = val;
      }else{
        this.query.startDate = val;
      }
    },
    endDate(val) {
      if(val){
        this.endDateComp = val;
        this.endDateComp = this.endDateComp.replace(/-/g, "")

        if(this.startDate){
          this.startDateComp = this.startDate;
          this.startDateComp = this.startDateComp.replace(/-/g, "")

          if(Number(this.startDateComp)>Number(this.endDateComp)){
            this.$message.error('开始日期应该小于结束日期');
            this.endDate = '';
            this.query.endDate = this.endDate;
            return ;
          }
        }

        this.query.endDate = val;
      }else{
        this.query.endDate = val;
      }
    }
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

      this.$data.startDate = null;
      this.$data.endDate = null;

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
    },
     showMore:async function(member_id) {
       this.$data.dialogTableVisible = true;

       this.orderQuery.member_id = member_id;
       this.orderQuery.dataOptionValue = this.query.dataOptionValue
       this.orderQuery.startDate = this.startDate
       this.orderQuery.endDate = this.endDate

       const res = await getMoreOrder(this.orderQuery)
       this.$data.gridData = res.lists;
       this.$data.orderTotal = res.total
     },
     userOrderLists:async function() {
          const res = await getMoreOrder(this.orderQuery)
          this.$data.gridData = res.lists;
          this.$data.orderTotal = res.total
     },
     closeOrderList() {
       this.orderQuery.page = 1
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
