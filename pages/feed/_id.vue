<template>
    <div class="detail">
        <div class="info" :style="{ width: design.width - 300 + 'px' }">
            <a-row :gutter="[{md:12}]">
                <a-col :span="18">
                    <div class="feed-info">
                        <div class="user-info">
                            <div class="user">
                                <nuxt-link :to="{path:'/profile/' + info.userInfo.id }" class="item-link">   
                                    <Avatar 
                                        class="user-avatar"
                                        :verifyRight="-5"
                                        :verifyBottom="5"
                                        :isVerify="info.userInfo.isVerify"
                                        shape="square" 
                                        :src="info.userInfo.avatar+'@w60_h60'" 
                                        :size="45"
                                    />
                                </nuxt-link>
                                <div class="nick-name-lv">
                                    <nuxt-link class="user-name" :to="{path:'/profile/' + info.userInfo.id }">   
                                        <h2 >{{info.userInfo.nickName}}</h2>
                                    </nuxt-link>
                                    <div class="lv-vip-sm">
                                        <!-- <span :style="{color: 'red',fontSize: '12px'}">Vip1</span> -->
                                        <span class="lv">{{info.userInfo.grade.title}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="group" @click="goGroup(info.groupInfo.id)">
                                <span class="group-icon">#</span>
                                <span class="title">{{info.groupInfo.title}}</span>
                            </div>
                        </div>
                        <div class="feed-centet">
                            <p>
                                <span v-if="info.type == 2" class="question">问题</span>
                                {{info.title}}
                            </p>
                            
                            <!-- 图片 -->
                            <div v-if="info.type == 1 && info.files !=''">
                                <ImageAdaptation :list="info.files"/>
                            </div>

                            <!-- 链接 -->
                            <div v-if="info.relatedInfo.module != ''&&info.relatedInfo.id != 0">
                                <LinkAdaptation :info="info.relatedInfo"/>
                            </div>
                        </div>
                        <div class="feed-bottom">
                            <div class="tools">
                                <span @click="postLike" class="like mrt20">
                                    <a-icon :theme="info.isLike ? 'filled' : 'outlined'" type="like" />
                                    <span>{{info.isLike ? '已赞' : '赞'}} </span>
                                    <b>{{info.likes == 0 ? "" : info.likes}}</b>
                                </span>
                                <span class="date mrt20">
                                    {{info.createTime | resetData}}
                                </span>
                                <a-dropdown placement="bottomCenter">
                                    <a class="share" @click="e => e.preventDefault()">
                                        更多 <a-icon type="down" />
                                    </a>
                                    <a-menu slot="overlay">
                                        <a-menu-item key="1" @click="report"><a-icon type="info-circle" />举报</a-menu-item>
                                        <a-menu-item key="2" 
                                            v-clipboard:copy="`${base.url}/feed/${info.id}`"
                                            v-clipboard:success="onCopy"><a-icon type="copy" />分享</a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </div>
                            <div class="commnet-answer">
                                <span @click="openAnswer" v-if="info.type == 2" class="answer">我来回答</span> 
                                <div @click="openComment" class="comment">
                                    评论 {{info.comments == 0 ? '' : info.comments}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 评论 -->
                   
                    <div v-if="isopenComment" class="item-comment">
                        <CommentList  module="topic" :relatedId="info.id"/>
                    </div>

                    <!-- 回答 -->
            
                    <div v-if="isopenAnswer" class="item-comment">
                        <Answer :authorId="info.userInfo.id" :topicId="info.id"/>
                    </div>
                </a-col>
                <a-col :span="6">
                    <SidebarUserInfo :isFollow.sync="info.isFollow"  :info="info.userInfo"/>
                </a-col>
            </a-row>
        </div>
    </div>
</template>



<script>
import LinkAdaptation from "@/components/adaptation/link"
import ImageAdaptation from "@/components/adaptation/image"
import Avatar from "@/components/avatar/avatar"
import Comment from "@/components/comment/List"
import SidebarUserInfo from "@/components/sidebar/sidebarUserInfo"

import { mapState } from "vuex"
import api from "@/api/index"
export default {
    computed:{
        ...mapState(["design","title"]),
        ...mapState("user",["token","userInfo"]),
    },
    components:{
        LinkAdaptation,
        ImageAdaptation,
        Avatar,
        Comment,
        SidebarUserInfo,
    },
    head(){
        return this.$seo(`${this.info.title}-${this.base.title}`,`${this.info.title}`,[{
            hid:"fiber-desc",
            name:"description",
            content:`${this.info.description}`
        }])
    },
    validate({ params }) {
        if (params.id != null && params.id != undefined && params.id != NaN) {
            return true // 如果参数有效
        }
        return false // 参数无效，Nuxt.js 停止渲染当前页面并显示错误页面
    },
    async asyncData({params,$axios,redirect,store}){
    
        const id = parseInt(params.id)
        const res = await $axios.get(api.getTopic,{params:{id:id}})
    
        if (res.code != 1) {
            redirect("/404")
        }
        if (res.data.info.type == 1 && res.data.info.files != "") {
            res.data.info.files = JSON.parse(res.data.info.files)
        }

        return {
            base:store.state.base,
            id:id,
            info:res.data.info,
            isopenComment:true,
            isopenAnswer:false,
        }
    },
    methods: { 
        goRelated(){
            this.$router.push(`/${this.info.relatedInfo.module}/${this.info.relatedInfo.id}`)
        },
        goGroup(e){
            this.$router.push(`/group/${e}`)
        },
        report(){
            this.$Report(this.id,"topic")
        },
        openComment(){
            this.isopenAnswer = false
            this.isopenComment = !this.isopenComment
        },
        openAnswer(){
            this.isopenComment = false
            this.isopenAnswer = !this.isopenAnswer
        },
        async postLike(){
            if (this.token == null) {
                this.$Auth("login","登录","快速登录")
                return
            }
            this.info.isLike = !this.info.isLike
            if (this.info.isLike) {
                this.info.likes = this.info.likes + 1
            } else {
                 this.info.likes = this.info.likes - 1
            }
            const query = {
                id:this.id
            }
            const res = await this.$axios.post(api.postTopicLike,query)
            if (res.code != 1) {
                this.$message.error(
                    res.message,
                    3
                )
                this.info.isLike = !this.info.isLike
                if (this.info.isLike) {
                    this.info.likes = this.info.likes + 1
                } else {
                    this.info.likes = this.info.likes - 1
                }
                return
            }
        },
        onCopy(e){
            this.$message.success(
                "复制成功",
                3
            )
        },
        async remove(){
            this.$confirm({
                okText:"确定",
                cancelText:"取消",
                title: '正在删除',
                content: '请注意，您现在正在删除',
                onOk:() => {
                    const formData = {
                        id:this.id,
                    }
                    this.postDelete(formData)
                    return false;
                },
                onCancel() {},
            });
        },
        async postDelete(formData){
            try {
                const res = await this.$axios.post(api.postTopicRemove,formData)
                if (res.code != 1) {
                    this.$message.error(
                        res.message,
                        3
                    )
                    return
                }
                 this.$router.push({ name: "feed"})
            } catch (error) {
                console.log(error)
                setTimeout(() => {
                    this.$notification.error({
                        message: '网络错误',
                        description: "请稍后再试"
                    })
                }, 1000)
            }
        },

    }
}
</script>

<style lang="less" scoped>
.detail{
    margin-top: 80px;
    display: flex;
    justify-content: center;
    min-height: 550px;
    .info{
        min-height: 550px;
        .feed-info{
            background: white;
            padding: 20px;

            .user-info{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .user{
                    display: flex;
                    align-items: center;
                    .nick-name-lv{
                        height: 40px;
                        display: flex;
                        // align-items: center;
                        justify-content: space-between;
                        flex-direction: column;
                        .user-name{
                            h2{
                                font-size: 15px;
                                color: #494b4d;
                                font-weight: 600;
                            }
                        }
                        .lv-vip-sm{
                            .lv{
                                font-size: 12px;
                                background-color: rgba(173, 173, 173,0.16);
                                padding: 0 5px;
                                height: 17px;
                                line-height: 17px;
                            }
                        }
                    }
                }
                .group{
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    // align-items: start;
                    padding: 4px 10px;
                    color: #8590a6;
                    .group-icon{
                        color: #8590a6;
                        margin-right: 6px;
                        font-size: 12px;
                        background: rgba(173, 173, 173, 0.16);
                        // padding: 0px 4px;
                        border-radius: 80%;
                    }
                    .title{
                        font-size: 13px;
                    }

                }
                .group:hover{
                    border-radius: 15px;
                    
                    background: rgba(173, 173, 173, 0.16);
                }
            }
            .feed-centet{
                margin-top: 10px;
                p{
                    cursor: pointer;
                    user-select: none;
                    line-height: 20px;
                    font-size: 16px;
                    color: #0b0b37;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    word-break: break-all;
                    .question{
                        border-top-left-radius: 13px;
                        border-bottom-right-radius: 13px;
                        color: white;
                        font-size: 12px;
                        padding: 3px 8px;
                        background: linear-gradient(140deg, #039ab3 10%, #58dbcf 90%);
                    }
                }
            }
            .feed-bottom{
                margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .tools{
                        display: flex;
                        align-items: center;
                        .like{
                            cursor: pointer;
                            user-select: none;
                            // line-height: 20px;
                            color: #8590a6;
                            .icon{
                                font-size: 18px;
                            }
                            font-size: 13px;
                            padding: 5px;
                            border-radius: 4px;
                            background: rgba(173, 173, 173, 0.16);
                        }
                        .date{
                            color: #8590a6;
                            font-size: 13px;
                        }
                        .share{
                            font-size: 13px;
                            // padding: 5px 10px;
                            cursor: pointer;
                            user-select: none;
                            color: #8590a6;
                        }
                    }
                    
                    .commnet-answer{
                        display: flex;
                        align-items: center;
                        .answer{
                            cursor: pointer;
                            user-select: none;
                            font-size: 13px;
                            color: #1e80ff;
                            margin-right: 10px;
                        }
                        .comment{
                            cursor: pointer;
                            user-select: none;
                            font-size: 15px;
                            color: #8590a6;
                            background: 0 0;
                            padding: 5px 10px;
                            display: block;
                            border-radius: 3px;
                            box-shadow: 1px 1px 1px 1px #90909021;
                            border: 0;
                        }
                    }
            }
        }
        .item-comment{
            background: white;
            margin: 20px 0;
            padding: 10px;
        }
    }  
}
</style>