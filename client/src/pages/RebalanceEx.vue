<template>
  <ul>
    <li v-for='row in portfolios' :key='row.code'>{{ row.name + ' (' + row.code + ')' }}</li>
  </ul>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import BackendDataProvider from 'src/backendapi/BackendDataProvider';

export default defineComponent({
  name: 'RebalanceEx',
  setup() {
    let portfolios = ref<{ code: string, name: string }[]>([]);

    const dataProvider = new BackendDataProvider();
    onMounted(() => {
      dataProvider.fetchPortfolioList()
        .then(r => portfolios.value.push(...r))
        .catch(e => console.log(e));
    });

    return { portfolios };
  }
});
</script>

