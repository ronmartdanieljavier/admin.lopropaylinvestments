<template>
  <div class="layout-view">
      <div class="logo-container">
        <div class="card" style="max-width: 600px;">
          <form>
            <div class="card-title bg-primary text-white">
              <div class="list">
                <div class="item">
                  <div class="item-content has-secondary">ADMIN LOGIN</div>
                  <i class="item-secondary text-white">security</i>
                </div>
              </div>
            </div>
            <div class="card-content list no-border highlight">
              <div class="item two-lines">
                <i class="item-primary">account_circle</i>
                <div class="item-content">
                  <input type="text" name="username" v-model="username" placeholder="Username" />
                </div>
              </div>
              <div class="item two-lines">
                <i class="item-primary">lock</i>
                <div class="item-content">
                  <input type="password" name="password" v-model="password" placeholder="Password" />
                </div>
              </div>
              
            </div>
            <div class="card-actions card-no-top-padding">
              
              <div class="auto"></div>
              <button type="submit" @click.prevent="signin" class="primary clear small"><i class="on-left">send</i> LOGIN</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import {apiLogin} from '../config.js'
import { Toast, Loading } from 'quasar'
export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token) {
      this.bus.$emit('showDrawers', 1)
      this.$router.push('/admin-portal')
    }
    else {
      this.bus.$emit('hideDrawers', 1)
    }
    Loading.hide()
  },
  data () {
    return {
      username: '',
      password: '',
      AuthChecker: false
    }
  },
  methods: {
    signin () {
      Loading.show()
      axios.post(apiLogin,
          {username: this.username, password: this.password},
          {headers: {'X-Requested-With': 'XMLHttpRequest'}})
          .then(
            (response) => {
              Loading.hide()
              console.log(response.data)
              const token = response.data.token
              // const base64Url = token.split('.')[1]
              // const base64 = base64Url.replace('-', '+').replace('_', '/')
              // console.log(JSON.parse(window.atob(base64)))
              localStorage.setItem('token', token)
              this.bus.$emit('showDrawers', 1)
              Toast.create.positive('Login Successfully!')
              this.$router.push('/admin-portal')
            }
          )
          .catch(
            (error) => {
              console.log(error.response.data.error)
              Loading.hide()
              Toast.create.negative(error.response.data.error)
            }
          )
    }
  }
}
</script>


<style lang="stylus">
.logo-container
  width auto
  height auto
  perspective 800px
  position absolute
  top 50%
  left 50%
  transform translateX(-50%) translateY(-50%)
.logo
  position absolute
  transform-style preserve-3d
</style>
