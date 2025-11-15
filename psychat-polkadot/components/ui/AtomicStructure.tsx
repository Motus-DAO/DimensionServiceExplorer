import React from 'react';
import { motion } from 'framer-motion';

interface AtomProps {
  element: 'hydrogen' | 'carbon' | 'nitrogen' | 'oxygen' | 'neon' | 'argon';
  bonds: number;
  position: { x: number; y: number; z: number };
  connections: string[];
  className?: string;
}

interface AtomicStructureProps {
  atoms: AtomProps[];
  className?: string;
}

const AtomComponent: React.FC<AtomProps> = ({ 
  element, 
  bonds, 
  position, 
  connections, 
  className 
}) => {
  const elementColors = {
    hydrogen: '#00FFFF',
    carbon: '#FF00FF', 
    nitrogen: '#9D68FF',
    oxygen: '#00FF00',
    neon: '#FFFF00',
    argon: '#FF8000'
  };

  const elementSizes = {
    hydrogen: 8,
    carbon: 12,
    nitrogen: 10,
    oxygen: 10,
    neon: 14,
    argon: 16
  };

  return (
    <motion.div 
      className={`absolute crystal-atom ${className}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: position.z,
        color: elementColors[element],
        width: elementSizes[element],
        height: elementSizes[element],
        boxShadow: `0 0 20px ${elementColors[element]}`
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
    >
      {/* Sharp geometric nucleus */}
      <div className="crystal-nucleus" />
      
      {/* Precise bond lines */}
      {Array.from({ length: bonds }, (_, index) => (
        <motion.div 
          key={index}
          className="crystal-bond"
          style={{
            transform: `rotate(${index * (360 / bonds)}deg)`,
            backgroundColor: elementColors[element],
            height: `${20 + Math.random() * 10}px`
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
        />
      ))}
    </motion.div>
  );
};

export const AtomicStructure: React.FC<AtomicStructureProps> = ({ 
  atoms, 
  className 
}) => {
  return (
    <div className={`relative ${className}`}>
      {atoms.map((atom, index) => (
        <AtomComponent
          key={`${atom.element}-${index}`}
          {...atom}
        />
      ))}
    </div>
  );
};

// Pre-configured molecular structures
export const WaterMolecule: React.FC<{ className?: string }> = ({ className }) => (
  <AtomicStructure
    atoms={[
      {
        element: 'oxygen',
        bonds: 2,
        position: { x: 50, y: 50, z: 2 },
        connections: ['hydrogen-1', 'hydrogen-2']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 30, y: 40, z: 1 },
        connections: ['oxygen']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 70, y: 40, z: 1 },
        connections: ['oxygen']
      }
    ]}
    className={className}
  />
);

export const MethaneMolecule: React.FC<{ className?: string }> = ({ className }) => (
  <AtomicStructure
    atoms={[
      {
        element: 'carbon',
        bonds: 4,
        position: { x: 50, y: 50, z: 3 },
        connections: ['hydrogen-1', 'hydrogen-2', 'hydrogen-3', 'hydrogen-4']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 30, y: 30, z: 1 },
        connections: ['carbon']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 70, y: 30, z: 1 },
        connections: ['carbon']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 30, y: 70, z: 1 },
        connections: ['carbon']
      },
      {
        element: 'hydrogen',
        bonds: 1,
        position: { x: 70, y: 70, z: 1 },
        connections: ['carbon']
      }
    ]}
    className={className}
  />
);

export const ComplexMolecule: React.FC<{ className?: string }> = ({ className }) => (
  <AtomicStructure
    atoms={[
      {
        element: 'carbon',
        bonds: 3,
        position: { x: 40, y: 50, z: 3 },
        connections: ['carbon-2', 'nitrogen', 'oxygen']
      },
      {
        element: 'carbon',
        bonds: 3,
        position: { x: 60, y: 50, z: 3 },
        connections: ['carbon-1', 'neon', 'argon']
      },
      {
        element: 'nitrogen',
        bonds: 2,
        position: { x: 30, y: 30, z: 2 },
        connections: ['carbon-1', 'oxygen']
      },
      {
        element: 'oxygen',
        bonds: 2,
        position: { x: 20, y: 60, z: 2 },
        connections: ['carbon-1', 'nitrogen']
      },
      {
        element: 'neon',
        bonds: 1,
        position: { x: 80, y: 30, z: 1 },
        connections: ['carbon-2']
      },
      {
        element: 'argon',
        bonds: 1,
        position: { x: 80, y: 70, z: 1 },
        connections: ['carbon-2']
      }
    ]}
    className={className}
  />
);
