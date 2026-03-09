'use client';

import React from 'react';
import { Breadcrumb } from "@/shared/ui/breadcrumb/Breadcrumb";

export const NotebookHeader = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: "48px",
        left: "312px",
        width: '100%',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        zIndex: 5,
      }}
    >
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Notebook</Breadcrumb.Item>
          <Breadcrumb.Item active={false}>Draft Note</Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </header>
  );
};
