"use client"

import { useState } from "react"
import { Trash2, Plus, Send, Copy, Check } from "lucide-react"

type KeyValue = {
  key: string
  value: string
  enabled: boolean
}

type RequestHistory = {
  id: string
  method: string
  url: string
  timestamp: Date
  status?: number
}

export default function APITester() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [params, setParams] = useState<KeyValue[]>([{ key: "", value: "", enabled: true }])
  const [headers, setHeaders] = useState<KeyValue[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ])
  const [body, setBody] = useState("")
  const [bodyType, setBodyType] = useState("json")
  const [authType, setAuthType] = useState("none")
  const [authToken, setAuthToken] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [responseTime, setResponseTime] = useState<number>(0)
  const [responseSize, setResponseSize] = useState<number>(0)
  const [history, setHistory] = useState<RequestHistory[]>([])
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body" | "auth">("params")
  const [activeResponseTab, setActiveResponseTab] = useState<"body" | "headers">("body")

  const addKeyValue = (type: "params" | "headers") => {
    if (type === "params") {
      setParams([...params, { key: "", value: "", enabled: true }])
    } else {
      setHeaders([...headers, { key: "", value: "", enabled: true }])
    }
  }

  const removeKeyValue = (type: "params" | "headers", index: number) => {
    if (type === "params") {
      setParams(params.filter((_, i) => i !== index))
    } else {
      setHeaders(headers.filter((_, i) => i !== index))
    }
  }

  const updateKeyValue = (
    type: "params" | "headers",
    index: number,
    field: "key" | "value" | "enabled",
    value: string | boolean,
  ) => {
    if (type === "params") {
      const newParams = [...params]
      newParams[index] = { ...newParams[index], [field]: value }
      setParams(newParams)
    } else {
      const newHeaders = [...headers]
      newHeaders[index] = { ...newHeaders[index], [field]: value }
      setHeaders(newHeaders)
    }
  }

  const buildUrlWithParams = () => {
    const activeParams = params.filter((p) => p.enabled && p.key && p.value)
    if (activeParams.length === 0) return url

    const queryString = activeParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&")
    return url.includes("?") ? `${url}&${queryString}` : `${url}?${queryString}`
  }

  const handleSendRequest = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)
    setResponseHeaders({})

    const startTime = performance.now()

    try {
      const requestHeaders: Record<string, string> = {}
      headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          requestHeaders[h.key] = h.value
        })

      if (authType === "bearer" && authToken) {
        requestHeaders["Authorization"] = `Bearer ${authToken}`
      }

      const requestOptions: RequestInit = {
        method: method,
        headers: requestHeaders,
      }

      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        requestOptions.body = body
      }

      const finalUrl = buildUrlWithParams()
      const res = await fetch(finalUrl, requestOptions)
      const endTime = performance.now()

      const responseText = await res.text()
      let responseData

      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      const responseHeadersObj: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeadersObj[key] = value
      })

      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: responseData,
      })
      setResponseHeaders(responseHeadersObj)
      setResponseTime(Math.round(endTime - startTime))
      setResponseSize(new Blob([responseText]).size)

      // Add to history
      setHistory([
        {
          id: Date.now().toString(),
          method,
          url: finalUrl,
          timestamp: new Date(),
          status: res.status,
        },
        ...history.slice(0, 9),
      ])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.body, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadFromHistory = (item: RequestHistory) => {
    setUrl(item.url)
    setMethod(item.method)
  }

  const getStatusColor = (status?: number) => {
    if (!status) return "text-gray-600 dark:text-gray-400"
    if (status >= 200 && status < 300) return "text-success-500"
    if (status >= 300 && status < 400) return "text-brand-600 dark:text-brand-400"
    if (status >= 400 && status < 500) return "text-warning-500"
    return "text-error-500"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex h-screen">
        {/* Sidebar - History */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 overflow-y-auto">
          <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">History</h2>
          <div className="space-y-1.5">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-500">No requests yet</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-mono font-semibold px-1 py-0.5 rounded ${getStatusColor(item.status)}`}>
                      {item.method}
                    </span>
                    {item.status && <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.url}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{item.timestamp.toLocaleTimeString()}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">API Tester</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Test your REST APIs like Postman</p>
          </div>

          {/* Request Section */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-6xl mx-auto space-y-4">
              {/* URL Bar */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Request</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-28 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors cursor-pointer"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </select>
                    <input
                      type="text"
                      placeholder="https://api.example.com/endpoint"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 h-9 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                    />
                    <button
                      onClick={handleSendRequest}
                      disabled={loading}
                      className="h-9 px-4 py-1.5 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm hover:shadow-md disabled:shadow-none"
                    >
                      {loading ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Send
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tabs for Params, Headers, Body, Auth */}
                  <div className="w-full">
                    <div className="flex gap-1 mb-3 border-b border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => setActiveTab("params")}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          activeTab === "params"
                            ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        Params
                      </button>
                      <button
                        onClick={() => setActiveTab("headers")}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          activeTab === "headers"
                            ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        Headers
                      </button>
                      <button
                        onClick={() => setActiveTab("body")}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          activeTab === "body"
                            ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        Body
                      </button>
                      <button
                        onClick={() => setActiveTab("auth")}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                          activeTab === "auth"
                            ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        Auth
                      </button>
                    </div>

                    {/* Params Tab */}
                    {activeTab === "params" && (
                      <div className="space-y-2">
                        {params.map((param, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="checkbox"
                              checked={param.enabled}
                              onChange={(e) => updateKeyValue("params", index, "enabled", e.target.checked)}
                              className="w-4 h-4 text-brand-500 rounded border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:ring-2 cursor-pointer"
                            />
                            <input
                              type="text"
                              placeholder="Key"
                              value={param.key}
                              onChange={(e) => updateKeyValue("params", index, "key", e.target.value)}
                              className="flex-1 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              value={param.value}
                              onChange={(e) => updateKeyValue("params", index, "value", e.target.value)}
                              className="flex-1 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            />
                            <button
                              onClick={() => removeKeyValue("params", index)}
                              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-error-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addKeyValue("params")}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Parameter
                        </button>
                      </div>
                    )}

                    {/* Headers Tab */}
                    {activeTab === "headers" && (
                      <div className="space-y-2">
                        {headers.map((header, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={(e) => updateKeyValue("headers", index, "enabled", e.target.checked)}
                              className="w-4 h-4 text-brand-500 rounded border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:ring-2 cursor-pointer"
                            />
                            <input
                              type="text"
                              placeholder="Key"
                              value={header.key}
                              onChange={(e) => updateKeyValue("headers", index, "key", e.target.value)}
                              className="flex-1 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            />
                            <input
                              type="text"
                              placeholder="Value"
                              value={header.value}
                              onChange={(e) => updateKeyValue("headers", index, "value", e.target.value)}
                              className="flex-1 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                            />
                            <button
                              onClick={() => removeKeyValue("headers", index)}
                              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-error-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addKeyValue("headers")}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Header
                        </button>
                      </div>
                    )}

                    {/* Body Tab */}
                    {activeTab === "body" && (
                      <div className="space-y-2">
                        {["POST", "PUT", "PATCH"].includes(method) ? (
                          <>
                            <select
                              value={bodyType}
                              onChange={(e) => setBodyType(e.target.value)}
                              className="w-40 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors cursor-pointer"
                            >
                              <option value="json">JSON</option>
                              <option value="text">Text</option>
                              <option value="xml">XML</option>
                            </select>
                            <textarea
                              value={body}
                              onChange={(e) => setBody(e.target.value)}
                              className="w-full h-48 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
                              placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "Enter request body..."}
                            />
                          </>
                        ) : (
                          <div className="py-6 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                              Request body is not available for {method} requests
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Auth Tab */}
                    {activeTab === "auth" && (
                      <div className="space-y-2">
                        <select
                          value={authType}
                          onChange={(e) => setAuthType(e.target.value)}
                          className="w-40 h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors cursor-pointer"
                        >
                          <option value="none">No Auth</option>
                          <option value="bearer">Bearer Token</option>
                        </select>
                        {authType === "bearer" && (
                          <input
                            type="password"
                            placeholder="Enter your bearer token"
                            value={authToken}
                            onChange={(e) => setAuthToken(e.target.value)}
                            className="w-full h-9 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Response Section */}
              {(response || error) && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">Response</h3>
                        {response && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className={`font-semibold px-1.5 py-0.5 rounded text-xs ${getStatusColor(response.status)}`}>
                              {response.status} {response.statusText}
                            </span>
                            <span className="text-success-500 font-medium text-xs">{responseTime}ms</span>
                            <span className="text-gray-600 dark:text-gray-400 text-xs">{(responseSize / 1024).toFixed(2)} KB</span>
                          </div>
                        )}
                      </div>
                      {response && (
                        <button
                          onClick={copyResponse}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-300 dark:hover:border-brand-700 transition-colors inline-flex items-center gap-1.5"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-success-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    {error ? (
                      <div className="p-3 rounded-lg bg-error-500/10 dark:bg-error-500/20 border border-error-500/30 dark:border-error-500/50 text-error-500">
                        <p className="font-semibold mb-1.5 text-sm">Error:</p>
                        <pre className="text-xs whitespace-pre-wrap font-mono">{error}</pre>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex gap-1 mb-3 border-b border-gray-200 dark:border-gray-800">
                          <button
                            onClick={() => setActiveResponseTab("body")}
                            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                              activeResponseTab === "body"
                                ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            Body
                          </button>
                          <button
                            onClick={() => setActiveResponseTab("headers")}
                            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                              activeResponseTab === "headers"
                                ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            Headers
                          </button>
                        </div>
                        {activeResponseTab === "body" && (
                          <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto text-gray-900 dark:text-gray-100">
                            {typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)}
                          </pre>
                        )}
                        {activeResponseTab === "headers" && (
                          <div className="space-y-1.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                            {Object.entries(responseHeaders).map(([key, value]) => (
                              <div key={key} className="flex gap-2 text-xs font-mono text-gray-900 dark:text-gray-100">
                                <span className="font-semibold text-gray-600 dark:text-gray-400 min-w-[100px]">{key}:</span>
                                <span className="break-all">{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
