import React from 'react';
import { Alert, Button, Card, Empty, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useNavigateWithTransition } from '@/router/hooks/useNavigateWithTransition';
import { getImageList } from '@/apis/images';
import styles from './index.module.scss';

const ImageList: React.FC = () => {
  const navigate = useNavigateWithTransition();
  const listParams = { page: 1, pageSize: 10 } as const;

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['images', listParams],
    queryFn: ({ signal }) => getImageList(listParams, { signal }),
  });

  const handleDetail = (id: string) => {
    navigate(`/images/detail/${id}`);
  };

  return (
    <div className={styles.imageList}>
      <h1 className={styles.title}>图片列表</h1>
      <p className={styles.subtitle}>管理与浏览您的图片素材</p>
      <div className={styles.listArea}>
        {isPending && (
          <div className={styles.loadingWrap}>
            <Spin size="large" />
          </div>
        )}

        {isError && (
          <Alert
            type="error"
            message="加载失败"
            description={error instanceof Error ? error.message : '请稍后重试'}
            showIcon
            action={
              <Button size="small" onClick={() => void refetch()}>
                重试
              </Button>
            }
          />
        )}

        {!isPending && !isError && data && data.items.length === 0 && (
          <Empty description="暂无图片" className={styles.empty} />
        )}

        {!isPending && !isError && data && data.items.length > 0 && (
          <div className={styles.grid}>
            {data.items.map((img) => (
              <Card key={img.id} size="small" title={img.name} className={styles.card}>
                <img src={img.url} alt="" className={styles.thumb} loading="lazy" />
                <Button type="link" block onClick={() => handleDetail(img.id)}>
                  查看详情
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageList;
