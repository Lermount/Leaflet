<template>
    <div class="table">
        <div class="buttons mt-4 mb-2 ps-2 pe-2 d-flex justify-content-between">
            <button type="button" class="btn btn-primary" :class="{ 'active': routesIsSelected }"
                @click="selectRoutes">Маршруты</button>
            <button type="button" class="btn btn-primary" :class="{ 'active': !routesIsSelected }"
                @click="selectStops">Остановки</button>
        </div>

        <ag-grid-vue class="ag-theme-quartz" :columnDefs="columnDefs" :rowData="routesData" :getRowStyle="getRowStyle"
            rowSelection="single" @cell-context-menu="onCellContextMenu" @cell-clicked="onCellClicked" />

        <div v-show="showContextMenu" class="context-menu" :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }">
            <button id="modal-button" type="button" class="btn btn-info">Подробно</button>
        </div>
    </div>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-quartz.css";
export default {

    props: ['routesData', 'routesIsSelected', 'currentRoute'],

    components: {
        AgGridVue,
    },

    data: () => ({
        showContextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
    }),

    setup() {
        return {
            //Заголовки  таблицы
            columnDefs: [
                { headerName: "Name", field: "Name" },
                { headerName: "Stops", field: "Stops" },
            ],
        };
    },

    mounted() {
        //Отключаем стандарное поведение браузера при ПКМ
        this.disableContextMenu();
    },

    watch: {
        routesIsSelected() {
            this.toggleFlag()
        }
    },

    methods: {
        //Стили таблицы
        getRowStyle(params) {
            if (params?.data?.ID === this.currentRoute) {
                return { background: "lightblue" };
            }
            return { cursor: "pointer" };
        },

        //Получаем ID выбранного маршрута\остановки и эмитим его
        onCellClicked(params) {
            const clickedRowData = params.node.data;
            const clickedRowId = clickedRowData.ID;
            this.$emit('row-clicked', clickedRowId);
        },

        //Выбираем Маршруты и сбрасываем массив currentRoute
        selectRoutes() {
            this.$emit('select-routs', true);
            this.$emit('row-clicked', []);
        },
        //Выбираем Остановки и сбрасываем массив currentRoute
        selectStops() {
            this.$emit('select-routs', false);
            this.$emit('row-clicked', []);
        },

        //Отключаем стандарное поведение браузера при ПКМ
        disableContextMenu() {
            document.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        },
        //Добавляем кастомный клик ПКМ
        onCellContextMenu(params) {
            if (this.routesIsSelected) {
                //координаты клика
                this.contextMenuX = params.event.clientX;
                this.contextMenuY = params.event.clientY;

                //Показываем всплывашку
                this.showContextMenu = true;

                //Получаем ID маршрута у которого вызвали модалку
                const clickedRowData = params.node.data;
                const clickedRowId = clickedRowData.ID;
                const buttonElement = document.getElementById('modal-button');
                //Навешиваем событие на кнопку в модалке
                const onButtonClick = () => {

                    //Не самый лучший способ передать данные, но для тестового должен сойти
                    this.$router.push({ path: '/route/' + clickedRowId, query: { data: params.node.data } });

                    //Убираем обработчик событий
                    buttonElement?.removeEventListener('click', onButtonClick);
                    this.showContextMenu = false;
                };

                //Проверка на клик вне модалки
                const onClickOutside = (event) => {
                    if (!buttonElement?.contains(event.target)) {
                        buttonElement?.removeEventListener('click', onButtonClick);
                        document.removeEventListener('click', onClickOutside);
                        this.showContextMenu = false;
                    }
                };

                //Навешиваем обработчики событий
                buttonElement?.addEventListener('click', onButtonClick);
                document?.addEventListener('click', onClickOutside);
            }
        },

        //Меняем заголовки столбцов при переключении таблицы
        toggleFlag() {
            if (this.routesIsSelected) {
                this.columnDefs = [
                    { headerName: 'Name', field: 'Name' },
                    { headerName: 'Stops', field: 'Stops' },
                ];
            } else {
                this.columnDefs = [
                    { headerName: 'Name', field: 'Name' },
                    { headerName: 'Forward', field: 'Forward', valueGetter: this.getForward }
                ];
            }
        },
        //Прописываем название направления
        getForward(params) {
            return params.data.Forward ? 'Прямое' : 'Обратное';
        },
    }
};
</script>
<style scoped>
.table {
    flex: 1 1 20%;
}

.ag-theme-quartz {
    width: 100%;
    height: calc(100vh - 55px);
}

.active {
    background-color: #198754 !important;
    border-color: #198754 !important;
}

.context-menu {
    position: absolute;
}
</style>