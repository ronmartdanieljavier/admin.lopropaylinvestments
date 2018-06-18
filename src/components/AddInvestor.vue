<template>
<div>
    <div class="layout-padding">
      <div class="row sm-column no-wrap justify-stretch content-center">
        <div class="auto">
          <p class="group">
            <button class="primary raised" @click="back()"><i>list</i>Investors List</button>
            <!--<button class="negative raised pull-right"><i>cancel</i>Inactive</button>-->
            <!--<button class="primary raised pull-right"><i>print</i>PRINT</button>-->
          </p>
        </div>
      </div>
      <form>
        <div class="shadow-up-5" style="padding: 1em;">
          <h5>Add Investors</h5>
          <p class="caption">Investor's Detail</p>
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
                <input v-model="contact_number" v-validate="{ rules: { regex: /^([0-9]+)$/} }" :class="{'full-width input': true, 'is-danger': errors.has('contact_number') }" name="contact_number" type="text" placeholder="">
                <label>Contact Number</label>
                <small v-show="errors.has('contact_number')" class="help text-negative">{{ errors.first('contact_number') }}</small>
              </div>
              
              <div class="stacked-label">
                <input v-model="email" v-validate="'email'" :class="{'full-width input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="">
                <label>Email Address</label>
                <small v-show="errors.has('email')" class="help text-negative">{{ errors.first('email') }}</small>
              </div>
              
            </div>
          </div>
          <div class="row sm-column no-wrap sm-small-gutter md-gutter gt-md-large-gutter">
            <div class="auto">
              <p class="caption">Investment Details</p>
              <div class="list">
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
                </div>
                <div class="list-label">Monthly Growth</div>
                <div class="item two-lines">
                  <i class="item-primary">trending_up</i>
                  <div class="item-content">
                    <input v-model="principalInterest" v-validate="{ rules: { required: true,regex: /^\d+(\.\d{1,2})?$/} }" :class="{'full-width input': true, 'is-danger': errors.has('principalInterest') }" name="principalInterest" type="text" placeholder="">
                    <small v-show="errors.has('principalInterest')" class="help text-negative">{{ errors.first('principalInterest') }}</small>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <button class="primary pull-right" @click.prevent="submitAddInvestor">SUBMIT</button>
          <br>
          <br>
          <br>
        
        </div>
        
      </form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { Toast, Loading } from 'quasar'

// import {appApiDomain} from '../config.js'
import {appApiDomain, appPathDefaultPicture} from '../config.js'
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
      appPathDefaultPicture: appPathDefaultPicture,
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: 'MALE',
      birthday: '',
      principalDate: '',
      contact_number: '',
      email: '',
      principal: '',
      principalInterest: '',
      minMaxModel: '2016-10-24T10:40:14.674Z',
      min: moment('2016-10-24T10:40:14.674Z').subtract(5, 'days').format(),
      max: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').format(),
      range: {
        start: moment('2016-10-24T10:40:14.674Z').subtract(3, 'days').format(),
        end: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'month').format(),
        min: moment('2016-10-24T10:40:14.674Z').subtract(3, 'days').format(),
        max: moment('2016-10-24T10:40:14.674Z').add(4, 'hours').add(10, 'minutes').add(1, 'month').format()// .add(1, 'month').add(1, 'year')
      }
    }
  },
  methods: {
    back () {
      this.$router.push('/investor-list')
    },
    basicToast () {
      Toast.create.positive('Successfully added!')
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
    submitAddInvestor () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          Loading.show()
          let data = new FormData()
          data.append('picture', document.getElementById('accountPicture').files[0])
          data.append('firstName', this.first_name)
          data.append('middleName', this.middle_name)
          data.append('lastName', this.last_name)
          data.append('birthday', this.formatDate(this.birthday))
          data.append('gender', this.gender)
          data.append('contactNo', this.contact_number)
          data.append('email', this.email)
          data.append('principal', this.principal)
          data.append('principalDate', this.formatDate(this.principalDate))
          data.append('principalInterest', this.principalInterest)

          // axios.post('/Upload/File',data).then(function (response) {
          //     console.log(response.data);
          // });
          axios.post(appApiDomain + 'admin/add-investor?token=' + token,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(
              (response) => {
                // console.log(response.data)
                this.basicToast()
                this.$router.push('/investor-list')
                // this.first_name = ''
                // this.middle_name = ''
                // this.last_name = ''
                // this.birthday = ''
                // this.gender = ''
                // this.contact_number = ''
                // this.email = ''
                // this.principal = ''
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
    processFile (event) {
      const tmppath = URL.createObjectURL(event.target.files[0])
      this.appPathDefaultPicture = tmppath
    }
  }
}
</script>
