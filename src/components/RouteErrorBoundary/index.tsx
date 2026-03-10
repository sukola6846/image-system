import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import styles from './index.module.scss';

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message =
    isRouteErrorResponse(error) && error.data
      ? String(error.data)
      : error instanceof Error
        ? error.message
        : '发生未知错误';

  return (
    <div className={styles.errorBoundary}>
      <Result
        status={status === 404 ? '404' : 'error'}
        title={status === 404 ? '404' : '出错啦'}
        subTitle={message}
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        }
      />
    </div>
  );
};

export default RouteErrorBoundary;
