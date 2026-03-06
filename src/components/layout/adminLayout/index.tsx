import React from 'react';

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      <header
        style={{
          height: 60,
          background: '#001529',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>管理员后台AdminLayout</h2>
      </header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
};

export default AdminLayout;
