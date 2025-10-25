import React from 'react';
import { Phone, MapPin, CreditCard } from 'lucide-react';

const PatientDetails = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-medium">Full Name</label>
            <p className="text-slate-900 font-medium">{patient.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium">MR Number</label>
            <p className="text-slate-900 font-medium">{patient.mrno || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium">Age/Gender</label>
            <p className="text-slate-900 font-medium">
              {patient.age || 'N/A'} {patient.gender ? `• ${patient.gender}` : ''}
            </p>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium">Date of Birth</label>
            <p className="text-slate-900 font-medium">{patient.dob || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <p className="text-slate-900 font-medium">{patient.phone || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Address
            </label>
            <p className="text-slate-900 font-medium">
              {patient.address || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Identification */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
          Identification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Aadhaar Number
            </label>
            <p className="text-slate-900 font-medium">
              {patient.aadhaar ? 
                patient.aadhaar.replace(/(\d{4})(?=\d)/g, '$1 ') : 
                'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
