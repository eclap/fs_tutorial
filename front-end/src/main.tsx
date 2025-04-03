import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import { GlobalLoadingProvider } from './contexts/GlobalLoadingContext';
import { ToasterProvider } from './contexts/ToasterContext';
import { Layout } from './pages/Layout';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { Tasks } from './pages/Tasks';
import { TaskCreate } from './pages/TaskCreate';
import { TaskUpdate } from './pages/TaskUpdate';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css'

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route 
            element={
              <Layout>
                <GlobalLoadingProvider>
                  <ToasterProvider>
                    <ProtectedRoute />
                  </ToasterProvider>
                </GlobalLoadingProvider>
              </Layout>
            }
          >
            <Route path="/" element={<Tasks />} />
            <Route path="/create" element={<TaskCreate />} />
            <Route path="/:taskId" element={<TaskUpdate />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};


createRoot(document.getElementById('root')!).render(<App />);
