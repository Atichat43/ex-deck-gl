import React, { Component } from 'react'
import './LayerManager.scss'
import { DEFAULT_LAYER_GROUPS, DEFAULT_MAP_STYLES } from './default-settings';

export class LayerManager extends Component {
  state = {
    editableLayers: null,
    editableStyle: [...DEFAULT_MAP_STYLES],
    editableOptions: null,
    styleId: null,
  }

  componentDidMount = () => {
    const editableLayers = DEFAULT_LAYER_GROUPS.map(layer => {
      return {...layer, value: layer.defaultVisibility}
    })

    const editableOptions = this.props.layerOptions.map(option => {
      return {...option, value: true}
    })
    
    this.setState(() => ({editableLayers, editableOptions}))
  }

  _handleConfigToggle = slug => {
    const {editableLayers} = this.state
    const newConfig = [...editableLayers]
    const index = editableLayers.findIndex(layer => layer.slug === slug)
    
    newConfig[index] = {slug: editableLayers[index].slug, value: !editableLayers[index].value}
    this.setState(() => ({editableLayers: newConfig}))
    this.props._updateConfig(newConfig[index])
  }

  _handleStyleToggle = styleId => {
    if (styleId !== this.state.styleId) { 
      this.props._changeMapStyle(styleId)
      this.setState(() => ({styleId}))
    } 
  }

  _handleLayerToggle = layerId => {
    const {editableOptions} = this.state
    const newOptions = [...editableOptions]
    const index = editableOptions.findIndex(option => option.id === layerId)
    const prevOption = editableOptions[index]

    newOptions[index] = { 
      id: prevOption.id, 
      label: prevOption.label, 
      value: !prevOption.value
    }

    this.setState(() => ({editableOptions: newOptions}))
    this.props._updateLayer(newOptions[index])
  }

  render() {
    const { editableLayers, editableStyle, editableOptions } = this.state

    return (
      <div className="layer-manager">
        <div className="layer-manager__header">
          <p> Setting Static Map Layer </p>
        </div>
        <div className="layer-manager__body">
          {editableLayers && editableLayers.map(layer => {
            return (
              <div key={layer.slug} className="layer-manager__body-item">
                <button onClick={() => this._handleConfigToggle(layer.slug)}> 
                  {layer.slug }
                </button>
              </div>
            )})
          }
          <div className="layer-manager__header">
            <p> Setting Map Style </p>
          </div>
          { editableStyle && editableStyle.map(style => {
            return (
              <div key={style.id} className="layer-manager__body-item">
                <button onClick={() => this._handleStyleToggle(style.id)}>
                  {style.label}
                </button>
              </div>
            )})
          }
          <div className="layer-manager__header">
            <p> Setting Deck gl layer </p>
          </div>
          { editableOptions && editableOptions.map(layer => {
            return (
              <div key={layer.id} className="layer-manager__body-item">
              <button onClick={() => this._handleLayerToggle(layer.id)}>
                {layer.label}
              </button>
            </div>
            )})
          }
        </div>
      </div>
    )
  }
}

export default LayerManager
