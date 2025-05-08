import axios from 'axios';

// Supabase konfiguratsiyasi
const SUPABASE_URL = 'https://ovffwluegmjrpeoqclrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZmZ3bHVlZ21qcnBlb3FjbHJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDk2MzUsImV4cCI6MjA2MjE4NTYzNX0.gh0JuqEdToEEPMRUiNhsDSdIpNhczL9V27kdOdglrgw';

const supabaseAxios = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apiKey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Foydalanuvchini ro'yxatdan o'tkazish
 * @param name Foydalanuvchi ismi
 * @param email Foydalanuvchi emaili
 * @param password Foydalanuvchi paroli
 * @param role Foydalanuvchi roli (teacher yoki pupil)
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const allowedRoles = ['teacher', 'pupil'];

  if (!allowedRoles.includes(role)) {
    throw new Error("Noto‘g‘ri role tanlandi. Faqat 'teacher' yoki 'pupil' bo‘lishi mumkin.");
  }

  try {
    const response = await supabaseAxios.post('/users', {
      name,
      email,
      password,
      role,
    });

    if (response.status !== 201) {
      throw new Error('Ro‘yxatdan o‘tishda xato yuz berdi!');
    }

    return response.data;
  } catch (error: any) {

    // Supabase'dan kelgan xabarni foydalanuvchiga aniqroq chiqaring
    const errMsg = error.response?.data?.message || 'Serverda xatolik yuz berdi.';
    throw new Error(`Ro‘yxatdan o‘tishda xatolik: ${errMsg}`);
  }
};


/**
 * Foydalanuvchini tizimga kiritish
 * @param email Foydalanuvchi emaili
 * @param password Foydalanuvchi paroli
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await supabaseAxios.get('/users', {
      params: {
        email: `eq.${email}`,
        password: `eq.${password}`,
      }
    });

    if (response.data.length === 0) {
      throw new Error('Foydalanuvchi topilmadi yoki parol noto‘g‘ri');
    }

    return response.data[0];
  } catch (error: any) {

    throw new Error(error.message || 'Tizimga kirishda xatolik yuz berdi');
  }
};


// services/groupService.ts

export async function getTeacherGroups(teacherId: string) {
  try {
    const response = await supabaseAxios.get(`/groups?teacher_id=eq.${teacherId}`);

    if (response.data.length === 0) {
      throw new Error("Bu o'qituvchida hali guruhlar yo'q, guruhlarni yarating");
    }


    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Tizimga kirishda xatolik yuz berdi');
  }

}
export const getGroupStudents = async (groupId: string) => {
  try {
    // Supabase REST API orqali so'rov yuborish
    const response = await supabaseAxios.get('/group_students', {
      params: {
        select: 'users(*)', // Bu yerda `users` jadvalidan faqat `name` ustuni olinadi
        group_id: `eq.${groupId}`, // Guruhni filtrlash
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Guruhda hech qanday o'quvchi topilmadi");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Guruh o‘quvchilarini olishda xatolik yuz berdi');
  }
};

export const createStudentAndAddToGroup = async (studentData: any, groupId: any) => {
  try {
    const studentResponse = await supabaseAxios.post("/users", {
      name: studentData.name,
      email: studentData.email,
      password: studentData.password,
      role: "student",
    });

    console.log("Student Response Data:", studentResponse.data);

    let studentId = studentResponse.data?.id || studentResponse.data?.[0]?.id;

    if (!studentId) {
      const student = await supabaseAxios.get(`/users`, {
        params: {
          select: "id",
          email: `eq.${studentData.email}`,
        },
      });
      studentId = student.data?.[0]?.id;
    }

    console.log("Yaratilgan Student ID:", studentId);

    // Studentni guruhga qo'shish
    const groupResponse = await supabaseAxios.post("/group_students", {
      group_id: groupId, // eq. olib tashlandi
      student_id: studentId, // eq. olib tashlandi
    });

    console.log("Group Response:", groupResponse.data);

    if (!groupResponse) {
      throw new Error("Guruhga studentni qo'shishda xatolik yuz berdi");
    }

    return {
      student: studentResponse.data,
      group: groupResponse.data,
    };
  } catch (error: any) {
    console.error("Xatolik:", error?.response?.data || error.message);
    throw new Error(error?.message || "Xatolik yuz berdi");
  }
};

export const deleteStudent = async (studentId: string) => {
  try {
    const userDeleteResponse = await supabaseAxios.delete(`/users?id=eq.${studentId}`);
    console.log("User Delete Response:", userDeleteResponse.data);

    const groupStudentsDeleteResponse = await supabaseAxios.delete(`/group_students?student_id=eq.${studentId}`);
    console.log("Group Students Delete Response:", groupStudentsDeleteResponse.data);



    console.log("Foydalanuvchi muvaffaqiyatli o'chirildi:", studentId);
  } catch (error: any) {
    console.error("Xatolik:", error.message);
    throw new Error(error.message || "Xatolik yuz berdi");
  }
};

export const createTeacherGroup = async (teacherId: string, groupName: string) => {
  try {
    const response = await supabaseAxios.post("/groups", {
      teacher_id: teacherId, // O'qituvchini biriktirish uchun ID
      name: groupName, // Guruh nomi
    });

    console.log("🚀 Guruh yaratildi:", response.data);
    return response.data; // API javobini qaytarish
  } catch (error) {
    console.error("Guruh yaratishda xatolik yuz berdi:", error);
    throw error; // Xatoni tashlash
  }
};