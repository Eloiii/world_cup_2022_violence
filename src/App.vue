<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { api } from 'boot/axios'
export default defineComponent({
  name: 'App',
  async mounted() {
    let userCheck = await api.get('/getUser', {params: {username: localStorage.getItem("username")} })
    if(userCheck === null || userCheck === undefined || userCheck?.data?.length === 0) {
      this.$router.push('/login')
    }

  }
})
</script>
<style>
@import url('https://rsms.me/inter/inter.css');
* { font-family: 'Inter', sans-serif; }
</style>
