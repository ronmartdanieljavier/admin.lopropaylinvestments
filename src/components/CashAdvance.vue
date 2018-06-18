<template>
  <div class="layout-padding">
    <div class="shadow-1" style="padding: 1em;">
      <h5>Add Cash Advance</h5>
      <form>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="stacked-label">
                <input v-model="name" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('name') }" name="name" type="text" placeholder="">
                <label>Name</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('name')" class="help text-negative">{{ errors.first('name') }}</small>
              </div>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="">
              <q-datetime v-validate="'required'" class="full-width" v-model="cash_advance_date" name="cash_advance_date" type="date" placeholder="Date" required></q-datetime>  
              <small v-show="errors.has('cash_advance_date')" class="help text-negative">{{ errors.first('cash_advance_date') }}</small>
            </div>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <input v-model="cash_advance_amount" v-validate="{ rules: { required: true,regex: /^\d+(\.\d{1,2})?$/} }" :class="{'full-width input': true, 'is-danger': errors.has('cash_advance_amount') }" name="cash_advance_amount" type="text" placeholder="Amount">
            <small v-show="errors.has('cash_advance_amount')" class="help text-negative">{{ errors.first('cash_advance_amount') }}</small>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <button class="raised primary pull-right" @click.prevent="saveCashAdvance()">Add Cash Advance</button>
          </div>
        </div>
      </form>
    </div>
    <br/>
    <div id="report-0" class="shadow-1" style="padding: 1em;">
      <h5>List Of Cash Advance</h5>
      <a id="dlink"  style="display:none;"></a>
      <button class="primary raised" @click="tableToExcel('tableCashAdvance', 'tableCashAdvance', 'tableCashAdvance.xls')">Export TO Excel</button>
      <br>
      <br>
      <table id="tableCashAdvance" class="hidden">
        <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>DateCreated</th>
          <th>Created By</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="dataTable in table" :key="dataTable.id">
          <td>{{ dataTable.ca_fullname }}</td>
          <td>{{ dataTable.ca_date }}</td>
          <td>{{ dataTable.ca_amount }}</td>
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
          <button class="primary raised red" @click="deleteCashAdvance(cell)">Delete</button>
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
    this.loadCashadvance()
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      name: '',
      cash_advance_amount: 0,
      cash_advance_date: moment(new Date()).format(),
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
          label: 'Name',
          field: 'ca_fullname',
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
          label: 'Date',
          field: 'ca_date',
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
          field: 'ca_amount',
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
    deleteCashAdvance (rowData) {
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
                      axios.post(appApiDomain + 'admin/deleteCashAdvance?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadCashadvance()
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
    saveCashAdvance () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          let fullname = this.name
          let cashAdvanceDate = this.cash_advance_date
          let cashAdvanceAmount = this.cash_advance_amount
          let data = new FormData()
          data.append('fullname', fullname)
          data.append('cash_advance_date', cashAdvanceDate)
          data.append('cash_advance_amount', cashAdvanceAmount)
          axios.post(appApiDomain + 'admin/addCashAdvance?token=' + token,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(
              (response) => {
                Loading.hide()
                console.log(response.data)
                this.name = ''
                this.cash_advance_amount = 0
                Toast.create.positive(response.data.message)
                this.loadCashadvance()
              }
            )
            .catch(
              (error) => console.log(error)
            )
        }
      })
    },
    loadCashadvance () {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      let data = new FormData()
      axios.get(appApiDomain + 'admin/loadCashAdvance?token=' + token,
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
