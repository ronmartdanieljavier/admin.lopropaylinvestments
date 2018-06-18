<template>
  <q-layout>
      <div slot="header" class="toolbar">
        <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
          <i>menu</i>
        </button>
        <q-toolbar-title :padding="1">
          Lo Propayl Investment System
        </q-toolbar-title>
        <!-- <button @click="$refs.rightDrawer.open()">
          <i>assignment</i>
        </button> -->
        <button v-show="authChecker" class="primary big pull-right" @click="logout">
            <i class="on-left">first_page</i>
            Logout
          </button>
      </div>

      <q-tabs slot="navigation" v-show="authChecker">
        <q-tab icon="dashboard" route="/admin-portal" exact replace>Dashboard</q-tab>
        <q-tab icon="monetization_on" route="/payouts" replace>Payouts</q-tab>
        <q-tab icon="equalizer" route="/reports" replace>Reports</q-tab>
        <q-tab icon="layers" route="/investor-list" replace>Investors</q-tab>
        <!-- <q-tab class="pull-right" icon="sign_out" route="" replace>Logout</q-tab> -->
      </q-tabs>

      <q-drawer ref="leftDrawer" v-show="authChecker">
        <div class="toolbar light">
          <q-toolbar-title :padding="1">
              <button class="circular small primary clear"><i>account_circle</i></button>
              {{ fullname }}
          </q-toolbar-title>
        </div>
        <div class="list">
          <q-drawer-link icon="dashboard" to="/admin-portal" exact>
            Dashboard
          </q-drawer-link>
          <q-drawer-link icon="monetization_on" to="/payouts" exact>
            Payouts
          </q-drawer-link>
          <q-drawer-link icon="equalizer" to="/reports" exact>
            Reports
          </q-drawer-link>
          <!-- <q-drawer-link icon="view_quilt" to="/showcase/layout" exact>
            Profile
          </q-drawer-link> -->
          <hr>
          <q-collapsible icon="layers" label="Investors">
            <q-drawer-link icon="add" to="/add-investor">
            Add Investor
            </q-drawer-link>
            <q-drawer-link icon="list" to="/investor-list">
            Investor List
            </q-drawer-link>
          </q-collapsible>
          <q-collapsible icon="account_balance" label="Other Records">
            <q-drawer-link icon="shopping_cart" to="/expenses">
            Expenses
            </q-drawer-link>
            <q-drawer-link icon="attach_money" to="/cash-advance">
            Cash Advance
            </q-drawer-link>
            <q-drawer-link icon="casino" to="/loans">
            Loans
            </q-drawer-link>
          </q-collapsible>
          <!-- <q-collapsible icon="perm_identity" label="Second">
            <q-drawer-link icon="build" to="/showcase/layout/toolbar">
            Toolbar
            </q-drawer-link>
          </q-collapsible>
          <q-collapsible icon="shopping_cart" label="Third">
            <q-drawer-link icon="build" to="/showcase/layout/toolbar">
            Toolbar
            </q-drawer-link>
          </q-collapsible> -->
        </div>
        <div class="list no-border platform-delimiter">
          <div class="list-label">Settings</div>
          <q-drawer-link icon="settings" to="/system-setting">
            Principal Setting
          </q-drawer-link>

          <q-drawer-link icon="settings" to="/changepassword">
            Change Password
          </q-drawer-link>
          <!-- <button class="primary big pull-right" @click="logout">
            <i class="on-left">first_page</i>
            Logout
          </button> -->
          
        </div> 
      </q-drawer>

      <!-- <router-view class="layout-view"></router-view> -->

      <div id="q-app" style="overflow: auto;width: 100% !important">
        <div class="row">
          <router-view class="layout-view"></router-view>
        </div>
        
      </div>
    

      <q-drawer right-side swipe-only ref="rightDrawer">
        <div class="toolbar light">
          <q-toolbar-title :padding="1">
              Right-side Drawer
          </q-toolbar-title>
        </div>

        <p style="padding: 25px;" class="text-grey-7">
          This is yet another Drawer that does not gets displayed alongside content on
          bigger screens.
        </p>
      </q-drawer>

      
    </q-layout>




  <!-- Don't drop "q-app" class -->
  
</template>

<script>
import axios from 'axios'
import {apiGetAuthDetail} from 'config.js'
import { Toast } from 'quasar'

export default {
  mounted () {
    const token = localStorage.getItem('token')
    if (token === '') {
      this.bus.$emit('hideDrawers', 1)
      this.$router.push('/')
    }
    else {
      this.bus.$emit('showDrawers', 1)
    }
    loadAuthDetails(token)
    axios.get(apiGetAuthDetail + '?token=' + token,
          {token: token},
          {headers: {'X-Requested-With': 'XMLHttpRequest'}})
          .then(
            (response) => {
              // console.log(response.data.user.fname)
              // localStorage.setItem('user', response.data.user)
              this.fullname = response.data.user.fname + ' ' + response.data.user.lname
            }
          )
          .catch(
            () => {
              localStorage.setItem('token', '')
              this.$router.push('/')
            }
          )
    // localStorage.setItem('token', '')
  },
  methods: {
    logout () {
      localStorage.setItem('token', '')
      this.fullname = ''
      this.authChecker = false
      Toast.create.info('Thank you!')
      this.$router.push('/')
    }
  },
  data () {
    return {
      fullname: '',
      authChecker: false
    }
  },
  created () {
    this.bus.$on('showDrawers', () => {
      this.authChecker = true
      const token = localStorage.getItem('token')
      axios.get(apiGetAuthDetail + '?token=' + token,
          {token: token},
          {headers: {'X-Requested-With': 'XMLHttpRequest'}})
          .then(
            (response) => {
              // console.log(response.data.user.fname)
              // localStorage.setItem('user', response.data.user)
              this.fullname = response.data.user.fname + ' ' + response.data.user.lname
            }
          )
          .catch(
            () => {
              localStorage.setItem('token', '')
              this.$router.push('/')
            }
          )
    })
    this.bus.$on('hideDrawers', () => {
      this.authChecker = false
    })
  }
}
function loadAuthDetails (token) {
}
</script>

<style></style>
