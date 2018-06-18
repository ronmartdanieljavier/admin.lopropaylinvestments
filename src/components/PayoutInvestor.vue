<template>
  <div class="layout-padding">
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="group">
            <button class="dark raised" @click="back()"><i>keyboard_backspace</i>Back</button>
            <!-- <button class="primary raised pull-right"><i>print</i>PRINT</button> -->
          </p>
        </div>
      </div>
      <div class="shadow-1 bg-brown text-white" style="padding: 1em;">
        <h5>Payout Details</h5>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto content-center">
            <img v-bind:src="appPathDefaultPicture" class="responsive" style="width: 200px;">
          </div>
        </div>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="">
              <p class="caption">Username</p>
              <span class="label bg-secondary text-white shadow-1">{{ username }}</span>
            </div>
            <br/>
            <div class="">
              <p class="caption">Name</p>
              <span class="label bg-secondary text-white shadow-1">{{ first_name + ' ' + last_name }}</span>
            </div>
            <br/>
            <div class="">
              <p class="caption">Birthday</p>
              <span class="label bg-secondary text-white shadow-1">{{ birthday }}</span>
            </div>
          </div>
          <div class="auto">
            <div class="">
              <p class="caption">Gender</p>
              <span class="label bg-secondary text-white shadow-1">{{ gender }}</span>
            </div>
            <br/>
            <div class="">
              <p class="caption">Email</p>
              <span class="label bg-secondary text-white shadow-1">{{ email }}</span>
            </div>
            <br/>
            <div class="">
              <p class="caption">Contact Number</p>
              <span class="label bg-secondary text-white shadow-1">{{ contactNo }}</span>
            </div>
          </div>
        </div>
        <br>
        <div class="row sm-column no-wrap justify-stretch content-center bg-grey text-black shadow-1">
          <div class="auto">
            <table class="q-table full-width reponsive">
              <thead>
                <tr>
                  <th class="text-left">Principal</th>
                  <th class="text-right">Principal Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dataPrin in principalList" :key="dataPrin.id">
                  <td class="text-left">₱{{ numberWithCommas(dataPrin.principal) }}</td>
                  <td class="text-right">{{ dataPrin.principal_date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
      <br>
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

      <br>
      <div class="shadow-1 bg-brown-5 text-white" style="padding: 1em;">
        <h5>Payout List</h5>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <table class="q-table responsive full-width">
              <thead>
              <tr>
                <th class="text-left">Principal</th>
                <th class="text-right">Days</th>
                <th class="text-right">TOTAL PAYOUT</th>
                <th class="text-left">Payout Date</th>
                <th class="text-left">Status</th>
                <th class="text-left">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="payoutsListData in payoutsList" :key="payoutsListData.payout_date">
                <td class="text-left">₱{{ numberWithCommas(payoutsListData.principal) }}</td>
                <td class="text-right">{{ payoutsListData.days }}</td>
                <td class="text-right">₱{{ numberWithCommas(payoutsListData.payoutAmount) }}</td>
                <td class="text-right">{{ payoutsListData.payout_date }}</td>
                <td class="text-left">{{ payoutsListData.status }}</td>
                <td class="text-left">
                  <button class="raised primary" @click="goToPayout(payoutsListData.payout_date)">View</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
</template>
<script>
// import moment from 'moment'
import axios from 'axios'
import { Toast, Loading, Dialog } from 'quasar'
import moment from 'moment'
// import {appApiDomain} from '../config.js'
import { appApiDomain, appPathDefaultPicture, appPathUploadDomain } from '../config.js'
export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }
    Loading.show()
    this.loadInvestorByUsername()
    this.loadPayoutsByPrincipalId()
  },
  data () {
    return {
      appPathDefaultPicture: appPathDefaultPicture,
      first_name: '',
      middle_name: '',
      last_name: '',
      birthday: '',
      gender: '',
      contact_number: '',
      email: '',
      principal: '',
      username: '',
      contactNo: '',
      id: this.$route.params.username,
      principalList: [],
      payoutsList: [],
      first: {
        range: {
          from: moment(new Date()).format(),
          to: moment(new Date()).add(4, 'hours').add(10, 'minutes').add(1, 'month').format()
        }
      }
    }
  },
  methods: {
    back () {
      this.$router.push('/view-investor/' + this.username)
    },
    basicToast () {
      Toast.create.positive('Update Successfully!')
    },
    goToPayout (payoutDate) {
      this.$router.push('/payouts/' + this.id + '/' + payoutDate)
    },
    loadPayoutsByPrincipalId () {
      let data = new FormData()
      Loading.show()
      data.append('principalId', this.id)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadPayoutsByPrincipalId?id=' + this.$route.params.username + '&token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
            (response) => {
              this.payoutsList = response.data.payout
              Loading.hide()
            }
        )
        .catch(
            (error) => console.log(error)
        )
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
                      axios.post(appApiDomain + 'admin/triggerManualPayouts?token=' + token,
                        data,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                          (response) => {
                            close(() => {
                              // Toast.create.positive(response.data.message)
                              this.loadInvestorByUsername()
                              this.loadPayoutsByPrincipalId()
                              Loading.hide()
                              if (response.data.status === 'Manual Trigger Finished!') {
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
//      console.log(this.$route.params.username, startDate, endDate)
    },
    loadInvestorByUsername () {
      let data = new FormData()
      Loading.show()
      data.append('username', this.$route.params.username)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadInvestorByPrincipalId?id=' + this.$route.params.username + '&token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
        (response) => {
//          console.log(response.data.data)
          this.appPathDefaultPicture = appPathUploadDomain + response.data.data.picture
          this.first_name = response.data.data.fname
          this.middle_name = response.data.data.mname
          this.last_name = response.data.data.lname
          this.birthday = response.data.data.bday
          this.gender = response.data.data.gender
          this.contact_number = response.data.data.contactNo
          this.email = response.data.data.email
          this.username = response.data.data.username
          this.contactNo = response.data.data.contactNo
          this.principalList = response.data.principalList
          Loading.hide()
        }
        )
        .catch(
        (error) => console.log(error)
        )
    },
    addPrincipal () {
      this.$validator.validateAll('form-2').then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          let data = new FormData()
          data.append('username', this.$route.params.username)
          data.append('principal', this.principal)
          axios.post(appApiDomain + 'admin/addPrincipalByUsername?&token=' + token,
            data,
            {
              headers: {'X-Requested-With': 'XMLHttpRequest'}
            })
            .then(
            (response) => {
              this.principal = ''
              Loading.hide()
              this.loadInvestorByUsername()
            }
            )
            .catch(
            (error) => console.log(error)
            )
        }
      })
    },
    processFile (event) {
      const tmppath = URL.createObjectURL(event.target.files[0])
      this.appPathDefaultPicture = tmppath
    },
    numberWithCommas (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
