import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
const queryClient = new QueryClient(); // Export queryClient so it can be imported in route files

const router = createRouter({
    routeTree,
});

// Define the type for the router context to include queryClient
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }

    // Add this interface to define context types
    interface RouterContext {
        queryClient: QueryClient;
    }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <MantineProvider defaultColorScheme="dark">
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <Notifications />
                </QueryClientProvider>
            </MantineProvider>
        </StrictMode>
    );
}
