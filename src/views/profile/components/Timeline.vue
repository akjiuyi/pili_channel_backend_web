<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.loginDate" placement="top">
        <el-card>
          <h4>{{ item.loginIp }}</h4>
          <p>{{ item.userAgent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { nearLoginList } from '@/api/user'
export default {
  data() {
    return {
      timeline: []
    }
  },
  created() {
    this.getNearLoginList()
  },
  methods: {
    getNearLoginList: async function() {
      const data = await nearLoginList()
      this.timeline = data
    }
  }
}
</script>
