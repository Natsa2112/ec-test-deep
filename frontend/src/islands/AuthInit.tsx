import { useEffect } from "react";
import { initAuth } from "../stores/auth";
import { loadCart } from "../stores/cart";

export default function AuthInit() {
  useEffect(() => {
    initAuth();
    loadCart();
  }, []);
  return null;
}
