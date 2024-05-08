<template>
    <div class="home-main">
        <aside class="home-slider">
            <div class="slider-title">工具箱</div>
            <div class="slider-tools">
                <div class="select-img slider-menu">
                    <div class="slider-upload" @click="upload">
                        <el-icon
                            style="
                                border: 1.4px solid #111;
                                border-radius: 8px;
                                color: #111;
                            "
                            ><Top
                        /></el-icon>
                        上传
                    </div>
                    <div class="slider-select" @click="selectImg">
                        <el-icon color="#111"><PictureRounded /></el-icon>
                        浏览
                    </div>
                </div>
                <div
                    class="slider-segment slider-menu"
                    @click="handleSegment"
                    :class="{ select: selected === 1 }"
                >
                    分割
                </div>
                <div
                    class="slider-classify slider-menu"
                    @click="handleClassify"
                    :class="{ select: selected === 2 }"
                >
                    分类
                </div>
            </div>
        </aside>
        <div class="home-container">
            <div class="home-img" @mousewheel.prevent="rollImg" v-if="imgUrl">
                <img :src="imgUrl" ref="img" @mousedown.prevent="moveImg" />
            </div>
            <div v-else class="home-img-container">
                <p>上传图片，或从数据集中选取图片</p><br>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";

const selected = ref(0);
const imgUrl = ref("");
const route = useRoute();
const img = ref(null);

function upload() {
    console.log("上传图片");
}

function selectImg() {
    console.log("选择图片并渲染到home-img中");
    router.push("/folder");
}

function handleSegment() {
    selected.value = 1;
    console.log("调用接口获取当前图片的分割结果");
}

function handleClassify() {
    selected.value = 2;
    console.log("调用接口获取当前图片分类的结果");
}

// 鼠标滚轮缩放
function rollImg(e) {
    let transform = img.value.style.transform;
    let zoom =
        transform.indexOf("scale") != -1
            ? +transform.split("(")[1].split(")")[0]
            : 1;
    zoom += e.wheelDelta / 1200;
    if (zoom > 0.1 && zoom < 2) {
        img.value.style.transform = "scale(" + zoom + ")";
    }
}

// 鼠标拖拽图片
function moveImg(e) {
    let x = e.clientX;
    let y = e.clientY;
    let left = x - e.target.offsetLeft;
    let top = y - e.target.offsetTop;
    document.onmousemove = (ev) => {
        e.target.style.left = ev.clientX - left + "px";
        e.target.style.top = ev.clientY - top + "px";
    };
    document.onmouseup = () => {
        document.onmousemove = null;
    };
}

onMounted(() => {
    imgUrl.value = route.params.imgUrl;
});
</script>

<style scoped>
.home-main {
    height: calc(100vh - 60px);
    display: flex;
    align-items: center;
}

.home-slider {
    min-width: 200px;
    min-height: 200px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    padding: 20px 10px;
    border-radius: 8px;
    margin-left: 20px;
}

.slider-title {
    font-size: 20px;
    margin-left: 10px;
}

.slider-tools {
    display: flex;
    flex-direction: column;
}

.slider-menu {
    margin-top: 10px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 8px 10px;
}

.slider-menu:hover,
.select {
    color: #2563eb;
    border: 2px solid #2563eb;
}

.select-img {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.home-container {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-img {
    position: relative;
    width: 900px;
    height: 80%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-img-container{
    position: relative;
    width: 900px;
    height: 600px;
    background-color: #e5e7eb;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
}

.home-img-container p{
    font-size: 20px
}

.home-img img {
    position: absolute;
    cursor: move;
    transform: translate(0, 0);
}
</style>
