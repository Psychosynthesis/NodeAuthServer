import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    // await User.findOne({ username: username }).select('+password'); — "+" = allow select hidden field
    password: {
      type: String,
      required: true,
      select: false
    },
    sessionStart: {
      type: Number, // Microseconds - new Date().getTime()
      required: false,
      default: 0,
    },
    loginAttempt: {
      type: Number,
      required: false,
      default: 0,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      required: true
    }
  },
  {
    timestamps: true
  }
)


userSchema.methods.isLogged = function() {
  const user = this.model('User').findOne({ username: this.username });
  const loginTime = new Date(user.sessionStart).getTime();
  const currentTime = new Date().getTime();
  const sessionInactive = new Date(user.sessionStart).getTime() === 0 || (currentTime - loginTime) > 3600000;
  return !sessionInactive;
};

export const User = model('User', userSchema);

export const getUserById = async (userId) => await User.findById(userId).select('id as userId username email role');
export const getUserByUsername = async (username) => await User.findOne({ username: username });
// export const getUserByUsernameOrEmail = async (username, email) => await User.find({ $or: [{ username }, { email }] })
