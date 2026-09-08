"use client";

import React, { useState } from "react";
import { Database, Table, Key, Link2, Search, ArrowRight, ShieldCheck, Layers, Hash } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";

interface SchemaVisualizerProps {
  domain: DomainContext;
}

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({ domain }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const filteredEntities = domain.erdEntities.filter((e) =>
    e.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
    e.fields.some((f) => f.name.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const totalFields = domain.erdEntities.reduce((acc, e) => acc + e.fields.length, 0);
  const totalPKs = domain.erdEntities.reduce((acc, e) => acc + e.fields.filter((f) => f.key === "PK").length, 0);
  const totalFKs = domain.erdEntities.reduce((acc, e) => acc + e.fields.filter((f) => f.key === "FK").length, 0);

  return (
    <div className="space-y-6">
      {/* Schema Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              Relational Schema Architecture
            </span>
            <span className="text-xs text-slate-400">PostgreSQL 16 Schema</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-400" />
            <span>{domain.title} Data Model</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Normalized Third Normal Form (3NF) relational entity definitions, primary keys, foreign constraints, and cardinality rules.
          </p>
        </div>

        {/* Database Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[70px]">
            <div className="text-base font-bold text-emerald-400">{domain.erdEntities.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Entities</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[70px]">
            <div className="text-base font-bold text-blue-400">{totalFields}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Columns</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[70px]">
            <div className="text-base font-bold text-purple-400">{domain.erdRelations.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Relations</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[70px]">
            <div className="text-base font-bold text-amber-400">{totalFKs}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">FK Links</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter entities or attributes..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>

        {/* Entity Quick Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            onClick={() => setSelectedEntity(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedEntity === null
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Tables ({domain.erdEntities.length})
          </button>
          {domain.erdEntities.map((e) => (
            <button
              key={e.name}
              onClick={() => setSelectedEntity(selectedEntity === e.name ? null : e.name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedEntity === e.name
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Table className="h-3 w-3" />
              <span>{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEntities
          .filter((e) => selectedEntity === null || e.name === selectedEntity)
          .map((entity) => {
            // Find relations involving this entity
            const outboundRelations = domain.erdRelations.filter((r) => r.from === entity.name);
            const inboundRelations = domain.erdRelations.filter((r) => r.to === entity.name);

            return (
              <div
                key={entity.name}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col hover:border-emerald-300 transition-all"
              >
                {/* Table Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                      <Table className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-mono">
                        public.{entity.name.toLowerCase()}s
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{entity.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                    {entity.fields.length} cols
                  </span>
                </div>

                {/* Columns Table */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2">Column</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {entity.fields.map((field) => (
                        <tr key={field.name} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-2 text-slate-900 font-semibold flex items-center gap-1.5">
                            {field.key === "PK" && <Key className="h-3 w-3 text-amber-500 shrink-0" />}
                            {field.key === "FK" && <Link2 className="h-3 w-3 text-blue-500 shrink-0" />}
                            {field.key === "UK" && <Hash className="h-3 w-3 text-purple-500 shrink-0" />}
                            <span>{field.name}</span>
                          </td>
                          <td className="px-3 py-2 text-slate-500 font-medium">{field.type}</td>
                          <td className="px-3 py-2">
                            {field.key === "PK" && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                PRIMARY KEY
                              </span>
                            )}
                            {field.key === "FK" && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold">
                                FOREIGN KEY
                              </span>
                            )}
                            {field.key === "UK" && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">
                                UNIQUE
                              </span>
                            )}
                            {!field.key && <span className="text-slate-400 text-[10px]">NOT NULL</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer: Relationships */}
                {(outboundRelations.length > 0 || inboundRelations.length > 0) && (
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Foreign Key Graph
                    </div>
                    {outboundRelations.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px]">
                        <span className="font-semibold text-slate-800">{entity.name}</span>
                        <ArrowRight className="h-3 w-3 text-blue-500 shrink-0" />
                        <span className="text-blue-700 font-semibold">{r.to}</span>
                        <span className="text-slate-400">({r.label} - {r.cardinality})</span>
                      </div>
                    ))}
                    {inboundRelations.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px]">
                        <span className="text-slate-500">{r.from}</span>
                        <ArrowRight className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-emerald-800">{entity.name}</span>
                        <span className="text-slate-400">({r.label})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
