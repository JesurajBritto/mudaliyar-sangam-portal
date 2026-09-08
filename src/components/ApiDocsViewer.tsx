import React, { useState } from 'react';
import { Language, ApiEndpoint } from '../types';
import { API_ENDPOINTS } from '../data/apiData';
import { Copy, Check, Download, Lock, Globe, Shield, Terminal } from 'lucide-react';

interface ApiDocsViewerProps {
  language: Language;
  searchQuery: string;
}

export const ApiDocsViewer: React.FC<ApiDocsViewerProps> = ({ language, searchQuery }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [copiedCurlId, setCopiedCurlId] = useState<string | null>(null);
  const [copiedJsonAll, setCopiedJsonAll] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<Record<string, 'response' | 'request' | 'headers'>>({});

  const modules = [
    'All',
    'Member Address Book',
    'Authentication',
    'User Management',
    'Matrimonial Database',
    'Events & Archives',
    'Community Feed & Forum',
    'Universal Search',
    'Admin & Moderation',
    'Payments & Subscriptions',
  ];

  const filteredEndpoints = API_ENDPOINTS.filter((ep) => {
    const matchesModule = selectedModule === 'All' || ep.module === selectedModule;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesModule;

    const matchesSearch =
      ep.path.toLowerCase().includes(query) ||
      ep.summary.toLowerCase().includes(query) ||
      ep.summaryTa.toLowerCase().includes(query) ||
      ep.module.toLowerCase().includes(query) ||
      ep.method.toLowerCase().includes(query);

    return matchesModule && matchesSearch;
  });

  const getMethodBadge = (method: ApiEndpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  const copyCurl = (ep: ApiEndpoint) => {
    let curl = `curl -X ${ep.method} "https://api.sangam.org${ep.path}"`;
    Object.entries(ep.headers).forEach(([k, v]) => {
      curl += ` \\\n  -H "${k}: ${v}"`;
    });
    if (ep.requestBody) {
      curl += ` \\\n  -d '${ep.requestBody.replace(/\n\s*/g, ' ')}'`;
    }
    navigator.clipboard.writeText(curl);
    setCopiedCurlId(ep.id);
    setTimeout(() => setCopiedCurlId(null), 2000);
  };

  const downloadOpenApiSpec = () => {
    const openApiJson = {
      openapi: '3.0.3',
      info: {
        title: 'Mudaliyar Sangam Community API',
        version: '1.0.0',
        description: 'Comprehensive REST API specification for community membership, matrimonial, events, push alerts, and payments.',
      },
      servers: [{ url: 'https://api.sangam.org', description: 'Production API Gateway' }],
      endpoints: API_ENDPOINTS.map((e) => ({
        method: e.method,
        path: e.path,
        summary: e.summary,
        accessRole: e.accessRole,
        headers: e.headers,
        statusCodes: e.statusCodes,
      })),
    };

    const blob = new Blob([JSON.stringify(openApiJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sangam_openapi_spec.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {language === 'en' ? 'RESTful API Specification & Endpoints' : 'REST API ஆவணங்கள் மற்றும் விவரக்குறிப்பு'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {API_ENDPOINTS.length} {language === 'en' ? 'Endpoints' : 'இணைப்புப் புள்ளிகள்'}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1 max-w-2xl">
            {language === 'en'
              ? 'Complete request schemas, authentication tokens, rate limits, and JSON responses for mobile apps and web clients.'
              : 'மொபைல் செயலி மற்றும் வலைத்தளத்திற்கான முழுமையான JSON உள்ளீடுகள், வெளியீடுகள் மற்றும் டோக்கன் பாதுகாப்பு முறைகள்.'}
          </p>
        </div>

        <button
          id="download-openapi-btn"
          type="button"
          onClick={downloadOpenApiSpec}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors shadow-xs self-start md:self-center cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Export OpenAPI 3.0 (JSON)' : 'OpenAPI விவரக்குறிப்பு (JSON)'}</span>
        </button>
      </div>

      {/* Module Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {modules.map((mod) => (
          <button
            key={mod}
            type="button"
            onClick={() => setSelectedModule(mod)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedModule === mod
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.map((ep) => {
          const currentSubTab = activeSubTab[ep.id] || 'response';
          const isPublic = ep.accessRole.includes('Public');
          const isAdmin = ep.accessRole.includes('Admin');

          return (
            <div
              key={ep.id}
              id={`api-endpoint-${ep.id}`}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              {/* Endpoint Header Bar */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${getMethodBadge(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {ep.path}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {ep.module}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {isPublic ? (
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    ) : isAdmin ? (
                      <Shield className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{ep.accessRole}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyCurl(ep)}
                    className="flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 font-semibold px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    title="Copy cURL Command"
                  >
                    {copiedCurlId === ep.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCurlId === ep.id ? 'Copied' : 'cURL'}</span>
                  </button>
                </div>
              </div>

              {/* Endpoint Summary */}
              <div className="px-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs text-zinc-800 dark:text-zinc-200 font-medium flex items-center justify-between">
                <span>{language === 'en' ? ep.summary : ep.summaryTa}</span>
              </div>

              {/* Request / Response Details Tabs */}
              <div className="p-4">
                <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab((prev) => ({ ...prev, [ep.id]: 'response' }))}
                    className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      currentSubTab === 'response'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    Response Sample (200 OK)
                  </button>

                  {ep.requestBody && (
                    <button
                      type="button"
                      onClick={() => setActiveSubTab((prev) => ({ ...prev, [ep.id]: 'request' }))}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        currentSubTab === 'request'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      Request Body (JSON)
                    </button>
                  )}

                  {ep.queryParams && ep.queryParams.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveSubTab((prev) => ({ ...prev, [ep.id]: 'headers' }))}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        currentSubTab === 'headers'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      Query Parameters ({ep.queryParams.length})
                    </button>
                  )}
                </div>

                {/* Tab content */}
                {currentSubTab === 'response' && (
                  <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed">
                    {ep.responseSample}
                  </pre>
                )}

                {currentSubTab === 'request' && ep.requestBody && (
                  <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed">
                    {ep.requestBody}
                  </pre>
                )}

                {currentSubTab === 'headers' && ep.queryParams && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-50 dark:bg-zinc-800/50">
                          <th className="py-2 px-3 font-bold">Parameter</th>
                          <th className="py-2 px-3 font-bold">Type</th>
                          <th className="py-2 px-3 font-bold">Required</th>
                          <th className="py-2 px-3 font-bold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {ep.queryParams.map((param) => (
                          <tr key={param.name}>
                            <td className="py-2 px-3 font-mono font-bold text-amber-750 dark:text-amber-400">{param.name}</td>
                            <td className="py-2 px-3 font-mono text-zinc-700 dark:text-zinc-300">{param.type}</td>
                            <td className="py-2 px-3">
                              {param.required ? (
                                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Yes</span>
                              ) : (
                                <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">No</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300 font-medium">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* HTTP Status codes */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Status codes:</span>
                  {ep.statusCodes.map((sc) => (
                    <span
                      key={sc.code}
                      className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-700 dark:text-zinc-300"
                    >
                      <strong className={sc.code >= 400 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {sc.code}
                      </strong>{' '}
                      - {sc.description}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
