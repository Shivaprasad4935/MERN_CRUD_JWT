import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthProvider';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const { token } = useAuth();
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/?page=${currentPage}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.users && response.data.totalPages) {
                    setUsers(response.data.users);
                    setTotalPages(response.data.totalPages);
                } else {
                    setError("Invalid data structure from server");
                    setUsers([]);
                    setTotalPages(0);
                }

            } catch (err) {
                setError(err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    alert('Authentication failed. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError("Failed to fetch users.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        } else {
            setLoading(false);
            setError("No token, please login");
        }
    }, [navigate, token, currentPage, limit]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deleteuser/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
           fetchUsers();

        } catch (err) {
            setError(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                alert('Authentication failed. Please log in again.');
                navigate('/login');
            }
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        setLimit(newLimit);
        setCurrentPage(1);
    };

    if (error) {
        return (
            <div className="d-flex bg-primary vh-100 justify-content-center align-items-center">
                <div className="w-50 bg-white rounded p-3 text-danger">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex bg-primary vh-100 justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <div className="d-flex justify-content-between mb-3">
                    <h2>Users</h2>
                    <Link to="/create" className="btn btn-success">
                        ADD
                    </Link>
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        Loading...
                    </div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.age}</td>
                                        <td>
                                            <Link to={`/update/${user._id}`} className="btn btn-success btn-sm">Update</Link>
                                            <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDelete(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="d-flex justify-content-center mt-3">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        {/* Limit Select */}
                        <div className="d-flex justify-content-center mt-3">
                            <div className="input-group">
                                <span className="input-group-text">Users per page:</span>
                                <select className="form-select" value={limit} onChange={handleLimitChange}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Users;

