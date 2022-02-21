## @superset-ui/plugin-chart-piechart-map

[![Version](https://img.shields.io/npm/v/@superset-ui/plugin-chart-piechart-map.svg?style=flat-square)](https://www.npmjs.com/package/@superset-ui/plugin-chart-piechart-map)

This plugin provides Piechart Map for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import PiechartMapChartPlugin from '@superset-ui/plugin-chart-piechart-map';

new PiechartMapChartPlugin().configure({ key: 'piechart-map' }).register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-piechart-map) for more details.

```js
<SuperChart
  chartType="piechart-map"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── PiechartMap.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```
