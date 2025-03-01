import React from 'react';
import { Box } from '@chakra-ui/react';

interface FormicaryLogoProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const FormicaryLogo: React.FC<FormicaryLogoProps> = ({ 
  width = "40px", 
  height = "40px", 
  color = "#2979FF" 
}) => {
  return (
    <Box 
      as="svg" 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Triangle with rounded corners */}
      <path 
        d="M18 80 L50 20 L82 80 Z" 
        stroke={color} 
        strokeWidth="5" 
        fill="none"
        strokeLinejoin="round"
      />
      
      {/* Antennas */}
      <path
        d="M40 37 L33 27"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 37 L67 27"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Main circle */}
      <circle cx="50" cy="42" r="6" fill={color} />
      
      {/* Middle dot - exactly halfway between big circle and bottom dot */}
      <circle cx="50" cy="55" r="3" fill={color} />
      
      {/* Bottom dot */}
      <circle cx="50" cy="68" r="3" fill={color} />
    </Box>
  );
};

export default FormicaryLogo;
export { FormicaryLogo };
