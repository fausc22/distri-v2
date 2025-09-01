// pages/_app.jsx - VERSIÓN CORREGIDA
import '../styles/globals.css';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; 
import { useRouter } from 'next/router'
import { AuthProvider } from '../components/AuthProvider';
import DefaultLayout from '../components/DefaultLayout';
import AppInitializer from '../components/AppInitializer';
import OfflineGuard from '../components/OfflineGuard';
import PublicLayout from '../components/PublicLayout';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // ✅ PÁGINAS PÚBLICAS - Sin autenticación ni AppHeader
  const publicRoutes = [
    '/login',
    '/comprobante-publico',  // ✅ NUEVA RUTA PÚBLICA
  ];
  
  // ✅ Verificar si es página pública
  const isPublicRoute = publicRoutes.some(route => 
    router.pathname.startsWith(route)
  );

  // ✅ TODOS LOS HOOKS DEBEN ESTAR AQUÍ - ANTES DEL RETURN CONDICIONAL
  
  // ✅ PRECARGA CRÍTICA PARA PWA OFFLINE
  useEffect(() => {
    // Solo aplicar lógica PWA en páginas privadas
    if (isPublicRoute) return;
    
    // Solo ejecutar en cliente y si hay Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Detectar si es PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    window.navigator.standalone ||
                    document.referrer.includes('android-app://');

      if (isPWA) {
        console.log('📱 PWA detectada, iniciando precarga crítica...');
        
        // Precargar recursos críticos para navegación offline
        const criticalResources = [
          '/ventas/RegistrarPedido',
          '/inicio',
          '/login',
          '/',
        ];

        // Precarga con delay para no impactar la carga inicial
        setTimeout(() => {
          criticalResources.forEach((url, index) => {
            setTimeout(() => {
              fetch(url, { 
                method: 'GET',
                credentials: 'include',
                cache: 'force-cache' // Forzar cache
              }).then(() => {
                console.log(`✅ Recurso precargado: ${url}`);
              }).catch((error) => {
                console.log(`⚠️ Precarga fallida para: ${url}`, error.message);
              });
            }, index * 500); // Espaciar las precargas
          });
        }, 2000); // Esperar 2 segundos después de cargar la app
      }

      // ✅ LISTENER PARA UPDATES DEL SERVICE WORKER
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker actualizado, recargando página...');
        window.location.reload();
      });

      // ✅ REGISTRAR SERVICE WORKER SI NO ESTÁ REGISTRADO
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          console.log('✅ Service Worker ya registrado');
          
          // Verificar updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Nueva versión del Service Worker disponible');
          });
        } else {
          console.log('⚠️ Service Worker no registrado, next-pwa debería manejarlo');
        }
      });

      // ✅ PRECARGAR CHUNKS CRÍTICOS DE JAVASCRIPT
      const precargeCriticalChunks = () => {
        const links = document.querySelectorAll('link[rel="preload"][as="script"]');
        links.forEach(link => {
          if (link.href.includes('ventas') || link.href.includes('pages')) {
            // Forzar carga de chunks críticos
            const script = document.createElement('script');
            script.src = link.href;
            script.async = true;
            script.onload = () => console.log(`✅ Chunk precargado: ${link.href}`);
            script.onerror = () => console.log(`⚠️ Error precargando chunk: ${link.href}`);
            // No agregar al DOM, solo precargar
          }
        });
      };

      // Precargar chunks después de la carga inicial
      setTimeout(precargeCriticalChunks, 3000);
    }
  }, [isPublicRoute]); // ✅ Dependencia agregada

  // ✅ MANEJO DE ERRORES DE RED GLOBAL
  useEffect(() => {
    // Solo aplicar en páginas privadas
    if (isPublicRoute) return;
    
    const handleUnhandledRejection = (event) => {
      // Capturar errores de red durante navegación offline
      if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
        console.log('🌐 Error de red capturado globalmente:', event.reason.message);
        event.preventDefault(); // Prevenir que se muestre en consola
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isPublicRoute]); // ✅ Dependencia agregada

  // ✅ DETECCIÓN DE CAMBIOS DE CONECTIVIDAD
  useEffect(() => {
    // Solo aplicar en páginas privadas
    if (isPublicRoute) return;
    
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        console.log('🌐 Aplicación volvió online');
        // Opcional: Verificar updates cuando vuelve online
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.update();
            }
          });
        }
      };

      const handleOffline = () => {
        console.log('📴 Aplicación ahora offline');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [isPublicRoute]); // ✅ Dependencia agregada

  // ✅ AHORA SÍ - RETURN CONDICIONAL DESPUÉS DE TODOS LOS HOOKS
  
  // ✅ PÁGINAS PÚBLICAS - Layout sin AppHeader
  if (isPublicRoute) {
    return (
      <PublicLayout>
        <Component {...pageProps} />
      </PublicLayout>
    );
  }

  // ✅ PÁGINAS PRIVADAS - Layout completo
  // Permite que cada página defina su propio layout (o ninguno)
  const getLayout = Component.getLayout || ((page) => (
    <DefaultLayout>{page}</DefaultLayout>
  ));

  return (
    <AnimatePresence>
      <AuthProvider>
        {/* ✅ WRAPPER DE INICIALIZACIÓN */}
        <AppInitializer>
          {/* ✅ PROTECCIÓN OFFLINE (ahora simplificada) */}
          <OfflineGuard>
            <div className="bg-secondary-light dark:bg-primary-dark transition duration-300">
              {getLayout(<Component {...pageProps} />)}
              
              {/* ✅ TOASTER MEJORADO PARA PWA */}
              <Toaster
                position="top-left"
                containerStyle={{
                  top: 20,
                  right: 20,
                  zIndex: 9999,
                }}
                toastOptions={{
                  duration: 2000,
                  className: 'pwa-toast',
                  style: {
                    background: '#363636',
                    color: '#fff',
                    fontSize: '14px',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  success: {
                    duration: 2000,
                    style: {
                      background: '#10b981',
                      color: 'white',
                    },
                    iconTheme: {
                      primary: 'white',
                      secondary: '#10b981',
                    },
                  },
                  error: {
                    duration: 3000,
                    style: {
                      background: '#ef4444',
                      color: 'white',
                    },
                    iconTheme: {
                      primary: 'white',
                      secondary: '#ef4444',
                    },
                  },
                  warning: {
                    duration: 2000,
                    style: {
                      background: '#f59e0b',
                      color: 'white',
                    },
                    iconTheme: {
                      primary: 'white',
                      secondary: '#f59e0b',
                    },
                  },
                  loading: {
                    duration: 2000,
                    style: {
                      background: '#3b82f6',
                      color: 'white',
                    },
                  },
                  custom: {
                    duration: 2000,
                  },
                  ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                  },
                }}
              />
            </div>
          </OfflineGuard>
        </AppInitializer>
      </AuthProvider>
    </AnimatePresence>
  );
}

export default MyApp;