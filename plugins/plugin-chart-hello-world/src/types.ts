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
import {
  QueryFormData,
  supersetTheme,
  TimeseriesDataRecord,
} from '@superset-ui/core';
import { ColorFormatters } from '@superset-ui/chart-controls';
export interface HelloWorldStylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

interface HelloWorldCustomizeProps {
  headerText: string;
}

export type HelloWorldQueryFormData = QueryFormData &
  HelloWorldStylesProps &
  HelloWorldCustomizeProps;

type QueryDataRefined = {
  keyColumn: String;
  valueColumn: String;
  data: TimeseriesDataRecord[];
  mapLevel: String;
};

type QueryDataRefined2 = {
  keyColumn: String;
  valueColumn: String[];
  data: TimeseriesDataRecord[];
  mapLevel: String;
};

export type HelloWorldProps = HelloWorldStylesProps &
  HelloWorldCustomizeProps & {
    circle: QueryDataRefined;
    polygon: QueryDataRefined2;
    height: number;
    width: number;
    mapLevel: String;
    color: String;
    boldText: Boolean;
    headerFontSize: String;
    headerText: String;
    showPolygonLayer: Boolean;
    showStreetMap: Boolean;
    showCircleLayer: String;
    metricColorFormatters: ColorFormatters;
    numberFormat: string;
    // add typing here for the props you pass in from transformProps.ts!
  };
