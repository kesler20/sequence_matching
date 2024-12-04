// NewWindow.tsx
import React, { useEffect, useRef } from 'react';

interface NewWindowProps {
  children: React.ReactNode;
}

const NewWindow: React.FC<NewWindowProps> = ({ children }) => {
  const newWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    newWindowRef.current = window.open('', '', 'width=800,height=600');
    if (newWindowRef.current) {
      newWindowRef.current.document.body.appendChild(document.createElement('div'));
    }

    return () => {
      newWindowRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (newWindowRef.current) {
      newWindowRef.current.document.body.childNodes[0].textContent = '';
      newWindowRef.current.document.body.childNodes[0].appendChild(document.createElement('div'));
      newWindowRef.current.document.body.childNodes[0].childNodes[0].appendChild(children as any);
    }
  }, [children]);

  return null;
};

export default NewWindow;
