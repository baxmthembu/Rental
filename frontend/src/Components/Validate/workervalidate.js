import { useState } from "react";

const Validate = (formData) => {
    console.log('IsValidate function called');
    const requiredFields = ['name','password'];
    let isProceed = true;
    let errorMessage = 'Please enter a value for ';

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field] === '') {
        isProceed = false;
        errorMessage += `${field.charAt(0).toUpperCase() + field.slice(1)}, `;
      }
    });

    if (!isProceed) {
      console.error(errorMessage.slice(0, -2)); // Remove the last comma and space
      return { isValid: false, errorMessage: errorMessage.slice(0, -2) };
    }

    return { isValid: true };

  };

export default Validate