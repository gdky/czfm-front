/**
 * Created by ming on 2016/5/19.
 */
import req from 'reqwest'
import config from './configuration'
import store from 'store2'
import md5  from 'crypto-js/md5'


const AUTH_URL = config.HOST + config.URI_API_FRAMEWORK + '/account';
module.exports = {
    verifyAuth(){
        let token = store.get("token") || store.session.get("token");
        const tokenhash = store.get("tokenhash") || store.session.get("tokenhash");
        if (token && tokenhash) {
            let last = token.substr(token.length - 1);
            token = md5(last + token);
            return (token.toString() == tokenhash);
        }
        return false;
    },

    verifyPermission(path){
        if (path == '/') {
            return true
        }else if (!store.session.get('permission')) {
            return false
        }else{
            return store.session.get('permission').indexOf(md5(path).toString()) != -1
        }
    },

    getToken(){
        return store.get("token") || store.session.get("token");
    },

    setToken(token, tokenhash, isRemember = false){
        if (isRemember) {
            store.set("token", token);
            store.set("tokenhash", tokenhash);
        }
        store.session.set("token", token);
        store.session.set("tokenhash", tokenhash);
    },

    logout(){
        store.clear();
        store.session.clear();
    },

    getAccount(){
        return req({
            url: AUTH_URL,
            method: 'get',
            type: 'json',
            headers: {'x-auth-token': this.getToken()}
        })
    },
    setAccount(param){
        window.acinfo = JSON.stringify({
            names:param.names,
            role:param.role,
            menu:param.menu
        })
    },

    setAuthorization(param){
        store.session.set('jid', param.jgId);
        window.acinfo = JSON.stringify({
            names:param.names,
            role:param.role,
            menu:param.menu
        })
    },
    getAuthorization(){
        if(window.acinfo){
            return JSON.parse(window.acinfo);
        }else{
            return false
        }
    },

    isClient(){
        return !!store.session.get('jid')
    },
    getJgid(){
        return store.get("jid") || store.session.get("jid");
    }


};