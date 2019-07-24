export const CLOUDFRONT = 'https://d1a3f4spazzrp4.cloudfront.net/kepler.gl';
export const ICON_PREFIX = `${CLOUDFRONT}/geodude`;

export const DEFAULT_LAYER_GROUPS = [
  {
    slug: 'label',
    filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
    defaultVisibility: true,
  },
  {
    slug: 'road',
    filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
    defaultVisibility: true,
  },
  {
    slug: 'border',
    filter: ({id}) => id.match(/border|boundaries/),
    defaultVisibility: false
  },
  // {
  //   slug: 'building',
  //   filter: ({id}) => id.match(/building/),
  //   defaultVisibility: true
  // },
  {
    slug: 'water',
    filter: ({id}) => id.match(/(?=(water|stream|ferry))/),
    defaultVisibility: true
  },
  {
    slug: 'land',
    filter: ({id}) => id.match(/(?=(parks|landcover|industrial|sand|hillshade))/),
    defaultVisibility: true
  },
  // {
  //   slug: '3d building',
  //   filter: () => false,
  //   defaultVisibility: false
  // }
];

export const DEFAULT_MAP_STYLES = [
  // from kepler
  {
    id: 'dark',
    label: 'Dark',
    url: 'mapbox://styles/uberdata/cjoqbbf6l9k302sl96tyvka09',
    icon: `${ICON_PREFIX}/UBER_DARK_V2.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'muted_night',
    label: 'Muted Night',
    url: 'mapbox://styles/uberdata/cjfxhlikmaj1b2soyzevnywgs',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  // from map box doc
  {
    id: 'streets-v11',
    label: 'Street',
    url: 'mapbox://styles/mapbox/streets-v11',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'outdoors-v11',
    label: 'Out door v11',
    url: 'mapbox://styles/mapbox/outdoors-v11',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'light-v10',
    label: 'Light 10',
    url: 'mapbox://styles/mapbox/light-v10',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  },
  {
    id: 'dark-v10',
    label: 'Dark 10',
    url: 'mapbox://styles/mapbox/dark-v10',
    icon: `${ICON_PREFIX}/UBER_MUTED_NIGHT.png`,
    layerGroups: DEFAULT_LAYER_GROUPS
  }
];