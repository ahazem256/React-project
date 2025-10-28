export type WishlistItem = {
  id: number | string;
  title?: string;
  price?: number;
  image?: string;
  [key: string]: any;
};

const getUserIdentifier = (): string => {
  try {
    const raw = localStorage.getItem("loggedInUser");
    if (!raw) return "guest";
    const user = JSON.parse(raw);
    return String(user.id ?? user.email ?? user.userName ?? "guest");
  } catch {
    return "guest";
  }
};

export const getWishlistKey = (): string => {
  const ident = getUserIdentifier();
  return `wishlist_items_${ident}`;
};

export const loadWishlist = (): WishlistItem[] => {
  try {
    const key = getWishlistKey();
    const raw = localStorage.getItem(key) || "[]";
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;

    // migrate from legacy key ONLY for guests to avoid leaking across accounts
    const ident = key.replace("wishlist_items_", "");
    if (ident === "guest") {
      const legacyRaw = localStorage.getItem("wishlist_items");
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        const list = Array.isArray(legacyParsed) ? legacyParsed : [];
        if (list.length > 0) {
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    }
    return [];
  } catch {
    return [];
  }
};

export const saveWishlist = (items: WishlistItem[]) => {
  const key = getWishlistKey();
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const removeFromWishlistById = (id: number | string) => {
  const items = loadWishlist();
  const next = items.filter((i) => String(i.id) !== String(id));
  saveWishlist(next);
  return next;
};

export const clearWishlist = () => {
  saveWishlist([]);
};


