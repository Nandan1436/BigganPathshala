export const formatBanglaTime = (date) => {
    if (!(date instanceof Date) && date?.toDate) {
      date = date.toDate(); // Convert Firestore Timestamp to Date
    }
    if (!(date instanceof Date)) {
      return "এইমাত্র";
    }
  
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    // Convert number to Bangla numerals
    const toBanglaNumerals = (num) => {
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num.toString().split('').map(digit => banglaDigits[digit]).join('');
    };
  
    if (diffSeconds < 60) {
      return "এইমাত্র";
    } else if (diffMinutes < 60) {
      return `${toBanglaNumerals(diffMinutes)} মিনিট আগে`;
    } else if (diffHours < 24) {
      return `${toBanglaNumerals(diffHours)} ঘন্টা আগে`;
    } else if (diffDays < 7) {
      return `${toBanglaNumerals(diffDays)} দিন আগে`;
    } else {
      // Format date as DD/MM/YYYY in Bangla numerals
      const day = toBanglaNumerals(date.getDate().toString().padStart(2, '0'));
      const month = toBanglaNumerals((date.getMonth() + 1).toString().padStart(2, '0'));
      const year = toBanglaNumerals(date.getFullYear());
      return `${day}/${month}/${year}`;
    }
  };