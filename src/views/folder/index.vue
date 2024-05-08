<template>
    <div class="folder-container">
        <div class="folder-header">
            <div class="folder-upload">
                从下面选择一张图片，或者<button
                    @click="act = 1"
                    class="btn-upload"
                >
                    上传图片
                </button>
            </div>
            <div class="upload" v-if="act">
                <input
                    type="file"
                    style="display: none"
                    ref="fileInputRef"
                    @change="handleFileClick"
                    multiple
                />
                <div class="upload-head">
                    <div class="upload-head_title">上传图片</div>
                    <div class="upload-head_close" @click="close()">
                        <el-icon><Close /></el-icon>
                    </div>
                </div>
                <div
                    class="upload_drag"
                    @dragenter.prevent
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                >
                    <img src="@/assets/images/upload-icon.svg" alt="" />
                    <h4>
                        将文件拖到此处 或
                        <button @click="openFileInput">点击上传</button>
                    </h4>
                    <h4 class="upload_info">支持png、jpg格式</h4>
                </div>
                <ul class="upload-list">
                    <li
                        class="upload-item"
                        v-for="file in fileList"
                        :key="file.id"
                    >
                        <img :src="file.url" alt="" />
                        <div class="img-info" v-if="file.status === '准备上传'">
                            <div class="img-name">{{ file.name }}</div>
                            <el-progress
                                :percentage="file.percentage"
                                color="#409eff"
                            ></el-progress>
                        </div>
                        <div class="img-info" v-else>
                            <div class="img-name">{{ file.name }}</div>
                            <div class="img-size">{{ file.size }}</div>
                        </div>
                        <el-icon @click="handleDelete(file.id)">
                            <Delete />
                        </el-icon>
                    </li>
                </ul>
            </div>
        </div>
        <div class="folder-main">
            <div class="folder-gallery">
                <div
                    v-for="(image, index) in allFileList"
                    class="image-container"
                    :key="index"
                    @click="goToHome(image)"
                >
                    <img :src="image" alt="" />
                </div>
                <div v-if="act" class="overlay"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { http, cancelSource } from "@/api/http";
import { ElMessage } from "element-plus";
import router from "@/router";
import SparkMD5 from "spark-md5";

let act = ref(0);
const fileInputRef = ref(null);
const files = ref([]); //原始文件列表，只保存当前需要上传的文件列表，关闭文件上传框后会清空
const fileList = ref([]); // 用于展示的数据
const allFileList = ref([]);
// const percentage = ref(0); // 进度条

function close() {
    act.value = 0;
}

// 触发文本选择框
function openFileInput() {
    fileInputRef.value.click();
}

// 点击上传文件
function handleFileClick(e) {
    let upFiles = e.target.files;
    files.value.push(...upFiles);
    for (let file of upFiles) {
        if (file.type.startsWith("image/")) {
            let id = fileList.value.length;
            fileList.value.push({
                id: id,
                name: file.name,
                size:
                    file.size > 1024 * 1024
                        ? (file.size / 1024 / 1024).toFixed(2) + "mb"
                        : (file.size / 1024).toFixed(2) + "kb",
                status: "准备上传",
                url: URL.createObjectURL(file),
                percentage: 0,
            });
            uploadFile(file, id).then((res) => {
                if (res) {
                    fileList.value[id].status = "上传成功";
                } else {
                    fileList.value[id].status = "上传失败";
                }
            });
        }
    }
    console.log(files.value);
    console.log(fileList.value);
}

// 删除选中的文件
function handleDelete(index) {
    console.log(index);
    files.value.splice(index, 1);
    fileList.value.splice(index, 1);
}

// 拖拽上传文件
function handleDrop(e) {
    let upFiles = e.dataTransfer.files;
    files.value.push(...upFiles);
    for (let file of upFiles) {
        if (file.type.startsWith("image/")) {
            if (file.size <= 1024 * 1024 * 5) {
                console.log("文件上传中...")
                let id = fileList.value.length;
                fileList.value.push({
                    id: id,
                    name: file.name,
                    size:
                        file.size > 1024 * 1024
                            ? (file.size / 1024 / 1024).toFixed(2) + "mb"
                            : (file.size / 1024).toFixed(2) + "kb",
                    status: "准备上传",
                    url: URL.createObjectURL(file),
                    percentage: 0,
                });
                uploadFile(file, id).then((res) => {
                    if (res) {
                        fileList.value[id].status = "上传成功";
                    } else {
                        fileList.value[id].status = "上传失败";
                    }
                });
            } else {
                console.log("大文件上传中。。。")
                cut(file);
            }
        }
    }
    console.log(files.value);
    console.log(fileList.value);
}

// 上传文件
const uploadFile = async (value, index) => {
    let formData = new FormData();
    formData.append("file", value);
    try {
        let res = await http.post("/api/fileUpload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            // 监听进度
            onUploadProgress: (progressEvent) => {
                // 进度条
                const loaded = progressEvent.loaded;
                const total = progressEvent.total;
                const percentCompleted = Math.round((loaded * 100) / total);
                fileList.value[index].percentage = Number(percentCompleted);
                console.log(`上传进度：${percentCompleted}%`);
            },
        });
        if (res.code === 200) {
            ElMessage({
                type: "success",
                message: "上传成功",
            });
            return true;
        } else {
            ElMessage({
                type: "error",
                message: res.msg,
            });
            return false;
        }
    } catch (error) {
        return false;
    }
};

// 取消发送
function cancelUpload() {
    console.log("取消发送");
    cancelSource.cancel("请求取消");
}

// 获取全部照片
const getImgs = async () => {
    try {
        let res = await http.post("/api/getImgs", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (res.code === 200) {
            allFileList.value = res.images;
        } else {
            ElMessage({
                type: "error",
                message: res.msg,
            });
            return false;
        }
    } catch (error) {
        return false;
    }
};

// 大文件上传
const bigFileList = ref([]);
const fileMd5 = ref("");
const bigFile = ref('');
let percentage = ref(0);
console.log(percentage.value)
// 切片函数
function cut(file) {
    console.log("正在分片")
    bigFile.value = file
    for (let i = 0; i < bigFile.value.size; i += 1024 * 1024) {
        bigFileList.value.push(bigFile.value.slice(i, i + 1024 * 1024));
    }
    console.log("分片完成：",bigFileList.value);
    const hash = new SparkMD5.ArrayBuffer(); //构建hash值对象
    const fileReader = new FileReader();
    fileReader.onload = () => {
        hash.append(fileReader.result);
        fileMd5.value = hash.end();
        upload(0);
    };
    fileReader.readAsArrayBuffer(bigFile.value);
}

// 上传分片
const upload = async (index) => {
    console.log("正在上传分片数据")
    if (index == bigFileList.value.length) {
        mergeUpload();
        return;
    }
    const formData = new FormData();
    formData.append("chunk", bigFileList.value[index]);
    formData.append("index", index);
    formData.append("name", fileMd5.value + "@" + index);
    formData.append("filename", fileMd5.value);
    let res = await http.post("/api/upload_big_file", formData);
    console.log("请求上传结果：",res);
    if (res.code == 300) {
        // 证明已经存在部分文件
        percentage.value = (
            (res.index / bigFileList.value.length) *
            100
        ).toFixed(2);
        console.log(percentage.value)
        upload(res.index + 1);
    } else if (res.code == 200) {
        percentage.value = (
            ((index + 1) / bigFileList.value.length) *
            100
        ).toFixed(2);
        console.log(percentage.value)
        upload(index + 1);
    } else {
        upload(index);
    }
};

//调用请求获取上传后的文件，如果存在则说明上传成功
const mergeUpload = async () => {
    console.log("分片上传完成，正在调用接口查看是否合并")
    // 合并请求
    let res = await http.post("/api/merge_chunk", {
        filename: fileMd5.value,
        extname: bigFile.value.type.split("/").pop(),
    });
    if (res.code == 200) {
        bigFile.value = null;
        bigFileList.value = [];
        fileMd5.value = "";
        ElMessage({
            type: "success",
            message: "上传成功",
        });
    }
};

onMounted(() => {
    getImgs();
});

// 点击图片跳转到home页
function goToHome(url) {
    router.push({ name: "ImgHome", params: { imgUrl: url } });
}
</script>

<style scoped>
.folder-container {
    height: 100%;
    overflow: scroll;
}
.upload {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    padding: 20px;
    background-color: #fff;
    z-index: 10;
}

.upload-head {
    overflow: hidden;
}

.upload-head_title {
    float: left;
    font-size: 20px;
}

.upload-head_close {
    float: right;
}

.upload_drag {
    margin-top: 20px;
    width: 100%;
    height: 250px;
    border-radius: 10px;
    border: 2px dashed #3163eb;
    background-color: #eef7fc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.upload_drag img {
    width: 100px;
}

.upload_drag button {
    border: 0;
    background-color: #eef7fc;
    color: #0748cd;
    padding: 0;
    font-weight: 700;
}

.upload_drag h4 {
    margin-top: 5px;
}

.upload_info {
    font-size: 13px;
    color: #0748cd;
}

.btn-upload {
    background-color: #fff;
    border: 0;
    color: #3560e2;
    margin: 0;
    padding: 0;
    font-weight: 700;
}

.upload-list {
    margin-top: 10px;
    height: 180px;
    overflow: auto;
}

.upload-item {
    position: relative;
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    padding: 10px 20px;
    background-color: #eef7fc;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.upload-item img {
    width: 40px;
    height: 40px;
}

.img-info {
    margin-left: 15px;
}

.img-info .el-progress--line {
    max-width: 70%;
}

.img-size {
    font-size: 14px;
    margin-top: 5px;
    color: #7f7f7f;
}

.upload-item .el-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0, -50%);
}

.folder-main {
    position: relative;
    margin-top: 10px;
}

.folder-gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.image-container {
    height: 300px;
    margin-bottom: 20px;
}

.image-container img {
    width: 100%;
    height: 100%;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 2;
}
</style>
