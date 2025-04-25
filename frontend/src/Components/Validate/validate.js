
const IsValidate = (formData) => {
    console.log('IsValidate function called');
    const requiredFields = ['name','password', 'email'];
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

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(formData.email)) {
      console.error('Please enter a valid email');
      return { isValid: false, errorMessage: 'Please enter a valid email' };
    }

    if (formData.password !== formData.password2) {
        console.error('Passwords do not match');
        return { isValid: false, errorMessage: 'Passwords do not match' };
    }

    return { isValid: true };

  };

  export default IsValidate