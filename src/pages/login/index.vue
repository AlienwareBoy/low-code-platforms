<template>
  <div class="login-page">
    <el-card class="login-form">
      <h2>登录</h2>
      <el-form :model="form">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item class="operating">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="primary" @click="onSubmitRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue'
import userStore from '@/store/user'
import { storeToRefs } from 'pinia'
import { register } from '@/apis/user'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
const user = userStore()

const form = ref({
  username: 'yuyu',
  password: '123456',
})

const onSubmit = async () => {
  try {
    const res = await user.login(form.value.username, form.value.password)   // loginRedirect()
  } catch (error) {
    ElMessage.error('登录失败')
  }
}
const onSubmitRegister = () => {
  console.log('登录信息:', form.value)
  user
    .register({ username: form.value.username, password: form.value.password })
    .then((res) => {})
}
onMounted(() => {})
</script>

<style lang="scss">
body {
  background: linear-gradient(135deg, #1e1e2f, #2d2d44);
  font-family: 'Arial', sans-serif;
  color: #fff;
  overflow: hidden;
}
.operating {
  @include flexBox(column, center, center);
  width: 100%;
  .el-form-item__content {
    width: 100%;
  }
  .el-button {
    &:last-child {
      margin-top: 10px;
      margin-left: 0px;
    }
  }
}
.login-form {
  width: 400px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
}
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(
    circle,
    rgba(45, 45, 68, 0.8),
    rgba(30, 30, 47, 0.8)
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255, 255, 255, 0.1)" /></svg>');
    pointer-events: none;
    animation: moveParticles 10s linear infinite;
  }

  @keyframes moveParticles {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
}
</style>
