import { QueryClient } from '@tanstack/react-query';

// Crear una instancia de QueryClient con configuración personalizada
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo de refresco en segundo plano (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo de caché (10 minutos)
      cacheTime: 10 * 60 * 1000,
      // Reintentar 3 veces si falla
      retry: 3,
      // Tiempo entre reintentos (exponencial)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // No refrescar automáticamente al recuperar el foco
      refetchOnWindowFocus: false,
      // Mostrar errores en consola
      onError: (err) => {
        console.error('[Query Error]', err);
      }
    },
    mutations: {
      // Reintentar 2 veces si falla
      retry: 2,
      // Mostrar errores en consola
      onError: (err) => {
        console.error('[Mutation Error]', err);
      }
    }
  }
});

export default queryClient;
