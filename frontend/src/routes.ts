import { rootRoute, route, index } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("__root.tsx", [
    // Main routes
    index("index.tsx"),
    route("/login", "login.tsx"),
    route("/register", "register.tsx"),

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
        ])
    ]),

    // brands section
    route("/brands", [
        index("brands/index.tsx"),
        route("/new", "brands/new.tsx"),
        route("/$brandId", [
            index("brands/$brandId/index.tsx"),
            route("/edit", "brands/$brandId/edit.tsx"),
        ])
    ]),
    route("/wishlists", [
        index("wishlists/index.tsx"),
        route("/$wishlistId", [
            index("wishlists/$wishlistId/index.tsx")
        ])
    ])
]);
