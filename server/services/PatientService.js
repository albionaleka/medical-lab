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
}
