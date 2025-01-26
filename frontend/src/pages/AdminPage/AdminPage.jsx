import './AdminPage.css';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header.jsx';
import Navbar from '../../components/navbar.jsx';
import Footer from '../../components/footer.jsx';
import LoadSpinner from '../../components/shared/loadSpinnerComponent/loadSpinnerComponent.jsx';
import { useAuth } from '../../utils/authContext.jsx';
import { fetchLogs, fetchCriticalLogs } from '../../services/admin.service';

export default function AdminPage() {
    const { authData } = useAuth();
    const [logs, setLogs] = useState([]);
    const [criticalLogs, setCriticalLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('logs'); // 'logs' or 'criticalLogs'
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // Fixed limit for pagination
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

    useEffect(() => {
        if (authData.isAuthorized) {
            setLoading(true);
            const fetchData = async () => {
                try {
                    let response, data;
                    if (view === 'logs') {
                        response = await fetchLogs(authData, limit, page);
                    } else {
                        response = await fetchCriticalLogs(authData.idToken, limit, page);
                    }
                    data = await response.json();

                    // Set the data based on the view
                    if (view === 'logs') {
                        setLogs(data.logs || []);
                    } else {
                        setCriticalLogs(data.criticalLogs || []);
                    }

                    // Calculate total pages if metadata exists
                    if (data.metadata && data.metadata.totalPages) {
                        setTotalPages(data.metadata.totalPages);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        } else {
            window.location.href = '/'; // Redirect if not authorized
        }
    }, [authData.isAuthorized, authData.idToken, view, page, limit]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleViewChange = (newView) => {
        if (newView !== view) {
            setView(newView);
            setPage(1); // Reset to page 1 when switching views
        }
    };

    return authData.isAuthorized ? (
        <>
            <Header />
            <Navbar />
            <div className="admin-page">
                <div className="admin-controls">
                    <button
                        className={view === 'logs' ? 'active' : ''}
                        onClick={() => handleViewChange('logs')}
                    >
                        General Logs
                    </button>
                    <button
                        className={view === 'criticalLogs' ? 'active' : ''}
                        onClick={() => handleViewChange('criticalLogs')}
                    >
                        Critical Logs
                    </button>
                </div>

                {loading ? (
                    <LoadSpinner />
                ) : (
                    <div className="logs-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Event Type</th>
                                    <th>Description</th>
                                    <th>Additional Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(view === 'logs' ? logs : criticalLogs).length > 0 ? (
                                    (view === 'logs' ? logs : criticalLogs).map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.timestamp}</td>
                                            <td>{view != 'logs' ? log.eventType : log.method}</td>
                                            <td>{view != 'logs' ? log.description : log.url}</td>
                                            <td>
                                                {view != 'logs' ? log.additionalData ? JSON.stringify(log.additionalData): 'No additional data'
                                                    : log.headers ? JSON.stringify(log.headers) : 'No additional data'
                                                    }
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>
                                            No logs available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    ) : null;
}
