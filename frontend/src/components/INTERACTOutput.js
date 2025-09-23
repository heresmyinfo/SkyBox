import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { designAPI } from '../services/api';

const Group = ({ title, children }) => (
  <section style={{ marginBottom: '1.5rem' }}>
    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{title}</h2>
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
      {children}
    </div>
  </section>
);

const KV = ({ label, value }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '0.5rem', padding: '0.35rem 0', borderBottom: '1px solid #f3f4f6' }}>
    <div style={{ color: '#6b7280' }}>{label}</div>
    <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
      {value == null || (Array.isArray(value) && value.length === 0) ? <span style={{ color: '#9ca3af' }}>—</span> : Array.isArray(value) ? value.join(', ') : String(value)}
    </div>
  </div>
);

const INTERACTOutput = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ids, setIds] = useState([]);

  const navigate = useNavigate();
  const id = searchParams.get('id') || 'MRO32920';

  useEffect(() => {
    designAPI.getInteractList?.()
      .then((res) => setIds(res.data.ids || []))
      .catch(() => {})
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    designAPI.getInteract(id)
      .then((res) => { if (mounted) setData(res.data); })
      .catch((e) => { if (mounted) setError(e.response?.data?.error || e.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div>Loading INTERACT Output…</div>;
  if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>;
  if (!data) return <div>No data.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>INTERACT Output</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: '#6b7280' }}>Source:</span>
          <select
            value={id}
            onChange={(e) => {
              const next = e.target.value;
              navigate(`/interact?id=${encodeURIComponent(next)}`);
            }}
            style={{
              fontSize: '1rem',
              padding: '0.5rem 0.75rem',
              minWidth: '220px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: 'white'
            }}
          >
            {[id, ...ids.filter((x) => x !== id)].map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <Group title="Design Metadata">
        <KV label="Units" value={data.Units} />
        <KV label="DesignName" value={data.DesignName} />
        <KV label="FileName" value={data.FileName} />
        <KV label="Width" value={data.Width} />
        <KV label="Height" value={data.Height} />
        <KV label="Depth" value={data.Depth} />
        <KV label="Board" value={data.Board} />
      </Group>

      <Group title="Database Fields">
        {Object.keys(data.DatabaseFields || {}).map((k) => (
          <KV key={k} label={k} value={data.DatabaseFields[k]} />
        ))}
      </Group>

      <Group title="Display">
        <KV label="DesignCode" value={data.Display?.DesignCode} />
        <KV label="DisplayDimensions" value={data.Display?.DisplayDimensions} />
        <KV label="BlankSize" value={data.Display?.BlankSize} />
        <KV label="RecordId" value={data.Display?.RecordId} />
        <KV label="Dates" value={data.Display?.Dates} />
        <KV label="OrientationFlags" value={data.Display?.OrientationFlags} />
        <KV label="ColorNote" value={data.Display?.ColorNote} />
        <KV label="CMYK" value={data.Display?.CMYK} />
        <KV label="NetworkPath" value={data.Display?.NetworkPath} />
      </Group>

      <Group title="Geometry">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {data.Geometry && data.Geometry.Layers && Object.keys(data.Geometry.Layers).map((layer) => (
            <div key={layer} style={{ border: '1px dashed #e5e7eb', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{layer}</div>
              <div style={{ color: '#6b7280' }}>{(data.Geometry.Layers[layer] || []).length} items</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Arcs: {(data.Geometry?.Arcs || []).length} • Text: {(data.Geometry?.Text || []).length} • Dimensions: {(data.Geometry?.Dimensions || []).length}
        </div>
      </Group>
    </div>
  );
};

export default INTERACTOutput;


