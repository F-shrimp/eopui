<template>
  <div>
    <h1>New Page</h1>
    <p>appname : {{ $route.params.appname }}</p>
    <p>appname : {{ $route.params.env }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null
    }
  },
  created() {
    // 在这里可以使用 this.$route.params.id 来获取传递的唯一 ID
    // 通过该 ID 请求数据，并将数据赋值给 this.data
    this.fetchData(this.$route.params.appname)
    this.fetchData(this.$route.params.env)
  },
  methods: {
    fetchData(id) {
      // 通过 API 请求数据，并将数据赋值给 this.data
      // 示例：假设 fetchData 是一个异步获取数据的函数
      fetchData(id)
        .then(response => {
          this.data = response.data
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

