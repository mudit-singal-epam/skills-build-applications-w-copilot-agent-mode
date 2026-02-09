import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${apiBaseUrl}/workouts/`;

  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Workouts API endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load workouts (${response.status})`);
      }
      const data = await response.json();
      console.log('Workouts API response:', data);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setWorkouts(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const filteredWorkouts = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return workouts;
    }
    return workouts.filter((workout) =>
      JSON.stringify(workout).toLowerCase().includes(query)
    );
  }, [workouts, filterText]);

  const getLabel = (workout, index) =>
    workout?.name || workout?.title || workout?.id || `Workout ${index + 1}`;

  const getSummary = (workout) => {
    if (!workout || typeof workout !== 'object') {
      return 'No details available.';
    }
    const keys = Object.keys(workout);
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
            <h2 className="h4 mb-1">Workouts</h2>
            <p className="text-muted mb-1">
              Review workout plans and track training blocks.
            </p>
            <a className="link-secondary small" href={endpoint} target="_blank" rel="noreferrer">
              API endpoint
            </a>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={fetchWorkouts}
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
              placeholder="Filter workouts"
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
        {!error && workouts.length === 0 && !isLoading && (
          <div className="alert alert-info">No workouts available yet.</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Workout</th>
                <th scope="col">Summary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((workout, index) => (
                <tr key={workout?.id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{getLabel(workout, index)}</td>
                  <td className="text-muted">{getSummary(workout)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWorkouts.length === 0 && workouts.length > 0 && !isLoading && (
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
        Showing {filteredWorkouts.length} of {workouts.length} workouts
      </div>

      {selectedWorkout && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Workout details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedWorkout(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre className="mb-0 small text-muted">
                    {JSON.stringify(selectedWorkout, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedWorkout(null)}
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

export default Workouts;
