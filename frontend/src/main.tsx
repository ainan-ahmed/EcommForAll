import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css'
import { routeTree } from './routeTree.gen'
import { MantineProvider } from '@mantine/core'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createRouter, RouterProvider} from "@tanstack/react-router";

const queryClient = new QueryClient();
const router = createRouter({ routeTree});
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
const rootElement = document.getElementById('root')!;
  if(!rootElement.innerHTML){
      const root = createRoot(rootElement);
      root.render(
          <StrictMode>
                <MantineProvider defaultColorScheme="dark">
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={router}/>
                    </QueryClientProvider>
                </MantineProvider>
            </StrictMode>
        );
  }