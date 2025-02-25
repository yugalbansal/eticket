export const initializeRazorpay = (options: any) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      resolve(rzp);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };

    document.body.appendChild(script);
  });
};