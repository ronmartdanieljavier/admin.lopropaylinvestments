<template>
  <div class="layout-padding">
    <div class="row sm-column no-wrap small-gutter justify-stretch content-center">
      <div class="auto">    
        <div class="card bg-red text-white">
          <div class="card-title">
            TOTAL PENDING PAYOUTS
          </div>
          <div class="card-content pull-right">
            <h5>{{ totalPayoutCount }}</h5>
          </div>
        </div>
      </div>
      <div class="auto">    
        <div class="card bg-pink text-white">
          <div class="card-title">
            TOTAL PENDING PAYOUT AMOUNT
          </div>
          <div class="card-content pull-right">
            <h5>₱{{ totalPayoutAmount }}</h5>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row sm-column no-wrap small-gutter justify-stretch content-center">
      <div class="auto">
        <div class="card bg-purple text-white">
          <div class="card-title">
            TODAY'S PAYOUT COUNT
          </div>
          <div class="card-content pull-right">
            <h5>{{ totalTodayPayoutCount }}</h5>
          </div>
        </div>
      </div>
      <div class="auto">
        <div class="card bg-deep-purple text-white">
          <div class="card-title">
            TODAY'S PAYOUT AMOUNT 
          </div>
          <div class="card-content pull-right">
            <h5>₱{{ totalTodayPayoutAmount }}</h5>
          </div>
        </div>
      </div>
      
    </div>
    <div class="row sm-column no-wrap small-gutter justify-stretch content-center">
      <div class="auto">
        <div class="card bg-blue text-white">
          <div class="card-title">
            TOTAL PRINCIPAL AMOUNT
          </div>
          <div class="card-content pull-right">
            <h5>₱{{ totalPrincipalAmount }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Loading } from 'quasar'
// import {appApiDomain} from '../config.js'
import { appApiDomain } from '../config.js'

export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }

    this.loadDashboard()
    // localStorage.setItem('token', '')
  },
  data () {
    return {
      totalPayoutCount: 0,
      totalPayoutAmount: 0,
      totalTodayPayoutCount: 0,
      totalTodayPayoutAmount: 0,
      totalPrincipalAmount: 0
    }
  },
  methods: {
    loadDashboard () {
      let data = new FormData()
      Loading.show()
      data.append('username', this.$route.params.username)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadDashboard?token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
        (response) => {
          Loading.hide()
          // console.log(response.data.data)
          this.totalPayoutCount = response.data.totalPayoutCount
          this.totalPayoutAmount = this.numberWithCommas(response.data.totalPayoutAmount)
          this.totalTodayPayoutCount = response.data.totalTodayPayoutCount
          this.totalTodayPayoutAmount = this.numberWithCommas(response.data.totalTodayPayoutAmount)
          this.totalPrincipalAmount = this.numberWithCommas(response.data.totalPrincipal)
        }
        )
        .catch(
        (error) => console.log(error)
        )
    },
    numberWithCommas (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
