// الصور تُجهَّز بواسطة: npm run prepare-images (تُحفظ في uploads/)
module.exports = [
  {
    slug: 'bella-face',
    name: 'Bella Face',
    nameAr: 'بيلا فيس',
    description:
      'قطعة ديكورية من الرزين بوجه أنثوي هادئ وخصلات شعر منسدلة بنحت دقيق. تصلح كحامل أقلام أو أدوات مكياج أو كقطعة تزيين للمكتب وغرفة النوم.',
    price: 1500,
    order: 1,
    colors: [
      { name: 'نحاسي وبيج', hex: '#b9704f', image: '/files/bella-face-1.jpg' },
      { name: 'وردي', hex: '#f06a9b', image: '/files/bella-face-2.jpg' },
      { name: 'فوشيا', hex: '#c24fa8', image: '/files/bella-face-3.jpg' },
      { name: 'موف رمادي', hex: '#a07890', image: '/files/bella-face-4.jpg' },
    ],
  },
  {
    slug: 'bella-girl',
    name: 'Bella Girl',
    nameAr: 'بيلا جيرل',
    description:
      'تمثال نصفي من الرزين لفتاة بشعر متموّج، بتفاصيل ناعمة وألوان متعددة. يضيف لمسة فنية لمساحتك ويُستعمل كحامل أقلام أو مزهرية صغيرة.',
    price: 1500,
    order: 2,
    colors: [
      { name: 'وردي', hex: '#f4a3bd', image: '/files/bella-girl-1.jpg' },
      { name: 'وردي وذهبي', hex: '#f2a98f', image: '/files/bella-girl-2.jpg' },
      { name: 'أزرق وبنفسجي', hex: '#6aa6d6', image: '/files/bella-girl-3.jpg' },
      { name: 'أخضر', hex: '#a6cf3a', image: '/files/bella-girl-4.jpg' },
    ],
  },
];
