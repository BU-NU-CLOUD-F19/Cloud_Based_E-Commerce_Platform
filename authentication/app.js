/**
 * This is the starting point of the application.
 * It defines the logic to start the api-server with provided configurations.
 * It's executed by pm2, via ./process.json.
 */

'use strict';

// A server composer for the Hapi server
// https://github.com/hapijs/glue
const Glue = require('@hapi/glue');

// Route registrations for Hapi
const registrationsFactory = require('./registrations');

// Global configuration for the app
const config = require('./src/configs/config');
const logger = require('./src/utils/logger');


module.exports = new Promise(resolve => config.then(async (conf) => {
  const registrations = registrationsFactory(conf);

  const port = process.env.PORT || 3000

  const manifest = {
    server: {
      port,
    },
    register: registrations,
  };

  const options = {
    relativeTo: __dirname,
  };


  const server = await Glue.compose(manifest, options);

  server.auth.strategy('firebase', 'firebase', {
    credential: {
      projectId: 'cloud-based-ecommerce-pl-47e01',
      clientEmail: 'firebase-adminsdk-e9cdr@cloud-based-ecommerce-pl-47e01.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCk40wKHN+AkngT\narGy2MDJDh3RMJiz59se1G5n4KViF0GcaR+oaTJ0ol0pks9ZIe3cKbSF2DyJrx/2\nBrLLXgMkeB0pIAWGf3eNpGW0ajO0rTzK2ptofDgc2t4z2WMKpv0ToEujMBFgt79g\nUPEo+gzp0PRPo4SWcgakllNUZbG/VNxYqSU3ETybisxinhyEsQ+LhOxdJjlVScjP\nIEEqcIjvdWcomsivd2q0hLHD1HRyE+bQ2fZhIn/0Wt/zMBSO8/XMoS7I1a1UHSc5\nY3evNf+ryGhIBF9fzc7sf0aHtQu3V6HahhSlw/h5L75qq1NWBkV8EL73t+JVUm+v\neO1nQTWPAgMBAAECggEACO92Xe/tnrqRPkAgbBg57ktRC1aOV+V/Jt8NMpzmaXfo\nKtE5kXdN8CsiUE/v450mljE+Yqhys2VlnoADbWjlU7McpW9iTUUYFflsN4gv0CE5\nM6cAF/vvUIT92KJ1rwyYl1ku8CN5NZwPh2krgHR4ga08qBos47g/Kukoj+DI7pzU\n3IkQfDWnJNWkJG3RfFni46GV7Q19wvCV4rSJx/uywhdc22ZyYU8hcJ7vWM1zJqKu\nyHUE37Mp/IZAg+W5Y503KIpS4kvNJk0+wDzKvEEev1uVrZGz1/DgvGbLR1uNkHe2\nFNdpAs8ucTCp+NRPS0WhJLbwlOMbAA4byyDFKHsaWQKBgQDZTeeZnCYzT9uLZrUX\nVAN3badbbSE4fXJajyGzcp54aROCyCUdPFFlZz4G1aofwaPZOilcqETXpyzN3mO3\niTIzSGfiIHPnFW1OX97LG+BKsGwWr0kWHfX8rLit0W15WR0pGfUuKiarjeQCsYQ9\nhd+3iXm5I/VnxYEDjlhdNun1OQKBgQDCP+wJS/pmf7UYG7zEl57ofLED5hQCgYi6\nvopJM82vqV6dt58GU7hLKt2lb1nxyUgyjoXU9TtjDYzbG5fCPNH1bJUHjuxtrzb/\nV8RlkjpaBAXIDXozxDASvhkCchoX71iZOLEPQ/05STYY0WNWSOTSVC7qKPvBllVq\ndFdu56CJBwKBgHJ57QFqVmF/t1vHvqzMcIsQ9DJg2jhlNcHpV0qunjc2u7WQ9KRj\nK0otSmrVUqsqGsQMNNAAQUwOYLcPah69IvoLMdbZW9Wn3w6DyN3dEJqoODj3HJyP\nKhBzeVLwWiisPoVxjE1GnVqRBEY6+Dxk80dAICTdgaGqVV3nNjvc+wFZAoGBAMB5\naj6EBGeP3zc2NMNvoUuoUhYU4nrhM0QnDQsfw41te403puE0D4abwOft/+eulFVU\nF5Q+Mkwh3xI0sxkJ/tj6cGj+25KLbSlyI+6pCByto7Todc/Zc/D+X/WmbeiNhvK7\n0+XWbpFW072frJiQvfsS4zGuzlaxyY0kHoaMCOv9AoGBAI/LwhdoGYOKFvI/KOcN\n3mwJNR11etcpO7TPJu0pGuDOzjF8skNOdBXCnSPNfvmTJBgoYF1kJJXUxxYB7Pnn\nH8QITjZ+8Uk3Ojixav7wiFFIv7KtVs14KqKWbQzTzZBev8m6YOZ1mtabqJIbPQ5U\nRg3Rd9BMunHFAcvH0xlZZyLR\n-----END PRIVATE KEY-----\n',
      databaseURL: 'https://cloud-based-ecommerce-pl-47e01.firebaseio.com/'
    }
  });

  return server.start()
    .then(() => logger.info(`Server started at ports: ${port}`));
}));
