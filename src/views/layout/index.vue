<template>
    <el-container>
        <el-header>
            <div class="header-title">岩石薄片智能分析</div>
            <div class="header-right">
                <div class="header-nav">
                    <router-link to="/home">首页</router-link>
                    <router-link to="/folder">数据集</router-link>
                </div>
                <div class="header-avatar">
                    <img src="@/assets/images/github-mark.png" alt="" />
                </div>
            </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script setup lang="ts"></script>

<style scoped>
.el-container{
    height: 100vh;
    overflow: hidden;
}
.el-header {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E5E7EB;
}
.el-main{
    height: calc(100vh-60px);
    overflow: hidden;
}

.header-title {
    float: left;
    font-size: 24px;
    font-weight: 700;
}

.header-right{
    float: right;
    display: flex;
}

.header-nav{
    display: flex;
    justify-content: space-around;
    width: 200px;
    margin-right: 10px;
}

.header-avatar {
    margin-top: 10px;
    width: 30px;
    height: 30px;
}

.header-avatar img {
    width: 100%;
}
</style>
