<template>
    <div v-if="!loading" class="map-content">
        <!--Немного стиля, что бы не сильно было заметно, что не выводятся все маршруты и все остановки.-->
        <div v-if="currentRoute.length == 0" class="alert alert-primary" role="alert">
            Пожалуйста, выберите {{ this.routesIsSelected ? 'маршрут' : 'остановку' }}!
        </div>

        <div class="map" :class="{ 'blur': currentRoute.length == 0 }">
            <l-map :zoom="zoom" :center="center" ref="map">
                <l-tile-layer :url="tileLayerUrl" />
                <l-circle-marker v-for="(stop, index ) in currentRouteStops" :key="index" :lat-lng="[stop.lat, stop.lon]"
                    :radius="circle.radius" :color="stop.forward ? 'blue' : 'red'" @click="openStop(stop.ID)">
                    <l-tooltip>{{ stop.Name }}</l-tooltip>
                </l-circle-marker>
                <l-polyline :lat-lngs="currentRouteData" :color="polyline.color">
                    <l-tooltip>Маршрут №{{ this.currentRouteName?.[0]?.Name }} <br /> {{
                        this.currentRouteName?.[0]?.Description }}</l-tooltip>
                </l-polyline>
            </l-map>
        </div>
    </div>
</template>
<script>
import { LMap, LTileLayer, LCircleMarker, LPolyline, LTooltip } from 'vue2-leaflet';
import { LatLngBounds, LatLng } from 'leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

//Проблемы c маркерами, в документации предложили такое решение.
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    props: ['currentRouteData', 'currentRouteStops', 'currentRoute', 'routesIsSelected', 'currentRouteName'],

    components: {
        LMap,
        LTileLayer,
        LCircleMarker,
        LPolyline,
        LTooltip
    },

    data() {
        //Настройка карты
        return {
            loading: false,
            center: [],
            zoom: 0,
            tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

            circle: {
                radius: 6,
            },

            polyline: {
                color: 'blue'
            },

        };
    },

    watch: {
        //Следим за изменениями маршутов\остановок и меняем zoom и центр карты
        currentRouteStops: {
            handler(newStops) {
                if (newStops.length > 0) {
                    const bounds = new LatLngBounds();

                    newStops.forEach((stop) => {
                        const point = new LatLng(stop.lat, stop.lon);
                        bounds?.extend(point);
                    });

                    this.center = bounds?.getCenter();
                    this.zoom = this?.$refs?.map?.fitBounds(bounds);
                }
            },
            immediate: true,
        },
    },

    methods: {
        //Клик по остановке на карте
        openStop(ID) {
            this.$emit('select-routs', false);
            this.$emit('row-clicked', ID);
        }
    }


}
</script>
<style scoped>
.map-content {
    flex: 1 1 80%;
    height: 100%;
    position: relative;
}

.alert {
    position: sticky;
    z-index: 1;
    top: 50%;
    left: 50%;
    max-width: max-content;
}

.map {
    height: 100%;
    width: 100%;
}

.blur {
    filter: blur(20px);
}
</style>