<template>
    <div>
        <section class="refence">
            <h3>基本markdown语法</h3>
            <ol>
                <li>「*」 无序列表</li>
                <li>「>」 引用</li>
                <li>「** ABC **」加粗</li>
                <li>「* ABC *」斜体</li>
                <li>「***」 水平分割线</li>
                <li>「#」~「######」标题</li>
            </ol>
            <div class="back">
                <router-link to="/">close</router-link>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Refence'
}
</script>

<style scoped>
    li {
        position: relative;
        left: 30px;
    }
    .refence {
    position: absolute;
    /* height: 20vh; */
    width: 20vh;
    border: 2px black solid;
    border-radius: 10px;
    padding: 10px;
    background-color: wheat;
    top: 50vh;
    right: 0;
    transform: translate(0%,-50%);
    }
    .back {
        font-size: 24px;
        margin-top: 10px;
        text-align: center;
    }
</style>
