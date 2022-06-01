<template>
    <div class="modal_box center opacity" :class="[isTrue && 'is_back_show']">
        <div class="modal_box_container">
            <div class="modal_box_title">
                <div class="modal_box_title_l">
                    <span>添加资源</span>
                </div>
                <div class="modal_box_title_r">
                    <a-icon  type="close" @click="cancel"/>
                </div>
            </div>
            <div class="modal_box_content">
                <a-input-search
                    :style="{'margin-bottom':'20px'}"
                    placeholder="输入搜索标题"
                    enter-button="按标题搜索"
                    size="large"
                    @search="onSearch"
                />
                <a-table 
                :pagination="{
                    pageSize: queryParam.limit,
                    total:total,
                }"
                @change="changePage"    
                :columns="columns" :data-source="list">
                    <span slot="action" slot-scope="record">
                        <a @click="selectResource(record)">选择</a>
                    </span>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/api/index"
import FIcon from '@/components/icon/FIcon'
import { mapState } from "vuex"
export default {
    components:{
        FIcon
    },
    data() {
        return {
            columns:[
                {
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title',
                },
                {
                    width: "100px",
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            list: [],
            total: 0,
            queryParam: {
                page: 1,
                limit: 2,
                status: 2,
                userId:0,
                title:""
            },
            resource:null,
            // 登录输入框
            isTrue: false,
            state: null // 准备（prepare） 确定（ ascertain） 取消（cancel）
        };
    },
     computed:{
        ...mapState("user",["userInfo"]),
    },
    methods: {
        async confirm(
      
        ) {
            // 获取资源列表
                const res = await this.$axios.get(api.getResourceList,{params: this.queryParam})
                if (res.code != 1) {
                    this.$message.error(
                        res.message,
                        3
                    )
                    return
                }
                this.total = res.data.total
                this.list = res.data.list == null ? [] : res.data.list.map((item)=>{
                    return {
                        key:item.id,
                        id:item.id,
                        cover:item.cover,
                        title:item.title,
                        createTime:item.createTime,
                        status:item.status
                    }
                })
            this.open();
            return new Promise((resolve, reject) => {
                const target = { state: 'prepare'};
                const that = this
                let res = new Proxy(target, {
                    set(event, key, value) {
                        if (value === 'ascertain') {
                            resolve(that.resource);
                        } else {
                            reject(false);
                        }
                        return true
                    }
                });
                this.state = res;
            });
        },
        async changePage(e){
            this.queryParam.limit = e.pageSize
            this.queryParam.page = e.current
            const res = await this.$axios.get(api.getResourceList,{params: this.queryParam})
            if (res.code != 1) {
                this.$message.error(
                    res.message,
                    3
                )
                return
            }
            this.list = res.data.list == null ? [] : res.data.list.map((item)=>{
                return {
                    key:item.id,
                    id:item.id,
                    cover:item.cover,
                    title:item.title,
                    createTime:item.createTime,
                    status:item.status
                }
            })
        },
        async onSearch(e){
            this.list = []
            this.queryParam.limit = 2
            this.queryParam.page = 1
            this.queryParam.title = e
            const res = await this.$axios.get(api.getResourceList,{params: this.queryParam})
            if (res.code != 1) {
                this.$message.error(
                    res.message,
                    3
                )
                return
            }
            this.total = res.data.total
            this.list = res.data.list == null ? [] : res.data.list.map((item)=>{
                return {
                    key:item.id,
                    id:item.id,
                    cover:item.cover,
                    title:item.title,
                    createTime:item.createTime,
                    status:item.status
                }
            })
        },
        selectResource(e){
            this.resource = e
            this.ascertain()
        },
        cancel(){
            this.state.state = "cancel"
            this.close()
            this.resource = null
            this.list = []
            this.total = 0
        },
        ascertain(){

            this.state.state = "ascertain"
            this.close()
            this.resource = null
            this.list = []
            this.total = 0
        },
        open() {
            this.isTrue = true;
        },
        close() {
            this.isTrue = false;
        },
        
    }
};
</script>

<style lang="less" scoped>
    .modal_box {
        user-select: none;
        pointer-events: none;
        z-index: 20;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
        transform: perspective(1px) scale(1.1);
        transition: visibility 0s linear .15s,opacity .15s 0s,transform .15s;
        display: flex;
        align-items: center;
        justify-content: center;
        .modal_box_container{
            background-color: #fff;
            width: 45rem;
            margin: 0 auto;
            position: relative;
            background-image: url("/img/login.png");
            background-repeat: no-repeat;
            background-size: 100%;
            margin-top: -9%;
            .modal_box_title{
                font-size: 13px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                .modal_box_title_l{
                    display: block;
                    align-items: center;
                    width: 80%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .modal_box_content{
                padding: 10px 20px;

            }
        }
        
    }
    .is_back_show {
        opacity: 1 !important;
        background: rgba(42, 44, 48, 0.7);
        pointer-events: auto !important;
        visibility: visible;
        transform: perspective(1px) scale(1);
        transition: visibility 0s linear 0s,opacity .15s 0s,transform .15s;
    }

    @media only screen and (max-width: 768px) {
        .modal_box{
            .modal_box_container{
                width: 100%;
            }
        }
    }
</style>