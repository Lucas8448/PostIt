import React, { useEffect } from 'react';

const Presentation = () => {
  useEffect(() => {
    const downloadPdf = () => {
      fetch('./Presentation.pdf')
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'Presentation.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Error downloading PDF:', error);
        });
    };
    downloadPdf();
  }, []);

  return (
    <div>
      <p>Your PDF will be downloaded automatically, and you will be redirected to the home page.</p>
    </div>
  );
};

export default Presentation;