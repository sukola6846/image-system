import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  PictureOutlined,
  UploadOutlined,
  DeleteOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

export const MENU_ITEMS: MenuProps['items'] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'image',
    icon: <PictureOutlined />,
    label: '图片管理',
    children: [
      {
        key: '/images',
        icon: <UnorderedListOutlined />,
        label: '图片列表',
      },
      {
        key: '/images/upload',
        icon: <UploadOutlined />,
        label: '上传图片',
      },
      {
        key: '/images/trash',
        icon: <DeleteOutlined />,
        label: '回收站',
      },
    ],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];
