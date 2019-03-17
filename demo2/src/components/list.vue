<template>
  <div class="index">
  
    <div v-for="(newsDate, key) in newsListShow" :key='key'>
      <section class="financial-list">
  
        <section class="collect">
  
          <aside>
  
            <h2>{{newsDate.title}}</h2>
  
            <section class="Cleft clearfix">
  
  
              <span class="fl">{{newsDate.author_name}}</span>
  
            </section>
  
            <section class="Cright">
  
  
              <span>{{newsDate.date}}</span>
  
            </section>
  
            <div style="clear: both"></div>
  
          </aside>
  
          <aside>
  
            <img :src="newsDate.thumbnail_pic_s" style="border-radius: 0.2rem;">
  
          </aside>
  
          <div style="clear: both"></div>
  
        </section>
  
      </section>
  
    </div>
  
  </div>
</template>
 
  
 
<script>
  export default {
    name: "index",
  
    data() {
      return {
        newsListShow: []
      };
    },
  
    created() {
      this.setNewsApi();
    },
  
    methods: {
      setNewsApi: function() {
        this.$http.post("/news", "type=top&key=123456").then(res => {
          console.log(res.data);
  
          this.newsListShow = res.data.data;
        });
      }
    }
  };
</script>
 
  
 
<style scoped>
  .topNav {
    width: 100%;
    background: #ed4040;
    position: fixed;
    top: 0rem;
    left: 0;
    z-index: 10;
  }
  
  .simpleNav {
    width: 100%;
    line-height: 1rem;
    overflow: hidden;
    overflow-x: auto;
    text-align: center;
    font-size: 0;
    font-family: "微软雅黑";
    white-space: nowrap;
  }
  
  .simpleNav::-webkit-scrollbar {
    height: 0px;
  }
  
  .simpleNavBar {
    display: inline-block;
    width: 1.2rem;
    color: #fff;
    font-size: 0.3rem;
  }
  
  .navActive {
    color: #000;
    border-bottom: 0.05rem solid #000;
  }
  
  .placeholder {
    width: 100%;
    height: 1rem;
  }
  
  .financial-list {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 0.28rem 0;
    border-bottom: 1px solid #ccc;
  }
  
  .financial-list .collect {
    width: 92%;
    margin: 0 auto;
  }
  
  .financial-list .collect aside:nth-of-type(1) {
    width: 63%;
    float: left;
  }
  
  .financial-list .collect aside:nth-of-type(2) {
    width: 32%;
    height: 2rem;
    float: left;
    margin-left: 0.3rem;
  }
  
  .financial-list .collect h2 {
    width: 100%;
    height: 0.96rem;
    font-size: 0.32rem;
    color: #333333;
    line-height: 0.48rem;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .financial-list .collect aside:nth-of-type(2) img {
    width: 100%;
    height: 100%;
  }
  
  .financial-list .collect aside .Cleft {
    width: 45%;
    float: left;
    margin-top: 0.66rem;
  }
  
  .financial-list .collect aside .Cleft span {
    display: block;
    width: 1.4rem;
    margin-left: 0.05rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .financial-list .collect aside .Cright {
    width: 55%;
    float: right;
    margin-top: 0.66rem;
  }
  
  .financial-list .collect aside .Cright span {
    display: inline-block;
    margin: 0.04rem 0 0 0.05rem;
  }
  
  .financial-list .collect aside span {
    font-size: 0.2rem;
    color: #999999;
  }
  
  .financial-list .collect aside .Cleft img,
  .financial-list .collect aside .Cright img {
    width: 0.18rem;
    height: 0.24rem;
    margin-top: 0.09rem;
  }
</style>