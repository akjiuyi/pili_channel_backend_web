<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    this.refreshView(path, query)
  },
  methods: {
    refreshView(path, query) {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delCachedView', { path: '/' + path }).then(() => {
        this.$nextTick(() => {
          this.$router.replace({ path: '/' + path, query })
        })
      })
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
