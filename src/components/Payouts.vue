<template>
  <div>
    <div class="layout-padding">
      <div class="row sm-column no-wrap small-gutter justify-stretch content-center">
        <div class="auto">    
          <div class="card bg-red text-white">
            <div class="card-title">
              TOTAL PAYOUTS
            </div>
            <div class="card-content pull-right">
              <h5>{{ totalCount }}</h5>
            </div>
          </div>
        </div>
        <div class="auto">    
          <div class="card bg-blue text-white">
            <div class="card-title">
              TOTAL AMOUNT
            </div>
            <div class="card-content pull-right">
              <h5>₱{{ totalAmount }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="shadow-up-3" style="padding: .5em;">
        <h5>List of Payouts</h5>
        <table class="q-table full-width bordered highlight cell-delimiter responsive text-small">
          <thead>
            <tr>
            <th class="text-center">Username</th>
            <th class="text-center">Name</th>
            <th class="text-center">Payout Date</th>
            <th class="text-center">Amount</th>
            <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in payoutList" :key="data.id">
              <td data-th="Username" class="text-center">{{ data.username }}</td>
              <td data-th="Name" class="text-center">{{ data.name }}</td>
              <td data-th="Payout Date" class="text-center">{{ data.payout_date }}</td>
              <td data-th="Amount" class="text-center">₱{{ numberWithCommas(data.amount) }}</td>
              <td data-th="Action" class="text-center">                      
                <button class="raised primary" @click="goToPayout(data.username,data.payout_date)">Payout</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br/>
      <div class="shadow-1 bg-brown-6 text-white" style="padding: 1em;">
        <h5>Manual Payout</h5>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <p class="caption">Date range</p>
            <q-datetime-range type="date" v-model="first.range" :min="first.min" :max="first.max" />
            <br>
            <button class="raised primary" @click.prevent="triggerManualPayouts()">Trigger Payout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { Loading, Dialog, Toast } from 'quasar'
import axios from 'axios'
import { appApiDomain } from '../config.js'

export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
      Loading.hide()
    }
    this.loadCurrentPayouts()
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      payoutList: [],
      totalCount: 0,
      totalAmount: 0,
      first: {
        range: {
          from: moment(new Date()).format(),
          to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(1, 'month').format()
        }
      }
    }
  },
  methods: {
    loadCurrentPayouts () {
      Loading.show()
      const token = localStorage.getItem('token')
      let data = new FormData()
      axios.get(appApiDomain + 'admin/loadCurrentPayouts?token=' + token,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(
          (response) => {
            Loading.hide()
            this.payoutList = response.data.payout
            // console.log()
            this.totalCount = response.data.payout.length
            this.totalAmount = 0
            this.payoutList.forEach(function (element) {
              this.totalAmount = this.totalAmount + parseInt(element['amount'])
            }, this)
            this.totalAmount = this.numberWithCommas(this.totalAmount)
            // console.log(response.data)
            // this.loadInvestorByUsername()
            // this.basicToast()
          }
        )
        .catch(
          (error) => console.log(error)
        )
    },
    goToPayout (id, payoutDate) {
      this.$router.push('/payouts/' + id + '/' + payoutDate)
    },
    numberWithCommas (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    triggerManualPayouts () {
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
                      const startDate = this.first.range.from
                      const endDate = this.first.range.to
                      const token = localStorage.getItem('token')
                      let data = new FormData()
                      Loading.show()
                      data.append('principalId', this.id)
                      data.append('startDate', startDate)
                      data.append('endDate', endDate)
                      axios.post(appApiDomain + 'admin/triggerALLManualPayouts?token=' + token,
                        data,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                          (response) => {
                            close(() => {
                              // Toast.create.positive(response.data.message)
                              this.loadCurrentPayouts()
                              Loading.hide()
                              if (response.data.message === 'Manual Trigger Finished!') {
                                Toast.create.positive(response.data.message)
                              }
                              else {
                                Toast.create.negative(response.data.message)
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
//      console.log(this.$route.params.username, startDate, endDate)
    }
  }
}
</script>
