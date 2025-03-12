import FilterConfig from '@/components/filter-config/index.vue'
import CommonTable from '@/components/common-table/index.vue'
import CommonDiaLog from '@/components/common-dialog/index.vue'
import BasicFilterTableTemp from '@/components/basic-filter-table-temp/index.vue'
import ButtonGroup from '@/components/button-group/index.vue'

export default (App: any) => {
  App.component('BasicFilterTableTemp', BasicFilterTableTemp)
  App.component('FilterConfig', FilterConfig)
  App.component('CommonTable', CommonTable)
  App.component('CommonDiaLog', CommonDiaLog)
  App.component('ButtonGroup', ButtonGroup)
}
