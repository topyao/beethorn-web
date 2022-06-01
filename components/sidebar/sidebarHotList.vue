<template>
    <div class="sidebar-box">
        <div class="title">
            <h2>热门{{ module | resetTitle}}</h2>
        </div>
        <ul>
            <li v-for="(item,index) in list" :key="index" @click="go(item.id)">
                <div class="article-cover">
                    <img :src="item.cover | resetImage(85,52)" :alt="item.title">
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
import api from "@/api/index"
import {MODE} from "@/shared/mode"
import {MODULE} from "@/shared/module"

export default {
    props:{ 
        module: {
            type: String, //指定传入的类型
            default: "" //这样可以指定默认的值
        },
    },
    filters:{
        resetTitle(e){
            switch (e) {
                case MODULE.ARTICLE:
                    return "文章";
                case MODULE.AUDIO:
                    return "音频";
                case MODULE.EDU:
                    return "课程";
                case MODULE.VIDEO:
                    return "视频";
                case MODULE.RESOURCE:
                    return "资源";
                default:
                    return "投稿";
            }
        }
    },
    data(){
        return{
            queryParam:{
                page:1,
                limit: 6,
                mode: MODE.HOT,
                module:""
            },
            list:[],
        }
    },
    mounted(){
        this.queryParam.module = this.module
        this.getData()
    },
    watch:{
        module:function(newValue){
            this.queryParam.module=newValue	
            this.getData()
        }
    },
    methods:{
        async getData(){
            const res = await this.$axios.get(api.getSystemFilter,{params:this.queryParam})
            if (res.code != 1) {
                this.$router.push(`/404`)
                this.$message.error(
                    res.message,
                    3
                )
                return
            }
            this.list = res.data.list != null ? res.data.list : []
        },
        go(e){
            switch (e) {
                case MODULE.ARTICLE:
                    this.$router.push({ path: `/${MODULE.ARTICLE}/${e}`})
                    break
                case MODULE.AUDIO:
                    this.$router.push({ path: `/${MODULE.AUDIO}/${e}`})
                    break
                case MODULE.EDU:
                    this.$router.push({ path: `/course/${e}`})
                    break
                case MODULE.VIDEO:
                    this.$router.push({ path: `/${MODULE.VIDEO}/${e}`})
                    break
                case MODULE.RESOURCE:
                    this.$router.push({ path: `/${MODULE.RESOURCE}/${e}`})
                    break
                default:
                    this.$router.push({ path: `/${MODULE.ARTICLE}/${e}`})
                    break
            }
           
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