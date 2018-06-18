<template>
  <div class="layout-padding">
    <div class="shadow-1" style="padding: 1em;">
      <h5>Add Expenses</h5>
      <form>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="stacked-label">
                <input v-model="description" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('description') }" name="description" type="text" placeholder="">
                <label>Expenses Description</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('description')" class="help text-negative">{{ errors.first('description') }}</small>
              </div>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="">
              <q-datetime v-validate="'required'" class="full-width" v-model="expensesDate" name="expensesDate" type="date" placeholder="Expense Date" required></q-datetime>  
              <small v-show="errors.has('expensesDate')" class="help text-negative">{{ errors.first('expensesDate') }}</small>
            </div>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <input v-model="expensesAmount" v-validate="{ rules: { required: true,regex: /^\d+(\.\d{1,2})?$/} }" :class="{'full-width input': true, 'is-danger': errors.has('expensesAmount') }" name="expensesAmount" type="text" placeholder="Expenses Amount">
            <small v-show="errors.has('expensesAmount')" class="help text-negative">{{ errors.first('expensesAmount') }}</small>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <button class="raised primary pull-right" @click.prevent="saveExpense()">Add Expense</button>
          </div>
        </div>
      </form>
    </div>
    <br/>
    <div id="report-0" class="shadow-1" style="padding: 1em;">
      <h5>List Of Expenses</h5>
      <a id="dlink"  style="display:none;"></a>
      <button class="primary raised" @click="tableToExcel('tableExpenses', 'tableExpenses', 'tableExpenses.xls')">Export TO Excel</button>
      <br>
      <br>
      <table id="tableExpenses" class="hidden">
        <thead>
        <tr>
          <th>Expenses Desc</th>
          <th>Expenses Date</th>
          <th>Expenses Amount</th>
          <th>DateCreated</th>
          <th>Created By</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="dataTable in table" :key="dataTable.id">
          <td>{{ dataTable.expenses_desc }}</td>
          <td>{{ dataTable.expenses_date }}</td>
          <td>{{ dataTable.expenses_amount }}</td>
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
        <template slot="col-action" scope="cell">
          <button class="primary raised red" @click="deleteExpense(cell)">Delete</button>
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
    this.loadExpenses()
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      description: '',
      expensesAmount: 0,
      expensesDate: moment(new Date()).format(),
      table: [],
      config: {
        title: 'List of Expenses',
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
          label: 'Description',
          field: 'expenses_desc',
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
          label: 'Expense Date',
          field: 'expenses_date',
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
          label: 'Expense Amount',
          field: 'expenses_amount',
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
          label: 'Date Created',
          field: 'datecreated',
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
    deleteExpense (rowData) {
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
                      formdata.append('expenseId', rowData.row.id)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/deleteExpense?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadExpenses()
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
    saveExpense () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          let expensesDescription = this.description
          let expensesDate = this.expensesDate
          let expensesAmount = this.expensesAmount
          let data = new FormData()
          data.append('expensesDescription', expensesDescription)
          data.append('expensesDate', expensesDate)
          data.append('expensesAmount', expensesAmount)
          axios.post(appApiDomain + 'admin/addExpense?token=' + token,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(
              (response) => {
                Loading.hide()
                console.log(response.data)
                this.description = ''
                this.expensesAmount = 0
                Toast.create.positive(response.data.message)
                this.loadExpenses()
              }
            )
            .catch(
              (error) => console.log(error)
            )
        }
      })
    },
    loadExpenses () {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      let data = new FormData()
      axios.get(appApiDomain + 'admin/loadExpenses?token=' + token,
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
