<template>
  <el-form ref="userDataForm" :model="userData" :rules="rules">
    <el-row style="margin-bottom: 20px;"><span style="font-size: small;font-family:'PingFang SC';">最后登录时间：{{ userData.lastLoginDate }}</span></el-row>
    <el-divider />
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userData.username" disabled />
    </el-form-item>
    <el-form-item label="修改密码" prop="editPassword">
      <el-switch v-model="editPassword" />
    </el-form-item>
    <div v-if="editPassword">
      <el-divider />
      <el-form-item label="原始密码" style="width: 280px;" prop="password">
        <el-input v-model.trim="userData.password" placeholder="" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="新密码" style="width: 280px;" prop="newPassword">
        <el-input v-model.trim="userData.newPassword" placeholder="请输入3-20位字符,字符必须是英文、字母、下划线" autocomplete="off" type="password" minlength="6," maxlength="20" :show-password="false" />
      </el-form-item>
      <el-form-item label="确认新密码" style="width: 280px;" prop="checkNewPass">
        <el-input v-model.trim="userData.checkNewPass" placeholder="请确认密码" autocomplete="off" type="password" :show-password="false" />
      </el-form-item>
      <el-divider />
    </div>
    <el-form-item>
      <el-button type="primary" @click="confirmEditSelf('userDataForm')">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getInfo, resetPwd } from '@/api/user'
import { MessageBox } from 'element-ui'
import store from '@/store'
export default {
  data() {
    var validateNewPass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入新密码'))
      } else {
        const reg = /^[a-zA-Z0-9_]{3,20}$/
        if (!reg.test(value)) {
          callback(new Error('密码格式不正确'))
        }
        if (this.userData.checkNewPass !== '') {
          this.$refs.userDataForm.validateField('checkNewPass')
        }
        callback()
      }
    }
    var validateChecknEewPass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userData.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userData: {
        username: '',
        createdAt: '',
        password: '',
        newPassword: '',
        checkNewPass: ''
      },
      editPassword: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          //{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入原来的密码', trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        checkNewPass: [
          { validator: validateChecknEewPass, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo: async function() {
      const userInfo = await getInfo()
      this.userData = userInfo
    },
    async confirmEditSelf(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.resetPwd()
        } else {
          return false
        }
      })
    },
    resetPwd: async function() {
      const data = await resetPwd(this.userData)

      //this.editPassword = false
      /*this.$message({
        type: 'success',
        message: '更新成功'
      })

      //this.userData.newPassword = this.userData.password = ''
      if (data.resetToken === true) {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }*/


      if (data.resetToken === true) {
          MessageBox.alert('密码修改成功，请重新登陆', '确认退出',{
            confirmButtonText: '重新登陆',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          });
      }else{
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      }

    }
  }
}
</script>
