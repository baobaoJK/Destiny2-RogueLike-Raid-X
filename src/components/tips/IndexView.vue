<script lang="ts" setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
    tooltipShow: Boolean,
})

// 提示框坐标
const tooltipLocation = ref('translate(0px, 0px')
// 提示框样式
const wrapper = ref('#262727')
const header = ref('#C6C0B9')

// 移动提示框
const moveTooltip = (e: any) => {
    // values: e.clientX, e.clientY, e.pageX, e.pageY
    const x = e.pageX + 8
    const y = e.pageY + 8

    tooltipLocation.value = 'translate(' + x + 'px, ' + y + 'px)'
}

// 设置提示信息
const setToolTips = (item: any) => {
    if (item.rarity != undefined) {

        switch (item.rarity) {
            case '异域':
                wrapper.value = '#2A271A'
                header.value = '#CFB444'
                break
            case '传说':
                wrapper.value = '#262727'
                header.value = '#633F60'
                break
            case '稀有':
                wrapper.value = '#262727'
                header.value = '#5F81AB'
                break
            case '罕见':
                wrapper.value = '#262727'
                header.value = '#477B4D'
                break
            case '无':
            default:
                wrapper.value = '#262727'
                header.value = '#C6C0B9'
                break
        }
    }
    else {
        wrapper.value = '#262727'
        header.value = '#633F60'
    }

}


// 导出方法
defineExpose({
    header,
    moveTooltip,
    setToolTips,
})
</script>

<template>
    <div id="tooltip" :class="{ show: tooltipShow }" :style="{ transform: tooltipLocation, backgroundColor: wrapper }">
        <div class="wrapper" :style="`background-color: ${wrapper}`">
            <div class="header" :style="{ 'background-color': header }">
                <slot name="header"></slot>
            </div>
            <div class="main">
                <slot name="main"></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
// 提示文本
#tooltip {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 27.5rem;
    min-height: 10rem;
    color: white;
    z-index: 5000;

    &.show {
        display: block !important;
    }

    .wrapper {
        width: 100%;
        height: 100%;

        // 提示头部
        // 异域 #CFB444
        // 传说 #633F60
        // 稀有 #5F81AB
        // 罕见 #477B4D
        // 白色 #C6C0B9
        // 背景1 #2A271A
        // 背景2 #262727
        .header {
            width: 100%;
            height: 5rem;
            padding: 0.5rem 0.75rem;
            box-sizing: border-box;

            // 物品名称
            .name {
                font-size: 1.75rem;
            }

            // 物品说明
            .type {
                display: flex;
                justify-content: space-between;
                font-size: 1.125rem;
                color: #fff9;
            }
        }

        // 物品信息
        .main {
            width: 100%;
            height: auto;

            // 物品描述
            .description {
                box-sizing: border-box;
                padding: 0.5rem 0.75rem;
                font-size: 1.125rem;
            }

            // 分割线
            .line {
                margin: 0.75rem 0;
                border-bottom: 1px solid #fff5;
            }

            // 货币
            .monetary {
                display: flex;
                align-items: center;
                padding: 0.5rem 0.75rem 1rem 0.75rem;

                // 货币名称
                .name {
                    display: flex;
                    align-items: center;
                    width: 50%;

                    .light,
                    .card {
                        width: 2rem;
                        height: 2rem;
                        margin-right: 0.5rem;
                    }
                }

                // 货币
                .info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 50%;
                }
            }
        }
    }
}
</style>