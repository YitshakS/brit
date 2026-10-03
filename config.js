// כאן משנים הכול: כתובת ה-API, פרטי האירוע והודעת הוואטסאפ.
// אם API_URL ריק, האתר עובד במצב דמו עם נתונים מדומים (לבדיקה בלבד).
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbza3nzwuP0mCGCZoVjnNQxd0tUPKknyodH5s0kzQZxeHQhATqJRFZi7asBpvpW9FxqZ/exec',
  SITE_URL: '', // ריק = אותה תיקייה של דף הניהול

  event: {
    title: 'הזמנה לברית',
    opening: 'בשבח והודיה לה\' יתברך',
    babyName: '', // לא מגלים לפני הברית. אחרי הברית אפשר למלא כאן את השם והוא יוצג בגדול
    dateText: 'יום שלישי כ"ה בתשרי ה\'תשפ"ז (06/10/2026)',
    timeText: 'הברית בשעה 16:45 בעתודה לשכונה הדרומית של הישוב אביתר',
    place: 'ולאחר מכן סעודת המצווה בבית הכנסת של הישוב אביתר',
    wazeUrl: '',
    mapImage: 'img/map.jpg', // מפת הגעה (ריק = בלי מפה)
    note: '',
    rsvpDeadline: ''
  },

  // {name} שם בהזמנה, {dear} היקר/היקרה, {inviteYou} להזמינך/ם/ן, {link} הקישור האישי
  messageTemplate:
    'שלום {name} {dear},\nאנו שמחים ונרגשים {inviteYou} על ברית בננו.\nפרטים ואישור הגעה בקישור האישי שלך:\n{link}'
};
