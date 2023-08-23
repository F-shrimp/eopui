<template>
  <div class="components-container">
    <aside>
      1.填写需要申请服务器的应用名和环境（生产或测试）<br>
      2.若为测试环境则不需要填写机房信息<br>
      3.填写区域、服务器配置后申请服务器
    </aside>
    <el-tag style="margin-right:20px">应用名：</el-tag>
    <el-select v-model="listQuery.appname" placeholder="please select appname" clearable style="width: 180px" class="filter-item">
      <el-option v-for="item in list" :key="item.appname" :label="item.appname" :value="item.appname" />
    </el-select>
    <el-tag style="margin-right:20px; margin-left: 50px;">环境：</el-tag>
    <el-select v-model="listQuery.env" placeholder="please select env" clearable style="width: 180px" class="filter-item">
      <el-option-group v-if="checkPermission(['admin'])" label="Options">
        <el-option v-for="item in this.env_list.prod" :key="item" :label="item" :value="item" />
      </el-option-group>
      <el-option-group v-if="checkPermission(['editor'])" label="Options">
        <el-option v-for="item in this.env_list.stg" :key="item" :label="item" :value="item" />
      </el-option-group>
    </el-select>
    <el-button lass="filter-item" style="margin-left: 50px;" type="primary" icon="el-icon-edit" @click="handleFilter">扩容</el-button>

    <el-dialog :title="ShowInFo" :visible.sync="dialogPvVisible">
      <el-form label-position="left" :model="temp" label-width="150px" style="width: 600px; margin-left:5px;">
        <el-tag type="warning" style="margin-bottom: 20px; font-size: medium;">请确认该系统的扩缩容信息，若无问题则请点击"确认"按钮，否则请取消！</el-tag>
        <el-form-item label="应用名">{{ temp.appname }}</el-form-item>
        <el-row>
          <el-col :span="12"><el-form-item label="业务域">{{ temp.app_domain }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="系统负责人">{{ temp.app_Owner }}</el-form-item></el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;"><el-tag>快速扩容信息</el-tag></el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="支持一键初始化">{{ temp.once_init }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="支持deploy部署">{{ temp.on_deploy }}</el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="可随时启动服务">{{ temp.start_any }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="可健康检查判断服务">{{ temp.health_check }}</el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="可随时上流量">{{ temp.online_any }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="特殊项描述">{{ temp.on_special_content }}</el-form-item></el-col>
        </el-row>
        <el-row style="margin-bottom: 20px;"><el-tag>快速缩容信息</el-tag></el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="可随时下流量">{{ temp.offline_any }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="可随时停服务">{{ temp.stop_any }}</el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><el-form-item label="支持日志备份">{{ temp.logback }}</el-form-item></el-col>
          <el-col :span="12"><el-form-item label="特殊项描述">{{ temp.off_special_content }}</el-form-item></el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="expanJump(listQuery.appname,listQuery.env)">确认</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { fetchList } from '@/api/article'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default ({
  name: 'Expansion',
  directives: { permission },
  data() {
    return {
      tableKey: 0,
      ShowInFo: '确认系统信息',
      dialogPvVisible: false,
      list: null,
      listQuery: {
        flag: 0,
        page: 1,
        limit: 20,
        appname: '',
        env: ''
      },
      env_list: { 'prod': ['uat', 'bx', 'wgq'], 'stg': ['stg1', 'stg2'] },
      temp: {
        aid: undefined, create_flag: false,
        appname: undefined, app_domain: '',
        app_Owner: '', restart_any: '',
        rapid_reduction: '',
        rrflag: true,
        once_init: '', on_deploy: '',
        start_any: '', health_check: '',
        online_any: '', on_special_content: '',
        offline_any: '', stop_any: '',
        logback: '', off_special_content: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listQuery.page = 1,
      this.listQuery.flag = 1,
      fetchList(this.listQuery).then(response => {
        this.temp = response.data[0]
      }).catch(err => {
        this.$message.error(err.message)
        console.log(err)
      })
      this.dialogPvVisible = true
    },
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
      }).catch(err => {
        this.$message.error(err.message)
        console.log(err)
      })
    },
    expanJump(appname, env) {
      const min = 100000
      const max = 999999
      console.log('#########', appname, env)
      const randomSixDigitNumber = Math.floor(Math.random() * (max - min + 1)) + min
      this.$router.push({
        name: 'NewExpan',
        params: { id: randomSixDigitNumber, appname: appname, env: env }
      })
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
