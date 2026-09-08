import React, { useState } from 'react';
import { Language, SchemaTable } from '../types';
import { DATABASE_TABLES } from '../data/schemaData';
import { Copy, Check, ShieldAlert, KeyRound, Download, Database } from 'lucide-react';

interface SchemaViewerProps {
  language: Language;
  searchQuery: string;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ language, searchQuery }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const modules = [
    'All',
    'Identity & Auth',
    'Directory & Verification',
    'Matrimony',
    'Events & Archives',
    'Community Feed & Forum',
    'Payments & Subscriptions',
    'Admin & RBAC',
    'System & Audit',
  ];

  const filteredTables = DATABASE_TABLES.filter((table) => {
    const matchesModule = selectedModule === 'All' || table.module === selectedModule;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesModule;

    const matchesSearch =
      table.tableName.toLowerCase().includes(query) ||
      table.description.toLowerCase().includes(query) ||
      table.fields.some((f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query));

    return matchesModule && matchesSearch;
  });

  const copyTableDdl = (id: string, ddl: string) => {
    navigator.clipboard.writeText(ddl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyCompleteDdl = () => {
    const fullSql = [
      '--',
      '-- MUDALIYAR SANGAM COMMUNITY PLATFORM',
      '-- COMPREHENSIVE PRODUCTION DATABASE SCHEMA (PostgreSQL)',
      '-- Compliant with DPDP Act 2023, PII Encryption & Role-Based Security',
      '--',
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
      '',
      ...DATABASE_TABLES.map((t) => `-- =========================================\n-- Table: ${t.tableName} (${t.module})\n-- =========================================\n${t.ddl}\n\n${t.indexes.join('\n')}\n`),
    ].join('\n');

    navigator.clipboard.writeText(fullSql);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadSqlFile = () => {
    const fullSql = [
      '-- MUDALIYAR SANGAM PRODUCTION SCHEMA (PostgreSQL)',
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";',
      '',
      ...DATABASE_TABLES.map((t) => `${t.ddl}\n\n${t.indexes.join('\n')}\n`),
    ].join('\n');

    const blob = new Blob([fullSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mudaliyar_sangam_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Schema Header with Stats & Export */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {language === 'en' ? 'Relational Database Schema (PostgreSQL / Cloud SQL)' : 'உறவுமுறை தரவுத்தள வடிவமைப்பு (PostgreSQL)'}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {DATABASE_TABLES.length} {language === 'en' ? 'Core Tables' : 'அட்டவணைகள்'}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            {language === 'en'
              ? 'Complete DDL specifications with foreign key constraints, high-performance indexing for matrimonial search, and PII tagging for DPDP Act compliance.'
              : 'வெளிப்புற விசை கட்டுப்பாடுகள், திருமண தேடல் குறியீடுகள் மற்றும் தனிநபர் தரவு பாதுகாப்புடன் கூடிய முழுமையான SQL கட்டமைப்பு.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            id="copy-complete-ddl-btn"
            type="button"
            onClick={copyCompleteDdl}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white/90 transition-colors shadow-xs cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? (language === 'en' ? 'Copied Full SQL' : 'SQL நகலெடுக்கப்பட்டது') : (language === 'en' ? 'Copy All DDL' : 'முழு SQL நகலெடு')}</span>
          </button>
          <button
            id="download-sql-btn"
            type="button"
            onClick={downloadSqlFile}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Download .sql' : '.sql பதிவிறக்கு'}</span>
          </button>
        </div>
      </div>

      {/* Module Filters */}
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

      {/* Tables List */}
      <div className="space-y-6">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            id={`schema-table-${table.tableName}`}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs"
          >
            {/* Table Header */}
            <div className="px-5 py-3.5 bg-zinc-50/80 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {table.tableName}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {table.module}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyTableDdl(table.id, table.ddl)}
                  className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors cursor-pointer"
                >
                  {copiedId === table.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === table.id ? 'Copied DDL' : 'Copy DDL'}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="px-5 py-2.5 bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              {table.description}
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold bg-zinc-100 dark:bg-zinc-800/40">
                    <th className="py-2.5 px-4 font-bold">Column Name</th>
                    <th className="py-2.5 px-4 font-bold">Data Type</th>
                    <th className="py-2.5 px-4 font-bold">Constraints & Security</th>
                    <th className="py-2.5 px-4 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {table.fields.map((field) => (
                    <tr key={field.name} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2 px-4 font-mono font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {field.isPrimary && <KeyRound className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Primary Key" />}
                        {field.name}
                      </td>
                      <td className="py-2 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                        {field.type}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {!field.nullable && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-medium">
                              NOT NULL
                            </span>
                          )}
                          {field.isForeign && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono font-medium">
                              FK &rarr; {field.foreignRef}
                            </span>
                          )}
                          {field.isPII && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-semibold flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5" /> PII Masked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-zinc-700 dark:text-zinc-300">
                        {field.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes footer */}
            {table.indexes.length > 0 && (
              <div className="px-5 py-2.5 bg-zinc-50/60 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 mr-2">Optimized Indexes:</span>
                <code className="font-mono text-amber-750 dark:text-amber-400">{table.indexes.join(' | ')}</code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
