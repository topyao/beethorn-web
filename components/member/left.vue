<template>
    <div class="left">
        <ul class="menu">
            <li  
            @click="changeMeun('/member/dashboard')" 
            :class="selectedKeys[0] == '/member/dashboard'?'item active':'item'">
                <a-icon theme="filled" 
                type="compass" />
                <span class="title">首页</span>
            </li>
            <div class="group" v-if="token != null">
                <div :class="isContent ? 'group-text group-active': 'group-text'">
                    <a-icon 
                        type="bulb"  
                        theme="filled" />
                    <span class="text">内容管理</span>
                </div>
                <ul class="group-menu">
                    <li 
                    @click="changeMeun('/member/article/list')"
                    :class="selectedKeys[0] == '/member/article/list'?'group-item active':'group-item'">
                        文章管理
                    </li>
                    <li 
                    @click="changeMeun('/member/audio/list')"
                    :class="selectedKeys[0] == '/member/audio/list'?'group-item active':'group-item'">
                        音频管理
                    </li>
                    <li 
                    @click="changeMeun('/member/video/list')"
                    :class="selectedKeys[0] == '/member/video/list'?'group-item active':'group-item'">
                        视频管理
                    </li>
                    <li 
                    @click="changeMeun('/member/resource/list')"
                    :class="selectedKeys[0] == '/member/resource/list'?'group-item active':'group-item'">
                        资源管理
                    </li>
                    <li 
                    @click="changeMeun('/member/edu/list')"
                    :class="selectedKeys[0] == '/member/edu/list'?'group-item active':'group-item'">
                        课程管理
                    </li>
                </ul>
            </div>
            <div class="group" v-if="token != null">
                <div :class="isInteractive ? 'group-text group-active': 'group-text'">
                    <a-icon 
                        type="bulb"  
                        theme="filled" />
                    <span class="text">互动管理</span>
                </div>
                <ul class="group-menu">
                    <li 
                    @click="changeMeun('/member/group/list')"
                    :class="selectedKeys[0] == '/member/group/list'?'group-item active':'group-item'">
                        圈子管理
                    </li>
                    <li 
                    @click="changeMeun('/member/feed/list')"
                    :class="selectedKeys[0] == '/member/feed/list'?'group-item active':'group-item'">
                        帖子管理
                    </li>
                    <li 
                    @click="changeMeun('/member/comment/list')"
                    :class="selectedKeys[0] == '/member/comment/list'?'group-item active':'group-item'">
                        评论管理
                    </li>
                </ul>
            </div>
            <div class="group" v-if="token != null">
                <div :class="isData ? 'group-text group-active': 'group-text'">
                    <a-icon 
                        type="bulb"  
                        theme="filled" />
                    <span class="text">数据中心</span>
                </div>
                <ul class="group-menu">
                    <!-- <li 
                    @click="changeMyGroup(1)"
                    :class="'group-item active'">
                        内容数据
                    </li> -->
                    <li 
                    @click="changeMyGroup(1)"
                    :class="'group-item'">
                        内容数据
                    </li>
                    <li 
                    @click="changeMyGroup(1)"
                    :class="'group-item'">
                        关注数据
                    </li>
                </ul>
            </div>
            <div class="group" v-if="token != null">
                <div :class="isEvent ? 'group-text group-active': 'group-text'">
                    <a-icon 
                        type="bulb"  
                        theme="filled" />
                    <span class="text">活动中心</span>
                </div>
                <ul class="group-menu">
                    <li 
                    @click="changeMyGroup(1)"
                    :class="'group-item'">
                        创作者活动
                    </li>
                </ul>
            </div>
            <div class="group" v-if="token != null">
                <div :class="isQuestion ? 'group-text group-active': 'group-text'">
                    <a-icon 
                        type="bulb"  
                        theme="filled" />
                    <span class="text">帮助中心</span>
                </div>
                <ul class="group-menu">
                    <li 
                    @click="changeMyGroup(1)"
                    :class="'group-item'">
                        常见问题
                    </li>
                </ul>
            </div>
        </ul>
    </div>
</template>

<script>
import { mapState } from "vuex"
import {MODE} from "@/shared/mode"
export default {
    computed:{
        ...mapState("user",["token"]),
    },
    data(){
        return{
            MODE,
            selectedKeys: [],
            isHome:false,
            isContent:false,
            isInteractive: false,
            isData: false,
            isEvent: false,
            isQuestion: false,
        }
    },
    mounted () {
        this.updateMenu()
    },
    methods:{
        updateMenu () {
            const routes = this.$route.matched.concat()
            this.selectedKeys = [ routes.pop().path ]
        },
        changeMeun(e){
            this.$router.push(e)

            // 如果是首页
            if (e == "/member/dashboard") {
                this.isHome = true
                this.isContent = false
                this.isInteractive = false
                this.isData = false
                this.isEvent = false
                this.isQuestion = false
                return
            }
           

            

            // 如果是内容页面
            if (e == "/member/article/list" || e == "/member/audio/list"  || e == "/member/resource/list" || e == "/member/video/list" || e == "/member/edu/list") {
                console.log(e)
                this.isHome = false
                this.isContent = true
                this.isInteractive = false
                this.isData = false
                this.isEvent = false
                this.isQuestion = false
                return
            }

            
            // 如果是互动页面
            if (e == "/member/group/list" || e == "/member/feed/list" || e == "/member/comment/list") {
                this.isHome = false
                this.isContent = false
                this.isInteractive = true
                this.isData = false
                this.isEvent = false
                this.isQuestion = false
                return
            }

           
        },
    },
    watch: {
        '$route' (val) {
            this.updateMenu()
        }
    }
}
</script>

<style lang="less" scoped>
.left{
    top: 85px;
    position: fixed;
    width: 200px;
    .menu{
        width: 200px;
        background: white;
        padding: 8px;
        border-radius: 2px;
        .item{
            cursor: pointer;
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            font-size: 22px;
            padding: 10px 5px;
            .title{
                font-size: 16px;
                margin-left: 10px;
            }
        }
        .active{
            color:#1e80ff;
            border-radius: 2px;
            background: #eaf2ff!important;
        }
        .item:hover{
            color:#1e80ff;
            border-radius: 2px;
            background: #f7f8fa!important;
        }
        .group{
            .group-text{
                cursor: pointer;
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                font-size: 22px;
                padding: 10px 5px;
                .text{
                    font-size: 16px;
                    margin-left: 10px;
                }
            }
            .group-active{
                color:#1e80ff;
            }
            .group-text:hover{
                color:#1e80ff;
                border-radius: 2px;
                background: #f7f8fa!important;
            }

            .group-menu{
                .group-item{
                    cursor: pointer;
                    margin-bottom: 2px;
                    display: flex;
                    align-items: center;
                    font-size: 22px;
                    padding: 10px 5px;
                    font-size: 16px;
                    padding-left: 34px;
                }
                .active{
                    color:#1e80ff;
                    border-radius: 2px;
                    background: #eaf2ff!important;
                }
                .group-item:hover{
                    color:#1e80ff;
                    border-radius: 2px;
                    background: #f7f8fa!important;
                }
            }

        }
    }
}
</style>