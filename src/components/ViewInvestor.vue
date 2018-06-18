<template>
  <div class="layout-padding">
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="group">
            <button class="dark raised" @click="back()"><i>keyboard_backspace</i>Back</button>
            <!-- <button class="negative raised pull-right"><i>cancel</i>Inactive</button> -->
            <!-- <button class="primary raised pull-right"><i>print</i>PRINT</button> -->
          </p>
        </div>
      </div>
      <form data-vv-scope="form-1">
        <div class="shadow-1" style="padding: 1em;">
          <p class="caption">Update Investor Details</p>
          <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter justify-stretch content-center"> 
            <div class="auto">
              <!-- <input type="file"/> -->
              <label for="accountPicture">
                  <img v-bind:src="appPathDefaultPicture" class="responsive" style="">
              </label>
              <input class="hidden" @change="processFile($event)" id="accountPicture" name="accountPicture" type="file" placeholder="" data-content="Upload Product Picture" accept=".gif,.jpg,.jpeg,.png">
              <!-- <button class="small primary" for="accountPicture"><i>add</i>Picture</button> -->
            </div>
            <div class="full-width auto">
              <div class="">
                <label>Username: </label>
                <span class="label bg-positive text-white">{{ username }}</span>
                <br>
                <br>
              </div>
              <div class="stacked-label">
                <input v-model="first_name" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('first_name') }" name="first_name" type="text" placeholder="">
                <label>First Name</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('first_name')" class="help text-negative">{{ errors.first('first_name') }}</small>
              </div>
              <div class="stacked-label">
                <input v-model="middle_name" v-validate="''" :class="{'full-width input': true, 'is-danger': errors.has('middle_name') }" name="middle_name" type="text" placeholder="">
                <label>Middle Name</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('middle_name')" class="help text-negative">{{ errors.first('middle_name') }}</small>
              </div>
              <div class="stacked-label">
                <input v-model="last_name" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('last_name') }" name="last_name" type="text" placeholder="">
                <label>Last Name</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('last_name')" class="help text-negative">{{ errors.first('last_name') }}</small>
              </div>
              
              <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter" style="padding-top: 10px;">
                <div class="auto">
                  <div class="">
                    <q-datetime v-validate="'required'" class="full-width" v-model="birthday" name="birthday" type="date" placeholder="Birthday" required></q-datetime>  
                    <small v-show="errors.has('birthday')" class="help text-negative">{{ errors.first('birthday') }}</small>
                  </div>
                </div>
                <div class="auto">
                  <div class="">
                    <label>Gender</label>
                    <div class="group">
                      <label>
                        <q-radio v-model="gender" val="MALE"></q-radio>
                        MALE
                      </label>
                      <label>
                        <q-radio v-model="gender" val="FEMALE" class="pink"></q-radio>
                        FEMALE
                      </label>
                    </div>
                    
                  </div>
                  
                </div>
              </div>
              
            </div>
            
          </div>
          <!-- <div class="column is-12">
              <label class="label" for="email">Email</label>
              <p :class="{ 'control': true }">
                  <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="Email">
                  <small v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</small>
              </p>
          </div> -->
          <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter">
            <div class="auto">
              
              <div class="stacked-label">
                <input v-model="contact_number" v-validate="{ rules: { required: true,regex: /^([0-9]+)$/} }" :class="{'full-width input': true, 'is-danger': errors.has('contact_number') }" name="contact_number" type="text" placeholder="">
                <label>Contact Number</label>
                <small v-show="errors.has('contact_number')" class="help text-negative">{{ errors.first('contact_number') }}</small>
              </div>
              
              <div class="stacked-label">
                <input v-model="email" v-validate="'required|email'" :class="{'full-width input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="">
                <label>Email Address</label>
                <small v-show="errors.has('email')" class="help text-negative">{{ errors.first('email') }}</small>
              </div>
              
            </div>
          </div>
          <div class="row">
            <div class="auto">
              <button class="primary pull-right" @click.prevent="submitAddInvestor">UPDATE</button>
            </div>
            
          </div>
        </div>
        
        <br>
        <br>
        <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter">
          
          <div class="auto">
            <form data-vv-scope="form-2">
              <p class="caption">Add Principal</p>
              <div class="list bg-secondary">
                <div class="list-label">Principal Amount</div>
                <div class="item two-lines">
                  <i class="item-primary">attach_money</i>
                  <div class="item-content">
                    <input v-model="principal" v-validate="{ rules: { required: true,regex: /^\d+(\.\d{1,2})?$/} }" :class="{'full-width input': true, 'is-danger': errors.has('principal') }" name="principal" type="text" placeholder="">
                    <small v-show="errors.has('principal')" class="help text-negative">{{ errors.first('principal') }}</small>
                    
                  </div>
                  
                </div>
                <div class="list-label">Principal Date</div>
                  <div class="item two-lines">
                    <i class="item-primary"></i>
                    <div class="item-content">
                      <q-datetime v-validate="'required'" class="full-width" v-model="principalDate" name="principalDate" type="date" placeholder="Principal Date" required></q-datetime>  
                      <small v-show="errors.has('principalDate')" class="help text-negative">{{ errors.first('principalDate') }}</small>
                    </div>
                    <button class="primary raised pull-right" @click.prevent="addPrincipal()"><i>add</i>Add Principal</button>
                  </div>
              </div>
            </form>
          </div>
          
        </div>
        <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter">
          <div class="auto">
            <p class="caption">List of Principal</p> 
            <button class="raised primary" @click.prevent="combinePrincipal()">Combine ALL Principal to DAte</button>
            <q-datetime v-validate="'required'" class="" v-model="newPrincipalDate" name="newPrincipalDate" type="date" placeholder="New Principal Date" required></q-datetime>  
            <br/>
            <br/>
            <table class="q-table full-width bordered highlight cell-delimiter responsive text-small">
              <thead>
                  <tr>
                  <th class="text-center">Principal</th>
                  <th class="text-center">Principal Date</th>
                  <th class="text-center">Created By</th>
                  <th class="text-center">Action</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="data2 in principalList" :key="data2.id">
                      <td data-th="Principal" class="text-center">₱{{ numberWithCommas(data2.principal) }}</td>
                      <td data-th="Date Created" class="text-center">{{ data2.principal_date }}</td>
                      <td data-th="Created By" class="text-center">{{ data2.createdby }}</td>
                      <td data-th="Action" class="text-center">                      
                        <button class="raised secondary" @click.prevent="pulloutPrincipal( data2.id, data2.principal )">Pullout</button>
                        <button class="raised tertiary" @click.prevent="goToPayouts( data2.username )">View Payouts</button>
                        <button class="raised negative" @click.prevent="deletePrincipal( data2.id )">Remove</button>
                      </td>
                  </tr>
              </tbody>
              </table>
          </div>
        </div>
        
        <br>
        <br>
        <br>
      </form>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import { Toast, Loading, Dialog } from 'quasar'
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
  },
  data () {
    return {
      appPathDefaultPicture: appPathDefaultPicture,
      first_name: '',
      middle_name: '',
      last_name: '',
      birthday: '',
      newPrincipalDate: moment().format(),
      gender: '',
      contact_number: '',
      email: '',
      principal: '',
      username: this.$route.params.username,
      principalList: [],
      principalDate: ''
    }
  },
  methods: {
    back () {
      this.$router.push('/investor-list')
    },
    basicToast () {
      Toast.create.positive('Update Successfully!')
    },
    goToPayouts (id) {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      this.$router.push('/investor-payout/' + id)
    },
    formatDate (date) {
      var d = new Date(date)
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    pulloutPrincipal (getId, principal) {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      Dialog.create({
        title: 'Pullout / Partial Pullout',
        message: 'Please confirm this with your password',
        form: {
          principalAmount: {
            type: 'textbox',
            label: 'Principal',
            model: principal
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
              if (data.password.length > 0 && data.principalAmount > 0) {
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
                      formdata.append('principalId', getId)
                      formdata.append('principalAmount', data.principalAmount)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/pulloutPrincipal?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            // this.loadInvestors()
                            this.loadInvestorByUsername()
                            Toast.create.positive('Successfully Deleted')
                            // if (response.data.status === 'Succesfully Deleted') {
                            //   Toast.create.positive(response.data.status)
                            // }
                            // else {
                            //   Toast.create.negative(response.data.status)
                            // }
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
                Toast.create('Please enter your password and valid principal to continue!')
              }
            }
          }
        ]
      })
    },
    deletePrincipal (getId) {
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
                      formdata.append('principalId', getId)
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/deletePrincipal?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            // this.loadInvestors()
                            this.loadInvestorByUsername()
                            Toast.create.positive('Successfully Deleted')
                            // if (response.data.status === 'Succesfully Deleted') {
                            //   Toast.create.positive(response.data.status)
                            // }
                            // else {
                            //   Toast.create.negative(response.data.status)
                            // }
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
    combinePrincipal () {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      Dialog.create({
        title: 'Warning',
        message: 'Please confirm this with your password',
        form: {
          principalDate: {
            type: 'date',
            label: 'Confirm Password',
            model: ''
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
                      formdata.append('username', this.username)
                      formdata.append('newPrincipalDate', this.formatDate(this.newPrincipalDate))
                      // console.log(data)
                      axios.post(appApiDomain + 'admin/combineAllPrincalByUsername?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            // this.loadInvestors()
                            this.loadInvestorByUsername()
                            Toast.create.positive('Successfully Combined')
                            // if (response.data.status === 'Succesfully Deleted') {
                            //   Toast.create.positive(response.data.status)
                            // }
                            // else {
                            //   Toast.create.negative(response.data.status)
                            // }
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
    submitAddInvestor () {
      this.$validator.validateAll('form-1').then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          // console.log(new Date(this.birthday))
          let data = new FormData()
          data.append('picture', document.getElementById('accountPicture').files[0])
          data.append('firstName', this.first_name)
          data.append('middleName', this.middle_name)
          data.append('lastName', this.last_name)
          data.append('birthday', this.formatDate(this.birthday))
          data.append('gender', this.gender)
          data.append('contactNo', this.contact_number)
          data.append('email', this.email)
          data.append('username', this.$route.params.username)

          // axios.post('/Upload/File',data).then(function (response) {
          //     console.log(response.data);
          // });
          axios.post(appApiDomain + 'admin/update-investor?token=' + token,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(
              (response) => {
                Loading.hide()
                // console.log(response.data)
                this.loadInvestorByUsername()
                this.basicToast()
              }
            )
            .catch(
              (error) => console.log(error)
            )
          // console.log(result)
          // eslint-disable-next-line
          // alert('From Submitted!')
          // return
        }
        // alert('Correct them errors!')
      })
    },
    loadInvestorByUsername () {
      let data = new FormData()
      Loading.show()
      data.append('username', this.$route.params.username)
      const token = localStorage.getItem('token')
      axios.get(appApiDomain + 'admin/loadInvestorByUsername?username=' + this.$route.params.username + '&token=' + token,
        data,
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(
        (response) => {
          // console.log(response.data.data)
          this.appPathDefaultPicture = appPathUploadDomain + response.data.data.picture
          this.first_name = response.data.data.fname
          this.middle_name = response.data.data.mname
          this.last_name = response.data.data.lname
          this.birthday = response.data.data.bday
          this.gender = response.data.data.gender
          this.contact_number = response.data.data.contactNo
          this.email = response.data.data.email

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
          data.append('principalDate', this.formatDate(this.principalDate))
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
