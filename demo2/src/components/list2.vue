<template>
  <div class="index">
  
    <div v-for="(item, key) in data" :key='key'>
      <section class="list">
        <span>{{item.id}}</span>
        <span>{{item.name}}</span>
        <span>{{item.content}}</span>
        <span class="delete" @click='deleteList(item)'>删除</span>
      </section>
  
    </div>
  
  </div>
</template>
 
<script>
  export default {
    name: "list2",
  
    data() {
      return {
        data: []
      };
    },
  
    created() {
      this.setNewsApi();
    },
  
    methods: {
      setNewsApi: function() {
        this.$http.get("/list", "").then(res => {
          this.data = res.data.data;
        });
      },
      deleteList(data) { //删除数据
        let id = data.id;
        this.$http.post('/list', {
            params: {
              id: id
            }
          }).then(function(res) {
            console.log(res);
            this.data = res.data.data;
            alert(data.name + '删除成功');
          }.bind(this))
          .catch(function(error) {
            console.log(error)
          });
      },
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
 
<style lang="less" scoped>
  .list {
    display: flex;
    margin-bottom: 10px;
  }
  
  span {
    flex: 1;
    display: block;
    font-size: 0.32rem;
    font-weight: bold;
  }
</style>