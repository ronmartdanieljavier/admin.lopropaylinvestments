<template>
  <div class="layout-padding">
    <!-- <div class="row sm-column no-wrap small-gutter justify-stretch content-center">
      <div class="auto">    
        <button class="raised primary" @click="changeDateRange('Daily')">Daily</button>
        <button class="raised primary" @click="changeDateRange('Weekly')">Weekly</button>
        <button class="raised primary" @click="changeDateRange('Bi-Weekly')">Bi-Weekly</button>
        <button class="raised primary" @click="changeDateRange('Montly')">Monthly</button>
        <button class="raised primary" @click="changeDateRange('Yearly')">Yearly</button>
      </div>
    </div> -->
    <a id="dlink"  style="display:none;"></a>
    <div class="shadow-1 bg-red-4 text-white" style="padding: 1em;">
      <h5>{{ reportType }} Report</h5>
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="caption">Type of Report</p>
          <!-- Single Selection using List -->
          <q-select
            type="list"
            v-model="select"
            :options="selectOptions"
          ></q-select>
        </div>
      </div>
      <br/>
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="caption">Date range</p>
          <q-datetime-range type="date" v-model="first.range" :min="first.min" :max="first.max" />
          <br>
          <button class="raised primary" @click.prevent="generateReport()">Generate Report</button>
        </div>
      </div>
    </div>
    <br/>
    <div id="report-0" v-show="report0" class="shadow-1 bg-blue-4 text-white" style="padding: 1em;">
      <button class="primary raised" @click="tableToExcel('tableListOfInvestors', 'tableListOfInvestors', 'tableListOfInvestors.xls')">Export TO Excel</button>
      <br/>
      <br/>
      <table id="tableListOfInvestors" class="full-width">
        <thead>
          <tr><td colspan="6" align="center"><span class="caption">Investor List</span></td></tr>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Principal</th>
            <th>Start Date</th>
            <th>Date Created</th>
            <th>Created by</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="principalReportListD in principalReportList" :key="principalReportListD.username">
            <td>{{ principalReportListD.username }}</td>
            <td>{{ principalReportListD.fullname }}</td>
            <td>{{ principalReportListD.principal }}</td>
            <td>{{ principalReportListD.principal_date }}</td>
            <td>{{ principalReportListD.datecreated }}</td>
            <td>{{ principalReportListD.createdby }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="report-1" v-show="report1" class="shadow-1 bg-blue-4 text-white" style="padding: 1em;">
      <button class="primary raised" @click="tableToExcel('tableListOfPayouts', 'tableListOfPayouts', 'tableListOfPayouts.xls')">Export TO Excel</button>
      <br/>
      <br/>
      <table id="tableListOfPayouts" class="full-width">
        <thead>
          <tr><td colspan="7" align="center"><span class="caption">Payout List</span></td></tr>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Principal</th>
            <th>Payout Date</th>
            <th>Payout Amount</th>
            <th>Released Date</th>
            <th>Released By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payoutReportListD in payoutReportList" :key="payoutReportListD.username">
            <td>{{ payoutReportListD.username }}</td>
            <td>{{ payoutReportListD.fullname }}</td>
            <td>{{ payoutReportListD.principal }}</td>
            <td>{{ payoutReportListD.payout_date }}</td>
            <td>{{ payoutReportListD.payout_amount }}</td>
            <td>{{ payoutReportListD.released_date }}</td>
            <td>{{ payoutReportListD.released_by }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { Loading } from 'quasar'
import { appApiDomain } from '../config.js'
export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      report0: false,
      report1: false,
      reportType: 'Investment',
      first: {
        range: {
          from: moment(new Date()).format(),
          to: moment(new Date()).format()
        }
      },
      select: '1',
      selectOptions: [
        {
          id: '0',
          label: 'Principal Report',
          value: '0'
        },
        {
          id: '1',
          label: 'Payout Report',
          value: '1'
        },
        {
          id: '2',
          label: 'Investor Report',
          value: '2'
        }
      ],
      principalReportList: [],
      payoutReportList: []
    }
  },
  methods: {
    generateReport () {
      if (this.select === '0') {
        this.report0 = true
        const startDate = this.first.range.from
        const endDate = this.first.range.to
        const token = localStorage.getItem('token')
        let data = new FormData()
        Loading.show()
        data.append('startDate', startDate)
        data.append('endDate', endDate)
        axios.post(appApiDomain + 'admin/investorPrincipalList?token=' + token,
          data,
          {
            headers: {'X-Requested-With': 'XMLHttpRequest'}
          })
          .then(
            (response) => {
              Loading.hide()
              this.principalReportList = response.data.data
            }
          )
          .catch(
            (error) => console.log(error)
          )
      }
      else if (this.select === '1') {
        this.report1 = true
        const startDate = this.first.range.from
        const endDate = this.first.range.to
        const token = localStorage.getItem('token')
        let data = new FormData()
        Loading.show()
        data.append('startDate', startDate)
        data.append('endDate', endDate)
        axios.post(appApiDomain + 'admin/investorPayoutList?token=' + token,
          data,
          {
            headers: {'X-Requested-With': 'XMLHttpRequest'}
          })
          .then(
            (response) => {
              Loading.hide()
              this.payoutReportList = response.data.data
            }
          )
          .catch(
            (error) => console.log(error)
          )
      }
    },
    changeDateRange (report) {
      this.reportType = report
      switch (report) {
        case 'Daily':
          this.first = {
            range: {
              from: moment(new Date()).format(),
              to: moment(new Date()).format()
            }
          }
          break
        case 'Weekly':
          this.first = {
            range: {
              from: moment(new Date()).format(),
              to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(1, 'week').format()
            }
          }
          break
        case 'Bi-Weekly':
          this.first = {
            range: {
              from: moment(new Date()).format(),
              to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(2, 'week').format()
            }
          }
          break
        case 'Monthly':
          this.first = {
            range: {
              from: moment(new Date()).format(),
              to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(1, 'month').format()
            }
          }
          break
        case 'Yearly':
          this.first = {
            range: {
              from: moment(new Date()).format(),
              to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(1, 'year').format()
            }
          }
          break
      }
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
    }
  }
}
</script>
