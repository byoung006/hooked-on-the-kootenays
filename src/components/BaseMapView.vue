<template>
  <div id='viewDiv' ref='viewDiv'></div>
  <Transition name="slide-fade" mode="out-in">
    <AddMapPoint v-if="isModalOpen" :fields="fieldMappings" :form-data="formData" :new-point='newPoint'
      @save="handleCreatePoint" @close="closeModal" />
  </Transition>
</template>

<script lang="ts">
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import AddMapPoint from './AddMapPoint.vue';
import { defineComponent, ref, reactive, onMounted, provide, watch } from 'vue';
import { fieldMappings, type PointData } from '../../server/api/utils';


interface Field {
  fieldName: string;
}

type PointDataKeys = Exclude<keyof PointData, 'latitude' | 'longitude'>[];
export default defineComponent({
  name: 'BaseMapView',
  components: {
    AddMapPoint
  },
  setup() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    let isModalOpen = ref(false);
    let isPointAdded = ref(false);
    const modalFields = ref<Field[]>([
      { fieldName: 'Name' },
      { fieldName: 'Latitude' },
      { fieldName: 'Longitude' },
      { fieldName: 'Camping' },
      { fieldName: 'Trail Length' },
      { fieldName: 'Dog Friendly' },
      { fieldName: 'Hike Difficulty Level' },
      { fieldName: 'Hike In' },
      { fieldName: 'Link to Website' },
    ]);
    const formData = ref<PointData>({} as PointData);
    let pointDataKeys: PointDataKeys = reactive([
      'name',
      'camping',
      'trailLength',
      'dogFriendly',
      'hikeIn',
      'linkToWebsite',
      'hikeDifficultyLevel'
    ]);

    const newPoint = ref({ latitude: 0, longitude: 0 });
    const csvData = ref<PointData[]>([]);
    const PointModule = ref<typeof Point | null>(null);
    const GraphicModule = ref<typeof Graphic | null>(null);
    const clickTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    const singleClick = ref(true);

    const map = new Map({
      basemap: 'topo-vector',
    });

    const view = new MapView({
      map: map,
      center: [-116, 50],
      navigation: { browserTouchPanEnabled: true, momentumEnabled: true },
      zoom: 8,
    });
    const graphicsLayer = new GraphicsLayer({})
    provide('view', view)
    watch(isPointAdded, (e) => {
      if (e == true) {
        loadMap()

      }
    })
    onMounted(async () => {
      view.container = 'viewDiv'
      loadMap()
    });
    const loadMap = async () => {
      try {
        const response = await fetch(`${API_URL}/api/fishing-spots`);
        const results = await response.json();

        if (!results || !results.data) {
          console.error("Invalid response from /api/fishing-spots");
          return;
        }

        const filteredData = results.data.filter((row: any) => {
          const latitude = parseFloat(row.Latitude);
          const longitude = parseFloat(row.Longitude);
          return !isNaN(latitude) && !isNaN(longitude);
        });

        filteredData.forEach((row: any) => {
          const latitude = parseFloat(row.Latitude);
          const longitude = parseFloat(row.Longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const point = new Point({
              longitude: longitude,
              latitude: latitude,
            });

            const markerSymbol = new SimpleMarkerSymbol({
              color: [226, 119, 40],
              outline: {
                color: [255, 255, 255],
                width: 1,
              },
            });

            const graphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
              attributes: row,
              popupTemplate: {
                title: `Fishin' in the Koots`,
                content: [
                  {
                    type: 'fields',
                    fieldInfos: [
                      { fieldName: 'Name' },
                      { fieldName: 'Latitude' },
                      { fieldName: 'Longitude' },
                      { fieldName: 'Camping' },
                      { fieldName: 'Trail Length' },
                      { fieldName: 'Dog Friendly' },
                      { fieldName: 'Hike Difficulty Level' },
                      { fieldName: 'Hike In' },
                      { fieldName: 'Link to Website' },
                    ],
                  },
                ],
              },
            });
            graphicsLayer.add(graphic);
          }
        });

        map.add(graphicsLayer);
        graphicsLayer.load();
        view.on('click', handleClick);
        view.on('double-click', handleDblClick);
      } catch (error) {
        console.error(error, 'the error');
      }
    };
    const handleClick = async (event: any) => {
      const response = await view.hitTest(event);
      const newLongitude = event.mapPoint.longitude;
      const newLatitude = event.mapPoint.latitude;

      const isCloseToExistingPoint = response.results.some((graphic: any) => {
        const existingLongitude = graphic?.graphic?.geometry?.longitude;
        const existingLatitude = graphic?.graphic?.geometry?.latitude;
        return (
          Math.abs(existingLongitude - newLongitude) < 0.01 &&
          Math.abs(existingLatitude - newLatitude) < 0.01
        );
      });
      clickTimer.value = setTimeout(() => {
        if (!isCloseToExistingPoint) {
          newPoint.value.longitude = newLongitude;
          newPoint.value.latitude = newLatitude;
          addPoint();
        }
      }, 250);

    };
    // We handle double click separately to ensure we don't mess with the map view functionality
    // provided by the arc-gis module imports
    const handleDblClick = () => {
      if (clickTimer.value) {
        clearTimeout(clickTimer.value);
        clickTimer.value = null;
      }
      singleClick.value = false;
      setTimeout(() => {
        singleClick.value = true;
      }, 500);
    };
    const addPoint = async () => {
      if (!isNaN(newPoint.value.latitude) && !isNaN(newPoint.value.longitude)) {
        formData.value = {
          name: '',
          latitude: newPoint.value.latitude,
          longitude: newPoint.value.longitude,
          camping: '',
          trailLength: 0,
          dogFriendly: '',
          hikeDifficultyLevel: 0,
          hikeIn: '',
          linkToWebsite: '',
        };

        isModalOpen.value = true;
      }
    };
    const handleCreatePoint = async (formDataValue: PointData) => {
      if (graphicsLayer) {
        const point = new Point({
          longitude: formDataValue.longitude,
          latitude: formDataValue.latitude,
        });

        const markerSymbol = new SimpleMarkerSymbol({
          color: [0, 0, 255],
          outline: { color: [255, 255, 255], width: 1 },
        });

        const graphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          attributes: formDataValue,
          popupTemplate: {
            title: `Fishin' in the Koots`,
            content: [{ type: 'fields', fieldInfos: Object.keys(formDataValue).map((key) => ({ fieldName: key })) }],
          },
        });

        csvData.value.push(formDataValue);

        try {
          const response = await fetch(`${API_URL}/api/update-csv`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataValue),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          console.log('CSV updated successfully.');
          graphicsLayer.add(graphic);
          isPointAdded.value = true;
        } catch (error) {
          console.error('Error updating CSV:', error);
        }

        closeModal();
      }
    };
    const closeModal = () => {
      isModalOpen.value = false;
    }
    return {
      isModalOpen,
      modalFields,
      formData,
      pointDataKeys,
      newPoint,
      graphicsLayer,
      csvData,
      PointModule,
      GraphicModule,
      view,
      clickTimer,
      singleClick,
      handleClick,
      handleDblClick,
      addPoint,
      handleCreatePoint,
      closeModal,
      fieldMappings,
    };
  },
});
</script>
<style>
/* esri styles */
@import url('https://js.arcgis.com/4.4/esri/themes/light/main.css');

#viewDiv {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(100%);
  /* Start from the bottom */
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
  /* End at the bottom */
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  /* Move to the center/original position */
}

.esri-popup {
  border-radius: 4px;
}

/* Hide popup pointer */
.esri-popup__pointer>div {
  display: none;
}

#viewDiv>div.esri-view-root>div.esri-view-surface.esri-view-surface--touch-none>canvas {
  display: flex;
}
</style>
