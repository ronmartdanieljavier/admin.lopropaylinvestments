import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`components/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    { path: '/', component: load('Index') }, // Default
    { path: '/admin-portal', component: load('AdminPortal') }, // Admin Portal
    { path: '/add-investor', component: load('AddInvestor') }, // Add Investors
    { path: '/investor-list', component: load('InvestorList') }, // Investors list
    { path: '/payouts', component: load('Payouts') }, // payouts
    { path: '/reports', component: load('Reports') }, // report
    { path: '/expenses', component: load('Expenses') }, // report
    { path: '/cash-advance', component: load('CashAdvance') }, // report
    { path: '/loans', component: load('Loans') }, // report
    { path: '/system-setting', component: load('SystemSettings') }, // system setting
    { path: '/view-investor/:username', component: load('ViewInvestor'), props: true }, // Investors list
    { path: '/payouts/:id/:payoutdate', component: load('FinalPayout'), props: true }, // Investors list
    { path: '/investor-payout/:username', component: load('PayoutInvestor'), props: true }, // Investors list
    { path: '/changepassword', component: load('ChangePassword') }, // system setting
    { path: '*', component: load('Error404') } // Not found
  ]
})
