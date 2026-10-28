import React from 'react';
import { X, CheckCircle, AlertTriangle, RefreshCw, Database, Server, Shield } from 'lucide-react';
import './SystemHealthModal.css';

export default function SystemHealthModal({ isOpen, onClose, healthStatus, onRefresh, isRefreshing }) {
  if (!isOpen) return null;

  const isHealthy = healthStatus?.ok;
  const data = healthStatus?.data || {};

  return (
    <div
      className="health-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="health-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="health-modal-header">
          <h3 id="modal-title" className="health-modal-title">System &amp; Database Health</h3>
          <button
            type="button"
            className="health-modal-close-btn"
            onClick={onClose}
            aria-label="Close Health Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="health-modal-body">
          <div className={`health-status-banner ${isHealthy ? 'healthy' : 'degraded'}`}>
            {isHealthy ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
            <div className="health-status-info">
              <h4>{isHealthy ? 'Operational & Connected' : 'Connection Standby'}</h4>
              <p>
                {isHealthy
                  ? 'FastAPI core, SQLite session engine, and CORS communication are operational.'
                  : (healthStatus?.error || 'Backend service is starting up or offline.')}
              </p>
            </div>
          </div>

          <div className="health-grid">
            <div className="health-item">
              <div className="health-item-label">Application</div>
              <div className="health-item-val">{data.app_name || 'ES ETHNIC STYLES'}</div>
            </div>

            <div className="health-item">
              <div className="health-item-label">Environment</div>
              <div className="health-item-val">{data.environment || 'development'}</div>
            </div>

            <div className="health-item">
              <div className="health-item-label">Database Engine</div>
              <div className="health-item-val">
                SQLite (SQLAlchemy 2.x: {data.database || 'pending'})
              </div>
            </div>

            <div className="health-item">
              <div className="health-item-label">Health Status</div>
              <div className="health-item-val">{data.status || (isHealthy ? 'healthy' : 'disconnected')}</div>
            </div>
          </div>

          <div className="health-endpoint-pill">
            <span>GET /api/v1/health</span>
            <span>{isHealthy ? '200 OK' : 'Unavailable'}</span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            <Shield size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px', color: 'var(--color-antique-gold)' }} />
            <strong>Security Guarantee:</strong> The health endpoint verifies live database connectivity
            while strictly withholding environment secrets, database paths, and sensitive credentials.
          </div>
        </div>

        <div className="health-modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spinning' : ''} />
            <span>{isRefreshing ? 'Checking...' : 'Refresh Health'}</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}
