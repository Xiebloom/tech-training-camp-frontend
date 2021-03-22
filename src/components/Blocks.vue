<template>
    <div class="buttonblock">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Blocks'
}
</script>

<style scoped>
.buttonblock {
    /* float: left; */
    display: flex;
    justify-content: space-around;
    /* border: 3px rgba(255, 255, 255, .3) solid; */
    border-radius: 5px;
}
</style>
