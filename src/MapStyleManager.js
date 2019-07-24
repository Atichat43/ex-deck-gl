import React, { Component } from 'react'
import { DEFAULT_MAP_STYLES } from './default-settings';

export class LayerManager extends Component {
  state = {
    editableStyles: null,
  }

  componentDidMount = () => {
    // const editableLayers = DEFAULT_MAP_STYLES.map(layer => {
    //   return {...layer, value: layer.defaultVisibility}
    // })
    
    this.setState(() => ({editableStyles}))
  }

  render() {
    const { editableStyles } = this.state

    return (
      <div className="map-style-manager">
        <div className="map-style-manager__header">
          <p> Setting Map Style Layer </p>
        </div>
        <div className="map-manager__body">
          {editableStyles && editableStyles.map((layer) => {
            return (
              <div key={layer.slug} className="layer-manager__body-item">
                <button onClick={() => this._handleToggle(layer.slug)}> 
                  {layer.slug }
                </button>
            </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default LayerManager
