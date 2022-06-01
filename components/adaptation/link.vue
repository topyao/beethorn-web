<template>
    <div class="link">
        <div class="content" @click="goInfo(info.id,info.module)">
            <img class="cover" :src="info.cover  | resetImage(50,50)" alt="">
            <div class="info">
                <h2 class="title">
                    {{info.title}}
                </h2>
                <p class="desc">{{info.description}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        info: {
            type: Object,
            required: false,
            default: {}
        },
    },
    methods:{
        goInfo(e,m){
            // if (m) {
                
            // }
            let routeUrl = this.$router.resolve({
                path: `/${m}/${e}`
            });
            window.open(routeUrl.href, '_blank');
        }
    }
}
</script>

<style lang="less" scoped>
.link{
    margin-top: 10px;
    .content{
        cursor: pointer;
        padding: 10px;
        border-radius: 4px;
        background: #f5f6f7;
        display: flex;
        .cover{
            border-radius: 4px;
            width: 50px;
            height: 50px;
            object-fit: cover;
            margin-right: 10px;
        }
        .info{
            flex: 1;
            .title{
                line-height: 20px;
                color: #797c80;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                word-break: break-all;
            }
            .desc{
                line-height: 15px;
                color: #797c80;
                font-size: 13px;
                margin-bottom: 8px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                word-break: break-all;
            }
        }
    }
}
</style>