<template>
    <div class="container-fluid">
        <router-link to="/" type="button" class="btn btn-primary mb-2 mt-4">Вернуться на главную</router-link>
        <div class="content">
            <ul class="list-group me-2 mb-2">
                <li class="list-group-item active" aria-current="true">Информация о маршртуе</li>
                <li class="list-group-item">
                    Маршрут № {{ this.routeData.Name }}
                </li>
                <li class="list-group-item"> {{ this.routeData.Description }}</li>
                <li class="list-group-item">Колличество остановок на маршруте: {{ this.routeData.Stops }}</li>
            </ul>

            <div class="stops">
                <ul v-if="this.forwardStops.length > 0" class="list-group me-2 mb-2">
                    <li class="list-group-item active" aria-current="true">Остановки в прямом направлении</li>
                    <li v-for="stop in forwardStops" :key="stop.ID" class="list-group-item" style="color: blue;">
                        {{ stop.Name }}
                    </li>
                </ul>

                <ul v-if="this.notForwardSstops.length > 0" class="list-group">
                    <li class="list-group-item active" aria-current="true">Остановки в обратном направлении</li>
                    <li v-for="stop in notForwardSstops" :key="stop.ID" class="list-group-item" style="color: red;">
                        {{ stop.Name }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        routeData() {
            return this.$route?.query?.data ?? 'Нет данных'
        },

        forwardStops() {
            return this.$route?.query?.data?.Stop?.filter(item => item.Forward) ?? 'Нет данных'
        },

        notForwardSstops() {
            return this.$route?.query?.data?.Stop?.filter(item => !item.Forward) ?? 'Нет данных'
        }
    }

}
</script>
<style scoped>
.content,
.stops {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
</style>