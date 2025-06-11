import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import ObjetivosCalidadListing from '@/components/objetivos-calidad/ObjetivosCalidadListing';

const ObjetivosCalidadPage = () => {
  return (
    <>
      <Helmet>
        <title>Objetivos de Calidad | ISO Flow</title>
      </Helmet>
      
      <Container>
        <PageHeader
          title="Objetivos de Calidad"
          description="Gestión de objetivos de calidad del sistema de gestión"
        />
        
        <div className="mt-6">
          <ObjetivosCalidadListing />
        </div>
      </Container>
    </>
  );
};

export default ObjetivosCalidadPage;
