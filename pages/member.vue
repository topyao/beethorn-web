<template>
  <div class="container">
        <div class="warper" :style="{ width: design.width + 'px' }">
            <LeftMenu/>
            <div class="right" :style="{ width: design.width - 220 + 'px' }">
                <Nuxt />
            </div>
        </div>
  </div>
</template>

<style lang="less" scoped>
.container{
    margin: 20px 0;
    display: flex;
    justify-content: center;
    .warper{
        .right{
            margin-left: 220px;
            width: 100%;
        }
    }
}

// 响应式处理
@media only screen and (max-width: 768px) {
  .container{
    .account-content{
      .warper {
        width: 100% !important;
      }
    }
  }
}
</style>


<script>
import LeftMenu from "@/components/member/left"
// import Right from "@/components/feed/right"

import { mapState } from "vuex"
export default {
    layout:"member",
    components:{
        LeftMenu,
    },
    asyncData({ redirect,route }) {
        if (route.path == "/member") {
            redirect("/member/dashboard")
        }
    },
    computed:{
        ...mapState(["design"]),
        ...mapState("user",["token"]),
    },
}
</script>