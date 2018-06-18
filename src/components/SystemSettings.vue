<template>
  <div class="layout-padding">
    
    <div id="report-0" class="shadow-1" style="padding: 1em;">
      <h5>Principal Settings</h5>
      <a id="dlink"  style="display:none;"></a>
      <button class="primary raised" @click="tableToExcel('tablePrincipalSettings', 'tablePrincipalSettings', 'tablePrincipalSettings.xls')">Export TO Excel</button>
      <br>
      <br>
      <table id="tablePrincipalSettings" class="hidden">
        <thead>
        <tr>
          <th>Username</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Growth per Month</th>
          <th>DateCreated</th>
          <th>Created By</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="dataTable in table" :key="dataTable.id">
          <td>{{ dataTable.username }}</td>
          <td>{{ dataTable.fullname }}</td>
          <td>{{ dataTable.principal }}</td>
          <td>{{ dataTable.monthly_growth }}</td>
          <td>{{ dataTable.created_at }}</td>
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
        <template slot="col-action" scope="cell">
          <button class="primary raised green" @click="updatePrincipal(cell)">Update</button>
        </template>
      </q-data-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { Platform, Utils, Toast, Loading, Dialog } from 'quasar'
import { appApiDomain } from '../config.js'

export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }
    Loading.show()
    this.loadPrincipal()
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      name: '',
      loanAmount: 0,
      loanDate: moment(new Date()).format(),
      table: [],
      config: {
        title: 'Principal Settings',
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
          label: 'Username',
          field: 'username',
          filter: true,
          sort: 'string',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            // return value
            return '<span class="label bg-primary text-white shadow-1">' + value + '</span>'
          },
          width: '80px'
        },
        {
          label: 'Name',
          field: 'fullname',
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
          label: 'Amount',
          field: 'principal',
          filter: true,
          sort: 'date',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          width: '80px'
        },
        {
          label: 'Growth per Month',
          field: 'monthly_growth',
          filter: true,
          sort: 'date',
          format (value) {
            return value + '%'
          },
          width: '80px'
        },
        {
          label: 'Date Created',
          field: 'created_at',
          width: '120px',
          filter: true,
          sort: 'date',
          format (value) {
            return new Date(value).toLocaleString()
          }
        },
        {
          label: 'CreatedBy',
          field: 'createdby',
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
  methods: {
    updatePrincipal (rowData) {
      // console.log(data.row.id)
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }

      Dialog.create({
        title: 'Update Principal',
        message: 'Please confirm this with your password',
        form: {
          principal: {
            type: 'numeric',
            label: 'Principal Monthly Growth Rate',
            model: 15,
            min: 1,
            max: 100
          },
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
              if (data.password.length > 0 && data.principal > 0) {
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
                      formdata.append('id', rowData.row.id)
                      formdata.append('principalGrowth', data.principal)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/updatePrincipal?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadPrincipal()
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
    paidLoan (rowData) {
      // console.log(data.row.id)
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }

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
              console.log(data.password.length)
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
                      formdata.append('id', rowData.row.id)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/paidLoan?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadPrincipal()
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
    unPaidLoan (rowData) {
      // console.log(data.row.id)
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }

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
              console.log(data.password.length)
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
                      formdata.append('id', rowData.row.id)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/unPaidLoan?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadPrincipal()
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
    saveLoan () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          let fullname = this.name
          let cashAdvanceDate = this.loanDate
          let cashAdvanceAmount = this.loanAmount
          let data = new FormData()
          data.append('fullname', fullname)
          data.append('loanDate', cashAdvanceDate)
          data.append('loanAmount', cashAdvanceAmount)
          axios.post(appApiDomain + 'admin/addLoan?token=' + token,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(
              (response) => {
                Loading.hide()
                console.log(response.data)
                this.name = ''
                this.loanAmount = 0
                Toast.create.positive(response.data.message)
                this.loadPrincipal()
              }
            )
            .catch(
              (error) => console.log(error)
            )
        }
      })
    },
    loadPrincipal () {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      let data = new FormData()
      axios.get(appApiDomain + 'admin/loadPrincipal?token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
          (response) => {
            Loading.hide()
            console.log(response.data)
            this.table = response.data.data
          }
        )
        .catch(
          (error) => console.log(error)
        )
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
