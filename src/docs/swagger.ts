import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API Ticket Acara",
    description: "Dokumentasi API untuk aplikasi manajemen tiket acara.",
  },
  servers: [
    {
      url: "http://localhost:3003/api",
      description: "Local Server",
    },
    {
      url: "https://ticket-backend-nu.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "anggyar",
        password: "12341234",
      },
      RegisterRequest: {
        fullName: "Gian gain",
        username: "Gian2002",
        email: "gian2002@yopmail.com",
        password: "aeonDisk98!",
        confirmPassword: "aeonDisk98!",
      },
      ActivationRequest: {
        code: "abcde",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
