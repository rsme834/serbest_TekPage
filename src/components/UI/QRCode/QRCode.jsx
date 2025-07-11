import React, { useState } from 'react';
import QRCodeReact from 'react-qr-code';
import Button from '../Button';
import Modal from '../Modal';
import styles from './QRCode.module.css';

const QRCode = ({ 
  value, 
  size = 200, 
  level = 'M',
  includeMargin = true,
  className = '',
  showModal = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    const svg = document.getElementById(`qr-code-${value.slice(-8)}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = size;
    canvas.height = size;
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'payment-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const QRCodeComponent = (
    <div className={`${styles.qrCodeContainer} ${className}`}>
      <QRCodeReact
        id={`qr-code-${value.slice(-8)}`}
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        className={styles.qrCode}
      />
    </div>
  );

  if (showModal) {
    return (
      <>
        <Button 
          variant="secondary" 
          onClick={() => setIsModalOpen(true)}
          className={styles.qrButton}
        >
          📱 Show QR Code
        </Button>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Payment QR Code"
          size="small"
        >
          <div className={styles.modalContent}>
            {QRCodeComponent}
            <p className={styles.qrDescription}>
              Scan this QR code with your phone to open the payment link
            </p>
            <div className={styles.modalActions}>
              <Button onClick={handleDownload} size="small">
                📥 Download QR Code
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return QRCodeComponent;
};

export default QRCode;