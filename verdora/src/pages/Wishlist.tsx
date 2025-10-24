// ...new file...
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";




type Product = {
  id: number | string;
  title?: string;
  price?: number;
  image?: string;
  [key: string]: any;
};

const Wishlish: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);

  const load = () => {
    try {
      const raw = localStorage.getItem("wishlist_items") || "[]";
      const parsed = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("wishlistUpdated", onStorage as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wishlistUpdated", onStorage as EventListener);
    };
  }, []);

  const removeFromWishlist = (id: number | string) => {
    const next = items.filter((i) => i.id !== id);
    localStorage.setItem("wishlist_items", JSON.stringify(next));
    window.dispatchEvent(new Event("wishlistUpdated"));
    setItems(next);
  };

  const moveAllToCart = () => {
    try {
      const parseNumber = (v: any): number => {
        if (v == null) return 0;
        if (typeof v === "number") return v;
        if (typeof v === "string") {
          const m = v.match(/-?\d+(\.\d+)?/);
          return m ? parseFloat(m[0]) : 0;
        }
        return 0;
      };

      const cartRaw = localStorage.getItem("cart_items") || "[]";
      const cart = JSON.parse(cartRaw);
      const cartList = Array.isArray(cart) ? cart : [];

      // build map from existing cart by id
      const map = new Map<string | number, any>();
      cartList.forEach((c: any) => {
        const id = c.id ?? (c.product && c.product.id);
        const normalized = {
          id,
          name: c.name ?? (c.product && c.product.name) ?? c.title ?? "Product",
          price: parseNumber(c.price ?? (c.product && c.product.price) ?? c.salePrice),
          image: c.image ?? (c.product && c.product.image) ?? "",
          quantity: Number(c.quantity ?? 1),
          subtotal: parseNumber(c.subtotal ?? (c.price ?? (c.product && c.product.price))) * Number(c.quantity ?? 1),
          ...c,
        };
        map.set(id, normalized);
      });

      // add wishlist items (as cart items)
      items.forEach((p) => {
        const id = p.id;
        const title = p.title ?? p.name ?? "Product";
        const price = parseNumber(p.price);
        const image = p.image ?? "";

        if (map.has(id)) {
          const existing = map.get(id);
          existing.quantity = Number(existing.quantity ?? 1) + 1;
          existing.subtotal = parseNumber(existing.price) * existing.quantity;
          map.set(id, existing);
        } else {
          const newItem = {
            id,
            name: title,
            price,
            image,
            quantity: 1,
            subtotal: price * 1,
          };
          map.set(id, newItem);
        }
      });

      const deduped = Array.from(map.values());
      localStorage.setItem("cart_items", JSON.stringify(deduped));
      // clear wishlist
      localStorage.setItem("wishlist_items", JSON.stringify([]));
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));
      setItems([]);
      navigate("/cart");
    } catch {
      // ignore
    }
  };

  if (!items.length) {
    return (
      <div className="wishlist-page container py-5">
        <h1 className="text-center mb-4">Wishlist</h1>
        <div className="empty text-center">
          <p>Your wishlist is empty.</p>
          <Link to="/products" className="btn btn-outline-success">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container py-5">
      <h1 className="text-center mb-4" style={{color: "var(--color-green-darker)"}}>Wishlist</h1>

      <div className="row g-3">
        {items.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100">
              {p.image && (
                <img src={p.image} className="card-img-top" alt={p.title || "product"} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title || "Product"}</h5>
                <p className="card-text mb-2">{p.price ? `$${p.price}` : ""}</p>
                <div className="mt-auto d-flex gap-2">
                  <Link to={`/product/${p.id}`} className="btn btn-outline-secondary btn-sm">
                    View
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromWishlist(p.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom controls: item count above a smaller move-all button */}
      <div className="wishlist-footer text-center mt-4" >
        <div className="mb-3" >
          <strong>{items.length}</strong> item{items.length > 1 ? "s" : ""}
        </div>
        <button
  className="btn btn-lg"
  style={{
    backgroundColor: "var(--color-green-darker)",
    color: "#fff",
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    (e.target as HTMLButtonElement).style.backgroundColor = "var(--color-green-dark)";
    (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    (e.target as HTMLButtonElement).style.backgroundColor = "var(--color-green-darker)";
    (e.target as HTMLButtonElement).style.transform = "scale(1)";
  }}
  onClick={moveAllToCart}
  aria-label="Move all wishlist items to cart"
>
  Move all to cart
</button>

      </div>
    </div>
  );
};

export default Wishlish;
// ...new file...