import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieForm({
  mode = "add",
  initialData = null,
  categories = [],
  onSubmit,
  loading = false,
  error = "",
}) {
  const navigate = useNavigate();

  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    year: initialData?.year || "",
    rating: initialData?.rating || "",
    categoryIds: initialData?.categoryIds || [],
  }));

  // Stores the actual selected image file
  const [imageFile, setImageFile] = useState(null);

  const [success, setSuccess] = useState("");

  // Handle normal input changes
  const handleChange = (e) => {
    console.log("INPUT CHANGE target value:", e.target);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If user starts entering a URL,
    // remove any previously selected local file
    if (name === "image") {
      setImageFile(null);
    }
  };

  // Handle local image selection
  const handleImageBrowse = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setImageFile(file);

    // Clear URL because local file is now selected
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const alreadySelected = prev.categoryIds.includes(categoryId);

      if (alreadySelected) {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
        };
      }

      return {
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId],
      };
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    // Creating multipart/form-data
    console.log("FORM DATA ENTRIES from MovieForm.js:");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("year", formData.year);
    data.append("rating", formData.rating);

    data.append("categoryIds", JSON.stringify(formData.categoryIds));

    if (imageFile) {
      data.append("image", imageFile);
    } else if (formData.image) {
      data.append("image", formData.image);
    }

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }
    await onSubmit(data, setSuccess);
  };

  // Image preview
  const getImagePreview = () => {
    // New local image selected
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    // Existing image from database or external URL
    if (formData.image) {
      return formData.image;
    }

    return null;
  };

  const imagePreview = getImagePreview();

  return (
    <div className="add-movie-page">
      <div className="add-movie-container">
        {/* Back button */}
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          type="button"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="add-movie-header">
          <p className="page-label">MOVIE MANAGEMENT</p>

          <h1>{isEdit ? "Edit Movie" : "Add Movie"}</h1>

          <p className="page-description">
            {isEdit
              ? "Update the information for this movie."
              : "Add a new movie to your movie collection."}
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="form-alert error">{error}</div>}

        {success && <div className="form-alert success">{success}</div>}

        {/* Main Card */}
        <div className="add-movie-card">
          {/* LEFT - POSTER */}
          <div className="poster-section">
            <div className="poster-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Movie poster preview" />
              ) : (
                <div className="poster-placeholder">
                  <span>🎬</span>

                  <p>Poster Preview</p>

                  <small>Enter an image URL or select an image</small>
                </div>
              )}
            </div>

            <div className="poster-info">
              <h3>{formData.title || "Movie Title"}</h3>

              <p>
                {formData.year || "Release year"}{" "}
                {formData.rating ? `• ★ ${formData.rating}` : ""}
              </p>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <form className="movie-form" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label>Movie Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter movie title"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter movie description"
                rows="5"
              />
            </div>

            {/* Image */}
            <div className="form-group">
              <label>Poster Image</label>

              {/* Image URL */}
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                required={!imageFile}
              />

              <div className="image-or">
                <span>OR</span>
              </div>

              {/* Local image */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageBrowse}
              />

              <small className="image-help">
                Enter an image URL or browse an image from your computer.
              </small>
            </div>

            {/* Year + Rating */}
            <div className="form-row">
              {/* Year */}
              <div className="form-group">
                <label>Release Year</label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2025"
                  required
                />
              </div>

              {/* Rating */}
              <div className="form-group">
                <label>Rating</label>

                <div className="rating-input">
                  <span>★</span>

                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="8.5"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                  />

                  <small>/ 10</small>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="form-group">
              <label>Categories</label>

              <div className="category-list">
                {categories.length === 0 ? (
                  <p className="no-categories">No categories available.</p>
                ) : (
                  categories.map((category) => {
                    const selected = formData.categoryIds.includes(category.id);

                    return (
                      <label
                        key={category.id}
                        className={`category-option ${
                          selected ? "selected" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleCategoryChange(category.id)}
                        />

                        {category.name}
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-movie-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>

                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{isEdit ? "✓ Update Movie" : "＋ Add Movie"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MovieForm;
