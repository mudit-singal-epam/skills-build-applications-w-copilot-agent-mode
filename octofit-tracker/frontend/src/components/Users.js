import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Users API endpoint:', endpoint);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to load users (${response.status})`);
      }
      const data = await response.json();
      console.log('Users API response:', data);
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : [];
      setUsers(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter((user) => JSON.stringify(user).toLowerCase().includes(query));
  }, [users, filterText]);

  const getLabel = (user, index) =>
    user?.name || user?.username || user?.email || user?.id || `User ${index + 1}`;

  const getSummary = (user) => {
    if (!user || typeof user !== 'object') {
      return 'No details available.';
    }
    const keys = Object.keys(user);
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
            <h2 className="h4 mb-1">Users</h2>
            <p className="text-muted mb-1">
              Keep track of member profiles and contact details.
            </p>
            <a className="link-secondary small" href={endpoint} target="_blank" rel="noreferrer">
              API endpoint
            </a>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={fetchUsers}
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
              placeholder="Filter users"
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
        {!error && users.length === 0 && !isLoading && (
          <div className="alert alert-info">No users available yet.</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">User</th>
                <th scope="col">Summary</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user?.id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{getLabel(user, index)}</td>
                  <td className="text-muted">{getSummary(user)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && users.length > 0 && !isLoading && (
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
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {selectedUser && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedUser(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <pre className="mb-0 small text-muted">
                    {JSON.stringify(selectedUser, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
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

export default Users;
