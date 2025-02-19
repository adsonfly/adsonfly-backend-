import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    phone: { 
      type: String, 
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    email: { 
      type: String, 
      trim: true, 
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    vehicleRegNo: { 
      type: String, 
      required: [true, 'Vehicle registration number is required'],
      trim: true,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Invalid vehicle registration format']
    },
    profilePicture: { 
      type: String, 
      trim: true 
    },
    documents: {
      license: { 
        url: { 
          type: String, 
          required: [true, 'License URL is required'] 
        },
        verified: { 
          type: Boolean, 
          default: false 
        }
      },
      vehicleRC: { 
        url: { 
          type: String, 
          required: [true, 'Vehicle RC URL is required'] 
        },
        verified: { 
          type: Boolean, 
          default: false 
        }
      }
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending' 
    },
    rejectionReason: { 
      type: String, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'], 
      minlength: [8, 'Password must be at least 8 characters long']
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Removed password hashing middleware and comparePassword method.

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
