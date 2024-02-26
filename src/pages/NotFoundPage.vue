<template>
    <div class="container-fluid">
        <img src="../../public/images/404.svg" alt="notFound" class="notFoundIcon">
        <router-link to="/" type="button" class="btn btn-primary">Вернуться на главную</router-link>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.notFoundIcon {
    margin-top: 10vh;
    height: 50vh;
    width: 100%;
}

.btn {
    display: flex;
    margin: 0 auto;
    max-width: max-content;
    margin-top: 10px;
}
</style>