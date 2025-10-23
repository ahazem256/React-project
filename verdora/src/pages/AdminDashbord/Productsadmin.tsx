import { useState, useEffect } from "react";
import "../../styles/global.css";
import type { Products } from "../../Types";
import axios from "axios";
import toast from "react-hot-toast";

export default function Productsadmin() {
  const [products, setProducts] = useState<Products[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [newProduct, setNewProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(false);

  async function getproducts() {
    try {
      setLoading(true);
      const res = await axios.get<Products[]>("http://localhost:5005/products");
      console.log("Products data:", res.data);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getproducts();
  }, []);

  // delete product
  const handleDelete = async (productId: number, productName: string) => {
    try {
      await axios.delete(`http://localhost:5005/products/${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      toast.success(`${productName} deleted successfully!`);
    } catch (error) {
      toast.error(`Error in deleting ${productName}`);
    }
  };

  const handleSave = async () => {
    if (!editingProduct && !newProduct) return;

    const productToSave = editingProduct || newProduct;
    if (!productToSave) return;

    try {
      console.log("Saving product:", productToSave);

      if (editingProduct) {
        const res = await axios.put(
          `http://localhost:5005/products/${editingProduct.id}`,
          editingProduct
        );
        
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data : p))
        );
        setEditingProduct(null);
        toast.success(`${editingProduct.name} updated successfully!`);
        
      } else if (newProduct) {
        const numericIds = products.map(p => Number(p.id)).filter(id => !isNaN(id));
        const lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        
        const productToSend = {
          ...newProduct,
          id: lastId + 1,
        };

        const res = await axios.post(
          "http://localhost:5005/products",
          productToSend
        );

        setProducts((prev) => [...prev, res.data]);
        setNewProduct(null);
        toast.success(`${res.data.name} added successfully!`);
      }

      setTimeout(() => {
        getproducts();
      }, 500);
      
    } catch (error) {
      console.error("Error saving product:", error);
      const productName = editingProduct?.name || newProduct?.name || "Product";
      toast.error(`Failed to save ${productName}`);
    }
  };

  // Filter with category and status
  const productsPerPage = 10;
  const sanitizedSearch = searchTerm.trim().replace(/[^a-zA-Z0-9 ]/g, "");

  const filterProducts = products
    .filter((p) => categoryFilter === "All" || p.category === categoryFilter)
    .filter(
      (p) =>
        statusFilter === "All" ||
        (statusFilter === "Active" && p.stock >= 10) ||
        (statusFilter === "Lowstock" && p.stock > 0 && p.stock < 10) ||
        (statusFilter === "Outofstock" && p.stock === 0)
    )
    .filter(
      (p) =>
        sanitizedSearch === "" ||
        p.name.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(sanitizedSearch.toLowerCase()))
    );

  // pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="container mt-3">
        <div className="d-flex justify-content-between flex-wrap">
          <h1
            className="mb-4"
            style={{
              color: "var(--color-green-darker)",
              fontFamily: "var(--font-family-serif)",
            }}
          >
            Products Management {loading && "(Loading...)"}
          </h1>
          <button
            className="btn h-25 mt-2 text-light"
            style={{
              background: "var(--color-green-darker)",
              fontFamily: "var(--font-family-serif)",
            }}
            onClick={() => {
              const numericIds = products.map(p => Number(p.id)).filter(id => !isNaN(id));
              const lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

              setNewProduct({
                id: lastId + 1,
                name: "",
                image: "",
                category: "Indoor",
                price: "0 EGP",
                stock: 0,
                bestseller: false,
                oldprice: "",
                rate: "4.5",
                description: "",
                review: "",
                discount: "0%",
                isNew: false,
                scientificName: "",
                nativeRegion: "",
                lifeCycle: "",
                genus: "",
                type: "",
                climate: "",
                soilType: "",
                wateringNeeds: "",
                sunlight: "",
                humidity: "",
                growthRate: "",
                propagation: "",
                toxicity: "",
                careTips: "",
                floweringSeason: "",
                height: "",
                containerType: "",
              });
              setEditingProduct(null);
            }}
          >
            + Add New Product
          </button>
        </div>

        {/* Info */}
        <div style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
          <small>
            Total Products: {products.length} | 
            Filtered: {filterProducts.length} | 
            Showing: {currentProducts.length} |
            {editingProduct && ` Editing: ${editingProduct.name} (ID: ${editingProduct.id})`}
            {newProduct && ` Adding New Product`}
          </small>
        </div>

        <div
          className="d-flex mb-3 gap-2"
          style={{ fontFamily: "var(--font-family-serif)" }}
        >
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Bonsai & Miniature Plants">Bonsai & Miniature Plants</option>
            <option value="Flowering Plants">Flowering Plants</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Lowstock">Low Stock</option>
            <option value="Outofstock">Out of Stock</option>
          </select>

          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table
            className="table table-bordered align-middle"
            style={{ width: "100%", fontFamily: "var(--font-family-serif)" }}
          >
            <thead className="table-light">
              <tr
                className="text-center"
                style={{ background: "var(--color-green-darker)", color: "white" }}
              >
                <th scope="col" style={{ width: "10px" }}>
                  Id
                </th>
                <th scope="col" style={{ width: "80px" }}>
                  Image
                </th>
                <th scope="col">
                  Name
                </th>
                <th scope="col" style={{ width: "90px" }}>
                  Category
                </th>
                <th scope="col">
                  Price
                </th>
                <th scope="col" style={{ width: "50px" }}>
                  Stock
                </th>
                <th scope="col" style={{ width: "100px" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "150px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 text-center">
                    <td className="border">{p.id}</td>
                    <td className="border px-5 py-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover mx-auto rounded"
                        style={{ width: "70px", height: "70px" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/70x70?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">{p.name}</td>
                    <td className="border px-4 py-2">{p.category}</td>
                    <td className="border px-4 py-2">{p.price}</td>
                    <td className="border px-4 py-2">{p.stock}</td>
                    <td className="border px-4 py-2">
                      {p.stock === 0 ? (
                        <span className="px-2 py-1 rounded text-sm border border-1 border-danger text-light bg-danger">
                          Soldout
                        </span>
                      ) : p.stock < 10 ? (
                        <span className="px-2 py-1 rounded text-sm border-1 border-warning text-dark bg-warning">
                          Limited
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-sm border-1 border-success text-light bg-success">
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm me-2"
                        style={{
                          color: "var(--color-green-darkest)",
                          border: "1px solid var(--color-green-darkest)",
                          width: "55px",
                        }}
                        onClick={() => {
                          console.log("Editing product:", p);
                          setEditingProduct(p);
                          setNewProduct(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn border-danger text-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${p.name}?`)) {
                            handleDelete(p.id, p.name);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    {loading ? "Loading products..." : "No products found matching your criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              gap: "10px",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  padding: "7px 15px",
                  borderRadius: "50px",
                  border:
                    currentPage === index + 1
                      ? "1px solid var(--color-green-darker)"
                      : "1px solid gray",
                  background:
                    currentPage === index + 1
                      ? "var(--color-green-darker)"
                      : "#fff",
                  color: currentPage === index + 1 ? "#fff" : "#000",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Edit/Add Product Modal */}
      {(editingProduct || newProduct) && (
  <div
    className="modal-overlay"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "var(--font-family-serif)",
    }}
  >
    <div
      className="modal-content"
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "95%",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="modal-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #dee2e6",
          paddingBottom: "10px",
        }}
      >
        <h5 style={{ margin: 0, color: "var(--color-green-darker)" }}>
          {editingProduct ? `Edit Product (ID: ${editingProduct.id})` : "Add New Product"}
        </h5>
        <button
          onClick={() => {
            setEditingProduct(null);
            setNewProduct(null);
          }}
          style={{
            border: "none",
            background: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#999",
          }}
        >
          &times;
        </button>
      </div>

      <div className="modal-body">
        {/* Basic Information Section */}
        <div className="row">
          <div className="col-md-6">
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.name : newProduct?.name || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, name: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, name: value });
                }}
                placeholder="Enter product name"
              />
            </div>
          </div>
          <div className="col-md-6">
            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={editingProduct ? editingProduct.category : newProduct?.category || "Indoor"}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, category: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, category: value });
                }}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Bonsai & Miniature Plants">Bonsai & Miniature Plants</option>
                <option value="Flowering Plants">Flowering Plants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            rows={3}
            value={editingProduct ? editingProduct.description : newProduct?.description || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (editingProduct)
                setEditingProduct({ ...editingProduct, description: value });
              else if (newProduct)
                setNewProduct({ ...newProduct, description: value });
            }}
            placeholder="Enter product description"
          />
        </div>

        {/* Image Section */}
        <div className="mb-3">
          <label className="form-label">Product Image *</label>
          
          {/* Option 1: Upload from device */}
          <div className="mb-2">
            <label className="form-label small text-muted">Upload from device:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                  toast.error('Please select a valid image file (JPEG, PNG, GIF, etc.)');
                  return;
                }

                if (file.size > 5 * 1024 * 1024) {
                  toast.error('Image size should be less than 5MB');
                  return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                  const base64Image = event.target?.result as string;
                  
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, image: base64Image });
                  } else if (newProduct) {
                    setNewProduct({ ...newProduct, image: base64Image });
                  }
                  
                  toast.success('Image uploaded successfully!');
                };
                reader.onerror = () => {
                  toast.error('Failed to upload image');
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
            <div className="form-text">Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)</div>
          </div>

          {/* Option 2: Enter URL */}
          <div className="mb-2">
            <label className="form-label small text-muted">Or enter image URL:</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.image : newProduct?.image || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, image: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, image: value });
                }}
                placeholder="https://example.com/image.jpg"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, image: "" });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, image: "" });
                }}
              >
                Clear
              </button>
            </div>
            <div className="form-text">Enter a direct image URL</div>
          </div>

          {/* Image Preview */}
          {(editingProduct?.image || newProduct?.image) && (
            <div className="mt-3">
              <label className="form-label small text-muted">Image Preview:</label>
              <div className="d-flex flex-column align-items-start">
                <img
                  src={editingProduct ? editingProduct.image : newProduct!.image}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #dee2e6",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x200?text=Invalid+Image";
                    toast.error('Failed to load image. Please check the URL or upload a new image.');
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => {
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, image: "" });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, image: "" });
                  }}
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="row">
          <div className="col-md-4">
            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price (EGP) *</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={
                    editingProduct
                      ? parseFloat(editingProduct.price.replace(' EGP', '')) || 0
                      : parseFloat(newProduct?.price.replace(' EGP', '') || "0")
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, price: `${value} EGP` });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, price: `${value} EGP` });
                  }}
                  min="0"
                  step="0.01"
                />
                <span className="input-group-text">EGP</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* Old Price */}
            <div className="mb-3">
              <label className="form-label">Old Price (EGP)</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.oldprice : newProduct?.oldprice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, oldprice: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, oldprice: value });
                }}
                placeholder="140 EGP"
              />
            </div>
          </div>
          <div className="col-md-4">
            {/* Discount */}
            <div className="mb-3">
              <label className="form-label">Discount</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.discount : newProduct?.discount || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, discount: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, discount: value });
                }}
                placeholder="15%"
              />
            </div>
          </div>
        </div>

        {/* Stock & Status Section */}
        <div className="row">
          <div className="col-md-4">
            {/* Stock */}
            <div className="mb-3">
              <label className="form-label">Stock *</label>
              <input
                type="number"
                className="form-control"
                value={editingProduct ? editingProduct.stock : newProduct?.stock || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, stock: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, stock: value });
                }}
                min="0"
              />
            </div>
          </div>


          <div className="col-md-4">
         
            <div className="mb-3">
              <label className="form-label">Rating</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.rate : newProduct?.rate || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, rate: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, rate: value });
                }}
                placeholder="⭐⭐⭐⭐⭐"
              />
            </div>
          </div>
          <div className="col-md-4">
          
            <div className="mb-3">
              <label className="form-label">Review</label>
              <input
                type="text"
                className="form-control"
                value={editingProduct ? editingProduct.review : newProduct?.review || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, review: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, review: value });
                }}
                placeholder="Perfect decorative piece..."
              />
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="row">
          <div className="col-md-6">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={editingProduct ? editingProduct.bestseller : newProduct?.bestseller || false}
                onChange={(e) => {
                  const value = e.target.checked;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, bestseller: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, bestseller: value });
                }}
              />
              <label className="form-check-label">Bestseller</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={editingProduct ? editingProduct.isNew : newProduct?.isNew || false}
                onChange={(e) => {
                  const value = e.target.checked;
                  if (editingProduct)
                    setEditingProduct({ ...editingProduct, isNew: value });
                  else if (newProduct)
                    setNewProduct({ ...newProduct, isNew: value });
                }}
              />
              <label className="form-check-label">New Arrival</label>
            </div>
          </div>
        </div>

        {/* Plant Details Section */}
        <div className="border-top pt-3 mt-3">
          <h6 className="mb-3" style={{ color: "var(--color-green-darker)" }}>Plant Details</h6>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Scientific Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.scientificName : newProduct?.scientificName || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, scientificName: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, scientificName: value });
                  }}
                  placeholder="Mixed Succulent spp."
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Native Region</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.nativeRegion : newProduct?.nativeRegion || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, nativeRegion: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, nativeRegion: value });
                  }}
                  placeholder="Worldwide (desert regions)"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Life Cycle</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.lifeCycle : newProduct?.lifeCycle || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, lifeCycle: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, lifeCycle: value });
                  }}
                  placeholder="Perennial"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Genus</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.genus : newProduct?.genus || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, genus: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, genus: value });
                  }}
                  placeholder="Various"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.type : newProduct?.type || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, type: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, type: value });
                  }}
                  placeholder="Succulent collection"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Care & Environment Section */}
        <div className="border-top pt-3 mt-3">
          <h6 className="mb-3" style={{ color: "var(--color-green-darker)" }}>Care & Environment</h6>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Climate</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.climate : newProduct?.climate || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, climate: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, climate: value });
                  }}
                  placeholder="Arid to semi-arid"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Soil Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.soilType : newProduct?.soilType || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, soilType: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, soilType: value });
                  }}
                  placeholder="Well-draining cactus soil"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Watering Needs</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.wateringNeeds : newProduct?.wateringNeeds || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, wateringNeeds: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, wateringNeeds: value });
                  }}
                  placeholder="Low"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Sunlight</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.sunlight : newProduct?.sunlight || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, sunlight: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, sunlight: value });
                  }}
                  placeholder="Bright indirect to full sun"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Humidity</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.humidity : newProduct?.humidity || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, humidity: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, humidity: value });
                  }}
                  placeholder="Low"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Growth Rate</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.growthRate : newProduct?.growthRate || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, growthRate: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, growthRate: value });
                  }}
                  placeholder="Slow"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Propagation</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.propagation : newProduct?.propagation || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, propagation: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, propagation: value });
                  }}
                  placeholder="Offsets or leaf cuttings"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Toxicity</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.toxicity : newProduct?.toxicity || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, toxicity: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, toxicity: value });
                  }}
                  placeholder="Mostly non-toxic"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Flowering Season</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.floweringSeason : newProduct?.floweringSeason || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, floweringSeason: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, floweringSeason: value });
                  }}
                  placeholder="Varies by species"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Height</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.height : newProduct?.height || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, height: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, height: value });
                  }}
                  placeholder="0.1 - 0.3 m"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Container Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct ? editingProduct.containerType : newProduct?.containerType || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (editingProduct)
                      setEditingProduct({ ...editingProduct, containerType: value });
                    else if (newProduct)
                      setNewProduct({ ...newProduct, containerType: value });
                  }}
                  placeholder="Pot"
                />
              </div>
            </div>
          </div>

          {/* Care Tips */}
          <div className="mb-3">
            <label className="form-label">Care Tips</label>
            <textarea
              className="form-control"
              rows={2}
              value={editingProduct ? editingProduct.careTips : newProduct?.careTips || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (editingProduct)
                  setEditingProduct({ ...editingProduct, careTips: value });
                else if (newProduct)
                  setNewProduct({ ...newProduct, careTips: value });
              }}
              placeholder="Avoid overwatering; rotate for even growth."
            />
          </div>
        </div>
      </div>

      <div
        className="modal-footer"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
          borderTop: "1px solid #dee2e6",
          paddingTop: "15px",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={() => {
            setEditingProduct(null);
            setNewProduct(null);
          }}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={
            (!editingProduct?.name && !newProduct?.name) ||
            (!editingProduct?.description && !newProduct?.description) ||
            (!editingProduct?.image && !newProduct?.image)
          }
          style={{
            background: "var(--color-green-darker)",
            border: "none",
          }}
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>
    </div>
  </div>
)}
</div>
    </>
  );
}