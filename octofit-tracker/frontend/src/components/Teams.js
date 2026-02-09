import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${apiBaseUrl}/teams/`;

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Teams API endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load teams (${response.status})`);
      }
      const data = await response.json();
      console.log('Teams API response:', data);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setTeams(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return teams;
    }
    return teams.filter((team) => JSON.stringify(team).toLowerCase().includes(query));
  }, [teams, filterText]);

  const getLabel = (team, index) =>
    team?.name || team?.title || team?.id || `Team ${index + 1}`;

  const getSummary = (team) => {
    if (!team || typeof team !== 'object') {
      return 'No details available.';
    }
    const keys = Object.keys(team);
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
            <h2 className="h4 mb-1">Teams</h2>
            <p className="text-muted mb-1">
              Organize squads, assign members, and review team metrics.
            </p>
            <a className="link-secondary small" href={endpoint} target="_blank" rel="noreferrer">
              API endpoint
            </a>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={fetchTeams}
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
              placeholder="Filter teams"
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
        {!error && teams.length === 0 && !isLoading && (
          <div className="alert alert-info">No teams available yet.</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Team</th>
                <th scope="col">Summary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => (
                <tr key={team?.id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{getLabel(team, index)}</td>
                  <td className="text-muted">{getSummary(team)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedTeam(team)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTeams.length === 0 && teams.length > 0 && !isLoading && (
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
        Showing {filteredTeams.length} of {teams.length} teams
      </div>

      {selectedTeam && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Team details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedTeam(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre className="mb-0 small text-muted">
                    {JSON.stringify(selectedTeam, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedTeam(null)}
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

export default Teams;
