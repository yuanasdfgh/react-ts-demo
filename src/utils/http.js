import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import router from "@/router";
import { formatParam } from "@/utils/assist";
import { refreshToken as refreshTokenApi } from "@/api/login.js";

let isRefresh = true;

const baseURL = process.env.VUE_APP_AXIOS_BASE_URL;

const conf = {
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15 * 1000,
};

const _axios = axios.create(conf);

_axios.interceptors.request.use(
    config => {
        const excludesApi = [`/oauth/login`];
        if (!excludesApi.includes(config.url)) {
            const stores = store;
            config.headers["Authorization"] = `Bearer ${stores.state.token}`;
        }
        if (config.method === "post") {
            const condition = [];
            if (config.data && config.data.param) {
                for (const i in config.data.param) {
                    condition.push({
                        column: i,
                        value: config.data.param[i],
                    });
                }
                config.data.condition = condition;
                delete config.data.param;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

function refreshToken(minute = 10) {
    const path = router.currentRoute.path;
    if (path === "/login") {
        return;
    }
    if (isRefresh) {
        isRefresh = false;
        return;
    }

    const state = store.state;
    const expires = state.expires;
    const now = new Date().getTime();
    if (now + 1000 * 60 * minute > expires) {
        const data = {
            refresh_token: state.refreshToken,
            grant_type: "refresh_token",
            client_id: "web",
            client_secret: "123456",
        };
        refreshTokenApi(data)
            .then(res => {
                if (res.status === 200) {
                    store.commit("token", res.data.access_token);
                    store.commit("refreshToken", res.data.refresh_token);
                    const expires = res.data.expires_in * 1000 + new Date().getTime();
                    store.commit("expires", expires);
                    isRefresh = false;
                } else {
                    isRefresh = false;
                }
            })
            .catch(() => {
                isRefresh = false;
            });
    }
}
const allowList = ["/oauth/oauth/token"];
_axios.interceptors.response.use(
    response => {
        const config = response.config;
        const url = config.url;

        refreshToken(30);

        if (!allowList.includes(url)) {
            if (response.status === 200) {
                return response.data;
            } else {
                return Promise.reject(response);
            }
        } else {
            return response;
        }
    },
    error => {
        const { response } = error;
        if (response) {
            const status = response.status;
            if (status === 500) {
                Message.error("服务端异常");
            }
            if (status === 401) {
                if (store.state.toastCount === 1) {
                    Message.error("登陆失效，跳转到登陆界面");
                    store.commit("toastCount", 2);
                }
                store.commit("isLogin", false);
                router.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);

const get = (url, params, config) => {
    const conf = config || {};
    Object.assign(conf, {
        url,
        params,
        method: "get",
    });
    return _axios(conf);
};

const put = (url, params, config) => {
    const conf = config || {};
    return _axios.put(url, params, conf);
};

const post = (url, data, config = {}) => {
    if (config.format === undefined) {
        config.format = true;
    }

    Object.assign(config, {
        data: config.format ? formatParam(data) : data,
        url,
        method: "post",
    });
    return _axios(config);
};

const del = (url, params, config) => {
    const conf = config || {};
    return _axios.delete(url, params, conf);
};

export { _axios, get, post, put, del, baseURL };
