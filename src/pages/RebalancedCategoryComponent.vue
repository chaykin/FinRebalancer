<template>
  <tr class='categoryRow'>
    <td colspan='2'>
      {{ levelMark + ' ' + item.name }}
    </td>
    <td>
      {{ formatNumber(item.value) }}
    </td>
    <td>
      {{ formatNumber(item.targetPercent) }}
    </td>
    <td>
      {{ formatNumber(item.percent) }}
    </td>
    <td>
      {{formatNumber(item.value - item.targetValue) }}
    </td>
  </tr>
  <tr v-for='securityRow in item.rebalancedSecurityItems' :key='securityRow.security.code'
      :title='securityRow.security.fullName'>
    <td>
      {{ securityRow.security.code }}
    </td>
    <td>
      {{ securityRow.security.shortName }}
    </td>
    <td>
      {{ formatNumber(securityRow.currentValue) }}
    </td>
    <td>
      -
    </td>
    <td>
      {{ formatNumber(securityRow.currentPercent) }}
    </td>
    <td>
      -
    </td>
  </tr>
  <rebalanced-category-component v-for='category in item.children' :key='category.name'
                                 :item='category' :level="level+1"></rebalanced-category-component>
</template>

<script lang='ts'>
import {defineComponent} from 'vue';
import {RebalancedCategory} from 'src/finance/Rebalancer';
import {formatNumber} from 'src/util/FormatterUtil';

export default defineComponent({
  name: 'RebalancedCategoryComponent',
  props: {
    item: RebalancedCategory,
    level: {
      type: Number,
      default: 0
    }
  },
  computed: {
    levelMark() {
      let mark = '';
      for (let i = 0; i < this.level; i++) {
        mark += '●';
      }
      return mark;
    }
  },
  methods: {
    formatNumber
  }
});
</script>

<style scoped>
.categoryRow {
  font-weight: bold;
}
</style>
