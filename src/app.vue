<template>
  <div>
    <div>{{a}}</div>
    <Index/>
    <img :src="img"/>
  </div>
</template>

<script>
import Index from './index.vue'
export default{
  data(){
    return {
      a:12,
      d:"test".includes("t"),
      img:require('./assets/img/d.png')
    }
  },
  components:{Index},
  mounted(){
    console.log(this.img)
var s = "dd"
  }
}
</script>
<style scoped>
@import url('./assets/css/index.css');
</style>