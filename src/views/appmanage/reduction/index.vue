<template>
  <div class="components-container">
    <aside>请输入要替换的服务器IP，该流程包括扩容新服务器和下线老服务器
    </aside>
    <el-form>
      <el-row>
        <el-col :span="12">
          <el-input
            v-model="ips"
            placeholder="Please input ips..."
            style="width: 600px; margin-left:20px; margin-bottom:30px "
            type="textarea"
            :rows="12"
            maxlength="2000"
          />
        </el-col>
        <el-col :span="12">
          <el-table style="height: 300px;" />
        </el-col>
      </el-row>
      <el-row>
        <el-row>
          <el-col :span="4" class="text-center" style="margin-left:80px;">
            <el-button class="pan-btn tiffany-btn" @click="exDuct">
              扩容
            </el-button>
          </el-col>
          <el-col :span="4" class="text-center" style="margin-left:100px;">
            <el-button class="pan-btn yellow-btn" @click="reDuct">
              缩容
            </el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
  </div>
</template>
<script>

import { ips_getinfo } from '@/api/article'

export default ({
  name: 'Overinsured',
  data() {
    return {
      ips: ''
    }
  },
  methods: {
    exDuct() {
      console.log('%%%%%%', this.ips)
      ips_getinfo(this.ips).then(response => {
        console.log(response)
      })
    },
    reDuct() {
      console.log(this.ips)
    }
  }
})
</script>

<style scoped>
  .components-container {
    position: relative;
    height: 400px;
  }
</style>
