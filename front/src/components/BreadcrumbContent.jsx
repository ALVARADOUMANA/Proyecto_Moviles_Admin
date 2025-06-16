// src/components/BreadcrumbContent.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'react-feather';

const BreadcrumbContent = () => {
  const location = useLocation();

  // Generar los breadcrumbs basados en la ruta actual
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    const breadcrumbs = [
      { path: '/', label: 'Home' }
    ];
    
    let currentPath = '';
    paths.forEach(path => {
      currentPath += `/${path}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1).replace('_', ' ');
      breadcrumbs.push({ path: currentPath, label });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="breadcrumb-container mb-3">
      <div className="d-flex align-items-center flex-wrap">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <div key={item.path} className="d-flex align-items-center">
              {index > 0 && (
                <ChevronRight size={16} className="mx-2 text-muted" />
              )}
              
              {isLast ? (
                <span className="fw-bold text-dark">{item.label}</span>
              ) : (
                <Link 
                  to={item.path}
                  className="text-muted text-decoration-none"
                  style={{ fontWeight: 500 }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BreadcrumbContent;