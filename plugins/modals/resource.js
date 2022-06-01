import Vue from 'vue'
import Resource from '@/components/modals/resource/Resource'


export default ({store,app: { $axios,$cookies}}) => {
    let instance
    if (!instance) {
        const ResourceConstructor = Vue.extend(Resource)
        instance = new ResourceConstructor({store,$axios,$cookies})
        instance.$mount(document.createElement('div'))
        document.body.appendChild(instance.$el)
    }
    Vue.prototype.$Resource = instance.confirm
    return instance
}
