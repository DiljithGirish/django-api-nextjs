"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Fetches menu data from the API using relative path.
 */
async function getMenu() {
  const res = await fetch("/api/menu");
  if (!res.ok) {
    throw new Error("Failed to fetch menu");
  }
  return res.json();
}

/**
 * Deletes a menu item by ID using relative API path.
 */
async function deleteMenu(id) {
  const res = await fetch(`/api/menu/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete menu");
  }
}

/**
 * The main home page component showing all menu items.
 */
export default function Page() {
  const [menuItems, setMenuItems] = useState(null);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState({
    show: false,
    type: "",
  });

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenu();
      setMenuItems(data);
    };
    fetchMenu().catch(console.error);
  }, []);

  useEffect(() => {
    if (params.get("action")) {
      setDisplaySuccessMessage({
        type: params.get("action"),
        show: true,
      });
      router.replace("/");
    }
  }, [params, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displaySuccessMessage.show) {
        setDisplaySuccessMessage({ show: false, type: "" });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [displaySuccessMessage.show]);

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
      setMenuItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <button className="add-button" onClick={() => router.push("/add")}>
        Add
      </button>

      {displaySuccessMessage.show && (
        <p className="success-message">
          {displaySuccessMessage.type === "add" ? "Added a" : "Modified a"} menu item.
        </p>
      )}

      {menuItems ? (
        menuItems.map((item) => (
          <div className="menu-item" key={item.id}>
            <div className="menu-item-info">
              <div className="menu-item-name">{item.name}</div>
              <div className="menu-item-price">${item.price.toFixed(2)}</div>
            </div>
            <div className="menu-item-actions">
              <button className="edit-button" onClick={() => router.push(`/update/${item.id}`)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

