/* eslint-disable react/no-array-index-key */
import React, { lazy, Suspense, Fragment } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';
import UserGuard from './components/UserGuard';

const routesConfig = [
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/login" />
  },
  {
    exact: true,
    path: '/login',
    layout: MainLayout,
    component: lazy(() => import('./pages/User/Login'))
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('./pages/Error404View'))
  },
  {
    path: '/user',
    guard: UserGuard,
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/user/loading',
        component: lazy(() => import('./pages/User/Loading'))
      },
      {
        exact: true,
        path: '/user/addicational',
        component: lazy(() => import('./pages/User/Addictional'))
      }
    ]
  },
  {
    path: '/panel',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/panel',
        component: lazy(() => import('./pages/Panel'))
      }
    ]
  }
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
