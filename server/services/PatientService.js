import { Patient } from "../models/Patient.js";
import TestResult from "../models/TestResult.js";
import TestResultValues from "../models/TestResultValues.js";

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

  static async deletePatient(patientId) {
    const patient = await Patient.findByPk(patientId, {
      include: [
        { association: "testResults", include: [{ association: "values" }] },
      ],
    });
    if (!patient) {
      throw new Error("Patient not found");
    }

    if (patient.testResults && patient.testResults.length > 0) {
      for (const testResult of patient.testResults) {
        if (testResult.values && testResult.values.length > 0) {
          await Promise.all(testResult.values.map((value) => value.destroy()));
        }
        await testResult.destroy();
      }
    }

    await patient.destroy();
    return true;
  }
}
