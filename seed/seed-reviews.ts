export type SeedReview = {
  userId: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
};

export const seedReviews: SeedReview[] = [
  {
    userId: "seed-reviewer-1",
    productId: "nike-pegasus",
    userName: "คุณมิ้นท์",
    rating: 5,
    comment: "รองเท้าวิ่งสบายมาก โฟมรองรับดี เหมาะวิ่ง 5-10 กม. สะอาดมากตอนรับมา",
  },
  {
    userId: "seed-reviewer-2",
    productId: "nike-pegasus",
    userName: "คุณบอส",
    rating: 4,
    comment: "น้ำหนักเบา วิ่งสบาย แต่ไซส์ 41 ค่อนข้างแน่นนิดหน่อย แนะนำลองไซส์ใหญ่ขึ้น",
  },
  {
    userId: "seed-reviewer-3",
    productId: "adidas-ultraboost",
    userName: "คุณเจน",
    rating: 5,
    comment: "Boost ตอบสนองดีมาก วิ่งเทรดมิลสบาย ไม่มีกลิ่นเลยตอนรับมา ประทับใจมาก",
  },
  {
    userId: "seed-reviewer-4",
    productId: "adidas-ultraboost",
    userName: "คุณต้น",
    rating: 4,
    comment: "สวมใส่สบาย Primeknit หุ้มเท้าดี เหมาะวิ่ง recovery ราคาเช่าคุ้มค่า",
  },
  {
    userId: "seed-reviewer-5",
    productId: "nb-1080",
    userName: "คุณแพร",
    rating: 5,
    comment: "โฟมนุ่มมาก เหมาะวิ่งระยะยาว สะอาดและบรรจุภัณฑ์ดี จะเช่าอีกแน่นอน",
  },
  {
    userId: "seed-reviewer-6",
    productId: "on-cloudrunner",
    userName: "คุณก้อง",
    rating: 5,
    comment: "เบามาก วิ่งในเมืองสบาย CloudTec รองรับดี แบรนด์ On คุ้มค่ากับราคาเช่า",
  },
  {
    userId: "seed-reviewer-7",
    productId: "on-cloudrunner",
    userName: "คุณนุ้ย",
    rating: 4,
    comment: "ดีไซน์สวย วิ่งสบาย แต่พื้นรองเท้าค่อนข้างแข็งนิดหน่อยสำหรับคนเท้าแบน",
  },
];
