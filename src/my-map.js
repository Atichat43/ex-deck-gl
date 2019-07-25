import React, { Component, Fragment } from 'react'
import { DeckGL } from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { GridCellLayer, ScatterplotLayer } from '@deck.gl/layers'
import MAPBOX_TOKEN from './constant'
import LayerManager from './LayerManager'

import { DEFAULT_LAYER_GROUPS, DEFAULT_MAP_STYLES } from './default-settings';

const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

class MyMap extends Component {
  state = {
    mapStyle: "mapbox://styles/mapbox/light-v9",
    renderableLayer: [],
    visibleLayer: {
      gridCellLayer: true,
      scatterplotLayer: true,
    },
    reloading: true
  }

  componentDidMount() {
    const layers = [
      { id: 'grid-cell-layer', label: 'Grid cell layer' },
      { id: 'scatterplot-layer', label: 'Scatter plot layer' }
    ]
    this.setState(() => ({renderableLayer: layers, reloading: false}))
  }

  getLayerOptions = (layers=[]) => {
    return layers.map(layer => {
      return { id: layer.id, label: layer.id }
    })
  }

  handleUpdateConfig = config => {
    const { staticMap } = this
    const slugFilter = DEFAULT_LAYER_GROUPS.find(lg => lg.slug === config.slug).filter
    const styles = staticMap.getStyle()

    styles.layers.filter(layer => {
      if (slugFilter(layer) !== null)
        staticMap.setLayoutProperty(layer.id, 'visibility',
          config.value ? 'visible' : 'none')
    })
  }

  handleChangeMapStyle = styleId => {
    const { staticMap } = this
    const mapStyle = DEFAULT_MAP_STYLES.find(style => style.id === styleId).url
    this.setState(() => ({ mapStyle }))
    staticMap.setStyle(mapStyle)
  }

  handleUpdateLayer = layerOption => {
    this.setState(() => ({reloading: true}))
    switch (layerOption.id) {
      case 'grid-cell-layer':
        this.setState(state => {state.visibleLayer.gridCellLayer = layerOption.value })
        break;

      case 'scatterplot-layer':
        this.setState(state => {state.visibleLayer.scatterplotLayer = layerOption.value })
        break;

      default:
        break;
    }
    this.setState(() => ({reloading: false}))
  }

  renderLayers = () => {
    const { visibleLayer } = this.state
    const layers =  [
      visibleLayer.gridCellLayer ?
        new GridCellLayer({
          id: 'grid-cell-layer',
          data: [
            { point: [-122.41669, 37.7853], value: 100 }, 
            { point: [-122.42669, 37.7853], value: 50 }
          ],
          visible: true,
          pickable: true,
          extruded: false,
          cellSize: 250,
          getPosition: d => d.point,
          getFillColor: d => [48, 128, d.value * 255, 255],
        }) : null,
      visibleLayer.scatterplotLayer ?
        new ScatterplotLayer({
          id: 'scatterplot-layer',
          data: [
            { name: 'Colma', passengers: 200, coordinates: [-122.466233, 37.684638] },
            { name: 'Civic Center', passengers: 500, coordinates: [-122.413756, 37.779528] },
          ],
          pickable: true,
          opacity: 1,
          stroked: true,
          filled: true,
          radiusScale: 10,
          radiusMinPixels: 1,
          radiusMaxPixels: 100,
          lineWidthMinPixels: 1,
          getPosition: d => d.coordinates,
          getRadius: d => Math.sqrt(d.passengers),
          getFillColor: d => [255, 140, 0],
          getLineColor: d => [0, 0, 0],
        }) : null,
    ]
    return layers.length !== 0 ? layers : []
  }

  render() {
    const { mapStyle, renderableLayer, reloading } = this.state
    const { renderLayers } = this

    return (
      <Fragment>
        { renderableLayer.length !== 0 && <LayerManager
          _updateConfig={this.handleUpdateConfig}
          _changeMapStyle={this.handleChangeMapStyle}
          _updateLayer={this.handleUpdateLayer}
          layerOptions={renderableLayer}>
        </LayerManager>}
        { reloading ? <div></div> :
          <DeckGL
            ref={ref => { this.deckGl = ref }}
            initialViewState={initialViewState}
            controller={true}
            layers={renderLayers()}
          >
            <StaticMap
              ref={ref => { this.staticMap = ref && ref.getMap() }}
              mapStyle={mapStyle}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              onLoad={this.handleLoadStaticMap}
            >
            </StaticMap>
          </DeckGL>
        }
      </Fragment>
    )
  }
}

export default MyMap