import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  const endpoint = `${apiBaseUrl}/leaderboard/`;

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Leaderboard API endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load leaderboard (${response.status})`);
      }
      const data = await response.json();
      console.log('Leaderboard API response:', data);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setLeaders(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filteredLeaders = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return leaders;
    }
    return leaders.filter((entry) =>
      JSON.stringify(entry).toLowerCase().includes(query)
    );
  }, [leaders, filterText]);

  const getLabel = (entry, index) =>
    entry?.name || entry?.user || entry?.id || `Entry ${index + 1}`;

  const getSummary = (entry) => {
    if (!entry || typeof entry !== 'object') {
      return 'No details available.';
    }
    const keys = Object.keys(entry);
    if (keys.length === 0) {
      return 'No details available.';
    }
    return `Fields: ${keys.slice(0, 4).join(', ')}${keys.length > 4 ? '...' : ''}`;
  };

  return (
    <section className="card shadow-sm">
      <div className="card-header bg-white">
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div>
            <h2 className="h4 mb-1">Leaderboard</h2>
            <p className="text-muted mb-1">
              Celebrate top performers and keep the momentum going.
            </p>
            <a className="link-secondary small" href={endpoint} target="_blank" rel="noreferrer">
              API endpoint
            </a>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={fetchLeaderboard}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      <div className="card-body">
        <form
          className="row g-2 align-items-center mb-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="col-12 col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Filter leaderboard"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">
              Apply filter
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary flex-fill"
              onClick={() => setFilterText('')}
            >
              Reset
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}
        {!error && leaders.length === 0 && !isLoading && (
          <div className="alert alert-info">No leaderboard entries available yet.</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Entry</th>
                <th scope="col">Summary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaders.map((entry, index) => (
                <tr key={entry?.id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{getLabel(entry, index)}</td>
                  <td className="text-muted">{getSummary(entry)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeaders.length === 0 && leaders.length > 0 && !isLoading && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No matches found. Try a different filter.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer bg-white text-muted small">
        Showing {filteredLeaders.length} of {leaders.length} entries
      </div>

      {selectedEntry && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard entry details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedEntry(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre className="mb-0 small text-muted">
                    {JSON.stringify(selectedEntry, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedEntry(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </section>
  );
};

export default Leaderboard;
