<template>
  <div ref="tdiv" style="margin-top: 20px;margin-left: 15px;">
    <el-row class="cards" shadow="never">
      <el-col :span="4" class="btn">
          <div class="val">{{ this.statInfo.channelMemberCount }}</div>
          <div class="desc">发展用户</div>
      </el-col>
      <el-col :span="4" class="btn">
          <div class="val">{{ this.statInfo.historyIncome }}</div>
          <div class="desc">累计收益</div>
      </el-col>
      <el-col :span="4" class="btn">
          <div class="val">{{ this.statInfo.balance }}</div>
          <div class="desc">可提现</div>
      </el-col>
      <el-col :span="4" class="btn">
          <div class="val">{{ this.statInfo.historyWithdraw }}</div>
          <div class="desc">已提现</div>
      </el-col>
      <el-col :span="4" class="btn">
          <div class="val">{{ this.statInfo.freezeWithdraw }}</div>
          <div class="desc">提现中</div>
      </el-col>
      <el-col :span="4" class="btn">
          <div><span class="desc">满{{ this.statInfo.withdrawLimit }}元可提现</span><el-button style="margin-left: 20px;" type="primary" @click="handleWithdraw()">提现</el-button></div>
      </el-col>
    </el-row>
    <el-form ref="query" :model="query" label-width="80px;" :inline="true">
      <el-form-item label="用户名:" prop="nickname">
        <el-input v-model="query.nickname" placeholder="请填写用户名称" style="width: 150px;margin-right:30px;" />
      </el-form-item>
      <el-form-item label="订单状态:" prop="state">
        <el-radio-group v-model="query.state">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">待支付</el-radio>
          <el-radio :label="2">支付成功</el-radio>
          <el-radio :label="3">支付失败</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择商品" prop="productId" style="margin-left: 4rem;">
        <el-select v-model="query.productId" clearable placeholder="请选择" style="margin-right:30px;">
          <el-option
            v-for="(product) in appProductLists"
            :key="product.id"
            :label="product.title"
            :value="product.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择支付方式" prop="paymentChannelId">
        <el-select v-model="query.paymentChannelId" clearable placeholder="请选择">
          <el-option
            v-for="(channelInfo) in paymentChannelLists"
            :key="channelInfo.id"
            :label="channelInfo.landslideName"
            :value="channelInfo.id"
          />
        </el-select>
      </el-form-item>
      <br>
        <el-form-item label="时间选项">
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker v-model="query.startDate" type="datetime" placeholder="选择开始时间" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align: center;margin-right: 10px;">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker v-model="query.endDate" type="datetime" placeholder="选择结束时间" style="width: 104%;" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" style="margin-left: 100px;" @click="handleFilter('query')">搜索</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="handleReset('query')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="table" :data="list" :height="tableHeight" style="width: 100%;margin-top:5px;">
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          {{ scope.row.otn }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="产生收益">
        <template slot-scope="scope">
          {{ scope.row.income }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          {{ scope.row.paymentChannelName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="stateTypes[scope.row.state] ? stateTypes[scope.row.state] : 'info'"> {{ scope.row.stateDesc }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.pageSize" @pagination="incomeLists" />

    <el-dialog :visible.sync="dialogVisible" title="申请提现"  :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="bank">
        <el-col :span="8">
            <span class="title">提现账号:</span><span class="content">{{ this.statInfo.loanAccountInfo.bankAccount }}</span>
        </el-col>
        <el-col :span="8">
            <span class="title">银行:</span><span class="content">{{ this.statInfo.loanAccountInfo.bankName }}</span>
        </el-col>
        <el-col :span="8">
            <span class="title">联系人:</span><span class="content">{{ this.statInfo.loanAccountInfo.contactName }}</span>
        </el-col>
        <el-col :span="8">
            <span class="title">联系方式:</span><span class="content">{{ this.statInfo.loanAccountInfo.phone }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 20px;margin-top: 30px;"><span class="title">可提现金额: </span>{{ this.statInfo.balance }}</el-row>
      <el-form ref="ruleForm" :model="withdrawInfo" label-width="100px" label-position="left" :rules="rules">
        <el-form-item label="提现金额" style="width: 280px;" prop="money">
          <el-input v-model="withdrawInfo.money" placeholder="请输入提现金额" />
        </el-form-item>
       <el-row>提现扣除{{ this.statInfo.withdrawFeeRatePercent }}手续费，预计到账{{ this.withdrawActualMoney }}</el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmHandleWithdraw('ruleForm')">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { applyWithdraw,incomeStatInfo,incomeLists } from '@/api/order'
import { paymentChannels,appProducts } from '@/api/common'
import Pagination from '@/components/Pagination'

const defaultQuery = {
  page: 1,
  pageSize: 100,
  state: 0
}

export default {
 name: 'IncomeLists',
 components: { Pagination },
  data() {
    var checkMoney = (rule, value, callback) => {
      if (value === '' || value <= 0) {
        callback(new Error('请输入正确的提现金额'));
      } else {
        if (parseFloat(value) > parseFloat(this.statInfo.balance)) {
          callback(new Error('提现金额不能超过可提现金额'));
        } else {
          callback();
        }
      }
    };

    return {
      query: Object.assign({}, defaultQuery),
      list: [],
      total: 0,
      tableHeight: 600,
      stateTypes: {
        0: 'info', //
        1: 'info', // 未支付
        2: 'success', // 2已支付
        3: 'warning', // 3支付失败
      },
      appProductLists: {},
      paymentChannelLists: {},
      statInfo:{
        loanAccountInfo: {
          "accountType": 1,
          "phone": "",
          "bankName": "",
          "contactName": "",
          "bankAccount": ""
        }
      },
      dialogVisible: false,
      withdrawInfo:{
        money: 0
      },
      rules: {
        money: [{ validator: checkMoney, trigger: 'blur' }],
      }
    }
  },
  computed: {
      withdrawActualMoney: function () {
        return (this.withdrawInfo.money - this.statInfo.withdrawFeeRate * this.withdrawInfo.money).toFixed(2)
      }
  },
  created() {
    this.incomeStatInfo()
    this.appProducts()
    this.paymentChannels()
  },
  mounted() {
     this.incomeLists(this.query)
  },
  methods: {
    incomeLists: async function() {
      const res = await incomeLists(this.query)
      this.list = res.items
      this.total = res.total
    },
    incomeStatInfo: async function() {
      //const res = await incomeStatInfo(this.query)
      const res = await incomeStatInfo()
      this.$nextTick(function() {
         this.statInfo = res
      })
    },
    handleFilter: function() {
      return this.incomeLists(this.query)
    },
    handleReset: function() {
      this.$data.query = {
        page: this.query.page,
        pageSize: this.query.pageSize,
        state: 0
      }
      return this.incomeLists(this.query)
    },
    appProducts: async function() {
      const res = await appProducts()
      this.$nextTick(function() {
        this.appProductLists = res.items
      })
    },
    paymentChannels: async function() {
      const res = await paymentChannels()
      this.$nextTick(function() {
        this.paymentChannelLists = res.items
      })
    },
    handleWithdraw() {
      this.dialogVisible = true
    },
    confirmHandleWithdraw: async function(formName) {
      this.$refs[formName].validate(async(valid) => {
            if (valid) {
             const res = await applyWithdraw(this.withdrawInfo)

              this.$message({
                type: 'success',
                message: '提现申请成功'
              })
              this.incomeStatInfo()
              this.dialogVisible = false
            } else {
              console.log('error submit!!');
              return false;
            }
      });
    }
  }
}
</script>

<style>
  .el-table{
      overflow:visible !important;
  }
  .cards {
    margin-bottom: 10px;
  }
  .btn {
    margin-bottom: 18px;
  }
  .val {
    font-size: large;font-weight: 600;
  }
  .desc {
    color: #889AA4;margin-top: 10px;
  }
  .title{
    font-weight: 600;margin-right: 10px;;
  }
  .bank .el-col {
    margin-bottom: 10px;
  }
</style>
