<template>
  <div class="container-fluid">
    <img v-if="loading" src="../../public/images/loader.svg" alt="loader">
    <Table v-if="!loading" :routesData="routesData" :routesIsSelected="routesIsSelected" :currentRoute="currentRoute"
      @row-clicked="onRowClicked" @select-routs="selectRouts" />

    <Map v-if="!loading" :currentRouteData="currentRouteData" :currentRouteStops="currentRouteStops"
      :routesIsSelected="routesIsSelected" :currentRoute="currentRoute" :currentRouteName="currentRouteName"
      @select-routs="selectRouts" @row-clicked="onRowClicked" />
  </div>
</template>
<script>
import axios from 'axios';
import Table from '@/components/routes-table.vue';
import Map from '@/components/routes-map.vue';

export default {
  data: () => ({
    routes: null,
    loading: true,
    hasCurrentRoute: false,
    routesIsSelected: true,
    currentRoute: []
  }),

  components: { Table, Map },

  mounted() {
    this.getRoutes();
  },

  methods: {
    //Получаем данные
    getRoutes() {
      axios.get(`https://220.transflow.ru/api/public/v1/routes_data?key=012345678abc`)
        .then(response => {
          this.routes = response?.data || {};
          this.loading = false
        })
        .catch(error => {
          console.error(error);
        });
    },

    //По клику меняем ID текущего маршрута
    onRowClicked(rowId) {
      this.currentRoute = rowId;
      if (!this.hasCurrentRoute) {
        this.hasCurrentRoute = true
      }
    },

    //Переключатель между Маршрутами и Остановками
    selectRouts(item) {
      this.routesIsSelected = item
    }
  },

  computed: {
    //Получаем интересующие нас данные
    routesData() {

      //Данные если выбранны маршруты
      if (this.routesIsSelected) {
        return this.routes?.map(item => {
          return {
            Name: item?.Name,
            Stops: item?.Stops?.length,
            ID: item?.ID,
            Description: item?.Description,
            Stop: item?.Stops
          }
        })
      } else {
        //Данные если выбранны остановки
        const stops = [];
        this.routes.forEach(item => {
          item.Stops.forEach(stop => {
            const { Name, ID, Forward } = stop;
            stops.push({ Name, ID, Forward });
          });
        });
        return stops;
      }
    },

    //Вычисляем координаты текущего маршрута
    currentRouteData() {
      let routeData = this.routes?.filter(item => item.ID == this.currentRoute) || [];
      let pointsData = routeData?.[0]?.Points?.map(item => {
        return {
          lat: item?.Lat,
          lon: item?.Lon,
        }
      })
      return pointsData
    },

    //Вычисляем имя текущего маршрута
    currentRouteName() {
      let routeData = this.routes?.filter(item => item.ID == this.currentRoute) || [];
      let routeName = routeData?.map(item => {
        return {
          Name: item?.Name,
          Description: item?.Description
        }
      })
      return routeName
    },

    //Вычисляем данные всех остановок
    currentRouteStops() {
      //Остановки на маршруте
      if (this.routesIsSelected) {
        let routeData = this.routes?.filter(item => item.ID == this.currentRoute) || [];
        let stopsData = routeData?.[0]?.Stops?.map(item => {
          return {
            lat: item?.Lat,
            lon: item?.Lon,
            forward: item?.Forward,
            ID: item.ID,
            Name: item.Name
          }
        })
        return stopsData
      }
      else {
        //Одиночные остановки
        const stops = [];
        this.routes.forEach(item => {
          // Проходимся по каждому объекту в массиве Stops текущего объекта
          item.Stops.forEach(stop => {
            const { Lat, Lon, Forward, ID, Name } = stop;
            stops.push({ Lat, Lon, Forward, ID, Name });
          });
        });

        //т.к. с Lat и Lon polyline работать отказывается, а времени не так много, то вот мини костыль 
        const transformedStops = stops.map(stop => {
          const { Lat, Lon, Forward, ID, Name } = stop;
          return { lat: Lat, lon: Lon, forward: Forward, ID: ID, Name: Name };
        });

        let stopData = transformedStops.filter(item => item.ID == this.currentRoute) || []
        return stopData
      }
    }

  }
}
</script>
<style scoped>
.container-fluid {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>