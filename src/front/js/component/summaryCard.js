import React from 'react'

const SummaryCard = ({professional, services, time, date}) => {
    return (
        <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#F0F0F0' }}>
                <div
                    style={{
                        backgroundColor: '#E0E0E0',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1536520002442-39764a41e987?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="card-img-top"
                        alt="Location"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Vurve - Bangalore</h5>
                    <p className="card-text">MG Road, Bangalore</p>
                    {/* {selectedDate && selectedTime && ( */}
                        <div>
                            <p><strong>professional:</strong> {professional}</p>
                            <p><strong>Date:</strong> 23-10-51</p>
                            <p><strong>Time:</strong> una hora 5</p>
                        </div>
                    {/* )} */}
                    <p><strong>Total:</strong> EUR 15,00</p>
                    <button className="btn btn-warning w-100 mb-2" 
                    // onClick={handleContinue}
                    >
                        Continue
                    </button>
                    <button
                        className="btn btn-secondary w-100"
                        onClick={() => navigate('/book-appointment-services')}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>

    )
}

export default SummaryCard