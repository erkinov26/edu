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
};

/**
 * Foydalanuvchini tizimga kiritish
 * @param email Foydalanuvchi emaili
 * @param password Foydalanuvchi paroli
 */
export const loginUser = async (email: string, password: string) => {
  const response = await supabaseAxios.get('/users', {
    params: {
      email: `eq.${email}`, // To'g'ri formatda filter
      password: `eq.${password}`, // Parolni to'g'ri formatda yuborish
    },
  });

  if (response.data.length === 0) {
    throw new Error('Email yoki parol noto\'g\'ri!');
  }

  return response.data[0]; // Foydalanuvchi ma'lumotlari
};