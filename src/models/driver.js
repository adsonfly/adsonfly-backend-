import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    vehicleRegNo: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      trim: true,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Please provide a valid vehicle registration number'],
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    documents: {
      license: {
        type: String,
        required: [true, 'License number is required'],
        trim: true,
        match: [/^[A-Z]{2}[0-9]{13}$/, 'Please provide a valid license number'],
      },
      vehicleRC: {
        type: String,
        required: [true, 'Vehicle RC number is required'],
        trim: true,
        match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Please provide a valid vehicle RC number'],
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Hash password before saving
DriverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
DriverSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from the response
DriverSchema.methods.toJSON = function () {
  const driver = this.toObject();
  delete driver.password;
  delete driver.__v;
  return driver;
};

const Driver = mongoose.model('Driver', DriverSchema);

export default Driver;