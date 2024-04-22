const yup = require("yup");

const advancedSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Username must be at least 3 characters long")
    .required("Username is required"),
  gender: yup
    .string()
    .oneOf(["female", "male", "other"], "Invalid gender type")
    .required("Gender is required"),
  studentNo: yup
    .string()
    .matches(/^23\d+$/, "Valid Student No")
    .typeError("Student number must be a number")
    .required("Student number is required"),
  section: yup
    .string()
    .oneOf(
      [
        "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10",
        "s11", "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19", "s20", "s21"
      ],
      "Invalid section type"
    )
    .required("Section is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .test(
      "is-positive",
      "Phone number must be positive",
      (value) => parseInt(value) > 0
    )
    .required("Phone number is required"),
     emailAddress: yup
    .string()
    .email("Please enter a valid email")
    .test(
        "is-correct-email",
        "Email address must end with @akgec.ac.in",
        function (value) {
            const studentNo = this.parent?.studentNo; // Access studentNo safely
            if (value && studentNo) {
                return value.endsWith(`${studentNo}@akgec.ac.in`);
            }
            return false;
        }
    )
    .required("Email address is required"),
  scholarType: yup
    .string()
    .oneOf(["hosteller", "Day scholar"], "Invalid scholar type")
    .required("Scholar type is required"),
  referenceNumber: yup
    .string()
    .matches(/^\d+$/, "Enter a valid reference number")
    .required("Reference number is required"),
  captcha: yup.string()
});

module.exports = { advancedSchema };

