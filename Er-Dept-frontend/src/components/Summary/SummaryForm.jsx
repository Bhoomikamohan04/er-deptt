import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Save, X } from 'lucide-react';

const SummaryForm = ({ patient, onClose }) => {
  const [formData, setFormData] = useState({
    patientName: patient?.name || '',
    consultant: patient?.consultant || '',
    ageGender: patient?.age ? `${patient.age} / ${patient.gender}` : '',
    roomBed: patient?.room_no && patient?.bed_no ? `${patient.room_no} / ${patient.bed_no}` : '',
    mrNo: patient?.mrno || '',
    dateOfAdmission: '',
    dateOfDischarge: new Date().toISOString().split('T')[0],
    phoneNumber: patient?.phone || '',
    department: '',
    finalDiagnosis: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Here you would typically save the data to your backend
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Patient Summary</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Consultant */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Consultant</label>
              <input
                type="text"
                name="consultant"
                value={formData.consultant}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Age/Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age / Gender</label>
              <input
                type="text"
                name="ageGender"
                value={formData.ageGender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 35 / Male"
              />
            </div>

            {/* Room/Bed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Room / Bed</label>
              <input
                type="text"
                name="roomBed"
                value={formData.roomBed}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 101 / 2"
              />
            </div>

            {/* MR No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">MR No</label>
              <input
                type="text"
                name="mrNo"
                value={formData.mrNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date of Admission */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Admission</label>
              <input
                type="date"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date of Discharge */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Discharge</label>
              <input
                type="date"
                name="dateOfDischarge"
                value={formData.dateOfDischarge}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., +91 9876543210"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Surgery">Surgery</option>
                <option value="Gynecology">Gynecology</option>
                <option value="ENT">ENT</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>
          </div>

          {/* Final Diagnosis */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Final Diagnosis</label>
            <textarea
              name="finalDiagnosis"
              value={formData.finalDiagnosis}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter final diagnosis details here..."
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Summary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SummaryForm;
