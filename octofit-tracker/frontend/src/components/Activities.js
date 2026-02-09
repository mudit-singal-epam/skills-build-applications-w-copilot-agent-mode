import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${apiBaseUrl}/activities/`;

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Activities API endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load activities (${response.status})`);
      }
      const data = await response.json();
      console.log('Activities API response:', data);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setActivities(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const filteredActivities = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return activities;
    }
    return activities.filter((activity) =>
      JSON.stringify(activity).toLowerCase().includes(query)
    );
  }, [activities, filterText]);

  const getLabel = (activity, index) =>
    activity?.name || activity?.title || activity?.id || `Activity ${index + 1}`;

  const getSummary = (activity) => {
    if (!activity || typeof activity !== 'object') {
      return 'No details available.';
    }
    const keys = Object.keys(activity);
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
            <h2 className="h4 mb-1">Activities</h2>
            <p className="text-muted mb-1">
              Track recent training sessions and drill into activity specifics.
            </p>
            <a className="link-secondary small" href={endpoint} target="_blank" rel="noreferrer">
              API endpoint
            </a>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={fetchActivities}
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
              placeholder="Filter activities"
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
        {!error && activities.length === 0 && !isLoading && (
          <div className="alert alert-info">No activities available yet.</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Activity</th>
                <th scope="col">Summary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity, index) => (
                <tr key={activity?.id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{getLabel(activity, index)}</td>
                  <td className="text-muted">{getSummary(activity)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredActivities.length === 0 && activities.length > 0 && !isLoading && (
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
        Showing {filteredActivities.length} of {activities.length} activities
      </div>

      {selectedActivity && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Activity details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedActivity(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre className="mb-0 small text-muted">
                    {JSON.stringify(selectedActivity, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedActivity(null)}
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

export default Activities;
