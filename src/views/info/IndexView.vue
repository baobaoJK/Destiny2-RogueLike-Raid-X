<script lang="ts" setup>
import router from '@/router';

const list = ['destiny2', 'gameplay', 'update', 'copyright']
const name = String(router.currentRoute.value.params.page)

// 判断 name 是否在 list 里面
if (!list.includes(name)) {
    router.push('/404')
}

const url = `/info/${name}.html`

</script>

<template>
    <div id="info">
        <router-link class="back" to="/home">← 返回</router-link>
        <iframe :src="url" frameborder="0"></iframe>
    </div>
</template>

<style lang="scss" scoped>
#info {
    width: 100%;
    height: 100%;

    .back {
        position: absolute;
        display: block;
        color: white;
        font-size: 1.25rem;
        padding: 1.25rem 4rem;
        background-color: #405286;
        border: 1px solid #616885;
        transition: opacity .5s;
        cursor: pointer;

        &:hover {
            opacity: 0.5;
        }
    }

    iframe {
        width: 100%;
        height: calc(100% - 8px);
    }
}
</style>
