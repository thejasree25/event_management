
import { useEffect, useState } from "react";
import { Tags, Search, Plus, RefreshCw } from "lucide-react";
import axios from "axios";
import "../styles/admin-categories.css";

const API_URL = "http://localhost:8080/api/admin/categories";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load categories. Check your backend API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (event) => {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      setError("Please enter a category name.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      // Change this endpoint if your backend uses a different route.
      await axios.post("http://localhost:8080/api/categories", {
        name,
      });

      setCategoryName("");
      setMessage("Category added successfully.");
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not add category. Verify your backend POST endpoint."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    String(category.name ?? category.categoryName ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="admin-categories-page">
      <section className="categories-header">
        <div>
          <p className="categories-eyebrow">EVENTLY ADMINISTRATION</p>
          <h1>Manage Categories</h1>
          <p>Organize event categories in one place.</p>
        </div>

        <button
          type="button"
          className="categories-refresh"
          onClick={loadCategories}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </section>

      <section className="categories-summary">
        <div className="categories-summary-icon">
          <Tags size={25} />
        </div>
        <div>
          <p>Total Categories</p>
          <h2>{categories.length}</h2>
        </div>
      </section>

      <section className="categories-panel">
        <h2>Add Category</h2>

        <form className="categories-form" onSubmit={addCategory}>
          <input
            type="text"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Enter category name"
            maxLength={100}
            required
          />

          <button type="submit" disabled={saving}>
            <Plus size={18} />
            {saving ? "Adding..." : "Add Category"}
          </button>
        </form>

        {message && <p className="categories-success">{message}</p>}
        {error && <p className="categories-error">{error}</p>}
      </section>

      <section className="categories-list-panel">
        <div className="categories-list-heading">
          <h2>All Categories</h2>

          <div className="categories-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
            />
          </div>
        </div>

        {loading ? (
          <p className="categories-empty">Loading categories...</p>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <article
                className="category-card"
                key={category.id ?? category.categoryId ?? category.name}
              >
                <div className="category-card-icon">
                  <Tags size={22} />
                </div>

                <h3>{category.name ?? category.categoryName ?? "Unnamed"}</h3>

                <p>
                  Category ID:{" "}
                  {category.id ?? category.categoryId ?? "Not provided"}
                </p>
              </article>
            ))}

            {filteredCategories.length === 0 && (
              <p className="categories-empty">
                {categories.length === 0
                  ? "No categories found."
                  : "No matching categories."}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
