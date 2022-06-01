<template>
    <div class="sidebar-box">
        <div class="title">
            <h2>资源下载</h2>
        </div>
        <ul>
            <li v-for="(item,index) in list" :key="index" @click="goResource(item.id,item.module)">
                <div class="article-cover">
                    <img :src="item.cover" :alt="item.title">
                </div>
                <div class="article-info">
                    <h2>
                        {{item.title}}
                    </h2>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        list:{
            type: Array,
            default: []
        }
    },
    data(){
        return{

        }
    },
    methods:{
        goResource(e){
            let routeUrl = this.$router.resolve({
                path: `/resource/${e}`
            });
            window.open(routeUrl.href, '_blank');
        }
    }
}
</script>

<style lang="less" scoped>
.sidebar-box{
    padding: 20px;
    background: white;
    margin-bottom: 10px;
   .title{
       h2{
            font-size: 16px;
            font-weight: 600;
            line-height: 1;
        }
   }
   ul{
       li{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            cursor: pointer;
            .article-cover{
                width: 83px;
                height: 51px;
                margin-right: 10px;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }
            .article-info{
                flex: 1;
                height: 51px;
                h2{
                    font-size: 13px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    max-height: 52px;
                }
            }
       }
   }
}
</style>