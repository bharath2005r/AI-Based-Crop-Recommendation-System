{prediction && (
  <div className="card mt-4 shadow-lg border-0 rounded-4">
    <div className="card-body text-center py-4">
      <h4 className="text-success fw-bold mb-3">
        🌾 Recommended Crop
      </h4>

      <h1 className="display-5 text-dark text-capitalize fw-bold">
        {prediction}
      </h1>

      <p className="text-muted mt-3">
        Based on the soil parameters you entered,
        <strong> {prediction}</strong> is the most suitable crop.
      </p>
    </div>
  </div>
)}