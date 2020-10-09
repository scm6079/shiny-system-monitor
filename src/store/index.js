import { createStore } from 'vuex'

const MONITOR_URL = 'http://192.168.144.18:8080/test-data.json';
//const MONITOR_URL = 'http://192.168.144.48:8085/data.json';

const HARDWARE_TYPE_MOTHERBOARD = "images_icon/mainboard.png";
const HARDWARE_TYPE_CPU = "images_icon/cpu.png";
const HARDWARE_TYPE_GPU = "images_icon/nvidia.png";
//const HARDWARE_TYPE_RAM = "images_icon/ram.png";
//const HARDWARE_TYPE_HDD = "images_icon/hdd.png"

const MONITOR_TYPE_TEMPERATURE = 'images_icon/temperature.png';
const MONITOR_TYPE_FAN = 'images_icon/fan.png';



const state = {
    loading: false,
    errorMsg: '',
    monitor: []
}

const actions = {
    refresh ({ commit }) {
        commit('loading', true);
        commit('errorMsg', '');
        fetch(MONITOR_URL)
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

const getters = {
    getNodeByHardwareType: (state) => (id) => {
        if( state.monitor && state.monitor.Children && state.monitor.Children.length ) {
            if( state.monitor.Children[0].Children && state.monitor.Children[0].Children.length ) {
                return state.monitor.Children[0].Children.find( item => item.ImageURL === id );
            }
        }
        return [];
    },
    cpuTemp: (state, getters) => {
        let cpuSpecs = getters.getNodeByHardwareType(HARDWARE_TYPE_CPU).Children;
        if( cpuSpecs && cpuSpecs.length ) {
            let tempSensors = cpuSpecs.find(item => item.ImageURL === MONITOR_TYPE_TEMPERATURE);
            if( tempSensors && tempSensors.Children && tempSensors.Children.length ) {
                let cpuTotal = tempSensors.Children.find( item => item.Text === 'CPU Package' );
                if( cpuTotal ) {
                    return cpuTotal.Value;
                }
            }
        }
        return 0;
    },
    gpuTemp: (state, getters) => {
        let gpuSpecs = getters.getNodeByHardwareType(HARDWARE_TYPE_GPU).Children;
        if( gpuSpecs && gpuSpecs.length ) {
            let tempSensors = gpuSpecs.find(item => item.ImageURL === MONITOR_TYPE_TEMPERATURE);
            if( tempSensors && tempSensors.Children && tempSensors.Children.length ) {
                let gpuTotal = tempSensors.Children.find( item => item.Text === 'GPU Core' );
                if( gpuTotal ) {
                    return gpuTotal.Value;
                }
            }
        }
        return 0;
    },
    fanSpeed: (state, getters) => {
        let mbSpecs = getters.getNodeByHardwareType(HARDWARE_TYPE_MOTHERBOARD).Children;
        if( mbSpecs && mbSpecs.length ) {
            let chip = mbSpecs[0];
            if( chip && chip.Children && chip.Children.length ) {
                let fanSensor = chip.Children.find(item => item.ImageURL === MONITOR_TYPE_FAN);
                if( fanSensor && fanSensor.Children && fanSensor.Children.length ) {
                    let primaryFan = fanSensor.Children.find( item => item.Text === 'Fan #2' );
                    if( primaryFan ) {
                        return primaryFan.Value;
                    }
                }
            }
        }
        return 0;
    },


    // ramTODO: (state, getters) => {
    //     return getters.getNodeByHardwareType(HARDWARE_TYPE_RAM);
    // },
    // fanTODO: (state, getters) => {
    //     return getters.getNodeByHardwareType(HARDWARE_TYPE_MOTHERBOARD);
    // },

}

export default createStore({
    state,
    actions,
    mutations,
    getters
})
