/**
 * 基础路由
 * @type { *[] }
 * meta:{
 *      title:'首页' ,  //type:String   页面标题
 *      keepAlive：false, // type:Boolean 页面是否缓存 回退时 不会刷新页面
 *      needLogin:false , // type:Boolean  是否需要登录
 *      forbiddenAnimation:false,//type:Boolean 是否加转场动画
 *      tabbarShow: true // 需要显示 底部导航
 * }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false,
      needLogin: false
    },
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index'),
        meta: { title: 'Login', keepAlive: false, tabbarShow: true }
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false, tabbarShow: true }
      },
      {
        path: '/about',
        name: 'Home',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      },
      {
        path: '/activity',
        name: 'Activity',
        component: () => import('@/views/activity/index'),
        meta: { title: 'Activity', keepAlive: false, needLogin: false, tabbarShow: true }
      },
      {
        path: '/recharge',
        name: 'Recharge',
        component: () => import('@/views/recharge/index'),
        meta: { title: 'Recharge', keepAlive: false, needLogin: false, tabbarShow: true }
      },
      {
        path: '/my',
        name: 'My',
        component: () => import('@/views/my/index'),
        meta: { title: 'My', keepAlive: false, needLogin: false, tabbarShow: true }
      },
      {
        path: '/my/withdrawal',
        name: 'Withdrawal',
        component: () => import('@/views/my/withdrawal/index'),
        meta: { title: 'Withdrawal', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/transaction-record',
        name: 'TransactionRecord',
        component: () => import('@/views/my/transaction-record/index'),
        meta: { title: 'TransactionRecord', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center',
        name: 'AgencyCenter',
        component: () => import('@/views/my/agency-center/index'),
        meta: { title: 'AgencyCenter', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center/agent-report',
        name: 'AgentReport',
        component: () => import('@/views/my/agency-center/agent-report/index'),
        meta: { title: 'AgentReport', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center/subordinate-report',
        name: 'Subordinatereport',
        component: () => import('@/views/my/agency-center/subordinate-report/index'),
        meta: { title: 'Subordinatereport', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center/member-management',
        name: 'MemberManagement',
        component: () => import('@/views/my/agency-center/member-management/index'),
        meta: { title: 'MemberManagement', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center/betting-information',
        name: 'BettingInformation',
        component: () => import('@/views/my/agency-center/betting-information/index'),
        meta: { title: 'BettingInformation', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/agency-center/transaction-details',
        name: 'TransactionDetails',
        component: () => import('@/views/my/agency-center/transaction-details/index'),
        meta: { title: 'BettingInformation', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/announcement',
        name: 'Announcement',
        component: () => import('@/views/my/announcement/index'),
        meta: { title: 'Announcement', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/my-orders',
        name: 'MyOrders',
        component: () => import('@/views/my/my-orders/index'),
        meta: { title: 'Announcement', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/my-bank-card',
        name: 'MyBankCard',
        component: () => import('@/views/my/my-bank-card/index'),
        meta: { title: 'MyBankCard', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/account-security',
        name: 'AccountSecurity',
        component: () => import('@/views/my/account-security/index'),
        meta: { title: 'AccountSecurity', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/account-security/login-password',
        name: 'LoginPassword',
        component: () => import('@/views/my/account-security/login-password/index'),
        meta: { title: 'LoginPassword', keepAlive: false, needLogin: false }
      },
      {
        path: '/my/account-security/payment-password',
        name: 'PaymentPassword',
        component: () => import('@/views/my/account-security/payment-password/index'),
        meta: { title: 'PaymentPassword', keepAlive: false, needLogin: false }
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/public/404'),
    meta: { title: '404', keepAlive: true, needLogin: false }
  }
]
