import { User } from "./User.js";
import { Profile } from "./Profile.js";
import { Patient } from "./Patient.js";
import TestCategory from "./TestCategory.js";
import TestPanel from "./TestPanel.js";
import TestParameter from "./TestParameter.js";
import ReferenceRanges from "./ReferenceRanges.js";
import TestResult from "./TestResult.js";
import TestResultValues from "./TestResultValues.js";

User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

TestCategory.hasMany(TestPanel, { foreignKey: "categoryId", as: "panels" });
TestPanel.belongsTo(TestCategory, { foreignKey: "categoryId", as: "category" });

TestPanel.hasMany(TestParameter, { foreignKey: "panelId", as: "parameters" });
TestParameter.belongsTo(TestPanel, { foreignKey: "panelId", as: "panel" });

TestParameter.hasMany(ReferenceRanges, {
    foreignKey: "parameterId",
    as: "referenceRanges",
});
ReferenceRanges.belongsTo(TestParameter, {
    foreignKey: "parameterId",
    as: "parameter",
});

Patient.hasMany(TestResult, { foreignKey: "patientId", as: "testResults" });
TestResult.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

TestPanel.hasMany(TestResult, { foreignKey: "panelId", as: "results" });
TestResult.belongsTo(TestPanel, { foreignKey: "panelId", as: "panel" });

TestResult.hasMany(TestResultValues, {
    foreignKey: "testResultId",
    as: "values",
});
TestResultValues.belongsTo(TestResult, {
    foreignKey: "testResultId",
    as: "testResult",
});

TestParameter.hasMany(TestResultValues, {
    foreignKey: "parameterId",
    as: "resultValues",
});
TestResultValues.belongsTo(TestParameter, {
    foreignKey: "parameterId",
    as: "parameter",
});

export {
    User,
    Profile,
    Patient,
    TestCategory,
    TestPanel,
    TestParameter,
    ReferenceRanges,
    TestResult,
    TestResultValues,
};

