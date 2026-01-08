import { Patient } from "../models/Patient.js";

export class PatientService {
  static async createPatient(patientData) {
    const {
      personalNumber,
      firstName,
      lastName,
      birthday,
      gender,
      phone,
      email,
    } = patientData;

    const newPatient = await Patient.create({
      personalNumber,
      firstName,
      lastName,
      birthday,
      gender,
      phone,
      email,
    });

    return newPatient;
  }

  static async getPatientById(patientId) {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }

  static async getAllPatients() {
    const patients = await Patient.findAll();
    return patients;
  }

  static async updatePatient(patientId, updateData) {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }

    await patient.update(updateData);
    return patient;
  }
}
