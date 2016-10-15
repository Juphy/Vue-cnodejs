import Vue from 'vue';
import $ from 'webpack-zepto';
import VueRouter from 'vue-router';
import filters from './filters';
import routes from './routers';
import Alert from './libs/alert';
import FastClick from 'fastclick';
Vue.use(VueRouter);
Vue.use(Alert);

$.ajaxSettings.crossDomain = true;

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 实例化VueRouter
const router = new VueRouter({
    mode: 'history',
    routes
});
FastClick.attach(document.body);

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    // 处理左侧滚动不影响右边
    $('html, body, #page').removeClass('scroll-hide');

    if (to.matched.some(record => record.requiresAuth)) {
        if (localStorage.userId) {
            next();
        } else {
            console.log(to.fullPath);
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }
    } else {
        console.log(to.fullPath);
        next();
    }
});

new Vue({
    router
}).$mount('#app');