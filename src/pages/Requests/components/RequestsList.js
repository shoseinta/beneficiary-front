import React from 'react';
import { Link } from 'react-router-dom';

function RequestsList({ data, index}) {
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', fontWeight: 'bold', padding: '0.5rem 0', borderBottom: '2px solid #ccc' }}>
                <div>Effective Date</div>
                <div>Request Type</div>
                <div>Processing Stage</div>
                <div>Action</div>
            </div>

            {/* Data rows */}
            {
                data.map(item => (
                    <div key={`${item.beneficiary_request_id}-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                        <div>{item.effective_date || '-'}</div>
                        <div>
                            <div>{item.beneficiary_request_type_layer1}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.beneficiary_request_type_layer2}</div>
                        </div>
                        <div>{item.beneficiary_request_processing_stage}</div>
                        <div>
                            <Link to={`/${item.beneficiary_request_id}/request-detail`}>View</Link>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default RequestsList;
