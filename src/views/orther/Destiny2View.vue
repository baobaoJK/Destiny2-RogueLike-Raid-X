<template>
  <div id="destiny2">
    <router-link class="back" to="home">← 返回</router-link>
    <iframe src="destiny2.html" frameborder="0"></iframe>
  </div>
</template>

<style lang="scss">
#destiny2 {
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