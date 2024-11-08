import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../components/AppHeader';
import AppAsaid from '../components/AppAsaid';

const { Content } = Layout;

const Template = ({ children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <AppAsaid />
    <Layout>
      <AppHeader />
      <Content>
        {children}
      </Content>
    </Layout>
  </Layout>
);

export default Template;
