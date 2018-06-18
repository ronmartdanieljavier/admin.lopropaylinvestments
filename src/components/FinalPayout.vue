<template>
  <div class="layout-padding">
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="group">
            <button class="dark raised" @click="back()"><i>keyboard_backspace</i>Back</button>
            <button class="primary raised pull-right" @click.prevent="printElem('print')"><i>print</i>PRINT</button>
          </p>
        </div>
      </div>
      <div id="print">
        <div class="shadow-1" style="padding: 1em;">
          <h5>Payout Details</h5>
          <table width="100%">
            <tr>
              <td rowspan="3" align="" width="40%">
                <img v-bind:src="appPathDefaultPicture" class="responsive" style="width: 200px;">
              </td>
              <td width="30%">
                <p class="caption">Username</p>
                <span class="label bg-primary text-white shadow-1">{{ username }}</span>
              </td>
              <td width="30%">
                <p class="caption">Name</p>
                <span class="label bg-primary text-white shadow-1">{{ first_name + ' ' + last_name }}</span>
              </td>
            </tr>
            <tr>
              <!-- <td></td> -->
              <td width="30%">
                <p class="caption">Birthday</p>
                <span class="label bg-primary text-white shadow-1">{{ birthday }}</span>
              </td>
              <td width="30%">
                <p class="caption">Gender</p>
                <span class="label bg-primary text-white shadow-1">{{ gender }}</span>
              </td>
            </tr>
            <tr>
              <!-- <td></td> -->
              <td width="30%">
                <p class="caption">Email</p>
                <span class="label bg-primary text-white shadow-1">{{ email }}</span>
              </td>
              <td width="30%">
                <p class="caption">Contact Number</p>
                <span class="label bg-primary text-white shadow-1">{{ contactNo }}</span>
              </td>
            </tr>
          </table>
          
          
          <!-- <div class="row sm-column no-wrap justify-stretch content-center">
            <div class="auto content-center">
              <img v-bind:src="appPathDefaultPicture" class="responsive" style="width: 200px;">
            </div>
          </div> -->
          <!-- <div class="row sm-column no-wrap justify-stretch content-center">
            <div class="auto">
              <div class="">
                <p class="caption">Username</p>
                <span class="label bg-primary text-white shadow-1">{{ username }}</span>
              </div>
              <br/>
              <div class="">
                <p class="caption">Name</p>
                <span class="label bg-primary text-white shadow-1">{{ first_name + ' ' + last_name }}</span>
              </div>
              <br/>
              <div class="">
                <p class="caption">Birthday</p>
                <span class="label bg-primary text-white shadow-1">{{ birthday }}</span>
              </div>
            </div>
            <div class="auto">
              <div class="">
                <p class="caption">Gender</p>
                <span class="label bg-primary text-white shadow-1">{{ gender }}</span>
              </div>
              <br/>
              <div class="">
                <p class="caption">Email</p>
                <span class="label bg-primary text-white shadow-1">{{ email }}</span>
              </div>
              <br/>
              <div class="">
                <p class="caption">Contact Number</p>
                <span class="label bg-primary text-white shadow-1">{{ contactNo }}</span>
              </div>
            </div>
          </div> -->
          <br>
          <div class="row sm-column no-wrap justify-stretch content-center bg-grey text-black shadow-1">
            <div class="auto">
              <table class="q-table full-width reponsive" width="100%">
                <thead>
                  <tr>
                    <th class="text-left" align="center">Principal</th>
                    <th class="text-right" align="center">Payout Date</th>
                    <th class="text-right" align="center">Payout Amount</th>
                    <th class="text-right" align="center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dataPrin in payoutHeader" :key="dataPrin.payout_date">
                    <td class="text-left" align="center">₱{{ numberWithCommas(dataPrin.principal) }}</td>
                    <td class="text-right" align="center">{{ dataPrin.payout_date }}</td>
                    <td class="text-right" align="center">₱{{ numberWithCommas(dataPrin.payoutAmount) }}</td>
                    <td class="text-right" align="center">{{ dataPrin.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        <br>
        <div class="shadow-1" style="padding: 1em;">
          <h5>Payout Details</h5>
          <div class="row sm-column no-wrap justify-stretch content-center">
            <div class="auto">
              <table class="q-table responsive full-width" width="100%">
                <thead>
                <tr>
                  <th class="text-left" align="center">Date</th>
                  <th class="text-right" align="center">Growth Month Rate</th>
                  <th class="text-right" align="center">Proccess Type</th>
                  <th class="text-left" align="center">Payout Amount</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="payoutsListData in payoutList" :key="payoutsListData.id">
                  <td class="text-left" align="center">{{ payoutsListData.xdate }}</td>
                  <td class="text-right" align="center">{{ payoutsListData.monthly_growth }}%</td>
                  <td class="text-right" align="center">{{ payoutsListData.process_type }}</td>
                  <td class="text-right" align="right">₱{{ numberWithCommas(payoutsListData.daily_growth_amount) }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <br/>
      <button class="red raised pull-right" @click="payoutInvestorById('0')">Unpayout</button>
      <button class="primary raised " @click="payoutInvestorById('1')">Payout</button>


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
    // console.log(this.$route.params.payoutdate)
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
      id: this.$route.params.id,
      principalList: [],
      payoutList: [],
      payoutHeader: [],
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
      this.$router.push('/investor-payout/' + this.id)
    },
    basicToast () {
      Toast.create.positive('Update Successfully!')
    },
    goToPayout () {
      this.$router.push('/payouts/' + this.id)
    },
    loadPayoutsByPrincipalId () {
      let data = new FormData()
      Loading.show()
      data.append('principalId', this.id)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadInvestorByPrincipalIdByPaydate?id=' + this.$route.params.id + '&paydate=' + this.$route.params.payoutdate + '&token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
            (response) => {
              this.payoutList = response.data.payoutList
              this.payoutHeader = response.data.payoutHeader
              Loading.hide()
            }
        )
        .catch(
            (error) => console.log(error)
        )
    },
    triggerManualPayouts () {
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
            Toast.create.positive(response.data.message)
            this.loadInvestorByUsername()
            Loading.hide()
          }
        )
        .catch(
          (error) => console.log(error)
        )
//      console.log(this.$route.params.username, startDate, endDate)
    },
    loadInvestorByUsername () {
      let data = new FormData()
      Loading.show()
      data.append('username', this.$route.params.id)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadInvestorByPrincipalId?id=' + this.$route.params.id + '&token=' + token,
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
          data.append('username', this.$route.params.id)
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
    payoutInvestorById (status) {
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
                      let username = this.username
                      let principalId = this.id
                      let payoutDate = this.$route.params.payoutdate

                      let formdata = new FormData()
                      formdata.append('username', username)
                      formdata.append('principalId', principalId)
                      formdata.append('payoutDate', payoutDate)
                      formdata.append('status', status)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/payoutInvestorById?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            this.loadInvestorByUsername()
                            this.loadPayoutsByPrincipalId()
                            if (response.data.status === 'Payout Successful') {
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
    checkPassword (password) {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      let formdata = new FormData()
      formdata.append('password', password)
      axios.post(appApiDomain + 'admin/confirmUserPassword?&token=' + token,
        formdata,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
        (response) => {

        }
        )
        .catch(
        (error) => console.log(error)
        )
    },
    numberWithCommas (x) {
      x = parseFloat(x).toFixed(2)
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    printElem (elem) {
      var mywindow = window.open('', 'PRINT', 'height=400,width=600')
      // mywindow.document.write('<html><head><title>' + document.title  + '</title>');
      mywindow.document.write('<html><body >')
      // mywindow.document.write('<h1>' + document.title  + '</h1>');
      mywindow.document.write(document.getElementById(elem).innerHTML)
      mywindow.document.write('</body></html>')

      mywindow.document.close() // necessary for IE >= 10
      mywindow.focus() // necessary for IE >= 10*/

      mywindow.print()
      mywindow.close()

      return true
    }
  }
}
</script>
