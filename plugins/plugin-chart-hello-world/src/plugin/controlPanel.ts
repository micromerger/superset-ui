/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t, TimeseriesDataRecord } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
  ControlPanelSectionConfig,
  D3_FORMAT_OPTIONS,
  D3_FORMAT_DOCS,
} from '@superset-ui/chart-controls';

console.log('-------', sharedControls);

function createQuerySection(
  label: string,
  controlSuffix: string,
): ControlPanelSectionConfig {
  return {
    label,
    expanded: true,
    controlSetRows: [
      [
        {
          name: `groupby${controlSuffix}`,
          config: {
            ...sharedControls.groupby,
            multi: false,
            optional: true,
            label: t('Location'),
            description: t('Area id from Data Source'),
          },
        },
      ],
      [
        {
          name: `map_level${controlSuffix}`,
          config: {
            type: 'SelectControl',
            label: t('Location Level'),
            default: 'province',
            choices: [
              ['province', 'Province'],
              ['district', 'District'],
            ],
            description: t('The Map Detail Level'),
            renderTrigger: true,
          },
        },
      ],
      [
        {
          name: `metrics${controlSuffix}`,
          config:
            controlSuffix === '_b'
              ? { ...sharedControls.metrics, optional: true, validators: [] }
              : { ...sharedControls.metric, optional: true, validators: [] },
        },
      ],

      [
        {
          name: `adhoc_filters${controlSuffix}`,
          config: { ...sharedControls.adhoc_filters },
        },
      ],
      [
        {
          name: `row_limit${controlSuffix}`,
          config: {
            ...sharedControls.row_limit,
          },
        },
      ],
    ],
  };
}

const config: ControlPanelConfig = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */

  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: 'Polygon',
      expanded: true,
      controlSetRows: [
        [
          {
            name: `groupby`,
            config: {
              ...sharedControls.groupby,
              multi: false,
              optional: true,
              label: t('Location'),
              description: t('Area id from Data Source'),
            },
          },
        ],
        [
          {
            name: `map_level`,
            config: {
              type: 'SelectControl',
              label: t('Location Level'),
              default: 'province',
              choices: [
                ['province', 'Province'],
                ['district', 'District'],
              ],
              description: t('The Map Detail Level'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: `metrics`,
            config: {
              ...sharedControls.metric,
              optional: true,
              validators: [],
            },
          },
        ],

        [
          {
            name: `adhoc_filters`,
            config: { ...sharedControls.adhoc_filters },
          },
        ],
        [
          {
            name: 'conditional_formatting',
            config: {
              type: 'ConditionalFormattingControl',
              renderTrigger: true,
              label: t('Polygon Conditional formatting'),
              description: t('Apply conditional color formatting to metrics'),
              mapStateToProps(explore) {
                console.log(
                  explore?.controls?.metrics?.value as TimeseriesDataRecord,
                  explore?.datasource?.verbose_map,
                  explore?.controls,
                );
                const value =
                  (explore?.controls?.metrics?.value as TimeseriesDataRecord) ??
                  '';
                // const value2 =
                //   (explore?.controls?.metrics_b
                //     ?.value as TimeseriesDataRecord) ?? '';
                const verboseMap = explore?.datasource?.verbose_map ?? {};
                const metricColumn =
                  typeof value === 'string'
                    ? { value, label: verboseMap[value] ?? value }
                    : { value: value.label, label: value.label };
                //   const metricColumn2 =
                // typeof value2 === 'string'
                //   ? { value2, label: verboseMap[value2] ?? value2 }
                //   : { value: value2.label, label: value2.label };
                const metricsColumns = [metricColumn];
                return {
                  columnOptions: metricsColumns,
                  verboseMap,
                };
              },
            },
          },
        ],
        [
          {
            name: `row_limit`,
            config: {
              ...sharedControls.row_limit,
            },
          },
        ],
      ],
    },
    {
      label: 'Circle',
      expanded: true,
      controlSetRows: [
        [
          {
            name: `groupby_b`,
            config: {
              ...sharedControls.groupby,
              multi: false,
              optional: true,
              label: t('Area ID'),
              description: t('Area id from Data Source'),
            },
          },
        ],
        [
          {
            name: `map_level_b`,
            config: {
              type: 'SelectControl',
              label: t('Area Level'),
              default: 'province',
              choices: [
                ['province', 'Province'],
                ['district', 'District'],
              ],
              description: t('The Map Detail Level'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: `metrics_b`,
            config: {
              ...sharedControls.metrics,
              optional: true,
              validators: [],
            },
          },
        ],
        [
          {
            name: 'show_circle_layer',
            config: {
              type: 'SelectControl',
              label: t('Circle Layer'),
              default: 'percentage',
              choices: [
                ['none', 'None'],
                ['circle', 'Show Values'],
                ['percentage', 'Show Percentage'],
              ],
              description: t('The Map Detail Level'),
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Number format'),
              renderTrigger: true,
              default: 'SMART_NUMBER',
              choices: D3_FORMAT_OPTIONS,
              description: D3_FORMAT_DOCS,
            },
          },
        ],
        [
          {
            name: `adhoc_filters_b`,
            config: { ...sharedControls.adhoc_filters },
          },
        ],
        [
          {
            name: `row_limit_b`,
            config: {
              ...sharedControls.row_limit,
            },
          },
        ],
      ],
    },
    {
      label: t('Map Controls!'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'show_street_map',
            config: {
              type: 'CheckboxControl',
              label: t('Street Map'),
              renderTrigger: true,
              default: true,
              description: t('Whether to show the street map layer'),
            },
          },
          {
            name: 'show_polygon_layer',
            config: {
              type: 'CheckboxControl',
              label: t('Polygon Layer'),
              renderTrigger: true,
              default: true,
              description: t('Whether to show the ploygon map'),
            },
          },
        ],
        ['color_picker'],
      ],
    },
  ],
};

export default config;

// [
//   {
//     name: 'populate',
//     config: {
//       ...sharedControls.groupby,
//       label: t('Populate'),
//       description: t('Value to Show on chart'),
//       validators: [validateNonEmpty],
//       default: 'value',
//       choices: [
//         // [value, label]
//         ['valColumn', 'Value Prop'],
//         ['metrics', 'Calculation'],
//       ],
//     },
//   },
// ],
