<template>
  <div>
    <div class="layout-padding">
      <div class="shadow-up-5" style="padding: .5em;">
        <a id="dlink"  style="display:none;"></a>
        <button class="primary raised" @click="tableToExcel('tableInvestorList', 'InvestorList', 'InvestorList.xls')">Export TO Excel</button>
        <button class="primary raised pull-right" @click="goToAddInvestor()"><i>add</i>Add Investor</button>
        <br>
        <br>
        <table id="tableInvestorList" class="hidden">
          <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>DateCreated</th>
            <th>Created By</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="dataTable in table" :key="dataTable.unique_id">
            <td>{{ dataTable.username }}</td>
            <td>{{ dataTable.name }}</td>
            <td>{{ dataTable.bday }}</td>
            <td>{{ dataTable.gender }}</td>
            <td>{{ dataTable.email }}</td>
            <td>{{ dataTable.contactNo }}</td>
            <td>{{ dataTable.datecreated }}</td>
            <td>{{ dataTable.createdby }}</td>
          </tr>
          </tbody>
        </table>
        <q-data-table
                :data="table"
                :config="config"
                :columns="columns"
                @refresh="refresh"
        >
          <template slot="col-username" scope="cell">
          <span v-if="cell.row.gender === 'MALE'" class="label text-white bg-primary">
            {{ cell.data }}
            <q-tooltip>MALE</q-tooltip>
          </span>
            <span v-else class="label text-white bg-pink">
            {{ cell.data }}
            <q-tooltip>FEMALE</q-tooltip>
          </span>
          </template>
          <template slot="col-action" scope="cell">
            <!-- {{cell.row.status}} -->
            <button class="primary raised" @click="viewInvestorDetail(cell.data)">VIEW</button>
            <button class="primary raised" v-if="cell.row.status == 0" @click="updateStatusInvestorByUsername(cell.data,'1')">Active</button>
            <button class="red raised"  v-if="cell.row.status == 1" @click="updateStatusInvestorByUsername(cell.data,'0')">Inactive</button>
          </template>

          <template slot="selection" scope="props">
            <button class="primary clear" @click="changeMessage(props)">
              <i>edit</i>
            </button>
            <button class="primary clear" @click="deleteRow(props)">
              <i>delete</i>
            </button>
          </template>
        </q-data-table>
      </div>

    </div>
  </div>
</template>

<script>
import { Platform, Utils, Toast, Loading, Dialog } from 'quasar'
// import table from './table.json'
import axios from 'axios'
import { appApiDomain, appPathUploadDomain } from '../config.js'

export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }
    this.loadInvestors()
  },
  methods: {
    goToAddInvestor () {
      this.$router.push('/add-investor')
    },
    tableToExcel (table, name, filename) {
      let uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p] }) }
      // alert('s')
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

      document.getElementById('dlink').href = uri + base64(format(template, ctx))
      document.getElementById('dlink').download = filename
      document.getElementById('dlink').click()
    },
    loadInvestors () {
      Loading.show()
      // console.log('aaa')
      let data = new FormData()
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/investor-list?token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
          (response) => {
            Loading.hide()
            // console.log(response.data)
            this.table = response.data.data
          }
        )
        .catch(
          (error) => console.log(error)
        )
    },
    viewInvestorDetail (id) {
      this.$router.push('/view-investor/' + id)
    },
    updateStatusInvestorByUsername (varUsername, varStatus) {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      // console.log(data)
      Dialog.create({
        title: 'Warning',
        message: 'Please confirm this with your password',
        form: {
          password: {
            type: 'password',
            label: 'Confirm Password',
            model: ''
          }
        },
        buttons: [
          {
            label: 'Cancel',
            handler () {
              Toast.create('Action cancelled!')
            }
          },
          {
            label: 'Ok',
            preventClose: true,
            handler: (data, close) => {
              // console.log(data.password.length)
              if (data.password.length > 0) {
                let formdata = new FormData()
                formdata.append('password', data.password)
                axios.post(appApiDomain + 'admin/confirmUserPassword?&token=' + token,
                  formdata,
                  {
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                  })
                  .then(
                  (response) => {
                    if (response.data.status === 'Valid') {
                      let formdata = new FormData()
                      formdata.append('username', varUsername)
                      formdata.append('status', varStatus)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/updateStatusInvestorByUsername?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            this.loadInvestors()
                            if (response.data.status === 'Succesfully Deleted') {
                              Toast.create.positive(response.data.status)
                            }
                            else {
                              Toast.create.negative(response.data.status)
                            }
                          })
                        }
                        )
                        .catch(
                        (error) => console.log(error)
                        )
                    }
                    else {
                      Toast.create.negative('Incorrect Password!')
                    }
                  }
                  )
                  .catch(
                  (error) => console.log(error)
                  )
              }
              else {
                Toast.create('Please enter your password to continue!')
              }
            }
          }
        ]
      })
    },
    changeMessage (props) {
      props.rows.forEach(row => {
        row.data.message = 'Quasar Framework rocks!'
      })
      Toast.create('Changed "Message" field for selected row(s).')
    },
    deleteRow (props) {
      props.rows.forEach(row => {
        this.table.splice(row.index, 1)
      })
    },
    refresh (done) {
      this.timeout = setTimeout(() => {
        this.loadInvestors()
      }, 1000)
    }
  },
  beforeDestroy () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
  data () {
    return {
      table: [],
      config: {
        title: 'List of Investors',
        refresh: true,
        columnPicker: true,
        bodyStyle: {
          maxHeight: Platform.is.mobile ? '50vh' : '500px'
        },
        rowHeight: '50px',
        responsive: true,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        },
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        }
      },
      columns: [
        {
          label: 'Picture',
          field: 'picture',
          format (value) {
            return '<img class="responsive avatar small" src="' + appPathUploadDomain + value + '">'
          },
          width: '30px'
        },
        {
          label: 'UserName',
          field: 'username',
          filter: true,
          sort: 'string',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '50px'
        },
        {
          label: 'Name',
          field: 'name',
          filter: true,
          sort: 'string',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '80px'
        },
        {
          label: 'Birthday',
          field: 'bday',
          filter: true,
          sort: 'date',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '60px'
        },
        // {
        //   label: 'Date Created',
        //   field: 'datecreated',
        //   width: '60px',
        //   filter: true,
        //   sort: 'date',
        //   format (value) {
        //     return new Date(value).toLocaleString()
        //   }
        // },
        {
          label: 'CreatedBy',
          field: 'createdby',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '80px'
        },
        {
          label: 'Action',
          field: 'action',
          format (value) {
            return value
          },
          width: '80px'
        }
      ],

      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 500
    }
  },
  watch: {
    pagination (value) {
      if (!value) {
        this.oldPagination = Utils.clone(this.config.pagination)
        this.config.pagination = false
        return
      }

      this.config.pagination = this.oldPagination
    },
    rowHeight (value) {
      this.config.rowHeight = value + 'px'
    },
    bodyHeight (value) {
      let style = {}
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = value + 'px'
      }
      this.config.bodyStyle = style
    },
    bodyHeightProp (value) {
      let style = {}
      if (value !== 'auto') {
        style[value] = this.bodyHeight + 'px'
      }
      this.config.bodyStyle = style
    }
  }
}
</script>
