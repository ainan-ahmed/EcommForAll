import { rootRoute, route, index } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("__root.tsx", [
    // Main routes
    route("/about", "about.tsx"),
    index("index.tsx"),
    route("/login", "login.tsx"),
    route("/register", "register.tsx"),
    route("/forgot-password", "forgot-password.tsx"),
    route("/reset-password", "reset-password.tsx"),
    route("/cart", "cart.tsx"),

    // Products section
    route("/products", [
        index("products/index.tsx"),
        route("/new", "products/new.tsx"),
        route("/$productId", [
            index("products/$productId/index.tsx"),
            route("/edit", "products/$productId/edit.tsx"),
        ]),
    ]),

    // Categories section
    route("/categories", [
        index("categories/index.tsx"),
        route("/new", "categories/new.tsx"),
        route("/$categorySlug", [
            index("categories/$categorySlug/index.tsx"),
            route("/edit", "categories/$categorySlug/edit.tsx"),
        ]),
    ]),

    // brands section
    route("/brands", [
        index("brands/index.tsx"),
        route("/new", "brands/new.tsx"),
        route("/$brandId", [
            index("brands/$brandId/index.tsx"),
            route("/edit", "brands/$brandId/edit.tsx"),
        ]),
    ]),
    // wishlists section
    route("/wishlists", [
        index("wishlists/index.tsx"),
        route("/$wishlistId", [index("wishlists/$wishlistId/index.tsx")]),
    ]),
    // orders section
    route("/orders", [
        index("orders/index.tsx"),
        route("/checkout", "orders/checkout.tsx"),
        route("/admin", "orders/admin.tsx"),
        route("/$orderId", [index("orders/$orderId/index.tsx")]),
    ]),

    // profile section
    route("/profile", [
        index("profile/index.tsx"),
        route("/edit", "profile/edit.tsx"),
    ]),
]);
