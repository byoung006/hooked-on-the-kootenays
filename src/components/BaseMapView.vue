<template>
  <div id='viewDiv' @click="handleClick($event)"></div>
</template>

<script lang="ts">
/* eslint-disable */
import { loadModules } from 'esri-loader';
import Papa from 'papaparse'; // Import PapaParse
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
interface PointData {
  name: string;
  latitude: string;
  longitude: string;
  [key: string]: string;
}

interface CsvRow {
  [key: string]: string;
}
export default {
  name: 'BaseMapView',
  mounted() {
    this.loadMap()
  },
  data(): {
    newPoint: PointData;
    csvData: CsvRow[];
    view: MapView | null;
    graphicsLayer: GraphicsLayer | null;
  } {
    return {
      newPoint: {
        name: '',
        latitude: '',
        longitude: '',
      },
      csvData: [],
      view: null,
      graphicsLayer: null,
    };
  },
  methods: {
    async loadMap() {
      try {
        const [ArcGISMap, MapView, GraphicsLayer, Graphic, Point, SimpleMarkerSymbol, watchUtils] = await loadModules([
          'esri/Map',
          'esri/views/MapView',
          'esri/layers/GraphicsLayer',
          'esri/Graphic',
          'esri/geometry/Point',
          'esri/symbols/SimpleMarkerSymbol',
          'esri/core/watchUtils'
        ])

        const map = new ArcGISMap({
          basemap: 'topo-vector',
        });
        this.view = new MapView({
          container: this.$el.id,
          map: map,
          center: [-116, 50],
          zoom: 8,
        });

        const graphicsLayer = new GraphicsLayer({
          popupEnabled: true,

        });
        map.add(graphicsLayer);
        fetch('../FishingSpotsKootenays.csv')
          .then(response => response.text())
          .then(csvText => {
            Papa.parse(csvText, {
              header: true,
              complete: (results: any) => {
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
                    const fieldInfos = Object.keys(row).map(key => ({ fieldName: key }));
                    const graphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol,
                      attributes: row,
                      popupTemplate: {
                        title: `Fishin' in the Koots`,
                        content: [{
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
                            { fieldName: 'Link to Website' }
                          ]
                        }]
                      }
                    });
                    graphicsLayer.add(graphic);
                  }
                });
              },
            });
          });
        watchUtils.whenTrue(this.view, 'updating', () => {
          console.log('MapView is finished updating.');
        });
      } catch (error) {
        console.error(error)
      }
    },
    async handleClick(event: MouseEvent) {
      try {
        const mapPoint = this.view!.toMap({ x: event.x, y: event.y });
        if (mapPoint) {
          let clickedGraphic = null;
          this.graphicsLayer!.graphics.items.forEach((graphic) => {
            if (graphic.geometry.type === 'point') {
              const pointGeometry = graphic.geometry;
              if (Math.abs(pointGeometry.x - mapPoint.x) < 1000 && Math.abs(pointGeometry.y - mapPoint.y) < 1000) {
                clickedGraphic = graphic;
              }
            }
          });
          if (clickedGraphic) {
            let content = '';
            for (const key in clickedGraphic.attributes) {
              if (clickedGraphic.attributes.hasOwnProperty(key)) {
                content += `<p><b>${key}</b> ${clickedGraphic.attributes[key]}</p>`;
              }
            }
            if (this.view) {
              this.view.popup.open({ location: clickedGraphic.geometry, title: clickedGraphic.attributes.Name, content });
            }
          } else {
            this.addPoint();
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    addPoint() {
      loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
      ], {
        css: true,
      })
        .then(([ArcGISMap, MapView, GraphicsLayer, Graphic, Point, SimpleMarkerSymbol]) => {
          console.log('we addin')
          const latitude = parseFloat(this.newPoint.latitude);
          const longitude = parseFloat(this.newPoint.longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const point = new Point({
              longitude: longitude,
              latitude: latitude,
            });

            const markerSymbol = new SimpleMarkerSymbol({
              color: [0, 0, 255],
              outline: {
                color: [255, 255, 255],
                width: 1,
              },
            });

            const newRow: PointData = { ...this.newPoint };
            this.csvData.push(newRow);

            const graphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
              attributes: newRow,
              popupTemplate: {
                title: `Fishin' in the Koots`,
                content: [{
                  type: 'fields',
                  fieldInfos: Object.keys(newRow).map(key => ({ fieldName: key }))
                }]
              }
            });

            this.graphicsLayer?.add(graphic);

            fetch('http://localhost:3000/update-csv', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.newPoint),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
              })
              .then(() => {
                console.log('CSV updated successfully.');
              })
              .catch((error: any) => {
                console.error('Error updating CSV:', error);
              });

            this.newPoint = { name: '', latitude: '', longitude: '' };
          }
        },
        )
    },
  },
};
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

.esri-popup {
  border-radius: 4px;
}

/* Hide popup pointer */
.esri-popup__pointer>div {
  display: none;
}
</style>
