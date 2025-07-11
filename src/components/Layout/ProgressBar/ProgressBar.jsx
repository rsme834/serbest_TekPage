import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ 
  steps = [], 
  currentStep = 0,
  className = '',
  ...props 
}) => {
  const progressClasses = [
    styles.progressBar,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={progressClasses} {...props}>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          const stepClasses = [
            styles.step,
            isCompleted && styles.completed,
            isCurrent && styles.current,
            isUpcoming && styles.upcoming
          ].filter(Boolean).join(' ');

          return (
            <div key={index} className={stepClasses}>
              <div className={styles.stepIndicator}>
                <div className={styles.stepCircle}>
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M20 6L9 17l-5-5" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className={styles.stepNumber}>{index + 1}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={styles.stepLine} />
                )}
              </div>
              
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
                {step.subtitle && (
                  <div className={styles.stepSubtitle}>{step.subtitle}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;