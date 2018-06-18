<template>
  <div class="layout-padding">
    <div class="shadow-1" style="padding: 1em;">
      <h5>Change Password</h5>
      <form>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="stacked-label">
                <input v-model="newpassword" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('newpassword') }" name="newpassword" type="password" placeholder="">
                <label>New Password</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('newpassword')" class="help text-negative">{{ errors.first('newpassword') }}</small>
              </div>
          </div>
        </div>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <div class="stacked-label">
                <input v-model="confirmNewPassword" v-validate="'required'" :class="{'full-width input': true, 'is-danger': errors.has('confirmNewPassword') }" name="confirmNewPassword" type="password" placeholder="">
                <label>Confirm New Password</label>
                <!-- <small>The first_name field is required.</small> -->
                <small v-show="errors.has('confirmNewPassword')" class="help text-negative">{{ errors.first('confirmNewPassword') }}</small>
              </div>
          </div>
        </div>
        <br/>
        <br/>
        <div class="row sm-column no-wrap justify-stretch content-center">
          <div class="auto">
            <button class="raised primary pull-right" @click.prevent="changePassword()">Change Password</button>
          </div>
        </div>
      </form>
    </div>
    <br/>
    
  </div>
</template>

<script>
// import moment from 'moment'
import axios from 'axios'
import { Utils, Toast, Loading, Dialog } from 'quasar'
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
      newpassword: '',
      confirmNewPassword: ''
    }
  },
  methods: {
    deleteLoan (rowData) {
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
                      axios.post(appApiDomain + 'admin/deleteLoan?&token=' + token,
                        formdata,
                        {
                          headers: {'X-Requested-With': 'XMLHttpRequest'}
                        })
                        .then(
                        (response) => {
                          close(() => {
                            Loading.show()
                            Toast.create.positive('Successfuly Deleted!')
                            this.loadLoans()
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
                            this.loadLoans()
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
                            this.loadLoans()
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
    changePassword () {
      this.$validator.validateAll().then(result => {
        if (result) {
          const token = localStorage.getItem('token')
          if (token === '') {
            this.bus.$emit('hideDrawers', 1)
            this.$router.push('/')
          }
          if (!this.password === this.confirmNewPassword) {
            Toast.create.negative('Password and confirm password do not match!')
          }
          else {
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
                            Loading.show()
                            let data = new FormData()
                            data.append('newPassword', this.newpassword)
                            axios.post(appApiDomain + 'admin/changePassword?token=' + token,
                              data,
                              {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              })
                              .then(
                                (response) => {
                                  Loading.hide()
                                  close(() => {
                                    Toast.create.positive('Password Changed!')
                                    this.newpassword = ''
                                    this.confirmNewPassword = ''
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
          }
        }
      })
    },
    loadLoans () {
      const token = localStorage.getItem('token')
      if (token === '') {
        this.bus.$emit('hideDrawers', 1)
        this.$router.push('/')
      }
      let data = new FormData()
      axios.get(appApiDomain + 'admin/loadLoans?token=' + token,
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
