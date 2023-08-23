<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag style="margin-right:20px">应用名：</el-tag>
      <el-input v-model="listQuery.appname" placeholder="Appname" style="width: 200px; margin-right:20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}"><span>{{ row.aid }}</span></template>
      </el-table-column>
      <el-table-column label="应用名" prop="appname" width="200px" align="center">
        <template slot-scope="{row}"><span>{{ row.appname }}</span></template>
      </el-table-column>
      <el-table-column label="业务域" prop="app_domain" width="200px" align="center">
        <template slot-scope="{row}"><span>{{ row.app_domain }}</span></template>
      </el-table-column>
      <el-table-column label="系统负责人" prop="app_Owner" width="150px" align="center">
        <template slot-scope="{row}"><span>{{ row.app_Owner }}</span></template>
      </el-table-column>
      <el-table-column label="可随时重启" prop="restart_any" width="150px" align="center">
        <template slot-scope="{row}"><span>{{ row.restart_any }}</span></template>
      </el-table-column>
      <el-table-column label="可快速扩容" prop="rapid_expansion" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewexDesc(row.appname,true)"><el-tag>{{ row.rapid_expansion }}</el-tag></span>
          <!-- <span class="link-type" @click="handleUpdate(row)"><el-tag>{{ row.rapid_expansion }}</el-tag></span> -->
        </template>
      </el-table-column>
      <el-table-column label="可快速缩容" prop="rapid_reduction" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="viewexDesc(row.appname,false)"><el-tag>{{ row.rapid_reduction }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="操作列表" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="150px" :model="temp" style="width: 600px; margin-left:40px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名">
              <span class="grid-content bg-purple"><el-tag>{{ temp.appname }}</el-tag></span>
              <!-- <el-input v-model="rrinfo.appname" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="temp.rrflag" label="支持一键初始化">
              <span class="grid-content bg-purple">{{ temp.once_init }}</span>
            </el-form-item>
            <el-form-item v-else label="可随时下流量">
              <span class="grid-content bg-purple">{{ temp.offline_any }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="temp.rrflag" label="支持deploy部署">
              <span class="grid-content bg-purple">{{ temp.on_deploy }}</span>
            </el-form-item>
            <el-form-item v-else label="可随时停服务">
              <span class="grid-content bg-purple">{{ temp.stop_any }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="temp.rrflag" label="可随时启动服务">
              <span class="grid-content bg-purple">{{ temp.start_any }}</span>
            </el-form-item>
            <el-form-item v-else label="支持日志备份">
              <span class="grid-content bg-purple">{{ temp.logback }}</span>
              <!-- <el-input v-model="rrinfo.stop_service" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="temp.rrflag">
          <el-col :span="12">
            <el-form-item label="可健康检查判断服务">
              <span class="grid-content bg-purple">{{ temp.health_check }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可随时上流量">
              <span class="grid-content bg-purple">{{ temp.online_any }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="temp.rrflag" label="特殊项描述">
              <span class="grid-content bg-purple">{{ temp.on_special_content }}</span>
              <el-input v-show="this.isEdit" v-model="temp.on_special_content" />
            </el-form-item>
            <el-form-item v-else label="特殊项描述">
              <span class="grid-content bg-purple">{{ temp.off_special_content }}</span>
              <el-input v-show="this.isEdit" v-model="temp.off_special_content" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"><el-button @click="dialogFormVisible = false, isEdit = false">取消</el-button></div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPvVisible">
      <el-form ref="chDesc" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 600px; margin-left:5px;">
        <!-- <el-table :model="temp" ref="chDesc" :data="rrinfo" border fit highlight-current-row style="width: 100%"> -->
        <el-form-item label="应用名"><span>
          <el-input v-if="this.tIshow" v-model="temp.appname" />
          <el-tag v-else>{{ temp.appname }}</el-tag></span>
        </el-form-item>
        <el-form-item label="业务域"><el-input v-model="temp.app_domain" /></el-form-item>
        <el-form-item label="系统负责人"><el-input v-model="temp.app_Owner" /></el-form-item>
        <el-row style="margin-bottom: 20px;"><el-tag>快速扩容信息</el-tag></el-row>
        <el-form-item label="支持一键初始化">
          <el-select v-model="temp.once_init" :value="temp.once_init" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="支持deploy部署">
          <el-select v-model="temp.on_deploy" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="可随时启动服务">
          <el-select v-model="temp.start_any" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="可健康检查判断服务">
          <el-select v-model="temp.health_check" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="可随时上流量">
          <el-select v-model="temp.online_any" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="特殊项描述"><el-input v-model="temp.on_special_content" /></el-form-item>
        <el-row style="margin-bottom: 20px;"><el-tag>快速缩容信息</el-tag></el-row>
        <el-form-item label="可随时下流量">
          <el-select v-model="temp.offline_any" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="可随时停服务">
          <el-select v-model="temp.stop_any" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="支持日志备份">
          <el-select v-model="temp.logback" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="特殊项描述"><el-input v-model="temp.off_special_content" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认</el-button>
        <el-button @click="dialogPvVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createrespecInfo, updaterespecInfo, findrespecInfo, deleterespecInfo } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import '@/assets/custom-theme/index.css'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        flag: 0,
        appname: '',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      appkey: '',
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
      },
      isEdit: false,
      dialogFormVisible: false,
      dialogStatus: '',
      statusOptions: ['是', '否'],
      textMap: {
        update: 'Edit',
        create: 'Create',
        show: 'Show InFo'
      },
      dialogPvVisible: false,
      tIshow: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
        this.total = response.total
      }).catch(err => {
        this.$message.error(err.message)
        console.log(err)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.flag = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        aid: undefined,
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
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.tIshow = true,
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['chDesc'].clearValidate()
      })
    },
    createData() {
      this.temp.aid = this.total + 1
      this.$refs['chDesc'].validate((valid) => {
        if (valid) {
          createrespecInfo(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogPvVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs['chDesc'].clearValidate()
      })
    },
    viewexDesc(name, flag) {
      this.temp.appname = name
      this.temp.rrflag = flag
      this.dialogStatus = 'show'
      findrespecInfo(this.temp).then(response => {
        console.log(response)
        this.dialogFormVisible = true
        if (flag == true) {
          this.temp.once_init = response.data.once_init
          this.temp.on_deploy = response.data.on_deploy
          this.temp.start_any = response.data.start_any
          this.temp.health_check = response.data.health_check
          this.temp.online_any = response.data.online_any
          this.temp.health_check = response.data.health_check
          this.temp.on_special_content = response.data.on_special_content
        } else {
          this.temp.offline_any = response.data.offline_any
          this.temp.stop_any = response.data.stop_any
          this.temp.logback = response.data.logback
          this.temp.off_special_content = response.data.off_special_content
        }
      })
    },
    updateData() {
      this.isEdit = true,
      this.$refs['chDesc'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updaterespecInfo(tempData).then(() => {
            const index = this.list.findIndex(v => v.aid === this.temp.aid)
            // 更新整个数组并保持响应式
            this.list.splice(index, 1, this.temp)
            this.dialogPvVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      if (confirm('请确认是否要操作删除？')) {
        deleterespecInfo(row).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      } else {
        alert('操作已取消！')
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
