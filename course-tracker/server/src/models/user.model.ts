// server/src/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Описываем интерфейс для нашего документа User (для TypeScript)
//
// 🔻🔻🔻 ВОТ САМАЯ ВАЖНАЯ СТРОЧКА 🔻🔻🔻
export interface IUser extends Document {
  // ----------------------------------------------------
  // 'extends Document' - это то, что дает нам ._id
  // ----------------------------------------------------
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string; // '?' - т.к. мы его не всегда будем выбирать

  // Также добавляем наш кастомный метод, чтобы TypeScript "знал" о нем
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// Создаем Схему
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    next(new Error('Error hashing password'));
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔻🔻🔻 И ВОТ ВТОРАЯ ВАЖНАЯ СТРОЧКА 🔻🔻🔻
// Мы "связываем" нашу Модель с интерфейсом IUser
const User = mongoose.model<IUser>('User', UserSchema);
// ----------------------------------------------------

export default User;