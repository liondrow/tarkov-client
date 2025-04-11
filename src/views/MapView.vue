<template>
  <div id="main-screen">
    <div class="preloader preloader-full" v-show="loading">
      <img src="../assets/images/loader.gif" alt="" width="50px">
    </div>
    <div class="container">
      <div class="row">
        <back-btn />
        <div class="col wallet-wrapper my-5" >
          <router-link to="wallet">
            <i class="fa-solid fa-ruble-sign"></i> {{ wallet }}
          </router-link>
        </div>
      </div>
      <div class="d-flex align-items-start justify-content-center quest-wrapper market-wrapper col-12" style="min-height: 600px">
        <div id="map" style="width:100%; height: 100%; min-height: 600px; overflow: hidden;padding: 20px 0;"></div>
      </div>

    </div>
  </div>
</template>

<script>
import API from "@/services/api.js";
import BackBtn from "@/components/BackBtn.vue";
export default {
  name: "Map",
  components: {BackBtn},
  data() {
    return {
      loading: false,
      wallet: 0,
      polling: null,
      points: []
    };
  },
  computed: {

  },
  mounted() {
    this.loading = true;
    API.get('map')
        .then((response) => {
          this.points = response.data
          this.loadYandexMap().then(() => {
            this.initMap();
          });
          this.loading = false
        })
    API.get('wallet')
        .then((response) => {
          this.wallet = response.data
          this.loading = false
        });
  },
  methods: {
    convertClipStringToArray(clipString) {
      const values = clipString.split(',').map(item => parseInt(item.trim(), 10));
      return [[values[0], values[1]], [values[2], values[3]]];
    },
    loadYandexMap() {
      const loadScript = (src) => {
        return new Promise((resolve) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          document.head.appendChild(script);
        });
      };

      return loadScript('https://api-maps.yandex.ru/2.1/?apikey=1694de91-3ef5-48cc-9805-b8558fce8699&lang=ru_RU')
          .then(() => {
            return Promise.all([
              loadScript('https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js'),
              loadScript('https://yastatic.net/s3/mapsapi-jslibs/polylabeler/1.0.1/polylabel.min.js'),
            ]);
          });
    },
    initMap() {
      ymaps.ready(['polylabel.create']).then(() => {
        const myMap = new ymaps.Map('map', {
          center: [45.828564, 40.096814],
          zoom: 16,
          controls: ['zoomControl'],
          type: 'yandex#satellite'
        }, {
          restrictMapArea: true
        });
        myMap.events.add('click', function (e) {
          const coords = e.get('coords');
          console.log('Координаты клика:', coords);
        });

        myMap.controls.get('zoomControl').options.set({ size: 'small' });

        const background = new ymaps.Polygon([
          [
            [45.849051291410404, 40.051967465271],
            [45.85067075338717, 40.14045890509035],
            [45.80698864788522, 40.140716397155764],
            [45.807108700936084, 40.05213912664797],
            [45.849051291410404, 40.051967465271],
            [45.829295593720744, 40.09094627981739],
            [45.831365, 40.099637],
            [45.830225, 40.101976],
            [45.825522, 40.099315],
            [45.829160, 40.091214]
          ]
        ], {}, {
          fillColor: '#212020',
          strokeWidth: 0,
          coordRendering: 'straightPath'
        });

        myMap.geoObjects.add(background);

        const pointCollection = new ymaps.GeoObjectCollection();

        const createPlacemark = function(markerId, coord_1, coord_2, markerImage, clip, addr) {
          if(markerId != null && clip != null) {
            console.log(markerId, markerImage, clip)
            markerId = new ymaps.GeoObject({
              geometry: {
                type: "Point",
                coordinates: [+coord_1, +coord_2]
              },
              properties: {
                hintContent: name,
                balloonContent: addr
              }
            }, {
              iconLayout: 'default#image',
              iconImageHref: markerImage,
              iconImageSize: [35, 44],
              iconImageOffset: [-15, -50],
              iconImageClipRect: clip
            });
            pointCollection.add(markerId);
          } else {
            markerId = new ymaps.GeoObject({
              geometry: {
                type: "Point",
                coordinates: [+coord_1, +coord_2]
              },
              properties: {
                hintContent: name,
                balloonContent: addr
              }
            }, {
              preset: 'islands#blackStretchyIcon'
            });
            pointCollection.add(markerId);
          }
        }

        // Добавляем точки
        Object.values(this.points).forEach((point) => {
          const clip = point.clipRect ? this.convertClipStringToArray(point.clipRect) : null;
          createPlacemark(point.id, point.latitude, point.longitude, '/assets/images/points.png', clip, point.name);
        });

        myMap.geoObjects.add(pointCollection);
      });
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
};
</script>

<style scoped>
  #main-screen {
    position: relative;
    color: rgba(255, 255, 255, 0.73);
    overflow: hidden;
  }
</style>
