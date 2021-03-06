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
  buildQueryContext,
  QueryFormData,
  QueryObject,
} from '@superset-ui/core';
import { pivotOperator } from '@superset-ui/chart-controls';

/**
 * The buildQuery function is used to create an instance of QueryContext that's
 * sent to the chart data endpoint. In addition to containing information of which
 * datasource to use, it specifies the type (e.g. full payload, samples, query) and
 * format (e.g. CSV or JSON) of the result and whether or not to force refresh the data from
 * the datasource as opposed to using a cached copy of the data, if available.
 *
 * More importantly though, QueryContext contains a property `queries`, which is an array of
 * QueryObjects specifying individual data requests to be made. A QueryObject specifies which
 * columns, metrics and filters, among others, to use during the query. Usually it will be enough
 * to specify just one query based on the baseQueryObject, but for some more advanced use cases
 * it is possible to define post processing operations in the QueryObject, or multiple queries
 * if a viz needs multiple different result sets.
 */
export default function buildQuery(formData: QueryFormData) {
  console.log(formData);
  const {
    adhoc_filters,
    adhoc_filters_b,
    groupby,
    groupby_b,
    limit,
    limit_b,
    metrics,
    metrics_b,
    ...baseFormData
  } = formData;

  const formData1 = {
    ...baseFormData,
    adhoc_filters,
    columns: groupby,
    limit,
    metrics,
  };

  const formData2 = {
    ...baseFormData,
    adhoc_filters: adhoc_filters_b,
    columns: groupby_b,
    limit: limit_b,
    metrics: metrics_b,
  };

  const queryContextA = buildQueryContext(formData1, baseQueryObject => {
    const queryObjectA = {
      ...baseQueryObject,
      post_processing: [pivotOperator(formData1, baseQueryObject)],
    } as QueryObject;
    return [queryObjectA];
  });
  const queryContextB = buildQueryContext(formData2, baseQueryObject => {
    const queryObjectB = {
      ...baseQueryObject,
      post_processing: [pivotOperator(formData2, baseQueryObject)],
    } as QueryObject;
    return [queryObjectB];
  });
  console.log('groupBy', groupby);
  console.log('groupBy_b', groupby_b);
  if (Array.isArray(groupby) && Array.isArray(groupby_b)) {
    console.log('Both null');
    return;
  }
  if (Array.isArray(groupby)) {
    console.log('1st null ');

    return {
      ...queryContextA,
      queries: [...queryContextB.queries],
    };
  } else if (Array.isArray(groupby_b)) {
    console.log('2nd null ');
    return {
      ...queryContextA,
      queries: [...queryContextA.queries],
    };
  } else if (groupby_b && groupby) {
    console.log('both available');
    return {
      ...queryContextA,
      queries: [...queryContextA.queries, ...queryContextB.queries],
    };
  }
}
