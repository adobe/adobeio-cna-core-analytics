/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fetchMock = require('fetch-mock')
const sdk = require('../src')
const mock = require('./mock')
const errorSDK = require('../src/SDKErrors')
const company = 'test-company'
const apiKey = 'test-apikey'
const token = 'test-token'
let sdkClient = {}

function mockResponseWithMethod (url, method, response) {
  fetchMock.reset()
  fetchMock.mock((u, opts) => u === url && opts.method === method, response)
}

test('sdk init error, no companyId passed', async () => {
  await expect(sdk.init(null, apiKey, token)).rejects.toThrow('[AnalyticsSDK:ERROR_SDK_INITIALIZATION] SDK initialization error(s). Missing arguments: companyId')
})

test('sdk init error, no apiKey passed', async () => {
  await expect(sdk.init(company, null, token)).rejects.toThrow('[AnalyticsSDK:ERROR_SDK_INITIALIZATION] SDK initialization error(s). Missing arguments: apiKey')
})

test('sdk init error, no token passed', async () => {
  await expect(sdk.init(company, apiKey)).rejects.toThrow('[AnalyticsSDK:ERROR_SDK_INITIALIZATION] SDK initialization error(s). Missing arguments: token')
})

test('sdk init test', async () => {
  sdkClient = await sdk.init(company, apiKey, token)

  expect(sdkClient.companyId).toBe(company)
  expect(sdkClient.apiKey).toBe(apiKey)
  expect(sdkClient.token).toBe(token)
})

test('getCalculatedMetrics', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/calculatedmetrics'
  const method = 'GET'
  const api = 'getCalculatedMetrics'

  mockResponseWithMethod(url, method, mock.data.calculatedMetrics)
  // check success response
  let res = await sdkClient.getCalculatedMetrics()
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRICS())
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRICS())
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRICS())
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRICS())
})

test('getCalculatedMetricById', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/calculatedmetrics/123'
  const method = 'GET'
  const api = 'getCalculatedMetricById'

  mockResponseWithMethod(url, method, mock.data.calculatedMetric)
  // check success response
  let res = await sdkClient.getCalculatedMetricById(123)
  expect(res.body.id).toEqual('123')

  res = await sdkClient.getCalculatedMetricById(123, {})
  expect(res.body.id).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRIC_BY_ID(), [123])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CALCULATED_METRIC_BY_ID(), [123])
})

test('getCollections', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/collections/suites'
  const method = 'GET'
  const api = 'getCollections'

  mockResponseWithMethod(url, method, mock.data.collections)
  // check success response
  let res = await sdkClient.getCollections()
  expect(res.body.length).toEqual(1)
  expect(res.body[0].name).toEqual('testcollection')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_COLLECTIONS())
})

test('getCollectionById', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/collections/suites/123'
  const method = 'GET'
  const api = 'getCollectionById'

  mockResponseWithMethod(url, method, mock.data.collection)
  // check success response
  let res = await sdkClient.getCollectionById(123)
  expect(res.body.rsid).toEqual('123')

  res = await sdkClient.getCollectionById(123, {})
  expect(res.body.rsid).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_COLLECTION_BY_ID(), [123])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_COLLECTION_BY_ID(), [123])
  mockResponseWithMethod(url, method, mock.errors.Resource_Not_Found.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_COLLECTION_BY_ID(), [123])
})

test('getDateRanges', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/dateranges'
  const method = 'GET'
  const api = 'getDateRanges'

  mockResponseWithMethod(url, method, mock.data.dateRanges)
  // check success response
  let res = await sdkClient.getDateRanges()
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DATE_RANGES())
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DATE_RANGES())
})

test('getDateRangeById', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/dateranges/123'
  const method = 'GET'
  const api = 'getDateRangeById'

  mockResponseWithMethod(url, method, mock.data.dateRange)
  // check success response
  let res = await sdkClient.getDateRangeById(123)
  expect(res.body.id).toEqual('123')

  res = await sdkClient.getDateRangeById(123, {})
  expect(res.body.id).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DATE_RANGE_BY_ID(), [123])
  mockResponseWithMethod(url, method, mock.errors.Resource_Not_Found.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DATE_RANGE_BY_ID(), [123])
})

test('getDimensions', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/dimensions?rsid=123'
  const method = 'GET'
  const api = 'getDimensions'

  mockResponseWithMethod(url, method, mock.data.dimensions)
  // check success response
  let res = await sdkClient.getDimensions(123)
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('111')

  res = await sdkClient.getDimensions(123, {})
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('111')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DIMENSIONS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DIMENSIONS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DIMENSIONS(), [123])
})

test('getDimensionById', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/dimensions/111?rsid=123'
  const method = 'GET'
  const api = 'getDimensionById'

  mockResponseWithMethod(url, method, mock.data.dimension)
  // check success response
  let res = await sdkClient.getDimensionById(111, 123)
  expect(res.body.id).toEqual('111')

  res = await sdkClient.getDimensionById(111, 123, {})
  expect(res.body.id).toEqual('111')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_DIMENSION_BY_ID(), [111, 123])
})

test('getMetrics', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/metrics?rsid=123'
  const method = 'GET'
  const api = 'getMetrics'

  mockResponseWithMethod(url, method, mock.data.metrics)
  // check success response
  let res = await sdkClient.getMetrics(123)
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('111')

  res = await sdkClient.getMetrics(123, {})
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('111')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_METRICS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_METRICS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_METRICS(), [123])
})

test('getMetricById', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/metrics/111?rsid=123'
  const method = 'GET'
  const api = 'getMetricById'

  mockResponseWithMethod(url, method, mock.data.metric)
  // check success response
  let res = await sdkClient.getMetricById(111, 123)
  expect(res.body.id).toEqual('111')

  res = await sdkClient.getMetricById(111, 123, {})
  expect(res.body.id).toEqual('111')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_METRIC_BY_ID(), [111, 123])
  mockResponseWithMethod(url, method, mock.errors.Resource_Not_Found.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_METRIC_BY_ID(), [111, 123])
})

test('getReport', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/reports'
  const method = 'POST'
  const api = 'getReport'

  mockResponseWithMethod(url, method, mock.data.report)
  // check success response
  let res = await sdkClient.getReport(mock.data.reportReq)
  expect(res.body.totalPages).toEqual(10)
  expect(res.body.numberOfElements).toEqual(100)

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_REPORT(), [{}])
  mockResponseWithMethod(url, method, mock.errors.Invalid_Parameter.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_REPORT(), [{}])
})

test('getSegments', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/segments'
  const method = 'GET'
  const api = 'getSegments'

  mockResponseWithMethod(url, method, mock.data.segments)
  // check success response
  let res = await sdkClient.getSegments()
  expect(res.body.length).toEqual(1)
  expect(res.body[0].id).toEqual('111')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_SEGMENTS())
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_SEGMENTS())
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_SEGMENTS())
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_SEGMENTS())
})

test('validateSegment', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/segments/validate?rsid=111'
  const method = 'POST'
  const api = 'validateSegment'

  mockResponseWithMethod(url, method, mock.data.validSegment)
  // check success response
  let res = await sdkClient.validateSegment(111, {})
  expect(res.body.valid).toEqual(true)

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_VALIDATE_SEGMENT(), [111, {}])
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_VALIDATE_SEGMENT(), [111, {}])
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_VALIDATE_SEGMENT(), [111, {}])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_VALIDATE_SEGMENT(), [111, {}])
})

test('getUsers', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/users'
  const method = 'GET'
  const api = 'getUsers'

  mockResponseWithMethod(url, method, mock.data.users)
  // check success response
  let res = await sdkClient.getUsers()
  expect(res.body.length).toEqual(1)
  expect(res.body[0].companyid).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USERS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USERS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USERS(), [123])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USERS(), [123])
})

test('getCurrentUser', async () => {
  const url = 'https://analytics.adobe.io/api/test-company/users/me'
  const method = 'GET'
  const api = 'getCurrentUser'

  mockResponseWithMethod(url, method, mock.data.user)
  // check success response
  let res = await sdkClient.getCurrentUser()
  expect(res.body.companyid).toEqual('123')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_CURRENT_USER())
})

test('getUsageLogs', async () => {
  let url = 'https://analytics.adobe.io/api/test-company/auditlogs/usage?startDate=2021-01-01T00%3A00%3A00-07&endDate=2021-01-02T14%3A32%3A33-07&limit=10&page=0'
  const method = 'GET'
  const api = 'getUsageLogs'

  mockResponseWithMethod(url, method, mock.data.usageLogs)
  // check success response
  let res = await sdkClient.getUsageLogs('2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07')
  expect(res.body.totalElements).toEqual(1)
  expect(res.body.content[0].dateCreated).toEqual('2021-01-01T00:00:00-07')

  // check error responses
  mockResponseWithMethod(url, method, mock.errors.Bad_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USAGE_LOGS(), ['2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07'])
  mockResponseWithMethod(url, method, mock.errors.Unauthorized_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USAGE_LOGS(), ['2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07'])
  mockResponseWithMethod(url, method, mock.errors.Forbidden_Request.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USAGE_LOGS(), ['2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07'])
  mockResponseWithMethod(url, method, mock.errors.Internal_Server_Error.err)
  res = await checkErrorResponse(api, url, method, new errorSDK.codes.ERROR_GET_USAGE_LOGS(), ['2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07'])

  // override defaults
  url = 'https://analytics.adobe.io/api/test-company/auditlogs/usage?startDate=2021-01-01T00%3A00%3A00-07&endDate=2021-01-02T14%3A32%3A33-07&limit=5&page=1'
  mockResponseWithMethod(url, method, mock.data.usageLogs)
  res = await sdkClient.getUsageLogs('2021-01-01T00:00:00-07', '2021-01-02T14:32:33-07', { limit: 5, page: 1 })
  expect(res.body.totalElements).toEqual(1)
  expect(res.body.content[0].dateCreated).toEqual('2021-01-01T00:00:00-07')
})

test('__setHeader preset api key header', async () => {
  sdkClient = await sdk.init(company, apiKey, token)
  const req = { headers: { 'x-api-key': 'test' } }
  sdkClient.__setHeaders(req, sdkClient, {})
  expect(req.headers['x-api-key']).toBe('test')
})

test('__setHeader preset x-proxy-global-company-id header', async () => {
  sdkClient = await sdk.init(company, apiKey, token)
  const req = { headers: { 'x-proxy-global-company-id': 'test' } }
  sdkClient.__setHeaders(req, sdkClient, {})
  expect(req.headers['x-proxy-global-company-id']).toBe('test')
})

test('__setHeader preset authorization header', async () => {
  sdkClient = await sdk.init(company, apiKey, token)
  const req = { headers: { Authorization: 'test' } }
  sdkClient.__setHeaders(req, sdkClient, {})
  expect(req.headers.Authorization).toBe('test')
})

async function checkErrorResponse (fn, url, method, error, args = []) {
  const client = sdkClient
  const noErrorResponse = new Error(' No error response')

  let e
  try {
    await client[fn](args[0], args[1])
    e = noErrorResponse
  } catch (err) {
    e = err
  }

  expect(e).not.toEqual(noErrorResponse)
  expect(e.name).toEqual(error.name)
  expect(e.code).toEqual(error.code)
  expect(e.message).not.toContain('response: [Object]')
}
