export const generateOTP = (digits: number): string => {
  if (digits < 1) {
    return "";
  }

  let otp = "";
  for (let i = 0; i < digits; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};