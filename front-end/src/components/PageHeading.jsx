import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeading({ title, align = 'center', className = '' }) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`flex flex-col mb-12 ${alignClass} ${className}`}
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-blue-950 tracking-[0.25em] uppercase leading-tight">
        {title}
      </h1>
    </motion.div>
  );
}
