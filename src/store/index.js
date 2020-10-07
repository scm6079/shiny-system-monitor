import { createStore } from 'vuex'

const state = {
    loading: false,
    errorMsg: '',
    monitor: {}
}

const actions = {
    refresh ({ commit }) {
        commit('loading', true);
        commit('errorMsg', '');
        fetch('https://httpbin.org/get')
            .then(async response => {
                commit('loading', false);

                const data = await response.json();
                if (!response.ok) {
                    // get error message from body or default to response statusText
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
                commit('refresh', data);
            })
            .catch(error => {
                commit('errorMsg', error);
                console.error("Error loading system monitor JSON. ", error);
            });
    },
}

const mutations = {
    loading( state, isLoading ) {
        state.loading = isLoading;
    },
    errorMsg( state, message ) {
        state.errorMsg = message;
    },
    refresh (state, data) {
        state.monitor = data;
    },
}

export default createStore({
    state,
    actions,
    mutations
})
