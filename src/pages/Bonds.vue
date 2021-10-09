<template>
  <table border='1' cellspacing='0' cellpadding='5'>
    <tr>
      <th>Короткий код</th>
      <th>Наименование</th>
      <th>Тип</th>
      <th>Номинал</th>
      <th>Цена</th>
      <th>Дней до погашения</th>
      <th>Валюта</th>
      <th>Доходность, %</th>
    </tr>
    <tr v-for="item in secData" :key="item.security.code" :title="item.security.fullName">
      <td>
        <a :href='`https://www.moex.com/ru/issue.aspx?board=${item.security.boardId}&code=${item.security.code}`'>
          {{item.security.code}}
        </a>
      </td>
      <td>{{ item.security.shortName }}</td>
      <td>{{ item.security.typeName }}</td>
      <td>{{ item.security.faceValue }}</td>
      <td>{{ item.security.price }}</td>
      <td>{{ item.security.daysToRedemption }}</td>
      <td>{{ item.security.currencyId }}</td>
      <td>{{ formatNumber(item.profit) }}</td>
    </tr>
  </table>
</template>

<script lang='ts'>
import {defineComponent, onMounted, ref} from 'vue';
import {BondsSecurityFetcher} from '../moexapi/fetchers/BondsSecurityFetcher';
import {PromiseResult, PromiseUtil} from 'src/util/PromiseUtil';
import {Security} from 'src/finance/Security';
import {formatNumber} from 'src/util/FormatterUtil';

export default defineComponent({
  name: 'Bonds',
  setup() {
    let secData = ref<{ security: Security, profit: number }[]>([]);

    onMounted(() => {
      new BondsSecurityFetcher().fetchBonds()
        .then(sps => PromiseUtil.allSettled(sps))
        .then(results => {
          const calcProfit = (security: Security): number => {

            const fullPrice = security.price + security.accuredInterest;
            const income = security.faceValue + security.bondization;
            let profit = income - fullPrice;
            if (profit > 0) {
              profit *= (1 - 0.13) // 13% tax
            }
            const profitPercent = profit / fullPrice;
            const r = 100.0 * profitPercent * 365.0 / security.daysToRedemption;

            console.log(`code: ${security.code}. Profit: ${r}. ${JSON.stringify(security)}`);
            return r;
          }

          const dataFactory = (security: Security): { security: Security, profit: number } => {
            return {
              security:security,
              profit: calcProfit(security)
            }
          }

          secData.value = results
            .filter(r => r.status === PromiseResult.FULFILLED)
            .map(r => r.value)
            .filter((r): r is Security => r != undefined)
            .filter(r => r.price > 0 && r.daysToRedemption <= 850)
            .map(r => dataFactory(r))
            .filter(d => d.profit > 3.5)
            .sort((a, b) => b.profit - a.profit)

          console.log('Done!!')
        })
        .catch(e => console.log(e));
    });

    return {secData};
  },
  methods: {
    formatNumber
  }
});
</script>

<style scoped>

</style>
